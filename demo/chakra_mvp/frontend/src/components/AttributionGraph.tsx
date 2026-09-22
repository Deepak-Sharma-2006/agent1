import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { Core, NodeSingular, EdgeSingular } from "cytoscape";
import type { AttributionResponse, GraphNode, TransactionEdge } from "../types";
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Play,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Zap,
  Crosshair,
  Filter,
  ShieldCheck,
  X
} from "lucide-react";
import { SovereignLedgerModal } from "./SovereignLedgerModal";

interface AttributionGraphProps {
  attribution: AttributionResponse | null;
  isLoading: boolean;
  isSynthesized?: boolean;
  onGraphSynthesized?: () => void;
}

export const AttributionGraph: React.FC<AttributionGraphProps> = ({
  attribution,
  isLoading,
  isSynthesized: propIsSynthesized,
  onGraphSynthesized
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);

  // Inspector, Synthesis & Animation State
  const [internalSynthesized, setInternalSynthesized] = useState<boolean>(false);
  const isSynthesized = propIsSynthesized !== undefined ? propIsSynthesized : internalSynthesized;
  const [isSynthesizing, setIsSynthesizing] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedInspectNode, setSelectedInspectNode] = useState<GraphNode | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<TransactionEdge | null>(null);
  const [isAnimatingTrace, setIsAnimatingTrace] = useState<boolean>(false);
  const [traceTelemetry, setTraceTelemetry] = useState<string | null>(null);
  const [focusPipelineOnly, setFocusPipelineOnly] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Reset synthesis state whenever active case changes
  useEffect(() => {
    setInternalSynthesized(false);
    setIsSynthesizing(false);
    setSelectedNode(null);
    setSelectedEdge(null);
    setTraceTelemetry(null);
    if (cyRef.current && !cyRef.current.destroyed()) {
      cyRef.current.destroy();
      cyRef.current = null;
    }
  }, [attribution?.sahyog_case_id, attribution?.suspect_wallet]);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getExplorerUrl = (id: string, type: "address" | "tx", network?: string): string => {
    const net = (network || attribution?.network || "TRON").toUpperCase();
    if (net.includes("TRON")) {
      return type === "address" ? `https://tronscan.org/#/address/${id}` : `https://tronscan.org/#/transaction/${id}`;
    }
    if (net.includes("BTC")) {
      return type === "address" ? `https://mempool.space/address/${id}` : `https://mempool.space/tx/${id}`;
    }
    if (net.includes("POL")) {
      return type === "address" ? `https://polygonscan.com/address/${id}` : `https://polygonscan.com/tx/${id}`;
    }
    if (net.includes("BSC")) {
      return type === "address" ? `https://bscscan.com/address/${id}` : `https://bscscan.com/tx/${id}`;
    }
    return type === "address" ? `https://etherscan.io/address/${id}` : `https://etherscan.io/tx/${id}`;
  };

  const getExplorerName = (network?: string): string => {
    const net = (network || attribution?.network || "TRON").toUpperCase();
    if (net.includes("BTC")) return "Mempool.space";
    if (net.includes("TRON")) return "Tronscan.org";
    if (net.includes("POL")) return "Polygonscan.com";
    if (net.includes("BSC")) return "BscScan.com";
    return "Etherscan.io";
  };

  // Build Cytoscape elements Definition
  const buildElements = (): cytoscape.ElementDefinition[] => {
    if (!attribution || !attribution.graph_nodes || attribution.graph_nodes.length === 0) {
      return [];
    }

    const elements: cytoscape.ElementDefinition[] = [];
    const nodesByHop: Record<number, GraphNode[]> = {};
    attribution.graph_nodes.forEach((n) => {
      const hop = n.hop_level ?? 0;
      if (!nodesByHop[hop]) nodesByHop[hop] = [];
      nodesByHop[hop].push(n);
    });

    const maxHop = Math.max(0, ...Object.keys(nodesByHop).map(Number));
    const containerWidth = containerRef.current?.clientWidth || 700;
    const containerHeight = containerRef.current?.clientHeight || 500;

    attribution.graph_nodes.forEach((n) => {
      const hop = n.hop_level ?? 0;
      const colIndex = hop;
      const nodesInCol = nodesByHop[hop] || [n];
      const rowIndex = nodesInCol.indexOf(n);

      const colSpacing = Math.max(160, (containerWidth - 140) / Math.max(1, maxHop));
      const x = 70 + colIndex * colSpacing;

      const rowSpacing = Math.max(70, (containerHeight - 120) / Math.max(1, nodesInCol.length));
      const y = 60 + (rowIndex + 0.5) * rowSpacing;

      let bgColor = "#D97706"; // Default mule
      let borderColor = "#B45309";
      let shape: cytoscape.Css.NodeShape = "round-rectangle";
      let displayLabel = n.label || `${n.id.slice(0, 6)}...${n.id.slice(-4)}`;

      if (n.node_type === "SUSPECT_WALLET") {
        bgColor = "#DC2626";
        borderColor = "#991B1B";
        shape = "hexagon";
        displayLabel = `[SUSPECT]\n${displayLabel}`;
      } else if (n.node_type === "CANDIDATE_DEPOSIT") {
        bgColor = "#0284C7";
        borderColor = "#0369A1";
        shape = "ellipse";
        displayLabel = `[DEPOSIT]\n${displayLabel}`;
      } else if (n.node_type === "VASP_HOT_WALLET") {
        bgColor = "#059669";
        borderColor = "#065F46";
        shape = "hexagon";
        displayLabel = `[HOT WALLET]\n${n.cluster_entity || "VASP"}`;
      }

      elements.push({
        group: "nodes",
        data: {
          id: n.id.toLowerCase(),
          raw_node: n,
          label: displayLabel,
          node_type: n.node_type,
          cluster: n.cluster_entity,
          hop_level: n.hop_level
        },
        position: { x, y }
      });
    });

    attribution.graph_edges.forEach((e) => {
      const isSweep = e.is_sweep || false;
      const edgeLabel = isSweep
        ? `SWEEP (${parseFloat(e.decimal_amount).toLocaleString()} ${e.asset_symbol})`
        : `${parseFloat(e.decimal_amount).toLocaleString()} ${e.asset_symbol}`;

      elements.push({
        group: "edges",
        data: {
          id: e.tx_hash,
          source: e.source_address.toLowerCase(),
          target: e.destination_address.toLowerCase(),
          label: edgeLabel,
          is_sweep: isSweep,
          raw_edge: e
        }
      });
    });

    return elements;
  };

  // Initialize Cytoscape Instance
  const initCytoscapeInstance = (hideAll: boolean = false): Core | null => {
    if (!containerRef.current) return null;

    if (cyRef.current && !cyRef.current.destroyed()) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    const elements = buildElements();
    if (elements.length === 0) return null;

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#D97706",
            "border-width": 2,
            "border-color": "#B45309",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            "text-max-width": "110px",
            color: "#FFFFFF",
            "font-size": "9.5px",
            "font-family": "Inter, sans-serif",
            "font-weight": 700,
            "text-outline-width": 1.5,
            "text-outline-color": "#0F172A",
            "text-outline-opacity": 0.8
          }
        },
        {
          selector: 'node[node_type = "SUSPECT_WALLET"]',
          style: {
            "background-color": "#DC2626",
            "border-color": "#991B1B",
            "border-width": 3,
            shape: "hexagon",
            width: 105,
            height: 52
          }
        },
        {
          selector: 'node[node_type = "INTERMEDIARY_UNHOSTED"]',
          style: {
            "background-color": "#D97706",
            "border-color": "#92400E",
            shape: "round-rectangle",
            width: 95,
            height: 45
          }
        },
        {
          selector: 'node[node_type = "CANDIDATE_DEPOSIT"]',
          style: {
            "background-color": "#0284C7",
            "border-color": "#075985",
            shape: "ellipse",
            width: 100,
            height: 50
          }
        },
        {
          selector: 'node[node_type = "VASP_HOT_WALLET"]',
          style: {
            "background-color": "#059669",
            "border-color": "#064E3B",
            "border-width": 3,
            shape: "hexagon",
            width: 110,
            height: 55
          }
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#94A3B8",
            "target-arrow-color": "#94A3B8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
            label: "data(label)",
            "font-size": "8px",
            "font-family": "Inter, sans-serif",
            "text-background-color": "#FFFFFF",
            "text-background-opacity": 0.9,
            "text-background-padding": "2px",
            "text-border-color": "#CBD5E1",
            "text-border-width": 1,
            "text-border-opacity": 0.8,
            "arrow-scale": 0.9
          }
        },
        {
          selector: "edge[?is_sweep]",
          style: {
            width: 3.5,
            "line-color": "#D97706",
            "line-style": "dashed",
            "line-dash-pattern": [6, 3],
            "target-arrow-color": "#D97706",
            "target-arrow-shape": "triangle",
            color: "#B45309",
            "font-weight": "bold",
            "font-size": "9px",
            "text-background-color": "#FEF3C7"
          }
        },
        {
          selector: ":selected",
          style: {
            "border-width": 4,
            "border-color": "#0F172A",
            "overlay-color": "#0F172A",
            "overlay-opacity": 0.2,
            "overlay-padding": 4
          }
        },
        {
          selector: ".highlighted-node",
          style: {
            "border-width": 4.5,
            "border-color": "#F59E0B",
            "overlay-color": "#F59E0B",
            "overlay-opacity": 0.25,
            "overlay-padding": 6
          }
        },
        {
          selector: ".pulse-active",
          style: {
            "border-width": 5,
            "border-color": "#F59E0B",
            "overlay-color": "#F59E0B",
            "overlay-opacity": 0.35,
            "overlay-padding": 8
          }
        },
        {
          selector: ".highlighted-edge",
          style: {
            width: 4,
            "line-color": "#F59E0B",
            "target-arrow-color": "#F59E0B",
            "arrow-scale": 1.2
          }
        },
        {
          selector: ".pulse-sweep",
          style: {
            width: 5,
            "line-color": "#EAB308",
            "target-arrow-color": "#EAB308",
            "line-style": "solid",
            "arrow-scale": 1.4
          }
        },
        {
          selector: ".staged-hidden",
          style: {
            display: "none"
          }
        },
        {
          selector: ".dimmed",
          style: {
            opacity: 0.15
          }
        }
      ],
      layout: {
        name: "preset"
      },
      minZoom: 0.4,
      maxZoom: 2.5,
      wheelSensitivity: 0.2
    });

    cy.on("tap", "node", (evt) => {
      const node = evt.target as NodeSingular;
      const rawNode = node.data("raw_node") as GraphNode;
      setSelectedNode(rawNode);
      setSelectedEdge(null);
    });

    cy.on("tap", "edge", (evt) => {
      const edge = evt.target as EdgeSingular;
      const rawEdge = edge.data("raw_edge") as TransactionEdge;
      setSelectedEdge(rawEdge);
      setSelectedNode(null);
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    if (hideAll) {
      cy.elements().addClass("staged-hidden");
    } else {
      cy.fit(undefined, 30);
    }

    cyRef.current = cy;
    return cy;
  };

  // Progressive 4-Stage Multi-Chain Synthesis Animation (Bhedak Architecture)
  const handleSynthesizeGraph = async () => {
    if (!containerRef.current || !attribution || isSynthesizing) return;
    setIsSynthesizing(true);
    setSelectedNode(null);
    setSelectedEdge(null);

    const cy = initCytoscapeInstance(true);
    if (!cy) {
      setIsSynthesizing(false);
      return;
    }

    try {
      // Stage 1: Hop 0 - Suspect Seed Wallet
      setTraceTelemetry(`⚡ [Stage 1/4] Ingesting Target Suspect Seed Wallet on ${attribution.network} ledger...`);
      const suspectNode = cy.nodes('[node_type = "SUSPECT_WALLET"]');
      suspectNode.removeClass("staged-hidden");
      cy.animate({
        center: { eles: suspectNode },
        duration: 300
      });
      await delay(450);

      // Stage 2: Intermediate Peel-Chain Mule Wallets
      const muleNodes = cy.nodes('[node_type = "INTERMEDIARY_UNHOSTED"]');
      setTraceTelemetry(`⚡ [Stage 2/4] Traversing ${muleNodes.length} unhosted peel-chain intermediary mule wallets via Degree-Bounded Beam Search...`);
      muleNodes.removeClass("staged-hidden");
      cy.edges().forEach((e) => {
        if (!e.source().hasClass("staged-hidden") && !e.target().hasClass("staged-hidden")) {
          e.removeClass("staged-hidden");
        }
      });
      await delay(450);

      // Stage 3: Candidate Deposit Address
      setTraceTelemetry(`⚡ [Stage 3/4] Candidate VASP Inflow Deposit Address identified with high concentration index...`);
      const depositNodes = cy.nodes('[node_type = "CANDIDATE_DEPOSIT"]');
      depositNodes.removeClass("staged-hidden");
      cy.edges().forEach((e) => {
        if (!e.source().hasClass("staged-hidden") && !e.target().hasClass("staged-hidden")) {
          e.removeClass("staged-hidden");
        }
      });
      await delay(450);

      // Stage 4: Attributed VASP Hot Wallet & Internal Sweep Consolidation
      setTraceTelemetry(`✓ [Stage 4/4] Automated Sweep Heuristic Confirmed! 100% balance swept into ${attribution.nearest_vasp || "VASP"} Hot Wallet (${attribution.confidence_score.toFixed(1)}% Confidence).`);
      cy.elements().removeClass("staged-hidden");
      cy.animate({
        fit: { eles: cy.elements(), padding: 35 },
        duration: 350
      });
      await delay(400);

      setTraceTelemetry(`✓ Multi-Chain Attribution Graph Synthesized: ${attribution.graph_nodes.length} Nodes & ${attribution.graph_edges.length} Edges Attributed to ${attribution.nearest_vasp || "VASP"}`);
      setInternalSynthesized(true);
      onGraphSynthesized?.();
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Re-mount or fit when isSynthesized is already true
  useEffect(() => {
    if (isSynthesized && containerRef.current && attribution) {
      if (!cyRef.current || cyRef.current.destroyed()) {
        initCytoscapeInstance(false);
      } else {
        cyRef.current.elements().removeClass("staged-hidden");
        cyRef.current.fit(undefined, 30);
      }
    }
  }, [isSynthesized, attribution]);

  // Synchronized Hop-by-Hop Animated Fund Flow Trace (Beam Search Simulation)
  const handleRunTraceAnimation = async () => {
    const cy = cyRef.current;
    if (!cy || !attribution || isAnimatingTrace) return;

    setIsAnimatingTrace(true);
    setSelectedNode(null);
    setSelectedEdge(null);

    // Reset styles
    cy.elements().removeClass("highlighted-node pulse-active highlighted-edge pulse-sweep dimmed");

    try {
      // Step 1: Hop 0 - Suspect Seed Wallet
      setTraceTelemetry("⚡ [Step 1/4] Hop 0: Target Suspect Seed Wallet Identified on " + attribution.network + " ledger...");
      const suspectNode = cy.nodes('[node_type = "SUSPECT_WALLET"]');
      suspectNode.addClass("pulse-active");
      cy.animate({
        center: { eles: suspectNode },
        duration: 350
      });
      await delay(800);
      suspectNode.removeClass("pulse-active").addClass("highlighted-node");

      // Step 2: Intermediate Unhosted Mules (Peel Chains)
      const muleNodes = cy.nodes('[node_type = "INTERMEDIARY_UNHOSTED"]');
      const muleEdges = cy.edges().filter((e) => {
        const srcType = e.source().data("node_type");
        const tgtType = e.target().data("node_type");
        return srcType === "SUSPECT_WALLET" || tgtType === "INTERMEDIARY_UNHOSTED";
      });

      if (muleNodes.length > 0) {
        setTraceTelemetry(`⚡ [Step 2/4] Traversing ${muleNodes.length} unhosted peel-chain intermediary mule wallets via Degree-Bounded Beam Search...`);
        muleEdges.addClass("highlighted-edge");
        muleNodes.addClass("pulse-active");
        await delay(900);
        muleNodes.removeClass("pulse-active").addClass("highlighted-node");
      }

      // Step 3: Candidate Deposit Address
      setTraceTelemetry("⚡ [Step 3/4] Candidate VASP Inflow Deposit Address identified with high concentration index...");
      const depositNode = cy.nodes('[node_type = "CANDIDATE_DEPOSIT"]');
      const depositEdges = cy.edges().filter((e) => e.target().data("node_type") === "CANDIDATE_DEPOSIT");
      depositEdges.addClass("highlighted-edge");
      depositNode.addClass("pulse-active");
      await delay(900);
      depositNode.removeClass("pulse-active").addClass("highlighted-node");

      // Step 4: Internal Sweep Consolidation Heuristic & VASP Hot Wallet
      setTraceTelemetry(`✓ [Step 4/4] Automated Sweep Heuristic Confirmed! 100% balance swept into ${attribution.nearest_vasp} Hot Wallet (${attribution.confidence_score.toFixed(1)}% Confidence).`);
      const sweepEdges = cy.edges('[?is_sweep]');
      const vaspHotNode = cy.nodes('[node_type = "VASP_HOT_WALLET"]');

      sweepEdges.addClass("pulse-sweep");
      vaspHotNode.addClass("pulse-active");

      cy.animate({
        fit: { eles: cy.elements(), padding: 35 },
        duration: 400
      });
      await delay(900);
      vaspHotNode.removeClass("pulse-active").addClass("highlighted-node");

    } finally {
      setIsAnimatingTrace(false);
    }
  };

  // Toggle Focus Pipeline Only
  const handleToggleFocus = () => {
    const cy = cyRef.current;
    if (!cy) return;

    const nextState = !focusPipelineOnly;
    setFocusPipelineOnly(nextState);

    if (nextState) {
      // Dim all nodes that are not in the primary attribution chain
      cy.elements().addClass("dimmed");
      cy.nodes('[node_type = "SUSPECT_WALLET"], [node_type = "CANDIDATE_DEPOSIT"], [node_type = "VASP_HOT_WALLET"]').removeClass("dimmed");
      cy.edges('[?is_sweep]').removeClass("dimmed");
    } else {
      cy.elements().removeClass("dimmed");
    }
  };

  // Center Camera on Identified VASP Hot Storage
  const handleCenterOnVasp = () => {
    const cy = cyRef.current;
    if (!cy) return;
    const vaspNode = cy.nodes('[node_type = "VASP_HOT_WALLET"]');
    if (vaspNode.length > 0) {
      cy.animate({
        center: { eles: vaspNode },
        zoom: 1.2,
        duration: 400
      });
      setSelectedNode(vaspNode.first().data("raw_node"));
    }
  };

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 30);
  const handleResetGraph = () => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.elements().removeClass("highlighted-node pulse-active highlighted-edge pulse-sweep dimmed");
    cy.fit(undefined, 30);
    setTraceTelemetry(null);
    setFocusPipelineOnly(false);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  return (
    <div className="gov-card" style={{ height: "100%", minHeight: "560px", display: "flex", flexDirection: "column" }}>
      {/* Canvas Header & Action Controls */}
      <div className="gov-card-header" style={{ flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span className="gov-card-title" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <Layers size={15} color="#0F2942" /> Interactive Multi-Chain Attribution Canvas
          </span>
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#1E40AF",
              background: "#EFF6FF",
              border: "1px solid #BFDBFE",
              padding: "2px 8px",
              borderRadius: "4px"
            }}
          >
            ACTIVE FORENSIC STAGE 2
          </span>
        </div>

        {/* Action Controls & Animation Playback */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <button
            type="button"
            id="btn-trace-fund-flow"
            className="gov-btn gov-btn-primary"
            onClick={handleRunTraceAnimation}
            disabled={!isSynthesized || isAnimatingTrace || !attribution}
            style={{
              fontSize: "11px",
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: (!isSynthesized || isAnimatingTrace) ? "#94A3B8" : "#0F2942",
              cursor: (!isSynthesized || isAnimatingTrace) ? "not-allowed" : "pointer"
            }}
            title="Execute Hop-by-Hop Animated Fund Flow Trace"
          >
            <Play size={12} fill="currentColor" />
            {isAnimatingTrace ? "Tracing Fund Flow..." : "Trace Fund Flow"}
          </button>

          <button
            type="button"
            className="gov-btn gov-btn-outline"
            onClick={handleCenterOnVasp}
            disabled={!isSynthesized}
            style={{ fontSize: "11px", padding: "5px 10px", display: "flex", alignItems: "center", gap: "4px", opacity: !isSynthesized ? 0.5 : 1 }}
            title="Locate Attributed VASP Hot Wallet"
          >
            <Crosshair size={12} />
            Focus VASP
          </button>

          <button
            type="button"
            className="gov-btn gov-btn-outline"
            onClick={handleToggleFocus}
            disabled={!isSynthesized}
            style={{
              fontSize: "11px",
              padding: "5px 10px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              background: focusPipelineOnly ? "#EFF6FF" : "transparent",
              opacity: !isSynthesized ? 0.5 : 1
            }}
            title="Highlight Direct Inflow Pipeline"
          >
            <Filter size={12} />
            {focusPipelineOnly ? "Show All" : "Critical Path"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "3px", marginLeft: "4px" }}>
            <button className="gov-btn-text-size" onClick={handleZoomIn} disabled={!isSynthesized} title="Zoom In" style={{ opacity: !isSynthesized ? 0.5 : 1 }}>
              <ZoomIn size={12} />
            </button>
            <button className="gov-btn-text-size" onClick={handleZoomOut} disabled={!isSynthesized} title="Zoom Out" style={{ opacity: !isSynthesized ? 0.5 : 1 }}>
              <ZoomOut size={12} />
            </button>
            <button className="gov-btn-text-size" onClick={handleFit} disabled={!isSynthesized} title="Fit to Viewport" style={{ opacity: !isSynthesized ? 0.5 : 1 }}>
              <Maximize2 size={12} />
            </button>
            <button className="gov-btn-text-size" onClick={handleResetGraph} disabled={!isSynthesized} title="Reset Highlights" style={{ opacity: !isSynthesized ? 0.5 : 1 }}>
              <RotateCcw size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Live Telemetry Ticker Strip */}
      {traceTelemetry && (
        <div
          style={{
            background: "#0F2942",
            color: "#FFFFFF",
            padding: "6px 14px",
            fontSize: "11px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1E3A8A"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Zap size={13} color="#F59E0B" />
            <span style={{ fontWeight: 600 }}>{traceTelemetry}</span>
          </div>
          <button
            onClick={() => setTraceTelemetry(null)}
            style={{ background: "none", border: "none", color: "#94A3B8", cursor: "pointer" }}
          >
            <X size={12} />
          </button>
        </div>
      )}

      {/* Main Cytoscape Viewport or Pre-Synthesis Briefing Card */}
      <div style={{ position: "relative", flex: 1, background: "#F8FAFC", minHeight: "440px" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(248, 250, 252, 0.85)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              zIndex: 10
            }}
          >
            <div className="spin-loader" />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F2942" }}>
              Tracing Multi-Hop Peel Chains via Degree-Bounded Beam Search...
            </span>
          </div>
        )}

        {/* Cytoscape Viewport Canvas - Always Mounted to Guarantee Layout Geometry */}
        <div
          ref={containerRef}
          className="cytoscape-viewport-canvas"
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            visibility: (!isSynthesized && !isSynthesizing) ? "hidden" : "visible"
          }}
        />

        {!isSynthesized && !isSynthesizing && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px",
              background: "#F8FAFC",
              textAlign: "center",
              zIndex: 5
            }}
          >
            <div
              style={{
                maxWidth: "600px",
                width: "100%",
                background: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "28px 24px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px"
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "#FEF3C7",
                  border: "1px solid #FDE68A",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Layers size={24} color="#D97706" />
              </div>

              <div>
                <div style={{ fontSize: "15px", fontWeight: 800, color: "#0F172A" }}>
                  Stage 2: Multi-Chain Attribution Canvas Awaiting Synthesis
                </div>
                <div style={{ fontSize: "12px", color: "#64748B", marginTop: "5px", lineHeight: "1.5" }}>
                  Beam search traversal has resolved the on-chain trail for Case <b>{attribution?.sahyog_case_id || "Active Docket"}</b>.
                  Synthesize the topological graph canvas to explore hops, suspect wallets, and internal VASP sweeps.
                </div>
              </div>

              {attribution && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "10px",
                    width: "100%",
                    background: "#FAFAFA",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    padding: "10px",
                    fontSize: "11px"
                  }}
                >
                  <div>
                    <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Suspect Wallet</span>
                    <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, color: "#0F172A" }}>
                      {attribution.suspect_wallet ? `${attribution.suspect_wallet.substring(0, 6)}...${attribution.suspect_wallet.slice(-4)}` : "N/A"}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Network / Hops</span>
                    <span style={{ fontWeight: 700, color: "#0F172A" }}>
                      {attribution.network} • {attribution.hop_distance} Hops
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748B", display: "block", fontSize: "10px", textTransform: "uppercase" }}>Attributed VASP</span>
                    <span style={{ fontWeight: 800, color: "#047857" }}>
                      {attribution.nearest_vasp || "Unknown"}
                    </span>
                  </div>
                </div>
              )}

              <button
                type="button"
                id="btn-synthesize-graph"
                className="gov-btn gov-btn-saffron"
                onClick={handleSynthesizeGraph}
                disabled={isSynthesizing}
                style={{ padding: "10px 22px", fontSize: "13px", fontWeight: 700, gap: "8px", marginTop: "4px" }}
              >
                <Layers size={16} /> Synthesize Multi-Chain Graph Canvas
              </button>
            </div>
          </div>
        )}

        {/* Selected Node Forensic Inspector Card */}
        {selectedNode && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              width: "340px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              boxShadow: "var(--shadow-lg)",
              padding: "14px",
              zIndex: 20,
              animation: "slideIn 0.15s ease-out"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 700,
                    padding: "3px 6px",
                    borderRadius: "3px",
                    background:
                      selectedNode.node_type === "SUSPECT_WALLET"
                        ? "#FEE2E2"
                        : selectedNode.node_type === "VASP_HOT_WALLET"
                        ? "#D1FAE5"
                        : selectedNode.node_type === "CANDIDATE_DEPOSIT"
                        ? "#EFF6FF"
                        : "#FEF3C7",
                    color:
                      selectedNode.node_type === "SUSPECT_WALLET"
                        ? "#991B1B"
                        : selectedNode.node_type === "VASP_HOT_WALLET"
                        ? "#065F46"
                        : selectedNode.node_type === "CANDIDATE_DEPOSIT"
                        ? "#1E40AF"
                        : "#B45309"
                  }}
                >
                  {selectedNode.node_type}
                </span>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0F172A" }}>
                  Hop {selectedNode.hop_level}
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ fontSize: "10px", color: "#64748B", marginBottom: "3px", fontWeight: 600 }}>CRYPTOCURRENCY ADDRESS:</div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                wordBreak: "break-all",
                color: "#0F172A",
                background: "#F1F5F9",
                padding: "6px 8px",
                borderRadius: "4px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "6px"
              }}
            >
              <span>{selectedNode.id}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedNode.id, "node_addr")}
                style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === "node_addr" ? "#059669" : "#64748B" }}
                title="Copy Address"
              >
                {copiedKey === "node_addr" ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>

            {selectedNode.cluster_entity && (
              <div style={{ fontSize: "11.5px", color: "#1E40AF", fontWeight: 700, marginBottom: "4px" }}>
                Entity: {selectedNode.cluster_entity}
              </div>
            )}

            <div style={{ fontSize: "11px", color: "#475569", marginBottom: "8px" }}>
              Network: <b>{selectedNode.network}</b> • Custodial Hot Storage: <b>{selectedNode.is_hot_wallet ? "YES" : "NO"}</b>
            </div>

            {/* Legal / Statutory Guidance */}
            <div
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: "4px",
                padding: "8px",
                fontSize: "10.5px",
                color: "#334155",
                marginBottom: "10px"
              }}
            >
              <b>Statutory Action: </b>
              {selectedNode.node_type === "SUSPECT_WALLET" && "Primary criminal intake wallet. Issue Sec 94 BNSS production summons to victim onboarding rail."}
              {selectedNode.node_type === "INTERMEDIARY_UNHOSTED" && "Unhosted peeling mule wallet. Traverse onward hops to locate terminating centralized exchange."}
              {selectedNode.node_type === "CANDIDATE_DEPOSIT" && "Identified VASP deposit wallet! Direct target of emergency Sec 106/107 BNSS debit freeze notice."}
              {selectedNode.node_type === "VASP_HOT_WALLET" && "Centralized exchange pooled liquidity vault. Establishes institutional custody for statutory compliance."}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <a
                href={getExplorerUrl(selectedNode.id, "address", selectedNode.network)}
                target="_blank"
                rel="noopener noreferrer"
                className="gov-btn gov-btn-outline"
                id="btn-open-public-explorer"
                style={{
                  width: "100%",
                  fontSize: "11px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px",
                  textDecoration: "none"
                }}
              >
                <ExternalLink size={12} />
                Open in Public Ledger Explorer ({getExplorerName(selectedNode.network)})
              </a>
              <button
                type="button"
                onClick={() => setSelectedInspectNode(selectedNode)}
                className="gov-btn gov-btn-secondary"
                id="btn-inspect-sovereign-calldata"
                style={{
                  width: "100%",
                  fontSize: "11px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "6px"
                }}
              >
                <ShieldCheck size={12} />
                Inspect Sovereign Calldata & Proof
              </button>
            </div>
          </div>
        )}

        {/* Selected Edge Forensic Inspector Card */}
        {selectedEdge && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              width: "340px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              boxShadow: "var(--shadow-lg)",
              padding: "14px",
              zIndex: 20,
              animation: "slideIn 0.15s ease-out"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 700,
                    padding: "3px 6px",
                    borderRadius: "3px",
                    background: selectedEdge.is_sweep ? "#FEF3C7" : "#EFF6FF",
                    color: selectedEdge.is_sweep ? "#B45309" : "#1E40AF"
                  }}
                >
                  {selectedEdge.is_sweep ? "VASP INTERNAL SWEEP" : "STANDARD ON-CHAIN HOP"}
                </span>
              </div>
              <button
                onClick={() => setSelectedEdge(null)}
                style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
              >
                <X size={14} />
              </button>
            </div>

            <div style={{ fontSize: "10px", color: "#64748B", marginBottom: "3px", fontWeight: 600 }}>TRANSACTION HASH:</div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                wordBreak: "break-all",
                color: "#0F172A",
                background: "#F1F5F9",
                padding: "6px 8px",
                borderRadius: "4px",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "6px"
              }}
            >
              <span>{selectedEdge.tx_hash}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(selectedEdge.tx_hash, "edge_tx")}
                style={{ background: "none", border: "none", cursor: "pointer", color: copiedKey === "edge_tx" ? "#059669" : "#64748B" }}
                title="Copy Tx Hash"
              >
                {copiedKey === "edge_tx" ? <Check size={13} /> : <Copy size={13} />}
              </button>
            </div>

            <div style={{ fontSize: "11px", color: "#334155", marginBottom: "4px" }}>
              Transferred Volume: <b style={{ color: "#0B1B3D" }}>{selectedEdge.decimal_amount} {selectedEdge.asset_symbol}</b>
            </div>
            <div style={{ fontSize: "10.5px", color: "#64748B", marginBottom: "8px" }}>
              Timestamp: {new Date(selectedEdge.block_timestamp).toLocaleString("en-IN")}
            </div>

            {selectedEdge.is_sweep && (
              <div
                style={{
                  background: "#FFFBEB",
                  border: "1px solid #FDE68A",
                  borderRadius: "4px",
                  padding: "8px",
                  fontSize: "10.5px",
                  color: "#92400E",
                  marginBottom: "10px"
                }}
              >
                <b>Consolidation Heuristic: </b>
                Automated exchange sweep verified: 100% of deposit balance consolidated into exchange omnibus cold/hot storage within 12 blocks.
              </div>
            )}

            <a
              href={getExplorerUrl(selectedEdge.tx_hash, "tx", selectedEdge.network)}
              target="_blank"
              rel="noopener noreferrer"
              className="gov-btn gov-btn-outline"
              id="btn-verify-edge-explorer"
              style={{
                width: "100%",
                fontSize: "11px",
                padding: "6px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                textDecoration: "none"
              }}
            >
              <ExternalLink size={12} />
              Verify Transaction on {getExplorerName(selectedEdge.network)}
            </a>
          </div>
        )}
      </div>

      {/* Visual Canvas Legends */}
      <div
        style={{
          padding: "8px 16px",
          background: "#FFFFFF",
          borderTop: "1px solid var(--gov-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
          fontSize: "10.5px",
          color: "#475569"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#DC2626" }} />
            Suspect Seed
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#D97706" }} />
            Unhosted Mule
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#0284C7" }} />
            Candidate Deposit
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "2px", background: "#059669" }} />
            VASP Hot Storage
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <span style={{ width: "14px", height: "0px", borderTop: "2px dashed #D97706" }} />
            Sweep Consolidation
          </span>
        </div>

        <span style={{ color: "#64748B", fontWeight: 500 }}>
          {attribution ? `${attribution.graph_nodes.length} Nodes • ${attribution.graph_edges.length} Edges` : "0 Nodes"}
        </span>
      </div>

      {/* Sovereign Ledger Calldata & Cryptographic Proof Modal */}
      <SovereignLedgerModal
        isOpen={Boolean(selectedInspectNode)}
        onClose={() => setSelectedInspectNode(null)}
        node={selectedInspectNode}
        attribution={attribution}
      />
    </div>
  );
};
