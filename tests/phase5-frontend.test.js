/**
 * DealFlow360 - Phase 5 Frontend UI Foundation & Modern SPA Test Suite
 * 
 * Validates enterprise frontend delivery and serving invariants:
 * 1. Vite production build output integrity (dist/index.html, bundles).
 * 2. Static asset delivery with accurate MIME types.
 * 3. SPA client-side deep routing fallback (/quotes, /catalog, /negotiation).
 * 4. API 404 segregation (ensuring API errors aren't masked by SPA fallback).
 * 5. Directory traversal defense (/../).
 * 6. Browser caching directives (no-cache for HTML, immutable for hashed assets).
 */

import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { createServer } from "../src/index.js";

test("Phase 5: Frontend UI Foundation & Enterprise SPA Delivery", async (t) => {
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
  // 1. Vite Production Bundle Verification
  // ===========================================================================
  await t.test("1. Production Bundle Integrity & File Verification", async () => {
    const distDir = join(process.cwd(), "dist");
    assert.ok(existsSync(distDir), "Production dist/ directory must exist");

    const indexHtmlPath = join(distDir, "index.html");
    assert.ok(existsSync(indexHtmlPath), "dist/index.html must exist");

    const htmlContent = readFileSync(indexHtmlPath, "utf-8");
    assert.ok(htmlContent.includes('<div id="root"></div>'), "HTML must contain root mount element");
    assert.ok(htmlContent.includes("assets/index-"), "HTML must contain hashed asset references");

    const assetsDir = join(distDir, "assets");
    assert.ok(existsSync(assetsDir), "dist/assets/ directory must exist");
    const assetFiles = readdirSync(assetsDir);
    assert.ok(assetFiles.some((f) => f.endsWith(".js")), "Must contain compiled JS bundle");
    assert.ok(assetFiles.some((f) => f.endsWith(".css")), "Must contain compiled CSS bundle");
  });

  // ===========================================================================
  // 2. Static Asset Delivery & MIME Types
  // ===========================================================================
  await t.test("2. Static File Delivery & Content-Type Headers", async () => {
    // 1. Root index.html
    const rootRes = await fetch(`${baseUrl}/`);
    assert.strictEqual(rootRes.status, 200);
    assert.ok(rootRes.headers.get("content-type")?.includes("text/html"));
    assert.ok(rootRes.headers.get("cache-control")?.includes("no-cache"));
    const html = await rootRes.text();
    assert.ok(html.includes("DealFlow360"));

    // 2. CSS Asset
    const distDir = join(process.cwd(), "dist", "assets");
    const cssFile = readdirSync(distDir).find((f) => f.endsWith(".css"));
    assert.ok(cssFile, "CSS asset file must exist in dist/assets");

    const cssRes = await fetch(`${baseUrl}/assets/${cssFile}`);
    assert.strictEqual(cssRes.status, 200);
    assert.ok(cssRes.headers.get("content-type")?.includes("text/css"));
    assert.ok(cssRes.headers.get("cache-control")?.includes("max-age"));

    // 3. JS Asset
    const jsFile = readdirSync(distDir).find((f) => f.endsWith(".js"));
    assert.ok(jsFile, "JS asset file must exist in dist/assets");

    const jsRes = await fetch(`${baseUrl}/assets/${jsFile}`);
    assert.strictEqual(jsRes.status, 200);
    assert.ok(jsRes.headers.get("content-type")?.includes("application/javascript"));
  });

  // ===========================================================================
  // 3. SPA Route Fallback
  // ===========================================================================
  await t.test("3. Client-Side Routing SPA Fallback", async () => {
    // Deep links should return index.html with 200 OK so client-side router can take over
    const routes = ["/quotes", "/catalog", "/negotiation", "/warehouses", "/quotes/Q-2026-001"];

    for (const route of routes) {
      const res = await fetch(`${baseUrl}${route}`);
      assert.strictEqual(res.status, 200, `Route ${route} must return 200 OK via SPA fallback`);
      assert.ok(res.headers.get("content-type")?.includes("text/html"));
      const body = await res.text();
      assert.ok(body.includes('<div id="root"></div>'));
    }
  });

  // ===========================================================================
  // 4. API 404 Segregation
  // ===========================================================================
  await t.test("4. API Endpoint 404 Isolation", async () => {
    // Non-existent API route must NOT return index.html; it must return JSON 404
    const res = await fetch(`${baseUrl}/api/nonexistent-endpoint-test`);
    assert.strictEqual(res.status, 404);
    assert.ok(res.headers.get("content-type")?.includes("application/json"));
    const body = await res.json();
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error, "Not Found");
  });

  // ===========================================================================
  // 5. Security & Directory Traversal Protection
  // ===========================================================================
  await t.test("5. Directory Traversal Attack Defense", async () => {
    const maliciousPaths = [
      "/../../package.json",
      "/..%2F..%2Fpackage.json",
      "/../../../AGENTS.md",
      "/assets/../../src/index.js",
    ];

    for (const path of maliciousPaths) {
      const res = await fetch(`${baseUrl}${path}`);
      // Either 404 or safe SPA fallback, never leaking outside dist
      const text = await res.text();
      assert.ok(!text.includes("antigravity-enterprise-workflow"), "Must not leak root package.json");
      assert.ok(!text.includes("Operational Directives"), "Must not leak AGENTS.md");
    }
  });
});
