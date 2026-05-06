Original prompt: Create a first single-player version of a mobile-friendly FIRE finance game inspired by Cashflow, with roll-of-life starting profiles, monthly turns, financial statements, debt snowball, doodad temptations, business opportunities, and FIRE when passive income exceeds expenses.

Implemented:
- Static mobile-first prototype with in-memory state only.
- Expanded roll-of-life profiles including doctor, plumber, beauty school dropout/barista, sales rep, corporate manager, single parent nurse, teacher, software developer, restaurant server, electrician, veteran, and freelance designer.
- Monthly turn loop with income, expenses, debt payments, interest, events, doodads, and opportunities.
- Financial statement tabs: income, balance, and debt.
- FIRE progress calculation: passive income / monthly expenses.
- Debt snowball uses all cash above a $1,000 emergency buffer and costs no time.
- Expense cutting trades 1 recurring time for lower expenses; skill-building costs time and cash; asset selling is free but loses income.
- Scarce time mechanic: everyone starts with 10 time units; family obligations, kids, businesses, and DIY choices consume recurring time.
- Family mechanics: random starting family state plus forced marriage/divorce/kid events that affect time and expenses.
- Systematize action: spends money to reduce recurring time burden on the most time-consuming business.
- Expanded cards: more opportunities, more emotionally plausible doodads, and more life/family events.
- Dark/light theme toggle without localStorage.
- `window.render_game_to_text` and `window.advanceTime` test hooks.

TODO:
- Tune card math after family playtesting.
- Keep the game static/single-player for now; multiplayer is intentionally out of scope.
- Add richer terminal value mechanics, exit offers, taxes, and family-mode recaps.
