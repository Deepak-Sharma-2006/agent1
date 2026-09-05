/**
 * DealFlow360 - Phase 10: Production Scenarios & Business Invariants Test Suite
 * 
 * Verifies:
 * 1. Hybrid Subscription Contracts & Billing Cycles (Monthly, Quarterly, Annual)
 * 2. Mid-Cycle Proration Integer Cents Precision Arithmetic
 * 3. GAAP Milestone Invoicing Protection (Hardware unshipped vs partial dispatch vs complete)
 * 4. Payment Reconciliation & Customer Credit Line Replenishment
 * 5. Deal Health & Pipeline Anomaly Surveillance (Stalled deals, rep anomalies, delivery slippage)
 * 6. REST API Endpoints for Subscriptions, Invoices, Payments, and Surveillance
 */

import test from "node:test";
import assert from "node:assert/strict";
import {
  createSubscriptionContract,
  calculateProration,
  reconcileInvoicesForQuote,
  recordInvoicePayment,
  evaluateDealHealth,
  analyzePipelineHealth,
} from "../src/domain/index.js";
import { getRepositories } from "../src/db/database-factory.js";
import { QuotationService } from "../src/services/quotation-service.js";
import { createServer } from "../src/index.js";

test("Phase 10: Enterprise Production Scenarios & Business Invariants", async (t) => {
  const repos = getRepositories("memory", { forceNew: true, seed: true });
  const quotationService = new QuotationService({
    quotationRepository: repos.quotationRepository,
    customerRepository: repos.customerRepository,
    productRepository: repos.productRepository,
    incentiveRuleRepository: repos.incentiveRuleRepository,
    inventoryRepository: repos.inventoryRepository,
    warehouseRepository: repos.warehouseRepository,
    shipmentRepository: repos.shipmentRepository,
    backorderRepository: repos.backorderRepository,
    subscriptionRepository: repos.subscriptionRepository,
    invoiceRepository: repos.invoiceRepository,
  });

  await t.test("1. Hybrid Subscriptions & Recurring Billing Schedule", async (st) => {
    await st.test("Creates formal SubscriptionContract from confirmed subscription lines", () => {
      const contract = createSubscriptionContract({
        quotationId: "q-hybrid-001",
        customerId: "cust-acme-01",
        customerName: "Acme Industrial Corp",
        lines: [
          {
            sku: "SRV-PRO-01",
            category: "Hardware",
            quantity: 5,
            unitPriceCents: 150000,
          },
          {
            sku: "SUB-CLOUD-01",
            category: "Subscription",
            description: "DealFlow360 Cloud Enterprise Seat",
            quantity: 10,
            unitPriceCents: 5000, // $50.00/seat/mo
            discountPercent: 10, // 10% discount -> $45.00 net
          },
        ],
        startDate: "2026-10-01",
        billingCycle: "Monthly",
        termMonths: 12,
      });

      assert.ok(contract, "Contract should be created for subscription lines");
      assert.equal(contract.status, "Active");
      assert.equal(contract.billingCycle, "Monthly");
      // 10 * $50 * (1 - 0.10) = $450/month = 45000 cents
      assert.equal(contract.mrrCents, 45000);
      assert.equal(contract.arrCents, 45000 * 12);
      assert.equal(contract.nextBillingDate, "2026-11-01");
      assert.equal(contract.items.length, 1);
      assert.equal(contract.items[0].sku, "SUB-CLOUD-01");
    });

    await st.test("Returns null if quote has zero subscription lines", () => {
      const contract = createSubscriptionContract({
        quotationId: "q-hw-only",
        customerId: "cust-acme-01",
        customerName: "Acme Industrial Corp",
        lines: [
          { sku: "HW-01", category: "Hardware", quantity: 1, unitPriceCents: 10000 },
          { sku: "SVC-01", category: "Service", quantity: 1, unitPriceCents: 20000 },
        ],
      });
      assert.equal(contract, null);
    });

    await st.test("Calculates Annual and Quarterly billing milestones correctly", () => {
      const annualContract = createSubscriptionContract({
        quotationId: "q-annual-01",
        customerId: "cust-acme-01",
        customerName: "Acme Industrial Corp",
        lines: [
          {
            sku: "SUB-ANNUAL-01",
            category: "Subscription",
            quantity: 1,
            unitPriceCents: 120000, // $1,200.00 / year
          },
        ],
        startDate: "2026-01-01",
        billingCycle: "Annual",
      });

      assert.equal(annualContract.billingCycle, "Annual");
      assert.equal(annualContract.arrCents, 120000);
      assert.equal(annualContract.mrrCents, 10000); // 120000 / 12
      assert.equal(annualContract.nextBillingDate, "2027-01-01");
    });
  });

  await t.test("2. Mid-Cycle Proration Integer Cents Precision Math", async (st) => {
    await st.test("Calculates exact daily proration for mid-cycle plan upgrade", () => {
      // 30-day month from 2026-06-01 to 2026-07-01
      // Upgrade on 2026-06-21 (20 days elapsed, 10 days remaining)
      // Old plan: $1,200/mo (120,000 cents)
      // New plan: $2,400/mo (240,000 cents)
      const proration = calculateProration({
        currentPriceCents: 120000,
        newPriceCents: 240000,
        effectiveDate: "2026-06-21",
        cycleStartDate: "2026-06-01",
        cycleEndDate: "2026-07-01",
      });

      assert.equal(proration.totalDaysInCycle, 30);
      assert.equal(proration.daysElapsed, 20);
      assert.equal(proration.daysRemaining, 10);
      assert.equal(proration.isUpgrade, true);

      // Prorated credit for unused 10 days of old plan: 120000 * 10 / 30 = 40000 cents ($400.00)
      assert.equal(proration.proratedCreditCents, 40000);
      // Prorated charge for 10 days on new plan: 240000 * 10 / 30 = 80000 cents ($800.00)
      assert.equal(proration.proratedChargeCents, 80000);
      // Net adjustment due: 80000 - 40000 = 40000 cents ($400.00)
      assert.equal(proration.netAdjustmentCents, 40000);
      assert.ok(proration.summary.includes("+$400.00"));
    });

    await st.test("Calculates exact credit for mid-cycle plan downgrade", () => {
      const proration = calculateProration({
        currentPriceCents: 300000, // $3,000/mo
        newPriceCents: 150000, // $1,500/mo
        effectiveDate: "2026-06-16", // 15 days remaining in 30 day cycle
        cycleStartDate: "2026-06-01",
        cycleEndDate: "2026-07-01",
      });

      assert.equal(proration.daysRemaining, 15);
      assert.equal(proration.isUpgrade, false);
      // Credit: 300000 * 15 / 30 = 150000 cents
      // Charge: 150000 * 15 / 30 = 75000 cents
      // Net: 75000 - 150000 = -75000 cents (credit of $750.00)
      assert.equal(proration.netAdjustmentCents, -75000);
      assert.ok(proration.summary.includes("-$750.00 credit"));
    });

    await st.test("Rejects effective date outside cycle boundaries", () => {
      assert.throws(() => {
        calculateProration({
          currentPriceCents: 10000,
          newPriceCents: 20000,
          effectiveDate: "2026-07-15",
          cycleStartDate: "2026-06-01",
          cycleEndDate: "2026-07-01",
        });
      }, /Effective date must fall within cycle/);
    });
  });

  await t.test("3. GAAP Milestone Invoicing Protection", async (st) => {
    const testQuote = {
      id: "q-gaap-test-01",
      customerId: "cust-acme-01",
      customerName: "Acme Industrial Corp",
      status: "Confirmed",
      lines: [
        {
          sku: "HW-LAPTOP-01",
          description: "ThinkPad Workstation",
          category: "Hardware",
          quantity: 50,
          unitPriceCents: 100000, // $1,000.00
          discountPercent: 0,
        },
        {
          sku: "SVC-ONBOARD-01",
          description: "Enterprise Onboarding Service",
          category: "Service",
          quantity: 1,
          unitPriceCents: 500000, // $5,000.00
          discountPercent: 0,
        },
        {
          sku: "SUB-ENTERPRISE-01",
          description: "Annual SaaS Support License",
          category: "Subscription",
          quantity: 1,
          unitPriceCents: 1200000, // $12,000.00
          discountPercent: 0,
        },
      ],
    };

    await st.test("Blocks invoicing of hardware before shipment (GAAP milestone check)", () => {
      // Zero shipments exist
      const recon = reconcileInvoicesForQuote({
        quote: testQuote,
        shipments: [],
        existingInvoices: [],
      });

      assert.equal(recon.canGenerateInvoice, true);
      assert.ok(recon.invoice);
      // Service and Subscription are invoiced, but all 50 hardware laptops are deferred
      const invoicedSkus = recon.invoice.items.map((i) => i.sku);
      assert.ok(invoicedSkus.includes("SVC-ONBOARD-01"));
      assert.ok(invoicedSkus.includes("SUB-ENTERPRISE-01"));
      assert.ok(!invoicedSkus.includes("HW-LAPTOP-01"), "Hardware must NOT be invoiced before dispatch");
      assert.equal(recon.unbilledLines.length, 1);
      assert.equal(recon.unbilledLines[0].sku, "HW-LAPTOP-01");
      assert.equal(recon.unbilledLines[0].unshippedQty, 50);
    });

    await st.test("Generates partial invoice when Chicago depot ships 30 of 50 units", () => {
      const partialShipments = [
        {
          id: "shp-chi-01",
          warehouseId: "WH-CHI",
          status: "Shipped",
          items: [{ sku: "HW-LAPTOP-01", quantity: 30 }],
        },
      ];

      const recon = reconcileInvoicesForQuote({
        quote: testQuote,
        shipments: partialShipments,
        existingInvoices: [],
      });

      assert.equal(recon.canGenerateInvoice, true);
      const hwItem = recon.invoice.items.find((i) => i.sku === "HW-LAPTOP-01");
      assert.ok(hwItem);
      assert.equal(hwItem.quantity, 30, "Exactly 30 shipped units should be invoiced");
      assert.equal(recon.unbilledLines[0].unshippedQty, 20, "20 units remain unbilled pending dispatch");
    });

    await st.test("Prevents double-invoicing already invoiced shipments", () => {
      const shipments = [
        {
          id: "shp-chi-01",
          warehouseId: "WH-CHI",
          status: "Shipped",
          items: [{ sku: "HW-LAPTOP-01", quantity: 30 }],
        },
      ];
      const existingInvoices = [
        {
          id: "inv-001",
          items: [
            { sku: "HW-LAPTOP-01", quantity: 30 },
            { sku: "SVC-ONBOARD-01", quantity: 1 },
            { sku: "SUB-ENTERPRISE-01", quantity: 1 },
          ],
        },
      ];

      const recon = reconcileInvoicesForQuote({
        quote: testQuote,
        shipments,
        existingInvoices,
      });

      // No new invoice should be generated because the 30 units are already invoiced,
      // and remaining 20 units have not yet shipped
      assert.equal(recon.canGenerateInvoice, false);
      assert.equal(recon.invoice, null);
      assert.equal(recon.unbilledLines.length, 1);
      assert.equal(recon.unbilledLines[0].unshippedQty, 20);
    });

    await st.test("Generates final milestone invoice when Dallas depot ships remaining 20 units", () => {
      const allShipments = [
        {
          id: "shp-chi-01",
          warehouseId: "WH-CHI",
          status: "Shipped",
          items: [{ sku: "HW-LAPTOP-01", quantity: 30 }],
        },
        {
          id: "shp-dfw-02",
          warehouseId: "WH-DFW",
          status: "Shipped",
          items: [{ sku: "HW-LAPTOP-01", quantity: 20 }],
        },
      ];
      const existingInvoices = [
        {
          id: "inv-001",
          items: [
            { sku: "HW-LAPTOP-01", quantity: 30 },
            { sku: "SVC-ONBOARD-01", quantity: 1 },
            { sku: "SUB-ENTERPRISE-01", quantity: 1 },
          ],
        },
      ];

      const recon = reconcileInvoicesForQuote({
        quote: testQuote,
        shipments: allShipments,
        existingInvoices,
      });

      assert.equal(recon.canGenerateInvoice, true);
      assert.equal(recon.invoice.items.length, 1);
      assert.equal(recon.invoice.items[0].sku, "HW-LAPTOP-01");
      assert.equal(recon.invoice.items[0].quantity, 20);
      assert.equal(recon.unbilledLines.length, 0, "All items now fully invoiced");
    });
  });

  await t.test("4. Payment Reconciliation & Credit Line Replenishment", async (st) => {
    const customer = {
      id: "cust-acme-01",
      creditLimitCents: 10000000, // $100,000.00
      availableCreditCents: 2000000, // $20,000.00 available
    };

    const invoice = {
      id: "inv-test-01",
      totalCents: 3000000, // $30,000.00
      paidAmountCents: 0,
      remainingBalanceCents: 3000000,
      status: "Issued",
    };

    await st.test("Applies partial payment and replenishes customer available credit", () => {
      const paymentRes = recordInvoicePayment({
        invoice,
        paymentAmountCents: 1500000, // $15,000.00
        customer,
        paymentMethod: "WireTransfer",
      });

      assert.equal(paymentRes.success, true);
      assert.equal(paymentRes.invoice.status, "PartiallyPaid");
      assert.equal(paymentRes.invoice.paidAmountCents, 1500000);
      assert.equal(paymentRes.invoice.remainingBalanceCents, 1500000);
      assert.equal(paymentRes.customer.availableCreditCents, 3500000); // 20k + 15k
      assert.equal(paymentRes.receipt.fullySettled, false);
    });

    await st.test("Settles remaining balance to Paid and caps credit replenishment at limit", () => {
      const partiallyPaidInvoice = {
        id: "inv-test-01",
        totalCents: 3000000,
        paidAmountCents: 1500000,
        remainingBalanceCents: 1500000,
        status: "PartiallyPaid",
      };

      const paymentRes = recordInvoicePayment({
        invoice: partiallyPaidInvoice,
        paymentAmountCents: 1500000,
        customer: { ...customer, availableCreditCents: 9000000 },
        paymentMethod: "ACH",
      });

      assert.equal(paymentRes.invoice.status, "Paid");
      assert.equal(paymentRes.invoice.remainingBalanceCents, 0);
      assert.equal(paymentRes.customer.availableCreditCents, 10000000); // Capped at creditLimit
      assert.equal(paymentRes.receipt.fullySettled, true);
    });

    await st.test("Rejects payment amount exceeding remaining balance", () => {
      assert.throws(() => {
        recordInvoicePayment({
          invoice,
          paymentAmountCents: 4000000, // $40,000 on a $30,000 invoice
          customer,
        });
      }, /exceeds remaining invoice balance/);
    });
  });

  await t.test("5. Deal Health & Commercial Pipeline Anomaly Surveillance", async (st) => {
    await st.test("Detects stalled deal idle for > 7 days", () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const stalledQuote = {
        id: "q-stalled-01",
        customerName: "Global Logistics Ltd",
        status: "PendingApproval",
        updatedAt: tenDaysAgo,
        lines: [{ sku: "HW-01", quantity: 10, unitPriceCents: 50000 }],
      };

      const health = evaluateDealHealth({
        quote: stalledQuote,
        repStats: { averageDiscountPct: 7.0 },
      });

      assert.equal(health.isStalled, true);
      assert.ok(health.idleDays >= 10);
      assert.ok(health.riskSignals.some((s) => s.type === "STALLED_DEAL"));
      assert.ok(["AtRisk", "Critical"].includes(health.status));
    });

    await st.test("Detects rep discount variance anomaly (> 5% above historical rep average)", () => {
      const normalTimestamp = new Date().toISOString();
      const anomalyQuote = {
        id: "q-anomaly-01",
        customerName: "FastGrowth Inc",
        status: "Draft",
        updatedAt: normalTimestamp,
        overallDiscountPercent: 18.0, // 18% discount offered
        lines: [{ sku: "HW-01", quantity: 5, unitPriceCents: 100000, discountPercent: 18.0 }],
      };

      const health = evaluateDealHealth({
        quote: anomalyQuote,
        repStats: { averageDiscountPct: 7.5 }, // Rep average is 7.5%, delta is 10.5% (> 5% limit)
      });

      assert.equal(health.isDiscountAnomaly, true);
      assert.ok(health.riskSignals.some((s) => s.type === "DISCOUNT_ANOMALY"));
      assert.equal(health.status, "AtRisk");
      assert.ok(health.recommendedAction.includes("Sales Manager Audit"));
    });

    await st.test("Detects delivery slippage risk due to pending backorders", () => {
      const normalQuote = {
        id: "q-delivery-risk-01",
        customerName: "Precision Dynamics",
        status: "Draft",
        updatedAt: new Date().toISOString(),
        overallDiscountPercent: 5.0,
      };

      const backorders = [
        {
          id: "bo-001",
          quotationId: "q-delivery-risk-01",
          productId: "p-server-01",
          quantity: 15,
          status: "Pending",
        },
      ];

      const health = evaluateDealHealth({
        quote: normalQuote,
        repStats: { averageDiscountPct: 8.0 },
        backorders,
      });

      assert.equal(health.isDeliverySlippageRisk, true);
      assert.ok(health.riskSignals.some((s) => s.type === "DELIVERY_SLIPPAGE"));
    });

    await st.test("Evaluates pipeline-wide surveillance metrics and alerts", () => {
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();
      const quotes = [
        {
          id: "q-1",
          status: "PendingApproval",
          updatedAt: tenDaysAgo,
          overallDiscountPercent: 4.0,
          salesRepName: "Alice Walker",
        },
        {
          id: "q-2",
          status: "Draft",
          updatedAt: new Date().toISOString(),
          overallDiscountPercent: 19.0,
          salesRepName: "Bob Miller",
        },
        {
          id: "q-3",
          status: "Confirmed",
          updatedAt: new Date().toISOString(),
          overallDiscountPercent: 5.0,
          salesRepName: "Charlie Davis",
        },
      ];

      const pipeline = analyzePipelineHealth(quotes, {
        "Alice Walker": { averageDiscountPct: 6.0 },
        "Bob Miller": { averageDiscountPct: 7.0 },
      });

      assert.equal(pipeline.totalEvaluated, 3);
      assert.equal(pipeline.counts.stalledDeals, 1);
      assert.equal(pipeline.counts.discountAnomalies, 1);
      assert.ok(pipeline.actionableAlerts.length >= 2);
    });
  });

  await t.test("6. REST API Endpoints & Server Integration", async (st) => {
    const server = createServer({ port: 0 }, { quotationService, repositories: repos });
    await new Promise((resolve) => server.listen(0, resolve));
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    try {
      // 1. GET /api/deal-health
      const healthRes = await fetch(`${baseUrl}/api/deal-health`);
      assert.equal(healthRes.status, 200);
      const healthData = await healthRes.json();
      assert.ok(healthData.report);
      assert.ok(typeof healthData.report.totalEvaluated === "number");

      // 2. Create Quote and Subscriptions
      const createRes = await fetch(`${baseUrl}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: "cust-acme-01",
          salesRepId: "rep-001",
          salesRepName: "Alice Walker",
        }),
      });
      assert.equal(createRes.status, 201);
      const createdQuote = (await createRes.json()).quotation;

      // Add subscription line
      const addLineRes = await fetch(`${baseUrl}/api/quotes/${createdQuote.id}/lines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: "prod-sub-04",
          quantity: 5,
        }),
      });
      assert.equal(addLineRes.status, 200);

      // Create subscription contract
      const subRes = await fetch(`${baseUrl}/api/quotes/${createdQuote.id}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billingCycle: "Monthly",
        }),
      });
      assert.equal(subRes.status, 201);
      const subData = await subRes.json();
      assert.ok(subData.subscription);
      assert.equal(subData.subscription.quotationId, createdQuote.id);

      // 3. GET /api/subscriptions
      const listSubRes = await fetch(`${baseUrl}/api/subscriptions`);
      assert.equal(listSubRes.status, 200);
      const listSubData = await listSubRes.json();
      assert.ok(listSubData.subscriptions.length >= 1);
      assert.ok(listSubData.totalMrrCents > 0);

      // 4. POST /api/subscriptions/:id/prorate
      const subId = subData.subscription.id;
      const prorateRes = await fetch(`${baseUrl}/api/subscriptions/${subId}/prorate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPriceCents: 50000,
          effectiveDate: "2026-10-15",
          cycleStartDate: "2026-10-01",
          cycleEndDate: "2026-11-01",
        }),
      });
      assert.equal(prorateRes.status, 200);
      const prorateData = await prorateRes.json();
      assert.ok(prorateData.proration);
      assert.ok(typeof prorateData.proration.netAdjustmentCents === "number");

      // 5. POST /api/invoices/reconcile/:quoteId
      const reconRes = await fetch(`${baseUrl}/api/invoices/reconcile/${createdQuote.id}`, {
        method: "POST",
      });
      assert.ok([200, 201].includes(reconRes.status));
      const reconData = await reconRes.json();
      assert.ok(reconData.canGenerateInvoice);
      assert.ok(reconData.invoice);

      // 6. GET /api/invoices
      const listInvRes = await fetch(`${baseUrl}/api/invoices`);
      assert.equal(listInvRes.status, 200);
      const listInvData = await listInvRes.json();
      assert.ok(listInvData.invoices.length >= 1);

      // 7. POST /api/invoices/:id/payments
      const invId = reconData.invoice.id;
      const payRes = await fetch(`${baseUrl}/api/invoices/${invId}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentAmountCents: 1000,
          paymentMethod: "ACH",
        }),
      });
      assert.equal(payRes.status, 200);
      const payData = await payRes.json();
      assert.equal(payData.success, true);
      assert.equal(payData.invoice.paidAmountCents, 1000);
    } finally {
      await new Promise((resolve) => server.close(resolve));
    }
  });
});
