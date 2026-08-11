/**
 * Boating & Sailing — vocabulary, venues, dimensions and material axes are live.
 * The mechanical catalog for rope work is not modelled yet, so `knots` is empty
 * on purpose: the instrument fails closed rather than scoring guesses.
 *
 * Phase 7 gate: do not author knot/termination content until Fishing Schema 2.0
 * regression stays green (see scripts/schema-regression.ts).
 */
import type { KnotDomain } from "@/domain/domain";
import { BOATING_DIMENSIONS } from "./dimensions";
import { BOATING_MATERIAL_PRESETS } from "./materials";
import { BOATING_TERMS } from "./terms";
import { BOATING_VENUES } from "./venues";
import { BOATING_CONNECTIONS, BOATING_DIAMETERS, BOATING_MATERIALS } from "./vocabulary";

export const BOATING_DOMAIN: KnotDomain = {
  id: "boating",
  label: "Boating & Sailing",
  terms: BOATING_TERMS,
  connections: BOATING_CONNECTIONS,
  materials: BOATING_MATERIALS,
  materialAxes: BOATING_MATERIAL_PRESETS,
  diameters: BOATING_DIAMETERS,
  dimensions: BOATING_DIMENSIONS,
  venues: BOATING_VENUES,
  scenarios: [],
  failurePlays: [],
  knots: [],
};
