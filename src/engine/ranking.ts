/**
 * Layer 2 — Field-Fit Ranking Engine
 * Ranks only knots that survived Layer 1. Exposes dimension scores.
 * Inactive field conditions do not drag scores (weights collapse toward zero).
 */
import {
  DIMENSION_LABELS,
  FIELD_FIT_DIMENSIONS,
  type ChooseInput,
  type DimensionScore,
  type FieldFitScores,
  type Knot,
  type RankedOption,
} from "@/domain/types";
import { FISHING_WEIGHTS } from "@/domains/fishing/dimensions";

type Dim = (typeof FIELD_FIT_DIMENSIONS)[number];

/** Weights come from the active domain descriptor (Fishing values unchanged). */
const DEFAULT_WEIGHTS: Record<Dim, number> = FISHING_WEIGHTS;

function baseScores(knot: Knot): FieldFitScores {
  const b = knot.fieldFit.baseline;
  const out = {} as FieldFitScores;
  for (const d of FIELD_FIT_DIMENSIONS) {
    out[d] = b[d] ?? 60;
  }
  return out;
}

function situationalAdjust(
  scores: FieldFitScores,
  knot: Knot,
  input: ChooseInput,
): { scores: FieldFitScores; notes: Partial<Record<Dim, string>> } {
  const s = { ...scores };
  const notes: Partial<Record<Dim, string>> = {};

  if (knot.contract.connectionFamilies[0] === input.connection) {
    s.connectionJobFit = Math.min(100, s.connectionJobFit + 6);
  }

  if (input.mainMaterial) {
    if (knot.lineMaterials.includes(input.mainMaterial) || knot.lineMaterials.includes("mixed")) {
      s.materialCompatibility = Math.min(100, s.materialCompatibility + 8);
      notes.materialCompatibility = `Supports ${input.mainMaterial}`;
    } else {
      s.materialCompatibility = Math.max(0, s.materialCompatibility - 30);
      notes.materialCompatibility = `Weak material listing for ${input.mainMaterial}`;
    }
  }

  if (input.diameterRelation === "main-much-thinner" || input.diameterRelation === "extreme-mismatch") {
    if (knot.id === "fg") {
      s.diameterRelationship = Math.min(100, s.diameterRelationship + 10);
      notes.diameterRelationship = "Excellent large-diameter transition";
    } else if (knot.id === "double-uni") {
      s.diameterRelationship = Math.max(0, s.diameterRelationship - 15);
      s.finishedProfile = Math.max(0, s.finishedProfile - 12);
      s.guidePassage = Math.max(0, s.guidePassage - 10);
      notes.diameterRelationship = "Bulkier on large diameter jumps";
    } else if (knot.id === "alberto") {
      s.diameterRelationship = Math.min(100, s.diameterRelationship + 4);
    }
  }

  if (input.mustPassGuides) {
    const map = { excellent: 14, good: 6, fair: -16, poor: -35, "n/a": 0 } as const;
    s.guidePassage = Math.max(0, Math.min(100, s.guidePassage + map[knot.contract.guidePassage]));
    s.finishedProfile = Math.max(
      0,
      Math.min(
        100,
        s.finishedProfile +
          (knot.contract.guidePassage === "excellent" ? 10 : knot.contract.guidePassage === "fair" ? -10 : 0),
      ),
    );
    notes.guidePassage = `Guide passage: ${knot.contract.guidePassage}`;
  }

  if (input.coldHands) {
    if (knot.difficulty === "advanced") {
      s.coldWetHandDifficulty = Math.max(0, s.coldWetHandDifficulty - 8);
      s.fieldTieability = Math.max(0, s.fieldTieability - 10);
    }
    notes.coldWetHandDifficulty = "Cold hands active in ranking";
  }

  if (input.windy) {
    if (knot.contract.tensionRequirements === "extreme" || knot.difficulty === "advanced") {
      s.windSensitivity = Math.max(0, s.windSensitivity - 10);
      s.fieldTieability = Math.max(0, s.fieldTieability - 8);
    }
    notes.windSensitivity = "Wind active in ranking";
  }

  if (input.lowLight && knot.difficulty !== "beginner") {
    s.lowLightDifficulty = Math.max(0, s.lowLightDifficulty - 10);
  }

  if (input.retieFrequency === "frequent") {
    if (knot.difficulty === "beginner") {
      s.retieSpeed = Math.min(100, s.retieSpeed + 10);
      s.fieldTieability = Math.min(100, s.fieldTieability + 6);
    }
    if (knot.difficulty === "advanced") {
      s.retieSpeed = Math.max(0, s.retieSpeed - 18);
      s.fieldTieability = Math.max(0, s.fieldTieability - 14);
      notes.retieSpeed = "Frequent reties favor faster field knots";
    }
  } else if (input.retieFrequency === "rare") {
    if (knot.contract.guidePassage === "excellent") {
      s.retieSpeed = Math.min(100, s.retieSpeed + 20);
    }
  }

  if (input.proficiency === "beginner") {
    if (knot.difficulty === "beginner") {
      s.userProficiency = Math.min(100, s.userProficiency + 14);
    } else if (knot.difficulty === "advanced") {
      s.userProficiency = Math.max(0, s.userProficiency - 28);
      notes.userProficiency = "Advanced knot vs beginner proficiency";
    } else {
      s.userProficiency = Math.max(0, s.userProficiency - 8);
    }
  } else if (input.proficiency === "advanced") {
    if (knot.difficulty === "advanced") {
      s.userProficiency = Math.min(100, s.userProficiency + 25);
      s.fieldTieability = Math.min(100, s.fieldTieability + 18);
      s.requiredTensionControl = Math.min(100, s.requiredTensionControl + 30);
      notes.userProficiency = "Advanced proficiency unlocks high-skill knots";
    } else {
      s.userProficiency = Math.min(100, s.userProficiency + 6);
    }
  } else if (input.proficiency === "intermediate") {
    if (knot.difficulty === "advanced") {
      s.userProficiency = Math.max(0, s.userProficiency - 8);
    } else {
      s.userProficiency = Math.min(100, s.userProficiency + 8);
    }
  }

  if (input.freeSwing) {
    if (knot.contract.loopBehavior === "non-slip" || knot.contract.loopBehavior === "open") {
      s.connectionJobFit = Math.min(100, s.connectionJobFit + 15);
      notes.connectionJobFit = "Non-slip / open loop supports free swing";
    } else {
      s.connectionJobFit = Math.max(0, s.connectionJobFit - 20);
    }
  }

  if (input.hardwareEyeSmall && knot.contract.eyeMustPassDoubledLine) {
    s.eyeHardwareGeometry = Math.max(0, s.eyeHardwareGeometry - 40);
  }

  if (
    input.connection === "braid-to-leader" &&
    input.mustPassGuides &&
    (input.diameterRelation === "main-much-thinner" || input.diameterRelation === "extreme-mismatch") &&
    !input.coldHands &&
    !input.windy &&
    input.retieFrequency !== "frequent"
  ) {
    if (knot.id === "fg") {
      s.connectionJobFit = Math.min(100, s.connectionJobFit + 4);
      s.loadBehavior = Math.min(100, s.loadBehavior + 4);
      notes.finishedProfile = "Best finished braid-to-leader system geometry";
    }
  }

  return { scores: s, notes };
}

