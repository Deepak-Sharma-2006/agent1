import React, { useState } from "react";
import type { AttributionResponse, AuthUser, SahyogNotice, DispatchNoticeResult } from "../types";
import { api } from "../services/api";
import { Send, FileText, CheckCircle2, AlertTriangle, Key, ShieldCheck, X, Clock } from "lucide-react";

interface StatutoryNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  attribution: AttributionResponse;
  currentUser: AuthUser;
}

export const StatutoryNoticeModal: React.FC<StatutoryNoticeModalProps> = ({
  isOpen,
  onClose,
  attribution,
  currentUser
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [notice, setNotice] = useState<SahyogNotice | null>(null);
  const [dispatchResult, setDispatchResult] = useState<DispatchNoticeResult | null>(null);
  const [dscChecked, setDscChecked] = useState<boolean>(Boolean(currentUser.has_dsc_token));
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerateNotice = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    try {
      const generated = await api.generateSahyogNotice(attribution);
      setNotice(generated);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to generate statutory notice draft.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDispatchNotice = async () => {
    if (!notice) return;
    setIsDispatching(true);
    setErrorMsg(null);
    try {
      const dscSig = dscChecked ? `0xDSC_CLASS3_${currentUser.user_id}_KEY_HASH` : "0xPROVISIONAL_IO_ATTESTATION";
      const notes = `Urgent Section 106 BNSS 24-hr debit freeze sanctioned by ${currentUser.name} (${currentUser.designation}).`;
      const res = await api.dispatchSahyogNotice(notice.notice_id, dscSig, notes);
      setDispatchResult(res);
      setNotice(res.notice_details);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Failed to transmit notice via SAHYOG API.");
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" style={{ maxWidth: "780px" }} onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header" style={{ background: "#FEF2F2", borderBottom: "1px solid #FCA5A5" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileText size={18} color="#B91C1C" />
            <div>
              <h3 style={{ fontSize: "13.5px", fontWeight: "700", color: "#991B1B" }}>
                Statutory Intermediary Notice under Section 94 & 106/107 of BNSS, 2023
              </h3>
              <div style={{ fontSize: "10.5px", color: "#7F1D1D" }}>
                Production of Records & Immediate 24-Hour Operational Debit Freeze Directive
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <X size={18} />
          </button>
        </div>

        <div className="gov-modal-body" style={{ fontSize: "11.5px", color: "#1E293B", lineHeight: "1.5" }}>
          {errorMsg && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626", padding: "8px 12px", borderRadius: "6px", marginBottom: "12px" }}>
              <b>Error:</b> {errorMsg}
            </div>
          )}

          {dispatchResult && (
            <div
              style={{
                background: "#ECFDF5",
                border: "1px solid #86EFAC",
                borderRadius: "6px",
                padding: "12px",
                marginBottom: "14px",
                color: "#065F46"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: "700", fontSize: "12.5px" }}>
                <CheckCircle2 size={16} color="#059669" /> Notice Transmitted & Acknowledged via MHA SAHYOG API
              </div>
              <div style={{ marginTop: "4px", fontSize: "11px" }}>
                • SAHYOG Notice Ref: <b>{dispatchResult.notice_id}</b><br />
                • VASP Tracking Ticket: <b>{dispatchResult.vasp_ticket_id}</b><br />
                • Operational Debit Freeze: <b style={{ color: "#059669" }}>ACTIVE (24 Hours Statutory Window)</b>
              </div>
            </div>
          )}

          {/* Legal Notice Header Card */}
          <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "12px", marginBottom: "14px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <span style={{ fontSize: "10px", color: "#64748B" }}>ISSUING POLICE STATION:</span>
                <div style={{ fontWeight: 700 }}>{currentUser.station}, {currentUser.state_ut}</div>
                <div style={{ fontSize: "10.5px", color: "#475569" }}>IO: {currentUser.name} ({currentUser.user_id})</div>
              </div>
              <div>
                <span style={{ fontSize: "10px", color: "#64748B" }}>ADDRESSED TO VASP:</span>
                <div style={{ fontWeight: 700, color: "#0F2942" }}>{attribution.nearest_vasp} Nodal Compliance Desk</div>
                <div style={{ fontSize: "10.5px", color: "#475569" }}>FIU-IND Reg: {attribution.fiu_ind_reg_number}</div>
              </div>
            </div>

            <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px solid #E2E8F0" }}>
              <span style={{ fontSize: "10px", color: "#64748B" }}>MANDATORY TARGET DEPOSIT ADDRESS IDENTIFIED:</span>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: "#1E3A8A", wordBreak: "break-all" }}>
                {attribution.deposit_address || "Awaiting Attribution"}
              </div>
            </div>
          </div>

          {/* Statutory Directives */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{ fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
              Mandatory Directives to Virtual Asset Service Provider (VASP):
            </div>
            <ol style={{ paddingLeft: "18px", display: "flex", flexDirection: "column", gap: "4px", color: "#334155" }}>
              <li>
                <b>Customer Due Diligence (CDD / KYC):</b> Provide complete registration records, Aadhaar/PAN, live selfies, registered email, and mobile phone numbers linked to the target deposit address.
              </li>
              <li>
                <b>Fiat Banking Egress Records:</b> Furnish linked Indian bank account numbers, IFSC codes, and UPI handles associated with the Account UID.
              </li>
              <li>
                <b>Urgent Asset Debit Freeze (Sec 106/107 BNSS):</b> Immediately place an operational freeze on the account, preventing withdrawals or off-ramping for 24 hours pending judicial confirmation.
              </li>
            </ol>
          </div>

          {/* Digital Signature Token Checkbox */}
          <div
            style={{
              background: "#F1F5F9",
              border: "1px solid #CBD5E1",
              borderRadius: "6px",
              padding: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <input
              type="checkbox"
              id="dscTokenCheck"
              checked={Boolean(dscChecked)}
              onChange={(e) => setDscChecked(e.target.checked)}
              style={{ width: "16px", height: "16px" }}
            />
            <label htmlFor="dscTokenCheck" style={{ cursor: "pointer", fontSize: "11px" }}>
              <b>Apply Class-3 Digital Signature Certificate (DSC):</b> Digitally seal this statutory notice under the Public Key Infrastructure (PKI) of the Investigating Officer.
            </label>
          </div>
        </div>

        <div className="gov-modal-footer">
          <button className="gov-btn gov-btn-outline" onClick={onClose}>
            Close
          </button>

          {!notice ? (
            <button
              className="gov-btn gov-btn-primary"
              onClick={handleGenerateNotice}
              disabled={isGenerating}
            >
              <FileText size={14} /> {isGenerating ? "Drafting Notice..." : "Generate Statutory Notice Draft"}
            </button>
          ) : (
            <button
              className="gov-btn gov-btn-saffron"
              onClick={handleDispatchNotice}
              disabled={isDispatching || dispatchResult !== null}
            >
              <Send size={14} />{" "}
              {isDispatching ? "Transmitting via SAHYOG..." : dispatchResult ? "Notice Dispatched & Active" : "Dispatch Notice via SAHYOG API"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
