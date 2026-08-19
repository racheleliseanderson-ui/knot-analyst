/**
 * Preset manager — named, versioned setups.
 *
 * A preset stores declared inputs only. It never stores a result: results are
 * recomputed by the current engine, so an old preset can legitimately produce a
 * different call after a catalog change. That is the point of storing inputs.
 */
import type { ChooseInput } from "@/domain/types";

export const PRESET_SCHEMA = 1;
const KEY = "ki-presets-v1";

export interface PresetSelection {
  connection?: string;
  main?: string;
  secondary?: string;
}

export interface Preset {
  id: string;
  name: string;
  note?: string;
  /** Presets are discipline-scoped — a fishing setup is not a boating setup. */
  domainId: string;
  input: Partial<ChooseInput>;
  sel: PresetSelection;
  venueId?: string;
  /** Phase C platform layer (kayak, wading, large-boat…). */
  platformId?: string;
  /** Phase D region broad id. */
  regionBroadId?: string;
  /** Phase D region fine id (optional second tap). */
  regionFineId?: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PresetFile {
  schema: number;
  exportedAt: string;
  presets: Preset[];
}

function uid(): string {
  return `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

/** Drops anything malformed rather than guessing at it. */
export function parsePresets(raw: unknown): { presets: Preset[]; errors: string[] } {
  const errors: string[] = [];
  const list = Array.isArray(raw)
    ? raw
    : isRecord(raw) && Array.isArray(raw["presets"])
      ? (raw["presets"] as unknown[])
      : null;
  if (!list) return { presets: [], errors: ["No preset array found in that file."] };

  const presets: Preset[] = [];
  list.forEach((item, i) => {
    if (!isRecord(item)) {
      errors.push(`Entry ${i + 1}: not an object.`);
      return;
    }
    const name = typeof item["name"] === "string" ? item["name"].trim() : "";
    const input = isRecord(item["input"]) ? (item["input"] as Partial<ChooseInput>) : null;
    if (!name) {
      errors.push(`Entry ${i + 1}: missing a name.`);
      return;
    }
    if (!input?.connection) {
      errors.push(`"${name}": no connection job — nothing would run.`);
      return;
    }
    const now = new Date().toISOString();
    presets.push({
      id: typeof item["id"] === "string" ? item["id"] : uid(),
      name,
      ...(typeof item["note"] === "string" && item["note"] ? { note: item["note"] } : {}),
      domainId: typeof item["domainId"] === "string" ? item["domainId"] : "fishing",
      input,
      sel: isRecord(item["sel"]) ? (item["sel"] as PresetSelection) : {},
      ...(typeof item["venueId"] === "string" ? { venueId: item["venueId"] } : {}),
      ...(typeof item["platformId"] === "string" ? { platformId: item["platformId"] } : {}),
      ...(typeof item["regionBroadId"] === "string"
        ? { regionBroadId: item["regionBroadId"] }
        : {}),
      ...(typeof item["regionFineId"] === "string" ? { regionFineId: item["regionFineId"] } : {}),
      pinned: item["pinned"] === true,
      createdAt: typeof item["createdAt"] === "string" ? item["createdAt"] : now,
      updatedAt: typeof item["updatedAt"] === "string" ? item["updatedAt"] : now,
    });
  });
  return { presets, errors };
}

export function loadPresets(): Preset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return parsePresets(JSON.parse(raw) as unknown).presets;
  } catch {
    return [];
  }
}

export function savePresets(presets: Preset[]): void {
  if (typeof window === "undefined") return;
  try {
    const file: PresetFile = {
      schema: PRESET_SCHEMA,
      exportedAt: new Date().toISOString(),
      presets,
    };
    window.localStorage.setItem(KEY, JSON.stringify(file));
  } catch {
    /* storage full or blocked — the session still works, nothing persists */
  }
}

export function makePreset(args: {
  name: string;
  note?: string;
  domainId: string;
  input: Partial<ChooseInput>;
  sel: PresetSelection;
  venueId?: string;
  platformId?: string;
  regionBroadId?: string;
  regionFineId?: string;
}): Preset {
  const now = new Date().toISOString();
  return {
    id: uid(),
    name: args.name.trim(),
    ...(args.note?.trim() ? { note: args.note.trim() } : {}),
    domainId: args.domainId,
    input: args.input,
    sel: args.sel,
    ...(args.venueId ? { venueId: args.venueId } : {}),
    ...(args.platformId ? { platformId: args.platformId } : {}),
    ...(args.regionBroadId ? { regionBroadId: args.regionBroadId } : {}),
    ...(args.regionFineId ? { regionFineId: args.regionFineId } : {}),
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };
}

/** Sorted for the bar: pinned first, then most recently touched. */
export function orderPresets(presets: Preset[]): Preset[] {
  return presets
    .slice()
    .sort((a, b) =>
      a.pinned === b.pinned ? b.updatedAt.localeCompare(a.updatedAt) : a.pinned ? -1 : 1,
    );
}

export function presetsToJson(presets: Preset[]): string {
  const file: PresetFile = {
    schema: PRESET_SCHEMA,
    exportedAt: new Date().toISOString(),
    presets,
  };
  return JSON.stringify(file, null, 2);
}

export function downloadPresets(presets: Preset[]): void {
  const blob = new Blob([presetsToJson(presets)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `knot-intelligence-presets-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** One-line summary of what a preset actually declares. */
export function describePreset(p: Preset): string {
  const bits: string[] = [];
  if (p.sel.main ?? p.input.mainMaterial) bits.push(String(p.sel.main ?? p.input.mainMaterial));
  if (p.sel.secondary ?? p.input.secondaryMaterial)
    bits.push(String(p.sel.secondary ?? p.input.secondaryMaterial));
  const conditions = [
    p.input.mustPassGuides && "guides",
    p.input.windy && "wind",
    p.input.coldHands && "cold",
    p.input.lowLight && "low light",
    p.input.hardwareEyeSmall && "small eye",
    p.input.freeSwing && "free-swing",
  ].filter(Boolean) as string[];
  return (
    [bits.join(" + "), conditions.join(" · ")].filter(Boolean).join(" — ") ||
    "no conditions declared"
  );
}
