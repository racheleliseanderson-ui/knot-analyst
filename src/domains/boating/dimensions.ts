import type { DomainDimension } from "@/domain/domain";
import { FISHING_DIMENSIONS } from "@/domains/fishing/dimensions";

/**
 * Boating reuses the shared dimensions and adds Rope Construction — the one
 * axis Fishing must never render, so Fishing UX length is unchanged.
 */
export const BOATING_DIMENSIONS: DomainDimension[] = [
  ...FISHING_DIMENSIONS,
  { key: "ropeConstruction", label: "Rope construction", weight: 1.3, optional: true },
];
