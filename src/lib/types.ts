export interface FamilyMember {
  id: string;
  name: string;
  role: 'parent' | 'child' | 'grandparent';
  color: string;
}

export interface Envelope {
  id: string;
  name: string;
  weeklyBudget: number;
  color: string;
  isTravelFund: boolean;
  isPocketMoney: boolean;
  memberId?: string;
  order: number;
}

export interface Transaction {
  id: string;
  envelopeId: string;
  memberId: string;
  amount: number;
  description: string;
  date: string;
  weekStart: string;
}

export interface TravelGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  description: string;
}

export interface PocketMoneyTask {
  id: string;
  memberId: string;
  name: string;
  amount: number;
  isCompleted: boolean;
  weekStart: string;
}

// Recurring chore templates — defined once, appear fresh each week
export interface PocketMoneyTemplate {
  id: string;
  memberId: string;
  name: string;
  amount: number;
}

export interface FamilyData {
  familyName: string;
  members: FamilyMember[];
  envelopes: Envelope[];
  transactions: Transaction[];
  travelGoal?: TravelGoal;
  pocketMoneyTasks: PocketMoneyTask[];
  pocketMoneyTemplates: PocketMoneyTemplate[];
  weeklyBudgets: WeeklyBudget[];
  setupComplete: boolean;
  currentMemberId: string;
  pocketMoneyEnabled: boolean;
  pocketMoneyEnabledMembers: string[]; // member ids with pocket money turned on
  lastSundayBriefingDate?: string;
  state: import('../data/schoolTerms').AustralianState;
}

export interface WeeklyBudget {
  weekStart: string;
  totalAvailable: number;
  allocations: Record<string, number>; // envelopeId -> amount
}

export interface WeekSummary {
  weekStart: string;
  envelopes: {
    envelope: Envelope;
    budget: number;
    spent: number;
    remaining: number;
  }[];
  totalBudget: number;
  totalSpent: number;
}
