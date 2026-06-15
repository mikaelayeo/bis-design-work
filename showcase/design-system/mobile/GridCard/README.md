# GridCard

Mobile design-system component for grid layouts (folders, files, photos, uploads). Maps 1:1 to the `M-GridCard` Figma component.

**Figma:** [Mobile · Grid Component](https://www.figma.com/design/kY70hWPhUMF5Cviz8Kseiu/Mobile?node-id=4823-75071)

## What's here

| File | Purpose |
|---|---|
| `index.tsx` | Component + internal `OfflineStatusIcon` subcomponent + full JSDoc |
| `style.ts` | StyleSheet (BIStrainer tokens) |

Drop in `src/components/Common/Foundation/ContentDisplay/GridCard/` in SafeTapp.

## API summary

```ts
<GridCard
  type="default" | "photo" | "error"
  size="base" | "large"               // 115×115 | 177×150 (×1.25 on tablet)
  name="filename.pdf"
  body={...}                           // { kind: 'icon', iconName | customIcon } | { kind: 'image', uri }
  offlineStatus="available" | "unavailable"
  isLoading
  isSkeleton
  selectionMode
  isSelected
  onDismiss / onMore / onPress / onLongPress / onSelectionChange
  disabled
  testID
/>
```

State precedence (top wins):

1. `isLoading` — spinner body, hidden header/footer
2. `isSkeleton` — grey shapes throughout
3. `selectionMode` + `isSelected` — checkbox replaces `more`, `dismiss` hidden, optional pale-blue tint
4. `type` flavor (default / photo / error)

Background precedence: error pink > selected pale blue > default white.

## Before merging — please verify

These were assumed against `theme/`. If anything differs, swap and let me know so I can update the Figma side.

**Tokens used:**

- `Colors.surface.{default, errorLightest, primaryLightest, secondaryLightest}`
- `Colors.icon.{default, defaultInverse, error, primary}`
- `Colors.text.{secondary, defaultOnSurface}`
- `Colors.stroke.defaultLight`
- `Spacing.{xsmall, small}`
- `Radius.{base, medium, rounded}`
- `Typography.{body.small, label.small}`
- `Icons.xlarge`

**FontAwesome 6 Pro icons:**

- `cloud-arrow-down` — offline status
- `xmark` — dismiss
- `ellipsis-vertical` — overflow
- `circle-exclamation` — error body

**Other components referenced:**

- `Indicators/CircleSpinner`
- `InputFields/Checkbox` (uses `state` + `onStateChange` props)
- `CustomIcon`
- `hooks/useSelectionInteractionGuard`

## Known follow-ups

- [ ] **Unit tests** — not included in this drop. Happy to add Button/ListItem-style tests covering state precedence, selection guards, and action visibility rules.
- [ ] **Photo scrim** — currently solid semi-transparent overlay strips (no gradient lib in repo). Upgrade to `expo-linear-gradient` / `react-native-linear-gradient` if/when added.
- [ ] **Offline icon `available` vs `unavailable`** — Figma subcomponent has the prop, but only the "available" visual is fully defined. Confirm the unavailable styling.
- [ ] **Token name drift** — Figma uses `color/surface/error-lighest` (missing `t`). Code uses `errorLightest`. Reconciliation is part of Mika's broader token sweep, not blocking.
- [ ] **`type='error'` + `isSelected`** — not a Figma variant but a real combo (selecting failed uploads). Implemented as: error pink wins for bg, checkmark still shows. Confirm OK.

## Acceptance criteria

- [ ] Renders all 14 Figma variants (7 Type × 2 Size) when given the right prop combinations
- [ ] Tablet scaling adds 25% on both dimensions
- [ ] Long-press enters selection mode via `onSelectionChange(true, 'longPress')`
- [ ] `dismiss` and `more` action pills hit a 44pt touch target via `hitSlop`
- [ ] Caption truncates mid-string (`filename...ed.pdf`) at 1 line

## Questions / discussion

Mika is point of contact on design decisions. The Figma component lives at the link above — feel free to comment there or ping her directly.
