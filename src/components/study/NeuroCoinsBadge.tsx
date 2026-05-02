import { useEffect, useState } from "react";
import { Brain, Flame, Sparkles, X } from "lucide-react";
import { useNeuroCoins, formatCoins } from "@/hooks/useNeuroCoins";

export function NeuroCoinsBadge() {
  const { state, coinEvents, toastEvents, pulseKey } = useNeuroCoins();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (pulseKey === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [pulseKey]);

  const last = state.lastReward;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
          pulse
            ? "border-[oklch(0.85_0.17_85)] bg-[oklch(0.85_0.17_85/0.12)] text-[oklch(0.92_0.13_90)] shadow-[0_0_18px_oklch(0.85_0.17_85/0.55)]"
            : "border-[oklch(0.85_0.17_85/0.4)] bg-paper/60 text-[oklch(0.9_0.13_88)] hover:border-[oklch(0.85_0.17_85/0.7)] hover:shadow-[0_0_12px_oklch(0.85_0.17_85/0.35)]"
        }`}
        aria-label="NeuroCoins"
      >
        <Brain className="h-3.5 w-3.5" />
        <span className="tabular-nums">{formatCoins(state.balance)}</span>

        {/* Floating coin events */}
        <span className="pointer-events-none absolute -top-1 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5">
          {coinEvents.map((e) => (
            <span
              key={e.id}
              className={`animate-xp-float whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg ${
                e.surprise
                  ? "bg-gradient-to-r from-[oklch(0.85_0.17_85)] to-[oklch(0.7_0.22_30)] text-background shadow-[0_0_18px_oklch(0.85_0.17_85/0.9)]"
                  : "bg-gradient-to-r from-[oklch(0.85_0.17_85)] to-[oklch(0.78_0.18_60)] text-background"
              }`}
            >
              +{formatCoins(e.amount)} 💰
              {e.label ? <span className="ml-1 opacity-80">{e.label}</span> : null}
            </span>
          ))}
        </span>
      </button>

      {/* Toast messages */}
      <div className="pointer-events-none absolute right-0 top-full z-40 mt-2 flex flex-col items-end gap-1">
        {toastEvents.map((t) => (
          <span
            key={t.id}
            className="msg-in rounded-lg border border-[oklch(0.85_0.17_85/0.35)] bg-background/95 px-3 py-1.5 text-[11px] font-medium text-foreground shadow-[0_8px_24px_-8px_oklch(0.85_0.17_85/0.4)] backdrop-blur"
          >
            {t.text}
          </span>
        ))}
      </div>

      {/* Contextual panel */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right animate-scale-in rounded-2xl border border-border bg-popover p-4 shadow-[0_20px_60px_-20px_oklch(0_0_0/0.6),0_0_30px_-10px_oklch(0.85_0.17_85/0.3)]">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Brain className="h-4 w-4 text-[oklch(0.85_0.17_85)]" />
                <span className="text-sm font-semibold text-foreground">NeuroCoins</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="rounded-xl border border-[oklch(0.85_0.17_85/0.3)] bg-gradient-to-br from-[oklch(0.85_0.17_85/0.08)] to-transparent p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Saldo atual
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="text-2xl font-bold tabular-nums text-[oklch(0.9_0.14_88)]">
                  {state.balance.toLocaleString("pt-BR")}
                </span>
                <span className="text-xs text-muted-foreground">NC</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-border bg-paper/60 p-2.5">
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Flame className="h-3 w-3 text-[oklch(0.78_0.18_55)]" />
                  Streak
                </div>
                <div className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
                  {state.streak}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">dias</span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-paper/60 p-2.5">
                <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3 w-3 text-primary" />
                  Combo
                </div>
                <div className="mt-0.5 text-lg font-bold tabular-nums text-foreground">
                  x{state.comboCount || 0}
                </div>
              </div>
            </div>

            {last ? (
              <div className="mt-3 rounded-lg border border-border bg-paper/40 p-2.5">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Última recompensa
                </div>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-xs text-foreground">
                    +{last.amount} NC
                    {last.bonus > 0 ? (
                      <span className="ml-1 text-[oklch(0.78_0.18_55)]">
                        (+{last.bonus} combo)
                      </span>
                    ) : null}
                    {last.surprise > 0 ? (
                      <span className="ml-1 text-[oklch(0.85_0.17_85)]">🎉 surpresa</span>
                    ) : null}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(last.at).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-border p-2.5 text-center text-[11px] text-muted-foreground">
                Faça uma pergunta para ganhar NeuroCoins
              </div>
            )}

            <div className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
              Ganhe moedas perguntando, usando ferramentas e mantendo seu streak diário 🔥
            </div>
          </div>
        </>
      )}
    </div>
  );
}
