/**
 * DealFlow360 - Admin Historical Condition-Based Incentive Engine (JavaScript Edition)
 * Phase 1: Core Domain Entities
 * 
 * Evaluates Admin-configured incentive and rebate rules requiring customer
 * historical order logs (e.g. Volume Spikes, Milestone Loyalty, Bundled Care).
 * Provides Manager negotiation assessment and Finance escalation triggers.
 */

export class IncentiveEngine {
  /**
   * Evaluates an Admin-configured incentive rule against a customer's verified historical order logs
   * and the current quotation subtotal.
   * @param {Object} customer
   * @param {number} quotationSubtotalCents
   * @param {Object} rule
   * @returns {Object} IncentiveEvaluationResult
   */
  static evaluateRule(customer, quotationSubtotalCents, rule) {
    if (!rule.active) {
      return {
        ruleId: rule.id,
        ruleCode: rule.code,
        ruleName: rule.name,
        eligible: false,
        bonusDiscountPct: 0,
        flatRebateCents: 0,
        reason: `Incentive rule ${rule.code} is currently inactive.`,
      };
    }

    // Minimum order value check
    if (quotationSubtotalCents < rule.minOrderCents) {
      return {
        ruleId: rule.id,
        ruleCode: rule.code,
        ruleName: rule.name,
        eligible: false,
        bonusDiscountPct: 0,
        flatRebateCents: 0,
        reason: `Quotation subtotal ($${(quotationSubtotalCents / 100).toFixed(2)}) is below rule minimum of $${(rule.minOrderCents / 100).toFixed(2)}.`,
      };
    }

    switch (rule.conditionType) {
      case 'VolumeSpike': {
        // Condition: Current order subtotal >= 2x customer historical 6-month average order value (AOV)
        const history = customer.orderHistory || [];
        if (history.length === 0) {
          return {
            ruleId: rule.id,
            ruleCode: rule.code,
            ruleName: rule.name,
            eligible: false,
            bonusDiscountPct: 0,
            flatRebateCents: 0,
            reason: "Account has no historical orders on file to verify volume spike.",
          };
        }

        const totalHistoricalSpend = history.reduce((sum, ord) => sum + ord.totalCents, 0);
        const historicalAOV = Math.round(totalHistoricalSpend / history.length);
        const volumeMultiplier = quotationSubtotalCents / (historicalAOV || 1);

        if (volumeMultiplier >= 2.0) {
          return {
            ruleId: rule.id,
            ruleCode: rule.code,
            ruleName: rule.name,
            eligible: true,
            bonusDiscountPct: rule.discountPctBonus,
            flatRebateCents: rule.flatRebateCents,
            reason: `Volume spike verified! Current quote ($${(quotationSubtotalCents / 100).toFixed(2)}) is ${volumeMultiplier.toFixed(1)}x historical AOV ($${(historicalAOV / 100).toFixed(2)}).`,
          };
        }

        return {
          ruleId: rule.id,
          ruleCode: rule.code,
          ruleName: rule.name,
          eligible: false,
          bonusDiscountPct: 0,
          flatRebateCents: 0,
          reason: `Current quote is ${volumeMultiplier.toFixed(1)}x historical AOV (requires >= 2.0x for volume spike incentive).`,
        };
      }

      case 'MilestoneLoyalty': {
        // Condition: Customer has >= rule.minHistoryOrders paid orders with 0 defaults
        const paidOrders = customer.totalPaidOrders || 0;
        const hasNoDefaults = (customer.defaultCount || 0) === 0;

        if (paidOrders >= rule.minHistoryOrders && hasNoDefaults) {
          return {
            ruleId: rule.id,
            ruleCode: rule.code,
            ruleName: rule.name,
            eligible: true,
            bonusDiscountPct: rule.discountPctBonus,
            flatRebateCents: rule.flatRebateCents,
            reason: `Loyalty milestone unlocked: Customer completed ${paidOrders} paid orders (min ${rule.minHistoryOrders}) with zero defaults.`,
          };
        }

        return {
          ruleId: rule.id,
          ruleCode: rule.code,
          ruleName: rule.name,
          eligible: false,
          bonusDiscountPct: 0,
          flatRebateCents: 0,
          reason: `Customer has ${paidOrders}/${rule.minHistoryOrders} required paid orders, or recorded ${customer.defaultCount} defaults.`,
        };
      }

      case 'HistoricalSpend': {
        // Condition: Customer trailing 365 spend exceeds threshold
        if (customer.trailing365DaySpendCents >= rule.minOrderCents) {
          return {
            ruleId: rule.id,
            ruleCode: rule.code,
            ruleName: rule.name,
            eligible: true,
            bonusDiscountPct: rule.discountPctBonus,
            flatRebateCents: rule.flatRebateCents,
            reason: `Historical spend qualification achieved: Trailing annual spend of $${(customer.trailing365DaySpendCents / 100).toLocaleString()}.`,
          };
        }

        return {
          ruleId: rule.id,
          ruleCode: rule.code,
          ruleName: rule.name,
          eligible: false,
          bonusDiscountPct: 0,
          flatRebateCents: 0,
          reason: `Trailing spend of $${(customer.trailing365DaySpendCents / 100).toLocaleString()} does not meet requirement.`,
        };
      }

      case 'BundledCare': {
        // General category bundled incentive
        return {
          ruleId: rule.id,
          ruleCode: rule.code,
          ruleName: rule.name,
          eligible: true,
          bonusDiscountPct: rule.discountPctBonus,
          flatRebateCents: rule.flatRebateCents,
          reason: "Bundled cross-category incentive qualified.",
        };
      }

      default:
        return {
          ruleId: rule.id,
          ruleCode: rule.code,
          ruleName: rule.name,
          eligible: false,
          bonusDiscountPct: 0,
          flatRebateCents: 0,
          reason: `Unknown condition type: ${rule.conditionType}`,
        };
    }
  }

