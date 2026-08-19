/**
 * Family-level failure modes — job failsWhen, geometry defects, diagnostic
 * rules. Exploration only. Diagnose still starts from the symptom.
 */
import { Link } from "@tanstack/react-router";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
import { failsWhenFor } from "@/data/connection-model-meta";
import { getKnot } from "@/data/catalog";
import { platesFor } from "@/data/hth-plates";
import { HthPlate } from "@/components/instrument/hth-plate";
import type { Knot } from "@/domain/types";

export function FailureModesPanel({ knot }: { knot: Knot }) {
  const modes = failsWhenFor(knot.id, knot.commonMistakes);
  const defects = knot.fingerprint.dangerousDefects;
  const diags = knot.diagnostics;
  const related = knot.relatedKnots
    .map((id) => getKnot(id))
    .filter((k): k is Knot => k != null)
    .filter((k) => k.id !== knot.id)
    .slice(0, 4);
  const hth = platesFor(knot.id);

  return (
    <Panel className="p-5">
      <MicroLabel className="mb-1">Failure modes</MicroLabel>
      <p className="mb-4 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">
        When this family fails, it fails as these. The recovered end still outranks the name.
      </p>

      {hth?.failureModes ? (
        <div className="mb-5">
          <HthPlate
            src={hth.failureModes}
            title={`${knot.name} — what fails and what to do`}
            kicker="HTH · Advanced failure modes"
          />
        </div>
      ) : null}

      {modes.length ? (
        <div className="mb-5">
          <MicroLabel className="mb-2">Fails when</MicroLabel>
          <Bullets items={modes} marker="!" />
        </div>
      ) : null}

      {defects.length ? (
        <div className="mb-5">
          <MicroLabel className="mb-2">Geometry</MicroLabel>
          <ul className="space-y-3">
            {defects.map((d) => (
              <li key={d.id}>
                <p className="text-[0.875rem] font-medium tracking-tight">{d.label}</p>
                <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-foreground/85">
                  {d.consequence}
                </p>
                <p className="mt-0.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                  {d.mechanicsWhy}
                  {d.stepWhere != null ? ` · step ${String(d.stepWhere).padStart(2, "0")}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {diags.length ? (
        <div className="mb-5">
          <MicroLabel className="mb-2">If you saw this</MicroLabel>
          <ul className="space-y-4">
            {diags.map((r) => (
              <li key={r.id}>
                <p className="text-[0.875rem] font-medium tracking-tight">{r.symptom}</p>
                <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                  Check
                </p>
                <Bullets items={r.checks} marker="?" />
                <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent">
                  Then
                </p>
                <Bullets items={r.fixes} marker="→" />
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {related.length ? (
        <div className="mb-5">
          <MicroLabel className="mb-2">Related families</MicroLabel>
          <p className="mb-2 text-[0.75rem] leading-relaxed text-muted-foreground">
            Same job, different failure. Open the plates — Diagnose still starts from the symptom.
          </p>
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {related.map((k) => (
              <li key={k.id}>
                <Link
                  to="/diagram/$knotId"
                  params={{ knotId: k.id }}
                  className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
                >
                  {k.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Link
        to="/diagnose"
        search={{ knot: knot.id }}
        className="inline-block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
      >
        This failed — start Diagnose
      </Link>
    </Panel>
  );
}
