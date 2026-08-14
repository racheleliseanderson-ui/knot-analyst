/** Boating batch 1 mechanics. */
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
      expectedWrapCountRange: [1, 4],
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

export const MECHANICS_EXTRAS_BOATING: Record<string, MechanicsBundle> = {
  "cleat-hitch": mk("cleat-hitch", "Far-horn first turn, figure-eights, locking hitch that still breaks by hand.", ["rope-to-cleat"], [...ROPE, "dyneema"], "rope-cleat", { finishedGeometry: "hitched" }),
  "round-turn-two-half-hitches": mk("round-turn-two-half-hitches", "Round turn takes the load; two nested half hitches only lock it.", ["rope-to-bollard", "rope-to-ring"], [...ROPE, "dyneema"], "rope-hitch"),
  "clove-hitch": mk("clove-hitch", "Fast temporary hitch. Walks under cycling load — not a mooring plan.", ["rope-to-bollard"], ROPE, "rope-hitch", { slipSensitivity: "high" }),
  "anchor-bend": mk("anchor-bend", "Round turn through a ring, tuck through both turns, half hitch. Seize a standing job.", ["rope-to-ring"], ROPE, "rope-hitch"),
  bowline: mk("bowline", "Fixed eye that unties after load. Backup the tail on a serious job.", ["fixed-eye", "loop-over-post"], ROPE, "rope-loop", { loopBehavior: "fixed", finishedGeometry: "loop" }),
  "figure-8-loop": mk("figure-8-loop", "Inspectable fixed eye. Higher band than a bowline; can jam after a snatch.", ["fixed-eye", "loop-over-post"], [...ROPE, "dyneema"], "rope-loop", { loopBehavior: "fixed", finishedGeometry: "loop" }),
  "sheet-bend": mk("sheet-bend", "Join similar-diameter ropes. Tails must exit the same side.", ["rope-to-rope"], ROPE, "rope-bend", { finishedGeometry: "wrap-stack", diameterRelationships: ["similar"] }),
  "double-sheet-bend": mk("double-sheet-bend", "Extra turn of the thinner rope around a bight in the thicker.", ["unequal-rope-join", "rope-to-rope"], ROPE, "rope-bend", { finishedGeometry: "wrap-stack", diameterRelationships: ["main-thinner", "main-much-thinner", "main-thicker"] }),
  "rolling-hitch": mk("rolling-hitch", "Directional grip hitch for snubbers. Slides first, breaks second.", ["load-transfer"], ROPE, "rope-hitch", { slipSensitivity: "high" }),
  "figure-8-stopper": mk("figure-8-stopper", "Stopper only. Not a working join.", ["stopper"], [...ROPE, "dyneema"], "rope-stopper", { finishedGeometry: "compact", guidePassage: "poor" }),
};
