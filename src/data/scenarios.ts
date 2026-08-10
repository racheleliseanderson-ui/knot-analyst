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
  {
    id: "ice-jig-micro",
    title: "Ice hole · 2 lb mono to a micro jig",
    blurb:
      "Tiny wire, wet hands, no bench. The connection must seat at low tension without curling the tag into the eye.",
    tag: "Ice · cold · tiny eye",
    connectionLine: "Mono → jig",
    likelyPick: "A snug terminal knot the eye can accept",
    autoRun: true,
    input: {
      connection: "line-to-lure",
      mainMaterial: "mono",
      hardwareEyeSmall: true,
      freeSwing: false,
      coldHands: true,
      windy: true,
      lowLight: false,
      retieFrequency: "frequent",
      proficiency: "beginner",
    },
  },
  {
    id: "kayak-drift-retie",
    title: "Kayak drift · retie on the water",
    blurb:
      "No stable platform, one hand on the paddle. Anything needing a long wrap count or a tensioned tag is out.",
    tag: "Kayak · unstable · frequent",
    connectionLine: "Braid → leader",
    likelyPick: "A short, forgiving joining knot",
    autoRun: true,
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "main-thinner",
      mustPassGuides: true,
      windy: true,
      coldHands: false,
      lowLight: false,
      retieFrequency: "frequent",
      proficiency: "intermediate",
    },
  },
  {
    id: "offshore-heavy-mono",
    title: "Offshore · heavy mono to heavy leader",
    blurb:
      "Stiff diameters, high sustained load, few reties. Bulk is acceptable; slip under a long pull is not.",
    tag: "Offshore · heavy · rare retie",
    connectionLine: "Leader → leader",
    likelyPick: "A high-retention heavy-line join",
    autoRun: true,
    input: {
      connection: "leader-to-leader",
      mainMaterial: "mono",
      secondaryMaterial: "mono",
      diameterRelation: "similar",
      mustPassGuides: false,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "topwater-loop",
    title: "Topwater walker · needs free swing",
    blurb:
      "A hard-tied knot chokes the head. The connection has to hold an open loop through repeated direction changes.",
    tag: "Loop · action-critical",
    connectionLine: "Line → lure",
    likelyPick: "A loop that survives repeated snaps",
    autoRun: true,
    input: {
      connection: "line-to-lure",
      mainMaterial: "mono",
      hardwareEyeSmall: false,
      freeSwing: true,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "toothy-wire-trace",
    title: "Toothy fish · wire bite trace",
    blurb:
      "Single-strand wire will not behave like line. Expect the instrument to push you toward a termination method, not a knot.",
    tag: "Wire · bite protection",
    connectionLine: "Wire → hook",
    likelyPick: "Termination advice before any knot",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "wire",
      hardwareEyeSmall: false,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "dropshot-tag",
    title: "Drop-shot · hook standing off the tag",
    blurb:
      "The hook must sit perpendicular with a long tag below it. Knot orientation matters more than raw strength.",
    tag: "Finesse · orientation",
    connectionLine: "Mono → hook",
    likelyPick: "A knot that holds hook attitude",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "fluoro",
      hardwareEyeSmall: true,
      freeSwing: false,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "tippet-ring-swap",
    title: "Tippet ring · quick swap on the bank",
    blurb:
      "Small hardware, fine tippet, gloves off in cold air. The knot has to seat cleanly on a tiny ring without cutting itself.",
    tag: "Fly · small hardware",
    connectionLine: "Tippet → ring",
    likelyPick: "A compact small-eye terminal knot",
    autoRun: true,
    input: {
      connection: "line-to-swivel",
      mainMaterial: "mono",
      hardwareEyeSmall: true,
      coldHands: true,
      retieFrequency: "frequent",
      proficiency: "beginner",
    },
  },
  {
    id: "shock-tippet-join",
    title: "Class tippet → shock tippet",
    blurb:
      "A large diameter step in fly gear. Mismatch handling is the whole problem; everything else is secondary.",
    tag: "Fly · big step",
    connectionLine: "Tippet → shock",
    likelyPick: "A mismatch-tolerant join",
    autoRun: true,
    input: {
      connection: "leader-to-tippet",
      mainMaterial: "mono",
      secondaryMaterial: "mono",
      diameterRelation: "main-much-thinner",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "double-line-topshot",
    title: "Doubled line → topshot",
    blurb:
      "A formed double joining a heavier topshot. The join must run through guides under a screaming drag.",
    tag: "Doubled line · guides",
    connectionLine: "Double → leader",
    likelyPick: "A slim doubled-line join",
    autoRun: true,
    input: {
      connection: "double-line-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "mono",
      diameterRelation: "main-thinner",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "loop-to-loop-swap",
    title: "Pre-rigged leaders · loop to loop",
    blurb:
      "Leaders made at home, swapped in seconds on the water. The interlock geometry is the failure point, not the knot.",
    tag: "Rig swap · fast",
    connectionLine: "Loop → loop",
    likelyPick: "A clean formed loop pair",
    autoRun: true,
    input: {
      connection: "loop-to-loop",
      mainMaterial: "mono",
      secondaryMaterial: "mono",
      diameterRelation: "similar",
      retieFrequency: "frequent",
      proficiency: "beginner",
    },
  },
  {
    id: "night-snell-circle",
    title: "Night bait · circle hook snell",
    blurb:
      "Circle hooks want a straight pull along the shank. Tied in the dark, so wrap count and feel matter.",
    tag: "Night · snell",
    connectionLine: "Mono → circle hook",
    likelyPick: "A snell with a clean pull axis",
    autoRun: true,
    input: {
      connection: "hook-snell",
      mainMaterial: "mono",
      lowLight: true,
      coldHands: false,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "hollow-core-topshot",
    title: "Hollow-core braid · topshot connection",
    blurb:
      "Hollow braid changes the rules. Expect the instrument to say splice before it offers anything tied.",
    tag: "Hollow · splice territory",
    connectionLine: "Hollow braid → leader",
    likelyPick: "Splice preferred over any knot",
    autoRun: true,
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "mono",
      mainSpec: {
        category: "braid",
        fiber: "uhmwpe",
        construction: "hollow-core",
        treatment: "uncoated",
        role: "main-line",
      },
      diameterRelation: "main-thinner",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "advanced",
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
