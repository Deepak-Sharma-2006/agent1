# Implementation Plan: Remediate Project BHEDAK MVP & Workflow Standards Compliance

Bring the **Project BHEDAK MVP demonstration** ([`demo/bhedak_mvp/`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/)) and workspace verification systems into full compliance with all 14 Antigravity Enterprise Agentic Workflow Directives ([`AGENTS.md`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/AGENTS.md) and [`GEMINI.md`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/GEMINI.md)).

---

## User Review Required

> [!IMPORTANT]
> **Component Shell & Action Dock (Rule 14)**: The frontend layout will be upgraded to include a fixed bottom-right action dock (`<footer class="app-action-dock">`). This consolidates primary workflow progression triggers into a unified anchor while preserving the government GIGW aesthetic and persistent tab containers.

> [!IMPORTANT]
> **Fail-Closed Statutory Action Gating (Rule 13)**: In accordance with Section 63 BSA 2023 legal invariants, court evidence export buttons (`Download Plaintext`, `Print / Save Court PDF`, and `Download STIX JSON`) in [`StatutoryExportModal.tsx`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/StatutoryExportModal.tsx) will now be strictly **disabled** (`disabled={!isAdmissible}`) until prerequisite engines reach `COMPLETED` and computed certainty reaches ≥ 85.0% deterministic proof.

---

## Proposed Changes

### Phase 1: Frontend Type Safety & Anti-Hallucination Guard (Rule 1 & Rule 5)

#### [MODIFY] [types/index.ts](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/types/index.ts)
- Add explicit interfaces to replace loose types:
  - `CytoscapeElement`: typed graph nodes and edges.
  - `AttributionPathHop`: step in shortest attribution BFS.
  - `BlockchainHop`: multi-hop fund flow entity.
  - `STIXBundle`: OASIS STIX 2.1 JSON schema.
  - `GraphNodeData` & `GraphEdgeData`: Cytoscape payload schemas.
  - `DiurnalPresetId`: union of diurnal pattern keys.

#### [MODIFY] [services/api.ts](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/services/api.ts)
- Replace `elements: any[]`, `attribution_path?: any[]`, `hops: any[]`, and `Promise<any>` with typed signatures (`CytoscapeElement[]`, `AttributionPathHop[]`, `BlockchainHop[]`, `STIXBundle`).

#### [MODIFY] [components/AttributionGraph.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/AttributionGraph.tsx)
- Replace `selectedNode: any` and `selectedEdge: any` with typed `GraphNodeData | null` and `GraphEdgeData | null`.
- Type Cytoscape style declarations and initialization elements without `any`.
- Fix oxlint warnings regarding synchronous `setState` in `useEffect` and missing hook dependencies.

#### [MODIFY] [components/StatutoryExportModal.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/StatutoryExportModal.tsx)
- Replace `stixData: any` with `STIXBundle | null`.

#### [MODIFY] [components/StylometryLab.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/StylometryLab.tsx)
- Replace `(DIURNAL_PATTERNS as any)[selectedPresetId]` with type-safe key indexing.
- Fix oxlint warnings regarding synchronous `setState` in `useEffect`.

---

### Phase 2: Central Reactive State Store & Fail-Closed Statutory Action Gating (Rule 13)

#### [MODIFY] [components/StatutoryExportModal.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/StatutoryExportModal.tsx)
- Enforce `disabled={!isAdmissible}` on `download-bsa-txt-btn`, `print-court-pdf-btn`, and `download-stix-json-btn`.
- Add lock badges and explanatory tooltip when in provisional uncertified state.

#### [MODIFY] [components/CaseOverview.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/CaseOverview.tsx) & [components/ConfidenceScorer.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/components/ConfidenceScorer.tsx)
- Dynamically bind button text labels to active computed scores rather than hardcoding `"95.0%"`.

---

### Phase 3: Enterprise Frontend Component Shell & Design Tokens (Rule 14)

#### [MODIFY] [index.css](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/index.css)
- Integrate tokens from [`templates/frontend/design-tokens.css`](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/templates/frontend/design-tokens.css).
- Define `.app-action-dock` styling: fixed bottom-right position (`bottom: 24px; right: 32px;`), elevated glassmorphism shadow, smooth transition, and button layout.

#### [MODIFY] [App.tsx](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/frontend/src/App.tsx)
- Structure outer container according to Rule 14:
  - Header: `<header className="app-header">`
  - Viewport: `<main className="app-viewport gov-workspace-container">`
  - Action Dock: `<footer className="app-action-dock">`
- Wire primary contextual action in the dock (e.g. Next Step, Run Scan, Synthesize Graph, Export Certificate) dynamically based on `activeTab` and `progress`.

---

### Phase 4: Edge-Case Test Probe Depth & Mutation Hardening (Rules 5 & 12)

#### [MODIFY] [backend/tests/test_phase1.py](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/demo/bhedak_mvp/backend/tests/test_phase1.py)
- Add deterministic negative and boundary test probes:
  - Null/None input handling in `PureMurmurHash3.hash32` and `calculate_favicon_mmh3`.
  - Empty string and whitespace boundary tests in `StylometricEngine.analyze_sample`.
  - Malformed non-onion domain requests in FastAPI `/api/scan-onion` (verifying 400 rejection).
  - Malicious SQL injection and XSS payloads in sample text to verify zero vulnerability.
  - Zero-signal evaluation in `AsymmetricAttributionScorer` (verifying 0.0 UNRELIABLE).

---

### Phase 5: System-Level Fixes & SDET Verification

#### [MODIFY] [scripts/memory-vault.ts](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/scripts/memory-vault.ts)
- Safeguard `JSON.parse(r.tags || "[]")` with fallback to comma-separated string splitting to eliminate syntax crashes.

#### [MODIFY] [scripts/lock-manager.ts](file:///c:/Users/Deepak%20Sharma/OneDrive/Desktop/scripts/scripts/lock-manager.ts)
- Ensure concurrent lease claims with distinct operator names correctly enforce mutual exclusion, resolving the failure in `tests/adversarial/adversarial-contract.test.ts`.

---

## Verification Plan

### Automated Tests
1. **Frontend Compilation & Linting**:
   ```powershell
   cd "demo\bhedak_mvp\frontend"
   npm run build
   npm run lint
   ```
2. **Backend Engine Pytest Suite**:
   ```powershell
   pytest demo/bhedak_mvp/backend/tests/test_phase1.py
   ```
3. **ProjectAuditor Enterprise Health Score**:
   ```powershell
   python -c "from scripts.orchestrator.project_auditor import ProjectAuditor; r = ProjectAuditor.audit_project('demo/bhedak_mvp'); print('Health Score:', r.overall_health_score); assert r.overall_health_score >= 90"
   ```
4. **Adversarial Contract Suite & System Readiness**:
   ```powershell
   npm run test:adversarial
   npm run readiness
   ```
5. **Zero-Secret & Anti-Hallucination Shields**:
   ```powershell
   npm run check:secrets
   npm run check:hallucinations
   ```

### Manual Verification
- Launch local demo or verify in browser:
  - Test `GUIDED_LINEAR` vs. `EXAMINER_OVERRIDE` tab navigation.
  - Verify fixed action dock remains anchored at bottom-right across all 6 tabs.
  - Verify export buttons remain disabled until confidence reaches ≥ 85% with deterministic proof.
