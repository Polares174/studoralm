import { GraduationCap } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_0_20px_-4px_oklch(0.58_0.24_295/0.6)]">
        <GraduationCap className="h-5 w-5 text-primary-foreground" />
        <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent ring-2 ring-sidebar" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight text-foreground">
          ESTUDOS <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">LM</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          IA para estudar
        </span>
      </div>
    </div>
  );
}
