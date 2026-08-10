/**
 * Layer 1 — Hard Constraint Engine
 * Eliminates mechanically inappropriate knots. Deterministic. AI cannot override.
 */
import type { ChooseInput, ConstraintElimination, Knot } from "@/domain/types";

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

  if (!c.connectionFamilies.includes(input.connection)) {
    reasons.push(
      `Does not solve connection “${input.connection}” (contract families: ${c.connectionFamilies.join(", ")})`,
    );
  }

  if (input.mainMaterial) {
    const mainOk =
      c.permittedMaterials.includes(input.mainMaterial) ||
      c.permittedMaterials.includes("mixed") ||
      (c.mainMaterials?.includes(input.mainMaterial) ?? false);
    if (!mainOk) {
      reasons.push(`Main material ${input.mainMaterial} is outside permitted materials`);
    }
    if (c.mainMaterials && !c.mainMaterials.includes(input.mainMaterial) && input.connection === "braid-to-leader") {
      if (input.mainMaterial !== "braid" && c.mainMaterials.includes("braid")) {
        reasons.push(`This knot expects braid as main line for braid-to-leader geometry`);
      }
    }
  }

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

  if (input.diameterRelation && !c.diameterRelationships.includes(input.diameterRelation)) {
    reasons.push(
      `Diameter relation “${input.diameterRelation}” is outside contract (${c.diameterRelationships.join(", ")})`,
    );
  }

  if (input.mustPassGuides && (c.guidePassage === "poor" || c.guidePassage === "fair")) {
    // Fair is allowed but will be ranked down — only eliminate poor when must pass
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

  if (input.freeSwing && c.loopBehavior !== "non-slip" && c.loopBehavior !== "open") {
    // Don't hard-eliminate — ranking handles; only hard eliminate if fixed cinch eye knots when free swing required? 
    // Actually non-loop terminals can't free-swing — soft signal only
  }

  if (input.needsUntie && knot.notIdealFor.some((n) => n.toLowerCase().includes("untie"))) {
    reasons.push("Catalog marks this knot as not ideal when untying is required");
  }

  // Hard exclusions text
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

  // FG specifically: only braid-to-leader with mono/fluoro secondary
  if (knot.id === "fg") {
    if (input.connection !== "braid-to-leader") {
      if (!reasons.some((r) => r.includes("connection"))) {
        reasons.push("FG is reserved for braid-to-leader compression geometry");
      }
    }
    if (input.mainMaterial && input.mainMaterial !== "braid") {
      reasons.push("FG requires braid as the wrapping main line");
    }
  }

  // Blood: eliminate extreme mismatch
  if (knot.id === "blood" && input.diameterRelation && input.diameterRelation !== "similar") {
    if (!reasons.some((r) => r.includes("Diameter"))) {
      reasons.push("Blood knot contract requires similar diameters");
    }
  }

  return [...new Set(reasons)];
}
