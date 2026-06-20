import { FamilyData, Transaction, Envelope, FamilyMember, TravelGoal, PocketMoneyTask } from './types';

const STORAGE_KEY = 'family-pot-data';

export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

export function getCurrentWeekStart(): string {
  return getWeekStart(new Date());
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function isSunday(): boolean {
  return new Date().getDay() === 0;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function loadData(): FamilyData | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FamilyData;
  } catch {
    return null;
  }
}

export function saveData(data: FamilyData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function getDefaultData(): FamilyData {
  const memberId = generateId();
  const envelopeIds = {
    food: generateId(),
    petrol: generateId(),
    entertainment: generateId(),
    school: generateId(),
    household: generateId(),
    personal: generateId(),
    travel: generateId(),
  };

  const weekStart = getCurrentWeekStart();

  const transactions: Transaction[] = [
    {
      id: generateId(), envelopeId: envelopeIds.food, memberId, amount: 89.50,
      description: 'Weekly groceries', date: weekStart, weekStart,
    },
    {
      id: generateId(), envelopeId: envelopeIds.food, memberId, amount: 14.80,
      description: 'Fish and chips', date: weekStart, weekStart,
    },
    {
      id: generateId(), envelopeId: envelopeIds.petrol, memberId, amount: 78.40,
      description: 'Petrol', date: weekStart, weekStart,
    },
    {
      id: generateId(), envelopeId: envelopeIds.entertainment, memberId, amount: 32.00,
      description: 'School disco', date: weekStart, weekStart,
    },
    {
      id: generateId(), envelopeId: envelopeIds.school, memberId, amount: 24.00,
      description: 'School excursion', date: weekStart, weekStart,
    },
  ];

  return {
    familyName: 'Our Family',
    members: [
      { id: memberId, name: 'Everyone', role: 'parent', color: '#E06010' },
    ],
    envelopes: [
      { id: envelopeIds.food, name: 'Food', weeklyBudget: 300, color: '#E06010', isTravelFund: false, isPocketMoney: false, order: 0 },
      { id: envelopeIds.petrol, name: 'Petrol', weeklyBudget: 120, color: '#C49A1E', isTravelFund: false, isPocketMoney: false, order: 1 },
      { id: envelopeIds.entertainment, name: 'Entertainment', weeklyBudget: 100, color: '#6B7A36', isTravelFund: false, isPocketMoney: false, order: 2 },
      { id: envelopeIds.school, name: 'School', weeklyBudget: 80, color: '#5D4033', isTravelFund: false, isPocketMoney: false, order: 3 },
      { id: envelopeIds.household, name: 'Household', weeklyBudget: 150, color: '#E06010', isTravelFund: false, isPocketMoney: false, order: 4 },
      { id: envelopeIds.personal, name: 'Personal', weeklyBudget: 100, color: '#C49A1E', isTravelFund: false, isPocketMoney: false, order: 5 },
      { id: envelopeIds.travel, name: 'Travel Fund', weeklyBudget: 0, color: '#6B7A36', isTravelFund: true, isPocketMoney: false, order: 6 },
    ],
    transactions,
    travelGoal: {
      id: generateId(),
      name: 'Family Holiday',
      targetAmount: 3000,
      currentAmount: 420,
      description: 'A beach holiday for the whole family',
    },
    pocketMoneyTasks: [],
    setupComplete: false,
    currentMemberId: memberId,
    pocketMoneyEnabled: false,
  };
}

export function addTransaction(
  data: FamilyData,
  envelopeId: string,
  amount: number,
  description: string
): FamilyData {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getCurrentWeekStart();
  const tx: Transaction = {
    id: generateId(),
    envelopeId,
    memberId: data.currentMemberId,
    amount,
    description,
    date: today,
    weekStart,
  };
  return { ...data, transactions: [tx, ...data.transactions] };
}

export function deleteTransaction(data: FamilyData, txId: string): FamilyData {
  return { ...data, transactions: data.transactions.filter(t => t.id !== txId) };
}

export function updateEnvelope(data: FamilyData, envelope: Envelope): FamilyData {
  return {
    ...data,
    envelopes: data.envelopes.map(e => e.id === envelope.id ? envelope : e),
  };
}

export function addEnvelope(data: FamilyData, envelope: Omit<Envelope, 'id'>): FamilyData {
  const newEnvelope: Envelope = { ...envelope, id: generateId() };
  return { ...data, envelopes: [...data.envelopes, newEnvelope] };
}

export function moveToTravelFund(data: FamilyData, amount: number): FamilyData {
  if (!data.travelGoal) return data;
  return {
    ...data,
    travelGoal: {
      ...data.travelGoal,
      currentAmount: data.travelGoal.currentAmount + amount,
    },
  };
}

export function updateTravelGoal(data: FamilyData, goal: TravelGoal): FamilyData {
  return { ...data, travelGoal: goal };
}

export function updateMember(data: FamilyData, member: FamilyMember): FamilyData {
  return {
    ...data,
    members: data.members.map(m => m.id === member.id ? member : m),
  };
}

export function addMember(data: FamilyData, member: Omit<FamilyMember, 'id'>): FamilyData {
  const newMember: FamilyMember = { ...member, id: generateId() };
  return { ...data, members: [...data.members, newMember] };
}

export function togglePocketMoneyTask(
  data: FamilyData,
  taskId: string
): FamilyData {
  return {
    ...data,
    pocketMoneyTasks: data.pocketMoneyTasks.map(t =>
      t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t
    ),
  };
}

export function addPocketMoneyTask(
  data: FamilyData,
  task: Omit<PocketMoneyTask, 'id' | 'weekStart'>
): FamilyData {
  const newTask: PocketMoneyTask = {
    ...task,
    id: generateId(),
    weekStart: getCurrentWeekStart(),
  };
  return { ...data, pocketMoneyTasks: [...data.pocketMoneyTasks, newTask] };
}

export function getEnvelopeSpentThisWeek(
  transactions: Transaction[],
  envelopeId: string,
  weekStart?: string
): number {
  const ws = weekStart || getCurrentWeekStart();
  return transactions
    .filter(t => t.envelopeId === envelopeId && t.weekStart === ws)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getEnvelopeTransactionsThisWeek(
  transactions: Transaction[],
  envelopeId: string,
  weekStart?: string
): Transaction[] {
  const ws = weekStart || getCurrentWeekStart();
  return transactions
    .filter(t => t.envelopeId === envelopeId && t.weekStart === ws)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTotalSpentThisWeek(
  transactions: Transaction[],
  weekStart?: string
): number {
  const ws = weekStart || getCurrentWeekStart();
  return transactions
    .filter(t => t.weekStart === ws)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function exportToCSV(data: FamilyData): string {
  const headers = ['Date', 'Description', 'Amount', 'Envelope', 'Family Member'];
  const rows = data.transactions.map(t => {
    const envelope = data.envelopes.find(e => e.id === t.envelopeId);
    const member = data.members.find(m => m.id === t.memberId);
    return [
      t.date,
      `"${t.description}"`,
      t.amount.toFixed(2),
      `"${envelope?.name || ''}"`,
      `"${member?.name || ''}"`,
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}
