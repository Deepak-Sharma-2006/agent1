import os
import sys

# Ensure scratch is on path
sys.path.insert(0, os.path.abspath('scratch'))
sys.path.insert(0, os.path.abspath('.'))

def build_slide_1(deck_name, ps_id, ps_title, theme, category, team_name, team_name_color, target_org):
    return f"""case 1:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${{COMMON_CSS}}
    .slide-1-container {{
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
    }}
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
      <img src="${{sihLogoB64}}" style="height:98px; object-fit:contain; position:absolute; right:0; top:0;">
    </div>

    <!-- Main Content Grid: 56% Left, 44% Right -->
    <div style="display:grid; grid-template-columns: 56% 44%; gap:40px; align-items:center; flex:1; margin-bottom:30px;">
      <!-- Left: Official SIH Details Matching Approved Slides Exactly -->
      <div style="display:flex; flex-direction:column; gap:22px; padding-left:20px;">
        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Problem Statement ID –</strong> <span style="color:#15479E; font-weight:900;">{ps_id}</span></div>
        </div>

        <div style="font-size:24.5px; color:#0F172A; line-height:1.36; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Problem Statement Title –</strong> <span style="font-weight:700;">{ps_title}</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Theme –</strong> <span style="font-weight:700;">{theme}</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">PS Category –</strong> <span style="font-weight:700;">{category}</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Team ID –</strong></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Team Name :-</strong> <span style="font-weight:900; color:{team_name_color};">{team_name}</span></div>
        </div>

        <div style="font-size:26px; color:#0F172A; line-height:1.4; display:flex; align-items:flex-start; gap:14px;">
          <span style="color:#000000; font-size:32px; line-height:1; margin-top:-2px;">•</span>
          <div><strong style="color:#000000;">Target Organization :-</strong> <span style="font-weight:700;">{target_org}</span></div>
        </div>
      </div>

      <!-- Right: Large SIH Brain/Bulb Graphic -->
      <div style="display:flex; justify-content:center; align-items:center;">
        <img src="${{sihLogoLargeB64}}" style="max-height:650px; width:auto; object-fit:contain;">
      </div>
    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">{deck_name} - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">1</div>
    </div>
  </div>
</body>
</html>`;"""

def prepare_slide_3(raw_html, deck_name):
    # Set container padding
    s3 = raw_html.replace('padding: 16px 36px 18px 36px;', 'padding: 12px 36px 42px 36px;')
    
    # Target exact header string from update_slide3_files.py
    old_hdr = """    <!-- Header Bar: Matching Slide 2 Exactly -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:78px; margin-bottom:10px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:5px 32px; font-size:26px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:46px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:78px; object-fit:contain;">
    </div>"""

    new_master_hdr = f"""    <!-- Header Bar: Indomitus Oval + Centered Title + Large SIH 2026 Logo (Master Slide 2 Match) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:8px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:54px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">PROPOSED SOLUTION</div>
      <img src="${{sihLogoB64}}" style="height:98px; object-fit:contain;">
    </div>"""

    s3 = s3.replace(old_hdr, new_master_hdr)

    # Replace old footer cleanly
    old_footer_bhedak = """    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:24px; margin-top:6px; border-top:1px solid #E2E8F0; padding-top:4px;">
      <div style="font-size:11px; font-weight:800; color:#64748B; letter-spacing:0.5px;">PROJECT BHEDAK (भेदक) • NTRO CITC DIVISION • CONFIDENTIAL</div>
      <div style="font-size:12px; font-weight:900; color:#1E3A8A;">@SIH Idea Submission • Slide 3</div>
    </div>"""

    old_footer_chakra = """    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:24px; margin-top:6px; border-top:1px solid #E2E8F0; padding-top:4px;">
      <div style="font-size:11px; font-weight:800; color:#64748B; letter-spacing:0.5px;">PROJECT CHAKRA (चक्र) • MHA I4C DIVISION • CONFIDENTIAL</div>
      <div style="font-size:12px; font-weight:900; color:#1E3A8A;">@SIH Idea Submission • Slide 3</div>
    </div>"""

    old_footer_chakra_2 = """    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:24px; margin-top:6px; border-top:1px solid #E2E8F0; padding-top:4px;">
      <div style="font-size:11px; font-weight:800; color:#64748B; letter-spacing:0.5px;">PROJECT CHAKRA (चक्र) • MHA / I4C ECOSYSTEM • CONFIDENTIAL</div>
      <div style="font-size:12px; font-weight:900; color:#1E3A8A;">@SIH Idea Submission • Slide 3</div>
    </div>"""

    new_master_footer = f"""    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">{deck_name} - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">3</div>
    </div>"""

    s3 = s3.replace(old_footer_bhedak, new_master_footer)
    s3 = s3.replace(old_footer_chakra, new_master_footer)
    s3 = s3.replace(old_footer_chakra_2, new_master_footer)

    return s3


