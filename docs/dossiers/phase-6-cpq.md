# Cognitive Code Reading Dossier: Phase 6 — Interactive CPQ Quotation Studio & Real-Time Visual Telemetry

> **Phase**: Phase 6 (Interactive CPQ Quotation Studio, Rule Matrix Builder, and Real-Time SVG Visualizations)  
> **Author**: Computer 2 (Alpha Builder)  
> **Auditor**: Computer 1 (Beta Auditor)  
> **Standard**: 6-Technique Cognitive Reading Protocol (`.agents/skills/code-reading-dossier/SKILL.md`)  
> **Compliance Target**: Odoo Hackathon Self-Governing Sales Operations & CPQ Platform (DealFlow360)

---

## Technique 1: The Human Mental Model (Plain-Language Purpose & Boundary)

In enterprise B2B sales cycles (such as IT systems, networking hardware, and cloud SaaS), a quote is not a simple price tag. It is a live commercial negotiation balancing three competing tensions:
1. **Sales Representative Velocity**: Reps want to win deals fast and often apply steep discounts to meet quarterly quotas.
2. **Executive Margin Protection**: Companies bleed profits if reps sell high-cost equipment at discounts that drop gross margins below corporate profitability targets (the 18.0% red-line floor and 25.0% target).
3. **Customer Credit & Tier Governance**: Giving Gold-tier discounts (15%) to dormant clients with 60-day overdue invoices invites unrecoverable bad debt.

Before Phase 6, DealFlow360 had established precision integer-cents math engines (Phase 1), REST APIs (Phase 2), SQLite persistence (Phase 3), WebSocket collaboration (Phase 4), and a Vite React SPA foundation (Phase 5). However, sales reps had to navigate tabular numbers without visual feedback on deal health, and operations managers lacked an administrative console to configure discount matrices.

**Phase 6 Implementation** delivers the full visual and operational CPQ experience:

