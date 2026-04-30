import logoUrl from "@/assets/studora-logo.png";

type LogoProps = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
};

const SIZES = {
  sm: {
    box: "h-8 w-8 rounded-lg",
    title: "text-sm",
    tagline: "text-[9px] tracking-[0.18em]",
    gap: "gap-2",
  },
  md: {
    box: "h-9 w-9 rounded-xl",
    title: "text-[15px]",
    tagline: "text-[10px] tracking-[0.2em]",
    gap: "gap-2.5",
  },
  lg: {
    box: "h-11 w-11 rounded-xl",
    title: "text-lg",
    tagline: "text-[10px] tracking-[0.22em]",
    gap: "gap-3",
  },
} as const;

export function Logo({ className = "", size = "md", showTagline = true }: LogoProps) {
  const s = SIZES[size];
  return (
    <div className={`flex min-w-0 items-center ${s.gap} ${className}`}>
      <div
        className={`relative flex-shrink-0 overflow-hidden shadow-[0_0_20px_-4px_oklch(0.58_0.24_295/0.6)] ${s.box}`}
      >
        <img
          src={logoUrl}
          alt="Studora LM"
          className="h-full w-full object-cover"
          draggable={false}
        />
      </div>
      <div className="flex min-w-0 flex-col leading-tight">
        <span className={`font-bold tracking-tight text-foreground ${s.title}`}>
          Studora{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            LM
          </span>
        </span>
        {showTagline && (
          <span className={`uppercase text-muted-foreground ${s.tagline}`}>
            IA para estudar
          </span>
        )}
      </div>
    </div>
  );
}