# =========================================================================
# BHEDAK SLIDES BUILDER
# =========================================================================
def get_bhedak_slide_4():
    return """case 4:
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
              Automated <strong>256-node SOCKS5 circuit rotation</strong> maintains <strong>99.6% darknet uptime</strong> across 15+ markets; Neo4j traverses 10,000+ nodes in <strong>&lt; 45ms</strong>; IndicBERT resolves threat actor authorship in <strong>&lt; 120ms</strong> with <strong>0.884 cosine accuracy</strong>.
            </div>
          </div>
        </div>

        <div class="feasibility-card" style="border-left:5px solid #059669;">
          <div class="feasibility-icon" style="background:#ECFDF5;">${ICONS.analytics}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Operational Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Slashes darknet threat attribution time from <strong>14–21 days of manual scraping down to &lt; 15 minutes</strong> automated intelligence. Seamlessly integrates into NTRO CITC, CERT-In, and NCIIPC intelligence workflows with 3-tier role-based access control.
            </div>
          </div>
        </div>

        <div class="feasibility-card" style="border-left:5px solid #D97706;">
          <div class="feasibility-icon" style="background:#FEF3C7;">${ICONS.coins}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Economic Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Sovereign self-hosted deployment on NIC MeghRaj Cloud costs <strong>₹3.2 Lakhs/month</strong>, delivering an <strong>82% cost reduction (saving ₹14.8 Cr over 5 years)</strong> compared to recurring foreign subscriptions (Recorded Future, Flashpoint) with zero per-query fees.
            </div>
          </div>
        </div>

        <div class="feasibility-card" style="border-left:5px solid #DC2626;">
          <div class="feasibility-icon" style="background:#FEF2F2;">${ICONS.gavel}</div>
          <div>
            <strong style="font-size:21px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Regulatory & Legal Feasibility</strong>
            <div style="font-size:16.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              Fully compliant with <strong>Sections 69 & 70A IT Act 2000</strong>, <strong>Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 63</strong> (Part A/B dual certificates with FIPS 140-3 HSM tamper seals), and DPDP Act 2023 sovereign retention standards.
            </div>
          </div>
        </div>

        <!-- Market Viability Box -->
        <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:13px 18px; display:flex; gap:18px; align-items:center;">
          <div style="width:130px; text-align:center; flex-shrink:0;">
            <div style="font-size:12.5px; font-weight:800; color:#64748B; text-transform:uppercase;">CYBER INTEL MARKET</div>
            <div style="display:flex; align-items:flex-end; justify-content:center; gap:8px; height:46px; margin-top:4px;">
              <div style="width:24px; height:22px; background:#94A3B8; border-radius:3px;"></div>
              <div style="width:24px; height:34px; background:#3B82F6; border-radius:3px;"></div>
              <div style="width:24px; height:46px; background:#0284C7; border-radius:3px;"></div>
            </div>
            <div style="font-size:14px; font-weight:900; color:#0369A1; margin-top:3px;">22.4% CAGR</div>
          </div>
          <div style="border-left:1.5px solid #E2E8F0; padding-left:16px;">
            <strong style="font-size:18px; font-weight:900; color:#0F172A; display:block; margin-bottom:3px;">Market Viability & Sustainable Adoption</strong>
            <div style="font-size:15.5px; font-weight:600; color:#1E293B; line-height:1.45;">
              National cyber threat intelligence market is compounding to <strong>₹14,850 Cr by 2029</strong>. Multi-year relevance is guaranteed via automated IndicBERT continuous fine-tuning against emerging darknet slang and standardized STIX 2.1 dissemination feeds to 36 State Cyber Cells.
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
            <strong style="font-size:19px; font-weight:900; color:#0F172A;">Tor v3 Onion Routing & Origin Infrastructure Concealment</strong>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#EFF6FF;">${ICONS.network}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Present: Active Misconfig Probing</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Probes server status, Apache mod_status, TLS SNI leakage, & Favicon MMH3 hashes to unmask clearnet host IP.</div>
              </div>
            </div>
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#F0FDF4;">${ICONS.shield}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Future: Traffic Watermarking</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Cross-relay NetFlow packet timing analysis correlates entry/guard circuits for deterministic de-anonymization.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Challenge 02 -->
        <div class="challenge-card">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#FEF3C7; color:#92400E; font-size:13.5px; font-weight:900; padding:4px 11px; border-radius:4px;">CHALLENGE 02</span>
            <strong style="font-size:19px; font-weight:900; color:#0F172A;">Cross-Market Rebranding, Multiple Handles & Dialect Code-Switching</strong>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#EFF6FF;">${ICONS.database}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Present: IndicBERT & PGP Correlator</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Binds 4096-bit RSA keys across 15+ markets; extracts 284-dim stylometry embeddings with &gt; 88% match.</div>
              </div>
            </div>
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#F0FDF4;">${ICONS.cpu}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Future: Diurnal Circadian Fusion</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">Maps UTC+5:30 sleep troughs and fuses cross-platform Telegram MTProto chat logs into unified persona models.</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Challenge 03 -->
        <div class="challenge-card">
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="background:#ECFDF5; color:#065F46; font-size:13.5px; font-weight:900; padding:4px 11px; border-radius:4px;">CHALLENGE 03</span>
            <strong style="font-size:19px; font-weight:900; color:#0F172A;">Securing 100% Admissibility in Cyber Courts Under BSA 2023 Sec 63</strong>
          </div>
          <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#EFF6FF;">${ICONS.gavel}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Present: Asymmetric Fusion & HSM Seal</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">0.65 hard cap on AI stylometry; mandates deterministic cryptographic Merkle proof signed by FIPS 140-3 HSM.</div>
              </div>
            </div>
            <div class="mitigation-tile">
              <div class="mitigation-icon-box" style="background:#F0FDF4;">${ICONS.check}</div>
              <div>
                <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Future: Automated Court Dockets</strong>
                <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.42;">One-click Section 94 BNSS digital summon generator and sealed forensic package prevent hostile witness acquittals.</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">4</div>
    </div>
  </div>
</body>
</html>`;"""

