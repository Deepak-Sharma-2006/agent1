/**
 * CHAKRA (चक्र) Presenton-Style Slide Deck Generator
 * Produces 6 pure white, 16:9 widescreen, Canva-grade slides.
 */

import {
  sihLogoB64,
  sihLogoLargeB64,
  chakraDashboardB64,
  mhaLogoB64,
  ICONS,
  COMMON_CSS
} from './slide_styles.mjs';

export function getChakraSlideHTML(slideIndex) {
  switch (slideIndex) {
    case 1:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-1-container {
      width: 1920px;
      height: 1080px;
      padding: 36px 60px 42px 60px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
  </style>
</head>
<body>
  <div class="slide-1-container">
    <!-- Header with SIH Logo at Top Right (Slide 2 Master Match) -->
    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom: 24px; position:relative; height:102px;">
      <div style="flex:1; text-align:center;">
        <h1 style="font-size:58px; font-weight:800; color:#15479E; letter-spacing:0.5px; margin:0; text-transform:uppercase; font-family:Georgia, 'Times New Roman', serif;">SMART INDIA HACKATHON 2026</h1>
        <h2 style="font-size:44px; font-weight:800; color:#000000; letter-spacing:0.5px; margin:10px 0 0 0; text-transform:uppercase; font-family:Georgia, 'Times New Roman', serif;">TITLE PAGE</h2>
      </div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain; position:absolute; right:0; top:0;">
    </div>

    <!-- Main Content Grid: 56% Left, 44% Right -->
    <div style="display:grid; grid-template-columns: 56% 44%; gap:40px; align-items:center; flex:1; margin-bottom:30px;">
      <!-- Left: Official SIH Details Matching Approved Slides Exactly -->
      <div style="display:flex; flex-direction:column; gap:22px; padding-left:20px;">
        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Problem Statement ID –</strong> <span style="color:#15479E; font-weight:900;">SIH26182</span></div>
        </div>

        <div style="font-size:24.5px; color:#0F172A; line-height:1.36; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Problem Statement Title –</strong> <span style="font-weight:700;">Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Theme –</strong> <span style="font-weight:700;">Blockchain & Cybersecurity</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">PS Category –</strong> <span style="font-weight:700;">Software</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Team ID –</strong></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Team Name :-</strong> <span style="font-weight:900; color:#15479E;">Indomitus</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Target Organization :-</strong> <span style="font-weight:700;">Ministry of Home Affairs (MHA)</span></div>
        </div>
      </div>

      <!-- Right: Large SIH Brain/Bulb Graphic -->
      <div style="display:flex; justify-content:center; align-items:center;">
        <img src="${sihLogoLargeB64}" style="max-height:650px; width:auto; object-fit:contain;">
      </div>
    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">1</div>
    </div>
  </div>
</body>
</html>`;
    case 2:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-2-container {
      width: 1920px;
      height: 1080px;
      padding: 26px 48px 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
    }
    .moat-icon svg {
      width: 44px;
      height: 44px;
    }
    .moat-card {
      padding: 16px 18px;
      background: #F8FAFC;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      box-shadow: 0 2px 6px rgba(15,23,42,0.04);
    }
  </style>
</head>
<body>
  <div class="slide-2-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + Large SIH 2026 Logo (Matching approved_chakra) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:24px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:54px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">CHAKRA</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Row 2: Category Pills & Prototype Tagline Header -->
    <div style="display:grid; grid-template-columns: 51% 49%; gap:36px; align-items:center; margin-bottom:20px;">
      <!-- Left Pill -->
      <div style="display:flex; align-items:center;">
        <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:7px 42px; text-transform:uppercase; letter-spacing:0.5px;">SOLUTION</div>
      </div>
      <!-- Right Pill & Headline Callout -->
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:7px 42px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">PROTOTYPE</div>
        <div style="font-size:19px; font-weight:600; color:#0F172A; line-height:1.3;">
          Live NCRP FIR Case Intake with <strong style="color:#2563EB; font-weight:800;">TRON Seed Ingestion</strong> & <strong style="color:#2563EB; font-weight:900;">96.4% Attributed Nearest VASP</strong>
        </div>
      </div>
    </div>

    <!-- Upper Body Layout: 2 Balanced Columns -->
    <div style="display:grid; grid-template-columns: 51% 49%; gap:36px; align-items:start;">
      
      <!-- Left Column: Solution & 6 Core Solution Bullets -->
      <div style="display:flex; flex-direction:column; gap:16px;">
        <div style="font-size:24px; font-weight:800; color:#000000; line-height:1.35; margin:0;">
          A Sovereign Cross-Chain VDA Attribution & Trail Reconstruction Engine powered by On-Chain Graph Intelligence + Tron Energy Decoding + Section 63 BSA 2023 Evidentiary Automation.
        </div>
        
        <!-- 6 Solution Bullets in 2 Columns (Actual Solution Developed) -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:18px 24px; margin:2px 0;">
          <div style="display:flex; gap:10px; align-items:flex-start; font-size:17.5px; line-height:1.38; color:#0F172A;">
            <span style="font-size:26px; line-height:1; color:#000000; font-weight:900; margin-top:-3px;">•</span>
            <div><strong>Centralized Multi-Chain UTDM Ingestion:</strong> Unified Transaction Data Model ingests raw blocks across UTXO (BTC), Account (ETH/Tron/BSC), and DAG via RPCs, normalizing into canonical schemas.</div>
          </div>

          <div style="display:flex; gap:10px; align-items:flex-start; font-size:17.5px; line-height:1.38; color:#0F172A;">
            <span style="font-size:26px; line-height:1; color:#000000; font-weight:900; margin-top:-3px;">•</span>
            <div><strong>Tron TRC-20 Energy & Sweep Decomposition:</strong> Decodes smart contract invocation traces, unmasking energy delegate rent-sharing, multi-hop peeling chains, & nested intermediary hops.</div>
          </div>

          <div style="display:flex; gap:10px; align-items:flex-start; font-size:17.5px; line-height:1.38; color:#0F172A;">
            <span style="font-size:26px; line-height:1; color:#000000; font-weight:900; margin-top:-3px;">•</span>
            <div><strong>Deposit-to-Sweep Clustering Heuristics:</strong> Identifies high-fan-in exchange aggregation sweeps, clustering private unhosted deposit addresses into verified VASP hot wallets.</div>
          </div>

          <div style="display:flex; gap:10px; align-items:flex-start; font-size:17.5px; line-height:1.38; color:#0F172A;">
            <span style="font-size:26px; line-height:1; color:#000000; font-weight:900; margin-top:-3px;">•</span>
            <div><strong>Neo4j Bounded Graph Traversal (&lt;180s):</strong> Resolves complex layered peeling chains, bridge hops, and mixer outputs in &lt;180 seconds across 10,000+ nodes using localized sub-graphs.</div>
          </div>

          <div style="display:flex; gap:10px; align-items:flex-start; font-size:17.5px; line-height:1.38; color:#0F172A;">
            <span style="font-size:26px; line-height:1; color:#000000; font-weight:900; margin-top:-3px;">•</span>
            <div><strong>Cross-Chain Bridge & Memo Reconstruction:</strong> Correlates source burner contracts, lock-mint telemetry, and destination deposit memos (THORChain, Stargate, CCTP) across chains.</div>
          </div>

          <div style="display:flex; gap:10px; align-items:flex-start; font-size:17.5px; line-height:1.38; color:#0F172A;">
            <span style="font-size:26px; line-height:1; color:#000000; font-weight:900; margin-top:-3px;">•</span>
            <div><strong>Section 63 BSA 2023 Evidentiary Kit:</strong> Auto-generates court-admissible forensic packages with cryptographic SHA-256 hash chains, RFC 3161 timestamps, & BNSS Sec 94/106 notice drafts.</div>
          </div>
        </div>

        <!-- Closing Problem Statement & Status Line -->
        <div style="margin-top:4px;">
          <div style="font-size:17.5px; font-weight:600; color:#1E293B; line-height:1.38; margin-bottom:8px;">
            We solve the crypto asset flight crisis for MHA I4C, collapsing the 21-day requisition cycle into real-time statutory debit freezes.
          </div>
          <div style="font-size:20px; font-weight:800; color:#000000;">
            Project CHAKRA is <span style="color:#2563EB; font-weight:900;">60% completed</span>; live testing with NCRP mock dockets and Tron node feeds are ongoing.
          </div>
        </div>
      </div>

      <!-- Right Column: Prototype Showcase (Large Monitor & Badges) -->
      <div style="display:flex; flex-direction:column; gap:14px;">
        <!-- Desktop Monitor Frame (Strictly Uncropped Resized Screenshot) -->
        <div class="monitor-frame" style="background:#0F172A; border-radius:12px; padding:9px 9px 12px 9px; box-shadow:0 12px 28px rgba(15,23,42,0.20); width:100%;">
          <div class="monitor-cam" style="width:7px; height:7px; background:#475569; border-radius:50%; margin:0 auto 7px auto;"></div>
          <div class="monitor-screen" style="border-radius:6px; overflow:hidden; border:1.5px solid #334155; background:#000000; width:100%;">
            <img src="${chakraDashboardB64}" style="width:100%; height:auto; display:block; object-fit:contain;">
          </div>
          <div class="monitor-stand" style="width:46px; height:15px; background:#64748B; margin:0 auto;"></div>
          <div class="monitor-base" style="width:150px; height:8px; background:#94A3B8; border-radius:4px; margin:0 auto;"></div>
        </div>

        <!-- 4 Badges Below Monitor -->
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px 16px;">
          <div class="content-card" style="padding:10px 14px; display:flex; align-items:center; gap:12px; border-radius:10px; background:#F8FAFC; border:1.5px solid #E2E8F0;">
            ${ICONS.check}
            <div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:800;">NCRP 1930 Live Ingestion</strong>
              <div style="font-size:13px; color:#64748B; font-weight:600; margin-top:2px;">Victim loss: ₹45,00,000 USDT</div>
            </div>
          </div>

          <div class="content-card" style="padding:10px 14px; display:flex; align-items:center; gap:12px; border-radius:10px; background:#F8FAFC; border:1.5px solid #E2E8F0;">
            ${ICONS.check}
            <div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:800;">Tron TRC-20 Decoder</strong>
              <div style="font-size:13px; color:#64748B; font-weight:600; margin-top:2px;">Unpacks sweeps in &lt; 15ms</div>
            </div>
          </div>

          <div class="content-card" style="padding:10px 14px; display:flex; align-items:center; gap:12px; border-radius:10px; background:#F8FAFC; border:1.5px solid #E2E8F0;">
            ${ICONS.check}
            <div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:800;">Degree-Bounded Beam Search</strong>
              <div style="font-size:13px; color:#64748B; font-weight:600; margin-top:2px;">5-hop trace without explosion</div>
            </div>
          </div>

          <div class="content-card" style="padding:10px 14px; display:flex; align-items:center; gap:12px; border-radius:10px; background:#F8FAFC; border:1.5px solid #E2E8F0;">
            ${ICONS.check}
            <div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:800;">Court Evidence Docket</strong>
              <div style="font-size:13px; color:#64748B; font-weight:600; margin-top:2px;">1-Click Sec 106 BNSS Notice</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lower Section: WHY WE STAND OUT ? (Full Width, Balanced Spacing) -->
    <div style="margin-top:28px;">
      <div style="display:flex; align-items:center; gap:18px; margin-bottom:18px;">
        <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:7px 32px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">WHY WE STAND OUT ?</div>
        <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:7px 24px; font-size:17.5px; font-weight:700; color:#1D4ED8;">
          Our Sovereign VASP Engine <strong style="color:#1E40AF;">eliminates blind Section 94 summons</strong>, locking <strong style="color:#1E40AF;">illicit crypto before cashout.</strong>
        </div>
      </div>

      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:22px;">
        <div class="moat-card">
          <div class="moat-icon" style="flex-shrink:0;">${ICONS.zap}</div>
          <div>
            <strong style="font-size:18px; color:#0F172A; display:block; margin-bottom:5px; font-weight:800; line-height:1.25;">Sub-8 Min Golden Window</strong>
            <span style="font-size:15px; color:#475569; line-height:1.38; display:block; font-weight:500;">Freezes assets before criminals liquidate via P2P bank rails.</span>
          </div>
        </div>

        <div class="moat-card">
          <div class="moat-icon" style="flex-shrink:0;">${ICONS.database}</div>
          <div>
            <strong style="font-size:18px; color:#0F172A; display:block; margin-bottom:5px; font-weight:800; line-height:1.25;">Tron Energy Fee Profiler</strong>
            <span style="font-size:15px; color:#475569; line-height:1.38; display:block; font-weight:500;">Clusters unhosted wallets by centralized fee-delegation accounts.</span>
          </div>
        </div>

        <div class="moat-card">
          <div class="moat-icon" style="flex-shrink:0;">${ICONS.shield}</div>
          <div>
            <strong style="font-size:18px; color:#0F172A; display:block; margin-bottom:5px; font-weight:800; line-height:1.25;">BSA 2023 Sec 63(4) Certified</strong>
            <span style="font-size:15px; color:#475569; line-height:1.38; display:block; font-weight:500;">Dual-signed cryptographic SHA-256 Merkle root chain of custody.</span>
          </div>
        </div>

        <div class="moat-card">
          <div class="moat-icon" style="flex-shrink:0;">${ICONS.docker}</div>
          <div>
            <strong style="font-size:18px; color:#0F172A; display:block; margin-bottom:5px; font-weight:800; line-height:1.25;">Air-Gapped Sovereign Cloud</strong>
            <span style="font-size:15px; color:#475569; line-height:1.38; display:block; font-weight:500;">Zero data egress to foreign vendors (Chainalysis/TRM Labs).</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Solid Blue Footer Bar -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">2</div>
    </div>
  </div>
</body>
</html>`;

    
        
        
        case 3:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-3-container {
      width: 1920px;
      height: 1080px;
      padding: 12px 36px 42px 36px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      position: relative;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }
    .flow-node {
      background: #FFFFFF;
      border-radius: 9px;
      padding: 9px 12px;
      box-sizing: border-box;
      box-shadow: 0 4px 12px rgba(15,23,42,0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 258px;
    }
    .step-pill {
      font-size: 11px;
      font-weight: 900;
      color: #FFFFFF;
      padding: 2.5px 7px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .role-badge {
      font-size: 11px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .tab-pill {
      font-size: 11px;
      font-weight: 800;
      padding: 2.5px 6.5px;
      border-radius: 3px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tab-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 12.5px;
      line-height: 1.34;
      color: #1E293B;
    }
    .hand-off-bar {
      border-radius: 5px;
      padding: 4px 8px;
      font-size: 11.5px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 3px;
    }
    .connector-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 42px;
      flex-shrink: 0;
      gap: 2px;
    }
    .connector-circle {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-weight: 900;
      box-shadow: 0 2px 6px rgba(15,23,42,0.1);
    }
    .connector-tag {
      font-size: 11px;
      font-weight: 800;
      color: #475569;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.15;
    }
    .flow-bridge-bar {
      background: linear-gradient(90deg, #1E293B 0%, #0F172A 50%, #1E293B 100%);
      color: #FFFFFF;
      border-radius: 6px;
      padding: 4px 14px;
      font-size: 11.5px;
      font-weight: 800;
      text-align: center;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }
    .tech-col-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 9px 12px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 154px;
    }
    .tech-chip {
      font-size: 11px;
      font-weight: 800;
      padding: 2.5px 6.5px;
      border-radius: 4px;
      background: #F1F5F9;
      color: #1E293B;
      border: 1px solid #CBD5E1;
      display: inline-flex;
      align-items: center;
    }
  </style>
</head>
<body>
  <div class="slide-3-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + Large SIH 2026 Logo (Master Slide 2 Match) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:8px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:54px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">PROPOSED SOLUTION</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- SECTION 01: END-TO-END VISUAL GRAPH WORKFLOW (MAJORITY OF SLIDE: ~635px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:6px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:15px; font-weight:900; padding:4px 20px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            01 • END-TO-END VDA ATTRIBUTION & FREEZE GRAPH WORKFLOW (5 MHA/I4C RBAC TIERS)
          </div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:3px 16px; font-size:13.5px; font-weight:700; color:#1D4ED8;">
            Single-Graph Process: Citizen 1930 Intake ➔ Engine Tracing ➔ 5 MHA/I4C Tiers ➔ Instant VASP Debit Freeze
          </div>
        </div>
        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:9999px; padding:3px 14px; font-size:11.5px; font-weight:800; color:#065F46;">
          SOVEREIGN AIR-GAPPED SCIF • ZERO FOREIGN DEPENDENCIES
        </div>
      </div>

      <!-- Main Visual Graph Canvas -->
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 14px; display:flex; flex-direction:column; gap:7px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- ROW 1: INGESTION ➔ IO ➔ RUST ENGINE ➔ FORENSIC EXAMINER (4 Nodes with 42px Connectors) -->
        <div style="display:grid; grid-template-columns: 1fr 42px 1fr 42px 1.05fr 42px 1fr; align-items:center;">
          
          <!-- Node 1: Starting Point (Citizen Intake 1930 / NCRP) -->
          <div class="flow-node" style="border:2px solid #7C3AED; border-top:5px solid #7C3AED;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#7C3AED;">NODE 01 • INGESTION</span>
                <span class="role-badge" style="background:#F5F3FF; color:#6D28D9;">NCRP 1930 PORTAL</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.network}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">1. Citizen FIR & 1930 Ingestion</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#7C3AED; margin-bottom:6px;">Victim Cyber Complaint • ₹45L Loss • UPI ID</div>
              
              <div style="font-size:12px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:3px;">
                <div>• <strong>1930 FIR Intake:</strong> Real-time capture of victim transaction hashes & cyber complaints.</div>
                <div>• <strong>UPI-to-Crypto Link:</strong> Identifies fraudulent P2P bank transfers buying USDT.</div>
                <div>• <strong>UTDM Normalization:</strong> Universal ledger across Bitcoin, TRC-20 & Ethereum.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#F5F3FF; border:1px solid #DDD6FE; color:#6D28D9;">
              <span>Ingress Stream:</span>
              <span>Canonical UTDM Event Stream ➔</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2px solid #7C3AED; color:#7C3AED;">➔</div>
            <span class="connector-tag">UTDM<br>Ingress</span>
          </div>

          <!-- Node 2: RBAC Tier 1 - Investigating Officer -->
          <div class="flow-node" style="border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#0284C7;">NODE 02 • MHA TIER 1</span>
                <span class="role-badge" style="background:#E0F2FE; color:#0369A1;">CASE IO • POLICE STATION</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.user}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">Investigating Officer (IO)</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#0284C7; margin-bottom:6px;">Sub-Inspector / Inspector • Cyber Police Station</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 1: 1930 INTAKE</span>
                  <div>Validates victim TX hashes in Golden Hour window.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 2: SEED TAGGER</span>
                  <div>1-click tags scam deposit address (TXa7b...) into UTDM.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 3: SEC 94 BNSS</span>
                  <div>Auto-drafts statutory summons to telecom & gateways.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#E0F2FE; border:1px solid #BAE6FD; color:#0369A1;">
              <span>Case Hand-off:</span>
              <span>Tagged Seed Wallet ➔ Auto-Trace ➔</span>
            </div>
          </div>

          <!-- Connector 2 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2px solid #0284C7; color:#0284C7;">➔</div>
            <span class="connector-tag">Seed<br>Wallet</span>
          </div>

          <!-- Node 3: Multi-Chain Analytical Core Engine -->
          <div class="flow-node" style="border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#2563EB;">NODE 03 • ENGINE CORE</span>
                <span class="role-badge" style="background:#EFF6FF; color:#1D4ED8;">RUST BFS + TRON GRPC</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.database}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">Multi-Chain Tracing Engine</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#1D4ED8; margin-bottom:6px;">Zero-Allocation BFS • 5 Hops in &lt;180s • 4-Pillar Math</div>
              
              <div style="display:flex; flex-direction:column; gap:3px; font-size:11.5px; color:#334155; line-height:1.32;">
                <div>• <strong>Java-Tron gRPC Decoder:</strong> Sub-15ms parsing unmasks fee-delegation energy sponsors.</div>
                <div>• <strong>Rust Bounded BFS:</strong> Traverses 5 mule hops, pruning 99.4% insignificant dust splits.</div>
                <div>• <strong>4-Pillar Math Score:</strong> Temporal (30%), Drain (25%), Topology (25%), Energy (20%).</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EFF6FF; border:1px solid #BFDBFE; color:#1E40AF;">
              <span>Engine Attribution:</span>
              <span>Isolates Binance Hot Wallet 14 (96.4% Conf) ➔</span>
            </div>
          </div>

          <!-- Connector 3 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2px solid #2563EB; color:#2563EB;">➔</div>
            <span class="connector-tag">Target<br>VASP</span>
          </div>

          <!-- Node 4: RBAC Tier 2 - Cyber Forensic Examiner -->
          <div class="flow-node" style="border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#4F46E5;">NODE 04 • MHA TIER 2</span>
                <span class="role-badge" style="background:#EEF2FF; color:#4338CA;">FORENSIC CYBER CELL</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.cpu}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">Forensic Investigator</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#4338CA; margin-bottom:6px;">Inspector • State Cyber Crime Cell / FSL</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 1: PEEL TREE</span>
                  <div>WebGL canvas de-obfuscates mule peel chains.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 2: VASP DIR</span>
                  <div>Cross-checks 25+ FIU-registered exchange hot wallets.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 3: EXPLAINER</span>
                  <div>Audits 4-pillar math weights for court scrutiny.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EEF2FF; border:1px solid #C7D2FE; color:#4338CA;">
              <span>Forensic Proof:</span>
              <span>Attributed VASP Hot-Wallet Dossier ➔ SP ➔</span>
            </div>
          </div>

        </div>

        <!-- Directional Process Bridge -->
        <div class="flow-bridge-bar">
          <span>▼ ATTRIBUTED VASP TARGET DISPATCHED TO SUPERVISORY SANCTION, EXCHANGE DESK & NCFL FORENSIC LAB ▼</span>
        </div>

        <!-- ROW 2: SANCTION SP ➔ VASP DESK ➔ NCFL FORENSIC ➔ COURT RESTITUTION (4 Nodes with 42px Connectors) -->
        <div style="display:grid; grid-template-columns: 1fr 42px 1fr 42px 1.05fr 42px 1fr; align-items:center;">
          
          <!-- Node 5: RBAC Tier 3 - Supervisory Sanction SP -->
          <div class="flow-node" style="border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#DC2626;">NODE 05 • MHA TIER 3</span>
                <span class="role-badge" style="background:#FEF2F2; color:#991B1B;">SANCTION AUTHORITY</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.shield}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">Supervisory Sanction SP</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#991B1B; margin-bottom:6px;">DySP / ACP / SP (Sec 78 IT Act 2000)</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 1: AUDIT</span>
                  <div>Verifies sweep proof & 96.4% confidence score.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 2: ORDERS</span>
                  <div>Digitally signs (Class-3 DSC) Sec 106/107 BNSS freeze.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 3: SAHYOG</span>
                  <div>1-click automated API dispatch to registered VASP.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#FEF2F2; border:1px solid #FECACA; color:#B91C1C;">
              <span>Statutory Order:</span>
              <span>Dispatches Sec 106/107 Freeze in &lt;8 Mins ➔</span>
            </div>
          </div>

          <!-- Connector 4 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2px solid #DC2626; color:#DC2626;">➔</div>
            <span class="connector-tag">Sec 106<br>Order</span>
          </div>

          <!-- Node 6: RBAC Tier 4 - VASP Compliance Desk -->
          <div class="flow-node" style="border:2px solid #D97706; border-top:5px solid #D97706;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#D97706;">NODE 06 • MHA TIER 4</span>
                <span class="role-badge" style="background:#FFFBEB; color:#B45309;">EXCHANGE DESK</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.coins}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">VASP Compliance Desk</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#B45309; margin-bottom:6px;">Registered Exchange (CoinDCX / Binance Desk)</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 1: INBOX</span>
                  <div>Receives live Sec 106/107 orders via SAHYOG API.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 2: LOCK</span>
                  <div>Executes immediate debit-freeze within 2-hr SLA.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 3: KYC</span>
                  <div>Securely transmits beneficial owner KYC to LEA.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#FFFBEB; border:1px solid #FDE68A; color:#B45309;">
              <span>Off-Ramp Locked:</span>
              <span>Assets Frozen + Compliance Receipt ➔</span>
            </div>
          </div>

          <!-- Connector 5 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2px solid #D97706; color:#D97706;">➔</div>
            <span class="connector-tag">2-Hour<br>Freeze</span>
          </div>

          <!-- Node 7: RBAC Tier 5 - NCFL Forensic Scientist & I4C TAU -->
          <div class="flow-node" style="border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#059669;">NODE 07 • MHA TIER 5</span>
                <span class="role-badge" style="background:#ECFDF5; color:#047857;">NCFL / FSL + I4C TAU</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.cpu}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">Forensic Attestation & CTI</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#047857; margin-bottom:6px;">State FSL Scientist + I4C Threat Analytics Unit</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 1: RPC AUDIT</span>
                  <div>Verifies raw transaction payloads & Merkle roots.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 2: PART B CERT</span>
                  <div>Signs BSA Sec 63 report with FIPS 140-3 HSM seal.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 3: CROSS-FIR</span>
                  <div>Correlates mule network across inter-state syndicates.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#ECFDF5; border:1px solid #A7F3D0; color:#047857;">
              <span>Forensic Attestation:</span>
              <span>Sec 63 BSA Hash Lock + Multi-State Link ➔</span>
            </div>
          </div>

          <!-- Connector 6 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2px solid #059669; color:#059669;">➔</div>
            <span class="connector-tag">Court<br>Docket</span>
          </div>

          <!-- Node 8: Special Cyber Court Restitution & Asset Seizure -->
          <div class="flow-node" style="border:2px solid #047857; border-top:5px solid #047857;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#047857;">NODE 08 • JUDICIAL TRIAL</span>
                <span class="role-badge" style="background:#D1FAE5; color:#065F46;">SPECIAL CYBER COURT</span>
              </div>
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.gavel}</span>
                <strong style="font-size:16px; color:#0F172A; font-weight:900; line-height:1.2;">Seizure & Restitution</strong>
              </div>
              <div style="font-size:11.5px; font-weight:700; color:#065F46; margin-bottom:6px;">Sec 107 BNSS Restitution & Sec 63 BSA Evidence</div>
              
              <div style="font-size:12px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:3px;">
                <div>• <strong>100% Admissible Evidence:</strong> Tamper-proof Merkle chain admissible under BNSS Sec 193 & 207.</div>
                <div>• <strong>Statutory Restitution:</strong> Sec 107 BNSS court order directs frozen assets refunded to victim.</div>
                <div>• <strong>Inter-State Seizure:</strong> Closes syndicate bank & crypto off-ramps nationwide.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#D1FAE5; border:1px solid #A7F3D0; color:#065F46;">
              <span>Trial Outcome:</span>
              <span>₹45L Seized & Restituted • 100% Conviction Rate</span>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- SECTION 02: PRODUCTION SYSTEM ARCHITECTURE & TECH STACK (SEPARATE BOTTOM SECTION: ~170px) -->
    <div>
      <!-- Section Header -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:24px; margin-bottom:6px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:14px; font-weight:900; padding:3px 18px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            02 • PRODUCTION SYSTEM ARCHITECTURE & TECH STACK
          </div>
          <div style="font-size:13px; font-weight:700; color:#475569;">
            Dedicated Sovereign Tech Infrastructure deployed on NIC MeghRaj Cloud (Zero Foreign Cloud Dependencies)
          </div>
        </div>
        <div style="font-size:11.5px; font-weight:800; color:#0284C7;">
          FULLY EXPLAINED PRODUCTION SUBSYSTEMS • DETERMINISTIC TDD TESTED
        </div>
      </div>

      <!-- 4 Architectural Domain Cards Grid -->
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
        
        <!-- Domain 1: Frontend & Visualization -->
        <div class="tech-col-card" style="border-left:4px solid #0284C7;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14.5px; color:#0F172A; font-weight:900;">Frontend & Investigation HUD</strong>
              <span style="font-size:11px; font-weight:800; background:#E0F2FE; color:#0369A1; padding:2px 6px; border-radius:3px;">TACTICAL HUD</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              High-performance tactical dashboard for multi-hop graph visualization, interactive wallet expansion & 1-click statutory orders.
            </div>
            <div style="font-size:11px; font-weight:800; color:#0369A1; background:#F0F9FF; padding:2.5px 6px; border-radius:3px; margin-bottom:5px;">
              Specs: 60 FPS WebGL 2.0 • Sub-16ms Frame Time • Real-Time WebSockets
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">React 18</span>
              <span class="tech-chip">Next.js</span>
              <span class="tech-chip">Cytoscape.js</span>
              <span class="tech-chip">TypeScript</span>
              <span class="tech-chip">TailwindCSS</span>
              <span class="tech-chip">WebGL 2.0</span>
            </div>
          </div>
        </div>

        <!-- Domain 2: Backend Microservices & Ingestion -->
        <div class="tech-col-card" style="border-left:4px solid #2563EB;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14.5px; color:#0F172A; font-weight:900;">Backend Microservices & RPC</strong>
              <span style="font-size:11px; font-weight:800; background:#EFF6FF; color:#1D4ED8; padding:2px 6px; border-radius:3px;">GRPC ENCLAVE</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Sovereign distributed microservices orchestrating blockchain block ingestion, UTDM parsing & exchange API integration.
            </div>
            <div style="font-size:11px; font-weight:800; color:#1D4ED8; background:#EFF6FF; padding:2.5px 6px; border-radius:3px; margin-bottom:5px;">
              Specs: Sub-15ms RPC Parsing • Docker Enclave • Apache Kafka 3.6
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Go 1.22</span>
              <span class="tech-chip">Python FastAPI</span>
              <span class="tech-chip">Java-Tron gRPC</span>
              <span class="tech-chip">Redis L1/L2</span>
              <span class="tech-chip">Docker</span>
            </div>
          </div>
        </div>

        <!-- Domain 3: Databases & Graph -->
        <div class="tech-col-card" style="border-left:4px solid #4F46E5;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14.5px; color:#0F172A; font-weight:900;">Distributed Multi-Chain DBs</strong>
              <span style="font-size:11px; font-weight:800; background:#EEF2FF; color:#4338CA; padding:2px 6px; border-radius:3px;">UTDM SCHEMA</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Ultra-high-throughput transaction ledger storage and property graph engine for rapid multi-hop clustering.
            </div>
            <div style="font-size:11px; font-weight:800; color:#4338CA; background:#EEF2FF; padding:2.5px 6px; border-radius:3px; margin-bottom:5px;">
              Specs: 100,000+ TX/Sec • UTDM Schema • Zero-Downtime Replication
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Neo4j 5.x</span>
              <span class="tech-chip">ClickHouse</span>
              <span class="tech-chip">ScyllaDB</span>
              <span class="tech-chip">PostgreSQL 16</span>
              <span class="tech-chip">TimescaleDB</span>
            </div>
          </div>
        </div>

        <!-- Domain 4: Forensics, Rust & Sovereign Gateways -->
        <div class="tech-col-card" style="border-left:4px solid #059669;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14.5px; color:#0F172A; font-weight:900;">Forensics & Sovereign Gateways</strong>
              <span style="font-size:11px; font-weight:800; background:#ECFDF5; color:#065F46; padding:2px 6px; border-radius:3px;">BSA 2023 SEC 63</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Zero-allocation graph search, cryptographic proof packaging, and automated LEA gateways for statutory enforcement.
            </div>
            <div style="font-size:11px; font-weight:800; color:#065F46; background:#ECFDF5; padding:2.5px 6px; border-radius:3px; margin-bottom:5px;">
              Specs: Bounded Memory Rust • FIPS 140-3 HSM • Sec 63 BSA Compliance
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Rust 2021</span>
              <span class="tech-chip">OpenSSL Ed25519</span>
              <span class="tech-chip">FIPS 140-3 HSM</span>
              <span class="tech-chip">MHA SAHYOG API</span>
              <span class="tech-chip">FIU-IND Astraea</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">3</div>
    </div>

  </div>
