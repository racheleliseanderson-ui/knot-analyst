/**
 * Gold-standard modelled-connection fields.
 * Constraint-first: these describe decision/diagnosis intelligence only.
 * Strength bands are always ranges from cited sources — never a false-precise single %.
 */
import type { LineMaterial } from "@/domain/types";

export type ConditionAbility = "excellent" | "good" | "fair" | "poor" | "impractical";
export type RetieTempo = "instant" | "fast" | "moderate" | "slow" | "dock-only";

export interface MaterialsValidityMatrix {
  /** Materials this connection is rated for as primary / main. */
  main: LineMaterial[];
  /** Materials valid on the secondary / leader / tippet side (omit for single-side terminals). */
  secondary?: LineMaterial[];
  /** Explicitly invalid combinations (hard exclusions for scoring). */
  invalidPairs?: Array<{ main: LineMaterial; secondary: LineMaterial; reason: string }>;
}

export interface TieAbilityUnderCondition {
  cold: ConditionAbility;
  wind: ConditionAbility;
  lowLight: ConditionAbility;
  boatMotion: ConditionAbility;
}

/** Inclusive % band of rated line strength retained when the connection is seated correctly. */
export interface StrengthRetentionBand {
  lowPct: number;
  highPct: number;
  /** Short citation key — must resolve via sourceId. */
  note: string;
}

export interface ConnectionModelMeta {
  materialsValidityMatrix: MaterialsValidityMatrix;
  tieAbilityUnderCondition: TieAbilityUnderCondition;
  retieTempoFit: RetieTempo;
  strengthRetentionBand: StrengthRetentionBand;
  failsWhen: string[];
  /** How tolerant the geometry is of diameter mismatch (decision language, not a formula). */
  diameterMismatchTolerance: "strict-similar" | "moderate" | "wide" | "extreme-ok" | "n/a";
  guidesFriendly: boolean;
  sourceId: string;
  reviewedDate: string; // YYYY-MM-DD
}

/**
 * Source registry for strength / validity claims.
 * Keep URLs stable; meta.sourceId must match a key here.
 */
export const MODEL_SOURCES: Record<
  string,
  { title: string; url?: string; note?: string }
> = {
  "fishingknots-db": {
    title: "FishingKnots.com Knot Strength Database",
    url: "https://fishingknots.com/knot-strength-database",
    note: "Aggregated retention ranges by material; treat as indicative bands.",
  },
  "knots-fish-benchmarks": {
    title: "knots.fish — Knot Strength Benchmarks",
    url: "https://knots.fish/guides/how-to-test-fishing-knot-strength/",
    note: "Target / minimum acceptable retention ranges for common families.",
  },
  "tom-rowland-tests": {
    title: "Tom Rowland Podcast / Tie it–Test it series",
    url: "https://www.tomrowlandpodcast.com/",
    note: "Independent pull tests; percentages vary by line class and seating.",
  },
  "sportfishing-braid-leader": {
    title: "Sport Fishing Mag — Strongest braid-to-leader challenge results",
    url: "https://www.sportfishingmag.com/strongest-fishing-knots-braid-to-leader/",
    note: "Field-tied competition results; technique-sensitive real-world bands.",
  },
  "castandspear-yucatan": {
    title: "Cast & Spear — Yucatan Knot overview",
    url: "https://castandspear.com/yucatan-knot/",
    note: "Doubled-line to leader practice claims near full retention when Bimini base is sound.",
  },
  "animated-knots": {
    title: "Animated Knots by Grog — fishing knot family references",
    url: "https://www.animatedknots.com/",
    note: "Structural / application authority; strength figures cross-checked elsewhere.",
  },
  "field-practice": {
    title: "Common offshore / inshore field practice (cross-checked)",
    note: "Used only when multiple independent sources agree on band shape.",
  },
};

const monoFluoro = ["mono", "fluoro"] as LineMaterial[];
const braidOk = ["mono", "fluoro", "braid"] as LineMaterial[];

function band(lowPct: number, highPct: number, note: string): StrengthRetentionBand {
  return { lowPct, highPct, note };
}

function tie(
  cold: ConditionAbility,
  wind: ConditionAbility,
  lowLight: ConditionAbility,
  boatMotion: ConditionAbility,
): TieAbilityUnderCondition {
  return { cold, wind, lowLight, boatMotion };
}

