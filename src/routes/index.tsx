import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { Logo } from "@/components/study/Logo";
import { DocumentPanel, type StudyDoc } from "@/components/study/DocumentPanel";
import { StudyChat } from "@/components/study/StudyChat";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Estudos LM — seu professor particular de IA" },
      {
        name: "description",
        content:
          "Plataforma de estudos com IA: explicações didáticas, resumos, exercícios e correções a partir dos seus materiais (PDF, imagens, texto). ENEM, concursos, faculdade.",
      },
      { property: "og:title", content: "Estudos LM" },
      {
        property: "og:description",
        content: "Aprenda de verdade com um professor particular de IA, baseado nos seus materiais.",
      },
    ],
  }),
});

function Index() {
  const [docs, setDocs] = useState<StudyDoc[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border bg-paper/70 px-4 py-2.5 backdrop-blur sm:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((s) => !s)}
            className="rounded-md p-1.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Alternar painel"
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
          </button>
          <Logo />
        </div>
        <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
          IA didática · ENEM · Concursos · Faculdade
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        <aside
          className={`${
            sidebarOpen ? "w-80" : "w-0"
          } flex-shrink-0 overflow-hidden border-r border-border bg-sidebar transition-all duration-300`}
        >
          <div className="h-full w-80 p-4">
            <DocumentPanel docs={docs} setDocs={setDocs} />
          </div>
        </aside>

        <section className="flex flex-1 flex-col overflow-hidden">
          <StudyChat docs={docs} />
        </section>
      </main>

      <Toaster position="top-center" richColors />
    </div>
  );
}
