# Implementation Plan: Project CHAKRA Stage 1 Restyling, Official MHA Logo & Header Optimization

> **Target Platform**: Project CHAKRA (चक्र) Automated VASP Intelligence & Statutory Attribution System ([`demo/chakra_mvp/`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/))  
> **Mandate**: Remove header fluff, embed official Ministry of Home Affairs (MHA) logo, eliminate horizontal scrollbar across 5 operational stages, eradicate redundant stage cards from Stage 1, and establish an ergonomic, balanced, full-width 2-column workstation layout.  
> **Standards Compliance**: Government of India (GIGW / UX4G), Sec 94/106 BNSS 2023, BSA 2023, Antigravity Rules 10, 13, 14, 15.

---

## 1. Executive Summary & Problem Formulation

During production review of the Project CHAKRA dashboard, five distinct ergonomic and visual deficiencies were identified:
1. **Header Fluff & Excessive Vertical Space**: The top region (`.gov-utility-bar`, `.gov-brand-header`, `.gov-agency-titles`) consumes unnecessary vertical height before the blue operational docket bar (`CASE DOCKET: ... | NCRP COMPLAINT: ... | STATION: ...`).
2. **Unofficial / Incomplete Emblem**: The current SVG shows a generic emblem without the official bilingual "गृह मंत्रालय / MINISTRY OF HOME AFFAIRS" seal specified by MHA directives.
3. **5-Stage Navigation Horizontal Scrollbar**: The `.gov-navigation-bar` enforces fixed-width flex items with `12px 18px` padding, causing tabs to spill over and trigger an unsightly horizontal scrollbar on screens <1440px.
4. **Stage 1 Asymmetry & Space Waste**: Stage 1 was split into an undersized `460px` intake panel and a bloated right-hand briefing column. The right column wastes 60% of screen width repeating 4 redundant textual descriptions of downstream stages that are already clearly visible in the top navigation bar.
5. **Cramped Interactive Ingestion Workstation**: The left column squeezes high-frequency interactive elements (suspect wallet address, network selector, fraud loss, degree-bounded beam search sliders, and primary action triggers) into a narrow vertical column.

---

## 2. Architectural Blueprint & Proposed Ergonomic Transformations

### A. Compact Official Header & MHA Logo Integration
- **Asset**: Utilize [`demo/chakra_mvp/frontend/public/mha_logo.png`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/public/mha_logo.png) (Official bilingual Ashoka Lion Capital + "गृह मंत्रालय / MINISTRY OF HOME AFFAIRS").
- **Elimination of Text Duplication**: Remove the redundant second title line ("गृह मंत्रालय, भारत सरकार • MINISTRY OF HOME AFFAIRS, GOVERNMENT OF INDIA") since the logo itself crisply displays this official branding.
- **Tightened Vertical Padding**:
  - `.gov-utility-bar`: Reduced from `6px 24px` to `3px 20px` (font size: `10.5px`).
  - `.gov-brand-header`: Reduced padding from `10px 24px` to `6px 20px`, emblem height bounded to `50px`.
  - `.gov-status-bar`: Height optimized to `32px` (`5px 20px` padding), consolidating CASE DOCKET, NCRP COMPLAINT, POLICE STATION, SOVEREIGN ENGINE, and LATENCY.
- **Vertical Savings**: Reclaims approx 32px of primary viewport height for operational workflows.

### B. Zero-Scrollbar 5-Stage Navigation Grid
- Transform `.gov-navigation-bar` from an unbounded `display: flex; overflow-x: auto;` container into a deterministic 5-column responsive grid:
  ```css
  .gov-navigation-bar {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 4px;
    padding: 0 16px;
    overflow: hidden; /* Eliminates scrollbar entirely */
  }
  .gov-nav-tab {
    width: 100%;
    min-width: 0;
    padding: 8px 10px;
    justify-content: flex-start;
  }
  ```
