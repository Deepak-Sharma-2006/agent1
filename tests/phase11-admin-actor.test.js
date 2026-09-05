/**
 * DealFlow360 - Phase 11: Admin Actor & Enterprise Configuration Hub Test Suite
 * 
 * Verifies:
 * 1. Admin Persona & Enterprise RBAC Architecture (Sections A1–A7)
 * 2. Product Catalog Administration (Section A2) - Add / update products with margin floors
 * 3. Multi-Depot Warehouse Configuration (Section A4) - Register / configure depots
 * 4. Executive Analytics & Multi-Axis Reporting Engine (Section A7) - Slicing by period, rep, status, category
 * 5. Breakdown Distributions & Precision Metrics (By Category, By Tier, By Rep, By Status)
 */

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "../src/index.js";

/**
 * Helper to make HTTP requests to the test server using native fetch.
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

test("Phase 11: Admin Actor & Enterprise Configuration Hub (Sections A1–A7)", async (t) => {
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
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  // ---------------------------------------------------------------------------
  // 1. Admin Persona & RBAC Grounding
  // ---------------------------------------------------------------------------
  await t.test("1. Admin Persona & RBAC Invariants", async (st) => {
    const authContextPath = join(process.cwd(), "client", "src", "context", "AuthContext.jsx");
    const authContent = readFileSync(authContextPath, "utf-8");

    await st.test("Verifies Admin user is configured in ENTERPRISE_USERS", () => {
      assert.ok(authContent.includes("admin: {"), "Admin persona must be registered in ENTERPRISE_USERS");
      assert.ok(authContent.includes("role: 'Admin'"), "Admin role must be set to 'Admin'");
      assert.ok(authContent.includes("name: 'David Vance'"), "Admin name must be David Vance");
      assert.ok(authContent.includes("email: 'admin@dealflow360.com'"), "Admin email must be admin@dealflow360.com");
    });

    await st.test("Verifies Admin default view routes directly to admin-hub", () => {
      assert.ok(authContent.includes("Admin: 'admin-hub'"), "Admin default view must be admin-hub");
    });
  });

  // ---------------------------------------------------------------------------
  // 2. Product Catalog Setup (Section A2)
  // ---------------------------------------------------------------------------
  await t.test("2. Product Catalog Setup (Section A2)", async (st) => {
    const hwSku = `TEST-HW-${Date.now().toString().slice(-6)}`;
    const subSku = `TEST-SUB-${Date.now().toString().slice(-6)}`;

    await st.test("POST /api/products successfully creates a new product with margin floor", async () => {
      const res = await apiRequest(baseUrl, "/api/products", {
        method: "POST",
        body: JSON.stringify({
          sku: hwSku,
          name: "Edge Gateway Controller 9900",
          category: "Hardware",
          listPrice: "1250.00",
          costPrice: "750.00",
          minMarginFloorPct: 20,
          unitDescription: "Device",
          isSubscription: false,
        }),
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.product);
      assert.strictEqual(res.body.product.sku, hwSku);
      assert.strictEqual(res.body.product.listPriceCents, 125000);
      assert.strictEqual(res.body.product.costPriceCents, 75000);
      assert.strictEqual(res.body.product.minMarginFloorPct, 20);
    });

    await st.test("POST /api/products creates recurring subscription product", async () => {
      const res = await apiRequest(baseUrl, "/api/products", {
        method: "POST",
        body: JSON.stringify({
          sku: subSku,
          name: "Advanced Telemetry SaaS Stream",
          category: "Subscription",
          listPrice: "99.00",
          costPrice: "25.00",
          minMarginFloorPct: 40,
          unitDescription: "Stream/Mo",
          isSubscription: true,
          billingFrequency: "Monthly",
        }),
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.product.isSubscription, true);
      assert.strictEqual(res.body.product.billingFrequency, "Monthly");
    });

    await st.test("POST /api/products validates required fields", async () => {
      const res = await apiRequest(baseUrl, "/api/products", {
        method: "POST",
        body: JSON.stringify({
          name: "",
          category: "",
        }),
      });

      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
      assert.match(res.body.error, /required/i);
    });
  });

  // ---------------------------------------------------------------------------
  // 3. Multi-Depot Warehouse Configuration (Section A4)
  // ---------------------------------------------------------------------------
  await t.test("3. Multi-Depot Warehouse Configuration (Section A4)", async (st) => {
    const whCode = `WH-PHX-${Date.now().toString().slice(-4)}`;

    await st.test("POST /api/warehouses registers a new warehouse depot", async () => {
      const res = await apiRequest(baseUrl, "/api/warehouses", {
        method: "POST",
        body: JSON.stringify({
          code: whCode,
          name: "Phoenix Regional Depot",
          city: "Phoenix",
          state: "AZ",
          country: "USA",
          safetyBuffer: 60,
          capacityUnits: 45000,
          isPrimaryHub: false,
        }),
      });

      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.warehouse);
      assert.strictEqual(res.body.warehouse.code, whCode);
      assert.strictEqual(res.body.warehouse.name, "Phoenix Regional Depot");
      assert.strictEqual(res.body.warehouse.safetyBuffer, 60);
      assert.strictEqual(res.body.warehouse.capacityUnits, 45000);
    });

    await st.test("GET /api/warehouses includes newly registered warehouse", async () => {
      const res = await apiRequest(baseUrl, "/api/warehouses", { method: "GET" });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      const found = res.body.warehouses.find((w) => w.code === whCode);
      assert.ok(found, "Newly created Phoenix warehouse must be returned in warehouses array");
    });

    await st.test("POST /api/warehouses validates required code and name", async () => {
      const res = await apiRequest(baseUrl, "/api/warehouses", {
        method: "POST",
        body: JSON.stringify({ code: "", name: "" }),
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });
  });

  // ---------------------------------------------------------------------------
  // 4. Executive Analytics & Multi-Axis Reporting (Section A7)
  // ---------------------------------------------------------------------------
  await t.test("4. Executive Analytics & Multi-Axis Reporting (Section A7)", async (st) => {
    await st.test("GET /api/reports/analytics returns baseline platform KPIs", async () => {
      const res = await apiRequest(baseUrl, "/api/reports/analytics", { method: "GET" });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.kpis, "Response must include kpis object");
      assert.strictEqual(typeof res.body.kpis.totalQuotations, "number");
      assert.strictEqual(typeof res.body.kpis.totalPipelineRevenueCents, "number");
      assert.strictEqual(typeof res.body.kpis.totalBookedRevenueCents, "number");
      assert.strictEqual(typeof res.body.kpis.averageMarginPct, "number");
      assert.strictEqual(typeof res.body.kpis.winRatePct, "number");
      assert.ok(res.body.breakdowns, "Response must include breakdowns");
      assert.ok(Array.isArray(res.body.breakdowns.byStatus));
      assert.ok(Array.isArray(res.body.breakdowns.bySalesRep));
      assert.ok(Array.isArray(res.body.breakdowns.byCategory));
      assert.ok(Array.isArray(res.body.breakdowns.byTier));
      assert.ok(Array.isArray(res.body.quotes));
    });

    await st.test("GET /api/reports/analytics supports Period filter", async () => {
      const resAll = await apiRequest(baseUrl, "/api/reports/analytics?period=all", { method: "GET" });
      const resToday = await apiRequest(baseUrl, "/api/reports/analytics?period=today", { method: "GET" });

      assert.strictEqual(resAll.status, 200);
      assert.strictEqual(resToday.status, 200);
      assert.ok(resAll.body.kpis.totalQuotations >= resToday.body.kpis.totalQuotations);
    });

    await st.test("GET /api/reports/analytics supports Sales Rep filter", async () => {
      const res = await apiRequest(baseUrl, "/api/reports/analytics?salesRepId=rep-01", { method: "GET" });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      for (const q of res.body.quotes) {
        if (q.salesRepId) {
          assert.strictEqual(q.salesRepId, "rep-01");
        }
      }
    });

    await st.test("GET /api/reports/analytics supports Status filter", async () => {
      const res = await apiRequest(baseUrl, "/api/reports/analytics?status=Draft", { method: "GET" });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      for (const q of res.body.quotes) {
        assert.strictEqual(q.status, "Draft");
      }
    });

    await st.test("GET /api/reports/analytics supports Category filter", async () => {
      const res = await apiRequest(baseUrl, "/api/reports/analytics?category=Hardware", { method: "GET" });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });

    await st.test("GET /api/reports/analytics provides Breakdown by Category", async () => {
      const res = await apiRequest(baseUrl, "/api/reports/analytics", { method: "GET" });
      assert.strictEqual(res.status, 200);
      const categories = res.body.breakdowns.byCategory.map((c) => c.category);
      assert.ok(categories.includes("Hardware"));
      assert.ok(categories.includes("Service"));
      assert.ok(categories.includes("Subscription"));
    });

    await st.test("GET /api/reports/analytics provides Customer Tier distribution", async () => {
      const res = await apiRequest(baseUrl, "/api/reports/analytics", { method: "GET" });
      assert.strictEqual(res.status, 200);
      const tiers = res.body.breakdowns.byTier.map((t) => t.tier);
      assert.ok(tiers.includes("Bronze"));
      assert.ok(tiers.includes("Silver"));
      assert.ok(tiers.includes("Gold"));
      assert.ok(tiers.includes("Platinum"));
    });
  });
});
