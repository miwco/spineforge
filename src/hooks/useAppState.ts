import { useState, useEffect } from 'react';

export interface Progression {
  'hip-hinge': number;  // additional seconds added (0 to 30)
  'bird-dog': number;   // 0 to 30
  'side-plank': number;  // 0 to 30 (split between left and right)
  'dead-bug': number;    // 0 to 30
  'glute-bridge': number; // 0 to 30
}

export const MAX_PROGRESSION_SECONDS = 30;
export const DAILY_PROGRESSION_SECONDS = 2;

export interface PendingProgression {
  date: string;
  coinsEarned: number;
  progressionBonusCoins: number;
  newStreak: number;
  secondsRemaining: number;
}

export interface AppState {
  completedDates: string[]; // ['YYYY-MM-DD']
  streakCurrent: number;
  streakLongest: number;
  coins: number;
  lastWorkoutDate: string | null;
  lastRepairDate: string | null; // Track max 1 repair per 7 days
  progression: Progression;
  pendingProgression: PendingProgression | null;
  unlockedCosmetics: string[]; // ['theme-retro', 'sound-zen', etc.]
  activeTheme: string;
  activeSoundPack: string;
  activeTitle: string;
  activeBadge: string;
  activeAnimation: string;
  reminderTime: string | null;
}

const DEFAULT_STATE: AppState = {
  completedDates: [],
  streakCurrent: 0,
  streakLongest: 0,
  coins: 20, // Start with a few coins to look around
  lastWorkoutDate: null,
  lastRepairDate: null,
  progression: {
    'hip-hinge': 0,
    'bird-dog': 0,
    'side-plank': 0,
    'dead-bug': 0,
    'glute-bridge': 0,
  },
  pendingProgression: null,
  unlockedCosmetics: ['theme-classic-dark', 'sound-8-bit', 'title-spine-initiate', 'badge-none', 'anim-none'],
  activeTheme: 'theme-classic-dark',
  activeSoundPack: '8-bit',
  activeTitle: 'Spine Initiate',
  activeBadge: 'badge-none',
  activeAnimation: 'anim-none',
  reminderTime: null,
};

export const EXERCISE_KEYS: (keyof Progression)[] = [
  'hip-hinge',
  'bird-dog',
  'side-plank',
  'dead-bug',
  'glute-bridge',
];

export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculates current and longest streaks based on completed dates list
export const calculateStreak = (completedDates: string[]): { current: number; longest: number } => {
  if (completedDates.length === 0) return { current: 0, longest: 0 };
  
  const uniqueDates = Array.from(new Set(completedDates)).sort();
  
  let current = 0;
  const today = new Date();
  const todayStr = getLocalDateString(today);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);
  
  let startStr = "";
  if (uniqueDates.includes(todayStr)) {
    startStr = todayStr;
  } else if (uniqueDates.includes(yesterdayStr)) {
    startStr = yesterdayStr;
  }
  
  if (startStr) {
    current = 1;
    const loopDate = new Date(startStr);
    while (true) {
      loopDate.setDate(loopDate.getDate() - 1);
      const loopStr = getLocalDateString(loopDate);
      if (uniqueDates.includes(loopStr)) {
        current++;
      } else {
        break;
      }
    }
  }
  
  // Calculate longest streak historically
  let longest = 0;
  if (uniqueDates.length > 0) {
    let tempStreak = 1;
    for (let i = 1; i < uniqueDates.length; i++) {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffTime = Math.abs(curr.getTime() - prev.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        longest = Math.max(longest, tempStreak);
        tempStreak = 1;
      }
    }
    longest = Math.max(longest, tempStreak);
  }
  
  return { current, longest: Math.max(current, longest) };
};

