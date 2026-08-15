import type { KnotContent } from "@/domain/types";

export const UTILITY_KNOTS: KnotContent[] = [
  {
    id: "arbor-knot",
    name: "Arbor Knot",
    aliases: ["Reel knot", "Spool knot"],
    category: "utility",
    bestFor: ["easy-quick"],
    goodFor:
      "Attaches line or backing to a bare reel arbor. A rig-up knot: it only has to resist spool slip while the first wraps bed down.",
    notIdealFor: ["Any load-bearing terminal or line-to-line job"],
    lineMaterials: ["mono", "fluoro", "braid", "backing"],
    strengthRetentionTypical:
      "Spool grip only — not a fighting-strength figure. Band is 'will not slip the arbor,' not line-break.",
    difficulty: "beginner",
    materialsNeeded: ["Reel with bail open", "Line spool"],
    howToSummary:
      "Pass the line around the arbor, tie an overhand around the standing line, tie a second overhand in the tag as a stopper, then draw both down onto the arbor.",
    steps: [
      {
        order: 1,
        instruction: "Pass the tag end around the reel arbor and bring it back alongside the standing line.",
        tip: "Open the bail first — a line trapped under a closed bail seats crooked.",
      },
      {
        order: 2,
        instruction: "Tie a simple overhand knot with the tag around the standing line.",
        commonError: "Tying the overhand around itself instead of around the standing line — it will not cinch.",
        failureLinks: ["arbor-knot-tag"],
      },
      {
        order: 3,
        instruction: "Tie a second overhand in the tag alone, about a finger-width out, as a stopper.",
      },
      {
        order: 4,
        instruction: "Pull the standing line so the first knot slides down and both knots jam against the arbor. Trim the tag.",
        tip: "On braid, add a strip of tape or a mono backing underlay — braid will slip on a bare metal arbor no matter how well the knot is tied.",
        failureLinks: ["arbor-knot-loose", "arbor-knot-gap"],
      },
    ],
    commonMistakes: [
      "Braid straight onto a bare aluminium arbor",
      "No stopper knot in the tag",
      "Spooling under no tension so the bed collapses later",
    ],
    diagnostics: [
      {
        id: "arbor-spins",
        symptom: "Whole spool of line spins on the arbor",
        likelyCauses: ["Braid on bare metal", "Knot never cinched"],
        checks: ["Pull the line hard and watch for arbor rotation"],
        fixes: ["Strip the spool, add tape or a mono underlay, respool under tension"],
        severity: "stop",
        confidence: "high",
        retieDecision: "retie-now",
        stepLink: 4,
      },
    ],
    resources: [
      {
        type: "article",
        title: "Arbor Knot",
        url: "https://www.animatedknots.com/arbor-knot-fishing",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["uni-knot"],
    tags: ["rig-up", "spool", "backing"],
    reviewedOn: "2026-08-10",
    sources: [{ title: "Animated Knots — Arbor Knot" }],
  },
  {
    id: "dropper-loop",
    name: "Dropper Loop",
    aliases: ["Blood dropper loop"],
    category: "specialty",
    bestFor: ["loop-connection"],
    goodFor:
      "Builds a standing loop part-way along a line so a hook or weight can hang off-axis from the main run. The loop projects sideways rather than lying along the load path.",
    notIdealFor: ["Terminal strength jobs", "Braid, which will not hold the twist column"],
    lineMaterials: ["mono", "fluoro"],
    strengthRetentionTypical:
      "Mid-line drop. Typical cited 70–85% of the main at the drop; the job is a standing loop, not peak retention.",
    difficulty: "intermediate",
    materialsNeeded: ["Section of standing line, both ends free to twist"],
    howToSummary:
      "Form a loop mid-line, twist it several times, open the centre twist, push the loop through, and seat by pulling both standing ends apart.",
    steps: [
      {
        order: 1,
        instruction: "Form a loop mid-line, leaving both standing ends free.",
      },
      {
        order: 2,
        instruction: "Twist the loop 6–8 full turns so a symmetrical twist column forms either side.",
        tip: "Even turn counts on both sides — an off-centre column pulls the finished loop crooked.",
        failureLinks: ["dropper-loop-crossover"],
      },
      {
        order: 3,
        instruction: "Open the twists at the centre of the column and push the loop through that opening.",
        commonError: "Opening the wrong gap — the loop must pass through the exact centre.",
      },
      {
        order: 4,
        instruction: "Hold the loop, moisten, and pull both standing ends steadily apart until the twists roll up tight against the loop base.",
        tip: "Pull slowly: this knot seats by rolling, not by snapping.",
        failureLinks: ["dropper-loop-slip"],
      },
    ],
    commonMistakes: [
      "Too few twists",
      "Loop pushed through an off-centre gap",
      "Seating with a hard snatch instead of a steady pull",
    ],
    diagnostics: [
      {
        id: "dropper-lies-flat",
        symptom: "Loop lies along the main line instead of standing out",
        likelyCauses: ["Off-centre pass-through", "Uneven twist counts"],
        checks: ["Count twists either side of the loop base"],
        fixes: ["Retie with symmetrical twists and a centred pass-through"],
        severity: "watch",
        confidence: "moderate",
        retieDecision: "retie-recommended",
        stepLink: 3,
      },
    ],
    resources: [
      {
        type: "article",
        title: "Dropper Loop",
        url: "https://www.animatedknots.com/dropper-loop-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["surgeons-loop", "perfection-loop"],
    tags: ["rig", "dropper", "bait"],
    reviewedOn: "2026-08-10",
    sources: [{ title: "Animated Knots — Dropper Loop" }],
  },
  {
    id: "san-diego-jam",
    name: "San Diego Jam",
    aliases: ["Reverse clinch", "Heavy jam knot"],
    category: "terminal",
    bestFor: ["hook-to-line", "high-strength"],
    goodFor:
      "Terminal knot for jigs and heavy lures where the eye will not accept a doubled pass. Wraps run back up the doubled standing section, so bulk stays low for the line class.",
    notIdealFor: ["Very light tippet work", "Situations needing a free-swinging loop"],
    lineMaterials: ["mono", "fluoro", "braid"],
    strengthRetentionTypical:
      "Widely reported as high-retention on fluoro when seated wet — test your own system",
    difficulty: "intermediate",
    materialsNeeded: ["Line", "Lure or hook with a standard eye"],
    toolsHelpful: ["Line cutters"],
    howToSummary:
      "Pass the tag through the eye, fold it back alongside the standing line, wrap the tag up the doubled section, then pass it back down through the loop at the eye and out through its own final loop before seating wet.",
    steps: [
      {
        order: 1,
        instruction: "Pass roughly 10 in (25 cm) of tag through the lure eye and fold it back parallel to the standing line.",
        tip: "A single pass — this is the knot to reach for when a doubled line will not fit the eye.",
      },
      {
        order: 2,
        instruction: "Hold the fold and wrap the tag up and away from the lure, 6–7 turns around the doubled section.",
        tip: "Wrap away from the eye, not toward it. Keep the turns touching and parallel.",
        commonError: "Wrapping toward the eye buries the tag and the knot will not close.",
        failureLinks: ["san-diego-jam-crossover"],
      },
      {
        order: 3,
        instruction: "Pass the tag back down through the small loop sitting just above the lure eye.",
        failureLinks: ["san-diego-jam-tag"],
      },
      {
        order: 4,
        instruction: "Pass the tag out through the larger loop your last move created.",
      },
      {
        order: 5,
        instruction: "Moisten, then pull the standing line steadily so the wraps roll down and stack tight against the eye. Trim.",
        tip: "Pull on the standing line, not the tag — the tag only tidies the stack.",
        failureLinks: ["san-diego-jam-loose", "san-diego-jam-gap"],
      },
    ],
    commonMistakes: [
      "Wrapping in the wrong direction",
      "Seating dry on fluoro",
      "Missing the second loop pass, which leaves a plain jam that slips",
    ],
    diagnostics: [
      {
        id: "sdj-slips",
        symptom: "Knot slips off under a hard pull, leaving a curly tag",
        likelyCauses: ["Final loop pass missed", "Seated dry"],
        checks: ["Confirm the tag exits the second loop, not just the first"],
        fixes: ["Retie with both loop passes, seat wet and slow"],
        severity: "stop",
        confidence: "high",
        retieDecision: "retie-now",
        stepLink: 4,
      },
      {
        id: "sdj-bulk",
        symptom: "Knot body sits proud and rattles at the eye",
        likelyCauses: ["Too many wraps for the line class", "Incomplete roll-down"],
        checks: ["Count wraps: 6–7 on light line, 5 on heavy"],
        fixes: ["Drop a wrap and seat harder on the standing line"],
        severity: "watch",
        confidence: "moderate",
        retieDecision: "watch",
        stepLink: 5,
      },
    ],
    resources: [
      {
        type: "video",
        title: "San Diego Jam Knot",
        url: "https://www.animatedknots.com/san-diego-jam-knot",
        source: "Animated Knots by Grog",
        vetted: true,
      },
    ],
    relatedKnots: ["palomar", "uni-knot", "improved-clinch"],
    tags: ["jig", "heavy-lure", "single-pass"],
    reviewedOn: "2026-08-10",
    sources: [{ title: "Animated Knots — San Diego Jam" }],
  },
];