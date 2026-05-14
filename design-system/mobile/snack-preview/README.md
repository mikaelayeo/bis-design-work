# Live preview — Expo Snack

**⚡ Paste [App.js](./App.js) into Snack.** It runs in Snack's default JavaScript project with no setup.

For reference (not for Snack): [App.tsx](./App.tsx) is the same code with TypeScript types. Snack defaults to JS — pasting `.tsx` content into the default `App.js` will throw parse errors on TypeScript syntax (`as const`, `: any`, etc.).

## Run it in your browser (3 steps)

1. Open **https://snack.expo.dev/**
2. In the file tree on the left, open `App.js`. Select all (Ctrl+A) and paste the contents of [App.js](./App.js) — use GitHub's **Raw** button to copy cleanly.
3. The right panel auto-runs. Use the device dropdown above the preview to switch between **Web**, **iPhone**, and **Android** rendering.

## What's demoed

- **GridCard** — all 7 types (`default`, `photo`, `error`, `skeleton`, `loading`, `select`, `selected`) at Base size 115×115
- **GridCard** — `Large` size 177×150 (default + photo)
- **Upload** — list mode with loading + error rows
- **Upload** — grid mode with image + uploading + errored tiles
- **Upload** — empty state
- **Upload** — single-file mode (no CTA once populated)

The X dismiss buttons are wired — tap them in the Snack to remove items and see the empty/single states transition.

## What this preview is NOT

- Uses **`@expo/vector-icons`** FontAwesome 6 (free), not FontAwesome 6 Pro. A few icons might render slightly differently in the real SafeTapp build.
- The **`ListItem`** here is a 30-line stub. The production version is 24KB and supports way more (selection mode, all trailing types, paragraph types, dividers, etc.).
- The **`Button`** here is also stubbed — production Button has size variants, shapes, success animations, etc.
- Theme tokens are **hardcoded literals** matching the BIStrainer Figma values. Production uses the real `theme/` modules.

For production-fidelity rendering, the dev will need to wire the actual components into SafeTapp — see the per-component READMEs.
