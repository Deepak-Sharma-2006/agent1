import type { FullCaseDossier } from "../types";

export const FALLBACK_CASE: FullCaseDossier = {
  case_metadata: {
    case_id: "NTRO-CR-2026-0918-B82C",
    operation_codename: "OPERATION MAYAJAAL",
    security_classification: "CONFIDENTIAL // NTRO-TECHINT // FOR OFFICIAL USE ONLY",
    initiating_agency: "National Technical Research Organisation (NTRO)",
    lead_division: "Cyber Intelligence & Technology Centre (CITC)",
    statutory_authority: "Section 69 & Section 70A, Information Technology Act, 2000",
    case_opened_timestamp: "2026-09-14T09:30:00+05:30",
    last_updated_timestamp: "2026-09-18T18:00:00+05:30",
    target_sector: "Critical Information Infrastructure - Healthcare (Bharat Health Systems MedNet)",
    threat_category: "Ransomware Extortion & High-Volume PII Data Brokerage",
    financial_impact_inr: "₹3,82,80,000 INR (3.82 Crore INR)",
    crypto_demands: [
      { asset: "BTC", amount: 5.5, inr_equivalent: "₹3,41,00,000" },
      { asset: "TRC-20 USDT", amount: 50000, inr_equivalent: "₹41,80,000" }
    ]
  },
  attributed_subject: {
    subject_id: "SUB-IN-2026-8812",
    legal_name: "Rohan Sharma",
    alias: "CyberShadow",
    citizenship: "Indian",
    age: 28,
    current_residence: "Flat 402, Green Glen Layout, Indiranagar, Bengaluru, Karnataka, 560038",
    technical_sophistication: "Advanced / Expert",
    operational_status: "IDENTIFIED - READY FOR SECTION 94 BNSS REQUISITION",
    confidence_rating: "HIGH CONFIDENCE (95.0%)",
    confidence_score: 0.95,
    confidence_tier: "DETERMINISTIC_PROOF"
  },
  threat_personas: [
    {
      handle: "Vikramaditya0x",
      platform: "Dread Darknet Forum",
      first_seen: "2024-03-12T14:22:00Z",
      last_seen: "2026-09-17T19:40:00Z",
      posts_analyzed: 32,
      reputation_score: "+88 (Trusted Broker)",
      claimed_identity: "East-European Exfiltration Affiliate",
      actual_language_dialect: "Hinglish / Romanized Hindi with Bengaluru tech slang"
    },
    {
      handle: "Chanakya_Zero",
      platform: "Exploit.in Underground Forum",
      first_seen: "2024-08-05T11:15:00Z",
      last_seen: "2026-09-16T22:10:00Z",
      posts_analyzed: 13,
      reputation_score: "+34 (Exploit Developer)",
      claimed_identity: "Autonomous Vulnerability Researcher",
      actual_language_dialect: "Technical English + Hinglish operational fragments"
    }
  ],
  pgp_key: {
    key_type: "RSA-4096",
    fingerprint: "9A4F3B218C7E45D012FA6789B0C12345D6789ABC",
    fingerprint_formatted: "9A4F 3B21 8C7E 45D0 12FA  6789 B0C1 2345 D678 9ABC",
    user_id: "cryptoshadow_in@proton.me",
    subkeys: [
      { id: "8F3A29B1", type: "Signing (RSA-4096)", status: "Active" },
      { id: "4C7E12FA", type: "Encryption (RSA-4096)", status: "Active" }
    ],
    published_on: [
      "Dread profile: Vikramaditya0x",
      "Exploit.in signature: Chanakya_Zero",
      "keys.openpgp.org public keyserver"
    ],
    linkage_confidence: 1.0
  },
  infrastructure: {
    hidden_service: "bharatleaks742wqpovbnm34xzvkw90a1bcdefghijk.onion",
    onion_version: "v3 (Ed25519 56-char)",
    title: "Bharat Health Systems MedNet - Database Vault & Escrow Auction",
    exposed_endpoints: [
      {
        endpoint: "/server-status",
        probe_result: "VULNERABLE (mod_status exposed)",
        leaked_origin_ip: "103.152.18.42",
        server_banner: "Apache/2.4.52 (Ubuntu) mod_status/2.0"
      },
      {
        endpoint: "/favicon.ico",
        murmurhash3: 1482956102,
        shodan_query: "http.favicon.hash:1482956102",
        clearnet_mirrors: ["103.152.18.42:8443", "api.bharatleaks-staging.in"]
      },
      {
        endpoint: "port 443 (TLS)",
        ssl_san_domains: ["api.bharatleaks-staging.in", "cdn.bharatleaks-staging.in"],
        issuer: "Let's Encrypt Authority X3"
      }
    ],
    resolved_origin: {
      ip: "103.152.18.42",
      asn: "AS132597",
      isp: "NetWeb Technologies India Ltd",
      datacenter_location: "Navi Mumbai Data Centre, Maharashtra, India",
      flag: "PHYSICAL_ORIGIN_CONFIRMED"
    }
  },
  financial_flows: {
    bitcoin: {
      suspect_intake_address: "bc1q9xdesi842m09kvlztr498a12c45e67f89a012",
      ransom_received: "5.5 BTC (₹3,41,00,000 INR)",
      common_input_spend_tx: "a4f8e791b02c45d6e8f12a345b678c90123456789abcdef0123456789abcdef0",
      co_spent_cluster_addresses: [
        "bc1q9xdesi842m09kvlztr498a12c45e67f89a012",
        "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy"
      ],
      destination_vasp: "CoinDCX Exchange (India)",
      vasp_deposit_address: "1P5ZEDWTKTFGxQjZnvn9t7H8m5xZ2Zg6a",
      fiu_registered: true,
      kyc_entity: "Rohan Sharma (Aadhaar/PAN verified)"
    },
    tron_usdt: {
      suspect_intake_address: "TXdesi9942aLKQmvxZb84920KMnQWERTY1",
      contract_address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      usdt_received: "50,000 TRC-20 USDT (₹41,80,000 INR)",
      sweep_tx: "f8a02c4189be2d7a5b3c1092847561a093847561029384756102938475610293",
      destination_vasp: "CoinDCX / WazirX Sweep Vault (TRX)",
      vasp_deposit_address: "TDdesi9821aKZXcvbN90124LKJQWERTY9",
      kyc_entity: "Rohan Sharma (Matches PAN records)"
    }
  },
  stylometric_analysis: {
    model_used: "IndicBERT + XLM-RoBERTa (Fine-Tuned on South Asian Darknet Corpora)",
    embedding_dimension: 1024,
    similarity_cosine: 0.864,
    sentence_burstiness: 9.42,
    perplexity_distilgpt2: 38.6,
    adversarial_ai_flag: false,
    linguistic_markers: [
      "Hinglish code-mixing: 'bhai payment verify kar do jaldi'",
      "South Indian tech English: 'revert back on session', 'doubt clearance'",
      "Distinct punctuation pattern: repeated ellipses followed by lowercase starts ('... aur fir')"
    ],
    diurnal_analysis: {
      sleep_inactivity_trough_utc: "18:30 - 01:30 UTC",
      projected_sleep_trough_ist: "00:00 - 07:00 IST (Indian Standard Time)",
      timezone_offset_hours: 5.5,
      confidence_boost: "+0.15 Corroboration"
    }
  },
  attribution_signals: [
    {
      signal_name: "PGP Master Key Exact Fingerprint Match",
      tier: "Deterministic",
      weight: 1.0,
      score: 1.0,
      rationale: "Exact 40-character SHA-1 fingerprint 9A4F3B21... shared across Dread and Exploit.in."
    },
    {
      signal_name: "Common-Input Bitcoin Co-Spend Trace to Indian VASP",
      tier: "Deterministic",
      weight: 1.00,
      score: 0.98,
      rationale: "Transaction a4f8e... merges suspect extortion wallet with CoinDCX deposit address linked to Rohan Sharma."
    },
    {
      signal_name: "Apache mod_status Physical Origin IP Leak",
      tier: "Deterministic",
      weight: 0.95,
      score: 0.95,
      rationale: "Exposed /server-status on .onion service returned active clearnet IP 103.152.18.42 (Navi Mumbai Data Centre)."
    },
    {
      signal_name: "Verified Clearnet Email in PGP UID",
      tier: "Deterministic",
      weight: 0.90,
      score: 0.95,
      rationale: "PGP key UID contains cryptoshadow_in@proton.me, linked to GitHub commits by Rohan Sharma."
    },
    {
      signal_name: "Favicon MurmurHash3 & SSL SAN Match",
      tier: "Corroborative",
      weight: 0.50,
      score: 0.87,
      rationale: "Favicon MMH3 hash 1482956102 and SSL SAN api.bharatleaks-staging.in point directly to 103.152.18.42."
    },
    {
      signal_name: "IndicBERT Multilingual Stylometry",
      tier: "Probabilistic (Capped)",
      weight: 0.3,
      score: 0.864,
      rationale: "Hinglish writing style matches Bengaluru hacker corpus with cosine 0.864 (Hard capped at 0.65)."
    },
    {
      signal_name: "Diurnal Inactivity Trough (IST Sleep Cycle)",
      tier: "Probabilistic",
      weight: 0.15,
      score: 0.85,
      rationale: "Sleep trough 18:30-01:30 UTC aligns with 00:00-07:00 IST (+/- 30 min tolerance)."
    }
  ],
  graph_nodes: [
    { id: "actor-rohan", label: "Threat Actor: Rohan Sharma", type: "ThreatActor", category: "primary", confidence: 95.0 },
    { id: "handle-vikramaditya", label: "Handle: Vikramaditya0x (Dread)", type: "ForumHandle", category: "persona" },
    { id: "handle-chanakya", label: "Handle: Chanakya_Zero (Exploit)", type: "ForumHandle", category: "persona" },
    { id: "pgp-cryptoshadow", label: "PGP: 9A4F3B21... (RSA-4096)", type: "PGPKey", category: "crypto_id" },
    { id: "email-cryptoshadow", label: "Email: cryptoshadow_in@proton.me", type: "EmailAddress", category: "osint" },
    { id: "onion-bharatleaks", label: "Hidden Service: bharatleaks...onion", type: "OnionService", category: "infra" },
    { id: "server-origin-mumbai", label: "Origin IP: 103.152.18.42 (Navi Mumbai)", type: "OriginServer", category: "infra" },
    { id: "domain-clearnet", label: "Clearnet: api.bharatleaks-staging.in", type: "ClearnetDomain", category: "infra" },
    { id: "wallet-btc-intake", label: "BTC: bc1q9xdesi842... (5.5 BTC)", type: "CryptoWallet", category: "financial" },
    { id: "wallet-btc-unhosted", label: "Intermediate BTC: 3J98t1WpEZ...", type: "CryptoWallet", category: "financial" },
    { id: "wallet-tron-intake", label: "TRC-20: TXdesi9942a... (50k USDT)", type: "CryptoWallet", category: "financial" },
    { id: "vasp-coindcx-btc", label: "VASP Deposit: CoinDCX (BTC)", type: "VASPAccount", category: "financial" },
    { id: "vasp-coindcx-tron", label: "VASP Deposit: CoinDCX (TRX)", type: "VASPAccount", category: "financial" },
    { id: "identity-residence", label: "Residence: Indiranagar, Bengaluru", type: "PhysicalLocation", category: "osint" }
  ],
  graph_edges: [
    { source: "actor-rohan", target: "handle-vikramaditya", label: "OPERATES_PERSONA", weight: 1.0 },
    { source: "actor-rohan", target: "handle-chanakya", label: "OPERATES_PERSONA", weight: 1.0 },
    { source: "handle-vikramaditya", target: "pgp-cryptoshadow", label: "POSTED_PUBLIC_KEY", weight: 1.0 },
    { source: "handle-chanakya", target: "pgp-cryptoshadow", label: "POSTED_PUBLIC_KEY", weight: 1.0 },
    { source: "pgp-cryptoshadow", target: "email-cryptoshadow", label: "BINDS_USER_ID", weight: 1.0 },
    { source: "actor-rohan", target: "onion-bharatleaks", label: "CONTROLS_HIDDEN_SERVICE", weight: 0.95 },
    { source: "onion-bharatleaks", target: "server-origin-mumbai", label: "EXPOSED_VIA_MOD_STATUS", weight: 0.9 },
    { source: "onion-bharatleaks", target: "domain-clearnet", label: "SHARED_SSL_SAN", weight: 0.85 },
    { source: "domain-clearnet", target: "server-origin-mumbai", label: "DNS_A_RECORD", weight: 0.95 },
    { source: "onion-bharatleaks", target: "wallet-btc-intake", label: "LISTS_PAYMENT_WALLET", weight: 1.0 },
    { source: "onion-bharatleaks", target: "wallet-tron-intake", label: "LISTS_PAYMENT_WALLET", weight: 1.0 },
    { source: "wallet-btc-intake", target: "wallet-btc-unhosted", label: "CO_SPENT_MICH_TX", weight: 0.95 },
    { source: "wallet-btc-unhosted", target: "vasp-coindcx-btc", label: "SWEEPS_FUNDS_TO_VASP", weight: 0.95 },
    { source: "wallet-tron-intake", target: "vasp-coindcx-tron", label: "TRC20_SMART_CONTRACT_SWEEP", weight: 0.95 },
    { source: "vasp-coindcx-btc", target: "actor-rohan", label: "KYC_VERIFIED_OWNER", weight: 1.0 },
    { source: "actor-rohan", target: "identity-residence", label: "LOCATED_AT", weight: 0.9 }
  ],
  forensic_merkle_tree: {
    merkle_root_sha256: "8f2d8a4c0e6b1297e5fa921c8901b44356e1892d3f789a12c876e543b21a9870",
    leaf_hashes: [
      { leaf: "raw_tor_ingestion_frame_001", sha256: "4a7d1ed414474e4033ac29ccb8653d9b" },
      { leaf: "apache_mod_status_response", sha256: "e3b0c44298fc1c149afbf4c8996fb924" },
      { leaf: "pgp_public_key_asc", sha256: "d7a8fbb307d7809469ca9abcb0082e4f" },
      { leaf: "bitcoin_tx_a4f8e_raw_hex", sha256: "b5d4045c3f466fa91fe2cc6abe79232a" },
      { leaf: "tron_event_log_0xa9059cbb", sha256: "c8f12a345b678c90123456789abcdef0" }
    ],
    signing_key_id: "NTRO-ED25519-HSM-LEAF-04",
    fips_compliance: "FIPS 140-3 Level 3 Hardware Security Module",
    rfc3161_timestamp_tsa: "2026-09-18T18:02:26.140Z (NPL National Physical Laboratory New Delhi Synchronized)"
  }
};
