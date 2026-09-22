# Project BHEDAK (भेदक) — Complete Operations & Execution Commands

> **System**: National Sovereign Dark Web Threat Actor De-Anonymization Platform  
> **Target Entity**: National Technical Research Organisation (NTRO), Government of India  
> **Universal Compatibility**: Works standalone on any PC / workstation or from the repository root.

---

## 1. Quickstart: Running from Repository Root

If you have cloned the entire workspace repository (`agent1` or `script`):

```bash
# 1. Install Workspace Dependencies
npm install
python -m pip install -r demo/bhedak_mvp/backend/requirements.txt
npm --prefix demo/bhedak_mvp/frontend install

# 2. Start Backend API Gateway (Port 8000)
npm run dev:backend
# -> Live at http://127.0.0.1:8000 | Interactive OpenAPI Docs: http://127.0.0.1:8000/docs

# 3. Start Frontend Sovereign Analyst Console (Port 5173 / 5174) - in a separate terminal
npm run dev:frontend
# -> Live at http://localhost:5173/

# 4. Run Backend Pytest Suite (29 tests)
npm run test:backend:bhedak

# 5. Run Headless Playwright Browser E2E Suite
npm run test:e2e:bhedak
```

---

## 2. Standalone: Running Directly Inside `demo/bhedak_mvp`

If you are running directly from inside the `demo/bhedak_mvp` directory on any machine:

### A. Backend Setup & Execution (`demo/bhedak_mvp/backend`)

```bash
cd backend

# 1. Install Python Dependencies
python -m pip install -r requirements.txt

# 2. Run Backend API Server (FastAPI on 127.0.0.1:8000)
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

# 3. Run Backend Unit & Attribution Tests
python -m pytest tests -v
# With code coverage:
python -m pytest tests --cov=. --cov-report=term-missing

# 4. Run Security Vulnerability Audit (Bandit SAST)
python -m pip install bandit
bandit -r . -ll -q
```

* **Core API Endpoints**:
  - Root Health & Case Metadata: `GET http://127.0.0.1:8000/`
  - Swagger UI: `http://127.0.0.1:8000/docs`
  - Engine 1: Tor Recon & Favicon Hash: `POST http://127.0.0.1:8000/api/scan-onion`
  - Engine 2: Attribution Graph & Hops: `GET http://127.0.0.1:8000/api/graph`
  - Engine 3: IndicBERT Stylometry: `POST http://127.0.0.1:8000/api/stylometry`
  - Engine 4: Confidence Score Evaluator: `POST http://127.0.0.1:8000/api/score/evaluate`
  - Statutory Exporter: Section 63 BSA Cert: `GET http://127.0.0.1:8000/api/export/bsa63`
  - Statutory Exporter: OASIS STIX 2.1 Bundle: `GET http://127.0.0.1:8000/api/export/stix`

---

### B. Frontend Setup & Execution (`demo/bhedak_mvp/frontend`)

```bash
cd frontend

# 1. Install Node.js Dependencies
npm install

# 2. Run Frontend Development Server (Vite on http://localhost:5173)
npm run dev

# 3. Typecheck & Build Production Bundle
npm run build

# 4. Run Code Linter (Oxlint)
npm run lint
```

* **Workbench Workflow Tabs**:
  - **Case Overview**: Sovereign Intelligence Briefing & Suspect Profile (`CaseOverview.tsx`)
  - **Engine 1**: Tor Hidden Service Reconnaissance & Apache Leak Scanner (`InfraScanner.tsx`)
  - **Engine 2**: Knowledge Graph & Multi-Hop Blockchain Path (`AttributionGraph.tsx`)
  - **Engine 3**: IndicBERT Multilingual Hinglish Stylometry Lab (`StylometryLab.tsx`)
  - **Engine 4**: Asymmetric Confidence & Mathematical Pillar Scorer (`ConfidenceScorer.tsx`)
  - **Statutory Export**: Court-admissible BSA 2023 Sec 63 PDF & STIX 2.1 JSON (`StatutoryExportModal.tsx`)

---

## 3. End-to-End Playwright Automated Testing

From the workspace root:

```bash
# Ensure Playwright browser binaries are installed
npx playwright install chromium

# Run Bhedak sovereign workbench E2E suite
npx playwright test e2e/bhedak.spec.ts
```

---

## 4. Port & Environment Specifications

| Component | Default Host | Default Port | Protocol | Notes |
| :--- | :--- | :---: | :---: | :--- |
| **Backend API Gateway** | `127.0.0.1` | `8000` | HTTP / JSON | Sovereign localhost binding |
| **Frontend UI Console** | `localhost` | `5173` | HTTP / Vite HMR | Proxies `/api` to port 8000 |
| **OpenAPI Docs** | `127.0.0.1` | `8000` | Swagger UI | Located at `/docs` |
