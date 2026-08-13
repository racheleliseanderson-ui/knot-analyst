/**
 * Framework-independent knot intelligence domain.
 * Mechanical intelligence first — AI never overrides Layer 1 hard constraints.
 *
 * Product: Knot Analyst (Hook the Horizon). Application IDs stay stable for
 * provenance; they are not user-facing product names — see domain/brand.ts.
 */

export const APP_VERSION = "1.1.0";
export const APPLICATION_ID = "HTH-KK-001";
export const ADAPTER_KEY = "horizon.knot-intelligence";
export const KNOT_CATALOG_VERSION = "2026-08-13.1";
export const CONFIG_VERSION = "nitro-fluid-v1.3.0";
export const ENGINE_VERSION = "mech-intel-1.3.0";

/** What the angler is actually connecting (convenience preset IDs — stable). */
export type ConnectionJob =
  | "line-to-hook"
  | "line-to-lure"
  | "braid-to-leader"
  | "leader-to-leader"
  | "line-to-swivel"
  | "line-to-spool"
  | "fly-line-to-leader"
  | "leader-to-tippet"
  | "double-line-to-leader"
  | "loop-to-loop"
  | "line-to-loop"
  | "hook-snell";

export type LineMaterial =
  | "mono"
  | "fluoro"
  | "braid"
  | "fly-line"
  | "backing"
  | "wire"
  | "mixed";

export type DiameterRelation =
  | "similar"
  | "main-thinner"
  | "main-much-thinner"
  | "main-thicker"
  | "extreme-mismatch";

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type KnotCategory =
  | "terminal"
  | "line-to-line"
  | "loop"
  | "leader-to-tippet"
  | "backing-to-line"
  | "specialty"
  | "utility";

export type FindingSeverity = "info" | "watch" | "stop";
export type FindingConfidence = "low" | "moderate" | "high";

/** Central field-mode outputs for finished-knot checks */
export type RetieDecision =
  | "cosmetic"
  | "watch"
  | "retie-recommended"
  | "retie-now"
  | "cannot-verify";

/** Field-fit dimension keys (Layer 2 ranking) */
export const FIELD_FIT_DIMENSIONS = [
  "connectionJobFit",
  "materialCompatibility",
  "diameterRelationship",
  "eyeHardwareGeometry",
  "guidePassage",
  "finishedProfile",
  "loadBehavior",
  "fieldTieability",
  "coldWetHandDifficulty",
  "lowLightDifficulty",
  "windSensitivity",
  "requiredTensionControl",
  "inspectionDifficulty",
  "retieSpeed",
  "failureSensitivity",
  "userProficiency",
] as const;

export type FieldFitScores = Record<(typeof FIELD_FIT_DIMENSIONS)[number], number>;

export interface KnotResource {
  type: "video" | "pdf" | "article";
  title: string;
  url: string;
  source: string;
  vetted: boolean;
  notes?: string;
  durationOrPages?: string;
}

export interface KnotStep {
  order: number;
  instruction: string;
  tip?: string;
  commonError?: string;
  failureLinks?: string[];
  detail?: string;
  expectedResult?: string;
  look?: string;
  failureMode?: string;
  quickFix?: string;
}

export interface SeatingPhase {
  phase: string;
  action: string;
  tension: string;
}

export interface DiagnosticRule {
  id: string;
  symptom: string;
  likelyCauses: string[];
  checks: string[];
  fixes: string[];
  severity: FindingSeverity;
  confidence: FindingConfidence;
  retieDecision?: RetieDecision;
  mechanicsLink?: string;
  stepLink?: number;
}

export interface MechanicalContract {
  connectionFamilies: ConnectionJob[];
  permittedMaterials: LineMaterial[];
  mainMaterials?: LineMaterial[];
  secondaryMaterials?: LineMaterial[];
  diameterRelationships: DiameterRelation[];
  requiresHardwareEye?: boolean;
  eyeMustPassDoubledLine?: boolean;
  requiresStandingLoop?: boolean;
  requiresDoubleLine?: boolean;
  guidePassage: "excellent" | "good" | "fair" | "poor" | "n/a";
  finishedGeometry: "compact" | "barrel" | "loop" | "wrap-stack" | "hitched";
  loopBehavior: "none" | "fixed" | "non-slip" | "open";
  loadDirection: "inline" | "loop-swing" | "snell-shank";
  slipSensitivity: "low" | "moderate" | "high";
  seatingRequirements: string;
  tensionRequirements: "low" | "moderate" | "high" | "extreme";
  failureSensitiveStages: string[];
  hardExclusions?: string[];
}

