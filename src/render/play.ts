import { MIN_JOB_TIME, SKILL_BUILD_COST, SYSTEMATIZE_COST } from '../config';
import {
  bestSellableAsset,
  bestSystematizeAsset,
  debtSnowballAmount,
  expenseCutAmount,
  perShiftIncome,
} from '../game';
import { money, percent } from '../format';
import {
  activeAssetIncome,
  cashInterestIncome,
  familyLabel,
  fireGap,
  fireProgress,
  monthlyCashFlow,
  monthlyTimeCapacity,
  obligatedTime,
  passiveAssetIncome,
  runwayMonths,
  state,
  timeUsageRows,
  truePassiveIncome,
} from '../state';
import type { Card, MonthlyActionId } from '../types';
import { renderStatements } from './statements';

function renderProfileHeader(): string {
  if (!state.profile) return '';
  return `
    <div class="profile-top">
      <div>
        <span class="eyebrow">Roll of life</span>
        <h2 class="profile-name" data-testid="text-profile-name">${state.profile.name}</h2>
        <p class="profile-note">${state.profile.role}</p>
      </div>
      <button class="quiet-button" type="button" data-testid="button-reset" data-action="resetGame">Reset</button>
    </div>
    <div class="tag-row">
      <span class="tag primary">Business skill ${state.skill}/10</span>
      <span class="tag">Free time now ${state.time}/${state.baseTime}</span>
      <span class="tag warning">Recurring obligations ${obligatedTime()}/10</span>
      <span class="tag success">Family: ${familyLabel()}</span>
    </div>`;
}

function renderLifeLessons(): string {
  if (!state.profile) return '';
  return `
    <div class="lesson">
      <strong>Challenge</strong>
      <span>${state.profile.challenge}</span>
    </div>
    <div class="lesson">
      <strong>Hidden advantage</strong>
      <span>${state.profile.hiddenAdvantage}</span>
    </div>`;
}

export function renderStats(): string {
  const runway = runwayMonths();
  return `
    <div class="stat-grid">
      <div class="stat-card">
        <span class="label">Cash</span>
        <span class="value" data-testid="text-cash">${money(state.cash)}</span>
        <span class="subvalue">Runway ${runway === Infinity ? 'positive' : `${runway.toFixed(1)} mo`}</span>
      </div>
      <div class="stat-card">
        <span class="label">Cash flow</span>
        <span class="value ${monthlyCashFlow() >= 0 ? 'positive' : 'negative'}" data-testid="text-cash-flow">${money(monthlyCashFlow())}</span>
        <span class="subvalue">After debt payments</span>
      </div>
      <div class="stat-card">
        <span class="label">Passive (FIRE)</span>
        <span class="value positive" data-testid="text-passive">${money(truePassiveIncome())}</span>
        <span class="subvalue">${money(passiveAssetIncome())} passive assets + ${money(cashInterestIncome())} cash interest${activeAssetIncome() > 0 ? ` · ${money(activeAssetIncome())}/mo from active gigs (not FIRE)` : ''}</span>
      </div>
      <div class="stat-card">
        <span class="label">FIRE gap</span>
        <span class="value ${fireGap() === 0 ? 'positive' : 'warning'}" data-testid="text-fire-gap">${money(fireGap())}</span>
        <span class="subvalue">expenses minus passive</span>
      </div>
      <div class="stat-card">
        <span class="label">Free time now</span>
        <span class="value ${state.time === 0 ? 'warning' : 'positive'}" data-testid="text-time-left">${state.time}/${state.baseTime}</span>
        <span class="subvalue">${obligatedTime()} recurring obligations; ${monthlyTimeCapacity()} starts free each month</span>
      </div>
    </div>`;
}

function renderTimeAccounting(): string {
  const sources = timeUsageRows();
  return `
    <div class="time-accounting" data-testid="section-time-accounting">
      <div>
        <span class="eyebrow">Time accounting</span>
        <strong>${state.time}/${state.baseTime} free units now</strong>
      </div>
      <div class="time-accounting-grid">
        <span>Recurring obligations <strong>-${obligatedTime()}/10</strong></span>
        <span>Starts free each month <strong>${monthlyTimeCapacity()}/10</strong></span>
      </div>
      <div class="time-source-list">
        ${
          sources.length
            ? sources
                .map(
                  ([label, amount], index) =>
                    `<div class="time-source" data-testid="row-time-source-${index}"><span>${label}</span><strong>${amount >= 0 ? `-${amount}` : `+${-amount}`}</strong></div>`,
                )
                .join('')
            : '<div class="time-source"><span>No recurring obligations yet</span><strong>0</strong></div>'
        }
      </div>
    </div>`;
}

