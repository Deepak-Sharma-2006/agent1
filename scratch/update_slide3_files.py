"""
Generate Option A Slide 3 for both BHEDAK and CHAKRA
- Perfect connector column spacing & 2-line tags (zero overlap)
- Embedded clean SVG icons in card titles for rich infographic appearance
- All typography strictly >= 11px
- 100% domain fidelity for both decks
"""
import re

bhedak_slide_3_html = r"""    case 3:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-3-container {
      width: 1920px;
      height: 1080px;
      padding: 16px 36px 18px 36px;
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
      border-radius: 10px;
      padding: 10px 14px;
      box-sizing: border-box;
      box-shadow: 0 4px 14px rgba(15,23,42,0.06);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 258px;
    }
    .step-pill {
      font-size: 11.5px;
      font-weight: 900;
      color: #FFFFFF;
      padding: 3px 9px;
      border-radius: 4px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
    }
    .role-badge {
      font-size: 11.5px;
      font-weight: 800;
      padding: 3px 9px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }
    .tab-pill {
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tab-row {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      font-size: 13px;
      line-height: 1.38;
      color: #1E293B;
    }
    .hand-off-bar {
      border-radius: 6px;
      padding: 4.5px 10px;
      font-size: 12px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }
    .connector-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 54px;
      flex-shrink: 0;
      gap: 2px;
    }
    .connector-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 900;
      box-shadow: 0 3px 8px rgba(15,23,42,0.1);
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
      font-size: 12px;
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
    <!-- Header Bar: Matching Slide 2 Exactly -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:78px; margin-bottom:10px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:5px 32px; font-size:26px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:46px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:78px; object-fit:contain;">
    </div>

    <!-- SECTION 01: END-TO-END VISUAL GRAPH WORKFLOW (MAJORITY OF SLIDE: ~635px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:6px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:15px; font-weight:900; padding:4px 20px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            01 • END-TO-END TACTICAL ATTRIBUTION GRAPH WORKFLOW (INTEGRATED NTRO RBAC)
          </div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:3px 16px; font-size:13.5px; font-weight:700; color:#1D4ED8;">
            Single-Graph Process: Illicit Ingestion ➔ Core Analysis Engines ➔ 3 NTRO Cadres ➔ Sealed Court Docket
          </div>
        </div>
        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:9999px; padding:3px 14px; font-size:11.5px; font-weight:800; color:#065F46;">
          SOVEREIGN AIR-GAPPED SCIF • ZERO FOREIGN DEPENDENCIES
        </div>
      </div>

      <!-- Main Visual Graph Canvas -->
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 14px; display:flex; flex-direction:column; gap:7px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- ROW 1: INGESTION & CORE ENGINE PHASE (3 Nodes with 54px Connector Clearance) -->
        <div style="display:grid; grid-template-columns: 1fr 54px 1.05fr 54px 1.15fr; align-items:center;">
          
          <!-- Node 1: Starting Point (Darknet Ingestion) -->
          <div class="flow-node" style="border:2px solid #64748B; border-top:5px solid #475569;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#475569;">NODE 01 • STARTING POINT</span>
                <span class="role-badge" style="background:#F1F5F9; color:#334155;">ILLICIT FOOTPRINT</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.network}</span>
                <strong style="font-size:18px; color:#0F172A; font-weight:900; line-height:1.2;">1. Darknet & Surface Ingestion</strong>
              </div>
              <div style="font-size:12px; font-weight:700; color:#475569; margin-bottom:6px;">Tor Marketplaces • Paste Dumps • MTProto Feeds</div>
              
              <div style="font-size:13px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:4px;">
                <div>• <strong>15+ Active Markets:</strong> Continuous scraping of illicit drug, exploit, and counterfeit bazaars.</div>
                <div>• <strong>Ephemeral Paste Dumps:</strong> Regex pattern matching across Pastebin & Rentry leak drops.</div>
                <div>• <strong>Telegram MTProto:</strong> Real-time async listener capturing syndicate chat logs & attachments.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#F1F5F9; border:1px solid #CBD5E1; color:#334155;">
              <span>Ingress Deliverable:</span>
              <span>Raw .onion HTML Dumps & Chat Streams ➔</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2.5px solid #0284C7; color:#0284C7;">➔</div>
            <span class="connector-tag">Raw<br>Ingress</span>
          </div>

          <!-- Node 2: RBAC Role 1 - TECHINT Operator -->
          <div class="flow-node" style="border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#0284C7;">NODE 02 • NTRO CADRE</span>
                <span class="role-badge" style="background:#E0F2FE; color:#0369A1;">SCIENTIST 'D' • CITC</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.user}</span>
                <strong style="font-size:18px; color:#0F172A; font-weight:900; line-height:1.2;">TECHINT Ingestion Custodian</strong>
              </div>
              <div style="font-size:12px; font-weight:700; color:#0284C7; margin-bottom:6px;">Lawful Ingestion Custodian (Sec. 63(4)(a) BSA 2023)</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 1: CRAWLER</span>
                  <div>Automated scraping queues & 256-node SOCKS5 circuit rotation.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 2: INFRA AUDIT</span>
                  <div>Unmasks Clearnet Origin IP via Apache mod_status & TLS leaks.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 3: CUSTODIAN</span>
                  <div>Signs Sec. 63(4)(a) BSA lawful ingestion declaration.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#E0F2FE; border:1px solid #BAE6FD; color:#0369A1;">
              <span>Unmasked Footprint:</span>
              <span>Origin IP: 103.152.18.42 + Part A Cert ➔</span>
            </div>
          </div>

          <!-- Connector 2 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2.5px solid #2563EB; color:#2563EB;">➔</div>
            <span class="connector-tag">Origin<br>IP</span>
          </div>

          <!-- Node 3: Core Analytical & Stylometry Engines -->
          <div class="flow-node" style="border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#2563EB;">NODE 03 • AI CORE</span>
                <span class="role-badge" style="background:#EFF6FF; color:#1D4ED8;">NEO4J + ROBERTA</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.database}</span>
                <strong style="font-size:18px; color:#0F172A; font-weight:900; line-height:1.2;">Multi-Market Graph & AI Stylometry</strong>
              </div>
              <div style="font-size:12px; font-weight:700; color:#1D4ED8; margin-bottom:6px;">10,000+ Nodes Resolved • 400+ Writeprints • 24h Sleep Clock</div>
              
              <div style="font-size:13px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:4px;">
                <div>• <strong>Neo4j Alias Binding:</strong> Resolves threat actors across 15+ markets via PGP keys & BTC co-spends.</div>
                <div>• <strong>Siamese RoBERTa & IndicBERT:</strong> Neural author verification decoding Indian darknet slang.</div>
                <div>• <strong>Diurnal Inactivity Trough:</strong> Maps post timestamps to UTC+5:30 (±30m sleep window).</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EFF6FF; border:1px solid #BFDBFE; color:#1D4ED8;">
              <span>Attribution Output:</span>
              <span>Unified Entity Graph + 0.65 Max AI Cap Bound ➔</span>
            </div>
          </div>

        </div>

        <!-- Directional Process Bridge -->
        <div class="flow-bridge-bar">
          <span>▼ ENRICHED INTELLIGENCE DISPATCHED TO FORENSIC LABORATORY, EXECUTIVE SANCTION & JUDICIAL PROSECUTION ▼</span>
        </div>

        <!-- ROW 2: FORENSIC CERTIFICATION, SANCTION & COURT PHASE (3 Nodes with 54px Connector Clearance) -->
        <div style="display:grid; grid-template-columns: 1.05fr 54px 1.05fr 54px 1.15fr; align-items:center;">
          
          <!-- Node 4: RBAC Role 2 - Cyber Forensic Examiner -->
          <div class="flow-node" style="border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#4F46E5;">NODE 04 • NTRO CADRE</span>
                <span class="role-badge" style="background:#EEF2FF; color:#4338CA;">SCIENTIST 'E' • NICRD / NCIIPC</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.cpu}</span>
                <strong style="font-size:18px; color:#0F172A; font-weight:900; line-height:1.2;">Cyber Forensic Examiner</strong>
              </div>
              <div style="font-size:12px; font-weight:700; color:#4338CA; margin-bottom:6px;">Technical Forensic Expert (Sec. 63(4)(b)-(c) BSA 2023)</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 1: GRAPH CANVAS</span>
                  <div>WebGL pivoting on 10,000+ nodes to confirm syndicate alias links.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 2: STYLOMETRY</span>
                  <div>Verifies writeprint vector match & linguistic heatmaps.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 3: PART B HSM</span>
                  <div>Executes FIPS 140-3 HSM Ed25519 digital signature on report.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EEF2FF; border:1px solid #C7D2FE; color:#4338CA;">
              <span>Forensic Hand-off:</span>
              <span>Forensic Dossier + Part B HSM Seal ➔</span>
            </div>
          </div>

          <!-- Connector 3 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2.5px solid #4F46E5; color:#4F46E5;">➔</div>
            <span class="connector-tag">Part B<br>Seal</span>
          </div>

          <!-- Node 5: RBAC Role 3 - Centre Director -->
          <div class="flow-node" style="border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#DC2626;">NODE 05 • NTRO CADRE</span>
                <span class="role-badge" style="background:#FEF2F2; color:#991B1B;">SCIENTIST 'G' • DIRECTOR</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.shield}</span>
                <strong style="font-size:18px; color:#0F172A; font-weight:900; line-height:1.2;">Centre Director & Dissemination</strong>
              </div>
              <div style="font-size:12px; font-weight:700; color:#B91C1C; margin-bottom:6px;">Statutory Dissemination Authority (Sec. 70A IT Act 2000)</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 1: REVIEW</span>
                  <div>Executive oversight, confidence audit (>0.85) & legal risk sign-off.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 2: STIX 2.1 GATE</span>
                  <div>Automated threat feed push to CERT-In & I4C Samanvaya.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 3: COURT RELEASE</span>
                  <div>Transmits sealed evidence package to CBI, NIA, & State Police.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#FEF2F2; border:1px solid #FECACA; color:#B91C1C;">
              <span>Dissemination Hand-off:</span>
              <span>Case File for Cyber Court Filing ➔</span>
            </div>
          </div>

          <!-- Connector 4 -->
          <div class="connector-box">
            <div class="connector-circle" style="border:2.5px solid #DC2626; color:#DC2626;">➔</div>
            <span class="connector-tag">Court<br>Filing</span>
          </div>

          <!-- Node 6: Terminal Statutory Deliverable & Trial -->
          <div class="flow-node" style="border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#059669;">NODE 06 • STATUTORY TRIAL</span>
                <span class="role-badge" style="background:#ECFDF5; color:#065F46;">SPECIAL CYBER COURT</span>
              </div>
              <div style="display:flex; align-items:center; gap:8px; margin-bottom:2px;">
                <span style="display:flex; align-items:center;">${ICONS.gavel}</span>
                <strong style="font-size:18px; color:#0F172A; font-weight:900; line-height:1.2;">Court Evidence Package</strong>
              </div>
              <div style="font-size:12px; font-weight:700; color:#059669; margin-bottom:6px;">BSA 2023 Sec 63 Dual-Signed Electronic Certificate</div>
              
              <div style="font-size:13px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:4px;">
                <div>• <strong>Dual-Signed Certificate:</strong> Part A (Ingestion Custodian) + Part B (Forensic Examiner).</div>
                <div>• <strong>FIPS 140-3 HSM Root of Trust:</strong> SHA-256 Merkle chain guarantees tamper-proof provenance.</div>
                <div>• <strong>Zero Hostile Witness Rejection:</strong> Complies with Sections 193 & 207 BNSS for trial.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#ECFDF5; border:1px solid #A7F3D0; color:#065F46;">
              <span>Judicial Outcome:</span>
              <span>100% Admissible Evidence • Instant Judicial Conviction</span>
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

      <!-- 5 Architectural Domain Cards Grid -->
      <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:10px;">
        
        <!-- Domain 1: Ingestion Fleet -->
        <div class="tech-col-card" style="border-left:4px solid #0284C7;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Distributed Crawler Fleet</strong>
              <span style="font-size:11px; font-weight:800; background:#E0F2FE; color:#0369A1; padding:2px 5px; border-radius:3px;">NIC MEGHRAJ</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              256-node automated circuit rotation pool continuously scraping darknet markets, paste sites & Telegram channels.
            </div>
            <div style="font-size:11px; font-weight:800; color:#0369A1; background:#F0F9FF; padding:2px 5px; border-radius:3px; margin-bottom:4px;">
              Specs: 10,000+ Pages/Min • 180s Zero-Ban Circuit Rotation
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:2px;">Technologies:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Tor SOCKS5h</span>
              <span class="tech-chip">Python Stem</span>
              <span class="tech-chip">Playwright</span>
              <span class="tech-chip">Kafka 3.6</span>
              <span class="tech-chip">Telethon</span>
            </div>
          </div>
        </div>

        <!-- Domain 2: Backend Services -->
        <div class="tech-col-card" style="border-left:4px solid #2563EB;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Microservices & Enclave</strong>
              <span style="font-size:11px; font-weight:800; background:#EFF6FF; color:#1D4ED8; padding:2px 5px; border-radius:3px;">SCIF DOCKER</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Isolated sovereign microservices managing high-speed RPC communications, raw ingress parsing, and pipeline orchestration.
            </div>
            <div style="font-size:11px; font-weight:800; color:#1D4ED8; background:#EFF6FF; padding:2px 5px; border-radius:3px; margin-bottom:4px;">
              Specs: Sub-50ms gRPC Latency • Docker SCIF Enclave
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:2px;">Technologies:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Go 1.22</span>
              <span class="tech-chip">Python FastAPI</span>
              <span class="tech-chip">Docker Engine</span>
              <span class="tech-chip">Redis Streams</span>
              <span class="tech-chip">TimescaleDB</span>
            </div>
          </div>
        </div>

        <!-- Domain 3: Databases & Graph -->
        <div class="tech-col-card" style="border-left:4px solid #4F46E5;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Multi-Model Graph DB</strong>
              <span style="font-size:11px; font-weight:800; background:#EEF2FF; color:#4338CA; padding:2px 5px; border-radius:3px;">CROSS-MARKET</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Distributed identity property graph resolving multi-market threat actor personas via PGP fingerprints and BTC wallet co-spends.
            </div>
            <div style="font-size:11px; font-weight:800; color:#4338CA; background:#EEF2FF; padding:2px 5px; border-radius:3px; margin-bottom:4px;">
              Specs: 10,000+ Threat Entities • Sub-200ms BFS Traversal
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:2px;">Technologies:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Neo4j 5.x</span>
              <span class="tech-chip">Elasticsearch 8</span>
              <span class="tech-chip">PostgreSQL 16</span>
              <span class="tech-chip">pgvector</span>
            </div>
          </div>
        </div>

        <!-- Domain 4: AI & Stylometry -->
        <div class="tech-col-card" style="border-left:4px solid #7C3AED;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">AI Stylometry & NLP</strong>
              <span style="font-size:11px; font-weight:800; background:#F5F3FF; color:#6D28D9; padding:2px 5px; border-radius:3px;">DIURNAL NLP</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Author verification fine-tuned on darknet vernacular, Indian slang, and UTC+5:30 diurnal sleep trough activity mapping.
            </div>
            <div style="font-size:11px; font-weight:800; color:#6D28D9; background:#FAF5FF; padding:2px 5px; border-radius:3px; margin-bottom:4px;">
              Specs: 400+ Writeprints • Siamese Triplet Loss (d &lt; 0.35)
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:2px;">Technologies:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">RoBERTa</span>
              <span class="tech-chip">IndicBERT</span>
              <span class="tech-chip">PyTorch</span>
              <span class="tech-chip">BERTopic</span>
              <span class="tech-chip">Scikit-Learn</span>
            </div>
          </div>
        </div>

        <!-- Domain 5: Security & Gateways -->
        <div class="tech-col-card" style="border-left:4px solid #059669;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Forensics & Gateways</strong>
              <span style="font-size:11px; font-weight:800; background:#ECFDF5; color:#065F46; padding:2px 5px; border-radius:3px;">BSA 2023 SEC 63</span>
            </div>
            <div style="font-size:11.5px; color:#334155; line-height:1.32; margin-bottom:4px;">
              Cryptographic chain-of-custody packaging, FIPS 140-3 HSM root sealing, and automated STIX 2.1 dissemination feeds.
            </div>
            <div style="font-size:11px; font-weight:800; color:#065F46; background:#ECFDF5; padding:2px 5px; border-radius:3px; margin-bottom:4px;">
              Specs: FIPS 140-3 Level 3 HSM • RFC 3161 Timestamping
            </div>
          </div>
          <div>
            <div style="font-size:11px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:2px;">Technologies:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">FIPS 140-3 HSM</span>
              <span class="tech-chip">Ed25519</span>
              <span class="tech-chip">I4C Samanvaya</span>
              <span class="tech-chip">CERT-In STIX 2.1</span>
              <span class="tech-chip">ReportLab</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:24px; margin-top:6px; border-top:1px solid #E2E8F0; padding-top:4px;">
      <div style="font-size:11px; font-weight:800; color:#64748B; letter-spacing:0.5px;">PROJECT BHEDAK (भेदक) • NTRO CITC DIVISION • CONFIDENTIAL</div>
      <div style="font-size:12px; font-weight:900; color:#1E3A8A;">@SIH Idea Submission • Slide 3</div>
    </div>

  </div>
</body>
</html>`;
"""

