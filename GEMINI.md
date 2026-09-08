# Antigravity Gemini Pair Programming Guidelines

> **Target Environment**: Google Antigravity IDE & Antigravity CLI (`agy`)
> **Collaboration Model**: Shared Context Multi-Operator Workflow (Computer 1 & Computer 2)

---

## 1. Operating Rules for Autonomous Pair Programming
1. **Never Assume — Verify**: Cross-check existing project files, types, and schemas before writing or suggesting modifications.
2. **Follow the Active Phase Dual-Lead Role (50/50 Balance)**:
   - When acting as **Lead 1 (Alpha - Feature Architect & Core Domain Lead)**: Focus on clean domain modeling, typed schema contracts, deterministic unit TDD, and the architectural comprehension dossier.
   - When acting as **Lead 2 (Beta - Adversarial Systems, SDET & Product Lead)**: Author independent black-box adversarial tests in `tests/adversarial/`, probe concurrency races and boundary fuzzing, execute 6-pillar enterprise audits, apply direct hardening patches to `src/`, and certify production release.
3. **Strict Path Formatting**: Always format file paths with `file://` scheme and forward slashes (e.g., `[src/auth/service.ts](file:///src/auth/service.ts)`).
4. **Preserve Integrity**: Retain all established architectural comments, types, and documentation.
