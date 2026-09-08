import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { hostname } from "os";
import { fileURLToPath } from "node:url";

export interface DomainLease {
  domain: string;
  operator: string;
  role: "Alpha" | "Beta";
  acquiredAt: string;
  expiresAt: string;
  ttlSeconds: number;
  lastHeartbeat: string;
  host: string;
}

const LOCKS_DIR = join(process.cwd(), ".agents/state/locks");
const GRACE_PERIOD_SECONDS = 900; // 15-minute grace period

function ensureLocksDir(): void {
  if (!existsSync(LOCKS_DIR)) {
    mkdirSync(LOCKS_DIR, { recursive: true });
  }
}

export function resolveOperator(explicitOperator?: string): string {
  if (explicitOperator && explicitOperator.trim()) {
    return explicitOperator.trim();
  }
  if (process.env.OPERATOR_NAME && process.env.OPERATOR_NAME.trim()) {
    return process.env.OPERATOR_NAME.trim();
  }
  const host = hostname();
  return host || "Computer1";
}

export function acquireLock(domain: string, explicitOperator?: string, role: "Alpha" | "Beta" = "Alpha", ttlSeconds = 7200): boolean {
  ensureLocksDir();
  const operator = resolveOperator(explicitOperator);
  const host = hostname();
  const lockFile = join(LOCKS_DIR, `${domain}.lock.json`);

  if (existsSync(lockFile)) {
    try {
      const existing: DomainLease = JSON.parse(readFileSync(lockFile, "utf-8"));
      const now = new Date();
      const expiresAt = new Date(existing.expiresAt);
      const graceEnd = new Date(expiresAt.getTime() + GRACE_PERIOD_SECONDS * 1000);

      // Active unexpired lease held by someone else
      if (now < expiresAt && existing.operator !== operator) {
        console.error(`\n🚨 LOCK CONFLICT: Domain '${domain}' is actively leased to '${existing.operator}' (${existing.role}) on host '${existing.host}'.`);
        console.error(`Expires at: ${existing.expiresAt}. Run 'npm run role:handoff' or wait for release.\n`);
        return false;
      }

      // In grace period
      if (now >= expiresAt && now < graceEnd && existing.operator !== operator) {
        console.warn(`\n⚠️ LEASE GRACE PERIOD: Domain '${domain}' expired at ${existing.expiresAt} but is in a 15-minute grace window for '${existing.operator}'.`);
        console.warn(`Attempting graceful transfer to '${operator}'.\n`);
      }
    } catch {
      // Malformed lock file, proceed with overwrite
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
    lastHeartbeat: now.toISOString(),
    host,
  };

  writeFileSync(lockFile, JSON.stringify(lease, null, 2), "utf-8");
  console.log(`✅ [Lock Acquired] Domain '${domain}' leased to '${operator}' (${role}) on '${host}' until ${expiresAt}`);
  return true;
}

export function heartbeatLock(domain: string, explicitOperator?: string, extensionSeconds = 3600): boolean {
  ensureLocksDir();
  const operator = resolveOperator(explicitOperator);
  const lockFile = join(LOCKS_DIR, `${domain}.lock.json`);

  if (!existsSync(lockFile)) {
    console.warn(`⚠️ Cannot heartbeat: Domain '${domain}' has no active lock. Acquiring fresh lock.`);
    return acquireLock(domain, operator, "Alpha", extensionSeconds);
  }

  try {
    const lease: DomainLease = JSON.parse(readFileSync(lockFile, "utf-8"));
    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + extensionSeconds * 1000).toISOString();

    lease.lastHeartbeat = now.toISOString();
    lease.expiresAt = newExpiresAt;
    lease.ttlSeconds = extensionSeconds;
    lease.host = lease.host || hostname();

    writeFileSync(lockFile, JSON.stringify(lease, null, 2), "utf-8");
    console.log(`💓 [Lock Heartbeat] Domain '${domain}' lease extended to ${newExpiresAt} for '${lease.operator}' on '${lease.host}'`);
    return true;
  } catch (err) {
    console.error(`❌ Failed to send heartbeat for '${domain}':`, err);
    return false;
  }
}

