/**
 * Layer 3.5 — Field troubleshoot engine
 * Symptom / break-location first → connection + materials refine causes.
 * Optional knot fingerprint last. Not a library filter.
 */
import {
  getFailurePlay,
  type BreakLocation,
  type EndLook,
  type FailureEvent,
} from "@/data/failure-playbook";
import { getKnot } from "@/data/catalog";
import { failsWhenFor } from "@/data/connection-model-meta";
import { runFinishedCheck } from "@/engine/diagnostics";
import type {
  CheckResult,
  ConnectionJob,
  DiameterRelation,
  FindingConfidence,
  Knot,
  LayeredFinding,
  LineMaterial,
  RetieDecision,
} from "@/domain/types";
import {
  APPLICATION_ID,
  CONNECTION_LABELS,
  DIAMETER_LABELS,
  ENGINE_VERSION,
  MATERIAL_LABELS,
} from "@/domain/types";

export interface TroubleshootInput {
  event: FailureEvent;
  breakLocation?: BreakLocation;
  /** Forensic look of the recovered end — not a knot name */
  endLook?: EndLook;
  connection?: ConnectionJob;
  mainMaterial?: LineMaterial;
  secondaryMaterial?: LineMaterial;
  diameterRelation?: DiameterRelation;
  knotId?: string;
  notes?: string;
  observations?: string[];
  coldHands?: boolean;
  windy?: boolean;
  lowLight?: boolean;
  /** Cyclic tide / surge — boating standing jobs, and surf on the fishing side */
  surge?: boolean;
}

export interface DiagnoseContextChip {
  kind:
    "event" | "location" | "look" | "connection" | "material" | "diameter" | "condition" | "knot";
  label: string;
  value: string;
}

export interface TroubleshootResult {
  generatedAt: string;
  applicationId: string;
  engineVersion: string;
  event: FailureEvent;
  title: string;
  plainSummary: string;
  meaning: string;
  likelyCauses: string[];
  checks: string[];
  fixes: string[];
  retieDecision: RetieDecision;
  retieLabel: string;
  confidence: FindingConfidence;
  breakLocationHint?: string;
  decideHint?: string;
  /** Prefill for Decide deep-link */
  decideSearch?: {
    connection?: ConnectionJob;
    mainMaterial?: LineMaterial;
    secondaryMaterial?: LineMaterial;
    diameterRelation?: DiameterRelation;
  };
  contextChips: DiagnoseContextChip[];
  contextSummary?: string;
  findings: LayeredFinding[];
  knotCheck?: CheckResult;
  relatedKnot?: Knot;
  /** Modelled failsWhen for the named knot — empty unless knotId was set. */
  failsWhen?: string[];
}

function fid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function uniq(arr: string[]) {
  const seen = new Set<string>();
  return arr.filter((x) => {
    if (seen.has(x)) return false;
    seen.add(x);
    return true;
  });
}

function isJoinConnection(c?: ConnectionJob): boolean {
  return (
    c === "braid-to-leader" ||
    c === "leader-to-leader" ||
    c === "leader-to-tippet" ||
    c === "double-line-to-leader" ||
    c === "fly-line-to-leader" ||
    c === "rope-to-rope" ||
    c === "unequal-rope-join"
  );
}

function isTerminalConnection(c?: ConnectionJob): boolean {
  return (
    c === "line-to-hook" ||
    c === "line-to-lure" ||
    c === "line-to-swivel" ||
    c === "hook-snell" ||
    c === "rope-to-cleat" ||
    c === "rope-to-bollard" ||
    c === "rope-to-ring"
  );
}

