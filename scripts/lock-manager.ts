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
  const files = readdirSync(LOCKS_DIR).filter((f: string) => f.endsWith(".lock.json"));
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
  const rawCmd = (args[0] || "status").toLowerCase();

  const getArg = (flag: string): string | undefined => {
    const idx = args.indexOf(flag);
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
  };

  // Support positional or flag args: e.g. "alpha auth", "transfer auth Computer2 Beta"
  const defaultOperator = process.env.OPERATOR_NAME || "Computer1";
  const flagOperator = getArg("--operator");
  const flagDomain = getArg("--domain");
  const flagRole = getArg("--role") as "Alpha" | "Beta" | undefined;
  const flagTo = getArg("--to");
  const ttl = parseInt(getArg("--ttl") || "3600", 10);

  if (rawCmd === "alpha") {
    const domain = flagDomain || (args[1] && !args[1].startsWith("-") ? args[1] : "all");
    const operator = flagOperator || defaultOperator;
    const ok = acquireLock(domain, operator, "Alpha", ttl);
    process.exit(ok ? 0 : 1);
  } else if (rawCmd === "beta") {
    const domain = flagDomain || (args[1] && !args[1].startsWith("-") ? args[1] : "all");
    const operator = flagOperator || defaultOperator;
    const ok = acquireLock(domain, operator, "Beta", ttl);
    process.exit(ok ? 0 : 1);
  } else if (rawCmd === "acquire") {
    const domain = flagDomain || (args[1] && !args[1].startsWith("-") ? args[1] : "all");
    const operator = flagOperator || defaultOperator;
    const role = flagRole || "Alpha";
    const ok = acquireLock(domain, operator, role, ttl);
    process.exit(ok ? 0 : 1);
  } else if (rawCmd === "release") {
    const domain = flagDomain || (args[1] && !args[1].startsWith("-") ? args[1] : "all");
    const operator = flagOperator || defaultOperator;
    const ok = releaseLock(domain, operator);
    process.exit(ok ? 0 : 1);
  } else if (rawCmd === "transfer") {
    const domain = flagDomain || (args[1] && !args[1].startsWith("-") ? args[1] : "all");
    const operator = flagOperator || defaultOperator;
    const to = flagTo || (args[2] && !args[2].startsWith("-") ? args[2] : "Computer2");
    const role = (flagRole || (args[3] && !args[3].startsWith("-") ? args[3] : "Alpha")) as "Alpha" | "Beta";
    const ok = transferLock(domain, operator, to, role);
    process.exit(ok ? 0 : 1);
  } else if (rawCmd === "status") {
    listLocks();
    process.exit(0);
  } else {
    console.log(`
Antigravity Lease Lock & Role Exchange Manager
----------------------------------------------
Usage:
  node --experimental-strip-types scripts/lock-manager.ts <command> [options]

Commands:
  alpha [domain]                     Acquire Alpha (Builder) lease on domain (default: "all")
  beta [domain]                      Acquire Beta (Auditor) lease on domain (default: "all")
  transfer [domain] [to] [role]      Transfer domain lease to another operator
  release [domain]                   Release domain lease
  status                             List active leases and expiration times

Flags:
  --domain <name>                    Target functional domain (e.g. auth, api, db)
  --operator <name>                  Current operator name (default: env OPERATOR_NAME or Computer1)
  --to <name>                        Recipient operator name for transfer
  --role <Alpha|Beta>                Target role assignment
  --ttl <seconds>                    Lease expiration TTL in seconds (default: 3600)
`);
    process.exit(0);
  }
}
