export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_2px_0_oklch(0.4_0.12_50)]">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path
            d="M4 5.5C4 4.67 4.67 4 5.5 4h11A1.5 1.5 0 0 1 18 5.5V18l-2.5-1.5L13 18l-2.5-1.5L8 18l-2.5-1.5L4 18V5.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
            fill="oklch(0.72 0.14 65)"
            fillOpacity="0.25"
          />
          <path d="M7 8h7M7 11h7M7 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-semibold tracking-tight text-ink">
          Estudos<span className="text-primary">LM</span>
        </span>
        <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
          aprenda de verdade
        </span>
      </div>
    </div>
  );
}
