import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { Knot, KnotStep } from "@/domain/types";
import { KnotDiagram, describeDiagram } from "@/components/instrument/diagram";
import { MicroLabel, Panel } from "@/components/instrument/primitives";
import { cn } from "@/lib/utils";

export function StepPlayer({ knot }: { knot: Knot }) {
  const steps = knot.steps.slice().sort((a, b) => a.order - b.order);
  const total = steps.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [microOpen, setMicroOpen] = useState(false);
  const [describeOpen, setDescribeOpen] = useState(false);
  const current = steps[index];
  const indexRef = useRef(0);
  indexRef.current = index;

  const goTo = useCallback(
    (next: number) =>
      setIndex((i) => {
        const clamped = Math.min(total - 1, Math.max(0, next));
        if (clamped !== i) setDir(clamped > i ? 1 : -1);
        return clamped;
      }),
    [total],
  );

  const go = useCallback((delta: number) => goTo(indexRef.current + delta), [goTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  // Horizontal swipe on the diagram — thumb navigation on a phone
  const swipe = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: ReactPointerEvent) => {
    swipe.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: ReactPointerEvent) => {
    const start = swipe.current;
    swipe.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.4) return;
    go(dx < 0 ? 1 : -1);
  };

  if (!current) return null;

  const defect = knot.fingerprint.dangerousDefects.filter(
    (d) => d.stepWhere === current.order,
  );

  const hasMicro = Boolean(current.look || current.failureMode || current.quickFix);
  const diagramDescription = describeDiagram(knot.diagramKind, index + 1, total);

  return (
    <>
    <Panel
      className="rounded-lg print:hidden sm:overflow-hidden"
      role="group"
      aria-roledescription="step player"
      aria-label={`${knot.name} tying procedure`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <MicroLabel>Tying procedure — step {`${index + 1} / ${total}`}</MicroLabel>
        <div className="hidden items-center gap-1.5 no-print sm:flex" role="tablist" aria-label="Steps">
          {steps.map((s, i) => (
            <button
              key={s.order}
              type="button"
              role="tab"
              aria-label={`Step ${i + 1} of ${total}`}
              aria-selected={i === index}
              aria-current={i === index ? "step" : undefined}
              onClick={() => goTo(i)}
              className={cn(
                "relative h-1.5 rounded-full transition-all after:absolute after:-inset-y-5 after:-inset-x-1 after:content-[''] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                i === index ? "w-6 bg-primary" : "w-3 bg-surface-2 hover:bg-border",
              )}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-px bg-hairline lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div
          className="touch-pan-y select-none bg-surface-2/40 p-4"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <KnotDiagram
            kind={knot.diagramKind}
            step={index + 1}
            focus
            title={`${knot.name} — step ${index + 1} of ${total}: ${current.instruction}`}
            description={`${diagramDescription} This step: ${current.instruction}`}
            className="aspect-[400/230] w-full transition-opacity duration-200 motion-reduce:transition-none sm:aspect-[400/180]"
          />
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setDescribeOpen((v) => !v)}
              aria-expanded={describeOpen}
              className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-md px-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MicroLabel>Describe diagram</MicroLabel>
              <span
                aria-hidden="true"
                className={cn(
                  "font-mono text-[0.625rem] text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
                  describeOpen && "rotate-90",
                )}
              >
                ▸
              </span>
            </button>
            {describeOpen ? (
              <p className="motion-safe:animate-fade-in px-1 pb-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {diagramDescription}
              </p>
            ) : null}
          </div>
          <p className="mt-1 text-center font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground/60 sm:hidden">
            swipe to step
          </p>
        </div>

        <div
          key={index}
          className="bg-card px-5 py-5 motion-safe:animate-[ki-step_240ms_ease-out]"
          style={{ ["--ki-step-from" as string]: dir === 1 ? "10px" : "-10px" }}
          aria-live="polite"
        >
          <p className="sr-only">
            Step {index + 1} of {total}
          </p>
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
            {String(current.order).padStart(2, "0")}
          </p>
          <p className="mt-2 text-[1.0625rem] leading-snug tracking-tight text-foreground">
            {current.instruction}
          </p>

          {current.detail ? (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {current.detail}
            </p>
          ) : null}

          {current.expectedResult ? (
            <div className="mt-4 border-l-2 border-primary/60 pl-3">
              <MicroLabel className="text-primary">You should now see</MicroLabel>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
                {current.expectedResult}
              </p>
            </div>
          ) : null}

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

          {hasMicro ? (
            <div className="mt-4 overflow-hidden rounded-md border border-hairline">
              <button
                type="button"
                onClick={() => setMicroOpen((v) => !v)}
                aria-expanded={microOpen}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 bg-surface-2/40 px-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <MicroLabel>Micro how-to</MicroLabel>
                <span
                  aria-hidden="true"
                  className={cn(
                    "font-mono text-[0.625rem] text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
                    microOpen && "rotate-90",
                  )}
                >
                  ▸
                </span>
              </button>
              {microOpen ? (
                <dl className="motion-safe:animate-fade-in space-y-3 border-t border-hairline px-3 py-3">
                  {current.look ? (
                    <div>
                      <dt className="label-micro text-affirm">✓ Look for</dt>
                      <dd className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
                        {current.look}
                      </dd>
                    </div>
                  ) : null}
                  {current.failureMode ? (
                    <div>
                      <dt className="label-micro text-destructive">× Fails as</dt>
                      <dd className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
                        {current.failureMode}
                      </dd>
                    </div>
                  ) : null}
                  {current.quickFix ? (
                    <div>
                      <dt className="label-micro text-accent">→ Quick fix</dt>
                      <dd className="mt-1 text-[0.8125rem] leading-relaxed text-foreground/85">
                        {current.quickFix}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              ) : null}
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

      <div className="hidden items-center justify-between gap-3 border-t border-hairline px-5 py-3 no-print sm:flex">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35"
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
          className="rounded-md border border-primary/60 bg-primary/15 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35"
        >
          Next →
        </button>
      </div>

      {/* Phone: controls pinned within thumb reach */}
      <div className="sticky bottom-0 z-30 flex items-center justify-between gap-2 border-t border-hairline bg-background/95 px-3 py-2 backdrop-blur-xl no-print sm:hidden">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          aria-label="Previous step"
          className="min-h-[44px] min-w-[64px] rounded-md border border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35"
        >
          ← Prev
        </button>
        <div className="flex flex-1 items-center justify-center gap-1.5" role="tablist" aria-label="Steps">
          {steps.map((s, i) => (
            <button
              key={s.order}
              type="button"
              role="tab"
              aria-label={`Step ${i + 1} of ${total}`}
              aria-selected={i === index}
              aria-current={i === index ? "step" : undefined}
              onClick={() => goTo(i)}
              className="flex h-11 min-w-[16px] items-center px-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span
                className={cn(
                  "block h-1.5 rounded-full transition-all motion-reduce:transition-none",
                  i === index ? "w-6 bg-primary" : "w-2.5 bg-surface-2",
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={index === total - 1}
          aria-label="Next step"
          className="min-h-[44px] min-w-[64px] rounded-md border border-primary/60 bg-primary/15 px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-35"
        >
          Next →
        </button>
      </div>
    </Panel>

    <PrintSteps knot={knot} steps={steps} />
    </>
  );
}

/** Print-only linear rendering — every step expanded, no controls. */
function PrintSteps({ knot, steps }: { knot: Knot; steps: KnotStep[] }) {
  const total = steps.length;
  return (
    <section className="hidden print:block">
      <h2 className="mb-3 text-[1rem] font-semibold tracking-tight">
        Tying procedure — {knot.name}
      </h2>
      <ol className="space-y-4">
        {steps.map((s, i) => {
          const defect = knot.fingerprint.dangerousDefects.filter((d) => d.stepWhere === s.order);
          return (
            <li key={s.order} className="break-inside-avoid border-t border-hairline pt-3">
              <div className="grid gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
                <KnotDiagram
                  kind={knot.diagramKind}
                  step={s.order}
                  title={`${knot.name} — step ${i + 1} of ${total}`}
                  className="aspect-[400/180] w-full"
                />
                <div>
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em]">
                    Step {String(s.order).padStart(2, "0")} / {total}
                  </p>
                  <p className="mt-1 text-[0.9375rem] leading-snug">{s.instruction}</p>
                  {s.detail ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">{s.detail}</p>
                  ) : null}
                  {s.expectedResult ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        You should now see:{" "}
                      </span>
                      {s.expectedResult}
                    </p>
                  ) : null}
                  {s.tip ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        Tension / control:{" "}
                      </span>
                      {s.tip}
                    </p>
                  ) : null}
                  {s.look ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        ✓ Look for:{" "}
                      </span>
                      {s.look}
                    </p>
                  ) : null}
                  {s.failureMode ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        × Fails as:{" "}
                      </span>
                      {s.failureMode}
                    </p>
                  ) : null}
                  {s.quickFix ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        → Quick fix:{" "}
                      </span>
                      {s.quickFix}
                    </p>
                  ) : null}
                  {s.commonError ? (
                    <p className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        Common error:{" "}
                      </span>
                      {s.commonError}
                    </p>
                  ) : null}
                  {defect.map((d) => (
                    <p key={d.id} className="mt-1 text-[0.8125rem] leading-relaxed">
                      <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em]">
                        If wrong:{" "}
                      </span>
                      {d.label} — {d.consequence}.
                    </p>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}