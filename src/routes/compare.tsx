import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Shell } from "@/components/instrument/shell";
import { Bullets, Chip, MicroLabel, Panel, Verdict } from "@/components/instrument/primitives";
import { EvidenceBody, EvidenceTag, evidenceText } from "@/components/instrument/evidence";
import {
  runComparison,
  constraintValueLabel,
  type ComparisonResult,
  type ConstraintDelta,
} from "@/engine/compare";
import { buildDecisionCard } from "@/engine/advisor";
import { decodeInput, encodeInput } from "@/lib/handoff";
import { useScenarios } from "@/lib/overlay";
import type { ChooseInput } from "@/domain/types";
import { CONNECTION_LABELS, MATERIAL_LABELS } from "@/domain/types";

type Search = { a?: string; b?: string; as?: string; bs?: string; row?: string };
const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);

export const Route = createFileRoute("/compare")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    a: str(s['a']),
    b: str(s['b']),
    as: str(s['as']),
    bs: str(s['bs']),
    row: str(s['row']),
  }),
  head: () => ({
    meta: [
      { title: "Quick compare — two scenarios, one engine | Knot Intelligence" },
      {
        name: "description",
        content:
          "Run two connection scenarios side by side, then open any changed constraint to read the exact evidence — eliminations, score movement and the reverted probe run.",
      },
      { property: "og:title", content: "Quick compare — evidence for every constraint" },
      {
        property: "og:description",
        content:
          "Side-by-side constraint comparison with a per-row evidence drilldown and explicit pipeline run controls.",
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

const btn =
  "ki-press inline-flex min-h-11 touch-manipulation items-center rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-border hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-9";

function summarise(i: Partial<ChooseInput>): string {
  const bits: string[] = [];
  for (const t of TOGGLES) if (i[t.key]) bits.push(t.label.toLowerCase());
  if (i.retieFrequency) bits.push(`${i.retieFrequency} retie`);
  return bits.length ? bits.join(" · ") : "no conditions declared";
}

function SideEditor({
  side,
  input,
  onChange,
  onScenario,
  scenarioId,
  collapsed,
}: {
  side: "A" | "B";
  input: Partial<ChooseInput>;
  onChange: (next: Partial<ChooseInput>) => void;
  onScenario: (id: string) => void;
  scenarioId?: string;
  collapsed: boolean;
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

      {collapsed ? (
        <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
          {summarise(input)}
        </p>
      ) : (
        <>
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
        </>
      )}
    </Panel>
  );
}

function AnswerCard({
  side,
  input,
  result,
  highlighted,
}: {
  side: "A" | "B";
  input: Partial<ChooseInput>;
  result: ComparisonResult["a"];
  highlighted: boolean;
}) {
  const card = buildDecisionCard(result);
  const failed = card.status === "no-valid-option";
  return (
    <Panel
      className={
        "min-w-0 overflow-hidden transition-shadow duration-200 " +
        (highlighted ? "ring-1 ring-accent/60" : "")
      }
    >
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
              className={btn + " border-accent/50 text-accent hover:bg-accent/10"}
            >
              Tie it
            </Link>
          ) : null}
          <Link to="/" search={toDecideSearch(input)} className={btn}>
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

function PipelineStrip({
  comparison,
  revealed,
  frozen,
  onRerun,
  onStep,
  onToggleFreeze,
  log,
  onRestore,
  onClearLog,
}: {
  comparison: ComparisonResult;
  revealed: number;
  frozen: boolean;
  onRerun: () => void;
  onStep: () => void;
  onToggleFreeze: () => void;
  log: RunEntry[];
  onRestore: (e: RunEntry) => void;
  onClearLog: () => void;
}) {
  const [showLog, setShowLog] = useState(false);
  return (
    <Panel className={"mt-6 overflow-hidden " + (frozen ? "ring-1 ring-caution/70" : "")}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <MicroLabel>Pipeline</MicroLabel>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
            run {comparison.runId} · {new Date(comparison.ranAt).toLocaleTimeString()}
          </span>
          {frozen ? <Verdict tone="watch">frozen — edits not recomputed</Verdict> : null}
        </div>
        <div className="flex flex-wrap gap-2 no-print">
          <button type="button" onClick={onRerun} className={btn}>
            Re-run
          </button>
          <button type="button" onClick={onStep} className={btn}>
            Step {Math.min(revealed, 4)}/4
          </button>
          <button
            type="button"
            onClick={onToggleFreeze}
            aria-pressed={frozen}
            className={btn + (frozen ? " border-caution/60 text-caution" : "")}
          >
            {frozen ? "Unfreeze" : "Freeze"}
          </button>
          <button
            type="button"
            onClick={() => setShowLog((v) => !v)}
            aria-expanded={showLog}
            className={btn}
          >
            Runs {log.length}
          </button>
        </div>
      </div>
      {showLog ? (
        <div className="border-b border-hairline px-5 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <MicroLabel>Run log — this session only</MicroLabel>
            <button
              type="button"
              onClick={onClearLog}
              className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-destructive"
            >
              Clear
            </button>
          </div>
          {log.length === 0 ? (
            <p className="text-[0.75rem] text-muted-foreground">No completed runs recorded yet.</p>
          ) : (
            <ol className="space-y-1">
              {log.map((e) => (
                <li
                  key={e.runId}
                  className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-hairline py-2 first:border-t-0"
                >
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                    {e.runId} · {new Date(e.ranAt).toLocaleTimeString()} · {e.ms} ms
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[0.75rem] text-muted-foreground">
                    {e.verdict}
                  </span>
                  <span className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-primary">
                    {e.decisive} decisive
                  </span>
                  <button
                    type="button"
                    onClick={() => onRestore(e)}
                    className="ki-press min-h-9 rounded-md border border-hairline px-2.5 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Restore inputs
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      ) : null}
      <ol className="grid gap-px bg-hairline sm:grid-cols-4">
        {comparison.stages.map((s, i) => {
          const done = i < revealed;
          return (
            <li key={s.id} className="bg-card px-5 py-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.625rem] text-muted-foreground/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.875rem] font-medium tracking-tight">{s.label}</span>
                <span
                  className={
                    "ml-auto font-mono text-[0.5625rem] uppercase tracking-[0.14em] " +
                    (done ? "text-affirm" : "text-muted-foreground/60")
                  }
                >
                  {done ? "✓ done" : "· held"}
                </span>
              </div>
              <p className="mt-1.5 text-[0.75rem] leading-relaxed text-muted-foreground">
                {done ? s.detail : "awaiting step"}
              </p>
              <p className="mt-1 font-mono text-[0.625rem] tabular-nums text-muted-foreground/60">
                {done ? `${s.ms} ms` : "—"}
              </p>
            </li>
          );
        })}
      </ol>
    </Panel>
  );
}

function DeltaRow({
  d,
  open,
  onToggle,
  onHover,
  onApply,
}: {
  d: ConstraintDelta;
  open: boolean;
  onToggle: () => void;
  onHover: (side: "A" | "B" | null) => void;
  onApply: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) bodyRef.current?.focus();
  }, [open]);

  return (
    <div
      className={d.decisive ? "bg-accent/8" : d.changesAnswer ? "bg-surface-2/40" : "bg-card"}
      onMouseEnter={() => onHover(d.decisive ? "A" : "B")}
      onMouseLeave={() => onHover(null)}
      role="rowgroup"
    >
      <button
        type="button"
        onClick={onToggle}
        onFocus={() => onHover(d.decisive ? "A" : "B")}
        onBlur={() => onHover(null)}
        aria-expanded={open}
        aria-controls={`evidence-${d.key}`}
        className="ki-press grid w-full min-h-11 touch-manipulation grid-cols-[minmax(0,1fr)] gap-1 px-5 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,180px)_auto] sm:items-center sm:gap-4"
        role="row"
      >
        <span className="flex flex-wrap items-center gap-2" role="cell">
          <span className="text-[0.875rem] font-medium tracking-tight">{d.label}</span>
          <EvidenceTag d={d} />
        </span>
        <span className="font-mono text-[0.75rem] text-muted-foreground" role="cell">
          <span className="sm:hidden">A · </span>
          {d.a}
        </span>
        <span className="font-mono text-[0.75rem] text-foreground/85" role="cell">
          <span className="sm:hidden">B · </span>
          {d.b}
        </span>
        <span
          className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/80 sm:text-right"
          role="cell"
        >
          {d.decisive || d.changesAnswer
            ? `revert → ${d.probeKnot}`
            : d.fitImpact === 0
              ? "no fit change"
              : `${d.fitImpact > 0 ? "+" : ""}${d.fitImpact} pts`}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-[0.75rem] text-muted-foreground/70 sm:text-right"
          role="cell"
        >
          {open ? "−" : "+"}
        </span>
      </button>

      {open ? (
        <div
          id={`evidence-${d.key}`}
          ref={bodyRef}
          tabIndex={-1}
          onKeyDown={(e) => {
            if (e.key === "Escape") onToggle();
          }}
          className="ki-rise focus-visible:outline-none"
        >
          <EvidenceBody d={d} />
          <div className="flex flex-wrap gap-2 border-t border-hairline px-5 py-4 no-print">
            <button type="button" onClick={onApply} className={btn}>
              Apply A&rsquo;s value to B
            </button>
            <button
              type="button"
              onClick={() => void navigator.clipboard?.writeText(evidenceText(d))}
              className={btn}
            >
              Copy evidence
            </button>
          </div>
        </div>
      ) : null}
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
  const [openRow, setOpenRow] = useState<string | undefined>(search.row);
  const [revealed, setRevealed] = useState(4);
  const [nonce, setNonce] = useState(0);
  const [frozen, setFrozen] = useState(false);
  const [hover, setHover] = useState<"A" | "B" | null>(null);
  const [compact, setCompact] = useState(false);
  const frozenRef = useRef<ComparisonResult | null>(null);

  const ready = Boolean(a.connection && b.connection);
  const live = useMemo(
    () => (ready ? runComparison(a as ChooseInput, b as ChooseInput) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a, b, ready, nonce],
  );
  const comparison = frozen && frozenRef.current ? frozenRef.current : live;

  const toggleFreeze = () => {
    if (!frozen) frozenRef.current = live;
    else frozenRef.current = null;
    setFrozen(!frozen);
  };

  const pick = (side: "A" | "B", id: string) => {
    const sc = scenarios.find((s) => s.id === id);
    const next = sc ? { ...sc.input } : {};
    if (side === "A") setA(next);
    else setB(next);
    setIds((prev) => ({ ...prev, [side === "A" ? "a" : "b"]: id || undefined }));
  };

  const toggleRow = (key: string) => {
    const next = openRow === key ? undefined : key;
    setOpenRow(next);
    void navigate({
      to: "/compare",
      search: (prev: Search) => ({ ...prev, row: next }),
      replace: true,
    });
  };

  const shareable = () =>
    navigate({ to: "/compare", search: { a: encodeInput(a), b: encodeInput(b), row: openRow } });

  const deltas = comparison?.deltas ?? [];

  return (
    <Shell>
      <div className="mb-8">
        <MicroLabel className="text-accent">Mode 03 · Quick compare</MicroLabel>
        <h1 className="mt-2 max-w-3xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em]">
          Two scenarios, one engine.
          <br />
          <span className="text-muted-foreground">
            Open any changed constraint to read the evidence behind it.
          </span>
        </h1>
      </div>

      <section aria-labelledby="setup-h">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 id="setup-h" className="label-micro">
            01 · Setup
          </h2>
          <div className="flex flex-wrap gap-2 no-print">
            <button
              type="button"
              onClick={() => setCompact((c) => !c)}
              aria-pressed={compact}
              className={btn}
            >
              {compact ? "Expand setup" : "Collapse setup"}
            </button>
            <button
              type="button"
              onClick={() => {
                setA(b);
                setB(a);
                setIds((p) => ({ a: p.b, b: p.a }));
              }}
              className={btn}
            >
              Swap A / B
            </button>
            <button
              type="button"
              onClick={() => {
                setB({ ...a });
                setIds((p) => ({ ...p, b: p.a }));
              }}
              className={btn}
            >
              Copy A → B
            </button>
            <button
              type="button"
              onClick={() => {
                setA({});
                setB({});
                setIds({});
                setOpenRow(undefined);
              }}
              className={btn}
            >
              Reset
            </button>
          </div>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <SideEditor
            side="A"
            input={a}
            onChange={setA}
            onScenario={(id) => pick("A", id)}
            scenarioId={ids.a}
            collapsed={compact}
          />
          <SideEditor
            side="B"
            input={b}
            onChange={setB}
            onScenario={(id) => pick("B", id)}
            scenarioId={ids.b}
            collapsed={compact}
          />
        </div>
      </section>

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
          <section aria-labelledby="run-h">
            <h2 id="run-h" className="sr-only">
              02 · Run
            </h2>
            <PipelineStrip
              comparison={comparison}
              revealed={revealed}
              frozen={frozen}
              onRerun={() => {
                setRevealed(4);
                setNonce((n) => n + 1);
              }}
              onStep={() => setRevealed((r) => (r >= 4 ? 1 : r + 1))}
              onToggleFreeze={toggleFreeze}
            />

            {revealed >= 4 ? (
              <Panel className="mt-5 p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <MicroLabel className="text-accent">Verdict</MicroLabel>
                  <div className="flex gap-2 no-print">
                    <button type="button" onClick={shareable} className={btn}>
                      Lock to URL
                    </button>
                    <button type="button" onClick={() => window.print()} className={btn}>
                      Print
                    </button>
                  </div>
                </div>
                <p
                  aria-live="polite"
                  className="mt-3 max-w-3xl text-[1rem] leading-relaxed text-foreground/90"
                >
                  {comparison.verdict}
                </p>
              </Panel>
            ) : null}
          </section>

          {revealed >= 2 ? (
            <section aria-labelledby="evidence-h" className="mt-8">
              <h2 id="evidence-h" className="label-micro mb-3">
                03 · Evidence
              </h2>
              <div className="grid min-w-0 gap-5 lg:grid-cols-2">
                <AnswerCard side="A" input={a} result={comparison.a} highlighted={hover === "A"} />
                <AnswerCard side="B" input={b} result={comparison.b} highlighted={hover === "B"} />
              </div>
            </section>
          ) : null}

          {revealed >= 3 ? (
            <Panel className="mt-5 overflow-hidden">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-hairline px-5 py-4">
                <div>
                  <MicroLabel>What changed</MicroLabel>
                  <p className="mt-1.5 max-w-2xl text-[0.8125rem] text-muted-foreground">
                    Each row is re-run with that single field reverted to side A. Open a row for the
                    eliminations, score movement and probe result behind the attribution.
                  </p>
                </div>
                {deltas.length ? (
                  <button
                    type="button"
                    onClick={() => toggleRow(openRow ? openRow : (deltas[0]?.key ?? ""))}
                    className={btn + " no-print"}
                  >
                    {openRow ? "Collapse" : "Open first"}
                  </button>
                ) : null}
              </div>
              {deltas.length ? (
                <div role="table" aria-label="Constraint changes and evidence">
                  <div
                    role="row"
                    className="hidden gap-4 border-b border-hairline px-5 py-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground/60 sm:grid sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,180px)_auto]"
                  >
                    <span role="columnheader">Constraint</span>
                    <span role="columnheader">Side A</span>
                    <span role="columnheader">Side B</span>
                    <span role="columnheader" className="sm:text-right">
                      Probe
                    </span>
                    <span role="columnheader" className="sr-only">
                      Evidence
                    </span>
                  </div>
                  <div className="grid gap-px bg-hairline">
                    {deltas.map((d) => (
                      <DeltaRow
                        key={d.key}
                        d={d}
                        open={openRow === d.key}
                        onToggle={() => toggleRow(d.key)}
                        onHover={setHover}
                        onApply={() => setB((prev) => ({ ...prev, [d.key]: a[d.key] }))}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="px-5 py-5 text-[0.875rem] text-muted-foreground">
                  No constraints differ. Both sides are the same job.
                </p>
              )}
            </Panel>
          ) : null}
        </>
      ) : null}
    </Shell>
  );
}
