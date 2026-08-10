/**
 * Procedure depth layer.
 *
 * Adds preparation, per-step detail, an explicit seating sequence and field
 * notes on top of the existing step data. Kept separate so the mechanical
 * contracts and diagnostics stay untouched, and so the Data editor can
 * author the same shape later.
 */
import type { KnotContent, KnotStep, SeatingPhase } from "@/domain/types";

interface StepDepth {
  detail?: string;
  expectedResult?: string;
  look?: string;
  failureMode?: string;
  quickFix?: string;
}

interface HowTo {
  beforeYouStart?: string[];
  seatingSequence?: SeatingPhase[];
  fieldNotes?: string[];
  /** keyed by existing step order */
  steps?: Record<number, StepDepth>;
  /** appended after the last existing step */
  extraSteps?: Omit<KnotStep, "order">[];
}

const WET_SET: SeatingPhase[] = [
  {
    phase: "Moisten",
    action: "Wet the structure before any load reaches it.",
    tension: "Zero. Nothing tightens yet.",
  },
  {
    phase: "Load",
    action: "Take up slack slowly until the wraps begin to gather.",
    tension: "Light and even — both ends moving together.",
  },
  {
    phase: "Dress",
    action: "Watch the wraps stack in order; stop and back off if any cross.",
    tension: "Hold, do not pull. Correction happens here or not at all.",
  },
  {
    phase: "Set",
    action: "One continuous pull to full seat — no sawing, no jerks.",
    tension: "Firm, single direction, standing line against the terminal end.",
  },
  {
    phase: "Trim",
    action: "Cut the tag square, leaving a short stub proud of the knot.",
    tension: "None. Never trim under load.",
  },
];

const COLD_DARK: string[] = [
  "Retie by feel first, light second — the seat is a tactile event, not a visual one.",
  "Gloves off for the dress phase. Fabric hides a crossing wrap.",
  "Wrong twice in a row means the material or the hardware is fighting you. Change one, not your technique.",
];

