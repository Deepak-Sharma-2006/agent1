import React, { useState } from "react";
import type { AuthUser, AttributionResponse } from "../types";
import { Shield, UserCheck, Key, RefreshCw, Layers, Zap } from "lucide-react";
import { RbacSwitcherModal } from "./RbacSwitcherModal";

interface HeaderProps {
  currentUser: AuthUser;
  allUsers: AuthUser[];
  onSelectUser: (user: AuthUser) => void;
  activeAttribution: AttributionResponse | null;
  onResetGraph: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  allUsers,
  onSelectUser,
  activeAttribution,
  onResetGraph,
  isResetting
}) => {
  const [showRbacModal, setShowRbacModal] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<"normal" | "large">("normal");

  const handleTextZoom = (mode: "normal" | "large") => {
    setTextSize(mode);
    document.documentElement.style.fontSize = mode === "large" ? "17px" : "16px";
  };

  return (
    <>
      <header className="gov-header-wrapper">
        {/* 1. National Tricolor Strip */}
        <div className="gov-national-strip" />

        {/* 2. Top Administrative & Accessibility Utility Bar */}
        <div className="gov-utility-bar">
          <div className="gov-utility-left">
            <span style={{ fontWeight: 700, color: "#0F2942" }}>भारत सरकार | Government of India</span>
            <span>•</span>
            <span style={{ fontWeight: 600 }}>गृह मंत्रालय | Ministry of Home Affairs</span>
            <span>•</span>
            <span style={{ color: "#059669", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
              <span className="gov-chip-dot" /> SAHYOG API v2: CONNECTED (TLS 1.3)
            </span>
          </div>

          <div className="gov-utility-right">
            <div className="gov-accessibility-controls">
              <span>Font:</span>
              <button
                className="gov-btn-text-size"
                onClick={() => handleTextZoom("normal")}
                style={{ fontWeight: textSize === "normal" ? 700 : 400 }}
              >
                A
              </button>
              <button
                className="gov-btn-text-size"
                onClick={() => handleTextZoom("large")}
                style={{ fontWeight: textSize === "large" ? 700 : 400 }}
              >
                A+
              </button>
            </div>
            <span>|</span>
            <span style={{ fontSize: "10.5px", color: "#64748B" }}>
              FIU-IND CASP Gateway: <b style={{ color: "#059669" }}>ONLINE</b>
            </span>
          </div>
        </div>

        {/* 3. Main Institutional Brand Header */}
        <div className="gov-brand-header">
          <div className="gov-emblem-block">
            <div className="gov-emblem-svg">
              <img
                src="/emblem_india.svg"
                alt="Emblem of India"
                style={{ height: "54px", width: "auto" }}
              />
            </div>

            <div className="gov-agency-titles">
              <h1>भारतीय साइबर अपराध समन्वय केंद्र (I4C) | INDIAN CYBER CRIME COORDINATION CENTRE</h1>
              <h2>गृह मंत्रालय, भारत सरकार • MINISTRY OF HOME AFFAIRS, GOVERNMENT OF INDIA</h2>
              <h3>
                प्रोजेक्ट चक्र : वीएएसपी अन्वेषण व सम्मन पोर्टल • PROJECT CHAKRA : AUTOMATED VASP ATTRIBUTION SYSTEM
              </h3>
            </div>
          </div>

          <div className="gov-docket-badge">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="gov-classification-tag">
                CONFIDENTIAL // LAW ENFORCEMENT SENSITIVE (SECS 69 & 78 IT ACT)
              </span>

              <button
                className="gov-btn gov-btn-outline"
                onClick={onResetGraph}
                disabled={isResetting}
                title="Reset in-memory Graph Store to authentic Indian cybercrime baseline"
                style={{ padding: "4px 8px", fontSize: "11px" }}
              >
                <RefreshCw size={12} className={isResetting ? "spin-icon" : ""} /> Reset State
              </button>
            </div>

            <button className="gov-rbac-badge-btn" onClick={() => setShowRbacModal(true)}>
              <Shield size={13} />
              <span>
                ROLE: <b>{currentUser.role}</b> ({currentUser.name})
              </span>
              {currentUser.has_dsc_token && (
                <span style={{ background: "#059669", color: "#FFFFFF", padding: "1px 4px", borderRadius: "3px", fontSize: "9px" }}>
                  DSC
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 4. Sub-Navigation / Operational Context Bar */}
        <div className="gov-status-bar">
          <div className="gov-status-chips">
            <div className="gov-chip">
              <span style={{ color: "#94A3B8" }}>CASE DOCKET:</span>
              <b style={{ color: "#FFFFFF", fontFamily: "var(--font-mono)" }}>
                {activeAttribution?.sahyog_case_id || "SHG-2026-DEL-IFSO-00084"}
              </b>
            </div>
            <span>|</span>
            <div className="gov-chip">
              <span style={{ color: "#94A3B8" }}>NCRP COMPLAINT:</span>
              <span style={{ color: "#F8FAFC", fontFamily: "var(--font-mono)" }}>
                {activeAttribution?.ncrp_complaint_id || "2026-NCRP-339182"}
              </span>
            </div>
            <span>|</span>
            <div className="gov-chip">
              <span style={{ color: "#94A3B8" }}>STATION:</span>
              <span style={{ color: "#F8FAFC" }}>{currentUser.station}</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ color: "#94A3B8", fontSize: "11px" }}>
              SOVEREIGN ENGINE: <b style={{ color: "#34D399" }}>DEGREE-BOUNDED BEAM SEARCH</b>
            </span>
            <span>•</span>
            <span style={{ color: "#94A3B8", fontSize: "11px" }}>
              LATENCY: <b style={{ color: "#F59E0B" }}>{activeAttribution ? `${activeAttribution.processing_time_ms.toFixed(2)} ms` : "< 1.0 ms"}</b>
            </span>
          </div>
        </div>
      </header>

      <RbacSwitcherModal
        isOpen={showRbacModal}
        onClose={() => setShowRbacModal(false)}
        users={allUsers}
        currentUser={currentUser}
        onSelectUser={onSelectUser}
      />
    </>
  );
};
