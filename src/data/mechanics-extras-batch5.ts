/**
 * Batch 5 remaining-terminal mechanics (full gold-standard).
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

function baseJoinObs(p: string) {
  return [
    obs("barrel_uniform", "Wrap/lock stack looks uniform", "wraps", false, []),
    obs("crossover", "Crossed or uneven structure", "wraps", true, [`${p}-crossover`]),
    obs("fully_seated", "Fully seated", "geometry", false, []),
    obs("gap_seating", "Gap or incomplete seating", "geometry", true, [`${p}-seat`]),
    obs("tags_ok", "Tag exits correctly", "finish", false, []),
    obs("tag_wrong", "Tag path wrong", "finish", true, [`${p}-tag`]),
    obs("line_exits", "Standing line on-axis", "exits", false, []),
    obs("off_axis", "Standing line off-axis", "exits", true, [`${p}-axis`]),
    obs("both_exits", "Critical structure visible", "visibility", false, []),
  ];
}

function term(
  id: string,
  summary: string,
  families: ConnectionJob[],
  materials: LineMaterial[],
  wraps: [number, number],
  diagram: DiagramKind = "terminal-eye",
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
      seatingRequirements: "Even structure seated wet to the eye or along the shank",
      tensionRequirements: "moderate",
      failureSensitiveStages: ["wrap count", "tag path", "seat"],
      hardExclusions: [],
      ...extra,
    },
    fieldFit: {
      ...terminalFit({
        connectionJobFit: 84,
        materialCompatibility: 80,
        fieldTieability: 72,
        retieSpeed: 74,
        loadBehavior: 82,
        guidePassage: 80,
      }),
      strengths: ["Documented terminal job from Hook the Horizon library"],
      weaknesses: ["Technique-sensitive seating"],
    },
    fingerprint: {
      expectedGeometry: "Terminal wrap or lock at the eye or along the shank",
      expectedWrapCountRange: wraps,
      expectedTagOrientation: "Tag exits clean and short",
      expectedStandingOrientation: "Standing line on-axis with load",
      expectedCoilDistribution: "Even structure, no crossings",
      expectedSeatingPattern: "Fully seated to eye or shank",
      expectedCrossoverBehavior: "None",
      expectedCompressionZones: "Wrap or lock contact at eye or shank",
      expectedFinishingStructure: id,
      dangerousDefects: [
        {
          id: `${id}-crossover`,
          label: "Crossed / uneven structure",
          observationKey: "crossover",
          consequence: "Weak side",
          mechanicsWhy: "Even friction carries load",
          stepWhere: 2,
          decision: "retie-recommended",
        },
        {
          id: `${id}-seat`,
          label: "Under-seated",
          observationKey: "gap_seating",
          consequence: "Walk or fail",
          mechanicsWhy: "Full seat locks structure",
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
    observations: baseJoinObs(id),
    diagramKind: diagram,
    mechanicsSummary: summary,
    completeness: FULL,
  };
}

export const MECHANICS_EXTRAS_BATCH5: Record<string, MechanicsBundle> = {
  centauri: term(
    "centauri",
    "Three-loop sliding collar on nylon. Mono terminal or simple spool attachment — not a braid knot.",
    ["line-to-hook", "line-to-lure", "line-to-spool"],
    ["mono"],
    [3, 3],
    "terminal-uni",
  ),
  "eye-crosser": term(
    "eye-crosser",
    "Doubled eye contact with a lock around the parallel strands. Hardware must accept two passes.",
    ["line-to-hook", "line-to-lure", "line-to-swivel"],
    ["mono", "fluoro", "braid"],
    [3, 6],
    "terminal-eye",
    { requiresHardwareEye: true },
  ),
  "fish-n-fool": term(
    "fish-n-fool",
    "Second eye pass feeding a Uni barrel. Light-braid and mono/fluoro terminal when the eye has room.",
    ["line-to-hook", "line-to-lure"],
    ["mono", "fluoro", "braid"],
    [5, 8],
    "terminal-uni",
    { requiresHardwareEye: true },
  ),
  "harvey-dry-fly": term(
    "harvey-dry-fly",
    "Presentation-angle terminal for turned-eye dry flies. Not a max-retention knot.",
    ["line-to-hook"],
    ["mono", "fluoro"],
    [2, 4],
    "terminal-eye",
    { finishedGeometry: "hitched", slipSensitivity: "high" },
  ),
  jacks: term(
    "jacks",
    "Compact crossing lock for fly tippet. Inspect the centered crossing before you fish it.",
    ["line-to-hook"],
    ["mono", "fluoro"],
    [1, 3],
    "terminal-eye",
    { finishedGeometry: "compact" },
  ),
  jansik: term(
    "jansik",
    "Triple-eye compact lock for light mono/fluoro. Crowded eyes are a hard skip.",
    ["line-to-hook", "line-to-lure", "line-to-swivel"],
    ["mono", "fluoro"],
    [2, 3],
    "terminal-eye",
    { requiresHardwareEye: true, finishedGeometry: "compact" },
  ),
  knotless: term(
    "knotless",
    "Hair-rig shank wraps. Hair length is set before the column; ordinary lure terminals are the wrong job.",
    ["hook-snell", "line-to-hook"],
    ["mono", "fluoro", "braid"],
    [6, 10],
    "terminal-snell",
    { loadDirection: "snell-shank", finishedGeometry: "wrap-stack" },
  ),
  nanofil: term(
    "nanofil",
    "Double Palomar for slick fused superline. A single Palomar is the usual slip.",
    ["line-to-hook", "line-to-lure"],
    ["braid"],
    [2, 2],
    "terminal-palomar",
    { eyeMustPassDoubledLine: true, requiresHardwareEye: true },
  ),
  "world-fair": term(
    "world-fair",
    "Doubled-loop compact lock on mono/fluoro. Contest knot — not verified on braid.",
    ["line-to-hook", "line-to-lure", "line-to-swivel"],
    ["mono", "fluoro"],
    [2, 3],
    "terminal-palomar",
    { finishedGeometry: "compact", requiresHardwareEye: true },
  ),
};
