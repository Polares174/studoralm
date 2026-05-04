import { useState, type FormEvent } from "react";
import { Mail, ArrowRight, AlertCircle, Zap, Brain, BookOpen, Shield, Flame, Rocket, Target, TrendingUp, GraduationCap } from "lucide-react";
import logoUrl from "@/assets/studora-logo.png";

const ALLOWED_DOMAIN = "@escola.pr.gov.br";

type Goal = { id: string; icon: typeof Rocket; label: string };

const GOALS: Goal[] = [
  { id: "passar-ano", icon: GraduationCap, label: "Passar de ano" },
  { id: "enem", icon: Target, label: "ENEM" },
  { id: "melhorar-notas", icon: TrendingUp, label: "Melhorar notas" },
  { id: "evoluir-rapido", icon: Rocket, label: "Evoluir mais rápido" },
];

export function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"intro" | "goal">("intro");
  const [pendingEmail, setPendingEmail] = useState<string>("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim().toLowerCase();
    if (!value) {
      setError("Digite seu e-mail escolar");
      return;
    }
    if (!value.endsWith(ALLOWED_DOMAIN)) {
      setError(`Use um e-mail escolar válido (${ALLOWED_DOMAIN})`);
      return;
    }
    setError(null);
    setPendingEmail(value);
    setStep("goal");
  }

  function pickGoal(goalId: string) {
    try {
      localStorage.setItem("estudoslm:goal", goalId);
    } catch {
      // ignore
    }
    onLogin(pendingEmail);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden px-4 py-8">
      {/* Fundo com gradiente roxo → azul */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 700px at 20% 10%, rgba(123,47,255,0.35), transparent 60%), radial-gradient(900px 600px at 90% 90%, rgba(47,107,255,0.30), transparent 60%), linear-gradient(135deg, #0a0418 0%, #0d0a2e 50%, #06122e 100%)",
        }}
      />

      {/* Orbs animados */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 left-[15%] h-[420px] w-[420px] rounded-full opacity-50 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, #7B2FFF 0%, transparent 70%)", animationDuration: "6s" }}
        />
        <div
          className="absolute bottom-[-120px] right-[10%] h-[460px] w-[460px] rounded-full opacity-40 blur-3xl animate-pulse"
          style={{ background: "radial-gradient(circle, #2F6BFF 0%, transparent 70%)", animationDuration: "8s", animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl"
          style={{ background: "radial-gradient(circle, #a855f7 0%, transparent 70%)" }}
        />
      </div>

      {/* Grid sutil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative w-full max-w-md animate-fade-in">
        {/* Card glassmorphism */}
        <div
          className="relative rounded-3xl border border-white/10 p-7 sm:p-9 shadow-[0_30px_80px_-20px_rgba(123,47,255,0.55)]"
          style={{
            background: "linear-gradient(155deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Borda gradient */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl opacity-60"
            style={{
              padding: "1px",
              background: "linear-gradient(135deg, rgba(123,47,255,0.6), rgba(47,107,255,0.4), transparent 60%)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          {step === "intro" ? (
            <div className="animate-fade-in">
              {/* Logo com glow pulsante */}
              <div className="mb-6 flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div
                    className="absolute inset-0 -z-10 rounded-2xl blur-2xl animate-pulse"
                    style={{
                      background: "linear-gradient(135deg, #7B2FFF, #2F6BFF)",
                      animationDuration: "2.5s",
                    }}
                  />
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-white/20 shadow-[0_0_50px_-5px_rgba(123,47,255,0.9)]">
                    <img src={logoUrl} alt="Studora LM" className="h-full w-full object-cover" />
                  </div>
                </div>

                {/* Headline */}
                <h1 className="text-[26px] sm:text-[30px] font-bold leading-tight tracking-tight text-white">
                  Estude menos.{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #c4a8ff, #7CB1FF)" }}
                  >
                    Evolua mais com IA.
                  </span>
                </h1>
                <p className="mt-2.5 text-sm text-white/60">
                  Resumos, exercícios e explicações instantâneas — feitos para estudantes que querem resultado.
                </p>
              </div>

              {/* Benefícios */}
              <div className="mb-6 grid grid-cols-3 gap-2">
                {[
                  { icon: Zap, label: "Resposta\nem segundos" },
                  { icon: Brain, label: "Explicações\nclaras" },
                  { icon: BookOpen, label: "Ferramentas\ncompletas" },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] px-2 py-3 text-center transition hover:border-white/20 hover:bg-white/[0.06]"
                  >
                    <b.icon className="h-4 w-4 text-[#a78bfa] transition group-hover:scale-110" />
                    <span className="whitespace-pre-line text-[10px] font-medium leading-tight text-white/70">
                      {b.label}
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* E-mail */}
                <div className="relative group">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-xl opacity-0 blur transition group-focus-within:opacity-100"
                    style={{ background: "linear-gradient(135deg, #7B2FFF, #2F6BFF)" }}
                  />
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Digite seu e-mail para começar"
                      autoFocus
                      autoComplete="email"
                      className="h-12 w-full rounded-xl border border-white/15 bg-black/30 pl-11 pr-4 text-sm text-white placeholder:text-white/40 transition-all focus:border-white/30 focus:outline-none focus:bg-black/40"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200 animate-fade-in">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Botão */}
                <button
                  type="submit"
                  className="group relative flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl text-sm font-semibold text-white shadow-[0_10px_40px_-8px_rgba(123,47,255,0.85)] transition-all hover:shadow-[0_16px_50px_-8px_rgba(47,107,255,0.95)] hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "linear-gradient(135deg, #7B2FFF 0%, #2F6BFF 100%)" }}
                >
                  <span
                    className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ background: "linear-gradient(135deg, #8E4BFF 0%, #4D85FF 100%)" }}
                  />
                  <span className="relative">Começar Agora</span>
                  <Rocket className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </form>

              {/* Prova social + segurança */}
              <div className="mt-5 flex flex-col items-center gap-2 text-center">
                <div className="flex items-center gap-1.5 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-[11px] font-medium text-orange-200">
                  <Flame className="h-3 w-3" />
                  +1.000 estudantes já estão evoluindo
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-white/50">
                  <Shield className="h-3 w-3" />
                  Seus dados estão protegidos
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="mb-6 text-center">
                <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/5">
                  <Target className="h-5 w-5 text-[#a78bfa]" />
                </div>
                <h2 className="text-2xl font-bold text-white">Qual seu objetivo?</h2>
                <p className="mt-1.5 text-sm text-white/60">
                  Vamos personalizar sua jornada de estudos
                </p>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {GOALS.map((g, i) => (
                  <button
                    key={g.id}
                    onClick={() => pickGoal(g.id)}
                    className="group relative flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] p-4 text-left transition-all hover:border-[#7B2FFF]/50 hover:bg-white/[0.08] hover:scale-[1.02] hover:shadow-[0_10px_30px_-10px_rgba(123,47,255,0.6)]"
                    style={{ animation: `fade-in 0.4s ease-out ${i * 0.05}s both` }}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-all group-hover:scale-110"
                      style={{ background: "linear-gradient(135deg, rgba(123,47,255,0.25), rgba(47,107,255,0.25))" }}
                    >
                      <g.icon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">{g.label}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-white/30 transition group-hover:translate-x-0.5 group-hover:text-white" />
                  </button>
                ))}
              </div>

              <button
                onClick={() => setStep("intro")}
                className="mt-5 w-full text-center text-xs text-white/40 transition hover:text-white/70"
              >
                ← Voltar
              </button>
            </div>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.3em] text-white/40">
          IA · Estudos · Foco
        </p>
      </div>
    </div>
  );
}
