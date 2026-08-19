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
  DIMENSION_LABELS,
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

export interface DimensionDelta {
  dimension: string;
  label: string;
  /** Signed points: probe score minus side-B score. */
  delta: number;
  weight: number;
}

export interface EliminationEvidence {
  knotName: string;
  reasons: string[];
}

export interface ConstraintDelta {
  key: ConstraintKey;
  label: string;
  a: string;
  b: string;
  /** Reverting this one field on B restores A's recommendation. */
  decisive: boolean;
  /** Reverting this field changes B's answer, even if not back to A's. */
  changesAnswer: boolean;
  /** Field-fit points this single field is worth on side B (signed). */
  fitImpact: number;
  /** Knot B would recommend if this one field matched A. */
  probeKnot?: string;
  /** Field fit of the probe recommendation. */
  probeFit: number;
  /** hard = this field removes options at Layer 1; soft = Layer 2 weighting only. */
  kind: "hard" | "soft";
  /** Knots eliminated on B that survive once this field is reverted. */
  eliminatedByField: EliminationEvidence[];
  /** Reference knot used for the dimension comparison. */
  referenceKnot?: string;
  /** Per-dimension movement (probe minus B) for the reference knot. */
  dimensionDeltas: DimensionDelta[];
  /** Top-4 ordering on side B and on the reverted probe. */
  orderB: string[];
  orderProbe: string[];
}

export interface PipelineStage {
  id: "eliminate" | "rank" | "probe" | "attribute";
  label: string;
  detail: string;
  ms: number;
}

export interface ComparisonResult {
  a: ChooseResult;
  b: ChooseResult;
  deltas: ConstraintDelta[];
  sameAnswer: boolean;
  /** Constraints that alone flip the answer back. */
  decisive: ConstraintDelta[];
  verdict: string;
  runId: string;
  ranAt: string;
  stages: PipelineStage[];
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
  const t0 = now();
  const ra = runChooser(a);
  const rb = runChooser(b);
  const tRun = now();
  const changed = diffInputs(a, b);

  const deltas: ConstraintDelta[] = changed.map((key) => {
    const field = CONSTRAINT_FIELDS.find((f) => f.key === key)!;
    const probeInput = { ...b, [key]: a[key] } as ChooseInput;
    const probe = runChooser(probeInput);

    const probeElim = new Set(probe.eliminated.map((e) => e.knotId));
    const eliminatedByField: EliminationEvidence[] = rb.eliminated
      .filter((e) => !probeElim.has(e.knotId))
      .map((e) => ({ knotName: e.knotName, reasons: e.reasons }))
      .slice(0, 6);

    const refOption =
      rb.ranked.find((o) => probe.ranked.some((p) => p.knot.id === o.knot.id)) ?? rb.ranked[0];
    const probeRef = refOption
      ? probe.ranked.find((p) => p.knot.id === refOption.knot.id)
      : undefined;
    const dimensionDeltas: DimensionDelta[] =
      refOption && probeRef
        ? refOption.dimensionScores.map((ds) => {
            const other = probeRef.dimensionScores.find((p) => p.dimension === ds.dimension);
            return {
              dimension: ds.dimension,
              label: DIMENSION_LABELS[ds.dimension] ?? ds.dimension,
              delta: Math.round((other?.score ?? ds.score) - ds.score),
              weight: ds.weight,
            };
          })
        : [];

    return {
      key,
      label: field.label,
      a: constraintValueLabel(key, a[key]),
      b: constraintValueLabel(key, b[key]),
      decisive: Boolean(topId(probe)) && topId(probe) === topId(ra) && topId(ra) !== topId(rb),
      changesAnswer: topId(probe) !== topId(rb),
      fitImpact: topFit(rb) - topFit(probe),
      probeKnot: topName(probe),
      probeFit: topFit(probe),
      kind:
        eliminatedByField.length || probe.eliminated.length !== rb.eliminated.length
          ? "hard"
          : "soft",
      eliminatedByField,
      ...(refOption ? { referenceKnot: refOption.knot.name } : {}),
      dimensionDeltas,
      orderB: rb.ranked.slice(0, 4).map((o) => o.knot.name),
      orderProbe: probe.ranked.slice(0, 4).map((o) => o.knot.name),
    };
  });
  const tProbe = now();

  deltas.sort(
    (x, y) =>
      Number(y.decisive) - Number(x.decisive) ||
      Number(y.changesAnswer) - Number(x.changesAnswer) ||
      Math.abs(y.fitImpact) - Math.abs(x.fitImpact),
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

  const tEnd = now();
  const stages: PipelineStage[] = [
    {
      id: "eliminate",
      label: "Eliminate",
      detail: `${rb.eliminated.length} removed on B · ${ra.eliminated.length} on A`,
      ms: round2((tRun - t0) * 0.5),
    },
    {
      id: "rank",
      label: "Rank",
      detail: `${rb.ranked.length} ranked on B · ${ra.ranked.length} on A`,
      ms: round2((tRun - t0) * 0.5),
    },
    {
      id: "probe",
      label: "Probe",
      detail: `${deltas.length} single-field revert${deltas.length === 1 ? "" : "s"} re-run`,
      ms: round2(tProbe - tRun),
    },
    {
      id: "attribute",
      label: "Attribute",
      detail: `${decisive.length} decisive · ${deltas.filter((d) => d.changesAnswer && !d.decisive).length} partial`,
      ms: round2(tEnd - tProbe),
    },
  ];

  return {
    a: ra,
    b: rb,
    deltas,
    sameAnswer,
    decisive,
    verdict,
    runId: `CMP-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    ranAt: new Date().toISOString(),
    stages,
  };
}

function now(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
