/** Terminal batch 3 model meta — merged into CONNECTION_MODEL_META. */
import type {
  ConnectionModelMeta,
  ConditionAbility,
  RetieTempo,
} from "@/data/connection-model-meta";
import type { LineMaterial } from "@/domain/types";

const monoFluoro = ["mono", "fluoro"] as LineMaterial[];

function band(lowPct: number, highPct: number, note: string) {
  return { lowPct, highPct, note };
}
function tie(
  cold: ConditionAbility,
  wind: ConditionAbility,
  lowLight: ConditionAbility,
  boatMotion: ConditionAbility,
) {
  return { cold, wind, lowLight, boatMotion };
}

export const CONNECTION_MODEL_META_TERMINAL: Record<string, ConnectionModelMeta> = {
  "berkley-braid": {
    materialsValidityMatrix: { main: ["braid"] },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      95,
      "High on braid when doubled and seated; published single figures treated as technique-dependent band.",
    ),
    failsWhen: [
      "Eye too small for the doubled braid pass",
      "Barrel under-wrapped so braid slips at the eye",
      "Tag never locked after the extra braid passes",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  davy: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("good", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(
      85,
      92,
      "Solid tippet band when fully seated; speed is the primary job.",
    ),
    failsWhen: [
      "Wrong hitch path — an overhand that slips",
      "Hitch not slid to the eye",
      "Oversized fly without stepping to Double Davy",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "double-davy": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("good", "good", "good", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      88,
      95,
      "Slightly more secure than single Davy when the second pass seats.",
    ),
    failsWhen: [
      "Stopped after one pass — that is a Davy",
      "Second pass never seated to the eye",
      "First pass cinched so the second cannot enter",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  "egg-loop": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      92,
      "High when shank wraps are even; geometry matters as much as raw retention.",
    ),
    failsWhen: [
      "Shank wraps stacked on each other",
      "Seat closed the bait loop",
      "Loop size set after the wraps",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  orvis: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("good", "good", "good", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      88,
      95,
      "High compact band on mono/fluoro tippet when seated fully.",
    ),
    failsWhen: [
      "Compact path incomplete — not an Orvis",
      "Dry half-seat on fluoro",
      "Tag too short to finish the compact path",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  pitzen: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(88, 98, "High band when wraps are even and tag path is correct."),
    failsWhen: [
      "Guessed wrap count, uneven stack",
      "Seated early on a wrong path",
      "Tag buried in the stack",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-13",
  },
  turle: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      75,
      88,
      "Moderate band; fly alignment is the job more than peak retention.",
    ),
    failsWhen: [
      "Collar sitting mid-shank instead of the eye",
      "Incomplete cinch on a ring eye",
      "No loop formed to collar the eye",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-13",
  },
  baja: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      95,
      "Strong band on heavy mono/fluoro when wraps are even and seated wet.",
    ),
    failsWhen: [
      "Crossed heavy fluoro wraps that will not dress",
      "Too few wraps for the diameter",
      "Sawing dry heavy fluoro on the seat",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-13",
  },
  clinch: {
    materialsValidityMatrix: {
      main: monoFluoro,
      invalidPairs: [
        {
          main: "braid",
          secondary: "braid",
          reason: "Basic clinch slips on braid; use Palomar/Uni/Berkley Braid",
        },
      ],
    },
    tieAbilityUnderCondition: tie("good", "good", "good", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      70,
      88,
      "Lower band than Improved Clinch; adequate when wraps are sufficient.",
    ),
    failsWhen: [
      "Uncounted or crossed clinch wraps",
      "Tag never went back through the eye loop",
      "Fished as if it were Improved, or used on braid",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-13",
  },
  "uni-snell": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(85, 95, "High when Uni barrel compresses evenly on the shank."),
    failsWhen: [
      "Barrel not fully compressed onto the shank",
      "Crossed wraps in the Uni barrel",
      "Finish short of the eye — the snell never captured it",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-13",
  },
  "easy-snell": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("good", "good", "fair", "fair"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(85, 95, "Snell-family band when wraps are parallel and seated."),
    failsWhen: [
      "Wraps walked off the shank",
      "Too few turns to capture the eye",
      "Loose finish so the snell slides on the first fish",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-13",
  },
};
