import type { DomainVenue } from "@/domain/venue";

export const BOATING_VENUES: DomainVenue[] = [
  {
    id: "dock",
    label: "Dock / cleat",
    summary: "Tide range, surge, and lines that must be freed under load.",
    conditions: {},
    punishes:
      "Anything that jams. A dock line you cannot cast off in surge is a hazard, not a hold.",
    watch: "Turns that have welded together after a tide cycle.",
    fix: "Finish with a form that can be broken by hand while the load is still on.",
  },
  {
    id: "mooring",
    label: "Mooring ball",
    summary: "Cyclic snatch loading and hours of chafe at one point.",
    conditions: {},
    punishes:
      "A single unprotected contact point. The rope fails at the fairlead, never in the knot.",
    watch: "Glazing and flattening where the rope crosses the bow roller.",
    fix: "Chafe gear first, then a knot that can be re-made in the dark.",
  },
  {
    id: "anchorage",
    label: "Anchorage",
    summary: "Shock absorption, snubbers, and load you cannot release by hand.",
    conditions: {},
    punishes: "Rigid low-stretch construction. Snatch load has to go somewhere.",
    watch: "The snubber attachment after a blow — check the hitch, not the chain.",
    fix: "Nylon for stretch, and a hitch that grips the chain without stripping under cycling.",
  },
  {
    id: "running-rigging",
    label: "Halyard / sheet duty",
    summary: "Repeated loading and unloading, winch drums, clutches, fairleads.",
    conditions: {},
    punishes: "Bulk and slippery cover. Bulk jams the clutch; slick cover slips the knot.",
    watch: "Any knot in HMPE — it should probably be a splice.",
    fix: "Splice where the load is permanent; keep knots for what you undo.",
  },
  {
    id: "towing",
    label: "Towing",
    summary: "Surging load, catastrophic recoil, and knots you must release under strain.",
    conditions: {},
    punishes: "Everything that cannot be released loaded. A jammed tow line is cut, not untied.",
    watch: "Rope stretch narrowing the diameter and loosening every turn.",
    fix: "Rig for release from the towing vessel before you take the strain.",
  },
  {
    id: "lifelines",
    label: "Lifelines / jacklines",
    summary: "Low-frequency use, high consequence, long UV exposure.",
    conditions: {},
    punishes: "Anything unverified. This is the gear that gets tested once.",
    watch: "UV chalking and stiffness in polyester covers.",
    fix: "Replace on age, not on appearance.",
  },
];
