import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { GraduationCap, User } from "lucide-react";

export type Msg = {
  role: "user" | "assistant";
  content: string;
  attachments?: { name: string; kind: "pdf" | "image" | "text" }[];
};

export function MessageBubble({
  msg,
  streaming,
}: {
  msg: Msg;
  streaming?: boolean;
}) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-secondary text-secondary-foreground"
            : "bg-primary text-primary-foreground shadow-[0_2px_0_oklch(0.4_0.12_50)]"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <GraduationCap className="h-5 w-5" />}
      </div>

      <div className={`flex max-w-[85%] flex-col gap-1.5 ${isUser ? "items-end" : "items-start"}`}>
        <span className="px-1 text-[11px] uppercase tracking-wider text-muted-foreground">
          {isUser ? "Você" : "Professor LM"}
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
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm border border-border bg-paper shadow-sm"
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
      </div>
    </div>
  );
}
