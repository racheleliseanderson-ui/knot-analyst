/**
 * Phone-only guided flow over the same instrument panels the desktop column
 * renders. One decision per screen, a tappable progress rail, swipe between
 * steps, and a sticky bar carrying the job declared so far.
 *
 * Purely presentational: every question, and all state, still lives in the
 * Decide route. Nothing here can change what the engine sees.
 */
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DecideStep {
  id: string;
  /** Short rail label */
  label: string;
  /** Rendered panel */
  node: ReactNode;
  /** A step the user cannot answer yet is never shown */
  ready: boolean;
}

export function DecideStepper({
  steps,
  summary,
  canRun,
  runLabel,
  onRun,
  className,
}: {
  steps: DecideStep[];
  summary: string;
  canRun: boolean;
  runLabel: string;
  onRun: () => void;
  className?: string;
}) {
  const open = steps.filter((s) => s.ready);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const touch = useRef<{ x: number; y: number } | null>(null);

  const clamped = Math.min(index, Math.max(0, open.length - 1));
  const step = open[clamped];
  const last = clamped >= open.length - 1;

  const goTo = (next: number) => {
    const bounded = Math.max(0, Math.min(open.length - 1, next));
    if (bounded === clamped) return;
    setDir(bounded > clamped ? 1 : -1);
    setIndex(bounded);
  };

  if (!step) return null;

  return (
    <div className={cn("min-w-0", className)}>
      {/* Progress rail — every answered step is reachable in one tap */}
      <div
        className="ki-rail -mx-5 mb-4 flex gap-1.5 overflow-x-auto px-5"
        role="tablist"
        aria-label="Decision steps"
      >
        {open.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === clamped}
            aria-current={i === clamped ? "step" : undefined}
            onClick={() => goTo(i)}
            className={cn(
              "ki-press flex min-h-11 shrink-0 items-center gap-2 rounded-md border px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              i === clamped
                ? "border-primary/60 bg-primary/12 text-foreground"
                : "border-hairline text-muted-foreground",
            )}
          >
            <span className="text-primary/80">{String(i + 1).padStart(2, "0")}</span>
            {s.label}
          </button>
        ))}
      </div>

      <div
        onTouchStart={(e) => {
          const p = e.touches[0];
          touch.current = p ? { x: p.clientX, y: p.clientY } : null;
        }}
        onTouchEnd={(e) => {
          const start = touch.current;
          const p = e.changedTouches[0];
          touch.current = null;
          if (!start || !p) return;
          const dx = p.clientX - start.x;
          const dy = p.clientY - start.y;
          if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.6) return;
          goTo(clamped + (dx < 0 ? 1 : -1));
        }}
      >
        <div
          key={step.id}
          className={cn(
            "min-w-0",
            dir === 1
              ? "motion-safe:animate-[ki-step_240ms_ease-out]"
              : "motion-safe:animate-[ki-step-back_240ms_ease-out]",
          )}
        >
          {step.node}
        </div>
      </div>

      {/* Sticky job bar within thumb reach */}
      <div className="ki-safe-bottom sticky bottom-0 z-30 -mx-5 mt-4 border-t border-hairline bg-background/95 px-5 py-2 backdrop-blur-xl">
        <p className="truncate font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {summary}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={() => goTo(clamped - 1)}
            disabled={clamped === 0}
            className="ki-press min-h-11 shrink-0 rounded-md border border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35"
          >
            ← Back
          </button>
          {last ? (
            <button
              type="button"
              onClick={onRun}
              disabled={!canRun}
              className="ki-press min-h-11 flex-1 rounded-md border border-primary/60 bg-primary/15 px-4 text-[0.875rem] font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
            >
              {runLabel}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => goTo(clamped + 1)}
              className="ki-press min-h-11 flex-1 rounded-md border border-primary/60 bg-primary/10 px-4 text-[0.875rem] font-semibold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
