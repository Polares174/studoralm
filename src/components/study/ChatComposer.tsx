import { useRef, useEffect } from "react";
import { ArrowUp, Square } from "lucide-react";

const MODES = [
  { key: "explicar", label: "📘 Explicar", prefix: "Explique para mim, com profundidade didática: " },
  { key: "resumir", label: "📌 Resumir", prefix: "Faça um resumo direto em tópicos sobre: " },
  { key: "exercicios", label: "✏️ Exercícios", prefix: "Crie exercícios variados (fácil → difícil) sobre: " },
  { key: "corrigir", label: "🔍 Corrigir", prefix: "Corrija detalhadamente o seguinte e explique os erros:\n\n" },
] as const;

export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  loading,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  loading: boolean;
  disabled?: boolean;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !loading) onSend();
    }
  }

  return (
    <div className="border-t border-border bg-paper/80 px-4 py-3 backdrop-blur-sm sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {MODES.map((m) => (
            <button
              key={m.key}
              onClick={() => onChange(m.prefix + value.replace(/^.*?: /, ""))}
              disabled={loading}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-40"
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="flex items-end gap-2 rounded-2xl border border-border bg-paper p-2 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder={
              disabled
                ? "Carregando..."
                : "Faça uma pergunta, peça uma explicação, exercícios..."
            }
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          {loading ? (
            <button
              onClick={onStop}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition hover:opacity-90"
              aria-label="Parar"
            >
              <Square className="h-4 w-4" fill="currentColor" />
            </button>
          ) : (
            <button
              onClick={onSend}
              disabled={!value.trim() || disabled}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_2px_0_oklch(0.4_0.12_50)] transition hover:brightness-110 disabled:opacity-40 disabled:shadow-none"
              aria-label="Enviar"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          Enter envia · Shift+Enter quebra linha
        </p>
      </div>
    </div>
  );
}
