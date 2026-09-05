/**
 * DealFlow360 - Production SQLite Storage Engine & Repositories
 * Phase 3: Serverless Local SQL Persistence Layer
 * 
 * Powered by Node.js 24 native `node:sqlite` (DatabaseSync).
 * Enforces production pragmas: Write-Ahead Logging (WAL), 5000ms busy timeout,
 * foreign key cascade constraints, and NORMAL synchronous mode for microsecond latency.
 */

import { DatabaseSync } from "node:sqlite";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

export class SqliteDatabase {
  /**
   * @param {string} [dbPath=":memory:"]
   */
  constructor(dbPath = ":memory:") {
    this.dbPath = dbPath;
    if (dbPath !== ":memory:") {
      const dir = dirname(dbPath);
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    }

    this.db = new DatabaseSync(dbPath);
    this.initPragmas();
    this.initSchema();
  }

  initPragmas() {
    // Production Concurrency & Reliability Pragmas
    this.db.exec("PRAGMA journal_mode = WAL;");
    this.db.exec("PRAGMA busy_timeout = 5000;");
    this.db.exec("PRAGMA foreign_keys = ON;");
    this.db.exec("PRAGMA synchronous = NORMAL;");
  }

  initSchema() {
    this.db.exec(`
      -- 1. Customers & Enterprise Accounts
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        tier TEXT NOT NULL DEFAULT 'Bronze',
        annual_spend_cents INTEGER NOT NULL DEFAULT 0,
        dso_days INTEGER NOT NULL DEFAULT 30,
        overdue_days INTEGER NOT NULL DEFAULT 0,
        max_overdue_days INTEGER NOT NULL DEFAULT 0,
        cadence_orders_90d INTEGER NOT NULL DEFAULT 0,
        trailing_90d_spend_cents INTEGER NOT NULL DEFAULT 0,
        trailing_180d_spend_cents INTEGER NOT NULL DEFAULT 0,
        trailing_365d_spend_cents INTEGER NOT NULL DEFAULT 0,
        default_rate REAL NOT NULL DEFAULT 0.0,
        credit_limit_cents INTEGER NOT NULL DEFAULT 1000000,
        payment_terms TEXT NOT NULL DEFAULT 'Net30',
        data_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
      CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);

      -- 2. Customer Price Lists
      CREATE TABLE IF NOT EXISTS customer_price_lists (
        id TEXT PRIMARY KEY,
        tier TEXT NOT NULL,
        category TEXT NOT NULL,
        default_discount_percent REAL NOT NULL DEFAULT 0.0,
        active INTEGER NOT NULL DEFAULT 1,
        UNIQUE(tier, category)
      );

      -- 3. Products
      CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        sku TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        list_price_cents INTEGER NOT NULL,
        cost_price_cents INTEGER NOT NULL,
        is_subscription INTEGER NOT NULL DEFAULT 0,
        billing_frequency TEXT,
        active INTEGER NOT NULL DEFAULT 1,
        data_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

      -- 4. Product Variants
      CREATE TABLE IF NOT EXISTS product_variants (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        sku TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        price_delta_cents INTEGER NOT NULL DEFAULT 0,
        cost_delta_cents INTEGER NOT NULL DEFAULT 0,
        attributes_json TEXT NOT NULL DEFAULT '{}',
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

      -- 5. Warehouses
      CREATE TABLE IF NOT EXISTS warehouses (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        country TEXT NOT NULL DEFAULT 'USA',
        is_primary_hub INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        capacity_units INTEGER NOT NULL DEFAULT 50000,
        data_json TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_warehouses_code ON warehouses(code);

      -- 6. Stock Inventory
      CREATE TABLE IF NOT EXISTS stock_inventory (
        id TEXT PRIMARY KEY,
        product_id TEXT NOT NULL,
        warehouse_id TEXT NOT NULL,
        physical_stock INTEGER NOT NULL DEFAULT 0,
        reserved_stock INTEGER NOT NULL DEFAULT 0,
        safety_buffer INTEGER NOT NULL DEFAULT 10,
        reorder_point INTEGER NOT NULL DEFAULT 20,
        data_json TEXT,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
        UNIQUE(product_id, warehouse_id)
      );
      CREATE INDEX IF NOT EXISTS idx_inventory_product ON stock_inventory(product_id);
      CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON stock_inventory(warehouse_id);

      -- 7. Discount Governance Rules
      CREATE TABLE IF NOT EXISTS discount_rules (
        id TEXT PRIMARY KEY,
        rule_type TEXT NOT NULL,
        target_type TEXT NOT NULL,
        target_id TEXT NOT NULL,
        max_discount_percent REAL NOT NULL,
        min_margin_percent REAL NOT NULL DEFAULT 18.0,
        active INTEGER NOT NULL DEFAULT 1,
        data_json TEXT,
        UNIQUE(rule_type, target_type, target_id)
      );

      -- 8. Historical Incentive Rules
      CREATE TABLE IF NOT EXISTS incentive_rules (
        id TEXT PRIMARY KEY,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        rule_type TEXT NOT NULL,
        parameters_json TEXT NOT NULL DEFAULT '{}',
        discount_percent REAL NOT NULL DEFAULT 0.0,
        rebate_cents INTEGER NOT NULL DEFAULT 0,
        active INTEGER NOT NULL DEFAULT 1,
        data_json TEXT
      );
      CREATE INDEX IF NOT EXISTS idx_incentives_code ON incentive_rules(code);

      -- 9. Quotations (Root Aggregate)
      CREATE TABLE IF NOT EXISTS quotations (
        id TEXT PRIMARY KEY,
        quote_number TEXT NOT NULL UNIQUE,
        customer_id TEXT NOT NULL,
        sales_rep_id TEXT NOT NULL DEFAULT 'rep-001',
        status TEXT NOT NULL DEFAULT 'Draft',
        version INTEGER NOT NULL DEFAULT 1,
        subtotal_cents INTEGER NOT NULL DEFAULT 0,
        discount_amount_cents INTEGER NOT NULL DEFAULT 0,
        tax_amount_cents INTEGER NOT NULL DEFAULT 0,
        net_total_cents INTEGER NOT NULL DEFAULT 0,
        total_cost_cents INTEGER NOT NULL DEFAULT 0,
        gross_margin_percent REAL NOT NULL DEFAULT 0.0,
        blended_risk_score REAL NOT NULL DEFAULT 0.0,
        requires_manager_approval INTEGER NOT NULL DEFAULT 0,
        requires_finance_approval INTEGER NOT NULL DEFAULT 0,
        fallback_snapshot_json TEXT,
        notes TEXT,
        data_json TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        FOREIGN KEY (customer_id) REFERENCES customers(id)
      );
      CREATE INDEX IF NOT EXISTS idx_quotations_customer ON quotations(customer_id);
      CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
      CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quote_number);

      -- 10. Quotation Line Items
      CREATE TABLE IF NOT EXISTS quotation_lines (
        id TEXT PRIMARY KEY,
        quotation_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        list_price_cents INTEGER NOT NULL,
        cost_price_cents INTEGER NOT NULL,
        discount_percent REAL NOT NULL DEFAULT 0.0,
        net_price_cents INTEGER NOT NULL,
        total_net_cents INTEGER NOT NULL DEFAULT 0,
        total_cost_cents INTEGER NOT NULL DEFAULT 0,
        margin_percent REAL NOT NULL DEFAULT 0.0,
        line_risk_score REAL NOT NULL DEFAULT 0.0,
        comments TEXT,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );
      CREATE INDEX IF NOT EXISTS idx_qlines_quote ON quotation_lines(quotation_id);
      CREATE INDEX IF NOT EXISTS idx_qlines_product ON quotation_lines(product_id);

      -- 11. Versioned Approval Snapshots (Graceful Fallback)
      CREATE TABLE IF NOT EXISTS versioned_approval_snapshots (
        id TEXT PRIMARY KEY,
        quotation_id TEXT NOT NULL,
        version INTEGER NOT NULL,
        approver_role TEXT NOT NULL,
        approver_id TEXT NOT NULL,
        status TEXT NOT NULL,
        approved_discount_percent REAL NOT NULL DEFAULT 0.0,
        approved_incentive_cents INTEGER NOT NULL DEFAULT 0,
        snapshot_payload_json TEXT NOT NULL,
        approved_at TEXT NOT NULL,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_snapshots_quote ON versioned_approval_snapshots(quotation_id);

      -- 12. Shipment Orders (Phase 8 Multi-Warehouse Split)
      CREATE TABLE IF NOT EXISTS shipment_orders (
        id TEXT PRIMARY KEY,
        quotation_id TEXT NOT NULL,
        warehouse_id TEXT NOT NULL,
        tracking_number TEXT,
        carrier TEXT,
        status TEXT NOT NULL DEFAULT 'Placed',
        shipped_at TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        FOREIGN KEY (warehouse_id) REFERENCES warehouses(id)
      );
      CREATE INDEX IF NOT EXISTS idx_shipments_quote ON shipment_orders(quotation_id);

      -- 13. Shipment Items
      CREATE TABLE IF NOT EXISTS shipment_items (
        id TEXT PRIMARY KEY,
        shipment_order_id TEXT NOT NULL,
        quotation_line_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        FOREIGN KEY (shipment_order_id) REFERENCES shipment_orders(id) ON DELETE CASCADE
      );

      -- 14. Backorder Tickets
      CREATE TABLE IF NOT EXISTS backorder_tickets (
        id TEXT PRIMARY KEY,
        quotation_id TEXT NOT NULL,
        product_id TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        created_at TEXT NOT NULL,
        resolved_at TEXT,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id)
      );

      -- 15. Negotiation Messages (Phase 7 Customer Portal)
      CREATE TABLE IF NOT EXISTS negotiation_messages (
        id TEXT PRIMARY KEY,
        quotation_id TEXT NOT NULL,
        sender_role TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        proposed_discount_percent REAL,
        message_text TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (quotation_id) REFERENCES quotations(id) ON DELETE CASCADE
      );

      -- 16. Audit Logs (Compliance & WebSockets)
      CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        aggregate_type TEXT NOT NULL,
        aggregate_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        payload_json TEXT NOT NULL,
        actor_id TEXT NOT NULL,
        actor_role TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE INDEX IF NOT EXISTS idx_audit_aggregate ON audit_logs(aggregate_type, aggregate_id);
    `);
  }