- Gracefully truncate and format labels with clean typography so tabs fit 100% of viewport width across 1024px, 1280px, 1366px, 1440px, and 1920px+ displays with **ZERO** horizontal scrollbar.

### C. Restyled Stage 1 Layout: Balanced 2-Column Operational Workstation
- **Remove Redundancy**: Eliminate the 4 redundant text cards ("Multi-Chain Graph Traversal", "Internal VASP Sweep Forensics", "4-Pillar Explainable Scorer", "Court-Admissible BSA Evidence") from Stage 1.
- **Top Quick-Dispatch Incident Card (Full-Width)**:
  - Displays the active FIR Docket, NCRP Portal ID, Attributed VASP, and Confidence Score (94.0/Tier 1).
  - Quick-action buttons: `[Open Multi-Chain Graph Canvas (Stage 2) →]` and `[View Statutory Sanctions (Stage 5) →]`.
- **Balanced 2-Column Workstation Grid (`1fr 1fr`)**:
  - **Left Workstation Card: Legal Intelligence & Case Dossier (`50%`)**:
    - CCPS Investigating Officer Desk Authorization Banner (Sec 94 & 106/107 BNSS 2023).
    - Mode Switcher: "Registered State Cyber Crime Dockets" vs "Ad-Hoc Suspect Ingestion".
    - Active Case Selector Dropdown.
    - Expanded Case Narrative Box: Displays FIR details, NCRP complaint number, State Police jurisdiction, crime narrative / modus operandi, victim reported loss badge, and stolen target crypto asset.
  - **Right Workstation Card: Algorithmic Attribution Engine & Search Controls (`50%`)**:
    - Target Suspect Cryptocurrency Wallet Address: Full-width monospace input with ample breathing room.
    - Two-column input row: Underlying Network / Ledger selector & Reported Fraud Loss (₹ INR).
    - Algorithmic Anti-Explosion Parameters Card: Max Graph Traversal Depth slider (1–6 hops) & Dust Filter Floor Threshold slider (0–100 USD) with real-time value indicators.
    - Primary Operational Trigger: `[⚡ Execute Automated Attribution]` (High-contrast primary button).
    - Offline Ingestion Dock: `[Ad-Hoc Intelligence & Offline Calldata Ingestion Console]`.

---

## 3. Adversarial Claude Council Hardening (Invariant 10)

Before implementation, this architectural plan was submitted to the 5-Advisor Claude Council:

| Council Advisor | Stance & Critical Critique | Architectural Hardening Incorporated |
| :--- | :--- | :--- |
| **01-Contrarian** | *"Removing the 4 stage summary cards might confuse first-time operators who do not understand what happens next."* | Add clear directional indicators on the top Quick-Dispatch card: `Stage 1 → Stage 2 (Graph Canvas)` and `Stage 1 → Stage 5 (Statutory Sanctions)`. |
| **02-First-Principles** | *"Eliminating the scrollbar using CSS grid minmax(0, 1fr) must not cause tab labels to overlap or break layout on 1024px tablet screens."* | Use `min-width: 0; text-overflow: ellipsis; overflow: hidden;` on title containers and responsive media queries. |
| **03-Expansionist** | *"Ensure the 2-column balanced workstation can seamlessly support multi-wallet batch ingestion in future iterations."* | Abstract the input form structure into modular fieldsets within `CaseIntakePanel.tsx`. |
| **04-Naive Outsider** | *"The header had 3 different agency names and lines of text. A police officer at 2 AM needs immediate clarity on who they are acting as."* | Keep the header clean with the official MHA logo, single agency title, and high-visibility RBAC user badge. |
| **05-Pragmatic Executor** | *"Ensure Playwright E2E tests assert every element without flaky async scenario loading issues."* | Embed `FALLBACK_SCENARIOS` in the frontend client to guarantee zero empty states if backend network calls lag. |

