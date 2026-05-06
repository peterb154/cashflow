import {
  ASSET_TERMINAL_BOOK_VALUE_RATIO,
  CREDIT_CARD_RATE,
  DOODAD_DRAW_THRESHOLD,
  EMERGENCY_BUFFER,
  EXIT_CARD_PROBABILITY,
  EXIT_MARKET_FACTOR_MIN,
  EXIT_MARKET_FACTOR_RANGE,
  EXPENSE_CUT_CAP,
  EXPENSE_CUT_RATIO,
  MIN_EXPENSES_FLOOR,
  MIN_JOB_TIME,
  OPPORTUNITY_DRAW_THRESHOLD,
  SKILL_BUILD_COST,
  SKILL_INCOME_BUMP,
  STARTING_TIME,
  SYSTEMATIZE_COST,
  SYSTEMATIZE_VALUE_GAIN,
  TOAST_DURATION_MS,
} from './config';
import { doodads } from './data/doodads';
import { events } from './data/events';
import { familyStarts } from './data/family-starts';
import { opportunities } from './data/opportunities';
import { profiles } from './data/profiles';
import { money } from './format';
import { random, randomFrom } from './rng';
import {
  cloneProfile,
  familyExpense,
  familyLabel,
  familyTime,
  monthlyCashFlow,
  monthlyTimeCapacity,
  snapshot,
  state,
  truePassiveIncome,
} from './state';
import type { Asset, Card, EventCard, ExitCard, Family, Profile } from './types';

let rerender: () => void = () => {};
let toastTimer: ReturnType<typeof setTimeout> | null = null;

export function setRerender(fn: () => void): void {
  rerender = fn;
}

function render(): void {
  rerender();
}

export function showToast(title: string, detail: string): void {
  state.toast = { title, detail };
  if (toastTimer) clearTimeout(toastTimer);
  render();
  toastTimer = setTimeout(() => {
    state.toast = null;
    render();
  }, TOAST_DURATION_MS);
}

function exitCandidates(): Asset[] {
  return state.assets.filter((asset): asset is Asset & { terminalValue: number } => {
    return typeof asset.terminalValue === 'number' && asset.terminalValue > asset.value;
  });
}

function buildExitCard(asset: Asset): ExitCard {
  const marketFactor = EXIT_MARKET_FACTOR_MIN + random() * EXIT_MARKET_FACTOR_RANGE;
  const offer = Math.max(asset.value, Math.round((asset.terminalValue ?? 0) * marketFactor));
  return {
    type: 'exit',
    title: `Exit offer: ${asset.name}`,
    description: `A buyer shows up for ${asset.name}. You can turn future upside into cash now, but you lose the monthly cash flow and any time burden attached to it.`,
    assetId: asset.id ?? asset.name,
    assetName: asset.name,
    offerValue: offer,
    passiveLost: asset.passive ?? 0,
    timeFreed: asset.recurringTime ?? 0,
    lesson: 'An exit is not just a big number. Compare liquidity today against lost cash flow, lost optionality, and whether the asset still consumes your time.',
  };
}

export function drawCard(): Card {
  const candidates = exitCandidates();
  if (candidates.length && random() < EXIT_CARD_PROBABILITY) {
    return buildExitCard(randomFrom(candidates));
  }
  const roll = random();
  if (roll < OPPORTUNITY_DRAW_THRESHOLD) return { ...randomFrom(opportunities) };
  if (roll < DOODAD_DRAW_THRESHOLD) return { ...randomFrom(doodads) };
  return { ...randomFrom(eligibleEvents()) };
}

// Singles are ~4x less likely to roll a new-baby card than married couples.
// new-baby stays in the pool only ~1 in 4 draws when single; always when married.
const SINGLE_NEW_BABY_PROB = 0.25;

