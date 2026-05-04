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

const STORAGE_KEY = "studora:stud-companion.v1";

export type Mood = "happy" | "excited" | "thinking" | "sleepy" | "wink";

export type StudMessage = {
  id: number;
  text: string;
  mood: Mood;
  cta?: { label: string; action: string } | null;
  ttl?: number;
};

type Persisted = {
  onboarded: boolean;
  goal?: string | null;
  lastInteraction: number;
  engagement: number;
};

type Ctx = {
  persisted: Persisted;
  message: StudMessage | null;
  open: boolean;
  setOpen: (o: boolean) => void;
  pushMessage: (m: Omit<StudMessage, "id">) => void;
  dismiss: () => void;
  react: (kind: "question" | "tool" | "coins" | "motivation") => void;
  startOnboarding: () => void;
  pickGoal: (goal: string) => void;
  noteActivity: () => void;
};

const StudContext = createContext<Ctx | null>(null);

const MOTIVATIONS = [
  "Você está melhor que ontem 💪",
  "Continua assim 🔥",
  "Disciplina vence talento 😈",
  "Mais uma página, mais um nível 🚀",
  "Foco total agora ⚡",
];

const QUESTION_REACTIONS = [
  "Boa! Mandando dúvida já 👏",
  "Curioso é meio caminho andado 🧠",
  "Vamos resolver essa juntos 🔥",
];

const TOOL_REACTIONS = [
  "Você tá evoluindo rápido 🔥",
  "Ferramenta certa, hora certa ⚙️",
  "Isso aí, usa tudo a seu favor 💡",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function loadPersisted(): Persisted {
  if (typeof window === "undefined") {
    return { onboarded: false, goal: null, lastInteraction: Date.now(), engagement: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { onboarded: false, goal: null, lastInteraction: Date.now(), engagement: 0 };
}

export function StudCompanionProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<Persisted>(() => loadPersisted());
  const [message, setMessage] = useState<StudMessage | null>(null);
  const [open, setOpen] = useState(true);
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const idleTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const initRef = useRef(false);

  const persist = useCallback((next: Persisted) => {
    setPersisted(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }, []);

  const pushMessage = useCallback((m: Omit<StudMessage, "id">) => {
    const id = Date.now() + Math.random();
    const ttl = m.ttl ?? 6000;
    setMessage({ id, ...m });
    setOpen(true);
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    if (ttl > 0 && !m.cta) {
      dismissTimer.current = setTimeout(() => {
        setMessage((curr) => (curr?.id === id ? null : curr));
      }, ttl);
    }
  }, []);

  const dismiss = useCallback(() => {
    if (dismissTimer.current) clearTimeout(dismissTimer.current);
    setMessage(null);
  }, []);

  const clearIdle = useCallback(() => {
    idleTimers.current.forEach((t) => clearTimeout(t));
    idleTimers.current = [];
  }, []);

  const scheduleIdle = useCallback(() => {
    clearIdle();
    idleTimers.current.push(
      setTimeout(() => pushMessage({ text: "Ainda aí? 👀", mood: "thinking", ttl: 5000 }), 10_000),
    );
    idleTimers.current.push(
      setTimeout(() => pushMessage({ text: "Vamos continuar 😄", mood: "happy", ttl: 5000 }), 20_000),
    );
    idleTimers.current.push(
      setTimeout(
        () => pushMessage({ text: "Não desiste agora 😤", mood: "excited", ttl: 6000 }),
        40_000,
      ),
    );
  }, [pushMessage, clearIdle]);

  const noteActivity = useCallback(() => {
    persist({ ...persisted, lastInteraction: Date.now(), engagement: persisted.engagement + 1 });
    scheduleIdle();
  }, [persisted, persist, scheduleIdle]);

  const react = useCallback(
    (kind: "question" | "tool" | "coins" | "motivation") => {
      noteActivity();
      if (kind === "question") {
        pushMessage({ text: pick(QUESTION_REACTIONS), mood: "excited" });
      } else if (kind === "tool") {
        pushMessage({ text: pick(TOOL_REACTIONS), mood: "happy" });
      } else if (kind === "coins") {
        pushMessage({ text: "💰 Mandou bem! +NeuroCoins", mood: "wink" });
      } else {
        pushMessage({ text: pick(MOTIVATIONS), mood: "happy" });
      }
    },
    [pushMessage, noteActivity],
  );

  const startOnboarding = useCallback(() => {
    pushMessage({
      text: "👋 Opa! Eu sou o Stud, seu assistente de estudos. Vamos evoluir juntos?",
      mood: "happy",
      cta: { label: "Começar", action: "goal" },
      ttl: 0,
    });
  }, [pushMessage]);

  const pickGoal = useCallback(
    (goal: string) => {
      persist({ ...persisted, goal, onboarded: true });
      pushMessage({
        text: "Boa escolha 😎 Vou te ajudar nisso todos os dias.",
        mood: "wink",
        ttl: 5000,
      });
    },
    [persisted, persist, pushMessage],
  );

  // First-time welcome + idle scheduler
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    const t = setTimeout(() => {
      if (!persisted.onboarded) {
        startOnboarding();
      } else {
        pushMessage({
          text: `Bem-vindo de volta! ${pick(MOTIVATIONS)}`,
          mood: "happy",
          ttl: 5000,
        });
      }
      scheduleIdle();
    }, 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      clearIdle();
      if (dismissTimer.current) clearTimeout(dismissTimer.current);
    };
  }, [clearIdle]);

  const value = useMemo<Ctx>(
    () => ({
      persisted,
      message,
      open,
      setOpen,
      pushMessage,
      dismiss,
      react,
      startOnboarding,
      pickGoal,
      noteActivity,
    }),
    [persisted, message, open, pushMessage, dismiss, react, startOnboarding, pickGoal, noteActivity],
  );

  return <StudContext.Provider value={value}>{children}</StudContext.Provider>;
}

export function useStudCompanion() {
  const ctx = useContext(StudContext);
  if (!ctx) throw new Error("useStudCompanion must be used within StudCompanionProvider");
  return ctx;
}