export interface GeometricRule {
  id: string;
  description: string;
  violatedBy: string[];
  supportedBy?: string[];
  severity: RetieDecision;
  mechanicsWhy: string;
  stepWhere?: number | null;
  appliesWhen?: {
    requiresDoubledLine?: boolean;
    requiresStandingLoop?: boolean;
    finishedGeometry?: MechanicalContract["finishedGeometry"][];
    loopBehavior?: MechanicalContract["loopBehavior"][];
  };
}

export interface FinishedFingerprint {
  expectedGeometry: string;
  expectedWrapDirection?: string;
  expectedWrapCountRange?: [number, number];
  expectedTagOrientation: string;
  expectedStandingOrientation: string;
  expectedLoopGeometry?: string;
  expectedCoilDistribution: string;
  expectedSeatingPattern: string;
  expectedCrossoverBehavior: string;
  expectedCompressionZones: string;
  expectedFinishingStructure: string;
  dangerousDefects: DefectDef[];
  cosmeticIrregularities: string[];
  geometricRules?: GeometricRule[];
}

export interface VisionObservation {
  key: string;
  confidence: number;
  evidence?: {
    boundingBox?: [number, number, number, number];
    view?: "front" | "side" | "tag" | "exit";
    notes?: string;
  };
}

export interface VisionResult {
  knotIdHint?: string;
  observations: VisionObservation[];
  quality: {
    focusOk: boolean;
    criticalStructureVisible: boolean;
    bothExitsVisible: boolean;
    tagVisible: boolean;
  };
  unableToVerify: string[];
}

export interface DefectDef {
  id: string;
  label: string;
  observationKey: string;
  consequence: string;
  mechanicsWhy: string;
  stepWhere: number | null;
  decision: RetieDecision;
}

export interface ObservationDef {
  key: string;
  label: string;
  group: "geometry" | "wraps" | "exits" | "finish" | "visibility";
  badWhen: boolean;
  relatedDefectIds: string[];
}

export interface FieldFitProfile {
  baseline: Partial<FieldFitScores>;
  strengths: string[];
  weaknesses: string[];
}

export interface KnotContent {
  id: string;
  name: string;
  aliases: string[];
  category: KnotCategory;
  bestFor: string[];
  goodFor: string;
  notIdealFor: string[];
  lineMaterials: LineMaterial[];
  strengthRetentionTypical?: string;
  difficulty: Difficulty;
  materialsNeeded: string[];
  toolsHelpful?: string[];
  steps: KnotStep[];
  howToSummary: string;
  commonMistakes: string[];
  diagnostics: DiagnosticRule[];
  resources: KnotResource[];
  relatedKnots: string[];
  tags: string[];
  reviewedOn: string;
  sources: { title: string; url?: string; note?: string }[];
  beforeYouStart?: string[];
  seatingSequence?: SeatingPhase[];
  fieldNotes?: string[];
  video?: KnotVideo;
}

export interface KnotVideo {
  provider: "youtube";
  id: string;
  title: string;
  channel: string;
  startsAt?: number;
}

export interface CompletenessFlags {
  atAGlance: boolean;
  mechanics: boolean;
  diagram: boolean;
  tyingSteps: boolean;
  finishedCheck: boolean;
  failureDiagnosis: boolean;
  constraints: boolean;
  compareNext: boolean;
  sources: boolean;
  decisionModel: boolean;
  mechanicalFingerprint: boolean;
  failureRules: boolean;
  visualInspectability: boolean;
  offlineAssets: boolean;
}

export type DiagramKind =
  | "terminal-eye"
  | "terminal-palomar"
  | "terminal-uni"
  | "terminal-snell"
  | "line-join"
  | "braid-leader-fg"
  | "braid-leader-alberto"
  | "loop-fixed"
  | "loop-nonslip"
  | "generic";

export interface Knot extends KnotContent {
  contract: MechanicalContract;
  fieldFit: FieldFitProfile;
  fingerprint: FinishedFingerprint;
  observations: ObservationDef[];
  diagramKind: DiagramKind;
  mechanicsSummary: string;
  completeness: CompletenessFlags;
}

