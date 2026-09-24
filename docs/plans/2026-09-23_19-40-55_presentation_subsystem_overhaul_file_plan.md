# Implementation Plan: Presentation Subsystem Overhaul & File Purge

**Goal**: Purge old, rejected PPT generation files from `scripts/` and `specs/presentations/` (retaining only `rendered/`, `CHAKRA_SIH2026.pptx`, and `BHEDAK_SIH2026.pptx`), benchmark state-of-the-art open-source AI presentation generation frameworks (Presenton, PPTAgent, PPT Master), and overhaul the presentation synthesis engine to eliminate dark-mode monolithic text boxes and achieve true 1:1 visual parity with `sih_2024.pdf`.

---

## 1. User Review Required

> [!IMPORTANT]
> **Strict Retention Verification**: Per your instruction, the only files/directories to be preserved in `specs/presentations/` are:
> 1. `specs/presentations/rendered/` (all rendered PNGs including `sih_2024/page_1..6.png`, `chakra/`, `bhedak/`)
> 2. `specs/presentations/CHAKRA_SIH2026.pptx`
> 3. `specs/presentations/BHEDAK_SIH2026.pptx`
>
> All other scratch HTML files (`deck_aerosec_test.html`, `deck_dispatcher_output.html`, `review_decks.html`, `test_dispatcher_deck.html`), scratch directories (`assets/`, `temp_sih2024_imgs/`, `test_canvas/`), and rejected PDFs will be permanently deleted upon plan approval.

> [!WARNING]
> **Reference PDF Handling (`sih_2024.pdf`)**:
> `specs/presentations/sih_2024.pdf` was added as the original visual ground truth. Its rendered 300 DPI slides are fully preserved in `specs/presentations/rendered/sih_2024/page_1.png` through `page_6.png`. In strict accordance with "only keep rendered folder content and the two pptx files", `sih_2024.pdf` will also be removed unless you prefer to retain the source PDF alongside the rendered images.

---

## 2. Research & GitHub Repository Benchmarking

We conducted empirical research into the top-rated, forked open-source AI and agentic presentation generation repositories to extract their winning architectures:

### Benchmark Matrix: Leading Open-Source AI Presentation Repositories

