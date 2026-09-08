import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { fileURLToPath } from "node:url";
import { acquireLock, listLocks, releaseLock, resolveOperator, transferLock } from "./lock-manager.ts";
import { saveMemory } from "./memory-vault.ts";

export interface ActiveRoleProfile {
  operator: string;
  role: "Alpha" | "Beta";
  phase: number;
  activeLeaseDomain: string;
  updatedAt: string;
}

const STATE_DIR = join(process.cwd(), ".agents/state");
const ROLE_FILE = join(STATE_DIR, "active-role.json");

function execGit(cmd: string): string {
  try {
    return execSync(cmd, { encoding: "utf-8" }).trim();
  } catch (err: any) {
    return "";
  }
}

export function getActiveProfile(): ActiveRoleProfile {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }

  if (existsSync(ROLE_FILE)) {
    try {
      const parsed: ActiveRoleProfile = JSON.parse(readFileSync(ROLE_FILE, "utf-8"));
      return parsed;
    } catch {
      // Fall through to default
    }
  }

  const defaultProfile: ActiveRoleProfile = {
    operator: resolveOperator(),
    role: (process.env.ROLE as "Alpha" | "Beta") || "Alpha",
    phase: parseInt(process.env.PHASE || "1", 10),
    activeLeaseDomain: "core",
    updatedAt: new Date().toISOString(),
  };

  saveProfile(defaultProfile);
  return defaultProfile;
}

export function saveProfile(profile: ActiveRoleProfile): void {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }
  profile.updatedAt = new Date().toISOString();
  writeFileSync(ROLE_FILE, JSON.stringify(profile, null, 2), "utf-8");
}

export function printRoleStatus(): void {
  const profile = getActiveProfile();
  const currentHost = resolveOperator();

  console.log(`
================================================================================
               ACTIVE WORKSPACE ROLE & LEASE PROFILE
================================================================================
  Current Workstation   : ${currentHost}
  Active Profile Leader : ${profile.operator}
  Assigned Role         : ${profile.role} (${profile.role === "Alpha" ? "Builder / Implementer" : "Adversarial Auditor"})
  Current Phase         : Phase ${profile.phase}
  Active Domain Lease   : ${profile.activeLeaseDomain}
  Last Synchronized     : ${profile.updatedAt}
================================================================================`);

  console.log("\nActive Domain Locks in Repository:");
  listLocks();
  console.log("");
}

export function switchToAlpha(domain = "core", operator?: string): boolean {
  const profile = getActiveProfile();
  const currentOp = resolveOperator(operator);
  console.log(`\n⚙️ [Role Switch] Switching ${currentOp} to ALPHA (Builder) for domain '${domain}'...`);

  const ok = acquireLock(domain, currentOp, "Alpha", 7200);
  if (ok) {
    profile.operator = currentOp;
    profile.role = "Alpha";
    profile.activeLeaseDomain = domain;
    saveProfile(profile);
    console.log(`✅ [Role Confirmed] ${currentOp} is now ALPHA (Builder) for Phase ${profile.phase}.\n`);
  }
  return ok;
}

export function switchToBeta(domain = "core", operator?: string): boolean {
  const profile = getActiveProfile();
  const currentOp = resolveOperator(operator);
  console.log(`\n⚙️ [Role Switch] Configuring ${currentOp} as BETA (Auditor) for Phase ${profile.phase}...`);

  const ok = acquireLock(domain, currentOp, "Beta", 7200);
  if (ok) {
    profile.operator = currentOp;
    profile.role = "Beta";
    profile.activeLeaseDomain = domain;
    saveProfile(profile);
    console.log(`✅ [Role Confirmed] ${currentOp} is now BETA (Auditor) for Phase ${profile.phase}.\n`);
  }
  return ok;
}

