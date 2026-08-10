/**
 * Author-time overlay data (scenarios, materials, connection types).
 *
 * Storage is behind an adapter so the same editor can later be pointed at a
 * server/database without touching the UI. Nothing here can widen the engine:
 * every custom material and connection must declare a base mechanical type it
 * behaves like, and the engine only ever sees the base type. Fail-closed.
 */
import type { ChooseInput, ConnectionJob, LineMaterial } from "@/domain/types";

export const OVERLAY_VERSION = 1 as const;
export const OVERLAY_STORAGE_KEY = "hth.knot-intelligence.overlay.v1";

export interface CustomMaterial {
  id: string;
  label: string;
  /** Mechanical class the engine treats this as */
  behavesLike: LineMaterial;
  note?: string;
}

export interface CustomConnection {
  id: string;
  label: string;
  group: string;
  /** Connection job the engine treats this as */
  behavesLike: ConnectionJob;
  note?: string;
}

export interface CustomScenario {
  id: string;
  title: string;
  blurb: string;
  tag: string;
  connectionLine: string;
  likelyPick: string;
  autoRun: boolean;
  input: ChooseInput;
}

export interface OverlayData {
  version: typeof OVERLAY_VERSION;
  updatedAt: string;
  materials: CustomMaterial[];
  connections: CustomConnection[];
  scenarios: CustomScenario[];
}

export const EMPTY_OVERLAY: OverlayData = {
  version: OVERLAY_VERSION,
  updatedAt: "1970-01-01T00:00:00.000Z",
  materials: [],
  connections: [],
  scenarios: [],
};

export interface OverlayAdapter {
  /** Human label shown in the editor status line */
  name: string;
  load(): Promise<OverlayData>;
  save(data: OverlayData): Promise<void>;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

function asString(v: unknown): string {
  return typeof v === "string" ? v : "";
}

const MATERIAL_SET: LineMaterial[] = [
  "mono",
  "fluoro",
  "braid",
  "fly-line",
  "backing",
  "wire",
  "mixed",
];

const CONNECTION_SET: ConnectionJob[] = [
  "line-to-hook",
  "line-to-lure",
  "braid-to-leader",
  "leader-to-leader",
  "line-to-swivel",
  "line-to-spool",
  "fly-line-to-leader",
  "leader-to-tippet",
  "double-line-to-leader",
  "loop-to-loop",
  "line-to-loop",
  "hook-snell",
];

/** Strict parse — anything malformed is dropped and reported, never guessed. */
export function parseOverlay(raw: unknown): { data: OverlayData; errors: string[] } {
  const errors: string[] = [];
  const src = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;

  const materials: CustomMaterial[] = [];
  for (const m of Array.isArray(src['materials'] ) ? (src['materials'] as unknown[]) : []) {
    const o = (m ?? {}) as Record<string, unknown>;
    const label = asString(o['label']).trim();
    const behavesLike = asString(o['behavesLike']) as LineMaterial;
    const id = slugify(asString(o['id']) || label);
    if (!id || !label) {
      errors.push("Material skipped — missing id or label.");
      continue;
    }
    if (!MATERIAL_SET.includes(behavesLike)) {
      errors.push(`Material "${label}" skipped — behavesLike is not a known material class.`);
      continue;
    }
    materials.push({
      id,
      label,
      behavesLike,
      ...(asString(o['note']) ? { note: asString(o['note']) } : {}),
    });
  }

  const connections: CustomConnection[] = [];
  for (const c of Array.isArray(src['connections']) ? (src['connections'] as unknown[]) : []) {
    const o = (c ?? {}) as Record<string, unknown>;
    const label = asString(o['label']).trim();
    const behavesLike = asString(o['behavesLike']) as ConnectionJob;
    const id = slugify(asString(o['id']) || label);
    if (!id || !label) {
      errors.push("Connection skipped — missing id or label.");
      continue;
    }
    if (!CONNECTION_SET.includes(behavesLike)) {
      errors.push(`Connection "${label}" skipped — behavesLike is not a known connection job.`);
      continue;
    }
    connections.push({
      id,
      label,
      group: asString(o['group']).trim() || "Custom",
      behavesLike,
      ...(asString(o['note']) ? { note: asString(o['note']) } : {}),
    });
  }

  const scenarios: CustomScenario[] = [];
  for (const s of Array.isArray(src['scenarios']) ? (src['scenarios'] as unknown[]) : []) {
    const o = (s ?? {}) as Record<string, unknown>;
    const title = asString(o['title']).trim();
    const id = slugify(asString(o['id']) || title);
    const input = (o['input'] ?? {}) as Record<string, unknown>;
    const connection = asString(input['connection']) as ConnectionJob;
    if (!id || !title) {
      errors.push("Scenario skipped — missing id or title.");
      continue;
    }
    if (!CONNECTION_SET.includes(connection)) {
      errors.push(`Scenario "${title}" skipped — input.connection is not a known connection job.`);
      continue;
    }
    const main = asString(input['mainMaterial']) as LineMaterial;
    const secondary = asString(input['secondaryMaterial']) as LineMaterial;
    scenarios.push({
      id,
      title,
      blurb: asString(o['blurb']),
      tag: asString(o['tag']) || "Custom",
      connectionLine: asString(o['connectionLine']) || title,
      likelyPick: asString(o['likelyPick']),
      autoRun: o['autoRun'] !== false,
      input: {
        connection,
        ...(MATERIAL_SET.includes(main) ? { mainMaterial: main } : {}),
        ...(MATERIAL_SET.includes(secondary) ? { secondaryMaterial: secondary } : {}),
        ...(typeof input['diameterRelation'] === "string"
          ? { diameterRelation: input['diameterRelation'] as ChooseInput["diameterRelation"] }
          : {}),
        ...(input['mustPassGuides'] === true ? { mustPassGuides: true } : {}),
        ...(input['windy'] === true ? { windy: true } : {}),
        ...(input['coldHands'] === true ? { coldHands: true } : {}),
        ...(input['lowLight'] === true ? { lowLight: true } : {}),
        ...(input['hardwareEyeSmall'] === true ? { hardwareEyeSmall: true } : {}),
        ...(input['freeSwing'] === true ? { freeSwing: true } : {}),
        ...(input['needsUntie'] === true ? { needsUntie: true } : {}),
        ...(typeof input['retieFrequency'] === "string"
          ? { retieFrequency: input['retieFrequency'] as ChooseInput["retieFrequency"] }
          : {}),
        ...(typeof input['proficiency'] === "string"
          ? { proficiency: input['proficiency'] as ChooseInput["proficiency"] }
          : {}),
      },
    });
  }

  return {
    data: {
      version: OVERLAY_VERSION,
      updatedAt: asString(src['updatedAt']) || new Date().toISOString(),
      materials,
      connections,
      scenarios,
    },
    errors,
  };
}

/** Browser-local adapter. Swap for a Cloud adapter later — same contract. */
export function createLocalAdapter(storageKey = OVERLAY_STORAGE_KEY): OverlayAdapter {
  return {
    name: "This browser (local draft)",
    async load() {
      if (typeof window === "undefined") return EMPTY_OVERLAY;
      try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) return EMPTY_OVERLAY;
        return parseOverlay(JSON.parse(raw)).data;
      } catch {
        return EMPTY_OVERLAY;
      }
    },
    async save(data) {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(storageKey, JSON.stringify(data));
    },
  };
}

export function overlayToJson(data: OverlayData): string {
  return JSON.stringify(data, null, 2);
}

export function downloadOverlay(data: OverlayData, filename = "knot-overlay.json") {
  const blob = new Blob([overlayToJson(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}