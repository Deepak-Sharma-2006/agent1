import React from "react";
import type { FullCaseDossier, ActiveInvestigationStore } from "../types";
import type { TabKey } from "./Navigation";
import {
  FileText,
  UserCheck,
  ShieldCheck,
  Key,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Lock,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Radio,
  Share2,
  MessageSquare,
  Award
} from "lucide-react";

interface CaseOverviewProps {
  dossier: FullCaseDossier;
  store: ActiveInvestigationStore;
  onNavigate: (tab: TabKey) => void;
  onResetProgress: () => void;
  onResolveAll: () => void;
}

export const CaseOverview: React.FC<CaseOverviewProps> = ({
  dossier,
  store,
  onNavigate,
  onResetProgress,
  onResolveAll
}) => {
  const { case_metadata, attributed_subject, threat_personas, pgp_key, forensic_merkle_tree } = dossier;

  const completedCount = [
    store.progress.step1_recon,
    store.progress.step2_graph,
    store.progress.step3_stylometry,
    store.progress.step4_confidence
  ].filter(Boolean).length;

  const progressPercent = (completedCount / 4) * 100;
  const isAllResolved = completedCount === 4;

  const originIp =
    store.engine1ScanResult?.resolved_origin?.ip ||
    store.engine1ScanResult?.mod_status_ip_leak ||
    "103.152.18.42";
  const originLocation =
    store.engine1ScanResult?.resolved_origin?.datacenter_location || "Navi Mumbai, Maharashtra";
  const originIsp =
    store.engine1ScanResult?.resolved_origin?.isp || "Excitel Broadband Pvt Ltd";

  return (
    <div className="gov-dossier-workspace">
      {/* 0. Investigation Lifecycle & Phase Progression Bar */}
      <section className="gov-section-container" style={{ borderLeft: "4px solid var(--gov-navy)" }}>
        <div className="gov-section-header">
          <div className="gov-section-title">
            <Sparkles size={16} color="var(--gov-gold-dark)" />
            <span>Operational Investigation Lifecycle Tracker</span>
          </div>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              type="button"
              className="gov-btn-secondary"
              onClick={onResetProgress}
              title="Reset case to initial intake report"
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              <RotateCcw size={12} />
              Reset to Cold Intake (Demo)
            </button>
            <button
              type="button"
              className="gov-btn-primary"
              onClick={onResolveAll}
              title="Fast-forward all 4 forensic engines to solved state"
              style={{ fontSize: "11px", padding: "4px 10px" }}
            >
              <CheckCircle2 size={12} />
              Fast-Forward All Engines (Attributed)
            </button>
          </div>
        </div>

        <div className="gov-section-body" style={{ padding: "14px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--gov-text-heading)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Investigation Phase: {completedCount} of 4 Engines Resolved ({progressPercent.toFixed(0)}%)
            </span>
            <span className={`gov-tag ${isAllResolved ? "gov-tag-success" : "gov-tag-warning"}`}>
              {isAllResolved ? "CASE FULLY ATTRIBUTED (HIGH CERTAINTY)" : "ACTIVE FORENSIC CORRELATION"}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: "6px", background: "var(--gov-border)", borderRadius: "3px", overflow: "hidden", marginBottom: "14px" }}>
            <div
              style={{
                height: "100%",
                width: `${progressPercent}%`,
                background: isAllResolved ? "var(--gov-green)" : "var(--gov-navy)",
                transition: "width 0.4s ease"
              }}
            />
          </div>

          {/* 4 Engine Lifecycle Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
            {/* Step 1: Tor Recon */}
            <div
              onClick={() => onNavigate("engine1")}
              style={{
                border: "1px solid var(--gov-border)",
                padding: "10px 12px",
                background: store.progress.step1_recon ? "#F0FDF4" : "var(--gov-surface-subtle)",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gov-navy)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Radio size={13} /> Step 2: Tor Recon
                </span>
                {store.progress.step1_recon ? (
                  <CheckCircle2 size={14} color="var(--gov-green)" />
                ) : (
                  <span style={{ fontSize: "10px", color: "var(--gov-text-muted)", fontWeight: 600 }}>[PENDING]</span>
                )}
              </div>
              <div style={{ fontSize: "11px", color: "var(--gov-text-body)" }}>
                {store.progress.step1_recon
                  ? `${store.engine1ScanResult?.mod_status_ip_leak ? "Origin IP Leaked" : "Hardened Host Probed"} (${originLocation.split(",")[0]})`
                  : "Awaiting mod_status probe"}
              </div>
            </div>

            {/* Step 2: Knowledge Graph & Blockchain */}
            <div
              onClick={() => onNavigate("engine2")}
              style={{
                border: "1px solid var(--gov-border)",
                padding: "10px 12px",
                background: store.progress.step2_graph ? "#F0FDF4" : "var(--gov-surface-subtle)",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gov-navy)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Share2 size={13} /> Step 3: Entity Graph
                </span>
                {store.progress.step2_graph ? (
                  <CheckCircle2 size={14} color="var(--gov-green)" />
                ) : (
                  <span style={{ fontSize: "10px", color: "var(--gov-text-muted)", fontWeight: 600 }}>[PENDING]</span>
                )}
              </div>
              <div style={{ fontSize: "11px", color: "var(--gov-text-body)" }}>
                {store.progress.step2_graph ? "CoinDCX Off-Ramp Identified" : "Awaiting multi-hop BFS trace"}
              </div>
            </div>

            {/* Step 3: Stylometry */}
            <div
              onClick={() => onNavigate("engine3")}
              style={{
                border: "1px solid var(--gov-border)",
                padding: "10px 12px",
                background: store.progress.step3_stylometry ? "#F0FDF4" : "var(--gov-surface-subtle)",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gov-navy)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <MessageSquare size={13} /> Step 4: Stylometry
                </span>
                {store.progress.step3_stylometry ? (
                  <CheckCircle2 size={14} color="var(--gov-green)" />
                ) : (
                  <span style={{ fontSize: "10px", color: "var(--gov-text-muted)", fontWeight: 600 }}>[PENDING]</span>
                )}
              </div>
              <div style={{ fontSize: "11px", color: "var(--gov-text-body)" }}>
                {store.progress.step3_stylometry ? "Hinglish Dialect Confirmed" : "Awaiting subword analysis"}
              </div>
            </div>

            {/* Step 4: Confidence Scorer */}
            <div
              onClick={() => onNavigate("engine4")}
              style={{
                border: "1px solid var(--gov-border)",
                padding: "10px 12px",
                background: store.progress.step4_confidence ? "#F0FDF4" : "var(--gov-surface-subtle)",
                borderRadius: "3px",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--gov-navy)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Award size={13} /> Step 5: Scorer
                </span>
                {store.progress.step4_confidence ? (
                  <CheckCircle2 size={14} color="var(--gov-green)" />
                ) : (
                  <span style={{ fontSize: "10px", color: "var(--gov-text-muted)", fontWeight: 600 }}>[PENDING]</span>
                )}
              </div>
              <div style={{ fontSize: "11px", color: "var(--gov-text-body)" }}>
                {store.progress.step4_confidence
                  ? `${store.engine4EvaluatedScore.toFixed(1)}% Court Admissible`
                  : "Awaiting signal evaluation"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Official Case Overview Docket (Form LE-01) - Intake Facts Always Grounded */}
      <section className="gov-section-container">
        <div className="gov-section-header">
          <div className="gov-section-title">
            <FileText size={16} />
            <span>Official Case Overview Docket (Form LE-01)</span>
          </div>
          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <span className="gov-tag gov-tag-alert">PRIORITY 1 // ACTIVE ACTION</span>
            <span className="gov-tag gov-tag-info">RESTRICTED - TECHINT</span>
          </div>
        </div>

        <div className="gov-section-body" style={{ padding: "16px 20px" }}>
          <table className="gov-docket-table">
            <tbody>
              <tr>
                <th className="table-label">Docket No.</th>
                <td className="table-value table-highlight">
                  {case_metadata.operation_codename} ({case_metadata.case_id})
                </td>
                <th className="table-label">Incident Timestamp</th>
                <td className="table-value">
                  2026-08-14 02:18:40 IST (Synchronized with NPLI atomic clock)
                </td>
              </tr>
              <tr>
                <th className="table-label">Target Critical Infrastructure</th>
                <td className="table-value">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Building2 size={14} color="var(--gov-navy)" />
                    <strong>{case_metadata.target_sector}</strong>
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gov-text-muted)" }}>
                    {case_metadata.initiating_agency} • {case_metadata.lead_division}
                  </div>
                </td>
                <th className="table-label">Statutory Basis</th>
                <td className="table-value">
                  <span className="gov-tag gov-tag-success">
                    {case_metadata.statutory_authority}
                  </span>
                </td>
              </tr>
              <tr>
                <th className="table-label">Extortion Demand</th>
                <td className="table-value" style={{ color: "var(--gov-red-dark)", fontWeight: 700 }}>
                  {case_metadata.financial_impact_inr}
                  <span style={{ fontSize: "11px", color: "var(--gov-text-muted)", marginLeft: "8px", fontWeight: "normal" }}>
                    ({(case_metadata.crypto_demands || []).map(d => `${d.amount} ${d.asset}`).join(" + ")})
                  </span>
                </td>
                <th className="table-label">Legal Status</th>
                <td className="table-value">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {isAllResolved ? (
                      <>
                        <CheckCircle2 size={14} color="var(--gov-green)" />
                        <span style={{ fontWeight: 600, color: "var(--gov-green-dark)" }}>
                          DE-ANONYMIZED — READY FOR STATUTORY PROCEEDINGS
                        </span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={14} color="var(--gov-gold-dark)" />
                        <span style={{ fontWeight: 600, color: "var(--gov-gold-dark)" }}>
                          UNDER ACTIVE FORENSIC INVESTIGATION ({completedCount}/4 ENGINES EXECUTED)
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <th className="table-label">Incident Summary</th>
                <td colSpan={3} className="table-value" style={{ lineHeight: "1.6" }}>
                  <strong>{case_metadata.threat_category}:</strong> Targeted data exfiltration and extortion ransomware attack threatening leak of 1.4 million confidential health records. Exfiltration vector exploited Tor v3 hidden service
                  and multi-hop Bitcoin unhosted mixing.
                  {isAllResolved ? (
                    <span style={{ color: "var(--gov-green-dark)", fontWeight: 600, marginLeft: "4px" }}>
                      De-anonymized via cross-engine correlation: origin server IP leak in {originLocation}, PGP master key match, and FIU-IND regulated domestic exchange KYC tie-back.
                    </span>
                  ) : (
                    <span style={{ color: "var(--gov-text-muted)", fontStyle: "italic", marginLeft: "4px" }}>
                      Accused attribution pending execution of forensic reconnaissance, graph traversal, and stylometric validation engines.
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="table-label">Merkle Integrity</th>
                <td colSpan={3} className="table-value">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "var(--font-mono)", fontSize: "12px" }}>
                    <Lock size={13} color="var(--gov-green-dark)" />
                    <span>MERKLE ROOT: <strong>{forensic_merkle_tree.merkle_root_sha256}</strong></span>
                    <span className="gov-tag gov-tag-success">FIPS 140-3 ATTESTED</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Primary Accused Attribution Record (Form LE-14) - Progressive Unlocking */}
      <section className="gov-section-container">
        <div className="gov-section-header">
          <div className="gov-section-title">
            <UserCheck size={16} />
            <span>Accused Intelligence & Attribution Record (Form LE-14)</span>
          </div>
          {isAllResolved ? (
            <span className="gov-tag gov-tag-success">
              IDENTITY GROUNDED (HIGH CERTAINTY)
            </span>
          ) : (
            <span className="gov-tag gov-tag-warning">
              PARTIAL ATTRIBUTION — EVIDENCE ACCUMULATION IN PROGRESS
            </span>
          )}
        </div>

        <div className="gov-section-body" style={{ padding: "16px 20px" }}>
          <table className="gov-docket-table">
            <tbody>
              <tr>
                <th className="table-label">Subject Legal Name</th>
                <td className="table-value" style={{ fontSize: "15px" }}>
                  {store.progress.step2_graph ? (
                    <span className="table-highlight" style={{ fontWeight: 800 }}>
                      {attributed_subject.legal_name}
                    </span>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--gov-text-muted)", fontStyle: "italic" }}>
                        [UNRESOLVED — PENDING GRAPH & KYC ATTRIBUTION]
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate("engine2")}
                        className="gov-btn-secondary"
                        style={{ fontSize: "10px", padding: "2px 8px" }}
                      >
                        Run Engine 2 <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                </td>
                <th className="table-label">Underground Aliases</th>
                <td className="table-value" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, color: "var(--gov-blue)" }}>
                  {store.progress.step2_graph ? (
                    `${attributed_subject.alias} (also known as ${threat_personas.map(p => p.handle).join(", ")})`
                  ) : (
                    <span>{threat_personas[0]?.handle || "Vikramaditya0x"} (additional personas pending correlation)</span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="table-label">Subject ID</th>
                <td className="table-value" style={{ fontFamily: "var(--font-mono)" }}>
                  {store.progress.step2_graph ? attributed_subject.subject_id : "[PENDING-RESOLUTION]"}
                </td>
                <th className="table-label">Age & Citizenship</th>
                <td className="table-value">
                  {store.progress.step2_graph ? (
                    `${attributed_subject.age} Years • ${attributed_subject.citizenship}`
                  ) : (
                    <span style={{ color: "var(--gov-text-muted)" }}>[RESTRICTED / UNKNOWN]</span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="table-label">Verified Address</th>
                <td className="table-value" style={{ fontWeight: 600 }}>
                  {store.progress.step2_graph ? (
                    attributed_subject.current_residence
                  ) : (
                    <span style={{ color: "var(--gov-text-muted)", fontStyle: "italic" }}>
                      [LOCKED — PENDING VASP / ISP SUBPOENA EVIDENCE]
                    </span>
                  )}
                </td>
                <th className="table-label">Technical Profile</th>
                <td className="table-value">
                  {store.progress.step3_stylometry ? (
                    attributed_subject.technical_sophistication
                  ) : (
                    <span style={{ color: "var(--gov-text-muted)" }}>
                      Threat Actor: Ransomware Extortion Specialist (Stylometry Pending)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="table-label">Clearnet Origin IP</th>
                <td className="table-value">
                  {store.progress.step1_recon ? (
                    <div>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontWeight: 700,
                          color: store.engine1ScanResult?.mod_status_ip_leak ? "var(--gov-red-dark)" : "var(--gov-navy)"
                        }}
                      >
                        {originIp}
                      </span>
                      <span style={{ fontSize: "11px", color: "var(--gov-text-muted)", marginLeft: "6px" }}>
                        ({originLocation} • {originIsp})
                      </span>
                      {store.engine1ScanResult?.mod_status_ip_leak ? (
                        <span className="gov-tag gov-tag-alert" style={{ marginLeft: "8px", fontSize: "10px" }}>
                          ORIGIN DE-ANONYMIZED
                        </span>
                      ) : (
                        <span className="gov-tag gov-tag-info" style={{ marginLeft: "8px", fontSize: "10px" }}>
                          HARDENED CONTROL PROBED
                        </span>
                      )}
                      {!store.engine1ScanResult?.mod_status_ip_leak && (
                        <div style={{ fontSize: "10.5px", color: "var(--gov-blue)", marginTop: "4px" }}>
                          ℹ️ Scientific negative control probe executed (Frankfurt baseline). Target remains unattributed. Switch to Case Threat Onion in Engine 1 to unmask Operation MAYAJAAL.
                        </div>
                      )}
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ color: "var(--gov-text-muted)", fontStyle: "italic" }}>
                        [UNRESOLVED — HIDDEN BEHIND TOR v3 CIRCUIT]
                      </span>
                      <button
                        type="button"
                        onClick={() => onNavigate("engine1")}
                        className="gov-btn-secondary"
                        style={{ fontSize: "10px", padding: "2px 8px" }}
                      >
                        Run Engine 1 <ArrowRight size={10} />
                      </button>
                    </div>
                  )}
                </td>
                <th className="table-label">Regulated Domestic VASP</th>
                <td className="table-value">
                  {store.progress.step2_graph ? (
                    <span><strong>CoinDCX</strong> (Account: <code>CDX-IN-9081245</code>, Aadhaar/PAN KYC Verified)</span>
                  ) : (
                    <span style={{ color: "var(--gov-text-muted)", fontStyle: "italic" }}>
                      [UNRESOLVED — PENDING MULTI-HOP BLOCKCHAIN TRACE]
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <th className="table-label">Admissibility Score</th>
                <td className="table-value">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "16px", fontWeight: 800, color: "var(--gov-navy)", fontFamily: "var(--font-mono)" }}>
                      {store.progress.step4_confidence
                        ? `${store.engine4EvaluatedScore.toFixed(1)}%`
                        : store.engine4EvaluatedScore > 0
                        ? `${store.engine4EvaluatedScore.toFixed(1)}%`
                        : progressPercent > 0
                        ? `${(progressPercent * 0.7).toFixed(1)}%`
                        : "0.0%"}
                    </span>
                    <span className={`gov-tag ${store.progress.step4_confidence ? "gov-tag-success" : "gov-tag-warning"}`}>
                      {store.progress.step4_confidence ? "DETERMINISTIC PROOF (HIGH CERTAINTY)" : "PROBABILISTIC / INCOMPLETE"}
                    </span>
                    {!store.progress.step4_confidence && (
                      <button
                        type="button"
                        onClick={() => onNavigate("engine4")}
                        className="gov-btn-secondary"
                        style={{ fontSize: "10px", padding: "2px 8px" }}
                      >
                        Evaluate Engine 4 <ArrowRight size={10} />
                      </button>
                    )}
                  </div>
                </td>
                <th className="table-label">Operational Status</th>
                <td className="table-value">
                  {isAllResolved ? (
                    <span className="gov-tag gov-tag-alert">
                      {attributed_subject.operational_status}
                    </span>
                  ) : (
                    <span className="gov-tag gov-tag-warning">
                      FORENSIC INQUIRY IN PROGRESS
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Underground Personas & Cryptographic Attestation Tables */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        {/* Annexure B1: Linked Darknet Forum Personas */}
        <section className="gov-section-container" style={{ margin: 0 }}>
          <div className="gov-section-header">
            <div className="gov-section-title">
              <ShieldCheck size={16} />
              <span>Annexure B-1: Darknet Forum Personas</span>
            </div>
            <span style={{ fontSize: "11px", color: "var(--gov-text-muted)", fontWeight: 600 }}>
              {store.progress.step2_graph ? `${threat_personas.length} VERIFIED HANDLES` : "1 UNCORRELATED HANDLE"}
            </span>
          </div>

          <div className="gov-section-body" style={{ padding: "12px 16px" }}>
            <table className="gov-docket-table">
              <thead>
                <tr>
                  <th>Handle</th>
                  <th>Platform</th>
                  <th>Reputation Score</th>
                  <th>Linguistic Profile</th>
                </tr>
              </thead>
              <tbody>
                {(store.progress.step2_graph ? threat_personas : [threat_personas[0]]).map((p) => (
                  <tr key={p.handle}>
                    <td style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--gov-navy)" }}>
                      {p.handle}
                    </td>
                    <td>{p.platform}</td>
                    <td>
                      <span className="gov-tag gov-tag-info">{p.reputation_score}</span>
                    </td>
                    <td style={{ fontSize: "12px", color: "var(--gov-text-body)" }}>
                      {store.progress.step3_stylometry ? p.actual_language_dialect : "Dialect Pending Analysis"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!store.progress.step2_graph && (
              <div style={{ fontSize: "11px", color: "var(--gov-text-muted)", marginTop: "8px", fontStyle: "italic" }}>
                * Additional handles (Chanakya_Zero, IndicCipher) correlated after Engine 2 graph traversal.
              </div>
            )}
          </div>
        </section>

        {/* Annexure B2: PGP Cryptographic Identity Anchor */}
        <section className="gov-section-container" style={{ margin: 0 }}>
          <div className="gov-section-header">
            <div className="gov-section-title">
              <Key size={16} />
              <span>Annexure B-2: PGP Master Key Anchor</span>
            </div>
            <span className={`gov-tag ${store.progress.step2_graph ? "gov-tag-success" : "gov-tag-warning"}`}>
              {store.progress.step2_graph ? "100% CRYPTOGRAPHIC ATTESTATION" : "UNBOUND KEY SIGNATURE"}
            </span>
          </div>

          <div className="gov-section-body" style={{ padding: "12px 16px" }}>
            <table className="gov-docket-table">
              <tbody>
                <tr>
                  <th className="table-label">Key Fingerprint</th>
                  <td className="table-value" colSpan={3} style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: "var(--gov-navy)" }}>
                    {pgp_key.fingerprint_formatted}
                  </td>
                </tr>
                <tr>
                  <th className="table-label">Email UID</th>
                  <td className="table-value" style={{ fontFamily: "var(--font-mono)", color: "var(--gov-blue)" }}>
                    {pgp_key.user_id}
                  </td>
                  <th className="table-label">Key Type</th>
                  <td className="table-value" style={{ fontFamily: "var(--font-mono)" }}>
                    {pgp_key.key_type}
                  </td>
                </tr>
                <tr>
                  <th className="table-label">Distribution Sources</th>
                  <td className="table-value" colSpan={3}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "12px" }}>
                      {(pgp_key.published_on || []).map((pub, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <CheckCircle2 size={13} color="var(--gov-green)" />
                          <span>{pub}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* 4. Operational Next Action Guide Banner */}
      <section className="gov-section-container" style={{ marginTop: "20px", borderLeft: "4px solid var(--gov-gold-dark)" }}>
        <div className="gov-section-body" style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--gov-gold-dark)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Forensic Examiner Workflow Directive
            </div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--gov-navy)", marginTop: "2px" }}>
              {!store.progress.step1_recon
                ? "Step 2 Next: Probe Tor Hidden Service for Apache mod_status Origin Leaks"
                : !store.progress.step2_graph
                ? "Step 3 Next: Synthesize Multi-Modal Knowledge Graph & Trace Bitcoin Off-Ramp"
                : !store.progress.step3_stylometry
                ? "Step 4 Next: Execute IndicBERT Stylometric & Diurnal IST Timezone Analysis"
                : !store.progress.step4_confidence
                ? "Step 5 Next: Evaluate Statutory Confidence Weights & Cap Safeguards"
                : "Step 6 Next: Generate Official Dual-Signed Section 63 BSA Court Certificate"}
            </div>
            <div style={{ fontSize: "11px", color: "var(--gov-text-muted)", marginTop: "2px" }}>
              {!store.progress.step1_recon
                ? "Target onion hidden service endpoints are pending automated sovereign reconnaissance."
                : !store.progress.step2_graph
                ? `Origin IP ${originIp} identified. Proceeding to multi-hop MICH blockchain clustering and KYC subpoena binding.`
                : !store.progress.step3_stylometry
                ? "Cryptographic and financial anchors grounded. Analyzing chat intercepts for Hinglish dialect markers."
                : !store.progress.step4_confidence
                ? "All primary signals gathered. Verifying court-admissible confidence threshold (≥85.0%)."
                : "All 4 forensic engines verified with high certainty. Certificate ready for digital signing."}
            </div>
          </div>

          <button
            type="button"
            className="gov-btn-primary"
            onClick={() => {
              if (!store.progress.step1_recon) onNavigate("engine1");
              else if (!store.progress.step2_graph) onNavigate("engine2");
              else if (!store.progress.step3_stylometry) onNavigate("engine3");
              else if (!store.progress.step4_confidence) onNavigate("engine4");
              else onNavigate("export");
            }}
            style={{ padding: "8px 16px", fontSize: "12px" }}
          >
            {!store.progress.step1_recon
              ? "Launch Step 2: Tor Recon (Engine 1)"
              : !store.progress.step2_graph
              ? "Launch Step 3: Entity Graph (Engine 2)"
              : !store.progress.step3_stylometry
              ? "Launch Step 4: Stylometry Lab (Engine 3)"
              : !store.progress.step4_confidence
              ? "Launch Step 5: Confidence Scorer (Engine 4)"
              : "Launch Step 6: Section 63 BSA Export"}
            <ArrowRight size={14} style={{ marginLeft: "4px" }} />
          </button>
        </div>
      </section>
    </div>
  );
};

