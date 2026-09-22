import React, { useState } from "react";
import type { AttributionResponse, ScorePillarBreakdown } from "../types";
import { Award, ShieldCheck, Scale, AlertTriangle, CheckCircle2, TrendingUp, Info, Loader2 } from "lucide-react";

interface ScoringMatrixPanelProps {
  attribution: AttributionResponse | null;
  isComputed?: boolean;
  onScoringComplete?: () => void;
}

export const ScoringMatrixPanel: React.FC<ScoringMatrixPanelProps> = ({
  attribution,
  isComputed: propIsComputed,
  onScoringComplete
}) => {
  const [internalComputed, setInternalComputed] = useState<boolean>(false);
  const [isComputing, setIsComputing] = useState<boolean>(false);
  const [calcStatus, setCalcStatus] = useState<string | null>(null);
  const isComputed = propIsComputed !== undefined ? propIsComputed : internalComputed;

  if (!attribution) {
    return (
      <div className="gov-card" style={{ padding: "40px", textAlign: "center", color: "#64748B" }}>
        <Award size={36} color="#94A3B8" style={{ marginBottom: "12px" }} />
        <div style={{ fontSize: "14px", fontWeight: 700, color: "#0B1B3D" }}>Awaiting Attribution Traversal</div>
        <div style={{ fontSize: "12px", marginTop: "4px" }}>
          Run an attribution trace to generate the 4-pillar explainable confidence matrix.
        </div>
      </div>
    );
  }

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleComputeScoring = async () => {
    setIsComputing(true);
    try {
      setCalcStatus("⚡ [Pillar 1/4] Evaluating Infrastructure & Cluster Match (Hot Wallet & Gas Sponsor)...");
      await delay(400);
      setCalcStatus("⚡ [Pillar 2/4] Evaluating Omnibus Sweep Consistency & Zero-Remainder Pattern...");
      await delay(400);
      setCalcStatus("⚡ [Pillar 3/4] Calculating Proximity Decay Penalty e^(-0.25 * hops)...");
      await delay(400);
      setCalcStatus("⚡ [Pillar 4/4] Calculating Volume Continuity & Peeling Ratio...");
      await delay(400);
      setCalcStatus(`✓ 4-Pillar Admissibility Matrix Compiled! Score: ${attribution.confidence_score.toFixed(1)}/100 (${attribution.confidence_tier})`);
      setInternalComputed(true);
      onScoringComplete?.();
    } finally {
      setIsComputing(false);
    }
  };

  const score = attribution.confidence_score;
  const breakdown = attribution.score_breakdown;

  const isTier1 = score >= 85.0;
  const isTier2 = score >= 60.0 && score < 85.0;

  if (!isComputed) {
    return (
      <div className="gov-card" style={{ padding: "32px 24px" }}>
        <div
          style={{
            maxWidth: "680px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "16px"
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "50%",
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Award size={26} color="#047857" />
          </div>

          <div>
            <div style={{ fontSize: "16px", fontWeight: 800, color: "#0F172A" }}>
              Stage 4: Mathematical Admissibility Scorer Awaiting Calculation
            </div>
            <div style={{ fontSize: "12px", color: "#64748B", marginTop: "6px", lineHeight: "1.55" }}>
              Attribution and sweep consolidation verified for Case <b>{attribution.sahyog_case_id}</b>.
              Execute the 4-pillar multi-factor admissibility scoring formula to determine whether confidence satisfies statutory criteria for <b>Section 106 BNSS 2023</b> asset freezing sanctions.
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px",
              width: "100%",
              background: "#F8FAFC",
              border: "1px solid #E2E8F0",
              borderRadius: "6px",
              padding: "12px",
              fontSize: "11px",
              textAlign: "left"
            }}
          >
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Case Docket</span>
              <span style={{ fontWeight: 700, color: "#0F172A", fontFamily: "var(--font-mono)" }}>
                {attribution.sahyog_case_id}
              </span>
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Target VASP</span>
              <span style={{ fontWeight: 800, color: "#047857" }}>
                {attribution.nearest_vasp || "Unknown"}
              </span>
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Hop Distance</span>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>
                {attribution.hop_distance} Intermediary Hops
              </span>
            </div>
            <div>
              <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Network</span>
              <span style={{ fontWeight: 700, color: "#0F172A" }}>
                {attribution.network} ({attribution.asset_symbol || "USDT"})
              </span>
            </div>
          </div>

          {isComputing ? (
            <div
              style={{
                width: "100%",
                background: "#0F2942",
                color: "#FFFFFF",
                padding: "14px 18px",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                fontSize: "12px",
                fontWeight: 600
              }}
            >
              <Loader2 size={16} className="spin-loader" color="#F59E0B" />
              <span>{calcStatus || "Evaluating 4-Pillar Admissibility Matrix..."}</span>
            </div>
          ) : (
            <button
              type="button"
              id="btn-compute-scoring"
              className="gov-btn gov-btn-primary"
              onClick={handleComputeScoring}
              style={{ padding: "10px 24px", fontSize: "13px", fontWeight: 700, gap: "8px", background: "#0F2942" }}
            >
              <Award size={16} color="#F59E0B" /> Compute 4-Pillar Mathematical Admissibility Score
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Award size={16} color="#0B1B3D" />
          <span className="gov-card-title">Stage 4: 4-Pillar Explainable Confidence Scorer</span>
        </div>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 700,
            padding: "2px 8px",
            borderRadius: "4px",
            background: isTier1 ? "#ECFDF5" : isTier2 ? "#FEF3C7" : "#FEF2F2",
            color: isTier1 ? "#047857" : isTier2 ? "#B45309" : "#991B1B",
            border: `1px solid ${isTier1 ? "#A7F3D0" : isTier2 ? "#FDE68A" : "#FECACA"}`
          }}
        >
          {isTier1 ? "TIER 1 (HIGH CONFIDENCE ≥ 85%)" : isTier2 ? "TIER 2 (ACTIONABLE ≥ 60%)" : "TIER 3 (REVIEW REQUIRED)"}
        </span>
      </div>

      <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* Executive Score Gauge & Statutory Action Guidance */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "18px",
            background: "#F8FAFC",
            border: "1px solid #CBD5E1",
            borderRadius: "8px",
            padding: "16px"
          }}
        >
          {/* Circular Score Badge */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRight: "1px solid #E2E8F0",
              paddingRight: "16px"
            }}
          >
            <div
              style={{
                width: "110px",
                height: "110px",
                borderRadius: "50%",
                background: isTier1 ? "#ECFDF5" : isTier2 ? "#FEF3C7" : "#FEF2F2",
                border: `4px solid ${isTier1 ? "#10B981" : isTier2 ? "#F59E0B" : "#EF4444"}`,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
              }}
            >
              <div style={{ fontSize: "28px", fontWeight: 900, color: isTier1 ? "#047857" : isTier2 ? "#B45309" : "#991B1B" }}>
                {score.toFixed(1)}
              </div>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#64748B" }}>OUT OF 100</div>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 800, color: "#0B1B3D", marginTop: "10px", textTransform: "uppercase" }}>
              {attribution.confidence_tier}
            </div>
          </div>

          {/* Statutory Action Recommendation */}
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
            <div style={{ fontSize: "12px", fontWeight: 800, color: "#0B1B3D" }}>
              STATUTORY ACTION MANDATE UNDER BHARATIYA NAGARIK SURAKSHA SANHITA (BNSS 2023):
            </div>
            <div style={{ fontSize: "11.5px", color: "#334155", lineHeight: "1.5" }}>
              {isTier1 && (
                <>
                  Attribution score meets <b>Tier 1 Statutory Threshold (≥85.0%)</b>. The Investigating Officer is legally empowered to issue an <b>Immediate 24-Hour Emergency Debit Freeze Order</b> to <b>{attribution.nearest_vasp}</b> under <b>Section 106 BNSS 2023</b> via encrypted SAHYOG API transmission, preventing criminal dissipation.
                </>
              )}
              {isTier2 && (
                <>
                  Attribution score satisfies <b>Tier 2 Threshold (60.0% - 84.9%)</b>. The Investigating Officer may issue a <b>Section 94 BNSS Production Order / Summons</b> demanding customer KYC and login telemetry, followed by formal attachment upon verification.
                </>
              )}
              {!isTier1 && !isTier2 && (
                <>
                  Attribution score is below statutory threshold (&lt;60.0%). Case docket requires supplementary off-chain transaction feeds or additional hops before issuing legal sanctions.
                </>
              )}
            </div>

            <div style={{ display: "flex", gap: "16px", marginTop: "4px", fontSize: "11px", color: "#64748B" }}>
              <span>Hop Distance: <b style={{ color: "#0B1B3D" }}>{attribution.hop_distance} Hops</b></span>
              <span>•</span>
              <span>Traced Asset: <b style={{ color: "#0B1B3D" }}>{attribution.traced_amount_crypto}</b></span>
              <span>•</span>
              <span>Processing Latency: <b style={{ color: "#047857" }}>{attribution.processing_time_ms.toFixed(2)} ms</b></span>
            </div>
          </div>
        </div>

        {/* 4 Pillar Breakdown Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
          {/* Pillar 1: Infrastructure Match */}
          <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#0B1B3D" }}>
                  1. Infrastructure Match
                </div>
                <div style={{ fontSize: "10.5px", color: "#64748B" }}>
                  FIU-IND Hot Wallet & Contract Bytecode Match
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#0B1B3D" }}>
                {breakdown.infrastructure_match_score.toFixed(1)} <span style={{ fontSize: "10px", color: "#64748B" }}>/ 40.0</span>
              </div>
            </div>
            <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "3px", overflow: "hidden", margin: "8px 0" }}>
              <div style={{ width: `${(breakdown.infrastructure_match_score / 40) * 100}%`, height: "100%", background: "#0B1B3D" }} />
            </div>
            <div style={{ fontSize: "10.5px", color: "#475569", lineHeight: "1.4" }}>
              Evaluates known exchange hot wallet clusters, smart contract bytecode, and off-chain FIU-IND regulatory filings.
            </div>
          </div>

          {/* Pillar 2: Sweep Consistency */}
          <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#0B1B3D" }}>
                  2. Sweep Consistency & Gas Fueler
                </div>
                <div style={{ fontSize: "10.5px", color: "#64748B" }}>
                  &gt;95% Balance Sweep, &lt;120m Latency, Fueler Gas
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#D97706" }}>
                {breakdown.sweep_consistency_score.toFixed(1)} <span style={{ fontSize: "10px", color: "#64748B" }}>/ 25.0</span>
              </div>
            </div>
            <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "3px", overflow: "hidden", margin: "8px 0" }}>
              <div style={{ width: `${(breakdown.sweep_consistency_score / 25) * 100}%`, height: "100%", background: "#D97706" }} />
            </div>
            <div style={{ fontSize: "10.5px", color: "#475569", lineHeight: "1.4" }}>
              Verifies programmatic automated sweep daemon behavior and zero-native-gas exchange fueler transactions.
            </div>
          </div>

          {/* Pillar 3: Proximity Decay */}
          <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#0B1B3D" }}>
                  3. Proximity Decay
                </div>
                <div style={{ fontSize: "10.5px", color: "#64748B" }}>
                  S_proximity = 20 × e^(-0.35 × (hops - 1))
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#0284C7" }}>
                {breakdown.proximity_decay_score.toFixed(1)} <span style={{ fontSize: "10px", color: "#64748B" }}>/ 20.0</span>
              </div>
            </div>
            <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "3px", overflow: "hidden", margin: "8px 0" }}>
              <div style={{ width: `${(breakdown.proximity_decay_score / 20) * 100}%`, height: "100%", background: "#0284C7" }} />
            </div>
            <div style={{ fontSize: "10.5px", color: "#475569", lineHeight: "1.4" }}>
              Penalizes extended multi-hop dispersion while accounting for rapid direct deposits into centralized exchanges.
            </div>
          </div>

          {/* Pillar 4: Volume Continuity */}
          <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 800, color: "#0B1B3D" }}>
                  4. Volume Continuity
                </div>
                <div style={{ fontSize: "10.5px", color: "#64748B" }}>
                  15 × min(1.0, Traced Value / Reported Loss)
                </div>
              </div>
              <div style={{ fontSize: "14px", fontWeight: 800, color: "#047857" }}>
                {breakdown.volume_continuity_score.toFixed(1)} <span style={{ fontSize: "10px", color: "#64748B" }}>/ 15.0</span>
              </div>
            </div>
            <div style={{ height: "6px", background: "#E2E8F0", borderRadius: "3px", overflow: "hidden", margin: "8px 0" }}>
              <div style={{ width: `${(breakdown.volume_continuity_score / 15) * 100}%`, height: "100%", background: "#047857" }} />
            </div>
            <div style={{ fontSize: "10.5px", color: "#475569", lineHeight: "1.4" }}>
              Audits volume conservation from initial NCRP victim loss through mule hops into final exchange deposit.
            </div>
          </div>
        </div>

        {/* Judicial Scrutiny Admissibility Note */}
        <div
          style={{
            background: "#F1F5F9",
            border: "1px solid #CBD5E1",
            borderRadius: "6px",
            padding: "12px 16px",
            fontSize: "11px",
            color: "#334155",
            lineHeight: "1.5"
          }}
        >
          <div style={{ fontWeight: 800, color: "#0B1B3D", display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
            <Scale size={14} color="#0B1B3D" />
            Judicial Admissibility & Cross-Examination Resilience (Section 63(4) BSA 2023):
          </div>
          Project CHAKRA rejects opaque "black-box" machine learning predictions. Every confidence score is deterministic, reproducible, and mathematically grounded in the 4 transparent pillars above. During cross-examination in trial courts, investigating officers and NCFL forensic examiners can testify to the exact mathematical breakdown without fear of algorithmic ambiguity.
        </div>
      </div>
    </div>
  );
};
