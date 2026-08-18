/**
 * Field failure playbook — "why isn't this working?"
 * Independent of library filtering. Symptom first, knot name last.
 *
 * Forensic notes (cited field practice, not invented ratings):
 * - A curly “pigtail” / corkscrew end is the classic sign of a slip, not a
 *   clean break (Northland; Salt Strong field write-ups).
 * - A glazed / melted curl is friction heat from a dry cinch.
 * - A clean diagonal often means a nick, guide, or teeth — not the knot.
 * - Fuzzy braid is abrasion. Hardware that is empty with a curly stub is a
 *   complete walk-off.
 */

import type { DomainId } from "@/domain/domain";
import { EXTRA_FAILURE_PLAYS } from "@/data/failure-plays-extra";

export type FailureEvent =
  | "broke-under-load"
  | "slipped-or-pulled"
  | "wont-seat"
  | "keeps-failing"
  | "bulky-guides"
  | "dead-action"
  | "hard-to-tie"
  | "unsure-setup"
  | "pigtail-left"
  | "clean-sever"
  | "frayed-through"
  | "bitten-off"
  | "loop-collapsed"
  | "join-walked"
  | "wind-tangle"
  | "coating-peeled"
  | "arbor-slipped"
  | "hardware-opened"
  | "girth-cinched"
  | "shank-walked"
  | "walked-off"
  | "capsized"
  | "jammed-uncleatable"
  | "chafe-at-fairlead"
  | "unequal-slip"
  | "stopper-pulled"
  | "self-cut"
  | "tip-wrap"
  | "double-line-unravelled"
  | "reef-spilled"
  | "grip-slipped"
  | "riding-turn"
  | "cleat-dumped"
  | "shock-parted";

export type BreakLocation =
  | "in-knot"
  | "at-eye"
  | "at-tag"
  | "above-knot"
  | "leader-join"
  | "at-guides"
  | "at-shank"
  | "at-loop"
  | "at-arbor"
  | "in-leader"
  | "at-fairlead"
  | "at-cleat"
  | "at-tiptop"
  | "at-winch"
  | "unknown";

/** What the recovered end actually looks like — forensic, not a knot name. */
export type EndLook =
  | "curly-pigtail"
  | "clean-diagonal"
  | "glazed-melt"
  | "fuzzy-frayed"
  | "mushroomed"
  | "knot-gone"
  | "knot-still-on";

export type SymptomGroup = "load" | "forensic" | "geometry" | "system" | "rope";

export interface FailurePlay {
  id: FailureEvent;
  domain: DomainId | "both";
  group: SymptomGroup;
  title: string;
  plain: string;
  meaning: string;
  questions: string[];
  likelyCauses: string[];
  checks: string[];
  fixes: string[];
  retieWhen: string;
  decideHint?: string;
  breakLocations?: BreakLocation[];
  sources: { title: string; note?: string }[];
}

