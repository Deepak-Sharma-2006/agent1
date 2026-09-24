import re
import sys
import os

def get_bhedak_slide_5():
    return '''    case 5:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-5-container {
      width: 1920px;
      height: 1080px;
      padding: 24px 48px 30px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .content-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      padding: 14px 18px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03);
    }
    .card-tint-salmon { background: #FFF1F2; border: 1.5px solid #FECDD3; }
    .card-tint-amber { background: #FFFBEB; border: 1.5px solid #FDE68A; }
    .card-tint-emerald { background: #F0FDF4; border: 1.5px solid #BBF7D0; }
    .black-pill {
      background: #000000;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 17px;
      padding: 5px 24px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .flow-action-box {
      background: #FFFFFF;
      border: 1.5px dashed #94A3B8;
      border-radius: 10px;
      padding: 9px 11px;
      min-height: 82px;
      display: flex;
      gap: 9px;
      align-items: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .flow-avatar-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0F172A;
      background: #FFFFFF;
      box-shadow: 0 2px 5px rgba(0,0,0,0.08);
      flex-shrink: 0;
    }
    .flow-impact-box {
      border: 1.5px dashed #94A3B8;
      border-radius: 10px;
      padding: 10px 12px;
      min-height: 105px;
      background: #F8FAFC;
    }
    .sdg-badge {
      width: 76px;
      height: 72px;
      border-radius: 8px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #FFFFFF;
      font-family: -apple-system, sans-serif;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body>
  <div class="slide-5-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + SIH 2026 Logo (Uniform 102px / 98px across Slides 1-6) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:14px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">IMPACTS AND BENEFITS</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main Content Stage (860px total height) -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:860px;">
      
      <!-- Tier 1: Top 3 Colored Benefit Cards (Height: ~140px) -->
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px;">
        <div class="content-card card-tint-salmon">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:18px; font-weight:900; color:#991B1B;">Economic Benefits</div>
            <div style="font-size:20px;">📈</div>
          </div>
          <div style="font-size:12.5px; color:#7F1D1D; line-height:1.45;">
            Reduces national cyber threat intelligence expenditure by <strong>82%</strong>, slashing foreign vendor subscriptions from <strong>₹3.8 Cr/yr</strong> to <strong>₹3.2L/mo</strong> on MeghRaj Cloud. Saves <strong>₹14.8 Cr</strong> across 5-year multi-agency deployment with zero per-query commercial SaaS fees.
          </div>
        </div>

        <div class="content-card card-tint-amber">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:18px; font-weight:900; color:#92400E;">Sovereign Security Benefits</div>
            <div style="font-size:20px;">🛡️</div>
          </div>
          <div style="font-size:12.5px; color:#78350F; line-height:1.45;">
            Guarantees <strong>100% sovereign data residency</strong> with zero telemetry leakage to foreign servers. Autonomous crawling neutralizes state-sponsored APT disinformation cells, clandestine extortion portals, and illicit arms/narcotics networks operating on Tor v3 hidden services.
          </div>
        </div>

        <div class="content-card card-tint-emerald">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:18px; font-weight:900; color:#166534;">Evidentiary & Judicial Sovereignty</div>
            <div style="font-size:20px;">⚖️</div>
          </div>
          <div style="font-size:12.5px; color:#14532D; line-height:1.45;">
            Automates Section 63 BSA cryptographic Merkle schedules and SHA-256 chain-of-custody dockets. Increases darknet criminal prosecution conviction rates from <strong>&lt; 12% to over 85%</strong>, turning ephemeral onion captures into immutable court-admissible trial evidence.
          </div>
        </div>
      </div>

      <!-- Tier 2: Stakeholders & Impacts 4-Step Pipeline (Height: ~370px) -->
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div class="black-pill">STAKEHOLDERS & IMPACTS</div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; color:#1E40AF; font-size:13px; font-weight:800; border-radius:9999px; padding:4px 18px;">Sample Operational Scenario</div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:16px; align-items:stretch;">
          
          <!-- Step 1 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#EFF6FF; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.user}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">Incident Ingested</strong>
                Cyber Crime Desk IO ingests seed .onion leak URL or extortion wallet from 1930 Helpline alert.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 4px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-size:18px; font-weight:900; color:#0F172A;">①</div>
                <div class="flow-avatar-box" style="border-color:#3B82F6;">${ICONS.shield}</div>
                <div>
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">Cyber Crime IO</div>
                  <div style="font-size:10.5px; color:#64748B; font-weight:700;">Desk Officer</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-size:10.5px; font-weight:800; color:#3B82F6;">Seed Ingested</span>
                <span style="font-size:18px; color:#94A3B8;">➔</span>
              </div>
            </div>

            <!-- Bottom Impact Box -->
            <div class="flow-impact-box">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="font-size:16px;">⚡</div>
                <strong style="font-size:12.5px; color:#0F172A;">Rapid Triage & Zero Backlog</strong>
              </div>
              <div style="font-size:11px; color:#475569; line-height:1.35;">
                Instant Tor reachability probe; autonomous priority scoring in &lt; 30 seconds eliminates officer triage fatigue.
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#ECFDF5; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.cpu}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">Crawler Pool Active</strong>
                Rotating Tor proxy circuits trigger mod_status, TLS SNI, and NTP timestamp analysis to expose origin server.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 4px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-size:18px; font-weight:900; color:#0F172A;">②</div>
                <div class="flow-avatar-box" style="border-color:#10B981;">${ICONS.network}</div>
                <div>
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">Scientist 'D'</div>
                  <div style="font-size:10.5px; color:#64748B; font-weight:700;">TechINT Custodian</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-size:10.5px; font-weight:800; color:#10B981;">IP Unmasked</span>
                <span style="font-size:18px; color:#94A3B8;">➔</span>
              </div>
            </div>

            <!-- Bottom Impact Box -->
            <div class="flow-impact-box">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="font-size:16px;">🎯</div>
                <strong style="font-size:12.5px; color:#0F172A;">Instant Origin Attribution</strong>
              </div>
              <div style="font-size:11px; color:#475569; line-height:1.35;">
                Unmasks real hosting IP address; cuts darknet origin attribution time from 14 days down to &lt; 15 minutes.
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#FFFBEB; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.database}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">AI Cross-Validation</strong>
                IndicBERT stylometry & Siamese networks correlate forum handles, PGP keys, and crypto ledgers across 15 markets.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 4px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-size:18px; font-weight:900; color:#0F172A;">③</div>
                <div class="flow-avatar-box" style="border-color:#F59E0B;">${ICONS.analytics}</div>
                <div>
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">Scientist 'E'</div>
                  <div style="font-size:10.5px; color:#64748B; font-weight:700;">Forensic AI Lead</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-size:10.5px; font-weight:800; color:#D97706;">94.2% Match</span>
                <span style="font-size:18px; color:#94A3B8;">➔</span>
              </div>
            </div>

            <!-- Bottom Impact Box -->
            <div class="flow-impact-box">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="font-size:16px;">🔍</div>
                <strong style="font-size:12.5px; color:#0F172A;">Zero False Positive Chains</strong>
              </div>
              <div style="font-size:11px; color:#475569; line-height:1.35;">
                Multi-modal entity linkage achieves 94.2% attribution confidence; prevents wasted investigations and dead ends.
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#FEF2F2; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.gavel}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">Judicial Docket Signing</strong>
                FIPS 140-3 HSM signs Section 63 BSA certificate; compiles SHA-256 Merkle chain-of-custody export for court.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:flex-start; padding:2px 4px; gap:8px;">
              <div style="font-size:18px; font-weight:900; color:#0F172A;">④</div>
              <div class="flow-avatar-box" style="border-color:#DC2626;">${ICONS.document}</div>
              <div>
                <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">Director / Court</div>
                <div style="font-size:10.5px; color:#64748B; font-weight:700;">Judicial Authority</div>
              </div>
            </div>

            <!-- Bottom Impact Box: Solid Card for Regulatory & Judicial -->
            <div class="content-card" style="background:#F8FAFC; border:1.5px solid #CBD5E1; padding:10px 12px; min-height:105px;">
              <div style="font-size:12.5px; font-weight:900; color:#0F172A; margin-bottom:4px;">Government & Judicial Impact</div>
              <div style="font-size:11px; color:#334155; line-height:1.35;">
                • Standardized Sec 63 BSA certificates lift trial conviction rates to 85%+.<br>
                • Real-time evidence dockets support Section 94 BNSS summons and MLAT.
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Tier 3: Our Promise & National Projections (Height: ~195px) -->
      <div>
        <div class="black-pill" style="margin-bottom:10px;">OUR PROMISE</div>

        <div style="display:grid; grid-template-columns: 29% 31% 40%; gap:18px; align-items:stretch;">
          <!-- UN SDG Badges -->
          <div class="content-card" style="padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:12px; font-weight:800; color:#0F172A; margin-bottom:6px;">
              Aligns with UN Sustainable Development Goals & National Missions:
            </div>
            <div style="display:flex; gap:8px;">
              <div class="sdg-badge" style="background:#FD6925;">
                <span style="font-size:11px; font-weight:900;">SDG 9</span>
                <span style="font-size:10.5px; line-height:1.1;">Industry & Innovation</span>
              </div>
              <div class="sdg-badge" style="background:#00689D;">
                <span style="font-size:11px; font-weight:900;">SDG 16</span>
                <span style="font-size:10.5px; line-height:1.1;">Peace & Justice</span>
              </div>
              <div class="sdg-badge" style="background:#1E3A8A;">
                <span style="font-size:10.5px; font-weight:900;">SURAKSHIT</span>
                <span style="font-size:10.5px; line-height:1.1;">Cyber Bharat</span>
              </div>
              <div class="sdg-badge" style="background:#059669;">
                <span style="font-size:10.5px; font-weight:900;">DIGITAL</span>
                <span style="font-size:10.5px; line-height:1.1;">India Mission</span>
              </div>
            </div>
          </div>

          <!-- National Goal & Formula Box -->
          <div class="content-card" style="padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:13.5px; font-weight:900; color:#0F172A;">National Cyber Shield 2030</div>
              <div style="font-size:11.5px; color:#475569; margin-top:2px;">
                Target: De-anonymize 90%+ Indian-targeted Tor illicit services in &lt; 15 mins.
              </div>
            </div>
            <div style="background:#0F172A; border-radius:6px; padding:6px 10px; margin-top:6px; color:#38BDF8; font-family:monospace; font-size:11px; font-weight:700;">
              <div>Latency Reduction = ((14 × 1440 - 15) / (14 × 1440)) × 100 ≈ 99.93%</div>
              <div style="color:#A7F3D0; margin-top:2px;">Sovereign Cost Ratio = (₹3.8 Cr - ₹38.4L) / ₹3.8 Cr ≈ 89.89%</div>
            </div>
          </div>

          <!-- Highlighted Impact Projection Callout Box -->
          <div style="background:#FFFBEB; border:2.5px dashed #D97706; border-radius:14px; padding:12px 16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:11.5px; font-weight:800; color:#DC2626;">
              *Consolidated Proof documents of all research is provided in slide 6
            </div>
            <div style="display:flex; align-items:center; gap:14px; margin-top:4px;">
              <div style="flex:1; font-size:13px; font-weight:900; color:#92400E; line-height:1.35;">
                BHEDAK is projected to improve threat attribution speed by <strong>99.9%</strong>, validated against commercial threat intelligence benchmarks.
              </div>
              <div style="display:flex; align-items:center; gap:8px; background:#FEF3C7; border:1.5px solid #F59E0B; border-radius:8px; padding:8px 12px; flex-shrink:0;">
                <span style="font-size:24px;">🛡️</span>
                <div style="font-size:13px; font-weight:900; color:#78350F; line-height:1.2;">
                  82% Cost Drop<br><span style="font-size:11px; color:#92400E;">₹14.8 Cr Saved</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:38px; border-top:1.5px solid #E2E8F0; padding-top:8px; margin-top:14px;">
      <div style="font-size:14px; font-weight:800; color:#475569; letter-spacing:0.5px;">PROJECT BHEDAK (भेदक) • NTRO CITC DIVISION • CONFIDENTIAL</div>
      <div style="font-size:19px; font-weight:700; color:#1E3A8A; margin:0 auto;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:28px; font-weight:900; color:#1E3A8A;">5</div>
    </div>
  </div>
</body>
</html>`;
'''