function renderFireProgress(): string {
  return `
    <div class="panel" style="box-shadow: none;">
      <div class="panel-header">
        <div class="panel-title">
          <span class="eyebrow">Financial freedom</span>
          <h2>${percent(fireProgress() / 100)} of the way to FIRE</h2>
          <p>Truly passive income (no time required) must cover monthly expenses: ${money(truePassiveIncome())} / ${money(state.expenses)}.</p>
        </div>
      </div>
      <div class="progress-track" aria-label="FIRE progress">
        <div class="progress-fill" data-testid="progress-fire" style="width:${fireProgress()}%"></div>
      </div>
    </div>`;
}

type ActionState = 'available' | 'noop' | 'fired' | 'locked';

function actionStateFor(id: MonthlyActionId, leverNoOp: boolean): ActionState {
  const used = state.actionTakenThisMonth;
  if (used === id) return 'fired';
  if (used !== null) return 'locked';
  return leverNoOp ? 'noop' : 'available';
}

function renderActionButton(opts: {
  id: MonthlyActionId;
  testid: string;
  title: string;
  copy: string;
  noOp: boolean;
}): string {
  const stateLabel = actionStateFor(opts.id, opts.noOp);
  const disabled = stateLabel === 'available' ? '' : 'disabled aria-disabled="true"';
  const span =
    stateLabel === 'fired'
      ? '✓ Used this month'
      : stateLabel === 'locked'
        ? 'Locked — close the month to use another action.'
        : opts.copy;
  return `<button class="action-card" type="button" data-testid="${opts.testid}" data-action="${opts.id}" data-state="${stateLabel}" ${disabled}>
          <strong>${opts.title}</strong>
          <span>${span}</span>
        </button>`;
}

function renderActions(): string {
  const hasCard = Boolean(state.currentCard);
  const snowball = debtSnowballAmount();
  const cut = expenseCutAmount();
  const sellableAsset = bestSellableAsset();
  const systemAsset = bestSystematizeAsset();
  const actionUsed = state.actionTakenThisMonth !== null;

  const snowballNoOp = !snowball.target || snowball.amount <= 0;
  const cutNoOp = cut <= 0 || state.time < 1;
  const skillNoOp = state.skill >= 10 || state.cash < SKILL_BUILD_COST || state.time < 2;
  const sellNoOp = !sellableAsset;
  const systematizeNoOp = !systemAsset || state.cash < SYSTEMATIZE_COST;
  const reduceNoOp = !state.profile || state.profile.jobTime <= MIN_JOB_TIME;

  const snowballCopy = !snowball.target
    ? 'Debt-free — nothing to snowball.'
    : snowball.amount > 0
      ? `Pay ${money(snowball.amount)} toward ${snowball.target.name}; keep $1,000 buffer.`
      : 'No extra cash above the $1,000 buffer right now.';

  let cutCopy: string;
  if (cut <= 0) cutCopy = 'No more easy cuts — already at the minimum floor.';
  else if (state.time < 1) cutCopy = 'Need 1 free time unit. Reduce hours or wait for next month.';
  else cutCopy = `Trade 1 recurring time to cut ${money(cut)}/mo from living expenses.`;

  let skillCopy: string;
  if (state.skill >= 10) skillCopy = 'Business skill maxed at 10/10.';
  else if (state.cash < SKILL_BUILD_COST) skillCopy = `Costs ${money(SKILL_BUILD_COST)} — not enough cash right now.`;
  else if (state.time < 2) skillCopy = 'Costs 2 free time units — not enough free time right now.';
  else skillCopy = `Costs 2 time and ${money(SKILL_BUILD_COST)} to unlock better deal flow.`;

  const sellCopy = sellableAsset
    ? `Sell ${sellableAsset.name} for ${money(sellableAsset.value)}; lose ${money(sellableAsset.passive ?? 0)}/mo income.`
    : 'No sellable asset on the balance sheet yet.';

  let systematizeCopy: string;
  if (!systemAsset) systematizeCopy = 'Need a time-consuming asset first; systematizing buys back 1 time unit/month.';
  else if (state.cash < SYSTEMATIZE_COST) systematizeCopy = `Costs ${money(SYSTEMATIZE_COST)} — not enough cash right now.`;
  else systematizeCopy = `Spend ${money(SYSTEMATIZE_COST)} on ${systemAsset.name} to buy back 1 time unit/month.`;

  const reduceCopy =
    state.profile && state.profile.jobTime > MIN_JOB_TIME
      ? `Drop 1 work unit. -${money(perShiftIncome())}/mo, +1 free time/mo from now on.`
      : 'Already at minimum work hours.';

  const increaseCopy = `Add 1 work unit. +${money(perShiftIncome())}/mo, -1 free time/mo from now on.`;

  let footnote: string;
  if (hasCard) {
    footnote = 'Resolve or pass the monthly card before closing the month.';
  } else if (actionUsed) {
    footnote = 'You\'ve used this month\'s action. Close the month to take another.';
  } else {
    footnote = 'One action per month — choose carefully, or just close the month.';
  }
  return `
    <section class="panel action-panel" aria-labelledby="monthly-actions" data-testid="section-actions">
      <div class="panel-title">
        <span class="eyebrow">Monthly actions</span>
        <h2 id="monthly-actions">Choose your lever</h2>
      </div>
      <div class="action-grid">
        ${renderActionButton({ id: 'payDebtSnowball', testid: 'button-debt-snowball', title: 'Debt snowball', copy: snowballCopy, noOp: snowballNoOp })}
        ${renderActionButton({ id: 'cutExpenses', testid: 'button-cut-expenses', title: 'Cut expenses', copy: cutCopy, noOp: cutNoOp })}
        ${renderActionButton({ id: 'buildSkill', testid: 'button-build-skill', title: 'Build business skill', copy: skillCopy, noOp: skillNoOp })}
        ${renderActionButton({ id: 'sellAsset', testid: 'button-sell-asset', title: 'Sell best asset', copy: sellCopy, noOp: sellNoOp })}
        ${renderActionButton({ id: 'systematizeBusiness', testid: 'button-systematize', title: 'Systematize', copy: systematizeCopy, noOp: systematizeNoOp })}
        ${renderActionButton({ id: 'reduceHours', testid: 'button-reduce-hours', title: 'Reduce hours', copy: reduceCopy, noOp: reduceNoOp })}
        ${renderActionButton({ id: 'increaseHours', testid: 'button-increase-hours', title: 'Take more hours', copy: increaseCopy, noOp: false })}
      </div>
      <button class="primary-button" type="button" data-testid="button-next-month" data-action="nextMonth" ${hasCard ? 'disabled' : ''}>
        Close month ${state.month}
      </button>
      <p class="profile-note">${footnote}</p>
    </section>`;
}

