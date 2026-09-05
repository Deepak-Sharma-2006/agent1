/**
 * DealFlow360 - SQLite Database Seeder
 * Phase 3: Serverless Local SQL Persistence Layer
 * 
 * Populates realistic B2B enterprise seed data into the SQLite database:
 * Warehouses, Products, Inventory, Customers, Tier/Category Ceilings, and Incentive Rules.
 * Guarantees 100% parity with in-memory test fixtures.
 */

import {
  SqliteCustomerRepository,
  SqliteProductRepository,
  SqliteWarehouseRepository,
  SqliteInventoryRepository,
  SqliteDiscountRuleRepository,
  SqliteIncentiveRuleRepository,
  SqliteDatabase,
} from "./sqlite-store.js";
import { seedDatabase } from "./seed.js";
import { join } from "node:path";

/**
 * Seeds the SQLite database with enterprise test fixtures.
 * 
 * @param {SqliteDatabase} sqliteDb
 */
export function seedSqliteDatabase(sqliteDb) {
  const customRepos = {
    customerRepository: new SqliteCustomerRepository(sqliteDb),
    productRepository: new SqliteProductRepository(sqliteDb),
    warehouseRepository: new SqliteWarehouseRepository(sqliteDb),
    inventoryRepository: new SqliteInventoryRepository(sqliteDb),
    discountRuleRepository: new SqliteDiscountRuleRepository(sqliteDb),
    incentiveRuleRepository: new SqliteIncentiveRuleRepository(sqliteDb),
  };

  sqliteDb.withTransaction(() => {
    seedDatabase(customRepos);
  });
}

// Standalone execution support
if (process.argv[1] && process.argv[1].endsWith("sqlite-seed.js")) {
  const dbPath = join(process.cwd(), "prisma", "dev.db");
  const db = new SqliteDatabase(dbPath);
  seedSqliteDatabase(db);
  console.log("SQLite database seeded successfully at:", dbPath);
  db.close();
}