function locationOverlay(
  location: BreakLocation | undefined,
): { causes: string[]; checks: string[]; fixes: string[]; retie: RetieDecision } | null {
  if (!location || location === "unknown") return null;
  switch (location) {
    case "in-knot":
      return {
        causes: [
          "Crossed or uneven wraps concentrated stress inside the knot",
          "Knot family weak or slippery on this material",
          "Incomplete seat left open coils under peak load",
        ],
        checks: ["Look for melted/glazed coils (friction)", "Confirm wrap count and alignment"],
        fixes: ["Retie with lube + slow seat", "Change family if material is wrong"],
        retie: "retie-now",
      };
    case "at-eye":
      return {
        causes: [
          "Sharp or corroded eye cutting the line",
          "Gap at the eye / knot not butted to hardware",
          "Doubled line abrading on a rough eye",
        ],
        checks: ["Inspect eye with a fingernail for burrs", "Check for a gap between knot and eye"],
        fixes: ["Replace or dress hardware", "Reseat so the knot butts the eye cleanly"],
        retie: "retie-now",
      };
    case "at-tag":
      return {
        causes: ["Tag finish incomplete", "Tag too short to lock", "Tag path wrong for the knot"],
        checks: ["Tag orientation vs expected finish", "Whether tag moved under light load"],
        fixes: ["Retie with correct tag path and lock", "Leave enough tag before the final trim"],
        retie: "retie-now",
      };
    case "above-knot":
      return {
        causes: [
          "Nicked or abraded line above a sound knot",
          "Guide heat/abrasion or rock damage",
          "Old wind knot or crush from prior snag",
        ],
        checks: ["Run fingers far above the knot", "Look for curly mono / flat spots in braid"],
        fixes: [
          "Cut back past damage and retie on fresh line",
          "Do not blame the knot if the break is above it",
        ],
        retie: "retie-recommended",
      };
    case "leader-join":
      return {
        causes: [
          "Diameter mismatch without the right join family",
          "Barrels not butted / join not seated",
          "Join too bulky and stressed in guides",
        ],
        checks: ["Inspect both barrels and tags", "Confirm materials on main and leader"],
        fixes: [
          "Re-rank join options for materials + guides + field conditions",
          "Retie clean join",
        ],
        retie: "retie-now",
      };
    case "at-guides":
      return {
        causes: [
          "Chipped or grooved guide cutting the line on the cast or the run",
          "Bulk tick-stopping in the stripper and throwing slack",
          "Line already nicked, then parted at the first guide",
        ],
        checks: [
          "Cotton-ball every guide, starting at the stripper",
          "See whether the knot is still sitting on the hardware",
        ],
        fixes: [
          "Fix the guide before you blame the family",
          "Cut back past the nick and retie on fresh line",
        ],
        retie: "retie-recommended",
      };
    case "at-shank":
      return {
        causes: [
          "Snell wraps stacked or finished mid-shank",
          "Finish hitch let go and the column walked",
        ],
        checks: ["Wrap spacing to the eye", "Whether the hook still pulls on-axis"],
        fixes: ["Re-snell with even wraps to the eye, or change family if there is no shank"],
        retie: "retie-now",
      };
    case "at-loop":
      return {
        causes: [
          "Loop lock or handshake failed — collapse, girth, or open collar",
          "Return path was a slip path, not the intended lock",
        ],
        checks: ["Open loop vs noose", "Matching U-shapes on a handshake"],
        fixes: ["Cut a collapsed or cinched loop. Rebuild the lock path."],
        retie: "retie-now",
      };
    case "at-arbor":
      return {
        causes: [
          "Arbor hitch facing the wrong way for retrieve",
          "Slick spool, too few turns, no tape",
        ],
        checks: ["Anything still on the arbor?", "Hitch direction vs spool rotation"],
        fixes: ["Re-make the arbor tie before the next cast"],
        retie: "retie-now",
      };
    case "in-leader":
      return {
        causes: [
          "Teeth, gill plate, or nick in the leader body — the knot may be innocent",
          "Shock or bite section too short or too light",
        ],
        checks: ["How far above the eye did it part?", "Trail of nicks along the leader?"],
        fixes: [
          "Do not change knot family to fix a bite-off",
          "Rebuild the leader / bite system on undamaged line",
        ],
        retie: "retie-recommended",
      };
    case "at-fairlead":
      return {
        causes: [
          "Unprotected lead sawing in a chock or fairlead",
          "Line working the same meaty spot on every surge",
        ],
        checks: ["Inspect the line at every fairlead, not just the hitch", "Chafe gear present?"],
        fixes: ["Cut out thinned line, protect the lead, then remake the hitch"],
        retie: "retie-recommended",
      };
    case "at-cleat":
      return {
        causes: [
          "First turn on the near horn, or a lock that welded under surge",
          "Extra figure-eights piled into a jam — or no lock at all, so the line dumped",
        ],
        checks: [
          "Can you still break the lock by hand?",
          "Far horn first? Anything still on the horns?",
        ],
        fixes: ["Take the load on another line, then remake a lock that still casts off"],
        retie: "retie-now",
      };
    case "at-tiptop":
      return {
        causes: [
          "A loop wrapped the tip-top on the cast and scored or cut the line",
          "Tip-top insert already chipped — the wrap finished the cut",
        ],
        checks: [
          "Inspect the tip-top insert, not just the stripper",
          "Is the terminal knot still dressed? Then the family is usually innocent",
        ],
        fixes: [
          "Cut back past the wrap score",
          "Do not re-rank the terminal family until the tip is sound",
        ],
        retie: "retie-recommended",
      };
    case "at-winch":
      return {
        causes: [
          "A later turn rode over an earlier one — a riding turn, not a failed sheet knot",
          "Lead into the drum from the wrong angle, or a slack tail on a surge",
        ],
        checks: ["Drum stack vs override", "Is the sheet still loaded? Do not put hands in it"],
        fixes: [
          "Take the load with a gripping hitch to another winch, then unwind",
          "Do not cut a loaded sheet to ‘fix the knot’",
        ],
        retie: "retie-recommended",
      };
    default:
      return null;
  }
}