function renderCardEffects(card: Card, compact: boolean): string {
  const rows: Array<[string, string]> = [];
  if ('cost' in card) {
    rows.push(['Cash impact', card.cost < 0 ? `+${money(Math.abs(card.cost))}` : `-${money(card.cost)}`]);
  }
  if ('cashFlow' in card) {
    rows.push(['Monthly cash flow', `${card.cashFlow >= 0 ? '+' : ''}${money(card.cashFlow)}`]);
  }
  if ('offerValue' in card) rows.push(['Exit cash offer', `+${money(card.offerValue)}`]);
  if ('passiveLost' in card && card.passiveLost) rows.push(['Passive income lost', `-${money(card.passiveLost)}/mo`]);
  if ('timeFreed' in card && card.timeFreed) rows.push(['Time freed', `+${card.timeFreed}/month`]);
  if ('expenseChange' in card && card.expenseChange) rows.push(['Monthly expenses', `+${money(card.expenseChange)}`]);
  if ('expenseReduction' in card && card.expenseReduction) rows.push(['Expense avoided', `-${money(card.expenseReduction)}`]);
  if ('timeChange' in card && card.timeChange) rows.push(['Time effect', `${card.timeChange > 0 ? '+' : ''}${card.timeChange}`]);
  if ('incomeChange' in card && card.incomeChange) rows.push(['Active income', `+${money(card.incomeChange)}`]);
  if ('value' in card) rows.push(['Balance sheet value', money(card.value)]);
  if ('terminalValue' in card && card.terminalValue) rows.push(['Possible future exit', money(card.terminalValue)]);
  if ('timeCost' in card) rows.push(['Time required', `${card.timeCost}/10`]);
  if ('recurringTime' in card && card.recurringTime) rows.push(['Ongoing time', `${card.recurringTime}/month`]);
  if ('skillRequired' in card) rows.push(['Business skill required', `${card.skillRequired}/10`]);
  if ('sellability' in card) rows.push(['Sellability', card.sellability]);
  if ('risk' in card) rows.push(['Risk', card.risk]);
  if ('happiness' in card && card.happiness) {
    const filled = Math.max(0, Math.min(5, card.happiness));
    const empty = 5 - filled;
    const hearts =
      `<span class="hearts-on">${'♥'.repeat(filled)}</span>` +
      `<span class="hearts-off">${'♡'.repeat(empty)}</span>`;
    rows.push(['Happiness', hearts]);
  }

  const compactRows =
    compact && (card.type === 'opportunity' || card.type === 'exit')
      ? rows.filter(([label]) =>
          [
            'Cash impact',
            'Monthly cash flow',
            'Exit cash offer',
            'Passive income lost',
            'Time freed',
            'Possible future exit',
            'Balance sheet value',
            'Time required',
            'Ongoing time',
            'Business skill required',
          ].includes(label),
        )
      : rows;

  return `<div class="effect-list ${compact ? 'compact-effects' : ''}">${compactRows
    .map(([label, value]) => {
      const cls = label === 'Happiness' ? 'effect-item effect-happiness' : 'effect-item';
      return `<div class="${cls}"><span>${label}</span><strong>${value}</strong></div>`;
    })
    .join('')}</div>`;
}

