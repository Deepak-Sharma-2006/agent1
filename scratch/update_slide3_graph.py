import re

def update_bhedak():
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
    .graph-node {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 9px 12px;
      box-sizing: border-box;
      box-shadow: 0 2px 6px rgba(15,23,42,0.04);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .node-tag {
      font-size: 10.5px;
      font-weight: 900;
      color: #FFFFFF;
      padding: 2px 7px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .rbac-card {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 10px 12px;
      box-sizing: border-box;
      box-shadow: 0 3px 8px rgba(15,23,42,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .rbac-tab-item {
      display: flex;
      align-items: flex-start;
      gap: 7px;
      font-size: 11.5px;
      line-height: 1.32;
      color: #334155;
    }
    .rbac-tab-pill {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 3px;
      white-space: nowrap;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .arch-domain-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .tech-pill {
      font-size: 10.5px;
      font-weight: 800;
      padding: 2px 6px;
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

    <!-- SECTION 01: GRAPH-BASED OPERATIONAL WORKFLOW & STATUTORY RBAC (MAJORITY OF SLIDE: ~645px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:7px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:15px; font-weight:900; padding:4px 20px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            01 • INTEGRATED GRAPH WORKFLOW & STATUTORY RBAC ARCHITECTURE
          </div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:3px 16px; font-size:13.5px; font-weight:700; color:#1D4ED8;">
            Connected Pipeline: Illicit Ingestion ➔ Core Analysis Engines ➔ 3 NTRO Cadres ➔ Sealed Court Docket
          </div>
        </div>
        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:9999px; padding:3px 14px; font-size:11.5px; font-weight:800; color:#065F46;">
          SOVEREIGN AIR-GAPPED SCIF • ZERO FOREIGN DEPENDENCIES
        </div>
      </div>

      <!-- Interconnected Graph Pipeline Canvas (Height: ~605px) -->
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 12px; display:flex; flex-direction:column; gap:8px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- TIER A: 4-Node Sequential Attribution Graph (Top Row, Height: ~182px) -->
        <div style="display:grid; grid-template-columns: 1fr 24px 1fr 24px 1.05fr 24px 1.1fr; align-items:center;">
          
          <!-- Node 1: Starting Point (Darknet & Surface Ingestion) -->
          <div class="graph-node" style="height:182px; border:2px solid #7D4698; border-top:5px solid #7D4698;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#7D4698;">STARTING POINT</span>
                <span style="font-size:11px; font-weight:800; color:#7D4698;">NODE 01</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">1. Darknet & Surface Source</strong>
              <div style="font-size:11px; font-weight:700; color:#7D4698; margin-bottom:5px;">Tor Marketplaces • Paste Dumps • MTProto</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>15+ Active Markets:</strong> Automated scraping of narcotics, exploit, and weapons bazaars.</div>
                <div>• <strong>Ephemeral Paste Dumps:</strong> Regex scraping of Pastebin & Rentry leak dumps.</div>
                <div>• <strong>Telegram MTProto:</strong> Async listener capturing syndicate chat logs & file attachments.</div>
              </div>
            </div>
            <div style="background:#F5F3FF; border:1px solid #DDD6FE; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#6B21A8; display:flex; justify-content:space-between;">
              <span>Output Deliverable:</span>
              <span>Raw .onion HTML Dumps & Chat Streams</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div style="text-align:center; font-size:22px; color:#7D4698; font-weight:900;">➔</div>

          <!-- Node 2: Crawler Fleet & Origin Server Probing -->
          <div class="graph-node" style="height:182px; border:2px solid #D97706; border-top:5px solid #D97706;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#D97706;">INFRA PROBING</span>
                <span style="font-size:11px; font-weight:800; color:#D97706;">NODE 02</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">2. Ingestion & Server Probing</strong>
              <div style="font-size:11px; font-weight:700; color:#D97706; margin-bottom:5px;">256-Node Tor SOCKS5 • Active Server Prober</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>180s Circuit Rotation:</strong> Python stem pool evading Tor circuit rate-limits.</div>
                <div>• <strong>Playwright Stealth:</strong> Headless Chromium bypassing Cloudflare Turnstile.</div>
                <div>• <strong>Origin Unmasking:</strong> Apache mod_status leaks, TLS SAN, & mmh3 Favicon.</div>
              </div>
            </div>
            <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#B45309; display:flex; justify-content:space-between;">
              <span>Unmasked Footprint:</span>
              <span>Clearnet Origin IP: 103.152.18.42</span>
            </div>
          </div>

          <!-- Connector 2 -->
          <div style="text-align:center; font-size:22px; color:#2563EB; font-weight:900;">➔</div>

          <!-- Node 3: Multi-Market Entity Graph Engine -->
          <div class="graph-node" style="height:182px; border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#2563EB;">GRAPH RESOLUTION</span>
                <span style="font-size:11px; font-weight:800; color:#2563EB;">NODE 03</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">3. Multi-Market Entity Graph</strong>
              <div style="font-size:11px; font-weight:700; color:#2563EB; margin-bottom:5px;">Neo4j 5.20 Property Graph • Alias Linkage</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>RFC 4880 PGP Binding:</strong> Binds vendor aliases across 15+ markets via RSA keys.</div>
                <div>• <strong>Crypto Clustering:</strong> BTC peel chains, CoinJoin demixing, & XMR linkages.</div>
                <div>• <strong>Unified Threat Actor:</strong> Resolves disparate aliases into 1 master entity.</div>
              </div>
            </div>
            <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#1E40AF; display:flex; justify-content:space-between;">
              <span>Graph Scale:</span>
              <span>10,000+ Nodes Resolved (&lt;50ms Traversal)</span>
            </div>
          </div>

          <!-- Connector 3 -->
          <div style="text-align:center; font-size:22px; color:#059669; font-weight:900;">➔</div>

          <!-- Node 4: AI Stylometry & Diurnal NLP Lab -->
          <div class="graph-node" style="height:182px; border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#059669;">AI STYLOMETRY & NLP</span>
                <span style="font-size:11px; font-weight:800; color:#059669;">NODE 04</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">4. AI Stylometry & Diurnal Fit</strong>
              <div style="font-size:11px; font-weight:700; color:#059669; margin-bottom:5px;">Siamese RoBERTa • IndicBERT • 24h Sleep Trough</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>400+ Writeprints:</strong> Triplet-loss neural verification on forum post syntax.</div>
                <div>• <strong>IndicBERT Hinglish:</strong> Decodes Indian darknet slang ("supari", "hawala").</div>
                <div>• <strong>Diurnal Inactivity Trough:</strong> Maps suspect sleep cycle to UTC+5:30 (±30m).</div>
              </div>
            </div>
            <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#065F46; display:flex; justify-content:space-between;">
              <span>Ethical AI Guard:</span>
              <span>0.65 Max AI Cap (Dempster-Shafer Bound)</span>
            </div>
          </div>

        </div>

        <!-- Flow Transition Ribbon to RBAC Tier -->
        <div style="background:linear-gradient(90deg, #1E293B 0%, #0F172A 50%, #1E293B 100%); color:#FFFFFF; border-radius:6px; padding:3px 12px; font-size:11px; font-weight:800; text-align:center; letter-spacing:0.8px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>▼ PIPELINE FEEDS ENRICHED INTELLIGENCE DIRECTLY INTO AUTHENTIC NTRO STATUTORY CADRE WORKSPACES ▼</span>
        </div>

        <!-- TIER B: Authentic NTRO Scientific Cadre & Statutory RBAC Units (3 Exact Roles, Height: ~285px) -->
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
          
          <!-- Node 5: NTRO Role 1 - TECHINT Ingestion Operator (Scientist 'D') -->
          <div class="rbac-card" style="height:285px; border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="node-tag" style="background:#0284C7;">NTRO ROLE 01 • SCIENTIST 'D'</span>
                <span style="font-size:11px; font-weight:800; color:#0284C7;">LAWFUL INGESTION CUSTODIAN</span>
              </div>
              <strong style="font-size:16px; color:#0F172A; display:block; font-weight:900;">TECHINT Ingestion Operator</strong>
              <div style="font-size:11.5px; color:#64748B; margin-bottom:7px;">Statutory Mandate: Sec. 63(4)(a) BSA 2023 • CITC Division</div>
              
              <!-- 4 Distinct Dashboard Tabs/Features -->
              <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:7px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 1: CRAWLER CONTROL</span>
                  <div><strong>Automated Target Scheduling:</strong> Priority queues for 15+ darknet markets & Telegram.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 2: INFRA AUDIT</span>
                  <div><strong>Server Misconfig Prober:</strong> Automated origin IP scanner, mod_status & TLS leaks.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 3: PART A CUSTODIAN</span>
                  <div><strong>Statutory Ingestion Seal:</strong> Generates and signs Sec. 63(4)(a) custody certificate.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 4: SOCKS5 POOL</span>
                  <div><strong>Circuit Health Monitor:</strong> Manages 256-node IP circuit health & zero-ban rotation.</div>
                </div>
              </div>
            </div>

            <div style="background:#F0F9FF; border:1px solid #BAE6FD; border-radius:4px; padding:3px 7px; font-size:11px; font-weight:800; color:#0284C7; display:flex; justify-content:space-between;">
              <span>Operational Hand-off:</span>
              <span>Feeds Sanitized Captures & Merkle Leaf Hashes to Forensic Examiner</span>
            </div>
          </div>

          <!-- Node 6: NTRO Role 2 - Cyber Forensic Examiner (Scientist 'E') -->
          <div class="rbac-card" style="height:285px; border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="node-tag" style="background:#4F46E5;">NTRO ROLE 02 • SCIENTIST 'E'</span>
                <span style="font-size:11px; font-weight:800; color:#4F46E5;">TECHNICAL FORENSIC EXPERT</span>
              </div>
              <strong style="font-size:16px; color:#0F172A; display:block; font-weight:900;">Cyber Forensic Examiner</strong>
              <div style="font-size:11.5px; color:#64748B; margin-bottom:7px;">Statutory Mandate: Sec. 63(4)(b)-(c) BSA 2023 • NICRD / NCIIPC</div>
              
              <!-- 4 Distinct Dashboard Tabs/Features -->
              <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:7px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 1: GRAPH CANVAS</span>
                  <div><strong>Entity Resolution Studio:</strong> Explores 10,000+ threat nodes, aliases & BTC clusters.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 2: STYLOMETRY LAB</span>
                  <div><strong>Writeprint Vector Match:</strong> Side-by-side linguistic heatmaps & author attribution.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 3: DIURNAL CLOCK</span>
                  <div><strong>24h Activity Curves:</strong> Maps forum post timestamps to suspect's timezone.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 4: PART B FORENSIC</span>
                  <div><strong>FIPS 140-3 HSM Signer:</strong> Executes cryptographic digital signature on Part B report.</div>
                </div>
              </div>
            </div>

            <div style="background:#EEF2FF; border:1px solid #C7D2FE; border-radius:4px; padding:3px 7px; font-size:11px; font-weight:800; color:#4338CA; display:flex; justify-content:space-between;">
              <span>Operational Hand-off:</span>
              <span>Feeds Peer-Reviewed Forensic Dossier to Centre Director</span>
            </div>
          </div>

          <!-- Node 7: NTRO Role 3 - Centre Director (Scientist 'G') -->
          <div class="rbac-card" style="height:285px; border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="node-tag" style="background:#DC2626;">NTRO ROLE 03 • SCIENTIST 'G'</span>
                <span style="font-size:11px; font-weight:800; color:#DC2626;">STATUTORY DISSEMINATION AUTHORITY</span>
              </div>
              <strong style="font-size:16px; color:#0F172A; display:block; font-weight:900;">Centre Director</strong>
              <div style="font-size:11.5px; color:#64748B; margin-bottom:7px;">Statutory Mandate: Sec. 70A IT Act 2000 • PMO / NTRO Command</div>
              
              <!-- 4 Distinct Dashboard Tabs/Features -->
              <div style="display:flex; flex-direction:column; gap:5px; margin-bottom:7px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 1: EXECUTIVE REVIEW</span>
                  <div><strong>Admissibility Audit:</strong> Validates multi-factor confidence & chain-of-custody proof.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 2: SEC 70A IT ACT</span>
                  <div><strong>Inter-Agency Authority:</strong> Authorizes critical infrastructure CTI dissemination.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 3: STIX 2.1 GATEWAY</span>
                  <div><strong>Automated Threat Push:</strong> Encrypted STIX 2.1 feeds to CERT-In & I4C Samanvaya.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 4: JUDICIAL RELEASE</span>
                  <div><strong>Sealed Evidence Release:</strong> Transmits court package to CBI, NIA, & State Police.</div>
                </div>
              </div>
            </div>

            <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:4px; padding:3px 7px; font-size:11px; font-weight:800; color:#B91C1C; display:flex; justify-content:space-between;">
              <span>Operational Hand-off:</span>
              <span>Releases Sealed Evidence Package for Special Cyber Court Submission</span>
            </div>
          </div>

        </div>

        <!-- TIER C: Node 8 - Final Prosecution Output & Sovereign Gateway Strip (Height: ~40px) -->
        <div style="background:linear-gradient(90deg, #1E1B4B 0%, #1E3A8A 50%, #064E3B 100%); border-radius:6px; padding:6px 14px; display:flex; align-items:center; justify-content:space-between; color:#FFFFFF;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:#FACC15; color:#0F172A; font-size:10.5px; font-weight:900; padding:2px 7px; border-radius:3px;">NODE 08 • FINAL ARTIFACT</span>
            <strong style="font-size:13px; letter-spacing:0.5px;">BSA 2023 SEC 63 EVIDENCE PACKAGE + FIPS 140-3 HSM DUAL SIGNATURE</strong>
          </div>
          <div style="display:flex; gap:16px; font-size:12px; font-weight:700;">
            <span style="color:#A7F3D0;">✓ Part A (Ingestion Custodian) & Part B (Forensic Examiner) Dual-Certificate</span>
            <span style="color:#FDE68A;">✓ SHA-256 Merkle Chain of Custody</span>
            <span style="color:#93C5FD;">✓ Live Connectors: I4C Samanvaya • CERT-In STIX 2.1 • Special Cyber Court</span>
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
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #0284C7;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Distributed Crawler Fleet</strong>
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
              <span class="tech-pill">Tor SOCKS5h</span>
              <span class="tech-pill">Python Stem</span>
              <span class="tech-pill">Playwright</span>
              <span class="tech-pill">Kafka 3.6</span>
              <span class="tech-pill">Telethon</span>
            </div>
          </div>
        </div>

        <!-- Domain 2: Air-Gapped Backend Enclave -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #4F46E5;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Air-Gapped Backend Enclave</strong>
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
              <span class="tech-pill">Neo4j 5.20</span>
              <span class="tech-pill">Elasticsearch 8</span>
              <span class="tech-pill">TimescaleDB</span>
              <span class="tech-pill">PostgreSQL 16</span>
              <span class="tech-pill">Go (gRPC)</span>
            </div>
          </div>
        </div>

        <!-- Domain 3: AI Stylometry & NLP Lab -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #059669;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">AI Stylometry & NLP Lab</strong>
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
              <span class="tech-pill">PyTorch 2.2</span>
              <span class="tech-pill">IndicBERT</span>
              <span class="tech-pill">Hugging Face</span>
              <span class="tech-pill">BERTopic</span>
              <span class="tech-pill">FastAPI</span>
            </div>
          </div>
        </div>

        <!-- Domain 4: Sovereign Security & LEA Interfaces -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #DC2626;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Sovereign Security & LEA Portals</strong>
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
              <span class="tech-pill">React 18</span>
              <span class="tech-pill">TypeScript</span>
              <span class="tech-pill">Cytoscape.js</span>
              <span class="tech-pill">FIPS HSM</span>
              <span class="tech-pill">ReportLab</span>
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
    print("Updated Bhedak Slide 3 successfully!")

def update_chakra():
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
    .graph-node {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 9px 12px;
      box-sizing: border-box;
      box-shadow: 0 2px 6px rgba(15,23,42,0.04);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .node-tag {
      font-size: 10px;
      font-weight: 900;
      color: #FFFFFF;
      padding: 2px 6px;
      border-radius: 4px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .rbac-card {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 9px 10px;
      box-sizing: border-box;
      box-shadow: 0 3px 8px rgba(15,23,42,0.05);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .rbac-tab-item {
      display: flex;
      align-items: flex-start;
      gap: 5px;
      font-size: 11px;
      line-height: 1.30;
      color: #334155;
    }
    .rbac-tab-pill {
      font-size: 9.5px;
      font-weight: 800;
      padding: 1.5px 5px;
      border-radius: 3px;
      white-space: nowrap;
      flex-shrink: 0;
      margin-top: 1px;
    }
    .arch-domain-card {
      background: #FFFFFF;
      border: 1.5px solid #CBD5E1;
      border-radius: 8px;
      padding: 8px 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .tech-pill {
      font-size: 10px;
      font-weight: 800;
      padding: 2px 5px;
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

    <!-- SECTION 01: GRAPH-BASED OPERATIONAL WORKFLOW & 5-TIER RBAC (MAJORITY OF SLIDE: ~645px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:7px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:15px; font-weight:900; padding:4px 20px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            01 • INTEGRATED GRAPH WORKFLOW & 5-TIER RBAC ARCHITECTURE
          </div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:3px 16px; font-size:13.5px; font-weight:700; color:#1D4ED8;">
            Connected Pipeline: Citizen 1930 Intake ➔ Multi-Chain Tracing ➔ 5 MHA/I4C Tiers ➔ Instant VASP Debit Freeze
          </div>
        </div>
        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:9999px; padding:3px 14px; font-size:11.5px; font-weight:800; color:#065F46;">
          SOVEREIGN AIR-GAPPED SCIF • ZERO FOREIGN DEPENDENCIES
        </div>
      </div>

      <!-- Interconnected Graph Pipeline Canvas (Height: ~605px) -->
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 12px; display:flex; flex-direction:column; gap:8px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- TIER A: 3-Node Core Ingestion & Algorithmic Engine Pipeline (Top Row, Height: ~182px) -->
        <div style="display:grid; grid-template-columns: 1fr 28px 1fr 28px 1.15fr; align-items:center;">
          
          <!-- Node 1: Starting Point (Citizen NCRP 1930 FIR Intake) -->
          <div class="graph-node" style="height:182px; border:2px solid #7D4698; border-top:5px solid #7D4698;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#7D4698;">STARTING POINT</span>
                <span style="font-size:11px; font-weight:800; color:#7D4698;">NODE 01</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">1. Citizen FIR & 1930 Intake</strong>
              <div style="font-size:11px; font-weight:700; color:#7D4698; margin-bottom:5px;">NCRP 1930 Portal • Victim UPI • Canonical UTDM Stream</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>Citizen FIR Intake:</strong> Ingestion of victim TX hashes & banking cyber complaints.</div>
                <div>• <strong>UPI-to-Crypto Link:</strong> Identifies fraudulent P2P on-ramp settlement logs.</div>
                <div>• <strong>UTDM Normalization:</strong> Canonical stream across Bitcoin, TRC-20, & Ethereum.</div>
              </div>
            </div>
            <div style="background:#F5F3FF; border:1px solid #DDD6FE; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#6B21A8; display:flex; justify-content:space-between;">
              <span>Output Deliverable:</span>
              <span>Canonical UTDM Ingestion Event Stream</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div style="text-align:center; font-size:24px; color:#7D4698; font-weight:900;">➔</div>

          <!-- Node 2: Multi-Chain Ingestion & Tron Energy Decoder -->
          <div class="graph-node" style="height:182px; border:2px solid #D97706; border-top:5px solid #D97706;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#D97706;">DECODE & STREAM</span>
                <span style="font-size:11px; font-weight:800; color:#D97706;">NODE 02</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">2. Multi-Chain Ingest & Energy</strong>
              <div style="font-size:11px; font-weight:700; color:#D97706; margin-bottom:5px;">Java-Tron FullNode gRPC • 10,000+ TX/s</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>Sub-15ms Parsing:</strong> Real-time decode of TRC-20 USDT transfer contracts.</div>
                <div>• <strong>Energy Sponsor Decode:</strong> Unmasks who paid energy for the scam transfer.</div>
                <div>• <strong>Bridge & Memo Parser:</strong> Tracks THORChain, Stargate, & CCTP lock-burns.</div>
              </div>
            </div>
            <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#B45309; display:flex; justify-content:space-between;">
              <span>Unmasked Entity:</span>
              <span>Fee-Delegation Sponsor & Peel Chains</span>
            </div>
          </div>

          <!-- Connector 2 -->
          <div style="text-align:center; font-size:24px; color:#2563EB; font-weight:900;">➔</div>

          <!-- Node 3: Rust BFS Core & 4-Pillar Algorithmic Scorer -->
          <div class="graph-node" style="height:182px; border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#2563EB;">GRAPH & SCORING</span>
                <span style="font-size:11px; font-weight:800; color:#2563EB;">NODE 03</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">3. Rust BFS & 4-Pillar Scorer</strong>
              <div style="font-size:11px; font-weight:700; color:#2563EB; margin-bottom:5px;">Zero-Allocation Core • 5 Mule Hops in &lt;180s</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>Volume Entropy Pruning:</strong> Eliminates 99.4% insignificant dust & splits.</div>
                <div>• <strong>5-Hop Mule Traversal:</strong> Blazing-fast BFS traversal in &lt;180s without blowup.</div>
                <div>• <strong>4-Pillar Mathematical Score:</strong> Temporal (30%), Drain (25%), Density (25%), Energy (20%).</div>
              </div>
            </div>
            <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#065F46; display:flex; justify-content:space-between;">
              <span>Explainable Math:</span>
              <span>Definitive 0-1.0 Attribution (Zero AI Hallucination)</span>
            </div>
          </div>

        </div>

        <!-- Flow Transition Ribbon to 5-Tier RBAC -->
        <div style="background:linear-gradient(90deg, #1E293B 0%, #0F172A 50%, #1E293B 100%); color:#FFFFFF; border-radius:6px; padding:3px 12px; font-size:11px; font-weight:800; text-align:center; letter-spacing:0.8px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>▼ PIPELINE FEEDS LIVE ATTRIBUTION DIRECTLY INTO AUTHENTIC MHA / I4C 5-TIER RBAC OPERATIONAL WORKSPACES ▼</span>
        </div>

        <!-- TIER B: Authentic MHA & I4C 5-Tier Operational RBAC Cadre (5 Exact Roles, Height: ~285px) -->
        <div style="display:grid; grid-template-columns: repeat(5, 1fr); gap:9px;">
          
          <!-- Role 1: Investigating Officer -->
          <div class="rbac-card" style="height:285px; border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#0284C7;">TIER 1 • CASE IO</span>
                <span style="font-size:10px; font-weight:800; color:#0284C7;">POLICE STATION</span>
              </div>
              <strong style="font-size:14.5px; color:#0F172A; display:block; font-weight:900;">Investigating Officer (IO)</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">Sub-Inspector / Inspector • Cyber Cell</div>
              
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:5px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 1: 1930 INTAKE</span>
                  <div><strong>FIR Intake:</strong> Auto-pulls victim TX hashes from NCRP.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 2: SEED TAGGER</span>
                  <div><strong>Wallet Tagging:</strong> Labels scam deposit address.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 3: PEEL RADAR</span>
                  <div><strong>Mule Tracking:</strong> Traces split-combines & hops.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 4: SEC 94 BNSS</span>
                  <div><strong>Notice Drafter:</strong> Auto-drafts summons for KYC.</div>
                </div>
              </div>
            </div>

            <div style="background:#F0F9FF; border:1px solid #BAE6FD; border-radius:4px; padding:2.5px 5px; font-size:10px; font-weight:800; color:#0284C7;">
              Feeds ➔ Tagged Mule Trail to Supervisory SP
            </div>
          </div>

          <!-- Role 2: Supervisory Sanction Officer -->
          <div class="rbac-card" style="height:285px; border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#4F46E5;">TIER 2 • SANCTION SP</span>
                <span style="font-size:10px; font-weight:800; color:#4F46E5;">STATUTORY POWER</span>
              </div>
              <strong style="font-size:14.5px; color:#0F172A; display:block; font-weight:900;">Supervisory Sanction SP</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">DySP / ACP / SP (Sec 78 IT Act 2000)</div>
              
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:5px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 1: CONFIDENCE</span>
                  <div><strong>Attribution Audit:</strong> Verifies 4-pillar score proof.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 2: FREEZE ORDER</span>
                  <div><strong>Class-3 DSC:</strong> Signs Sec 106/107 BNSS freeze.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 3: SAHYOG API</span>
                  <div><strong>1-Click Dispatch:</strong> Transmits order to VASP.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 4: HASH LEDGER</span>
                  <div><strong>Audit Trail:</strong> Append-only PostgreSQL log.</div>
                </div>
              </div>
            </div>

            <div style="background:#EEF2FF; border:1px solid #C7D2FE; border-radius:4px; padding:2.5px 5px; font-size:10px; font-weight:800; color:#4338CA;">
              Dispatches ➔ Statutory Freeze to VASP on SAHYOG
            </div>
          </div>

          <!-- Role 3: Digital Forensic Examiner -->
          <div class="rbac-card" style="height:285px; border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#059669;">TIER 3 • FORENSIC</span>
                <span style="font-size:10px; font-weight:800; color:#059669;">FSL / NCFL</span>
              </div>
              <strong style="font-size:14.5px; color:#0F172A; display:block; font-weight:900;">Digital Forensic Examiner</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">State FSL / NCFL Forensic Scientist</div>
              
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:5px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 1: RPC AUDIT</span>
                  <div><strong>Payload Verification:</strong> Cross-checks raw blocks.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 2: MERKLE TREE</span>
                  <div><strong>Chain of Custody:</strong> Audits SHA-256 tree root.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 3: BSA SEC 63</span>
                  <div><strong>Part B Cert:</strong> Signs forensic report for court.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#ECFDF5; color:#047857; border:1px solid #A7F3D0;">TAB 4: HSM ROOT</span>
                  <div><strong>FIPS 140-3 Seal:</strong> Anchors cryptographic key.</div>
                </div>
              </div>
            </div>

            <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:4px; padding:2.5px 5px; font-size:10px; font-weight:800; color:#047857;">
              Certifies ➔ Part B Forensic Admissibility
            </div>
          </div>

          <!-- Role 4: Cyber Threat Analyst -->
          <div class="rbac-card" style="height:285px; border:2px solid #D97706; border-top:5px solid #D97706;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#D97706;">TIER 4 • CTI ANALYST</span>
                <span style="font-size:10px; font-weight:800; color:#D97706;">I4C TAU</span>
              </div>
              <strong style="font-size:14.5px; color:#0F172A; display:block; font-weight:900;">Cyber Threat Analyst</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">I4C Threat Analytics Unit / State Command</div>
              
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:5px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 1: CROSS-FIR</span>
                  <div><strong>Syndicate Link:</strong> Connects inter-state FIRs.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 2: MULE CLUSTER</span>
                  <div><strong>Shared Wallets:</strong> Detects multi-scam funnels.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 3: VASP MAP</span>
                  <div><strong>Exchange Heatmap:</strong> Tracks rogue off-ramps.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FFFBEB; color:#B45309; border:1px solid #FDE68A;">TAB 4: CTI DOSSIER</span>
                  <div><strong>National Dossier:</strong> Exports inter-agency feeds.</div>
                </div>
              </div>
            </div>

            <div style="background:#FFFBEB; border:1px solid #FDE68A; border-radius:4px; padding:2.5px 5px; font-size:10px; font-weight:800; color:#B45309;">
              Disseminates ➔ National Multi-State Syndicate CTI
            </div>
          </div>

          <!-- Role 5: VASP Compliance Nodal Officer -->
          <div class="rbac-card" style="height:285px; border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#DC2626;">TIER 5 • VASP DESK</span>
                <span style="font-size:10px; font-weight:800; color:#DC2626;">EXCHANGE DESK</span>
              </div>
              <strong style="font-size:14.5px; color:#0F172A; display:block; font-weight:900;">VASP Compliance Officer</strong>
              <div style="font-size:10.5px; color:#64748B; margin-bottom:5px;">Registered Exchange (CoinDCX / WazirX)</div>
              
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:5px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 1: FREEZE INBOX</span>
                  <div><strong>Live Summons:</strong> Receives Sec 106/107 orders.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 2: DEBIT LOCK</span>
                  <div><strong>2-Hr SLA Lock:</strong> Freezes funds instantly.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 3: KYC UPLOAD</span>
                  <div><strong>Beneficial Owner:</strong> Pushes PAN/Aadhaar/IPs.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 4: SLA RECEIPT</span>
                  <div><strong>Compliance Ack:</strong> Signs statutory receipt.</div>
                </div>
              </div>
            </div>

            <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:4px; padding:2.5px 5px; font-size:10px; font-weight:800; color:#B91C1C;">
              Confirms ➔ Capital Debit-Frozen & Off-Ramp Locked
            </div>
          </div>

        </div>

        <!-- TIER C: Node 9 - Final Statutory Action & Asset Freeze Strip (Height: ~40px) -->
        <div style="background:linear-gradient(90deg, #1E1B4B 0%, #1E3A8A 50%, #064E3B 100%); border-radius:6px; padding:6px 14px; display:flex; align-items:center; justify-content:space-between; color:#FFFFFF;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:#FACC15; color:#0F172A; font-size:10.5px; font-weight:900; padding:2px 7px; border-radius:3px;">NODE 09 • FINAL ACTION</span>
            <strong style="font-size:13px; letter-spacing:0.5px;">AUTOMATED SAHYOG FREEZE DISPATCH & SEC 106/107 BNSS DEBIT FREEZE NOTICE</strong>
          </div>
          <div style="display:flex; gap:16px; font-size:12px; font-weight:700;">
            <span style="color:#A7F3D0;">✓ &lt; 8 Mins Time-to-Freeze (vs 21 Days Legacy)</span>
            <span style="color:#FDE68A;">✓ Pre-Populated Sec 94 Summons & Sec 106/107 BNSS Orders</span>
            <span style="color:#93C5FD;">✓ Live Connectors: MHA SAHYOG API • FIU-IND 25+ Registered CASPs</span>
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
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #0284C7;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Multi-Chain Ingest & Streams</strong>
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
              <span class="tech-pill">Java-Tron RPC</span>
              <span class="tech-pill">Bitcoin RPC</span>
              <span class="tech-pill">Web3.py</span>
              <span class="tech-pill">Kafka 3.6</span>
              <span class="tech-pill">gRPC Protobuf</span>
            </div>
          </div>
        </div>

        <!-- Domain 2: Air-Gapped Backend Enclave -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #4F46E5;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Air-Gapped Backend Enclave</strong>
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
              <span class="tech-pill">Neo4j Enterprise</span>
              <span class="tech-pill">ClickHouse</span>
              <span class="tech-pill">PostgreSQL 16</span>
              <span class="tech-pill">Redis Hot Cache</span>
              <span class="tech-pill">Go (Golang)</span>
            </div>
          </div>
        </div>

        <!-- Domain 3: Graph Intelligence & Scoring -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #059669;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Graph Intelligence & Scoring</strong>
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
              <span class="tech-pill">Rust BFS Core</span>
              <span class="tech-pill">PyTorch ML</span>
              <span class="tech-pill">NetworkX</span>
              <span class="tech-pill">NumPy/SciPy</span>
              <span class="tech-pill">Cypher Engine</span>
            </div>
          </div>
        </div>

        <!-- Domain 4: Sovereign Security & LEA Portals -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #DC2626;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Sovereign Security & LEA Portals</strong>
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
              <span class="tech-pill">React 18</span>
              <span class="tech-pill">TypeScript</span>
              <span class="tech-pill">SAHYOG API</span>
              <span class="tech-pill">FIPS HSM</span>
              <span class="tech-pill">ReportLab</span>
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
    print("Updated Chakra Slide 3 successfully!")

if __name__ == "__main__":
    update_bhedak()
    update_chakra()
