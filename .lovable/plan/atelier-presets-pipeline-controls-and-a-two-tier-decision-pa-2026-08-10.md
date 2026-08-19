# Atelier: presets, pipeline controls, and a two-tier decision packet

Six threads, one build. Nothing changes in the mechanical model — invalid options still never score, diagnose stays symptom-first, and no recommendation is softened.

## 1. Preset manager (saved setups)

A named setup is the whole input state: domain, venue, line material and its four material axes, target, conditions, and any carried diagnosis constraints.

- New store `src/lib/presets.ts` — local, versioned, exportable. Each preset records name, domain, captured inputs, timestamp, and an optional note.
- A "Setups" control in the Decide header: save current, recall, rename, pin, duplicate, delete. Pinned setups appear as chips beside the scenario starters.
- Recall is explicit and reversible — loading a preset shows what it overwrote and offers a one-tap revert.
- Cross-mode: any preset can be sent to Compare as slot A or B, and any Compare column can be saved back as a preset.
- Export/import JSON, so setups move between devices without an account.

## 2. Admin data editor upgrade

Keeps the existing overlay model (`x:` prefixed records), gets the missing rigour:

- Field-level validation with inline reasons — a malformed connection is rejected before it can enter scoring, not after.
- Search and filter across scenarios, materials, connections; duplicate-ID detection.
- Bulk JSON import with a dry-run diff: added / changed / rejected, with per-row reasons, before anything is written.
- Per-record revert to library default, and a visible marker anywhere an overlay is in effect.

## 3. Pipeline run management

The Compare pipeline strip becomes a real run surface, and Decide gets one too.

- Run history: recent runs kept in session with run ID, stage timings, input hash, and verdict. Any run can be reopened read-only.
- Controls: Re-run, Step (stage-by-stage: constraints → ranking → probe → evidence), Freeze, Unfreeze, plus Diff against a previous run.
- A stage inspector shows counts in and out per stage — how many connections entered, how many the hard-constraint layer eliminated, and why.
- Runs are attachable to a packet export, so the PDF records exactly which run produced it.

## 4. Interaction and mobility pass

- Every step control, scenario chip, evidence row, preset chip and pipeline button: reachable name, 44px minimum target, visible focus ring, correct tab order.
- Evidence rows and drilldowns get roving-tabindex keyboard navigation and consistent Escape-to-close.
- Touch: swipe between compare columns and step-player steps, long-press on a preset chip for its actions, momentum-safe scroll containers with no trapped panels.
- Live regions announce verdict changes and run completion once, not on every keystroke.
- All motion routed through the existing tokens and gated by `prefers-reduced-motion`.

## 5. Atelier — fourth appearance mode

`dark`, `light` and `cb` stay exactly as they are. A fourth mode joins the rotation.

- Deeper, near-black teal environment with a warm ink cast; brass and bone as the only accents; wider editorial measure and larger display type for headings, with the mono technical labels untouched.
- Layered depth: soft vignette field, hairline rules at true 1px, panel elevation by light rather than borders.
- Contrast verified against the same AA floor as the other modes — the luxury reading does not buy itself softness.
- The appearance control becomes a labelled menu rather than a blind cycle; four states is past the point where a toggle is honest.

## 6. Decision packet, two exports

Both build on the existing jsPDF generator.

- **Decision brief** (1–2 pages): recommendation, verdict, constraints applied, ranked survivors, trade-offs, counterfactuals, run ID and timestamp.
- **Field packet** (longer): everything in the brief, plus A/B compare setups and what-changed rows with probe evidence, tying steps, vector diagrams for the recommended connection, seating sequence, failure modes, and a verify-before-you-fish checklist.
- Export picker on both Decide and Compare, with the source run stamped into the footer. Diagrams draw as vector paths, not screenshots, so print stays sharp.

## Layout and flow assessment

Delivered as a short written read alongside the build: where the current Decide / Compare / Diagnose split holds up, where the mobile stepper competes with the desktop two-column, and any concrete restructure worth doing — recommended, not silently applied.

## Technical notes

- New: `src/lib/presets.ts`, `src/components/instrument/preset-bar.tsx`, `src/components/instrument/run-history.tsx`, `src/lib/packet-field.ts`.
- Changed: `src/lib/theme.tsx` (add `atelier`, boot script, labels), `src/styles.css` (Atelier token block + type scale), `shell.tsx` (appearance menu, preset entry), `compare.tsx` (run history, stage inspector, diff), `index.tsx` (preset bar, export picker), `admin.tsx` (validation, search, dry-run import), `evidence.tsx` (keyboard nav), `decision-packet.ts` (split into brief and field builders).
- No backend, no auth, no network: presets and overlays stay in local storage, with JSON export as the transport.
