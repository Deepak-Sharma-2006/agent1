/**
 * DealFlow360 - Quotation Workflow & State Machine Service
 * Phase 2: REST API & Pricing Gateway
 * 
 * Manages the complete commercial quotation lifecycle from initial draft creation
 * through multi-tier approvals, customer counter-proposals, and graceful fallback.
 * Implements Optimistic Concurrency Control (OCC) and integer cents calculations.
 */

import { QuotationCalculator } from "../domain/quotation-calculator.js";
import { EscalationEngine } from "../domain/escalation-engine.js";
import { FallbackEngine } from "../domain/fallback-engine.js";
import { IncentiveEngine } from "../domain/incentive-engine.js";

export class ConcurrencyConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = "ConcurrencyConflictError";
    this.statusCode = 409;
  }
}

export class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
    this.statusCode = 400;
  }
}

export class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
    this.statusCode = 404;
  }
}

export class QuotationService {
  /**
   * Initializes the quotation workflow service with required repository dependencies.
   * 
   * @param {Object} repositories
   * @param {Object} repositories.quotationRepository
   * @param {Object} repositories.customerRepository
   * @param {Object} repositories.productRepository
   * @param {Object} repositories.incentiveRuleRepository
   * @param {Object} [repositories.eventBroadcaster=null]
   * @param {Object} [repositories.database=null]
   */
  constructor({
    quotationRepository,
    customerRepository,
    productRepository,
    incentiveRuleRepository,
    inventoryRepository,
    eventBroadcaster = null,
    database = null,
  }) {
    this.quotationRepository = quotationRepository;
    this.customerRepository = customerRepository;
    this.productRepository = productRepository;
    this.incentiveRuleRepository = incentiveRuleRepository;
    this.inventoryRepository = inventoryRepository;
    this.eventBroadcaster = eventBroadcaster;
    this.database = database;
    this.inMemoryMessages = new Map();
  }

  /**
   * Verifies optimistic concurrency version to prevent lost updates or overwrite collisions.
   * 
   * @private
   * @param {Object} quotation
   * @param {number|undefined} expectedVersion
   */
  _assertConcurrencyVersion(quotation, expectedVersion) {
    if (expectedVersion !== undefined && expectedVersion !== null) {
      const currentVersion = quotation.version || 1;
      if (Number(expectedVersion) !== currentVersion) {
        throw new ConcurrencyConflictError(
          `Quotation ${quotation.id} was modified concurrently. Current version is ${currentVersion}, but expected version was ${expectedVersion}. Please refresh.`
        );
      }
    }
  }

  /**
   * Increments the quote version after a successful mutation.
   * 
   * @private
   * @param {Object} quotation
   */
  _incrementVersion(quotation) {
    quotation.version = (quotation.version || 1) + 1;
    quotation.updatedAt = new Date().toISOString();
  }

