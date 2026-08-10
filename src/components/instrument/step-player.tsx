import { useCallback, useEffect, useState } from "react";
import type { Knot } from "@/domain/types";
import { KnotDiagram } from "@/components/instrument/diagram";
import { MicroLabel, Panel } from "@/components/instrument/primitives";
import { cn } from "@/lib/utils";

export function StepPlayer({ knot }: { knot: Knot }) {
  const steps = knot.steps.slice().sort((a, b) => a.order - b.order);
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const current = steps[index];

  const go = useCallback(
    (delta: number) => setIndex((i) => Math.min(total - 1, Math.max(0, i + delta))),
    [total],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  if (!current) return null;

  const defect = knot.fingerprint.dangerousDefects.filter(
    (d) => d.stepWhere === current.order,
  );

  return (
    <Panel className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <MicroLabel>Tying procedure — step {`${index + 1} / ${total}`}</MicroLabel>
        <div className="flex items-center gap-1.5 no-print">
          {steps.map((s, i) => (
            <button
              key={s.order}
              type="button"
              aria-label={`Step ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i === index ? "w-6 bg-primary" : "w-3 bg-surface-2 hover:bg-border",
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-hairline lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="bg-surface-2/40 p-4">
          <KnotDiagram
            kind={knot.diagramKind}
            step={index + 1}
            title={`${knot.name} — step ${index + 1}`}
            className="aspect-[400/180] w-full"
          />
        </div>

        <div className="bg-card px-5 py-5">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
            {String(current.order).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[1.0625rem] leading-snug tracking-tight text-foreground">
            {current.instruction}
          </p>

          {current.tip ? (
            <div className="mt-4 border-l-2 border-accent/60 pl-3">
              <MicroLabel className="text-accent">Tension / control</MicroLabel>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
                {current.tip}
              </p>
            </div>
          ) : null}

          {current.commonError ? (
            <div className="mt-4 border-l-2 border-caution/60 pl-3">
              <MicroLabel className="text-caution">Common error here</MicroLabel>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
                {current.commonError}
              </p>
            </div>
          ) : null}

          {defect.length ? (
            <div className="mt-4 border-l-2 border-destructive/60 pl-3">
              <MicroLabel className="text-destructive">What fails if this is wrong</MicroLabel>
              <ul className="mt-1 space-y-1.5">
                {defect.map((d) => (
                  <li key={d.id} className="text-[0.8125rem] leading-relaxed text-foreground/85">
                    <span className="font-medium">{d.label}</span> — {d.consequence}.{" "}
                    <span className="text-muted-foreground">{d.mechanicsWhy}.</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-hairline px-5 py-3 no-print">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground disabled:opacity-35"
        >
          ← Previous
        </button>
        <p className="hidden font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/60 sm:block">
          arrow keys work
        </p>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === total - 1}
          className="rounded-md border border-primary/60 bg-primary/15 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-primary/25 disabled:opacity-35"
        >
          Next →
        </button>
      </div>
    </Panel>
  );
}