/**
 * Every id in MECHANICS must appear here. Validation fails closed on missing keys.
 */
export const CONNECTION_MODEL_META: Record<string, ConnectionModelMeta> = {
  palomar: {
    materialsValidityMatrix: { main: braidOk },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(90, 100, "Typically high 90s when doubled line seats clean; braid often near top of band."),
    failsWhen: [
      "Eye too small for doubled line",
      "Dry seat on mono/fluoro scores the line",
      "Tag sucked into the stack",
      "Chaotic crossed coils at the eye",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "knots-fish-benchmarks",
    reviewedDate: "2026-08-13",
  },
  "improved-clinch": {
    materialsValidityMatrix: {
      main: monoFluoro,
      invalidPairs: [{ main: "braid", secondary: "braid", reason: "Slippery braid terminals need Uni/Palomar family" }],
    },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(78, 95, "Solid on mono/fluoro when improved pass is complete; poor on braid."),
    failsWhen: ["Too few wraps", "Skipped improved tuck", "Braid used as primary terminal", "Dry seat"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "tom-rowland-tests",
    reviewedDate: "2026-08-13",
  },
  "uni-knot": {
    materialsValidityMatrix: { main: braidOk },
    tieAbilityUnderCondition: tie("good", "good", "good", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(82, 95, "Strong multi-material terminal when barrel is uniform and locked at the eye."),
    failsWhen: ["Barrel not slid fully to eye", "Under-wrapped braid", "Crossed barrel wraps"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  trilene: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "good"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(85, 95, "Double-pass eye friction helps mono/fluoro; not a braid primary."),
    failsWhen: ["Single pass only", "Dry seat", "Tiny eyes that will not accept double pass"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  snell: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "slow",
    strengthRetentionBand: band(85, 95, "Shank-aligned pull; strength is geometry + wrap compression, not eye friction alone."),
    failsWhen: ["Crossed shank wraps", "Too few wraps", "Finish short of the eye", "Loose column"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-13",
  },
  "non-slip-mono-loop": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(80, 100, "High when non-slip structure completes; collapses if tag path is wrong."),
    failsWhen: ["Loop cinches closed", "Too few wraps", "Wrong tag path through overhand"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  rapala: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(85, 95, "Hardbait loop family; free-swing depends on completed non-slip lock."),
    failsWhen: ["Loop walks or collapses", "Under-wrapping light line", "Incomplete overhand lock"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "san-diego-jam": {
    materialsValidityMatrix: { main: braidOk },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(88, 96, "High on heavy fluoro/jig eyes when both loop passes complete and stack rolls down."),
    failsWhen: ["Missed second loop pass", "Wraps toward the eye instead of away", "Dry seat on fluoro"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "double-uni": {
    materialsValidityMatrix: {
      main: braidOk,
      secondary: braidOk,
    },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(82, 92, "Reliable general connector; lag FG on extreme diameter jumps for guide passage."),
    failsWhen: ["Barrels not butted", "Too few wraps on braid side", "Extreme mismatch forced through guides"],
    diameterMismatchTolerance: "moderate",
    guidesFriendly: false,
    sourceId: "knots-fish-benchmarks",
    reviewedDate: "2026-08-13",
  },
  fg: {
    materialsValidityMatrix: {
      main: ["braid"],
      secondary: monoFluoro,
      invalidPairs: [
        { main: "mono", secondary: "mono", reason: "FG is a braid-on-leader compression join" },
        { main: "fluoro", secondary: "fluoro", reason: "FG is a braid-on-leader compression join" },
      ],
    },
    tieAbilityUnderCondition: tie("impractical", "poor", "poor", "poor"),
    retieTempoFit: "dock-only",
    strengthRetentionBand: band(73, 100, "Near full retention when woven under tension; field-tied competition results show wide technique variance."),
    failsWhen: [
      "Loose early wraps",
      "Insufficient leader tension",
      "Missing lock hitches",
      "Long stiff leader tag catching guides",
    ],
    diameterMismatchTolerance: "extreme-ok",
    guidesFriendly: true,
    sourceId: "sportfishing-braid-leader",
    reviewedDate: "2026-08-13",
  },
  alberto: {
    materialsValidityMatrix: {
      main: ["braid"],
      secondary: monoFluoro,
    },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(80, 95, "Field-friendlier than FG; typically a step below perfect FG on pure strength."),
    failsWhen: ["Uneven down/back wraps", "Wrong re-entry direction", "Under-seated barrel"],
    diameterMismatchTolerance: "wide",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  albright: {
    materialsValidityMatrix: {
      main: ["mono", "fluoro", "braid", "fly-line", "mixed"],
      secondary: ["mono", "fluoro", "braid", "mixed"],
    },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(80, 92, "Classic diameter-mismatch join; bulk can hinge if messy."),
    failsWhen: ["Too few wraps", "Reversed tag direction", "Loose first wraps", "Heavy-to-heavy bulk hinge"],
    diameterMismatchTolerance: "wide",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-13",
  },
  blood: {
    materialsValidityMatrix: {
      main: monoFluoro,
      secondary: monoFluoro,
    },
    tieAbilityUnderCondition: tie("poor", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(80, 92, "Slim similar-diameter mono/fluoro join; intolerant of mismatch."),
    failsWhen: ["Diameter mismatch", "Unequal wraps", "Tags pulled instead of standings to seat"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  surgeons: {
    materialsValidityMatrix: {
      main: monoFluoro,
      secondary: monoFluoro,
    },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(85, 95, "Fast tippet join; bulkier than Blood but cold-hand friendly."),
    failsWhen: ["Single pass only on slick fluoro", "Uneven four-end seat", "Dry seating"],
    diameterMismatchTolerance: "moderate",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "perfection-loop": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(85, 95, "Compact fixed end loop when sequence is correct."),
    failsWhen: ["Wrong loop order", "Tag path creates a slip loop"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-13",
  },
  "surgeons-loop": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("excellent", "excellent", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(88, 98, "Fast fixed loop; bulkier than perfection."),
    failsWhen: ["Single overhand only", "Loop larger than needed for the system"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "bimini-twist": {
    materialsValidityMatrix: { main: braidOk },
    tieAbilityUnderCondition: tie("impractical", "poor", "impractical", "poor"),
    retieTempoFit: "dock-only",
    strengthRetentionBand: band(95, 100, "Creates near-full-strength double line when twist column is dense and locked."),
    failsWhen: ["Lost tension mid-twist", "Too few twists", "Incomplete lock hitches"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "dropper-loop": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(75, 90, "Mid-line standing loop; poor formation weakens the main."),
    failsWhen: ["Off-centre pass-through", "Too few twists", "Hard snatch instead of steady seat"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-13",
  },
  "arbor-knot": {
    materialsValidityMatrix: { main: ["mono", "fluoro", "braid", "backing"] },
    tieAbilityUnderCondition: tie("excellent", "excellent", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(50, 80, "Rig-up only — must resist spool slip while first wraps bed; not a fighting terminal."),
    failsWhen: ["Braid on bare metal arbor", "No stopper in tag", "Never cinched to arbor"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-13",
  },
  yucatan: {
    materialsValidityMatrix: {
      main: ["braid"],
      secondary: monoFluoro,
    },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(90, 100, "Doubled braid to leader; near full retention when Bimini (or equivalent double) base is sound."),
    failsWhen: [
      "Single-line braid used without a proper double",
      "Insufficient wraps on the leader",
      "Loose seat leaving a hinge",
    ],
    diameterMismatchTolerance: "wide",
    guidesFriendly: false,
    sourceId: "castandspear-yucatan",
    reviewedDate: "2026-08-13",
  },
};

export function getConnectionModelMeta(id: string): ConnectionModelMeta | undefined {
  return CONNECTION_MODEL_META[id];
}

/** Catalog is review-due when the newest reviewedDate is older than this many days. */
export const REVIEW_DUE_AFTER_DAYS = 120;

export function catalogReviewDue(asOf: Date = new Date()): {
  due: boolean;
  newestReviewed: string | null;
  daysSince: number | null;
} {
  const dates = Object.values(CONNECTION_MODEL_META).map((m) => m.reviewedDate).sort();
  const newest = dates[dates.length - 1] ?? null;
  if (!newest) return { due: true, newestReviewed: null, daysSince: null };
  const newestMs = Date.parse(`${newest}T00:00:00Z`);
  const days = Math.floor((asOf.getTime() - newestMs) / 86_400_000);
  return { due: days > REVIEW_DUE_AFTER_DAYS, newestReviewed: newest, daysSince: days };
}