  /**
   * Synchronizes enterprise compatibility aliases for consistent contract testing.
   * 
   * @private
   * @param {Object} quotation
   */
  _syncCompatibilityAliases(quotation) {
    if (!quotation) return;
    
    // Synchronize approval tier aliases
    if (quotation.status === "Approved") {
      quotation.requiredApprovalLevel = "Self";
    } else if (quotation.escalationTier === "SalesRep" || !quotation.escalationTier) {
      quotation.requiredApprovalLevel = "Self";
    } else {
      quotation.requiredApprovalLevel = quotation.escalationTier;
    }

    quotation.approvalHistory = quotation.approvalChain || [];
    if (quotation.fallbackSnapshot) {
      const snap = quotation.fallbackSnapshot;
      const discountPct = snap.approvedDiscountPct !== undefined
        ? snap.approvedDiscountPct
        : (snap.discountPercentage !== undefined ? snap.discountPercentage : (snap.discountPct || 0));
      const netTotal = snap.approvedNetTotalCents !== undefined
        ? snap.approvedNetTotalCents
        : (snap.totalCents !== undefined ? snap.totalCents : (snap.netTotalCents || 0));

      quotation.lastApprovedSnapshot = {
        ...snap,
        discountPercentage: discountPct,
        discountPct: discountPct,
        totalCents: netTotal,
        netTotalCents: netTotal,
        version: snap.version || quotation.version,
        approvedBy: snap.approverName || snap.approverRole || "Management",
      };
    } else {
      quotation.lastApprovedSnapshot = null;
    }

    if (!quotation.appliedIncentives) {
      quotation.appliedIncentives = [];
    }

    if (quotation.lines) {
      for (const line of quotation.lines) {
        if (line.discountPct !== undefined) {
          line.discountPercentage = line.discountPct;
          line.unitDiscountPercentage = line.discountPct;
        }
        if (line.unitListPriceCents !== undefined && line.listPriceCents === undefined) {
          line.listPriceCents = line.unitListPriceCents;
        }
        if (line.netUnitPriceCents !== undefined && line.netPriceCents === undefined) {
          line.netPriceCents = line.netUnitPriceCents;
        }
        if (line.lineSubtotalCents !== undefined && line.lineTotalCents === undefined) {
          line.lineTotalCents = line.lineSubtotalCents;
        }
        if (line.productName && !line.description) {
          line.description = line.productName;
        }
      }
    }

    if (quotation.subtotalCents > 0 && quotation.discountTotalCents !== undefined) {
      quotation.discountPercentage = Math.round((quotation.discountTotalCents / quotation.subtotalCents) * 100);
      quotation.discountPct = quotation.discountPercentage;
    } else if (quotation.discountPercentage !== undefined && quotation.discountPct === undefined) {
      quotation.discountPct = quotation.discountPercentage;
    }
    if (quotation.netTotalCents !== undefined) {
      quotation.totalCents = quotation.netTotalCents;
    }
    if (quotation.discountTotalCents !== undefined) {
      quotation.discountAmountCents = quotation.discountTotalCents;
    }
  }

  /**
   * Creates a new draft quotation for a customer.
   * 
   * @param {Object} params
   * @param {string} params.salesRepId - ID of authoring sales representative
   * @param {string} params.salesRepName - Name of sales representative
   * @param {string} params.customerId - ID of customer account
   * @param {number} [params.validityPeriodDays=30] - Number of days quote remains valid
   * @returns {Object} Created draft quotation
   */
  createDraftQuotation({ salesRepId, salesRepName, customerId, validityPeriodDays = 30 }) {
    if (!salesRepId || !customerId) {
      throw new ValidationError("salesRepId and customerId are required to author a quotation.");
    }

    const customer = this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundError(`Customer with ID '${customerId}' was not found.`);
    }

