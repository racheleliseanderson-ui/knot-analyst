/**
 * Unified mechanics lookup — core profiles + extras.
 */
import { MECHANICS, type MechanicsBundle } from "@/data/mechanics-profiles";
import { MECHANICS_EXTRAS } from "@/data/mechanics-extras";
import { MECHANICS_EXTRAS_TERMINAL } from "@/data/mechanics-extras-terminal";
import { MECHANICS_EXTRAS_BATCH4 } from "@/data/mechanics-extras-batch4";
import { MECHANICS_EXTRAS_BATCH5 } from "@/data/mechanics-extras-batch5";
import { MECHANICS_EXTRAS_BATCH6 } from "@/data/mechanics-extras-batch6";
import { MECHANICS_EXTRAS_BOATING } from "@/data/mechanics-extras-boating";
import { MECHANICS_EXTRAS_BOATING_2 } from "@/data/mechanics-extras-boating-2";

const ALL: Record<string, MechanicsBundle> = {
  ...MECHANICS,
  ...MECHANICS_EXTRAS,
  ...MECHANICS_EXTRAS_TERMINAL,
  ...MECHANICS_EXTRAS_BATCH4,
  ...MECHANICS_EXTRAS_BATCH5,
  ...MECHANICS_EXTRAS_BATCH6,
  ...MECHANICS_EXTRAS_BOATING,
  ...MECHANICS_EXTRAS_BOATING_2,
};

export type { MechanicsBundle };

export function getMechanics(knotId: string): MechanicsBundle | undefined {
  return ALL[knotId];
}

export function allMechanicsIds(): string[] {
  return Object.keys(ALL);
}
