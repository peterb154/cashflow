import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  backToIntro,
  buildSkill,
  cutExpenses,
  debtSnowballAmount,
  expenseCutAmount,
  initializeRun,
  nextMonth,
  payDebtSnowball,
  setRerender,
  showLifePicker,
  startSpecificProfile,
} from '../game';
import { profiles } from '../data/profiles';
import {
  cashInterestIncome,
  cloneProfile,
  debtPayments,
  fireProgress,
  monthlyCashFlow,
  state,
  totalDebt,
  totalPassiveIncome,
} from '../state';
import type { Profile } from '../types';

function profile(id: string): Profile {
  const found = profiles.find((p) => p.id === id);
  if (!found) throw new Error(`Profile not found: ${id}`);
  return cloneProfile(found);
}

describe('FIRE win condition', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('flips phase to "won" when total passive income covers expenses', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    expect(state.phase).toBe('play');

    state.passiveIncome = state.expenses + 100;

    const before = state.gameWon;
    expect(before).toBe(false);

    nextMonth();
    expect(state.gameWon).toBe(true);
    expect(state.phase).toBe('won');
    expect(fireProgress()).toBe(100);
  });

  it('counts cash interest toward FIRE', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.passiveIncome = 0;
    state.expenses = 100;
    state.cash = 200000;

    expect(cashInterestIncome()).toBe(Math.floor((200000 * 0.08) / 12));
    expect(totalPassiveIncome()).toBeGreaterThan(state.expenses);
  });
});

describe('debt snowball math', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('targets the smallest balance and respects the $1,000 buffer', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 5000;
    state.debts = [
      { name: 'A', balance: 2000, payment: 50, rate: 0.1 },
      { name: 'B', balance: 800, payment: 30, rate: 0.2 },
    ];
    const { target, amount } = debtSnowballAmount();
    expect(target?.name).toBe('B');
    expect(amount).toBe(800);
  });

  it('returns 0 when cash is at or below the buffer', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 1000;
    state.debts = [{ name: 'A', balance: 500, payment: 25, rate: 0.1 }];
    const { amount } = debtSnowballAmount();
    expect(amount).toBe(0);
  });

  it('zeroes out the targeted debt and frees its monthly payment', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 3000;
    state.debts = [{ name: 'CC', balance: 500, payment: 30, rate: 0.2 }];

    const expensesBefore = state.expenses;
    payDebtSnowball();

    expect(state.debts[0].balance).toBe(0);
    expect(state.debts[0].payment).toBe(0);
    expect(state.totalDebtPaid).toBe(500);
    expect(state.cash).toBe(2500);
    expect(state.expenses).toBe(expensesBefore);
    expect(debtPayments()).toBe(0);
  });
});

describe('monthly income/expense math', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('applies cash flow + accrues interest on remaining debt', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');

    const startingCash = state.cash;
    const startingDebt = totalDebt();
    const expectedFlow = monthlyCashFlow();

    nextMonth();

    expect(state.cash).toBe(startingCash + expectedFlow);
    expect(totalDebt()).toBeGreaterThan(0);
    expect(totalDebt()).not.toBe(startingDebt);
    expect(state.month).toBe(2);
    expect(state.lastMonth).not.toBeNull();
    expect(state.lastMonth?.cashFlow).toBe(expectedFlow);
  });

  it('converts cash shortfall into credit-card debt', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 0;
    state.activeIncome = 0;
    state.passiveIncome = 0;
    state.expenses = 1000;
    state.debts = [];

    nextMonth();

    expect(state.cash).toBe(0);
    const cc = state.debts.find((d) => d.name === 'Credit card');
    expect(cc).toBeDefined();
    expect(cc?.balance).toBeGreaterThan(0);
    expect(cc?.rate).toBeCloseTo(0.24);
  });
});

describe('expense cuts and skill building', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('caps expense cuts at the configured ratio and floor', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.expenses = 5000;
    const cut = expenseCutAmount();
    expect(cut).toBeGreaterThan(0);
    expect(cut).toBeLessThanOrEqual(350);
  });

  it('cutExpenses lowers expenses and adds a recurring time obligation', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    const before = state.expenses;
    const beforeAssets = state.assets.length;
    cutExpenses();
    expect(state.expenses).toBeLessThan(before);
    expect(state.assets.length).toBe(beforeAssets + 1);
  });

  it('buildSkill spends time and cash and increases skill', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 5000;
    const beforeSkill = state.skill;
    const beforeCash = state.cash;
    const beforeTime = state.time;

    buildSkill();

    expect(state.skill).toBe(beforeSkill + 1);
    expect(state.cash).toBe(beforeCash - 650);
    expect(state.time).toBe(beforeTime - 2);
  });
});

describe('life picker', () => {
  beforeEach(() => {
    setRerender(() => {});
    state.phase = 'intro';
  });

  it('showLifePicker switches the phase to picking', () => {
    showLifePicker();
    expect(state.phase).toBe('picking');
  });

  it('backToIntro restores the intro phase', () => {
    state.phase = 'picking';
    backToIntro();
    expect(state.phase).toBe('intro');
  });

  it('startSpecificProfile loads the requested profile by id', () => {
    startSpecificProfile('barista');
    expect(state.profile?.id).toBe('barista');
    expect(state.profile?.name).toBe('Beauty School Dropout');
    expect(state.phase).toBe('play');
  });

  it('startSpecificProfile falls back to the first profile for an unknown id', () => {
    startSpecificProfile('does-not-exist');
    expect(state.profile?.id).toBe(profiles[0].id);
  });
});

afterEach(() => {
  state.toast = null;
  state.gameWon = false;
});
