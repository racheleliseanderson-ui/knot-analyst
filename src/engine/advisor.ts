/**
 * Layer 2.5 — Decision advisory.
 * Pure functions over an existing ChooseResult. No scoring authority:
 * it never promotes a knot the constraint engine eliminated.
 */
import { runChooser } from "@/engine/chooser";
import type { ChooseInput, ChooseResult, RankedOption } from "@/domain/types";
import { CONNECTION_LABELS, DIMENSION_LABELS, MATERIAL_LABELS } from "@/domain/types";
import { failsWhenFor } from "@/data/connection-model-meta";

export interface Tradeoff {
  id: string;
  axis: string;
  tension: string;
  detail: string;
  alternative?: { knotId: string; name: string; gain: string };
}

export interface Counterfactual {
  id: string;
  question: string;
  verdict: "holds" | "changes" | "no-valid-option";
  answer: string;
}

export interface DecisionCard {
  status: "recommended" | "constrained" | "no-valid-option";
  knotId?: string;
  knotName?: string;
  fieldFit?: number;
  jobLine: string;
  systemLine: string;
  conditionLine: string;
  reasons: string[];
  retieNotes: string[];
  watchFor: string[];
  runnerUp?: { name: string; fieldFit: number; when: string };
  confidence: ChooseResult["confidence"];
  eliminatedCount: number;
}

const dim = (opt: RankedOption, key: string) =>
  opt.dimensionScores.find((d) => d.dimension === key)?.score ?? 60;

function bestAlternativeOn(ranked: RankedOption[], key: string, top: RankedOption) {
  const better = ranked
    .slice(1)
    .filter((o) => dim(o, key) >= dim(top, key) + 8)
    .sort((a, b) => dim(b, key) - dim(a, key))[0];
  return better;
}

/** Where the stated conditions actively fight the winning geometry. */
export function detectTradeoffs(result: ChooseResult): Tradeoff[] {
  const top = result.ranked[0];
  if (!top) return [];
  const input = result.input;
  const out: Tradeoff[] = [];

  const push = (id: string, axis: string, tension: string, detail: string, key: string) => {
    const alt = bestAlternativeOn(result.ranked, key, top);
    out.push({
      id,
      axis,
      tension,
      detail,
      ...(alt
        ? {
            alternative: {
              knotId: alt.knot.id,
              name: alt.knot.name,
              gain: `${DIMENSION_LABELS[key as keyof typeof DIMENSION_LABELS]} ${dim(alt, key)} vs ${dim(top, key)}`,
            },
          }
        : {}),
    });
  };

  if (input.retieFrequency === "frequent" && dim(top, "retieSpeed") < 70) {
    push(
      "strength-vs-speed",
      "Maximum strength vs retie tempo",
      "You retie often, and this geometry is slow to rebuild.",
      `${top.knot.name} scores ${dim(top, "retieSpeed")} on retie speed. Over a day of frequent reties that cost is real, and a rushed version of this knot is weaker than a clean simpler one.`,
      "retieSpeed",
    );
  }
  if (input.coldHands && dim(top, "coldWetHandDifficulty") < 70) {
    push(
      "cold-hands",
      "Precision vs cold, wet hands",
      "This knot needs finger control you may not have.",
      `Cold/wet handling scores ${dim(top, "coldWetHandDifficulty")}. Degraded dexterity shows up as crossed wraps and partial seats — the two defects this family punishes hardest.`,
      "coldWetHandDifficulty",
    );
  }
  if (input.windy && dim(top, "windSensitivity") < 70) {
    push(
      "wind",
      "Tag control vs wind",
      "Loose tags and long wrap sequences misbehave in wind.",
      `Wind sensitivity scores ${dim(top, "windSensitivity")}. If you cannot hold tension on the tag, build it in the lee of the boat or step down to a shorter sequence.`,
      "windSensitivity",
    );
  }
  if (input.lowLight && dim(top, "inspectionDifficulty") < 70) {
    push(
      "low-light",
      "Inspectability vs low light",
      "You will not be able to verify this structure by eye.",
      `Inspection difficulty scores ${dim(top, "inspectionDifficulty")}. In low light, treat every finished knot as unverified: load-test it before you trust it.`,
      "inspectionDifficulty",
    );
  }
  if (input.mustPassGuides && dim(top, "guidePassage") < 72) {
    push(
      "guides",
      "Holding power vs guide passage",
      "The winning profile is bulkier than your guides want.",
      `Guide passage scores ${dim(top, "guidePassage")}. Expect tick-through on the cast and watch the join for guide abrasion.`,
      "guidePassage",
    );
  }

  // Skill / proficiency — tightened so advanced users on hard geometries (FG baseline 40 +25 = 65)
  // no longer receive a false “above the skill level you declared” warning.
  if (input.proficiency && input.proficiency !== "any") {
    const skillScore = dim(top, "userProficiency");
    const declared = input.proficiency;
    const isHardGeometry = top.knot.difficulty === "advanced";

    // Fire only when the fit is genuinely poor relative to what was declared.
    const shouldWarn =
      (declared === "beginner" && skillScore < 70) ||
      (declared === "intermediate" && skillScore < 62) ||
      (declared === "advanced" && skillScore < 55) || // after the +25 boost this is rare
      (declared === "advanced" && isHardGeometry && skillScore < 58);

    if (shouldWarn) {
      const tension =
        declared === "advanced"
          ? "Even with advanced hands, this geometry remains marginal under the other active constraints."
          : "This is above the skill level you declared.";
      const detail =
        declared === "advanced"
          ? `Proficiency fit scores ${skillScore}. The advanced boost is already applied; residual low score means other conditions (cold, wind, frequent retie, etc.) are still fighting the geometry. Practice at the bench before you rely on it.`
          : `Proficiency fit scores ${skillScore}. Tie it at the bench before you rely on it on the water; a mis-tied superior knot loses to a clean simple one.`;

      push("skill", "Best geometry vs stated proficiency", tension, detail, "userProficiency");
    }
  }
  return out;
}

