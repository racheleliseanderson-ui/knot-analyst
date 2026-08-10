# WordPress / canonical port map

| Generated pattern | Canonical destination | Notes |
| --- | --- | --- |
| Two-mode instrument shell | Template part: `knot-intelligence/shell` | Mode toggle is a route pair, not tabs; preserve distinct accent per mode (Decide = brass, Diagnose = cold cyan). |
| Decision Card | Block: `hth/decision-card` | Print stylesheet required; card must carry engine + catalog version. |
| Diagnosis Card + evidence trail | Block: `hth/diagnosis-card` | Severity rail colors map to `--destructive` / `--caution` / `--hairline`. |
| Conflicting constraints | Block: `hth/tradeoff-list` | Left rail + single-dimension alternative line. |
| Counterfactual table | Block: `hth/counterfactuals` | Verdict colors: holds = muted, changes = brass, fail-closed = destructive. |
| Scenario starters | Block: `hth/scenario-grid` | One tap must load defaults AND run the model. |
| Token set | `theme.json` custom properties | oklch tokens in `src/styles.css` are the source of truth. |

Engine (`src/domain`, `src/data`, `src/engine`) ships as a framework-independent module and must not
be reimplemented in template code.
