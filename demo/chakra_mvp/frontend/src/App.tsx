import React, { useState, useEffect } from "react";
import type {
  AuthUser,
  ScenarioMetadata,
  AttributionResponse,
  AttributionRequest,
  CustomGraphInjectionRequest,
  ActiveTab,
  InvestigationProgressState
} from "./types";
import { api } from "./services/api";
import { Header } from "./components/Header";
import { Navigation } from "./components/Navigation";
import { CaseIntakePanel } from "./components/CaseIntakePanel";
import { AttributionGraph } from "./components/AttributionGraph";
import { SweepForensicLab } from "./components/SweepForensicLab";
import { ScoringMatrixPanel } from "./components/ScoringMatrixPanel";
import { StatutoryCourtDocket } from "./components/StatutoryCourtDocket";
import { StatutoryNoticeModal } from "./components/StatutoryNoticeModal";
import { JuryInjectionModal } from "./components/JuryInjectionModal";
import { MerkleAuditModal } from "./components/MerkleAuditModal";
import { CheckCircle2, AlertCircle, ArrowRight, Share2, Flame, Award, Scale, FileText } from "lucide-react";
import "./App.css";

const FALLBACK_USERS: AuthUser[] = [
  {
    key: "io_delhi",
    user_id: "IND-POL-DEL-4012",
    name: "Insp. Rajesh Kumar",
    designation: "Inspector / Station House Officer",
    station: "Cyber Crime Police Station, Rohini",
    state_ut: "Delhi",
    role: "INVESTIGATING_OFFICER",
    has_dsc_token: true,
    gov_email: "rajesh.kumar@delhipolice.gov.in"
  },
  {
    key: "dysp_blr",
    user_id: "IND-POL-KA-8819",
    name: "Vikramaditya Rao",
    designation: "Deputy Superintendent of Police (DySP)",
    station: "CID Cyber Crime Division",
    state_ut: "Karnataka",
    role: "SUPERVISORY_OFFICER",
    has_dsc_token: true,
    gov_email: "dysp.cyber@ksp.gov.in"
  },
  {
    key: "ncfl_expert",
    user_id: "IND-I4C-NCFL-014",
    name: "Dr. Sunita Deshmukh",
    designation: "Chief Digital Forensic Examiner",
    station: "National Cybercrime Forensic Lab, I4C",
    state_ut: "National (MHA)",
    role: "FORENSIC_EXAMINER",
    has_dsc_token: true,
    gov_email: "forensics.ncfl@i4c.gov.in"
  },
  {
    key: "tau_analyst",
    user_id: "IND-I4C-TAU-099",
    name: "Amitabh Sen",
    designation: "Senior Cyber Threat Analyst",
    station: "Threat Analytics Unit (TAU), I4C",
    state_ut: "National (MHA)",
    role: "THREAT_ANALYST",
    has_dsc_token: false,
    gov_email: "tau.analyst@i4c.gov.in"
  },
  {
    key: "vasp_binance",
    user_id: "VASP-BIN-IND-01",
    name: "Binance Legal Interception Desk",
    designation: "Nodal Compliance Officer (India)",
    station: "Nest Services Limited / FIU-IND Reg #001",
    state_ut: "Offshore / Global",
    role: "VASP_NODAL_OFFICER",
    has_dsc_token: true,
    gov_email: "case-inquiry@binance.com"
  }
];

