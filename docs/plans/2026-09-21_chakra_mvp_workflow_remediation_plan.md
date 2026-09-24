# Implementation Plan: Project CHAKRA Deficiencies Remediation & Government Operations Dashboard

Remediate all technical deficiencies identified during the enterprise audit of **Project CHAKRA (चक्र)** ([`demo/chakra_mvp/`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/)), fix root test discovery and TypeScript type safety issues, and overhaul the frontend layout from a cramped 3-panel split into an executive **5-Stage National Law Enforcement Operations Workspace** conforming to Government of India (GIGW / UX4G) design standards and Antigravity Invariants.

---

## User Review Required

> [!IMPORTANT]
> **Dashboard Architecture Upgrade**: The current single-screen 3-column split (`CaseIntakePanel` + `AttributionGraph` + `AttributionVerdictPanel` side-by-side) cramps the Cytoscape canvas and forces judges/investigators to squint at narrow tables. The new design transitions to a **5-Stage National Operations Workspace** with an executive stage navigation bar, full-width analytical stages, and centralized reactive state persistence (zero data reset across views).

> [!NOTE]
> **Zero Breaking Changes to Backend APIs**: All FastAPI routes (`/attribution/trace`, `/attribution/inject`, `/sahyog/notices/generate`, `/sahyog/notices/dispatch`, `/evidence/dossier/pdf`, `/evidence/bnss-summons/pdf`, `/evidence/bsa-certificate/pdf`) remain completely preserved.

---

## Proposed Changes

### Component 1: Test Runner & Environment Configuration (P0)

#### [MODIFY] [pytest.ini](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/pytest.ini)
- Update `pythonpath` to include `demo/chakra_mvp/backend` alongside `.`.
- Resolves `ModuleNotFoundError: No module named 'app'` when running `pytest demo/chakra_mvp/backend/tests` from the workspace root.

#### [MODIFY] [package.json](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/package.json) (Root)
- Add dedicated developer scripts:
  - `"dev:backend:chakra"`: Runs uvicorn on `app.main:app` with `--app-dir demo/chakra_mvp/backend` on port 8000.
  - `"dev:frontend:chakra"`: Launches Vite dev server in `demo/chakra_mvp/frontend`.
  - `"test:chakra"`: Runs `pytest demo/chakra_mvp/backend/tests -v`.

#### [MODIFY] [demo/chakra_mvp/frontend/package.json](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/package.json)
- Add `"lint": "tsc -b"` script.

---

### Component 2: Frontend Type Safety & Component Hardening (P1)

#### [MODIFY] [types/index.ts](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/types/index.ts)
- Add `DispatchNoticeResult` interface matching the backend response of `/sahyog/notices/dispatch`:
  ```ts
  export interface DispatchNoticeResult {
    message: string;
    notice_id: string;
    vasp_ticket_id: string;
    debit_freeze_active: boolean;
    notice_details: SahyogNotice;
  }
  ```
- Add `ActiveTab` type:
  ```ts
  export type ActiveTab = "intake" | "graph" | "sweep" | "scoring" | "statutory";
  ```

#### [MODIFY] [components/StatutoryNoticeModal.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/StatutoryNoticeModal.tsx)
- Replace `useState<any | null>(null)` with `useState<DispatchNoticeResult | null>(null)`.
- Replace `any` catch blocks with `unknown` type guards.
- Enforce boolean coercion on checkbox: `checked={Boolean(dscChecked)}`.

#### [MODIFY] [components/AttributionGraph.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/AttributionGraph.tsx)
- Add unmount and re-render cleanup hook inside `useEffect`:
  ```tsx
  return () => {
    if (cyRef.current && !cyRef.current.destroyed()) {
      cyRef.current.destroy();
      cyRef.current = null;
    }
  };
  ```

#### [MODIFY] [components/CaseIntakePanel.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/CaseIntakePanel.tsx)
- Add strict value fallbacks: `value={suspectWallet || ""}` and `value={fraudLossInr ?? 0}` to eliminate React uncontrolled/controlled component warnings.

#### [MODIFY] [components/JuryInjectionModal.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/JuryInjectionModal.tsx)
- Add `value={jsonContent || ""}` on `<textarea>`.

---

### Component 3: Executive Government Operations Dashboard Overhaul (GIGW / UX4G)

#### [NEW] [components/SweepForensicLab.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/SweepForensicLab.tsx)
- Dedicated Stage 3 Forensic Lab examining the Deposit-to-Sweep heuristic:
  - Candidate Deposit Address verification card
  - Attributed VASP Entity & Registered FIU-IND Number
  - Hot Wallet Consolidation Target Address
  - Balance Zeroing Ratio (≥ 95% consolidation proof)
  - Latency / Temporal Window (< 120 minutes)
  - Gas Sponsorship Attestation from VASP Fueler Wallets
  - Deposit & Sweep transaction hash inspection with copy triggers.

