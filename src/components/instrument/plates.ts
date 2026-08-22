import decideFishing from "@/assets/line-tension.jpg";

/**
 * Plate manifest — the one place the mode imagery is wired.
 *
 * Each entry may carry `image` (built asset URL) and `alt`. A missing image
 * is legitimate: ModePlate composes a layered gradient field instead, so a
 * mode never ships with a broken or subpar photograph. Replace entries here
 * as owned/generated photography lands in src/assets/plates/.
 */
export type PlateAsset = { image?: string; image2x?: string; alt: string };

export const PLATES: Record<string, PlateAsset> = {
  "decide.fishing": {
    image: decideFishing,
    alt: "Braid-to-leader connection under tension at first light",
  },
  "decide.boating": {
    alt: "Dock line under tension on a horn cleat",
  },
  diagnose: {
    alt: "Recovered line end on a bench under raking light",
  },
  compare: {
    alt: "Two knot specimens pinned side by side",
  },
  library: {
    alt: "Knot specimens arranged for reference",
  },
  applications: {
    alt: "Terminal tackle laid out on a dark bench",
  },
  tie: {
    alt: "Line coiled mid-tie",
  },
};

export function plate(key: string): PlateAsset {
  return PLATES[key] ?? { alt: "" };
}
