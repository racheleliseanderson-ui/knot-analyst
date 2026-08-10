/**
 * Prefield demo scenarios — one-tap into Choose with realistic conditions.
 * Used on marketing home and /choose?scenario=
 */
import type { ChooseInput } from "@/domain/types";

export interface FieldScenario {
  id: string;
  title: string;
  blurb: string;
  /** Short chip for cards */
  tag: string;
  /** Connection line for scannability */
  connectionLine: string;
  /** Optional “likely pick” for demos — not an engine guarantee */
  likelyPick: string;
  input: ChooseInput;
  /** Jump straight to ranked results */
  autoRun: boolean;
}

export const FIELD_SCENARIOS: FieldScenario[] = [
  {
    id: "braid-fluoro-ideal",
    title: "Braid → fluoro at the ramp",
    blurb:
      "Thin braid to thicker fluoro, must slide through guides, rare reties, practiced hands. Best finished system geometry wins.",
    tag: "Guides · practiced",
    connectionLine: "Braid → leader",
    likelyPick: "FG leads when skill and time allow",
    autoRun: true,
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "main-much-thinner",
      mustPassGuides: true,
      windy: false,
      coldHands: false,
      lowLight: false,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "braid-cold-wind",
    title: "Cold wind · need a fast retie",
    blurb:
      "Same braid-to-leader job, but wind, cold hands, and frequent reties. Speed and field-tieability outweigh perfect profile.",
    tag: "Wind · cold · frequent",
    connectionLine: "Braid → leader",
    likelyPick: "Double Uni when speed wins",
    autoRun: true,
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "main-much-thinner",
      mustPassGuides: true,
      windy: true,
      coldHands: true,
      lowLight: false,
      retieFrequency: "frequent",
      proficiency: "beginner",
    },
  },
  {
    id: "jig-palomar",
    title: "Line to jig · open eye",
    blurb:
      "Terminal connection to a lure. Doubled-line terminal knots stay valid when the eye is large enough.",
    tag: "Terminal · hardware",
    connectionLine: "Line → lure",
    likelyPick: "Palomar family when the eye allows",
    autoRun: true,
    input: {
      connection: "line-to-lure",
      mainMaterial: "braid",
      hardwareEyeSmall: false,
      freeSwing: false,
      windy: false,
      coldHands: false,
      retieFrequency: "frequent",
      proficiency: "any",
    },
  },
  {
    id: "loop-swing",
    title: "Free-swinging bait",
    blurb:
      "You need open action at the lure — non-slip or open loop geometry beats cinched terminal wraps.",
    tag: "Loop action",
    connectionLine: "Line → lure",
    likelyPick: "Non-slip loop when free-swing is required",
    autoRun: true,
    input: {
      connection: "line-to-lure",
      mainMaterial: "mono",
      freeSwing: true,
      hardwareEyeSmall: false,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "leader-tippet",
    title: "Leader → tippet (fly)",
    blurb: "Join similar-diameter leader to tippet. Diameter match and clean barrels drive the ranking.",
    tag: "Fly system",
    connectionLine: "Leader → tippet",
    likelyPick: "Blood or Double Surgeon depending on mismatch",
    autoRun: true,
    input: {
      connection: "leader-to-tippet",
      mainMaterial: "mono",
      secondaryMaterial: "mono",
      diameterRelation: "similar",
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "beginner-hook",
    title: "First terminal knot",
    blurb:
      "Hook to mono, beginner proficiency, frequent reties. The engine should favor simple, inspectable knots.",
    tag: "Beginner · terminal",
    connectionLine: "Line → hook",
    likelyPick: "Improved Clinch or Uni when simplicity rules",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "mono",
      proficiency: "beginner",
      retieFrequency: "frequent",
      hardwareEyeSmall: false,
      freeSwing: false,
    },
  },
];

export function getScenario(id: string | undefined | null): FieldScenario | undefined {
  if (!id) return undefined;
  return FIELD_SCENARIOS.find((s) => s.id === id);
}

export function scenarioSearch(id: string, autoRun = true): { scenario: string; run?: string } {
  return autoRun ? { scenario: id, run: "1" } : { scenario: id };
}
