import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import heroImg from "@/assets/line-tension.jpg";
import { Shell } from "@/components/instrument/shell";
import { VenuePicker } from "@/components/instrument/venue-picker";
import { useT } from "@/i18n";
import { useDomain } from "@/domain/context";
import { Bullets, Chip, Meter, MicroLabel, Panel, StepHead, Verdict } from "@/components/instrument/primitives";
import { runChooser } from "@/engine/chooser";
import { buildDecisionCard, counterfactuals, detectTradeoffs } from "@/engine/advisor";
import { generateDecisionPacket } from "@/lib/decision-packet";
import { useConnectionGroups, useMaterialOptions, useScenarios } from "@/lib/overlay";
import type { ChooseInput, ConnectionJob, DiameterRelation, Difficulty, LineMaterial } from "@/domain/types";
import {
  DIAMETER_LABELS,
  DIMENSION_LABELS,
} from "@/domain/types";
import { resolveMaterial, type MaterialSpec } from "@/domain/material";
import { FISHING_MATERIAL_PRESETS } from "@/domains/fishing/materials";

/**
 * Optional deeper material axes. Only rendered for categories that actually
 * have a disclosure config (braid, wire, backing), and every row offers
 * "Not sure", which reproduces today's flat behaviour exactly.
 */
function MaterialDetail({
  category,
  spec,
  onChange,
}: {
  category: LineMaterial | undefined;
  spec: MaterialSpec | undefined;
  onChange: (next: MaterialSpec | undefined) => void;
}) {
  const preset = category ? FISHING_MATERIAL_PRESETS[category] : undefined;
  if (!preset?.disclosure) return null;

  const current = spec ?? preset.spec;

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-hairline/80 bg-surface-2/25 p-3 [&_button]:min-h-11 sm:[&_button]:min-h-0">
      {preset.disclosure.map((row) => (
        <div key={row.axis} role="group" aria-label={row.label}>
          <MicroLabel className="mb-2">{row.label} · optional</MicroLabel>
          <div className="flex flex-wrap gap-1.5">
            {row.options.map((o) => {
              const active = current[row.axis] === o.id;
              return (
                <Chip
                  key={o.id}
                  active={active}
                  onClick={() =>
                    onChange(
                      resolveMaterial(category, FISHING_MATERIAL_PRESETS, {
                        ...(row.axis === "construction"
                          ? { construction: (active ? "unspecified" : o.id) as MaterialSpec["construction"] }
                          : { construction: current.construction }),
                        ...(row.axis === "treatment"
                          ? { treatment: (active ? "unspecified" : o.id) as MaterialSpec["treatment"] }
                          : { treatment: current.treatment }),
                      }),
                    )
                  }
                >
                  {o.label}
                </Chip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

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
const safeDecode = (v: string) => {
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
};
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
  const t = useT();
  const domain = useDomain();
  const venues = domain.venues ?? [];
  const [venueId, setVenueId] = useState<string | undefined>(undefined);
  const scenarios = useScenarios();
  const connectionGroups = useConnectionGroups();
  const materialOptions = useMaterialOptions();

  const seeded: Partial<ChooseInput> | null = useMemo(() => {
    const sc = scenarios.find((s) => s.id === search.scenario);
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
  }, [search, scenarios]);

  const [input, setInput] = useState<Partial<ChooseInput>>(seeded ?? {});
  const [ran, setRan] = useState<boolean>(Boolean(seeded && search.run !== undefined));
  const [showEliminated, setShowEliminated] = useState(false);
  const [showMatrix, setShowMatrix] = useState(false);
  const [packetState, setPacketState] = useState<"idle" | "working" | "error">("idle");
  /** Chip keys, so custom materials/connections stay visibly selected */
  const [sel, setSel] = useState<{ connection?: string; main?: string; secondary?: string }>({});

  useEffect(() => {
    if (seeded) {
      setInput(seeded);
      setRan(true);
    }
  }, [seeded]);

  /** A discipline change invalidates the declared job — never carry it over. */
  const firstDomain = useRef(domain.id);
  useEffect(() => {
    if (firstDomain.current === domain.id) return;
    firstDomain.current = domain.id;
    setInput({});
    setSel({});
    setVenueId(undefined);
    setRan(false);
  }, [domain.id]);

  const set = (patch: Partial<ChooseInput>, keys?: typeof sel) => {
    setInput((prev) => ({ ...prev, ...patch }));
    if (keys) setSel((prev) => ({ ...prev, ...keys }));
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
      {domain.id !== "fishing" ? (
        <div className="mb-6 rounded-lg border border-caution/40 bg-caution/8 px-4 py-3 no-print">
          <MicroLabel className="text-caution">{t("boating.title")}</MicroLabel>
          <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-foreground/85">
            {t("boating.body")}
          </p>
        </div>
      ) : null}
      {search.from ? (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-accent/40 bg-accent/8 px-4 py-3 no-print">
          <MicroLabel className="text-accent">Carried from diagnosis</MicroLabel>
          <p className="text-[0.8125rem] text-foreground/85">
            {safeDecode(search.from)} — context preloaded below. Adjust anything that was
            wrong before you trust the answer.
          </p>
        </div>
      ) : null}

      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
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
              {connectionGroups.map((g) => (
                <div key={g.title}>
                  <MicroLabel className="mb-2">{g.title}</MicroLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {g.jobs.map((j) => (
                      <Chip
                        key={j.key}
                        tone="signal"
                        active={
                          sel.connection
                            ? sel.connection === j.key
                            : input.connection === j.base && !j.custom
                        }
                        onClick={() => set({ connection: j.base }, { connection: j.key })}
                      >
                        {j.label}
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
                  {materialOptions.map((m) => (
                    <Chip
                      key={m.key}
                      disabled={!input.connection}
                      active={
                        sel.main ? sel.main === m.key : input.mainMaterial === m.base && !m.custom
                      }
                      onClick={() => {
                        const on = sel.main ? sel.main === m.key : input.mainMaterial === m.base;
                        set(
                          {
                            mainMaterial: on ? undefined : m.base,
                            mainSpec: on
                              ? undefined
                              : resolveMaterial(m.base, FISHING_MATERIAL_PRESETS),
                          },
                          { main: on ? undefined : m.key },
                        );
                      }}
                    >
                      {m.label}
                    </Chip>
                  ))}
                </div>
                <MaterialDetail
                  category={input.mainMaterial}
                  spec={input.mainSpec}
                  onChange={(next) => set({ mainSpec: next })}
                />
              </div>
              {isJoin ? (
                <>
                  <div>
                    <MicroLabel className="mb-2">Leader / second line</MicroLabel>
                    <div className="flex flex-wrap gap-1.5">
                      {materialOptions.map((m) => (
                        <Chip
                          key={m.key}
                          active={
                            sel.secondary
                              ? sel.secondary === m.key
                              : input.secondaryMaterial === m.base && !m.custom
                          }
                          onClick={() => {
                            const on = sel.secondary
                              ? sel.secondary === m.key
                              : input.secondaryMaterial === m.base;
                            set(
                              {
                                secondaryMaterial: on ? undefined : m.base,
                                secondarySpec: on
                                  ? undefined
                                  : resolveMaterial(m.base, FISHING_MATERIAL_PRESETS),
                              },
                              { secondary: on ? undefined : m.key },
                            );
                          }}
                        >
                          {m.label}
                        </Chip>
                      ))}
                    </div>
                    <MaterialDetail
                      category={input.secondaryMaterial}
                      spec={input.secondarySpec}
                      onChange={(next) => set({ secondarySpec: next })}
                    />
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

          {venues.length ? (
          <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
            <StepHead
              index="04"
              title={t("decide.venue")}
              hint={t("decide.venueHint")}
              state={input.connection ? "open" : "locked"}
            />
            <VenuePicker
              venues={venues}
              activeId={venueId}
              disabled={!input.connection}
              onPick={(v) => {
                setVenueId(v?.id);
                if (v) set(v.conditions);
              }}
            />
          </Panel>
          ) : null}

          <button
            type="button"
            disabled={!input.connection}
            onClick={() => setRan(true)}
            className="ki-press min-h-12 w-full rounded-lg border border-primary/60 bg-primary/15 px-4 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ran ? t("decide.rerun") : t("decide.run")}
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
                      <button
                        onClick={async () => {
                          setPacketState("working");
                          try {
                            await generateDecisionPacket({
                              result,
                              card,
                              tradeoffs,
                              counterfactuals: cfs,
                            });
                            setPacketState("idle");
                          } catch (err) {
                            console.error(err);
                            setPacketState("error");
                          }
                        }}
                        disabled={packetState === "working"}
                        className="rounded-md border border-primary/60 bg-primary/15 px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-primary/25 disabled:opacity-50"
                      >
                        {packetState === "working"
                          ? "Building…"
                          : packetState === "error"
                            ? "Retry PDF"
                            : "PDF packet"}
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
                    {result.termination ? (
                      <div className="border-b border-hairline bg-caution/8 px-6 py-4">
                        <div className="flex flex-wrap items-center gap-3">
                          <Verdict tone="watch">{result.termination.method}</Verdict>
                          <p className="text-[0.9375rem] font-semibold tracking-tight">
                            {result.termination.headline}
                          </p>
                        </div>
                        <p className="mt-2 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {result.termination.detail}
                        </p>
                      </div>
                    ) : null}
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
                        {result.ranked[0] ? (
                          <Link
                            to="/tie/$knotId"
                            params={{ knotId: result.ranked[0].knot.id }}
                            className="mt-4 inline-flex items-center gap-2 rounded-md border border-accent/50 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10 no-print"
                          >
                            Tie it — step player + diagram
                          </Link>
                        ) : null}
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
                      <p
                        suppressHydrationWarning
                        className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70"
                      >
                        {result.eliminated.length} candidates eliminated on hard constraints ·{" "}
                        engine {result.engineVersion} ·{" "}
                        {result.generatedAt.slice(0, 19).replace("T", " ")}Z
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
                          {idx === 0 ? (o.vsNext ?? o.whyBest[0]) : (o.whyBest[0] ?? o.butNotes[0] ?? o.vsNext)}
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

              {result.ranked.length > 1 ? (
                <Panel className="p-6">
                  <button
                    onClick={() => setShowMatrix((v) => !v)}
                    className="flex w-full items-center justify-between gap-4 text-left no-print"
                  >
                    <MicroLabel>Dimension matrix — surviving options</MicroLabel>
                    <span className="font-mono text-xs text-muted-foreground">
                      {showMatrix ? "collapse" : "expand"}
                    </span>
                  </button>
                  {showMatrix ? (
                    <div className="mt-5 -mx-2 overflow-x-auto">
                      <table className="w-full min-w-[560px] border-collapse text-left">
                        <thead>
                          <tr>
                            <th className="px-2 pb-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                              Dimension
                            </th>
                            {result.ranked.slice(0, 4).map((o) => (
                              <th
                                key={o.knot.id}
                                className="px-2 pb-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground"
                              >
                                {o.knot.name}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {(result.ranked[0]?.dimensionScores ?? [])
                            .slice()
                            .sort((a, b) => b.weight - a.weight)
                            .map((d) => (
                              <tr key={d.dimension} className="border-t border-hairline">
                                <td className="px-2 py-2 text-[0.8125rem] text-muted-foreground">
                                  {DIMENSION_LABELS[d.dimension]}
                                </td>
                                {result.ranked.slice(0, 4).map((o) => {
                                  const s =
                                    o.dimensionScores.find((x) => x.dimension === d.dimension)
                                      ?.score ?? 0;
                                  return (
                                    <td key={o.knot.id} className="px-2 py-2">
                                      <span
                                        className={
                                          s >= 78
                                            ? "font-mono text-[0.8125rem] tabular-nums text-affirm"
                                            : s >= 58
                                              ? "font-mono text-[0.8125rem] tabular-nums text-caution"
                                              : "font-mono text-[0.8125rem] tabular-nums text-destructive"
                                        }
                                      >
                                        {s}
                                      </span>
                                    </td>
                                  );
                                })}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      Every scored dimension, every surviving option, side by side. Weighted order —
                      the top rows are the ones actually deciding this call.
                    </p>
                  )}
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
  const scenarios = useScenarios();
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
          {scenarios.map((s) => (
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
