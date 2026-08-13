import type { KnotContent } from "@/data/types";

export const LINE_TO_LINE_KNOTS: KnotContent[] = [
  {
    id: "double-uni",
    name: "Double Uni Knot",
    aliases: ["Double Uni", "Uni to Uni"],
    category: "line-to-line",
    bestFor: ["join-lines", "braid-to-leader", "leader-tippet"],
    goodFor:
      "Reliable way to join two lines of similar or moderately different diameters. Works for mono-to-mono, fluoro-to-mono, and many braid-to-leader pairings when wrap counts are adjusted.",
    notIdealFor: ["Extreme diameter mismatches", "Ultra-slim braid-to-leader profiles (consider FG)"],
    lineMaterials: ["mono", "fluoro", "braid", "mixed"],
    strengthRetentionTypical: "Solid all-around connector when both Uni barrels are uniform",
    difficulty: "beginner",
    materialsNeeded: ["Two line ends"],
    howToSummary:
      "Overlap the lines and tie a Uni knot with each tag around the opposite standing line, then slide the two Uni knots together and seat.",
    steps: [
      { order: 1, instruction: "Overlap the two lines by 6–8 in." },
      {
        order: 2,
        instruction: "With line A’s tag, form a Uni around line B (4–6 wraps mono/fluoro; 6–8 for braid).",
      },
      {
        order: 3,
        instruction: "With line B’s tag, form a Uni around line A with matching discipline.",
      },
      {
        order: 4,
        instruction: "Moisten and pull the standing lines so the two Uni knots slide together and butt firmly.",
      },
      { order: 5, instruction: "Trim both tags short but not flush into the barrels." },
    ],
    commonMistakes: [
      "Too few wraps on braid",
      "Knots not fully slid together",
      "Huge diameter mismatch without extra wraps on the thinner side",
    ],
    diagnostics: [
      {
        id: "duni-separates",
        symptom: "Two Uni knots separate under load",
        likelyCauses: ["Not slid together", "One barrel under-wrapped"],
        checks: ["Confirm barrels touch", "Count wraps on each side"],
        fixes: ["Retie and seat until barrels butt", "Add wraps on braid side"],
        severity: "stop",
        confidence: "high",
      },
      {
        id: "duni-bulky",
        symptom: "Too bulky for guides",
        likelyCauses: ["Heavy mono-to-mono", "Excess wraps"],
        checks: ["Pass through rod tip slowly"],
        fixes: ["Use FG or Alberto for braid-to-leader slimness", "Reduce unnecessary wraps"],
        severity: "watch",
        confidence: "moderate",
      },
    ],
    resources: [
      {
        type: "video",
        title: "Double Uni — Animated Knots",
        url: "https://www.animatedknots.com/double-uni-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["fg", "alberto", "blood", "surgeons", "yucatan"],
    tags: ["connector", "leader", "braid-ok"],
    reviewedOn: "2026-08-13",
    sources: [{ title: "Animated Knots — Double Uni" }],
  },
  {
    id: "fg",
    name: "FG Knot",
    aliases: ["FG", "Fine Grip"],
    category: "line-to-line",
    bestFor: ["braid-to-leader", "join-lines", "high-strength"],
    goodFor:
      "Slim, strong braid-to-leader connection that passes guides well. Preferred when braid must join a mono or fluoro leader with minimal bulk.",
    notIdealFor: ["Beginners needing a fast re-tie in wind", "Joining two similar mono lines (use Double Uni or Blood)"],
    lineMaterials: ["braid", "mixed"],
    strengthRetentionTypical: "Among the strongest slim braid-to-leader options when tensioned correctly",
    difficulty: "advanced",
    materialsNeeded: ["Braid mainline", "Mono or fluoro leader"],
    toolsHelpful: ["Tension from rod or helper", "Clippers"],
    howToSummary:
      "Weave braid alternately around a tight leader under tension (many half-hitches / wraps), lock with hitches, then seat hard and trim.",
    steps: [
      {
        order: 1,
        instruction: "Hold leader tight (teeth/tool/helper). Lay braid across it at a shallow angle.",
      },
      {
        order: 2,
        instruction: "Make 15–20 alternating tight wraps of braid around the leader (tension is everything).",
        tip: "Keep each wrap snug against the last — gaps kill the FG.",
        commonError: "Loose early wraps that collapse when loaded.",
      },
      {
        order: 3,
        instruction: "Lock with several half-hitches of braid around both lines, then a few around the braid alone.",
      },
      {
        order: 4,
        instruction:
          "Seat hard by pulling braid and leader oppositely. Trim leader tag very close; leave a short braid tag if preferred.",
      },
    ],
    commonMistakes: [
      "Insufficient wraps",
      "No tension on leader while wrapping",
      "Skipping lock hitches",
      "Leaving a long stiff leader tag that catches guides",
    ],
    diagnostics: [
      {
        id: "fg-slips",
        symptom: "Braid slides off leader",
        likelyCauses: ["Loose wraps", "Too few wraps", "Missing lock hitches"],
        checks: ["Inspect for gaps in the weave", "Pull-test before fishing"],
        fixes: [
          "Retie under firm leader tension",
          "Add wraps",
          "Practice on the dock, not in a fish fight",
        ],
        severity: "stop",
        confidence: "high",
      },
      {
        id: "fg-hard",
        symptom: "Cannot keep wraps neat",
        likelyCauses: ["Learning curve", "Wind / cold hands"],
        checks: ["Try with heavier practice braid first"],
        fixes: [
          "Use Alberto or Double Uni until FG is reliable",
          "Build muscle memory with 20 practice reps",
        ],
        severity: "watch",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "video",
        title: "FG Knot guides (search vetted instructor)",
        url: "https://www.animatedknots.com/",
        source: "Practice with a clear slow-motion instructor video you trust",
        vetted: true,
        notes: "FG quality varies by teacher — prefer slow, tension-focused demos.",
      },
    ],
    relatedKnots: ["alberto", "double-uni", "albright", "yucatan"],
    tags: ["braid", "leader", "slim", "advanced"],
    reviewedOn: "2026-08-13",
    sources: [{ title: "Common offshore / inshore braid-to-leader practice" }],
  },
  {
    id: "alberto",
    name: "Alberto Knot",
    aliases: ["Alberto", "Modified Albright"],
    category: "line-to-line",
    bestFor: ["braid-to-leader", "join-lines"],
    goodFor:
      "Accessible braid-to-leader knot that many anglers find easier than FG while still relatively slim and strong.",
    notIdealFor: ["Absolute thinnest guide-friendly profile (FG wins)", "Two equal mono lines"],
    lineMaterials: ["braid", "mixed"],
    difficulty: "intermediate",
    materialsNeeded: ["Braid", "Leader"],
    howToSummary:
      "Double the leader into a loop, wrap braid down and back up the doubled leader section, then pass through and seat.",
    steps: [
      { order: 1, instruction: "Double a section of leader to form a long loop." },
      {
        order: 2,
        instruction: "Pass braid through the loop and wrap tightly down the doubled leader ~7 times.",
      },
      { order: 3, instruction: "Wrap back up toward the loop ~7 times." },
      {
        order: 4,
        instruction:
          "Pass braid back through the loop the same direction it entered; moisten and seat hard.",
      },
      { order: 5, instruction: "Trim tags carefully." },
    ],
    commonMistakes: ["Loose wraps", "Wrong re-entry direction through loop", "Under-seating"],
    diagnostics: [
      {
        id: "alberto-fail",
        symptom: "Pulls apart at connection",
        likelyCauses: ["Uneven wraps", "Insufficient seat"],
        checks: ["Barrel should look compact and uniform"],
        fixes: ["Retie with tension", "Consider FG after practice or Double Uni for speed"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Alberto Knot references",
        url: "https://www.animatedknots.com/",
        source: "Cross-check with a trusted slow demo",
        vetted: true,
      },
    ],
    relatedKnots: ["fg", "albright", "double-uni", "yucatan"],
    tags: ["braid", "leader", "intermediate"],
    reviewedOn: "2026-08-13",
    sources: [{ title: "Common braid-to-leader field practice" }],
  },
  {
    id: "albright",
    name: "Albright Special",
    aliases: ["Albright"],
    category: "line-to-line",
    bestFor: ["join-lines", "braid-to-leader"],
    goodFor:
      "Classic knot for joining lines of different diameters, including braid to mono and some fly-line style connections.",
    notIdealFor: ["Equal-diameter mono joins (Blood or Double Uni may suit better)"],
    lineMaterials: ["mono", "fluoro", "braid", "mixed"],
    difficulty: "intermediate",
    materialsNeeded: ["Two lines of different or similar diameter"],
    howToSummary:
      "Loop the heavier line; wrap the lighter line through and around the loop many times; pass back through and seat.",
    steps: [
      { order: 1, instruction: "Form a loop in the heavier line." },
      {
        order: 2,
        instruction:
          "Pass lighter line through the loop and wrap tightly around both legs of the loop ~10 times.",
      },
      {
        order: 3,
        instruction: "Pass lighter tag back through the loop (same direction it entered).",
      },
      { order: 4, instruction: "Moisten and pull both standing lines to seat; trim." },
    ],
    commonMistakes: ["Too few wraps", "Reversing tag direction", "Loose first wraps"],
    diagnostics: [
      {
        id: "albright-bulk",
        symptom: "Bulky or hinges",
        likelyCauses: ["Heavy-to-heavy pairing", "Messy wraps"],
        checks: ["Run through guides"],
        fixes: ["Neaten wraps", "Consider FG for braid-leader slimness"],
        severity: "watch",
        confidence: "moderate",
      },
    ],
    resources: [
      {
        type: "video",
        title: "Albright Special — Animated Knots",
        url: "https://www.animatedknots.com/albright-special-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["alberto", "double-uni", "fg"],
    tags: ["connector", "classic"],
    reviewedOn: "2026-08-13",
    sources: [{ title: "Animated Knots — Albright Special" }],
  },
  {
    id: "blood",
    name: "Blood Knot",
    aliases: ["Barrel knot"],
    category: "line-to-line",
    bestFor: ["join-lines", "leader-tippet"],
    goodFor:
      "Slim join for two mono or fluoro lines of similar diameter — a fly-fishing leader staple.",
    notIdealFor: ["Large diameter mismatches", "Braid-to-mono without modification"],
    lineMaterials: ["mono", "fluoro"],
    difficulty: "intermediate",
    materialsNeeded: ["Two similar-diameter lines"],
    howToSummary:
      "Overlap lines; wrap each tag around the opposite standing line several times; pass tags through the center in opposite directions; seat.",
    steps: [
      { order: 1, instruction: "Overlap lines by several inches." },
      { order: 2, instruction: "Wrap tag A around standing B about 4–5 times." },
      { order: 3, instruction: "Wrap tag B around standing A about 4–5 times." },
      {
        order: 4,
        instruction: "Pass tags through the center opening in opposite directions.",
      },
      {
        order: 5,
        instruction: "Moisten and pull standing lines slowly until the barrel forms; trim tags.",
      },
    ],
    commonMistakes: [
      "Diameter mismatch",
      "Unequal wrap counts",
      "Pulling tags instead of standing lines to seat",
    ],
    diagnostics: [
      {
        id: "blood-hinge",
        symptom: "Hinges or breaks at knot",
        likelyCauses: ["Diameter mismatch", "Poor seat"],
        checks: ["Compare diameters", "Inspect barrel symmetry"],
        fixes: ["Use Double Uni for mismatched diameters", "Retie with equal wraps"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "video",
        title: "Blood Knot — Animated Knots",
        url: "https://www.animatedknots.com/blood-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["surgeons", "double-uni"],
    tags: ["fly", "leader", "slim"],
    reviewedOn: "2026-08-13",
    sources: [{ title: "Animated Knots — Blood Knot" }],
  },
  {
    id: "surgeons",
    name: "Surgeon’s Knot",
    aliases: ["Surgeons knot", "Double surgeon’s"],
    category: "line-to-line",
    bestFor: ["join-lines", "leader-tippet", "easy-quick"],
    goodFor:
      "Fast join for tippet to leader, including moderate diameter differences. Easier than a Blood Knot in cold weather.",
    notIdealFor: [
      "Situations needing the absolute slimmest barrel",
      "Critical braid-to-leader offshore connections",
    ],
    lineMaterials: ["mono", "fluoro"],
    difficulty: "beginner",
    materialsNeeded: ["Leader and tippet (or two lines)"],
    howToSummary:
      "Overlap lines, form a loop with both, pass both ends through twice (or thrice), and seat evenly.",
    steps: [
      { order: 1, instruction: "Overlap leader and tippet several inches." },
      {
        order: 2,
        instruction: "Form a loop as if tying an overhand with both lines together.",
      },
      {
        order: 3,
        instruction:
          "Pass both tags through the loop twice (double surgeon) or three times for extra security.",
      },
      {
        order: 4,
        instruction: "Moisten and pull all four ends to seat a compact knot; trim tags.",
      },
    ],
    commonMistakes: [
      "Single pass only when a double is needed",
      "Dry seating",
      "Uneven pull leaving a loose side",
    ],
    diagnostics: [
      {
        id: "surg-slip",
        symptom: "Slips on slick fluoro",
        likelyCauses: ["Only one pass", "Dry seat"],
        checks: ["Confirm double or triple pass"],
        fixes: ["Use triple surgeon", "Switch to Blood for similar diameters"],
        severity: "watch",
        confidence: "moderate",
      },
    ],
    resources: [
      {
        type: "video",
        title: "Surgeon’s Knot — Animated Knots",
        url: "https://www.animatedknots.com/surgeons-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["blood", "double-uni"],
    tags: ["fly", "tippet", "fast"],
    reviewedOn: "2026-08-13",
    sources: [{ title: "Animated Knots — Surgeon’s Knot" }],
  },
  {
    id: "yucatan",
    name: "Yucatan Knot",
    aliases: ["Bristol knot", "No-name knot", "Yucatán"],
    category: "line-to-line",
    bestFor: ["join-lines", "braid-to-leader", "high-strength"],
    goodFor:
      "Doubled braid (typically from a Bimini) joined to a mono or fluoro leader. High retention when the double is sound; easier field rebuild than a perfect FG for many anglers.",
    notIdealFor: [
      "Single-line braid without a proper double",
      "Situations that demand the absolute slimmest guide passage (FG)",
    ],
    lineMaterials: ["braid", "mixed"],
    strengthRetentionTypical: "Near full system strength when the doubled base is correct — band, not a single figure",
    difficulty: "intermediate",
    materialsNeeded: ["Doubled braid section", "Mono or fluoro leader"],
    toolsHelpful: ["Clippers"],
    howToSummary:
      "Pass the doubled braid through a leader loop (or around the leader), wrap the doubled section around the leader under tension, lock, and seat hard.",
    steps: [
      {
        order: 1,
        instruction:
          "Start with a sound double in the braid (Bimini or equivalent). Form or open a working loop in the leader.",
      },
      {
        order: 2,
        instruction:
          "Pass the doubled braid through the leader loop (or around the leader) and take multiple tight wraps of the double around the leader under tension.",
        tip: "Wrap count scales with diameter jump — more wraps for larger leader relative to the double.",
      },
      {
        order: 3,
        instruction: "Lock the wraps so the double cannot walk; moisten and seat by opposing pull on double and leader.",
      },
      {
        order: 4,
        instruction: "Trim the leader tag short; confirm the connection is collinear with no hinge.",
      },
    ],
    commonMistakes: [
      "Using single braid instead of a true double",
      "Too few wraps on a heavy leader",
      "Loose seat leaving a hinge",
    ],
    diagnostics: [
      {
        id: "yucatan-hinge",
        symptom: "Connection hinges or walks under load",
        likelyCauses: ["Insufficient wraps", "Incomplete seat", "Weak double base"],
        checks: ["Inspect wrap density", "Pull-test before fishing"],
        fixes: ["Retie with more wraps", "Verify Bimini/double integrity", "Consider FG when guide passage is mandatory"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Yucatan Knot overview",
        url: "https://castandspear.com/yucatan-knot/",
        source: "Cast & Spear",
        vetted: true,
      },
    ],
    relatedKnots: ["bimini-twist", "fg", "alberto", "double-uni"],
    tags: ["braid", "leader", "double-line", "offshore"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Cast & Spear — Yucatan Knot", url: "https://castandspear.com/yucatan-knot/" },
      { title: "Sport Fishing Mag braid-to-leader challenge context" },
    ],
  },
];