**Council Verdict**: **APPROVED WITH HARDENING** (Unanimous 5/5).  
**Contrarian 4-Moat Test**:
- **Data Ingestion Moat**: Dual-stream support for live NCRP 1930 dockets and offline mempool calldata.
- **Algorithmic Moat**: Degree-bounded beam search parameters with dynamic dust filtering.
- **Sovereign Moat**: Explicit Section 94 & 106/107 BNSS 2023 statutory mandates.
- **Economic Moat**: Zero external API costs, local sovereign execution with sub-millisecond graph lookup.

---

## 4. Proposed Code Changes

### [Component 1: Header & MHA Logo]
- #### [MODIFY] [`demo/chakra_mvp/frontend/src/components/Header.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx)
  - Replace `/emblem_india.svg` with `/mha_logo.png` (height: 50px, width: auto).
  - Remove redundant subtitle line ("गृह मंत्रालय, भारत सरकार • MINISTRY OF HOME AFFAIRS...").
  - Tighten vertical spacing across utility bar, brand header, and status bar.

### [Component 2: Zero-Scrollbar Navigation]
- #### [MODIFY] [`demo/chakra_mvp/frontend/src/components/Navigation.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Navigation.tsx)
  - Ensure labels and sublabels truncate cleanly within grid cells.
- #### [MODIFY] [`demo/chakra_mvp/frontend/src/index.css`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/index.css)
  - Update `.gov-navigation-bar` to `display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; padding: 0 16px; overflow: hidden;`.
  - Update `.gov-nav-tab` with `padding: 8px 10px; width: 100%; min-width: 0;`.

### [Component 3: Stage 1 Restyling & Space-Efficient Workstation]
- #### [MODIFY] [`demo/chakra_mvp/frontend/src/components/CaseIntakePanel.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/CaseIntakePanel.tsx)
  - Restructure into a spacious, balanced 2-column workstation:
    - Left Card: Case Intake Dossier (FIR, NCRP, Case Selector, Crime Narrative, Loss Badge).
    - Right Card: Suspect Wallet Input, Network Selector, Beam Search Sliders, and Primary Action Triggers.
- #### [MODIFY] [`demo/chakra_mvp/frontend/src/App.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/App.tsx)
  - Remove the 4 redundant stage cards.
  - Position the Active Incident Docket & Dispatch Card at the top of Stage 1 spanning full width.
  - Add resilient fallback scenarios to prevent race conditions during initial load.
- #### [MODIFY] [`demo/chakra_mvp/frontend/src/index.css`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/index.css)
  - Update `.chakra-stage-grid-intake` to `display: grid; grid-template-columns: 1fr 1fr; gap: 20px; align-items: start;`.

### [Component 4: Headless Playwright Verification]
- #### [MODIFY] [`e2e/chakra.spec.ts`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/e2e/chakra.spec.ts)
  - Update selectors to match the new MHA logo, verified zero-scrollbar navigation, and balanced 2-column workstation.

---

## 5. Verification Plan

### Automated Headless Tests
1. **Playwright E2E Suite**:
   ```bash
   npx playwright test e2e/chakra.spec.ts
   ```
   - Assert MHA logo renders with valid `src="/mha_logo.png"`.
   - Assert all 5 stage tabs are visible and `.gov-navigation-bar` has `scrollWidth <= clientWidth` (zero scrollbar).
   - Assert Stage 1 renders the 2-column balanced workstation with FIR details, sliders, and wallet address.
   - Assert 0 browser console errors.
2. **Backend Unit Regression Suite**:
   ```bash
   pytest demo/chakra_mvp/backend/tests -v
   ```
3. **Cryptographic Squad Attestation**:
   ```bash
   python -m scripts.orchestrator.squad_attestation --prompt "Execute Stage 1 Restyling & MHA Logo Integration"
   ```

### Manual Verification
- Visual inspection in browser (`http://localhost:5173/`):
  - Verify header fluff is eliminated and MHA logo is sharp.
  - Confirm 5 tabs fit comfortably across various browser viewport widths without scrolling.
  - Confirm Stage 1 has a balanced, comfortable layout with no cramped inputs.
