"""
Project CHAKRA: Main FastAPI Application Entry Point
Sovereign Blockchain Intelligence Engine for Automated VASP Attribution under MHA I4C SAHYOG.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import time

from app.core.config import settings
from app.api.routes_attribution import router as attribution_router
from app.api.routes_sahyog import router as sahyog_router
from app.api.routes_evidence import router as evidence_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Project CHAKRA Sovereign API: Automated multi-chain blockchain attribution, "
        "deposit-to-sweep heuristics, dynamic jury injection, MHA SAHYOG integration, "
        "and court-admissible BSA 2023 / BNSS 2023 statutory reporting."
    ),
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware for modern frontend support (Vite, Next.js, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request latency measurement middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = (time.perf_counter() - start_time) * 1000.0
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response

# Include Sub-Routers
app.include_router(attribution_router, prefix=settings.API_V1_STR)
app.include_router(sahyog_router, prefix=settings.API_V1_STR)
app.include_router(evidence_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System Health"])
def health_check():
    return {
        "status": "HEALTHY",
        "system": "Project CHAKRA (MHA I4C)",
        "version": settings.VERSION,
        "sovereign_runtime": "Pure Python + Degree-Bounded Beam Search (Zero Foreign SaaS Dependencies)",
        "statutory_compliance": [
            "Bharatiya Sakshya Adhiniyam, 2023 (Section 63(4))",
            "Bharatiya Nagarik Suraksha Sanhita, 2023 (Sections 94, 106, 107)",
            "Information Technology Act, 2000 (Sections 43, 66D, 69, 78)"
        ]
    }

@app.get("/", tags=["Root"])
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "documentation": "/docs",
        "endpoints": {
            "attribution_trace": f"{settings.API_V1_STR}/attribution/trace",
            "custom_jury_inject": f"{settings.API_V1_STR}/attribution/inject",
            "scenarios": f"{settings.API_V1_STR}/attribution/scenarios",
            "sahyog_notice_gen": f"{settings.API_V1_STR}/sahyog/notices/generate",
            "sahyog_notice_dispatch": f"{settings.API_V1_STR}/sahyog/notices/dispatch",
            "dossier_pdf": f"{settings.API_V1_STR}/evidence/dossier/pdf",
            "bnss_summons_pdf": f"{settings.API_V1_STR}/evidence/bnss-summons/pdf",
            "bsa_certificate_pdf": f"{settings.API_V1_STR}/evidence/bsa-certificate/pdf"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)

