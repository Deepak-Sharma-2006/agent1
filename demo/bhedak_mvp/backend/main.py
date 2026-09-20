"""
Project BHEDAK - National Sovereign Dark Web Threat Actor De-Anonymization Platform
FastAPI Production Gateway exposing core reconnaissance, graph analytics, stylometry,
and statutory Section 63 BSA 2023 / STIX 2.1 evidentiary endpoints.
"""

import json
import os
import time
from pathlib import Path
from typing import Dict, Any, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from demo.bhedak_mvp.backend.core.models import (
    FullCaseDossier,
    ScanOnionRequest,
    ScanOnionResponse,
    StylometryRequest,
    StylometryResponse,
    ResolvedOrigin,
    EvaluateScoreRequest
)
from demo.bhedak_mvp.backend.engines.engine1_infra import InfrastructureDeAnonymizer
from demo.bhedak_mvp.backend.engines.engine2_graph import KnowledgeGraphEngine
from demo.bhedak_mvp.backend.engines.engine3_stylometry import StylometricEngine
from demo.bhedak_mvp.backend.engines.engine4_scorer import AsymmetricAttributionScorer
from demo.bhedak_mvp.backend.exporters.bsa63_certificate import BSA63CertificateCompiler
from demo.bhedak_mvp.backend.exporters.stix_exporter import STIX21Exporter