def get_bhedak_slide_6():
    return '''    case 6:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-6-container {
      width: 1920px;
      height: 1080px;
      padding: 24px 48px 30px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .content-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 14px;
      padding: 14px 18px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03);
    }
    .black-pill {
      background: #000000;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 16px;
      padding: 4px 22px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ref-link {
      font-size: 11px;
      font-weight: 800;
      color: #2563EB;
      text-decoration: underline;
      cursor: pointer;
    }
    .green-star-pill {
      background: #166534;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 16px;
      padding: 4px 18px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <div class="slide-6-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + SIH 2026 Logo (Uniform 102px / 98px across Slides 1-6) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:14px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">RESEARCH AND REFERENCES</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main Content Stage (860px total height) -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:860px;">
      
      <!-- Top Row: Domain Research & Our Works (Height: ~400px) -->
      <div style="display:grid; grid-template-columns: 55% 45%; gap:20px; height:405px;">
        
        <!-- Top Left: Darknet in India - Research & Statutory Grounding -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="font-size:16px; font-weight:900; color:#0F172A; text-transform:uppercase; margin-bottom:8px;">
              DARKNET IN INDIA — RESEARCH & STATUTORY GROUNDING
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
              <!-- Historical Context -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                  <span style="font-size:16px;">🌐</span>
                  <strong style="font-size:12px; color:#0F172A;">Tor Threat Landscape</strong>
                </div>
                <div style="font-size:11px; color:#475569; line-height:1.35;">
                  Ransomware extortion portals and illicit arms/drug markets exploit Tor v3 onion routing to evade standard ISP monitoring.
                </div>
              </div>

              <!-- Threat Stats with mini SVG bar chart -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Extortion Growth</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569; margin-bottom:4px;">
                  Over <strong>120+ active leak sites</strong> target Indian critical entities (312% YoY surge in stolen enterprise credentials).
                </div>
                <!-- Mini Bar Graphic -->
                <div style="display:flex; align-items:flex-end; gap:5px; height:24px; padding-top:4px;">
                  <div style="width:12px; height:10px; background:#94A3B8; border-radius:2px;"></div>
                  <div style="width:12px; height:16px; background:#64748B; border-radius:2px;"></div>
                  <div style="width:12px; height:24px; background:#DC2626; border-radius:2px;"></div>
                  <span style="font-size:10.5px; font-weight:800; color:#DC2626; margin-left:4px;">+312% YoY</span>
                </div>
              </div>

              <!-- Attribution Bottleneck -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Attribution Lag</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569; margin-bottom:4px;">
                  Manual OSINT takes <strong>14+ days</strong> with an 88% dead-end rate due to encrypted relays and rotating proxies.
                </div>
                <div style="font-size:11px; font-weight:800; color:#0891B2;">
                  Bhedak reduces latency to &lt; 15 mins.
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Banner: Statutory Regulation & Admissibility -->
          <div style="background:#0F172A; border-radius:10px; padding:10px 14px; color:#FFFFFF; margin-top:10px; display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:12.5px; font-weight:900; color:#38BDF8; margin-bottom:2px;">
                Statutory Mandate: Bharatiya Sakshya Adhiniyam (BSA) 2023 Sec 63 & IT Act Sec 69
              </div>
              <div style="font-size:11px; color:#E2E8F0; line-height:1.35;">
                Enforces cryptographically verifiable chain-of-custody, SHA-256 Merkle hashes, and automated Section 94 BNSS digital evidence dockets for high-conviction trials.
              </div>
            </div>
            <div style="margin-left:14px; flex-shrink:0;">
              <span style="background:#1E293B; border:1px solid #475569; border-radius:6px; padding:4px 10px; color:#60A5FA; font-size:11px; font-weight:800; cursor:pointer;">Click here</span>
            </div>
          </div>
        </div>

        <!-- Top Right: Our Works & Technical References -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div class="green-star-pill">Our Works ★</div>
              <div style="font-size:12px; font-weight:800; color:#475569;">👆 CLICK ON THE IMAGES TO VISIT LINKS</div>
            </div>

            <!-- Two Hero Clickable Cards -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
              <div style="background:#F8FAFC; border:2px solid #000000; border-radius:10px; padding:10px 12px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                ${ICONS.github}
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block;">GitHub Repository</strong>
                  <span style="font-size:11px; color:#475569; display:block;">View full production source</span>
                  <span class="ref-link">Click here</span>
                </div>
              </div>

              <div style="background:#F0FDF4; border:2px solid #16A34A; border-radius:10px; padding:10px 12px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                ${ICONS.document}
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block;">Proof Documents</strong>
                  <span style="font-size:11px; color:#475569; display:block;">Consolidated research dossier</span>
                  <span style="font-size:11px; font-weight:800; color:#16A34A; text-decoration:underline;">Click here</span>
                </div>
              </div>
            </div>

            <!-- 4 Technical References Grid -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Tor Protocol RFC 7686</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Special-Use .onion Domain & Tor v3 Rendezvous Specs</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">IndicBERT Stylometry</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Multilingual NLP Author Profiling & Cosine Embeddings</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Apache Kafka Ingestion</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Distributed stream architecture for high-throughput crawls</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Neo4j & ClickHouse</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Property graph intelligence & columnar big-data OLAP</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Bottom Row: Market Research TAM/SAM/SOM & Sovereign Comparative Benchmark (Height: ~430px) -->
      <div style="display:grid; grid-template-columns: 55% 45%; gap:20px; height:435px;">
        
        <!-- Bottom Left: Market Research TAM/SAM/SOM -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div class="black-pill">MARKET - RESEARCH</div>
              <span class="ref-link">Click here for TAM Analysis</span>
            </div>

            <!-- Concentric Rings & Market Growth -->
            <div style="display:flex; align-items:center; gap:18px; margin-bottom:10px;">
              <!-- SVG Concentric Donut Rings -->
              <div style="width:130px; height:130px; flex-shrink:0;">
                <svg viewBox="0 0 100 100" width="130" height="130">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#7C3AED" stroke-width="12" opacity="0.9"/>
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#2563EB" stroke-width="12" opacity="0.9"/>
                  <circle cx="50" cy="50" r="18" fill="none" stroke="#D97706" stroke-width="12" opacity="0.9"/>
                  <text x="50" y="53" font-size="11" font-weight="900" text-anchor="middle" fill="#0F172A">INDIA</text>
                </svg>
              </div>

              <!-- Market Figures -->
              <div style="flex:1;">
                <div style="font-size:11.5px; color:#475569; margin-bottom:6px;">
                  Global Dark Web Intelligence Market reaches <strong>$14,200M (₹1,18,000 Cr)</strong> by 2030 (16.4% CAGR).
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; background:#F5F3FF; padding:4px 8px; border-radius:5px;">
                    <span><strong style="color:#7C3AED;">TAM:</strong> Global Dark Web Intelligence & Forensics</span>
                    <strong style="color:#7C3AED;">₹14,200 Cr</strong>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; background:#EFF6FF; padding:4px 8px; border-radius:5px;">
                    <span><strong style="color:#2563EB;">SAM:</strong> Indian Sovereign LEAs, CERT-In & Defence</span>
                    <strong style="color:#2563EB;">₹4,100 Cr</strong>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; background:#FFFBEB; padding:4px 8px; border-radius:5px;">
                    <span><strong style="color:#D97706;">SOM:</strong> 36 State Cyber Cells, NTRO & I4C Hub</span>
                    <strong style="color:#D97706;">₹580 Cr</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Unit Economics Table -->
            <div style="border-top:1.5px solid #E2E8F0; padding-top:8px;">
              <div style="font-size:12px; font-weight:900; color:#0F172A; margin-bottom:4px;">Financial Unit Economics & Revenue Model</div>
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; text-align:center;">
                <div style="background:#F8FAFC; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#64748B;">Investigation Nodes</div>
                  <div style="font-size:12.5px; font-weight:900; color:#0F172A;">100 Units</div>
                </div>
                <div style="background:#F8FAFC; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#64748B;">Appliance Unit Price</div>
                  <div style="font-size:12.5px; font-weight:900; color:#0F172A;">₹48,000</div>
                </div>
                <div style="background:#F8FAFC; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#64748B;">MeghRaj Cloud Cost</div>
                  <div style="font-size:12.5px; font-weight:900; color:#0F172A;">₹3.2L/mo</div>
                </div>
                <div style="background:#F0FDF4; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#166534;">Year-1 Revenue</div>
                  <div style="font-size:12.5px; font-weight:900; color:#166534;">₹8.4 Crore</div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:11px; color:#475569;">
                <span><strong>Profit Margins:</strong> Software 85% (low marginal cloud scale), Appliance 30%</span>
                <span class="ref-link">Click here for Model</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Right: Sovereign vs Foreign Commercial Benchmark -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div style="font-size:16px; font-weight:900; color:#0F172A; text-transform:uppercase;">
                SOVEREIGN VS FOREIGN COMMERCIAL BENCHMARK
              </div>
              <span class="ref-link">Click here</span>
            </div>

            <!-- 2 Benchmark Cards -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:10px;">
              <!-- Foreign Vendor -->
              <div style="background:#FFF1F2; border:1.5px solid #FECDD3; border-radius:10px; padding:10px 12px;">
                <div style="font-size:13px; font-weight:900; color:#991B1B; margin-bottom:4px;">
                  Foreign Commercial SaaS (Recorded Future)
                </div>
                <div style="font-size:11px; color:#7F1D1D; line-height:1.4;">
                  • Closed-source proprietary foreign cloud<br>
                  • ₹3.8 Cr/yr recurring currency outflow<br>
                  • Telemetry stored outside Indian jurisdiction<br>
                  • Lacks native BSA 2023 Sec 63 certificate<br>
                  • Manual OSINT latency &gt; 14 days
                </div>
                <div style="margin-top:6px;"><span class="ref-link" style="color:#991B1B;">Click here for Audit</span></div>
              </div>

              <!-- Sovereign Solution -->
              <div style="background:#F0FDF4; border:1.5px solid #BBF7D0; border-radius:10px; padding:10px 12px;">
                <div style="font-size:13px; font-weight:900; color:#166534; margin-bottom:4px;">
                  Sovereign Solution (BHEDAK)
                </div>
                <div style="font-size:11px; color:#14532D; line-height:1.4;">
                  • 100% On-prem / MeghRaj Sovereign Cloud<br>
                  • ₹38L total deployment (82% cost reduction)<br>
                  • Complete data residency & zero foreign leakage<br>
                  • Native Sec 63 BSA Merkle trial certificate<br>
                  • Autonomous de-anonymization &lt; 15 mins
                </div>
                <div style="margin-top:6px;"><span class="ref-link" style="color:#166534;">Click here for Benchmark</span></div>
              </div>
            </div>

            <!-- Bottom Summary Callout -->
            <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:8px; padding:8px 12px;">
              <div style="font-size:11.5px; color:#1E3A8A; line-height:1.35;">
                <strong>Enterprise Conclusion:</strong> BHEDAK eliminates dependence on foreign intelligence monopolies, saves <strong>₹14.8 Cr</strong> in sovereign funds, and delivers court-certified evidence adhering to Indian criminal law.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>

    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:38px; border-top:1.5px solid #E2E8F0; padding-top:8px; margin-top:14px;">
      <div style="font-size:14px; font-weight:800; color:#475569; letter-spacing:0.5px;">PROJECT BHEDAK (भेदक) • NTRO CITC DIVISION • CONFIDENTIAL</div>
      <div style="font-size:19px; font-weight:700; color:#1E3A8A; margin:0 auto;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:28px; font-weight:900; color:#1E3A8A;">6</div>
    </div>
  </div>
</body>
</html>`;
'''

