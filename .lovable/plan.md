# Architecture audit + micro-how-to, accessibility, motion, and a domain bolt-on

## Part 1 — Current architecture audit

### Decide (`src/routes/index.tsx`, 771 lines)
- Shell, Panel, MicroLabel, StepHead, Chip, Meter, Verdict, Bullets (`components/instrument/primitives.tsx`, `shell.tsx`)
- Hero image `src/assets/line-tension.jpg`
- Engines: `engine/chooser.ts` -> `engine/constraints.ts` + `engine/ranking.ts` + `engine/explain.ts`; then `engine/advisor.ts` (trade-offs, counterfactuals, decision card)
- `lib/decision-packet.ts` (PDF), `lib/overlay.tsx` hooks (`useScenarios`, `useConnectionGroups`, `useMaterialOptions`)
- Links out to `/tie/$knotId`

### Diagnose (`src/routes/diagnose.tsx`, 473 lines)
- Same primitives + Shell (Verdict carries the retie decision)
- `engine/troubleshoot.ts` (symptom-first) and `data/failure-playbook.ts` (`FAILURE_PLAYS`, `BreakLocation`, `FailureEvent`)
- `engine/diagnostics.ts` (`runFinishedCheck`) for observation-based checks
- Handoff into Decide via URL search params

### Data / configuration
- Vocabulary + labels: `src/domain/types.ts` (ConnectionJob, LineMaterial, DiameterRelation, FIELD_FIT_DIMENSIONS, CONNECTION_LABELS/GROUPS, MATERIAL_LABELS, DIAMETER_LABELS, DIMENSION_LABELS, RETIE_LABELS)
- Knot content: `data/knots/{terminal,line-to-line,loops,utility}.ts`
- Mechanics: `data/mechanics-profiles.ts` (contract, fieldFit, fingerprint, observations, diagramKind)
- Procedure depth: `data/how-to.ts`; assembled by `data/catalog.ts`
- Scenarios: `data/scenarios.ts`; symptoms / break locations: `data/failure-playbook.ts`
- User-authored overlay: `lib/overlay-store.ts` + `lib/overlay.tsx` (localStorage)

### Scoring / mechanical model
Layer 1 `constraints.ts` (hard elimination) -> Layer 2 `ranking.ts` (16 weighted dimensions, inactive conditions collapse weight) -> explainability `explain.ts` -> advisory `advisor.ts`.

### Diagnosis / failure logic
Layer 3 `diagnostics.ts` (fingerprint vs observations -> RetieDecision) and `troubleshoot.ts` (symptom + break location + material/connection/diameter overlays -> findings, context chips).

### Routing / state
TanStack file routes: `/` (Decide, `validateSearch`), `/diagnose`, `/tie/$knotId`, `/admin`. State is local `useState` + URL search; global providers in `__root.tsx` (`ThemeProvider`, `OverlayProvider`). No server state.

### Reusable UI
`Shell`, `Panel`, `MicroLabel`, `StepHead`, `Chip`, `Meter`, `Verdict`, `Bullets`, `KnotDiagram`, `StepPlayer`.

## Part 2 — Step player: micro-how-to callouts

Add three optional per-step fields — `look` (what to look for), `failureMode`, `quickFix` — to `KnotStep`. All optional, so any step without them renders exactly as today.

- Rendered inside the step player as one compact collapsible "Micro how-to" block, not three new always-on panels, so Fishing page length does not grow.
- Content authored in `data/how-to.ts` only (no changes to knot source files).
- Existing `tip` / `commonError` / defect blocks stay unchanged.

## Part 3 — Mobile + colour-blind accessibility

- Step player: `role="group"` + `aria-roledescription="carousel"`, `aria-live="polite"` step announcements, dots as a proper tablist with `aria-current`, all targets >= 44px, focus-visible rings on every control.
- Diagram gets a text alternative (`role="img"` + per-step description) so screen readers are not left with an empty SVG.
- Colour-blind safety: never colour alone. Verdict, defect, caution and matrix cells gain a glyph/short token (PASS / WATCH / STOP) alongside colour; dimension meters gain numeric values. Contrast checked in both themes.

## Part 4 — Motion

