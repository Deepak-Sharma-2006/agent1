# Master Architecture Blueprint: DealFlow360 (Odoo Hackathon)
### An Intelligent, Self-Governing Sales Operations Platform

---

## 1. Executive Summary & Problem Synthesis

**DealFlow360** is an enterprise-grade B2B Sales Operations and CPQ (Configure, Price, Quote) platform engineered to solve the complex operational realities of modern enterprise sales teams. 

Beyond standard quote-to-invoice forms, DealFlow360 acts as an **autonomous, self-governing deal engine** that:
1. **Enforces Pricing Discipline**: Dynamically evaluates line-level category discount ceilings and customer tier limits to compute a multi-factor **Blended Discount Risk Score**, routing quotes through automated multi-tier approval chains (Sales Manager $\rightarrow$ Finance).
2. **Optimizes Deal Margins in Real Time**: Surfaces ranked live upsell and cross-sell recommendations with margin delta badges during quote authoring.
3. **Multi-Warehouse Fulfillment Splitting (5+ Warehouses)**: Evaluates real-time inventory across a 5+ warehouse network, auto-splitting orders to minimize shipping count and cost weighting, with full manual override and backorder consolidation.
4. **Hybrid Billing Engine**: Reconciles one-time hardware/service purchases with recurring subscriptions (monthly, quarterly, annual) on a single order, providing automated mid-cycle proration and billing schedules.
5. **Customer Portal Negotiation**: Provides an external, secure customer portal where buyers propose counter-discounts and line-level changes. Counter-proposals exceeding risk thresholds automatically re-enter the internal approval workflow.
6. **Deal Health & Anomaly Surveillance**: Proactively detects stalled quotes (>7 days), rep discount anomalies, and delivery promise slippage, enabling one-click nudges and managerial escalations.
7. **Offline-First Resilience**: Provides robust local caching, offline quotation drafting, and warehouse scan reconciliation for field operations with spotty connectivity.
8. **Dynamic Customer Tier Progression**: Automatically upgrades/degrades customer tiers (`Bronze` $\leftrightarrow$ `Silver` $\leftrightarrow$ `Gold` $\leftrightarrow$ `Platinum`) based on order volume, frequency (daily/weekly), consistency, and lifetime value (LTV), which directly tightens or loosens approval escalation triggers.
9. **Admin Condition-Based Incentive Engine & Escalation**: Allows Admins to define historical order-based incentive rules (e.g. volume milestones, loyalty bonuses). Managers can negotiate incentives based on customer order logs and escalate to Finance for bespoke terms on high-value orders.
10. **Graceful Fallback on Rejection**: If an escalated counter-offer or high-tier incentive is rejected by Finance/Management, the quote does not terminate; it gracefully reverts to the **Last Approved Best Offer** for immediate 1-click confirmation.
11. **Hard Discretionary Negotiation Caps**: Enforces strict, non-negotiable discount and incentive authorization caps per role (Sales Rep $\le 10\%$, Sales Manager $\le 20\%$, Finance $\le 35\%$) before mandatory upward escalation.

---

## 2. Dual-Repository Hackathon Protocol

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             DUAL-REPOSITORY COLLABORATION TOPOLOGY                                │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│   [Computer 1 (Alpha)] ─────────────┐                                                            │
│   Builds Phase Code                │  (git push origin)                                          │
│   Authors Dossier                  ▼                                                             │
│                         ┌───────────────────────┐                                                │
│                         │  INTERNAL COLLAB REPO │ ───► Full History + Cognitive Dossiers         │
│                         │  agent1 (origin)      │      (docs/dossiers/ retained 100%)            │
│                         └───────────────────────┘                                                │
│                                    │                                                             │
│                                    │  (git pull origin)                                          │
│                                    ▼                                                             │
│                          [Computer 2 (Beta)]                                                     │
│                          Audits 5 Layers (npm run audit:beta)                                    │
│                          Runs Strix AI DAST Pentest                                              │
│                          Updates Dossier in agent1                                               │
│                          Executes: npm run jury:publish                                          │
│                                    │                                                             │
│                                    │  (git push jury [clean branch])                             │
│                                    ▼                                                             │
│                         ┌───────────────────────┐                                                │
│                         │  HACKATHON SHOWCASE   │ ───► Clean Production Application Code Only    │
│                         │  575_final (jury)     │      ❌ Zero Internal Dossiers Exposed         │
│                         └───────────────────────┘                                                │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

### Invariant Rules
- **Internal Collab Repo (`origin`)**: `https://github.com/Deepak-Sharma-2006/agent1.git`
  - Stores all branches, unit tests, commit history, and the 6-technique Cognitive Dossiers in `docs/dossiers/`.
- **Hackathon Showcase Repo (`jury`)**: `https://github.com/Infinity915/575_final.git`
  - Only audited, production-ready code is pushed here.
  - **Only Beta can publish**: Alpha is blocked from pushing to `575_final`.
  - **Zero Dossiers Leaked**: `docs/dossiers/` is automatically stripped before pushing to `575_final`.
- **Symmetrical 50/50 Equality**: Computer 1 builds 5 phases and audits 5 phases; Computer 2 builds 5 phases and audits 5 phases.

---

## 2.5. Complete Technology Stack & System Design Architecture

### 1. Technology Stack Specification
```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DEALFLOW360 TECH STACK                                  │
├────────────────────┬───────────────────────────────────────────────────────────────────┤
│ Layer              │ Technology & Rationale                                            │
├────────────────────┼───────────────────────────────────────────────────────────────────┤
│ Language & Runtime │ Node.js 22+ / 24+ ES Modules (Pure JavaScript, Zero-Transpile)   │
│ Backend Server     │ Native Node.js `node:http` (Lightweight, zero-dep, zero CVE risk)  │
│ Architectural Core │ Clean Hexagonal / Onion Architecture (Strict Domain Isolation)   │
│ State Machine      │ Event-Driven Deterministic Transition Engine                      │
│ Data Precision     │ Integer Cents Accounting ($1.00 = 100 cents, Zero IEEE-754 Floats)│
│ Persistence (DB)   │ Serverless Local SQL: SQLite + Prisma ORM (`prisma`, `dev.db`)   │
│ In-Memory Fallback │ Atomic Map-based Repositories for zero-latency local testing      │
│ Real-Time Layer    │ WebSockets (`ws` server + browser WebSocket client)               │
│ Client Frontend    │ Vite + React 18/19 SPA (Component architecture, fast HMR)         │
│ Data Visualization │ Chart.js (`chart.js`, `react-chartjs-2`: Margin & Risk Gauges)   │
│ UI Iconography     │ Lucide Icons (`lucide-react`: Enterprise status badges & tools)   │
│ Client Styling     │ Modern CSS Design Tokens + Dark Glassmorphism + Micro-animations  │
│ Offline Engine     │ Service Worker + IndexedDB + Optimistic Concurrency Sync (OCC)    │
│ Security Shield    │ Constant-time comparisons, strict input sanitization, DAST checks │
│ Test Framework     │ Native `node:test` + `node:assert/strict`                         │
│ Pentesting DAST    │ Strix AI Autonomous Pentesting Agent (`strix-agent`)              │
│ Code Audit Engine  │ 5-Layer Beta Auditor + 6-Technique Cognitive Dossier Generator     │
└────────────────────┴───────────────────────────────────────────────────────────────────┘
```

