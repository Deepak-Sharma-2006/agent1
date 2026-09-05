import { existsSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { runBetaAudit } from "./beta-audit-runner.ts";
import { getActiveProfile } from "./role-switch.ts";

function execCommand(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch {
    return "";
  }
}

export function getJuryStatus(): void {
  console.log(`
================================================================================
           DUAL-REPOSITORY HACKATHON & JURY PUBLISHING PIPELINE
================================================================================`);

  const remotesRaw = execCommand("git remote -v");
  const lines = remotesRaw.split("\n");

  let originUrl = "Not configured";
  let juryUrl = "⚠️ [Jury Remote Not Configured]";

  for (const line of lines) {
    const parts = line.split(/\s+/);
    if (parts[0] === "origin" && parts[2] === "(push)") {
      originUrl = parts[1];
    } else if (parts[0] === "jury" && parts[2] === "(push)") {
      juryUrl = parts[1];
    }
  }

  const latestCommit = execCommand("git log -1 --oneline") || "No commits found";
  const profile = getActiveProfile();

  console.log(`  Internal Collab Remote (origin) : ${originUrl}`);
  console.log(`  Public Showcase Remote (jury)   : ${juryUrl}`);
  console.log(`  Latest Synchronized Commit      : ${latestCommit}`);
  console.log(`  Current Development Phase       : Phase ${profile.phase} (${profile.role})`);

  console.log("\nReady Cognitive Comprehension Dossiers for Judges:");
  const dossierDir = join(process.cwd(), "docs/dossiers");
  if (existsSync(dossierDir)) {
    const files = readdirSync(dossierDir).filter((f) => f.endsWith(".md"));
    if (files.length > 0) {
      for (const f of files) {
        console.log(`  📄 docs/dossiers/${f}`);
      }
    } else {
      console.log("  (None generated yet)");
    }
  }

  if (juryUrl.includes("Not Configured")) {
    console.log(`
ℹ️ To configure the secondary Jury submission repository, run:
   npm run jury:set-remote -- <YOUR_JURY_GITHUB_REPO_URL>
`);
  }

  console.log("================================================================================\n");
}

export function setJuryRemote(url: string): boolean {
  if (!url || !url.trim()) {
    console.error("❌ Error: Please provide a valid Git remote URL.");
    return false;
  }

  const trimmed = url.trim();
  const remotes = execCommand("git remote").split("\n");

  try {
    if (remotes.includes("jury")) {
      execSync(`git remote set-url jury ${trimmed}`, { stdio: "inherit" });
      console.log(`✅ [Jury Remote Updated] 'jury' remote set to: ${trimmed}`);
    } else {
      execSync(`git remote add jury ${trimmed}`, { stdio: "inherit" });
      console.log(`✅ [Jury Remote Added] 'jury' remote added: ${trimmed}`);
    }
    return true;
  } catch (err) {
    console.error("❌ Failed to configure jury remote:", err);
    return false;
  }
}

const DEFAULT_JURY_REMOTE = "https://github.com/Infinity915/575_final.git";

export function publishToJury(customTag?: string): boolean {
  console.log(`\n🚀 [Jury Release Pipeline] Initiating pre-publish gate barrier...`);

  // Step 0: Role Validation (Only Beta can push to hackathon jury repository)
  const profile = getActiveProfile();
  if (profile.role !== "Beta") {
    console.error(`\n🛑 [Publish Blocked] Role Violation: Only the BETA AUDITOR can publish to the hackathon repository (575_final).`);
    console.error(`Current workstation role is '${profile.role}'. Alpha must push to 'agent1' and run 'npm run role:handoff' first.\n`);
    return false;
  }

  // Step 1: Execute 5-layer Beta Audit
  console.log("Step 1: Running mandatory 5-layer Beta verification audit...");
  const auditPassed = runBetaAudit();
  if (!auditPassed) {
    console.error(`\n🛑 [Publish Blocked] Beta audit failed! Only fully audited, passing code can be published to the jury repository.\n`);
    return false;
  }

  // Step 2: Check / auto-configure jury remote
  const remotes = execCommand("git remote").split("\n");
  if (!remotes.includes("jury")) {
    console.log(`ℹ️ [Jury Remote Setup] Configuring 'jury' remote to: ${DEFAULT_JURY_REMOTE}`);
    setJuryRemote(DEFAULT_JURY_REMOTE);
  }

  const tag = customTag || `v1.0-phase-${profile.phase}`;
  const currentBranch = execCommand("git rev-parse --abbrev-ref HEAD") || "main";
  const cleanReleaseBranch = `jury-release-phase-${profile.phase}`;

  try {
    console.log(`\nStep 2: Preparing isolated clean production branch '${cleanReleaseBranch}'...`);
    execSync(`git checkout -B ${cleanReleaseBranch}`, { stdio: "inherit" });

    // Clear entire staging index
    execSync("git rm -rf --cached .", { stdio: "inherit" });

    // Stage strictly whitelisted production files: ONLY src/ and frontend assets
    console.log("Staging strictly whitelisted production files (src/)...");
    execSync("git add src/", { stdio: "inherit" });

    if (existsSync("dist")) {
      console.log("Staging compiled production frontend bundle (dist/)...");
      execSync("git add -f dist/", { stdio: "inherit" });
    }

    if (existsSync("client")) {
      console.log("Staging frontend source files (client/)...");
      execSync("git add client/", { stdio: "inherit" });
    }

    // Generate clean production package.json without internal agent engine scripts
    const prodPackageJson = {
      name: "dealflow360",
      version: "1.0.0",
      description: "DealFlow360 - Autonomous Enterprise Sales Operations & CPQ Platform",
      type: "module",
      main: "src/index.js",
      scripts: {
        start: "node src/index.js"
      }
    };
    writeFileSync("package.json", JSON.stringify(prodPackageJson, null, 2) + "\n", "utf-8");
    execSync("git add package.json", { stdio: "inherit" });

    // Commit strictly the whitelisted production files
    execSync(`git commit -m "feat(dealflow360): Phase ${profile.phase} - Production Application Release"`, { stdio: "inherit" });

    // Verify tree contains zero excluded files (/tests, /specs, .agents, scripts, docs, README, LICENSE, etc.)
    const committedFiles = execCommand(`git ls-tree -r --name-only HEAD`).split("\n").map(s => s.trim()).filter(Boolean);
    console.log(`\nVerified ${committedFiles.length} production files in release commit:`);
    for (const f of committedFiles) {
      console.log(`  📦 ${f}`);
    }

    const forbiddenPrefixes = [
      "tests/",
      "specs/",
      ".agents/",
      "scripts/",
      "docs/",
      "AGENTS.md",
      "GEMINI.md",
      ".env",
      "implementation_",
      "README.md",
      "LICENSE",
      "tsconfig.json",
      "package-lock.json",
    ];
    const leaks = committedFiles.filter(f => forbiddenPrefixes.some(p => f.startsWith(p) || f === p));
    if (leaks.length > 0) {
      throw new Error(`Exclusion check failed! Forbidden files detected in release branch: ${leaks.join(", ")}`);
    }

    console.log(`\nStep 3: Tagging release commit with '${tag}'...`);
    execSync(`git tag -a ${tag} -m "Release ${tag} - Certified 5/5 by Beta Auditor" -f`, { stdio: "inherit" });

    console.log(`\nStep 4: Pushing clean release to hackathon jury repository (575_final)...`);
    execSync(`git push jury ${cleanReleaseBranch}:main --force`, { stdio: "inherit" });
    execSync(`git push jury ${tag} --force`, { stdio: "inherit" });

    // Restore working branch
    execSync(`git checkout -f ${currentBranch}`, { stdio: "inherit" });
    execSync(`git branch -D ${cleanReleaseBranch}`, { stdio: "inherit" });

    console.log(`\n🎉 [Jury Release Published] Successfully deployed pure production Phase ${profile.phase} code to hackathon repository!`);
    console.log(`Repository URL: https://github.com/Infinity915/575_final\n`);
    return true;
  } catch (err) {
    execSync(`git checkout -f ${currentBranch}`, { stdio: "inherit" });
    console.error(`\n❌ Failed to push release to jury remote:`, err);
    return false;
  }
}

import { fileURLToPath } from "node:url";

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("jury-sync.ts") ||
  process.argv[1].endsWith("jury-sync.js")
);

if (isMain) {
  const args = process.argv.slice(2);
  const command = (args[0] || "status").toLowerCase();

  if (command === "status") {
    getJuryStatus();
    process.exit(0);
  } else if (command === "set-remote") {
    const url = args[1];
    const ok = setJuryRemote(url);
    process.exit(ok ? 0 : 1);
  } else if (command === "publish") {
    const tag = args[1];
    const ok = publishToJury(tag);
    process.exit(ok ? 0 : 1);
  } else {
    console.log(`
Usage: node --experimental-strip-types scripts/jury-sync.ts <command> [options]

Commands:
  status               Display jury remote status and ready dossiers
  set-remote <URL>     Configure secondary Git remote pointing to jury repo
  publish [TAG]        Audit code via 5-layer gate, tag, and publish to jury
`);
    process.exit(0);
  }
}
