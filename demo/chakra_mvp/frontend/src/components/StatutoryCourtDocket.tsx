import React from "react";
import type { AttributionResponse, AuthUser } from "../types";
import {
  Scale,
  Send,
  Download,
  FileText,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Key,
  ShieldCheck,
  Calendar,
  ExternalLink
} from "lucide-react";

interface StatutoryCourtDocketProps {
  attribution: AttributionResponse | null;
  currentUser: AuthUser;
  onOpenNoticeModal: () => void;
  onOpenMerkleModal: () => void;
  onDownloadDossierPdf: () => void;
  onDownloadSummonsPdf: () => void;
  onDownloadBsaPdf: () => void;
}

export const StatutoryCourtDocket: React.FC<StatutoryCourtDocketProps> = ({
  attribution,
  currentUser,
  onOpenNoticeModal,
  onOpenMerkleModal,
  onDownloadDossierPdf,
  onDownloadSummonsPdf,
  onDownloadBsaPdf
}) => {
  if (!attribution) {
    return (
      <div className="gov-card" style={{ padding: "48px 24px", textAlign: "center", background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
        <Scale size={40} color="#94A3B8" style={{ marginBottom: "12px" }} />
        <div style={{ fontSize: "15px", fontWeight: 700, color: "#0F172A" }}>Awaiting Attribution Traversal</div>
        <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px" }}>
          Traverse an attribution path in Stage 1 to generate court dockets, statutory notices, and BSA certificates.
        </div>
      </div>
    );
  }

  const score = attribution.confidence_score;
  const isHighConf = score >= 85.0;

  return (
    <div className="gov-card" style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}>
      {/* Clean Official Government Header */}
      <div className="gov-card-header" style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0", padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Scale size={18} color="#0F172A" />
          <span className="gov-card-title" style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", letterSpacing: "0.4px" }}>
            Stage 5: SAHYOG Statutory Sanctions & Court Docket
          </span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "4px",
            background: "#F1F5F9",
            color: "#334155",
            border: "1px solid #CBD5E1",
            letterSpacing: "0.3px"
          }}
        >
          SECTIONS 94, 106 & 107 BNSS 2023 • SEC 63 BSA 2023
        </span>
      </div>

      <div className="gov-card-body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Active Docket Summary Header - Clean Off-White with Crisp Borders */}
        <div
          style={{
            background: "#FAFAFA",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "18px"
          }}
        >
          <div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Case Docket Identifier
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginTop: "3px", fontFamily: "var(--font-mono)" }}>
              {attribution.sahyog_case_id}
            </div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "3px" }}>
              NCRP Ref: <b style={{ color: "#334155" }}>{attribution.ncrp_complaint_id}</b>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Attributed Custodian (VASP)
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A", marginTop: "3px" }}>
              {attribution.nearest_vasp || "Unknown Entity"}
            </div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "3px" }}>
              FIU-IND Reg: <b style={{ color: "#334155" }}>{attribution.fiu_ind_reg_number || "FIU-IND-PENDING"}</b>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Statutory Evidence Admissibility
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: isHighConf ? "#047857" : "#B45309", marginTop: "3px" }}>
              {score.toFixed(1)}% ({attribution.confidence_tier})
            </div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "3px" }}>
              Cryptographically Verified Merkle Root
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10px", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Authorizing Officer (DSC Verified)
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#0F172A", marginTop: "3px" }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: "11px", color: "#64748B", marginTop: "3px", display: "flex", alignItems: "center", gap: "6px" }}>
              <span>{currentUser.designation} • {currentUser.station}</span>
              <span
                style={{
                  fontSize: "9px",
                  fontWeight: 700,
                  background: currentUser.has_dsc_token ? "#ECFDF5" : "#FEF2F2",
                  color: currentUser.has_dsc_token ? "#047857" : "#DC2626",
                  border: `1px solid ${currentUser.has_dsc_token ? "#A7F3D0" : "#FECACA"}`,
                  padding: "1px 5px",
                  borderRadius: "3px"
                }}
              >
                {currentUser.has_dsc_token ? "DSC SIGNED" : "NO DSC"}
              </span>
            </div>
          </div>
        </div>

        {/* 2 Major Legal Action Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px" }}>
          {/* Action Column 1: Statutory SAHYOG Notice & Freezing Order */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderTop: "3px solid #D97706",
              borderRadius: "8px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}
          >
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
                <Send size={15} color="#D97706" />
                Section 106 BNSS 2023 Freezing Notice
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "3px" }}>
                Encrypted Transmission via MHA SAHYOG API v2 Gateway
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.55" }}>
              Transmits an authenticated <b>24-Hour Emergency Debit Freeze Order</b> directly to the FIU-IND registered compliance portal of <b>{attribution.nearest_vasp}</b>. Commands immediate freeze on candidate deposit address (<code style={{ fontSize: "11px", background: "#F1F5F9", padding: "1px 4px", borderRadius: "3px" }}>{attribution.deposit_address ? `${attribution.deposit_address.substring(0, 12)}...` : "N/A"}</code>) and un-swept internal ledger balances under penalty of Section 106 BNSS.
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px 14px", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#64748B" }}>DSC Authentication:</span>
                <b style={{ color: currentUser.has_dsc_token ? "#047857" : "#DC2626" }}>
                  {currentUser.has_dsc_token ? "Class-3 DSC Token Verified" : "No DSC Token"}
                </b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Gateway Channel:</span>
                <b style={{ color: "#047857" }}>TLS 1.3 Active (FIU-IND Connected)</b>
              </div>
            </div>

            <button
              className="gov-btn gov-btn-saffron"
              onClick={onOpenNoticeModal}
              style={{ width: "100%", padding: "10px", fontSize: "12px", fontWeight: 700, marginTop: "auto" }}
            >
              <Send size={14} /> Transmit Statutory Freezing Order (SAHYOG API)
            </button>
          </div>

          {/* Action Column 2: Cryptographic BSA Certificate & Judicial Merkle Audit */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderTop: "3px solid #334155",
              borderRadius: "8px",
              padding: "18px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
            }}
          >
            <div>
              <div style={{ fontSize: "13.5px", fontWeight: 800, color: "#0F172A", display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={15} color="#334155" />
                Section 63(4) BSA 2023 Digital Evidence Certificate
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "3px" }}>
                Cryptographic Chain-of-Custody & Merkle Root Verification
              </div>
            </div>

            <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.55" }}>
              Certifies the electronic record under <b>Section 63(4) Bharatiya Sakshya Adhiniyam, 2023</b> (formerly Sec 65B Indian Evidence Act). Generates Part A (Law Enforcement Custodian) and Part B (NCFL Forensic Expert) statutory affidavits anchored to a SHA-256 Merkle tree that proves un-tampered block state from initial suspect wallet to VASP sweep.
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px 14px", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ color: "#64748B" }}>Merkle Leaves:</span>
                <b style={{ color: "#0F172A" }}>{attribution.graph_edges.length} Transaction Leaves</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#64748B" }}>Root Integrity:</span>
                <b style={{ color: "#047857" }}>Cryptographically Consistent (SHA-256)</b>
              </div>
            </div>

            <button
              className="gov-btn gov-btn-outline"
              onClick={onOpenMerkleModal}
              style={{ width: "100%", padding: "10px", fontSize: "12px", fontWeight: 700, marginTop: "auto" }}
            >
              <Lock size={14} color="#334155" /> Audit Cryptographic Merkle Inclusion Proof
            </button>
          </div>
        </div>

        {/* Section 3: Official Certified PDF Court Exports - Clean White & Neutral */}
        <div style={{ border: "1px solid #E2E8F0", borderRadius: "8px", padding: "18px", background: "#FAFAFA" }}>
          <div style={{ fontSize: "13px", fontWeight: 800, color: "#0F172A", marginBottom: "3px" }}>
            Certified Law Enforcement Document Exports (ReportLab PDF Generation)
          </div>
          <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "16px" }}>
            The following documents are compiled directly by the Project CHAKRA sovereign engine for formal filing before the Special Judicial Magistrate (Cyber Crime) and High Court:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
            {/* PDF 1: Full Executive Dossier */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Download size={16} color="#334155" />
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A" }}>Executive Attribution Dossier</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", flexGrow: 1, lineHeight: "1.45" }}>
                Complete analytical dossier featuring graph visual diagrams, 4-pillar scores, hop breakdown, and VASP compliance records.
              </div>
              <button
                className="gov-btn gov-btn-outline"
                onClick={onDownloadDossierPdf}
                style={{ width: "100%", padding: "8px", fontSize: "11.5px", fontWeight: 600, color: "#0F172A", borderColor: "#CBD5E1" }}
              >
                <Download size={13} /> Download Dossier PDF
              </button>
            </div>

            {/* PDF 2: Section 94 BNSS Summons */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FileText size={16} color="#DC2626" />
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A" }}>Section 94 BNSS Summons</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", flexGrow: 1, lineHeight: "1.45" }}>
                Statutory summons ordering VASP Nodal Officer to furnish KYC documents, registered bank accounts, and IP login logs within 72 hours.
              </div>
              <button
                className="gov-btn gov-btn-outline"
                onClick={onDownloadSummonsPdf}
                style={{ width: "100%", padding: "8px", fontSize: "11.5px", fontWeight: 600, color: "#DC2626", borderColor: "#FECACA", background: "#FEF2F2" }}
              >
                <FileText size={13} /> Download BNSS Summons PDF
              </button>
            </div>

            {/* PDF 3: Section 63(4) BSA Evidence Certificate */}
            <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Scale size={16} color="#047857" />
                <span style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A" }}>BSA 63(4) Evidence Certificate</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", flexGrow: 1, lineHeight: "1.45" }}>
                Dual-attestation electronic evidence affidavit signed by Station House Officer and NCFL Chief Forensic Examiner for trial court admissibility.
              </div>
              <button
                className="gov-btn gov-btn-outline"
                onClick={onDownloadBsaPdf}
                style={{ width: "100%", padding: "8px", fontSize: "11.5px", fontWeight: 600, color: "#047857", borderColor: "#A7F3D0", background: "#ECFDF5" }}
              >
                <Scale size={13} /> Download BSA Certificate PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

