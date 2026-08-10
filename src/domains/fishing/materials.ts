/**
 * Fishing material presets — the six angler-facing buttons, unchanged, each
 * resolving to a four-axis spec. Only braid, wire and backing carry an
 * optional disclosure row, so the common path does not get longer.
 */
import type { LineMaterial } from "@/domain/types";
import {
  CONSTRUCTION_LABELS,
  TREATMENT_LABELS,
  type MaterialPreset,
} from "@/domain/material";

const con = (...ids: (keyof typeof CONSTRUCTION_LABELS)[]) =>
  ids.map((id) => ({ id, label: CONSTRUCTION_LABELS[id] }));
const treat = (...ids: (keyof typeof TREATMENT_LABELS)[]) =>
  ids.map((id) => ({ id, label: TREATMENT_LABELS[id] }));

export const FISHING_MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  mono: {
    category: "mono",
    spec: {
      category: "mono",
      fiber: "nylon",
      construction: "monofilament",
      treatment: "uncoated",
      role: "unspecified",
    },
    disclosure: [
      {
        axis: "construction",
        label: "What kind of mono?",
        options: [
          ...con("monofilament", "copolymer", "twisted-multifilament"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
      {
        axis: "treatment",
        label: "Finish",
        options: [
          ...treat("uncoated", "fluoro-coated", "abrasion-treated", "high-vis-pigment"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
    ],
  },
  fluoro: {
    category: "fluoro",
    spec: {
      category: "fluoro",
      fiber: "fluorocarbon",
      construction: "monofilament",
      treatment: "uncoated",
      role: "leader",
    },
    disclosure: [
      {
        axis: "construction",
        label: "What kind of fluoro?",
        options: [
          ...con("monofilament", "copolymer"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
      {
        axis: "treatment",
        label: "Finish",
        options: [
          ...treat("uncoated", "abrasion-treated"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
    ],
  },
  "fly-line": {
    category: "fly-line",
    spec: {
      category: "fly-line",
      fiber: "nylon",
      construction: "coated-core",
      treatment: "uncoated",
      role: "fly-line",
    },
    disclosure: [
      {
        axis: "construction",
        label: "Line build",
        options: [
          ...con("coated-core", "twisted-multifilament"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
      {
        axis: "treatment",
        label: "Finish",
        options: [...treat("uncoated", "wax-treated"), { id: "unspecified", label: "Not sure" }],
      },
    ],
  },
  braid: {
    category: "braid",
    spec: {
      category: "braid",
      fiber: "uhmwpe",
      construction: "unspecified",
      treatment: "unspecified",
      role: "main-line",
    },
    disclosure: [
      {
        axis: "construction",
        label: "What type of braid?",
        options: [
          ...con("braid-4", "braid-8", "braid-12", "braid-16", "fused-pe", "hollow-core"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
      {
        axis: "treatment",
        label: "Finish",
        options: [...treat("uncoated", "coated-braid", "gel-spun-finish"), { id: "unspecified", label: "Not sure" }],
      },
    ],
  },
  wire: {
    category: "wire",
    spec: {
      category: "wire",
      fiber: "stainless",
      construction: "unspecified",
      treatment: "unspecified",
      role: "leader",
    },
    disclosure: [
      {
        axis: "construction",
        label: "What type of wire?",
        options: [
          ...con("single-strand-wire", "wire-1x7", "wire-7x7", "titanium-wire"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
      {
        axis: "treatment",
        label: "Coating",
        options: [...treat("uncoated", "nylon-coated"), { id: "unspecified", label: "Not sure" }],
      },
    ],
  },
  backing: {
    category: "backing",
    spec: {
      category: "backing",
      fiber: "unspecified",
      construction: "unspecified",
      treatment: "unspecified",
      role: "backing",
    },
    disclosure: [
      {
        axis: "construction",
        label: "What type of backing?",
        options: [
          ...con("braid-12", "braid-8", "hollow-core"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
      {
        axis: "treatment",
        label: "Finish",
        options: [
          ...treat("uncoated", "gel-spun-finish"),
          { id: "unspecified", label: "Not sure" },
        ],
      },
    ],
  },
};

export function fishingPreset(category: LineMaterial | undefined) {
  return category ? FISHING_MATERIAL_PRESETS[category] : undefined;
}