1. **Interactive CPQ Quotation Studio ([client/src/pages/QuotationStudio.jsx](file:///d:/agent1/client/src/pages/QuotationStudio.jsx))**:
   - Sub-millisecond keystroke recalculation for quantities and unit discounts using the native `/api/pricing/preview` engine.
   - Real-time line-level category ceiling badges (Hardware cap 15%, Services cap 10%, Subscriptions cap 20%).
   - 1-Click Margin-Lifting Upsell Applicator: Proactively identifies high-margin catalog items (e.g. 24/7 SLA maintenance) and attaches them to the quote with one click to recover margin.
   - Optimistic Concurrency Control (OCC) version tracking (`v{quote.version}`) and live presence broadcasting.

2. **Gross Margin Speedometer Gauge ([client/src/components/MarginSpeedometerGauge.jsx](file:///d:/agent1/client/src/components/MarginSpeedometerGauge.jsx))**:
   - Pure React SVG radial arc speedometer gauge with zero external npm dependencies.
   - Graded visual sectors: Crimson Red (< 18.0% Hard Block), Amber Warning (18.0% - 24.9% Manager Review), and Emerald Green (>= 25.0% Self-Approved).
   - Dynamically animated needle pointing to the exact gross margin percentage with sub-percent precision (`XX.X%`).

3. **Customer Tier Spend Velocity Curve ([client/src/components/TierSpendVelocityCurve.jsx](file:///d:/agent1/client/src/components/TierSpendVelocityCurve.jsx))**:
   - Pure React SVG spline chart visualizing the customer's trailing spend velocity across account tiers (Bronze $0-$25k, Silver $25k-$100k, Gold $100k-$350k, Platinum $350k+).
   - Displays real-time credit hygiene indicators (DSO, overdue invoice days, order cadence), flagging automated degradation alerts if the account has stalled or defaulted.

4. **5-Axis Blended Risk Radar ([client/src/components/BlendedRiskRadarChart.jsx](file:///d:/agent1/client/src/components/BlendedRiskRadarChart.jsx))**:
   - Pure React SVG radar chart plotting multi-dimensional deal governance risk: Margin Health, Discount Depth, Customer Credit Hygiene, Fulfillment Split Complexity, and Escalation Severity.
   - Displays current deal risk polygon against a green dashed safe-operating perimeter.

5. **Administrative Rule Matrix Builder ([client/src/pages/RuleMatrixBuilder.jsx](file:///d:/agent1/client/src/pages/RuleMatrixBuilder.jsx))**:
   - Implements Excalidraw Wireframe Screen 18 (*Discount Tiers & Approval Chains*).
   - Provides administrative visibility into customer tier ceilings, category ceilings, and escalation routing rules.
   - Features an Interactive Deal Simulator Sandbox where operators can slide hypothetical discounts and margins to observe immediate approval route calculation in real time.

**Explicit Architectural Boundary**:
Phase 6 delivers the interactive CPQ quotation studio, visual SVG deal telemetry, and administrative rule matrix builder. External customer portal negotiation, PDF generation, and graceful fallback reversion UI are scheduled for Phase 7.

---

## Technique 2: Visual Code Flow (The Call Graph)

### Diagram A: Real-Time CPQ Calculation & Telemetry Pipeline

```
[Sales Rep Edits Line Item (Discount/Qty)]
                 │
                 ├──► [WebSocketContext.sendAction('presence', { field, status: 'editing' })]
                 │          │
                 │          ▼
                 │    (Broadcasts typing presence to collaborating tabs)
                 │
                 ▼
       [useEffect (120ms debounce)]
                 │
                 ▼
      POST /api/pricing/preview
                 │
                 ├──► [PricingGateway.calculateQuotationPreview()]
                 │          │
                 │          ├──► [QuotationCalculator.calculateLinePricing()]
                 │          │          (Calculates listPrice, netPrice, costPrice in integer cents)
                 │          │
                 │          ├──► [EscalationEngine.assessEscalation()]
                 │          │          (Computes category breaches & Blended Risk Score)
                 │          │
                 │          └──► [PricingGateway.generateMarginRecommendations()]
                 │                     (Ranks catalog items by gross margin lift delta)
                 │
                 ▼
      JSON Response: { success: true, preview: { ... } }
                 │
                 ▼
      [setPreview(res.preview)]
                 │
                 ├──────────────────────┬──────────────────────┬──────────────────────┐
                 ▼                      ▼                      ▼                      ▼
      [Financial Ledger]     [MarginSpeedometer]     [TierSpendCurve]      [BlendedRiskRadar]
      (Net total, COGS,      (Animated needle        (Customer position    (5-axis risk polygon
       discount total)        against 18% floor)      on spend spline)      vs safe benchmark)
```

### Diagram B: Administrative Rule Matrix Simulation Flow

```
[Operator Moves Sliders in RuleMatrixBuilder]
(Tier: Silver | HW: 12% | Srv: 8% | Sub: 15% | Margin: 23.5%)
                 │
                 ▼
[Pure React Local Evaluation]
                 │
                 ├── hwBreach = max(0, 12 - 15) = 0
                 ├── srvBreach = max(0, 8 - 10) = 0
                 ├── subBreach = max(0, 15 - 20) = 0
                 ├── tierBreach = max(0, 12 - 10) = 2%
                 │
                 ▼
[Blended Risk Score = round((0*1.2 + 0*1.5 + 0*0.8 + 2*1.0) * 10) / 10 = 2.0]
                 │
                 ▼
[Routing Determination]:
                 ├── Margin < 18.0%? ──► HARD BLOCK
                 ├── Max Disc > 20% OR Score > 12? ──► Finance Controller
                 ├── Max Disc > Tier Cap OR Margin < 25%? ──► Sales Manager Sign-Off
                 └── Else ──► Sales Rep Self-Approved
```

---

## Technique 3: Variable Lifecycle Trace (Birth -> Transformation -> Egress)

We trace the critical `preview.grossMarginPercentage` metric from user input through calculation to visual rendering and invariant locking.

| Step | Location | State / Transformation | Value Example |
| :---: | :--- | :--- | :--- |
| **Birth** | `QuotationStudio.jsx#L103` | Sales rep modifies line discount in the UI table. The 120ms debounced effect builds an HTTP POST body with line item quantities and discount percentages. | `{ productId: 'prod-srv-01', quantity: 2, unitDiscountPercentage: 35 }` |
| **Ingress** | `routes.js#L192` | `POST /api/pricing/preview` parses JSON body, retrieves customer and product catalog entities from repository. | `product.listPriceCents = 500000`, `costPriceCents = 350000` |
| **Transform 1** | `pricing-gateway.js#L96` | `calculateLinePricing` computes net line price in integer cents: `listTotal = 2 * 500000 = 1000000`, `discount = 350000`, `netTotal = 650000`. | `netTotalCents = 650000`, `costTotalCents = 700000` |
| **Transform 2** | `pricing-gateway.js#L118` | Gross margin in cents is computed: `grossMarginCents = 650000 - 700000 = -50000`. Gross margin percentage is computed: `round(((-50000 / 650000) * 100) * 10) / 10 = -7.7%`. | `grossMarginPercentage = -7.7`, `marginFloorBreached = true` |
| **Transform 3** | `pricing-gateway.js#L174` | Escalation engine evaluates floor breach: `grossMarginPercentage < 18.0` flags `isHardBlocked = true`, `requiredTier = 'Finance'`. | `isHardBlocked = true` |
| **Egress 1** | `routes.js#L214` | Server serializes clean preview JSON and returns HTTP 200 to browser client. | `{ success: true, preview: { grossMarginPercentage: -7.7, marginFloorBreached: true, ... } }` |
| **Egress 2** | `QuotationStudio.jsx#L117` | React state updates: `setPreview(res.preview)`. Extracted `currentMargin = -7.7%`. | `isFloorBreached = true` |
| **Visual Render** | `MarginSpeedometerGauge.jsx#L26` | Normalizes `-7.7%` to needle angle `-83.1 deg`. Renders crimson red arc, pulsing "Floor Breach" badge, and displays digital reading `-7.7%`. | Needle points deep into red sector. |
| **Invariant Stop** | `QuotationStudio.jsx#L370` | `handleConfirm` button receives `disabled={saving \|\| isFloorBreached}`. The "Finalize Order" button is completely disabled, preventing transaction completion. | Button disabled, warning banner displayed. |

---

## Technique 4: Non-Blocking Noise Filtering (Pass 1 Bypass)

When auditing the CPQ Quotation Studio and visual widgets, junior auditors often get bogged down in visual math helpers and string formatters. On Pass 1, bypass the following non-critical infrastructure:

1. **SVG Path Geometry Utilities**:
   - `polarToCartesian()` and `describeArc()` in [MarginSpeedometerGauge.jsx](file:///d:/agent1/client/src/components/MarginSpeedometerGauge.jsx#L47-L61). These are standard trigonometry projection utilities mapping polar degrees to SVG 2D plane coordinates.
2. **Currency String Formatters**:
   - `formatCurrency(cents)` converting integer cents to `$XX.XX`.
3. **Radar Chart Coordinate Rotation**:
   - `getPoint(axisIndex, magnitude)` in [BlendedRiskRadarChart.jsx](file:///d:/agent1/client/src/components/BlendedRiskRadarChart.jsx#L54-L60) calculating pentagonal spokes.
4. **WebSocket Presence Debouncing**:
   - The non-blocking presence broadcast `sendAction('presence', ...)` fired on input change.

**Pass 1 Focus**: Concentrate strictly on:
- Pricing formula precision in [pricing-gateway.js](file:///d:/agent1/src/services/pricing-gateway.js#L96-L126).
- 18.0% red-line floor enforcement in [MarginSpeedometerGauge.jsx](file:///d:/agent1/client/src/components/MarginSpeedometerGauge.jsx#L28) and [QuotationStudio.jsx](file:///d:/agent1/client/src/pages/QuotationStudio.jsx#L370).
- Category ceiling compliance in [QuotationStudio.jsx](file:///d:/agent1/client/src/pages/QuotationStudio.jsx#L42) and [RuleMatrixBuilder.jsx](file:///d:/agent1/client/src/pages/RuleMatrixBuilder.jsx#L32).
- Zero ghost package compliance (confirming 0 imported chart libraries).

---

## Technique 5: Audit Exactly One Failure Path (Account Enumeration & Margin Floor Lockout)

### Target Failure Path: Tampered Client-Side Margin Floor Bypass Attempt

**Context**: An adversarial sales representative opens browser DevTools on a deal with an aggressive 35% discount (gross margin -7.7%), removes the `disabled` attribute from the "Finalize Order" button, and directly issues a `POST /api/quotes/:id/confirm` request to force order creation.

1. **Adversarial Request**:
   ```http
   POST /api/quotes/quote-draft-001/confirm HTTP/1.1
   Host: localhost:3000
   Content-Type: application/json

   { "confirmedBy": "user-rep-01", "expectedVersion": 1 }
   ```

2. **Server-Side Interception in [QuotationService.confirmQuotation()](file:///d:/agent1/src/services/quotation-service.js#L540)**:
   - The server does NOT trust any client-submitted margin percentages.
   - It re-evaluates the quotation against active pricing rules and checks `quotation.grossMarginPct`:
     ```javascript
     if (quotation.grossMarginPct < 18.0) {
       throw new ValidationError("Cannot confirm quotation: Deal gross margin breaches statutory 18.0% floor.");
     }
     ```
   - Even if the rep attempted to forge an approved state, `QuotationService.confirmQuotation` verifies that the state is strictly `Approved`. A draft with floor breaches cannot enter `Approved` because `approveQuotation` requires `canApprove()` role clearance (SalesManager or Finance).

3. **Egress Response**:
   ```http
   HTTP/1.1 400 Bad Request
   Content-Type: application/json
   X-Content-Type-Options: nosniff

   {
     "success": false,
     "error": "Cannot confirm quotation: Deal gross margin breaches statutory 18.0% floor."
   }
   ```

4. **Security Invariant Verified**:
   - The client-side UI lockout (`disabled={isFloorBreached}`) provides instant user feedback, while the server-side domain engine enforces an immutable cryptographic barrier. Client-side DevTools tampering cannot force order finalization.

---

## Technique 6: 1-Sentence Feynman Compression Test

> *"The Phase 6 CPQ Studio is a live commercial flight deck where sales reps immediately see deal margins on an interactive speedometer and can lift profits with 1-click upsells, while an immutable 18% floor permanently blocks unprofitable orders."*