function eligibleEvents(): EventCard[] {
  const married = state.family?.status === 'married';
  return events.filter((event) => {
    if (event.familyAction === 'marry' && married) return false;
    if (event.familyAction === 'divorce' && !married) return false;
    if (event.familyAction === 'addKid' && !married && random() > SINGLE_NEW_BABY_PROB) return false;
    return true;
  });
}

export function initializeRun(
  profile: Profile,
  family: Family = randomFrom(familyStarts),
  logVerb = 'Rolled life',
): void {
  state.profile = profile;
  state.month = 1;
  state.family = { ...(profile.defaultFamily ?? family) };
  state.cash = profile.cash;
  state.activeIncome = profile.activeIncome;
  state.passiveIncome = profile.passiveIncome;
  state.expenses = profile.expenses + familyExpense();
  state.debts = profile.debts;
  state.assets = profile.assets;
  state.skill = profile.skill;
  state.baseTime = STARTING_TIME;
  state.time = monthlyTimeCapacity();
  state.currentCard = drawCard();
  state.phase = 'play';
  state.log = [
    `${logVerb}: ${profile.name}. Family roll: ${familyLabel()}.`,
    `Challenge: ${profile.challenge}`,
    `Hidden advantage: ${profile.hiddenAdvantage}`,
  ];
  state.totalDoodads = 0;
  state.totalDebtPaid = 0;
  state.expenseCuts = 0;
  state.gameWon = false;
  state.actionTakenThisMonth = false;
  state.lastMonth = null;
  showToast(
    logVerb,
    `${profile.name}: ${profile.role}. ${familyLabel()} adds ${familyTime()} obligated time and ${money(familyExpense())}/mo.`,
  );
  render();
}

export function rollLife(): void {
  const selected = cloneProfile(randomFrom(profiles));
  initializeRun(selected, selected.defaultFamily ?? randomFrom(familyStarts), 'Rolled life');
}

export function startSpecificProfile(id: string): void {
  const found = profiles.find((item) => item.id === id) ?? profiles[0];
  const profile = cloneProfile(found);
  const family =
    profile.defaultFamily ?? state.pickerFamilies[profile.id] ?? randomFrom(familyStarts);
  initializeRun(profile, family, 'Selected life');
}

function rollPickerFamilies(): void {
  const next: Record<string, Family> = {};
  for (const profile of profiles) {
    if (!profile.defaultFamily) {
      const sample = randomFrom(familyStarts);
      next[profile.id] = { status: sample.status, kids: sample.kids };
    }
  }
  state.pickerFamilies = next;
}

export function rerollPickerFamily(profileId: string): void {
  const profile = profiles.find((p) => p.id === profileId);
  if (!profile || profile.defaultFamily) return;
  const sample = randomFrom(familyStarts);
  state.pickerFamilies = {
    ...state.pickerFamilies,
    [profileId]: { status: sample.status, kids: sample.kids },
  };
  render();
}

function addDebtInterest(): void {
  state.debts.forEach((debt) => {
    if (debt.balance <= 0 || debt.rate <= 0) return;
    const monthlyInterest = debt.balance * (debt.rate / 12);
    const principalPayment = Math.max(0, debt.payment - monthlyInterest);
    debt.balance = Math.max(0, debt.balance + monthlyInterest - principalPayment);
  });
  state.debts = state.debts.filter((debt) => debt.balance > 1 || debt.payment > 0);
}

function addOrIncreaseDebt(name: string, amount: number, payment: number, rate: number): void {
  const existing = state.debts.find((debt) => debt.name === name);
  if (existing) {
    existing.balance += amount;
    existing.payment += payment;
  } else {
    state.debts.push({ name, balance: amount, payment, rate });
  }
}

function checkWin(): void {
  if (truePassiveIncome() >= state.expenses && !state.gameWon) {
    state.gameWon = true;
    state.phase = 'won';
    state.log.unshift(`Reached FIRE in month ${state.month}: truly passive income exceeds expenses.`);
  }
}

