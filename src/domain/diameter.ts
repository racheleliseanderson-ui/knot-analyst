/**
 * Diameter relationship helpers.
 *
 * Prefer relational bands over manufacturer pound-test. Optional millimetre
 * inputs map into the existing DiameterRelation vocabulary so Layer 1/2 stay
 * unchanged.
 */
import type { DiameterRelation } from "@/domain/types";

/**
 * Map two measured diameters (mm) to a relational band.
 * Ratio = main / secondary.
 */
export function relationFromDiameters(mainMm: number, secondaryMm: number): DiameterRelation {
  if (
    !(mainMm > 0) ||
    !(secondaryMm > 0) ||
    !Number.isFinite(mainMm) ||
    !Number.isFinite(secondaryMm)
  ) {
    return "similar";
  }
  const ratio = mainMm / secondaryMm;

  if (ratio >= 0.85 && ratio <= 1.18) return "similar";
  if (ratio < 0.85 && ratio >= 0.55) return "main-thinner";
  if (ratio < 0.55 && ratio >= 0.32) return "main-much-thinner";
  if (ratio < 0.32) return "extreme-mismatch";
  if (ratio > 1.18 && ratio <= 1.85) return "main-thicker";
  return "extreme-mismatch";
}

/** Parse a free-text mm field; empty / invalid → undefined. */
export function parseMm(raw: string | undefined | null): number | undefined {
  if (raw == null || raw.trim() === "") return undefined;
  const n = Number(
    String(raw)
      .replace(/,/g, ".")
      .replace(/[^\d.-]/g, ""),
  );
  if (!Number.isFinite(n) || n <= 0) return undefined;
  return n;
}
