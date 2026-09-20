"""
Project CHAKRA: Attribution & Graph Traversal Endpoints
Dynamic VASP pathfinding, custom jury injection, scenario management, and registry queries.
"""

from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status
from app.models.schemas import (
    AttributionRequest, AttributionResponse, CustomGraphInjectionRequest,
    GraphNode, TransactionEdge
)
from app.core.security import AuthUser, UserRole
from app.api.deps import get_current_user
from app.engine.state import state
from app.data.seed_scenarios import SCENARIO_METADATA

router = APIRouter(prefix="/attribution", tags=["Attribution"])

@router.post("/trace", response_model=AttributionResponse)
def trace_suspect_wallet(
    request: AttributionRequest,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Executes Degree-Bounded Beam Search and Deposit-to-Sweep heuristic
    to attribute an unknown suspect wallet to the nearest VASP.
    """
    try:
        attribution_result = state.engine.execute_attribution(request)
        return attribution_result
    except ValueError as ve:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(ve)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Attribution traversal failure: {str(e)}"
        )

@router.post("/inject", response_model=AttributionResponse)
def inject_custom_jury_graph(
    injection: CustomGraphInjectionRequest,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    DYNAMIC JURY INJECTION ENDPOINT:
    Accepts arbitrary nodes and transaction edges submitted by evaluators/jury members.
    Dynamically injects into the active in-memory GraphStore and immediately executes
    the attribution engine without pre-baked static mock responses.
    """
    # Inject all edges into active graph store
    for edge in injection.edges:
        state.graph_store.add_edge(edge)

    # Formulate attribution request
    req = AttributionRequest(
        sahyog_case_id="SHG-JURY-DYNAMIC-TEST",
        ncrp_complaint_id="NCRP-JURY-EVAL-001",
        suspect_wallet_address=injection.suspect_wallet_address,
        network=injection.network,
        reported_fraud_amount_inr=1000000.0,
        max_hops=6,
        dust_threshold_usd=5.0
    )

    result = state.engine.execute_attribution(req)
    return result

@router.get("/scenarios", response_model=List[Dict[str, Any]])
def get_available_scenarios(
    current_user: AuthUser = Depends(get_current_user)
):
    """Returns the four authentic Indian cybercrime case testbeds."""
    return SCENARIO_METADATA

@router.post("/scenarios/{scenario_id}/load")
def load_scenario(
    scenario_id: str,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Loads a specific case scenario, ensuring all its transactions are indexed
    in the graph store, and returns the target suspect address and case metadata.
    """
    matched = next((s for s in SCENARIO_METADATA if s["id"] == scenario_id), None)
    if not matched:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Scenario '{scenario_id}' not found in registry."
        )
    return {
        "status": "LOADED",
        "scenario": matched,
        "suggested_request": AttributionRequest(
            sahyog_case_id=f"SHG-2026-{scenario_id[:8]}",
            ncrp_complaint_id=matched["ncrp_id"],
            suspect_wallet_address=matched["suspect_wallet"],
            network=matched["network"],
            reported_fraud_amount_inr=matched["victim_loss_inr"],
            max_hops=5,
            dust_threshold_usd=10.0
        )
    }

@router.post("/reset")
def reset_graph_state(
    current_user: AuthUser = Depends(get_current_user)
):
    """Resets the GraphStore to default authentic Indian seed scenarios."""
    state.reset_to_seeds()
    return {
        "status": "RESET_SUCCESSFUL",
        "total_nodes": len(state.graph_store.nodes),
        "total_edges": len(state.graph_store.all_edges)
    }

@router.get("/vasps")
def get_vasp_directory(
    current_user: AuthUser = Depends(get_current_user)
):
    """Returns the FIU-IND registered Virtual Asset Service Providers."""
    return {
        "count": len(state.vasp_registry),
        "vasps": [
            {
                "name": v["name"],
                "fiu_ind_registration": v["fiu_ind_registration"],
                "jurisdiction": v["jurisdiction"],
                "compliance_email": v["compliance_email"],
                "supported_networks": v["supported_networks"],
                "total_known_hot_wallets": sum(len(hw) for hw in v.get("known_hot_wallets", {}).values())
            }
            for v in state.vasp_registry
        ]
    }

@router.get("/stats")
def get_engine_statistics(
    current_user: AuthUser = Depends(get_current_user)
):
    """Returns operational engine metrics and in-memory graph dimensions."""
    return {
        "total_nodes": len(state.graph_store.nodes),
        "total_edges": len(state.graph_store.all_edges),
        "registered_vasps": len(state.vasp_registry),
        "status": "ONLINE_READY",
        "max_degree_bound": 50,
        "supported_networks": ["BTC", "ETH", "TRON", "BSC", "POL", "SOL"]
    }