export function nextMonth(): void {
  const before = snapshot();
  const cashFlow = monthlyCashFlow();
  state.cash += cashFlow;
  addDebtInterest();
  if (state.cash < 0) {
    const shortage = Math.abs(state.cash);
    state.cash = 0;
    addOrIncreaseDebt('Credit card', shortage, Math.max(35, Math.round(shortage * 0.035)), CREDIT_CARD_RATE);
    state.log.unshift(`Month ${state.month}: cash shortfall became ${money(shortage)} of credit card debt.`);
  }
  state.month += 1;
  state.time = monthlyTimeCapacity();
  state.actionTakenThisMonth = false;
  state.currentCard = drawCard();
  state.lastMonth = {
    before,
    after: snapshot(),
    cashFlow,
  };
  checkWin();
  state.log.unshift(`Month ${state.month - 1} closed with ${money(cashFlow)} net cash flow.`);
  render();
}

function canAfford(cost: number): boolean {
  return state.cash >= cost;
}

export function opportunityBlockers(card: { cost: number; timeCost: number; skillRequired: number }): string[] {
  const blockers: string[] = [];
  if (state.cash < card.cost) blockers.push(`cash: need ${money(card.cost)}, have ${money(state.cash)}`);
  if (state.time < card.timeCost) blockers.push(`time: need ${card.timeCost}, have ${state.time}`);
  if (state.skill < card.skillRequired) blockers.push(`business skill: need ${card.skillRequired}/10, have ${state.skill}/10`);
  return blockers;
}

export function debtSnowballAmount(): { target: { name: string; balance: number; payment: number; rate: number } | null; amount: number } {
  const activeDebts = state.debts.filter((debt) => debt.balance > 0).sort((a, b) => a.balance - b.balance);
  if (!activeDebts.length) return { target: null, amount: 0 };
  const target = activeDebts[0];
  const available = Math.max(0, state.cash - EMERGENCY_BUFFER);
  return { target, amount: Math.min(available, target.balance) };
}

export function expenseCutAmount(): number {
  const intendedCut = Math.min(state.expenses * EXPENSE_CUT_RATIO, EXPENSE_CUT_CAP);
  return Math.max(0, state.expenses - Math.max(MIN_EXPENSES_FLOOR, state.expenses - intendedCut));
}

export function bestSellableAsset(): Asset | null {
  return state.assets.filter((asset) => asset.sellable).sort((a, b) => b.value - a.value)[0] ?? null;
}

export function bestSystematizeAsset(): Asset | null {
  return (
    state.assets
      .filter((asset) => (asset.recurringTime ?? 0) > 0)
      .sort((a, b) => (b.recurringTime ?? 0) - (a.recurringTime ?? 0))[0] ?? null
  );
}

function applyFamilyEvent(card: EventCard): void {
  const beforeTime = familyTime();
  const beforeExpense = familyExpense();
  if (!state.family) state.family = { status: 'single', kids: 0 };
  if (card.familyAction === 'addKid') {
    state.family.kids += 1;
  }
  if (card.familyAction === 'marry') {
    state.family.status = 'married';
  }
  if (card.familyAction === 'divorce') {
    state.family.status = 'single';
  }
  const timeDelta = familyTime() - beforeTime;
  const expenseDelta = familyExpense() - beforeExpense;
  state.expenses += expenseDelta;
  state.time = Math.min(state.time, monthlyTimeCapacity());
  state.log.unshift(
    `Family changed: ${familyLabel()}. Obligated time changed by ${timeDelta} and expenses changed by ${money(expenseDelta)}/mo.`,
  );
}

