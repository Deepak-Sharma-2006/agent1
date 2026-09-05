/**
 * DealFlow360 - Escalation & Authorization Engine (JavaScript Edition)
 * Phase 1: Core Domain Entities
 * 
 * Enforces hard negotiation caps per tier (Rep <= 10%, Manager <= 20%, Finance <= 35%)
 * with minimum gross profit margin floor (>= 18%).
 * Eliminates Executive VP: Finance acts as the apex fiscal authority.
 */

export class EscalationEngine {
  // Hard Discretionary Discount Limits
  static SALES_REP_MAX_DISCOUNT_PCT = 10;
  static SALES_REP_MAX_REBATE_CENTS = 0;

  static SALES_MANAGER_MAX_DISCOUNT_PCT = 20;
  static SALES_MANAGER_MAX_REBATE_CENTS = 500000; // $5,000.00

  static FINANCE_MAX_DISCOUNT_PCT = 35;
  static MINIMUM_MARGIN_FLOOR_PCT = 18.0; // 18% hard margin floor

  /**
   * Computes the Blended Risk Score for a quotation across all line items and customer tier.
   * @param {Object} quotation
   * @param {Object} customer
   * @param {Array} rules
   * @returns {number}
   */
  static computeBlendedRiskScore(quotation, customer, rules) {
    let totalRiskPoints = 0;

    // Build lookup for category rules
    const ruleMap = new Map((rules || []).map(r => [r.category, r]));

    // Customer tier sensitivity weight
    let tierRiskMultiplier = 1.0;
    if (customer.tier === 'Platinum' || customer.tier === 'Gold') {
      tierRiskMultiplier = 0.8; // Established trust reduces risk sensitivity
    } else if (customer.tier === 'Bronze' || (customer.maxOverdueDays || 0) > 15 || (customer.defaultCount || 0) > 0) {
      tierRiskMultiplier = 1.4; // Untrusted or degraded accounts have higher risk multiplier
    }

    for (const line of (quotation.lines || [])) {
      const rule = ruleMap.get(line.category);
      const standardCeiling = rule ? (rule.tierCeilings?.[customer.tier] ?? rule.standardCeilingPct) : 10;

      if (line.discountPct > standardCeiling) {
        const excessDiscount = line.discountPct - standardCeiling;
        // Risk points scale linearly with excess discount percentage and line revenue weight
        const lineWeight = quotation.subtotalCents > 0 ? (line.lineSubtotalCents / quotation.subtotalCents) : 1.0;
        totalRiskPoints += excessDiscount * lineWeight;
      }
    }

    // Margin penalty: If gross margin < 25%, add progressive risk points
    if (quotation.grossMarginPct < 25.0) {
      totalRiskPoints += (25.0 - quotation.grossMarginPct) * 1.0;
    }

    const finalScore = Math.round(totalRiskPoints * tierRiskMultiplier);
    return Math.max(0, finalScore);
  }

