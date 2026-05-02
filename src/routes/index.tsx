import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LeftSidebar } from "@/components/study/LeftSidebar";
import { RightTools } from "@/components/study/RightTools";
import { DocumentPanel, type StudyDoc } from "@/components/study/DocumentPanel";
import { StudyChat } from "@/components/study/StudyChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, PanelRight, LogOut } from "lucide-react";
import { Logo } from "@/components/study/Logo";
import { LoginScreen } from "@/components/study/LoginScreen";
import { useGamification } from "@/hooks/useGamification";
import { useNeuroCoins } from "@/hooks/useNeuroCoins";
import { NeuroCoinsBadge } from "@/components/study/NeuroCoinsBadge";

const AUTH_KEY = "estudoslm:user-email";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Studora LM — IA para estudantes (ENEM, concursos, faculdade)" },
      {
        name: "description",
        content:
          "Plataforma de estudos com IA: explicações, resumos, mapas mentais, flashcards e exercícios a partir das suas fontes.",
      },
      { property: "og:title", content: "Studora LM" },
      {
        property: "og:description",
        content: "Aprenda de verdade com um professor particular de IA.",
      },
    ],
  }),
});

function Index() {
  const { addXp } = useGamification();
  const { rewardUser } = useNeuroCoins();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [docs, setDocs] = useState<StudyDoc[]>([]);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [mobileLeft, setMobileLeft] = useState(false);
  const [mobileRight, setMobileRight] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState<{ text: string; nonce: number } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY);
      if (stored) setUserEmail(stored);
    } catch {
      // ignore
    }
    setAuthReady(true);
  }, []);

  function handleLogin(email: string) {
    try {
      localStorage.setItem(AUTH_KEY, email);
    } catch {
      // ignore
    }
    setUserEmail(email);
  }

  function handleLogout() {
    try {
      localStorage.removeItem(AUTH_KEY);
    } catch {
      // ignore
    }
    setUserEmail(null);
  }

  function openSources() {
    setSourcesOpen(true);
  }

  const TOOL_PROMPTS: Record<string, string> = {
    resumo:
      "Crie um RESUMO didático e completo do conteúdo das minhas fontes (ou, se não houver fontes, peça o tema). Estruture em: 1) Visão geral, 2) Conceitos-chave em tópicos, 3) Pontos cobrados em provas, 4) Resumo final em 5 linhas.",
    mapa:
      "Crie um MAPA MENTAL em formato de texto hierárquico (com indentação e marcadores) sobre o conteúdo das minhas fontes. Mostre tema central, ramos principais, sub-ramos e exemplos. Se não houver fontes, pergunte qual tema usar.",
    flashcards:
      "Gere 10 FLASHCARDS no formato:\\n\\n**Card N**\\n- Pergunta: ...\\n- Resposta: ...\\n\\nUse o conteúdo das minhas fontes. Misture níveis (fácil, médio, difícil). Se não houver fontes, pergunte o tema.",
    exercicios:
      "Crie 5 EXERCÍCIOS sobre o conteúdo das minhas fontes (2 fáceis, 2 médios, 1 difícil). Para cada um: enunciado, alternativas quando fizer sentido, gabarito e RESOLUÇÃO COMENTADA passo a passo. Se não houver fontes, pergunte o tema.",
    relatorio:
      "Gere um RELATÓRIO DE ESTUDO completo sobre as minhas fontes contendo: 1) Tema e contexto, 2) Objetivos de aprendizagem, 3) Síntese, 4) Conceitos essenciais, 5) Conexões com outros temas, 6) Possíveis questões de prova, 7) Conclusão. Se não houver fontes, pergunte o tema.",
    citacoes:
      "Extraia as principais CITAÇÕES e trechos relevantes das minhas fontes, organizando por tema. Para cada uma: o trecho exato entre aspas, breve explicação do contexto e por que é importante. Se não houver fontes, avise que precisa de material enviado.",
    audio:
      `Você agora está em MODO ÁUDIO. Transforme o conteúdo das minhas fontes (ou, se não houver, pergunte o tema) em uma EXPLICAÇÃO FALADA, natural e envolvente, como um professor explicando em voz alta para um aluno.

REGRAS DE ESCRITA PARA ÁUDIO (TTS):
- Linguagem simples, conversacional, como fala — não como texto formal.
- Frases curtas, com pausas naturais (vírgulas e pontos).
- Sem listas longas, sem tabelas, sem emojis, sem markdown pesado, sem títulos com #.
- Sem blocos de código, sem LaTeX, sem caracteres especiais difíceis de narrar.
- Se precisar usar um termo técnico, explique em seguida com palavras simples.

ESTRUTURA OBRIGATÓRIA (em parágrafos curtos, fluindo como fala):
1) INTRODUÇÃO: comece chamando o aluno de forma amigável (ex: "Beleza, vamos entender isso juntos...").
2) EXPLICAÇÃO: passo a passo, leve e claro.
3) INTUIÇÃO: explique o porquê daquilo funcionar.
4) EXEMPLO: um exemplo simples, fácil de imaginar.
5) FINALIZAÇÃO: encerre reforçando o aprendizado (ex: "Resumindo, é basicamente isso...").

TOM: amigável, didático, leve, confiante, como um professor que quer ajudar de verdade.
RESULTADO: o texto deve parecer um roteiro de áudio, pronto para ser narrado por uma voz de IA.`,
  };

  function handleToolClick(key: string) {
    const prompt = TOOL_PROMPTS[key];
    if (!prompt) return;
    addXp(5);
    rewardUser("tool");
    setPendingPrompt({ text: prompt, nonce: Date.now() });
  }

  if (!authReady) {
    return <div className="h-screen w-full bg-background" />;
  }

  if (!userEmail) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        <Toaster position="top-center" theme="dark" richColors />
      </>
    );
  }

  const initial = userEmail[0]?.toUpperCase() ?? "E";

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      {/* Topbar mobile */}
      <header className="flex items-center justify-between border-b border-border bg-background/80 px-3 py-2 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileLeft(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <Logo size="sm" showTagline={false} />
        <div className="flex items-center gap-1.5">
          <NeuroCoinsBadge />
          <button
            onClick={() => setMobileRight(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
            aria-label="Ferramentas"
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Topbar desktop com user pill */}
      <header className="hidden items-center justify-between gap-3 border-b border-border bg-background/60 px-5 py-2.5 backdrop-blur lg:flex">
        <div className="flex min-w-0 items-center">
          <Logo size="md" />
        </div>
        <div className="flex items-center gap-2">
          <NeuroCoinsBadge />
          <div className="flex items-center gap-2 rounded-full border border-border bg-paper/60 py-1 pl-1 pr-3 transition hover:border-primary/40">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-semibold text-primary-foreground">
              {initial}
            </div>
            <span className="max-w-[220px] truncate text-xs text-foreground">{userEmail}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full border border-border bg-paper/60 px-3 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            aria-label="Sair"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda — desktop */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-sidebar lg:block xl:w-72">
          <LeftSidebar onNewSource={openSources} userEmail={userEmail} onLogout={handleLogout} />
        </aside>

        {/* Área central */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <StudyChat
            docs={docs}
            onAttach={openSources}
            pendingPrompt={pendingPrompt}
            onPendingHandled={() => setPendingPrompt(null)}
          />
        </main>

        {/* Sidebar direita — desktop */}
        <aside className="hidden w-80 flex-shrink-0 border-l border-border bg-sidebar xl:block">
          <RightTools
            docs={docs}
            onUploadClick={openSources}
            onToolClick={(key) => handleToolClick(key)}
          />
        </aside>
      </div>

      {/* Drawer mobile esquerdo */}
      <Sheet open={mobileLeft} onOpenChange={setMobileLeft}>
        <SheetContent side="left" className="w-72 border-r border-border bg-sidebar p-0">
          <LeftSidebar
            onNewSource={() => {
              setMobileLeft(false);
              openSources();
            }}
            userEmail={userEmail}
            onLogout={() => {
              setMobileLeft(false);
              handleLogout();
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Drawer mobile direito */}
      <Sheet open={mobileRight} onOpenChange={setMobileRight}>
        <SheetContent side="right" className="w-80 border-l border-border bg-sidebar p-0">
          <RightTools
            docs={docs}
            onUploadClick={() => {
              setMobileRight(false);
              openSources();
            }}
            onToolClick={(key) => {
              setMobileRight(false);
              handleToolClick(key);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Modal de fontes */}
      <Dialog open={sourcesOpen} onOpenChange={setSourcesOpen}>
        <DialogContent className="max-w-lg border-border bg-popover">
          <DialogHeader>
            <DialogTitle>Suas Fontes</DialogTitle>
          </DialogHeader>
          <DocumentPanel docs={docs} setDocs={setDocs} />
        </DialogContent>
      </Dialog>

      <Toaster position="top-center" theme="dark" richColors />
    </div>
  );
}
