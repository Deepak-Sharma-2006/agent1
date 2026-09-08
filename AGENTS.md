# Antigravity Workspace Invariants & Operational Directives

> **Scope**: Applied automatically to all agent invocations (both Antigravity IDE and Antigravity CLI `agy`) across this entire workspace.

---

## 1. Zero-Hallucination & Dynamic Dependency Policy

1. **Dynamic Dependency Architecture & Zero Ghost Packages**:
   - Dependencies are dynamic and permitted if they provide a demonstrable, measurable advantage over standard library implementations (e.g., performance, robust schema parsing, standardized protocol handling).
   - Before introducing any new dependency, you MUST inspect `package.json`. If a new package is required, it must be explicitly declared in `package.json` with an exact pinned version.
   - NEVER invent, assume, or import an npm package or library that is not explicitly declared in `package.json`.
   - The Anti-Hallucination Shield (`npm run check:hallucinations`) strictly scans AST imports across the entire codebase to reject undeclared packages.
2. **Strict Symbol & File Grounding**:
   - Every citation of a file, type, function, or API must be grounded in verified project evidence.
   - You MUST cite clickable markdown links using the `file://` scheme with forward slashes: `[SymbolName](file:///path/to/file.ts#L15-L30)`.
   - If context is missing or ambiguous, you MUST state: `"INSUFFICIENT CONTEXT DETECTED: Unable to ground symbol in codebase."` DO NOT guess, fabricate, or improvise missing APIs.
3. **Empirical Execution Grounding**:
   - NEVER assert that "tests pass", "build succeeds", or "vulnerabilities are fixed" based on mental simulation.
   - You must execute the relevant shell command (`npm test`, `tsc --noEmit`, or test runner) and verify an exit code of `0`.

---

## 2. Multi-Operator Distributed Concurrency & Lease Locks

1. **Check Locks Before Mutation**:
   - Before modifying any source file in a functional domain (e.g., `src/auth/*`, `src/database/*`), inspect `.agents/state/locks/` or execute `npx ts-node scripts/lock-manager.ts status`.
   - If an active, unexpired lease lock is held by another operator (e.g., Node Alpha or Node Beta), you MUST abort file mutations and alert the human operator.
2. **Phase Alternation Respect**:
   - Respect the current phase assignment (Alpha = Primary Builder; Beta = Adversarial Auditor). If operating on a machine in the Beta role for the current phase, restrict actions to review, penetration testing, failure path audit, and test execution—do not write feature code without an explicit role handoff.

---

## 3. Human Operator Code Comprehension Protocol (Part 7 Mandate)

1. **Mandatory Phase Dossier Generation**:
   - At the completion of each feature phase, before opening a PR or requesting merge, the agent MUST generate a structured comprehension dossier in `docs/dossiers/phase-<X>-<domain>.md`.
2. **The 6-Technique Structure**:
   - Technique 1: The Human Mental Model (Plain-language purpose & boundary).
   - Technique 2: Visual Code Flow (ASCII / Mermaid call graph).
   - Technique 3: Variable Lifecycle Trace (Birth $\rightarrow$ Transformation $\rightarrow$ Egress).
   - Technique 4: Non-Blocking Noise Filtering (Bypassing telemetry/logging on Pass 1).
   - Technique 5: Audit Exactly One Failure Path (Account enumeration & timing differential checks).
   - Technique 6: 1-Sentence Feynman Compression Test.

---

## 4. Token Economy & Adaptive Multi-Model Optimizer

1. **Progressive Disclosure & Skill Search**:
   - Do NOT load massive raw documentation or all skills into prompt context. Search skills dynamically via `npm run skill:search` or `scripts/skill-finder.ts`. Read only relevant sections using bounded file reading (`StartLine`/`EndLine`).
2. **Slice-Targeted File Reading**:
   - Avoid reading files $>150$ lines in their entirety. Use `grep_search` to locate target line numbers, then view the specific slice.
3. **Hard Loop Limits & Model Saturation**:
   - Max 5 auto-correction loops per task.
   - Respect model-specific context thresholds via `npm run token:budget`. If context saturation exceeds 70%, trigger context reduction, suppress verbose command outputs, and offload facts to Memory Vault.
4. **Token Budget Ceiling**:
   - Hard cap of 250,000 tokens per feature phase. If approaching warning thresholds, alert operator and prioritize context compression.

---

## 5. Code Quality & Security Standards

1. **Strict TypeScript**:
   - `strict: true` is enforced. Zero usage of `any`. Explicit interfaces/types for all function signatures.
2. **Deterministic TDD**:
   - Every new service, utility, or business logic component must have a corresponding test file (`*.test.ts`) using native Node test runner or Vitest.
3. **Millee 20-Point Security Hardening**:
   - Enforce row-level security (RLS), parameterized queries, constant-time comparisons (`crypto.timingSafeEqual`), and Argon2id password hashing.

---

## 6. Durable Context Persistence & Memory Vault

1. **Memory as Source of Truth**:
   - Cross-phase decisions, architectural rationales, and critical bug resolutions must be persisted to `.agents/memory/` using `npm run memory:save`.
   - Before starting complex tasks, recall relevant past learnings via `npm run memory:search`.
   - Phase handoffs must record a structured handoff document in `.agents/memory/team/handoffs/`.

---

## 7. Strict Zero-Secret Invariant & Pre-Commit Shield

1. **Absolute Zero Secrets Policy**:
   - Committing, staging, or pushing any secret, API key, access token, private key, or credential of any kind (including AWS, Stripe, GitHub, OpenAI, Anthropic, Google, Slack, RSA/SSH private keys, Bearer tokens, and `X-API-Key` values) to any git branch or repository is strictly forbidden.
   - Documentation, examples, and tests must EXCLUSIVELY use safe non-tokenized placeholders (e.g. `<YOUR_API_KEY>`, `YOUR_STRIPE_KEY`, `your-api-key-here`). NEVER use pseudo-realistic mock tokens (e.g. `sk_live_...`, `sk_test_...`) that trigger GitGuardian, Trufflehog, or GitHub Secret Scanning.
2. **Automated Shield & Hook Enforcement**:
   - All commits are gated by `.git/hooks/pre-commit`, which automatically executes `npm run check:secrets:staged`. Commits are rejected with exit code `1` if any secret or suspicious token pattern is detected.
   - The Zero-Secret Shield (`npm run check:secrets`) is permanently embedded as Layer 1 of the Adversarial Beta Audit (`npm run audit:beta`) and Probe 7/7 of the System Readiness Probe (`npm run readiness`).
   - Bypassing pre-commit hooks via `--no-verify` is strictly prohibited.

