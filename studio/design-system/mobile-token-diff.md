# SafeTapp (Mobile) — Token Diff vs. Source of Truth

Comparing [`src/theme/Colors.ts`](https://github.com/BISTrainingSolutions/SafeTapp/blob/master/src/theme/Colors.ts) in the SafeTapp repo against [`token-changelog.md`](token-changelog.md) / [`bistrainer-color-tokens.json`](bistrainer-color-tokens.json) in this folder. Checked 2026-07-24 — mobile's file is unchanged since it was first pulled (same file hash), so this is a full, current gap list.

---

## 1. Structural gaps (the big items)

- **No `/025` primitive step at all**, on any of the 8 hues. Mobile's scale is `0,50,100,150...900` (12 steps); the source of truth is `000,025,050,100...900` (13 steps). Every `-on-surface` text token and every `-lighter` surface token depends on `/025` — can't be built correctly without adding the step.
- **No dark mode whatsoever.** Mobile's `Colors.ts` is a single flat theme. The source of truth now defines full Light+Dark pairs for all 114 semantic tokens, including several genuinely different (not just inverted) dark values. Bigger lift than a token refresh — worth scoping as its own piece of work.

## 2. Primitive values to update

| Primitive | Mobile has | Should be |
| --- | --- | --- |
| `grays/*` (150, 200, 300, 400, 500, 600, 700, 900, 000, 050) | old pre-changelog ramp | current "½ cool" ramp — only `grays/100` and `grays/800` anchors are still correct |
| `red/900` | `#2D2121` | `#2D1212` |
| `yellow/300` | `#E2B203` | `#E8B203` |
| `green/700` | `#004A0B` | `#00410B` |
| `blue/000` | `#F2FCFF` | `#F8FEFF` |

**Already correct, no change needed:** `orange/100` (`#FFDEAB`) — mobile already had the right value before Figma's bug was even fixed.

## 3. Semantic alias corrections (genuine step changes, not just stale primitives)

| Token | Mobile aliases to | Should alias to |
| --- | --- | --- |
| `text/primary-alt` | indigo/400 | indigo/500 |
| `text/secondary-light` | grays/400 | grays/300 |
| `text/notice` | orange/500 | orange/600 |
| `text/warning` | yellow/500 | yellow/600 |
| `surface/primary-lighter` | blue/050 | blue/025 |
| `surface/primary-alt-light` | indigo/300 | indigo/200 |
| `surface/primary-alt-lighter` | indigo/050 | indigo/025 |
| `surface/success-lighter` | green/050 | green/025 |
| `surface/error-lighter` | red/050 | red/025 |
| `surface/notice-lighter` | orange/050 | orange/025 |
| `surface/warning-lighter` | yellow/050 | yellow/025 |

**Already correct, no change needed:** `error-darker/darkest`, `notice-dark/darker/darkest`, `warning-dark/darker/darkest` — mobile already had the clean `600→700→800` pattern before Figma's file drifted into the buggy skip-pattern that took several rounds to fix on the design side. Zero rework needed on this tier.

## 4. Opacity/alpha mismatches

| Token | Mobile | Should be |
| --- | --- | --- |
| `surface/overlay` | grays/900 @ 31% (hex `50`) | grays/900 @ 25% (hex `40`) |
| `icon/default-inverse` | grays/000 @ 56% (hex `90`) | grays/000 @ 50% (hex `80`) |

## 5. Missing tokens to add

- All of `text/*-on-surface` (9 tokens: primary, primary-alt, primary-alt-deep, secondary, success, error, notice, warning) + `text/disabled`
- New tokens: `surface/background`, `text/on-surface-light`, `icon/on-surface-light`
- Stroke gaps: `primary-alt-light/lighter`, `success-lighter`, `error-light/lighter`, `notice-light/lighter`, `warning-light/lighter`

## 6. Keep as-is (confirmed valid, not in the Figma pull but legitimately used)

`surface/default-alt`, `surface/transparent`, `stroke/secondary`, `stroke/secondary-lighter`, `icon/disabled`

---

## Suggested sequencing

1. Add the `/025` primitive step to all 8 hues, refresh the stale primitive values (section 2).
2. Apply the alias corrections (section 3) and opacity fixes (section 4).
3. Add the missing tokens (section 5).
4. Dark mode as a separate, scoped follow-up — it's a structural addition, not a token sync.

Full current values for everything referenced above are in [`token-changelog.md`](token-changelog.md) and [`bistrainer-color-tokens.json`](bistrainer-color-tokens.json) in this folder.
