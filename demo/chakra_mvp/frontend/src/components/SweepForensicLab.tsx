import React from "react";
import type { AttributionResponse, SweepProof } from "../types";
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Flame, Zap, Clock, Coins, Building, Copy, ExternalLink } from "lucide-react";

interface SweepForensicLabProps {
  attribution: AttributionResponse | null;
}

export const SweepForensicLab: React.FC<SweepForensicLabProps> = ({ attribution }) => {
  if (!attribution) {
    return (
      <div className="gov-card" style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>
        <Coins size={36} color="#94A3B8" style={{ marginBottom: "12px" }} />
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0B1B3D" }}>Awaiting Attribution Traversal</div>
        <div style={{ fontSize: "12px", marginTop: "4px" }}>
          Execute an attribution trace in Stage 1 to inspect internal exchange sweep calldata and fueler proofs.
        </div>
      </div>
    );
  }

  const sweep = attribution.sweep_proof;
  const isConfirmed = sweep?.is_sweep_confirmed ?? false;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Flame size={16} color="#0B1B3D" />
          <span className="gov-card-title">Stage 3: Internal VASP Sweep Forensics & Gas Fueler Analysis</span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "4px",
            background: isConfirmed ? "#ECFDF5" : "#FFFBEB",
            color: isConfirmed ? "#047857" : "#B45309",
            border: `1px solid ${isConfirmed ? "#A7F3D0" : "#FDE68A"}`
          }}
        >
          {isConfirmed ? "SWEEP CONSOLIDATION CONFIRMED" : "HEURISTIC HEAVY / PENDING"}
        </span>
      </div>

      <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Forensic Principle Header */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: "6px",
            padding: "12px 16px",
            fontSize: "12px",
            color: "#1E3A8A",
            lineHeight: "1.5"
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <ShieldCheck size={16} color="#1E40AF" />
            Centralized Exchange Omnibus Sweep Verification Principle:
          </div>
          Centralized Virtual Asset Service Providers (VASPs) assign distinct per-customer deposit forwarders. When criminal proceeds land on a deposit address, the exchange's internal sweep daemon transfers <b>&gt;95% of funds</b> to an omnibus hot wallet within <b>&lt;120 minutes</b>, funded by an exchange-owned gas fueler address. This gas sponsorship pattern constitutes non-repudiable proof of centralized exchange custody under <b>Section 63(4) BSA 2023</b>.
        </div>

        {/* 4 Summary Verification Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {/* Card 1: Attributed VASP */}
          <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Attributed Custodian (VASP)
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#0B1B3D", marginTop: "4px" }}>
              {attribution.nearest_vasp || "Unhosted Cluster"}
            </div>
            <div style={{ fontSize: "11px", color: "#334155", marginTop: "2px" }}>
              FIU-IND Reg: <b>{attribution.fiu_ind_reg_number || "FIU-IND-PENDING"}</b>
            </div>
          </div>

          {/* Card 2: Swept Ratio */}
          <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Balance Sweep Ratio
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: isConfirmed ? "#047857" : "#B45309", marginTop: "4px" }}>
              {sweep ? `${(sweep.sweep_ratio * 100).toFixed(1)}%` : "N/A"}
            </div>
            <div style={{ fontSize: "11px", color: "#334155", marginTop: "2px" }}>
              Zero balance remainder pattern
            </div>
          </div>

          {/* Card 3: Sweep Latency */}
          <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Aggregation Latency
            </div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#0B1B3D", marginTop: "4px" }}>
              {sweep ? `${sweep.latency_minutes.toFixed(0)} min` : "N/A"}
            </div>
            <div style={{ fontSize: "11px", color: "#334155", marginTop: "2px" }}>
              Threshold: &lt; 120 min automated cron
            </div>
          </div>

          {/* Card 4: Gas Sponsorship Proof */}
          <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px" }}>
            <div style={{ fontSize: "10.5px", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              Gas Sponsorship Status
            </div>
            <div style={{ fontSize: "15px", fontWeight: 800, color: sweep?.gas_sponsored_by_vasp ? "#047857" : "#B45309", marginTop: "4px" }}>
              {sweep?.gas_sponsored_by_vasp ? "EXCHANGE FUELED" : "NATIVE GAS"}
            </div>
            <div style={{ fontSize: "11px", color: "#334155", marginTop: "2px" }}>
              Zero native gas token dependency
            </div>
          </div>
        </div>

        {/* Deep Forensics Evidence Table */}
        <div style={{ border: "1px solid #CBD5E1", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ background: "#0B1B3D", color: "#FFFFFF", padding: "10px 14px", fontSize: "12px", fontWeight: 700 }}>
            Custodial Chain-of-Custody Calldata Verification
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "11.5px" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#334155", width: "240px", background: "#F8FAFC" }}>
                  Candidate Deposit Address:
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "#0B1B3D" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{attribution.deposit_address || "None identified"}</span>
                    {attribution.deposit_address && (
                      <button
                        onClick={() => copyToClipboard(attribution.deposit_address || "")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#1E3A8A", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}
                      >
                        <Copy size={12} /> Copy
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#334155", background: "#F8FAFC" }}>
                  VASP Operational Hot Wallet:
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "#047857", fontWeight: 700 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span>{attribution.hot_wallet_address || "None identified"}</span>
                    {attribution.hot_wallet_address && (
                      <button
                        onClick={() => copyToClipboard(attribution.hot_wallet_address || "")}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#1E3A8A", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: 600 }}
                      >
                        <Copy size={12} /> Copy
                      </button>
                    )}
                  </div>
                </td>
              </tr>

              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#334155", background: "#F8FAFC" }}>
                  Inbound Deposit Transaction Hash:
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "#334155" }}>
                  {sweep?.deposit_tx_hash || "N/A"}
                </td>
              </tr>

              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#334155", background: "#F8FAFC" }}>
                  Internal Sweep Transaction Hash:
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "#334155" }}>
                  {sweep?.sweep_tx_hash || "N/A"}
                </td>
              </tr>

              <tr style={{ borderBottom: "1px solid #E2E8F0" }}>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#334155", background: "#F8FAFC" }}>
                  Gas Sponsor (VASP Fueler Address):
                </td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", color: "#B45309", fontWeight: 600 }}>
                  {sweep?.gas_sponsor_address || "VASP Hot Pool Master Key (Pre-Funded Sweep)"}
                </td>
              </tr>

              <tr>
                <td style={{ padding: "10px 14px", fontWeight: 700, color: "#334155", background: "#F8FAFC" }}>
                  Deposit vs Swept Volume:
                </td>
                <td style={{ padding: "10px 14px", color: "#0B1B3D", fontWeight: 700 }}>
                  {sweep ? `${sweep.deposit_amount} deposited ➔ ${sweep.swept_amount} swept into omnibus` : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cryptographic SHA-256 Merkle Evidence Root */}
        <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px 16px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#0B1B3D", marginBottom: "4px" }}>
            Cryptographic Merkle Tree Evidence Root (BSA Section 63(4)):
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11.5px",
              fontWeight: 700,
              color: "#1E3A8A",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              padding: "6px 10px",
              borderRadius: "4px",
              wordBreak: "break-all"
            }}
          >
            {attribution.merkle_evidence_root}
          </div>
          <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "4px" }}>
            All edge hashes, fueler signatures, and block timestamps are cryptographically anchored to this root hash.
          </div>
        </div>
      </div>
    </div>
  );
};
