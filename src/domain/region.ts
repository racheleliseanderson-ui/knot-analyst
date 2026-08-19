/**
 * Region — soft geographic prior for Fishing (Phase D).
 *
 * Region never hard-codes a knot ID. It may:
 *   1. Soft-load field condition chips (same contract as venue)
 *   2. Surface advisor copy after a run
 *
 * Flat ChooseInput goldens stay byte-stable when region is not selected.
 */
import type { ChooseInput } from "@/domain/types";

export type RegionTier = "broad" | "fine";

export type SaltLean = "salt" | "fresh" | "mixed";
export type AbrasionProfile = "oyster" | "rock" | "kelp" | "timber" | "barnacle" | "mixed" | "sand";

/** Lightweight signals for advisor language and Phase E counterfactuals. */
export interface RegionSignals {
  saltLean?: SaltLean;
  /** Higher chance of toothy species / wire traces in the mix. */
  wireWatch?: boolean;
  abrasion?: AbrasionProfile;
  /** Surf / shock-leader diameter-mismatch patterns common. */
  shockLeaderCommon?: boolean;
  /** Clear / pressured water — fluoro-leaning language, not a lock. */
  clearPressured?: boolean;
  /** Seasonal cold-hand bias. */
  coldSeason?: boolean;
}

export interface DomainRegion {
  id: string;
  label: string;
  tier: RegionTier;
  /** Fine regions point at their broad parent. */
  parentId?: string;
  summary: string;
  /** Soft condition patch — pre-loaded, never locked. */
  conditions: Partial<ChooseInput>;
  /**
   * Advisor lines shown after a run. Constraint-first language only —
   * never “use knot X because you are in Y.”
   */
  advisories: string[];
  signals?: RegionSignals;
}

/** Resolve active region: fine selection wins over broad-only. */
export function activeRegion(
  regions: DomainRegion[],
  broadId?: string,
  fineId?: string,
): DomainRegion | undefined {
  if (fineId) {
    const fine = regions.find((r) => r.id === fineId);
    if (fine) return fine;
  }
  if (broadId) return regions.find((r) => r.id === broadId);
  return undefined;
}

export function fineRegionsFor(
  regions: DomainRegion[],
  broadId: string | undefined,
): DomainRegion[] {
  if (!broadId) return [];
  return regions.filter((r) => r.tier === "fine" && r.parentId === broadId);
}

export function broadRegions(regions: DomainRegion[]): DomainRegion[] {
  return regions.filter((r) => r.tier === "broad");
}
