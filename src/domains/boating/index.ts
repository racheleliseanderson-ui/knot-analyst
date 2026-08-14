/**
 * Boating & Sailing — vocabulary, venues, dimensions and the first modelled
 * rope-work catalog. Fishing Decide stays on the fishing pool.
 */
import type { KnotDomain } from "@/domain/domain";
import { BOATING_BATCH_1 } from "@/data/knots/boating-batch-1";
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
  knots: [...BOATING_BATCH_1],
};
