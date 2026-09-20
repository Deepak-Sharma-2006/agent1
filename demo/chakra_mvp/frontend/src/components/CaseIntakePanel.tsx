import React, { useState } from "react";
import type { ScenarioMetadata, NetworkType, AttributionRequest } from "../types";
import { Search, Zap, Sliders, AlertTriangle, ShieldAlert, Layers, ArrowRight } from "lucide-react";

interface CaseIntakePanelProps {
  scenarios: ScenarioMetadata[];
  selectedScenario: ScenarioMetadata | null;
  onSelectScenario: (scenario: ScenarioMetadata) => void;
  onRequestTrace: (request: AttributionRequest) => Promise<void>;
  onOpenJuryModal: () => void;
  isTracing: boolean;
}

export const CaseIntakePanel: React.FC<CaseIntakePanelProps> = ({
  scenarios,
  selectedScenario,
  onSelectScenario,
  onRequestTrace,
  onOpenJuryModal,
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

  const handleScenarioChange = (scenarioId: string) => {
    const sc = scenarios.find((s) => s.id === scenarioId);
    if (sc) {
      onSelectScenario(sc);
      setSuspectWallet(sc.suspect_wallet);
      setNetwork(sc.network);
      setFraudLossInr(sc.victim_loss_inr);
    }
  };

  const handleSubmitTrace = (e: React.FormEvent) => {
    e.preventDefault();
    const req: AttributionRequest = {
      sahyog_case_id: selectedScenario?.fir_no || "SHG-2026-DEL-IFSO-00084",
      ncrp_complaint_id: selectedScenario?.ncrp_id || "2026-NCRP-339182",
      suspect_wallet_address: suspectWallet.trim(),
      network: network,
      reported_fraud_amount_inr: fraudLossInr,
      max_hops: maxHops,
      dust_threshold_usd: dustThresholdUsd
    };
    onRequestTrace(req);
  };

  return (
    <div className="gov-card">
      <div className="gov-card-header">
        <span className="gov-card-title">
          <ShieldAlert size={15} color="#0F2942" /> Case Intake & Intelligence
        </span>
        <span style={{ fontSize: "10.5px", fontWeight: 700, color: "#059669", background: "#ECFDF5", padding: "2px 6px", borderRadius: "4px" }}>
          NCRP INTEGRATED
        </span>
      </div>

      <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Presets vs Custom Toggle */}
        <div style={{ display: "flex", background: "#F1F5F9", padding: "3px", borderRadius: "6px" }}>
          <button
            onClick={() => setActiveTab("presets")}
            style={{
              flex: 1,
              padding: "6px",
              fontSize: "11px",
              fontWeight: 600,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              background: activeTab === "presets" ? "#FFFFFF" : "transparent",
              color: activeTab === "presets" ? "#0F2942" : "#64748B",
              boxShadow: activeTab === "presets" ? "var(--shadow-sm)" : "none"
            }}
          >
            Authentic Case Presets
          </button>
          <button
            onClick={() => setActiveTab("custom")}
            style={{
              flex: 1,
              padding: "6px",
              fontSize: "11px",
              fontWeight: 600,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              background: activeTab === "custom" ? "#FFFFFF" : "transparent",
              color: activeTab === "custom" ? "#0F2942" : "#64748B",
              boxShadow: activeTab === "custom" ? "var(--shadow-sm)" : "none"
            }}
          >
            Manual Address Intake
          </button>
        </div>

        {activeTab === "presets" && (
          <div className="gov-form-group">
            <label className="gov-label">Select Registered State Cyber Crime Docket:</label>
            <select
              className="gov-select"
              value={selectedScenario?.id || ""}
              onChange={(e) => handleScenarioChange(e.target.value)}
            >
              {scenarios.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title} ({s.state_ut})
                </option>
              ))}
            </select>

            {selectedScenario && (
              <div
                style={{
                  background: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  padding: "10px",
                  marginTop: "8px",
                  fontSize: "11px",
                  lineHeight: "1.4"
                }}
              >
                <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
                  {selectedScenario.fir_no} • {selectedScenario.police_station}
                </div>
                <div style={{ color: "#475569", marginBottom: "6px" }}>
                  {selectedScenario.summary}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#64748B" }}>
                  <span>Loss: <b style={{ color: "#B91C1C" }}>₹ {selectedScenario.victim_loss_inr.toLocaleString("en-IN")}</b></span>
                  <span>Asset: <b>{selectedScenario.asset}</b></span>
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmitTrace} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div className="gov-form-group">
            <label className="gov-label">Suspect Cryptocurrency Wallet Address:</label>
            <input
              type="text"
              className="gov-input gov-input-mono"
              value={suspectWallet}
              onChange={(e) => setSuspectWallet(e.target.value)}
              placeholder="e.g. TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <div className="gov-form-group">
              <label className="gov-label">Network / Chain:</label>
              <select
                className="gov-select"
                value={network}
                onChange={(e) => setNetwork(e.target.value as NetworkType)}
              >
                <option value="TRON">TRON (TRC-20)</option>
                <option value="ETH">Ethereum (ERC-20)</option>
                <option value="BTC">Bitcoin (UTXO)</option>
                <option value="BSC">Binance Smart Chain</option>
                <option value="POL">Polygon PoS</option>
                <option value="SOL">Solana</option>
              </select>
            </div>

            <div className="gov-form-group">
              <label className="gov-label">Reported Loss (₹):</label>
              <input
                type="number"
                className="gov-input"
                value={fraudLossInr}
                onChange={(e) => setFraudLossInr(parseFloat(e.target.value) || 0)}
                step="10000"
                min="1000"
              />
            </div>
          </div>

          {/* Forensic Parameters Accordion / Sliders */}
          <div style={{ background: "#F1F5F9", padding: "10px", borderRadius: "6px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, color: "#1E293B", display: "flex", alignItems: "center", gap: "4px" }}>
                <Sliders size={12} /> Forensic Beam Parameters
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "#475569", marginBottom: "2px" }}>
              <span>Max Traversal Hops:</span>
              <b>{maxHops} Hops</b>
            </div>
            <input
              type="range"
              min="1"
              max="6"
              value={maxHops}
              onChange={(e) => setMaxHops(parseInt(e.target.value, 10))}
              style={{ width: "100%", accentColor: "#0F2942" }}
            />

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10.5px", color: "#475569", marginTop: "6px", marginBottom: "2px" }}>
              <span>Dust Filter Threshold:</span>
              <b>${dustThresholdUsd} USD</b>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={dustThresholdUsd}
              onChange={(e) => setDustThresholdUsd(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: "#0F2942" }}
            />
          </div>

          <button
            type="submit"
            className="gov-btn gov-btn-primary"
            disabled={isTracing}
            style={{ width: "100%", padding: "10px", fontSize: "12.5px" }}
          >
            <Search size={15} /> {isTracing ? "Executing Degree-Bounded Beam Search..." : "Execute Automated Attribution"}
          </button>
        </form>

        {/* Dynamic Jury Injection Entrypoint */}
        <div style={{ borderTop: "1px dashed #CBD5E1", paddingTop: "12px", marginTop: "4px" }}>
          <button
            type="button"
            className="gov-btn gov-btn-saffron"
            onClick={onOpenJuryModal}
            style={{ width: "100%", padding: "9px" }}
          >
            <Zap size={14} /> ⚡ SIH Evaluator / Jury Dynamic Injection
          </button>
          <div style={{ fontSize: "10px", color: "#64748B", textAlign: "center", marginTop: "4px" }}>
            Inject arbitrary un-indexed transactions live to test dynamic traversal
          </div>
        </div>
      </div>
    </div>
  );
};
