/**
 * Layer 1 — Hard Constraint Engine
 * Eliminates mechanically inappropriate knots. Deterministic. AI cannot override.
 *
 * Schema 2.0: side-aware checks prefer mainMaterials / secondaryMaterials when
 * present. ConnectionJob IDs are not renamed; structuralJob is advisory dual-write.
 * Flat inputs (no deeper axes) must rank byte-identically to engine 1.2.x.
 */
import type { ChooseInput, ConstraintElimination, Knot, LineMaterial } from "@/domain/types";
import { relationFromDiameters } from "@/domain/diameter";

/** Effective diameter relation — mm inputs win when both sides are measured. */
export function effectiveDiameterRelation(input: ChooseInput): ChooseInput["diameterRelation"] {
  if (
    input.mainDiameterMm != null &&
    input.secondaryDiameterMm != null &&
    input.mainDiameterMm > 0 &&
    input.secondaryDiameterMm > 0
  ) {
    return relationFromDiameters(input.mainDiameterMm, input.secondaryDiameterMm);
  }
  return input.diameterRelation;
}

function materialAllowed(
  material: LineMaterial,
  bag: LineMaterial[] | undefined,
  permitted: LineMaterial[],
): boolean {
  if (permitted.includes(material) || permitted.includes("mixed")) return true;
  if (bag?.includes(material)) return true;
  return false;
}

export function eliminateKnots(
  knots: Knot[],
  input: ChooseInput,
): { survivors: Knot[]; eliminated: ConstraintElimination[] } {
  const eliminated: ConstraintElimination[] = [];
  const survivors: Knot[] = [];

  for (const knot of knots) {
    const reasons = constraintFailures(knot, input);
    if (reasons.length > 0) {
      eliminated.push({ knotId: knot.id, knotName: knot.name, reasons });
    } else {
      survivors.push(knot);
    }
  }

  return { survivors, eliminated };
}

export function constraintFailures(knot: Knot, input: ChooseInput): string[] {
  const c = knot.contract;
  const reasons: string[] = [];
  const diameter = effectiveDiameterRelation(input);

  if (!c.connectionFamilies.includes(input.connection)) {
    reasons.push(
      `Does not solve connection “${input.connection}” (contract families: ${c.connectionFamilies.join(", ")})`,
    );
  }

  if (input.mainMaterial) {
    const mainOk = materialAllowed(input.mainMaterial, c.mainMaterials, c.permittedMaterials);
    if (!mainOk) {
      reasons.push(`Main material ${input.mainMaterial} is outside permitted materials`);
    }
    if (
      c.mainMaterials &&
      !c.mainMaterials.includes(input.mainMaterial) &&
      (input.connection === "braid-to-leader" || input.structuralJob === "main-to-leader")
    ) {
      if (input.mainMaterial !== "braid" && c.mainMaterials.includes("braid")) {
        reasons.push(`This knot expects braid as main line for braid-to-leader geometry`);
      }
    }
  }

  // Secondary side — only when the contract declares secondaryMaterials (byte-stable)
  if (input.secondaryMaterial && c.secondaryMaterials) {
    if (
      !c.secondaryMaterials.includes(input.secondaryMaterial) &&
      !c.permittedMaterials.includes(input.secondaryMaterial) &&
      !c.permittedMaterials.includes("mixed")
    ) {
      reasons.push(`Secondary material ${input.secondaryMaterial} not supported`);
    }
  }

  // Braid as main on mono-only terminals
  if (
    input.mainMaterial === "braid" &&
    !c.permittedMaterials.includes("braid") &&
    !c.permittedMaterials.includes("mixed")
  ) {
    reasons.push("Not rated for braid — slick braid defeats this geometry");
  }

  if (diameter && !c.diameterRelationships.includes(diameter)) {
    reasons.push(
      `Diameter relation “${diameter}” is outside contract (${c.diameterRelationships.join(", ")})`,
    );
  }

  if (input.mustPassGuides && (c.guidePassage === "poor" || c.guidePassage === "fair")) {
    if (c.guidePassage === "poor") {
      reasons.push("Guide passage rated poor — eliminated when must pass guides");
    }
  }

  if (input.hardwareEyeSmall && c.eyeMustPassDoubledLine) {
    reasons.push("Requires doubled line through eye — small eyes fail this contract");
  }

  if (input.connection === "hook-snell" && !c.connectionFamilies.includes("hook-snell")) {
    reasons.push("Not a snell geometry");
  }

  if (input.needsUntie && knot.notIdealFor.some((n) => n.toLowerCase().includes("untie"))) {
    reasons.push("Catalog marks this knot as not ideal when untying is required");
  }

  if (c.hardExclusions?.length) {
    for (const ex of c.hardExclusions) {
      const exL = ex.toLowerCase();
      if (input.mainMaterial === "braid" && exL.includes("braid") && exL.includes("without")) {
        reasons.push(`Hard exclusion: ${ex}`);
      }
      if (
        input.connection !== "braid-to-leader" &&
        exL.includes("mono-to-mono") &&
        input.mainMaterial === "mono" &&
        input.secondaryMaterial === "mono" &&
        knot.id === "fg"
      ) {
        reasons.push(`Hard exclusion: ${ex}`);
      }
    }
  }

  if (knot.id === "fg") {
    if (input.connection !== "braid-to-leader") {
      if (!reasons.some((r) => r.includes("connection"))) {
        reasons.push("FG is reserved for braid-to-leader compression geometry");
      }
    }
    if (input.mainMaterial && input.mainMaterial !== "braid") {
      reasons.push("FG requires braid as the wrapping main line");
    }
    // Side-aware secondary only when declared — mono/fluoro/mixed stay valid; others fail closed
    if (
      input.secondaryMaterial &&
      input.secondaryMaterial !== "mono" &&
      input.secondaryMaterial !== "fluoro" &&
      input.secondaryMaterial !== "mixed"
    ) {
      reasons.push("FG secondary side expects mono or fluorocarbon leader");
    }
  }

  if (knot.id === "blood" && diameter && diameter !== "similar") {
    if (!reasons.some((r) => r.includes("Diameter"))) {
      reasons.push("Blood knot contract requires similar diameters");
    }
  }

  return [...new Set(reasons)];
}
