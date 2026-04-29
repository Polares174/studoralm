import { Logo } from "./Logo";
import {
  MessageSquare,
  FileText,
  Network,
  PenLine,
  History,
  Crown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

const NAV = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "resumos", label: "Resumos", icon: FileText },
  { key: "mapas", label: "Mapas Mentais", icon: Network },
  { key: "exercicios", label: "Exercícios", icon: PenLine },
  { key: "historico", label: "Histórico", icon: History },
] as const;

export function LeftSidebar({ onNewSource: _onNewSource }: { onNewSource: () => void }) {
  const [active, setActive] = useState<string>("chat");

  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <Logo />

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                isActive
                  ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_oklch(0.58_0.24_295/0.35)]"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              }`}
            >
              <Icon
                className={`h-4 w-4 transition ${isActive ? "text-primary" : "group-hover:text-primary"}`}
              />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-border bg-paper/60 p-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-[oklch(0.78_0.16_85)]" />
            <span className="text-sm font-semibold text-foreground">Plano Estudante</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Acesso ilimitado a todos os recursos
          </p>
          <button className="mt-2.5 w-full rounded-md bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/25">
            Gerenciar plano
          </button>
        </div>

        <button className="flex items-center gap-2.5 rounded-xl border border-border bg-paper/60 p-2 text-left transition hover:bg-secondary/60">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
            E
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-foreground">Estudante</div>
            <div className="truncate text-[10px] text-muted-foreground">estudante@email.com</div>
          </div>
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
