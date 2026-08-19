import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Shell } from "@/components/instrument/shell";
import {
  Bullets,
  Chip,
  MicroLabel,
  Panel,
  StepHead,
  Verdict,
} from "@/components/instrument/primitives";
import {
  runTroubleshoot,
  type TroubleshootInput,
  type TroubleshootResult,
} from "@/engine/troubleshoot";
import { runChooser } from "@/engine/chooser";
import { KnotDiagram, diagramStepNote } from "@/components/instrument/diagram";
import { diagnosisToDecide, encodeInput } from "@/lib/handoff";
import { tackleHandoffFromDiagnosis } from "@/lib/tackle-handoff";
import { knotsForDomain, getKnot } from "@/data/catalog";
import {
  END_LOOK_LABELS,
  SYMPTOM_GROUP_LABELS,
  playsForDomain,
  type BreakLocation,
  type EndLook,
  type FailureEvent,
  type SymptomGroup,
} from "@/data/failure-playbook";
import { startersForDomain } from "@/data/diagnose-starters";
import { useDomain } from "@/domain/context";
import { useConnectionGroups, useMaterialOptions } from "@/lib/overlay";
import type { DiameterRelation, RetieDecision } from "@/domain/types";
import { CATEGORY_LABELS, DIAMETER_LABELS, RETIE_LABELS } from "@/domain/types";
import { isJoinJob } from "@/domain/connection-preset";

