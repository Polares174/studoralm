import { useEffect, useRef, useState } from "react";
import { MessageBubble, TypingIndicator, type Msg } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import type { StudyDoc } from "./DocumentPanel";
import { BookOpen, FileText, Lightbulb, Globe, Plus, History, Sparkles } from "lucide-react";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const STORAGE_KEY = "estudoslm.messages.v1";

const SUGGESTIONS = [
  {
    icon: BookOpen,
    color: "oklch(0.6 0.22 295)",
    title: "Explique os principais conceitos de fotossíntese",
    prompt: "Explique para mim, com profundidade didática, os principais conceitos de fotossíntese.",
  },
  {
    icon: FileText,
    color: "oklch(0.65 0.2 145)",
    title: "Resuma os tópicos principais deste PDF",
    prompt: "Resuma em tópicos claros os principais pontos do material que enviei.",
  },
  {
    icon: Lightbulb,
    color: "oklch(0.78 0.16 85)",
    title: "Crie 5 questões sobre este assunto",
    prompt: "Crie 5 questões variadas (fácil → difícil) sobre o conteúdo, com gabarito comentado.",
  },
  {
    icon: Globe,
    color: "oklch(0.6 0.22 230)",
    title: "Quais são os pontos mais importantes?",
    prompt: "Quais são os pontos mais importantes que eu preciso saber sobre este conteúdo?",
  },
];

export function StudyChat({
  docs,
  onAttach,
  pendingPrompt,
  onPendingHandled,
}: {
  docs: StudyDoc[];
  onAttach: () => void;
  pendingPrompt?: { text: string; nonce: number } | null;
  onPendingHandled?: () => void;
}) {
  const [messages, setMessages] = useState<Msg[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-40)));
    } catch {}
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (pendingPrompt && pendingPrompt.text) {
      sendText(pendingPrompt.text);
      onPendingHandled?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingPrompt?.nonce]);

  function buildContext(): string {
    return docs
      .filter((d) => d.text)
      .map((d) => `### ${d.name} (${d.kind})\n${d.text}`)
      .join("\n\n");
  }

  async function sendText(text: string) {
    if (!text.trim() || loading) return;

    const attachments = docs.map((d) => ({ name: d.name, kind: d.kind }));
    const userMsg: Msg = {
      role: "user",
      content: text,
      attachments: attachments.length ? attachments : undefined,
    };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    let assistantSoFar = "";
    const upsert = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
          );
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
          documentContext: buildContext(),
        }),
      });

      if (!resp.ok) {
        const errBody = await resp.json().catch(() => ({}));
        if (resp.status === 429) toast.error(errBody.error || "Muitas perguntas. Aguarde.");
        else if (resp.status === 402) toast.error(errBody.error || "Créditos esgotados.");
        else toast.error(errBody.error || "Erro ao conversar com a IA.");
        setMessages((prev) => prev.slice(0, -1));
        setLoading(false);
        return;
      }

      if (!resp.body) throw new Error("Sem stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let done = false;

      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });

        let nl: number;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(data);
            const c = parsed.choices?.[0]?.delta?.content;
            if (c) upsert(c);
          } catch {
            buf = line + "\n" + buf;
            break;
          }
        }
      }
    } catch (e: any) {
      if (e?.name !== "AbortError") {
        console.error(e);
        toast.error("Erro de conexão");
      }
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function send() {
    sendText(input);
  }

  function stop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function newChat() {
    if (messages.length && !confirm("Iniciar uma nova conversa? A atual será apagada.")) return;
    setMessages([]);
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Chat</h2>
          <p className="text-xs text-muted-foreground">
            Pergunte sobre qualquer matéria ou conteúdo de estudo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={newChat}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-paper/60 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-secondary/60"
          >
            <Plus className="h-3.5 w-3.5" />
            Novo Chat
          </button>
          <button
            className="rounded-lg border border-border bg-paper/60 p-2 text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            aria-label="Histórico"
          >
            <History className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Mensagens */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {messages.length === 0 ? (
            <EmptyState onPick={(p) => sendText(p)} />
          ) : (
            <>
              {messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  msg={m}
                  streaming={loading && i === messages.length - 1 && m.role === "assistant"}
                  onAction={(key, source) => {
                    const prefixes: Record<string, string> = {
                      explicar:
                        "Explique melhor, com mais profundidade didática e exemplos, o seguinte conteúdo:\n\n",
                      exercicios:
                        "Crie 5 exercícios variados (fácil → difícil) com gabarito e resolução comentada sobre o seguinte conteúdo:\n\n",
                      resumir:
                        "Resuma de forma direta e objetiva, em tópicos, o seguinte conteúdo:\n\n",
                    };
                    sendText((prefixes[key] || "") + source);
                  }}
                />
              ))}
              {loading &&
                messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
            </>
          )}
        </div>
      </div>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={send}
        onStop={stop}
        loading={loading}
        onAttach={onAttach}
      />
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_-8px_oklch(0.58_0.24_295/0.7)]">
        <Sparkles className="h-7 w-7 text-primary-foreground" />
      </div>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Olá, Estudante! <span className="inline-block">👋</span>
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Como posso te ajudar nos seus estudos hoje?
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Faça uma pergunta sobre qualquer tópico de estudo.
      </p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.title}
            onClick={() => onPick(s.prompt)}
            className="group flex flex-col items-start gap-3 rounded-2xl border border-border bg-paper/60 p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-paper hover:shadow-[0_12px_32px_-12px_oklch(0.58_0.24_295/0.5)]"
          >
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                backgroundColor: `color-mix(in oklab, ${s.color} 18%, transparent)`,
              }}
            >
              <s.icon className="h-4 w-4" style={{ color: s.color }} />
            </div>
            <p className="text-sm font-medium leading-snug text-foreground">{s.title}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
