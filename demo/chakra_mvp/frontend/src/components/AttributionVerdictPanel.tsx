import React from "react";
import type { AttributionResponse, AuthUser } from "../types";
import {
  ShieldCheck,
  Download,
  Send,
  Lock,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Copy,
  ExternalLink
} from "lucide-react";

interface AttributionVerdictPanelProps {
  attribution: AttributionResponse | null;
  currentUser: AuthUser;
  onOpenNoticeModal: () => void;
  onOpenMerkleModal: () => void;
  onDownloadDossierPdf: () => void;
  onDownloadSummonsPdf: () => void;
  onDownloadBsaPdf: () => void;
}

export const AttributionVerdictPanel: React.FC<AttributionVerdictPanelProps> = ({
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
      <div className="gov-card" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
        <div style={{ textAlign: "center", color: "#64748B" }}>
          <Scale size={32} color="#94A3B8" style={{ marginBottom: "10px" }} />
          <div style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>Awaiting Attribution Traversal</div>
          <div style={{ fontSize: "11px", marginTop: "4px" }}>
            Select a registered cybercrime docket or enter a suspect wallet to initiate automated VASP resolution.
          </div>
        </div>
      </div>
    );
  }

  const score = attribution.confidence_score;
  const isHighConf = score >= 85.0;
  const isTier2 = score >= 60.0 && score < 85.0;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="gov-card" style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div className="gov-card-header">
        <span className="gov-card-title">
          <ShieldCheck size={15} color="#0F2942" /> Attribution Verdict & Sanctions
        </span>
        <span
          style={{
            fontSize: "10px",
            fontWeight: 700,
            padding: "2px 6px",
            borderRadius: "4px",
            background: isHighConf ? "#ECFDF5" : isTier2 ? "#FEF3C7" : "#FEF2F2",
            color: isHighConf ? "#065F46" : isTier2 ? "#B45309" : "#991B1B",
            border: `1px solid ${isHighConf ? "#A7F3D0" : isTier2 ? "#FDE68A" : "#FECACA"}`
          }}
        >
          {isHighConf ? "TIER 1 (HIGH CONFIDENCE)" : isTier2 ? "TIER 2 (SUMMONS)" : "TIER 3 (REVIEW)"}
        </span>
      </div>

      <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "12px", overflowY: "auto" }}>
        {/* Attributed VASP Primary Outcome Banner */}
        <div
          style={{
            background: isHighConf ? "#F0FDF4" : "#F8FAFC",
            border: `1px solid ${isHighConf ? "#86EFAC" : "#CBD5E1"}`,
            borderRadius: "8px",
            padding: "12px",
            boxShadow: "var(--shadow-sm)"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
            <div>
              <span style={{ fontSize: "10.5px", fontWeight: 600, color: "#475569" }}>ATTRIBUTED ENTITY (VASP):</span>
              <div style={{ fontSize: "16px", fontWeight: 800, color: "#0F2942" }}>
                {attribution.nearest_vasp || "UNKNOWN UNHOSTED CLUSTER"}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <span style={{ fontSize: "10.5px", color: "#64748B" }}>CONFIDENCE SCORE:</span>
              <div style={{ fontSize: "18px", fontWeight: 800, color: isHighConf ? "#059669" : "#D97706" }}>
                {score.toFixed(1)} / 100
              </div>
            </div>
          </div>

          <div style={{ fontSize: "10.5px", color: "#334155", display: "flex", flexDirection: "column", gap: "4px", marginTop: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>FIU-IND Reg ID:</span>
              <b style={{ fontFamily: "var(--font-mono)" }}>{attribution.fiu_ind_reg_number || "FIU-IND-PENDING"}</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Hop Distance:</span>
              <b>{attribution.hop_distance} Hops from Suspect</b>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>Traced Volume:</span>
              <b style={{ color: "#0F2942" }}>{attribution.traced_amount_crypto}</b>
            </div>
          </div>

          {attribution.deposit_address && (
            <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: "1px dashed #CBD5E1" }}>
              <div style={{ fontSize: "10px", color: "#64748B", display: "flex", justifyContent: "space-between" }}>
                <span>CANDIDATE DEPOSIT ADDRESS:</span>
                <button
                  onClick={() => copyToClipboard(attribution.deposit_address || "")}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#0284C7", fontSize: "10px", display: "flex", alignItems: "center", gap: "2px" }}
                >
                  <Copy size={10} /> Copy
                </button>
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "#0F172A",
                  background: "#FFFFFF",
                  padding: "4px 6px",
                  borderRadius: "4px",
                  border: "1px solid #E2E8F0",
                  wordBreak: "break-all",
                  marginTop: "2px"
                }}
              >
                {attribution.deposit_address}
              </div>
            </div>
          )}
        </div>

        {/* 4-Pillar Score Breakdown Gauges */}
        <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 12px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#1E293B", marginBottom: "8px" }}>
            4-Pillar Explainable Score Formulation
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "10.5px" }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span>1. Infrastructure Match (Max 40)</span>
                <b>{attribution.score_breakdown.infrastructure_match_score.toFixed(1)} / 40.0</b>
              </div>
              <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${(attribution.score_breakdown.infrastructure_match_score / 40) * 100}%`, height: "100%", background: "#0F2942" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span>2. Sweep Consistency (Max 25)</span>
                <b>{attribution.score_breakdown.sweep_consistency_score.toFixed(1)} / 25.0</b>
              </div>
              <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${(attribution.score_breakdown.sweep_consistency_score / 25) * 100}%`, height: "100%", background: "#D97706" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span>3. Proximity Decay (Max 20)</span>
                <b>{attribution.score_breakdown.proximity_decay_score.toFixed(1)} / 20.0</b>
              </div>
              <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${(attribution.score_breakdown.proximity_decay_score / 20) * 100}%`, height: "100%", background: "#0284C7" }} />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span>4. Volume Continuity (Max 15)</span>
                <b>{attribution.score_breakdown.volume_continuity_score.toFixed(1)} / 15.0</b>
              </div>
              <div style={{ height: "4px", background: "#E2E8F0", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: `${(attribution.score_breakdown.volume_continuity_score / 15) * 100}%`, height: "100%", background: "#059669" }} />
              </div>
            </div>
          </div>
        </div>

        {/* Sweep Verification Proof Card */}
        {attribution.sweep_proof && attribution.sweep_proof.is_sweep_confirmed && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "8px", padding: "10px 12px" }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#92400E", display: "flex", alignItems: "center", gap: "4px", marginBottom: "4px" }}>
              <CheckCircle2 size={13} color="#D97706" /> Internal Exchange Sweep Confirmed
            </div>
            <div style={{ fontSize: "10px", color: "#78350F", lineHeight: "1.4" }}>
              • Swept Ratio: <b>{(attribution.sweep_proof.sweep_ratio * 100).toFixed(1)}%</b> (Zero remainder)<br />
              • Aggregation Latency: <b>{attribution.sweep_proof.latency_minutes.toFixed(0)} Minutes</b><br />
              • Operational Gas: <b>{attribution.sweep_proof.gas_sponsored_by_vasp ? "Sponsored by Exchange Fueler" : "Native gas"}</b>
            </div>
          </div>
        )}

        {/* Action Buttons: Statutory Legal Orders & Evidence */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
          <button
            className="gov-btn gov-btn-saffron"
            onClick={onOpenNoticeModal}
            style={{ width: "100%", padding: "9px" }}
          >
            <Send size={14} /> Transmit Statutory Notice (SAHYOG API)
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <button
              className="gov-btn gov-btn-outline"
              onClick={onDownloadSummonsPdf}
              title="Download Section 94 & Section 106/107 BNSS Summons"
              style={{ fontSize: "11px", padding: "7px" }}
            >
              <FileText size={13} color="#B91C1C" /> BNSS Summons
            </button>
            <button
              className="gov-btn gov-btn-outline"
              onClick={onDownloadBsaPdf}
              title="Download Section 63(4) BSA 2023 Digital Evidence Certificate"
              style={{ fontSize: "11px", padding: "7px" }}
            >
              <Scale size={13} color="#059669" /> BSA 63(4) Cert
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <button
              className="gov-btn gov-btn-outline"
              onClick={onDownloadDossierPdf}
              title="Download Executive Attribution Dossier PDF"
              style={{ fontSize: "11px", padding: "7px" }}
            >
              <Download size={13} color="#0F2942" /> Full Dossier
            </button>
            <button
              className="gov-btn gov-btn-outline"
              onClick={onOpenMerkleModal}
              title="Audit Cryptographic SHA-256 Merkle Inclusion Proof"
              style={{ fontSize: "11px", padding: "7px" }}
            >
              <Lock size={13} color="#0284C7" /> Merkle Proof
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
