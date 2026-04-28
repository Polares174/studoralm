import { useEffect, useRef, useState } from "react";
import { MessageBubble, type Msg } from "./MessageBubble";
import { ChatComposer } from "./ChatComposer";
import type { StudyDoc } from "./DocumentPanel";
import { GraduationCap, Sparkles } from "lucide-react";
import { toast } from "sonner";

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const STORAGE_KEY = "estudoslm.messages.v1";

export function StudyChat({ docs }: { docs: StudyDoc[] }) {
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

  function buildContext(): string {
    return docs
      .filter((d) => d.text)
      .map((d) => `### ${d.name} (${d.kind})\n${d.text}`)
      .join("\n\n");
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

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
        setMessages((prev) => prev.slice(0, -1)); // remove a user msg
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

  function stop() {
    abortRef.current?.abort();
    setLoading(false);
  }

  function clearChat() {
    if (!messages.length) return;
    if (confirm("Limpar toda a conversa?")) setMessages([]);
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border bg-paper/60 px-4 py-2.5 backdrop-blur sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>
            {docs.length > 0 ? (
              <>
                Conversando com <strong className="text-ink">{docs.length}</strong> material
                {docs.length > 1 ? "is" : ""}
              </>
            ) : (
              "Conversa livre"
            )}
          </span>
        </div>
        <button
          onClick={clearChat}
          className="text-xs text-muted-foreground transition hover:text-destructive"
        >
          limpar conversa
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {messages.length === 0 && <EmptyState />}
          {messages.map((m, i) => (
            <MessageBubble
              key={i}
              msg={m}
              streaming={loading && i === messages.length - 1 && m.role === "assistant"}
            />
          ))}
        </div>
      </div>

      <ChatComposer
        value={input}
        onChange={setInput}
        onSend={send}
        onStop={stop}
        loading={loading}
      />
    </div>
  );
}

function EmptyState() {
  const examples = [
    "Explique fotossíntese para o ENEM",
    "Resuma a Revolução Francesa em tópicos",
    "Crie 5 exercícios de função quadrática",
    "Corrija minha redação dissertativa",
  ];
  return (
    <div className="mx-auto mt-8 max-w-xl text-center">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_3px_0_oklch(0.4_0.12_50)]">
        <GraduationCap className="h-7 w-7" />
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
        Bem-vindo ao seu professor particular.
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Envie um material ou comece uma pergunta. Eu explico, resumo, gero exercícios e corrijo —
        sempre com profundidade didática.
      </p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {examples.map((ex) => (
          <div
            key={ex}
            className="rounded-lg border border-dashed border-rule bg-paper/60 px-3 py-2.5 text-left text-xs text-muted-foreground"
          >
            <span className="text-primary">›</span> {ex}
          </div>
        ))}
      </div>
    </div>
  );
}
