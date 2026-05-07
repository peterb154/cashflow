import { money } from '../format';
import { state, totalPassiveIncome } from '../state';
import { renderLog, renderStats } from './play';

function renderRunStart(): string {
  const start = state.runStart;
  if (!start) return '';
  const { profile, family } = start;
  const debt = profile.debts.reduce((sum, d) => sum + d.balance, 0);
  const familyLabel =
    family.status === 'married'
      ? `Married, ${family.kids} kid${family.kids === 1 ? '' : 's'}`
      : family.kids > 0
        ? `Single parent, ${family.kids} kid${family.kids === 1 ? '' : 's'}`
        : 'Single';
  return `
    <div class="run-start" data-testid="section-run-start">
      <span class="eyebrow">Where you started</span>
      <h3 class="run-start-name">${profile.name}</h3>
      <p class="profile-note">${profile.role}</p>
      <div class="run-start-grid">
        <div><span class="mini-label">Family</span><strong>${familyLabel}</strong></div>
        <div><span class="mini-label">Cash</span><strong>${money(profile.cash)}</strong></div>
        <div><span class="mini-label">Income</span><strong>${money(profile.activeIncome)}/mo</strong></div>
        <div><span class="mini-label">Expenses</span><strong>${money(profile.expenses)}/mo</strong></div>
        <div><span class="mini-label">Debt</span><strong>${money(debt)}</strong></div>
        <div><span class="mini-label">Skill</span><strong>${profile.skill}/10</strong></div>
      </div>
    </div>`;
}

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
        ${renderRunStart()}
        <div class="button-row">
          <button class="primary-button" type="button" data-testid="button-play-again" data-action="resetGame">Roll again</button>
          <button class="secondary-button" type="button" data-testid="button-continue" data-action="continuePlay">Keep playing</button>
          <button class="secondary-button" type="button" data-testid="button-copy-share" data-action="copyShareText">Copy recap</button>
        </div>
      </div>
      <aside class="panel">
        ${renderLog()}
      </aside>
    </section>`;
}
