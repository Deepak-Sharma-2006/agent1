"""
Project CHAKRA: 4-Pillar Explainable Confidence Scoring Engine
Calculates an objective, mathematically bounded attribution score (0 - 100).
"""

from decimal import Decimal
from typing import Optional, List
from app.models.schemas import ScorePillarBreakdown, SweepProof, TransactionEdge

class AttributionScorer:
    """
    Computes explainable Attribution Confidence Score based on:
    S_attr = min(100, W_match*S_match + W_sweep*S_sweep + W_hop*S_hop + W_vol*S_vol - P_risk)
    """

    @classmethod
    def calculate_score(
        cls,
        is_direct_match: bool,
        sweep_proof: Optional[SweepProof],
        hop_distance: int,
        initial_fraud_amount: Decimal,
        traced_amount: Decimal,
        path_edges: List[TransactionEdge]
    ) -> ScorePillarBreakdown:
        
        # If no VASP match at all (unresolved flow)
        if not is_direct_match and not (sweep_proof and sweep_proof.is_sweep_confirmed):
            return ScorePillarBreakdown(
                infrastructure_match_score=0.0,
                sweep_consistency_score=0.0,
                proximity_decay_score=0.0,
                volume_continuity_score=0.0,
                risk_penalty_deduction=0.0,
                final_confidence_score=0.0
            )

        # Pillar 1: Infrastructure Match (Max 40 pts)
        if is_direct_match:
            infra_score = 40.0
        else:
            infra_score = 38.0  # Confirmed via deposit forwarder

        # Pillar 2: Sweep Consistency (Max 25 pts)
        if sweep_proof and sweep_proof.is_sweep_confirmed:
            if sweep_proof.gas_sponsored_by_vasp and sweep_proof.latency_minutes <= 120.0:
                sweep_score = 25.0
            elif sweep_proof.sweep_ratio >= 0.95:
                sweep_score = 21.0
            else:
                sweep_score = 15.0
        elif is_direct_match:
            sweep_score = 25.0  # Deposited straight into hot wallet
        else:
            sweep_score = 0.0

        # Pillar 3: Proximity Decay (Max 20 pts)
        # Decays linearly from hop 1 to hop 5
        # hop 1 = 20 pts, hop 2 = 16 pts, hop 3 = 12 pts, hop 4 = 8 pts, hop 5 = 4 pts
        proximity_score = max(0.0, 20.0 - float(max(0, hop_distance - 1) * 4.0))

        # Pillar 4: Volume Continuity Ratio (Max 15 pts)
        if initial_fraud_amount > Decimal("0"):
            vol_ratio = min(1.0, float(traced_amount / initial_fraud_amount))
            volume_score = round(vol_ratio * 15.0, 2)
        else:
            volume_score = 10.0

        # Risk Penalties
        risk_penalty = 0.0
        for edge in path_edges:
            if edge.tx_type == "MIXER_DEPOSIT":
                risk_penalty += 35.0
            elif edge.tx_type == "BRIDGE_LOCK":
                risk_penalty += 15.0

        raw_total = infra_score + sweep_score + proximity_score + volume_score - risk_penalty
        final_score = round(max(0.0, min(100.0, raw_total)), 1)

        return ScorePillarBreakdown(
            infrastructure_match_score=infra_score,
            sweep_consistency_score=sweep_score,
            proximity_decay_score=proximity_score,
            volume_continuity_score=volume_score,
            risk_penalty_deduction=risk_penalty,
            final_confidence_score=final_score
        )

    @staticmethod
    def get_tier(score: float) -> str:
        if score >= 85.0:
            return "Tier 1: High Confidence (Automated Section 106/107 BNSS Freezing Order)"
        elif score >= 60.0:
            return "Tier 2: Medium Confidence (Section 94 BNSS Information Disclosure Summons)"
        else:
            return "Tier 3: Indeterminate / Forensic Specialist Review Required"
