/** Boating batch 2 mechanics. */
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

const ROPE: LineMaterial[] = ["polyester", "nylon", "polypropylene", "natural"];

const fit = (overrides: Partial<FieldFitProfile["baseline"]> = {}): FieldFitProfile => ({
  baseline: {
    connectionJobFit: 82, materialCompatibility: 78, diameterRelationship: 70,
    eyeHardwareGeometry: 70, guidePassage: 65, finishedProfile: 74, loadBehavior: 80,
    fieldTieability: 78, coldWetHandDifficulty: 70, lowLightDifficulty: 68,
    windSensitivity: 72, requiredTensionControl: 70, inspectionDifficulty: 78,
    retieSpeed: 80, failureSensitivity: 72, userProficiency: 75, ...overrides,
  },
  strengths: ["Documented rope-work job"],
  weaknesses: ["Must be dressed; HMPE is usually a splice"],
});

function obs(key: string, label: string, group: "geometry" | "wraps" | "exits" | "finish" | "visibility", badWhen: boolean, relatedDefectIds: string[]) {
  return { key, label, group, badWhen, relatedDefectIds };
}
function base(p: string) {
  return [
    obs("barrel_uniform", "Structure looks uniform", "wraps", false, []),
    obs("crossover", "Crossed or walked turns", "wraps", true, [`${p}-crossover`]),
    obs("fully_seated", "Fully dressed", "geometry", false, []),
    obs("gap_seating", "Loose or undressed", "geometry", true, [`${p}-seat`]),
    obs("tags_ok", "Tail exits correctly", "finish", false, []),
    obs("tag_wrong", "Tail path wrong", "finish", true, [`${p}-tag`]),
    obs("line_exits", "Standing part on-axis", "exits", false, []),
    obs("off_axis", "Off-axis load", "exits", true, [`${p}-axis`]),
    obs("both_exits", "Critical structure visible", "visibility", false, []),
  ];
}

function mk(
  id: string,
  summary: string,
  families: ConnectionJob[],
  materials: LineMaterial[],
  diagram: DiagramKind,
  extra?: Partial<MechanicsBundle["contract"]>,
): MechanicsBundle {
  return {
    contract: {
      connectionFamilies: families,
      permittedMaterials: materials,
      mainMaterials: materials,
      diameterRelationships: ["similar", "main-thinner", "main-thicker"] as DiameterRelation[],
      guidePassage: "n/a",
      finishedGeometry: "hitched",
      loopBehavior: "none",
      loadDirection: "inline",
      slipSensitivity: "moderate",
      seatingRequirements: "Dressed so every turn bears",
      tensionRequirements: "moderate",
      failureSensitiveStages: ["first turn", "dress"],
      hardExclusions: [],
      ...extra,
    },
    fieldFit: fit(),
    fingerprint: {
      expectedGeometry: "Dressed rope-work structure",
      expectedWrapCountRange: [1, 6],
      expectedTagOrientation: "Tail correct and long enough",
      expectedStandingOrientation: "Load on the intended part",
      expectedCoilDistribution: "Turns nested, not crossed",
      expectedSeatingPattern: "Fully dressed",
      expectedCrossoverBehavior: "None",
      expectedCompressionZones: "Primary friction zone",
      expectedFinishingStructure: id,
      dangerousDefects: [
        { id: `${id}-crossover`, label: "Walked or crossed turns", observationKey: "crossover", consequence: "Slip", mechanicsWhy: "Friction turns must nest", stepWhere: 2, decision: "retie-recommended" },
        { id: `${id}-seat`, label: "Undressed", observationKey: "gap_seating", consequence: "Spill or jam", mechanicsWhy: "Dress is the lock", stepWhere: 3, decision: "retie-now" },
        { id: `${id}-tag`, label: "Wrong tail path", observationKey: "tag_wrong", consequence: "Unlock", mechanicsWhy: "Tail completes the lock", stepWhere: 3, decision: "retie-now" },
      ],
      cosmeticIrregularities: [],
    },
    observations: base(id),
    diagramKind: diagram,
    mechanicsSummary: summary,
    completeness: FULL,
  };
}

export const MECHANICS_EXTRAS_BOATING_2: Record<string, MechanicsBundle> = {
  "water-bowline": mk(
    "water-bowline",
    "Bowline whose collar is a clove hitch. The extra security is the clove, not more bulk.",
    ["fixed-eye"],
    ROPE,
    "rope-loop",
    { loopBehavior: "fixed", finishedGeometry: "loop" },
  ),
  "bowline-on-a-bight": mk(
    "bowline-on-a-bight",
    "Two mid-line loops. The bight must encircle both standing parts.",
    ["mid-line-loop", "loop-over-post"],
    ROPE,
    "rope-loop",
    { loopBehavior: "fixed", finishedGeometry: "loop" },
  ),
  "alpine-butterfly": mk(
    "alpine-butterfly",
    "Single mid-line loop. Both standing parts and the loop can take load.",
    ["mid-line-loop"],
    [...ROPE, "dyneema"],
    "rope-loop",
    { loopBehavior: "fixed", finishedGeometry: "loop" },
  ),
  "cow-hitch": mk(
    "cow-hitch",
    "Bight over a post, both legs through. Slips if only one leg loads.",
    ["loop-over-post"],
    ROPE,
    "rope-hitch",
    { slipSensitivity: "high" },
  ),
  "buntline-hitch": mk(
    "buntline-hitch",
    "Clove on the standing part with the second turn inside. Jams after load — that is the hitch.",
    ["rope-to-ring"],
    ROPE,
    "rope-hitch",
  ),
  "icicle-hitch": mk(
    "icicle-hitch",
    "Grip hitch for slick or tapered standing parts. Turns away from the pull.",
    ["load-transfer"],
    ROPE,
    "rope-hitch",
    { slipSensitivity: "high", tensionRequirements: "high" },
  ),
  "truckers-hitch": mk(
    "truckers-hitch",
    "Tensioning system: directional loop, purchase, two half hitches to lock.",
    ["tension-line"],
    ROPE,
    "rope-hitch",
    { finishedGeometry: "wrap-stack" },
  ),
  "zeppelin-bend": mk(
    "zeppelin-bend",
    "6-and-9 bend. Holds and unties. Not a mismatch join.",
    ["rope-to-rope"],
    ROPE,
    "rope-bend",
    { finishedGeometry: "wrap-stack", diameterRelationships: ["similar"] },
  ),
  "carrick-bend": mk(
    "carrick-bend",
    "Lattice bend for large stiff ropes. Seize a standing hawser.",
    ["rope-to-rope"],
    ROPE,
    "rope-bend",
    { finishedGeometry: "wrap-stack", diameterRelationships: ["similar", "main-thinner", "main-thicker"] },
  ),
  "ashley-stopper": mk(
    "ashley-stopper",
    "Three-lobed stopper. Use when a figure-8 pulls through.",
    ["stopper"],
    [...ROPE, "dyneema"],
    "rope-stopper",
    { finishedGeometry: "compact", guidePassage: "poor" },
  ),
};
