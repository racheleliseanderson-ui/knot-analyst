import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import heroImg from "@/assets/line-tension.jpg";
import { Shell } from "@/components/instrument/shell";
import { Bullets, Chip, Meter, MicroLabel, Panel, StepHead, Verdict } from "@/components/instrument/primitives";
import { runChooser } from "@/engine/chooser";
import { buildDecisionCard, counterfactuals, detectTradeoffs } from "@/engine/advisor";
import { FIELD_SCENARIOS } from "@/data/scenarios";
import type { ChooseInput, ConnectionJob, DiameterRelation, Difficulty, LineMaterial } from "@/domain/types";
import {
  CONNECTION_GROUPS,
  CONNECTION_LABELS,
  DIAMETER_LABELS,
  DIMENSION_LABELS,
  MATERIAL_LABELS,
} from "@/domain/types";

type Search = {
  connection?: ConnectionJob;
  main?: LineMaterial;
  secondary?: LineMaterial;
  diameter?: DiameterRelation;
  guides?: boolean;
  wind?: boolean;
  cold?: boolean;
  lowlight?: boolean;
  retie?: "frequent" | "occasional" | "rare";
  prof?: Difficulty | "any";
  eye?: boolean;
  swing?: boolean;
  scenario?: string;
  run?: boolean;
  from?: string;
};

