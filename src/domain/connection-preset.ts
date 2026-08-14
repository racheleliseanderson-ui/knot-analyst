/**
 * Connection presets — convenience UI labels that dual-write structured job
 * metadata. ConnectionJob IDs are never renamed; they remain the public preset
 * keys. Internally we always also store structural job + side roles.
 */
import type { ConnectionJob, LineMaterial } from "@/domain/types";
import type { MaterialRole } from "@/domain/material";

/** Job family independent of which material the angler clicked as a shortcut. */
export type StructuralJob =
  | "terminal-to-hardware"
  | "main-to-leader"
  | "leader-to-leader"
  | "leader-to-tippet"
  | "fly-line-to-leader"
  | "double-line-to-leader"
  | "loop-to-loop"
  | "line-to-loop"
  | "line-to-spool"
  | "snell"
  | "make-fast"
  | "rope-join"
  | "rope-loop"
  | "stopper"
  | "load-transfer"
  | "shorten-line"
  | "mid-line-loop"
  | "tension-line"
  | "reef-or-bind";

export interface ConnectionSides {
  structuralJob: StructuralJob;
  mainRole: MaterialRole;
  secondaryRole?: MaterialRole;
  /** Optional material family hints from the convenience label — never forced. */
  mainMaterialHint?: LineMaterial;
  secondaryMaterialHint?: LineMaterial;
  /** True when the job mechanically needs two line sides. */
  isJoin: boolean;
}

const PRESETS: Record<ConnectionJob, ConnectionSides> = {
  "line-to-hook": {
    structuralJob: "terminal-to-hardware",
    mainRole: "main-line",
    isJoin: false,
  },
  "line-to-lure": {
    structuralJob: "terminal-to-hardware",
    mainRole: "main-line",
    isJoin: false,
  },
  "line-to-swivel": {
    structuralJob: "terminal-to-hardware",
    mainRole: "main-line",
    isJoin: false,
  },
  "hook-snell": {
    structuralJob: "snell",
    mainRole: "leader",
    isJoin: false,
  },
  "braid-to-leader": {
    structuralJob: "main-to-leader",
    mainRole: "main-line",
    secondaryRole: "leader",
    mainMaterialHint: "braid",
    secondaryMaterialHint: "fluoro",
    isJoin: true,
  },
  "leader-to-leader": {
    structuralJob: "leader-to-leader",
    mainRole: "leader",
    secondaryRole: "leader",
    isJoin: true,
  },
  "leader-to-tippet": {
    structuralJob: "leader-to-tippet",
    mainRole: "leader",
    secondaryRole: "tippet",
    isJoin: true,
  },
  "fly-line-to-leader": {
    structuralJob: "fly-line-to-leader",
    mainRole: "fly-line",
    secondaryRole: "leader",
    mainMaterialHint: "fly-line",
    secondaryMaterialHint: "mono",
    isJoin: true,
  },
  "double-line-to-leader": {
    structuralJob: "double-line-to-leader",
    mainRole: "main-line",
    secondaryRole: "leader",
    isJoin: true,
  },
  "loop-to-loop": {
    structuralJob: "loop-to-loop",
    mainRole: "leader",
    secondaryRole: "leader",
    isJoin: true,
  },
  "line-to-loop": {
    structuralJob: "line-to-loop",
    mainRole: "main-line",
    isJoin: false,
  },
  "line-to-spool": {
    structuralJob: "line-to-spool",
    mainRole: "main-line",
    isJoin: false,
  },
  "rope-to-cleat": {
    structuralJob: "make-fast",
    mainRole: "main-line",
    isJoin: false,
  },
  "rope-to-bollard": {
    structuralJob: "make-fast",
    mainRole: "main-line",
    isJoin: false,
  },
  "rope-to-ring": {
    structuralJob: "make-fast",
    mainRole: "main-line",
    isJoin: false,
  },
  "fixed-eye": {
    structuralJob: "rope-loop",
    mainRole: "main-line",
    isJoin: false,
  },
  "loop-over-post": {
    structuralJob: "rope-loop",
    mainRole: "main-line",
    isJoin: false,
  },
  "rope-to-rope": {
    structuralJob: "rope-join",
    mainRole: "main-line",
    secondaryRole: "leader",
    isJoin: true,
  },
  "unequal-rope-join": {
    structuralJob: "rope-join",
    mainRole: "main-line",
    secondaryRole: "leader",
    isJoin: true,
  },
  "load-transfer": {
    structuralJob: "load-transfer",
    mainRole: "main-line",
    isJoin: false,
  },
  stopper: {
    structuralJob: "stopper",
    mainRole: "main-line",
    isJoin: false,
  },
  "shorten-line": {
    structuralJob: "shorten-line",
    mainRole: "main-line",
    isJoin: false,
  },
  "mid-line-loop": {
    structuralJob: "mid-line-loop",
    mainRole: "main-line",
    isJoin: false,
  },
  "tension-line": {
    structuralJob: "tension-line",
    mainRole: "main-line",
    isJoin: false,
  },
  "reef-or-bind": {
    structuralJob: "reef-or-bind",
    mainRole: "main-line",
    secondaryRole: "leader",
    isJoin: true,
  },
};

export function connectionSides(job: ConnectionJob): ConnectionSides {
  const p = PRESETS[job];
  if (!p) {
    return { structuralJob: "terminal-to-hardware", mainRole: "main-line", isJoin: false };
  }
  return p;
}

export function isJoinJob(job: ConnectionJob | undefined): boolean {
  if (!job) return false;
  return connectionSides(job).isJoin;
}

/** Dual-write fields derived from a convenience connection preset. */
export function dualWriteFromConnection(job: ConnectionJob): {
  structuralJob: StructuralJob;
  mainRole: MaterialRole;
  secondaryRole?: MaterialRole;
  mainMaterialHint?: LineMaterial;
  secondaryMaterialHint?: LineMaterial;
  isJoin: boolean;
} {
  const p = connectionSides(job);
  return {
    structuralJob: p.structuralJob,
    mainRole: p.mainRole,
    isJoin: p.isJoin,
    ...(p.secondaryRole ? { secondaryRole: p.secondaryRole } : {}),
    ...(p.mainMaterialHint ? { mainMaterialHint: p.mainMaterialHint } : {}),
    ...(p.secondaryMaterialHint ? { secondaryMaterialHint: p.secondaryMaterialHint } : {}),
  };
}