chakra_slide_3_html = r"""    case 3:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-3-container {
      width: 1920px;
      height: 1080px;
      padding: 16px 36px 18px 36px;
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
    <!-- Header Bar: Matching Slide 2 Exactly -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:78px; margin-bottom:10px;">
      <div class="team-pill" style="border:3px solid #000000; border-radius:9999px; padding:5px 32px; font-size:26px; font-weight:900; color:#000000; background:#FFFFFF; letter-spacing:0.5px;">Indomitus</div>
      <div style="font-size:46px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:78px; object-fit:contain;">
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

    <!-- Footer Bar -->
    <div style="display:flex; align-items:center; justify-content:space-between; height:24px; margin-top:6px; border-top:1px solid #E2E8F0; padding-top:4px;">
      <div style="font-size:11px; font-weight:800; color:#64748B; letter-spacing:0.5px;">PROJECT CHAKRA (चक्र) • MHA / I4C ECOSYSTEM • CONFIDENTIAL</div>
      <div style="font-size:12px; font-weight:900; color:#1E3A8A;">@SIH Idea Submission • Slide 3</div>
    </div>

  </div>
</body>
</html>`;
"""

def update_file(filepath, case_code):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    pattern = r"(    case 3:\n)(.*?)(    case 4:)"
    match = re.search(pattern, content, re.DOTALL)
    if not match:
        print(f"Error: Could not find case 3 in {filepath}")
        return False

    new_content = content[:match.start()] + case_code + "\n" + content[match.start(3):]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Successfully updated case 3 in {filepath}")
    return True

update_file(r'c:\Users\Deepak Sharma\OneDrive\Desktop\SIH\scripts\engine\generate_bhedak_slides.mjs', bhedak_slide_3_html)
update_file(r'c:\Users\Deepak Sharma\OneDrive\Desktop\SIH\scripts\engine\generate_chakra_slides.mjs', chakra_slide_3_html)
print("Updated both files successfully.")
