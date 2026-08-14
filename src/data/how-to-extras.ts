/**
 * How-to + micro depth for every modelled connection that the core
 * how-to.ts file does not already cover.
 *
 * Same contract as core: beforeYouStart, seatingSequence, fieldNotes,
 * per-step expectedResult/detail, and micro look / failureMode / quickFix.
 * Decision/diagnosis language — not a tutorial gallery.
 */
import type { KnotStep, SeatingPhase } from "@/domain/types";

export interface StepDepth {
  detail?: string;
  expectedResult?: string;
  look?: string;
  failureMode?: string;
  quickFix?: string;
}

export interface HowTo {
  beforeYouStart?: string[];
  seatingSequence?: SeatingPhase[];
  fieldNotes?: string[];
  steps?: Record<number, StepDepth>;
  extraSteps?: Omit<KnotStep, "order">[];
}

export type Micro = Record<number, { look?: string; failureMode?: string; quickFix?: string }>;

const WET_SET: SeatingPhase[] = [
  { phase: "Moisten", action: "Wet the structure before any load reaches it.", tension: "Zero. Nothing tightens yet." },
  { phase: "Load", action: "Take up slack slowly until the wraps begin to gather.", tension: "Light and even — both ends moving together." },
  { phase: "Dress", action: "Watch the wraps stack in order; stop and back off if any cross.", tension: "Hold, do not pull. Correction happens here or not at all." },
  { phase: "Set", action: "One continuous pull to full seat — no sawing, no jerks.", tension: "Firm, single direction, standing line against the terminal end." },
  { phase: "Trim", action: "Cut the tag square, leaving a short stub proud of the knot.", tension: "None. Never trim under load." },
];

const COLD_DARK: string[] = [
  "Retie by feel first, light second — the seat is a tactile event, not a visual one.",
  "Gloves off for the dress phase. Fabric hides a crossing wrap.",
  "Wrong twice in a row means the material or the hardware is fighting you. Change one, not your technique.",
];

function ht(
  before: string[],
  steps: Record<number, StepDepth>,
  notes: string[] = COLD_DARK,
  seating: SeatingPhase[] = WET_SET,
): HowTo {
  return { beforeYouStart: before, steps, seatingSequence: seating, fieldNotes: notes };
}

function mx(entries: Record<number, [string, string, string]>): Micro {
  const out: Micro = {};
  for (const [k, [look, failureMode, quickFix]] of Object.entries(entries)) {
    out[Number(k)] = { look, failureMode, quickFix };
  }
  return out;
}