export const Route = createFileRoute("/diagnose")({
  validateSearch: (s: Record<string, unknown>): { event?: string; knot?: string } => ({
    event: typeof s["event"] === "string" ? (s["event"] as string) : undefined,
    knot: typeof s["knot"] === "string" ? (s["knot"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Diagnose a failed knot | Knot Analyst" },
      {
        name: "description",
        content:
          "Start from what broke. Where it let go and what the end looks like tell you more than the knot name. Fishing and boat knots stay apart.",
      },
      { property: "og:title", content: "Diagnose a failed knot" },
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

const FISHING_LOCATIONS: { id: BreakLocation; label: string; hint: string }[] = [
  { id: "in-knot", label: "In the knot", hint: "curled or pigtailed end" },
  { id: "at-eye", label: "At the eye", hint: "clean cut at hardware" },
  { id: "at-tag", label: "At the tag", hint: "finish let go" },
  { id: "above-knot", label: "Above the knot", hint: "line damage, not knot" },
  { id: "leader-join", label: "At the join", hint: "braid/leader barrel" },
  { id: "at-guides", label: "At the guides", hint: "tick, cut, or crack" },
  { id: "at-shank", label: "On the shank", hint: "snell walked" },
  { id: "at-loop", label: "At the loop", hint: "collapse or girth" },
  { id: "at-arbor", label: "At the arbor", hint: "spool dumped" },
  { id: "in-leader", label: "In the leader", hint: "teeth or nick" },
  { id: "at-tiptop", label: "At the tip-top", hint: "helicopter wrap" },
  { id: "unknown", label: "Unknown", hint: "never recovered the end" },
];

const BOATING_LOCATIONS: { id: BreakLocation; label: string; hint: string }[] = [
  { id: "in-knot", label: "In the hitch / bend", hint: "structure failed" },
  { id: "at-tag", label: "At the tail", hint: "finish walked" },
  { id: "at-cleat", label: "At the cleat", hint: "jam or dump" },
  { id: "at-fairlead", label: "At the fairlead", hint: "chafe" },
  { id: "at-loop", label: "At the eye", hint: "capsize" },
  { id: "at-winch", label: "At the winch", hint: "riding turn" },
  { id: "above-knot", label: "On the standing part", hint: "chafe, not the hitch" },
  { id: "unknown", label: "Unknown", hint: "never recovered" },
];

const END_LOOKS = Object.entries(END_LOOK_LABELS) as [EndLook, { label: string; hint: string }][];

const GROUP_ORDER: SymptomGroup[] = ["forensic", "load", "geometry", "system", "rope"];

const DIAMETERS: DiameterRelation[] = [
  "similar",
  "main-thinner",
  "main-much-thinner",
  "main-thicker",
  "extreme-mismatch",
];

const retieTone = (d: RetieDecision) =>
  d === "retie-now"
    ? "stop"
    : d === "retie-recommended" || d === "watch"
      ? "watch"
      : d === "cosmetic"
        ? "ok"
        : "unknown";

function DiagnoseMode() {
  const navigate = useNavigate();
  const domain = useDomain();
  const plays = useMemo(() => playsForDomain(domain.id), [domain.id]);
  const starters = useMemo(() => startersForDomain(domain.id), [domain.id]);
  const locations = domain.id === "boating" ? BOATING_LOCATIONS : FISHING_LOCATIONS;
  const connectionGroups = useConnectionGroups();
  const materials = useMaterialOptions();
  const search = Route.useSearch();
  const seeded: Partial<TroubleshootInput> = {
    ...(plays.some((p) => p.id === search.event) ? { event: search.event as FailureEvent } : {}),
    ...(search.knot && getKnot(search.knot) ? { knotId: search.knot } : {}),
  };
  const [input, setInput] = useState<Partial<TroubleshootInput>>(seeded);
  const [ran, setRan] = useState(false);

  const grouped = useMemo(() => {
    const map = new Map<SymptomGroup, typeof plays>();
    for (const p of plays) {
      const list = map.get(p.group) ?? [];
      list.push(p);
      map.set(p.group, list);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      group: g,
      label: SYMPTOM_GROUP_LABELS[g],
      plays: map.get(g)!,
    }));
  }, [plays]);

  const set = (patch: Partial<TroubleshootInput>) => {
    setInput((prev) => ({ ...prev, ...patch }));
    setRan(false);
  };

  const loadStarter = (id: string) => {
    const s = starters.find((x) => x.id === id);
    if (!s) return;
    setInput(s.input);
    setRan(true);
  };

  const result = useMemo(
    () => (ran && input.event ? runTroubleshoot(input as TroubleshootInput) : null),
    [ran, input],
  );

  const groupedStarters = useMemo(() => {
    const map = new Map<SymptomGroup, typeof starters>();
    for (const s of starters) {
      const play = plays.find((p) => p.id === s.input.event);
      const g = play?.group ?? "system";
      const list = map.get(g) ?? [];
      list.push(s);
      map.set(g, list);
    }
    return GROUP_ORDER.filter((g) => map.has(g)).map((g) => ({
      group: g,
      label: SYMPTOM_GROUP_LABELS[g],
      starters: map.get(g)!,
    }));
  }, [starters, plays]);

  const isJoin = isJoinJob(input.connection);

  const namedKnots = useMemo(() => {
    const pool = knotsForDomain(domain.id);
    const matched = input.connection
      ? pool.filter(
          (k) =>
            k.contract.connectionFamilies.includes(input.connection!) ||
            k.bestFor.includes(input.connection!),
        )
      : pool;
    const base = matched.length ? matched : pool;
    if (input.knotId && !base.some((k) => k.id === input.knotId)) {
      const extra = getKnot(input.knotId);
      if (extra) return [extra, ...base];
    }
    return base;
  }, [domain.id, input.connection, input.knotId]);

  const namedByCategory = useMemo(() => {
    const map = new Map<string, typeof namedKnots>();
    for (const k of namedKnots) {
      const list = map.get(k.category) ?? [];
      list.push(k);
      map.set(k.category, list);
    }
    return [...map.entries()];
  }, [namedKnots]);

  const handoff = () => {
    if (!result) return;
    const h = diagnosisToDecide(input, result);
    navigate({
      to: "/",
      search: {
        connection: h.input.connection,
        main: h.input.mainMaterial,
        secondary: h.input.secondaryMaterial,
        diameter: h.input.diameterRelation,
        guides: h.input.mustPassGuides,
        cold: h.input.coldHands,
        wind: h.input.windy,
        lowlight: h.input.lowLight,
        retie: h.input.retieFrequency,
        prof: h.input.proficiency,
        eye: h.input.hardwareEyeSmall,
        run: true,
        from: result.title,
        why: h.carried.map((c) => c.label).join(" · ") || undefined,
      },
    });
  };

  /** Compare the setup that failed against the same job with the evidence applied. */
  const compareFix = () => {
    if (!result) return;
    const h = diagnosisToDecide(input, result);
    const asFailed = {
      connection: h.input.connection,
      mainMaterial: h.input.mainMaterial,
      secondaryMaterial: h.input.secondaryMaterial,
      diameterRelation: h.input.diameterRelation,
    };
    navigate({
      to: "/compare",
      search: { a: encodeInput(asFailed), b: encodeInput(h.input) },
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
            {search.knot && getKnot(search.knot) ? (
              <p className="mt-3 max-w-xl text-[0.8125rem] leading-relaxed text-muted-foreground">
                Named {getKnot(search.knot)!.name} so we can overlay its failure modes. Pick the
                symptom first — the recovered end still outranks the name.
              </p>
            ) : null}
          </div>

          <Panel className="p-5">
            <StepHead index="01" title="Symptom" hint="What actually happened on the water." />
            <div className="space-y-4">
              {grouped.map((g) => (
                <div key={g.group}>
                  <MicroLabel className="mb-2">{g.label}</MicroLabel>
                  <div className="grid gap-1.5">
                    {g.plays.map((p) => (
                      <Chip
                        key={p.id}
                        tone="signal"
                        active={input.event === p.id}
                        onClick={() => set({ event: p.id })}
                      >
                        {p.title}
                      </Chip>
                    ))}
                  </div>
                </div>
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
              {locations.map((l) => (
                <Chip
                  key={l.id}
                  disabled={!input.event}
                  active={input.breakLocation === l.id}
                  onClick={() =>
                    set({ breakLocation: input.breakLocation === l.id ? undefined : l.id })
                  }
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
              title="What the end looks like"
              hint="Forensic. Optional — but it outranks the knot you meant to tie."
              state={input.event ? "open" : "locked"}
            />
            <div className="flex flex-wrap gap-1.5">
              {END_LOOKS.map(([id, meta]) => (
                <Chip
                  key={id}
                  disabled={!input.event}
                  active={input.endLook === id}
                  onClick={() => set({ endLook: input.endLook === id ? undefined : id })}
                >
                  <span className="block">{meta.label}</span>
                  <span className="block text-[0.6875rem] text-muted-foreground">{meta.hint}</span>
                </Chip>
              ))}
            </div>
          </Panel>

          <Panel className={input.event ? "p-5" : "p-5 opacity-45"}>
            <StepHead
              index="04"
              title="Connection & materials"
              hint="Refines the cause. Never a library filter."
              state={input.event ? "open" : "locked"}
            />
            <div className="space-y-4">
              <div>
                <MicroLabel className="mb-2">Connection under stress</MicroLabel>
                <div className="space-y-3">
                  {connectionGroups.map((g) => (
                    <div key={g.title}>
                      <p className="mb-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                        {g.title}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {g.jobs.map((j) => (
                          <Chip
                            key={j.key}
                            disabled={!input.event}
                            active={input.connection === j.base}
                            onClick={() =>
                              set({ connection: input.connection === j.base ? undefined : j.base })
                            }
                          >
                            {j.label}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <MicroLabel className="mb-2">Main {domain.terms.line}</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  {materials.map((m) => (
                    <Chip
                      key={m.key}
                      disabled={!input.event}
                      active={input.mainMaterial === m.base}
                      onClick={() =>
                        set({ mainMaterial: input.mainMaterial === m.base ? undefined : m.base })
                      }
                    >
                      {m.label}
                    </Chip>
                  ))}
                </div>
              </div>
              {input.connection ? (
                isJoin ? (
                  <>
                    <div className="rounded-md border border-primary/30 bg-primary/8 px-3 py-2">
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary">
                        Two-sided job
                      </p>
                      <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                        Declare the leader / second line so the diagnosis can separate join failure
                        from main-line failure.
                      </p>
                    </div>
                    <div>
                      <MicroLabel className="mb-2">{domain.terms.secondary} · required</MicroLabel>
                      <div className="flex flex-wrap gap-1.5">
                        {materials.map((m) => (
                          <Chip
                            key={m.key}
                            active={input.secondaryMaterial === m.base}
                            onClick={() =>
                              set({
                                secondaryMaterial:
                                  input.secondaryMaterial === m.base ? undefined : m.base,
                              })
                            }
                          >
                            {m.label}
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
                              set({
                                diameterRelation: input.diameterRelation === d ? undefined : d,
                              })
                            }
                          >
                            {DIAMETER_LABELS[d]}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-md border border-hairline bg-surface-2/30 px-3 py-2">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                      Single-side job
                    </p>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                      No second line for this connection. Pick a line-to-line join if the failure
                      was at a leader splice or tippet.
                    </p>
                  </div>
                )
              ) : null}
              <div>
                <MicroLabel className="mb-2">Field conditions (optional)</MicroLabel>
                <div className="flex flex-wrap gap-1.5">
                  <Chip
                    disabled={!input.event}
                    active={!!input.coldHands}
                    onClick={() => set({ coldHands: input.coldHands ? undefined : true })}
                  >
                    Cold / wet hands
                  </Chip>
                  <Chip
                    disabled={!input.event}
                    active={!!input.windy}
                    onClick={() => set({ windy: input.windy ? undefined : true })}
                  >
                    Wind
                  </Chip>
                  <Chip
                    disabled={!input.event}
                    active={!!input.lowLight}
                    onClick={() => set({ lowLight: input.lowLight ? undefined : true })}
                  >
                    Low light
                  </Chip>
                  <Chip
                    disabled={!input.event}
                    active={!!input.surge}
                    onClick={() => set({ surge: input.surge ? undefined : true })}
                  >
                    {domain.id === "boating" ? "Tide / surge" : "Surf / current"}
                  </Chip>
                </div>
              </div>
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
              <div>
                <MicroLabel className="mb-2">Knot you tied (optional)</MicroLabel>
                <p className="mb-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                  Names a family so we can overlay its failure modes. The recovered end still
                  outranks this name. Not a library filter.
                </p>
                <select
                  value={input.knotId ?? ""}
                  disabled={!input.event}
                  onChange={(e) => set({ knotId: e.target.value || undefined })}
                  aria-label="Knot you tied"
                  className="min-h-11 w-full rounded-md border border-input bg-surface-2/40 px-3 text-[0.875rem] text-foreground outline-none focus-visible:border-accent/70 disabled:opacity-40"
                >
                  <option value="">Not named — start from the failure</option>
                  {namedByCategory.map(([cat, knots]) => (
                    <optgroup
                      key={cat}
                      label={CATEGORY_LABELS[cat as keyof typeof CATEGORY_LABELS] ?? cat}
                    >
                      {knots.map((k) => (
                        <option key={k.id} value={k.id}>
                          {k.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
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
                <div className="space-y-5">
                  {groupedStarters.map((g) => (
                    <div key={g.group}>
                      <MicroLabel className="mb-2">{g.label}</MicroLabel>
                      <div className="grid gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-2">
                        {g.starters.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => loadStarter(s.id)}
                            className="bg-card px-5 py-4 text-left transition-colors hover:bg-surface-2"
                          >
                            <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent/80">
                              {s.line}
                            </p>
                            <p className="mt-2 text-[0.9375rem] font-medium tracking-tight">
                              {s.title}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
              <Panel className="p-6">
                <MicroLabel className="mb-3">How this reads evidence</MicroLabel>
                <Bullets
                  marker="→"
                  items={[
                    "The recovered end outranks the knot you intended — pigtail is slip, clean cut is usually not.",
                    "Break location separates line damage from knot geometry from hardware damage.",
                    "A tip wrap, riding turn, bite-off, or shock snap is often not a knot-family failure.",
                    "Material system separates user error from a family that was never rated for that line.",
                    "The job weights the causes; it does not hide a knot.",
                    "If we cannot check it, we say so — we do not call it a pass.",
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

                {result.relatedKnot ? (
                  <div className="overflow-hidden border-t border-hairline bg-surface-2/40">
                    <KnotDiagram
                      kind={result.relatedKnot.diagramKind}
                      title={`${result.relatedKnot.name} — finished structure`}
                      className="aspect-[400/180] w-full sm:aspect-[400/150]"
                    />
                    <div className="border-t border-hairline px-6 py-3">
                      <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
                        The knot you named · {result.relatedKnot.name}
                      </p>
                      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {diagramStepNote(result.relatedKnot.diagramKind)}
                      </p>
                      {result.knotCheck ? (
                        <p className="mt-2 text-[0.8125rem] leading-relaxed text-foreground/85">
                          Fingerprint: {result.knotCheck.retieDecision.replace(/-/g, " ")}. The
                          recovered end still outranks this name.
                        </p>
                      ) : null}
                      {result.failsWhen?.length ? (
                        <div className="mt-3">
                          <MicroLabel className="mb-2">Fails when</MicroLabel>
                          <Bullets items={result.failsWhen.slice(0, 4)} marker="!" />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-px bg-hairline sm:grid-cols-3">
                  <div className="bg-card px-6 py-5">
                    <MicroLabel className="mb-3">Likely causes</MicroLabel>
                    <Bullets items={result.likelyCauses.slice(0, 6)} />
                  </div>
                  <div className="bg-card px-6 py-5">
                    <MicroLabel className="mb-3">Check now</MicroLabel>
                    <Bullets items={result.checks.slice(0, 6)} marker="?" />
                  </div>
                  <div className="bg-card px-6 py-5">
                    <MicroLabel className="mb-3">Retie guidance</MicroLabel>
                    <Bullets items={result.fixes.slice(0, 6)} marker="→" />
                  </div>
                </div>
              </Panel>

              <Panel className="p-6 no-print">
                <MicroLabel className="mb-1">Next action</MicroLabel>
                <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-foreground/85">
                  {result.decideHint ??
                    "Carry this context into the decision model and rebuild the connection deliberately."}
                </p>
                {(() => {
                  const h = diagnosisToDecide(input, result);
                  return (
                    <>
                      {h.carried.length ? (
                        <div className="mt-4">
                          <MicroLabel className="mb-2">Constraints this evidence sets</MicroLabel>
                          <ul className="space-y-1.5">
                            {h.carried.map((c) => (
                              <li key={c.label} className="text-[0.8125rem] leading-relaxed">
                                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-accent">
                                  {c.label}
                                </span>{" "}
                                <span className="text-muted-foreground">{c.why}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      {h.rulesOut.length ? (
                        <div className="mt-4">
                          <MicroLabel className="mb-2">What the failure rules out</MicroLabel>
                          <Bullets items={h.rulesOut} marker="!" />
                        </div>
                      ) : null}
                    </>
                  );
                })()}
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={handoff}
                    className="ki-press min-h-11 rounded-lg border border-primary/60 bg-primary/15 px-5 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25"
                  >
                    Decide the replacement →
                  </button>
                  <button
                    onClick={compareFix}
                    className="ki-press min-h-11 rounded-lg border border-hairline px-5 py-3 text-[0.875rem] font-medium tracking-tight text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
                  >
                    Compare failed setup vs corrected
                  </button>
                </div>
                {(() => {
                  const tackle = tackleHandoffFromDiagnosis(input, result);
                  if (!tackle.connectionIsWeakestLink) return null;
                  return (
                    <div className="mt-4">
                      <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {tackle.reason}
                      </p>
                      <a
                        href={tackle.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-block text-[0.875rem] text-accent underline underline-offset-4"
                      >
                        Check this as the weakest link in Tackle
                      </a>
                    </div>
                  );
                })()}
              </Panel>

              <ReplacementCandidates result={result} />

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
                        <p className="mt-1 text-[0.8125rem] text-muted-foreground">
                          {f.observation}
                        </p>
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

/**
 * Visual next-knots after a diagnosis. The failure still does not pick a knot;
 * these are what Decide would rank if the same job were declared.
 */
function ReplacementCandidates({ result }: { result: TroubleshootResult }) {
  const job = result.decideSearch?.connection;
  const ranked = useMemo(() => {
    if (!job) return [];
    const r = runChooser({
      connection: job,
      mainMaterial: result.decideSearch?.mainMaterial,
      secondaryMaterial: result.decideSearch?.secondaryMaterial,
      diameterRelation: result.decideSearch?.diameterRelation,
    });
    return r.ranked.slice(0, 3);
  }, [job, result.decideSearch]);

  if (!job || ranked.length === 0) return null;

  return (
    <Panel className="p-6">
      <MicroLabel className="mb-1">What Decide would look at next</MicroLabel>
      <p className="mb-4 max-w-2xl text-[0.8125rem] leading-relaxed text-muted-foreground">
        The diagnosis did not pick these. Same job and materials, scored — so you can see the
        geometry before you rebuild.
      </p>
      <ul className="grid gap-3 sm:grid-cols-3">
        {ranked.map((o, idx) => (
          <li key={o.knot.id}>
            <article className="panel overflow-hidden">
              <KnotDiagram
                kind={o.knot.diagramKind}
                compact
                title={`${o.knot.name} — finished structure`}
                className="aspect-[400/180] w-full bg-surface-2/40"
              />
              <div className="border-t border-hairline p-3">
                <p className="font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {String(idx + 1).padStart(2, "0")} · {o.fieldFitPercent}% field fit
                </p>
                <p className="mt-1 text-[0.9375rem] font-semibold tracking-tight">{o.knot.name}</p>
                <p className="mt-1 line-clamp-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                  {diagramStepNote(o.knot.diagramKind)}
                </p>
                <div className="mt-2 flex flex-wrap gap-3">
                  <Link
                    to="/diagram/$knotId"
                    params={{ knotId: o.knot.id }}
                    className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    Diagrams
                  </Link>
                  <Link
                    to="/tie/$knotId"
                    params={{ knotId: o.knot.id }}
                    className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent hover:text-foreground"
                  >
                    Tie it
                  </Link>
                </div>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
