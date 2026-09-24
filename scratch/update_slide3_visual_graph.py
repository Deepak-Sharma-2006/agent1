import re

def update_bhedak_slide_3():
    path = r"scripts/engine/generate_bhedak_slides.mjs"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_case_3 = """    case 3:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-3-container {
      width: 1920px;
      height: 1080px;
      padding: 18px 36px 36px 36px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      position: relative;
      overflow: hidden;
    }
    .flow-node {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 10px 14px;
      box-sizing: border-box;
      box-shadow: 0 3px 10px rgba(15,23,42,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .step-pill {
      font-size: 11px;
      font-weight: 900;
      color: #FFFFFF;
      padding: 2.5px 8px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .role-badge {
      font-size: 11.5px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .tab-pill {
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 6.5px;
      border-radius: 3px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tab-row {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      font-size: 12px;
      line-height: 1.34;
      color: #1E293B;
    }
    .hand-off-bar {
      border-radius: 5px;
      padding: 3.5px 8px;
      font-size: 11.5px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 4px;
    }
    .arch-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 8px 11px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .tech-chip {
      font-size: 10.5px;
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
      <div style="font-size:46px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:78px; object-fit:contain;">
    </div>

    <!-- SECTION 01: END-TO-END VISUAL GRAPH WORKFLOW (MAJORITY OF SLIDE: ~645px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:7px;">
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
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 14px; display:flex; flex-direction:column; gap:8px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- ROW 1: INGESTION & CORE ENGINE PHASE (3 Nodes with Explicit Connectors) -->
        <div style="display:grid; grid-template-columns: 1fr 34px 1.05fr 34px 1.15fr; align-items:center;">
          
          <!-- Node 1: Starting Point (Darknet Sources) -->
          <div class="flow-node" style="height:250px; border:2px solid #7D4698; border-top:5px solid #7D4698;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#7D4698;">NODE 01 • STARTING POINT</span>
                <span style="font-size:11.5px; font-weight:800; color:#7D4698;">ILLICIT FOOTPRINT</span>
              </div>
              <strong style="font-size:17px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">1. Darknet & Surface Ingestion</strong>
              <div style="font-size:12px; font-weight:700; color:#6B21A8; margin-bottom:8px;">Tor Marketplaces • Paste Dumps • MTProto</div>
              
              <div style="font-size:12.5px; color:#334155; line-height:1.4; display:flex; flex-direction:column; gap:4px;">
                <div>• <strong>15+ Active Markets:</strong> Continuous scraping of narcotics, exploit, and weapons bazaars.</div>
                <div>• <strong>Ephemeral Paste Dumps:</strong> Regex pattern matching across Pastebin & Rentry leaks.</div>
                <div>• <strong>Telegram MTProto:</strong> Real-time async listener capturing syndicate chat logs & attachments.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#F5F3FF; border:1px solid #DDD6FE; color:#6B21A8;">
              <span>Ingress Deliverable:</span>
              <span>Raw .onion HTML Dumps & Chat Streams</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
            <div style="font-size:26px; color:#7D4698; font-weight:900; line-height:1;">➔</div>
            <div style="font-size:9.5px; font-weight:800; color:#64748B; text-align:center; text-transform:uppercase;">Raw Feeds</div>
          </div>

          <!-- Node 2: RBAC Role 1 - Ingestion Operator (Infra Probing) -->
          <div class="flow-node" style="height:250px; border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#0284C7;">NODE 02 • NTRO CADRE</span>
                <span class="role-badge" style="background:#E0F2FE; color:#0369A1;">SCIENTIST 'D' • CITC</span>
              </div>
              <strong style="font-size:17px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">TECHINT Ingestion Operator</strong>
              <div style="font-size:11.5px; color:#64748B; margin-bottom:6px;">Lawful Ingestion Custodian (Sec. 63(4)(a) BSA 2023)</div>
              
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

            <div class="hand-off-bar" style="background:#F0F9FF; border:1px solid #BAE6FD; color:#0284C7;">
              <span>Unmasked Footprint:</span>
              <span>Origin IP: 103.152.18.42 + Signed Part A Cert</span>
            </div>
          </div>

          <!-- Connector 2 -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
            <div style="font-size:26px; color:#0284C7; font-weight:900; line-height:1;">➔</div>
            <div style="font-size:9.5px; font-weight:800; color:#64748B; text-align:center; text-transform:uppercase;">Unmasked IP</div>
          </div>

          <!-- Node 3: Core Multi-Market Graph & AI Stylometry Engine -->
          <div class="flow-node" style="height:250px; border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#2563EB;">NODE 03 • AI CORE</span>
                <span style="font-size:11.5px; font-weight:800; color:#2563EB;">NEO4J + ROBERTA</span>
              </div>
              <strong style="font-size:17px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Multi-Market Graph & AI Stylometry</strong>
              <div style="font-size:12px; font-weight:700; color:#1D4ED8; margin-bottom:8px;">10,000+ Nodes Resolved • 400+ Writeprints • 24h Sleep Clock</div>
              
              <div style="font-size:12.5px; color:#334155; line-height:1.4; display:flex; flex-direction:column; gap:4px;">
                <div>• <strong>Neo4j Alias Binding:</strong> Resolves threat actors across 15+ markets via PGP keys & BTC co-spends.</div>
                <div>• <strong>Siamese RoBERTa & IndicBERT:</strong> Neural author verification decoding Indian darknet slang.</div>
                <div>• <strong>Diurnal Inactivity Trough:</strong> Maps post timestamps to UTC+5:30 (±30m sleep window).</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EFF6FF; border:1px solid #BFDBFE; color:#1E40AF;">
              <span>Attribution Engine Output:</span>
              <span>Unified Entity Graph + 0.65 Max AI Cap Bound</span>
            </div>
          </div>

        </div>

        <!-- Directional Process Bridge -->
        <div style="background:linear-gradient(90deg, #1E293B 0%, #0F172A 50%, #1E293B 100%); color:#FFFFFF; border-radius:6px; padding:4px 14px; font-size:11.5px; font-weight:800; text-align:center; letter-spacing:0.8px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>▼ ENRICHED INTELLIGENCE DISPATCHED TO FORENSIC LABORATORY, EXECUTIVE SANCTION & JUDICIAL TRIAL ▼</span>
        </div>

        <!-- ROW 2: FORENSIC CERTIFICATION, SANCTION & COURT PHASE (3 Nodes with Explicit Connectors) -->
        <div style="display:grid; grid-template-columns: 1.05fr 34px 1.05fr 34px 1.15fr; align-items:center;">
          
          <!-- Node 4: RBAC Role 2 - Cyber Forensic Examiner -->
          <div class="flow-node" style="height:250px; border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#4F46E5;">NODE 04 • NTRO CADRE</span>
                <span class="role-badge" style="background:#EEF2FF; color:#4338CA;">SCIENTIST 'E' • NICRD / NCIIPC</span>
              </div>
              <strong style="font-size:17px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Cyber Forensic Examiner</strong>
              <div style="font-size:11.5px; color:#64748B; margin-bottom:6px;">Technical Forensic Expert (Sec. 63(4)(b)-(c) BSA 2023)</div>
              
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
              <span>Peer-Reviewed Forensic Dossier + Part B HSM Seal</span>
            </div>
          </div>

          <!-- Connector 3 -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
            <div style="font-size:26px; color:#4F46E5; font-weight:900; line-height:1;">➔</div>
            <div style="font-size:9.5px; font-weight:800; color:#64748B; text-align:center; text-transform:uppercase;">Dossier</div>
          </div>

          <!-- Node 5: RBAC Role 3 - Centre Director -->
          <div class="flow-node" style="height:250px; border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#DC2626;">NODE 05 • NTRO CADRE</span>
                <span class="role-badge" style="background:#FEF2F2; color:#991B1B;">SCIENTIST 'G' • DIRECTOR</span>
              </div>
              <strong style="font-size:17px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Centre Director</strong>
              <div style="font-size:11.5px; color:#64748B; margin-bottom:6px;">Statutory Dissemination Authority (Sec. 70A IT Act 2000)</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 1: REVIEW</span>
                  <div>Executive oversight, confidence audit & legal risk sign-off.</div>
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
              <span>Authorized Case File for Special Cyber Court Submission</span>
            </div>
          </div>

          <!-- Connector 4 -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
            <div style="font-size:26px; color:#DC2626; font-weight:900; line-height:1;">➔</div>
            <div style="font-size:9.5px; font-weight:800; color:#64748B; text-align:center; text-transform:uppercase;">Sec 193 BNSS</div>
          </div>

          <!-- Node 6: Terminal Statutory Deliverable & Trial -->
          <div class="flow-node" style="height:250px; border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="step-pill" style="background:#059669;">NODE 06 • STATUTORY TRIAL</span>
                <span style="font-size:11.5px; font-weight:800; color:#059669;">SPECIAL CYBER COURT</span>
              </div>
              <strong style="font-size:17px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Court Evidence Package</strong>
              <div style="font-size:12px; font-weight:700; color:#047857; margin-bottom:8px;">BSA 2023 Sec 63 Dual-Signed Electronic Certificate</div>
              
              <div style="font-size:12.5px; color:#334155; line-height:1.4; display:flex; flex-direction:column; gap:4px;">
                <div>• <strong>Dual-Signed Certificate:</strong> Part A (Ingestion Custodian) + Part B (Forensic Examiner).</div>
                <div>• <strong>FIPS 140-3 HSM Root of Trust:</strong> SHA-256 Merkle chain guarantees tamper-proof provenance.</div>
                <div>• <strong>Zero Hostile Witness Rejection:</strong> Complies with Sections 193 & 207 BNSS for trial.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#ECFDF5; border:1px solid #A7F3D0; color:#047857;">
              <span>Judicial Outcome:</span>
              <span>100% Admissible Evidence • Instant Judicial Conviction</span>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- SECTION 02: PRODUCTION SYSTEM ARCHITECTURE & TECH STACK (SEPARATE BOTTOM SECTION: ~175px) -->
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
        <div style="font-size:11px; font-weight:800; color:#0284C7;">
          FULLY EXPLAINED PRODUCTION SUBSYSTEMS • DETERMINISTIC TDD TESTED
        </div>
      </div>

      <!-- 4 Architectural Domain Cards Grid (Height: ~145px) -->
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
        
        <!-- Domain 1: Ingestion Fleet -->
        <div class="arch-card" style="height:145px; border-left:4px solid #0284C7;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Distributed Crawler Fleet</strong>
              <span style="font-size:10px; font-weight:800; background:#E0F2FE; color:#0369A1; padding:1.5px 5px; border-radius:3px;">NIC MEGHRAJ</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              256-node automated circuit rotation pool continuously scraping darknet markets, paste sites & Telegram channels.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#0369A1; background:#F0F9FF; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: 10,000+ Pages/Min • 180s Zero-Ban Circuit Rotation
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Tor SOCKS5h</span>
              <span class="tech-chip">Python Stem</span>
              <span class="tech-chip">Playwright</span>
              <span class="tech-chip">Kafka 3.6</span>
              <span class="tech-chip">Telethon</span>
            </div>
          </div>
        </div>

        <!-- Domain 2: Air-Gapped Backend Enclave -->
        <div class="arch-card" style="height:145px; border-left:4px solid #4F46E5;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Air-Gapped Backend Enclave</strong>
              <span style="font-size:10px; font-weight:800; background:#EEF2FF; color:#4338CA; padding:1.5px 5px; border-radius:3px;">MEGHRAJ SCIF</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              High-concurrency property graph storing 10,000+ threat entities with tamper-proof append-only relational audit ledger.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#4338CA; background:#EEF2FF; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: &lt; 50ms Graph Query (10k Nodes) • Air-Gapped mTLS 1.3
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Neo4j 5.20</span>
              <span class="tech-chip">Elasticsearch 8</span>
              <span class="tech-chip">TimescaleDB</span>
              <span class="tech-chip">PostgreSQL 16</span>
              <span class="tech-chip">Go (gRPC)</span>
            </div>
          </div>
        </div>

        <!-- Domain 3: AI Stylometry & NLP Lab -->
        <div class="arch-card" style="height:145px; border-left:4px solid #059669;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">AI Stylometry & NLP Lab</strong>
              <span style="font-size:10px; font-weight:800; background:#ECFDF5; color:#065F46; padding:1.5px 5px; border-radius:3px;">0.65 AI CAP</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              Neural author verification matching 400+ writeprints with 24-hr UTC diurnal sleep trough timezone inference.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#047857; background:#ECFDF5; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: ±30m Diurnal Trough Precision • 0.65 Dempster-Shafer Ceiling
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">PyTorch 2.2</span>
              <span class="tech-chip">IndicBERT</span>
              <span class="tech-chip">Hugging Face</span>
              <span class="tech-chip">BERTopic</span>
              <span class="tech-chip">FastAPI</span>
            </div>
          </div>
        </div>

        <!-- Domain 4: Sovereign Security & LEA Interfaces -->
        <div class="arch-card" style="height:145px; border-left:4px solid #DC2626;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Sovereign Security & LEA Portals</strong>
              <span style="font-size:10px; font-weight:800; background:#FEF2F2; color:#991B1B; padding:1.5px 5px; border-radius:3px;">SEC 63 BSA</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              High-performance WebGL graph visualizer, statutory portal, and FIPS 140-3 HSM cryptographic root of trust.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#B91C1C; background:#FEF2F2; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: BSA 2023 Sec 63 Legal Docket • FIPS 140-3 HSM Root
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">React 18</span>
              <span class="tech-chip">TypeScript</span>
              <span class="tech-chip">Cytoscape.js</span>
              <span class="tech-chip">FIPS HSM</span>
              <span class="tech-chip">ReportLab</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Solid Blue Footer Bar -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:38px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px;">
      <div style="width:30px;"></div>
      <div style="font-size:16px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">BHEDAK - @SIH Idea Submission</div>
      <div style="font-size:20px; font-weight:900; color:#FFFFFF;">3</div>
    </div>
  </div>
</body>
</html>`;"""

    pattern = r"    case 3:\s+return `<!DOCTYPE html>.*?</html>`;"
    new_content = re.sub(pattern, new_case_3, content, flags=re.DOTALL)
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated Bhedak Slide 3 with true visual graph workflow!")

