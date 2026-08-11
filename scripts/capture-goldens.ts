import { runChooser } from "../src/engine/chooser";
import { FIELD_SCENARIOS } from "../src/data/scenarios";
import type { ChooseInput } from "../src/domain/types";

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

const out: Record<string, unknown> = {};
for (const s of FIELD_SCENARIOS) {
  out[s.id] = fingerprint(s.input);
}
for (const e of extras) {
  out[e.id] = fingerprint(e.input);
}
console.log(JSON.stringify(out, null, 2));