### 2. System Design & Architectural Patterns (Architect's POV)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        HEXAGONAL (PORTS & ADAPTERS) ARCHITECTURE                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│   [PRIMARY ADAPTERS - FRONTEND & REAL-TIME]                                            │
│   • Vite + React 18/19 CPQ Studio (Interactive Quotation Builder)                      │
│   • Chart.js Interactive Canvas (Gross Margin Gauge & Tier Velocity Curve)             │
│   • Customer Negotiation Portal (Live Counter-offers & 1-Click Accept)                 │
│   • Warehouse Scanner UI (Pick/Pack Checklist)                                         │
│   • Native REST API Gateway (`node:http` with 1MB Payload DoS Ceiling)                │
│   • Real-Time WebSocket Gateway (`ws` Multi-Party Negotiation Pub/Sub)                │
│   • Field Sales PWA (Offline Draft Builder + Service Worker)                           │
│                        │                                                               │
│                        ▼ (DTOs / Command Invocations / WebSocket Events)               │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                         APPLICATION SERVICES LAYER                              │   │
│   │  • QuoteAuthoringService   • ApprovalWorkflowEngine   • WarehouseSplitRouter    │   │
│   │  • SubscriptionManager     • AnomalySurveillance      • OfflineSyncResolver     │   │
│   │  • RealTimeBroadcastService (WebSocket Event Egress)                            │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
│                        │                                                               │
│                        ▼ (Invariants, Domain Events, Mathematical Formulas)            │
│   ┌────────────────────────────────────────────────────────────────────────────────┐   │
│   │                           CORE DOMAIN LAYER (PURE JS)                          │   │
│   │  • TierEngine (Dynamic B2B Progression / Degradation)                          │   │
│   │  • IncentiveEngine (Admin Historical Order Log Rules & Manager Discretion)      │   │
│   │  • EscalationEngine (Hard Rep 10%, Mgr 20%, Fin 35% Caps + 18% Margin Floor)    │   │
│   │  • FallbackEngine (Last Approved Best Offer Graceful Reversion)                │   │
│   │  • QuotationCalculator (Integer Cents Subtotals, Line Margins & Risk Score)    │   │
│   └────────────────────────────────────────────────────────────────────────────────┘   │
│                        │                                                               │
│                        ▼ (Repository Ports & Data Persistence)                         │
│   [SECONDARY ADAPTERS - PERSISTENCE & STORAGE]                                         │
│   • SQLite + Prisma ORM Repositories (`file:./prisma/dev.db` Serverless Local SQL)    │
│   • In-Memory MemoryStore Fallback (Fast test execution & zero-setup runtime)          │
│   • IndexedDB Client Storage (`dealflow_catalog`, `dealflow_mutation_queue`)           │
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

#### Key System Design Invariants:
1. **Separation of Concerns (Hexagonal Pattern)**:
   - The domain core has **zero dependencies** on HTTP, databases, or frameworks. Domain logic can be tested deterministically in milliseconds without mocks.
2. **Deterministic Finite State Machine (FSM)**:
   - Quotation transitions follow strict legal B2B paths: `Draft` $\rightarrow$ `PendingApproval` $\rightarrow$ `Approved` $\rightarrow$ `Sent` $\rightarrow$ `UnderNegotiation` $\rightarrow$ `Confirmed` (or `FallbackReverted`). Direct illegal jumps (e.g. `Draft` $\rightarrow$ `Confirmed` when risk score $>0$) are strictly rejected.
3. **Graceful Degradation Circuit Breakers**:
   - The Margin Floor Rule ($\ge 18.0\%$) and absolute 35% discount ceiling act as synchronous circuit breakers. They prevent human error or aggressive rogue negotiation from damaging firm solvency.
4. **Optimistic Concurrency Control (OCC) with ETag Vector Clocks**:
   - Offline mutation queues submit transactions with expected version tags. If concurrent warehouse allocations shifted inventory while the rep was in transit, the server returns an explicit diff rather than silently corrupting inventory records.


---

## 3. Offline Capabilities & Real-World Resilient Scope

In enterprise sales operations and warehouse logistics, field sales reps visit client manufacturing plants and warehouse pickers work in concrete distribution centers where cellular/Wi-Fi dead zones are common. DealFlow360 implements an **Offline-First PWA Architecture**:

### 1. Scope of Offline Features:
- **Field Sales Quoting (Offline Draft Engine)**:
  - Reps can open the Quotation Builder, select products from the locally cached catalog, select customer tiers, adjust quantities, and draft quotes without network access.
  - Local pricing calculations, discount ceilings, and blended risk previews run client-side using cached rule sets.
- **Warehouse Fulfillment Checklist (Offline Scanner Mode)**:
  - Warehouse operators can review picking lists, mark items as picked/packed, and assign serial numbers offline.
- **IndexedDB Client Storage**:
  - `dealflow_catalog`: Cached products, variants, price lists, customer tiers, and discount rules.
  - `dealflow_mutation_queue`: FIFO queue of offline draft quotes, comments, approvals, and packing updates.

### 2. Synchronization & Concurrency Conflict Resolution:
- When network reconnects, the Service Worker automatically initiates background sync.
- **Optimistic Versioning (ETags & Timestamps)**:
  - If a quote or inventory line changed on the server while the rep was offline (e.g., another rep consumed stock in a warehouse), the system **does NOT silently overwrite**.
  - Instead, the server responds with a `409 Conflict: Inventory Shift Detected`, surfaces a diff modal, and allows the rep to accept the re-calculated warehouse split.

---

## 4. The 5 Core Roles (Entities) & Warehouse Fulfillment Involvement

In Section 3 ("User Roles") of the Odoo problem statement, exactly **5 human and system roles (entities)** are defined, paired with the **Warehouse** as the physical execution node.

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                             END-TO-END DATA HANDOVER LIFECYCLE                                   │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                  │
│   [1. ADMIN]                                                                                     │
│     │ (Seeds Products, Pricelists, Tiers, Ceilings, Warehouses)                                  │
│     ▼                                                                                            │
│   [2. SALES REP] ──(Quotes within limits)─────────────────────────────────┐                      │
│     │                                                                     │                      │
│     │ (If Blended Risk > Threshold)                                       │                      │
│     ▼                                                                     │                      │
│   [3. SALES MANAGER] ──(If Medium Risk: Approved)────────────────────────┐│                      │
│     │                                                                    ││                      │
│     │ (If High Risk: Score > 12 or Line > 20%)                           ││                      │
│     ▼                                                                    ││                      │
│   [4. FINANCE / OPS] ───────────────────────────────────────────────────┐││                      │
│     │ (Fiscal Sign-off)                                                 │││                      │
│     ▼                                                                   ▼▼▼                      │
│   [5. CUSTOMER (PORTAL)] ◄─────────────────────────────────────── (View Quotation)               │
│     │                                                                                            │
│     ├───(Counter-discount > limit) ──► Re-routes back to [3. Sales Manager]                      │
│     │                                                                                            │
│     └───(Confirmed / One-Click Accept)                                                           │
│           │                                                                                      │
│           ▼                                                                                      │
│   [6. WAREHOUSE (PHYSICAL FULFILLMENT)]                                                          │
│     │ (Stock Reservation, Split Shipments across Main/East depots, Backorders)                   │
│     ▼                                                                                            │
│   [INVOICING & REVENUE RECOGNITION] (Triggered upon physical carrier dispatch)                   │
│                                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Deep-Dive: What, Why, and How with Data Handover Lifecycle

