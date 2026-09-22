import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { Core, NodeSingular } from "cytoscape";
import type { FullCaseDossier, ActiveInvestigationStore, CytoscapeElement, GraphNodeData, GraphEdgeData } from "../types";
import {
  Share2,
  Route,
  RotateCcw,
  Info,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock
} from "lucide-react";

// 5-Column Balanced Spatial Coordinates:
// Bounded within X: 100-980, Y: 100-420 so all 14 nodes frame 100% inside the viewport on all screens
const FORENSIC_COORDINATES: Record<string, { x: number; y: number }> = {
  // Column 1: Tor Recon & Clearnet Origin (X: 100)
  "server-origin-mumbai": { x: 100, y: 100 },
  "ip-origin-mumbai": { x: 100, y: 100 },
  "onion-bharatleaks": { x: 100, y: 260 },
  "hs-bharatleaks": { x: 100, y: 260 },
  "domain-clearnet": { x: 100, y: 420 },

  // Column 2: Extortion Cryptocurrency Wallets (X: 320)
  "wallet-btc-intake": { x: 320, y: 150 },
  "wallet-tron-intake": { x: 320, y: 370 },
  "wallet-trx-usdt": { x: 320, y: 370 },

  // Column 3: Intermediate Laundering & Underground Personas (X: 540)
  "wallet-btc-unhosted": { x: 540, y: 120 },
  "handle-chanakya": { x: 540, y: 260 },
  "persona-chanakya": { x: 540, y: 260 },
  "handle-vikramaditya": { x: 540, y: 400 },
  "persona-vikramaditya": { x: 540, y: 400 },

  // Column 4: Cryptographic Keys, Email & Residence (X: 760)
  "pgp-cryptoshadow": { x: 760, y: 120 },
  "pgp-master-rohan": { x: 760, y: 120 },
  "email-cryptoshadow": { x: 760, y: 260 },
  "email-proton": { x: 760, y: 260 },
  "identity-residence": { x: 760, y: 400 },
  "residence-bengaluru": { x: 760, y: 400 },

  // Column 5: Regulated Indian VASP & Primary Accused (X: 980)
  "vasp-coindcx-btc": { x: 980, y: 120 },
  "actor-rohan": { x: 980, y: 260 }, // Focal Accused
  "vasp-coindcx-tron": { x: 980, y: 400 },
  "vasp-coindcx-usdt": { x: 980, y: 400 }
};

// Clean, high-contrast labels to prevent text collisions
const CLEAN_NODE_LABELS: Record<string, string> = {
  "actor-rohan": "Rohan Sharma [Accused]",
  "server-origin-mumbai": "103.152.18.42 [Origin IP]",
  "ip-origin-mumbai": "103.152.18.42 [Origin IP]",
  "onion-bharatleaks": "bharatleaks.onion [Tor v3]",
  "hs-bharatleaks": "bharatleaks.onion [Tor v3]",
  "domain-clearnet": "api.bharatleaks-staging.in",
  "handle-chanakya": "Chanakya_Zero [Exploit]",
  "persona-chanakya": "Chanakya_Zero [Exploit]",
  "handle-vikramaditya": "Vikramaditya0x [Dread]",
  "persona-vikramaditya": "Vikramaditya0x [Dread]",
  "pgp-cryptoshadow": "PGP: 9A4F3B21... (RSA-4096)",
  "pgp-master-rohan": "PGP: 9A4F3B21... (RSA-4096)",
  "email-cryptoshadow": "cryptoshadow_in@proton.me",
  "email-proton": "cryptoshadow_in@proton.me",
  "wallet-btc-intake": "BTC Intake (5.5 BTC)",
  "wallet-tron-intake": "TRC-20 Intake (50k USDT)",
  "wallet-trx-usdt": "TRC-20 Intake (50k USDT)",
  "wallet-btc-unhosted": "Co-spent Cluster (3J98t...)",
  "vasp-coindcx-btc": "CoinDCX (BTC Deposit)",
  "vasp-coindcx-tron": "CoinDCX (TRX Deposit)",
  "vasp-coindcx-usdt": "CoinDCX (TRX Deposit)",
  "identity-residence": "Residence: Indiranagar, Bengaluru",
  "residence-bengaluru": "Residence: Indiranagar, Bengaluru"
};

// Verified, immutable forensic blockchain hop records
const FORENSIC_BLOCKCHAIN_HOPS = [
  {
    step: 1,
    phase: "Extortion Ingestion",
    heuristic: "Multi-Input Common Spend (MICH)",
    asset: "BTC",
    fromLabel: "Extortion Intake Wallet",
    fromAddress: "bc1q9xdesi842...",
    toLabel: "Unhosted Co-spent Cluster",
    toAddress: "3J98t1WpEZ...",
    amountCrypto: "5.50 BTC",
    amountInr: "₹3,42,10,000",
    groundedStatus: "GROUNDED (MICH CLUSTER)"
  },
  {
    step: 2,
    phase: "Laundering & VASP Sweep",
    heuristic: "Automated Settlement Sweep",
    asset: "BTC",
    fromLabel: "Intermediate BTC Cluster",
    fromAddress: "3J98t1WpEZ...",
    toLabel: "CoinDCX Exchange Deposit",
    toAddress: "CDX-IN-9081245",
    amountCrypto: "5.48 BTC",
    amountInr: "₹3,40,85,000",
    groundedStatus: "PAN KYC MATCH (COINDCX)"
  },
  {
    step: 3,
    phase: "Stablecoin Extortion Ingestion",
    heuristic: "TRC-20 Event Log Trace",
    asset: "TRC-20",
    fromLabel: "Tron Extortion Wallet",
    fromAddress: "TXdesi8042a...",
    toLabel: "CoinDCX TRX Deposit (Rohan Sharma)",
    toAddress: "CDX-TRX-449102",
    amountCrypto: "50,000 USDT",
    amountInr: "₹41,50,000",
    groundedStatus: "AADHAAR VERIFIED (TRX)"
  }
];

