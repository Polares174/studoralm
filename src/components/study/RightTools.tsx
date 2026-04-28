import {
  Inbox,
  FileText,
  Network,
  Layers,
  PenLine,
  ClipboardList,
  Quote,
  Quote as QuoteIcon,
  Upload,
} from "lucide-react";
import type { StudyDoc } from "./DocumentPanel";

const TOOLS = [
  { key: "resumo", label: "Resumo", desc: "Resuma o conteúdo", icon: FileText, color: "oklch(0.65 0.2 145)" },
  { key: "mapa", label: "Mapa Mental", desc: "Crie mapas visuais", icon: Network, color: "oklch(0.6 0.22 295)" },
  { key: "flashcards", label: "Flashcards", desc: "Gere flashcards", icon: Layers, color: "oklch(0.6 0.22 230)" },
  { key: "exercicios", label: "Exercícios", desc: "Crie exercícios", icon: PenLine, color: "oklch(0.7 0.18 75)" },
  { key: "relatorio", label: "Relatório", desc: "Relatório completo", icon: ClipboardList, color: "oklch(0.65 0.2 145)" },
  { key: "citacoes", label: "Citações", desc: "Extrair citações", icon: Quote, color: "oklch(0.6 0.22 295)" },
] as const;

export function RightTools({
  docs,
  onUploadClick,
  onToolClick,
}: {
  docs: StudyDoc[];
  onUploadClick: () => void;
  onToolClick: (key: string, label: string) => void;
}) {
  return (
    <div className="flex h-full flex-col gap-5 overflow-y-auto p-4">
      {/* Suas Fontes */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Suas Fontes</h3>
          <span className="text-[11px] text-muted-foreground">{docs.length} fontes</span>
        </div>
        <div className="rounded-xl border border-border bg-paper/60 p-4 text-center">
          <div className="mx-auto mb-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/80">
            <Inbox className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Adicione suas fontes</p>
          <p className="mb-3 mt-0.5 text-[11px] text-muted-foreground">
            PDF, TXT, DOCX, Links e mais
          </p>
          <button
            onClick={onUploadClick}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.24_290)] px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-[0_2px_12px_-2px_oklch(0.58_0.24_295/0.6)] transition hover:brightness-110"
          >
            <Upload className="h-3.5 w-3.5" />
            Selecionar arquivos
          </button>
        </div>
      </section>

      {/* Ferramentas */}
      <section>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Ferramentas de Estudo</h3>
        <div className="grid grid-cols-2 gap-2">
          {TOOLS.map(({ key, label, desc, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => onToolClick(key, label)}
              className="group flex flex-col items-start gap-1.5 rounded-xl border border-border bg-paper/60 p-2.5 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-paper hover:shadow-[0_8px_24px_-12px_oklch(0.58_0.24_295/0.5)]"
            >
              <Icon className="h-4 w-4 transition" style={{ color }} />
              <div className="text-xs font-semibold text-foreground">{label}</div>
              <div className="text-[10px] leading-tight text-muted-foreground">{desc}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Dica de Estudo */}
      <section>
        <div className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-accent/5 p-3.5">
          <div className="mb-1.5 flex items-center gap-1.5">
            <QuoteIcon className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Dica de Estudo</span>
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            "A consistência nos estudos é mais importante que a intensidade. Estude um pouco todos os dias." 💪
          </p>
        </div>
      </section>
    </div>
  );
}
