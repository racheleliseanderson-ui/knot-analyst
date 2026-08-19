import type { KnotContent } from "@/data/types";

export const LOOP_KNOTS: KnotContent[] = [
  {
    id: "perfection-loop",
    name: "Perfection Loop",
    aliases: ["Angler’s loop"],
    category: "loop",
    bestFor: ["loop-connection", "leader-tippet", "easy-quick"],
    goodFor:
      "Compact fixed loop at the end of a leader or line — ideal for loop-to-loop connections in fly systems.",
    notIdealFor: ["Creating a free-swinging lure loop at the eye (use Non-Slip Mono Loop)"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Compact fixed end loop; typically 85–95% when the loop sequence is correct.",
    difficulty: "beginner",
    materialsNeeded: ["Line or leader end"],
    howToSummary:
      "Form two loops in sequence, pass the second through the first, then pass the tag around and through to seat a neat fixed loop.",
    steps: [
      {
        order: 1,
        instruction: "Form a loop by crossing the tag over the standing line (loop A).",
      },
      {
        order: 2,
        instruction: "Form a second loop (loop B) in front of loop A with the tag.",
      },
      {
        order: 3,
        instruction: "Pass loop B through loop A.",
      },
      {
        order: 4,
        instruction:
          "Bring the tag between the loops, then seat by pulling the standing line and loop B.",
        tip: "Keep the finished loop size intentional before full tension.",
      },
      {
        order: 5,
        instruction: "Trim the tag close.",
      },
    ],
    commonMistakes: ["Confusing loop order", "Tag path wrong resulting in a slip loop"],
    diagnostics: [
      {
        id: "perf-slips",
        symptom: "Loop slips or collapses",
        likelyCauses: ["Incorrect loop sequence"],
        checks: ["Compare to a trusted diagram step-by-step"],
        fixes: ["Practice with rope", "Retie carefully"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "video",
        title: "Perfection Loop — Animated Knots",
        url: "https://www.animatedknots.com/perfection-loop-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["surgeons-loop", "non-slip-mono-loop"],
    tags: ["fly", "loop-to-loop", "leader"],
    reviewedOn: "2026-08-09",
    sources: [{ title: "Animated Knots — Perfection Loop" }],
  },
  {
    id: "surgeons-loop",
    name: "Surgeon’s Loop",
    aliases: ["Double surgeon’s loop"],
    category: "loop",
    bestFor: ["loop-connection", "easy-quick"],
    goodFor:
      "Very fast fixed loop — bulkier than a Perfection Loop but easier under pressure or with cold hands.",
    notIdealFor: ["When the absolute smallest loop knot is required"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Bulky reliable loop; typically 85–95% of the doubled line when two passes seat.",
    difficulty: "beginner",
    materialsNeeded: ["Line end"],
    howToSummary: "Double the line, tie a double (or triple) overhand with the bight, and seat.",
    steps: [
      { order: 1, instruction: "Double the end of the line to form a long bight." },
      {
        order: 2,
        instruction:
          "Tie an overhand knot with the bight, then pass the bight through a second time.",
      },
      { order: 3, instruction: "Moisten and pull to seat; trim the tag if a separate tag exists." },
    ],
    commonMistakes: ["Single overhand only", "Loop larger than needed"],
    diagnostics: [
      {
        id: "sloop-bulk",
        symptom: "Too bulky for small guides or keepers",
        likelyCauses: ["Heavy line", "Triple pass unnecessary"],
        checks: ["Compare to Perfection Loop size"],
        fixes: ["Use Perfection Loop", "Drop to double surgeon"],
        severity: "info",
        confidence: "moderate",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Surgeon’s Loop",
        url: "https://www.animatedknots.com/surgeons-loop-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["perfection-loop"],
    tags: ["loop", "fast", "cold-hands"],
    reviewedOn: "2026-08-09",
    sources: [{ title: "Animated Knots — Surgeon’s Loop" }],
  },
  {
    id: "bimini-twist",
    name: "Bimini Twist",
    aliases: ["Bimini"],
    category: "loop",
    bestFor: ["loop-connection", "high-strength", "join-lines"],
    goodFor:
      "Creates a strong double-line loop used in big-game and light-tackle leader systems. Advanced and time-consuming but highly regarded when done correctly.",
    notIdealFor: ["Quick bankside re-ties", "Beginners without practice gear"],
    lineMaterials: ["mono", "fluoro", "braid"],
    strengthRetentionTypical:
      "Class double. Published tests commonly near full line when the sleeve is dense and locked — treat as a high band, technique-sensitive.",
    difficulty: "advanced",
    materialsNeeded: ["Long enough line section", "Space to twist under tension"],
    toolsHelpful: ["Rod holder or partner for tension"],
    howToSummary:
      "Form a long loop, apply many twists under tension, seat the twists into a compact braid of line, lock with half-hitches, and finish cleanly.",
    steps: [
      {
        order: 1,
        instruction:
          "Form a long loop (often 3–5+ ft depending on system) and put the loop under tension.",
      },
      {
        order: 2,
        instruction:
          "Rotate the loop end to put 20–40+ twists into the doubled section while maintaining tension.",
      },
      {
        order: 3,
        instruction:
          "Compress the twists so they gather, then carefully work the tag to lock the twist column.",
      },
      {
        order: 4,
        instruction: "Finish with a series of half-hitches and a secure end finish; trim excess.",
      },
    ],
    commonMistakes: [
      "Losing tension mid-twist",
      "Too few twists",
      "Rushed lock that lets twists unravel",
    ],
    diagnostics: [
      {
        id: "bimini-unravels",
        symptom: "Twists unravel before fishing",
        likelyCauses: ["Lost tension", "Incomplete lock"],
        checks: ["Inspect twist column density"],
        fixes: [
          "Practice with heavier cord",
          "Use a partner for tension",
          "Watch a long-form vetted demo",
        ],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Bimini Twist overview",
        url: "https://www.animatedknots.com/bimini-twist-knot",
        source: "Animated Knots by Grog",
        vetted: true,
        notes: "Advanced — pair with a trusted video instructor.",
      },
    ],
    relatedKnots: ["perfection-loop", "fg"],
    tags: ["big-game", "double-line", "advanced"],
    reviewedOn: "2026-08-09",
    sources: [{ title: "Animated Knots — Bimini Twist" }],
  },
];
