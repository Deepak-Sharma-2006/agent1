# Project CHAKRA: Header Polish, Docket Deduplication, Fixed IO RBAC & Linear Stepwise Workflow Walkthrough

> **Date**: 2026-09-22 14:35 IST  
> **System**: Project CHAKRA — Centralized High-Confidence Automated Khata Resolution & Attribution System ([`demo/chakra_mvp/`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/))  
> **Scope**: Official Header Remediation, Docket Deduplication, Fixed Investigating Officer RBAC & Linear Stepwise Investigation Workflow  

---

## 1. Executive Summary & Deliverables

In response to operator evaluation of the Project CHAKRA Operations Platform, four core workflow and presentation remediations were designed, implemented, and verified via headless Playwright E2E testing:

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        PROJECT CHAKRA: NATIONAL CYBER CRIME INVESTIGATION PLATFORM                     │
│               Centralized High-Confidence Automated Khata Resolution & Attribution (I4C / MHA)          │
├────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. POLISHED OFFICIAL HEADER  │ Font zoom stripped; authentic Hindi/English CHAKRA full form embedded; │
│                              │ official MHA seal seamlessly integrated with zero square boundary lines.│
├──────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 2. DOCKET DEDUPLICATION      │ Dark blue header bar converted to Station & Sovereign Engine Telemetry; │
│                              │ active case incident details exclusively consolidated in docket card.   │
├──────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 3. FIXED IO RBAC MATRIX      │ Role switching removed; dashboard permanently bound to Investigating    │
│                              │ Officer (IO / SHO) desk under Secs 94 & 106 BNSS 2023 with audit badge. │
├──────────────────────────────┼─────────────────────────────────────────────────────────────────────────┤
│ 4. LINEAR STEPWISE WORKFLOW  │ Sequential BHEDAK-style progression (Stages 1 -> 2 -> 3 -> 4 -> 5) with  │
│                              │ padlock gating, step action docks, and Rule 13 centralized state store. │
└──────────────────────────────┴─────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Key Changes & Architectural Grounding

### Component 1: Polished Official Header & Seamless MHA Seal
- **Files**: [`demo/chakra_mvp/frontend/src/components/Header.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx), [`demo/chakra_mvp/frontend/public/mha_logo.png`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/public/mha_logo.png)
- Stripped unnecessary `.gov-accessibility-controls` (`A`, `A+` buttons) and state from the top utility bar.
- Replaced generic subtitle with authentic bilingual full name:
  `प्रोजेक्ट चक्र : केंद्रीकृत उच्च-विश्वसनीयता स्वचालित खाता समाधान व एट्रिब्यूशन • PROJECT CHAKRA : Centralized High-Confidence Automated Khata Resolution & Attribution`.
- Processed the official Ministry of Home Affairs seal image: removed outer screenshot bounding border, cropped to content (582x184), converted near-white pixels to smooth alpha transparency, and styled with `mix-blend-mode: multiply` for 100% seamless embedding on the white brand bar.

### Component 2: Deduplication of Status Bar & Incident Docket
- **Files**: [`demo/chakra_mvp/frontend/src/components/Header.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx), [`demo/chakra_mvp/frontend/src/App.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/App.tsx)
- Separated responsibilities between header status bar and incident docket card:
  - **Dark Blue Status Bar**: Exclusively displays infrastructure telemetry (`OPERATIONAL DESK: CYBER CRIME INVESTIGATION DESK (IO / CCPS) | STATION: Cyber Crime Police Station, Rohini | JURISDICTION: Delhi | SOVEREIGN ENGINE: DEGREE-BOUNDED BEAM SEARCH | LATENCY: 0.09 ms | SECURITY: TLS 1.3 / mTLS`). Zero repetition of FIR or NCRP numbers.
  - **Active Incident Docket Card**: Exclusively displays case incident facts (`FIR`, `NCRP`, `Attributed VASP`, `Confidence Score`) with directional workflow action button.

### Component 3: Fixed Investigating Officer RBAC Matrix
- **Files**: [`demo/chakra_mvp/frontend/src/components/RbacSwitcherModal.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/RbacSwitcherModal.tsx), [`demo/chakra_mvp/frontend/src/components/Header.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Header.tsx)
- Eliminated fake role-switching row triggers.
- In the RBAC modal:
  - Row 1 (Investigating Officer) is highlighted with gold/navy styling and badge: `★ DESIGNATED OPERATIONAL DESK (CHAKRA MVP) • [AUTHENTICATED ACTIVE OPERATOR]`.
  - Rows 2–5 (Supervisory Officer, Forensic Examiner, Cyber Threat Analyst, VASP Nodal Officer) are displayed with `STATUTORY OVERSIGHT TIER (READ-ONLY AUDIT MAPPING)` and disabled interaction.
- In the top header: Role badge displays `ROLE: INVESTIGATING_OFFICER (Insp. Rajesh Kumar) [DSC]` and acts as an informational statutory reference.

### Component 4: Linear Stepwise Investigation Workflow & Central State
- **Files**: [`demo/chakra_mvp/frontend/src/components/Navigation.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/components/Navigation.tsx), [`demo/chakra_mvp/frontend/src/App.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/App.tsx), [`demo/chakra_mvp/frontend/src/types/index.ts`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/types/index.ts), [`demo/chakra_mvp/frontend/src/index.css`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/chakra_mvp/frontend/src/index.css)
- Added `InvestigationProgressState` tracking completion across all 5 stages.
- Mirrored state into `sessionStorage` under `chakra_active_investigation_store` (Rule 13 Invariant: zero data reset across stage transitions).
- Sequential gating:
  - Stage 1: Case Intake (Always unlocked).
  - Stage 2: Multi-Chain Attribution Canvas (Locked until Stage 1 trace executed).
  - Stage 3: Sweep Forensics & Fueler Lab (Locked until Stage 2 canvas inspected).
  - Stage 4: 4-Pillar Confidence Scorer (Locked until Stage 3 sweep audited).
  - Stage 5: SAHYOG Sanctions & Court Docket (Locked until Stage 4 score calculated and ≥ 85%).
- Embedded fixed bottom action docks (`.chakra-stage-action-dock`) across Stages 2, 3, and 4 to provide clear stepwise navigation forward.

---

## 3. Empirical Verification Results

```
====================================================================================================
SUITE                                  COMMAND                                         STATUS
====================================================================================================
Playwright Headless E2E                npx playwright test e2e/chakra.spec.ts          1 passed (4.2s)
Backend Regression Suite               python -m pytest demo/chakra_mvp/backend/tests  24 passed (1.04s)
Frontend TypeScript Build              npm --prefix demo/chakra_mvp/frontend run build Exit 0 (904ms)
Zero Secrets Shield                    npm run check:secrets                           Exit 0
====================================================================================================
```

All elementary assertions passed with zero console errors.
