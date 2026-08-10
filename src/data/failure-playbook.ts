/**
 * Field failure playbook — "why isn't this working?"
 * Independent of Knot Finder library filtering. Connection-first diagnosis.
 */

export type FailureEvent =
  | "broke-under-load"
  | "slipped-or-pulled"
  | "wont-seat"
  | "keeps-failing"
  | "bulky-guides"
  | "dead-action"
  | "hard-to-tie"
  | "unsure-setup";

export type BreakLocation =
  | "in-knot"
  | "at-eye"
  | "at-tag"
  | "above-knot"
  | "leader-join"
  | "unknown";

export interface FailurePlay {
  id: FailureEvent;
  title: string;
  plain: string;
  /** What this usually means mechanically */
  meaning: string;
  /** First questions to ask yourself */
  questions: string[];
  /** Likely root causes (ranked for field use) */
  likelyCauses: string[];
  /** Immediate checks */
  checks: string[];
  /** Concrete fixes */
  fixes: string[];
  /** When to cut and start over */
  retieWhen: string;
  /** Soft link into Decide path */
  decideHint?: string;
  breakLocations?: BreakLocation[];
}

export const FAILURE_PLAYS: FailurePlay[] = [
  {
    id: "broke-under-load",
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
    decideHint: "If the same knot keeps failing on this material, pick a better family for the connection.",
    breakLocations: ["in-knot", "at-eye", "at-tag", "above-knot", "leader-join", "unknown"],
  },
  {
    id: "slipped-or-pulled",
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
    ],
    fixes: [
      "Retie with correct wrap count and a deliberate seat",
      "On joins, match family to diameter relation (not just “what I know”)",
      "For braid→leader, prefer a proven join (FG / Alberto / Double Uni by conditions)",
    ],
    retieWhen: "Any visible slip under a test pull means cut it off.",
    decideHint: "Slip-prone materials need a different ranking than “easy terminal knots.”",
  },
  {
    id: "wont-seat",
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
    ],
    fixes: [
      "Cut off and retie — do not force a half-seated knot",
      "Switch to a compact single-pass terminal if the eye is tiny",
      "Slow the last pull; keep wraps aligned with a thumbnail",
    ],
    retieWhen: "If it does not seat cleanly, it is not finished. Retie now.",
  },
  {
    id: "keeps-failing",
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
    ],
    fixes: [
      "Run Decide for this exact connection + materials + conditions",
      "Switch hardware if the eye is sharp or undersized",
      "Pick a more inspectable knot when light or hands are bad",
    ],
    retieWhen: "Stop stacking identical retries. Change the system, then retie.",
    decideHint: "Use Decide so Layer 1 can eliminate knots that should never have been candidates.",
  },
  {
    id: "bulky-guides",
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
    ],
    fixes: [
      "For braid→leader that must cast through guides, prefer slim joins when skill allows",
      "If you need speed in bad weather, accept a bulkier but reliable join and manage leader length",
      "Keep tags short and clean after inspection",
    ],
    retieWhen: "If it hangs every cast, cut and rebuild with a guide-aware choice.",
    decideHint: "Turn on “must pass guides” when ranking — bulk should not win silently.",
  },
  {
    id: "dead-action",
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
    ],
    checks: [
      "Hang the lure and watch for free movement at the eye",
      "Confirm whether the technique needs a fixed loop",
    ],
    fixes: [
      "Retie with a non-slip / open loop family when free action is the job",
      "Use a tight terminal only when you want a solid, pinned connection",
    ],
    retieWhen: "If action is the product, rebuild the connection for motion — don’t force a tight knot.",
    decideHint: "Mark free-swing / open action when deciding terminal knots.",
  },
  {
    id: "hard-to-tie",
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
    ],
    checks: [
      "Honestly rate your clean success rate in these conditions",
      "Count how many times you’ll retie this session",
    ],
    fixes: [
      "Rank by field-tieability and retie speed, not folklore strength charts",
      "Practice the advanced option at home; fish the inspectable option today",
    ],
    retieWhen: "Any messy result under stress → cut and use a simpler valid knot.",
    decideHint: "Set cold hands / wind / low light / frequent reties before ranking.",
  },
  {
    id: "unsure-setup",
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
    ],
    checks: [
      "Name the connection in plain words (line→hook, braid→leader, etc.)",
      "Note materials on both sides",
    ],
    fixes: [
      "Run Decide with connection + materials + conditions",
      "Learn fewer knots well; expand only when a new job appears",
    ],
    retieWhen: "If the current knot was a guess, cut it and decide properly before the next cast.",
    decideHint: "Start Decide from the connection — invalid options never get a score.",
  },
];

export const BREAK_LOCATION_LABELS: Record<BreakLocation, string> = {
  "in-knot": "Broke inside the knot coils",
  "at-eye": "Broke or cut at the eye / hardware",
  "at-tag": "Failed at the tag / finish",
  "above-knot": "Line failed above the knot",
  "leader-join": "Failed at the leader / line join",
  unknown: "Not sure where it failed",
};

export function getFailurePlay(id: FailureEvent): FailurePlay | undefined {
  return FAILURE_PLAYS.find((p) => p.id === id);
}