  /**
   * Assesses a quotation against role negotiation caps, blended risk, and margin floors.
   * @param {Object} quotation
   * @param {Object} customer
   * @param {Array} rules
   * @returns {Object} EscalationAssessment
   */
  static assessEscalation(quotation, customer, rules) {
    const violations = [];
    const blendedRiskScore = this.computeBlendedRiskScore(quotation, customer, rules);
    
    // Check maximum line discount in the quote
    const maxLineDiscountPct = (quotation.lines && quotation.lines.length > 0)
      ? Math.max(...quotation.lines.map(l => l.discountPct))
      : 0;

    const requestedRebateCents = quotation.incentiveTotalCents || 0;
    const dealMarginPct = quotation.grossMarginPct || 0;

    // 1. HARD BLOCKS (Finance Apex Boundary)
    if (maxLineDiscountPct > this.FINANCE_MAX_DISCOUNT_PCT) {
      return {
        currentTier: quotation.escalationTier,
        requiredTier: 'Finance',
        isEscalationRequired: true,
        blendedRiskScore,
        isHardBlocked: true,
        blockReason: `Hard Block: Maximum line discount of ${maxLineDiscountPct}% exceeds system ceiling of ${this.FINANCE_MAX_DISCOUNT_PCT}%. Commercial policy prohibits execution.`,
        violations: [`Discount ${maxLineDiscountPct}% > ${this.FINANCE_MAX_DISCOUNT_PCT}% absolute ceiling`],
        maxAuthorizedDiscountPct: this.FINANCE_MAX_DISCOUNT_PCT,
        maxAuthorizedRebateCents: Number.MAX_SAFE_INTEGER,
      };
    }

    if (dealMarginPct < this.MINIMUM_MARGIN_FLOOR_PCT) {
      return {
        currentTier: quotation.escalationTier,
        requiredTier: 'Finance',
        isEscalationRequired: true,
        blendedRiskScore,
        isHardBlocked: true,
        blockReason: `Hard Block: Net gross margin of ${dealMarginPct.toFixed(1)}% breaches mandatory fiscal floor of ${this.MINIMUM_MARGIN_FLOOR_PCT}%. Commercial transaction is prohibited.`,
        violations: [`Deal margin ${dealMarginPct.toFixed(1)}% < ${this.MINIMUM_MARGIN_FLOOR_PCT}% floor`],
        maxAuthorizedDiscountPct: this.FINANCE_MAX_DISCOUNT_PCT,
        maxAuthorizedRebateCents: Number.MAX_SAFE_INTEGER,
      };
    }

    // 2. FINANCE TIER ESCALATION
    // Required if: Discount > 20%, OR Rebate > $5,000, OR Blended Risk Score > 20
    if (
      maxLineDiscountPct > this.SALES_MANAGER_MAX_DISCOUNT_PCT ||
      requestedRebateCents > this.SALES_MANAGER_MAX_REBATE_CENTS ||
      blendedRiskScore > 20
    ) {
      if (maxLineDiscountPct > this.SALES_MANAGER_MAX_DISCOUNT_PCT) {
        violations.push(`Discount of ${maxLineDiscountPct}% exceeds Sales Manager discretionary cap (${this.SALES_MANAGER_MAX_DISCOUNT_PCT}%).`);
      }
      if (requestedRebateCents > this.SALES_MANAGER_MAX_REBATE_CENTS) {
        violations.push(`Rebate of $${(requestedRebateCents / 100).toFixed(2)} exceeds Sales Manager limit ($5,000.00).`);
      }
      if (blendedRiskScore > 20) {
        violations.push(`Blended Risk Score (${blendedRiskScore}) requires executive Finance oversight.`);
      }

      return {
        currentTier: quotation.escalationTier,
        requiredTier: 'Finance',
        isEscalationRequired: quotation.escalationTier !== 'Finance',
        blendedRiskScore,
        isHardBlocked: false,
        violations,
        maxAuthorizedDiscountPct: this.FINANCE_MAX_DISCOUNT_PCT,
        maxAuthorizedRebateCents: Number.MAX_SAFE_INTEGER,
      };
    }

    // 3. SALES MANAGER TIER ESCALATION
    // Required if: Discount > 10%, OR Rebate > $0, OR Blended Risk Score > 0
    if (
      maxLineDiscountPct > this.SALES_REP_MAX_DISCOUNT_PCT ||
      requestedRebateCents > this.SALES_REP_MAX_REBATE_CENTS ||
      blendedRiskScore > 0
    ) {
      if (maxLineDiscountPct > this.SALES_REP_MAX_DISCOUNT_PCT) {
        violations.push(`Discount of ${maxLineDiscountPct}% exceeds Sales Rep discretionary cap (${this.SALES_REP_MAX_DISCOUNT_PCT}%).`);
      }
      if (requestedRebateCents > this.SALES_REP_MAX_REBATE_CENTS) {
        violations.push(`Discretionary rebate requested ($${(requestedRebateCents / 100).toFixed(2)}).`);
      }
      if (blendedRiskScore > 0) {
        violations.push(`Blended Risk Score (${blendedRiskScore}) exceeds zero-risk threshold.`);
      }

      return {
        currentTier: quotation.escalationTier,
        requiredTier: 'SalesManager',
        isEscalationRequired: quotation.escalationTier === 'SalesRep',
        blendedRiskScore,
        isHardBlocked: false,
        violations,
        maxAuthorizedDiscountPct: this.SALES_MANAGER_MAX_DISCOUNT_PCT,
        maxAuthorizedRebateCents: this.SALES_MANAGER_MAX_REBATE_CENTS,
      };
    }

    // 4. SALES REP TIER (Zero violations, self-authorized)
    return {
      currentTier: quotation.escalationTier,
      requiredTier: 'SalesRep',
      isEscalationRequired: false,
      blendedRiskScore: 0,
      isHardBlocked: false,
      violations: [],
      maxAuthorizedDiscountPct: this.SALES_REP_MAX_DISCOUNT_PCT,
      maxAuthorizedRebateCents: this.SALES_REP_MAX_REBATE_CENTS,
    };
  }
}