export function acceptCard(): void {
  const card = state.currentCard;
  if (!card) return;

  if (card.type === 'opportunity') {
    const blockers = opportunityBlockers(card);
    if (blockers.length) {
      showToast('You can’t take this deal yet', blockers.join(' • '));
      return;
    }
    state.cash -= card.cost;
    state.passiveIncome += Math.max(0, card.cashFlow);
    if (card.cashFlow < 0) {
      state.expenses += Math.abs(card.cashFlow);
    }
    state.time = Math.max(0, state.time - card.timeCost);
    state.assets.push({
      id: `${card.id}-${state.month}-${state.assets.length}`,
      name: card.assetName,
      value: card.value + (card.terminalValue ? Math.round(card.terminalValue * ASSET_TERMINAL_BOOK_VALUE_RATIO) : 0),
      terminalValue: card.terminalValue ?? null,
      passive: Math.max(0, card.cashFlow),
      sellable: card.sellability !== 'Low',
      recurringTime: card.recurringTime ?? 0,
    });
    state.log.unshift(
      `Took opportunity: ${card.title}. Passive income changed by ${money(Math.max(0, card.cashFlow))}/mo and ${card.recurringTime ?? 0} time is now committed monthly.`,
    );
    showToast('Opportunity accepted', card.lesson);
  }

  if (card.type === 'doodad') {
    if (card.cost > 0 && !canAfford(card.cost)) {
      const shortfall = card.cost - state.cash;
      state.cash = 0;
      addOrIncreaseDebt('Credit card', shortfall, Math.max(35, Math.round(shortfall * 0.035)), CREDIT_CARD_RATE);
    } else {
      state.cash -= card.cost;
    }
    const netExpenseChange = (card.expenseChange ?? 0) - (card.expenseReduction ?? 0);
    state.expenses += netExpenseChange;
    if (card.timeChange) {
      state.baseTime += card.timeChange;
      state.time = Math.max(0, Math.min(monthlyTimeCapacity(), state.time + card.timeChange));
    }
    state.totalDoodads += card.cost + netExpenseChange * 12;
    state.log.unshift(
      `Bought doodad: ${card.title}. Net expenses changed by ${money(netExpenseChange)}/mo${card.timeChange ? ` and time changed by ${card.timeChange}` : ''}.`,
    );
    showToast('Doodad accepted', card.lesson);
  }

  if (card.type === 'event') {
    if (card.familyAction) {
      applyFamilyEvent(card);
    }
    if (card.cost < 0) {
      state.cash += Math.abs(card.cost);
    } else if (card.cost > 0 && canAfford(card.cost)) {
      state.cash -= card.cost;
    } else if (card.cost > 0) {
      const shortage = card.cost - state.cash;
      state.cash = 0;
      addOrIncreaseDebt('Credit card', shortage, Math.max(35, Math.round(shortage * 0.035)), CREDIT_CARD_RATE);
    }
    state.expenses += card.expenseChange ?? 0;
    state.activeIncome += card.incomeChange ?? 0;
    state.log.unshift(`Event resolved: ${card.title}.`);
    showToast('Life happened', card.lesson);
  }

  if (card.type === 'exit') {
    const asset = state.assets.find((item) => item.id === card.assetId);
    if (!asset) {
      showToast('Exit expired', 'That asset is no longer on your balance sheet.');
      state.currentCard = null;
      render();
      return;
    }
    state.cash += card.offerValue;
    state.passiveIncome = Math.max(0, state.passiveIncome - (asset.passive ?? 0));
    state.assets = state.assets.filter((item) => item !== asset);
    state.time = Math.min(monthlyTimeCapacity(), state.time + (asset.recurringTime ?? 0));
    state.log.unshift(
      `Accepted exit: ${asset.name} sold for ${money(card.offerValue)}. Lost ${money(asset.passive ?? 0)}/mo passive income and freed ${asset.recurringTime ?? 0} time.`,
    );
    showToast('Exit accepted', 'Cash increased, but the asset and its monthly income are gone.');
  }

  state.currentCard = null;
  checkWin();
  render();
}

