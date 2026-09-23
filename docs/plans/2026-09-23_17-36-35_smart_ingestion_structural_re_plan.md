# Smart Ingestion & Structural Re-Ordering of Agentic Workflow Template

Synchronize all workflow updates, architectural directives, directory reorganizations, and developer tooling from [Deepak-Sharma-2006/script](https://github.com/Deepak-Sharma-2006/script.git) (`script-origin/main`) into the local repository. 

This plan ensures **zero loss of local project files** (`demo/chakra_mvp`, `demo/bhedak_mvp`, `specs/presentations/`, `docs/sih_solutions/`, local investigative plans/walkthroughs/audits, and custom E2E assertions) while adopting the clean, modern directory hierarchy and new platform capabilities.

---

## User Review Required

> [!IMPORTANT]
> **Zero Local File Deletion Guarantee**:
> `script.git` is an abstract, clean workflow template that does not contain application code (`demo/`). We will **NOT** run any destructive git commands (`git reset --hard` or blanket checkout) that could wipe out local project files. All local applications, presentations, and domain artifacts are explicitly protected.

> [!NOTE]
> **Directory Re-ordering & Human-Naming Migrations**:
> 1. `e2e/` $\rightarrow$ `browser_tests/`: In alignment with Directive 14 (Human Naming Standard), all Playwright specs move to `browser_tests/`. Our local custom assertions for Project CHAKRA (such as the 7-bug fixes and mainnet ledger tests) will be fully retained inside `browser_tests/chakra.spec.ts`.
> 2. `docs/adrs/` $\rightarrow$ `docs/decisions/`: ADR documents move into the standard human-readable decisions catalog, and `docs/decisions/INDEX.md` is updated.
> 3. `docs/rfcs/` $\rightarrow$ `docs/specifications/`: Formal RFCs and schema contracts move into the standard specifications catalog, and `docs/specifications/INDEX.md` is updated.
> 4. `scripts/pen-test-runner.ts` $\rightarrow$ `scripts/security-audit-runner.ts`: Renamed for clarity, with backwards-compatible alias `npm run pentest` intact.
> 5. `implementation_setup_guide.md` $\rightarrow$ `docs/architecture/production_architecture_blueprint.md`: Moved to `docs/architecture/` to satisfy the Root Compactness Standard ($\le 12$ essential root files).
> 6. `UNIVERSAL_AGENT_INSTRUCTIONS.md`: Added at the root for single-file instruction compilation across Claude Code, Cursor, Windsurf, Copilot, and Codex.

---

## Proposed Structural Changes

### 1. Directory Re-ordering & Folder Renames

#### [MOVE] `e2e/` $\rightarrow$ `browser_tests/`
- Move [`e2e/chakra.spec.ts`](file:///e2e/chakra.spec.ts) and [`e2e/bhedak.spec.ts`](file:///e2e/bhedak.spec.ts) to `browser_tests/`.
- Preserve our rich local assertions (including linear workflow verification and live mainnet wallet grounding `TJQQLsfYvwK1gJyET4C7hvPdJ2YyNcAUbL`).
- Update [`playwright.config.ts`](file:///playwright.config.ts) `testDir` to `./browser_tests`.

#### [MOVE] `docs/adrs/` $\rightarrow$ `docs/decisions/`
- Move all files from [`docs/adrs/`](file:///docs/adrs/) to [`docs/decisions/`](file:///docs/decisions/).
- Pull new template decision files: `2026-09-23_db_migration_adr.md`, `2026-09-23_db_migration_decision.md`.
- Remove legacy `docs/adrs/` directory.

#### [MOVE] `docs/rfcs/` $\rightarrow$ `docs/specifications/`
- Move all files from [`docs/rfcs/`](file:///docs/rfcs/) to [`docs/specifications/`](file:///docs/specifications/).
- Pull new template specification files: `2026-09-23_audit_probe_specification.md`, `2026-09-23_db_migration_specification.md`, etc.
- Remove legacy `docs/rfcs/` directory.

#### [MOVE] `scripts/pen-test-runner.ts` $\rightarrow$ `scripts/security-audit-runner.ts`
- Replace `scripts/pen-test-runner.ts` with [`scripts/security-audit-runner.ts`](file:///scripts/security-audit-runner.ts).
- Provide backwards-compatible npm alias in `package.json`.

#### [MOVE] `implementation_setup_guide.md` $\rightarrow$ `docs/architecture/production_architecture_blueprint.md`
- Relocate and enrich architectural guide in [`docs/architecture/production_architecture_blueprint.md`](file:///docs/architecture/production_architecture_blueprint.md) with Brownfield Onboarding, Team Mesh synchronization, Universal Harness Compiler, and 4-Layer Fail-Closed Compliance.
- Remove root copy to enforce root compactness.

---

### 2. New Workflow Scripts & Tooling (from `script-origin/main`)

#### [NEW] [`UNIVERSAL_AGENT_INSTRUCTIONS.md`](file:///UNIVERSAL_AGENT_INSTRUCTIONS.md)
Single-source-of-truth unified instructions file for all external agent harnesses.

#### [NEW] [`scripts/context-meter.ts`](file:///scripts/context-meter.ts)
Real-time active conversation context telemetry, measuring exact tokens, saturation percentage, and remaining headroom before auto-compaction. Exposed via `npm run context:check`.

#### [NEW] [`scripts/index-reconciler.ts`](file:///scripts/index-reconciler.ts)
Automated living index reconciler that builds sorted, deduplicated `INDEX.md` markdown tables across all 6 document classes without merge conflicts. Exposed via `npm run docs:reconcile`.

#### [NEW] [`scripts/project-scale-detector.ts`](file:///scripts/project-scale-detector.ts)
Dual-scope codebase scale analyzer (application domain vs workflow harness vs documentation) with autonomous scoping recommendations (`--full` vs `--diff`). Exposed via `npm run project:scale`.

#### [NEW] [`scripts/orchestrator/realtime_docs_watcher.py`](file:///scripts/orchestrator/realtime_docs_watcher.py)
Autonomous real-time watcher daemon with SHA-256 change detection and PID lifecycle management (`npm run docs:start`, `npm run docs:status`, `npm run docs:stop`).

#### [NEW] [`scripts/lan-sync-server.ts`](file:///scripts/lan-sync-server.ts)
Zero-dependency local LAN sync server (port 4040) for multi-operator hackathons without cloud dependency. Exposed via `npm run lan:start`.

#### [NEW] [`scripts/mcp-server.ts`](file:///scripts/mcp-server.ts)
Standard Model Context Protocol (MCP) server exposing orchestrator tools over stdio for Claude Desktop, Cursor, and Windsurf. Exposed via `npm run mcp:start`.

#### [NEW] [`scripts/universal-harness-sync.ts`](file:///scripts/universal-harness-sync.ts)
Automated compiler transforming `AGENTS.md` into `CLAUDE.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, and `CODEX.md`. Exposed via `npm run harness:sync`.

---

### 3. Upgraded Workflow Components & Core Directives

#### [MODIFY] [`package.json`](file:///package.json)
- Add new scripts: `verify:plan`, `docs:sync`, `docs:watch`, `docs:start`, `docs:stop`, `docs:status`, `docs:reconcile`, `docs:indexes`, `context:check`, `context:status`, `project:scale`, `mode:team`, `mode:mesh`, `team:status`, `harness:sync`, `lan:start`, `mcp:start`, `audit:project`, `continue:project`, `audit:security`.
- Update test runner targets: `test:unit` to include `tests/team-mesh-sync.test.ts` and `tests/workflow-upgrades.test.ts`.
- Update browser test scripts to point to `browser_tests/`.

#### [MODIFY] [`AGENTS.md`](file:///AGENTS.md) and [`GEMINI.md`](file:///GEMINI.md)
- Directive 6: Incorporate Zero-LaTeX Invariant (clean Unicode symbols: $\ge, \le, \times, \ne, \rightarrow$).
- Directive 13: Twin-Documentation Sync Invariant (`README.md` and `SYSTEM_COMMANDS.md`).
- Directive 14: Mandatory Human-Naming Invariant & Root Compactness Standard ($\le 12$ files).
- Directive 15: Mandatory Real-Time Brain Artifact-to-Docs Synchronous Mirroring (with second-level timestamps).

#### [MODIFY] [`README.md`](file:///README.md) and [`SYSTEM_COMMANDS.md`](file:///SYSTEM_COMMANDS.md)
- Synchronize documentation with all new CLI commands, Team Mesh mode, Brownfield ingestion, and scale detection.

#### [MODIFY] [`scripts/orchestrator/task_dispatcher.py`](file:///scripts/orchestrator/task_dispatcher.py), [`squad_orchestrator.py`](file:///scripts/orchestrator/squad_orchestrator.py), [`spec_sync.py`](file:///scripts/orchestrator/spec_sync.py)
- Incorporate support for brownfield auditing (`--task audit`), in-progress continuation (`--task continue`), deep research triangulation modes (EXPLORATION vs IMPACT), and zero-process brain mirroring (`--sync-brain`).

#### [NEW] Tests: [`tests/team-mesh-sync.test.ts`](file:///tests/team-mesh-sync.test.ts) & [`tests/workflow-upgrades.test.ts`](file:///tests/workflow-upgrades.test.ts)
- Add unit test verification for zero-process documentation hooks, live context metering, living index reconciliation, and codebase scale detection.

#### [MODIFY] [`.gitignore`](file:///gitignore) & [`.gitattributes`](file:///gitattributes)
- Add custom merge driver attribute for `docs/**/INDEX.md`.
- Update ignores for ephemeral test runs and `.vscode/`.

---

### 4. Catalog Reconciliation & Preserved Local Documents

- Execute [`npm run docs:reconcile`](file:///scripts/index-reconciler.ts) to rebuild and deduplicate living catalogs in `docs/plans/INDEX.md`, `docs/walkthroughs/INDEX.md`, `docs/audits/INDEX.md`, `docs/decisions/INDEX.md`, `docs/research/INDEX.md`, and `docs/specifications/INDEX.md`.
- All local plans (`2026-09-21_*`, `2026-09-22_*`), local walkthroughs, and local audits (`chakra_*`, `bhedak_*`) will be retained and cleanly cataloged alongside template entries.

---

## Verification Plan

### Automated Tests
1. **Unit & Workflow Suite**:
   ```bash
   npm run test:unit
   ```
   *Expected: All tests pass (`tests/bootstrap.test.ts`, `tests/team-mesh-sync.test.ts`, `tests/workflow-upgrades.test.ts`).*

2. **Context Window & Compaction Headroom Check**:
   ```bash
   npm run context:check
   ```
   *Expected: Outputs model ID `gemini-3.8-flash-high`, active context tokens, saturation %, and remaining headroom.*

3. **Project Scale Detection**:
   ```bash
   npm run project:scale
   ```
   *Expected: Evaluates LOC across application domain, harness, and documentation, recommending execution mode.*

4. **Living Catalog Index Reconciliation**:
   ```bash
   npm run docs:reconcile
   ```
   *Expected: Scans all 6 documentation directories and creates clean markdown index tables.*

5. **Python Orchestrator & Research Triangulator Tests**:
   ```bash
   python -m unittest tests/test_squad_orchestrator.py
   ```
   *Expected: Passes all tests including new research exploration, impact, and trade-off ADR tests.*

6. **Browser Tests Path Verification**:
   ```bash
   npx playwright test --list
   ```
   *Expected: Confirms all tests under `browser_tests/` (both CHAKRA and BHEDAK) are recognized.*

7. **Zero-Secret Pre-Commit Shield**:
   ```bash
   npm run check:secrets
   ```
   *Expected: Exit code 0, confirming zero credentials in any workflow file.*

### Manual Verification
- Verify `git status` shows zero missing local files from `demo/` or `specs/presentations/`.
- Verify root directory has $\le 12$ files and clean human names.
