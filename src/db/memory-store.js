/**
 * DealFlow360 - In-Memory Store & Repositories (JavaScript Edition)
 * Phase 1: Core Domain Entities
 * 
 * Provides atomic, isolated data structures for Customers, Products,
 * Warehouses, Inventory, Rules, and Quotations.
 */

export class MemoryStore {
  constructor() {
    this.customers = new Map();
    this.products = new Map();
    this.warehouses = new Map();
    this.inventory = new Map();
    this.discountRules = new Map();
    this.incentiveRules = new Map();
    this.quotations = new Map();
    this.shipments = new Map();
    this.backorders = new Map();
  }

  static instance = null;

  static getInstance() {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  clear() {
    this.customers.clear();
    this.products.clear();
    this.warehouses.clear();
    this.inventory.clear();
    this.discountRules.clear();
    this.incentiveRules.clear();
    this.quotations.clear();
    this.shipments.clear();
    this.backorders.clear();
  }
}

// -----------------------------------------------------------------------------
// Customer Repository
// -----------------------------------------------------------------------------
export class CustomerRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findById(id) {
    return this.store.customers.get(id);
  }

  findByEmail(email) {
    for (const c of this.store.customers.values()) {
      if (c.email.toLowerCase() === email.toLowerCase()) return c;
    }
    return undefined;
  }

  findAll() {
    return Array.from(this.store.customers.values());
  }

  save(customer) {
    customer.updatedAt = new Date().toISOString();
    this.store.customers.set(customer.id, customer);
    return customer;
  }

  delete(id) {
    return this.store.customers.delete(id);
  }
}

// -----------------------------------------------------------------------------
// Product Repository
// -----------------------------------------------------------------------------
export class ProductRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findById(id) {
    return this.store.products.get(id);
  }

  findBySku(sku) {
    for (const p of this.store.products.values()) {
      if (p.sku === sku) return p;
    }
    return undefined;
  }

  findAll() {
    return Array.from(this.store.products.values());
  }

  save(product) {
    product.updatedAt = new Date().toISOString();
    this.store.products.set(product.id, product);
    return product;
  }
}

// -----------------------------------------------------------------------------
// Warehouse & Inventory Repositories
// -----------------------------------------------------------------------------
export class WarehouseRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findById(id) {
    return this.store.warehouses.get(id);
  }

  findPrimaryHub() {
    for (const w of this.store.warehouses.values()) {
      if (w.isPrimaryHub && w.active) return w;
    }
    return undefined;
  }

  findAll() {
    return Array.from(this.store.warehouses.values());
  }

  save(warehouse) {
    this.store.warehouses.set(warehouse.id, warehouse);
    return warehouse;
  }
}

export class InventoryRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findByProductAndWarehouse(productId, warehouseId) {
    for (const item of this.store.inventory.values()) {
      if (item.productId === productId && item.warehouseId === warehouseId) {
        return item;
      }
    }
    return undefined;
  }

  findByProductId(productId) {
    const results = [];
    for (const item of this.store.inventory.values()) {
      if (item.productId === productId) results.push(item);
    }
    return results;
  }

  findAll() {
    return Array.from(this.store.inventory.values());
  }

  save(item) {
    item.updatedAt = new Date().toISOString();
    this.store.inventory.set(item.id, item);
    return item;
  }
}

// -----------------------------------------------------------------------------
// Rule Repositories
// -----------------------------------------------------------------------------
export class DiscountRuleRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findAll() {
    return Array.from(this.store.discountRules.values());
  }

  save(rule) {
    this.store.discountRules.set(rule.id, rule);
    return rule;
  }
}

export class IncentiveRuleRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findAll() {
    return Array.from(this.store.incentiveRules.values());
  }

  findByCode(code) {
    for (const r of this.store.incentiveRules.values()) {
      if (r.code === code) return r;
    }
    return undefined;
  }

  save(rule) {
    this.store.incentiveRules.set(rule.id, rule);
    return rule;
  }
}

// -----------------------------------------------------------------------------
// Quotation Repository
// -----------------------------------------------------------------------------
export class QuotationRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findById(id) {
    return this.store.quotations.get(id);
  }

  findByCustomerId(customerId) {
    const results = [];
    for (const q of this.store.quotations.values()) {
      if (q.customerId === customerId) results.push(q);
    }
    return results;
  }

  findAll() {
    return Array.from(this.store.quotations.values());
  }

  save(quotation) {
    quotation.updatedAt = new Date().toISOString();
    this.store.quotations.set(quotation.id, quotation);
    return quotation;
  }
}

// -----------------------------------------------------------------------------
// Shipment Repository (Phase 8 Multi-Warehouse Split)
// -----------------------------------------------------------------------------
export class ShipmentRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findById(id) {
    return this.store.shipments.get(id);
  }

  findByQuotationId(quotationId) {
    const results = [];
    for (const s of this.store.shipments.values()) {
      if (s.quotationId === quotationId) results.push(s);
    }
    return results;
  }

  findByWarehouseId(warehouseId) {
    const results = [];
    for (const s of this.store.shipments.values()) {
      if (s.warehouseId === warehouseId) results.push(s);
    }
    return results;
  }

  findAll(filters = {}) {
    let results = Array.from(this.store.shipments.values());
    if (filters.warehouseId) {
      results = results.filter((s) => s.warehouseId === filters.warehouseId);
    }
    if (filters.status) {
      results = results.filter((s) => s.status === filters.status);
    }
    return results;
  }

  save(shipment) {
    shipment.updatedAt = new Date().toISOString();
    this.store.shipments.set(shipment.id, shipment);
    return shipment;
  }
}

// -----------------------------------------------------------------------------
// Backorder Repository (Phase 8 Multi-Warehouse Split)
// -----------------------------------------------------------------------------
export class BackorderRepository {
  constructor() {
    this.store = MemoryStore.getInstance();
  }

  findById(id) {
    return this.store.backorders.get(id);
  }

  findByQuotationId(quotationId) {
    const results = [];
    for (const bo of this.store.backorders.values()) {
      if (bo.quotationId === quotationId) results.push(bo);
    }
    return results;
  }

  findAll() {
    return Array.from(this.store.backorders.values());
  }

  save(ticket) {
    ticket.updatedAt = new Date().toISOString();
    this.store.backorders.set(ticket.id, ticket);
    return ticket;
  }
}

