/**
 * DealFlow360 - Real-Time Quotation Event Broadcaster
 * Phase 4: Real-Time Collaboration Gateway
 * 
 * Standardized event egress adapter that connects domain mutations and service lifecycle
 * transitions to the WebSocket ChannelManager. Sanitizes payloads and routes events to the
 * proper role-guarded topics.
 */

export class EventBroadcaster {
  /**
   * @param {import('./channel-manager.js').ChannelManager} channelManager
   */
  constructor(channelManager) {
    this.channelManager = channelManager;
  }

  /**
   * Broadcasts real-time quote mutation events (line added, updated, removed, totals changed).
   * @param {Object} quotation
   * @param {string} [action="MUTATED"]
   * @param {Object} [metadata={}]
   */
  emitQuoteUpdated(quotation, action = "MUTATED", metadata = {}) {
    if (!quotation || !quotation.id) return;

    const event = {
      type: "QUOTE_UPDATED",
      action,
      quoteId: quotation.id,
      quoteNumber: quotation.quoteNumber,
      customerId: quotation.customerId,
      version: quotation.version,
      status: quotation.status,
      netTotalCents: quotation.netTotalCents,
      grossMarginPct: quotation.grossMarginPct,
      linesCount: (quotation.lines || []).length,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    // 1. Deliver to all clients currently viewing this quote
    this.channelManager.broadcast(`quotation:${quotation.id}`, event);

    // 2. Deliver lightweight notification to the customer's private feed
    if (quotation.customerId) {
      this.channelManager.broadcast(`customer:${quotation.customerId}`, {
        type: "CUSTOMER_QUOTE_UPDATED",
        quoteId: quotation.id,
        quoteNumber: quotation.quoteNumber,
        status: quotation.status,
        netTotalCents: quotation.netTotalCents,
        version: quotation.version,
        timestamp: event.timestamp,
      });
    }
  }

  /**
   * Broadcasts approval escalation alerts to managers and finance controllers.
   * @param {Object} quotation
   * @param {Object} assessment
   */
  emitApprovalRequired(quotation, assessment = {}) {
    if (!quotation || !quotation.id) return;

    const event = {
      type: "APPROVAL_REQUIRED",
      quoteId: quotation.id,
      quoteNumber: quotation.quoteNumber,
      customerId: quotation.customerId,
      version: quotation.version,
      requiredTier: assessment.requiredTier || quotation.requiredApprovalTier || "SalesManager",
      dealMarginPct: assessment.dealMarginPct != null ? assessment.dealMarginPct : quotation.grossMarginPct,
      maxLineDiscountPct: assessment.maxLineDiscountPct || 0,
      escalationReason: assessment.escalationReason || "Discount exceeds representative authority ceiling.",
      netTotalCents: quotation.netTotalCents,
      timestamp: new Date().toISOString(),
    };

    // Broadcast to the quote viewers
    this.channelManager.broadcast(`quotation:${quotation.id}`, event);

    // Broadcast to Manager escalation inbox
    this.channelManager.broadcast("role:manager", event);

    // If escalated all the way to Finance, also alert Finance queue
    if (event.requiredTier === "Finance") {
      this.channelManager.broadcast("role:finance", event);
    }
  }

  /**
   * Broadcasts approval authorization events when a manager or finance approves terms.
   * @param {Object} quotation
   * @param {Object} [approverDetails={}]
   */
  emitApprovalGranted(quotation, approverDetails = {}) {
    if (!quotation || !quotation.id) return;

    const event = {
      type: "APPROVAL_GRANTED",
      quoteId: quotation.id,
      quoteNumber: quotation.quoteNumber,
      version: quotation.version,
      status: "Approved",
      netTotalCents: quotation.netTotalCents,
      grossMarginPct: quotation.grossMarginPct,
      approverRole: approverDetails.approverRole || "SalesManager",
      approverName: approverDetails.approverName || "Management",
      timestamp: new Date().toISOString(),
    };

    this.channelManager.broadcast(`quotation:${quotation.id}`, event);

    if (quotation.customerId) {
      this.channelManager.broadcast(`customer:${quotation.customerId}`, {
        type: "CUSTOMER_QUOTE_APPROVED",
        quoteId: quotation.id,
        quoteNumber: quotation.quoteNumber,
        netTotalCents: quotation.netTotalCents,
        timestamp: event.timestamp,
      });
    }
  }

  /**
   * Broadcasts customer counter-offer submissions to sales reps and managers.
   * @param {Object} quotation
   * @param {Object} counterDetails
   */
  emitCounterOffer(quotation, counterDetails = {}) {
    if (!quotation || !quotation.id) return;

    const event = {
      type: "COUNTER_OFFER_RECEIVED",
      quoteId: quotation.id,
      quoteNumber: quotation.quoteNumber,
      version: quotation.version,
      status: quotation.status,
      requestedDiscountPct: counterDetails.counterDiscountPct,
      previousDiscountPct: counterDetails.previousDiscountPct,
      newNetTotalCents: quotation.netTotalCents,
      newMarginPct: quotation.grossMarginPct,
      note: counterDetails.note || "",
      timestamp: new Date().toISOString(),
    };

    this.channelManager.broadcast(`quotation:${quotation.id}`, event);
    this.channelManager.broadcast("role:manager", event);
  }

  /**
   * Broadcasts graceful fallback reversion when an escalated proposal is rejected.
   * @param {Object} quotation
   * @param {Object} [snapshot={}]
   */
  emitFallbackReverted(quotation, snapshot = {}) {
    if (!quotation || !quotation.id) return;

    const event = {
      type: "FALLBACK_REVERTED",
      quoteId: quotation.id,
      quoteNumber: quotation.quoteNumber,
      version: quotation.version,
      status: quotation.status,
      revertedToLastApproved: true,
      restoredNetTotalCents: quotation.netTotalCents,
      restoredMarginPct: quotation.grossMarginPct,
      approverRole: snapshot.approverRole || "Previous Authority",
      message: "Rejected counter-offer has gracefully reverted to the last approved best offer.",
      timestamp: new Date().toISOString(),
    };

    this.channelManager.broadcast(`quotation:${quotation.id}`, event);

    if (quotation.customerId) {
      this.channelManager.broadcast(`customer:${quotation.customerId}`, {
        type: "CUSTOMER_QUOTE_REVERTED",
        quoteId: quotation.id,
        quoteNumber: quotation.quoteNumber,
        netTotalCents: quotation.netTotalCents,
        timestamp: event.timestamp,
      });
    }
  }

  /**
   * Broadcasts 1-click binding customer confirmation events.
   * @param {Object} quotation
   */
  emitQuoteConfirmed(quotation) {
    if (!quotation || !quotation.id) return;

    const event = {
      type: "QUOTE_CONFIRMED",
      quoteId: quotation.id,
      quoteNumber: quotation.quoteNumber,
      version: quotation.version,
      status: "Confirmed",
      netTotalCents: quotation.netTotalCents,
      confirmedAt: quotation.confirmedAt || new Date().toISOString(),
      timestamp: new Date().toISOString(),
    };

    this.channelManager.broadcast(`quotation:${quotation.id}`, event);
    this.channelManager.broadcast("role:manager", event);
  }

  /**
   * Broadcasts real-time commercial chat messages on a quote.
   * @param {Object} messageRecord
   */
  emitChatMessage(messageRecord) {
    if (!messageRecord || !messageRecord.quotationId) return;

    const event = {
      type: "CHAT_MESSAGE",
      id: messageRecord.id,
      quoteId: messageRecord.quotationId,
      senderId: messageRecord.senderId,
      senderRole: messageRecord.senderRole,
      senderName: messageRecord.senderName || messageRecord.senderRole,
      message: messageRecord.message,
      quoteVersion: messageRecord.quoteVersion,
      sentAt: messageRecord.sentAt || new Date().toISOString(),
    };

    this.channelManager.broadcast(`quotation:${messageRecord.quotationId}`, event);
  }
}
