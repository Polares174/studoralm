import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Sparkles,
  Rocket,
  Brain,
  Zap,
  Trophy,
  Coins,
  Bot,
  Save,
  Palette,
  Volume2,
  ChevronDown,
} from "lucide-react";
import { Logo } from "@/components/study/Logo";
import { useSpeech } from "@/hooks/useSpeech";

export const Route = createFileRoute("/atualizacoes")({
  head: () => ({
    meta: [
      { title: "Atualizações — Studora LM" },
      {
        name: "description",
        content: "Veja as últimas novidades e melhorias do Studora LM, com explicações inteligentes feitas por IA.",
      },
      { property: "og:title", content: "Atualizações — Studora LM" },
      {
        property: "og:description",
        content: "Veja o que mudou no Studora LM — changelog com IA.",
      },
    ],
  }),
  component: AtualizacoesPage,
});

type Update = {
  id: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  version: string;
  date: string;
  description: string;
  isNew?: boolean;
};

const CURRENT_VERSION = "2.3.3";

const UPDATES: Update[] = [
  {
    id: 8,
    icon: Sparkles,
    title: "Página de Atualizações com IA",
    version: "2.3.3",
    date: "06/05/2026",
    description:
      "Nova página de changelog com explicações geradas por IA e leitura em voz alta.",
    isNew: true,
  },
  {
    id: 7,
    icon: Save,
    title: "Persistência total de progresso",
    version: "2.3.2",
    date: "05/05/2026",
    description:
      "Seu XP, moedas, nível e streak agora são salvos automaticamente entre sessões.",
    isNew: true,
  },
  {
    id: 6,
    icon: Bot,
    title: "Companheiro IA — Stud",
    version: "2.3.1",
    date: "04/05/2026",
    description:
      "Conheça o Stud, seu companheiro robô que reage às suas ações e te guia no estudo.",
    isNew: true,
  },
  {
    id: 5,
    icon: Palette,
    title: "Nova tela de login premium",
    version: "2.3.0",
    date: "03/05/2026",
    description:
      "Redesign completo da tela inicial com glassmorphism, gradientes e onboarding interativo.",
  },
  {
    id: 4,
    icon: Coins,
    title: "Sistema NeuroCoins",
    version: "2.2.0",
    date: "01/05/2026",
    description:
      "Ganhe moedas ao usar o app, com combos, streaks e cooldown anti-spam.",
  },
  {
    id: 3,
    icon: Trophy,
    title: "Gamificação com XP e níveis",
    version: "2.1.0",
    date: "28/04/2026",
    description:
      "Subir de nível agora desbloqueia conquistas e mostra animações de recompensa.",
  },
  {
    id: 2,
    icon: Brain,
    title: "Otimização da Correção IA",
    version: "2.0.5",
    date: "20/04/2026",
    description:
      "Melhoramos a precisão da correção de redações e a velocidade das respostas.",
  },
  {
    id: 1,
    icon: Rocket,
    title: "Lançamento Studora LM",
    version: "2.0.0",
    date: "10/04/2026",
    description:
      "Primeira versão pública com chat IA, ferramentas de estudo e tema dark premium.",
  },
];

// Simulação de IA — gera explicação simples e amigável
function explainUpdate(u: Update): string {
  const intros = [
    "Em palavras simples:",
    "Resumindo pra você:",
    "Na prática:",
    "Pra ficar fácil de entender:",
  ];
  const intro = intros[u.id % intros.length];

  const map: Record<number, string> = {
    8: "Agora você pode ver tudo que mudou no app e ainda pedir pra IA explicar de um jeito fácil. Sem complicação!",
    7: "Pode fechar o site tranquilo — quando voltar, suas moedas, XP e nível vão estar exatamente onde você parou.",
    6: "Você ganhou um amigo robô chamado Stud! Ele aparece pra te animar, comemorar suas vitórias e dar aquele empurrãozinho quando precisar.",
    5: "A tela de entrada ficou muito mais bonita e moderna, com aquele visual de aplicativo grande, pra você se sentir em casa desde o começo.",
    4: "Toda vez que você estuda, ganha moedas chamadas NeuroCoins. Quanto mais consistente, mais recompensas — tipo um jogo!",
    3: "Estudar agora vira pontos de XP. Você sobe de nível, desbloqueia conquistas e vê seu progresso de verdade.",
    2: "A IA ficou mais esperta e rápida pra corrigir suas redações, te ajudando a evoluir com feedback mais preciso.",
    1: "O Studora LM nasceu! Um espaço pra você estudar com inteligência artificial de um jeito leve e organizado.",
  };

  return `${intro} ${map[u.id] ?? "Essa atualização deixou o Studora LM melhor pra você usar no dia a dia."}`;
}

function AtualizacoesPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Glow ambiental */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          backgroundImage:
            "radial-gradient(ellipse 70% 50% at 50% -10%, oklch(0.58 0.24 295 / 0.18), transparent), radial-gradient(ellipse 50% 40% at 100% 100%, oklch(0.55 0.22 265 / 0.12), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-3xl px-5 py-10 sm:py-14">
        {/* Header */}
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

        {/* Topo */}
        <header className="mb-12 text-center msg-in">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Últimas Atualizações
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            Veja o que mudou no Studora LM
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
              Versão atual: {CURRENT_VERSION}
            </div>
          </div>
        </header>

        {/* Lista */}
        <ol className="space-y-4">
          {UPDATES.map((u, i) => (
            <li key={u.id} style={{ animationDelay: `${i * 60}ms` }} className="msg-in">
              <UpdateCard update={u} />
            </li>
          ))}
        </ol>

        <p className="mt-12 text-center text-xs text-muted-foreground">
          Mais novidades chegando em breve ✨
        </p>
      </div>
    </div>
  );
}

function UpdateCard({ update }: { update: Update }) {
  const [open, setOpen] = useState(false);
  const explanation = explainUpdate(update);
  const { speaking, toggle, supported } = useSpeech(explanation);
  const Icon = update.icon;

  return (
    <article
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md transition hover-lift hover:border-primary/40 hover:shadow-[0_8px_40px_-12px_oklch(0.58_0.24_295/0.35)]"
    >
      {update.isNew && (
        <span
          className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300 shadow-[0_0_18px_-2px_#10b98199]"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 stud-blink-glow" />
          Novo
        </span>
      )}

      <div className="flex items-start gap-4">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary transition group-hover:scale-105"
        >
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground/80">Atualização #{update.id}</span>
            <span>·</span>
            <span>v{update.version}</span>
            <span>·</span>
            <span>{update.date}</span>
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold text-foreground">
            {update.title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {update.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/20 hover:shadow-[0_0_18px_-4px_oklch(0.58_0.24_295/0.6)]"
            >
              <Brain className="h-3.5 w-3.5" />
              Explicar com IA
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>

            {open && supported && (
              <button
                type="button"
                onClick={toggle}
                aria-pressed={speaking}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  speaking
                    ? "border-accent/60 bg-accent/15 text-accent"
                    : "border-border bg-card text-muted-foreground hover:text-foreground hover:border-accent/40"
                }`}
              >
                <Volume2 className="h-3.5 w-3.5" />
                {speaking ? "Parar" : "Ouvir explicação"}
              </button>
            )}
          </div>

          <div
            className={`grid transition-all duration-300 ease-out ${
              open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="overflow-hidden">
              <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-accent/10 p-4 text-sm leading-relaxed text-foreground/90">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary">
                  <Zap className="h-3 w-3" />
                  Explicação por IA
                </div>
                {explanation}
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