---

### Entity 1: Admin
- **WHAT IT IS**: The system architect and governance administrator.
- **WHY IT EXISTS**: Defines the operational boundaries (products, customer tiers, approval matrices, warehouse facilities) so sales reps cannot operate in an unconstrained environment.
- **HOW IT OPERATES**:
  - Configures the Product Catalog (Hardware, Services, Subscriptions) and variants.
  - Sets Customer Tier base pricing (`Bronze`, `Silver`, `Gold`).
  - Sets Category Discount Ceilings (`Hardware: 15%`, `Service: 10%`, `Subscription: 20%`).
  - Registers physical Warehouses (`Main Warehouse`, `East Depot`) and stock replenishment rules.
- **DATA LIFECYCLE & HANDOVER**:
  - **Data Inception (Start)**: Administrative configuration forms.
  - **Data Transformation**: Stores system governance rules and product schemas.
  - **Handover (End)**: Hands over active product catalogs and tier pricing to the **Sales Rep**, and hands over approval threshold rules to the **Sales Manager**.

---

### Entity 2: Sales Rep
- **WHAT IT IS**: The front-line quota-carrying seller.
- **WHY IT EXISTS**: Discovers customer requirements, configures deals, applies commercial discounts, and drives revenue.
- **HOW IT OPERATES**:
  - Opens Quotation Builder, selects a customer, and adds line items.
  - Adjusts quantities, reviews real-time gross margin %, and receives live upsell suggestions.
  - Applies commercial discounts. The system calculates the **Blended Discount Risk Score** in real time.
- **DATA LIFECYCLE & HANDOVER**:
  - **Data Inception (Start)**: Ingests customer inquiry or selects existing account.
  - **Data Transformation**: Assembles draft `Quotation` with line items, applied discounts, and net prices.
  - **Handover (End)**:
    - *Path A (Zero Violations)*: If Blended Risk Score = 0 $\rightarrow$ Directly hands over to the **Customer** via secure portal link.
    - *Path B (Discount Threshold Breached)*: If Blended Risk Score > 0 $\rightarrow$ Quote automatically locks into `PendingApproval` and is handed over to the **Sales Manager**'s Approval Queue with rep justification notes.

---

### Entity 3: Sales Manager / Approver
- **WHAT IT IS**: The front-line sales leadership and commercial gatekeeper.
- **WHY IT EXISTS**: Protects margin integrity, prevents unauthorized rogue discounting, and monitors stalled deals before momentum is lost.
- **HOW IT OPERATES**:
  - Reviews pending quotes in the Approval Inbox.
  - Inspects Blended Risk Score, line-level ceiling violations, and gross margin delta.
  - Actions: `Approve`, `Reject`, or `Request Modification` with required audit remarks.
  - Monitors Deal Health Dashboard for deals idle > 7 days or discount anomalies.
- **DATA LIFECYCLE & HANDOVER**:
  - **Data Inception (Start)**: Receives locked quotation from **Sales Rep**.
  - **Data Transformation**: Attaches an immutable `ApprovalLog` record (Approver ID, Timestamp, Decision, Remarks).
  - **Handover (End)**:
    - *Medium Risk Approved*: Hands over approved quotation to the **Customer** (status updates to `Approved` / `Sent`).
    - *High Risk Deal ($\text{RiskScore} > 12$ or single line $> 20\%$)*: Hands over quotation to **Finance / Operations User** for second-level fiscal authorization.
    - *Rejected / Returned*: Hands back to **Sales Rep** with revision instructions.

---

### Entity 4: Finance / Operations User
- **WHAT IT IS**: The fiscal controller and operational fulfillment manager.
- **WHY IT EXISTS**: Guarantees working capital health, approves steep cash-flow impacting discounts, manages inventory split tradeoffs, and reconciles recurring subscription billing.
- **HOW IT OPERATES**:
  - Reviews high-risk quotations escalated from the Sales Manager.
  - Configures and verifies multi-warehouse fulfillment splits (balancing shipping freight costs vs stock availability).
  - Manages subscription contract billing schedules and proration for mid-cycle changes.
- **DATA LIFECYCLE & HANDOVER**:
  - **Data Inception (Start)**: Receives escalated high-risk quotes from **Sales Manager**, OR receives confirmed orders ready for fulfillment routing.
  - **Data Transformation**: Grants final fiscal clearance; reviews auto-split shipment recommendations; provisions billing schedules.
  - **Handover (End)**: Hands over approved quote to **Customer**; on order confirmation, hands over `SplitShipmentOrder` manifests to the **Warehouse**, and hands over billing schedules to the accounting ledger.

---

### Entity 5: Customer (Portal User)
- **WHAT IT IS**: The external B2B buyer participating in a transparent, collaborative negotiation.
- **WHY IT EXISTS**: Replaces chaotic, unversioned email PDF chains with a living, negotiable digital agreement.
- **HOW IT OPERATES**:
  - Accesses quotation via restricted portal link (magic link / authentication).
  - Reviews line items, prices, and terms.
  - Submits line-level comments and counter-discount proposals, or clicks "Confirm Terms".
- **DATA LIFECYCLE & HANDOVER**:
  - **Data Inception (Start)**: Receives digital quotation from **Sales Rep** / **Approvers**.
  - **Data Transformation**: Submits counter-offers or signs off on final quotation.
  - **Handover (End)**:
    - *Counter-offer submitted*: If proposed discount exceeds pre-approved limits $\rightarrow$ Hands back to **Sales Manager** (quote automatically re-enters internal approval workflow).
    - *Quotation Confirmed*: Hands over to **Finance / Operations** and **Warehouse** as a locked `SalesOrder` with timestamped signature.

---

### Entity 6: The Warehouse (Physical Operations & Fulfillment System)
- **WHAT IT IS**: The physical inventory storage and logistics execution facility (e.g., `Main Warehouse`, `East Depot`).
- **WHY IT IS INVOLVED**:
  - Although the Warehouse is not a human sales role, **it is the physical reality anchor** of the entire sales operations platform.
  - A sales order confirmed on paper is worthless if stock is unavailable or fulfillment costs exceed the deal's margin.
- **HOW IT OPERATES**:
  - Holds atomic `InventoryItem` records with `physicalStock`, `reservedStock`, and `availableStock`.
  - Executes the **Auto-Split Routing Algorithm** when an order confirms:
    $$\text{Warehouse Allocation} = \min(\text{LineQuantityRemaining}, \text{WarehouseAvailableStock})$$
  - Dispatches physical shipments with carrier tracking numbers (`FedEx`, `UPS`).
  - Provisions `Backorder` tickets when inventory is depleted across all warehouses.
  - Triggers automated "Consolidate Remaining Backorder" alerts as soon as replenishment stock arrives.
