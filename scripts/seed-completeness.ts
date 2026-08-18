/**
 * Teaching-record bar for Library / Tie.
 * Hydrated catalog only — raw mechanical files may still be thinner.
 *
 * Every modelled connection must carry the same teaching fields:
 * aliases, 2+ valid related ids, 2+ not-for, 4+ steps with look + fail + fix,
 * 3+ before-you-start, seating that is WET or 5 phases, 2+ sourced URLs,
 * 2+ sources, a cited video, reviewed date, retention band, diagram family.
 *
 * Declared ratings stay as cited bands. Missing numbers stay missing.
 *
 * Run: npx tsx scripts/seed-completeness.ts
 */
import { FISHING_KNOTS, BOATING_KNOTS } from "../src/data/catalog";

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

for (const k of all) {
  if (!k.aliases?.length) fail(`${k.id}: aliases required`);
  const related = (k.relatedKnots ?? []).filter((id) => ids.has(id) && id !== k.id);
  if (related.length < 2)
    fail(`${k.id}: relatedKnots needs ≥2 valid ids (have ${related.join(", ") || "none"})`);
  if ((k.notIdealFor ?? []).length < 2) fail(`${k.id}: notIdealFor needs ≥2`);
  if ((k.steps ?? []).length < 4) fail(`${k.id}: steps need ≥4 (have ${k.steps.length})`);
  const withLook = (k.steps ?? []).filter((s) => s.look || s.expectedResult);
  if (withLook.length < 4) fail(`${k.id}: ≥4 steps need look or expectedResult`);
  const withFail = (k.steps ?? []).filter(
    (s) => (s.commonError || s.failureMode) && (s.quickFix || s.tip),
  );
  if (withFail.length < 4) fail(`${k.id}: ≥4 steps need fail + fix`);
  if ((k.beforeYouStart ?? []).length < 3) fail(`${k.id}: beforeYouStart needs ≥3`);
  const seat = k.seatingSequence ?? [];
  const wet = seat.some((p) => /moist|wet/i.test(`${p.phase} ${p.action}`));
  if (seat.length < 5 && !wet)
    fail(`${k.id}: seating needs 5 phases or a wet set (have ${seat.length})`);
  const urls = (k.resources ?? []).filter((r) => /^https?:\/\//.test(r.url));
  if (urls.length < 2) fail(`${k.id}: resources need ≥2 URLs`);
  if ((k.sources ?? []).length < 2) fail(`${k.id}: sources need ≥2`);
  if (!k.video?.id) fail(`${k.id}: cited video required`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(k.reviewedOn ?? "")) fail(`${k.id}: reviewedOn required`);
  if (!k.strengthRetentionTypical || k.strengthRetentionTypical.length < 16) {
    fail(`${k.id}: retention must be a cited band or an explicit unknown`);
  }
  if (!k.diagramKind) fail(`${k.id}: diagramKind required`);
  const verify = [
    k.fingerprint?.expectedGeometry,
    k.fingerprint?.expectedSeatingPattern,
    k.fingerprint?.expectedTagOrientation,
    k.fingerprint?.expectedCoilDistribution,
  ].filter(Boolean);
  if (verify.length < 4) fail(`${k.id}: fingerprint verify needs ≥4 lines`);
}

if (failed === 0) {
  ok(`${all.length} hydrated connections meet the teaching record bar`);
  ok(`${FISHING_KNOTS.length} fishing · ${BOATING_KNOTS.length} boating`);
}

for (const line of report) console.log(line);
if (failed) {
  console.error(`\n${failed} teaching-record gaps`);
  process.exit(1);
}
console.log("\nSeed completeness PASSED");
