import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Trash2, Upload, FileType2 } from "lucide-react";
import { extractPdfText, fileToBase64 } from "@/lib/pdf";
import { toast } from "sonner";

export type StudyDoc = {
  id: string;
  name: string;
  kind: "pdf" | "image" | "text";
  text?: string;          // texto extraído (PDF / texto colado)
  imageDataUrl?: string;  // base64 para imagens (futuro: visão multimodal)
  size: number;
};

export function DocumentPanel({
  docs,
  setDocs,
}: {
  docs: StudyDoc[];
  setDocs: (d: StudyDoc[]) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [pasted, setPasted] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    setLoading(true);
    try {
      const next: StudyDoc[] = [];
      for (const f of Array.from(files)) {
        const id = crypto.randomUUID();
        if (f.type === "application/pdf") {
          const text = await extractPdfText(f);
          next.push({ id, name: f.name, kind: "pdf", text, size: f.size });
        } else if (f.type.startsWith("image/")) {
          const dataUrl = await fileToBase64(f);
          next.push({
            id,
            name: f.name,
            kind: "image",
            imageDataUrl: dataUrl,
            text: `[Imagem anexada: ${f.name} — descreva ou pergunte sobre ela]`,
            size: f.size,
          });
        } else if (f.type.startsWith("text/")) {
          const text = await f.text();
          next.push({ id, name: f.name, kind: "text", text, size: f.size });
        } else {
          toast.error(`Formato não suportado: ${f.name}`);
        }
      }
      setDocs([...docs, ...next]);
      if (next.length) toast.success(`${next.length} arquivo(s) adicionado(s)`);
    } catch (e: any) {
      toast.error("Erro ao ler arquivo: " + (e?.message || "desconhecido"));
    } finally {
      setLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function addPasted() {
    if (!pasted.trim()) return;
    setDocs([
      ...docs,
      {
        id: crypto.randomUUID(),
        name: `Trecho ${docs.filter((d) => d.kind === "text").length + 1}`,
        kind: "text",
        text: pasted,
        size: pasted.length,
      },
    ]);
    setPasted("");
    toast.success("Trecho adicionado");
  }

  function remove(id: string) {
    setDocs(docs.filter((d) => d.id !== id));
  }

  const Icon = (k: StudyDoc["kind"]) =>
    k === "pdf" ? FileText : k === "image" ? ImageIcon : FileType2;

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h2 className="font-display text-lg font-semibold text-ink">Material de estudo</h2>
        <p className="text-xs text-muted-foreground">
          PDFs, imagens ou trechos. A IA usará como fonte primária.
        </p>
      </div>

      <button
        onClick={() => fileRef.current?.click()}
        disabled={loading}
        className="group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-rule bg-paper/50 px-4 py-6 text-sm text-muted-foreground transition hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50"
      >
        <Upload className="h-5 w-5 transition group-hover:scale-110" />
        <span className="font-medium">{loading ? "Processando..." : "Enviar PDF / imagem / texto"}</span>
        <span className="text-[11px]">até 50 páginas por PDF</span>
      </button>
      <input
        ref={fileRef}
        type="file"
        multiple
        accept=".pdf,.txt,.md,image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <div className="flex flex-col gap-2">
        <textarea
          value={pasted}
          onChange={(e) => setPasted(e.target.value)}
          placeholder="...ou cole um texto aqui (resumo, anotação, enunciado)"
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-paper px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        <button
          onClick={addPasted}
          disabled={!pasted.trim()}
          className="self-end rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-40"
        >
          + adicionar trecho
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {docs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-rule p-4 text-center text-xs text-muted-foreground">
            Nenhum material ainda.
            <br />
            Ou converse livremente sem material.
          </div>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {docs.map((d) => {
              const I = Icon(d.kind);
              return (
                <li
                  key={d.id}
                  className="group flex items-center gap-2 rounded-lg border border-border bg-paper px-2.5 py-2 text-sm"
                >
                  <I className="h-4 w-4 flex-shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-foreground">{d.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {d.kind} · {(d.size / 1024).toFixed(1)} kb
                    </div>
                  </div>
                  <button
                    onClick={() => remove(d.id)}
                    className="rounded p-1 text-muted-foreground opacity-0 transition hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
