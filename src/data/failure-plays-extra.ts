/**
 * Additional symptom plays — researched field forensics.
 * Each record meets the same teaching bar: 3+ questions, 4+ causes,
 * 4+ checks, 4+ fixes, cited source notes. No invented ratings.
 */
import type { FailurePlay } from "@/data/failure-playbook";

export const EXTRA_FAILURE_PLAYS: FailurePlay[] = [
  {
    id: "pigtail-left",
    domain: "fishing",
    group: "forensic",
    title: "The end is curly / pigtailed",
    plain: "You recovered a corkscrew or pig-tail stub. The hardware is often empty.",
    meaning:
      "A curly end is the standing field sign of a slip, not a clean break. Northland and Salt Strong both treat the pigtail as walk-off evidence — the knot unravelled or melted while sliding.",
    questions: [
      "Is the hardware empty, or is a knot remnant still on the eye?",
      "Is the curl tight like a spring, or glazed like a melt?",
      "Was this braid, fluoro, or a dry cinch in a hurry?",
    ],
    likelyCauses: [
      "The knot slipped completely — tag walked through the wraps",
      "Too few wraps on slick braid",
      "Dry fluoro or mono cinch heated and then slipped (glazed curl)",
      "Finish never locked; the tag was already short",
      "Wrong family for the material (clinch-class on braid is the usual story)",
    ],
    checks: [
      "Look at the stub under good light — springy curl vs melted question-mark",
      "Confirm the hook or lure is bare",
      "Count what wrap range that family actually needs on this material",
      "Feel the last 12 inches for glaze or thinning above where the knot was",
    ],
    fixes: [
      "Cut it off. A slipped knot is not a knot you cinch again",
      "Retie a braid-capable family, or add the wraps and lock that family requires",
      "Wet fluoro/mono before the seat; one slow pull, not a saw",
      "Leave enough tag to lock, then trim after the test pull",
    ],
    retieWhen: "Always. A pigtail means the last connection already let go.",
    decideHint: "Re-rank for this material. Slip-prone families should fail closed on braid.",
    breakLocations: ["at-tag", "in-knot", "at-eye"],
    sources: [
      {
        title: "Northland — pig’s tail / corkscrew",
        note: "Telltale of total slip; hardware empty.",
      },
      {
        title: "Salt Strong — curly tag end",
        note: "Bad knot or poorly tied good knot; not a clean break.",
      },
    ],
  },
  {
    id: "clean-sever",
    domain: "fishing",
    group: "forensic",
    title: "The end is a clean cut",
    plain: "The recovered end is a sharp diagonal or square cut — not curly, not fuzzy.",
    meaning:
      "A clean sever is usually a nick, a guide, teeth, or a sharp eye — not a knot that slipped. Blaming the family first is how you retie the same failure.",
    questions: [
      "Did it part at a guide, at the eye, or in open leader?",
      "Is there a burr on the hardware or a cracked ceramic?",
      "Were you around teeth, oysters, or a toothy species?",
    ],
    likelyCauses: [
      "Nicked line from a rock, trap, or prior fish — failure above a sound knot",
      "Cracked or grooved rod guide cutting on the cast or the run",
      "Sharp or corroded hook eye slicing at the hardware",
      "Teeth or gill plate cutting the leader body",
      "Line crushed in a hatch or clip, then popped under load",
    ],
    checks: [
      "Run a cotton ball or fingertip down every guide — it catches on a crack",
      "Fingernail the hook eye and any split ring",
      "Compare the cut angle to a nick you can still see on the standing line",
      "Ask whether the knot is still sitting on the hardware (then the knot held)",
    ],
    fixes: [
      "Do not change knot family until you have ruled out guides and hardware",
      "Cut back past any nick and retie on fresh line",
      "Replace a cracked guide or burred eye before the next cast",
      "If teeth are the job, the leader material is the decision — not a tighter clinch",
    ],
    retieWhen:
      "Retie on undamaged line after the cutting surface is found. The old stub teaches nothing if you ignore the nick.",
    decideHint:
      "If the knot is still on the hook, Decide is optional — the line or hardware failed.",
    breakLocations: ["above-knot", "at-guides", "at-eye", "in-leader", "unknown"],
    sources: [
      {
        title: "Common field forensics",
        note: "Clean cut ≠ slip. Frayed = abrasion. Curly = slip.",
      },
      {
        title: "Guide-crack practice",
        note: "A cotton-ball test on the stripper is older than any app.",
      },
    ],
  },
  {
    id: "frayed-through",
    domain: "fishing",
    group: "forensic",
    title: "Line went fuzzy, then parted",
    plain: "Braid or coating looked hairy, then let go. Not a clean cut and not a pigtail.",
    meaning:
      "Fuzzy failure is abrasion. The connection may be innocent. Guides, structure, and teeth-adjacent scrape are the first suspects.",
    questions: [
      "Is the fuzz on braid, or is fluoro/mono scuffed dull?",
      "Did it tick the guides or the structure on the last casts?",
      "How far above the knot is the damaged section?",
    ],
    likelyCauses: [
      "Guide abrasion or a chipped insert",
      "Structure, oyster, or sand wearing the line on the retrieve",
      "Braid sawing on a swivel or a rough eye",
      "Old wind-knot or crush that then fuzzed and parted",
    ],
    checks: [
      "Inspect the last several feet, not just the stub",
      "Cotton-ball the guides",
      "Look at the swivel and eye for a groove",
      "Confirm whether the knot itself is intact below the fuzz",
    ],
    fixes: [
      "Cut back into clean line — do not retie in the fuzz",
      "Fix or retire damaged guides",
      "Add abrasion-resistant leader if the venue punishes braid",
      "Only then re-decide the connection family",
    ],
    retieWhen: "After you are on undamaged line. Retieing into fuzz repeats the break.",
    decideHint: "Abrasion is a leader/material decision as much as a knot decision.",
    breakLocations: ["above-knot", "at-guides", "in-leader", "at-eye"],
    sources: [
      {
        title: "Common braid abrasion practice",
        note: "Hairy braid is wear. It is not a wrap-count problem until the knot itself is fuzzy.",
      },
    ],
  },
  {
    id: "bitten-off",
    domain: "fishing",
    group: "forensic",
    title: "Bitten clean through the leader",
    plain:
      "A toothy fish or gill plate cut the leader. The knot may still be perfect on what is left.",
    meaning:
      "This is a material-system failure, not a knot-family failure. More wraps will not out-tie teeth.",
    questions: [
      "Is the cut in the leader body, well above the knot?",
      "What species were you targeting?",
      "Was there a wire or heavy shock section in the system?",
    ],
    likelyCauses: [
      "Teeth or gill rakers cutting fluoro/mono",
      "No bite protection on a toothy venue",
      "Shock tippet too light or too short",
      "Fish reached past a short leader to the lighter main",
    ],
    checks: [
      "Confirm the knot remnant is still seated if you recovered hardware",
      "Measure how far above the eye the cut sits",
      "Inspect for multiple nicks along the leader — teeth leave a trail",
      "Ask whether the venue’s prior says wire or heavy shock",
    ],
    fixes: [
      "Do not change the terminal family to ‘fix’ a bite-off",
      "Add or lengthen a bite / shock section the venue actually uses",
      "Re-decide materials — wire or heavy mono — not a tighter Palomar",
      "Retie the whole system on undamaged line",
    ],
    retieWhen: "Always rebuild the leader system. The old fluoro already lost.",
    decideHint: "Treat this as a material and leader-length job. The knot is downstream.",
    breakLocations: ["in-leader", "above-knot", "unknown"],
    sources: [
      {
        title: "Toothy-water field practice",
        note: "Bite-offs are material. Knot name is a distraction.",
      },
    ],
  },
  {
    id: "loop-collapsed",
    domain: "fishing",
    group: "geometry",
    title: "The loop cinched shut",
    plain: "A loop that was supposed to stay open became a noose against the eye.",
    meaning:
      "A collapsing loop is a failed non-slip structure — wrong return path, too few wraps, or the wrong family for a fixed loop job.",
    questions: [
      "Was this meant to be a free-swing lure loop or a standing leader loop?",
      "Did it collapse while seating, or later under load?",
      "Can you still see the return path?",
    ],
    likelyCauses: [
      "Return path was a slip-knot path, not the non-slip path",
      "Too few wraps on heavy leader",
      "Loop size set after the close — you cannot open it later",
      "Wrong family (fixed loop used where a non-slip was the job, or the reverse)",
    ],
    checks: [
      "Hang the lure — does it still swing, or is it pinned?",
      "Look for a noose tight on the eye",
      "Count wraps on the standing part",
      "Confirm the return went back through the correct opening",
    ],
    fixes: [
      "Cut it off. A collapsed loop does not reopen",
      "Retie the non-slip family if free swing is the job",
      "Set loop size before any load",
      "On heavy fluoro, add wraps and wet the seat",
    ],
    retieWhen: "Now. A noose is not a loop.",
    decideHint: "Mark free-swing if action is the product. A tight terminal is a different job.",
    breakLocations: ["at-loop", "at-eye", "in-knot"],
    sources: [
      {
        title: "Kreh / Rapala / Homer Rhode field notes",
        note: "Non-slip only if the return path completes. Collapse is a fail.",
      },
    ],
  },
  {
    id: "join-walked",
    domain: "fishing",
    group: "geometry",
    title: "The join walked or hinged",
    plain: "Barrels separated, a hinge formed, or one side pulled through the other.",
    meaning:
      "Line-to-line failures are barrels, diameter relation, and seat — not terminal folklore. A hinge is usually unequal capture or a family that cannot take the step-down.",
    questions: [
      "Did both barrels stay butted, or did a gap open?",
      "Which side pulled through — thin or thick?",
      "Was this a similar-diameter join forced onto a big step?",
    ],
    likelyCauses: [
      "Diameter mismatch without a mismatch-capable join",
      "Barrels never butted after the seat",
      "Too few wraps on the thinner leg",
      "Four-end seat that only loaded two ends (twist / hinge)",
      "Braid not locked on a slick leader",
    ],
    checks: [
      "Inspect both barrels and both tags",
      "See whether the thinner side still has its wraps",
      "Flex the join — a hinge point is a fail even if it has not parted",
      "Confirm materials and the diameter step you actually tied",
    ],
    fixes: [
      "Cut both sides back and retie",
      "Re-decide the join with the real diameter relation declared",
      "Do not reuse a similar-diameter technique on a big step",
      "For braid→leader, re-rank FG / Alberto / Double Uni by skill and guides",
    ],
    retieWhen: "Any walked or hinged join is done. Do not ‘snug it up’.",
    decideHint: "Declare the diameter step. Invalid joins should never score.",
    breakLocations: ["leader-join", "in-knot", "at-tag"],
    sources: [
      {
        title: "Common join practice",
        note: "Butted barrels, thinner-side wraps, mismatch family. Not a single magic number.",
      },
    ],
  },
  {
    id: "wind-tangle",
    domain: "fishing",
    group: "system",
    title: "Wind knot / tangle above the connection",
    plain:
      "A wind knot, backlash nest, or tip wrap formed above a connection that may still be sound.",
    meaning:
      "The connection is usually not the patient. A wind knot is a nick waiting to happen. Cut it out; do not fish a cinched overhand in the standing line.",
    questions: [
      "Is the tangle in the standing line, or did the join itself bird-nest?",
      "Did it cinch tight, or is it still an open overhand?",
      "Was this a cast tangle or a spool overrun?",
    ],
    likelyCauses: [
      "Casting overrun or wind catching slack braid",
      "Tip wrap on the last cast",
      "Loose coils coming off the spool",
      "A bulky join that tick-stopped in the guides and threw slack",
    ],
    checks: [
      "See whether the knot/join below the tangle is still dressed",
      "Try to open the wind knot — a cinched one has already scored the line",
      "Check guides for the tick that threw the slack",
      "Feel the line through the tangle for a flat or frayed spot",
    ],
    fixes: [
      "Cut out a cinched wind knot. Do not lubricate and hope",
      "Retie the connection only after you are on undamaged line",
      "If bulk in the guides started it, rebuild a slimmer join",
      "Slow the next cast until the line is sound",
    ],
    retieWhen: "If the overhand cinched, the line at that spot is compromised. Cut back.",
    decideHint: "Only re-decide the join if guide bulk caused the tangle.",
    breakLocations: ["above-knot", "at-guides", "unknown"],
    sources: [
      {
        title: "Common wind-knot practice",
        note: "A cinched overhand in standing line is damage. It is not a connection family.",
      },
    ],
  },
  {
    id: "coating-peeled",
    domain: "fishing",
    group: "geometry",
    title: "Fly-line coating peeled at the join",
    plain: "The coating stripped or mushroomed at a nail, needle, or welded-loop join.",
    meaning:
      "Fly-line joins fail at the coating and the core, not like tippet knots. A peeled coating is a dead tip — cut back and rebuild.",
    questions: [
      "Is the core still intact, or did you nick it with the needle?",
      "Did the coil slide off the coating?",
      "Is this a factory loop that crushed, or a field nail/needle?",
    ],
    likelyCauses: [
      "Coil never transferred onto the coating",
      "Needle nicked the core",
      "Dry seat glazed or stripped the coating",
      "Factory loop crushed into a girth on the handshake",
    ],
    checks: [
      "Look at the coating immediately behind the coil",
      "Flex the tip — a nicked core hinges",
      "Confirm the coil is on the line, not still on the tube",
      "Inspect the factory loop for crushed coating",
    ],
    fixes: [
      "Cut back to sound coating and a sound core",
      "Rebuild the join — do not tape a peeled tip",
      "If you nicked the core, go further back than feels comfortable",
      "Re-decide nail vs loop-to-loop only after the tip is sound",
    ],
    retieWhen: "A peeled or nicked tip is retired. Now.",
    decideHint: "This is a fly-line-to-leader job. Tippet knots are the wrong family.",
    breakLocations: ["leader-join", "in-knot", "above-knot"],
    sources: [
      {
        title: "Nail / needle knot field practice",
        note: "Coating and core are the patient. The wraps only work on an intact tip.",
      },
    ],
  },
  {
    id: "arbor-slipped",
    domain: "fishing",
    group: "system",
    title: "Spool spun — arbor let go",
    plain: "The reel spool spun and the backing or arbor hitch did not bite.",
    meaning:
      "Arbor failures are orientation and grip on the spool, not terminal folklore. A spool that dumps line has no knot to inspect at the lure.",
    questions: [
      "Did the backing slip on the arbor, or did the backing-to-line join fail?",
      "Was the hitch oriented the right way for spool rotation?",
      "Is there still a tag and a stopper on the arbor?",
    ],
    likelyCauses: [
      "Arbor hitch / uni on the spool facing the wrong way",
      "Slick arbor, no tape or too few wraps",
      "Backing-to-line join walked under the first long run",
      "No stopper; the hitch walked off the spool lip",
    ],
    checks: [
      "Look at the arbor — is anything still on it?",
      "Confirm hitch direction vs retrieve",
      "Inspect the backing-to-line join if that is what parted",
      "Check whether the spool was overfilled and walked the hitch",
    ],
    fixes: [
      "Re-make the arbor tie in the correct direction",
      "Add a tape wrap or extra turns on a slick arbor",
      "If the backing-to-line join failed, treat that as a join diagnosis",
      "Do not fish until the spool is made up again",
    ],
    retieWhen: "Before the next cast. A free-spinning spool is not a tackle problem you ignore.",
    decideHint: "This is a line-to-spool job. Terminal ranking will not help.",
    breakLocations: ["at-arbor", "leader-join", "unknown"],
    sources: [
      {
        title: "Common arbor-knot practice",
        note: "Direction and bite on the spool. Not a Palomar conversation.",
      },
    ],
  },
  {
    id: "hardware-opened",
    domain: "fishing",
    group: "system",
    title: "Hardware opened — knot still there",
    plain:
      "The hook eye, split ring, or swivel opened. The knot is sitting on what is left, intact.",
    meaning:
      "The connection held. The hardware did not. Changing knot family will not close an opened eye.",
    questions: [
      "Is the knot still dressed on the remaining wire?",
      "Did the eye open, or did a split ring spread?",
      "Was this light wire on a heavy fish or a snag?",
    ],
    likelyCauses: [
      "Hook eye or wire too light for the load",
      "Split ring spread under side load",
      "Swivel gate or split opened",
      "Fatigue from a previous straightened fight",
    ],
    checks: [
      "Confirm the knot has not slipped — it should still be butted",
      "Inspect the opened eye for a sharp burr that will cut the next tie",
      "Check the rest of the hooks on the lure",
      "Ask whether the previous fish already bent this wire",
    ],
    fixes: [
      "Replace the hardware. Do not reuse an opened eye",
      "Retie onto sound hardware",
      "Do not ‘improve’ the knot as the fix",
      "If the venue keeps opening light wire, the tackle is underspec — not the knot",
    ],
    retieWhen: "After the hardware is replaced. The old eye is scrap.",
    decideHint: "Skip Decide unless you also need a new connection family for new hardware.",
    breakLocations: ["at-eye", "unknown"],
    sources: [
      {
        title: "Hardware vs knot forensics",
        note: "Knot still on an opened eye is a tackle failure.",
      },
    ],
  },
  {
    id: "girth-cinched",
    domain: "fishing",
    group: "geometry",
    title: "Loop-to-loop cinched into a girth",
    plain: "The handshake collapsed. One loop strangled the other.",
    meaning:
      "A loop-to-loop is an assembly. A girth hitch cinches one loop and cuts the other. That is a failed handshake, not a tight connection.",
    questions: [
      "Do you still see matching U-shapes, or has one loop cinched?",
      "Which loop cinched — fly line or leader?",
      "Was a factory loop already crushed before you assembled?",
    ],
    likelyCauses: [
      "Wrong first pass — leader not taken all the way through its own loop",
      "One loop much stiffer, forcing a girth",
      "Factory loop already damaged",
      "Yanked tight instead of dressed into matching U-shapes",
    ],
    checks: [
      "Look for matching U-shapes. Anything else is a fail",
      "See whether the fly-line coating is crushed",
      "Confirm both loops were sound before assembly",
      "Flex — a cinched loop hinges and cuts",
    ],
    fixes: [
      "Undo if you still can. If coating is crushed, cut and rebuild",
      "Reassemble: leader through fly-line loop, then the whole leader through its own loop",
      "Dress into matching U-shapes, then load",
      "Replace a damaged factory loop rather than ‘making it good’",
    ],
    retieWhen: "A girth-cinched factory loop is retired. Do not fish crushed coating.",
    decideHint: "This is loop-to-loop. Nail/needle is the other family if the loop is gone.",
    breakLocations: ["at-loop", "leader-join"],
    sources: [
      {
        title: "Loop-to-loop handshake practice",
        note: "Matching U-shapes only. A girth hitch is a fail.",
      },
    ],
  },
  {
    id: "shank-walked",
    domain: "fishing",
    group: "geometry",
    title: "The snell walked the shank",
    plain: "Wraps slid, opened, or finished mid-shank. The hook now pulls off-axis.",
    meaning:
      "A snell only works as on-axis pull from even shank wraps finished at the eye. Mid-shank or stacked wraps rotate the hook.",
    questions: [
      "Are the wraps still side-by-side to the eye?",
      "Did the finish hitch let go?",
      "Is this a shank hook, or did you force a snell on a ring-eye-only?",
    ],
    likelyCauses: [
      "Wraps stacked instead of laid",
      "Finish hitch never locked",
      "Barrel or column seated mid-shank",
      "No shank — ring-eye-only hardware",
    ],
    checks: [
      "Look at wrap spacing along the shank",
      "See where the column ends — eye or mid-span",
      "Pull lightly: does the hook stay in line with the standing line?",
      "Confirm the hook actually has a shank to wrap",
    ],
    fixes: [
      "Cut it off and re-snell with even wraps to the eye",
      "Lock the finish hitch before you fish it",
      "If there is no shank, change family — do not invent a snell",
      "Load the standing line, not the tag",
    ],
    retieWhen: "An off-axis or walked snell is done. Now.",
    decideHint: "This is a hook-snell job. Terminal-eye knots are the other family.",
    breakLocations: ["at-shank", "at-eye", "in-knot"],
    sources: [
      {
        title: "Common snell practice",
        note: "On-axis pull from even shank wraps. Mid-shank is a fail.",
      },
    ],
  },
  {
    id: "walked-off",
    domain: "boating",
    group: "rope",
    title: "The hitch walked off",
    plain: "A clove, cow, or similar hitch worked along the spar or piled off under cyclic load.",
    meaning:
      "Walking is the documented failure of an unattended clove and of hitches that never took a round turn. Tide and surge do this. More half-hitches on a walking clove do not make it a mooring plan.",
    questions: [
      "Was this left unattended under tide or chop?",
      "Did the turns stay stacked, or spread?",
      "Was there a round turn taking the load, or only a hitch?",
    ],
    likelyCauses: [
      "Clove hitch used as an overnight mooring",
      "Turns spread instead of stacked",
      "No round turn; the hitch carried surge it cannot carry",
      "Slick HMPE treated like polyester",
    ],
    checks: [
      "Look at whether the turns are still nested",
      "See how far the hitch has travelled along the spar",
      "Ask whether anyone was watching it",
      "Check fibre — HMPE walks faster",
    ],
    fixes: [
      "Do not add turns to a walking clove and walk away",
      "Rebuild with a round turn and two half hitches, or a make-fast that matches the job",
      "Stack and dress every turn before you leave it",
      "HMPE usually wants a splice, not another hitch",
    ],
    retieWhen: "A walked hitch is not holding. Remake the job now.",
    decideHint: "Temporary vs standing is the job. A clove is not an overnight plan.",
    breakLocations: ["in-knot", "at-tag", "unknown"],
    sources: [
      {
        title: "Animated Knots / seamanship notes — clove hitch",
        note: "Documented walk-off under cycling load.",
      },
    ],
  },
  {
    id: "capsized",
    domain: "boating",
    group: "rope",
    title: "The loop capsized",
    plain: "A bowline or similar eye rolled into a different, weaker structure under cyclic load.",
    meaning:
      "An undressed or un-backed bowline can capsize. The collar must sit. A cowboy or loose collar is the usual start of the roll.",
    questions: [
      "Was the collar tight against the standing part?",
      "Was the tail backed up on a serious job?",
      "Is this HMPE? (Wrong fibre for this knot.)",
    ],
    likelyCauses: [
      "Open collar, never dressed",
      "No backup on a cyclic or life-adjacent job",
      "Wrong loop direction (cowboy) that rolls easier",
      "HMPE slickness",
    ],
    checks: [
      "Collar tight? Tail long enough?",
      "Has the eye become a slip noose?",
      "Is there a backup hitch on the tail?",
      "Confirm fibre — polyester vs HMPE",
    ],
    fixes: [
      "Retie and dress the collar before any load",
      "Backup the tail on a serious job",
      "Do not use a bowline as an HMPE termination — splice",
      "If it already capsized under load, remake; do not ‘reset’ it",
    ],
    retieWhen: "A capsized eye is a different knot. Remake it.",
    decideHint: "Fixed eye vs hitch is the job. Backup is part of the decision.",
    breakLocations: ["at-loop", "in-knot"],
    sources: [
      {
        title: "Seamanship — bowline capsize",
        note: "Undressed / un-backed bowlines can capsize under cyclic load.",
      },
    ],
  },
  {
    id: "jammed-uncleatable",
    domain: "boating",
    group: "rope",
    title: "Jammed — cannot cast off",
    plain: "The cleat lock or hitch will not break by hand with load still on the line.",
    meaning:
      "A working cleat hitch must still cast off under load. A jammed lock is the wrong finish — usually a near-horn first turn or a pile of extra locks.",
    questions: [
      "Was the first turn on the far horn?",
      "Can you still break the lock by hand?",
      "How many extra figure-eights did you stack?",
    ],
    likelyCauses: [
      "First turn on the near horn",
      "Locking hitch that welded under surge",
      "Too many extra locks on a working cleat",
      "Wrong fibre jammed in the horns",
    ],
    checks: [
      "Try to break the lock by hand with load still on",
      "See whether the first turn is on the far horn",
      "Count the figure-eights — a pile is a jam waiting",
      "Ask whether this was meant to be a standing make-fast or a working dock line",
    ],
    fixes: [
      "Do not cut a loaded dock line unless life or the boat requires it",
      "Take load on another line, then remake the hitch",
      "Far horn first, one clean figure-eight, lock that still breaks",
      "A jammed hitch is remade, not ‘tightened’",
    ],
    retieWhen:
      "As soon as you can get the load off. A jammed working cleat is already the wrong job.",
    decideHint: "Rope-to-cleat. Release under load is the constraint.",
    breakLocations: ["at-cleat", "in-knot"],
    sources: [
      {
        title: "BoatUS / sailing-school cleat hitch",
        note: "Must still break by hand. Near-horn first turn is the usual jam.",
      },
    ],
  },
  {
    id: "chafe-at-fairlead",
    domain: "boating",
    group: "rope",
    title: "Chafed at a fairlead or chock",
    plain:
      "The line parted or is meaty at a chock, fairlead, or rail — the hitch down-line may still be sound.",
    meaning:
      "Chafe is a lead and protection problem. Re-tying the same hitch through the same sharp chock repeats the failure.",
    questions: [
      "Where is the meat — at the chock, or at the hitch?",
      "Was there chafe gear?",
      "Has the lead been working across a sharp edge on each surge?",
    ],
    likelyCauses: [
      "Unprotected lead across a sharp chock or rail",
      "Line working at the same spot on every surge",
      "Wrong fibre for the chafe (polypro meaty fast)",
      "Hitch blamed when the standing part was already thin",
    ],
    checks: [
      "Inspect the line at every fairlead, not just the hitch",
      "Look for a shiny or flattened spot — that is the saw",
      "Check whether the hitch itself is still dressed",
      "Ask how long this lead has been working unwatched",
    ],
    fixes: [
      "Cut out the meaty section. Do not trust thinned line",
      "Add chafe gear or change the lead",
      "Re-make the hitch only on sound line",
      "Change fibre if this lead always eats polypro",
    ],
    retieWhen: "After the line is sound and the lead is protected. Not before.",
    decideHint: "The hitch may be innocent. The lead is the decision.",
    breakLocations: ["at-fairlead", "above-knot", "unknown"],
    sources: [
      {
        title: "Seamanship — chafe at the chock",
        note: "Most dock-line failures are chafe, not the hitch.",
      },
    ],
  },
  {
    id: "unequal-slip",
    domain: "boating",
    group: "rope",
    title: "Unequal lines — the bend slipped",
    plain: "A sheet bend or similar let go when the two ropes were not a pair.",
    meaning:
      "A single sheet bend on unequal or slick lines is a known slip. The double sheet bend exists because the single one walks.",
    questions: [
      "How different were the diameters?",
      "Was the smaller line the one that pulled through?",
      "Was it a single or double sheet bend?",
    ],
    likelyCauses: [
      "Single sheet bend on unequal diameters",
      "Slick HMPE against polyester",
      "Bend never dressed; tails short",
      "Wrong job — this needed a different join or a splice",
    ],
    checks: [
      "Which tail pulled through?",
      "Were both tails long enough after the slip?",
      "Confirm it was actually a sheet bend, not a reef knot used as a bend",
      "Compare diameters honestly",
    ],
    fixes: [
      "Retie a double sheet bend, or pick a join built for unequal lines",
      "Do not use a reef knot as a bend",
      "HMPE wants a splice or a hitch designed for it",
      "Dress and leave tails you can still inspect",
    ],
    retieWhen: "A slipped bend is gone. Remake with the real diameter step declared.",
    decideHint: "Unequal-rope-join is the job. A single sheet bend should not win silently.",
    breakLocations: ["in-knot", "at-tag"],
    sources: [
      {
        title: "Animated Knots — sheet bend vs double",
        note: "Unequal lines are why the double exists.",
      },
    ],
  },
  {
    id: "stopper-pulled",
    domain: "boating",
    group: "rope",
    title: "The stopper pulled through",
    plain: "An end stopper came through a block, clutch, or hole it was meant to stay behind.",
    meaning:
      "A stopper that pulls through was too small, the wrong family for the hole, or never dressed. Figure-8, Ashley, and EStar are different sizes on purpose.",
    questions: [
      "What was it supposed to stop against?",
      "Did it roll and slim, or just pull through as-tied?",
      "Is this HMPE? (Many stoppers slim on HMPE.)",
    ],
    likelyCauses: [
      "Stopper too small for the hole or clutch",
      "Undressed stopper that rolled slim under load",
      "Wrong family for HMPE",
      "Figure-8 used where a bulkier stopper was the job",
    ],
    checks: [
      "Compare the recovered stopper to the hole it failed",
      "See whether it rolled into a slimmer shape",
      "Confirm fibre",
      "Ask whether anyone dressed it before loading",
    ],
    fixes: [
      "Retie a stopper that actually outsizes the hole",
      "Dress it fully before it sees load",
      "On HMPE, use a stopper family that holds bulk, or a splice",
      "Test-pull against the same hole before you trust it",
    ],
    retieWhen: "Now. A pulled stopper is not a stopper.",
    decideHint: "This is a stopper job. Bulk against the hole is the constraint.",
    breakLocations: ["in-knot", "at-tag"],
    sources: [
      {
        title: "Stopper-family practice (figure-8 / Ashley / EStar)",
        note: "Different bulk. HMPE slims some of them. Not a single figure.",
      },
    ],
  },
  {
    id: "self-cut",
    domain: "fishing",
    group: "forensic",
    title: "The knot cut the line",
    plain:
      "The end is scored or clean at the first hard turn. The structure held until the line cut itself.",
    meaning:
      "A good knot breaks before it unravels — usually at the first hard turn coming off the standing line (Salt Strong). A premature self-cut is different: crossed coils, a Palomar cinched over a sharp split ring, or braid sawing a leader it never locked. That is geometry, not a slip.",
    questions: [
      "Is the stub clean or glazed at a hard turn, or is it a curly pigtail?",
      "Did the doubled line pass a sharp split ring or a burred eye?",
      "Were coils crossed, or did braid wraps walk and saw the leader?",
    ],
    likelyCauses: [
      "Crossed wraps — line abrading on itself inside the knot (common on a rushed Palomar / fluoro)",
      "Doubled braid cinched over a sharp split ring or burred eye",
      "FG / Alberto wraps that never bit, then sawed the leader under load",
      "Dry fluoro seat that glazed at the first hard turn before the knot was finished",
      "Tag left long and sawing the standing part on each cast",
    ],
    checks: [
      "Compare the stub to a pigtail — curl is slip; a scored diagonal at a turn is a cut",
      "Fingernail the split ring and hook eye for a groove",
      "Look for an X in the coils — crossed line on a Palomar is the usual fluoro story",
      "On a join, see whether the braid still has a bite or has polished a groove in the leader",
    ],
    fixes: [
      "Cut back past the score. Do not reseat a knot that already cut the line",
      "If the ring is sharp, change hardware or stop doubling braid over it",
      "Wet fluoro and keep coils parallel — a crossed Palomar cuts itself",
      "On a join, lock the wraps before you load; a sawing FG is not an FG",
    ],
    retieWhen: "Always. A scored turn is already failed line.",
    decideHint:
      "If the ring or eye cut the doubled line, that is hardware + family. If coils crossed, that is a tie, not a ranking.",
    breakLocations: ["in-knot", "at-eye", "leader-join", "at-tag"],
    sources: [
      {
        title: "Salt Strong — first hard turn",
        note: "A good knot’s weak point is the first hard turn; a clean break there can mean the knot held.",
      },
      {
        title: "Wired2Fish — Palomar",
        note: "Crossed main and tag on fluoro abrades the line on itself.",
      },
    ],
  },
  {
    id: "tip-wrap",
    domain: "fishing",
    group: "system",
    title: "Line wrapped the rod tip",
    plain:
      "The line helicoptered the tip-top or last guide and cut or glued itself there. The terminal may still be dressed.",
    meaning:
      "A tip wrap is a cast and lead problem, not a knot-family failure. It is not a cracked-stripper cut and not a wind knot in the standing line. The tip-top is the patient.",
    questions: [
      "Is the cut or glaze at the tip-top, or further down the guides?",
      "Is the knot still on the hardware?",
      "Did the last cast dump a loop that flew around the tip?",
    ],
    likelyCauses: [
      "A loop came off the spool and wrapped the tip-top on the cast",
      "Soft tip, side wind, or a heavy lure pendulum",
      "Join bulk tick-stopped in the last guide and threw slack around the tip",
      "Tip-top insert already chipped — the wrap only finished the cut",
    ],
    checks: [
      "Look at the tip-top insert, not just the stripper",
      "See whether the terminal knot is still dressed — if it is, do not change family first",
      "Feel the last few feet for a flat or glaze from the wrap",
      "Ask whether a bulky join ticked just before the wrap",
    ],
    fixes: [
      "Cut back past the wrap score. The line at the tip is compromised",
      "Do not re-rank the terminal family until the tip-top is sound",
      "If bulk started the slack, rebuild a slimmer join",
      "Slow the next cast until the line is flying clean",
    ],
    retieWhen:
      "After you are on undamaged line and the tip-top is clear. The wrap already scored it.",
    decideHint:
      "Only re-decide the join if guide bulk threw the slack. The terminal family is usually innocent.",
    breakLocations: ["at-tiptop", "at-guides", "above-knot"],
    sources: [
      {
        title: "Common tip-wrap practice",
        note: "A helicoptered tip-top is a cast/lead fail. It is not a cracked-stripper and not a standing-line wind knot.",
      },
    ],
  },
  {
    id: "double-line-unravelled",
    domain: "fishing",
    group: "geometry",
    title: "The double line unravelled",
    plain:
      "A Bimini, spider hitch, or surgeon’s loop walked or opened. The double line is no longer a double line.",
    meaning:
      "Double-line loops fail on twist count, lock, and braid slickness — not on terminal folklore. Braid commonly needs more twists than mono before the lock will hold. An unravelled Bimini is not a leader-join problem yet.",
    questions: [
      "Did the twists walk out, or did the lock hitch let go?",
      "Was this braid? How many twists did you actually put in?",
      "Is the loop still a loop, or has it become two tags?",
    ],
    likelyCauses: [
      "Too few twists on braid — the column walked",
      "Lock hitch never seated; the end unzipped",
      "Surgeon’s loop used as a load-bearing double and pulled through",
      "Spider hitch that was never cinched into a solid bunch",
    ],
    checks: [
      "Count remaining twists against what that family needs on this fibre",
      "Inspect the lock — hitch still there, or gone?",
      "See whether the loop is still closed",
      "Confirm you are diagnosing the double-line, not the leader join beyond it",
    ],
    fixes: [
      "Cut it off. A walked double line does not restack under load",
      "Retie with the twist count this fibre actually needs, then lock it",
      "Do not treat a spider or surgeon as a Bimini substitute on a serious job",
      "Only then remake the leader join onto a sound double",
    ],
    retieWhen: "Now. An open double line is not a shock leader.",
    decideHint:
      "This is a line-to-loop / double-line job. Terminal ranking will not rebuild the double.",
    breakLocations: ["at-loop", "in-knot", "at-tag"],
    sources: [
      {
        title: "Salt Strong — Bimini on braid",
        note: "Braid commonly needs more twists (field notes cite 30+) so the column will not walk. Not a rating.",
      },
      {
        title: "Common double-line practice",
        note: "Lock the end. An unlocked Bimini unzips. A spider is a different, less serious family.",
      },
    ],
  },
  {
    id: "reef-spilled",
    domain: "boating",
    group: "rope",
    title: "The reef / square knot spilled",
    plain: "A reef or square knot used as a bend capsized into two half-hitches and let go.",
    meaning:
      "A reef knot is for reefing and binding — two ends of the same line around something. Used as a bend between two ropes it spills. That is a documented job error, not bad luck.",
    questions: [
      "Were you joining two ropes, or reefing / binding one line?",
      "Did it capsize into two half-hitches before it let go?",
      "Were the two lines even a pair — same diameter, same fibre?",
    ],
    likelyCauses: [
      "Reef / square knot used as a bend between two ropes",
      "Two different diameters — the thinner one spills first",
      "Granny knot (same-hand crossings) instead of a reef",
      "No backup; cyclic load finished the spill",
    ],
    checks: [
      "Look at the recovered structure — two half-hitches is a spilled reef",
      "Confirm the job: bind, or join two ropes?",
      "Compare diameters and fibres",
      "See whether it was a granny (both crossings the same way)",
    ],
    fixes: [
      "Do not retie a reef knot as a bend",
      "If the job is two ropes, use a bend — sheet bend / double, or a join built for the step",
      "If the job is reef or bind, retie a proper reef and finish it",
      "Leave tails you can still inspect",
    ],
    retieWhen: "A spilled reef is gone. Remake the actual job — bind or bend, not both.",
    decideHint:
      "Reef / bind is the job. A bend is a different connection. Invalid options should not score.",
    breakLocations: ["in-knot", "at-tag"],
    sources: [
      {
        title: "Seamanship — reef knot is not a bend",
        note: "A reef knot spills when used to join two ropes. Sheet bend is the join family.",
      },
      {
        title: "Animated Knots — reef / square",
        note: "Binding knot. Capsize under unequal or cyclic load is the documented fail.",
      },
    ],
  },
  {
    id: "grip-slipped",
    domain: "boating",
    group: "rope",
    title: "The gripping hitch slid",
    plain: "A rolling hitch or similar slide-and-grip walked along the spar, rode, or loaded line.",
    meaning:
      "Slide-and-grip hitches fail on fibre and on the ugly extra turn. Practical Sailor and Animated Knots both warn that a rolling hitch often slips on modern slick line — Dyneema, Spectra, polypro. More pretty turns do not fix that.",
    questions: [
      "What fibre was the hitch on — polyester, nylon, or HMPE?",
      "Did the turns cross the ugly way, or lie neat and pretty?",
      "Was this a snubber, a load transfer, or a stopper on a loaded sheet?",
    ],
    likelyCauses: [
      "Rolling hitch on HMPE / slick modern braid — documented non-hold",
      "Pretty textbook turns that do not grip; the ugly crossed turn is the one that bites",
      "Too few turns on a stiff or large-diameter rode",
      "Wrong job — this needed an icicle hitch, a splice, or a chain hook",
    ],
    checks: [
      "How far did the hitch travel along the standing part?",
      "Confirm fibre — Animated Knots warns Spectra / Dyneema / polypro",
      "Look at the turn stack: neat clove-like, or the extra crossed turn?",
      "Ask whether anyone load-tested it before leaving it",
    ],
    fixes: [
      "Do not add pretty turns to a hitch that already slid on HMPE",
      "On polyester or nylon, remake the ugly rolling hitch and test-pull",
      "On HMPE, change family — icicle hitch, or a splice / hardware grab",
      "A snubber that slides is not a snubber. Remake or replace the job",
    ],
    retieWhen: "A hitch that has slid is not holding. Remake or change family now.",
    decideHint:
      "This is a load-transfer / snubber job. Fibre matters more than another rolling hitch.",
    breakLocations: ["in-knot", "unknown"],
    sources: [
      {
        title: "Animated Knots — Rolling Hitch",
        note: "Will not hold at all in Spectra, Dyneema, or polypropylene.",
      },
      {
        title: "Practical Sailor — gripping hitches (2009)",
        note: "On modern slick line the rolling hitch often slips; icicle hitch tested better. Not a rating we invent.",
      },
    ],
  },
  {
    id: "riding-turn",
    domain: "boating",
    group: "system",
    title: "Riding turn / winch override",
    plain:
      "A sheet or halyard jammed on the winch. A later turn rode over an earlier one. The hitch down-line may be innocent.",
    meaning:
      "A riding turn is a lead and tailing problem, not a knot-family failure. You do not cut the loaded sheet to ‘fix the knot.’ Take the load off with a rolling hitch to another winch, then unwind.",
    questions: [
      "Is the jam on the winch drum, or at a cleat / clutch?",
      "Is the sheet still loaded?",
      "Did a turn ride over, or did the tail dump?",
    ],
    likelyCauses: [
      "Tail not kept parallel — a later turn climbed over an earlier one",
      "Winch overloaded or surging while the tail was slack",
      "Lead into the winch from the wrong angle",
      "Override blamed on the stopper or cleat when the drum is the patient",
    ],
    checks: [
      "Look at the drum — riding turn vs a clean stack",
      "Is the sheet still under load? Do not put hands in a loaded override",
      "Confirm the stopper / cleat down-line is still dressed",
      "Ask whether you have a second winch and a snubbing line",
    ],
    fixes: [
      "Do not cut a loaded sheet unless the boat or a person requires it",
      "Take the load with a rolling hitch (the ugly one) to another winch, then unwind",
      "Once slack, strip the override and restack",
      "Do not re-rank a bowline or stopper as the fix for a riding turn",
    ],
    retieWhen:
      "After the load is off and the drum is clear. The standing knot is usually not the patient.",
    decideHint:
      "This is handling, not a connection ranking. A gripping hitch is the tool — not a new sheet knot.",
    breakLocations: ["at-winch", "unknown"],
    sources: [
      {
        title: "Yachting Monthly — free a riding turn",
        note: "Take the load off with a rolling hitch to another winch, then unwind. Do not fight a loaded drum.",
      },
      {
        title: "Animated Knots — rolling hitch use",
        note: "Documented use is to take strain off a foul turn on a winch.",
      },
    ],
  },
  {
    id: "cleat-dumped",
    domain: "boating",
    group: "rope",
    title: "The cleat dumped the line",
    plain: "The line walked off the horns. There was no lock, or the lock never took.",
    meaning:
      "The opposite of a jammed cleat. A working cleat hitch needs a lock that still breaks by hand. No lock — or a lock that never seated — dumps under surge. Piling extra figure-eights without a lock is not a finish.",
    questions: [
      "Was there a locking hitch on a horn, or only figure-eights?",
      "Did the first turn take the far horn?",
      "Did it dump on a surge, or slip slowly?",
    ],
    likelyCauses: [
      "No locking hitch — figure-eights only",
      "Lock dressed backwards and walked off",
      "First turn on the near horn so nothing bit",
      "Line too stiff or too large for the cleat, never seated",
    ],
    checks: [
      "Anything still on the horns?",
      "Was a lock ever tied, or only crossed turns?",
      "Cleat size vs line diameter",
      "Ask whether this was left as a working line with no lock on purpose",
    ],
    fixes: [
      "Remake: far horn first, one clean figure-eight, a lock that still breaks",
      "Do not stack extra eights instead of a lock",
      "If the cleat is undersized, that is hardware — not another hitch",
      "A dumped working line is remade before the next surge",
    ],
    retieWhen: "Now. An empty cleat is not made fast.",
    decideHint:
      "Rope-to-cleat. A lock that still casts off is the constraint — not a jam, not a dump.",
    breakLocations: ["at-cleat", "at-tag"],
    sources: [
      {
        title: "BoatUS / sailing-school cleat hitch",
        note: "Far horn, figure-eight, lock that still breaks. No lock is a dump waiting.",
      },
    ],
  },
  {
    id: "shock-parted",
    domain: "boating",
    group: "load",
    title: "The line parted on shock, hitch still dressed",
    plain:
      "A dock, spring, or snubber parted in the standing part. The hitch or cleat lock is still sitting there.",
    meaning:
      "Shock load is stretch, length, and fibre — not the hitch. A too-short nylon spring, or polyester used where nylon should soak the surge, parts in the standing part. Re-tying the same hitch on the same short lead repeats the snap.",
    questions: [
      "Is the hitch still dressed? Then start with the standing part, not the knot name",
      "How long was the lead relative to the surge?",
      "Nylon (stretch) or polyester / HMPE (little stretch)?",
    ],
    likelyCauses: [
      "Spring or dock line too short for the surge — no stretch left",
      "Low-stretch fibre (polyester, HMPE) used as a shock absorber",
      "Nylon that was already old, stiff, or UV-burnt",
      "Hitch blamed when the standing part took a snap the fibre cannot take",
    ],
    checks: [
      "Confirm the hitch is still dressed — if it is, do not change family first",
      "Measure the remaining lead. A short spring snaps",
      "Feel the fibre — crispy nylon is retired, not re-tied",
      "Look for a meaty spot at the chock; shock plus chafe is a pair",
    ],
    fixes: [
      "Replace the parted section. Do not fish a snapped dock line",
      "Lengthen the spring or add a snubber that can stretch",
      "Match fibre to the job — nylon soaks surge; polyester holds a taut lead",
      "Only remake the hitch on sound line after the lead is sane",
    ],
    retieWhen:
      "After the line is sound and the lead can stretch. The old standing part already lost.",
    decideHint: "The hitch may be innocent. Length and fibre are the decision.",
    breakLocations: ["above-knot", "at-fairlead", "unknown"],
    sources: [
      {
        title: "Seamanship — dock-line shock",
        note: "Short springs and low-stretch fibre snap in the standing part. The hitch is often still dressed.",
      },
    ],
  },
];
