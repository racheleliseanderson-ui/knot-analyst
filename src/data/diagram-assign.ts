/**
 * Distinctive schematic family per knot.
 * Shared families stay only where the geometry really is the same job
 * (e.g. bowline / water-bowline / Yosemite still share the bowline collar).
 */
import type { DiagramKind } from "@/domain/types";

export const DIAGRAM_KIND_BY_KNOT: Partial<Record<string, DiagramKind>> = {
  // Compact fly hitches — not a wrap-to-the-eye clinch.
  davy: "terminal-davy",
  "double-davy": "terminal-davy",
  orvis: "terminal-davy",
  jacks: "terminal-davy",
  centauri: "terminal-davy",
  turle: "terminal-turle",
  "harvey-dry-fly": "terminal-turle",

  // Terminals that are not a generic wrap-to-the-eye barrel.
  clinch: "terminal-clinch",
  "improved-clinch": "terminal-improved",
  trilene: "terminal-trilene",
  pitzen: "terminal-pitzen",
  baja: "terminal-pitzen",
  jansik: "terminal-jansik",
  "eye-crosser": "terminal-jansik",
  "san-diego-jam": "terminal-jam",
  "egg-loop": "terminal-egg",
  knotless: "terminal-knotless",

  "loop-to-loop": "loop-handshake",
  rapala: "loop-rapala",

  blood: "line-blood",
  surgeons: "line-surgeons",
  "orvis-tippet": "line-surgeons",
  albright: "line-albright",
  "j-knot": "line-albright",

  "round-turn-two-half-hitches": "rope-hitch-round",
  "anchor-bend": "rope-hitch-round",
  "buntline-hitch": "rope-hitch-buntline",
  "halyard-hitch": "rope-hitch-buntline",
  "clove-hitch": "rope-hitch-clove",
  constrictor: "rope-hitch-clove",
  "rolling-hitch": "rope-hitch-rolling",
  "midshipmans-hitch": "rope-hitch-rolling",
  "icicle-hitch": "rope-hitch-icicle",
  "cow-hitch": "rope-hitch-pile",
  "pile-hitch": "rope-hitch-pile",
  "timber-hitch": "rope-timber",
  "truckers-hitch": "rope-trucker",

  "figure-8-loop": "rope-loop-figure8",
  "alpine-butterfly": "rope-loop-butterfly",
  "bowline-on-a-bight": "rope-loop-bight",

  "zeppelin-bend": "rope-bend-zeppelin",
  "hunters-bend": "rope-bend-zeppelin",
  "carrick-bend": "rope-bend-carrick",
  "reef-knot": "rope-reef",

  "ashley-stopper": "rope-stopper-ashley",
  "heaving-line-knot": "rope-heaving",
};