#### [NEW] [components/ScoringMatrixPanel.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/ScoringMatrixPanel.tsx)
- Dedicated Stage 4 Explainable Forensic Confidence Scorer:
  - Visual circular confidence score gauge [0-100%]
  - Pillar breakdown cards:
    - Pillar 1: Infrastructure Match (40 pts)
    - Pillar 2: Sweep Consistency (25 pts)
    - Pillar 3: Proximity Decay (20 pts)
    - Pillar 4: Volume Continuity (15 pts)
    - Risk Deductions: Mixers (-35) & Bridges (-15)
  - Statutory Classification Tier Card: Tier 1 (Sec 106 BNSS Debit Freeze) vs Tier 2 (Sec 94 BNSS Summons) vs Tier 3 (Specialist Review).

#### [NEW] [components/StatutoryCourtDocket.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/StatutoryCourtDocket.tsx)
- Dedicated Stage 5 Statutory Sanctions & BSA 63 Evidence Docket:
  - Section 106/107 BNSS Emergency 24-hr Debit Freeze requisition card with digital signature attestation trigger
  - SHA-256 Merkle Evidence Tree root hash display and verification modal launch
  - 3 court-admissible ReportLab PDF download triggers:
    1. Executive Attribution Dossier PDF
    2. Section 94 BNSS Statutory Summons PDF
    3. Section 63(4) BSA 2023 Digital Evidence Certificate PDF
  - Fail-closed button gating: actions remain disabled until an attribution trace completes.

#### [MODIFY] [components/Header.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx)
- Upgrade header with National Tricolor bar (`Government of India | Ministry of Home Affairs | I4C SAHYOG`).
- Add active case summary badge (FIR / NCRP / Loss ₹).
- Add active RBAC Officer badge with single-click Switch Officer modal.
- Add quick-access **"Inject Custom Graph (Jury Evaluator Mode)"** button.
- Add **"Reset to Baseline"** action.

#### [MODIFY] [App.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/App.tsx)
- Implement central reactive state store with 5-stage sub-navigation bar:
  1. `intake`: NCRP Case Intake & Suspect Docket
  2. `graph`: Multi-Chain Attribution Canvas (Full-width Cytoscape)
  3. `sweep`: Sweep Consolidation Forensics Lab
  4. `scoring`: 4-Pillar Explainable Confidence Scorer
  5. `statutory`: SAHYOG Statutory Freezing & BSA 63 Court Docket
- Adheres strictly to Rule 13: Navigating between tabs **never** resets or clears active attribution, graph models, or scenario data.

#### [MODIFY] [App.css](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/App.css) & [index.css](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/index.css)
- Implement executive national operations workspace styling:
  - Tab navigation bar (`.chakra-nav-tabs`, `.chakra-nav-tab`, `.chakra-nav-tab-active`)
  - Stage badges (`.chakra-stage-badge`)
  - Full-width analytical grid layouts
  - Standard GIGW/UX4G card elevations and typography scales.

---

## Verification Plan

### Automated Tests
1. **Root Pytest Verification**:
   ```bash
   python -m pytest demo/chakra_mvp/backend/tests -v
   ```
   *Expected Result*: All 24 tests collect and pass with exit code 0 from repository root.
2. **Both Project Test Suites Concurrently**:
   ```bash
   python -m pytest demo/bhedak_mvp/backend/tests/test_phase1.py demo/chakra_mvp/backend/tests -v
   ```
   *Expected Result*: All 53 tests (29 BHEDAK + 24 CHAKRA) pass with exit code 0.
3. **Frontend TypeScript & Build Verification**:
   ```bash
   npm --prefix demo/chakra_mvp/frontend run build
   ```
   *Expected Result*: 0 type errors, production bundle compiled cleanly with exit code 0.
4. **Zero-Secret Shield**:
   ```bash
   npm run check:secrets
   ```
   *Expected Result*: Zero secrets detected.

### Manual / Headless Browser Verification
1. Launch CHAKRA frontend (`http://localhost:5173/`).
2. Verify top national header with official identity, active officer session pill, and case summary.
3. Step through all 5 investigation stages:
   - **Stage 1 (Case Intake)**: Load "Bengaluru Task Fraud", adjust hops to 4, click "Execute Degree-Bounded Beam Search".
   - **Stage 2 (Attribution Graph)**: Inspect full-width Cytoscape graph canvas, zoom/pan, click on nodes to inspect properties.
   - **Stage 3 (Sweep Lab)**: Verify deposit-to-sweep metrics (99.8% swept, gas sponsored by CoinDCX fueler).
   - **Stage 4 (Confidence Scorer)**: Verify 4-pillar breakdown cards (Score 96.4%, Tier 1 High Confidence).
   - **Stage 5 (Statutory Docket)**: Verify Merkle tree root hash verification modal and test PDF generation download.
4. Verify dynamic jury injection modal: paste custom graph and confirm real-time attribution updates across all 5 tabs.
5. Verify browser console: zero Cytoscape styling warnings, zero React controlled/uncontrolled warnings.
