export function renderIntro(): string {
  return `
    <div class="screen hero">
      <section class="intro-card">
        <span class="eyebrow">A pocket-sized Cashflow</span>
        <h2>Roll a life. Read the numbers. Get out of the rat race.</h2>
        <p>
          Inspired by Robert Kiyosaki's <em>Cashflow</em> — but mobile, single-player,
          and short enough to finish on a coffee break.
        </p>
        <p>
          You start with a job, a family, a P&amp;L, and a balance sheet. Each month
          life throws an event and you pick at most one move. You win when
          <strong>truly passive income covers your expenses</strong> — that's financial freedom.
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
          <span class="eyebrow">How a month works</span>
        </div>
        <ol class="intro-steps">
          <li><strong>Resolve a card</strong> — an opportunity, a doodad temptation, or a life event you can't always dodge.</li>
          <li><strong>Take one action</strong> — pay debt, build skill, sell an asset, cut expenses, trade work hours, or systematize a business. Or none.</li>
          <li><strong>Close the month.</strong> Income posts, debt accrues, the deck deals again.</li>
        </ol>
        <div class="panel-title" style="margin-top: var(--space-5);">
          <span class="eyebrow">Things that bite first-timers</span>
        </div>
        <ul class="intro-bullets">
          <li>Time is a 10-unit monthly budget. Job and family eat into it.</li>
          <li>Income from a business that still needs your time does <strong>not</strong> count toward FIRE — until you systematize it down to zero.</li>
          <li>Some lives start with zero free time. That's by design.</li>
        </ul>
      </aside>
    </div>`;
}