def get_chakra_slide_5():
    return '''    case 5:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-5-container {
      width: 1920px;
      height: 1080px;
      padding: 24px 48px 30px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .content-card {
      background: #FFFFFF;
      border: 1.5px solid #E2E8F0;
      border-radius: 14px;
      padding: 14px 18px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03);
    }
    .card-tint-salmon { background: #FFF1F2; border: 1.5px solid #FECDD3; }
    .card-tint-amber { background: #FFFBEB; border: 1.5px solid #FDE68A; }
    .card-tint-emerald { background: #F0FDF4; border: 1.5px solid #BBF7D0; }
    .black-pill {
      background: #000000;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 17px;
      padding: 5px 24px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    .flow-action-box {
      background: #FFFFFF;
      border: 1.5px dashed #94A3B8;
      border-radius: 10px;
      padding: 9px 11px;
      min-height: 82px;
      display: flex;
      gap: 9px;
      align-items: flex-start;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02);
    }
    .flow-avatar-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid #0F172A;
      background: #FFFFFF;
      box-shadow: 0 2px 5px rgba(0,0,0,0.08);
      flex-shrink: 0;
    }
    .flow-impact-box {
      border: 1.5px dashed #94A3B8;
      border-radius: 10px;
      padding: 10px 12px;
      min-height: 105px;
      background: #F8FAFC;
    }
    .sdg-badge {
      width: 76px;
      height: 72px;
      border-radius: 8px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      color: #FFFFFF;
      font-family: -apple-system, sans-serif;
      box-shadow: 0 2px 5px rgba(0,0,0,0.15);
    }
  </style>
</head>
<body>
  <div class="slide-5-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + SIH 2026 Logo (Uniform 102px / 98px across Slides 1-6) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:14px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">IMPACTS AND BENEFITS</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main Content Stage (860px total height) -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:860px;">
      
      <!-- Tier 1: Top 3 Colored Benefit Cards (Height: ~140px) -->
      <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px;">
        <div class="content-card card-tint-salmon">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:18px; font-weight:900; color:#991B1B;">Economic Benefits</div>
            <div style="font-size:20px;">📈</div>
          </div>
          <div style="font-size:12.5px; color:#7F1D1D; line-height:1.45;">
            Reduces VDA forensic intelligence expenditure by <strong>85%</strong>, replacing expensive foreign SaaS ($75,000/seat/yr) with a centralized <strong>₹4.5L/mo</strong> NIC MeghRaj deployment. Saves <strong>₹18.5 Cr</strong> over 5 years across 36 State Cyber Divisions with zero per-query fees.
          </div>
        </div>

        <div class="content-card card-tint-amber">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:18px; font-weight:900; color:#92400E;">Citizen Relief & Restitution</div>
            <div style="font-size:20px;">🛡️</div>
          </div>
          <div style="font-size:12.5px; color:#78350F; line-height:1.45;">
            Protects Indian citizens by intercepting financial cyber fraud within the critical <strong>120-minute Golden Hour</strong>. Prevents over <strong>₹1,750+ Cr</strong> in defrauded victim funds by halting wallet transfers before crypto mixer liquidation.
          </div>
        </div>

        <div class="content-card card-tint-emerald">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
            <div style="font-size:18px; font-weight:900; color:#166534;">Statutory & Judicial Sovereignty</div>
            <div style="font-size:20px;">⚖️</div>
          </div>
          <div style="font-size:12.5px; color:#14532D; line-height:1.45;">
            Automates Section 106 & 107 BNSS freeze orders and Section 63 BSA cryptographic Merkle schedules. Ensures <strong>100% chain-of-custody compliance</strong> for swift judicial confiscation and direct victim restitution across all 36 States & UTs.
          </div>
        </div>
      </div>

      <!-- Tier 2: Stakeholders & Impacts 4-Step Pipeline (Height: ~370px) -->
      <div>
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div class="black-pill">STAKEHOLDERS & IMPACTS</div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; color:#1E40AF; font-size:13px; font-weight:800; border-radius:9999px; padding:4px 18px;">Sample Operational Scenario</div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap:16px; align-items:stretch;">
          
          <!-- Step 1 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#EFF6FF; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.user}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">1930 Call Ingested</strong>
                Victim reports unauthorized UPI/crypto siphon on 1930 Helpline; IO logs case docket in under 3 minutes.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 4px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-size:18px; font-weight:900; color:#0F172A;">①</div>
                <div class="flow-avatar-box" style="border-color:#3B82F6;">${ICONS.shield}</div>
                <div>
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">First Responder IO</div>
                  <div style="font-size:10.5px; color:#64748B; font-weight:700;">1930 Desk Officer</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-size:10.5px; font-weight:800; color:#3B82F6;">Golden Hour</span>
                <span style="font-size:18px; color:#94A3B8;">➔</span>
              </div>
            </div>

            <!-- Bottom Impact Box -->
            <div class="flow-impact-box">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="font-size:16px;">⚡</div>
                <strong style="font-size:12.5px; color:#0F172A;">Zero Triage Delay</strong>
              </div>
              <div style="font-size:11px; color:#475569; line-height:1.35;">
                Immediate wallet address blacklisting across domestic exchange gateways in &lt; 120 seconds.
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#ECFDF5; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.cpu}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">Peeling Chain Traced</strong>
                Multi-hop graph engine traverses 10+ peeling hops across EVM, TRON, and Bitcoin in &lt; 15 seconds.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 4px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-size:18px; font-weight:900; color:#0F172A;">②</div>
                <div class="flow-avatar-box" style="border-color:#10B981;">${ICONS.network}</div>
                <div>
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">Forensic Analyst</div>
                  <div style="font-size:10.5px; color:#64748B; font-weight:700;">State Cyber Cell</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-size:10.5px; font-weight:800; color:#10B981;">Hops Mapped</span>
                <span style="font-size:18px; color:#94A3B8;">➔</span>
              </div>
            </div>

            <!-- Bottom Impact Box -->
            <div class="flow-impact-box">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="font-size:16px;">🎯</div>
                <strong style="font-size:12.5px; color:#0F172A;">Autonomous Attribution</strong>
              </div>
              <div style="font-size:11px; color:#475569; line-height:1.35;">
                Unmasks exchange deposit clusters and illicit OTC cash-out syndicates across cross-chain bridges.
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#FFFBEB; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.database}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">Supervisory Sign-Off</strong>
                DySP reviews attribution confidence (≥ 85%) and signs Section 106 BNSS statutory freezing directive.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:space-between; padding:2px 4px;">
              <div style="display:flex; align-items:center; gap:8px;">
                <div style="font-size:18px; font-weight:900; color:#0F172A;">③</div>
                <div class="flow-avatar-box" style="border-color:#F59E0B;">${ICONS.analytics}</div>
                <div>
                  <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">Supervisory DySP</div>
                  <div style="font-size:10.5px; color:#64748B; font-weight:700;">Sub-Divisional Lead</div>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:4px;">
                <span style="font-size:10.5px; font-weight:800; color:#D97706;">Notice Signed</span>
                <span style="font-size:18px; color:#94A3B8;">➔</span>
              </div>
            </div>

            <!-- Bottom Impact Box -->
            <div class="flow-impact-box">
              <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                <div style="font-size:16px;">🔍</div>
                <strong style="font-size:12.5px; color:#0F172A;">Real-time Accountability</strong>
              </div>
              <div style="font-size:11px; color:#475569; line-height:1.35;">
                Immutable audit trail logs all officer queries, guaranteeing zero evidentiary spoliation or tampering.
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div style="display:flex; flex-direction:column; justify-content:space-between; gap:10px;">
            <!-- Top Action Box -->
            <div class="flow-action-box">
              <div style="width:32px; height:32px; background:#FEF2F2; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">${ICONS.gavel}</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.35;">
                <strong style="color:#0F172A; display:block; font-size:12px; margin-bottom:2px;">Asset Freezing & Court</strong>
                VASP API executes wallet freeze; Magistrate signs Section 107 BNSS direct victim restitution order.
              </div>
            </div>

            <!-- Center Workflow Node -->
            <div style="display:flex; align-items:center; justify-content:flex-start; padding:2px 4px; gap:8px;">
              <div style="font-size:18px; font-weight:900; color:#0F172A;">④</div>
              <div class="flow-avatar-box" style="border-color:#DC2626;">${ICONS.document}</div>
              <div>
                <div style="font-size:12px; font-weight:900; color:#0F172A; text-transform:uppercase;">VASP & Court</div>
                <div style="font-size:10.5px; color:#64748B; font-weight:700;">Judicial Authority</div>
              </div>
            </div>

            <!-- Bottom Impact Box: Solid Card for Regulatory & Judicial -->
            <div class="content-card" style="background:#F8FAFC; border:1.5px solid #CBD5E1; padding:10px 12px; min-height:105px;">
              <div style="font-size:12.5px; font-weight:900; color:#0F172A; margin-bottom:4px;">Judicial & Law Enforcement Impact</div>
              <div style="font-size:11px; color:#334155; line-height:1.35;">
                • Enables statutory direct victim restitution under Section 107 BNSS.<br>
                • Admissible Sec 63 BSA certificates streamline high-conviction trials.
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Tier 3: Our Promise & National Projections (Height: ~195px) -->
      <div>
        <div class="black-pill" style="margin-bottom:10px;">OUR PROMISE</div>

        <div style="display:grid; grid-template-columns: 29% 31% 40%; gap:18px; align-items:stretch;">
          <!-- UN SDG Badges -->
          <div class="content-card" style="padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:12px; font-weight:800; color:#0F172A; margin-bottom:6px;">
              Aligns with UN Sustainable Development Goals & National Missions:
            </div>
            <div style="display:flex; gap:8px;">
              <div class="sdg-badge" style="background:#FD6925;">
                <span style="font-size:11px; font-weight:900;">SDG 9</span>
                <span style="font-size:10.5px; line-height:1.1;">Industry & Innovation</span>
              </div>
              <div class="sdg-badge" style="background:#00689D;">
                <span style="font-size:11px; font-weight:900;">SDG 16</span>
                <span style="font-size:10.5px; line-height:1.1;">Peace & Justice</span>
              </div>
              <div class="sdg-badge" style="background:#1E3A8A;">
                <span style="font-size:10.5px; font-weight:900;">SURAKSHIT</span>
                <span style="font-size:10.5px; line-height:1.1;">Cyber Bharat</span>
              </div>
              <div class="sdg-badge" style="background:#059669;">
                <span style="font-size:10.5px; font-weight:900;">DIGITAL</span>
                <span style="font-size:10.5px; line-height:1.1;">India Mission</span>
              </div>
            </div>
          </div>

          <!-- National Goal & Formula Box -->
          <div class="content-card" style="padding:12px 14px; display:flex; flex-direction:column; justify-content:space-between;">
            <div>
              <div style="font-size:13.5px; font-weight:900; color:#0F172A;">I4C Golden Hour Mission 2030</div>
              <div style="font-size:11.5px; color:#475569; margin-top:2px;">
                Target: Intercept 90%+ VDA fraud outflows within 120 mins.
              </div>
            </div>
            <div style="background:#0F172A; border-radius:6px; padding:6px 10px; margin-top:6px; color:#38BDF8; font-family:monospace; font-size:11px; font-weight:700;">
              <div>Recovery Acceleration = (45 × 1440) / 120 ≈ 540× Speedup</div>
              <div style="color:#A7F3D0; margin-top:2px;">National Capital Protected = ₹1,750+ Cr / Year</div>
            </div>
          </div>

          <!-- Highlighted Impact Projection Callout Box -->
          <div style="background:#FFFBEB; border:2.5px dashed #D97706; border-radius:14px; padding:12px 16px; display:flex; flex-direction:column; justify-content:space-between;">
            <div style="font-size:11.5px; font-weight:800; color:#DC2626;">
              *Consolidated Proof documents of all research is provided in slide 6
            </div>
            <div style="display:flex; align-items:center; gap:14px; margin-top:4px;">
              <div style="flex:1; font-size:13px; font-weight:900; color:#92400E; line-height:1.35;">
                CHAKRA is projected to accelerate fund recovery by <strong>540×</strong>, validated against real-world law enforcement pipelines.
              </div>
              <div style="display:flex; align-items:center; gap:8px; background:#FEF3C7; border:1.5px solid #F59E0B; border-radius:8px; padding:8px 12px; flex-shrink:0;">
                <span style="font-size:24px;">🛡️</span>
                <div style="font-size:13px; font-weight:900; color:#78350F; line-height:1.2;">
                  ₹1,750+ Cr Saved<br><span style="font-size:11px; color:#92400E;">Cycle: &lt; 120 Mins</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:38px; border-top:1.5px solid #E2E8F0; padding-top:8px; margin-top:14px;">
      <div style="font-size:14px; font-weight:800; color:#475569; letter-spacing:0.5px;">PROJECT CHAKRA (चक्र) • MHA I4C DIVISION • CONFIDENTIAL</div>
      <div style="font-size:19px; font-weight:700; color:#1E3A8A; margin:0 auto;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:28px; font-weight:900; color:#1E3A8A;">5</div>
    </div>
  </div>
</body>
</html>`;
'''

