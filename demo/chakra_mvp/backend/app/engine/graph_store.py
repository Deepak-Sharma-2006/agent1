"""
Project CHAKRA: High-Performance Graph Store
Provides in-memory property graph indexing, dynamic edge injection, and traversal queries.
"""

from typing import Dict, List, Set, Optional
from collections import defaultdict
from app.models.schemas import TransactionEdge, GraphNode, NodeType, NetworkType

class GraphStore:
    """
    In-memory graph repository providing adjacency indexing,
    fast edge lookups, and dynamic jury injection support.
    """

    def __init__(self):
        self.nodes: Dict[str, GraphNode] = {}
        self.outgoing_adj: Dict[str, List[TransactionEdge]] = defaultdict(list)
        self.incoming_adj: Dict[str, List[TransactionEdge]] = defaultdict(list)
        self.all_edges: List[TransactionEdge] = []

    def clear(self):
        self.nodes.clear()
        self.outgoing_adj.clear()
        self.incoming_adj.clear()
        self.all_edges.clear()

    def add_node(self, node: GraphNode):
        self.nodes[node.id.lower()] = node

    def add_edge(self, edge: TransactionEdge):
        self.all_edges.append(edge)
        src_lower = edge.source_address.lower()
        dst_lower = edge.destination_address.lower()
        
        self.outgoing_adj[src_lower].append(edge)
        self.incoming_adj[dst_lower].append(edge)

        # Ensure nodes exist in registry
        if src_lower not in self.nodes:
            self.nodes[src_lower] = GraphNode(
                id=edge.source_address,
                label=edge.source_address[:8] + "...",
                network=edge.network,
                node_type=NodeType.INTERMEDIARY_UNHOSTED
            )
        if dst_lower not in self.nodes:
            self.nodes[dst_lower] = GraphNode(
                id=edge.destination_address,
                label=edge.destination_address[:8] + "...",
                network=edge.network,
                node_type=NodeType.INTERMEDIARY_UNHOSTED
            )

    def get_node(self, address: str) -> Optional[GraphNode]:
        return self.nodes.get(address.lower())

    def get_outgoing(self, address: str) -> List[TransactionEdge]:
        return self.outgoing_adj.get(address.lower(), [])

    def get_incoming(self, address: str) -> List[TransactionEdge]:
        return self.incoming_adj.get(address.lower(), [])

    def get_all_nodes(self) -> List[GraphNode]:
        return list(self.nodes.values())

    def get_all_edges(self) -> List[TransactionEdge]:
        return self.all_edges
