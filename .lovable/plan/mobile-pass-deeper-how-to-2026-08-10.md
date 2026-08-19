# Mobile pass + deeper how-to

## 1. Mobile: current state

I rendered every mode at 390px wide. Nothing overflows — Decide, Diagnose, Data and the Tie player all reflow to one column and stay inside the viewport. So the transition is compatible today. What's missing is phone ergonomics, not layout repair:

- Step player controls sit at the bottom of a long scroll; on a phone you scroll past the diagram to reach Next.
- No swipe. On the water you want thumb gestures, not small buttons.
- Tap targets on the step dots and Prev/Next are below a comfortable 44px.
- The Dimension Matrix and long chip rows are readable but cramped; they need edge-to-edge scroll with a fade hint instead of squeezing.
- Header nav labels stay full-length at 390px, crowding the theme toggle.

### Fixes

- Sticky step bar on small screens: step counter, Prev/Next and progress dots pinned to the bottom of the viewport while the player is on screen.
- Horizontal swipe on the diagram area to advance/reverse steps (keyboard arrows stay).
- Enlarge dots and buttons to 44px hit areas without changing their visual size.
- Wrap the matrix and any wide chip rail in a scroll container with masked edges.
- Collapse nav to numerals under `sm`, keeping full labels on desktop.
- Taller diagram aspect on phones so schematic detail stays legible.

## 2. More how-to

Depth added per knot, held in data so the Data editor can author it later:

- **Before you start** — line, hardware, tag length to pull, and the one thing that ruins this knot before step one.
- **Per-step detail** — each step gains an optional longer "why" paragraph plus a "you should now see" observable check, so a step isn't done until the structure matches.
- **Seating sequence** — a dedicated moisten → load → dress → set → trim block with the tension direction for each phase. This is where most failures are born and the step list currently compresses it.
- **Verify before you fish** — a short pass/fail checklist built from the knot's existing fingerprint, with a direct handoff into Diagnose if any item fails.
- **Field notes** — retie difficulty in dark or cold, gloves, and what to do when it comes out wrong twice.
- Fill out the thinnest procedures (surgeon's loop at 3 steps; the 4-step FG, Albright, surgeon's, Bimini, clinch, uni, trilene, snell, rapala, arbor, dropper) so each reads as an executable procedure rather than a summary.
- Diagram gains a per-step focus: the active element is emphasised and the drawing zooms to the region that step concerns, instead of holding the whole schematic at fixed scale.

## 3. Background auth / Cloud

Nothing above needs it. The overlay editor persists locally and the PDF is generated in the browser, so the instrument keeps working offline in the field — which suits the product.

I'd only enable Cloud if you want your authored scenarios, materials and procedures to follow you across devices (phone at the ramp, desktop at home). That's a separate step: a silent sign-in, the overlay store swapped from local storage to a synced adapter with local as the offline cache, and access rules so the data stays yours.

Say the word and I'll include it; otherwise I'll build 1 and 2 local-only.

## Technical notes

- `KnotStep` gains optional `detail` and `expectedResult`; `KnotContent` gains optional `beforeYouStart`, `seatingSequence`, `fieldNotes`. All optional, so existing data and engine contracts are untouched.
- New presentational components under `src/components/instrument/`: sticky mobile step bar, verify checklist, seating sequence block.
- `diagram.tsx` gains a per-kind step viewBox map for the zoom behaviour; full-structure rendering stays the default when no step is passed.
- Swipe via pointer events on the diagram wrapper — no new dependency.
- No changes to `chooser`, `ranking`, `constraints` or `diagnostics`.
