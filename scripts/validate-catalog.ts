/**
 * Catalog gold-standard schema check.
 * Every modelled id must have MECHANICS (core|extras), ConnectionModelMeta, KnotContent.
 * Exit non-zero on any malformed entry — fails the CI build.
 *
 * Run: npx tsx scripts/validate-catalog.ts
 */
import { MECHANICS } from "../src/data/mechanics-profiles";
import { MECHANICS_EXTRAS } from "../src/data/mechanics-extras";
import { MECHANICS_EXTRAS_TERMINAL } from "../src/data/mechanics-extras-terminal";
import { MECHANICS_EXTRAS_BATCH4 } from "../src/data/mechanics-extras-batch4";
import {
  CONNECTION_MODEL_META,
  MODEL_SOURCES,
  type ConnectionModelMeta,
  type StrengthRetentionBand,
} from "../src/data/connection-model-meta";
import { TERMINAL_KNOTS } from "../src/data/knots/terminal";
import { LINE_TO_LINE_KNOTS } from "../src/data/knots/line-to-line";
import { LOOP_KNOTS } from "../src/data/knots/loops";
import { UTILITY_KNOTS } from "../src/data/knots/utility";
import { SEED_BATCH_2 } from "../src/data/knots/seed-batch-2";
import { SEED_BATCH_3_TERMINAL } from "../src/data/knots/seed-batch-3-terminal";
import { SEED_BATCH_4 } from "../src/data/knots/seed-batch-4";

const ALL_MECHANICS = {
  ...MECHANICS,
  ...MECHANICS_EXTRAS,
  ...MECHANICS_EXTRAS_TERMINAL,
  ...MECHANICS_EXTRAS_BATCH4,
};

const contentIds = new Set(
  [
    ...TERMINAL_KNOTS,
    ...LINE_TO_LINE_KNOTS,
    ...LOOP_KNOTS,
    ...UTILITY_KNOTS,
    ...SEED_BATCH_2,
    ...SEED_BATCH_3_TERMINAL,
    ...SEED_BATCH_4,
  ].map((k) => k.id),
);

const RETIE = new Set(["instant", "fast", "moderate", "slow", "dock-only"]);
const ABILITY = new Set(["excellent", "good", "fair", "poor", "impractical"]);
const DIAM = new Set(["strict-similar", "moderate", "wide", "extreme-ok", "n/a"]);

let failed = 0;
const report: string[] = [];

function fail(msg: string) {
  failed++;
  report.push(`FAIL  ${msg}`);
}

function ok(msg: string) {
  report.push(`ok   ${msg}`);
}

function checkBand(id: string, b: StrengthRetentionBand) {
  if (typeof b.lowPct !== "number" || typeof b.highPct !== "number") {
    fail(`${id}: strengthRetentionBand must be numeric low/high`);
    return;
  }
  if (b.lowPct < 0 || b.highPct > 110 || b.lowPct > b.highPct) {
    fail(`${id}: strengthRetentionBand out of range (${b.lowPct}–${b.highPct})`);
  }
  if (b.lowPct === b.highPct) {
    fail(`${id}: strengthRetentionBand must be a BAND, not a single figure`);
  }
  if (!b.note || b.note.length < 12) {
    fail(`${id}: strengthRetentionBand.note too thin`);
  }
}

function checkMeta(id: string, m: ConnectionModelMeta) {
  if (!m.materialsValidityMatrix?.main?.length) {
    fail(`${id}: materialsValidityMatrix.main required`);
  }
  const t = m.tieAbilityUnderCondition;
  for (const k of ["cold", "wind", "lowLight", "boatMotion"] as const) {
    if (!ABILITY.has(t?.[k])) fail(`${id}: tieAbilityUnderCondition.${k} invalid`);
  }
  if (!RETIE.has(m.retieTempoFit)) fail(`${id}: retieTempoFit invalid`);
  checkBand(id, m.strengthRetentionBand);
  if (!Array.isArray(m.failsWhen) || m.failsWhen.length < 2) {
    fail(`${id}: failsWhen needs ≥2 modes`);
  }
  if (!DIAM.has(m.diameterMismatchTolerance)) {
    fail(`${id}: diameterMismatchTolerance invalid`);
  }
  if (typeof m.guidesFriendly !== "boolean") fail(`${id}: guidesFriendly must be boolean`);
  if (!m.sourceId || !MODEL_SOURCES[m.sourceId]) {
    fail(`${id}: sourceId must resolve in MODEL_SOURCES`);
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.reviewedDate)) {
    fail(`${id}: reviewedDate must be YYYY-MM-DD`);
  }
}

const mechIds = Object.keys(ALL_MECHANICS);
const metaIds = Object.keys(CONNECTION_MODEL_META);

for (const id of mechIds) {
  if (!CONNECTION_MODEL_META[id]) fail(`MECHANICS[${id}] missing CONNECTION_MODEL_META`);
  else checkMeta(id, CONNECTION_MODEL_META[id]);
  if (!contentIds.has(id)) fail(`MECHANICS[${id}] missing KnotContent`);
}

for (const id of metaIds) {
  if (!ALL_MECHANICS[id]) fail(`CONNECTION_MODEL_META[${id}] missing MECHANICS`);
  if (!contentIds.has(id)) fail(`CONNECTION_MODEL_META[${id}] missing KnotContent`);
}

for (const id of contentIds) {
  if (!ALL_MECHANICS[id]) fail(`KnotContent[${id}] missing MECHANICS (hydrate will throw)`);
}

if (failed === 0) {
  ok(`${mechIds.length} modelled connections fully schema-checked`);
  ok(`${Object.keys(MODEL_SOURCES).length} sources registered`);
}

console.log(report.join("\n"));
console.log(
  failed === 0
    ? "\nCatalog validation PASSED"
    : `\nCatalog validation FAILED (${failed})`,
);
process.exit(failed === 0 ? 0 : 1);