  /**
   * Executes a callback within an ACID immediate transaction.
   * Automatically commits on return or rolls back on thrown exception.
   * Supports re-entrant/nested calls seamlessly.
   * 
   * @template T
   * @param {(db: SqliteDatabase) => T} fn
   * @returns {T}
   */
  withTransaction(fn) {
    if (this._inTransaction) {
      return fn(this);
    }

    this._inTransaction = true;
    this.db.exec("BEGIN IMMEDIATE;");
    try {
      const result = fn(this);
      this.db.exec("COMMIT;");
      return result;
    } catch (err) {
      try {
        this.db.exec("ROLLBACK;");
      } catch {
        // Rollback error secondary
      }
      throw err;
    } finally {
      this._inTransaction = false;
    }
  }

  close() {
    try {
      this.db.close();
    } catch {
      // Ignored if already closed
    }
  }

  clear() {
    this.withTransaction(() => {
      this.db.exec(`
        DELETE FROM quotation_lines;
        DELETE FROM versioned_approval_snapshots;
        DELETE FROM shipment_items;
        DELETE FROM shipment_orders;
        DELETE FROM backorder_tickets;
        DELETE FROM negotiation_messages;
        DELETE FROM quotations;
        DELETE FROM stock_inventory;
        DELETE FROM product_variants;
        DELETE FROM products;
        DELETE FROM warehouses;
        DELETE FROM customer_price_lists;
        DELETE FROM customers;
        DELETE FROM discount_rules;
        DELETE FROM incentive_rules;
        DELETE FROM audit_logs;
      `);
    });
  }
}

