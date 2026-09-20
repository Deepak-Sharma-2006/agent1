"""
Tests for Project CHAKRA Statutory PDF Generation Engine
Validates BNSS-94 Summons, BSA-63(4) Certificate, and Executive Attribution Dossier.
"""

import json
import pytest
from app.core.config import settings
from app.reports.pdf_generator import (
    generate_attribution_dossier_pdf,
    generate_bnss_summons_notice,
    generate_bsa_63_4_certificate
)
from app.core.security import MOCK_USERS
from app.data.seed_scenarios import populate_seed_data, SCENARIO_METADATA
from app.engine.graph_store import GraphStore
from app.engine.sweep_detector import DepositToSweepDetector
from app.engine.beam_search import DegreeBoundedBeamSearchEngine
from app.models.schemas import AttributionRequest, NetworkType

@pytest.fixture
def attribution_sample():
    with open(settings.VASP_REGISTRY_PATH, "r", encoding="utf-8") as f:
        vasp_data = json.load(f)

    store = GraphStore()
    populate_seed_data(store)
    sweep_det = DepositToSweepDetector(vasp_data)
    engine = DegreeBoundedBeamSearchEngine(store, sweep_det)
    
    case_meta = SCENARIO_METADATA[0]
    req = AttributionRequest(
        sahyog_case_id="SHG-2026-BLR-00412",
        ncrp_complaint_id=case_meta["ncrp_id"],
        suspect_wallet_address=case_meta["suspect_wallet"],
        network=NetworkType.TRON,
        reported_fraud_amount_inr=case_meta["victim_loss_inr"],
        max_hops=5,
        dust_threshold_usd=10.0
    )
    result = engine.execute_attribution(req)
    return result.model_dump()

def test_generate_attribution_dossier_pdf(attribution_sample):
    io_user = MOCK_USERS["io_delhi"]
    pdf_bytes = generate_attribution_dossier_pdf(attribution_sample, io_user)
    
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 2000
    assert pdf_bytes.startswith(b"%PDF-")

def test_generate_bnss_summons_notice(attribution_sample):
    io_user = MOCK_USERS["io_delhi"]
    pdf_bytes = generate_bnss_summons_notice(attribution_sample, io_user)
    
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 2000
    assert pdf_bytes.startswith(b"%PDF-")

def test_generate_bsa_63_4_certificate(attribution_sample):
    io_user = MOCK_USERS["io_delhi"]
    forensic_user = MOCK_USERS["ncfl_expert"]
    pdf_bytes = generate_bsa_63_4_certificate(attribution_sample, io_user, forensic_user)
    
    assert isinstance(pdf_bytes, bytes)
    assert len(pdf_bytes) > 2000
    assert pdf_bytes.startswith(b"%PDF-")