- Step transitions: short cross-fade + 8px slide in the swipe direction; diagram focus transform eases instead of jumping.
- Results panels in Decide and Diagnose fade/slide in on mount, lightly staggered.
- All motion behind `prefers-reduced-motion: reduce` -> instant. No motion on the sticky control bar.

## Part 5 — Smallest domain bolt-on (Fishing now, Boating later)

Principle: the engines already operate on string-keyed vocabularies. The only genuinely Fishing-specific things are (a) the union types and label maps in `domain/types.ts`, (b) the datasets, (c) hardcoded copy in the two routes. So the bolt-on is a **domain descriptor object** the engines and routes read from, with Fishing as the default — no domain switch, no UI change.

### 1. Reuse as-is
`engine/ranking.ts`, `engine/constraints.ts`, `engine/explain.ts`, `engine/advisor.ts`, `engine/diagnostics.ts`, `engine/chooser.ts`, all of `components/instrument/*`, `lib/theme.tsx`, `lib/decision-packet.ts`, `lib/utils.ts`, all routes structurally.

### 2. Light refactor (and why)
- `domain/types.ts` — split into structural, domain-agnostic types (widen `ConnectionJob`/`LineMaterial`/`DiameterRelation` to branded string aliases) plus `domains/fishing/vocabulary.ts` holding today's unions and label maps, re-exported so nothing breaks.
- `data/catalog.ts` — becomes `buildCatalog(domain)`; exported `KNOTS`/`getKnot` keep working by defaulting to Fishing.
- `engine/ranking.ts` — read the dimension list and weights from the descriptor instead of module constants (identical values for Fishing).
- `engine/troubleshoot.ts` — take failure plays and break-location vocabulary from the descriptor instead of importing `failure-playbook` directly.
- `routes/index.tsx` / `routes/diagnose.tsx` — replace hardcoded nouns ("line", "leader", "guides", "retie") with `domain.terms.*`; layout untouched.
- `lib/overlay-store.ts` — validate custom entries against the active domain's vocabulary rather than hardcoded Fishing arrays.

### 3. New files
```text
src/domain/domain.ts              // KnotDomain interface + helpers
src/domain/context.tsx            // DomainProvider + useDomain (defaults to fishing)
src/domains/fishing/index.ts      // assembles the Fishing descriptor
src/domains/fishing/vocabulary.ts // connections, materials, diameters, labels
src/domains/fishing/dimensions.ts // the current 16 dimensions + weights
src/domains/fishing/terms.ts      // terminology strings
src/domains/boating/...           // later, same shape
```

### 4. Domain data shape
```ts
interface KnotDomain {
  id: "fishing" | "boating";
  label: string;
  terms: Record<TermKey, string>;      // "line" | "rope", "retie" | "re-tie/reeve", ...
  connections: { id: string; label: string; group: string }[];
  materials:   { id: string; label: string }[];
  diameters:   { id: string; label: string }[];
  dimensions:  { key: string; label: string; weight: number; optional?: boolean }[];
  scenarios:   FieldScenario[];
  failurePlays: FailurePlay[];
  knots: KnotContent[];
  mechanics: (id: string) => MechanicalProfile | undefined;
}
```
Fishing supplies today's data verbatim. Boating later supplies its own connections (bend, hitch, anchor rode, dock line), materials (three-strand nylon, double-braid polyester, Dyneema), constructions, conditions (surge, chafe, shock load) and failure modes.

### 5. Domain-driven dimensions and terminology
- Dimension lists live in the descriptor. Fishing keeps exactly 16 keys with today's weights, so scores and PDF output stay identical.
- Boating-only dimensions (Rope Construction, chafe resistance, shock absorption) exist only in the Boating descriptor. Any dimension may be marked `optional`; UI renders only dimensions present in the active domain, so Fishing screens gain zero rows or controls.
- Terminology flows through `domain.terms`; Decide and Diagnose keep one implementation and read labels at render time.

## Sequencing
Parts 2–4 are self-contained and ship first. Part 5 lands as a pure refactor with no visible change, verified by comparing Decide output and PDF before/after on identical inputs.

## Questions
1. Ship Parts 2–4 first and the domain refactor as a second pass, or all in one?
2. Author micro-how-to content for all 19 knots now, or a first tranche (Palomar, FG, Uni, Improved Clinch, Bimini)?
3. Micro-how-to block collapsed by default on desktop too, or only on phones?