/** Material system overlays — elevated when chips are set */
function materialOverlay(
  main?: LineMaterial,
  secondary?: LineMaterial,
  event?: FailureEvent,
): { causes: string[]; checks: string[]; fixes: string[] } {
  const causes: string[] = [];
  const checks: string[] = [];
  const fixes: string[] = [];
  if (!main && !secondary) return { causes, checks, fixes };

  if (main === "braid" || secondary === "braid") {
    causes.push("Slick braid punishes under-wraps and knots that need surface grip");
    checks.push("Count wraps against a braid-aware minimum for this family");
    fixes.push("Use a braid-capable family or add wraps / lock stages the knot requires");
    if (event === "slipped-or-pulled" || event === "self-cut") {
      causes.push("Braid slip is usually finish + wrap count, not “bad luck”");
      if (event === "self-cut") {
        causes.push("Braid doubled over a sharp split ring is a common self-cut, not a slip");
      }
    }
  }
  if (main === "fluoro" || secondary === "fluoro") {
    causes.push("Stiff fluorocarbon fights small-radius wraps and dry final cinches");
    checks.push("Look for flat spots / glazing from friction heat on fluoro coils");
    fixes.push("Lubricate before the final seat; slow the last pull on fluoro");
  }
  if (main === "mono" || secondary === "mono") {
    causes.push("Dry monofilament cinches can glaze and weaken at the coils");
    checks.push("Feel for heat-glazed or curly mono near the failure");
    fixes.push("Moisten mono before seating; retie past any glazed section");
  }
  if (main === "braid" && (secondary === "fluoro" || secondary === "mono")) {
    causes.push("Braid → leader diameter mismatch is a frequent join failure driver");
    checks.push("Compare main vs leader diameter and whether the join family matches that gap");
    fixes.push("Re-decide the join with diameter relation set (not just the familiar knot name)");
  }
  if (main === "wire" || secondary === "wire") {
    causes.push("Wire connections need wire-specific geometry — soft-line knots often fail closed");
    fixes.push("Do not force a mono/braid terminal family onto wire without a wire-capable method");
  }
  if (main === "fly-line" || secondary === "fly-line") {
    causes.push(
      "Fly-line cores and coatings change grip — nail/loop joins behave differently than tippet knots",
    );
    checks.push("Confirm you are diagnosing the fly-line join, not the tippet terminal");
  }
  if (main === "dyneema" || secondary === "dyneema") {
    causes.push("HMPE / Dyneema is slick — many hitches that hold on polyester walk here");
    checks.push("Ask whether this fibre is even valid for the hitch you used");
    fixes.push(
      "HMPE usually wants a splice or a hitch tested on HMPE — not another pretty rolling hitch",
    );
    if (event === "grip-slipped" || event === "walked-off" || event === "stopper-pulled") {
      causes.push(
        "Animated Knots warns a rolling hitch will not hold in Dyneema / Spectra / polypro",
      );
    }
  }
  if (main === "polypropylene" || secondary === "polypropylene") {
    causes.push("Polypropylene is slick and meats fast — chafe and walk-off show up early");
  }
  if ((main === "nylon" || secondary === "nylon") && event === "shock-parted") {
    causes.push(
      "Nylon soaks surge until it is too short, old, or UV-burnt — then it snaps in the standing part",
    );
  }
  return { causes, checks, fixes };
}

