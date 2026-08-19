/**
 * Ranking explainability — human-readable “why this / why not that”.
 * Pure functions over already-ranked options; no scoring authority here.
 */
import {
  DIMENSION_LABELS,
  type ConstraintElimination,
  type DimensionScore,
  type RankedOption,
} from "@/domain/types";

export interface DimensionEdge {
  dimension: DimensionScore["dimension"];
  label: string;
  winnerScore: number;
  otherScore: number;
  delta: number;
  weight: number;
}

/** Largest positive/negative gaps between two ranked options */
export function dimensionEdges(a: RankedOption, b: RankedOption, limit = 4): DimensionEdge[] {
  return a.dimensionScores
    .map((w) => {
      const o = b.dimensionScores.find((d) => d.dimension === w.dimension)!;
      return {
        dimension: w.dimension,
        label: DIMENSION_LABELS[w.dimension],
        winnerScore: w.score,
        otherScore: o.score,
        delta: w.score - o.score,
        weight: w.weight,
      };
    })
    .filter((e) => Math.abs(e.delta) >= 6 && e.weight >= 0.4)
    .sort((x, y) => Math.abs(y.delta) * y.weight - Math.abs(x.delta) * x.weight)
    .slice(0, limit);
}

export function explainTradeoff(winner: RankedOption, runnerUp: RankedOption): string {
  const edges = dimensionEdges(winner, runnerUp, 6);
  const winEdge = edges.filter((g) => g.delta > 0).slice(0, 2);
  const loseEdge = edges.filter((g) => g.delta < 0).slice(0, 2);

  const parts: string[] = [];
  if (winEdge.length) {
    parts.push(
      `${winner.knot.name} leads on ${winEdge
        .map((g) => `${g.label.toLowerCase()} (${g.winnerScore} vs ${g.otherScore})`)
        .join(" and ")}`,
    );
  } else {
    parts.push(
      `${winner.knot.name} wins on overall weighted field fit (${winner.fieldFitPercent}% vs ${runnerUp.fieldFitPercent}%)`,
    );
  }
  if (loseEdge.length) {
    parts.push(
      `${runnerUp.knot.name} still holds an edge on ${loseEdge
        .map((g) => g.label.toLowerCase())
        .join(" and ")}`,
    );
  }
  return parts.join(". ") + ".";
}

/** Why the #1 pick beat the rest (and who was never ranked) */
export function whyThisWon(
  winner: RankedOption,
  runnerUp: RankedOption | undefined,
  eliminated: ConstraintElimination[],
): string[] {
  const lines: string[] = [];

  lines.push(...winner.whyBest.slice(0, 3));

  if (runnerUp) {
    const edges = dimensionEdges(winner, runnerUp, 3).filter((e) => e.delta > 0);
    for (const e of edges) {
      lines.push(
        `Beats ${runnerUp.knot.name} on ${e.label.toLowerCase()} (${e.winnerScore} vs ${e.otherScore})`,
      );
    }
    const gap = winner.fieldFitPercent - runnerUp.fieldFitPercent;
    if (gap >= 12) {
      lines.push(
        `Clear field-fit margin over ${runnerUp.knot.name} (+${gap} points under your conditions)`,
      );
    } else if (gap > 0) {
      lines.push(
        `Close call vs ${runnerUp.knot.name} (+${gap} points) — check tradeoffs before committing`,
      );
    }
  }

  if (eliminated.length > 0) {
    const sample = eliminated.slice(0, 3).map((e) => e.knotName);
    lines.push(
      `Layer 1 removed ${eliminated.length} knot${eliminated.length === 1 ? "" : "s"} before scoring (${sample.join(", ")}${eliminated.length > 3 ? "…" : ""})`,
    );
  }

  return unique(lines).slice(0, 6);
}

/** Why a non-winner is not the preferred pick vs #1 */
export function whyNotThis(option: RankedOption, winner: RankedOption): string[] {
  if (option.knot.id === winner.knot.id) return [];

  const lines: string[] = [];
  const edges = dimensionEdges(winner, option, 4).filter((e) => e.delta > 0);

  for (const e of edges) {
    lines.push(
      `Trails ${winner.knot.name} on ${e.label.toLowerCase()} (${e.otherScore} vs ${e.winnerScore})`,
    );
  }

  lines.push(...option.butNotes.slice(0, 2));

  const gap = winner.fieldFitPercent - option.fieldFitPercent;
  if (gap >= 8) {
    lines.push(`${gap} points behind ${winner.knot.name} on weighted field fit for this setup`);
  }

  // When this option still has an edge somewhere
  const reverseEdges = dimensionEdges(option, winner, 2).filter((e) => e.delta > 0);
  for (const e of reverseEdges) {
    lines.push(
      `Still stronger on ${e.label.toLowerCase()} (${e.winnerScore} vs ${e.otherScore}) — tradeoff, not free lunch`,
    );
  }

  return unique(lines).slice(0, 5);
}

/** Top weighted dimensions to show as bars */
export function topWeightedDimensions(option: RankedOption, limit = 6): DimensionScore[] {
  return option.dimensionScores
    .slice()
    .sort((a, b) => b.score * b.weight - a.score * a.weight)
    .slice(0, limit);
}

function unique(items: string[]): string[] {
  return [...new Set(items.map((s) => s.trim()).filter(Boolean))];
}

/** Attach explainability fields onto ranked list (mutates copies) */
export function annotateExplainability(
  ranked: RankedOption[],
  eliminated: ConstraintElimination[],
): RankedOption[] {
  if (!ranked.length) return ranked;
  const winner = ranked[0];
  const runnerUp = ranked[1];

  return ranked.map((r, idx) => {
    if (idx === 0) {
      return {
        ...r,
        whyBest: whyThisWon(r, runnerUp, eliminated),
        vsNext: runnerUp ? explainTradeoff(r, runnerUp) : undefined,
        whyNotOthers: runnerUp
          ? [
              explainTradeoff(r, runnerUp),
              ...whyNotThis(runnerUp, r)
                .slice(0, 2)
                .map((line) => `${runnerUp.knot.name}: ${line}`),
              ...eliminated.slice(0, 2).map((e) => `${e.knotName} eliminated: ${e.reasons[0]}`),
            ]
          : eliminated.slice(0, 4).map((e) => `${e.knotName}: ${e.reasons[0]}`),
      };
    }
    return {
      ...r,
      whyNotOthers: whyNotThis(r, winner),
      vsNext: explainTradeoff(winner, r),
    };
  });
}
