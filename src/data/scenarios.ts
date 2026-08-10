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
  {
    id: "night-dock-light",
    title: "Night dock light · low visibility",
    blurb:
      "Terminal knot rebuilt in the dark off a dock light. Inspectability collapses, so simple verifiable geometry outranks profile.",
    tag: "Low light · terminal",
    connectionLine: "Line → lure",
    likelyPick: "Simple inspectable terminal geometry",
    autoRun: true,
    input: {
      connection: "line-to-lure",
      mainMaterial: "braid",
      lowLight: true,
      coldHands: true,
      retieFrequency: "frequent",
      proficiency: "intermediate",
      hardwareEyeSmall: false,
    },
  },
  {
    id: "small-eye-fluoro",
    title: "Small eye · heavy fluoro",
    blurb:
      "Stiff fluoro through an undersized hook eye. Doubled-line terminal knots are eliminated before scoring begins.",
    tag: "Hardware limit",
    connectionLine: "Line → hook",
    likelyPick: "Single-pass terminal geometry",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "fluoro",
      hardwareEyeSmall: true,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "surf-heavy-leader",
    title: "Surf · thin braid to shock leader",
    blurb:
      "Extreme diameter mismatch that must survive repeated casting through guides. Most joins fail the mismatch test outright.",
    tag: "Mismatch · casting",
    connectionLine: "Braid → leader",
    likelyPick: "Slim casting join when skill allows",
    autoRun: true,
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "mono",
      diameterRelation: "extreme-mismatch",
      mustPassGuides: true,
      windy: true,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "fly-line-leader",
    title: "Fly line → leader",
    blurb:
      "Coated fly line to a mono butt section. Material class does most of the eliminating here, not preference.",
    tag: "Fly system",
    connectionLine: "Fly line → leader",
    likelyPick: "Loop or nail-style transition",
    autoRun: true,
    input: {
      connection: "fly-line-to-leader",
      mainMaterial: "fly-line",
      secondaryMaterial: "mono",
      diameterRelation: "main-thicker",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "intermediate",
    },
  },
  {
    id: "snell-bait",
    title: "Snelled bait hook",
    blurb:
      "Shank-aligned pull for hook-setting geometry. A snell is a different job, not a stronger version of a terminal knot.",
    tag: "Snell · alignment",
    connectionLine: "Hook snell",
    likelyPick: "Snell family only",
    autoRun: true,
    input: {
      connection: "hook-snell",
      mainMaterial: "mono",
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "spool-arbor",
    title: "New line onto the spool",
    blurb:
      "Backing to arbor. Slip behaviour under a bedded load is the only dimension that really matters.",
    tag: "Utility · rig-up",
    connectionLine: "Line → spool",
    likelyPick: "Arbor geometry",
    autoRun: true,
    input: {
      connection: "line-to-spool",
      mainMaterial: "braid",
      retieFrequency: "rare",
      proficiency: "beginner",
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
