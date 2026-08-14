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

const ROPE_DRESS: SeatingPhase[] = [
  { phase: "Form", action: "Build the structure loose enough to see every turn.", tension: "None. Shape first." },
  { phase: "Dress", action: "Nest every turn. Crossed parts will walk or jam.", tension: "Light — hold the shape." },
  { phase: "Set", action: "Load the standing part so the intended turns take the strain.", tension: "Working load, not a snatch." },
  { phase: "Check", action: "Confirm the lock still breaks or inspects as the job requires.", tension: "None extra." },
];

const ROPE_NOTES: string[] = [
  "Dress is the lock. A pretty knot that is not dressed is not finished.",
  "HMPE usually wants a splice, not a hitch you learned in polyester.",
  "If you cannot break or inspect it under the load you expect, it is the wrong job.",
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
  centauri: ht(
    [
      "Nylon only. This collar will not grip braid.",
      "Three open loops, then the tag through all three. Closing early kinks the mono.",
      "The same collar can slide to a spool arbor — that is a secondary job, not a high-load backing plan.",
    ],
    {
      1: { expectedResult: "First loop held open around the standing line.", detail: "If it flips, restart. Reversed loops will not form a collar." },
      2: { expectedResult: "Three open loops stacked in order.", detail: "A collapsed middle loop is the usual failure." },
      3: { expectedResult: "Tag through all three; collar forming on the standing line.", detail: "Pull the tag gently. A yank kinks nylon." },
      4: { expectedResult: "Collar butted to the eye or arbor.", detail: "Set, then trim. Do not fish a floating collar." },
    },
  ),
  "eye-crosser": ht(
    [
      "The eye must accept two passes without pinching.",
      "Keep the two eye strands parallel. A cross in the eye scores the line.",
      "Braid needs a harder test pull than nylon.",
    ],
    {
      1: { expectedResult: "Long working tag through the eye.", detail: "Short tags cannot form the lock." },
      2: { expectedResult: "Two parallel strands in the eye.", detail: "If they twist, pull out and restart." },
      3: { expectedResult: "Lock around the doubled section, tag path correct.", detail: "Wrong side of the lock is a slip." },
      4: { expectedResult: "Compact seat at the eye after a hard test pull.", detail: "Braid that walks now will walk on the fish." },
    },
  ),
  "fish-n-fool": ht(
    [
      "This is a Uni barrel after a second eye pass — not a Palomar.",
      "More wraps on slick braid. Fewer on thick nylon.",
      "The barrel must slide to the eye. A barrel that closes mid-line is unfinished.",
    ],
    {
      1: { expectedResult: "Two clean eye passes, strands parallel.", detail: "A crossed second pass is the usual weak side." },
      2: { expectedResult: "Uni loop formed with the tag.", detail: "If the loop captures the hook, restart." },
      3: { expectedResult: "Even wraps inside the Uni loop.", detail: "Under-wrapped braid walks." },
      4: { expectedResult: "Barrel butted to the eye after a test pull.", detail: "Trim only after the lock." },
    },
  ),
  "harvey-dry-fly": ht(
    [
      "Turned-eye dry flies only. A straight eye is the wrong fly.",
      "The job is tippet angle, not peak retention.",
      "If the knot rolls around the eye, the presentation is already lost.",
    ],
    {
      1: { expectedResult: "Confirmed up- or down-turned eye.", detail: "Straight-eye flies belong on Davy/Orvis." },
      2: { expectedResult: "Two working loops held beside the standing tippet.", detail: "Lost loops mean a Turle-shaped mess." },
      3: { expectedResult: "Tag through both loops twice.", detail: "One pass will not hold the angle." },
      4: { expectedResult: "Knot parked on the intended side; tippet exit angle correct.", detail: "If the fly pulls nose-down, retie." },
    },
  ),
  jacks: ht(
    [
      "The crossing must stay centered. A twist to one side is a different knot.",
      "Do not improvise a second turn.",
      "Braid is out of scope.",
    ],
    {
      1: { expectedResult: "Tag doubled back parallel to the standing tippet.", detail: "Short tags hide the crossing." },
      2: { expectedResult: "Documented crossing formed, not a random hitch.", detail: "Wrong order is a slip." },
      3: { expectedResult: "Tag through the crossing in the documented direction.", detail: "Wrong side will not seat." },
      4: { expectedResult: "Compact lock centered at the eye.", detail: "If it twists, retie or step to Orvis." },
    },
  ),
  jansik: ht(
    [
      "Light mono/fluoro and a roomy eye. Three passes will not fit a tiny fly eye.",
      "Keep the three eye strands parallel.",
      "Heavy stiff leader will not close this lock.",
    ],
    {
      1: { expectedResult: "Three passes, two working loops behind the eye.", detail: "Two passes is a different knot." },
      2: { expectedResult: "Eye strands parallel, not twisted.", detail: "A twist scores the line at the eye." },
      3: { expectedResult: "Tag through both working loops.", detail: "Missing one loop is an unlock." },
      4: { expectedResult: "Compact lock at the eye after a wet close.", detail: "If it will not close, the eye is too small." },
    },
  ),
  knotless: ht(
    [
      "Hair length is set before any wrap. You cannot fix it after the column.",
      "This is a hair rig, not a lure terminal.",
      "Even shank wraps. A wrap that walks onto the bend dumps the bait.",
    ],
    {
      1: { expectedResult: "Hair length set beyond the bend.", detail: "Measure it now. Later is too late." },
      2: { expectedResult: "Hair and tag laid along the shank.", detail: "If the hair leaves the shank, restart." },
      3: { expectedResult: "Even 6–10 wraps toward the bend.", detail: "Crossed wraps walk." },
      4: { expectedResult: "Standing hooklink back through the eye; turn angle correct.", detail: "Wrong exit direction is a missed hook-turn." },
    },
  ),
  nanofil: ht(
    [
      "This is a Double Palomar. One overhand pass is the usual slip on fused superline.",
      "The eye must take doubled fused line.",
      "Pull-test for slip. NanoFil walks a lazy seat.",
    ],
    {
      1: { expectedResult: "Doubled loop through the eye.", detail: "A single strand is the wrong knot." },
      2: { expectedResult: "Loose overhand in the doubled line.", detail: "Do not cinch this yet." },
      3: { expectedResult: "Working loop through that overhand a second time.", detail: "Skipping this pass is a Palomar — and it will slip." },
      4: { expectedResult: "Hardware through the large loop; even seat; slip-test holds.", detail: "If it walks, retie. Do not fish it." },
    },
  ),
  "world-fair": ht(
    [
      "Nylon or fluoro only. Not a braid knot.",
      "Both return openings matter. Missing one rolls the lock.",
      "Wet before the close. A dry cinch scores fluoro.",
    ],
    {
      1: { expectedResult: "Doubled loop through the eye.", detail: "Short loops hide the fold." },
      2: { expectedResult: "Protruding loop folded back over the doubled line.", detail: "If it will not fold clean, lengthen the loop." },
      3: { expectedResult: "Tag through both documented openings.", detail: "One opening is an unfinished knot." },
      4: { expectedResult: "Stacked crossings, compact lock, test pull holds.", detail: "A rolled crossing is a retie." },
    },
  ),
  bristol: ht(
    [
      "A Bristol on one strand is a different, weaker knot. The double must already exist.",
      "Leader wraps both legs. Missing a leg is a fail.",
      "Test the double and the Bristol separately before you trust the system.",
    ],
    {
      1: { expectedResult: "Load-bearing double already formed.", detail: "Do not start the Bristol until the double exists." },
      2: { expectedResult: "Leader through the doubled section, long working tag.", detail: "A short tag cannot wrap both legs and return." },
      3: { expectedResult: "Even leader wraps on both main-line legs, return through the opening.", detail: "Crossed wraps or a missed return is not a Bristol." },
      4: { expectedResult: "Leader barrel seated, both the double and the join hold a hard pull.", detail: "If either side walks, cut and restart." },
    },
  ),
  "double-double-uni": ht(
    [
      "This is not a basic Double Uni. The braid side is doubled through the whole barrel.",
      "More wraps on the braid side. Fewer on the leader.",
      "Bulk will click in micro guides. That is a job mismatch, not a seating error.",
    ],
    {
      1: { expectedResult: "Overlap with the working braid doubled.", detail: "Single-strand braid is the other knot." },
      2: { expectedResult: "Uni barrel of the doubled braid around both lines.", detail: "About eight wraps. Count them." },
      3: { expectedResult: "Leader Uni of five to six wraps.", detail: "Closing one side first hinges the join." },
      4: { expectedResult: "Both barrels butted, bulk inspected, tags short.", detail: "A gap between barrels is a hinge." },
    },
  ),
  "loop-to-loop": ht(
    [
      "This is an assembly, not a knot. Strength is the weaker finished loop.",
      "Girth-hitch assembly cinches one loop and cuts the other. That is a fail.",
      "Inspect factory loops for coating damage before you commit the leader.",
    ],
    {
      1: { expectedResult: "Both loops sound — no crushed coating, no frayed splice.", detail: "A damaged factory loop is not a connection." },
      2: { expectedResult: "Leader loop through the fly-line loop.", detail: "Wrong first pass becomes a girth hitch." },
      3: { expectedResult: "Entire leader through its own loop.", detail: "Only the tippet through is unfinished." },
      4: { expectedResult: "Matching U-shapes. Neither loop cinched.", detail: "If one loop collapsed around the other, undo." },
    },
    [
      "Handshake, not a hitch. Matching U-shapes are the only finished look.",
      "A damaged factory loop is replaced, not 'made good' by the handshake.",
      "Oversized leader loops click in the guides. Size the loops to the system.",
    ],
    [
      { phase: "Inspect", action: "Check both loops for coating damage and a sound knot or splice.", tension: "None." },
      { phase: "Assemble", action: "Leader loop through fly-line loop, then the whole leader through its own loop.", tension: "None until the handshake is formed." },
      { phase: "Dress", action: "Pull into matching U-shapes.", tension: "Light, even, both loops opening together." },
      { phase: "Check", action: "Confirm neither loop has cinched. If one collapsed, undo.", tension: "A firm pull, not a snatch." },
    ],
  ),
  willis: ht(
    [
      "Lead-core sheath only. Solid braid is the wrong material.",
      "The lead must come out clean. A cut sheath will not trap.",
      "Insertion length is the grip. Short traps walk.",
    ],
    {
      1: { expectedResult: "Lead broken at the intended transition.", detail: "A ragged break can cut the sheath." },
      2: { expectedResult: "Hollow intact sheath, lead fully extracted.", detail: "Lead left under the grip is a fail." },
      3: { expectedResult: "Mono inserted deep; sheath milked uniformly.", detail: "Shallow insertion will walk on the first fish." },
      4: { expectedResult: "Lengthwise pull holds; sheath undamaged.", detail: "If the leader moves, cut back and restart." },
    },
    [
      "This is a finger-trap, not a barrel. Damage to the sheath is a cut-off.",
      "Do not use on solid braid. The trap has nothing to contract onto.",
      "Dock job. Do not start this in a wind with cold hands.",
    ],
    [
      { phase: "Break", action: "Break the lead at the transition without nicking the sheath.", tension: "Sharp bend, not a pull." },
      { phase: "Extract", action: "Slide the lead out, leaving intact hollow braid.", tension: "Gentle. The sheath is the knot." },
      { phase: "Insert", action: "Feed mono deep and milk the sheath down the leader.", tension: "Even contraction, no bunching." },
      { phase: "Prove", action: "Pull lengthwise and inspect. Movement is a retie.", tension: "Hard test pull." },
    ],
  ),
  "kryston-loop": ht(
    [
      "Nylon only. Fluoro is a documented skip — use Kreh/Rapala there.",
      "The return path is not a Kreh path. Reversed is a slip loop.",
      "Set loop size before the close. You cannot open it after.",
    ],
    {
      1: { expectedResult: "Loose mono loop at the intended distance.", detail: "Loop size is decided now." },
      2: { expectedResult: "Tag through the hook or lure eye.", detail: "Hardware on, loop still open." },
      3: { expectedResult: "Tag through the Kryston crossing, not a Kreh path.", detail: "Wrong return is a different knot." },
      4: { expectedResult: "Open loop of the intended size after a wet close.", detail: "If it cinches, it is not this knot." },
    },
  ),
  "cleat-hitch": ht(
    [
      "First turn on the far horn — the one opposite the incoming load.",
      "The lock must still break by hand. A jammed hitch is the wrong finish.",
      "One clean figure-eight is enough on a working cleat. Extra locks jam under surge.",
    ],
    {
      1: { expectedResult: "Full turn around the base on the far horn.", detail: "Near-horn first turn is the usual jam." },
      2: { expectedResult: "Figure-eights across both horns.", detail: "One cross is enough; two if the line is light." },
      3: { expectedResult: "Twisted locking hitch under the last cross, parts parallel.", detail: "A lock you cannot break by hand is a jam." },
      4: { expectedResult: "Dressed hitch that still casts off under load.", detail: "If it will not break, remake it." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "round-turn-two-half-hitches": ht(
    [
      "The round turn takes the load. The half hitches only lock.",
      "Both hitches in the same direction so they nest.",
      "HMPE needs extra turns or a splice. Do not treat it like polyester.",
    ],
    {
      1: { expectedResult: "Full round turn on the bollard or ring.", detail: "Half hitches without the turn will walk." },
      2: { expectedResult: "First half hitch around the standing part.", detail: "This hitch only locks. It does not carry." },
      3: { expectedResult: "Second half hitch nested in the same direction.", detail: "Opposite directions will walk." },
      4: { expectedResult: "Hitches dressed up to the turn.", detail: "Loose hitches walk under surge." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "clove-hitch": ht(
    [
      "Temporary only. Documented walk-off under cycling load.",
      "Turns must stack. A spread clove is already walking.",
      "Not an overnight mooring plan. Back it up or switch jobs.",
    ],
    {
      1: { expectedResult: "First turn around the spar.", detail: "This is half a hitch, not a hitch." },
      2: { expectedResult: "Second turn crossed over the first.", detail: "Same-side turns are not a clove." },
      3: { expectedResult: "Working end tucked under the second turn, both turns stacked.", detail: "Loose dress is a walk." },
      4: { expectedResult: "Watched hitch, or backed up if the load will cycle.", detail: "Leaving it unattended is the wrong job." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "anchor-bend": ht(
    [
      "Round turn through the ring first. That turn is the hitch.",
      "Working end through both turns, then a half hitch.",
      "Seize a standing job. An unseized soak can work loose.",
    ],
    {
      1: { expectedResult: "Round turn through the ring.", detail: "A single pass is not this hitch." },
      2: { expectedResult: "Working end tucked through both turns.", detail: "Missing a turn leaves a slip." },
      3: { expectedResult: "Half hitch on the standing part.", detail: "The half hitch only locks." },
      4: { expectedResult: "Hard dress. Tail seized if this stays on the ring.", detail: "Unseized standing jobs work loose wet." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  bowline: ht(
    [
      "The collar must sit tight. An undressed bowline can capsize.",
      "Backup the tail on a serious job.",
      "Not an HMPE knot. Splice that fibre.",
    ],
    {
      1: { expectedResult: "Small loop in the standing part, working end up through it.", detail: "Wrong loop direction is a cowboy bowline — dress it or restart." },
      2: { expectedResult: "Working end around the standing part.", detail: "Around the wrong part never forms a collar." },
      3: { expectedResult: "Working end back down through the small loop.", detail: "Leaving it up is unfinished." },
      4: { expectedResult: "Collar tight, tail long enough, backup if the job is serious.", detail: "An open collar can capsize under cyclic load." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "figure-8-loop": ht(
    [
      "Bight first. Eye size is decided before the eight.",
      "Both strands must nest. A crossed eight is a different, weaker knot.",
      "It can jam after a hard snatch. Do not pick this if you must untie it.",
    ],
    {
      1: { expectedResult: "Bight long enough for the finished eye.", detail: "Too short and the eight eats the loop." },
      2: { expectedResult: "Clean figure-eight in the bight.", detail: "A twisted eight will not dress." },
      3: { expectedResult: "Both parts nested, eye the size you wanted.", detail: "You cannot resize after a hard set." },
      4: { expectedResult: "Both strands parallel and inspectable.", detail: "A crossed eight is a retie." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "sheet-bend": ht(
    [
      "Bight in the thicker rope if they differ.",
      "Tails must exit the same side. Opposite tails is a left-handed sheet bend and will slip.",
      "Not a splice. Not an HMPE join.",
    ],
    {
      1: { expectedResult: "Bight in the thicker or standing rope.", detail: "Bight in the thin rope is the usual spill." },
      2: { expectedResult: "Second rope up through the bight.", detail: "Wrong direction is still recoverable — continue around." },
      3: { expectedResult: "Around both parts, tucked under its own standing part.", detail: "Missing the tuck is a hitch, not a bend." },
      4: { expectedResult: "Both tails same side, dressed.", detail: "Opposite tails — retie." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "double-sheet-bend": ht(
    [
      "Bight in the thicker rope. Always.",
      "Two turns of the thinner rope before the tuck.",
      "Tails same side, same as a single sheet bend.",
    ],
    {
      1: { expectedResult: "Bight in the thicker rope.", detail: "Thin-rope bight will spill." },
      2: { expectedResult: "Thinner rope up through the bight.", detail: "Leave working room for two turns." },
      3: { expectedResult: "Two turns around the bight, then the tuck.", detail: "One turn is a single sheet bend — the mismatch job needs two." },
      4: { expectedResult: "Hard dress, tails same side.", detail: "Opposite tails slip the same as a single." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "rolling-hitch": ht(
    [
      "Directional. Two turns on the load side.",
      "Pull must be along the standing part, not away from it.",
      "Slides first. If it walks on the test, add a turn or change the surface.",
    ],
    {
      1: { expectedResult: "Two turns on the load side of the standing part.", detail: "Turns on the wrong side will not grip." },
      2: { expectedResult: "Third turn crossing.", detail: "A clove here is the wrong hitch." },
      3: { expectedResult: "Working end tucked under the last turn.", detail: "The tuck sets the direction." },
      4: { expectedResult: "Dressed toward the load; slide-test holds.", detail: "If it walks, do not trust it." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "figure-8-stopper": ht(
    [
      "Stopper only. Not a join.",
      "It must be larger than the block or fairlead after dress.",
      "A loose eight pulls through. Dress it compact.",
    ],
    {
      1: { expectedResult: "First loop of the figure-eight in the tail.", detail: "An overhand here is a different, jammier stopper." },
      2: { expectedResult: "Eight completed, tail through.", detail: "Unfinished eights pull through." },
      3: { expectedResult: "Compact eight larger than the opening.", detail: "Size is the job." },
      4: { expectedResult: "Short tail. Not loaded as a join.", detail: "If you need a join, pick a join." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "water-bowline": ht(
    [
      "The extra security is a clove collar, not more bulk.",
      "If the two loops are not a clove, it is a plain bowline with extra rope.",
      "Still not an HMPE knot. Splice that fibre.",
    ],
    {
      1: { expectedResult: "Two overlapping loops sitting as a clove hitch in the standing part.", detail: "That clove is the water collar." },
      2: { expectedResult: "Working end up through both clove loops.", detail: "Missing a loop is unfinished." },
      3: { expectedResult: "Around the standing part and back down the clove.", detail: "Left up is a slip." },
      4: { expectedResult: "Clove dressed tight against the standing part.", detail: "A loose clove is just a fat bowline." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "bowline-on-a-bight": ht(
    [
      "Both ends are already occupied. This is a mid-line pair of loops.",
      "The bight must finish around both standing parts.",
      "Three-way load belongs on an Alpine Butterfly, not this.",
    ],
    {
      1: { expectedResult: "Long bight where the loops must sit.", detail: "A short bight cannot finish the wrap-around." },
      2: { expectedResult: "Bight passed through a loop in the doubled rope.", detail: "This is only half the knot." },
      3: { expectedResult: "Opened bight passed around the whole knot.", detail: "If it sits on one standing part, restart." },
      4: { expectedResult: "Two dressed loops, bight around both standings.", detail: "Unequal undressed loops will capsize." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "alpine-butterfly": ht(
    [
      "Mid-line only. An end-loop is a different job.",
      "Wrap order is the knot. Wrong order is a slip loop.",
      "Dress by loading the loop and both standing parts.",
    ],
    {
      1: { expectedResult: "Two wraps on the hand — fingertip turn, then thumb turn.", detail: "One wrap is not this knot." },
      2: { expectedResult: "Fingertip turn wrapped around the other two.", detail: "Lifting the wrong turn inverts the body." },
      3: { expectedResult: "Structure slid off with wrap order intact.", detail: "A scramble here is a retie." },
      4: { expectedResult: "Square body, loop standing, both standings leaving opposite sides.", detail: "A twist is a retie." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "cow-hitch": ht(
    [
      "Both legs must share the load. One-legged load walks.",
      "A finished eye dropped over a post is the job.",
      "Not an overnight mooring plan.",
    ],
    {
      1: { expectedResult: "Bight around the post or through the ring.", detail: "A single pass is not this hitch." },
      2: { expectedResult: "Both legs through the bight.", detail: "One leg through is a girth that will walk." },
      3: { expectedResult: "Hitch square, both legs leaving together.", detail: "A twisted hitch is already walking." },
      4: { expectedResult: "Both legs loaded.", detail: "If only one leg will take the strain, switch hitch." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "buntline-hitch": ht(
    [
      "The second clove turn sits inside — toward the ring. That is why it jams.",
      "If you must undo it after a snatch, this is the wrong hitch.",
      "Outside second turn is two half hitches, not a buntline.",
    ],
    {
      1: { expectedResult: "Working end through the ring.", detail: "Leave enough tail for the clove." },
      2: { expectedResult: "Clove on the standing part, second turn toward the ring.", detail: "Outside turn is the other hitch." },
      3: { expectedResult: "Clove dressed up to the ring.", detail: "A floating clove will walk, then jam in the wrong place." },
      4: { expectedResult: "Standing attachment you do not expect to break by hand.", detail: "Need a release? Use round turn and two half hitches." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "icicle-hitch": ht(
    [
      "Turns go away from the pull. Toward the pull is a different, weaker hitch.",
      "Set perpendicular first, then load along the spar.",
      "If a rolling hitch already holds, you do not need this.",
    ],
    {
      1: { expectedResult: "Four or five turns away from the pull.", detail: "Too few turns on a slick surface walk." },
      2: { expectedResult: "Working end back alongside the standing part, bight behind.", detail: "No bight means you cannot finish." },
      3: { expectedResult: "Bight over both ends and over the spar end.", detail: "Missing the spar end is unfinished." },
      4: { expectedResult: "Set perpendicular, then along-spar load holds.", detail: "If it walks on the test, add a turn." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "truckers-hitch": ht(
    [
      "This is a system: loop, purchase, lock. The lock is the fail point.",
      "The directional loop must face the purchase so it does not spill.",
      "Not a chain snubber. That is a rolling or icicle hitch.",
    ],
    {
      1: { expectedResult: "Line around the far anchor and back.", detail: "No far point, no purchase." },
      2: { expectedResult: "Directional loop in the standing part facing the purchase.", detail: "A collapsing loop dumps the tension." },
      3: { expectedResult: "Tail through the loop, line under working tension.", detail: "This is the 2:1. Do not lock yet." },
      4: { expectedResult: "Two nested half hitches locking the tension.", detail: "Walk away without the lock and the line goes slack." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "zeppelin-bend": ht(
    [
      "Six in one rope, nine in the other. Working ends opposite.",
      "Same-side tails are a different, weaker bend.",
      "Similar diameters. A mismatch is a double sheet bend.",
    ],
    {
      1: { expectedResult: "First rope looped like a 6, working end on top.", detail: "The 6 is half the lock." },
      2: { expectedResult: "Second rope looped like a 9, working end opposite.", detail: "Same-side ends will not lock." },
      3: { expectedResult: "Each working end through the centre of both loops.", detail: "Missing a loop is unfinished." },
      4: { expectedResult: "Two interlocked loops, tails opposite, standing parts loaded.", detail: "If it looks like a sheet bend, restart." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "carrick-bend": ht(
    [
      "Lattice, not a pile. Broken over-under is a tangle, not a bend.",
      "Seize both tails on a standing hawser.",
      "Small soft line wants a Zeppelin, not this.",
    ],
    {
      1: { expectedResult: "Loop in the first rope, tail under its standing part.", detail: "Tail over is the wrong lattice start." },
      2: { expectedResult: "Second rope woven under-over through that loop.", detail: "Count the overs." },
      3: { expectedResult: "Second tail across the loop and under itself.", detail: "Missing the under-itself dumps the lattice." },
      4: { expectedResult: "Standing parts pulled; tails seized if this stays.", detail: "An unseized hawser can walk." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
  ),
  "ashley-stopper": ht(
    [
      "Three lobes on the underside. Two lobes is an overhand.",
      "Stopper only. Not a join.",
      "Use when a figure-8 pulls through the block.",
    ],
    {
      1: { expectedResult: "Loose overhand, long working tail.", detail: "A short tail cannot form the third lobe." },
      2: { expectedResult: "Tail back through the overhand on the documented path.", detail: "Wrong return is still an overhand." },
      3: { expectedResult: "Collar showing three distinct lobes.", detail: "Two lobes — keep following." },
      4: { expectedResult: "Compact three-lobe stopper larger than the opening.", detail: "If it pulls through, it is unfinished or too small." },
    },
    ROPE_NOTES,
    ROPE_DRESS,
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
  centauri: mx({
    1: ["First loop open around the standing line.", "A flipped first loop will not form a collar.", "Restart the first loop."],
    2: ["Three open loops stacked.", "A collapsed middle loop is the usual failure.", "Hold all three before the tag pass."],
    3: ["Tag through all three; collar forming.", "A yank kinks nylon.", "Pull the tag gently."],
    4: ["Collar butted to the eye or arbor.", "A floating collar walks.", "Slide, set, then trim."],
  }),
  "eye-crosser": mx({
    1: ["Long working tag through the eye.", "Short tags cannot form the lock.", "Leave more tag."],
    2: ["Two parallel strands in the eye.", "A cross in the eye scores the line.", "Withdraw and restart the second pass."],
    3: ["Lock around the doubled section.", "Wrong side of the lock is a slip.", "Retrace the documented path."],
    4: ["Compact seat after a hard test pull.", "Braid that walks now will walk on the fish.", "Retie before you fish it."],
  }),
  "fish-n-fool": mx({
    1: ["Two clean eye passes, strands parallel.", "A crossed second pass is the weak side.", "Restart the second pass."],
    2: ["Uni loop formed with the tag.", "A loop that captures the hook is the wrong structure.", "Restart the Uni loop."],
    3: ["Even wraps inside the Uni loop.", "Under-wrapped braid walks.", "Add wraps before the seat."],
    4: ["Barrel butted to the eye.", "A mid-line barrel is unfinished.", "Slide it to the eye as a unit."],
  }),
  "harvey-dry-fly": mx({
    1: ["Turned-eye fly confirmed.", "A straight eye is the wrong fly.", "Switch fly or switch knot."],
    2: ["Two working loops held.", "Lost loops become a Turle-shaped mess.", "Restart the loops."],
    3: ["Tag through both loops twice.", "One pass will not hold the angle.", "Make the second pass."],
    4: ["Knot parked on the intended side; exit angle correct.", "Nose-down means the presentation is lost.", "Retie."],
  }),
  jacks: mx({
    1: ["Tag doubled back parallel.", "Short tags hide the crossing.", "Leave more tag."],
    2: ["Documented crossing formed.", "A random hitch is a different knot.", "Restart the crossing."],
    3: ["Tag through in the documented direction.", "Wrong side will not seat.", "Retrace."],
    4: ["Compact lock centered at the eye.", "A twist to one side is a fail.", "Retie or step to Orvis."],
  }),
  jansik: mx({
    1: ["Three passes, two working loops.", "Two passes is a different knot.", "Make the third pass."],
    2: ["Eye strands parallel.", "A twist scores the line.", "Untwist or restart."],
    3: ["Tag through both working loops.", "Missing one loop is an unlock.", "Capture both."],
    4: ["Compact lock at the eye.", "If it will not close, the eye is too small.", "Move to Trilene or Orvis."],
  }),
  knotless: mx({
    1: ["Hair length set beyond the bend.", "You cannot fix length after the column.", "Set it now."],
    2: ["Hair and tag on the shank.", "Hair off the shank will not trap.", "Relay it."],
    3: ["Even 6–10 wraps toward the bend.", "Crossed wraps walk onto the bend.", "Dress them."],
    4: ["Standing line back through the eye; turn angle correct.", "Wrong exit is a missed hook-turn.", "Reverse the exit and retie."],
  }),
  nanofil: mx({
    1: ["Doubled loop through the eye.", "A single strand is the wrong knot.", "Double it."],
    2: ["Loose overhand in the doubled line.", "Cinching now traps the hardware.", "Leave it open."],
    3: ["Second pass through that overhand.", "One pass is a Palomar — it will slip on NanoFil.", "Make the second pass."],
    4: ["Hardware through the large loop; slip-test holds.", "A walk now is a walk on the fish.", "Retie. Do not fish it."],
  }),
  "world-fair": mx({
    1: ["Doubled loop through the eye.", "Short loops hide the fold.", "Lengthen the loop."],
    2: ["Loop folded back over the doubled line.", "If it will not fold, the loop is too short.", "Start longer."],
    3: ["Tag through both openings.", "One opening is unfinished.", "Complete the second pass."],
    4: ["Stacked crossings, compact lock.", "A rolled crossing is a retie.", "Wet and close again, or start over."],
  }),
  bristol: mx({
    1: ["Load-bearing double already formed.", "A Bristol on one strand is a different knot.", "Tie the double first."],
    2: ["Leader through both legs, long tag.", "A short tag cannot wrap and return.", "Restart with more leader."],
    3: ["Even wraps on both legs, return through the opening.", "A missed return or a crossed wrap is a fail.", "Unwrap and relay."],
    4: ["Barrel seated; double and join both hold.", "If either side walks, the system is unfinished.", "Retie the failed side."],
  }),
  "double-double-uni": mx({
    1: ["Working braid doubled through the overlap.", "Single-strand braid is the other knot.", "Double it before the Uni."],
    2: ["Doubled-braid barrel around both lines.", "Too few wraps walk on slick braid.", "Count about eight."],
    3: ["Leader barrel formed, still open.", "Closing one side first hinges the join.", "Form both, then close."],
    4: ["Barrels butted, tags short.", "A gap is a hinge.", "Seat until they kiss."],
  }),
  "loop-to-loop": mx({
    1: ["Both loops sound.", "Crushed coating is a cut-off.", "Replace the damaged loop."],
    2: ["Leader loop through the fly-line loop.", "Wrong first pass becomes a girth hitch.", "Undo and restart the handshake."],
    3: ["Whole leader through its own loop.", "Only the tippet through is unfinished.", "Pass the entire leader."],
    4: ["Matching U-shapes, neither loop cinched.", "One loop collapsed around the other is a girth hitch.", "Undo and reassemble."],
  }),
  willis: mx({
    1: ["Lead broken at the transition, sheath intact.", "A ragged break can cut the sheath.", "Cut back and break again."],
    2: ["Hollow sheath, lead fully out.", "Lead left under the grip will not trap.", "Extract the rest."],
    3: ["Mono deep in the sheath, milked even.", "A short trap walks.", "Insert deeper."],
    4: ["Lengthwise pull holds, sheath undamaged.", "Movement now is movement on the fish.", "Cut back and restart."],
  }),
  "kryston-loop": mx({
    1: ["Loose mono loop, size already decided.", "Fluoro in the hand is the wrong material.", "Switch to nylon or to Kreh."],
    2: ["Tag through the eye, loop still open.", "Hardware trapped in a tight loop is the wrong sequence.", "Open it back up."],
    3: ["Kryston crossing, not a Kreh path.", "Reversed return is a slip loop.", "Retrace the documented path."],
    4: ["Loop still open after a wet close.", "A cinched loop is not this knot.", "Retie."],
  }),
  "cleat-hitch": mx({
    1: ["Full turn on the far horn.", "Near-horn first turn jams under surge.", "Remake from the far horn."],
    2: ["Figure-eights across both horns.", "A pile of extra crosses jams.", "One clean cross is enough."],
    3: ["Locking hitch under the last cross, parts parallel.", "A lock you cannot break by hand is a jam.", "Remake the lock."],
    4: ["Dressed, still cast-offable.", "If it will not break, it is the wrong finish.", "Remake."],
  }),
  "round-turn-two-half-hitches": mx({
    1: ["Full round turn on the spar.", "Half hitches without the turn will walk.", "Add the turn."],
    2: ["First half hitch on the standing part.", "This hitch only locks.", "Do not skip the turn to 'save rope'."],
    3: ["Second hitch nested, same direction.", "Opposite directions walk.", "Untie the second and match the first."],
    4: ["Hitches dressed up to the turn.", "Loose hitches walk under surge.", "Slide them up, then set."],
  }),
  "clove-hitch": mx({
    1: ["First turn on the spar.", "A loose first turn is already walking.", "Keep it stacked."],
    2: ["Second turn crossed over.", "Same-side turns are not a clove.", "Cross over."],
    3: ["Working end tucked, turns stacked.", "A spread clove is walking.", "Dress both turns together."],
    4: ["Watched, or backed up.", "Unattended on a tide is the wrong job.", "Switch to round turn and two half hitches."],
  }),
  "anchor-bend": mx({
    1: ["Round turn through the ring.", "A single pass is not this hitch.", "Take the second pass."],
    2: ["Working end through both turns.", "Missing a turn leaves a slip.", "Tuck through both."],
    3: ["Half hitch on the standing part.", "No lock hitch will work loose wet.", "Add it."],
    4: ["Hard dress; tail seized if standing.", "Unseized soak can walk.", "Seize the tail."],
  }),
  bowline: mx({
    1: ["Small loop, working end up through it.", "Wrong loop direction is a cowboy — dress or restart.", "Check the collar will form on the standing part."],
    2: ["Working end around the standing part.", "Around the wrong part never forms a collar.", "Retrace."],
    3: ["Working end back down the hole.", "Left up is unfinished.", "Complete the return."],
    4: ["Collar tight, tail long enough.", "An open collar can capsize.", "Dress and backup."],
  }),
  "figure-8-loop": mx({
    1: ["Bight long enough for the eye.", "Too short and the eight eats the loop.", "Start longer."],
    2: ["Clean figure-eight in the bight.", "A twist will not dress.", "Untwist or restart."],
    3: ["Both parts nested, eye sized.", "You cannot resize after a hard set.", "Dress now."],
    4: ["Both strands parallel.", "A crossed eight is a retie.", "Untie and retie a clean eight."],
  }),
  "sheet-bend": mx({
    1: ["Bight in the thicker rope.", "Thin-rope bight will spill.", "Swap which rope makes the bight."],
    2: ["Second rope up through the bight.", "Wrong first direction is still recoverable.", "Continue around both parts."],
    3: ["Tucked under its own standing part.", "Missing the tuck is not a bend.", "Complete the tuck."],
    4: ["Tails same side, dressed.", "Opposite tails slip.", "Retie."],
  }),
  "double-sheet-bend": mx({
    1: ["Bight in the thicker rope.", "Thin-rope bight will spill.", "Swap the bight."],
    2: ["Thinner rope up through the bight.", "Leave room for two turns.", "Start with more tag."],
    3: ["Two turns, then the tuck.", "One turn is a single sheet bend.", "Add the second turn."],
    4: ["Hard dress, tails same side.", "Opposite tails slip.", "Retie."],
  }),
  "rolling-hitch": mx({
    1: ["Two turns on the load side.", "Turns on the wrong side will not grip.", "Restart on the load side."],
    2: ["Third turn crossing.", "A clove here is the wrong hitch.", "Make the rolling third turn."],
    3: ["Working end tucked under the last turn.", "The tuck sets the direction.", "Retrace the tuck."],
    4: ["Dressed toward the load; slide-test holds.", "If it walks, do not trust it.", "Add a turn or change the surface."],
  }),
  "figure-8-stopper": mx({
    1: ["First loop of a figure-eight.", "An overhand is a different, jammier stopper.", "Form the eight."],
    2: ["Eight completed, tail through.", "Unfinished eights pull through.", "Complete the eight."],
    3: ["Compact eight larger than the opening.", "Too small and it pulls through.", "Retie larger."],
    4: ["Short tail. Not loaded as a join.", "A stopper asked to join will fail.", "Pick a join if you need a join."],
  }),
  "water-bowline": mx({
    1: ["Two loops sitting as a clove in the standing part.", "Random loops are not a clove collar.", "Form the clove first."],
    2: ["Working end up through both clove loops.", "Missing a loop is unfinished.", "Go through both."],
    3: ["Around the standing part and back down.", "Left up is a slip.", "Complete the return."],
    4: ["Clove dressed tight.", "A loose clove is a fat bowline.", "Dress the clove, not just the eye."],
  }),
  "bowline-on-a-bight": mx({
    1: ["Long mid-line bight.", "Too short to finish the wrap-around.", "Start longer."],
    2: ["Bight through the loop in the doubled rope.", "This is only half.", "Continue."],
    3: ["Opened bight around the whole knot.", "Sitting on one standing part is unfinished.", "Pass it around both."],
    4: ["Two loops, bight around both standings.", "A one-sided bight will capsize.", "Retie."],
  }),
  "alpine-butterfly": mx({
    1: ["Two wraps — fingertip then thumb.", "One wrap is the wrong knot.", "Make the second wrap."],
    2: ["Fingertip turn wrapped around the others.", "Wrong turn inverts the body.", "Lift the fingertip turn."],
    3: ["Slid off with order intact.", "A scramble is a retie.", "Restart the wraps."],
    4: ["Square body, both standings opposite.", "A twist is a slip waiting.", "Load all three parts."],
  }),
  "cow-hitch": mx({
    1: ["Bight around the post or through the ring.", "A single pass is not this hitch.", "Use a bight."],
    2: ["Both legs through the bight.", "One leg will walk.", "Feed both."],
    3: ["Hitch square, legs together.", "A twist is already walking.", "Dress it square."],
    4: ["Both legs loaded.", "One-leg load slips.", "Switch hitch or load both."],
  }),
  "buntline-hitch": mx({
    1: ["Working end through the ring.", "Short tail cannot finish the clove.", "Leave more tail."],
    2: ["Clove with the second turn toward the ring.", "Outside turn is two half hitches.", "Put the second turn inside."],
    3: ["Clove dressed to the ring.", "A floating clove walks, then jams wrong.", "Slide it up."],
    4: ["Standing hitch you do not expect to break by hand.", "Need a release? Wrong hitch.", "Use round turn and two half hitches."],
  }),
  "icicle-hitch": mx({
    1: ["Four or five turns away from the pull.", "Toward the pull will not grip.", "Reverse the turns."],
    2: ["Working end back, bight behind the spar.", "No bight, no finish.", "Leave the bight."],
    3: ["Bight over both ends and the spar end.", "Missing the spar end is unfinished.", "Pass it over the end."],
    4: ["Set perpendicular, then along-spar hold.", "If it walks, do not trust it.", "Add a turn."],
  }),
  "truckers-hitch": mx({
    1: ["Line around the far point and back.", "No far point, no purchase.", "Rethread the far point."],
    2: ["Directional loop facing the purchase.", "A spilling loop dumps tension.", "Remake the loop."],
    3: ["Tail through, line under working tension.", "Locking before tension wastes the 2:1.", "Pull first."],
    4: ["Two nested half hitches locking it.", "No lock, line goes slack.", "Tie the lock before you walk away."],
  }),
  "zeppelin-bend": mx({
    1: ["First rope looped like a 6.", "A random bight is not the 6.", "Form the 6."],
    2: ["Second rope like a 9, working end opposite.", "Same-side ends will not lock.", "Flip the 9."],
    3: ["Each working end through both loops.", "Missing a loop is unfinished.", "Through the centre."],
    4: ["Two interlocked loops, tails opposite.", "If it looks like a sheet bend, restart.", "Retie the 6-and-9."],
  }),
  "carrick-bend": mx({
    1: ["First loop, tail under its standing part.", "Tail over starts the wrong lattice.", "Restart the loop."],
    2: ["Second rope under-over through that loop.", "Broken lattice is a tangle.", "Count the overs."],
    3: ["Second tail under itself.", "Missing that under dumps the bend.", "Tuck under itself."],
    4: ["Standings pulled; tails seized if standing.", "Unseized hawser can walk.", "Seize both tails."],
  }),
  "ashley-stopper": mx({
    1: ["Loose overhand, long tail.", "Short tail cannot make the third lobe.", "Start longer."],
    2: ["Tail back through on the documented path.", "Wrong return stays an overhand.", "Retrace."],
    3: ["Three distinct lobes.", "Two lobes is unfinished.", "Keep following the path."],
    4: ["Compact three-lobe stopper larger than the opening.", "Pulls through if too small or loose.", "Retie larger."],
  }),
};
