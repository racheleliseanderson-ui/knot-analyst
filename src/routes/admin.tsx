import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { Shell } from "@/components/instrument/shell";
import { Chip, MicroLabel, Panel, StepHead } from "@/components/instrument/primitives";
import { useOverlay } from "@/lib/overlay";
import {
  downloadOverlay,
  overlayToJson,
  parseOverlay,
  slugify,
  type CustomConnection,
  type CustomMaterial,
  type CustomScenario,
} from "@/lib/overlay-store";
import type { ChooseInput, ConnectionJob, DiameterRelation, LineMaterial } from "@/domain/types";
import {
  CONNECTION_GROUPS,
  CONNECTION_LABELS,
  DIAMETER_LABELS,
  MATERIAL_LABELS,
} from "@/domain/types";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Data editor — scenarios, materials, connections | Knot Analyst" },
      {
        name: "description",
        content:
          "Author new field scenarios, line materials and connection jobs without touching code. Drafts stay in this browser and export as JSON.",
      },
      { property: "og:title", content: "Knot Analyst — data editor" },
      {
        property: "og:description",
        content: "Add scenarios, materials and connection types without a code change.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminMode,
});

const ALL_JOBS: ConnectionJob[] = CONNECTION_GROUPS.flatMap((g) => g.jobs);
const BASE_MATERIALS: LineMaterial[] = ["mono", "fluoro", "braid", "fly-line", "backing", "wire"];
const DIAMETERS: DiameterRelation[] = [
  "similar",
  "main-thinner",
  "main-much-thinner",
  "main-thicker",
  "extreme-mismatch",
];

const inputCls =
  "w-full rounded-md border border-hairline bg-surface-2/40 px-3 py-2 text-[0.875rem] text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <MicroLabel className="mb-1.5">{label}</MicroLabel>
      {children}
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </label>
  );
}

function Row({ title, sub, onDelete }: { title: string; sub: string; onDelete: () => void }) {
  return (
    <div className="flex items-start justify-between gap-4 border-t border-hairline py-3 first:border-t-0">
      <div className="min-w-0">
        <p className="text-[0.875rem] font-medium tracking-tight">{title}</p>
        <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {sub}
        </p>
      </div>
      <button
        type="button"
        onClick={onDelete}
        className="shrink-0 rounded-md border border-hairline px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
      >
        Remove
      </button>
    </div>
  );
}

/** Case-insensitive substring match across any of the supplied fields. */
function matches(q: string, ...fields: (string | undefined)[]): boolean {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  return fields.some((f) => (f ?? "").toLowerCase().includes(needle));
}

/** Shared filter for the authored lists — long drafts stop being scannable fast. */
function FilterBox({
  value,
  onChange,
  count,
  total,
}: {
  value: string;
  onChange: (v: string) => void;
  count: number;
  total: number;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <MicroLabel>
        Authored · {count}
        {count !== total ? ` of ${total}` : ""}
      </MicroLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Filter"
        aria-label="Filter authored entries"
        className="min-h-9 w-40 rounded-md border border-hairline bg-surface-2/40 px-2.5 text-[0.8125rem] text-foreground outline-none focus:border-primary/60"
      />
    </div>
  );
}

type Tab = "scenarios" | "materials" | "connections" | "transfer";

