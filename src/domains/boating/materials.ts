/**
 * Boating material axes — vocabulary only.
 * No mechanical catalog yet: knots remain empty so the instrument fails closed.
 * Ready for Phase 7 catalog authoring without Fishing schema exceptions.
 */
import type { MaterialPreset } from "@/domain/material";
import { CONSTRUCTION_LABELS, FIBER_LABELS, TREATMENT_LABELS } from "@/domain/material";

const fiber = (...ids: (keyof typeof FIBER_LABELS)[]) =>
  ids.map((id) => ({ id, label: FIBER_LABELS[id] }));
const con = (...ids: (keyof typeof CONSTRUCTION_LABELS)[]) =>
  ids.map((id) => ({ id, label: CONSTRUCTION_LABELS[id] }));
const treat = (...ids: (keyof typeof TREATMENT_LABELS)[]) =>
  ids.map((id) => ({ id, label: TREATMENT_LABELS[id] }));

/**
 * Presets keyed by boating material ids from vocabulary.ts.
 * LineMaterial fishing enums are not used here — categories stay domain-local
 * until a shared material ID space is authored with the catalog.
 */
export const BOATING_MATERIAL_PRESETS: Record<string, MaterialPreset> = {
  polyester: {
    category: "mixed",
    spec: {
      category: "mixed",
      fiber: "polyester",
      construction: "unspecified",
      treatment: "unspecified",
      role: "unspecified",
    },
    disclosure: [
      {
        axis: "construction",
        label: "Construction",
        options: [
          { id: "unspecified", label: "Not sure" },
          ...con("braid-12", "braid-16", "twisted-multifilament"),
        ],
      },
    ],
  },
  nylon: {
    category: "mixed",
    spec: {
      category: "mixed",
      fiber: "nylon",
      construction: "unspecified",
      treatment: "unspecified",
      role: "unspecified",
    },
    disclosure: [
      {
        axis: "construction",
        label: "Construction",
        options: [{ id: "unspecified", label: "Not sure" }, ...con("twisted-multifilament", "braid-8")],
      },
    ],
  },
  dyneema: {
    category: "mixed",
    spec: {
      category: "mixed",
      fiber: "uhmwpe",
      construction: "unspecified",
      treatment: "unspecified",
      role: "unspecified",
    },
    disclosure: [
      {
        axis: "fiber",
        label: "Fiber",
        options: [...fiber("uhmwpe"), { id: "unspecified", label: "Not sure" }],
      },
      {
        axis: "construction",
        label: "Construction",
        options: [
          { id: "unspecified", label: "Not sure" },
          ...con("braid-12", "braid-16", "hollow-core"),
        ],
      },
      {
        axis: "treatment",
        label: "Finish",
        options: [...treat("uncoated", "coated-braid"), { id: "unspecified", label: "Not sure" }],
      },
    ],
  },
  aramid: {
    category: "mixed",
    spec: {
      category: "mixed",
      fiber: "aramid",
      construction: "unspecified",
      treatment: "unspecified",
      role: "unspecified",
    },
  },
  polypropylene: {
    category: "mixed",
    spec: {
      category: "mixed",
      fiber: "mixed",
      construction: "unspecified",
      treatment: "unspecified",
      role: "unspecified",
    },
  },
  natural: {
    category: "mixed",
    spec: {
      category: "mixed",
      fiber: "mixed",
      construction: "twisted-multifilament",
      treatment: "unspecified",
      role: "unspecified",
    },
  },
};
