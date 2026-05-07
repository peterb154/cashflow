import './style.css';

import {
  acceptCard,
  backToIntro,
  buildSkill,
  closeAssetPicker,
  continuePlay,
  copyShareText,
  cutExpenses,
  increaseHours,
  nextMonth,
  passCard,
  payDebtSnowball,
  reduceHours,
  rerollPickerFamily,
  resetGame,
  rollLife,
  sellAsset,
  sellAssetByIndex,
  setRerender,
  setStatementTab,
  showLifePicker,
  startSpecificProfile,
  systematizeAssetByIndex,
  systematizeBusiness,
} from './game';
import { render } from './render';
import {
  activeAssetIncome,
  cashInterestIncome,
  debtPayments,
  familyLabel,
  familyTime,
  fireProgress,
  monthlyCashFlow,
  monthlyTimeCapacity,
  passiveAssetIncome,
  recurringTime,
  state,
  totalDebt,
  totalPassiveIncome,
  truePassiveIncome,
} from './state';
import { setThemeChangeListener, toggleTheme } from './theme';
import type { StatementTab } from './types';

const app = document.getElementById('app');
if (!app) {
  throw new Error('Missing #app root element');
}
const root = app;

function rerender(): void {
  render(root);
}

setRerender(rerender);
setThemeChangeListener(rerender);

type Action = (arg: string | undefined) => void;

const actions: Record<string, Action> = {
  rollLife: () => rollLife(),
  toggleTheme: () => toggleTheme(),
  acceptCard: () => acceptCard(),
  passCard: () => passCard(),
  nextMonth: () => nextMonth(),
  payDebtSnowball: () => payDebtSnowball(),
  cutExpenses: () => cutExpenses(),
  buildSkill: () => buildSkill(),
  sellAsset: () => sellAsset(),
  sellAssetByIndex: (arg) => {
    const i = Number.parseInt(arg ?? '', 10);
    if (Number.isInteger(i)) sellAssetByIndex(i);
  },
  systematizeBusiness: () => systematizeBusiness(),
  systematizeAssetByIndex: (arg) => {
    const i = Number.parseInt(arg ?? '', 10);
    if (Number.isInteger(i)) systematizeAssetByIndex(i);
  },
  closeAssetPicker: () => closeAssetPicker(),
  copyShareText: () => {
    void copyShareText();
  },
  reduceHours: () => reduceHours(),
  increaseHours: () => increaseHours(),
  resetGame: () => resetGame(),
  continuePlay: () => continuePlay(),
  showLifePicker: () => showLifePicker(),
  backToIntro: () => backToIntro(),
  setStatementTab: (arg) => {
    if (arg === 'income' || arg === 'balance' || arg === 'debt') {
      setStatementTab(arg satisfies StatementTab);
    }
  },
  startSpecificProfile: (arg) => {
    if (typeof arg === 'string') startSpecificProfile(arg);
  },
  rerollPickerFamily: (arg) => {
    if (typeof arg === 'string') rerollPickerFamily(arg);
  },
};

root.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof Element)) return;
  const trigger = target.closest<HTMLElement>('[data-action]');
  if (!trigger) return;
  const name = trigger.dataset.action;
  if (!name) return;
  const handler = actions[name];
  if (!handler) return;
  if (trigger instanceof HTMLButtonElement && trigger.disabled) return;
  event.preventDefault();
  handler(trigger.dataset.arg);
});

declare global {
  interface Window {
    rollLife: () => void;
    startSpecificProfile: (id: string) => void;
    toggleTheme: () => void;
    acceptCard: () => void;
    passCard: () => void;
    nextMonth: () => void;
    payDebtSnowball: () => void;
    cutExpenses: () => void;
    buildSkill: () => void;
    sellAsset: () => void;
    systematizeBusiness: () => void;
    reduceHours: () => void;
    increaseHours: () => void;
    resetGame: () => void;
    setStatementTab: (tab: StatementTab) => void;
    render_game_to_text: () => string;
    advanceTime: () => void;
  }
}

window.rollLife = rollLife;
window.startSpecificProfile = startSpecificProfile;
window.toggleTheme = toggleTheme;
window.acceptCard = acceptCard;
window.passCard = passCard;
window.nextMonth = nextMonth;
window.payDebtSnowball = payDebtSnowball;
window.cutExpenses = cutExpenses;
window.buildSkill = buildSkill;
window.sellAsset = sellAsset;
window.systematizeBusiness = systematizeBusiness;
window.reduceHours = reduceHours;
window.increaseHours = increaseHours;
window.resetGame = resetGame;
window.setStatementTab = setStatementTab;

window.render_game_to_text = () =>
  JSON.stringify({
    phase: state.phase,
    profile: state.profile?.name ?? null,
    month: state.month,
    cash: Math.round(state.cash),
    activeIncome: Math.round(state.activeIncome),
    truePassiveIncome: Math.round(truePassiveIncome()),
    passiveAssetIncome: Math.round(passiveAssetIncome()),
    activeAssetIncome: Math.round(activeAssetIncome()),
    totalAssetIncome: Math.round(state.passiveIncome),
    cashInterestIncome: Math.round(cashInterestIncome()),
    monthlyEarnings: Math.round(totalPassiveIncome()),
    expenses: Math.round(state.expenses),
    family: familyLabel(),
    familyTime: familyTime(),
    timeRemaining: state.time,
    timeCapacity: monthlyTimeCapacity(),
    recurringTime: recurringTime(),
    debt: Math.round(totalDebt()),
    debtPayments: Math.round(debtPayments()),
    cashFlow: Math.round(monthlyCashFlow()),
    fireProgress: Math.round(fireProgress()),
    currentCard: state.currentCard
      ? { type: state.currentCard.type, title: state.currentCard.title }
      : null,
    log: state.log.slice(0, 3),
  });

window.advanceTime = () => rerender();

rerender();
