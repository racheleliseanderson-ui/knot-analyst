/** Batch 6 model meta. */
import type { ConnectionModelMeta, ConditionAbility } from "@/data/connection-model-meta";

function band(lowPct: number, highPct: number, note: string) {
  return { lowPct, highPct, note };
}
function tie(cold: ConditionAbility, wind: ConditionAbility, lowLight: ConditionAbility, boatMotion: ConditionAbility) {
  return { cold, wind, lowLight, boatMotion };
}

export const CONNECTION_MODEL_META_BATCH6: Record<string, ConnectionModelMeta> = {
  bristol: {
    materialsValidityMatrix: {
      main: ["braid"],
      secondary: ["mono", "fluoro"],
    },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "slow",
    strengthRetentionBand: band(70, 85, "Tom Rowland No-Name/Bristol braid-to-fluoro tests averaged ~77%. Band is that test spread when the double is sound."),
    failsWhen: ["No prerequisite double", "Crossed leader wraps", "Return misses both legs"],
    diameterMismatchTolerance: "extreme-ok",
    guidesFriendly: true,
    sourceId: "tom-rowland-tests",
    reviewedDate: "2026-08-14",
  },
  "double-double-uni": {
    materialsValidityMatrix: { main: ["braid"], secondary: ["mono", "fluoro"] },
    tieAbilityUnderCondition: tie("fair", "fair", "poor", "fair"),
    retieTempoFit: "moderate",
    strengthRetentionBand: band(75, 90, "Uni-join family with a doubled braid barrel. More grip than Double Uni; not an FG-slim figure."),
    failsWhen: ["Braid not doubled through the barrel", "Too few braid wraps", "One Uni closes first"],
    diameterMismatchTolerance: "wide",
    guidesFriendly: false,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  "loop-to-loop": {
    materialsValidityMatrix: { main: ["fly-line", "mono", "fluoro"], secondary: ["mono", "fluoro"] },
    tieAbilityUnderCondition: tie("good", "good", "good", "good"),
    retieTempoFit: "instant",
    strengthRetentionBand: band(70, 95, "Join is only as honest as the weaker loop. No independent retention figure for the handshake itself."),
    failsWhen: ["Girth-hitch assembly", "Damaged factory loop", "Oversized leader loop"],
    diameterMismatchTolerance: "moderate",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  willis: {
    materialsValidityMatrix: { main: ["braid"], secondary: ["mono"] },
    tieAbilityUnderCondition: tie("poor", "poor", "impractical", "poor"),
    retieTempoFit: "dock-only",
    strengthRetentionBand: band(60, 85, "Finger-trap on an intact lead-core sheath. No published single figure; band is insertion-length dependent."),
    failsWhen: ["Sheath cut pulling lead", "Shallow insertion", "Lead left under the grip"],
    diameterMismatchTolerance: "extreme-ok",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
  "kryston-loop": {
    materialsValidityMatrix: {
      main: ["mono"],
      invalidPairs: [{ main: "fluoro", secondary: "fluoro", reason: "NetKnots material notes: poor in fluorocarbon" }],
    },
    tieAbilityUnderCondition: tie("good", "good", "fair", "good"),
    retieTempoFit: "fast",
    strengthRetentionBand: band(80, 95, "NetKnots: tests well in mono, poorly in fluoro. Band is the mono result only."),
    failsWhen: ["Fluoro substituted", "Loop closes", "Reversed return path"],
    diameterMismatchTolerance: "n/a",
    guidesFriendly: true,
    sourceId: "netknots",
    reviewedDate: "2026-08-14",
  },
};
