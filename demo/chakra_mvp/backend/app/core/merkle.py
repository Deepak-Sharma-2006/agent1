"""
Project CHAKRA: Cryptographic Merkle State Engine
Builds deterministic SHA-256 Merkle Trees for BSA 2023 Section 63(4) evidence certification
with inclusion audit proof generation and verification.
"""

import hashlib
from typing import List, Tuple, Optional

class MerkleEvidenceTree:
    """
    Computes a cryptographic Merkle root across transaction hashes in an attribution path.
    Guarantees tamper-evident chain-of-custody for court admissibility.
    Supports inclusion proof generation and verification.
    """

    def __init__(self, leaves: Optional[List[str]] = None):
        self.leaves = [l.lower().strip() for l in (leaves or [])]
        self.tree_layers: List[List[str]] = []
        if self.leaves:
            self._build_tree()

    @staticmethod
    def _sha256(data: str) -> str:
        return hashlib.sha256(data.encode("utf-8")).hexdigest()

    def _build_tree(self):
        current_layer = list(self.leaves)
        self.tree_layers = [current_layer]

        while len(current_layer) > 1:
            next_layer = []
            for i in range(0, len(current_layer), 2):
                left = current_layer[i]
                if i + 1 < len(current_layer):
                    right = current_layer[i + 1]
                else:
                    right = left
                combined = self._sha256(left + right)
                next_layer.append(combined)
            current_layer = next_layer
            self.tree_layers.append(current_layer)

    def get_merkle_root(self) -> str:
        if not self.tree_layers or not self.tree_layers[-1]:
            return self._sha256("EMPTY_TREE")
        return self.tree_layers[-1][0]

    @classmethod
    def compute_root(cls, hashes: List[str]) -> str:
        tree = cls(hashes)
        return tree.get_merkle_root()

    def get_proof(self, target_leaf: str) -> List[Tuple[str, str]]:
        """
        Returns list of (sibling_hash, direction) where direction is 'L' or 'R'.
        """
        target = target_leaf.lower().strip()
        if not self.tree_layers or target not in self.leaves:
            return []

        idx = self.leaves.index(target)
        proof = []

        for layer in self.tree_layers[:-1]:
            is_right_child = (idx % 2 == 1)
            sibling_idx = idx - 1 if is_right_child else idx + 1

            if sibling_idx < len(layer):
                sibling = layer[sibling_idx]
            else:
                sibling = layer[idx]

            direction = "L" if is_right_child else "R"
            proof.append((sibling, direction))
            idx = idx // 2

        return proof

    @classmethod
    def verify_proof(cls, target_leaf: str, proof: List[Tuple[str, str]], declared_root: str) -> bool:
        current = target_leaf.lower().strip()
        for sibling, direction in proof:
            if direction == "L":
                current = cls._sha256(sibling + current)
            else:
                current = cls._sha256(current + sibling)
        return current == declared_root.lower().strip()
