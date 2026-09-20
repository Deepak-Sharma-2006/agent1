"""
Project CHAKRA: Automated Test Suite for Nearest VASP Attribution
Verifies dynamic graph pathfinding, deposit-to-sweep heuristics, and custom jury injection.
"""

import json
from decimal import Decimal
from pathlib import Path
import pytest

from app.core.config import settings
from app.core.merkle import MerkleEvidenceTree
from app.models.schemas import (
    AttributionRequest, NetworkType, TransactionEdge
)
from app.engine.graph_store import GraphStore
from app.engine.sweep_detector import DepositToSweepDetector
from app.engine.beam_search import DegreeBoundedBeamSearchEngine
from app.data.seed_scenarios import populate_seed_data, SCENARIO_METADATA

@pytest.fixture
def test_engine():
    """Initializes a fresh graph store and beam search engine."""
    with open(settings.VASP_REGISTRY_PATH, "r", encoding="utf-8") as f:
        vasp_data = json.load(f)

    store = GraphStore()
    populate_seed_data(store)
    sweep_det = DepositToSweepDetector(vasp_data)
    engine = DegreeBoundedBeamSearchEngine(store, sweep_det)
    return engine, store

def test_scenario_1_bengaluru_task_fraud(test_engine):
    """Verifies that Bengaluru Telegram Task fraud resolves dynamically to Binance Hot Wallet 14."""
    engine, _ = test_engine
    case_meta = SCENARIO_METADATA[0]
    
    req = AttributionRequest(
        sahyog_case_id="SHG-2026-BLR-00412",
        ncrp_complaint_id=case_meta["ncrp_id"],
        suspect_wallet_address=case_meta["suspect_wallet"],
        network=NetworkType.TRON,
        reported_fraud_amount_inr=case_meta["victim_loss_inr"],
        max_hops=5,
        dust_threshold_usd=10.0
    )

    res = engine.execute_attribution(req)

    assert res.attribution_status == "VASP_ATTRIBUTED_HIGH_CONFIDENCE"
    assert res.nearest_vasp == "Binance"
    assert res.fiu_ind_reg_number == "FIU-IND-CASP-2024-001"
    assert res.confidence_score >= 85.0
    assert "Tier 1" in res.confidence_tier
    assert res.sweep_proof is not None
    assert res.sweep_proof.is_sweep_confirmed is True
    assert res.sweep_proof.sweep_ratio >= 0.95
    assert len(res.merkle_evidence_root) == 64  # Valid SHA-256 hex string

def test_scenario_2_mumbai_trading_app_fraud(test_engine):
    """Verifies that Mumbai Fake Trading App fraud resolves to CoinDCX Vault 02."""
    engine, _ = test_engine
    case_meta = SCENARIO_METADATA[1]

    req = AttributionRequest(
        sahyog_case_id="SHG-2026-MUM-01189",
        ncrp_complaint_id=case_meta["ncrp_id"],
        suspect_wallet_address=case_meta["suspect_wallet"],
        network=NetworkType.POL,
        reported_fraud_amount_inr=case_meta["victim_loss_inr"],
        max_hops=5,
        dust_threshold_usd=10.0
    )

    res = engine.execute_attribution(req)

    assert res.attribution_status == "VASP_ATTRIBUTED_HIGH_CONFIDENCE"
    assert res.nearest_vasp == "CoinDCX"
    assert res.fiu_ind_reg_number == "FIU-IND-CASP-2023-018"
    assert res.confidence_score >= 85.0
    assert res.sweep_proof is not None

def test_scenario_3_delhi_hospital_ransomware(test_engine):
    """Verifies that Delhi Hospital Ransomware BTC peeling chain resolves to WazirX."""
    engine, _ = test_engine
    case_meta = SCENARIO_METADATA[2]

    req = AttributionRequest(
        sahyog_case_id="SHG-2026-DEL-00084",
        ncrp_complaint_id=case_meta["ncrp_id"],
        suspect_wallet_address=case_meta["suspect_wallet"],
        network=NetworkType.BTC,
        reported_fraud_amount_inr=case_meta["victim_loss_inr"],
        max_hops=5,
        dust_threshold_usd=10.0
    )

    res = engine.execute_attribution(req)

    assert res.attribution_status == "VASP_ATTRIBUTED_HIGH_CONFIDENCE"
    assert res.nearest_vasp == "WazirX"
    assert res.confidence_score >= 85.0
    assert res.asset_symbol == "BTC"

