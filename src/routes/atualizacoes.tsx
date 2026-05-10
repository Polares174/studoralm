import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Sparkles, Brain, Volume2, X, Zap } from "lucide-react";
import { Logo } from "@/components/study/Logo";
import { useSpeech } from "@/hooks/useSpeech";
import { useUpdates, TYPE_META, getCurrentVersion, type Update } from "@/lib/updates";

export const Route = createFileRoute("/atualizacoes")({
  head: () => ({
    meta: [
      { title: "Atualizações — Studora LM" },
      {
        name: "description",
        content:
          "Changelog dinâmico do Studora LM com explicações por IA, categorias e novidades em tempo real.",
      },
      { property: "og:title", content: "Atualizações — Studora LM" },
      {
        property: "og:description",
        content: "Veja o que mudou no Studora LM — changelog dinâmico com IA.",
      },
    ],
  }),
  component: AtualizacoesPage,
});

function relativeDate(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function explainUpdate(u: Update): string {
  const intros = [
    "Em palavras simples:",
    "Resumindo pra você:",
    "Na prática:",
    "Pra ficar fácil de entender:",
  ];
  const intro = intros[Math.abs(hashCode(u.id)) % intros.length];

  const byType: Record<Update["type"], string> = {
    feature: "Esse é um novo recurso pra você usar no app, deixando sua experiência mais completa.",
    improvement: "A gente refinou algo que já existia pra ficar mais rápido, fluido e agradável.",
    fix: "Corrigimos um problema que podia atrapalhar seu uso, agora tudo funciona como deveria.",
    security: "Reforçamos a segurança da plataforma pra proteger seus dados e progresso.",
    "ai-update": "A IA ficou mais inteligente e útil pra te ajudar nos estudos do dia a dia.",
  };

  return `${intro} ${u.description} ${byType[u.type]}`;
}

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return h;
}

function AtualizacoesPage() {
  const { updates } = useUpdates();
  const currentVersion = useMemo(() => updates[0]?.version ?? getCurrentVersion(), [updates]);
  const [explainTarget, setExplainTarget] = useState<Update | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.58 0.24 295 / 0.18), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, oklch(0.55 0.22 265 / 0.12), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 py-10 sm:py-14">
        <div className="mb-10 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur transition hover:text-foreground hover:border-primary/40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>
          <Logo />
        </div>

        <header className="mb-12 text-center msg-in">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Últimas Atualizações
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Veja o que mudou no Studora LM — atualizado em tempo real
          </p>

          <div className="mt-6 flex justify-center">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-[#1a1200] shadow-[0_0_30px_-4px_#FFD70080]"
              style={{
                background: "linear-gradient(135deg, #FFE066, #FFD700 45%, #E6B800)",
                border: "1px solid #FFD70066",
              }}
            >
              <Sparkles className="h-4 w-4" />
              Versão atual: {currentVersion}
            </div>
          </div>
        </header>

        <ol className="space-y-4">
          {updates.map((u, i) => (
            <li
              key={u.id}
              style={{ animationDelay: `${i * 60}ms` }}
              className="msg-in"
            >
              <UpdateCard update={u} onExplain={() => setExplainTarget(u)} />
            </li>
          ))}
        </ol>

        {updates.length === 0 && (
          <p className="mt-12 text-center text-sm text-muted-foreground">
            Nenhuma atualização ainda.
          </p>
        )}

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Mais novidades chegando em breve ✨
        </p>
      </div>

      {explainTarget && (
        <ExplainModal update={explainTarget} onClose={() => setExplainTarget(null)} />
      )}
    </div>
  );
}

function UpdateCard({ update, onExplain }: { update: Update; onExplain: () => void }) {
  const meta = TYPE_META[update.type];
  const Icon = meta.icon;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md transition hover-lift hover:border-primary/40"
      style={{
        boxShadow: `0 8px 40px -16px ${meta.glow}`,
      }}
    >
      {update.isNew && (
        <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 shadow-[0_0_18px_-2px_#10b98199]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 stud-blink-glow" />
          Novo
        </span>
      )}

      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition group-hover:scale-105"
          style={{
            borderColor: `${meta.color}55`,
            backgroundColor: `${meta.color}1a`,
            color: meta.color,
            boxShadow: `0 0 20px -8px ${meta.glow}`,
          }}
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span
              className="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider"
              style={{
                color: meta.color,
                borderColor: `${meta.color}55`,
                backgroundColor: `${meta.color}14`,
              }}
            >
              {meta.label}
            </span>
            <span>v{update.version}</span>
            <span>·</span>
            <span>{relativeDate(update.createdAt)}</span>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground">
            {update.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {update.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onExplain}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 hover:shadow-[0_0_18px_-4px_oklch(0.58_0.24_295/0.6)]"
            >
              <Brain className="h-3.5 w-3.5" />
              Explicar com IA
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* -------------------- Explain Modal (com IA + TTS) -------------------- */

function ExplainModal({ update, onClose }: { update: Update; onClose: () => void }) {
  const fullText = useMemo(() => explainUpdate(update), [update]);
  const [typed, setTyped] = useState("");
  const { speaking, toggle, supported } = useSpeech(fullText);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Animação de digitação
  useEffect(() => {
    setTyped("");
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setTyped(fullText.slice(0, i));
      if (i >= fullText.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, [fullText]);

  // Esc + lock scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  if (!mounted) return null;

  const meta = TYPE_META[update.type];

  return createPortal(
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: 2147483000, isolation: "isolate" }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-md animate-nc-backdrop-in"
        onClick={onClose}
      />
      <div
        className="relative w-full max-w-md max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 animate-nc-modal-in"
        style={{
          backgroundColor: "#0B0B11",
          backgroundImage:
            "radial-gradient(circle at 20% 0%, rgba(124,58,237,0.22), transparent 55%), radial-gradient(circle at 100% 100%, rgba(255,215,0,0.12), transparent 55%), linear-gradient(135deg, #13131C 0%, #0B0B11 60%, #0B0B11 100%)",
          boxShadow:
            "0 30px 80px -20px rgba(124,58,237,0.55), 0 0 60px -20px rgba(255,215,0,0.28)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between p-5 pb-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${meta.color}, #7C3AED)`,
                boxShadow: `0 0 20px ${meta.glow}`,
              }}
            >
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Explicação por IA</h2>
              <p className="text-[11px] text-white/50">v{update.version} · {meta.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(85vh-72px)] overflow-y-auto px-5 pb-5 nc-scroll">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#FFD700]">
              <Zap className="h-3 w-3" />
              {update.title}
            </div>
            <p className="min-h-[60px] text-sm leading-relaxed text-white/90">
              {typed}
              {typed.length < fullText.length && (
                <span className="ml-0.5 inline-block h-3 w-1 animate-pulse bg-[#FFD700] align-middle" />
              )}
            </p>
          </div>

          {supported && (
            <button
              type="button"
              onClick={toggle}
              aria-pressed={speaking}
              className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-xs font-medium transition ${
                speaking
                  ? "border-[#FFD700]/60 bg-[#FFD700]/15 text-[#FFD700]"
                  : "border-white/15 bg-white/[0.04] text-white/80 hover:border-[#FFD700]/40 hover:text-white"
              }`}
            >
              <Volume2 className="h-3.5 w-3.5" />
              {speaking ? "Parar leitura" : "Ouvir atualização"}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