- **DATA LIFECYCLE & HANDOVER**:
  - **Data Inception (Start)**: Receives confirmed `SplitShipmentOrder` manifests from **Finance / Operations**.
  - **Data Transformation**: Decrements physical stock; changes shipment state: `Placed` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`.
  - **Handover (End)**:
    - Hands over delivery confirmation (`Shipped`) to **Accounting/Finance** to legally trigger the **Invoice** (GAAP revenue recognition).
    - Hands over carrier tracking numbers to **Customer** and **Sales Rep**.

---

## 4.5. Advanced Real-World Governance Mechanisms

### 1. Dynamic Customer Tier Progression (Automated Upgradation & Degradation Engine)
In enterprise B2B sales (IT hardware, networking, industrial equipment), account tiers are not static badges; they are living classifications driven by spend velocity, order cadence, and payment discipline.

> **Codebase Mathematical Grounding**: All automated progression, degradation, and escalation thresholds strictly utilize the verified mathematical models and logic already codified in [`src/domain/tier-engine.js`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/src/domain/tier-engine.js) (`TierEngine.evaluateCustomerTier`) and [`src/domain/escalation-engine.js`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/src/domain/escalation-engine.js) (`EscalationEngine.assessEscalation` & `computeBlendedRiskScore`). Zero ad-hoc or conflicting math is introduced.

#### Realistic Tier Metrics, Cadence & Progression Thresholds:
1. **Bronze (Baseline / Spot Accounts)**:
   - Spend Baseline: $< \$25,000$ trailing 90-day spend ($0 - \$24,999$).
   - Default Terms: **Net 0** (Pre-payment / Credit Card required).
   - Standard Discretionary Ceiling: **5%**. Margin floor $\ge 25\%$.
   - Assigned Commercial Desk: **Level 1 — Sales Representative Desk** (Sarah Jenkins).
2. **Silver (Growth / Regular Accounts)**:
   - *Upgrade Qualification*: Trailing 90-Day spend $\ge \$25,000$ (2,500,000 cents) OR $\ge 6$ orders in trailing 90 days with aggregate spend $\ge \$15,000$.
   - Credit Requirement: Average Days Sales Outstanding (DSO) $\le 30$ days, zero invoices $> 15$ days overdue.
   - Benefits: Payment Terms **Net 15**, default discount up to **8%**. Margin floor $\ge 22\%$.
   - Assigned Commercial Desk: **Level 1 — Sales Representative Desk** with 1-click **"Escalate to Sales Manager"** action for concessions $>8\%$.
   - *Degradation Trigger*: Inactivity ($0$ orders in $> 90$ days), or trailing 90-day spend drops below $\$10,000$, or invoice overdue $> 30$ days $\rightarrow$ Demoted to Bronze.
3. **Gold (Consistent High-Value Enterprise Accounts)**:
   - *Upgrade Qualification*: Trailing 180-Day spend $\ge \$100,000$ (10,000,000 cents) OR high cadence ($\ge 12$ orders in trailing 90 days, e.g. weekly/bi-weekly replenishment) with aggregate spend $\ge \$60,000$.
   - Credit Requirement: Flawless credit health: DSO $\le 25$ days, zero overdue invoices $> 15$ days, lifetime payment default rate $0\%$.
   - Benefits: Payment Terms **Net 30**, default discount up to **14%**, priority warehouse dispatch buffer. Margin floor $\ge 18\%$.
   - Assigned Commercial Desk: **Level 2 — Sales Manager Executive Lead** (Marcus Vance) directly connected.
   - *Degradation Trigger*: Dormancy ($0$ orders in $> 60$ days), or trailing 90-day spend drops below $\$35,000$, or any payment overdue $> 30$ days $\rightarrow$ Demoted to Silver.
4. **Platinum (Strategic / Enterprise VIP Partner)**:
   - *Upgrade Qualification*: Trailing 365-Day spend $\ge \$350,000$ (35,000,000 cents) AND consistent enterprise ordering ($\ge 1$ order every 30 days average, $\ge 12$ orders/year).
   - Credit Requirement: DSO $\le 20$ days, zero 30+ day payment defaults in trailing 24 months.
   - Benefits: Payment Terms **Net 45/60**, default discount up to **20%**, dedicated account manager SLA, zero warehouse handling fees. Margin floor $\ge 18\%$.
   - Assigned Commercial Desk: **Level 3 — Sales Leadership & Finance Controller Joint Desk** directly connected.
   - *Degradation Trigger*: Severe cadence drop ($0$ orders in $> 90$ days) or trailing 180-day spend drops below $\$75,000$ $\rightarrow$ Demoted to Gold. Critical delinquency (unpaid invoice overdue $> 45$ days) immediately demotes account to Silver, locks credit lines, and suspends Net terms.

#### Real-World Business Timelines & Aging Delinquency Cliffs:
- **0 - 15 Days Past Due**: Standard operational grace period. Account remains in current tier.
- **16 - 30 Days Past Due**: Soft warning state. Discretionary discount ceiling reduced by 2%.
- **31 - 45 Days Past Due**: Dormancy/Delinquency threshold. Silver accounts demoted to Bronze.
- **> 45 Days Past Due (Critical Cliff)**: Breaches commercial credit insurance covenants and working capital limits. Triggers **immediate automated demotion** (Gold/Silver $\rightarrow$ Bronze, Platinum $\rightarrow$ Silver with credit freeze). Payment terms locked to Net 0 Prepayment.
- **Credit Curing Timeline**: When delinquent balances are settled in full and DSO drops back $\le 25$ days, the system allows an automated Credit Cure re-evaluation.

#### Automated Lifecycle Triggers (Zero Manual Overhead):
1. **Trigger A: Instant Order Confirmation Progression (`confirmFinalQuotation`)**:
   - Customer signs digital quotation $\rightarrow$ Net total added to customer trailing spend metrics.
   - Order cadence incremented; dormancy reset (`daysSinceLastOrder = 0`).
   - `TierEngine.evaluateCustomerTier(customer)` runs automatically.
   - If promoted: SQLite updated, WebSocket `CUSTOMER_TIER_UPDATED` emitted, and automated promotion announcement card injected into deal feed.
2. **Trigger B: Real-Time Delinquency Degradation (`auditCustomerDelinquency`)**:
   - Open invoice aging exceeds 45 days overdue or default recorded.
   - `TierEngine` demotes tier, forces `paymentTerms = 'Net0'`.
   - Relegates deal from Executive Desk back to Junior Rep Collections Desk, displaying a prominent red delinquency warning.
3. **Trigger C: Automated Batch Governance (`POST /api/governance/tier-audit`)**:
   - Simulates enterprise nightly/monthly reconciliation cron, scanning all active accounts against rolling spend and aging metrics.

#### Dynamic Negotiation Desk Routing in the Deal Room:
- **Bronze & Silver Accounts**: Routed to **Sales Representative Desk (Sarah Jenkins)**. Rep discretionary ceiling: 5% (Bronze), 8% (Silver). Concessions exceeding ceiling trigger in-feed **"Escalate to Sales Manager"** action.
- **Gold Accounts**: Routed directly to **Sales Manager Executive Lead (Marcus Vance)**.
- **Platinum Accounts**: Routed directly to **Sales Leadership & Finance Controller Joint Desk**.
- **Degraded Accounts**: Executive privileges instantly revoked; re-routed to Junior Rep Collections Desk; terms locked to Net 0 Prepayment.

---

### 2. Admin Condition-Based Historical Incentive & Rebate Engine
- **Admin Configuration Power**:
  - Admin can define rules requiring verifiable historical customer logs:
    - *Volume Spike Incentive*: If current order volume $> 2\times$ the customer's 6-month historical average, unlock an additional 3% volume rebate.
    - *Milestone Loyalty Bonus*: If customer has completed 10+ paid orders with zero default, grant a $1,000 credit on onboarding services.
    - *Bundled Care Incentive*: Hardware purchase + 2-year SLA subscription unlocks an instant 5% hardware discount.
- **Negotiation & Escalation Protocol**:
  - Sales Rep selects or requests eligible incentives in the Quotation Builder based on system-validated customer order history.
  - If the customer counters for a higher incentive than standard rules allow, the **Sales Manager** reviews customer order logs and can negotiate/approve within their discretion.
  - If the order size is exceptionally large AND the customer has an impeccable payment and order history, the Sales Manager escalates to **Finance** for bespoke incentive/rebate authorization.

---

### 3. Graceful Fallback Strategy: The "Last Approved Best Offer"
- **The Problem**: In naive CPQ systems, when Finance or the Sales Manager rejects an aggressive counter-offer (e.g., customer asks for 25% discount, Finance rejects it), the quotation moves to `Cancelled` or `Rejected`, resulting in an awkward dead-end and customer churn.
- **The DealFlow360 Solution**:
  - When an escalated discount or bespoke incentive is rejected at a higher tier (e.g., Finance), the quotation does **NOT** terminate.
  - The system automatically creates a **Graceful Fallback State**:
    - The quotation cleanly reverts to the **"Last Approved Best Offer"** (e.g. the 15% discount previously authorized by the Sales Manager).
    - The Customer Portal updates with transparent messaging:
      > *"Finance was unable to approve the requested 25% counter-discount due to margin floors. However, your previously authorized 15% discount offer remains fully valid and locked for immediate 1-click confirmation."*
  - **Why this is an elite commercial move**: It eliminates "take-it-or-leave-it" friction, respects management's margin boundaries, and allows the customer to save face and close the deal on pre-approved terms without starting from scratch.

---

### 4. Hard Discretionary Negotiation Caps per Escalation Tier
Aside from the multi-factor Blended Risk Score, each role operates under strict, non-negotiable hard negotiation limits to prevent negotiation creep:

```
┌─────────────────┬───────────────────────┬─────────────────────────┬───────────────────────────────┐
│ Escalation Tier │ Max Discretionary Off │ Max Incentive Discretion│ Mandatory Escalation Trigger  │
├─────────────────┼───────────────────────┼─────────────────────────┼───────────────────────────────┤
│ 1. Sales Rep    │ Max 10% (Gold)        │ $0 (Standard offers)    │ Any line > ceiling or Score>0 │
│ 2. Sales Manager│ Max 20%               │ Up to $5,000 rebate     │ Discount > 20% or Rebate>$5k  │
│ 3. Finance User │ Max 35%               │ Bespoke Custom Rebate   │ Margin Floor < 18% or Disc>35%│
└─────────────────┴───────────────────────┴─────────────────────────┴───────────────────────────────┘
```
- **Sales Rep**: Cannot exceed customer tier ceilings (Bronze 5%, Silver 10%, Gold 15%). Hard absolute limit: 10%. Cannot authorize custom monetary incentives.
- **Sales Manager**: Can authorize discretionary discounts up to **20%** and incentives up to **$5,000** with documented business justification. Above 20% or $5,000, UI forces escalation to Finance.
- **Finance User / Operations**: Highest commercial escalation authority. Can authorize discounts up to **35%** provided net deal gross profit margin remains strictly $\ge 18\%$ (Margin Floor Rule). Any request exceeding 35% discount or violating the 18% margin floor is hard-blocked by the system (Executive VP role removed; Finance represents apex fiscal governance).

---

### Entity 3: Customer & CustomerPriceList
- **WHAT IT IS**: The purchasing enterprise entity with assigned `Tier` (`Bronze`, `Silver`, `Gold`), credit limit, payment terms (`Net30`, `Net60`, `DueOnReceipt`), and currency.
- **WHY IT EXISTS**: B2B sales pricing is never flat. A Gold tier partner with $10M annual spend receives preferred base pricing and higher discount discretion than a first-time Bronze buyer.
- **HOW IT WORKS**:
  - Linked to a `PriceList` rule table. When a product is added to a quote, base price is looked up: `FinalBasePrice = StandardListPrice * (1 - TierDefaultDiscount)`.

---

### Entity 4: Product & ProductVariant
- **WHAT IT IS**: Catalog items classified into three foundational categories:
  1. `Hardware` (Physical stock requiring warehouse shipment, e.g., Server Rack, Laptop Pro 14).
  2. `Service` (Onsite implementation, hourly engineering consulting, one-time setup).
  3. `Subscription` (Recurring SaaS seat license, 24/7 SLA maintenance plan).
- **WHY IT EXISTS**: Mixing physical goods, human labor, and recurring software subscriptions on a single order is the #1 pain point of traditional ERPs.
- **HOW IT WORKS**:
  - Variants store dimensional attributes (`RAM: 32GB`, `Color: Space Gray`) with price offsets.
  - Subscriptions specify billing frequency (`Monthly`, `Quarterly`, `Annual`) and contract commitment terms.

---

### Entity 5: Quotation & QuotationLine
- **WHAT IT IS**: The living CPQ transaction document containing customer context, line items, net prices, taxes, gross margin, and state lifecycle:
  `Draft` $\rightarrow$ `PendingApproval` $\rightarrow$ `Approved` $\rightarrow$ `Sent` $\rightarrow$ `UnderNegotiation` $\rightarrow$ `Confirmed` $\rightarrow$ `Rejected`.
- **WHY IT EXISTS**: Acts as the central agreement between sales rep, financial approvers, fulfillment operations, and the customer.
- **HOW IT WORKS**:
  - Line items compute cost of goods sold (COGS) to calculate real-time gross margin:
    $$\text{Margin } \% = \frac{\text{NetRevenue} - \text{TotalCost}}{\text{NetRevenue}} \times 100$$
  - Real-time margin updates immediately as discounts are adjusted.

---

### Entity 6: DiscountGovernanceRule & BlendedRiskScore
- **WHAT IT IS**: The automated pricing compliance engine. It defines:
  - Customer tier ceilings (`Bronze: 5%`, `Silver: 10%`, `Gold: 15%`).
  - Product category ceilings (`Hardware: 15%`, `Service: 10%`, `Subscription: 20%`).
- **WHY IT EXISTS**: Reps can quietly bleed enterprise margins by discounting high-cost services where margins are razor-thin, even if total order discount looks modest.
- **HOW IT WORKS**:
  - Evaluates individual line violations and cumulative multi-line discount pattern:
    $$R_{\text{line}} = \max(0, \text{Discount}_{\text{given}} - \text{Discount}_{\text{ceiling}})$$
    $$\text{BlendedScore} = \sum_{\text{lines}} \left( R_{\text{line}} \times \frac{\text{LineNetPrice}}{\text{OrderTotal}} \times \text{CategoryMultiplier} \right)$$
  - Routing Thresholds:
    - $\text{BlendedScore} = 0$: Auto-approved.
    - $0 < \text{BlendedScore} \le 12$: Routed to **Sales Manager**.
    - $\text{BlendedScore} > 12$ or any single line $> 20\%$: Routed to **Sales Manager $\rightarrow$ Finance**.

---

### Entity 7: SplitShipmentOrder (Fulfillment Splits)
- **WHAT IT IS**: The fulfillment manifest splitting a confirmed order into discrete warehouse shipments.
- **WHY IT EXISTS**: A single customer order of 50 laptops and 10 servers may require 30 laptops from Chicago (`WH-01`), 20 laptops from Dallas (`WH-05`), and 10 servers from Reno (`WH-03`).
- **HOW IT WORKS**:
  - Each split creates a `ShipmentOrder` with its own tracking number, packing slip, and carrier (`FedEx`, `UPS Freight`).
  - If a warehouse has 0 stock, creates a `BackorderTicket` linked to replenishment schedules. When stock arrives, system triggers "Consolidate Remaining Backorders".

---

### Entity 8: SubscriptionContract & BillingSchedule
- **WHAT IT IS**: The recurring revenue contract generated from subscription lines upon order confirmation.
- **WHY IT EXISTS**: Physical goods invoice once; subscriptions invoice repeatedly across monthly/annual billing schedules with proration rules.
- **HOW IT WORKS**:
  - Generates future billing milestones (`NextBillingDate: 2026-10-01`).
  - Mid-cycle proration calculator handles upgrades/downgrades:
    $$\text{ProratedCredit} = \text{OldPrice} \times \frac{\text{DaysRemaining}}{\text{TotalDaysInCycle}}$$
    $$\text{ProratedCharge} = \text{NewPrice} \times \frac{\text{DaysRemaining}}{\text{TotalDaysInCycle}}$$

---

### Entity 9: Invoice & PaymentReconciliation
- **WHAT IT IS**: Accounting billing records generated strictly according to shipping fulfillment rules.
- **WHY IT EXISTS**: Regulatory and GAAP compliance forbids invoicing for physical hardware before it has shipped.
- **HOW IT WORKS**:
  - Reconciles partially shipped orders: only delivered hardware lines are converted to an active invoice.
  - Subscription lines generate their initial invoice immediately upon contract activation.
  - Recording payment updates invoice status to `Paid` and updates customer credit ledger.

---

### Entity 10: CustomerNegotiationThread & AuditTrail
- **WHAT IT IS**: The record of external buyer interactions in the customer portal, including line-level comments, requested counter-discounts, and managerial approvals/rejections.
- **WHY IT EXISTS**: Replaces chaotic email chains with a legally grounded, auditable negotiation timeline.
- **HOW IT WORKS**:
  - When customer requests a counter-discount:
    - If counter-discount is within pre-approved thresholds: Quote updates to `Agreed`.
    - If counter-discount exceeds thresholds: Quote auto-reverts to `PendingApproval` with high-priority notification to Sales Manager.

---

## 5. Synthesis of the 18 Excalidraw Wireframe Screens

| Screen # | Name / Wireframe Title | Primary Functional Components & Governance Rules |
| :---: | :--- | :--- |
| **1** | **Main Executive Dashboard** | KPI widgets (`$480k` Open Quotes, `12` Approvals, `94%` Fulfillment, `$42k` MRR), Deal Pipeline stage bar (`Draft` $\rightarrow$ `Approval` $\rightarrow$ `Sent` $\rightarrow$ `Won`), Quick Approvals widget, Recent Quotes table. |
| **2** | **Quotation List** | Search & multi-status filtering (`Draft`, `Pending Approval`, `Approved`, `Converted`), status metric badges, date range filters, direct navigation to Quote Builder. |
| **3** | **Quotation Builder (Core CPQ)** | Customer context (Tier, Payment Terms, Expiry), Line Items table (Hardware, Services, Subscriptions), List price, discount %, net price, tax, total. Dynamic approval alert banner when tier ceilings are breached. |
| **4** | **Approval Inbox / Queue** | Escalation manager inbox, Risk Level badges (`Medium Risk` Yellow, `High Risk` Red), filter by rep, customer, discount %. |
| **5** | **Approval Detail & Governance** | Decision view with quote summary, sales rep justification notes, gross margin impact analysis, category ceiling breakdown, full audit trail, `Approve`, `Reject`, `Request Modification`. |
| **6** | **Fulfillment Queue** | Order conversion from approved quotes, status tabs (`Ready`, `Partially Fulfilled`, `Completed`, `Backordered`). |
| **7** | **Fulfillment Detail & Tracking** | Visual delivery stepper (`Placed` $\rightarrow$ `Processing` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered`), item checklist with serial numbers, carrier tracking numbers across 5+ warehouses, packing slip generator. |
| **8** | **Subscriptions Overview** | SLA & subscription contract table, status metrics (`18 Active`, `2 Paused`, `3 Cancelled`), MRR totals. |
| **9** | **Subscription Detail** | Active recurring lines, plan frequency (Monthly/Annual), mid-cycle proration calculator, pause/cancel controls. |
| **10** | **Billing Detail & Invoice Trigger** | Dual-section breakdown separating one-time hardware lines from recurring subscription lines, invoice generation triggers. |
| **11** | **Customer Negotiation Portal** | Secure, restricted external view (`Under Negotiation` status), line-level customer comments, counter-discount inputs, one-click accept. Re-triggers manager approval if counter-offer exceeds limits. |
| **12** | **Invoices List** | Invoices table, status badges (`4 Unpaid` Red, `21 Paid` Green), payment due dates. |
| **13** | **Invoice Detail & Reconciliation**| Lifecycle process bar (`Confirmed` $\rightarrow$ `Shipped` $\rightarrow$ `Invoiced` $\rightarrow$ `Paid`), partial delivery reconciliation (nothing billed before shipping), `Record Payment`. |
| **14** | **Deal Health & Anomaly Dashboard**| Stalled deals (>7 days idle), rep discount anomalies vs historical average, delivery promise slippage indicators, one-click `Escalate` & `Nudge Rep`. |
| **15** | **Admin Reporting Dashboard** | Multi-filter performance reporting (Period, Sales Rep, Approval Status, Product Category), average approval latency, PDF & XLS export. |
| **16** | **Product Catalog Dashboard** | Active & archived product table, category filters, variants count, price list rules. |
| **17** | **Product Details & Pricelists** | General info, variant attributes (RAM, Color, Size) with price deltas, customer tier price rules (Bronze, Silver, Gold), subscription toggle. |
| **18** | **Discount Tiers & Approval Chains**| Configuration of customer tier discount ceilings (Bronze 5%, Silver 10%, Gold 15%), category ceilings (Hardware 15%, Services 10%), approval routing matrix. |