    const quotationId = `qt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const quoteNumber = `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + validityPeriodDays);

    const initialQuotation = {
      id: quotationId,
      quoteNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerTier: customer.tier,
      salesRepId,
      salesRepName: salesRepName || "Sales Representative",
      status: "Draft",
      lines: [],
      subtotalCents: 0,
      discountTotalCents: 0,
      incentiveTotalCents: 0,
      netTotalCents: 0,
      costTotalCents: 0,
      grossMarginCents: 0,
      grossMarginPct: 0,
      blendedRiskScore: 0,
      escalationTier: "SalesRep",
      requiredApprovalLevel: "Self",
      approvalChain: [],
      approvalHistory: [],
      appliedIncentives: [],
      fallbackSnapshot: null,
      lastApprovedSnapshot: null,
      version: 1,
      validUntil: validUntilDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.quotationRepository.save(initialQuotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitQuoteUpdated(initialQuotation, "CREATED");
    }

    return initialQuotation;
  }

  /**
   * Retrieves a quotation by its identifier.
   * 
   * @param {string} quotationId
   * @returns {Object}
   */
  getQuotationById(quotationId) {
    const quotation = this.quotationRepository.findById(quotationId);
    if (!quotation) {
      throw new NotFoundError(`Quotation '${quotationId}' does not exist.`);
    }
    this._syncCompatibilityAliases(quotation);
    return quotation;
  }

  /**
   * Lists quotations matching optional query criteria.
   * 
   * @param {Object} [filterCriteria={}]
   * @param {string} [filterCriteria.status]
   * @param {string} [filterCriteria.customerId]
   * @param {string} [filterCriteria.salesRepId]
   * @returns {Array<Object>}
   */
  listQuotations(filterCriteria = {}) {
    const allQuotations = this.quotationRepository.findAll();
    return allQuotations
      .filter(quote => {
        if (filterCriteria.status && quote.status !== filterCriteria.status) {
          return false;
        }
        if (filterCriteria.customerId && quote.customerId !== filterCriteria.customerId) {
          return false;
        }
        if (filterCriteria.salesRepId && quote.salesRepId !== filterCriteria.salesRepId) {
          return false;
        }
        return true;
      })
      .map(quote => {
        this._syncCompatibilityAliases(quote);
        return quote;
      });
  }

  /**
   * Adds a new product line item to an existing quotation.
   * In-line edge case defense: Mutating an 'Approved' quote immediately revokes approval.
   * 
   * @param {string} quotationId
   * @param {Object} lineData
   * @param {string} lineData.productId
   * @param {number} lineData.quantity
   * @param {number} [lineData.discountPercentage=0]
   * @param {number} [lineData.unitDiscountPercentage=0]
   * @param {string|null} [lineData.variantId=null]
   * @param {string|null} [lineData.allocatedWarehouseId=null]
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Updated quotation
   */
  addLineItemToQuotation(quotationId, lineData, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status === "Confirmed") {
      throw new ValidationError("Cannot modify a quote that has already been confirmed into an order.");
    }

    const { productId, quantity, variantId = null, allocatedWarehouseId = null } = lineData;
    if (!productId || !quantity || quantity <= 0) {
      throw new ValidationError("Valid productId and positive quantity are required.");
    }

    const discountPercentage = lineData.discountPct !== undefined
      ? lineData.discountPct
      : (lineData.discountPercentage !== undefined
        ? lineData.discountPercentage
        : (lineData.unitDiscountPercentage !== undefined ? lineData.unitDiscountPercentage : 0));

    const product = this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError(`Product '${productId}' was not found.`);
    }

    const lineId = `line-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const calculatedLine = QuotationCalculator.createLine(quotationId, lineId, {
      product,
      quantity: Math.floor(quantity),
      discountPct: Math.min(100, Math.max(0, Number(discountPercentage) || 0)),
      variantId,
      allocatedWarehouseId,
    });

    if (!quotation.lines) {
      quotation.lines = [];
    }
    quotation.lines.push(calculatedLine);

    // Edge Case 4 Defense: Invalidate prior approval if line added to approved quote
    if (quotation.status === "Approved") {
      quotation.status = "Draft";
      quotation.approvalChain.push({
        action: "ApprovalRevoked",
        role: "System",
        approverName: "System Automation",
        timestamp: new Date().toISOString(),
        note: "Line item added after approval. Prior sign-offs invalidated.",
      });
    }

    // Recalculate totals in integer cents
    QuotationCalculator.recalculateQuotation(quotation);
    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitQuoteUpdated(quotation, "LINE_ADDED");
    }

    return quotation;
  }

  /**
   * Updates quantities or discounts on an existing quotation line.
   * 
   * @param {string} quotationId
   * @param {string} lineItemId
   * @param {Object} updates
   * @param {number} [updates.quantity]
   * @param {number} [updates.discountPercentage]
   * @param {number} [updates.unitDiscountPercentage]
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Updated quotation
   */
  updateLineItemDetails(quotationId, lineItemId, updates, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status === "Confirmed") {
      throw new ValidationError("Cannot modify a confirmed quotation.");
    }

    const lineIndex = (quotation.lines || []).findIndex(l => l.id === lineItemId);
    if (lineIndex === -1) {
      throw new NotFoundError(`Line item '${lineItemId}' does not exist on quote '${quotationId}'.`);
    }

    const existingLine = quotation.lines[lineIndex];
    const product = this.productRepository.findById(existingLine.productId);

    const newQuantity = updates.quantity !== undefined
      ? Math.max(1, Math.floor(updates.quantity))
      : existingLine.quantity;

    const newDiscountPercentage = updates.discountPct !== undefined
      ? Math.min(100, Math.max(0, Number(updates.discountPct)))
      : (updates.discountPercentage !== undefined
        ? Math.min(100, Math.max(0, Number(updates.discountPercentage)))
        : (updates.unitDiscountPercentage !== undefined
          ? Math.min(100, Math.max(0, Number(updates.unitDiscountPercentage)))
          : existingLine.discountPct));

    const updatedLine = QuotationCalculator.createLine(quotationId, lineItemId, {
      product: product || {
        id: existingLine.productId,
        name: existingLine.productName,
        category: existingLine.category,
        listPriceCents: existingLine.unitListPriceCents,
        costPriceCents: existingLine.unitCostPriceCents,
      },
      quantity: newQuantity,
      discountPct: newDiscountPercentage,
      variantId: existingLine.variantId,
      allocatedWarehouseId: updates.allocatedWarehouseId !== undefined
        ? updates.allocatedWarehouseId
        : existingLine.allocatedWarehouseId,
    });

    quotation.lines[lineIndex] = updatedLine;

    // Edge Case 4 Defense: Invalidate prior approval on line modification
    if (quotation.status === "Approved") {
      quotation.status = "Draft";
      quotation.approvalChain.push({
        action: "ApprovalRevoked",
        role: "System",
        approverName: "System Automation",
        timestamp: new Date().toISOString(),
        note: `Line '${lineItemId}' modified. Prior approval invalidated.`,
      });
    }

    QuotationCalculator.recalculateQuotation(quotation);
    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitQuoteUpdated(quotation, "LINE_UPDATED");
    }

    return quotation;
  }

  /**
   * Removes a line item from a quotation.
   * 
   * @param {string} quotationId
   * @param {string} lineItemId
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Updated quotation
   */
  removeLineItemFromQuotation(quotationId, lineItemId, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status === "Confirmed") {
      throw new ValidationError("Cannot remove items from a confirmed quotation.");
    }

    const initialLength = (quotation.lines || []).length;
    quotation.lines = (quotation.lines || []).filter(l => l.id !== lineItemId);

    if (quotation.lines.length === initialLength) {
      throw new NotFoundError(`Line item '${lineItemId}' not found.`);
    }

    if (quotation.status === "Approved") {
      quotation.status = "Draft";
      quotation.approvalChain.push({
        action: "ApprovalRevoked",
        role: "System",
        approverName: "System Automation",
        timestamp: new Date().toISOString(),
        note: `Line '${lineItemId}' removed. Prior approval invalidated.`,
      });
    }

    QuotationCalculator.recalculateQuotation(quotation);
    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitQuoteUpdated(quotation, "LINE_REMOVED");
    }

    return quotation;
  }

  /**
   * Applies an Admin-configured condition-based incentive rule to the quotation.
   * 
   * @param {string} quotationId
   * @param {string} ruleCode
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Updated quotation with evaluated incentive deduction
   */
  applyHistoricalIncentiveRule(quotationId, ruleCode, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    const rule = this.incentiveRuleRepository.findByCode(ruleCode);
    if (!rule) {
      throw new NotFoundError(`Incentive rule '${ruleCode}' not found.`);
    }

    const customer = this.customerRepository.findById(quotation.customerId);
    if (!customer) {
      throw new NotFoundError(`Customer '${quotation.customerId}' not found.`);
    }

    const evaluation = IncentiveEngine.evaluateRule(customer, quotation.subtotalCents, rule);
    if (!evaluation.eligible) {
      throw new ValidationError(`Quotation criteria not satisfied: ${evaluation.reason}`);
    }

    if (!quotation.appliedIncentives) {
      quotation.appliedIncentives = [];
    }
    quotation.appliedIncentives.push({
      ruleId: rule.id,
      code: rule.code,
      name: rule.name,
      bonusDiscountPct: evaluation.bonusDiscountPct,
      flatRebateCents: evaluation.flatRebateCents,
      appliedAt: new Date().toISOString(),
    });

    if (evaluation.bonusDiscountPct > 0) {
      for (const line of (quotation.lines || [])) {
        line.discountPct = Math.min(100, (line.discountPct || 0) + evaluation.bonusDiscountPct);
        line.discountPercentage = line.discountPct;
        line.unitDiscountPercentage = line.discountPct;
        const discountAmount = Math.round(line.unitListPriceCents * (line.discountPct / 100));
        line.netUnitPriceCents = line.unitListPriceCents - discountAmount;
        line.lineSubtotalCents = line.netUnitPriceCents * line.quantity;
        line.grossMarginCents = line.lineSubtotalCents - line.lineCostCents;
        line.grossMarginPct = line.lineSubtotalCents > 0
          ? Math.round(((line.grossMarginCents / line.lineSubtotalCents) * 100) * 10) / 10
          : 0;
      }
    }
    if (evaluation.flatRebateCents > 0) {
      quotation.incentiveTotalCents = (quotation.incentiveTotalCents || 0) + evaluation.flatRebateCents;
    }

    QuotationCalculator.recalculateQuotation(quotation);
    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitQuoteUpdated(quotation, "INCENTIVE_APPLIED");
    }

    return quotation;
  }

  /**
   * Submits a quotation for governance review and escalation assessment.
   * 
   * @param {string} quotationId
   * @param {string} [salesRepJustificationNote=""]
   * @param {number|undefined} [expectedVersion]
   * @returns {Object}
   */
  submitQuotationForApproval(quotationId, salesRepJustificationNote = "", expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (!quotation.lines || quotation.lines.length === 0) {
      throw new ValidationError("Cannot submit an empty quotation. Add at least one line item.");
    }

    const customer = this.customerRepository.findById(quotation.customerId);
    const categoryRules = []; // Default category rules

    // Run Escalation Engine assessment
    const assessment = EscalationEngine.assessEscalation(quotation, customer, categoryRules);
    quotation.blendedRiskScore = assessment.blendedRiskScore;
    quotation.escalationTier = assessment.requiredTier;

    // Hard block check: 18% margin floor or > 35% discount
    if (assessment.isHardBlocked) {
      quotation.status = "Draft";
      quotation.approvalChain.push({
        action: "HardBlocked",
        role: "System",
        approverName: "System Governance",
        timestamp: new Date().toISOString(),
        note: assessment.blockReason,
      });
      this._syncCompatibilityAliases(quotation);
      this._incrementVersion(quotation);
      this.quotationRepository.save(quotation);

      throw new ValidationError(`Commercial Hard Block: ${assessment.blockReason}`);
    }

    if (assessment.requiredTier === "SalesRep") {
      // Rep is self-authorized (<= 10% discount, zero rebate)
      quotation.status = "Approved";
      quotation.approvalChain.push({
        action: "SelfAuthorized",
        role: "SalesRep",
        approverName: quotation.salesRepName,
        timestamp: new Date().toISOString(),
        note: salesRepJustificationNote || "Self-authorized within standard 10% representative discretion limit.",
      });

      // Capture initial approved fallback snapshot
      quotation.fallbackSnapshot = FallbackEngine.captureSnapshot(
        quotation,
        "SalesRep",
        quotation.salesRepName,
        "Self-authorized baseline terms."
      );
    } else {
      // Escalation required (SalesManager or Finance)
      quotation.status = "PendingApproval";
      quotation.approvalChain.push({
        action: "SubmittedForApproval",
        role: "SalesRep",
        approverName: quotation.salesRepName,
        timestamp: new Date().toISOString(),
        note: salesRepJustificationNote || `Escalated to ${assessment.requiredTier} (Risk Score: ${assessment.blendedRiskScore}).`,
      });
    }

    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      if (quotation.status === "Approved") {
        this.eventBroadcaster.emitApprovalGranted(quotation, {
          approverRole: "SalesRep",
          approverName: quotation.salesRepName,
        });
      } else {
        this.eventBroadcaster.emitApprovalRequired(quotation, assessment);
      }
    }

    return quotation;
  }

  /**
   * Records a management sign-off (SalesManager or Finance).
   * 
   * @param {string} quotationId
   * @param {Object} approvalDetails
   * @param {string} approvalDetails.approverRole - "SalesManager" or "Finance"
   * @param {string} approvalDetails.approverName - Name of approver
   * @param {string} [approvalDetails.approvalNote=""]
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Approved quotation with captured fallback snapshot
   */
  approveQuotation(quotationId, { approverRole, approverName, approvalNote = "" }, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status !== "PendingApproval") {
      throw new ValidationError(`Quotation must be in 'PendingApproval' status to be approved. Current status is '${quotation.status}'.`);
    }

    if (approverRole !== "SalesManager" && approverRole !== "Finance") {
      throw new ValidationError(`Role '${approverRole}' is not authorized to approve escalated quotations.`);
    }

    // Role boundary validation
    const maxLineDiscount = Math.max(...quotation.lines.map(l => l.discountPct));
    if (approverRole === "SalesManager" && maxLineDiscount > 20) {
      throw new ValidationError("Sales Manager cannot approve quotes with discounts exceeding 20%. Must escalate to Finance.");
    }

    quotation.status = "Approved";
    quotation.escalationTier = "SalesRep";

    const approvalRecord = {
      action: "Approved",
      role: approverRole,
      approverRole: approverRole,
      approverName: approverName || "Authorized Manager",
      timestamp: new Date().toISOString(),
      note: approvalNote || `Approved commercial terms by ${approverRole}.`,
    };
    if (!quotation.approvalChain) quotation.approvalChain = [];
    quotation.approvalChain.push(approvalRecord);

    // Capture an immutable fallback snapshot of these approved terms
    quotation.fallbackSnapshot = FallbackEngine.captureSnapshot(
      quotation,
      approverRole,
      approverName || "Authorized Manager",
      approvalNote || "Authorized terms snapshot."
    );

    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitApprovalGranted(quotation, { approverRole, approverName });
    }

    return quotation;
  }

  /**
   * Rejects an escalated quote or counter-offer and executes graceful fallback.
   * Edge Case 5 Defense: Handles quotes with zero prior snapshots by reverting to catalog list price.
   * 
   * @param {string} quotationId
   * @param {Object} rejectionDetails
   * @param {string} rejectionDetails.approverRole - Role rejecting the terms
   * @param {string} rejectionDetails.approverName - Name of rejecting approver
   * @param {string} rejectionDetails.rejectionReason - Detailed business justification
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Quotation reverted to last approved offer (or standard catalog terms)
   */
  rejectQuotationAndFallback(quotationId, { approverRole, approverName, rejectionReason }, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status !== "PendingApproval") {
      throw new ValidationError(`Only quotations in 'PendingApproval' status can be rejected. Current status is '${quotation.status}'.`);
    }

    const rejectionRecord = {
      action: "Rejected",
      role: approverRole || "Finance",
      approverName: approverName || "Reviewer",
      timestamp: new Date().toISOString(),
      note: rejectionReason || "Rejected requested commercial terms.",
    };
    quotation.approvalChain.push(rejectionRecord);

    // Execute graceful fallback to last approved terms
    if (quotation.fallbackSnapshot) {
      const fallbackResult = FallbackEngine.revertToLastApprovedOffer(
        quotation,
        approverRole || "Finance",
        approverName || "Reviewer",
        rejectionReason || "Reverted to prior approved best offer."
      );

      for (const line of (quotation.lines || [])) {
        line.discountPercentage = line.discountPct;
        line.unitDiscountPercentage = line.discountPct;
      }

      quotation.approvalChain.push({
        action: "GracefulFallbackExecuted",
        role: "System",
        approverName: "FallbackEngine",
        timestamp: new Date().toISOString(),
        note: fallbackResult.explanation,
      });
    } else {
      // Edge Case 5: No prior snapshot exists; revert all lines to standard catalog list price (0% discount)
      for (const line of (quotation.lines || [])) {
        line.discountPct = 0;
        line.discountPercentage = 0;
        line.unitDiscountPercentage = 0;
        line.discountAmountCents = 0;
        line.netUnitPriceCents = line.unitListPriceCents;
        line.lineSubtotalCents = line.unitListPriceCents * line.quantity;
        line.grossMarginCents = line.lineSubtotalCents - line.lineCostCents;
        line.grossMarginPct = Math.round(((line.grossMarginCents / line.lineSubtotalCents) * 100) * 10) / 10;
      }

      quotation.incentiveTotalCents = 0;
      quotation.status = "Draft";
      QuotationCalculator.recalculateQuotation(quotation);

      quotation.approvalChain.push({
        action: "RevertedToCatalogListPrice",
        role: "System",
        approverName: "FallbackEngine",
        timestamp: new Date().toISOString(),
        note: "No prior approved terms on record. Reverted to standard catalog list price in Draft status.",
      });
    }

    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitFallbackReverted(quotation, quotation.fallbackSnapshot || {});
    }

    return quotation;
  }

  /**
   * Submits a customer counter-offer from the external portal.
   * 
   * @param {string} quotationId
   * @param {Object} counterData
   * @param {number} counterData.requestedDiscountPercentage
   * @param {string} [counterData.customerNotes=""]
   * @param {number|undefined} [expectedVersion]
   * @returns {Object}
   */
  submitCustomerCounterOffer(quotationId, { requestedDiscountPercentage, customerNotes = "" }, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status !== "Approved" && quotation.status !== "Draft") {
      throw new ValidationError("Customer counter-offer can only be submitted on an Approved or Draft quotation.");
    }

    const clampedRequestedDiscount = Math.min(100, Math.max(0, Number(requestedDiscountPercentage) || 0));

    // Apply requested discount across quote lines
    for (const line of (quotation.lines || [])) {
      line.discountPct = clampedRequestedDiscount;
      line.discountPercentage = clampedRequestedDiscount;
      line.unitDiscountPercentage = clampedRequestedDiscount;
      const discountAmount = Math.round(line.unitListPriceCents * (clampedRequestedDiscount / 100));
      line.netUnitPriceCents = line.unitListPriceCents - discountAmount;
      line.lineSubtotalCents = line.netUnitPriceCents * line.quantity;
      line.grossMarginCents = line.lineSubtotalCents - line.lineCostCents;
      line.grossMarginPct = line.lineSubtotalCents > 0
        ? Math.round(((line.grossMarginCents / line.lineSubtotalCents) * 100) * 10) / 10
        : 0;
    }

    QuotationCalculator.recalculateQuotation(quotation);

    // Evaluate customer counter against escalation bounds
    const customer = this.customerRepository.findById(quotation.customerId);
    const assessment = EscalationEngine.assessEscalation(quotation, customer, []);

    quotation.blendedRiskScore = assessment.blendedRiskScore;
    quotation.escalationTier = assessment.requiredTier;
    quotation.status = "PendingApproval";
    quotation.discountPercentage = clampedRequestedDiscount;
    quotation.discountPct = clampedRequestedDiscount;
    quotation.customerCounterNotes = customerNotes || "";

    quotation.approvalChain.push({
      action: "CustomerCounterSubmitted",
      role: "Customer",
      approverName: quotation.customerName,
      timestamp: new Date().toISOString(),
      note: customerNotes
        ? `Customer counter: ${clampedRequestedDiscount}% discount. Note: "${customerNotes}"`
        : `Customer counter: ${clampedRequestedDiscount}% discount requested.`,
    });

    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitCounterOffer(quotation, {
        counterDiscountPct: clampedRequestedDiscount,
        note: customerNotes,
      });
    }

    return quotation;
  }

  /**
   * Final customer 1-click confirmation converting quote into an active commercial contract.
   * Edge Case 6 Defense: Validates quotation expiration timestamp before confirmation.
   * 
   * @param {string} quotationId
   * @param {number|undefined} [expectedVersion]
   * @returns {Object} Confirmed quotation
   */
  confirmFinalQuotation(quotationId, expectedVersion) {
    const quotation = this.getQuotationById(quotationId);
    this._assertConcurrencyVersion(quotation, expectedVersion);

    if (quotation.status !== "Approved") {
      throw new ValidationError(`Quotation must be in 'Approved' status to be confirmed. Cannot confirm quotation in '${quotation.status}' state.`);
    }

    // Edge Case 6: Expiration timestamp verification
    if (quotation.validUntil) {
      const isExpired = Date.now() > new Date(quotation.validUntil).getTime();
      if (isExpired) {
        quotation.status = "Expired";
        quotation.approvalChain.push({
          action: "QuotationExpired",
          role: "System",
          approverName: "ExpirationSentinel",
          timestamp: new Date().toISOString(),
          note: `Quote expired on ${quotation.validUntil}. Confirmation blocked.`,
        });
        this._syncCompatibilityAliases(quotation);
        this._incrementVersion(quotation);
        this.quotationRepository.save(quotation);
        throw new ValidationError(`Quotation expired on ${quotation.validUntil}. Cannot confirm an expired quote.`);
      }
    }

    quotation.status = "Confirmed";
    quotation.confirmedAt = new Date().toISOString();

    quotation.approvalChain.push({
      action: "ConfirmedByCustomer",
      role: "Customer",
      approverName: quotation.customerName,
      timestamp: new Date().toISOString(),
      note: "Customer executed 1-click confirmation. Commercial contract locked.",
    });

    this._syncCompatibilityAliases(quotation);
    this._incrementVersion(quotation);
    this.quotationRepository.save(quotation);

    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitQuoteConfirmed(quotation);
    }

    return quotation;
  }

  /**
   * Adds and persists a commercial negotiation chat message on a quotation.
   * Atomic persistence to SQLite before real-time WebSocket egress.
   * 
   * @param {Object} params
   * @param {string} params.quoteId
   * @param {string} params.senderId
   * @param {string} params.senderRole
   * @param {string} [params.senderName]
   * @param {string} params.message
   * @returns {Object} Persisted message record
   */
  addNegotiationMessage({ quoteId, senderId, senderRole, senderName, message }) {
    const quotation = this.getQuotationById(quoteId);
    if (!quotation) {
      throw new NotFoundError(`Quotation '${quoteId}' not found.`);
    }

    if (!message || typeof message !== "string" || !message.trim()) {
      throw new ValidationError("Message body cannot be empty.");
    }

    const messageRecord = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      quotationId: quoteId,
      senderId: senderId || "anonymous",
      senderRole: senderRole || "Customer",
      senderName: senderName || senderRole || "Participant",
      message: message.trim(),
      quoteVersion: quotation.version || 1,
      sentAt: new Date().toISOString(),
    };

    // 1. Persist to SQLite if available
    if (this.database && this.database.db && typeof this.database.db.prepare === "function") {
      try {
        const stmt = this.database.db.prepare(`
          INSERT INTO negotiation_messages (
            id, quotation_id, sender_role, sender_name, proposed_discount_percent, message_text, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
          messageRecord.id,
          messageRecord.quotationId,
          messageRecord.senderRole,
          messageRecord.senderName,
          messageRecord.proposedDiscountPercent || null,
          messageRecord.message,
          messageRecord.sentAt
        );
      } catch (err) {
        console.error("Failed to insert negotiation_message into SQLite:", err);
      }
    }

    // In-memory array fallback
    if (!this.inMemoryMessages.has(quoteId)) {
      this.inMemoryMessages.set(quoteId, []);
    }
    this.inMemoryMessages.get(quoteId).push(messageRecord);

    // 2. Real-time WebSocket egress
    if (this.eventBroadcaster) {
      this.eventBroadcaster.emitChatMessage(messageRecord);
    }

    return messageRecord;
  }

  /**
   * Retrieves all negotiation chat messages for a quotation.
   * 
   * @param {string} quoteId
   * @returns {Array<Object>}
   */
  getNegotiationMessages(quoteId) {
    if (this.database && this.database.db && typeof this.database.db.prepare === "function") {
      try {
        const stmt = this.database.db.prepare(`
          SELECT * FROM negotiation_messages
          WHERE quotation_id = ?
          ORDER BY created_at ASC
        `);
        const rows = stmt.all(quoteId);
        if (rows && rows.length > 0) {
          return rows.map(r => ({
            id: r.id,
            quotationId: r.quotation_id,
            senderId: r.sender_role,
            senderRole: r.sender_role,
            senderName: r.sender_name,
            proposedDiscountPercent: r.proposed_discount_percent,
            message: r.message_text,
            messageText: r.message_text,
            sentAt: r.created_at,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {
        console.error("Failed to query negotiation_messages from SQLite:", err);
      }
    }

    return this.inMemoryMessages.get(quoteId) || [];
  }
}
