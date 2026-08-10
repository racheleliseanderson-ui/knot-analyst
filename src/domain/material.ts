/**
 * Shared Material Intelligence — four orthogonal axes.
 *
 * The six angler-facing buttons (LineMaterial) stay exactly as they are and
 * become presets that resolve into a MaterialSpec. Every axis beyond the
 * preset is optional; when unspecified the engine behaves exactly as it did
 * before this model existed.
 */
import type { LineMaterial } from "@/domain/types";

export type MaterialFiber =
  | "nylon"
  | "fluorocarbon"
  | "uhmwpe"
  | "polyester"
  | "stainless"
  | "titanium"
  | "aramid"
  | "mixed"
  | "unspecified";

export type MaterialConstruction =
  | "monofilament"
  | "copolymer"
  | "fused-pe"
  | "braid-4"
  | "braid-8"
  | "braid-12"
  | "braid-16"
  | "hollow-core"
  | "coated-core"
  | "single-strand-wire"
  | "wire-1x7"
  | "wire-7x7"
  | "titanium-wire"
  | "twisted-multifilament"
  | "unspecified";

export type MaterialTreatment =
  | "uncoated"
  | "fluoro-coated"
  | "nylon-coated"
  | "coated-braid"
  | "gel-spun-finish"
  | "abrasion-treated"
  | "high-vis-pigment"
  | "wax-treated"
  | "unspecified";

export type MaterialRole =
  | "main-line"
  | "leader"
  | "tippet"
  | "fly-line"
  | "backing"
  | "shock-leader"
  | "unspecified";

export interface MaterialSpec {
  /** The angler-facing category this spec came from */
  category: LineMaterial;
  fiber: MaterialFiber;
  construction: MaterialConstruction;
  treatment: MaterialTreatment;
  role: MaterialRole;
}

export const FIBER_LABELS: Record<MaterialFiber, string> = {
  nylon: "Nylon",
  fluorocarbon: "Fluorocarbon",
  uhmwpe: "UHMWPE (Dyneema / Spectra)",
  polyester: "Polyester (Dacron)",
  stainless: "Stainless",
  titanium: "Titanium",
  aramid: "Aramid",
  mixed: "Mixed",
  unspecified: "Not specified",
};

export const CONSTRUCTION_LABELS: Record<MaterialConstruction, string> = {
  monofilament: "Monofilament",
  copolymer: "Copolymer mono",
  "fused-pe": "Fused PE",
  "braid-4": "4-carrier braid",
  "braid-8": "8-carrier braid",
  "braid-12": "12-carrier braid",
  "braid-16": "16-carrier braid",
  "hollow-core": "Hollow-core braid",
  "coated-core": "Coated core (fly line)",
  "single-strand-wire": "Single-strand wire",
  "wire-1x7": "1×7 multi-strand",
  "wire-7x7": "7×7 multi-strand",
  "titanium-wire": "Titanium wire",
  "twisted-multifilament": "Twisted multifilament",
  unspecified: "Not sure",
};

export const TREATMENT_LABELS: Record<MaterialTreatment, string> = {
  uncoated: "Uncoated",
  "fluoro-coated": "Fluoro-coated",
  "nylon-coated": "Nylon-coated",
  "coated-braid": "Coated braid",
  "gel-spun-finish": "Gel-spun finish",
  "abrasion-treated": "Abrasion-treated",
  "high-vis-pigment": "High-vis pigment",
  "wax-treated": "Waxed",
  unspecified: "Not sure",
};

export const ROLE_LABELS: Record<MaterialRole, string> = {
  "main-line": "Main line",
  leader: "Leader",
  tippet: "Tippet",
  "fly-line": "Fly line",
  backing: "Backing",
  "shock-leader": "Shock leader",
  unspecified: "Not specified",
};

/** A single optional disclosure row under one of the six buttons. */
export interface DisclosureRow {
  axis: "construction" | "treatment";
  label: string;
  options: { id: string; label: string }[];
}

export interface MaterialPreset {
  category: LineMaterial;
  spec: MaterialSpec;
  /** Optional deeper axes. Absent = the button is already the whole answer. */
  disclosure?: DisclosureRow[];
}

/** Widen a legacy flat material into a spec, merging any declared axes. */
export function resolveMaterial(
  category: LineMaterial | undefined,
  presets: Record<string, MaterialPreset>,
  patch?: Partial<Pick<MaterialSpec, "construction" | "treatment">>,
): MaterialSpec | undefined {
  if (!category) return undefined;
  const preset = presets[category];
  const base: MaterialSpec = preset
    ? preset.spec
    : {
        category,
        fiber: "unspecified",
        construction: "unspecified",
        treatment: "unspecified",
        role: "unspecified",
      };
  if (!patch) return base;
  return {
    ...base,
    ...(patch.construction && patch.construction !== "unspecified"
      ? { construction: patch.construction }
      : {}),
    ...(patch.treatment && patch.treatment !== "unspecified" ? { treatment: patch.treatment } : {}),
  };
}

/** True when nothing beyond the preset default has been declared. */
export function isUnspecified(spec: MaterialSpec | undefined, preset?: MaterialPreset): boolean {
  if (!spec) return true;
  if (!preset) return spec.construction === "unspecified" && spec.treatment === "unspecified";
  return (
    spec.construction === preset.spec.construction && spec.treatment === preset.spec.treatment
  );
}

export interface MaterialModifier {
  /** Score deltas, applied on top of today's situational adjustments */
  slipPenalty: number;
  seatingPenalty: number;
  inspectionPenalty: number;
  /** Human line naming the axis that caused the change */
  note?: string;
}

const SLIPPERY_FIBERS: MaterialFiber[] = ["uhmwpe", "aramid"];

