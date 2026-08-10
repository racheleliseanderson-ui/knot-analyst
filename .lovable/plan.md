# Material Intelligence + Accessibility Slice

One bounded slice. Fishing stays the only visible domain; Boating stays data-shaped-but-unbuilt.

## Answer to "which artifact first"
The 4-field material model plus the progressive-disclosure config for the existing six Fishing buttons. That is the piece the ranking engine, the future Boating domain, and the deeper intelligence all depend on. Boating connection families come after, once the material axes are proven against a Fishing regression pass.

## What gets built

### 1. Four-axis material model (additive, non-breaking)
A material selection becomes an object with four independent axes:
- fiber (chemistry): nylon, fluorocarbon, UHMWPE, polyester/Dacron, stainless, titanium, aramid, mixed
- construction (geometry): mono, copolymer, fused PE, 4/8/12/16-carrier braid, hollow-core, single-strand wire, 1x7 / 7x7, plus "Not sure"
- treatment: uncoated, fluoro-coated, nylon-coated, coated braid, gel-spun finish
- role (job in the rig): main line, leader, tippet, fly line, backing, shock leader

The existing six angler buttons stay exactly as they are and become presets that resolve to a default axis record. Nothing beyond the first button is required; deeper axes are optional and default to "unspecified".

### 2. Progressive disclosure in the selector
Under Braid, Wire, and Backing only, one optional "What type?" row appears after the button is chosen: carrier count / hollow-core for braid, single-strand vs 7x7 and coating for wire, Dacron vs gel-spun for backing. Every row includes "Not sure", which behaves exactly like today's flat selection. Mono, fluoro, and fly line show no extra row, so the common Fishing path does not get longer.

### 3. Deeper intelligence from the new axes
Constraints and ranking read the axis record instead of the flat enum, with today's behavior as the fallback when axes are unspecified. New reasoning it unlocks:
- slippery-fiber handling: UHMWPE raises wrap-count and seating demands, so conventional knots score lower than they do against a Dacron-equivalent
- hollow-core and heavy wire surface a termination recommendation (splice / crimp / "do not knot this") instead of forcing a knot answer
- coating changes seating and slip sensitivity instead of being invisible
- trade-off and counterfactual text names the axis that drove the call ("hollow-core 12-strand — splice preferred over any knot here")

### 4. Appearance and accessibility switch
The current dark/light toggle becomes a three-way control: Dark, Light, High-contrast / color-blind safe. Color-blind mode swaps verdict and meter hues for a blue/amber safe pair and forces the existing glyph + stroke-pattern dual encoding on everywhere (verdicts, meters, diagram states), not only where it already exists. The choice persists in localStorage alongside the theme key.

Mobile accessibility pass over the changed surfaces only: 44px targets on the new disclosure chips, visible focus rings, the disclosure row announced as a labelled group, and no horizontal overflow at 360px.

## Explicitly out of scope for this slice
Boating domain data, the FISHING | BOATING switch, splice and soft-shackle content authoring, any visual redesign, any strength-percentage claims.

## Technical notes
- `src/domain/material.ts` (new): axis unions, `MaterialSpec`, `PRESET_BY_LINE_MATERIAL`, and `resolveMaterial()` widening a legacy `LineMaterial` into a spec.
- `src/domain/domain.ts`: `KnotDomain` gains optional `materialAxes` so Boating can supply its own construction list later without Fishing rendering it.
- `src/domains/fishing/materials.ts` (new): the six presets plus disclosure options for braid / wire / backing.
- `src/domain/types.ts`: `ChooseInput` gains optional `mainSpec` / `secondarySpec`; `LineMaterial` is untouched.
- `src/engine/constraints.ts`, `src/engine/ranking.ts`, `src/engine/explain.ts`: read the spec when present, fall back to the enum. Existing mechanics profiles stay unchanged; axis effects apply as scored modifiers, not new per-knot data.
- `src/lib/theme.tsx` + `src/styles.css`: `Appearance = dark | light | cb`, with a `.cb` root class overriding signal tokens.
- Regression gate: the Decide inputs used today must produce identical ranking order and identical PDF output when no axes are set.