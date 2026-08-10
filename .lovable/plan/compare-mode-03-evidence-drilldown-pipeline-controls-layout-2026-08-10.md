# Compare Mode 03 — Evidence Drilldown, Pipeline Controls, Layout Repair

## What you get

Each "what changed" row becomes an openable evidence record. Click a row and it expands into
the full audit of that single constraint: what it eliminated, which dimension scores moved and
by how much, and what the engine returned when the field was reverted. No new claims — only what
the engine already computed, exposed instead of summarized.

Alongside it, a pipeline strip makes the comparison run explicit and controllable: constraint
elimination, field-fit ranking, probe attribution, verdict — each stage reporting counts, timing
and status, with the ability to re-run, step through, or freeze a run.

## 1. Evidence drilldown

Every delta row gets a disclosure button (row itself is the trigger, 44px minimum, keyboard
operable, `aria-expanded` / `aria-controls`). Expanded, it shows four evidence blocks:

- **Constraint** — field name, side A value, side B value, and whether the change is hard
  (Layer 1 elimination) or soft (Layer 2 weighting).
- **Eliminated by this field** — knots removed on B but surviving on the reverted probe, each
  with the elimination reason the constraint engine recorded.
- **Score movement** — per-dimension deltas between the B run and the probe run for the shared
  top candidates, shown as signed points on labelled dimension bars. Zero-movement dimensions
  are collapsed under a "no movement" line rather than padding the table.
- **Probe result** — the recommendation and field fit the engine returned with only this field
  reverted, plus the plain statement of what that proves ("decisive", "moves the answer, not back
  to A", "absorbed").

A "Rank order" strip shows the top-4 ordering on B vs the probe so reordering below first place
is visible.

## 2. Interactive elements

- Expand/collapse all rows; deep-link an open row via a `row` search param so a drilldown is
  shareable.
- Hover/focus on a delta row cross-highlights the affected side's answer card.
- Inline "make this the answer" — apply the reverted value to side B in place, so the compare
  updates live from within the evidence.
- Swap A/B, copy B from A, and reset, all as explicit header actions.
- Copy evidence for one row as plain text for field notes.

## 3. Pipeline run controls

A run strip above the verdict with four stages: Eliminate, Rank, Probe, Attribute. Each shows
counts (survivors, ranked, probes executed) and per-stage duration measured on the actual run.
Controls: **Re-run**, **Step** (advance one stage at a time and reveal only completed output),
**Freeze** (pin the current run so edits do not recompute until unfrozen), and a run id +
timestamp for reference in the packet. Frozen state is visually unmistakable, not a subtle badge.

## 4. Layout, accessibility and flow repair

- Compare becomes three clear zones: **Setup** (two editors), **Run** (pipeline + verdict), and
  **Evidence** (answer cards + delta table). Editors collapse to a compact summary once a run
  exists, so the evidence has the page.
- Delta table becomes a real `role="table"` structure with header row; on phones each row stacks
  as a labelled record rather than a squeezed 4-column grid.
- Verdict text placed in a polite live region so screen readers hear the outcome after edits.
- Focus is moved to the newly expanded evidence panel; Escape collapses back to the row.
- Semantic tokens only; decisive/moves/absorbed carry a glyph and text, never colour alone.
- Print: expanded evidence prints linearly; controls are suppressed.

## Aesthetic

Editorial structure over dashboard chrome — a wide measured column, generous rules, mono
micro-labels, one accent for decisive evidence and a caution tone for partial movement.
Language stays mechanical: "reverting this field restores A", not "great news". No confidence
implied beyond what the engine reports.

## Technical notes

- `src/engine/compare.ts` — extend `ConstraintDelta` with the probe's `ChooseResult` reference,
  eliminated-set difference, per-dimension score deltas for shared candidates, top-4 order on
  both runs, and a hard/soft classification. Add stage timings and a run id to `ComparisonResult`.
  Attribution logic itself is unchanged — still probe-based, never inferred.
- `src/routes/compare.tsx` — split into `SideEditor`, `PipelineStrip`, `AnswerCard`, `DeltaTable`,
  `EvidencePanel`; add `row` search param; freeze/step state held locally.
- New `src/components/instrument/evidence.tsx` for the drilldown blocks and dimension delta bars.
- No engine scoring, catalog, or domain data changes; fail-closed behaviour untouched.
