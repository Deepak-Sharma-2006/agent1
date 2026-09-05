import { existsSync, readdirSync } from "fs";
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

  // Step 2: Check jury remote
  const remotes = execCommand("git remote").split("\n");
  if (!remotes.includes("jury")) {
    console.error(`\n❌ [Publish Aborted] Git remote 'jury' is not configured. Run 'npm run jury:set-remote -- <URL>' first.\n`);
    return false;
  }

  const tag = customTag || `v1.0-phase-${profile.phase}`;
  const currentBranch = execCommand("git rev-parse --abbrev-ref HEAD") || "main";
  const cleanReleaseBranch = `jury-release-phase-${profile.phase}`;

  try {
    console.log(`\nStep 2: Preparing clean submission branch '${cleanReleaseBranch}' (excluding docs/dossiers/)...`);
    execSync(`git checkout -B ${cleanReleaseBranch}`, { stdio: "inherit" });

    // Remove internal dossiers from the jury submission branch
    if (existsSync(join(process.cwd(), "docs/dossiers"))) {
      try {
        execSync("git rm -rf --cached docs/dossiers", { stdio: "inherit" });
        execSync('git commit -m "chore: exclude internal cognitive dossiers from jury submission" --allow-empty', { stdio: "inherit" });
      } catch {
        // In case nothing was staged
      }
    }

    console.log(`\nStep 3: Tagging release commit with '${tag}'...`);
    execSync(`git tag -a ${tag} -m "Release ${tag} - Certified 5/5 by Beta Auditor" -f`, { stdio: "inherit" });

    console.log(`\nStep 4: Pushing clean release to hackathon jury repository (575_final)...`);
    execSync(`git push jury ${cleanReleaseBranch}:main --force`, { stdio: "inherit" });
    execSync(`git push jury ${tag} --force`, { stdio: "inherit" });

    // Restore working branch
    execSync(`git checkout ${currentBranch}`, { stdio: "inherit" });

    console.log(`\n🎉 [Jury Release Published] Successfully deployed ${tag} to hackathon repository without internal dossiers!`);
    console.log(`Repository URL: https://github.com/Infinity915/575_final\n`);
    return true;
  } catch (err) {
    execSync(`git checkout ${currentBranch}`, { stdio: "inherit" });
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
