/**
 * Fishing vocabulary — re-exported from the existing domain types so there is
 * a single source of truth today and a clean seam for a second domain later.
 */
import {
  CONNECTION_GROUPS,
  CONNECTION_LABELS,
  DIAMETER_LABELS,
  MATERIAL_LABELS,
} from "@/domain/types";
import type { DomainOption } from "@/domain/domain";

export const FISHING_CONNECTIONS: DomainOption[] = CONNECTION_GROUPS.flatMap((g) =>
  g.jobs.map((id) => ({ id, label: CONNECTION_LABELS[id], group: g.title })),
);

const FISHING_MATERIAL_IDS = ["mono", "fluoro", "braid", "fly-line", "backing", "wire"] as const;

export const FISHING_MATERIALS: DomainOption[] = FISHING_MATERIAL_IDS.map((id) => ({
  id,
  label: MATERIAL_LABELS[id],
}));

export const FISHING_DIAMETERS: DomainOption[] = Object.entries(DIAMETER_LABELS).map(
  ([id, label]) => ({ id, label }),
);
