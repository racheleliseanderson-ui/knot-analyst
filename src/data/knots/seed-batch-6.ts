/**
 * Seed batch 6 — remaining line-to-line / loop jobs from Hook the Horizon.
 * Decision/diagnosis only.
 */
import type { KnotContent } from "@/domain/types";

export const SEED_BATCH_6: KnotContent[] = [
  {
    id: "bristol",
    name: "Bristol Knot",
    aliases: ["No-Name knot", "Improved Bristol"],
    category: "line-to-line",
    bestFor: ["braid-to-leader", "high-strength"],
    goodFor:
      "Shock leader onto a doubled main line so the leader barrel compresses on two strands, not one.",
    notIdealFor: [
      "Single-line braid-to-leader (use FG / Slim Beauty)",
      "When no double exists yet",
    ],
    lineMaterials: ["braid", "mono", "fluoro", "mixed"],
    strengthRetentionTypical:
      "Tom Rowland No-Name/Bristol tests averaged ~77% braid-to-fluoro; treat as a mid-high band when the double is sound",
    difficulty: "intermediate",
    materialsNeeded: ["Doubled main line (Bimini or equivalent)", "Mono or fluoro shock leader"],
    howToSummary:
      "Double first. Leader wraps both legs, returns through the doubled opening, wet close, test the double and the Bristol.",
    steps: [
      {
        order: 1,
        instruction:
          "Create the doubled main line first. A Bristol on one strand is a different, weaker knot.",
      },
      {
        order: 2,
        instruction:
          "Pass the leader tag through the doubled section and leave a long working tag.",
      },
      {
        order: 3,
        instruction:
          "Wrap the leader around both main-line legs, turns adjacent, then return through the doubled opening.",
      },
      {
        order: 4,
        instruction:
          "Moisten the leader, close gradually, test both the double and the Bristol, then trim for guides.",
      },
    ],
    commonMistakes: ["No prerequisite double", "Crossed leader wraps", "Return misses both legs"],
    diagnostics: [
      {
        id: "bristol-double",
        symptom: "Join walks or the thin main cuts itself",
        likelyCauses: ["Single-strand wrap", "Weak double", "Crossed wraps"],
        checks: ["Double is load-bearing", "Leader barrel on both legs"],
        fixes: ["Tie a real double first", "Retie the Bristol"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Bristol Knot",
        url: "https://hookthehorizon.blog/bristol-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["yucatan", "aussie-quickie", "fg"],
    tags: ["line-to-line", "double-line", "braid"],
    reviewedOn: "2026-08-14",
    sources: [
      {
        title: "NetKnots — Bristol Knot",
        url: "https://www.netknots.com/fishing_knots/bristol-knot",
      },
      { title: "Tom Rowland — No-Name / Bristol pull tests (~77% average)" },
      { title: "Hook the Horizon — Bristol Knot" },
    ],
  },
  {
    id: "double-double-uni",
    name: "Double Double Uni Knot",
    aliases: ["Double-double Uni", "Doubled Double Uni"],
    category: "line-to-line",
    bestFor: ["braid-to-leader"],
    goodFor:
      "Doubled-braid Uni barrel against a leader Uni when you already trust Uni geometry more than FG diameter.",
    notIdealFor: ["Micro guides that punish bulk", "When a slimmer Alberto or FG already seats"],
    lineMaterials: ["braid", "mono", "fluoro", "mixed"],
    strengthRetentionTypical:
      "More grip than a basic Double Uni on slick braid; bulkier. Band sits with the Uni-join family, not FG.",
    difficulty: "intermediate",
    materialsNeeded: ["Braid", "Mono or fluoro leader"],
    howToSummary:
      "Double the working braid, Uni that double around both lines (~8), Uni the leader (~5–6), wet, slide barrels together.",
    steps: [
      { order: 1, instruction: "Overlap braid and leader, then double the working braid section." },
      {
        order: 2,
        instruction: "Uni-loop the doubled braid and wrap around both lines about eight times.",
      },
      { order: 3, instruction: "Uni-loop the leader and wrap five to six times." },
      {
        order: 4,
        instruction: "Moisten, close each barrel, pull them together, check bulk, trim.",
      },
    ],
    commonMistakes: [
      "Braid not doubled through the whole barrel",
      "Too few braid wraps",
      "One Uni closes before dressing",
    ],
    diagnostics: [
      {
        id: "ddu-bulk",
        symptom: "Join clicks in the guides or one side walks",
        likelyCauses: ["Single-strand braid barrel", "Uneven close", "Tags too long"],
        checks: ["Doubled braid through the barrel", "Both barrels butted"],
        fixes: ["Retie with a real double", "Trim after the seat"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Double Double Uni Knot",
        url: "https://hookthehorizon.blog/double-double-uni-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["double-uni", "alberto", "fg"],
    tags: ["line-to-line", "uni-family", "braid"],
    reviewedOn: "2026-08-14",
    sources: [
      {
        title: "NetKnots — Double Double Uni",
        url: "https://www.netknots.com/fishing_knots/double-double-uni-knot",
      },
      { title: "Hook the Horizon — Double Double Uni Knot" },
    ],
  },
  {
    id: "loop-to-loop",
    name: "Loop-to-Loop Connection",
    aliases: ["Handshake loop", "Loop-to-loop join"],
    category: "line-to-line",
    bestFor: ["loop-to-loop"],
    goodFor:
      "Interlocking two finished loops (fly line to leader) so the leader can be swapped without cutting.",
    notIdealFor: [
      "Damaged factory loops",
      "When lowest profile matters (Nail / Needle)",
      "Girth-hitched assembly",
    ],
    lineMaterials: ["fly-line", "mono", "fluoro", "mixed"],
    strengthRetentionTypical:
      "Only as honest as the weaker loop. The join itself is not a retention figure.",
    difficulty: "beginner",
    materialsNeeded: ["Finished fly-line loop", "Finished leader loop"],
    howToSummary:
      "Pass leader loop through fly-line loop, then the whole leader through its own loop, pull into matching U-shapes — not a girth hitch.",
    steps: [
      {
        order: 1,
        instruction: "Inspect both loops for coating damage, abrasion, and a sound knot or splice.",
      },
      { order: 2, instruction: "Pass the leader loop through the fly-line loop." },
      { order: 3, instruction: "Pass the entire leader through its own loop." },
      {
        order: 4,
        instruction:
          "Pull apart into matching U-shapes. If one loop cinches around the other, undo — that is a girth hitch.",
      },
    ],
    commonMistakes: [
      "Girth-hitch assembly",
      "Damaged factory loop",
      "Oversized leader loop catching guides",
    ],
    diagnostics: [
      {
        id: "ltl-girth",
        symptom: "One loop cinches and cuts the other",
        likelyCauses: ["Wrong assembly order", "Damaged coating"],
        checks: ["Matching U-shapes", "Neither loop collapsed"],
        fixes: ["Undo and reassemble as a handshake", "Replace a damaged factory loop"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Loop-to-Loop Connection",
        url: "https://hookthehorizon.blog/loop-to-loop-connection/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["perfection-loop", "surgeons-loop", "nail-knot"],
    tags: ["line-to-line", "fly", "loop"],
    reviewedOn: "2026-08-14",
    sources: [
      {
        title: "NetKnots — Loop-to-Loop",
        url: "https://www.netknots.com/fishing_knots/loop-to-loop-knot",
      },
      { title: "Hook the Horizon — Loop-to-Loop Connection" },
    ],
  },
  {
    id: "willis",
    name: "Willis Knot",
    aliases: ["Willis lead-core connection"],
    category: "specialty",
    bestFor: ["braid-to-leader"],
    goodFor:
      "Mono leader inserted into a hollow lead-core sheath after the lead is pulled — finger-trap grip.",
    notIdealFor: ["Solid braid", "Normal mono/fluoro main line", "Damaged sheath"],
    lineMaterials: ["braid", "mono", "mixed"],
    strengthRetentionTypical:
      "Depends on intact sheath and insertion length, not a published single figure. Treat as a mid band when the trap is long and undamaged.",
    difficulty: "advanced",
    materialsNeeded: ["Lead-core line with a hollow braided sheath", "Monofilament leader"],
    howToSummary:
      "Break and extract the lead, insert mono deep into the hollow sheath, milk the trap, inspect, finish only if the leader material requires it.",
    steps: [
      {
        order: 1,
        instruction: "Bend the lead-core sharply so the internal lead breaks at the transition.",
      },
      { order: 2, instruction: "Slide the broken lead out, leaving intact hollow sheath." },
      {
        order: 3,
        instruction: "Insert the mono leader deeply and milk the sheath so it contracts uniformly.",
      },
      {
        order: 4,
        instruction:
          "Pull lengthwise, inspect for sheath damage or leader movement, then finish only if required.",
      },
    ],
    commonMistakes: [
      "Sheath cut while pulling lead",
      "Shallow insertion",
      "Lead left under the grip",
    ],
    diagnostics: [
      {
        id: "willis-sheath",
        symptom: "Leader slides out or the sheath parts",
        likelyCauses: ["Cut sheath", "Too short a trap", "Lead still in the grip"],
        checks: ["Sheath intact", "Insertion length", "No lead under the trap"],
        fixes: ["Cut back and restart", "Do not use on solid braid"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Willis Knot",
        url: "https://hookthehorizon.blog/willis-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["loop-to-loop", "nail-knot"],
    tags: ["specialty", "lead-core"],
    reviewedOn: "2026-08-14",
    sources: [
      {
        title: "NetKnots — Willis Knot",
        url: "https://www.netknots.com/fishing_knots/willis-knot",
      },
      { title: "Hook the Horizon — Willis Knot" },
    ],
  },
  {
    id: "kryston-loop",
    name: "Kryston Non-Slip Loop",
    aliases: ["Kryston loop", "Kryston non-slip"],
    category: "loop",
    bestFor: ["line-to-loop"],
    goodFor: "Mono lure/hook loop that tests well in nylon. Not a fluoro knot.",
    notIdealFor: ["Fluorocarbon", "Anyone who already inspects a Kreh/Rapala more reliably"],
    lineMaterials: ["mono"],
    strengthRetentionTypical:
      "NetKnots material notes: tests well in mono, poorly in fluoro. Band is the mono family only.",
    difficulty: "intermediate",
    materialsNeeded: ["Monofilament", "Hook or lure"],
    howToSummary:
      "Loose mono loop, through the eye, Kryston return path, size the open loop, wet close, confirm it does not cinch.",
    steps: [
      {
        order: 1,
        instruction: "Form the initial loose mono loop at the intended distance from the tag.",
      },
      { order: 2, instruction: "Pass the tag through the hook or lure eye." },
      { order: 3, instruction: "Route the tag through the Kryston crossing — not a Kreh path." },
      {
        order: 4,
        instruction: "Set loop size, moisten nylon, close, pull-test, confirm the loop stays open.",
      },
    ],
    commonMistakes: ["Fluoro substituted for mono", "Loop closes", "Return path reversed"],
    diagnostics: [
      {
        id: "kryston-fluoro",
        symptom: "Loop slips or the lock fails",
        likelyCauses: ["Fluoro used", "Reversed return", "Loop sized after the close"],
        checks: ["Material is nylon", "Loop still open under pull"],
        fixes: ["Retie in mono", "Use Kreh/Rapala if you must fish fluoro"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Kryston Non-Slip Loop Knot",
        url: "https://hookthehorizon.blog/kryston-non-slip-loop-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["non-slip-mono-loop", "rapala", "homer-rhode"],
    tags: ["loop", "mono", "lure"],
    reviewedOn: "2026-08-14",
    sources: [
      {
        title: "NetKnots — Kryston Non-Slip Loop",
        url: "https://www.netknots.com/fishing_knots/kryston-non-slip-loop-knot",
      },
      { title: "Hook the Horizon — Kryston Non-Slip Loop Knot" },
    ],
  },
];