// -----------------------------------------------------------------------------
// SQLite Customer Repository
// -----------------------------------------------------------------------------
export class SqliteCustomerRepository {
  /**
   * @param {SqliteDatabase} sqliteDb
   */
  constructor(sqliteDb) {
    this.db = sqliteDb.db;
  }

  findById(id) {
    const row = this.db.prepare("SELECT * FROM customers WHERE id = ?").get(id);
    return row ? this.mapRow(row) : undefined;
  }

  findByEmail(email) {
    const row = this.db.prepare("SELECT * FROM customers WHERE LOWER(email) = LOWER(?)").get(email);
    return row ? this.mapRow(row) : undefined;
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM customers ORDER BY name ASC").all();
    return rows.map((r) => this.mapRow(r));
  }

  save(customer) {
    const now = new Date().toISOString();
    customer.updatedAt = now;
    if (!customer.createdAt) customer.createdAt = now;

    const stmt = this.db.prepare(`
      INSERT INTO customers (
        id, name, email, tier, annual_spend_cents, dso_days, overdue_days,
        max_overdue_days, cadence_orders_90d, trailing_90d_spend_cents,
        trailing_180d_spend_cents, trailing_365d_spend_cents, default_rate,
        credit_limit_cents, payment_terms, data_json, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        tier = excluded.tier,
        annual_spend_cents = excluded.annual_spend_cents,
        dso_days = excluded.dso_days,
        overdue_days = excluded.overdue_days,
        max_overdue_days = excluded.max_overdue_days,
        cadence_orders_90d = excluded.cadence_orders_90d,
        trailing_90d_spend_cents = excluded.trailing_90d_spend_cents,
        trailing_180d_spend_cents = excluded.trailing_180d_spend_cents,
        trailing_365d_spend_cents = excluded.trailing_365d_spend_cents,
        default_rate = excluded.default_rate,
        credit_limit_cents = excluded.credit_limit_cents,
        payment_terms = excluded.payment_terms,
        data_json = excluded.data_json,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      customer.id,
      customer.name,
      customer.email,
      customer.tier || "Bronze",
      customer.annualSpendCents || 0,
      customer.dsoDays ?? customer.averageDSO ?? 30,
      customer.overdueDays || 0,
      customer.maxOverdueDays || 0,
      customer.cadenceOrders90d || customer.ordersTrailing90Days || 0,
      customer.trailing90dSpendCents || customer.trailing90DaySpendCents || 0,
      customer.trailing180dSpendCents || customer.trailing180DaySpendCents || 0,
      customer.trailing365dSpendCents || customer.trailing365DaySpendCents || 0,
      customer.defaultRate || 0.0,
      customer.creditLimitCents ?? 1000000,
      customer.paymentTerms || "Net30",
      JSON.stringify(customer),
      customer.createdAt,
      customer.updatedAt
    );

    return customer;
  }

  delete(id) {
    const res = this.db.prepare("DELETE FROM customers WHERE id = ?").run(id);
    return res.changes > 0;
  }

  mapRow(row) {
    let rawData = {};
    if (row.data_json) {
      try {
        rawData = JSON.parse(row.data_json);
      } catch {
        // empty
      }
    }
    return {
      ...rawData,
      id: row.id,
      name: row.name,
      email: row.email,
      tier: row.tier,
      annualSpendCents: row.annual_spend_cents,
      dsoDays: row.dso_days,
      overdueDays: row.overdue_days,
      maxOverdueDays: row.max_overdue_days,
      cadenceOrders90d: row.cadence_orders_90d,
      trailing90dSpendCents: row.trailing_90d_spend_cents,
      trailing180dSpendCents: row.trailing_180d_spend_cents,
      trailing365dSpendCents: row.trailing_365d_spend_cents,
      defaultRate: row.default_rate,
      creditLimitCents: row.credit_limit_cents,
      paymentTerms: row.payment_terms,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// -----------------------------------------------------------------------------
// SQLite Product Repository
// -----------------------------------------------------------------------------
export class SqliteProductRepository {
  constructor(sqliteDb) {
    this.db = sqliteDb.db;
  }

  findById(id) {
    const row = this.db.prepare("SELECT * FROM products WHERE id = ?").get(id);
    return row ? this.mapRow(row) : undefined;
  }

  findBySku(sku) {
    const row = this.db.prepare("SELECT * FROM products WHERE sku = ?").get(sku);
    return row ? this.mapRow(row) : undefined;
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM products ORDER BY sku ASC").all();
    return rows.map((r) => this.mapRow(r));
  }

  save(product) {
    const now = new Date().toISOString();
    product.updatedAt = now;
    if (!product.createdAt) product.createdAt = now;

    const stmt = this.db.prepare(`
      INSERT INTO products (
        id, sku, name, category, list_price_cents, cost_price_cents,
        is_subscription, billing_frequency, active, data_json, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) ON CONFLICT(id) DO UPDATE SET
        sku = excluded.sku,
        name = excluded.name,
        category = excluded.category,
        list_price_cents = excluded.list_price_cents,
        cost_price_cents = excluded.cost_price_cents,
        is_subscription = excluded.is_subscription,
        billing_frequency = excluded.billing_frequency,
        active = excluded.active,
        data_json = excluded.data_json,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      product.id,
      product.sku,
      product.name,
      product.category,
      product.listPriceCents,
      product.costPriceCents,
      product.isSubscription || product.category === "Subscription" ? 1 : 0,
      product.billingFrequency || product.billingCycle || null,
      product.active !== false ? 1 : 0,
      JSON.stringify(product),
      product.createdAt,
      product.updatedAt
    );

    return product;
  }