export interface ChooseInput {
  connection: ConnectionJob;
  mainMaterial?: LineMaterial;
  secondaryMaterial?: LineMaterial;
  mainSpec?: import("@/domain/material").MaterialSpec;
  secondarySpec?: import("@/domain/material").MaterialSpec;
  structuralJob?: import("@/domain/connection-preset").StructuralJob;
  mainRole?: import("@/domain/material").MaterialRole;
  secondaryRole?: import("@/domain/material").MaterialRole;
  diameterRelation?: DiameterRelation;
  mainDiameterMm?: number;
  secondaryDiameterMm?: number;
  mustPassGuides?: boolean;
  windy?: boolean;
  coldHands?: boolean;
  lowLight?: boolean;
  retieFrequency?: "frequent" | "occasional" | "rare";
  proficiency?: Difficulty | "any";
  hardwareEyeSmall?: boolean;
  needsUntie?: boolean;
  freeSwing?: boolean;
}

export interface ConstraintElimination {
  knotId: string;
  knotName: string;
  reasons: string[];
}

export interface DimensionScore {
  dimension: (typeof FIELD_FIT_DIMENSIONS)[number];
  score: number;
  weight: number;
  note?: string;
}

export interface RankedOption {
  knot: Knot;
  fieldFitPercent: number;
  dimensionScores: DimensionScore[];
  whyBest: string[];
  butNotes: string[];
  whyNotOthers?: string[];
  vsNext?: string;
  eliminatedCompetitors?: string[];
}

export interface ChooseResult {
  generatedAt: string;
  applicationId: string;
  engineVersion: string;
  catalogVersion: string;
  input: ChooseInput;
  eliminated: ConstraintElimination[];
  ranked: RankedOption[];
  plainSummary: string;
  confidence: FindingConfidence;
  counterfactualHints: string[];
  tradeoffSummary?: string;
  termination?: import("@/domain/material").TerminationAdvice;
  terminationCandidates?: import("@/domain/termination").TerminationCandidate[];
}

export interface LayeredFinding {
  id: string;
  severity: FindingSeverity;
  title: string;
  observation: string;
  implication: string;
  nextAction: string;
  rationale: string;
  alternatives?: string[];
  confidence: FindingConfidence;
  tradeoff?: string;
  category:
    | "selection"
    | "tying"
    | "strength"
    | "material"
    | "boundary"
    | "diagnostics"
    | "constraint"
    | "retie";
  mechanicsLink?: string;
  stepLink?: number;
}

export interface CheckInput {
  knotId: string;
  observations: string[];
  symptom?: string;
  criticalStructureVisible?: boolean;
  bothExitsVisible?: boolean;
  tagVisible?: boolean;
  focusOk?: boolean;
}

export interface CheckResult {
  generatedAt: string;
  applicationId: string;
  engineVersion: string;
  knot: Knot;
  input: CheckInput;
  retieDecision: RetieDecision;
  retieLabel: string;
  diagnosticConfidence: FindingConfidence;
  confidenceReasons: string[];
  unableToVerify: string[];
  findings: LayeredFinding[];
  whatISee: string[];
  whyItMatters: string[];
  whatToDo: string[];
  plainSummary: string;
}

export const CONNECTION_LABELS: Record<ConnectionJob, string> = {
  "line-to-hook": "Line → hook",
  "line-to-lure": "Line → lure",
  "braid-to-leader": "Braid → leader",
  "leader-to-leader": "Leader → leader",
  "line-to-swivel": "Line → swivel",
  "line-to-spool": "Line → spool",
  "fly-line-to-leader": "Fly line → leader",
  "leader-to-tippet": "Leader → tippet",
  "double-line-to-leader": "Double line → leader",
  "loop-to-loop": "Loop → loop",
  "line-to-loop": "Line → loop (fixed end loop)",
  "hook-snell": "Snell → hook shank",
};

export const CONNECTION_GROUPS: { title: string; jobs: ConnectionJob[] }[] = [
  {
    title: "Terminal",
    jobs: ["line-to-hook", "line-to-lure", "line-to-swivel", "hook-snell"],
  },
  {
    title: "Line to line",
    jobs: [
      "braid-to-leader",
      "leader-to-leader",
      "leader-to-tippet",
      "double-line-to-leader",
      "fly-line-to-leader",
    ],
  },
  {
    title: "Loops & spool",
    jobs: ["loop-to-loop", "line-to-loop", "line-to-spool"],
  },
];

