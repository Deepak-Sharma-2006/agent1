/**
 * DealFlow360 - Real-Time Pricing Gateway
 * Phase 2: REST API & Pricing Gateway
 * 
 * Provides real-time pricing calculations, gross margin analysis,
 * blended discount risk scoring, and margin-optimizing upsell recommendations.
 * Operates strictly with integer cents to eliminate floating-point inaccuracies.
 */

import { QuotationCalculator } from "../domain/quotation-calculator.js";
import { EscalationEngine } from "../domain/escalation-engine.js";

export class PricingGateway {
  /**
   * Calculates a single line item with variant offset and clamped discount.
   * 
   * @param {Object} product - Product entity from repository
   * @param {number} quantity - Item quantity (must be positive integer)
   * @param {number} discountPercentage - Requested discount (0 to 100)
   * @param {string|null} variantId - Optional variant identifier
   * @returns {Object} Calculated line metrics in integer cents
   */
  static calculateLinePricing(product, quantity, discountPercentage = 0, variantId = null) {
    const validQuantity = Math.max(1, Math.floor(quantity || 1));
    const clampedDiscountPercentage = Math.min(100, Math.max(0, Number(discountPercentage) || 0));

    let unitListPriceCents = product.listPriceCents !== undefined ? product.listPriceCents : (product.priceCents || 0);
    if (variantId && product.variants && Array.isArray(product.variants)) {
      const selectedVariant = product.variants.find(v => v.id === variantId);
      if (selectedVariant && typeof selectedVariant.priceDeltaCents === "number") {
        unitListPriceCents += selectedVariant.priceDeltaCents;
      }
    }

    const unitCostPriceCents = product.costPriceCents !== undefined ? product.costPriceCents : (product.cogsCents || 0);
    const discountAmountPerUnitCents = Math.round(unitListPriceCents * (clampedDiscountPercentage / 100));
    const netUnitPriceCents = Math.max(0, unitListPriceCents - discountAmountPerUnitCents);

    const lineListTotalCents = unitListPriceCents * validQuantity;
    const lineSubtotalCents = netUnitPriceCents * validQuantity;
    const lineCostCents = unitCostPriceCents * validQuantity;
    const grossMarginCents = lineSubtotalCents - lineCostCents;

    // Real-world Gross Margin % with zero-division safety
    let grossMarginPercentage = 0;
    if (lineSubtotalCents > 0) {
      grossMarginPercentage = Math.round(((grossMarginCents / lineSubtotalCents) * 100) * 10) / 10;
    } else if (lineCostCents > 0) {
      grossMarginPercentage = -100.0; // 100% loss if sold for $0 with positive cost
    }

    return {
      productId: product.id,
      productName: product.name,
      category: product.category,
      variantId,
      quantity: validQuantity,
      unitListPriceCents,
      unitCostPriceCents,
      discountPercentage: clampedDiscountPercentage,
      discountAmountPerUnitCents,
      netUnitPriceCents,
      lineListTotalCents,
      lineSubtotalCents,
      lineCostCents,
      grossMarginCents,
      grossMarginPercentage,
    };
  }