const VARIANTS: {
  id: string;
  question: string;
  patch: Partial<ChooseInput>;
  skip?: (i: ChooseInput) => boolean;
}[] = [
  {
    id: "cold-wind",
    question: "What if the wind picks up and your hands go cold?",
    patch: { windy: true, coldHands: true },
    skip: (i) => Boolean(i.windy && i.coldHands),
  },
  {
    id: "calm",
    question: "What if conditions were calm with warm hands?",
    patch: { windy: false, coldHands: false, lowLight: false },
    skip: (i) => !i.windy && !i.coldHands && !i.lowLight,
  },
  {
    id: "guides",
    question: "What if this connection must pass through the guides?",
    patch: { mustPassGuides: true },
    skip: (i) => Boolean(i.mustPassGuides),
  },
  {
    id: "frequent",
    question: "What if you had to rebuild it every twenty minutes?",
    patch: { retieFrequency: "frequent" },
    skip: (i) => i.retieFrequency === "frequent",
  },
  {
    id: "beginner",
    question: "What if you were tying this with unpracticed hands?",
    patch: { proficiency: "beginner" },
    skip: (i) => i.proficiency === "beginner",
  },
  {
    id: "small-eye",
    question: "What if the hardware eye were too small for doubled line?",
    patch: { hardwareEyeSmall: true },
    skip: (i) =>
      Boolean(i.hardwareEyeSmall) ||
      !["line-to-hook", "line-to-lure", "line-to-swivel"].includes(i.connection),
  },
  // New probes (still limited to 4 displayed)
  {
    id: "free-swing",
    question: "What if the lure must swing freely (non-slip / open loop required)?",
    patch: { freeSwing: true },
    skip: (i) => Boolean(i.freeSwing),
  },
  {
    id: "must-untie",
    question: "What if you need to untie this connection later without cutting?",
    patch: { needsUntie: true },
    skip: (i) => Boolean(i.needsUntie),
  },
];

