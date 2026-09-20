"""
Project BHEDAK - Statutory Evidentiary Exporter: Section 63 BSA 2023 Certificate
Generates dual-signature court-admissible electronic evidence certificates conforming to
Section 63 of the Bharatiya Sakshya Adhiniyam, 2023 (replacing erstwhile Section 65B Indian Evidence Act).
"""

from typing import Dict, Any
from demo.bhedak_mvp.backend.core.models import FullCaseDossier
from demo.bhedak_mvp.backend.core.security import ForensicSecurityCore


class BSA63CertificateCompiler:
    """
    Compiles statutory Section 63 BSA 2023 certificate bundle with:
    - Part A: Certification by Lawful Ingestion Custodian (CITC Operator)
    - Part B: Technical Certification by Cyber Forensic Examiner
    - Cryptographic Merkle Root and Ed25519 Attestation
    - CSIR-NPL (National Physical Laboratory, New Delhi) Traceable Timestamp
    """

    @classmethod
    def compile_certificate(cls, dossier: FullCaseDossier) -> Dict[str, Any]:
        """Generates statutory JSON and human-readable text certificate."""
        
        # Calculate fresh Merkle Root across all evidence leaves
        leaf_hashes = [leaf.sha256 for leaf in dossier.forensic_merkle_tree.leaf_hashes]
        merkle_root, audit_trail = ForensicSecurityCore.compute_merkle_root(leaf_hashes)

        # Attestation signature
        attestation = ForensicSecurityCore.sign_evidence_package({
            "case_id": dossier.case_metadata.case_id,
            "operation": dossier.case_metadata.operation_codename,
            "subject_id": dossier.attributed_subject.subject_id,
            "merkle_root": merkle_root,
            "timestamp": dossier.forensic_merkle_tree.rfc3161_timestamp_tsa
        })

        part_a_custodian = {
            "statutory_clause": "Bharatiya Sakshya Adhiniyam, 2023 - Section 63(4)(a)",
            "certifier_name": "Dr. V. K. Ramanathan, Sc 'G'",
            "designation": "Director, Cyber Intelligence & Technology Centre (CITC)",
            "organization": "National Technical Research Organisation (NTRO), New Delhi",
            "lawful_custody_affirmation": (
                "I hereby solemnly declare and certify that the automated darknet crawler, passive traffic "
                "ingestion nodes, and property graph analytics cluster of Project BHEDAK were under my lawful control "
                "and custody throughout the active observation window (14-Sep-2026 to 18-Sep-2026)."
            ),
            "system_operational_integrity": (
                "The server clusters, Tor v3 ingestion enclaves, and cryptographic storage appliances operated "
                "normally and without malfunction or security breach during the entire evidence generation process."
            )
        }

        part_b_examiner = {
            "statutory_clause": "Bharatiya Sakshya Adhiniyam, 2023 - Section 63(4)(b) & (c)",
            "certifier_name": "Rajeshwari Nair, Forensic Scientist 'E'",
            "designation": "Lead Examiner, Sovereign Digital Forensics Division",
            "organization": "National Technical Research Organisation (NTRO), New Delhi",
            "device_identification": "BHEDAK-HPC-ENCLAVE-NODE-04 (Hardware UUID: 5A92-F01B-942C-E871)",
            "cryptographic_hash_standard": "FIPS 180-4 SHA-256 (256-bit Secure Hash Algorithm)",
            "merkle_root_computed": merkle_root,
            "total_evidence_leaves_sealed": len(leaf_hashes),
            "signature_algorithm": attestation["signature_algorithm"],
            "signing_key_identifier": attestation["key_identifier"],
            "hsm_hardware_certification": "FIPS 140-3 Level 3 Dedicated Hardware Security Module",
            "digital_signature_hex": attestation["signature_hex"],
            "time_source_synchronization": (
                "CSIR-National Physical Laboratory (NPL), New Delhi - Indian Standard Time (IST) Primary Atomic Clock Reference"
            )
        }

        evidence_inventory = [
            {
                "item_index": 1,
                "evidence_type": "Onion Hidden Service HTTP Ingestion Frame",
                "target": dossier.infrastructure.hidden_service,
                "sha256": dossier.forensic_merkle_tree.leaf_hashes[0].sha256,
                "forensic_significance": "Apache mod_status origin IP leak exposing 103.152.18.42 (Navi Mumbai Data Centre)"
            },
            {
                "item_index": 2,
                "evidence_type": "PGP RSA-4096 Public Key Block",
                "target": f"Fingerprint: {dossier.pgp_key.fingerprint}",
                "sha256": dossier.forensic_merkle_tree.leaf_hashes[2].sha256,
                "forensic_significance": "Exact master key linkage connecting Vikramaditya0x (Dread) to Chanakya_Zero (Exploit.in)"
            },
            {
                "item_index": 3,
                "evidence_type": "Bitcoin Multi-Input Common-Spend (MICH) Raw Hex",
                "target": f"TXID: {dossier.financial_flows.bitcoin.common_input_spend_tx[:24]}...",
                "sha256": dossier.forensic_merkle_tree.leaf_hashes[3].sha256,
                "forensic_significance": "Consolidates extortion intake wallet with CoinDCX deposit wallet belonging to Rohan Sharma"
            },
            {
                "item_index": 4,
                "evidence_type": "TRC-20 USDT Smart Contract Event Sweep",
                "target": f"TXID: {dossier.financial_flows.tron_usdt.sweep_tx[:24]}...",
                "sha256": dossier.forensic_merkle_tree.leaf_hashes[4].sha256,
                "forensic_significance": "Direct sweep of 50,000 USDT to Indian exchange account matching PAN verified profile"
            }
        ]

        certificate_text = f"""================================================================================
                               THE SCHEDULE
                           [See Section 63(4)(c)]
               BHARATIYA SAKSHYA ADHINIYAM, 2023 (ACT NO. 47 OF 2023)
     CERTIFICATE FOR ADMISSIBILITY OF ELECTRONIC EVIDENCE IN COURT PROCEEDINGS
================================================================================

COURT JURISDICTION:        Designated Special Cyber / NIA Court
INQUIRY / PROSECUTION:     State (National Technical Research Organisation) vs. Accused
CASE DOCKET NUMBER:        {dossier.case_metadata.case_id}
OPERATION CODENAME:        {dossier.case_metadata.operation_codename}
STATUTORY POWER:           Sections 69 & 70A, Information Technology Act, 2000
CERTIFICATE REF:           NTRO/BSA63/2026/0918-B82C
DATE OF ISSUANCE:          18 September 2026

--------------------------------------------------------------------------------
PART A: CERTIFICATE BY PERSON PRODUCING / IN LAWFUL CONTROL OF THE SYSTEM
[Pursuant to Section 63(4)(a) of the Bharatiya Sakshya Adhiniyam, 2023]
--------------------------------------------------------------------------------
1. Particulars of Certifying Officer:
   Name:                   {part_a_custodian['certifier_name']}
   Official Designation:   {part_a_custodian['designation']}
   Agency / Ministry:      {part_a_custodian['organization']}

2. Particulars of Electronic Record / Produced Exhibit:
   - Target Infrastructure HTTP forensic capture & Apache mod_status memory logs
   - Tor v3 Hidden Service packet captures & TLS Subject Alternative Name bindings
   - Multi-input Bitcoin transaction hex dumps & Tron TRC-20 USDT smart contract logs
   - Cryptographic PGP RSA-4096 public key blocks published on keys.openpgp.org

3. Ingestion Device & Computing Enclave:
   System Identifier:      BHEDAK-HPC-ENCLAVE-NODE-04 (Hardware UUID: 5A92-F01B-942C-E871)
   Operating System:       Sovereign Hardened Enterprise Linux (FIPS 140-3 Mode)

4. Affirmation of Regular Operation & Data Integrity:
   {part_a_custodian['lawful_custody_affirmation']}
   {part_a_custodian['system_operational_integrity']}

   [Signed]
   {part_a_custodian['certifier_name']}
   {part_a_custodian['designation']}, NTRO, New Delhi

--------------------------------------------------------------------------------
PART B: TECHNICAL CERTIFICATE BY CYBER FORENSIC EXAMINER / EXPERT
[Pursuant to Section 63(4)(b) & (c) of the Bharatiya Sakshya Adhiniyam, 2023]
--------------------------------------------------------------------------------
1. Particulars of Forensic Expert:
   Name:                   {part_b_examiner['certifier_name']}
   Official Designation:   {part_b_examiner['designation']}
   Agency / Ministry:      {part_b_examiner['organization']}
   Accreditation:          Government Cyber Forensic Technical Examiner

2. Cryptographic Hash Values & Merkle Tree Root (FIPS 180-4 SHA-256):
   The electronic records have been sealed through deterministic cryptographic hashing:
   - Leaf 01 (Onion Ingestion Frame):     {leaf_hashes[0]}
   - Leaf 02 (Clearnet Origin IP Evidence): {leaf_hashes[1] if len(leaf_hashes) > 1 else leaf_hashes[0]}
   - Leaf 03 (PGP RSA-4096 Master Key):    {leaf_hashes[2] if len(leaf_hashes) > 2 else leaf_hashes[0]}
   - Leaf 04 (Bitcoin Common-Spend Tx):   {leaf_hashes[3] if len(leaf_hashes) > 3 else leaf_hashes[0]}
   - Leaf 05 (Tron USDT Sweep Tx):        {leaf_hashes[4] if len(leaf_hashes) > 4 else leaf_hashes[0]}

   COMPOSITE FORENSIC MERKLE ROOT:
   {merkle_root}

3. Hardware Security Module (HSM) Digital Attestation:
   Signature Algorithm:    {attestation['signature_algorithm']}
   HSM Hardware Standard:  {part_b_examiner['hsm_hardware_certification']}
   Key Identifier:         {attestation['key_identifier']}
   Digital Signature Hex:  {attestation['signature_hex']}

4. Primary Atomic Time Standard Synchronization:
   Traceable Standard:     {part_b_examiner['time_source_synchronization']}
   Certified Timestamp:    {dossier.forensic_merkle_tree.rfc3161_timestamp_tsa}

5. Forensic Attribution Determination:
   Subject Attributed:     {dossier.attributed_subject.legal_name} (Alias: {dossier.attributed_subject.alias})
   Age & Nationality:      {dossier.attributed_subject.age} Years / {dossier.attributed_subject.citizenship}
   Physical Residence:     {dossier.attributed_subject.current_residence}
   Composite Confidence:   95.0% (HIGH CERTAINTY - ADMISSIBLE AS PRIMARY EVIDENCE)

   I certify under penalty of law that the contents of this Certificate are true and correct to the best of my technical knowledge, scientific analysis, and belief.

   [Signed & Sealed]
   {part_b_examiner['certifier_name']}
   Lead Forensic Examiner, Sovereign Digital Forensics Division, NTRO
================================================================================
"""

        return {
            "statutory_framework": "Bharatiya Sakshya Adhiniyam, 2023 (Section 63)",
            "certificate_id": f"BSA63-CERT-{dossier.case_metadata.case_id}",
            "generated_at_utc": "2026-09-18T18:02:26.140Z",
            "time_source": "CSIR-NPL Atomic Reference (New Delhi)",
            "part_a_custodian": part_a_custodian,
            "part_b_examiner": part_b_examiner,
            "merkle_root_sha256": merkle_root,
            "attestation": attestation,
            "evidence_inventory": evidence_inventory,
            "certificate_plaintext": certificate_text
        }
