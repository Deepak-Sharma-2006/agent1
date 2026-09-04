# Antigravity Workspace Invariants & Operational Directives

> **Scope**: Applied automatically to all agent invocations (both Antigravity IDE and Antigravity CLI `agy`) across this entire workspace.

---

## 1. Zero-Hallucination & Grounding Shield

1. **Zero Ghost Packages**:
   - NEVER invent, assume, or import an npm package or library that is not explicitly declared in the root `package.json`.
   - Before introducing any new dependency, you MUST inspect `package.json`. If a new package is strictly required, you must run the verification check, confirm its existence and security profile, and request explicit operator authorization before installation.
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

## 4. Token Economy & Budgeting Brakes

1. **Progressive Disclosure**:
   - Do NOT load massive raw documentation files into prompt context. Read only relevant sections using bounded file reading (`StartLine`/`EndLine`).
2. **Slice-Targeted File Reading**:
   - Avoid reading files $>150$ lines in their entirety. Use `grep_search` to locate target line numbers, then view the specific slice.
3. **Hard Loop Limits**:
   - Max 5 auto-correction loops per task. If an error persists after 5 attempts, halt and escalate to the human operator.
4. **Token Budget Ceiling**:
   - Hard cap of 250,000 tokens per feature phase. If approaching 80% of budget, alert operator and prioritize compression.

---

## 5. Code Quality & Security Standards

1. **Strict TypeScript**:
   - `strict: true` is enforced. Zero usage of `any`. Explicit interfaces/types for all function signatures.
2. **Deterministic TDD**:
   - Every new service, utility, or business logic component must have a corresponding test file (`*.test.ts`) using Vitest or Jest.
3. **Millee 20-Point Security Hardening**:
   - Enforce row-level security (RLS), parameterized queries, constant-time comparisons (`crypto.timingSafeEqual`), and Argon2id password hashing.