const FALLBACK_SCENARIOS: ScenarioMetadata[] = [
  {
    id: "CASE_1_BLR_TELEGRAM_TASK",
    title: "Bengaluru Telegram Task-Based Investment Scam",
    ncrp_id: "2026-NCRP-339182",
    fir_no: "FIR-2026-BLR-CY-00412",
    police_station: "Cyber Crime Police Station, Bengaluru City",
    state_ut: "Karnataka",
    victim_loss_inr: 4500000.0,
    asset: "USDT (TRC-20)",
    network: "TRON",
    suspect_wallet: "TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
    summary: "Victim defrauded of ₹45 Lakh in a fake YouTube rating scam. Funds converted to TRC-20 USDT, hopped across 3 unhosted mule wallets, and swept into Binance Hot Wallet 14."
  },
  {
    id: "CASE_2_MUM_FAKE_TRADING_APP",
    title: "Mumbai Fake Institutional Stock Trading App Fraud",
    ncrp_id: "2026-NCRP-448102",
    fir_no: "FIR-2026-MUM-CY-01189",
    police_station: "Cyber Crime Police Station, Bandra Kurla Complex (BKC)",
    state_ut: "Maharashtra",
    victim_loss_inr: 12000000.0,
    asset: "USDT (Polygon PoS)",
    network: "POL",
    suspect_wallet: "0x71aC4e8812fB567c9d01234567890abcdef12345",
    summary: "Victim invested ₹1.2 Crore in a fraudulent VIP institutional trading app. Polygon USDT routed through peel chain and swept into CoinDCX Primary Vault."
  },
  {
    id: "CASE_3_DEL_HOSPITAL_RANSOMWARE",
    title: "Delhi Critical Infrastructure Hospital Ransomware Extortion",
    ncrp_id: "2026-NCRP-119283",
    fir_no: "FIR-2026-DEL-IFSO-00084",
    police_station: "Special Cell (IFSO), Delhi Police",
    state_ut: "Delhi",
    victim_loss_inr: 14500000.0,
    asset: "BTC",
    network: "BTC",
    suspect_wallet: "bc1qar0s523456789abcdef0123456789abcdef01",
    summary: "Hospital database encrypted; ransom demand of 2.50 BTC. Ransomware operator peels BTC through intermediary SegWit mules before depositing into WazirX."
  }
];

const SESSION_STORAGE_KEY = "chakra_active_investigation_store";

const INITIAL_PROGRESS: InvestigationProgressState = {
  step1_intake: false,
  step2_graph: false,
  step3_sweep: false,
  step4_scoring: false,
  step5_statutory: false
};

interface SavedInvestigationStore {
  progress?: InvestigationProgressState;
  selectedScenarioId?: string;
  activeAttribution?: AttributionResponse | null;
  activeTab?: ActiveTab;
}

const loadInitialStore = (): {
  progress: InvestigationProgressState;
  activeAttribution: AttributionResponse | null;
  activeTab: ActiveTab;
  savedScenarioId: string | null;
} => {
  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const parsed: SavedInvestigationStore = JSON.parse(raw);
      return {
        progress: { ...INITIAL_PROGRESS, ...(parsed.progress || {}) },
        activeAttribution: parsed.activeAttribution || null,
        activeTab: parsed.activeTab || "intake",
        savedScenarioId: parsed.selectedScenarioId || null
      };
    }
  } catch (e) {
    console.warn("Failed to restore investigation store from sessionStorage:", e);
  }
  return {
    progress: INITIAL_PROGRESS,
    activeAttribution: null,
    activeTab: "intake",
    savedScenarioId: null
  };
};