const CORE: FailurePlay[] = [
  {
    id: "broke-under-load",
    domain: "both",
    group: "load",
    title: "It broke under load",
    plain: "The connection failed when a fish, snag, or hard set pulled.",
    meaning:
      "Where it broke matters more than the knot name. Clean breaks, eye cuts, and line failures above the knot each point to different fixes.",
    questions: [
      "Where is the broken end — in the knot, at the eye, or above it?",
      "Was the knot fully seated and lubricated before the pull?",
      "Is the line nicked, frayed, or heat-glazed near the failure?",
    ],
    likelyCauses: [
      "Wrong family for the material (e.g. slick braid on a knot that needs grip)",
      "Friction heat while cinching dry mono/fluoro",
      "Crossed wraps or unseated coils concentrating stress",
      "Hardware burr or sharp eye cutting the line",
      "Line damage from guides, rocks, or prior fish — failure above the knot",
    ],
    checks: [
      "Inspect the broken ends under good light",
      "Run fingers along the last 12–18 inches of line",
      "Check the hook eye / ring for burrs or corrosion",
      "Compare diameter and material to what the knot was built for",
    ],
    fixes: [
      "Retie with lubrication and slow seating if the structure looked messy",
      "Change knot family if material is wrong for the old choice",
      "Trim back past any nick and re-tie fresh",
      "Replace damaged hardware before trusting the next connection",
    ],
    retieWhen: "Always after a hard failure. Do not re-cinch a partially failed knot.",
    decideHint:
      "If the same knot keeps failing on this material, pick a better family for the connection.",
    breakLocations: ["in-knot", "at-eye", "at-tag", "above-knot", "leader-join", "unknown"],
    sources: [
      {
        title: "Salt Strong — knot fail taxonomy",
        note: "A good knot breaks before it unravels; a bad knot leaves a curly tag.",
      },
      {
        title: "Northland — slip vs break forensics",
        note: "Pigtail = slip. Melt curl = friction. Clean cut is often not the knot.",
      },
    ],
  },
  {
    id: "slipped-or-pulled",
    domain: "both",
    group: "load",
    title: "It slipped or the tag pulled",
    plain: "The knot looked tied, then walked, opened, or the tag came free.",
    meaning:
      "Slip is usually grip + seating + material, not bad luck. Braid and stiff fluoro punish under-wraps and loose finishes.",
    questions: [
      "Did the tag end look short, long, or buried wrong?",
      "Did wraps stack cleanly or cross?",
      "Was this braid, fluoro, mono, or a join of two materials?",
    ],
    likelyCauses: [
      "Too few wraps for the material",
      "Tag not locked or finish incomplete",
      "Knot never fully seated under load control",
      "Diameter mismatch on a join (thinner side needs more wraps / different knot)",
      "Wrong knot for slick braid → leader work",
    ],
    checks: [
      "Count wraps against the knot’s normal range",
      "Look for tag movement under a light steady pull",
      "Check whether barrels or coils butted together",
      "Compare the stub to a pigtail vs a clean break",
    ],
    fixes: [
      "Retie with correct wrap count and a deliberate seat",
      "On joins, match family to diameter relation (not just “what I know”)",
      "For braid→leader, prefer a proven join (FG / Alberto / Double Uni by conditions)",
      "Leave enough tag to lock, then trim after the test pull",
    ],
    retieWhen: "Any visible slip under a test pull means cut it off.",
    decideHint: "Slip-prone materials need a different ranking than “easy terminal knots.”",
    sources: [
      {
        title: "Northland — pig’s tail as total slip",
        note: "Empty hardware + corkscrew stub is a walk-off, not a break.",
      },
      {
        title: "Field practice — braid wrap count",
        note: "Slick braid punishes under-wraps; cited as a slip driver, not a rating.",
      },
    ],
  },
  {
    id: "wont-seat",
    domain: "both",
    group: "geometry",
    title: "It won’t seat or looks wrong",
    plain: "Coils won’t settle, the knot stays open, or geometry looks off.",
    meaning:
      "A good finished knot should look boring. Open gaps, crossed coils, and twisted exits are early warnings.",
    questions: [
      "Did you lubricate before the final cinch?",
      "Are coils crossing or stacking evenly?",
      "Is the eye too small for a doubled-line pass?",
    ],
    likelyCauses: [
      "Dry cinch creating friction and hang-ups",
      "Wrong direction re-entry through a loop",
      "Doubled line forced through an eye that won’t take it",
      "Stiff fluoro fighting small-radius wraps",
      "Hand path skipped a critical lock stage",
    ],
    checks: [
      "Compare finished shape to a known-good photo or diagram for that knot",
      "Confirm both line exits and tag path",
      "Verify hardware eye size vs doubled-line knots",
      "Feel for glaze — a dry fluoro seat often scores before it looks wrong",
    ],
    fixes: [
      "Cut off and retie — do not force a half-seated knot",
      "Switch to a compact single-pass terminal if the eye is tiny",
      "Slow the last pull; keep wraps aligned with a thumbnail",
      "Wet fluoro and mono before the final seat",
    ],
    retieWhen: "If it does not seat cleanly, it is not finished. Retie now.",
    decideHint: "A knot that will not seat is unfinished — do not rank it as if it were tied.",
    sources: [
      {
        title: "Common fluoro seating practice",
        note: "Dry fluoro cinches glaze; wet + slow seat is the standing correction.",
      },
    ],
  },
  {
    id: "keeps-failing",
    domain: "both",
    group: "system",
    title: "It keeps failing after I retie",
    plain: "Same break or slip pattern even with fresh ties.",
    meaning:
      "Repeated failure is usually system-level: wrong knot for the job, damaged line, bad hardware, or a technique stage you keep missing.",
    questions: [
      "Is the failure mode identical each time?",
      "Have you changed line, leader, or hardware recently?",
      "Are you retying the same knot because it’s familiar — or because it fits?",
    ],
    likelyCauses: [
      "Familiar knot is invalid or weak for this material pair",
      "Line is compromised for several feet (trim farther back)",
      "Hardware or lure eye is cutting the line",
      "Systematic technique error at one stage (wraps, seat, lock)",
      "Conditions (cold hands, wind) pushing you into rushed ties",
    ],
    checks: [
      "Change one variable at a time: new line section, then hardware, then knot family",
      "Practice the suspect stage slowly with cheap line",
      "Ask whether the connection job actually needs a different family",
      "Compare the broken ends — identical stubs mean the same miss, not bad luck",
    ],
    fixes: [
      "Run Decide for this exact connection + materials + conditions",
      "Switch hardware if the eye is sharp or undersized",
      "Pick a more inspectable knot when light or hands are bad",
      "Trim farther back than feels comfortable if the line is compromised",
    ],
    retieWhen: "Stop stacking identical retries. Change the system, then retie.",
    decideHint: "Use Decide so Layer 1 can eliminate knots that should never have been candidates.",
    sources: [
      {
        title: "Field practice — change one variable",
        note: "Identical retries diagnose nothing. Line, then hardware, then family.",
      },
    ],
  },
  {
    id: "bulky-guides",
    domain: "fishing",
    group: "geometry",
    title: "Too bulky / hangs in the guides",
    plain: "Casts tick, hang, or the join will not pass cleanly.",
    meaning:
      "Guide passage is a field constraint, not a vanity metric. Leader joins and bulky terminals fail the cast before they fail the fish.",
    questions: [
      "Is the hang at the leader join or at the terminal?",
      "Must this connection pass guides on every cast?",
      "How large is the diameter mismatch?",
    ],
    likelyCauses: [
      "Bulky join chosen when a slimmer family is available",
      "Long tags or unfinished coils",
      "Extreme diameter mismatch with a thick-profile knot",
      "Overbuilt wraps beyond what the knot needs",
    ],
    checks: [
      "Pull the connection slowly through the first guides by hand",
      "Trim tags cleanly after a proper seat",
      "Compare join options by profile, not just “strength %” lore",
      "Cotton-ball the stripper if it also cuts, not just ticks",
    ],
    fixes: [
      "For braid→leader that must cast through guides, prefer slim joins when skill allows",
      "If you need speed in bad weather, accept a bulkier but reliable join and manage leader length",
      "Keep tags short and clean after inspection",
      "Turn guide-passage on before you re-rank",
    ],
    retieWhen: "If it hangs every cast, cut and rebuild with a guide-aware choice.",
    decideHint: "Turn on “must pass guides” when ranking — bulk should not win silently.",
    sources: [
      {
        title: "Common braid-to-leader guide practice",
        note: "Slim joins exist for a reason; bulk is a constraint, not a vanity metric.",
      },
    ],
  },
  {
    id: "dead-action",
    domain: "fishing",
    group: "geometry",
    title: "Lure action feels dead",
    plain: "The bait won’t swing, walk, or track the way it should.",
    meaning:
      "Sometimes the connection should not pin the lure to the eye. A snug terminal kills action that a non-slip loop preserves.",
    questions: [
      "Is the lure meant to free-swing or vibrate freely?",
      "Did you cinch a tight knot against the eye on purpose?",
      "Is a split ring or swivel already in the system?",
    ],
    likelyCauses: [
      "Tight terminal knot when a free-swing loop is needed",
      "Oversized hardware stack killing motion",
      "Wrong hook orientation / snell geometry for the presentation",
      "Loop that already collapsed into a noose",
    ],
    checks: [
      "Hang the lure and watch for free movement at the eye",
      "Confirm whether the technique needs a fixed loop",
      "See whether a split ring is already doing the swing job",
      "Look for a noose tight on the eye — that is a collapsed loop",
    ],
    fixes: [
      "Retie with a non-slip / open loop family when free action is the job",
      "Use a tight terminal only when you want a solid, pinned connection",
      "Drop extra hardware if the stack is what killed the walk",
      "If the loop cinched, treat it as loop-collapsed — do not loosen it",
    ],
    retieWhen:
      "If action is the product, rebuild the connection for motion — don’t force a tight knot.",
    decideHint: "Mark free-swing / open action when deciding terminal knots.",
    sources: [
      {
        title: "Loop-knot field practice (Kreh / Rapala / Homer Rhode family)",
        note: "A tight terminal pins the eye; a non-slip loop is the action job.",
      },
    ],
  },
  {
    id: "hard-to-tie",
    domain: "both",
    group: "system",
    title: "I can’t tie it cleanly in the field",
    plain: "Wind, cold hands, low light, or complexity keeps producing messy results.",
    meaning:
      "Field-fit beats bench-perfect. A slightly lower “ideal” knot that you can seat cleanly is safer than a perfect FG you rush.",
    questions: [
      "Are hands cold, wet, or gloved?",
      "Is light poor or the boat moving?",
      "How often will you retie today?",
    ],
    likelyCauses: [
      "Advanced knot under bad field conditions",
      "Too many stages for frequent reties",
      "Proficiency gap on a high-skill join",
      "Wind or low light hiding a missed wrap",
    ],
    checks: [
      "Honestly rate your clean success rate in these conditions",
      "Count how many times you’ll retie this session",
      "Can you still see both exits and the tag?",
      "Are gloves or numb fingers hiding the dress?",
    ],
    fixes: [
      "Rank by field-tieability and retie speed, not folklore strength charts",
      "Practice the advanced option at home; fish the inspectable option today",
      "Declare cold / wind / low light so Decide can down-rank complexity",
      "Cut a messy result. Do not fish a guess.",
    ],
    retieWhen: "Any messy result under stress → cut and use a simpler valid knot.",
    decideHint: "Set cold hands / wind / low light / frequent reties before ranking.",
    sources: [
      {
        title: "Field-fit over bench-perfect",
        note: "A seated simple family beats a rushed advanced one. Not a strength claim.",
      },
    ],
  },
  {
    id: "unsure-setup",
    domain: "both",
    group: "system",
    title: "I’m not sure what I should be tying",
    plain: "You need a decision for this connection — not a library browse.",
    meaning:
      "Do not ask for the best knot until you know the job. Connection first, then materials and conditions.",
    questions: [
      "What two things are you joining?",
      "What materials and roughly how do diameters compare?",
      "Any hard constraints — guides, free lure action, tiny eyes?",
    ],
    likelyCauses: [
      "Starting from a knot name instead of a connection job",
      "Copying a friend’s knot without matching materials",
      "Treating strength % as a universal ranking",
      "No declared job, so nothing can fail closed",
    ],
    checks: [
      "Name the connection in plain words (line→hook, braid→leader, rope→cleat)",
      "Note materials on both sides",
      "Name the hard constraints — guides, free action, tiny eyes, cyclic tide",
      "Say whether you can still inspect the last connection",
    ],
    fixes: [
      "Run Decide with connection + materials + conditions",
      "Learn fewer knots well; expand only when a new job appears",
      "If the standing connection was a guess, cut it before the next load",
      "Do not browse the library hoping a name will decide for you",
    ],
    retieWhen: "If the current knot was a guess, cut it and decide properly before the next cast.",
    decideHint: "Start Decide from the connection — invalid options never get a score.",
    sources: [
      { title: "Instrument philosophy", note: "Connection first. A knot name is not a diagnosis." },
    ],
  },
];