export const HOW_TO_EXTRAS: Record<string, HowTo> = {
  yucatan: ht(
    [
      "This is a doubled-braid to leader join. A Bimini (or equivalent double) must already exist.",
      "Single-line braid is a different knot. Do not force Yucatan on one strand.",
      "Count wraps. Too few and the leader walks under load.",
    ],
    {
      1: { expectedResult: "Doubled braid laid against the leader with working room.", detail: "The double is the strength. A single braid side will slip no matter how many wraps you add." },
      2: { expectedResult: "Even wraps of the double around the leader.", detail: "Wraps must stay on the leader. Off the end and the join is gone." },
      3: { expectedResult: "Tags exiting correctly, join compact.", detail: "Seat both sides together. Pulling one side first hinges the join." },
      4: { expectedResult: "Butted, dressed join that you would send through a guide only after a hard test pull." },
    },
  ),
  "slim-beauty": ht(
    [
      "Figure-8 lock in the leader first — that is the stop the braid wraps against.",
      "More wraps on a heavy leader. Fewer on a thin one.",
      "This is a braid-to-leader job, not a similar-diameter mono join.",
    ],
    {
      1: { expectedResult: "A tight figure-8 in the leader near the tag." },
      2: { expectedResult: "Braid passed through the figure-8 and ready to wrap." },
      3: { expectedResult: "Even wraps climbing the leader toward the lock." },
      4: { expectedResult: "Opposing seat — braid and leader pulled against each other." },
      5: { expectedResult: "Slim tapered join, tags short, lock fully seated." },
    },
  ),
  "spider-hitch": ht(
    [
      "A practical double, not a free 100% claim. Tension must stay on the wraps the whole time.",
      "Count wraps. Too few is the usual failure.",
      "Not a dock-only Bimini replacement for big-game class if you have time for a Bimini.",
    ],
    {
      1: { expectedResult: "A long doubled section with a loop you can hold." },
      2: { expectedResult: "Even wraps around the doubled legs under tension." },
      3: { expectedResult: "Loop pulled through and seated while tension is held." },
      4: { expectedResult: "Compact hitch, double intact, no unwrap when you load it." },
    },
  ),
  "nail-knot": ht(
    [
      "Needs a tube or nail. This is a tool knot.",
      "Coil must finish on the fly-line tip, not hanging on the leader.",
      "Even wraps. Gaps become slip.",
    ],
    {
      1: { expectedResult: "Tube or nail alongside the fly-line tip, leader laid with it." },
      2: { expectedResult: "Even wraps over tube and fly line." },
      3: { expectedResult: "Coil transferred off the tube onto the fly line." },
      4: { expectedResult: "Low-profile coil fully on the tip, tags trimmed." },
    },
  ),
  "berkley-braid": ht(
    [
      "Braid-primary terminal. The doubled pass through the eye is the point.",
      "Confirm the eye accepts doubled braid before you commit.",
      "Not a mono/fluoro first choice — use Palomar or Uni there.",
    ],
    {
      1: { expectedResult: "Doubled braid through the eye with working length." },
      2: { expectedResult: "Uni-style barrel forming around both strands." },
      3: { expectedResult: "Barrel closed, then slid to the eye." },
      4: { expectedResult: "Compact barrel locked at the eye, tags short." },
    },
  ),
  davy: ht(
    [
      "Fast compact hitch for small flies. Not a heavy-lure terminal.",
      "The tag path through the loop is the whole knot. Miss it and it is an overhand.",
      "Fine tippet. Leave a short tag; do not over-trim before the seat.",
    ],
    {
      1: { expectedResult: "Tippet through the eye, a small loop formed above it." },
      2: { expectedResult: "Tag through the loop the Davy way — once." },
      3: { expectedResult: "Compact hitch seated at the eye, short tag." },
    },
  ),
  "double-davy": ht(
    [
      "Same as Davy plus a second pass. Use it when the fly is larger or the tippet is slick.",
      "Both passes must complete before any load.",
      "Still a small-fly knot, not a jig terminal.",
    ],
    {
      1: { expectedResult: "Tippet through the eye, working loop formed." },
      2: { expectedResult: "First Davy pass complete, loop still open." },
      3: { expectedResult: "Second pass complete, hitch seated, short tag." },
    },
  ),
  "egg-loop": ht(
    [
      "Shank-wrap bait loop. Needs a hook with a shank you can wrap.",
      "The standing loop is for bait, not for free-swing lure action.",
      "Wraps must lie side by side toward the eye.",
    ],
    {
      1: { expectedResult: "Line along the shank, loop size decided before wraps." },
      2: { expectedResult: "Even shank wraps, loop standing off the shank." },
      3: { expectedResult: "Wraps seated to the eye, loop open, standing line on-axis." },
    },
  ),
  orvis: ht(
    [
      "Compact terminal for tippet and light flies. Not a braid primary.",
      "The structure is small — dress it wet or fluoro will glaze.",
      "Confirm the eye will accept the finished compact stack.",
    ],
    {
      1: { expectedResult: "Tippet through the eye with working tag." },
      2: { expectedResult: "Orvis structure formed, still open." },
      3: { expectedResult: "Compact stack seated at the eye, tag correct." },
    },
  ),
  pitzen: ht(
    [
      "High-retention tippet terminal. The tag path is unforgiving.",
      "Count the wraps. Guessing is how this one fails.",
      "Mono and fluoro. Not a braid primary.",
    ],
    {
      1: { expectedResult: "Tag through the eye with length to complete the path." },
      2: { expectedResult: "Wraps and tag path complete before any seat." },
      3: { expectedResult: "Compact, fully seated terminal, tag outward." },
    },
  ),
  turle: ht(
    [
      "Traditional fly terminal that seats around the eye for alignment.",
      "Meant for turned-down or turned-up eyes. Poor on ring eyes that will not accept the collar.",
      "The collar must sit behind the eye, not on the shank mid-span.",
    ],
    {
      1: { expectedResult: "Tippet through the eye, overhand or Turle loop formed." },
      2: { expectedResult: "Loop passed over the fly and onto the eye." },
      3: { expectedResult: "Collar seated behind the eye, fly aligned." },
    },
  ),
  baja: ht(
    [
      "Heavy mono/fluoro terminal for stout leaders.",
      "Not a light-tippet knot. Bulk is expected.",
      "Seat wet. Heavy fluoro heats if you saw it dry.",
    ],
    {
      1: { expectedResult: "Heavy leader through the eye with a long tag." },
      2: { expectedResult: "Even wraps, no crossings on stiff line." },
      3: { expectedResult: "Fully seated stack at the eye, short tag." },
    },
  ),
  clinch: ht(
    [
      "Plain clinch — no improved pass. Speed over security.",
      "Not for braid. Not for the fish you cannot afford to lose.",
      "Five to seven wraps. Count them.",
    ],
    {
      1: { expectedResult: "Tag through the eye with wrap length." },
      2: { expectedResult: "Even wraps back up the standing line." },
      3: { expectedResult: "Tag through the eye loop, barrel seated. No second tuck." },
    },
  ),
  "uni-snell": ht(
    [
      "Uni barrel compressed along the shank for on-axis pull.",
      "Needs a shank. Will not work as a ring-eye-only knot.",
      "Close the barrel first, then slide it down the shank.",
    ],
    {
      1: { expectedResult: "Line through the eye, tag along the shank." },
      2: { expectedResult: "Uni barrel formed around the shank and standing line." },
      3: { expectedResult: "Barrel seated toward the eye, pull on-axis." },
    },
  ),
  "easy-snell": ht(
    [
      "Simplified parallel shank wraps. Geometry still has to be even.",
      "Wraps toward the eye, side by side, never stacked.",
      "Finish at the eye, not mid-shank.",
    ],
    {
      1: { expectedResult: "Line through the eye, long tag along the shank." },
      2: { expectedResult: "Even parallel wraps along the shank." },
      3: { expectedResult: "Column compressed to the eye, standing line exiting straight." },
    },
  ),
  "orvis-tippet": ht(
    [
      "Leader-to-tippet. Similar diameters. Not a braid-to-leader join.",
      "All four ends must move when you seat.",
      "A large step-down belongs on Blood or a different family.",
    ],
    {
      1: { expectedResult: "Leader and tippet overlapped several inches." },
      2: { expectedResult: "Orvis doubled-loop structure formed around both lines." },
      3: { expectedResult: "Four-end seat, slim barrel, tags short." },
    },
  ),
  seaguar: ht(
    [
      "Similar-diameter mono/fluoro join. Fluoro-friendly when seated wet.",
      "Twists and passes must both complete.",
      "Not the primary braid-to-heavy-leader join.",
    ],
    {
      1: { expectedResult: "Two lines parallel with adequate overlap." },
      2: { expectedResult: "Paired-loop / twist structure formed." },
      3: { expectedResult: "All four ends seated, even barrel." },
    },
  ),
  "j-knot": ht(
    [
      "Leader-to-tippet on similar steps. Independent shootouts like it when seated.",
      "Do not force a large diameter jump through it.",
      "Wet fluoro before the seat.",
    ],
    {
      1: { expectedResult: "Leader and tippet overlapped." },
      2: { expectedResult: "J structure complete on both lines." },
      3: { expectedResult: "Even four-end seat, tags correct." },
    },
  ),
  "aussie-quickie": ht(
    [
      "Faster braid-to-leader than FG. Guide passage still matters.",
      "Early wraps must bite. Loose start = walk later.",
      "If you have dock time, FG is the slimmer option.",
    ],
    {
      1: { expectedResult: "Braid and leader positioned for the wrap sequence." },
      2: { expectedResult: "Wraps and lock path complete." },
      3: { expectedResult: "Hard seat, short tags, join that will pass a guide." },
    },
  ),
  "needle-knot": ht(
    [
      "Needle-assisted fly-line to leader. Tool required.",
      "Do not cut the fly-line core with the needle path.",
      "Same family as Nail Knot — coil must live on the tip.",
    ],
    {
      1: { expectedResult: "Needle path established at the fly-line tip without core damage." },
      2: { expectedResult: "Even wraps transferred onto the fly line." },
      3: { expectedResult: "Smooth transition coil, tags trimmed carefully." },
    },
  ),
  "homer-rhode": ht(
    [
      "Heavy-leader free-swing loop. Decide loop size before you wrap.",
      "The structure must stay non-slip. A collapsing loop is a failed knot.",
      "Not a dry-fly tippet loop.",
    ],
    {
      1: { expectedResult: "Initial overhand / loop path through the eye." },
      2: { expectedResult: "Wraps around the standing line complete." },
      3: { expectedResult: "Loop holds size under pull, body compact." },
    },
  ),
  "king-sling": ht(
    [
      "Fixed end loop. Size is set before the final seat.",
      "Wrong loop order creates a slip loop.",
      "Not a lure-action loop — use Homer Rhode or Non-Slip for that.",
    ],
    {
      1: { expectedResult: "Initial loops formed in the correct order." },
      2: { expectedResult: "King Sling path complete, loop size set." },
      3: { expectedResult: "Fixed loop, stable under pull." },
    },
  ),
  "australian-plait": ht(
    [
      "Dock-only double-line. A loose plait is not a double.",
      "Lock the end before you trust it.",
      "If you have time and hands for a Bimini, prefer that for class double.",
    ],
    {
      1: { expectedResult: "Long doubled section, enough length to plait." },
      2: { expectedResult: "Tight even plait along the double." },
      3: { expectedResult: "End locked, double holds under a hard test pull." },
    },
  ),
};

