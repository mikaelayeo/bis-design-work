# Admin Page Redesign — Module Grid & Cards

Redesign of the BIS Admin landing page (module grid, module cards, Favourites section).

**Figma:** [Admin-Page-Redesign — node 16-1882](https://www.figma.com/design/icXfm7BRV2KfZo9BDeDQBu/Admin-Page-Redesign?node-id=16-1882) · **Ticket:** TKT-19305

---

## What's here

| File | What it is |
|---|---|
| `admin-redesign-changes.html` | **Start here.** Dev change reference — old (live) vs new, side-by-side rendered cards + a property-by-property change table with rationale. |
| `admin-page-redesign.html` | Full interactive prototype of the redesigned page. Hover cards, click the ☆ to favourite (move behaviour), resize to see the grid reflow. |

Open either file directly in a browser (no build step). Both load Font Awesome from CDN.

## Key changes (summary)

- **Card:** ~151×140 (grows) → **156×135 fixed**; radius 10px → **8px**; border `#d8dce3` → **`#b2b2b3`** (`stroke/default`).
- **Icon:** ~60px (`fa-5x`) → **45px**.
- **Icon ↔ label gap:** **12px** = `spacing/base` token.
- **Layout:** icon + label centered as one group per card (Google-console style).
- **Label colour:** per-icon colour (varies) → **one blue `#0078b3`**, semibold (`label/small`).
- **Grid:** `space-evenly` → **`auto-fill`, fixed 156px columns, left-aligned, constant 12px gap**.
- **Hover:** keeps the live soft shadow, **adds blue border + 1px lift**.
- **Favourite behaviour:** **unchanged from live** — starring *moves* the module out of its list into Favourites; un-starring returns it.
- **Drag handle:** 2×3 dots, **Favourites section only** (reorder affordance).

## Before building — please verify

- [ ] **Icons are out of scope here.** Prototype uses Font Awesome stand-ins; production should use the BIS brand icons. They drop into the `.card-icon` slot without changing layout.
- [ ] **Exact live label hexes not captured** (Chrome disconnected mid-check). Reference uses the icon colour as representative — confirm against live if documenting precisely.
- [ ] **Gap = 12px** to match Figma (`168−156`). Single value (`--grid-gap`) if it needs adjusting.
- [ ] Token names used: `spacing/base` (12), `radius/medium` (8), `stroke/default` (#b2b2b3), `label/small` (14/18, 600), `surface/warning-lightest` (#fffcf2), `stroke/warning` (#a1851f).

## Notes

- Live page stack: ColdFusion (`.cfm`) + Bootstrap utility classes + CSS Grid + Font Awesome Duotone — no JS framework.
- Favourites "move" reflow + un-favourite return-to-home are demonstrated in the prototype JS (`toFavourites` / `toHome`).

— Mika (Design)
