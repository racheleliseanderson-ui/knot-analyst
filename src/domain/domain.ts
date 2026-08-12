/**
 * Domain descriptor — the bolt-on that turns Knot Analyst into the
 * Fishing domain of a shared Knot Analyst engine.
 *
 * The engines already operate on string-keyed vocabularies, so a domain is
 * just data: vocabulary, weighted dimensions, terminology, datasets. Nothing
 * here changes Fishing behavior — the Fishing descriptor is assembled from the
 * existing modules verbatim.
 */
import type { FieldScenario } from "@/data/scenarios";
import type { FailurePlay } from "@/data/failure-playbook";
import type { KnotContent } from "@/domain/types";
import type { DomainRegion } from "@/domain/region";
import type { DomainVenue } from "@/domain/venue";

export type DomainId = "fishing" | "boating";

/** Terminology any shared screen may need. Domains supply their own nouns. */
export interface DomainTerms {
  /** "line" vs "rope" */
  line: string;
  linePlural: string;
  /** "leader" vs "tail" */
  secondary: string;
  /** "retie" vs "re-tie and reeve" */
  retie: string;
  /** "guides" vs "fairleads" */
  passage: string;
  /** "hardware eye" vs "shackle / ring" */
  hardware: string;
  /** unit of work: "connection" vs "made-up line" */
  connection: string;
}

export interface DomainOption {
  id: string;
  label: string;
  group?: string;
}

export interface DomainDimension {
  key: string;
  label: string;
  weight: number;
  /**
   * Optional dimensions are rendered only when present in the active domain.
   * Boating adds Rope Construction here; Fishing never sees it, so Fishing
   * screens gain no extra rows.
   */
  optional?: boolean;
}

export interface KnotDomain {
  id: DomainId;
  label: string;
  terms: DomainTerms;
  connections: DomainOption[];
  materials: DomainOption[];
  /**
   * Optional four-axis material presets keyed by the domain's material
   * category ids. Boating can supply its own constructions here without
   * Fishing rendering any extra rows.
   */
  materialAxes?: Record<string, import("@/domain/material").MaterialPreset>;
  diameters: DomainOption[];
  dimensions: DomainDimension[];
  /**
   * Where the connection works (waterbody / place). Domain-specific.
   * Phase C: fishing lists waterbodies here; platforms are separate.
   */
  venues?: DomainVenue[];
  /**
   * How the angler / crew is positioned (kayak, wading, large boat…).
   * Optional second layer — fishing only for now. Soft condition patches only.
   */
  platforms?: DomainVenue[];
  /**
   * Phase D — soft geographic priors (US regions). Advisor copy + optional
   * condition patches. Never hard-codes knot IDs.
   */
  regions?: DomainRegion[];
  scenarios: FieldScenario[];
  failurePlays: FailurePlay[];
  knots: KnotContent[];
}

/** Weight map for the active domain, keyed by dimension key. */
export function dimensionWeights(domain: KnotDomain): Record<string, number> {
  return Object.fromEntries(domain.dimensions.map((d) => [d.key, d.weight]));
}

/** Dimensions a domain actually renders (optional ones included when present). */
export function visibleDimensions(domain: KnotDomain): DomainDimension[] {
  return domain.dimensions;
}
