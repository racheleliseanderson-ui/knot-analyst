# Freeze record — Knot Analyst (non-canonical generation)

Date: 2026-08-16. Application: Hook the Horizon · Knot Analyst.
Governing plan: `.lovable/plan/` archive. Canonical repository:
`racheleliseanderson-ui/knot-intelligence`. Runtime destination: WordPress (Hook the Horizon).

## 1. Frozen artifact

| Item                      | Value                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------ |
| Baseline commit at freeze | `86cb510` (`Added a11y flow tests`)                                                  |
| Freeze commit             | the commit produced by the GitHub sync of this generation; use that SHA, not `main`  |
| Branch policy             | port into an existing canonical branch; never merge this repo wholesale              |
| Routes in scope           | `/` (Decide 01), `/diagnose` (02), `/compare` (03), `/tie/$knotId`, `/admin` (gated) |
| Catalog version           | `2026-08-09.2` — 86 modelled connections                                             |

## 2. Verification evidence at freeze

| Check                                                  | Command                | Result                                                                                                           |
| ------------------------------------------------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Schema regression                                      | `bun run test:schema`  | PASSED — 20 golden cases                                                                                         |
| Catalog validation                                     | `bun run test:catalog` | PASSED — 86 connections, 86 content entries, 86 how-to builds, 86 schematic families, 86 cited videos, 8 sources |
| Production build                                       | `bun run build`        | PASSED — nitro/Cloudflare worker output generated                                                                |
| End-to-end (production build served by `wrangler dev`) | `bun run e2e`          | 32 passed, 8 skipped (desktop-only assertions skipped on the phone project and vice versa)                       |
| Lint                                                   | `bun run lint`         | run before merge in canonical; ESLint config is generated scaffold and is REJECT for port                        |

E2E coverage: Decide flow, Diagnose flow, deep-linked job context restore (desktop + phone),
printable Decision/Diagnosis card incl. print-media emulation and PDF export, accessibility
smoke (focus order, visible focus, ARIA names, 44px targets).

In sandboxes without the default Playwright browser download, set
`E2E_CHROMIUM=/path/to/chrome` — `playwright.config.ts` honours it.

## 3. Responsive and accessibility behavior

- Verified at 390px (phone), tablet, and desktop. Phone uses the guided Decide stepper
  (ARIA tablist, swipe + keyboard); desktop uses the full progressive-disclosure column.
- Minimum 44px tap targets across step controls, scenario chips, cards, pipeline toolbar.
- Pipeline controls: `role="toolbar"`, roving tabindex, `aria-pressed` (Freeze),
  `aria-expanded` (log), `aria-current="step"` (stage), polite live region.
- Colour is never the only encoding: meters and diagrams dual-encode with pattern/stroke;
  diagrams carry `<title>`/`<desc>`; a colour-blind-safe appearance mode ships.
- Motion is gated on `prefers-reduced-motion`.

## 4. Dependencies

Runtime dependencies material to a port: `jspdf` (decision packet — reference implementation,
the WinAnsi glyph mapping is the part worth porting), Radix/shadcn primitives, Tailwind v4 tokens.
Everything else in `package.json` (TanStack Start, nitro, wrangler, Playwright, Vite) is runtime
scaffold for this generation and is REJECT — do not carry the lockfile, the workflows, or the
router into canonical.

## 5. Security and privacy

- No auth, no database, no analytics, no payments, no remote personal data in this generation.
- No secrets in the repository; `.gitignore` excludes `.env` and `.env.*`.
- All authored state (overlays, presets, appearance, domain, locale, pipeline state) is
  browser-local. `src/routes/admin.tsx` writes `localStorage` only and MUST NOT reach a shared
  runtime without authorisation and server persistence.
- Public `/api/public/*` endpoints: none added by this generation.

## 6. Known limits carried into the port

- Spanish locale coverage is partial — audit strings before exposing the switch publicly.
- Generated imagery (`src/assets/line-tension.jpg`) and SVG diagrams are stand-ins for owned artwork.
- Preset and overlay persistence has no multi-device or server story.
- PDF packet is client-side; canonical should render server-side.

## 7. Cost control

One publication, one generation, one palette, one type system, one image plan. No speculative
variation loops or repeated recolouring were run against this freeze.

## 8. Rollback

Nothing is published, deployed, merged, or connected to a canonical branch, so rollback is
"do not port". If a ported row later regresses canonical: revert that file to its pre-port
state on the canonical branch and re-run the fail-closed checks in `README.md`. The frozen SHA
remains the only reference for a re-port.

## 9. Explicitly not performed

Publishing, custom domains, auth, analytics, payments, database/Supabase, canonical branch merge,
WordPress staging deploy. Each requires separate explicit authorization.
