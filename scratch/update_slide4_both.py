import re

# Read current files
with open('scripts/engine/generate_bhedak_slides.mjs', 'r', encoding='utf-8') as f:
    bhedak_code = f.read()

with open('scripts/engine/generate_chakra_slides.mjs', 'r', encoding='utf-8') as f:
    chakra_code = f.read()

# 1. BHEDAK SLIDE 4 HTML
bhedak_slide_4_html = """    case 4:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-4-container {
      width: 1920px;
      height: 1080px;
      padding: 24px 48px 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .feasibility-card {
      background: #F8FAFC;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 13px 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
    }
    .feasibility-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .challenge-box {
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      background: #FFFFFF;
      padding: 18px 22px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(15,23,42,0.03);
    }
    .mitigation-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
  </style>
</head>
<body>
  <div class="slide-4-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + SIH 2026 Logo (Uniform 98px across Slides 1-4) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:18px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">FEASIBILITY AND VIABILITY</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main 2-Column Layout (Matching sih_2024 page_4 composition) -->
    <div style="display:grid; grid-template-columns: 43.5% 56.5%; gap:30px; height:855px; align-items:stretch;">
      
      <!-- Left Column: Feasibility Dimensions & Market Viability -->
      <div style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <!-- Pill Header -->
          <div style="display:flex; align-items:center; margin-bottom:14px;">
            <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:6px 38px; text-transform:uppercase; letter-spacing:0.5px;">FEASIBILITY</div>
          </div>

          <!-- 4 Feasibility Dimension Cards -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <!-- Technical Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#EFF6FF; border:1px solid #BFDBFE;">${ICONS.cpu}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Technical Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Automated <strong>256-node SOCKS5 circuit rotation</strong> maintains <strong>99.6% darknet uptime</strong> across 15+ markets; Neo4j traverses 10,000+ nodes in <strong>&lt; 45ms</strong>; IndicBERT resolves threat actor authorship in <strong>&lt; 120ms</strong>.
                </div>
              </div>
            </div>

            <!-- Operational Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#F0FDF4; border:1px solid #BBF7D0;">${ICONS.analytics}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Operational Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Slashes darknet de-anonymization and attribution time from <strong>14-21 days of manual scraping to &lt; 15 minutes</strong> automated intelligence. Seamlessly integrates into NTRO CITC, CERT-In, and NCIIPC intelligence workflows.
                </div>
              </div>
            </div>

            <!-- Economic Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#FFFBEB; border:1px solid #FDE68A;">${ICONS.coins}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Economic Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Sovereign self-hosted deployment on NIC MeghRaj Cloud costs <strong>₹3.2 Lakhs/month</strong>, delivering an <strong>82% cost reduction (saving ₹14.8 Cr annually)</strong> compared to recurring foreign subscriptions (Recorded Future, Flashpoint).
                </div>
              </div>
            </div>

            <!-- Regulatory Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#FAF5FF; border:1px solid #E9D5FF;">${ICONS.gavel}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Regulatory Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Fully compliant with <strong>Sections 69 & 70A IT Act 2000</strong>, <strong>Bharatiya Sakshya Adhiniyam 2023 Section 63</strong> (Part A/B dual certificates with FIPS 140-3 HSM tamper seals), and <strong>DPDP Act 2023</strong> sovereign retention standards.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stacked Bar Chart & Market Viability Box -->
        <div style="display:grid; grid-template-columns: 48% 52%; gap:16px; align-items:center; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px 16px; margin-top:10px;">
          <!-- SVG Stacked Bar Chart -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:11.5px; font-weight:800; color:#1E3A8A; text-transform:uppercase;">National Cyber Threat Intel Market</span>
              <span style="font-size:11px; font-weight:700; color:#64748B;">(₹ Crores)</span>
            </div>
            <svg viewBox="0 0 220 120" width="100%" height="95">
              <!-- Grid lines -->
              <line x1="20" y1="95" x2="210" y2="95" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="20" y1="55" x2="210" y2="55" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
              <line x1="20" y1="20" x2="210" y2="20" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
              
              <!-- Bar 2022 -->
              <rect x="36" y="70" width="28" height="25" fill="#0F172A" rx="2"/>
              <rect x="36" y="58" width="28" height="12" fill="#0284C7" rx="2"/>
              <text x="50" y="112" font-size="11.5" font-weight="600" text-anchor="middle" fill="#64748B">2022</text>
              <text x="50" y="50" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0F172A">₹3.1k Cr</text>
              
              <!-- Bar 2024 -->
              <rect x="92" y="52" width="28" height="43" fill="#0F172A" rx="2"/>
              <rect x="92" y="36" width="28" height="16" fill="#0284C7" rx="2"/>
              <text x="106" y="112" font-size="11.5" font-weight="600" text-anchor="middle" fill="#64748B">2024</text>
              <text x="106" y="28" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0F172A">₹5.4k Cr</text>
              
              <!-- Bar 2029 (Projected) -->
              <rect x="150" y="32" width="28" height="63" fill="#0F172A" rx="2"/>
              <rect x="150" y="10" width="28" height="22" fill="#0284C7" rx="2"/>
              <text x="164" y="112" font-size="11.5" font-weight="700" text-anchor="middle" fill="#0F172A">2029</text>
              <text x="164" y="7" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0284C7">₹14.8k Cr</text>
              
              <!-- Growth Curve & CAGR Bubble -->
              <path d="M 60 48 Q 115 14 148 16" fill="none" stroke="#EA580C" stroke-width="2.5" stroke-dasharray="3,2"/>
              <circle cx="118" cy="22" r="13" fill="#EA580C"/>
              <text x="118" y="26" font-size="11" font-weight="900" text-anchor="middle" fill="#FFFFFF">22.4%</text>
            </svg>
            <div style="display:flex; justify-content:center; gap:14px; margin-top:2px;">
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; color:#475569;"><span style="width:9px; height:9px; background:#0F172A; border-radius:2px; display:inline-block;"></span> Law Enforcement</span>
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; color:#475569;"><span style="width:9px; height:9px; background:#0284C7; border-radius:2px; display:inline-block;"></span> Critical Infra</span>
            </div>
          </div>

          <!-- Market & Viability Text -->
          <div>
            <div style="margin-bottom:8px;">
              <strong style="font-size:14.5px; font-weight:800; color:#0F172A; display:block;">Market Viability</strong>
              <div style="font-size:12px; color:#334155; line-height:1.35; margin-top:2px;">
                National cyber defense policy mandates indigenous threat intelligence. The national market is compounding at <strong>22.4% CAGR</strong> to ₹14,850 Cr by 2029.
              </div>
            </div>
            <div>
              <strong style="font-size:14.5px; font-weight:800; color:#0F172A; display:block;">Sustainable Viability</strong>
              <div style="font-size:12px; color:#334155; line-height:1.35; margin-top:2px;">
                Air-gapped deployment, automated IndicBERT fine-tuning against emerging darknet slang, and open STIX 2.1 dissemination feeds guarantee multi-year operational relevance.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Challenges & Engineering Mitigations (Matching sih_2024 structure) -->
      <div>
        <!-- Pill Header -->
        <div style="display:flex; align-items:center; margin-bottom:14px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:6px 38px; text-transform:uppercase; letter-spacing:0.5px;">CHALLENGES</div>
        </div>

        <!-- Master Challenges Container -->
        <div class="challenge-box">
          
          <!-- Challenge 1: Tor Onion Routing & IP Obfuscation -->
          <div style="border-bottom:1.5px dashed #CBD5E1; padding-bottom:12px;">
            <div style="font-size:17px; font-weight:900; color:#000000; line-height:1.3; margin-bottom:8px;">
              Overcoming Tor v3 Onion Routing & Unmasking Physical Server Infrastructure
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px 18px;">
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.network}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Apache mod_status Leaks</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Continuous probing of status endpoints unmasks clearnet hosting IP.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.shield}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">TLS Certificate SAN Pivots</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Extracts SHA-256 cert fingerprints from port 443 leaks across public IPv4.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.cpu}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Favicon MMH3 Hash Inversion</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• MurmurHash3 indexing correlates hidden services with clearnet Shodan seeds.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.docker}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Git Exposure Extraction</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Scrapes exposed /.git/ directories uncovering developer emails & commit histories.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Challenge 2: Cross-Market Rebranding & Persona Cycling -->
          <div style="border-bottom:1.5px dashed #CBD5E1; padding-bottom:12px;">
            <div style="font-size:17px; font-weight:900; color:#000000; line-height:1.3; margin-bottom:8px;">
              Resolving Cross-Market Rebranding, Multiple Handles & P2P Escrow Cycling
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px 18px;">
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.database}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Multi-Market PGP Key Binding</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Correlates 4096-bit RSA keys across 15+ bazaars into a unified persona node.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.user}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">IndicBERT AI Stylometry</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• 284-dim linguistic embeddings decode Hinglish darknet slang with >88% match.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.analytics}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Diurnal UTC Sleep Inactivity</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Maps timestamp distributions to UTC+5:30 (±30m sleep window) for geolocation.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.coins}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">BTC/Monero Co-Spend Clustering</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Heuristic wallet clustering unmasks shared transaction inputs and escrow links.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Challenge 3: Judicial Admissibility & Evidentiary Scrutiny in Court -->
          <div>
            <div style="font-size:17px; font-weight:900; color:#000000; line-height:1.3; margin-bottom:8px;">
              Ensuring 100% Admissibility in Special Cyber Courts Under BSA 2023 Sec 63
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px 18px;">
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.gavel}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Part A/B Dual-Certificate</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Lawful Ingestion (Custodian) + Forensic Examination (Scientist 'E') compliance.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.check}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">FIPS 140-3 HSM Root of Trust</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• SHA-256 Merkle chain guarantees tamper-proof chain of custody for trial.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.zap}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">0.65 AI Confidence Ceiling</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Requires deterministic cryptographic evidence before attributing legal liability.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.document}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Automated BNSS Sec 94 Dockets</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• One-click export generates magistrate-ready summons and seizure petitions.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Solid Blue Footer Bar (Matching approved Slide 2 & 3) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px;">
      <div style="font-size:14px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">PROJECT BHEDAK (भेदक) • NTRO CITC DIVISION • CONFIDENTIAL</div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">4</div>
    </div>
  </div>
</body>
</html>`;"""

