/**
 * Project CHAKRA: Strict TypeScript Data Contracts
 * Mirrored 1:1 with Python Pydantic v2 schemas for end-to-end type safety.
 */

export type NetworkType = "BTC" | "ETH" | "TRON" | "BSC" | "SOL" | "POL";

export type NodeType =
  | "SUSPECT_WALLET"
  | "INTERMEDIARY_UNHOSTED"
  | "CANDIDATE_DEPOSIT"
  | "VASP_HOT_WALLET"
  | "MIXER_CONTRACT"
  | "BRIDGE_CONTRACT";

export interface TransactionEdge {
  tx_hash: string;
  network: NetworkType;
  source_address: string;
  destination_address: string;
  asset_symbol: string;
  raw_amount: string;
  decimal_amount: string;
  fiat_inr_at_exec: number;
  fiat_usd_at_exec: number;
  block_timestamp: string;
  block_height: number;
  is_sweep?: boolean;
  gas_payer?: string | null;
  tx_type?: string;
}

export interface GraphNode {
  id: string;
  label: string;
  network: NetworkType;
  node_type: NodeType;
  cluster_entity?: string | null;
  balance_crypto?: string | null;
  is_hot_wallet?: boolean;
  hop_level: number;
}

export interface SweepProof {
  is_sweep_confirmed: boolean;
  candidate_deposit_address: string;
  vasp_name: string;
  fiu_ind_registration: string;
  operational_hot_wallet: string;
  deposit_tx_hash: string;
  sweep_tx_hash: string;
  deposit_amount: string;
  swept_amount: string;
  sweep_ratio: number;
  latency_minutes: number;
  gas_sponsored_by_vasp: boolean;
  gas_sponsor_address?: string | null;
}

export interface ScorePillarBreakdown {
  infrastructure_match_score: number;
  sweep_consistency_score: number;
  proximity_decay_score: number;
  volume_continuity_score: number;
  risk_penalty_deduction: number;
  final_confidence_score: number;
}

export interface AttributionRequest {
  sahyog_case_id: string;
  ncrp_complaint_id: string;
  suspect_wallet_address: string;
  network: NetworkType;
  incident_timestamp?: string | null;
  reported_fraud_amount_inr: number;
  max_hops: number;
  dust_threshold_usd: number;
}

export interface CustomGraphInjectionRequest {
  suspect_wallet_address: string;
  network: NetworkType;
  edges: TransactionEdge[];
}

export interface AttributionResponse {
  sahyog_case_id: string;
  ncrp_complaint_id: string;
  suspect_wallet: string;
  network: NetworkType;
  attribution_status: string;
  confidence_score: number;
  confidence_tier: string;
  nearest_vasp: string | null;
  fiu_ind_reg_number: string | null;
  compliance_email: string | null;
  deposit_address: string | null;
  hot_wallet_address: string | null;
  hop_distance: number;
  traced_amount_crypto: string;
  asset_symbol: string;
  fiat_value_inr: number;
  merkle_evidence_root: string;
  sweep_proof: SweepProof | null;
  score_breakdown: ScorePillarBreakdown;
  graph_nodes: GraphNode[];
  graph_edges: TransactionEdge[];
  processing_time_ms: number;
}

export interface ScenarioMetadata {
  id: string;
  title: string;
  ncrp_id: string;
  fir_no: string;
  police_station: string;
  state_ut: string;
  victim_loss_inr: number;
  asset: string;
  network: NetworkType;
  suspect_wallet: string;
  summary: string;
}

export type UserRole =
  | "INVESTIGATING_OFFICER"
  | "SUPERVISORY_OFFICER"
  | "FORENSIC_EXAMINER"
  | "THREAT_ANALYST"
  | "VASP_NODAL_OFFICER";

export interface AuthUser {
  key: string;
  user_id: string;
  name: string;
  designation: string;
  station: string;
  state_ut: string;
  role: UserRole;
  has_dsc_token: boolean;
  gov_email?: string;
}

export interface SahyogNotice {
  notice_id: string;
  sahyog_case_id: string;
  ncrp_complaint_id: string;
  fir_number: string;
  issuing_officer: {
    name: string;
    designation: string;
    station: string;
    state_ut: string;
    gov_email: string;
  };
  target_vasp: {
    name: string;
    fiu_ind_registration: string;
    compliance_email: string;
  };
  target_deposit_address: string;
  hot_wallet_sweep_target: string;
  traced_amount: string;
  fiat_value_inr: number;
  confidence_score: number;
  statutory_mandates: string[];
  merkle_root: string;
  notice_sha256_digest: string;
  generated_at: string;
  status: string;
  dispatched_at?: string;
  sahyog_transmission?: {
    transmission_channel: string;
    tls_version: string;
    vasp_ticket_id: string;
    vasp_acknowledgment_status: string;
    statutory_24hr_freeze_active: boolean;
    compliance_window_expires: string;
    sanction_notes?: string;
  };
}

export interface MerkleVerificationResult {
  target_leaf_hash: string;
  declared_merkle_root: string;
  recomputed_merkle_root: string;
  is_leaf_valid: boolean;
  root_match: boolean;
  proof_audit_steps: number;
}

export interface DispatchNoticeResult {
  message: string;
  notice_id: string;
  vasp_ticket_id: string;
  debit_freeze_active: boolean;
  notice_details: SahyogNotice;
}

export type ActiveTab =
  | "intake"
  | "graph"
  | "sweep"
  | "scoring"
  | "statutory";

export interface InvestigationProgressState {
  step1_intake: boolean;
  step2_graph: boolean;
  step3_sweep: boolean;
  step4_scoring: boolean;
  step5_statutory: boolean;
}

