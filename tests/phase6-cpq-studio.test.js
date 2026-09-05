/**
 * DealFlow360 - Phase 6 Test Suite: Interactive CPQ Quotation Studio & Real-Time Telemetry
 * 
 * Validates:
 * 1. PricingGateway real-time preview calculations & integer-cents precision math.
 * 2. Statutory 18.0% gross margin floor breach detection.
 * 3. Line-level category discount ceiling compliance (Hardware 15%, Services 10%, Subscriptions 20%).
 * 4. Blended Risk Score calculation and escalation tier routing.
 * 5. Margin-lifting upsell recommendation engine ranking.
 * 6. Dynamic TierEngine customer progression and credit degradation invariants.
 * 7. Production client component and bundle delivery integrity.
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "../src/index.js";
import { PricingGateway } from "../src/services/pricing-gateway.js";
import { TierEngine } from "../src/domain/tier-engine.js";
import { EscalationEngine } from "../src/domain/escalation-engine.js";

test("Phase 6: Interactive CPQ Quotation Studio & Rule Matrix Builder", async (t) => {
  let server;
  let baseUrl;

  t.before(async () => {
    server = createServer();
    await new Promise((resolve) => {
      server.listen(0, "127.0.0.1", () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  // ===========================================================================
  // 1. Real-Time Pricing Preview API & Precision Math
  // ===========================================================================
  await t.test("1. Real-Time Pricing Preview API & Integer Cents Precision", async () => {
    // 1. Valid preview request
    const previewPayload = {
      customerId: "cust-acme-01",
      lines: [
        {
          productId: "prod-srv-01", // Server Pro 4U: $5,000 (500000 cents), cost $3,500 (350000 cents)
          quantity: 2,
          unitDiscountPercentage: 10,
        },
      ],
    };

    const res = await fetch(`${baseUrl}/api/pricing/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(previewPayload),
    });

    assert.strictEqual(res.status, 200, "Pricing preview endpoint must return 200 OK");
    const data = await res.json();
    assert.strictEqual(data.success, true, "Response must indicate success");
    assert.ok(data.preview, "Response must include preview payload");

    const preview = data.preview;
    // List: 2 * 500,000 = 1,000,000 cents ($10,000)
    assert.strictEqual(preview.subtotalCents, 1000000, "Subtotal must equal 1,000,000 cents");
    // 10% discount = 100,000 cents ($1,000)
    assert.strictEqual(preview.totalDiscountCents, 100000, "Discount must equal 100,000 cents");
    // Net: 900,000 cents ($9,000)
    assert.strictEqual(preview.netTotalCents, 900000, "Net total must equal 900,000 cents");
    // Cost: 2 * 350,000 = 700,000 cents ($7,000)
    assert.strictEqual(preview.costTotalCents, 700000, "Cost total must equal 700,000 cents");
    // Margin: (900,000 - 700,000) / 900,000 = 22.2%
    assert.strictEqual(preview.grossMarginPercentage, 22.2, "Gross margin percentage must be 22.2%");
    assert.strictEqual(preview.marginFloorBreached, false, "22.2% margin must not breach 18.0% floor");
  });

  // ===========================================================================
  // 2. Statutory 18.0% Gross Margin Red-Line Floor Breach
  // ===========================================================================
  await t.test("2. Statutory 18.0% Gross Margin Floor Breach Enforcement", async () => {
    // Aggressive 35% discount on server:
    // List $10,000 -> Net $6,500. Cost = $7,000. Margin = (6500 - 7000) / 6500 = -7.7%
    const lowMarginPayload = {
      customerId: "cust-acme-01",
      lines: [
        {
          productId: "prod-srv-01",
          quantity: 2,
          unitDiscountPercentage: 35,
        },
      ],
    };

    const res = await fetch(`${baseUrl}/api/pricing/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lowMarginPayload),
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const preview = data.preview;

    assert.ok(preview.grossMarginPercentage < 18.0, "Gross margin must drop below 18%");
    assert.strictEqual(preview.marginFloorBreached, true, "marginFloorBreached must be true");
    assert.strictEqual(preview.escalation.isHardBlocked, true, "Must flag isHardBlocked for floor breach");
  });

  // ===========================================================================
  // 3. Proactive Margin-Lifting Upsell Recommendations
  // ===========================================================================
  await t.test("3. Margin-Lifting Upsell Recommendations Engine", async () => {
    const previewPayload = {
      customerId: "cust-acme-01",
      lines: [
        {
          productId: "prod-srv-01",
          quantity: 1,
          unitDiscountPercentage: 15,
        },
      ],
    };

    const res = await fetch(`${baseUrl}/api/pricing/preview`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(previewPayload),
    });

    const data = await res.json();
    const suggestions = data.preview.upsellSuggestions || data.preview.upsellRecommendations;

    assert.ok(Array.isArray(suggestions), "Upsell suggestions must be an array");
    assert.ok(suggestions.length > 0, "Must recommend at least 1 margin-lifting item");

    const firstRec = suggestions[0];
    assert.ok(firstRec.sku, "Recommendation must have a sku");
    assert.ok(firstRec.name, "Recommendation must have a product name");
    assert.ok(firstRec.listPriceCents > 0, "Recommendation must have list price");
    assert.ok(typeof firstRec.estimatedMarginLiftPct === "number", "Recommendation must estimate margin lift");
  });

  // ===========================================================================
  // 4. Multi-Axis Escalation & Category Ceilings Matrix
  // ===========================================================================
  await t.test("4. Multi-Axis Escalation & Category Ceilings Matrix", async () => {
    const customer = {
      id: "cust-bronze-test",
      tier: "Bronze",
      annualSpendCents: 1500000,
      daysSinceLastOrder: 10,
      averageDSO: 20,
      maxOverdueDays: 0,
      defaultCount: 0,
    };

    const categoryRules = [
      { category: "Hardware", maxDiscountPct: 15.0, riskMultiplier: 1.2 },
      { category: "Services", maxDiscountPct: 10.0, riskMultiplier: 1.5 },
      { category: "Subscriptions", maxDiscountPct: 20.0, riskMultiplier: 0.8 },
    ];

    // Scenario A: Within Bronze 5% limit and margin >= 25% -> SalesRep Self-Approved
    const quoteRep = {
      netTotalCents: 100000,
      costTotalCents: 70000,
      grossMarginPct: 30.0,
      lines: [{ discountPct: 4.0, product: { category: "Hardware" } }],
    };
    const assessmentRep = EscalationEngine.assessEscalation(quoteRep, customer, categoryRules);
    assert.strictEqual(assessmentRep.requiredTier, "SalesRep", "Standard deal must self-approve");
    assert.strictEqual(assessmentRep.blendedRiskScore, 0, "Risk score must be 0");

    // Scenario B: Discount exceeds Bronze 5% limit (12%) -> SalesManager review
    const quoteMgr = {
      netTotalCents: 100000,
      costTotalCents: 75000,
      grossMarginPct: 25.0,
      lines: [{ discountPct: 12.0, product: { category: "Hardware" } }],
    };
    const assessmentMgr = EscalationEngine.assessEscalation(quoteMgr, customer, categoryRules);
    assert.strictEqual(assessmentMgr.requiredTier, "SalesManager", "Discount exceeding tier ceiling routes to Manager");
    assert.ok(assessmentMgr.blendedRiskScore > 0, "Risk score must be positive");

    // Scenario C: Discount exceeds 20% limit (28%) -> Finance review
    const quoteFin = {
      netTotalCents: 100000,
      costTotalCents: 80000,
      grossMarginPct: 20.0,
      lines: [{ discountPct: 28.0, product: { category: "Hardware" } }],
    };
    const assessmentFin = EscalationEngine.assessEscalation(quoteFin, customer, categoryRules);
    assert.strictEqual(assessmentFin.requiredTier, "Finance", "Deep discount >20% routes to Finance");
  });

  // ===========================================================================
  // 5. Dynamic Customer Tier Qualification & Credit Degradation
  // ===========================================================================
  await t.test("5. Dynamic Customer Tier Progression & Credit Demotion Invariants", async () => {
    // 1. Upgrade to Gold qualification
    const goldCandidate = {
      id: "cust-gold-candidate",
      tier: "Silver",
      trailing180DaySpendCents: 12000000, // $120k >= $100k
      daysSinceLastOrder: 15,
      averageDSO: 22, // <= 25d
      maxOverdueDays: 5,
      defaultCount: 0,
      ordersTrailing365Days: 14,
    };
    const goldResult = TierEngine.evaluateCustomerTier(goldCandidate);
    assert.strictEqual(goldResult.recommendedTier, "Gold", "High spend and clean DSO qualifies for Gold upgrade");

    // 2. Credit Degradation Demotion: Invoices overdue > 45 days
    const delinquentCustomer = {
      id: "cust-delinquent",
      tier: "Gold",
      trailing180DaySpendCents: 15000000,
      daysSinceLastOrder: 20,
      averageDSO: 48,
      maxOverdueDays: 52, // > 45 days!
      defaultCount: 1,
    };
    const demoteResult = TierEngine.evaluateCustomerTier(delinquentCustomer);
    assert.strictEqual(demoteResult.recommendedTier, "Bronze", "Overdue > 45 days must demote directly to Bronze");
    assert.ok(demoteResult.reason.includes("Critical credit degradation"), "Must cite credit degradation in reason");
  });

  // ===========================================================================
  // 6. Frontend Component Architecture & Production Bundle Integrity
  // ===========================================================================
  await t.test("6. Frontend Component Architecture & Production Bundle Integrity", async () => {
    // Verify source files exist
    const componentsDir = join(process.cwd(), "client", "src", "components");
    const pagesDir = join(process.cwd(), "client", "src", "pages");

    assert.ok(existsSync(join(componentsDir, "MarginSpeedometerGauge.jsx")), "MarginSpeedometerGauge.jsx must exist");
    assert.ok(existsSync(join(componentsDir, "TierSpendVelocityCurve.jsx")), "TierSpendVelocityCurve.jsx must exist");
    assert.ok(existsSync(join(componentsDir, "BlendedRiskRadarChart.jsx")), "BlendedRiskRadarChart.jsx must exist");
    assert.ok(existsSync(join(pagesDir, "RuleMatrixBuilder.jsx")), "RuleMatrixBuilder.jsx must exist");
    assert.ok(existsSync(join(pagesDir, "QuotationStudio.jsx")), "QuotationStudio.jsx must exist");

    // Verify bundle integrity
    const distIndexHtml = join(process.cwd(), "dist", "index.html");
    assert.ok(existsSync(distIndexHtml), "dist/index.html must exist after vite build");

    const htmlContent = readFileSync(distIndexHtml, "utf-8");
    assert.ok(htmlContent.includes('<div id="root"></div>'), "HTML contains root mount point");

    // Verify HTTP serving of the SPA
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200, "Root must return 200 OK");
    assert.ok(res.headers.get("content-type")?.includes("text/html"));
  });
});
