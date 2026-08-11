/**
 * Venue — where the connection actually works. A venue is data: a condition
 * patch the picker pre-loads (still editable) plus a three-part micro callout
 * explaining what that place punishes.
 *
 * Phase C splits fishing venues into two independent layers:
 *   waterbody — the water / structure (surf, lake, river, offshore…)
 *   platform  — how the angler is positioned (wading, kayak, large boat…)
 * Boating keeps a single flat list (layer omitted / waterbody default).
 */
import type { ChooseInput } from "@/domain/types";

export type VenueLayer = "waterbody" | "platform";

export interface DomainVenue {
  id: string;
  label: string;
  /**
   * Layer for two-row pickers. Omit or `"waterbody"` for single-list domains
   * (boating) and for waterbody entries.
   */
  layer?: VenueLayer;
  /** One line of field truth — the reason this venue changes the answer */
  summary: string;
  /** Conditions the venue implies. Pre-loaded, never locked. */
  conditions: Partial<ChooseInput>;
  /** Micro callout: what it punishes / what to watch / the standing fix */
  punishes: string;
  watch: string;
  fix: string;
}

/** Merge waterbody + platform condition patches (platform wins on key collision). */
export function mergeVenueConditions(
  ...parts: Array<DomainVenue | undefined | null>
): Partial<ChooseInput> {
  const out: Partial<ChooseInput> = {};
  for (const p of parts) {
    if (p?.conditions) Object.assign(out, p.conditions);
  }
  return out;
}

/**
 * Legacy single-venue ids → waterbody + platform after the Phase C split.
 * Used when loading presets that still store the old ids.
 */
export const LEGACY_FISHING_VENUE: Record<
  string,
  { waterbodyId?: string; platformId?: string }
> = {
  surf: { waterbodyId: "surf" },
  pier: { waterbodyId: "shoreline" },
  kayak: { platformId: "kayak" },
  flats: { waterbodyId: "waterway" },
  offshore: { waterbodyId: "offshore" },
  river: { waterbodyId: "river", platformId: "wading" },
  // identity maps for new ids (safe re-load)
  shoreline: { waterbodyId: "shoreline" },
  lake: { waterbodyId: "lake" },
  reservoir: { waterbodyId: "reservoir" },
  waterway: { waterbodyId: "waterway" },
  wading: { platformId: "wading" },
  bank: { platformId: "bank" },
  skiff: { platformId: "skiff" },
  "large-boat": { platformId: "large-boat" },
};

export function resolveLegacyVenue(id: string | undefined): {
  waterbodyId?: string;
  platformId?: string;
} {
  if (!id) return {};
  return LEGACY_FISHING_VENUE[id] ?? { waterbodyId: id };
}
