import type { DomainOption } from "@/domain/domain";

/** Boating connections — the jobs, not the knot names. */
export const BOATING_CONNECTIONS: DomainOption[] = [
  { id: "rope-to-cleat", label: "Rope → cleat", group: "Make fast" },
  { id: "rope-to-bollard", label: "Rope → bollard / piling", group: "Make fast" },
  { id: "rope-to-ring", label: "Rope → ring or shackle", group: "Make fast" },
  { id: "fixed-eye", label: "Fixed eye in the end", group: "Loops" },
  { id: "loop-over-post", label: "Loop dropped over a post", group: "Loops" },
  { id: "mid-line-loop", label: "Mid-line loop", group: "Loops" },
  { id: "rope-to-rope", label: "Rope → rope join", group: "Joins" },
  { id: "unequal-rope-join", label: "Unequal diameter join", group: "Joins" },
  { id: "load-transfer", label: "Load transfer / snubber", group: "Working" },
  { id: "tension-line", label: "Tension / lash a line", group: "Working" },
  { id: "stopper", label: "Stopper in the end", group: "Working" },
  { id: "reef-or-bind", label: "Reef / bind", group: "Bind" },
];

export const BOATING_MATERIALS: DomainOption[] = [
  { id: "polyester", label: "Polyester" },
  { id: "nylon", label: "Nylon" },
  { id: "polypropylene", label: "Polypropylene" },
  { id: "dyneema", label: "Dyneema / HMPE" },
  { id: "aramid", label: "Aramid core" },
  { id: "natural", label: "Natural fibre" },
];

/** Rope construction — a Boating-only dimension. Fishing never renders it. */
export const BOATING_CONSTRUCTIONS: DomainOption[] = [
  { id: "three-strand", label: "Three-strand laid" },
  { id: "double-braid", label: "Double braid" },
  { id: "single-braid", label: "Single braid" },
  { id: "kernmantle", label: "Kernmantle" },
  { id: "parallel-core", label: "Parallel core" },
];

export const BOATING_DIAMETERS: DomainOption[] = [
  { id: "similar", label: "Similar diameter" },
  { id: "main-thinner", label: "Working end thinner" },
  { id: "main-much-thinner", label: "Much thinner" },
  { id: "main-thicker", label: "Working end thicker" },
  { id: "extreme-mismatch", label: "Extreme mismatch" },
];
