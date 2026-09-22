# Project CHAKRA — Complete Operations & Execution Commands

> **System**: Centralized High-Confidence Automated Khata Resolution & Attribution System  
> **Target Entity**: Indian Cyber Crime Coordination Centre (I4C), Ministry of Home Affairs (MHA)  
> **Universal Compatibility**: Works standalone on any PC / workstation or from the repository root.

---

## 1. Quickstart: Running from Repository Root

If you have cloned the entire workspace repository (`agent1` or `script`):

```bash
# 1. Install Workspace Dependencies
npm install
python -m pip install -r demo/chakra_mvp/backend/requirements.txt
npm --prefix demo/chakra_mvp/frontend install

# 2. Start Backend API Server (Port 8000)
npm run dev:backend:chakra
# -> Live at http://127.0.0.1:8000 | Interactive OpenAPI Docs: http://127.0.0.1:8000/docs

# 3. Start Frontend Dashboard (Port 5173) - in a separate terminal
npm run dev:frontend:chakra
# -> Live at http://localhost:5173/

# 4. Run Backend Pytest Suite (24 tests)
npm run test:backend:chakra

# 5. Run Headless Playwright Browser E2E Suite (All 5 stages, 5-tier RBAC, 0 console errors)
npm run test:e2e:chakra
```

---

## 2. Standalone: Running Directly Inside `demo/chakra_mvp`

If you are running directly from inside the `demo/chakra_mvp` directory on any machine:

### A. Backend Setup & Execution (`demo/chakra_mvp/backend`)

```bash
cd backend

# 1. Install Python Dependencies
python -m pip install -r requirements.txt

# 2. Run Backend Server (FastAPI on 127.0.0.1:8000)
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

# 3. Run Backend Unit & Adversarial Tests
python -m pytest tests -v
# With code coverage:
python -m pytest tests --cov=app --cov-report=term-missing

# 4. Run Security Vulnerability Audit (Bandit SAST)
python -m pip install bandit
bandit -r app/ -ll -q
```

* **API Endpoints**:
  - Root Health: `GET http://127.0.0.1:8000/`
  - Swagger UI: `http://127.0.0.1:8000/docs`
  - Attribution Trace: `POST http://127.0.0.1:8000/api/v1/attribution/trace`
  - Sweep Forensics: `POST http://127.0.0.1:8000/api/v1/attribution/sweep-detect`
  - Explainable Scorer: `POST http://127.0.0.1:8000/api/v1/evidence/score`
  - SAHYOG Sec 106 Notice: `POST http://127.0.0.1:8000/api/v1/sahyog/notice`
  - BSA 63(4) Evidence Cert: `POST http://127.0.0.1:8000/api/v1/evidence/bsa-certificate/pdf`

---

### B. Frontend Setup & Execution (`demo/chakra_mvp/frontend`)

```bash
cd frontend

# 1. Install Node.js Dependencies
npm install

# 2. Run Frontend Development Server (Vite on http://localhost:5173)
npm run dev

# 3. Typecheck & Build Production Bundle
npm run build

# 4. Preview Production Build
npm run preview
```

* **Dashboard Navigation**:
  - **Stage 1**: Case Intake & NCRP Incident Docket (`CaseIntakePanel.tsx`)
  - **Stage 2**: Multi-Chain Attribution Canvas (`AttributionGraph.tsx`)
  - **Stage 3**: Sweep Forensics & Gas Fueler Lab (`SweepForensicLab.tsx`)
  - **Stage 4**: 4-Pillar Explainable Confidence Scorer (`ScoringMatrixPanel.tsx`)
  - **Stage 5**: SAHYOG Statutory Court Docket (`StatutoryCourtDocket.tsx`)
  - **RBAC Modal**: Sovereign Class-3 DSC Token & 5-Tier Role Switcher (`RbacSwitcherModal.tsx`)

---

## 3. End-to-End Playwright Automated Testing

From the workspace root:

```bash
# Ensure Playwright browser binaries are installed (one-time setup)
npx playwright install chromium

# Run full elemental verification (asserts all 5 stages, modals, sliders, and 0 console errors)
npx playwright test e2e/chakra.spec.ts

# Run in UI debug mode
npx playwright test e2e/chakra.spec.ts --ui
```

---

## 4. Port & Environment Specifications

| Component | Default Host | Default Port | Protocol | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Backend API** | `127.0.0.1` | `8000` | HTTP / JSON | Sovereign localhost binding |
| **Frontend UI** | `localhost` | `5173` | HTTP / Vite HMR | Proxies `/api` to port 8000 |
| **OpenAPI Docs**| `127.0.0.1` | `8000` | Swagger UI | Located at `/docs` |
