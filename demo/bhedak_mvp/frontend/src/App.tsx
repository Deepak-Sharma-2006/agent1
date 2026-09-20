import { useState, useEffect } from "react";
import type {
  FullCaseDossier,
  ActiveInvestigationStore,
  InvestigationProgressState,
  ScanOnionResponse,
  StylometryResponse
} from "./types";
import { FALLBACK_CASE } from "./data/fallbackCase";
import { apiService } from "./services/api";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import type { TabKey } from "./components/Navigation";
import { CaseOverview } from "./components/CaseOverview";
import { InfraScanner } from "./components/InfraScanner";
import { AttributionGraph } from "./components/AttributionGraph";
import { StylometryLab } from "./components/StylometryLab";
import { ConfidenceScorer } from "./components/ConfidenceScorer";
import { StatutoryExportModal } from "./components/StatutoryExportModal";
import { ErrorBoundary } from "./components/ErrorBoundary";

const SESSION_STORAGE_KEY = "bhedak_active_investigation_store";

const INITIAL_PROGRESS: InvestigationProgressState = {
  step1_recon: false,
  step2_graph: false,
  step3_stylometry: false,
  step4_confidence: false,
  certified: false
};

const DEFAULT_STORE: ActiveInvestigationStore = {
  examinerMode: "GUIDED_LINEAR",
  progress: INITIAL_PROGRESS,
  activeTargetOnion: "bharatleaks742wqpovbnm34xzvkw90a1bcdefghijk.onion",
  engine1ScanResult: null,
  engine1ProbeLogs: [],
  engine2Synthesized: false,
  engine2Traced: false,
  engine2ActiveHop: null,
  engine3SelectedSampleId: "sample-hinglish",
  engine3InputText:
    "Bhai payment verify kar do jaldi, revert back on session id for custom binary proof of concept ... aur fir settlement will happen directly on exchange.",
  engine3Result: null,
  engine4EnabledSignals: {
    "BTC Cluster Common-Spend (MICH)": false,
    "Clearnet Apache mod_status IP Leak": false,
    "PGP RSA-4096 Identity Binding": false,
    "IndicBERT Hinglish Code-Mixing Stylometry": false,
    "Diurnal Timezone Post Inactivity Trough (IST)": false
  },
  engine4EvaluatedScore: 0,
  engine4ConfidenceTier: "UNRELIABLE",
  engine4HasDeterministic: false,
  engine4LatencyMs: 0
};

const loadInitialStore = (): ActiveInvestigationStore => {
  try {
    const saved = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_STORE,
        ...parsed,
        progress: {
          ...DEFAULT_STORE.progress,
          ...(parsed.progress || {})
        }
      };
    }
  } catch (err) {
    console.warn("Failed to load investigation store from sessionStorage:", err);
  }
  return DEFAULT_STORE;
};

