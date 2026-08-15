/** Boating batch 3 model meta. */
import type { ConnectionModelMeta, ConditionAbility } from "@/data/connection-model-meta";
import type { LineMaterial } from "@/domain/types";

const rope = ["polyester", "nylon", "polypropylene", "natural"] as LineMaterial[];

function band(lowPct: number, highPct: number, note: string) {
  return { lowPct, highPct, note };
}
function tie(cold: ConditionAbility, wind: ConditionAbility, lowLight: ConditionAbility, boatMotion: ConditionAbility) {
  return { cold, wind, lowLight, boatMotion };
}

export const CONNECTION_MODEL_META_BOATING_3: Record<string, ConnectionModelMeta> = {
  "yosemite-bowline": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(60, 75, "Animated Knots Yosemite-bowline class: same working-loop band as a bowline. The finish secures the tail; it is not extra strength."),
    failsWhen: ["Yosemite tuck dressed before the collar", "Tail not captured in the nipping loop", "Tied in HMPE"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "pile-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(50, 70, "Animated Knots pile hitch. Temporary mooring; holds while both legs load. Not a standing-soak figure."),
    failsWhen: ["Bight never recleared the top", "Used overnight through a tide", "Only one leg loaded"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "halyard-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(60, 75, "Animated Knots: compact shackle hitch. Band is hold, not easy-release — it jams after load."),
    failsWhen: ["Turns never tucked back toward the shackle", "Expected to break by hand after a hoist", "HMPE without a splice"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "midshipmans-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("good", "fair", "fair", "fair"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(45, 65, "Animated Knots Midshipman's (taut-line alias). The extra inside tuck is the hold. Band is working-tension hold, not rope-break."),
    failsWhen: ["Inside tuck missing (that is a taut-line)", "Turns on the wrong side of the load", "Used as a lock-and-leave purchase"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "hunters-bend": {
    materialsValidityMatrix: { main: rope, secondary: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(65, 80, "Animated Knots Hunter's / Rigger's bend. Holds in synthetic rope; can jam after a heavy load. Dressed working band."),
    failsWhen: ["Same-side tails", "Extreme diameter mismatch", "Expected to untie after a heavy snatch"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "heaving-line-knot": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(40, 60, "Animated Knots heaving-line knot. Band is throwing mass, not rope-break. Not a block stopper."),
    failsWhen: ["Too few wraps to carry", "Used as a load-bearing stopper", "Wraps left loose so they dump"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "estar-stopper": {
    materialsValidityMatrix: { main: ["dyneema", "polyester"] },
    tieAbilityUnderCondition: tie("poor", "fair", "poor", "poor"),
    retieTempoFit: "slow",
    strengthRetentionBand: band(50, 70, "Animated Knots EStar. Built for slippery HMPE. Band is 'will not pull through,' not a join. Other stoppers walk in Dyneema."),
    failsWhen: ["Tied as a figure-8 and called Estar", "Used as a join", "Left loose in HMPE"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "reef-knot": {
    materialsValidityMatrix: { main: rope, secondary: rope },
    tieAbilityUnderCondition: tie("excellent", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(40, 60, "Animated Knots square / reef knot. Binding-hold only. Documented slip when used as a bend — never a rope-break figure."),
    failsWhen: ["Used as a rope-to-rope join", "Granny (same-hand twice)", "Unequal diameters"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  constrictor: {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "good", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(50, 70, "Animated Knots constrictor. Binding-hold; usually cut rather than untied. Band is hold, not release."),
    failsWhen: ["Left as a clove (no riding-turn tuck)", "Expected to untie after a hard dress", "Used as a join"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "timber-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(45, 65, "Animated Knots timber hitch. Holds under tension only; collapses unloaded. Band is working hoist, not a standing figure."),
    failsWhen: ["Too few dogged tucks", "Expected to hold slack", "Used as a chain snubber"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
};