function AdminMode() {
  const overlay = useOverlay();
  const [tab, setTab] = useState<Tab>("scenarios");

  return (
    <Shell>
      <div className="mb-7">
        <MicroLabel>Mode 04 · Data editor</MicroLabel>
        <h1 className="mt-2 text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em]">
          Add data, not code.
        </h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          Scenarios, lines and jobs you add here show up in Decide right away. Every custom line and
          job has to say which known kind it behaves like — we will not invent a new kind from a
          marketing name. Drafts stay in this browser; export JSON to take them with you.
        </p>
        <p className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
          storage: {overlay.adapterName} · {overlay.ready ? "loaded" : "loading"} ·{" "}
          {overlay.data.scenarios.length} scenarios · {overlay.data.materials.length} materials ·{" "}
          {overlay.data.connections.length} connections
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5 no-print">
        {(
          [
            ["scenarios", "Scenarios"],
            ["materials", "Materials"],
            ["connections", "Connection types"],
            ["transfer", "Import / export"],
          ] as [Tab, string][]
        ).map(([id, label]) => (
          <Chip key={id} tone="signal" active={tab === id} onClick={() => setTab(id)}>
            {label}
          </Chip>
        ))}
      </div>

      {tab === "scenarios" ? <ScenarioEditor /> : null}
      {tab === "materials" ? <MaterialEditor /> : null}
      {tab === "connections" ? <ConnectionEditor /> : null}
      {tab === "transfer" ? <Transfer /> : null}
    </Shell>
  );
}

/* ── Scenarios ───────────────────────────────────────────── */

