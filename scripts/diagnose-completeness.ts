/**
 * Teaching bar for Diagnose plays and starters.
 * Every symptom must be fully seeded. Starters must resolve to a known play.
 * Every play must have at least one scenario starter.
 *
 * Run: npx tsx scripts/diagnose-completeness.ts
 */
import { FAILURE_PLAYS, playsForDomain } from "../src/data/failure-playbook";
import { DIAGNOSE_STARTERS } from "../src/data/diagnose-starters";
import { runTroubleshoot } from "../src/engine/troubleshoot";
import { runChooser } from "../src/engine/chooser";
import { buildDecisionCard } from "../src/engine/advisor";
import { tackleHandoffFromDiagnosis } from "../src/lib/tackle-handoff";
import { failsWhenFor } from "../src/data/connection-model-meta";

let failed = 0;
const report: string[] = [];

function fail(msg: string) {
  failed += 1;
  report.push(`FAIL  ${msg}`);
}

function ok(msg: string) {
  report.push(`ok    ${msg}`);
}

const ids = new Set<string>();
for (const p of FAILURE_PLAYS) {
  if (ids.has(p.id)) fail(`${p.id}: duplicate play`);
  ids.add(p.id);
  if (!p.title?.trim()) fail(`${p.id}: title`);
  if (!p.plain || p.plain.length < 20) fail(`${p.id}: plain too thin`);
  if (!p.meaning || p.meaning.length < 40) fail(`${p.id}: meaning too thin`);
  if ((p.questions ?? []).length < 3) fail(`${p.id}: questions need ≥3`);
  if ((p.likelyCauses ?? []).length < 4) fail(`${p.id}: likelyCauses need ≥4`);
  if ((p.checks ?? []).length < 4) fail(`${p.id}: checks need ≥4`);
  if ((p.fixes ?? []).length < 4) fail(`${p.id}: fixes need ≥4`);
  if (!p.retieWhen || p.retieWhen.length < 12) fail(`${p.id}: retieWhen`);
  if (!p.sources?.length) fail(`${p.id}: sources required`);
  if (!p.domain) fail(`${p.id}: domain`);
  if (!p.group) fail(`${p.id}: group`);
}

const starterEvents = new Set(DIAGNOSE_STARTERS.map((s) => s.input.event));
for (const p of FAILURE_PLAYS) {
  if (!starterEvents.has(p.id)) fail(`${p.id}: no scenario starter`);
}

for (const s of DIAGNOSE_STARTERS) {
  if (!ids.has(s.input.event)) fail(`starter ${s.id}: unknown event ${s.input.event}`);
  if (!s.title?.trim()) fail(`starter ${s.id}: title`);
  if (!s.line?.trim()) fail(`starter ${s.id}: line`);
  if (/\b(palomar|uni|fg|bowline|clove|cleat hitch)\b/i.test(s.title)) {
    fail(`starter ${s.id}: title names a knot — start from what failed`);
  }
  try {
    const r = runTroubleshoot(s.input);
    if (!r.title) fail(`starter ${s.id}: empty diagnosis`);
    if (!r.likelyCauses.length) fail(`starter ${s.id}: no causes`);
  } catch (e) {
    fail(`starter ${s.id}: engine threw ${e}`);
  }
}

const fishing = playsForDomain("fishing");
const boating = playsForDomain("boating");
if (fishing.length < 18) fail(`fishing plays too few (${fishing.length})`);
if (boating.length < 14) fail(`boating plays too few (${boating.length})`);

// Forensic look + location must change the story on a known slip vs cut pair
const slip = runTroubleshoot({
  event: "pigtail-left",
  breakLocation: "at-tag",
  endLook: "curly-pigtail",
  connection: "line-to-hook",
  mainMaterial: "fluoro",
});
const cut = runTroubleshoot({
  event: "clean-sever",
  breakLocation: "at-guides",
  endLook: "knot-still-on",
  connection: "line-to-hook",
  mainMaterial: "fluoro",
});
if (slip.retieDecision !== "retie-now") fail("pigtail must retie-now");
if (cut.retieDecision === "retie-now")
  fail("guide cut with knot still on must not force retie-now on the family");
const riding = runTroubleshoot({
  event: "riding-turn",
  breakLocation: "at-winch",
  connection: "load-transfer",
  mainMaterial: "polyester",
});
if (riding.retieDecision === "retie-now") fail("riding turn is not a cut-the-sheet retie-now");

const named = runTroubleshoot({
  event: "broke-under-load",
  breakLocation: "in-knot",
  connection: "line-to-hook",
  mainMaterial: "braid",
  knotId: "palomar",
});
if (!named.relatedKnot || named.relatedKnot.id !== "palomar") {
  fail("named knotId must attach relatedKnot");
}
const palomarModes = failsWhenFor("palomar");
if (!palomarModes.length) fail("palomar: modelled failsWhen missing");
if (!(named.failsWhen ?? []).some((m) => palomarModes.includes(m))) {
  fail("engine must read failsWhen when a knot is named");
}
if (!named.likelyCauses.some((c) => palomarModes.includes(c))) {
  fail("failsWhen must refine likely causes for a named knot");
}

const weakest = tackleHandoffFromDiagnosis(
  { event: "broke-under-load", breakLocation: "in-knot", connection: "line-to-hook" },
  named,
);
if (!weakest.connectionIsWeakestLink) fail("in-knot break must offer Tackle as weakest-link");
const notWeakest = tackleHandoffFromDiagnosis({
  event: "clean-sever",
  breakLocation: "above-knot",
  connection: "line-to-hook",
});
if (notWeakest.connectionIsWeakestLink) fail("above-knot must not claim the connection is weakest");

const card = buildDecisionCard(runChooser({ connection: "line-to-hook", mainMaterial: "braid" }));
if (card.knotId) {
  const modes = failsWhenFor(card.knotId);
  if (modes.length && !modes.some((m) => card.watchFor.includes(m))) {
    fail(`watch-for for ${card.knotId} does not include modelled failsWhen`);
  }
}

if (failed === 0) {
  ok(`${FAILURE_PLAYS.length} symptom plays fully seeded`);
  ok(`${DIAGNOSE_STARTERS.length} starters run through the engine`);
  ok(`${fishing.length} fishing · ${boating.length} boating (includes shared)`);
  ok("forensic look and location change retie logic");
  ok("named knot reads modelled failsWhen");
  ok("Tackle handoff only when the connection is the weakest link");
}

for (const line of report) console.log(line);
if (failed) {
  console.error(`\n${failed} diagnose gaps`);
  process.exit(1);
}
console.log("\nDiagnose completeness PASSED");