export const CATEGORY_LABELS: Record<KnotCategory, string> = {
  terminal: "Terminal",
  "line-to-line": "Line-to-line",
  loop: "Loop",
  "leader-to-tippet": "Leader to tippet",
  "backing-to-line": "Backing to line",
  specialty: "Specialty",
  utility: "Utility",
};

export const MATERIAL_LABELS: Record<LineMaterial, string> = {
  mono: "Monofilament",
  fluoro: "Fluorocarbon",
  braid: "Braid",
  "fly-line": "Fly line",
  backing: "Backing",
  wire: "Wire",
  mixed: "Mixed",
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export const DIAMETER_LABELS: Record<DiameterRelation, string> = {
  similar: "Similar diameters",
  "main-thinner": "Main slightly thinner",
  "main-much-thinner": "Main much thinner (e.g. braid → heavy leader)",
  "main-thicker": "Main thicker",
  "extreme-mismatch": "Extreme mismatch",
};

export const DIMENSION_LABELS: Record<(typeof FIELD_FIT_DIMENSIONS)[number], string> = {
  connectionJobFit: "Connection-job fit",
  materialCompatibility: "Material compatibility",
  diameterRelationship: "Diameter relationship",
  eyeHardwareGeometry: "Eye / hardware geometry",
  guidePassage: "Guide passage",
  finishedProfile: "Finished profile",
  loadBehavior: "Load behavior",
  fieldTieability: "Field tieability",
  coldWetHandDifficulty: "Cold / wet hands",
  lowLightDifficulty: "Low-light difficulty",
  windSensitivity: "Wind sensitivity",
  requiredTensionControl: "Tension / control needed",
  inspectionDifficulty: "Inspection difficulty",
  retieSpeed: "Retie speed",
  failureSensitivity: "Failure sensitivity",
  userProficiency: "User proficiency fit",
};

export const RETIE_LABELS: Record<RetieDecision, string> = {
  cosmetic: "Cosmetic — does not materially affect known mechanics",
  watch: "Watch — potential issue; inspect more closely",
  "retie-recommended": "Retie recommended — known mechanical defect risk",
  "retie-now": "Retie now — critical geometry wrong or unverifiable",
  "cannot-verify": "Cannot verify — insufficient evidence; do not trust this inspection",
};

export interface KnotSelectorInput {
  purpose: string;
  category?: KnotCategory | "any";
  lineMaterial?: LineMaterial | "any";
  experience?: "beginner" | "any";
  constraints?: string[];
  strugglingWith?: string;
  knotId?: string;
}

export interface RankedKnot {
  knot: Knot;
  score: number;
  matchReasons: string[];
  watchNotes: string[];
}

export interface KnotIntelligenceResult {
  generatedAt: string;
  applicationId: string;
  adapterKey: string;
  catalogVersion: string;
  input: KnotSelectorInput;
  ranked: RankedKnot[];
  findings: LayeredFinding[];
  primary?: Knot;
  checklist: string[];
  plainSummary: string;
  confidence: FindingConfidence;
  choose?: ChooseResult;
}

export const PURPOSE_OPTIONS = [
  { id: "hook-to-line", label: "Hook or lure to line" },
  { id: "join-lines", label: "Join two lines" },
  { id: "braid-to-leader", label: "Braid to mono/fluoro leader" },
  { id: "loop-connection", label: "Loop connection" },
  { id: "leader-tippet", label: "Leader to tippet" },
  { id: "fly-hook", label: "Fly to tippet" },
  { id: "snell-hook", label: "Snell a hook" },
  { id: "high-strength", label: "Maximum strength terminal" },
  { id: "easy-quick", label: "Fast and easy to tie" },
  { id: "easy-untie", label: "Easy to untie" },
] as const;

export const CONSTRAINT_OPTIONS = [
  { id: "cold-hands", label: "Cold or limited dexterity" },
  { id: "wet-line", label: "Often wet when seating" },
  { id: "thin-line", label: "Very light line" },
  { id: "heavy-line", label: "Heavy line / big game" },
  { id: "no-tools", label: "No tools available" },
  { id: "must-untie", label: "Must untie later" },
] as const;
