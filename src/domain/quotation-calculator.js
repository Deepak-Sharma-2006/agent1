/**
 * DealFlow360 - Quotation Calculator Engine (JavaScript Edition)
 * Phase 1: Core Domain Entities
 * 
 * Performs deterministic integer-cents calculations for line items,
 * discounts, rebates, taxes, and real-time gross margin percentages.
 */

export class QuotationCalculator {
  /**
   * Builds and calculates a QuotationLine with integer cents precision.
   * @param {string} quotationId
   * @param {string} lineId
   * @param {Object} input
   * @returns {Object} QuotationLine
   */
  static createLine(quotationId, lineId, input) {
    const { product, quantity, discountPct, allocatedWarehouseId, variantId } = input;
    
    // Check variant price offset
    let unitListPriceCents = product.listPriceCents;
    if (variantId && product.variants) {
      const variant = product.variants.find(v => v.id === variantId);
      if (variant) {
        unitListPriceCents += variant.priceDeltaCents;
      }
    }

    const unitCostPriceCents = product.costPriceCents;
    const clampedDiscountPct = Math.min(100, Math.max(0, discountPct));

    const discountAmountCents = Math.round(unitListPriceCents * (clampedDiscountPct / 100));
    const netUnitPriceCents = unitListPriceCents - discountAmountCents;

    const lineSubtotalCents = netUnitPriceCents * quantity;
    const lineCostCents = unitCostPriceCents * quantity;
    const grossMarginCents = lineSubtotalCents - lineCostCents;
    const grossMarginPct = lineSubtotalCents > 0
      ? Math.round(((grossMarginCents / lineSubtotalCents) * 100) * 10) / 10
      : 0;

    return {
      id: lineId,
      quotationId,
      productId: product.id,
      variantId,
      productName: product.name,
      category: product.category,
      quantity,
      unitListPriceCents,
      unitCostPriceCents,
      discountPct: clampedDiscountPct,
      discountPercentage: clampedDiscountPct,
      unitDiscountPercentage: clampedDiscountPct,
      discountAmountCents,
      netUnitPriceCents,
      lineSubtotalCents,
      lineCostCents,
      grossMarginCents,
      grossMarginPct,
      allocatedWarehouseId,
    };
  }

  /**
   * Recalculates whole-order subtotals, margins, and totals in integer cents.
   * @param {Object} quotation
   * @returns {Object}
   */
  static recalculateQuotation(quotation) {
    let listSubtotalCents = 0;
    let netLineSubtotalCents = 0;
    let costTotalCents = 0;

    for (const line of (quotation.lines || [])) {
      listSubtotalCents += line.quantity * line.unitListPriceCents;
      netLineSubtotalCents += line.lineSubtotalCents;
      costTotalCents += line.lineCostCents;
    }

    const discountTotalCents = listSubtotalCents - netLineSubtotalCents;
    const incentiveTotalCents = quotation.incentiveTotalCents || 0;
    const netTotalCents = Math.max(0, netLineSubtotalCents - incentiveTotalCents);

    const grossMarginCents = netTotalCents - costTotalCents;
    const grossMarginPct = netTotalCents > 0
      ? Math.round(((grossMarginCents / netTotalCents) * 100) * 10) / 10
      : 0;

    quotation.subtotalCents = listSubtotalCents;
    quotation.discountTotalCents = discountTotalCents;
    quotation.incentiveTotalCents = incentiveTotalCents;
    quotation.netTotalCents = netTotalCents;
    quotation.costTotalCents = costTotalCents;
    quotation.grossMarginCents = grossMarginCents;
    quotation.grossMarginPct = grossMarginPct;
    quotation.updatedAt = new Date().toISOString();

    return quotation;
  }
}
