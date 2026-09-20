"""
Project CHAKRA: Statutory Evidence & Admissibility Endpoints
Provides real-time PDF generation for BNSS Summons, BSA 63(4) Certificates,
Executive Attribution Dossiers, and Merkle cryptographic audit proofs.
"""

from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Response, status
from pydantic import BaseModel

from app.core.security import AuthUser, UserRole, MOCK_USERS
from app.api.deps import get_current_user
from app.models.schemas import AttributionResponse
from app.reports.pdf_generator import (
    generate_attribution_dossier_pdf,
    generate_bnss_summons_notice,
    generate_bsa_63_4_certificate
)
from app.core.merkle import MerkleEvidenceTree

router = APIRouter(prefix="/evidence", tags=["Statutory Evidence & PDF Reports"])

class MerkleVerifyRequest(BaseModel):
    merkle_root: str
    target_leaf_hash: str
    all_leaf_hashes: List[str]

@router.post("/dossier/pdf")
def download_attribution_dossier_pdf(
    attribution: AttributionResponse,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Renders and returns the official Executive Attribution Dossier as a PDF binary stream.
    Includes case metadata, 4-pillar score breakdown, full transaction hop table,
    and SHA-256 Merkle chain-of-custody seal.
    """
    try:
        pdf_bytes = generate_attribution_dossier_pdf(attribution.model_dump(), current_user)
        filename = f"CHAKRA_Dossier_{attribution.sahyog_case_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate attribution dossier PDF: {str(e)}"
        )

@router.post("/bnss-summons/pdf")
def download_bnss_summons_pdf(
    attribution: AttributionResponse,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Renders and returns the statutory Summons under Section 94 BNSS &
    Urgent 24-Hour Debit Freeze Directive under Section 106/107 BNSS, 2023.
    """
    try:
        pdf_bytes = generate_bnss_summons_notice(attribution.model_dump(), current_user)
        filename = f"BNSS_Notice_{attribution.sahyog_case_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate BNSS statutory summons PDF: {str(e)}"
        )

@router.post("/bsa-certificate/pdf")
def download_bsa_certificate_pdf(
    attribution: AttributionResponse,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    Renders and returns the Certificate under Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023
    (formerly Section 65B Indian Evidence Act) with dual signatures (IO Part A + NCFL Part B).
    """
    try:
        forensic_user = MOCK_USERS["ncfl_expert"]
        pdf_bytes = generate_bsa_63_4_certificate(attribution.model_dump(), current_user, forensic_user)
        filename = f"BSA_Sec63_Certificate_{attribution.sahyog_case_id}.pdf"
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename={filename}"
            }
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate BSA Section 63(4) certificate PDF: {str(e)}"
        )

@router.post("/merkle/verify")
def verify_merkle_leaf_proof(
    req: MerkleVerifyRequest,
    current_user: AuthUser = Depends(get_current_user)
):
    """
    CRYPTOGRAPHIC INTEGRITY AUDIT:
    Verifies that a specific leaf transaction hash belongs to the declared Merkle Root.
    """
    tree = MerkleEvidenceTree(req.all_leaf_hashes)
    computed_root = tree.get_merkle_root()
    proof = tree.get_proof(req.target_leaf_hash)
    is_valid = tree.verify_proof(req.target_leaf_hash, proof, req.merkle_root)

    return {
        "target_leaf_hash": req.target_leaf_hash,
        "declared_merkle_root": req.merkle_root,
        "recomputed_merkle_root": computed_root,
        "is_leaf_valid": is_valid,
        "root_match": computed_root == req.merkle_root,
        "proof_audit_steps": len(proof)
    }

@router.get("/rbac/users")
def get_operational_rbac_users():
    """Returns available operational mock users for UI testing and 5-tier evaluation."""
    return [
        {
            "key": k,
            "user_id": u.user_id,
            "name": u.name,
            "designation": u.designation,
            "station": u.police_station,
            "state_ut": u.state_ut,
            "role": u.role.value,
            "has_dsc_token": u.has_dsc_token
        }
        for k, u in MOCK_USERS.items()
    ]
