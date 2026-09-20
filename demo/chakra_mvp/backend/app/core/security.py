"""
Project CHAKRA: Security, Authentication & 5-Tier Operational RBAC
Governs operational access across MHA I4C, State Cyber Cells, and VASP desks.
"""

from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel

class UserRole(str, Enum):
    INVESTIGATING_OFFICER = "INVESTIGATING_OFFICER"    # Sub-Inspector / Inspector at Cyber Police Station
    SUPERVISORY_OFFICER = "SUPERVISORY_OFFICER"        # DySP / ACP / SP (Sec 78 IT Act Sanctioning Auth)
    FORENSIC_EXAMINER = "FORENSIC_EXAMINER"            # NCFL / State FSL Digital Evidence Certifier
    THREAT_ANALYST = "THREAT_ANALYST"                  # I4C TAU / State Command Cross-Case Intelligence
    VASP_NODAL_OFFICER = "VASP_NODAL_OFFICER"          # External Exchange Nodal Desk (CoinDCX, Binance, etc.)

class AuthUser(BaseModel):
    user_id: str
    name: str
    designation: str
    police_station: str
    state_ut: str
    gov_email: str
    role: UserRole
    has_dsc_token: bool = False  # Class-3 DSC Token present for Section 106/107 BNSS signing

# Operational Mock Users for Demo Evaluation
MOCK_USERS: Dict[str, AuthUser] = {
    "io_delhi": AuthUser(
        user_id="IND-POL-DEL-4012",
        name="Insp. Rajesh Kumar",
        designation="Inspector / Station House Officer",
        police_station="Cyber Crime Police Station, Rohini",
        state_ut="Delhi",
        gov_email="rajesh.kumar@delhipolice.gov.in",
        role=UserRole.INVESTIGATING_OFFICER,
        has_dsc_token=True
    ),
    "dysp_blr": AuthUser(
        user_id="IND-POL-KA-8819",
        name="Vikramaditya Rao",
        designation="Deputy Superintendent of Police (DySP)",
        police_station="CID Cyber Crime Division",
        state_ut="Karnataka",
        gov_email="dysp.cyber@ksp.gov.in",
        role=UserRole.SUPERVISORY_OFFICER,
        has_dsc_token=True
    ),
    "ncfl_expert": AuthUser(
        user_id="IND-I4C-NCFL-014",
        name="Dr. Sunita Deshmukh",
        designation="Chief Digital Forensic Examiner",
        police_station="National Cybercrime Forensic Lab, I4C",
        state_ut="National (MHA)",
        gov_email="forensics.ncfl@i4c.gov.in",
        role=UserRole.FORENSIC_EXAMINER,
        has_dsc_token=True
    ),
    "tau_analyst": AuthUser(
        user_id="IND-I4C-TAU-099",
        name="Amitabh Sen",
        designation="Senior Cyber Threat Analyst",
        police_station="Threat Analytics Unit (TAU), I4C",
        state_ut="National (MHA)",
        gov_email="tau.analyst@i4c.gov.in",
        role=UserRole.THREAT_ANALYST,
        has_dsc_token=False
    ),
    "vasp_binance": AuthUser(
        user_id="VASP-BIN-IND-01",
        name="Binance Legal Interception Desk",
        designation="Nodal Compliance Officer (India)",
        police_station="Nest Services Limited / FIU-IND Reg #001",
        state_ut="Offshore / Global",
        gov_email="case-inquiry@binance.com",
        role=UserRole.VASP_NODAL_OFFICER,
        has_dsc_token=True
    )
}

def get_current_user(role_key: Optional[str] = "io_delhi") -> AuthUser:
    return MOCK_USERS.get(role_key or "io_delhi", MOCK_USERS["io_delhi"])
