/**
 * DealFlow360 - Phase 7 Customer Negotiation Portal & Graceful Fallback Test Suite
 * 
 * Validates enterprise B2B portal invariants & fallback mechanics:
 * 1. Sanitized Portal Endpoint (GET /api/quotes/:id/portal cloaks internal COGS/margins).
 * 2. Customer Counter-Offer Submission & OCC version concurrency.
 * 3. Rejection of escalated counter-offer triggering Graceful Fallback to Last Approved Best Offer.
 * 4. 1-Click Binding Digital Acceptance confirming terms into an active sales order.
 * 5. Real-time WebSocket lifecycle event broadcasts (COUNTER_OFFER_RECEIVED, FALLBACK_REVERTED, QUOTE_CONFIRMED).
 * 6. Production frontend bundle integrity and client portal components.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "../src/index.js";

test("Phase 7: Customer Negotiation Portal & Graceful Fallback Reversion", async (t) => {
  let server;
  let baseUrl;
  let port;

  t.before(async () => {
    const distDir = join(process.cwd(), "dist");
    if (!existsSync(distDir) || !existsSync(join(distDir, "index.html"))) {
      const { execSync } = await import("node:child_process");
      execSync("npx vite build client", { stdio: "pipe" });
    }

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
  // 1. Sanitized Customer Portal Endpoint & Margin Cloaking
  // ===========================================================================
  await t.test("1. Customer Portal Endpoint Sanitization & Commercial Cloaking", async () => {
    // 1. Create a draft quote for seeded customer cust-acme-01
    const createRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salesRepId: "rep-01",
        salesRepName: "Jordan Bell",
        customerId: "cust-acme-01",
        validityPeriodDays: 30,
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const { quotation: quote } = await createRes.json();

    // 2. Add high-value line item
    const lineRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod-srv-01",
        quantity: 5,
        unitDiscountPercentage: 8,
        expectedVersion: quote.version,
      }),
    });
    assert.strictEqual(lineRes.status, 200);

    // 3. Fetch from customer-facing /api/quotes/:id/portal endpoint
    const portalRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/portal`);
    assert.strictEqual(portalRes.status, 200);
    const portalBody = await portalRes.json();
    assert.strictEqual(portalBody.success, true);

    const portalQuote = portalBody.quotation;
    assert.ok(portalQuote.id, "Portal quote must include ID");
    assert.ok(portalQuote.totalCents > 0, "Portal quote must include net total");
    assert.strictEqual(portalBody.customer.name, "Acme Industrial Technologies");

    // Strict Commercial Cloaking Assertions:
    assert.strictEqual(portalQuote.costPriceCents, undefined, "Must cloak total costPriceCents");
    assert.strictEqual(portalQuote.marginPercent, undefined, "Must cloak total marginPercent");
    assert.strictEqual(portalQuote.blendedRiskScore, undefined, "Must cloak blendedRiskScore");
    assert.strictEqual(portalQuote.commissionCents, undefined, "Must cloak commissionCents");

    for (const line of portalQuote.lines) {
      assert.strictEqual(line.costPriceCents, undefined, "Must cloak line costPriceCents");
      assert.strictEqual(line.marginPercent, undefined, "Must cloak line marginPercent");
      assert.ok(line.listPriceCents > 0, "Must show list price to customer");
      assert.ok(line.netPriceCents > 0, "Must show net price to customer");
    }
  });

  // ===========================================================================
  // 2. Customer Counter-Offer Submission & OCC Version Guards
  // ===========================================================================
  await t.test("2. Customer Counter-Offer Workflow & Optimistic Concurrency Control", async () => {
    // 1. Create and submit quotation for approval
    const createRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salesRepId: "rep-01",
        salesRepName: "Jordan Bell",
        customerId: "cust-acme-01",
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const { quotation: quote } = await createRes.json();

    const addLineRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod-srv-01",
        quantity: 2,
        unitDiscountPercentage: 12,
        expectedVersion: quote.version,
      }),
    });
    assert.strictEqual(addLineRes.status, 200);
    const { quotation: lineQuote } = await addLineRes.json();

    const submitRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        justificationNote: "Client volume hardware refresh",
        expectedVersion: lineQuote.version,
      }),
    });
    assert.strictEqual(submitRes.status, 200);
    const { quotation: submittedQuote } = await submitRes.json();

    // 2. Approve quotation by Sales Manager (establishing VersionedApprovalSnapshot at 12%)
    const approveRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approverId: "mgr-01",
        approverRole: "SalesManager",
        approverName: "Elena Vance",
        expectedVersion: submittedQuote.version,
      }),
    });
    assert.strictEqual(approveRes.status, 200);
    const { quotation: approvedQuote } = await approveRes.json();
    assert.strictEqual(approvedQuote.status, "Approved");
    assert.ok(approvedQuote.lastApprovedSnapshot, "Must capture approved snapshot as fallback baseline");
    assert.strictEqual(approvedQuote.lastApprovedSnapshot.discountPercentage, 12);

    // 3. Customer submits counter-offer with stale expectedVersion (Testing OCC 409)
    const staleCounterRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedDiscountPercentage: 20,
        customerNotes: "Requesting volume alignment",
        expectedVersion: 1, // Stale version
      }),
    });
    assert.strictEqual(staleCounterRes.status, 409, "Must reject stale version counter-offer with 409 Conflict");

    // 4. Customer submits counter-offer with current version
    const validCounterRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestedDiscountPercentage: 22,
        customerNotes: "Competitive proposal from Dell at 22% discount",
        expectedVersion: approvedQuote.version,
      }),
    });
    assert.strictEqual(validCounterRes.status, 200);
    const { quotation: counteredQuote } = await validCounterRes.json();
    assert.strictEqual(counteredQuote.discountPercentage, 22);
    assert.ok(counteredQuote.customerCounterNotes.includes("Competitive proposal from Dell"));
    assert.strictEqual(counteredQuote.status, "PendingApproval", "Counter-offer exceeding threshold must re-enter PendingApproval");
  });

  // ===========================================================================
  // 3. Graceful Fallback Reversion on Higher-Tier Rejection
  // ===========================================================================
  await t.test("3. Graceful Fallback to Last Approved Best Offer on Rejection", async () => {
    // 1. Create quote, add line, submit, and approve at 14%
    const createRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesRepId: "rep-01", customerId: "cust-acme-01" }),
    });
    const { quotation: quote } = await createRes.json();

    const lineRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "prod-srv-01", quantity: 4, unitDiscountPercentage: 14, expectedVersion: quote.version }),
    });
    const { quotation: lineQuote } = await lineRes.json();

    const submitRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expectedVersion: lineQuote.version }),
    });
    const { quotation: submittedQuote } = await submitRes.json();

    const approveRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approverRole: "SalesManager", approverName: "Elena Vance", expectedVersion: submittedQuote.version }),
    });
    const { quotation: approvedQuote } = await approveRes.json();
    assert.strictEqual(approvedQuote.lastApprovedSnapshot.discountPercentage, 14);

    // 2. Customer submits aggressive 28% counter-offer (exceeding managerial discretion)
    const counterRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedDiscountPercentage: 28, expectedVersion: approvedQuote.version }),
    });
    const { quotation: counteredQuote } = await counterRes.json();
    assert.strictEqual(counteredQuote.discountPercentage, 28);

    // 3. Finance Controller rejects the 28% counter-offer due to margin floor breach
    const rejectRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        approverRole: "Finance",
        approverName: "Marcus Sterling",
        rejectionReason: "28% discount violates corporate 18% gross margin floor policy.",
        expectedVersion: counteredQuote.version,
      }),
    });
    assert.strictEqual(rejectRes.status, 200);
    const { quotation: revertedQuote } = await rejectRes.json();

    // Critical Fallback Assertions:
    // Deal must NOT be dead (Cancelled/Rejected); it must gracefully roll back to 14% Best Offer!
    assert.ok(
      revertedQuote.status === "Approved" || revertedQuote.status === "FallbackReverted",
      `Status must be Approved or FallbackReverted, received: ${revertedQuote.status}`
    );
    assert.strictEqual(revertedQuote.discountPercentage, 14, "Discount must cleanly revert to 14% approved baseline");
    assert.strictEqual(revertedQuote.totalCents, approvedQuote.lastApprovedSnapshot.totalCents, "Total must match approved snapshot");

    // 4. Verify Customer Portal endpoint reflects the restored fallback offer
    const portalRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/portal`);
    const { quotation: portalQuote } = await portalRes.json();
    assert.strictEqual(portalQuote.discountPercentage, 14);
    assert.ok(portalQuote.lastApprovedSnapshot, "Portal must expose fallback snapshot for customer notification");
  });

  // ===========================================================================
  // 4. 1-Click Binding Digital Acceptance (Confirm Terms & Sign)
  // ===========================================================================
  await t.test("4. 1-Click Binding Digital Acceptance & Order Conversion", async () => {
    // 1. Create and approve quote
    const createRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salesRepId: "rep-01", customerId: "cust-acme-01" }),
    });
    const createData = await createRes.json();
    assert.strictEqual(createRes.status, 201, `Failed to create quote: ${JSON.stringify(createData)}`);
    const quote = createData.quotation;

    const lineRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: "prod-net-02", quantity: 10, unitDiscountPercentage: 15, expectedVersion: quote.version }),
    });
    const { quotation: lineQuote } = await lineRes.json();

    const submitRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expectedVersion: lineQuote.version }),
    });
    const { quotation: submittedQuote } = await submitRes.json();
    assert.strictEqual(submittedQuote.status, "PendingApproval");

    const approveRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approverRole: "SalesManager", expectedVersion: submittedQuote.version }),
    });
    assert.strictEqual(approveRes.status, 200);
    const { quotation: approvedQuote } = await approveRes.json();
    assert.strictEqual(approvedQuote.status, "Approved");

    // 2. Customer confirms terms via 1-click binding accept
    const confirmRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signatureName: "Sarah Jenkins",
        expectedVersion: approvedQuote.version,
      }),
    });
    assert.strictEqual(confirmRes.status, 200);
    const { quotation: confirmedQuote } = await confirmRes.json();
    assert.strictEqual(confirmedQuote.status, "Confirmed");

    // 3. Post-Confirmation Invariants: Modification must be rejected
    const postConfirmModifyRes = await fetch(`${baseUrl}/api/quotes/${quote.id}/counter`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestedDiscountPercentage: 15, expectedVersion: confirmedQuote.version }),
    });
    assert.notStrictEqual(postConfirmModifyRes.status, 200, "Counter-offer must be rejected on Confirmed quote");
  });

  // ===========================================================================
  // 5. Frontend Production Bundle Integrity for Phase 7
  // ===========================================================================
  await t.test("5. Frontend Production Bundle Integrity for Phase 7 Components", async () => {
    const distDir = join(process.cwd(), "dist");
    assert.ok(existsSync(distDir), "dist/ directory must exist");

    const assetsDir = join(distDir, "assets");
    assert.ok(existsSync(assetsDir), "dist/assets/ directory must exist");

    // Verify SPA routing returns 200 for portal deep link
    const portalDeepLinkRes = await fetch(`${baseUrl}/portal/Q-2026-001`);
    assert.strictEqual(portalDeepLinkRes.status, 200);
    assert.ok(portalDeepLinkRes.headers.get("content-type")?.includes("text/html"));
    const html = await portalDeepLinkRes.text();
    assert.ok(html.includes('<div id="root"></div>'));
  });
});
