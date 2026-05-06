export function renderIntro(): string {
  return `
    <div class="screen hero">
      <section class="intro-card">
        <span class="eyebrow">Single-player slice</span>
        <h2>Roll a life. Read the numbers. Buy freedom.</h2>
        <p>
          This first prototype is one-player only. It tests the core loop: monthly turns, financial statements,
          asymmetric starting lives, doodad temptations, business opportunities, debt snowball, and FIRE progress.
        </p>
        <div class="button-row">
          <button class="primary-button" type="button" data-testid="button-roll-life" data-action="rollLife">
            Roll my life
          </button>
          <button class="secondary-button" type="button" data-testid="button-browse-lives" data-action="showLifePicker">
            Browse lives
          </button>
        </div>
      </section>
      <aside class="panel">
        <div class="panel-title">
          <span class="eyebrow">What this tests</span>
          <h2>Financial freedom is a ratio</h2>
          <p>
            You win when passive income exceeds monthly expenses. Increase passive income, lower the run rate,
            and keep doodads from becoming permanent obligations.
          </p>
        </div>
        <div class="lesson-strip">
          <div class="lesson"><strong>Statements</strong><span>Income, balance sheet, debt, and cash flow.</span></div>
          <div class="lesson"><strong>Tradeoffs</strong><span>Cash flow businesses versus sellable assets.</span></div>
          <div class="lesson"><strong>Behavior</strong><span>Temptation, restraint, snowball, and runway.</span></div>
        </div>
      </aside>
    </div>`;
}
