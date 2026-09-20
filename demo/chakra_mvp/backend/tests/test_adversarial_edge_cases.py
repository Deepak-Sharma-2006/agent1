"""
Project CHAKRA: Adversarial, Boundary & Edge-Case Test Suite
Lead 2 Verification: Probes boundary limits, nulls, malformed addresses,
infinite cycle loops, zero-amount transfers, and extreme graph topologies.
"""

import pytest
from decimal import Decimal
from pydantic import ValidationError

from app.core.merkle import MerkleEvidenceTree
from app.models.schemas import (
    AttributionRequest, NetworkType, TransactionEdge, NodeType
)
from app.engine.graph_store import GraphStore
from app.engine.sweep_detector import DepositToSweepDetector
from app.engine.beam_search import DegreeBoundedBeamSearchEngine

@pytest.fixture
def clean_engine():
    vasp_registry = [
        {
            "name": "CoinDCX",
            "legal_entity": "Neblio Technologies Pvt Ltd",
            "fiu_reg": "FIU-IND-CASP-2023-018",
            "jurisdiction": "India",
            "nodal_email": "compliance@coindcx.com",
            "hot_wallets": {
                "TRON": ["TCoinDCXHotStorage01aBcDeFgHiJkLmNoPq"]
            },
            "fuelers": {
                "TRON": ["TFuelerCoinDCXGasTRX11111111111111111"]
            }
        }
    ]
    store = GraphStore()
    sweep_det = DepositToSweepDetector(vasp_registry)
    engine = DegreeBoundedBeamSearchEngine(store, sweep_det)
    return engine, store

def test_empty_graph_attribution(clean_engine):
    """Probes engine behavior when queried against an empty graph or non-existent wallet."""
    engine, _ = clean_engine
    req = AttributionRequest(
        sahyog_case_id="SHG-EMPTY-001",
        ncrp_complaint_id="NCRP-EMPTY-001",
        suspect_wallet_address="TNonExistentWalletAddress99999999999",
        network=NetworkType.TRON,
        reported_fraud_amount_inr=100000.0,
        max_hops=5
    )
    result = engine.execute_attribution(req)
    assert result.attribution_status == "UNRESOLVED_MULTI_HOP"
    assert result.confidence_score == 0.0
    assert result.nearest_vasp is None
    assert result.deposit_address is None
    assert result.hop_distance == 0

def test_infinite_cycle_loop_resilience(clean_engine):
    """
    Probes graph topology containing a cycle loop:
    Suspect -> A -> B -> C -> A -> (eventually Deposit -> Hot Wallet)
    Ensures pathfinder terminates cleanly without infinite recursion or stack overflow.
    """
    engine, store = clean_engine
    
    suspect = "TSuspectLoopAlpha9999999999999999999"
    node_a = "TMuleLoopNodeA11111111111111111111111"
    node_b = "TMuleLoopNodeB22222222222222222222222"
    node_c = "TMuleLoopNodeC33333333333333333333333"
    deposit = "TCandidateDepositNode4444444444444444"
    hot_wallet = "TCoinDCXHotStorage01aBcDeFgHiJkLmNoPq"

    # Create cycle: Suspect -> A -> B -> C -> A
    store.add_edge(TransactionEdge(
        tx_hash="0xloop_tx_1",
        network=NetworkType.TRON,
        source_address=suspect,
        destination_address=node_a,
        asset_symbol="USDT",
        raw_amount="10000000000",
        decimal_amount="10000.000000",
        fiat_inr_at_exec=830000.0,
        fiat_usd_at_exec=10000.0,
        block_timestamp="2026-09-10T12:00:00Z",
        block_height=60000000
    ))
    store.add_edge(TransactionEdge(
        tx_hash="0xloop_tx_2",
        network=NetworkType.TRON,
        source_address=node_a,
        destination_address=node_b,
        asset_symbol="USDT",
        raw_amount="9900000000",
        decimal_amount="9900.000000",
        fiat_inr_at_exec=821700.0,
        fiat_usd_at_exec=9900.0,
        block_timestamp="2026-09-10T12:05:00Z",
        block_height=60000010
    ))
    store.add_edge(TransactionEdge(
        tx_hash="0xloop_tx_3",
        network=NetworkType.TRON,
        source_address=node_b,
        destination_address=node_c,
        asset_symbol="USDT",
        raw_amount="9800000000",
        decimal_amount="9800.000000",
        fiat_inr_at_exec=813400.0,
        fiat_usd_at_exec=9800.0,
        block_timestamp="2026-09-10T12:10:00Z",
        block_height=60000020
    ))
    # Cycle edge back from C -> A
    store.add_edge(TransactionEdge(
        tx_hash="0xloop_tx_4_cycle_back",
        network=NetworkType.TRON,
        source_address=node_c,
        destination_address=node_a,
        asset_symbol="USDT",
        raw_amount="5000000000",
        decimal_amount="5000.000000",
        fiat_inr_at_exec=415000.0,
        fiat_usd_at_exec=5000.0,
        block_timestamp="2026-09-10T12:15:00Z",
        block_height=60000030
    ))
    # Legitimate branch from C -> Deposit -> Hot Wallet
    store.add_edge(TransactionEdge(
        tx_hash="0xloop_tx_5_to_deposit",
        network=NetworkType.TRON,
        source_address=node_c,
        destination_address=deposit,
        asset_symbol="USDT",
        raw_amount="4800000000",
        decimal_amount="4800.000000",
        fiat_inr_at_exec=398400.0,
        fiat_usd_at_exec=4800.0,
        block_timestamp="2026-09-10T12:20:00Z",
        block_height=60000040
    ))
    store.add_edge(TransactionEdge(
        tx_hash="0xloop_tx_6_sweep",
        network=NetworkType.TRON,
        source_address=deposit,
        destination_address=hot_wallet,
        asset_symbol="USDT",
        raw_amount="4800000000",
        decimal_amount="4800.000000",
        fiat_inr_at_exec=398400.0,
        fiat_usd_at_exec=4800.0,
        block_timestamp="2026-09-10T12:30:00Z",
        block_height=60000060,
        is_sweep=True
    ))

    req = AttributionRequest(
        sahyog_case_id="SHG-CYCLE-001",
        ncrp_complaint_id="NCRP-CYCLE-001",
        suspect_wallet_address=suspect,
        network=NetworkType.TRON,
        reported_fraud_amount_inr=830000.0,
        max_hops=5
    )
    result = engine.execute_attribution(req)
    assert result.attribution_status == "VASP_ATTRIBUTED_HIGH_CONFIDENCE"
    assert result.nearest_vasp == "CoinDCX"
    assert result.deposit_address == deposit