---

## 6. The Real-Life Senior Engineer 10-Phase Roadmap (Updated Tech Stack)

```
┌────────┬────────────────────────────────────────────────────────────┬─────────────┬─────────────┬────────────────┐
│ Phase  │ Real-World Engineering Objective                           │ Alpha Build │ Beta Audit  │ Hackathon Push │
├────────┼────────────────────────────────────────────────────────────┼─────────────┼─────────────┼────────────────┤
│ Phase 1│ Domain Entities, Business Invariants & Precision Math (JS) │ Computer 1  │ Computer 2  │ 575_final v1.0 │
│ Phase 2│ REST API, Real-Time Pricing Gateway & OCC State Machine    │ Computer 2  │ Computer 1  │ 575_final v1.1 │
│ Phase 3│ Serverless Local SQL: SQLite + Prisma ORM Repositories     │ Computer 1  │ Computer 2  │ 575_final v1.2 │
│ Phase 4│ Real-Time Collaboration: WebSocket Gateway (`ws`) Pub/Sub   │ Computer 2  │ Computer 1  │ 575_final v1.3 │
│ Phase 5│ Frontend Shell: Vite + React 18/19 SPA & Lucide Icons     │ Computer 1  │ Computer 2  │ 575_final v1.4 │
│ Phase 6│ CPQ Quotation Studio & Chart.js Real-Time Margin Gauges    │ Computer 2  │ Computer 1  │ 575_final v1.5 │
│ Phase 7│ Customer Negotiation Portal & Fallback Reversion UI       │ Computer 1  │ Computer 2  │ 575_final v1.6 │
│ Phase 8│ Multi-Warehouse Splitting (5+ Warehouses Allocation Engine)│ Computer 2  │ Computer 1  │ 575_final v1.7 │
│ Phase 9│ Offline-First PWA Sync (Service Worker + IndexedDB + OCC)  │ Computer 1  │ Computer 2  │ 575_final v1.8 │
│ Phase10│ Strix Dynamic AI DAST Pentest & Production Release Polish │ Computer 2  │ Computer 1  │ 575_final v2.0 │
└────────┴────────────────────────────────────────────────────────────┴─────────────┴─────────────┴────────────────┘
```