export function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [dossier, setDossier] = useState<FullCaseDossier>(FALLBACK_CASE);
  const [store, setStore] = useState<ActiveInvestigationStore>(loadInitialStore);

  // Sync investigation state to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(store));
    } catch (err) {
      console.warn("Failed to save investigation store to sessionStorage:", err);
    }
  }, [store]);

  // Fetch initial dossier from backend
  useEffect(() => {
    const fetchDossier = async () => {
      try {
        const liveData = await apiService.getCaseDossier();
        setDossier(liveData);
      } catch (err) {
        console.warn("Backend API not reachable; running in sovereign local enclave mode:", err);
        setDossier(FALLBACK_CASE);
      }
    };
    fetchDossier();
  }, []);

  const toggleExaminerMode = () => {
    setStore((prev) => ({
      ...prev,
      examinerMode: prev.examinerMode === "GUIDED_LINEAR" ? "EXAMINER_OVERRIDE" : "GUIDED_LINEAR"
    }));
  };

  const handleResetProgress = () => {
    setStore({
      ...DEFAULT_STORE,
      examinerMode: store.examinerMode
    });
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const handleResolveAllProgress = () => {
    setStore((prev) => ({
      ...prev,
      progress: {
        step1_recon: true,
        step2_graph: true,
        step3_stylometry: true,
        step4_confidence: true,
        certified: true
      },
      activeTargetOnion: "bharatleaks742wqpovbnm34xzvkw90a1bcdefghijk.onion",
      engine1ScanResult: {
        onion_address: "bharatleaks742wqpovbnm34xzvkw90a1bcdefghijk.onion",
        status: "DE_ANONYMIZED_SUCCESS",
        mod_status_ip_leak: "103.152.18.42",
        favicon_mmh3: 1482956102,
        ssl_san_domains: ["api.bharatleaks-staging.in", "cdn.bharatleaks-staging.in"],
        server_banner: "Apache/2.4.52 (Ubuntu) mod_status/2.0",
        resolved_origin: {
          ip: "103.152.18.42",
          asn: "AS133964",
          isp: "Excitel Broadband Pvt Ltd",
          datacenter_location: "Navi Mumbai, Maharashtra",
          flag: "PHYSICAL_ORIGIN_CONFIRMED"
        },
        execution_time_ms: 42.8
      },
      engine2Synthesized: true,
      engine2Traced: true,
      engine2ActiveHop: 3,
      engine3SelectedSampleId: "sample-hinglish",
      engine3InputText:
        "Bhai payment verify kar do jaldi, revert back on session id for custom binary proof of concept ... aur fir settlement will happen directly on exchange.",
      engine3Result: {
        sample_length_chars: 162,
        indicbert_cosine_similarity: 0.864,
        sentence_burstiness: 9.42,
        perplexity_score: 38.6,
        is_adversarially_sanitized: false,
        inferred_dialect: "Hinglish / Romanized Hindi & South Asian Tech English",
        linguistic_markers: [
          "Hinglish code-mixing token: 'bhai'",
          "Hinglish code-mixing token: 'jaldi'",
          "Indian English idiom: 'revert back'",
          "Punctuation cadence: repeated ellipses ('...')"
        ],
        matched_suspect_corpus: "Rohan Sharma (Vikramaditya0x / Dread)",
        attribution_tier: "PROBABILISTIC_LEAD (Capped at 0.65)"
      },
      engine4EnabledSignals: {
        "BTC Cluster Common-Spend (MICH)": true,
        "Clearnet Apache mod_status IP Leak": true,
        "PGP RSA-4096 Identity Binding": true,
        "IndicBERT Hinglish Code-Mixing Stylometry": true,
        "Diurnal Timezone Post Inactivity Trough (IST)": true
      },
      engine4EvaluatedScore: 95.0,
      engine4ConfidenceTier: "DETERMINISTIC_PROOF",
      engine4HasDeterministic: true,
      engine4LatencyMs: 1.2
    }));
  };

  // Engine 1 Updater
  const handleEngine1Update = (onion: string, result: ScanOnionResponse, logs: string[]) => {
    setStore((prev) => ({
      ...prev,
      activeTargetOnion: onion,
      engine1ScanResult: result,
      engine1ProbeLogs: logs,
      progress: {
        ...prev.progress,
        step1_recon: true
      }
    }));
  };

  // Engine 2 Updaters
  const handleEngine2Synthesize = () => {
    setStore((prev) => ({
      ...prev,
      engine2Synthesized: true,
      progress: {
        ...prev.progress,
        step2_graph: true
      }
    }));
  };

  const handleEngine2TraceCompleted = (activeHop: number | null) => {
    setStore((prev) => ({
      ...prev,
      engine2Traced: true,
      engine2ActiveHop: activeHop,
      progress: {
        ...prev.progress,
        step2_graph: true
      }
    }));
  };

  // Engine 3 Updater
  const handleEngine3Update = (sampleId: string, text: string, result: StylometryResponse) => {
    setStore((prev) => ({
      ...prev,
      engine3SelectedSampleId: sampleId,
      engine3InputText: text,
      engine3Result: result,
      progress: {
        ...prev.progress,
        step3_stylometry: true
      }
    }));
  };

  // Engine 4 Updater
  const handleEngine4Update = (
    signals: Record<string, boolean>,
    score: number,
    tier: string,
    hasDet: boolean,
    latencyMs: number
  ) => {
    setStore((prev) => {
      const hasEvaluated = Object.values(signals).some(Boolean);
      const isQualified = score >= 85.0 && hasDet;
      return {
        ...prev,
        engine4EnabledSignals: signals,
        engine4EvaluatedScore: score,
        engine4ConfidenceTier: tier,
        engine4HasDeterministic: hasDet,
        engine4LatencyMs: latencyMs,
        progress: {
          ...prev.progress,
          step4_confidence: hasEvaluated,
          certified: isQualified
        }
      };
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Official Government Masthead & Security Banner */}
      <Header
        caseId={dossier.case_metadata.case_id}
        operationCodename={dossier.case_metadata.operation_codename}
        examinerMode={store.examinerMode}
        onToggleExaminerMode={toggleExaminerMode}
      />

      {/* Navigation Tabs */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        progress={store.progress}
        examinerMode={store.examinerMode}
      />

      {/* Main Content Workspace with Error Boundary Protection */}
      {/* PERSISTENT DOM CONTAINERS: Tabs are never unmounted on navigation, guaranteeing zero state loss */}
      <main className="gov-workspace-container" style={{ flex: 1 }}>
        <ErrorBoundary>
          <div style={{ display: activeTab === "overview" ? "block" : "none" }}>
            <CaseOverview
              dossier={dossier}
              store={store}
              onNavigate={setActiveTab}
              onResetProgress={handleResetProgress}
              onResolveAll={handleResolveAllProgress}
            />
          </div>

          <div style={{ display: activeTab === "engine1" ? "block" : "none" }}>
            <InfraScanner
              infrastructure={dossier.infrastructure}
              store={store}
              onUpdateScan={handleEngine1Update}
              onReset={() => {
                setStore((prev) => ({
                  ...prev,
                  engine1ScanResult: null,
                  engine1ProbeLogs: [],
                  progress: { ...prev.progress, step1_recon: false }
                }));
              }}
              onNavigateNext={() => setActiveTab("engine2")}
            />
          </div>

          <div style={{ display: activeTab === "engine2" ? "block" : "none" }}>
            <AttributionGraph
              dossier={dossier}
              store={store}
              isActiveTab={activeTab === "engine2"}
              onSynthesizeGraph={handleEngine2Synthesize}
              onTraceCompleted={handleEngine2TraceCompleted}
              onReset={() => {
                setStore((prev) => ({
                  ...prev,
                  engine2Synthesized: false,
                  engine2Traced: false,
                  engine2ActiveHop: null,
                  progress: { ...prev.progress, step2_graph: false }
                }));
              }}
              onNavigateNext={() => setActiveTab("engine3")}
            />
          </div>

          <div style={{ display: activeTab === "engine3" ? "block" : "none" }}>
            <StylometryLab
              stylometricAnalysis={dossier.stylometric_analysis}
              store={store}
              onUpdateAnalysis={handleEngine3Update}
              onReset={() => {
                setStore((prev) => ({
                  ...prev,
                  engine3Result: null,
                  progress: { ...prev.progress, step3_stylometry: false }
                }));
              }}
              onNavigateNext={() => setActiveTab("engine4")}
            />
          </div>

          <div style={{ display: activeTab === "engine4" ? "block" : "none" }}>
            <ConfidenceScorer
              initialSignals={dossier.attribution_signals}
              store={store}
              onUpdateSignals={handleEngine4Update}
              onReset={() => {
                setStore((prev) => ({
                  ...prev,
                  engine4EvaluatedScore: 0,
                  engine4ConfidenceTier: "UNRELIABLE",
                  engine4HasDeterministic: false,
                  progress: { ...prev.progress, step4_confidence: false, certified: false }
                }));
              }}
              onNavigateNext={() => setActiveTab("export")}
            />
          </div>

          <div style={{ display: activeTab === "export" ? "block" : "none" }}>
            <StatutoryExportModal dossier={dossier} store={store} />
          </div>
        </ErrorBoundary>
      </main>

      {/* Official Government Footer */}
      <footer className="gov-portal-footer">
        <div className="gov-footer-content">
          <div>
            <strong>राष्ट्रीय तकनीकी अनुसंधान संगठन | National Technical Research Organisation</strong> • Prime
            Minister's Office, Government of India
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "#FDE68A", fontWeight: 600 }}>
            SEC 63 BSA 2023 COMPLIANT • MERKLE ROOT:{" "}
            {dossier.forensic_merkle_tree.merkle_root_sha256.substring(0, 16)}...
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