/** Micro inspect for every modelled id that core MICRO does not already cover. */
export const MICRO_EXTRAS: Record<string, Micro> = {
  palomar: mx({
    5: [
      "Short square tag pointing away from the coil stack.",
      "A tag sucked into the stack can cut the line at the eye.",
      "Back the tag out, reseat, trim after the seat.",
    ],
  }),
  "uni-knot": mx({
    4: [
      "Compact barrel seated against the eye (or set off it for a swing).",
      "A barrel left mid-line walks under the first load.",
      "Slide the finished barrel to the eye as a unit.",
    ],
  }),
  trilene: mx({
    1: ["Two passes through the eye, a small double loop visible.", "A single pass is a different, weaker knot.", "Withdraw and make the second pass before wrapping."],
    2: ["Even wrap barrel above the double loop.", "Crossed wraps concentrate load on one turn.", "Relax and roll the wraps straight."],
    3: ["Tag captured by both eye loops together.", "Through one loop only and it unwinds.", "Follow the tag through both openings before load."],
    4: ["Barrel closed, double loop snug on the eye.", "Dry seat glazes fluoro.", "Back off, moisten, one continuous pull."],
  }),
  "non-slip-mono-loop": mx({
    1: ["Loose overhand well up the line, loop size already decided.", "An overhand too close to the eye closes the swing loop.", "Untie and place the overhand farther up."],
    2: ["Hardware on the line, tag back through the overhand.", "Tag missing the overhand is not this knot.", "Retrace the tag through the original overhand."],
    3: ["Even wraps around the standing line.", "Too few wraps on light line slip.", "Add wraps before you seat."],
    4: ["Open loop of the intended size, body compact above it.", "Seating the wraps first cinches the loop shut.", "Seat the overhand first, then the wraps."],
  }),
  rapala: mx({
    1: ["Open overhand sitting up the standing line.", "A tight overhand traps the hardware.", "Open it back up before continuing."],
    2: ["Tag through the eye and back through the overhand.", "Missing the overhand leaves a slip loop.", "Retrace before any tension."],
    3: ["Three or more even turns up the standing line.", "Under-wrapping light line lets the loop walk.", "Add turns, then dress."],
    4: ["Loop open and fixed, tag short.", "Wrong return path collapses the loop.", "Retie. Do not fish a cinched Rapala."],
  }),
  snell: mx({
    1: ["Line through the eye, long tag along the shank.", "A short tag cannot finish at the eye.", "Restart with more tag."],
    2: ["Tidy sleeve of wraps, side by side, toward the eye.", "Overlapping wraps become pressure points.", "Unwrap and lay each turn beside the last."],
    3: ["Wraps compressed against the eye, standing line straight.", "Finish short of the eye and the hook rotates.", "Slide the column to the eye before the final set."],
    4: ["On-axis pull, no gap at the eye.", "Loading the tag instead of the standing line twists the hook.", "Pull the standing line only."],
  }),
  "double-uni": mx({
    1: ["Long overlap, two lines parallel.", "Short overlap starves one barrel.", "Restart with more overlap."],
    2: ["First barrel formed, still open.", "Wrapping only one strand is a different knot.", "Confirm both strands sit inside the barrel."],
    3: ["Second barrel mirrored on the other line.", "Unequal turn counts on a mismatch let one side slip.", "More turns on the thinner or slicker side."],
    4: ["Each barrel closed on its own line first.", "Pulling standings before barrels close leaves a hollow join.", "Close, then bring them together."],
    5: ["Barrels butted face to face, tags outward.", "A gap between barrels is a hinge.", "Seat until they kiss, then trim."],
  }),
  alberto: mx({
    1: ["Long open bight in the leader.", "A short bight forces wraps off the end.", "Make the bight longer than feels necessary."],
    2: ["Even wraps up the doubled leader.", "Gaps in the first set will not hide under the return.", "Snug each wrap before the next."],
    3: ["Return wraps back over the first set.", "One direction only is an unfinished Alberto.", "Complete the return before the exit."],
    4: ["Braid exits back through the bight.", "Wrong re-entry leaves a hinge.", "Follow the original entry path out."],
    5: ["Compact tapered join.", "Under-seated barrel walks on the first fish.", "Hard test pull before you trim."],
  }),
  albright: mx({
    1: ["Bight in the heavier line, light line alongside.", "Reversed roles (light bight, heavy wraps) fail.", "Heavier line makes the bight."],
    2: ["Ten or more even wraps over both bight legs.", "Too few wraps slip on a diameter jump.", "Add wraps before you exit."],
    3: ["Light line exits the same side it entered.", "Reversed tag direction unlocks the join.", "Match the entry side."],
    4: ["Wrap block seated mid-bight, not at the open end.", "A block near the open end walks off.", "Slide it toward the closed end, then set."],
  }),
  blood: mx({
    1: ["Two lines crossed with generous overlap.", "Short tags cannot complete equal wraps.", "Restart with more length."],
    2: ["Even wraps on the first side.", "Unequal counts make an uneven barrel.", "Count aloud."],
    3: ["Matching wraps on the second side.", "Diameter mismatch fails on the thin side.", "Use Surgeon’s if the step is large."],
    4: ["Both tags through the centre, opposite directions.", "Same-direction tags will not lock.", "Reverse the second tag."],
    5: ["Symmetrical barrel, standing lines pulled — not tags.", "Pulling tags first locks twists before they gather.", "Standings together, then trim tags."],
  }),
  surgeons: mx({
    1: ["Lines parallel with a long overlap.", "Short overlap starves the passes.", "Give yourself working room."],
    2: ["Loose overhand containing both lines.", "One line through is a plain overhand.", "Both lines, every pass."],
    3: ["Two or three complete passes, loop still open.", "Single pass on slick fluoro slips.", "Add a third pass for fluoro or mismatch."],
    4: ["All four ends moving, compact barrel.", "Setting on two ends twists the knot.", "Pull all four."],
  }),
  yucatan: mx({
    1: ["Doubled braid against the leader — two strands visible.", "Single-line braid will slip.", "Build a Bimini first."],
    2: ["Even wraps of the double on the leader.", "Wraps that walk off the leader end fail immediately.", "Keep them mid-leader."],
    3: ["Both sides seating together.", "One-sided pull hinges the join.", "Load braid double and leader against each other."],
    4: ["Compact join, hard test pull done.", "Uninspected Yucatan is a dock knot you have not finished.", "Pull hard, then trim."],
  }),
  "perfection-loop": mx({
    1: ["First loop formed, tag crossing behind.", "Wrong first-loop direction makes a slip loop.", "Restart the sequence."],
    2: ["Second loop in front of the first.", "Loops stacked in the wrong order will not lock.", "Second loop in front."],
    3: ["Tag laid between the two loops.", "Tag left outside never locks.", "Park the tag between them."],
    4: ["Second loop pulled through the first.", "Pulling the wrong loop inverts the knot.", "The front loop comes through."],
    5: ["Loop in line with the standing line.", "Pulling the tag instead of the loop seats it crooked.", "Loop and standing line apart."],
  }),
  "surgeons-loop": mx({
    1: ["Doubled line of the intended loop length.", "Loop size cannot be fixed after the seat.", "Set length first."],
    2: ["Loose overhand in the doubled line.", "A tight overhand will not take the second pass.", "Keep it open."],
    3: ["Second full pass through the same overhand.", "Single pass is a weak overhand loop.", "Go through again."],
    4: ["Loop and both standing strands loaded together.", "Setting on the tag makes it lopsided.", "Three points move at once."],
    5: ["Parallel barrel, short tag, loop free.", "A crossed strand shows as a diagonal on the barrel.", "Cut and retie if you see a diagonal."],
  }),
  "arbor-knot": mx({
    1: ["Line around the arbor, tag alongside the standing line.", "Braid on bare metal will slip whatever you tie.", "Tape or mono backing first."],
    2: ["Overhand on the standing line.", "This overhand has to slide. Do not cinch it yet.", "Leave it loose."],
    3: ["Stopper overhand in the tag.", "No stopper and the first knot walks off.", "Tie the tag stopper before you slide."],
    4: ["Both knots butted against the arbor.", "Never cinched to the arbor is not an arbor knot.", "Pull the standing line until they jam."],
  }),
  "dropper-loop": mx({
    1: ["Loop formed mid-line at the chosen position.", "Position cannot be moved after twists.", "Decide first."],
    2: ["Even twists on both sides of the loop.", "Uneven twists lie the dropper along the line.", "Match the count."],
    3: ["Centre opening held clear.", "A collapsed centre will not take the loop.", "Keep a finger in it."],
    4: ["Loop standing perpendicular after the pass-through.", "Hard snatch instead of a steady seat weakens the main.", "Standing lines apart, slow."],
  }),
  "san-diego-jam": mx({
    1: ["Line through the eye, doubled back.", "A short double cannot take the return passes.", "Leave more tag."],
    2: ["Even wraps back up the doubled line, away from the eye.", "Wraps toward the eye is the wrong direction.", "Wrap away, then return."],
    3: ["Tag through the loop at the eye.", "Missed first return is not a Jam.", "Find the eye loop."],
    4: ["Tag through the large loop just formed.", "Skipping the second pass halves the lock.", "Both passes before load."],
    5: ["Wraps rolling down as a block.", "Uneven roll means a crossed wrap.", "Back off and dress."],
  }),
  "slim-beauty": mx({
    1: ["Tight figure-8 in the leader.", "A loose figure-8 never locks.", "Cinch the 8 before wrapping braid."],
    2: ["Braid through the figure-8.", "Missing the lock means wraps have nothing to stop against.", "Pass through the 8."],
    3: ["Even wraps climbing the leader.", "Too few wraps on heavy leader slip.", "Add wraps."],
    4: ["Opposing seat, both sides loaded.", "One-sided pull leaves the 8 unseated.", "Braid against leader."],
    5: ["Slim taper, tags short.", "Long stiff leader tag clicks in the guides.", "Trim the leader tag close."],
  }),
  "spider-hitch": mx({
    1: ["Long doubled section under hand tension.", "A short double cannot take enough wraps.", "Start longer."],
    2: ["Even wraps under continuous tension.", "Lost tension mid-wrap collapses the hitch.", "Do not let go."],
    3: ["Loop pulled through while tension is held.", "Seating without tension is a slip hitch.", "Keep the load on."],
    4: ["Compact hitch, double holds a test pull.", "Uninspected cyclic load on a marginal hitch fails later.", "Pull it before you fish it."],
  }),
  "nail-knot": mx({
    1: ["Tube or nail hard against the fly-line tip.", "A gap between tool and tip leaves the coil hanging.", "Pinch them together."],
    2: ["Even wraps, no gaps.", "Gapped wraps slip off the tip.", "Lay each wrap beside the last."],
    3: ["Coil fully transferred onto the fly line.", "Coil left on the tube is not a Nail Knot.", "Slide the tool out while holding the coil."],
    4: ["Low-profile coil, tags trimmed after the seat.", "Over-trim before seat completes and it unravels.", "Seat first, then cut."],
  }),
  "berkley-braid": mx({
    1: ["Doubled braid through the eye without forcing.", "Jamming braid frays it at the eye.", "Fold and feed."],
    2: ["Barrel wraps around both strands.", "Around one strand only is a different knot.", "Both legs inside the barrel."],
    3: ["Barrel closed, then slid to the eye — two motions.", "Closing and sliding at once buries a loose turn.", "Close fully, then slide."],
    4: ["Compact barrel locked at the eye.", "Under-wrapped braid walks.", "Add turns on slick braid."],
  }),
  davy: mx({
    1: ["Small loop above the eye, tippet through.", "A loop that is already tight cannot take the tag.", "Keep it open."],
    2: ["Tag through the loop the Davy way, once.", "Wrong path is an overhand that slips.", "Retrace before you seat."],
    3: ["Compact hitch, short tag.", "Over-trimming before the seat unlocks it.", "Seat, then trim."],
  }),
  "double-davy": mx({
    1: ["Working loop open above the eye.", "A cinched first pass cannot take the second.", "Leave it open."],
    2: ["First pass complete, loop still usable.", "Stopping at one pass is a Davy, not a Double.", "Go through again."],
    3: ["Second pass seated, hitch compact.", "Incomplete second pass is the usual failure on larger flies.", "Confirm two passes before load."],
  }),
  "egg-loop": mx({
    1: ["Loop size decided, line along the shank.", "Loop set after wraps will not hold bait the way you wanted.", "Size first."],
    2: ["Even shank wraps, loop standing off.", "Wraps stacked on each other cut the line.", "Side by side."],
    3: ["Column to the eye, loop still open.", "Seating that closes the bait loop defeats the knot.", "Protect the loop while you set."],
  }),
  orvis: mx({
    1: ["Tag through the eye with working length.", "Short tag cannot complete the compact path.", "Restart longer."],
    2: ["Orvis structure formed and still dressable.", "A dry half-seat on fluoro glazes the tippet.", "Moisten before the set."],
    3: ["Compact stack at the eye, tag correct.", "Wrong tag path is not an Orvis.", "Retie rather than cinch a miss."],
  }),
  pitzen: mx({
    1: ["Tag long enough for the full path.", "Guessing the wrap count is how this fails.", "Count before you start."],
    2: ["Wraps and tag path complete, nothing seated yet.", "Seating early locks a wrong path.", "Finish the path first."],
    3: ["Compact seated terminal, tag outward.", "A buried tag is unverifiable.", "Leave a short visible stub."],
  }),
  turle: mx({
    1: ["Loop formed after the eye pass.", "No loop means you cannot collar the eye.", "Form the Turle loop."],
    2: ["Loop passed over the fly onto the eye.", "Collar sitting on the shank mid-span misaligns the fly.", "Walk it to the eye."],
    3: ["Collar behind the eye, fly aligned.", "Ring eyes that will not take a collar need a different knot.", "Change family, do not force it."],
  }),
  baja: mx({
    1: ["Heavy leader through the eye, long tag.", "Stiff fluoro needs more working length.", "Give yourself room."],
    2: ["Even wraps on stiff line, no crossings.", "Crossed heavy wraps will not dress out.", "Lay them or start over."],
    3: ["Fully seated stack, short tag.", "Sawing dry heavy fluoro heats it.", "Wet, one pull."],
  }),
  clinch: mx({
    1: ["Tag through the eye with wrap length.", "Short tag cannot finish the eye-loop pass.", "More tag."],
    2: ["Five to seven even wraps.", "Uncounted clinch is the usual pull-out.", "Count out loud."],
    3: ["Tag through the eye loop, barrel seated. No second tuck.", "This is not an Improved Clinch. Do not fish it on braid.", "Change family if the material is braid."],
  }),
  "uni-snell": mx({
    1: ["Line through the eye, tag along the shank.", "No shank, no snell.", "Use a shank hook."],
    2: ["Uni barrel around shank and standing line.", "Barrel around the standing line only is a Uni, not a snell.", "Include the shank."],
    3: ["Barrel slid to the eye, pull on-axis.", "Finish mid-shank and the hook rotates.", "Slide it home."],
  }),
  "easy-snell": mx({
    1: ["Long tag along the shank.", "Short tag cannot reach the eye.", "Restart."],
    2: ["Parallel wraps, side by side.", "Stacked wraps cut.", "Lay them."],
    3: ["Column at the eye, standing line straight.", "Loading the tag twists the hook.", "Standing line only."],
  }),
  "orvis-tippet": mx({
    1: ["Several inches of overlap, similar diameters.", "A large step-down belongs elsewhere.", "Match diameters or change family."],
    2: ["Orvis structure around both lines.", "Uneven capture of one line makes a hinge.", "Both lines in every pass."],
    3: ["Four ends seated together.", "Two-end seat twists the barrel.", "All four."],
  }),
  seaguar: mx({
    1: ["Parallel overlap, similar diameters.", "Forced mismatch slips.", "Blood or Surgeon’s for a step."],
    2: ["Twists and passes complete.", "Too few twists on fluoro walk.", "Add twists before the seat."],
    3: ["Four-end even barrel.", "Dry fluoro seat glazes.", "Wet first."],
  }),
  "j-knot": mx({
    1: ["Overlap ready, diameters close.", "Large tippet step fails here.", "Reduce the step."],
    2: ["J structure complete on both lines.", "Incomplete passes are the usual break.", "Finish the path."],
    3: ["Even four-end seat.", "Dry seat on fluoro.", "Moisten, then set."],
  }),
  "aussie-quickie": mx({
    1: ["Braid and leader in position, braid under tension.", "Slack braid will not bite.", "Anchor the braid."],
    2: ["Wraps and lock complete.", "Loose early wraps walk later.", "Snug the first wraps hard."],
    3: ["Hard seat, short tags, guide-check.", "Long stiff tags click in the guides.", "Trim after the test pull."],
  }),
  "needle-knot": mx({
    1: ["Needle path at the tip, core intact.", "A cut core is a dead fly line.", "If you nicked it, cut back and restart."],
    2: ["Even wraps on the fly line.", "Gapped wraps slip.", "Dress them."],
    3: ["Smooth coil, tags trimmed after seat.", "Over-trim early unravels it.", "Seat first."],
  }),
  "homer-rhode": mx({
    1: ["Overhand / loop path through the eye, size decided.", "Loop size cannot be fixed after wraps.", "Set it now."],
    2: ["Wraps around the standing line complete.", "Too few wraps on heavy leader slip.", "Add wraps."],
    3: ["Loop holds size under pull.", "A cinched loop is a failed Homer Rhode.", "Retie. Do not fish it closed."],
  }),
  "king-sling": mx({
    1: ["Initial loops in the correct order.", "Wrong order is a slip loop.", "Restart the sequence."],
    2: ["Path complete, loop size set.", "A loop larger than the system needs is bulk.", "Size it to the job."],
    3: ["Fixed loop, stable under pull.", "If it walks, the sequence was wrong.", "Retie or use Perfection Loop."],
  }),
  "australian-plait": mx({
    1: ["Long doubled section.", "Too short a double cannot be plaited tightly.", "Start longer."],
    2: ["Tight even plait.", "A loose plait is not a double.", "Rebuild tighter."],
    3: ["End locked, hard test pull holds.", "Incomplete lock unravels in the guides.", "Lock, then pull."],
  }),
};
