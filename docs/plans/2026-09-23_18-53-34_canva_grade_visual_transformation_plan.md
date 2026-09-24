# Implementation Plan: Canva-Grade Visual Transformation for BHEDAK & CHAKRA Presentations

Transform the presentation slides for **Project BHEDAK (NTRO)** and **Project CHAKRA (MHA I4C)** from repetitive rounded text cards into true, high-density, Canva-level visual deliverables that achieve aesthetic and structural parity with the reference winner presentation ([sih_2024.pdf](file:///specs/presentations/rendered/sih_2024/page_3.png)).

---

## 1. Forensic Visual Disparity Audit: `sih_2024/page_3.png` vs. Current Slides

A rigorous computer-vision and structural inspection of [sih_2024/page_3.png](file:///specs/presentations/rendered/sih_2024/page_3.png) versus [bhedak/slide_3.png](file:///specs/presentations/rendered/bhedak/slide_3.png) and [chakra/slide_3.png](file:///specs/presentations/rendered/chakra/slide_3.png) reveals why previous iterations failed:

| Dimension | `sih_2024/page_3.png` (Reference Winner) | Current `bhedak/slide_3.png` (Flawed) | Root Cause & Required Fix |
|---|---|---|---|
| **Slide Layout Paradigm** | **Full-bleed unified infographic** covering 100% of the canvas; zero wasted space. | Split 50/50: 4 plain rounded white boxes with bullet text on left, dark image on right. | **Fatal Paradigm Defect**: Eliminate the 4-box text layout. Transform the entire slide into a single cohesive end-to-end dataflow architecture diagram. |
| **Data Flow & Interconnects** | Numbered circular nodes (1 to 9) with explicit directional arrows tracing data movement from physical actor to API gateway to DB to AI to UI. | 4 vertical columns with generic boxes labeled "ENGINE 1", "ENGINE 2" with zero interconnecting arrows. | **Lack of Flow**: Draw explicit SVG directional dataflow pipelines connecting Ingestion → Normalization → Graph/AI Engine → Analyst Console → Statutory Egress. |
| **Real Demo UI Integration** | Real 3D Desktop Monitor Mockup (React, Shadcn UI) + Real Mobile App Mockup (Flutter). | No UI screen insets whatsoever; only text labels inside dark cards. | **Missing Evidence**: Embed real captured screenshots (`bhedak_real_graph.png`, `bhedak_real_dashboard.png`, `chakra_real_dashboard.png`) inside crisp desktop/monitor frames. |
| **Technology Logos** | 18+ official tech logos (Docker, Kafka, Timescale, Postgres, React, TypeScript, Flutter, Python, TensorFlow). | Text strings ("Python 3.12, Neo4j, PyTorch") typed inside plain cards. | **Text vs. Visuals**: Embed official vector SVG logos for Python, Tor, Neo4j, PyTorch, Docker, React, TypeScript, Kafka, Redis, Bitcoin, Tron. |
| **Aesthetic Polish** | Canva/Figma gradient fills, subtle drop shadows, pastel category badges, and micro-illustrations. | Stiff, flat matplotlib/PPTX rectangular cards with harsh borders. | **Renderer Defect**: Switch diagram generation to HTML5/CSS/SVG rendered via Headless Playwright at 4K Retina resolution (`deviceScaleFactor: 2`). |

---

## 2. Multi-Persona Execution Strategy (Rule 15 Lifecycle)

1. 📋 **`[Product Manager]`**:
   - Scope: Complete overhaul of visual assets for both BHEDAK and CHAKRA decks (Slides 1 to 6).
   - Strict Invariant: Preserve official SIH 2025 presentation requirements, slide counts (6 slides), titles, and 100% factual fidelity to [docs/sih_solutions/](file:///docs/sih_solutions/).
   - Acceptance Criteria: Slide 3 must be a full-bleed architecture infographic; Slide 2 must showcase real working demo dashboards; zero repetitive rounded text boxes; zero bottom-left green card on Slide 1.
2. 📐 **`[System Architect]`**:
   - Architecture: HTML5 + CSS Grid / Flexbox + SVG vector canvas template engine rendered to PNG via Playwright Chromium at 2400×1350 with Retina 2× scaling.
   - Layout Hierarchy:
     - Slide 1: High-impact Title Slide with SIH lightbulb watermark and verified Ministry metadata.
     - Slide 2: Hero Solution Overview with Real Desktop UI Monitor Mockup, live feature badges, and 4 differentiator cards.
     - Slide 3: Full-Bleed Technical Approach Infographic (Ingestion Cluster → Analysis Core → Real Console Inset → Statutory Egress).
     - Slide 4: Feasibility & Viability with custom icon badges, real market chart, and 3 concrete engineering challenge/mitigation pairs.
     - Slide 5: Chronological Incident Flow (4-step comic journey with avatars, callouts, and arrows) + SDG/National alignment.
     - Slide 6: Research, References & Live Verification Proof with clickable links and proof metrics.
3. 🛑 **`[Adversarial SDET]`**:
   - Red-Phase Acceptance Criteria: Verify that Slide 3 contains ≥ 8 vector tech logos, ≥ 4 directional pipeline arrows, and a real embedded screenshot.
   - Assert with Headless Playwright that all rendered PNG slides are 200+ DPI, free of overlapping text nodes, and conform to 16:9 geometry without clipping.
4. 💻 **`[Core Engineer]`**:
   - Develop `scripts/engine/generate_canva_infographics.cjs` using HTML/CSS/SVG + Playwright to compile the 4K slide infographics.
   - Update `scripts/engine/generate_championship_decks.py` to position full-bleed visual assets seamlessly onto the slides.
   - Run `scripts/engine/export_championship_decks.py` to produce final PPTX, PDF, and high-DPI PNGs.
5. 🔬 **`[Mutation & Security Auditor]`**:
   - Factual Verification: Cross-reference every entity, protocol, and statute against [sih-2026-ntro-solution-blueprint.md](file:///docs/sih_solutions/sih-2026-ntro-solution-blueprint.md) and [sih-2026-mha-vasp-attribution-blueprint.md](file:///docs/sih_solutions/sih-2026-mha-vasp-attribution-blueprint.md).
   - Zero Hallucination & Zero Secrets: Validate zero synthetic tokens, 100% verified dependencies, and zero fake claims.
6. 📑 **`[Technical Writer]`**:
   - Update `review_decks.html`, synchronize brain plans to `docs/plans/` using `SpecSync`, and emit the verified `SquadAttestor` receipt.

---

## 3. Mandatory Adversarial Claude Council Hardening (Rule 10)

| Council Advisor | Unaligned Perspective & Critique | Concrete Hardening Mitigation Applied |
|---|---|---|
| **01-Contrarian** | *"Slides are often dismissed as 'just diagrams'. If evaluators suspect the architecture is mock or unproven, the team loses instant credibility."* | **Hardening**: Embed the real, captured demo dashboard screenshots (`bhedak_real_graph.png`, `chakra_real_dashboard.png`) directly into the architecture and solution slides. Mark each component with real test-suite badges (e.g., `29/29 Green Backend Tests`, `Sub-180s Attribution SLA`). |
| **02-First-Principles** | *"A visual is useless if the font is illegible at 10 feet or if flow arrows wander without clear data semantics."* | **Hardening**: Use a strict 3-tier typographic hierarchy (Headers ≥ 24pt, Subheads ≥ 16pt, Body ≥ 11pt bold). Every connector arrow has explicit data labels (`Raw Calldata`, `Cypher Query`, `STIX 2.1 Bundle`). |
| **03-Expansionist** | *"Don't just show static code components; show the 10x defensible moat that commercial tools like Chainalysis or Shodan fail at."* | **Hardening**: Explicitly highlight Bhedak's Asymmetric Confidence Scoring (Deterministic 0.95 vs AI 0.65 Cap) and Chakra's Degree-Bounded Beam Search (Anti-Explosion Gate) in prominent visual callouts. |
| **04-Naive Outsider** | *"If an evaluator looks at Slide 3 for 5 seconds, can they understand how the system works without reading small text?"* | **Hardening**: Use numbered step pills (① INGESTION → ② PROBING → ③ ATTRIBUTION → ④ EGRESS) with distinct color coding across the entire pipeline. |
| **05-Pragmatic Executor** | *"High-res image generation must be completely automated, reproducible, and fast (< 15 seconds), not requiring manual image editing."* | **Hardening**: Build a single headless Playwright automation script (`generate_canva_infographics.cjs`) that compiles all HTML/SVG templates and screenshots into 4K PNG assets automatically. |

### The Contrarian 4-Moat Test & Cryptographic Anti-Tamper Invariants
1. **Data Ingestion Moat**: Real-time Tor v3 SOCKS5 multiplexing (Bhedak) and Dual-Node UTXO ZeroMQ + TronGrid RPC pipeline (Chakra).
2. **Algorithmic Moat**: Degree-Bounded Beam Search with polynomial decay (O(k cdot b^d)) and Diurnal Circadian Sleep Profiling (UTC+05:30 IST).
3. **Sovereign/Statutory Moat**: Automated Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 63 evidentiary certificate generation with SHA-256 Merkle chain-of-custody.
4. **Economic Moat**: Zero per-query SaaS fees; sovereign deployment on MeghRaj Cloud at ₹38,000/month vs ₹18,00,000/year commercial licenses.

---

## 4. Proposed Slide Architecture Breakdown

### Deck 1: Project BHEDAK (NTRO PMO — Dark Web Threat Actor De-Anonymization)

```
+---------------------------------------------------------------------------------------------------------+
| [BHEDAK Logo]                   TECHNICAL APPROACH (SLIDE 3)                 [SIH 2025 Header]          |
+---------------------------------------------------------------------------------------------------------+
| +-------------------------+  +-------------------------------+  +-------------------------------------+ |
| | [1] TOR INGESTION BUS   |  | [2] ATTRIBUTION & AI LAB      |  | [3] NTRO ANALYST WORKBENCH (REAL UI)| |
| | - Tor Stem Controller   |  | - Neo4j Multi-Market Graph    |  | +---------------------------------+ | |
| | - SOCKS5 Multiplexer    |  | - Writeprints 284-dim Engine  |  | | [REAL DEMO SCREEN INSET]        | | |
| | - Playwright Crawlers   |  | - IndicBERT Hinglish Model    |  | | bhedak_real_graph.png           | | |
| | - Redis Priority Queue  |  | - Circadian Sleep Profiler    |  | +---------------------------------+ | |
| | [Logos: Python, Tor]    |  | [Logos: Neo4j, PyTorch]       |  | Tech: React 18, TypeScript, D3.js   | |
| +------------+------------+  +---------------+---------------+  +------------------+------------------+ |
|              | (Raw .onion Data)             | (Entity Graph Links)                |                    |
|              v                               v                                     v                    |
| +-------------------------+  +-------------------------------+  +-------------------------------------+ |
| | [4] PASSIVE PROBING     |  | [5] ASYMMETRIC FUSION GATE    |  | [6] STATUTORY EVIDENCE EGRESS       | |
| | - Apache mod_status     |  | - Deterministic Infra (0.95)  |  | - BSA 2023 Sec 63 Legal Certificate | |
| | - SSL/TLS SAN Leak      |  | - Crypto Common-Spend (0.92)  |  | - STIX 2.1 Threat Intel Bundle      | |
| | - Favicon MurmurHash3   |  | - AI Stylometry (0.65 Cap)    |  | - SHA-256 Merkle Provenance Ledger  | |
| | [Logos: Docker, Linux]  |  | - Combined Score: 94.2%       |  | - NTRO Sovereign Air-Gapped Egress  | |
| +-------------------------+  +-------------------------------+  +-------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
```

1. **Slide 1 (Title)**:
   - Official Ministry: National Technical Research Organisation (NTRO), Prime Minister's Office (PMO).
   - Problem Statement: SIH 2026 — Dark Web Threat Actor De-Anonymization.
   - Clean layout: Large bold typography, SIH logo watermark, NO bottom-left green card.
2. **Slide 2 (Proposed Solution & Prototype Showcase)**:
   - Left: Core Problem & 4 Architectural Pillars with custom colored icon badges.
   - Right: Real Desktop Application Frame featuring `bhedak_real_dashboard.png` (NTRO Cyber Command Docket LE-01) with live feature callout cards pointing to the active origin IP leak (`185.220.101.5`), PGP key match, and Hinglish code-mixing score.
3. **Slide 3 (Technical Approach — Full-Bleed Infographic)**:
   - Full slide width dataflow architecture: Ingestion Enclave → Probing Engine → Neo4j & AI Stylometry Lab → Real Workbench Inset (`bhedak_real_graph.png`) → Asymmetric Bayesian Scorer → BSA 2023 Court Admissibility Egress.
   - Official vector tech logos: Python, Tor, Neo4j, PyTorch, Docker, React, TypeScript, Redis.
4. **Slide 4 (Feasibility & Viability vs. Challenges)**:
   - Left: 4 Feasibility Pillars (Technical, Operational, Economic, Regulatory) + Real TAM/SAM/SOM Market Chart.
   - Right: 3 Real-World Technical Challenges paired with concrete engineering mitigations and visual icons (e.g. Anti-Scraping / Cloudflare bypass, Multilingual Hinglish slang normalization, Air-gapped Sovereign Deployment).
5. **Slide 5 (Impacts & Chronological Incident Flow)**:
   - Top: 3 Soft-tinted Benefit Cards (National Security Impact, Law Enforcement Efficiency, Economic Savings).
   - Center: 4-Step Chronological Incident Walkthrough ("Operation Mayajaal": .onion Marketplace Leak → Multi-Market PGP & BTC Correlation → IndicBERT Stylometry Match → BSA 2023 Evidentiary Takedown) with avatars and flow arrows.
   - Bottom: National Alignment (PMO Cyber Security Mandate, BSA 2023 Compliance) + Big Callout Metric ("100% Operational Repo • 29/29 Green Tests").
6. **Slide 6 (Research, References & Verification Proof)**:
   - Research citations (Academic stylometry papers, Tor security advisories), Market Sizing, Proof Documents, and live GitHub repo link.

---

### Deck 2: Project CHAKRA (MHA I4C — Automated VASP Attribution)

```
+---------------------------------------------------------------------------------------------------------+
| [CHAKRA Logo]                   TECHNICAL APPROACH (SLIDE 3)                 [SIH 2025 Header]          |
+---------------------------------------------------------------------------------------------------------+
| +-------------------------+  +-------------------------------+  +-------------------------------------+ |
| | [1] MULTI-CHAIN BUS     |  | [2] HEURISTICS & BEAM SEARCH  |  | [3] I4C INVESTIGATOR DESK (REAL UI) | |
| | - Bitcoin UTXO ZeroMQ   |  | - UTXO Common-Spend Heuristic |  | +---------------------------------+ | |
| | - Tron TRC-20 RPC Node  |  | - Tron Direct Energy Decoder  |  | | [REAL DEMO SCREEN INSET]        | | |
| | - EVM Geth RPC Provider |  | - Degree-Bounded Beam (k=8)   |  | | chakra_real_dashboard.png       | | |
| | - Kafka (10,000 tx/s)   |  | - FIU-IND 25+ VASP Database   |  +---------------------------------+ | |
| | [Logos: BTC, Tron, ETH] |  | [Logos: Kafka, Neo4j, Redis]  |  | Tech: React 18, TypeScript, Lucide  | |
| +------------+------------+  +---------------+---------------+  +------------------+------------------+ |
|              | (Normalized Tx Stream)        | (Clustered Graph Paths)             |                    |
|              v                               v                                     v                    |
| +-------------------------+  +-------------------------------+  +-------------------------------------+ |
| | [4] MEMORY & GRAPH DB   |  | [5] 4-PILLAR SCORING ENGINE   |  | [6] MHA SAHYOG STATUTORY EGRESS     | |
| | - Neo4j Multi-Chain Db  |  | - Temporal Proximity (0.30)   |  | - Section 94 BNSS Auto-Summons      | |
| | - Redis Hot Cache (<1ms)|  | - Balance Drain Ratio (0.25)  |  | - Section 106 Debit Freeze Notice   | |
| | - Sweep Zero-Balance    |  | - Cluster Density (0.25)      |  | - <8 Min Golden Window Asset Freeze | |
| | [Logos: Neo4j, Redis]   |  | - Energy Signature (0.20)     |  | - BSA 2023 Sec 63(4) Signed Docket  | |
| +-------------------------+  +-------------------------------+  +-------------------------------------+ |
+---------------------------------------------------------------------------------------------------------+
```

1. **Slide 1 (Title)**:
   - Official Ministry: Indian Cyber Crime Coordination Centre (I4C), CIS Division, Ministry of Home Affairs (MHA).
   - Problem Statement: Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs.
   - Clean layout: Large bold typography, SIH logo watermark, NO bottom-left green card.
2. **Slide 2 (Proposed Solution & Prototype Showcase)**:
   - Left: Operational Crisis in Indian Crypto Forensics & 4 Core Capabilities.
   - Right: Real Desktop Application Frame featuring `chakra_real_dashboard.png` (MHA I4C NCRP Case Intake Docket) with live feature callout cards pointing to Tron USDT transaction stream, Degree-Bounded Beam Search parameters, and FIU-IND registered VASP matching.
3. **Slide 3 (Technical Approach — Full-Bleed Infographic)**:
   - Full slide width dataflow architecture: Multi-Chain Ingestion Bus → Clustering & Beam Search → Neo4j & Redis Memory → Real Investigator Workbench Inset (`chakra_real_dashboard.png`) → 4-Pillar Confidence Scorer → MHA SAHYOG Platform Statutory Egress.
   - Official vector tech logos: Bitcoin, Tron, Ethereum, Kafka, Neo4j, Redis, Python, Docker, React, TypeScript.
4. **Slide 4 (Feasibility & Viability vs. Challenges)**:
   - Left: 4 Feasibility Pillars + Real Crypto Crime Volume & Recovery CAGR Chart.
   - Right: 3 Real-World Technical Challenges paired with concrete engineering mitigations (Peel-Chain Graph Explosion, Cross-Chain Bridge obfuscation, VASP Regulatory Jurisdiction delays).
5. **Slide 5 (Impacts & Chronological Incident Flow)**:
   - Top: 3 Soft-tinted Benefit Cards (₹500+ Cr Annual Asset Recovery, Golden Window Reduction from 48h to <8 min, Automated BNSS Legal Compliance).
   - Center: 4-Step Incident Flow ("Operation CryptoShield": NCRP Complaint Filed -> Multi-Hop Peel Chain Beam Search -> Nearest VASP Deposit Attributed -> Instant Section 106 Freeze Notice Dispatched).
   - Bottom: National Alignment (I4C Mission, FATF Recommendation 15, PMLA Rules) + Benchmark Metric ("Sub-180s Attribution SLA • 13/13 Green Tests").
6. **Slide 6 (Research, References & Verification Proof)**:
   - Clickable repo links, Blockchain research papers, Statutory references (BNSS, BSA 2023), and proof documents.

---

## 5. Verification & Testing Plan

### Automated Tests
1. **HTML/SVG Visual Compilation**: Execute `node scripts/engine/generate_canva_infographics.cjs` to render all slide visuals at 2400×1350 (2× scale) via Playwright Chromium. Verify exit code `0`.
2. **Presentation Assembly**: Run `python scripts/engine/generate_championship_decks.py` to compile the PPTX presentations.
3. **High-DPI PDF & PNG Export**: Run `python scripts/engine/export_championship_decks.py` to generate 200 DPI PNG slides in `specs/presentations/rendered/bhedak/` and `specs/presentations/rendered/chakra/`.
4. **Playwright Visual Assertions**: Run automated headless assertions validating that Slide 3 and Slide 2 contain embedded screenshots, proper contrast ratios, zero overlapping text nodes, and strict 16:9 geometry.

### Manual Review & Attestation
- Review the generated slides in `specs/presentations/review_decks.html` across all 6 slides for both presentations.
- Execute `python -m scripts.orchestrator.squad_attestation --prompt "Canva-grade visual upgrade for BHEDAK and CHAKRA decks"` to emit the official verifiable squad attestation receipt.
- Execute `python -m scripts.orchestrator.spec_sync --sync-brain` to synchronize the approved implementation plan into `docs/plans/`.