function ScenarioEditor() {
  const { data, setScenarios } = useOverlay();
  const [title, setTitle] = useState("");
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [blurb, setBlurb] = useState("");
  const [input, setInput] = useState<Partial<ChooseInput>>({});
  const [error, setError] = useState<string | null>(null);

  const set = (patch: Partial<ChooseInput>) => setInput((p) => ({ ...p, ...patch }));
  const toggle = (key: keyof ChooseInput) => set({ [key]: !input[key] } as Partial<ChooseInput>);

  const add = () => {
    if (!title.trim()) return setError("A scenario needs a title.");
    if (!input.connection)
      return setError("A scenario needs a connection job — nothing runs without it.");
    if (!input.mainMaterial)
      return setError(
        "Declare a main material. A scenario that omits it scores a different question.",
      );
    const id = slugify(title);
    if (data.scenarios.some((s) => s.id === id))
      return setError("A scenario with that name already exists.");
    if (blurb.trim().length > 220)
      return setError("Keep the blurb under 220 characters — it is a chip, not a page.");
    const next: CustomScenario = {
      id,
      title: title.trim(),
      blurb: blurb.trim() || "Custom field scenario.",
      tag: tag.trim() || "Custom",
      connectionLine: CONNECTION_LABELS[input.connection],
      likelyPick: "",
      autoRun: true,
      input: input as ChooseInput,
    };
    setScenarios([next, ...data.scenarios]);
    setTitle("");
    setTag("");
    setBlurb("");
    setInput({});
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Panel className="p-5">
        <StepHead index="01" title="New scenario" hint="Appears as a one-tap starter in Decide." />
        <div className="space-y-4">
          <Field label="Title">
            <input
              className={inputCls}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Jetty at dusk · heavy jig"
            />
          </Field>
          <Field label="Chip tag">
            <input
              className={inputCls}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Low light · terminal"
            />
          </Field>
          <Field label="Blurb">
            <textarea
              className={`${inputCls} min-h-[76px] resize-y`}
              value={blurb}
              onChange={(e) => setBlurb(e.target.value)}
              placeholder="What the conditions are doing to the decision."
            />
          </Field>

          <div>
            <MicroLabel className="mb-2">Connection job</MicroLabel>
            <div className="flex flex-wrap gap-1.5">
              {ALL_JOBS.map((j) => (
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

          <div>
            <MicroLabel className="mb-2">Main material</MicroLabel>
            <div className="flex flex-wrap gap-1.5">
              {BASE_MATERIALS.map((m) => (
                <Chip
                  key={m}
                  active={input.mainMaterial === m}
                  onClick={() => set({ mainMaterial: input.mainMaterial === m ? undefined : m })}
                >
                  {MATERIAL_LABELS[m]}
                </Chip>
              ))}
            </div>
          </div>

          <div>
            <MicroLabel className="mb-2">Second material</MicroLabel>
            <div className="flex flex-wrap gap-1.5">
              {BASE_MATERIALS.map((m) => (
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

          <div>
            <MicroLabel className="mb-2">Conditions</MicroLabel>
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
                Free-swing
              </Chip>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <MicroLabel className="mb-2">Retie tempo</MicroLabel>
              <div className="flex flex-wrap gap-1.5">
                {(["frequent", "occasional", "rare"] as const).map((r) => (
                  <Chip
                    key={r}
                    active={input.retieFrequency === r}
                    onClick={() =>
                      set({ retieFrequency: input.retieFrequency === r ? undefined : r })
                    }
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

          {error ? <p className="text-[0.8125rem] text-destructive">{error}</p> : null}

          <button
            type="button"
            onClick={add}
            className="w-full rounded-lg border border-primary/60 bg-primary/15 px-4 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25"
          >
            Add scenario
          </button>
        </div>
      </Panel>

      <Panel className="p-5">
        <FilterBox
          value={q}
          onChange={setQ}
          total={data.scenarios.length}
          count={data.scenarios.filter((s) => matches(q, s.title, s.tag, s.blurb)).length}
        />
        {data.scenarios.length === 0 ? (
          <p className="text-[0.875rem] text-muted-foreground">
            None yet. Built-in scenarios stay in code and are never modified from here.
          </p>
        ) : (
          <div>
            {data.scenarios
              .filter((s) => matches(q, s.title, s.tag, s.blurb))
              .map((s) => (
                <Row
                  key={s.id}
                  title={s.title}
                  sub={`${CONNECTION_LABELS[s.input.connection]} · ${s.tag}`}
                  onDelete={() => setScenarios(data.scenarios.filter((x) => x.id !== s.id))}
                />
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ── Materials ───────────────────────────────────────────── */

function MaterialEditor() {
  const { data, setMaterials } = useOverlay();
  const [label, setLabel] = useState("");
  const [q, setQ] = useState("");
  const [note, setNote] = useState("");
  const [base, setBase] = useState<LineMaterial>("mono");
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    if (!label.trim()) return setError("A material needs a display name.");
    if (label.trim().length < 3)
      return setError("Give it a name you would recognise on the water.");
    const id = slugify(label);
    if (!id) return setError("That name has no usable characters.");
    if (data.materials.some((m) => m.id === id)) return setError("That material already exists.");
    const next: CustomMaterial = {
      id,
      label: label.trim(),
      behavesLike: base,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    setMaterials([...data.materials, next]);
    setLabel("");
    setNote("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Panel className="p-5">
        <StepHead
          index="01"
          title="New material"
          hint="A line you actually fish, tied to the closest known kind."
        />
        <div className="space-y-4">
          <Field label="Display name">
            <input
              className={inputCls}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Hollow-core braid 80 lb"
            />
          </Field>
          <Field
            label="Behaves like"
            hint="Pick the closest known behaviour, not the name on the spool."
          >
            <div className="flex flex-wrap gap-1.5">
              {BASE_MATERIALS.map((m) => (
                <Chip key={m} tone="signal" active={base === m} onClick={() => setBase(m)}>
                  {MATERIAL_LABELS[m]}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="Field note">
            <input
              className={inputCls}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Softer than standard braid; seats slower."
            />
          </Field>
          {error ? <p className="text-[0.8125rem] text-destructive">{error}</p> : null}
          <button
            type="button"
            onClick={add}
            className="w-full rounded-lg border border-primary/60 bg-primary/15 px-4 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25"
          >
            Add material
          </button>
        </div>
      </Panel>

      <Panel className="p-5">
        <FilterBox
          value={q}
          onChange={setQ}
          total={data.materials.length}
          count={data.materials.filter((m) => matches(q, m.label, m.note, m.behavesLike)).length}
        />
        {data.materials.length === 0 ? (
          <p className="text-[0.875rem] text-muted-foreground">
            None yet. Built-in classes are always available in Decide.
          </p>
        ) : (
          <div>
            {data.materials
              .filter((m) => matches(q, m.label, m.note, m.behavesLike))
              .map((m) => (
                <Row
                  key={m.id}
                  title={m.label}
                  sub={`behaves like ${MATERIAL_LABELS[m.behavesLike]}`}
                  onDelete={() => setMaterials(data.materials.filter((x) => x.id !== m.id))}
                />
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ── Connections ─────────────────────────────────────────── */

function ConnectionEditor() {
  const { data, setConnections } = useOverlay();
  const [label, setLabel] = useState("");
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("Custom");
  const [note, setNote] = useState("");
  const [base, setBase] = useState<ConnectionJob>("line-to-hook");
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    if (!label.trim()) return setError("A connection type needs a display name.");
    const id = slugify(label);
    if (!id) return setError("That name has no usable characters.");
    if (data.connections.some((c) => c.id === id))
      return setError("That connection already exists.");
    const next: CustomConnection = {
      id,
      label: label.trim(),
      group: group.trim() || "Custom",
      behavesLike: base,
      ...(note.trim() ? { note: note.trim() } : {}),
    };
    setConnections([...data.connections, next]);
    setLabel("");
    setNote("");
    setError(null);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
      <Panel className="p-5">
        <StepHead
          index="01"
          title="New connection type"
          hint="A job you name yourself, tied to a knot kind we already cover."
        />
        <div className="space-y-4">
          <Field label="Display name">
            <input
              className={inputCls}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Line → downrigger release"
            />
          </Field>
          <Field label="Group heading" hint="Where the chip sits in Decide.">
            <input className={inputCls} value={group} onChange={(e) => setGroup(e.target.value)} />
          </Field>
          <Field
            label="Behaves like"
            hint="Hard constraints come from this job. Pick the one with the same mechanics."
          >
            <div className="flex flex-wrap gap-1.5">
              {ALL_JOBS.map((j) => (
                <Chip key={j} tone="signal" active={base === j} onClick={() => setBase(j)}>
                  {CONNECTION_LABELS[j]}
                </Chip>
              ))}
            </div>
          </Field>
          <Field label="Field note">
            <input
              className={inputCls}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Release clip grips the line — profile matters more than strength."
            />
          </Field>
          {error ? <p className="text-[0.8125rem] text-destructive">{error}</p> : null}
          <button
            type="button"
            onClick={add}
            className="w-full rounded-lg border border-primary/60 bg-primary/15 px-4 py-3 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25"
          >
            Add connection type
          </button>
        </div>
      </Panel>

      <Panel className="p-5">
        <FilterBox
          value={q}
          onChange={setQ}
          total={data.connections.length}
          count={data.connections.filter((c) => matches(q, c.label, c.group, c.note)).length}
        />
        {data.connections.length === 0 ? (
          <p className="text-[0.875rem] text-muted-foreground">None yet.</p>
        ) : (
          <div>
            {data.connections
              .filter((c) => matches(q, c.label, c.group, c.note))
              .map((c) => (
                <Row
                  key={c.id}
                  title={c.label}
                  sub={`${c.group} · behaves like ${CONNECTION_LABELS[c.behavesLike]}`}
                  onDelete={() => setConnections(data.connections.filter((x) => x.id !== c.id))}
                />
              ))}
          </div>
        )}
      </Panel>
    </div>
  );
}

/* ── Import / export ─────────────────────────────────────── */

function Transfer() {
  const { data, replaceAll, reset } = useOverlay();
  const fileRef = useRef<HTMLInputElement>(null);
  const [report, setReport] = useState<string[]>([]);
  const [pending, setPending] = useState<{
    data: ReturnType<typeof parseOverlay>["data"];
    errors: string[];
    diff: string[];
  } | null>(null);
  const json = useMemo(() => overlayToJson(data), [data]);

  /** Dry run first. An import that replaces the draft should never be one click. */
  const ingest = async (file: File) => {
    try {
      const parsed = parseOverlay(JSON.parse(await file.text()));
      const line = (kind: string, incoming: { id: string }[], current: { id: string }[]) => {
        const cur = new Set(current.map((x) => x.id));
        const inc = new Set(incoming.map((x) => x.id));
        const added = incoming.filter((x) => !cur.has(x.id)).length;
        const kept = incoming.filter((x) => cur.has(x.id)).length;
        const dropped = current.filter((x) => !inc.has(x.id)).length;
        return `${kind}: +${added} new · ${kept} overwritten · ${dropped} removed from the current draft`;
      };
      setPending({
        data: parsed.data,
        errors: parsed.errors,
        diff: [
          line("Scenarios", parsed.data.scenarios, data.scenarios),
          line("Materials", parsed.data.materials, data.materials),
          line("Connections", parsed.data.connections, data.connections),
        ],
      });
      setReport([]);
    } catch {
      setPending(null);
      setReport(["That file is not valid overlay JSON. Nothing was changed."]);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel className="p-5">
        <StepHead index="01" title="Upload" hint="Replaces the current draft in this browser." />
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void ingest(f);
            e.target.value = "";
          }}
        />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="rounded-lg border border-primary/60 bg-primary/15 px-4 py-2.5 text-[0.875rem] font-semibold tracking-tight text-foreground transition-all hover:bg-primary/25"
          >
            Choose JSON file
          </button>
          <button
            type="button"
            onClick={() => downloadOverlay(data)}
            className="rounded-lg border border-hairline px-4 py-2.5 text-[0.875rem] tracking-tight text-muted-foreground transition-colors hover:text-foreground"
          >
            Download draft
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              setReport(["Draft cleared. Built-in data is untouched."]);
            }}
            className="rounded-lg border border-hairline px-4 py-2.5 text-[0.875rem] tracking-tight text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
          >
            Clear draft
          </button>
        </div>
        {pending ? (
          <div className="mt-4 rounded-lg border border-caution/50 bg-caution/8 p-4">
            <MicroLabel className="mb-2">Dry run — nothing applied yet</MicroLabel>
            <ul className="space-y-1">
              {pending.diff.map((d) => (
                <li key={d} className="text-[0.8125rem] leading-relaxed text-foreground">
                  {d}
                </li>
              ))}
              {pending.errors.map((e, i) => (
                <li key={i} className="text-[0.8125rem] leading-relaxed text-destructive">
                  Rejected — {e}
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  replaceAll(pending.data);
                  setReport([
                    `Applied ${pending.data.scenarios.length} scenarios, ${pending.data.materials.length} materials, ${pending.data.connections.length} connections.`,
                  ]);
                  setPending(null);
                }}
                className="ki-press min-h-11 rounded-lg border border-primary/60 bg-primary/15 px-4 text-[0.875rem] font-semibold tracking-tight text-foreground hover:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Apply import
              </button>
              <button
                type="button"
                onClick={() => {
                  setPending(null);
                  setReport(["Import discarded. The draft is unchanged."]);
                }}
                className="ki-press min-h-11 rounded-lg border border-hairline px-4 text-[0.875rem] tracking-tight text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Discard
              </button>
            </div>
          </div>
        ) : null}
        {report.length ? (
          <ul className="mt-4 space-y-1.5">
            {report.map((r, i) => (
              <li key={i} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {r}
              </li>
            ))}
          </ul>
        ) : null}
        <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted-foreground">
          Malformed entries are dropped and reported rather than guessed at. An unknown material
          class or connection job is a rejection, not a default.
        </p>
      </Panel>

      <Panel className="p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <MicroLabel>Current draft — JSON</MicroLabel>
          <button
            type="button"
            onClick={() => void navigator.clipboard?.writeText(json)}
            className="rounded-md border border-hairline px-2.5 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Copy
          </button>
        </div>
        <pre className="max-h-[520px] overflow-auto rounded-md border border-hairline bg-surface-2/40 p-3 font-mono text-[0.6875rem] leading-relaxed text-muted-foreground">
          {json}
        </pre>
      </Panel>
    </div>
  );
}
