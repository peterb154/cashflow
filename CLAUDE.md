# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-player FIRE finance game inspired by Cashflow. Mobile-first static prototype: `index.html` + `app.js` + `style.css`. No build system, no package manager, no test framework, no dependencies. Just open `index.html` in a browser.

`progress.md` tracks the design intent and TODO list — read it before making mechanic changes.

## Running and testing

- **Run:** open `index.html` directly in a browser, or serve the directory (`python3 -m http.server`).
- **No automated tests.** Drive the game manually via the DOM, or programmatically via the two global hooks installed at the bottom of `app.js`:
  - `window.render_game_to_text()` — returns a JSON snapshot of `state` (phase, cash, income, debts, FIRE %, current card, recent log entries). Use this for headless assertions.
  - `window.advanceTime()` — re-renders the UI from the current state.
- All interactive elements carry `data-testid` attributes (e.g. `button-roll-life`, `text-cash`, `section-profile`). Prefer these as selectors.
- After editing `app.js` or `style.css`, bump the `?v=YYYYMMDD-HHMM` cache-buster query strings in `index.html` so reloads pick up the change.

## Architecture

Everything lives in `app.js` as one flat module with a single mutable `state` object and a top-down re-render. There are no components, no framework, no build step — keep it that way.

### State and rendering

- `state` (around line 881) is the single source of truth: `phase`, `profile`, `month`, `cash`, `activeIncome`, `passiveIncome`, `expenses`, `debts[]`, `assets[]`, `time`/`baseTime`, `family`, `currentCard`, `log[]`, `toast`, etc.
- `render()` rewrites `app.innerHTML` from `state` on every change. There is no virtual DOM and no incremental update — every action mutates `state` then calls `render()`. Don't introduce element-level updates; the full re-render is the design.
- All action handlers are exposed on `window` (`rollLife`, `acceptCard`, `nextMonth`, `payDebtSnowball`, `cutExpenses`, `buildSkill`, `sellAsset`, `systematizeBusiness`, `setStatementTab`, etc.) and wired through inline `onclick=` attributes in the rendered HTML strings. New actions follow the same pattern: define the function, mutate `state`, call `render()`, expose on `window`.
- Theme toggle deliberately does **not** use `localStorage` (see `progress.md`). Don't add persistence.

### Game data

Top of `app.js` is pure data — keep card/profile changes in these arrays rather than scattering them through logic:

- `profiles` + `EXTRA_PROFILES` — roll-of-life starting profiles (income, expenses, debts, assets, time, family defaults).
- `familyStarts` — random initial family states.
- `deck` + `EXTRA_OPPORTUNITIES` — opportunity cards (cost, cashFlow, terminalValue, time, skill required, sellability).
- `doodads` — temptation cards (cost, recurring expense delta, emotional framing).
- `events` — life/family events (marriage, divorce, kids, layoffs, etc.).

### Core loop

`nextMonth()` is the turn engine: applies income, expenses, debt interest and payments, draws a card via `drawCard()`. Cards are resolved by `acceptCard()` / `passCard()`. The scarce-time mechanic (`state.time` / `monthlyTimeCapacity()` / `recurringTime()`) gates most player actions — preserve it when adding mechanics.

FIRE win condition: `totalPassiveIncome() >= state.expenses` (see `fireProgress()` and `checkWin()`).

### Layout

`renderPlay()` composes the play screen from `renderProfileHeader`, `renderStats`, `renderTimeAccounting`, `renderFireProgress`, `renderActions`, `renderCurrentCard`, `renderStatements` (income/balance/debt tabs), `renderLog`. Mobile and desktop variants are switched with `mobile-only` / `desktop-only` CSS classes — both branches render the same data, so when you add a field, update both.

## Conventions specific to this codebase

- One file, no modules. Resist splitting `app.js` — the prototype's value is that you can read it top-to-bottom.
- Money via `money()`, percentages via `percent()`. Don't hand-format currency.
- New player actions: add the function, expose on `window`, wire via `onclick=` in the relevant `render*` function, and decrement `state.time` via `spendTime()` if the action consumes time.
- Multiplayer is intentionally out of scope (per `progress.md`).
