/** The Fishing domain — assembled from today's data, behavior unchanged. */
import { playsForDomain } from "@/data/failure-playbook";
import { FIELD_SCENARIOS } from "@/data/scenarios";
import { ADDITIONAL_FIELD_SCENARIOS } from "@/data/scenarios-extra";
import { TERMINAL_KNOTS } from "@/data/knots/terminal";
import { LINE_TO_LINE_KNOTS } from "@/data/knots/line-to-line";
import { LOOP_KNOTS } from "@/data/knots/loops";
import { UTILITY_KNOTS } from "@/data/knots/utility";
import { SEED_BATCH_2 } from "@/data/knots/seed-batch-2";
import { SEED_BATCH_3_TERMINAL } from "@/data/knots/seed-batch-3-terminal";
import { SEED_BATCH_4 } from "@/data/knots/seed-batch-4";
import { SEED_BATCH_5_TERMINAL } from "@/data/knots/seed-batch-5-terminal";
import { SEED_BATCH_6 } from "@/data/knots/seed-batch-6";
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
  scenarios: [...FIELD_SCENARIOS, ...ADDITIONAL_FIELD_SCENARIOS],
  failurePlays: playsForDomain("fishing"),
  knots: [
    ...TERMINAL_KNOTS,
    ...LINE_TO_LINE_KNOTS,
    ...LOOP_KNOTS,
    ...UTILITY_KNOTS,
    ...SEED_BATCH_2,
    ...SEED_BATCH_3_TERMINAL,
    ...SEED_BATCH_4,
    ...SEED_BATCH_5_TERMINAL,
    ...SEED_BATCH_6,
  ],
};
