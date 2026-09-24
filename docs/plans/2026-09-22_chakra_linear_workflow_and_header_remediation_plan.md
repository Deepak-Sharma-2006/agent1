# Project CHAKRA: Header Polish, Docket Deduplication, Fixed IO RBAC & Linear Stepwise Investigation Workflow

> **Date**: 2026-09-22 14:26 IST  
> **System**: Project CHAKRA — Centralized High-Confidence Automated Khata Resolution & Attribution System ([`demo/chakra_mvp/`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/))  
> **Status**: Ready for Execution  

---

## 1. Executive Summary & Problem Formulation
In response to operator evaluation of the Project CHAKRA Operations Platform, four critical workflow and presentation remediations are established:
1. **Header Polish**:
   - Strip redundant font size buttons (`A`, `A+`) from the top utility bar.
   - Replace the generic subtitle `'PROJECT CHAKRA : AUTOMATED VASP ATTRIBUTION SYSTEM'` with the authentic full institutional name:
     `प्रोजेक्ट चक्र : केंद्रीकृत उच्च-विश्वसनीयता स्वचालित खाता समाधान व एट्रिब्यूशन • PROJECT CHAKRA : Centralized High-Confidence Automated Khata Resolution & Attribution`.
   - Make the attached official Ministry of Home Affairs (MHA) seal seamless by removing screenshot border lines and establishing transparent alpha blending.
2. **Deduplication of Docket Displays**:
   - Refactor the dark blue status bar in [`Header.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx) into an **Operational & Sovereign Engine Telemetry Bar** (`OPERATIONAL DESK`, `STATION`, `SOVEREIGN ENGINE`, `PROCESSING LATENCY`, `SECURITY PROTOCOL`), removing duplicate FIR/NCRP text.
   - Retain the case-specific incident docket details (`FIR`, `NCRP`, `Attributed VASP`, `Confidence Score`, `Action Buttons`) exclusively in the active incident card.
3. **Non-Switchable RBAC Matrix & IO Desk Highlighting**:
   - Eliminate fake role-switching triggers in [`RbacSwitcherModal.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/RbacSwitcherModal.tsx).
   - Display a prominent institutional banner explaining that CHAKRA MVP is custom-engineered and designated specifically for the **Investigating Officer (IO / SHO)** under Sections 94 & 106/107 BNSS 2023.
   - Distinctively highlight the IO role (`Insp. Rajesh Kumar`, Delhi Police) as `★ PRIMARY OPERATIONAL ROLE (MVP CORE FOCUS)`, while marking other tiers as `STATUTORY OVERSIGHT TIER (READ-ONLY AUDIT MAPPING)`.
4. **Linear Stepwise Investigation Workflow (BHEDAK Paradigm) & Central Reactive State**:
   - Implement an explicit linear progression state machine (`InvestigationProgressState` & `ActiveInvestigationStore` synced to `sessionStorage` under `chakra_active_investigation_store`).
   - Downstream stages (Stages 2–5) remain locked with padlock indicators and explicit lock reason tooltips until prior stages are completed:
     - Stage 1 (Intake): Always unlocked.
     - Stage 2 (Graph Canvas): Locked until Stage 1 attribution is executed.
     - Stage 3 (Sweep Forensics): Locked until Stage 2 graph traversal is audited.
     - Stage 4 (Confidence Scorer): Locked until Stage 3 sweep forensics is audited.
     - Stage 5 (Statutory Sanctions): Locked until Stage 4 confidence score is calculated and meets statutory threshold (≥ 85%).
   - Add step-progression action dock buttons at the bottom of Stages 1, 2, 3, and 4 to guide the investigator sequentially through the pipeline.
   - Guarantee Rule 13 invariant: zero data loss across stage transitions.

---

## 2. Technical Architecture & File Modifications

### Component 1: Header Component & Brand Optimization
- **File**: [`demo/chakra_mvp/frontend/src/components/Header.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx)
- Remove `.gov-accessibility-controls` (`A`, `A+` buttons) and `handleTextZoom`.
- Update subtitle to:
  `प्रोजेक्ट चक्र : केंद्रीकृत उच्च-विश्वसनीयता स्वचालित खाता समाधान व एट्रिब्यूशन • PROJECT CHAKRA : Centralized High-Confidence Automated Khata Resolution & Attribution`.
- Use seamless transparent MHA logo with `mix-blend-mode: multiply` and `height: 44px`.
- Refactor the dark blue status bar (`.gov-status-bar`) to display:
  - `OPERATIONAL DESK: CYBER CRIME INVESTIGATION DESK (IO / CCPS)`
  - `STATION: Cyber Crime Police Station, Rohini (Delhi Police)`
  - `SOVEREIGN ENGINE: DEGREE-BOUNDED BEAM SEARCH`
  - `PROCESSING LATENCY: 0.09 ms • TLS 1.3`
  - (Zero repetition of FIR/NCRP numbers).
- Lock the header role button to `DESK: INVESTIGATING_OFFICER (Insp. Rajesh Kumar) [DSC]`.

### Component 2: RBAC Matrix Remediation
- **File**: [`demo/chakra_mvp/frontend/src/components/RbacSwitcherModal.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/RbacSwitcherModal.tsx)
- Remove `onClick` row triggers and cursor pointer styles.
- Replace "Click any role row below to switch active session:" with:
  "Statutory Notice: Project CHAKRA MVP is custom-engineered and designated strictly for the **Investigating Officer (IO / SHO)** under Sections 94 & 106/107 BNSS 2023. Other statutory personas are displayed for sovereign access governance and audit mapping."
