import { useEffect, useState, useCallback, useRef } from "react";

// Singleton para garantir que apenas um áudio toque por vez
let activeId: string | null = null;
const listeners = new Set<() => void>();

function setActive(id: string | null) {
  activeId = id;
  listeners.forEach((l) => l());
}

// Remove markdown/LaTeX/emojis problemáticos para TTS
function cleanText(raw: string): string {
  let t = raw;
  t = t.replace(/```[\s\S]*?```/g, " "); // blocos de código
  t = t.replace(/`([^`]+)`/g, "$1");
  t = t.replace(/\$\$[\s\S]*?\$\$/g, " ");
  t = t.replace(/\$[^$]+\$/g, " ");
  t = t.replace(/!\[[^\]]*\]\([^)]+\)/g, " ");
  t = t.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
  t = t.replace(/[#>*_~|]/g, " ");
  t = t.replace(/\s+/g, " ").trim();
  // Limite de segurança (evita travamento em textos enormes)
  if (t.length > 4500) t = t.slice(0, 4500) + "…";
  return t;
}

function pickPtVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined") return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const pt = voices.filter((v) => /pt(-|_)?br/i.test(v.lang) || /pt/i.test(v.lang));
  // Prefere vozes "natural" / "google" / "microsoft"
  const preferred = pt.find((v) => /google|natural|neural|microsoft/i.test(v.name));
  return preferred || pt[0] || null;
}

export function useSpeech(text: string) {
  const idRef = useRef<string>(Math.random().toString(36).slice(2));
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    const update = () => setSpeaking(activeId === idRef.current);
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  // Garante que vozes sejam carregadas (alguns browsers carregam de forma assíncrona)
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (!window.speechSynthesis.getVoices().length) {
      const handler = () => {
        // noop — só dispara a recarga
      };
      window.speechSynthesis.addEventListener("voiceschanged", handler);
      return () => window.speechSynthesis.removeEventListener("voiceschanged", handler);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    window.speechSynthesis.cancel();
    if (activeId === idRef.current) setActive(null);
  }, []);

  const toggle = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      console.warn("SpeechSynthesis não suportado neste navegador.");
      return;
    }
    const synth = window.speechSynthesis;

    // Se este já está falando → parar
    if (activeId === idRef.current) {
      synth.cancel();
      setActive(null);
      return;
    }

    // Cancela qualquer outro áudio em curso
    synth.cancel();

    const clean = cleanText(text);
    if (!clean) return;

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = "pt-BR";
    utter.rate = 1;
    utter.pitch = 1;
    utter.volume = 1;
    const voice = pickPtVoice();
    if (voice) utter.voice = voice;

    utter.onend = () => {
      if (activeId === idRef.current) setActive(null);
    };
    utter.onerror = () => {
      if (activeId === idRef.current) setActive(null);
    };

    utterRef.current = utter;
    setActive(idRef.current);
    synth.speak(utter);
  }, [text]);

  // Cleanup ao desmontar: para se este era o ativo
  useEffect(() => {
    return () => {
      if (activeId === idRef.current && typeof window !== "undefined") {
        window.speechSynthesis.cancel();
        setActive(null);
      }
    };
  }, []);

  const supported =
    typeof window !== "undefined" && "speechSynthesis" in window;

  return { speaking, toggle, stop, supported };
}
