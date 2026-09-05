/**
 * DealFlow360 - Enterprise Domain Types, Constants & Schemas
 * Phase 1: Core Domain Entities & Relational Invariants (JavaScript Edition)
 * 
 * Strict Invariants:
 * - Integer Cents: All currency amounts stored as integers (1 USD = 100 cents).
 * - Strict Roles: Admin, SalesRep, SalesManager, Finance, Customer, Warehouse.
 * - Escalation Tiers: SalesRep -> SalesManager -> Finance (Executive VP eliminated).
 */

export const USER_ROLES = Object.freeze([
  'Admin',
  'SalesRep',
  'SalesManager',
  'Finance',
  'Customer',
  'Warehouse',
]);

export const CUSTOMER_TIERS = Object.freeze([
  'Bronze',
  'Silver',
  'Gold',
  'Platinum',
]);

export const PAYMENT_TERMS = Object.freeze([
  'Net0',
  'Net15',
  'Net30',
  'Net45',
  'Net60',
]);

export const PRODUCT_CATEGORIES = Object.freeze([
  'Hardware',
  'Service',
  'Subscription',
]);

export const SUBSCRIPTION_BILLING_CYCLES = Object.freeze([
  'Monthly',
  'Quarterly',
  'Annual',
]);

export const QUOTATION_STATUSES = Object.freeze([
  'Draft',
  'PendingApproval',
  'Approved',
  'Sent',
  'UnderNegotiation',
  'Confirmed',
  'Rejected',
]);

export const ESCALATION_TIERS = Object.freeze([
  'SalesRep',
  'SalesManager',
  'Finance',
]);
