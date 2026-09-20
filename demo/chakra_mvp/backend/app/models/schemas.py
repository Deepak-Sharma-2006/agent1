"""
Project CHAKRA: Strict Pydantic v2 Data Contracts
Canonical schemas for multi-chain graph traversal, VASP attribution, and SAHYOG interoperability.
"""

from decimal import Decimal
from enum import Enum
from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field, EmailStr

class NetworkType(str, Enum):
    BTC = "BTC"
    ETH = "ETH"
    TRON = "TRON"
    BSC = "BSC"
    SOL = "SOL"
    POL = "POL"

class NodeType(str, Enum):
    SUSPECT_WALLET = "SUSPECT_WALLET"
    INTERMEDIARY_UNHOSTED = "INTERMEDIARY_UNHOSTED"
    CANDIDATE_DEPOSIT = "CANDIDATE_DEPOSIT"
    VASP_HOT_WALLET = "VASP_HOT_WALLET"
    MIXER_CONTRACT = "MIXER_CONTRACT"
    BRIDGE_CONTRACT = "BRIDGE_CONTRACT"

class TransactionEdge(BaseModel):
    tx_hash: str
    network: NetworkType
    source_address: str
    destination_address: str
    asset_symbol: str
    raw_amount: str
    decimal_amount: str          # String Decimal - fixed point (no floats)
    fiat_inr_at_exec: float
    fiat_usd_at_exec: float
    block_timestamp: str         # ISO 8601 UTC
    block_height: int
    is_sweep: bool = False
    gas_payer: Optional[str] = None
    tx_type: str = "TOKEN_TRANSFER"

class GraphNode(BaseModel):
    id: str                      # Address
    label: str                   # Human readable display
    network: NetworkType
    node_type: NodeType
    cluster_entity: Optional[str] = None
    balance_crypto: Optional[str] = "0.0"
    is_hot_wallet: bool = False
    hop_level: int = 0

class SweepProof(BaseModel):
    is_sweep_confirmed: bool
    candidate_deposit_address: str
    vasp_name: str
    fiu_ind_registration: str
    operational_hot_wallet: str
    deposit_tx_hash: str
    sweep_tx_hash: str
    deposit_amount: str
    swept_amount: str
    sweep_ratio: float
    latency_minutes: float
    gas_sponsored_by_vasp: bool
    gas_sponsor_address: Optional[str] = None

class ScorePillarBreakdown(BaseModel):
    infrastructure_match_score: float  # Max 40
    sweep_consistency_score: float     # Max 25
    proximity_decay_score: float       # Max 20
    volume_continuity_score: float     # Max 15
    risk_penalty_deduction: float      # Penalty deduction
    final_confidence_score: float      # 0 to 100

class AttributionRequest(BaseModel):
    sahyog_case_id: str = Field(default="SHG-2026-DEL-98412")
    ncrp_complaint_id: str = Field(default="2026-NCRP-339182")
    suspect_wallet_address: str
    network: NetworkType
    incident_timestamp: Optional[str] = None
    reported_fraud_amount_inr: float = Field(default=4500000.0, gt=0)
    max_hops: int = Field(default=5, ge=1, le=6)
    dust_threshold_usd: float = Field(default=10.0, ge=0.0)

class CustomGraphInjectionRequest(BaseModel):
    """Allows Jury / Evaluator to dynamically inject arbitrary transactions to stress test the engine."""
    suspect_wallet_address: str
    network: NetworkType
    edges: List[TransactionEdge]

class AttributionResponse(BaseModel):
    sahyog_case_id: str
    ncrp_complaint_id: str
    suspect_wallet: str
    network: NetworkType
    attribution_status: str            # VASP_ATTRIBUTED_HIGH_CONFIDENCE, etc.
    confidence_score: float            # 0 to 100
    confidence_tier: str               # Tier 1 (High), Tier 2 (Medium), Tier 3 (Review)
    nearest_vasp: Optional[str]
    fiu_ind_reg_number: Optional[str]
    compliance_email: Optional[str]
    deposit_address: Optional[str]
    hot_wallet_address: Optional[str]
    hop_distance: int
    traced_amount_crypto: str
    asset_symbol: str
    fiat_value_inr: float
    merkle_evidence_root: str
    sweep_proof: Optional[SweepProof]
    score_breakdown: ScorePillarBreakdown
    graph_nodes: List[GraphNode]
    graph_edges: List[TransactionEdge]
    processing_time_ms: float
