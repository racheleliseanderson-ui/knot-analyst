/**
 * Orchestrates Layer 1 (constraints) + Layer 2 (field-fit ranking).
 */
import { KNOTS } from "@/data/catalog";
import type { ChooseInput, ChooseResult, FindingConfidence } from "@/domain/types";
import {
  APPLICATION_ID,
  CONNECTION_LABELS,
  ENGINE_VERSION,
  KNOT_CATALOG_VERSION,
} from "@/domain/types";
import { eliminateKnots } from "./constraints";
import { annotateExplainability, explainTradeoff } from "./explain";
import { rankSurvivors } from "./ranking";
import { materialModifier, terminationAdvice } from "@/domain/material";

export function runChooser(input: ChooseInput): ChooseResult {
  const { survivors, eliminated } = eliminateKnots(KNOTS, input);
  let ranked = rankSurvivors(survivors, input);
  ranked = annotateExplainability(ranked, eliminated);

  if (ranked.length >= 1) {
    ranked[0] = {
      ...ranked[0],
      eliminatedCompetitors: eliminated.map((e) => e.knotName).slice(0, 6),
    };
  }

  const top = ranked[0];
  const second = ranked[1];
  const termination = terminationAdvice(input.mainSpec, input.secondarySpec);
  const axisNote =
    materialModifier(input.mainSpec).note ?? materialModifier(input.secondarySpec).note;

  let plainSummary: string;
  let tradeoffSummary: string | undefined;
  if (!top) {
    plainSummary = `No valid knot remains for ${CONNECTION_LABELS[input.connection]} under hard constraints. Widen materials or diameter assumptions — the engine will not invent a match.`;
  } else {
    tradeoffSummary = second ? explainTradeoff(top, second) : undefined;
    const trade = tradeoffSummary ? ` ${tradeoffSummary}` : "";
    const axis = axisNote ? ` ${axisNote}.` : "";
    const term = termination ? ` ${termination.headline}.` : "";
    plainSummary = `Best field fit: ${top.knot.name} (${top.fieldFitPercent}%). ${top.whyBest.slice(0, 2).join(". ")}.${axis}${term}${trade}`;
  }

  const confidence: FindingConfidence = !top
    ? "high"
    : top.fieldFitPercent >= 80
      ? "high"
      : top.fieldFitPercent >= 60
        ? "moderate"
        : "low";

  const counterfactualHints = [
    "What if leader diameter is twice as thick?",
    "What if this must pass through guides?",
    "What if you are tying in wind with cold hands?",
    "What if main line is fluoro instead of braid?",
  ];

  return {
    generatedAt: new Date().toISOString(),
    applicationId: APPLICATION_ID,
    engineVersion: ENGINE_VERSION,
    catalogVersion: KNOT_CATALOG_VERSION,
    input,
    eliminated,
    ranked: ranked.slice(0, 8),
    plainSummary,
    confidence,
    counterfactualHints,
    tradeoffSummary,
    ...(termination ? { termination } : {}),
  };
}

/** Map legacy purpose strings → connection job for API bridge */
export function inferConnectionFromPurpose(purpose: string): ChooseInput["connection"] {
  const p = purpose.toLowerCase();
  if (p.includes("snell")) return "hook-snell";
  if (p.includes("braid") && (p.includes("leader") || p.includes("fluoro") || p.includes("mono")))
    return "braid-to-leader";
  if (p.includes("tippet") || p.includes("leader-tippet")) return "leader-to-tippet";
  if (p.includes("loop")) return "loop-to-loop";
  if (p.includes("spool") || p.includes("arbor")) return "line-to-spool";
  if (p.includes("swivel")) return "line-to-swivel";
  if (p.includes("fly line") || p.includes("fly-line")) return "fly-line-to-leader";
  if (p.includes("join") || p.includes("line to line") || p.includes("splice")) return "leader-to-leader";
  if (p.includes("lure") || p.includes("swing")) return "line-to-lure";
  return "line-to-hook";
}
