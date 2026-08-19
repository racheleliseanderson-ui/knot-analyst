/**
 * Candidate Termination — parallel track to knot ranking.
 *
 * Knot Analyst remains the consumer product name; internally a "correct answer"
 * may be a knot, bend, hitch, splice, crimp, twist, or mechanical termination.
 * This module surfaces non-knot candidates without rewriting the knot catalog.
 */
import { type MaterialSpec, type Termination, terminationAdvice } from "@/domain/material";

export type TerminationType =
  "knot" | "bend" | "hitch" | "splice" | "crimp" | "twist" | "mechanical" | "lashing" | "other";

export interface TerminationCandidate {
  id: string;
  name: string;
  terminationType: TerminationType;
  method: Termination;
  headline: string;
  detail: string;
  /** When this candidate is preferred over a conventional knot */
  when: string;
  priority: number;
  confidence: "low" | "moderate" | "high";
}

const METHOD_TO_TYPE: Record<Termination, TerminationType> = {
  knot: "knot",
  splice: "splice",
  crimp: "crimp",
  "do-not-connect": "other",
};

/**
 * Build the parallel termination list for a material pair.
 * Empty when a conventional knot remains the right first answer.
 */
export function candidateTerminations(
  main: MaterialSpec | undefined,
  secondary?: MaterialSpec | undefined,
): TerminationCandidate[] {
  const advice = terminationAdvice(main, secondary);
  if (!advice) return [];

  const out: TerminationCandidate[] = [];

  if (advice.method === "splice") {
    out.push({
      id: "hollow-core-bury",
      name: "Hollow-core bury / Chinese finger splice",
      terminationType: "splice",
      method: "splice",
      headline: advice.headline,
      detail: advice.detail,
      when: "Hollow-core braid is the main or secondary line",
      priority: 100,
      confidence: "high",
    });
    out.push({
      id: "loop-to-loop-splice-fallback",
      name: "Loop-to-loop after end loops",
      terminationType: "bend",
      method: "knot",
      headline: "Field fallback when a bury is not practical",
      detail:
        "Build standing loops in each end and join them. Weaker and bulkier than a bury, but rebuildable on the water.",
      when: "You need a field rebuild without a splicing needle",
      priority: 40,
      confidence: "moderate",
    });
  }

  if (advice.method === "crimp") {
    const specs = [main, secondary].filter(Boolean) as MaterialSpec[];
    const isSingle = specs.some((s) => s.construction === "single-strand-wire");
    const isTitanium = specs.some((s) => s.construction === "titanium-wire");

    if (isSingle) {
      out.push({
        id: "haywire-twist",
        name: "Haywire twist",
        terminationType: "twist",
        method: "crimp",
        headline: advice.headline,
        detail: advice.detail,
        when: "Single-strand wire bite trace",
        priority: 95,
        confidence: "high",
      });
    }

    out.push({
      id: "sleeved-crimp",
      name: "Sleeved crimp",
      terminationType: "crimp",
      method: "crimp",
      headline: isTitanium ? "Crimp the titanium — knots slip out of it" : advice.headline,
      detail: advice.detail,
      when: "Wire or other non-bedable construction",
      priority: isSingle ? 85 : 100,
      confidence: "high",
    });

    out.push({
      id: "mechanical-swivel",
      name: "Mechanical swivel / snap link",
      terminationType: "mechanical",
      method: "crimp",
      headline: "Hardware termination when the wire is pre-made",
      detail:
        "A factory-crimped trace to a swivel removes field wire work. Inspect the factory crimp; do not re-knot bare wire onto the swivel eye.",
      when: "Using a ready-made wire leader",
      priority: 60,
      confidence: "moderate",
    });
  }

  if (advice.method === "do-not-connect") {
    out.push({
      id: "do-not-connect",
      name: "Do not connect this pair",
      terminationType: METHOD_TO_TYPE["do-not-connect"],
      method: "do-not-connect",
      headline: advice.headline,
      detail: advice.detail,
      when: "Materials are incompatible under any field termination",
      priority: 100,
      confidence: "high",
    });
  }

  return out.sort((a, b) => b.priority - a.priority);
}
