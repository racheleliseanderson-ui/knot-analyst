import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/instrument/shell";
import { Bullets, Chip, MicroLabel, Panel, StepHead, Verdict } from "@/components/instrument/primitives";
import { runTroubleshoot, type TroubleshootInput } from "@/engine/troubleshoot";
import { FAILURE_PLAYS, type BreakLocation, type FailureEvent } from "@/data/failure-playbook";
import type { ConnectionJob, DiameterRelation, LineMaterial, RetieDecision } from "@/domain/types";
import {
  CONNECTION_GROUPS,
  CONNECTION_LABELS,
  DIAMETER_LABELS,
  MATERIAL_LABELS,
  RETIE_LABELS,
} from "@/domain/types";

export const Route = createFileRoute("/diagnose")({
  validateSearch: (s: Record<string, unknown>): { event?: string } => ({
    event: typeof s['event'] === "string" ? (s['event'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Diagnose a failed connection | Knot Intelligence" },
      {
        name: "description",
        content:
          "Symptom-first failure diagnosis for fishing connections: break location, material system and connection type narrow the cause, then hand the full context to the decision model.",
      },
      { property: "og:title", content: "Diagnose a failed connection" },
      {
        property: "og:description",
        content:
          "Start from what went wrong. Separate user error, material mismatch and knot geometry — then retie with a reason.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiagnoseMode,
});

const LOCATIONS: { id: BreakLocation; label: string; hint: string }[] = [
  { id: "in-knot", label: "In the knot", hint: "curled or pigtailed end" },
  { id: "at-eye", label: "At the eye", hint: "clean cut at hardware" },
  { id: "at-tag", label: "At the tag", hint: "finish let go" },
  { id: "above-knot", label: "Above the knot", hint: "line damage, not knot" },
  { id: "leader-join", label: "At the join", hint: "braid/leader barrel" },
  { id: "unknown", label: "Unknown", hint: "never recovered the end" },
];

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

const STARTERS: { id: string; title: string; line: string; input: TroubleshootInput }[] = [
  {
    id: "braid-fluoro-pop",
    title: "Braid → fluoro let go at the join",
    line: "Join · braid to fluoro · big diameter gap",
    input: {
      event: "broke-under-load",
      breakLocation: "leader-join",
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "fluoro",
      diameterRelation: "main-much-thinner",
    },
  },
  {
    id: "cold-wind-slip",
    title: "Tag pulled in cold wind",
    line: "Terminal · braid · rushed retie",
    input: {
      event: "slipped-or-pulled",
      breakLocation: "at-tag",
      connection: "line-to-lure",
      mainMaterial: "braid",
    },
  },
  {
    id: "dead-bait",
    title: "Free-swinging bait stopped working",
    line: "Terminal · mono · action killed",
    input: {
      event: "dead-action",
      connection: "line-to-lure",
      mainMaterial: "mono",
    },
  },
  {
    id: "jig-pressure",
    title: "Jig popped off under pressure",
    line: "Terminal · braid to jig eye",
    input: {
      event: "broke-under-load",
      breakLocation: "at-eye",
      connection: "line-to-lure",
      mainMaterial: "braid",
    },
  },
  {
    id: "wont-seat",
    title: "Fluoro will not seat clean",
    line: "Join · stiff fluoro · glazing",
    input: {
      event: "wont-seat",
      breakLocation: "in-knot",
      connection: "leader-to-leader",
      mainMaterial: "fluoro",
      secondaryMaterial: "fluoro",
      diameterRelation: "similar",
    },
  },
  {
    id: "guides",
    title: "Join keeps ticking through guides",
    line: "Join · bulk under cast load",
    input: {
      event: "bulky-guides",
      connection: "braid-to-leader",
      mainMaterial: "braid",
      secondaryMaterial: "mono",
      diameterRelation: "main-much-thinner",
    },
  },
];

const retieTone = (d: RetieDecision) =>
  d === "retie-now" ? "stop" : d === "retie-recommended" || d === "watch" ? "watch" : d === "cosmetic" ? "ok" : "unknown";

function DiagnoseMode() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const seeded = FAILURE_PLAYS.some((p) => p.id === search.event)
    ? ({ event: search.event as FailureEvent } as Partial<TroubleshootInput>)
    : {};
  const [input, setInput] = useState<Partial<TroubleshootInput>>(seeded);
  const [ran, setRan] = useState(false);

  const set = (patch: Partial<TroubleshootInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
    setRan(false);
  };

  const loadStarter = (id: string) => {
    const s = STARTERS.find((x) => x.id === id);
    if (!s) return;
    setInput(s.input);
    setRan(true);
  };

  const result = useMemo(
    () => (ran && input.event ? runTroubleshoot(input as TroubleshootInput) : null),
    [ran, input],
  );

  const isJoin = input.connection ? JOIN_JOBS.includes(input.connection) : false;

  const handoff = () => {
    if (!result) return;
    const s = result.decideSearch ?? {};
    navigate({
      to: "/",
      search: {
        connection: s.connection ?? input.connection,
        main: s.mainMaterial ?? input.mainMaterial,
        secondary: s.secondaryMaterial ?? input.secondaryMaterial,
        diameter: s.diameterRelation ?? input.diameterRelation,
        run: true,
        from: result.title,
      },
    });
  };

  return (
    <Shell>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)] lg:gap-10">
        <div className="space-y-5 lg:sticky lg:top-24 lg:self-start no-print">
          <div>
            <MicroLabel className="text-accent">Mode 02 · Diagnose</MicroLabel>
            <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em]">
              Start from what failed.
              <br />
              <span className="text-muted-foreground">Not from a knot name.</span>
            </h1>
          </div>

          <Panel className="p-5">
            <StepHead index="01" title="Symptom" hint="What actually happened on the water." />
            <div className="grid gap-1.5">
              {FAILURE_PLAYS.map((p) => (
                <Chip key={p.id} tone="signal" active={input.event === p.id} onClick={() => set({ event: p.id as FailureEvent })}>
                  {p.title}
                </Chip>
              ))}
            </div>
          </Panel>

          <Panel className={input.event ? "p-5" : "p-5 opacity-45"}>
            <StepHead
              index="02"
              title="Where it failed"
              hint="Location outranks the knot you intended to tie."
              state={input.event ? "open" : "locked"}
            />
            <div className="flex flex-wrap gap-1.5">
              {LOCATIONS.map((l) => (
                <Chip
                  key={l.id}
                  disabled={!input.event}
                  active={input.breakLocation === l.id}
                  onClick={() => set({ breakLocation: input.breakLocation === l.id ? undefined : l.id })}
                >
                  <span className="block">{l.label}</span>
                  <span className="block text-[0.6875rem] text-muted-foreground">{l.hint}</span>
                </Chip>
              ))}
            </div>
          </Panel>

          <Panel className={input.event ? "p-5" : "p-5 opacity-45"}>
            <StepHead
              index="03"
              title="Connection & materials"
              hint="Refines the cause. Never a library filter."
              state={input.event ? "open" : "locked"}
            />
            <div className="space-y-4">
              <div>
                <MicroLabel className="mb-2">Connection under stress</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {CONNECTION_GROUPS.flatMap((g) => g.jobs).map((j) => (
                    <Chip
                      key={j}
                      disabled={!input.event}
                      active={input.connection === j}
                      onClick={() => set({ connection: input.connection === j ? undefined : j })}
                    >
                      {CONNECTION_LABELS[j]}
                    </Chip>
                  ))}
                </div>
              </div>
              <div>
                <MicroLabel className="mb-2">Main line</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {MATERIALS.map((m) => (
                    <Chip
                      key={m}
                      disabled={!input.event}
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
                    <MicroLabel className="mb-2">Leader</MicroLabel>
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
              <div>
                <MicroLabel className="mb-2">Field notes (optional)</MicroLabel>
                <textarea
                  value={input.notes ?? ""}
                  onChange={(e) => set({ notes: e.target.value })}
                  rows={3}
                  placeholder="Pigtail on the tag, braid felt slick, seated dry in a hurry…"
                  className="w-full resize-none rounded-md border border-input bg-surface-2/40 px-3 py-2 text-[0.875rem] text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-accent/70"
                />
              </div>
            </div>
          </Panel>

          <button
            type="button"
            disabled={!input.event}
            onClick={() => setRan(true)}
            className="w-full rounded-lg border border-accent/60 bg-accent/15 px-4 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-accent/25 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {ran ? "Re-run diagnosis" : "Run diagnosis"}
          </button>
        </div>

        <div className="space-y-6">
          {!result ? (
            <>
              <Panel className="p-6">
                <MicroLabel className="mb-1">Scenario starters</MicroLabel>
                <p className="mb-5 text-[0.875rem] text-muted-foreground">
                  One tap loads a realistic failure and runs the diagnosis.
                </p>
                <div className="grid gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => loadStarter(s.id)}
                      className="bg-card px-5 py-4 text-left transition-colors hover:bg-surface-2"
                    >
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent/80">
                        {s.line}
                      </p>
                      <p className="mt-2 text-[0.9375rem] font-medium tracking-tight">{s.title}</p>
                    </button>
                  ))}
                </div>
              </Panel>
              <Panel className="p-6">
                <MicroLabel className="mb-3">How this reads evidence</MicroLabel>
                <Bullets
                  marker="→"
                  items={[
                    "Break location separates line damage from knot geometry from hardware damage.",
                    "Material system separates user error from a family that was never rated for that line.",
                    "Connection type weights the causes; it does not filter a catalog.",
                    "Anything the model cannot verify is reported as unverified, not as a pass.",
                  ]}
                />
              </Panel>
            </>
          ) : (
            <>
              <Panel className="overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline px-6 py-4">
                  <MicroLabel>Diagnosis card</MicroLabel>
                  <div className="flex items-center gap-2">
                    <Verdict tone={retieTone(result.retieDecision)}>
                      {result.retieDecision.replace(/-/g, " ")}
                    </Verdict>
                    <button
                      onClick={() => window.print()}
                      className="rounded-md border border-hairline px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground no-print"
                    >
                      Print
                    </button>
                  </div>
                </div>

                <div className="px-6 py-6">
                  <h2 className="text-[1.75rem] font-semibold leading-tight tracking-[-0.025em]">
                    {result.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-foreground/85">
                    {result.meaning}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {result.contextChips.map((c, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-hairline bg-surface-2/50 px-3 py-1 text-[0.75rem] text-muted-foreground"
                      >
                        <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground/70">
                          {c.label}
                        </span>{" "}
                        <span className="text-foreground/85">{c.value}</span>
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                    confidence {result.confidence} · {RETIE_LABELS[result.retieDecision]}
                  </p>
                </div>

                <div className="grid gap-px bg-hairline sm:grid-cols-3">
                  <div className="bg-card px-6 py-5">
                    <MicroLabel className="mb-3">Likely causes</MicroLabel>
                    <Bullets items={result.likelyCauses.slice(0, 5)} />
                  </div>
                  <div className="bg-card px-6 py-5">
                    <MicroLabel className="mb-3">Check now</MicroLabel>
                    <Bullets items={result.checks.slice(0, 5)} marker="?" />
                  </div>
                  <div className="bg-card px-6 py-5">
                    <MicroLabel className="mb-3">Retie guidance</MicroLabel>
                    <Bullets items={result.fixes.slice(0, 5)} marker="→" />
                  </div>
                </div>
              </Panel>

              <Panel className="flex flex-wrap items-center justify-between gap-4 p-6 no-print">
                <div className="min-w-[240px] flex-1">
                  <MicroLabel className="mb-1">Next action</MicroLabel>
                  <p className="text-[0.9375rem] leading-relaxed text-foreground/85">
                    {result.decideHint ??
                      "Carry this context into the decision model and rebuild the connection deliberately."}
                  </p>
                </div>
                <button
                  onClick={handoff}
                  className="rounded-lg border border-primary/60 bg-primary/15 px-5 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25"
                >
                  Decide the replacement →
                </button>
              </Panel>

              {result.findings.length ? (
                <Panel className="p-6">
                  <MicroLabel className="mb-4">Evidence trail</MicroLabel>
                  <div className="space-y-4">
                    {result.findings.map((f) => (
                      <div
                        key={f.id}
                        className={
                          f.severity === "stop"
                            ? "border-l-2 border-destructive/60 pl-4"
                            : f.severity === "watch"
                              ? "border-l-2 border-caution/60 pl-4"
                              : "border-l-2 border-hairline pl-4"
                        }
                      >
                        <p className="text-[0.9375rem] font-medium tracking-tight">{f.title}</p>
                        <p className="mt-1 text-[0.8125rem] text-muted-foreground">{f.observation}</p>
                        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-foreground/85">
                          {f.implication}
                        </p>
                        <p className="mt-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-accent">
                          {f.nextAction}
                        </p>
                      </div>
                    ))}
                  </div>
                </Panel>
              ) : (
                <p className="text-[0.8125rem] text-muted-foreground">
                  <Link to="/" className="text-accent underline underline-offset-4">
                    Go to Decide
                  </Link>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}