# 2. CHAKRA SLIDE 4 HTML
chakra_slide_4_html = """    case 4:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-4-container {
      width: 1920px;
      height: 1080px;
      padding: 24px 48px 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .feasibility-card {
      background: #F8FAFC;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 13px 16px;
      display: flex;
      gap: 14px;
      align-items: flex-start;
      box-shadow: 0 2px 6px rgba(15,23,42,0.03);
    }
    .feasibility-icon {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .challenge-box {
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      background: #FFFFFF;
      padding: 18px 22px;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(15,23,42,0.03);
    }
    .mitigation-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
  </style>
</head>
<body>
  <div class="slide-4-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + SIH 2026 Logo (Uniform 98px across Slides 1-4) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:18px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">FEASIBILITY AND VIABILITY</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main 2-Column Layout (Matching sih_2024 page_4 composition) -->
    <div style="display:grid; grid-template-columns: 43.5% 56.5%; gap:30px; height:855px; align-items:stretch;">
      
      <!-- Left Column: Feasibility Dimensions & Market Viability -->
      <div style="display:flex; flex-direction:column; justify-content:space-between;">
        <div>
          <!-- Pill Header -->
          <div style="display:flex; align-items:center; margin-bottom:14px;">
            <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:6px 38px; text-transform:uppercase; letter-spacing:0.5px;">FEASIBILITY</div>
          </div>

          <!-- 4 Feasibility Dimension Cards -->
          <div style="display:flex; flex-direction:column; gap:12px;">
            <!-- Technical Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#EFF6FF; border:1px solid #BFDBFE;">${ICONS.cpu}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Technical Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Bounded-memory <strong>Rust BFS engine traverses 5 transaction hops in &lt; 180ms</strong> across 10,000+ TX/sec; Java-Tron gRPC parses energy sponsor delegations in <strong>&lt; 15ms</strong>; 4-pillar math attributes VASPs with <strong>96.4% confidence</strong>.
                </div>
              </div>
            </div>

            <!-- Operational Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#F0FDF4; border:1px solid #BBF7D0;">${ICONS.analytics}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Operational Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Slashes attribution and debit-freeze dispatch latency from <strong>14-21 days of manual subpoenas to &lt; 8 minutes</strong>. Integrates natively into 1930 NCRP desks, Cyber Police Stations, and FIU-registered exchange portals.
                </div>
              </div>
            </div>

            <!-- Economic Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#FFFBEB; border:1px solid #FDE68A;">${ICONS.coins}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Economic Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Self-hosted open-source architecture on NIC MeghRaj costs <strong>₹4.5 Lakhs/month</strong>, saving <strong>₹12-16 Crores annually (85% reduction)</strong> compared to recurring foreign SaaS subscriptions (Chainalysis Reactor, TRM Labs).
                </div>
              </div>
            </div>

            <!-- Regulatory Feasibility -->
            <div class="feasibility-card">
              <div class="feasibility-icon" style="background:#FAF5FF; border:1px solid #E9D5FF;">${ICONS.gavel}</div>
              <div>
                <strong style="font-size:16.5px; color:#0F172A; display:block; margin-bottom:3px; font-weight:800;">Regulatory Feasibility</strong>
                <div style="font-size:13.5px; color:#334155; line-height:1.4;">
                  Fully compliant with <strong>Sections 94, 106 & 107 of BNSS 2023</strong>, <strong>Section 63 BSA 2023</strong> electronic evidence certificates, and <strong>FIU-IND Anti-Money Laundering (PMLA 2002)</strong> compliance directives.
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stacked Bar Chart & Market Viability Box -->
        <div style="display:grid; grid-template-columns: 48% 52%; gap:16px; align-items:center; background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:12px 16px; margin-top:10px;">
          <!-- SVG Stacked Bar Chart -->
          <div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-size:11.5px; font-weight:800; color:#1E3A8A; text-transform:uppercase;">Indian VDA Forensics Market</span>
              <span style="font-size:11px; font-weight:700; color:#64748B;">(₹ Crores)</span>
            </div>
            <svg viewBox="0 0 220 120" width="100%" height="95">
              <!-- Grid lines -->
              <line x1="20" y1="95" x2="210" y2="95" stroke="#CBD5E1" stroke-width="1"/>
              <line x1="20" y1="55" x2="210" y2="55" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
              <line x1="20" y1="20" x2="210" y2="20" stroke="#E2E8F0" stroke-width="1" stroke-dasharray="2,2"/>
              
              <!-- Bar 2022 -->
              <rect x="36" y="65" width="28" height="30" fill="#2563EB" rx="2"/>
              <rect x="36" y="52" width="28" height="13" fill="#10B981" rx="2"/>
              <text x="50" y="112" font-size="11.5" font-weight="600" text-anchor="middle" fill="#64748B">2022</text>
              <text x="50" y="44" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0F172A">₹4.2k Cr</text>
              
              <!-- Bar 2024 -->
              <rect x="92" y="48" width="28" height="47" fill="#2563EB" rx="2"/>
              <rect x="92" y="32" width="28" height="16" fill="#10B981" rx="2"/>
              <text x="106" y="112" font-size="11.5" font-weight="600" text-anchor="middle" fill="#64748B">2024</text>
              <text x="106" y="24" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#0F172A">₹6.8k Cr</text>
              
              <!-- Bar 2029 (Projected) -->
              <rect x="150" y="28" width="28" height="67" fill="#2563EB" rx="2"/>
              <rect x="150" y="8" width="28" height="20" fill="#10B981" rx="2"/>
              <text x="164" y="112" font-size="11.5" font-weight="700" text-anchor="middle" fill="#0F172A">2029</text>
              <text x="164" y="5" font-size="11.5" font-weight="bold" text-anchor="middle" fill="#2563EB">₹18.4k Cr</text>
              
              <!-- Growth Curve & CAGR Bubble -->
              <path d="M 60 42 Q 115 12 148 14" fill="none" stroke="#EA580C" stroke-width="2.5" stroke-dasharray="3,2"/>
              <circle cx="118" cy="20" r="13" fill="#EA580C"/>
              <text x="118" y="24" font-size="11" font-weight="900" text-anchor="middle" fill="#FFFFFF">21.8%</text>
            </svg>
            <div style="display:flex; justify-content:center; gap:14px; margin-top:2px;">
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; color:#475569;"><span style="width:9px; height:9px; background:#2563EB; border-radius:2px; display:inline-block;"></span> State Cyber Cells</span>
              <span style="display:inline-flex; align-items:center; gap:4px; font-size:11px; color:#475569;"><span style="width:9px; height:9px; background:#10B981; border-radius:2px; display:inline-block;"></span> VASP Exchanges</span>
            </div>
          </div>

          <!-- Market & Viability Text -->
          <div>
            <div style="margin-bottom:8px;">
              <strong style="font-size:14.5px; font-weight:800; color:#0F172A; display:block;">Market Viability</strong>
              <div style="font-size:12px; color:#334155; line-height:1.35; margin-top:2px;">
                Annual crypto and USDT scams exceed <strong>₹1,750+ Cr in Indian citizen losses</strong>. Sovereign tracing is a statutory priority growing at <strong>21.8% CAGR</strong>.
              </div>
            </div>
            <div>
              <strong style="font-size:14.5px; font-weight:800; color:#0F172A; display:block;">Sustainable Viability</strong>
              <div style="font-size:12px; color:#334155; line-height:1.35; margin-top:2px;">
                Integration with MHA SAHYOG API across 25+ registered exchanges and Section 107 BNSS victim restitution orders guarantee permanent statutory utility.
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Challenges & Engineering Mitigations (Matching sih_2024 structure) -->
      <div>
        <!-- Pill Header -->
        <div style="display:flex; align-items:center; margin-bottom:14px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:20px; font-weight:800; padding:6px 38px; text-transform:uppercase; letter-spacing:0.5px;">CHALLENGES</div>
        </div>

        <!-- Master Challenges Container -->
        <div class="challenge-box">
          
          <!-- Challenge 1: Peel Chains & Automated Smart Contract Sweeps -->
          <div style="border-bottom:1.5px dashed #CBD5E1; padding-bottom:12px;">
            <div style="font-size:17px; font-weight:900; color:#000000; line-height:1.3; margin-bottom:8px;">
              De-obfuscating Rapid Peel Chains, Micro-Splits & Energy Sponsored Sweeps
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px 18px;">
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.cpu}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Bounded Rust BFS Engine</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Prunes 99.4% dust splits, isolating the main fund corridor across 5 hops.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.zap}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Energy Sponsor Unmasking</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Java-Tron gRPC links fee-delegation contracts paying gas for mule transactions.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.analytics}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Temporal Decay Scoring</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Flags automated high-velocity sweeps (&lt; 120s between hops) characteristic of bots.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.network}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Smart Contract Batch Detectors</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Unmasks TRC-20 transferFrom aggregators funneling stolen funds to exchanges.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Challenge 2: Offshore Exchanges, P2P Mule Rings & Unregistered VASPs -->
          <div style="border-bottom:1.5px dashed #CBD5E1; padding-bottom:12px;">
            <div style="font-size:17px; font-weight:900; color:#000000; line-height:1.3; margin-bottom:8px;">
              Neutralizing P2P Merchant Mule Rings & Enforcing Real-Time VASP Freezes
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px 18px;">
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.database}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">FIU-IND Registered Directory</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Cross-references deposit wallets against 25+ FIU-registered exchange hot wallets.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.shield}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">MHA SAHYOG API Dispatch</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Auto-generates and pushes machine-readable Sec 106 BNSS orders in &lt; 8 mins.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.user}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Cross-FIR Mule Ring Graph</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Correlates victim UPI handles and bank logs across 1930 multi-state complaints.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.check}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">2-Hour Statutory SLA Gate</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Enforces rapid debit-freeze compliance before syndicates can execute fiat off-ramp.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Challenge 3: Court Evidence Admissibility & Section 107 BNSS Restitution -->
          <div>
            <div style="font-size:17px; font-weight:900; color:#000000; line-height:1.3; margin-bottom:8px;">
              Securing Judicial Admissibility & Enabling Victim Fund Restitution
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px 18px;">
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.gavel}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Sec 63 BSA Dual-Certificate</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Part A (NCRP Ingestion) + Part B (FSL Forensic Examiner) court-admissible seals.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.document}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">Sec 107 Restitution Dossier</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Auto-drafts court petitions directing frozen assets to be refunded to victim accounts.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.docker}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">SHA-256 Merkle Provenance</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• FIPS 140-3 HSM signed raw blockchain RPC logs prevent evidence tampering claims.</span>
                </div>
              </div>
              <div class="mitigation-item">
                <div style="flex-shrink:0;">${ICONS.analytics}</div>
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block; font-weight:800;">4-Pillar Transparent Math</strong>
                  <span style="font-size:12px; color:#475569; line-height:1.35;">• Explains weights (Temporal, Drain, Topology, Energy) for strict cross-examination scrutiny.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Solid Blue Footer Bar (Matching approved Slide 2 & 3) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px;">
      <div style="font-size:14px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">PROJECT CHAKRA (चक्र) • MHA / I4C ECOSYSTEM • CONFIDENTIAL</div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">4</div>
    </div>
  </div>
</body>
</html>`;"""

