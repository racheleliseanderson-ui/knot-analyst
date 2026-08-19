/**
 * Seed batch 3 — terminal connections from Hook the Horizon library inventory.
 * Decision/diagnosis only.
 */
import type { KnotContent } from "@/domain/types";

export const SEED_BATCH_3_TERMINAL: KnotContent[] = [
  {
    id: "berkley-braid",
    name: "Berkley Braid Knot",
    aliases: ["Berkley braid"],
    category: "terminal",
    bestFor: ["hook-to-line", "high-strength"],
    goodFor:
      "Braid-focused terminal using a doubled line through the eye; strong grip on slick superline.",
    notIdealFor: [
      "Tiny eyes that will not accept doubled braid",
      "When a simple Palomar already seats cleanly",
    ],
    lineMaterials: ["braid"],
    strengthRetentionTypical:
      "High on braid when doubled and seated; treat published single figures as technique-dependent bands",
    difficulty: "intermediate",
    materialsNeeded: ["Braid", "Hook or lure with eye large enough for doubled line"],
    howToSummary:
      "Double braid, pass through eye, form Uni-style wraps with the doubled section, seat barrel to eye, lock.",
    steps: [
      { order: 1, instruction: "Double a section of braid and pass the loop through the eye." },
      {
        order: 2,
        instruction:
          "Form a Uni-style loop with the doubled tag and wrap through it several times.",
      },
      {
        order: 3,
        instruction:
          "Moisten; form a neat barrel and slide it to the eye; lock with opposing pull.",
      },
      { order: 4, instruction: "Trim both tag ends short." },
    ],
    commonMistakes: ["Eye too small for doubled braid", "Under-wrapped barrel", "Dry seat"],
    diagnostics: [
      {
        id: "berkley-braid-slip",
        symptom: "Barrel walks or slips under load",
        likelyCauses: ["Under-wrapped", "Incomplete lock", "Eye geometry wrong"],
        checks: ["Barrel butted to eye", "Wrap uniformity"],
        fixes: ["Retie with more wraps", "Confirm eye accepts doubled line"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Berkley Braid Knot",
        url: "https://hookthehorizon.blog/berkley-braid-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["palomar", "uni-knot", "san-diego-jam"],
    tags: ["terminal", "braid"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "FishingKnots.com strength database (Berkley Braid band)" },
      { title: "Hook the Horizon — Berkley Braid Knot" },
    ],
  },
  {
    id: "davy",
    name: "Davy Knot",
    aliases: ["Davy"],
    category: "terminal",
    bestFor: ["fly-hook", "easy-quick"],
    goodFor: "Very fast compact tippet-to-fly terminal for small flies and competition work.",
    notIdealFor: [
      "Large flies under heavy tippet (prefer Double Davy or Orvis)",
      "Braid terminals",
    ],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Solid mid-high band on tippet when fully seated; speed is the primary job",
    difficulty: "beginner",
    materialsNeeded: ["Tippet", "Fly"],
    howToSummary:
      "Through eye, single hitch structure around standing tippet, seat tight to the eye.",
    steps: [
      { order: 1, instruction: "Pass tippet through the eye." },
      {
        order: 2,
        instruction: "Form the Davy hitch around the standing tippet and pull tag to seat.",
      },
      { order: 3, instruction: "Slide the hitch to the eye and lock; trim tag short." },
    ],
    commonMistakes: ["Incomplete seat", "Using on oversized flies without the double version"],
    diagnostics: [
      {
        id: "davy-slip",
        symptom: "Hitch opens under load",
        likelyCauses: ["Incomplete seat", "Wrong tippet diameter for the fly"],
        checks: ["Hitch tight against eye"],
        fixes: ["Retie", "Step up to Double Davy"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Davy Knot",
        url: "https://hookthehorizon.blog/davy-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["double-davy", "orvis", "pitzen"],
    tags: ["terminal", "fly", "tippet", "fast"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "FishingKnots.com strength database (Davy band)" },
      { title: "Hook the Horizon — Davy Knot" },
    ],
  },
  {
    id: "double-davy",
    name: "Double Davy Knot",
    aliases: ["Double Davy"],
    category: "terminal",
    bestFor: ["fly-hook", "easy-quick"],
    goodFor: "Davy with an extra security pass for larger flies or slightly heavier tippet.",
    notIdealFor: ["Absolute smallest midges where a single Davy is enough"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Slightly more secure band than single Davy when the second pass seats",
    difficulty: "beginner",
    materialsNeeded: ["Tippet", "Fly"],
    howToSummary: "Davy structure with a second pass for security before seating to the eye.",
    steps: [
      { order: 1, instruction: "Pass tippet through the eye." },
      { order: 2, instruction: "Form the Davy hitch and take the extra security pass." },
      { order: 3, instruction: "Seat to the eye and trim." },
    ],
    commonMistakes: ["Skipping the second pass", "Bulky seat on very light tippet"],
    diagnostics: [
      {
        id: "double-davy-slip",
        symptom: "Opens under load",
        likelyCauses: ["Incomplete second pass", "Poor seat"],
        checks: ["Both passes visible and tight"],
        fixes: ["Retie carefully"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Double Davy Knot",
        url: "https://hookthehorizon.blog/double-davy-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["davy", "orvis", "pitzen"],
    tags: ["terminal", "fly", "tippet"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "FishingKnots.com strength database (Double Davy band)" },
      { title: "Hook the Horizon — Double Davy" },
    ],
  },
  {
    id: "egg-loop",
    name: "Egg Loop Knot",
    aliases: ["Egg loop", "Bait loop"],
    category: "terminal",
    bestFor: ["snell-hook", "hook-to-line"],
    goodFor:
      "Creates a bait-holding loop on the hook shank for salmon/steelhead egg and bait presentations.",
    notIdealFor: ["Lure-only terminals", "Quick lure changes"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "High when shank wraps are even; geometry matters as much as raw retention",
    difficulty: "intermediate",
    materialsNeeded: ["Mono or fluoro", "Hook with shank suitable for wraps"],
    howToSummary:
      "Form a standing loop along the shank with parallel wraps that leave a bait-holding loop near the eye or bend per method.",
    steps: [
      {
        order: 1,
        instruction: "Position line along the shank and form the working loop for bait.",
      },
      { order: 2, instruction: "Wrap tightly along the shank (typically 5–10+ even turns)." },
      {
        order: 3,
        instruction: "Finish through the remaining loop, seat, and confirm the bait loop holds.",
      },
    ],
    commonMistakes: ["Crossed wraps", "Loop too small to hold bait", "Loose column"],
    diagnostics: [
      {
        id: "egg-loop-slide",
        symptom: "Loop collapses or slides",
        likelyCauses: ["Under-wrapped", "Crossed wraps", "Incomplete finish"],
        checks: ["Parallel wrap inspection", "Loop size under light tension"],
        fixes: ["Retie with even wraps"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Egg Loop Knot",
        url: "https://hookthehorizon.blog/egg-loop-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["snell", "uni-snell", "easy-snell"],
    tags: ["terminal", "bait", "salmon", "steelhead"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "FishingKnots.com strength database (Egg Loop band)" },
      { title: "Hook the Horizon — Egg Loop" },
    ],
  },
  {
    id: "orvis",
    name: "Orvis Knot",
    aliases: ["Orvis tippet knot (terminal form)"],
    category: "terminal",
    bestFor: ["fly-hook", "easy-quick"],
    goodFor:
      "Compact, clean terminal for flies and light tippet; fast once the sequence is automatic.",
    notIdealFor: ["Heavy braid terminals", "Large saltwater hooks without testing"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "High compact band on mono/fluoro tippet when seated fully",
    difficulty: "beginner",
    materialsNeeded: ["Tippet", "Fly or light terminal"],
    howToSummary:
      "Through eye, form the Orvis structure around the standing tippet, seat tight, trim short.",
    steps: [
      { order: 1, instruction: "Pass tippet through the eye." },
      { order: 2, instruction: "Form the Orvis hitch sequence around the standing tippet." },
      { order: 3, instruction: "Moisten, seat to the eye, trim tag." },
    ],
    commonMistakes: ["Incomplete sequence", "Dry seat on fluoro"],
    diagnostics: [
      {
        id: "orvis-slip",
        symptom: "Slips or opens",
        likelyCauses: ["Wrong sequence", "Incomplete seat"],
        checks: ["Structure tight at eye"],
        fixes: ["Retie", "Compare to vetted diagram"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Orvis Knot",
        url: "https://hookthehorizon.blog/orvis-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["davy", "pitzen", "improved-clinch"],
    tags: ["terminal", "fly", "tippet"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "FishingKnots.com strength database (Orvis band)" },
      { title: "Hook the Horizon — Orvis Knot" },
    ],
  },
  {
    id: "pitzen",
    name: "Pitzen Knot",
    aliases: ["16-20 knot", "Pitzen"],
    category: "terminal",
    bestFor: ["fly-hook", "high-strength"],
    goodFor:
      "Compact high-retention tippet terminal popular in competition and technical fly work.",
    notIdealFor: ["Cold hands in high wind without practice", "Braid"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "High band when wraps are even and the tag path is correct",
    difficulty: "intermediate",
    materialsNeeded: ["Tippet", "Fly"],
    howToSummary:
      "Through eye, multiple wraps around standing tippet with a specific tag return, seat compact to the eye.",
    steps: [
      {
        order: 1,
        instruction: "Pass tippet through the eye and form the standing wrap structure.",
      },
      { order: 2, instruction: "Complete the Pitzen tag path and wraps." },
      { order: 3, instruction: "Moisten and seat compact against the eye; trim." },
    ],
    commonMistakes: ["Wrong tag path", "Uneven wraps", "Under-seating"],
    diagnostics: [
      {
        id: "pitzen-slip",
        symptom: "Fails under load",
        likelyCauses: ["Wrong path", "Incomplete seat"],
        checks: ["Compact even stack at eye"],
        fixes: ["Retie slowly", "Practice offline"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Pitzen Knot",
        url: "https://hookthehorizon.blog/pitzen-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["orvis", "davy", "double-davy"],
    tags: ["terminal", "fly", "tippet", "compact"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Hook the Horizon — Pitzen Knot" },
      { title: "Field practice (cross-checked compact tippet terminals)" },
    ],
  },
  {
    id: "turle",
    name: "Turle Knot",
    aliases: ["Turtle knot", "Turle"],
    category: "terminal",
    bestFor: ["fly-hook"],
    goodFor:
      "Traditional fly terminal that seats around the eye to keep the fly more in-line with the tippet.",
    notIdealFor: [
      "Maximum strength critical tippet (modern compact knots often preferred)",
      "Braid",
    ],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Moderate band; geometry and fly alignment are the job, not peak retention",
    difficulty: "intermediate",
    materialsNeeded: ["Tippet", "Fly"],
    howToSummary:
      "Through eye, form Turle structure that cinches around the eye/head region, seat, trim.",
    steps: [
      { order: 1, instruction: "Pass tippet through the eye." },
      { order: 2, instruction: "Form the Turle hitch so it will seat around the eye." },
      { order: 3, instruction: "Moisten and pull so the knot cinches behind the eye; trim." },
    ],
    commonMistakes: ["Seating on the wrong side of the eye", "Incomplete cinch"],
    diagnostics: [
      {
        id: "turle-misalign",
        symptom: "Fly cocks off-axis or knot slips",
        likelyCauses: ["Wrong seat position", "Incomplete cinch"],
        checks: ["Fly alignment with tippet"],
        fixes: ["Retie", "Consider Orvis/Davy for pure strength"],
        severity: "watch",
        confidence: "moderate",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Turle Knot",
        url: "https://hookthehorizon.blog/turle-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["orvis", "davy", "improved-clinch"],
    tags: ["terminal", "fly", "traditional"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "FishingKnots.com strength database (Turle band)" },
      { title: "Hook the Horizon — Turle Knot" },
    ],
  },
  {
    id: "baja",
    name: "Baja Knot",
    aliases: ["Baja"],
    category: "terminal",
    bestFor: ["hook-to-line", "high-strength"],
    goodFor: "Heavy-leader terminal used with stout mono/fluoro for big-game style terminal jobs.",
    notIdealFor: ["Light tippet fly work", "Tiny eyes"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "Strong band on heavy mono/fluoro when wraps are even and seated wet",
    difficulty: "intermediate",
    materialsNeeded: ["Heavy mono or fluoro", "Large-eye hook or terminal"],
    howToSummary:
      "Through eye, multiple wraps with a locking pass suited to stiff heavy leader, seat hard.",
    steps: [
      { order: 1, instruction: "Pass heavy leader through the eye with enough tag for wraps." },
      { order: 2, instruction: "Complete Baja wraps and locking path." },
      { order: 3, instruction: "Moisten thoroughly and seat under steady pressure; trim." },
    ],
    commonMistakes: ["Dry seat on stiff fluoro", "Too few wraps for the diameter"],
    diagnostics: [
      {
        id: "baja-slip",
        symptom: "Unwraps or heats under load",
        likelyCauses: ["Dry friction", "Under-wrapped", "Incomplete lock"],
        checks: ["Wrap count", "Even stack"],
        fixes: ["Retie wet", "Add wraps"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Baja Knot",
        url: "https://hookthehorizon.blog/baja-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["san-diego-jam", "trilene", "uni-knot"],
    tags: ["terminal", "heavy", "leader"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Hook the Horizon — Baja Knot" },
      { title: "Field practice (heavy mono/fluoro terminals)" },
    ],
  },
  {
    id: "clinch",
    name: "Clinch Knot",
    aliases: ["Simple clinch", "Basic clinch"],
    category: "terminal",
    bestFor: ["hook-to-line", "easy-quick"],
    goodFor:
      "Fast basic mono/fluoro terminal when speed matters more than the improved clinch’s extra pass.",
    notIdealFor: ["Braid", "Maximum security (use Improved Clinch or Palomar)"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Lower band than Improved Clinch; adequate when wraps are sufficient and seated",
    difficulty: "beginner",
    materialsNeeded: ["Line", "Hook or swivel"],
    howToSummary:
      "Through eye, wraps around standing line, tag through the small loop above the eye, seat.",
    steps: [
      { order: 1, instruction: "Pass tag through the eye." },
      { order: 2, instruction: "Wrap tag around standing line 5–7 times." },
      {
        order: 3,
        instruction: "Pass tag through the small loop above the eye; moisten and seat; trim.",
      },
    ],
    commonMistakes: ["Too few wraps", "Confusing with Improved Clinch", "Dry seat"],
    diagnostics: [
      {
        id: "clinch-unwrap",
        symptom: "Unwraps under load",
        likelyCauses: ["Too few wraps", "Incomplete seat", "Braid used"],
        checks: ["Wrap count"],
        fixes: ["Retie with 5–7 wraps", "Upgrade to Improved Clinch"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Clinch Knot",
        url: "https://hookthehorizon.blog/clinch-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["improved-clinch", "palomar", "uni-knot"],
    tags: ["terminal", "classic", "beginner"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Hook the Horizon — Clinch Knot" },
      { title: "Animated Knots / field practice (basic clinch)" },
    ],
  },
  {
    id: "uni-snell",
    name: "Uni Snell Knot",
    aliases: ["Snell Knot — Uni Version", "Uni snell"],
    category: "terminal",
    bestFor: ["snell-hook", "high-strength"],
    goodFor:
      "Snell that uses Uni-barrel structure along the shank for anglers who already trust the Uni.",
    notIdealFor: ["When a traditional snell is already automatic and preferred"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "High when Uni barrel compresses evenly on the shank",
    difficulty: "intermediate",
    materialsNeeded: ["Line", "Hook with usable shank"],
    howToSummary:
      "Form a Uni-style barrel that compresses along the hook shank so load stays on-axis with the point.",
    steps: [
      { order: 1, instruction: "Position line along the shank and form the Uni loop." },
      { order: 2, instruction: "Wrap the tag through the loop to build a barrel on the shank." },
      { order: 3, instruction: "Slide/compress the barrel along the shank and lock; trim." },
    ],
    commonMistakes: ["Barrel not fully compressed", "Crossed wraps", "Finishing short of the eye"],
    diagnostics: [
      {
        id: "uni-snell-slide",
        symptom: "Barrel slides on shank",
        likelyCauses: ["Loose compression", "Too few wraps"],
        checks: ["Even barrel on shank"],
        fixes: ["Retie under tension"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Uni Snell",
        url: "https://hookthehorizon.blog/snell-knot-uni-version/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["snell", "easy-snell", "egg-loop"],
    tags: ["snell", "bait", "hook"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Hook the Horizon — Uni Snell" },
      { title: "Field practice (snell family)" },
    ],
  },
  {
    id: "easy-snell",
    name: "Easy Snell Knot",
    aliases: ["Easy snell"],
    category: "terminal",
    bestFor: ["snell-hook", "easy-quick"],
    goodFor:
      "Simplified snell sequence for consistent shank wraps without the full traditional formality.",
    notIdealFor: ["When traditional or Uni snell geometry is already preferred and practiced"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical: "Comparable snell-family band when wraps are parallel and seated",
    difficulty: "beginner",
    materialsNeeded: ["Line", "Hook"],
    howToSummary:
      "Simplified parallel shank wraps finished through a loop so load tracks the point.",
    steps: [
      { order: 1, instruction: "Lay line along the shank and form a working loop." },
      { order: 2, instruction: "Wrap evenly toward the eye." },
      { order: 3, instruction: "Pass tag through the remaining loop, seat parallel wraps, trim." },
    ],
    commonMistakes: ["Crossed wraps", "Too few turns", "Loose finish"],
    diagnostics: [
      {
        id: "easy-snell-slide",
        symptom: "Slides down shank",
        likelyCauses: ["Loose wraps", "Incomplete finish"],
        checks: ["Parallel wrap inspection"],
        fixes: ["Retie under light tension"],
        severity: "stop",
        confidence: "high",
      },
    ],
    resources: [
      {
        type: "article",
        title: "Easy Snell",
        url: "https://hookthehorizon.blog/easy-snell-knot/",
        source: "Hook the Horizon",
        vetted: true,
      },
    ],
    relatedKnots: ["snell", "uni-snell", "egg-loop"],
    tags: ["snell", "bait", "beginner"],
    reviewedOn: "2026-08-13",
    sources: [
      { title: "Hook the Horizon — Easy Snell" },
      { title: "Field practice (snell family)" },
    ],
  },
];
