import { money, percent } from '../format';
import {
  assetValue,
  cashInterestIncome,
  debtPayments,
  monthlyCashFlow,
  monthlyTimeCapacity,
  netWorth,
  obligatedTime,
  state,
  timeUsageRows,
  totalDebt,
  totalPassiveIncome,
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
  const timeRows: Array<[string, string]> = timeUsageRows().map(([label, amount]) => [
    `Time use: ${label}`,
    `-${amount}/10 units`,
  ]);
  const rows: Array<[string, string]> = [
    ['Time inventory', ''],
    ['Monthly time budget', `${state.baseTime}/10 units`],
    ...timeRows,
    ['Time already obligated', `-${obligatedTime()}/10 units`],
    ['Usable time this month', `${monthlyTimeCapacity()}/10 units`],
    ['Cash P&L', ''],
    ['Active income', money(state.activeIncome)],
    ['Asset passive income', money(state.passiveIncome)],
    ['Cash interest income (8% APY)', money(cashInterestIncome())],
    ['Total passive income', money(totalPassiveIncome())],
    ['Living expenses', `-${money(state.expenses)}`],
    ['Debt payments', `-${money(debtPayments())}`],
    ['Net monthly cash flow', money(monthlyCashFlow())],
  ];
  return renderRows(rows);
}

function renderBalanceSheet(): string {
  const rows: Array<[string, string]> = [
    ['Cash', money(state.cash)],
    ['Asset value', money(assetValue())],
    ['Total debt', `-${money(totalDebt())}`],
    ['Net worth', money(netWorth())],
    ['Free time inventory', `${state.time}/10 units`],
    ['Obligated time liability', `-${obligatedTime()}/10 units`],
    ['Business skill asset', `${state.skill}/10`],
  ];
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
