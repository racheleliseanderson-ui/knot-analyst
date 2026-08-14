/**
 * Catalog gold-standard schema check.
 * Every modelled id must have MECHANICS, ConnectionModelMeta, KnotContent.
 * Also validates content required fields and ConnectionJob families.
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
import { HOW_TO, MICRO } from "../src/data/how-to";
import { HOW_TO_EXTRAS, MICRO_EXTRAS } from "../src/data/how-to-extras";
import { KNOT_VIDEOS } from "../src/data/videos";
import type { KnotContent } from "../src/domain/types";

const VALID_JOBS = new Set([
  "line-to-hook",
  "line-to-lure",
  "braid-to-leader",
  "leader-to-leader",
  "line-to-swivel",
  "line-to-spool",
  "fly-line-to-leader",
  "leader-to-tippet",
  "double-line-to-leader",
  "loop-to-loop",
  "line-to-loop",
  "hook-snell",
]);

const ALL_MECHANICS = {
  ...MECHANICS,
  ...MECHANICS_EXTRAS,
  ...MECHANICS_EXTRAS_TERMINAL,
  ...MECHANICS_EXTRAS_BATCH4,
};

const ALL_CONTENT: KnotContent[] = [
  ...TERMINAL_KNOTS,
  ...LINE_TO_LINE_KNOTS,
  ...LOOP_KNOTS,
  ...UTILITY_KNOTS,
  ...SEED_BATCH_2,
  ...SEED_BATCH_3_TERMINAL,
  ...SEED_BATCH_4,
];

const contentById = new Map(ALL_CONTENT.map((k) => [k.id, k]));
const contentIds = new Set(ALL_CONTENT.map((k) => k.id));

const RETIE = new Set(["instant", "fast", "moderate", "slow", "dock-only"]);
const ABILITY = new Set(["excellent", "good", "fair", "poor", "impractical"]);
const DIAM = new Set(["strict-similar", "moderate", "wide", "extreme-ok", "n/a"]);
const CATEGORIES = new Set([
  "terminal",
  "line-to-line",
  "loop",
  "leader-to-tippet",
  "backing-to-line",
  "specialty",
  "utility",
]);
const DIFFICULTY = new Set(["beginner", "intermediate", "advanced"]);

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

function checkContent(id: string, c: KnotContent) {
  if (!c.name?.trim()) fail(`${id}: name required`);
  if (!Array.isArray(c.aliases)) fail(`${id}: aliases must be array`);
  if (!CATEGORIES.has(c.category)) fail(`${id}: category invalid (${c.category})`);
  if (!Array.isArray(c.bestFor) || c.bestFor.length < 1) fail(`${id}: bestFor needs ≥1`);
  if (!c.goodFor || c.goodFor.length < 20) fail(`${id}: goodFor too thin`);
  if (!Array.isArray(c.notIdealFor) || c.notIdealFor.length < 1) fail(`${id}: notIdealFor needs ≥1`);
  if (!Array.isArray(c.lineMaterials) || c.lineMaterials.length < 1) fail(`${id}: lineMaterials required`);
  if (!DIFFICULTY.has(c.difficulty)) fail(`${id}: difficulty invalid`);
  if (!Array.isArray(c.materialsNeeded) || c.materialsNeeded.length < 1) fail(`${id}: materialsNeeded required`);
  if (!c.howToSummary || c.howToSummary.length < 20) fail(`${id}: howToSummary too thin`);
  if (!Array.isArray(c.steps) || c.steps.length < 3) fail(`${id}: steps need ≥3`);
  if (!Array.isArray(c.commonMistakes) || c.commonMistakes.length < 1) fail(`${id}: commonMistakes required`);
  if (!Array.isArray(c.diagnostics) || c.diagnostics.length < 1) fail(`${id}: diagnostics required`);
  if (!Array.isArray(c.resources) || c.resources.length < 1) fail(`${id}: resources required`);
  if (!Array.isArray(c.relatedKnots)) fail(`${id}: relatedKnots must be array`);
  if (!Array.isArray(c.tags) || c.tags.length < 1) fail(`${id}: tags required`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.reviewedOn)) fail(`${id}: reviewedOn must be YYYY-MM-DD`);
  if (!Array.isArray(c.sources) || c.sources.length < 1) fail(`${id}: sources required`);
}

function checkMechanicsContract(id: string) {
  const m = ALL_MECHANICS[id];
  if (!m) return;
  const families = m.contract?.connectionFamilies ?? [];
  if (!families.length) fail(`${id}: connectionFamilies empty`);
  for (const f of families) {
    if (!VALID_JOBS.has(f)) fail(`${id}: invalid ConnectionJob "${f}"`);
  }
  if (!m.completeness?.decisionModel) fail(`${id}: completeness.decisionModel must be true`);
  if (!m.completeness?.mechanicalFingerprint) fail(`${id}: completeness.mechanicalFingerprint must be true`);
  if (!m.mechanicsSummary || m.mechanicsSummary.length < 12) fail(`${id}: mechanicsSummary too thin`);
  if (!m.fingerprint?.dangerousDefects?.length) fail(`${id}: fingerprint.dangerousDefects required`);
  if (!m.observations?.length) fail(`${id}: observations required`);
}

function checkTieBuild(id: string, c: KnotContent) {
  const how = HOW_TO[id] ?? HOW_TO_EXTRAS[id];
  if (!how) {
    fail(`${id}: missing HOW_TO / HOW_TO_EXTRAS (Tie mode before/seat/notes)`);
    return;
  }
  if (!how.beforeYouStart?.length) fail(`${id}: how-to beforeYouStart required`);
  if (!how.seatingSequence || how.seatingSequence.length < 3) fail(`${id}: how-to seatingSequence needs ≥3 phases`);
  if (!how.fieldNotes?.length) fail(`${id}: how-to fieldNotes required`);

  const micro = { ...(MICRO_EXTRAS[id] ?? {}), ...(MICRO[id] ?? {}) };
  if (!Object.keys(micro).length) {
    fail(`${id}: missing MICRO / MICRO_EXTRAS (step look / failure / fix)`);
    return;
  }
  const extraCount = how.extraSteps?.length ?? 0;
  const maxOrder = Math.max(...c.steps.map((s) => s.order), 0) + extraCount;
  for (let n = 1; n <= maxOrder; n++) {
    const m = micro[n];
    if (!m?.look || !m.failureMode || !m.quickFix) {
      fail(`${id}: micro step ${n} needs look + failureMode + quickFix`);
    }
  }
}

const mechIds = Object.keys(ALL_MECHANICS);
const metaIds = Object.keys(CONNECTION_MODEL_META);

for (const id of mechIds) {
  if (!CONNECTION_MODEL_META[id]) fail(`MECHANICS[${id}] missing CONNECTION_MODEL_META`);
  else checkMeta(id, CONNECTION_MODEL_META[id]);
  if (!contentIds.has(id)) fail(`MECHANICS[${id}] missing KnotContent`);
  else checkContent(id, contentById.get(id)!);
  if (contentById.has(id)) checkTieBuild(id, contentById.get(id)!);
  checkMechanicsContract(id);
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
  ok(`${contentIds.size} content entries fully field-checked`);
  ok(`${contentIds.size} Tie-mode how-to + micro builds checked`);
  ok(`${Object.keys(KNOT_VIDEOS).length} cited videos attached (optional — never invented)`);
  ok(`${Object.keys(MODEL_SOURCES).length} sources registered`);
}

console.log(report.join("\n"));
console.log(
  failed === 0
    ? "\nCatalog validation PASSED"
    : `\nCatalog validation FAILED (${failed})`,
);
process.exit(failed === 0 ? 0 : 1);
