# BIStrainer Design System — Color Tokens

Source of truth: [BIStrainer_UI Library & Guide](https://www.figma.com/design/sYqKFiF1879GNNITzqd8qC/BIStrainer_UI-Library-Guide) (Figma) — [Token Documentation frame](https://www.figma.com/design/sYqKFiF1879GNNITzqd8qC/BIStrainer_UI-Library-Guide?node-id=5492-2768). Pulled directly from the file's `global` (primitives) and `semantic` (aliased tokens) variable collections. This doc reflects the **current live state** — treat it as the token reference to build against, not a history of how it got here.

Machine-readable version: [`bistrainer-color-tokens.json`](bistrainer-color-tokens.json) in this same folder.

---

## Recent Changes

Not a full history — just what's different from what you may have already built against.

**Added**
- `color/surface/background` — separates page canvas background from component surfaces (previously both used `surface/default`)
- `color/text/on-surface-light` — guarantees dark text on yellow/orange surfaces
- `color/icon/on-surface-light` — guarantees dark icons on yellow/orange surfaces

**Updated**
- Gray primitives (`150`–`700`, `900`) — shifted to a subtler "½ cool" undertone; anchors `100`/`800` unchanged
- `orange/100` — corrected from a broken `#FFFFDD` to `#FFDEAB` (was breaking the ramp)
- `-dark`/`-darker`/`-darkest` step pattern — standardized to `600→700→800` across every color role (was inconsistent per hue)
- `surface/default` (Dark mode only) — now `grays/800` instead of `grays/900`, for better component contrast
- `primary-light`, `success-light`, `error-light` (Dark mode only) — remapped from the `/300` step to `/400` (previously identical to their Light values)
- `surface/overlay`, `icon/default-inverse` — rebound to the current `grays/900`/`grays/000` variables (previously hardcoded to stale hex)
- `icon/default-alt` — rebound to `grays/000` in Light mode (previously a stray `Neutrals/white` alias); Dark mode now `grays/900` (previously matched Light at `grays/000`)
- `text/secondary-light`, `text/disabled`, `stroke/default`, `icon/default-light`, `surface/disabled-dark` (Dark mode only) — remapped from `grays/300` to `grays/600`, previously identical to their Light values
- Figma's semantic documentation frame now sets explicit Dark mode on all 114 swatches — previously some silently defaulted to their Light value rather than a real Dark resolution

**Removed**
- None this revision.

**Reverted**
- `notice-light`, `warning-light` (Dark mode only) — briefly remapped to `/400` in the prior revision, now confirmed to intentionally stay constant at `/300` (same as Light) for accessible light surfaces. `primary-light`/`success-light`/`error-light` keep their `/400` Dark remap.

---

## Primitives

Raw `colour/*` ramps, `000` (lightest) → `900` (darkest). Never used directly in product — semantic tokens below alias these.

| Step | grays | red | orange | yellow | green | blue | indigo | violet |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 000 | `#FEFEFE` | `#FFF2F2` | `#FFFAF2` | `#FFFCF2` | `#FAFFF2` | `#F8FEFF` | `#F2F7FF` | `#FBF2FF` |
| 025 | `#FBFBFB` | `#FEE3E3` | `#FFF3E1` | `#FDF5D9` | `#EBF8D6` | `#F0F9FE` | `#E5EDFB` | `#F5E7FB` |
| 050 | `#F8F8F8` | `#FDD4D4` | `#FFECCF` | `#FCEFC1` | `#DDF1BA` | `#C9EFFA` | `#D9E4F8` | `#EEDCF7` |
| 100 | `#F2F2F2` | `#FBB7B7` | `#FFDEAB` | `#F9E291` | `#C2E387` | `#A1E2F6` | `#C1D2F0` | `#E1C8EE` |
| 150 | `#DFDFE2` | `#F99A9A` | `#FFD086` | `#F5D561` | `#ABD559` | `#7BD7F1` | `#AAC1E9` | `#D5B4E6` |
| 200 | `#C9C9CE` | `#F77E7E` | `#FFC162` | `#F2C934` | `#97C730` | `#56CBEC` | `#94B1E2` | `#CAA1DE` |
| 300 | `#AFAFB5` | `#E95B5B` | `#F6A62F` | `#E8B203` | `#6BAC00` | `#26B1DC` | `#7092CE` | `#B181C9` |
| 400 | `#96969D` | `#DA3D3D` | `#EA8D00` | `#C29C14` | `#399300` | `#009ACB` | `#5378BB` | `#9B66B5` |
| 500 | `#7C7C82` | `#CC2222` | `#C37900` | `#A1851F` | `#167B00` | `#0078B3` | `#3D63A7` | `#815099` |
| 600 | `#636368` | `#A43232` | `#9C6300` | `#816D24` | `#016200` | `#095F8C` | `#2F4F87` | `#693E7E` |
| 700 | `#4C4C4F` | `#7C3838` | `#754C00` | `#615424` | `#00410B` | `#0D476D` | `#233C67` | `#512F62` |
| 800 | `#333333` | `#553232` | `#4E3400` | `#41391E` | `#00310E` | `#0E324E` | `#182947` | `#3A2147` |
| 900 | `#19191A` | `#2D1212` | `#271B00` | `#201D12` | `#00190A` | `#0C1E2F` | `#0E1728` | `#23142B` |

---

## Semantic Tokens

### Text

| Token | Light | Dark |
| --- | --- | --- |
| `color/text/default` | `#19191A` | `#FEFEFE` |
| `color/text/default-on-surface` | `#FEFEFE` | `#19191A` |
| `color/text/on-surface-light` | `#19191A` | `#19191A` — same both modes |
| `color/text/primary` | `#0078B3` | `#7BD7F1` |
| `color/text/primary-on-surface` | `#F0F9FE` | `#0E324E` |
| `color/text/primary-alt` | `#3D63A7` | `#AAC1E9` |
| `color/text/primary-alt-on-surface` | `#E5EDFB` | `#182947` |
| `color/text/primary-alt-on-surface-deep` | `#AAC1E9` | `#3D63A7` |
| `color/text/secondary` | `#636368` | `#F2F2F2` |
| `color/text/secondary-light` | `#AFAFB5` | `#636368` |
| `color/text/secondary-on-surface` | `#FBFBFB` | `#333333` |
| `color/text/success` | `#167B00` | `#ABD559` |
| `color/text/success-on-surface` | `#EBF8D6` | `#00310E` |
| `color/text/error` | `#CC2222` | `#F99A9A` |
| `color/text/error-on-surface` | `#FEE3E3` | `#553232` |
| `color/text/notice` | `#9C6300` | `#FFDEAB` |
| `color/text/notice-on-surface` | `#FFF3E1` | `#4E3400` |
| `color/text/warning` | `#816D24` | `#F9E291` |
| `color/text/warning-on-surface` | `#FDF5D9` | `#41391E` |
| `color/text/disabled` | `#AFAFB5` | `#636368` |

### Surface

| Token | Light | Dark |
| --- | --- | --- |
| `color/surface/default` | `#FEFEFE` | `#333333` |
| `color/surface/default-inverse` | `#19191A` | `#FEFEFE` |
| `color/surface/background` | `#F8F8F8` | `#19191A` |
| `color/surface/disabled` | `#F2F2F2` | `#636368` |
| `color/surface/disabled-dark` | `#AFAFB5` | `#636368` |
| `color/surface/primary` | `#0078B3` | `#7BD7F1` |
| `color/surface/primary-light` | `#26B1DC` | `#009ACB` |
| `color/surface/primary-lighter` | `#F0F9FE` | `#0E324E` |
| `color/surface/primary-lightest` | `#F8FEFF` | `#0C1E2F` |
| `color/surface/primary-dark` | `#095F8C` | `#A1E2F6` |
| `color/surface/primary-darker` | `#0D476D` | `#C9EFFA` |
| `color/surface/primary-darkest` | `#0E324E` | `#F0F9FE` |
| `color/surface/primary-alt` | `#3D63A7` | `#AAC1E9` |
| `color/surface/primary-alt-light` | `#94B1E2` | `#5378BB` |
| `color/surface/primary-alt-lighter` | `#E5EDFB` | `#182947` |
| `color/surface/primary-alt-lightest` | `#F2F7FF` | `#0E1728` |
| `color/surface/primary-alt-dark` | `#2F4F87` | `#C1D2F0` |
| `color/surface/primary-alt-darker` | `#233C67` | `#D9E4F8` |
| `color/surface/primary-alt-darkest` | `#182947` | `#E5EDFB` |
| `color/surface/secondary` | `#636368` | `#F2F2F2` |
| `color/surface/secondary-light` | `#96969D` | `#C9C9CE` |
| `color/surface/secondary-lighter` | `#DFDFE2` | `#7C7C82` |
| `color/surface/secondary-lightest` | `#F2F2F2` | `#636368` |
| `color/surface/secondary-subtle` | `#F8F8F8` | `#4C4C4F` |
| `color/surface/success` | `#167B00` | `#ABD559` |
| `color/surface/success-light` | `#6BAC00` | `#399300` |
| `color/surface/success-lighter` | `#EBF8D6` | `#00310E` |
| `color/surface/success-lightest` | `#FAFFF2` | `#00190A` |
| `color/surface/success-dark` | `#016200` | `#C2E387` |
| `color/surface/success-darker` | `#00410B` | `#DDF1BA` |
| `color/surface/success-darkest` | `#00310E` | `#EBF8D6` |
| `color/surface/error` | `#CC2222` | `#F99A9A` |
| `color/surface/error-light` | `#E95B5B` | `#DA3D3D` |
| `color/surface/error-lighter` | `#FEE3E3` | `#553232` |
| `color/surface/error-lightest` | `#FFF2F2` | `#2D1212` |
| `color/surface/error-dark` | `#A43232` | `#FBB7B7` |
| `color/surface/error-darker` | `#7C3838` | `#FDD4D4` |
| `color/surface/error-darkest` | `#553232` | `#FEE3E3` |
| `color/surface/notice` | `#C37900` | `#FFD086` |
| `color/surface/notice-light` | `#F6A62F` | `#F6A62F` — same both modes |
| `color/surface/notice-lighter` | `#FFF3E1` | `#4E3400` |
| `color/surface/notice-lightest` | `#FFFAF2` | `#271B00` |
| `color/surface/notice-dark` | `#9C6300` | `#FFDEAB` |
| `color/surface/notice-darker` | `#754C00` | `#FFECCF` |
| `color/surface/notice-darkest` | `#4E3400` | `#FFF3E1` |
| `color/surface/warning` | `#A1851F` | `#F5D561` |
| `color/surface/warning-light` | `#E8B203` | `#E8B203` — same both modes |
| `color/surface/warning-lighter` | `#FDF5D9` | `#41391E` |
| `color/surface/warning-lightest` | `#FFFCF2` | `#201D12` |
| `color/surface/warning-dark` | `#816D24` | `#F9E291` |
| `color/surface/warning-darker` | `#615424` | `#FCEFC1` |
| `color/surface/warning-darkest` | `#41391E` | `#FDF5D9` |
| `color/surface/overlay` | `#19191B40` | `#19191B40` — same both modes ⚠ still one gray-revision stale, see Notes |

### Stroke

| Token | Light | Dark |
| --- | --- | --- |
| `color/stroke/default` | `#AFAFB5` | `#636368` |
| `color/stroke/default-light` | `#DFDFE2` | `#7C7C82` |
| `color/stroke/default-lighter` | `#F8F8F8` | `#4C4C4F` |
| `color/stroke/default-dark` | `#4C4C4F` | `#F8F8F8` |
| `color/stroke/primary` | `#009ACB` | `#56CBEC` |
| `color/stroke/primary-light` | `#7BD7F1` | `#0078B3` |
| `color/stroke/primary-lighter` | `#C9EFFA` | `#0D476D` |
| `color/stroke/primary-alt` | `#5378BB` | `#94B1E2` |
| `color/stroke/primary-alt-light` | `#AAC1E9` | `#3D63A7` |
| `color/stroke/primary-alt-lighter` | `#D9E4F8` | `#233C67` |
| `color/stroke/success` | `#399300` | `#97C730` |
| `color/stroke/success-light` | `#C2E387` | `#016200` |
| `color/stroke/success-lighter` | `#DDF1BA` | `#00410B` |
| `color/stroke/error` | `#CC2222` | `#F99A9A` |
| `color/stroke/error-light` | `#F99A9A` | `#CC2222` |
| `color/stroke/error-lighter` | `#FDD4D4` | `#7C3838` |
| `color/stroke/notice` | `#C37900` | `#FFD086` |
| `color/stroke/notice-light` | `#FFD086` | `#C37900` |
| `color/stroke/notice-lighter` | `#FFECCF` | `#754C00` |
| `color/stroke/warning` | `#A1851F` | `#F5D561` |
| `color/stroke/warning-light` | `#F9E291` | `#816D24` |
| `color/stroke/warning-lighter` | `#FCEFC1` | `#615424` |

### Icon

| Token | Light | Dark |
| --- | --- | --- |
| `color/icon/default` | `#4C4C4F` | `#F8F8F8` |
| `color/icon/default-light` | `#AFAFB5` | `#636368` |
| `color/icon/default-inverse` | `#FEFEFE80` | `#333333` |
| `color/icon/default-alt` | `#FEFEFE` | `#19191A` |
| `color/icon/on-surface-light` | `#333333` | `#333333` — same both modes |
| `color/icon/primary` | `#009ACB` | `#56CBEC` |
| `color/icon/primary-inverse` | `#7BD7F1` | `#0078B3` |
| `color/icon/primary-alt` | `#5378BB` | `#94B1E2` |
| `color/icon/primary-alt-inverse` | `#AAC1E9` | `#3D63A7` |
| `color/icon/secondary` | `#636368` | `#F2F2F2` |
| `color/icon/secondary-inverse` | `#C9C9CE` | `#96969D` |
| `color/icon/success` | `#167B00` | `#ABD559` |
| `color/icon/success-inverse` | `#C2E387` | `#016200` |
| `color/icon/error` | `#CC2222` | `#F99A9A` |
| `color/icon/error-inverse` | `#F77E7E` | `#DA3D3D` |
| `color/icon/notice` | `#C37900` | `#FFD086` |
| `color/icon/notice-inverse` | `#FFC162` | `#EA8D00` |
| `color/icon/warning` | `#C29C14` | `#F2C934` |
| `color/icon/warning-inverse` | `#F5D561` | `#A1851F` |

---

## Notes

- **Dark-mode confidence:** Figma's documentation frame still only exposes one resolved mode at a time to external tools, so Dark-mode values above aren't independently re-pulled live. As of 2026-07-24, design set explicit Dark mode on all 114 semantic swatches (previously some silently defaulted to their Light value) and hand-confirmed every remap — including the darker/darkest tier that was previously marked as a derived guess. Everything above is now design-confirmed, with one exception:
- **`surface/overlay` is still stale:** it shows `#19191B40`, which is the *previous* gray revision's `grays/900` — the current value is `#19191A`. Design's intent is a constant "Black @ 25%" scrim, but the literal hex hasn't caught up to the latest gray shift. Flagged back to design, not yet fixed.
- **Accessibility:** all key text/surface pairings pass WCAG AA. `text/disabled` is intentionally below AA (2.16:1) — used specifically to communicate a disabled state, not for readable content. Yellow/orange surfaces use the dedicated `on-surface-light` tokens above to guarantee contrast rather than the general on-surface tokens.
- **`surface/default-alt`, `stroke/secondary`, `stroke/secondary-lighter`, `icon/disabled`, `surface/transparent`** are also valid, in-use tokens not shown above (not part of the `semantic` variable collection pull) — keep using them as-is.

---

## Dev access via Figma

- **Direct link:** https://www.figma.com/design/sYqKFiF1879GNNITzqd8qC/BIStrainer_UI-Library-Guide
- **Dev Mode:** open the file with a Dev Mode seat, toggle the mode switcher (Light/Dark) on the `semantic` collection to inspect resolved values per component, and use the Inspect panel to copy CSS variables directly.
- **Figma MCP (for AI-assisted dev tooling):** if your Claude/Cursor/etc. setup has the official Figma MCP server connected, this same variable data can be pulled programmatically — `get_variable_defs` for a given node, or a Dev Mode plugin script against `figma.variables.getLocalVariableCollectionsAsync()` for a full raw dump.
