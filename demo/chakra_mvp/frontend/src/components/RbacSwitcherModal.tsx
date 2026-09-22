import React from "react";
import type { AuthUser } from "../types";
import { Shield, CheckCircle2, Key, X, Lock, FileCheck, Building2, UserCheck } from "lucide-react";

interface RbacSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AuthUser[];
  currentUser: AuthUser;
  onSelectUser: (user: AuthUser) => void;
}

export const RbacSwitcherModal: React.FC<RbacSwitcherModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(11, 27, 61, 0.72)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px"
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#FFFFFF",
          border: "2px solid #0B1B3D",
          borderRadius: "8px",
          maxWidth: "880px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
          maxHeight: "92vh",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* National Tricolor Top Accent */}
        <div
          style={{
            height: "4px",
            background: "linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #FFFFFF 33.3%, #FFFFFF 66.6%, #138808 66.6%, #138808 100%)"
          }}
        />

        {/* Modal Header */}
        <div
          style={{
            background: "#0B1B3D",
            color: "#FFFFFF",
            padding: "16px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid rgba(255, 255, 255, 0.2)"
              }}
            >
              <Shield size={20} color="#F59E0B" />
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Statutory Role-Based Access Control (RBAC) Matrix
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8", marginTop: "2px" }}>
                Indian Cyber Crime Coordination Centre (I4C) • Sections 94 & 106/107 BNSS 2023 • Section 63 BSA 2023
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#94A3B8",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center"
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Active Sovereign Officer Banner */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #CBD5E1",
              borderLeft: "4px solid #F59E0B",
              borderRadius: "6px",
              padding: "14px 18px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "12px"
            }}
          >
            <div>
              <div style={{ fontSize: "10px", color: "#64748B", textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.5px" }}>
                Current Authenticated Sovereign Session
              </div>
              <div style={{ fontSize: "15px", fontWeight: 800, color: "#0B1B3D", marginTop: "2px" }}>
                {currentUser.name}
              </div>
              <div style={{ fontSize: "12px", color: "#334155" }}>
                {currentUser.designation} • <b>{currentUser.station}</b> ({currentUser.state_ut})
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748B", fontFamily: "var(--font-mono)", marginTop: "2px" }}>
                Officer ID: {currentUser.user_id} • {currentUser.gov_email || "gov.in verified"}
              </div>
            </div>

            <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    background: "#0B1B3D",
                    color: "#FFFFFF",
                    fontSize: "10.5px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "4px"
                  }}
                >
                  {currentUser.role}
                </span>
                {currentUser.has_dsc_token && (
                  <span
                    style={{
                      background: "#ECFDF5",
                      color: "#047857",
                      border: "1px solid #A7F3D0",
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      gap: "3px"
                    }}
                  >
                    <Key size={11} /> CLASS-3 DSC ATTACHED
                  </span>
                )}
              </div>
              <div style={{ fontSize: "10px", color: "#047857", fontWeight: 600 }}>
                mTLS Handshake Verified • FIPS 140-3 Hardware Cryptographic Token
              </div>
            </div>
          </div>

          {/* Institutional Primary User Clarification */}
          <div
            style={{
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              borderRadius: "6px",
              padding: "12px 16px",
              fontSize: "11.5px",
              color: "#1E3A8A",
              lineHeight: "1.5"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, marginBottom: "4px" }}>
              <Building2 size={15} color="#1E40AF" />
              <span>Institutional Audience & Primary Operational Desk:</span>
            </div>
            This operations dashboard directly caters to the <b>Cyber Crime Investigating Officer (IO) / Station House Officer (SHO)</b> at District and State Cyber Crime Police Stations. The IO receives NCRP victim fraud dockets, maps stolen fund egress, and applies their statutory Class-3 DSC digital token to issue emergency 24-hour debit freeze notices under Section 106 BNSS 2023. Supervisory officers, forensic examiners, and VASP compliance desks maintain dedicated oversight tiers.
          </div>

          {/* 5-Tier Authentic Indian Cybercrime RBAC Matrix Table */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#0B1B3D", textTransform: "uppercase" }}>
                Enterprise Statutory RBAC Privilege Matrix
              </div>
              <div style={{ fontSize: "11px", color: "#64748B" }}>
                Click any role row below to switch active session:
              </div>
            </div>

            <div style={{ border: "1px solid #CBD5E1", borderRadius: "6px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11px" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", borderBottom: "1px solid #CBD5E1", textAlign: "left" }}>
                    <th style={{ padding: "8px 12px", fontWeight: 700, color: "#334155" }}>Statutory Role</th>
                    <th style={{ padding: "8px 12px", fontWeight: 700, color: "#334155" }}>Statutory Mandate</th>
                    <th style={{ padding: "8px 12px", fontWeight: 700, color: "#334155" }}>Authorized Privileges</th>
                    <th style={{ padding: "8px 12px", fontWeight: 700, color: "#334155" }}>Access Tier</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Role 1: INVESTIGATING_OFFICER */}
                  <tr
                    onClick={() => {
                      const user = users.find((u) => u.role === "INVESTIGATING_OFFICER") || users[0];
                      onSelectUser(user);
                      onClose();
                    }}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: currentUser.role === "INVESTIGATING_OFFICER" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0B1B3D" }}>
                      Investigating Officer (IO / SHO)<br />
                      <span style={{ fontSize: "9.5px", color: currentUser.role === "INVESTIGATING_OFFICER" ? "#92400E" : "#64748B" }}>
                        Insp. Rajesh Kumar (Delhi Police) {currentUser.role === "INVESTIGATING_OFFICER" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#334155" }}>
                      Sec 94 & 106 BNSS 2023 Field Investigator
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      Ingest NCRP dockets, run automated degree-bounded beam search, inspect candidate deposit wallets, issue Class-3 DSC 24-hr debit freezes to VASPs.
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE", padding: "2px 6px", borderRadius: "3px", fontWeight: 700, fontSize: "9.5px" }}>
                        TIER 1 (OPERATIONS)
                      </span>
                    </td>
                  </tr>

                  {/* Role 2: SUPERVISORY_OFFICER */}
                  <tr
                    onClick={() => {
                      const user = users.find((u) => u.role === "SUPERVISORY_OFFICER") || users[1];
                      onSelectUser(user);
                      onClose();
                    }}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: currentUser.role === "SUPERVISORY_OFFICER" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0B1B3D" }}>
                      Supervisory Officer (DySP / ACP)<br />
                      <span style={{ fontSize: "9.5px", color: currentUser.role === "SUPERVISORY_OFFICER" ? "#92400E" : "#64748B" }}>
                        Vikramaditya Rao, DySP (CID Karnataka) {currentUser.role === "SUPERVISORY_OFFICER" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#334155" }}>
                      Sec 107 BNSS Attachment Sanctioning Authority
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      Supervise cross-district investigations, sanction formal court asset attachment orders (&gt;₹25L), review cross-state escalation logs.
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: "#F0FDF4", color: "#166534", border: "1px solid #BBF7D0", padding: "2px 6px", borderRadius: "3px", fontWeight: 700, fontSize: "9.5px" }}>
                        TIER 2 (SUPERVISORY)
                      </span>
                    </td>
                  </tr>

                  {/* Role 3: FORENSIC_EXAMINER */}
                  <tr
                    onClick={() => {
                      const user = users.find((u) => u.role === "FORENSIC_EXAMINER") || users[2];
                      onSelectUser(user);
                      onClose();
                    }}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: currentUser.role === "FORENSIC_EXAMINER" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0B1B3D" }}>
                      Forensic Examiner (NCFL / I4C)<br />
                      <span style={{ fontSize: "9.5px", color: currentUser.role === "FORENSIC_EXAMINER" ? "#92400E" : "#64748B" }}>
                        Dr. Sunita Deshmukh (NCFL) {currentUser.role === "FORENSIC_EXAMINER" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#334155" }}>
                      Sec 63(4) BSA 2023 Digital Evidence Certifier
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      Audit SHA-256 Merkle inclusion proofs, verify raw calldata and internal sweep transactions, sign Part B BSA 63(4) court certificate.
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: "#ECFDF5", color: "#047857", border: "1px solid #A7F3D0", padding: "2px 6px", borderRadius: "3px", fontWeight: 700, fontSize: "9.5px" }}>
                        TIER 1 (FORENSICS)
                      </span>
                    </td>
                  </tr>

                  {/* Role 4: THREAT_ANALYST */}
                  <tr
                    onClick={() => {
                      const user = users.find((u) => u.role === "THREAT_ANALYST") || users[3];
                      onSelectUser(user);
                      onClose();
                    }}
                    style={{
                      borderBottom: "1px solid #E2E8F0",
                      background: currentUser.role === "THREAT_ANALYST" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0B1B3D" }}>
                      Cyber Threat Analyst (TAU / I4C)<br />
                      <span style={{ fontSize: "9.5px", color: currentUser.role === "THREAT_ANALYST" ? "#92400E" : "#64748B" }}>
                        Amitabh Sen (Threat Analytics Unit) {currentUser.role === "THREAT_ANALYST" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#334155" }}>
                      Sec 69 IT Act 2000 CTI & Syndicate Profiler
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      Aggregate macro mule networks across multiple state police dockets, identify overseas laundering syndicates, export OASIS STIX 2.1 intelligence.
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: "#F5F3FF", color: "#6D28D9", border: "1px solid #DDD6FE", padding: "2px 6px", borderRadius: "3px", fontWeight: 700, fontSize: "9.5px" }}>
                        TIER 2 (ANALYTICS)
                      </span>
                    </td>
                  </tr>

                  {/* Role 5: VASP_NODAL_OFFICER */}
                  <tr
                    onClick={() => {
                      const user = users.find((u) => u.role === "VASP_NODAL_OFFICER") || users[4];
                      onSelectUser(user);
                      onClose();
                    }}
                    style={{
                      background: currentUser.role === "VASP_NODAL_OFFICER" ? "#FEF3C7" : "#FFFFFF",
                      cursor: "pointer",
                      transition: "background 0.15s ease"
                    }}
                  >
                    <td style={{ padding: "10px 12px", fontWeight: 700, color: "#0B1B3D" }}>
                      VASP Nodal Compliance Officer<br />
                      <span style={{ fontSize: "9.5px", color: currentUser.role === "VASP_NODAL_OFFICER" ? "#92400E" : "#64748B" }}>
                        Nodal Compliance Desk (FIU-IND Reg Exchange) {currentUser.role === "VASP_NODAL_OFFICER" && "• [ACTIVE SESSION]"}
                      </span>
                    </td>
                    <td style={{ padding: "10px 12px", color: "#334155" }}>
                      PMLA 2002 & Sec 106 BNSS Statutory Compliance
                    </td>
                    <td style={{ padding: "10px 12px", color: "#475569" }}>
                      Receive SAHYOG API v2 encrypted statutory orders, execute 24-hr emergency debit freezes on candidate deposit wallets, issue confirmation tickets.
                    </td>
                    <td style={{ padding: "10px 12px" }}>
                      <span style={{ background: "#FFFBEB", color: "#B45309", border: "1px solid #FDE68A", padding: "2px 6px", borderRadius: "3px", fontWeight: 700, fontSize: "9.5px" }}>
                        TIER 3 (EXTERNAL VASP)
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Legal Partitioning Notice */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              padding: "10px 14px",
              fontSize: "11px",
              color: "#475569",
              lineHeight: "1.4"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#0B1B3D", marginBottom: "2px" }}>
              <CheckCircle2 size={13} color="#059669" />
              <span>Judicial Safeguards & Article 50 Separation:</span>
            </div>
            Judicial Officers (Special Cyber Magistrates) do not hold active operator accounts. Section 63(4) BSA 2023 evidence dockets, cryptographic Merkle audit records, and BNSS production orders are exported in certified PDF format for formal court filing.
          </div>
        </div>

        {/* Modal Footer */}
        <div
          style={{
            background: "#F1F5F9",
            borderTop: "1px solid #CBD5E1",
            padding: "12px 20px",
            display: "flex",
            justifyContent: "flex-end"
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "#0B1B3D",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "4px",
              padding: "7px 18px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Close RBAC Console
          </button>
        </div>
      </div>
    </div>
  );
};