def test_dynamic_custom_jury_injection(test_engine):
    """
    CRITICAL TEST: Verifies that if a jury injects an entirely new custom wallet
    and custom transactions, the backend dynamically traverses and attributes it!
    """
    engine, store = test_engine

    custom_suspect = "T_JURY_CUSTOM_SUSPECT_WALLET_9999999"
    custom_mule = "T_JURY_CUSTOM_MULE_WALLET_8888888"
    custom_deposit = "T_JURY_CUSTOM_DEPOSIT_FORWARDER_777"
    known_coindcx_hot = "TCoinDCXHotStorage01aBcDeFgHiJkLmNoPq"

    # Inject custom edges dynamically into the store
    edge1 = TransactionEdge(
        tx_hash="0xjury_custom_hash_001",
        network=NetworkType.TRON,
        source_address=custom_suspect,
        destination_address=custom_mule,
        asset_symbol="USDT",
        raw_amount="5000000000",
        decimal_amount="5000.000000",
        fiat_inr_at_exec=415000.0,
        fiat_usd_at_exec=5000.0,
        block_timestamp="2026-09-19T10:00:00Z",
        block_height=70000000
    )
    edge2 = TransactionEdge(
        tx_hash="0xjury_custom_hash_002",
        network=NetworkType.TRON,
        source_address=custom_mule,
        destination_address=custom_deposit,
        asset_symbol="USDT",
        raw_amount="4990000000",
        decimal_amount="4990.000000",
        fiat_inr_at_exec=414170.0,
        fiat_usd_at_exec=4990.0,
        block_timestamp="2026-09-19T10:15:00Z",
        block_height=70000050
    )
    edge3 = TransactionEdge(
        tx_hash="0xjury_custom_hash_003_sweep",
        network=NetworkType.TRON,
        source_address=custom_deposit,
        destination_address=known_coindcx_hot,  # Swept to CoinDCX
        asset_symbol="USDT",
        raw_amount="4990000000",
        decimal_amount="4990.000000",
        fiat_inr_at_exec=414170.0,
        fiat_usd_at_exec=4990.0,
        block_timestamp="2026-09-19T10:25:00Z",
        block_height=70000100,
        is_sweep=True
    )

    store.add_edge(edge1)
    store.add_edge(edge2)
    store.add_edge(edge3)

    # Now query the custom suspect wallet
    req = AttributionRequest(
        sahyog_case_id="SHG-JURY-TEST-001",
        ncrp_complaint_id="2026-NCRP-JURY-TEST",
        suspect_wallet_address=custom_suspect,
        network=NetworkType.TRON,
        reported_fraud_amount_inr=415000.0,
        max_hops=5,
        dust_threshold_usd=10.0
    )

    res = engine.execute_attribution(req)

    # Must dynamically find CoinDCX
    assert res.attribution_status == "VASP_ATTRIBUTED_HIGH_CONFIDENCE"
    assert res.nearest_vasp == "CoinDCX"
    assert res.fiu_ind_reg_number == "FIU-IND-CASP-2023-018"
    assert res.deposit_address == custom_deposit
    assert res.hot_wallet_address == known_coindcx_hot
    assert res.confidence_score >= 85.0
    assert len(res.graph_nodes) >= 4

def test_dust_pruning(test_engine):
    """Verifies that tiny dust transactions (< $10 USD) are pruned from traversal."""
    engine, store = test_engine

    dust_suspect = "T_DUST_SUSPECT_WALLET_111"
    dust_target = "T_DUST_DESTINATION_WALLET_222"

    store.add_edge(TransactionEdge(
        tx_hash="0xdust_hash_tiny",
        network=NetworkType.TRON,
        source_address=dust_suspect,
        destination_address=dust_target,
        asset_symbol="USDT",
        raw_amount="100000",  # 0.10 USDT ($0.10)
        decimal_amount="0.100000",
        fiat_inr_at_exec=8.3,
        fiat_usd_at_exec=0.10,
        block_timestamp="2026-09-19T12:00:00Z",
        block_height=70000500
    ))

    req = AttributionRequest(
        sahyog_case_id="SHG-DUST-TEST",
        ncrp_complaint_id="2026-NCRP-DUST",
        suspect_wallet_address=dust_suspect,
        network=NetworkType.TRON,
        dust_threshold_usd=10.0
    )

    res = engine.execute_attribution(req)
    # Output edges must be 0 because the only transaction was dust
    assert len(res.graph_edges) == 0

def test_merkle_evidence_tree():
    """Verifies deterministic SHA-256 Merkle tree calculation."""
    hashes = [
        "0x4f8a2b91c7e63d01111111111111111111111111111111111111111111111111",
        "0x7a1b8c3d4e5f6011111111111111111111111111111111111111111111111111",
        "0x9a1c8f3e2b7d0111111111111111111111111111111111111111111111111111"
    ]
    root1 = MerkleEvidenceTree.compute_root(hashes)
    root2 = MerkleEvidenceTree.compute_root(hashes)
    assert root1 == root2
    assert len(root1) == 64
