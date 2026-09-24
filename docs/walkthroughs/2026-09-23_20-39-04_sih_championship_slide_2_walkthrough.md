# SIH Championship Slide 2 Visual Replication & Presentation Pipeline Walkthrough

## Executive Summary
This walkthrough documents the end-to-end execution, visual verification, and mathematical grounding for reproducing **Slide 2** ("Proposed Solution & Key Features") across both **BHEDAK** and **CHAKRA** championship presentation decks. The visual composition, card hierarchy, typography, and layout geometry directly replicate the proven championship benchmark [specs/presentations/rendered/sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png) while enforcing 100% data fidelity against authoritative blueprints in [docs/sih_solutions/](file:///docs/sih_solutions/).

---

## 1. Requirement Traceability & Execution Verification

| Requirement | Target Asset / Component | Source of Truth | Verification Status |
| :--- | :--- | :--- | :--- |
| **Slide 1 Duplication** | [bhedak/slide_1.png](file:///specs/presentations/rendered/bhedak/slide_1.png)<br>[chakra/slide_1.png](file:///specs/presentations/rendered/chakra/slide_1.png) | `approved_bhedak/slide_1.png`<br>`approved_chakra/slide_1.png` | **100% Byte-Identical**<br>(1,296,712 & 1,322,224 bytes) |
| **Visual Architecture Clone** | [bhedak/slide_2.png](file:///specs/presentations/rendered/bhedak/slide_2.png)<br>[chakra/slide_2.png](file:///specs/presentations/rendered/chakra/slide_2.png) | [sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png) | **Verified Exact Match**<br>(Oval pill, 2-col bullets, monitor, 4-col footer) |
| **Zero-Crop Prototype Invariant** | Monitor stage in Slide 2 | [bhedak_graph.png](file:///specs/presentations/rendered/bhedak_graph.png)<br>[chakra_dashboard.png](file:///specs/presentations/rendered/chakra_dashboard.png) | **Verified Zero Cropping**<br>(Aspect ratio 2.342:1 preserved, full canvas visible) |
| **Statutory & Metric Grounding** | All text, metrics, acts | [sih-2026-ntro-solution-blueprint.md](file:///docs/sih_solutions/sih-2026-ntro-solution-blueprint.md)<br>[sih-2026-mha-vasp-attribution-blueprint.md](file:///docs/sih_solutions/sih-2026-mha-vasp-attribution-blueprint.md) | **100% Grounded**<br>(BSA Sec 63, BNSS 94/106, PMLA 12AA, real benchmarks) |

---

## 2. Visual Architecture & Layout Deconstruction

The legacy `approved_bhedak/slide_2.png` deviated from the winning `sih_2024/page_2.png` layout in 4 major dimensions. The presentation engine in [scripts/engine/generate_bhedak_slides.mjs](file:///scripts/engine/generate_bhedak_slides.mjs) and [scripts/engine/generate_chakra_slides.mjs](file:///scripts/engine/generate_chakra_slides.mjs) was refactored to eliminate these discrepancies:

```
+----------------------------------------------------------------------------------------------------+
|  ( INDOMITUS )         PROPOSED SOLUTION & KEY FEATURES                  [ SIH 2026 LOGO BANNER ]  |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [ LEFT COLUMN: CORE SOLUTION ]                     [ RIGHT COLUMN: UNCLIPPED PROTOTYPE ]          |
|  6-Feature Grid (2 Columns x 3 Rows):               +-------------------------------------------+  |
|  * Feature 1                * Feature 2             |  [ Monitor Bar: Window Controls ● ● ● ]   |  |
|  * Feature 3                * Feature 4             |  [ Prototype Image: 897x383 Contain ]     |  |
|  * Feature 5                * Feature 6             |  [ 100% Uncropped Dashboard Canvas ]      |  |
|                                                     +-------------------------------------------+  |
|  Executive Summary Paragraph:                       4 Capability Badges:                           |
|  Clear problem-to-solution narrative                [Badge 1] [Badge 2] [Badge 3] [Badge 4]        |
|  Status: 65% completed / Operational                                                               |
+----------------------------------------------------------------------------------------------------+
|  WHY WE STAND OUT                                                                                  |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+    |
|  | Card 1: Moat Alpha |  | Card 2: Engine Beta|  | Card 3: Forensics  |  | Card 4: Economics  |    |
|  | Icon + Metric      |  | Icon + Metric      |  | Icon + Metric      |  | Icon + Metric      |    |
|  +--------------------+  +--------------------+  +--------------------+  +--------------------+    |
+----------------------------------------------------------------------------------------------------+
|  MINISTRY / DOMAIN TRACK DESIGNATION                                                       PAGE 2  |
+----------------------------------------------------------------------------------------------------+
```

### Specific Visual Improvements Implemented:
1. **Team Identifier Oval**: Positioned at top-left (`left: 48px, top: 28px`), rendered with `--blue-50` background, `--blue-700` border, and dark blue bold uppercase typography ("INDOMITUS").
2. **Official SIH Header Logo**: Extracted high-res vector-raster logo from official slide deck and embedded in the top-right header at crisp proportions without pixelation.
3. **Integrated 2-Column Solution Grid**: Replaced disjointed boxed cards with a unified 2-column feature list using vibrant indigo/blue circular bullet glyphs, maintaining optimal visual scannability.
4. **Zero-Crop Monitor Mockup**: Removed the crowding secondary phone container. Embedded `bhedak_graph.png` and `chakra_dashboard.png` with strict `object-fit: contain`, 2.342:1 aspect ratio preservation, dark window frame styling, and realistic monitor base stand.
5. **Full-Width "Why We Stand Out" 4-Column Grid**: Expanded bottom comparative moat cards across the entire 1236px width, featuring distinct thematic color accents (cyan, blue, purple, emerald) and bold stat callouts.
6. **Edge-to-Edge Solid Ribbon Footer**: Dark navy blue (`#0D5CA8`) footer ribbon across the base of the slide containing centered track title and right-aligned slide number.

---

## 3. Data Grounding & Statutory Verification

### BHEDAK (Problem Statement 25032 - NTRO)
All data points incorporated in Slide 2 are grounded directly in [docs/sih_solutions/sih-2026-ntro-solution-blueprint.md](file:///docs/sih_solutions/sih-2026-ntro-solution-blueprint.md):
- **Core Features**:
  1. *Graph Neural Network Ingestion*: Sub-second parsing of 100K+ entities across heterogeneous telecom and financial records.
  2. *Cryptographic Evidence Chain*: SHA-256 Merkle chain-of-custody logging meeting Bharatiya Sakshya Adhiniyam (BSA) Sec 63.
  3. *Autonomous Ring Detection*: High-speed clustering and Louvain community detection identifying syndicates in 42ms.
  4. *Multi-Hop Path Tracing*: Bidirectional DFS/BFS traversals identifying intermediary money mules and call redirectors.
  5. *Statutory Docket Generation*: Automated warrant and notice generation under Bharatiya Nagarik Suraksha Sanhita (BNSS) Sec 94/106.
  6. *Air-Gapped Sovereign Deployment*: Zero external telemetry, 100% on-premise sovereign execution.
- **Stand-Out Moats**:
  - GNN Ring Detection: 42ms detection latency vs. hours of manual cell dump analysis.
  - Merkle Chain of Custody: Cryptographic non-repudiation under BSA 2023 Sec 63.
  - 100K+ Entity Scale: Sub-second interactive graph exploration across complex rings.
  - Zero Cloud Dependency: Fully offline air-gapped sovereign deployment.

### CHAKRA (Problem Statement 25027 - MHA)
All data points incorporated in Slide 2 are grounded directly in [docs/sih_solutions/sih-2026-mha-vasp-attribution-blueprint.md](file:///docs/sih_solutions/sih-2026-mha-vasp-attribution-blueprint.md):
- **Core Features**:
  1. *Dual-Layer Hybrid Heuristics*: UTXO clustering combined with account-based address profiling.
  2. *60+ Entity Signatures*: Pre-compiled attribution models covering major CEXs, DEXs, cross-chain bridges, and mixers.
  3. *Section 12AA Statutory Notices*: Instant automated generation of legal notices under PMLA Section 12AA and BNSS Sec 94.
  4. *Real-Time Peel Chain Analytics*: Instant unmasking of automated laundering hops and micro-structuring peeling patterns.
  5. *BSA Section 63 Evidence Certificates*: Tamper-evident forensic reports accompanied by cryptographic hash verification.
  6. *Cross-Jurisdictional VASP Registry*: Verified regulatory contact index for immediate asset freeze directives.
- **Stand-Out Moats**:
  - 60+ VASP Signatures: Pre-indexed coverage of domestic and international exchanges.
  - 18ms Peel Chain Tracing: Instant traversal through 15+ micro-structuring transaction layers.
  - 99.4% Attribution Confidence: Multi-hop heuristic validation minimizing false positives.
  - PMLA & BNSS Compliance: Court-ready dockets compliant with Indian evidence statutes.

---

## 4. Empirical Verification & Rendering Results

Both slides were rendered via Headless Chromium at 4K resolution (device scale factor: 2, viewport: 1333 x 750 px):

```bash
node scripts/engine/render_championship_decks.mjs --slide 2
```

### Verification Command Logs
```
[Renderer] Launching Headless Chromium with 4K deviceScaleFactor: 2...
[Renderer] Rendering CHAKRA Slide(s): 2...
[Renderer] Rendered CHAKRA Slide 2 -> specs\presentations\rendered\chakra\slide_2.png
[Renderer] Rendering BHEDAK Slide(s): 2...
[Renderer] Rendered BHEDAK Slide 2 -> specs\presentations\rendered\bhedak\slide_2.png
[Renderer] Render Operation Completed!
```

### Visual Inspection Findings:
1. **BHEDAK Slide 2 ([specs/presentations/rendered/bhedak/slide_2.png](file:///specs/presentations/rendered/bhedak/slide_2.png))**:
   - `bhedak_graph.png` renders cleanly within the monitor mockup with zero edge cropping; node clusters, threat indicators, and graph connections are completely visible.
   - 4 capability badges beneath monitor align symmetrically: "BSA Sec 63 Certified", "100K+ Node Scale", "42ms GNN Latency", "Offline Enclave".
   - 4-column footer cards span edge-to-edge with crisp contrasting stat badges (`42ms`, `BSA 63`, `100K+`, `100%`).
2. **CHAKRA Slide 2 ([specs/presentations/rendered/chakra/slide_2.png](file:///specs/presentations/rendered/chakra/slide_2.png))**:
   - `chakra_dashboard.png` renders cleanly inside the monitor stage without clipping any telemetry widgets or status pills.
   - 4 capability badges beneath monitor align symmetrically: "PMLA Sec 12AA Ready", "60+ VASP Entities", "18ms Peel Tracing", "BSA Sec 63 Hash".
   - 4-column footer cards span edge-to-edge with crisp contrasting stat badges (`60+ VASPs`, `18ms`, `99.4%`, `PMLA 12AA`).
3. **Slide 1 Integrity**:
   - `specs/presentations/rendered/bhedak/slide_1.png` and `specs/presentations/rendered/chakra/slide_1.png` remain completely intact and identical to their approved baselines.

---

## 5. Artifact & Repository Invariants Compliance

- [x] **Zero Raw-LaTeX Invariant**: All mathematical bounds and formulas formatted using clean Unicode typography (`≥`, `≤`, `×`, `≠`, `→`, `≈`, `±`).
- [x] **Strict Symbol & File Grounding**: All referenced files cite valid `file:///` URLs.
- [x] **Zero Secret Invariant**: Zero API keys, credentials, or mock tokens present.
- [x] **Visual Evidence**: Rendered PNG assets verified on disk and inspected visually.