export function passCard(): void {
  const card = state.currentCard;
  if (!card) return;
  if (card.type === 'event' && card.required) {
    showToast('This life event is not optional', 'Resolve it and then manage through the time and cash-flow impact.');
    return;
  }
  state.log.unshift(`Passed: ${card.title}.`);
  showToast('Passed', card.type === 'doodad' ? 'That restraint kept your FIRE number lower.' : card.lesson);
  state.currentCard = null;
  render();
}

export function payDebtSnowball(): void {
  if (!actionAvailable()) return;
  const { target, amount } = debtSnowballAmount();
  if (!target) {
    showToast('No consumer debt', 'You have no active debts to snowball.');
    return;
  }
  if (amount <= 0) {
    showToast('Keep the buffer', `Debt snowball uses all cash above a ${money(EMERGENCY_BUFFER)} emergency buffer. You have nothing extra right now.`);
    return;
  }
  consumeMonthlyAction();
  state.cash -= amount;
  target.balance = Math.max(0, target.balance - amount);
  state.totalDebtPaid += amount;
  if (target.balance === 0) {
    state.expenses = Math.max(0, state.expenses);
    state.log.unshift(`Debt killed: ${target.name}. Freed ${money(target.payment)}/mo of required payments.`);
    target.payment = 0;
  } else {
    state.log.unshift(`Debt snowball: paid ${money(amount)} toward ${target.name}.`);
  }
  showToast('Debt snowball', `Paid ${money(amount)} toward ${target.name}.`);
  checkWin();
  render();
}

function spendTime(amount: number, label: string): boolean {
  if (state.time < amount) {
    showToast('No time left', `${label} needs ${amount} time. Close the month or free up capacity.`);
    return false;
  }
  state.time -= amount;
  return true;
}

function actionAvailable(): boolean {
  if (state.actionTakenThisMonth) {
    showToast(
      'One action per month',
      'You\'ve already used this month\'s action. Close the month to take another.',
    );
    return false;
  }
  return true;
}

function consumeMonthlyAction(): void {
  state.actionTakenThisMonth = true;
}

export function cutExpenses(): void {
  if (!actionAvailable()) return;
  if (!spendTime(1, 'expense audit')) return;
  const cut = expenseCutAmount();
  if (cut <= 0) {
    state.time += 1;
    showToast('No more easy cuts', 'Your living expenses are already at the minimum floor.');
    return;
  }
  consumeMonthlyAction();
  state.expenses = Math.max(MIN_EXPENSES_FLOOR, state.expenses - cut);
  state.assets.push({
    name: 'DIY expense cuts',
    value: 0,
    passive: 0,
    sellable: false,
    recurringTime: 1,
  });
  state.expenseCuts += cut;
  state.log.unshift(`Expense audit cut the monthly run rate by ${money(cut)} but added 1 recurring time commitment.`);
  showToast('Run rate lowered', `You traded 1 recurring time for ${money(cut)}/mo of lower expenses.`);
  checkWin();
  render();
}

export function buildSkill(): void {
  if (!actionAvailable()) return;
  if (!spendTime(2, 'skill building')) return;
  if (!canAfford(SKILL_BUILD_COST)) {
    state.time += 2;
    showToast('Need cash', `Skill-building costs ${money(SKILL_BUILD_COST)} this month.`);
    return;
  }
  consumeMonthlyAction();
  state.cash -= SKILL_BUILD_COST;
  state.skill = Math.min(10, state.skill + 1);
  if (state.skill % 2 === 0) {
    state.activeIncome += SKILL_INCOME_BUMP;
  }
  state.log.unshift(`Invested in business skill. Business skill is now ${state.skill}/10.`);
  showToast('Business skill built', 'Higher business skill unlocks better opportunities and can increase active income.');
  render();
}

