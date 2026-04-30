import { createFileRoute, Link } from "@tanstack/react-router";
import { User, Sparkles, ImageIcon, Copyright, ArrowLeft } from "lucide-react";
import { Logo } from "@/components/study/Logo";

export const Route = createFileRoute("/creditos")({
  head: () => ({
    meta: [
      { title: "Créditos — Studora LM" },
      { name: "description", content: "Créditos e reconhecimentos da plataforma Studora LM." },
      { property: "og:title", content: "Créditos — Studora LM" },
      { property: "og:description", content: "Créditos e reconhecimentos da plataforma Studora LM." },
    ],
  }),
  component: CreditosPage,
});

const CARDS = [
  {
    icon: User,
    label: "Desenvolvedor",
    title: "Luiz Ricardo da Silva Correia",
    text: "Desenvolvedor e criador principal do projeto STUDORA LM.",
  },
  {
    icon: Sparkles,
    label: "Projeto",
    title: "STUDORA LM",
    text: "Plataforma desenvolvida com foco em tecnologia, aprendizado e inovação.",
  },
  {
    icon: ImageIcon,
    label: "Recursos utilizados",
    title: "Fontes externas",
    text: "Algumas imagens, ícones e recursos podem ter sido obtidos de fontes externas e adaptados para o projeto.",
  },
];

function CreditosPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Glow ambient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.58 0.24 295 / 0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 80% 100%, oklch(0.55 0.22 265 / 0.15), transparent 60%)",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Logo size="sm" showTagline={false} />
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-paper/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        {/* Hero */}
        <div className="msg-in text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-paper/60 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_oklch(0.58_0.24_295)]" />
            Créditos
          </div>
          <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">
            Construído com{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              cuidado
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Reconhecimento às pessoas, ferramentas e recursos que tornaram o Studora LM possível.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid gap-4">
          {CARDS.map((c, i) => {
            const Icon = c.icon;
            return (
              <article
                key={c.label}
                className="msg-in hover-lift group relative overflow-hidden rounded-2xl border border-border bg-paper/50 p-6 backdrop-blur-sm transition hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_oklch(0.58_0.24_295/0.35)]"
                style={{ animationDelay: `${0.1 + i * 0.08}s` }}
              >
                {/* gradient hover overlay */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.58 0.24 295 / 0.06), transparent 50%, oklch(0.55 0.22 265 / 0.06))",
                  }}
                />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary ring-1 ring-inset ring-primary/30">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      {c.label}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                      {c.title}
                    </h2>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {c.text}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Copyright */}
        <div
          className="msg-in mt-10 flex items-center justify-center gap-2 rounded-2xl border border-border/60 bg-paper/30 px-6 py-5 text-center backdrop-blur-sm"
          style={{ animationDelay: "0.4s" }}
        >
          <Copyright className="h-4 w-4 text-muted-foreground" />
          <p className="text-xs text-muted-foreground sm:text-sm">
            <span className="font-medium text-foreground">© 2026 STUDORA LM</span> — Todos os direitos reservados
          </p>
        </div>
      </main>
    </div>
  );
}
