import React from "react";
import type { ActiveTab, InvestigationProgressState } from "../types";
import {
  FileText,
  Share2,
  Flame,
  Award,
  Scale,
  CheckCircle2,
  Lock
} from "lucide-react";

interface NavigationProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  progress: InvestigationProgressState;
  hasAttribution: boolean;
  isHighConfidence: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  progress,
  hasAttribution,
  isHighConfidence
}) => {
  const tabs: Array<{
    key: ActiveTab;
    stepTag: string;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    isLocked: boolean;
    isCompleted: boolean;
    lockReason?: string;
  }> = [
    {
      key: "intake",
      stepTag: "STAGE 1",
      label: "Case Intake & NCRP Docket",
      sublabel: "FIR & Suspect Ingestion",
      icon: <FileText size={15} />,
      isLocked: false,
      isCompleted: progress.step1_intake
    },
    {
      key: "graph",
      stepTag: "STAGE 2",
      label: "Multi-Chain Attribution Canvas",
      sublabel: "Degree-Bounded Graph",
      icon: <Share2 size={15} />,
      isLocked: !progress.step1_intake,
      isCompleted: progress.step2_graph,
      lockReason: "Requires Stage 1 Beam Search Attribution Execution"
    },
    {
      key: "sweep",
      stepTag: "STAGE 3",
      label: "Sweep Forensics & Fueler Lab",
      sublabel: "VASP Custody Verification",
      icon: <Flame size={15} />,
      isLocked: !progress.step2_graph,
      isCompleted: progress.step3_sweep,
      lockReason: "Requires Stage 2 Graph Traversal Verification"
    },
    {
      key: "scoring",
      stepTag: "STAGE 4",
      label: "4-Pillar Confidence Scorer",
      sublabel: "Explainable Admissibility",
      icon: <Award size={15} />,
      isLocked: !progress.step3_sweep,
      isCompleted: progress.step4_scoring,
      lockReason: "Requires Stage 3 Sweep Forensics Verification"
    },
    {
      key: "statutory",
      stepTag: "STAGE 5",
      label: "SAHYOG Sanctions & Court Docket",
      sublabel: "Sec 106 BNSS & BSA Certs",
      icon: <Scale size={15} />,
      isLocked: !progress.step4_scoring || !isHighConfidence,
      isCompleted: progress.step5_statutory,
      lockReason: !isHighConfidence ? "Requires Stage 4 Admissibility Score (≥85%)" : "Requires Stage 4 Admissibility Audit"
    }
  ];

  return (
    <nav className="gov-navigation-bar" aria-label="National Law Enforcement Operations Stages">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            id={`tab-stage-${tab.key}`}
            className={`gov-nav-tab ${isActive ? "active" : ""}`}
            onClick={() => {
              if (!tab.isLocked) {
                onSelectTab(tab.key);
              }
            }}
            disabled={tab.isLocked}
            style={{
              position: "relative",
              cursor: tab.isLocked ? "not-allowed" : "pointer",
              opacity: tab.isLocked ? 0.45 : 1
            }}
            title={tab.isLocked ? `Locked: ${tab.lockReason}` : tab.label}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", minWidth: 0 }}>
              <span
                style={{
                  fontSize: "9px",
                  background: tab.isLocked ? "#94A3B8" : isActive ? "#E65100" : tab.isCompleted ? "#047857" : "#64748B",
                  color: "#FFFFFF",
                  padding: "1px 5px",
                  borderRadius: "3px",
                  fontWeight: 800,
                  letterSpacing: "0.3px",
                  flexShrink: 0
                }}
              >
                {tab.stepTag}
              </span>

              <span style={{ flexShrink: 0, display: "flex", alignItems: "center" }}>
                {tab.icon}
              </span>

              <div style={{ textAlign: "left", minWidth: 0, overflow: "hidden", flex: 1 }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: tab.isLocked ? "#94A3B8" : isActive ? "#0B1B3D" : "#334155",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={tab.label}
                >
                  {tab.label}
                </div>
                <div
                  style={{
                    fontSize: "9.5px",
                    color: tab.isLocked ? "#CBD5E1" : isActive ? "#E65100" : "#64748B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={tab.sublabel}
                >
                  {tab.sublabel}
                </div>
              </div>

              {tab.isLocked ? (
                <Lock size={12} color="#94A3B8" style={{ marginLeft: "auto", flexShrink: 0 }} />
              ) : tab.isCompleted ? (
                <CheckCircle2 size={12} color="#047857" style={{ marginLeft: "auto", flexShrink: 0 }} />
              ) : null}
            </div>
          </button>
        );
      })}
    </nav>
  );
};

