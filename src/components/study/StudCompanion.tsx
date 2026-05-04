import { useState } from "react";
import { useStudCompanion, type Mood } from "@/hooks/useStudCompanion";
import { useSpeech } from "@/hooks/useSpeech";
import { Volume2, Pause, X, MessageCircle } from "lucide-react";

const GOALS = [
  { id: "passar", emoji: "📘", label: "Passar de ano" },
  { id: "enem", emoji: "🎯", label: "ENEM" },
  { id: "notas", emoji: "🧠", label: "Melhorar notas" },
  { id: "evoluir", emoji: "🚀", label: "Evoluir mais rápido" },
];

export function StudCompanion() {
  const { message, open, setOpen, dismiss, pickGoal } = useStudCompanion();
  const [showGoals, setShowGoals] = useState(false);
  const { speaking, toggle, supported } = useSpeech(message?.text || "");

  function handleCta(action: string) {
    if (action === "goal") {
      setShowGoals(true);
      dismiss();
    }
  }

  function handlePickGoal(id: string) {
    pickGoal(id);
    setShowGoals(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#7B2FFF] to-[#2F6BFF] text-white shadow-[0_8px_28px_-6px_rgba(123,47,255,0.7)] transition hover:scale-105"
        aria-label="Abrir assistente Stud"
      >
        <StudFace mood="happy" size={32} />
      </button>
    );
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2 sm:max-w-sm">
      {/* Bubble */}
      {(message || showGoals) && (
        <div className="pointer-events-auto stud-bubble-in relative w-full rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a1230]/95 to-[#0d1530]/95 p-3 pr-8 text-sm text-white shadow-[0_12px_40px_-8px_rgba(123,47,255,0.5)] backdrop-blur-xl">
          <button
            onClick={() => {
              dismiss();
              setShowGoals(false);
            }}
            className="absolute right-2 top-2 rounded-full p-1 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Fechar"
          >
            <X className="h-3 w-3" />
          </button>

          {showGoals ? (
            <div className="space-y-2">
              <p className="pr-4 font-medium">Qual seu objetivo?</p>
              <div className="grid grid-cols-1 gap-1.5">
                {GOALS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handlePickGoal(g.id)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white transition hover:border-[#7B2FFF]/50 hover:bg-[#7B2FFF]/15"
                  >
                    <span>{g.emoji}</span>
                    <span>{g.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : message ? (
            <>
              <p className="pr-2 leading-relaxed">{message.text}</p>
              <div className="mt-2 flex items-center gap-1.5">
                {message.cta && (
                  <button
                    onClick={() => handleCta(message.cta!.action)}
                    className="rounded-full bg-gradient-to-r from-[#7B2FFF] to-[#2F6BFF] px-3 py-1 text-xs font-semibold text-white shadow-[0_4px_12px_-2px_rgba(123,47,255,0.6)] transition hover:brightness-110"
                  >
                    👉 {message.cta.label}
                  </button>
                )}
                {supported && (
                  <button
                    onClick={toggle}
                    className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-1 text-[10px] text-white/70 transition hover:bg-white/10 hover:text-white"
                    aria-label={speaking ? "Parar áudio" : "Ouvir"}
                  >
                    {speaking ? <Pause className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                  </button>
                )}
              </div>
            </>
          ) : null}

          {/* Tail */}
          <div className="absolute -bottom-1.5 right-8 h-3 w-3 rotate-45 border-b border-r border-white/10 bg-[#0d1530]/95" />
        </div>
      )}

      {/* Character */}
      <button
        onClick={() => {
          if (message || showGoals) {
            dismiss();
            setShowGoals(false);
          } else {
            setOpen(false);
          }
        }}
        className="pointer-events-auto group relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#7B2FFF] to-[#2F6BFF] shadow-[0_10px_32px_-6px_rgba(123,47,255,0.7)] transition stud-idle hover:scale-105"
        aria-label="Stud"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7B2FFF]/40 to-[#2F6BFF]/40 blur-xl" aria-hidden />
        <StudFace mood={message?.mood || "happy"} size={36} bouncing={!!message} />
        {!message && !showGoals && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#FFD700] text-[8px] text-black shadow">
            <MessageCircle className="h-2.5 w-2.5" />
          </span>
        )}
      </button>
    </div>
  );
}

function StudFace({
  mood,
  size = 32,
  bouncing,
}: {
  mood: Mood;
  size?: number;
  bouncing?: boolean;
}) {
  // SVG robot face — eyes change with mood
  const eyeScaleY = mood === "sleepy" ? 0.2 : mood === "thinking" ? 0.7 : 1;
  const isWink = mood === "wink";
  const smile = mood === "excited" ? "M 9 15 Q 14 20 19 15" : "M 10 16 Q 14 19 18 16";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      className={`relative drop-shadow-[0_2px_6px_rgba(255,255,255,0.4)] ${bouncing ? "stud-bounce" : ""}`}
    >
      {/* Head */}
      <rect x="3" y="4" width="22" height="20" rx="6" fill="#fff" opacity="0.95" />
      {/* Antenna */}
      <line x1="14" y1="4" x2="14" y2="1.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="14" cy="1.2" r="1.2" fill="#FFD700" className="stud-blink-glow" />
      {/* Left eye */}
      <ellipse
        cx="10"
        cy="13"
        rx="1.6"
        ry={1.6 * eyeScaleY}
        fill="#2F6BFF"
        className="stud-blink"
      />
      {/* Right eye */}
      {isWink ? (
        <path d="M 16.5 13 Q 18 13 19.5 13" stroke="#2F6BFF" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      ) : (
        <ellipse
          cx="18"
          cy="13"
          rx="1.6"
          ry={1.6 * eyeScaleY}
          fill="#2F6BFF"
          className="stud-blink"
        />
      )}
      {/* Mouth */}
      <path d={smile} stroke="#7B2FFF" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}
