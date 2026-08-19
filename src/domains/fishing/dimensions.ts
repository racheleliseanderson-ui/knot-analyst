/** Fishing field-fit dimensions — the exact 16 keys and weights in use today. */
import { DIMENSION_LABELS, FIELD_FIT_DIMENSIONS } from "@/domain/types";
import type { DomainDimension } from "@/domain/domain";

export const FISHING_WEIGHTS: Record<(typeof FIELD_FIT_DIMENSIONS)[number], number> = {
  connectionJobFit: 1.4,
  materialCompatibility: 1.2,
  diameterRelationship: 1.1,
  eyeHardwareGeometry: 0.7,
  guidePassage: 0.6,
  finishedProfile: 0.8,
  loadBehavior: 1.2,
  fieldTieability: 0.9,
  coldWetHandDifficulty: 0.15,
  lowLightDifficulty: 0.1,
  windSensitivity: 0.15,
  requiredTensionControl: 0.5,
  inspectionDifficulty: 0.4,
  retieSpeed: 0.6,
  failureSensitivity: 0.7,
  userProficiency: 0.8,
};

export const FISHING_DIMENSIONS: DomainDimension[] = FIELD_FIT_DIMENSIONS.map((key) => ({
  key,
  label: DIMENSION_LABELS[key],
  weight: FISHING_WEIGHTS[key],
}));
