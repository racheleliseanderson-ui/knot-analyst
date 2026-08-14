/**
 * Batch 4 mechanics — line-to-line + loops (full gold-standard).
 * connectionFamilies must be valid ConnectionJob values only.
 */
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
    obs("barrel_uniform", "Wrap/join stack looks uniform", "wraps", false, []),
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
      ...terminalFit({
        connectionJobFit: 86, materialCompatibility: 82, fieldTieability: 68,
        retieSpeed: 65, loadBehavior: 84,
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
        { id: `${id}-crossover`, label: "Uneven structure", observationKey: "crossover", consequence: "Weak side", mechanicsWhy: "Even friction required", stepWhere: 2, decision: "retie-recommended" },
        { id: `${id}-seat`, label: "Under-seated", observationKey: "gap_seating", consequence: "Fail under load", mechanicsWhy: "Full seat locks the join", stepWhere: 3, decision: "retie-now" },
        { id: `${id}-tag`, label: "Tag path wrong", observationKey: "tag_wrong", consequence: "Unlock", mechanicsWhy: "Tag completes the lock", stepWhere: 3, decision: "retie-now" },
      ],
      cosmeticIrregularities: [],
    },
    observations: baseJoinObs(id),
    diagramKind: diagram,
    mechanicsSummary: summary,
    completeness: FULL,
  };
}

export const MECHANICS_EXTRAS_BATCH4: Record<string, MechanicsBundle> = {
  "orvis-tippet": mk(
    "orvis-tippet",
    "Leader-to-tippet Orvis structure; slim similar-diameter join.",
    ["leader-to-tippet", "leader-to-leader"],
    ["mono", "fluoro"],
    "line-join",
    [3, 6],
    { secondaryMaterials: ["mono", "fluoro"], diameterRelationships: ["similar"] },
  ),
  seaguar: mk(
    "seaguar",
    "Seaguar paired-loop join for similar-diameter mono/fluoro.",
    ["leader-to-tippet", "leader-to-leader"],
    ["mono", "fluoro"],
    "line-join",
    [3, 5],
    { secondaryMaterials: ["mono", "fluoro"], diameterRelationships: ["similar"] },
  ),
  "j-knot": mk(
    "j-knot",
    "J-knot leader-to-tippet join; strong on similar tippet steps.",
    ["leader-to-tippet", "leader-to-leader"],
    ["mono", "fluoro"],
    "line-join",
    [3, 6],
    { secondaryMaterials: ["mono", "fluoro"], diameterRelationships: ["similar"] },
  ),
  "aussie-quickie": mk(
    "aussie-quickie",
    "Fast braid-to-leader join with field tempo priority.",
    ["braid-to-leader"],
    ["braid", "mixed"],
    "braid-leader-fg",
    [6, 12],
    {
      mainMaterials: ["braid"],
      secondaryMaterials: ["mono", "fluoro"],
      diameterRelationships: ["main-thinner", "main-much-thinner", "extreme-mismatch"],
    },
  ),
  "needle-knot": mk(
    "needle-knot",
    "Needle-assisted fly-line to leader transition coil.",
    ["fly-line-to-leader"],
    ["fly-line", "mono", "fluoro", "mixed"],
    "fly-line-coil",
    [5, 8],
    {
      mainMaterials: ["fly-line"],
      secondaryMaterials: ["mono", "fluoro"],
      guidePassage: "excellent",
      diameterRelationships: ["main-thicker", "extreme-mismatch", "main-much-thinner"],
    },
  ),
  "homer-rhode": mk(
    "homer-rhode",
    "Heavy-leader free-swing loop for lure action.",
    ["line-to-loop", "line-to-lure"],
    ["mono", "fluoro"],
    "loop-nonslip",
    [3, 6],
    { loopBehavior: "non-slip", loadDirection: "loop-swing", finishedGeometry: "loop" },
  ),
  "king-sling": mk(
    "king-sling",
    "Fixed end loop with controllable size.",
    ["line-to-loop"],
    ["mono", "fluoro"],
    "loop-fixed",
    [2, 5],
    { loopBehavior: "fixed", finishedGeometry: "loop" },
  ),
  "australian-plait": mk(
    "australian-plait",
    "Plaited double-line for heavy tackle.",
    ["line-to-loop", "double-line-to-leader"],
    ["mono", "fluoro", "braid"],
    "double-line",
    [8, 20],
    {
      requiresDoubleLine: true,
      loopBehavior: "fixed",
      finishedGeometry: "loop",
      tensionRequirements: "high",
    },
  ),
};