  /**
   * Assesses a Sales Manager's authority to negotiate higher customer incentive requests.
   * If request exceeds Manager limit ($5,000 rebate / 500,000 cents) OR if order is much higher + good history,
   * flags mandatory escalation to Finance.
   * @param {Object} customer
   * @param {Object} quotation
   * @param {number} requestedRebateCents
   * @param {number} requestedDiscountPct
   * @returns {Object} ManagerIncentiveNegotiationDecision
   */
  static assessManagerNegotiation(
    customer,
    quotation,
    requestedRebateCents,
    requestedDiscountPct
  ) {
    const history = customer.orderHistory || [];
    const totalHistoricalSpend = history.reduce((sum, ord) => sum + ord.totalCents, 0);
    const historicalAOV = history.length > 0 ? Math.round(totalHistoricalSpend / history.length) : 0;
    const onTimeOrders = history.filter(o => o.paidOnTime).length;
    const onTimeRate = history.length > 0 ? Math.round((onTimeOrders / history.length) * 100) : 100;

    const historySummary = {
      historicalAOVcents: historicalAOV,
      totalOrders: history.length,
      onTimePaymentRatePct: onTimeRate,
      hasDefaults: (customer.defaultCount || 0) > 0,
    };

    // Manager Discretion Limit: up to $5,000 rebate (500,000 cents) and up to 20% discount
    const MAX_MANAGER_REBATE_CENTS = 500000; // $5,000.00
    const MAX_MANAGER_DISCOUNT_PCT = 20;

    // High Order + Good History Threshold:
    // Order >= $100,000 (10,000,000 cents) AND on-time payment rate >= 90% AND zero defaults
    const isHighOrderGoodHistory = 
      quotation.subtotalCents >= 10000000 &&
      onTimeRate >= 90 &&
      (customer.defaultCount || 0) === 0;

    if (requestedRebateCents > MAX_MANAGER_REBATE_CENTS || requestedDiscountPct > MAX_MANAGER_DISCOUNT_PCT) {
      return {
        canManagerApprove: false,
        requiresFinanceEscalation: true,
        maxManagerDiscretionCents: MAX_MANAGER_REBATE_CENTS,
        justificationNotes: `Requested incentive ($${(requestedRebateCents / 100).toFixed(2)}) or discount (${requestedDiscountPct}%) exceeds Sales Manager discretionary limit ($5,000 / 20%). Mandatory escalation to Finance required.`,
        customerHistorySummary: historySummary,
      };
    }

    if (isHighOrderGoodHistory && requestedRebateCents > 250000) {
      // High order with significant custom incentive: recommend Finance sign-off
      return {
        canManagerApprove: false,
        requiresFinanceEscalation: true,
        maxManagerDiscretionCents: MAX_MANAGER_REBATE_CENTS,
        justificationNotes: `High-value enterprise order ($${(quotation.subtotalCents / 100).toLocaleString()}) with excellent customer credit history (${onTimeRate}% on-time). Escalated to Finance for final bespoke incentive authorization.`,
        customerHistorySummary: historySummary,
      };
    }

    return {
      canManagerApprove: true,
      requiresFinanceEscalation: false,
      maxManagerDiscretionCents: MAX_MANAGER_REBATE_CENTS,
      justificationNotes: `Incentive request is within Sales Manager discretion ($${(requestedRebateCents / 100).toFixed(2)} <= $5,000). Customer history supports approval.`,
      customerHistorySummary: historySummary,
    };
  }
}
