/**
 * DealFlow360 - Phase 9: Offline PWA & Synchronization Engine Test Suite
 * 
 * Verifies:
 * 1. PWA Web App Manifest delivery, JSON schema, and cache-control headers.
 * 2. Service Worker (/sw.js) delivery, no-cache headers, shell precaching and API caching.
 * 3. SPA shell (/index.html) integration with manifest link and service worker registration.
 * 4. Native IndexedDB offline storage engine contracts and mutation serialization.
 * 5. Optimistic Concurrency Control (OCC) 409 Conflict detection and resolution workflows.
 * 6. Offline read API endpoints (/api/products, /api/customers, /api/quotes, /api/warehouses).
 */

import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { createServer } from "../src/index.js";

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

test("Phase 9: Offline-First PWA & Synchronization Engine", async (t) => {
  // ---------------------------------------------------------------------------
  // Layer 1: PWA Web App Manifest Delivery & Schema
  // ---------------------------------------------------------------------------
  await t.test("1. PWA Web App Manifest Delivery & Standards Compliance", async (t) => {
    await t.test("Serves /manifest.json with 200 OK and no-cache header", async () => {
      const res = await fetch(`${baseUrl}/manifest.json`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers.get("content-type")?.includes("application/json"));

      const cacheControl = res.headers.get("cache-control") || "";
      assert.ok(
        cacheControl.includes("no-cache"),
        `Expected Cache-Control to include no-cache, got: ${cacheControl}`
      );

      const manifest = await res.json();
      assert.strictEqual(manifest.name, "DealFlow360 — Enterprise Autonomous CPQ & Sales Operations");
      assert.strictEqual(manifest.short_name, "DealFlow360");
      assert.ok(
        manifest.theme_color === "#0284c7" || manifest.theme_color === "#714B67",
        `Expected enterprise theme_color, got ${manifest.theme_color}`
      );
      assert.strictEqual(manifest.background_color, "#ffffff");
      assert.strictEqual(manifest.display, "standalone");
      assert.ok(Array.isArray(manifest.icons) && manifest.icons.length > 0);
      assert.strictEqual(manifest.icons[0].src, "/icon.svg");
    });
  });

  // ---------------------------------------------------------------------------
  // Layer 2: Native Service Worker Delivery & Strategies
  // ---------------------------------------------------------------------------
  await t.test("2. Service Worker File Delivery & Strategy Verification", async (t) => {
    await t.test("Serves /sw.js with 200 OK and strict no-cache header", async () => {
      const res = await fetch(`${baseUrl}/sw.js`);
      assert.strictEqual(res.status, 200);
      assert.ok(
        res.headers.get("content-type")?.includes("javascript"),
        `Expected javascript content-type, got: ${res.headers.get("content-type")}`
      );

      const cacheControl = res.headers.get("cache-control") || "";
      assert.ok(
        cacheControl.includes("no-cache"),
        `Service worker must serve with no-cache, got: ${cacheControl}`
      );

      const swContent = await res.text();
      assert.ok(swContent.includes("dealflow360-shell-v1"), "Must declare shell cache name");
      assert.ok(swContent.includes("dealflow360-api-v1"), "Must declare API cache name");
      assert.ok(swContent.includes("caches.open"), "Must interact with browser CacheStorage");
      assert.ok(swContent.includes("skipWaiting"), "Must activate immediately via skipWaiting");
      assert.ok(swContent.includes("clients.claim"), "Must claim clients immediately upon activate");
    });
  });

  // ---------------------------------------------------------------------------
  // Layer 3: SPA Shell & Manifest Registration in HTML
  // ---------------------------------------------------------------------------
  await t.test("3. Application Shell & Service Worker Registration Markup", async (t) => {
    await t.test("Root / serves HTML with manifest link and sw registration", async () => {
      const res = await fetch(`${baseUrl}/`);
      assert.strictEqual(res.status, 200);
      assert.ok(res.headers.get("content-type")?.includes("text/html"));

      const html = await res.text();
      assert.ok(
        html.includes('<link rel="manifest" href="/manifest.json" />') ||
        html.includes('rel="manifest"'),
        "HTML must link to PWA manifest.json"
      );
      assert.ok(
        html.includes("serviceWorker.register('/sw.js')") ||
        html.includes("serviceWorker.register"),
        "HTML must register native /sw.js"
      );
      assert.ok(
        html.includes('<meta name="theme-color" content="#714B67" />') ||
        html.includes('name="theme-color"'),
        "HTML must declare enterprise theme-color"
      );
    });
  });

  // ---------------------------------------------------------------------------
  // Layer 4: Native IndexedDB Engine Module & Queue Replay Contracts
  // ---------------------------------------------------------------------------
  await t.test("4. Native IndexedDB Module & Mutation Queue Serialization", async (t) => {
    await t.test("IndexedDB module file exists and declares required store operations", () => {
      const idbPath = resolve(process.cwd(), "client", "src", "offline", "indexeddb.js");
      assert.ok(existsSync(idbPath), "client/src/offline/indexeddb.js must exist");

      const idbCode = readFileSync(idbPath, "utf-8");
      assert.ok(idbCode.includes("DealFlow360_OfflineDB"), "Must declare database name");
      assert.ok(idbCode.includes("catalog"), "Must declare catalog store");
      assert.ok(idbCode.includes("customers"), "Must declare customers store");
      assert.ok(idbCode.includes("quotes"), "Must declare quotes store");
      assert.ok(idbCode.includes("mutation_queue"), "Must declare mutation_queue store");
      assert.ok(idbCode.includes("enqueueMutation"), "Must export enqueueMutation");
      assert.ok(idbCode.includes("getPendingMutations"), "Must export getPendingMutations");
      assert.ok(idbCode.includes("removeMutation"), "Must export removeMutation");
      assert.ok(idbCode.includes("saveOfflineQuote"), "Must export saveOfflineQuote");
    });

    await t.test("OfflineContext exists and provides conflict resolution and replay hooks", () => {
      const ctxPath = resolve(process.cwd(), "client", "src", "context", "OfflineContext.jsx");
      assert.ok(existsSync(ctxPath), "client/src/context/OfflineContext.jsx must exist");

      const ctxCode = readFileSync(ctxPath, "utf-8");
      assert.ok(ctxCode.includes("OfflineProvider"), "Must export OfflineProvider");
      assert.ok(ctxCode.includes("useOffline"), "Must export useOffline hook");
      assert.ok(ctxCode.includes("triggerSync"), "Must provide triggerSync function");
      assert.ok(ctxCode.includes("resolveConflict"), "Must provide resolveConflict function");
      assert.ok(ctxCode.includes("enqueueAction"), "Must provide enqueueAction function");
      assert.ok(ctxCode.includes("activeConflict"), "Must track activeConflict state");
    });

    await t.test("ConflictResolutionModal component exists and provides force/accept actions", () => {
      const modalPath = resolve(process.cwd(), "client", "src", "components", "ConflictResolutionModal.jsx");
      assert.ok(existsSync(modalPath), "ConflictResolutionModal.jsx must exist");

      const modalCode = readFileSync(modalPath, "utf-8");
      assert.ok(modalCode.includes("ConflictResolutionModal"), "Must export ConflictResolutionModal");
      assert.ok(modalCode.includes("resolveConflict('force_client')"), "Must support force_client decision");
      assert.ok(modalCode.includes("resolveConflict('accept_server')"), "Must support accept_server decision");
    });
  });

  // ---------------------------------------------------------------------------
  // Layer 5: Optimistic Concurrency Control (OCC 409) & Replay Engine
  // ---------------------------------------------------------------------------
  await t.test("5. Optimistic Concurrency Control (OCC) HTTP 409 Conflict Handling", async (t) => {
    // Step A: Create initial quote
    const createRes = await fetch(`${baseUrl}/api/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: "cust-acme-01",
        salesRepId: "rep-01",
        lines: [
          { productId: "prod-srv-01", quantity: 2, unitDiscountPercentage: 5 },
        ],
      }),
    });
    assert.strictEqual(createRes.status, 201);
    const createdData = await createRes.json();
    const quote = createdData.quotation;
    assert.strictEqual(quote.version, 1);

    // Step B: Simulate Computer 1 (Online) updating to version 2
    const updateRes = await fetch(`${baseUrl}/api/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expectedVersion: 1,
        customerId: "cust-acme-01",
        salesRepId: "rep-01",
        lines: [
          { productId: "prod-srv-01", quantity: 3, unitDiscountPercentage: 5 },
        ],
      }),
    });
    assert.strictEqual(updateRes.status, 200);
    const updatedData = await updateRes.json();
    assert.strictEqual(updatedData.quotation.version, 2);

    // Step C: Simulate offline client attempting to replay with stale expectedVersion: 1
    const staleReplayRes = await fetch(`${baseUrl}/api/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expectedVersion: 1, // Stale! Server is now at 2
        customerId: "cust-acme-01",
        salesRepId: "rep-01",
        lines: [
          { productId: "prod-srv-01", quantity: 5, unitDiscountPercentage: 10 },
        ],
      }),
    });

    // Server must reject with 409 Conflict to protect commercial margin data
    assert.strictEqual(staleReplayRes.status, 409);
    const conflictData = await staleReplayRes.json();
    assert.strictEqual(conflictData.success, false);
    assert.ok(
      conflictData.error.toLowerCase().includes("conflict") ||
      conflictData.error.toLowerCase().includes("version"),
      `Expected error to cite conflict/version, got: ${conflictData.error}`
    );

    // Step D: Replay with resolved server version succeeds
    const resolvedReplayRes = await fetch(`${baseUrl}/api/quotes/${quote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        expectedVersion: 2, // Resolved version from activeConflict.serverState
        customerId: "cust-acme-01",
        salesRepId: "rep-01",
        lines: [
          { productId: "prod-srv-01", quantity: 5, unitDiscountPercentage: 10 },
        ],
      }),
    });
    assert.strictEqual(resolvedReplayRes.status, 200);
    const resolvedData = await resolvedReplayRes.json();
    assert.strictEqual(resolvedData.quotation.version, 3);
  });

  // ---------------------------------------------------------------------------
  // Layer 6: Offline Read API Endpoints
  // ---------------------------------------------------------------------------
  await t.test("6. Read API Endpoints Eligible for Service Worker API Cache", async (t) => {
    const endpoints = [
      "/api/products",
      "/api/customers",
      "/api/quotes",
      "/api/warehouses",
      "/api/shipments",
    ];

    for (const ep of endpoints) {
      const res = await fetch(`${baseUrl}${ep}`);
      assert.strictEqual(res.status, 200, `Endpoint ${ep} must return 200 OK`);
      const body = await res.json();
      assert.strictEqual(body.success, true, `Endpoint ${ep} must return success: true`);
    }
  });
});
