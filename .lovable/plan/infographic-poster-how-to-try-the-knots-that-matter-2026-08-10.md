# Infographic Poster — "How to Try the Knots That Matter"

A single original 16:9 landscape infographic poster, generated as a vector-crisp file and delivered as a downloadable artifact. No app UI, no mockups, no photos.

## Output

- `/mnt/documents/how-to-try-the-knots-that-matter.pdf` (vector, print-ready)
- `/mnt/documents/how-to-try-the-knots-that-matter.png` (2560x1440, for sharing)

Nothing in the app's source code changes.

## Visual system

- Canvas 16:9 landscape, warm off-white paper (#F6F1E7) with a faint procedural fiber texture.
- Palette: deep teal #0B4F5C, charcoal #1F2933, warm sand #D6C4A8. No other hues.
- Flat vector illustration, thick clean strokes, generous whitespace, high contrast.
- Type: bold geometric sans for title/band heads, medium sans for body. Max 8 words per label. Minimum body size tuned so the poster stays legible at phone width.

## Structure

Title block top center, then five equal-width stacked bands separated by thin teal rules, each with a numbered teal circle badge at the left edge. Tiny footer line at the bottom.

1. **Name the job first** — four equal rounded cards, each a simple line icon plus two-line label (hook / join / loop / fly tip). Caption: "Knot name comes last."
2. **Five-knot practice set** — five equal tall cards: bold knot name, one-line job, sand pill with example. Note beneath the band.
3. **Field try protocol** — six numbered circles in a horizontal flow with arrows; sand callout box at the right: "A good finished knot looks boring."
4. **Try with real examples** — four scenario rows: setup chip → arrow → "Try first" chip → short why. Tiny disclaimer beneath.
5. **When it fails** — left wrap of six failure chips, center arrow into three equal outcome boxes, teal tagline at the right edge.

All copy is used verbatim as supplied.

## Technical approach

- Python script in `/tmp` drawing with ReportLab (vector PDF) for exact geometry, then rasterized to PNG.
- Icons drawn as primitive paths (hook curve, two joining lines, open loop, fly tip) — no clipart, no generated imagery.
- A layout grid with fixed band heights and computed column widths keeps every element inside margins.

## Quality check before delivery

Render every page to an image and inspect for: overlapping elements, clipped or overflowing text, chips wider than their band, uneven spacing, low-contrast text, and divider alignment. Fix the script and re-render until a full pass is clean, then report what was checked.
