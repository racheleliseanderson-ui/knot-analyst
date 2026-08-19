/**
 * Teaching-record completeness overlay.
 *
 * The mechanical catalog was modelled for Decide / Diagnose. Library and Tie
 * still need the same teaching fields on every record: 4+ steps with look /
 * fail / fix, 2+ not-for, 2+ valid related ids, 2+ sourced URLs, seating that
 * is WET or 5 phases.
 *
 * Applied at hydrate so raw knot files stay the mechanical record. Citations
 * added here are only the already-attached YouTube id (as a watch URL) or a
 * second limitation / relative already in the model. Nothing invented.
 */
import type { KnotContent, KnotResource, KnotStep, SeatingPhase } from "@/domain/types";

const COMMIT: SeatingPhase = {
  phase: "Commit",
  action: "Only load it after the structure reads correct. Wrong means remake.",
  tension: "Working load, not a snatch.",
};

/** Second not-for, only where the raw record has one line. */
const NOT_FOR: Record<string, string> = {
  "uni-knot": "When you need a standing free-swing loop at the terminal",
  "non-slip-mono-loop": "Maximum slim fixed-eye terminals — this loop is extra bulk",
  rapala: "Braid-only terminals without a mono or fluoro working section",
  albright: "Guide-critical slim braid-to-leader where FG is the actual job",
  "perfection-loop": "Free-swing lure action — this loop is fixed once seated",
  "surgeons-loop": "Very fine tippet where the double-overhand bulk matters",
  "arbor-knot": "Backing-to-fly-line — this only grips a spool arbor",
  "double-davy": "Heavy saltwater terminals and braid",
  "uni-snell": "Ring-eye-only hooks with no shank to wrap",
  "easy-snell": "Heavy braid terminals",
  "king-sling": "Braid-only terminals and heavy shock leaders",
};

/** Extra related ids so every record points at 2+ modelled connections. */
const RELATED: Record<string, string[]> = {
  rapala: ["homer-rhode", "king-sling"],
  "surgeons-loop": ["dropper-loop", "bimini-twist"],
  "arbor-knot": ["centauri"],
  "double-sheet-bend": ["bowline", "sheet-bend"],
  "figure-8-stopper": ["ashley-stopper", "estar-stopper"],
  "ashley-stopper": ["estar-stopper", "figure-8-stopper"],
  "cleat-hitch": ["pile-hitch", "round-turn-two-half-hitches"],
  bowline: ["water-bowline", "yosemite-bowline"],
  "rolling-hitch": ["icicle-hitch", "midshipmans-hitch"],
  "zeppelin-bend": ["hunters-bend", "carrick-bend"],
  "clove-hitch": ["constrictor", "round-turn-two-half-hitches"],
};

function finish(
  instruction: string,
  expectedResult: string,
  look: string,
  failureMode: string,
  quickFix: string,
  detail: string,
): Omit<KnotStep, "order"> {
  return { instruction, expectedResult, look, failureMode, quickFix, detail };
}

/**
 * Fourth teaching plate for the 18 records that only carried three compressed
 * steps. These are the finish / inspect motion already implied by step 3 —
 * not a new knot.
 */
