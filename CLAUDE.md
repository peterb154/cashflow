# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A pocket-sized single-player game inspired by Robert Kiyosaki's *Cashflow* board game. Mobile-first, ~20–40 minute play sessions. Vite + TypeScript, no UI framework — single mutable `state` object with top-down re-render.

Live at https://cashflow.epetersons.com/.

`CHANGELOG.md` is the player-facing release notes (hand-curated). Future design ideas go in GitHub issues, not in this repo as a TODO file.

## Running and testing

```sh
pnpm install
pnpm dev               # vite dev server
pnpm test              # vitest run
pnpm test:watch        # vitest watch mode
pnpm typecheck         # tsc --noEmit
pnpm build             # tsc + vite build → dist/
pnpm changelog:draft   # writes CHANGELOG.draft.md (gitignored) from git log
```

Headless test hooks live on `window` (see `src/main.ts`):
- `window.render_game_to_text()` — JSON snapshot of state.
- `window.advanceTime()` — re-render from current state.

DOM elements carry stable `data-testid` attributes (e.g. `button-roll-life`, `text-cash`, `picker-card-doctor`). Prefer those as selectors. Append `?seed=<n>` for deterministic RNG.

## Architecture

`src/main.ts` bootstraps. A single mutable `state` object lives in `src/state.ts`; every action mutates it and calls `render()`, which rewrites `app.innerHTML` from `state`. There is no virtual DOM and no incremental update — the full re-render is the design.

### Modules

- `src/types.ts` — interfaces (`Profile`, `Opportunity`, `Doodad`, `EventCard`, `ExitCard`, `GameState`, etc.)
- `src/config.ts` — tunable constants (kid time, emergency buffer, costs, draw probabilities, etc.)
- `src/state.ts` — the mutable `state` and pure selectors: `monthlyCashFlow`, `truePassiveIncome`, `passiveAssetIncome`, `activeAssetIncome`, `fireProgress`, `monthlyTimeCapacity`, `obligatedTime`, `timeUsageRows`, etc.
- `src/game.ts` — turn engine and player actions. Each action mutates state then calls the render function registered via `setRerender()`.
- `src/rng.ts` — `mulberry32` PRNG, optionally seeded from `?seed=` URL param.
- `src/format.ts` — `money(value)` and `percent(ratio)` helpers. Don't hand-format currency.
- `src/theme.ts` — light/dark toggle. Deliberately not persisted.
- `src/render/` — top-down screen composition. `index.ts` switches on `state.phase` and emits one of `renderIntro`, `renderPicker`, `renderPlay`, `renderWon` with the topbar and footer wrapped around it. `play.ts` is the main game screen; `statements.ts` handles P&L / balance / debt tabs.
- `src/data/` — pure card and profile data:
  - `profiles.ts` — 12 starting lives
  - `opportunities.ts` — opportunity cards distributed bell-curve across skill 0–10
  - `doodads.ts` — temptation cards with `whisper` (Inner Voice) and `happiness` (deliberately unmeasured bait)
  - `events.ts` — life events; most carry `required: true` and can't be deferred
  - `family-starts.ts` — random family configurations

### Action wiring

Inline `onclick=` is not used. The markup carries `data-action` (and optional `data-arg`); a single delegated click listener in `main.ts` looks the action up in a map:

```html
<button data-action="payDebtSnowball">Debt snowball</button>
<button data-action="setStatementTab" data-arg="balance">Balance</button>
```

To add a new action: define the function in `game.ts`, export it, register it in the `actions` map in `main.ts`, mark up the button with `data-action="…"`.

### Monthly action gate

The seven monthly actions (debt snowball, cut expenses, build skill, sell asset, systematize, reduce hours, take more hours) share a single `state.actionTakenThisMonth` slot — only one succeeds per month; everything else no-ops with a toast until the month closes. Use `actionAvailable()` / `consumeMonthlyAction()` from `game.ts` when adding a monthly action. Card resolution is NOT a monthly action.

### Core loop

`nextMonth()` is the turn engine: snapshot → apply cash flow → accrue debt interest → roll over → reset `state.time = monthlyTimeCapacity()` → reset `state.actionTakenThisMonth = false` → draw a new card → check win.

### FIRE win condition

Uses `truePassiveIncome()` — only assets with `recurringTime === 0` plus cash interest count. Time-consuming businesses earn cash flow (counted in `monthlyCashFlow()`) but are excluded from FIRE until systematized down to zero. Systematizing a business that crosses to zero logs and toasts the graduation moment.

### Card resolution

`acceptCard()` branches on `card.type`:
- **opportunity** — apply cost, push the new asset onto the array (with `recurringTime` preserved, which gates FIRE counting), record cash flow.
- **doodad** — apply cost (or push to credit-card debt), apply `expenseChange`, optional `timeChange`. `whisper` and `happiness` are display-only; nothing outside the render layer reads them.
- **event** — apply cost / income / expense / family delta. Events with `required: true` block `passCard()`.
- **exit** — sell the asset for the offered cash, drop it from the assets array.

### Layout

Mobile and desktop variants are switched with `mobile-only` / `desktop-only` CSS classes. Both branches render the same data — when you add a field, update both.

## Conventions

- Modules over a single file. The previous flat-file design lives in git history — don't recreate it.
- Money via `money()`, percentages via `percent()`. Don't hand-format currency.
- Pure card/profile changes go in `src/data/*.ts`. Default `: <Type>[]` is fine; reach for `satisfies` only when you need narrower inference.
- Theme toggle deliberately does NOT use `localStorage`. Don't add persistence.
- Multiplayer is intentionally out of scope.
- The `happiness` field on doodads is deliberately unmeasured — never aggregate it, never gate anything on it. The point is to mirror real consumer-psychology bait: the hearts feel good, FIRE doesn't move.
- The `whisper` field on doodads is the seductive Inner Voice; the `lesson` at the bottom contradicts it.

## Deploy

GitHub Actions builds and deploys to GitHub Pages on push to `main`. Custom domain `cashflow.epetersons.com` via Route 53 CNAME pointing at `peterb154.github.io`; `public/CNAME` persists the domain through deploys.

CHANGELOG.md is hand-curated for players. Run `pnpm changelog:draft` to dump recent commits as a reference when writing entries.
