# SIH Championship Deck Walkthrough: Slide 3 Directed Graph Workflow & Automated Layout Guard

## Executive Summary
This document records the visual perfection, architectural hardening, root cause post-mortem, and automated pre-flight testing guard for **Slide 3 ("TECHNICAL APPROACH")** across both **Project BHEDAK** and **Project CHAKRA**.

---

## 1. Technical Root Cause Analysis: Why Previous Iterations Failed

### The 4 Interlocking Failure Modes
1. **CSS Box-Model vs. Directed Graph Architectural Bias**:
   - Web layout primitives naturally bias towards CSS Flexbox and Grid rectangular cards. When an agent receives instructions to create a "solution workflow", the LLM tends to emit familiar 3-column or 4-column card matrices with bullet points.
   - Without an explicit directed graph contract enforcing sequential node stages (`Node 01 ➔ Node 02 ➔ Node 03`), the agent fell into the "card-grid trap", creating disconnected cards rather than an end-to-end operational pipeline.
2. **Text-Dumping & Font-Compression Reflex**:
   - In attempting to convey comprehensive technical depth (NTRO statutory mandates, multi-hop Rust tracing, BSA 2023 evidentiary standards), multi-line paragraphs were crammed into fixed-height containers.
   - When containers became cramped, font sizes were reduced to 9.5px - 10px to prevent overflow, violating enterprise legibility standards.
3. **The "Exit Code 0" Tooling Illusion**:
   - Headless Chromium screenshots executed via Playwright (`page.setContent` followed by `page.screenshot`) always return exit code `0` even if text is clipped, overlapping, or rendered at 8px.
   - Previous agent loops treated exit code 0 as a certificate of success, bypassing the mandatory multimodal visual inspection (`view_file`).
4. **Connector Geometry Collisions**:
   - Attempting to place text labels (`ORIGIN IP`, `SEC 193 BNSS`) inside narrow connector columns (32px - 38px) caused label clipping against card borders. The transition metadata belongs cleanly in internal card hand-off bars, leaving connector columns dedicated to crisp, circular directional badges.

---

## 2. Permanent Structural Safeguards: Ensuring Zero Recurrence

To prevent these defects from ever recurring in any future slide or phase, three layers of fail-closed enforcement were engineered into the workspace:

