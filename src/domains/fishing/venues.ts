import type { DomainVenue } from "@/domain/venue";

/**
 * Phase C — fishing venues split into waterbody (where) and platform (how).
 * Each entry is still only a soft condition patch + field callout.
 * Neither layer locks chips; the angler can override every condition.
 */

/** Water / structure layer. */
export const FISHING_WATERBODIES: DomainVenue[] = [
  {
    id: "surf",
    label: "Surf",
    layer: "waterbody",
    summary: "Sand, sustained casting load and a knot that lives in the guides.",
    conditions: { mustPassGuides: true, windy: true, retieFrequency: "frequent" },
    punishes:
      "Bulk. A profile that survives a boat deck grinds through guides all day in the surf and shock-loads on every cast.",
    watch:
      "The join, after twenty casts — fuzzing on the leader side means abrasion, not knot failure.",
    fix: "Shorter leader, slimmer join, and retie on a schedule instead of on evidence.",
  },
  {
    id: "shoreline",
    label: "Shoreline",
    layer: "waterbody",
    summary: "Rocks, pilings, barnacles, vertical lifts — structure that eats line above the knot.",
    conditions: { retieFrequency: "frequent" },
    punishes:
      "Anything you cannot inspect fast. Structure removes line above the knot and blames the knot.",
    watch: "Line above the connection for chalky flat spots before you accuse the knot.",
    fix: "Heavier shock leader and a join you can build again with cold hands on a rail.",
  },
  {
    id: "lake",
    label: "Lake",
    layer: "waterbody",
    summary: "Still water, mixed clarity, moderate reties, finesse and power both show up.",
    conditions: { retieFrequency: "occasional" },
    punishes: "Overbuilt joins on light setups and underbuilt joins when structure is nearby.",
    watch: "Whether the failure was at the knot or where the line saw timber and rock.",
    fix: "Match diameter and retie tempo to the technique, not the lake name.",
  },
  {
    id: "reservoir",
    label: "Reservoir",
    layer: "waterbody",
    summary: "Often clear and pressured, timber and rock edges, longer casts common.",
    conditions: { mustPassGuides: true, retieFrequency: "occasional", freeSwing: true },
    punishes: "Visible bulk and stiff terminals when fish get a long look in clear water.",
    watch: "Loop action dying after a fish — rebuild free-swing connections before the next cast.",
    fix: "Slim joins, fluoro-leaning leaders when clarity is high, inspect after timber contact.",
  },
  {
    id: "river",
    label: "River",
    layer: "waterbody",
    summary: "Current load, rock abrasion, frequent tippet and fly changes.",
    conditions: { retieFrequency: "frequent", coldHands: true, lowLight: true },
    punishes: "Slow knots. Cold water hands plus a fifteen-step procedure ends in a rushed seat.",
    watch: "Tippet ends curling — a pigtail means it slipped, not broke.",
    fix: "One knot family you can tie blind, rebuilt often, trimmed close.",
  },
  {
    id: "waterway",
    label: "Waterway",
    layer: "waterbody",
    summary: "Channels, mangroves, docks, brackish mix — abrasion and light leaders both matter.",
    conditions: { mustPassGuides: true, freeSwing: true, retieFrequency: "occasional" },
    punishes:
      "Visible bulk and dead lure action. In clear skinny water a stiff terminal is refused before it is tested.",
    watch: "Loop closing down onto the eye after a fight — the action dies before you notice.",
    fix: "Re-open or rebuild the loop after every serious fish; step leader up around oysters and pilings.",
  },
  {
    id: "offshore",
    label: "Offshore",
    layer: "waterbody",
    summary: "Sustained heavy drag, shock loads, consequences you do not get to retry.",
    conditions: { retieFrequency: "rare", proficiency: "advanced", mustPassGuides: true },
    punishes:
      "Anything unverifiable. Offshore, the failure mode is not a lost lure — it is the one fish of the trip.",
    watch: "Seating pattern under load, not appearance at rest.",
    fix: "Build for inspection: if you cannot read the finished structure, do not fish it.",
  },
];

/** How the angler is positioned — hands, stability, retie tempo. */
export const FISHING_PLATFORMS: DomainVenue[] = [
  {
    id: "wading",
    label: "Wading",
    layer: "platform",
    summary: "Current, cold hands, no bench, everything rebuilt standing in the water.",
    conditions: { coldHands: true, retieFrequency: "frequent", lowLight: true },
    punishes: "Long procedures and tools you cannot hold while balancing.",
    watch: "Rushed seats when the water is rising or the light is going.",
    fix: "Knots you can finish with numb fingers and one free hand.",
  },
  {
    id: "bank",
    label: "Bank / shore",
    layer: "platform",
    summary: "Stable ground, easy inspection, but structure and casting angles still punish bulk.",
    conditions: { retieFrequency: "occasional" },
    punishes: "Complacency — bank fishing still abrades leaders on rock and timber.",
    watch: "Line above the knot after every hang-up on structure.",
    fix: "Inspect and retie on a schedule; use the stability for clean seating.",
  },
  {
    id: "kayak",
    label: "Kayak / small craft",
    layer: "platform",
    summary: "One-handed work, wet hands, no bench, everything at chest height.",
    conditions: { coldHands: true, windy: true, retieFrequency: "occasional" },
    punishes:
      "Knots that need two clean hands and steady tension. A dropped tag in a kayak is a lost rebuild.",
    watch: "Wraps that never fully seated because you could not pull straight.",
    fix: "Choose the knot you can finish in a rocking hull, not the one that tests best on a desk.",
  },
  {
    id: "skiff",
    label: "Skiff / bay boat",
    layer: "platform",
    summary: "More space than a kayak, still wet decks and wind; reties between drifts.",
    conditions: { windy: true, retieFrequency: "occasional" },
    punishes: "Joins that only work when the boat is dead still.",
    watch: "Tags left long after a hurried rebuild on a rolling deck.",
    fix: "Practiced family with a seating check before the next cast.",
  },
  {
    id: "large-boat",
    label: "Large boat / deck",
    layer: "platform",
    summary: "Stable platform, time for inspection, higher consequence on offshore days.",
    conditions: { retieFrequency: "rare", proficiency: "advanced" },
    punishes: "Anything unverifiable dressed up as a quick dock job.",
    watch: "Seating under load after the first fish, not appearance at rest.",
    fix: "Build for inspection and keep a second identical join ready.",
  },
];

/**
 * Flat list for domain.venues (waterbodies first) — preserves single-list
 * consumers and boating-style pickers. Platforms live on domain.platforms.
 */
export const FISHING_VENUES: DomainVenue[] = FISHING_WATERBODIES;
