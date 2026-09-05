/**
 * DealFlow360 - Enterprise Hybrid Billing & GAAP Invoice Reconciliation Engine
 * Phase 10: Real-Life Business Scenarios, Hybrid Subscriptions & Accounting Invariants
 * 
 * Strict Business Invariants:
 * 1. Integer Cents Precision: All amounts (MRR, ARR, invoices, proration, taxes) in integer cents.
 * 2. GAAP Shipping Fulfillment Rule: Physical Hardware cannot be invoiced prior to dispatch ('Shipped' | 'Delivered').
 * 3. Subscription Activation Rule: SaaS subscriptions and SLA contracts invoice period 1 immediately upon quote confirmation.
 * 4. Mid-Cycle Proration: Exact daily integer-cents proration on plan/seat changes.
 * 5. Credit Ledger Replenishment: Payment receipt immediately restores customer available credit line.
 */

/**
 * Creates a formal recurring Subscription Contract from confirmed quote subscription lines.
 * 
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.quotationId
 * @param {string} params.customerId
 * @param {string} params.customerName
 * @param {Array<Object>} params.lines
 * @param {string} [params.startDate]
 * @param {'Monthly' | 'Quarterly' | 'Annual'} [params.billingCycle='Monthly']
 * @param {number} [params.termMonths=12]
 * @returns {Object} SubscriptionContract
 */
