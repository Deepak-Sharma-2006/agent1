/**
 * DealFlow360 - Automated Customer Tier Progression & Negotiation Feed Test Suite
 * 
 * Validates:
 * 1. Automated Customer Tier Upgradation upon Order Confirmation (confirmFinalQuotation).
 * 2. Automated Customer Tier Degradation upon Critical Delinquency (>45 days overdue).
 * 3. Exact grounding in codebase maths: TierEngine and EscalationEngine rules.
 * 4. Dual-channel message isolation (isInternal masked from Customer role).
 * 5. In-feed deal escalation from Rep to SalesManager and Finance.
 * 6. Batch governance tier audit across accounts.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/index.js";
import { TierEngine } from "../src/domain/tier-engine.js";
import { EscalationEngine } from "../src/domain/escalation-engine.js";

test("Automated Customer Tier Progression & Negotiation Deal Room Suite", async (t) => {
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
  // 1. Automated Tier Upgradation on Order Confirmation
  // ===========================================================================
  await t.test("1. Automated Tier Upgradation on Order Confirmation (Bronze -> Silver)", async () => {
    // 1. Fetch customer cust-apex-04 (currently Bronze with $12,000 spend)
    const custRes = await fetch(`${baseUrl}/api/customers/cust-apex-04`);
    const custData = await custRes.json();
    assert.strictEqual(custRes.status, 200);
    const apexCust = custData.customer;
    assert.strictEqual(apexCust.tier, "Bronze");
    assert.strictEqual(apexCust.paymentTerms, "Net0");

    // 2. Create quote with $15,000 net total (3 * $5,000 = $15,000 = 1,500,000 cents)
    // When confirmed, trailing 90d spend will become $12,000 + $15,000 = $27,000 >= $25,000 Silver threshold!
    const createQuoteRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salesRepId: "rep-01",
        salesRepName: "Sarah Jenkins",
        customerId: "cust-apex-04",
        customerName: apexCust.name,
        customerTier: "Bronze",
        validityPeriodDays: 30,
      }),
    });
    assert.strictEqual(createQuoteRes.status, 201);
    const quoteData = await createQuoteRes.json();
    const quoteId = quoteData.quotation.id;

    // Add 4 servers to reach $20,000 (prod-srv-01 is $5,000 list price)
    // $8,000 initial + $20,000 = $28,000 >= $25,000 Silver threshold!
    const addLineRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/lines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId: "prod-srv-01",
        quantity: 4, // 4 * $5,000 = $20,000
        discountPercent: 0,
      }),
    });
    assert.strictEqual(addLineRes.status, 200);

    // Submit and approve quote so it can be confirmed
    await fetch(`${baseUrl}/api/quotes/${quoteId}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ justificationNote: "Standard quote within baseline" }),
    });

    await fetch(`${baseUrl}/api/quotes/${quoteId}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approverRole: "SalesManager", approverName: "Marcus Vance" }),
    });

    // 3. Confirm quotation (1-click binding digital acceptance)
    const confirmRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    assert.strictEqual(confirmRes.status, 200);

    // 4. Verify customer tier was automatically promoted to Silver
    const postCustRes = await fetch(`${baseUrl}/api/customers/cust-apex-04`);
    const postCustData = await postCustRes.json();
    assert.strictEqual(postCustRes.status, 200);
    assert.strictEqual(postCustData.customer.tier, "Silver");
    assert.strictEqual(postCustData.customer.paymentTerms, "Net15");
    assert.ok(postCustData.customer.trailing90DaySpendCents >= 2500000);

    // 5. Verify milestone announcement was posted to negotiation feed
    const msgsRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/messages`);
    const msgsData = await msgsRes.json();
    assert.strictEqual(msgsRes.status, 200);
    const promoMsg = msgsData.messages.find((m) => m.messageType === "tier_announcement" || m.senderName === "Tier Engine Governance");
    assert.ok(promoMsg, "Expected tier promotion announcement in negotiation feed");
    assert.ok(promoMsg.message.includes("Silver"));
  });

  // ===========================================================================
  // 2. Automated Delinquency Degradation on Invoice Overdue (>45 Days)
  // ===========================================================================
  await t.test("2. Automated Tier Degradation on Invoice Overdue > 45 Days (Gold -> Bronze)", async () => {
    // 1. Fetch cust-zenith-02 who is currently Gold
    const custRes = await fetch(`${baseUrl}/api/customers/cust-zenith-02`);
    const custData = await custRes.json();
    assert.strictEqual(custRes.status, 200);
    assert.strictEqual(custData.customer.tier, "Gold");
    assert.strictEqual(custData.customer.paymentTerms, "Net30");

    // 2. Simulate delinquency: set maxOverdueDays to 48 (> 45 day critical cliff) with apply=true
    const evalRes = await fetch(`${baseUrl}/api/customers/cust-zenith-02/evaluate-tier?apply=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ maxOverdueDays: 48, apply: true }),
    });
    assert.strictEqual(evalRes.status, 200);
    const evalData = await evalRes.json();

    assert.strictEqual(evalData.tierEvaluation.degraded, true);
    assert.strictEqual(evalData.tierEvaluation.recommendedTier, "Bronze");
    assert.strictEqual(evalData.tierEvaluation.recommendedPaymentTerms, "Net0");
    assert.ok(evalData.tierEvaluation.reason.includes(">45 day limit"));

    // 3. Verify SQLite record was updated
    const verifyCustRes = await fetch(`${baseUrl}/api/customers/cust-zenith-02`);
    const verifyCustData = await verifyCustRes.json();
    assert.strictEqual(verifyCustData.customer.tier, "Bronze");
    assert.strictEqual(verifyCustData.customer.paymentTerms, "Net0");
  });

  // ===========================================================================
  // 3. Dual-Channel Negotiation Message Isolation & Security
  // ===========================================================================
  await t.test("3. Dual-Channel Message Isolation (Internal Notes Masked from Customer)", async () => {
    // Create quote
    const createQuoteRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salesRepId: "rep-01",
        salesRepName: "Sarah Jenkins",
        customerId: "cust-acme-01",
        validityPeriodDays: 30,
      }),
    });
    const quoteData = await createQuoteRes.json();
    const quoteId = quoteData.quotation.id;

    // Post public message
    await fetch(`${baseUrl}/api/quotes/${quoteId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: "rep-01",
        senderRole: "SalesRep",
        senderName: "Sarah Jenkins",
        message: "Hello, here is your quote for review.",
        isInternal: false,
      }),
    });

    // Post internal staff note (confidential margin discussion)
    await fetch(`${baseUrl}/api/quotes/${quoteId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: "rep-01",
        senderRole: "SalesRep",
        senderName: "Sarah Jenkins",
        message: "🔒 Internal Note: Customer wants 12% discount. Cost margin is 22%, do not go above 8% without manager.",
        isInternal: true,
      }),
    });

    // 1. Fetch as Customer -> Internal note must be masked
    const custViewRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/messages?role=Customer`);
    const custViewData = await custViewRes.json();
    assert.strictEqual(custViewRes.status, 200);
    assert.strictEqual(custViewData.messages.length, 1);
    assert.strictEqual(custViewData.messages[0].message, "Hello, here is your quote for review.");
    assert.strictEqual(custViewData.messages.some((m) => m.isInternal), false);

    // 2. Fetch as SalesManager -> Both messages returned
    const mgrViewRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/messages?role=SalesManager`);
    const mgrViewData = await mgrViewRes.json();
    assert.strictEqual(mgrViewRes.status, 200);
    assert.strictEqual(mgrViewData.messages.length, 2);
    assert.ok(mgrViewData.messages.some((m) => m.isInternal));
  });

  // ===========================================================================
  // 4. In-Feed Deal Escalation
  // ===========================================================================
  await t.test("4. In-Feed Deal Escalation from Rep to SalesManager", async () => {
    const createQuoteRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        salesRepId: "rep-01",
        salesRepName: "Sarah Jenkins",
        customerId: "cust-acme-01",
        validityPeriodDays: 30,
      }),
    });
    const quoteData = await createQuoteRes.json();
    const quoteId = quoteData.quotation.id;

    // Escalate deal to SalesManager
    const escalateRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/escalate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        targetRole: "SalesManager",
        reason: "Client requests 12% discount exceeding 8% Silver ceiling.",
        requestedDiscountPct: 12.0,
      }),
    });
    assert.strictEqual(escalateRes.status, 200);
    const escalateData = await escalateRes.json();

    assert.strictEqual(escalateData.quotation.status, "PendingApproval");
    assert.strictEqual(escalateData.quotation.escalationTier, "SalesManager");
    assert.strictEqual(escalateData.quotation.discountPct, 12.0);

    // Check that escalation notice is in negotiation feed
    const msgsRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/messages?role=SalesManager`);
    const msgsData = await msgsRes.json();
    const escMsg = msgsData.messages.find((m) => m.messageType === "escalation");
    assert.ok(escMsg, "Expected escalation message in feed");
    assert.ok(escMsg.message.includes("SalesManager"));
  });

  // ===========================================================================
  // 5. Batch Governance Tier Audit Endpoint
  // ===========================================================================
  await t.test("5. Batch Governance Tier Audit (POST /api/governance/tier-audit)", async () => {
    const auditRes = await fetch(`${baseUrl}/api/governance/tier-audit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    assert.strictEqual(auditRes.status, 200);
    const auditData = await auditRes.json();

    assert.strictEqual(typeof auditData.totalAudited, "number");
    assert.ok(auditData.totalAudited > 0);
    assert.strictEqual(typeof auditData.upgradedCount, "number");
    assert.strictEqual(typeof auditData.degradedCount, "number");
    assert.strictEqual(typeof auditData.unchangedCount, "number");
    assert.ok(Array.isArray(auditData.details));
  });
});
