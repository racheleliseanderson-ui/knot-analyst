import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/instrument/shell";
import { Bullets, Chip, MicroLabel, Panel, Verdict } from "@/components/instrument/primitives";
import { runComparison, constraintValueLabel, type ConstraintDelta } from "@/engine/compare";
import { buildDecisionCard } from "@/engine/advisor";
import { decodeInput, encodeInput } from "@/lib/handoff";
import { useScenarios } from "@/lib/overlay";
import type { ChooseInput } from "@/domain/types";
import { CONNECTION_LABELS, MATERIAL_LABELS } from "@/domain/types";

type Search = { a?: string; b?: string; as?: string; bs?: string };
const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);

export const Route = createFileRoute("/compare")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    a: str(s['a']),
    b: str(s['b']),
    as: str(s['as']),
    bs: str(s['bs']),
  }),
  head: () => ({
    meta: [
      { title: "Quick compare — two scenarios, one engine | Knot Intelligence" },
      {
        name: "description",
        content:
          "Run two connection scenarios side by side and see exactly which constraint changed the recommended knot. Attribution is probed against the engine, not guessed.",
      },
      { property: "og:title", content: "Quick compare — two scenarios, one engine" },
      {
        property: "og:description",
        content:
          "Side-by-side constraint comparison: which single change flips the recommendation, and which changes the model absorbs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CompareMode,
});

const TOGGLES: { key: keyof ChooseInput; label: string }[] = [
  { key: "mustPassGuides", label: "Guides" },
  { key: "windy", label: "Wind" },
  { key: "coldHands", label: "Cold hands" },
  { key: "lowLight", label: "Low light" },
  { key: "hardwareEyeSmall", label: "Small eye" },
  { key: "freeSwing", label: "Free swing" },
  { key: "needsUntie", label: "Must untie" },
];

const RETIES: NonNullable<ChooseInput["retieFrequency"]>[] = ["frequent", "occasional", "rare"];

function SideEditor({
  side,
  input,
  onChange,
  onScenario,
  scenarioId,
}: {
  side: "A" | "B";
  input: Partial<ChooseInput>;
  onChange: (next: Partial<ChooseInput>) => void;
  onScenario: (id: string) => void;
  scenarioId?: string;
}) {
  const scenarios = useScenarios();
  const tone = side === "A" ? "text-muted-foreground" : "text-accent";
  return (
    <Panel className="min-w-0 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <MicroLabel className={tone}>Side {side}</MicroLabel>
        <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
          {input.connection ? CONNECTION_LABELS[input.connection] : "no job declared"}
        </span>
      </div>

      <label className="block">
        <MicroLabel className="mb-2">Scenario</MicroLabel>
        <select
          value={scenarioId ?? ""}
          onChange={(e) => onScenario(e.target.value)}
          aria-label={`Side ${side} scenario`}
          className="min-h-11 w-full rounded-md border border-input bg-surface-2/40 px-3 text-[0.875rem] text-foreground outline-none focus-visible:border-accent/70"
        >
          <option value="">— pick a scenario —</option>
          {scenarios.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
      </label>

      <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
        {[input.mainMaterial ? MATERIAL_LABELS[input.mainMaterial] : null,
          input.secondaryMaterial ? MATERIAL_LABELS[input.secondaryMaterial] : null]
          .filter(Boolean)
          .join(" → ") || "material unset"}
      </p>

      <div className="mt-4">
        <MicroLabel className="mb-2">Conditions</MicroLabel>
        <div className="flex flex-wrap gap-1.5">
          {TOGGLES.map((tg) => (
            <Chip
              key={String(tg.key)}
              active={Boolean(input[tg.key])}
              disabled={!input.connection}
              onClick={() => onChange({ ...input, [tg.key]: !input[tg.key] })}
            >
              {tg.label}
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <MicroLabel className="mb-2">Retie frequency</MicroLabel>
        <div className="flex flex-wrap gap-1.5">
          {RETIES.map((r) => (
            <Chip
              key={r}
              active={input.retieFrequency === r}
              disabled={!input.connection}
              onClick={() =>
                onChange({ ...input, retieFrequency: input.retieFrequency === r ? undefined : r })
              }
            >
              {constraintValueLabel("retieFrequency", r)}
            </Chip>
          ))}
        </div>
      </div>
    </Panel>
  );
}

function AnswerCard({
  side,
  input,
  result,
}: {
  side: "A" | "B";
  input: Partial<ChooseInput>;
  result: ReturnType<typeof runComparison>["a"];
}) {
  const card = buildDecisionCard(result);
  const failed = card.status === "no-valid-option";
  return (
    <Panel className="min-w-0 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <MicroLabel className={side === "A" ? "" : "text-accent"}>Side {side}</MicroLabel>
        <Verdict tone={failed ? "stop" : card.status === "constrained" ? "watch" : "ok"}>
          {failed ? "Fail closed" : card.status === "constrained" ? "Constrained" : "Recommended"}
        </Verdict>
      </div>
      <div className="px-5 py-5">
        <h3 className="text-[1.5rem] font-semibold leading-none tracking-[-0.025em]">
          {failed ? "No valid connection" : card.knotName}
        </h3>
        <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {card.jobLine} · {card.systemLine}
        </p>
        {!failed ? (
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-mono text-[2rem] leading-none tabular-nums text-primary">
              {card.fieldFit}
              <span className="text-base text-muted-foreground">%</span>
            </span>
            <MicroLabel>field fit · confidence {card.confidence}</MicroLabel>
          </div>
        ) : null}
        <div className="mt-4">
          <Bullets items={(failed ? card.watchFor : card.reasons).slice(0, 3)} />
        </div>
        <div className="mt-4 flex flex-wrap gap-2 no-print">
          {result.ranked[0] ? (
            <Link
              to="/tie/$knotId"
              params={{ knotId: result.ranked[0].knot.id }}
              className="rounded-md border border-accent/50 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent hover:bg-accent/10"
            >
              Tie it
            </Link>
          ) : null}
          <Link
            to="/"
            search={toDecideSearch(input)}
            className="rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Open in Decide
          </Link>
        </div>
      </div>
    </Panel>
  );
}

function toDecideSearch(i: Partial<ChooseInput>) {
  return {
    connection: i.connection,
    main: i.mainMaterial,
    secondary: i.secondaryMaterial,
    diameter: i.diameterRelation,
    guides: i.mustPassGuides,
    wind: i.windy,
    cold: i.coldHands,
    lowlight: i.lowLight,
    retie: i.retieFrequency,
    prof: i.proficiency,
    eye: i.hardwareEyeSmall,
    swing: i.freeSwing,
    run: true,
    from: "Quick compare",
  } as never;
}

function DeltaRow({ d }: { d: ConstraintDelta }) {
  return (
    <div
      className={
        "grid grid-cols-[minmax(0,1fr)] gap-1 px-5 py-4 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-4 " +
        (d.decisive ? "bg-accent/8" : "bg-card")
      }
    >
      <div className="flex items-center gap-2">
        <span className="text-[0.875rem] font-medium tracking-tight">{d.label}</span>
        {d.decisive ? <Verdict tone="watch">decisive</Verdict> : null}
      </div>
      <p className="font-mono text-[0.75rem] text-muted-foreground">A · {d.a}</p>
      <p className="font-mono text-[0.75rem] text-foreground/85">B · {d.b}</p>
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/80 sm:text-right">
        {d.decisive
          ? `revert → ${d.probeKnot}`
          : d.fitImpact === 0
            ? "no fit change"
            : `${d.fitImpact > 0 ? "+" : ""}${d.fitImpact} pts`}
      </p>
    </div>
  );
}

function CompareMode() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const scenarios = useScenarios();

  const seedA = decodeInput(search.a) ?? scenarios.find((s) => s.id === search.as)?.input;
  const seedB = decodeInput(search.b) ?? scenarios.find((s) => s.id === search.bs)?.input;

  const [a, setA] = useState<Partial<ChooseInput>>(seedA ?? {});
  const [b, setB] = useState<Partial<ChooseInput>>(seedB ?? {});
  const [ids, setIds] = useState<{ a?: string; b?: string }>({
    ...(search.as ? { a: search.as } : {}),
    ...(search.bs ? { b: search.bs } : {}),
  });

  const ready = Boolean(a.connection && b.connection);
  const comparison = useMemo(
    () => (ready ? runComparison(a as ChooseInput, b as ChooseInput) : null),
    [a, b, ready],
  );

  const pick = (side: "A" | "B", id: string) => {
    const sc = scenarios.find((s) => s.id === id);
    const next = sc ? { ...sc.input } : {};
    if (side === "A") setA(next);
    else setB(next);
    setIds((prev) => ({ ...prev, [side === "A" ? "a" : "b"]: id || undefined }));
  };

  const shareable = () =>
    navigate({ to: "/compare", search: { a: encodeInput(a), b: encodeInput(b) } });

  return (
    <Shell>
      <div className="mb-8">
        <MicroLabel className="text-accent">Mode 03 · Quick compare</MicroLabel>
        <h1 className="mt-2 max-w-3xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em]">
          Two scenarios, one engine.
          <br />
          <span className="text-muted-foreground">
            The model names the constraint that changed the answer.
          </span>
        </h1>
      </div>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <SideEditor side="A" input={a} onChange={setA} onScenario={(id) => pick("A", id)} scenarioId={ids.a} />
        <SideEditor side="B" input={b} onChange={setB} onScenario={(id) => pick("B", id)} scenarioId={ids.b} />
      </div>

      {!ready ? (
        <Panel className="mt-6 p-6">
          <MicroLabel className="mb-2">Nothing compares yet</MicroLabel>
          <p className="max-w-2xl text-[0.875rem] leading-relaxed text-muted-foreground">
            Both sides need a declared connection job. Nothing scores on a guess — that rule holds
            here exactly as it does in Decide.
          </p>
        </Panel>
      ) : null}

      {comparison ? (
        <>
          <Panel className="mt-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <MicroLabel className="text-accent">Verdict</MicroLabel>
              <div className="flex gap-2 no-print">
                <button
                  type="button"
                  onClick={shareable}
                  className="rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                >
                  Lock to URL
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                >
                  Print
                </button>
              </div>
            </div>
            <p className="mt-3 max-w-3xl text-[1rem] leading-relaxed text-foreground/90">
              {comparison.verdict}
            </p>
          </Panel>

          <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-2">
            <AnswerCard side="A" input={a} result={comparison.a} />
            <AnswerCard side="B" input={b} result={comparison.b} />
          </div>

          <Panel className="mt-5 overflow-hidden">
            <div className="border-b border-hairline px-5 py-4">
              <MicroLabel>What changed</MicroLabel>
              <p className="mt-1.5 max-w-2xl text-[0.8125rem] text-muted-foreground">
                Each row is re-run with that single field reverted to side A. “Decisive” means that
                one change alone restores A’s recommendation.
              </p>
            </div>
            {comparison.deltas.length ? (
              <div className="grid gap-px bg-hairline">
                {comparison.deltas.map((d) => (
                  <DeltaRow key={d.key} d={d} />
                ))}
              </div>
            ) : (
              <p className="px-5 py-5 text-[0.875rem] text-muted-foreground">
                No constraints differ. Both sides are the same job.
              </p>
            )}
          </Panel>
        </>
      ) : null}
    </Shell>
  );
}