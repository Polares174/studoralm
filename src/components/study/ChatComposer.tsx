import { useRef, useEffect, useState } from "react";
import { Send, Square, Paperclip, GraduationCap, ChevronDown, Check } from "lucide-react";

const MODES = [
  {
    key: "professor",
    label: "Modo Professor",
    desc: "Explica como um professor particular",
    prefix: "",
  },
  {
    key: "explicar",
    label: "Modo Explicar",
    desc: "Explicação aprofundada e didática",
    prefix: "Explique para mim, com profundidade didática: ",
  },
  {
    key: "resumir",
    label: "Modo Resumir",
    desc: "Resumo direto em tópicos",
    prefix: "Faça um resumo direto em tópicos sobre: ",
  },
  {
    key: "exercicios",
    label: "Modo Exercícios",
    desc: "Gera questões com gabarito",
    prefix: "Crie exercícios variados (fácil → difícil) sobre: ",
  },
  {
    key: "corrigir",
    label: "Modo Corretor",
    desc: "Corrige e explica os erros",
    prefix: "Corrija detalhadamente o seguinte e explique os erros:\n\n",
  },
  {
    key: "audio",
    label: "Modo Áudio",
    desc: "Explicação falada (TTS)",
    prefix:
      "MODO ÁUDIO ativado. Responda como um roteiro falado, natural e didático, em parágrafos curtos, sem markdown, sem listas longas, sem emojis, sem LaTeX. Comece com uma saudação amigável ao aluno, explique passo a passo com linguagem simples, dê a intuição, um exemplo fácil e finalize reforçando o aprendizado. Tema: ",
  },
] as const;

export function ChatComposer({
  value,
  onChange,
  onSend,
  onStop,
  loading,
  disabled,
  onAttach,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  onStop: () => void;
  loading: boolean;
  disabled?: boolean;
  onAttach?: () => void;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [mode, setMode] = useState<(typeof MODES)[number]>(MODES[0]);
  const [openMode, setOpenMode] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 220) + "px";
  }, [value]);

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  }

  function submit() {
    if (!value.trim() || loading) return;
    if (mode.prefix && !value.startsWith(mode.prefix)) {
      onChange(mode.prefix + value);
      // pequeno delay para permitir o setState antes de enviar
      requestAnimationFrame(() => onSend());
    } else {
      onSend();
    }
  }

  return (
    <div className="border-t border-border bg-background/80 px-4 py-4 backdrop-blur sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border border-border bg-paper/80 p-3 shadow-[0_8px_32px_-12px_oklch(0.58_0.24_295/0.25)] focus-within:border-primary/50 focus-within:shadow-[0_8px_32px_-8px_oklch(0.58_0.24_295/0.45)]">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKey}
            placeholder={disabled ? "Carregando..." : "Digite sua pergunta aqui..."}
            rows={1}
            disabled={disabled}
            className="w-full resize-none border-0 bg-transparent px-1 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setOpenMode((s) => !s)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 text-xs text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-primary" />
                  {mode.label}
                  <ChevronDown className="h-3 w-3" />
                </button>
                {openMode && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenMode(false)}
                    />
                    <div className="absolute bottom-full left-0 z-20 mb-2 w-64 rounded-xl border border-border bg-popover p-1 shadow-[0_12px_40px_-8px_oklch(0_0_0/0.6)]">
                      {MODES.map((m) => (
                        <button
                          key={m.key}
                          onClick={() => {
                            setMode(m);
                            setOpenMode(false);
                          }}
                          className="flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition hover:bg-secondary/80"
                        >
                          <div className="mt-0.5 h-3.5 w-3.5 flex-shrink-0">
                            {mode.key === m.key && (
                              <Check className="h-3.5 w-3.5 text-primary" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-medium text-foreground">{m.label}</div>
                            <div className="text-[10px] text-muted-foreground">{m.desc}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <button
                onClick={onStop}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-destructive text-destructive-foreground transition hover:opacity-90"
                aria-label="Parar"
              >
                <Square className="h-3.5 w-3.5" fill="currentColor" />
              </button>
            ) : (
              <button
                onClick={submit}
                disabled={!value.trim() || disabled}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-[oklch(0.55_0.24_290)] text-primary-foreground shadow-[0_4px_16px_-4px_oklch(0.58_0.24_295/0.7)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
                aria-label="Enviar"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Pressione Enter para enviar · Shift + Enter para nova linha
        </p>
      </div>
    </div>
  );
}