def get_bhedak_slide_5():
    return """case 5:
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
            82% COST REDUCTION • ₹14.8 CR 5-YEAR SAVINGS
          </div>
        </div>
        <div style="font-size:16px; font-weight:600; color:#1E293B; line-height:1.45;">
          <div>• <strong>Foreign Outflow Curtailed:</strong> Slashes recurring threat intelligence subscriptions from <strong>₹3.8 Cr/yr to ₹3.2L/mo</strong> on MeghRaj Cloud.</div>
          <div style="margin-top:4px;">• <strong>Zero Per-Query Tax:</strong> State cyber cells execute unlimited darknet queries with zero commercial license boundaries.</div>
        </div>
      </div>

      <!-- Card 2: Sovereign Security -->
      <div class="benefit-card" style="background:#EFF6FF; border:1.5px solid #BFDBFE;">
        <div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <strong style="font-size:23px; font-weight:900; color:#1E40AF;">Sovereign Security Benefits</strong>
            <span style="font-size:26px;">🛡️</span>
          </div>
          <div style="background:#DBEAFE; color:#1E40AF; font-size:13.5px; font-weight:800; padding:3px 10px; border-radius:4px; margin:4px 0 8px 0; display:inline-block;">
            100% SOVEREIGN RESIDENCY • ZERO FOREIGN TELEMETRY
          </div>
        </div>
        <div style="font-size:16px; font-weight:600; color:#1E293B; line-height:1.45;">
          <div>• <strong>Air-Gapped SCIF Deployment:</strong> Zero sensitive intelligence queries egress to foreign intelligence vendors (Flashpoint/Recorded Future).</div>
          <div style="margin-top:4px;">• <strong>Active APT Neutralization:</strong> Autonomous crawling unmasks clandestine ransomware syndicates & illicit arms bazaars.</div>
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
            CONVICTION RATE UP: &lt;12% ➔ 85%+ TRIAL SUCCESS
          </div>
        </div>
        <div style="font-size:16px; font-weight:600; color:#1E293B; line-height:1.45;">
          <div>• <strong>Automated Sec 63 BSA Dockets:</strong> FIPS 140-3 HSM signed Merkle roots convert ephemeral .onion scrapes into court-proof evidence.</div>
          <div style="margin-top:4px;">• <strong>Rapid Restitution & Conviction:</strong> Eliminates hostile witness acquittals through tamper-evident chain-of-custody.</div>
        </div>
      </div>

    </div>

    <!-- Section 2: Stakeholders & Operational Workflow -->
    <div style="margin-bottom:16px;">
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
        <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:19px; font-weight:800; padding:6px 32px; text-transform:uppercase; letter-spacing:0.5px;">STAKEHOLDERS & IMPACTS</div>
        <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:5px 20px; font-size:15px; font-weight:700; color:#1D4ED8;">Sample Operational Scenario: Darknet Threat Attribution Cycle</div>
      </div>

      <div style="grid-template-columns: repeat(4, 1fr); display:grid; gap:16px;">
        
        <!-- Step 1 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">Incident Ingested</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">Desk IO ingests seed .onion URL or extortion wallet from 1930 alert.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#2563EB; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">1</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">CYBER CRIME IO</strong>
          </div>
          <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#1E40AF; display:block; margin-bottom:3px;">Rapid Triage & Zero Backlog</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Instant Tor reachability probe; priority scoring in &lt; 30 seconds eliminates triage fatigue.</div>
          </div>
        </div>

        <!-- Step 2 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">Crawler Pool Active</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">Rotating proxy circuits trigger mod_status, TLS SNI, & NTP timestamp audit.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#059669; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">2</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">SCIENTIST 'D' (CUSTODIAN)</strong>
          </div>
          <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#065F46; display:block; margin-bottom:3px;">Instant Origin Unmasked</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Unmasks real hosting IP address; cuts darknet attribution from 14 days to &lt; 15 mins.</div>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">AI Cross-Validation</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">IndicBERT & Siamese RoBERTa correlate forum handles & crypto across 15 markets.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#D97706; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">3</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">SCIENTIST 'E' (AI LEAD)</strong>
          </div>
          <div style="background:#FEF3C7; border:1px solid #FDE68A; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#92400E; display:block; margin-bottom:3px;">Zero False Positive Chains</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Multi-modal entity linkage achieves 94.2% attribution confidence, preventing dead ends.</div>
          </div>
        </div>

        <!-- Step 4 -->
        <div class="workflow-col">
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:17px; font-weight:800; color:#0F172A; display:block; margin-bottom:3px;">Judicial Docket Signing</strong>
            <div style="font-size:15.5px; font-weight:600; color:#334155; line-height:1.4;">FIPS 140-3 HSM signs Sec 63 BSA certificate; compiles SHA-256 Merkle export.</div>
          </div>
          <div style="display:flex; align-items:center; gap:8px; padding:6px 0;">
            <div style="width:32px; height:32px; border-radius:50%; background:#DC2626; color:#FFF; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:16px;">4</div>
            <strong style="font-size:15.5px; font-weight:900; color:#0F172A;">DIRECTOR / CYBER COURT</strong>
          </div>
          <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:8px; padding:12px 14px;">
            <strong style="font-size:16.5px; font-weight:800; color:#991B1B; display:block; margin-bottom:3px;">High Conviction Trial</strong>
            <div style="font-size:15px; font-weight:600; color:#334155; line-height:1.4;">Standardized Sec 63 BSA dockets lift trial conviction rates to 85%+; supports Sec 94 BNSS.</div>
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
        <div>Attribution Latency Drop = ((14 × 1440 - 15) / (14 × 1440)) × 100 ≈ <span style="color:#34D399;">99.93%</span></div>
        <div style="margin-top:2px;">Sovereign Cost Ratio = (₹3.8 Cr - ₹38.4L) / ₹3.8 Cr ≈ <span style="color:#34D399;">89.89%</span></div>
      </div>

      <!-- Projection Badge -->
      <div style="background:#FEF3C7; border:1.5px solid #FCD34D; border-radius:10px; padding:10px 18px; text-align:right;">
        <div style="font-size:14.5px; font-weight:800; color:#92400E;">BHEDAK National Impact</div>
        <div style="font-size:20px; font-weight:900; color:#0F172A; margin-top:2px;">82% Cost Drop • ₹14.8 Cr Saved</div>
      </div>

    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">5</div>
    </div>
  </div>
</body>
</html>`;"""

