/**
 * Diagnose → Decide handoff. Everything the diagnosis actually established is
 * carried across as a declared constraint with a stated reason. Nothing is
 * invented: if the evidence does not support a condition, it is not set.
 */
import type { ChooseInput } from "@/domain/types";
import type { TroubleshootInput, TroubleshootResult } from "@/engine/troubleshoot";

export interface CarriedConstraint {
  label: string;
  why: string;
}

export interface DiagnosisHandoff {
  input: Partial<ChooseInput>;
  carried: CarriedConstraint[];
  /** What the failure rules out on the next attempt. */
  rulesOut: string[];
}

export function diagnosisToDecide(
  t: Partial<TroubleshootInput>,
  result?: TroubleshootResult | null,
): DiagnosisHandoff {
  const s = result?.decideSearch ?? {};
  const input: Partial<ChooseInput> = {
    ...((s.connection ?? t.connection) ? { connection: (s.connection ?? t.connection)! } : {}),
    ...((s.mainMaterial ?? t.mainMaterial)
      ? { mainMaterial: (s.mainMaterial ?? t.mainMaterial)! }
      : {}),
    ...((s.secondaryMaterial ?? t.secondaryMaterial)
      ? { secondaryMaterial: (s.secondaryMaterial ?? t.secondaryMaterial)! }
      : {}),
    ...((s.diameterRelation ?? t.diameterRelation)
      ? { diameterRelation: (s.diameterRelation ?? t.diameterRelation)! }
      : {}),
  };
  const carried: CarriedConstraint[] = [];
  const rulesOut: string[] = [];

  const add = (patch: Partial<ChooseInput>, label: string, why: string) => {
    Object.assign(input, patch);
    carried.push({ label, why });
  };

  if (t.event === "bulky-guides") {
    add(
      { mustPassGuides: true },
      "Must pass guides",
      "The reported failure was bulk ticking through guides.",
    );
    rulesOut.push("Bulky barrel joins are eliminated before scoring, not penalised after.");
  }
  if (t.event === "dead-action" || t.event === "loop-collapsed") {
    add(
      { freeSwing: true },
      "Free-swing / open action",
      "The failure was a pinned or collapsed loop on an action job.",
    );
  }
  if (t.event === "keeps-failing") {
    add(
      { retieFrequency: "frequent" },
      "Frequent retie",
      "Repeat failure means the connection is being rebuilt often; retie speed now counts.",
    );
  }
  if (t.event === "hard-to-tie" || t.event === "wind-tangle") {
    add(
      { proficiency: "beginner" },
      "Proficiency: beginner",
      "The connection failed at the tying or tangle stage, so complexity is treated as a real cost.",
    );
    rulesOut.push("Advanced geometries are down-ranked until the simpler family is proven.");
  }
  if (t.event === "wont-seat" || t.endLook === "glazed-melt") {
    rulesOut.push("Anything that needs perfect wet seating is a poor bet in this material system.");
  }
  if (t.event === "pigtail-left" || t.endLook === "curly-pigtail" || t.endLook === "knot-gone") {
    rulesOut.push("Slip-prone families on this material are eliminated, not scored.");
  }
  if (t.event === "bitten-off" || t.event === "hardware-opened" || t.event === "clean-sever") {
    rulesOut.push(
      "Do not treat this as a knot-family failure until the cutting surface is ruled out.",
    );
  }
  if (t.event === "self-cut") {
    rulesOut.push(
      "A knot that cut the line is not reseated. Crossed coils and sharp rings are eliminated first.",
    );
  }
  if (t.event === "tip-wrap") {
    add(
      { mustPassGuides: true },
      "Must pass guides",
      "A tip wrap often starts as slack thrown at the last guide.",
    );
    rulesOut.push("Do not change terminal family for a tip-top wrap until the tip is sound.");
  }
  if (t.event === "double-line-unravelled") {
    add({ connection: "line-to-loop" }, "Line → loop", "The double line walked. That is the job.");
  }
  if (t.event === "reef-spilled") {
    add(
      { connection: "reef-or-bind" },
      "Reef / bind",
      "A spilled reef is a bind job — or a bend used wrongly.",
    );
    rulesOut.push(
      "A reef / square knot is not a bend. It should not score as a rope-to-rope join.",
    );
  }
  if (t.event === "grip-slipped") {
    add(
      { connection: "load-transfer" },
      "Load transfer",
      "The gripping hitch slid. That is the job.",
    );
  }
  if (t.event === "riding-turn") {
    rulesOut.push("A riding turn is handling, not a sheet-knot family failure.");
  }
  if (t.event === "cleat-dumped") {
    add({ connection: "rope-to-cleat" }, "Rope → cleat", "The line dumped off the horns.");
  }
  if (t.event === "shock-parted") {
    rulesOut.push(
      "Shock in the standing part — do not change hitch family until length and fibre are sane.",
    );
  }
  if (t.event === "shank-walked") {
    add({ connection: "hook-snell" }, "Hook snell", "The failure was wraps walking the shank.");
  }
  if (t.event === "girth-cinched") {
    add({ connection: "loop-to-loop" }, "Loop to loop", "The handshake cinched. That is the job.");
  }
  if (t.event === "coating-peeled") {
    add(
      { connection: "fly-line-to-leader" },
      "Fly line → leader",
      "The coating failed at the tip join.",
    );
  }
  if (t.event === "arbor-slipped") {
    add({ connection: "line-to-spool" }, "Line → spool", "The arbor let go.");
  }
  if (t.event === "jammed-uncleatable") {
    add({ connection: "rope-to-cleat" }, "Rope → cleat", "The lock would not cast off.");
  }
  if (t.breakLocation === "at-eye") {
    add(
      { hardwareEyeSmall: true },
      "Tight hardware eye",
      "The break was at the eye — eye geometry is treated as a constraint, not a detail.",
    );
  }
  if (t.breakLocation === "at-tag") {
    rulesOut.push("Finishes that rely on a short tag are penalised on this attempt.");
  }
  if (
    t.breakLocation === "above-knot" ||
    t.breakLocation === "at-guides" ||
    t.breakLocation === "in-leader"
  ) {
    rulesOut.push("Line or leader damage — the knot family may not have been the fault at all.");
  }
  if (t.breakLocation === "at-guides" || t.event === "bulky-guides") {
    add({ mustPassGuides: true }, "Must pass guides", "The failure implicated the guides.");
  }

  if (t.coldHands) add({ coldHands: true }, "Cold / wet hands", "Declared on the diagnosis.");
  if (t.windy) add({ windy: true }, "Wind", "Declared on the diagnosis.");
  if (t.lowLight) add({ lowLight: true }, "Low light", "Declared on the diagnosis.");

  const notes = (t.notes ?? "").toLowerCase();
  if (!input.coldHands && /\bcold|freez|numb|ice\b/.test(notes))
    add({ coldHands: true }, "Cold / wet hands", "Your field notes describe cold hands.");
  if (!input.windy && /\bwind|blow|gust/.test(notes))
    add({ windy: true }, "Wind", "Your field notes describe wind at the point of failure.");
  if (!input.lowLight && /\bnight|dark|headlamp|low light/.test(notes))
    add({ lowLight: true }, "Low light", "Your field notes describe tying in the dark.");
  if (/\bguide/.test(notes) && !input.mustPassGuides)
    add({ mustPassGuides: true }, "Must pass guides", "Your field notes mention the guides.");

  return { input, carried, rulesOut };
}

/** URL-safe encoding of a partial ChooseInput for deep links. */
export function encodeInput(input: Partial<ChooseInput>): string {
  return encodeURIComponent(JSON.stringify(input));
}

export function decodeInput(raw: string | undefined): Partial<ChooseInput> | undefined {
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    return parsed && typeof parsed === "object" ? (parsed as Partial<ChooseInput>) : undefined;
  } catch {
    return undefined;
  }
}