def update_chakra_slide_3():
    path = r"scripts/engine/generate_chakra_slides.mjs"
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    new_case_3 = """    case 3:
      return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${COMMON_CSS}
    .slide-3-container {
      width: 1920px;
      height: 1080px;
      padding: 18px 36px 36px 36px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      position: relative;
      overflow: hidden;
    }
    .flow-node {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 9px 12px;
      box-sizing: border-box;
      box-shadow: 0 3px 10px rgba(15,23,42,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .step-pill {
      font-size: 10.5px;
      font-weight: 900;
      color: #FFFFFF;
      padding: 2.5px 7px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .role-badge {
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 3px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    .tab-pill {
      font-size: 10px;
      font-weight: 800;
      padding: 1.5px 5.5px;
      border-radius: 3px;
      white-space: nowrap;
      flex-shrink: 0;
    }
    .tab-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      font-size: 11.5px;
      line-height: 1.30;
      color: #1E293B;
    }
    .hand-off-bar {
      border-radius: 5px;
      padding: 3px 7px;
      font-size: 11px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 3px;
    }
    .arch-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 8px 11px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .tech-chip {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 5.5px;
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
      <div style="font-size:46px; font-weight:900; letter-spacing:1px; color:#000000; text-transform:uppercase; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">TECHNICAL APPROACH</div>
      <img src="${sihLogoB64}" style="height:78px; object-fit:contain;">
    </div>

    <!-- SECTION 01: END-TO-END VISUAL GRAPH WORKFLOW (MAJORITY OF SLIDE: ~645px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:7px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:15px; font-weight:900; padding:4px 20px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            01 • END-TO-END VDA ATTRIBUTION & FREEZE GRAPH WORKFLOW (INTEGRATED MHA/I4C RBAC)
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
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 14px; display:flex; flex-direction:column; gap:8px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- ROW 1: INTAKE, IO SEEDING & CORE ENGINE PHASE (3 Nodes with Explicit Connectors) -->
        <div style="display:grid; grid-template-columns: 1fr 32px 1.05fr 32px 1.15fr; align-items:center;">
          
          <!-- Node 1: Citizen 1930 Intake -->
          <div class="flow-node" style="height:250px; border:2px solid #7D4698; border-top:5px solid #7D4698;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#7D4698;">NODE 01 • CITIZEN INTAKE</span>
                <span style="font-size:11px; font-weight:800; color:#7D4698;">NCRP 1930 PORTAL</span>
              </div>
              <strong style="font-size:16.5px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">1. Citizen FIR & 1930 Ingestion</strong>
              <div style="font-size:11.5px; font-weight:700; color:#6B21A8; margin-bottom:7px;">Victim Cyber Fraud Filing • ₹45 Lakh Loss • UPI Transaction ID</div>
              
              <div style="font-size:12px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:3px;">
                <div>• <strong>Citizen FIR Intake:</strong> Immediate capture of victim transaction hashes & cyber complaints.</div>
                <div>• <strong>UPI-to-Crypto Link:</strong> Identifies fraudulent P2P bank transfers buying USDT.</div>
                <div>• <strong>UTDM Normalization:</strong> Universal ledger abstraction across Bitcoin, TRC-20, & Ethereum.</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#F5F3FF; border:1px solid #DDD6FE; color:#6B21A8;">
              <span>Ingestion Stream:</span>
              <span>Canonical UTDM Ingestion Event Stream</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
            <div style="font-size:24px; color:#7D4698; font-weight:900; line-height:1;">➔</div>
            <div style="font-size:9px; font-weight:800; color:#64748B; text-align:center; text-transform:uppercase;">FIR Hash</div>
          </div>

          <!-- Node 2: RBAC Tier 1 - Case IO (Seed Seeding & Intake) -->
          <div class="flow-node" style="height:250px; border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#0284C7;">NODE 02 • MHA TIER 1</span>
                <span class="role-badge" style="background:#E0F2FE; color:#0369A1;">CASE IO • POLICE STATION</span>
              </div>
              <strong style="font-size:16.5px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Investigating Officer (IO)</strong>
              <div style="font-size:11px; color:#64748B; margin-bottom:6px;">Sub-Inspector / Inspector • Cyber Crime Police Station</div>
              
              <div style="display:flex; flex-direction:column; gap:4px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 1: 1930 INTAKE</span>
                  <div>Auto-validates victim TX hashes from NCRP in Golden Hour.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 2: SEED TAGGER</span>
                  <div>1-click tags initial scam deposit address (TXa7b...) into UTDM.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 3: SEC 94 BNSS</span>
                  <div>Auto-drafts statutory summons to telecom & payment gateways.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#F0F9FF; border:1px solid #BAE6FD; color:#0284C7;">
              <span>Case Hand-off:</span>
              <span>Tagged Seed Wallet ➔ Triggers Automated Tracing</span>
            </div>
          </div>

          <!-- Connector 2 -->
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; gap:2px;">
            <div style="font-size:24px; color:#0284C7; font-weight:900; line-height:1;">➔</div>
            <div style="font-size:9px; font-weight:800; color:#64748B; text-align:center; text-transform:uppercase;">Seed Wallet</div>
          </div>

          <!-- Node 3: Core Multi-Chain Decoders & Rust BFS Scoring Engine -->
          <div class="flow-node" style="height:250px; border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#2563EB;">NODE 03 • ENGINE CORE</span>
                <span style="font-size:11px; font-weight:800; color:#2563EB;">RUST BFS + TRON gRPC</span>
              </div>
              <strong style="font-size:16.5px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Multi-Chain Tracing & Scoring Core</strong>
              <div style="font-size:11.5px; font-weight:700; color:#1D4ED8; margin-bottom:7px;">Zero-Allocation BFS Core • 5 Mule Hops in &lt;180s • 4-Pillar Score</div>
              
              <div style="font-size:12px; color:#334155; line-height:1.38; display:flex; flex-direction:column; gap:3px;">
                <div>• <strong>Java-Tron gRPC Decoder:</strong> Sub-15ms parsing unmasks fee-delegation energy sponsors.</div>
                <div>• <strong>Rust Bounded BFS:</strong> Traverses 5 mule hops, pruning 99.4% insignificant dust & splits.</div>
                <div>• <strong>4-Pillar Math Score:</strong> Temporal (30%), Drain (25%), Topology (25%), Energy (20%).</div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EFF6FF; border:1px solid #BFDBFE; color:#1E40AF;">
              <span>Engine Attribution:</span>
              <span>Isolates Binance Hot Wallet 14 (96.4% Confidence in 3.4 Mins)</span>
            </div>
          </div>

        </div>

        <!-- Directional Process Bridge -->
        <div style="background:linear-gradient(90deg, #1E293B 0%, #0F172A 50%, #1E293B 100%); color:#FFFFFF; border-radius:6px; padding:4px 14px; font-size:11.5px; font-weight:800; text-align:center; letter-spacing:0.8px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>▼ ATTRIBUTED VASP TARGET DISPATCHED TO FORENSIC INVESTIGATOR, SUPERVISORY SANCTION & EXCHANGE DESK ▼</span>
        </div>

        <!-- ROW 2: INVESTIGATION, STATUTORY SANCTION, VASP DEBIT FREEZE & NCFL FORENSIC (4 Nodes) -->
        <div style="display:grid; grid-template-columns: 1fr 22px 1fr 22px 1fr 22px 1.05fr; align-items:center;">
          
          <!-- Node 4: RBAC Tier 2 - Forensic Blockchain Investigator -->
          <div class="flow-node" style="height:250px; border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#4F46E5;">NODE 04 • MHA TIER 2</span>
                <span class="role-badge" style="background:#EEF2FF; color:#4338CA;">FORENSIC CYBER CELL</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Forensic Investigator</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">Inspector / State Cyber Crime Cell</div>
              
              <div style="display:flex; flex-direction:column; gap:3px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">PEEL TREE</span>
                  <div>WebGL canvas de-obfuscates mule peel chains.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">VASP DIR</span>
                  <div>Cross-checks 25+ FIU-registered exchange hot wallets.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">EXPLAINER</span>
                  <div>Audits 4-pillar math weights for court scrutiny.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#EEF2FF; border:1px solid #C7D2FE; color:#4338CA;">
              <span>Verified Proof:</span>
              <span>Attributed VASP Hot-Wallet Proof ➔ Sanction SP</span>
            </div>
          </div>

          <!-- Connector 3 -->
          <div style="font-size:20px; color:#4F46E5; font-weight:900; text-align:center;">➔</div>

          <!-- Node 5: RBAC Tier 3 - Supervisory Sanction SP -->
          <div class="flow-node" style="height:250px; border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#DC2626;">NODE 05 • MHA TIER 3</span>
                <span class="role-badge" style="background:#FEF2F2; color:#991B1B;">SANCTION AUTHORITY</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Supervisory Sanction SP</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">DySP / ACP / SP (Sec 78 IT Act 2000)</div>
              
              <div style="display:flex; flex-direction:column; gap:3px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">AUDIT</span>
                  <div>Verifies sweep proof & 96.4% confidence score.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">ORDERS</span>
                  <div>Digitally signs (Class-3 DSC) Sec 106/107 BNSS freeze.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">SAHYOG</span>
                  <div>1-click automated API dispatch to registered VASP.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#FEF2F2; border:1px solid #FECACA; color:#B91C1C;">
              <span>Statutory Order:</span>
              <span>Dispatches Sec 106/107 Freeze ➔ VASP in &lt;8 Mins</span>
            </div>
          </div>

          <!-- Connector 4 -->
          <div style="font-size:20px; color:#DC2626; font-weight:900; text-align:center;">➔</div>

          <!-- Node 6: RBAC Tier 4 - VASP Compliance Nodal Officer -->
          <div class="flow-node" style="height:250px; border:2px solid #D97706; border-top:5px solid #D97706;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#D97706;">NODE 06 • MHA TIER 4</span>
                <span class="role-badge" style="background:#FFFBEB; color:#B45309;">EXCHANGE DESK</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">VASP Compliance Desk</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">Registered Exchange (CoinDCX / WazirX / Binance)</div>
              
              <div style="display:flex; flex-direction:column; gap:3px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">INBOX</span>
                  <div>Receives live Sec 106/107 BNSS orders via SAHYOG API.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">LOCK</span>
                  <div>Executes immediate debit-freeze within mandatory 2-hr SLA.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">KYC</span>
                  <div>Securely transmits beneficial owner KYC (PAN, IP history).</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#FFFBEB; border:1px solid #FDE68A; color:#B45309;">
              <span>Off-Ramp Intercepted:</span>
              <span>Assets Frozen + Compliance Receipt ➔ LEA</span>
            </div>
          </div>

          <!-- Connector 5 -->
          <div style="font-size:20px; color:#D97706; font-weight:900; text-align:center;">➔</div>

          <!-- Node 7: RBAC Tier 5 - Digital Forensic Examiner & Threat Analyst -->
          <div class="flow-node" style="height:250px; border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="step-pill" style="background:#059669;">NODE 07 • MHA TIER 5</span>
                <span class="role-badge" style="background:#ECFDF5; color:#047857;">NCFL / FSL + I4C TAU</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2; margin-bottom:2px;">Forensic Attestation & CTI</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">State FSL Scientist + I4C Threat Analytics Unit</div>
              
              <div style="display:flex; flex-direction:column; gap:3px;">
                <div class="tab-row">
                  <span class="tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">RPC AUDIT</span>
                  <div>Verifies raw transaction payloads & Merkle roots on-chain.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">PART B CERT</span>
                  <div>Signs BSA Sec 63 report with FIPS 140-3 HSM seal for trial.</div>
                </div>
                <div class="tab-row">
                  <span class="tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">CROSS-FIR</span>
                  <div>Correlates mule network across inter-state syndicates.</div>
                </div>
              </div>
            </div>

            <div class="hand-off-bar" style="background:#ECFDF5; border:1px solid #A7F3D0; color:#047857;">
              <span>Court Trial & Recovery:</span>
              <span>Sec 63 BSA Admissibility + Capital Restitution</span>
            </div>
          </div>

        </div>

      </div>
    </div>

    <!-- SECTION 02: PRODUCTION SYSTEM ARCHITECTURE & TECH STACK (SEPARATE BOTTOM SECTION: ~175px) -->
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
        <div style="font-size:11px; font-weight:800; color:#0284C7;">
          FULLY EXPLAINED PRODUCTION SUBSYSTEMS • DETERMINISTIC TDD TESTED
        </div>
      </div>

      <!-- 4 Architectural Domain Cards Grid (Height: ~145px) -->
      <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:12px;">
        
        <!-- Domain 1: Multi-Chain Ingest & Streams -->
        <div class="arch-card" style="height:145px; border-left:4px solid #0284C7;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Multi-Chain Ingest & Streams</strong>
              <span style="font-size:10px; font-weight:800; background:#E0F2FE; color:#0369A1; padding:1.5px 5px; border-radius:3px;">10,000 TX/S</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              Normalizes Bitcoin UTXO, TRC-20, & Ethereum transactions into canonical UTDM with sub-15ms parsing.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#0369A1; background:#F0F9FF; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: 10,000+ TX/Sec Throughput • &lt; 15ms Block Parsing Latency
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Java-Tron RPC</span>
              <span class="tech-chip">Bitcoin RPC</span>
              <span class="tech-chip">Web3.py</span>
              <span class="tech-chip">Kafka 3.6</span>
              <span class="tech-chip">gRPC Protobuf</span>
            </div>
          </div>
        </div>

        <!-- Domain 2: Air-Gapped Backend Enclave -->
        <div class="arch-card" style="height:145px; border-left:4px solid #4F46E5;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Air-Gapped Backend Enclave</strong>
              <span style="font-size:10px; font-weight:800; background:#EEF2FF; color:#4338CA; padding:1.5px 5px; border-radius:3px;">MEGHRAJ SCIF</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              High-speed analytical columnar warehouse querying 100M+ transactions in &lt;100ms with Neo4j graph storage.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#4338CA; background:#EEF2FF; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: &lt; 100ms Query Time (100M TX) • Air-Gapped mTLS 1.3
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Neo4j Enterprise</span>
              <span class="tech-chip">ClickHouse</span>
              <span class="tech-chip">PostgreSQL 16</span>
              <span class="tech-chip">Redis Hot Cache</span>
              <span class="tech-chip">Go (Golang)</span>
            </div>
          </div>
        </div>

        <!-- Domain 3: Graph Intelligence & Scoring -->
        <div class="arch-card" style="height:145px; border-left:4px solid #059669;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Graph Intelligence & Scoring</strong>
              <span style="font-size:10px; font-weight:800; background:#ECFDF5; color:#065F46; padding:1.5px 5px; border-radius:3px;">&lt; 180S SEARCH</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              Zero-allocation Rust core traversing 5 mule hops in &lt;180s with 4-pillar multi-factor mathematical scoring.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#047857; background:#ECFDF5; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: &lt; 180s 5-Hop Traversal • 99.4% Volume Entropy Pruning
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">Rust BFS Core</span>
              <span class="tech-chip">PyTorch ML</span>
              <span class="tech-chip">NetworkX</span>
              <span class="tech-chip">NumPy/SciPy</span>
              <span class="tech-chip">Cypher Engine</span>
            </div>
          </div>
        </div>

        <!-- Domain 4: Sovereign Security & LEA Portals -->
        <div class="arch-card" style="height:145px; border-left:4px solid #DC2626;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:14px; color:#0F172A; font-weight:900;">Sovereign Security & LEA Portals</strong>
              <span style="font-size:10px; font-weight:800; background:#FEF2F2; color:#991B1B; padding:1.5px 5px; border-radius:3px;">BNSS 106/107</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              WebGL transaction peeling visualizer, statutory sanction portal, and automated MHA SAHYOG freeze dispatcher.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#B91C1C; background:#FEF2F2; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: &lt; 8 Mins to VASP Debit Freeze • FIU-IND 25+ CASP Sync
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-chip">React 18</span>
              <span class="tech-chip">TypeScript</span>
              <span class="tech-chip">SAHYOG API</span>
              <span class="tech-chip">FIPS HSM</span>
              <span class="tech-chip">ReportLab</span>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Solid Blue Footer Bar -->
    <div style="position:absolute; bottom:0; left:0; right:0; height:38px; background:#0D5CA8; display:flex; align-items:center; justify-content:space-between; padding:0 48px;">
      <div style="width:30px;"></div>
      <div style="font-size:16px; font-weight:700; color:#FFFFFF; letter-spacing:0.5px;">CHAKRA - @SIH Idea Submission</div>
      <div style="font-size:20px; font-weight:900; color:#FFFFFF;">3</div>
    </div>
  </div>
</body>
</html>`;"""

    pattern = r"    case 3:\s+return `<!DOCTYPE html>.*?</html>`;"
    new_content = re.sub(pattern, new_case_3, content, flags=re.DOTALL)
    with open(path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("Updated Chakra Slide 3 with true visual graph workflow!")

if __name__ == "__main__":
    update_bhedak_slide_3()
    update_chakra_slide_3()