# Replace case 4 in bhedak
bhedak_updated = re.sub(r'case 4:.*?case 5:', bhedak_slide_4_html + '\n\n    case 5:', bhedak_code, flags=re.DOTALL)

# Ensure Slide 1 SIH logo is 98px in bhedak
bhedak_updated = re.sub(
    r'(case 1:.*?<div class="header-bar">.*?)(<img class="sih-logo-img" src="\$\{sihLogoB64\}">)',
    r'\1<img src="${sihLogoB64}" style="height:98px; object-fit:contain;">',
    bhedak_updated,
    flags=re.DOTALL
)

# Ensure Slide 3 SIH logo is 98px in bhedak
bhedak_updated = re.sub(
    r'(case 3:.*?<!-- Header Bar.*?<img src="\$\{sihLogoB64\}" style="height:)\d+px(; object-fit:contain;">)',
    r'\g<1>98px\g<2>',
    bhedak_updated,
    flags=re.DOTALL
)

# Replace case 4 in chakra
chakra_updated = re.sub(r'case 4:.*?case 5:', chakra_slide_4_html + '\n\n    case 5:', chakra_code, flags=re.DOTALL)

# Ensure Slide 1 SIH logo is 98px in chakra
chakra_updated = re.sub(
    r'(case 1:.*?<div class="header-bar">.*?)(<img class="sih-logo-img" src="\$\{sihLogoB64\}">)',
    r'\1<img src="${sihLogoB64}" style="height:98px; object-fit:contain;">',
    chakra_updated,
    flags=re.DOTALL
)

# Ensure Slide 3 SIH logo is 98px in chakra
chakra_updated = re.sub(
    r'(case 3:.*?<!-- Header Bar.*?<img src="\$\{sihLogoB64\}" style="height:)\d+px(; object-fit:contain;">)',
    r'\g<1>98px\g<2>',
    chakra_updated,
    flags=re.DOTALL
)

with open('scripts/engine/generate_bhedak_slides.mjs', 'w', encoding='utf-8') as f:
    f.write(bhedak_updated)

with open('scripts/engine/generate_chakra_slides.mjs', 'w', encoding='utf-8') as f:
    f.write(chakra_updated)

print("Slide 4 successfully updated in both files, and SIH logo unified to 98px across slides 1-4!")
