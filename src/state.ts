import {
  CASH_INTEREST_APY,
  FAMILY_KID_EXPENSE,
  FAMILY_KID_TIME_MARRIED,
  FAMILY_KID_TIME_SINGLE,
  FAMILY_MARRIAGE_EXPENSE,
  STARTING_TIME,
} from './config';
import type { Asset, Debt, GameState, Profile, Snapshot } from './types';

export const state: GameState = {
  phase: 'intro',
  profile: null,
  month: 1,
  cash: 0,
  activeIncome: 0,
  passiveIncome: 0,
  expenses: 0,
  debts: [],
  assets: [],
  skill: 0,
  baseTime: 0,
  time: 0,
  family: null,
  currentCard: null,
  statementTab: 'income',
  log: [],
  toast: null,
  lastMonth: null,
  totalDoodads: 0,
  totalDebtPaid: 0,
  expenseCuts: 0,
  gameWon: false,
  actionTakenThisMonth: null,
  assetPickerMode: null,
  runStart: null,
  pickerFamilies: {},
};

export function cloneProfile(profile: Profile): Profile {
  return {
    ...profile,
    debts: profile.debts.map((debt: Debt) => ({ ...debt })),
    assets: profile.assets.map((asset: Asset) => ({ ...asset })),
  };
}

export function totalDebt(): number {
  return state.debts.reduce((sum, debt) => sum + Math.max(0, debt.balance), 0);
}

export function debtPayments(): number {
  return state.debts.reduce((sum, debt) => sum + (debt.balance > 0 ? debt.payment : 0), 0);
}

export function recurringTime(): number {
  return state.assets.reduce((sum, asset) => sum + (asset.recurringTime ?? 0), 0);
}

export function jobTime(): number {
  return state.profile?.jobTime ?? 0;
}

export function familyTime(): number {
  if (!state.family) return 0;
  const perKid = state.family.status === 'married' ? FAMILY_KID_TIME_MARRIED : FAMILY_KID_TIME_SINGLE;
  return state.family.kids * perKid;
}

export function familyExpense(): number {
  if (!state.family) return 0;
  return state.family.kids * FAMILY_KID_EXPENSE + (state.family.status === 'married' ? FAMILY_MARRIAGE_EXPENSE : 0);
}

export function familyLabel(): string {
  if (!state.family) return 'No family roll';
  const kidsLabel = state.family.kids === 1 ? '1 kid' : `${state.family.kids} kids`;
  if (state.family.kids === 0) return state.family.status === 'married' ? 'Married, no kids' : 'Single, no kids';
  return `${state.family.status === 'married' ? 'Married' : 'Single parent'}, ${kidsLabel}`;
}

export function monthlyTimeCapacity(): number {
  return Math.max(0, state.baseTime - jobTime() - recurringTime() - familyTime());
}

export function obligatedTime(): number {
  return jobTime() + familyTime() + recurringTime();
}

export function timeUsageRows(): Array<[string, number]> {
  const rows: Array<[string, number]> = [];
  if (jobTime()) {
    rows.push([state.profile?.jobLabel ?? `${state.profile?.name ?? 'Job'} work`, jobTime()]);
  }
  if (state.family?.kids) {
    const married = state.family.status === 'married';
    const perKid = married ? FAMILY_KID_TIME_MARRIED : FAMILY_KID_TIME_SINGLE;
    const kidsLabel = state.family.kids === 1 ? '1 kid' : `${state.family.kids} kids`;
    const context = married ? 'married — shared' : 'single parent — no spouse to split';
    rows.push([`${kidsLabel} × ${perKid} time/kid (${context})`, familyTime()]);
  } else if (state.family?.status === 'married') {
    rows.push(['Marriage / household coordination', familyTime()]);
  }
  state.assets
    .filter((asset) => (asset.recurringTime ?? 0) !== 0)
    .forEach((asset) => rows.push([asset.name, asset.recurringTime ?? 0]));
  return rows;
}

export function cashInterestIncome(): number {
  return Math.floor((state.cash * CASH_INTEREST_APY) / 12);
}

export function passiveAssetIncome(): number {
  return state.assets
    .filter((asset) => (asset.recurringTime ?? 0) === 0)
    .reduce((sum, asset) => sum + asset.passive, 0);
}

export function activeAssetIncome(): number {
  return state.assets
    .filter((asset) => (asset.recurringTime ?? 0) > 0)
    .reduce((sum, asset) => sum + asset.passive, 0);
}

export function totalPassiveIncome(): number {
  return state.passiveIncome + cashInterestIncome();
}

export function truePassiveIncome(): number {
  return passiveAssetIncome() + cashInterestIncome();
}

export function assetValue(): number {
  return state.assets.reduce((sum, asset) => sum + asset.value, 0);
}

export function netWorth(): number {
  return state.cash + assetValue() - totalDebt();
}

export function monthlyCashFlow(): number {
  return state.activeIncome + totalPassiveIncome() - state.expenses - debtPayments();
}

export function fireProgress(): number {
  if (state.expenses <= 0) return 100;
  return Math.min(100, Math.max(0, (truePassiveIncome() / state.expenses) * 100));
}

export function fireGap(): number {
  return Math.max(0, state.expenses - truePassiveIncome());
}

export function runwayMonths(): number {
  const burn = Math.max(0, -monthlyCashFlow());
  if (burn === 0) return Infinity;
  return state.cash / burn;
}

export function snapshot(): Snapshot {
  return {
    cash: state.cash,
    activeIncome: state.activeIncome,
    passiveIncome: totalPassiveIncome(),
    assetPassiveIncome: state.passiveIncome,
    cashInterestIncome: cashInterestIncome(),
    expenses: state.expenses,
    debt: totalDebt(),
    debtPayments: debtPayments(),
    netWorth: netWorth(),
    cashFlow: monthlyCashFlow(),
    fireProgress: fireProgress(),
    timeRemaining: state.time,
    timeCapacity: monthlyTimeCapacity(),
    recurringTime: recurringTime(),
  };
}

export function resetState(): void {
  state.phase = 'intro';
  state.profile = null;
  state.toast = null;
}

export const STARTING_BASE_TIME = STARTING_TIME;
