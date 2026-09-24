# Implementation Plan: Visual Replication of Slide 2 for BHEDAK & CHAKRA (SIH 2024 Visual Parity)

## Executive Summary
This implementation plan establishes the precise visual replication of **Slide 2** for both **Project BHEDAK** and **Project CHAKRA**, matching the Canva-grade visual design and geometry of [sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png). 

The plan also preserves `slide_1.png` as-is in both project directories, verifies all text and metrics against the authoritative blueprints in [docs/sih_solutions/](file:///docs/sih_solutions/), embeds the uncropped demo screenshots ([bhedak_graph.png](file:///specs/presentations/rendered/bhedak_graph.png) and [chakra_dashboard.png](file:///specs/presentations/rendered/chakra_dashboard.png)) by resizing with aspect ratio preservation, and tests the output through rigorous visual inspection.

---

## 1. Visual Difference Analysis (`approved_bhedak/slide_2.png` vs `sih_2024/page_2.png`)

A visual comparison reveals several structural and aesthetic differences that must be addressed:

| Visual Dimension | `approved_bhedak/slide_2.png` (Current Legacy) | `sih_2024/page_2.png` (Target Benchmark) | Required Engineering Fix |
| :--- | :--- | :--- | :--- |
| **Team Pill** | Blue-bordered rounded rectangle ("Indomitus") | Crisp black-bordered oval pill ("Arize") | Use oval black border `border: 2px solid #000; border-radius: 9999px` with team name `Indomitus`. |
| **Header Title** | Serif title `BHEDAK` | Bold, tall condensed sans-serif title `COALWORKS` | Use clean sans-serif bold `BHEDAK` / `CHAKRA`. |
| **SIH Logo** | Placed top right | Official SIH bulb logo with hackathon year | Embed verified official [sih_logo_header.png](file:///specs/presentations/rendered/sih_logo_header.png). |
| **Category Badges** | None (used `• Proposed Solution :-` in blue text) | Black rounded pills: `SOLUTION`, `PROTOTYPE`, `WHY WE STAND OUT ?` | Implement standard `.black-pill` badges with uppercase bold typography. |
| **Solution Layout** | Single vertical list of 6 verbose bullets | Lead sentence + 2-column clean bullet grid (3x2) + summary paragraph + completion status | Split features into 2 clean columns of 3 bullets with bold keywords; add summary and status line (`% completed` in blue). |
| **Prototype Area** | Abstract system flowchart diagram | App UI mockups with descriptive callout tags | Resized desktop monitor mockup displaying the actual demo screenshot ([bhedak_graph.png](file:///specs/presentations/rendered/bhedak_graph.png) / [chakra_dashboard.png](file:///specs/presentations/rendered/chakra_dashboard.png)) without cropping. |
| **Why We Stand Out** | Completely missing from Slide 2 | Full-width bottom section with 4 comparative columns and colorful icons | Implement full-width 4-column section spanning the entire slide width (1920px). |
| **Footer Ribbon** | Light blue bar | Deep blue ribbon (`#1D4ED8`) with project title and slide number `2` | Solid blue bottom bar with `@SIH Idea Submission` and slide number `2`. |

---

## 2. Text & Data Verification (Source of Truth: `docs/sih_solutions/`)

All text, legal statutes, and architecture metrics are verified against the authoritative technical dossiers:

### Project BHEDAK (Source: `docs/sih_solutions/sih-2026-ntro-solution-blueprint.md`)
- **Target Organization**: National Technical Research Organisation (NTRO), Prime Minister's Office (PMO).
- **Core Lead Sentence**: Autonomous dark web threat intelligence platform that de-anonymizes Tor v3 hidden service actors through infrastructure leak correlation, multi-market knowledge graphs, and AI stylometry.
- **6 Key Solution Bullets (2-Column Grid)**:
  1. **Tor Misconfig & Origin IP Prober**: Unmasks servers via Apache mod_status, TLS SAN mismatches, and Favicon MMH3 Shodan pivots.
  2. **Multi-Market Entity Resolution**: Correlates PGP keys (RFC 4880), handles, and crypto clusters across 15+ darknet markets in Neo4j.
  3. **AI Stylometry & Profiling**: Extracts 400+ Writeprints features (Siamese RoBERTa/IndicBERT) + 24-hr UTC diurnal sleep trough tracking for IST timezone.
  4. **Asymmetric Confidence Scorer**: Applies a strict 0.65 hard cap on probabilistic AI, requiring deterministic cryptographic proof for high-confidence attribution.
  5. **Section 63 BSA 2023 Evidence Kit**: Auto-generates court-admissible forensic packages (Part A/B dual cert) and automated BNSS Sec 94 notice drafts.
  6. **Automated Tor Crawl Cluster**: Distributed 256-node SOCKS5 multiplexing pool with stem circuit rotation and CAPTCHA solvers.
- **Summary & Status**: Solves darknet anonymity crisis for NTRO with sovereign AI/graph intelligence. Status: **65% completed**; testing and live validation on real darknet dumps ongoing.
- **Prototype Callouts**:
  - Origin IP Unmasked: `103.152.18.42`
  - Multi-Market PGP Correlator: `RSA-4096 Key Fingerprint Match`
  - IndicBERT Hinglish Stylometry: `Syntactic Score: 0.884`
  - Court Evidence Schedule: `Dual-Signed Sec 63 BSA Docket`
- **Why We Stand Out (4 Full-Width Columns)**:
  1. **256-Node Tor SOCKS5 Pool**: Continuous distributed crawling with automated circuit rotation.
  2. **Sub-50ms Graph Queries**: Neo4j Enterprise resolving 10,000+ threat actor nodes and multi-market syndicates.
  3. **BSA 2023 Sec 63 Digital Proof**: FIPS 140-3 HSM signed Merkle root chain ensuring 100% court admissibility.
  4. **Air-Gapped Sovereign Cloud**: Zero reliance on foreign intelligence vendors (Flashpoint/Recorded Future).

### Project CHAKRA (Source: `docs/sih_solutions/sih-2026-mha-vasp-attribution-blueprint.md`)
- **Target Organization**: Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs (MHA).
- **Core Lead Sentence**: Automated blockchain forensics and VASP attribution engine integrated directly into MHA NCRP & SAHYOG platform, reducing attribution and debit freeze times from 21 days to under 8 minutes.
- **6 Key Solution Bullets (2-Column Grid)**:
  1. **Multi-Chain Ingestion Engine**: Normalizes UTXO (BTC), Account (Tron/ETH), and token transfers into a Unified Transaction Data Model.
  2. **Deposit-to-Sweep Clustering**: Identifies high-fan-in exchange consolidation sweeps to unmask private unhosted deposit addresses.
  3. **Tron TRC-20 Energy Profiling**: Decodes smart contract fee delegation to unmask syndicate energy rent-sharing and peel chains.
  4. **Degree-Bounded Beam Search**: Resolves 5-hop peeling chains and bridge hops in <180s without combinatorial graph explosion.
  5. **4-Pillar Confidence Scorer**: Combines Temporal Proximity, Balance Drain, Structural Density, and Energy Signatures for 96.4% confidence.
  6. **MHA SAHYOG API Dispatch**: Auto-generates pre-populated Section 94 BNSS summons and Section 106/107 BNSS debit freeze orders.
- **Summary & Status**: Solves crypto asset flight crisis for MHA I4C, collapsing the 21-day requisition cycle into real-time statutory freezes. Status: **60% completed**; live testing with NCRP mock dockets and Tron node feeds ongoing.
- **Prototype Callouts**:
  - NCRP 1930 Live Ingestion: `Victim loss: ₹45,00,000 USDT`
  - Tron TRC-20 Decoder: `Unpacks sweeps in < 15ms`
  - Degree-Bounded Beam Search: `5-hop trace to Binance Hot Wallet 14`
  - Court Evidence Docket: `1-Click Sec 106 BNSS Notice`
- **Why We Stand Out (4 Full-Width Columns)**:
  1. **Sub-8 Min Golden Window**: Freezes assets before criminals liquidate via P2P bank rails.
  2. **Tron Energy Fee Profiler**: Clusters unhosted wallets by centralized fee-delegation accounts.
  3. **BSA 2023 Sec 63(4) Certified**: Dual-signed cryptographic SHA-256 Merkle root chain of custody.
  4. **Air-Gapped Sovereign Deployment**: Zero data egress to foreign vendors (Chainalysis/TRM Labs).

---

## 3. Prototype Image Resizing Specification (Zero-Crop Guarantee)

- The demo screenshots ([bhedak_graph.png](file:///specs/presentations/rendered/bhedak_graph.png) and [chakra_dashboard.png](file:///specs/presentations/rendered/chakra_dashboard.png)) have dimensions of **897 x 383 px** (aspect ratio 2.34:1).
- **Resizing Constraint**:
  - The image must NEVER be cropped using fixed-height clipping or `object-fit: cover`.
  - The monitor frame will accommodate this ultrawide aspect ratio (`aspect-ratio: 897 / 383` or `width: 100%; height: auto; max-height: 330px; object-fit: contain;`).
  - The entire UI—including top navigation bar, docket numbers, graph nodes, and action buttons—will remain 100% visible and sharp.
- The phone frame mockup that previously displaced the "Why We Stand Out" section will be removed from Slide 2, allowing "Why We Stand Out" to span the full width across the bottom, matching [sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png).

---

## 4. Proposed Changes by Component

### Component 1: File Copying
- [NEW] Copy [approved_bhedak/slide_1.png](file:///specs/presentations/rendered/approved_bhedak/slide_1.png) -> [bhedak/slide_1.png](file:///specs/presentations/rendered/bhedak/slide_1.png) as-is.
- [NEW] Copy [approved_chakra/slide_1.png](file:///specs/presentations/rendered/approved_chakra/slide_1.png) -> [chakra/slide_1.png](file:///specs/presentations/rendered/chakra/slide_1.png) as-is.

### Component 2: Presentation Engine Slide 2 Templates
#### [MODIFY] [generate_bhedak_slides.mjs](file:///scripts/engine/generate_bhedak_slides.mjs)
- Update `case 2` HTML template:
  - Header: Team oval with "Indomitus", center title "BHEDAK", official SIH 2026 logo.
  - Left Column (Solution): Black pill `SOLUTION`, lead headline, 2-column clean bullet grid (6 points total, no enclosing grey boxes), summary text, and completion status line (`65% completed`).
  - Right Column (Prototype): Black pill `PROTOTYPE`, subtitle with blue highlights, monitor frame with uncropped `bhedak_graph.png`, and 4 status badges in a 2x2 grid.
  - Bottom Section: Full-width `WHY WE STAND OUT ?` banner with 4 side-by-side comparative cards with icons.
  - Footer: Solid blue ribbon with `BHEDAK - @SIH Idea Submission` and `2`.

#### [MODIFY] [generate_chakra_slides.mjs](file:///scripts/engine/generate_chakra_slides.mjs)
- Update `case 2` HTML template:
  - Header: Team oval with "Indomitus", center title "CHAKRA", official SIH 2026 logo.
  - Left Column (Solution): Black pill `SOLUTION`, lead headline, 2-column clean bullet grid (6 points total, no enclosing grey boxes), summary text, and completion status line (`60% completed`).
  - Right Column (Prototype): Black pill `PROTOTYPE`, subtitle with blue highlights, monitor frame with uncropped `chakra_dashboard.png`, and 4 status badges in a 2x2 grid.
  - Bottom Section: Full-width `WHY WE STAND OUT ?` banner with 4 side-by-side comparative cards with icons.
  - Footer: Solid blue ribbon with `CHAKRA - @SIH Idea Submission` and `2`.

### Component 3: Execution & Visual Testing
- Render slides via `node scripts/engine/render_championship_decks.mjs --slide 2`.
- Inspect rendered images [bhedak/slide_2.png](file:///specs/presentations/rendered/bhedak/slide_2.png) and [chakra/slide_2.png](file:///specs/presentations/rendered/chakra/slide_2.png) using `view_file` to verify visual parity against [sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png).

---

## 5. Verification Plan

### Automated Headless Browser Rendering
- Execute `node scripts/engine/render_championship_decks.mjs --slide 2` with Chromium headless renderer at 300 DPI 4K (`deviceScaleFactor: 2`).

### Visual Inspection & Parity Audit
- View [bhedak/slide_2.png](file:///specs/presentations/rendered/bhedak/slide_2.png) and [chakra/slide_2.png](file:///specs/presentations/rendered/chakra/slide_2.png) using `view_file`.
- Verify:
  1. Team oval says "Indomitus" with 2px black border.
  2. SIH 2026 logo renders crisp and unclipped.
  3. Solution section has 2-column bulleted list without grey boxes, plus summary text and completion line.
  4. Demo screenshot is fully visible, uncropped, and properly contained in monitor frame.
  5. "WHY WE STAND OUT ?" spans the full slide width with 4 columns.
  6. Footer ribbon renders deep blue with slide number 2.
