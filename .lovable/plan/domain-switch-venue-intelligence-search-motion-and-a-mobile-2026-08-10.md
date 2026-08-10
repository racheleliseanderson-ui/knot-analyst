# Domain switch, venue intelligence, search, motion and a mobile a11y pass

## 1. Fishing ↔ Boating & Sailing switch (persistent)

A segmented control in the header, left of the appearance toggle: `FISHING · BOATING`. On phones it collapses to two short glyph+label pills, still 44px tall.

- Selection persists in `localStorage` and is applied before paint by the existing boot script, so there is no flash of the wrong vocabulary.
- Switching swaps terminology (line/rope, leader/tail, guides/fairleads, hardware eye/shackle) and the available connection, material and diameter options everywhere they are rendered.
- Fishing behavior is unchanged: same options, same weights, same rankings, same PDF output. Boating is additive.
- Switching domains clears the current run rather than re-scoring a fishing setup against boating options — a stale cross-domain result would be a fail-open, which this instrument does not do.

Boating in this pass is terminology plus options, with a small starter set of connections (bowline, cleat hitch, round turn and two half hitches, rolling hitch, sheet bend, figure-eight stopper) so the mode is honest rather than empty. Rope Construction appears as an extra dimension only in Boating; Fishing gains no rows.

## 2. Venue intelligence

Venue becomes a first-class input, domain-specific:

- Fishing: surf, pier/jetty, kayak/small craft, inshore flats, offshore, river/wading.
- Boating: dock/cleat, mooring ball, anchorage, halyard/sheet duty, towing, lifelines.

Each venue carries what actually changes the decision — abrasion sources, structure and snag risk, current or load direction, hand conditions, retie tempo, inspection opportunity, and consequence of failure. Picking a venue pre-loads those conditions (they stay editable), nudges the ranking through the existing modifier path, and adds a short "why this venue changes the answer" note to the decision card and the PDF. Diagnose gains a venue field so symptom explanations can name the likely abrasion or shock-load source.

## 3. Search

Two parts, both requested:

- **Finder** — a keyboard-first search over scenarios, connections, knots and symptoms. Opens with `/` or `Ctrl/Cmd-K`, or a tap target in the header on mobile. Results are grouped and each one is an action: load a scenario, jump to a tie card, or open a symptom in Diagnose. Matching is fuzzy over label, aliases and job.
- **URL state polish** — shorter, stable, shareable parameters, domain and venue retained across navigation, defaults stripped from the URL, and the Diagnose → Decide handoff carried as a compact token instead of long encoded text.

## 4. Motion

Purposeful only, all gated behind `prefers-reduced-motion`:

- Directional step transitions and eased diagram focus-zoom (already present) extended to the new controls.
- Results reveal in a short staggered rise; the winner card settles last.
- Meters animate from zero to their score once, on first reveal.
- Domain switch crossfades the vocabulary rather than snapping.
- Chip selection gets a quick press-in and settle.

## 5. Micro callouts

The step-player micro how-to (what to look for, common failure mode, quick fix) extends to the remaining knots that lack it, and the same three-part callout appears on venue choices ("what this venue punishes") and on symptom rows in Diagnose ("what this usually means / what to check first").

## 6. Mobile accessibility and touch

- Every step control, scenario chip, matrix cell trigger and card action gets a reachable accessible name and a 44px minimum hit area, with the visual size unchanged where the design needs it small.
- Focus order follows reading order; the sticky step bar does not trap focus; skip-to-content lands on `<main>`.
- Live regions announce step changes, run results, and domain switches.
- Touch: swipe already advances steps; add momentum-friendly edge-masked horizontal scroll for the matrix and chip rails, larger press states, and long-press to reveal a chip's explanation instead of hover.
- Colour-blind-safe mode keeps its glyph plus weight encoding across all new UI.

## 7. Language switcher

English and Spanish. UI chrome, labels, buttons, venue names and callout headings are translated; technical knot names and the mechanical procedure text stay in English, with the Spanish UI framing them. The switcher sits next to the appearance toggle, persists in `localStorage`, applies pre-paint, and sets `<html lang>`.

## Technical notes

- New `src/domains/boating/` (terms, vocabulary, dimensions incl. optional Rope Construction, materials, scenarios, starter knots) and `src/domains/registry.ts`.
- `src/domain/context.tsx` gains persisted state and a `useDomainId` setter; `THEME_BOOT_SCRIPT` extended to read domain and locale.
- `KnotDomain` gains `venues: DomainVenue[]`; venue effects express themselves as condition patches plus ranking modifiers, reusing the existing `materialModifier` path — no engine rewrite.
- New components under `src/components/instrument/`: `domain-switch`, `finder`, `venue-picker`, `locale-switch`.
- i18n as a small typed dictionary (`src/i18n/en.ts`, `es.ts`) with a `useT()` hook — no new dependency.
- Search index built once from the active domain descriptor; no server work, still fully offline.
- No Cloud, auth or network calls; everything stays local-first.
