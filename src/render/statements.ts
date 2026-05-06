import { money, percent } from '../format';
import {
  activeAssetIncome,
  assetValue,
  cashInterestIncome,
  debtPayments,
  monthlyCashFlow,
  netWorth,
  obligatedTime,
  passiveAssetIncome,
  state,
  totalDebt,
  truePassiveIncome,
} from '../state';

function renderRows(rows: Array<[string, string]>): string {
  return `<div class="statement-list">${rows
    .map(([label, value], index) =>
      value === ''
        ? `<div class="statement-row statement-section" data-testid="row-statement-${index}"><span>${label}</span><span></span></div>`
        : `<div class="statement-row" data-testid="row-statement-${index}"><span>${label}</span><span>${value}</span></div>`,
    )
    .join('')}</div>`;
}

function renderIncomeStatement(): string {
  const activeAsset = activeAssetIncome();
  const passiveAsset = passiveAssetIncome();
  const cashInterest = cashInterestIncome();
  const rows: Array<[string, string]> = [
    ['Active income (job)', money(state.activeIncome)],
  ];
  if (activeAsset > 0) {
    rows.push(['Asset income — needs time', money(activeAsset)]);
  }
  rows.push(
    ['Asset income — truly passive', money(passiveAsset)],
    ['Cash interest (8% APY)', money(cashInterest)],
    ['Living expenses', `-${money(state.expenses)}`],
    ['Debt payments', `-${money(debtPayments())}`],
    ['Net monthly cash flow', money(monthlyCashFlow())],
    ['Counts toward FIRE', money(truePassiveIncome())],
  );
  return renderRows(rows);
}

function renderBalanceSheet(): string {
  const rows: Array<[string, string]> = [['Cash', money(state.cash)]];
  if (state.assets.length) {
    rows.push(['Assets', '']);
    for (const asset of state.assets) {
      rows.push([`· ${asset.name}`, money(asset.value)]);
    }
    rows.push(['Total asset value', money(assetValue())]);
  } else {
    rows.push(['Asset value', money(assetValue())]);
  }
  rows.push(
    ['Total debt', `-${money(totalDebt())}`],
    ['Net worth', money(netWorth())],
    ['Free time inventory', `${state.time}/${state.baseTime} units`],
    ['Obligated time liability', `-${obligatedTime()}/${state.baseTime} units`],
    ['Business skill asset', `${state.skill}/10`],
  );
  return renderRows(rows);
}

function renderDebtStatement(): string {
  if (!state.debts.length || totalDebt() <= 0) {
    return `<div class="lesson"><strong>Debt free</strong><span>No active debt balances. Keep the run rate under control.</span></div>`;
  }
  return `<div class="debt-list">${state.debts
    .filter((debt) => debt.balance > 0)
    .sort((a, b) => a.balance - b.balance)
    .map(
      (debt, index) => `
        <div class="debt-card" data-testid="card-debt-${index}">
          <div class="debt-head"><span>${debt.name}</span><span>${money(debt.balance)}</span></div>
          <div class="debt-meta"><span>Payment ${money(debt.payment)}/mo</span><span>APR ${percent(debt.rate)}</span></div>
        </div>`,
    )
    .join('')}</div>`;
}

export function renderStatements(): string {
  const tabs: Array<['income' | 'balance' | 'debt', string]> = [
    ['income', 'P&L'],
    ['balance', 'Balance'],
    ['debt', 'Debt'],
  ];
  const body =
    state.statementTab === 'income'
      ? renderIncomeStatement()
      : state.statementTab === 'balance'
        ? renderBalanceSheet()
        : renderDebtStatement();
  return `
    <div class="panel-header">
      <div class="panel-title">
        <span class="eyebrow">Financial statements</span>
        <h2>Read before acting</h2>
      </div>
    </div>
    <div class="statement-tabs" role="tablist" aria-label="Statement tabs">
      ${tabs
        .map(
          ([tab, label]) =>
            `<button class="tab-button ${state.statementTab === tab ? 'active' : ''}" type="button" role="tab" data-testid="button-tab-${tab}" data-action="setStatementTab" data-arg="${tab}">${label}</button>`,
        )
        .join('')}
    </div>
    ${body}`;
}
