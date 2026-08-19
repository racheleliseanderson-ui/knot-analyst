# Tie card printing, tying video, diagram accessibility

## 1. Printable tie card (browser print)

Add a print-only presentation to `/tie/<knot>` so a knot can be carried on paper in a dry bag.

- A "Print tie card" button in the tie page header (hidden in print).
- In print, the step player collapses into a linear list: every step expanded, numbered, with its diagram frame, the long-form detail, the observable check, and the three micro how-to cues (Look for / Fails as / Quick fix) always open — no collapsed blocks, no controls.
- Also printed: Before you start, Seating sequence, Verify before you fish it checklist. Dropped from print: navigation, theme toggle, sidebar cross-links, sticky bars.
- Print colors forced ink-safe: white page, black text, hairline rules, diagrams stroked in black with the active step rendered as a heavier weight instead of a color. Cue labels keep their glyph (check / cross / arrow) so they read without color.
- Page rules: 14mm margins, no step split across pages, header repeats knot name and difficulty.

## 2. Tying video

- Add an optional `video` field to knot content (provider, id, title, channel, optional start time), supplied in a new `src/data/videos.ts` and merged in the same catalog hydration pass as `how-to.ts`.
- Render a "Watch the tie" panel on the tie page using a click-to-load facade: static thumbnail plus play button; the YouTube iframe (`youtube-nocookie.com`) mounts only on click. Nothing loads from Google until the user asks for it.
- The facade is a keyboard-accessible button with a real accessible name ("Play tying video — Palomar"), a 16:9 box, and a visible fallback link for anyone who cannot use the embed.
- Hidden in print, replaced by a printed line with the video title and channel.
- Coverage: one selected reputable video for the core knots (Palomar, Improved Clinch, Uni, FG, Bimini Twist, Non-Slip Loop, Double Uni, Alberto, Perfection Loop, San Diego Jam, Surgeon's, Blood, Dropper Loop, Arbor). Knots without an entry render nothing new.

## 3. Diagram accessibility pass

The diagram currently renders an SVG with no text alternative.

- Give each diagram `role="img"` with a title and description wired via `aria-labelledby`/`aria-describedby`, generated per diagram kind and per active step ("Step 3 of 5 — the tag end passes back through the loop above the eye").
- A visually hidden description beside the diagram in the step player, plus an always-available "Describe diagram" disclosure for sighted users who want the geometry in words.
- Decorative sub-elements marked `aria-hidden`; no unlabeled interactive SVG children.
- Non-color state encoding: the active segment gains heavier stroke weight and not-yet-drawn segments become dashed ghosts, so step state survives grayscale and color blindness.
- Contrast check of stroke colors against panel backgrounds in both themes; raise ghost opacity if it reads too faint.
- The focus-zoom transform respects `prefers-reduced-motion` along with the existing step motion.

## Technical notes

Files touched: `src/components/instrument/diagram.tsx` (accessibility + stroke encoding), `src/components/instrument/step-player.tsx` (print expansion, description disclosure), `src/routes/tie.$knotId.tsx` (print button, video panel), new `src/components/instrument/video-embed.tsx`, new `src/data/videos.ts`, `src/data/catalog.ts` (merge videos), `src/domain/types.ts` (video field), `src/styles.css` (print block).

No engine, ranking, diagnostics, or Decide/Diagnose behavior changes. No new dependencies.
