/**
 * DealFlow360 - Dynamic Customer Tier Progression Engine
 * Phase 1: Core Domain Entities
 * 
 * Implements real-world enterprise B2B progression and degradation rules
 * based on spend velocity, order cadence (daily/weekly), payment health (DSO),
 * and overdue invoice aging.
 */

import type { Customer, CustomerTier, PaymentTerms } from "./types.ts";

export interface TierEvaluationResult {
  currentTier: CustomerTier;
  recommendedTier: CustomerTier;
  upgraded: boolean;
  degraded: boolean;
  reason: string;
  recommendedPaymentTerms: PaymentTerms;
  discretionaryDiscountCeilingPct: number;
}

export class TierEngine {
  /**
   * Evaluates a customer's purchasing history and credit hygiene to determine
   * their dynamic tier progression or degradation.
   */
  public static evaluateCustomerTier(customer: Customer): TierEvaluationResult {
    const current = customer.tier;
    let recommended: CustomerTier = current;
    let reason = "Account tier confirmed based on ongoing performance metrics.";

    // -------------------------------------------------------------------------
    // 1. DEGRADATION CHECKS (Credit risk and severe dormancy take precedence)
    // -------------------------------------------------------------------------
    
    // Critical Credit Default Penalty: Any unpaid invoice overdue > 45 days
    if (customer.maxOverdueDays > 45) {
      if (current === 'Platinum') {
        recommended = 'Silver';
        reason = `Critical credit degradation: Invoice overdue by ${customer.maxOverdueDays} days (>45 day limit). Demoted from Platinum to Silver; credit locked.`;
      } else if (current === 'Gold' || current === 'Silver') {
        recommended = 'Bronze';
        reason = `Critical credit degradation: Invoice overdue by ${customer.maxOverdueDays} days (>45 day limit). Demoted to Bronze; credit terms suspended.`;
      }
      return this.buildResult(current, recommended, reason);
    }

    // Default Count Penalty
    if (customer.defaultCount > 0 && current !== 'Bronze') {
      recommended = current === 'Platinum' ? 'Silver' : 'Bronze';
      reason = `Account recorded ${customer.defaultCount} payment defaults. Demoted to ${recommended}.`;
      return this.buildResult(current, recommended, reason);
    }

    // Platinum Inactivity Degradation: Dormancy > 90 days or 180-day spend < $75k
    if (current === 'Platinum') {
      if (customer.daysSinceLastOrder > 90 || customer.trailing180DaySpendCents < 7500000) {
        recommended = 'Gold';
        reason = `Platinum degradation: Inactivity detected (${customer.daysSinceLastOrder} days since last order or 180-day spend < $75,000). Reclassified to Gold.`;
        return this.buildResult(current, recommended, reason);
      }
    }

    // Gold Inactivity Degradation: Dormancy > 60 days or 90-day spend < $35k
    if (current === 'Gold') {
      if (customer.daysSinceLastOrder > 60 || customer.trailing90DaySpendCents < 3500000) {
        recommended = 'Silver';
        reason = `Gold degradation: Inactivity detected (${customer.daysSinceLastOrder} days since last order or 90-day spend < $35,000). Reclassified to Silver.`;
        return this.buildResult(current, recommended, reason);
      }
    }

    // Silver Inactivity Degradation: Dormancy > 90 days or 90-day spend < $10k or overdue > 30 days
    if (current === 'Silver') {
      if (customer.daysSinceLastOrder > 90 || customer.trailing90DaySpendCents < 1000000 || customer.maxOverdueDays > 30) {
        recommended = 'Bronze';
        reason = `Silver degradation: Order dormancy (${customer.daysSinceLastOrder} days) or trailing spend < $10,000 or overdue invoices > 30 days. Reclassified to Bronze.`;
        return this.buildResult(current, recommended, reason);
      }
    }

    // -------------------------------------------------------------------------
    // 2. UPGRADATION QUALIFICATIONS (Evaluated top-down: Platinum -> Gold -> Silver)
    // -------------------------------------------------------------------------

    // Platinum Criteria:
    // - Trailing 365-day spend >= $350,000 (35,000,000 cents)
    // - Consistent enterprise ordering: >= 12 orders/year
    // - Flawless credit: DSO <= 20 days, max overdue <= 15 days, 0 defaults
    const qualifiesForPlatinum = 
      customer.trailing365DaySpendCents >= 35000000 &&
      customer.ordersTrailing365Days >= 12 &&
      customer.averageDSO <= 20 &&
      customer.maxOverdueDays <= 15 &&
      customer.defaultCount === 0;

    if (qualifiesForPlatinum) {
      if (current !== 'Platinum') {
        recommended = 'Platinum';
        reason = `Strategic partner upgrade: Trailing 365-day spend exceeded $350k ($${(customer.trailing365DaySpendCents / 100).toLocaleString()}) with ${customer.ordersTrailing365Days} orders and pristine credit (DSO ${customer.averageDSO}d).`;
      }
      return this.buildResult(current, recommended, reason);
    }

    // Gold Criteria:
    // - Trailing 180-day spend >= $100,000 (10,000,000 cents) OR
    // - High cadence: >= 12 orders in trailing 90 days (weekly/bi-weekly rhythm) with spend >= $60,000 (6,000,000 cents)
    // - Credit: DSO <= 25 days, max overdue <= 15 days, 0 defaults
    const qualifiesForGold = 
      (customer.trailing180DaySpendCents >= 10000000 || 
        (customer.ordersTrailing90Days >= 12 && customer.trailing90DaySpendCents >= 6000000)) &&
      customer.averageDSO <= 25 &&
      customer.maxOverdueDays <= 15 &&
      customer.defaultCount === 0;

    if (qualifiesForGold) {
      if (current === 'Bronze' || current === 'Silver') {
        recommended = 'Gold';
        reason = `High-value upgrade: Account achieved Gold velocity ($${(customer.trailing180DaySpendCents / 100).toLocaleString()} 180-day spend or high weekly cadence) with reliable payment discipline.`;
      }
      return this.buildResult(current, recommended, reason);
    }

    // Silver Criteria:
    // - Trailing 90-day spend >= $25,000 (2,500,000 cents) OR
    // - Cadence: >= 6 repeat orders in trailing 90 days with aggregate spend >= $15,000 (1,500,000 cents)
    // - Credit: DSO <= 30 days, max overdue <= 15 days
    const qualifiesForSilver = 
      (customer.trailing90DaySpendCents >= 2500000 || 
        (customer.ordersTrailing90Days >= 6 && customer.trailing90DaySpendCents >= 1500000)) &&
      customer.averageDSO <= 30 &&
      customer.maxOverdueDays <= 15;

    if (qualifiesForSilver) {
      if (current === 'Bronze') {
        recommended = 'Silver';
        reason = `Growth upgrade: Trailing 90-day spend exceeded $25,000 ($${(customer.trailing90DaySpendCents / 100).toLocaleString()}) or achieved 6+ repeat orders with healthy payment history.`;
      }
      return this.buildResult(current, recommended, reason);
    }

    // Default Baseline: Bronze
    return this.buildResult(current, recommended, reason);
  }

