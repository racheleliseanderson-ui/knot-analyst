/**
 * Seed batch 4 — line-to-line and loop connections from Hook the Horizon library.
 * Decision/diagnosis only.
 */
import type { KnotContent } from "@/domain/types";

export const SEED_BATCH_4: KnotContent[] = [
  {
    id: "orvis-tippet",
    name: "Orvis Tippet Knot",
    aliases: ["Orvis tippet join"],
    category: "line-to-line",
    bestFor: ["leader-tippet", "join-lines"],
    goodFor:
      "Leader-to-tippet join with a slim profile and strong band on mono/fluoro, including fluorocarbon tippets.",
    notIdealFor: ["Extreme diameter jumps", "Braid-to-leader primary joins"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "High band (often cited near 90–95%) when diameters are similar and the structure seats fully",
    difficulty: "intermediate",
    materialsNeeded: ["Leader", "Tippet of similar diameter"],
    howToSummary:
      "Overlap leader and tippet, form the Orvis doubled-loop structure, pass tags through, seat all four ends evenly.",
    steps: [
      { order: 1, instruction: "Overlap leader and tippet several inches." },
      { order: 2, instruction: "Form the Orvis loop structure with both lines held together." },
      {
        order: 3,
        instruction:
          "Pass both tags through the loop the required times; moisten and seat all four ends evenly.",
      },
    ],
    commonMistakes: ["Uneven four-end seat", "Large diameter mismatch", "Dry seat on fluoro"],
    diagnostics: [
      {
        id: "orvis-tippet-fail",
        symptom: "Breaks at the join under load",
        likelyCauses: ["Incomplete seat", "Diameter mismatch", "Dry friction on fluoro"],
        checks: ["Even barrel", "Similar diameters"],
        fixes: ["Retie wet", "Match tippet diameter more closely"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Orvis Tippet Knot",
        url: "https://hookthehorizon.blog/orvis-tippet-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["surgeons", "blood", "j-knot", "seaguar"],
    tags: ["leader", "tippet", "fly"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Cast & Spear / field tests — Orvis Tippet strength band" },
      { title: "Hook the Horizon — Orvis Tippet Knot" },
    ],
  },
  {
    id: "seaguar",
    name: "Seaguar Knot",
    aliases: ["Seaguar join"],
    category: "line-to-line",
    bestFor: ["leader-tippet", "join-lines"],
    goodFor:
      "Fluoro-friendly line-to-line join when diameters are similar; popular for leader/tippet systems.",
    notIdealFor: ["Extreme mismatch", "Primary braid-to-heavy-leader (use FG/Slim Beauty family)"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "Strong similar-diameter band when twists and passes seat clean",
    difficulty: "intermediate",
    materialsNeeded: ["Two mono or fluoro sections of similar diameter"],
    howToSummary: "Parallel overlap, form paired loops, twist, pass tags through, seat all ends.",
    steps: [
      { order: 1, instruction: "Lay the two lines parallel with adequate overlap." },
      { order: 2, instruction: "Form the Seaguar loop/twist structure." },
      { order: 3, instruction: "Pass tags through, moisten, and pull all four ends to seat." },
    ],
    commonMistakes: ["Too few twists", "Uneven seat", "Forcing a large diameter jump"],
    diagnostics: [
      {
        id: "seaguar-fail",
        symptom: "Slips or breaks at join",
        likelyCauses: ["Incomplete twists", "Mismatch", "Dry seat"],
        checks: ["Twist count", "Even seat"],
        fixes: ["Retie", "Use Blood/Orvis Tippet for closer diameters"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Seaguar Knot",
        url: "https://hookthehorizon.blog/seaguar-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["orvis-tippet", "blood", "surgeons", "j-knot"],
    tags: ["leader", "tippet", "fluoro"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Hook the Horizon — Seaguar Knot" },
      { title: "Field practice (fluoro joins)" },
    ],
  },
  {
    id: "j-knot",
    name: "J Knot",
    aliases: ["J-knot"],
    category: "line-to-line",
    bestFor: ["leader-tippet", "join-lines"],
    goodFor:
      "Leader-to-tippet join that has tested well on similar-diameter tippet steps in independent shootouts.",
    notIdealFor: ["Braid primary joins", "Extreme mismatch"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "High similar-diameter band in tippet-step testing when seated correctly",
    difficulty: "intermediate",
    materialsNeeded: ["Leader", "Tippet"],
    howToSummary: "Overlap, form the J structure with both lines, complete passes, seat evenly.",
    steps: [
      { order: 1, instruction: "Overlap leader and tippet." },
      { order: 2, instruction: "Form the J-knot structure with both lines." },
      { order: 3, instruction: "Complete tag passes; moisten and seat all ends." },
    ],
    commonMistakes: ["Incomplete passes", "Dry fluoro seat", "Large step-down without testing"],
    diagnostics: [
      {
        id: "j-knot-fail",
        symptom: "Fails at the tippet join",
        likelyCauses: ["Incomplete structure", "Diameter step too large"],
        checks: ["Even seat", "Diameter ratio"],
        fixes: ["Retie", "Reduce tippet step"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "J Knot",
        url: "https://hookthehorizon.blog/j-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["orvis-tippet", "blood", "surgeons"],
    tags: ["leader", "tippet", "fly"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Yellowstone Angler tippet shootout (J knot as strong tippet join)" },
      { title: "Hook the Horizon — J Knot" },
    ],
  },
  {
    id: "aussie-quickie",
    name: "Aussie Quickie",
    aliases: ["Australian quickie"],
    category: "line-to-line",
    bestFor: ["braid-to-leader", "join-lines"],
    goodFor:
      "Faster braid-to-leader option when guide passage and field tempo matter more than perfect FG.",
    notIdealFor: ["Absolute maximum slim FG profile", "Equal thin mono joins"],
    lineMaterials: ["braid", "mixed"],
    strengthRetentionTypical:
      "Competitive braid-leader band when wraps seat; technique-sensitive like other diameter-jump joins",
    difficulty: "intermediate",
    materialsNeeded: ["Braid main", "Mono or fluoro leader"],
    howToSummary: "Braid-to-leader wrap structure designed for speed and reasonable guide passage.",
    steps: [
      { order: 1, instruction: "Position braid and leader for the Aussie Quickie sequence." },
      { order: 2, instruction: "Complete the wrap and lock path." },
      { order: 3, instruction: "Moisten, seat hard, trim tags; check guide passage." },
    ],
    commonMistakes: ["Loose early wraps", "Incomplete lock", "Long stiff tags"],
    diagnostics: [
      {
        id: "aussie-quickie-slip",
        symptom: "Braid walks on leader",
        likelyCauses: ["Under-wrapped", "Poor seat"],
        checks: ["Wrap density", "Lock complete"],
        fixes: ["Retie", "Step up to FG when time allows"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Aussie Quickie",
        url: "https://hookthehorizon.blog/aussie-quickie/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["fg", "alberto", "slim-beauty", "double-uni"],
    tags: ["braid", "leader", "fast"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Hook the Horizon — Aussie Quickie" },
      { title: "Field practice (braid-leader family)" },
    ],
  },
  {
    id: "needle-knot",
    name: "Needle Knot",
    aliases: ["Needle nail variant"],
    category: "line-to-line",
    bestFor: ["join-lines"],
    goodFor:
      "Fly-line to leader transition with a needle-assisted path for a smooth, low-profile join.",
    notIdealFor: ["Braid-to-leader offshore joins", "No-tool bankside reties"],
    lineMaterials: ["fly-line", "mono", "fluoro", "mixed"],
    strengthRetentionTypical:
      "Similar band to Nail Knot when the coil seats fully on the fly-line tip",
    difficulty: "intermediate",
    materialsNeeded: ["Fly line", "Leader", "Needle"],
    toolsHelpful: ["Needle", "Clippers"],
    howToSummary:
      "Needle paths the leader into/alongside the fly-line tip; wraps form a smooth transition coil.",
    steps: [
      { order: 1, instruction: "Use the needle to establish the leader path at the fly-line tip." },
      { order: 2, instruction: "Wrap evenly and transfer the coil onto the fly line." },
      { order: 3, instruction: "Seat wet and trim tags carefully." },
    ],
    commonMistakes: ["Gapped wraps", "Coil not fully on fly line", "Damaging the fly-line core"],
    diagnostics: [
      {
        id: "needle-knot-slip",
        symptom: "Leader slides off fly-line tip",
        likelyCauses: ["Incomplete coil transfer", "Too few wraps"],
        checks: ["Coil uniformity on tip"],
        fixes: ["Retie", "Confirm needle path did not cut core"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Needle Knot",
        url: "https://hookthehorizon.blog/needle-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["nail-knot", "albright", "perfection-loop"],
    tags: ["fly", "leader", "low-profile"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "FishingKnots.com (Nail/Needle family band)" },
      { title: "Hook the Horizon — Needle Knot" },
    ],
  },
  {
    id: "homer-rhode",
    name: "Homer Rhode Loop Knot",
    aliases: ["Homer Rhodes", "Homer Rhode"],
    category: "loop",
    bestFor: ["loop-connection", "hook-to-line"],
    goodFor:
      "Heavy-leader free-swing loop for lures when you want action without a tiny tippet loop knot.",
    notIdealFor: ["Fine tippet dry-fly work", "Maximum slim fixed eye"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Solid loop band on heavy mono/fluoro when the non-slip structure completes",
    difficulty: "intermediate",
    materialsNeeded: ["Heavy mono or fluoro", "Lure or terminal with eye"],
    howToSummary: "Form a non-slip loop structure sized for heavy leader and free-swinging lures.",
    steps: [
      { order: 1, instruction: "Form the initial overhand / loop path through the eye." },
      { order: 2, instruction: "Complete Homer Rhode wraps around the standing line." },
      { order: 3, instruction: "Set loop size, moisten, seat, trim." },
    ],
    commonMistakes: ["Loop collapses while seating", "Too few wraps on heavy leader"],
    diagnostics: [
      {
        id: "homer-rhode-collapse",
        symptom: "Loop cinches closed",
        likelyCauses: ["Wrong tag path", "Incomplete non-slip structure"],
        checks: ["Loop holds under pull"],
        fixes: ["Retie", "Compare to Non-Slip Mono Loop"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Homer Rhode Loop",
        url: "https://hookthehorizon.blog/homer-rhode-loop-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["non-slip-mono-loop", "rapala", "king-sling"],
    tags: ["loop", "lure", "heavy"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Hook the Horizon — Homer Rhode" },
      { title: "Field practice (heavy leader loops)" },
    ],
  },
  {
    id: "king-sling",
    name: "King Sling",
    aliases: ["King sling loop"],
    category: "loop",
    bestFor: ["loop-connection"],
    goodFor:
      "Fixed end loop with controllable loop size for leaders and systems that need a stable loop.",
    notIdealFor: ["Free-swing lure action (prefer non-slip lure loops)"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "Solid fixed-loop band when the structure seats fully",
    difficulty: "intermediate",
    materialsNeeded: ["Line or leader end"],
    howToSummary: "Form a fixed end loop with the King Sling sequence; set size before final seat.",
    steps: [
      { order: 1, instruction: "Form the initial loops in sequence." },
      { order: 2, instruction: "Complete the King Sling path and set loop size." },
      { order: 3, instruction: "Seat and trim." },
    ],
    commonMistakes: ["Wrong loop order", "Loop larger than needed"],
    diagnostics: [
      {
        id: "king-sling-slip",
        symptom: "Loop slips or collapses",
        likelyCauses: ["Incorrect sequence"],
        checks: ["Loop stability under pull"],
        fixes: ["Retie", "Use Perfection Loop as alternate"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "King Sling",
        url: "https://hookthehorizon.blog/king-sling/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["perfection-loop", "surgeons-loop", "homer-rhode"],
    tags: ["loop", "leader"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Hook the Horizon — King Sling" },
      { title: "Field practice (fixed end loops)" },
    ],
  },
  {
    id: "australian-plait",
    name: "Australian Plait",
    aliases: ["Aussie plait", "Australian braid double"],
    category: "loop",
    bestFor: ["loop-connection", "high-strength"],
    goodFor:
      "Plaited double-line structure for heavy tackle when you need a strong double without a full Bimini twist column.",
    notIdealFor: ["Quick bankside reties", "Beginners without practice"],
    lineMaterials: ["mono", "fluoro", "braid"],
    strengthRetentionTypical:
      "High double-line band when the plait is tight and locked; still inspect before big-game use",
    difficulty: "advanced",
    materialsNeeded: ["Long enough line section for the plait"],
    howToSummary:
      "Plait the doubled section into a tight braid, lock the end, form the working double loop.",
    steps: [
      { order: 1, instruction: "Form a long doubled section." },
      { order: 2, instruction: "Plait tightly along the double." },
      { order: 3, instruction: "Lock the plait end and confirm the double holds under load." },
    ],
    commonMistakes: ["Loose plait", "Incomplete lock", "Too short a double"],
    diagnostics: [
      {
        id: "australian-plait-unravel",
        symptom: "Plait loosens under load",
        likelyCauses: ["Loose weave", "Incomplete lock"],
        checks: ["Plait density", "End lock"],
        fixes: ["Rebuild tighter", "Use Bimini when conditions allow"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Australian Plait",
        url: "https://hookthehorizon.blog/australian-plait/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["bimini-twist", "spider-hitch", "yucatan"],
    tags: ["double-line", "heavy", "advanced"],
    reviewedOn: "2026-08-14",
    sources: [
      { title: "Hook the Horizon — Australian Plait" },
      { title: "Field practice (double-line family)" },
    ],
  },
];
