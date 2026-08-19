/** Batch 4 model meta — merged into CONNECTION_MODEL_META. */
import type { ConnectionModelMeta, ConditionAbility } from "@/data/connection-model-meta";
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

export const CONNECTION_MODEL_META_BATCH4: Record<string, ConnectionModelMeta> = {
  "orvis-tippet": {
    materialsValidityMatrix: { main: monoFluoro, secondary: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      88,
      96,
      "High band on similar-diameter mono/fluoro tippet steps; often cited near 90–95% when seated.",
    ),
    failsWhen: ["Uneven four-end seat", "Large diameter mismatch", "Dry seat on fluoro"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  seaguar: {
    materialsValidityMatrix: { main: monoFluoro, secondary: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      95,
      "Strong similar-diameter fluoro/mono join when twists and passes seat clean.",
    ),
    failsWhen: ["Too few twists", "Uneven seat", "Forced diameter jump"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  "j-knot": {
    materialsValidityMatrix: { main: monoFluoro, secondary: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      88,
      98,
      "High similar-diameter tippet-step band in independent shootout-style testing when seated.",
    ),
    failsWhen: ["Incomplete passes", "Tippet step too large", "Dry fluoro seat"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  "aussie-quickie": {
    materialsValidityMatrix: { main: ["braid"], secondary: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      80,
      95,
      "Competitive braid-leader band when wraps seat; technique-sensitive like the rest of the diameter-jump family.",
    ),
    failsWhen: ["Loose early wraps", "Incomplete lock", "Long stiff tags"],
    diameterMismatchTolerance: "wide",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  "needle-knot": {
    materialsValidityMatrix: { main: ["fly-line"], secondary: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "slow",
    strengthRetentionBand: band(
      85,
      92,
      "Same family band as Nail Knot when the coil fully seats on the fly-line tip.",
    ),
    failsWhen: ["Gapped wraps", "Coil not on fly line", "Core damage from needle path"],
    diameterMismatchTolerance: "extreme-ok",
    guidesFriendly: true,
    sourceId: "fishingknots-db",
    reviewedDate: "2026-08-14",
  },
  "homer-rhode": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      80,
      95,
      "Solid heavy-leader loop band when the non-slip structure completes.",
    ),
    failsWhen: ["Loop collapses while seating", "Too few wraps on heavy leader"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  "king-sling": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(85, 95, "Solid fixed end-loop band when sequence is correct."),
    failsWhen: ["Wrong loop order", "Loop larger than needed for the system"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  "australian-plait": {
    materialsValidityMatrix: { main: ["mono", "fluoro", "braid"] },
    tieAbilityUnderCondition: tie("poor", "poor", "impractical", "poor"),
    retieTempoFit: "dock-only",
    strengthRetentionBand: band(
      90,
      100,
      "High double-line band when the plait is tight and locked; inspect before trusting big fish.",
    ),
    failsWhen: ["Loose plait", "Incomplete lock", "Too short a double"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
};
