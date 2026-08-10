/**
 * Venue — where the connection actually works. A venue is data: a condition
 * patch the picker pre-loads (still editable) plus a three-part micro callout
 * explaining what that place punishes.
 */
import type { ChooseInput } from "@/domain/types";

export interface DomainVenue {
  id: string;
  label: string;
  /** One line of field truth — the reason this venue changes the answer */
  summary: string;
  /** Conditions the venue implies. Pre-loaded, never locked. */
  conditions: Partial<ChooseInput>;
  /** Micro callout: what it punishes / what to watch / the standing fix */
  punishes: string;
  watch: string;
  fix: string;
}
