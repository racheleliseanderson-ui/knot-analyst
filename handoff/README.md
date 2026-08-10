# Knot Intelligence — Handoff Package (non-canonical)

Source baseline: `racheleliseanderson-ui/knot-intelligence` @ `main` (live: knot-intelligence.vercel.app).
This directory is a **selective port map**, not a merge instruction. Nothing here is published,
deployed, or connected to a canonical branch.

## Scope of this generation

One publication (Hook the Horizon · Knot Intelligence), two routes, one palette, one type system,
one image plan. Philosophy preserved: decision + diagnosis instrument, not a knot library.

## File-by-file classification

| Path | Class | Note |
| --- | --- | --- |
| `src/domain/types.ts` | RETAIN | Ported byte-identical from baseline. No contract changes. |
| `src/data/**` (catalog, mechanics-profiles, knots/*, failure-playbook, scenarios) | RETAIN | Ported unchanged. Catalog version `2026-08-09.2`. |
| `src/engine/constraints.ts` | RETAIN | Layer 1 untouched — invalid options still never score. |
| `src/engine/ranking.ts`, `explain.ts`, `chooser.ts`, `diagnostics.ts`, `troubleshoot.ts` | RETAIN | Ported unchanged; still the sole scoring authority. |
| `src/engine/advisor.ts` | **NEW — PORT** | Layer 2.5. Pure functions over `ChooseResult`: conflict/trade-off detection, deterministic counterfactual re-runs, Decision Card assembly. No scoring authority; cannot promote an eliminated knot. |
| `src/components/instrument/primitives.tsx` | **NEW — PORT** | Panel / MicroLabel / StepHead / Chip / Meter / Verdict / Bullets. |
| `src/components/instrument/shell.tsx` | **NEW — PORT** | Two-mode shell (Decide 01 / Diagnose 02) + engine provenance footer. |
| `src/routes/index.tsx` | **NEW — PORT** (replaces `/choose`) | Decide mode: progressive disclosure 01 connection → 02 materials → 03 conditions; Knot Decision Card; conflicting constraints; surviving options; "what would change this"; eliminated ledger. |
| `src/routes/diagnose.tsx` | **NEW — PORT** (replaces `/check` entry) | Symptom-first diagnosis, break location, connection/material refinement, evidence trail, frictionless handoff to Decide with full context. |
| `src/styles.css` | **REWRITE** | Deep-water instrument tokens (oklch), Archivo + IBM Plex Mono, print stylesheet for the cards. |
| `src/assets/line-tension.jpg` | NEW | Generated cinematic reference image; replace with owned photography before any public runtime. |
| baseline `src/lib/auth/**`, `src/lib/multiplayer/**`, `src/lib/db.ts`, `migrations/`, PWA/grok scripts | REJECT (out of scope) | Not required by the decision/diagnosis instrument; do not carry into a port. |
| baseline `src/routes/catalog.tsx`, `compare.tsx`, `knots.$knotId.tsx`, `tie.$knotId.tsx` | VERIFY | Library-shaped surfaces. Keep only if the owner explicitly wants a reference tier; they are outside the "not a library" contract as elevated here. |
| baseline `src/routes/api/**` | VERIFY | Unchanged contract; re-point only if the canonical runtime exposes them. |

## Behavior added (must be re-tested in canonical)

1. **Trade-off surfacing** — declared conditions that fight the winning geometry are named on their
   own axis (strength vs retie tempo, precision vs cold hands, tag control vs wind, inspectability
   vs low light, holding power vs guide passage, geometry vs proficiency), each with the
   best surviving alternative on that single dimension.
2. **Counterfactuals** — the constraint engine is re-run under altered conditions; the answer states
   whether the recommendation holds, switches, or fails closed.
3. **Decision Card** — job line, material system, condition line, field fit, reasons, retie notes
   (seating requirements, tension profile, slip sensitivity, failure-sensitive stages), watch-for,
   fallback, elimination count, engine + catalog provenance. Printable.
4. **Diagnose → Decide handoff** — connection, both materials and diameter relation carry through
   the URL with a "carried from diagnosis" banner; nothing is silently assumed.

## Fail-closed checks (re-run before any canonical merge)

- Connection unset → nothing scores, no recommendation rendered.
- All candidates eliminated → "No valid connection" card, no substitute invented.
- `cannot-verify` diagnosis renders as unverified, never as a pass.
- Eliminated candidates remain visible with their hard-constraint reason.

## Not performed here (requires separate authorization)

Publishing, domains, auth, analytics, payments, database, canonical branch merge, WordPress port.
