/**
 * Unified mechanics lookup — core profiles + extras (e.g. Yucatan).
 */
import { MECHANICS, type MechanicsBundle } from "@/data/mechanics-profiles";
import { MECHANICS_EXTRAS } from "@/data/mechanics-extras";

const ALL: Record<string, MechanicsBundle> = { ...MECHANICS, ...MECHANICS_EXTRAS };

export type { MechanicsBundle };

export function getMechanics(knotId: string): MechanicsBundle | undefined {
  return ALL[knotId];
}

export function allMechanicsIds(): string[] {
  return Object.keys(ALL);
}