export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem('spineforge_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure streaks are calculated fresh on load
        const streaks = calculateStreak(parsed.completedDates || []);
        const pendingProgression = parsed.pendingProgression
          ? {
              ...parsed.pendingProgression,
              secondsRemaining: parsed.pendingProgression.secondsRemaining ?? 1,
            }
          : null;
        return {
          ...DEFAULT_STATE,
          ...parsed,
          progression: {
            ...DEFAULT_STATE.progression,
            ...parsed.progression,
          },
          pendingProgression,
          unlockedCosmetics: parsed.unlockedCosmetics || DEFAULT_STATE.unlockedCosmetics,
          activeBadge: parsed.activeBadge || DEFAULT_STATE.activeBadge,
          activeAnimation: parsed.activeAnimation || DEFAULT_STATE.activeAnimation,
          streakCurrent: streaks.current,
          streakLongest: Math.max(parsed.streakLongest || 0, streaks.longest),
        };
      }
    } catch (e) {
      console.error('Failed to load local state:', e);
    }
    return DEFAULT_STATE;
  });

  useEffect(() => {
    localStorage.setItem('spineforge_state', JSON.stringify(state));
    // Set theme class on body
    document.body.className = '';
    const themeClass = state.activeTheme.replace('theme-', ''); // 'retro', 'forest' etc
    document.body.classList.add(`theme-${themeClass}`);
  }, [state]);

  const completeWorkout = () => {
    const todayStr = getLocalDateString();
    
    // Check if already completed today to prevent double claims
    if (state.completedDates.includes(todayStr)) {
      return { success: false, message: 'Already worked out today!' };
    }

    const newCompletedDates = [...state.completedDates, todayStr];
    const { current: newStreak, longest: newLongest } = calculateStreak(newCompletedDates);

    const progressionBonusCoins = Object.values(state.progression).reduce((sum, seconds) => sum + seconds, 0);
    const availableProgressionSeconds = EXERCISE_KEYS.reduce(
      (total, key) => total + Math.max(0, MAX_PROGRESSION_SECONDS - state.progression[key]),
      0,
    );
    const progressionSecondsAvailable = Math.min(DAILY_PROGRESSION_SECONDS, availableProgressionSeconds);
    let coinsEarned = 10 + progressionBonusCoins;
    
    // New logic: 50 extra coins if you get a 7-day streak, 
    // and 10 more coins every week for every successful 7-day streak.
    if (newStreak > 0 && newStreak % 7 === 0) {
      const weeks = newStreak / 7;
      const milestoneBonus = 50 + (weeks - 1) * 10;
      coinsEarned += milestoneBonus;
    }

    setState((prev) => ({
      ...prev,
      completedDates: newCompletedDates,
      streakCurrent: newStreak,
      streakLongest: Math.max(prev.streakLongest, newLongest),
      coins: prev.coins + coinsEarned,
      lastWorkoutDate: todayStr,
      pendingProgression: progressionSecondsAvailable > 0
        ? {
            date: todayStr,
            coinsEarned,
            progressionBonusCoins,
            newStreak,
            secondsRemaining: progressionSecondsAvailable,
          }
        : null,
    }));

    return {
      success: true,
      coinsEarned,
      progressionBonusCoins,
      newStreak,
      progressionSecondsAvailable,
    };
  };

  const allocateProgression = (key: keyof Progression): { success: boolean; secondsRemaining?: number; error?: string } => {
    if (!state.pendingProgression) {
      return { success: false, error: 'No progression point is waiting to be allocated.' };
    }
    if (!EXERCISE_KEYS.includes(key)) {
      return { success: false, error: 'Unknown exercise.' };
    }
    if (state.progression[key] >= MAX_PROGRESSION_SECONDS) {
      return { success: false, error: 'This exercise is already at its progression cap.' };
    }

    const secondsRemaining = Math.max(0, state.pendingProgression.secondsRemaining - 1);

    setState((prev) => {
      if (!prev.pendingProgression || prev.progression[key] >= MAX_PROGRESSION_SECONDS) return prev;

      const nextSecondsRemaining = Math.max(0, prev.pendingProgression.secondsRemaining - 1);

      return {
        ...prev,
        progression: {
          ...prev.progression,
          [key]: prev.progression[key] + 1,
        },
        pendingProgression: nextSecondsRemaining > 0
          ? { ...prev.pendingProgression, secondsRemaining: nextSecondsRemaining }
          : null,
      };
    });

    return { success: true, secondsRemaining };
  };

  const checkStreakRepairAvailable = (): {
    available: boolean;
    reason?: 'no_missed_day' | 'on_cooldown' | 'insufficient_coins';
    cost: number;
  } => {
    const cost = 150; // Increased to 150 based on new economy
    
    // 1. Check if yesterday was actually missed
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    
    const wasYesterdayCompleted = state.completedDates.includes(yesterdayStr);
    
    if (wasYesterdayCompleted) {
      return { available: false, reason: 'no_missed_day', cost };
    }

    // 2. Check repair cooldown (max 1 per 7 days)
    if (state.lastRepairDate) {
      const lastRepair = new Date(state.lastRepairDate);
      const timeDiff = Math.abs(new Date().getTime() - lastRepair.getTime());
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
      if (daysDiff < 7) {
        return { available: false, reason: 'on_cooldown', cost };
      }
    }

    // 3. Check coins
    if (state.coins < cost) {
      return { available: false, reason: 'insufficient_coins', cost };
    }

    return { available: true, cost };
  };

  const repairStreak = (): { success: boolean; error?: string } => {
    const check = checkStreakRepairAvailable();
    if (!check.available) {
      return { success: false, error: check.reason };
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);
    const todayStr = getLocalDateString();

    const newCompletedDates = [...state.completedDates, yesterdayStr];
    const { current: newStreak, longest: newLongest } = calculateStreak(newCompletedDates);

    setState((prev) => ({
      ...prev,
      completedDates: newCompletedDates,
      streakCurrent: newStreak,
      streakLongest: Math.max(prev.streakLongest, newLongest),
      coins: prev.coins - check.cost,
      lastRepairDate: todayStr,
    }));

    return { success: true };
  };

  const buyStreakSaver = (): { success: boolean; error?: string } => {
    const cost = 200;
    if (state.coins < cost) {
      return { success: false, error: 'Insufficient coins for Streak Saver.' };
    }
    
    const todayStr = getLocalDateString();
    if (state.completedDates.includes(todayStr)) {
      return { success: false, error: 'Already completed today. Save it for tomorrow!' };
    }

    const newCompletedDates = [...state.completedDates, todayStr];
    const { current: newStreak, longest: newLongest } = calculateStreak(newCompletedDates);

    setState((prev) => ({
      ...prev,
      completedDates: newCompletedDates,
      streakCurrent: newStreak,
      streakLongest: Math.max(prev.streakLongest, newLongest),
      coins: prev.coins - cost,
    }));

    return { success: true };
  };

  const purchaseCosmetic = (id: string, price: number): { success: boolean; error?: string } => {
    if (state.unlockedCosmetics.includes(id)) {
      return { success: false, error: 'Already unlocked!' };
    }
    if (state.coins < price) {
      return { success: false, error: 'Insufficient coins!' };
    }

    setState((prev) => ({
      ...prev,
      coins: prev.coins - price,
      unlockedCosmetics: [...prev.unlockedCosmetics, id],
    }));

    return { success: true };
  };

  const equipCosmetic = (type: 'theme' | 'sound' | 'title' | 'badge' | 'animation' | 'relic', value: string) => {
    setState((prev) => {
      if (type === 'theme') return { ...prev, activeTheme: value };
      if (type === 'sound') return { ...prev, activeSoundPack: value };
      if (type === 'title') return { ...prev, activeTitle: value };
      if (type === 'badge') return { ...prev, activeBadge: value };
      if (type === 'animation') return { ...prev, activeAnimation: value };
      return prev;
    });
  };

  const updateReminderTime = (time: string | null) => {
    setState((prev) => ({
      ...prev,
      reminderTime: time,
    }));
  };

  return {
    state,
    completeWorkout,
    allocateProgression,
    checkStreakRepairAvailable,
    repairStreak,
    buyStreakSaver,
    purchaseCosmetic,
    equipCosmetic,
    updateReminderTime,
  };
};
