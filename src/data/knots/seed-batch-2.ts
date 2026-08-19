/**
 * Seed batch 2 — additional modelled connections (content layer).
 * Decision/diagnosis only; no tutorial expansion beyond minimal steps.
 */
import type { KnotContent } from "@/domain/types";

export const SEED_BATCH_2: KnotContent[] = [
  {
    id: "slim-beauty",
    name: "Slim Beauty Knot",
    aliases: ["Slim Beauty", "Huffnagle-related"],
    category: "line-to-line",
    bestFor: ["braid-to-leader", "join-lines", "high-strength"],
    goodFor:
      "Braid (often doubled) to heavy mono/fluoro leader with a slim profile that still passes guides. Field-friendlier alternative to FG when diameter jump is large.",
    notIdealFor: [
      "Absolute thinnest single-line FG profile",
      "Equal-diameter mono joins (Blood / Double Uni)",
    ],
    lineMaterials: ["braid", "mixed"],
    strengthRetentionTypical:
      "High band when seated; technique-sensitive like other braid-leader joins",
    difficulty: "intermediate",
    materialsNeeded: ["Braid main (often doubled)", "Heavier mono or fluoro leader"],
    toolsHelpful: ["Clippers"],
    howToSummary:
      "Figure-8 in the leader; pass doubled braid through; wrap down and back; lock through the figure-8; seat hard and trim.",
    steps: [
      {
        order: 1,
        instruction: "Tie a loose double overhand in the leader end and open it into a figure-8.",
      },
      {
        order: 2,
        instruction:
          "Double a section of braid and pass the loop through both openings of the figure-8.",
      },
      {
        order: 3,
        instruction:
          "Wrap the doubled braid down the leader several times, then back toward the figure-8.",
        tip: "Keep wraps parallel and snug — gaps kill retention.",
      },
      {
        order: 4,
        instruction:
          "Pass the braid loop back through the figure-8 gap, moisten, and seat by opposing pull on braid and leader.",
      },
      {
        order: 5,
        instruction: "Trim tags short; confirm collinear exits and no hinge.",
      },
    ],
    commonMistakes: [
      "Loose figure-8 that never locks",
      "Too few wraps on a heavy leader",
      "Seating dry on fluoro",
    ],
    diagnostics: [
      {
        id: "slim-beauty-slip",
        symptom: "Braid walks off the leader",
        likelyCauses: ["Under-wrapped", "Incomplete seat", "Figure-8 never locked"],
        checks: ["Wrap density", "Pull-test before fishing"],
        fixes: [
          "Retie with more wraps",
          "Seat wet and hard",
          "Consider FG when practice time allows",
        ],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Slim Beauty Knot overview",
        url: "https://castandspear.com/slim-beauty-knot/",
        source: "Cast & Spear",
        vetted: true,
      },
    ],
    relatedKnots: ["fg", "alberto", "yucatan", "double-uni"],
    tags: ["braid", "leader", "slim", "offshore"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Cast & Spear — Slim Beauty", url: "https://castandspear.com/slim-beauty-knot/" },
      { title: "FishingKnots.com strength database (Slim Beauty band)" },
    ],
  },
  {
    id: "spider-hitch",
    name: "Spider Hitch",
    aliases: ["Spider hitch double"],
    category: "loop",
    bestFor: ["loop-connection", "high-strength", "easy-quick"],
    goodFor:
      "Fast doubled-line loop used as a quicker alternative to a Bimini when time or conditions do not allow a full twist column.",
    notIdealFor: [
      "Maximum big-game double-line strength (Bimini still preferred when you can build it)",
      "Situations where the hitch can work loose under cyclic load without inspection",
    ],
    lineMaterials: ["mono", "fluoro", "braid"],
    strengthRetentionTypical:
      "High on mono/fluoro when formed correctly; treat as a practical double, not a magic 100% claim",
    difficulty: "intermediate",
    materialsNeeded: ["Enough line to form a long bight"],
    howToSummary:
      "Form a long bight, take multiple wraps of the bight around the standing pair, pass the loop through, and seat under tension.",
    steps: [
      {
        order: 1,
        instruction: "Form a long bight (loop length matches the double-line you need).",
      },
      {
        order: 2,
        instruction:
          "Wrap the bight around both standing legs several times (typically 5–8+ depending on line).",
      },
      {
        order: 3,
        instruction:
          "Pass the working loop through the remaining opening and pull standing lines to seat the hitch column.",
      },
      {
        order: 4,
        instruction:
          "Confirm the double holds under a firm pull; trim only if a separate tag exists.",
      },
    ],
    commonMistakes: [
      "Too few wraps",
      "Seating without continuous tension",
      "Using it as a permanent substitute for a poorly built Bimini without inspection",
    ],
    diagnostics: [
      {
        id: "spider-hitch-slip",
        symptom: "Double unravels or shortens under load",
        likelyCauses: ["Under-wrapped", "Incomplete seat"],
        checks: ["Wrap count", "Hitch column density"],
        fixes: ["Retie with more wraps", "Build a Bimini when time allows"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Spider Hitch — Animated Knots",
        url: "https://www.animatedknots.com/spider-hitch-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["bimini-twist", "yucatan", "surgeons-loop"],
    tags: ["double-line", "fast", "loop"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Animated Knots — Spider Hitch" },
      { title: "FishingKnots.com strength database (Spider Hitch band)" },
    ],
  },
  {
    id: "nail-knot",
    name: "Nail Knot",
    aliases: ["Tube knot", "Needle knot variant"],
    category: "line-to-line",
    bestFor: ["join-lines"],
    goodFor:
      "Smooth, low-profile join of fly line (or similar large-diameter line) to a mono/fluoro leader so the connection passes rod guides cleanly.",
    notIdealFor: [
      "Braid-to-leader offshore joins (use FG / Slim Beauty family)",
      "Equal thin mono tippet joins (Blood / Surgeon)",
    ],
    lineMaterials: ["fly-line", "mono", "fluoro", "mixed"],
    strengthRetentionTypical:
      "Typically high 80s to low 90s of the weaker side when wraps are even and seated",
    difficulty: "intermediate",
    materialsNeeded: ["Fly line end", "Leader", "Nail, tube, or needle as form"],
    toolsHelpful: ["Nail or hollow tube", "Clippers"],
    howToSummary:
      "Lay leader beside fly line over a nail/tube; wrap leader around both and the tool; slide the coil onto the fly line; seat and trim.",
    steps: [
      {
        order: 1,
        instruction:
          "Lay the leader parallel to the fly-line tip with a nail or tube as a temporary form.",
      },
      {
        order: 2,
        instruction: "Wrap the leader tightly around the fly line and tool for several even turns.",
      },
      {
        order: 3,
        instruction:
          "Pass the leader tag through the path left by the tool; remove the tool and slide the coil onto the fly line.",
      },
      {
        order: 4,
        instruction: "Moisten and seat the wraps toward the fly-line tip; trim tags carefully.",
      },
    ],
    commonMistakes: [
      "Uneven or gapped wraps",
      "Coil not fully transferred onto the fly line",
      "Over-trimming before the seat is complete",
    ],
    diagnostics: [
      {
        id: "nail-knot-slip",
        symptom: "Leader slides off the fly-line tip",
        likelyCauses: ["Too few wraps", "Incomplete seat", "Coil never transferred"],
        checks: ["Wrap uniformity", "Tag exit"],
        fixes: ["Retie with even wraps", "Seat fully before trimming"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Nail Knot — Animated Knots",
        url: "https://www.animatedknots.com/nail-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["albright", "perfection-loop", "surgeons"],
    tags: ["fly", "leader", "low-profile"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Animated Knots — Nail Knot" },
      { title: "FishingKnots.com strength database (Nail Knot band)" },
    ],
  },
];
