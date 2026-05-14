# Upload

Mobile design-system component for file uploading. Composes existing primitives — `Button` (CTA), `ListItem` (list rows), `GridCard` (grid tiles) — into one component with a `variant: 'list' | 'grid'` prop.

**Figma:** [Mobile · Upload Components](https://www.figma.com/design/kY70hWPhUMF5Cviz8Kseiu/Mobile?node-id=4615-7297)

## ⚠️ Dev prerequisite — ListItem extension required

List-mode rows need a status indicator (loading spinner or error icon) rendered **alongside** the close X. `ListItem`'s current `trailingContent` is single-type. Please extend `ListItemProps['trailingContent']` to accept an optional `statusIcon` field, rendered to the **left** of the existing trailing element:

```ts
trailingContent?: {
  type: 'radio' | 'checkbox' | 'switch' | 'stepper'
      | 'iconButtons' | 'textButton' | 'chevron'
      | 'text' | 'badge' | 'illustrativeIcon' | 'loading' | 'custom';
  // ... all existing fields unchanged

  /**
   * NEW: Optional status indicator rendered to the LEFT of the main trailing element.
   * Used by Upload list rows to show loading/error state alongside the dismiss button.
   */
  statusIcon?: {
    type: 'loading' | 'error' | 'warning' | 'success';
    iconName?: string;  // optional override
    color?: string;     // optional override
  };
};
```

Render order inside the trailing area: `[statusIcon] [main trailing element]` with `gap: Spacing.medium`.

Default icons by status type (suggested):

| `statusIcon.type` | Default icon            | Default color           |
|-------------------|-------------------------|-------------------------|
| `loading`         | `<CircleSpinner />`     | `Colors.icon.primary`   |
| `error`           | `circle-exclamation`    | `Colors.icon.error`     |
| `warning`         | `triangle-exclamation`  | `Colors.icon.warning`   |
| `success`         | `circle-check`          | `Colors.icon.success`   |

The Upload code has `@ts-expect-error` markers where this field is passed in — once you extend ListItem, remove those markers.

## What's here

| File | Purpose |
|---|---|
| `index.tsx` | Upload component + UploadFile/UploadProps types + JSDoc |
| `style.ts` | StyleSheet (BIStrainer tokens) |

Drop in `src/components/Common/Foundation/InputFields/Upload/` in SafeTapp.

## API summary

```tsx
<Upload
  variant="list" | "grid"
  files={[{ id, name, description?, status?, previewUri?, type?, offlineStatus? }, ...]}
  multiple                                       // default true; false = single-file mode
  accept="any" | "image" | "video" | "file"     // CTA icon + label
  description="Tap or drop. PDF or images."
  onUploadPress={() => openPicker()}
  onRemoveFile={(id) => removeFile(id)}
  disabled
  testID="upload"
/>
```

**State derivation** (no explicit state prop):

| Condition                              | Render                                |
|----------------------------------------|---------------------------------------|
| `files.length === 0`                   | Empty CTA card only                   |
| `multiple && files.length > 0`         | CTA on top + file rows/tiles below    |
| `!multiple && files.length === 1`      | Just the row/tile, no CTA             |

## Grid-mode mapping (uses GridCard)

| File state              | GridCard props                                    |
|-------------------------|---------------------------------------------------|
| `status === 'loading'`  | `isLoading`                                       |
| `status === 'error'`    | `type='error'`                                    |
| has `previewUri`        | `type='photo'`, `body={kind:'image', uri}`        |
| otherwise               | `type='default'`, `body={kind:'icon', iconName}`  |

All grid tiles get `onDismiss` wired to `onRemoveFile`. `offlineStatus` is forwarded as-is.

## Before merging — please verify

**Tokens used:**

- `Colors.surface.{default, secondaryLightestAlt}` — `secondaryLightestAlt` is assumed for Figma's `color/surface/secondary-lightest-2` (#f8f8f9). If the theme doesn't have it, fall back to `secondaryLightest`.
- `Colors.stroke.defaultLight`
- `Colors.text.secondary`
- `Colors.icon.default`
- `Spacing.{xsmall, small, medium}`
- `Radius.base`
- `Typography.body.small`

**FontAwesome 6 Pro icons:**

- `upload` — default CTA
- `image` — image CTA + image file type icon
- `video` — video CTA + video file type icon
- `file-lines` — file CTA + file type icon
- `xmark` — dismiss (per row/tile)

**Other components referenced:**

- `Buttons/Button` — used as the CTA with `variant='secondary', size='small', iconLeading`
- `ContentDisplay/ListItem` — list rows (**requires the extension above**)
- `ContentDisplay/GridCard` — grid tiles (already shipped: `design-system/mobile/GridCard/`)

## Known follow-ups

- [ ] **ListItem `trailingContent.statusIcon` extension** — see top of this README. Blocks merging the list mode.
- [ ] **CTA button shade** — Figma uses `surface/secondary-lighter` (#e2e2e3) but Button's `variant='secondary'` currently uses `surface/secondaryLightest` (#f2f2f2). Slightly lighter. Either add a darker secondary tone to Button, or accept the cosmetic drift.
- [ ] **Action sheet on tap** — Figma shows an "Open camera / Choose photos or files" sheet. That's parent responsibility (open it inside `onUploadPress`). Not part of this component.
- [ ] **Unit tests** — not included. Happy to add tests covering state derivation, accept-type mapping, and the grid mapping table.

## Acceptance criteria

- [ ] `files=[]` shows the CTA card alone (no outer white wrapper)
- [ ] `multiple=true, files.length > 0` shows CTA on top + rows/tiles below, inside a white bordered card
- [ ] `multiple=false, files.length === 1` shows just the row/tile, no CTA
- [ ] List mode renders ListItems with: file icon (leading) · name · description · [status indicator] · X (trailing)
- [ ] Grid mode renders GridCards mapped per the table above
- [ ] CTA button label and icon match the `accept` prop
- [ ] All dismiss buttons call `onRemoveFile(id)`
- [ ] `disabled` greys out the CTA and disables dismiss

## Questions / discussion

Mika is point of contact on design decisions. The Figma component lives at the link above.
