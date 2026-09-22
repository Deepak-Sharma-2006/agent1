/**
 * Project CHAKRA: API Client Service
 * Interacts with FastAPI backend on port 8000.
 */

import type {
  AttributionRequest,
  AttributionResponse,
  CustomGraphInjectionRequest,
  ScenarioMetadata,
  AuthUser,
  SahyogNotice,
  MerkleVerificationResult,
  DispatchNoticeResult
} from "../types";

const API_BASE = "/api/v1";

export class ChakraApiService {
  private userRoleKey: string = "io_delhi";

  setUserRole(roleKey: string) {
    this.userRoleKey = roleKey;
  }

  getUserRole(): string {
    return this.userRoleKey;
  }

  private getHeaders(): HeadersInit {
    return {
      "Content-Type": "application/json",
      "X-User-Role": this.userRoleKey
    };
  }

  async checkHealth(): Promise<Record<string, unknown>> {
    const res = await fetch("/health");
    if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
    return res.json();
  }

  async getScenarios(): Promise<ScenarioMetadata[]> {
    const res = await fetch(`${API_BASE}/attribution/scenarios`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to fetch scenarios: ${res.statusText}`);
    return res.json();
  }

  async loadScenario(scenarioId: string): Promise<{ status: string; scenario: ScenarioMetadata; suggested_request: AttributionRequest }> {
    const res = await fetch(`${API_BASE}/attribution/scenarios/${scenarioId}/load`, {
      method: "POST",
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Failed to load scenario: ${res.statusText}`);
    return res.json();
  }

  async traceAttribution(request: AttributionRequest): Promise<AttributionResponse> {
    const res = await fetch(`${API_BASE}/attribution/trace`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(request)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Attribution trace failed");
    }
    return res.json();
  }

  async injectCustomGraph(injection: CustomGraphInjectionRequest): Promise<AttributionResponse> {
    const res = await fetch(`${API_BASE}/attribution/inject`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(injection)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Custom transaction stream injection failed");
    }
    return res.json();
  }

  async resetGraphState(): Promise<{ status: string; total_nodes: number; total_edges: number }> {
    const res = await fetch(`${API_BASE}/attribution/reset`, {
      method: "POST",
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error(`Reset failed: ${res.statusText}`);
    return res.json();
  }

  async generateSahyogNotice(attribution: AttributionResponse): Promise<SahyogNotice> {
    const res = await fetch(`${API_BASE}/sahyog/notices/generate`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(attribution)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Notice generation failed");
    }
    return res.json();
  }

  async dispatchSahyogNotice(
    noticeId: string,
    dscSignature: string,
    notes: string
  ): Promise<DispatchNoticeResult> {
    const res = await fetch(`${API_BASE}/sahyog/notices/dispatch`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        notice_id: noticeId,
        dsc_token_signature: dscSignature,
        sanctioning_authority_notes: notes
      })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || "Notice dispatch failed");
    }
    return res.json();
  }

  async getRbacUsers(): Promise<AuthUser[]> {
    const res = await fetch(`${API_BASE}/evidence/rbac/users`, {
      headers: this.getHeaders()
    });
    if (!res.ok) throw new Error("Failed to load RBAC users");
    return res.json();
  }

  async verifyMerkleLeaf(
    merkleRoot: string,
    targetLeafHash: string,
    allLeafHashes: string[]
  ): Promise<MerkleVerificationResult> {
    const res = await fetch(`${API_BASE}/evidence/merkle/verify`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({
        merkle_root: merkleRoot,
        target_leaf_hash: targetLeafHash,
        all_leaf_hashes: allLeafHashes
      })
    });
    if (!res.ok) throw new Error("Merkle proof verification failed");
    return res.json();
  }

  async getPdfBlob(endpoint: string, attribution: AttributionResponse): Promise<Blob> {
    const res = await fetch(`${API_BASE}/evidence/${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(attribution)
    });
    if (!res.ok) throw new Error(`PDF generation failed: ${res.statusText}`);
    return res.blob();
  }

  async downloadPdfBlob(endpoint: string, attribution: AttributionResponse, filename: string): Promise<void> {
    const blob = await this.getPdfBlob(endpoint, attribution);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}

export const api = new ChakraApiService();
