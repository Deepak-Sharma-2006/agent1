import React, { useEffect, useRef, useState } from "react";
import cytoscape from "cytoscape";
import type { Core, NodeSingular } from "cytoscape";
import type { AttributionResponse, GraphNode, TransactionEdge } from "../types";
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  ExternalLink,
  Shield,
  Layers,
  Zap,
  CheckCircle2,
  X
} from "lucide-react";

interface AttributionGraphProps {
  attribution: AttributionResponse | null;
  isLoading: boolean;
}

export const AttributionGraph: React.FC<AttributionGraphProps> = ({
  attribution,
  isLoading
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cyRef = useRef<Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy prior instance
    if (cyRef.current) {
      cyRef.current.destroy();
      cyRef.current = null;
    }

    if (!attribution || !attribution.graph_nodes || attribution.graph_nodes.length === 0) {
      return;
    }

    // Build Cytoscape Elements
    const elements: cytoscape.ElementDefinition[] = [];

    // Group nodes by hop level for spatial column layout
    const nodesByHop: Record<number, GraphNode[]> = {};
    attribution.graph_nodes.forEach((n) => {
      const hop = n.hop_level ?? 0;
      if (!nodesByHop[hop]) nodesByHop[hop] = [];
      nodesByHop[hop].push(n);
    });

    const maxHop = Math.max(0, ...Object.keys(nodesByHop).map(Number));
    const containerWidth = containerRef.current.clientWidth || 700;
    const containerHeight = containerRef.current.clientHeight || 500;

    // Distribute nodes spatially across columns
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
          cluster: n.cluster_entity
        },
        position: { x, y }
      });
    });

    // Add Edges
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

    const cy = cytoscape({
      container: containerRef.current,
      elements: elements,
      style: [
        {
          selector: "node",
          style: {
            "background-color": "data(bgColor)",
            "border-width": 2,
            "border-color": "data(borderColor)",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            "text-wrap": "wrap",
            color: "#FFFFFF",
            "font-size": "9.5px",
            "font-family": "Inter, sans-serif",
            "font-weight": "bold",
            width: 95,
            height: 48,
            "overlay-opacity": 0
          }
        },
        {
          selector: 'node[node_type = "SUSPECT_WALLET"]',
          style: {
            "background-color": "#DC2626",
            "border-color": "#7F1D1D",
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
    });

    cy.on("tap", (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
      }
    });

    cyRef.current = cy;
    cy.fit(undefined, 30);
  }, [attribution]);

  const handleZoomIn = () => cyRef.current?.zoom(cyRef.current.zoom() * 1.25);
  const handleZoomOut = () => cyRef.current?.zoom(cyRef.current.zoom() * 0.8);
  const handleFit = () => cyRef.current?.fit(undefined, 30);

  return (
    <div className="gov-card" style={{ height: "100%", minHeight: "520px", display: "flex", flexDirection: "column" }}>
      {/* Canvas Header & Action Controls */}
      <div className="gov-card-header">
        <span className="gov-card-title">
          <Layers size={15} color="#0F2942" /> Interactive Multi-Chain Attribution Canvas
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button className="gov-btn-text-size" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn size={12} />
          </button>
          <button className="gov-btn-text-size" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut size={12} />
          </button>
          <button className="gov-btn-text-size" onClick={handleFit} title="Fit to Viewport">
            <Maximize2 size={12} />
          </button>
        </div>
      </div>

      {/* Main Cytoscape Viewport */}
      <div style={{ position: "relative", flex: 1, background: "#F8FAFC", minHeight: "440px" }}>
        {isLoading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(248, 250, 252, 0.8)",
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
              Tracing Multi-Hop Peel Chains via Beam Search...
            </span>
          </div>
        )}

        <div ref={containerRef} style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }} />

        {/* Selected Node Details Floating Drawer */}
        {selectedNode && (
          <div
            style={{
              position: "absolute",
              bottom: "12px",
              left: "12px",
              width: "310px",
              background: "#FFFFFF",
              border: "1px solid #CBD5E1",
              borderRadius: "8px",
              boxShadow: "var(--shadow-lg)",
              padding: "12px",
              zIndex: 20
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    padding: "2px 5px",
                    borderRadius: "3px",
                    background:
                      selectedNode.node_type === "SUSPECT_WALLET"
                        ? "#FEE2E2"
                        : selectedNode.node_type === "VASP_HOT_WALLET"
                        ? "#D1FAE5"
                        : "#EFF6FF",
                    color:
                      selectedNode.node_type === "SUSPECT_WALLET"
                        ? "#991B1B"
                        : selectedNode.node_type === "VASP_HOT_WALLET"
                        ? "#065F46"
                        : "#1E40AF"
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

            <div style={{ fontSize: "10px", color: "#64748B", marginBottom: "2px" }}>ADDRESS:</div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                wordBreak: "break-all",
                color: "#0F172A",
                background: "#F1F5F9",
                padding: "4px 6px",
                borderRadius: "4px",
                marginBottom: "8px"
              }}
            >
              {selectedNode.id}
            </div>

            {selectedNode.cluster_entity && (
              <div style={{ fontSize: "11px", color: "#1E40AF", fontWeight: 600, marginBottom: "4px" }}>
                Entity: {selectedNode.cluster_entity}
              </div>
            )}
            <div style={{ fontSize: "10.5px", color: "#475569" }}>
              Network: <b>{selectedNode.network}</b> • Hot Storage: <b>{selectedNode.is_hot_wallet ? "YES" : "NO"}</b>
            </div>
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
    </div>
  );
};
