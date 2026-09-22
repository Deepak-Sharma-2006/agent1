# Implementation Plan: Project CHAKRA Linear Workflow, Operator Stage Simulation, Bhedak Progressive Graph Synthesis & Statutory PDF Preview

This implementation plan details the technical remediation for all 7 reported bugs in **Project CHAKRA (Crypto Hop Analytics & Knowledge for Rapid Attribution)**.

---

## User Review Required

> [!IMPORTANT]
> **1. Strict Linear Gating (Bugs 1 & 7)**:
> - **Selecting a crime docket from the dropdown in Stage 1 will NEVER automatically run attribution or unlock Stage 2.** It will exclusively populate the input fields (Suspect Wallet, Network, Reported Fraud Loss, NCRP ID, and Summary).
> - The operator must explicitly click **`[Execute Automated Attribution]`** to run the beam search traversal and unlock Stage 2.
> - At every subsequent stage (Stage 2 $\rightarrow$ Stage 3 $\rightarrow$ Stage 4 $\rightarrow$ Stage 5), the action dock **"Proceed" button remains strictly disabled** until the operator performs that stage's required forensic action.
> - Navigation tabs will also reflect this lock: jumping ahead past uncompleted stages is blocked.

> [!IMPORTANT]
> **2. Progressive Graph Synthesis Matching Bhedak MVP (Bug 6)**:
> - In Stage 2, clicking **`[Synthesize Multi-Chain Graph Canvas]`** will no longer instantly display the entire graph.
> - Following the exact architectural pattern of [`demo/bhedak_mvp/frontend/src/components/AttributionGraph.tsx`](file:///demo/bhedak_mvp/frontend/src/components/AttributionGraph.tsx#L452-L517), Cytoscape elements will initially have `.staged-hidden` (`display: none`).
> - The synthesis sequence will progressively spawn nodes hop-by-hop over ~1.5 seconds:
>   - **Stage 1 (0ms)**: Suspect Seed Wallet (Hop 0) reveals; camera centers on suspect.
>   - **Stage 2 (+450ms)**: Intermediate Peel-Chain Mule Wallets (Hops 1..n) and transaction edges reveal.
>   - **Stage 3 (+450ms)**: Candidate VASP Inflow Deposit Address reveals.
>   - **Stage 4 (+450ms)**: Attributed VASP Hot Wallet reveals along with the dashed internal sweep edge.
>   - **Framing (+350ms)**: Smooth `cy.animate({ fit: ... })` frames the complete topology, synthesis completes, and the bottom **Proceed to Stage 3** button is enabled.

> [!IMPORTANT]
> **3. Operator Simulation for Stages 3 & 4 (Bug 2)**:
> - **Stage 3 (Sweep Forensics)**: Arriving at Stage 3 displays a clean briefing card with an action button: **`[Execute Omnibus Sweep & Gas Fueler Forensics]`**. Clicking it triggers a 1.2s simulated forensic audit (auditing gas fueler sponsor, querying internal sweep calldata, verifying zero-remainder consolidation) before revealing the forensic summary cards, gas fueler inspector, and calldata timeline.
> - **Stage 4 (Confidence Scorer)**: Arriving at Stage 4 displays an audit briefing card with an action button: **`[Compute 4-Pillar Mathematical Admissibility Score]`**. Clicking it runs a 1.2s multi-factor matrix evaluation (Infrastructure match, Sweep consistency, Proximity decay, Volume continuity) before rendering the circular score gauge and detailed pillar breakdown table.
> - Once executed for the active docket, the computed results persist so the operator can freely navigate between completed stages without re-running.

> [!NOTE]
> **4. Button Styling Consistency (Bug 3)**:
> - The button **"Proceed to Stage 5: SAHYOG Sanctions & Court Docket"** in the Stage 4 action dock is changed from orange (`gov-btn-saffron`) to standard black/navy (`gov-btn-primary`), ensuring 100% visual consistency with all other stage progression buttons.

> [!IMPORTANT]
> **5. Statutory PDF Previews & Dynamic Case Data (Bugs 4 & 5)**:
> - In Stage 5, each of the 3 document export cards will feature **BOTH** a **`[Preview Document]`** button (with `Eye` icon) and a **`[Download PDF]`** button.
> - Clicking **`[Preview Document]`** opens a high-fidelity **`DocumentPreviewModal`** embedding an `iframe` with the live ReportLab PDF binary stream from `/api/v1/evidence/.../pdf`.
> - The legal syntax and statutory formatting for all 3 documents—**Executive Attribution Dossier**, **Section 94 BNSS Summons**, and **BSA 63(4) Evidence Certificate**—are verified under Bharatiya Nagarik Suraksha Sanhita (BNSS), 2023 and Bharatiya Sakshya Adhiniyam (BSA), 2023.
> - All document fields (FIR, NCRP, Suspect Wallet, Asset, Network, Loss Amount, VASP, Deposit Address, Hot Wallet, Hop Distance, Merkle Root) are dynamically bound to the active docket or jury-injected case data.

---

## Proposed Changes

```
demo/chakra_mvp/
├── frontend/
│   ├── src/
│   │   ├── App.tsx                               [MODIFY] Decouple scenario select from trace; manage stage completion states; gate dock buttons; change Stage 5 button color
│   │   ├── services/api.ts                       [MODIFY] Add getPdfBlob() for inline iframe preview
│   │   ├── components/
│   │   │   ├── AttributionGraph.tsx              [MODIFY] Implement Bhedak-style progressive 4-hop synthesis animation
│   │   │   ├── SweepForensicLab.tsx              [MODIFY] Add pre-analysis briefing card with operator execution simulation (1.2s)
│   │   │   ├── ScoringMatrixPanel.tsx            [MODIFY] Add pre-computation card with 4-pillar calculation simulation (1.2s)
│   │   │   ├── StatutoryCourtDocket.tsx          [MODIFY] Add Preview buttons to all 3 PDF cards; wire preview modal
│   │   │   ├── DocumentPreviewModal.tsx          [NEW] Official judicial document preview modal rendering ReportLab PDF iframe
│   │   │   └── Navigation.tsx                    [MODIFY] Lock tabs based on verified stage completion
└── e2e/
    └── chakra.spec.ts                            [MODIFY] Update Playwright E2E suite for strict linear flow and PDF preview
```

---

### Component 1: State Management & Linear Gating in App Core

#### [MODIFY] [App.tsx](file:///demo/chakra_mvp/frontend/src/App.tsx)
- In `handleSelectScenario`:
  - Update `selectedScenario(scenario)` and form fields in `CaseIntakePanel`.
  - **Do NOT** call `api.traceAttribution()`.
  - Reset `activeAttribution` to `null`.
  - Reset all stage completion flags: `isGraphSynthesized = false`, `isSweepAnalyzed = false`, `isScoringComputed = false`.
  - Keep `progress` at initial state (`step1_intake: false`, etc.).
- In `handleRequestTrace` (triggered only by clicking "Execute Automated Attribution"):
  - Call `api.traceAttribution(req)`.
  - Set `activeAttribution = res`.
  - Set `progress.step1_intake = true`.
  - Set `activeTab = "graph"`.
  - Reset downstream completion flags (`isGraphSynthesized = false`, etc.).
- In Stage Action Docks:
  - **Stage 2 Action Dock**: `[Proceed to Stage 3: Sweep Forensics & Fueler Lab]` button is disabled (`disabled={!isGraphSynthesized}`).
  - **Stage 3 Action Dock**: `[Proceed to Stage 4: 4-Pillar Confidence Scorer]` button is disabled (`disabled={!isSweepAnalyzed}`).
  - **Stage 4 Action Dock**:
    - Change button class from `gov-btn-saffron` (orange) to `gov-btn-primary` (black/navy).
    - Disable button when `!isScoringComputed || !isHighConfidence`.
- Add state for `previewModal`: `{ isOpen: boolean, title: string, endpoint: string }`.

#### [MODIFY] [services/api.ts](file:///demo/chakra_mvp/frontend/src/services/api.ts)
- Add `getPdfBlob(endpoint: string, attribution: AttributionResponse): Promise<Blob>` to fetch the raw PDF blob without automatically triggering a browser download, enabling inline iframe preview in the preview modal.

---

### Component 2: Stage 2 Progressive Graph Synthesis (Bhedak Architecture)

#### [MODIFY] [AttributionGraph.tsx](file:///demo/chakra_mvp/frontend/src/components/AttributionGraph.tsx)
- Add Cytoscape stylesheet entry:
  ```css
  {
    selector: ".staged-hidden",
    style: {
      display: "none"
    }
  }
  ```
- Implement `handleSynthesizeGraph()`:
  1. Mount Cytoscape canvas and immediately assign `.staged-hidden` to all nodes and edges.
  2. **Stage 1 (0ms)**: Reveal Suspect Seed Wallet (`node_type === "SUSPECT_WALLET"`). Telemetry: `"⚡ [Stage 1/4] Ingesting Target Suspect Seed Wallet on {network} ledger..."`. Focus camera on suspect node.
  3. Delay 450ms.
  4. **Stage 2 (+450ms)**: Sequentially reveal intermediate peel-chain mule wallets (`node_type === "INTERMEDIARY_UNHOSTED"`) and connected edges. Telemetry: `"⚡ [Stage 2/4] Traversing unhosted peel-chain intermediary mule wallets via Degree-Bounded Beam Search..."`.
  5. Delay 450ms.
  6. **Stage 3 (+450ms)**: Reveal candidate VASP deposit address (`node_type === "CANDIDATE_DEPOSIT"`) and incoming edges. Telemetry: `"⚡ [Stage 3/4] Candidate VASP Inflow Deposit Address identified with high concentration index..."`.
  7. Delay 450ms.
  8. **Stage 4 (+450ms)**: Reveal attributed VASP hot wallet (`node_type === "VASP_HOT_WALLET"`) and dashed internal sweep edge. Telemetry: `"✓ [Stage 4/4] Automated Sweep Heuristic Confirmed! 100% balance swept into {nearest_vasp} Hot Wallet ({confidence_score}% Confidence)."`.
  9. Remove `.staged-hidden` from all elements.
  10. Call `cy.animate({ fit: { eles: cy.elements(), padding: 35 }, duration: 350 })`.
  11. Set `isSynthesized(true)` and notify parent callback `onGraphSynthesized()`.

---

### Component 3: Stage 3 & Stage 4 Operator Simulation & Dynamic Data

#### [MODIFY] [SweepForensicLab.tsx](file:///demo/chakra_mvp/frontend/src/components/SweepForensicLab.tsx)
- Add `isAnalyzed` prop / internal state.
- When `!isAnalyzed`:
  - Render pre-analysis execution card:
    - Title: **"Stage 3: Centralized Exchange Sweep & Fueler Forensics Awaiting Execution"**
    - Status Badge: `AWAITING OPERATOR DIRECTIVE`
    - Summary Grid: Target Case Docket, Attributed VASP, Network, Hop Distance.
    - Execution Button: **`[⚡ Execute Omnibus Sweep & Gas Fueler Forensics]`**.
  - On click, execute a 1.2s simulation displaying progressive forensic tickers:
    - `0ms`: `[1/3] Querying on-chain internal transfer logs for deposit forwarder...`
    - `450ms`: `[2/3] Matching exchange gas-fueler sponsor address and sweep script hash...`
    - `900ms`: `[3/3] Verifying 100% zero-remainder balance consolidation within 34-minute window...`
    - `1200ms`: Reveal complete forensic view (4 summary cards, balance sweep ratio, latency, gas fueler calldata, statutory BSA preview).
    - Call `onAnalysisComplete()` to enable Proceed to Stage 4.

#### [MODIFY] [ScoringMatrixPanel.tsx](file:///demo/chakra_mvp/frontend/src/components/ScoringMatrixPanel.tsx)
- Add `isComputed` prop / internal state.
- When `!isComputed`:
  - Render pre-computation card:
    - Title: **"Stage 4: Mathematical Admissibility Scorer Awaiting Calculation"**
    - Status Badge: `AWAITING MATHEMATICAL AUDIT`
    - Summary Grid: Case Docket, Attributed VASP, Hop Count, Target Network.
    - Action Button: **`[⚡ Compute 4-Pillar Mathematical Admissibility Score]`**.
  - On click, execute a 1.2s computation simulation displaying progressive calculation tickers:
    - `0ms`: `[Pillar 1/4] Evaluating Infrastructure & Cluster Match (Hot Wallet & Gas Sponsor)...`
    - `400ms`: `[Pillar 2/4] Evaluating Omnibus Sweep Consistency & Zero-Remainder Pattern...`
    - `800ms`: `[Pillar 3/4] Calculating Proximity Decay Penalty e^(-0.25 * hops)...`
    - `1200ms`: `[Pillar 4/4] Calculating Volume Continuity & Peeling Ratio...`
    - `1400ms`: Reveal score gauge (e.g. 94.0/100 Tier 1), statutory action guidance, and 4-pillar breakdown table.
    - Call `onScoringComplete()` to enable Proceed to Stage 5.

---

### Component 4: Stage 5 Document Preview Modal & Dynamic Report Exports

#### [NEW] [DocumentPreviewModal.tsx](file:///demo/chakra_mvp/frontend/src/components/DocumentPreviewModal.tsx)
- Official law enforcement modal component:
  - Header: Document Title, Case Reference, "OFFICIAL JUDICIAL COPY • NON-EDITABLE PDF".
  - Action buttons: Print, Download PDF, Close.
  - Body:
    - Renders `<iframe src={blobUrl} style={{ width: "100%", height: "680px", border: "1px solid #CBD5E1", borderRadius: "6px" }} />`.
    - Includes loading spinner during ReportLab compilation and fallback download link if browser PDF embedding is restricted.

#### [MODIFY] [StatutoryCourtDocket.tsx](file:///demo/chakra_mvp/frontend/src/components/StatutoryCourtDocket.tsx)
- In the 3 certified PDF export cards:
  - Card 1: **Executive Attribution Dossier**
  - Card 2: **Section 94 BNSS Summons**
  - Card 3: **BSA 63(4) Evidence Certificate**
- Add a two-button action cluster to each card:
  - **`[Preview Document]`** (`gov-btn-outline` with `Eye` icon) $\rightarrow$ opens `DocumentPreviewModal` with live PDF stream.
  - **`[Download PDF]`** (`gov-btn-primary` or themed outline with `Download` icon) $\rightarrow$ triggers direct browser file download.
- Ensure all case metadata shown in Stage 5 dynamically binds to `attribution` without hardcoded fallback strings.

---

## Adversarial Claude Council Hardening (claude-council)

```
================================================================================
           THE CLAUDE COUNCIL: 5-ADVISOR ADVERSARIAL GOVERNANCE REPORT
================================================================================
```

### 1. The Contrarian (`01-contrarian`)
- **Challenge**: *"If the operator selects a scenario, navigates through Stages 1-5, and then goes back to Stage 1 to select another scenario, will stale stage data or completed flags linger in memory?"*
- **Mitigation**: Selecting a new scenario in Stage 1 or calling reset immediately purges `activeAttribution`, resets all 3 completion flags (`isGraphSynthesized = false`, `isSweepAnalyzed = false`, `isScoringComputed = false`), and resets `progress` to `INITIAL_PROGRESS`. All downstream stages automatically lock and revert to their pre-execution briefing cards.

### 2. The First-Principles Engineer (`02-first-principles`)
- **Challenge**: *"Is the Cytoscape progressive synthesis doing heavy layout re-computations on each hop, causing canvas jitter or zoom blowout?"*
- **Mitigation**: No. Just like Bhedak MVP, all nodes and edges are pre-positioned with preset coordinates. Elements simply transition from `.staged-hidden` to visible. The camera remains stable and smoothly animates to `fit` only upon the final hop.

### 3. The Expansionist (`03-expansionist`)
- **Challenge**: *"Can the Document Preview modal handle both local ReportLab binaries and remote cloud PDF storage in future production deployments?"*
- **Mitigation**: The `api.getPdfBlob()` abstraction operates on standard `Blob` streams over HTTP/HTTPS, seamlessly supporting either local FastAPI byte buffers or signed S3/GCS URLs.

### 4. The Naive Outsider (`04-outsider`)
- **Challenge**: *"Why were some buttons orange while others were navy? Can an officer immediately tell which button moves the investigation forward?"*
- **Mitigation**: All linear workflow progression buttons are standardized to `gov-btn-primary` (deep navy `#0B1B3D` / `#0F2942`) with standard right arrows. Only specialized statutory warnings or primary creation triggers use saffron accent styling.

### 5. The Pragmatic Executor (`05-executor`)
- **Challenge**: *"What if the browser blocks PDF iframe rendering due to X-Frame-Options or missing PDF plugins?"*
- **Mitigation**: The FastAPI backend serves PDFs with `media_type="application/pdf"` and permissive local CORS/headers. Additionally, `DocumentPreviewModal` includes an explicit "Download / Open in New Window" fallback link.

### Council Verdict
**`APPROVED WITH HARDENING`**

---

## Verification Plan

### Automated Tests
1. **TypeScript Typecheck**:
   ```bash
   npx tsc --noEmit
   ```
2. **Playwright E2E Test**:
   ```bash
   npx playwright test e2e/chakra.spec.ts
   ```
   - Verifies that selecting a scenario in Stage 1 does NOT open Stage 2.
   - Verifies that Stage 2 requires explicit graph synthesis before Proceed to Stage 3 is enabled.
   - Verifies that Stage 2 synthesis displays progressive hop reveal.
   - Verifies that Stage 3 requires operator sweep forensics analysis before Proceed to Stage 4 is enabled.
   - Verifies that Stage 4 requires 4-pillar score calculation before Proceed to Stage 5 is enabled, and that the button is styled `gov-btn-primary`.
   - Verifies that Stage 5 document preview opens the modal and downloads trigger successfully.
3. **Backend Test Suite**:
   ```bash
   pytest demo/chakra_mvp/backend/tests -v
   ```
4. **Pre-Commit Zero-Secret Shield**:
   ```bash
   npm run check:secrets:staged
   ```

### Manual Verification
- Verify in the browser at `http://localhost:5173/` that selecting a scenario from the dropdown updates the inputs without advancing tabs.
- Run the full 5-stage pipeline and confirm each stage's operator simulation and linear progression locks.
- Preview all 3 PDFs in Stage 5 and confirm proper rendering, real statutory syntax, and dynamic case data.