export const FAILURE_PLAYS: FailurePlay[] = [...CORE, ...EXTRA_FAILURE_PLAYS];

export const BREAK_LOCATION_LABELS: Record<BreakLocation, string> = {
  "in-knot": "Broke inside the knot coils",
  "at-eye": "Broke or cut at the eye / hardware",
  "at-tag": "Failed at the tag / finish",
  "above-knot": "Line failed above the knot",
  "leader-join": "Failed at the leader / line join",
  "at-guides": "Cut or ticked at the guides",
  "at-shank": "Walked or failed on the shank",
  "at-loop": "Failed at the loop lock",
  "at-arbor": "Let go at the spool arbor",
  "in-leader": "Parted in the leader body",
  "at-fairlead": "Chafed at a fairlead / chock",
  "at-cleat": "Failed or jammed at the cleat",
  "at-tiptop": "Wrapped or cut at the tip-top",
  "at-winch": "Override / riding turn on the winch",
  unknown: "Not sure where it failed",
};

export const END_LOOK_LABELS: Record<EndLook, { label: string; hint: string }> = {
  "curly-pigtail": { label: "Curly / pigtail", hint: "classic slip" },
  "clean-diagonal": { label: "Clean diagonal", hint: "nick, teeth, or guide" },
  "glazed-melt": { label: "Glazed / melted", hint: "dry friction heat" },
  "fuzzy-frayed": { label: "Fuzzy / frayed", hint: "abrasion" },
  mushroomed: { label: "Mushroomed", hint: "crush or shock" },
  "knot-gone": { label: "Knot gone", hint: "walked off hardware" },
  "knot-still-on": { label: "Knot still on", hint: "line failed, knot held" },
};

export const SYMPTOM_GROUP_LABELS: Record<SymptomGroup, string> = {
  load: "Under load",
  forensic: "What you recovered",
  geometry: "Structure / action",
  system: "System",
  rope: "Rope work",
};

export function playsForDomain(id: DomainId): FailurePlay[] {
  return FAILURE_PLAYS.filter((p) => p.domain === "both" || p.domain === id);
}

export function getFailurePlay(id: FailureEvent): FailurePlay | undefined {
  return FAILURE_PLAYS.find((p) => p.id === id);
}
