import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";

export interface DomainLease {
  domain: string;
  operator: string;
  role: "Alpha" | "Beta";
  acquiredAt: string;
  expiresAt: string;
  ttlSeconds: number;
}

const LOCKS_DIR = join(process.cwd(), ".agents/state/locks");

function ensureLocksDir(): void {
  if (!existsSync(LOCKS_DIR)) {
    mkdirSync(LOCKS_DIR, { recursive: true });
  }
}

export function acquireLock(domain: string, operator: string, role: "Alpha" | "Beta" = "Alpha", ttlSeconds = 3600): boolean {
  ensureLocksDir();
  const lockFile = join(LOCKS_DIR, `${domain}.lock.json`);

  if (existsSync(lockFile)) {
    try {
      const existing: DomainLease = JSON.parse(readFileSync(lockFile, "utf-8"));
      const now = new Date();
      const expires = new Date(existing.expiresAt);

      if (now < expires && existing.operator !== operator) {
        console.error(`\n🚨 LOCK CONFLICT: Domain '${domain}' is actively leased to '${existing.operator}' (${existing.role}) until ${existing.expiresAt}.`);
        console.error(`Please wait for release or execute a formal role transfer.\n`);
        return false;
      }
    } catch {
      // Malformed lock, allow overwrite
    }
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString();

  const lease: DomainLease = {
    domain,
    operator,
    role,
    acquiredAt: now.toISOString(),
    expiresAt,
    ttlSeconds,
  };

  writeFileSync(lockFile, JSON.stringify(lease, null, 2), "utf-8");
  console.log(`✅ [Lock Acquired] Domain '${domain}' leased to '${operator}' (${role}) until ${expiresAt}`);
  return true;
}

export function releaseLock(domain: string, operator: string): boolean {
  ensureLocksDir();
  const lockFile = join(LOCKS_DIR, `${domain}.lock.json`);

  if (!existsSync(lockFile)) {
    console.log(`ℹ️ No active lock found for domain '${domain}'.`);
    return true;
  }

  try {
    const existing: DomainLease = JSON.parse(readFileSync(lockFile, "utf-8"));
    if (existing.operator !== operator) {
      console.warn(`⚠️ Warning: Lock for '${domain}' is owned by '${existing.operator}', not '${operator}'. Force-releasing.`);
    }
    unlinkSync(lockFile);
    console.log(`🔓 [Lock Released] Domain '${domain}' is now free for lease.`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to release lock for '${domain}':`, err);
    return false;
  }
}

export function transferLock(domain: string, fromOperator: string, toOperator: string, newRole: "Alpha" | "Beta" = "Alpha"): boolean {
  ensureLocksDir();
  console.log(`🔄 [Phase Handoff] Transferring domain '${domain}' from '${fromOperator}' to '${toOperator}' (${newRole})...`);
  releaseLock(domain, fromOperator);
  return acquireLock(domain, toOperator, newRole);
}

export function listLocks(): DomainLease[] {
  ensureLocksDir();
  const files = readdirSync(LOCKS_DIR).filter((f) => f.endsWith(".lock.json"));
  const leases: DomainLease[] = [];
  const now = new Date();

  for (const f of files) {
    try {
      const lease: DomainLease = JSON.parse(readFileSync(join(LOCKS_DIR, f), "utf-8"));
      const isExpired = now >= new Date(lease.expiresAt);
      console.log(`• [${lease.domain}] Leased to: ${lease.operator} (${lease.role}) | Expires: ${lease.expiresAt} ${isExpired ? "(EXPIRED)" : "(ACTIVE)"}`);
      leases.push(lease);
    } catch {
      // Ignore malformed files
    }
  }

  if (leases.length === 0) {
    console.log("ℹ️ No active domain leases found. All domains free.");
  }
  return leases;
}

import { fileURLToPath } from "node:url";

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("lock-manager.ts") ||
  process.argv[1].endsWith("lock-manager.js")
);

if (isMain) {
  const args = process.argv.slice(2);
  const command = args[0];

  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  const domain = getArg("--domain") || "default";
  const operator = getArg("--operator") || "OperatorAlpha";
  const role = (getArg("--role") as "Alpha" | "Beta") || "Alpha";
  const to = getArg("--to") || "OperatorBeta";
  const ttl = parseInt(getArg("--ttl") || "3600", 10);

  if (command === "acquire") {
    const ok = acquireLock(domain, operator, role, ttl);
    process.exit(ok ? 0 : 1);
  } else if (command === "release") {
    const ok = releaseLock(domain, operator);
    process.exit(ok ? 0 : 1);
  } else if (command === "transfer") {
    const ok = transferLock(domain, operator, to, role);
    process.exit(ok ? 0 : 1);
  } else if (command === "status") {
    listLocks();
    process.exit(0);
  } else {
    console.log("Usage: node --experimental-strip-types scripts/lock-manager.ts [acquire|release|transfer|status] [options]");
    process.exit(0);
  }
}