### Detailed Breakdown of the 10 Phases:

1. **Phase 1 (Completed)**: *Domain Entities, Business Invariants & Precision Math Engine*
   - **Stack**: Pure Native JavaScript ES Modules, zero external runtime dependencies.
   - **Deliverables**: `QuotationCalculator` (integer cents accounting), `TierEngine` (dynamic B2B customer tier progression/degradation), `IncentiveEngine` (Admin historical order rules), `EscalationEngine` (three-tier approval caps: Rep 10%, Mgr 20%, Fin 35%, and mandatory 18% gross margin floor), and `FallbackEngine` (Last Approved Best Offer reversion).
   - **Verification**: 27/27 unit tests pass, 4/4 behavioral harness contracts pass. Single comprehensive dossier: `docs/dossiers/phase-1-entities.md`.

2. **Phase 2 (Completed)**: *Native REST API, OCC Concurrency & Real-Time Pricing Gateway*
   - **Stack**: Native Node.js `node:http`, pure JavaScript ES Modules.
   - **Deliverables**: Zero-dependency REST API router with 1MB payload DoS shield, Optimistic Concurrency Control (OCC) with integer versioning and HTTP `If-Match`, `PricingGateway` (read-only real-time margin & blended risk calculator with high-margin upsell recommender), and `QuotationService` (full state machine lifecycle: Draft -> PendingApproval -> Approved -> Confirmed / Fallback).
   - **Verification**: 37/37 contract tests pass (total 64/64 tests pass). Phase 2 dossier: `docs/dossiers/phase-2-api.md`.

