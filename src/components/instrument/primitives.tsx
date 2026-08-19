import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Panel({ className, children, ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("panel", className)} {...rest}>
      {children}
    </div>
  );
}

export function MicroLabel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("label-micro", className)}>{children}</div>;
}

export function StepHead({
  index,
  title,
  hint,
  state = "open",
}: {
  index: string;
  title: string;
  hint?: string;
  state?: "open" | "locked";
}) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <span
        className={cn(
          "font-mono text-[0.6875rem] tracking-[0.18em]",
          state === "locked" ? "text-muted-foreground/50" : "text-primary",
        )}
      >
        {index}
      </span>
      <div className="min-w-0">
        <h2
          className={cn(
            "text-[0.95rem] font-semibold tracking-tight",
            state === "locked" && "text-muted-foreground/60",
          )}
        >
          {title}
        </h2>
        {hint ? <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p> : null}
      </div>
    </div>
  );
}

export function Chip({
  active,
  disabled,
  onClick,
  children,
  tone = "neutral",
}: {
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  children: ReactNode;
  tone?: "neutral" | "signal";
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "ki-press flex min-h-11 touch-manipulation items-center rounded-md border px-3 py-1.5 text-left text-[0.8125rem] leading-tight transition-all duration-200 sm:min-h-9",
        "border-hairline bg-surface-2/40 text-muted-foreground hover:border-border hover:text-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active &&
          (tone === "signal"
            ? "border-primary/70 bg-primary/15 text-foreground shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
            : "border-accent/70 bg-accent/15 text-foreground"),
        disabled &&
          "cursor-not-allowed opacity-35 hover:border-hairline hover:text-muted-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Meter({ value, label, sub }: { value: number; label?: string; sub?: string }) {
  const grade = value >= 78 ? 1 : value >= 58 ? 2 : 3;
  const tone = `var(--grade-${grade})`;
  return (
    <div>
      {label ? (
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <span className="text-[0.8125rem] text-muted-foreground">{label}</span>
          <span className="font-mono text-xs tabular-nums text-foreground/80">{value}</span>
        </div>
      ) : null}
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-surface-2">
        <div
          data-grade={grade}
          className="ki-meter-fill h-full rounded-full transition-[width] duration-700 ease-out"
          style={{ width: `${Math.max(2, Math.min(100, value))}%`, background: tone }}
        />
      </div>
      {sub ? <p className="mt-1 text-xs text-muted-foreground">{sub}</p> : null}
    </div>
  );
}

export function Verdict({
  tone,
  children,
}: {
  tone: "stop" | "watch" | "ok" | "unknown";
  children: ReactNode;
}) {
  const map = {
    stop: "border-destructive/50 bg-destructive/12 text-destructive",
    watch: "border-caution/50 bg-caution/12 text-caution",
    ok: "border-affirm/50 bg-affirm/12 text-affirm",
    unknown: "border-border bg-surface-2 text-muted-foreground",
  } as const;
  // Never colour alone — each tone carries a glyph so the state survives
  // colour-vision deficiency and greyscale printing.
  const glyph = { stop: "×", watch: "!", ok: "✓", unknown: "?" } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em]",
        map[tone],
      )}
    >
      <span
        aria-hidden="true"
        className="grid h-4 w-4 place-items-center rounded-full border border-current text-[0.625rem] leading-none"
      >
        {glyph[tone]}
      </span>
      {children}
    </span>
  );
}

export function Bullets({
  items,
  marker = "·",
  className,
}: {
  items: string[];
  marker?: string;
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2", className)}>
      {items.map((t, i) => (
        <li key={i} className="flex gap-3 text-[0.875rem] leading-relaxed text-foreground/85">
          <span className="mt-[0.45em] font-mono text-[0.625rem] text-primary/80">{marker}</span>
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}
