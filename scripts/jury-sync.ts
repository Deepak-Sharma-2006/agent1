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

  // Step 0: Role Validation (Only Beta or certified release operator can push to hackathon jury repository)
  const profile = getActiveProfile();
  const isAuthorized = profile.role === "Beta" || profile.phase >= 5;
  if (!isAuthorized) {
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

    // Stage strictly whitelisted production files: ONLY src/ and client/
    console.log("Staging strictly whitelisted production files (src/ and client/)...");
    execSync("git add src/", { stdio: "inherit" });

    if (existsSync("client")) {
      console.log("Staging frontend source files (client/)...");
      execSync("git add client/", { stdio: "inherit" });
    }

    // Generate clean production package.json with frontend build scripts and dependencies
    const prodPackageJson = {
      name: "dealflow360",
      version: "1.0.0",
      description: "DealFlow360 - Autonomous Enterprise Sales Operations & CPQ Platform",
      type: "module",
      main: "src/index.js",
      scripts: {
        build: "vite build client",
        dev: "vite client",
        start: "node src/index.js"
      },
      dependencies: {
        "lucide-react": "^0.468.0",
        "react": "^18.3.1",
        "react-dom": "^18.3.1"
      },
      devDependencies: {
        "@vitejs/plugin-react": "^4.3.4",
        "vite": "^6.0.3"
      }
    };
    writeFileSync("package.json", JSON.stringify(prodPackageJson, null, 2) + "\n", "utf-8");
    execSync("git add package.json", { stdio: "inherit" });

    // Generate clean, professional judge README.md
    const judgeReadme = `# DealFlow360 — Autonomous Sales Operations & CPQ Platform

> Enterprise Multi-Tier CPQ, Dynamic Pricing Governance, Serverless Local SQL, and Real-Time WebSocket Collaboration.

## Quick Start (3 Commands)

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Build production frontend assets
npm run build

# 3. Launch the platform
npm start
\`\`\`

Open **http://localhost:3000** in your browser.

## Core Features
- **Pure Node.js Backend**: Zero-dependency native Node.js 22+ / 24+ HTTP & RFC 6455 WebSocket gateway.
- **Enterprise SPA**: Modern React 18 SPA with Odoo-inspired Executive Theme, dense data grids, and live financial margin pills.
- **Serverless Local SQL**: Embedded SQLite with WAL mode, referential integrity, and Optimistic Concurrency Control (OCC).
- **5-Persona RBAC**: Instant topbar switcher for SalesRep, SalesManager, Finance, Customer, and Warehouse roles.
- **Real-Time Collaboration**: Live presence locking hints and quotation lifecycle events broadcast over WebSockets.
`;
    writeFileSync("README.md", judgeReadme, "utf-8");
    execSync("git add README.md", { stdio: "inherit" });

    // Commit strictly the whitelisted production files
    execSync(`git commit -m "feat(dealflow360): Clean Production Source Release (Pure Source, Zero Dist Artifacts)"`, { stdio: "inherit" });

    // Verify tree contains zero excluded files
    const committedFiles = execCommand(`git ls-tree -r --name-only HEAD`).split("\n").map(s => s.trim()).filter(Boolean);
    console.log(`\nVerified ${committedFiles.length} production files in release commit:`);
    for (const f of committedFiles) {
      console.log(`  📦 ${f}`);
    }

    const forbiddenPrefixes = [
      "dist/",
      "tests/",
      "specs/",
      ".agents/",
      "scripts/",
      "docs/",
      "AGENTS.md",
      "GEMINI.md",
      ".env",
      "implementation_",
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
