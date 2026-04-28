import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { LeftSidebar } from "@/components/study/LeftSidebar";
import { RightTools } from "@/components/study/RightTools";
import { DocumentPanel, type StudyDoc } from "@/components/study/DocumentPanel";
import { StudyChat } from "@/components/study/StudyChat";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Menu, PanelRight } from "lucide-react";
import { Logo } from "@/components/study/Logo";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Estudos LM — IA para estudantes (ENEM, concursos, faculdade)" },
      {
        name: "description",
        content:
          "Plataforma de estudos com IA: explicações, resumos, mapas mentais, flashcards e exercícios a partir das suas fontes.",
      },
      { property: "og:title", content: "Estudos LM" },
      {
        property: "og:description",
        content: "Aprenda de verdade com um professor particular de IA.",
      },
    ],
  }),
});

function Index() {
  const [docs, setDocs] = useState<StudyDoc[]>([]);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [mobileLeft, setMobileLeft] = useState(false);
  const [mobileRight, setMobileRight] = useState(false);

  function openSources() {
    setSourcesOpen(true);
  }

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
        <Logo />
        <button
          onClick={() => setMobileRight(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
          aria-label="Ferramentas"
        >
          <PanelRight className="h-4 w-4" />
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar esquerda — desktop */}
        <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-sidebar lg:block xl:w-72">
          <LeftSidebar onNewSource={openSources} />
        </aside>

        {/* Área central */}
        <main className="flex flex-1 flex-col overflow-hidden">
          <StudyChat docs={docs} onAttach={openSources} />
        </main>

        {/* Sidebar direita — desktop */}
        <aside className="hidden w-80 flex-shrink-0 border-l border-border bg-sidebar xl:block">
          <RightTools
            docs={docs}
            onUploadClick={openSources}
            onToolClick={(_k, label) => {
              // futuro: rotear para ferramenta específica
              console.log("ferramenta:", label);
            }}
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
            onToolClick={() => setMobileRight(false)}
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
