/**
 * Project BHEDAK - Frontend TypeScript Domain Interfaces
 * Strictly mirrors backend Pydantic v2 schemas for end-to-end type safety.
 */


export interface CryptoDemand {
  asset: string;
  amount: number;
  inr_equivalent: string;
}

export interface CaseMetadata {
  case_id: string;
  operation_codename: string;
  security_classification: string;
  initiating_agency: string;
  lead_division: string;
  statutory_authority: string;
  case_opened_timestamp: string;
  last_updated_timestamp: string;
  target_sector: string;
  threat_category: string;
  financial_impact_inr: string;
  crypto_demands: CryptoDemand[];
}

export interface AttributedSubject {
  subject_id: string;
  legal_name: string;
  alias: string;
  citizenship: string;
  age: number;
  current_residence: string;
  technical_sophistication: string;
  operational_status: string;
  confidence_rating: string;
  confidence_score: number;
  confidence_tier: "DETERMINISTIC_PROOF" | "PROBABILISTIC_LEAD" | "UNRELIABLE";
}

export interface ThreatPersona {
  handle: string;
  platform: string;
  first_seen: string;
  last_seen: string;
  posts_analyzed: number;
  reputation_score: string;
  claimed_identity: string;
  actual_language_dialect: string;
}

export interface PGPSubkey {
  id: string;
  type: string;
  status: string;
}

export interface PGPKeyInfo {
  key_type: string;
  fingerprint: string;
  fingerprint_formatted: string;
  user_id: string;
  subkeys: PGPSubkey[];
  published_on: string[];
  linkage_confidence: number;
}

export interface ExposedEndpoint {
  endpoint: string;
  probe_result?: string;
  leaked_origin_ip?: string;
  server_banner?: string;
  murmurhash3?: number;
  shodan_query?: string;
  clearnet_mirrors?: string[];
  ssl_san_domains?: string[];
  issuer?: string;
}

export interface ResolvedOrigin {
  ip: string;
  asn: string;
  isp: string;
  datacenter_location: string;
  flag: "PHYSICAL_ORIGIN_CONFIRMED" | "EDGE_PROXY" | "UNRESOLVED";
}

export interface InfrastructureInfo {
  hidden_service: string;
  onion_version: string;
  title: string;
  exposed_endpoints: ExposedEndpoint[];
  resolved_origin: ResolvedOrigin;
}

export interface BitcoinFlow {
  suspect_intake_address: string;
  ransom_received: string;
  common_input_spend_tx: string;
  co_spent_cluster_addresses: string[];
  destination_vasp: string;
  vasp_deposit_address: string;
  fiu_registered: boolean;
  kyc_entity: string;
}

export interface TronUSDTFlow {
  suspect_intake_address: string;
  contract_address: string;
  usdt_received: string;
  sweep_tx: string;
  destination_vasp: string;
  vasp_deposit_address: string;
  kyc_entity: string;
}

export interface FinancialFlows {
  bitcoin: BitcoinFlow;
  tron_usdt: TronUSDTFlow;
}

export interface DiurnalAnalysis {
  sleep_inactivity_trough_utc: string;
  projected_sleep_trough_ist: string;
  timezone_offset_hours: number;
  confidence_boost: string;
}

export interface StylometricAnalysis {
  model_used: string;
  embedding_dimension: number;
  similarity_cosine: number;
  sentence_burstiness: number;
  perplexity_distilgpt2: number;
  adversarial_ai_flag: boolean;
  linguistic_markers: string[];
  diurnal_analysis: DiurnalAnalysis;
}

export interface AttributionSignal {
  signal_name: string;
  tier: string;
  weight: number;
  score: number;
  rationale: string;
}

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  category: string;
  confidence?: number;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  weight: number;
}

export interface MerkleLeaf {
  leaf: string;
  sha256: string;
}

export interface ForensicMerkleTree {
  merkle_root_sha256: string;
  leaf_hashes: MerkleLeaf[];
  signing_key_id: string;
  fips_compliance: string;
  rfc3161_timestamp_tsa: string;
}

export interface FullCaseDossier {
  case_metadata: CaseMetadata;
  attributed_subject: AttributedSubject;
  threat_personas: ThreatPersona[];
  pgp_key: PGPKeyInfo;
  infrastructure: InfrastructureInfo;
  financial_flows: FinancialFlows;
  stylometric_analysis: StylometricAnalysis;
  attribution_signals: AttributionSignal[];
  graph_nodes: GraphNode[];
  graph_edges: GraphEdge[];
  forensic_merkle_tree: ForensicMerkleTree;
}

export interface ScanOnionResponse {
  onion_address: string;
  status: string;
  mod_status_ip_leak?: string | null;
  favicon_mmh3?: number | null;
  ssl_san_domains: string[];
  server_banner?: string | null;
  resolved_origin?: ResolvedOrigin | null;
  execution_time_ms: number;
}

export interface StylometryResponse {
  sample_length_chars: number;
  indicbert_cosine_similarity: number;
  sentence_burstiness: number;
  perplexity_score: number;
  is_adversarially_sanitized: boolean;
  inferred_dialect: string;
  linguistic_markers: string[];
  matched_suspect_corpus: string;
  attribution_tier: string;
}

export interface BSA63Certificate {
  statutory_framework: string;
  certificate_id: string;
  generated_at_utc: string;
  time_source: string;
  part_a_custodian: {
    statutory_clause: string;
    certifier_name: string;
    designation: string;
    organization: string;
    lawful_custody_affirmation: string;
    system_operational_integrity: string;
  };
  part_b_examiner: {
    statutory_clause: string;
    certifier_name: string;
    designation: string;
    organization: string;
    device_identification: string;
    cryptographic_hash_standard: string;
    merkle_root_computed: string;
    total_evidence_leaves_sealed: number;
    signature_algorithm: string;
    signing_key_identifier: string;
    hsm_hardware_certification: string;
    digital_signature_hex: string;
    time_source_synchronization: string;
  };
  merkle_root_sha256: string;
  attestation: {
    fips_level: string;
    key_identifier: string;
    merkle_root_sha256: string;
    rfc3161_timestamp_utc: string;
    signature_algorithm: string;
    signature_hex: string;
  };
  evidence_inventory: Array<{
    item_index: number;
    evidence_type: string;
    target: string;
    sha256: string;
    forensic_significance: string;
  }>;
  certificate_plaintext: string;
}

export type ExaminerMode = "GUIDED_LINEAR" | "EXAMINER_OVERRIDE";

export interface InvestigationProgressState {
  step1_recon: boolean;
  step2_graph: boolean;
  step3_stylometry: boolean;
  step4_confidence: boolean;
  certified: boolean;
}

export interface ActiveInvestigationStore {
  examinerMode: ExaminerMode;
  progress: InvestigationProgressState;

  // Engine 1
  activeTargetOnion: string;
  engine1ScanResult: ScanOnionResponse | null;
  engine1ProbeLogs: string[];

  // Engine 2
  engine2Synthesized: boolean;
  engine2Traced: boolean;
  engine2ActiveHop: number | null;

  // Engine 3
  engine3SelectedSampleId: string;
  engine3InputText: string;
  engine3Result: StylometryResponse | null;

  // Engine 4
  engine4EnabledSignals: Record<string, boolean>;
  engine4EvaluatedScore: number;
  engine4ConfidenceTier: string;
  engine4HasDeterministic: boolean;
  engine4LatencyMs: number;
}

