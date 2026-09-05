/**
 * DealFlow360 - Type-Safe In-Memory Store & Repositories
 * Phase 1: Core Domain Entities
 * 
 * Provides atomic, isolated data structures for Customers, Products,
 * Warehouses, Inventory, Rules, and Quotations.
 */

import type {
  Customer,
  DiscountRule,
  IncentiveRule,
  InventoryItem,
  Product,
  Quotation,
  Warehouse,
} from "../domain/types.ts";

export class MemoryStore {
  public customers: Map<string, Customer> = new Map();
  public products: Map<string, Product> = new Map();
  public warehouses: Map<string, Warehouse> = new Map();
  public inventory: Map<string, InventoryItem> = new Map();
  public discountRules: Map<string, DiscountRule> = new Map();
  public incentiveRules: Map<string, IncentiveRule> = new Map();
  public quotations: Map<string, Quotation> = new Map();

  // Singleton instance
  private static instance: MemoryStore;

  public static getInstance(): MemoryStore {
    if (!MemoryStore.instance) {
      MemoryStore.instance = new MemoryStore();
    }
    return MemoryStore.instance;
  }

  public clear(): void {
    this.customers.clear();
    this.products.clear();
    this.warehouses.clear();
    this.inventory.clear();
    this.discountRules.clear();
    this.incentiveRules.clear();
    this.quotations.clear();
  }
}

// -----------------------------------------------------------------------------
// Customer Repository
// -----------------------------------------------------------------------------
export class CustomerRepository {
  private store = MemoryStore.getInstance();

  public findById(id: string): Customer | undefined {
    return this.store.customers.get(id);
  }

  public findByEmail(email: string): Customer | undefined {
    for (const c of this.store.customers.values()) {
      if (c.email.toLowerCase() === email.toLowerCase()) return c;
    }
    return undefined;
  }

  public findAll(): Customer[] {
    return Array.from(this.store.customers.values());
  }

  public save(customer: Customer): Customer {
    customer.updatedAt = new Date().toISOString();
    this.store.customers.set(customer.id, customer);
    return customer;
  }

  public delete(id: string): boolean {
    return this.store.customers.delete(id);
  }
}

// -----------------------------------------------------------------------------
// Product Repository
// -----------------------------------------------------------------------------
export class ProductRepository {
  private store = MemoryStore.getInstance();

  public findById(id: string): Product | undefined {
    return this.store.products.get(id);
  }

  public findBySku(sku: string): Product | undefined {
    for (const p of this.store.products.values()) {
      if (p.sku === sku) return p;
    }
    return undefined;
  }

  public findAll(): Product[] {
    return Array.from(this.store.products.values());
  }

  public save(product: Product): Product {
    product.updatedAt = new Date().toISOString();
    this.store.products.set(product.id, product);
    return product;
  }
}

// -----------------------------------------------------------------------------
// Warehouse & Inventory Repositories
// -----------------------------------------------------------------------------
export class WarehouseRepository {
  private store = MemoryStore.getInstance();

  public findById(id: string): Warehouse | undefined {
    return this.store.warehouses.get(id);
  }

  public findPrimaryHub(): Warehouse | undefined {
    for (const w of this.store.warehouses.values()) {
      if (w.isPrimaryHub && w.active) return w;
    }
    return undefined;
  }

  public findAll(): Warehouse[] {
    return Array.from(this.store.warehouses.values());
  }

  public save(warehouse: Warehouse): Warehouse {
    this.store.warehouses.set(warehouse.id, warehouse);
    return warehouse;
  }
}

export class InventoryRepository {
  private store = MemoryStore.getInstance();

  public findByProductAndWarehouse(productId: string, warehouseId: string): InventoryItem | undefined {
    for (const item of this.store.inventory.values()) {
      if (item.productId === productId && item.warehouseId === warehouseId) {
        return item;
      }
    }
    return undefined;
  }

  public findByProductId(productId: string): InventoryItem[] {
    const results: InventoryItem[] = [];
    for (const item of this.store.inventory.values()) {
      if (item.productId === productId) results.push(item);
    }
    return results;
  }

  public save(item: InventoryItem): InventoryItem {
    item.updatedAt = new Date().toISOString();
    this.store.inventory.set(item.id, item);
    return item;
  }
}

// -----------------------------------------------------------------------------
// Rule Repositories
// -----------------------------------------------------------------------------
export class DiscountRuleRepository {
  private store = MemoryStore.getInstance();

  public findAll(): DiscountRule[] {
    return Array.from(this.store.discountRules.values());
  }

  public save(rule: DiscountRule): DiscountRule {
    this.store.discountRules.set(rule.id, rule);
    return rule;
  }
}

export class IncentiveRuleRepository {
  private store = MemoryStore.getInstance();

  public findAll(): IncentiveRule[] {
    return Array.from(this.store.incentiveRules.values());
  }

  public findByCode(code: string): IncentiveRule | undefined {
    for (const r of this.store.incentiveRules.values()) {
      if (r.code === code) return r;
    }
    return undefined;
  }

  public save(rule: IncentiveRule): IncentiveRule {
    this.store.incentiveRules.set(rule.id, rule);
    return rule;
  }
}

// -----------------------------------------------------------------------------
// Quotation Repository
// -----------------------------------------------------------------------------
export class QuotationRepository {
  private store = MemoryStore.getInstance();

  public findById(id: string): Quotation | undefined {
    return this.store.quotations.get(id);
  }

  public findByCustomerId(customerId: string): Quotation[] {
    const results: Quotation[] = [];
    for (const q of this.store.quotations.values()) {
      if (q.customerId === customerId) results.push(q);
    }
    return results;
  }

  public findAll(): Quotation[] {
    return Array.from(this.store.quotations.values());
  }

  public save(quotation: Quotation): Quotation {
    quotation.updatedAt = new Date().toISOString();
    this.store.quotations.set(quotation.id, quotation);
    return quotation;
  }
}
