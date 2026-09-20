"""
Project CHAKRA: Deposit-to-Sweep Consolidation Heuristic Engine
Mathematically detects automated exchange sweep routines consolidating funds into known hot wallets.
"""

from decimal import Decimal
from datetime import datetime
from typing import Optional, Dict, Any, List
from app.models.schemas import SweepProof, TransactionEdge
from app.core.config import settings

class DepositToSweepDetector:
    """
    Evaluates transactional edges outgoing from a candidate address to detect
    VASP sweeper consolidation behavior.
    """

    def __init__(self, vasp_registry: List[Dict[str, Any]]):
        self.vasp_registry = vasp_registry
        self._build_hot_wallet_index()

    def _build_hot_wallet_index(self):
        """Indexes hot wallets for O(1) matching."""
        self.hot_wallet_map: Dict[str, Dict[str, Any]] = {}
        self.fueler_set = set()

        for vasp in self.vasp_registry:
            name = vasp["name"]
            fiu_reg = vasp["fiu_reg"]
            email = vasp.get("nodal_email", vasp.get("compliance_email", "compliance@vasp.in"))
            
            for net, wallets in vasp.get("hot_wallets", {}).items():
                for w in wallets:
                    self.hot_wallet_map[w.lower()] = {
                        "name": name,
                        "fiu_reg": fiu_reg,
                        "email": email,
                        "network": net,
                        "hot_wallet": w
                    }

            for net, fuelers in vasp.get("fuelers", {}).items():
                for f in fuelers:
                    self.fueler_set.add(f.lower())

    def is_known_hot_wallet(self, address: str) -> bool:
        return address.lower() in self.hot_wallet_map

    def get_vasp_info(self, address: str) -> Optional[Dict[str, Any]]:
        return self.hot_wallet_map.get(address.lower())

    def evaluate_deposit_sweep(
        self,
        candidate_address: str,
        inbound_edge: TransactionEdge,
        outgoing_edges: List[TransactionEdge]
    ) -> Optional[SweepProof]:
        """
        Inspects outgoing transactions from candidate_address following inbound_edge.
        Fires if outgoing funds flow to a known VASP hot wallet with balance zeroing (>=95%).
        """
        inbound_amount = Decimal(inbound_edge.decimal_amount)
        if inbound_amount <= Decimal("0"):
            return None

        inbound_time = datetime.fromisoformat(inbound_edge.block_timestamp.replace("Z", "+00:00"))

        for out_edge in outgoing_edges:
            dest_lower = out_edge.destination_address.lower()
            
            # Check 1: Destination is verified VASP Hot Wallet
            if dest_lower in self.hot_wallet_map:
                vasp_match = self.hot_wallet_map[dest_lower]
                out_amount = Decimal(out_edge.decimal_amount)
                
                # Check 2: Temporal Proximity
                out_time = datetime.fromisoformat(out_edge.block_timestamp.replace("Z", "+00:00"))
                time_delta_sec = (out_time - inbound_time).total_seconds()
                
                if 0 <= time_delta_sec <= settings.SWEEP_WINDOW_SECONDS:
                    # Check 3: Balance Sweep Ratio
                    sweep_ratio = float(out_amount / inbound_amount) if inbound_amount > 0 else 0.0
                    
                    if sweep_ratio >= float(settings.MIN_SWEEP_RATIO):
                        # Check 4: Gas Sponsorship
                        gas_sponsored = False
                        sponsor_addr = None
                        if out_edge.gas_payer:
                            gas_payer_lower = out_edge.gas_payer.lower()
                            if gas_payer_lower in self.fueler_set or gas_payer_lower in self.hot_wallet_map:
                                gas_sponsored = True
                                sponsor_addr = out_edge.gas_payer
                        elif out_edge.is_sweep:
                            gas_sponsored = True
                            sponsor_addr = vasp_match["hot_wallet"]

                        return SweepProof(
                            is_sweep_confirmed=True,
                            candidate_deposit_address=candidate_address,
                            vasp_name=vasp_match["name"],
                            fiu_ind_registration=vasp_match["fiu_reg"],
                            operational_hot_wallet=vasp_match["hot_wallet"],
                            deposit_tx_hash=inbound_edge.tx_hash,
                            sweep_tx_hash=out_edge.tx_hash,
                            deposit_amount=inbound_edge.decimal_amount,
                            swept_amount=out_edge.decimal_amount,
                            sweep_ratio=round(sweep_ratio, 4),
                            latency_minutes=round(time_delta_sec / 60.0, 2),
                            gas_sponsored_by_vasp=gas_sponsored,
                            gas_sponsor_address=sponsor_addr
                        )

        return None
