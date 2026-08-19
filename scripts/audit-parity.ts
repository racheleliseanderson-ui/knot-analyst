/**
 * Compare fishing vs boating modelled records at the layers the app uses.
 * Run: npx tsx scripts/audit-parity.ts
 */
import { FISHING_KNOTS, BOATING_KNOTS } from "../src/data/catalog";
import { getConnectionModelMeta } from "../src/data/connection-model-meta";

function avg(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0;
}
function med(xs: number[]) {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)];
}
function n(v: unknown) {
  return typeof v === "string" ? v.trim().length : 0;
}

type Row = {
  id: string;
  steps: number;
  instr: number;
  detail: number;
  expect: number;
  look: number;
  fail: number;
  fix: number;
  before: number;
  seat: number;
  notes: number;
  diag: number;
  sources: number;
  related: number;
  mistakes: number;
  video: number;
  fpGeo: number;
  defects: number;
  rules: number;
  strengths: number;
  weaknesses: number;
  band: number;
  failsWhen: number;
  goodFor: number;
  summary: number;
  typical: number;
};

function measure(k: (typeof FISHING_KNOTS)[number]): Row {
  const steps = k.steps ?? [];
  const meta = getConnectionModelMeta(k.id);
  return {
    id: k.id,
    steps: steps.length,
    instr: avg(steps.map((s) => n(s.instruction))),
    detail: avg(steps.map((s) => n(s.detail))),
    expect: avg(steps.map((s) => n(s.expectedResult))),
    look: avg(steps.map((s) => n(s.look))),
    fail: avg(steps.map((s) => n(s.failureMode))),
    fix: avg(steps.map((s) => n(s.quickFix))),
    before: k.beforeYouStart?.length ?? 0,
    seat: k.seatingSequence?.length ?? 0,
    notes: k.fieldNotes?.length ?? 0,
    diag: k.diagnostics?.length ?? 0,
    sources: k.sources?.length ?? 0,
    related: k.relatedKnots?.length ?? 0,
    mistakes: k.commonMistakes?.length ?? 0,
    video: k.video ? 1 : 0,
    fpGeo: n(k.fingerprint?.expectedGeometry),
    defects: k.fingerprint?.dangerousDefects?.length ?? 0,
    rules: k.fingerprint?.geometricRules?.length ?? 0,
    strengths: k.fieldFit?.strengths?.length ?? 0,
    weaknesses: k.fieldFit?.weaknesses?.length ?? 0,
    band: n(meta?.strengthRetentionBand.note),
    failsWhen: meta?.failsWhen.length ?? 0,
    goodFor: n(k.goodFor),
    summary: n(k.howToSummary),
    typical: n(k.strengthRetentionTypical),
  };
}

function report(label: string, rows: Row[]) {
  const keys = Object.keys(rows[0]!).filter((k) => k !== "id") as (keyof Row)[];
  console.log(`\n=== ${label} n=${rows.length} ===`);
  console.log(
    [
      "metric".padEnd(14),
      "avg".padStart(7),
      "med".padStart(7),
      "min".padStart(7),
      "max".padStart(7),
      "zero".padStart(6),
    ].join(" "),
  );
  for (const key of keys) {
    const xs = rows.map((r) => Number(r[key]));
    const z = xs.filter((x) => x === 0).length;
    console.log(
      [
        key.padEnd(14),
        avg(xs).toFixed(1).padStart(7),
        med(xs).toFixed(1).padStart(7),
        Math.min(...xs)
          .toFixed(0)
          .padStart(7),
        Math.max(...xs)
          .toFixed(0)
          .padStart(7),
        String(z).padStart(6),
      ].join(" "),
    );
  }
}

function thin(rows: Row[], key: keyof Row, thresh: number) {
  return rows.filter((r) => Number(r[key]) < thresh).map((r) => `${r.id}:${r[key]}`);
}

const F = FISHING_KNOTS.map(measure);
const B = BOATING_KNOTS.map(measure);
report("FISHING", F);
report("BOATING", B);

console.log("\n=== BOATING thin vs fishing medians ===");
const medF = (k: keyof Row) => med(F.map((r) => Number(r[k])));
for (const key of [
  "detail",
  "expect",
  "look",
  "fail",
  "fix",
  "fpGeo",
  "defects",
  "rules",
  "strengths",
  "goodFor",
  "summary",
  "typical",
  "band",
] as const) {
  const m = medF(key);
  const below = B.filter((r) => Number(r[key]) < m * 0.6);
  console.log(
    `${key} fishing-med=${m.toFixed(0)}  boating-below-60%med=${below.length}/${B.length}  ${below
      .slice(0, 12)
      .map((r) => `${r.id}:${r[key]}`)
      .join(", ")}`,
  );
}

console.log("\n=== generic fingerprint? ===");
for (const k of BOATING_KNOTS) {
  if (k.fingerprint?.expectedGeometry === "Dressed rope-work structure") {
    console.log("generic-geo", k.id);
  }
}

console.log("\n=== fishing sample palomar ===");
const p = FISHING_KNOTS.find((k) => k.id === "palomar")!;
console.log({
  geo: p.fingerprint.expectedGeometry,
  defects: p.fingerprint.dangerousDefects.map((d) => d.label),
  rules: p.fingerprint.geometricRules?.map((r) => r.id),
  strengths: p.fieldFit.strengths,
  weaknesses: p.fieldFit.weaknesses,
  detail0: p.steps[0]?.detail?.slice(0, 140),
  look0: p.steps[0]?.look?.slice(0, 140),
});

console.log("\n=== boating sample cleat ===");
const c = BOATING_KNOTS.find((k) => k.id === "cleat-hitch")!;
console.log({
  geo: c.fingerprint.expectedGeometry,
  defects: c.fingerprint.dangerousDefects.map((d) => d.label),
  rules: c.fingerprint.geometricRules?.map((r) => r.id),
  strengths: c.fieldFit.strengths,
  weaknesses: c.fieldFit.weaknesses,
  detail0: c.steps[0]?.detail?.slice(0, 140),
  look0: c.steps[0]?.look?.slice(0, 140),
  before: c.beforeYouStart,
  notes: c.fieldNotes,
});
