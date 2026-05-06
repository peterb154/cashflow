import { money } from '../format';
import { state, totalPassiveIncome } from '../state';
import { renderLog, renderStats } from './play';

export function renderWon(): string {
  return `
    <section class="hero">
      <div class="recap-card" data-testid="section-victory">
        <span class="eyebrow">Financial freedom</span>
        <h2 class="screen-title">You reached the Fastlane in month ${state.month}</h2>
        <p>
          Passive income is now ${money(totalPassiveIncome())}/mo against expenses of ${money(state.expenses)}/mo.
          The lesson: FIRE is not a fixed number. It changes when your run rate changes.
        </p>
        ${renderStats()}
        <div class="button-row">
          <button class="primary-button" type="button" data-testid="button-play-again" data-action="resetGame">Roll again</button>
          <button class="secondary-button" type="button" data-testid="button-continue" data-action="continuePlay">Keep playing</button>
        </div>
      </div>
      <aside class="panel">
        ${renderLog()}
      </aside>
    </section>`;
}
