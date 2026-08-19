/**
 * Family-level failure fingerprints.
 * Exploration only — Diagnose still starts from the symptom.
 * Knot-specific defects stay on the mechanics overlay; this names how
 * the *family* fails so Diagram / Tie / Applications can be read together.
 *
 * Families are split on how they fail, not on catalog batch. A clove and a
 * buntline share a dock but not a failure class.
 */
export interface KnotFamily {
  id: string;
  name: string;
  job: string;
  modes: string[];
  members: readonly string[];
}

export const KNOT_FAMILIES: KnotFamily[] = [
  {
    id: "palomar-eye",
    name: "Palomar family",
    job: "Doubled line through the eye, overhand lock seated to the hardware.",
    modes: [
      "Eye too small for the doubled pass — the stack never sits",
      "Doubled overhand not seated against the eye",
      "Tag pulled into the doubled coils so the lock becomes a hinge",
    ],
    members: ["palomar", "world-fair"],
  },
  {
    id: "clinch-barrel",
    name: "Clinch family",
    job: "Wraps down the standing part, then a tuck that jams the barrel to the eye.",
    modes: [
      "Wraps walked or crossed — load on one turn of the barrel",
      "Barrel never jammed to the eye, so the tuck is decoration",
      "Tag never tucked, or the extra Improved / Trilene pass missing",
    ],
    members: ["clinch", "improved-clinch", "trilene", "nanofil"],
  },
  {
    id: "jam-terminal",
    name: "Jam-hitch terminal family",
    job: "A compact hitch or jam at the eye — fewer wraps, a different lock than a clinch barrel.",
    modes: [
      "Lock never jammed to the eye — it is a loose hitch in disguise",
      "Used on a small eye that cannot take the bulk of the jam",
      "Confused with a clinch: the tag path is not a barrel tuck",
    ],
    members: ["san-diego-jam", "pitzen", "jacks", "jansik", "centauri"],
  },
  {
    id: "uni-barrel",
    name: "Uni family",
    job: "A barrel that is formed, then slid to the eye or the other barrel.",
    modes: [
      "Barrel locked short of the eye or the other Uni",
      "Crossed wraps in the barrel",
      "Tag buried back into the barrel instead of exiting",
    ],
    members: ["uni-knot", "double-uni", "fish-n-fool", "double-double-uni"],
  },
  {
    id: "fg-wrap",
    name: "FG / Alberto family",
    job: "Braid wrapped onto a heavier leader, then locked so the join cannot hinge.",
    modes: [
      "Hinge at the material transition — the join clicks, then parts",
      "Wraps not packed on the heavier line before the lock",
      "Lock or tag on the wrong side of the braid, so the column unzips",
    ],
    members: ["fg", "alberto"],
  },
  {
    id: "albright-bight",
    name: "Albright family",
    job: "Bight in the heavier leader; lighter line wraps the bight, then tucks.",
    modes: [
      "Bight in the lighter line — the wraps have nothing to bite",
      "Wraps walked off the bight instead of packed against the fold",
      "Tag never tucked back through the bight, so the wraps dump",
    ],
    members: [
      "albright",
      "yucatan",
      "slim-beauty",
      "bristol",
      "j-knot",
      "aussie-quickie",
      "seaguar",
    ],
  },
  {
    id: "blood-surgeon",
    name: "Blood / Surgeon family",
    job: "Symmetric multi-pass join of similar diameters.",
    modes: [
      "Unequal wraps or a missed multi-pass",
      "Ends not seated together — one side walks",
      "Diameter mismatch turning the join into a hinge",
    ],
    members: ["blood", "surgeons", "orvis-tippet"],
  },
  {
    id: "fixed-loop",
    name: "Fixed-loop family",
    job: "A loop that stays the size you made, with a return that cannot cinch.",
    modes: [
      "Loop cinched around the hardware — action is dead",
      "Return path reversed, so it becomes a slip loop",
      "Fluoro in a lock that only behaves on mono",
    ],
    members: [
      "non-slip-mono-loop",
      "rapala",
      "perfection-loop",
      "homer-rhode",
      "king-sling",
      "kryston-loop",
      "baja",
      "surgeons-loop",
    ],
  },
  {
    id: "snell-shank",
    name: "Snell family",
    job: "Wraps on the shank that capture the eye; the hook is the hardware.",
    modes: [
      "Wraps walked off the shank",
      "Eye never captured — the snell is a clinch in disguise",
      "Bait loop closed, or the hair not trapped",
    ],
    members: ["snell", "easy-snell", "egg-loop", "knotless", "uni-snell"],
  },
  {
    id: "fly-tippet",
    name: "Fly / tippet family",
    job: "Fine tippet at the eye, or fly-line to leader with a tube or nail.",
    modes: [
      "Hitch path around the eye instead of through it",
      "Single pass where two were the job",
      "Gap at the tube or nail on a fly-line join",
    ],
    members: [
      "davy",
      "double-davy",
      "orvis",
      "turle",
      "harvey-dry-fly",
      "nail-knot",
      "needle-knot",
    ],
  },
  {
    id: "double-line",
    name: "Double-line family",
    job: "A load-bearing loop of doubled line, locked so it cannot crawl back.",
    modes: [
      "Twists or wraps not packed before the lock",
      "Lock that crawls back into the double",
      "Uneven legs — one side takes the shock",
    ],
    members: ["bimini-twist", "spider-hitch", "australian-plait"],
  },
  {
    id: "arbor-core",
    name: "Arbor / core-grip family",
    job: "A grip on a spool arbor or a lead-core sheath — not a join of equals.",
    modes: [
      "Too few turns on a slick arbor",
      "Sheath cut while the core is pulled",
      "Overhand missing on the leader so the trap never sets",
    ],
    members: ["arbor-knot", "willis"],
  },
  {
    id: "loop-systems",
    name: "Loop-to-loop family",
    job: "A loop that either stands as a dropper or handshake onto another loop.",
    modes: [
      "Dropper loop collapsed into an overhand",
      "Handshake twisted so one loop saws the other",
      "Loop sized after it was already loaded",
    ],
    members: ["dropper-loop", "loop-to-loop"],
  },
  {
    id: "braid-terminal",
    name: "Braid-terminal family",
    job: "Braid at the eye with extra passes so the slick line cannot slip.",
    modes: [
      "Passes never crossed through the eye",
      "Tag not locked after the extra braid passes",
      "Used on a small eye that cannot take the bulk",
    ],
    members: ["berkley-braid", "eye-crosser"],
  },
  {
    id: "cleat-make-fast",
    name: "Cleat family",
    job: "Far-horn first turn, figure-eights, one lock that still breaks by hand.",
    modes: [
      "First turn on the near horn — the hitch jams",
      "Piled extra locks that weld under surge",
      "No full turn on the base, so the crosses walk off",
    ],
    members: ["cleat-hitch"],
  },
  {
    id: "round-turn-hitch",
    name: "Round-turn hitch family",
    job: "A round turn or stacked turns take the load; the lock only keeps them there — and still breaks by hand.",
    modes: [
      "No round turn — the lock is asked to carry surge",
      "Turns not stacked, so the hitch walks on a tide",
      "Expected to jam when the job was a release-able dock line",
    ],
    members: ["round-turn-two-half-hitches", "clove-hitch"],
  },
  {
    id: "dropped-bight",
    name: "Dropped-bight family",
    job: "A finished eye dropped over a post — both legs share. Temporary, not overnight.",
    modes: [
      "Only one leg loaded — the hitch walks as a girth",
      "Bight never recleared the top of the pile",
      "Left as overnight mooring on a tide",
    ],
    members: ["cow-hitch", "pile-hitch"],
  },
  {
    id: "jam-to-hardware",
    name: "Jam-to-hardware family",
    job: "A hitch that cinches to the ring or shackle and is not meant to break by hand.",
    modes: [
      "Second turn tied outside — two half hitches, not a jam",
      "Expected to untie after a snatch",
      "HMPE without a splice — the hitch strips the cover",
    ],
    members: ["buntline-hitch", "halyard-hitch", "anchor-bend"],
  },
  {
    id: "bowline-eye",
    name: "Bowline family",
    job: "Fixed eye whose lock is a collar seated on the standing part.",
    modes: [
      "Open collar — the eye capsizes under cyclic load",
      "Cowboy / wrong-direction loop",
      "Tail too short to backup, or a Yosemite finish on an unfinished bowline",
    ],
    members: ["bowline", "water-bowline", "yosemite-bowline", "bowline-on-a-bight"],
  },
  {
    id: "figure-eight",
    name: "Figure-eight loop family",
    job: "Nested eights in a bight — inspectable, stable, and they jam after a snatch.",
    modes: [
      "Crossed eight that will not dress",
      "Eye eaten by the eight because the loop was sized after the set",
      "Expected to untie after a hard snatch",
    ],
    members: ["figure-8-loop"],
  },
  {
    id: "sheet-bend-join",
    name: "Sheet-bend family",
    job: "Bight in the thicker rope; tails same side; extra turn if the diameters differ.",
    modes: [
      "Bight in the thinner rope — the join spills",
      "Tails on opposite sides (left-handed sheet bend)",
      "Only one turn on a mismatch job — that is a single sheet bend asked to do double work",
    ],
    members: ["sheet-bend", "double-sheet-bend"],
  },
  {
    id: "grip-hitch",
    name: "Grip-hitch family",
    job: "Directional bite on a standing part — slide-test before you trust it.",
    modes: [
      "Turns on the wrong side of the load",
      "Failed slide-test, still used",
      "A clove where a rolling or icicle third turn was the job",
    ],
    members: ["rolling-hitch", "icicle-hitch", "midshipmans-hitch", "constrictor"],
  },
  {
    id: "tension-system",
    name: "Trucker's-hitch family",
    job: "A loop that becomes a 3:1, then a lock that can still be spilled.",
    modes: [
      "Loop that cinches instead of a fixed redirect",
      "Lock that cannot be spilled under working tension",
      "Standing part sawing the loop because the redirect was a slip knot",
    ],
    members: ["truckers-hitch"],
  },
  {
    id: "secure-bend",
    name: "Interlocking-bend family",
    job: "Two interlocking overhands or a Carrick lattice — tails on the documented sides.",
    modes: [
      "Tails on the wrong sides of the bend",
      "Broken lattice or a reef-knot form in disguise",
      "Undressed so one overhand takes the whole load",
    ],
    members: ["zeppelin-bend", "carrick-bend", "hunters-bend"],
  },
  {
    id: "stopper-mass",
    name: "Stopper family",
    job: "Bulk at the tail, larger than the opening — not a join.",
    modes: [
      "Body smaller than the block or fairlead after dress",
      "Asked to join two ropes",
      "Figure-8 used in HMPE where Estar extra turns were the stopper, or Ashley left as a two-lobe overhand",
    ],
    members: ["figure-8-stopper", "ashley-stopper", "estar-stopper", "heaving-line-knot"],
  },
  {
    id: "mid-line",
    name: "Alpine-butterfly family",
    job: "A mid-line eye that can take load in three directions.",
    modes: [
      "Twists not nested — the eye distorts under side load",
      "Tied as an overhand on a bight, which will not take three-way load",
      "Eye sized after it was already loaded",
    ],
    members: ["alpine-butterfly"],
  },
  {
    id: "bind",
    name: "Bind / drag family",
    job: "A binding that holds two parts, or a hitch that tightens as you drag.",
    modes: [
      "Reef knot used as a bend — it spills",
      "Granny form (both tucks the same way)",
      "Timber hitch with too few wraps on the object, so it walks",
    ],
    members: ["reef-knot", "timber-hitch"],
  },
];

const BY_KNOT = new Map<string, KnotFamily>();
for (const family of KNOT_FAMILIES) {
  for (const id of family.members) {
    if (BY_KNOT.has(id)) {
      throw new Error(`Knot ${id} is in two families`);
    }
    BY_KNOT.set(id, family);
  }
}

export function familyFor(knotId: string): KnotFamily | undefined {
  return BY_KNOT.get(knotId);
}

export function familyModesFor(knotId: string): string[] {
  return familyFor(knotId)?.modes ?? [];
}

export function families(): KnotFamily[] {
  return KNOT_FAMILIES;
}
