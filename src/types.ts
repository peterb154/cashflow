export type RiskLevel = 'Low' | 'Medium' | 'High';
export type Sellability = 'Low' | 'Medium' | 'High';
export type FamilyStatus = 'single' | 'married';
export type Phase = 'intro' | 'picking' | 'play' | 'won';
export type StatementTab = 'income' | 'balance' | 'debt';
export type CardType = 'opportunity' | 'doodad' | 'event' | 'exit';

export interface Debt {
  name: string;
  balance: number;
  payment: number;
  rate: number;
}

export interface Asset {
  id?: string;
  name: string;
  value: number;
  passive: number;
  sellable: boolean;
  recurringTime?: number;
  terminalValue?: number | null;
}

export interface Family {
  status: FamilyStatus;
  kids: number;
}

export interface FamilyStart extends Family {
  label: string;
}

export interface Profile {
  id: string;
  name: string;
  role: string;
  challenge: string;
  hiddenAdvantage: string;
  cash: number;
  activeIncome: number;
  passiveIncome: number;
  expenses: number;
  skill: number;
  jobTime: number;
  jobLabel: string;
  defaultFamily?: Family;
  debts: Debt[];
  assets: Asset[];
  tags?: string[];
}

export interface Opportunity {
  id: string;
  type: 'opportunity';
  title: string;
  description: string;
  cost: number;
  cashFlow: number;
  value: number;
  terminalValue?: number;
  timeCost: number;
  recurringTime: number;
  skillRequired: number;
  risk: RiskLevel;
  sellability: Sellability;
  lesson: string;
  tags?: string[];
}

export interface Doodad {
  id: string;
  type: 'doodad';
  title: string;
  description: string;
  whisper: string;
  cost: number;
  expenseChange: number;
  expenseReduction?: number;
  timeChange?: number;
  happiness: number;
  lesson: string;
  tags?: string[];
}

export type FamilyAction = 'addKid' | 'marry' | 'divorce';

export interface EventCard {
  id: string;
  type: 'event';
  title: string;
  description: string;
  cost: number;
  expenseChange?: number;
  incomeChange?: number;
  familyAction?: FamilyAction;
  required?: boolean;
  lesson: string;
  tags?: string[];
}

export interface ExitCard {
  type: 'exit';
  title: string;
  description: string;
  assetId: string;
  assetName: string;
  offerValue: number;
  passiveLost: number;
  timeFreed: number;
  lesson: string;
}

export type Card = Opportunity | Doodad | EventCard | ExitCard;

export interface Snapshot {
  cash: number;
  activeIncome: number;
  passiveIncome: number;
  assetPassiveIncome: number;
  cashInterestIncome: number;
  expenses: number;
  debt: number;
  debtPayments: number;
  netWorth: number;
  cashFlow: number;
  fireProgress: number;
  timeRemaining: number;
  timeCapacity: number;
  recurringTime: number;
}

export interface Toast {
  title: string;
  detail: string;
}

export interface LastMonth {
  before: Snapshot;
  after: Snapshot;
  cashFlow: number;
}

export interface GameState {
  phase: Phase;
  profile: Profile | null;
  month: number;
  cash: number;
  activeIncome: number;
  passiveIncome: number;
  expenses: number;
  debts: Debt[];
  assets: Asset[];
  skill: number;
  baseTime: number;
  time: number;
  family: Family | null;
  currentCard: Card | null;
  statementTab: StatementTab;
  log: string[];
  toast: Toast | null;
  lastMonth: LastMonth | null;
  totalDoodads: number;
  totalDebtPaid: number;
  expenseCuts: number;
  gameWon: boolean;
  actionTakenThisMonth: boolean;
  pickerFamilies: Record<string, Family>;
}