export function sellAsset(): void {
  if (!actionAvailable()) return;
  const asset = bestSellableAsset();
  if (!asset) {
    showToast('No sellable asset', 'Some assets create value but cannot be easily sold yet.');
    return;
  }
  consumeMonthlyAction();
  state.cash += asset.value;
  state.passiveIncome = Math.max(0, state.passiveIncome - asset.passive);
  state.assets = state.assets.filter((item) => item !== asset);
  state.log.unshift(`Sold ${asset.name} for ${money(asset.value)}. Passive income fell by ${money(asset.passive)}/mo.`);
  showToast('Asset sold', 'Liquidity is useful, but selling cash-flow assets can move FIRE farther away.');
  render();
}

export function perShiftIncome(): number {
  if (!state.profile || state.profile.jobTime <= 0) return 0;
  return Math.round(state.activeIncome / state.profile.jobTime);
}

export function reduceHours(): void {
  if (!state.profile) return;
  if (state.profile.jobTime <= MIN_JOB_TIME) {
    showToast('Already minimum hours', `Can't go below ${MIN_JOB_TIME} unit of paid work.`);
    return;
  }
  if (!actionAvailable()) return;
  consumeMonthlyAction();
  const perShift = perShiftIncome();
  state.profile.jobTime -= 1;
  state.activeIncome = Math.max(0, state.activeIncome - perShift);
  state.time = Math.min(monthlyTimeCapacity(), state.time + 1);
  state.log.unshift(
    `Reduced hours: -${money(perShift)}/mo income, +1 free time/mo. Job is now ${state.profile.jobTime} units/mo.`,
  );
  showToast(
    'Hours reduced',
    'Less income, more time — every month going forward, until you take more hours.',
  );
  render();
}

export function increaseHours(): void {
  if (!state.profile) return;
  if (!actionAvailable()) return;
  consumeMonthlyAction();
  const perShift = perShiftIncome();
  state.profile.jobTime += 1;
  state.activeIncome += perShift;
  state.time = Math.max(0, state.time - 1);
  state.log.unshift(
    `Took on more hours: +${money(perShift)}/mo income, -1 free time/mo. Job is now ${state.profile.jobTime} units/mo.`,
  );
  showToast('Hours increased', 'More income, less time — every month going forward.');
  render();
}

export function systematizeBusiness(): void {
  const asset = bestSystematizeAsset();
  if (!asset) {
    showToast('Nothing to systematize', 'You need a time-consuming business before systems can buy back your calendar.');
    return;
  }
  if (!canAfford(SYSTEMATIZE_COST)) {
    showToast('Need cash', `Systems, delegation, or process cleanup costs ${money(SYSTEMATIZE_COST)}.`);
    return;
  }
  if (!actionAvailable()) return;
  consumeMonthlyAction();
  state.cash -= SYSTEMATIZE_COST;
  const wasActive = (asset.recurringTime ?? 0) > 0;
  asset.recurringTime = Math.max(0, (asset.recurringTime ?? 0) - 1);
  const justGraduated = wasActive && asset.recurringTime === 0;
  state.time = Math.min(monthlyTimeCapacity(), state.time + 1);
  asset.value += SYSTEMATIZE_VALUE_GAIN;
  state.log.unshift(
    `Systematized ${asset.name}. Monthly time commitment fell by 1${justGraduated ? ` — now truly passive, ${money(asset.passive)}/mo counts toward FIRE` : ''}.`,
  );
  showToast(
    justGraduated ? 'Now truly passive' : 'Calendar bought back',
    justGraduated
      ? `${asset.name} no longer needs your time — its ${money(asset.passive)}/mo counts toward FIRE.`
      : 'Systems turn a hustle into more of an asset.',
  );
  render();
}

export function resetGame(): void {
  state.phase = 'intro';
  state.profile = null;
  state.toast = null;
  render();
}

export function setStatementTab(tab: 'income' | 'balance' | 'debt'): void {
  state.statementTab = tab;
  render();
}

export function continuePlay(): void {
  state.phase = 'play';
  render();
}

export function showLifePicker(): void {
  rollPickerFamilies();
  state.phase = 'picking';
  render();
}

export function backToIntro(): void {
  state.phase = 'intro';
  render();
}
