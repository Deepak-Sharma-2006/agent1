import React, { useState, useEffect } from "react";
import type { ScenarioMetadata, NetworkType, AttributionRequest } from "../types";
import { Search, Zap, Sliders, ShieldAlert, Layers, ArrowRight, Building2, UserCheck, ShieldCheck } from "lucide-react";

interface CaseIntakePanelProps {
  scenarios: ScenarioMetadata[];
  selectedScenario: ScenarioMetadata | null;
  onSelectScenario: (scenario: ScenarioMetadata) => void;
  onRequestTrace: (request: AttributionRequest) => Promise<void>;
  onOpenAdHocModal: () => void;
  isTracing: boolean;
}

export const CaseIntakePanel: React.FC<CaseIntakePanelProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onRequestTrace,
  onOpenAdHocModal,
  isTracing
}) => {
  const [suspectWallet, setSuspectWallet] = useState<string>(
    selectedScenario?.suspect_wallet || "TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f"
  );
  const [network, setNetwork] = useState<NetworkType>(selectedScenario?.network || "TRON");
  const [fraudLossInr, setFraudLossInr] = useState<number>(
    selectedScenario?.victim_loss_inr || 4500000.0
  );
  const [maxHops, setMaxHops] = useState<number>(5);
  const [dustThresholdUsd, setDustThresholdUsd] = useState<number>(10.0);
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets");

  useEffect(() => {
    if (selectedScenario) {
      setSuspectWallet(selectedScenario.suspect_wallet || "");
      setNetwork(selectedScenario.network || "TRON");
      setFraudLossInr(selectedScenario.victim_loss_inr ?? 0);
    }
  }, [selectedScenario]);

  const handleScenarioChange = (scenarioId: string) => {
    const sc = scenarios.find((s) => s.id === scenarioId);
    if (sc) {
      onSelectScenario(sc);
    }
  };

  const handleSubmitTrace = (e: React.FormEvent) => {
    e.preventDefault();
    const req: AttributionRequest = {
      sahyog_case_id: selectedScenario?.fir_no || "SHG-2026-DEL-IFSO-00084",
      ncrp_complaint_id: selectedScenario?.ncrp_id || "2026-NCRP-339182",
      suspect_wallet_address: (suspectWallet || "").trim(),
      network: network,
      reported_fraud_amount_inr: fraudLossInr ?? 0,
      max_hops: maxHops,
      dust_threshold_usd: dustThresholdUsd
    };
    onRequestTrace(req);
  };

  return (
    <div className="chakra-intake-two-column">
      {/* COLUMN 1: Case Docket & Legal Intelligence Dossier */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldAlert size={16} color="#0B1B3D" />
            <span className="gov-card-title">Case Intake & Intelligence Ingestion</span>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#047857",
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              padding: "2px 8px",
              borderRadius: "4px"
            }}
          >
            NCRP / 1930 PORTAL INTEGRATED
          </span>
        </div>

        <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Operational Desk Clarification Banner */}
          <div
            style={{
              background: "#F8FAFC",
              border: "1px solid #CBD5E1",
              borderLeft: "4px solid #1E3A8A",
              borderRadius: "6px",
              padding: "10px 14px",
              fontSize: "11px",
              color: "#334155"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "#0B1B3D", marginBottom: "2px" }}>
              <Building2 size={13} color="#1E3A8A" />
              <span>PRIMARY OPERATIONAL DESK: CYBER CRIME INVESTIGATING OFFICER (IO / SHO)</span>
            </div>
            <div>
              District Cyber Crime Police Stations (CCPS) • Empowered under <b>Section 94 & Section 106/107 BNSS 2023</b> to trace suspect crypto transactions and transmit emergency 24-hr freeze notices to registered VASPs.
            </div>
          </div>

          {/* Presets vs Custom Toggle */}
          <div style={{ display: "flex", background: "#F1F5F9", padding: "3px", borderRadius: "6px" }}>
            <button
              type="button"
              onClick={() => setActiveTab("presets")}
              style={{
                flex: 1,
                padding: "7px",
                fontSize: "11.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: activeTab === "presets" ? "#FFFFFF" : "transparent",
                color: activeTab === "presets" ? "#0B1B3D" : "#64748B",
                boxShadow: activeTab === "presets" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              Registered State Cyber Crime Dockets
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("custom")}
              style={{
                flex: 1,
                padding: "7px",
                fontSize: "11.5px",
                fontWeight: 700,
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                background: activeTab === "custom" ? "#FFFFFF" : "transparent",
                color: activeTab === "custom" ? "#0B1B3D" : "#64748B",
                boxShadow: activeTab === "custom" ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                transition: "all 0.15s ease"
              }}
            >
              Ad-Hoc Suspect Address Ingestion
            </button>
          </div>

          {activeTab === "presets" ? (
            <div className="gov-form-group">
              <label className="gov-label" style={{ fontWeight: 700, color: "#0B1B3D" }}>
                Select Active Police Station Cybercrime Docket:
              </label>
              <select
                className="gov-select"
                value={selectedScenario?.id || ""}
                onChange={(e) => handleScenarioChange(e.target.value)}
                style={{ fontWeight: 600, fontSize: "12px", padding: "8px 10px", width: "100%" }}
              >
                {scenarios.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} ({s.state_ut} Police • FIR: {s.fir_no})
                  </option>
                ))}
              </select>

              {selectedScenario && (
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #CBD5E1",
                    borderRadius: "6px",
                    padding: "14px",
                    marginTop: "12px",
                    fontSize: "11.5px",
                    lineHeight: "1.6"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                    <span style={{ fontWeight: 800, color: "#0B1B3D", fontSize: "12.5px" }}>
                      FIR NO: {selectedScenario.fir_no}
                    </span>
                    <span style={{ fontSize: "10px", background: "#EFF6FF", color: "#1E40AF", border: "1px solid #BFDBFE", padding: "2px 8px", borderRadius: "3px", fontWeight: 700 }}>
                      NCRP: {selectedScenario.ncrp_id}
                    </span>
                  </div>
                  <div style={{ color: "#1E293B", fontSize: "11px", marginBottom: "4px" }}>
                    <b>Station:</b> {selectedScenario.police_station} ({selectedScenario.state_ut})
                  </div>
                  <div style={{ color: "#475569", marginBottom: "8px", fontSize: "11.5px" }}>
                    {selectedScenario.summary}
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#334155", borderTop: "1px dashed #CBD5E1", paddingTop: "8px" }}>
                    <span>Victim Reported Loss: <b style={{ color: "#B91C1C", fontSize: "12px" }}>₹ {selectedScenario.victim_loss_inr.toLocaleString("en-IN")}</b></span>
                    <span>Target Asset: <b style={{ color: "#0B1B3D" }}>{selectedScenario.asset} ({selectedScenario.network})</b></span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "14px", fontSize: "11.5px", color: "#475569" }}>
              <div style={{ fontWeight: 700, color: "#0B1B3D", marginBottom: "6px" }}>
                Ad-Hoc Suspect Ingestion Mode
              </div>
              <div>
                Enter custom FIR metadata and paste any unhosted seed or candidate wallet address on the right to execute degree-bounded attribution across multi-chain ledgers.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COLUMN 2: Target Suspect Address & Algorithmic Attribution Engine */}
      <div className="gov-card">
        <div className="gov-card-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Sliders size={16} color="#0B1B3D" />
            <span className="gov-card-title">Target Suspect Address & Algorithmic Attribution Engine</span>
          </div>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#1E40AF",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              padding: "2px 8px",
              borderRadius: "4px"
            }}
          >
            DEGREE-BOUNDED BEAM SEARCH
          </span>
        </div>

        <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <form onSubmit={handleSubmitTrace} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div className="gov-form-group">
              <label className="gov-label" style={{ fontWeight: 700, color: "#0B1B3D" }}>
                Target Suspect Cryptocurrency Wallet Address:
              </label>
              <input
                type="text"
                className="gov-input gov-input-mono"
                value={suspectWallet || ""}
                onChange={(e) => setSuspectWallet(e.target.value)}
                placeholder="e.g. TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f"
                required
                style={{ fontSize: "12px", padding: "8px 10px" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div className="gov-form-group">
                <label className="gov-label" style={{ fontWeight: 700, color: "#0B1B3D" }}>
                  Underlying Network / Ledger:
                </label>
                <select
                  className="gov-select"
                  value={network}
                  onChange={(e) => setNetwork(e.target.value as NetworkType)}
                  style={{ fontSize: "12px", padding: "8px 10px" }}
                >
                  <option value="TRON">TRON (TRC-20 USDT)</option>
                  <option value="ETH">Ethereum (ERC-20 USDT/USDC)</option>
                  <option value="BTC">Bitcoin (UTXO Native)</option>
                  <option value="BSC">Binance Smart Chain (BEP-20)</option>
                  <option value="POL">Polygon PoS (POL/USDT)</option>
                  <option value="SOL">Solana (SPL Tokens)</option>
                </select>
              </div>

              <div className="gov-form-group">
                <label className="gov-label" style={{ fontWeight: 700, color: "#0B1B3D" }}>
                  Reported Fraud Loss (₹ INR):
                </label>
                <input
                  type="number"
                  className="gov-input"
                  value={fraudLossInr ?? 0}
                  onChange={(e) => setFraudLossInr(parseFloat(e.target.value) || 0)}
                  step="10000"
                  min="1000"
                  style={{ fontSize: "12px", padding: "8px 10px" }}
                />
              </div>
            </div>

            {/* Forensic Degree-Bounded Parameters */}
            <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", padding: "12px", borderRadius: "6px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0B1B3D", display: "flex", alignItems: "center", gap: "5px" }}>
                  <Sliders size={13} color="#1E3A8A" /> Degree-Bounded Beam Search Parameters
                </span>
                <span style={{ fontSize: "10px", color: "#64748B" }}>
                  Algorithmic Anti-Explosion Gate
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#334155", marginBottom: "3px" }}>
                <span>Max Graph Traversal Depth:</span>
                <b style={{ color: "#0B1B3D" }}>{maxHops} Hops</b>
              </div>
              <input
                type="range"
                min="1"
                max="6"
                value={maxHops}
                onChange={(e) => setMaxHops(parseInt(e.target.value, 10))}
                style={{ width: "100%", accentColor: "#0B1B3D" }}
              />

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", color: "#334155", marginTop: "8px", marginBottom: "3px" }}>
                <span>Dust Filter Floor Threshold:</span>
                <b style={{ color: "#0B1B3D" }}>${dustThresholdUsd} USD</b>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={dustThresholdUsd}
                onChange={(e) => setDustThresholdUsd(parseFloat(e.target.value))}
                style={{ width: "100%", accentColor: "#0B1B3D" }}
              />
            </div>

            <button
              type="submit"
              className="gov-btn gov-btn-primary"
              disabled={isTracing}
              style={{ width: "100%", padding: "11px", fontSize: "13px", fontWeight: 700 }}
            >
              <Search size={15} /> {isTracing ? "Executing Degree-Bounded Beam Traversal..." : "Execute Automated Attribution"}
            </button>
          </form>

          {/* Dynamic Ad-Hoc Stream Ingestion Console */}
          <div style={{ borderTop: "1px dashed #CBD5E1", paddingTop: "10px", marginTop: "auto" }}>
            <button
              type="button"
              className="gov-btn gov-btn-saffron"
              onClick={onOpenAdHocModal}
              style={{ width: "100%", padding: "9px", fontSize: "11.5px", fontWeight: 700 }}
            >
              <Zap size={14} /> ⚡ Ad-Hoc Intelligence & Offline Calldata Ingestion Console
            </button>
            <div style={{ fontSize: "10px", color: "#64748B", textAlign: "center", marginTop: "4px" }}>
              Ingest ad-hoc offline raw calldata, unconfirmed mempool transactions, and cross-chain bridge logs into active investigation memory
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
