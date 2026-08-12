/** The Fishing domain — assembled from today's data, behavior unchanged. */
import { FAILURE_PLAYS } from "@/data/failure-playbook";
import { FIELD_SCENARIOS } from "@/data/scenarios";
import { TERMINAL_KNOTS } from "@/data/knots/terminal";
import { LINE_TO_LINE_KNOTS } from "@/data/knots/line-to-line";
import { LOOP_KNOTS } from "@/data/knots/loops";
import { UTILITY_KNOTS } from "@/data/knots/utility";
import type { KnotDomain } from "@/domain/domain";
import { FISHING_DIMENSIONS } from "./dimensions";
import { FISHING_MATERIAL_PRESETS } from "./materials";
import { FISHING_REGIONS } from "./regions";
import { FISHING_TERMS } from "./terms";
import { FISHING_PLATFORMS, FISHING_VENUES } from "./venues";
import { FISHING_CONNECTIONS, FISHING_DIAMETERS, FISHING_MATERIALS } from "./vocabulary";

export const FISHING_DOMAIN: KnotDomain = {
  id: "fishing",
  label: "Fishing",
  terms: FISHING_TERMS,
  connections: FISHING_CONNECTIONS,
  materials: FISHING_MATERIALS,
  materialAxes: FISHING_MATERIAL_PRESETS,
  diameters: FISHING_DIAMETERS,
  dimensions: FISHING_DIMENSIONS,
  venues: FISHING_VENUES,
  platforms: FISHING_PLATFORMS,
  regions: FISHING_REGIONS,
  scenarios: FIELD_SCENARIOS,
  failurePlays: FAILURE_PLAYS,
  knots: [...TERMINAL_KNOTS, ...LINE_TO_LINE_KNOTS, ...LOOP_KNOTS, ...UTILITY_KNOTS],
};
