import { existsSync, readdirSync, readFileSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "node:url";

export interface SkillSummary {
  name: string;
  description: string;
  path: string;
}

const SKILLS_DIR = join(process.cwd(), ".agents/skills");

export function listLocalSkills(): SkillSummary[] {
  if (!existsSync(SKILLS_DIR)) {
    return [];
  }

  const dirs = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const skills: SkillSummary[] = [];

  for (const dir of dirs) {
    const skillPath = join(SKILLS_DIR, dir, "SKILL.md");
    if (existsSync(skillPath)) {
      const content = readFileSync(skillPath, "utf-8");
      const nameMatch = content.match(/name:\s*([^\n\r]+)/);
      const descMatch = content.match(/description:\s*>?-?\s*([^\n\r]+(?:\n\s+[^\n\r]+)*)/);

      skills.push({
        name: nameMatch ? nameMatch[1].trim() : dir,
        description: descMatch ? descMatch[1].replace(/\n\s+/g, " ").trim() : "No description provided.",
        path: skillPath,
      });
    }
  }

  return skills;
}

export function searchSkills(query: string): SkillSummary[] {
  const all = listLocalSkills();
  const q = query.toLowerCase();
  return all.filter(
    (s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q)
  );
}

export function createNewSkill(name: string, description: string): boolean {
  const targetDir = join(SKILLS_DIR, name);
  if (existsSync(targetDir)) {
    console.error(`❌ Skill '${name}' already exists at: ${targetDir}`);
    return false;
  }

  mkdirSync(targetDir, { recursive: true });
  const template = `---
name: ${name}
description: >-
  ${description}
---

# ${name.toUpperCase().replace(/-/g, " ")}

## Overview
Provide clear, step-by-step procedures for this specialized capability.

## Execution Steps
1. Prepare input context.
2. Execute command or script.
3. Verify output against deterministic success criteria.
`;

  writeFileSync(join(targetDir, "SKILL.md"), template, "utf-8");
  console.log(`✅ [Skill Created] Successfully initialized skill '${name}' at: ${join(targetDir, "SKILL.md")}`);
  console.log(`ℹ️ Antigravity will now automatically discover and activate this skill when relevant.`);
  return true;
}

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("skill-finder.ts") ||
  process.argv[1].endsWith("skill-finder.js")
);

if (isMain) {
  const args = process.argv.slice(2);
  const cmd = args[0] || "list";

  if (cmd === "list") {
    console.log("📦 [Skill Registry] Active Local Antigravity Skills:\n");
    const skills = listLocalSkills();
    for (const s of skills) {
      console.log(`• ${s.name}`);
      console.log(`  Description: ${s.description}`);
      console.log(`  Path: ${s.path}\n`);
    }
    console.log(`Total: ${skills.length} skills loaded with zero idle token overhead.`);
  } else if (cmd === "search") {
    const q = args[1] || "";
    console.log(`🔍 [Skill Search] Searching for: "${q}"...\n`);
    const results = searchSkills(q);
    if (results.length === 0) {
      console.log("No matching local skills found. Suggest checking MCP / Open-Source registry.");
    } else {
      for (const r of results) {
        console.log(`• ${r.name}: ${r.description}`);
      }
    }
  } else if (cmd === "create") {
    const name = args[1];
    const desc = args.slice(2).join(" ") || "Specialized skill for workflow optimization.";
    if (!name) {
      console.error("Usage: node --experimental-strip-types scripts/skill-finder.ts create <skill-name> [description]");
      process.exit(1);
    }
    createNewSkill(name, desc);
  } else {
    console.log("Usage: node --experimental-strip-types scripts/skill-finder.ts [list|search|create] [args]");
  }
}
