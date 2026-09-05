/**
 * DealFlow360 - Graceful Fallback Engine (JavaScript Edition)
 * Phase 1: Core Domain Entities
 * 
 * Implements "Last Approved Best Offer" fallback logic. When higher-tier approvers
 * (e.g. Finance) reject an aggressive counter-offer or deep discount, the quotation
 * cleanly reverts to the previously authorized terms rather than terminating into churn.
 */

export class FallbackEngine {
  /**
   * Captures an immutable snapshot of an approved quotation state to serve
   * as the guaranteed fallback terms if future escalations or counter-offers fail.
   * @param {Object} quotation
   * @param {string} approverRole
   * @param {string} approverName
   * @param {string} reason
   * @returns {Object} FallbackSnapshot
   */
  static captureSnapshot(quotation, approverRole, approverName, reason) {
    const lines = quotation.lines || [];
    const totalLineSubtotal = lines.reduce((sum, l) => sum + (l.quantity * l.unitListPriceCents), 0);
    const totalLineNet = lines.reduce((sum, l) => sum + l.lineSubtotalCents, 0);
    const avgDiscountPct = totalLineSubtotal > 0
      ? Math.round(((totalLineSubtotal - totalLineNet) / totalLineSubtotal) * 100)
      : 0;

    return {
      snapshotId: `snap-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      quotationId: quotation.id,
      approvedDiscountPct: avgDiscountPct,
      approvedIncentiveCents: quotation.incentiveTotalCents || 0,
      approvedSubtotalCents: quotation.subtotalCents,
      approvedNetTotalCents: quotation.netTotalCents,
      approvedMarginPct: quotation.grossMarginPct,
      approverRole,
      approverName,
      reason,
      lines: JSON.parse(JSON.stringify(lines)),
      approvedAt: new Date().toISOString(),
    };
  }

  /**
   * Gracefully reverts a rejected escalated quotation to the Last Approved Best Offer.
   * If a snapshot exists, restores pricing, logs the event, and makes quote actionable for the customer.
   * @param {Object} quotation
   * @param {string} rejecterRole
   * @param {string} rejecterName
   * @param {string} rejectionReason
   * @returns {Object} FallbackReversionResult
   */
  static revertToLastApprovedOffer(
    quotation,
    rejecterRole,
    rejecterName,
    rejectionReason
  ) {
    const snapshot = quotation.fallbackSnapshot;

    if (!quotation.approvalChain) {
      quotation.approvalChain = [];
    }

    if (!snapshot) {
      // No fallback snapshot available; quotation must mark as rejected
      quotation.status = 'Rejected';
      quotation.approvalChain.push({
        id: `app-${Date.now()}`,
        quotationId: quotation.id,
        approverRole: rejecterRole,
        approverName: rejecterName,
        action: 'Rejected',
        discountPct: 0,
        incentiveCents: 0,
        comments: `Rejected by ${rejecterRole}: ${rejectionReason}. No prior approved fallback terms were recorded.`,
        timestamp: new Date().toISOString(),
      });
      quotation.updatedAt = new Date().toISOString();

      return {
        quotation,
        reverted: false,
        explanation: `Quotation rejected. No previous approved fallback offer on record.`,
      };
    }

    // Restore line items from snapshot if available, or restore discounts proportionally
    if (snapshot.lines && Array.isArray(snapshot.lines) && snapshot.lines.length > 0) {
      quotation.lines = JSON.parse(JSON.stringify(snapshot.lines));
    } else {
      for (const line of (quotation.lines || [])) {
        line.discountPct = snapshot.approvedDiscountPct;
        line.discountAmountCents = Math.round(line.unitListPriceCents * (line.discountPct / 100));
        line.netUnitPriceCents = line.unitListPriceCents - line.discountAmountCents;
        line.lineSubtotalCents = line.netUnitPriceCents * line.quantity;
        line.lineCostCents = line.unitCostPriceCents * line.quantity;
        line.grossMarginCents = line.lineSubtotalCents - line.lineCostCents;
        line.grossMarginPct = line.lineSubtotalCents > 0
          ? Math.round(((line.grossMarginCents / line.lineSubtotalCents) * 100) * 10) / 10
          : 0;
      }
    }

    // Restore totals
    quotation.subtotalCents = snapshot.approvedSubtotalCents;
    quotation.incentiveTotalCents = snapshot.approvedIncentiveCents;
    quotation.netTotalCents = snapshot.approvedNetTotalCents;
    quotation.grossMarginPct = snapshot.approvedMarginPct;
    quotation.status = 'Approved'; // Reverted to active approved offer for 1-click buyer confirmation
    quotation.escalationTier = snapshot.approverRole === 'Finance' ? 'Finance' : 'SalesManager';

    const fallbackExplanation = 
      `${rejecterRole} rejected the escalated counter-request ("${rejectionReason}"). ` +
      `System activated graceful fallback: Reverted to the last approved best offer (${snapshot.approvedDiscountPct}% discount authorized by ${snapshot.approverRole}). ` +
      `Quote is now unlocked for immediate 1-click customer confirmation.`;

    // Append audit log
    quotation.approvalChain.push({
      id: `app-${Date.now()}`,
      quotationId: quotation.id,
      approverRole: rejecterRole,
      approverName: rejecterName,
      action: 'FallbackReverted',
      discountPct: snapshot.approvedDiscountPct,
      incentiveCents: snapshot.approvedIncentiveCents,
      comments: fallbackExplanation,
      timestamp: new Date().toISOString(),
    });

    quotation.updatedAt = new Date().toISOString();

    return {
      quotation,
      reverted: true,
      explanation: fallbackExplanation,
      fallbackSnapshot: snapshot,
    };
  }
}
