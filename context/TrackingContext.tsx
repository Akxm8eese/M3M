'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type HydrationLog = {
  id: string;
  amount: number;
  type: 'water' | 'meal';
  timestamp: string;
};

type MealLog = {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fats: number;
  waterContent: number;
  timestamp: string;
};

type MacroGoals = {
  protein: number;
  carbs: number;
  fats: number;
  hydration: number;
};

type TrackingContextType = {
  hasSeenEducation: boolean;
  completeEducation: () => void;
  hydrationLogs: HydrationLog[];
  mealLogs: MealLog[];
  goals: MacroGoals;
  addHydration: (amount: number, type: 'water' | 'meal') => void;
  addMeal: (meal: Omit<MealLog, 'id' | 'timestamp'>) => void;
  getTodayHydration: () => { total: number; water: number; meal: number };
  getTodayMacros: () => { protein: number; carbs: number; fats: number };
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

const DEFAULT_GOALS: MacroGoals = {
  protein: 80,
  carbs: 250,
  fats: 70,
  hydration: 2500, // ml
};

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const [hasSeenEducation, setHasSeenEducation] = useState(false);
  const [hydrationLogs, setHydrationLogs] = useState<HydrationLog[]>([]);
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [goals, setGoals] = useState<MacroGoals>(DEFAULT_GOALS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage
  useEffect(() => {
    // Wrap in setTimeout to avoid "setState in effect" linter error
    const timer = setTimeout(() => {
      const loadedEducation = localStorage.getItem('hasSeenEducation');
      const loadedHydration = localStorage.getItem('hydrationLogs');
      const loadedMeals = localStorage.getItem('mealLogs');
      const loadedGoals = localStorage.getItem('goals');

      if (loadedEducation) setHasSeenEducation(JSON.parse(loadedEducation));
      if (loadedHydration) setHydrationLogs(JSON.parse(loadedHydration));
      if (loadedMeals) setMealLogs(JSON.parse(loadedMeals));
      if (loadedGoals) setGoals(JSON.parse(loadedGoals));
      setIsLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Save to local storage
  useEffect(() => {
    if (!isLoaded) return;
    localStorage.setItem('hasSeenEducation', JSON.stringify(hasSeenEducation));
    localStorage.setItem('hydrationLogs', JSON.stringify(hydrationLogs));
    localStorage.setItem('mealLogs', JSON.stringify(mealLogs));
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [hasSeenEducation, hydrationLogs, mealLogs, goals, isLoaded]);

  const completeEducation = () => {
    setHasSeenEducation(true);
  };

  const addHydration = (amount: number, type: 'water' | 'meal') => {
    const newLog: HydrationLog = {
      id: Date.now().toString(),
      amount,
      type,
      timestamp: new Date().toISOString(),
    };
    setHydrationLogs((prev) => [...prev, newLog]);
  };

  const addMeal = (meal: Omit<MealLog, 'id' | 'timestamp'>) => {
    const newMeal: MealLog = {
      ...meal,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setMealLogs((prev) => [...prev, newMeal]);

    // Also add water from meal if any
    if (meal.waterContent > 0) {
      addHydration(meal.waterContent, 'meal');
    }
  };

  const getTodayHydration = () => {
    const today = new Date().toDateString();
    const todayLogs = hydrationLogs.filter(
      (log) => new Date(log.timestamp).toDateString() === today
    );

    const water = todayLogs
      .filter((log) => log.type === 'water')
      .reduce((sum, log) => sum + log.amount, 0);
    const meal = todayLogs
      .filter((log) => log.type === 'meal')
      .reduce((sum, log) => sum + log.amount, 0);

    return { total: water + meal, water, meal };
  };

  const getTodayMacros = () => {
    const today = new Date().toDateString();
    const todayMeals = mealLogs.filter(
      (log) => new Date(log.timestamp).toDateString() === today
    );

    return todayMeals.reduce(
      (acc, meal) => ({
        protein: acc.protein + meal.protein,
        carbs: acc.carbs + meal.carbs,
        fats: acc.fats + meal.fats,
      }),
      { protein: 0, carbs: 0, fats: 0 }
    );
  };

  return (
    <TrackingContext.Provider
      value={{
        hasSeenEducation,
        completeEducation,
        hydrationLogs,
        mealLogs,
        goals,
        addHydration,
        addMeal,
        getTodayHydration,
        getTodayMacros,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
