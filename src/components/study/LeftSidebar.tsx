import { Logo } from "./Logo";
import { GamificationPanel } from "./GamificationPanel";
import {
  MessageSquare,
  FileText,
  Network,
  PenLine,
  History,
  Info,
  Newspaper,
} from "lucide-react";
import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";

const NAV = [
  { key: "chat", label: "Chat", icon: MessageSquare },
  { key: "resumos", label: "Resumos", icon: FileText },
  { key: "mapas", label: "Mapas Mentais", icon: Network },
  { key: "exercicios", label: "Exercícios", icon: PenLine },
  { key: "historico", label: "Histórico", icon: History },
] as const;

export function LeftSidebar({
  onNewSource: _onNewSource,
  userEmail: _userEmail,
  onLogout: _onLogout,
}: {
  onNewSource: () => void;
  userEmail?: string | null;
  onLogout?: () => void;
}) {
  const [active, setActive] = useState<string>("chat");
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isUpdates = pathname === "/atualizacoes";
  const isCredits = pathname === "/creditos";

  return (
    <div className="flex h-full flex-col gap-5 p-4">
      <Logo />

      <nav className="flex flex-1 flex-col gap-0.5">
        {NAV.map(({ key, label, icon: Icon }) => {
          const isActive = active === key && pathname === "/";
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
          to="/atualizacoes"
          className={`group mt-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
            isUpdates
              ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_oklch(0.58_0.24_295/0.35)]"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          }`}
        >
          <Newspaper
            className={`h-4 w-4 transition ${isUpdates ? "text-primary" : "group-hover:text-primary"}`}
          />
          <span className="flex-1">Atualizações</span>
          <span className="rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 shadow-[0_0_10px_-2px_#10b981aa]">
            Novo
          </span>
        </Link>

        <Link
          to="/creditos"
          className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
            isCredits
              ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_oklch(0.58_0.24_295/0.35)]"
              : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          }`}
        >
          <Info className={`h-4 w-4 transition ${isCredits ? "text-primary" : "group-hover:text-primary"}`} />
          Créditos
        </Link>
      </nav>

      <div className="flex flex-col gap-3">
        <GamificationPanel />
      </div>
    </div>
  );
}