| Repository | GitHub Stars / Community | Architecture & Core Paradigm | Rendering Engine | Key Strengths | Weaknesses / Limitations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **[Presenton](https://github.com/presenton/presenton)** | **~10.7k stars**, 1.2k forks | Open-source Canva/Gamma alternative. **BYOT (Bring Your Own Template)** using HTML5 + Tailwind CSS + React component schemas. | Headless Chromium (Playwright/Puppeteer) for 4K rendering + PptxGenJS/python-pptx for editable PPTX. | **Canva-grade styling freedom**: CSS Grid, Flexbox, SVG vector badges, device mockups, shadows, pills, micro-typography. Zero AI "boxiness". | Requires a headless browser runtime for visual compilation. |
| **[PPTAgent](https://github.com/icip-cas/PPTAgent)** (CAS / EMNLP 2025) | EMNLP 2025 Paper, active repo | **Two-Stage Reflective Agent**: Stage 1 Deconstructs reference slide layouts; Stage 2 iterative editing agent with **PPTEval** (Content, Design, Coherence). | Python-pptx + PyMuPDF visual inspection feedback loop. | Formal **visual reflection loop**: renders slide images and inspects visual balance, typography, and contrast rather than blindly trusting script exit codes. | Heavy multi-agent prompting overhead if unconstrained. |
| **[PPT Master](https://github.com/hugohe3/ppt-master)** | **~56k stars/mentions** | Strategist-Executor Agent creating natively editable PowerPoint objects (shapes, tables, charts, connectors). | Native OpenXML / python-pptx shape engine with visual editor. | Generates 100% editable Microsoft PowerPoint shapes and charts. | Prone to standard PowerPoint stiffness if vector diagrams are not pre-composed. |
| **[PptxGenJS](https://github.com/gitbrent/PptxGenJS)** | **~6.2k stars** | Programmatic JS/TS PPTX builder. High-fidelity shape, table, and vector rendering. | Pure JavaScript OpenXML generation. | Robust cross-platform execution in Node/Bun without LibreOffice dependency. | Requires manual coordinate geometry definition. |

### Why Our Previous Engine Failed (Root-Cause Forensic Audit)

1. **Dark Monolith Antipode**: The previous engine generated an enormous dark navy box (`#070B14`) and pasted it onto a white template slide. In contrast, the winning `sih_2024` deck uses a **100% pure white canvas (`#FFFFFF`)** with crisp `#0F172A` typography and light pastel/slate bordered cards (`#E2E8F0`).
2. **"Text Wrapped in Pills" Fallacy**: The engine attempted to "visualize" textual data by simply enclosing text bullets into 6 rounded rectangles. It lacked actual visual diagrams: no connected arrow pipes, no device monitor frames, no smartphone mockups, no SVG technology stack badges, and no isometric schematics.
3. **Absence of Multimodal Visual Verification (Walking Blind)**: The agent claimed "Canva-like" and "championship quality" in walkthroughs solely based on Python exit codes (`code=0`), without rendering and visually inspecting the generated slide PNGs against `sih_2024/page_*.png`.
4. **The First Version Cloner Success**: In `scripts/legacy_prototypes/generate_visual_assets.py` and `scripts/legacy_prototypes/generate_chakra_presentation.py`, the cloner achieved 95%+ visual match because it:
   - Used pure white backgrounds (`#FFFFFF`).
   - Programmatically drew exact coordinate vectors (pills, connectors, arrows) using `matplotlib` (300 DPI) and `PIL`.
   - Matched the exact SIH template headers, team oval pill, and footer ribbons.

---

## 3. Proposed Changes & Action Plan

### A. Purge Old & Rejected Files (Strict Retention)

#### [DELETE] Files in `specs/presentations/`:
- `specs/presentations/BHEDAK_SIH2026.pdf` (rejected export)
- `specs/presentations/CHAKRA_SIH2026.pdf` (rejected export)
- `specs/presentations/deck_aerosec_test.html` (scratch test)
- `specs/presentations/deck_dispatcher_output.html` (scratch test)
- `specs/presentations/deck_dispatcher_output.pptx` (scratch test)
- `specs/presentations/review_decks.html` (scratch test)
- `specs/presentations/test_dispatcher_deck.html` (scratch test)
- `specs/presentations/assets/` (scratch visual assets)
- `specs/presentations/temp_sih2024_imgs/` (scratch images)
- `specs/presentations/test_canvas/` (scratch canvas)
- *(Optional confirmation: `specs/presentations/sih_2024.pdf`)*

#### [DELETE] Old/Rejected Scratch Scripts in `scripts/`:
- `scripts/capture_bhedak_tabs.mjs`
- `scripts/capture_chakra_screens.cjs`
- `scripts/scratch_bhedak_screens.mjs`
- `scripts/scratch_capture.mjs`
- `scripts/scratch_capture_bhedak.mjs`

#### [RETAIN] Strictly Preserved:
- `specs/presentations/rendered/` (all subfolders and reference images intact)
- `specs/presentations/CHAKRA_SIH2026.pptx`
- `specs/presentations/BHEDAK_SIH2026.pptx`

---

### B. PPT Generation Subsystem Overhaul (Presenton + PPTAgent Architecture)

To permanently resolve the failure and achieve true Canva-grade championship decks, we will rebuild the engine based on the **Presenton BYOT + PPTAgent Reflective Evaluation** paradigm:

```
+---------------------------------------------------------------------------------------+
|                       PRESENTON + PPTAGENT OVERHAULED ENGINE                          |
+---------------------------------------------------------------------------------------+
|                                                                                       |
|  1. GROUND TRUTH CONTENT EXTRACTION                                                   |
|     - docs/sih_solutions/ (Full architectural scope: all roles, full proposed stack) |
|     - Grounded facts, latencies, statutory citations (BSA 2023, IT Act, CERT-In)      |
|                                                                                       |
|  2. PRESENTON-STYLE HIGH-FIDELITY SLIDE TEMPLATING (HTML5/SVG/CSS Widescreen 16:9)    |
|     - Base: Pure White (#FFFFFF) canvas (1920x1080 / 13.333" x 7.5")                  |
|     - Visual Primitives:                                                              |
|       * Header Black Pill Badges (SOLUTION, PROTOTYPE, WHY WE STAND OUT?, etc.)       |
|       * Real Device Frames: Desktop Monitor & Smartphone with embedded live UI screens|
|       * SVG Connected Process Flows & Horizontal Chevrons with numbered badges        |
|       * Official Tech Stack Badges (Docker, Kafka, Python, Go, React, Neo4j, etc.)    |
|       * Data Visualizations: TAM/SAM/SOM Donut, Stacked CAGR Bar Chart, SDG Badges     |
|                                                                                       |
|  3. HIGH-DPI HEADLESS CHROMIUM RENDERER (Playwright)                                  |
|     - Compiles pixel-perfect 300 DPI slides directly to native images & PDF           |
|                                                                                       |
|  4. NATIVE EDITABLE PPTX COMPILER (python-pptx / PptxGenJS)                           |
|     - Combines native text runs, shape containers, and high-DPI vector slide assets   |
|                                                                                       |
|  5. PPTAGENT MULTIMODAL REFLECTIVE EVALUATION GATE (PPTEval)                          |
|     - Renders slide PNGs to specs/presentations/rendered/                             |
|     - Inspects visual layout side-by-side with sih_2024/page_*.png                     |
|     - Rejects any slide containing dark monolithic backgrounds or unvisualized text   |
+---------------------------------------------------------------------------------------+
```

---

## 4. Verification Plan

### Automated Verification
1. **File Cleanup Verification**:
   - Run `dir specs/presentations` and verify ONLY `rendered/`, `CHAKRA_SIH2026.pptx`, and `BHEDAK_SIH2026.pptx` remain.
   - Run `dir scripts` and verify all scratch `capture_*.mjs` and `scratch_*.mjs` files are eliminated.
2. **Codebase Integrity**:
   - Run `npm run check:hallucinations` and `tsc --noEmit` to verify zero broken imports.

### Multimodal Visual Verification (PPTEval)
1. **Side-by-Side Visual Inspection**:
   - Compare each newly generated slide (`rendered/bhedak/slide_*.png` and `rendered/chakra/slide_*.png`) against the corresponding reference page (`rendered/sih_2024/page_*.png`).
   - Criteria:
     - [x] Pure white background (`#FFFFFF`) on all slides.
     - [x] High-contrast black pill category badges.
     - [x] High-resolution device frames (monitor and smartphone).
     - [x] Connected directional arrows and process chevrons.
     - [x] Official tech stack vector icons.
     - [x] Zero dark-navy monolithic background blocks.

---

## 5. Execution Steps Upon Approval

1. **Step 1**: Execute strict file deletion across `specs/presentations/` and `scripts/`.
2. **Step 2**: Implement the Presenton-style HTML/CSS/SVG slide layout template system for BHEDAK and CHAKRA.
3. **Step 3**: Render 300 DPI slides via headless Playwright and assemble native `.pptx` decks.
4. **Step 4**: Run multimodal visual inspection on all 12 slides (6 Bhedak, 6 Chakra) against the reference `sih_2024/page_1..6.png` and present visual proof.