function connectionOverlay(
  connection?: ConnectionJob,
  event?: FailureEvent,
): { causes: string[]; checks: string[]; fixes: string[] } {
  const causes: string[] = [];
  const checks: string[] = [];
  const fixes: string[] = [];
  if (!connection) return { causes, checks, fixes };

  if (isTerminalConnection(connection)) {
    causes.push(
      "Terminal failures often track eye geometry, tag finish, and seating at the hardware",
    );
    checks.push("Inspect the eye/ring and how the knot butts the hardware");
    if (event === "dead-action" && connection === "line-to-lure") {
      causes.push("A tight terminal against the eye can kill free-swing lure action");
      fixes.push("If action is the job, rebuild with a non-slip / open loop family");
    }
    if (connection === "hook-snell") {
      causes.push("Snell failures often start as uneven shank wraps or a weak finish hitch");
      checks.push("Check shank wrap spacing and finish security");
    }
    if (event === "self-cut") {
      causes.push(
        "A doubled terminal over a sharp ring, or crossed coils, cuts the line at the first hard turn",
      );
      checks.push("Fingernail the split ring. Look for an X in the coils");
    }
  }
  if (isJoinConnection(connection)) {
    causes.push(
      "Join failures are about barrels, diameter relation, and guide stress — not terminal folklore",
    );
    checks.push("Inspect both barrels/tags and whether the join was fully butted");
    if (event === "bulky-guides") {
      causes.push("This connection must survive guide passage; bulk is a primary constraint");
      fixes.push("Rank joins with guide passage on — bulk should not win silently");
    }
    if (connection === "braid-to-leader") {
      fixes.push(
        "For braid→leader, re-rank FG / Alberto / Double Uni by skill, weather, and guides",
      );
    }
  }
  if (connection === "line-to-loop" || connection === "loop-to-loop") {
    causes.push(
      "Loop geometry failures show as collapse, twist, or tag path errors in the loop lock",
    );
    checks.push("Confirm loop shape is open/stable and the lock stage seated");
  }
  if (connection === "line-to-spool") {
    causes.push(
      "Arbor/spool ties fail when the stopper or hitch does not bite the arbor under load",
    );
    checks.push("Confirm the arbor knot/hitch orientation on the spool");
  }
  if (connection === "hook-snell") {
    causes.push("Snell geometry fails as off-axis pull when wraps walk the shank");
  }
  if (connection === "fly-line-to-leader") {
    causes.push("Fly-line joins fail at coating and core, not like tippet knots");
    checks.push("Inspect coating immediately behind the coil or factory loop");
  }
  if (connection === "loop-to-loop") {
    causes.push("A handshake that cinches is a girth hitch — one loop cutting the other");
    fixes.push("Matching U-shapes only. Undo a girth. Replace crushed coating.");
  }
  if (connection === "rope-to-cleat") {
    causes.push("A working cleat hitch that cannot cast off is already the wrong finish");
    checks.push("Far horn first, lock that still breaks by hand");
  }
  if (connection === "rope-to-bollard" || connection === "rope-to-ring") {
    causes.push("Cyclic tide walks a hitch that never took a round turn");
  }
  if (connection === "fixed-eye") {
    causes.push("An undressed eye can capsize into a weaker structure");
  }
  if (connection === "unequal-rope-join") {
    causes.push("A single sheet bend on unequal or slick lines is a known slip");
    fixes.push("Double the bend, or pick a join built for the step");
  }
  if (connection === "stopper") {
    causes.push("A stopper that slims or undersizes the hole will pull through");
  }
  if (connection === "load-transfer") {
    causes.push(
      "A gripping hitch that slides is not transferring load — fibre and the extra crossed turn matter",
    );
    checks.push("How far did it travel? Pretty turns or the ugly crossed bite?");
    if (event === "grip-slipped") {
      fixes.push("On HMPE change family. On polyester remake the ugly rolling hitch and test-pull");
    }
    if (event === "riding-turn") {
      fixes.push("The gripping hitch is the tool to unload the drum — not a new sheet knot");
    }
  }
  if (connection === "reef-or-bind") {
    causes.push("A reef / square knot used as a bend spills — that job is bind, not join");
    fixes.push("If you were joining two ropes, change to a bend. Do not retie a reef as a bend");
  }
  if (connection === "double-line-to-leader" || connection === "line-to-loop") {
    if (event === "double-line-unravelled") {
      causes.push(
        "The double line walked — diagnose the loop/twists, not the leader join beyond it",
      );
      checks.push("Twist count and lock hitch on this fibre, before you touch the join");
    }
  }
  return { causes, checks, fixes };
}