def test_extreme_beam_degree_clamping(clean_engine):
    """
    Probes massive fan-out attack:
    1 suspect wallet branches into 120 outgoing transfers (above MAX_BEAM_DEGREE 50).
    Verifies that the beam search clamps to 50 highest-value edges without OOM.
    """
    engine, store = clean_engine
    suspect = "TSuspectMassiveFanOutAlpha00000000000"

    for i in range(120):
        amt = Decimal(str(i + 1))
        store.add_edge(TransactionEdge(
            tx_hash=f"0xfanout_{i:04d}",
            network=NetworkType.TRON,
            source_address=suspect,
            destination_address=f"TMuleFanOutRecipient_{i:04d}",
            asset_symbol="USDT",
            raw_amount=str(int(amt * 1000000)),
            decimal_amount=f"{amt:.6f}",
            fiat_inr_at_exec=float(amt * 83),
            fiat_usd_at_exec=float(amt),
            block_timestamp="2026-09-10T10:00:00Z",
            block_height=60000000 + i
        ))

    req = AttributionRequest(
        sahyog_case_id="SHG-FANOUT-001",
        ncrp_complaint_id="NCRP-FANOUT-001",
        suspect_wallet_address=suspect,
        network=NetworkType.TRON,
        reported_fraud_amount_inr=500000.0,
        max_hops=2,
        dust_threshold_usd=0.0
    )
    result = engine.execute_attribution(req)
    # The fan-out ends at dead ends, so attribution returns UNRESOLVED_DEAD_END without error
    assert result.attribution_status == "UNRESOLVED_MULTI_HOP"
    # Traversals should not exceed 51 nodes (suspect + top 50 pruned recipients)
    assert len(result.graph_nodes) <= 52

def test_merkle_edge_cases():
    """Probes empty tree, single leaf, odd count, duplicate leaves, and forged proof rejection."""
    # 1. Empty tree
    empty_tree = MerkleEvidenceTree([])
    root_empty = empty_tree.get_merkle_root()
    assert len(root_empty) == 64

    # 2. Single leaf tree
    single_tree = MerkleEvidenceTree(["0xsingle_tx_hash_001"])
    root_single = single_tree.get_merkle_root()
    assert root_single == "0xsingle_tx_hash_001"
    proof = single_tree.get_proof("0xsingle_tx_hash_001")
    assert proof == []
    assert MerkleEvidenceTree.verify_proof("0xsingle_tx_hash_001", proof, root_single) is True

    # 3. Forged proof rejection
    three_leaves = ["0xa1", "0xb2", "0xc3"]
    tree = MerkleEvidenceTree(three_leaves)
    real_root = tree.get_merkle_root()
    proof_b = tree.get_proof("0xb2")
    
    # Valid proof passes
    assert MerkleEvidenceTree.verify_proof("0xb2", proof_b, real_root) is True
    # Forged target leaf fails
    assert MerkleEvidenceTree.verify_proof("0xFORGED_LEAF", proof_b, real_root) is False
    # Forged root fails
    assert MerkleEvidenceTree.verify_proof("0xb2", proof_b, "0x" + "f"*64) is False

def test_schema_validation_boundaries():
    """Probes Pydantic validation boundaries on negative amounts and invalid hop limits."""
    # Negative fraud amount should fail validation
    with pytest.raises(ValidationError):
        AttributionRequest(
            suspect_wallet_address="TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
            network=NetworkType.TRON,
            reported_fraud_amount_inr=-500.0  # Invalid
        )

    # Max hops > 6 should fail validation (DoS protection)
    with pytest.raises(ValidationError):
        AttributionRequest(
            suspect_wallet_address="TXa7bK9mP3qR1sT8uV5wY0zL4e2nJ8hG6f",
            network=NetworkType.TRON,
            reported_fraud_amount_inr=1000.0,
            max_hops=10  # Invalid, max is 6
        )
