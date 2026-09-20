import React, { useState } from "react";
import { Lock, UserCheck, Shield, X, CheckCircle2 } from "lucide-react";

interface HeaderProps {
  caseId: string;
  operationCodename: string;
  examinerMode?: "GUIDED_LINEAR" | "EXAMINER_OVERRIDE";
  onToggleExaminerMode?: () => void;
}

type RbacRoleKey = "examiner" | "operator" | "director";

interface RoleDetails {
  officerName: string;
  designation: string;
  roleBadge: string;
  roleKey: RbacRoleKey;
  cadre: string;
  mandate: string;
}

const ROLES_MAP: Record<RbacRoleKey, RoleDetails> = {
  examiner: {
    officerName: "Rajeshwari Nair, Sc 'E'",
    designation: "Lead Forensic Examiner, Sovereign Digital Forensics Division, NTRO, New Delhi",
    roleBadge: "RBAC: FORENSIC EXAMINER",
    roleKey: "examiner",
    cadre: "Scientist 'E' (NICRD / NCIIPC)",
    mandate: "Sec 63(4)(b)-(c) BSA Technical Forensic Expert & Merkle Attestor"
  },
  operator: {
    officerName: "Abhishek Verma, Sc 'D'",
    designation: "Reconnaissance & Threat Tracking Lead, CITC, NTRO, New Delhi",
    roleBadge: "RBAC: CYBER OPERATOR",
    roleKey: "operator",
    cadre: "Scientist 'D' (CITC Offensive-Recon)",
    mandate: "Active De-Anonymization & Blockchain Graph Traversal"
  },
  director: {
    officerName: "Dr. K. S. Murthy, Sc 'G'",
    designation: "Director, Cyber Intelligence & Technology Centre (CITC), NTRO",
    roleBadge: "RBAC: NTRO DIRECTOR",
    roleKey: "director",
    cadre: "Scientist 'G' / Apex National Command",
    mandate: "Sec 63(4)(a) BSA Lawful Attestation & Statutory Issuing Authority"
  }
};

