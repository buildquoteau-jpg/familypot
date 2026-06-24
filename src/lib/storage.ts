import { FamilyData, Transaction, Envelope, FamilyMember, TravelGoal, PocketMoneyTask, PocketMoneyTemplate } from './types';

const STORAGE_KEY = 'family-pot-data';
const PHOTO_KEY = 'family-pot-photo';

export function loadFamilyPhoto(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(PHOTO_KEY); } catch { return null; }
}

export function saveFamilyPhoto(base64: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(PHOTO_KEY, base64); } catch { /* storage full */ }
}

export function removeFamilyPhoto(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PHOTO_KEY);
}

const KITCHEN_BG_KEY = 'family-pot-kitchen-bg';

export function loadKitchenBg(): string | null {
  if (typeof window === 'undefined') return null;
  try { return localStorage.getItem(KITCHEN_BG_KEY); } catch { return null; }
}

export function saveKitchenBg(base64: string): void {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(KITCHEN_BG_KEY, base64); } catch { /* storage full */ }
}

export function removeKitchenBg(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KITCHEN_BG_KEY);
}

export function getWeekStart(date: Date = new Date()): string {
  // Use local date components to avoid UTC offset shifting the date
  // (important for AWST +8 and other Australian timezones)
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayOfWeek);
  const y = sunday.getFullYear();
  const m = String(sunday.getMonth() + 1).padStart(2, '0');
  const d = String(sunday.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getCurrentWeekStart(): string {
  const now = new Date();
  // Week runs Sunday 5pm → following Sunday 5pm.
  // If it's Sunday before 5pm we're still in last week.
  if (now.getDay() === 0 && now.getHours() < 17) {
    const lastSunday = new Date(now);
    lastSunday.setDate(lastSunday.getDate() - 7);
    return getWeekStart(lastSunday);
  }
  return getWeekStart(now);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00');
  return date.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function isSunday(): boolean {
  const now = new Date();
  return now.getDay() === 0 && now.getHours() >= 17;
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
    gifts: generateId(),
    travel: generateId(),
  };

  return {
    familyName: 'Our Family',
    members: [
      { id: memberId, name: 'Everyone', role: 'parent', color: '#E06010' },
    ],
    envelopes: [
      { id: envelopeIds.food, name: 'Food', weeklyBudget: 0, color: '#E06010', isTravelFund: false, isPocketMoney: false, order: 0 },
      { id: envelopeIds.petrol, name: 'Petrol', weeklyBudget: 0, color: '#C49A1E', isTravelFund: false, isPocketMoney: false, order: 1 },
      { id: envelopeIds.entertainment, name: 'Entertainment', weeklyBudget: 0, color: '#6B7A36', isTravelFund: false, isPocketMoney: false, order: 2 },
      { id: envelopeIds.school, name: 'School', weeklyBudget: 0, color: '#5D4033', isTravelFund: false, isPocketMoney: false, order: 3 },
      { id: envelopeIds.household, name: 'Household', weeklyBudget: 0, color: '#E06010', isTravelFund: false, isPocketMoney: false, order: 4 },
      { id: envelopeIds.gifts, name: 'Gifts & Donations', weeklyBudget: 0, color: '#5D4033', isTravelFund: false, isPocketMoney: false, order: 5 },
      { id: envelopeIds.travel, name: 'Travel Fund', weeklyBudget: 0, color: '#6B7A36', isTravelFund: true, isPocketMoney: false, order: 6 },
    ],
    transactions: [],
    travelGoal: {
      id: generateId(),
      name: 'Family Holiday',
      targetAmount: 0,
      currentAmount: 0,
      description: '',
    },
    pocketMoneyTasks: [],
    pocketMoneyTemplates: [],
    weeklyBudgets: [],
    setupComplete: true,
    currentMemberId: memberId,
    pocketMoneyEnabled: false,
    pocketMoneyEnabledMembers: [],
    state: 'QLD',
  };
}

// --- Pocket Money Templates ---

export function addPocketMoneyTemplate(
  data: FamilyData,
  template: Omit<PocketMoneyTemplate, 'id'>
): FamilyData {
  const newTemplate: PocketMoneyTemplate = { ...template, id: generateId() };
  return { ...data, pocketMoneyTemplates: [...(data.pocketMoneyTemplates ?? []), newTemplate] };
}

export function removePocketMoneyTemplate(data: FamilyData, templateId: string): FamilyData {
  return {
    ...data,
    pocketMoneyTemplates: (data.pocketMoneyTemplates ?? []).filter(t => t.id !== templateId),
  };
}

// Creates this week's task instances from templates if they don't already exist
export function syncTasksFromTemplates(data: FamilyData, weekStart: string): FamilyData {
  const templates = data.pocketMoneyTemplates ?? [];
  if (templates.length === 0) return data;

  const newTasks: PocketMoneyTask[] = [];
  for (const tmpl of templates) {
    const alreadyExists = data.pocketMoneyTasks.some(
      t => t.weekStart === weekStart && t.memberId === tmpl.memberId && t.name === tmpl.name
    );
    if (!alreadyExists) {
      newTasks.push({
        id: generateId(),
        memberId: tmpl.memberId,
        name: tmpl.name,
        amount: tmpl.amount,
        isCompleted: false,
        weekStart,
      });
    }
  }

  if (newTasks.length === 0) return data;
  return { ...data, pocketMoneyTasks: [...data.pocketMoneyTasks, ...newTasks] };
}

export function toggleMemberPocketMoney(data: FamilyData, memberId: string): FamilyData {
  const current = data.pocketMoneyEnabledMembers ?? [];
  const isEnabled = current.includes(memberId);
  return {
    ...data,
    pocketMoneyEnabledMembers: isEnabled
      ? current.filter(id => id !== memberId)
      : [...current, memberId],
  };
}

export function getMemberBalance(tasks: PocketMoneyTask[], memberId: string): number {
  return tasks
    .filter(t => t.memberId === memberId && t.isCompleted)
    .reduce((s, t) => s + t.amount, 0);
}

export function getMemberWeekEarnings(
  tasks: PocketMoneyTask[],
  memberId: string,
  weekStart: string
): number {
  return tasks
    .filter(t => t.memberId === memberId && t.weekStart === weekStart && t.isCompleted)
    .reduce((s, t) => s + t.amount, 0);
}

export function setupWeek(
  data: FamilyData,
  weekStart: string,
  allocations: Record<string, number>,
  totalAvailable: number
): FamilyData {
  const existing = data.weeklyBudgets.filter(wb => wb.weekStart !== weekStart);
  return {
    ...data,
    weeklyBudgets: [...existing, { weekStart, totalAvailable, allocations }],
  };
}

export function getWeekBudget(data: FamilyData, envelopeId: string, weekStart: string): number {
  const wb = data.weeklyBudgets.find(b => b.weekStart === weekStart);
  if (wb && envelopeId in wb.allocations) return wb.allocations[envelopeId];
  // Fall back to the envelope's default weekly budget
  return data.envelopes.find(e => e.id === envelopeId)?.weeklyBudget ?? 0;
}

export function getWeekTotalBudget(data: FamilyData, weekStart: string): number {
  const wb = data.weeklyBudgets.find(b => b.weekStart === weekStart);
  if (wb) return wb.totalAvailable;
  return data.envelopes
    .filter(e => !e.isTravelFund && !e.isPocketMoney)
    .reduce((s, e) => s + e.weeklyBudget, 0);
}

export function isWeekSetUp(data: FamilyData, weekStart: string): boolean {
  return data.weeklyBudgets.some(wb => wb.weekStart === weekStart);
}

export function addWeeks(weekStart: string, n: number): string {
  const d = new Date(weekStart + 'T12:00:00');
  d.setDate(d.getDate() + n * 7);
  return d.toISOString().split('T')[0];
}

export function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + 'T12:00:00');
  const end = new Date(weekStart + 'T12:00:00');
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.toLocaleDateString('en-AU', opts)}`;
  }
  return `${start.toLocaleDateString('en-AU', opts)} – ${end.toLocaleDateString('en-AU', opts)}`;
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

export function deleteEnvelope(data: FamilyData, envelopeId: string): FamilyData {
  return { ...data, envelopes: data.envelopes.filter(e => e.id !== envelopeId) };
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
