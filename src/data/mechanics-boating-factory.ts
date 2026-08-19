/**
 * Shared factory for modelled rope-work mechanics.
 * Each knot still supplies its own fingerprint, field-fit, and defects —
 * this only stops the three batch files from re-declaring the same shell.
 */
import type { MechanicsBundle } from "@/data/mechanics-profiles";
import type {
  CompletenessFlags,
  ConnectionJob,
  DiagramKind,
  FieldFitScores,
  GeometricRule,
  LineMaterial,
  MechanicalContract,
  ObservationDef,
  RetieDecision,
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

export const ROPE_FIBRES: LineMaterial[] = ["polyester", "nylon", "polypropylene", "natural"];

const RULE_TURNS_NEST: GeometricRule = {
  id: "turns-nest",
  description: "Turns must nest with no walked crossover",
  violatedBy: ["crossover"],
  supportedBy: ["barrel_uniform"],
  severity: "retie-now",
  mechanicsWhy: "A walked turn dumps friction and the hitch slips or jams in the wrong place.",
};

const RULE_DRESSED: GeometricRule = {
  id: "rope-dressed",
  description: "Structure must be fully dressed before load",
  violatedBy: ["gap_seating"],
  supportedBy: ["fully_seated"],
  severity: "retie-now",
  mechanicsWhy: "An undressed rope structure is not finished — dress is the lock.",
};

const RULE_TAIL_PATH: GeometricRule = {
  id: "rope-tail-path",
  description: "Tail must follow the lock path for this hitch or bend",
  violatedBy: ["tag_wrong"],
  supportedBy: ["tags_ok"],
  severity: "retie-now",
  mechanicsWhy: "Wrong tail path leaves the lock incomplete.",
};

const RULE_LOOP_COLLAR: GeometricRule = {
  id: "rope-loop-collar",
  description: "Fixed-eye collar must stay seated on the standing part",
  violatedBy: ["loop_collapses", "gap_seating"],
  supportedBy: ["fully_seated"],
  severity: "retie-now",
  mechanicsWhy: "An open collar lets a bowline-family eye capsize under cyclic load.",
};

export type RopeObsFamily = "hitch" | "loop" | "bend" | "stopper" | "cleat";

export interface RopeDefect {
  key: "crossover" | "gap_seating" | "tag_wrong" | "off_axis";
  label: string;
  consequence: string;
  why: string;
  step: number;
  decision?: RetieDecision;
}

export interface RopeMkSpec {
  id: string;
  summary: string;
  families: ConnectionJob[];
  materials: LineMaterial[];
  diagram: DiagramKind;
  obs?: RopeObsFamily;
  contract?: Partial<MechanicalContract>;
  strengths: string[];
  weaknesses: string[];
  fit?: Partial<FieldFitScores>;
  geometry: string;
  tag: string;
  standing: string;
  coils: string;
  seating: string;
  crossover: string;
  compression: string;
  finish: string;
  wraps?: [number, number];
  defects: RopeDefect[];
  extraRules?: GeometricRule[];
}

function obs(
  key: string,
  label: string,
  group: ObservationDef["group"],
  badWhen: boolean,
  relatedDefectIds: string[],
): ObservationDef {
  return { key, label, group, badWhen, relatedDefectIds };
}

function observations(id: string, family: RopeObsFamily): ObservationDef[] {
  const p = id;
  if (family === "loop") {
    return [
      obs("barrel_uniform", "Collar and nipping loop look even", "wraps", false, []),
      obs("crossover", "Collar twisted or walked off the standing part", "wraps", true, [
        `${p}-crossover`,
      ]),
      obs("fully_seated", "Collar seated on the standing part", "geometry", false, []),
      obs("gap_seating", "Open collar or undressed nipping loop", "geometry", true, [`${p}-seat`]),
      obs("tags_ok", "Tail exits the documented lock path", "finish", false, []),
      obs("tag_wrong", "Tail missing the lock or too short", "finish", true, [`${p}-tag`]),
      obs("line_exits", "Standing part leaves on the load axis", "exits", false, []),
      obs("off_axis", "Eye loading off-axis or inverted", "exits", true, [`${p}-axis`]),
      obs("both_exits", "Eye, collar, and tail all visible", "visibility", false, []),
    ];
  }
  if (family === "bend") {
    return [
      obs("barrel_uniform", "Both sides of the bend look symmetric and nested", "wraps", false, []),
      obs("crossover", "Broken lattice or opposite-side tails", "wraps", true, [`${p}-crossover`]),
      obs("fully_seated", "Bend fully dressed, no daylight in the lock", "geometry", false, []),
      obs("gap_seating", "Undressed or half-formed bend", "geometry", true, [`${p}-seat`]),
      obs("tags_ok", "Tails exit the documented sides", "finish", false, []),
      obs("tag_wrong", "A tail on the wrong side or missing a tuck", "finish", true, [`${p}-tag`]),
      obs("line_exits", "Both standing parts leave on-axis", "exits", false, []),
      obs("off_axis", "One standing part loading the wrong lock", "exits", true, [`${p}-axis`]),
      obs("both_exits", "Both tails and both standings visible", "visibility", false, []),
    ];
  }
  if (family === "cleat") {
    return [
      obs("barrel_uniform", "Figure-eights lie flat across both horns", "wraps", false, []),
      obs("crossover", "Piled extra locks or a crossed first turn", "wraps", true, [
        `${p}-crossover`,
      ]),
      obs("fully_seated", "Full turn on the far-horn base", "geometry", false, []),
      obs("gap_seating", "No base turn, or lock not under the last cross", "geometry", true, [
        `${p}-seat`,
      ]),
      obs("tags_ok", "Locking hitch parts lie parallel", "finish", false, []),
      obs("tag_wrong", "Jammed lock or tail not under the last cross", "finish", true, [
        `${p}-tag`,
      ]),
      obs("line_exits", "Load comes onto the far horn first", "exits", false, []),
      obs("off_axis", "First turn on the near horn", "exits", true, [`${p}-axis`]),
      obs("both_exits", "Far-horn turn, crosses, and lock all visible", "visibility", false, []),
    ];
  }
  if (family === "stopper") {
    return [
      obs("barrel_uniform", "Stopper body compact and larger than the opening", "wraps", false, []),
      obs("crossover", "Loose or unfinished body that can pull through", "wraps", true, [
        `${p}-crossover`,
      ]),
      obs("fully_seated", "Body dressed hard against itself", "geometry", false, []),
      obs("gap_seating", "Open or undersized stopper", "geometry", true, [`${p}-seat`]),
      obs("tags_ok", "Short tail, not loaded as a join", "finish", false, []),
      obs("tag_wrong", "Tail left out or the body asked to join", "finish", true, [`${p}-tag`]),
      obs("line_exits", "Standing part on the working side of the block", "exits", false, []),
      obs("off_axis", "Stopper sitting where a join should be", "exits", true, [`${p}-axis`]),
      obs("both_exits", "Body and tail visible against the opening", "visibility", false, []),
    ];
  }
  return [
    obs("barrel_uniform", "Turns stacked and nested", "wraps", false, []),
    obs("crossover", "Walked or crossed turns", "wraps", true, [`${p}-crossover`]),
    obs("fully_seated", "Hitch dressed up to the load", "geometry", false, []),
    obs("gap_seating", "Loose or undressed hitch", "geometry", true, [`${p}-seat`]),
    obs("tags_ok", "Tail exits the lock path", "finish", false, []),
    obs("tag_wrong", "Tail path wrong or too short", "finish", true, [`${p}-tag`]),
    obs("line_exits", "Standing part on the intended load axis", "exits", false, []),
    obs("off_axis", "Load on the wrong part of the hitch", "exits", true, [`${p}-axis`]),
    obs("both_exits", "Critical turns and tail visible", "visibility", false, []),
  ];
}

function defaultRules(family: RopeObsFamily): GeometricRule[] {
  if (family === "loop") return [RULE_LOOP_COLLAR, RULE_DRESSED, RULE_TAIL_PATH];
  return [RULE_TURNS_NEST, RULE_DRESSED, RULE_TAIL_PATH];
}

export function ropeMk(spec: RopeMkSpec): MechanicsBundle {
  const family = spec.obs ?? "hitch";
  return {
    contract: {
      connectionFamilies: spec.families,
      permittedMaterials: spec.materials,
      mainMaterials: spec.materials,
      diameterRelationships: ["similar", "main-thinner", "main-thicker"],
      guidePassage: "n/a",
      finishedGeometry: "hitched",
      loopBehavior: "none",
      loadDirection: "inline",
      slipSensitivity: "moderate",
      seatingRequirements: "Dressed so every turn bears",
      tensionRequirements: "moderate",
      failureSensitiveStages: ["first turn", "dress"],
      hardExclusions: [],
      ...spec.contract,
    },
    fieldFit: {
      baseline: {
        connectionJobFit: 82,
        materialCompatibility: 78,
        diameterRelationship: 70,
        eyeHardwareGeometry: 70,
        guidePassage: 65,
        finishedProfile: 74,
        loadBehavior: 80,
        fieldTieability: 78,
        coldWetHandDifficulty: 70,
        lowLightDifficulty: 68,
        windSensitivity: 72,
        requiredTensionControl: 70,
        inspectionDifficulty: 78,
        retieSpeed: 80,
        failureSensitivity: 72,
        userProficiency: 75,
        ...spec.fit,
      },
      strengths: spec.strengths,
      weaknesses: spec.weaknesses,
    },
    fingerprint: {
      expectedGeometry: spec.geometry,
      expectedWrapCountRange: spec.wraps ?? [1, 4],
      expectedTagOrientation: spec.tag,
      expectedStandingOrientation: spec.standing,
      expectedCoilDistribution: spec.coils,
      expectedSeatingPattern: spec.seating,
      expectedCrossoverBehavior: spec.crossover,
      expectedCompressionZones: spec.compression,
      expectedFinishingStructure: spec.finish,
      dangerousDefects: spec.defects.map((d) => ({
        id: `${spec.id}-${d.key === "gap_seating" ? "seat" : d.key === "tag_wrong" ? "tag" : d.key === "off_axis" ? "axis" : "crossover"}`,
        label: d.label,
        observationKey: d.key,
        consequence: d.consequence,
        mechanicsWhy: d.why,
        stepWhere: d.step,
        decision: d.decision ?? "retie-now",
      })),
      geometricRules: spec.extraRules ?? defaultRules(family),
      cosmeticIrregularities: ["Minor tail-length variation if the lock path is correct"],
    },
    observations: observations(spec.id, family),
    diagramKind: spec.diagram,
    mechanicsSummary: spec.summary,
    completeness: FULL,
  };
}