3. **Phase 3 (Next)**: *Persistence Layer — Serverless Local SQL with SQLite + Prisma ORM*
   - **Stack**: `prisma`, `@prisma/client`, SQLite (`file:./prisma/dev.db`), and in-memory repository fallback.
   - **Deliverables**: Relational database schemas for Customer, Product, Variant, PriceRule, Warehouse, StockInventory, Quotation, QuotationLine, and VersionedApprovalSnapshot. Prisma client repository adapters implementing secondary ports for `QuotationService` and `PricingGateway` with ACID transaction integrity.
   - **Verification**: Database migration tests, relational cascade tests, and zero data corruption during concurrent writes.

4. **Phase 4**: *Real-Time Collaboration — WebSocket Gateway (`ws`) Pub/Sub Engine*
   - **Stack**: Native Node.js RFC 6455 WebSocket engine mounted on the existing `node:http` server port (`/ws`).
   - **Deliverables**:
     - Role-guarded topic pub/sub engine (`quotation:{id}`, `role:manager`, `role:finance`, `customer:{id}`) preventing cross-tenant trade secret leakage.
     - Real-time quotation lifecycle event broadcasting (`QUOTE_LINE_MUTATED`, `APPROVAL_REQUIRED`, `COUNTER_OFFER_RECEIVED`, `APPROVAL_GRANTED`, `FALLBACK_REVERTED`, `QUOTE_CONFIRMED`).
     - Split-brain negotiation defenses: editing presence hints (`PRESENCE_EDITING`) and real-time OCC diff broadcasts to prevent blind 409 collisions.
     - Dual-path escalation dispatch: live WebSocket alerts paired with SQLite persistence for offline/in-transit managers (`SYNC_ON_CONNECT`).
     - Legally binding negotiation chat audit trail persisted atomically to SQLite `negotiation_messages` table before egress.
     - Automatic field sales reconnection with exponential backoff and version catch-up synchronization (`lastKnownVersion`).
   - **Verification**: Multi-client WebSocket concurrency tests, role boundary security tests, reconnection state catch-up tests, and clean Strix AI DAST pentest.

5. **Phase 5**: *Frontend UI Foundation — Vite + React 18/19 SPA & Lucide Icons*
   - **Stack**: Vite, React 18/19, Lucide Icons (`lucide-react`), Modern CSS Design System.
   - **Deliverables**: Lightning-fast SPA shell with role-based routing (Admin, Sales Rep, Sales Manager, Finance Controller, Customer, Warehouse Picker), dark glassmorphism design tokens (`backdrop-filter`), responsive layout shell, and enterprise Lucide iconography for status badges and actions.
   - **Verification**: Vite dev server instant HMR (<50ms), bundle size audit, and accessibility compliance.

6. **Phase 6**: *Interactive CPQ Quotation Studio & Chart.js Real-Time Visualizations*
   - **Stack**: React 18/19, `chart.js`, `react-chartjs-2`, Lucide Icons.
   - **Deliverables**: Dynamic Quotation Builder with real-time integer-cents calculation as reps type. Interactive Chart.js widgets:
     - **Speedometer Gross Margin Gauge**: Visual indicator showing current deal margin against the 18.0% red-line floor and 25.0% target.
     - **Dynamic Tier Spend Curve**: Visual historical spend velocity chart explaining customer tier badges.
     - **Blended Risk Radar**: Multi-axis radar chart showing line-item delivery risk and margin distribution.
   - **Verification**: Sub-millisecond keystroke recalculation, chart rendering performance, and margin floor visual alerts.

