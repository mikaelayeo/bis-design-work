# Likert Scale — Card Layout (v6) — Dev Handoff

A proposed new mobile layout for `Forms/Widgets/LikertScale`. Replaces the
horizontally-scrolling inline grid with stacked statement cards and option
"card" affordances. Designed for narrow phone viewports where the matrix
can't fit cleanly.

**Live preview:** [`index.html`](./index.html)
**Reference comparison:** [`comparison.html`](./comparison.html)
**Draft TSX:** [`components/LikertCardLayout/`](./components/LikertCardLayout/)

---

## TL;DR for dev

- **What changes:** for narrow-portrait viewports, render each statement as
  a vertical card-block instead of a row in the inline grid. Options become
  tappable cards in a 2- or 3-column grid.
- **New component:** `components/LikertCardLayout/` — drop-in alongside the
  existing `renderInlineGrid()` / `renderRow()` paths in
  `LikertScale/index.tsx`.
- **Uses existing primitives:** `Common/Foundation/Messaging/Tooltip`
  (variant `"light"`), `Common/Foundation/InputFields/Radio` is **not**
  needed here (the card *is* the radio).
- **Two type additions:** `ILikertOption.tooltipinfo?: string` and a new
  layout threshold/flag.
- **Behavior parity:** statement-level tooltip behavior mirrors the existing
  matrix (one shared `<Tooltip>`, anchor-ref-based). Per-option tooltips
  are new.

---

## What's new vs. today

| Today (inline grid) | Card layout |
|---|---|
| Horizontal scroll for option header row | No horizontal scroll — options wrap in a 2/3-col grid |
| Statement-level tooltip only | Per-option tooltip also (NEW) |
| Radio component per cell | Whole card is the radio |
| Single shared `<Tooltip>` per widget | **Same pattern preserved** |
| Comment-on-select via `comments[`${dbid}-${optionDbid}`]` | **Same — unchanged** |

The statement-level tooltip continues to use the existing `comments` config
and `column.tooltipinfo` field. Only the option-level tooltip requires the
type extension.

---

## When to render this layout

Add a new branch in `LikertScale/index.tsx` alongside `useInlineGrid`:

```ts
// Existing (line ~143):
const useInlineGrid =
  screenContext.isPortrait &&
  visibleOptions.length > 0 &&
  visibleOptions.length <= INLINE_GRID_OPTION_THRESHOLD;

// Proposed: render the card layout when on a narrow portrait phone.
// 600dp matches the `isTypeTablet` threshold in theme/sizes/spacing.ts,
// so this is "phones get cards, tablets keep the inline grid / matrix".
const useCardLayout =
  screenContext.isPortrait && !screenContext.isTypeTablet;
```

Branch order in the JSX render:

```tsx
{useCardLayout ? (
  <LikertCardLayout ... />
) : useInlineGrid ? (
  renderInlineGrid()
) : (
  // existing fallback (portrait dropdown OR landscape radios)
)}
```

**Open for product/dev review:**
- Should we ship card layout as the default for ALL phones, or behind a
  feature flag for a single client?
- Should the threshold be a hard `isTypeTablet`, or width-based (e.g.
  `windowWidth < 600`)?

---

## Token mapping

The prototype's CSS variables map 1:1 to SafeTapp theme tokens. Use these
in `style.ts` when porting.

| CSS variable (prototype) | SafeTapp token | Value (phone) |
|---|---|---|
| `--text` | `Colors.text.default` (`neutrals[900]`) | `#191919` |
| `--text-muted` | `Colors.text.secondary` (`neutrals[600]`) | `#666666` |
| `--surface` | `Colors.surface.default` (`neutrals[0]`) | `#FEFFFF` |
| `--card-bg` | `Colors.surface.secondarySubtle` (`neutrals[50]`) | `#F8F8F9` |
| `--selected` | `Colors.surface.primary` (`blue[500]`) | `#0078B3` |
| `--on-surface` | `Colors.text.defaultOnSurface` (`neutrals[0]`) | `#FEFFFF` |
| `--stroke` | `Colors.stroke.default` (`neutrals[300]`) | `#B2B2B3` |
| `--stroke-light` | `Colors.stroke.defaultLight` (`neutrals[150]`) | `#E5E5E6` |
| `--icon-primary` | `Colors.icon.primary` (`blue[400]`) | `#009ACB` |
| `--icon-alt` | `Colors.icon.defaultAlt` (`neutrals[0]`) | `#FEFFFF` |

Typography / spacing / radius:

| Property | Token | Value (phone) |
|---|---|---|
| Statement label | `Typography.label.base` | `16/24`, weight 600 |
| Option label | `Typography.body.base` | `16/24`, weight 400 |
| Tooltip body | `Typography.body.base` | `16/24`, weight 400 |
| Gap: number → label | `Spacing.xsmall` | `4` |
| Gap: label → info icon | `Spacing.xsmall` | `4` |
| Option grid gap | `Spacing.small` | `8` |
| Option card padding (vertical) | `Spacing.base` | `12` |
| Option card padding (horizontal) | `Spacing.large` | `22` *(reserves space for info zone)* |
| Card corner radius | `Radius.base` | `4` |
| Card-block bottom separator | `Colors.stroke.defaultLight` | `#E5E5E6` |
| Info icon size (statement) | — | `15px` |
| Info icon size (option) | — | `14px` |
| Info zone width (tap target) | — | `44px` |