function diameterOverlay(
  diameter?: DiameterRelation,
  connection?: ConnectionJob,
): { causes: string[]; checks: string[]; fixes: string[] } {
  const causes: string[] = [];
  const checks: string[] = [];
  const fixes: string[] = [];
  if (!diameter || !isJoinConnection(connection)) return { causes, checks, fixes };

  if (diameter === "main-much-thinner" || diameter === "extreme-mismatch") {
    causes.push("Large diameter mismatch needs a join family built for unequal lines");
    checks.push("Confirm the thinner side got enough wraps / correct re-entry for this join");
    fixes.push("Do not reuse a similar-diameter join technique on a big mismatch");
  }
  if (diameter === "main-thinner") {
    causes.push("Slightly thinner main still needs balanced wrap count on the thinner leg");
  }
  if (diameter === "similar") {
    checks.push(
      "On similar diameters, look for equal barrel quality and clean butt-together seating",
    );
  }
  return { causes, checks, fixes };
}

function endLookOverlay(look?: EndLook): { causes: string[]; checks: string[]; fixes: string[] } {
  const causes: string[] = [];
  const checks: string[] = [];
  const fixes: string[] = [];
  if (!look) return { causes, checks, fixes };
  if (look === "curly-pigtail") {
    causes.push(
      "Curly / pigtail stub is standing slip evidence — the connection walked, it did not break clean",
    );
    checks.push("Hardware empty? Springy curl vs glazed melt?");
    fixes.push("Treat this as a slip. Do not re-cinch the stub.");
  }
  if (look === "glazed-melt") {
    causes.push("Glazed or melted curl is friction heat from a dry final cinch");
    checks.push("Look for a question-mark melt, not just a springy corkscrew");
    fixes.push("Wet the next seat. One slow pull. Cut past any glaze.");
  }
  if (look === "clean-diagonal") {
    causes.push(
      "A clean diagonal is usually a nick, guide, teeth, or sharp eye — not a slipped knot",
    );
    checks.push("Is the knot still on the hardware? Then the family held.");
    fixes.push("Find the cutting surface before you change knot family.");
  }
  if (look === "fuzzy-frayed") {
    causes.push("Fuzzy or frayed parting is abrasion, not wrap-count folklore");
    checks.push("How far above the connection is the fuzz?");
    fixes.push("Cut back into clean line. Fix the abrasive surface.");
  }
  if (look === "mushroomed") {
    causes.push("A mushroomed end is crush or shock at a hard turn, not a slip");
    checks.push("Was the line pinched in a hatch, clip, or clutch?");
  }
  if (look === "knot-gone") {
    causes.push("Hardware empty and the knot gone is a complete walk-off");
    fixes.push("Retie a family that locks on this material. Count wraps.");
  }
  if (look === "knot-still-on") {
    causes.push("Knot still dressed on the hardware means the family likely held — look upstream");
    checks.push("Guides, leader body, teeth, opened eye");
    fixes.push("Do not change family until the upstream cut is explained.");
  }
  return { causes, checks, fixes };
}

function conditionOverlay(input: TroubleshootInput): {
  causes: string[];
  checks: string[];
  fixes: string[];
} {
  const causes: string[] = [];
  const checks: string[] = [];
  const fixes: string[] = [];
  if (input.coldHands) {
    causes.push("Cold or wet hands hide a missed wrap and rush the seat");
    checks.push("Did you count wraps, or guess them with numb fingers?");
    fixes.push("Pick a family you can seat with gloves off. Field-fit beats bench-perfect.");
  }
  if (input.windy) {
    causes.push("Wind throws slack, under-wraps, and wind knots in standing line");
    fixes.push("Shorten the working length. Face downwind. Simpler family if you must retie now.");
  }
  if (input.lowLight) {
    causes.push(
      "Low light hides tag path and coil stack — most night failures start as an unseen miss",
    );
    checks.push("Can you still see both exits and the tag?");
    fixes.push("Use a headlamp on the knot, or a more inspectable family.");
  }
  if (input.surge) {
    causes.push(
      "Cyclic surge walks a hitch that never took a round turn and saws the same spot in a chock",
    );
    checks.push("Was this left working through a tide change or a set of rollers?");
    fixes.push(
      "A standing job needs a make-fast that takes cyclic load — not another half-hitch on a clove",
    );
  }
  return { causes, checks, fixes };
}

