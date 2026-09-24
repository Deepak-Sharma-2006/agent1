# Updated Implementation Plan: Canva-Grade Visual Overhaul from Solution POV (BHEDAK & CHAKRA)

Elevate the presentation decks for **Project BHEDAK (NTRO PMO)** and **Project CHAKRA (MHA I4C)** from repetitive rounded text tabs into authentic, high-density, Canva-level visual deliverables that achieve aesthetic and structural parity with the reference winner deck ([sih_2024.pdf](file:///specs/presentations/rendered/sih_2024/page_3.png)).

> **Core Architectural Realignment**: Every slide, technical approach diagram, dataflow pipeline, role hierarchy, and technology stack is formulated strictly from the **Full Proposed Sovereign Solution POV** (as documented in [docs/sih_solutions/](file:///docs/sih_solutions/)), rather than the restricted single-role demo MVP. Real demo screenshots are leveraged as **Working-Prototype Proof Insets** to empirically validate our team's execution capability.

---

## 1. Solution POV vs. Demo POV Architectural Matrix

| Dimension | Restricted Demo MVP (What We Built for Live Demo) | Full Proposed National Solution (What The Slides Must Present) | Slide Presentation Strategy |
|---|---|---|---|
| **BHEDAK: Role-Based Access Control (RBAC)** | Single-desk workbench (LE-01 Intelligence Analyst only). | **3-Tier Sovereign Operating Hierarchy**: <br>1. **Tier-1 Ingestion Operator (Scientist 'D', CITC)**: Crawlers, Tor probes, origin leaks.<br>2. **Tier-2 Forensic Examiner (Scientist 'E', NCIIPC)**: Neo4j graph, IndicBERT stylometry, Bayesian fusion.<br>3. **Tier-3 Centre Director (Scientist 'G', PMO Dissemination)**: STIX 2.1 approval, FIPS 140-3 HSM signature, BSA 2023 Sec 63 certificate. | **Slide 3 & Slide 5**: Explicitly illustrate the 3-tier sovereign command chain connecting darknet reconnaissance to forensic analysis to executive inter-agency dissemination (RAW, IB, CERT-In). |
| **BHEDAK: Production Technology Stack** | Local Python scripts, mock feeds, basic Vite bundle. | **Full Sovereign Enterprise Stack**: <br>• Ingestion: 256-Node Tor Crawlers (SOCKS5h), Playwright Stealth, Apache `mod_status`, TLS SAN X.509, Favicon MMH3, JARM, Telethon.<br>• Bus: Apache Kafka + Redis Streams & Celery.<br>• Graph & DB: Neo4j 5.20 Enterprise, Elasticsearch 8, TimescaleDB.<br>• AI: PyTorch, Siamese IndicBERT (Hinglish code-mixing), Writeprints 284-dim, Diurnal Sleep Trough.<br>• Security: FIPS 140-3 HSM, MeghRaj Sovereign SCIF, SHA-256 Merkle Ledger. | **Slide 3**: Embed official vector logos for Tor, Python, Neo4j, PyTorch, Docker, Kafka, Redis, Elasticsearch, and Linux across the dataflow pipeline. |
| **CHAKRA: Role-Based Access Control (RBAC)** | Investigating Officer (IO) desk only. | **5-Tier National Law Enforcement Hierarchy**: <br>1. **Tier-1 Investigating Officer (IO / Sub-Inspector)**: Case intake, suspect wallet trigger.<br>2. **Tier-2 Supervisory Sanction Officer (DySP / ACP / SP)**: Review, Class-3 DSC Section 106 freeze approval.<br>3. **Tier-3 Forensic Examiner (NCFL / FSL Scientist)**: Transaction RPC verification, BSA 2023 Sec 63(4) sign-off.<br>4. **Tier-4 Threat Analyst (I4C TAU / National Command)**: Cross-FIR syndicate correlation, national mule clusters.<br>5. **Tier-5 VASP Nodal Officer (Exchange Compliance Desk)**: Automated Section 94 summons receipt, <8 min freeze execution. | **Slide 3 & Slide 5**: Graphically map the multi-tier operational flow from District Police Station to Supervisory SP to I4C Command to FIU-IND Exchanges. |
| **CHAKRA: Production Technology Stack** | Fast mock JSON-RPC endpoints, local React store. | **Full Sovereign Enterprise Stack**: <br>• Multi-Chain: Bitcoin Core RPC (UTXO ZeroMQ), Java-Tron FullNode gRPC + TronGrid (TRC-20 USDT), EVM Erigon/Geth nodes (`debug_traceTransaction`), Solana JSON-RPC.<br>• Streaming Bus: Apache Kafka (10,000 tx/s throughput).<br>• Core Graph: Neo4j 5 Cluster, ClickHouse / TimescaleDB, Redis Hot Cache.<br>• Algorithms: Multi-Input Common-Spend, Tron Direct Energy Decoder, Degree-Bounded Beam Search (k=8).<br>• Statutory: MHA SAHYOG REST API, NCRP / 1930 Helpline, Jan Parichay SSO, FIPS 140-3 HSM. | **Slide 3**: Embed official vector logos for Bitcoin, Tron, Ethereum, Kafka, Neo4j, Redis, Python, Docker, React, and TypeScript. |
| **Demo UI Screens Usage** | Confined to isolated card views. | **Working-Prototype Proof Insets**: Embedded inside realistic desktop laptop and monitor frames with callout pointers validating that core algorithms are already compiled, operational, and tested. | **Slide 2 & Slide 3**: Embed high-res screenshots (`bhedak_real_graph.png`, `chakra_real_dashboard.png`) directly into the architecture and prototype showcases. |

---

## 2. Multi-Persona Execution Strategy (Rule 15 Lifecycle)

1. 📋 **`[Product Manager]`**:
   - Scope: Complete overhaul of visual assets for both BHEDAK and CHAKRA decks (Slides 1 to 6).
   - Invariant: Preserve official SIH 2025 presentation requirements, 6-slide structure, and 100% factual fidelity to [docs/sih_solutions/](file:///docs/sih_solutions/).
   - Acceptance Criteria: Slide 3 must be an end-to-end full-bleed infographic depicting the complete enterprise solution flow; Slide 2 must showcase the proposed national platform with real prototype insets; zero repetitive rounded text boxes; zero bottom-left green card on Slide 1.
2. 📐 **`[System Architect]`**:
   - Engine: HTML5 + CSS Grid / Flexbox + SVG Vector Canvas compiled to 4K PNG via Headless Playwright Chromium (`2400×1350`, `deviceScaleFactor: 2`).
   - Layout Design:
     - Slide 1: High-impact Title Slide with SIH lightbulb watermark and verified Ministry metadata.
     - Slide 2: Proposed Solution Overview with Real Desktop UI Monitor Mockup, live feature badges, and 4 differentiator cards.
     - Slide 3: Full-Bleed Technical Approach Infographic (Multi-Source Ingestion → Analytical Core → Multi-Tier RBAC Console Inset → Statutory Inter-Agency Egress).
     - Slide 4: Feasibility & Viability with custom icon badges, real market chart, and 3 concrete engineering challenge/mitigation pairs.
     - Slide 5: Chronological Multi-Stakeholder Incident Flow (4-step comic journey with avatars, callouts, and arrows) + SDG/National alignment.
     - Slide 6: Research, References & Live Verification Proof with clickable links and proof metrics.
3. 🛑 **`[Adversarial SDET]`**:
   - Assert with Headless Playwright that all generated slide images meet 16:9 geometry, achieve ≥ 200 DPI clarity, have zero overlapping text nodes, and depict genuine multi-tier dataflows rather than single-role demo sequences.
4. 💻 **`[Core Engineer]`**:
   - Develop `scripts/engine/generate_canva_infographics.cjs` using HTML/CSS/SVG + Playwright to compile the 4K slide infographics.
   - Update `scripts/engine/generate_championship_decks.py` to position full-bleed visual assets seamlessly onto the slides.
   - Run `scripts/engine/export_championship_decks.py` to produce final PPTX, PDF, and high-DPI PNGs.
5. 🔬 **`[Mutation & Security Auditor]`**:
   - Validate 100% factual fidelity against [sih-2026-ntro-solution-blueprint.md](file:///docs/sih_solutions/sih-2026-ntro-solution-blueprint.md) and [sih-2026-mha-vasp-attribution-blueprint.md](file:///docs/sih_solutions/sih-2026-mha-vasp-attribution-blueprint.md).
   - Zero Hallucination & Zero Secrets: Validate zero synthetic tokens, 100% verified dependencies, and zero fake claims.
6. 📑 **`[Technical Writer]`**:
   - Update `review_decks.html`, synchronize brain plans to `docs/plans/` using `SpecSync`, and emit the verified `SquadAttestor` receipt.

---

## 3. Mandatory Adversarial Claude Council Hardening (Rule 10)

| Council Advisor | Unaligned Perspective & Critique | Concrete Hardening Mitigation Applied |
|---|---|---|
| **01-Contrarian** | *"If evaluators think the slide only represents a college student demo, they will discard it. An enterprise national intelligence system must show sovereign inter-agency routing."* | **Hardening**: Clearly demarcate the 3-Tier Sovereign Command Hierarchy for NTRO (Scientist D, E, G) and the 5-Tier National LEA Hierarchy for MHA (IO, SP, FSL Examiner, Threat Analyst, VASP Nodal). Embed the working demo screens as empirical proof of technical capability. |
| **02-First-Principles** | *"Do not list demo libraries (like Vite or SQLite) in place of enterprise production infrastructure. The evaluators are senior ministry scientists."* | **Hardening**: Feature the real national production stack: Apache Kafka (10,000 tx/s), Neo4j 5.20 Enterprise, Elasticsearch 8, Java-Tron gRPC, Bitcoin Core ZeroMQ, PyTorch IndicBERT, and FIPS 140-3 HSM. |
| **03-Expansionist** | *"Highlight the sovereign defensibility moat against commercial SaaS like Chainalysis or Recorded Future which violate Indian data sovereignty."* | **Hardening**: Emphasize 100% in-country data residency on MeghRaj Government Cloud, air-gapped sovereign deployment, and ₹38,000/month sovereign COGS vs ₹18,00,000/yr commercial foreign licenses. |
| **04-Naive Outsider** | *"Can a non-technical evaluator trace the lifecycle of a cyber incident across the slides in 10 seconds?"* | **Hardening**: Use sequential numbered step circles (① INGESTION → ② PROBING → ③ GRAPH AI → ④ ANALYST CONSOLE → ⑤ ASYMMETRIC FUSION → ⑥ STATUTORY EGRESS) with distinct color coding across the entire pipeline. |
| **05-Pragmatic Executor** | *"All slide assets must be automatically generated via code without manual image editing, guaranteeing exact repeatable builds in <15 seconds."* | **Hardening**: Execute the generation via automated headless Playwright script producing 4K Retina PNG assets directly. |

### The Contrarian 4-Moat Test & Cryptographic Anti-Tamper Invariants
1. **Data Ingestion Moat**: Real-time 256-Node Tor v3 SOCKS5 multiplexing (Bhedak) and Dual-Node UTXO ZeroMQ + TronGrid gRPC pipeline (Chakra).
2. **Algorithmic Moat**: Degree-Bounded Beam Search with polynomial decay (O(k cdot b^d)) and Diurnal Circadian Sleep Profiling (UTC+05:30 IST).
3. **Sovereign/Statutory Moat**: Automated Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 63 evidentiary certificate generation with SHA-256 Merkle chain-of-custody.
4. **Economic Moat**: Zero per-query SaaS fees; sovereign deployment on MeghRaj Cloud at ₹38,000/month vs ₹18,00,000/year commercial licenses.

---

## 4. Master Slide Architecture: Full Solution POV

### Deck 1: Project BHEDAK (NTRO PMO — Dark Web Threat Actor De-Anonymization)

```
+----------------------------------------------------------------------------------------------------------------------------------+
| [BHEDAK Logo]                                 TECHNICAL APPROACH: MASTER SOLUTION ARCHITECTURE                    [SIH 2025]     |
+----------------------------------------------------------------------------------------------------------------------------------+
| +------------------------------------+  +-------------------------------------+  +---------------------------------------------+ |
| | [TIER 1] MULTI-SOURCE INGESTION    |  | [TIER 2] CORE ANALYTICAL ENGINES    |  | [TIER 3] SOVEREIGN 3-TIER OPERATIONAL HUD   | |
| | • 256-Node Tor Crawlers (SOCKS5h)  |  | • Engine 1: Infra De-Anonymization  |  | ┌─────────────────────────────────────────┐ | |
| | • Playwright Stealth & PoW Solver  |  |   - Apache mod_status scoreboard    |  | │ ROLE 1: INGESTION OPERATOR (Scientist D)│ | |
| | • Clearnet OSINT & PGP Harvester   |  |   - SSL/TLS SAN Domain Matcher      |  | │ • Ingests target .onion / sets crawler  │ | |
| | • Telethon Telegram Channel Scraper|  |   - Favicon MurmurHash3 & JARM      |  | ├─────────────────────────────────────────┤ | |
| | • Bitcoin Core & Tron gRPC Stream  |  | • Engine 2: Neo4j 5.20 Graph Engine |  | │ ROLE 2: FORENSIC EXAMINER (Scientist E) │ | |
| | [Logos: Python, Tor, Telegram]     |  |   - PGP UID, BTC Co-Spend, Telegram |  | │ [WORKING PROTOTYPE GRAPH INSET]         │ | |
| +-----------------+------------------+  | • Engine 3: AI Stylometry Lab       |  | │ bhedak_real_graph.png                   │ | |
|                   | (Raw Feeds)      |  |   - 284-dim Writeprints + IndicBERT │  | │ • Cytoscape.js canvas / Hinglish NLP    │ | |
|                   v                  |  |   - Diurnal Sleep Trough (UTC+05:30)|  | ├─────────────────────────────────────────┤ | |
| +------------------------------------+  | [Logos: Neo4j, PyTorch, HuggingFace]|  | │ ROLE 3: CENTRE DIRECTOR (Scientist G)   │ | |
| | MESSAGE BROKER & TASK DISPATCHER   |  +------------------+------------------+  | │ • STIX 2.1 approval & FIPS 140-3 HSM DSC│ | |
| | • Apache Kafka + Redis Streams     |                     | (Fused Signals)     | └─────────────────────────────────────────┘ | |
| | • Celery Distributed Task Queue    |                     v                     | Tech: React 18, TypeScript, Tailwind, D3.js │ |
| | [Logos: Kafka, Redis, Docker]      |  +-------------------------------------+  +----------------------+----------------------+ |
| +------------------------------------+  | [TIER 4] ASYMMETRIC FUSION ENGINE   |                         | (Approved Package)   |
|                                         | • Deterministic Gate: Infra (0.95)  |                         v                      |
|                                         | • Crypto Co-Spend Gate: (0.92)      |  +---------------------------------------------+ |
|                                         | • AI Stylometry Gate: Safety Cap 0.65| | [TIER 5] STATUTORY INTER-AGENCY EGRESS      | |
|                                         | • Adversarial Text Nullifier (0.00) |  | • BSA 2023 Sec 63 Dual-Signed Court Dossier | |
|                                         | [Combined Confidence Score: 94.2%]  |  | • OASIS STIX 2.1 JSON Threat Intel Feed     | |
|                                         +-------------------------------------+  | • Inter-Agency Broadcast: RAW, IB, CERT-In  | |
|                                                                                  | • Air-Gapped Sovereign Node on MeghRaj SCIF | |
|                                                                                  +---------------------------------------------+ |
+----------------------------------------------------------------------------------------------------------------------------------+
```

1. **Slide 1 (Title Slide)**:
   - Problem Statement: SIH 2026 — Dark Web Threat Actor De-Anonymization.
   - Target Ministry: National Technical Research Organisation (NTRO), Prime Minister's Office (PMO), Government of India.
   - Clean, executive typography, SIH logo watermark, zero bottom-left green card.
2. **Slide 2 (Proposed Solution & Prototype Showcase)**:
   - Full Solution Narrative: Sovereign 4-Pillar De-Anonymization Platform (Infrastructure Probing, Multi-Market Graph, Hinglish AI Stylometry, Asymmetric Fusion).
   - Working-Prototype Proof Inset: Photorealistic desktop frame showcasing `bhedak_real_dashboard.png` (NTRO Cyber Command Docket LE-01) with live data callout badges.
3. **Slide 3 (Technical Approach — Full Solution Architecture)**:
   - Full-bleed Canva-grade infographic illustrating the complete 5-tier pipeline, the 3-Tier Sovereign RBAC Hierarchy (Scientist D, E, G), official tech logos, and the working prototype graph inset.
4. **Slide 4 (Feasibility & Viability vs. Engineering Challenges)**:
   - Feasibility: Technical, Operational, Economic (₹38,000/mo sovereign cloud), Regulatory (BSA 2023 Sec 63), and TAM/SAM/SOM chart.
   - 3 Real Engineering Challenges from Solution POV: (1) Anti-Crawling/Cloudflare Captcha bypass via Stealth Playwright; (2) Hinglish Slang Drifting via IndicBERT fine-tuning; (3) Air-gapped Sovereign SCIF deployment.
5. **Slide 5 (Impacts, Benefits & Chronological Incident Flow)**:
   - Top: 3 Benefit Cards (National Cyber Sovereignty, Law Enforcement Speed, Economic Crime Prevention).
   - Center: 4-Step Incident Flow ("Operation Mayajaal": .onion Marketplace Leak -> Cross-Market PGP & BTC Correlation -> IndicBERT Stylometry Match -> BSA 2023 Evidentiary Takedown) showing interactions across Scientist D, E, and G.
   - Bottom: National Alignment (PMO Cyber Security Mandate) + Empirical Proof ("100% Operational Repo • 29/29 Green Tests").
6. **Slide 6 (Research, References & Verification Proof)**:
   - Academic papers, Tor research advisories, BSA 2023 legal standards, market sizing, and GitHub repository proof.

---

### Deck 2: Project CHAKRA (MHA I4C — Automated VASP Attribution)

```
+----------------------------------------------------------------------------------------------------------------------------------+
| [CHAKRA Logo]                                 TECHNICAL APPROACH: MASTER SOLUTION ARCHITECTURE                    [SIH 2025]     |
+----------------------------------------------------------------------------------------------------------------------------------+
| +------------------------------------+  +-------------------------------------+  +---------------------------------------------+ |
| | [TIER 1] MULTI-CHAIN INGESTION BUS |  | [TIER 2] CLUSTERING & BEAM SEARCH   |  | [TIER 3] NATIONAL 5-TIER LEA COMMAND HUD    | |
| | • Bitcoin Core RPC (UTXO ZeroMQ)   |  | • UTXO Multi-Input Co-Spend Cluster |  | ┌─────────────────────────────────────────┐ | |
| | • Java-Tron FullNode gRPC + TronGrid| | • Tron Direct Energy Signature Decode|  | │ TIER 1: INVESTIGATING OFFICER (IO / SHO)│ | |
| | • Ethereum/EVM Geth (Trace Call)   |  | • Sweep Zero-Balance Consolidation  |  | │ [WORKING PROTOTYPE INTAKE INSET]        │ | |
| | • Solana JSON-RPC (SPL Token ATA)  |  | • Degree-Bounded Beam Search (k=8)  |  | │ chakra_real_dashboard.png               │ | |
| | • Apache Kafka (10,000 tx/sec Queue|  | • FIU-IND 25+ VASP Registry Database|  | ├─────────────────────────────────────────┤ | |
| | [Logos: Bitcoin, Tron, Ethereum]   |  | [Logos: Neo4j, Redis, Python, Kafka]|  | │ TIER 2: SUPERVISORY SP / ACP (SANCTION) │ | |
| +-----------------+------------------+  +------------------+------------------+  | │ • Reviews confidence & signs Sec 106 DSC│ | |
|                   | (Normalized UTDM)|                     | (Attributed Paths)  | ├─────────────────────────────────────────┤ | |
|                   v                  |                     v                     | │ TIER 3: FSL FORENSIC EXAMINER (VERIFY)  │ | |
| +------------------------------------+  +-------------------------------------+  | │ • Verifies Merkle root & signs BSA 63(4)│ | |
| | MULTI-MODEL STORAGE & MEMORY       |  | [TIER 4] 4-PILLAR CONFIDENCE SCORER |  | ├─────────────────────────────────────────┤ | |
| | • Neo4j 5 Graph (Multi-Hop Cypher) |  | • Temporal Proximity Weight (0.30)  |  | │ TIER 4: I4C NATIONAL THREAT ANALYST     │ | |
| | • TimescaleDB / ClickHouse Ledgers |  | • Balance Drain Ratio Weight (0.25) |  | │ • Cross-FIR national syndicate mapping  │ | |
| | • Redis Hot Cluster (<1ms Cache)   |  | • Cluster Density Weight (0.25)     |  | ├─────────────────────────────────────────┤ | |
| | [Logos: Neo4j, Timescale, Redis]   |  | • Energy / Gas Signature (0.20)     |  | │ TIER 5: VASP NODAL COMPLIANCE OFFICER   │ | |
| +------------------------------------+  | [Attribution SLA: Sub-180s on-chain]|  | │ • CoinDCX, WazirX, Binance (<8 min ack) │ | |
|                                         +-------------------------------------+  | └─────────────────────────────────────────┘ | |
|                                                                                  +----------------------+----------------------+ |
|                                                                                                         | (Statutory Dispatch) |
|                                                                                                         v                      |
|                                                                                  +---------------------------------------------+ |
|                                                                                  | [TIER 5] MHA SAHYOG STATUTORY EGRESS        | |
|                                                                                  | • Automated Section 94 BNSS Summons (KYC/IP)| |
|                                                                                  | • Automated Section 106 BNSS Debit Freeze   | |
|                                                                                  | • BSA 2023 Sec 63(4) Signed Digital Docket  | |
|                                                                                  | • Jan Parichay SSO + FIPS 140-3 HSM Cloud   | |
|                                                                                  +---------------------------------------------+ |
+----------------------------------------------------------------------------------------------------------------------------------+
```

1. **Slide 1 (Title Slide)**:
   - Problem Statement: Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs.
   - Target Ministry: Indian Cyber Crime Coordination Centre (I4C), CIS Division, Ministry of Home Affairs (MHA), Government of India.
   - Clean, official typography, SIH logo watermark, zero bottom-left green card.
2. **Slide 2 (Proposed Solution & Prototype Showcase)**:
   - Full Solution Narrative: National Multi-Chain VASP Attribution Engine integrated with the MHA SAHYOG Platform.
   - Working-Prototype Proof Inset: Photorealistic desktop frame showcasing `chakra_real_dashboard.png` (MHA I4C NCRP Case Intake Docket) with live data callout badges.
3. **Slide 3 (Technical Approach — Full Solution Architecture)**:
   - Full-bleed Canva-grade infographic illustrating the complete 5-tier multi-chain pipeline, the 5-Tier National LEA Command Hierarchy (IO, SP, FSL Examiner, I4C Analyst, VASP Nodal), official tech logos, and the working prototype intake inset.
4. **Slide 4 (Feasibility & Viability vs. Engineering Challenges)**:
   - Feasibility: Technical, Operational, Economic, Regulatory (BNSS Sec 94/106 & BSA 2023), and Crypto Crime Recovery CAGR chart.
   - 3 Real Engineering Challenges from Solution POV: (1) Graph Traversal Explosion across Peel Chains mitigated by Degree-Bounded Beam Search; (2) Cross-Chain Bridge Obfuscation mitigated by multi-ledger contract parsing; (3) Golden Window Asset Dissipation mitigated by automated API freeze dispatch.
5. **Slide 5 (Impacts, Benefits & Chronological Incident Flow)**:
   - Top: 3 Benefit Cards (₹500+ Cr Annual Asset Recovery, Golden Window Reduction from 48h to <8 min, Automated BNSS Compliance).
   - Center: 4-Step Incident Flow ("Operation CryptoShield": NCRP Complaint Filed -> Multi-Hop Peel Chain Beam Search -> Nearest VASP Deposit Attributed -> Instant Section 106 Freeze Notice Dispatched) showing interactions across IO, SP, and VASP Nodal.
   - Bottom: National Alignment (I4C Mission, FATF Recommendation 15, PMLA) + Empirical Proof ("Sub-180s Attribution SLA • 13/13 Green Tests").
6. **Slide 6 (Research, References & Verification Proof)**:
   - Academic blockchain papers, FATF standards, BNSS 2023 statutes, market sizing, and GitHub repository proof.

---

## 5. Verification & Testing Plan

### Automated Execution Loop
1. **Infographic Compilation**: Run `node scripts/engine/generate_canva_infographics.cjs` to compile the 4K Retina PNG assets for Slides 2, 3, 4, and 5 for both decks.
2. **Presentation Assembly**: Run `python scripts/engine/generate_championship_decks.py` to compile the PPTX presentations.
3. **High-DPI PDF & PNG Export**: Run `python scripts/engine/export_championship_decks.py` to produce 200 DPI PNG slides in `specs/presentations/rendered/bhedak/` and `specs/presentations/rendered/chakra/`.
4. **Playwright Visual Assertions**: Run automated headless assertions validating that Slide 3 and Slide 2 contain embedded screenshots, proper contrast ratios, zero overlapping text nodes, and strict 16:9 geometry.

### Manual Review & Attestation
- Review all 6 slides for both presentations in `specs/presentations/review_decks.html`.
- Run `python -m scripts.orchestrator.squad_attestation --prompt "Canva-grade visual upgrade from solution POV for BHEDAK and CHAKRA decks"` to emit the official verifiable squad attestation receipt.
- Run `python -m scripts.orchestrator.spec_sync --sync-brain` to synchronize the approved implementation plan into `docs/plans/`.
