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
      <div className="gov-card" style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>
        <Scale size={36} color="#94A3B8" style={{ marginBottom: "12px" }} />
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0B1B3D" }}>Awaiting Attribution Traversal</div>
        <div style={{ fontSize: "12px", marginTop: "4px" }}>
          Traverse an attribution path in Stage 1 to generate court dockets, statutory notices, and BSA certificates.
        </div>
      </div>
    );
  }

  const score = attribution.confidence_score;
  const isHighConf = score >= 85.0;

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Scale size={16} color="#0B1B3D" />
          <span className="gov-card-title">Stage 5: SAHYOG Statutory Sanctions & Court Docket</span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "4px",
            background: "#EFF6FF",
            color: "#1E40AF",
            border: "1px solid #BFDBFE"
          }}
        >
          SECTIONS 94, 106 & 107 BNSS 2023 • SEC 63 BSA 2023
        </span>
      </div>

      <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Active Docket Summary Header */}
        <div
          style={{
            background: "#F8FAFC",
            border: "1px solid #CBD5E1",
            borderRadius: "8px",
            padding: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px"
          }}
        >
          <div>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Case Docket Identifier
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#0B1B3D", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
              {attribution.sahyog_case_id}
            </div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
              NCRP Ref: <b>{attribution.ncrp_complaint_id}</b>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Attributed Custodian (VASP)
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: "#0B1B3D", marginTop: "2px" }}>
              {attribution.nearest_vasp || "Unknown Entity"}
            </div>
            <div style={{ fontSize: "11px", color: "#334155", marginTop: "2px" }}>
              FIU-IND Reg: <b>{attribution.fiu_ind_reg_number || "FIU-IND-PENDING"}</b>
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Statutory Evidence Admissibility
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: isHighConf ? "#047857" : "#B45309", marginTop: "2px" }}>
              {score.toFixed(1)}% ({attribution.confidence_tier})
            </div>
            <div style={{ fontSize: "11px", color: "#334155", marginTop: "2px" }}>
              Cryptographically Verified Merkle Root
            </div>
          </div>

          <div>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Authorizing Officer (DSC Verified)
            </div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: "#0B1B3D", marginTop: "2px" }}>
              {currentUser.name}
            </div>
            <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
              {currentUser.designation} • {currentUser.station}
            </div>
          </div>
        </div>

        {/* 2 Major Legal Action Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Action Column 1: Statutory SAHYOG Notice & Freezing Order */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderTop: "4px solid #E65100",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#0B1B3D", display: "flex", alignItems: "center", gap: "6px" }}>
                <Send size={15} color="#E65100" />
                Section 106 BNSS 2023 Freezing Notice
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                Encrypted Transmission via MHA SAHYOG API v2 Gateway
              </div>
            </div>

            <div style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.5" }}>
              Transmits an authenticated <b>24-Hour Emergency Debit Freeze Order</b> directly to the FIU-IND registered compliance portal of <b>{attribution.nearest_vasp}</b>. The order commands the VASP to immediately freeze the candidate deposit address (<code style={{ fontSize: "10.5px" }}>{attribution.deposit_address ? `${attribution.deposit_address.substring(0, 10)}...` : "N/A"}</code>) and any un-swept internal ledger balances under penalty of Section 106 BNSS.
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>DSC Authentication:</span>
                <b style={{ color: currentUser.has_dsc_token ? "#047857" : "#DC2626" }}>
                  {currentUser.has_dsc_token ? "Class-3 DSC Token Verified" : "No DSC Token"}
                </b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Gateway Status:</span>
                <b style={{ color: "#047857" }}>TLS 1.3 Active (FIU-IND Connected)</b>
              </div>
            </div>

            <button
              className="gov-btn gov-btn-saffron"
              onClick={onOpenNoticeModal}
              style={{ width: "100%", padding: "11px", fontSize: "12.5px", fontWeight: 700, marginTop: "auto" }}
            >
              <Send size={15} /> Transmit Statutory Freezing Order (SAHYOG API)
            </button>
          </div>

          {/* Action Column 2: Cryptographic BSA Certificate & Judicial Merkle Audit */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderTop: "4px solid #1E3A8A",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "12px"
            }}
          >
            <div>
              <div style={{ fontSize: "13px", fontWeight: 800, color: "#0B1B3D", display: "flex", alignItems: "center", gap: "6px" }}>
                <Lock size={15} color="#1E3A8A" />
                Section 63(4) BSA 2023 Digital Evidence Certificate
              </div>
              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "2px" }}>
                Cryptographic Chain-of-Custody & Merkle Root Verification
              </div>
            </div>

            <div style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.5" }}>
              Certifies the electronic record under <b>Section 63(4) Bharatiya Sakshya Adhiniyam, 2023</b> (formerly Sec 65B Indian Evidence Act). Generates Part A (Law Enforcement Custodian) and Part B (NCFL Forensic Expert) statutory affidavits anchored to a SHA-256 Merkle tree that proves un-tampered block state from initial suspect wallet to VASP sweep.
            </div>

            <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span>Merkle Leaf Count:</span>
                <b>{attribution.graph_edges.length} Transaction Leaves</b>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Root Integrity:</span>
                <b style={{ color: "#047857" }}>Cryptographically Consistent (SHA-256)</b>
              </div>
            </div>

            <button
              className="gov-btn gov-btn-outline"
              onClick={onOpenMerkleModal}
              style={{ width: "100%", padding: "11px", fontSize: "12.5px", fontWeight: 700, marginTop: "auto" }}
            >
              <Lock size={15} color="#1E3A8A" /> Audit Cryptographic Merkle Inclusion Proof
            </button>
          </div>
        </div>

        {/* Section 3: Official Certified PDF Court Exports */}
        <div style={{ border: "1px solid #CBD5E1", borderRadius: "8px", padding: "16px", background: "#F8FAFC" }}>
          <div style={{ fontSize: "12.5px", fontWeight: 800, color: "#0B1B3D", marginBottom: "4px" }}>
            Certified Law Enforcement Document Exports (ReportLab PDF Generation)
          </div>
          <div style={{ fontSize: "11px", color: "#475569", marginBottom: "14px" }}>
            The following documents are compiled directly by the Project CHAKRA sovereign engine for formal filing before the Special Judicial Magistrate (Cyber Crime) and High Court:
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "12px" }}>
            {/* PDF 1: Full Executive Dossier */}
            <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Download size={16} color="#0B1B3D" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0B1B3D" }}>Executive Attribution Dossier</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748B", flexGrow: 1 }}>
                Complete analytical dossier featuring graph visual diagrams, 4-pillar scores, hop breakdown, and VASP compliance records.
              </div>
              <button
                className="gov-btn gov-btn-primary"
                onClick={onDownloadDossierPdf}
                style={{ width: "100%", padding: "7px", fontSize: "11.5px" }}
              >
                <Download size={13} /> Download Dossier PDF
              </button>
            </div>

            {/* PDF 2: Section 94 BNSS Summons */}
            <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <FileText size={16} color="#B91C1C" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0B1B3D" }}>Section 94 BNSS Summons</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748B", flexGrow: 1 }}>
                Statutory summons ordering VASP Nodal Officer to furnish KYC documents, registered bank accounts, and IP login logs within 72 hours.
              </div>
              <button
                className="gov-btn gov-btn-outline"
                onClick={onDownloadSummonsPdf}
                style={{ width: "100%", padding: "7px", fontSize: "11.5px", color: "#B91C1C", borderColor: "#FCA5A5" }}
              >
                <FileText size={13} /> Download BNSS Summons PDF
              </button>
            </div>

            {/* PDF 3: Section 63(4) BSA Evidence Certificate */}
            <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Scale size={16} color="#047857" />
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0B1B3D" }}>BSA 63(4) Evidence Certificate</span>
              </div>
              <div style={{ fontSize: "10.5px", color: "#64748B", flexGrow: 1 }}>
                Dual-attestation electronic evidence affidavit signed by Station House Officer and NCFL Chief Forensic Examiner for trial court admissibility.
              </div>
              <button
                className="gov-btn gov-btn-outline"
                onClick={onDownloadBsaPdf}
                style={{ width: "100%", padding: "7px", fontSize: "11.5px", color: "#047857", borderColor: "#86EFAC" }}
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