  /**
   * Generates a complete real-time pricing preview for an uncommitted or draft quotation.
   * Does NOT mutate persistent storage.
   * 
   * @param {Object} previewInput
   * @param {Array} previewInput.lines - Array of line inputs: { product, quantity, discountPercentage, variantId }
   * @param {number} [previewInput.incentiveCents=0] - Optional incentive rebate in cents
   * @param {Object} customer - Customer entity
   * @param {Array} [categoryRules=[]] - Category discount rules
   * @param {Array} [productCatalog=[]] - Product catalog for upsell recommendations
   * @returns {Object} Comprehensive pricing preview with live risk score and recommendations
   */
  static calculateQuotationPreview(previewInput, customer, categoryRules = [], productCatalog = []) {
    const rawLines = previewInput.lines || previewInput.items || [];
    let listSubtotalCents = 0;
    let netLineSubtotalCents = 0;
    let costTotalCents = 0;

    const calculatedLines = rawLines.map((lineInput, index) => {
      const lineId = lineInput.id || `preview-line-${index + 1}`;
      const product = lineInput.product || (productCatalog.find(p => p.id === lineInput.productId));
      const discountPercentage = lineInput.discountPercentage !== undefined
        ? lineInput.discountPercentage
        : (lineInput.unitDiscountPercentage !== undefined ? lineInput.unitDiscountPercentage : 0);

      const linePricing = this.calculateLinePricing(
        product,
        lineInput.quantity,
        discountPercentage,
        lineInput.variantId
      );

      listSubtotalCents += linePricing.lineListTotalCents;
      netLineSubtotalCents += linePricing.lineSubtotalCents;
      costTotalCents += linePricing.lineCostCents;

      return {
        id: lineId,
        ...linePricing,
        allocatedWarehouseId: lineInput.allocatedWarehouseId || null,
      };
    });

    const discountTotalCents = listSubtotalCents - netLineSubtotalCents;
    const requestedIncentiveCents = Math.max(0, Math.floor(previewInput.incentiveCents || 0));
    const netTotalCents = Math.max(0, netLineSubtotalCents - requestedIncentiveCents);

    const grossMarginCents = netTotalCents - costTotalCents;

    // Real-world Gross Margin % with zero-division safety
    let grossMarginPercentage = 0;
    if (netTotalCents > 0) {
      grossMarginPercentage = Math.round(((grossMarginCents / netTotalCents) * 100) * 10) / 10;
    } else if (costTotalCents > 0) {
      grossMarginPercentage = -100.0;
    }

    // Temporary mock quotation structure for domain engines
    const simulatedQuotation = {
      subtotalCents: listSubtotalCents,
      discountTotalCents,
      incentiveTotalCents: requestedIncentiveCents,
      netTotalCents,
      costTotalCents,
      grossMarginCents,
      grossMarginPct: grossMarginPercentage,
      lines: calculatedLines.map(l => ({
        ...l,
        discountPct: l.discountPercentage,
      })),
      escalationTier: "SalesRep",
    };

    // Evaluate escalation and risk metrics
    const escalationAssessment = EscalationEngine.assessEscalation(
      simulatedQuotation,
      customer,
      categoryRules
    );

    // Generate proactive margin-lifting upsell recommendations
    const upsellRecommendations = this.generateMarginRecommendations(
      simulatedQuotation,
      productCatalog
    );

    return {
      subtotalCents: listSubtotalCents,
      subtotalListPriceCents: listSubtotalCents,
      totalDiscountCents: discountTotalCents,
      discountTotalCents,
      incentiveTotalCents: requestedIncentiveCents,
      netTotalCents,
      netSubtotalCents: netTotalCents,
      costTotalCents,
      totalCogsCents: costTotalCents,
      grossMarginCents,
      totalMarginCents: grossMarginCents,
      grossMarginPercentage,
      marginPercentage: grossMarginPercentage,
      marginFloorBreached: grossMarginPercentage < 18.0,
      currency: "USD",
      lines: calculatedLines,
      escalation: {
        requiredTier: escalationAssessment.requiredTier,
        isEscalationRequired: escalationAssessment.isEscalationRequired,
        blendedRiskScore: escalationAssessment.blendedRiskScore,
        isHardBlocked: escalationAssessment.isHardBlocked || false,
        blockReason: escalationAssessment.blockReason || null,
        violations: escalationAssessment.violations || [],
      },
      riskAnalysis: {
        overallRiskScore: escalationAssessment.blendedRiskScore,
        recommendation: escalationAssessment.violations.join("; ") || "Standard commercial terms within risk tolerance.",
      },
      upsellRecommendations,
      upsellSuggestions: upsellRecommendations,
    };
  }

  /**
   * Generates ranked live upsell and cross-sell suggestions that lift deal gross margin.
   * Solves Section 1.2 of the Master Architecture Blueprint.
   * 
   * @param {Object} quotation
   * @param {Array} productCatalog
   * @returns {Array<Object>}
   */
  static generateMarginRecommendations(quotation, productCatalog) {
    if (!productCatalog || !Array.isArray(productCatalog) || productCatalog.length === 0) {
      return [];
    }

    const currentProductIds = new Set((quotation.lines || []).map(l => l.productId));
    const recommendations = [];

    // Filter catalog for high-margin products not yet included in the deal
    for (const product of productCatalog) {
      if (!product.active || currentProductIds.has(product.id)) {
        continue;
      }

      // Calculate product intrinsic margin
      if (product.listPriceCents > 0) {
        const productProfit = product.listPriceCents - product.costPriceCents;
        const productMarginPct = (productProfit / product.listPriceCents) * 100;

        // Recommend services, warranties, or software with margin >= 35%
        if (productMarginPct >= 35.0) {
          // Simulate margin delta if added
          const simulatedNetTotal = quotation.netTotalCents + product.listPriceCents;
          const simulatedCostTotal = quotation.costTotalCents + product.costPriceCents;
          const simulatedMarginPct = simulatedNetTotal > 0
            ? Math.round((((simulatedNetTotal - simulatedCostTotal) / simulatedNetTotal) * 100) * 10) / 10
            : 0;

          const marginLiftPct = Math.round((simulatedMarginPct - quotation.grossMarginPct) * 10) / 10;

          recommendations.push({
            productId: product.id,
            name: product.name,
            category: product.category,
            listPriceCents: product.listPriceCents,
            productMarginPercentage: Math.round(productMarginPct * 10) / 10,
            estimatedMarginLiftPercentage: marginLiftPct,
            recommendationReason: product.category === "Services"
              ? "High-margin professional service bundle lifts overall quote profitability."
              : "Complementary high-margin add-on strengthens deal margin floor.",
          });
        }
      }
    }

    // Rank by highest estimated margin lift
    return recommendations
      .sort((a, b) => b.estimatedMarginLiftPercentage - a.estimatedMarginLiftPercentage)
      .slice(0, 3);
  }
}
