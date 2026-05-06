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

const STORAGE_KEY = "studora_user";
const COOLDOWN_MS = 10_000;

export type StudoraUser = {
  email: string;
  neuroCoins: number;
  xp: number;
  level: number;
  streak: number;
  lastLoginDate: string | null; // YYYY-MM-DD
  comboCount: number;
  lastActionTime: number;
  badges: string[];
  onboardingCompleted: boolean;
};

export const DEFAULT_USER: StudoraUser = {
  email: "",
  neuroCoins: 0,
  xp: 0,
  level: 1,
  streak: 0,
  lastLoginDate: null,
  comboCount: 0,
  lastActionTime: 0,
  badges: [],
  onboardingCompleted: false,
};

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function diffDays(a: string | null, b: string): number {
  if (!a) return 99;
  const da = new Date(a + "T00:00:00").getTime();
  const db = new Date(b + "T00:00:00").getTime();
  return Math.round((db - da) / 86400000);
}

function sanitize(u: Partial<StudoraUser>): StudoraUser {
  const merged = { ...DEFAULT_USER, ...u };
  return {
    ...merged,
    neuroCoins: Math.max(0, Number(merged.neuroCoins) || 0),
    xp: Math.max(0, Number(merged.xp) || 0),
    level: Math.max(1, Number(merged.level) || 1),
    streak: Math.max(0, Number(merged.streak) || 0),
    comboCount: Math.max(0, Number(merged.comboCount) || 0),
    lastActionTime: Math.max(0, Number(merged.lastActionTime) || 0),
    badges: Array.isArray(merged.badges) ? merged.badges.filter(Boolean) : [],
    onboardingCompleted: Boolean(merged.onboardingCompleted),
    email: typeof merged.email === "string" ? merged.email : "",
    lastLoginDate: merged.lastLoginDate ?? null,
  };
}

export function loadUser(): StudoraUser {
  if (typeof window === "undefined") return { ...DEFAULT_USER };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_USER };
    return sanitize(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_USER };
  }
}

export function saveUser(user: StudoraUser): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitize(user)));
  } catch {
    // ignore
  }
}

type Ctx = {
  user: StudoraUser;
  updateUser: (data: Partial<StudoraUser>) => void;
  addCoins: (amount: number) => boolean;
  addXp: (amount: number) => void;
  addBadge: (badge: string) => void;
  resetUser: () => void;
  canEarn: () => boolean;
};

const UserContext = createContext<Ctx | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StudoraUser>(() => loadUser());
  const initRef = useRef(false);
  const userRef = useRef(user);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Streak handling on mount
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const today = todayStr();
    setUser((prev) => {
      const d = diffDays(prev.lastLoginDate, today);
      let streak = prev.streak;
      if (!prev.lastLoginDate || d > 1) streak = 1;
      else if (d === 1) streak = streak + 1;
      else if (d === 0) streak = Math.max(1, streak);
      const next = sanitize({ ...prev, streak, lastLoginDate: today });
      // eslint-disable-next-line no-console
      console.log("Usuário carregado:", next);
      return next;
    });
  }, []);

  // Persist
  useEffect(() => {
    saveUser(user);
  }, [user]);

  const updateUser = useCallback((data: Partial<StudoraUser>) => {
    setUser((prev) => sanitize({ ...prev, ...data }));
  }, []);

  const canEarn = useCallback(() => {
    return Date.now() - userRef.current.lastActionTime >= COOLDOWN_MS;
  }, []);

  const addCoins = useCallback((amount: number) => {
    if (!amount || amount <= 0) return false;
    const now = Date.now();
    if (now - userRef.current.lastActionTime < COOLDOWN_MS) return false;
    setUser((prev) =>
      sanitize({
        ...prev,
        neuroCoins: prev.neuroCoins + amount,
        lastActionTime: now,
      }),
    );
    return true;
  }, []);

  const addXp = useCallback((amount: number) => {
    if (!amount || amount <= 0) return;
    setUser((prev) => {
      const xp = prev.xp + amount;
      const level = Math.max(1, Math.floor(1 + Math.sqrt(xp / 50)));
      return sanitize({ ...prev, xp, level });
    });
  }, []);

  const addBadge = useCallback((badge: string) => {
    if (!badge) return;
    setUser((prev) =>
      prev.badges.includes(badge) ? prev : sanitize({ ...prev, badges: [...prev.badges, badge] }),
    );
  }, []);

  const resetUser = useCallback(() => {
    setUser({ ...DEFAULT_USER });
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }, []);

  const value = useMemo<Ctx>(
    () => ({ user, updateUser, addCoins, addXp, addBadge, resetUser, canEarn }),
    [user, updateUser, addCoins, addXp, addBadge, resetUser, canEarn],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
