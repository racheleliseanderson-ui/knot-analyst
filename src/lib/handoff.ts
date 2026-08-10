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
    ...(s.connection ?? t.connection ? { connection: (s.connection ?? t.connection)! } : {}),
    ...(s.mainMaterial ?? t.mainMaterial ? { mainMaterial: (s.mainMaterial ?? t.mainMaterial)! } : {}),
    ...(s.secondaryMaterial ?? t.secondaryMaterial
      ? { secondaryMaterial: (s.secondaryMaterial ?? t.secondaryMaterial)! }
      : {}),
    ...(s.diameterRelation ?? t.diameterRelation
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
    add({ mustPassGuides: true }, "Must pass guides", "The reported failure was bulk ticking through guides.");
    rulesOut.push("Bulky barrel joins are eliminated before scoring, not penalised after.");
  }
  if (t.event === "keeps-failing") {
    add(
      { retieFrequency: "frequent" },
      "Frequent retie",
      "Repeat failure means the connection is being rebuilt often; retie speed now counts.",
    );
  }
  if (t.event === "hard-to-tie") {
    add(
      { proficiency: "beginner" },
      "Proficiency: beginner",
      "The connection failed at the tying stage, so complexity is treated as a real cost.",
    );
    rulesOut.push("Advanced geometries are down-ranked until the simpler family is proven.");
  }
  if (t.event === "wont-seat") {
    rulesOut.push("Anything that needs perfect wet seating is a poor bet in this material system.");
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
  if (t.breakLocation === "above-knot") {
    rulesOut.push("Line damage above the knot — the knot family may not have been the fault at all.");
  }

  const notes = (t.notes ?? "").toLowerCase();
  if (/\bcold|freez|numb|ice\b/.test(notes))
    add({ coldHands: true }, "Cold / wet hands", "Your field notes describe cold hands.");
  if (/\bwind|blow|gust/.test(notes))
    add({ windy: true }, "Wind", "Your field notes describe wind at the point of failure.");
  if (/\bnight|dark|headlamp|low light/.test(notes))
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