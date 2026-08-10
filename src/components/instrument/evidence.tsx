/**
 * Evidence drilldown — exposes what the compare engine already computed for a
 * single constraint. Nothing here infers; every figure comes from a probe run.
 */
import { MicroLabel, Verdict } from "@/components/instrument/primitives";
import type { ConstraintDelta } from "@/engine/compare";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="min-w-0">
      <MicroLabel className="mb-2.5">{title}</MicroLabel>
      {children}
    </section>
  );
}

function DeltaBar({ delta, weight }: { delta: number; weight: number }) {
  const mag = Math.min(100, Math.abs(delta) * 4);
  const dim = weight <= 0;
  return (
    <div className="relative h-[3px] w-full rounded-full bg-surface-2" aria-hidden="true">
      <span className="absolute left-1/2 top-[-2px] h-[7px] w-px bg-border" />
      <span
        className="absolute top-0 h-full rounded-full"
        style={{
          width: `${mag / 2}%`,
          left: delta >= 0 ? "50%" : `${50 - mag / 2}%`,
          background: dim
            ? "var(--muted-foreground)"
            : delta >= 0
              ? "var(--affirm)"
              : "var(--caution)",
          opacity: dim ? 0.35 : 1,
        }}
      />
    </div>
  );
}

export function EvidenceBody({ d }: { d: ConstraintDelta }) {
  const moved = d.dimensionDeltas.filter((x) => x.delta !== 0);
  const still = d.dimensionDeltas.length - moved.length;
  const proof = !d.probeKnot || d.probeKnot === "no valid option"
    ? "Reverting this field leaves no valid connection under hard constraints. The probe fails closed rather than substituting a weaker option."
    : d.decisive
      ? "Reverting this field alone restores side A's recommendation. Decisive."
      : d.changesAnswer
        ? "Reverting this field moves the answer, but not back to side A. Partial attribution."
        : "Reverting this field leaves the recommendation unchanged. The model absorbs it.";

  return (
    <div className="grid gap-7 border-t border-hairline bg-surface-2/25 px-5 py-6 lg:grid-cols-2">
      <Block title="Constraint">
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 font-mono text-[0.75rem]">
          <dt className="text-muted-foreground/70">field</dt>
          <dd className="text-foreground/90">{d.label}</dd>
          <dt className="text-muted-foreground/70">A</dt>
          <dd className="text-muted-foreground">{d.a}</dd>
          <dt className="text-muted-foreground/70">B</dt>
          <dd className="text-foreground/90">{d.b}</dd>
          <dt className="text-muted-foreground/70">layer</dt>
          <dd className="text-foreground/90">
            {d.kind === "hard"
              ? "Layer 1 — removes options outright"
              : "Layer 2 — weighting only, no eliminations"}
          </dd>
        </dl>
      </Block>

      <Block title="Probe result">
        <div className="flex items-baseline gap-3">
          <span className="text-[1.125rem] font-semibold tracking-tight">
            {d.probeKnot ?? "no valid option"}
          </span>
          <span className="font-mono text-[0.75rem] tabular-nums text-muted-foreground">
            {d.probeFit}% field fit
          </span>
        </div>
        <p className="mt-2 max-w-prose text-[0.8125rem] leading-relaxed text-muted-foreground">
          {proof}
        </p>
        <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/70">
          fit delta on B · {d.fitImpact > 0 ? "+" : ""}
          {d.fitImpact} pts
        </p>
      </Block>

      <Block title={`Eliminated by this field (${d.eliminatedByField.length})`}>
        {d.eliminatedByField.length ? (
          <ul className="space-y-2.5">
            {d.eliminatedByField.map((e) => (
              <li key={e.knotName} className="border-l border-destructive/40 pl-3">
                <p className="text-[0.8125rem] font-medium tracking-tight">{e.knotName}</p>
                <p className="mt-0.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                  {e.reasons[0]}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[0.8125rem] text-muted-foreground">
            No knot is eliminated by this field alone. It changes scores, not survival.
          </p>
        )}
      </Block>

      <Block title="Score movement">
        {d.referenceKnot ? (
          <>
            <p className="mb-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/70">
              reference · {d.referenceKnot}
            </p>
            {moved.length ? (
              <ul className="space-y-3">
                {moved.map((m) => (
                  <li key={m.dimension}>
                    <div className="mb-1 flex items-baseline justify-between gap-3">
                      <span className="text-[0.8125rem] text-muted-foreground">{m.label}</span>
                      <span className="font-mono text-[0.75rem] tabular-nums text-foreground/85">
                        {m.delta > 0 ? "+" : ""}
                        {m.delta}
                      </span>
                    </div>
                    <DeltaBar delta={m.delta} weight={m.weight} />
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="mt-3 text-[0.75rem] text-muted-foreground">
              {still} dimension{still === 1 ? "" : "s"} show no movement.
            </p>
          </>
        ) : (
          <p className="text-[0.8125rem] text-muted-foreground">
            No shared candidate between the two runs — the survivor set changed entirely.
          </p>
        )}
      </Block>

      <div className="lg:col-span-2">
        <Block title="Rank order · B vs reverted probe">
          <div className="grid gap-4 sm:grid-cols-2">
            <ol className="space-y-1.5">
              {d.orderB.map((n, i) => (
                <li key={n} className="font-mono text-[0.75rem] text-foreground/85">
                  <span className="text-muted-foreground/60">{i + 1}.</span> {n}
                </li>
              ))}
              {!d.orderB.length ? (
                <li className="font-mono text-[0.75rem] text-muted-foreground">fail closed</li>
              ) : null}
            </ol>
            <ol className="space-y-1.5">
              {d.orderProbe.map((n, i) => (
                <li
                  key={n}
                  className={
                    "font-mono text-[0.75rem] " +
                    (d.orderB[i] === n ? "text-muted-foreground" : "text-accent")
                  }
                >
                  <span className="text-muted-foreground/60">{i + 1}.</span> {n}
                  {d.orderB[i] === n ? "" : " ←"}
                </li>
              ))}
              {!d.orderProbe.length ? (
                <li className="font-mono text-[0.75rem] text-muted-foreground">fail closed</li>
              ) : null}
            </ol>
          </div>
        </Block>
      </div>
    </div>
  );
}

export function EvidenceTag({ d }: { d: ConstraintDelta }) {
  if (d.decisive) return <Verdict tone="watch">decisive</Verdict>;
  if (d.changesAnswer) return <Verdict tone="unknown">moves the answer</Verdict>;
  return <Verdict tone="ok">absorbed</Verdict>;
}

export function evidenceText(d: ConstraintDelta): string {
  const lines = [
    `${d.label}: A = ${d.a} / B = ${d.b}`,
    `Layer: ${d.kind === "hard" ? "1 (eliminations)" : "2 (weighting)"}`,
    `Revert probe: ${d.probeKnot ?? "no valid option"} at ${d.probeFit}% (${d.fitImpact > 0 ? "+" : ""}${d.fitImpact} pts vs B)`,
    d.decisive
      ? "Decisive: this field alone restores side A."
      : d.changesAnswer
        ? "Moves the answer, but not back to A."
        : "Absorbed: recommendation unchanged.",
  ];
  if (d.eliminatedByField.length) {
    lines.push(
      "Eliminated by this field: " + d.eliminatedByField.map((e) => e.knotName).join(", "),
    );
  }
  return lines.join("\n");
}
