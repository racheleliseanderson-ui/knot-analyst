export const FLEET_CONTRACT = "HTH-FLEET-1.0" as const;
export const FLEET_SESSION_KEY = "hth-fleet-context-v1";

export type FleetTrailEntry = { origin: string; at: string };
export type HthFleetPacket = {
  packetVersion?: string;
  origin?: string;
  createdAt?: string;
  instrumentId?: string;
  fleet?: { contract?: string; trail?: FleetTrailEntry[]; lastUpdatedBy?: string };
  water?: Record<string, unknown>;
  species?: Record<string, unknown>;
  populationContext?: unknown;
  conditions?: Record<string, unknown>;
  observations?: Record<string, unknown>;
  presentationRequirements?: Record<string, unknown>;
  equipmentRequirements?: Record<string, unknown>;
  connectionRequirements?: Record<string, unknown>;
  tackleEvaluation?: Record<string, unknown>;
  knotDecision?: Record<string, unknown>;
  provenance?: unknown[];
  privacy?: Record<string, unknown>;
  [key: string]: unknown;
};

const BLOCKED_KEYS = new Set(["coordinates", "coordinate", "latitude", "longitude", "lat", "lng", "lon", "gps", "geometry"]);

function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
    if (BLOCKED_KEYS.has(key.toLowerCase())) continue;
    out[key] = sanitizeValue(child);
  }
  return out;
}

export function sanitizeFleetPacket(packet: HthFleetPacket): HthFleetPacket {
  const clean = sanitizeValue(packet) as HthFleetPacket;
  clean.privacy = { ...(clean.privacy ?? {}), containsCoordinates: false, containsPrivateWater: false };
  return clean;
}

export function parseFleetPacket(hash: string): HthFleetPacket | null {
  if (!hash.startsWith("#packet=")) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(hash.slice("#packet=".length)));
    return parsed && typeof parsed === "object" ? sanitizeFleetPacket(parsed as HthFleetPacket) : null;
  } catch {
    return null;
  }
}

export function loadFleetContext(): HthFleetPacket | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(FLEET_SESSION_KEY);
    return raw ? sanitizeFleetPacket(JSON.parse(raw) as HthFleetPacket) : null;
  } catch {
    return null;
  }
}

export function saveFleetContext(packet: HthFleetPacket) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(FLEET_SESSION_KEY, JSON.stringify(sanitizeFleetPacket(packet)));
  } catch {
    /* session storage unavailable */
  }
}

function objectPart(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

export function mergeFleetPacket(base: HthFleetPacket | null | undefined, origin: string, instrumentId: string, patch: HthFleetPacket): HthFleetPacket {
  const now = new Date().toISOString();
  const prior = sanitizeFleetPacket(base ?? {});
  const priorTrail = Array.isArray(prior.fleet?.trail) ? prior.fleet!.trail! : [];
  const trail = priorTrail.length ? [...priorTrail] : prior.origin ? [{ origin: prior.origin, at: prior.createdAt ?? now }] : [];
  if (trail.at(-1)?.origin !== origin) trail.push({ origin, at: now });
  return sanitizeFleetPacket({
    ...prior,
    ...patch,
    packetVersion: "HTH-1.0",
    origin,
    instrumentId,
    createdAt: now,
    fleet: { contract: FLEET_CONTRACT, trail, lastUpdatedBy: origin },
    water: { ...objectPart(prior.water), ...objectPart(patch.water) },
    species: { ...objectPart(prior.species), ...objectPart(patch.species) },
    conditions: { ...objectPart(prior.conditions), ...objectPart(patch.conditions) },
    observations: { ...objectPart(prior.observations), ...objectPart(patch.observations) },
    presentationRequirements: { ...objectPart(prior.presentationRequirements), ...objectPart(patch.presentationRequirements) },
    equipmentRequirements: { ...objectPart(prior.equipmentRequirements), ...objectPart(patch.equipmentRequirements) },
    connectionRequirements: { ...objectPart(prior.connectionRequirements), ...objectPart(patch.connectionRequirements) },
    provenance: [...(Array.isArray(prior.provenance) ? prior.provenance : []), ...(Array.isArray(patch.provenance) ? patch.provenance : [])],
  });
}

export function fleetUrl(baseUrl: string, packet: HthFleetPacket): string {
  return `${baseUrl}#packet=${encodeURIComponent(JSON.stringify(sanitizeFleetPacket(packet)))}`;
}
