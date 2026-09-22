import React, { useState, useEffect } from "react";
import type {
  AuthUser,
  ScenarioMetadata,
  AttributionResponse,
  AttributionRequest,
  CustomGraphInjectionRequest,
  ActiveTab
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

export const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<AuthUser[]>(FALLBACK_USERS);
  const [currentUser, setCurrentUser] = useState<AuthUser>(FALLBACK_USERS[0]);
  const [scenarios, setScenarios] = useState<ScenarioMetadata[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioMetadata | null>(null);
  const [activeAttribution, setActiveAttribution] = useState<AttributionResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>("intake");

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

  // Initial load: Fetch RBAC users, scenarios, and initial trace
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const [usersData, scenariosData] = await Promise.all([
          api.getRbacUsers().catch(() => FALLBACK_USERS),
          api.getScenarios().catch(() => [])
        ]);

        setAllUsers(usersData);
        if (usersData.length > 0) {
          setCurrentUser(usersData[0]);
        }

        setScenarios(scenariosData);
        if (scenariosData.length > 0) {
          const firstScenario = scenariosData[0];
          setSelectedScenario(firstScenario);

          // Trigger initial automated trace for Bengaluru Task Fraud
          setIsTracing(true);
          try {
            const initialResult = await api.traceAttribution({
              sahyog_case_id: firstScenario.fir_no,
              ncrp_complaint_id: firstScenario.ncrp_id,
              suspect_wallet_address: firstScenario.suspect_wallet,
              network: firstScenario.network,
              reported_fraud_amount_inr: firstScenario.victim_loss_inr,
              max_hops: 5,
              dust_threshold_usd: 10.0
            });
            setActiveAttribution(initialResult);
          } catch (err: unknown) {
            console.error("Initial trace failed:", err);
          } finally {
            setIsTracing(false);
          }
        }
      } catch (e: unknown) {
        console.error("Initialization error:", e);
      }
    };

    initializeDashboard();
  }, []);

  const handleSelectUser = (user: AuthUser) => {
    setCurrentUser(user);
    api.setUserRole(user.key);
    showToast(`Active Session switched to: ${user.name} (${user.role})`);
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
      showToast(`Attribution Complete: Resolved to ${res.nearest_vasp || "Unknown"} (${res.confidence_score.toFixed(1)}%)`);
      // Seamlessly advance to graph view upon trace completion
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
      if (selectedScenario) {
        await handleSelectScenario(selectedScenario);
      }
      showToast("Graph Store reset to authentic Indian baseline scenarios.");
    } catch (e: unknown) {
      showToast(`Reset error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setIsResetting(false);
    }
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

      {/* 2. 5-Stage National Law Enforcement Navigation Bar */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        hasAttribution={Boolean(activeAttribution)}
        isHighConfidence={isHighConfidence}
      />

      {/* 3. Main Stage Content Viewport */}
      <main className="chakra-main-content">
        <div className="chakra-stage-container">
          {/* STAGE 1: Case Intake & NCRP Incident Docket */}
          {activeTab === "intake" && (
            <div className="chakra-stage-grid-intake">
              <CaseIntakePanel
                scenarios={scenarios}
                selectedScenario={selectedScenario}
                onSelectScenario={handleSelectScenario}
                onRequestTrace={handleRequestTrace}
                onOpenAdHocModal={() => setShowAdHocModal(true)}
                isTracing={isTracing}
              />

              {/* Stage 1 Executive Incident Briefing Card */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="gov-card">
                  <div className="gov-card-header">
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <FileText size={16} color="#0B1B3D" />
                      <span className="gov-card-title">National Cyber Crime Operations Briefing</span>
                    </div>
                    <span style={{ fontSize: "10.5px", background: "#EFF6FF", color: "#1E40AF", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                      MHA SAHYOG v2 READY
                    </span>
                  </div>

                  <div className="gov-card-body" style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div style={{ fontSize: "12px", color: "#334155", lineHeight: "1.6" }}>
                      Welcome to <b>Project CHAKRA</b> (Centralized High-Confidence Automated Khata Resolution & Attribution), the national cryptocurrency intelligence and automated summons generation system developed for the <b>Ministry of Home Affairs (MHA)</b> and <b>Indian Cyber Crime Coordination Centre (I4C)</b>.
                    </div>

                    {activeAttribution ? (
                      <div style={{ background: "#F8FAFC", border: "1px solid #CBD5E1", borderRadius: "6px", padding: "14px" }}>
                        <div style={{ fontSize: "11px", fontWeight: 800, color: "#0B1B3D", marginBottom: "8px" }}>
                          CURRENT ACTIVE INVESTIGATION DOCKET:
                        </div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "11.5px" }}>
                          <div>
                            <span style={{ color: "#64748B" }}>FIR Docket:</span><br />
                            <b style={{ color: "#0B1B3D" }}>{activeAttribution.sahyog_case_id}</b>
                          </div>
                          <div>
                            <span style={{ color: "#64748B" }}>NCRP Portal ID:</span><br />
                            <b style={{ color: "#0B1B3D" }}>{activeAttribution.ncrp_complaint_id}</b>
                          </div>
                          <div>
                            <span style={{ color: "#64748B" }}>Attributed VASP:</span><br />
                            <b style={{ color: "#047857" }}>{activeAttribution.nearest_vasp || "Unknown"}</b>
                          </div>
                          <div>
                            <span style={{ color: "#64748B" }}>Confidence Score:</span><br />
                            <b style={{ color: isHighConfidence ? "#047857" : "#D97706" }}>
                              {activeAttribution.confidence_score.toFixed(1)} / 100 ({activeAttribution.confidence_tier})
                            </b>
                          </div>
                        </div>

                        <div style={{ marginTop: "14px", display: "flex", gap: "10px" }}>
                          <button
                            className="gov-btn gov-btn-primary"
                            onClick={() => setActiveTab("graph")}
                            style={{ flex: 1, padding: "9px" }}
                          >
                            <Share2 size={14} /> Open Multi-Chain Graph Canvas (Stage 2) <ArrowRight size={14} />
                          </button>
                          <button
                            className="gov-btn gov-btn-saffron"
                            onClick={() => setActiveTab("statutory")}
                            style={{ flex: 1, padding: "9px" }}
                          >
                            <Scale size={14} /> View Statutory Sanctions (Stage 5) <ArrowRight size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div style={{ background: "#F1F5F9", padding: "14px", borderRadius: "6px", fontSize: "11.5px", color: "#64748B" }}>
                        Select an authentic Indian cybercrime case preset on the left or enter a suspect wallet address to initiate degree-bounded traversal.
                      </div>
                    )}

                    {/* Operational Capabilities Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "4px" }}>
                      <div style={{ border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px" }}>
                        <div style={{ fontWeight: 700, fontSize: "11.5px", color: "#0B1B3D", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Share2 size={13} color="#1E3A8A" /> Multi-Chain Graph Traversal
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                          Degree-Bounded Beam Search across TRON, ETH, BTC, and BSC with algorithmic peeling chain detection.
                        </div>
                      </div>

                      <div style={{ border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px" }}>
                        <div style={{ fontWeight: 700, fontSize: "11.5px", color: "#0B1B3D", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Flame size={13} color="#E65100" /> Internal VASP Sweep Forensics
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                          Proves centralized exchange custody via &gt;95% balance zeroing, &lt;120m latency, and fueler gas proofs.
                        </div>
                      </div>

                      <div style={{ border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px" }}>
                        <div style={{ fontWeight: 700, fontSize: "11.5px", color: "#0B1B3D", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Award size={13} color="#047857" /> 4-Pillar Explainable Scorer
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                          Deterministic formula transparently maps to statutory tiers under Section 94 and 106 BNSS 2023.
                        </div>
                      </div>

                      <div style={{ border: "1px solid #E2E8F0", borderRadius: "6px", padding: "10px" }}>
                        <div style={{ fontWeight: 700, fontSize: "11.5px", color: "#0B1B3D", display: "flex", alignItems: "center", gap: "4px" }}>
                          <Scale size={13} color="#7C3AED" /> Court-Admissible BSA Evidence
                        </div>
                        <div style={{ fontSize: "10.5px", color: "#64748B", marginTop: "2px" }}>
                          Generates SHA-256 Merkle inclusion proofs and Section 63(4) BSA 2023 digital certificates.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STAGE 2: Multi-Chain Attribution Canvas */}
          {activeTab === "graph" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <AttributionGraph
                attribution={activeAttribution}
                isLoading={isTracing}
              />
            </div>
          )}

          {/* STAGE 3: Sweep Forensics & Fueler Lab */}
          {activeTab === "sweep" && (
            <SweepForensicLab attribution={activeAttribution} />
          )}

          {/* STAGE 4: 4-Pillar Confidence Scorer */}
          {activeTab === "scoring" && (
            <ScoringMatrixPanel attribution={activeAttribution} />
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
