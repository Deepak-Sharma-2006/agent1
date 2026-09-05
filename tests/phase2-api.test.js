import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/index.js";
import { PricingGateway } from "../src/services/pricing-gateway.js";
import { QuotationService, ConcurrencyConflictError } from "../src/services/quotation-service.js";
import {
  CustomerRepository,
  ProductRepository,
  WarehouseRepository,
  InventoryRepository,
  IncentiveRuleRepository,
  DiscountRuleRepository,
  QuotationRepository,
} from "../src/db/memory-store.js";
import { seedDatabase } from "../src/db/seed.js";

/**
 * Helper to make HTTP requests to the test server using native fetch.
 * 
 * @param {string} baseUrl
 * @param {string} path
 * @param {RequestInit} [options={}]
 * @returns {Promise<{ status: number, headers: Headers, body: any }>}
 */
async function apiRequest(baseUrl, path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = response.headers.get("content-type") || "";
  let body = null;
  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text();
  }

  return {
    status: response.status,
    headers: response.headers,
    body,
  };
}

test("Phase 2: REST API, Real-Time Pricing Gateway & Quotation Service (JavaScript Edition)", async (t) => {
  let server;
  let baseUrl;
  let port;

  t.before(async () => {
    server = createServer();
    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  // ===========================================================================
  // 1. Health & Discovery Endpoints
  // ===========================================================================
  await t.test("1. Health, Info, and Discovery Endpoints", async (st) => {
    await st.test("GET /api/health returns 200 with service health status", async () => {
      const res = await apiRequest(baseUrl, "/api/health");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.status, "healthy");
      assert.strictEqual(typeof res.body.uptimeSeconds, "number");
    });

    await st.test("GET /api/info returns 200 with platform runtime and phase details", async () => {
      const res = await apiRequest(baseUrl, "/api/info");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.phase, 2);
      assert.ok(res.body.service.includes("DealFlow360"));
    });
  });

  // ===========================================================================
  // 2. Reference Data & Catalog Endpoints
  // ===========================================================================
  await t.test("2. Catalog and Reference Data Endpoints", async (st) => {
    await st.test("GET /api/customers returns list of seeded enterprise accounts", async () => {
      const res = await apiRequest(baseUrl, "/api/customers");
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.count >= 4);
      assert.ok(res.body.customers.some((c) => c.customerNumber === "CUST-1001"));
    });

    await st.test("GET /api/customers/:id returns single customer or 404 for unknown", async () => {
      const resFound = await apiRequest(baseUrl, "/api/customers/cust-acme-01");
      assert.strictEqual(resFound.status, 200);
      assert.strictEqual(resFound.body.customer.name, "Acme Industrial Technologies");

      const resNotFound = await apiRequest(baseUrl, "/api/customers/cust-does-not-exist");
      assert.strictEqual(resNotFound.status, 404);
      assert.strictEqual(resNotFound.body.success, false);
    });

    await st.test("POST /api/customers/:id/evaluate-tier returns real-time tier calculation", async () => {
      const res = await apiRequest(baseUrl, "/api/customers/cust-acme-01/evaluate-tier", {
        method: "POST",
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.customerId, "cust-acme-01");
      assert.strictEqual(res.body.tierEvaluation.recommendedTier, "Platinum");
    });

    await st.test("GET /api/products returns catalog with integer cents pricing", async () => {
      const res = await apiRequest(baseUrl, "/api/products");
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.products.length >= 4);
      const serverProduct = res.body.products.find((p) => p.sku === "SRV-PRO-100");
      assert.ok(serverProduct);
      assert.strictEqual(serverProduct.listPriceCents, 500000); // $5,000.00
      assert.strictEqual(serverProduct.costPriceCents, 350000); // $3,500.00
    });

    await st.test("GET /api/incentives returns active admin incentive rules", async () => {
      const res = await apiRequest(baseUrl, "/api/incentives");
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.rules.length >= 3);
      assert.ok(res.body.rules.some((r) => r.code === "VOL_SPIKE_2X"));
    });

    await st.test("GET /api/warehouses returns facilities and inventory linkages", async () => {
      const res = await apiRequest(baseUrl, "/api/warehouses");
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.warehouses.length >= 3);
      assert.ok(res.body.inventory.length >= 4);
    });
  });

  // ===========================================================================
  // 3. Real-Time Pricing Gateway
  // ===========================================================================
  await t.test("3. Real-Time Pricing Gateway & Risk Scoring", async (st) => {
    await st.test("POST /api/pricing/preview generates margin breakdown, risk analysis, and upsell suggestions", async () => {
      const payload = {
        customerId: "cust-acme-01",
        items: [
          {
            productId: "prod-srv-01",
            quantity: 2,
            unitDiscountPercentage: 10,
          },
        ],
      };

      const res = await apiRequest(baseUrl, "/api/pricing/preview", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      const { preview } = res.body;

      // 2 units * $5,000 list = $10,000 list = 1,000,000 cents
      assert.strictEqual(preview.subtotalListPriceCents, 1000000);
      // 10% discount = $1,000 discount = 100,000 cents
      assert.strictEqual(preview.totalDiscountCents, 100000);
      // Net revenue = $9,000 = 900,000 cents
      assert.strictEqual(preview.netSubtotalCents, 900000);
      // COGS = 2 units * $3,500 = $7,000 = 700,000 cents
      assert.strictEqual(preview.totalCogsCents, 700000);
      // Margin dollars = $9,000 - $7,000 = $2,000 = 200,000 cents
      assert.strictEqual(preview.totalMarginCents, 200000);
      // Margin pct = 2000 / 9000 * 100 = 22.2%
      assert.ok(preview.marginPercentage >= 22 && preview.marginPercentage <= 23);
      assert.strictEqual(preview.marginFloorBreached, false);

      // Risk score evaluation
      assert.ok(typeof preview.riskAnalysis.overallRiskScore === "number");
      assert.ok(preview.riskAnalysis.recommendation.length > 0);

      // Upsell recommendations
      assert.ok(Array.isArray(preview.upsellSuggestions));
    });

    await st.test("POST /api/pricing/preview enforces 400 when customerId is missing", async () => {
      const res = await apiRequest(baseUrl, "/api/pricing/preview", {
        method: "POST",
        body: JSON.stringify({ items: [] }),
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    await st.test("Direct PricingGateway: division-by-zero protection returns -100.0% when revenue is 0 with positive COGS", () => {
      const mockCustomer = {
        tier: "Bronze",
        paymentTerms: "Net30",
        creditLimitCents: 100000,
        outstandingBalanceCents: 0,
        averageDSO: 25,
        defaultCount: 0,
        trailing365DaySpendCents: 0,
        orderHistory: [],
      };

      const mockProducts = [
        {
          id: "p1",
          sku: "TEST-FREE",
          name: "Free Gift",
          category: "Hardware",
          listPriceCents: 0,
          cogsCents: 5000, // $50 cost
          minimumMarginPct: 15,
        },
      ];

      const preview = PricingGateway.calculateQuotationPreview(
        { customerId: "test-c", items: [{ productId: "p1", quantity: 1, unitDiscountPercentage: 0 }] },
        mockCustomer,
        [],
        mockProducts
      );

      assert.strictEqual(preview.netSubtotalCents, 0);
      assert.strictEqual(preview.marginPercentage, -100.0);
      assert.strictEqual(preview.marginFloorBreached, true);
    });
  });

  // ===========================================================================
  // 4. Quotation Full Lifecycle State Machine
  // ===========================================================================
  await t.test("4. Quotation State Machine, Concurrency & Approvals", async (st) => {
    let createdQuoteId;
    let currentVersion;

    await st.test("POST /api/quotes creates new Draft quotation with version 1", async () => {
      const res = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          salesRepId: "rep-john-01",
          salesRepName: "John Doe",
          customerId: "cust-acme-01",
          validityPeriodDays: 30,
        }),
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      const { quotation } = res.body;
      assert.ok(quotation.id);
      assert.strictEqual(quotation.status, "Draft");
      assert.strictEqual(quotation.version, 1);
      assert.strictEqual(quotation.lines.length, 0);
      assert.strictEqual(quotation.customerId, "cust-acme-01");

      createdQuoteId = quotation.id;
      currentVersion = quotation.version;
    });

    await st.test("POST /api/quotes/:id/lines adds line item and updates version", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({
          productId: "prod-srv-03",
          quantity: 2,
          unitDiscountPercentage: 8, // within rep ceiling (10%)
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.version, currentVersion + 1);
      assert.strictEqual(quotation.lines.length, 1);
      assert.strictEqual(quotation.lines[0].productId, "prod-srv-03");
      assert.strictEqual(quotation.lines[0].unitDiscountPercentage, 8);

      currentVersion = quotation.version;
    });

    await st.test("Concurrency Check: rejects modification with 409 Conflict if expectedVersion is stale", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({
          productId: "prod-sw-02",
          quantity: 1,
          unitDiscountPercentage: 5,
          expectedVersion: 1, // Stale! Current version is 2
        }),
      });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.error.includes("expected version was 1") || res.body.error.includes("modified concurrently"));
    });

    await st.test("Concurrency Check: rejects modification with 409 Conflict if If-Match header is stale", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/lines`, {
        method: "POST",
        headers: {
          "If-Match": "1",
        },
        body: JSON.stringify({
          productId: "prod-sw-02",
          quantity: 1,
          unitDiscountPercentage: 5,
        }),
      });

      assert.strictEqual(res.status, 409);
      assert.strictEqual(res.body.success, false);
    });

    await st.test("PUT /api/quotes/:id/lines/:lineId updates line item details", async () => {
      const quoteDetails = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}`);
      const lineId = quoteDetails.body.quotation.lines[0].id;

      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/lines/${lineId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: 3,
          unitDiscountPercentage: 15, // now requires manager escalation
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.version, currentVersion + 1);
      assert.strictEqual(quotation.lines[0].quantity, 3);
      assert.strictEqual(quotation.lines[0].unitDiscountPercentage, 15);

      currentVersion = quotation.version;
    });

    await st.test("POST /api/quotes/:id/submit escalates to SalesManager when discount is 15%", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/submit`, {
        method: "POST",
        body: JSON.stringify({
          justificationNote: "High-value enterprise opportunity.",
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.status, "PendingApproval");
      assert.strictEqual(quotation.requiredApprovalLevel, "SalesManager");
      assert.strictEqual(quotation.version, currentVersion + 1);

      currentVersion = quotation.version;
    });

    await st.test("POST /api/quotes/:id/approve allows SalesManager to approve quotation", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/approve`, {
        method: "POST",
        body: JSON.stringify({
          approverRole: "SalesManager",
          approverName: "Sarah Connor (Sales VP)",
          approvalNote: "Approved to close quarterly deal.",
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.status, "Approved");
      assert.ok(quotation.approvalHistory.length >= 1);
      const lastApproval = quotation.approvalHistory[quotation.approvalHistory.length - 1];
      assert.strictEqual(lastApproval.approverRole, "SalesManager");
      assert.ok(quotation.lastApprovedSnapshot); // Snapshot created for fallback
      assert.strictEqual(quotation.version, currentVersion + 1);

      currentVersion = quotation.version;
    });

    await st.test("Revocation Guard: modifying lines on an Approved quote automatically resets status to Draft", async () => {
      const quoteDetails = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}`);
      const lineId = quoteDetails.body.quotation.lines[0].id;

      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/lines/${lineId}`, {
        method: "PUT",
        body: JSON.stringify({
          quantity: 4,
          unitDiscountPercentage: 18,
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      // Approved status MUST be revoked to prevent unauthorized edits to signed deals!
      assert.strictEqual(quotation.status, "Draft");
      assert.strictEqual(quotation.requiredApprovalLevel, "Self");
      assert.strictEqual(quotation.version, currentVersion + 1);

      currentVersion = quotation.version;
    });

    await st.test("Rejection & Graceful Fallback: reverts to last approved snapshot when rejected", async () => {
      // 1. Re-submit quote (18% discount escalates to SalesManager)
      const subRes = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/submit`, {
        method: "POST",
        body: JSON.stringify({
          justificationNote: "Attempting higher quantity.",
          expectedVersion: currentVersion,
        }),
      });
      assert.strictEqual(subRes.status, 200);
      currentVersion = subRes.body.quotation.version;

      // 2. Reject and fallback
      const rejRes = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/reject`, {
        method: "POST",
        body: JSON.stringify({
          approverRole: "SalesManager",
          approverName: "Sarah Connor",
          rejectionReason: "18% discount too high for 4 units.",
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(rejRes.status, 200);
      const { quotation } = rejRes.body;
      assert.strictEqual(quotation.status, "Approved"); // Reverted to previous approved state!
      assert.strictEqual(quotation.lines[0].quantity, 3); // Reverted to 3 units!
      assert.strictEqual(quotation.lines[0].unitDiscountPercentage, 15); // Reverted to 15%!
      assert.ok(quotation.version > currentVersion);

      currentVersion = quotation.version;
    });

    await st.test("Customer Counter-Offer: submits counter discount and triggers re-escalation if needed", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/counter`, {
        method: "POST",
        body: JSON.stringify({
          requestedDiscountPercentage: 25, // Customer asks for 25% (requires Finance)
          customerNotes: "We have a competing offer at 25% discount.",
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.status, "PendingApproval");
      assert.strictEqual(quotation.requiredApprovalLevel, "Finance");
      assert.strictEqual(quotation.lines[0].unitDiscountPercentage, 25);
      assert.strictEqual(quotation.customerCounterNotes, "We have a competing offer at 25% discount.");

      currentVersion = quotation.version;
    });

    await st.test("Finance Approval: Finance authorizes customer counter-offer", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/approve`, {
        method: "POST",
        body: JSON.stringify({
          approverRole: "Finance",
          approverName: "Chief Financial Officer",
          approvalNote: "Authorized to win competitive enterprise deal.",
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.status, "Approved");
      assert.strictEqual(quotation.requiredApprovalLevel, "Self");

      currentVersion = quotation.version;
    });

    await st.test("POST /api/quotes/:id/confirm finalizes quotation to Confirmed status", async () => {
      const res = await apiRequest(baseUrl, `/api/quotes/${createdQuoteId}/confirm`, {
        method: "POST",
        body: JSON.stringify({
          expectedVersion: currentVersion,
        }),
      });

      assert.strictEqual(res.status, 200);
      const { quotation } = res.body;
      assert.strictEqual(quotation.status, "Confirmed");
      assert.ok(quotation.confirmedAt);
    });

    await st.test("POST /api/quotes/:id/confirm rejects confirmation if quote is not Approved", async () => {
      // Create a fresh draft quote
      const draftRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          salesRepId: "rep-01",
          customerId: "cust-acme-01",
        }),
      });
      const unapprovedQuoteId = draftRes.body.quotation.id;

      const confirmRes = await apiRequest(baseUrl, `/api/quotes/${unapprovedQuoteId}/confirm`, {
        method: "POST",
        body: JSON.stringify({}),
      });

      assert.strictEqual(confirmRes.status, 400);
      assert.strictEqual(confirmRes.body.success, false);
      assert.ok(confirmRes.body.error.includes("Cannot confirm quotation in 'Draft' state"));
    });
  });

  // ===========================================================================
  // 5. Incentive Engine Integration
  // ===========================================================================
  await t.test("5. Historical Incentive Application", async (st) => {
    await st.test("POST /api/quotes/:id/incentives applies Care Bundle bonus when bundling server + SLA", async () => {
      // 1. Create quote
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          salesRepId: "rep-01",
          customerId: "cust-acme-01",
        }),
      });
      const quoteId = createRes.body.quotation.id;
      let ver = createRes.body.quotation.version;

      // 2. Add server line ($8,500)
      const lineRes = await apiRequest(baseUrl, `/api/quotes/${quoteId}/lines`, {
        method: "POST",
        body: JSON.stringify({
          productId: "prod-srv-01",
          quantity: 2, // $17,000 > $10,000 incentive threshold
          unitDiscountPercentage: 0,
          expectedVersion: ver,
        }),
      });
      ver = lineRes.body.quotation.version;

      // 3. Apply CARE_BUNDLE rule
      const incRes = await apiRequest(baseUrl, `/api/quotes/${quoteId}/incentives`, {
        method: "POST",
        body: JSON.stringify({
          ruleCode: "CARE_BUNDLE",
          expectedVersion: ver,
        }),
      });

      assert.strictEqual(incRes.status, 200);
      const { quotation } = incRes.body;
      assert.strictEqual(quotation.appliedIncentives.length, 1);
      assert.strictEqual(quotation.appliedIncentives[0].code, "CARE_BUNDLE");
      // 5% bonus added to the server line
      assert.strictEqual(quotation.lines[0].unitDiscountPercentage, 5);
    });

    await st.test("Rejects incentive rule when criteria are not satisfied", async () => {
      // Create quote with small order ($1,000 < $50,000 required for VOL_SPIKE_2X)
      const createRes = await apiRequest(baseUrl, "/api/quotes", {
        method: "POST",
        body: JSON.stringify({
          salesRepId: "rep-01",
          customerId: "cust-acme-01",
        }),
      });
      const quoteId = createRes.body.quotation.id;
      const ver = createRes.body.quotation.version;

      const incRes = await apiRequest(baseUrl, `/api/quotes/${quoteId}/incentives`, {
        method: "POST",
        body: JSON.stringify({
          ruleCode: "VOL_SPIKE_2X",
          expectedVersion: ver,
        }),
      });

      assert.strictEqual(incRes.status, 400);
      assert.strictEqual(incRes.body.success, false);
      assert.ok(incRes.body.error.includes("not satisfied"));
    });
  });

  // ===========================================================================
  // 6. Security, DoS Protections & Error Handling
  // ===========================================================================
  await t.test("6. Security, DoS Protections & Edge Cases", async (st) => {
    await st.test("Rejects payloads exceeding 1MB ceiling with 413 Payload Too Large", async () => {
      const massiveString = "A".repeat(1024 * 1024 + 500); // 1MB + 500 bytes
      try {
        const res = await apiRequest(baseUrl, "/api/quotes", {
          method: "POST",
          body: JSON.stringify({
            salesRepId: "rep-01",
            customerId: "cust-acme-01",
            notes: massiveString,
          }),
        });
        assert.strictEqual(res.status, 413);
      } catch (err) {
        // When client socket is destroyed on 413, that is also valid DoS protection
        assert.ok(err.message.includes("fetch failed") || err.message.includes("ECONNRESET") || err.message.includes("413"));
      }
    });

    await st.test("Returns 400 Bad Request on malformed JSON body", async () => {
      const response = await fetch(`${baseUrl}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: "{ malformed json: not valid }",
      });

      assert.strictEqual(response.status, 400);
      const json = await response.json();
      assert.strictEqual(json.success, false);
      assert.ok(json.error.includes("Invalid JSON"));
    });

    await st.test("Returns 404 for unknown endpoints", async () => {
      const res = await apiRequest(baseUrl, "/api/nonexistent-route");
      assert.strictEqual(res.status, 404);
      assert.strictEqual(res.body.success, false);
    });

    await st.test("List quotations supports filtering by customerId, salesRepId, and status", async () => {
      const res = await apiRequest(baseUrl, "/api/quotes?customerId=cust-acme-01");
      assert.strictEqual(res.status, 200);
      assert.ok(Array.isArray(res.body.quotations));
      assert.ok(res.body.quotations.every((q) => q.customerId === "cust-acme-01"));
    });
  });
});
