"""
Project BHEDAK - Core Domain Models & Schemas
Production-grade Pydantic v2 schemas for Threat Actor Attribution,
Graph Representation, Ingestion Payloads, and Statutory Exports.
"""

from typing import List, Dict, Optional, Literal
from pydantic import BaseModel, Field


class CryptoDemand(BaseModel):
    asset: str
    amount: float
    inr_equivalent: str


class CaseMetadata(BaseModel):
    case_id: str
    operation_codename: str
    security_classification: str
    initiating_agency: str
    lead_division: str
    statutory_authority: str
    case_opened_timestamp: str
    last_updated_timestamp: str
    target_sector: str
    threat_category: str
    financial_impact_inr: str
    crypto_demands: List[CryptoDemand]


class AttributedSubject(BaseModel):
    subject_id: str
    legal_name: str
    alias: str
    citizenship: str
    age: int
    current_residence: str
    technical_sophistication: str
    operational_status: str
    confidence_rating: str
    confidence_score: float = Field(ge=0.0, le=1.0)
    confidence_tier: Literal["DETERMINISTIC_PROOF", "PROBABILISTIC_LEAD", "UNRELIABLE"]


class ThreatPersona(BaseModel):
    handle: str
    platform: str
    first_seen: str
    last_seen: str
    posts_analyzed: int
    reputation_score: str
    claimed_identity: str
    actual_language_dialect: str


class PGPSubkey(BaseModel):
    id: str
    type: str
    status: str


class PGPKeyInfo(BaseModel):
    key_type: str
    fingerprint: str
    fingerprint_formatted: str
    user_id: str
    subkeys: List[PGPSubkey]
    published_on: List[str]
    linkage_confidence: float


class ExposedEndpoint(BaseModel):
    endpoint: str
    probe_result: Optional[str] = None
    leaked_origin_ip: Optional[str] = None
    server_banner: Optional[str] = None
    murmurhash3: Optional[int] = None
    shodan_query: Optional[str] = None
    clearnet_mirrors: Optional[List[str]] = None
    ssl_san_domains: Optional[List[str]] = None
    issuer: Optional[str] = None


class ResolvedOrigin(BaseModel):
    ip: str
    asn: str
    isp: str
    datacenter_location: str
    flag: Literal["PHYSICAL_ORIGIN_CONFIRMED", "EDGE_PROXY", "UNRESOLVED"]


class InfrastructureInfo(BaseModel):
    hidden_service: str
    onion_version: str
    title: str
    exposed_endpoints: List[ExposedEndpoint]
    resolved_origin: ResolvedOrigin


class BitcoinFlow(BaseModel):
    suspect_intake_address: str
    ransom_received: str
    common_input_spend_tx: str
    co_spent_cluster_addresses: List[str]
    destination_vasp: str
    vasp_deposit_address: str
    fiu_registered: bool
    kyc_entity: str


class TronUSDTFlow(BaseModel):
    suspect_intake_address: str
    contract_address: str
    usdt_received: str
    sweep_tx: str
    destination_vasp: str
    vasp_deposit_address: str
    kyc_entity: str


class FinancialFlows(BaseModel):
    bitcoin: BitcoinFlow
    tron_usdt: TronUSDTFlow


class DiurnalAnalysis(BaseModel):
    sleep_inactivity_trough_utc: str
    projected_sleep_trough_ist: str
    timezone_offset_hours: float
    confidence_boost: str


class StylometricAnalysis(BaseModel):
    model_used: str
    embedding_dimension: int
    similarity_cosine: float
    sentence_burstiness: float
    perplexity_distilgpt2: float
    adversarial_ai_flag: bool
    linguistic_markers: List[str]
    diurnal_analysis: DiurnalAnalysis


class AttributionSignal(BaseModel):
    signal_name: str
    tier: str
    weight: float
    score: float
    rationale: str


class EvaluateScoreRequest(BaseModel):
    signals: List[AttributionSignal] = Field(default_factory=list)


class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    category: str
    confidence: Optional[float] = None


class GraphEdge(BaseModel):
    source: str
    target: str
    label: str
    weight: float


class MerkleLeaf(BaseModel):
    leaf: str
    sha256: str


class ForensicMerkleTree(BaseModel):
    merkle_root_sha256: str
    leaf_hashes: List[MerkleLeaf]
    signing_key_id: str
    fips_compliance: str
    rfc3161_timestamp_tsa: str


class FullCaseDossier(BaseModel):
    case_metadata: CaseMetadata
    attributed_subject: AttributedSubject
    threat_personas: List[ThreatPersona]
    pgp_key: PGPKeyInfo
    infrastructure: InfrastructureInfo
    financial_flows: FinancialFlows
    stylometric_analysis: StylometricAnalysis
    attribution_signals: List[AttributionSignal]
    graph_nodes: List[GraphNode]
    graph_edges: List[GraphEdge]
    forensic_merkle_tree: ForensicMerkleTree


# Request / Response Schemas for API Endpoints
class ScanOnionRequest(BaseModel):
    onion_address: str


class ScanOnionResponse(BaseModel):
    onion_address: str
    status: str
    mod_status_ip_leak: Optional[str] = None
    favicon_mmh3: Optional[int] = None
    ssl_san_domains: List[str] = []
    server_banner: Optional[str] = None
    resolved_origin: Optional[ResolvedOrigin] = None
    execution_time_ms: float


class StylometryRequest(BaseModel):
    sample_text: str
    target_persona_id: Optional[str] = "rohan_desilocker"


class StylometryResponse(BaseModel):
    sample_length_chars: int
    indicbert_cosine_similarity: float
    sentence_burstiness: float
    perplexity_score: float
    is_adversarially_sanitized: bool
    inferred_dialect: str
    linguistic_markers: List[str] = []
    matched_suspect_corpus: str
    attribution_tier: str
