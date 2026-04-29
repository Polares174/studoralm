import { useState, type FormEvent } from "react";
import { GraduationCap, Mail, ArrowRight, AlertCircle } from "lucide-react";

const ALLOWED_DOMAIN = "@escola.pr.gov.br";

export function LoginScreen({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

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
    onLogin(value);
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background px-4">
      {/* Glow ambiente */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="rounded-3xl border border-border bg-card/80 p-8 shadow-[0_20px_80px_-20px_oklch(0.58_0.24_295/0.4)] backdrop-blur-xl sm:p-10">
          {/* Logo */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-[0_0_40px_-8px_oklch(0.58_0.24_295/0.7)]">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-accent ring-2 ring-card" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              ESTUDOS{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                LM
              </span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Plataforma de estudos com inteligência artificial
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* E-mail */}
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Digite seu e-mail escolar"
                autoFocus
                autoComplete="email"
                className="h-12 w-full rounded-xl border border-border bg-background/60 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* Erro */}
            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Botão */}
            <button
              type="submit"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-8px_oklch(0.58_0.24_295/0.6)] transition-all hover:shadow-[0_12px_32px_-8px_oklch(0.58_0.24_295/0.8)] hover:brightness-110 active:scale-[0.98]"
            >
              Entrar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          {/* Aviso */}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Acesso exclusivo para estudantes
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          IA · Estudos · Foco
        </p>
      </div>
    </div>
  );
}
