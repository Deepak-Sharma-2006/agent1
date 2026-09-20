"""
Project CHAKRA: Degree-Bounded Beam Search Attribution Engine
Executes bounded directional graph traversal to locate nearest VASP endpoints.
"""

import time
from decimal import Decimal
from typing import Optional, List, Dict, Any, Set, Tuple
from app.core.config import settings
from app.core.merkle import MerkleEvidenceTree
from app.models.schemas import (
    AttributionRequest, AttributionResponse, GraphNode, TransactionEdge,
    NodeType, NetworkType, SweepProof
)
from app.engine.graph_store import GraphStore
from app.engine.sweep_detector import DepositToSweepDetector
from app.engine.scoring import AttributionScorer

class DegreeBoundedBeamSearchEngine:
    """
    Solves the combinatorial explosion problem by executing degree-clamped,
    dust-filtered beam search to find nearest VASP deposit/hot wallet destinations.
    """

    def __init__(self, graph_store: GraphStore, sweep_detector: DepositToSweepDetector):
        self.graph = graph_store
        self.sweep_detector = sweep_detector

    def execute_attribution(self, req: AttributionRequest) -> AttributionResponse:
        start_time = time.perf_counter()
        suspect_addr = req.suspect_wallet_address.strip()
        dust_limit = Decimal(str(req.dust_threshold_usd))
        max_hops = req.max_hops
        fraud_inr = Decimal(str(req.reported_fraud_amount_inr))

        visited: Set[str] = set([suspect_addr.lower()])
        # Queue item: (current_address, current_hop, path_edges, accumulated_val, last_inbound_edge)
        queue: List[Tuple[str, int, List[TransactionEdge], Decimal, Optional[TransactionEdge]]] = [
            (suspect_addr, 0, [], Decimal("0.0"), None)
        ]

        best_match: Optional[Dict[str, Any]] = None
        traversed_nodes: Dict[str, GraphNode] = {}
        traversed_edges: List[TransactionEdge] = []

        # Add initial suspect node
        init_node = self.graph.get_node(suspect_addr) or GraphNode(
            id=suspect_addr,
            label="Suspect Wallet (" + suspect_addr[:6] + "...)",
            network=req.network,
            node_type=NodeType.SUSPECT_WALLET,
            hop_level=0
        )
        init_node.node_type = NodeType.SUSPECT_WALLET
        init_node.hop_level = 0
        traversed_nodes[suspect_addr.lower()] = init_node

        while queue:
            curr_addr, hop, path, total_val, last_edge = queue.pop(0)

            if hop >= max_hops:
                continue

            # Fetch outgoing transfers
            raw_outgoing = self.graph.get_outgoing(curr_addr)
            
            # Filter 1: Dust pruning
            filtered_outgoing = [
                e for e in raw_outgoing
                if Decimal(e.decimal_amount) * Decimal(str(e.fiat_usd_at_exec / max(1e-6, float(e.decimal_amount)))) >= dust_limit
                or Decimal(e.decimal_amount) >= Decimal("10.0")  # Minimum 10 tokens fallback
            ]

            # Filter 2: Degree Clamping (Sort by amount descending, keep top beam degree)
            pruned_edges = sorted(
                filtered_outgoing,
                key=lambda x: Decimal(x.decimal_amount),
                reverse=True
            )[:settings.MAX_BEAM_DEGREE]

            for edge in pruned_edges:
                next_addr = edge.destination_address
                next_lower = next_addr.lower()
                traversed_edges.append(edge)

                # Record node in graph
                if next_lower not in traversed_nodes:
                    node_obj = self.graph.get_node(next_addr) or GraphNode(
                        id=next_addr,
                        label=next_addr[:6] + "..." + next_addr[-4:],
                        network=edge.network,
                        node_type=NodeType.INTERMEDIARY_UNHOSTED,
                        hop_level=hop + 1
                    )
                    node_obj.hop_level = hop + 1
                    traversed_nodes[next_lower] = node_obj

                # Case A: Destination matches known VASP Hot Wallet directly
                if self.sweep_detector.is_known_hot_wallet(next_addr):
                    vasp_info = self.sweep_detector.get_vasp_info(next_addr)
                    traversed_nodes[next_lower].node_type = NodeType.VASP_HOT_WALLET
                    traversed_nodes[next_lower].cluster_entity = vasp_info["name"]
                    traversed_nodes[next_lower].is_hot_wallet = True

                    best_match = {
                        "status": "VASP_ATTRIBUTED_HIGH_CONFIDENCE",
                        "vasp_name": vasp_info["name"],
                        "fiu_reg": vasp_info["fiu_reg"],
                        "email": vasp_info["email"],
                        "deposit_wallet": curr_addr,
                        "hot_wallet": next_addr,
                        "hops": hop + 1,
                        "path": path + [edge],
                        "sweep_proof": None,
                        "is_direct": True,
                        "traced_amount": Decimal(edge.decimal_amount),
                        "asset": edge.asset_symbol,
                        "fiat_inr": edge.fiat_inr_at_exec
                    }
                    break

                # Case B: Check if next_addr exhibits Deposit-to-Sweep behavior
                outgoing_from_next = self.graph.get_outgoing(next_addr)
                sweep_proof = self.sweep_detector.evaluate_deposit_sweep(next_addr, edge, outgoing_from_next)
                
                if sweep_proof and sweep_proof.is_sweep_confirmed:
                    hot_wallet_addr = sweep_proof.operational_hot_wallet
                    hot_lower = hot_wallet_addr.lower()
                    
                    # Mark candidate deposit node
                    traversed_nodes[next_lower].node_type = NodeType.CANDIDATE_DEPOSIT
                    traversed_nodes[next_lower].cluster_entity = f"{sweep_proof.vasp_name} Deposit Address"
                    
                    # Add hot wallet node
                    if hot_lower not in traversed_nodes:
                        traversed_nodes[hot_lower] = GraphNode(
                            id=hot_wallet_addr,
                            label=f"{sweep_proof.vasp_name} Hot Storage",
                            network=edge.network,
                            node_type=NodeType.VASP_HOT_WALLET,
                            cluster_entity=sweep_proof.vasp_name,
                            is_hot_wallet=True,
                            hop_level=hop + 2
                        )

                    # Find sweep edge to include in graph view
                    for sw_edge in outgoing_from_next:
                        if sw_edge.destination_address.lower() == hot_lower:
                            sw_edge.is_sweep = True
                            traversed_edges.append(sw_edge)
                            break

                    vasp_info = self.sweep_detector.get_vasp_info(hot_wallet_addr)
                    best_match = {
                        "status": "VASP_ATTRIBUTED_HIGH_CONFIDENCE",
                        "vasp_name": sweep_proof.vasp_name,
                        "fiu_reg": sweep_proof.fiu_ind_registration,
                        "email": vasp_info["email"] if vasp_info else "compliance@vasp.in",
                        "deposit_wallet": next_addr,
                        "hot_wallet": hot_wallet_addr,
                        "hops": hop + 1,
                        "path": path + [edge],
                        "sweep_proof": sweep_proof,
                        "is_direct": False,
                        "traced_amount": Decimal(edge.decimal_amount),
                        "asset": edge.asset_symbol,
                        "fiat_inr": edge.fiat_inr_at_exec
                    }
                    break

                # Continue BFS exploration if not visited
                if next_lower not in visited:
                    visited.add(next_lower)
                    queue.append((next_addr, hop + 1, path + [edge], total_val + Decimal(edge.decimal_amount), edge))

            if best_match:
                break  # Shortest path nearest VASP located

        elapsed_ms = round((time.perf_counter() - start_time) * 1000.0, 2)

        # Build final response
        if best_match:
            score_breakdown = AttributionScorer.calculate_score(
                is_direct_match=best_match["is_direct"],
                sweep_proof=best_match["sweep_proof"],
                hop_distance=best_match["hops"],
                initial_fraud_amount=best_match["traced_amount"],
                traced_amount=best_match["traced_amount"],
                path_edges=best_match["path"]
            )
            merkle_root = MerkleEvidenceTree.compute_root([e.tx_hash for e in traversed_edges])
            tier_str = AttributionScorer.get_tier(score_breakdown.final_confidence_score)

            return AttributionResponse(
                sahyog_case_id=req.sahyog_case_id,
                ncrp_complaint_id=req.ncrp_complaint_id,
                suspect_wallet=suspect_addr,
                network=req.network,
                attribution_status=best_match["status"],
                confidence_score=score_breakdown.final_confidence_score,
                confidence_tier=tier_str,
                nearest_vasp=best_match["vasp_name"],
                fiu_ind_reg_number=best_match["fiu_reg"],
                compliance_email=best_match["email"],
                deposit_address=best_match["deposit_wallet"],
                hot_wallet_address=best_match["hot_wallet"],
                hop_distance=best_match["hops"],
                traced_amount_crypto=f"{best_match['traced_amount']} {best_match['asset']}",
                asset_symbol=best_match["asset"],
                fiat_value_inr=best_match["fiat_inr"],
                merkle_evidence_root=merkle_root,
                sweep_proof=best_match["sweep_proof"],
                score_breakdown=score_breakdown,
                graph_nodes=list(traversed_nodes.values()),
                graph_edges=traversed_edges,
                processing_time_ms=elapsed_ms
            )
        else:
            # Unresolved Multi-Hop
            score_breakdown = AttributionScorer.calculate_score(
                is_direct_match=False,
                sweep_proof=None,
                hop_distance=max_hops,
                initial_fraud_amount=Decimal("100.0"),
                traced_amount=Decimal("0.0"),
                path_edges=traversed_edges
            )
            merkle_root = MerkleEvidenceTree.compute_root([e.tx_hash for e in traversed_edges])

            return AttributionResponse(
                sahyog_case_id=req.sahyog_case_id,
                ncrp_complaint_id=req.ncrp_complaint_id,
                suspect_wallet=suspect_addr,
                network=req.network,
                attribution_status="UNRESOLVED_MULTI_HOP",
                confidence_score=score_breakdown.final_confidence_score,
                confidence_tier="Tier 3: Indeterminate / Unresolved",
                nearest_vasp=None,
                fiu_ind_reg_number=None,
                compliance_email=None,
                deposit_address=None,
                hot_wallet_address=None,
                hop_distance=0,
                traced_amount_crypto="0.0",
                asset_symbol=req.network.value,
                fiat_value_inr=0.0,
                merkle_evidence_root=merkle_root,
                sweep_proof=None,
                score_breakdown=score_breakdown,
                graph_nodes=list(traversed_nodes.values()),
                graph_edges=traversed_edges,
                processing_time_ms=elapsed_ms
            )