interface AttributionGraphProps {
  dossier: FullCaseDossier;
  store: ActiveInvestigationStore;
  isActiveTab: boolean;
  onSynthesizeGraph: () => void;
  onTraceCompleted: (activeHop: number | null) => void;
  onReset: () => void;
  onNavigateNext?: () => void;
}

// Forensic Stage Groupings for Dynamic Graph Ingestion
const STAGE_NODES: Record<number, string[]> = {
  1: ["server-origin-mumbai", "ip-origin-mumbai", "onion-bharatleaks", "hs-bharatleaks", "domain-clearnet"],
  2: ["wallet-btc-intake", "wallet-tron-intake", "wallet-trx-usdt", "wallet-btc-unhosted"],
  3: ["handle-chanakya", "persona-chanakya", "handle-vikramaditya", "persona-vikramaditya", "pgp-cryptoshadow", "pgp-master-rohan", "email-cryptoshadow", "email-proton"],
  4: ["vasp-coindcx-btc", "vasp-coindcx-tron", "vasp-coindcx-usdt", "identity-residence", "residence-bengaluru", "actor-rohan"]
};

export const AttributionGraph: React.FC<AttributionGraphProps> = ({
  dossier,
  store,
  isActiveTab,
  onSynthesizeGraph,
  onTraceCompleted,
  onReset,
  onNavigateNext
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cyRef = useRef<Core | null>(null);
  const traceAbortIdRef = useRef<number>(0);

  const [selectedNode, setSelectedNode] = useState<GraphNodeData | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<GraphEdgeData | null>(null);
  const [isPathActive, setIsPathActive] = useState<boolean>(store.engine2Traced);
  const [activeHopStep, setActiveHopStep] = useState<number | null>(store.engine2ActiveHop);
  const [tracingStatus, setTracingStatus] = useState<string | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [_synthesisStage, setSynthesisStage] = useState<number>(0);

  // Helper to construct elements for a given set of allowed node IDs
  const getCytoscapeElements = (allowedNodeIds?: Set<string>): CytoscapeElement[] => {
    const elements: CytoscapeElement[] = [];
    const includedNodeIds = new Set<string>();

    (dossier.graph_nodes || []).forEach((n) => {
      if (!allowedNodeIds || allowedNodeIds.has(n.id)) {
        const pos = FORENSIC_COORDINATES[n.id] || { x: 500, y: 260 };
        const displayLabel = CLEAN_NODE_LABELS[n.id] || n.label;
        elements.push({
          data: {
            id: n.id,
            label: displayLabel,
            fullLabel: n.label,
            type: n.type,
            category: n.category,
            confidence: n.confidence
          },
          position: { x: pos.x, y: pos.y }
        });
        includedNodeIds.add(n.id);
      }
    });

    (dossier.graph_edges || []).forEach((e, idx) => {
      if (includedNodeIds.has(e.source) && includedNodeIds.has(e.target)) {
        elements.push({
          data: {
            id: `edge-${idx}`,
            source: e.source,
            target: e.target,
            label: e.label,
            weight: e.weight
          }
        });
      }
    });

    return elements;
  };

  const cyStyle = [
    {
      selector: "node",
      style: {
        label: "data(label)",
        "font-family": "Inter, sans-serif",
        "font-size": "11px",
        "font-weight": "bold",
        "text-valign": "bottom",
        "text-margin-y": 8,
        color: "#0F172A",
        "text-background-color": "#FFFFFF",
        "text-background-opacity": 0.95,
        "text-background-padding": 3,
        "text-background-shape": "roundrectangle",
        "text-border-color": "#CBD5E1",
        "text-border-width": 1,
        "text-border-opacity": 0.9,
        "background-color": "#475569",
        width: 38,
        height: 38,
        "border-width": 2.5,
        "border-color": "#FFFFFF"
      }
    },
    {
      selector: 'node[category = "primary"], node[id = "actor-rohan"]',
      style: {
        "background-color": "#DC2626",
        "border-color": "#991B1B",
        "border-width": 4,
        width: 54,
        height: 54,
        color: "#991B1B",
        "font-size": "12px",
        "text-border-color": "#FECACA"
      }
    },
    {
      selector: 'node[category = "persona"], node[id ^= "handle-"], node[id ^= "persona-"]',
      style: {
        "background-color": "#4F46E5",
        "border-color": "#3730A3",
        width: 42,
        height: 42,
        "text-border-color": "#C7D2FE"
      }
    },
    {
      selector: 'node[category = "key"], node[category = "crypto_id"], node[id ^= "pgp-"]',
      style: {
        "background-color": "#D97706",
        "border-color": "#B45309",
        width: 40,
        height: 40,
        "text-border-color": "#FDE68A"
      }
    },
    {
      selector: 'node[category = "infra"], node[id ^= "server-"], node[id ^= "onion-"], node[id ^= "domain-"], node[id ^= "ip-"], node[id ^= "hs-"]',
      style: {
        "background-color": "#0284C7",
        "border-color": "#0369A1",
        width: 40,
        height: 40,
        "text-border-color": "#BAE6FD"
      }
    },
    {
      selector: 'node[category = "wallet"], node[id ^= "wallet-"]',
      style: {
        "background-color": "#EA580C",
        "border-color": "#C2410C",
        width: 40,
        height: 40,
        "text-border-color": "#FED7AA"
      }
    },
    {
      selector: 'node[category = "vasp"], node[id ^= "vasp-"]',
      style: {
        "background-color": "#059669",
        "border-color": "#047857",
        width: 44,
        height: 44,
        "text-border-color": "#A7F3D0"
      }
    },
    {
      selector: 'node[category = "osint"], node[id ^= "identity-"], node[id ^= "residence-"], node[id ^= "email-"]',
      style: {
        "background-color": "#6366F1",
        "border-color": "#4338CA",
        width: 40,
        height: 40,
        "text-border-color": "#C7D2FE"
      }
    },
    {
      selector: "edge",
      style: {
        width: 2,
        "line-color": "#94A3B8",
        "target-arrow-color": "#64748B",
        "target-arrow-shape": "triangle",
        "arrow-scale": 0.85,
        "curve-style": "bezier"
      }
    },
    {
      selector: ".highlighted-node",
      style: {
        "border-color": "#D97706",
        "border-width": 6
      }
    },
    {
      selector: ".highlighted-edge",
      style: {
        width: 4.5,
        "line-color": "#D97706",
        "target-arrow-color": "#D97706",
        label: "data(label)",
        "font-family": "JetBrains Mono, monospace",
        "font-size": "9px",
        "font-weight": "bold",
        color: "#B45309",
        "text-rotation": "autorotate",
        "text-background-opacity": 0.96,
        "text-background-color": "#FFFFFF",
        "text-background-padding": 3,
        "text-background-shape": "roundrectangle",
        "text-border-color": "#D97706",
        "text-border-width": 1.5
      }
    },
    {
      selector: ".staged-hidden",
      style: {
        display: "none"
      }
    }
  ];

  const initCytoscapeInstance = (elements: CytoscapeElement[]): Core | null => {
    if (!containerRef.current) return null;

    traceAbortIdRef.current++;
    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      boxSelectionEnabled: false,
      autounselectify: false,
      minZoom: 0.35,
      maxZoom: 1.05,
      style: cyStyle as unknown as cytoscape.StylesheetStyle[],
      layout: {
        name: "preset",
        fit: true,
        padding: 35
      }
    });

    cy.on("tap", "node", (evt) => {
      const node: NodeSingular = evt.target;
      setSelectedNode(node.data());
      setSelectedEdge(null);
    });

    cy.on("tap", "edge", (evt) => {
      const edge = evt.target;
      setSelectedEdge(edge.data());
      setSelectedNode(null);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    cy.ready(() => {
      cy.resize();
      cy.fit(undefined, 35);
    });

    cyRef.current = cy;
    return cy;
  };

  // Mount/sync when dossier or synthesized status changes
  useEffect(() => {
    if (store.engine2Synthesized) {
      if (cyRef.current && cyRef.current.elements().length > 0 && !cyRef.current.destroyed()) {
        if (store.engine2Traced) {
          const traceNodes = ["wallet-btc-intake", "wallet-btc-unhosted", "vasp-coindcx-btc", "actor-rohan"];
          traceNodes.forEach((id) => cyRef.current?.$id(id).addClass("highlighted-node"));
          cyRef.current?.edges('[source = "wallet-btc-intake"][target = "wallet-btc-unhosted"]').addClass("highlighted-edge");
          cyRef.current?.edges('[source = "wallet-btc-unhosted"][target = "vasp-coindcx-btc"]').addClass("highlighted-edge");
          cyRef.current?.edges('[source = "vasp-coindcx-btc"][target = "actor-rohan"]').addClass("highlighted-edge");
          setIsPathActive(true);
          setActiveHopStep(store.engine2ActiveHop || 3);
        }
        return;
      }
      const allElements = getCytoscapeElements();
      const cy = initCytoscapeInstance(allElements);

      // Re-apply highlighted path if already traced
      if (cy && store.engine2Traced) {
        const traceNodes = ["wallet-btc-intake", "wallet-btc-unhosted", "vasp-coindcx-btc", "actor-rohan"];
        traceNodes.forEach((id) => cy.$id(id).addClass("highlighted-node"));
        cy.edges('[source = "wallet-btc-intake"][target = "wallet-btc-unhosted"]').addClass("highlighted-edge");
        cy.edges('[source = "wallet-btc-unhosted"][target = "vasp-coindcx-btc"]').addClass("highlighted-edge");
        cy.edges('[source = "vasp-coindcx-btc"][target = "actor-rohan"]').addClass("highlighted-edge");
        setIsPathActive(true);
        setActiveHopStep(store.engine2ActiveHop || 3);
      }
    }

    const cyInstance = cyRef.current;
    return () => {
      traceAbortIdRef.current++;
      if (cyInstance && !cyInstance.destroyed()) {
        cyInstance.destroy();
      }
    };
  }, [dossier, store.engine2Synthesized, store.engine2Traced, store.engine2ActiveHop]);

  // Viewport resize watcher when tab becomes active
  useEffect(() => {
    if (isActiveTab && cyRef.current) {
      const timer = setTimeout(() => {
        if (cyRef.current) {
          cyRef.current.resize();
          cyRef.current.fit(undefined, 35);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isActiveTab]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  // Dynamic 4-Stage Multi-Modal Ingestion & Synthesis Animation (Smooth Framing, Zero Zoom Blowout)
  const handleSynthesize = async () => {
    if (!containerRef.current) return;
    setIsSynthesizing(true);
    traceAbortIdRef.current++;

    const allElements = getCytoscapeElements();
    const cy = initCytoscapeInstance(allElements);
    if (!cy) return;

    // Immediately hide all elements so camera frames the full graph layout stably without zoom blowout
    cy.elements().addClass("staged-hidden");

    // Stage 1: Tor Recon & Origin IP (Column 1)
    setSynthesisStage(1);
    setTracingStatus("⚡ [Stage 1/4] Ingesting Tor v3 Reconnaissance & Leaked Origin IP (103.152.18.42)...");
    const stage1NodeIds = new Set(STAGE_NODES[1]);
    cy.nodes().filter((n) => stage1NodeIds.has(n.id())).removeClass("staged-hidden");
    cy.edges().forEach((e) => {
      if (!e.source().hasClass("staged-hidden") && !e.target().hasClass("staged-hidden")) {
        e.removeClass("staged-hidden");
      }
    });
    await delay(450);

    // Stage 2: Blockchain Ingestion & MICH Clustering (Column 2)
    setSynthesisStage(2);
    setTracingStatus("⚡ [Stage 2/4] Ingesting BTC/USDT Extortion Ingestion & Multi-Input Common-Spend Clusters...");
    const stage2NodeIds = new Set(STAGE_NODES[2]);
    cy.nodes().filter((n) => stage2NodeIds.has(n.id())).removeClass("staged-hidden");
    cy.edges().forEach((e) => {
      if (!e.source().hasClass("staged-hidden") && !e.target().hasClass("staged-hidden")) {
        e.removeClass("staged-hidden");
      }
    });
    await delay(450);

    // Stage 3: Underground Personas & PGP Key Anchor (Columns 3 & 4)
    setSynthesisStage(3);
    setTracingStatus("⚡ [Stage 3/4] Linking Dread/BreachForums Personas & RSA-4096 PGP Master Key Anchor...");
    const stage3NodeIds = new Set(STAGE_NODES[3]);
    cy.nodes().filter((n) => stage3NodeIds.has(n.id())).removeClass("staged-hidden");
    cy.edges().forEach((e) => {
      if (!e.source().hasClass("staged-hidden") && !e.target().hasClass("staged-hidden")) {
        e.removeClass("staged-hidden");
      }
    });
    await delay(450);

    // Stage 4: Regulated Indian VASP & Physical Ground Truth (Column 5)
    setSynthesisStage(4);
    setTracingStatus("⚡ [Stage 4/4] Grounding Regulated CoinDCX Domestic VASP & Primary Accused (Rohan Sharma)...");
    cy.elements().removeClass("staged-hidden");
    cy.animate({
      fit: {
        eles: cy.elements(),
        padding: 35
      },
      duration: 350
    });
    await delay(400);

    setTracingStatus("✓ Multi-Modal Knowledge Graph Ingested: 14 Nodes & 16 Edges Synthesized");
    setIsSynthesizing(false);
    onSynthesizeGraph();
  };

  // Synchronized BFS 3-hop trace highlighting
  const handleTracePath = async () => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    const currentTraceId = ++traceAbortIdRef.current;

    cy.elements().removeClass("highlighted-node highlighted-edge");
    setIsPathActive(true);

    const pathSequence = [
      {
        nodeId: "wallet-btc-intake",
        stepIndex: 1,
        desc: "Hop 1/3: Extortion Intake Wallet (bc1q9xdesi842...)",
        edgeToNext: "wallet-btc-unhosted"
      },
      {
        nodeId: "wallet-btc-unhosted",
        stepIndex: 2,
        desc: "Hop 2/3: Intermediate Co-spent Cluster (3J98t1WpEZ...)",
        edgeToNext: "vasp-coindcx-btc"
      },
      {
        nodeId: "vasp-coindcx-btc",
        stepIndex: 3,
        desc: "Hop 3/3: Regulated Indian VASP Settlement (CoinDCX Account #CDX-IN-9081245)",
        edgeToNext: "actor-rohan"
      },
      {
        nodeId: "actor-rohan",
        stepIndex: 3,
        desc: "Attribution Complete: Grounded to Accused (Rohan Sharma • Indiranagar, Bengaluru)",
        edgeToNext: null
      }
    ];

    for (let i = 0; i < pathSequence.length; i++) {
      if (traceAbortIdRef.current !== currentTraceId || !cyRef.current) return;

      const step = pathSequence[i];
      setTracingStatus(`⚡ ${step.desc}`);
      setActiveHopStep(step.stepIndex);

      const nodeEle = cy.$id(step.nodeId);
      nodeEle.addClass("highlighted-node");

      if (step.edgeToNext) {
        const u = step.nodeId;
        const v = step.edgeToNext;
        cy.edges(`[source = "${u}"][target = "${v}"], [source = "${v}"][target = "${u}"]`).addClass("highlighted-edge");
      }

      await delay(400);
    }

    if (traceAbortIdRef.current !== currentTraceId || !cyRef.current) return;

    cy.animate({
      fit: {
        eles: cy.elements(),
        padding: 35
      },
      duration: 350
    });

    onTraceCompleted(3);
  };

  // Click-to-focus on table hop
  const handleHopRowClick = (hopIndex: number) => {
    setActiveHopStep(hopIndex);
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.elements().removeClass("highlighted-node highlighted-edge");

    if (hopIndex === 1) {
      cy.$id("wallet-btc-intake").addClass("highlighted-node");
      cy.$id("wallet-btc-unhosted").addClass("highlighted-node");
      cy.edges('[source = "wallet-btc-intake"][target = "wallet-btc-unhosted"]').addClass("highlighted-edge");
      cy.animate({ center: { eles: cy.$("#wallet-btc-intake, #wallet-btc-unhosted") }, zoom: 1.15, duration: 300 });
      setTracingStatus("Hop 1 Selected: Extortion Intake -> Unhosted Co-spent Cluster (MICH Heuristic)");
    } else if (hopIndex === 2) {
      cy.$id("wallet-btc-unhosted").addClass("highlighted-node");
      cy.$id("vasp-coindcx-btc").addClass("highlighted-node");
      cy.edges('[source = "wallet-btc-unhosted"][target = "vasp-coindcx-btc"]').addClass("highlighted-edge");
      cy.animate({ center: { eles: cy.$("#wallet-btc-unhosted, #vasp-coindcx-btc") }, zoom: 1.15, duration: 300 });
      setTracingStatus("Hop 2 Selected: Unhosted Cluster -> CoinDCX Deposit (CDX-IN-9081245)");
    } else if (hopIndex === 3) {
      cy.$id("vasp-coindcx-btc").addClass("highlighted-node");
      cy.$id("actor-rohan").addClass("highlighted-node");
      cy.edges('[source = "vasp-coindcx-btc"][target = "actor-rohan"]').addClass("highlighted-edge");
      cy.animate({ center: { eles: cy.$("#vasp-coindcx-btc, #actor-rohan") }, zoom: 1.15, duration: 300 });
      setTracingStatus("Hop 3 Selected: CoinDCX Account -> Rohan Sharma (PAN/Aadhaar Ground Truth)");
    }
  };

  const handleReset = () => {
    traceAbortIdRef.current++;
    if (!cyRef.current) return;
    cyRef.current.elements().removeClass("highlighted-node highlighted-edge");
    cyRef.current.fit(undefined, 35);
    setIsPathActive(false);
    setActiveHopStep(null);
    setTracingStatus(null);
    onReset();
  };

  return (
    <div className="gov-dossier-workspace">
      {/* Control Action Toolbar */}
      <section className="gov-section-container" style={{ marginBottom: "16px" }}>
        <div className="gov-section-header" style={{ flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Share2 color="var(--gov-navy)" size={18} />
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--gov-navy)", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                Multi-Modal Attribution Knowledge Graph (Engine 2)
              </div>
              <div style={{ fontSize: "11px", color: "var(--gov-text-muted)" }}>
                {store.engine2Synthesized
                  ? "14 Grounded Nodes • 16 Relational Edges • Neo4j Property Graph Architecture"
                  : "Raw Multi-Source Threat Data Ingestion Queue (Tor, Dread, BTC, CoinDCX)"}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
            {!store.engine2Synthesized ? (
              <button
                id="synthesize-graph-btn"
                className="gov-btn-primary"
                onClick={handleSynthesize}
                disabled={isSynthesizing}
              >
                <Zap size={14} />
                {isSynthesizing ? "Synthesizing 4 Stages..." : "Ingest & Synthesize Knowledge Graph"}
              </button>
            ) : (
              <button id="trace-path-btn" className="gov-btn-primary" onClick={handleTracePath}>
                <Zap size={14} />
                {isPathActive ? "Re-Trace Attribution Path" : "Trace Attribution Path (BFS)"}
              </button>
            )}

            <button id="reset-graph-btn" className="gov-btn-secondary" onClick={handleReset}>
              <RotateCcw size={14} />
              Reset Canvas
            </button>
          </div>
        </div>

        {/* Dynamic Forensic Tracing Status Bar */}
        {tracingStatus && (
          <div
            style={{
              background: "#FEF3C7",
              borderBottom: "1px solid #FDE68A",
              padding: "8px 20px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
              fontWeight: 700,
              color: "#92400E",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            <Route size={14} />
            <span>{tracingStatus}</span>
          </div>
        )}
      </section>

      {/* Main Canvas & Details Split View */}
      <div style={{ display: "grid", gridTemplateColumns: selectedNode || selectedEdge ? "3fr 1fr" : "1fr", gap: "16px" }}>
        <div>
          {/* Cytoscape Canvas Container - Spacious 560px High Viewport with Zero Collisions */}
          <div
            className="gov-section-container"
            style={{
              minHeight: "560px",
              margin: 0,
              borderBottom: "none"
            }}
          >
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "560px",
                background: "#F8FAFC"
              }}
            >
              <div
                ref={containerRef}
                style={{
                  width: "100%",
                  height: "560px",
                  background: "#F8FAFC"
                }}
              />

              {!store.engine2Synthesized && !isSynthesizing && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(248, 250, 252, 0.94)",
                    zIndex: 5,
                    padding: "20px",
                    textAlign: "center"
                  }}
                >
                  <div
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid var(--gov-border)",
                      borderRadius: "4px",
                      padding: "28px 36px",
                      maxWidth: "540px",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.07)"
                    }}
                  >
                    <Share2 size={36} color="var(--gov-navy)" style={{ margin: "0 auto 14px auto" }} />
                    <h3 style={{ fontSize: "15px", fontWeight: 800, color: "var(--gov-navy)", marginBottom: "8px" }}>
                      Multi-Modal Attribution Knowledge Graph Awaiting Ingestion
                    </h3>
                    <p style={{ fontSize: "12px", color: "var(--gov-text-muted)", lineHeight: "1.6", margin: 0 }}>
                      4 disparate forensic streams are awaiting ingestion: Tor hidden service reconnaissance, Dread/BreachForums underground handles, multi-hop Bitcoin unhosted clusters, and CoinDCX KYC records. Click <strong>Ingest &amp; Synthesize Knowledge Graph</strong> in the toolbar above to synthesize nodes and edges across 4 progressive stages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clean Docked Legend & Entity Taxonomy (Docked Beneath Canvas - 0% Occlusion) */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid var(--gov-border)",
              padding: "10px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px",
              fontSize: "11px",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontWeight: 700, color: "var(--gov-navy)", textTransform: "uppercase", fontSize: "10px" }}>
              <Info size={13} color="var(--gov-navy)" />
              <span>Entity Classification Legend:</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#DC2626", border: "1.5px solid #991B1B" }}></span>
                <span>Accused (Rohan Sharma)</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#4F46E5", border: "1.5px solid #3730A3" }}></span>
                <span>Darknet Forum Persona</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#D97706", border: "1.5px solid #B45309" }}></span>
                <span>PGP Master Key</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0284C7", border: "1.5px solid #0369A1" }}></span>
                <span>Tor v3 Onion & Origin IP</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#EA580C", border: "1.5px solid #C2410C" }}></span>
                <span>Extortion Wallet</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#059669", border: "1.5px solid #047857" }}></span>
                <span>Regulated Domestic VASP</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Element Details Inspector Panel */}
        {(selectedNode || selectedEdge) && (
          <div className="gov-section-container" style={{ margin: 0, height: "100%", display: "flex", flexDirection: "column" }}>
            <div className="gov-section-header">
              <div className="gov-section-title">
                <Info size={14} />
                <span>{selectedNode ? "Node Details" : "Edge Details"}</span>
              </div>
              <button
                onClick={() => {
                  setSelectedNode(null);
                  setSelectedEdge(null);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "12px",
                  color: "var(--gov-text-muted)"
                }}
              >
                ✕
              </button>
            </div>

            <div className="gov-section-body" style={{ padding: "16px", flex: 1, overflowY: "auto" }}>
              {selectedNode ? (
                <>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--gov-navy)", marginBottom: "4px" }}>
                    {String(selectedNode.fullLabel || selectedNode.label)}
                  </div>
                  <div style={{ fontSize: "11px", color: "var(--gov-text-muted)", textTransform: "uppercase", marginBottom: "12px" }}>
                    Category: <strong style={{ color: "var(--gov-blue)" }}>{selectedNode.category || selectedNode.type}</strong>
                  </div>

                  <div style={{ background: "var(--gov-surface-alt)", border: "1px solid var(--gov-border)", padding: "10px", borderRadius: "2px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>Node Identifier</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", wordBreak: "break-all", fontWeight: 600 }}>
                      {selectedNode.id}
                    </div>
                  </div>

                  {selectedNode.confidence && (
                    <div style={{ background: "var(--gov-surface-alt)", border: "1px solid var(--gov-border)", padding: "10px", borderRadius: "2px", marginBottom: "12px" }}>
                      <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>Attribution Confidence</div>
                      <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--gov-green)" }}>
                        {(selectedNode.confidence * 100).toFixed(1)}%
                      </div>
                    </div>
                  )}

                  <div style={{ fontSize: "11px", color: "var(--gov-text-body)", lineHeight: "1.5", marginTop: "12px" }}>
                    <strong>Forensic Intelligence Context:</strong>
                    <p style={{ margin: "4px 0 0 0" }}>
                      {selectedNode.id === "actor-rohan"
                        ? "Primary accused individual de-anonymized via synchronized evidence chain linking Tor mod_status server leak, PGP key authorship, and domestic VASP KYC records."
                        : selectedNode.category === "persona"
                        ? "Underground darknet forum persona tracked across cybercrime communities (Dread, Exploit.in)."
                        : selectedNode.category === "wallet"
                        ? "Cryptocurrency wallet address identified in ransomware ransom payment demands."
                        : selectedNode.category === "vasp"
                        ? "FIU-India registered cryptocurrency exchange account verified via Section 69 IT Act law enforcement request."
                        : "Cryptographic or network infrastructure indicator established during technical intelligence collection."}
                    </p>
                  </div>
                </>
              ) : selectedEdge ? (
                <>
                  <div style={{ fontSize: "14px", fontWeight: "bold", color: "var(--gov-navy)", marginBottom: "6px" }}>
                    Relational Linkage
                  </div>
                  <div style={{ background: "var(--gov-surface-alt)", border: "1px solid var(--gov-border)", padding: "10px", borderRadius: "2px", marginBottom: "12px" }}>
                    <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", textTransform: "uppercase" }}>Relationship Type</div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--gov-saffron)", fontWeight: 700 }}>
                      {selectedEdge.label}
                    </div>
                  </div>
                  <div style={{ fontSize: "11px", lineHeight: "1.6" }}>
                    <div><strong>From:</strong> <code>{selectedEdge.source}</code></div>
                    <div style={{ margin: "4px 0" }}><ArrowRight size={12} style={{ verticalAlign: "middle" }} /></div>
                    <div><strong>To:</strong> <code>{selectedEdge.target}</code></div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Modernized Government Blockchain Attribution Trail Table */}
      <section className="gov-section-container" style={{ marginTop: "24px" }}>
        <div className="gov-section-header" style={{ flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div className="gov-section-title" style={{ fontSize: "13px", fontWeight: 800 }}>
              <Route size={16} color="var(--gov-navy)" />
              <span>Multi-Hop Blockchain Attribution Trail</span>
            </div>
            <div style={{ fontSize: "11px", color: "var(--gov-text-muted)", marginTop: "2px" }}>
              Automated Multi-Input Common Spend (MICH) Clustering & TRC-20 Smart Contract Event Log Sweeps
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", background: "#EEF2F6", border: "1px solid #CBD5E1", padding: "4px 10px", borderRadius: "2px", color: "var(--gov-navy)", fontWeight: 700 }}>
              Tracking Value: ₹3,83,60,000 (5.50 BTC + 50k USDT)
            </span>
            <span style={{ fontSize: "11px", background: "var(--gov-surface-alt)", border: "1px solid var(--gov-border)", padding: "4px 10px", borderRadius: "2px", color: "var(--gov-green-dark)", fontWeight: 700 }}>
              VASP: CoinDCX (FIU-IND)
            </span>
          </div>
        </div>

        {!store.engine2Synthesized ? (
          <div style={{ padding: "36px 20px", textAlign: "center", background: "#F8FAFC" }}>
            <div style={{ display: "inline-flex", padding: "12px", background: "#EEF2F6", borderRadius: "50%", marginBottom: "12px" }}>
              <Clock size={24} color="var(--gov-navy)" />
            </div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--gov-navy)", marginBottom: "6px" }}>
              Blockchain Ingestion Queue Awaiting Knowledge Graph Synthesis
            </div>
            <p style={{ fontSize: "12px", color: "var(--gov-text-muted)", maxWidth: "560px", margin: "0 auto", lineHeight: "1.5" }}>
              Raw Bitcoin (MICH) and TRC-20 USDT transaction logs cannot be parsed or attributed in isolation. Synthesize the Multi-Modal Attribution Knowledge Graph above to ingest nodes, build transaction adjacency matrices, and unlock automated BFS path tracing.
            </p>
          </div>
        ) : (
          <>
            {/* Dynamic Context Status Notification */}
            <div
              style={{
                background: isPathActive ? "#F0FDF4" : "#F8FAFC",
                borderBottom: "1px solid var(--gov-border)",
                padding: "8px 16px",
                fontSize: "11px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                color: isPathActive ? "#166534" : "var(--gov-text-body)"
              }}
            >
              {isPathActive ? (
                <>
                  <CheckCircle2 size={14} color="#16a34a" />
                  <span style={{ fontWeight: 700 }}>
                    Blockchain Trail Attribution Active: 100% of Extortion Proceeds Grounded to Primary Accused (Rohan Sharma • PAN/Aadhaar Verified)
                  </span>
                </>
              ) : (
                <>
                  <Clock size={14} color="var(--gov-blue)" />
                  <span>
                    3 Blockchain Ledger Transactions Ingested from Extortion Notes. Click <strong>"TRACE ATTRIBUTION PATH (BFS)"</strong> above to execute automated clustering and ground VASP KYC endpoints.
                  </span>
                </>
              )}
            </div>

            <div className="gov-section-body" style={{ padding: 0, overflowX: "auto" }}>
              <table className="gov-table" style={{ width: "100%", margin: 0, borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#F1F5F9", borderBottom: "2px solid var(--gov-navy)" }}>
                    <th style={{ width: "6%", padding: "12px 14px", fontSize: "11px", fontWeight: 800, color: "var(--gov-navy)" }}>Hop #</th>
                    <th style={{ width: "16%", padding: "12px 14px", fontSize: "11px", fontWeight: 800, color: "var(--gov-navy)" }}>Investigation Phase</th>
                    <th style={{ width: "8%", padding: "12px 14px", fontSize: "11px", fontWeight: 800, color: "var(--gov-navy)" }}>Asset</th>
                    <th style={{ width: "42%", padding: "12px 14px", fontSize: "11px", fontWeight: 800, color: "var(--gov-navy)" }}>Flow (Source → Destination)</th>
                    <th style={{ width: "14%", padding: "12px 14px", fontSize: "11px", fontWeight: 800, color: "var(--gov-navy)" }}>Amount / Value (INR)</th>
                    <th style={{ width: "14%", padding: "12px 14px", fontSize: "11px", fontWeight: 800, color: "var(--gov-navy)" }}>Attribution Status</th>
                  </tr>
                </thead>
                <tbody>
                  {FORENSIC_BLOCKCHAIN_HOPS.map((h) => {
                    const isCurrentlyActive = activeHopStep === h.step;
                    const isHopCompleted = isPathActive || (activeHopStep !== null && activeHopStep >= h.step);
                    return (
                      <tr
                        key={h.step}
                        onClick={() => handleHopRowClick(h.step)}
                        title={`Click to focus Hop #${h.step} (${h.phase}) on the graph canvas`}
                        style={{
                          background: isCurrentlyActive ? "#FEF3C7" : isHopCompleted ? "#F0FDF4" : h.step % 2 === 0 ? "#F8FAFC" : "#FFFFFF",
                          borderBottom: "1px solid var(--gov-border)",
                          borderLeft: isCurrentlyActive ? "4px solid var(--gov-gold-dark)" : isHopCompleted ? "4px solid var(--gov-green)" : "4px solid transparent",
                          cursor: "pointer",
                          transition: "all 0.25s ease"
                        }}
                      >
                        {/* Hop Index */}
                        <td style={{ padding: "12px 14px", fontWeight: 800 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <span
                              style={{
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                background: isCurrentlyActive ? "#D97706" : isHopCompleted ? "#16a34a" : "#94A3B8"
                              }}
                            />
                            <span style={{ fontSize: "13px", color: isCurrentlyActive ? "#92400E" : isHopCompleted ? "#166534" : "var(--gov-navy)" }}>
                              #{h.step}
                            </span>
                          </div>
                        </td>

                        {/* Phase & Heuristic */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontWeight: 700, fontSize: "12px", color: "var(--gov-navy)" }}>{h.phase}</div>
                          <div style={{ fontSize: "10px", color: "var(--gov-text-muted)", marginTop: "2px" }}>{h.heuristic}</div>
                        </td>

                        {/* Asset Badge */}
                        <td style={{ padding: "12px 14px" }}>
                          <span
                            style={{
                              background: h.asset === "BTC" ? "var(--gov-navy)" : "#0D9488",
                              color: "#FFFFFF",
                              fontSize: "10px",
                              fontWeight: 700,
                              padding: "3px 7px",
                              borderRadius: "2px",
                              display: "inline-block"
                            }}
                          >
                            {h.asset}
                          </span>
                        </td>

                        {/* Flow */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "nowrap" }}>
                            <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", padding: "6px 10px", borderRadius: "2px", flex: 1, minWidth: "150px" }}>
                              <div style={{ fontSize: "9px", color: "var(--gov-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                                {h.fromLabel}
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gov-navy)", fontWeight: 600, wordBreak: "break-all" }}>
                                {h.fromAddress}
                              </div>
                            </div>

                            <div style={{ color: isCurrentlyActive ? "#D97706" : isHopCompleted ? "#16a34a" : "var(--gov-saffron)", display: "flex", alignItems: "center", flexShrink: 0 }}>
                              <ArrowRight size={15} />
                            </div>

                            <div style={{ background: "#FFFFFF", border: "1px solid #CBD5E1", padding: "6px 10px", borderRadius: "2px", flex: 1, minWidth: "150px" }}>
                              <div style={{ fontSize: "9px", color: "var(--gov-text-muted)", textTransform: "uppercase", fontWeight: 700 }}>
                                {h.toLabel}
                              </div>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--gov-navy)", fontWeight: 600, wordBreak: "break-all" }}>
                                {h.toAddress}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Value */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ fontWeight: 800, color: "var(--gov-navy)", fontSize: "13px" }}>{h.amountCrypto}</div>
                          <div style={{ fontSize: "11px", color: "var(--gov-green-dark)", fontWeight: 600, marginTop: "1px" }}>
                            {h.amountInr}
                          </div>
                        </td>

                        {/* Status Badge */}
                        <td style={{ padding: "12px 14px" }}>
                          {isCurrentlyActive ? (
                            <span className="gov-badge-amber" style={{ fontSize: "10px", fontWeight: 800 }}>
                              ⚡ EXECUTING HOP #{h.step}...
                            </span>
                          ) : isHopCompleted ? (
                            <span className="gov-badge-green" style={{ fontSize: "10px", fontWeight: 800 }}>
                              ✓ {h.groundedStatus}
                            </span>
                          ) : (
                            <span className="gov-badge-blue" style={{ fontSize: "10px", fontWeight: 700 }}>
                              INGESTED • PENDING TRACE
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>

      {/* Action banner to proceed to Step 4: Stylometry Lab (Clean bottom-right placement matching Engine 1) */}
      {(store.engine2Traced || isPathActive) && (
        <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            className="gov-btn-primary"
            onClick={onNavigateNext}
            style={{ padding: "8px 16px", fontSize: "12px", display: "flex", alignItems: "center", gap: "6px" }}
          >
            <CheckCircle2 size={14} />
            Graph Attribution Grounded • Proceed to Step 4: Stylometry Lab (Engine 3)
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