/** Re-runs the deterministic engine under altered conditions. */
export function counterfactuals(result: ChooseResult, limit = 4): Counterfactual[] {
  const top = result.ranked[0];
  if (!top) return [];
  const out: Counterfactual[] = [];
  for (const v of VARIANTS) {
    if (out.length >= limit) break;
    if (v.skip?.(result.input)) continue;
    const alt = runChooser({ ...result.input, ...v.patch });
    const altTop = alt.ranked[0];
    if (!altTop) {
      out.push({
        id: v.id,
        question: v.question,
        verdict: "no-valid-option",
        answer: "No knot in the model survives that combination. The job would have to change.",
      });
      continue;
    }
    if (altTop.knot.id === top.knot.id) {
      out.push({
        id: v.id,
        question: v.question,
        verdict: "holds",
        answer: `${top.knot.name} still leads (${altTop.fieldFitPercent}% vs ${top.fieldFitPercent}% here).`,
      });
    } else {
      out.push({
        id: v.id,
        question: v.question,
        verdict: "changes",
        answer:
          `Recommendation switches to ${altTop.knot.name} at ${altTop.fieldFitPercent}%. ${altTop.whyBest[0] ?? ""}`.trim(),
      });
    }
  }
  return out;
}

export function buildDecisionCard(result: ChooseResult): DecisionCard {
  const top = result.ranked[0];
  const second = result.ranked[1];
  const i = result.input;

  const systemBits = [
    i.mainMaterial ? MATERIAL_LABELS[i.mainMaterial] : null,
    i.secondaryMaterial ? MATERIAL_LABELS[i.secondaryMaterial] : null,
  ].filter(Boolean) as string[];

  const conditions = [
    i.windy ? "wind" : null,
    i.coldHands ? "cold/wet hands" : null,
    i.lowLight ? "low light" : null,
    i.mustPassGuides ? "must pass guides" : null,
    i.hardwareEyeSmall ? "small eye" : null,
    i.freeSwing ? "free-swing required" : null,
    i.needsUntie ? "must untie" : null,
    i.retieFrequency ? `${i.retieFrequency} reties` : null,
  ].filter(Boolean) as string[];

  const base = {
    jobLine: CONNECTION_LABELS[i.connection],
    systemLine: systemBits.length ? systemBits.join(" → ") : "materials unspecified",
    conditionLine: conditions.length ? conditions.join(" · ") : "no field conditions declared",
    confidence: result.confidence,
    eliminatedCount: result.eliminated.length,
  };

  if (!top) {
    return {
      ...base,
      status: "no-valid-option",
      reasons: [],
      retieNotes: [],
      watchFor: [
        "Every candidate failed a hard constraint. The model will not invent a match.",
        "Relax one input — usually diameter relation or material — and re-run.",
      ],
    };
  }

  const c = top.knot.contract;
  const retieNotes = [
    c.seatingRequirements,
    `Tension profile: ${c.tensionRequirements}. Slip sensitivity: ${c.slipSensitivity}.`,
    ...c.failureSensitiveStages.slice(0, 2).map((s) => `Failure-sensitive stage: ${s}`),
  ].filter(Boolean);

  const watchFor: string[] = [];
  const seen = new Set<string>();
  for (const line of [...failsWhenFor(top.knot.id, top.knot.commonMistakes), ...top.butNotes]) {
    if (!line || seen.has(line)) continue;
    seen.add(line);
    watchFor.push(line);
    if (watchFor.length >= 4) break;
  }

  return {
    ...base,
    status: top.fieldFitPercent >= 70 ? "recommended" : "constrained",
    knotId: top.knot.id,
    knotName: top.knot.name,
    fieldFit: top.fieldFitPercent,
    reasons: top.whyBest.slice(0, 4),
    retieNotes,
    watchFor,
    ...(second
      ? {
          runnerUp: {
            name: second.knot.name,
            fieldFit: second.fieldFitPercent,
            when:
              result.tradeoffSummary ??
              `${second.knot.name} is the fallback if the primary will not seat cleanly.`,
          },
        }
      : {}),
  };
}