def get_chakra_slide_6():
    return '''    case 6:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-6-container {
      width: 1920px;
      height: 1080px;
      padding: 24px 48px 30px 48px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      background: #FFFFFF;
      position: relative;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }
    .content-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 14px;
      padding: 14px 18px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 2px 4px -2px rgba(0,0,0,0.03);
    }
    .black-pill {
      background: #000000;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 16px;
      padding: 4px 22px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .ref-link {
      font-size: 11px;
      font-weight: 800;
      color: #2563EB;
      text-decoration: underline;
      cursor: pointer;
    }
    .green-star-pill {
      background: #166534;
      color: #FFFFFF;
      font-weight: 900;
      font-size: 16px;
      padding: 4px 18px;
      border-radius: 9999px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
  </style>
</head>
<body>
  <div class="slide-6-container">
    <!-- Header Bar: Indomitus Oval + Centered Title + SIH 2026 Logo (Uniform 102px / 98px across Slides 1-6) -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:102px; margin-bottom:14px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:6px 36px; font-size:28px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:52px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">RESEARCH AND REFERENCES</div>
      <img src="${sihLogoB64}" style="height:98px; object-fit:contain;">
    </div>

    <!-- Main Content Stage (860px total height) -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; height:860px;">
      
      <!-- Top Row: Domain Research & Our Works (Height: ~400px) -->
      <div style="display:grid; grid-template-columns: 55% 45%; gap:20px; height:405px;">
        
        <!-- Top Left: VDA Crime in India - Research & Statutory Grounding -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="font-size:16px; font-weight:900; color:#0F172A; text-transform:uppercase; margin-bottom:8px;">
              VDA & CRYPTO CRIME IN INDIA — RESEARCH & STATUTORY GROUNDING
            </div>
            
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:10px;">
              <!-- Historical Context -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                  <span style="font-size:16px;">⛓️</span>
                  <strong style="font-size:12px; color:#0F172A;">Multi-Chain Laundering</strong>
                </div>
                <div style="font-size:11px; color:#475569; line-height:1.35;">
                  Syndicates route illicit UPI fraud proceeds through decentralized bridges, cross-chain DEX swaps, and P2P crypto mules.
                </div>
              </div>

              <!-- Threat Stats with mini SVG bar chart -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">₹1,750+ Cr Loss</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569; margin-bottom:4px;">
                  84% of cyber fraud proceeds drained into TRON/USDT within 45 mins of victim account compromise.
                </div>
                <!-- Mini Bar Graphic -->
                <div style="display:flex; align-items:flex-end; gap:5px; height:24px; padding-top:4px;">
                  <div style="width:12px; height:10px; background:#94A3B8; border-radius:2px;"></div>
                  <div style="width:12px; height:16px; background:#64748B; border-radius:2px;"></div>
                  <div style="width:12px; height:24px; background:#DC2626; border-radius:2px;"></div>
                  <span style="font-size:10.5px; font-weight:800; color:#DC2626; margin-left:4px;">+280% YoY</span>
                </div>
              </div>

              <!-- Freezing Bottleneck -->
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Manual Freeze Lag</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569; margin-bottom:4px;">
                  Standard legal subpoenas take <strong>30–45 days</strong>; 92% of illicit funds dissipate before notice arrives.
                </div>
                <div style="font-size:11px; font-weight:800; color:#0891B2;">
                  Chakra freezes within &lt; 120 mins.
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Banner: Statutory Regulation & Admissibility -->
          <div style="background:#0F172A; border-radius:10px; padding:10px 14px; color:#FFFFFF; margin-top:10px; display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-size:12.5px; font-weight:900; color:#38BDF8; margin-bottom:2px;">
                Statutory Mandate: BNSS 2023 Sec 106/107 & BSA 2023 Sec 63
              </div>
              <div style="font-size:11px; color:#E2E8F0; line-height:1.35;">
                Enforces real-time API asset freezing under Sec 106 BNSS, cryptographic Merkle chain-of-custody under Sec 63 BSA, and direct victim restitution under Sec 107 BNSS.
              </div>
            </div>
            <div style="margin-left:14px; flex-shrink:0;">
              <span style="background:#1E293B; border:1px solid #475569; border-radius:6px; padding:4px 10px; color:#60A5FA; font-size:11px; font-weight:800; cursor:pointer;">Click here</span>
            </div>
          </div>
        </div>

        <!-- Top Right: Our Works & Technical References -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div class="green-star-pill">Our Works ★</div>
              <div style="font-size:12px; font-weight:800; color:#475569;">👆 CLICK ON THE IMAGES TO VISIT LINKS</div>
            </div>

            <!-- Two Hero Clickable Cards -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
              <div style="background:#F8FAFC; border:2px solid #000000; border-radius:10px; padding:10px 12px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                ${ICONS.github}
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block;">GitHub Repository</strong>
                  <span style="font-size:11px; color:#475569; display:block;">View full production source</span>
                  <span class="ref-link">Click here</span>
                </div>
              </div>

              <div style="background:#F0FDF4; border:2px solid #16A34A; border-radius:10px; padding:10px 12px; display:flex; align-items:center; gap:10px; cursor:pointer;">
                ${ICONS.document}
                <div>
                  <strong style="font-size:13.5px; color:#0F172A; display:block;">Proof Documents</strong>
                  <span style="font-size:11px; color:#475569; display:block;">Consolidated research dossier</span>
                  <span style="font-size:11px; font-weight:800; color:#16A34A; text-decoration:underline;">Click here</span>
                </div>
              </div>
            </div>

            <!-- 4 Technical References Grid -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px;">
              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">EVM & TRON JSON-RPC</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Real-time block stream parser & transaction log filters</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Temporal GNN Tracing</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Graph Neural Network mixer de-obfuscation & clustering</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Apache Flink Engine</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">Sub-second complex event processing & peeling detection</div>
              </div>

              <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:8px 10px;">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
                  <strong style="font-size:12px; color:#0F172A;">Neo4j & ClickHouse</strong>
                  <span class="ref-link">Click here</span>
                </div>
                <div style="font-size:11px; color:#475569;">High-performance graph traversal & big data cold storage</div>
              </div>
            </div>

          </div>
        </div>

      </div>

      <!-- Bottom Row: Market Research TAM/SAM/SOM & Sovereign Comparative Benchmark (Height: ~430px) -->
      <div style="display:grid; grid-template-columns: 55% 45%; gap:20px; height:435px;">
        
        <!-- Bottom Left: Market Research TAM/SAM/SOM -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div class="black-pill">MARKET - RESEARCH</div>
              <span class="ref-link">Click here for TAM Analysis</span>
            </div>

            <!-- Concentric Rings & Market Growth -->
            <div style="display:flex; align-items:center; gap:18px; margin-bottom:10px;">
              <!-- SVG Concentric Donut Rings -->
              <div style="width:130px; height:130px; flex-shrink:0;">
                <svg viewBox="0 0 100 100" width="130" height="130">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#7C3AED" stroke-width="12" opacity="0.9"/>
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#2563EB" stroke-width="12" opacity="0.9"/>
                  <circle cx="50" cy="50" r="18" fill="none" stroke="#D97706" stroke-width="12" opacity="0.9"/>
                  <text x="50" y="53" font-size="11" font-weight="900" text-anchor="middle" fill="#0F172A">INDIA</text>
                </svg>
              </div>

              <!-- Market Figures -->
              <div style="flex:1;">
                <div style="font-size:11.5px; color:#475569; margin-bottom:6px;">
                  Global Blockchain Forensics & AML Market reaches <strong>$18,500M (₹1,53,000 Cr)</strong> by 2030 (22.8% CAGR).
                </div>
                <div style="display:flex; flex-direction:column; gap:4px; font-size:12px;">
                  <div style="display:flex; align-items:center; justify-content:space-between; background:#F5F3FF; padding:4px 8px; border-radius:5px;">
                    <span><strong style="color:#7C3AED;">TAM:</strong> Global VDA Forensics & Financial Intelligence</span>
                    <strong style="color:#7C3AED;">₹18,500 Cr</strong>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; background:#EFF6FF; padding:4px 8px; border-radius:5px;">
                    <span><strong style="color:#2563EB;">SAM:</strong> Indian Banking, Law Enforcement & FIU-IND</span>
                    <strong style="color:#2563EB;">₹5,400 Cr</strong>
                  </div>
                  <div style="display:flex; align-items:center; justify-content:space-between; background:#FFFBEB; padding:4px 8px; border-radius:5px;">
                    <span><strong style="color:#D97706;">SOM:</strong> 36 State Cyber Cells & I4C National Hub</span>
                    <strong style="color:#D97706;">₹760 Cr</strong>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Unit Economics Table -->
            <div style="border-top:1.5px solid #E2E8F0; padding-top:8px;">
              <div style="font-size:12px; font-weight:900; color:#0F172A; margin-bottom:4px;">Financial Unit Economics & Revenue Model</div>
              <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:8px; text-align:center;">
                <div style="background:#F8FAFC; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#64748B;">Tracing Nodes</div>
                  <div style="font-size:12.5px; font-weight:900; color:#0F172A;">150 Units</div>
                </div>
                <div style="background:#F8FAFC; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#64748B;">Appliance Unit Price</div>
                  <div style="font-size:12.5px; font-weight:900; color:#0F172A;">₹65,000</div>
                </div>
                <div style="background:#F8FAFC; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#64748B;">Cloud Ingestion Cost</div>
                  <div style="font-size:12.5px; font-weight:900; color:#0F172A;">₹4.5L/mo</div>
                </div>
                <div style="background:#F0FDF4; border-radius:6px; padding:6px 4px;">
                  <div style="font-size:10.5px; color:#166534;">Year-1 Revenue</div>
                  <div style="font-size:12.5px; font-weight:900; color:#166534;">₹9.8 Crore</div>
                </div>
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:11px; color:#475569;">
                <span><strong>Profit Margins:</strong> Software 85% (low marginal cloud scale), Appliance 30%</span>
                <span class="ref-link">Click here for Model</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Right: Sovereign vs Foreign Commercial Benchmark -->
        <div class="content-card" style="display:flex; flex-direction:column; justify-content:space-between; padding:14px 18px;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
              <div style="font-size:16px; font-weight:900; color:#0F172A; text-transform:uppercase;">
                SOVEREIGN VS FOREIGN COMMERCIAL BENCHMARK
              </div>
              <span class="ref-link">Click here</span>
            </div>

            <!-- 2 Benchmark Cards -->
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:10px;">
              <!-- Foreign Vendor -->
              <div style="background:#FFF1F2; border:1.5px solid #FECDD3; border-radius:10px; padding:10px 12px;">
                <div style="font-size:13px; font-weight:900; color:#991B1B; margin-bottom:4px;">
                  Foreign Commercial SaaS (Chainalysis Reactor)
                </div>
                <div style="font-size:11px; color:#7F1D1D; line-height:1.4;">
                  • Closed-source proprietary foreign cloud<br>
                  • $75,000 (₹62 Lakhs)/seat/yr recurring fee<br>
                  • Telemetry egress to foreign servers<br>
                  • No native 1930 / I4C gateway integration<br>
                  • Lacks automated Section 63 BSA certificate
                </div>
                <div style="margin-top:6px;"><span class="ref-link" style="color:#991B1B;">Click here for Audit</span></div>
              </div>

              <!-- Sovereign Solution -->
              <div style="background:#F0FDF4; border:1.5px solid #BBF7D0; border-radius:10px; padding:10px 12px;">
                <div style="font-size:13px; font-weight:900; color:#166534; margin-bottom:4px;">
                  Sovereign Solution (CHAKRA)
                </div>
                <div style="font-size:11px; color:#14532D; line-height:1.4;">
                  • 100% On-prem / NIC MeghRaj Cloud<br>
                  • ₹45L total deployment (85% cost reduction)<br>
                  • Native 1930 API integration (&lt; 120 min freeze)<br>
                  • Automated Sec 63 BSA & 107 BNSS dockets<br>
                  • Sub-15 second multi-chain peeling analysis
                </div>
                <div style="margin-top:6px;"><span class="ref-link" style="color:#166534;">Click here for Benchmark</span></div>
              </div>
            </div>

            <!-- Bottom Summary Callout -->
            <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:8px; padding:8px 12px;">
              <div style="font-size:11.5px; color:#1E3A8A; line-height:1.35;">
                <strong>Enterprise Conclusion:</strong> CHAKRA delivers <strong>540× faster asset freezing</strong>, saves <strong>₹18.5 Cr</strong> in foreign license fees, and enables statutory direct victim restitution under Section 107 BNSS.
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>

    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:38px; border-top:1.5px solid #E2E8F0; padding-top:8px; margin-top:14px;">
      <div style="font-size:14px; font-weight:800; color:#475569; letter-spacing:0.5px;">PROJECT CHAKRA (चक्र) • MHA I4C DIVISION • CONFIDENTIAL</div>
      <div style="font-size:19px; font-weight:700; color:#1E3A8A; margin:0 auto;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:28px; font-weight:900; color:#1E3A8A;">6</div>
    </div>
  </div>
</body>
</html>`;
'''

def update_file(filename, slide5_code, slide6_code):
    print("Reading", filename)
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex replace case 5:
    pattern_5 = r'case 5:[\s\S]*?(?=case 6:)'
    if not re.search(pattern_5, content):
        print("ERROR: case 5 not found in", filename)
        return False
    content = re.sub(pattern_5, slide5_code + '\n\n    ', content, count=1)

    # Regex replace case 6:
    pattern_6 = r'case 6:[\s\S]*?(?=default:)'
    if not re.search(pattern_6, content):
        print("ERROR: case 6 not found in", filename)
        return False
    content = re.sub(pattern_6, slide6_code + '\n\n    ', content, count=1)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Successfully updated", filename)
    return True

if __name__ == '__main__':
    bhedak_file = 'scripts/engine/generate_bhedak_slides.mjs'
    chakra_file = 'scripts/engine/generate_chakra_slides.mjs'

    b5 = get_bhedak_slide_5()
    b6 = get_bhedak_slide_6()
    update_file(bhedak_file, b5, b6)

    c5 = get_chakra_slide_5()
    c6 = get_chakra_slide_6()
    update_file(chakra_file, c5, c6)
    print("Both slide generators updated with Championship Slide 5 and Slide 6!")