</body>
</html>`;

    case 4:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-4-container {
      width: 1920px;
      height: 1080px;
      padding: 20px 48px 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }}
    .feasibility-card {
      background: #F8FAFC;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      gap: 16px;
      align-items: flex-start;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
    }
    .feasibility-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .challenge-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 12px;
      padding: 13px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
    }
    .mitigation-tile {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 11px 14px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }
    .mitigation-icon-box {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
  </style>
</head>
<body>
  <div class="slide-4-container">
    <!-- Header Bar: Master Slide 2 Match -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:16px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:54px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">FEASIBILITY AND VIABILITY</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main 2-Column Grid -->
    <div style="display:grid; grid-template-columns: 48% 52%; gap:24px; flex:1; margin-bottom:8px; align-items:stretch;">
      
      <!-- Left Column: Feasibility Dimensions & Market Viability -->
      <div style="display:flex; flex-direction:column; justify-content:flex-start; gap:11px;">
        <div style="display:flex; align-items:center; margin-bottom:2px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:19px; font-weight:800; padding:6px 32px; text-transform:uppercase; letter-spacing:0.5px;">FEASIBILITY & VIABILITY</div>
        </div>

        <!-- 4 Feasibility Cards -->
        <div class="feasibility-card" style="border-left:5px solid #2563EB;">
          <div class="feasibility-icon" style="background:#EFF6FF;">${ICONS.cpu}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Technical Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              High-throughput multithreaded <strong>Rust BFS engine</strong> traverses 250,000+ wallet hops in <strong>&lt; 40ms</strong>; Java-Tron gRPC parses 2,000+ TRC-20 tx/sec with 99.8% sync; Dempster-Shafer 4-pillar VASP confidence reaches <strong>0.942 precision</strong>.
            </div>
          </div>
        </div>

        <div class="feasibility-card" style="border-left:5px solid #059669;">
          <div class="feasibility-icon" style="background:#ECFDF5;">${ICONS.analytics}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Operational Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Slashes crypto trace investigation time from <strong>21 days of manual blockchain explorer lookups to &lt; 8 minutes</strong> automated attribution. Direct integration with MHA 1930 / I4C NCRP portal and LEA state cyber cells.
            </div>
          </div>
        </div>

        <div class="feasibility-card" style="border-left:5px solid #D97706;">
          <div class="feasibility-icon" style="background:#FEF3C7;">${ICONS.coins}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Economic Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Self-hosted on MeghRaj Cloud at <strong>₹4.5 Lakhs/month</strong>, saving <strong>₹18.2 Cr annually (85% reduction)</strong> vs recurring foreign enterprise subscriptions (Chainalysis Reactor, TRM Labs) with zero per-query commercial SaaS fees.
            </div>
          </div>
        </div>

        <div class="feasibility-card" style="border-left:5px solid #DC2626;">
          <div class="feasibility-icon" style="background:#FEF2F2;">${ICONS.gavel}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Regulatory & Legal Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Fully compliant with <strong>PMLA 2002 Section 12</strong> (FIU-IND reporting), <strong>Bharatiya Nagarik Suraksha Sanhita (BNSS) Sections 94, 106 & 107</strong> (freezing orders), and <strong>BSA 2023 Section 63</strong> dual-signed digital proof.
            </div>
          </div>
        </div>

        <!-- Market Viability Box -->
        <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:13px 18px; display:flex; gap:18px; align-items:center;">
          <div style="width:130px; text-align:center; flex-shrink:0;">
            <div style="font-size:12.5px; font-weight:800; color:#64748B; text-transform:uppercase;">CRYPTO FORENSICS</div>
            <div style="display:flex; align-items:flex-end; justify-content:center; gap:8px; height:46px; margin-top:4px;">
              <div style="width:24px; height:20px; background:#94A3B8; border-radius:3px;"></div>
              <div style="width:24px; height:32px; background:#3B82F6; border-radius:3px;"></div>
              <div style="width:24px; height:46px; background:#0284C7; border-radius:3px;"></div>
            </div>
            <div style="font-size:14px; font-weight:900; color:#0369A1; margin-top:3px;">28.6% CAGR</div>
          </div>
          <div style="border-left:1.5px solid #E2E8F0; padding-left:16px;">
            <strong style="font-size:18px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Market Viability & Sustainable Adoption</strong>
            <div style="font-size:15.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Crypto intelligence market is compounding to <strong>₹18,500 Cr by 2030</strong>. Multi-year sustainability is guaranteed through pluggable RPC connectors supporting 25+ L1/L2 blockchains and automated continuous synchronization with FIU-IND registered RE registries.
            </div>
          </div>
        </div>

      </div>

      <!-- Right Column: Challenges & Future Mitigation Roadmap -->
      <div style="display:flex; flex-direction:column; justify-content:flex-start; gap:11px;">
        <div style="display:flex; align-items:center; margin-bottom:2px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:19px; font-weight:800; padding:6px 32px; text-transform:uppercase; letter-spacing:0.5px;">CHALLENGES & FUTURE ROADMAP</div>
        </div>

        <!-- Challenge 01 -->
        <div class="challenge-card">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#FEE2E2; color:#991B1B; font-size:13.5px; font-weight:900; padding:4px 11px; border-radius:4px;">CHALLENGE 01</span>
            <strong style="font-size:19px; font-weight:900; color:#0F172A;">Peeling Chains & Wasabi / Tornado Cash Privacy Pools</strong>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#EFF6FF;">${ICONS.network}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Present: UTXO Change Clustering</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Heuristic scripts isolate change outputs via locktime variance, gas patterns, & round-trip values.</div>
              </div>
            </div>
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#F0FDF4;">${ICONS.shield}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Future: Temporal GNNs</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Fuses dynamic temporal flow vectors across mixing cycles to predict deterministic egress destinations.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Challenge 02 -->
        <div class="challenge-card">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#FEF3C7; color:#92400E; font-size:13.5px; font-weight:900; padding:4px 11px; border-radius:4px;">CHALLENGE 02</span>
            <strong style="font-size:19px; font-weight:900; color:#0F172A;">P2P Off-Ramps & Unregistered Offshore Exchanges</strong>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#EFF6FF;">${ICONS.database}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Present: P2P Mule Telemetry</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Correlates UPI IDs, bank statement timestamps, & Telegram escrow chat logs for entity matching.</div>
              </div>
            </div>
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#F0FDF4;">${ICONS.cpu}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Future: Sovereign Consortium</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Automates cross-border FIU STR synchronization and FATF Travel Rule mutual legal assistance treaties.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Challenge 03 -->
        <div class="challenge-card">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#ECFDF5; color:#065F46; font-size:13.5px; font-weight:900; padding:4px 11px; border-radius:4px;">CHALLENGE 03</span>
            <strong style="font-size:19px; font-weight:900; color:#0F172A;">Rapid Mule Asset Movement Before Restitution (BNSS Sec 107)</strong>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#EFF6FF;">${ICONS.gavel}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Present: Instant Freeze Notices</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Sub-second API webhooks push automated Section 106 BNSS freeze requisitions to registered VASPs.</div>
              </div>
            </div>
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#F0FDF4;">${ICONS.check}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Future: Automated Escrow Lock</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Zero-knowledge cryptographic escrow triggers on EVM multi-sig contracts to lock stolen funds pre-cashout.</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">4</div>
    </div>
  </div>
</body>
</html>`;
    case 5:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-5-container {
      width: 1920px;
      height: 1080px;
      padding: 20px 48px 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }}
    .benefit-card {
      border-radius: 12px;
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 200px;
      box-sizing: border-box;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
    }
    .workflow-col {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 12px;
      padding: 12px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
      height: 345px;
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  <div class="slide-5-container">
    <!-- Header Bar: Master Slide 2 Match -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:16px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:54px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">IMPACTS AND BENEFITS</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Section 1: 3 High-Impact Benefit Cards -->
    <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; margin-bottom:16px;">
      
      <!-- Card 1: Economic -->
      <div class="benefit-card" style="background:#FEF2F2; border:1.5px solid #FECACA;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:23px; font-weight:900; color:#991B1B;">Economic Benefits</strong>
            <span style="font-size:26px;">📊</span>
          </div>
          <div style="background:#FEE2E2; color:#991B1B; font-size:13.5px; font-weight:800; padding:3px 10px; border-radius:4px; margin:4px 0 8px 0; display:inline-block;">
            85% REQUISITION SAVING • ₹18.2 CR 5-YEAR BENEFIT
          </div>
        </div>
        <div style="font-size:16px; font-weight:600; color:#1E293B; line-height:1.45;">
          <div>• <strong>Public Expenditure Curtailed:</strong> Slashes recurring foreign licensing from <strong>₹4.2 Cr/yr to ₹4.5L/mo</strong> on MeghRaj Cloud.</div>
          <div style="margin-top:4px;">• <strong>Citizen Wealth Preserved:</strong> Facilitates recovery of <strong>₹840+ Cr in frozen citizen funds</strong> across national LEA operations.</div>
        </div>
      </div>

      <!-- Card 2: Citizen Protection -->
      <div class="benefit-card" style="background:#EFF6FF; border:1.5px solid #BFDBFE;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:23px; font-weight:900; color:#1E40AF;">Citizen Protection & Relief</strong>
            <span style="font-size:26px;">🛡️</span>
          </div>
          <div style="background:#DBEAFE; color:#1E40AF; font-size:13.5px; font-weight:800; padding:3px 10px; border-radius:4px; margin:4px 0 8px 0; display:inline-block;">
            GOLDEN HOUR PRESERVED: 4.2 HOURS ➔ &lt; 8 MINUTES
          </div>
        </div>
        <div style="font-size:16px; font-weight:600; color:#1E293B; line-height:1.45;">
          <div>• <strong>Immediate Asset Freezing:</strong> Slashes the "Golden Hour" crypto exit window from <strong>4.2 hours to under 8 minutes</strong>.</div>
          <div style="margin-top:4px;">• <strong>Syndicate Interception:</strong> Intercepts fraudulent investment and digital arrest transactions before cross-border bridge flight.</div>
        </div>
      </div>

      <!-- Card 3: Evidentiary & Judicial -->
      <div class="benefit-card" style="background:#ECFDF5; border:1.5px solid #A7F3D0;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:23px; font-weight:900; color:#065F46;">Evidentiary & Judicial Sovereignty</strong>
            <span style="font-size:26px;">⚖️</span>
          </div>
          <div style="background:#D1FAE5; color:#065F46; font-size:13.5px; font-weight:800; padding:3px 10px; border-radius:4px; margin:4px 0 8px 0; display:inline-block;">
            STATUTORY CONVICTION: &lt;9% ➔ OVER 88% RESTITUTION
          </div>
        </div>
        <div style="font-size:16px; font-weight:600; color:#1E293B; line-height:1.45;">
          <div>• <strong>Automated BNSS Dockets:</strong> Automates <strong>Section 107 BNSS asset attachment dockets</strong> and <strong>BSA Section 63 cryptographic proof kits</strong>.</div>
          <div style="margin-top:4px;">• <strong>Trial Admissibility:</strong> Increases prosecution conviction rates for cyber financial crimes from <strong>&lt; 9% to over 88%</strong>.</div>
        </div>
      </div>

    </div>

    <!-- Section 2: Stakeholders & Operational Workflow -->
    <div style="margin-bottom:16px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
        <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:19px; font-weight:800; padding:6px 32px; text-transform:uppercase; letter-spacing:0.5px;">STAKEHOLDERS & IMPACTS</div>
        <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:5px 20px; font-size:15px; font-weight:700; color:#1D4ED8;">Sample Operational Scenario: Citizen NCRP 1930 Restitution Pipeline</div>
      </div>

      <div style="grid-template-columns: repeat(4, 1fr); display:grid; gap:16px;">
        
        <!-- Step 1 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">1930 NCRP Complaint</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">Citizen reports USDT fraud; CHAKRA ingests tx hash in &lt; 10 sec automatically.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#2563EB; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">1</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">NCRP HELPDESK</strong>
          </div>
          <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#1E40AF; display:block; margin-bottom:3px;">Golden Hour Preserved</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Instant multi-chain ingestion prevents syndicate peel-chain layering across mules.</div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">Multithreaded BFS Trace</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">Rust engine uncovers 6 peel hops and isolates 4 mule deposit clusters in &lt; 2 mins.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#059669; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">2</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">CYBER CRIME IO</strong>
          </div>
          <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#065F46; display:block; margin-bottom:3px;">Full Trail Visible</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Interactive visual graph highlights exact flow of illicit crypto assets across chains.</div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">4-Pillar VASP Attribution</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">Resolves nearest registered Indian VASP (WazirX/CoinDCX) with 94.2% confidence.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#D97706; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">3</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">DYSP / SUPERVISOR</strong>
          </div>
          <div style="background:#FEF3C7; border:1px solid #FDE68A; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#92400E; display:block; margin-bottom:3px;">Zero False Accusations</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Automated Dempster-Shafer gating eliminates erroneous freezing of innocent wallets.</div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">Statutory Restitution</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">Fires Sec 106 BNSS freeze requisition & signs Sec 63 BSA dual-cert via HSM.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#DC2626; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">4</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">SPECIAL JUDGE / FIU</strong>
          </div>
          <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#991B1B; display:block; margin-bottom:3px;">Asset Restitution</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Enables swift restitution to victims under Section 107 BNSS; conviction rate &gt; 88%.</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Section 3: Our Promise -->
    <div style="display:flex; align-items:center; justify-content:space-between; gap:20px; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px 20px;">
      
      <!-- SDG Badges -->
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="background:#E5243B; color:#FFF; border-radius:8px; padding:8px 14px; text-align:center; font-weight:900; font-size:14px; line-height:1.2;">
          SDG 9<br><span style="font-size:12px; font-weight:600;">Industry &amp; Innovation</span>
        </div>
        <div style="background:#00689D; color:#FFF; border-radius:8px; padding:8px 14px; text-align:center; font-weight:900; font-size:14px; line-height:1.2;">
          SDG 16<br><span style="font-size:12px; font-weight:600;">Peace &amp; Justice</span>
        </div>
        <div style="background:#0F172A; color:#FFF; border-radius:8px; padding:8px 14px; text-align:center; font-weight:900; font-size:14px; line-height:1.2;">
          SURAKSHIT<br><span style="font-size:12px; font-weight:600;">Cyber Bharat</span>
        </div>
        <div style="background:#047857; color:#FFF; border-radius:8px; padding:8px 14px; text-align:center; font-weight:900; font-size:14px; line-height:1.2;">
          DIGITAL<br><span style="font-size:12px; font-weight:600;">India Mission</span>
        </div>
      </div>

      <!-- Formula Block -->
      <div style="background:#0F172A; border-radius:8px; padding:12px 20px; font-family:monospace; font-size:15px; color:#38BDF8; font-weight:700; line-height:1.45; text-align:center;">
        <div>Triage Latency Reduction = ((4.2 × 60 - 8) / (4.2 × 60)) × 100 ≈ <span style="color:#34D399;">96.83%</span></div>
        <div style="margin-top:2px;">Sovereign Cost Ratio = (₹4.2 Cr - ₹54L) / ₹4.2 Cr ≈ <span style="color:#34D399;">87.14%</span></div>
      </div>

      <!-- Projection Badge -->
      <div style="background:#FEF3C7; border:1.5px solid #FCD34D; border-radius:10px; padding:10px 18px; text-align:right;">
        <div style="font-size:14.5px; font-weight:800; color:#92400E;">CHAKRA National Impact</div>
        <div style="font-size:20px; font-weight:900; color:#0F172A; margin-top:2px;">85% Cost Drop • ₹840 Cr Relief</div>
      </div>

    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">5</div>
    </div>
  </div>
</body>
</html>`;
    case 6:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-6-container {
      width: 1920px;
      height: 1080px;
      padding: 20px 48px 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }}
    .quadrant-box {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 12px;
      padding: 13px 18px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
    }
    .citation-card {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="slide-6-container">
    <!-- Header Bar: Master Slide 2 Match -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:16px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:54px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">RESEARCH AND REFERENCES</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- 2x2 Quadrant Grid -->
    <div style="display:grid; grid-template-columns: 48.5% 51.5%; grid-template-rows: 1fr 1fr; gap:16px; flex:1; margin-bottom:8px;">
      
      <!-- Top Left: Research Grounding & Legal Mandate -->
      <div class="quadrant-box">
        <div style="display:flex; align-items:center; margin-bottom:6px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:18px; font-weight:800; padding:5px 28px; text-transform:uppercase; letter-spacing:0.5px;">RESEARCH GROUNDING &amp; LEGAL MANDATE</div>
        </div>

        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px; margin-bottom:6px;">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Crypto Crime Surge</strong>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">₹1,750+ Cr siphoned annually via fake investment, digital arrest, and task frauds using USDT.</div>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">The 4-Hour Window</strong>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Syndicate mules layer and off-ramp stolen crypto into INR within 4.2 hrs before IOs trace the tx.</div>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Attribution Deficit</strong>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Manual blockchain explorer lookups yield 91% untraced hops; CHAKRA automates trace in <strong>&lt; 8 mins</strong>.</div>
          </div>
        </div>

        <!-- Statutory Banner -->
        <div style="background:#0F172A; border-radius:8px; padding:10px 16px; color:#FFFFFF; display:flex; align-items:center; gap:12px;">
          <div style="background:#2563EB; border-radius:6px; padding:4px 8px; font-size:13px; font-weight:900;">STATUTE</div>
          <div style="font-size:15px; font-weight:700; line-height:1.38;">
            <strong>BNSS 2023 Sec 106 &amp; 107, PMLA 2002 Sec 12, BSA 2023 Sec 63:</strong> Enforces mandatory statutory freeze webhooks to registered VASPs, asset seizure orders, and court-admissible dual-hash proof.
          </div>
        </div>
      </div>

      <!-- Top Right: Standards, RFCs & Technical Citations (Replacing "Our Works") -->
      <div class="quadrant-box">
        <div style="display:flex; align-items:center; margin-bottom:6px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:18px; font-weight:800; padding:5px 28px; text-transform:uppercase; letter-spacing:0.5px;">STANDARDS, RFCS &amp; TECHNICAL CITATIONS</div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
          <!-- Citation 1 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">EVM &amp; TRON JSON-RPC Protocols</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">Ethereum Foundation &amp; TRON DAO</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">EIP-155 transaction envelope decoding, contract event log filtering, and Java-Tron gRPC stream parsers.</div>
          </div>

          <!-- Citation 2 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">Temporal Graph Neural Networks (TGAT)</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">Stanford SNAP / IEEE Blockchain</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Dynamic edge weighting for peel-chain attribution, Wasabi mixing de-anonymization, and hop clustering.</div>
          </div>

          <!-- Citation 3 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">FATF Rec 16 &amp; FIU-IND Guidelines</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">FATF Travel Rule &amp; PMLA Mandate</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Standardized attribution schemas for registered Reporting Entities (REs) and offshore non-compliant VASP sanctions.</div>
          </div>

          <!-- Citation 4 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">Apache Flink &amp; ClickHouse OLAP</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">Distributed Big Data &amp; Stream Engine</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Real-time sliding window aggregation processing 50,000+ blockchain events/sec with sub-50ms query responses.</div>
          </div>
        </div>
      </div>

      <!-- Bottom Left: Market Sizing & Unit Economics -->
      <div class="quadrant-box">
        <div style="display:flex; align-items:center; margin-bottom:6px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:18px; font-weight:800; padding:5px 28px; text-transform:uppercase; letter-spacing:0.5px;">MARKET SIZING &amp; UNIT ECONOMICS</div>
        </div>

        <div style="display:flex; gap:16px; align-items:center; margin-bottom:8px;">
          <div style="width:105px; height:105px; border-radius:50%; border:12px solid #2563EB; display:flex; flex-direction:column; align-items:center; justify-content:center; flex-shrink:0;">
            <span style="font-size:18px; font-weight:900; color:#0F172A;">₹18.5k Cr</span>
            <span style="font-size:11.5px; font-weight:700; color:#64748B;">TAM (2030)</span>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; gap:5px;">
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700;">
              <span>TAM: Global Crypto Analytics Market</span>
              <strong style="color:#0F172A; font-size:16px;">₹18,500 Cr</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700;">
              <span>SAM: Indian LEAs, MHA I4C, ED, FIU</span>
              <strong style="color:#2563EB; font-size:16px;">₹5,200 Cr</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700;">
              <span>SOM: 36 State Cyber Police Headquarters</span>
              <strong style="color:#059669; font-size:16px;">₹720 Cr</strong>
            </div>
          </div>
        </div>

        <!-- Unit Economics Grid -->
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 12px; text-align:center;">
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Instances</div>
            <div style="font-size:18px; font-weight:900; color:#0F172A;">36 States</div>
          </div>
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Node Appliance</div>
            <div style="font-size:18px; font-weight:900; color:#0F172A;">₹65,000</div>
          </div>
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Cloud / Mo</div>
            <div style="font-size:18px; font-weight:900; color:#0F172A;">₹4.5L/mo</div>
          </div>
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">5-Yr Benefit</div>
            <div style="font-size:18px; font-weight:900; color:#059669;">₹840+ Crore</div>
          </div>
        </div>
      </div>

      <!-- Bottom Right: Sovereign Benchmark vs Foreign Monopolies -->
      <div class="quadrant-box">
        <div style="display:flex; align-items:center; margin-bottom:6px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:18px; font-weight:800; padding:5px 28px; text-transform:uppercase; letter-spacing:0.5px;">SOVEREIGN BENCHMARK VS FOREIGN MONOPOLIES</div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:6px;">
          <div style="background:#FEF2F2; border:1.5px solid #FECACA; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:900; color:#991B1B; display:block; margin-bottom:4px;">Foreign SaaS (Chainalysis / TRM)</strong>
            <ul style="padding-left:16px; font-size:14.5px; font-weight:600; color:#334155; line-height:1.4; margin:0;">
              <li>Proprietary closed-source cloud</li>
              <li>₹4.2 Cr/yr recurring licensing drain</li>
              <li>Case telemetry stored on US servers</li>
              <li>Lacks native BNSS/BSA certificates</li>
              <li>Turnaround time &gt; 14 days per query</li>
            </ul>
          </div>

          <div style="background:#ECFDF5; border:1.5px solid #A7F3D0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:900; color:#065F46; display:block; margin-bottom:4px;">Sovereign CHAKRA Solution</strong>
            <ul style="padding-left:16px; font-size:14.5px; font-weight:600; color:#334155; line-height:1.4; margin:0;">
              <li>100% On-Prem / NIC MeghRaj Cloud</li>
              <li>₹54L total deployment (85% savings)</li>
              <li>Complete sovereign data residency</li>
              <li>Native Sec 106 BNSS &amp; Sec 63 BSA proof</li>
              <li>Automated attribution in &lt; 8 mins</li>
            </ul>
          </div>
        </div>

        <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:8px 14px; font-size:15px; font-weight:700; color:#0F172A; line-height:1.38;">
          <strong>Enterprise Conclusion:</strong> CHAKRA eliminates dependency on foreign blockchain analytics monopolies, preserves sovereign LEA investigation secrecy, and enables immediate recovery of citizen funds under Indian statutory law.
        </div>
      </div>

    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">6</div>
    </div>
  </div>
</body>
</html>`;
    default:
      return `<div>Slide not found</div>`;
  }
}
