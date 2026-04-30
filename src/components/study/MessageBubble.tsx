import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { GraduationCap, User, Sparkles, BookOpen, FileText, Copy, Check } from "lucide-react";
import { useState } from "react";

export type Msg = {
  role: "user" | "assistant";
  content: string;
  attachments?: { name: string; kind: "pdf" | "image" | "text" }[];
};

export function MessageBubble({
  msg,
  streaming,
  onAction,
}: {
  msg: Msg;
  streaming?: boolean;
  onAction?: (key: "explicar" | "exercicios" | "resumir", source: string) => void;
}) {
  const isUser = msg.role === "user";
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(msg.content || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`msg-in flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_16px_-4px_oklch(0.58_0.24_295/0.6)]"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <GraduationCap className="h-5 w-5" />}
      </div>

      <div className={`flex max-w-[85%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <span className="px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          {isUser ? "Você" : "Studora LM"}
        </span>

        {msg.attachments && msg.attachments.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {msg.attachments.map((a, i) => (
              <span
                key={i}
                className="rounded-md border border-border bg-paper px-2 py-1 text-xs text-muted-foreground"
              >
                {a.kind === "pdf" ? "📄" : a.kind === "image" ? "🖼️" : "📝"} {a.name}
              </span>
            ))}
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 transition ${
            isUser
              ? "rounded-tr-sm bg-gradient-to-br from-primary to-[oklch(0.55_0.24_290)] text-primary-foreground shadow-[0_8px_24px_-12px_oklch(0.58_0.24_295/0.6)]"
              : "rounded-tl-sm border border-border bg-paper/90 shadow-[0_4px_16px_-8px_oklch(0_0_0/0.4)] backdrop-blur"
          }`}
        >
          {isUser ? (
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
          ) : (
            <div className="prose-study text-[15px]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {msg.content || ""}
              </ReactMarkdown>
              {streaming && <span className="ink-cursor" aria-hidden />}
            </div>
          )}
        </div>

        {/* Ações abaixo da resposta da IA */}
        {!isUser && !streaming && msg.content && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <ActionPill
              icon={Sparkles}
              label="Explicar melhor"
              onClick={() => onAction?.("explicar", msg.content)}
            />
            <ActionPill
              icon={BookOpen}
              label="Gerar exercícios"
              onClick={() => onAction?.("exercicios", msg.content)}
            />
            <ActionPill
              icon={FileText}
              label="Resumir"
              onClick={() => onAction?.("resumir", msg.content)}
            />
            <button
              onClick={copy}
              className="hover-lift inline-flex items-center gap-1 rounded-full border border-border bg-paper/60 px-2.5 py-1 text-[10px] text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              aria-label="Copiar"
            >
              {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copiado" : "Copiar"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionPill({
  icon: Icon,
  label,
  onClick,
}: {
  icon: typeof Sparkles;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="hover-lift inline-flex items-center gap-1.5 rounded-full border border-border bg-paper/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition hover:border-primary/50 hover:bg-primary/10 hover:text-foreground hover:shadow-[0_4px_12px_-4px_oklch(0.58_0.24_295/0.5)]"
    >
      <Icon className="h-3 w-3 text-primary" />
      {label}
    </button>
  );
}

/** Indicador "IA pensando" — pontos pulando */
export function TypingIndicator() {
  return (
    <div className="msg-in flex gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_16px_-4px_oklch(0.58_0.24_295/0.6)]">
        <GraduationCap className="h-5 w-5" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          Studora LM
        </span>
        <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-border bg-paper/90 px-4 py-3.5 shadow-[0_4px_16px_-8px_oklch(0_0_0/0.4)]">
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="typing-dot" />
          <span className="ml-1 text-[11px] text-muted-foreground">pensando…</span>
        </div>
      </div>
    </div>
  );
}
