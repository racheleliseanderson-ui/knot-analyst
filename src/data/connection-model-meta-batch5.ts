/** Batch 5 remaining-terminal model meta. */
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

export const CONNECTION_MODEL_META_BATCH5: Record<string, ConnectionModelMeta> = {
  centauri: {
    materialsValidityMatrix: {
      main: ["mono"],
      invalidPairs: [
        {
          main: "braid",
          secondary: "braid",
          reason: "Centauri collar is a nylon knot; braid will not grip it",
        },
      ],
    },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      80,
      95,
      "Sliding-collar nylon family; Geoff Wilson / NetKnots treat it as a low-friction mono terminal — not a published single figure.",
    ),
    failsWhen: ["Loops closed out of order", "Used on braid", "Hard pull before the collar forms"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  "eye-crosser": {
    materialsValidityMatrix: { main: ["mono", "fluoro", "braid"] },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      95,
      "Double-eye family (Trilene/Eye Crosser). Take Me Fishing documents all three line types; treat as a high band only when both passes stay parallel.",
    ),
    failsWhen: ["Eye too small for two passes", "Crossed eye strands", "Incomplete braid set"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  "fish-n-fool": {
    materialsValidityMatrix: { main: ["mono", "fluoro", "braid"] },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      90,
      100,
      "Knot Wars class winner; Uni-plus-second-eye-pass family. Published >100% lab efficiencies vs rated line are discarded — band is the seated high-90s claim.",
    ),
    failsWhen: [
      "Second eye pass crosses the first",
      "Too few wraps on braid",
      "Barrel closes before the eye",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  "harvey-dry-fly": {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "poor"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      75,
      90,
      "Presentation-angle knot (NetKnots / Harvey). Not modelled as a max-retention terminal — Turle-family band.",
    ),
    failsWhen: [
      "Used on a straight-eye fly",
      "Knot rolls around the eye",
      "Stiff tippet overwhelms the dry",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  jacks: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      80,
      95,
      "Compact tippet lock (NetKnots / Orvis coverage). Same family band as Davy/Orvis when the crossing seats centered.",
    ),
    failsWhen: ["Reversed crossing", "Tag exits the wrong side", "Braid used"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  jansik: {
    materialsValidityMatrix: { main: monoFluoro },
    tieAbilityUnderCondition: tie("fair", "fair", "good", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      80,
      100,
      "NetKnots / Take Me Fishing: near-full on light nylon; independent reports ~83%. Band is that spread, not a single figure.",
    ),
    failsWhen: ["Eye crowding", "Crossed triple pass", "Heavy stiff leader"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  knotless: {
    materialsValidityMatrix: { main: ["mono", "fluoro", "braid"] },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      95,
      "Snell-family wrap band. Hair-rig job; retention is wrap-column friction, not a lure-terminal figure.",
    ),
    failsWhen: ["Hair length set after wraps", "Crossed shank column", "Wrong eye-exit direction"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "field-practice",
    reviewedDate: "2026-08-14",
  },
  nanofil: {
    materialsValidityMatrix: { main: ["braid"] },
    tieAbilityUnderCondition: tie("fair", "fair", "fair", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(
      85,
      100,
      "Berkley / NetKnots Double Palomar for fused superline. Palomar-family high band only with the second overhand pass complete.",
    ),
    failsWhen: [
      "Single Palomar used on NanoFil",
      "Crossed doubled line",
      "Hardware catches the large loop",
    ],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  "world-fair": {
    materialsValidityMatrix: {
      main: monoFluoro,
      invalidPairs: [
        {
          main: "braid",
          secondary: "braid",
          reason: "World Fair is a nylon/fluoro contest knot; not braid-verified",
        },
      ],
    },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(
      85,
      100,
      "DuPont contest knot; Vic Dunaway / NetKnots treat it as a high nylon band. Not a published single lab figure.",
    ),
    failsWhen: ["Missed return opening", "Rolled crossing", "Used on braid"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
};
