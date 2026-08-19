# Touch, search filters, adaptive Decide layout, more scenarios and materials

## 1. Adaptive Decide layout

Desktop keeps today's two-column instrument: sticky left column (Connection, Material system, Field conditions, Venue), results on the right. Nothing moves for mouse users.

Phone becomes a guided stepper. One decision per screen — Connection, then Material system, then Conditions and Venue — with:

- a persistent bottom bar showing the job so far ("Braid → leader · braid/fluoro") plus Back and Continue, and Run the model on the last step;
- a slim progress rail at the top with step names, tappable to jump back to anything already answered;
- horizontal swipe between steps, matching the tying step player's gesture;
- results replacing the stepper once the model runs, with an "Edit the job" bar to return.

Locked/dimmed panels disappear on phone — a step you cannot answer yet simply is not shown, which removes the current wall of greyed chips.

## 2. Touch-friendly interactions

- Swipe between Decide steps and between diagnosis panels, with an animated edge hint the first time.
- Long chip rows become edge-to-edge snap rails with fade masks instead of wrapping into tall blocks.
- Press feedback on every actionable surface (chips, scenario cards, result rows), scaled down for reduced-motion.
- Pull-to-nothing guard: sticky bars use safe-area insets so nothing sits under the home indicator.
- Results: collapsible sections with big tap headers, and the winning option pinned to the top with a sticky "Tie this" action.

## 3. Search filters

The Finder gains a filter row under the input:

- type filters (Scenarios · Knots · Symptoms) as toggles, with counts;
- knot-specific facets — category (terminal, line-to-line, loop, utility), material fit, difficulty;
- recent picks when the query is empty, alongside the current scenario suggestions.

Matching improves: alias and abbreviation aware ("fg", "double uni", "wind knot"), typo-tolerant on single-character slips, and matched text highlighted in the result rows. Filters are keyboard reachable and persist for the session.

## 4. Scenario starters

Expand from 12 to roughly 24 in the existing card grid, covering surf, jetty and rocks, kayak, offshore trolling, deep drop, ice, float tube, dock light, creek and bank, fly saltwater flats, fly trout dry, downrigger/wire, heavy jig, live bait, and bottom rigs. Each stays a real one-tap input set — connection, materials, diameter relation, conditions, retie tempo, proficiency — so it still runs the untouched engine.

Card grid gains a compact two-up phone layout with the tag and the connection line on one row for scanning.

## 5. Material system

Add presets: copolymer, hollow-core braid, fused/thermal, coated braid, knottable and single-strand wire, titanium leader, fly backing (dacron vs gel-spun), and tippet material.

Deepen the four axes and the advice they trigger:

- construction gains hollow, fused, kernmantle-style coated core, single strand and multi-strand wire;
- treatment gains coated, waxed, colour-loaded and abrasion-treated, each with a slip note where it matters;
- role gains shock leader, bite/wire trace, backing and tippet;
- termination advice widens — splice for hollow, crimp with sleeve for single-strand wire and heavy mono, haywire twist for solo wire, loop-to-loop for fly systems — surfaced in the results as a "this may not want a knot at all" note.

Fishing's six common buttons stay first; everything added sits behind the existing disclosure so the fast path stays the same length.

## Technical notes

- New `src/components/instrument/decide-stepper.tsx` holds the phone flow; it renders the same panel components the desktop column already uses, so no duplicated question logic.
- Breakpoint decided by a CSS-driven render (both trees exist, one hidden) or `useIsMobile` with an SSR-safe initial state, to avoid hydration flashes.
- Finder gains a `filters` state and a facet index built once with `useMemo`; scoring moves into a small helper with alias and edit-distance handling.
- New material categories extend `FISHING_MATERIAL_PRESETS` and the `Construction`/`Treatment`/`Role` unions in `src/domain/material.ts`; the ranking modifier table gains entries for each new construction so nothing scores on an unmodelled value.
- Scenarios append to `FIELD_SCENARIOS`; no schema change, so the Data editor keeps working.
- `chooser`, `constraints` and `diagnostics` are untouched; Fishing outcomes for existing inputs stay identical.
