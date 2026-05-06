import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  acceptCard,
  backToIntro,
  buildSkill,
  cutExpenses,
  debtSnowballAmount,
  expenseCutAmount,
  increaseHours,
  initializeRun,
  nextMonth,
  payDebtSnowball,
  perShiftIncome,
  reduceHours,
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
  truePassiveIncome,
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

  it('flips phase to "won" when truly passive income covers expenses', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    expect(state.phase).toBe('play');

    // Bump the truly-passive (no recurringTime) starting asset to cover expenses.
    const portfolio = state.assets[0];
    portfolio.passive = state.expenses + 100;
    state.passiveIncome = portfolio.passive;

    nextMonth();
    expect(state.gameWon).toBe(true);
    expect(state.phase).toBe('won');
    expect(fireProgress()).toBe(100);
  });

  it('truePassiveIncome excludes assets with recurringTime > 0', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 0;
    state.assets = [
      {
        name: 'Consulting gig',
        value: 1000,
        passive: 5000,
        sellable: false,
        recurringTime: 3,
      },
    ];
    state.passiveIncome = 5000;

    expect(truePassiveIncome()).toBe(0);
  });

  it('systematizing a business graduates its income to FIRE-counting passive', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.assets = [
      {
        name: 'Consulting gig',
        value: 1000,
        passive: 800,
        sellable: false,
        recurringTime: 1,
      },
    ];
    state.passiveIncome = 800;
    state.cash = 0;

    expect(truePassiveIncome()).toBe(0);

    state.assets[0].recurringTime = 0;

    expect(truePassiveIncome()).toBe(800);
  });

  it('counts cash interest toward FIRE', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 200000;

    expect(cashInterestIncome()).toBe(Math.floor((200000 * 0.08) / 12));
    expect(truePassiveIncome()).toBeGreaterThan(0);
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

describe('hours trade', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('reduceHours drops 1 jobTime and income proportional to per-shift rate', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    const startingJobTime = state.profile!.jobTime;
    const startingIncome = state.activeIncome;
    const startingTime = state.time;
    const expectedPerShift = perShiftIncome();

    reduceHours();

    expect(state.profile!.jobTime).toBe(startingJobTime - 1);
    expect(state.activeIncome).toBe(startingIncome - expectedPerShift);
    expect(state.time).toBe(startingTime + 1);
  });

  it('increaseHours raises 1 jobTime and income at current per-shift rate', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    const startingJobTime = state.profile!.jobTime;
    const startingIncome = state.activeIncome;
    const expectedPerShift = perShiftIncome();

    increaseHours();

    expect(state.profile!.jobTime).toBe(startingJobTime + 1);
    expect(state.activeIncome).toBe(startingIncome + expectedPerShift);
  });

  it('refuses to reduce hours below the floor', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.profile!.jobTime = 1;
    const before = state.activeIncome;

    reduceHours();

    expect(state.profile!.jobTime).toBe(1);
    expect(state.activeIncome).toBe(before);
  });

  it('lets a single parent claw back free time by reducing hours over two months', () => {
    const nurse = profile('single-parent');
    initializeRun(nurse, { status: 'single', kids: 2 }, 'test');
    // jobTime 5, kids 2 × 3 = 6 obligated → capacity = 10 - 5 - 6 = -1 (clamped 0)
    expect(state.time).toBe(0);

    // Month 1 drop: capacity = 10 - 4 - 6 = 0, still pinned at 0.
    reduceHours();
    expect(state.profile!.jobTime).toBe(4);
    expect(state.time).toBe(0);

    // Close the month so a second action becomes available.
    nextMonth();

    // Month 2 drop: capacity = 10 - 3 - 6 = 1, finally has a free unit.
    reduceHours();
    expect(state.profile!.jobTime).toBe(3);
    expect(state.time).toBe(1);
    expect(state.activeIncome).toBeLessThan(6100);
  });
});

describe('one action per month', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('blocks a second action after the first succeeds', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 5000;
    state.debts = [{ name: 'Card', balance: 800, payment: 30, rate: 0.2 }];

    payDebtSnowball();
    expect(state.actionTakenThisMonth).toBe(true);

    const cashAfter = state.cash;
    const incomeAfter = state.activeIncome;
    reduceHours();

    expect(state.activeIncome).toBe(incomeAfter);
    expect(state.cash).toBe(cashAfter);
  });

  it('resets the action slot when the month closes', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 5000;
    state.debts = [{ name: 'Card', balance: 800, payment: 30, rate: 0.2 }];

    payDebtSnowball();
    expect(state.actionTakenThisMonth).toBe(true);

    nextMonth();
    expect(state.actionTakenThisMonth).toBe(false);
  });
});

describe('single-parent kid time burden', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('charges 3 time units per kid for a single parent (clamped at 0)', () => {
    const nurse = profile('single-parent');
    initializeRun(nurse, { status: 'single', kids: 2 }, 'test');
    expect(state.family?.status).toBe('single');
    expect(state.family?.kids).toBe(2);
    expect(state.time).toBe(0);
  });

  it('charges 1.5 time units per kid for a married parent', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'married', kids: 2 }, 'test');
    expect(state.family?.status).toBe('married');
    expect(state.family?.kids).toBe(2);
    expect(state.time).toBe(state.baseTime - state.profile!.jobTime - 3);
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

describe('doodad timeChange', () => {
  beforeEach(() => {
    setRerender(() => {});
  });

  it('persists across nextMonth (recurring effect, not one-shot)', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 5000;
    const startBaseTime = state.baseTime;

    state.currentCard = {
      id: 'closer-apartment',
      type: 'doodad',
      title: 'Move closer to work',
      description: '',
      whisper: '',
      cost: 0,
      expenseChange: 0,
      timeChange: 1,
      happiness: 0,
      lesson: '',
    };
    acceptCard();

    expect(state.baseTime).toBe(startBaseTime + 1);

    nextMonth();
    expect(state.baseTime).toBe(startBaseTime + 1); // still bumped after a month
  });

  it('negative timeChange reduces baseTime permanently', () => {
    const developer = profile('developer');
    initializeRun(developer, { status: 'single', kids: 0 }, 'test');
    state.cash = 5000;
    const startBaseTime = state.baseTime;

    state.currentCard = {
      id: 'pet-adoption',
      type: 'doodad',
      title: 'Adopt a dog',
      description: '',
      whisper: '',
      cost: 0,
      expenseChange: 0,
      timeChange: -1,
      happiness: 0,
      lesson: '',
    };
    acceptCard();

    expect(state.baseTime).toBe(startBaseTime - 1);
  });
});

afterEach(() => {
  state.toast = null;
  state.gameWon = false;
});
