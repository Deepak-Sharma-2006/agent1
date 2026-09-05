import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";

export interface AuditLayerResult {
  layer: number;
  name: string;
  passed: boolean;
  details: string;
}

export function runBetaAudit(): boolean {
  console.log(`
================================================================================
           BETA AUDITOR ADVERSARIAL VERIFICATION BATTERY (5 LAYERS)
================================================================================`);

  const results: AuditLayerResult[] = [];

  // Layer 1: Anti-Hallucination & Ghost Package Check
  console.log("\n▶ [Layer 1/5] Anti-Hallucination Shield (Ghost Package AST Scan)...");
  try {
    execSync("node --experimental-strip-types scripts/anti-hallucination-checker.ts scripts src tests", { stdio: "inherit" });
    results.push({ layer: 1, name: "Anti-Hallucination Shield", passed: true, details: "Zero ghost packages detected" });
  } catch {
    results.push({ layer: 1, name: "Anti-Hallucination Shield", passed: false, details: "Undeclared dependencies found" });
  }

  // Layer 2: Strict TypeScript Compilation
  console.log("\n▶ [Layer 2/5] Strict TypeScript Compilation (tsc --noEmit)...");
  try {
    execSync("npx tsc --noEmit", { stdio: "inherit" });
    results.push({ layer: 2, name: "Strict TypeScript Check", passed: true, details: "0 errors, strict mode enforced" });
  } catch {
    results.push({ layer: 2, name: "Strict TypeScript Check", passed: false, details: "TypeScript type-checking errors detected" });
  }

  // Layer 3: Behavioral Contract Harness (4/4 Golden Evals)
  console.log("\n▶ [Layer 3/5] Behavioral Contract Harness (4/4 Golden Evals)...");
  try {
    execSync("node --experimental-strip-types .agents/harness/eval-runner.ts", { stdio: "inherit" });
    results.push({ layer: 3, name: "Behavioral Harness Evals", passed: true, details: "4/4 test contracts passed" });
  } catch {
    results.push({ layer: 3, name: "Behavioral Harness Evals", passed: false, details: "Harness contract failure" });
  }

  // Layer 4: Strix AI Dynamic DAST Pentest
  console.log("\n▶ [Layer 4/5] Strix/Styx AI Dynamic DAST Pentest...");
  try {
    execSync("node --experimental-strip-types scripts/pen-test-runner.ts", { stdio: "inherit" });
    results.push({ layer: 4, name: "Strix AI DAST Pentest", passed: true, details: "Zero unverified exploits detected" });
  } catch {
    results.push({ layer: 4, name: "Strix AI DAST Pentest", passed: false, details: "Penetration test exploit detected" });
  }

  // Layer 5: Cognitive Comprehension Dossier Validation (6 Techniques)
  console.log("\n▶ [Layer 5/5] Cognitive Comprehension Dossier Validation (6 Techniques)...");
  const dossierDir = join(process.cwd(), "docs/dossiers");
  let dossierOk = false;
  let dossierDetails = "No dossier found";

  if (existsSync(dossierDir)) {
    const files = readdirSync(dossierDir).filter((f) => f.endsWith(".md"));
    if (files.length > 0) {
      let allTechniquesPresent = true;
      const requiredTechniques = [
        "Technique 1",
        "Technique 2",
        "Technique 3",
        "Technique 4",
        "Technique 5",
        "Technique 6",
      ];

      for (const file of files) {
        const content = readFileSync(join(dossierDir, file), "utf-8");
        for (const t of requiredTechniques) {
          if (!content.includes(t)) {
            allTechniquesPresent = false;
          }
        }
      }

      if (allTechniquesPresent) {
        dossierOk = true;
        dossierDetails = `Validated ${files.length} dossier(s) with all 6 required cognitive techniques`;
        console.log(`✅ [Dossiers Validated] Found ${files.length} compliant cognitive comprehension dossier(s).`);
      } else {
        dossierDetails = "Dossier missing one or more of the 6 mandatory techniques";
        console.error("❌ [Dossier Incomplete] Missing mandatory cognitive reading techniques.");
      }
    }
  }

  results.push({ layer: 5, name: "Cognitive Dossier Verification", passed: dossierOk, details: dossierDetails });

  // Summary Scorecard
  console.log(`
================================================================================
                  BETA AUDIT SCORECARD & CERTIFICATION
================================================================================`);

  let allPassed = true;
  for (const r of results) {
    const icon = r.passed ? "✅" : "❌";
    console.log(`  [Layer ${r.layer}] ${r.name.padEnd(35)} : ${icon} ${r.details}`);
    if (!r.passed) allPassed = false;
  }

  console.log("================================================================================");

  if (allPassed) {
    console.log(`\n🎉 [Beta Audit Complete] 5/5 Verification Layers Passed! Codebase is certified for release.\n`);
  } else {
    console.error(`\n🚨 [Beta Audit Failed] One or more verification layers failed. Resolve before merging.\n`);
  }

  return allPassed;
}

import { fileURLToPath } from "node:url";

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("beta-audit-runner.ts") ||
  process.argv[1].endsWith("beta-audit-runner.js")
);

if (isMain) {
  const ok = runBetaAudit();
  process.exit(ok ? 0 : 1);
}
