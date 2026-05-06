import { profiles } from '../data/profiles';
import { money } from '../format';
import type { Profile } from '../types';

function totalDebtFor(profile: Profile): number {
  return profile.debts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);
}

function familyHint(profile: Profile): string {
  if (!profile.defaultFamily) return 'Family rolled at start';
  const f = profile.defaultFamily;
  if (f.kids === 0) return f.status === 'married' ? 'Married, no kids' : 'Single, no kids';
  const kids = f.kids === 1 ? '1 kid' : `${f.kids} kids`;
  return `${f.status === 'married' ? 'Married' : 'Single parent'}, ${kids}`;
}

function renderProfileCard(profile: Profile): string {
  return `
    <article class="picker-card" data-testid="picker-card-${profile.id}">
      <header>
        <h3 class="picker-name">${profile.name}</h3>
        <p class="picker-role">${profile.role}</p>
      </header>
      <dl class="picker-stats">
        <div><dt>Cash</dt><dd>${money(profile.cash)}</dd></div>
        <div><dt>Active income</dt><dd>${money(profile.activeIncome)}/mo</dd></div>
        <div><dt>Expenses</dt><dd>${money(profile.expenses)}/mo</dd></div>
        <div><dt>Debt</dt><dd>${money(totalDebtFor(profile))}</dd></div>
        <div><dt>Free time</dt><dd>${profile.time}/10</dd></div>
        <div><dt>Family</dt><dd>${familyHint(profile)}</dd></div>
      </dl>
      <p class="picker-challenge"><strong>Challenge:</strong> ${profile.challenge}</p>
      <p class="picker-edge"><strong>Hidden advantage:</strong> ${profile.hiddenAdvantage}</p>
      <button class="primary-button" type="button" data-testid="button-pick-${profile.id}" data-action="startSpecificProfile" data-arg="${profile.id}">
        Choose this life
      </button>
    </article>`;
}

export function renderPicker(): string {
  return `
    <div class="screen picker-screen" data-testid="screen-picker">
      <header class="picker-header">
        <div>
          <span class="eyebrow">Browse lives</span>
          <h2>Pick a starting life</h2>
          <p>Each life is asymmetric. Different income, expenses, debts, time, and obligations — same FIRE goal.</p>
        </div>
        <button class="quiet-button" type="button" data-testid="button-back-to-intro" data-action="backToIntro">Back</button>
      </header>
      <div class="picker-grid">
        ${profiles.map(renderProfileCard).join('')}
      </div>
    </div>`;
}
