/**
 * Layer 3 — Finished-Knot Diagnostic Engine
 * Observations in → retie decision out. Vision (later) only extracts observations.
 */
import type {
  CheckInput,
  CheckResult,
  FindingConfidence,
  Knot,
  LayeredFinding,
  RetieDecision,
} from "@/domain/types";
import { APPLICATION_ID, ENGINE_VERSION, RETIE_LABELS } from "@/domain/types";

const DECISION_RANK: Record<RetieDecision, number> = {
  cosmetic: 0,
  watch: 1,
  "retie-recommended": 2,
  "retie-now": 3,
  "cannot-verify": 4,
};

function worse(a: RetieDecision, b: RetieDecision): RetieDecision {
  return DECISION_RANK[a] >= DECISION_RANK[b] ? a : b;
}

function fid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function runFinishedCheck(knot: Knot, input: CheckInput): CheckResult {
  const marked = new Set(input.observations);
  const unableToVerify: string[] = [];
  const confidenceReasons: string[] = [];
  const findings: LayeredFinding[] = [];
  const whatISee: string[] = [];
  const whyItMatters: string[] = [];
  const whatToDo: string[] = [];

  // Quality gates
  const focusOk = input.focusOk !== false;
  const criticalVisible = input.criticalStructureVisible !== false;
  const bothExits = input.bothExitsVisible === true || marked.has("both_exits");
  const tagVisible = input.tagVisible === true || marked.has("tag_visible") || marked.has("tags_ok") || marked.has("tag_ok");

  if (!focusOk) unableToVerify.push("Focus / image sharpness");
  if (!criticalVisible) unableToVerify.push("Critical knot structure");
  if (!bothExits) unableToVerify.push("Both line exits");
  if (!tagVisible) unableToVerify.push("Tag-end finish");

  let decision: RetieDecision = "cosmetic";
  let diagnosticConfidence: FindingConfidence = "high";

  // Cannot verify if quality gates fail hard
  if (!focusOk || !criticalVisible) {
    decision = "cannot-verify";
    diagnosticConfidence = "low";
    confidenceReasons.push("Critical structure not verified");
    findings.push({
      id: fid("unverified"),
      severity: "stop",
      title: "I cannot verify this knot",
      observation: `Unable to verify: ${unableToVerify.join(", ") || "insufficient evidence"}`,
      implication: "An unverified connection is not a safe connection.",
      nextAction: "Improve view of the knot (all sides, tag, exits) or cut it off and retie.",
      rationale: "Fail-closed: missing evidence never becomes a silent pass.",
      confidence: "high",
      category: "retie",
    });
    whatISee.push("Insufficient visual / observational evidence for a reliable inspection");
    whyItMatters.push("Fishing load will find defects you cannot see");
    whatToDo.push("Retake the inspection with full structure visible — or retie now");
  } else {
    confidenceReasons.push("Critical structure available for evaluation");
    if (bothExits) confidenceReasons.push("Both line exits assessed");
    if (tagVisible) confidenceReasons.push("Tag-end finish assessed");

    // Map observations → defects
    const hitDefects = knot.fingerprint.dangerousDefects.filter((d) => {
      const obs = knot.observations.find((o) => o.relatedDefectIds.includes(d.id));
      if (!obs) return marked.has(d.observationKey);
      return marked.has(obs.key) && obs.badWhen;
    });

    // Also direct observation keys
    for (const o of knot.observations) {
      if (!marked.has(o.key)) continue;
      if (!o.badWhen) {
        whatISee.push(`OK: ${o.label}`);
        continue;
      }
      whatISee.push(`Issue: ${o.label}`);
      for (const defectId of o.relatedDefectIds) {
        const defect = knot.fingerprint.dangerousDefects.find((d) => d.id === defectId);
        if (!defect) continue;
        if (hitDefects.includes(defect)) continue;
        hitDefects.push(defect);
      }
    }

    // Positive geometry checks that are expected but missing
    const goodKeys = knot.observations.filter((o) => !o.badWhen && o.group !== "visibility");
    for (const g of goodKeys) {
      if (!marked.has(g.key) && !marked.has("both_exits")) {
        // Not marked good and not in a pass path — soft watch if related to seating
        if (g.key.includes("seat") || g.key.includes("neat") || g.key.includes("uniform") || g.key.includes("straight")) {
          // only if user engaged with any checks
        }
      }
    }

    if (hitDefects.length === 0 && marked.size > 0) {
      confidenceReasons.push("No dangerous defect markers selected");
      confidenceReasons.push("Finished geometry consistent with diagnostic model (self-report)");
      findings.push({
        id: fid("pass"),
        severity: "info",
        title: "No critical defect markers",
        observation: "Selected observations do not match known dangerous defects for this knot.",
        implication: "Self-inspection is not a laboratory proof — still pull-test before fishing.",
        nextAction: "Pull-test, then fish. Re-inspect after first hard load.",
        rationale: "Deterministic engine only flags modeled defects.",
        confidence: bothExits && tagVisible ? "high" : "moderate",
        category: "diagnostics",
      });
      if (!bothExits || !tagVisible) {
        decision = worse(decision, "watch");
        diagnosticConfidence = "moderate";
        unableToVerify.push(...[...(!bothExits ? ["Rear / opposite exits"] : []), ...(!tagVisible ? ["Tag end"] : [])]);
      }
    }

    for (const defect of hitDefects) {
      decision = worse(decision, defect.decision);
      whyItMatters.push(defect.consequence);
      whatToDo.push(
        defect.decision === "cosmetic" || defect.decision === "watch"
          ? `Inspect: ${defect.label}`
          : `Retie — ${defect.label}`,
      );

      const severity =
        defect.decision === "retie-now"
          ? "stop"
          : defect.decision === "retie-recommended"
            ? "stop"
            : defect.decision === "watch"
              ? "watch"
              : "info";

      findings.push({
        id: fid(defect.id),
        severity,
        title: defect.label,
        observation: `Observed condition linked to ${defect.id}`,
        implication: defect.consequence,
        nextAction:
          defect.decision === "retie-now" || defect.decision === "retie-recommended"
            ? "Cut it off and retie. Do not fish this connection."
            : "Inspect more carefully; pull-test if you proceed.",
        rationale: defect.mechanicsWhy,
        confidence: "high",
        category: defect.decision === "cosmetic" ? "diagnostics" : "retie",
        mechanicsLink: defect.mechanicsWhy,
        stepLink: defect.stepWhere ?? undefined,
      });
    }

    // Symptom free-text against catalog diagnostics
    if (input.symptom?.trim()) {
      const s = input.symptom.toLowerCase();
      const matched = knot.diagnostics.filter((d) => {
        const sym = d.symptom.toLowerCase();
        return (
          sym.includes(s.slice(0, 10)) ||
          s.includes(sym.slice(0, 8)) ||
          d.likelyCauses.some((c) => s.includes(c.toLowerCase().slice(0, 5)))
        );
      });
      for (const d of matched.slice(0, 2)) {
        const rd = d.retieDecision ?? (d.severity === "stop" ? "retie-recommended" : "watch");
        decision = worse(decision, rd);
        findings.push({
          id: fid(d.id),
          severity: d.severity,
          title: d.symptom,
          observation: `Likely causes: ${d.likelyCauses.join("; ")}`,
          implication: `Checks: ${d.checks.join("; ")}`,
          nextAction: d.fixes.join(" · "),
          rationale: `Catalog diagnostic (${d.confidence})`,
          confidence: d.confidence,
          category: "diagnostics",
          stepLink: d.stepLink,
        });
      }
    }

    if (unableToVerify.length && decision !== "cannot-verify") {
      diagnosticConfidence = diagnosticConfidence === "high" ? "moderate" : diagnosticConfidence;
      confidenceReasons.push(`Partial visibility gaps: ${unableToVerify.join(", ")}`);
    }

    if (hitDefects.some((d) => d.decision === "retie-now")) {
      diagnosticConfidence = "high";
      confidenceReasons.push("Critical defect geometry matched diagnostic model");
    }
  }

  // Boundary finding always
  findings.push({
    id: fid("boundary"),
    severity: "info",
    title: "Mechanical engine owns the conclusion",
    observation:
      "Observations were evaluated by the finished-knot diagnostic model — not by free-form AI judgment.",
    implication: "If the safest answer is retie, that is intentional fail-closed design.",
    nextAction: decision.startsWith("retie") || decision === "cannot-verify" ? "Retie now." : "Pull-test before fishing.",
    rationale: "Layer 3 authority is rules + fingerprint, never an LLM override.",
    confidence: "high",
    category: "boundary",
  });

  const plainSummary =
    decision === "cannot-verify"
      ? `Cannot verify ${knot.name} well enough to trust it. Retie or re-inspect with full structure visible.`
      : decision === "retie-now"
        ? `${knot.name}: Retie now. Critical geometry appears incorrect.`
        : decision === "retie-recommended"
          ? `${knot.name}: Retie recommended — known mechanical defect markers present.`
          : decision === "watch"
            ? `${knot.name}: Watch — potential issues; inspect more closely and pull-test.`
            : `${knot.name}: No critical defect markers from this inspection. Still pull-test.`;

  if (whatToDo.length === 0) {
    whatToDo.push(
      decision === "cannot-verify" ? "Cut it off and retie — or capture a complete view" : "Pull-test, then fish",
    );
  }

  return {
    generatedAt: new Date().toISOString(),
    applicationId: APPLICATION_ID,
    engineVersion: ENGINE_VERSION,
    knot,
    input,
    retieDecision: decision,
    retieLabel: RETIE_LABELS[decision],
    diagnosticConfidence,
    confidenceReasons,
    unableToVerify,
    findings,
    whatISee: whatISee.length ? whatISee : ["No specific defect markers selected"],
    whyItMatters,
    whatToDo: [...new Set(whatToDo)],
    plainSummary,
  };
}
