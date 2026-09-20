"""
Project BHEDAK - Engine 2: Multi-Market Entity Resolution & Graph Analytics
Maintains the multi-modal property graph connecting darknet forum personas,
PGP master fingerprints, multi-chain wallets (BTC & Tron), and VASP KYC accounts.
"""

from typing import List, Dict, Any, Optional, Set
from collections import deque


class KnowledgeGraphEngine:
    """
    Engine 2 Core: Executes graph traversals, entity merging via PGP subkey binding,
    and multi-chain blockchain heuristics (BTC MICH + Tron TRC-20 sweeps).
    """

    def __init__(self, nodes: List[Dict[str, Any]], edges: List[Dict[str, Any]]):
        self.nodes = {n["id"]: n for n in nodes}
        self.edges = edges
        self.adjacency: Dict[str, List[Dict[str, Any]]] = {}
        self._build_adjacency()

    def _build_adjacency(self):
        for n_id in self.nodes:
            self.adjacency[n_id] = []
        for e in self.edges:
            src, tgt = e["source"], e["target"]
            if src in self.adjacency:
                self.adjacency[src].append(e)
            # Bidirectional exploration for forensic correlation
            if tgt in self.adjacency:
                rev_edge = {
                    "source": tgt,
                    "target": src,
                    "label": f"REV_{e['label']}",
                    "weight": e.get("weight", 1.0)
                }
                self.adjacency[tgt].append(rev_edge)

    def find_shortest_attribution_path(self, start_id: str, target_category: str = "primary") -> Optional[List[Dict[str, Any]]]:
        """
        Executes bounded Breadth-First Search (BFS) to trace any peripheral darknet entity
        (e.g., forum handle or wallet) back to the attributed real-world subject.
        """
        if start_id not in self.nodes:
            return None

        visited: Set[str] = {start_id}
        queue = deque([(start_id, [])])

        while queue:
            current_id, path = queue.popleft()
            current_node = self.nodes[current_id]

            if current_node.get("category") == target_category and current_id != start_id:
                return path + [{"node": current_node}]

            for edge in self.adjacency.get(current_id, []):
                neighbor_id = edge["target"]
                if neighbor_id not in visited:
                    visited.add(neighbor_id)
                    step = {"edge": edge, "node": self.nodes[neighbor_id]}
                    queue.append((neighbor_id, path + [step]))

        return None

    def trace_blockchain_fund_hops(self, start_wallet_id: str) -> List[Dict[str, Any]]:
        """
        Traces downstream multi-hop fund flows from extortion intake wallet to regulated VASP deposit.
        """
        hops = []
        visited = set()
        queue = deque([start_wallet_id])

        while queue:
            curr = queue.popleft()
            if curr in visited:
                continue
            visited.add(curr)

            for edge in self.adjacency.get(curr, []):
                if any(kw in edge["label"] for kw in ["CO_SPENT", "SWEEP", "PAYMENT"]):
                    tgt = edge["target"]
                    tgt_node = self.nodes.get(tgt, {})
                    hops.append({
                        "from_wallet": curr,
                        "to_entity": tgt,
                        "relation": edge["label"],
                        "entity_type": tgt_node.get("type"),
                        "entity_label": tgt_node.get("label")
                    })
                    queue.append(tgt)
        return hops

    def get_full_graph_payload(self) -> Dict[str, Any]:
        """Returns standard Cytoscape.js compatible elements payload."""
        elements = []
        for n_id, n in self.nodes.items():
            elements.append({
                "data": {
                    "id": n["id"],
                    "label": n["label"],
                    "type": n["type"],
                    "category": n["category"],
                    "confidence": n.get("confidence")
                }
            })
        for i, e in enumerate(self.edges):
            elements.append({
                "data": {
                    "id": f"edge-{i}",
                    "source": e["source"],
                    "target": e["target"],
                    "label": e["label"],
                    "weight": e.get("weight", 1.0)
                }
            })
        return {"nodes_count": len(self.nodes), "edges_count": len(self.edges), "elements": elements}
