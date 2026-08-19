/**
 * Mechanical contracts, field-fit baselines, fingerprints, and observation schemas.
 * Deterministic intelligence — separate from prose how-to content.
 */
import type {
  CompletenessFlags,
  DiagramKind,
  FieldFitProfile,
  FinishedFingerprint,
  GeometricRule,
  MechanicalContract,
  ObservationDef,
} from "@/domain/types";

export interface MechanicsBundle {
  contract: MechanicalContract;
  fieldFit: FieldFitProfile;
  fingerprint: FinishedFingerprint;
  observations: ObservationDef[];
  diagramKind: DiagramKind;
  mechanicsSummary: string;
  completeness: CompletenessFlags;
}

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

// RESTORE_MARKER — full content too large for single tool payload; using git history recovery next.
export const MECHANICS: Record<string, MechanicsBundle> = {};

export function getMechanics(knotId: string): MechanicsBundle | undefined {
  return MECHANICS[knotId];
}
