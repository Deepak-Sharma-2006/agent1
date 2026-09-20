"""
Project CHAKRA: Comprehensive API Integration Test Suite
Verifies all REST endpoints, dynamic jury injection, SAHYOG dispatch,
statutory PDF streaming, and Merkle cryptographic verification.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.models.schemas import NetworkType, TransactionEdge

client = TestClient(app)

def test_health_check():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert "Bharatiya Sakshya Adhiniyam" in str(data["statutory_compliance"])

def test_root():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert "endpoints" in data

def test_get_scenarios():
    res = client.get("/api/v1/attribution/scenarios")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 4
    case_ids = [s["id"] for s in data]
    assert "CASE_1_BLR_TELEGRAM_TASK" in case_ids
    assert "CASE_2_MUM_FAKE_TRADING_APP" in case_ids

def test_load_scenario():
    res = client.post("/api/v1/attribution/scenarios/CASE_1_BLR_TELEGRAM_TASK/load")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "LOADED"
    assert data["suggested_request"]["suspect_wallet_address"] == "TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f"

def test_trace_attribution():
    req_body = {
        "sahyog_case_id": "SHG-2026-BLR-00412",
        "ncrp_complaint_id": "2026-NCRP-339182",
        "suspect_wallet_address": "TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
        "network": "TRON",
        "reported_fraud_amount_inr": 4500000.0,
        "max_hops": 5,
        "dust_threshold_usd": 10.0
    }
    res = client.post("/api/v1/attribution/trace", json=req_body)
    assert res.status_code == 200
    data = res.json()
    assert data["nearest_vasp"] == "Binance"
    assert data["confidence_score"] >= 85.0
    assert data["sweep_proof"] is not None
    assert data["sweep_proof"]["is_sweep_confirmed"] is True
    assert len(data["merkle_evidence_root"]) in (64, 66)
    assert len(data["graph_nodes"]) > 0
    assert len(data["graph_edges"]) > 0

def test_dynamic_jury_injection_endpoint():
    """Verifies that an evaluator/jury can inject custom arbitrary nodes/edges at runtime."""
    injection_body = {
        "suspect_wallet_address": "0xJurySuspectWalletAlpha999999999999999999",
        "network": "ETH",
        "edges": [
            {
                "tx_hash": "0x9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba",
                "network": "ETH",
                "source_address": "0xJurySuspectWalletAlpha999999999999999999",
                "destination_address": "0xJuryMuleIntermediary01111111111111111111",
                "asset_symbol": "USDT",
                "raw_amount": "50000000000",
                "decimal_amount": "50000.000000",
                "fiat_inr_at_exec": 4150000.0,
                "fiat_usd_at_exec": 50000.0,
                "block_timestamp": "2026-09-01T10:00:00Z",
                "block_height": 20111000
            },
            {
                "tx_hash": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
                "network": "ETH",
                "source_address": "0xJuryMuleIntermediary01111111111111111111",
                "destination_address": "0x3P3qWazirXHotStorage03Eth00000000000001",  # Known WazirX ETH Hot Storage
                "asset_symbol": "USDT",
                "raw_amount": "49990000000",
                "decimal_amount": "49990.000000",
                "fiat_inr_at_exec": 4149170.0,
                "fiat_usd_at_exec": 49990.0,
                "block_timestamp": "2026-09-01T10:20:00Z",
                "block_height": 20111010,
                "is_sweep": True
            }
        ]
    }
    res = client.post("/api/v1/attribution/inject", json=injection_body)
    assert res.status_code == 200
    data = res.json()
    assert data["nearest_vasp"] == "WazirX"
    assert data["confidence_score"] > 80.0
    assert data["hop_distance"] in (1, 2)

def test_sahyog_notice_generation_and_dispatch():
    # First get an attribution result
    req_body = {
        "sahyog_case_id": "SHG-2026-DEL-IFSO-00084",
        "ncrp_complaint_id": "2026-NCRP-119283",
        "suspect_wallet_address": "bc1qar0s523456789abcdef0123456789abcdef01",
        "network": "BTC",
        "reported_fraud_amount_inr": 14500000.0,
        "max_hops": 5,
        "dust_threshold_usd": 10.0
    }
    trace_res = client.post("/api/v1/attribution/trace", json=req_body)
    assert trace_res.status_code == 200
    attr_data = trace_res.json()

    # Generate notice
    gen_body = {
        "attribution_result": attr_data,
        "fir_number": "FIR-2026-DEL-IFSO-00084",
        "urgency_level": "EMERGENCY_24HR"
    }
    gen_res = client.post("/api/v1/sahyog/notices/generate", json=gen_body)
    assert gen_res.status_code == 200
    notice_data = gen_res.json()
    notice_id = notice_data["notice_id"]
    assert notice_id.startswith("SHG-BNSS-")
    assert notice_data["status"] == "DRAFT_PENDING_DISPATCH"

    # Dispatch notice
    dispatch_body = {
        "notice_id": notice_id,
        "dsc_token_signature": "0xDSC_CLASS3_VERIFIED_KEY_HASH_DELHI_CYBER_PS",
        "sanctioning_authority_notes": "Urgent Section 106 BNSS 24-hr freeze warranted for ransomware proceeds."
    }
    disp_res = client.post("/api/v1/sahyog/notices/dispatch", json=dispatch_body)
    assert disp_res.status_code == 200
    disp_data = disp_res.json()
    assert disp_data["debit_freeze_active"] is True
    assert "VASP-" in disp_data["vasp_ticket_id"]

    # Check status
    status_res = client.get(f"/api/v1/sahyog/notices/{notice_id}/status")
    assert status_res.status_code == 200
    assert status_res.json()["status"] == "DISPATCHED_ACKNOWLEDGED"

def test_pdf_endpoints():
    req_body = {
        "sahyog_case_id": "SHG-2026-BLR-00412",
        "ncrp_complaint_id": "2026-NCRP-339182",
        "suspect_wallet_address": "TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
        "network": "TRON",
        "reported_fraud_amount_inr": 4500000.0,
        "max_hops": 5,
        "dust_threshold_usd": 10.0
    }
    attr_res = client.post("/api/v1/attribution/trace", json=req_body)
    attr_data = attr_res.json()

    # 1. Dossier PDF
    dossier_res = client.post("/api/v1/evidence/dossier/pdf", json=attr_data)
    assert dossier_res.status_code == 200
    assert dossier_res.headers["content-type"] == "application/pdf"
    assert dossier_res.content.startswith(b"%PDF-")

    # 2. BNSS Summons PDF
    bnss_res = client.post("/api/v1/evidence/bnss-summons/pdf", json=attr_data)
    assert bnss_res.status_code == 200
    assert bnss_res.headers["content-type"] == "application/pdf"
    assert bnss_res.content.startswith(b"%PDF-")

    # 3. BSA Section 63(4) Certificate PDF
    bsa_res = client.post("/api/v1/evidence/bsa-certificate/pdf", json=attr_data)
    assert bsa_res.status_code == 200
    assert bsa_res.headers["content-type"] == "application/pdf"
    assert bsa_res.content.startswith(b"%PDF-")

def test_merkle_verify_endpoint():
    leaves = [
        "0x1111111111111111111111111111111111111111111111111111111111111111",
        "0x2222222222222222222222222222222222222222222222222222222222222222",
        "0x3333333333333333333333333333333333333333333333333333333333333333"
    ]
    from app.core.merkle import MerkleEvidenceTree
    tree = MerkleEvidenceTree(leaves)
    root = tree.get_merkle_root()

    verify_req = {
        "merkle_root": root,
        "target_leaf_hash": leaves[1],
        "all_leaf_hashes": leaves
    }
    res = client.post("/api/v1/evidence/merkle/verify", json=verify_req)
    assert res.status_code == 200
    data = res.json()
    assert data["is_leaf_valid"] is True
    assert data["root_match"] is True

def test_rbac_users_endpoint():
    res = client.get("/api/v1/evidence/rbac/users")
    assert res.status_code == 200
    users = res.json()
    assert len(users) == 5
    roles = [u["role"] for u in users]
    assert "INVESTIGATING_OFFICER" in roles
    assert "SUPERVISORY_OFFICER" in roles
    assert "FORENSIC_EXAMINER" in roles
    assert "THREAT_ANALYST" in roles
    assert "VASP_NODAL_OFFICER" in roles
