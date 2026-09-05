---
name: skill-finder
description: >-
  Searches, inspects, and registers specialized skills on-demand without context window bloat.
  Use this skill when the current task requires specialized tooling, third-party runbooks, or when
  evaluating whether an optimal skill already exists in the workspace.
---

# Dynamic Skill Finder & On-Demand Registry

This skill enables progressive, zero-waste skill discovery. Rather than injecting hundreds of open-source skill definitions into every prompt, skills are discovered on-demand via targeted queries.

## Commands

- **List All Installed Skills**:
  ```bash
  npm run skill:list
  ```
- **Search Skills by Keyword**:
  ```bash
  npm run skill:search <keyword>
  ```
- **Scaffold New Specialized Skill**:
  ```bash
  node --experimental-strip-types scripts/skill-finder.ts create <skill-name> "Clear description of when to use"
  ```

## Anti-Token-Bloat Principle
Never dump raw registries into the prompt context. Only inspect skills matching the active user intent.
