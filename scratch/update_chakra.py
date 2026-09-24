import re

# Read the bhedak slide 3 replacement to adapt for chakra
with open(r'c:\Users\Deepak Sharma\OneDrive\Desktop\SIH\scripts\engine\generate_chakra_slides.mjs', 'r', encoding='utf-8') as f:
    content = f.read()

# Define the new case 3 for Chakra
chakra_case_3 = '''    case 3:
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
      padding: 9px 11px;
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
      gap: 6px;
      font-size: 11.5px;
      line-height: 1.32;
      color: #334155;
    }
    .rbac-tab-pill {
      font-size: 10px;
      font-weight: 800;
      padding: 1.5px 5.5px;
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

    <!-- SECTION 01: GRAPH-BASED OPERATIONAL WORKFLOW & RBAC GOVERNANCE (MAJORITY OF SLIDE: ~645px) -->
    <div style="margin-bottom:8px;">
      <!-- Section Header Ribbon -->
      <div style="display:flex; align-items:center; justify-content:space-between; height:28px; margin-bottom:7px;">
        <div style="display:flex; align-items:center; gap:12px;">
          <div style="border-radius:9999px; background:#000000; color:#FFFFFF; font-size:15px; font-weight:900; padding:4px 20px; text-transform:uppercase; letter-spacing:0.5px; flex-shrink:0;">
            01 • GRAPH WORKFLOW PIPELINE & RBAC GOVERNANCE
          </div>
          <div style="background:#EFF6FF; border:1.5px solid #BFDBFE; border-radius:9999px; padding:3px 16px; font-size:13.5px; font-weight:700; color:#1D4ED8;">
            Connected Pipeline: Citizen FIR Intake ➔ Multi-Chain Traversal ➔ Role-Based Action Dashboards ➔ VASP Debit Freeze
          </div>
        </div>
        <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:9999px; padding:3px 14px; font-size:11.5px; font-weight:800; color:#065F46;">
          SOVEREIGN AIR-GAPPED SCIF • ZERO FOREIGN DEPENDENCIES
        </div>
      </div>

      <!-- Interconnected Graph Pipeline Canvas (Height: ~605px) -->
      <div style="background:#F8FAFC; border:1.5px solid #CBD5E1; border-radius:12px; padding:10px 12px; display:flex; flex-direction:column; gap:8px; box-shadow:0 3px 10px rgba(15,23,42,0.03);">
        
        <!-- TIER A: 4-Node Sequential VDA Tracing Graph (Top Row, Height: ~182px) -->
        <div style="display:grid; grid-template-columns: 1fr 24px 1fr 24px 1.05fr 24px 1.1fr; align-items:center;">
          
          <!-- Node 1: Starting Point (NCRP FIR & UTDM Intake) -->
          <div class="graph-node" style="height:182px; border:2px solid #2563EB; border-top:5px solid #2563EB;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#2563EB;">STARTING POINT</span>
                <span style="font-size:10px; font-weight:800; color:#2563EB;">NODE 01</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">1. Citizen FIR & 1930 Intake</strong>
              <div style="font-size:11px; font-weight:700; color:#2563EB; margin-bottom:5px;">NCRP 1930 Portal • Victim UPI • UTDM Stream</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>Citizen FIR Intake:</strong> Ingestion of victim TX hashes & banking cyber complaints.</div>
                <div>• <strong>UPI-to-Crypto Link:</strong> Identifies fraudulent P2P on-ramp settlement logs.</div>
                <div>• <strong>UTDM Normalization:</strong> Canonical stream across Bitcoin, TRC-20, & Ethereum.</div>
              </div>
            </div>
            <div style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#1E40AF; display:flex; justify-content:space-between;">
              <span>Output Deliverable:</span>
              <span>Canonical UTDM Ingestion Event Stream</span>
            </div>
          </div>

          <!-- Connector 1 -->
          <div style="text-align:center; font-size:22px; color:#2563EB; font-weight:900;">➔</div>

          <!-- Node 2: Multi-Chain Ingestion & Tron Energy Decoder -->
          <div class="graph-node" style="height:182px; border:2px solid #D97706; border-top:5px solid #D97706;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#D97706;">DECODE & STREAM</span>
                <span style="font-size:10px; font-weight:800; color:#D97706;">NODE 02</span>
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
          <div style="text-align:center; font-size:22px; color:#7D4698; font-weight:900;">➔</div>

          <!-- Node 3: Degree-Bounded BFS Graph Traversal Engine -->
          <div class="graph-node" style="height:182px; border:2px solid #7D4698; border-top:5px solid #7D4698;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#7D4698;">RUST BFS GRAPH</span>
                <span style="font-size:10px; font-weight:800; color:#7D4698;">NODE 03</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">3. Rust BFS Graph Traversal</strong>
              <div style="font-size:11px; font-weight:700; color:#7D4698; margin-bottom:5px;">Zero-Allocation Rust Core • 5 Mule Hops</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>Volume Entropy Pruning:</strong> Eliminates 99.4% insignificant dust & splits.</div>
                <div>• <strong>5-Hop Mule Traversal:</strong> Blazing-fast BFS traversal in &lt;180s without blowup.</div>
                <div>• <strong>VASP Hot-Wallet Sweep:</strong> Isolates terminal exchange deposit clusters.</div>
              </div>
            </div>
            <div style="background:#F5F3FF; border:1px solid #DDD6FE; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#6B21A8; display:flex; justify-content:space-between;">
              <span>Traversal Speed:</span>
              <span>5 Mule Hops in &lt; 180s (99.4% Noise Pruned)</span>
            </div>
          </div>

          <!-- Connector 3 -->
          <div style="text-align:center; font-size:22px; color:#059669; font-weight:900;">➔</div>

          <!-- Node 4: 4-Pillar Algorithmic Scoring Engine -->
          <div class="graph-node" style="height:182px; border:2px solid #059669; border-top:5px solid #059669;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:3px;">
                <span class="node-tag" style="background:#059669;">ALGORITHMIC SCORING</span>
                <span style="font-size:10px; font-weight:800; color:#059669;">NODE 04</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900; line-height:1.2;">4. 4-Pillar Algorithmic Score</strong>
              <div style="font-size:11px; font-weight:700; color:#059669; margin-bottom:5px;">Mathematical Multi-Factor Fusion • 0-1.0 Score</div>
              <div style="font-size:11.5px; color:#334155; line-height:1.36;">
                <div>• <strong>Temporal Velocity (30%):</strong> Microsecond fund flight timing through mules.</div>
                <div>• <strong>Balance Drain (25%):</strong> Sweep ratio emptying wallet in single TX.</div>
                <div>• <strong>Topology & Energy (45%):</strong> Fan-in density & shared energy sponsor.</div>
              </div>
            </div>
            <div style="background:#ECFDF5; border:1px solid #A7F3D0; border-radius:4px; padding:2.5px 6px; font-size:10.5px; font-weight:800; color:#065F46; display:flex; justify-content:space-between;">
              <span>Explainable Math:</span>
              <span>Definitive 0-1.0 Attribution (Zero AI Hallucination)</span>
            </div>
          </div>

        </div>

        <!-- Flow Transition Ribbon to RBAC Tier -->
        <div style="background:linear-gradient(90deg, #1E293B 0%, #0F172A 50%, #1E293B 100%); color:#FFFFFF; border-radius:6px; padding:3px 12px; font-size:11px; font-weight:800; text-align:center; letter-spacing:0.8px; display:flex; align-items:center; justify-content:center; gap:8px;">
          <span>▼ PIPELINE OUTPUT INGESTED INTO ROLE-BASED ACCESS CONTROL (RBAC) OPERATIONAL TIERS (AUTHENTIC LEA WORKSPACES) ▼</span>
        </div>

        <!-- TIER B: Role-Based Access Control (RBAC) Units (3 Distinct Roles & Specialized Dashboards, Height: ~285px) -->
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:12px;">
          
          <!-- Node 5: RBAC Role 1 - Desk IO / FIR Intake Officer -->
          <div class="rbac-card" style="height:285px; border:2px solid #0284C7; border-top:5px solid #0284C7;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="node-tag" style="background:#0284C7;">RBAC ROLE 01 • DESK IO</span>
                <span style="font-size:10.5px; font-weight:800; background:#E0F2FE; color:#0369A1; padding:1.5px 6px; border-radius:3px;">NCRP 1930 PORTAL</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900;">FIR Intake & Rapid Response IO</strong>
              <div style="font-size:11px; color:#64748B; margin-bottom:6px;">Target Persona: Station Cyber Desk Officer / First Responder</div>
              
              <!-- 4 Distinct Dashboard Tabs/Features -->
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:6px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 1: 1930 INTAKE</span>
                  <div><strong>Golden Hour Rapid Intake:</strong> Auto-validates victim TX hashes from NCRP.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 2: SEED TAGGER</span>
                  <div><strong>Victim Wallet Isolation:</strong> Immediately tags scam deposit address.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 3: HOP RADAR</span>
                  <div><strong>Live Mule Hop Counter:</strong> Tracks hops traveled in real-time.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#E0F2FE; color:#0369A1; border:1px solid #BAE6FD;">TAB 4: PRE-FREEZE</span>
                  <div><strong>Emergency Freeze Staging:</strong> Pre-stages debit freeze before off-ramp.</div>
                </div>
              </div>
            </div>

            <div style="background:#F0F9FF; border:1px solid #BAE6FD; border-radius:4px; padding:3px 7px; font-size:10.5px; font-weight:800; color:#0284C7; display:flex; justify-content:space-between;">
              <span>Operational Guarantee:</span>
              <span>Golden-Hour Interception within &lt;15 Mins of Filing</span>
            </div>
          </div>

          <!-- Node 6: RBAC Role 2 - Forensic Blockchain Investigator -->
          <div class="rbac-card" style="height:285px; border:2px solid #4F46E5; border-top:5px solid #4F46E5;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="node-tag" style="background:#4F46E5;">RBAC ROLE 02 • FORENSIC INVESTIGATOR</span>
                <span style="font-size:10.5px; font-weight:800; background:#EEF2FF; color:#4338CA; padding:1.5px 6px; border-radius:3px;">REACT 18 WEBGL HUD</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900;">Forensic Blockchain Investigator</strong>
              <div style="font-size:11px; color:#64748B; margin-bottom:6px;">Target Persona: State / Central Cyber Cell Blockchain Investigator</div>
              
              <!-- 4 Distinct Dashboard Tabs/Features -->
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:6px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 1: PEELING TREE</span>
                  <div><strong>WebGL Peeling Canvas:</strong> Visualizes peel chains, splits & exchange sweeps.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 2: VASP DIRECTORY</span>
                  <div><strong>25+ Registered CASPs:</strong> Instant hot-wallet KYC identification.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 3: SCORE EXPLAINER</span>
                  <div><strong>4-Pillar Math Breakdown:</strong> Inspects weights for court admissibility.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#EEF2FF; color:#4338CA; border:1px solid #C7D2FE;">TAB 4: BRIDGE TRACKER</span>
                  <div><strong>Cross-Chain Telemetry:</strong> Unmasks THORChain, Stargate & mixers.</div>
                </div>
              </div>
            </div>

            <div style="background:#EEF2FF; border:1px solid #C7D2FE; border-radius:4px; padding:3px 7px; font-size:10.5px; font-weight:800; color:#4338CA; display:flex; justify-content:space-between;">
              <span>Operational Guarantee:</span>
              <span>Complete Peeling Tree De-Obfuscation to Terminal VASP</span>
            </div>
          </div>

          <!-- Node 7: RBAC Role 3 - Supervisory SP & Nodal Freeze Officer -->
          <div class="rbac-card" style="height:285px; border:2px solid #DC2626; border-top:5px solid #DC2626;">
            <div>
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
                <span class="node-tag" style="background:#DC2626;">RBAC ROLE 03 • NODAL SP</span>
                <span style="font-size:10.5px; font-weight:800; background:#FEF2F2; color:#991B1B; padding:1.5px 6px; border-radius:3px;">SAHYOG FREEZE PORTAL</span>
              </div>
              <strong style="font-size:15px; color:#0F172A; display:block; font-weight:900;">Supervisory SP & Freeze Authority</strong>
              <div style="font-size:11px; color:#64748B; margin-bottom:6px;">Target Persona: Nodal SP / Designated Authority under Sec 106/107 BNSS</div>
              
              <!-- 4 Distinct Dashboard Tabs/Features -->
              <div style="display:flex; flex-direction:column; gap:4.5px; margin-bottom:6px;">
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 1: SAHYOG DISPATCH</span>
                  <div><strong>Automated Freeze Transmission:</strong> Dispatches notices to VASPs in &lt;8 mins.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 2: BNSS NOTICES</span>
                  <div><strong>Sec 106/107 & Sec 94 Order:</strong> Auto-populates statutory freeze summons.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 3: COMPLIANCE SLA</span>
                  <div><strong>VASP Acknowledgment Tracker:</strong> Live status of frozen crypto assets.</div>
                </div>
                <div class="rbac-tab-item">
                  <span class="rbac-tab-pill" style="background:#FEF2F2; color:#991B1B; border:1px solid #FECACA;">TAB 4: HSM CRYPTO SEAL</span>
                  <div><strong>FIPS 140-3 Attestation:</strong> Dual-signed SHA-256 Merkle chain for courts.</div>
                </div>
              </div>
            </div>

            <div style="background:#FEF2F2; border:1px solid #FECACA; border-radius:4px; padding:3px 7px; font-size:10.5px; font-weight:800; color:#B91C1C; display:flex; justify-content:space-between;">
              <span>Operational Guarantee:</span>
              <span>Debit Freeze Dispatched to VASP in &lt; 8 Minutes</span>
            </div>
          </div>

        </div>

        <!-- TIER C: Node 8 - Final Prosecution Output & Sovereign Gateway Strip (Height: ~40px) -->
        <div style="background:linear-gradient(90deg, #1E1B4B 0%, #1E3A8A 50%, #064E3B 100%); border-radius:6px; padding:6px 14px; display:flex; align-items:center; justify-content:space-between; color:#FFFFFF;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="background:#FACC15; color:#0F172A; font-size:10.5px; font-weight:900; padding:2px 7px; border-radius:3px;">NODE 08 • FINAL ARTIFACT</span>
            <strong style="font-size:12.5px; letter-spacing:0.5px;">AUTOMATED SAHYOG FREEZE DISPATCH & SEC 106/107 BNSS DEBIT FREEZE NOTICE</strong>
          </div>
          <div style="display:flex; gap:16px; font-size:11.5px; font-weight:700;">
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
        
        <!-- Domain 1: Multi-Chain Ingestion -->
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

        <!-- Domain 4: Sovereign Security & LEA Interfaces -->
        <div class="arch-domain-card" style="height:145px; border-left:4px solid #DC2626;">
          <div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:2px;">
              <strong style="font-size:13.5px; color:#0F172A; font-weight:900;">Sovereign Security & LEA HUD</strong>
              <span style="font-size:10px; font-weight:800; background:#FEF2F2; color:#991B1B; padding:1.5px 5px; border-radius:3px;">BNSS 106/107</span>
            </div>
            <div style="font-size:11px; color:#334155; line-height:1.3; margin-bottom:4px;">
              WebGL transaction peeling visualizer, mobile freeze app, and automated MHA SAHYOG VASP debit freeze dispatcher.
            </div>
            <div style="font-size:10.5px; font-weight:800; color:#B91C1C; background:#FEF2F2; padding:2px 5px; border-radius:3px; margin-bottom:5px;">
              Specs: &lt; 8 Mins to VASP Debit Freeze • FIU-IND 25+ CASP Sync
            </div>
          </div>
          <div>
            <div style="font-size:10px; font-weight:800; color:#64748B; text-transform:uppercase; margin-bottom:3px;">Technologies & Libraries:</div>
            <div style="display:flex; flex-wrap:wrap; gap:3px;">
              <span class="tech-pill">React 18 WebGL</span>
              <span class="tech-pill">TypeScript</span>
              <span class="tech-pill">Flutter 3</span>
              <span class="tech-pill">SAHYOG API</span>
              <span class="tech-pill">FIPS HSM</span>
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
</html>`;
'''

# Find the start of case 3 and case 4
pattern = re.compile(r'    case 3:\s*\n      return `<!DOCTYPE html>.*?</html>`;\s*\n\s*case 4:', re.DOTALL)
match = pattern.search(content)
if not match:
    # Try finding by substring
    c3_pos = content.find('case 3:')
    c4_pos = content.find('case 4:')
    print(f"Found case 3 at {c3_pos}, case 4 at {c4_pos}")
    if c3_pos != -1 and c4_pos != -1:
        new_content = content[:c3_pos] + chakra_case_3.strip() + "\n\n    " + content[c4_pos:]
        with open(r'c:\Users\Deepak Sharma\OneDrive\Desktop\SIH\scripts\engine\generate_chakra_slides.mjs', 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Updated Chakra case 3 successfully via positions!")
    else:
        print("Error: Could not locate case 3 or case 4!")
else:
    new_content = content[:match.start()] + chakra_case_3 + "\n\n    case 4:" + content[match.end():]
    with open(r'c:\Users\Deepak Sharma\OneDrive\Desktop\SIH\scripts\engine\generate_chakra_slides.mjs', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Updated Chakra case 3 successfully via regex!")