function weightsFor(input: ChooseInput): Record<Dim, number> {
  const w = { ...DEFAULT_WEIGHTS };

  if (input.mustPassGuides) {
    w.guidePassage = 1.8;
    w.finishedProfile = 1.4;
    w.diameterRelationship = 1.3;
  }

  if (input.coldHands) {
    w.coldWetHandDifficulty = 1.5;
    w.fieldTieability = 1.6;
  }
  if (input.windy) {
    w.windSensitivity = 1.4;
    w.fieldTieability = Math.max(w.fieldTieability, 1.5);
  }
  if (input.lowLight) {
    w.lowLightDifficulty = 1.2;
  }

  if (input.retieFrequency === "frequent") {
    w.retieSpeed = 1.6;
    w.fieldTieability = Math.max(w.fieldTieability, 1.5);
  } else if (input.retieFrequency === "rare") {
    w.retieSpeed = 0.25;
    w.loadBehavior = 1.4;
    w.guidePassage = Math.max(w.guidePassage, 1.2);
  }

  if (input.proficiency === "beginner") {
    w.userProficiency = 1.6;
    w.fieldTieability = Math.max(w.fieldTieability, 1.4);
    w.failureSensitivity = 1.1;
  } else if (input.proficiency === "advanced") {
    w.userProficiency = 1.1;
    w.requiredTensionControl = 0.35;
    w.fieldTieability = 0.55;
  }

  if (input.diameterRelation === "main-much-thinner" || input.diameterRelation === "extreme-mismatch") {
    w.diameterRelationship = Math.max(w.diameterRelationship, 1.5);
  }

  return w;
}

