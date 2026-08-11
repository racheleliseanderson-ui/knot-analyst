# Fishing Schema 2.0 — phases 0–7

Implemented on branch `schema-2.0-phases-0-7`. Philosophy preserved: constraint-first, fail-closed, flat materials rank identically when deeper axes are unspecified.

## Brand hierarchy (Phase 0)

```
Hook the Horizon          publisher
└── Knot Analyst          product (monogram KA)
    ├── Fishing
    └── Boating & Sailing
```

- UI monogram: **KA** (was KI)
- Meta/title helpers: `src/domain/brand.ts`
- Engine IDs (`HTH-KK-001`, `horizon.knot-intelligence`) stay for provenance only

## Golden regression (Phase 1)

```bash
npm run test:schema
```

- Goldens: `scripts/schema-goldens.json` (captured from engine 1.2.2 flat rankings)
- Runner: `scripts/schema-regression.ts`
- Gate: dual-write, default braid resolve, and mm path must not drift flat rankings

## MaterialSpec disclosures (Phase 2)

- Braid / backing: **fiber** row (UHMWPE / Polyester / Not sure)
- Wire: metal fiber row (Stainless / Titanium)
- Construction + treatment unchanged
- Slippery-fiber modifiers still require declared **construction** so plain Braid is a no-op

## Connection dual-write (Phase 3)

- `src/domain/connection-preset.ts`
- Clicking “Braid → Leader” still uses `ConnectionJob = braid-to-leader`
- Internally also writes `structuralJob`, `mainRole`, `secondaryRole`
- **No ID renames**

## Side-aware constraints (Phase 4)

- Prefer `mainMaterials` / `secondaryMaterials` when contracts declare them
- FG secondary side: mono/fluoro/mixed only when secondary is declared
- Flat path byte-stable

## Diameter mm (Phase 5)

- `src/domain/diameter.ts` — `relationFromDiameters(mainMm, secondaryMm)`
- Decide UI: optional mm fields under diameter chips on join jobs
- When both sides measured, relational band updates automatically
- Prefer mm over manufacturer pound-test

## Candidate Termination parallel track (Phase 6)

- `src/domain/termination.ts` — `TerminationCandidate[]` with types knot|bend|hitch|splice|crimp|twist|mechanical|…
- Chooser attaches `terminationCandidates` alongside knot ranking
- Hollow-core → splice candidates; wire → crimp / haywire / mechanical
- Knot ranking remains primary; UI shows candidates under the termination banner

## Boating readiness (Phase 7 — no catalog yet)

- `src/domains/boating/materials.ts` — material axes vocabulary only
- `knots: []` still — fail closed
- Do not author Boating terminations until `npm run test:schema` stays green after Fishing content work

## Engine version

`ENGINE_VERSION = mech-intel-1.3.0`
