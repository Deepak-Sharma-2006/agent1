/**
 * Project BHEDAK - API Client Service
 * Interacts with FastAPI backend with resilient fallbacks for offline development.
 */

import type {
  FullCaseDossier,
  ScanOnionResponse,
  StylometryResponse,
  BSA63Certificate,
  AttributionSignal,
  CytoscapeElement,
  AttributionPathHop,
  BlockchainHop,
  STIXBundle
} from "../types";

const API_BASE = "/api";

export const apiService = {
  async getHealth(): Promise<{ status: string; security_standard: string }> {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (!res.ok) throw new Error("Health check failed");
      return await res.json();
    } catch {
      return { status: "STANDALONE_DEMO", security_standard: "Millee 20-Point Hardening (Local Enclave)" };
    }
  },

  async getCaseDossier(): Promise<FullCaseDossier> {
    const res = await fetch(`${API_BASE}/case`);
    if (!res.ok) throw new Error("Failed to load case dossier");
    return await res.json();
  },

  async scanOnionService(onionAddress: string): Promise<ScanOnionResponse> {
    const res = await fetch(`${API_BASE}/scan-onion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ onion_address: onionAddress })
    });
    if (!res.ok) throw new Error("Onion reconnaissance scan failed");
    return await res.json();
  },

  async getGraph(startNode?: string): Promise<{
    nodes_count: number;
    edges_count: number;
    elements: CytoscapeElement[];
    attribution_path?: AttributionPathHop[];
  }> {
    const url = startNode ? `${API_BASE}/graph?start_node=${encodeURIComponent(startNode)}` : `${API_BASE}/graph`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Failed to fetch knowledge graph elements");
    return await res.json();
  },

  async getBlockchainHops(walletId: string = "wallet-btc-intake"): Promise<{
    start_wallet: string;
    total_hops: number;
    hops: BlockchainHop[];
  }> {
    const res = await fetch(`${API_BASE}/graph/blockchain-hops?wallet_id=${encodeURIComponent(walletId)}`);
    if (!res.ok) throw new Error("Failed to trace blockchain hops");
    return await res.json();
  },

  async analyzeStylometry(sampleText: string): Promise<StylometryResponse> {
    const res = await fetch(`${API_BASE}/stylometry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sample_text: sampleText })
    });
    if (!res.ok) throw new Error("Stylometric evaluation failed");
    return await res.json();
  },

  async getDiurnalAnalysis(): Promise<{
    sleep_inactivity_trough_utc: string;
    projected_sleep_trough_ist: string;
    timezone_offset_hours: number;
    confidence_boost: string;
  }> {
    const res = await fetch(`${API_BASE}/stylometry/diurnal`);
    if (!res.ok) throw new Error("Diurnal sleep window analysis failed");
    return await res.json();
  },

  async evaluateConfidence(): Promise<{
    composite_score: number;
    confidence_tier: string;
    confidence_rating: string;
    has_deterministic_proof: boolean;
    signals_evaluated: number;
    legal_admissibility_summary: string;
  }> {
    const res = await fetch(`${API_BASE}/score/evaluate`);
    if (!res.ok) throw new Error("Confidence score evaluation failed");
    return await res.json();
  },

  async evaluateDynamicConfidence(signals: AttributionSignal[]): Promise<{
    composite_score: number;
    confidence_tier: string;
    confidence_rating: string;
    has_deterministic_proof: boolean;
    signals_evaluated: number;
    deterministic_count: number;
    corroborative_count: number;
    probabilistic_count: number;
    legal_admissibility_summary: string;
    execution_time_ms: number;
    is_statutorily_capped: boolean;
  }> {
    const res = await fetch(`${API_BASE}/score/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signals })
    });
    if (!res.ok) throw new Error("Dynamic signal evaluation failed");
    return await res.json();
  },

  async getBSA63Certificate(): Promise<BSA63Certificate> {
    const res = await fetch(`${API_BASE}/export/bsa63`);
    if (!res.ok) throw new Error("Failed to generate Section 63 BSA certificate");
    return await res.json();
  },

  async getSTIXBundle(): Promise<STIXBundle> {
    const res = await fetch(`${API_BASE}/export/stix`);
    if (!res.ok) throw new Error("Failed to generate STIX 2.1 bundle");
    return await res.json();
  }
};