function humanWhyLine(d: DimensionScore): string {
  if (d.note) return d.note;
  return `Strong ${DIMENSION_LABELS[d.dimension].toLowerCase()} (${d.score})`;
}

function humanButLine(d: DimensionScore): string {
  if (d.note) return d.note;
  return `Lower ${DIMENSION_LABELS[d.dimension].toLowerCase()} (${d.score})`;
}

export function rankSurvivors(survivors: Knot[], input: ChooseInput): RankedOption[] {
  const weights = weightsFor(input);

  const ranked: RankedOption[] = survivors.map((knot) => {
    const { scores, notes } = situationalAdjust(baseScores(knot), knot, input);
    const dimensionScores: DimensionScore[] = FIELD_FIT_DIMENSIONS.map((dimension) => ({
      dimension,
      score: Math.round(scores[dimension]),
      weight: weights[dimension],
      note: notes[dimension],
    }));

    let totalW = 0;
    let total = 0;
    for (const ds of dimensionScores) {
      total += ds.score * ds.weight;
      totalW += ds.weight;
    }
    const fieldFitPercent = Math.round(Math.max(0, Math.min(100, total / totalW)));

    const sortedDims = [...dimensionScores].sort((a, b) => b.score * b.weight - a.score * a.weight);
    const whyBest = [
      ...knot.fieldFit.strengths.slice(0, 2),
      ...sortedDims
        .filter((d) => d.score >= 75 && d.weight >= 0.5)
        .slice(0, 3)
        .map(humanWhyLine),
    ].slice(0, 5);

    const butNotes = [
      ...knot.fieldFit.weaknesses.slice(0, 2),
      ...dimensionScores
        .filter((d) => d.score < 45 && d.weight >= 0.5)
        .slice(0, 3)
        .map(humanButLine),
    ].slice(0, 5);

    if (input.coldHands && knot.difficulty === "advanced") {
      butNotes.unshift("Poor choice if you need an immediate retie with cold hands");
    }
    if (input.mustPassGuides && knot.contract.guidePassage === "excellent") {
      whyBest.unshift("Compact through guides");
    }
    if (input.mustPassGuides && (knot.contract.guidePassage === "fair" || knot.contract.guidePassage === "poor")) {
      butNotes.unshift("Larger finished profile for repeated guide passage");
    }

    return {
      knot,
      fieldFitPercent,
      dimensionScores,
      whyBest: [...new Set(whyBest)].filter(Boolean),
      butNotes: [...new Set(butNotes)].filter(Boolean),
    };
  });

  ranked.sort((a, b) => b.fieldFitPercent - a.fieldFitPercent);
  return ranked;
}

export { explainTradeoff } from "./explain";