/**
 * Axis-driven modifiers. Deliberately returns zeroes when the deeper axes were
 * never declared, so legacy inputs rank byte-identically.
 */
export function materialModifier(spec: MaterialSpec | undefined): MaterialModifier {
  const none: MaterialModifier = { slipPenalty: 0, seatingPenalty: 0, inspectionPenalty: 0 };
  if (!spec) return none;

  let slip = 0;
  let seating = 0;
  let inspection = 0;
  const reasons: string[] = [];

  if (SLIPPERY_FIBERS.includes(spec.fiber) && spec.construction !== "unspecified") {
    slip += 10;
    seating += 8;
    reasons.push(`${FIBER_LABELS[spec.fiber]} fiber — slick, wants extra wraps and slow seating`);
  }

  if (spec.construction === "hollow-core") {
    slip += 14;
    seating += 10;
    inspection += 6;
    reasons.push("Hollow-core construction deforms under a conventional knot");
  }

  if (spec.construction === "braid-4") {
    slip += 4;
    reasons.push("4-carrier braid is coarser and rounder-cutting than 8+");
  }
  if (spec.construction === "braid-12" || spec.construction === "braid-16") {
    slip += 6;
    reasons.push(`${CONSTRUCTION_LABELS[spec.construction]} runs slicker under compression`);
  }
  if (spec.construction === "fused-pe") {
    seating += 6;
    reasons.push("Fused PE will not bed into itself the way a braid does");
  }

  if (spec.construction === "single-strand-wire") {
    slip += 20;
    seating += 20;
    reasons.push("Single-strand wire takes a set and kinks — knots are the wrong termination");
  }
  if (spec.construction === "wire-1x7" || spec.construction === "wire-7x7") {
    slip += 10;
    seating += 12;
    reasons.push(`${CONSTRUCTION_LABELS[spec.construction]} wire resists a clean knot bed`);
  }

  if (spec.construction === "copolymer") {
    slip += 3;
    reasons.push("Copolymer runs slicker and stretches less than straight nylon");
  }
  if (spec.construction === "titanium-wire") {
    slip += 12;
    seating += 14;
    reasons.push("Titanium wire springs back out of a knot bed instead of setting");
  }
  if (spec.construction === "twisted-multifilament") {
    slip += 5;
    inspection += 4;
    reasons.push("Twisted multifilament unlays under load and hides a slipped strand");
  }
  if (spec.construction === "coated-core") {
    seating += 6;
    inspection += 5;
    reasons.push("A coated core carries load in the core, not the coating you can see");
  }

  if (spec.treatment === "coated-braid" || spec.treatment === "gel-spun-finish") {
    slip += 6;
    reasons.push(`${TREATMENT_LABELS[spec.treatment]} lowers friction at the seating stage`);
  }
  if (spec.treatment === "nylon-coated") {
    seating += 4;
    inspection += 4;
    reasons.push("Nylon coating hides the wrap stack and creeps when it is over-tightened");
  }
  if (spec.treatment === "wax-treated") {
    slip += 5;
    reasons.push("Wax lubricates the wrap stack — seat slowly and re-check the tag");
  }
  if (spec.treatment === "abrasion-treated") {
    seating += 3;
    reasons.push("Abrasion treatment stiffens the surface and resists a tight bed");
  }
  if (spec.treatment === "high-vis-pigment") {
    inspection += 3;
    reasons.push("Heavy pigment masks the first chafe marks on inspection");
  }
  if (spec.fiber === "polyester") {
    slip = Math.max(0, slip - 6);
    reasons.push("Dacron/polyester grips a conventional knot well");
  }

  return {
    slipPenalty: slip,
    seatingPenalty: seating,
    inspectionPenalty: inspection,
    ...(reasons.length ? { note: reasons[0] } : {}),
  };
}

export type Termination = "knot" | "splice" | "crimp" | "do-not-connect";

export interface TerminationAdvice {
  method: Termination;
  headline: string;
  detail: string;
}

/** Surfaces a non-knot answer when the construction demands one. */
export function terminationAdvice(
  main: MaterialSpec | undefined,
  secondary?: MaterialSpec | undefined,
): TerminationAdvice | null {
  const specs = [main, secondary].filter(Boolean) as MaterialSpec[];

  const hollow = specs.find((s) => s.construction === "hollow-core");
  if (hollow) {
    return {
      method: "splice",
      headline: "Splice preferred over any knot here",
      detail:
        "Hollow-core braid holds full section through a buried splice and loses it through a knot bed. Rank the knots below only as a field fallback.",
    };
  }

  const single = specs.find((s) => s.construction === "single-strand-wire");
  if (single) {
    return {
      method: "crimp",
      headline: "Crimp or haywire twist — not a knot",
      detail:
        "Single-strand wire takes a permanent set. A conventional knot creates a stress riser at the first bend and fails below rating.",
    };
  }

  const titanium = specs.find((s) => s.construction === "titanium-wire");
  if (titanium) {
    return {
      method: "crimp",
      headline: "Crimp the titanium — knots slip out of it",
      detail:
        "Titanium wire is elastic and memory-free, which is exactly why a knot bed will not hold it. Use a crimped sleeve rated to the wire.",
    };
  }

  const heavyWire = specs.find((s) => s.construction === "wire-7x7" || s.construction === "wire-1x7");
  if (heavyWire && heavyWire.treatment !== "nylon-coated") {
    return {
      method: "crimp",
      headline: "Crimped sleeve is the reliable termination",
      detail:
        "Bare multi-strand wire only knots acceptably in light sizes. Coated 7×7 can be knotted; bare should be crimped.",
    };
  }

  return null;
}