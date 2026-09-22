import React from "react";
import type { ActiveTab } from "../types";
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
  hasAttribution: boolean;
  isHighConfidence: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  hasAttribution,
  isHighConfidence
}) => {
  const tabs: Array<{
    key: ActiveTab;
    stepTag: string;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    isCompleted: boolean;
  }> = [
    {
      key: "intake",
      stepTag: "STAGE 1",
      label: "Case Intake & NCRP Docket",
      sublabel: "FIR & Suspect Ingestion",
      icon: <FileText size={15} />,
      isCompleted: hasAttribution
    },
    {
      key: "graph",
      stepTag: "STAGE 2",
      label: "Multi-Chain Attribution Canvas",
      sublabel: "Degree-Bounded Graph",
      icon: <Share2 size={15} />,
      isCompleted: hasAttribution
    },
    {
      key: "sweep",
      stepTag: "STAGE 3",
      label: "Sweep Forensics & Fueler Lab",
      sublabel: "VASP Custody Verification",
      icon: <Flame size={15} />,
      isCompleted: hasAttribution
    },
    {
      key: "scoring",
      stepTag: "STAGE 4",
      label: "4-Pillar Confidence Scorer",
      sublabel: "Explainable Admissibility",
      icon: <Award size={15} />,
      isCompleted: hasAttribution
    },
    {
      key: "statutory",
      stepTag: "STAGE 5",
      label: "SAHYOG Sanctions & Court Docket",
      sublabel: "Sec 106 BNSS & BSA Certs",
      icon: <Scale size={15} />,
      isCompleted: isHighConfidence
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
            onClick={() => onSelectTab(tab.key)}
            style={{
              position: "relative",
              cursor: "pointer"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", width: "100%", minWidth: 0 }}>
              <span
                style={{
                  fontSize: "9px",
                  background: isActive ? "#E65100" : tab.isCompleted ? "#047857" : "#64748B",
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
                    color: isActive ? "#0B1B3D" : "#334155",
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
                    color: isActive ? "#E65100" : "#64748B",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                  }}
                  title={tab.sublabel}
                >
                  {tab.sublabel}
                </div>
              </div>

              {tab.isCompleted && (
                <CheckCircle2 size={12} color="#047857" style={{ marginLeft: "auto", flexShrink: 0 }} />
              )}
            </div>
          </button>
        );
      })}
    </nav>
  );
};
