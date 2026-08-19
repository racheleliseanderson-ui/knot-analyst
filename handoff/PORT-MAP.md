# WordPress / canonical port map

| Generated pattern                 | Canonical destination                            | Notes                                                                                                                          |
| --------------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Two-mode instrument shell         | Template part: `knot-intelligence/shell`         | Mode toggle is a route pair, not tabs; preserve distinct accent per mode (Decide = brass, Diagnose = cold cyan).               |
| Decision Card                     | Block: `hth/decision-card`                       | Print stylesheet required; card must carry engine + catalog version.                                                           |
| Diagnosis Card + evidence trail   | Block: `hth/diagnosis-card`                      | Severity rail colors map to `--destructive` / `--caution` / `--hairline`.                                                      |
| Conflicting constraints           | Block: `hth/tradeoff-list`                       | Left rail + single-dimension alternative line.                                                                                 |
| Counterfactual table              | Block: `hth/counterfactuals`                     | Verdict colors: holds = muted, changes = brass, fail-closed = destructive.                                                     |
| Scenario starters                 | Block: `hth/scenario-grid`                       | One tap must load defaults AND run the model.                                                                                  |
| Token set                         | `theme.json` custom properties                   | oklch tokens in `src/styles.css` are the source of truth.                                                                      |
| Pipeline run controls             | Block: `hth/pipeline-strip`                      | Toolbar pattern: roving tabindex, `aria-pressed` on freeze, `aria-current="step"` on stage. State is session-scoped.           |
| Evidence drilldown                | Block: `hth/evidence-drilldown`                  | Delta bars need a non-colour encoding; keep the plain-text summary as the accessible fallback.                                 |
| Step player + diagrams            | Block: `hth/step-player`                         | Diagrams are inline SVG with `<title>`/`<desc>`; dual-encode colour with stroke pattern. Print variant is linear and ink-safe. |
| Domain switch (Fishing / Boating) | Template part: `knot-intelligence/domain-switch` | Terminology and dimensions come from the domain registry, not from copy in templates.                                          |
| Venue picker                      | Block: `hth/venue-picker`                        | Condition patches must remain declared, never silently applied.                                                                |
| Preset bar                        | Block: `hth/preset-bar`                          | Local-only in this generation; canonical needs a persistence decision first.                                                   |
| Decision packet PDF               | Server-side render                               | jspdf implementation is reference only; WinAnsi glyph mapping is the part worth porting.                                       |
| Admin overlay editor              | NOT PORTED as-is                                 | Requires authorisation and server persistence before it exists in a shared runtime.                                            |

Engine (`src/domain`, `src/data`, `src/engine`) ships as a framework-independent module and must not
be reimplemented in template code.
