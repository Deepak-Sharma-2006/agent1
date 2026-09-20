"""
Project BHEDAK - STIX 2.1 Cyber Threat Intelligence Exporter
Serializes attribution graph, infrastructure indicators, and financial flows
into standard OASIS STIX 2.1 JSON bundles for cross-agency exchange (CERT-In, NCIIPC, I4C).
"""

import uuid
from typing import Dict, Any, List
from demo.bhedak_mvp.backend.core.models import FullCaseDossier


class STIX21Exporter:
    """
    Exports attribution intelligence to OASIS STIX 2.1 specification:
    - SDO: threat-actor (Rohan Sharma / CyberShadow)
    - SDO: identity (Individual / Legal Persona)
    - SDO: infrastructure (Tor v3 Hidden Service + Leaked Origin)
    - SDO: indicator (IPv4, BTC wallet, Tron wallet, PGP fingerprint)
    - SRO: relationship (attributed-to, uses, indicates)
    """

    @classmethod
    def export_bundle(cls, dossier: FullCaseDossier) -> Dict[str, Any]:
        """Generates STIX 2.1 JSON bundle."""
        bundle_id = f"bundle--{uuid.uuid5(uuid.NAMESPACE_DNS, dossier.case_metadata.case_id)}"
        created_time = "2026-09-18T18:00:00.000Z"
        
        objects: List[Dict[str, Any]] = []

        # 1. Identity (Attributed Subject)
        identity_id = f"identity--{uuid.uuid5(uuid.NAMESPACE_DNS, dossier.attributed_subject.subject_id)}"
        objects.append({
            "type": "identity",
            "spec_version": "2.1",
            "id": identity_id,
            "created": created_time,
            "modified": created_time,
            "name": dossier.attributed_subject.legal_name,
            "description": f"Attributed threat actor operating darknet ransomware extortion. Age: {dossier.attributed_subject.age}, Residence: {dossier.attributed_subject.current_residence}",
            "identity_class": "individual",
            "sectors": ["healthcare", "critical-infrastructure"],
            "contact_information": f"Alias: {dossier.attributed_subject.alias}, Location: Bengaluru, Karnataka"
        })

        # 2. Threat Actor
        threat_actor_id = f"threat-actor--{uuid.uuid5(uuid.NAMESPACE_DNS, 'threat-actor-' + dossier.case_metadata.case_id)}"
        aliases = [p.handle for p in dossier.threat_personas] + [dossier.attributed_subject.alias]
        objects.append({
            "type": "threat-actor",
            "spec_version": "2.1",
            "id": threat_actor_id,
            "created": created_time,
            "modified": created_time,
            "name": f"{dossier.attributed_subject.alias} ({dossier.attributed_subject.legal_name})",
            "description": f"Threat actor behind Operation {dossier.case_metadata.operation_codename}. Extortion damages: {dossier.case_metadata.financial_impact_inr}",
            "threat_actor_types": ["cybercriminal", "ransomware-operator"],
            "aliases": aliases,
            "roles": ["developer", "administrator", "financial-manager"],
            "sophistication": "advanced",
            "resource_level": "individual",
            "primary_motivation": "financial-gain",
            "personal_motivations": ["greed"]
        })

        # 3. Infrastructure (Tor Hidden Service)
        infra_id = f"infrastructure--{uuid.uuid5(uuid.NAMESPACE_DNS, dossier.infrastructure.hidden_service)}"
        objects.append({
            "type": "infrastructure",
            "spec_version": "2.1",
            "id": infra_id,
            "created": created_time,
            "modified": created_time,
            "name": dossier.infrastructure.title,
            "description": f"Tor v3 hidden service de-anonymized to origin IP {dossier.infrastructure.resolved_origin.ip}",
            "infrastructure_types": ["command-and-control", "exfiltration"],
            "aliases": [dossier.infrastructure.hidden_service]
        })

        # 4. Indicators
        # Indicator 4a: Origin IP
        indicator_ip_id = f"indicator--{uuid.uuid5(uuid.NAMESPACE_DNS, 'indicator-ip-' + dossier.infrastructure.resolved_origin.ip)}"
        objects.append({
            "type": "indicator",
            "spec_version": "2.1",
            "id": indicator_ip_id,
            "created": created_time,
            "modified": created_time,
            "name": f"Leaked Origin IP: {dossier.infrastructure.resolved_origin.ip}",
            "description": f"Physical server at {dossier.infrastructure.resolved_origin.datacenter_location} ({dossier.infrastructure.resolved_origin.isp})",
            "pattern": f"[ipv4-addr:value = '{dossier.infrastructure.resolved_origin.ip}']",
            "pattern_type": "stix",
            "valid_from": created_time
        })

        # Indicator 4b: BTC Intake Wallet
        btc_wallet = dossier.financial_flows.bitcoin.suspect_intake_address
        indicator_btc_id = f"indicator--{uuid.uuid5(uuid.NAMESPACE_DNS, 'indicator-btc-' + btc_wallet)}"
        objects.append({
            "type": "indicator",
            "spec_version": "2.1",
            "id": indicator_btc_id,
            "created": created_time,
            "modified": created_time,
            "name": f"Bitcoin Extortion Wallet: {btc_wallet[:16]}...",
            "description": f"Intake wallet linked to {dossier.financial_flows.bitcoin.destination_vasp} deposit account",
            "pattern": f"[cryptocurrency-wallet:address = '{btc_wallet}']",
            "pattern_type": "stix",
            "valid_from": created_time
        })

        # Indicator 4c: TRC-20 USDT Wallet
        tron_wallet = dossier.financial_flows.tron_usdt.suspect_intake_address
        indicator_tron_id = f"indicator--{uuid.uuid5(uuid.NAMESPACE_DNS, 'indicator-tron-' + tron_wallet)}"
        objects.append({
            "type": "indicator",
            "spec_version": "2.1",
            "id": indicator_tron_id,
            "created": created_time,
            "modified": created_time,
            "name": f"Tron TRC-20 Extortion Wallet: {tron_wallet[:16]}...",
            "description": f"Intake wallet swept to {dossier.financial_flows.tron_usdt.destination_vasp}",
            "pattern": f"[cryptocurrency-wallet:address = '{tron_wallet}']",
            "pattern_type": "stix",
            "valid_from": created_time
        })

        # 5. Relationships
        # Threat Actor -> Attributed To -> Identity
        objects.append({
            "type": "relationship",
            "spec_version": "2.1",
            "id": f"relationship--{uuid.uuid5(uuid.NAMESPACE_DNS, 'rel-attr-' + dossier.case_metadata.case_id)}",
            "created": created_time,
            "modified": created_time,
            "relationship_type": "attributed-to",
            "source_ref": threat_actor_id,
            "target_ref": identity_id,
            "confidence": int(dossier.attributed_subject.confidence_score * 100)
        })

        # Threat Actor -> Uses -> Infrastructure
        objects.append({
            "type": "relationship",
            "spec_version": "2.1",
            "id": f"relationship--{uuid.uuid5(uuid.NAMESPACE_DNS, 'rel-infra-' + dossier.case_metadata.case_id)}",
            "created": created_time,
            "modified": created_time,
            "relationship_type": "uses",
            "source_ref": threat_actor_id,
            "target_ref": infra_id
        })

        # Indicators -> Indicates -> Threat Actor
        for ind_id in [indicator_ip_id, indicator_btc_id, indicator_tron_id]:
            objects.append({
                "type": "relationship",
                "spec_version": "2.1",
                "id": f"relationship--{uuid.uuid5(uuid.NAMESPACE_DNS, 'rel-ind-' + ind_id)}",
                "created": created_time,
                "modified": created_time,
                "relationship_type": "indicates",
                "source_ref": ind_id,
                "target_ref": threat_actor_id
            })

        return {
            "type": "bundle",
            "id": bundle_id,
            "spec_version": "2.1",
            "objects": objects
        }
