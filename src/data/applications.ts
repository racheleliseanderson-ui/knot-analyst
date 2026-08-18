/**
 * Mode 07 · Applications
 *
 * Atlas only. Never scores Decide. Mathematical knot theory (closed curves,
 * no friction) is isolated from the modelled fishing / sailing catalog.
 * Per-connection notes are derived from the existing mechanical contract
 * plus a small sourced overlay (duals, extra domains). Unknown stays unknown.
 */
import type { Knot } from "@/domain/types";
import { BOATING_KNOTS, FISHING_KNOTS, getKnot } from "@/data/catalog";
import type { DomainId } from "@/domain/domain";

export const APPLICATIONS_REVIEWED_ON = "2026-08-18";

export type TangleClass =
  | "hitch-object"
  | "bend-two-line"
  | "terminal-eye"
  | "terminal-snell"
  | "loop-fixed"
  | "loop-nonslip"
  | "loop-midline"
  | "stopper"
  | "double-line"
  | "coil-join"
  | "arbor"
  | "bind";

export type HoldsBy =
  | "friction-on-hardware"
  | "constriction"
  | "jam"
  | "interlock"
  | "wrap-stack"
  | "doubled-line"
  | "coil-on-coating";

export type ExtraDomain = "climbing" | "surgery" | "nets" | "physical-hitches";

export type WorldGroup = "physical" | "life" | "material" | "cousin";

export interface ApplicationSource {
  title: string;
  url: string;
  note?: string;
}

export interface KnotDual {
  knotId: string;
  relation: string;
}

export interface KnotApplication {
  knotId: string;
  tangleClass: TangleClass;
  holdsBy: HoldsBy[];
  duals: KnotDual[];
  topologyDoesNot: string[];
  applicationNotes: string[];
  extraDomains: ExtraDomain[];
  notFor: string[];
  sources: ApplicationSource[];
  reviewedOn: string;
  scoresDecide: false;
}

export interface WorldEssay {
  id: string;
  title: string;
  group: WorldGroup;
  lede: string;
  meaning: string;
  predicts: string[];
  doesNot: string[];
  notFor: string[];
  sources: ApplicationSource[];
  relatedKnotIds: string[];
  neverScoresDecide: true;
  reviewedOn: string;
}

export const TANGLE_LABELS: Record<TangleClass, string> = {
  "hitch-object": "Hitch — object-dependent",
  "bend-two-line": "Bend — two lines",
  "terminal-eye": "Terminal — hardware eye",
  "terminal-snell": "Terminal — shank snell",
  "loop-fixed": "Loop — fixed",
  "loop-nonslip": "Loop — non-slip",
  "loop-midline": "Loop — mid-line",
  stopper: "Stopper",
  "double-line": "Double-line",
  "coil-join": "Coil on a coating",
  arbor: "Arbor hitch",
  bind: "Bind / reef",
};

export const HOLDS_LABELS: Record<HoldsBy, string> = {
  "friction-on-hardware": "Friction on hardware",
  constriction: "Constriction",
  jam: "Jam",
  interlock: "Interlock",
  "wrap-stack": "Wrap stack",
  "doubled-line": "Doubled line",
  "coil-on-coating": "Coil on coating",
};

export const EXTRA_DOMAIN_LABELS: Record<ExtraDomain, string> = {
  climbing: "Climbing",
  surgery: "Surgery",
  nets: "Nets / textiles",
  "physical-hitches": "Physical hitch theory",
};

export const WORLD_GROUP_LABELS: Record<WorldGroup, string> = {
  physical: "Physical rope",
  life: "Life science",
  material: "Material / culture",
  cousin: "Cousin math — not rope",
};