export function executeRoleHandoff(toOperator?: string, customNotes?: string): boolean {
  const profile = getActiveProfile();
  const currentOp = profile.operator;
  const targetOp = resolveOperator(toOperator || (currentOp === "Computer1" ? "Computer2" : "Computer1"));

  console.log(`\n🔄 [Phase Handoff] Initiating atomic role inversion from ${currentOp} (${profile.role}) to ${targetOp}...`);

  // Step 1: Check git status
  const status = execGit("git status -s");
  if (status) {
    console.log("📦 Staging and committing modified workspace state for handoff...");
    try {
      execSync("git add -A", { stdio: "inherit" });
      execSync(`git commit -m "chore(handoff): Phase ${profile.phase} handoff from ${currentOp} to ${targetOp}"`, { stdio: "inherit" });
    } catch {
      console.warn("⚠️ Git commit encountered no changes or skipped.");
    }
  }

  // Step 2: Transfer lease lock
  if (profile.role === "Alpha") {
    // Alpha completed phase development -> handoff to Beta for audit
    const ok = transferLock(profile.activeLeaseDomain, currentOp, targetOp, "Beta");
    if (ok) {
      profile.role = "Beta";
      saveProfile(profile);

      // Record in memory vault
      saveMemory({
        title: `Phase ${profile.phase} Handoff: Alpha -> Beta`,
        kind: "handoff",
        scope: "team",
        phase: profile.phase,
        operator: currentOp,
        body: customNotes || `Phase ${profile.phase} implementation complete for domain '${profile.activeLeaseDomain}'. Transferred to ${targetOp} for 5-layer adversarial verification.`,
      });

      // Push state
      console.log("🚀 Synchronizing handoff state to origin...");
      try {
        execSync("git push origin main", { stdio: "inherit" });
      } catch {
        console.warn("⚠️ Git push failed or remote unreachable. Push manually before partner continues.");
      }

      console.log(`\n================================================================================`);
      console.log(`✅ [HANDOFF COMPLETE] Domain '${profile.activeLeaseDomain}' transferred to ${targetOp} (Beta).`);
      console.log(`👉 Partner Command for ${targetOp}:`);
      console.log(`   git pull && npm run audit:beta`);
      console.log(`================================================================================\n`);
      return true;
    }
    return false;
  } else {
    // Beta completed audit & approved -> advance phase and invert roles!
    releaseLock(profile.activeLeaseDomain, currentOp);
    profile.phase += 1;
    profile.role = "Alpha";
    // Odd phases: Computer1 Alpha | Even phases: Computer2 Alpha
    profile.operator = targetOp;
    saveProfile(profile);

    saveMemory({
      title: `Phase ${profile.phase - 1} Certified & Phase ${profile.phase} Inversion`,
      kind: "decision",
      scope: "team",
      phase: profile.phase - 1,
      operator: currentOp,
      body: `Phase ${profile.phase - 1} passed 5-layer verification. Roles inverted for Phase ${profile.phase}. ${profile.operator} is now Alpha Builder.`,
    });

    console.log("🚀 Synchronizing phase inversion state to origin...");
    try {
      execSync("git add .agents/state/active-role.json .agents/state/locks/", { stdio: "inherit" });
      execSync(`git commit -m "chore(role): Phase ${profile.phase} start - ${profile.operator} assumed Alpha"`, { stdio: "inherit" });
      execSync("git push origin main", { stdio: "inherit" });
    } catch {
      // Ignored if clean
    }

    console.log(`\n================================================================================`);
    console.log(`🎉 [PHASE ADVANCED] Phase ${profile.phase - 1} certified and merged!`);
    console.log(`🚀 [ROLE INVERSION] ${profile.operator} is now ALPHA for Phase ${profile.phase}.`);
    console.log(`👉 Partner Command for ${profile.operator}:`);
    console.log(`   git pull && npm run build:alpha`);
    console.log(`================================================================================\n`);
    return true;
  }
}

function parseCliFlags(args: string[]): Record<string, string> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (i + 1 < args.length && !args[i + 1].startsWith("--")) {
        flags[key] = args[i + 1];
        i++;
      } else {
        flags[key] = "true";
      }
    }
  }
  return flags;
}

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("role-switch.ts") ||
  process.argv[1].endsWith("role-switch.js")
);

if (isMain) {
  const rawArgs = process.argv.slice(2);
  const command = (rawArgs[0] && !rawArgs[0].startsWith("--") ? rawArgs[0] : "status").toLowerCase();
  const flags = parseCliFlags(rawArgs);
  const positional = rawArgs.filter((a) => !a.startsWith("--") && a !== command);

  if (command === "status") {
    printRoleStatus();
  } else if (command === "alpha") {
    const domain = flags["domain"] || positional[0] || "core";
    const op = flags["operator"] || flags["op"] || positional[1];
    switchToAlpha(domain, op);
  } else if (command === "beta") {
    const domain = flags["domain"] || positional[0] || "core";
    const op = flags["operator"] || flags["op"] || positional[1];
    switchToBeta(domain, op);
  } else if (command === "handoff") {
    const toOp = flags["to"] || flags["target"] || positional[0];
    const notes = flags["notes"] || flags["msg"] || positional.slice(1).join(" ");
    executeRoleHandoff(toOp, notes);
  } else {
    console.log(`
Usage: node --experimental-strip-types scripts/role-switch.ts <command> [options]

Commands:
  status               Display active operator, role, phase, and domain lease
  alpha [domain] [op]  Acquire domain lease and set workstation as Alpha (Builder)
  beta [domain] [op]   Configure workstation as Beta (Auditor)
  handoff [toOp] [msg] Execute atomic git-synchronized role handoff to partner
`);
  }
}