const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);
const bool = (v: unknown) => (v === true || v === "true" || v === "1" ? true : undefined);

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    connection: str(s['connection']) as ConnectionJob | undefined,
    main: str(s['main']) as LineMaterial | undefined,
    secondary: str(s['secondary']) as LineMaterial | undefined,
    diameter: str(s['diameter']) as DiameterRelation | undefined,
    guides: bool(s['guides']),
    wind: bool(s['wind']),
    cold: bool(s['cold']),
    lowlight: bool(s['lowlight']),
    retie: str(s['retie']) as Search["retie"],
    prof: str(s['prof']) as Search["prof"],
    eye: bool(s['eye']),
    swing: bool(s['swing']),
    scenario: str(s['scenario']),
    run: bool(s['run']),
    from: str(s['from']),
  }),
  head: () => ({
    meta: [
      { title: "Knot Intelligence — Decide the connection | Hook the Horizon" },
      {
        name: "description",
        content:
          "A mechanical decision instrument for fishing connections. State the job, the materials and the conditions; invalid knots are eliminated before anything scores.",
      },
      { property: "og:title", content: "Knot Intelligence — Decide the connection" },
      {
        property: "og:description",
        content:
          "Constraint-first knot decisions: field fit, trade-offs, and retie guidance for real conditions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DecideMode,
});

const MATERIALS: LineMaterial[] = ["mono", "fluoro", "braid", "fly-line", "backing", "wire"];
const DIAMETERS: DiameterRelation[] = [
  "similar",
  "main-thinner",
  "main-much-thinner",
  "main-thicker",
  "extreme-mismatch",
];
const JOIN_JOBS: ConnectionJob[] = [
  "braid-to-leader",
  "leader-to-leader",
  "leader-to-tippet",
  "double-line-to-leader",
  "fly-line-to-leader",
];

function DecideMode() {
  const search = Route.useSearch();
  const navigate = useNavigate();

  const seeded: Partial<ChooseInput> | null = useMemo(() => {
    const sc = FIELD_SCENARIOS.find((s) => s.id === search.scenario);
    if (sc) return sc.input;
    if (!search.connection) return null;
    return {
      connection: search.connection,
      ...(search.main ? { mainMaterial: search.main } : {}),
      ...(search.secondary ? { secondaryMaterial: search.secondary } : {}),
      ...(search.diameter ? { diameterRelation: search.diameter } : {}),
      ...(search.guides ? { mustPassGuides: true } : {}),
      ...(search.wind ? { windy: true } : {}),
      ...(search.cold ? { coldHands: true } : {}),
      ...(search.lowlight ? { lowLight: true } : {}),
      ...(search.retie ? { retieFrequency: search.retie } : {}),
      ...(search.prof ? { proficiency: search.prof } : {}),
      ...(search.eye ? { hardwareEyeSmall: true } : {}),
      ...(search.swing ? { freeSwing: true } : {}),
    };
  }, [search]);

  const [input, setInput] = useState<Partial<ChooseInput>>(seeded ?? {});
  const [ran, setRan] = useState<boolean>(Boolean(seeded && search.run !== undefined));
  const [showEliminated, setShowEliminated] = useState(false);

  useEffect(() => {
    if (seeded) {
      setInput(seeded);
      setRan(true);
    }
  }, [seeded]);

  const set = (patch: Partial<ChooseInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
    setRan(false);
  };
  const toggle = (key: keyof ChooseInput) =>
    set({ [key]: !input[key] } as Partial<ChooseInput>);

  const result = useMemo(
    () => (ran && input.connection ? runChooser(input as ChooseInput) : null),
    [ran, input],
  );
  const card = result ? buildDecisionCard(result) : null;
  const tradeoffs = result ? detectTradeoffs(result) : [];
  const cfs = result ? counterfactuals(result) : [];
  const isJoin = input.connection ? JOIN_JOBS.includes(input.connection) : false;

  return (
    <Shell>
      {search.from ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-accent/8 px-4 py-3 no-print">
          <MicroLabel className="text-accent">Carried from diagnosis</MicroLabel>
          <p className="text-[0.8125rem] text-foreground/85">
            {decodeURIComponent(search.from)} — context preloaded below. Adjust anything that was
            wrong before you trust the answer.
          </p>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
        {/* ── INSTRUMENT ─────────────────────────────── */}
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start no-print">
          <div>
            <MicroLabel>Mode 01 · Decide</MicroLabel>
            <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em]">
              State the job.
              <br />
              <span className="text-muted-foreground">The model states the constraint.</span>
            </h1>
          </div>

          <Panel className="p-5">
            <StepHead index="01" title="Connection" hint="What is physically being joined." />
            <div className="space-y-4">
              {CONNECTION_GROUPS.map((g) => (
                <div key={g.title}>
                  <MicroLabel className="mb-2">{g.title}</MicroLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {g.jobs.map((j) => (
                      <Chip
                        key={j}
                        tone="signal"
                        active={input.connection === j}
                        onClick={() => set({ connection: j })}
                      >
                        {CONNECTION_LABELS[j]}
                      </Chip>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
            <StepHead
              index="02"
              title="Material system"
              hint="Materials decide what is even permitted."
              state={input.connection ? "open" : "locked"}
            />
            <div className="space-y-4">
              <div>
                <MicroLabel className="mb-2">Main line</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {MATERIALS.map((m) => (
                    <Chip
                      key={m}
                      disabled={!input.connection}
                      active={input.mainMaterial === m}
                      onClick={() => set({ mainMaterial: input.mainMaterial === m ? undefined : m })}
                    >
                      {MATERIAL_LABELS[m]}
                    </Chip>
                  ))}
                </div>
              </div>
              {isJoin ? (
                <>
                  <div>
                    <MicroLabel className="mb-2">Leader / second line</MicroLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {MATERIALS.map((m) => (
                        <Chip
                          key={m}
                          active={input.secondaryMaterial === m}
                          onClick={() =>
                            set({ secondaryMaterial: input.secondaryMaterial === m ? undefined : m })
                          }
                        >
                          {MATERIAL_LABELS[m]}
                        </Chip>
                      ))}
                    </div>
                  </div>
                  <div>
                    <MicroLabel className="mb-2">Diameter relationship</MicroLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {DIAMETERS.map((d) => (
                        <Chip
                          key={d}
                          active={input.diameterRelation === d}
                          onClick={() =>
                            set({ diameterRelation: input.diameterRelation === d ? undefined : d })
                          }
                        >
                          {DIAMETER_LABELS[d]}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </Panel>

          <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
            <StepHead
              index="03"
              title="Field conditions"
              hint="Only declared conditions carry weight."
              state={input.connection ? "open" : "locked"}
            />
            <div className="flex flex-wrap gap-1.5">
              <Chip active={input.mustPassGuides} onClick={() => toggle("mustPassGuides")}>
                Must pass guides
              </Chip>
              <Chip active={input.windy} onClick={() => toggle("windy")}>
                Wind
              </Chip>
              <Chip active={input.coldHands} onClick={() => toggle("coldHands")}>
                Cold / wet hands
              </Chip>
              <Chip active={input.lowLight} onClick={() => toggle("lowLight")}>
                Low light
              </Chip>
              <Chip active={input.hardwareEyeSmall} onClick={() => toggle("hardwareEyeSmall")}>
                Small eye
              </Chip>
              <Chip active={input.freeSwing} onClick={() => toggle("freeSwing")}>
                Free-swing action
              </Chip>
              <Chip active={input.needsUntie} onClick={() => toggle("needsUntie")}>
                Must untie later
              </Chip>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <MicroLabel className="mb-2">Retie tempo</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {(["frequent", "occasional", "rare"] as const).map((r) => (
                    <Chip
                      key={r}
                      active={input.retieFrequency === r}
                      onClick={() => set({ retieFrequency: input.retieFrequency === r ? undefined : r })}
                    >
                      {r}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <MicroLabel className="mb-2">Hands</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {(["beginner", "intermediate", "advanced"] as const).map((p) => (
                    <Chip
                      key={p}
                      active={input.proficiency === p}
                      onClick={() => set({ proficiency: input.proficiency === p ? undefined : p })}
                    >
                      {p}
                    </Chip>
                  ))}
                </div>
              </div>
            </div>
          </Panel>

          <button
            type="button"
            disabled={!input.connection}
            onClick={() => setRan(true)}
            className="w-full rounded-lg border border-primary/60 bg-primary/15 px-4 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ran ? "Re-run model" : "Run mechanical model"}
          </button>
          {!input.connection ? (
            <p className="text-xs text-muted-foreground">
              Nothing scores until a connection is declared. That is deliberate.
            </p>
          ) : null}
        </div>

        {/* ── OUTPUT ─────────────────────────────────── */}
        <div className="space-y-6">
          {!result ? <EmptyDecide onPick={(id) => navigate({ to: "/", search: { scenario: id, run: true } })} /> : null}

          {result && card ? (
            <>
              <Panel className="overflow-hidden">
                <div className="border-b border-hairline px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <MicroLabel>Knot decision card</MicroLabel>
                    <div className="flex items-center gap-2 no-print">
                      <Verdict
                        tone={
                          card.status === "no-valid-option"
                            ? "stop"
                            : card.status === "constrained"
                              ? "watch"
                              : "ok"
                        }
                      >
                        {card.status === "no-valid-option"
                          ? "Fail closed"
                          : card.status === "constrained"
                            ? "Constrained fit"
                            : "Recommended"}
                      </Verdict>
                      <button
                        onClick={() => window.print()}
                        className="rounded-md border border-hairline px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </div>

                {card.status === "no-valid-option" ? (
                  <div className="px-6 py-8">
                    <h2 className="text-xl font-semibold tracking-tight">No valid connection</h2>
                    <p className="mt-2 max-w-xl text-[0.875rem] leading-relaxed text-muted-foreground">
                      {result.plainSummary}
                    </p>
                    <div className="mt-5">
                      <Bullets items={card.watchFor} marker="!" />
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-6 px-6 py-6 sm:grid-cols-[minmax(0,1fr)_150px]">
                      <div className="min-w-0">
                        <h2 className="text-[2rem] font-semibold leading-none tracking-[-0.03em]">
                          {card.knotName}
                        </h2>
                        <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                          {card.jobLine} · {card.systemLine}
                        </p>
                        <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                          {card.conditionLine}
                        </p>
                      </div>
                      <div className="sm:text-right">
                        <div className="font-mono text-[2.5rem] leading-none tabular-nums text-primary">
                          {card.fieldFit}
                          <span className="text-lg text-muted-foreground">%</span>
                        </div>
                        <MicroLabel className="mt-1">field fit</MicroLabel>
                        <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                          confidence {card.confidence}
                        </p>
                      </div>
                    </div>

                    <div className="grid gap-px bg-hairline sm:grid-cols-2">
                      <div className="bg-card px-6 py-5">
                        <MicroLabel className="mb-3">Why this one</MicroLabel>
                        <Bullets items={card.reasons} />
                      </div>
                      <div className="bg-card px-6 py-5">
                        <MicroLabel className="mb-3">Retie notes</MicroLabel>
                        <Bullets items={card.retieNotes} marker="→" />
                      </div>
                      {card.watchFor.length ? (
                        <div className="bg-card px-6 py-5">
                          <MicroLabel className="mb-3">Watch for</MicroLabel>
                          <Bullets items={card.watchFor} marker="!" />
                        </div>
                      ) : null}
                      {card.runnerUp ? (
                        <div className="bg-card px-6 py-5">
                          <MicroLabel className="mb-3">Fallback</MicroLabel>
                          <p className="text-[0.875rem] font-medium">
                            {card.runnerUp.name}{" "}
                            <span className="font-mono text-xs text-muted-foreground">
                              {card.runnerUp.fieldFit}%
                            </span>
                          </p>
                          <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                            {card.runnerUp.when}
                          </p>
                        </div>
                      ) : null}
                    </div>
                    <div className="border-t border-hairline px-6 py-3">
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                        {result.eliminated.length} candidates eliminated on hard constraints ·{" "}
                        engine {result.engineVersion} ·{" "}
                        {new Date(result.generatedAt).toLocaleString()}
                      </p>
                    </div>
                  </>
                )}
              </Panel>

              {tradeoffs.length ? (
                <Panel className="p-6">
                  <MicroLabel className="mb-4">Conflicting constraints</MicroLabel>
                  <div className="space-y-5">
                    {tradeoffs.map((t) => (
                      <div key={t.id} className="border-l-2 border-caution/60 pl-4">
                        <p className="text-[0.9375rem] font-medium tracking-tight">{t.axis}</p>
                        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{t.tension}</p>
                        <p className="mt-2 text-[0.875rem] leading-relaxed text-foreground/85">
                          {t.detail}
                        </p>
                        {t.alternative ? (
                          <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-accent">
                            Trade down to {t.alternative.name} — {t.alternative.gain}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Panel>
              ) : null}

              {result.ranked.length > 1 ? (
                <Panel className="p-6">
                  <MicroLabel className="mb-4">Surviving options</MicroLabel>
                  <div className="space-y-5">
                    {result.ranked.slice(0, 5).map((o, idx) => (
                      <div key={o.knot.id}>
                        <div className="flex items-baseline justify-between gap-4">
                          <p className="text-[0.9375rem] font-medium tracking-tight">
                            <span className="mr-2 font-mono text-[0.6875rem] text-muted-foreground">
                              {String(idx + 1).padStart(2, "0")}
                            </span>
                            {o.knot.name}
                          </p>
                          <span className="font-mono text-xs tabular-nums text-muted-foreground">
                            {o.fieldFitPercent}%
                          </span>
                        </div>
                        <div className="mt-2">
                          <Meter value={o.fieldFitPercent} />
                        </div>
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {o.vsNext ?? o.whyBest[0]}
                        </p>
                        {idx === 0 ? (
                          <div className="mt-3 grid gap-2 sm:grid-cols-2">
                            {o.dimensionScores
                              .slice()
                              .sort((a, b) => b.weight * b.score - a.weight * a.score)
                              .slice(0, 4)
                              .map((d) => (
                                <Meter
                                  key={d.dimension}
                                  value={d.score}
                                  label={DIMENSION_LABELS[d.dimension]}
                                />
                              ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </Panel>
              ) : null}

              {cfs.length ? (
                <Panel className="p-6">
                  <MicroLabel className="mb-4">What would change this</MicroLabel>
                  <div className="divide-y divide-hairline">
                    {cfs.map((c) => (
                      <div key={c.id} className="flex flex-wrap gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0">
                        <p className="min-w-[240px] flex-1 text-[0.875rem] text-foreground/85">
                          {c.question}
                        </p>
                        <p
                          className={
                            c.verdict === "changes"
                              ? "flex-1 text-[0.875rem] text-primary"
                              : c.verdict === "no-valid-option"
                                ? "flex-1 text-[0.875rem] text-destructive"
                                : "flex-1 text-[0.875rem] text-muted-foreground"
                          }
                        >
                          {c.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>
              ) : null}

              {result.eliminated.length ? (
                <Panel className="p-6 no-print">
                  <button
                    onClick={() => setShowEliminated((v) => !v)}
                    className="flex w-full items-center justify-between gap-4 text-left"
                  >
                    <MicroLabel>
                      Eliminated on hard constraints — {result.eliminated.length}
                    </MicroLabel>
                    <span className="font-mono text-xs text-muted-foreground">
                      {showEliminated ? "hide" : "show"}
                    </span>
                  </button>
                  {showEliminated ? (
                    <div className="mt-4 space-y-3">
                      {result.eliminated.map((e) => (
                        <div key={e.knotId} className="border-l border-destructive/40 pl-4">
                          <p className="text-[0.875rem] text-muted-foreground line-through decoration-destructive/50">
                            {e.knotName}
                          </p>
                          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground/80">
                            {e.reasons[0]}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </Panel>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </Shell>
  );
}

function EmptyDecide({ onPick }: { onPick: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-hairline">
        <img
          src={heroImg}
          alt="Braid-to-leader connection under tension at first light"
          width={1600}
          height={1008}
          className="h-[260px] w-full object-cover sm:h-[340px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/10" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <div className="rule-etch mb-4 w-24" />
          <p className="max-w-lg text-[1.125rem] leading-snug tracking-tight text-foreground sm:text-[1.375rem]">
            Every connection is a compromise between what holds, what you can build in the
            conditions you are actually standing in, and how often you will rebuild it.
          </p>
        </div>
      </div>

      <Panel className="p-6">
        <MicroLabel className="mb-1">Scenario starters</MicroLabel>
        <p className="mb-5 text-[0.875rem] text-muted-foreground">
          One tap loads a realistic setup and runs the model.
        </p>
        <div className="grid gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-2">
          {FIELD_SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => onPick(s.id)}
              className="group bg-card px-5 py-4 text-left transition-colors hover:bg-surface-2"
            >
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary/80">
                {s.tag}
              </p>
              <p className="mt-2 text-[0.9375rem] font-medium tracking-tight">{s.title}</p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {s.blurb}
              </p>
            </button>
          ))}
        </div>
      </Panel>

      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
        Already lost a fish?{" "}
        <Link to="/diagnose" className="text-accent underline underline-offset-4">
          Start from the failure instead
        </Link>{" "}
        — the diagnosis carries into this decision with full context.
      </p>
    </div>
  );
}
