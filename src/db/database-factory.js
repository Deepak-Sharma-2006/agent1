/**
 * DealFlow360 - Database Factory & Provider Switcher
 * Phase 3: Serverless Local SQL Persistence Layer
 * 
 * Provides unified repository factory abstraction for runtime database switching:
 * Supports 'sqlite' (native Node 24 SQLite persistence) and 'memory' (in-memory test mode).
 */

import { join } from "node:path";
import {
  MemoryStore,
  CustomerRepository as MemoryCustomerRepository,
  ProductRepository as MemoryProductRepository,
  WarehouseRepository as MemoryWarehouseRepository,
  InventoryRepository as MemoryInventoryRepository,
  DiscountRuleRepository as MemoryDiscountRuleRepository,
  IncentiveRuleRepository as MemoryIncentiveRuleRepository,
  QuotationRepository as MemoryQuotationRepository,
} from "./memory-store.js";
import { seedDatabase as seedMemoryDatabase } from "./seed.js";
import {
  SqliteDatabase,
  SqliteCustomerRepository,
  SqliteProductRepository,
  SqliteWarehouseRepository,
  SqliteInventoryRepository,
  SqliteDiscountRuleRepository,
  SqliteIncentiveRuleRepository,
  SqliteQuotationRepository,
} from "./sqlite-store.js";
import { seedSqliteDatabase } from "./sqlite-seed.js";

let activeSqliteDb = null;

/**
 * Initializes and returns a complete set of repositories for the specified provider.
 * 
 * @param {'sqlite'|'memory'} [provider]
 * @param {Object} [options={}]
 * @param {string} [options.dbPath]
 * @param {boolean} [options.seed=true]
 * @returns {Object} Repositories collection
 */
export function getRepositories(provider = process.env.DB_PROVIDER || "sqlite", options = {}) {
  const shouldSeed = options.seed !== false;

  if (provider === "memory") {
    if (shouldSeed) {
      seedMemoryDatabase();
    }
    return {
      provider: "memory",
      database: MemoryStore.getInstance(),
      customerRepository: new MemoryCustomerRepository(),
      productRepository: new MemoryProductRepository(),
      warehouseRepository: new MemoryWarehouseRepository(),
      inventoryRepository: new MemoryInventoryRepository(),
      discountRuleRepository: new MemoryDiscountRuleRepository(),
      incentiveRuleRepository: new MemoryIncentiveRuleRepository(),
      quotationRepository: new MemoryQuotationRepository(),
    };
  }

  // SQLite Provider (Default)
  const defaultPath = join(process.cwd(), "prisma", "dev.db");
  const dbPath = options.dbPath || defaultPath;

  if (!activeSqliteDb || options.forceNew) {
    if (activeSqliteDb && options.forceNew) {
      try {
        activeSqliteDb.close();
      } catch {
        // Ignored
      }
    }
    activeSqliteDb = new SqliteDatabase(dbPath);
    if (shouldSeed) {
      seedSqliteDatabase(activeSqliteDb);
    }
  }

  return {
    provider: "sqlite",
    database: activeSqliteDb,
    customerRepository: new SqliteCustomerRepository(activeSqliteDb),
    productRepository: new SqliteProductRepository(activeSqliteDb),
    warehouseRepository: new SqliteWarehouseRepository(activeSqliteDb),
    inventoryRepository: new SqliteInventoryRepository(activeSqliteDb),
    discountRuleRepository: new SqliteDiscountRuleRepository(activeSqliteDb),
    incentiveRuleRepository: new SqliteIncentiveRuleRepository(activeSqliteDb),
    quotationRepository: new SqliteQuotationRepository(activeSqliteDb),
  };
}

/**
 * Closes active database connections.
 */
export function closeDatabase() {
  if (activeSqliteDb) {
    try {
      activeSqliteDb.close();
    } catch {
      // Ignored
    }
    activeSqliteDb = null;
  }
}
