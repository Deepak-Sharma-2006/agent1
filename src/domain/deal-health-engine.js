/**
 * DealFlow360 - Deal Health & Commercial Anomaly Surveillance Engine
 * Phase 10: Real-Life Business Scenarios, Pipeline Surveillance & Risk Signals
 * 
 * Strict Business Invariants:
 * 1. Stalled Quote Threshold: Quotes in non-final stages idle for > 7 days flagged as Stalled.
 * 2. Rep Discount Anomaly: Deals where discount exceeds rep's historical average by > 5% flagged for managerial audit.
 * 3. Delivery Slippage: Physical hardware with promised delivery dates tighter than depot SLA or pending backorders flagged.
 * 4. Composite Health Score: Deterministic health categorization ('Healthy' | 'AtRisk' | 'Critical') with one-click actions.
 */

export const DEAL_HEALTH_STATUSES = Object.freeze([
  'Healthy',
  'AtRisk',
  'Critical',
]);

/**
 * Analyzes a single quote for health, stall duration, discount anomalies, and fulfillment risks.
 * 
 * @param {Object} params
 * @param {Object} params.quote
 * @param {Object} [params.repStats={}] - { averageDiscountPct: number, totalQuotes: number }
 * @param {Array<Object>} [params.backorders=[]]
 * @param {Date|string} [params.now=new Date()]
 * @returns {Object} DealHealthEvaluation
 */
export function evaluateDealHealth({
  quote,
  repStats = { averageDiscountPct: 8.5, totalQuotes: 24 },
  backorders = [],
  now = new Date(),
}) {
  if (!quote) {
    throw new Error('Quote is required for deal health evaluation');
  }

  const currentDate = new Date(now).getTime();
  const lastActiveTimestamp = new Date(
    quote.updatedAt || quote.createdAt || new Date()
  ).getTime();

  const msPerDay = 1000 * 60 * 60 * 24;
  const idleDays = Math.max(0, Math.floor((currentDate - lastActiveTimestamp) / msPerDay));

  const activeStages = ['Draft', 'PendingApproval', 'Sent', 'UnderNegotiation'];
  const isTerminalStage = ['Confirmed', 'Rejected'].includes(quote.status);

  // 1. Stalled Quote Check (> 7 days idle)
  const isStalled = !isTerminalStage && activeStages.includes(quote.status) && idleDays >= 7;

  // 2. Rep Discount Anomaly Check (> 5% deviation above historical average)
  const quoteDiscountPct = Number(
    quote.overallDiscountPercent ||
    quote.discountPercent ||
    (quote.lines && quote.lines.length > 0
      ? (quote.lines.reduce((sum, l) => sum + (l.discountPercent || 0), 0) / quote.lines.length)
      : 0)
  );

  const historicalRepAvg = repStats.averageDiscountPct ?? 8.0;
  const discountDelta = quoteDiscountPct - historicalRepAvg;
  const isDiscountAnomaly = discountDelta >= 5.0;

  // 3. Delivery Promise Slippage Check
  let isDeliverySlippageRisk = false;
  let deliveryRiskReason = null;

  const quoteBackorders = backorders.filter(
    (b) => b.quotationId === quote.id && (b.status || '').toLowerCase() === 'pending'
  );

  if (quoteBackorders.length > 0) {
    isDeliverySlippageRisk = true;
    deliveryRiskReason = `Fulfillment delayed: ${quoteBackorders.length} unfulfilled backorder ticket(s) pending regional warehouse replenishment.`;
  } else if (quote.requestedDeliveryDate) {
    const requestedDate = new Date(quote.requestedDeliveryDate).getTime();
    const daysUntilDelivery = Math.floor((requestedDate - currentDate) / msPerDay);
    const hasHardware = (quote.lines || []).some(
      (l) => (l.category || '').toLowerCase() === 'hardware'
    );

    if (hasHardware && daysUntilDelivery < 2 && daysUntilDelivery >= 0) {
      isDeliverySlippageRisk = true;
      deliveryRiskReason = `Tight delivery window: Only ${daysUntilDelivery} day(s) remaining for multi-depot carrier dispatch.`;
    } else if (hasHardware && daysUntilDelivery < 0) {
      isDeliverySlippageRisk = true;
      deliveryRiskReason = `Delivery promise breached: Scheduled delivery date was ${Math.abs(daysUntilDelivery)} day(s) ago.`;
    }
  }

  // 4. Composite Health Score Calculation
  let healthScore = 100;
  const riskSignals = [];

  if (isStalled) {
    const stallPenalty = Math.min(40, idleDays * 3);
    healthScore -= stallPenalty;
    riskSignals.push({
      type: 'STALLED_DEAL',
      severity: idleDays >= 14 ? 'Critical' : 'Warning',
      message: `Quote has been idle for ${idleDays} days without pipeline progression.`,
    });
  }

  if (isDiscountAnomaly) {
    healthScore -= 30;
    riskSignals.push({
      type: 'DISCOUNT_ANOMALY',
      severity: 'Warning',
      message: `Rep discount (${quoteDiscountPct.toFixed(1)}%) deviates by +${discountDelta.toFixed(1)}% above rep historical average (${historicalRepAvg.toFixed(1)}%).`,
    });
  }

  if (isDeliverySlippageRisk) {
    healthScore -= 25;
    riskSignals.push({
      type: 'DELIVERY_SLIPPAGE',
      severity: 'Warning',
      message: deliveryRiskReason,
    });
  }

  // Low margin penalty if below 22%
  if (quote.grossMarginPercent != null && quote.grossMarginPercent < 22.0) {
    healthScore -= 20;
    riskSignals.push({
      type: 'LOW_MARGIN_WARNING',
      severity: quote.grossMarginPercent < 18.0 ? 'Critical' : 'Warning',
      message: `Gross profit margin (${quote.grossMarginPercent.toFixed(1)}%) is compressed near red-line boundary (18.0%).`,
    });
  }

  healthScore = Math.max(0, healthScore);

  let status = 'Healthy';
  let recommendedAction = 'Deal on track. Continue standard sales cycle.';

  if (healthScore < 50 || isTerminalStage === false && idleDays >= 14) {
    status = 'Critical';
    recommendedAction = isStalled
      ? 'Escalate to Sales Manager: Immediate rep intervention required for stalled account.'
      : 'Review by Finance: Critical margin or delivery promise risk detected.';
  } else if (healthScore < 80) {
    status = 'AtRisk';
    recommendedAction = isDiscountAnomaly
      ? 'Sales Manager Audit: Review justification for high rep discount variance.'
      : isDeliverySlippageRisk
      ? 'Expedite Depot Dispatch: Contact warehouse logistics to prioritize split packing.'
      : 'Nudge Rep: Send pipeline reminder to re-engage prospective buyer.';
  }

  return {
    quotationId: quote.id,
    customerName: quote.customerName,
    salesRepName: quote.salesRepName || quote.repName || 'Enterprise Sales Rep',
    status,
    healthScore,
    idleDays,
    isStalled,
    isDiscountAnomaly,
    isDeliverySlippageRisk,
    riskSignals,
    recommendedAction,
    evaluatedAt: new Date(now).toISOString(),
  };
}

