import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { acquireLock, listLocks, releaseLock, transferLock } from "./lock-manager.ts";

export interface ActiveRoleProfile {
  operator: string;
  role: "Alpha" | "Beta";
  phase: number;
  activeLeaseDomain: string;
  updatedAt: string;
}

const STATE_DIR = join(process.cwd(), ".agents/state");
const ROLE_FILE = join(STATE_DIR, "active-role.json");

export function getActiveProfile(): ActiveRoleProfile {
  if (!existsSync(STATE_DIR)) {
    mkdirSync(STATE_DIR, { recursive: true });
  }

  if (existsSync(ROLE_FILE)) {
    try {
      return JSON.parse(readFileSync(ROLE_FILE, "utf-8"));
    } catch {
      // Fall through to default
    }
  }

  const defaultProfile: ActiveRoleProfile = {
    operator: process.env.OPERATOR_NAME || "Computer1",
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
  console.log(`
================================================================================
               ACTIVE WORKSPACE ROLE & LEASE PROFILE
================================================================================
  Operator Workstation : ${profile.operator}
  Assigned Role        : ${profile.role} (${profile.role === "Alpha" ? "Builder / Implementer" : "Adversarial Auditor"})
  Current Phase        : Phase ${profile.phase}
  Active Domain Lease  : ${profile.activeLeaseDomain}
  Last Synchronized    : ${profile.updatedAt}
================================================================================`);

  console.log("\nActive Domain Locks in Repository:");
  listLocks();
}

export function switchToAlpha(domain = "core", operator?: string): boolean {
  const profile = getActiveProfile();
  const currentOp = operator || profile.operator;
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
  const currentOp = operator || profile.operator;
  console.log(`\n⚙️ [Role Switch] Switching ${currentOp} to BETA (Auditor) for domain '${domain}'...`);

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

export function executeRoleHandoff(toOperator?: string): boolean {
  const profile = getActiveProfile();
  const currentOp = profile.operator;
  const targetOp = toOperator || (currentOp === "Computer1" ? "Computer2" : "Computer1");

  console.log(`\n🔄 [Phase Handoff] Initiating atomic role inversion from ${currentOp} (${profile.role}) to ${targetOp}...`);

  if (profile.role === "Alpha") {
    // Alpha completed phase development -> handoff to Beta for audit
    const ok = transferLock(profile.activeLeaseDomain, currentOp, targetOp, "Beta");
    if (ok) {
      profile.role = "Beta";
      saveProfile(profile);
      console.log(`✅ [Handoff Complete] Domain '${profile.activeLeaseDomain}' transferred to ${targetOp} (Beta Auditor).`);
      console.log(`👉 Next Action for ${targetOp}: Run 'npm run audit:beta' to perform 5-layer adversarial verification.\n`);
    }
    return ok;
  } else {
    // Beta completed audit & merged -> invert roles and start next phase!
    releaseLock(profile.activeLeaseDomain, currentOp);
    profile.phase += 1;
    profile.role = "Alpha";
    // Odd phases: Computer1 is Alpha | Even phases: Computer2 is Alpha
    const expectedAlpha = profile.phase % 2 === 1 ? "Computer1" : "Computer2";
    profile.operator = toOperator || expectedAlpha;
    saveProfile(profile);
    console.log(`🎉 [Phase Advanced] Phase ${profile.phase - 1} verified & closed!`);
    console.log(`🚀 [Phase Inversion] ${profile.operator} is now ALPHA for Phase ${profile.phase}.`);
    console.log(`👉 Next Action for ${profile.operator}: Run 'npm run role:alpha' and begin implementation.\n`);
    return true;
  }
}

import { fileURLToPath } from "node:url";

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("role-switch.ts") ||
  process.argv[1].endsWith("role-switch.js")
);

if (isMain) {
  const args = process.argv.slice(2);
  const command = (args[0] || "status").toLowerCase();

  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const domain = getArg("--domain") || (args[1] && !args[1].startsWith("-") ? args[1] : "core");
  const operator = getArg("--operator");
  const to = getArg("--to") || (args[1] && !args[1].startsWith("-") ? args[1] : undefined);

  if (command === "status") {
    printRoleStatus();
    process.exit(0);
  } else if (command === "alpha") {
    const ok = switchToAlpha(domain, operator);
    process.exit(ok ? 0 : 1);
  } else if (command === "beta") {
    const ok = switchToBeta(domain, operator);
    process.exit(ok ? 0 : 1);
  } else if (command === "handoff") {
    const ok = executeRoleHandoff(to);
    process.exit(ok ? 0 : 1);
  } else {
    console.log(`
Usage: node --experimental-strip-types scripts/role-switch.ts <command> [options]

Commands:
  status               Display active workspace profile and domain leases
  alpha [domain]       Switch local profile to Alpha (Builder) and acquire lease
  beta [domain]        Switch local profile to Beta (Auditor) and acquire lease
  handoff [toOperator] Perform atomic role handoff to partner workstation
`);
    process.exit(0);
  }
}