- Distinctively highlight Row 1 (`Investigating Officer`) with active border, gold/navy badge: `★ DESIGNATED OPERATIONAL DESK (CHAKRA MVP CORE FOCUS) • ACTIVE & AUTHENTICATED`.
- Mark other rows (`Supervisory Officer`, `Forensic Examiner`, `Threat Analyst`, `VASP Nodal Officer`) with badge `STATUTORY OVERSIGHT TIER (READ-ONLY AUDIT MAPPING)`.

### Component 3: Linear Navigation & Investigation Progress State
- **File**: [`demo/chakra_mvp/frontend/src/components/Navigation.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Navigation.tsx)
- Add `progress: InvestigationProgressState` and `isLocked: boolean` properties to tabs.
- Calculate sequential locking:
  - Stage 1: Always unlocked (`isLocked: false`).
  - Stage 2: Locked if `!progress.step1_intake` (Reason: `"Requires Stage 1 Beam Search Attribution Execution"`).
  - Stage 3: Locked if `!progress.step2_graph` (Reason: `"Requires Stage 2 Graph Traversal Verification"`).
  - Stage 4: Locked if `!progress.step3_sweep` (Reason: `"Requires Stage 3 Sweep Forensics Verification"`).
  - Stage 5: Locked if `!progress.step4_scoring || !isHighConfidence` (Reason: `"Requires Stage 4 Admissibility Score (≥85%)"`).
- Render `Lock` icon, disabled state (`opacity: 0.5`, `cursor: not-allowed`), and lock reason tooltips on locked tabs.
- **File**: [`demo/chakra_mvp/frontend/src/types/index.ts`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/types/index.ts)
  - Add `InvestigationProgressState` interface.

### Component 4: App Container & Central Reactive Store
- **File**: [`demo/chakra_mvp/frontend/src/App.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/App.tsx)
- Implement `chakra_active_investigation_store` in `sessionStorage` mirroring BHEDAK architecture.
- Maintain `progress` state tracking completed stages.
- Fix active user permanently to `Investigating Officer (IO / SHO)` (`FALLBACK_USERS[0]`).
- Add bottom step-progression action dock buttons to each stage view:
  - Stage 1: "Proceed to Stage 2: Multi-Chain Graph Canvas →"
  - Stage 2: "Proceed to Stage 3: Sweep Forensics & Fueler Lab →"
  - Stage 3: "Proceed to Stage 4: 4-Pillar Confidence Scorer →"
  - Stage 4: "Proceed to Stage 5: SAHYOG Sanctions & Court Docket →"
- Update stage transition handlers so entering/viewing Stage 2 marks `step2_graph: true`, Stage 3 marks `step3_sweep: true`, Stage 4 marks `step4_scoring: true`, and Stage 5 marks `step5_statutory: true`.

### Component 5: Visual Styling Optimization
- **File**: [`demo/chakra_mvp/frontend/src/index.css`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/index.css)
- Add styles for locked tabs, step-progression action docks, and designated IO role cards.
- Ensure `.gov-emblem-svg img` has zero border and seamless blending.

### Component 6: Test Suite Alignment
- **File**: [`e2e/chakra.spec.ts`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/e2e/chakra.spec.ts)
- Update tests to assert:
  - Font zoom controls removed.
  - Subtitle shows full CHAKRA name.
  - MHA logo is seamless.
  - Blue status bar shows station/engine telemetry without duplicate FIR/NCRP.
  - RBAC modal shows non-switchable IO role designation.
  - Linear sequential unlocking of Stages 1 through 5.
  - 0 console errors.

---

## 3. Verification Commands
- `npx playwright test e2e/chakra.spec.ts`
- `python -m pytest demo/chakra_mvp/backend/tests -v`
- `npm --prefix demo/chakra_mvp/frontend run lint`
- `python -m scripts.orchestrator.squad_attestation`
