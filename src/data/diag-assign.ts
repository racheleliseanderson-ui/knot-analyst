/**
 * Extra diagnostic rules. Overlay only — original knot diagnostics stay.
 * HTH 0.3.19 supplies advanced modes + finished-state cues where they exist.
 * Remaining families get fingerprint defects as diagnosable rules so every
 * modelled connection has more than a single factory line.
 */
import type { DiagnosticRule, FindingSeverity, RetieDecision } from "@/domain/types";
import type { MechanicsBundle } from "@/data/mechanics-profiles";
import { hthSlugFor } from "@/data/hth-plates";
import { failsWhenFor } from "@/data/connection-model-meta";
import fmJson from "@/data/hth/advanced-failure-modes.json";
import diagJson from "@/data/hth/finished-diagnostics.json";

interface HthMode {
  id: string;
  type: string;
  symptom: string;
  cause: string;
  action: string;
  severity: string;
}

interface HthFmProfile {
  title: string;
  modes: HthMode[];
}

interface HthDiagProfile {
  correct: string[];
  wrong: string[];
  consequence: string;
  visual_priority: string;
}

const FM_PROFILES = (fmJson as { profiles: Record<string, HthFmProfile> }).profiles;
const DIAG_PROFILES = (diagJson as { profiles: Record<string, HthDiagProfile> }).profiles;

function retieFrom(sev: string): RetieDecision {
  if (/break|slip|damage|pull/i.test(sev)) return "retie-now";
  if (/hang|abrasion|fail/i.test(sev)) return "retie-recommended";
  return "watch";
}

function severityFrom(sev: string): FindingSeverity {
  if (/break|slip|damage|pull/i.test(sev)) return "stop";
  return "watch";
}

function nearDup(a: string, b: string): boolean {
  const x = a
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const y = b
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  if (!x || !y) return false;
  if (x === y) return true;
  return x.startsWith(y.slice(0, 18)) || y.startsWith(x.slice(0, 18));
}

function pushUnique(into: DiagnosticRule[], next: DiagnosticRule): void {
  if (into.some((r) => nearDup(r.symptom, next.symptom))) return;
  into.push(next);
}

function fromHthModes(knotId: string, slug: string): DiagnosticRule[] {
  const profile = FM_PROFILES[slug];
  if (!profile?.modes?.length) return [];
  return profile.modes.map((m) => ({
    id: `hth-${knotId}-${m.id}`,
    symptom: m.symptom,
    likelyCauses: [m.cause],
    checks: [`Look for: ${m.symptom}`],
    fixes: [m.action],
    severity: severityFrom(m.severity),
    confidence: "high" as const,
    retieDecision: retieFrom(m.severity),
  }));
}

function fromHthFinished(knotId: string, slug: string): DiagnosticRule[] {
  const profile = DIAG_PROFILES[slug];
  if (!profile) return [];
  const wrong = profile.wrong ?? [];
  const correct = profile.correct ?? [];
  if (!wrong.length && !correct.length) return [];
  return [
    {
      id: `hth-${knotId}-finished`,
      symptom: wrong[0] ? `Finished check failed — ${wrong[0]}` : "Finished check failed",
      likelyCauses: wrong.length ? wrong : ["Finished structure does not match this family"],
      checks: correct.length ? correct : ["Compare the recovered knot to the finished-state plate"],
      fixes: [
        profile.consequence
          ? `Retie. ${profile.consequence.replace(/\.*$/, ".")}`
          : "Retie. Do not fish a finished check you argued with.",
      ],
      severity: "stop",
      confidence: "high",
      retieDecision: "retie-now",
    },
  ];
}

function fromFingerprint(knotId: string, m: MechanicsBundle | undefined): DiagnosticRule[] {
  const defects = m?.fingerprint.dangerousDefects ?? [];
  return defects.map((d) => ({
    id: `${d.id}-seen`,
    symptom: d.label,
    likelyCauses: [d.mechanicsWhy],
    checks: [
      d.consequence,
      d.stepWhere != null
        ? `Inspect step ${String(d.stepWhere).padStart(2, "0")}`
        : "Inspect the finished structure",
    ].filter(Boolean),
    fixes: ["Retie. Do not dress a defective structure and call it seated."],
    severity: (d.decision === "retie-now" ? "stop" : "watch") as FindingSeverity,
    confidence: "high" as const,
    retieDecision: d.decision,
    stepLink: d.stepWhere ?? undefined,
  }));
}

/** Merge modelled extras onto the factory list. Original rules stay first. */
export function applyDiagOverlay(
  knotId: string,
  existing: DiagnosticRule[],
  mechanics?: MechanicsBundle,
): DiagnosticRule[] {
  const out = [...existing];
  const slug = hthSlugFor(knotId);
  if (slug) {
    for (const r of fromHthModes(knotId, slug)) pushUnique(out, r);
    for (const r of fromHthFinished(knotId, slug)) pushUnique(out, r);
  }
  const beforeFp = out.length;
  for (const r of fromFingerprint(knotId, mechanics)) {
    pushUnique(out, r);
    if (out.length - beforeFp >= 3) break;
  }
  if (out.length < 2) {
    for (const line of failsWhenFor(knotId)) {
      pushUnique(out, {
        id: `${knotId}-fails-${String(out.length)}`,
        symptom: line,
        likelyCauses: [line],
        checks: ["Compare the recovered end to this family's modelled failure modes"],
        fixes: ["Retie. The recovered end still outranks the name."],
        severity: "watch",
        confidence: "high",
        retieDecision: "retie-recommended",
      });
      if (out.length >= 2) break;
    }
  }
  return out;
}
