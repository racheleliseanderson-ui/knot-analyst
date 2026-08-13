/**
 * Terminal seed batch 3 — mechanical profiles.
 * Merged via mechanics.ts
 */
import type { MechanicsBundle } from "@/data/mechanics-profiles";
import type { CompletenessFlags, FieldFitProfile } from "@/domain/types";

const FULL: CompletenessFlags = {
  atAGlance: true, mechanics: true, diagram: true, tyingSteps: true,
  finishedCheck: true, failureDiagnosis: true, constraints: true, compareNext: true,
  sources: true, decisionModel: true, mechanicalFingerprint: true, failureRules: true,
  visualInspectability: true, offlineAssets: true,
};

const terminalFit = (overrides: Partial<FieldFitProfile["baseline"]> = {}): FieldFitProfile => ({
  baseline: {
    connectionJobFit: 80, materialCompatibility: 75, diameterRelationship: 70,
    eyeHardwareGeometry: 75, guidePassage: 70, finishedProfile: 72, loadBehavior: 78,
    fieldTieability: 75, coldWetHandDifficulty: 70, lowLightDifficulty: 68,
    windSensitivity: 70, requiredTensionControl: 72, inspectionDifficulty: 75,
    retieSpeed: 78, failureSensitivity: 70, userProficiency: 75, ...overrides,
  },
  strengths: [], weaknesses: [],
});

function obs(key: string, label: string, group: "geometry" | "wraps" | "exits" | "finish" | "visibility", badWhen: boolean, relatedDefectIds: string[]) {
  return { key, label, group, badWhen, relatedDefectIds };
}

function baseJoinObs(p: string) {
  return [
    obs("barrel_uniform", "Wrap stack looks uniform", "wraps", false, []),
    obs("crossover", "Crossed or uneven wraps", "wraps", true, [`${p}-crossover`]),
    obs("fully_seated", "Fully seated", "geometry", false, []),
    obs("gap_seating", "Gap or incomplete seating", "geometry", true, [`${p}-seat`]),
    obs("tags_ok", "Tag exits correctly", "finish", false, []),
    obs("tag_wrong", "Tag orientation wrong", "finish", true, [`${p}-tag`]),
    obs("line_exits", "Standing line on-axis", "exits", false, []),
    obs("off_axis", "Standing line off-axis", "exits", true, [`${p}-axis`]),
    obs("both_exits", "Critical structure visible", "visibility", false, []),
  ];
}

function term(id: string, summary: string, families: string[], materials: string[], wraps: [number, number], diagram: string = "terminal-eye"): MechanicsBundle {
  return {
    contract: {
      connectionFamilies: families as MechanicsBundle["contract"]["connectionFamilies"],
      permittedMaterials: materials as MechanicsBundle["contract"]["permittedMaterials"],
      mainMaterials: materials as MechanicsBundle["contract"]["mainMaterials"],
      diameterRelationships: ["similar", "main-thinner", "main-thicker"],
      guidePassage: "good",
      finishedGeometry: "wrap-stack",
      loopBehavior: "none",
      loadDirection: "inline",
      slipSensitivity: "moderate",
      seatingRequirements: "Even wraps seated wet to the eye or along the shank",
      tensionRequirements: "moderate",
      failureSensitiveStages: ["wrap count", "tag path", "seat"],
      hardExclusions: [],
    },
    fieldFit: {
      ...terminalFit({ connectionJobFit: 85, materialCompatibility: 80, fieldTieability: 72, retieSpeed: 75, loadBehavior: 82, guidePassage: 80 }),
      strengths: ["Documented terminal job from Hook the Horizon library"],
      weaknesses: ["Technique-sensitive seating"],
    },
    fingerprint: {
      expectedGeometry: "Terminal wrap stack at eye or along shank",
      expectedWrapCountRange: wraps,
      expectedTagOrientation: "Tag exits clean and short",
      expectedStandingOrientation: "Standing line on-axis with load",
      expectedCoilDistribution: "Even wraps, no crossings",
      expectedSeatingPattern: "Fully seated to eye or shank",
      expectedCrossoverBehavior: "None",
      expectedCompressionZones: "Wrap contact at eye or shank",
      expectedFinishingStructure: id,
      dangerousDefects: [
        { id: `${id}-crossover`, label: "Crossed / uneven wraps", observationKey: "crossover", consequence: "Weak side", mechanicsWhy: "Even wrap friction carries load", stepWhere: 2, decision: "retie-recommended" },
        { id: `${id}-seat`, label: "Under-seated", observationKey: "gap_seating", consequence: "Walk or fail", mechanicsWhy: "Full seat locks structure", stepWhere: 3, decision: "retie-now" },
        { id: `${id}-tag`, label: "Tag path wrong", observationKey: "tag_wrong", consequence: "Unlock", mechanicsWhy: "Tag completes the lock", stepWhere: 3, decision: "retie-now" },
      ],
      cosmeticIrregularities: [],
    },
    observations: baseJoinObs(id),
    diagramKind: diagram as MechanicsBundle["diagramKind"],
    mechanicsSummary: summary,
    completeness: FULL,
  };
}

export const MECHANICS_EXTRAS_TERMINAL: Record<string, MechanicsBundle> = {
  "berkley-braid": term("berkley-braid", "Doubled-braid Uni-style barrel locked at the eye. Braid-primary terminal.", ["line-to-hook", "line-to-lure"], ["braid"], [5, 8], "terminal-uni"),
  davy: term("davy", "Fast compact tippet hitch for small flies.", ["line-to-hook", "fly-hook"], ["mono", "fluoro"], [1, 3]),
  "double-davy": term("double-davy", "Davy with extra security pass for larger flies.", ["line-to-hook", "fly-hook"], ["mono", "fluoro"], [2, 4]),
  "egg-loop": term("egg-loop", "Shank-wrap bait loop for egg and bait presentations.", ["snell-hook", "line-to-hook"], ["mono", "fluoro"], [5, 12], "terminal-snell"),
  orvis: term("orvis", "Compact Orvis terminal for tippet and light flies.", ["line-to-hook", "fly-hook"], ["mono", "fluoro"], [3, 6]),
  pitzen: term("pitzen", "Compact high-retention tippet terminal with precise tag path.", ["line-to-hook", "fly-hook"], ["mono", "fluoro"], [4, 7]),
  turle: term("turle", "Traditional fly terminal seating around the eye for alignment.", ["line-to-hook", "fly-hook"], ["mono", "fluoro"], [2, 5]),
  baja: term("baja", "Heavy mono/fluoro terminal for stout leaders.", ["line-to-hook", "line-to-lure"], ["mono", "fluoro"], [5, 8]),
  clinch: term("clinch", "Basic clinch without the improved pass — speed over security.", ["line-to-hook", "line-to-swivel"], ["mono", "fluoro"], [5, 7]),
  "uni-snell": term("uni-snell", "Uni-barrel compressed along the hook shank for on-axis pull.", ["snell-hook"], ["mono", "fluoro"], [5, 10], "terminal-snell"),
  "easy-snell": term("easy-snell", "Simplified parallel shank wraps for consistent snell geometry.", ["snell-hook"], ["mono", "fluoro"], [5, 10], "terminal-snell"),
};
