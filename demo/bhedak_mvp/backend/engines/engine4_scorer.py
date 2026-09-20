"""
Project BHEDAK - Engine 4: Asymmetric Attribution Confidence Scorer
Enforces court-admissible forensic precedence:
1. Deterministic Proof (PGP, Common-Input BTC, Origin IP leak) -> Can achieve 0.85 - 1.00
2. Corroborative Evidence (Favicon MMH3, SSL SANs) -> 0.50 - 0.70
3. Probabilistic Signals (Stylometry, Diurnal Sleep Window) -> Hard-capped at 0.65
"""

from typing import List, Dict, Any, Tuple
from demo.bhedak_mvp.backend.core.models import AttributionSignal, AttributedSubject


class AsymmetricAttributionScorer:
    """
    Engine 4 Core: Combines multi-engine signals with strict legal safeguards.
    Prevents false-positive attribution caused by high probabilistic AI scores alone.
    """

    PROBABILISTIC_CEILING: float = 0.65
    DETERMINISTIC_THRESHOLD: float = 0.85

    @classmethod
    def evaluate_signals(cls, signals: List[AttributionSignal]) -> Dict[str, Any]:
        """
        Calculates composite attribution confidence score and assigns statutory tier.
        """
        deterministic_signals = [s for s in signals if "deterministic" in s.tier.lower()]
        corroborative_signals = [s for s in signals if "corroborative" in s.tier.lower()]
        probabilistic_signals = [s for s in signals if "probabilistic" in s.tier.lower()]

        # Check if any deterministic proof exists
        has_deterministic_proof = len(deterministic_signals) > 0

        # Calculate weighted scores
        total_weight = sum(s.weight for s in signals)
        if total_weight == 0:
            return {
                "composite_score": 0.0,
                "confidence_tier": "UNRELIABLE",
                "confidence_rating": "UNRELIABLE (0.0%)",
                "has_deterministic_proof": False,
                "signals_evaluated": 0,
                "legal_admissibility_summary": "Insufficient evidence for attribution."
            }

        raw_weighted_sum = sum(s.score * s.weight for s in signals)
        composite_score = raw_weighted_sum / total_weight

        # ENFORCE INVARIANT: Probabilistic signals alone CANNOT exceed PROBABILISTIC_CEILING (0.65)
        if not has_deterministic_proof:
            composite_score = min(composite_score, cls.PROBABILISTIC_CEILING)
            confidence_tier = "PROBABILISTIC_LEAD"
            confidence_rating = f"PROBABILISTIC LEAD ({composite_score * 100:.1f}%)"
            legal_summary = "Advisory intelligence lead only. Inadmissible as sole attribution proof under Section 63 BSA 2023."
        else:
            # Deterministic signals exist
            if composite_score >= cls.DETERMINISTIC_THRESHOLD:
                confidence_tier = "DETERMINISTIC_PROOF"
                confidence_rating = f"HIGH CONFIDENCE ({composite_score * 100:.1f}%)"
                legal_summary = "Court-admissible forensic attribution backed by cryptographic and financial deterministic proofs."
            elif composite_score >= 0.50:
                confidence_tier = "PROBABILISTIC_LEAD"
                confidence_rating = f"MODERATE CORROBORATED ({composite_score * 100:.1f}%)"
                legal_summary = "Corroborated lead with partial deterministic link. Further financial/telecom subpoenas recommended."
            else:
                confidence_tier = "UNRELIABLE"
                confidence_rating = f"LOW CONFIDENCE ({composite_score * 100:.1f}%)"
                legal_summary = "Unreliable lead. Conflicting or insufficient signals."

        return {
            "composite_score": round(composite_score, 3),
            "confidence_tier": confidence_tier,
            "confidence_rating": confidence_rating,
            "has_deterministic_proof": has_deterministic_proof,
            "signals_evaluated": len(signals),
            "deterministic_count": len(deterministic_signals),
            "corroborative_count": len(corroborative_signals),
            "probabilistic_count": len(probabilistic_signals),
            "legal_admissibility_summary": legal_summary
        }
