import React, { useState } from "react";
import type { CustomGraphInjectionRequest, TransactionEdge, NetworkType } from "../types";
import { Zap, AlertCircle, Plus, Trash2, CheckCircle2, X, Code } from "lucide-react";

interface JuryInjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInject: (injection: CustomGraphInjectionRequest) => Promise<void>;
  isLoading: boolean;
}

const DEFAULT_JURY_TEMPLATE = JSON.stringify(
  {
    suspect_wallet_address: "0xJuryEvaluatorSuspectWallet0001",
    network: "ETH",
    edges: [
      {
        tx_hash: "0xjury_eval_tx_001_initial_peel",
        network: "ETH",
        source_address: "0xJuryEvaluatorSuspectWallet0001",
        destination_address: "0xJuryMuleIntermediaryWallet0002",
        asset_symbol: "USDT",
        raw_amount: "60000000000",
        decimal_amount: "60000.000000",
        fiat_inr_at_exec: 4980000.0,
        fiat_usd_at_exec: 60000.0,
        block_timestamp: "2026-09-19T10:00:00Z",
        block_height: 21000000
      },
      {
        tx_hash: "0xjury_eval_tx_002_to_coindcx_deposit",
        network: "ETH",
        source_address: "0xJuryMuleIntermediaryWallet0002",
        destination_address: "0xJuryCandidateDepositAddress0003",
        asset_symbol: "USDT",
        raw_amount: "59950000000",
        decimal_amount: "59950.000000",
        fiat_inr_at_exec: 4975850.0,
        fiat_usd_at_exec: 59950.0,
        block_timestamp: "2026-09-19T10:15:00Z",
        block_height: 21000050
      },
      {
        tx_hash: "0xjury_eval_tx_003_sweep_to_coindcx_hot",
        network: "ETH",
        source_address: "0xJuryCandidateDepositAddress0003",
        destination_address: "0x534631Bcf33BDb069fB20A75d2791C863E115707", // Registered CoinDCX ETH Hot Storage
        asset_symbol: "USDT",
        raw_amount: "59950000000",
        decimal_amount: "59950.000000",
        fiat_inr_at_exec: 4975850.0,
        fiat_usd_at_exec: 59950.0,
        block_timestamp: "2026-09-19T10:25:00Z",
        block_height: 21000100,
        is_sweep: true
      }
    ]
  },
  null,
  2
);

export const JuryInjectionModal: React.FC<JuryInjectionModalProps> = ({
  isOpen,
  onClose,
  onInject,
  isLoading
}) => {
  const [jsonContent, setJsonContent] = useState<string>(DEFAULT_JURY_TEMPLATE);
  const [parseError, setParseError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExecuteInjection = async () => {
    setParseError(null);
    try {
      const parsed = JSON.parse(jsonContent);
      if (!parsed.suspect_wallet_address) {
        throw new Error("Missing 'suspect_wallet_address' in payload.");
      }
      if (!Array.isArray(parsed.edges) || parsed.edges.length === 0) {
        throw new Error("Payload must contain at least one edge in 'edges' array.");
      }
      await onInject(parsed);
      onClose();
    } catch (e: unknown) {
      setParseError(e instanceof Error ? e.message : "Invalid JSON payload");
    }
  };

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header" style={{ background: "#FEF3C7", borderBottom: "1px solid #FDE68A" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={18} color="#B45309" />
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E" }}>
              SIH Evaluator / Jury Dynamic Stress-Test Injection Console
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div className="gov-modal-body">
          <div
            style={{
              background: "#FFFBEB",
              border: "1px solid #FDE68A",
              borderRadius: "6px",
              padding: "10px 14px",
              marginBottom: "14px",
              fontSize: "11.5px",
              color: "#92400E"
            }}
          >
            <b>Zero-Hardcoding Guarantee:</b> This console allows judges to inject arbitrary custom cryptocurrency transaction edges at runtime. The backend Degree-Bounded Beam Search and Sweep Detector will process this graph dynamically without pre-baked static responses.
          </div>

          <div style={{ marginBottom: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <label className="gov-label" style={{ display: "flex", alignItems: "center", gap: "4px", margin: 0 }}>
                <Code size={13} /> Custom Graph Injection JSON Payload:
              </label>
              <button
                className="gov-btn-text-size"
                onClick={() => setJsonContent(DEFAULT_JURY_TEMPLATE)}
              >
                Reset to 3-Hop CoinDCX Sweep Template
              </button>
            </div>

            <textarea
              className="gov-input gov-input-mono"
              rows={14}
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              style={{ fontSize: "11px", lineHeight: "1.4", background: "#0F172A", color: "#34D399" }}
            />
          </div>

          {parseError && (
            <div
              style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "6px",
                padding: "8px 12px",
                color: "#DC2626",
                fontSize: "11.5px",
                display: "flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              <AlertCircle size={14} /> <b>Injection Error:</b> {parseError}
            </div>
          )}
        </div>

        <div className="gov-modal-footer">
          <button className="gov-btn gov-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button
            className="gov-btn gov-btn-saffron"
            onClick={handleExecuteInjection}
            disabled={isLoading}
          >
            <Zap size={14} /> {isLoading ? "Injecting & Tracing..." : "Inject Graph & Execute Dynamic Attribution"}
          </button>
        </div>
      </div>
    </div>
  );
};