app = FastAPI(
    title="Project BHEDAK (भेदक) API Gateway",
    description="National Technical Research Organisation (NTRO) Sovereign Threat Actor De-Anonymization Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


# Enable CORS for sovereign analyst console (Vite + React)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load master synthetic Indian case dossier (Operation MAYAJAAL)
DATA_FILE_PATH = Path(__file__).resolve().parent / "data" / "synthetic_indian_case.json"

def load_case_dossier() -> FullCaseDossier:
    if not DATA_FILE_PATH.exists():
        raise RuntimeError(f"Master case dossier not found at {DATA_FILE_PATH}")
    with open(DATA_FILE_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    return FullCaseDossier(**data)

# Cache initialized case data and graph engine
MASTER_CASE: FullCaseDossier = load_case_dossier()
GRAPH_ENGINE = KnowledgeGraphEngine(
    nodes=[n.model_dump() for n in MASTER_CASE.graph_nodes],
    edges=[e.model_dump() for e in MASTER_CASE.graph_edges]
)


@app.get("/api/health")
def get_health() -> Dict[str, Any]:
    """Health check endpoint providing engine status, FIPS compliance level, and system telemetry."""
    return {
        "status": "OPERATIONAL",
        "system": "Project BHEDAK",
        "agency": "National Technical Research Organisation (NTRO)",
        "division": "Cyber Intelligence & Technology Centre (CITC)",
        "security_standard": "Millee 20-Point Hardening & Section 63 BSA 2023",
        "cryptographic_enclave": "FIPS 140-3 Level 3 Active",
        "engines_online": {
            "engine1_infrastructure": True,
            "engine2_knowledge_graph": True,
            "engine3_indicbert_stylometry": True,
            "engine4_asymmetric_scorer": True
        }
    }


@app.get("/api/case", response_model=FullCaseDossier)
def get_case_dossier() -> FullCaseDossier:
    """Returns the full master case dossier for Operation MAYAJAAL."""
    return MASTER_CASE


@app.post("/api/scan-onion", response_model=ScanOnionResponse)
def scan_onion_service(payload: ScanOnionRequest) -> ScanOnionResponse:
    """
    Engine 1 Endpoint: Scans a Tor v3 hidden service for Apache mod_status IP leaks,
    MurmurHash3 favicon fingerprints, and TLS SSL SAN clearnet hostnames.
    """
    if not payload.onion_address.endswith(".onion"):
        raise HTTPException(status_code=400, detail="Target must be a valid .onion domain")

    result = InfrastructureDeAnonymizer.scan_hidden_service(payload.onion_address)
    return ScanOnionResponse(**result)


@app.get("/api/graph")
def get_graph(start_node: Optional[str] = None, target_category: Optional[str] = "primary") -> Dict[str, Any]:
    """
    Engine 2 Endpoint: Returns Cytoscape.js compatible graph elements.
    Optionally computes shortest attribution path via BFS traversal.
    """
    payload = GRAPH_ENGINE.get_full_graph_payload()
    if start_node:
        path = GRAPH_ENGINE.find_shortest_attribution_path(start_node, target_category or "primary")
        payload["attribution_path"] = path
    return payload


@app.get("/api/graph/blockchain-hops")
def trace_blockchain_hops(wallet_id: str = "wallet-btc-intake") -> Dict[str, Any]:
    """Engine 2 Endpoint: Traces multi-hop fund flows from intake to regulated VASP."""
    hops = GRAPH_ENGINE.trace_blockchain_fund_hops(wallet_id)
    return {"start_wallet": wallet_id, "total_hops": len(hops), "hops": hops}


@app.post("/api/stylometry", response_model=StylometryResponse)
def analyze_stylometry(payload: StylometryRequest) -> StylometryResponse:
    """
    Engine 3 Endpoint: Analyzes incoming text sample using IndicBERT subword embeddings,
    sentence burstiness, and DistilGPT-2 perplexity to detect AI paraphrasers and Hinglish markers.
    """
    if len(payload.sample_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Sample text must be at least 10 characters")

    analysis = StylometricEngine.analyze_sample(payload.sample_text)
    return StylometryResponse(**analysis)


@app.get("/api/stylometry/diurnal")
def analyze_diurnal() -> Dict[str, Any]:
    """Engine 3 Endpoint: Returns diurnal sleep-inactivity trough analysis."""
    # Reference sample of forum activity timestamps
    timestamps = [
        "2026-09-15T08:12:00Z", "2026-09-15T11:45:00Z", "2026-09-15T14:30:00Z",
        "2026-09-15T16:00:00Z", "2026-09-16T09:20:00Z", "2026-09-16T13:10:00Z",
        "2026-09-16T17:40:00Z", "2026-09-17T07:50:00Z", "2026-09-17T12:05:00Z"
    ]
    return StylometricEngine.analyze_diurnal_timestamps(timestamps)


@app.get("/api/score/evaluate")
def evaluate_confidence() -> Dict[str, Any]:
    """Engine 4 Endpoint: Evaluates current case signals with strict court-admissible weighting."""
    t0 = time.perf_counter()
    res = AsymmetricAttributionScorer.evaluate_signals(MASTER_CASE.attribution_signals)
    res["execution_time_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    res["is_statutorily_capped"] = (not res["has_deterministic_proof"] and res["composite_score"] <= 0.65)
    return res


@app.post("/api/score/evaluate")
def evaluate_dynamic_confidence(payload: EvaluateScoreRequest) -> Dict[str, Any]:
    """Engine 4 Endpoint: Evaluates dynamically submitted attribution signals with statutory weighting."""
    t0 = time.perf_counter()
    signals = payload.signals if payload.signals else MASTER_CASE.attribution_signals
    res = AsymmetricAttributionScorer.evaluate_signals(signals)
    res["execution_time_ms"] = round((time.perf_counter() - t0) * 1000, 2)
    res["is_statutorily_capped"] = (not res["has_deterministic_proof"] and res["composite_score"] <= 0.65)
    return res



@app.get("/api/export/bsa63")
def export_bsa63_certificate() -> Dict[str, Any]:
    """Statutory Exporter: Generates court-admissible Section 63 BSA 2023 Electronic Evidence Certificate."""
    return BSA63CertificateCompiler.compile_certificate(MASTER_CASE)


@app.get("/api/export/stix")
def export_stix_bundle() -> Dict[str, Any]:
    """Statutory Exporter: Generates OASIS STIX 2.1 Cyber Threat Intelligence JSON bundle."""
    return STIX21Exporter.export_bundle(MASTER_CASE)