function renderCurrentCard(compact = false): string {
  const card = state.currentCard;
  if (!card) {
    return `
      <div class="choice-card">
        <span class="choice-kicker">Month ${state.month}</span>
        <h2 class="choice-title">No active card</h2>
        <p>You handled this month’s choice. Close the month to post income, expenses, debt payments, and interest.</p>
      </div>`;
  }
  const kicker =
    card.type === 'opportunity'
      ? 'Opportunity'
      : card.type === 'doodad'
        ? 'Doodad temptation'
        : card.type === 'exit'
          ? 'Exit offer'
          : 'Life event';
  const acceptLabel =
    card.type === 'doodad'
      ? 'Buy it'
      : card.type === 'opportunity'
        ? 'Take deal'
        : card.type === 'exit'
          ? 'Sell asset'
          : 'Resolve event';
  const whisper = card.type === 'doodad' && 'whisper' in card && card.whisper
    ? `<div class="choice-whisper" data-testid="text-card-whisper">
         <span class="choice-whisper-label">Inner voice</span>
         <p>“${card.whisper}”</p>
       </div>`
    : '';
  return `
    <article class="choice-card ${card.type}" data-testid="card-current">
      <span class="choice-kicker">${kicker}</span>
      <h2 class="choice-title" data-testid="text-card-title">${card.title}</h2>
      <p>${card.description}</p>
      ${whisper}
      ${renderCardEffects(card, compact)}
      <div class="lesson ${compact ? 'compact-lesson' : ''}">
        <strong>Lesson</strong>
        <span>${card.lesson}</span>
      </div>
      <div class="button-row">
        <button class="${card.type === 'doodad' ? 'danger-button' : 'success-button'}" type="button" data-testid="button-accept-card" data-action="acceptCard">
          ${acceptLabel}
        </button>
        ${
          card.type === 'event' && 'required' in card && card.required
            ? ''
            : `<button class="secondary-button" type="button" data-testid="button-pass-card" data-action="passCard">
          ${card.type === 'event' ? 'Defer it' : 'Pass'}
        </button>`
        }
      </div>
    </article>`;
}

export function renderLog(): string {
  const headline = state.log[0] ?? 'No events yet — close a month to start.';
  const count = state.log.length;
  return `
    <details class="panel log-accordion" data-testid="section-log">
      <summary class="log-summary">
        <div class="panel-title log-summary-title">
          <span class="eyebrow">Game log${count ? ` · ${count}` : ''}</span>
          <span class="log-summary-headline" data-testid="text-log-headline">${headline}</span>
        </div>
        <span class="log-summary-chevron" aria-hidden="true">▾</span>
      </summary>
      <div class="log-list">
        ${state.log
          .slice(0, 7)
          .map((entry, index) => `<div class="log-item" data-testid="text-log-${index}">${entry}</div>`)
          .join('')}
      </div>
    </details>`;
}

export function renderPlay(): string {
  return `
    <div class="screen play-screen">
      <div class="play-col play-col-left">
        <section class="panel profile-card" data-testid="section-profile">
          ${renderProfileHeader()}
          ${renderLifeLessons()}
        </section>
        <section class="panel financial-panel" data-testid="section-statements">
          ${renderStats()}
          ${renderTimeAccounting()}
          ${renderStatements()}
          ${renderFireProgress()}
        </section>
      </div>
      <div class="play-col play-col-right">
        <div class="mobile-only" data-testid="section-mobile-card">
          <section class="panel">
            ${renderCurrentCard(true)}
          </section>
        </div>
        <section class="panel desktop-only" data-testid="section-monthly-card">
          ${renderCurrentCard()}
        </section>
        ${renderActions()}
        ${renderLog()}
      </div>
    </div>
    <div class="mobile-bottom-space"></div>`;
}
