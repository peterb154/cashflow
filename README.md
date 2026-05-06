# Cashflow

A single-player FIRE (financial independence, retire early) game inspired by Cashflow. Roll a starting life, manage monthly cash flow, dodge doodads, and hit FIRE when passive income clears your expenses.

**Live:** https://cashflow.epetersons.com/

## Stack

Vite + TypeScript, no framework. Single mutable `state` object with a top-down re-render. Game data (profiles, opportunities, doodads, events) lives in typed modules under `src/data/`.

## Running locally

```sh
pnpm install
pnpm dev      # http://localhost:5173/
pnpm test     # vitest
pnpm build    # tsc + vite build → dist/
```

## Headless play

Two hooks live on `window` for scripted testing — see `src/main.ts`:

- `window.render_game_to_text()` — JSON snapshot of state
- `window.advanceTime()` — re-render after mutating state

DOM elements carry stable `data-testid` attributes; prefer those as selectors.

Append `?seed=<n>` to the URL for deterministic RNG (useful for reproducing playtests).

## Deploy

Push to `main` → GitHub Actions runs tests, builds, and publishes to GitHub Pages (`.github/workflows/deploy.yml`).

## More

- `CHANGELOG.md` — generated from git history; run `pnpm changelog` to refresh
- `CLAUDE.md` — architecture and conventions
- `progress.md` — design intent and TODO list