const SRC = {
  wikiKnot: {
    title: "Knot — practical vs mathematical (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Knot",
    note: "Closed-curve knot theory ignores friction. Practical knots are classified by function.",
  },
  crowell: {
    title: "Crowell — The physics of knots (Bayman / Maddocks–Keller)",
    url: "https://www.lightandmatter.com/article/knots.html",
    note: "Bayman 1977 hitch theory; Maddocks & Keller 1987 extension. No equally good general theory for all knots.",
  },
  patil: {
    title: "Patil et al. — Topological mechanics of knots and tangles (Science, 2020)",
    url: "https://www.science.org/doi/10.1126/science.aaz0135",
    note: "Lab rods: simple topological counts correlate with stability. Not a field rating table.",
  },
  johanns: {
    title: "Johanns et al. — Strength of surgical knots (Sci. Adv., 2023)",
    url: "https://www.science.org/doi/10.1126/sciadv.adg8861",
    note: "Square vs granny is friction, geometry and plastic set — not crossing count.",
  },
  vazquez: {
    title: "Vazquez — Untangling DNA with knot theory (SIAM News, 2018)",
    url: "https://www.siam.org/publications/siam-news/articles/untangling-dna-with-knot-theory/",
    note: "Topology tracks crossings and unlinking paths. It does not describe the enzyme chemistry.",
  },
  quantaMol: {
    title: "Quanta — Scientists learn the ropes on tying molecular knots (2018)",
    url: "https://www.quantamagazine.org/scientists-learn-the-ropes-on-tying-molecular-knots-20181029/",
    note: "Closed synthetic knots (Leigh, Micheletti). Not working-end rope.",
  },
  cambridgeNets: {
    title: "Gielen et al. — Ties that bind (Cambridge Archaeological Journal, 2025)",
    url: "https://www.cambridge.org/core/journals/cambridge-archaeological-journal/article/ties-that-bind-computational-crosscultural-analyses-of-knots-reveal-their-cultural-evolutionary-history-and-significance/B35E9C2DB89FA3C81F58F309B8F754FA",
    note: "Sheet bend is the default mesh knot across cultures.",
  },
  nayak: {
    title: "Nayak et al. — Non-Abelian anyons and topological quantum computation (RMP, 2008)",
    url: "https://link.aps.org/doi/10.1103/RevModPhys.80.1083",
    note: "Braids of anyons, not fishing terminals.",
  },
  quantinuum: {
    title: "Quantinuum — Untangling knots with quantum computers (2025)",
    url: "https://www.quantinuum.com/blog/untangling-the-mysteries-of-knots-with-quantum-computers",
    note: "Jones polynomial evaluation. Cousin math. Zero input to Decide.",
  },
  kleckner: {
    title: "Kleckner & Irvine — Creation and dynamics of knotted vortices (Nature Physics, 2013)",
    url: "https://www.nature.com/articles/nphys2560",
    note: "Knotted vortices in a fluid. No bearing on a cleat hitch.",
  },
  sano: {
    title: "Sano et al. — Inner workings of the clove hitch (Extreme Mechanics Letters, 2022)",
    url: "https://www.sciencedirect.com/science/article/pii/S2352431622001080",
    note: "Elastic rod on a rigid cylinder. Empirical hitch mechanics.",
  },
  epfl: {
    title: "EPFL — Mechanics of the ideal surgical knot (2023)",
    url: "https://actu.epfl.ch/news/study-reveals-mechanics-of-the-ideal-surgical-knot/",
    note: "Public summary of Johanns et al. Alternating throws lock; same-direction throws walk.",
  },
  wikiTopoisomerase: {
    title: "DNA supercoil / topoisomerase (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/DNA_supercoil",
    note: "Cellular enzymes change topology by cut-and-reseal. Not a rope procedure.",
  },
  animatedF8: {
    title: "Animated Knots — Figure 8 follow-through",
    url: "https://www.animatedknots.com/figure-8-follow-through-loop-knot",
    note: "Documents the climbing use of the figure-eight loop. Not a rating.",
  },
  ashleyBowline: {
    title: "Bowline — seamanship identity with the sheet bend (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Bowline",
    note: "Standard identity: bowline is the sheet-bend tangle with the loop loaded.",
  },
  wikiSheet: {
    title: "Sheet bend (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Sheet_bend",
    note: "Weaver's knot / mesh knot. Dual of the bowline under a different load.",
  },
  wikiReef: {
    title: "Reef knot (Wikipedia)",
    url: "https://en.wikipedia.org/wiki/Reef_knot",
    note: "Binding knot. Capsizes. Opposite-throw pair is the granny — not modelled here.",
  },
} as const satisfies Record<string, ApplicationSource>;

interface ClassProfile {
  holdsBy: HoldsBy[];
  notes: string[];
  doesNot: string[];
  notFor: string[];
  sources: ApplicationSource[];
}

