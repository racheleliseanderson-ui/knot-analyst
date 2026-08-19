/**
 * Hook the Horizon content-package plates (0.3.19).
 * Paths are the attached SVGs — do not invent replacements.
 */
export const HTH_PACKAGE = "0.3.19";
export const HTH_SOURCE = "https://github.com/racheleliseanderson-ui/hth-content-packages";

/** knot-analyst id → HTH profile slug used in the zip. */
export const HTH_SLUG_BY_KNOT: Record<string, string> = {
  palomar: "palomar-knot",
  "improved-clinch": "improved-clinch-knot",
  "uni-knot": "uni-grinner-knot",
  trilene: "trilene-knot",
  "non-slip-mono-loop": "non-slip-loop-kreh-loop",
  rapala: "rapala-knot",
  snell: "snell-knot-traditional",
  "double-uni": "double-uni-knot",
  fg: "fg-knot",
  alberto: "alberto-knot",
  albright: "albright-special",
  blood: "blood-knot",
  surgeons: "surgeons-knot",
  yucatan: "yucatan-knot",
  "perfection-loop": "perfection-loop",
  "surgeons-loop": "surgeons-end-loop",
  "bimini-twist": "bimini-twist",
  "arbor-knot": "arbor-knot",
  "dropper-loop": "dropper-loop",
  "san-diego-jam": "san-diego-jam-knot",
  "slim-beauty": "slim-beauty-knot",
  "spider-hitch": "spider-hitch",
  "nail-knot": "nail-knot",
  "berkley-braid": "berkley-braid-knot",
  davy: "davy-knot",
  "double-davy": "double-davy-knot",
  "egg-loop": "egg-loop-knot",
  orvis: "orvis-knot",
  pitzen: "pitzen-knot",
  turle: "turle-knot",
  baja: "baja-knot",
  clinch: "clinch-knot",
  "uni-snell": "snell-knot-uni-version",
  "easy-snell": "easy-snell-knot",
  "orvis-tippet": "orvis-tippet-knot",
  seaguar: "seaguar-knot",
  "j-knot": "j-knot",
  "aussie-quickie": "aussie-quickie",
  "needle-knot": "needle-knot",
  "homer-rhode": "homer-rhode-loop-knot",
  "king-sling": "king-sling",
  "australian-plait": "australian-plait",
  centauri: "centauri-knot",
  "eye-crosser": "eye-crosser-knot",
  "fish-n-fool": "fish-n-fool-knot",
  "harvey-dry-fly": "harvey-dry-fly-knot",
  jacks: "jacks-knot",
  jansik: "jansik-special",
  knotless: "knotless-knot",
  nanofil: "nanofil-knot",
  "world-fair": "world-fair-knot",
  bristol: "bristol-knot",
  "double-double-uni": "double-double-uni-knot",
  "loop-to-loop": "loop-to-loop-connection",
  willis: "willis-knot",
  "kryston-loop": "kryston-non-slip-loop-knot",
};

export type HthPlateKind = "diagnostics" | "failure-modes" | "steps";

export interface HthPlates {
  slug: string;
  diagnostics?: string;
  failureModes?: string;
  steps?: string;
}

function publicUrl(kind: HthPlateKind, file: string): string {
  return `/hth/${kind}/${file}`;
}

export function hthSlugFor(knotId: string): string | undefined {
  return HTH_SLUG_BY_KNOT[knotId];
}

export function platesFor(knotId: string): HthPlates | undefined {
  const slug = HTH_SLUG_BY_KNOT[knotId];
  if (!slug) return undefined;
  const plates: HthPlates = { slug };
  // File names match the zip manifests. Missing kinds stay undefined.
  if (DIAGNOSTIC_SLUGS.has(slug)) {
    plates.diagnostics = publicUrl("diagnostics", `${slug}.svg`);
  }
  if (FAILURE_SLUGS.has(slug)) {
    plates.failureModes = publicUrl("failure-modes", `${slug}.svg`);
  }
  if (STEP_SLUGS.has(slug)) {
    plates.steps = publicUrl("steps", `${slug}-steps.svg`);
  }
  return plates.diagnostics || plates.failureModes || plates.steps ? plates : undefined;
}

/** Slugs that shipped a finished-state diagnostic plate in 0.3.19. */
const DIAGNOSTIC_SLUGS = new Set([
  "100-percent-arbor-knot",
  "alberto-knot",
  "albright-special",
  "arbor-knot",
  "aussie-quickie",
  "australian-plait",
  "baja-knot",
  "berkley-braid-knot",
  "bimini-twist",
  "blood-knot",
  "bobber-stopper-knot",
  "bristol-knot",
  "centauri-knot",
  "clinch-knot",
  "davy-knot",
  "double-davy-knot",
  "double-double-uni-knot",
  "double-uni-knot",
  "dropper-loop",
  "easy-snell-knot",
  "egg-loop-knot",
  "eye-crosser-knot",
  "fg-knot",
  "fish-n-fool-knot",
  "harvey-dry-fly-knot",
  "haywire-twist",
  "homer-rhode-loop-knot",
  "improved-clinch-knot",
  "j-knot",
  "jacks-knot",
  "jansik-special",
  "king-sling",
  "knot-tyer-nail-knot",
  "knotless-knot",
  "kryston-non-slip-loop-knot",
  "loop-to-loop-connection",
  "nail-knot",
  "nanofil-knot",
  "needle-knot",
  "non-slip-loop-kreh-loop",
  "offshore-swivel-knot",
  "orvis-knot",
  "orvis-tippet-knot",
  "palomar-knot",
  "perfection-loop",
  "pitzen-knot",
  "rapala-knot",
  "riffle-hitch",
  "san-diego-jam-knot",
  "seaguar-knot",
  "slim-beauty-knot",
  "snell-knot-traditional",
  "snell-knot-uni-version",
  "spider-hitch",
  "strike-indicator-double-uni",
  "strike-indicator-loop-knot",
  "surgeons-end-loop",
  "surgeons-knot",
  "tenkara-level-line-connection",
  "tenkara-traditional-line-connection",
  "trilene-knot",
  "turle-knot",
  "uni-grinner-knot",
  "willis-knot",
  "world-fair-knot",
  "yucatan-knot",
]);

/** Slugs that shipped an advanced four-mode failure plate in 0.3.19. */
const FAILURE_SLUGS = new Set([
  "alberto-knot",
  "albright-special",
  "bimini-twist",
  "blood-knot",
  "bristol-knot",
  "double-uni-knot",
  "fg-knot",
  "fish-n-fool-knot",
  "haywire-twist",
  "improved-clinch-knot",
  "kryston-non-slip-loop-knot",
  "loop-to-loop-connection",
  "nail-knot",
  "nanofil-knot",
  "needle-knot",
  "non-slip-loop-kreh-loop",
  "palomar-knot",
  "rapala-knot",
  "seaguar-knot",
  "snell-knot-traditional",
  "snell-knot-uni-version",
  "spider-hitch",
  "surgeons-knot",
  "uni-grinner-knot",
  "yucatan-knot",
]);

/** Slugs that shipped a construction-sequence plate in 0.3.19. */
const STEP_SLUGS = new Set([
  "alberto-knot",
  "albright-special",
  "bimini-twist",
  "blood-knot",
  "double-uni-knot",
  "fg-knot",
  "improved-clinch-knot",
  "nail-knot",
  "non-slip-loop-kreh-loop",
  "palomar-knot",
  "rapala-knot",
  "spider-hitch",
  "surgeons-knot",
  "uni-grinner-knot",
  "yucatan-knot",
]);
