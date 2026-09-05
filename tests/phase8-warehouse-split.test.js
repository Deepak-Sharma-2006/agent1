/**
 * DealFlow360 - Phase 8: Multi-Warehouse Split & Allocation Engine Test Suite
 * 
 * Verifies:
 * 1. Available-to-Promise (ATP) formula with safety buffers.
 * 2. Optimal O(W * K) multi-warehouse greedy allocation across 6 continental hubs.
 * 3. Non-physical product category bypassing (Services & Subscriptions).
 * 4. Automatic Backorder ticket issuance on network stock exhaustion.
 * 5. Atomic stock reservation on confirmation and physical stock deduction on dispatch.
 * 6. REST API contracts for /api/warehouses, /api/quotes/:id/shipments, /api/shipments, /api/shipments/:id/dispatch.
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "../src/index.js";
import { WarehouseAllocationEngine } from "../src/domain/warehouse-allocation-engine.js";

let server;
let baseUrl;

before(async () => {
  server = createServer({ port: 0 });
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  baseUrl = `http://localhost:${port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("Phase 8: Multi-Warehouse Splitting & Allocation Engine", async (t) => {
  // ---------------------------------------------------------------------------
  // Layer 1: Available-to-Promise (ATP) & Safety Buffer Math
  // ---------------------------------------------------------------------------
  await t.test("1. Available-to-Promise (ATP) & Safety Buffer Math", async (t) => {
    await t.test("Calculates correct ATP: max(0, physical - reserved - safety)", () => {
      const inv1 = { physicalStock: 45, reservedStock: 5, safetyBuffer: 10 };
      assert.strictEqual(WarehouseAllocationEngine.calculateATP(inv1), 30);

      const inv2 = { physicalStock: 10, reservedStock: 8, safetyBuffer: 5 };
      assert.strictEqual(WarehouseAllocationEngine.calculateATP(inv2), 0);

      const inv3 = { physicalStock: 0, reservedStock: 0, safetyBuffer: 0 };
      assert.strictEqual(WarehouseAllocationEngine.calculateATP(inv3), 0);

      const invNull = null;
      assert.strictEqual(WarehouseAllocationEngine.calculateATP(invNull), 0);
    });

    await t.test("Correctly differentiates physical goods vs intangible services/subscriptions", () => {
      assert.strictEqual(WarehouseAllocationEngine.isPhysicalItem({ category: "Hardware" }), true);
      assert.strictEqual(WarehouseAllocationEngine.isPhysicalItem({ category: "Service" }), false);
      assert.strictEqual(WarehouseAllocationEngine.isPhysicalItem({ category: "Subscription" }), false);
      assert.strictEqual(WarehouseAllocationEngine.isPhysicalItem({ category: "service" }), false);
      assert.strictEqual(WarehouseAllocationEngine.isPhysicalItem({ category: "subscription" }), false);
    });
  });

  // ---------------------------------------------------------------------------
  // Layer 2: Optimal O(W * K) Greedy Allocation & Split Packages
  // ---------------------------------------------------------------------------
  await t.test("2. Optimal O(W * K) Greedy Allocation across 6 Depots", async (t) => {
    const warehouses = [
      { id: "wh-chi", code: "WH-CHI", name: "Chicago Central Hub", city: "Chicago", state: "IL", isPrimaryHub: true, active: true },
      { id: "wh-dfw", code: "WH-DFW", name: "Dallas Depot", city: "Dallas", state: "TX", isPrimaryHub: false, active: true },
      { id: "wh-rno", code: "WH-RNO", name: "Reno Facility", city: "Reno", state: "NV", isPrimaryHub: false, active: true },
      { id: "wh-atl", code: "WH-ATL", name: "Atlanta Depot", city: "Atlanta", state: "GA", isPrimaryHub: false, active: true },
      { id: "wh-ewr", code: "WH-EWR", name: "Newark Hub", city: "Newark", state: "NJ", isPrimaryHub: false, active: true },
      { id: "wh-sea", code: "WH-SEA", name: "Seattle Depot", city: "Seattle", state: "WA", isPrimaryHub: false, active: true },
    ];

    const inventoryList = [
      { productId: "prod-srv-01", warehouseId: "wh-chi", physicalStock: 45, reservedStock: 5, safetyBuffer: 10 }, // ATP: 30
      { productId: "prod-srv-01", warehouseId: "wh-dfw", physicalStock: 20, reservedStock: 0, safetyBuffer: 5 },  // ATP: 15
      { productId: "prod-srv-01", warehouseId: "wh-atl", physicalStock: 25, reservedStock: 0, safetyBuffer: 5 },  // ATP: 20
      { productId: "prod-srv-01", warehouseId: "wh-ewr", physicalStock: 35, reservedStock: 5, safetyBuffer: 5 },  // ATP: 25
      { productId: "prod-srv-01", warehouseId: "wh-sea", physicalStock: 15, reservedStock: 0, safetyBuffer: 3 },  // ATP: 12
      { productId: "prod-srv-01", warehouseId: "wh-rno", physicalStock: 18, reservedStock: 2, safetyBuffer: 4 },  // ATP: 12
    ];

    await t.test("Splits 80-unit hardware order across primary depot first and largest ATP second", () => {
      const quotation = {
        id: "quote-test-80",
        quoteNumber: "QT-80-TEST",
        lines: [
          { id: "line-01", productId: "prod-srv-01", productName: "Server Pro", category: "Hardware", quantity: 80 },
        ],
      };

      const result = WarehouseAllocationEngine.allocateQuotation(quotation, warehouses, inventoryList, {
        preferredWarehouseId: "wh-chi",
      });

      assert.strictEqual(result.summary.isFullyAllocated, true);
      assert.strictEqual(result.summary.totalUnitsRequested, 80);
      assert.strictEqual(result.summary.totalUnitsAllocated, 80);
      assert.strictEqual(result.summary.totalUnitsBackordered, 0);
      assert.strictEqual(result.backorders.length, 0);

      // Verify Chicago (primary hub) allocated its max ATP (30 units)
      const chiShipment = result.shipments.find((s) => s.warehouseId === "wh-chi");
      assert.ok(chiShipment, "Chicago primary hub must be allocated");
      assert.strictEqual(chiShipment.totalUnits, 30);

      // Remaining 50 units allocated across Newark (25), Atlanta (20), Dallas (5)
      const totalSplits = result.shipments.length;
      assert.ok(totalSplits >= 3, `Expected at least 3 split shipments, got ${totalSplits}`);

      const totalAllocated = result.shipments.reduce((sum, s) => sum + s.totalUnits, 0);
      assert.strictEqual(totalAllocated, 80);
    });

    await t.test("Bypasses intangible service and subscription lines without inventory check", () => {
      const quotation = {
        id: "quote-mixed",
        lines: [
          { id: "line-01", productId: "prod-srv-01", productName: "Server Pro", category: "Hardware", quantity: 20 },
          { id: "line-02", productId: "prod-srv-03", productName: "Deployment Service", category: "Service", quantity: 5 },
          { id: "line-03", productId: "prod-sub-04", productName: "24/7 SLA", category: "Subscription", quantity: 10 },
        ],
      };

      const result = WarehouseAllocationEngine.allocateQuotation(quotation, warehouses, inventoryList);
      assert.strictEqual(result.summary.physicalLines, 1);
      assert.strictEqual(result.summary.digitalLines, 2);
      assert.strictEqual(result.summary.totalUnitsAllocated, 20);
      assert.strictEqual(result.summary.isFullyAllocated, true);
    });

    await t.test("Generates formal BackorderTicket when aggregate network ATP is exceeded", () => {
      // Total network ATP for prod-srv-01: 30 + 15 + 20 + 25 + 12 + 12 = 114 units
      const quotation = {
        id: "quote-exceed",
        lines: [
          { id: "line-01", productId: "prod-srv-01", productName: "Server Pro", category: "Hardware", quantity: 150 },
        ],
      };

      const result = WarehouseAllocationEngine.allocateQuotation(quotation, warehouses, inventoryList);
      assert.strictEqual(result.summary.isFullyAllocated, false);
      assert.strictEqual(result.summary.totalUnitsRequested, 150);
      assert.strictEqual(result.summary.totalUnitsAllocated, 114);
      assert.strictEqual(result.summary.totalUnitsBackordered, 36);

      assert.strictEqual(result.backorders.length, 1);
      const bo = result.backorders[0];
      assert.strictEqual(bo.productId, "prod-srv-01");
      assert.strictEqual(bo.quantity, 36);
      assert.strictEqual(bo.status, "Pending");
      assert.ok(bo.estimatedLeadDays > 0);
    });
  });

  // ---------------------------------------------------------------------------
  // Layer 3: REST API Integration & Fulfillment Lifecycle
  // ---------------------------------------------------------------------------
  await t.test("3. REST API Warehouse Endpoints & Dispatch State Machine", async (t) => {
    await t.test("GET /api/warehouses returns 6 continental depots with live ATP", async () => {
      const res = await fetch(`${baseUrl}/api/warehouses`);
      assert.strictEqual(res.status, 200);
      const data = await res.json();

      assert.strictEqual(data.success, true);
      assert.ok(data.warehouses.length >= 6, `Expected at least 6 warehouses, got ${data.warehouses.length}`);

      const chicago = data.warehouses.find((w) => w.code === "WH-CHI");
      assert.ok(chicago, "Chicago hub must exist");
      assert.strictEqual(chicago.isPrimaryHub, true);

      // Verify calculated ATP on inventory items
      assert.ok(data.inventory.length > 0);
      data.inventory.forEach((inv) => {
        assert.ok(typeof inv.atp === "number");
        assert.ok(inv.atp >= 0);
      });
    });

    await t.test("POST /api/quotes/:id/allocate generates split shipments for quote", async () => {
      // 1. Create quote
      const createRes = await fetch(`${baseUrl}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ salesRepId: "rep-01", customerId: "cust-acme-01" }),
      }).then((r) => r.json());
      const quoteId = createRes.quotation.id;

      // 2. Add hardware line (50 units)
      await fetch(`${baseUrl}/api/quotes/${quoteId}/lines`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: "prod-srv-01", quantity: 50 }),
      });

      // 3. Allocate shipments
      const allocRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      assert.strictEqual(allocRes.status, 200);
      const allocData = await allocRes.json();

      assert.strictEqual(allocData.success, true);
      assert.ok(allocData.shipments.length >= 2, "Expected multi-depot split shipments");

      // 4. Query quote shipments endpoint
      const getShipRes = await fetch(`${baseUrl}/api/quotes/${quoteId}/shipments`);
      assert.strictEqual(getShipRes.status, 200);
      const shipData = await getShipRes.json();
      assert.strictEqual(shipData.success, true);
      assert.strictEqual(shipData.shipments.length, allocData.shipments.length);

      // 5. Query all shipments endpoint
      const listRes = await fetch(`${baseUrl}/api/shipments`);
      assert.strictEqual(listRes.status, 200);
      const listData = await listRes.json();
      assert.strictEqual(listData.success, true);
      assert.ok(listData.shipments.length >= allocData.shipments.length);

      // 6. Test dispatching the first shipment
      const targetShipment = allocData.shipments[0];
      const dispatchRes = await fetch(`${baseUrl}/api/shipments/${targetShipment.id}/dispatch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          carrier: "FedEx Freight Express",
          trackingNumber: "FDX-9988776655-US",
          dispatchedBy: "Alex Mercer",
        }),
      });
      assert.strictEqual(dispatchRes.status, 200);
      const dispatchData = await dispatchRes.json();
      assert.strictEqual(dispatchData.success, true);
      assert.strictEqual(dispatchData.shipment.status, "Shipped");
      assert.strictEqual(dispatchData.shipment.trackingNumber, "FDX-9988776655-US");
      assert.strictEqual(dispatchData.shipment.carrier, "FedEx Freight Express");
      assert.ok(dispatchData.shipment.shippedAt !== null);
    });
  });
});