const CLASS_PROFILE: Record<TangleClass, ClassProfile> = {
  "hitch-object": {
    holdsBy: ["friction-on-hardware"],
    notes: [
      "A hitch is object-dependent. Remove the spar, cleat, ring or pile and the structure is usually the unknot.",
      "Bayman / Maddocks–Keller describe a no-slip regime from wrap count and friction. The prediction is approximate, and only for hitches.",
    ],
    doesNot: [
      "Closed-loop knot invariants (Jones, Alexander) do not say whether a clove hitch will walk on a smooth spar.",
      "No manufacturer working load is implied by wrap count.",
      "Wet, iced, or HMPE covers change friction — topology is silent.",
    ],
    notFor: [
      "Joining two free rope ends — that is a bend",
      "A standing loop that must survive after the object is gone",
    ],
    sources: [SRC.crowell, SRC.sano, SRC.wikiKnot],
  },
  "bend-two-line": {
    holdsBy: ["wrap-stack", "constriction"],
    notes: [
      "A bend captures two working ends. Holding is constriction and the seated wrap or barrel — not a closed-knot invariant.",
      "Unequal diameters and slick pairs (braid to fluoro) are material problems. Crossing number does not rank FG against a Double Uni.",
    ],
    doesNot: [
      "A Jones polynomial does not pick a braid-to-leader family.",
      "Published retention bands stay as cited on the knot record. This page does not invent one.",
      "Guide-click and tag-trim are field geometry, not topology.",
    ],
    notFor: [
      "Attaching a single line to a spar or cleat — that is a hitch",
      "Reading this page as a Decide score",
    ],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  "terminal-eye": {
    holdsBy: ["constriction", "wrap-stack"],
    notes: [
      "The eye is hardware. The knot is an open tangle around that eye. Ends stay ends.",
      "Seating (wet set, even wraps, tag orientation) is the mechanical record already on the knot. Theory adds no extra rating.",
    ],
    doesNot: [
      "Trefoil / unknot classification does not apply to a Palomar or clinch.",
      "Fluoro glaze, pigtail slip and nick-at-the-guides are forensic, not topological.",
      "No strength percentage is computed here.",
    ],
    notFor: [
      "A free-swing lure loop — use a non-slip loop family",
      "Using an invariant as a reason to keep a glazed terminal",
    ],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  "terminal-snell": {
    holdsBy: ["wrap-stack", "constriction"],
    notes: [
      "A snell is a shank column. On-axis pull is the job. The hook is the object the wraps bear on.",
      "If the barrel sits mid-shank the hook rotates. That is geometry, not a change of knot type in the mathematical sense.",
    ],
    doesNot: [
      "Closed-curve knot theory has nothing to say about shank alignment.",
      "Bait-loop size (egg loop) is a set dimension, not an invariant.",
      "No rating is invented for circle vs J-hook.",
    ],
    notFor: [
      "Ring-eye-only terminals with no shank to wrap — unless the record says otherwise",
      "Treating a floating Uni on the standing line as a finished snell",
    ],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  "loop-fixed": {
    holdsBy: ["interlock"],
    notes: [
      "A fixed loop is a standing eye. The collar or figure-eight body must survive a straight pull without becoming a noose.",
      "Bowline and sheet bend are the same crossing pattern under different load. That identity is seamanship, not a Decide score.",
    ],
    doesNot: [
      "Fixed vs slipped is a load-path question. Invariants do not choose bowline over figure-eight.",
      "Ring-loading and slack-shaking failure are physical. Topology does not grade them.",
      "No UIAA or manufacturer number is inferred here.",
    ],
    notFor: [
      "A lure that must swing on a non-slip loop — this standing eye is a different job",
      "Scoring fishing Decide from a climbing identity",
    ],
    sources: [SRC.ashleyBowline, SRC.wikiKnot, SRC.patil],
  },
  "loop-nonslip": {
    holdsBy: ["interlock"],
    notes: [
      "A non-slip lure loop must stay open under a straight pull. Collapse means the return path failed — it is a noose, not a tight loop.",
      "Kreh / Rapala / Homer Rhode families share that job. They are not closed mathematical knots.",
    ],
    doesNot: [
      "Loop size is set when you tie. It is not a crossing number.",
      "Free-swing is a field-fit dimension already in Decide. This page does not re-score it.",
      "Heavy-leader glaze is material, not topology.",
    ],
    notFor: [
      "A standing mid-line loop or a king-sling-style loop in the line",
      "Braid-only terminals where the record already rules the family out",
    ],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  "loop-midline": {
    holdsBy: ["interlock"],
    notes: [
      "A mid-line loop is tied on a bight. Both standing parts stay load-bearing.",
      "Alpine butterfly and bowline-on-a-bight are different geometries for the same job class. Invariants do not rank them.",
    ],
    doesNot: [
      "Direction of pull (one standing part vs both) is mechanics, not knot type in the Jones sense.",
      "No working-load table is attached here.",
      "Capsizing under ring load is a physical defect, already a Diagnose story.",
    ],
    notFor: ["An end-of-line terminal eye", "Using this page to override a Decide elimination"],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  stopper: {
    holdsBy: ["jam"],
    notes: [
      "A stopper is a bulk knot. It bears on a hole, a device, or the hand (heaving line).",
      "Figure-eight stopper and figure-eight loop share a body and split a job. That is a family identity, not a rating.",
    ],
    doesNot: [
      "Bulk vs security on HMPE is material. EStar exists because figure-eight can walk on slick line — that is cited practice, not an invariant.",
      "Heaving-line mass is a throwing job, not a topological one.",
      "No strength retention is computed here.",
    ],
    notFor: ["Joining two ropes", "A load-bearing eye"],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  "double-line": {
    holdsBy: ["doubled-line", "jam"],
    notes: [
      "A double-line is a made pair: twist, hitch or plait, then an end lock. The lock is the knot; the pair is the product.",
      "If the lock opens, you no longer have a double. That is a Diagnose story (double-line unravelled), not a change of mathematical type.",
    ],
    doesNot: [
      "Bimini wrap count is a cited procedure, not a Jones degree.",
      "Shock-load behaviour of the pair is material and construction. Unknown stays unknown here.",
      "No IGFA or tournament rule is inferred.",
    ],
    notFor: ["A single-line terminal to a hook eye", "Calling an unlocked plait a finished double"],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  "coil-join": {
    holdsBy: ["coil-on-coating"],
    notes: [
      "Nail and needle knots live on a fly-line coating (and, for the needle, a pierced core). The coil is the join.",
      "A nicked core is a dead tip, not a knot you can dress out.",
    ],
    doesNot: [
      "Coating diameter and core integrity are not topological invariants.",
      "Loop-to-loop vs nail is a job choice already in Decide.",
      "No rating is invented for hollow vs solid fly line.",
    ],
    notFor: [
      "Braid-to-fluoro in the guides as a general-purpose join",
      "Fishing a scored, pierced tip",
    ],
    sources: [SRC.wikiKnot, SRC.patil],
  },
  arbor: {
    holdsBy: ["friction-on-hardware", "jam"],
    notes: [
      "An arbor knot is a hitch plus a stopper against the spool. The spool is the object.",
      "It does not join backing to fly line. That is a different job.",
    ],
    doesNot: [
      "Spool material and line slickness change grip. Topology is silent.",
      "No backing-capacity number is implied.",
      "Decide already knows line-to-spool. This page does not re-score it.",
    ],
    notFor: ["Backing-to-fly-line or any leader join", "A load-bearing eye"],
    sources: [SRC.wikiKnot, SRC.crowell],
  },
  bind: {
    holdsBy: ["interlock", "constriction"],
    notes: [
      "Reef / square is a binding knot around a parcel. Opposite-direction throws lock; same-direction throws are a granny and walk.",
      "Johanns et al. (2023) locate that difference in friction, geometry and plastic set — not in crossing count. Granny is not modelled in this catalog.",
    ],
    doesNot: [
      "Reef is not a bend for two working ropes under load. Seamanship already forbids that job.",
      "Surgical throw security is not a Palomar rating.",
      "No suture-material number is copied onto nylon dock line.",
    ],
    notFor: [
      "Joining two ropes as a bend — use a sheet bend or a recognised bend family",
      "Letting a surgical paper score fishing Decide",
    ],
    sources: [SRC.johanns, SRC.wikiReef, SRC.epfl],
  },
};

const DOUBLE_LINE_IDS = new Set(["bimini-twist", "spider-hitch", "australian-plait"]);
const COIL_IDS = new Set(["nail-knot", "needle-knot"]);
const DOUBLED_TERMINALS = new Set(["palomar", "berkley-braid", "nanofil"]);

const DUALS: Record<string, KnotDual[]> = {
  bowline: [
    {
      knotId: "sheet-bend",
      relation:
        "Same crossing pattern. Bowline loads the standing loop; sheet bend loads both standing parts as a join.",
    },
  ],
  "sheet-bend": [
    {
      knotId: "bowline",
      relation:
        "Same crossing pattern. Sheet bend is the join; bowline is the loop loaded on one standing part.",
    },
  ],
  "double-sheet-bend": [
    {
      knotId: "sheet-bend",
      relation: "Extra turn on the same bend family, used when diameters differ.",
    },
  ],
  "figure-8-loop": [
    {
      knotId: "figure-8-stopper",
      relation: "Same figure-eight body. Loop job vs stopper job.",
    },
  ],
  "figure-8-stopper": [
    {
      knotId: "figure-8-loop",
      relation: "Same figure-eight body. Stopper job vs loop job.",
    },
  ],
  "water-bowline": [
    {
      knotId: "bowline",
      relation: "Bowline family with an extra collar against cycling wet load.",
    },
  ],
  "yosemite-bowline": [
    {
      knotId: "bowline",
      relation: "Bowline family with a Yosemite finish that captures the tail.",
    },
  ],
  "bowline-on-a-bight": [
    {
      knotId: "bowline",
      relation: "Bowline geometry tied on a bight so both standing parts remain.",
    },
  ],
  constrictor: [
    {
      knotId: "clove-hitch",
      relation: "Constrictor is a clove hitch plus a riding turn that jams.",
    },
  ],
  "clove-hitch": [
    {
      knotId: "constrictor",
      relation: "Add a riding turn and the clove becomes a constrictor that jams.",
    },
  ],
  clinch: [
    {
      knotId: "improved-clinch",
      relation: "Improved clinch adds the extra tuck through the big loop. Same wrap-stack family.",
    },
  ],
  "improved-clinch": [
    {
      knotId: "clinch",
      relation: "Plain clinch is the same wrap-stack without the improved tuck.",
    },
  ],
  davy: [
    {
      knotId: "double-davy",
      relation: "Double Davy is a second pass of the same hitch.",
    },
  ],
  "double-davy": [
    {
      knotId: "davy",
      relation: "One pass is a Davy. Two passes are the double.",
    },
  ],
  "uni-knot": [
    {
      knotId: "double-uni",
      relation: "Double Uni is two Uni barrels seated against each other as a bend.",
    },
  ],
  "double-uni": [
    {
      knotId: "uni-knot",
      relation: "Each half of a Double Uni is a Uni knot.",
    },
  ],
  "double-double-uni": [
    {
      knotId: "double-uni",
      relation: "Doubled-line variant of the same two-barrel join.",
    },
  ],
};

const EXTRA_DOMAINS: Record<string, ExtraDomain[]> = {
  "figure-8-loop": ["climbing"],
  "figure-8-stopper": ["climbing"],
  bowline: ["climbing"],
  "yosemite-bowline": ["climbing"],
  "alpine-butterfly": ["climbing"],
  "bowline-on-a-bight": ["climbing"],
  "reef-knot": ["surgery"],
  "sheet-bend": ["nets"],
  "double-sheet-bend": ["nets"],
  "cleat-hitch": ["physical-hitches"],
  "clove-hitch": ["physical-hitches"],
  "rolling-hitch": ["physical-hitches"],
  "round-turn-two-half-hitches": ["physical-hitches"],
  "icicle-hitch": ["physical-hitches"],
  "timber-hitch": ["physical-hitches"],
  "cow-hitch": ["physical-hitches"],
  "pile-hitch": ["physical-hitches"],
  "buntline-hitch": ["physical-hitches"],
  "halyard-hitch": ["physical-hitches"],
  "midshipmans-hitch": ["physical-hitches"],
  "anchor-bend": ["physical-hitches"],
};

function deriveTangleClass(k: Knot): TangleClass {
  const fam = new Set(k.contract.connectionFamilies);
  const { id } = k;
  if (fam.has("hook-snell") || k.contract.loadDirection === "snell-shank") return "terminal-snell";
  if (id === "arbor-knot" || (fam.has("line-to-spool") && k.category === "utility")) return "arbor";
  if (COIL_IDS.has(id)) return "coil-join";
  if (DOUBLE_LINE_IDS.has(id)) return "double-line";
  if (fam.has("reef-or-bind")) return "bind";
  if (fam.has("stopper")) return "stopper";
  if (fam.has("mid-line-loop")) return "loop-midline";
  if (k.contract.loopBehavior === "non-slip") return "loop-nonslip";
  if (
    k.contract.loopBehavior === "fixed" &&
    (k.contract.finishedGeometry === "loop" ||
      fam.has("fixed-eye") ||
      fam.has("line-to-loop") ||
      fam.has("loop-to-loop"))
  ) {
    return "loop-fixed";
  }
  if (
    k.contract.finishedGeometry === "hitched" ||
    fam.has("rope-to-cleat") ||
    fam.has("rope-to-bollard") ||
    fam.has("rope-to-ring") ||
    fam.has("load-transfer") ||
    fam.has("tension-line") ||
    fam.has("loop-over-post")
  ) {
    return "hitch-object";
  }
  if (
    k.category === "line-to-line" ||
    fam.has("braid-to-leader") ||
    fam.has("leader-to-leader") ||
    fam.has("leader-to-tippet") ||
    fam.has("rope-to-rope") ||
    fam.has("unequal-rope-join") ||
    fam.has("double-line-to-leader")
  ) {
    return "bend-two-line";
  }
  if (k.category === "terminal") return "terminal-eye";
  throw new Error(`No tangle class derived for ${id}`);
}

function withHolds(k: Knot, tangle: TangleClass): HoldsBy[] {
  const base = [...CLASS_PROFILE[tangle].holdsBy];
  if (DOUBLED_TERMINALS.has(k.id) && !base.includes("doubled-line")) base.unshift("doubled-line");
  if (k.id === "fg" && !base.includes("wrap-stack")) base.push("wrap-stack");
  if (k.id === "estar-stopper" && !base.includes("jam")) base.push("jam");
  if (k.id === "truckers-hitch" && !base.includes("interlock")) base.push("interlock");
  return base;
}

function knotSources(k: Knot, tangle: TangleClass): ApplicationSource[] {
  const out: ApplicationSource[] = [];
  const seen = new Set<string>();
  const push = (s: ApplicationSource) => {
    if (seen.has(s.url)) return;
    seen.add(s.url);
    out.push(s);
  };
  for (const s of CLASS_PROFILE[tangle].sources) push(s);
  if (k.id === "bowline" || k.id === "sheet-bend") push(SRC.ashleyBowline);
  if (k.id === "reef-knot") push(SRC.johanns);
  if (k.id === "figure-8-loop" || k.id === "figure-8-stopper") push(SRC.animatedF8);
  for (const s of k.sources) {
    if (s.url && /^https?:\/\//.test(s.url)) {
      push({ title: s.title, url: s.url, note: s.note });
    }
  }
  if (k.video?.id) {
    push({
      title: `${k.video.channel} — ${k.video.title}`,
      url: `https://www.youtube.com/watch?v=${k.video.id}`,
      note: "Cited tying video already attached to this record.",
    });
  }
  return out;
}

export function applicationFor(knot: Knot): KnotApplication {
  const tangleClass = deriveTangleClass(knot);
  const profile = CLASS_PROFILE[tangleClass];
  const extra = EXTRA_DOMAINS[knot.id] ?? [];
  const duals = (DUALS[knot.id] ?? []).filter((d) => Boolean(getKnot(d.knotId)));
  const notFor = [...profile.notFor];
  for (const n of knot.notIdealFor.slice(0, 2)) {
    if (!notFor.some((x) => x.toLowerCase() === n.toLowerCase())) notFor.push(n);
  }
  return {
    knotId: knot.id,
    tangleClass,
    holdsBy: withHolds(knot, tangleClass),
    duals,
    topologyDoesNot: [...profile.doesNot],
    applicationNotes: [...profile.notes],
    extraDomains: extra,
    notFor,
    sources: knotSources(knot, tangleClass),
    reviewedOn: APPLICATIONS_REVIEWED_ON,
    scoresDecide: false,
  };
}

export const WORLD_ESSAYS: WorldEssay[] = [
  {
    id: "physical-hitches",
    title: "Physical hitch theory",
    group: "physical",
    lede: "The only mathematical theory that actually talks about dock line on a spar.",
    meaning:
      "Bayman (1977) and Maddocks & Keller (1987) treat a hitch as rope friction against a rigid object. Wrap count and the friction coefficient can produce a no-slip regime. The prediction is approximately right in tests. There is still no equally successful theory for knots in general. Patil et al. (2020) later showed that simple tangle counts correlate with stability in laboratory rods — a correlation, not a field rating.",
    predicts: [
      "Some hitches have a regime where they should not slip if wrap count and friction are high enough.",
      "Remove the object and a hitch is usually topologically trivial — the object is the lock.",
      "Clove, rolling, timber and icicle live in this family. Cleat hitch is the same idea on a purpose-made object.",
    ],
    doesNot: [
      "It does not rank Palomar against FG.",
      "It does not publish a working-load limit.",
      "It does not survive a wet, iced, or HMPE cover without re-measuring friction.",
      "It does not replace Diagnose when a riding turn or dumped cleat is the actual failure.",
    ],
    notFor: ["Scoring fishing Decide", "Treating a Jones polynomial as a hitch rating"],
    sources: [SRC.crowell, SRC.sano, SRC.patil],
    relatedKnotIds: [
      "cleat-hitch",
      "clove-hitch",
      "rolling-hitch",
      "round-turn-two-half-hitches",
      "icicle-hitch",
      "timber-hitch",
    ],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
  {
    id: "surgical-throws",
    title: "Surgical throws — square vs granny",
    group: "physical",
    lede: "The one life-science paper that is actually about a knot already in this catalog.",
    meaning:
      "Johanns et al. (Science Advances, 2023) show that square / reef throws lock and granny throws walk because of friction, geometry and plastic set — not because one has more crossings. Alternating throw direction is the lock. Same-direction throws are the granny. The granny is not modelled here; the reef knot is.",
    predicts: [
      "Opposite-direction throws seat flat and lock.",
      "Same-direction throws walk under load.",
      "Suture security is a mechanical story, not a crossing-number story.",
    ],
    doesNot: [
      "It does not give a Palomar a surgical rating.",
      "It does not say a reef knot is a bend for two dock lines.",
      "It does not transfer a suture-material number onto polyester or nylon rope.",
    ],
    notFor: ["Fishing Decide", "Joining two working ropes as if reef were a sheet bend"],
    sources: [SRC.johanns, SRC.epfl, SRC.wikiReef],
    relatedKnotIds: ["reef-knot"],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
  {
    id: "dna-topology",
    title: "DNA topology",
    group: "life",
    lede: "The strongest scientific use of closed-curve knot theory — and it is not rope.",
    meaning:
      "Circular DNA knots and links during replication. Topoisomerases and recombinases change topology by cutting, passing and resealing. Vazquez and others show cells take short unlinking paths. The math tracks crossings and handedness. It does not describe the enzyme, and it does not speak to a terminal-eye job.",
    predicts: [
      "Linked circular DNA can be classified by knot and link type.",
      "Reconnection can shorten the path to the unknot.",
      "Handedness (writhe) is a real observable in the molecule.",
    ],
    doesNot: [
      "It does not tell you which fishing knot to tie.",
      "It does not describe wet fluoro or a glazed seat.",
      "It does not hand a constraint to Decide.",
    ],
    notFor: ["Any modelled fishing or sailing connection", "A Decide or Diagnose input"],
    sources: [SRC.vazquez, SRC.wikiTopoisomerase],
    relatedKnotIds: [],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
  {
    id: "molecular-knots",
    title: "Synthetic molecular knots",
    group: "life",
    lede: "Closed molecules built as trefoils and more complex knots. Ends are fused.",
    meaning:
      "First synthetic trefoil in 1989. Leigh and others later built higher-crossing closed knots. Micheletti’s ‘periodic table’ is about which closed knots self-assemble from identical fragments. These are not working-end rope, and they cannot be untied the way a bowline is untied.",
    predicts: [
      "A closed molecular strand can be a trefoil or a higher-crossing knot.",
      "Symmetry can make a higher-crossing knot easier to assemble than a simpler one.",
      "Chirality of the closed knot is a chemical observable.",
    ],
    doesNot: [
      "It does not rate a sheet bend.",
      "It does not prove that a knotted protein is stronger — that claim is still open.",
      "It does not feed Decide.",
    ],
    notFor: ["Dock line, leader, or tippet", "Any Decide constraint"],
    sources: [SRC.quantaMol, SRC.wikiKnot],
    relatedKnotIds: [],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
  {
    id: "nets-textiles",
    title: "Nets and textiles",
    group: "material",
    lede: "The sheet bend is the mesh knot cultures keep rediscovering.",
    meaning:
      "A 2025 computational survey of archaeological and ethnographic knots finds a small core repertoire — sheet bend, reef, overhand, cow hitch, clove hitch — with the sheet bend as the default mesh knot. That is cultural and functional evidence, not a strength table.",
    predicts: [
      "Sheet bend (weaver’s knot) is the usual net mesh.",
      "Reef appears as a bind, not as a load-bearing bend.",
      "Clove and cow hitch recur as object hitches.",
    ],
    doesNot: [
      "It does not invent a retention percentage for a modern braid-to-fluoro join.",
      "It does not say a net mesh is a fishing terminal.",
      "It does not score Decide.",
    ],
    notFor: ["Replacing FG or Alberto on a guide-critical leader", "A Decide input"],
    sources: [SRC.cambridgeNets, SRC.wikiSheet],
    relatedKnotIds: ["sheet-bend", "double-sheet-bend", "reef-knot", "clove-hitch", "cow-hitch"],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
  {
    id: "topological-quantum",
    title: "Braids and topological quantum computing",
    group: "cousin",
    lede: "Same branch of mathematics. Zero input to a terminal-eye job.",
    meaning:
      "Non-Abelian anyons implement gates by braiding. The operation depends on the topology of the braid, not on the exact path — the same idea that a knot type does not care how you wiggle the rope. Evaluating the Jones polynomial is related to this model. That is cousin math. It is not a fishing or dock-line constraint.",
    predicts: [
      "Some proposed quantum gates depend only on braid class.",
      "The Jones polynomial of a link is a real mathematical object.",
      "Local wiggling of a world-line does not change the braid class.",
    ],
    doesNot: [
      "It does not rank knots in this catalog.",
      "It does not say a Palomar is ‘topologically protected’.",
      "It does not belong in Decide, Diagnose, or a manufacturer rating.",
    ],
    notFor: ["Any modelled connection in this instrument", "Any scoring path"],
    sources: [SRC.nayak, SRC.quantinuum],
    relatedKnotIds: [],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
  {
    id: "vortex-fluids",
    title: "Knotted vortices",
    group: "cousin",
    lede: "Knots in a fluid, from Kelvin’s old idea to laboratory vortex rings.",
    meaning:
      "Kelvin once hoped atoms were knotted vortices. The atomic theory died. Knotted vortices are still real in fluids: Kleckner & Irvine (2013) created and tracked them in the laboratory. The object is a closed vortex line in a fluid, not a working rope.",
    predicts: [
      "A vortex line can be tied into a closed knot and persist for a measurable time.",
      "Topology of the vortex is a fluid-dynamics observable.",
    ],
    doesNot: [
      "It does not describe a cleat hitch.",
      "It does not describe DNA or a suture.",
      "It does not score Decide.",
    ],
    notFor: ["Any rope, leader or terminal in this catalog", "A Decide or Diagnose input"],
    sources: [SRC.kleckner, SRC.wikiKnot],
    relatedKnotIds: [],
    neverScoresDecide: true,
    reviewedOn: APPLICATIONS_REVIEWED_ON,
  },
];

const ALL_KNOTS = [...FISHING_KNOTS, ...BOATING_KNOTS];

export const KNOT_APPLICATIONS: KnotApplication[] = ALL_KNOTS.map(applicationFor);

const knotAppById = new Map(KNOT_APPLICATIONS.map((a) => [a.knotId, a]));
const worldById = new Map(WORLD_ESSAYS.map((w) => [w.id, w]));

export function getKnotApplication(id: string): KnotApplication | undefined {
  return knotAppById.get(id);
}

export function getWorldEssay(id: string): WorldEssay | undefined {
  return worldById.get(id);
}

export function applicationsForDomain(domain: DomainId): KnotApplication[] {
  const pool = domain === "boating" ? BOATING_KNOTS : FISHING_KNOTS;
  return pool.map((k) => {
    const row = knotAppById.get(k.id);
    if (!row) throw new Error(`Missing application row for ${k.id}`);
    return row;
  });
}

export function isWorldEssayId(id: string): boolean {
  return worldById.has(id);
}