export const HOW_TO: Record<string, HowTo> = {
  palomar: {
    beforeYouStart: [
      "Confirm the eye passes a doubled pass of your line without forcing.",
      "Pull about 6 in (15 cm) more line than feels necessary — the hook has to travel through the loop.",
      "Braid frays at the eye if it is pushed. Fold and feed, never jam.",
    ],
    steps: {
      1: {
        detail:
          "The doubled section is the whole knot. Too short and the hook will not clear the loop at step 4; too long and the loop tangles around the lure.",
        expectedResult: "A clean doubled bight through the eye, hook hanging free.",
      },
      2: {
        detail:
          "The overhand is deliberately loose. It is a carrier for the hardware, not yet a knot.",
        expectedResult: "An open overhand with a loop wide enough for the hook to pass.",
      },
      3: {
        detail:
          "Pass the whole hardware through, point and all. A partial pass leaves the loop trapped on the bend and the knot seats crooked.",
        expectedResult: "Loop free of the hook, sitting above the eye.",
      },
      4: {
        detail:
          "This is the failure-sensitive stage. Dry nylon heats under a fast pull and loses strength before it ever sees a fish.",
        expectedResult: "Coils stacked evenly against the eye, no gap, no crossover.",
      },
      5: {
        expectedResult: "Short square tag pointing away from the coil stack.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "improved-clinch": {
    beforeYouStart: [
      "Five to seven wraps for common diameters; fewer on heavy line, more on fine.",
      "Not a braid knot on its own — braid needs doubling or a different connection.",
      "Keep the tag long enough to pass back through two openings, not one.",
    ],
    steps: {
      1: { expectedResult: "Tag through the eye with working length to spare." },
      2: {
        detail:
          "Count the wraps out loud. An uncounted clinch is the most common cause of an unexplained pull-out.",
        expectedResult: "Even barrel of wraps, no overlaps, no gaps.",
      },
      3: {
        detail:
          "The second pass through the big loop is what makes it 'improved'. Skipping it halves the security.",
        expectedResult: "Tag exits through both the eye loop and the large loop.",
      },
      4: {
        detail: "The wraps must roll down onto the eye as one body, not one at a time.",
        expectedResult: "Barrel tight against the eye, tag pointing outward.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "uni-knot": {
    beforeYouStart: [
      "Leave a long tag — the uni consumes line as it closes.",
      "Five to six turns inside the barrel is the working default.",
      "Works on almost anything with an eye; the barrel is what does the gripping.",
    ],
    steps: {
      1: { expectedResult: "Tag doubled back alongside the standing line." },
      2: { expectedResult: "An open loop with both lines running parallel through it." },
      3: {
        detail: "Wraps go around both strands, inside the loop. Around one strand is a different, weaker knot.",
        expectedResult: "Even turns encircling both strands.",
      },
      4: {
        detail:
          "Close the barrel first, then slide the whole barrel down to the eye. Two separate motions, never one.",
        expectedResult: "Compact barrel seated against the eye or set off it for a swing loop.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  trilene: {
    beforeYouStart: [
      "The double pass through the eye is the point of this knot — do not shortcut to a single.",
      "Small eyes will not accept two passes of heavy line. Check before committing.",
      "Best on mono and fluoro.",
    ],
    steps: {
      1: {
        detail: "Two passes spread eye contact over two strands, which is where the abrasion resistance comes from.",
        expectedResult: "A small double loop at the eye.",
      },
      2: { expectedResult: "Even wrap barrel above the double loop." },
      3: {
        detail: "The tag returns through both eye loops together. Through one only and it unwinds under load.",
        expectedResult: "Tag captured by both loops.",
      },
      4: { expectedResult: "Barrel closed, double loop snug on the eye, tag outward." },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "non-slip-mono-loop": {
    beforeYouStart: [
      "Decide the loop size before you start; it is fixed by where you tie the first overhand.",
      "Wrap count scales with line weight — more wraps on light line, fewer on heavy.",
      "The point is free movement of the lure, so do not let the loop close on the eye.",
    ],
    steps: {
      1: {
        detail: "This overhand is the anchor and defines the finished loop. Place it deliberately.",
        expectedResult: "A loose overhand with a clear opening.",
      },
      2: { expectedResult: "Hardware on the line, tag back through the overhand." },
      3: { expectedResult: "Even wraps around the standing line." },
      4: {
        detail: "Seat the overhand first, then the wraps. Reversed order closes the loop on the eye.",
        expectedResult: "Open loop of the intended size, knot body compact above it.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  rapala: {
    beforeYouStart: [
      "Same intent as the non-slip loop: keep the lure swinging free.",
      "Start with an overhand well up the line — the hardware travels through it.",
      "Mono and fluoro.",
    ],
    steps: {
      1: { expectedResult: "Open overhand sitting up the standing line." },
      2: { expectedResult: "Tag through the eye and back through the overhand." },
      3: { expectedResult: "Three or more even turns up the standing line." },
      4: {
        detail: "Work the tag back down through the overhand and the new loop before any tension goes on.",
        expectedResult: "Loop open and fixed, knot body neat, tag short.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  snell: {
    beforeYouStart: [
      "Needs a hook with a shank you can wrap — not a ring-eye swivel.",
      "Wraps run toward the eye and must lie side by side, not on top of each other.",
      "Deciding the standing-line side now determines how the hook rides later.",
    ],
    steps: {
      1: { expectedResult: "Line through the eye with a long tag along the shank." },
      2: {
        detail: "Each wrap must land beside the last. An overlapping wrap becomes a pressure point under load.",
        expectedResult: "A tidy sleeve of wraps along the shank.",
      },
      3: {
        detail: "The pull direction sets the hook rotation. Load the standing line, not the tag.",
        expectedResult: "Wraps compressed against the eye, standing line exiting straight.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "double-uni": {
    beforeYouStart: [
      "Overlap the two lines generously — you need working room for two barrels.",
      "Match the turn counts to the material: more turns on the thinner or slicker line.",
      "Large diameter mismatch is the usual cause of a double uni that separates.",
    ],
    steps: {
      1: { expectedResult: "Two lines lying parallel with a long overlap." },
      2: { expectedResult: "First barrel formed on one line, still open." },
      3: { expectedResult: "Second barrel formed, mirrored on the other line." },
      4: {
        detail: "Close each barrel on its own line first. Only then pull the standing lines to bring them together.",
        expectedResult: "Two closed barrels sliding toward each other.",
      },
      5: {
        expectedResult: "Barrels butted face to face, both tags exiting outward.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  fg: {
    beforeYouStart: [
      "Tension on the braid is not optional — anchor it to the reel, a rod butt or your knee.",
      "This is a friction knot: the braid bites the leader, nothing else holds it.",
      "Practice at home before the ramp. It is the slowest knot here to learn and the thinnest to fish.",
    ],
    steps: {
      1: {
        detail: "The leader must stay straight and under load throughout. Slack leader means no bite.",
        expectedResult: "Leader taut across the braid.",
      },
      2: {
        detail: "Alternating weaves are what lock the braid onto the leader. A missed alternation unravels the whole sequence.",
        expectedResult: "A tight, even plait climbing the leader.",
      },
      3: { expectedResult: "Half hitches locking the plait, braid gripping without slipping." },
      4: {
        detail: "Test by pulling hard before trimming. An FG that slips will do it on the first hard pull, not the twentieth.",
        expectedResult: "A slim tapered join that passes a guide without a click.",
      },
    },
    seatingSequence: [
      { phase: "Moisten", action: "Wet the plait before locking.", tension: "Leader stays loaded." },
      { phase: "Load", action: "Pull braid and leader against each other steadily.", tension: "Progressive, never sudden." },
      { phase: "Dress", action: "Slide the plait tight along the leader.", tension: "Held constant." },
      { phase: "Set", action: "Lock with half hitches, then load hard to prove the bite.", tension: "Full expected fighting load." },
      { phase: "Trim", action: "Trim leader tag close, braid tag slightly longer.", tension: "None." },
    ],
    fieldNotes: [
      "Not a knot to invent in the dark. Pre-tie leaders at home and carry them wound on foam.",
      "Cold hands lose braid tension before they lose grip — anchor the tag, do not pinch it.",
      "If it slips twice, the leader is too slick or too heavy for the braid. Change the pairing.",
    ],
  },
  alberto: {
    beforeYouStart: [
      "Form the leader bight first and keep it open the whole time.",
      "Wrap up the bight, then back down — the return leg is what locks it.",
      "Bulkier than an FG but far faster to tie in the field.",
    ],
    steps: {
      1: { expectedResult: "A long open bight in the leader." },
      2: { expectedResult: "Braid wrapped up the doubled leader in even turns." },
      3: {
        detail: "The return wraps travel back over the first set. Both directions are needed for the join to hold.",
        expectedResult: "Two wrap layers, tidy, no crossing.",
      },
      4: { expectedResult: "Braid exits back through the bight, join compact and tapered." },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  albright: {
    beforeYouStart: [
      "Built for heavy-to-light joins where diameters differ sharply.",
      "Wraps run back toward the closed end of the bight, never away from it.",
      "Keep the wraps captive on the bight — off the end and the join is gone.",
    ],
    steps: {
      1: { expectedResult: "Bight in the heavier line, lighter line laid alongside." },
      2: { expectedResult: "Ten or more even wraps over both bight legs." },
      3: { expectedResult: "Light line exiting the bight the same side it entered." },
      4: {
        detail: "Slide the wrap block toward the closed end before setting. It must not sit near the open end.",
        expectedResult: "Wrap block seated mid-bight, both tags exiting cleanly.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  blood: {
    beforeYouStart: [
      "Similar diameters only. Mismatched lines make an uneven blood knot that fails on the thin side.",
      "Equal wrap counts on both sides.",
      "Long tags — the twists eat length as they close.",
    ],
    steps: {
      1: { expectedResult: "Two lines crossed with generous overlap." },
      2: { expectedResult: "Even wraps on the first side." },
      3: { expectedResult: "Matching wraps on the second side." },
      4: { expectedResult: "Both tags through the central opening, opposite directions." },
      5: {
        detail: "Pull both standing lines together. Pulling tags first locks the twists before they can gather.",
        expectedResult: "Symmetrical barrel, tags exiting opposite sides.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  surgeons: {
    beforeYouStart: [
      "The fast field join. Tolerant of diameter mismatch, bulky by nature.",
      "Both lines pass through the loop together, every time.",
      "Two passes standard, three for slick or mismatched material.",
    ],
    steps: {
      1: { expectedResult: "Lines lying parallel with a long overlap." },
      2: { expectedResult: "A loose overhand containing both lines." },
      3: {
        detail: "Each additional pass must carry both lines. One line through is a plain overhand and a weak point.",
        expectedResult: "Two or three complete passes, loop still open.",
      },
      4: {
        detail: "Pull all four ends. Setting on two ends only twists the knot out of shape.",
        expectedResult: "Compact barrel, four ends exiting evenly.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "perfection-loop": {
    beforeYouStart: [
      "A loop that sits in line with the standing line — that alignment is the reason to choose it.",
      "Loop size is set before you close anything.",
      "Mono and fluoro; awkward in braid.",
    ],
    steps: {
      1: { expectedResult: "First loop formed, tag crossing behind." },
      2: { expectedResult: "Second loop in front of the first." },
      3: { expectedResult: "Tag laid between the two loops." },
      4: { expectedResult: "Second loop pulled through the first." },
      5: {
        detail: "Pull the loop and standing line apart, not the tag. The tag only locks the structure.",
        expectedResult: "Loop standing straight in line with the standing line.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "surgeons-loop": {
    beforeYouStart: [
      "The simplest reliable loop. Bulky, fast, forgiving.",
      "Double the line to the loop size you want before tying anything.",
      "Two passes minimum.",
    ],
    steps: {
      1: { expectedResult: "Doubled line of the intended loop length." },
      2: { expectedResult: "Loose overhand in the doubled line." },
      3: { expectedResult: "A second full pass through the same overhand." },
    },
    extraSteps: [
      {
        instruction: "Moisten and pull the loop and both standing strands apart in one steady motion.",
        tip: "Hold the loop with a finger or a hook shank so it seats round, not pinched.",
        commonError: "Setting on the tag closes the knot lopsided.",
        detail:
          "Three points move at once here: the loop and the two standing strands. Load them together or the barrel forms crooked.",
        expectedResult: "A symmetrical barrel with an evenly round loop below it.",
      },
      {
        instruction: "Inspect the barrel for a crossed strand, then trim the tag square.",
        tip: "A crossed strand shows as a diagonal across the barrel face.",
        detail: "This loop is bulky enough that a fault is visible — use that. It is the easiest knot here to inspect.",
        expectedResult: "Clean parallel barrel, short tag, loop free to move.",
      },
    ],
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "bimini-twist": {
    beforeYouStart: [
      "A double-line class knot, not a quick field tie. Budget time and two hands plus knees.",
      "Twenty turns is the working default; count them.",
      "Everything depends on the twists staying under tension while they roll back.",
    ],
    steps: {
      1: { expectedResult: "A long doubled section with a counted twist column." },
      2: {
        detail: "Spreading the loop feeds the twists back over themselves. Lose the spread and the column collapses.",
        expectedResult: "Twists rolling back in a tight even sleeve.",
      },
      3: { expectedResult: "Sleeve fully packed with no gaps to the base." },
      4: {
        detail: "Lock with hitches before releasing tension, not after.",
        expectedResult: "Locked column, loop retaining full length.",
      },
    },
    seatingSequence: [
      { phase: "Moisten", action: "Wet the twist column before rollback.", tension: "Loop held spread." },
      { phase: "Load", action: "Maintain spread while feeding twists back.", tension: "Constant, both legs equal." },
      { phase: "Dress", action: "Pack the sleeve down to the base with no voids.", tension: "Held." },
      { phase: "Set", action: "Lock with half hitches, then a finishing hitch.", tension: "Firm, on the doubled line." },
      { phase: "Trim", action: "Trim tag close to the finishing hitch.", tension: "None." },
    ],
    fieldNotes: [
      "Tie these before you leave. It is not a knot to attempt in chop.",
      "If the sleeve gaps, cut it off. A gapped Bimini is not a Bimini.",
      "Count aloud. Losing the count is the most common failure.",
    ],
  },
  "arbor-knot": {
    beforeYouStart: [
      "Spool job only — this knot exists so line grips a bare arbor.",
      "Tape or backing on a slick arbor if braid is going straight on.",
      "Nothing here is load-bearing against a fish; it is anti-slip insurance.",
    ],
    steps: {
      1: { expectedResult: "Line around the arbor, tag alongside the standing line." },
      2: { expectedResult: "Overhand tied on the standing line." },
      3: { expectedResult: "Second overhand in the tag, acting as a stopper." },
      4: {
        detail: "Pull the standing line so the first knot slides down and the stopper jams against it.",
        expectedResult: "Both knots butted together against the arbor.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: [
      "Trim close — the tag will otherwise print through the spooled line.",
      "Braid on a bare aluminium arbor will slip whatever you tie. Use tape or a mono backing.",
      "Check it once at first spooling and never again.",
    ],
  },
  "dropper-loop": {
    beforeYouStart: [
      "Places a standing loop mid-line for a second hook or weight.",
      "Loop must stand out from the line, not lie along it.",
      "Decide the drop position before you twist.",
    ],
    steps: {
      1: { expectedResult: "A loop formed mid-line at the chosen position." },
      2: { expectedResult: "Even twists on both sides of the loop." },
      3: { expectedResult: "Centre opening held clear with a finger or tool." },
      4: {
        detail: "Push the loop through the centre opening and hold it while pulling both standing lines apart.",
        expectedResult: "Loop standing perpendicular to the line, twists even on both sides.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
  "san-diego-jam": {
    beforeYouStart: [
      "Strong terminal knot for mono and fluoro, popular with heavier jigs.",
      "Wraps run back up the doubled line toward the eye.",
      "Leave enough tag to make the return pass twice.",
    ],
    steps: {
      1: { expectedResult: "Line through the eye, doubled back." },
      2: { expectedResult: "Even wraps back up the doubled line." },
      3: { expectedResult: "Tag through the loop at the eye." },
      4: { expectedResult: "Tag through the large loop just formed." },
      5: {
        detail: "Seat slowly and watch the wraps roll down as a block. Uneven roll means one wrap is crossed.",
        expectedResult: "Compact wrap block against the eye, tag outward.",
      },
    },
    seatingSequence: WET_SET,
    fieldNotes: COLD_DARK,
  },
};

export function applyHowTo(content: KnotContent): KnotContent {
  const extra = HOW_TO[content.id];
  if (!extra) return content;

  const steps: KnotStep[] = content.steps.map((s) => {
    const depth = extra.steps?.[s.order];
    return depth ? { ...s, ...depth } : s;
  });

  if (extra.extraSteps?.length) {
    const base = steps.reduce((max, s) => Math.max(max, s.order), 0);
    extra.extraSteps.forEach((s, i) => steps.push({ ...s, order: base + i + 1 }));
  }

  return {
    ...content,
    steps,
    ...(extra.beforeYouStart ? { beforeYouStart: extra.beforeYouStart } : {}),
    ...(extra.seatingSequence ? { seatingSequence: extra.seatingSequence } : {}),
    ...(extra.fieldNotes ? { fieldNotes: extra.fieldNotes } : {}),
  };
}