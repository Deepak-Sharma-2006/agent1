import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const METRICS_DIR = join(process.cwd(), ".agents/state/metrics");
const DEFAULT_CEILING = 250000; // 250k tokens hard cap
const WARNING_THRESHOLD = 200000;

interface PhaseMetrics {
  phase: string;
  totalTokensUsed: number;
  inputTokens: number;
  outputTokens: number;
  estimatedCostUsd: number;
  lastUpdated: string;
  isBreached: boolean;
}

function ensureMetricsDir(): void {
  if (!existsSync(METRICS_DIR)) {
    mkdirSync(METRICS_DIR, { recursive: true });
  }
}

export function recordTokenUsage(phase = "phase-1", addedInput = 0, addedOutput = 0): PhaseMetrics {
  ensureMetricsDir();
  const metricFile = join(METRICS_DIR, `${phase}-tokens.json`);

  let metrics: PhaseMetrics = {
    phase,
    totalTokensUsed: 0,
    inputTokens: 0,
    outputTokens: 0,
    estimatedCostUsd: 0,
    lastUpdated: new Date().toISOString(),
    isBreached: false,
  };

  if (existsSync(metricFile)) {
    try {
      metrics = JSON.parse(readFileSync(metricFile, "utf-8"));
    } catch {
      // Use initial
    }
  }

  metrics.inputTokens += addedInput;
  metrics.outputTokens += addedOutput;
  metrics.totalTokensUsed = metrics.inputTokens + metrics.outputTokens;
  // Blend cost approximation: $3/M input, $15/M output (Sonnet standard)
  metrics.estimatedCostUsd = Number(((metrics.inputTokens * 3 + metrics.outputTokens * 15) / 1000000).toFixed(4));
  metrics.lastUpdated = new Date().toISOString();
  metrics.isBreached = metrics.totalTokensUsed >= DEFAULT_CEILING;

  writeFileSync(metricFile, JSON.stringify(metrics, null, 2), "utf-8");

  console.log(`\n📊 [Token Budget Monitor] Phase: ${phase}`);
  console.log(`   Tokens Used: ${metrics.totalTokensUsed.toLocaleString()} / ${DEFAULT_CEILING.toLocaleString()}`);
  console.log(`   Estimated Cost: $${metrics.estimatedCostUsd.toFixed(4)} USD`);

  if (metrics.isBreached) {
    console.error(`🚨 HARD BUDGET CEILING BREACHED! Phase has consumed ${metrics.totalTokensUsed} tokens.`);
    console.error(`Autonomous loops are suspended to prevent uncontrolled spending. Operator authorization required.`);
  } else if (metrics.totalTokensUsed >= WARNING_THRESHOLD) {
    console.warn(`⚠️ Warning: Approaching token ceiling (80% consumed). Triggering context compaction.`);
  }

  return metrics;
}

import { fileURLToPath } from "node:url";

const isMain = process.argv[1] && (
  fileURLToPath(import.meta.url) === process.argv[1] ||
  process.argv[1].endsWith("token-budget-guard.ts") ||
  process.argv[1].endsWith("token-budget-guard.js")
);

if (isMain) {
  const args = process.argv.slice(2);
  const phase = args[0] || "phase-1";
  const inp = parseInt(args[1] || "1500", 10);
  const out = parseInt(args[2] || "500", 10);
  recordTokenUsage(phase, inp, out);
}
