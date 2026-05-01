import { Logo } from "./Logo";
import { GamificationPanel } from "./GamificationPanel";
import {
  MessageSquare,
  FileText,
  Network,
  PenLine,
  History,
  ChevronUp,
  Info,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@tanstack/react-router";

const NAV = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "resumos", label: "Resumos", icon: FileText },
  { key: "mapas", label: "Mapas Mentais", icon: Network },
  { key: "exercicios", label: "Exercícios", icon: PenLine },
  { key: "historico", label: "Histórico", icon: History },
] as const;

export function LeftSidebar({
  onNewSource: _onNewSource,
  userEmail,
  onLogout,
}: {
  onNewSource: () => void;
  userEmail?: string | null;
  onLogout?: () => void;
}) {
  const [active, setActive] = useState<string>("chat");
  const initial = (userEmail?.[0] ?? "E").toUpperCase();
  const displayEmail = userEmail ?? "estudante@email.com";

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
        <Link
          to="/creditos"
          className="group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/60 hover:text-foreground"
        >
          <Info className="h-4 w-4 transition group-hover:text-primary" />
          Créditos
        </Link>
      </nav>

      <div className="flex flex-col gap-3">
        <button
          onClick={onLogout}
          title={onLogout ? "Sair" : undefined}
          className="flex items-center gap-2.5 rounded-xl border border-border bg-paper/60 p-2 text-left transition hover:bg-secondary/60"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-foreground">Estudante</div>
            <div className="truncate text-[10px] text-muted-foreground">{displayEmail}</div>
          </div>
          <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
        </button>

        <GamificationPanel />
      </div>
    </div>
  );
}
