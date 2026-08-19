/** Batch 6 line-to-line / loop mechanics. */
import type { MechanicsBundle } from "@/data/mechanics-profiles";
import type {
  CompletenessFlags,
  FieldFitProfile,
  ConnectionJob,
  LineMaterial,
  DiameterRelation,
  DiagramKind,
} from "@/domain/types";

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

const fit = (overrides: Partial<FieldFitProfile["baseline"]> = {}): FieldFitProfile => ({
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
function baseObs(p: string) {
  return [
    obs("barrel_uniform", "Join looks uniform", "wraps", false, []),
    obs("crossover", "Crossed or uneven structure", "wraps", true, [`${p}-crossover`]),
    obs("fully_seated", "Fully seated", "geometry", false, []),
    obs("gap_seating", "Gap or incomplete seating", "geometry", true, [`${p}-seat`]),
    obs("tags_ok", "Tags exit correctly", "finish", false, []),
    obs("tag_wrong", "Tag path wrong", "finish", true, [`${p}-tag`]),
    obs("line_exits", "Lines exit on-axis", "exits", false, []),
    obs("off_axis", "Off-axis exits", "exits", true, [`${p}-axis`]),
    obs("both_exits", "Critical structure visible", "visibility", false, []),
  ];
}

function mk(
  id: string,
  summary: string,
  families: ConnectionJob[],
  materials: LineMaterial[],
  diagram: DiagramKind,
  wraps: [number, number],
  extra?: Partial<MechanicsBundle["contract"]>,
): MechanicsBundle {
  return {
    contract: {
      connectionFamilies: families,
      permittedMaterials: materials,
      mainMaterials: materials,
      diameterRelationships: ["similar", "main-thinner", "main-thicker"] as DiameterRelation[],
      guidePassage: "good",
      finishedGeometry: "wrap-stack",
      loopBehavior: "none",
      loadDirection: "inline",
      slipSensitivity: "moderate",
      seatingRequirements: "Even structure seated wet",
      tensionRequirements: "moderate",
      failureSensitiveStages: ["structure", "seat"],
      hardExclusions: [],
      ...extra,
    },
    fieldFit: {
      ...fit({
        connectionJobFit: 84,
        materialCompatibility: 80,
        fieldTieability: 68,
        retieSpeed: 64,
        loadBehavior: 82,
      }),
      strengths: ["Documented job from Hook the Horizon library"],
      weaknesses: ["Technique-sensitive seating"],
    },
    fingerprint: {
      expectedGeometry: "Completed join or loop structure",
      expectedWrapCountRange: wraps,
      expectedTagOrientation: "Tags short and correct path",
      expectedStandingOrientation: "On-axis load path",
      expectedCoilDistribution: "Even, no crossings",
      expectedSeatingPattern: "Fully seated",
      expectedCrossoverBehavior: "None",
      expectedCompressionZones: "Primary contact zone",
      expectedFinishingStructure: id,
      dangerousDefects: [
        {
          id: `${id}-crossover`,
          label: "Uneven structure",
          observationKey: "crossover",
          consequence: "Weak side",
          mechanicsWhy: "Even friction required",
          stepWhere: 2,
          decision: "retie-recommended",
        },
        {
          id: `${id}-seat`,
          label: "Under-seated",
          observationKey: "gap_seating",
          consequence: "Fail under load",
          mechanicsWhy: "Full seat locks the join",
          stepWhere: 3,
          decision: "retie-now",
        },
        {
          id: `${id}-tag`,
          label: "Tag path wrong",
          observationKey: "tag_wrong",
          consequence: "Unlock",
          mechanicsWhy: "Tag completes the lock",
          stepWhere: 3,
          decision: "retie-now",
        },
      ],
      cosmeticIrregularities: [],
    },
    observations: baseObs(id),
    diagramKind: diagram,
    mechanicsSummary: summary,
    completeness: FULL,
  };
}

export const MECHANICS_EXTRAS_BATCH6: Record<string, MechanicsBundle> = {
  bristol: mk(
    "bristol",
    "Leader barrel on a doubled main line. The double is the job — a single strand is not a Bristol.",
    ["double-line-to-leader", "braid-to-leader"],
    ["braid", "mono", "fluoro", "mixed"],
    "braid-leader-fg",
    [6, 12],
    {
      requiresDoubleLine: true,
      mainMaterials: ["braid"],
      secondaryMaterials: ["mono", "fluoro"],
      diameterRelationships: ["main-thinner", "main-much-thinner", "extreme-mismatch"],
    },
  ),
  "double-double-uni": mk(
    "double-double-uni",
    "Doubled-braid Uni against a leader Uni. More grip than Double Uni, more bulk than FG.",
    ["braid-to-leader", "double-line-to-leader"],
    ["braid", "mono", "fluoro", "mixed"],
    "line-join",
    [8, 14],
    {
      mainMaterials: ["braid"],
      secondaryMaterials: ["mono", "fluoro"],
      diameterRelationships: ["main-thinner", "main-much-thinner", "similar"],
    },
  ),
  "loop-to-loop": mk(
    "loop-to-loop",
    "Handshake of two finished loops. Strength is the weaker loop; girth-hitch assembly is a fail.",
    ["loop-to-loop", "fly-line-to-leader"],
    ["fly-line", "mono", "fluoro", "mixed"],
    "loop-fixed",
    [0, 0],
    {
      loopBehavior: "fixed",
      finishedGeometry: "loop",
      mainMaterials: ["fly-line", "mono", "fluoro"],
      secondaryMaterials: ["mono", "fluoro"],
    },
  ),
  willis: mk(
    "willis",
    "Finger-trap: mono inserted into a hollow lead-core sheath after the lead is pulled.",
    ["braid-to-leader"],
    ["braid", "mono", "mixed"],
    "fly-line-coil",
    [0, 0],
    {
      mainMaterials: ["braid"],
      secondaryMaterials: ["mono"],
      guidePassage: "fair",
      tensionRequirements: "high",
    },
  ),
  "kryston-loop": mk(
    "kryston-loop",
    "Mono-only non-slip lure loop. Fluoro is a hard skip.",
    ["line-to-loop", "line-to-lure"],
    ["mono"],
    "loop-nonslip",
    [2, 5],
    {
      loopBehavior: "non-slip",
      loadDirection: "loop-swing",
      finishedGeometry: "loop",
      hardExclusions: ["fluorocarbon"],
    },
  ),
};