def get_bhedak_slide_6():
    return """case 6:
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
            <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Tor Threat Scope</strong>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Ransomware leaks, arms, &amp; narcotics syndicates leverage onion routing to bypass clearnet firewalls.</div>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Extortion Surge</strong>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">120+ active darknet leak sites target Indian enterprises; <strong>+312% YoY surge</strong> in stolen enterprise credentials.</div>
          </div>
          <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:800; color:#0F172A; display:block; margin-bottom:2px;">Attribution Lag</strong>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Manual OSINT takes 14+ days with 88% dead-ends; BHEDAK slashes attribution cycle to <strong>&lt; 15 mins</strong>.</div>
          </div>
        </div>

        <!-- Statutory Banner -->
        <div style="background:#0F172A; border-radius:8px; padding:10px 16px; color:#FFFFFF; display:flex; align-items:center; gap:12px;">
          <div style="background:#2563EB; border-radius:6px; padding:4px 8px; font-size:13px; font-weight:900;">STATUTE</div>
          <div style="font-size:15px; font-weight:700; line-height:1.38;">
            <strong>Bharatiya Sakshya Adhiniyam (BSA) 2023 Section 63 &amp; IT Act Section 69:</strong> Mandates cryptographically verifiable chain-of-custody, SHA-256 Merkle roots, and automated Section 94 BNSS digital dockets.
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
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">Tor Protocol RFC 7686 &amp; DirAuth</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">IETF &amp; Tor Project Specifications</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Defines 56-char base32 .onion routing, directory authority consensus, and v3 descriptor encryption.</div>
          </div>

          <!-- Citation 2 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">IndicBERT Multilingual NLP Model</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">AI4Bharat / IIT Madras Research</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">284-dimensional stylometric embeddings decoding Hinglish, Hindi, and regional darknet vernacular.</div>
          </div>

          <!-- Citation 3 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">NIST SP 800-115 &amp; OWASP Probing</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">NIST Security Assessment Guide</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Active infrastructure fingerprinting, Apache status leaks, TLS SNI pivots, &amp; Favicon MMH3 hash inversion.</div>
          </div>

          <!-- Citation 4 -->
          <div class="citation-card">
            <strong style="font-size:16.5px; font-weight:900; color:#0F172A;">Neo4j Enterprise &amp; ClickHouse OLAP</strong>
            <div style="font-size:14px; font-weight:800; color:#2563EB; margin:2px 0 3px 0;">Distributed Graph &amp; Big Data Engine</div>
            <div style="font-size:14.5px; font-weight:600; color:#334155; line-height:1.38;">Property graph schema resolving 10,000+ threat actor nodes, PGP key binding, and sub-50ms BFS traversal.</div>
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
            <span style="font-size:18px; font-weight:900; color:#0F172A;">₹14.2k Cr</span>
            <span style="font-size:11.5px; font-weight:700; color:#64748B;">TAM (2030)</span>
          </div>
          <div style="flex:1; display:flex; flex-direction:column; gap:5px;">
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700;">
              <span>TAM: Global Dark Web Intel Market</span>
              <strong style="color:#0F172A; font-size:16px;">₹14,200 Cr</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700;">
              <span>SAM: Indian LEAs, NTRO, Defence</span>
              <strong style="color:#2563EB; font-size:16px;">₹4,100 Cr</strong>
            </div>
            <div style="display:flex; justify-content:space-between; font-size:15px; font-weight:700;">
              <span>SOM: 36 State Cyber Cells &amp; Central Agencies</span>
              <strong style="color:#059669; font-size:16px;">₹580 Cr</strong>
            </div>
          </div>
        </div>

        <!-- Unit Economics Grid -->
        <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 12px; text-align:center;">
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Nodes</div>
            <div style="font-size:18px; font-weight:900; color:#0F172A;">100 Units</div>
          </div>
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Appliance</div>
            <div style="font-size:18px; font-weight:900; color:#0F172A;">₹48,000</div>
          </div>
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Cloud / Mo</div>
            <div style="font-size:18px; font-weight:900; color:#0F172A;">₹3.2L/mo</div>
          </div>
          <div>
            <div style="font-size:12px; font-weight:800; color:#64748B; text-transform:uppercase;">Yr-1 Revenue</div>
            <div style="font-size:18px; font-weight:900; color:#059669;">₹8.4 Crore</div>
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
            <strong style="font-size:16.5px; font-weight:900; color:#991B1B; display:block; margin-bottom:4px;">Foreign SaaS (Recorded Future)</strong>
            <ul style="padding-left:16px; font-size:14.5px; font-weight:600; color:#334155; line-height:1.4; margin:0;">
              <li>Proprietary closed-source cloud</li>
              <li>₹3.8 Cr/yr foreign currency drain</li>
              <li>Telemetry stored in foreign servers</li>
              <li>Lacks native BSA Sec 63 certificate</li>
              <li>Manual request lag &gt; 14 days</li>
            </ul>
          </div>

          <div style="background:#ECFDF5; border:1.5px solid #A7F3D0; border-radius:8px; padding:10px 12px;">
            <strong style="font-size:16.5px; font-weight:900; color:#065F46; display:block; margin-bottom:4px;">Sovereign BHEDAK Solution</strong>
            <ul style="padding-left:16px; font-size:14.5px; font-weight:600; color:#334155; line-height:1.4; margin:0;">
              <li>100% On-Prem / NIC MeghRaj Cloud</li>
              <li>₹38L total deployment (82% savings)</li>
              <li>Complete sovereign data residency</li>
              <li>Automated Sec 63 BSA dual-cert kit</li>
              <li>Autonomous attribution &lt; 15 mins</li>
            </ul>
          </div>
        </div>

        <div style="background:#F8FAFC; border:1px solid #CBD5E1; border-radius:8px; padding:8px 14px; font-size:15px; font-weight:700; color:#0F172A; line-height:1.38;">
          <strong>Enterprise Conclusion:</strong> BHEDAK eliminates dependence on foreign intelligence monopolies, saves <strong>₹14.8 Cr</strong> in sovereign funds, and delivers court-certified evidence under Indian law.
        </div>
      </div>

    </div>

    <!-- Solid Blue Footer Bar (Slide 2 Master Match) -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:42px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px; z-index:100;">
      <div style="width:30px;"></div>
      <div style="font-size:17px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:22px; font-weight:900; color:#FFFFFF;">6</div>
    </div>
  </div>
</body>
</html>`;"""