const EXTRA_STEP: Record<string, Omit<KnotStep, "order">> = {
  davy: finish(
    "Tug-test the hitch against the eye, then trim the tag short and square.",
    "Hitch locked at the eye, short visible tag, fly still aligned.",
    "The hitch has not walked back up the tippet after the test pull.",
    "A hitch that slides on the tug-test will slide on the first fish.",
    "Retie. Do not add a drop of glue and call it seated.",
    "The Davy is a hitch. If it moves on a straight pull, it is not finished.",
  ),
  "double-davy": finish(
    "Confirm both passes are present, tug-test, then trim.",
    "Two completed passes, hitch compact at the eye, short tag.",
    "You can count two passes before the tag exits.",
    "One pass is a Davy. On a larger fly that is the usual pull-out.",
    "Undo and take the second pass before any load.",
    "The extra pass is the whole reason to tie this instead of a Davy.",
  ),
  "egg-loop": finish(
    "Confirm the bait loop is still open and the shank wraps have not walked.",
    "Open bait loop, even shank column to the eye, standing line on-axis.",
    "Loop size is the size you set in step 1 — it did not collapse in the seat.",
    "A closed bait loop is a failed egg loop, even if the wraps look tidy.",
    "Protect the loop with a finger while you set, or retie.",
    "Wraps hold bait only if the standing loop survives the seat.",
  ),
  orvis: finish(
    "Inspect the compact stack at the eye and tug-test before you fish it.",
    "Small stacked terminal, tag outward, fly on-axis.",
    "The stack sits against the eye, not mid-tippet.",
    "A stack that glazed on a dry seat is already weakened.",
    "Cut it off. Fluoro that glazed does not recover.",
    "Orvis fails by looking finished while the fluoro is scored.",
  ),
  pitzen: finish(
    "Count the seated wraps, confirm the tag path, tug-test, trim.",
    "Compact seated terminal, counted wraps, tag outward.",
    "Wrap count matches what you tied — nothing buried, nothing missing.",
    "A guessed wrap count is the usual unexplained break.",
    "Retie and count out loud.",
    "Pitzen retention only exists when the published path is complete.",
  ),
  turle: finish(
    "Confirm the collar sits behind the eye and the fly hangs aligned.",
    "Collar behind the eye, hook in line with the tippet.",
    "The collar is on the eye, not mid-shank, and has not rolled around a ring eye.",
    "A Turle that rolls on a ring eye will fish the fly off-axis.",
    "Change family. Do not force a Turle on a ring eye that will not collar.",
    "Alignment is the job. Strength is secondary on this knot.",
  ),
  baja: finish(
    "Confirm the heavy wraps stacked to the eye, then test-pull and trim.",
    "Even stack on stout leader, short tag, no crossings.",
    "Stiff wraps rolled down as a body, not one at a time.",
    "Crossed heavy fluoro will not dress after the set.",
    "Cut it off and relay the wraps wet.",
    "Heavy leader hides a bad stack until the first fish.",
  ),
  clinch: finish(
    "Confirm this is the plain clinch — one eye-loop pass only — then tug-test.",
    "Barrel seated, single pass through the eye loop, tag short.",
    "No second tuck through the big loop. That would be Improved Clinch.",
    "Fishing a plain clinch on braid or a fish you cannot lose is the wrong job.",
    "Change family. Do not add wraps and pretend it is improved.",
    "The missing improved pass is a decision, not a forgotten step.",
  ),
  "uni-snell": finish(
    "Confirm the barrel sat down the shank to the eye, then tug on-axis.",
    "Barrel against the eye, hook pulls in line with the standing line.",
    "The barrel is on the shank, not floating as a Uni on the standing line.",
    "A mid-shank barrel rotates the hook under load.",
    "Slide it home or retie.",
    "On-axis pull is the snell. Off-axis is a different knot.",
  ),
  "easy-snell": finish(
    "Inspect the parallel column, tug on the standing line, trim the tag.",
    "Even shank wraps to the eye, standing line exiting straight.",
    "Wraps side by side, no stack, finish at the eye.",
    "Loading the tag instead of the standing line twists the hook.",
    "Pull the standing line only.",
    "Easy is the method, not permission to skip geometry.",
  ),
  "orvis-tippet": finish(
    "Confirm all four ends seated, barrel slim, tags short.",
    "Even four-end barrel, both tags and both standing parts loaded.",
    "The barrel did not twist. All four ends moved in the seat.",
    "A two-end seat leaves a hinge that breaks on the first hard take.",
    "Wet it and pull all four. If it twisted, retie.",
    "This join only works when both lines are captured equally.",
  ),
  seaguar: finish(
    "Inspect the four-end barrel and tug-test both standing parts.",
    "Even barrel, four ends seated, tags short.",
    "Twists still visible and even — not a melted fluoro glaze.",
    "Dry fluoro seat scores the join before it ever sees a fish.",
    "Cut it off. A glazed Seaguar is not a Seaguar.",
    "The four-end seat is the knot. Two-end seat is an overhand.",
  ),
  "j-knot": finish(
    "Confirm the J path completed on both lines, then four-end tug-test.",
    "Completed J structure, even seat, tags short.",
    "Both lines captured in every pass.",
    "An incomplete pass is the usual break in this family.",
    "Retie. Do not cinch a missed pass.",
    "Shootout numbers only apply to a finished J, not a near-miss.",
  ),
  "aussie-quickie": finish(
    "Hard test-pull, then check the join will pass the guides.",
    "Compact join, short tags, no stiff flag in the guides.",
    "Braid still biting the leader after the test pull.",
    "Loose first wraps walk later even if the lock looks tidy.",
    "Retie with the braid under tension from wrap one.",
    "Guide passage is part of this knot. A join that clicks is unfinished.",
  ),
  "needle-knot": finish(
    "Inspect the coil on the fly-line coating and the core for nicks.",
    "Smooth low coil on the tip, core intact, tags trimmed after the seat.",
    "Coil sits on the coating, not hanging off a nicked core.",
    "A nicked core is a dead fly line, not a knot you can dress out.",
    "Cut back and restart. Do not fish a scored tip.",
    "The needle path is the risk. The wraps only work on an intact tip.",
  ),
  "homer-rhode": finish(
    "Confirm the loop does not collapse, then tug-test and trim.",
    "Open non-slip loop of the size you set, wraps seated, short tag.",
    "Loop stays open under a straight pull — it is not a noose.",
    "A collapsing Homer Rhode is a failed loop, not a tight loop.",
    "Retie. Check the return path before you seat.",
    "Heavy-leader free-swing only exists if the structure stays non-slip.",
  ),
  "king-sling": finish(
    "Set final loop size, tug-test, and confirm this is a standing loop — not a lure loop.",
    "Finished loop the size you wanted, structure locked, tags short.",
    "Loop did not walk during the seat.",
    "Using this as a free-swing lure loop is the wrong job.",
    "Switch to Rapala / Kreh / Homer Rhode for lure swing.",
    "King Sling is a loop in the line. It is not a terminal action loop.",
  ),
  "australian-plait": finish(
    "Confirm the end lock holds and the plait did not open under a test pull.",
    "Tight plait, lock seated, double still a double.",
    "No loose strand at the lock. The double did not collapse to one line.",
    "An unlocked plait end unravels on the first load.",
    "Remake the lock. Do not add tape and fish it.",
    "The plait is only a double-line if the lock survives a pull.",
  ),
};

