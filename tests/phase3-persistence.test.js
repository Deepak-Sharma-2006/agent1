/**
 * DealFlow360 - Phase 3 Persistence & SQLite Engine Test Suite
 * 
 * Validates enterprise SQL persistence invariants:
 * 1. Production Pragmas (WAL concurrency, 5000ms busy timeout, foreign keys ON).
 * 2. Complete 16-table relational schema integrity.
 * 3. Foreign key cascading deletions and referential integrity constraints.
 * 4. ACID transaction atomicity and rollback behavior.
 * 5. Optimistic Concurrency Control (OCC) atomic version protection.
 * 6. Disk persistence across reconnects & microsecond query latency.
 * 7. Pluggable Database Factory runtime switching (memory vs sqlite).
 */

import test from "node:test";
import assert from "node:assert/strict";
import { join } from "node:path";
import { unlinkSync, existsSync } from "node:fs";
import {
  SqliteDatabase,
  SqliteQuotationRepository,
  SqliteCustomerRepository,
  SqliteProductRepository,
} from "../src/db/sqlite-store.js";
import { seedSqliteDatabase } from "../src/db/sqlite-seed.js";
import { getRepositories, closeDatabase } from "../src/db/database-factory.js";

test("Phase 3: Serverless Local SQL Persistence (SQLite + Schema Integrity)", async (t) => {
  const testDbFile = join(process.cwd(), "prisma", "test-phase3-temp.db");

  // Cleanup helper for test database
  const cleanupTestDb = () => {
    for (const ext of ["", "-wal", "-shm"]) {
      const p = `${testDbFile}${ext}`;
      if (existsSync(p)) {
        try {
          unlinkSync(p);
        } catch {
          // Ignored if locked temporarily
        }
      }
    }
  };

  t.beforeEach(() => {
    cleanupTestDb();
  });

  t.after(() => {
    cleanupTestDb();
  });

  // ===========================================================================
  // 1. Production Pragmas & Engine Diagnostics
  // ===========================================================================
  await t.test("1. Production Pragmas & Concurrency Configuration", async () => {
    const db = new SqliteDatabase(testDbFile);
    try {
      // 1. WAL Mode verification
      const journalMode = db.db.prepare("PRAGMA journal_mode;").get();
      assert.strictEqual(journalMode.journal_mode.toLowerCase(), "wal", "Journal mode must be WAL");

      // 2. Busy Timeout verification (5000ms ceiling)
      const busyTimeout = db.db.prepare("PRAGMA busy_timeout;").get();
      assert.strictEqual(busyTimeout.timeout, 5000, "Busy timeout must be set to 5000ms");

      // 3. Foreign Keys Constraint verification
      const foreignKeys = db.db.prepare("PRAGMA foreign_keys;").get();
      assert.strictEqual(foreignKeys.foreign_keys, 1, "Foreign keys must be strictly ON");

      // 4. Synchronous Mode (NORMAL = 1 for WAL efficiency)
      const synchronous = db.db.prepare("PRAGMA synchronous;").get();
      assert.strictEqual(synchronous.synchronous, 1, "Synchronous mode must be NORMAL (1)");
    } finally {
      db.close();
    }
  });

  // ===========================================================================
  // 2. Relational Schema Completeness (16 Tables)
  // ===========================================================================
  await t.test("2. Complete Relational DDL Schema Verification", async () => {
    const db = new SqliteDatabase(":memory:");
    try {
      const tablesResult = db.db.prepare(`
        SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name ASC;
      `).all();

      const tableNames = tablesResult.map((t) => t.name);

      const requiredTables = [
        "customers",
        "customer_price_lists",
        "products",
        "product_variants",
        "warehouses",
        "stock_inventory",
        "discount_rules",
        "incentive_rules",
        "quotations",
        "quotation_lines",
        "versioned_approval_snapshots",
        "shipment_orders",
        "shipment_items",
        "backorder_tickets",
        "negotiation_messages",
        "audit_logs",
      ];

      for (const requiredTable of requiredTables) {
        assert.ok(
          tableNames.includes(requiredTable),
          `Required table '${requiredTable}' must exist in SQLite schema. Found: ${tableNames.join(", ")}`
        );
      }
    } finally {
      db.close();
    }
  });

  // ===========================================================================
  // 3. Foreign Key Cascades & Referential Integrity
  // ===========================================================================
  await t.test("3. Foreign Key Cascade Deletion & Referential Constraints", async () => {
    const db = new SqliteDatabase(":memory:");
    try {
      const quoteRepo = new SqliteQuotationRepository(db);

      // Seed prerequisite customer and products to satisfy foreign keys
      db.db.prepare(`
        INSERT INTO customers (id, name, email, tier, annual_spend_cents, created_at, updated_at)
        VALUES ('cust-fk-test', 'FK Test Corp', 'fk@test.com', 'Gold', 1000000, datetime('now'), datetime('now'))
      `).run();

      db.db.prepare(`
        INSERT INTO products (id, sku, name, category, list_price_cents, cost_price_cents, created_at, updated_at)
        VALUES ('prod-srv-01', 'SRV-01', 'Server', 'Hardware', 60000, 40000, datetime('now'), datetime('now')),
               ('prod-net-02', 'NET-02', 'Switch', 'Hardware', 40000, 20000, datetime('now'), datetime('now'))
      `).run();

      // Create quote with 2 lines
      const quote = {
        id: "q-cascade-01",
        quoteNumber: "Q-FK-01",
        customerId: "cust-fk-test",
        salesRepId: "rep-01",
        status: "Draft",
        version: 1,
        subtotalCents: 100000,
        discountAmountCents: 5000,
        taxAmountCents: 0,
        netTotalCents: 95000,
        totalCostCents: 60000,
        grossMarginPercent: 36.84,
        blendedRiskScore: 0.15,
        lines: [
          {
            id: "line-fk-01",
            productId: "prod-srv-01",
            quantity: 1,
            unitListPriceCents: 60000,
            unitCostPriceCents: 40000,
            discountPercent: 5,
            netUnitPriceCents: 57000,
            lineSubtotalCents: 57000,
            lineCostCents: 40000,
            marginPercent: 29.8,
            lineRiskScore: 0.1,
          },
          {
            id: "line-fk-02",
            productId: "prod-net-02",
            quantity: 1,
            unitListPriceCents: 40000,
            unitCostPriceCents: 20000,
            discountPercent: 5,
            netUnitPriceCents: 38000,
            lineSubtotalCents: 38000,
            lineCostCents: 20000,
            marginPercent: 47.3,
            lineRiskScore: 0.1,
          },
        ],
      };

      quoteRepo.save(quote);

      // Verify lines are inserted
      const initialLines = db.db.prepare("SELECT count(*) as cnt FROM quotation_lines WHERE quotation_id = ?").get("q-cascade-01");
      assert.strictEqual(initialLines.cnt, 2, "Must insert 2 quotation lines");

      // Now delete parent quote
      const deleted = quoteRepo.delete("q-cascade-01");
      assert.strictEqual(deleted, true);

      // Verify quotation_lines are cascaded and deleted automatically by foreign key
      const postLines = db.db.prepare("SELECT count(*) as cnt FROM quotation_lines WHERE quotation_id = ?").get("q-cascade-01");
      assert.strictEqual(postLines.cnt, 0, "Quotation lines must be cascade-deleted by foreign key constraint");

      // Verify inserting orphan quotation_line with invalid quotation_id throws foreign key violation
      assert.throws(
        () => {
          db.db.prepare(`
            INSERT INTO quotation_lines (
              id, quotation_id, product_id, quantity, list_price_cents,
              cost_price_cents, discount_percent, net_price_cents, total_net_cents,
              total_cost_cents, margin_percent, line_risk_score
            ) VALUES (
              'orphan-line', 'non-existent-quote', 'prod-srv-01', 1, 1000, 500, 0, 1000, 1000, 500, 50, 0.1
            )
          `).run();
        },
        /(FOREIGN KEY|constraint failed)/i,
        "Orphan child insertion must fail foreign key check"
      );
    } finally {
      db.close();
    }
  });

  // ===========================================================================
  // 4. ACID Transaction Atomicity & Rollback
  // ===========================================================================
  await t.test("4. ACID Transaction Rollback on Error", async () => {
    const db = new SqliteDatabase(":memory:");
    try {
      // 1. Transaction that fails mid-way must roll back completely
      assert.throws(() => {
        db.withTransaction(() => {
          db.db.prepare(`
            INSERT INTO customers (id, name, email, tier, annual_spend_cents, created_at, updated_at)
            VALUES ('cust-acid-01', 'ACID Rollback Customer', 'acid@fail.com', 'Silver', 500000, datetime('now'), datetime('now'))
          `).run();

          // Intentional error to trigger rollback
          throw new Error("Simulated payment gateway timeout during checkout");
        });
      }, /Simulated payment gateway timeout/);

      // Customer must NOT exist due to transaction rollback
      const row = db.db.prepare("SELECT * FROM customers WHERE id = 'cust-acid-01'").get();
      assert.strictEqual(row, undefined, "Rolled-back customer row must not persist");

      // 2. Successful transaction commits cleanly
      db.withTransaction(() => {
        db.db.prepare(`
          INSERT INTO customers (id, name, email, tier, annual_spend_cents, created_at, updated_at)
          VALUES ('cust-acid-02', 'ACID Commit Customer', 'commit@success.com', 'Gold', 800000, datetime('now'), datetime('now'))
        `).run();
      });

      const successRow = db.db.prepare("SELECT * FROM customers WHERE id = 'cust-acid-02'").get();
      assert.ok(successRow, "Committed customer row must persist");
      assert.strictEqual(successRow.name, "ACID Commit Customer");
    } finally {
      db.close();
    }
  });

  // ===========================================================================
  // 5. OCC Version Update Collision Detection in SQL
  // ===========================================================================
  await t.test("5. Optimistic Concurrency Control (OCC) Version Atomic Updates", async () => {
    const db = new SqliteDatabase(":memory:");
    try {
      const quoteRepo = new SqliteQuotationRepository(db);

      // Seed customer
      db.db.prepare(`
        INSERT INTO customers (id, name, email, tier, annual_spend_cents, created_at, updated_at)
        VALUES ('cust-occ-01', 'OCC Customer', 'occ@test.com', 'Platinum', 2000000, datetime('now'), datetime('now'))
      `).run();

      // Create base quote at version 1
      quoteRepo.save({
        id: "quote-occ-01",
        quoteNumber: "Q-OCC-100",
        customerId: "cust-occ-01",
        salesRepId: "rep-01",
        status: "Draft",
        version: 1,
        subtotalCents: 50000,
        discountAmountCents: 0,
        taxAmountCents: 0,
        netTotalCents: 50000,
        totalCostCents: 30000,
        grossMarginPercent: 40.0,
        blendedRiskScore: 0.1,
        lines: [],
      });

      // 1. Successful update: expectedVersion 1 -> becomes version 2
      const updated = quoteRepo.updateVersion("quote-occ-01", 1, {
        subtotalCents: 75000,
        netTotalCents: 75000,
      });
      assert.strictEqual(updated.version, 2, "Version must increment from 1 to 2");
      assert.strictEqual(updated.netTotalCents, 75000);

      // 2. Conflicting update: attempting update with stale expectedVersion 1 must return null
      const conflict = quoteRepo.updateVersion("quote-occ-01", 1, {
        subtotalCents: 90000,
      });
      assert.strictEqual(conflict, null, "OCC collision must be detected and return null");

      // Verify the quotation in DB remains at version 2 with original values
      const current = quoteRepo.findById("quote-occ-01");
      assert.strictEqual(current.version, 2);
      assert.strictEqual(current.netTotalCents, 75000);
    } finally {
      db.close();
    }
  });

  // ===========================================================================
  // 6. Persistence Across Reconnects & Query Benchmarks (<10ms)
  // ===========================================================================
  await t.test("6. Disk Persistence Across Reconnects & Microsecond Benchmarks", async () => {
    // Step 1: Open file DB, seed data, and close
    const db1 = new SqliteDatabase(testDbFile);
    try {
      seedSqliteDatabase(db1);
    } finally {
      db1.close();
    }

    // Step 2: Reopen second connection from disk
    const db2 = new SqliteDatabase(testDbFile);
    try {
      const custRepo = new SqliteCustomerRepository(db2);

      // Measure query latency
      const start = process.hrtime.bigint();
      const acme = custRepo.findById("cust-acme-01");
      const end = process.hrtime.bigint();
      const durationMs = Number(end - start) / 1_000_000;

      assert.ok(acme, "Customer must persist across connection closes");
      assert.strictEqual(acme.customerNumber, "CUST-1001", "Preserves domain customerNumber");
      assert.strictEqual(acme.tier, "Platinum");
      assert.strictEqual(acme.name, "Acme Industrial Technologies");
      assert.ok(Array.isArray(acme.orderHistory), "Preserves order history array");
      assert.strictEqual(acme.orderHistory.length, 2);

      // Enterprise Benchmark: single PK lookup must complete in < 10ms (typically < 0.5ms)
      assert.ok(durationMs < 10, `Single row read took ${durationMs.toFixed(3)}ms (must be < 10ms)`);
    } finally {
      db2.close();
    }
  });

  // ===========================================================================
  // 7. Pluggable Database Factory Switching
  // ===========================================================================
  await t.test("7. Pluggable Database Factory Provider Switching", async () => {
    // 1. Request SQLite provider
    const sqliteRepos = getRepositories("sqlite", { forceNew: true, dbPath: testDbFile });
    assert.strictEqual(sqliteRepos.provider, "sqlite");
    assert.ok(sqliteRepos.database instanceof SqliteDatabase);
    assert.ok(sqliteRepos.quotationRepository instanceof SqliteQuotationRepository);
    assert.ok(sqliteRepos.customerRepository instanceof SqliteCustomerRepository);

    // 2. Request Memory provider
    const memoryRepos = getRepositories("memory");
    assert.strictEqual(memoryRepos.provider, "memory");
    assert.ok(memoryRepos.customerRepository);
    assert.ok(memoryRepos.productRepository);

    closeDatabase();
  });
});
