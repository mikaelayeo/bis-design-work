# Admin Page Redesign v2 — Change Spec

**For:** dev applying v2 to the live React build (TKT-19305 follow-up)
**Live source:** `v1/views/bisadmin/src/components/subTabs/` → `Content.js` + `subtabs.less` (`subtabs.variables.less`)
**Prototype:** `showcase/prototypes/admin-redesign/admin-page-redesign-v2.html` (vs v1 `admin-page-redesign.html`)
**Status:** Prototype verified locally, not yet published to hub.

All v2 changes reuse the shipped tokens — no new colors, no new dependencies. Drag-reorder already ships via `react-sortable-hoc` (`tblAdminModuleFavourites.fldSortOrder`); nothing below touches that.

---

## Change 1 — Fill-to-width grid (the main fix)

**Problem:** fixed-width cards + `justify-content:start` leave a ragged dead gap on the right of dense rows (the Microsoft "All apps" anti-pattern). **Fix:** cards stretch to fill the row via `1fr`; `auto-fill`'s phantom tracks stop sparse rows (e.g. 4 Global cards) from ballooning; `aspect-ratio` keeps proportions as width grows.

**Variables**
```less
/* before */  --card-w:156px; --card-h:135px; --grid-gap:12px;
/* after  */  --card-min:156px; --card-ar:156/135; --grid-gap:12px;
```

**.grid**
```less
/* before */ grid-template-columns:repeat(auto-fill, var(--card-w));
/* after  */ grid-template-columns:repeat(auto-fill, minmax(var(--card-min), 1fr));
```

**.card**
```less
/* before */ width:var(--card-w); height:var(--card-h);
/* after  */ aspect-ratio:var(--card-ar); min-height:135px;   /* drop fixed width + height */
```

⚠️ **Do not** use a fixed max like `minmax(156px, 190px)` with `auto-fit` — `auto-fit` counts columns by the max and the right gap comes back. It must be `auto-fill` + `1fr`.

---

## Change 2 — Empty Favourites collapses to a slim strip

**Problem:** an empty Favourites zone renders as a full padded cream box for nothing. **Fix:** when the favourites grid has 0 children, collapse to a one-line prompt.

**CSS (new)**
```less
.fav-empty-line{display:none;}   /* hidden when favourites has items */

.favourites.is-empty{display:flex;align-items:baseline;flex-wrap:wrap;gap:4px 8px;padding:9px 14px;margin-bottom:18px;}
.favourites.is-empty .fav-title{margin:0;font-size:14px;}
.favourites.is-empty .fav-hint,
.favourites.is-empty #fav-grid{display:none;}
.favourites.is-empty .fav-empty-line{display:inline;margin:0;color:#8a7a3a;font-size:13px;}
```

**Markup:** add the prompt line inside the favourites section
```html
<p class="fav-empty-line">— star a module to pin it here.</p>
```

**Logic (React):** toggle `is-empty` on the favourites container whenever the favourites list length changes.
```js
favourites.classList.toggle("is-empty", favCount === 0);   // run on mount + on every add/remove
```

---

## Change 3 — Star is always visible (was hover-only)

**Problem:** hover-reveal star is undiscoverable and dead on touch. **Fix:** star always shows — faint grey at rest, gold when pinned. Mika's call over the live hover behavior.

**.star-btn**
```less
/* before */ opacity:0; transition:opacity .12s ease, background .12s ease, color .12s ease, transform .12s ease;
/* after  */ opacity:1; transition:background .12s ease, color .12s ease, transform .12s ease;
```

**Remove the hover-reveal rule entirely**
```less
/* delete: */ .card:hover .star-btn, .star-btn:focus-visible{opacity:1;}
```
Rest state color stays `--icon-default-light` (grey); `.card.is-fav .star-btn` stays `--icon-warning` (gold).

---

## Change 4 — Responsive layout

**Fluid body padding**
```less
/* before */ .admin-body{padding:16px 48px 48px;}
/* after  */ --body-pad-x:clamp(16px, 5vw, 48px);
             .admin-body{padding:16px var(--body-pad-x) 48px;}
```

**Header shrink-and-scroll** — let the two header bars wrap and the nav scroll instead of overflowing:
- `.gh-top` / `.page-header`: add `flex-wrap:wrap; gap:12px;`
- `.gh-search` / `.ph-search`: add `max-width:100%; flex:1 1 …; min-width:0;`
- `.gh-nav`: add `overflow-x:auto; scrollbar-width:thin; -webkit-overflow-scrolling:touch;` and `white-space:nowrap` on the links
- swap fixed `height` → `min-height` on `.page-header` and `.global-header`

**Phone grid (2-up)**
```less
@media (max-width:480px){
  .grid{grid-template-columns:repeat(2,1fr);gap:10px;}
  .card-icon{font-size:40px;}
  .page-header h1{font-size:20px;line-height:28px;}
}
```

---

## Change 5 — Accessibility

| Item | What to add |
|---|---|
| Skip link | `<a href="#main" class="skip-link">Skip to modules</a>` + `.sr-only`/`.skip-link` styles; `id="main"` on the body `<main>` |
| Star state | `<button class="star-btn" aria-pressed="false" aria-label="Add {name} to favourites">`; on toggle flip `aria-pressed` and swap label to "Remove {name} from favourites" |
| Live region | `<div id="sr-status" class="sr-only" role="status" aria-live="polite">`; announce pin / unpin / reorder ("{name} pinned to Favourites, position 2 of 5.") |
| Landmarks | `role="list"` on each grid + `role="listitem"` on cards; `aria-label` per grid; `aria-current="page"` on active nav |
| Keyboard reorder | `Alt + ←/→` moves a focused favourite; `.card:focus-visible` outline |
| Reduced motion | `@media (prefers-reduced-motion: reduce){ *{transition:none!important;animation:none!important;} .card:hover{transform:none;} }` |

---

## Effort / risk

| Change | Live effort | Risk |
|---|---|---|
| 1 · Fill-to-width grid | ~3 lines `.less` | Low — layout only |
| 2 · Empty strip | small CSS + 1 toggle | Low |
| 3 · Always-on star | 2-line CSS | Low |
| 4 · Responsive | header + media query | Low–med (header markup) |
| 5 · a11y | markup + small JS | Low, additive |

Icons in the prototype are Font Awesome stand-ins; live uses the BIS brand SVGs in the same `.card-icon` slot.

> Note: the "v2 changes" blurb inside the prototype HTML still describes the earlier `auto-fit / minmax(156px,190px)` approach — the shipped prototype CSS is the `auto-fill / 1fr` version above. Follow this spec, not that blurb.
