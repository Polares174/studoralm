import { createContext, useContext, useEffect, useState, useCallback, useRef, type ReactNode } from "react";

const STORAGE_KEY = "estudoslm:gamification.v1";

export type GamificationState = {
  xp: number;
  level: number;
  streak: number;
  lastVisit: string; // YYYY-MM-DD
};

type XpEvent = { id: number; amount: number };
type LevelUpEvent = { id: number; level: number };

type Ctx = {
  state: GamificationState;
  currentLevelXp: number;
  nextLevelXp: number;
  progressPct: number;
  addXp: (amount: number) => void;
  xpEvents: XpEvent[];
  levelUpEvent: LevelUpEvent | null;
  clearLevelUp: () => void;
};

const GamificationContext = createContext<Ctx | null>(null);

// Progressive thresholds: 0, 100, 250, 500, 850, 1300, 1850, ...
// Pattern: level n requires sum where each step grows by 50.
function thresholdForLevel(level: number): number {
  // level 1 = 0, level 2 = 100, level 3 = 250, level 4 = 500, level 5 = 850
  if (level <= 1) return 0;
  let total = 0;
  let step = 100;
  for (let i = 2; i <= level; i++) {
    total += step;
    step += 50;
  }
  return total;
}

function levelFromXp(xp: number): number {
  let lvl = 1;
  while (thresholdForLevel(lvl + 1) <= xp) lvl++;
  return lvl;
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function load(): GamificationState {
  if (typeof window === "undefined") {
    return { xp: 0, level: 1, streak: 0, lastVisit: todayStr() };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { xp: 0, level: 1, streak: 0, lastVisit: todayStr() };
}

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GamificationState>(() => load());
  const [xpEvents, setXpEvents] = useState<XpEvent[]>([]);
  const [levelUpEvent, setLevelUpEvent] = useState<LevelUpEvent | null>(null);
  const initRef = useRef(false);

  // Streak handling on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    setState((prev) => {
      const today = todayStr();
      if (!prev.lastVisit) {
        return { ...prev, streak: 1, lastVisit: today };
      }
      const d = diffDays(prev.lastVisit, today);
      let streak = prev.streak;
      if (d === 0) {
        streak = Math.max(1, streak);
      } else if (d === 1) {
        streak = streak + 1;
      } else if (d > 1) {
        streak = 1;
      }
      return { ...prev, streak, lastVisit: today };
    });
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const addXp = useCallback((amount: number) => {
    if (!amount || amount <= 0) return;
    const id = Date.now() + Math.random();
    setXpEvents((prev) => [...prev, { id, amount }]);
    setTimeout(() => {
      setXpEvents((prev) => prev.filter((e) => e.id !== id));
    }, 1600);

    setState((prev) => {
      const newXp = prev.xp + amount;
      const newLevel = levelFromXp(newXp);
      if (newLevel > prev.level) {
        setLevelUpEvent({ id: Date.now(), level: newLevel });
      }
      return { ...prev, xp: newXp, level: newLevel };
    });
  }, []);

  const clearLevelUp = useCallback(() => setLevelUpEvent(null), []);

  const currentLevelXp = thresholdForLevel(state.level);
  const nextLevelXp = thresholdForLevel(state.level + 1);
  const range = Math.max(1, nextLevelXp - currentLevelXp);
  const progressPct = Math.min(100, Math.max(0, ((state.xp - currentLevelXp) / range) * 100));

  return (
    <GamificationContext.Provider
      value={{
        state,
        currentLevelXp,
        nextLevelXp,
        progressPct,
        addXp,
        xpEvents,
        levelUpEvent,
        clearLevelUp,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const ctx = useContext(GamificationContext);
  if (!ctx) throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
}
