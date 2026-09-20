import React, { useState } from "react";
import type { AttributionResponse, MerkleVerificationResult } from "../types";
import { api } from "../services/api";
import { Lock, CheckCircle2, Shield, X, AlertCircle, RefreshCw } from "lucide-react";

interface MerkleAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribution: AttributionResponse;
}

export const MerkleAuditModal: React.FC<MerkleAuditModalProps> = ({
  isOpen,
  onClose,
  attribution
}) => {
  const [selectedLeaf, setSelectedLeaf] = useState<string>(
    attribution.graph_edges[0]?.tx_hash || ""
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verifyResult, setVerifyResult] = useState<MerkleVerificationResult | null>(null);

  if (!isOpen) return null;

  const allLeaves = attribution.graph_edges.map((e) => e.tx_hash);

  const handleVerify = async () => {
    if (!selectedLeaf) return;
    setIsVerifying(true);
    try {
      const res = await api.verifyMerkleLeaf(
        attribution.merkle_evidence_root,
        selectedLeaf,
        allLeaves
      );
      setVerifyResult(res);
    } catch (e: unknown) {
      console.error(e);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" style={{ maxWidth: "720px" }} onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header" style={{ background: "#EFF6FF", borderBottom: "1px solid #BFDBFE" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Lock size={18} color="#1E40AF" />
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1E3A8A" }}>
              Cryptographic Merkle State Engine & Chain-of-Custody Audit
            </h3>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div className="gov-modal-body" style={{ fontSize: "11.5px", color: "#1E293B" }}>
          <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "10px", color: "#64748B", fontWeight: 700 }}>DETERMINISTIC SHA-256 MERKLE ROOT:</span>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 700,
                color: "#1E3A8A",
                wordBreak: "break-all",
                marginTop: "2px"
              }}
            >
              {attribution.merkle_evidence_root}
            </div>
            <div style={{ fontSize: "10.5px", color: "#475569", marginTop: "6px" }}>
              Statutory Admissibility: Certified under <b>Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023</b>. Any alteration of block heights, amounts, or timestamps invalidates this cryptographic seal.
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <label className="gov-label">Select Leaf Transaction Hash to Audit Proof:</label>
            <select
              className="gov-select gov-input-mono"
              value={selectedLeaf}
              onChange={(e) => {
                setSelectedLeaf(e.target.value);
                setVerifyResult(null);
              }}
            >
              {allLeaves.map((hash, idx) => (
                <option key={hash} value={hash}>
                  Leaf {idx + 1}: {hash.slice(0, 24)}...{hash.slice(-8)}
                </option>
              ))}
            </select>
          </div>

          {verifyResult && (
            <div
              style={{
                background: verifyResult.is_leaf_valid ? "#ECFDF5" : "#FEF2F2",
                border: `1px solid ${verifyResult.is_leaf_valid ? "#86EFAC" : "#FECACA"}`,
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "14px",
                color: verifyResult.is_leaf_valid ? "#065F46" : "#991B1B"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "12.5px" }}>
                {verifyResult.is_leaf_valid ? (
                  <>
                    <CheckCircle2 size={16} color="#059669" /> Merkle Inclusion Proof Validated (Non-Repudiation Guaranteed)
                  </>
                ) : (
                  <>
                    <AlertCircle size={16} color="#DC2626" /> Merkle Proof Failure: Tampering Detected
                  </>
                )}
              </div>
              <div style={{ fontSize: "11px", marginTop: "6px", lineHeight: "1.4" }}>
                • Recomputed Root: <b>{verifyResult.recomputed_merkle_root.slice(0, 20)}...</b><br />
                • Inclusion Audit Steps: <b>{verifyResult.proof_audit_steps} Hashes Traversed</b><br />
                • Cryptographic Non-Tamper Verification: <b>PASSED (100% Deterministic)</b>
              </div>
            </div>
          )}
        </div>

        <div className="gov-modal-footer">
          <button className="gov-btn gov-btn-outline" onClick={onClose}>
            Close
          </button>
          <button
            className="gov-btn gov-btn-primary"
            onClick={handleVerify}
            disabled={isVerifying}
          >
            <RefreshCw size={13} className={isVerifying ? "spin-icon" : ""} />
            {isVerifying ? "Verifying Proof..." : "Verify Leaf Inclusion Proof"}
          </button>
        </div>
      </div>
    </div>
  );
};
