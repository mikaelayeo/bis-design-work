# bisComponents (Web) — Token Diff vs. Source of Truth

Comparing [`src/libs/colors/colors.ts`](https://github.com/BISTrainingSolutions/bisComponents/blob/main/src/libs/colors/colors.ts) (+ `src/libs/theme/light.ts` / `dark.ts`) in the bisComponents repo against [`token-changelog.md`](token-changelog.md) / [`bistrainer-color-tokens.json`](bistrainer-color-tokens.json) in this folder. Checked 2026-07-24.

**Important: web's bugs are not the same as mobile's bugs.** Both repos' primitives are byte-identical (same old pre-changelog snapshot — they clearly forked from the same source), but the semantic aliases have drifted independently since. Don't assume the [mobile diff](mobile-token-diff.md) fix list applies here — several tokens that are wrong on mobile are already correct on web, and vice versa.

---

## 1. Structural gaps

- **No `/025` primitive step at all** — same gap as mobile. Web's scale is `0,50,100,150...900`; the source of truth is `000,025,050,100...900`.
- **Dark mode exists only as a thin "palette" layer, not the full token set.** `theme/light.ts` / `theme/dark.ts` each define ~17 keys (`primary`, `secondary`, `background`, `border`, `text`, `textInverse`, `gray`, `blue`, `navy`, `yellow`, `orange`, `red`, `green`, etc.) — not the text/surface/stroke/icon structure that `colors.ts` (and the source of truth) actually define. So there's a dark-mode *concept* here that mobile doesn't have, but it doesn't cover anywhere near the full token set. Worth deciding whether to extend this palette layer or replace it with a proper light/dark pair per semantic token.
- **A `base` primitive exists** (`0: #FFFFFF`, `900: #000000`) — literal pure black/white, not part of the `neutrals`/`grays` ramp and not present in Figma or mobile. Flag to design: intentional, or legacy cruft to retire?

## 2. Primitive values to update

Identical list to mobile's — same stale snapshot:

| Primitive | Web has | Should be |
| --- | --- | --- |
| `grays/*` (150, 200, 300, 400, 500, 600, 700, 900, 000, 050) | old pre-changelog ramp | current "½ cool" ramp — only `grays/100` and `grays/800` anchors are still correct |
| `red/900` | `#2D2121` | `#2D1212` |
| `yellow/300` | `#E2B203` | `#E8B203` |
| `green/700` | `#004A0B` | `#00410B` |
| `blue/000` | `#F2FCFF` | `#F8FEFF` |

**Already correct, no change needed:** `orange/100` (`#FFDEAB`).

## 3. Semantic alias corrections (web-specific — different from mobile's list)

| Token | Web aliases to | Should alias to |
| --- | --- | --- |
| `text/secondary-light` | grays/400 | grays/300 |
| `text/notice` | orange/500 | orange/600 |
| `text/warning` | yellow/500 | yellow/600 |
| `surface/primary-lighter` | blue/050 | blue/025 |
| `surface/primary-alt-light` | indigo/300 | indigo/200 |
| `surface/primary-alt-lighter` | indigo/100 | indigo/025 |
| `surface/success-lighter` | green/050 | green/025 |
| `surface/error-lighter` | red/050 | red/025 |
| `surface/notice-lighter` | orange/050 | orange/025 |
| `surface/warning-lighter` | yellow/050 | yellow/025 |
| `stroke/primary` | blue/500 | blue/400 |
| `stroke/primary-alt` | indigo/500 | indigo/400 |
| `stroke/success` | green/500 | green/400 |
| `stroke/notice` | orange/400 | orange/500 |
| `icon/primary` | blue/500 | blue/400 |
| `icon/primary-alt` | indigo/500 | indigo/400 |
| `icon/notice` | orange/400 | orange/500 |

**Already correct on web (unlike mobile):** `text/primary-alt` (indigo/500 ✓), `stroke/primary-lighter` (blue/050 ✓), `icon/warning` (yellow/400 ✓), the whole `-darker`/`-darkest` tier for error/notice/warning surface tokens — same story as mobile, both codebases already had the clean `600→700→800` pattern before Figma's file briefly drifted.

## 4. Opacity/alpha mismatches

| Token | Web | Should be |
| --- | --- | --- |
| `surface/overlay` | grays/900 @ 31% (hex `50`) | grays/900 @ 25% (hex `40`) |
| `icon/default-inverse` | grays/000 @ 56% (hex `90`) | grays/000 @ 50% (hex `80`) |

## 5. Missing tokens to add

- All of `text/*-on-surface` (9 tokens) + `text/disabled`
- New tokens: `surface/background`, `text/on-surface-light`, `icon/on-surface-light`
- `surface/secondary-subtle` (mobile has this one, web doesn't)
- Stroke is much sparser than mobile's — missing `default-light`, `default-lighter`, `default-dark` (currently named `defaultBold`, alias is correct just needs renaming/aligning), `primary-light`, `primary-alt-light/lighter`, `success-light/lighter`, `error-light/lighter`, `notice-light/lighter`, `warning-light/lighter`

## 6. Web-only tokens not in the spec — two different situations

**Quietly fine to keep** (same category as mobile's unlisted-but-valid tokens): `surface/default-alt`, `surface/transparent`, `stroke/secondary`, `icon/disabled`.

**Needs a design decision** — an entire undocumented "info" role exists across all four categories (`text/info`, `surface/info` + 6 tier variants, `icon/info` + `info-inverse`, `stroke/info`), all aliasing blue, plus `surface/primary-inverse` (blue/150) and the `base` primitive from section 1. None of this exists in Figma's spec or in mobile. Either this should be formalized as a real part of the design system (if it's genuinely used and needed), or it's drift that should be consolidated into the existing `primary` tokens. Worth a direct question to design rather than guessing.

---

## Suggested sequencing

1. Add the `/025` primitive step, refresh stale primitive values (section 2) — same work as mobile, can likely share the primitive patch.
2. Apply web's own alias corrections (section 3) and opacity fixes (section 4) — **do not reuse mobile's alias fix list, the specific bugs differ.**
3. Add missing tokens (section 5), fill out the sparse stroke category.
4. Get a ruling from design on the "info" role and `base` primitive (section 6) before deciding whether to keep, formalize, or remove them.
5. Dark mode: decide whether to extend the existing thin palette layer or rebuild against the full light/dark token set — separate, scoped piece of work either way.

Full current values for everything referenced above are in [`token-changelog.md`](token-changelog.md) and [`bistrainer-color-tokens.json`](bistrainer-color-tokens.json) in this folder.
