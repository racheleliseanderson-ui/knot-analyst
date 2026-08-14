/** Boating batch 2 model meta. */
import type { ConnectionModelMeta, ConditionAbility } from "@/data/connection-model-meta";
import type { LineMaterial } from "@/domain/types";

const rope = ["polyester", "nylon", "polypropylene", "natural"] as LineMaterial[];

function band(lowPct: number, highPct: number, note: string) {
  return { lowPct, highPct, note };
}
function tie(cold: ConditionAbility, wind: ConditionAbility, lowLight: ConditionAbility, boatMotion: ConditionAbility) {
  return { cold, wind, lowLight, boatMotion };
}

export const CONNECTION_MODEL_META_BOATING_2: Record<string, ConnectionModelMeta> = {
  "water-bowline": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(60, 75, "Animated Knots water-bowline class: same working-loop band as a bowline, clove collar resists wet capsize."),
    failsWhen: ["Loops not formed as a clove", "Clove left loose", "Tied in HMPE"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "bowline-on-a-bight": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(60, 70, "Animated Knots: two mid-line loops. Band is the working-loop class when the bight encircles both standings."),
    failsWhen: ["Bight never encircled both standing parts", "Used for three-way load", "Unequal undressed loops"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "alpine-butterfly": {
    materialsValidityMatrix: { main: [...rope, "dyneema"] },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(60, 75, "Animated Knots mid-line loop. Both ends and the loop can be loaded. Published working bands commonly 60–75%."),
    failsWhen: ["Wrong wrap order", "Twisted body", "Used as an end-loop when a bowline would do"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "cow-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("excellent", "excellent", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(45, 65, "Animated Knots cow hitch / lark's head. Holds when both legs load; documented slip on a single-leg load."),
    failsWhen: ["Only one leg loaded", "Used as overnight mooring", "Loose dress"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "buntline-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(60, 75, "Animated Knots: excellent jamming hitch. Band is hold, not easy-release."),
    failsWhen: ["Second turn tied outside", "Expected to untie after a snatch", "HMPE without a splice"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "icicle-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("poor", "fair", "impractical", "poor"),
    retieTempoFit: "slow",
    strengthRetentionBand: band(50, 75, "Grip hitch. Animated Knots: holds on tapers and slick standing parts a rolling hitch slides on. Surface-dependent."),
    failsWhen: ["Turns toward the pull", "Too few turns", "Never set perpendicular"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "truckers-hitch": {
    materialsValidityMatrix: { main: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(50, 70, "Tensioning system, not a rope-break figure. Advantage ~2:1–3:1; lock is two half hitches."),
    failsWhen: ["Loop collapses under purchase", "No lock after tensioning", "Used as a chain snubber"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "zeppelin-bend": {
    materialsValidityMatrix: { main: rope, secondary: rope },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(70, 85, "Animated Knots secure bend class. Published tests commonly 70–85% dressed; does not jam."),
    failsWhen: ["Both working ends on the same side", "One end missing the second loop", "Extreme diameter mismatch"],
    diameterMismatchTolerance: "strict-similar",
    guidesFriendly: true,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "carrick-bend": {
    materialsValidityMatrix: { main: rope, secondary: rope },
    tieAbilityUnderCondition: tie("poor", "fair", "poor", "poor"),
    retieTempoFit: "slow",
    strengthRetentionBand: band(65, 80, "Animated Knots hawser bend. Seize the tails on a standing job. Band is dressed-and-seized."),
    failsWhen: ["Broken over-under lattice", "Unseized standing hawser", "Used on small soft line"],
    diameterMismatchTolerance: "moderate",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
  "ashley-stopper": {
    materialsValidityMatrix: { main: [...rope, "dyneema"] },
    tieAbilityUnderCondition: tie("fair", "good", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(50, 70, "Stopper only. Animated Knots: bulky three-lobed stopper. Band is 'will not pull through,' not rope-break."),
    failsWhen: ["Left as a two-lobe overhand", "Used as a join", "Too small for the opening"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: false,
    sourceId: "animated-knots",
    reviewedDate: "2026-08-14",
  },
};