function eventRetie(event: FailureEvent): RetieDecision {
  const now: FailureEvent[] = [
    "broke-under-load",
    "slipped-or-pulled",
    "wont-seat",
    "pigtail-left",
    "loop-collapsed",
    "join-walked",
    "girth-cinched",
    "shank-walked",
    "coating-peeled",
    "arbor-slipped",
    "walked-off",
    "capsized",
    "jammed-uncleatable",
    "unequal-slip",
    "stopper-pulled",
    "self-cut",
    "double-line-unravelled",
    "reef-spilled",
    "grip-slipped",
    "cleat-dumped",
  ];
  if (now.includes(event)) return "retie-now";
  if (event === "unsure-setup") return "cannot-verify";
  return "retie-recommended";
}

function buildContextChips(
  input: TroubleshootInput,
  playTitle: string,
  knot?: Knot,
): DiagnoseContextChip[] {
  const chips: DiagnoseContextChip[] = [{ kind: "event", label: "Problem", value: playTitle }];
  if (input.breakLocation && input.breakLocation !== "unknown") {
    chips.push({
      kind: "location",
      label: "Where",
      value: input.breakLocation.replace(/-/g, " "),
    });
  }
  if (input.endLook) {
    chips.push({
      kind: "look",
      label: "End",
      value: input.endLook.replace(/-/g, " "),
    });
  }
  if (input.connection) {
    chips.push({
      kind: "connection",
      label: "Connection",
      value: CONNECTION_LABELS[input.connection],
    });
  }
  if (input.mainMaterial) {
    const mat =
      input.secondaryMaterial && input.secondaryMaterial !== input.mainMaterial
        ? `${MATERIAL_LABELS[input.mainMaterial]} → ${MATERIAL_LABELS[input.secondaryMaterial]}`
        : MATERIAL_LABELS[input.mainMaterial];
    chips.push({ kind: "material", label: "Materials", value: mat });
  }
  if (input.diameterRelation && isJoinConnection(input.connection)) {
    chips.push({
      kind: "diameter",
      label: "Diameters",
      value: DIAMETER_LABELS[input.diameterRelation],
    });
  }
  if (input.coldHands) chips.push({ kind: "condition", label: "Hands", value: "cold / wet" });
  if (input.windy) chips.push({ kind: "condition", label: "Wind", value: "wind" });
  if (input.lowLight) chips.push({ kind: "condition", label: "Light", value: "low light" });
  if (input.surge) chips.push({ kind: "condition", label: "Load", value: "surge / tide" });
  if (knot) {
    chips.push({ kind: "knot", label: "Knot used", value: knot.name });
  }
  return chips;
}

