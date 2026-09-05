import test from "node:test";
import assert from "node:assert/strict";
import type {
  Customer,
  DiscountRule,
  IncentiveRule,
  Product,
  Quotation,
} from "../src/domain/index.ts";
import {
  EscalationEngine,
  FallbackEngine,
  IncentiveEngine,
  QuotationCalculator,
  TierEngine,
} from "../src/domain/index.ts";
import {
  CustomerRepository,
  DiscountRuleRepository,
  IncentiveRuleRepository,
  InventoryRepository,
  MemoryStore,
  ProductRepository,
  WarehouseRepository,
} from "../src/db/memory-store.ts";
import { seedDatabase } from "../src/db/seed.ts";

test("Phase 1: Domain Entities & In-Memory Store Architecture", async (t) => {

  await t.test("1. Dynamic Customer Tier Progression & Degradation Engine", async (st) => {
    
    await st.test("Upgrades customer to Platinum when enterprise spend and credit criteria are satisfied", () => {
      const candidate: Customer = {
        id: "cust-plat-test",
        customerNumber: "CUST-9901",
        name: "Enterprise Core Inc",
        email: "cfo@enterprisecore.com",
        phone: "+1-555-0100",
        companyName: "Enterprise Core Inc",
        tier: "Gold",
        paymentTerms: "Net30",
        creditLimitCents: 50000000,
        outstandingBalanceCents: 0,
        trailing90DaySpendCents: 12000000,
        trailing180DaySpendCents: 22000000,
        trailing365DaySpendCents: 42000000, // $420k >= $350k threshold
        ordersTrailing90Days: 4,
        ordersTrailing365Days: 16, // >= 12 threshold
        totalPaidOrders: 20,
        daysSinceLastOrder: 10,
        averageDSO: 18, // <= 20 days
        maxOverdueDays: 0,
        defaultCount: 0,
        orderHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = TierEngine.evaluateCustomerTier(candidate);
      assert.strictEqual(result.recommendedTier, "Platinum");
      assert.strictEqual(result.upgraded, true);
      assert.strictEqual(result.degraded, false);
      assert.strictEqual(result.recommendedPaymentTerms, "Net45");
      assert.strictEqual(result.discretionaryDiscountCeilingPct, 20);
    });

    await st.test("Upgrades customer to Gold based on high cadence (weekly replenishment)", () => {
      const candidate: Customer = {
        id: "cust-cadence-test",
        customerNumber: "CUST-9902",
        name: "Weekly Wholesale LLC",
        email: "buyer@weeklywholesale.com",
        phone: "+1-555-0101",
        companyName: "Weekly Wholesale LLC",
        tier: "Silver",
        paymentTerms: "Net15",
        creditLimitCents: 20000000,
        outstandingBalanceCents: 0,
        trailing90DaySpendCents: 6500000, // $65,000 >= $60k
        trailing180DaySpendCents: 8500000,
        trailing365DaySpendCents: 12000000,
        ordersTrailing90Days: 14, // >= 12 orders in 90 days (weekly cadence)
        ordersTrailing365Days: 20,
        totalPaidOrders: 18,
        daysSinceLastOrder: 5,
        averageDSO: 21, // <= 25 days
        maxOverdueDays: 0,
        defaultCount: 0,
        orderHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = TierEngine.evaluateCustomerTier(candidate);
      assert.strictEqual(result.recommendedTier, "Gold");
      assert.strictEqual(result.upgraded, true);
      assert.strictEqual(result.recommendedPaymentTerms, "Net30");
      assert.strictEqual(result.discretionaryDiscountCeilingPct, 14);
    });

    await st.test("Degrades Gold account to Silver when dormant for > 60 days", () => {
      const dormantGold: Customer = {
        id: "cust-dormant-gold",
        customerNumber: "CUST-9903",
        name: "Dormant Systems Co",
        email: "ops@dormantsys.com",
        phone: "+1-555-0102",
        companyName: "Dormant Systems Co",
        tier: "Gold",
        paymentTerms: "Net30",
        creditLimitCents: 40000000,
        outstandingBalanceCents: 0,
        trailing90DaySpendCents: 2000000, // Fell below $35k
        trailing180DaySpendCents: 5000000,
        trailing365DaySpendCents: 15000000,
        ordersTrailing90Days: 1,
        ordersTrailing365Days: 10,
        totalPaidOrders: 10,
        daysSinceLastOrder: 75, // > 60 days dormancy
        averageDSO: 22,
        maxOverdueDays: 0,
        defaultCount: 0,
        orderHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = TierEngine.evaluateCustomerTier(dormantGold);
      assert.strictEqual(result.recommendedTier, "Silver");
      assert.strictEqual(result.degraded, true);
      assert.strictEqual(result.upgraded, false);
      assert.ok(result.reason.includes("Gold degradation: Inactivity detected"));
    });

    await st.test("Critical credit degradation: Invoice overdue > 45 days immediately demotes to Bronze", () => {
      const delinquentAccount: Customer = {
        id: "cust-delinquent",
        customerNumber: "CUST-9904",
        name: "Delinquent Hardware Corp",
        email: "billing@delinquenthw.com",
        phone: "+1-555-0103",
        companyName: "Delinquent Hardware Corp",
        tier: "Silver",
        paymentTerms: "Net15",
        creditLimitCents: 20000000,
        outstandingBalanceCents: 5000000,
        trailing90DaySpendCents: 3000000,
        trailing180DaySpendCents: 6000000,
        trailing365DaySpendCents: 8000000,
        ordersTrailing90Days: 6,
        ordersTrailing365Days: 9,
        totalPaidOrders: 8,
        daysSinceLastOrder: 20,
        averageDSO: 55,
        maxOverdueDays: 50, // > 45 days overdue critical trigger
        defaultCount: 1,
        orderHistory: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = TierEngine.evaluateCustomerTier(delinquentAccount);
      assert.strictEqual(result.recommendedTier, "Bronze");
      assert.strictEqual(result.degraded, true);
      assert.strictEqual(result.recommendedPaymentTerms, "Net0");
      assert.ok(result.reason.includes("Critical credit degradation"));
    });
  });

  await t.test("2. Admin Historical Incentive & Rebate Engine", async (st) => {
    const customerWithHistory: Customer = {
      id: "cust-hist-01",
      customerNumber: "CUST-8001",
      name: "High Growth Logistics",
      email: "buyer@hgl.com",
      phone: "+1-555-0200",
      companyName: "High Growth Logistics Inc",
      tier: "Gold",
      paymentTerms: "Net30",
      creditLimitCents: 50000000,
      outstandingBalanceCents: 0,
      trailing90DaySpendCents: 8000000,
      trailing180DaySpendCents: 15000000,
      trailing365DaySpendCents: 25000000,
      ordersTrailing90Days: 8,
      ordersTrailing365Days: 14,
      totalPaidOrders: 14,
      daysSinceLastOrder: 10,
      averageDSO: 20,
      maxOverdueDays: 0,
      defaultCount: 0,
      orderHistory: [
        {
          orderId: "ord-1",
          orderNumber: "SO-101",
          orderDate: "2026-07-01T00:00:00Z",
          totalCents: 2000000, // $20k
          subtotalCents: 2000000,
          itemCount: 5,
          paidOnTime: true,
          overdueDays: 0,
        },
        {
          orderId: "ord-2",
          orderNumber: "SO-102",
          orderDate: "2026-08-01T00:00:00Z",
          totalCents: 2000000, // $20k -> AOV = $20,000
          subtotalCents: 2000000,
          itemCount: 5,
          paidOnTime: true,
          overdueDays: 0,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const volumeSpikeRule: IncentiveRule = {
      id: "inc-vol",
      code: "VOL_SPIKE_2X",
      name: "Volume Spike 2x",
      description: "Extra 3% discount when quote subtotal >= 2x customer historical AOV",
      conditionType: "VolumeSpike",
      minOrderCents: 3000000, // $30k
      minHistoryOrders: 2,
      discountPctBonus: 3,
      flatRebateCents: 0,
      active: true,
    };

    await st.test("Unlocks volume spike incentive when quote is >= 2x customer historical AOV", () => {
      // Historical AOV = $20,000. Quote = $50,000 (2.5x > 2.0x)
      const result = IncentiveEngine.evaluateRule(customerWithHistory, 5000000, volumeSpikeRule);
      assert.strictEqual(result.eligible, true);
      assert.strictEqual(result.bonusDiscountPct, 3);
      assert.ok(result.reason.includes("Volume spike verified"));
    });

    await st.test("Rejects volume spike when quote does not meet 2x historical AOV multiplier", () => {
      // Quote = $25,000 (1.25x < 2.0x)
      const result = IncentiveEngine.evaluateRule(customerWithHistory, 2500000, volumeSpikeRule);
      assert.strictEqual(result.eligible, false);
      assert.strictEqual(result.bonusDiscountPct, 0);
    });

    await st.test("Manager can approve incentive within discretion ($5,000 / 20%)", () => {
      const mockQuotation: Quotation = {
        id: "q-1",
        quoteNumber: "QT-2026-001",
        customerId: customerWithHistory.id,
        salesRepId: "rep-1",
        salesRepName: "Alex Rep",
        status: "Draft",
        lines: [],
        subtotalCents: 3000000,
        discountTotalCents: 0,
        incentiveTotalCents: 300000, // $3,000 rebate
        netTotalCents: 2700000,
        costTotalCents: 1500000,
        grossMarginCents: 1200000,
        grossMarginPct: 44.4,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const decision = IncentiveEngine.assessManagerNegotiation(
        customerWithHistory,
        mockQuotation,
        300000, // $3,000
        12 // 12%
      );

      assert.strictEqual(decision.canManagerApprove, true);
      assert.strictEqual(decision.requiresFinanceEscalation, false);
    });

    await st.test("Manager escalates to Finance when requested incentive exceeds $5,000", () => {
      const mockQuotation: Quotation = {
        id: "q-2",
        quoteNumber: "QT-2026-002",
        customerId: customerWithHistory.id,
        salesRepId: "rep-1",
        salesRepName: "Alex Rep",
        status: "Draft",
        lines: [],
        subtotalCents: 15000000, // $150,000
        discountTotalCents: 0,
        incentiveTotalCents: 800000, // $8,000 requested rebate
        netTotalCents: 14200000,
        costTotalCents: 9000000,
        grossMarginCents: 5200000,
        grossMarginPct: 36.6,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const decision = IncentiveEngine.assessManagerNegotiation(
        customerWithHistory,
        mockQuotation,
        800000, // $8,000 > $5,000
        15
      );

      assert.strictEqual(decision.canManagerApprove, false);
      assert.strictEqual(decision.requiresFinanceEscalation, true);
      assert.ok(decision.justificationNotes.includes("exceeds Sales Manager discretionary limit"));
    });
  });

  await t.test("3. Hard Negotiation Caps & Escalation Tier Determination", async (st) => {
    const mockRules: DiscountRule[] = [
      {
        id: "r-hw",
        category: "Hardware",
        standardCeilingPct: 15,
        tierCeilings: { Bronze: 5, Silver: 10, Gold: 15, Platinum: 20 },
        active: true,
      },
    ];

    const customer: Customer = {
      id: "cust-test",
      customerNumber: "CUST-1",
      name: "Acme",
      email: "a@a.com",
      phone: "123",
      companyName: "Acme",
      tier: "Silver",
      paymentTerms: "Net15",
      creditLimitCents: 1000000,
      outstandingBalanceCents: 0,
      trailing90DaySpendCents: 2500000,
      trailing180DaySpendCents: 2500000,
      trailing365DaySpendCents: 2500000,
      ordersTrailing90Days: 6,
      ordersTrailing365Days: 6,
      totalPaidOrders: 6,
      daysSinceLastOrder: 10,
      averageDSO: 20,
      maxOverdueDays: 0,
      defaultCount: 0,
      orderHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const product: Product = {
      id: "p1",
      sku: "SKU-1",
      name: "Server",
      description: "Test Server",
      category: "Hardware",
      costPriceCents: 60000, // $600
      listPriceCents: 100000, // $1,000
      variants: [],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await st.test("Self-authorized by Sales Rep when discount is <= 10% and within tier ceiling", () => {
      const line = QuotationCalculator.createLine("q1", "l1", {
        product,
        quantity: 1,
        discountPct: 8, // 8% <= 10% (Silver ceiling is 10%)
      });

      const quote: Quotation = {
        id: "q1",
        quoteNumber: "QT-01",
        customerId: customer.id,
        salesRepId: "rep-1",
        salesRepName: "Bob Rep",
        status: "Draft",
        lines: [line],
        subtotalCents: 0,
        discountTotalCents: 0,
        incentiveTotalCents: 0,
        netTotalCents: 0,
        costTotalCents: 0,
        grossMarginCents: 0,
        grossMarginPct: 0,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      QuotationCalculator.recalculateQuotation(quote);

      const assessment = EscalationEngine.assessEscalation(quote, customer, mockRules);
      assert.strictEqual(assessment.requiredTier, "SalesRep");
      assert.strictEqual(assessment.isEscalationRequired, false);
      assert.strictEqual(assessment.isHardBlocked, false);
    });

    await st.test("Escalates to Sales Manager when discount is > 10% but <= 20%", () => {
      const line = QuotationCalculator.createLine("q2", "l2", {
        product,
        quantity: 1,
        discountPct: 15, // 15% > 10% (Requires Manager)
      });

      const quote: Quotation = {
        id: "q2",
        quoteNumber: "QT-02",
        customerId: customer.id,
        salesRepId: "rep-1",
        salesRepName: "Bob Rep",
        status: "Draft",
        lines: [line],
        subtotalCents: 0,
        discountTotalCents: 0,
        incentiveTotalCents: 0,
        netTotalCents: 0,
        costTotalCents: 0,
        grossMarginCents: 0,
        grossMarginPct: 0,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      QuotationCalculator.recalculateQuotation(quote);

      const assessment = EscalationEngine.assessEscalation(quote, customer, mockRules);
      assert.strictEqual(assessment.requiredTier, "SalesManager");
      assert.strictEqual(assessment.isEscalationRequired, true);
      assert.strictEqual(assessment.isHardBlocked, false);
    });

    await st.test("Escalates to Finance when discount is > 20% but <= 35% with healthy margin", () => {
      const line = QuotationCalculator.createLine("q3", "l3", {
        product,
        quantity: 1,
        discountPct: 25, // 25% > 20% (Requires Finance)
      });

      const quote: Quotation = {
        id: "q3",
        quoteNumber: "QT-03",
        customerId: customer.id,
        salesRepId: "rep-1",
        salesRepName: "Bob Rep",
        status: "Draft",
        lines: [line],
        subtotalCents: 0,
        discountTotalCents: 0,
        incentiveTotalCents: 0,
        netTotalCents: 0,
        costTotalCents: 0,
        grossMarginCents: 0,
        grossMarginPct: 0,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      QuotationCalculator.recalculateQuotation(quote);

      const assessment = EscalationEngine.assessEscalation(quote, customer, mockRules);
      assert.strictEqual(assessment.requiredTier, "Finance");
      assert.strictEqual(assessment.isEscalationRequired, true);
      assert.strictEqual(assessment.isHardBlocked, false);
    });

    await st.test("Hard blocks transaction if discount exceeds Finance 35% ceiling", () => {
      const line = QuotationCalculator.createLine("q4", "l4", {
        product,
        quantity: 1,
        discountPct: 40, // 40% > 35% Hard ceiling!
      });

      const quote: Quotation = {
        id: "q4",
        quoteNumber: "QT-04",
        customerId: customer.id,
        salesRepId: "rep-1",
        salesRepName: "Bob Rep",
        status: "Draft",
        lines: [line],
        subtotalCents: 0,
        discountTotalCents: 0,
        incentiveTotalCents: 0,
        netTotalCents: 0,
        costTotalCents: 0,
        grossMarginCents: 0,
        grossMarginPct: 0,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      QuotationCalculator.recalculateQuotation(quote);

      const assessment = EscalationEngine.assessEscalation(quote, customer, mockRules);
      assert.strictEqual(assessment.isHardBlocked, true);
      assert.ok(assessment.blockReason?.includes("exceeds system ceiling of 35%"));
    });

    await st.test("Hard blocks transaction if gross margin breaches mandatory 18% floor", () => {
      // High cost product where 30% discount reduces margin to 12.5%
      const expensiveProduct: Product = {
        id: "p2",
        sku: "SKU-2",
        name: "Low Margin Server",
        description: "Test Server",
        category: "Hardware",
        costPriceCents: 70000, // $700 cost on $1,000 list price
        listPriceCents: 100000,
        variants: [],
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const line = QuotationCalculator.createLine("q5", "l5", {
        product: expensiveProduct,
        quantity: 1,
        discountPct: 25, // Net price = $750. Cost = $700. Margin = $50 / $750 = 6.7% (< 18%)
      });

      const quote: Quotation = {
        id: "q5",
        quoteNumber: "QT-05",
        customerId: customer.id,
        salesRepId: "rep-1",
        salesRepName: "Bob Rep",
        status: "Draft",
        lines: [line],
        subtotalCents: 0,
        discountTotalCents: 0,
        incentiveTotalCents: 0,
        netTotalCents: 0,
        costTotalCents: 0,
        grossMarginCents: 0,
        grossMarginPct: 0,
        blendedRiskScore: 0,
        escalationTier: "SalesRep",
        approvalChain: [],
        validUntil: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      QuotationCalculator.recalculateQuotation(quote);

      const assessment = EscalationEngine.assessEscalation(quote, customer, mockRules);
      assert.strictEqual(assessment.isHardBlocked, true);
      assert.ok(assessment.blockReason?.includes("breaches mandatory fiscal floor of 18%"));
    });
  });

  await t.test("4. Graceful Fallback Strategy: Last Approved Best Offer", async (st) => {
    const product: Product = {
      id: "p10",
      sku: "SKU-10",
      name: "Enterprise Rack",
      description: "Rack",
      category: "Hardware",
      costPriceCents: 50000,
      listPriceCents: 100000,
      variants: [],
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Sales Manager authorizes 15% discount
    const initialLine = QuotationCalculator.createLine("q-fb", "l-fb", {
      product,
      quantity: 1,
      discountPct: 15,
    });

    const quotation: Quotation = {
      id: "q-fb",
      quoteNumber: "QT-FALLBACK-01",
      customerId: "cust-1",
      salesRepId: "rep-1",
      salesRepName: "Charlie Rep",
      status: "Approved",
      lines: [initialLine],
      subtotalCents: 0,
      discountTotalCents: 0,
      incentiveTotalCents: 0,
      netTotalCents: 0,
      costTotalCents: 0,
      grossMarginCents: 0,
      grossMarginPct: 0,
      blendedRiskScore: 0,
      escalationTier: "SalesManager",
      approvalChain: [],
      validUntil: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    QuotationCalculator.recalculateQuotation(quotation);

    // 1. Capture snapshot of Manager's approved terms
    quotation.fallbackSnapshot = FallbackEngine.captureSnapshot(
      quotation,
      "SalesManager",
      "Sarah Manager",
      "Authorized 15% commercial discount"
    );

    assert.strictEqual(quotation.fallbackSnapshot.approvedDiscountPct, 15);
    assert.strictEqual(quotation.fallbackSnapshot.approvedNetTotalCents, 85000);

    // 2. Customer counters for 30% discount, escalating to Finance
    quotation.lines[0].discountPct = 30;
    QuotationCalculator.recalculateQuotation(quotation);
    quotation.status = "PendingApproval";
    quotation.escalationTier = "Finance";

    // 3. Finance rejects the 30% counter
    const reversion = FallbackEngine.revertToLastApprovedOffer(
      quotation,
      "Finance",
      "Frank Finance",
      "Cannot approve 30% discount due to division margin policy"
    );

    assert.strictEqual(reversion.reverted, true);
    assert.strictEqual(quotation.status, "Approved");
    assert.strictEqual(quotation.lines[0].discountPct, 15);
    assert.strictEqual(quotation.netTotalCents, 85000);
    assert.ok(reversion.explanation.includes("Reverted to the last approved best offer"));
  });

  await t.test("5. In-Memory Store & Seed Fixtures Verification", async (st) => {
    seedDatabase();

    const customerRepo = new CustomerRepository();
    const productRepo = new ProductRepository();
    const warehouseRepo = new WarehouseRepository();
    const inventoryRepo = new InventoryRepository();
    const incentiveRepo = new IncentiveRuleRepository();

    await st.test("Acme Corp is seeded in Platinum tier with valid credit metrics", () => {
      const acme = customerRepo.findById("cust-acme-01");
      assert.ok(acme !== undefined);
      assert.strictEqual(acme.tier, "Platinum");
      assert.strictEqual(acme.paymentTerms, "Net45");
      assert.ok(acme.trailing365DaySpendCents >= 35000000);
      assert.strictEqual(acme.defaultCount, 0);
    });

    await st.test("Products are seeded with integer cents pricing", () => {
      const server = productRepo.findBySku("SRV-PRO-100");
      assert.ok(server !== undefined);
      assert.strictEqual(server.listPriceCents, 500000); // $5,000
      assert.strictEqual(server.costPriceCents, 350000); // $3,500
      assert.strictEqual(server.category, "Hardware");
      assert.strictEqual(server.variants.length, 1);
    });

    await st.test("Primary warehouse hub is seeded and identifiable", () => {
      const primaryHub = warehouseRepo.findPrimaryHub();
      assert.ok(primaryHub !== undefined);
      assert.strictEqual(primaryHub.code, "WH-CHI");
      assert.strictEqual(primaryHub.city, "Chicago");
    });

    await st.test("Inventory items link products to warehouses", () => {
      const items = inventoryRepo.findByProductId("prod-srv-01");
      assert.ok(items.length >= 2);
      const chicagoStock = items.find(i => i.warehouseId === "wh-chi-01");
      assert.ok(chicagoStock !== undefined);
      assert.strictEqual(chicagoStock.physicalStock, 45);
    });

    await st.test("Admin historical incentive rules are seeded", () => {
      const volumeRule = incentiveRepo.findByCode("VOL_SPIKE_2X");
      assert.ok(volumeRule !== undefined);
      assert.strictEqual(volumeRule.conditionType, "VolumeSpike");
      assert.strictEqual(volumeRule.discountPctBonus, 3);
    });
  });
});
