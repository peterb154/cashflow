# Changelog

What's changed in the game. New mechanics, balance shifts, and content additions — written for players, not git.

## 2026-05-07 — UI polish from playtest feedback

### Layout

- **Desktop play screen no longer requires scrolling.** Profile and financial panels live on the left; current card, monthly actions, and log on the right. Tighter density so it all fits in a typical desktop viewport. Mobile layout unchanged.
- **Game log collapses by default.** Click the Game log header to expand it. The collapsed view shows your most recent entry, so it's still informative when closed.

### Monthly actions

- **Clearer feedback when an action fires.** The action you just took stays highlighted in green with "✓ Used this month"; the other six visibly dim with a "Locked until next month" message. No more guessing whether the click did anything.

### Asset choices

- **Pick which asset to sell.** Sell asset and Systematize now open a picker so you choose which side hustle to act on, instead of the game auto-picking. Easier to find when you're trying to free up time.
- **Selling refunds freed time in the current month.** Selling a hustle with recurring time used to silently keep the time committed for the rest of the month — now it gives the hours back, matching the behavior of accepting an exit offer.
- **Sell button leads with the time benefit** when the asset has recurring time obligations.

### Balance

- **Divorce now splits cash and every asset 50/50** with your spouse, on top of the existing legal fees and single-household premium. Walking out of a marriage was previously a slap on the wrist; now it's the largest single financial event in the game.
- **Marital strain shifts marriage and divorce odds.** Two life signals — running at 0 free time and running monthly cash flow negative — each count as a strain factor. Each factor makes divorce more likely to draw and marriage less likely. Two factors at once roughly doubles divorce odds and quarters marriage odds. A new "Marriage at risk" / "Burnout — slower to meet someone" tag in the play header tells you when strain is active.

### Win screen

- **"Where you started" recap on the win screen.** When you reach FIRE, the victory page now shows your starting profile, family roll, cash, income, expenses, debt, and skill — so the journey from start to finish is legible.
- **Copy recap button.** Pastes a short text summary (start → finish, plus the play URL — with seed when one was set) to your clipboard. Easy to share without taking a screenshot.

## 2026-05-06 — Initial public release

The first playable version, live at [cashflow.epetersons.com](https://cashflow.epetersons.com/).

### Core rules

- **FIRE win condition.** You win when *truly passive* income (assets with no monthly time obligation + cash interest) covers your monthly expenses. Time-consuming businesses earn cash but don't count toward FIRE — until you systematize them down to zero recurring time.
- **One action per month.** Each month you take exactly one levered action (debt snowball, cut expenses, build skill, sell asset, systematize, reduce hours, take more hours) or none. Then close the month.
- **Hours trade.** Reduce your work hours to gain monthly free time at proportional income loss; take more hours to do the reverse. Permanent until you change it again.
- **Required life events.** Emergencies, bills, repairs, layoffs, and parent-needs-help can't be deferred. Real choices (job offers, promotions) still can be.

### Family & time

- 10-unit monthly time budget. Job, family obligations, and recurring business work draw it down.
- Single parents bear **3 time units per kid**; married parents bear **1.5 each** (the math is honest: a couple together does 3, a single parent does that 3 alone).

### Starting lives

- 12 profiles spanning a $2,100/mo barista to a $14,200/mo doctor with $332k of debt. Each has its own asymmetry — some carry crushing student loans, some have passive income from VA disability, some start with no time at all.
- "Browse lives" lets you preview each one. Family is pre-rolled on the card, re-rollable per profile, and locked in when you choose.

### Opportunity deck

- 53 cards spanning skill 0–10, distributed in a rough bell curve so high-skill players have things to do and low-skill players can see what they're growing into. Locked cards display their skill requirement.
- Categories: index funds, vending, route businesses, agencies, real estate, SaaS, e-commerce, syndications, mature acquisitions, and a $250k search-fund acquisition for the late game.

### Doodad temptations

- 19 cards covering car upgrades, lifestyle inflation, status purchases, family pulls, and modern subscription creep.
- Each card carries an **Inner Voice** — the whisper that justifies the spend ("Your father will finally be proud", "Think of the Insta likes", "You've worked hard, you deserve it"). The lesson at the bottom contradicts it.
- Each card shows a **happiness rating** in hearts (1–5). The hearts are deliberately not tracked — they don't aggregate, don't gate anything, don't move FIRE. They're bait that mirrors how real consumer purchases dangle "this will make me happier" without ever delivering measurable joy.

### Life events

- 14 cards: emergencies, bonuses, repairs, rent rises, insurance hikes, tax refunds, layoff scares, marriages, divorces, new babies, childcare gaps, parent-needs-help, referrals, promotions.
- Most are required — life happens to you. Two are real choices.

### Statements

- Income statement (P&L) splits asset income into "needs time" vs "truly passive" so you can see what's pulling toward FIRE vs what's just earning cash.
- Time accounting panel breaks down where the 10 monthly units go, with kid math made explicit (e.g. "2 kids × 3 time/kid (single parent — no spouse to split)").
- Balance sheet, debt list, and FIRE progress.

### Quality of life

- Light/dark theme toggle.
- `?seed=` URL parameter for reproducible playthroughs.