  mapRow(row) {
    let rawData = {};
    if (row.data_json) {
      try {
        rawData = JSON.parse(row.data_json);
      } catch {
        // empty
      }
    }
    return {
      ...rawData,
      id: row.id,
      sku: row.sku,
      name: row.name,
      category: row.category,
      listPriceCents: row.list_price_cents,
      costPriceCents: row.cost_price_cents,
      isSubscription: row.is_subscription === 1,
      billingFrequency: row.billing_frequency,
      active: row.active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}

// -----------------------------------------------------------------------------
// SQLite Warehouse & Inventory Repositories
// -----------------------------------------------------------------------------
export class SqliteWarehouseRepository {
  constructor(sqliteDb) {
    this.db = sqliteDb.db;
  }

  findById(id) {
    const row = this.db.prepare("SELECT * FROM warehouses WHERE id = ?").get(id);
    return row ? this.mapRow(row) : undefined;
  }

  findPrimaryHub() {
    const row = this.db.prepare("SELECT * FROM warehouses WHERE is_primary_hub = 1 AND active = 1").get();
    return row ? this.mapRow(row) : undefined;
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM warehouses ORDER BY code ASC").all();
    return rows.map((r) => this.mapRow(r));
  }

  save(warehouse) {
    const stmt = this.db.prepare(`
      INSERT INTO warehouses (
        id, code, name, city, state, country, is_primary_hub, active, capacity_units, data_json
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) ON CONFLICT(id) DO UPDATE SET
        code = excluded.code,
        name = excluded.name,
        city = excluded.city,
        state = excluded.state,
        country = excluded.country,
        is_primary_hub = excluded.is_primary_hub,
        active = excluded.active,
        capacity_units = excluded.capacity_units,
        data_json = excluded.data_json
    `);

    stmt.run(
      warehouse.id,
      warehouse.code,
      warehouse.name,
      warehouse.city,
      warehouse.state,
      warehouse.country || "USA",
      warehouse.isPrimaryHub ? 1 : 0,
      warehouse.active !== false ? 1 : 0,
      warehouse.capacityUnits || 50000,
      JSON.stringify(warehouse)
    );

    return warehouse;
  }

  mapRow(row) {
    let rawData = {};
    if (row.data_json) {
      try {
        rawData = JSON.parse(row.data_json);
      } catch {
        // empty
      }
    }
    return {
      ...rawData,
      id: row.id,
      code: row.code,
      name: row.name,
      city: row.city,
      state: row.state,
      country: row.country,
      isPrimaryHub: row.is_primary_hub === 1,
      active: row.active === 1,
      capacityUnits: row.capacity_units,
    };
  }
}

export class SqliteInventoryRepository {
  constructor(sqliteDb) {
    this.db = sqliteDb.db;
  }

  findByProductAndWarehouse(productId, warehouseId) {
    const row = this.db.prepare(`
      SELECT * FROM stock_inventory WHERE product_id = ? AND warehouse_id = ?
    `).get(productId, warehouseId);
    return row ? this.mapRow(row) : undefined;
  }

  findByProductId(productId) {
    const rows = this.db.prepare(`
      SELECT * FROM stock_inventory WHERE product_id = ? ORDER BY warehouse_id ASC
    `).all(productId);
    return rows.map((r) => this.mapRow(r));
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM stock_inventory").all();
    return rows.map((r) => this.mapRow(r));
  }

  save(item) {
    item.updatedAt = new Date().toISOString();
    const stmt = this.db.prepare(`
      INSERT INTO stock_inventory (
        id, product_id, warehouse_id, physical_stock, reserved_stock,
        safety_buffer, reorder_point, data_json, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) ON CONFLICT(id) DO UPDATE SET
        physical_stock = excluded.physical_stock,
        reserved_stock = excluded.reserved_stock,
        safety_buffer = excluded.safety_buffer,
        reorder_point = excluded.reorder_point,
        data_json = excluded.data_json,
        updated_at = excluded.updated_at
    `);

    stmt.run(
      item.id,
      item.productId,
      item.warehouseId,
      item.physicalStock || 0,
      item.reservedStock || 0,
      item.safetyBuffer ?? 10,
      item.reorderPoint ?? 20,
      JSON.stringify(item),
      item.updatedAt
    );

    return item;
  }

  mapRow(row) {
    let rawData = {};
    if (row.data_json) {
      try {
        rawData = JSON.parse(row.data_json);
      } catch {
        // empty
      }
    }
    return {
      ...rawData,
      id: row.id,
      productId: row.product_id,
      warehouseId: row.warehouse_id,
      physicalStock: row.physical_stock,
      reservedStock: row.reserved_stock,
      safetyBuffer: row.safety_buffer,
      reorderPoint: row.reorder_point,
      updatedAt: row.updated_at,
    };
  }
}

// -----------------------------------------------------------------------------
// SQLite Discount & Incentive Rule Repositories
// -----------------------------------------------------------------------------
export class SqliteDiscountRuleRepository {
  constructor(sqliteDb) {
    this.db = sqliteDb.db;
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM discount_rules WHERE active = 1").all();
    return rows.map((r) => {
      let rawData = {};
      if (r.data_json) {
        try {
          rawData = JSON.parse(r.data_json);
        } catch {
          // empty
        }
      }
      return {
        ...rawData,
        id: r.id,
        ruleType: r.rule_type || rawData.ruleType || "CategoryCeiling",
        category: rawData.category || r.target_id,
        standardCeilingPct: rawData.standardCeilingPct ?? r.max_discount_percent,
        targetType: r.target_type,
        targetId: r.target_id,
        maxDiscountPercent: r.max_discount_percent,
        minMarginPercent: r.min_margin_percent,
        active: r.active === 1,
      };
    });
  }

  save(rule) {
    const stmt = this.db.prepare(`
      INSERT INTO discount_rules (
        id, rule_type, target_type, target_id, max_discount_percent,
        min_margin_percent, active, data_json
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?
      ) ON CONFLICT(id) DO UPDATE SET
        max_discount_percent = excluded.max_discount_percent,
        min_margin_percent = excluded.min_margin_percent,
        active = excluded.active,
        data_json = excluded.data_json
    `);

    stmt.run(
      rule.id,
      rule.ruleType || "CategoryCeiling",
      rule.targetType || "Category",
      rule.targetId || rule.category || "General",
      rule.maxDiscountPercent ?? rule.standardCeilingPct ?? 15.0,
      rule.minMarginPercent ?? 18.0,
      rule.active !== false ? 1 : 0,
      JSON.stringify(rule)
    );

    return rule;
  }
}

export class SqliteIncentiveRuleRepository {
  constructor(sqliteDb) {
    this.db = sqliteDb.db;
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM incentive_rules WHERE active = 1").all();
    return rows.map((r) => this.mapRow(r));
  }

  findByCode(code) {
    const row = this.db.prepare("SELECT * FROM incentive_rules WHERE code = ?").get(code);
    return row ? this.mapRow(row) : undefined;
  }

  save(rule) {
    const stmt = this.db.prepare(`
      INSERT INTO incentive_rules (
        id, code, name, description, rule_type, parameters_json,
        discount_percent, rebate_cents, active, data_json
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      ) ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        description = excluded.description,
        rule_type = excluded.rule_type,
        parameters_json = excluded.parameters_json,
        discount_percent = excluded.discount_percent,
        rebate_cents = excluded.rebate_cents,
        active = excluded.active,
        data_json = excluded.data_json
    `);

    stmt.run(
      rule.id,
      rule.code,
      rule.name,
      rule.description || "",
      rule.ruleType || rule.conditionType || "VolumeSpike",
      JSON.stringify(rule.parameters || {}),
      rule.discountPercent ?? rule.discountPctBonus ?? 0.0,
      rule.rebateCents ?? rule.flatRebateCents ?? 0,
      rule.active !== false ? 1 : 0,
      JSON.stringify(rule)
    );

    return rule;
  }

  mapRow(row) {
    let rawData = {};
    if (row.data_json) {
      try {
        rawData = JSON.parse(row.data_json);
      } catch {
        // empty
      }
    }
    return {
      ...rawData,
      id: row.id,
      code: row.code,
      name: row.name,
      description: row.description,
      ruleType: row.rule_type,
      conditionType: rawData.conditionType || row.rule_type,
      parameters: rawData.parameters || {},
      discountPercent: rawData.discountPctBonus ?? row.discount_percent,
      discountPctBonus: rawData.discountPctBonus ?? row.discount_percent,
      rebateCents: rawData.flatRebateCents ?? row.rebate_cents,
      flatRebateCents: rawData.flatRebateCents ?? row.rebate_cents,
      minOrderCents: rawData.minOrderCents || 0,
      minHistoryOrders: rawData.minHistoryOrders || 0,
      active: row.active === 1,
    };
  }
}

// -----------------------------------------------------------------------------
// SQLite Quotation Repository (With Cascade Lines & OCC)
// -----------------------------------------------------------------------------
export class SqliteQuotationRepository {
  /**
   * @param {SqliteDatabase} sqliteDb
   */
  constructor(sqliteDb) {
    this.sqliteDb = sqliteDb;
    this.db = sqliteDb.db;
  }

  findById(id) {
    const qRow = this.db.prepare("SELECT * FROM quotations WHERE id = ?").get(id);
    if (!qRow) return undefined;
    return this.hydrateQuotation(qRow);
  }

  findByCustomerId(customerId) {
    const rows = this.db.prepare("SELECT * FROM quotations WHERE customer_id = ? ORDER BY created_at DESC").all(customerId);
    return rows.map((r) => this.hydrateQuotation(r));
  }

  findAll() {
    const rows = this.db.prepare("SELECT * FROM quotations ORDER BY created_at DESC").all();
    return rows.map((r) => this.hydrateQuotation(r));
  }

  save(quotation) {
    return this.sqliteDb.withTransaction(() => {
      const now = new Date().toISOString();
      quotation.updatedAt = now;
      if (!quotation.createdAt) quotation.createdAt = now;

      // 1. Upsert root quotation row
      const stmt = this.db.prepare(`
        INSERT INTO quotations (
          id, quote_number, customer_id, sales_rep_id, status, version,
          subtotal_cents, discount_amount_cents, tax_amount_cents, net_total_cents,
          total_cost_cents, gross_margin_percent, blended_risk_score,
          requires_manager_approval, requires_finance_approval, fallback_snapshot_json,
          notes, data_json, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
        ) ON CONFLICT(id) DO UPDATE SET
          quote_number = excluded.quote_number,
          customer_id = excluded.customer_id,
          sales_rep_id = excluded.sales_rep_id,
          status = excluded.status,
          version = excluded.version,
          subtotal_cents = excluded.subtotal_cents,
          discount_amount_cents = excluded.discount_amount_cents,
          tax_amount_cents = excluded.tax_amount_cents,
          net_total_cents = excluded.net_total_cents,
          total_cost_cents = excluded.total_cost_cents,
          gross_margin_percent = excluded.gross_margin_percent,
          blended_risk_score = excluded.blended_risk_score,
          requires_manager_approval = excluded.requires_manager_approval,
          requires_finance_approval = excluded.requires_finance_approval,
          fallback_snapshot_json = excluded.fallback_snapshot_json,
          notes = excluded.notes,
          data_json = excluded.data_json,
          updated_at = excluded.updated_at
      `);

      stmt.run(
        quotation.id,
        quotation.quoteNumber,
        quotation.customerId,
        quotation.salesRepId || "rep-001",
        quotation.status || "Draft",
        quotation.version || 1,
        quotation.subtotalCents || 0,
        quotation.discountAmountCents || quotation.discountTotalCents || 0,
        quotation.taxAmountCents || 0,
        quotation.netTotalCents || 0,
        quotation.totalCostCents || quotation.costTotalCents || 0,
        quotation.grossMarginPercent || quotation.grossMarginPct || 0.0,
        quotation.blendedRiskScore || 0.0,
        quotation.requiresManagerApproval ? 1 : 0,
        quotation.requiresFinanceApproval ? 1 : 0,
        quotation.fallbackSnapshot ? JSON.stringify(quotation.fallbackSnapshot) : null,
        quotation.notes || null,
        JSON.stringify(quotation),
        quotation.createdAt,
        quotation.updatedAt
      );

      // 2. Cascade lines
      if (Array.isArray(quotation.lines)) {
        this.db.prepare("DELETE FROM quotation_lines WHERE quotation_id = ?").run(quotation.id);
        const lineStmt = this.db.prepare(`
          INSERT INTO quotation_lines (
            id, quotation_id, product_id, quantity, list_price_cents,
            cost_price_cents, discount_percent, net_price_cents, total_net_cents,
            total_cost_cents, margin_percent, line_risk_score, comments
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
          )
        `);

        for (const line of quotation.lines) {
          lineStmt.run(
            line.id,
            quotation.id,
            line.productId,
            line.quantity || 1,
            line.unitListPriceCents || line.listPriceCents || 0,
            line.unitCostPriceCents || line.costPriceCents || 0,
            line.discountPct ?? line.discountPercent ?? line.unitDiscountPercentage ?? 0.0,
            line.netUnitPriceCents || line.netPriceCents || 0,
            line.lineSubtotalCents || line.totalNetCents || 0,
            line.lineCostCents || line.totalCostCents || 0,
            line.grossMarginPct ?? line.marginPercent ?? 0.0,
            line.lineRiskScore || 0.0,
            line.comments || null
          );
        }
      }

      return quotation;
    });
  }

  delete(id) {
    const res = this.db.prepare("DELETE FROM quotations WHERE id = ?").run(id);
    return res.changes > 0;
  }

  updateVersion(id, expectedVersion, updates = {}) {
    return this.sqliteDb.withTransaction(() => {
      const existing = this.findById(id);
      if (!existing) return null;
      if (existing.version !== expectedVersion) {
        return null;
      }
      const updated = {
        ...existing,
        ...updates,
        version: existing.version + 1,
        updatedAt: new Date().toISOString(),
      };
      return this.save(updated);
    });
  }

  hydrateQuotation(qRow) {
    let rawData = {};
    if (qRow.data_json) {
      try {
        rawData = JSON.parse(qRow.data_json);
      } catch {
        // empty
      }
    }

    const lines = this.db.prepare(`
      SELECT * FROM quotation_lines WHERE quotation_id = ? ORDER BY rowid ASC
    `).all(qRow.id).map((l) => ({
      id: l.id,
      quotationId: l.quotation_id,
      productId: l.product_id,
      quantity: l.quantity,
      listPriceCents: l.list_price_cents,
      costPriceCents: l.cost_price_cents,
      unitListPriceCents: l.list_price_cents,
      unitCostPriceCents: l.cost_price_cents,
      discountPercent: l.discount_percent,
      discountPct: l.discount_percent,
      discountPercentage: l.discount_percent,
      unitDiscountPercentage: l.discount_percent,
      netPriceCents: l.net_price_cents,
      netUnitPriceCents: l.net_price_cents,
      totalNetCents: l.total_net_cents,
      lineSubtotalCents: l.total_net_cents,
      totalCostCents: l.total_cost_cents,
      lineCostCents: l.total_cost_cents,
      grossMarginCents: l.total_net_cents - l.total_cost_cents,
      marginPercent: l.margin_percent,
      grossMarginPct: l.margin_percent,
      lineRiskScore: l.line_risk_score,
      comments: l.comments,
    }));

    let fallbackSnapshot = null;
    if (qRow.fallback_snapshot_json) {
      try {
        fallbackSnapshot = JSON.parse(qRow.fallback_snapshot_json);
      } catch {
        // empty
      }
    }

    return {
      ...rawData,
      id: qRow.id,
      quoteNumber: qRow.quote_number,
      customerId: qRow.customer_id,
      salesRepId: qRow.sales_rep_id,
      status: qRow.status,
      version: qRow.version,
      subtotalCents: qRow.subtotal_cents,
      discountAmountCents: qRow.discount_amount_cents,
      discountTotalCents: qRow.discount_amount_cents,
      taxAmountCents: qRow.tax_amount_cents,
      netTotalCents: qRow.net_total_cents,
      totalCostCents: qRow.total_cost_cents,
      costTotalCents: qRow.total_cost_cents,
      grossMarginPercent: qRow.gross_margin_percent,
      grossMarginPct: qRow.gross_margin_percent,
      grossMarginCents: qRow.net_total_cents - qRow.total_cost_cents,
      blendedRiskScore: qRow.blended_risk_score,
      requiresManagerApproval: qRow.requires_manager_approval === 1,
      requiresFinanceApproval: qRow.requires_finance_approval === 1,
      fallbackSnapshot: fallbackSnapshot || rawData.fallbackSnapshot || null,
      lastApprovedSnapshot: fallbackSnapshot || rawData.lastApprovedSnapshot || null,
      approvalChain: rawData.approvalChain || [],
      approvalHistory: rawData.approvalChain || rawData.approvalHistory || [],
      appliedIncentives: rawData.appliedIncentives || [],
      notes: qRow.notes,
      createdAt: qRow.created_at,
      updatedAt: qRow.updated_at,
      lines: lines.length > 0 ? lines : (rawData.lines || []),
    };
  }
}
