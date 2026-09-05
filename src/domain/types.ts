/**
 * DealFlow360 - Enterprise Domain Types & Schemas
 * Phase 1: Core Domain Entities & Relational Invariants
 * 
 * Strict Invariants:
 * - Integer Cents: All currency amounts stored as integers (1 USD = 100 cents).
 * - Zero Any: Strict TypeScript typing across all models.
 * - Strict Roles: Admin, SalesRep, SalesManager, Finance, Customer, Warehouse.
 * - Escalation Tiers: SalesRep -> SalesManager -> Finance (Executive VP eliminated).
 */

export const USER_ROLES = [
  'Admin',
  'SalesRep',
  'SalesManager',
  'Finance',
  'Customer',
  'Warehouse',
] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const CUSTOMER_TIERS = ['Bronze', 'Silver', 'Gold', 'Platinum'] as const;
export type CustomerTier = (typeof CUSTOMER_TIERS)[number];

export const PAYMENT_TERMS = ['Net0', 'Net15', 'Net30', 'Net45', 'Net60'] as const;
export type PaymentTerms = (typeof PAYMENT_TERMS)[number];

export const PRODUCT_CATEGORIES = ['Hardware', 'Service', 'Subscription'] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export const SUBSCRIPTION_BILLING_CYCLES = ['Monthly', 'Quarterly', 'Annual'] as const;
export type SubscriptionBillingCycle = (typeof SUBSCRIPTION_BILLING_CYCLES)[number];

export const QUOTATION_STATUSES = [
  'Draft',
  'PendingApproval',
  'Approved',
  'Sent',
  'UnderNegotiation',
  'Confirmed',
  'Rejected',
] as const;
export type QuotationStatus = (typeof QUOTATION_STATUSES)[number];

export const ESCALATION_TIERS = ['SalesRep', 'SalesManager', 'Finance'] as const;
export type EscalationTier = (typeof ESCALATION_TIERS)[number];

export interface CustomerOrderHistoryLog {
  orderId: string;
  orderNumber: string;
  orderDate: string; // ISO-8601
  totalCents: number;
  subtotalCents: number;
  itemCount: number;
  paidOnTime: boolean;
  overdueDays: number;
  paymentClearanceDate?: string;
}

export interface Customer {
  id: string;
  customerNumber: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  tier: CustomerTier;
  paymentTerms: PaymentTerms;
  creditLimitCents: number;
  outstandingBalanceCents: number;
  // Dynamic Progression Metrics
  trailing90DaySpendCents: number;
  trailing180DaySpendCents: number;
  trailing365DaySpendCents: number;
  ordersTrailing90Days: number;
  ordersTrailing365Days: number;
  totalPaidOrders: number;
  daysSinceLastOrder: number;
  averageDSO: number; // Days Sales Outstanding
  maxOverdueDays: number;
  defaultCount: number;
  // Detailed historical logs for incentive engine
  orderHistory: CustomerOrderHistoryLog[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  attributes: Record<string, string>;
  priceDeltaCents: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: ProductCategory;
  costPriceCents: number;
  listPriceCents: number;
  billingCycle?: SubscriptionBillingCycle; // Populated if category === 'Subscription'
  variants: ProductVariant[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  isPrimaryHub: boolean;
  active: boolean;
}

export interface InventoryItem {
  id: string;
  warehouseId: string;
  productId: string;
  variantId?: string;
  physicalStock: number;
  reservedStock: number;
  safetyBuffer: number;
  updatedAt: string;
}

export interface DiscountRule {
  id: string;
  category: ProductCategory;
  standardCeilingPct: number; // e.g. 15 for 15%
  tierCeilings: Record<CustomerTier, number>;
  active: boolean;
}

export type IncentiveConditionType = 
  | 'VolumeSpike'
  | 'MilestoneLoyalty'
  | 'BundledCare'
  | 'HistoricalSpend';

export interface IncentiveRule {
  id: string;
  code: string;
  name: string;
  description: string;
  conditionType: IncentiveConditionType;
  minOrderCents: number;
  minHistoryOrders: number;
  discountPctBonus: number; // e.g., 3 for 3% extra discount
  flatRebateCents: number; // e.g., 100000 cents ($1,000)
  active: boolean;
}

export interface QuotationLine {
  id: string;
  quotationId: string;
  productId: string;
  variantId?: string;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unitListPriceCents: number;
  unitCostPriceCents: number;
  discountPct: number; // 0 to 100
  discountAmountCents: number;
  netUnitPriceCents: number;
  lineSubtotalCents: number;
  lineCostCents: number;
  grossMarginCents: number;
  grossMarginPct: number;
  allocatedWarehouseId?: string;
}

export interface FallbackSnapshot {
  snapshotId: string;
  quotationId: string;
  approvedDiscountPct: number;
  approvedIncentiveCents: number;
  approvedSubtotalCents: number;
  approvedNetTotalCents: number;
  approvedMarginPct: number;
  approverRole: UserRole;
  approverName: string;
  reason: string;
  approvedAt: string;
}

export interface ApprovalLog {
  id: string;
  quotationId: string;
  approverRole: UserRole;
  approverName: string;
  action: 'Approved' | 'Rejected' | 'Escalated' | 'Countered' | 'FallbackReverted';
  discountPct: number;
  incentiveCents: number;
  comments: string;
  timestamp: string;
}

export interface Quotation {
  id: string;
  quoteNumber: string;
  customerId: string;
  salesRepId: string;
  salesRepName: string;
  status: QuotationStatus;
  lines: QuotationLine[];
  subtotalCents: number;
  discountTotalCents: number;
  incentiveTotalCents: number;
  netTotalCents: number;
  costTotalCents: number;
  grossMarginCents: number;
  grossMarginPct: number;
  blendedRiskScore: number;
  escalationTier: EscalationTier;
  approvalChain: ApprovalLog[];
  fallbackSnapshot?: FallbackSnapshot;
  validUntil: string;
  createdAt: string;
  updatedAt: string;
}
