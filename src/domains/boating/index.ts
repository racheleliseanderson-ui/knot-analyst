/**
 * Boating & Sailing — vocabulary, venues and dimensions are live. The
 * mechanical catalog for rope work is not modelled yet, so `knots` is empty
 * on purpose: the instrument fails closed rather than scoring guesses.
 */
import type { KnotDomain } from "@/domain/domain";
import { BOATING_DIMENSIONS } from "./dimensions";
import { BOATING_TERMS } from "./terms";
import { BOATING_VENUES } from "./venues";
import { BOATING_CONNECTIONS, BOATING_DIAMETERS, BOATING_MATERIALS } from "./vocabulary";

export const BOATING_DOMAIN: KnotDomain = {
  id: "boating",
  label: "Boating & Sailing",
  terms: BOATING_TERMS,
  connections: BOATING_CONNECTIONS,
  materials: BOATING_MATERIALS,
  diameters: BOATING_DIAMETERS,
  dimensions: BOATING_DIMENSIONS,
  venues: BOATING_VENUES,
  scenarios: [],
  failurePlays: [],
  knots: [],
};
