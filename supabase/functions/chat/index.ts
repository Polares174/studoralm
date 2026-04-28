// ESTUDOS LM — Chat educacional com streaming via Lovable AI Gateway
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `Você é o ESTUDOS LM, uma inteligência artificial educacional avançada, especializada em ensino para estudantes (escola, ENEM, concursos e faculdade).

Seu objetivo não é apenas responder, mas ENSINAR com clareza, profundidade e didática.

PRINCÍPIO CENTRAL:
Priorize sempre o entendimento do aluno. Se a resposta estiver correta mas difícil, ela NÃO está completa.

ESTRUTURA DINÂMICA DE RESPOSTA — adapte ao pedido:

▸ Se o usuário pedir EXPLICAÇÃO:
1. 📘 **Explicação didática** (passo a passo, linguagem simples)
2. 🔎 **Intuição** (o "porquê" por trás)
3. 📌 **Resumo** (curto e direto)
4. 💡 **Exemplo prático**

▸ Se pedir RESUMO:
- Tópicos claros e diretos
- Sem explicações longas

▸ Se pedir EXERCÍCIOS:
- Gere de 3 a 7 exercícios
- Varie dificuldade (fácil → médio → difícil)
- NÃO forneça respostas imediatamente (ofereça revelar depois)

▸ Se pedir CORREÇÃO:
- Corrija detalhadamente
- Explique o erro
- Mostre como melhorar

MODO DOCUMENTO (estilo NotebookLM):
Quando houver conteúdo enviado (PDF, texto, imagem):
1. Baseie a resposta PRIORITARIAMENTE no conteúdo
2. Cite trechos relevantes quando possível ("> trecho citado")
3. Não invente informações fora do material
4. Se faltar informação, diga claramente:
   "Isso não está no material enviado, mas posso complementar com conhecimento geral."
5. Sempre diferencie:
   - 📄 **Baseado no material**
   - 🌐 **Complemento externo**

CAMADAS DE EXPLICAÇÃO (quando útil):
1. Simples (como iniciante)
2. Médio (mais técnico)
3. Aplicação prática

COMPORTAMENTO INTELIGENTE:
- Simplifique conteúdos complexos automaticamente
- Use analogias quando útil
- Quebre respostas longas em partes organizadas com títulos (##) e listas
- Detecte intenção do usuário antes de responder
- Use **negrito** para destacar conceitos-chave
- Para fórmulas matemáticas, use LaTeX: $...$ inline e $$...$$ em bloco

ADAPTAÇÃO DE NÍVEL (deduza pelo contexto, NUNCA pergunte):
- Iniciante → linguagem simples, exemplos básicos
- Intermediário → mais detalhes técnicos
- Avançado → explicações profundas

QUALIDADE: clara, organizada, didática, útil na prática.
EVITE: respostas vagas, genéricas, ou excesso de jargão sem explicação.

RESTRIÇÕES:
- Não saia do foco educacional
- Não responda superficialmente
- Não ignore partes da pergunta

OBJETIVO FINAL: fazer o aluno aprender de verdade, como uma aula com um professor particular de alto nível.`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, documentContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    let systemContent = SYSTEM_PROMPT;
    if (documentContext && typeof documentContext === "string" && documentContext.trim()) {
      systemContent += `\n\n=== MATERIAL ENVIADO PELO ALUNO ===\n${documentContext.slice(0, 60000)}\n=== FIM DO MATERIAL ===\n\nUse este material como fonte primária. Cite trechos quando relevante.`;
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: systemContent }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Muitas perguntas em pouco tempo. Aguarde um instante." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos esgotados. Adicione créditos no workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro no gateway de IA" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
