import React from "react";
import type { InvestigationProgressState, ExaminerMode } from "../types";
import {
  FileText,
  Radio,
  Share2,
  MessageSquare,
  Award,
  DownloadCloud,
  Lock,
  CheckCircle2
} from "lucide-react";

export type TabKey = "overview" | "engine1" | "engine2" | "engine3" | "engine4" | "export";

interface NavigationProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
  progress: InvestigationProgressState;
  examinerMode?: ExaminerMode;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onSelectTab,
  progress,
  examinerMode = "GUIDED_LINEAR"
}) => {
  const tabs: Array<{
    key: TabKey;
    stepTag: string;
    label: string;
    icon: React.ReactNode;
    isLocked: boolean;
    isCompleted: boolean;
    lockReason?: string;
  }> = [
    {
      key: "overview",
      stepTag: "1",
      label: "Case Docket (LE-01)",
      icon: <FileText size={14} />,
      isLocked: false,
      isCompleted: true
    },
    {
      key: "engine1",
      stepTag: "2",
      label: "Tor Recon (Engine 1)",
      icon: <Radio size={14} />,
      isLocked: false,
      isCompleted: progress.step1_recon
    },
    {
      key: "engine2",
      stepTag: "3",
      label: "Entity Graph (Engine 2)",
      icon: <Share2 size={14} />,
      isLocked: examinerMode === "GUIDED_LINEAR" && !progress.step1_recon,
      isCompleted: progress.step2_graph,
      lockReason: "Requires Engine 1 Reconnaissance"
    },
    {
      key: "engine3",
      stepTag: "4",
      label: "Stylometry Lab (Engine 3)",
      icon: <MessageSquare size={14} />,
      isLocked: examinerMode === "GUIDED_LINEAR" && !progress.step2_graph,
      isCompleted: progress.step3_stylometry,
      lockReason: "Requires Engine 2 Graph Traversal"
    },
    {
      key: "engine4",
      stepTag: "5",
      label: "Confidence Scorer (Engine 4)",
      icon: <Award size={14} />,
      isLocked: examinerMode === "GUIDED_LINEAR" && !progress.step3_stylometry,
      isCompleted: progress.step4_confidence,
      lockReason: "Requires Engine 3 Stylometry Validation"
    },
    {
      key: "export",
      stepTag: "6",
      label: "Section 63 BSA Export",
      icon: <DownloadCloud size={14} />,
      isLocked: examinerMode === "GUIDED_LINEAR" && !progress.step4_confidence,
      isCompleted: progress.certified,
      lockReason: "Requires Engine 4 Admissibility Score (≥85%)"
    }
  ];

  return (
    <nav className="gov-navigation-bar" aria-label="National Cyber Intelligence Modules">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            id={`tab-btn-${tab.key}`}
            className={`gov-nav-tab ${isActive ? "active" : ""}`}
            onClick={() => {
              if (!tab.isLocked) {
                onSelectTab(tab.key);
              }
            }}
            disabled={tab.isLocked}
            style={{
              opacity: tab.isLocked ? 0.5 : 1,
              cursor: tab.isLocked ? "not-allowed" : "pointer",
              position: "relative"
            }}
            title={tab.isLocked ? `Locked: ${tab.lockReason}` : tab.label}
          >
            <span
              style={{
                fontSize: "9px",
                background: isActive ? "var(--gov-gold-dark)" : tab.isCompleted ? "var(--gov-green)" : "#94A3B8",
                color: "#FFFFFF",
                padding: "1px 5px",
                borderRadius: "10px",
                fontWeight: 800,
                marginRight: "2px"
              }}
            >
              {tab.stepTag}
            </span>

            {tab.icon}

            <span style={{ fontSize: "11.5px", fontWeight: 700 }}>{tab.label}</span>

            {tab.isCompleted && !tab.isLocked && tab.key !== "overview" && (
              <CheckCircle2 size={12} color="var(--gov-green)" style={{ marginLeft: "2px" }} />
            )}

            {tab.isLocked && (
              <Lock size={11} color="#94A3B8" style={{ marginLeft: "2px" }} />
            )}
          </button>
        );
      })}
    </nav>
  );
};

