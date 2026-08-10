/**
 * Quick-compare — run two scenarios through the same engine and attribute the
 * difference in recommendation to the specific constraints that changed.
 *
 * Attribution is done by probing the engine, never by guessing: for each
 * differing constraint we revert that one field on side B and re-run. If the
 * answer snaps back to side A's knot, that constraint is decisive.
 */
import type { ChooseInput, ChooseResult } from "@/domain/types";
import {
  CONNECTION_LABELS,
  DIAMETER_LABELS,
  DIFFICULTY_LABELS,
  MATERIAL_LABELS,
} from "@/domain/types";
import { runChooser } from "./chooser";

export type ConstraintKey =
  | "connection"
  | "mainMaterial"
  | "secondaryMaterial"
  | "diameterRelation"
  | "mustPassGuides"
  | "windy"
  | "coldHands"
  | "lowLight"
  | "retieFrequency"
  | "proficiency"
  | "hardwareEyeSmall"
  | "needsUntie"
  | "freeSwing";

export const CONSTRAINT_FIELDS: { key: ConstraintKey; label: string }[] = [
  { key: "connection", label: "Connection job" },
  { key: "mainMaterial", label: "Main line" },
  { key: "secondaryMaterial", label: "Leader" },
  { key: "diameterRelation", label: "Diameter relationship" },
  { key: "mustPassGuides", label: "Must pass guides" },
  { key: "windy", label: "Wind" },
  { key: "coldHands", label: "Cold / wet hands" },
  { key: "lowLight", label: "Low light" },
  { key: "retieFrequency", label: "Retie frequency" },
  { key: "proficiency", label: "Proficiency" },
  { key: "hardwareEyeSmall", label: "Small hardware eye" },
  { key: "needsUntie", label: "Must untie later" },
  { key: "freeSwing", label: "Free-swinging attachment" },
];

export function constraintValueLabel(key: ConstraintKey, value: unknown): string {
  if (value === undefined || value === null || value === false) return "—";
  if (value === true) return "yes";
  const v = String(value);
  switch (key) {
    case "connection":
      return CONNECTION_LABELS[v as keyof typeof CONNECTION_LABELS] ?? v;
    case "mainMaterial":
    case "secondaryMaterial":
      return MATERIAL_LABELS[v as keyof typeof MATERIAL_LABELS] ?? v;
    case "diameterRelation":
      return DIAMETER_LABELS[v as keyof typeof DIAMETER_LABELS] ?? v;
    case "proficiency":
      return v === "any" ? "Any" : (DIFFICULTY_LABELS[v as keyof typeof DIFFICULTY_LABELS] ?? v);
    case "retieFrequency":
      return v === "frequent" ? "Frequent" : v === "occasional" ? "Occasional" : "Rare";
    default:
      return v;
  }
}

export interface ConstraintDelta {
  key: ConstraintKey;
  label: string;
  a: string;
  b: string;
  /** Reverting this one field on B restores A's recommendation. */
  decisive: boolean;
  /** Field-fit points this single field is worth on side B (signed). */
  fitImpact: number;
  /** Knot B would recommend if this one field matched A. */
  probeKnot?: string;
}

export interface ComparisonResult {
  a: ChooseResult;
  b: ChooseResult;
  deltas: ConstraintDelta[];
  sameAnswer: boolean;
  /** Constraints that alone flip the answer back. */
  decisive: ConstraintDelta[];
  verdict: string;
}

const topId = (r: ChooseResult) => r.ranked[0]?.knot.id;
const topName = (r: ChooseResult) => r.ranked[0]?.knot.name ?? "no valid option";
const topFit = (r: ChooseResult) => r.ranked[0]?.fieldFitPercent ?? 0;

export function diffInputs(a: ChooseInput, b: ChooseInput): ConstraintKey[] {
  return CONSTRAINT_FIELDS.filter(({ key }) => {
    const av = a[key] ?? undefined;
    const bv = b[key] ?? undefined;
    return (av ?? false) !== (bv ?? false);
  }).map((f) => f.key);
}

export function runComparison(a: ChooseInput, b: ChooseInput): ComparisonResult {
  const ra = runChooser(a);
  const rb = runChooser(b);
  const changed = diffInputs(a, b);

  const deltas: ConstraintDelta[] = changed.map((key) => {
    const field = CONSTRAINT_FIELDS.find((f) => f.key === key)!;
    const probeInput = { ...b, [key]: a[key] } as ChooseInput;
    const probe = runChooser(probeInput);
    return {
      key,
      label: field.label,
      a: constraintValueLabel(key, a[key]),
      b: constraintValueLabel(key, b[key]),
      decisive: Boolean(topId(probe)) && topId(probe) === topId(ra) && topId(ra) !== topId(rb),
      fitImpact: topFit(rb) - topFit(probe),
      probeKnot: topName(probe),
    };
  });

  deltas.sort(
    (x, y) => Number(y.decisive) - Number(x.decisive) || Math.abs(y.fitImpact) - Math.abs(x.fitImpact),
  );

  const sameAnswer = Boolean(topId(ra)) && topId(ra) === topId(rb);
  const decisive = deltas.filter((d) => d.decisive);

  let verdict: string;
  if (!topId(ra) || !topId(rb)) {
    verdict = `One side fails closed: ${!topId(ra) ? "A" : "B"} has no valid connection under hard constraints. That is a Layer 1 elimination, not a preference.`;
  } else if (sameAnswer) {
    const spread = Math.abs(topFit(ra) - topFit(rb));
    verdict = changed.length
      ? `Same connection both sides — ${topName(ra)} survives all ${changed.length} constraint change${changed.length === 1 ? "" : "s"}, ${spread ? `with ${spread} points of field-fit spread.` : "at identical field fit."}`
      : "Identical inputs. Change something on one side to see what the model is sensitive to.";
  } else if (decisive.length === 1) {
    verdict = `${decisive[0]!.label} alone flips the answer: ${topName(ra)} → ${topName(rb)}.`;
  } else if (decisive.length > 1) {
    verdict = `${decisive.length} constraints each flip the answer on their own — ${decisive.map((d) => d.label.toLowerCase()).join(", ")}. The change is over-determined.`;
  } else {
    verdict = `${topName(ra)} → ${topName(rb)}, but no single constraint flips it back. The change is cumulative across ${changed.length} field${changed.length === 1 ? "" : "s"}.`;
  }

  return { a: ra, b: rb, deltas, sameAnswer, decisive, verdict };
}