  public static getTierPaymentTerms(tier: CustomerTier): PaymentTerms {
    switch (tier) {
      case 'Platinum':
        return 'Net45';
      case 'Gold':
        return 'Net30';
      case 'Silver':
        return 'Net15';
      case 'Bronze':
      default:
        return 'Net0';
    }
  }

  public static getTierDiscretionaryDiscountCeiling(tier: CustomerTier): number {
    switch (tier) {
      case 'Platinum':
        return 20; // 20%
      case 'Gold':
        return 14; // 14%
      case 'Silver':
        return 8;  // 8%
      case 'Bronze':
      default:
        return 5;  // 5%
    }
  }

  private static buildResult(current: CustomerTier, recommended: CustomerTier, reason: string): TierEvaluationResult {
    const tierRanks: Record<CustomerTier, number> = {
      Bronze: 1,
      Silver: 2,
      Gold: 3,
      Platinum: 4,
    };

    const currentRank = tierRanks[current];
    const recRank = tierRanks[recommended];

    return {
      currentTier: current,
      recommendedTier: recommended,
      upgraded: recRank > currentRank,
      degraded: recRank < currentRank,
      reason,
      recommendedPaymentTerms: this.getTierPaymentTerms(recommended),
      discretionaryDiscountCeilingPct: this.getTierDiscretionaryDiscountCeiling(recommended),
    };
  }
}