export const App: React.FC = () => {
  const initialStore = loadInitialStore();
  const [allUsers, setAllUsers] = useState<AuthUser[]>(FALLBACK_USERS);
  const [currentUser, setCurrentUser] = useState<AuthUser>(FALLBACK_USERS[0]);
  const [scenarios, setScenarios] = useState<ScenarioMetadata[]>(FALLBACK_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioMetadata | null>(FALLBACK_SCENARIOS[0]);
  const [activeAttribution, setActiveAttribution] = useState<AttributionResponse | null>(initialStore.activeAttribution);
  const [progress, setProgress] = useState<InvestigationProgressState>(initialStore.progress);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialStore.activeTab);

  const [isTracing, setIsTracing] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [showNoticeModal, setShowNoticeModal] = useState<boolean>(false);
  const [showAdHocModal, setShowAdHocModal] = useState<boolean>(false);
  const [showMerkleModal, setShowMerkleModal] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Rule 13: Sync central reactive state store to sessionStorage
  useEffect(() => {
    try {
      const payload: SavedInvestigationStore = {
        progress,
        selectedScenarioId: selectedScenario?.id,
        activeAttribution,
        activeTab
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn("Failed to persist investigation store:", e);
    }
  }, [progress, selectedScenario, activeAttribution, activeTab]);

  // Initial load: Fetch RBAC users, scenarios, and initial trace
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [usersData, scenariosData] = await Promise.all([
          api.getRbacUsers().catch(() => FALLBACK_USERS),
          api.getScenarios().catch(() => [])
        ]);

        setAllUsers(usersData);
        // Bind permanently to designated Investigating Officer desk
        const ioUser = usersData.find((u) => u.role === "INVESTIGATING_OFFICER") || FALLBACK_USERS[0];
        setCurrentUser(ioUser);

        const effectiveScenarios = scenariosData && scenariosData.length > 0 ? scenariosData : FALLBACK_SCENARIOS;
        setScenarios(effectiveScenarios);
        const initialScenario = initialStore.savedScenarioId
          ? effectiveScenarios.find((s) => s.id === initialStore.savedScenarioId) || effectiveScenarios[0]
          : effectiveScenarios[0];
        setSelectedScenario(initialScenario);

        // Initial load: do not auto-run trace so fresh sessions start with only Stage 1 accessible
      } catch (e: unknown) {
        console.error("Initialization error:", e);
      }
    };

    initializeDashboard();
  }, []);

  const handleSelectUser = (_user: AuthUser) => {
    showToast("Statutory Notice: CHAKRA MVP is custom-engineered specifically for the Investigating Officer (IO / SHO) desk.");
  };

  const handleSelectScenario = async (scenario: ScenarioMetadata) => {
    setSelectedScenario(scenario);
    setIsTracing(true);
    try {
      const res = await api.traceAttribution({
        sahyog_case_id: scenario.fir_no,
        ncrp_complaint_id: scenario.ncrp_id,
        suspect_wallet_address: scenario.suspect_wallet,
        network: scenario.network,
        reported_fraud_amount_inr: scenario.victim_loss_inr,
        max_hops: 5,
        dust_threshold_usd: 10.0
      });
      setActiveAttribution(res);
      setProgress({
        step1_intake: true,
        step2_graph: false,
        step3_sweep: false,
        step4_scoring: false,
        step5_statutory: false
      });
      showToast(`Loaded Docket: ${scenario.title}`);
    } catch (e: unknown) {
      showToast(`Trace error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsTracing(false);
    }
  };

  const handleRequestTrace = async (req: AttributionRequest) => {
    setIsTracing(true);
    try {
      const res = await api.traceAttribution(req);
      setActiveAttribution(res);
      setProgress({
        step1_intake: true,
        step2_graph: false,
        step3_sweep: false,
        step4_scoring: false,
        step5_statutory: false
      });
      showToast(`Attribution Complete: Resolved to ${res.nearest_vasp || "Unknown"} (${res.confidence_score.toFixed(1)}%)`);
      // Stepwise advancement to graph view upon trace completion
      setActiveTab("graph");
    } catch (e: unknown) {
      showToast(`Attribution failure: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsTracing(false);
    }
  };

  const handleInjectAdHocGraph = async (injection: CustomGraphInjectionRequest) => {
    setIsTracing(true);
    try {
      const res = await api.injectCustomGraph(injection);
      setActiveAttribution(res);
      setProgress({
        step1_intake: true,
        step2_graph: false,
        step3_sweep: false,
        step4_scoring: false,
        step5_statutory: false
      });
      showToast(`Ad-Hoc Graph Ingested! Attributed to ${res.nearest_vasp} in ${res.hop_distance} hops.`);
      setActiveTab("graph");
    } catch (e: unknown) {
      showToast(`Injection error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsTracing(false);
    }
  };

  const handleResetGraph = async () => {
    setIsResetting(true);
    try {
      await api.resetGraphState();
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      setProgress(INITIAL_PROGRESS);
      setActiveAttribution(null);
      setActiveTab("intake");
      showToast("Investigation state reset to authentic Indian baseline scenarios.");
    } catch (e: unknown) {
      showToast(`Reset error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsResetting(false);
    }
  };

  // Tab Navigation: Only switches tab viewport, does NOT modify progress flags
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  // Strict Linear Stage Advancement Handlers (called by Stepwise Action Docks)
  const handleAdvanceToStage2 = () => {
    setProgress((prev) => ({ ...prev, step1_intake: true }));
    setActiveTab("graph");
  };

  const handleAdvanceToStage3 = () => {
    setProgress((prev) => ({ ...prev, step2_graph: true }));
    setActiveTab("sweep");
  };

  const handleAdvanceToStage4 = () => {
    setProgress((prev) => ({ ...prev, step3_sweep: true }));
    setActiveTab("scoring");
  };

  const handleAdvanceToStage5 = () => {
    setProgress((prev) => ({ ...prev, step4_scoring: true, step5_statutory: true }));
    setActiveTab("statutory");
  };

  // PDF Download Handlers
  const handleDownloadDossierPdf = async () => {
    if (!activeAttribution) return;
    try {
      showToast("Compiling Executive Attribution Dossier PDF...");
      await api.downloadPdfBlob(
        "dossier/pdf",
        activeAttribution,
        `CHAKRA_Dossier_${activeAttribution.sahyog_case_id}.pdf`
      );
      showToast("Executive Dossier downloaded successfully.");
    } catch (e: unknown) {
      showToast(`Download error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDownloadSummonsPdf = async () => {
    if (!activeAttribution) return;
    try {
      showToast("Compiling Section 94 BNSS Statutory Summons PDF...");
      await api.downloadPdfBlob(
        "bnss-summons/pdf",
        activeAttribution,
        `BNSS_Notice_${activeAttribution.sahyog_case_id}.pdf`
      );
      showToast("Section 94 BNSS Summons downloaded.");
    } catch (e: unknown) {
      showToast(`Download error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const handleDownloadBsaPdf = async () => {
    if (!activeAttribution) return;
    try {
      showToast("Compiling Section 63(4) BSA 2023 Digital Evidence Certificate PDF...");
      await api.downloadPdfBlob(
        "bsa-certificate/pdf",
        activeAttribution,
        `BSA_Sec63_Certificate_${activeAttribution.sahyog_case_id}.pdf`
      );
      showToast("BSA 63(4) Evidence Certificate downloaded.");
    } catch (e: unknown) {
      showToast(`Download error: ${e instanceof Error ? e.message : String(e)}`);
    }
  };

  const isHighConfidence = Boolean(activeAttribution && activeAttribution.confidence_score >= 85.0);

  return (
    <div className="chakra-app-container">
      {/* 1. Official Government Header */}
      <Header
        currentUser={currentUser}
        allUsers={allUsers}
        onSelectUser={handleSelectUser}
        activeAttribution={activeAttribution}
        onResetGraph={handleResetGraph}
        isResetting={isResetting}
      />

      {/* 2. 5-Stage National Law Enforcement Navigation Bar (Linear Stepwise Gated) */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={handleSelectTab}
        progress={progress}
        hasAttribution={Boolean(activeAttribution)}
        isHighConfidence={isHighConfidence}
      />

      {/* 3. Main Stage Content Viewport */}
      <main className="chakra-main-content">
        <div className="chakra-stage-container">
          {/* STAGE 1: Case Intake & NCRP Incident Docket */}
          {activeTab === "intake" && (
            <div className="chakra-stage-grid-intake">
              {/* Active Incident Docket & Quick-Dispatch Bar (Full-Width Top Bar) */}
              <div className="gov-active-docket-bar">
                <div className="gov-docket-bar-left">
                  <span style={{ fontSize: "10px", fontWeight: 800, background: "#0B1B3D", color: "#FFFFFF", padding: "2px 7px", borderRadius: "3px" }}>
                    ACTIVE INCIDENT DOCKET
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0B1B3D" }}>
                    FIR: <span style={{ fontFamily: "var(--font-mono)" }}>{activeAttribution?.sahyog_case_id || selectedScenario?.fir_no || "FIR-2026-BLR-CY-00412"}</span>
                  </span>
                  <span style={{ color: "#94A3B8" }}>•</span>
                  <span style={{ fontSize: "11.5px", color: "#334155" }}>
                    NCRP: <span style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>{activeAttribution?.ncrp_complaint_id || selectedScenario?.ncrp_id || "2026-NCRP-339182"}</span>
                  </span>
                  <span style={{ color: "#94A3B8" }}>•</span>
                  <span style={{ fontSize: "11.5px", color: "#334155" }}>
                    Attributed VASP: <b style={{ color: activeAttribution ? "#047857" : "#94A3B8" }}>{activeAttribution?.nearest_vasp || "Awaiting Attribution"}</b>
                  </span>
                  <span style={{ color: "#94A3B8" }}>•</span>
                  <span style={{ fontSize: "11.5px", color: "#334155" }}>
                    Confidence: <b style={{ color: isHighConfidence ? "#047857" : "#D97706" }}>
                      {activeAttribution ? `${activeAttribution.confidence_score.toFixed(1)} / 100 (${activeAttribution.confidence_tier})` : "Pending Trace"}
                    </b>
                  </span>
                </div>

                <div className="gov-docket-bar-actions">
                  <button
                    className="gov-btn gov-btn-primary"
                    onClick={handleAdvanceToStage2}
                    disabled={!activeAttribution}
                    style={{ padding: "6px 12px", fontSize: "11.5px", opacity: !activeAttribution ? 0.5 : 1, cursor: !activeAttribution ? "not-allowed" : "pointer" }}
                  >
                    <Share2 size={13} /> Open Multi-Chain Graph Canvas (Stage 2) <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Balanced 2-Column Workstation */}
              <CaseIntakePanel
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onSelectScenario={handleSelectScenario}
                onRequestTrace={handleRequestTrace}
                onOpenAdHocModal={() => setShowAdHocModal(true)}
                isTracing={isTracing}
              />
            </div>
          )}

          {/* STAGE 2: Multi-Chain Attribution Canvas */}
          {activeTab === "graph" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <AttributionGraph
                attribution={activeAttribution}
                isLoading={isTracing}
              />

              {/* Stepwise Linear Progression Action Dock (Stage 2 -> Stage 3) */}
              <div className="chakra-stage-action-dock">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>
                    Multi-Chain Attribution Canvas Verified: 3 Unhosted Mule Wallets → 1 Candidate Deposit → VASP Hot Wallet.
                  </span>
                </div>
                <button
                  className="gov-btn gov-btn-primary"
                  onClick={handleAdvanceToStage3}
                  style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 700 }}
                >
                  Proceed to Stage 3: Sweep Forensics & Fueler Lab <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 3: Sweep Forensics & Fueler Lab */}
          {activeTab === "sweep" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <SweepForensicLab attribution={activeAttribution} />

              {/* Stepwise Linear Progression Action Dock (Stage 3 -> Stage 4) */}
              <div className="chakra-stage-action-dock">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>
                    Sweep Forensics Audited: Omnibus internal sweep & VASP gas fueler sponsorship confirmed.
                  </span>
                </div>
                <button
                  className="gov-btn gov-btn-primary"
                  onClick={handleAdvanceToStage4}
                  style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 700 }}
                >
                  Proceed to Stage 4: 4-Pillar Confidence Scorer <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 4: 4-Pillar Confidence Scorer */}
          {activeTab === "scoring" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <ScoringMatrixPanel attribution={activeAttribution} />

              {/* Stepwise Linear Progression Action Dock (Stage 4 -> Stage 5) */}
              <div className="chakra-stage-action-dock">
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <CheckCircle2 size={16} color="#059669" />
                  <span style={{ fontSize: "12px", color: "#334155", fontWeight: 600 }}>
                    4-Pillar Admissibility Score Verified: {activeAttribution?.confidence_score.toFixed(1) || "94.0"}/100 {isHighConfidence ? "meets statutory criteria for Section 106 BNSS 2023 action." : "below statutory threshold (<85%)."}
                  </span>
                </div>
                <button
                  className="gov-btn gov-btn-saffron"
                  disabled={!isHighConfidence}
                  onClick={handleAdvanceToStage5}
                  style={{ padding: "8px 16px", fontSize: "12px", fontWeight: 700 }}
                  title={!isHighConfidence ? "Requires Confidence Score >= 85%" : "Proceed to Court Sanctions"}
                >
                  Proceed to Stage 5: SAHYOG Sanctions & Court Docket <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STAGE 5: SAHYOG Sanctions & Court Docket */}
          {activeTab === "statutory" && (
            <StatutoryCourtDocket
              attribution={activeAttribution}
              currentUser={currentUser}
              onOpenNoticeModal={() => setShowNoticeModal(true)}
              onOpenMerkleModal={() => setShowMerkleModal(true)}
              onDownloadDossierPdf={handleDownloadDossierPdf}
              onDownloadSummonsPdf={handleDownloadSummonsPdf}
              onDownloadBsaPdf={handleDownloadBsaPdf}
            />
          )}
        </div>
      </main>

      {/* 4. Official Government Footer */}
      <footer className="chakra-footer">
        <div>
          <b>Project CHAKRA</b> • Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs, Government of India
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>GIGW & UX4G Compliant</span>
          <span>•</span>
          <span>Section 63(4) BSA 2023 Certified</span>
          <span>•</span>
          <span>SAHYOG API v2 Interoperable</span>
        </div>
      </footer>

      {/* Modals */}
      {activeAttribution && (
        <>
          <StatutoryNoticeModal
            isOpen={showNoticeModal}
            onClose={() => setShowNoticeModal(false)}
            attribution={activeAttribution}
            currentUser={currentUser}
          />
          <MerkleAuditModal
            isOpen={showMerkleModal}
            onClose={() => setShowMerkleModal(false)}
            attribution={activeAttribution}
          />
        </>
      )}

      <JuryInjectionModal
        isOpen={showAdHocModal}
        onClose={() => setShowAdHocModal(false)}
        onInject={handleInjectAdHocGraph}
        isLoading={isTracing}
      />

      {/* Interactive Toast Notifications */}
      {toastMessage && (
        <div className="chakra-toast">
          <CheckCircle2 size={16} color="#34D399" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
