import React, { useState, useEffect } from "react";
import type { FullCaseDossier, BSA63Certificate, ActiveInvestigationStore, STIXBundle } from "../types";
import { apiService } from "../services/api";
import {
  FileText,
  Download,
  Copy,
  CheckCircle2,
  Share2,
  Shield,
  Clock,
  Printer
} from "lucide-react";

interface StatutoryExportModalProps {
  dossier: FullCaseDossier;
  store: ActiveInvestigationStore;
}

export const StatutoryExportModal: React.FC<StatutoryExportModalProps> = ({ dossier, store }) => {
  const [activeFormat, setActiveFormat] = useState<"bsa63" | "stix">("bsa63");
  const [bsaViewMode, setBsaViewMode] = useState<"formal" | "plaintext">("formal");
  const [certData, setCertData] = useState<BSA63Certificate | null>(null);
  const [stixData, setStixData] = useState<STIXBundle | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const evaluatedScore =
    store.engine4EvaluatedScore && store.engine4EvaluatedScore <= 1.0
      ? store.engine4EvaluatedScore * 100
      : (store.engine4EvaluatedScore || 0);

  const evaluatedTier = store.engine4ConfidenceTier || "UNRELIABLE";

  const isAdmissible =
    store.progress.step4_confidence &&
    evaluatedScore >= 85.0 &&
    store.engine4HasDeterministic;

  const originIpText = store.progress.step1_recon
    ? store.engine1ScanResult?.mod_status_ip_leak
      ? `${store.engine1ScanResult.mod_status_ip_leak} (${store.engine1ScanResult.resolved_origin?.datacenter_location || "Navi Mumbai Data Centre"})`
      : `${store.engine1ScanResult?.resolved_origin?.ip || "185.220.101.5"} (Control Probe / Hardened Tor Circuit — 0 Clearnet Leaks)`
    : "[UNRESOLVED — AWAITING STEP 2 TOR RECON SCAN]";

  const getDynamicPlaintext = () => {
    let text = certData?.certificate_plaintext || "";
    if (!text) return "Section 63 Certificate (Compiling...)";

    const scoreString = store.progress.step4_confidence
      ? `${evaluatedScore.toFixed(1)}% (${evaluatedTier} — ${
          isAdmissible
            ? "HIGH CERTAINTY - ADMISSIBLE AS PRIMARY EVIDENCE"
            : "ADVISORY LEAD ONLY - INADMISSIBLE AS SOLE EVIDENCE"
        })`
      : "0.0% (UNRESOLVED — AWAITING FORENSIC SIGNAL EVALUATION)";

    text = text.replace(
      /Composite Confidence:\s*95\.0%[^\n]*/g,
      `Composite Confidence:   ${scoreString}`
    );

    if (!store.progress.step2_graph) {
      text = text.replace(
        /Subject Attributed:[^\n]*/g,
        "Subject Attributed:     [UNRESOLVED — PENDING GRAPH ATTRIBUTION & VASP KYC REQUISITION]"
      );
      text = text.replace(
        /Physical Residence:[^\n]*/g,
        "Physical Residence:     [LOCKED — PENDING VASP / ISP SUBPOENA EVIDENCE]"
      );
    }

    if (!store.progress.step1_recon || !store.engine1ScanResult?.mod_status_ip_leak) {
      text = text.replace(
        /Leaf 02 \(Clearnet Origin IP Evidence\):[^\n]*/g,
        "Leaf 02 (Clearnet Origin IP Evidence): [NOT ESTABLISHED — TARGET HIDDEN / NO CLEARNET STATUS LEAKS]"
      );
    }

    if (!isAdmissible) {
      text =
        `================================================================================\n` +
        `[PROVISIONAL INVESTIGATION DRAFT — NOT ADMISSIBLE IN JUDICIAL PROCEEDINGS]\n` +
        `[STATUTORY CERTAINTY THRESHOLD (>=85.0% DETERMINISTIC) UNFULFILLED — CURRENT: ${evaluatedScore.toFixed(1)}%]\n` +
        `================================================================================\n\n` +
        text;
    }
    return text;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [bsaRes, stixRes] = await Promise.all([
          apiService.getBSA63Certificate(),
          apiService.getSTIXBundle()
        ]);
        setCertData(bsaRes);
        setStixData(stixRes);
      } catch (err) {
        console.warn("Using fallback local export serializer:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dossier]);

  const handleCopy = () => {
    const textToCopy =
      activeFormat === "bsa63"
        ? getDynamicPlaintext()
        : JSON.stringify(stixData, null, 2);

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const content = getDynamicPlaintext();
    const filename = `BSA63_CERTIFICATE_${dossier.case_metadata.case_id}.txt`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadStixJson = () => {
    const content = JSON.stringify(stixData, null, 2);
    const filename = `STIX21_BUNDLE_${dossier.case_metadata.case_id}.json`;
    const blob = new Blob([content], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrintCourtCertificate = () => {
    window.print();
  };

  return (
    <div className="gov-dossier-workspace">
      {/* 1. Format Selector Bar */}
      <section className="gov-section-container no-print">
        <div className="gov-section-header" style={{ flexWrap: "wrap", gap: "12px" }}>
          <div className="gov-section-title">
            <FileText size={16} />
            <span>Statutory Evidentiary Dispatch & Certificate Generation</span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              id="export-bsa63-tab-btn"
              className={activeFormat === "bsa63" ? "gov-btn-primary" : "gov-btn-secondary"}
              onClick={() => setActiveFormat("bsa63")}
            >
              <Shield size={14} />
              Section 63 BSA 2023 Certificate
            </button>
            <button
              id="export-stix-tab-btn"
              className={activeFormat === "stix" ? "gov-btn-primary" : "gov-btn-secondary"}
              onClick={() => setActiveFormat("stix")}
            >
              <Share2 size={14} />
              OASIS STIX 2.1 CTI Bundle
            </button>
          </div>
        </div>

        <div className="gov-section-body" style={{ padding: "14px 20px" }}>
          <p style={{ fontSize: "12px", color: "var(--gov-text-body)", lineHeight: "1.6" }}>
            {activeFormat === "bsa63"
              ? "Generates court-admissible dual-signed electronic evidence certificate fulfilling Section 63(4)(a) (Lawful Ingestion Custodian) and Section 63(4)(b)-(c) (Technical Forensic Examiner) under the Bharatiya Sakshya Adhiniyam, 2023 for submission before designated Special Cyber/Sessions Courts."
              : "Generates standardized OASIS STIX 2.1 Cyber Threat Intelligence JSON bundle conforming to CERT-In, NCIIPC, and Indian Cybercrime Coordination Centre (I4C) machine-to-machine exchange protocols."}
          </p>
        </div>
      </section>

      {/* Dynamic Statutory Certification Banner */}
      {isAdmissible ? (
        <div
          className="no-print"
          style={{
            background: "#F0FDF4",
            border: "1px solid #86EFAC",
            borderRadius: "3px",
            padding: "12px 18px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <CheckCircle2 size={22} color="#16a34a" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#166534", textTransform: "uppercase" }}>
              Statutorily Certified Court Electronic Evidence Package — BSA 2023 Section 63 Compliant
            </div>
            <div style={{ fontSize: "11.5px", color: "#14532D", marginTop: "2px", lineHeight: "1.5" }}>
              Composite Admissibility Score: <strong>{evaluatedScore.toFixed(1)}% ({evaluatedTier})</strong>. Satisfies Section 63(4)(a) lawful custody, Section 63(4)(b)-(c) examiner technical certificate, and FIPS 180-4 SHA-256 Merkle chain verification.
            </div>
          </div>
        </div>
      ) : (
        <div
          className="no-print"
          style={{
            background: "#FEF2F2",
            border: "1px solid #FCA5A5",
            borderRadius: "3px",
            padding: "12px 18px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            gap: "12px"
          }}
        >
          <Shield size={22} color="#DC2626" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#991B1B", textTransform: "uppercase" }}>
              Provisional Investigation Draft — Actions Locked (Rule 13 Fail-Closed)
            </div>
            <div style={{ fontSize: "11.5px", color: "#7F1D1D", marginTop: "2px", lineHeight: "1.5" }}>
              Composite Admissibility Score: <strong>{evaluatedScore.toFixed(1)}%</strong>. Official submission and export under Section 63 BSA 2023 requires composite certainty ≥ 85.0% with deterministic proof. Export triggers remain fail-closed and disabled until all prerequisite engines are resolved.
            </div>
          </div>
        </div>
      )}

      {/* 2. Certificate Viewer & Export Controls Section */}
      <section className="gov-section-container">
        <div className="gov-section-header no-print" style={{ flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Clock size={16} color="var(--gov-navy)" />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gov-navy)", fontWeight: 700 }}>
              CSIR-NPL Traceable Atomic Clock Reference (IST Synchronization Active)
            </span>
          </div>

          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {activeFormat === "bsa63" ? (
              <>
                <div style={{ display: "flex", border: "1px solid var(--gov-border)", borderRadius: "2px", overflow: "hidden", marginRight: "6px" }}>
                  <button
                    className={bsaViewMode === "formal" ? "gov-btn-primary" : "gov-btn-secondary"}
                    style={{ padding: "4px 10px", fontSize: "11px" }}
                    onClick={() => setBsaViewMode("formal")}
                  >
                    Court Affidavit
                  </button>
                  <button
                    className={bsaViewMode === "plaintext" ? "gov-btn-primary" : "gov-btn-secondary"}
                    style={{ padding: "4px 10px", fontSize: "11px" }}
                    onClick={() => setBsaViewMode("plaintext")}
                  >
                    Raw Text
                  </button>
                </div>

                <button
                  id="copy-export-btn"
                  className="gov-btn-secondary"
                  onClick={handleCopy}
                  disabled={!isAdmissible}
                  style={{ opacity: isAdmissible ? 1 : 0.5, cursor: isAdmissible ? "pointer" : "not-allowed" }}
                  title={!isAdmissible ? "Locked: Statutory certainty threshold (>=85.0% deterministic proof) unfulfilled" : undefined}
                >
                  {copied ? <CheckCircle2 size={14} color="var(--gov-green)" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Plaintext"}
                </button>

                <button
                  id="download-bsa-txt-btn"
                  className="gov-btn-secondary"
                  onClick={handleDownloadTxt}
                  disabled={!isAdmissible}
                  style={{ opacity: isAdmissible ? 1 : 0.5, cursor: isAdmissible ? "pointer" : "not-allowed" }}
                  title={!isAdmissible ? "Locked: Statutory certainty threshold (>=85.0% deterministic proof) unfulfilled" : undefined}
                >
                  <Download size={14} />
                  Download Plaintext (.txt)
                </button>

                <button
                  id="print-court-pdf-btn"
                  className="gov-btn-primary"
                  onClick={handlePrintCourtCertificate}
                  disabled={!isAdmissible}
                  style={{ opacity: isAdmissible ? 1 : 0.5, cursor: isAdmissible ? "pointer" : "not-allowed" }}
                  title={!isAdmissible ? "Locked: Statutory certainty threshold (>=85.0% deterministic proof) unfulfilled" : undefined}
                >
                  <Printer size={14} />
                  Print / Save Court PDF
                </button>
              </>
            ) : (
              <>
                <button
                  id="copy-stix-btn"
                  className="gov-btn-secondary"
                  onClick={handleCopy}
                  disabled={!isAdmissible}
                  style={{ opacity: isAdmissible ? 1 : 0.5, cursor: isAdmissible ? "pointer" : "not-allowed" }}
                  title={!isAdmissible ? "Locked: Threat intelligence bundle requires complete attribution" : undefined}
                >
                  {copied ? <CheckCircle2 size={14} color="var(--gov-green)" /> : <Copy size={14} />}
                  {copied ? "Copied JSON" : "Copy STIX JSON"}
                </button>

                <button
                  id="download-stix-json-btn"
                  className="gov-btn-primary"
                  onClick={handleDownloadStixJson}
                  disabled={!isAdmissible}
                  style={{ opacity: isAdmissible ? 1 : 0.5, cursor: isAdmissible ? "pointer" : "not-allowed" }}
                  title={!isAdmissible ? "Locked: Threat intelligence bundle requires complete attribution" : undefined}
                >
                  <Download size={14} />
                  Download OASIS STIX 2.1 Bundle (.json)
                </button>
              </>
            )}
          </div>
        </div>

        <div className="gov-section-body" style={{ padding: "20px" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "var(--gov-text-muted)", fontFamily: "var(--font-mono)" }}>
              Compiling cryptographic Merkle root and digital signatures...
            </div>
          ) : activeFormat === "bsa63" ? (
            bsaViewMode === "formal" ? (
              /* Formal Court-Admissible Affidavit Layout */
              <div className="court-certificate-document" style={{ position: "relative" }}>
                {!isAdmissible && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      pointerEvents: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: 0.12,
                      transform: "rotate(-30deg)",
                      fontSize: "44px",
                      fontWeight: 900,
                      color: "#DC2626",
                      textTransform: "uppercase",
                      letterSpacing: "4px",
                      zIndex: 15
                    }}
                  >
                    PROVISIONAL DRAFT • NOT ADMISSIBLE IN COURT
                  </div>
                )}

                <div className="court-cert-header">
                  <img
                    src="/ntro_logo.png"
                    alt="NTRO Official Emblem"
                    style={{ width: "80px", height: "auto", display: "block", margin: "0 auto 10px auto" }}
                  />
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1E293B", letterSpacing: "0.5px" }}>
                    राष्ट्रीय तकनीकी अनुसंधान संगठन | NATIONAL TECHNICAL RESEARCH ORGANISATION
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "#475569", textTransform: "uppercase" }}>
                    भारत सरकार | GOVERNMENT OF INDIA
                  </div>
                  <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                    साइबर आसूचना एवं प्रौद्योगिकी केंद्र (CITC) | Cyber Intelligence & Technology Centre
                  </div>

                  <div style={{ marginTop: "16px", borderTop: "2px solid #0F172A", paddingTop: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#0F172A" }}>
                      THE SCHEDULE [See Section 63(4)(c)]
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: "bold", color: "#1E3A8A" }}>
                      BHARATIYA SAKSHYA ADHINIYAM, 2023 (ACT NO. 47 OF 2023)
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "bold", color: "#0F172A", marginTop: "4px" }}>
                      CERTIFICATE FOR ADMISSIBILITY OF ELECTRONIC EVIDENCE IN COURT PROCEEDINGS
                    </div>
                  </div>
                </div>

                {/* Court Docket Metadata */}
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "20px", fontSize: "11px", border: "1px solid #CBD5E1" }}>
                  <tbody>
                    <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                      <td style={{ padding: "6px 10px", fontWeight: "bold", width: "25%", color: "#334155" }}>COURT JURISDICTION:</td>
                      <td style={{ padding: "6px 10px", width: "25%" }}>Designated Special Cyber / NIA Court</td>
                      <td style={{ padding: "6px 10px", fontWeight: "bold", width: "25%", color: "#334155" }}>CASE DOCKET NUMBER:</td>
                      <td style={{ padding: "6px 10px", width: "25%", fontFamily: "var(--font-mono)", fontWeight: "bold" }}>
                        {dossier.case_metadata.case_id}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                      <td style={{ padding: "6px 10px", fontWeight: "bold", color: "#334155" }}>OPERATION CODENAME:</td>
                      <td style={{ padding: "6px 10px" }}>{dossier.case_metadata.operation_codename}</td>
                      <td style={{ padding: "6px 10px", fontWeight: "bold", color: "#334155" }}>STATUTORY POWER:</td>
                      <td style={{ padding: "6px 10px" }}>Secs 69 & 70A, IT Act, 2000</td>
                    </tr>
                    <tr style={{ borderBottom: "1px solid #E2E8F0", background: "#F8FAFC" }}>
                      <td style={{ padding: "6px 10px", fontWeight: "bold", color: "#334155" }}>CERTIFICATE REF NO:</td>
                      <td style={{ padding: "6px 10px", fontFamily: "var(--font-mono)" }}>NTRO/BSA63/2026/0918-B82C</td>
                      <td style={{ padding: "6px 10px", fontWeight: "bold", color: "#334155" }}>DATE OF ISSUANCE:</td>
                      <td style={{ padding: "6px 10px" }}>18 September 2026 (IST)</td>
                    </tr>
                  </tbody>
                </table>

                {/* PART A - Custodian */}
                <div className="court-part-box">
                  <div className="court-part-title">
                    <span>PART A: CERTIFICATE BY PERSON PRODUCING / IN LAWFUL CONTROL OF THE SYSTEM</span>
                    <span style={{ fontSize: "10px", color: "var(--gov-navy)", fontWeight: 600 }}>Sec. 63(4)(a) BSA 2023</span>
                  </div>
                  <div style={{ fontSize: "11px", lineHeight: "1.6", color: "#1E293B" }}>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>1. Particulars of Certifying Officer:</strong><br />
                      Name: <strong>Dr. V. K. Ramanathan, Sc 'G'</strong> | Designation: <strong>Director, Cyber Intelligence & Technology Centre (CITC)</strong><br />
                      Agency: National Technical Research Organisation (NTRO), Government of India, New Delhi.
                    </p>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>2. Description of Electronic Records Produced:</strong><br />
                      (i) Tor v3 Hidden Service HTTP traffic frame captures and Apache mod_status memory logs.<br />
                      (ii) De-anonymized Clearnet Origin IP ({originIpText}) network packet records.<br />
                      (iii) Multi-Input Common-Spend (MICH) Bitcoin raw transactions & Tron TRC-20 USDT smart contract event traces.<br />
                      (iv) Cryptographic PGP RSA-4096 Public Key Blocks published on open key servers.
                    </p>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>3. System Identifier & Computing Environment:</strong><br />
                      Ingestion Enclave: <code>BHEDAK-HPC-ENCLAVE-NODE-04</code> (Hardware UUID: <code>5A92-F01B-942C-E871</code>), operating on Sovereign Hardened Enterprise Linux in FIPS 140-3 validated mode under Project BHEDAK (Bridging Hidden-networks to Evidence for Darknet Actor Knowledge).
                    </p>
                    <p style={{ margin: "0 0 12px 0", background: "#FFFFFF", padding: "8px 12px", border: "1px dashed #CBD5E1" }}>
                      <strong>4. Statutory Affirmation of Lawful Control & Regular Operation:</strong><br />
                      "I hereby solemnly declare and certify that the automated darknet crawler, passive traffic ingestion nodes, and property graph analytics cluster of Project BHEDAK were under my lawful control and official custody throughout the active observation window (14-Sep-2026 to 18-Sep-2026). The server clusters and cryptographic storage appliances operated normally and without malfunction or security breach during the entire evidence generation process."
                    </p>
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "12px", textAlign: "right" }}>
                      <div>
                        <div style={{ fontStyle: "italic", fontFamily: "cursive", fontSize: "14px", color: "#1E3A8A" }}>V.K. Ramanathan</div>
                        <div style={{ fontWeight: "bold", fontSize: "11px" }}>Dr. V. K. Ramanathan, Sc 'G'</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>Director, Cyber Intelligence & Technology Centre (CITC)</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>National Technical Research Organisation, New Delhi</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PART B - Expert */}
                <div className="court-part-box">
                  <div className="court-part-title">
                    <span>PART B: TECHNICAL CERTIFICATE BY CYBER FORENSIC EXAMINER / EXPERT</span>
                    <span style={{ fontSize: "10px", color: "var(--gov-navy)", fontWeight: 600 }}>Sec. 63(4)(b) & (c) BSA 2023</span>
                  </div>
                  <div style={{ fontSize: "11px", lineHeight: "1.6", color: "#1E293B" }}>
                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>1. Particulars of Forensic Expert:</strong><br />
                      Name: <strong>Rajeshwari Nair, Forensic Scientist 'E'</strong> | Designation: <strong>Lead Examiner, Sovereign Digital Forensics Division</strong><br />
                      Agency: National Technical Research Organisation (NTRO), New Delhi. Accreditation: Government Cyber Forensic Technical Examiner.
                    </p>

                    <p style={{ margin: "0 0 6px 0" }}>
                      <strong>2. Cryptographic Hash Values of Produced Electronic Records (FIPS 180-4 SHA-256):</strong>
                    </p>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "10px", fontSize: "10px", border: "1px solid #CBD5E1", background: "#FFFFFF" }}>
                      <thead>
                        <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #CBD5E1" }}>
                          <th style={{ padding: "4px 8px", textAlign: "left" }}>Leaf</th>
                          <th style={{ padding: "4px 8px", textAlign: "left" }}>Evidence Description</th>
                          <th style={{ padding: "4px 8px", textAlign: "left" }}>SHA-256 Cryptographic Hash Digest</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dossier.forensic_merkle_tree.leaf_hashes.map((leaf, idx) => (
                          <tr key={idx} style={{ borderBottom: "1px solid #E2E8F0" }}>
                            <td style={{ padding: "4px 8px", fontWeight: "bold" }}>0{idx + 1}</td>
                            <td style={{ padding: "4px 8px" }}>{leaf.leaf}</td>
                            <td style={{ padding: "4px 8px", fontFamily: "var(--font-mono)", fontSize: "9px" }}>{leaf.sha256}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <div style={{ background: "#EEF2F6", padding: "8px 12px", border: "1px solid #CBD5E1", marginBottom: "10px" }}>
                      <strong>COMPOSITE FORENSIC MERKLE ROOT:</strong>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", wordBreak: "break-all", color: "#1E3A8A", fontWeight: "bold", marginTop: "2px" }}>
                        {certData?.merkle_root_sha256 || dossier.forensic_merkle_tree.merkle_root_sha256}
                      </div>
                    </div>

                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>3. Hardware Security Module (HSM) Digital Attestation:</strong><br />
                      Algorithm: <code>{certData?.attestation?.signature_algorithm || "Ed25519-SHA512"}</code> | Hardware Standard: <strong>FIPS 140-3 Level 3 HSM Enclave</strong><br />
                      Digital Signature Hex: <span style={{ fontFamily: "var(--font-mono)", fontSize: "9px", wordBreak: "break-all" }}>{certData?.attestation?.signature_hex}</span>
                    </p>

                    <p style={{ margin: "0 0 8px 0" }}>
                      <strong>4. Primary Atomic Time Standard:</strong><br />
                      CSIR-National Physical Laboratory (NPL), New Delhi - Indian Standard Time (IST) Primary Atomic Clock.<br />
                      Certified Timestamp: <code>{dossier.forensic_merkle_tree.rfc3161_timestamp_tsa}</code>
                    </p>

                    <div
                      style={{
                        background: isAdmissible ? "#F0FDF4" : "#FEF2F2",
                        border: isAdmissible ? "1px solid #BBF7D0" : "1px solid #FECACA",
                        padding: "8px 12px",
                        marginBottom: "12px"
                      }}
                    >
                      <strong style={{ color: isAdmissible ? "#166534" : "#991B1B" }}>
                        5. Forensic Attribution Determination:
                      </strong>
                      <br />
                      Subject:{" "}
                      {store.progress.step2_graph ? (
                        <>
                          <strong>{dossier.attributed_subject.legal_name}</strong> (Alias: {dossier.attributed_subject.alias}) | Age: {dossier.attributed_subject.age} Yrs | Citizenship: {dossier.attributed_subject.citizenship}
                          <br />
                          Physical Residence: {dossier.attributed_subject.current_residence}
                        </>
                      ) : (
                        <span style={{ color: "var(--gov-text-muted)", fontStyle: "italic" }}>
                          [UNRESOLVED — PENDING GRAPH ATTRIBUTION & VASP KYC REQUISITION]
                        </span>
                      )}
                      <br />
                      Confidence Score:{" "}
                      <strong>
                        {store.progress.step4_confidence
                          ? `${evaluatedScore.toFixed(1)}% (${evaluatedTier} — ${
                              isAdmissible
                                ? "HIGH CERTAINTY - ADMISSIBLE AS PRIMARY EVIDENCE"
                                : "ADVISORY LEAD ONLY - INSUFFICIENT FOR JUDICIAL PROCEEDINGS"
                            })`
                          : "0.0% (UNRESOLVED — AWAITING FORENSIC SIGNAL EVALUATION)"}
                      </strong>
                    </div>

                    <p style={{ margin: "0 0 10px 0", fontStyle: "italic", fontSize: "10px" }}>
                      "I certify under penalty of law that the contents of this Certificate are true and correct to the best of my technical knowledge, scientific analysis, and belief."
                    </p>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: "16px" }}>
                      {isAdmissible ? (
                        <div
                          style={{
                            border: "2px solid #16a34a",
                            background: "#F0FDF4",
                            padding: "8px 16px",
                            textAlign: "center",
                            fontSize: "9px",
                            color: "#166534",
                            fontWeight: "bold"
                          }}
                        >
                          [OFFICIAL GOVERNMENT SEAL]<br />
                          SOVEREIGN DIGITAL FORENSICS DIVISION<br />
                          NTRO, NEW DELHI • BSA SEC 63 VALIDATED
                        </div>
                      ) : (
                        <div
                          style={{
                            border: "2px dashed #DC2626",
                            background: "#FEF2F2",
                            padding: "8px 16px",
                            textAlign: "center",
                            fontSize: "9px",
                            color: "#991B1B",
                            fontWeight: "bold"
                          }}
                        >
                          [PROVISIONAL DRAFT SEAL]<br />
                          NOT ADMISSIBLE IN COURT PROCEEDINGS<br />
                          EVIDENTIARY THRESHOLD UNFULFILLED
                        </div>
                      )}
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontStyle: "italic", fontFamily: "cursive", fontSize: "14px", color: "#1E3A8A" }}>Rajeshwari Nair</div>
                        <div style={{ fontWeight: "bold", fontSize: "11px" }}>Rajeshwari Nair, Forensic Scientist 'E'</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>Lead Examiner, Sovereign Digital Forensics Division</div>
                        <div style={{ fontSize: "10px", color: "#64748B" }}>National Technical Research Organisation, New Delhi</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Raw Monospace Plaintext Terminal View */
              <div
                style={{
                  background: "#F8FAFC",
                  padding: "16px",
                  border: "1px solid var(--gov-border)",
                  maxHeight: "540px",
                  overflowY: "auto"
                }}
              >
                <pre
                  id="bsa63-plaintext-content"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    color: "var(--gov-text-heading)",
                    whiteSpace: "pre-wrap"
                  }}
                >
                  {getDynamicPlaintext()}
                </pre>
              </div>
            )
          ) : (
            /* OASIS STIX 2.1 CTI View */
            <div>
              <div
                style={{
                  background: "#F1F5F9",
                  border: "1px solid var(--gov-border)",
                  padding: "12px 16px",
                  marginBottom: "16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "10px"
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "bold", color: "var(--gov-navy)" }}>
                    OASIS STIX 2.1 Threat Intelligence Bundle (JSON Specification)
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gov-text-muted)" }}>
                    Conforms to RFC 7946 GeoJSON & OASIS Open CTI Standards. Strictly exported with <code>.json</code> extension for ingest into MISP, OpenCTI, and SIEM pipelines.
                  </div>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ fontSize: "11px", background: "#FFFFFF", padding: "4px 8px", border: "1px solid var(--gov-border)", fontWeight: 600 }}>
                    Bundle ID: <code style={{ color: "var(--gov-navy)" }}>{stixData?.id?.slice(0, 20)}...</code>
                  </span>
                  <span style={{ fontSize: "11px", background: "var(--gov-surface-alt)", padding: "4px 8px", border: "1px solid var(--gov-border)", fontWeight: 700, color: "var(--gov-green)" }}>
                    Objects: {stixData?.objects?.length || 11} SDOs/SROs
                  </span>
                </div>
              </div>

              {/* SDO Inventory Bar */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", marginBottom: "16px" }}>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--gov-border)", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>threat-actor SDO</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--gov-red)" }}>CyberShadow (Rohan Sharma)</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--gov-border)", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>identity SDO</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--gov-navy)" }}>Rohan Sharma (Individual)</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--gov-border)", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>infrastructure SDO</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--gov-blue)" }}>bharatleaks...onion (Tor v3)</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--gov-border)", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>indicator SDOs</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--gov-saffron)" }}>3 Indicators (IP, BTC, TRON)</div>
                </div>
                <div style={{ background: "#FFFFFF", border: "1px solid var(--gov-border)", padding: "8px 12px" }}>
                  <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>relationship SROs</div>
                  <div style={{ fontSize: "11px", fontWeight: "bold", color: "var(--gov-green)" }}>5 Graph Edges</div>
                </div>
              </div>

              <div
                style={{
                  background: "#0F172A",
                  padding: "16px",
                  borderRadius: "2px",
                  maxHeight: "520px",
                  overflowY: "auto",
                  border: "1px solid #334155"
                }}
              >
                <pre
                  id="stix-json-content"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    lineHeight: "1.5",
                    color: "#38BDF8",
                    whiteSpace: "pre-wrap",
                    margin: 0
                  }}
                >
                  {JSON.stringify(stixData, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
