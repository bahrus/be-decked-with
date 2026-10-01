# Add Support For Programmatic Attachment

## Bruce's Ask

Can you please follow the example of [be-persistent](https://github.com/bahrus/be-persistent) and [the addendum](../types/ImportantEnhancementAddendum.md) to add demos and adjust be-decked-with.js as needed and add def.js to support programmatic attachment of this enhancement?

Please add your implementation notes below.

## Implementation Notes (Claude)

All 8 Playwright tests pass: the 4 existing tests plus 4 new ones under `tests/Programmatic/`.

### New files

- `def.js`: `defBeDeckedWith(ref)`. It's the same formulaic shape as be-persistent's: it loads `emc.json`, sets `spawn` to the class, copies `customData` onto `enhConfig`, and pushes to `(ref?.customElementRegistry ?? customElements).enhancementRegistry`.
- `demo/Programmatic/`: `DeclarativeInSequence.html`, `DeclarativeOutOfSequence.html`, `Imperative.html`. The imperative demo shows all three ways in: the template element, a `WeakRef` to it, and `src`.
- `tests/Programmatic/`: one fixture and spec per demo, plus `TemplateGC.html` / `.spec.mjs` (addendum item 7.6). I checked that the GC test **fails** when the template isn't weakened, and passes when it is.

### Changes to `be-decked-with.js`

- `init` now takes `ctx` and reads `ctx.emc || ctx.config` (addendum item 2). The static `import emc from './emc.json'` is gone. It awaits `roundabout`, then sets `self.initialized = true` (item 1).
- `act`:
  - accepts `template` as an element or a `WeakRef` (item 7).
  - returns early if `resolved` is already set, or if the template has been collected.
  - after wrapping, writes `template` back as a `WeakRef`, so a decked element doesn't keep its template alive (items 7.1/7.2).

### Changes to `emc.mjs` / `😶‍🌫️.mjs` (JSON rebuilt)

- **`enhKey` renamed** from `BeDeckedWith` to `beDeckedWith`, to match be-persistent. That gives `el.enh.set.beDeckedWith`. Note: on the attribute path, the instance also moves from `el.enh.BeDeckedWith` to `el.enh.beDeckedWith`.
- **Compacts changed to actions.** The three `when_X_changes_call_Y` compacts are now `actions` with `ifAllOf: ['enhancedElement', X]` and `ifNoneOf: ['resolved']`. Two problems made this necessary:
  1. Compacts only fire on *change*. With `enh.get(emc).template = t` (or in-sequence `enh.set`), the value is assigned before the async `roundabout()` finishes. roundabout keeps the value (its "rescued" props), but no compact ever fires. Actions are also evaluated once at init, so they pick the value up.
  2. At that initial evaluation, `enhancedElement` isn't set yet; it arrives afterwards via `initialPropVals`. So each action has to list `enhancedElement` as a dependency, or it never re-runs.
- **`😶‍🌫️.mjs` now includes `customData`.** It previously had none. The emoji variant only worked because the old `init` ignored `ctx` and read the statically imported `emc.json`. Once `init` read `ctx.emc`, the existing `remote-with-emoji` test failed until I added `customData`.

### Other changes

- `package.json`:
  - Added `assign-gingerly@0.0.97` as a direct dependency. Before, the only copy was 0.0.87, pulled in through mount-observer, and that version doesn't have the `whenDefined` deferral that out-of-sequence `enh.set` needs.
  - Added an `exports` map that includes `./def.js`, plus `types`.
  - Fixed `main`, which pointed at a nonexistent `index.js`.
- `types/be-decked-with/types.d.ts`: `template` is now an end-user prop (`HTMLTemplateElement | WeakRef<HTMLTemplateElement>`). Added `initialized`, and fixed the undefined `BAP` references in `Actions`. Note that this file lives in the `types` submodule.
- `README.md`: added a "Programmatic attachment (no attribute)" section after the attribute examples, following addendum item 6.

### Open points

- I deliberately did not give `path` (the template id) an element-accepting twin like `pathElement`. `template` already fills that role.
- The `mount-observer` dependency is still needed, because `path` lazily imports `mount-observer/upShadowSearch.js`. Callers who use `template` or `src` never load it.

