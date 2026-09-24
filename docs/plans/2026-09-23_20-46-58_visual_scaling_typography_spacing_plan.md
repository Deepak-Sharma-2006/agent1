# Visual Scaling, Typography & Spacing Remediation Plan for Slide 2 (BHEDAK & CHAKRA)

## Executive Summary
A visual inspection of [specs/presentations/rendered/bhedak/slide_2.png](file:///specs/presentations/rendered/bhedak/slide_2.png) and [specs/presentations/rendered/chakra/slide_2.png](file:///specs/presentations/rendered/chakra/slide_2.png) against the championship benchmark [specs/presentations/rendered/sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png) reveals 4 major visual flaws:
1. **Unnatural Vertical Dead-Space below Header**: The header container and top margin pushed the `SOLUTION` pill down, leaving an awkward 60px+ empty band between the deck title and the content area.
2. **Microscopic Solution Bullet Typography**: In 1920x1080 viewport coordinates, the 6 solution bullets were set to `11.8px` (equivalent to ~6pt in PowerPoint). In the 2024 benchmark, these bullets have cap-heights corresponding to `17px - 18px` with bold keyword prefixes and a prominent presence.
3. **Severe Gap above the Status Line**: Because the bullets were set at 11.8px, they occupied only ~100px of height. Combined with `justify-content: space-between` inside a 535px container, a massive 150px+ white void was left between the bullets and the closing status line (`65% completed`).
4. **Compressed & Shoved "Why We Stand Out" Section**: The upper body container consumed 535px plus header margins, pushing "Why We Stand Out" into the bottom 120px of the canvas. This compressed the 4 moat cards, forcing their text down to 11px-13px. In the benchmark, this section occupies ~280px of vertical space with large 38px icons, 17px-18px bold titles, and 14px-15px descriptions.

---

## 1. Visual Geometry & Font Size Mapping (1920x1080 Canvas)

| Visual Element | Benchmark `sih_2024/page_2.png` | Previous Defective Slide 2 | Target Remediated Value |
| :--- | :--- | :--- | :--- |
| **Slide Title ("BHEDAK" / "CHAKRA")** | Centered, ~50px bold black | Centered, 38px bold | **48px, 900 weight, tight header** |
| **Top-to-Solution Pill Gap** | Tight (12px - 16px below title) | ~65px empty dead space | **12px margin below header** |
| **Solution Headline Paragraph** | ~24px - 26px bold, heavy | 18px bold | **23px - 24px, 800 weight, 1.35 line-height** |
| **6-Bullet Solution Grid** | ~17px - 18px with bold prefixes | 11.8px tiny font | **16.5px - 17.5px, bold prefixes, 1.36 line-height** |
| **Bullet-to-Status Line Gap** | Seamless (16px - 20px gap) | 160px+ empty white void | **16px tight gap (flow layout, no space-between void)** |
| **Status Line ("65% completed")** | ~18px - 19px bold | 13.5px | **18px, 800 weight with vibrant blue highlight** |
| **Prototype Header Callout** | Inline with pill, ~19px-20px | 12.5px | **17.5px - 18.5px with bold blue highlights** |
| **Monitor Mockup Stage** | Scaled 2.34:1, ~360px height | 320px height | **370px height, uncropped, contain fit** |
| **Badges Below Monitor** | ~14px bold / 12px subtext | 11.5px / 10px | **13.5px bold / 11.5px subtext** |
| **"Why We Stand Out" Y-Position** | y ≈ 745px (295px vertical zone) | y ≈ 920px (120px crushed zone) | **y ≈ 740px - 750px (generous breathing room)** |
| **Why We Stand Out Cards** | 38px icon, 17px title, 14.5px desc | 24px icon, 13px title, 11px desc | **38px icon, 17px title, 14px desc** |

---

## 2. Proposed Changes

### `scripts/engine/generate_bhedak_slides.mjs`
#### [MODIFY] [generate_bhedak_slides.mjs](file:///scripts/engine/generate_bhedak_slides.mjs)
- **Header Refactoring**:
  - Remove grey divider line (`border-bottom`).
  - Tighten header height to 60px with top padding of 20px.
  - Scale "BHEDAK" title to `font-size: 48px; font-weight: 900; letter-spacing: 1px`.
- **Upper Grid Spacing & Typography**:
  - Set upper grid height to `460px` (leaving 280px+ for "Why We Stand Out").
  - Replace `justify-content: space-between` with natural vertical stacking (`gap: 14px`).
  - Scale solution headline paragraph to `font-size: 23px; font-weight: 800; line-height: 1.32`.
  - Scale 6 solution bullets to `font-size: 16.5px; line-height: 1.35; gap: 14px 20px`. Bullet dot scaled to 22px bold.
  - Scale closing problem-to-solution narrative to `16.5px` and status line to `18px; font-weight: 800`.
- **Right Prototype Stage**:
  - Align `PROTOTYPE` pill with inline callout at `font-size: 17.5px; font-weight: 600`.
  - Maintain 2.342:1 aspect ratio monitor frame with `object-fit: contain` rendering [bhedak_graph.png](file:///specs/presentations/rendered/bhedak_graph.png) at full fidelity.
  - Scale 4 capability badges to `font-size: 13.5px` title and `11.5px` subtitle.
- **"Why We Stand Out" Section**:
  - Pull section start up to `margin-top: 24px`.
  - Scale section pill and inline highlight to `font-size: 16.5px`.
  - Scale 4 cards: 38px vector icons, `font-size: 17px; font-weight: 800` titles, `font-size: 14px` descriptions.

---

### `scripts/engine/generate_chakra_slides.mjs`
#### [MODIFY] [generate_chakra_slides.mjs](file:///scripts/engine/generate_chakra_slides.mjs)
- Apply the identical typographical, spatial, and geometric remediations to `case 2` in `generate_chakra_slides.mjs` using Chakra's verified MHA data:
  - Headline: `Chakra is an autonomous blockchain forensics engine integrated directly into the MHA NCRP & SAHYOG platform, reducing attribution and debit freeze times from 21 days to under 8 minutes.` (23px, 800 weight)
  - 6 Bullets (16.5px font): Multi-Chain Ingestion, Tron TRC-20 Energy Profiler, 4-Pillar Confidence Scorer, Deposit-to-Sweep Clustering, Degree-Bounded Beam Search, MHA SAHYOG API Dispatch.
  - Status Line: `Project CHAKRA is 60% completed; live testing with NCRP mock dockets and Tron node feeds are ongoing.` (18px font)
  - Prototype Callout: `Live NCRP FIR Case Intake with TRON Seed Ingestion & 96.4% Attributed Nearest VASP` (17.5px font)
  - Why We Stand Out (17px titles, 14px descriptions): Sub-8 Min Golden Window, Tron Energy Fee Profiler, BSA 2023 Sec 63(4) Certified, Air-Gapped Sovereign Cloud.

---

## 3. Verification Plan

### Automated Execution & Rendering
1. **Render 4K Slides**:
   ```bash
   node scripts/engine/render_championship_decks.mjs --slide 2
   ```
2. **Visual Inspection via `view_file`**:
   - Inspect newly rendered [specs/presentations/rendered/bhedak/slide_2.png](file:///specs/presentations/rendered/bhedak/slide_2.png).
   - Inspect newly rendered [specs/presentations/rendered/chakra/slide_2.png](file:///specs/presentations/rendered/chakra/slide_2.png).
   - Compare directly against [specs/presentations/rendered/sih_2024/page_2.png](file:///specs/presentations/rendered/sih_2024/page_2.png) to verify:
     - Dead space below header eliminated.
     - Solution bullet text is bold, punchy, and easily readable (16.5px - 17.5px).
     - No empty void above the status line.
     - "Why We Stand Out" sits comfortably with large readable text and icons.
3. **Compliance & Sync**:
   - Run `python -m scripts.orchestrator.spec_sync --sync-brain` to persist plan and walkthrough.
   - Run `npm run lint:markdown` to verify zero LaTeX invariant.
   - Run `npm run check:secrets` to verify zero secret invariant.
