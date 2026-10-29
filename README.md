# BuildRig

A PC build cost planner. Pick a part, enter its model and price, and the total updates right away. Save builds and compare them later. Everything stays in your browser.

Tag: Rebuilt (original 2020), AI pair-programmed 2026

Live demo: https://ali1129js.github.io/buildrig-app/

## Features

- 12 part categories: CPU, Motherboard, RAM, GPU, Primary SSD, Storage II, Case, Power Supply, Cooling, Monitor, Extra 1, Extra 2
- Live total, parts filled, average per part, and parts still empty
- Build table with every part, model, and price
- Saved builds in local storage, with optional names (default "Build 1", "Build 2", and so on, never reused)
- Confirmation before deleting a build, clearing all saved builds, or resetting the current build
- Load example build: six ready-made builds for different purposes (4K gaming, budget gaming, coding, local AI, content creation, compact and quiet). Loading replaces only the calculator, asks first if it has data, and never touches saved builds
- "Coming 2027 (rumoured)" info section with sources and no prices
- Three themes: light, dark, and high contrast (saved per browser)
- Prices stored as integer cents and shown as de-DE euros, for example `1.234,56 €`
- Accessible: labelled fields, visible focus, live status messages, reduced motion support
- No tracking, no external requests, system font stack

## Example builds and prices

The example builds live in `src/lib/presets.ts` and the rumoured hardware in `src/lib/rumours.ts`. Prices are German retail prices as of Oct 2026 (a period of very high memory, SSD and GPU prices), so check retailers before buying. The research with sources and dates is in `buildrig-research.md` (kept next to the project, not in the app). Presets are validated by tests: all categories valid, integer cents, and fixed totals.

## Stack

- Vite and TypeScript (`strict`, `noUncheckedIndexedAccess`)
- Vanilla DOM code, no runtime dependencies
- Vitest for unit tests (including a contrast check for every theme)

## Run it

```bash
npm install
npm run dev        # start the dev server
npm test           # run the unit tests
npm run typecheck  # tsc --noEmit
npm run build      # type check and build to dist/
npm run preview    # serve the production build
```

## Deploy

The demo is served by GitHub Pages from the `gh-pages` branch. `npm run deploy` builds the app and publishes `dist/` to that branch with the `gh-pages` package.

## Optional: screenshots

```bash
npm i --no-save playwright-core
npm run build && npx vite preview --port 4173 &
node scripts/screenshots.mjs ./shots
```

The script also runs an end-to-end smoke test (saving, reload, confirm dialogs, themes, no external requests). Set `CHROME_PATH` if Playwright's Chromium is not installed.

## Data

Saved builds live in `localStorage` under `buildrig.savedBuilds.v2`. Data is validated when loaded, and invalid entries are skipped. Builds saved by the 2020 version (`buildrig.savedBuilds.v1`) are converted on first load.
