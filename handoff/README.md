# Knot Analyst — Handoff Package (non-canonical)

Source baseline: `racheleliseanderson-ui/knot-analyst` @ `main` (live: https://knot.hookthehorizon.blog/).
This directory is a **selective port map**, not a merge instruction. Nothing here is published,
deployed, or connected to a canonical branch.

## Scope of this generation

One publication (Hook the Horizon · Knot Analyst), two routes, one palette, one type system,
one image plan. Philosophy preserved: decision + diagnosis instrument, not a knot library.

## File-by-file classification

| Path                                                                                                   | Class                                    | Note                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/domain/types.ts`                                                                                  | RETAIN                                   | Ported byte-identical from baseline. No contract changes.                                                                                                                                           |
| `src/data/**` (catalog, mechanics-profiles, knots/*, failure-playbook, scenarios)                      | RETAIN                                   | Ported unchanged. Catalog version `2026-08-09.2`.                                                                                                                                                   |
| `src/engine/constraints.ts`                                                                            | RETAIN                                   | Layer 1 untouched — invalid options still never score.                                                                                                                                              |
| `src/engine/ranking.ts`, `explain.ts`, `chooser.ts`, `diagnostics.ts`, `troubleshoot.ts`               | RETAIN                                   | Ported unchanged; still the sole scoring authority.                                                                                                                                                 |
| `src/engine/advisor.ts`                                                                                | **NEW — PORT**                           | Layer 2.5. Pure functions over `ChooseResult`: conflict/trade-off detection, deterministic counterfactual re-runs, Decision Card assembly. No scoring authority; cannot promote an eliminated knot. |
| `src/components/instrument/primitives.tsx`                                                             | **NEW — PORT**                           | Panel / MicroLabel / StepHead / Chip / Meter / Verdict / Bullets.                                                                                                                                   |
| `src/components/instrument/shell.tsx`                                                                  | **NEW — PORT**                           | Two-mode shell (Decide 01 / Diagnose 02) + engine provenance footer.                                                                                                                                |
| `src/routes/index.tsx`                                                                                 | **NEW — PORT** (replaces `/choose`)      | Decide mode: progressive disclosure 01 connection → 02 materials → 03 conditions; Knot Decision Card; conflicting constraints; surviving options; "what would change this"; eliminated ledger.      |
| `src/routes/diagnose.tsx`                                                                              | **NEW — PORT** (replaces `/check` entry) | Symptom-first diagnosis, break location, connection/material refinement, evidence trail, frictionless handoff to Decide with full context.                                                          |
| `src/styles.css`                                                                                       | **REWRITE**                              | Deep-water instrument tokens (oklch), Archivo + IBM Plex Mono, print stylesheet for the cards.                                                                                                      |
| `src/assets/line-tension.jpg`                                                                          | NEW                                      | Generated cinematic reference image; replace with owned photography before any public runtime.                                                                                                      |
| baseline `src/lib/auth/**`, `src/lib/multiplayer/**`, `src/lib/db.ts`, `migrations/`, PWA/grok scripts | REJECT (out of scope)                    | Not required by the decision/diagnosis instrument; do not carry into a port.                                                                                                                        |
| baseline `src/routes/catalog.tsx`, `compare.tsx`, `knots.$knotId.tsx`, `tie.$knotId.tsx`               | VERIFY                                   | Library-shaped surfaces. Keep only if the owner explicitly wants a reference tier; they are outside the "not a library" contract as elevated here.                                                  |
| baseline `src/routes/api/**`                                                                           | VERIFY                                   | Unchanged contract; re-point only if the canonical runtime exposes them.                                                                                                                            |

## Later generations — additional classification

| Path                                                                                                       | Class                  | Note                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/engine/compare.ts`                                                                                    | **NEW — PORT**         | Quick-compare. Single-field revert probes attribute a changed recommendation to specific constraints. Pure; no scoring authority.                                                  |
| `src/routes/compare.tsx`                                                                                   | **NEW — PORT**         | Mode 03. Two-scenario editor, "what changed" rows with evidence drilldown, pipeline run controls (re-run / step / freeze / session log), session-persisted control state.          |
| `src/components/instrument/evidence.tsx`                                                                   | **NEW — PORT**         | Delta bars, elimination evidence, plain-text summaries for each changed constraint.                                                                                                |
| `src/lib/handoff.ts`                                                                                       | **NEW — PORT**         | Diagnose → Decide constraint mapping with stated reasons and rules-out list. Nothing inferred without evidence.                                                                    |
| `src/domain/material.ts`                                                                                   | **NEW — PORT**         | 4-axis material intelligence (fiber, construction, treatment, role). Shared across domains.                                                                                        |
| `src/domain/context.tsx`, `src/domains/**`, `src/components/instrument/domain-switch.tsx`                  | **NEW — PORT**         | Fishing / Boating domain bolt-on: terminology, dimensions, venues, vocabulary per domain. Fishing behaviour unchanged.                                                             |
| `src/domain/venue.ts`, `src/components/instrument/venue-picker.tsx`                                        | **NEW — PORT**         | Venue selection with condition patches and micro-callouts.                                                                                                                         |
| `src/data/how-to.ts`, `src/data/videos.ts`                                                                 | **NEW — PORT**         | Deep tying procedure content (look-for / failure mode / quick fix per step) and video references.                                                                                  |
| `src/components/instrument/step-player.tsx`, `diagram.tsx`, `video-embed.tsx`                              | **NEW — PORT**         | Step player with sticky mobile bar and swipe, parametric accessible SVG diagrams (dual-encoded), click-to-load video facade.                                                       |
| `src/routes/tie.$knotId.tsx`                                                                               | **NEW — PORT**         | Procedure surface. Instructional tier, not a browsable library index.                                                                                                              |
| `src/lib/decision-packet.ts` (jspdf)                                                                       | **NEW — PORT**         | Two-tier PDF: Brief and Field Packet. WinAnsi glyph mapping required.                                                                                                              |
| `src/lib/presets.ts`, `preset-bar.tsx`                                                                     | **NEW — PORT**         | Named/pinned input presets in localStorage.                                                                                                                                        |
| `src/lib/theme.tsx`, `appearance-menu.tsx`                                                                 | **NEW — PORT**         | Four appearance modes: dark, light, colour-blind safe, Atelier. Boot script prevents flash.                                                                                        |
| `src/lib/overlay-store.ts`, `overlay.tsx`, `src/routes/admin.tsx`                                          | **NEW — PORT (gated)** | Local authored overlays (`x:` prefix) merged over library data, with dry-run import. localStorage only — needs a real persistence + authorisation story before any shared runtime. |
| `src/lib/prefs.tsx`, `src/i18n/index.tsx`, `locale-switch.tsx`                                             | **NEW — PORT**         | Persisted domain + locale (en/es). Translation coverage is partial — audit strings before shipping the switch publicly.                                                            |
| `src/components/instrument/finder.tsx`                                                                     | **NEW — PORT**         | Cmd+K / `/` finder, scored matching, typo tolerance, facets.                                                                                                                       |
| `src/components/instrument/decide-stepper.tsx`                                                             | **NEW — PORT**         | Phone-only guided Decide flow (ARIA tablist, gestures).                                                                                                                            |
| `src/lib/session-state.ts`                                                                                 | **NEW — PORT**         | Hydration-safe sessionStorage hook.                                                                                                                                                |
| `src/lib/error-capture.ts`, `error-page.ts`, `lovable-error-reporting.ts`, `src/server.ts`, `src/start.ts` | REJECT                 | Lovable/TanStack runtime scaffold. Do not merge into canonical.                                                                                                                    |
| `src/routeTree.gen.ts`, `vite.config.ts`, `bunfig.toml`, lockfile                                          | REJECT                 | Generated build scaffold for this runtime only.                                                                                                                                    |
| `.lovable/**`                                                                                              | REJECT                 | Internal plan records, not product.                                                                                                                                                |

## Known limits at freeze

- All authored data (overlays, presets, appearance, domain, locale, pipeline state) is browser-local. No server persistence, no auth, no multi-device.
- Spanish locale is partial.
- Diagrams and generated imagery are placeholders for owned artwork.
- No automated test suite ships with this generation; the fail-closed checks below are manual.

## Freeze

Freeze the exact commit produced by the GitHub sync of this generation and port only the
rows classed PORT above. Do not merge the repository wholesale.

Freeze record, verification evidence, dependency inventory, security posture and rollback:
see `handoff/FREEZE.md`. Port destinations: see `handoff/PORT-MAP.md`.

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
