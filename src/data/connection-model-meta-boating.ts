/** Boating batch 1 model meta. */
import type { ConnectionModelMeta, ConditionAbility } from "@/data/connection-model-meta";
import type { LineMaterial } from "@/domain/types";

const rope = ["polyester", "nylon", "polypropylene", "natural"] as LineMaterial[];

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

export const CONNECTION_MODEL_META_BOATING: Record<string, ConnectionModelMeta> = {
  "cleat-hitch": {
    materialsValidityMatrix: { main: [...rope, "dyneema"] },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      70,
      95,
      "Make-fast, not a rope-break figure. BoatUS / Animated Knots: holds when far-horn first turn and lock are dressed.",
    ),
    failsWhen: ["First turn on the near horn", "Jammed lock hitch", "No full turn on the base"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "round-turn-two-half-hitches": {
    materialsValidityMatrix: { main: [...rope, "dyneema"] },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      60,
      75,
      "Animated Knots working-hitch class: round turn carries load, hitches only lock.",
    ),
    failsWhen: ["No round turn", "Opposite-direction hitches", "Too few turns on HMPE"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "clove-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(
      60,
      70,
      "Animated Knots: holds when dressed and watched; documented walk-off under cycling load.",
    ),
    failsWhen: ["Left unattended on a tide", "Turns not stacked", "Used as overnight mooring"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "anchor-bend": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      70,
      80,
      "Animated Knots / field practice: high hitch band when the round turn is seized or well dressed.",
    ),
    failsWhen: ["No round turn", "Unseized standing job", "HMPE without extra security"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  bowline: {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      60,
      75,
      "Animated Knots typical ~60% class; published tests commonly 60–75%. Can capsize if undressed.",
    ),
    failsWhen: [
      "Undressed collar",
      "No backup on a critical job",
      "Tied in HMPE and treated like polyester",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "figure-8-loop": {
    materialsValidityMatrix: { main: [...rope, "dyneema"] },
    tieAbilityUnderCondition: tie("good", "good", "good", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      75,
      85,
      "Animated Knots / climbing literature: typically higher and more stable than a bowline.",
    ),
    failsWhen: ["Crossed eights", "Expected to untie after a hard snatch"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "sheet-bend": {
    materialsValidityMatrix: { main: rope, secondary: rope },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      45,
      65,
      "Animated Knots working-bend class. Not a splice. Tails must exit the same side.",
    ),
    failsWhen: ["Opposite-side tails", "Large diameter mismatch", "HMPE"],
    diameterMismatchTolerance: "moderate",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "double-sheet-bend": {
    materialsValidityMatrix: { main: rope, secondary: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      55,
      75,
      "Animated Knots: more stable than a single sheet bend on a mismatch.",
    ),
    failsWhen: ["Bight in the thinner rope", "Only one turn", "Opposite-side tails"],
    diameterMismatchTolerance: "wide",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "rolling-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      50,
      70,
      "Grip hitch. Animated Knots / field practice: slides first. Surface-dependent.",
    ),
    failsWhen: [
      "Turns on the wrong side of the load",
      "Slick HMPE standing part",
      "Expected to hold both directions",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "figure-8-stopper": {
    materialsValidityMatrix: { main: [...rope, "dyneema"] },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(
      50,
      70,
      "Stopper only — not a working-join figure. Band is 'will not pull through,' not rope-break.",
    ),
    failsWhen: ["Used as a join", "Too small for the block", "Left loose"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
};
