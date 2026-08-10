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

const GROUP_OF = new Map<string, string>();
for (const g of CONNECTION_GROUPS) for (const j of g.jobs) GROUP_OF.set(j, g.title);

export const FISHING_CONNECTIONS: DomainOption[] = Object.entries(CONNECTION_LABELS).map(
  ([id, label]) => ({ id, label, group: GROUP_OF.get(id) ?? "Other" }),
);

export const FISHING_MATERIALS: DomainOption[] = Object.entries(MATERIAL_LABELS)
  .filter(([id]) => id !== "mixed")
  .map(([id, label]) => ({ id, label }));

export const FISHING_DIAMETERS: DomainOption[] = Object.entries(DIAMETER_LABELS).map(
  ([id, label]) => ({ id, label }),
);