export function createSubscriptionContract({
  id = `SUB-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  quotationId,
  customerId,
  customerName,
  lines = [],
  startDate = new Date().toISOString().split('T')[0],
  billingCycle = 'Monthly',
  termMonths = 12,
}) {
  const subscriptionLines = lines.filter(
    (l) => (l.category || '').toLowerCase() === 'subscription'
  );

  if (subscriptionLines.length === 0) {
    return null;
  }

  // Calculate monthly recurring revenue (MRR) and cycle base
  let cycleSubtotalCents = 0;
  const contractItems = subscriptionLines.map((line) => {
    const unitPrice =
      line.unitPriceCents ||
      line.unitListPriceCents ||
      line.listPriceCents ||
      line.netUnitPriceCents ||
      line.netPriceCents ||
      Math.round((line.unitPrice || 0) * 100);
    const qty = line.quantity || 1;
    const discount = line.discountPercent ?? line.discountPercentage ?? line.discountPct ?? 0;
    const lineNet = line.lineSubtotalCents ?? Math.round(unitPrice * qty * (1 - discount / 100));
    cycleSubtotalCents += lineNet;

    return {
      sku: line.sku || line.productId,
      description: line.description || line.productName || line.name,
      quantity: qty,
      unitPriceCents: unitPrice,
      discountPercent: discount,
      lineNetCents: lineNet,
    };
  });

  // Normalize MRR & ARR based on billing cycle
  let mrrCents = 0;
  let arrCents = 0;

  if (billingCycle === 'Monthly') {
    mrrCents = cycleSubtotalCents;
    arrCents = mrrCents * 12;
  } else if (billingCycle === 'Quarterly') {
    mrrCents = Math.round(cycleSubtotalCents / 3);
    arrCents = mrrCents * 12;
  } else if (billingCycle === 'Annual') {
    mrrCents = Math.round(cycleSubtotalCents / 12);
    arrCents = cycleSubtotalCents;
  }

  // Compute Next Billing Date
  const start = new Date(startDate);
  const nextBilling = new Date(start);
  if (billingCycle === 'Monthly') {
    nextBilling.setMonth(nextBilling.getMonth() + 1);
  } else if (billingCycle === 'Quarterly') {
    nextBilling.setMonth(nextBilling.getMonth() + 3);
  } else {
    nextBilling.setFullYear(nextBilling.getFullYear() + 1);
  }

  return {
    id,
    quotationId,
    customerId,
    customerName,
    status: 'Active', // 'Active' | 'Paused' | 'Cancelled'
    billingCycle,
    termMonths,
    startDate,
    nextBillingDate: nextBilling.toISOString().split('T')[0],
    cycleAmountCents: cycleSubtotalCents,
    mrrCents,
    arrCents,
    items: contractItems,
    version: 1,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Mid-Cycle Subscription Proration Calculator
 * 
 * Formula:
 * ProratedCredit = OldPrice * (DaysRemaining / TotalDaysInCycle)
 * ProratedCharge = NewPrice * (DaysRemaining / TotalDaysInCycle)
 * NetAdjustment = ProratedCharge - ProratedCredit
 * 
 * @param {Object} params
 * @param {number} params.currentPriceCents
 * @param {number} params.newPriceCents
 * @param {string} params.effectiveDate - YYYY-MM-DD
 * @param {string} params.cycleStartDate - YYYY-MM-DD
 * @param {string} params.cycleEndDate - YYYY-MM-DD
 * @returns {Object} ProrationResult
 */
export function calculateProration({
  currentPriceCents,
  newPriceCents,
  effectiveDate,
  cycleStartDate,
  cycleEndDate,
}) {
  const eff = new Date(effectiveDate).getTime();
  const start = new Date(cycleStartDate).getTime();
  const end = new Date(cycleEndDate).getTime();

  if (isNaN(eff) || isNaN(start) || isNaN(end)) {
    throw new Error('Invalid date provided to calculateProration');
  }

  if (eff < start || eff > end) {
    throw new Error('Effective date must fall within cycle start and end dates');
  }

  const msPerDay = 1000 * 60 * 60 * 24;
  const totalDaysInCycle = Math.max(1, Math.round((end - start) / msPerDay));
  const daysRemaining = Math.max(0, Math.round((end - eff) / msPerDay));
  const daysElapsed = totalDaysInCycle - daysRemaining;

  const proratedCreditCents = Math.round((currentPriceCents * daysRemaining) / totalDaysInCycle);
  const proratedChargeCents = Math.round((newPriceCents * daysRemaining) / totalDaysInCycle);
  const netAdjustmentCents = proratedChargeCents - proratedCreditCents;

  return {
    totalDaysInCycle,
    daysElapsed,
    daysRemaining,
    proratedCreditCents,
    proratedChargeCents,
    netAdjustmentCents,
    isUpgrade: newPriceCents > currentPriceCents,
    summary:
      netAdjustmentCents >= 0
        ? `Upgrade adjustment: +$${(netAdjustmentCents / 100).toFixed(2)} due for remaining ${daysRemaining}/${totalDaysInCycle} days.`
        : `Downgrade adjustment: -$${(Math.abs(netAdjustmentCents) / 100).toFixed(2)} credit applied for remaining ${daysRemaining}/${totalDaysInCycle} days.`,
  };
}

/**
 * GAAP Milestone Invoicing Engine
 * Reconciles confirmed quote lines against live shipment fulfillment states.
 * 
 * GAAP Invariant:
 * - Hardware lines only billable if corresponding shipment has reached 'Shipped' or 'Delivered'.
 * - Unshipped hardware is deferred until dispatch.
 * - Subscriptions & Services billable upon contract confirmation.
 * 
 * @param {Object} params
 * @param {Object} params.quote
 * @param {Array<Object>} [params.shipments=[]]
 * @param {Array<Object>} [params.existingInvoices=[]]
 * @returns {Object} ReconciliationResult
 */
export function reconcileInvoicesForQuote({ quote, shipments = [], existingInvoices = [] }) {
  if (!quote || !quote.lines) {
    return { canGenerateInvoice: false, invoice: null, unbilledLines: [], reason: 'No quote lines' };
  }

  // Determine already-invoiced quantities per SKU
  const alreadyInvoicedQtyBySku = {};
  for (const inv of existingInvoices) {
    for (const item of inv.items || []) {
      alreadyInvoicedQtyBySku[item.sku] =
        (alreadyInvoicedQtyBySku[item.sku] || 0) + (item.quantity || 0);
    }
  }

  // Determine shipped/delivered quantities per SKU from fulfillment orders
  const shippedQtyBySku = {};
  for (const shipment of shipments) {
    const status = (shipment.status || '').toLowerCase();
    if (status === 'shipped' || status === 'delivered') {
      for (const item of shipment.items || []) {
        const sku = item.sku || item.productId;
        shippedQtyBySku[sku] = (shippedQtyBySku[sku] || 0) + (item.quantity || 0);
      }
    }
  }

  const billableItems = [];
  const unbilledLines = [];

  for (const line of quote.lines) {
    const sku = line.sku || line.productId;
    const category = (line.category || 'Hardware').toLowerCase();
    const orderedQty = line.quantity || 1;
    const invoicedQty = alreadyInvoicedQtyBySku[sku] || 0;
    const remainingToInvoice = Math.max(0, orderedQty - invoicedQty);

    if (remainingToInvoice <= 0) {
      continue; // Fully billed already
    }

    if (category === 'hardware') {
      // Shipped quantity available to bill
      const totalShipped = shippedQtyBySku[sku] || 0;
      const billableQty = Math.min(remainingToInvoice, Math.max(0, totalShipped - invoicedQty));

      if (billableQty > 0) {
        const unitPrice =
          line.unitPriceCents ||
          line.unitListPriceCents ||
          line.listPriceCents ||
          line.netUnitPriceCents ||
          line.netPriceCents ||
          Math.round((line.unitPrice || 0) * 100);
        const discount = line.discountPercent ?? line.discountPercentage ?? line.discountPct ?? 0;
        const lineNet = Math.round(unitPrice * billableQty * (1 - discount / 100));

        billableItems.push({
          sku,
          description: line.description || line.productName || line.name,
          category: 'Hardware',
          quantity: billableQty,
          unitPriceCents: unitPrice,
          discountPercent: discount,
          lineNetCents: lineNet,
        });
      }

      const unshippedRemaining = remainingToInvoice - billableQty;
      if (unshippedRemaining > 0) {
        unbilledLines.push({
          sku,
          description: line.description || line.productName || line.name,
          category: 'Hardware',
          unshippedQty: unshippedRemaining,
          reason: 'Awaiting warehouse dispatch from regional depot (GAAP milestone requirement)',
        });
      }
    } else {
      // Subscriptions and Services are billable upon contract confirmation
      const unitPrice =
        line.unitPriceCents ||
        line.unitListPriceCents ||
        line.listPriceCents ||
        line.netUnitPriceCents ||
        line.netPriceCents ||
        Math.round((line.unitPrice || 0) * 100);
      const discount = line.discountPercent ?? line.discountPercentage ?? line.discountPct ?? 0;
      const lineNet = Math.round(unitPrice * remainingToInvoice * (1 - discount / 100));

      billableItems.push({
        sku,
        description: line.description || line.productName || line.name,
        category: category === 'subscription' ? 'Subscription' : 'Service',
        quantity: remainingToInvoice,
        unitPriceCents: unitPrice,
        discountPercent: discount,
        lineNetCents: lineNet,
      });
    }
  }

  if (billableItems.length === 0) {
    return {
      canGenerateInvoice: false,
      invoice: null,
      unbilledLines,
      reason:
        unbilledLines.length > 0
          ? 'Cannot issue invoice: All pending items are physical hardware awaiting warehouse shipment.'
          : 'All order lines have already been invoiced.',
    };
  }

  const subtotalCents = billableItems.reduce((acc, item) => acc + item.lineNetCents, 0);
  const taxRate = quote.taxRate || 0.0825; // 8.25% default sales tax
  const taxCents = Math.round(subtotalCents * taxRate);
  const totalCents = subtotalCents + taxCents;

  const invoiceNumber = `INV-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30); // Net 30 default

  const invoice = {
    id: invoiceNumber,
    quotationId: quote.id,
    customerId: quote.customerId,
    customerName: quote.customerName,
    status: 'Issued', // 'Issued' | 'PartiallyPaid' | 'Paid' | 'Void'
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: dueDate.toISOString().split('T')[0],
    subtotalCents,
    taxCents,
    totalCents,
    paidAmountCents: 0,
    remainingBalanceCents: totalCents,
    items: billableItems,
    createdAt: new Date().toISOString(),
  };

  return {
    canGenerateInvoice: true,
    invoice,
    unbilledLines,
    reason:
      unbilledLines.length > 0
        ? `Partial milestone invoice generated for ${billableItems.length} delivered/activated item(s). ${unbilledLines.length} item(s) pending shipment.`
        : 'Full invoice generated successfully.',
  };
}