7. **Phase 7**: *Customer Negotiation Portal & Fallback Reversion UI*
   - **Stack**: React 18/19, WebSockets, Lucide Icons.
   - **Deliverables**: Secure customer-facing portal view (`/portal/:quoteId?token=...`). Counter-discount request sliders, line-by-line commercial chat, one-click binding acceptance, and real-time visual demonstration of the Graceful Fallback rollback when an aggressive counter-offer is rejected by Finance.
   - **Verification**: Live negotiation simulation between sales rep and buyer tabs with instant WebSocket synchronization.

8. **Phase 8**: *Multi-Warehouse Splitting (5+ Warehouses Allocation Engine)*
   - **Stack**: Pure JS domain algorithms + React interactive fulfillment board.
   - **Deliverables**: Greedy $O(W \cdot K)$ warehouse routing algorithm optimizing stock allocation across 5+ regional depots (Main, East, West, Central, Express Depot). Stock reservation, split shipment generation, backorder handling, and warehouse picker checklist UI.
   - **Verification**: Multi-warehouse allocation tests, partial shipment tracking, and delivery date estimation logic.

9. **Phase 9**: *Offline-First PWA Synchronization (Service Worker + IndexedDB + OCC)*
   - **Stack**: Native Web Service Worker, IndexedDB (`dealflow_catalog`, `dealflow_mutation_queue`), Cache API.
   - **Deliverables**: Complete offline quoting in cellular dead zones. Local catalog lookup, local pricing calculation, offline draft creation, background mutation queue, and optimistic concurrency conflict reconciliation (diff modal on `409 Conflict`).
   - **Verification**: Offline network simulation tests, background sync trigger, and zero lost updates during reconnect.

10. **Phase 10**: *Full Red-Team Strix DAST Pentest, Performance Polish & Jury Release*
    - **Stack**: Strix AI Autonomous Pentesting Agent (`strix-agent`), Docker.
    - **Deliverables**: Automated dynamic penetration testing against live container, zero verified exploits, Docker containerization (`Dockerfile`, `docker-compose.yml`), complete jury demonstration walkthrough, and final audited release push to `Infinity915/575_final`.
    - **Verification**: 5/5 Beta audit layers pass, clean Strix security scorecard, and verified deployment on jury workstation.

---

## 7. The Claude Council: 5-Persona Adversarial Audit & Consensus Review

Following the mandate of `.agents/skills/claude-council/SKILL.md`, the five adversarial advisors conducted an independent, blind audit of this blueprint:

### 1. The Contrarian (`01-contrarian`)
> **Critique**: *"Floating-point math and unconstrained negotiation will bleed margins. If a customer requests a 25% discount and Finance rejects it, a dead-end cancellation causes churn. Furthermore, sales reps will attempt to circumvent approval chains if you lack hard caps on their discretionary authority."*
> **Enforced Fix**:
> - Replaced floats with integer cents across all schemas.
> - Implemented **Graceful Fallback**: Rejection at a higher tier immediately falls back to the **"Last Approved Best Offer"**, keeping the deal alive.
> - Codified **Hard Discretionary Negotiation Caps**: Rep max 10%, Manager max 20%, Finance max 35%.

### 2. The First-Principles Engineer (`02-first-principles`)
> **Critique**: *"Customer tiering cannot be a static attribute assigned manually by an admin. In real-world enterprise sales, customer value shifts dynamically based on order frequency, consistency, and volume. Moreover, the 5+ warehouse split cannot be an exponential $O(2^N)$ knapsack problem."*
> **Enforced Fix**:
> - Designed the **Dynamic Customer Tier Progression Engine**: Upgrades/degrades accounts (`Bronze` $\leftrightarrow$ `Silver` $\leftrightarrow$ `Gold` $\leftrightarrow$ `Platinum`) based on LTV, ordering frequency (daily/weekly), and payment consistency.
> - Upgraded escalation sensitivity: Degraded accounts trigger manager approval even on small discounts, while Gold accounts enjoy wider discretionary bands.
> - Defined explicit $O(W \cdot K)$ greedy allocation heuristic for multi-warehouse splitting.

### 3. The Expansionist (`03-expansionist`)
> **Critique**: *"Standard discounting is boring. Modern enterprise B2B relies on condition-based incentives and volume rebates tied to historical spend logs. Without admin-configured incentive rules and multi-currency support, the system cannot compete."*
> **Enforced Fix**:
> - Created **Admin Condition-Based Incentive Engine**: Admin defines rules based on historical order logs (e.g. 2x volume spikes, milestone loyalty bonuses, bundled care rebates).
> - Manager negotiates incentives based on logs; high-volume orders escalate to **Finance** for bespoke incentive packages.

### 4. The Naive Outsider (`04-outsider`)
> **Critique**: *"Jargon like 'Blended Risk Score' and 'Escalation Chain' confuses judges if the user journey is not crystal clear. When a customer negotiates in the portal, who sees what?"*
> **Enforced Fix**:
> - Authored Section 4 detailing the exact **What, Why, and How** and the end-to-end data handover lifecycle across all 5 PDF user roles + Warehouse.

### 5. The Pragmatic Executor (`05-executor`)
> **Critique**: *"Show me the exact test commands and deployment scripts. If we cannot verify zero ghost packages, enforce strict TypeScript, and prevent internal dossiers from leaking to 575_final with one command, the plan is unexecutable."*
> **Enforced Fix**:
> - Codified all 7 verification commands in `package.json`, automated in `scripts/beta-audit-runner.ts`, and enforced via `scripts/jury-sync.ts`.

---

### 🏛️ Chairman Consensus Synthesis
- **VERDICT**: **`APPROVED WITH MANDATED SAFEGUARDS (5/5 PASS)`**
- **Top 4 Fatal Risks Identified & Mitigated**:
  1. *Deal abandonment on higher-tier rejection* $\rightarrow$ **Mitigated**: Graceful Fallback to Last Approved Best Offer.
  2. *Uncontrolled negotiation creep* $\rightarrow$ **Mitigated**: Strict Hard Discretionary Caps per role.
  3. *Unfair tier stagnation* $\rightarrow$ **Mitigated**: Dynamic Tier Upgradation/Degradation based on frequency and LTV.
  4. *Internal cognitive dossiers leaking to hackathon jury repo* $\rightarrow$ **Mitigated**: Automated exclusion in `scripts/jury-sync.ts`.
- **Immediate Next Step**: Launch **Phase 1: Domain Entities, Database Schema & Migrations** on Computer 1 (Alpha).

---

## 8. Verification Plan & Execution Commands

```powershell
# 1. Anti-Hallucination Shield (Zero Ghost Dependencies)
npm run check:hallucinations

# 2. Strict TypeScript Compilation (0 errors)
npx tsc --noEmit

# 3. Native Unit Test Suite
npm run test:unit

# 4. Behavioral Contract Harness (4/4 Evals)
npm run harness:eval

# 5. Strix AI Red-Team DAST Pentest
npm run pentest

# 6. Complete 5-Layer Beta Audit (Mandatory before publishing)
npm run audit:beta

# 7. Publish to Hackathon Showcase (Only Beta, Dossiers automatically stripped)
npm run jury:publish -- <TAG>
```
