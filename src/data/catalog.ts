import type { Knot, KnotCategory, KnotContent, LineMaterial, ConnectionJob } from "@/domain/types";
import { ENGINE_VERSION, KNOT_CATALOG_VERSION } from "@/domain/types";
import type { DomainId } from "@/domain/domain";
import { TERMINAL_KNOTS } from "@/data/knots/terminal";
import { LINE_TO_LINE_KNOTS } from "@/data/knots/line-to-line";
import { LOOP_KNOTS } from "@/data/knots/loops";
import { UTILITY_KNOTS } from "@/data/knots/utility";
import { SEED_BATCH_2 } from "@/data/knots/seed-batch-2";
import { SEED_BATCH_3_TERMINAL } from "@/data/knots/seed-batch-3-terminal";
import { SEED_BATCH_4 } from "@/data/knots/seed-batch-4";
import { SEED_BATCH_5_TERMINAL } from "@/data/knots/seed-batch-5-terminal";
import { SEED_BATCH_6 } from "@/data/knots/seed-batch-6";
import { BOATING_BATCH_1 } from "@/data/knots/boating-batch-1";
import { BOATING_BATCH_2 } from "@/data/knots/boating-batch-2";
import { BOATING_BATCH_3 } from "@/data/knots/boating-batch-3";
import { getMechanics } from "@/data/mechanics";
import { applyHowTo } from "@/data/how-to";
import { applyVideo } from "@/data/videos";
import { applySeedComplete } from "@/data/seed-complete";
import { catalogReviewDue, getConnectionModelMeta } from "@/data/connection-model-meta";

const FISHING_RAW: KnotContent[] = [
  ...TERMINAL_KNOTS,
  ...LINE_TO_LINE_KNOTS,
  ...LOOP_KNOTS,
  ...UTILITY_KNOTS,
  ...SEED_BATCH_2,
  ...SEED_BATCH_3_TERMINAL,
  ...SEED_BATCH_4,
  ...SEED_BATCH_5_TERMINAL,
  ...SEED_BATCH_6,
];

const BOATING_RAW: KnotContent[] = [...BOATING_BATCH_1, ...BOATING_BATCH_2, ...BOATING_BATCH_3];

function hydrate(raw: KnotContent): Knot {
  const content = applySeedComplete(applyVideo(applyHowTo(raw)));
  const m = getMechanics(content.id);
  if (!m) {
    throw new Error(`Missing mechanical profile for knot: ${content.id}`);
  }
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

/** Fishing modelled connections. Default pool — goldens stay fishing-only. */
export const FISHING_KNOTS: Knot[] = FISHING_RAW.map(hydrate);

/** Boating modelled connections. Isolated so fishing Decide never scores rope work. */
export const BOATING_KNOTS: Knot[] = BOATING_RAW.map(hydrate);

/** Backward-compatible alias of the fishing catalog. */
export const KNOTS: Knot[] = FISHING_KNOTS;

const BOATING_CONNECTION_JOBS = new Set<ConnectionJob>([
  "rope-to-cleat",
  "rope-to-bollard",
  "rope-to-ring",
  "fixed-eye",
  "loop-over-post",
  "rope-to-rope",
  "unequal-rope-join",
  "load-transfer",
  "stopper",
  "shorten-line",
  "mid-line-loop",
  "tension-line",
  "reef-or-bind",
]);

export function knotsForDomain(id: DomainId): Knot[] {
  return id === "boating" ? BOATING_KNOTS : FISHING_KNOTS;
}

/** Pool for a connection job. Counterfactuals inherit isolation from the job. */
export function catalogPoolFor(connection?: ConnectionJob): Knot[] {
  if (connection && BOATING_CONNECTION_JOBS.has(connection)) return BOATING_KNOTS;
  return FISHING_KNOTS;
}

export function getKnot(id: string): Knot | undefined {
  return FISHING_KNOTS.find((k) => k.id === id) ?? BOATING_KNOTS.find((k) => k.id === id);
}

export function knotsByCategory(category: KnotCategory): Knot[] {
  return KNOTS.filter((k) => k.category === category);
}

export function searchKnots(query: string, domain?: DomainId): Knot[] {
  const q = query.trim().toLowerCase();
  const pool = domain ? knotsForDomain(domain) : KNOTS;
  if (!q) return pool;
  return pool.filter((k) => {
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
    boatingCount: BOATING_KNOTS.length,
    engine: ENGINE_VERSION,
    layers: ["hard-constraint", "field-fit", "finished-diagnostic"],
    categories: {
      terminal: knotsByCategory("terminal").length,
      "line-to-line": knotsByCategory("line-to-line").length,
      loop: knotsByCategory("loop").length,
      specialty: knotsByCategory("specialty").length,
      rope: BOATING_KNOTS.length,
    },
    completeness: {
      withDecisionModel: KNOTS.filter((k) => k.completeness.decisionModel).length,
      withFingerprint: KNOTS.filter((k) => k.completeness.mechanicalFingerprint).length,
      withModelMeta: KNOTS.filter((k) => Boolean(getConnectionModelMeta(k.id))).length,
    },
    reviewDue: review.due,
    newestReviewed: review.newestReviewed,
    daysSinceReview: review.daysSince,
  };
}
