/** Boating batch 3 mechanics. */
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

export const MECHANICS_EXTRAS_BOATING_3: Record<string, MechanicsBundle> = {
  "yosemite-bowline": mk(
    "yosemite-bowline",
    "Bowline with the tail captured in a Yosemite tuck. Dress the collar first or the eye inverts.",
    ["fixed-eye"],
    ROPE,
    "rope-loop",
    { loopBehavior: "fixed", finishedGeometry: "loop" },
  ),
  "pile-hitch": mk(
    "pile-hitch",
    "Bight over a pile, around the standings, bight back over the top. Temporary. Both legs share.",
    ["loop-over-post", "rope-to-bollard"],
    ROPE,
    "rope-hitch",
    { slipSensitivity: "high" },
  ),
  "halyard-hitch": mk(
    "halyard-hitch",
    "Compact shackle hitch. Two turns, tail tucked back. Jams after load — that is the hitch.",
    ["rope-to-ring"],
    ROPE,
    "rope-hitch",
  ),
  "midshipmans-hitch": mk(
    "midshipmans-hitch",
    "Adjustable guy. The extra inside tuck is the hold. Taut-line is the weaker alias — we model one.",
    ["tension-line"],
    ROPE,
    "rope-hitch",
    { slipSensitivity: "high" },
  ),
  "hunters-bend": mk(
    "hunters-bend",
    "Rigger's bend. Opposite tails through their own loops. Similar diameters. Can jam after a snatch.",
    ["rope-to-rope"],
    ROPE,
    "rope-bend",
    { finishedGeometry: "wrap-stack", diameterRelationships: ["similar"] },
  ),
  "heaving-line-knot": mk(
    "heaving-line-knot",
    "Wraps that add throwing mass. Not a load-bearing stopper and not a join.",
    ["stopper"],
    ROPE,
    "rope-stopper",
    { finishedGeometry: "wrap-stack", guidePassage: "poor" },
  ),
  "estar-stopper": mk(
    "estar-stopper",
    "HMPE stopper. Extra tucks a figure-8 does not have. Stopper, never a join.",
    ["stopper"],
    ["dyneema", "polyester"],
    "rope-stopper",
    { finishedGeometry: "compact", guidePassage: "poor", slipSensitivity: "low" },
  ),
  "reef-knot": mk(
    "reef-knot",
    "Binding / reefing only. Two nested half-knots. Must not be scored as a rope-to-rope join.",
    ["reef-or-bind"],
    ROPE,
    "rope-bend",
    { finishedGeometry: "compact", slipSensitivity: "high", diameterRelationships: ["similar"] },
  ),
  constrictor: mk(
    "constrictor",
    "Bind that must not walk. Crossed riding turn is the lock. Expect to cut it.",
    ["reef-or-bind"],
    ROPE,
    "rope-hitch",
    { slipSensitivity: "low", tensionRequirements: "high" },
  ),
  "timber-hitch": mk(
    "timber-hitch",
    "Hoist or drag a spar. Holds under tension only. Collapses unloaded — that is the hitch.",
    ["load-transfer"],
    ROPE,
    "rope-hitch",
    { slipSensitivity: "high" },
  ),
};