### Layer 1: Automated Layout, Typography, & Geometry Pre-Flight Validator
Integrated directly into [scripts/engine/render_championship_decks.mjs](file:///scripts/engine/render_championship_decks.mjs):
```javascript
// Automated DOM Geometry & Typography Pre-Flight Gate
await validateSlideLayout(page, deck, slideNumber);
```
- **Overflow Gate**: Evaluates `scrollHeight > clientHeight + 4` and `scrollWidth > clientWidth + 4` on all cards and containers.
- **Typography Floor**: Scans all DOM text nodes to ensure computed `font-size ≥ 10.5px` for micro-pills and `≥ 12px` for all body descriptions.
- **Pipeline Integrity**: Verifies that Slide 3 contains the required number of directed workflow nodes (≥ 6 for Bhedak, ≥ 8 for Chakra), the inter-row directional bridge, and all 4 tech stack subsystem cards.
- **Fail-Closed Execution**: If any assertion fails, rendering is immediately aborted with exit code `1`, printing the exact violating element and computed geometry.

### Layer 2: Master NPM Test Command
Added to [package.json](file:///package.json):
```bash
npm run test:slides -- --slide 3
```
Allows human operators and autonomous CI pipelines to assert geometry, typography, and pipeline validity in under 3 seconds.

### Layer 3: Workspace Operational Directives & Invariants
Codified permanently into [AGENTS.md](file:///AGENTS.md#L272) (Section 18) and [GEMINI.md](file:///GEMINI.md#L25) (Rule 16):
- **Authentic Directed Pipeline Mandate**: Complex technical workflows must model true directed graph pipelines with sequential node stages, explicit RBAC cadres, cross-row bridges, and statutory court deliverables.
- **Dedicated Tech Stack Separation**: Architecture and library chips reside in a dedicated bottom ribbon (~20% vertical space), preserving ~65% for the directed graph.
- **Absolute Legibility**: Body text ≥ 12px, headers ≥ 15px bold, badges ≥ 11px bold, high contrast foreground/background.
- **Mandatory Multimodal Pre-Flight Verification**: Agents must inspect the rendered 4K PNG using `view_file` before completing any turn.

---

## 3. Final Slide 3 Architecture & RBAC Specifications

### BHEDAK Slide 3 (6-Node Directed Graph + 4-Domain Tech Stack)
- **Row 1 (Ingestion & AI Attribution Core)**:
  - **Node 01 (Starting Point)**: Darknet & Surface Ingestion (15+ markets, Tor SOCKS5, Pastebin dumps, Telegram MTProto). Hand-off: Raw .onion HTML Dumps & Chat Streams ➔.
  - **Connector ➔**
  - **Node 02 (NTRO Cadre 1)**: Scientist 'D' CITC (Lawful Ingestion Custodian - Sec. 63(4)(a) BSA 2023) with Tab 1: Crawler, Tab 2: Infra Audit, Tab 3: Custodian. Hand-off: Origin IP: 103.152.18.42 + Part A Cert ➔.
  - **Connector ➔**
  - **Node 03 (AI Core)**: Multi-Market Graph & AI Stylometry (Neo4j alias binding, Siamese RoBERTa/IndicBERT, diurnal sleep trough inference). Attribution Output: Unified Entity Graph + 0.65 Max AI Cap Bound.
- **Inter-Row Process Bridge**:
  - `▼ ENRICHED INTELLIGENCE DISPATCHED TO FORENSIC LABORATORY, EXECUTIVE SANCTION & JUDICIAL PROSECUTION ▼`
- **Row 2 (Forensics, Executive Sanction & Statutory Trial)**:
  - **Node 04 (NTRO Cadre 2)**: Scientist 'E' NICRD/NCIIPC (Technical Forensic Expert - Sec. 63(4)(b)-(c) BSA 2023) with Tab 1: Graph Canvas, Tab 2: Stylometry, Tab 3: Part B HSM. Hand-off: Forensic Dossier + Part B HSM Seal ➔.
  - **Connector ➔**
  - **Node 05 (NTRO Cadre 3)**: Scientist 'G' Director (Statutory Dissemination Authority - Sec. 70A IT Act 2000) with Tab 1: Review, Tab 2: STIX 2.1 Gate, Tab 3: Court Release. Hand-off: Case File for Cyber Court Filing ➔.
  - **Connector ➔**
  - **Node 06 (Statutory Trial)**: Court Evidence Package (Special Cyber Court - BSA 2023 Sec 63 Dual-Signed Electronic Certificate, FIPS 140-3 HSM Root of Trust, BNSS Sec 193/207 compliance). Judicial Outcome: 100% Admissible Evidence • Instant Judicial Conviction.
- **Section 02 (Production Architecture & Tech Stack)**:
  - 4 Domains: Distributed Crawler Fleet (NIC MeghRaj), Air-Gapped Backend Enclave (MeghRaj SCIF), AI Stylometry & NLP Lab (0.65 AI Cap), Sovereign Security & LEA Portals (Sec 63 BSA).

---

### CHAKRA Slide 3 (8-Stage Directed Graph + 4-Domain Tech Stack)
- **Row 1 (Citizen Ingestion ➔ IO ➔ Rust Engine ➔ Forensic Cell)**:
  - **Node 01 (Ingestion)**: Citizen FIR & 1930 Ingestion (NCRP Portal, ₹45L loss victim complaint, UPI-to-crypto link, canonical UTDM event stream).
  - **Connector ➔**
  - **Node 02 (MHA Tier 1)**: Investigating Officer (Case IO - Cyber Police Station) with Tab 1: 1930 Intake, Tab 2: Seed Tagger, Tab 3: Sec 94 BNSS summons. Hand-off: Tagged Seed Wallet ➔ Triggers Auto-Trace.
  - **Connector ➔**
  - **Node 03 (Engine Core)**: Multi-Chain Tracing Engine (Zero-Allocation Rust BFS, Java-Tron gRPC, 4-pillar math score). Attribution: Isolates Binance Hot Wallet 14 (96.4% Conf) ➔.
  - **Connector ➔**
  - **Node 04 (MHA Tier 2)**: Forensic Investigator (Inspector - Cyber Crime Cell / FSL) with Tab 1: Peel Tree, Tab 2: VASP Dir, Tab 3: Explainer. Hand-off: Attributed VASP Hot-Wallet Dossier ➔ SP.
- **Inter-Row Process Bridge**:
  - `▼ ATTRIBUTED VASP TARGET DISPATCHED TO SUPERVISORY SANCTION, EXCHANGE DESK & NCFL FORENSIC LAB ▼`
- **Row 2 (Sanction ➔ Exchange Desk ➔ NCFL Forensics ➔ Capital Restitution)**:
  - **Node 05 (MHA Tier 3)**: Supervisory Sanction SP (DySP/ACP/SP - Sec 78 IT Act 2000) with Tab 1: Audit, Tab 2: Orders, Tab 3: Sahyog API. Hand-off: Dispatches Sec 106/107 Freeze in <8 Mins ➔.
  - **Connector ➔**
  - **Node 06 (MHA Tier 4)**: VASP Compliance Desk (CoinDCX/Binance Desk) with Tab 1: Inbox, Tab 2: Lock, Tab 3: KYC. Hand-off: Assets Frozen + Compliance Receipt ➔.
  - **Connector ➔**
  - **Node 07 (MHA Tier 5)**: Forensic Attestation & CTI (State FSL Scientist + I4C Threat Analytics Unit) with Tab 1: RPC Audit, Tab 2: Part B Cert, Tab 3: Cross-FIR. Hand-off: Sec 63 BSA Hash Lock + Multi-State Link ➔.
  - **Connector ➔**
  - **Node 08 (Judicial Trial)**: Trial & Capital Restitution (Special Cyber Court - BSA 2023 Sec 63 & BNSS 107 Restitution, direct victim bank refund). Judicial Outcome: Capital Restitution + Instant Conviction.
- **Section 02 (Production Architecture & Tech Stack)**:
  - 4 Domains: Multi-Chain Ingest & Streams (10,000 TX/S), Air-Gapped Backend Enclave (MeghRaj SCIF), Graph Intelligence & Scoring (<180S Search), Sovereign Security & LEA Portals (BNSS 106/107).

---

## 4. Verification & Inspection Proof

### Headless Chromium 4K Execution
```bash
npm run test:slides -- --slide 3
```
- **Exit Code**: `0`
- **Chakra Slide 3**: `[Pre-Flight PASS] CHAKRA Slide 3 passed geometry, typography, and pipeline assertions.`
- **Bhedak Slide 3**: `[Pre-Flight PASS] BHEDAK Slide 3 passed geometry, typography, and pipeline assertions.`

### Rendered Artifacts (Clickable)
- [specs/presentations/rendered/bhedak/slide_3.png](file:///specs/presentations/rendered/bhedak/slide_3.png)
- [specs/presentations/rendered/chakra/slide_3.png](file:///specs/presentations/rendered/chakra/slide_3.png)
