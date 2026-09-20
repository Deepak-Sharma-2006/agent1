"""
Project CHAKRA: Shared Application State & Engine Singleton
Provides thread-safe access to GraphStore, VASP Registry, and BeamSearch Engine.
"""

import json
from pathlib import Path
from typing import Dict, Any, List
from app.core.config import settings
from app.engine.graph_store import GraphStore
from app.engine.sweep_detector import DepositToSweepDetector
from app.engine.beam_search import DegreeBoundedBeamSearchEngine
from app.data.seed_scenarios import populate_seed_data, SCENARIO_METADATA

class EngineState:
    def __init__(self):
        self.graph_store = GraphStore()
        self.vasp_registry: List[Dict[str, Any]] = []
        self._load_registry()
        self.sweep_detector = DepositToSweepDetector(self.vasp_registry)
        self.engine = DegreeBoundedBeamSearchEngine(self.graph_store, self.sweep_detector)
        self.reset_to_seeds()

    def _load_registry(self):
        if settings.VASP_REGISTRY_PATH.exists():
            with open(settings.VASP_REGISTRY_PATH, "r", encoding="utf-8") as f:
                self.vasp_registry = json.load(f)
        else:
            self.vasp_registry = []

    def reset_to_seeds(self):
        """Clears graph store and repopulates with authentic Indian cybercrime seed scenarios."""
        self.graph_store.clear()
        populate_seed_data(self.graph_store)

state = EngineState()
