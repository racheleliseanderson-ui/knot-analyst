import type { FieldScenario } from "@/data/scenarios";

/**
 * Additional one-tap fishing situations that cover everyday gaps not already
 * represented in the core scenario set. These are field starting points, not
 * claims that one knot is universally best.
 */
export const ADDITIONAL_FIELD_SCENARIOS: FieldScenario[] = [
  {
    id: "kid-first-knot",
    title: "First knot · kid or new angler",
    blurb:
      "Mono to a normal hook eye, frequent reties, beginner hands. Favor a knot that is easy to remember, easy to inspect, and hard to mis-seat.",
    tag: "Beginner · easy to inspect",
    connectionLine: "Mono → hook",
    likelyPick: "A simple terminal knot with an obvious finished shape",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "mono",
      hardwareEyeSmall: false,
      retieFrequency: "frequent",
      proficiency: "beginner",
    },
  },
  {
    id: "heavy-cover-braid-direct",
    title: "Heavy cover · braid straight to hook",
    blurb:
      "Direct braid terminal, hard hooksets, no leader join. Slip resistance and a clean lock matter more than guide passage.",
    tag: "Braid · hard pull",
    connectionLine: "Braid → hook",
    likelyPick: "A braid-capable terminal with a secure lock",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "braid",
      hardwareEyeSmall: false,
      retieFrequency: "occasional",
      proficiency: "intermediate",
    },
  },
  {
    id: "tiny-fly-windy-bank",
    title: "Tiny fly · fine tippet in the wind",
    blurb:
      "Small eye, fine mono tippet, moving air, and a fast change on the bank. Dexterity and clean seating outrank a complicated strength-first tie.",
    tag: "Fly · tiny eye · wind",
    connectionLine: "Tippet → fly",
    likelyPick: "A compact small-eye terminal knot you can verify quickly",
    autoRun: true,
    input: {
      connection: "line-to-hook",
      mainMaterial: "mono",
      hardwareEyeSmall: true,
      windy: true,
      retieFrequency: "frequent",
      proficiency: "intermediate",
    },
  },
  {
    id: "long-leader-through-guides",
    title: "Long leader · through the guides all day",
    blurb:
      "Braid to fluorocarbon with a long leader repeatedly crossing the guides. A slim, durable profile matters every cast, not just on the first pull test.",
    tag: "Guides · repeated casting",
    connectionLine: "Braid → fluoro leader",
    likelyPick: "A slim guide-friendly join when tying skill allows",
    autoRun: true,
    input: {
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "main-much-thinner",
      mustPassGuides: true,
      retieFrequency: "rare",
      proficiency: "advanced",
    },
  },
  {
    id: "quick-swivel-change",
    title: "Quick swivel change · bite window",
    blurb:
      "A swivel needs to go back on fast while fish are active. The eye is normal size and the connection must be easy to seat and inspect in seconds.",
    tag: "Fast retie · swivel",
    connectionLine: "Line → swivel",
    likelyPick: "A fast terminal knot with a clear finished seat",
    autoRun: true,
    input: {
      connection: "line-to-swivel",
      mainMaterial: "mono",
      hardwareEyeSmall: false,
      retieFrequency: "frequent",
      proficiency: "beginner",
    },
  },
  {
    id: "cold-rain-fluoro-terminal",
    title: "Cold rain · fluorocarbon terminal",
    blurb:
      "Wet hands, stiff fluorocarbon, and a small lure eye. Favor a connection you can dress without rushing or overheating the line during the final seat.",
    tag: "Cold · wet · fluoro",
    connectionLine: "Fluoro → lure",
    likelyPick: "A manageable single-pass terminal for the eye and line",
    autoRun: true,
    input: {
      connection: "line-to-lure",
      mainMaterial: "fluoro",
      hardwareEyeSmall: true,
      coldHands: true,
      retieFrequency: "frequent",
      proficiency: "intermediate",
    },
  },
];
