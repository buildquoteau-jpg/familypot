'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  FamilyData, Envelope, FamilyMember, TravelGoal, PocketMoneyTask,
} from './types';
import { AustralianState } from '../data/schoolTerms';
import {
  loadData, saveData, getDefaultData, addTransaction, deleteTransaction,
  updateEnvelope, addEnvelope, moveToTravelFund, updateTravelGoal,
  updateMember, addMember, togglePocketMoneyTask, addPocketMoneyTask,
  setupWeek, getCurrentWeekStart, addWeeks,
} from './storage';

interface FamilyDataContextValue {
  data: FamilyData;
  isLoaded: boolean;
  // Week navigation
  selectedWeekStart: string;
  isCurrentWeek: boolean;
  goToNextWeek: () => void;
  goToPrevWeek: () => void;
  goToCurrentWeek: () => void;
  setSelectedWeek: (weekStart: string) => void;
  // Data operations
  addSpend: (envelopeId: string, amount: number, description: string) => void;
  removeTransaction: (txId: string) => void;
  saveEnvelope: (envelope: Envelope) => void;
  createEnvelope: (envelope: Omit<Envelope, 'id'>) => void;
  saveMember: (member: FamilyMember) => void;
  createMember: (member: Omit<FamilyMember, 'id'>) => void;
  setCurrentMember: (memberId: string) => void;
  transferToTravel: (amount: number) => void;
  saveTravelGoal: (goal: TravelGoal) => void;
  toggleTask: (taskId: string) => void;
  createTask: (task: Omit<PocketMoneyTask, 'id' | 'weekStart'>) => void;
  setupThisWeek: (weekStart: string, allocations: Record<string, number>, total: number) => void;
  setState: (state: AustralianState) => void;
  completeSetup: (familyName: string) => void;
  togglePocketMoney: () => void;
  markSundayBriefingDone: () => void;
  resetData: () => void;
}

const FamilyDataContext = createContext<FamilyDataContextValue | null>(null);

export function FamilyDataProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<FamilyData>(getDefaultData());
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedWeekStart, setSelectedWeekStart] = useState<string>(getCurrentWeekStart());

  useEffect(() => {
    const stored = loadData();
    if (stored) {
      // Migrate old data that might not have weeklyBudgets or state
      setData({
        ...stored,
        weeklyBudgets: stored.weeklyBudgets ?? [],
        state: stored.state ?? 'QLD',
      });
    }
    setIsLoaded(true);
  }, []);

  const currentWeekStart = getCurrentWeekStart();
  const isCurrentWeek = selectedWeekStart === currentWeekStart;

  const update = useCallback((updater: (current: FamilyData) => FamilyData) => {
    setData(prev => {
      const next = updater(prev);
      saveData(next);
      return next;
    });
  }, []);

  const goToNextWeek = useCallback(() => {
    setSelectedWeekStart(ws => addWeeks(ws, 1));
  }, []);

  const goToPrevWeek = useCallback(() => {
    setSelectedWeekStart(ws => addWeeks(ws, -1));
  }, []);

  const goToCurrentWeek = useCallback(() => {
    setSelectedWeekStart(getCurrentWeekStart());
  }, []);

  const addSpend = useCallback((envelopeId: string, amount: number, description: string) => {
    update(d => addTransaction(d, envelopeId, amount, description));
  }, [update]);

  const removeTransaction = useCallback((txId: string) => {
    update(d => deleteTransaction(d, txId));
  }, [update]);

  const saveEnvelope = useCallback((envelope: Envelope) => {
    update(d => updateEnvelope(d, envelope));
  }, [update]);

  const createEnvelope = useCallback((envelope: Omit<Envelope, 'id'>) => {
    update(d => addEnvelope(d, envelope));
  }, [update]);

  const saveMember = useCallback((member: FamilyMember) => {
    update(d => updateMember(d, member));
  }, [update]);

  const createMember = useCallback((member: Omit<FamilyMember, 'id'>) => {
    update(d => addMember(d, member));
  }, [update]);

  const setCurrentMember = useCallback((memberId: string) => {
    update(d => ({ ...d, currentMemberId: memberId }));
  }, [update]);

  const transferToTravel = useCallback((amount: number) => {
    update(d => moveToTravelFund(d, amount));
  }, [update]);

  const saveTravelGoal = useCallback((goal: TravelGoal) => {
    update(d => updateTravelGoal(d, goal));
  }, [update]);

  const toggleTask = useCallback((taskId: string) => {
    update(d => togglePocketMoneyTask(d, taskId));
  }, [update]);

  const createTask = useCallback((task: Omit<PocketMoneyTask, 'id' | 'weekStart'>) => {
    update(d => addPocketMoneyTask(d, task));
  }, [update]);

  const setupThisWeek = useCallback(
    (weekStart: string, allocations: Record<string, number>, total: number) => {
      update(d => setupWeek(d, weekStart, allocations, total));
    },
    [update]
  );

  const setState = useCallback((state: AustralianState) => {
    update(d => ({ ...d, state }));
  }, [update]);

  const completeSetup = useCallback((familyName: string) => {
    update(d => ({ ...d, familyName, setupComplete: true }));
  }, [update]);

  const togglePocketMoney = useCallback(() => {
    update(d => ({ ...d, pocketMoneyEnabled: !d.pocketMoneyEnabled }));
  }, [update]);

  const markSundayBriefingDone = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    update(d => ({ ...d, lastSundayBriefingDate: today }));
  }, [update]);

  const resetData = useCallback(() => {
    const fresh = getDefaultData();
    setData(fresh);
    saveData(fresh);
  }, []);

  return (
    <FamilyDataContext.Provider value={{
      data, isLoaded,
      selectedWeekStart, isCurrentWeek,
      goToNextWeek, goToPrevWeek, goToCurrentWeek,
      setSelectedWeek: setSelectedWeekStart,
      addSpend, removeTransaction,
      saveEnvelope, createEnvelope,
      saveMember, createMember, setCurrentMember,
      transferToTravel, saveTravelGoal,
      toggleTask, createTask,
      setupThisWeek, setState,
      completeSetup, togglePocketMoney,
      markSundayBriefingDone, resetData,
    }}>
      {children}
    </FamilyDataContext.Provider>
  );
}

export function useFamilyData(): FamilyDataContextValue {
  const ctx = useContext(FamilyDataContext);
  if (!ctx) throw new Error('useFamilyData must be used within FamilyDataProvider');
  return ctx;
}
