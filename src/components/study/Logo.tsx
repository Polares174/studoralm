import logoUrl from "@/assets/studora-logo.png";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-[0_0_20px_-4px_oklch(0.58_0.24_295/0.6)]">
        <img
          src={logoUrl}
          alt="Studora LM"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-base font-bold tracking-tight text-foreground">
          Studora{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            LM
          </span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          IA para estudar
        </span>
      </div>
    </div>
  );
}