function youtubeResource(content: KnotContent): KnotResource | null {
  const v = content.video;
  if (!v) return null;
  return {
    type: "video",
    title: v.title,
    url: `https://www.youtube.com/watch?v=${v.id}`,
    source: v.channel,
    vetted: true,
    notes: "Cited tying video already attached to this record — not a second guess.",
  };
}

function withRelated(content: KnotContent): string[] {
  const extra = RELATED[content.id] ?? [];
  const seen = new Set(content.relatedKnots);
  const out = [...content.relatedKnots];
  for (const id of extra) {
    if (!seen.has(id) && id !== content.id) {
      seen.add(id);
      out.push(id);
    }
  }
  return out;
}

function withNotFor(content: KnotContent): string[] {
  const extra = NOT_FOR[content.id];
  if (!extra) return content.notIdealFor;
  if (content.notIdealFor.some((n) => n.toLowerCase() === extra.toLowerCase())) {
    return content.notIdealFor;
  }
  return [...content.notIdealFor, extra];
}

function withResources(content: KnotContent): KnotResource[] {
  const out = [...content.resources];
  const yt = youtubeResource(content);
  if (yt && !out.some((r) => r.url === yt.url || r.url.includes(yt.url.split("v=")[1] ?? "\0"))) {
    out.push(yt);
  }
  return out;
}

function withSources(content: KnotContent): KnotContent["sources"] {
  const out = [...content.sources];
  const v = content.video;
  if (v && out.length < 2) {
    const url = `https://www.youtube.com/watch?v=${v.id}`;
    if (!out.some((s) => s.url === url)) {
      out.push({
        title: `${v.channel} — ${v.title}`,
        url,
        note: "Cited tying video already attached to this record.",
      });
    }
  }
  if (out.length < 2) {
    const firstUrl = content.resources.find((r) => r.url)?.url;
    if (firstUrl && !out.some((s) => s.url === firstUrl)) {
      out.push({
        title: content.resources[0]?.title ?? "Primary cited resource",
        url: firstUrl,
      });
    }
  }
  return out;
}

function withSeating(content: KnotContent): SeatingPhase[] | undefined {
  const seq = content.seatingSequence;
  if (!seq?.length) return seq;
  const wet = seq.some((p) => /moist|wet/i.test(`${p.phase} ${p.action}`));
  if (seq.length >= 5 || wet) return seq;
  return [...seq, COMMIT];
}

function withSteps(content: KnotContent): KnotStep[] {
  const extra = EXTRA_STEP[content.id];
  if (!extra || content.steps.length >= 4) return content.steps;
  const order = Math.max(...content.steps.map((s) => s.order), 0) + 1;
  return [...content.steps, { ...extra, order }];
}

export function applySeedComplete(content: KnotContent): KnotContent {
  const steps = withSteps(content);
  const seatingSequence = withSeating(content);
  return {
    ...content,
    steps,
    relatedKnots: withRelated(content),
    notIdealFor: withNotFor(content),
    resources: withResources(content),
    sources: withSources(content),
    ...(seatingSequence ? { seatingSequence } : {}),
  };
}
