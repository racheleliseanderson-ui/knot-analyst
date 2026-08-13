import type { Knot, KnotCategory, KnotContent, LineMaterial } from "@/domain/types";
import { ENGINE_VERSION, KNOT_CATALOG_VERSION } from "@/domain/types";
import { TERMINAL_KNOTS } from "@/data/knots/terminal";
import { LINE_TO_LINE_KNOTS } from "@/data/knots/line-to-line";
import { LOOP_KNOTS } from "@/data/knots/loops";
import { UTILITY_KNOTS } from "@/data/knots/utility";
import { getMechanics } from "@/data/mechanics";
import { applyHowTo } from "@/data/how-to";
import { applyVideo } from "@/data/videos";
import {
  catalogReviewDue,
  getConnectionModelMeta,
} from "@/data/connection-model-meta";

const RAW: KnotContent[] = [
  ...TERMINAL_KNOTS,
  ...LINE_TO_LINE_KNOTS,
  ...LOOP_KNOTS,
  ...UTILITY_KNOTS,
];

function hydrate(raw: KnotContent): Knot {
  const content = applyVideo(applyHowTo(raw));
  const m = getMechanics(content.id);
  if (!m) {
    throw new Error(`Missing mechanical profile for knot: ${content.id}`);
  }
  // Gold-standard model meta is required for every decision-model entry.
  if (!getConnectionModelMeta(content.id)) {
    throw new Error(`Missing connection model meta for knot: ${content.id}`);
  }
  return {
    ...content,
    contract: m.contract,
    fieldFit: m.fieldFit,
    fingerprint: m.fingerprint,
    observations: m.observations,
    diagramKind: m.diagramKind,
    mechanicsSummary: m.mechanicsSummary,
    completeness: m.completeness,
  };
}

export const KNOTS: Knot[] = RAW.map(hydrate);

export function getKnot(id: string): Knot | undefined {
  return KNOTS.find((k) => k.id === id);
}

export function knotsByCategory(category: KnotCategory): Knot[] {
  return KNOTS.filter((k) => k.category === category);
}

export function searchKnots(query: string): Knot[] {
  const q = query.trim().toLowerCase();
  if (!q) return KNOTS;
  return KNOTS.filter((k) => {
    const hay = [
      k.name,
      ...k.aliases,
      k.goodFor,
      ...k.bestFor,
      ...k.tags,
      ...k.commonMistakes,
      k.mechanicsSummary,
      ...k.contract.connectionFamilies,
    ]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

export function filterKnots(opts: {
  category?: KnotCategory | "any";
  material?: LineMaterial | "any";
  difficulty?: string;
  query?: string;
}): Knot[] {
  let list = opts.query ? searchKnots(opts.query) : [...KNOTS];
  if (opts.category && opts.category !== "any") {
    list = list.filter((k) => k.category === opts.category);
  }
  if (opts.material && opts.material !== "any") {
    list = list.filter((k) => k.lineMaterials.includes(opts.material as LineMaterial));
  }
  if (opts.difficulty && opts.difficulty !== "any") {
    list = list.filter((k) => k.difficulty === opts.difficulty);
  }
  return list;
}

export function catalogMeta() {
  const review = catalogReviewDue();
  return {
    version: KNOT_CATALOG_VERSION,
    count: KNOTS.length,
    engine: ENGINE_VERSION,
    layers: ["hard-constraint", "field-fit", "finished-diagnostic"],
    categories: {
      terminal: knotsByCategory("terminal").length,
      "line-to-line": knotsByCategory("line-to-line").length,
      loop: knotsByCategory("loop").length,
      specialty: knotsByCategory("specialty").length,
    },
    completeness: {
      withDecisionModel: KNOTS.filter((k) => k.completeness.decisionModel).length,
      withFingerprint: KNOTS.filter((k) => k.completeness.mechanicalFingerprint).length,
      withModelMeta: KNOTS.filter((k) => Boolean(getConnectionModelMeta(k.id))).length,
    },
    /** Surfaced only through existing affordances (admin / mono meta lines). */
    reviewDue: review.due,
    newestReviewed: review.newestReviewed,
    daysSinceReview: review.daysSince,
  };
}
