"""
Project CHAKRA: Core Configuration & Constants
Sovereign Blockchain Intelligence Engine for MHA I4C SAHYOG
"""

from decimal import Decimal
from pathlib import Path
from pydantic import BaseModel

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseModel):
    PROJECT_NAME: str = "Project CHAKRA Engine"
    VERSION: str = "3.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Forensic Thresholds
    DEFAULT_MAX_HOPS: int = 5
    DEFAULT_DUST_THRESHOLD_USD: Decimal = Decimal("10.0")
    MAX_BEAM_DEGREE: int = 50
    MIN_SWEEP_RATIO: Decimal = Decimal("0.95")  # 95% balance zeroing
    SWEEP_WINDOW_SECONDS: int = 86400           # 24 Hours
    
    # File Paths
    VASP_REGISTRY_PATH: Path = BASE_DIR / "data" / "vasp_registry.json"
    
    # Statutory Defaults
    MHA_NODAL_ORGANIZATION: str = "Indian Cyber Crime Coordination Centre (I4C), MHA"
    BSA_STATUTORY_AUTHORITY: str = "Section 63(4) of Bharatiya Sakshya Adhiniyam, 2023"
    BNSS_STATUTORY_AUTHORITY: str = "Sections 94, 106 & 107 of Bharatiya Nagarik Suraksha Sanhita, 2023"

settings = Settings()