/**
 * Records payment receipt against an invoice and replenishes customer credit limit.
 * 
 * @param {Object} params
 * @param {Object} params.invoice
 * @param {number} params.paymentAmountCents
 * @param {Object} params.customer
 * @param {string} [params.paymentMethod='WireTransfer']
 * @returns {Object} PaymentResult
 */
export function recordInvoicePayment({
  invoice,
  paymentAmountCents,
  customer,
  paymentMethod = 'WireTransfer',
}) {
  if (!invoice) {
    throw new Error('Invoice is required to record payment');
  }

  if (paymentAmountCents <= 0) {
    throw new Error('Payment amount must be greater than zero');
  }

  if (paymentAmountCents > invoice.remainingBalanceCents) {
    throw new Error(
      `Payment amount ($${(paymentAmountCents / 100).toFixed(2)}) exceeds remaining invoice balance ($${(invoice.remainingBalanceCents / 100).toFixed(2)})`
    );
  }

  const updatedPaidCents = (invoice.paidAmountCents || 0) + paymentAmountCents;
  const updatedRemainingCents = invoice.totalCents - updatedPaidCents;
  const newStatus = updatedRemainingCents === 0 ? 'Paid' : 'PartiallyPaid';

  const updatedInvoice = {
    ...invoice,
    paidAmountCents: updatedPaidCents,
    remainingBalanceCents: updatedRemainingCents,
    status: newStatus,
    updatedAt: new Date().toISOString(),
  };

  // Replenish customer available credit
  let updatedCustomer = null;
  if (customer) {
    const limit = customer.creditLimitCents || 0;
    const currentAvailable = customer.availableCreditCents ?? limit;
    const replenished = Math.min(limit, currentAvailable + paymentAmountCents);

    updatedCustomer = {
      ...customer,
      availableCreditCents: replenished,
    };
  }

  return {
    success: true,
    invoice: updatedInvoice,
    customer: updatedCustomer,
    receipt: {
      transactionId: `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      invoiceId: invoice.id,
      amountCents: paymentAmountCents,
      paymentMethod,
      timestamp: new Date().toISOString(),
      fullySettled: newStatus === 'Paid',
    },
  };
}