export function runTroubleshoot(input: TroubleshootInput): TroubleshootResult {
  const play = getFailurePlay(input.event);
  if (!play) {
    throw new Error(`Unknown failure event: ${input.event}`);
  }

  const overlay = locationOverlay(input.breakLocation);
  const mat = materialOverlay(input.mainMaterial, input.secondaryMaterial, input.event);
  const conn = connectionOverlay(input.connection, input.event);
  const dia = diameterOverlay(input.diameterRelation, input.connection);
  const look = endLookOverlay(input.endLook);
  const cond = conditionOverlay(input);

  // Priority: forensic look and location first, then material / connection / conditions
  const likelyCauses = [
    ...look.causes,
    ...mat.causes,
    ...conn.causes,
    ...dia.causes,
    ...cond.causes,
    ...(overlay?.causes ?? []),
    ...play.likelyCauses,
  ];
  const checks = [
    ...look.checks,
    ...mat.checks,
    ...conn.checks,
    ...dia.checks,
    ...cond.checks,
    ...(overlay?.checks ?? []),
    ...play.checks,
  ];
  const fixes = [
    ...look.fixes,
    ...mat.fixes,
    ...conn.fixes,
    ...dia.fixes,
    ...cond.fixes,
    ...(overlay?.fixes ?? []),
    ...play.fixes,
  ];

  let retieDecision: RetieDecision = overlay?.retie ?? eventRetie(input.event);
  const evRank = eventRetie(input.event);
  const rank: Record<RetieDecision, number> = {
    cosmetic: 0,
    watch: 1,
    "retie-recommended": 2,
    "retie-now": 3,
    "cannot-verify": 4,
  };
  if (rank[evRank] > rank[retieDecision]) retieDecision = evRank;
  // A knot still on the hardware plus a clean cut / bite-off should not force retie-now on the family
  if (
    (input.endLook === "knot-still-on" ||
      input.event === "bitten-off" ||
      input.event === "hardware-opened" ||
      input.event === "clean-sever" ||
      input.event === "tip-wrap" ||
      input.event === "riding-turn" ||
      input.event === "shock-parted") &&
    (input.breakLocation === "above-knot" ||
      input.breakLocation === "at-guides" ||
      input.breakLocation === "in-leader" ||
      input.breakLocation === "at-tiptop" ||
      input.breakLocation === "at-winch" ||
      input.event === "hardware-opened" ||
      input.event === "bitten-off" ||
      input.event === "tip-wrap" ||
      input.event === "riding-turn" ||
      input.event === "shock-parted")
  ) {
    if (retieDecision === "retie-now") retieDecision = "retie-recommended";
  }

  const findings: LayeredFinding[] = [
    {
      id: fid("play"),
      severity: retieDecision === "retie-now" ? "stop" : "watch",
      title: play.title,
      observation: play.plain,
      implication: play.meaning,
      nextAction: play.retieWhen,
      rationale: "Field failure playbook — symptom first, knot name second.",
      confidence: "high",
      category: "diagnostics",
    },
  ];

  if (input.breakLocation && input.breakLocation !== "unknown") {
    findings.push({
      id: fid("loc"),
      severity: "stop",
      title: "Break location changes the fix",
      observation: `Failure location: ${input.breakLocation}`,
      implication: "Treat line damage, eye cuts, and in-knot failures as different problems.",
      nextAction: fixes[0] ?? play.retieWhen,
      rationale: "Where it failed is stronger evidence than which knot name you intended.",
      confidence: "high",
      category: "diagnostics",
    });
  }

  if (input.endLook) {
    findings.push({
      id: fid("look"),
      severity:
        input.endLook === "knot-still-on" || input.endLook === "clean-diagonal" ? "watch" : "stop",
      title: "The recovered end is evidence",
      observation: `End look: ${input.endLook.replace(/-/g, " ")}`,
      implication:
        "Pigtail is slip. Clean cut is nick, teeth, or guide. Fuzzy is abrasion. Knot still on means look upstream.",
      nextAction: look.fixes[0] ?? play.retieWhen,
      rationale: "Cited field forensics — not a knot-name guess.",
      confidence: "high",
      category: "diagnostics",
    });
  }

  if (input.connection || input.mainMaterial) {
    const bits = [
      input.connection ? CONNECTION_LABELS[input.connection] : null,
      input.mainMaterial
        ? input.secondaryMaterial
          ? `${MATERIAL_LABELS[input.mainMaterial]} / ${MATERIAL_LABELS[input.secondaryMaterial]}`
          : MATERIAL_LABELS[input.mainMaterial]
        : null,
      input.diameterRelation && isJoinConnection(input.connection)
        ? DIAMETER_LABELS[input.diameterRelation]
        : null,
    ].filter(Boolean);
    findings.push({
      id: fid("ctx"),
      severity: "info",
      title: "Setup context applied",
      observation: bits.join(" · "),
      implication: "Causes and fixes are weighted for this connection and material system.",
      nextAction:
        "If context is wrong, re-run with corrected chips — do not trust a mis-framed diagnosis.",
      rationale: "Connection + materials are field evidence, not library filters.",
      confidence: "high",
      category: "material",
    });
  }

  let knotCheck: CheckResult | undefined;
  let relatedKnot: Knot | undefined;
  let namedFailsWhen: string[] | undefined;
  let confidence: FindingConfidence = "moderate";

  // Context chips raise confidence; full knot fingerprint can raise further
  if (input.connection && input.mainMaterial) {
    confidence = "high";
  } else if (input.connection || input.mainMaterial) {
    confidence = "moderate";
  }

  if (input.knotId) {
    relatedKnot = getKnot(input.knotId);
    if (relatedKnot) {
      namedFailsWhen = failsWhenFor(relatedKnot.id, relatedKnot.commonMistakes);
      likelyCauses.push(...namedFailsWhen);
      findings.push({
        id: fid("fail"),
        severity: "watch",
        title: `${relatedKnot.name} — modelled failure modes`,
        observation: namedFailsWhen.slice(0, 4).join(" · "),
        implication:
          "These are when this family is known to fail. The recovered end still outranks the name.",
        nextAction: "Check these modes against what you still have in hand.",
        rationale: "Connection model failsWhen — not a library lookup.",
        confidence: "high",
        category: "diagnostics",
      });
      knotCheck = runFinishedCheck(relatedKnot, {
        knotId: relatedKnot.id,
        observations: input.observations ?? [],
        symptom: [play.title, input.notes].filter(Boolean).join(" — "),
        focusOk: true,
        criticalStructureVisible: true,
        bothExitsVisible: true,
        tagVisible: true,
      });
      const rank: Record<RetieDecision, number> = {
        cosmetic: 0,
        watch: 1,
        "retie-recommended": 2,
        "retie-now": 3,
        "cannot-verify": 4,
      };
      if (rank[knotCheck.retieDecision] > rank[retieDecision]) {
        retieDecision = knotCheck.retieDecision;
      }
      findings.push(...knotCheck.findings.slice(0, 4));
      confidence = knotCheck.diagnosticConfidence;
      for (const rule of relatedKnot.diagnostics) {
        const hay = `${rule.symptom} ${input.notes ?? ""} ${play.title}`.toLowerCase();
        if (
          hay.includes(rule.symptom.toLowerCase().slice(0, 12)) ||
          (input.notes &&
            rule.symptom
              .toLowerCase()
              .split(/\s+/)
              .some((w) => w.length > 4 && input.notes!.toLowerCase().includes(w)))
        ) {
          likelyCauses.push(...rule.likelyCauses);
          checks.push(...rule.checks);
          fixes.push(...rule.fixes);
        }
      }
    }
  }

  if (input.notes?.trim()) {
    findings.push({
      id: fid("notes"),
      severity: "info",
      title: "Your field notes",
      observation: input.notes.trim(),
      implication: "Notes steer which causes we emphasize; they do not invent a pass.",
      nextAction: "Use the checks list against what you can still see on the line.",
      rationale: "Angler report is evidence, not a score.",
      confidence: "moderate",
      category: "diagnostics",
    });
  }

  const retieLabel =
    retieDecision === "retie-now"
      ? "Cut it off and retie — do not fish this connection"
      : retieDecision === "retie-recommended"
        ? "Retie recommended before you trust the next cast"
        : retieDecision === "cannot-verify"
          ? "Not enough to clear this connection — decide properly or retie"
          : retieDecision === "watch"
            ? "Watch closely; re-inspect after the next load"
            : "Cosmetic only — still re-check after a hard pull";

  const contextChips = buildContextChips(input, play.title, relatedKnot);
  const contextSummary =
    contextChips.length > 1 ? contextChips.map((c) => c.value).join(" · ") : undefined;

  let decideHint = play.decideHint;
  if (input.connection && input.mainMaterial) {
    decideHint =
      play.decideHint ??
      "Re-run Decide with this same connection and materials so Layer 1 can eliminate invalid families.";
  } else if (!input.connection || !input.mainMaterial) {
    decideHint =
      play.decideHint ??
      "Add connection + materials chips next time for a sharper diagnosis — or open Decide to pick the next knot properly.";
  }

  const decideSearch =
    input.connection || input.mainMaterial
      ? {
          connection: input.connection,
          mainMaterial: input.mainMaterial,
          secondaryMaterial: input.secondaryMaterial,
          diameterRelation: input.diameterRelation,
        }
      : undefined;

  return {
    generatedAt: new Date().toISOString(),
    applicationId: APPLICATION_ID,
    engineVersion: ENGINE_VERSION,
    event: input.event,
    title: play.title,
    plainSummary: `${play.title}. ${play.retieWhen}`,
    meaning: play.meaning,
    likelyCauses: uniq([...(namedFailsWhen ?? []), ...likelyCauses]).slice(0, 10),
    checks: uniq(checks).slice(0, 10),
    fixes: uniq(fixes).slice(0, 10),
    retieDecision,
    retieLabel,
    confidence,
    breakLocationHint: overlay
      ? "Break location refined the likely causes above."
      : input.event === "broke-under-load"
        ? "If you can still see the ends, pick a break location for a sharper fix."
        : undefined,
    decideHint,
    decideSearch,
    contextChips,
    contextSummary,
    findings,
    knotCheck,
    relatedKnot,
    failsWhen: namedFailsWhen,
  };
}
