/**
 * DealFlow360 - Database Seed Fixtures (JavaScript Edition)
 * Phase 1: Core Domain Entities
 * 
 * Populates realistic B2B enterprise data across Customers, Products,
 * Warehouses, Inventory, Discount Ceilings, and Admin Incentive Rules.
 */

import {
  CustomerRepository,
  DiscountRuleRepository,
  IncentiveRuleRepository,
  InventoryRepository,
  MemoryStore,
  ProductRepository,
  WarehouseRepository,
} from "./memory-store.js";

export function seedDatabase(customRepos = null) {
  if (!customRepos) {
    const store = MemoryStore.getInstance();
    store.clear();
  }

  const customerRepo = customRepos?.customerRepository || new CustomerRepository();
  const productRepo = customRepos?.productRepository || new ProductRepository();
  const warehouseRepo = customRepos?.warehouseRepository || new WarehouseRepository();
  const inventoryRepo = customRepos?.inventoryRepository || new InventoryRepository();
  const discountRepo = customRepos?.discountRuleRepository || new DiscountRuleRepository();
  const incentiveRepo = customRepos?.incentiveRuleRepository || new IncentiveRuleRepository();

  const now = new Date().toISOString();

  // ---------------------------------------------------------------------------
  // 1. Seed Warehouses
  // ---------------------------------------------------------------------------
  const chicagoHub = warehouseRepo.save({
    id: "wh-chi-01",
    code: "WH-CHI",
    name: "Chicago Central Hub",
    city: "Chicago",
    state: "IL",
    isPrimaryHub: true,
    active: true,
  });

  const dallasDepot = warehouseRepo.save({
    id: "wh-dfw-02",
    code: "WH-DFW",
    name: "Dallas Logistics Depot",
    city: "Dallas",
    state: "TX",
    isPrimaryHub: false,
    active: true,
  });

  const renoDepot = warehouseRepo.save({
    id: "wh-rno-03",
    code: "WH-RNO",
    name: "Reno Regional Facility",
    city: "Reno",
    state: "NV",
    isPrimaryHub: false,
    active: true,
  });

  // ---------------------------------------------------------------------------
  // 2. Seed Products & Inventory
  // ---------------------------------------------------------------------------
  const serverPro = productRepo.save({
    id: "prod-srv-01",
    sku: "SRV-PRO-100",
    name: "Enterprise Server Pro 2U",
    description: "Dual Xeon 64-Core, 256GB ECC RAM, 8TB NVMe Storage Array",
    category: "Hardware",
    costPriceCents: 350000, // $3,500.00
    listPriceCents: 500000, // $5,000.00
    variants: [
      {
        id: "var-srv-01a",
        productId: "prod-srv-01",
        sku: "SRV-PRO-100-512G",
        name: "512GB RAM Upgrade",
        attributes: { RAM: "512GB" },
        priceDeltaCents: 80000, // +$800.00
      },
    ],
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  const coreSwitch = productRepo.save({
    id: "prod-net-02",
    sku: "SW-100G-48P",
    name: "100G Core Data Center Switch 48-Port",
    description: "Layer-3 Managed 48-Port 100G QSFP28 Enterprise Switch",
    category: "Hardware",
    costPriceCents: 150000, // $1,500.00
    listPriceCents: 240000, // $2,400.00
    variants: [],
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  const onsiteSetup = productRepo.save({
    id: "prod-srv-03",
    sku: "SVC-ARCH-ONSITE",
    name: "Onsite Architecture & Deployment Engineering",
    description: "3-Day certified systems engineer onsite rack, stack, and deployment",
    category: "Service",
    costPriceCents: 120000, // $1,200.00
    listPriceCents: 300000, // $3,000.00
    variants: [],
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  const missionCriticalSLA = productRepo.save({
    id: "prod-sub-04",
    sku: "SUB-SLA-247",
    name: "24/7 Mission-Critical SLA Support Plan",
    description: "15-minute guaranteed response time with dedicated technical account manager",
    category: "Subscription",
    billingCycle: "Monthly",
    costPriceCents: 30000, // $300.00/mo
    listPriceCents: 100000, // $1,000.00/mo
    variants: [],
    active: true,
    createdAt: now,
    updatedAt: now,
  });

  // Inventory across warehouses
  inventoryRepo.save({
    id: "inv-01",
    warehouseId: chicagoHub.id,
    productId: serverPro.id,
    physicalStock: 45,
    reservedStock: 5,
    safetyBuffer: 10,
    updatedAt: now,
  });

  inventoryRepo.save({
    id: "inv-02",
    warehouseId: dallasDepot.id,
    productId: serverPro.id,
    physicalStock: 20,
    reservedStock: 0,
    safetyBuffer: 5,
    updatedAt: now,
  });

  inventoryRepo.save({
    id: "inv-03",
    warehouseId: renoDepot.id,
    productId: coreSwitch.id,
    physicalStock: 60,
    reservedStock: 12,
    safetyBuffer: 8,
    updatedAt: now,
  });

  inventoryRepo.save({
    id: "inv-04",
    warehouseId: chicagoHub.id,
    productId: coreSwitch.id,
    physicalStock: 30,
    reservedStock: 4,
    safetyBuffer: 5,
    updatedAt: now,
  });

  // ---------------------------------------------------------------------------
  // 3. Seed Realistic Customers (Progression & Degradation States)
  // ---------------------------------------------------------------------------
  
  // Platinum Tier: Acme Corp (Consistently high spend, impeccable DSO, frequent orders)
  customerRepo.save({
    id: "cust-acme-01",
    customerNumber: "CUST-1001",
    name: "Acme Industrial Technologies",
    email: "procurement@acmeind.com",
    phone: "+1-312-555-0199",
    companyName: "Acme Industrial Technologies Inc.",
    tier: "Platinum",
    paymentTerms: "Net45",
    creditLimitCents: 100000000, // $1,000,000.00
    outstandingBalanceCents: 12000000, // $120,000.00
    trailing90DaySpendCents: 14000000, // $140,000
    trailing180DaySpendCents: 26000000, // $260,000
    trailing365DaySpendCents: 48000000, // $480,000 (> $350k threshold)
    ordersTrailing90Days: 6,
    ordersTrailing365Days: 18, // (> 12 threshold)
    totalPaidOrders: 28,
    daysSinceLastOrder: 12,
    averageDSO: 14, // (<= 20 days)
    maxOverdueDays: 0,
    defaultCount: 0,
    orderHistory: [
      {
        orderId: "ord-acme-01",
        orderNumber: "SO-8821",
        orderDate: "2026-08-15T10:00:00Z",
        totalCents: 5200000,
        subtotalCents: 6000000,
        itemCount: 12,
        paidOnTime: true,
        overdueDays: 0,
      },
      {
        orderId: "ord-acme-02",
        orderNumber: "SO-8702",
        orderDate: "2026-07-20T14:30:00Z",
        totalCents: 4800000,
        subtotalCents: 5500000,
        itemCount: 10,
        paidOnTime: true,
        overdueDays: 0,
      },
    ],
    createdAt: "2024-01-10T08:00:00Z",
    updatedAt: now,
  });

  // Gold Tier: Zenith Global (Steady, high-value, Net 30)
  customerRepo.save({
    id: "cust-zenith-02",
    customerNumber: "CUST-1002",
    name: "Zenith Global Logistics",
    email: "deals@zenithlogistics.com",
    phone: "+1-214-555-0144",
    companyName: "Zenith Global Corp",
    tier: "Gold",
    paymentTerms: "Net30",
    creditLimitCents: 50000000, // $500,000.00
    outstandingBalanceCents: 4500000, // $45,000.00
    trailing90DaySpendCents: 6500000, // $65,000
    trailing180DaySpendCents: 14000000, // $140,000 (> $100k threshold)
    trailing365DaySpendCents: 21000000, // $210,000
    ordersTrailing90Days: 14, // High weekly cadence
    ordersTrailing365Days: 24,
    totalPaidOrders: 22,
    daysSinceLastOrder: 8,
    averageDSO: 22,
    maxOverdueDays: 5,
    defaultCount: 0,
    orderHistory: [
      {
        orderId: "ord-zen-01",
        orderNumber: "SO-8901",
        orderDate: "2026-08-28T09:15:00Z",
        totalCents: 2400000,
        subtotalCents: 2800000,
        itemCount: 4,
        paidOnTime: true,
        overdueDays: 0,
      },
    ],
    createdAt: "2024-05-15T09:00:00Z",
    updatedAt: now,
  });

  // Silver Tier: Starlight Tech (Growing account, Net 15)
  customerRepo.save({
    id: "cust-star-03",
    customerNumber: "CUST-1003",
    name: "Starlight Cloud Systems",
    email: "finance@starlightcloud.io",
    phone: "+1-415-555-0812",
    companyName: "Starlight Technologies LLC",
    tier: "Silver",
    paymentTerms: "Net15",
    creditLimitCents: 20000000, // $200,000.00
    outstandingBalanceCents: 1500000, // $15,000.00
    trailing90DaySpendCents: 3200000, // $32,000 (> $25k threshold)
    trailing180DaySpendCents: 4800000,
    trailing365DaySpendCents: 6500000,
    ordersTrailing90Days: 7,
    ordersTrailing365Days: 11,
    totalPaidOrders: 11,
    daysSinceLastOrder: 15,
    averageDSO: 26,
    maxOverdueDays: 8,
    defaultCount: 0,
    orderHistory: [],
    createdAt: "2025-02-01T11:00:00Z",
    updatedAt: now,
  });

  // Bronze Baseline: Apex Hardware (New account, Net 0)
  customerRepo.save({
    id: "cust-apex-04",
    customerNumber: "CUST-1004",
    name: "Apex Component Solutions",
    email: "orders@apexcomponents.net",
    phone: "+1-512-555-0371",
    companyName: "Apex Hardware Systems",
    tier: "Bronze",
    paymentTerms: "Net0",
    creditLimitCents: 5000000, // $50,000.00
    outstandingBalanceCents: 0,
    trailing90DaySpendCents: 800000, // $8,000
    trailing180DaySpendCents: 1200000,
    trailing365DaySpendCents: 1500000,
    ordersTrailing90Days: 2,
    ordersTrailing365Days: 3,
    totalPaidOrders: 3,
    daysSinceLastOrder: 45,
    averageDSO: 0,
    maxOverdueDays: 0,
    defaultCount: 0,
    orderHistory: [],
    createdAt: "2026-03-10T14:00:00Z",
    updatedAt: now,
  });

  // Degradation Test Account: Cyberdyne (Gold tier, but dormant > 65 days)
  customerRepo.save({
    id: "cust-cyber-05",
    customerNumber: "CUST-1005",
    name: "Cyberdyne Logistics",
    email: "accounts@cyberdynelog.com",
    phone: "+1-702-555-0922",
    companyName: "Cyberdyne Logistics Group",
    tier: "Gold",
    paymentTerms: "Net30",
    creditLimitCents: 30000000,
    outstandingBalanceCents: 0,
    trailing90DaySpendCents: 1200000, // Fell below $35k
    trailing180DaySpendCents: 6000000,
    trailing365DaySpendCents: 11000000,
    ordersTrailing90Days: 1,
    ordersTrailing365Days: 8,
    totalPaidOrders: 8,
    daysSinceLastOrder: 72, // (> 60 days dormancy trigger)
    averageDSO: 24,
    maxOverdueDays: 0,
    defaultCount: 0,
    orderHistory: [],
    createdAt: "2025-01-20T10:00:00Z",
    updatedAt: now,
  });

  // Critical Degradation Account: Prime Electronics (Silver, but invoice overdue 52 days)
  customerRepo.save({
    id: "cust-prime-06",
    customerNumber: "CUST-1006",
    name: "Prime Electronic Distributors",
    email: "billing@primeelec.com",
    phone: "+1-617-555-0455",
    companyName: "Prime Electronics Corp",
    tier: "Silver",
    paymentTerms: "Net15",
    creditLimitCents: 25000000,
    outstandingBalanceCents: 3800000,
    trailing90DaySpendCents: 2800000,
    trailing180DaySpendCents: 5200000,
    trailing365DaySpendCents: 7500000,
    ordersTrailing90Days: 6,
    ordersTrailing365Days: 10,
    totalPaidOrders: 9,
    daysSinceLastOrder: 20,
    averageDSO: 48,
    maxOverdueDays: 52, // (> 45 days critical default penalty)
    defaultCount: 1,
    orderHistory: [],
    createdAt: "2025-04-12T13:00:00Z",
    updatedAt: now,
  });

  // ---------------------------------------------------------------------------
  // 4. Seed Category Discount Ceilings
  // ---------------------------------------------------------------------------
  discountRepo.save({
    id: "disc-hw",
    category: "Hardware",
    standardCeilingPct: 15,
    tierCeilings: {
      Bronze: 5,
      Silver: 10,
      Gold: 15,
      Platinum: 20,
    },
    active: true,
  });

  discountRepo.save({
    id: "disc-svc",
    category: "Service",
    standardCeilingPct: 10,
    tierCeilings: {
      Bronze: 5,
      Silver: 8,
      Gold: 12,
      Platinum: 15,
    },
    active: true,
  });

  discountRepo.save({
    id: "disc-sub",
    category: "Subscription",
    standardCeilingPct: 20,
    tierCeilings: {
      Bronze: 10,
      Silver: 15,
      Gold: 20,
      Platinum: 25,
    },
    active: true,
  });

  // ---------------------------------------------------------------------------
  // 5. Seed Admin Incentive Rules (Historical Condition-Based)
  // ---------------------------------------------------------------------------
  incentiveRepo.save({
    id: "inc-vol-01",
    code: "VOL_SPIKE_2X",
    name: "Volume Spike 2x Rebate",
    description: "Unlocks an additional 3% discount when quote subtotal >= 2x customer historical 6-month AOV",
    conditionType: "VolumeSpike",
    minOrderCents: 5000000, // $50,000.00
    minHistoryOrders: 2,
    discountPctBonus: 3,
    flatRebateCents: 0,
    active: true,
  });

  incentiveRepo.save({
    id: "inc-loy-02",
    code: "LOYALTY_M10",
    name: "Milestone 10-Order Enterprise Rebate",
    description: "Awards $1,000 flat rebate to enterprise clients with >= 10 paid orders and zero payment defaults",
    conditionType: "MilestoneLoyalty",
    minOrderCents: 2000000, // $20,000.00
    minHistoryOrders: 10,
    discountPctBonus: 0,
    flatRebateCents: 100000, // $1,000.00
    active: true,
  });

  incentiveRepo.save({
    id: "inc-care-03",
    code: "CARE_BUNDLE",
    name: "Mission-Critical Bundled Care Bonus",
    description: "Awards 5% hardware discount bonus when bundling servers with multi-year SLA support",
    conditionType: "BundledCare",
    minOrderCents: 1000000, // $10,000.00
    minHistoryOrders: 0,
    discountPctBonus: 5,
    flatRebateCents: 0,
    active: true,
  });
}
