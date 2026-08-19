import type { DomainRegion } from "@/domain/region";

/**
 * US fishing regions — soft priors only.
 * Conditions mirror what an experienced local would already set as chips;
 * advisories explain *why*, without naming a mandatory knot.
 */
export const FISHING_REGIONS: DomainRegion[] = [
  // ── Broad ──────────────────────────────────────────────
  {
    id: "northeast",
    label: "Northeast",
    tier: "broad",
    summary: "Cold water, striper/bluefish coast, Great Lakes fringe, frequent wind and wet hands.",
    conditions: { coldHands: true, windy: true, retieFrequency: "occasional" },
    advisories: [
      "Northeast salt mixes often put abrasion and cold hands ahead of pure laboratory strength.",
      "When bluefish or schoolies show up, inspect the leader side for bite damage before blaming the join.",
      "Surf and jetty days reward slim guide-friendly joins and scheduled reties more than bulk.",
    ],
    signals: {
      saltLean: "mixed",
      wireWatch: true,
      abrasion: "rock",
      shockLeaderCommon: true,
      coldSeason: true,
    },
  },
  {
    id: "southeast",
    label: "Southeast",
    tier: "broad",
    summary: "Atlantic and Gulf coasts, oyster and barnacle structure, toothy inshore species.",
    conditions: { retieFrequency: "occasional", mustPassGuides: true },
    advisories: [
      "Southeast structure (oysters, pilings, mangroves) usually fails line above the knot — inspect before you rebuild.",
      "Mackerel, bluefish, and barracuda push wire-watch language; heavy fluoro is a choice, not a guarantee.",
      "Clear skinny water still wants low bulk at the terminal even when abrasion is high nearby.",
    ],
    signals: {
      saltLean: "salt",
      wireWatch: true,
      abrasion: "oyster",
      shockLeaderCommon: true,
    },
  },
  {
    id: "midwest",
    label: "Midwest",
    tier: "broad",
    summary:
      "Great Lakes and interior fresh water — pike/muskie wire country, walleye and bass systems.",
    conditions: { coldHands: true, retieFrequency: "occasional" },
    advisories: [
      "Great Lakes and northern interior waters make wire-watch real for pike and muskie — mono tippets get cut, not slipped.",
      "Cold-season hands and low light matter as much as catalog strength ratings.",
      "Freshwater abrasion is more timber and rock than oyster; step diameter for structure, not for salt myth.",
    ],
    signals: {
      saltLean: "fresh",
      wireWatch: true,
      abrasion: "timber",
      coldSeason: true,
    },
  },
  {
    id: "west",
    label: "West",
    tier: "broad",
    summary: "Pacific coast kelp and rock, mountain trout water, mixed salt and alpine fresh.",
    conditions: { mustPassGuides: true, retieFrequency: "occasional" },
    advisories: [
      "Pacific kelp and boiler rock punish leader chafe; bulk that survives a dock may not survive structure.",
      "Mountain fresh systems lean clear and pressured — presentation and free-swing often beat heavy joins.",
      "Surf and open-coast shock leaders are diameter-mismatch jobs; declare both sides honestly.",
    ],
    signals: {
      saltLean: "mixed",
      abrasion: "kelp",
      shockLeaderCommon: true,
      clearPressured: true,
    },
  },
  {
    id: "southwest",
    label: "Southwest",
    tier: "broad",
    summary: "Desert reservoirs, pressured bass water, Southern California inshore mix.",
    conditions: { freeSwing: true, retieFrequency: "occasional" },
    advisories: [
      "Clear desert reservoirs and pressured bass lakes reward low-visibility leaders and clean free-swing terminals.",
      "Timber and rock edges still abrade — step diameter for structure without defaulting to offshore bulk.",
      "Southern California rock and kelp pockets behave more like West coast abrasion than inland reservoir finesse.",
    ],
    signals: {
      saltLean: "mixed",
      abrasion: "timber",
      clearPressured: true,
    },
  },

  // ── Fine (optional second tap) ─────────────────────────
  {
    id: "new-england",
    label: "New England",
    tier: "fine",
    parentId: "northeast",
    summary: "Cold Atlantic, striper and bluefish surf, frequent wind and wet hands.",
    conditions: {
      coldHands: true,
      windy: true,
      mustPassGuides: true,
      retieFrequency: "frequent",
    },
    advisories: [
      "New England surf and jetty work is a guide-passage + frequent-retie problem as much as a strength problem.",
      "Bluefish seasons make leader inspection mandatory; cutoffs look like knot failure until you check the bite zone.",
    ],
    signals: {
      saltLean: "salt",
      wireWatch: true,
      abrasion: "rock",
      shockLeaderCommon: true,
      coldSeason: true,
    },
  },
  {
    id: "mid-atlantic",
    label: "Mid-Atlantic",
    tier: "fine",
    parentId: "northeast",
    summary: "Striper, fluke, mixed bay and ocean — wind and structure both show up.",
    conditions: { windy: true, retieFrequency: "occasional", mustPassGuides: true },
    advisories: [
      "Mid-Atlantic bays and inlets mix sand, rock, and man-made structure — watch line above the knot after hang-ups.",
      "Seasonal striper runs reward practiced joins you can rebuild in wind, not only bench-perfect FG seats.",
    ],
    signals: {
      saltLean: "salt",
      wireWatch: true,
      abrasion: "mixed",
      shockLeaderCommon: true,
    },
  },
  {
    id: "south-atlantic",
    label: "South Atlantic",
    tier: "fine",
    parentId: "southeast",
    summary: "Carolinas to Florida Atlantic — inshore structure, nearshore, clear flats pockets.",
    conditions: { mustPassGuides: true, freeSwing: true, retieFrequency: "occasional" },
    advisories: [
      "South Atlantic inshore pairs light leaders with structure risk — declare diameter honestly on braid-to-leader jobs.",
      "Clear water pockets still refuse bulky terminals even when nearby docks are abrasive.",
    ],
    signals: {
      saltLean: "salt",
      wireWatch: true,
      abrasion: "barnacle",
      clearPressured: true,
    },
  },
  {
    id: "gulf",
    label: "Gulf",
    tier: "fine",
    parentId: "southeast",
    summary: "Oyster, marsh, nearshore and offshore — abrasion and toothy species dominate.",
    conditions: { retieFrequency: "occasional", mustPassGuides: true },
    advisories: [
      "Gulf shoreline and marsh structure usually abrades the leader side before the knot geometry fails.",
      "Toothy inshore and nearshore species keep wire-watch live; mono shock leaders alone are not bite-proof.",
      "Offshore days shift to rare reties and verifiable seating — build for inspection, not speed.",
    ],
    signals: {
      saltLean: "salt",
      wireWatch: true,
      abrasion: "oyster",
      shockLeaderCommon: true,
    },
  },
  {
    id: "great-lakes",
    label: "Great Lakes",
    tier: "fine",
    parentId: "midwest",
    summary: "Cold big water, toothy predators, wind and wet decks.",
    conditions: { coldHands: true, windy: true, retieFrequency: "occasional" },
    advisories: [
      "Great Lakes pike and muskie make wire or heavy bite protection a field decision, not a catalog footnote.",
      "Wind and cold hands on open water favor joins you can seat cleanly on a rocking deck.",
    ],
    signals: {
      saltLean: "fresh",
      wireWatch: true,
      abrasion: "rock",
      coldSeason: true,
    },
  },
  {
    id: "interior-midwest",
    label: "Interior Midwest",
    tier: "fine",
    parentId: "midwest",
    summary: "Rivers, reservoirs, and natural lakes — bass, walleye, catfish, seasonal ice edges.",
    conditions: { retieFrequency: "occasional", coldHands: true },
    advisories: [
      "Interior Midwest structure is timber, rock, and current — step leader diameter for abrasion, not for salt habit.",
      "Cold-season and low-light sessions punish long procedures; keep one family you can rebuild numb.",
    ],
    signals: {
      saltLean: "fresh",
      abrasion: "timber",
      coldSeason: true,
    },
  },
  {
    id: "pacific",
    label: "Pacific",
    tier: "fine",
    parentId: "west",
    summary: "Kelp, rock, surf, and bluewater access along the Pacific coast.",
    conditions: { mustPassGuides: true, windy: true, retieFrequency: "occasional" },
    advisories: [
      "Pacific kelp and rock chafe leaders hard — inspect after every structure contact.",
      "Surf and open-coast setups are diameter-mismatch and guide-passage jobs; declare both line sides.",
    ],
    signals: {
      saltLean: "salt",
      abrasion: "kelp",
      shockLeaderCommon: true,
    },
  },
  {
    id: "mountain",
    label: "Mountain / Interior West",
    tier: "fine",
    parentId: "west",
    summary: "Clear alpine and high-desert water, trout and cold hands, frequent tippet work.",
    conditions: {
      coldHands: true,
      lowLight: true,
      retieFrequency: "frequent",
      freeSwing: true,
    },
    advisories: [
      "Mountain water is often clear and pressured — low bulk and free-swing matter more than max break strength.",
      "Frequent tippet changes in cold force one blind-friendly knot family, not a fifteen-step showpiece.",
    ],
    signals: {
      saltLean: "fresh",
      abrasion: "rock",
      clearPressured: true,
      coldSeason: true,
    },
  },
  {
    id: "desert-reservoirs",
    label: "Desert reservoirs",
    tier: "fine",
    parentId: "southwest",
    summary: "Clear pressured bass water, timber and rock edges, long casts.",
    conditions: {
      freeSwing: true,
      mustPassGuides: true,
      retieFrequency: "occasional",
    },
    advisories: [
      "Desert reservoirs often pair clear water with timber — fluoro-leaning leaders help presentation; diameter still needs structure honesty.",
      "Free-swing terminals and slim joins win more bites than bulk built for offshore shock.",
    ],
    signals: {
      saltLean: "fresh",
      abrasion: "timber",
      clearPressured: true,
    },
  },
  {
    id: "southern-california",
    label: "Southern California",
    tier: "fine",
    parentId: "southwest",
    summary: "Kelp, rock, harbor structure, and nearshore mix.",
    conditions: { mustPassGuides: true, retieFrequency: "occasional" },
    advisories: [
      "SoCal rock and kelp behave like Pacific abrasion more than inland reservoir finesse.",
      "Harbor and jetty structure still fails line above the knot — inspect before you re-tie the geometry.",
    ],
    signals: {
      saltLean: "salt",
      abrasion: "kelp",
      shockLeaderCommon: true,
    },
  },
];