export function releaseLock(domain: string, explicitOperator?: string): boolean {
  ensureLocksDir();
  const operator = resolveOperator(explicitOperator);
  const lockFile = join(LOCKS_DIR, `${domain}.lock.json`);

  if (!existsSync(lockFile)) {
    console.log(`ℹ️ No active lock found for domain '${domain}'.`);
    return true;
  }

  try {
    const existing: DomainLease = JSON.parse(readFileSync(lockFile, "utf-8"));
    if (existing.operator !== operator) {
      console.warn(`⚠️ Warning: Lock for '${domain}' was held by '${existing.operator}', released by '${operator}'.`);
    }
    unlinkSync(lockFile);
    console.log(`🔓 [Lock Released] Domain '${domain}' is now unlocked.`);
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
      const expires = new Date(lease.expiresAt);
      const isExpired = now >= expires;
      const remainingMinutes = Math.max(0, Math.floor((expires.getTime() - now.getTime()) / 60000));

      const host = lease.host || "unknown";
      const op = lease.operator || "unknown";
      const role = lease.role || "Alpha";
      const domain = lease.domain || f.replace(/\.lock\.json$/, "");
      const statusTag = isExpired ? "🔴 EXPIRED" : `🟢 ACTIVE (${remainingMinutes}m left)`;

      console.log(`  • [${domain.padEnd(16)}] Operator: ${op.padEnd(14)} Role: ${role.padEnd(6)} Host: ${host.padEnd(14)} | ${statusTag}`);
      leases.push(lease);
    } catch (err) {
      console.warn(`⚠️ Warning: could not parse lock file ${f}:`, err);
    }
  }

  if (leases.length === 0) {
    console.log("  (Zero active locks. Workspace is fully unlocked.)");
  }

  return leases;
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
  process.argv[1].endsWith("lock-manager.ts") ||
  process.argv[1].endsWith("lock-manager.js")
);

if (isMain) {
  const rawArgs = process.argv.slice(2);
  const command = (rawArgs[0] && !rawArgs[0].startsWith("--") ? rawArgs[0] : "status").toLowerCase();
  const flags = parseCliFlags(rawArgs);
  const positional = rawArgs.filter((a) => !a.startsWith("--") && a !== command);

  if (command === "status") {
    console.log("\n🔒 [Distributed Domain Lease Status]");
    console.log("================================================================================");
    listLocks();
    console.log("================================================================================\n");
  } else if (command === "acquire") {
    const domain = flags["domain"] || positional[0] || "core";
    const op = flags["operator"] || flags["op"] || positional[1];
    const role = ((flags["role"] || positional[2] || "Alpha") as "Alpha" | "Beta");
    acquireLock(domain, op, role);
  } else if (command === "heartbeat") {
    const domain = flags["domain"] || positional[0] || "core";
    const op = flags["operator"] || flags["op"] || positional[1];
    heartbeatLock(domain, op);
  } else if (command === "release") {
    const domain = flags["domain"] || positional[0] || "core";
    const op = flags["operator"] || flags["op"] || positional[1];
    releaseLock(domain, op);
  } else if (command === "transfer") {
    const domain = flags["domain"] || positional[0] || "core";
    const fromOp = flags["from"] || positional[1] || "Computer1";
    const toOp = flags["to"] || positional[2] || "Computer2";
    const role = ((flags["role"] || positional[3] || "Beta") as "Alpha" | "Beta");
    transferLock(domain, fromOp, toOp, role);
  } else {
    console.log(`
Usage: node --experimental-strip-types scripts/lock-manager.ts <command> [options]

Commands:
  status                               Display active locks, hosts, and remaining TTL
  acquire <domain> [op] [role]         Acquire new domain lease
  heartbeat <domain> [op]              Auto-renew active lease TTL
  transfer <domain> <from> <to> [role] Atomically handoff lease to partner
  release <domain> [op]                Release active domain lease
`);
  }
}