/**
 * Evaluates pipeline-wide deal health across all active quotations.
 * 
 * @param {Array<Object>} quotes
 * @param {Object} repStatsMap - Map of repId/name to { averageDiscountPct }
 * @param {Array<Object>} backorders
 * @param {Date|string} [now=new Date()]
 * @returns {Object} PipelineSurveillanceReport
 */
export function analyzePipelineHealth(quotes = [], repStatsMap = {}, backorders = [], now = new Date()) {
  const evaluations = quotes.map((q) =>
    evaluateDealHealth({
      quote: q,
      repStats: repStatsMap[q.salesRepName || q.repName] || { averageDiscountPct: 8.5, totalQuotes: 20 },
      backorders,
      now,
    })
  );

  const stalledCount = evaluations.filter((e) => e.isStalled).length;
  const anomalyCount = evaluations.filter((e) => e.isDiscountAnomaly).length;
  const slippageCount = evaluations.filter((e) => e.isDeliverySlippageRisk).length;
  const criticalCount = evaluations.filter((e) => e.status === 'Critical').length;
  const atRiskCount = evaluations.filter((e) => e.status === 'AtRisk').length;
  const healthyCount = evaluations.filter((e) => e.status === 'Healthy').length;

  return {
    totalEvaluated: quotes.length,
    counts: {
      healthy: healthyCount,
      atRisk: atRiskCount,
      critical: criticalCount,
      stalledDeals: stalledCount,
      discountAnomalies: anomalyCount,
      deliverySlippage: slippageCount,
    },
    actionableAlerts: evaluations.filter((e) => e.status !== 'Healthy'),
    timestamp: new Date(now).toISOString(),
  };
}
