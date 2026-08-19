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
    failsWhen: ["Eye too small for doubled braid", "Under-wrapped barrel", "Incomplete lock"],
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
    failsWhen: ["Incomplete seat", "Oversized fly without stepping to Double Davy"],
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
    failsWhen: ["Skipped second pass", "Incomplete seat"],
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
    failsWhen: ["Crossed wraps", "Loop too small to hold bait", "Loose column"],
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
    failsWhen: ["Incomplete sequence", "Dry seat on fluoro"],
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
    failsWhen: ["Wrong tag path", "Uneven wraps", "Under-seating"],
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
    failsWhen: ["Seating on the wrong side of the eye", "Incomplete cinch"],
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
    failsWhen: ["Dry seat on stiff fluoro", "Too few wraps for the diameter"],
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
    failsWhen: ["Too few wraps", "Dry seat", "Braid used as primary"],
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
    failsWhen: ["Barrel not fully compressed", "Crossed wraps", "Finish short of the eye"],
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
    failsWhen: ["Crossed wraps", "Too few turns", "Loose finish"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-13",
  },
};
