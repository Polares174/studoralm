import { Flame, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { useGamification } from "@/hooks/useGamification";

export function GamificationPanel() {
  const { state, currentLevelXp, nextLevelXp, progressPct, xpEvents, levelUpEvent, clearLevelUp } =
    useGamification();

  useEffect(() => {
    if (!levelUpEvent) return;
    const t = setTimeout(() => clearLevelUp(), 2800);
    return () => clearTimeout(t);
  }, [levelUpEvent, clearLevelUp]);

  return (
    <div className="relative rounded-xl border border-border bg-paper/60 p-3 shadow-[0_0_20px_-12px_oklch(0.58_0.24_295/0.6)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="flex h-5 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent px-1.5 text-[10px] font-bold text-primary-foreground shadow-[0_0_10px_-2px_oklch(0.58_0.24_295/0.8)]">
            Lv {state.level}
          </div>
          <Sparkles className="h-3 w-3 text-primary" />
        </div>
        <div className="flex items-center gap-1 text-[11px] font-semibold text-[oklch(0.78_0.18_55)]">
          <Flame className="h-3.5 w-3.5" />
          {state.streak}
          <span className="text-muted-foreground font-normal">d</span>
        </div>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[oklch(0.6_0.22_230)] via-primary to-accent transition-[width] duration-500 ease-out shadow-[0_0_8px_oklch(0.58_0.24_295/0.8)]"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">{state.xp - currentLevelXp}</span> /{" "}
          {nextLevelXp - currentLevelXp} XP
        </span>
        <span>{state.xp} total</span>
      </div>

      {/* XP gain floating events */}
      <div className="pointer-events-none absolute -top-2 right-2 flex flex-col items-end gap-0.5">
        {xpEvents.map((e) => (
          <span
            key={e.id}
            className="animate-xp-float rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[10px] font-bold text-primary-foreground shadow-[0_0_12px_oklch(0.58_0.24_295/0.9)]"
          >
            +{e.amount} XP
          </span>
        ))}
      </div>

      {/* Level up overlay */}
      {levelUpEvent && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
          <div className="animate-level-up rounded-2xl border border-primary/40 bg-background/90 px-8 py-6 text-center shadow-[0_0_60px_-10px_oklch(0.58_0.24_295/0.9)] backdrop-blur">
            <div className="mb-2 text-5xl">🚀</div>
            <div className="bg-gradient-to-r from-[oklch(0.6_0.22_230)] via-primary to-accent bg-clip-text text-2xl font-bold text-transparent">
              Você subiu de nível!
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Agora você é <span className="font-semibold text-foreground">Level {levelUpEvent.level}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
