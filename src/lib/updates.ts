import { useEffect, useState, useCallback } from "react";

export type UpdateType = "feature" | "improvement" | "fix" | "security" | "ai-update";

export type Update = {
  id: string;
  version: string;
  title: string;
  description: string;
  type: UpdateType;
  createdAt: number; // ms epoch
  isNew?: boolean;
};

const STORAGE_KEY = "studora:updates.v1";
const NEW_WINDOW_MS = 1000 * 60 * 60 * 24 * 7; // 7 days = "Novo"

// Seed: histórico real do app. createdAt computed once.
const SEED: Omit<Update, "isNew">[] = [
  {
    id: "u-2.3.3",
    version: "2.3.3",
    title: "Página de Atualizações dinâmica com IA",
    description: "Novo changelog dinâmico, com categorias, badges automáticas e explicações geradas por IA.",
    type: "feature",
    createdAt: new Date("2026-05-06T10:00:00").getTime(),
  },
  {
    id: "u-2.3.2",
    version: "2.3.2",
    title: "Persistência total de progresso",
    description: "Seu XP, moedas, nível e streak agora são salvos automaticamente entre sessões.",
    type: "improvement",
    createdAt: new Date("2026-05-05T10:00:00").getTime(),
  },
  {
    id: "u-2.3.1",
    version: "2.3.1",
    title: "Companheiro IA — Stud",
    description: "Conheça o Stud, seu companheiro robô que reage às suas ações e te guia no estudo.",
    type: "ai-update",
    createdAt: new Date("2026-05-04T10:00:00").getTime(),
  },
  {
    id: "u-2.3.0",
    version: "2.3.0",
    title: "Nova tela de login premium",
    description: "Redesign completo da tela inicial com glassmorphism, gradientes e onboarding interativo.",
    type: "feature",
    createdAt: new Date("2026-05-03T10:00:00").getTime(),
  },
  {
    id: "u-2.2.0",
    version: "2.2.0",
    title: "Sistema NeuroCoins",
    description: "Ganhe moedas ao usar o app, com combos, streaks e cooldown anti-spam.",
    type: "feature",
    createdAt: new Date("2026-05-01T10:00:00").getTime(),
  },
  {
    id: "u-2.1.0",
    version: "2.1.0",
    title: "Gamificação com XP e níveis",
    description: "Subir de nível agora desbloqueia conquistas e mostra animações de recompensa.",
    type: "feature",
    createdAt: new Date("2026-04-28T10:00:00").getTime(),
  },
  {
    id: "u-2.0.5",
    version: "2.0.5",
    title: "Otimização da Correção IA",
    description: "Melhoramos a precisão da correção de redações e a velocidade das respostas.",
    type: "ai-update",
    createdAt: new Date("2026-04-20T10:00:00").getTime(),
  },
  {
    id: "u-2.0.0",
    version: "2.0.0",
    title: "Lançamento Studora LM",
    description: "Primeira versão pública com chat IA, ferramentas de estudo e tema dark premium.",
    type: "feature",
    createdAt: new Date("2026-04-10T10:00:00").getTime(),
  },
];

const CHANGE_EVENT = "studora:updates:changed";

function load(): Update[] {
  if (typeof window === "undefined") return [...SEED];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return [...SEED];
    }
    const parsed = JSON.parse(raw) as Update[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [...SEED];
    return parsed;
  } catch {
    return [...SEED];
  }
}

function save(list: Update[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
  } catch {}
}

function withIsNew(list: Update[]): Update[] {
  const now = Date.now();
  return [...list]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((u) => ({ ...u, isNew: now - u.createdAt < NEW_WINDOW_MS }));
}

export function getCurrentVersion(): string {
  const list = load();
  if (list.length === 0) return "1.0.0";
  return [...list].sort((a, b) => b.createdAt - a.createdAt)[0].version;
}

export function addUpdate(input: Omit<Update, "id" | "createdAt" | "isNew"> & { createdAt?: number }) {
  const list = load();
  const next: Update = {
    id: `u-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: input.createdAt ?? Date.now(),
    version: input.version,
    title: input.title,
    description: input.description,
    type: input.type,
  };
  const updated = [next, ...list];
  save(updated);
  return next;
}

export function useUpdates() {
  const [updates, setUpdates] = useState<Update[]>(() => withIsNew(load()));

  const refresh = useCallback(() => setUpdates(withIsNew(load())), []);

  useEffect(() => {
    const onChange = () => refresh();
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) refresh();
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  return { updates, refresh, addUpdate };
}

// Metadata por categoria
import {
  Sparkles,
  Wrench,
  Bug,
  ShieldCheck,
  Brain,
  type LucideIcon,
} from "lucide-react";

export const TYPE_META: Record<
  UpdateType,
  { label: string; icon: LucideIcon; color: string; glow: string }
> = {
  feature: {
    label: "Novidade",
    icon: Sparkles,
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.45)",
  },
  improvement: {
    label: "Melhoria",
    icon: Wrench,
    color: "#3B82F6",
    glow: "rgba(59,130,246,0.45)",
  },
  fix: {
    label: "Correção",
    icon: Bug,
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.45)",
  },
  security: {
    label: "Segurança",
    icon: ShieldCheck,
    color: "#10B981",
    glow: "rgba(16,185,129,0.45)",
  },
  "ai-update": {
    label: "IA",
    icon: Brain,
    color: "#FFD700",
    glow: "rgba(255,215,0,0.5)",
  },
};
