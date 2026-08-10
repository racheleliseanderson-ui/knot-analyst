/**
 * Layer 3.5 — Field troubleshoot engine
 * Symptom / break-location first → connection + materials refine causes.
 * Optional knot fingerprint last. Not a library filter.
 */
import { getFailurePlay, type BreakLocation, type FailureEvent } from "@/data/failure-playbook";
import { getKnot } from "@/data/catalog";
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
  /** Connection job under stress — chips on every failure path */
  connection?: ConnectionJob;
  mainMaterial?: LineMaterial;
  secondaryMaterial?: LineMaterial;
  diameterRelation?: DiameterRelation;
  knotId?: string;
  notes?: string;
  observations?: string[];
}

export interface DiagnoseContextChip {
  kind: "event" | "location" | "connection" | "material" | "diameter" | "knot";
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
    c === "fly-line-to-leader"
  );
}

function isTerminalConnection(c?: ConnectionJob): boolean {
  return (
    c === "line-to-hook" ||
    c === "line-to-lure" ||
    c === "line-to-swivel" ||
    c === "hook-snell"
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
    if (event === "slipped-or-pulled") {
      causes.push("Braid slip is usually finish + wrap count, not “bad luck”");
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
    causes.push("Fly-line cores and coatings change grip — nail/loop joins behave differently than tippet knots");
    checks.push("Confirm you are diagnosing the fly-line join, not the tippet terminal");
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
    causes.push("Terminal failures often track eye geometry, tag finish, and seating at the hardware");
    checks.push("Inspect the eye/ring and how the knot butts the hardware");
    if (event === "dead-action" && connection === "line-to-lure") {
      causes.push("A tight terminal against the eye can kill free-swing lure action");
      fixes.push("If action is the job, rebuild with a non-slip / open loop family");
    }
    if (connection === "hook-snell") {
      causes.push("Snell failures often start as uneven shank wraps or a weak finish hitch");
      checks.push("Check shank wrap spacing and finish security");
    }
  }
  if (isJoinConnection(connection)) {
    causes.push("Join failures are about barrels, diameter relation, and guide stress — not terminal folklore");
    checks.push("Inspect both barrels/tags and whether the join was fully butted");
    if (event === "bulky-guides") {
      causes.push("This connection must survive guide passage; bulk is a primary constraint");
      fixes.push("Rank joins with guide passage on — bulk should not win silently");
    }
    if (connection === "braid-to-leader") {
      fixes.push("For braid→leader, re-rank FG / Alberto / Double Uni by skill, weather, and guides");
    }
  }
  if (connection === "line-to-loop" || connection === "loop-to-loop") {
    causes.push("Loop geometry failures show as collapse, twist, or tag path errors in the loop lock");
    checks.push("Confirm loop shape is open/stable and the lock stage seated");
  }
  if (connection === "line-to-spool") {
    causes.push("Arbor/spool ties fail when the stopper or hitch does not bite the arbor under load");
    checks.push("Confirm the arbor knot/hitch orientation on the spool");
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
    checks.push("On similar diameters, look for equal barrel quality and clean butt-together seating");
  }
  return { causes, checks, fixes };
}

function buildContextChips(input: TroubleshootInput, playTitle: string, knot?: Knot): DiagnoseContextChip[] {
  const chips: DiagnoseContextChip[] = [
    { kind: "event", label: "Problem", value: playTitle },
  ];
  if (input.breakLocation && input.breakLocation !== "unknown") {
    chips.push({
      kind: "location",
      label: "Where",
      value: input.breakLocation.replace(/-/g, " "),
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

  // Priority order: location → material → connection → diameter → generic play
  // Material/connection first in the list so chip-driven insight shows at top
  const likelyCauses = [
    ...mat.causes,
    ...conn.causes,
    ...dia.causes,
    ...(overlay?.causes ?? []),
    ...play.likelyCauses,
  ];
  const checks = [
    ...mat.checks,
    ...conn.checks,
    ...dia.checks,
    ...(overlay?.checks ?? []),
    ...play.checks,
  ];
  const fixes = [
    ...mat.fixes,
    ...conn.fixes,
    ...dia.fixes,
    ...(overlay?.fixes ?? []),
    ...play.fixes,
  ];

  let retieDecision: RetieDecision = overlay?.retie ?? "retie-recommended";
  if (
    input.event === "wont-seat" ||
    input.event === "slipped-or-pulled" ||
    input.event === "broke-under-load"
  ) {
    retieDecision = "retie-now";
  }
  if (input.event === "unsure-setup") {
    retieDecision = "cannot-verify";
  }
  if (
    input.event === "dead-action" ||
    input.event === "bulky-guides" ||
    input.event === "hard-to-tie"
  ) {
    retieDecision = "retie-recommended";
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
      nextAction: "If context is wrong, re-run with corrected chips — do not trust a mis-framed diagnosis.",
      rationale: "Connection + materials are field evidence, not library filters.",
      confidence: "high",
      category: "material",
    });
  }

  let knotCheck: CheckResult | undefined;
  let relatedKnot: Knot | undefined;
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
    contextChips.length > 1
      ? contextChips.map((c) => c.value).join(" · ")
      : undefined;

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
    likelyCauses: uniq(likelyCauses).slice(0, 8),
    checks: uniq(checks).slice(0, 8),
    fixes: uniq(fixes).slice(0, 8),
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
  };
}