# =========================================================================
# CHAKRA SLIDES BUILDER
# =========================================================================
def get_chakra_slide_4():
    return """case 4:
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
</html>`;"""

def get_chakra_slide_5():
    return """case 5:
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
</html>`;"""

def get_chakra_slide_6():
    return """case 6:
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
</html>`;"""


# =========================================================================
# MAIN GENERATION ROUTINE
# =========================================================================
def main():
    # 1. Generate BHEDAK
    from update_slide3_files import bhedak_slide_3_html, chakra_slide_3_html
    
    # Read existing Bhedak case 2
    with open('scripts/engine/generate_bhedak_slides.mjs', 'r', encoding='utf-8') as f:
        b_content = f.read()
    b_c2_start = b_content.find('case 2:')
    b_c3_start = b_content.find('case 3:')
    bhedak_slide_2 = b_content[b_c2_start:b_c3_start]

    bhedak_slide_1 = build_slide_1(
        deck_name="BHEDAK",
        ps_id="SIH26151",
        ps_title="Dark web threat actor de-anonymization",
        theme="Blockchain & Cybersecurity",
        category="Software",
        team_name="Indomitus",
        team_name_color="#000000",
        target_org="National Technical Research Organisation (NTRO)"
    )

    bhedak_slide_3 = prepare_slide_3(bhedak_slide_3_html, "BHEDAK")
    bhedak_slide_4 = get_bhedak_slide_4()
    bhedak_slide_5 = get_bhedak_slide_5()
    bhedak_slide_6 = get_bhedak_slide_6()

    bhedak_header = """/**
 * BHEDAK (भेदक) Presenton-Style Slide Deck Generator
 * Produces 6 pure white, 16:9 widescreen, Canva-grade slides.
 */

import {
  sihLogoB64,
  sihLogoLargeB64,
  bhedakGraphB64,
  ntroLogoB64,
  ICONS,
  COMMON_CSS
} from './slide_styles.mjs';

export function getBhedakSlideHTML(slideIndex) {
  switch (slideIndex) {
"""

    bhedak_footer = """    default:
      return `<div>Slide not found</div>`;
  }
}
"""
    full_bhedak = (
        bhedak_header + "    " +
        bhedak_slide_1 + "\n    " +
        bhedak_slide_2 + "\n    " +
        bhedak_slide_3 + "\n    " +
        bhedak_slide_4 + "\n    " +
        bhedak_slide_5 + "\n    " +
        bhedak_slide_6 + "\n" +
        bhedak_footer
    )

    with open('scripts/engine/generate_bhedak_slides.mjs', 'w', encoding='utf-8') as f:
        f.write(full_bhedak)
    print("[OK] BHEDAK generated successfully!")

    # 2. Generate CHAKRA
    with open('scripts/engine/generate_chakra_slides.mjs', 'r', encoding='utf-8') as f:
        c_content = f.read()
    c_c2_start = c_content.find('case 2:')
    c_c3_start = c_content.find('case 3:')
    chakra_slide_2 = c_content[c_c2_start:c_c3_start]

    chakra_slide_1 = build_slide_1(
        deck_name="CHAKRA",
        ps_id="SIH26182",
        ps_title="Automated Attribution of Unknown Cryptocurrency Wallets to Nearest Virtual Asset Service Providers (VASPs) through Blockchain Intelligence APIs",
        theme="Blockchain & Cybersecurity",
        category="Software",
        team_name="Indomitus",
        team_name_color="#15479E",
        target_org="Ministry of Home Affairs (MHA)"
    )

    chakra_slide_3 = prepare_slide_3(chakra_slide_3_html, "CHAKRA")
    chakra_slide_4 = get_chakra_slide_4()
    chakra_slide_5 = get_chakra_slide_5()
    chakra_slide_6 = get_chakra_slide_6()

    chakra_header = """/**
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
"""

    chakra_footer = """    default:
      return `<div>Slide not found</div>`;
  }
}
"""
    full_chakra = (
        chakra_header + "    " +
        chakra_slide_1 + "\n    " +
        chakra_slide_2 + "\n    " +
        chakra_slide_3 + "\n    " +
        chakra_slide_4 + "\n    " +
        chakra_slide_5 + "\n    " +
        chakra_slide_6 + "\n" +
        chakra_footer
    )

    with open('scripts/engine/generate_chakra_slides.mjs', 'w', encoding='utf-8') as f:
        f.write(full_chakra)
    print("[OK] CHAKRA generated successfully!")

if __name__ == '__main__':
    main()
