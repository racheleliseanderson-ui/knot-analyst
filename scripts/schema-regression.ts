/**
 * Schema 2.0 golden regression — flat inputs must stay byte-stable.
 *
 * Run: npx tsx scripts/schema-regression.ts
 * Exit 0 on match; non-zero with a diff summary on drift.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runChooser } from "../src/engine/chooser";
import { FIELD_SCENARIOS } from "../src/data/scenarios";
import type { ChooseInput } from "../src/domain/types";
import { dualWriteFromConnection } from "../src/domain/connection-preset";
import { relationFromDiameters } from "../src/domain/diameter";
import { materialModifier, resolveMaterial } from "../src/domain/material";
import { FISHING_MATERIAL_PRESETS } from "../src/domains/fishing/materials";
import { candidateTerminations } from "../src/domain/termination";

const __dir = dirname(fileURLToPath(import.meta.url));
const goldens = JSON.parse(readFileSync(join(__dir, "schema-goldens.json"), "utf8")) as {
  cases: Record<string, { top: string[]; elim: number; conf: string; term: string | null }>;
};

const extras: { id: string; input: ChooseInput }[] = [
  {
    id: "flat-braid-leader",
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "main-much-thinner",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "flat-terminal-mono",
    input: { connection: "line-to-hook", mainMaterial: "mono", proficiency: "beginner" },
  },
  {
    id: "blood-similar",
    input: {
      connection: "leader-to-leader",
      mainMaterial: "fluoro",
      secondaryMaterial: "fluoro",
      diameterRelation: "similar",
    },
  },
  {
    id: "extreme-mismatch-guides",
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "extreme-mismatch",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
];

function fingerprint(input: ChooseInput) {
  const r = runChooser(input);
  return {
    top: r.ranked.slice(0, 5).map((o) => `${o.knot.id}:${o.fieldFitPercent}`),
    elim: r.eliminated.length,
    conf: r.confidence,
    term: r.termination?.method ?? null,
  };
}

function eq(a: unknown, b: unknown) {
  return JSON.stringify(a) === JSON.stringify(b);
}

let failed = 0;
const report: string[] = [];

function check(id: string, input: ChooseInput) {
  const expected = goldens.cases[id];
  if (!expected) {
    report.push(`MISS golden for ${id}`);
    failed++;
    return;
  }
  const got = fingerprint(input);
  if (!eq(got, expected)) {
    failed++;
    report.push(
      `DRIFT ${id}\n  expected ${JSON.stringify(expected)}\n  got      ${JSON.stringify(got)}`,
    );
  } else {
    report.push(`ok  ${id}`);
  }
}

for (const s of FIELD_SCENARIOS) check(s.id, s.input);
for (const e of extras) check(e.id, e.input);

// Dual-write must not change flat ranking
{
  const base: ChooseInput = {
    connection: "braid-to-leader",
    mainMaterial: "braid",
    secondaryMaterial: "fluoro",
    diameterRelation: "main-much-thinner",
    mustPassGuides: true,
    retieFrequency: "rare",
    proficiency: "advanced",
  };
  const dual = dualWriteFromConnection(base.connection);
  const withDual: ChooseInput = { ...base, ...dual };
  if (!eq(fingerprint(base).top, fingerprint(withDual).top)) {
    failed++;
    report.push("DRIFT dual-write changed flat braid-leader ranking");
  } else {
    report.push("ok  dual-write-stable");
  }
}

// Default resolveMaterial braid (no construction) must be zero modifier
{
  const spec = resolveMaterial("braid", FISHING_MATERIAL_PRESETS);
  const mod = materialModifier(spec);
  if (mod.slipPenalty !== 0 || mod.seatingPenalty !== 0) {
    failed++;
    report.push(`DRIFT flat braid modifier not zero: ${JSON.stringify(mod)}`);
  } else {
    report.push("ok  flat-braid-modifier-zero");
  }
}

// Declared construction must move the model
{
  const spec = resolveMaterial("braid", FISHING_MATERIAL_PRESETS, {
    construction: "hollow-core",
  });
  const mod = materialModifier(spec);
  if (mod.slipPenalty < 10) {
    failed++;
    report.push("FAIL hollow-core should raise slip penalty");
  } else {
    report.push("ok  hollow-core-modifier");
  }
  const terms = candidateTerminations(spec);
  if (!terms.some((t) => t.method === "splice")) {
    failed++;
    report.push("FAIL hollow-core should surface splice termination candidates");
  } else {
    report.push("ok  hollow-core-termination-candidates");
  }
}

// mm → relation mapping
{
  const r = relationFromDiameters(0.18, 0.43);
  if (r !== "main-much-thinner" && r !== "extreme-mismatch") {
    failed++;
    report.push(`FAIL 0.18→0.43 expected large step, got ${r}`);
  } else {
    report.push(`ok  mm-relation (${r})`);
  }
  const same = relationFromDiameters(0.3, 0.31);
  if (same !== "similar") {
    failed++;
    report.push(`FAIL near-equal diameters should be similar, got ${same}`);
  } else {
    report.push("ok  mm-similar");
  }
}

// mm inputs must map into same ranking band as explicit relation
{
  const band: ChooseInput = {
    connection: "braid-to-leader",
    mainMaterial: "braid",
    secondaryMaterial: "fluoro",
    diameterRelation: "main-much-thinner",
    mustPassGuides: true,
    retieFrequency: "rare",
    proficiency: "advanced",
  };
  const mm: ChooseInput = {
    connection: "braid-to-leader",
    mainMaterial: "braid",
    secondaryMaterial: "fluoro",
    mainDiameterMm: 0.18,
    secondaryDiameterMm: 0.4,
    mustPassGuides: true,
    retieFrequency: "rare",
    proficiency: "advanced",
  };
  const bandTop = fingerprint(band).top[0]?.split(":")[0];
  const mmTop = fingerprint(mm).top[0]?.split(":")[0];
  if (bandTop !== mmTop) {
    failed++;
    report.push(`DRIFT mm path top ${mmTop} vs band ${bandTop}`);
  } else {
    report.push(`ok  mm-path-matches-band (${mmTop})`);
  }
}

console.log(report.join("\n"));
console.log(failed === 0 ? "\nSchema regression PASSED" : `\nSchema regression FAILED (${failed})`);
process.exit(failed === 0 ? 0 : 1);
