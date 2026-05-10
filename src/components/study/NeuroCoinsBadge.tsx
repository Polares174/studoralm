import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Brain, Flame, Sparkles, Trophy, TrendingUp, X, Zap } from "lucide-react";
import { useNeuroCoins, formatCoins } from "@/hooks/useNeuroCoins";
import { useUser } from "@/hooks/useUser";

export function NeuroCoinsBadge() {
  const { state, coinEvents, toastEvents, pulseKey } = useNeuroCoins();
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (pulseKey === 0) return;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 600);
    return () => clearTimeout(t);
  }, [pulseKey]);

  // Lock body scroll when modal open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const last = state.lastReward;
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const xpForNext = level * 100;
  const xpProgress = Math.min(100, (xp % xpForNext) / xpForNext * 100);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(true)}
          className={`group relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
            pulse
              ? "border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_22px_rgba(255,215,0,0.55)]"
              : "border-[#FFD700]/40 bg-white/[0.03] text-[#FFD700] hover:border-[#FFD700]/80 hover:bg-[#FFD700]/[0.08] hover:shadow-[0_0_18px_rgba(255,215,0,0.4)]"
          }`}
          aria-label="Abrir NeuroCoins"
        >
          <Brain className="h-3.5 w-3.5" />
          <span className="tabular-nums">{formatCoins(state.balance)}</span>

          <span className="pointer-events-none absolute -top-1 left-1/2 flex -translate-x-1/2 flex-col items-center gap-0.5">
            {coinEvents.map((e) => (
              <span
                key={e.id}
                className={`animate-xp-float whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-bold shadow-lg ${
                  e.surprise
                    ? "bg-gradient-to-r from-[#FFD700] to-[#7C3AED] text-black shadow-[0_0_18px_rgba(255,215,0,0.9)]"
                    : "bg-gradient-to-r from-[#FFD700] to-[#FFA500] text-black"
                }`}
              >
                +{formatCoins(e.amount)} 💰
                {e.label ? <span className="ml-1 opacity-80">{e.label}</span> : null}
              </span>
            ))}
          </span>
        </button>

        {/* Floating toast (still tied to button area) */}
        <div className="pointer-events-none absolute right-0 top-full z-[60] mt-2 flex flex-col items-end gap-1">
          {toastEvents.map((t) => (
            <span
              key={t.id}
              className="msg-in rounded-lg border border-[#FFD700]/35 bg-[#0B0B11]/95 px-3 py-1.5 text-[11px] font-medium text-white shadow-[0_8px_24px_-8px_rgba(255,215,0,0.4)] backdrop-blur"
            >
              {t.text}
            </span>
          ))}
        </div>
      </div>

      {mounted && open && createPortal(
        <div
          className="fixed inset-0 flex items-start justify-center sm:justify-end p-4 sm:p-6"
          style={{ zIndex: 2147483000, isolation: "isolate" }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-md animate-nc-backdrop-in"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div
            className="relative mt-16 sm:mt-2 w-full sm:w-[380px] max-w-[92vw] max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 animate-nc-modal-in"
            style={{
              backgroundColor: "#0B0B11",
              backgroundImage:
                "radial-gradient(circle at 20% 0%, rgba(124,58,237,0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,215,0,0.12), transparent 55%), linear-gradient(135deg, #13131C 0%, #0B0B11 60%, #0B0B11 100%)",
              boxShadow:
                "0 30px 80px -20px rgba(124,58,237,0.55), 0 0 60px -20px rgba(255,215,0,0.28), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-20 -right-20 h-40 w-40 rounded-full bg-[#FFD700]/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-[#7C3AED]/30 blur-3xl" />

            {/* Header */}
            <div className="relative flex items-start justify-between p-5 pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#FFD700] shadow-[0_0_20px_rgba(124,58,237,0.5)]">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">NeuroCoins</h2>
                  <p className="text-[11px] text-white/50">Seu progresso inteligente</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Scroll content */}
            <div className="relative max-h-[calc(85vh-72px)] overflow-y-auto px-5 pb-5 nc-scroll">
              {/* Balance card */}
              <div className="relative overflow-hidden rounded-2xl border border-[#FFD700]/30 bg-gradient-to-br from-[#FFD700]/[0.08] to-[#7C3AED]/[0.05] p-5 text-center">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,215,0,0.25),transparent_60%)]" />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.2em] text-white/50">Saldo Atual</div>
                  <div className="mt-2 flex items-baseline justify-center gap-2">
                    <span
                      className="text-5xl font-black tabular-nums text-transparent bg-clip-text bg-gradient-to-b from-[#FFF4B8] to-[#FFD700]"
                      style={{ filter: "drop-shadow(0 0 18px rgba(255,215,0,0.6))" }}
                    >
                      {state.balance.toLocaleString("pt-BR")}
                    </span>
                    <span className="text-sm font-semibold text-[#FFD700]/70">NC</span>
                  </div>
                </div>
              </div>

              {/* Stats grid */}
              <div className="mt-4 grid grid-cols-2 gap-2.5">
                <StatCard
                  icon={<Flame className="h-3.5 w-3.5" />}
                  label="Streak"
                  value={state.streak}
                  unit="dias"
                  color="#FF7849"
                />
                <StatCard
                  icon={<Zap className="h-3.5 w-3.5" />}
                  label="Combo"
                  value={state.comboCount || 0}
                  unit={`x`}
                  color="#7C3AED"
                  prefix="x"
                  showUnit={false}
                />
                <StatCard
                  icon={<Trophy className="h-3.5 w-3.5" />}
                  label="Nível"
                  value={level}
                  color="#FFD700"
                />
                <StatCard
                  icon={<TrendingUp className="h-3.5 w-3.5" />}
                  label="XP"
                  value={xp}
                  color="#3B82F6"
                />
              </div>

              {/* XP progress */}
              <div className="mt-4 rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-white/50">
                  <span>Próximo nível</span>
                  <span className="tabular-nums text-white/70">
                    {xp % xpForNext}/{xpForNext}
                  </span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#7C3AED] to-[#FFD700] transition-all duration-700"
                    style={{ width: `${xpProgress}%`, boxShadow: "0 0 12px rgba(255,215,0,0.5)" }}
                  />
                </div>
              </div>

              {/* Last reward */}
              {last ? (
                <div className="mt-4 rounded-xl border border-[#FFD700]/25 bg-gradient-to-r from-[#FFD700]/[0.08] to-transparent p-3">
                  <div className="text-[10px] uppercase tracking-wider text-white/50">Última recompensa</div>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span
                      className="text-sm font-bold text-[#FFD700]"
                      style={{ textShadow: "0 0 12px rgba(255,215,0,0.5)" }}
                    >
                      🎉 +{last.amount} NeuroCoins
                    </span>
                    <span className="text-[10px] text-white/40">
                      {new Date(last.at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {(last.bonus > 0 || last.surprise > 0) && (
                    <div className="mt-1 flex gap-2 text-[10px]">
                      {last.bonus > 0 && (
                        <span className="rounded-full bg-[#7C3AED]/20 px-2 py-0.5 text-[#C4A6FF]">
                          +{last.bonus} combo
                        </span>
                      )}
                      {last.surprise > 0 && (
                        <span className="rounded-full bg-[#FFD700]/20 px-2 py-0.5 text-[#FFD700]">
                          🎁 +{last.surprise} surpresa
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-dashed border-white/10 p-4 text-center text-[11px] text-white/40">
                  Faça uma pergunta para ganhar NeuroCoins ✨
                </div>
              )}

              <p className="mt-4 text-center text-[10px] leading-relaxed text-white/40">
                Ganhe moedas perguntando, usando ferramentas e mantendo seu streak diário 🔥
              </p>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

function StatCard({
  icon,
  label,
  value,
  unit,
  color,
  prefix,
  showUnit = true,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit?: string;
  color: string;
  prefix?: string;
  showUnit?: boolean;
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-all hover:border-white/20 hover:bg-white/[0.05]"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
        style={{ background: `radial-gradient(circle at 50% 0%, ${color}25, transparent 70%)` }}
      />
      <div className="relative flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/50">
        <span style={{ color }}>{icon}</span>
        {label}
      </div>
      <div className="relative mt-1 text-xl font-bold tabular-nums text-white">
        {prefix}
        {value}
        {showUnit && unit && (
          <span className="ml-1 text-[10px] font-normal text-white/40">{unit}</span>
        )}
      </div>
    </div>
  );
}