export const Header: React.FC<HeaderProps> = ({
  caseId,
  operationCodename,
  examinerMode = "GUIDED_LINEAR",
  onToggleExaminerMode
}) => {
  const [showRbacModal, setShowRbacModal] = useState<boolean>(false);
  // Default active role: Cyber Forensic Examiner (Scientist 'E') - the primary hands-on user of this workbench
  const [selectedRole, setSelectedRole] = useState<RbacRoleKey>("examiner");

  const currentRole = ROLES_MAP[selectedRole];

  return (
    <>
      <header className="gov-header-wrapper">
        {/* 1. National Tricolor Top Identity Strip */}
        <div className="gov-national-strip" />

        {/* 2. Main Institutional Brand Header */}
        <div className="gov-brand-header">
          <div className="gov-emblem-block">
            {/* Official NTRO Technical Intelligence Emblem */}
            <div className="gov-emblem-svg" title="National Technical Research Organisation Emblem" style={{ width: "auto", height: "64px" }}>
              <img
                src="/ntro_logo.png"
                alt="National Technical Research Organisation Emblem"
                style={{
                  height: "64px",
                  width: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.12))"
                }}
              />
            </div>

            <div className="gov-agency-titles">
              <h1>राष्ट्रीय तकनीकी अनुसंधान संगठन | National Technical Research Organisation</h1>
              <h2>
                Prime Minister's Office, Government of India • Project BHEDAK (भेदक)
              </h2>
              <h3 style={{ fontStyle: "italic", opacity: 0.9 }}>
                Bridging Hidden-networks to Evidence for Darknet Actor Knowledge • CITC TECHINT Division
              </h3>
            </div>
          </div>

          {/* Official Government Case Docket & Active RBAC Session Badge */}
          <div className="gov-docket-badge">
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "8px" }}>
              <span className="gov-classification-tag">
                CONFIDENTIAL // RESTRICTED ACCESS (SECS 69 & 70A IT ACT)
              </span>
            </div>

            <div style={{ fontSize: "12px", color: "var(--gov-text-muted)", marginTop: "2px" }}>
              Docket No: <strong style={{ color: "var(--gov-navy)", fontFamily: "var(--font-mono)" }}>{operationCodename} ({caseId})</strong>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "8px", marginTop: "4px", flexWrap: "wrap" }}>
              {/* Authenticated Officer & RBAC Role Button */}
              <button
                id="rbac-operator-badge-btn"
                onClick={() => setShowRbacModal(true)}
                style={{
                  background: "#F1F5F9",
                  border: "1px solid #CBD5E1",
                  borderRadius: "2px",
                  padding: "2px 8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  fontSize: "11px",
                  color: "var(--gov-navy)",
                  fontWeight: 600
                }}
                title="Click to view Statutory Role-Based Access Control (RBAC) Matrix"
              >
                <UserCheck size={13} color="var(--gov-blue)" />
                <span>{currentRole.officerName}</span>
                <span style={{ fontSize: "9px", background: "var(--gov-navy)", color: "#FFFFFF", padding: "1px 4px", borderRadius: "2px", fontWeight: 700 }}>
                  {currentRole.roleBadge}
                </span>
              </button>

              {onToggleExaminerMode && (
                <button
                  type="button"
                  onClick={onToggleExaminerMode}
                  style={{
                    background: examinerMode === "EXAMINER_OVERRIDE" ? "#FEF3C7" : "#F8FAFC",
                    border: `1px solid ${examinerMode === "EXAMINER_OVERRIDE" ? "#F59E0B" : "#CBD5E1"}`,
                    borderRadius: "2px",
                    padding: "2px 8px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "10px",
                    color: examinerMode === "EXAMINER_OVERRIDE" ? "#92400E" : "var(--gov-text-muted)",
                    fontWeight: 700
                  }}
                  title="Toggle between Linear Investigation Pipeline and Grade 'E' Examiner Audit Mode"
                >
                  <Lock size={11} color={examinerMode === "EXAMINER_OVERRIDE" ? "#D97706" : "#64748B"} />
                  <span>{examinerMode === "EXAMINER_OVERRIDE" ? "EXAMINER BYPASS ACTIVE" : "GUIDED PIPELINE"}</span>
                </button>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--gov-green-dark)", fontWeight: 700 }}>
                <Lock size={11} />
                <span>FIPS 140-3 HSM ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Statutory RBAC Privilege Matrix Modal */}
      {showRbacModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
          onClick={() => setShowRbacModal(false)}
        >
          <div
            style={{
              background: "#FFFFFF",
              border: "2px solid var(--gov-navy)",
              maxWidth: "760px",
              width: "100%",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
              maxHeight: "90vh",
              overflowY: "auto"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: "var(--gov-navy)",
                color: "#FFFFFF",
                padding: "14px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <Shield size={18} color="var(--gov-saffron)" />
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    Enterprise Statutory Role-Based Access Control (RBAC)
                  </div>
                  <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                    Sections 69 & 70A, IT Act, 2000 • Section 63 Bharatiya Sakshya Adhiniyam, 2023
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowRbacModal(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "18px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: "20px" }}>
              {/* Active Authenticated Session Card */}
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #CBD5E1",
                  borderLeft: "4px solid var(--gov-saffron)",
                  padding: "12px 16px",
                  marginBottom: "20px"
                }}
              >
                <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                  Active Authenticated Sovereign Session
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 800, color: "var(--gov-navy)" }}>
                      {currentRole.officerName}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--gov-text-body)" }}>
                      {currentRole.designation}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ background: "var(--gov-navy)", color: "#FFFFFF", fontSize: "10px", padding: "3px 8px", borderRadius: "2px", fontWeight: 700 }}>
                      {currentRole.roleBadge}
                    </span>
                    <div style={{ fontSize: "10px", color: "var(--gov-green-dark)", fontWeight: 600, marginTop: "2px" }}>
                      mTLS Verified • FIPS 140-3 Level 3 Hardware Security Token
                    </div>
                  </div>
                </div>
              </div>

              {/* 3-Tier Authentic NTRO RBAC Privilege Matrix Table */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={{ fontSize: "12px", fontWeight: 800, color: "var(--gov-navy)", textTransform: "uppercase" }}>
                  Enterprise Access Control Privilege Matrix
                </div>
                <div style={{ fontSize: "10px", color: "var(--gov-text-muted)" }}>
                  Click any role row to switch operational view
                </div>
              </div>

              <table className="gov-table" style={{ width: "100%", fontSize: "11px", marginBottom: "16px" }}>
                <thead>
                  <tr>
                    <th>Statutory Role</th>
                    <th>Statutory Mandate</th>
                    <th>Authorized Privileges</th>
                    <th>Access Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Role 1: TECHINT Ingestion Operator */}
                  <tr
                    onClick={() => setSelectedRole("operator")}
                    style={{
                      background: selectedRole === "operator" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <td style={{ fontWeight: 800, color: "var(--gov-navy)" }}>
                      TECHINT Ingestion Operator<br />
                      <span style={{ fontSize: "9px", color: selectedRole === "operator" ? "#92400E" : "var(--gov-text-muted)" }}>
                        Scientist 'D' (CITC) {selectedRole === "operator" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td>Sec 63(4)(a) BSA Custodian</td>
                    <td>Execute darknet crawler probes, passive Tor traffic taps, view unredacted origin IPs, sign Part A Custodian Certificate.</td>
                    <td><span className="gov-badge-blue" style={{ fontSize: "9px" }}>TIER 1 (TECHINT)</span></td>
                  </tr>

                  {/* Role 2: Cyber Forensic Examiner (Default Workbench User) */}
                  <tr
                    onClick={() => setSelectedRole("examiner")}
                    style={{
                      background: selectedRole === "examiner" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <td style={{ fontWeight: 800, color: "var(--gov-navy)" }}>
                      Cyber Forensic Examiner<br />
                      <span style={{ fontSize: "9px", color: selectedRole === "examiner" ? "#92400E" : "var(--gov-text-muted)" }}>
                        Scientist 'E' (NICRD / NCIIPC) {selectedRole === "examiner" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td>Sec 63(4)(b)-(c) BSA Expert</td>
                    <td>Operate full 6-engine forensic workbench: IndicBERT stylometry, blockchain BFS correlation, asymmetric confidence scoring, and sign Part B Forensic Certificate.</td>
                    <td><span className="gov-badge-blue" style={{ fontSize: "9px" }}>TIER 1 (FORENSICS)</span></td>
                  </tr>

                  {/* Role 3: Centre Director */}
                  <tr
                    onClick={() => setSelectedRole("director")}
                    style={{
                      background: selectedRole === "director" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.2s ease"
                    }}
                  >
                    <td style={{ fontWeight: 800, color: "var(--gov-navy)" }}>
                      Centre Director<br />
                      <span style={{ fontSize: "9px", color: selectedRole === "director" ? "#92400E" : "var(--gov-text-muted)" }}>
                        Scientist 'G' (Director, CITC / NCIIPC) {selectedRole === "director" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td>Inter-Agency CTI Authority</td>
                    <td>Executive oversight, judicial case docket release, and authorization of OASIS STIX 2.1 threat intelligence dispatches to CERT-In and I4C.</td>
                    <td><span className="gov-badge-green" style={{ fontSize: "9px" }}>TIER 2 (EXECUTIVE)</span></td>
                  </tr>
                </tbody>
              </table>

              {/* Constitutional Separation Clarification */}
              <div style={{ background: "#EEF2F6", padding: "10px 14px", border: "1px solid #CBD5E1", fontSize: "11px", lineHeight: "1.5", color: "#334155" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--gov-navy)", marginBottom: "2px" }}>
                  <CheckCircle2 size={13} color="var(--gov-green)" />
                  <span>Judicial Independence & Inter-Agency Protocol (Article 50 & BNSS 2023):</span>
                </div>
                Judicial officers (Special Cyber Judges / Prosecutors) do not have operational accounts on NTRO platforms. NTRO produces certified Section 63 BSA evidence dockets transmitted to investigating agencies (NIA/CBI) for formal submission in court.
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{ background: "#F8FAFC", borderTop: "1px solid var(--gov-border)", padding: "10px 20px", display: "flex", justifyContent: "flex-end" }}>
              <button
                className="gov-btn-primary"
                onClick={() => setShowRbacModal(false)}
                style={{ padding: "6px 16px", fontSize: "11px" }}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
