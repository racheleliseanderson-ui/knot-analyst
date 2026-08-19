/**
 * Mode 07 · Applications teaching bar.
 * Atlas only — every modelled connection and every world essay must be
 * fully seeded. Nothing here may score Decide.
 *
 * Run: npx tsx scripts/applications-completeness.ts
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BOATING_KNOTS, FISHING_KNOTS } from "../src/data/catalog";
import {
  KNOT_APPLICATIONS,
  WORLD_ESSAYS,
  applicationsForDomain,
  getKnotApplication,
} from "../src/data/applications";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const all = [...FISHING_KNOTS, ...BOATING_KNOTS];
const ids = new Set(all.map((k) => k.id));

let failed = 0;
const report: string[] = [];

function fail(msg: string) {
  failed += 1;
  report.push(`FAIL  ${msg}`);
}

function ok(msg: string) {
  report.push(`ok    ${msg}`);
}

if (KNOT_APPLICATIONS.length !== all.length) {
  fail(`application rows ${KNOT_APPLICATIONS.length} ≠ modelled ${all.length}`);
}

const seen = new Set<string>();
for (const a of KNOT_APPLICATIONS) {
  if (seen.has(a.knotId)) fail(`${a.knotId}: duplicate application row`);
  seen.add(a.knotId);
  if (!ids.has(a.knotId)) fail(`${a.knotId}: not a modelled connection`);
  if (!a.tangleClass) fail(`${a.knotId}: tangleClass`);
  if (!a.holdsBy.length) fail(`${a.knotId}: holdsBy`);
  if (a.applicationNotes.length < 2) fail(`${a.knotId}: applicationNotes need ≥2`);
  if (a.topologyDoesNot.length < 3) fail(`${a.knotId}: topologyDoesNot need ≥3`);
  if (a.notFor.length < 2) fail(`${a.knotId}: notFor need ≥2`);
  const urls = a.sources.filter((s) => /^https?:\/\//.test(s.url));
  if (urls.length < 2) fail(`${a.knotId}: sources need ≥2 URLs`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(a.reviewedOn)) fail(`${a.knotId}: reviewedOn`);
  if (a.scoresDecide !== false) fail(`${a.knotId}: must declare scoresDecide false`);
  for (const d of a.duals) {
    if (!ids.has(d.knotId)) fail(`${a.knotId}: dual ${d.knotId} is not modelled`);
    if (d.knotId === a.knotId) fail(`${a.knotId}: dual points at self`);
    if (!d.relation || d.relation.length < 16) fail(`${a.knotId}: thin dual relation`);
  }
}

for (const k of all) {
  if (!getKnotApplication(k.id)) fail(`${k.id}: missing application row`);
}

const worldIds = new Set<string>();
for (const w of WORLD_ESSAYS) {
  if (worldIds.has(w.id)) fail(`world ${w.id}: duplicate`);
  worldIds.add(w.id);
  if (ids.has(w.id)) fail(`world ${w.id}: collides with a knot id`);
  if (!w.title?.trim()) fail(`world ${w.id}: title`);
  if (!w.lede || w.lede.length < 20) fail(`world ${w.id}: lede`);
  if (!w.meaning || w.meaning.length < 80) fail(`world ${w.id}: meaning`);
  if (w.predicts.length < 2) fail(`world ${w.id}: predicts need ≥2`);
  if (w.doesNot.length < 3) fail(`world ${w.id}: doesNot need ≥3`);
  if (w.notFor.length < 2) fail(`world ${w.id}: notFor need ≥2`);
  if (w.sources.filter((s) => /^https?:\/\//.test(s.url)).length < 2) {
    fail(`world ${w.id}: sources need ≥2 URLs`);
  }
  if (!w.neverScoresDecide) fail(`world ${w.id}: must never score Decide`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(w.reviewedOn)) fail(`world ${w.id}: reviewedOn`);
  for (const id of w.relatedKnotIds) {
    if (!ids.has(id)) fail(`world ${w.id}: related ${id} is not modelled`);
  }
}

if (WORLD_ESSAYS.length < 6) fail(`world essays too few (${WORLD_ESSAYS.length})`);

const fishing = applicationsForDomain("fishing");
const boating = applicationsForDomain("boating");
if (fishing.length !== FISHING_KNOTS.length) fail("fishing application pool mismatch");
if (boating.length !== BOATING_KNOTS.length) fail("boating application pool mismatch");
if (fishing.some((a) => BOATING_KNOTS.some((k) => k.id === a.knotId))) {
  fail("fishing pool leaked a boating connection");
}
if (boating.some((a) => FISHING_KNOTS.some((k) => k.id === a.knotId))) {
  fail("boating pool leaked a fishing connection");
}

const engineDir = join(root, "src/engine");
const engineFiles = [
  "advisor.ts",
  "chooser.ts",
  "compare.ts",
  "constraints.ts",
  "diagnostics.ts",
  "explain.ts",
  "ranking.ts",
  "troubleshoot.ts",
];
for (const f of engineFiles) {
  const text = readFileSync(join(engineDir, f), "utf8");
  if (text.includes("data/applications") || text.includes("@/data/applications")) {
    fail(`${f}: engine must not import applications`);
  }
}

if (failed === 0) {
  ok(`${KNOT_APPLICATIONS.length} connection notes meet the applications bar`);
  ok(`${WORLD_ESSAYS.length} world essays isolated from Decide`);
  ok(`${fishing.length} fishing · ${boating.length} boating`);
}

for (const line of report) console.log(line);
if (failed) {
  console.error(`\n${failed} applications gaps`);
  process.exit(1);
}
console.log("\nApplications completeness PASSED");