---

## Tooltip behavior

Uses the existing `<Tooltip>` component from
`Common/Foundation/Messaging/Tooltip` with `variant="light"` (matches the
matrix's tooltip styling).

**Architecture (matches existing matrix exactly):**

```tsx
const [openTipKey, setOpenTipKey] = useState<string | null>(null);
const [openTipText, setOpenTipText] = useState('');
const anchorRefs = useRef<Record<string, View | null>>({});
const activeAnchorRef = useRef<View | null>(null);

// ...
<Tooltip
  visible={openTipKey !== null}
  targetRef={activeAnchorRef}
  onDismiss={dismissTooltip}
  variant="light"
>
  <Text style={styles.tooltipText}>{openTipText}</Text>
</Tooltip>
```

- One shared `<Tooltip>` instance per widget
- Anchor switches via `activeAnchorRef.current = anchorRefs.current[key]`
- Tooltip self-positions above/below with hysteresis (built-in)
- **No internal timer** — dismiss only via `onDismiss` (backdrop tap) or
  tapping the same icon again

---

## Interaction matrix

| Trigger | Selection | Tooltip | Notes |
|---|---|---|---|
| Tap card body | toggle | — | Standard radio behavior |
| Tap right-side info zone | toggle | show | Combined affordance — see rationale below |
| Tap info zone on already-selected card | deselect | hide | Toggle off |
| Tap info zone on different option (same statement) | switch (deselects other) | show new | One selection per statement |
| Tap statement (i) icon | — | show | Statement-level info |
| Tap backdrop | — | hide | Selection unchanged |
| Tap currently-active anchor | — | hide | Toggle off |
| Time passes | — | — | **No auto-dismiss** (matches real Tooltip) |

**Why "tap info zone also selects" (vs. tooltip-only):** the info zone is
visually inside the card. If tapping it did *not* select, the icon zone
would become a confusing "dead spot" inside an otherwise-tappable card.
Combined behavior is consistent with "tap anywhere on the card to select"
while still surfacing the help text.

---

## Required type changes

In `src/components/Forms/Widgets/LikertScale/types.ts`, extend
`ILikertOption`:

```ts
export interface ILikertOption {
  id: number;
  dbid: number;
  label?: string;
  tooltipinfo?: string;  // NEW — per-option tooltip text (card layout only)
}
```

This is additive and backwards-compatible — existing matrix renders simply
ignore the field.

---

## Card structure (per statement)

```
┌─ card-block ─────────────────────────────────┐
│  1.  Accessible laws and regulations? ⓘ      │   ← Typography.label.base, weight 600
│                                              │
│  ┌──────────────┐  ┌──────────────┐         │
│  │  Compliant ⓘ │  │  Non-...   ⓘ │         │   ← option cards
│  └──────────────┘  └──────────────┘         │     - Radius.base (4)
│  ┌──────────────┐  ┌──────────────┐         │     - bg: surface.secondarySubtle
│  │   N/I      ⓘ │  │   N/A      ⓘ │         │     - selected: surface.primary
│  └──────────────┘  └──────────────┘         │
│                                              │
└──────────────────────────────────────────────┘
   ↑ bottom border: stroke.defaultLight
```

**Option card anatomy:**

```
┌──────────────────────────────────────┐  ← border: stroke.default, Radius.base
│                                  ⓘ  │  ← info icon: 14px, icon.primary
│            Compliant                 │     (icon.defaultAlt when selected)
│                                      │
└──────────────────────────────────────┘
 │←——————— centered label ——————————→│
 │←——————— padding L: Spacing.large
                                       │←— info zone: 44px wide
```

The 44px right-side info zone is the **tap target** for the tooltip. The
visible icon (14px) is the affordance. Padding-left/right on the card body
reserves layout space so the centered label doesn't visually clip into the
icon.

---

## Accessibility

| Element | role | label | state |
|---|---|---|---|
| Option card | `radio` | `option.label` | `{ checked, disabled }` |
| Info zone | `button` | `"More information about {option.label}"` | — |
| Statement icon | `button` | `"More information about {statement.label}"` | — |
| Tooltip body | — | (via Tooltip's existing handling) | — |

Statement number prefix ("1. ") is part of the visible text; consider
whether screen reader users benefit (vs. structural numbering via list
semantics). Recommended: keep as text for parity with the visual.

---

## File listing

- [`index.html`](./index.html) — live HTML prototype (open in browser)
- [`README.md`](./README.md) — this doc
- [`comparison.html`](./comparison.html) — what's faithful to code vs.
  prototype-only (helps avoid copying simplified prototype patterns)
- [`components/LikertCardLayout/`](./components/LikertCardLayout/)
  - `index.tsx` — draft React Native component
  - `style.ts` — StyleSheet using real theme tokens
  - `types.ts` — type extensions

---

## Open questions for dev

1. **Layout switch threshold** — `isTypeTablet` boundary, or width-based?
2. **Per-option tooltips** — should `tooltipinfo` come from PM-configurable
   form definitions, or is it always a fixed help text per scale?
3. **Combined select+show on info zone** — confirm the UX (it's a
   deliberate design call; see rationale above)
4. **Animation parity** — the existing Tooltip already animates in/out;
   the card transitions (selected state, comment box appearance) can use
   the same `Animated` timing for consistency. Worth doing now or defer?
