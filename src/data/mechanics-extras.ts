/**
 * Additional mechanical profiles kept separate so the main mechanics file stays
 * reviewable. Merged at getMechanics time.
 */
import type { MechanicsBundle } from "@/data/mechanics-profiles";
import type { CompletenessFlags, FieldFitProfile } from "@/domain/types";

const FULL: CompletenessFlags = {
  atAGlance: true,
  mechanics: true,
  diagram: true,
  tyingSteps: true,
  finishedCheck: true,
  failureDiagnosis: true,
  constraints: true,
  compareNext: true,
  sources: true,
  decisionModel: true,
  mechanicalFingerprint: true,
  failureRules: true,
  visualInspectability: true,
  offlineAssets: true,
};

const terminalFit = (overrides: Partial<FieldFitProfile["baseline"]> = {}): FieldFitProfile => ({
  baseline: {
    connectionJobFit: 80,
    materialCompatibility: 75,
    diameterRelationship: 70,
    eyeHardwareGeometry: 75,
    guidePassage: 70,
    finishedProfile: 72,
    loadBehavior: 78,
    fieldTieability: 75,
    coldWetHandDifficulty: 70,
    lowLightDifficulty: 68,
    windSensitivity: 70,
    requiredTensionControl: 72,
    inspectionDifficulty: 75,
    retieSpeed: 78,
    failureSensitivity: 70,
    userProficiency: 75,
    ...overrides,
  },
  strengths: [],
  weaknesses: [],
});

function obs(
  key: string,
  label: string,
  group: "geometry" | "wraps" | "exits" | "finish" | "visibility",
  badWhen: boolean,
  relatedDefectIds: string[],
) {
  return { key, label, group, badWhen, relatedDefectIds };
}

function baseJoinObs(defectPrefix: string) {
  return [
    obs("barrel_uniform", "Barrel / wrap stack looks uniform", "wraps", false, []),
    obs("crossover", "Crossed or uneven wraps visible", "wraps", true, [`${defectPrefix}-crossover`]),
    obs("fully_seated", "Connection is fully seated (no gaps between barrels)", "geometry", false, []),
    obs("gap_seating", "Gap or incomplete seating between sections", "geometry", true, [`${defectPrefix}-seat`]),
    obs("tags_ok", "Tags exit correctly and are trimmed safely", "finish", false, []),
    obs("tag_wrong", "Tag orientation wrong or sucked into structure", "finish", true, [`${defectPrefix}-tag`]),
    obs("line_exits", "Both standing lines exit on-axis", "exits", false, []),
    obs("off_axis", "Leader or main exits off-axis", "exits", true, [`${defectPrefix}-axis`]),
    obs("both_exits", "Critical structure and both exits visible", "visibility", false, []),
  ];
}

export const MECHANICS_EXTRAS: Record<string, MechanicsBundle> = {
  yucatan: {
    contract: {
      connectionFamilies: ["braid-to-leader", "double-line-to-leader"],
      permittedMaterials: ["braid", "mixed"],
      mainMaterials: ["braid"],
      secondaryMaterials: ["mono", "fluoro"],
      diameterRelationships: ["main-thinner", "main-much-thinner", "extreme-mismatch"],
      requiresDoubleLine: true,
      guidePassage: "fair",
      finishedGeometry: "barrel",
      loopBehavior: "none",
      loadDirection: "inline",
      slipSensitivity: "moderate",
      seatingRequirements: "Doubled braid wraps under tension on leader; hard opposing seat",
      tensionRequirements: "high",
      failureSensitiveStages: ["double base", "wrap count", "seat"],
      hardExclusions: ["Single-line braid without a proper double", "Equal mono-to-mono joins"],
    },
    fieldFit: {
      ...terminalFit({
        connectionJobFit: 90,
        materialCompatibility: 88,
        diameterRelationship: 90,
        guidePassage: 55,
        finishedProfile: 60,
        loadBehavior: 92,
        fieldTieability: 58,
        coldWetHandDifficulty: 50,
        lowLightDifficulty: 45,
        windSensitivity: 52,
        requiredTensionControl: 48,
        retieSpeed: 50,
        failureSensitivity: 55,
        userProficiency: 60,
      }),
      strengths: [
        "High retention on doubled braid → leader",
        "More accessible than perfect FG for many anglers",
      ],
      weaknesses: [
        "Requires a sound double first",
        "Bulkier / less guide-friendly than FG",
      ],
    },
    fingerprint: {
      expectedGeometry: "Doubled braid wraps compressed onto leader, collinear exits",
      expectedWrapCountRange: [8, 16],
      expectedTagOrientation: "Leader tag short; double exits clean",
      expectedStandingOrientation: "Double and leader collinear",
      expectedCoilDistribution: "Even wraps, no gaps",
      expectedSeatingPattern: "Fully seated, no hinge",
      expectedCrossoverBehavior: "No crossed lower wraps",
      expectedCompressionZones: "Wrap contact length on leader",
      expectedFinishingStructure: "Locked doubled wraps",
      dangerousDefects: [
        {
          id: "yucatan-crossover",
          label: "Crossed / gapped wraps",
          observationKey: "crossover",
          consequence: "Load concentrates; possible slip",
          mechanicsWhy: "Retention depends on distributed wrap friction on the leader",
          stepWhere: 2,
          decision: "retie-recommended",
        },
        {
          id: "yucatan-seat",
          label: "Under-seated / hinge",
          observationKey: "gap_seating",
          consequence: "Walk or fail under shock",
          mechanicsWhy: "Hard opposing seat locks the column",
          stepWhere: 3,
          decision: "retie-now",
        },
        {
          id: "yucatan-tag",
          label: "Finish incomplete",
          observationKey: "tag_wrong",
          consequence: "Unlock under cyclic load",
          mechanicsWhy: "Lock must capture the wrap stack",
          stepWhere: 3,
          decision: "retie-now",
        },
        {
          id: "yucatan-axis",
          label: "Off-axis exits",
          observationKey: "off_axis",
          consequence: "Hinge risk",
          mechanicsWhy: "Inline path preferred for doubled-to-leader",
          stepWhere: 4,
          decision: "watch",
        },
      ],
      cosmeticIrregularities: ["Minor wrap count variation if density is solid"],
    },
    observations: baseJoinObs("yucatan"),
    diagramKind: "line-join",
    mechanicsSummary:
      "Doubled braid (Bimini base) wrapped onto a mono/fluoro leader under tension. High retention when the double is sound; bulkier than FG.",
    completeness: FULL,
  },
};
