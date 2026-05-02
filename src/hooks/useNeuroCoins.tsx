import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "studora:neurocoins.v1";
const COMBO_WINDOW_MS = 60_000;
const COOLDOWN_MS = 10_000;

type RewardSource = "question" | "tool" | "manual";

export type NeuroState = {
  balance: number;
  lastLoginDate: string; // YYYY-MM-DD
  streak: number;
  lastRewardTimestamp: number;
  comboCount: number;
  comboExpiresAt: number;
  lastReward: {
    amount: number;
    source: RewardSource;
    bonus: number;
    surprise: number;
    at: number;
  } | null;
};

type CoinEvent = {
  id: number;
  amount: number;
  label?: string;
  surprise?: boolean;
};

type ToastEvent = {
  id: number;
  text: string;
};

type RewardResult = {
  ok: boolean;
  base: number;
  comboBonus: number;
  surprise: number;
  total: number;
  reason?: "cooldown";
};

type Ctx = {
  state: NeuroState;
  rewardUser: (source: RewardSource, baseOverride?: number) => RewardResult;
  coinEvents: CoinEvent[];
  toastEvents: ToastEvent[];
  pulseKey: number;
};

const NeuroCoinsContext = createContext<Ctx | null>(null);

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(a: string, b: string): number {
  if (!a) return 99;
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

const DEFAULT_STATE: NeuroState = {
  balance: 0,
  lastLoginDate: "",
  streak: 0,
  lastRewardTimestamp: 0,
  comboCount: 0,
  comboExpiresAt: 0,
  lastReward: null,
};

function loadState(): NeuroState {
  if (typeof window === "undefined") return { ...DEFAULT_STATE };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

function comboBonusFor(count: number): number {
  if (count >= 5) return 10;
  if (count >= 3) return 5;
  if (count >= 2) return 2;
  return 0;
}

function streakBonusFor(streak: number): number {
  if (streak >= 7) return 50;
  if (streak >= 3) return 25;
  if (streak >= 1) return 15;
  return 0;
}

function baseFor(source: RewardSource): number {
  if (source === "question") return 5;
  if (source === "tool") return 3;
  return 0;
}

export function formatCoins(n: number): string {
  if (n < 1000) return n.toString();
  if (n < 1_000_000) {
    const v = n / 1000;
    return `${v.toFixed(v >= 10 ? 0 : 1).replace(/\.0$/, "")}K`;
  }
  const v = n / 1_000_000;
  return `${v.toFixed(v >= 10 ? 0 : 1).replace(/\.0$/, "")}M`;
}

export function NeuroCoinsProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NeuroState>(() => loadState());
  const [coinEvents, setCoinEvents] = useState<CoinEvent[]>([]);
  const [toastEvents, setToastEvents] = useState<ToastEvent[]>([]);
  const [pulseKey, setPulseKey] = useState(0);
  const initRef = useRef(false);
  const lockRef = useRef(false);

  // Daily streak processing
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const today = todayStr();
    setState((prev) => {
      const d = diffDays(prev.lastLoginDate, today);
      let streak = prev.streak;
      let balance = prev.balance;
      let toastText: string | null = null;
      let bonus = 0;

      if (!prev.lastLoginDate || d > 1) {
        streak = 1;
        bonus = streakBonusFor(streak);
        toastText = "Streak iniciado 🔥";
      } else if (d === 1) {
        streak = streak + 1;
        bonus = streakBonusFor(streak);
        toastText = "Streak mantido com sucesso 🔥";
      } else if (d === 0) {
        // already counted today
        return prev;
      }

      balance = Math.max(0, balance + bonus);

      if (bonus > 0) {
        const id = Date.now() + Math.random();
        setTimeout(() => {
          setCoinEvents((c) => [...c, { id, amount: bonus, label: `Streak ${streak}d` }]);
          setTimeout(() => setCoinEvents((c) => c.filter((e) => e.id !== id)), 1700);
          setPulseKey((k) => k + 1);
        }, 400);
      }
      if (toastText) {
        const tid = Date.now() + Math.random();
        setTimeout(() => {
          setToastEvents((t) => [...t, { id: tid, text: toastText! }]);
          setTimeout(() => setToastEvents((t) => t.filter((e) => e.id !== tid)), 3000);
        }, 600);
      }

      return {
        ...prev,
        streak,
        balance,
        lastLoginDate: today,
      };
    });
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  const pushToast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setToastEvents((t) => [...t, { id, text }]);
    setTimeout(() => setToastEvents((t) => t.filter((e) => e.id !== id)), 3000);
  }, []);

  const pushCoinEvent = useCallback((amount: number, surprise = false, label?: string) => {
    const id = Date.now() + Math.random();
    setCoinEvents((c) => [...c, { id, amount, surprise, label }]);
    setTimeout(() => setCoinEvents((c) => c.filter((e) => e.id !== id)), surprise ? 2400 : 1600);
    setPulseKey((k) => k + 1);
    // Haptic feedback
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate?.(surprise ? [10, 40, 30] : 8);
      } catch {}
    }
  }, []);

  const rewardUser = useCallback(
    (source: RewardSource, baseOverride?: number): RewardResult => {
      if (lockRef.current) {
        return { ok: false, base: 0, comboBonus: 0, surprise: 0, total: 0, reason: "cooldown" };
      }
      lockRef.current = true;
      try {
        const now = Date.now();
        const base = baseOverride ?? baseFor(source);
        if (base <= 0) {
          return { ok: false, base: 0, comboBonus: 0, surprise: 0, total: 0 };
        }

        // Cooldown
        if (now - state.lastRewardTimestamp < COOLDOWN_MS) {
          return {
            ok: false,
            base,
            comboBonus: 0,
            surprise: 0,
            total: 0,
            reason: "cooldown",
          };
        }

        // Combo
        const comboActive = now < state.comboExpiresAt;
        const newCombo = comboActive ? state.comboCount + 1 : 1;
        const comboBonus = comboBonusFor(newCombo);

        // Surprise (10%)
        let surprise = 0;
        if (Math.random() < 0.1) {
          surprise = Math.random() < 0.5 ? 1000 : 2000;
        }

        const total = Math.max(0, base + comboBonus + surprise);

        setState((prev) => ({
          ...prev,
          balance: Math.max(0, prev.balance + total),
          lastRewardTimestamp: now,
          comboCount: newCombo,
          comboExpiresAt: now + COMBO_WINDOW_MS,
          lastReward: {
            amount: total,
            source,
            bonus: comboBonus,
            surprise,
            at: now,
          },
        }));

        // Visual feedback
        pushCoinEvent(base, false);
        if (comboBonus > 0) {
          setTimeout(() => pushCoinEvent(comboBonus, false, `Combo x${newCombo}`), 250);
        }
        if (surprise > 0) {
          setTimeout(() => {
            pushCoinEvent(surprise, true, "Bônus surpresa");
            pushToast("🎉 Bônus surpresa desbloqueado!");
          }, 500);
        }
        if (newCombo === 2) pushToast("Sequência ativa 🔥");
        else if (newCombo === 3) pushToast("Continue para bônus maior");
        else if (newCombo === 5) pushToast("Combo máximo atingido! ⚡");

        return { ok: true, base, comboBonus, surprise, total };
      } finally {
        // micro-lock to prevent simultaneous double-fire
        setTimeout(() => {
          lockRef.current = false;
        }, 50);
      }
    },
    [state.lastRewardTimestamp, state.comboExpiresAt, state.comboCount, pushCoinEvent, pushToast],
  );

  // Auto-reset combo when window expires
  useEffect(() => {
    if (state.comboExpiresAt <= Date.now()) return;
    const t = setTimeout(() => {
      setState((prev) => {
        if (Date.now() >= prev.comboExpiresAt && prev.comboCount > 0) {
          return { ...prev, comboCount: 0, comboExpiresAt: 0 };
        }
        return prev;
      });
    }, state.comboExpiresAt - Date.now() + 50);
    return () => clearTimeout(t);
  }, [state.comboExpiresAt, state.comboCount]);

  const value = useMemo<Ctx>(
    () => ({ state, rewardUser, coinEvents, toastEvents, pulseKey }),
    [state, rewardUser, coinEvents, toastEvents, pulseKey],
  );

  return <NeuroCoinsContext.Provider value={value}>{children}</NeuroCoinsContext.Provider>;
}

export function useNeuroCoins() {
  const ctx = useContext(NeuroCoinsContext);
  if (!ctx) throw new Error("useNeuroCoins must be used within NeuroCoinsProvider");
  return ctx;
}
