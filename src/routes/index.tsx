import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Fragment, useMemo, useState, useEffect, useRef } from "react";
import heroImg from "@/assets/line-tension.jpg";
import { Shell } from "@/components/instrument/shell";
import { VenuePicker } from "@/components/instrument/venue-picker";
import { RegionPicker } from "@/components/instrument/region-picker";
import { activeRegion } from "@/domain/region";
import { DecideStepper, type DecideStep } from "@/components/instrument/decide-stepper";
import { useT } from "@/i18n";
import { useDomain } from "@/domain/context";
import {
  Bullets,
  Chip,
  Meter,
  MicroLabel,
  Panel,
  StepHead,
  Verdict,
} from "@/components/instrument/primitives";
import { runChooser } from "@/engine/chooser";
import { knotsForDomain } from "@/data/catalog";
import { buildDecisionCard, counterfactuals, detectTradeoffs } from "@/engine/advisor";
import { generateDecisionPacket, type PacketVariant } from "@/lib/decision-packet";
import { PresetBar } from "@/components/instrument/preset-bar";
import { KnotDiagram, diagramStepNote } from "@/components/instrument/diagram";
import { useConnectionGroups, useMaterialOptions, useScenarios } from "@/lib/overlay";
import { encodeInput } from "@/lib/handoff";
import { cn } from "@/lib/utils";
import type {
  ChooseInput,
  ConnectionJob,
  DiameterRelation,
  Difficulty,
  LineMaterial,
} from "@/domain/types";
import { DIAMETER_LABELS, DIMENSION_LABELS } from "@/domain/types";
import { resolveMaterial, type MaterialPreset, type MaterialSpec } from "@/domain/material";
import { FISHING_MATERIAL_PRESETS } from "@/domains/fishing/materials";
import { dualWriteFromConnection, isJoinJob } from "@/domain/connection-preset";
import { mergeVenueConditions, resolveLegacyVenue } from "@/domain/venue";
import { parseMm, relationFromDiameters } from "@/domain/diameter";
import { PRODUCT_META_DESCRIPTION, PRODUCT_META_TITLE } from "@/domain/brand";

function DiameterMmFields({
  mainMm,
  secondaryMm,
  onApply,
}: {
  mainMm?: number;
  secondaryMm?: number;
  onApply: (
    main: number | undefined,
    secondary: number | undefined,
    relation?: DiameterRelation,
  ) => void;
}) {
  const [mainDraft, setMainDraft] = useState(mainMm != null ? String(mainMm) : "");
  const [secDraft, setSecDraft] = useState(secondaryMm != null ? String(secondaryMm) : "");

  useEffect(() => {
    setMainDraft(mainMm != null ? String(mainMm) : "");
  }, [mainMm]);
  useEffect(() => {
    setSecDraft(secondaryMm != null ? String(secondaryMm) : "");
  }, [secondaryMm]);

  const push = (mainRaw: string, secRaw: string) => {
    const main = parseMm(mainRaw);
    const sec = parseMm(secRaw);
    const relation = main != null && sec != null ? relationFromDiameters(main, sec) : undefined;
    onApply(main, sec, relation);
  };

  return (
    <div className="mt-3 grid gap-3 sm:grid-cols-2">
      <label className="block">
        <MicroLabel className="mb-1.5">Main Ø mm · optional</MicroLabel>
        <input
          type="text"
          inputMode="decimal"
          placeholder="e.g. 0.18"
          value={mainDraft}
          onChange={(e) => {
            setMainDraft(e.target.value);
            push(e.target.value, secDraft);
          }}
          className="min-h-11 w-full rounded-md border border-hairline bg-card px-3 py-2 font-mono text-[0.8125rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
        />
      </label>
      <label className="block">
        <MicroLabel className="mb-1.5">Second Ø mm · optional</MicroLabel>
        <input
          type="text"
          inputMode="decimal"
          placeholder="e.g. 0.43"
          value={secDraft}
          onChange={(e) => {
            setSecDraft(e.target.value);
            push(mainDraft, e.target.value);
          }}
          className="min-h-11 w-full rounded-md border border-hairline bg-card px-3 py-2 font-mono text-[0.8125rem] text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
        />
      </label>
    </div>
  );
}

/**
 * Optional deeper material axes. Only rendered for categories that actually
 * have a disclosure config (braid, wire, backing), and every row offers
 * "Not sure", which reproduces today's flat behaviour exactly.
 */
function MaterialDetail({
  category,
  spec,
  onChange,
  presets,
}: {
  category: LineMaterial | undefined;
  spec: MaterialSpec | undefined;
  onChange: (next: MaterialSpec | undefined) => void;
  presets: Record<string, MaterialPreset>;
}) {
  const preset = category ? presets[category] : undefined;
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
                  onClick={() => {
                    const nextVal = active ? "unspecified" : o.id;
                    onChange(
                      resolveMaterial(category, presets, {
                        construction: current.construction,
                        treatment: current.treatment,
                        fiber: current.fiber,
                        [row.axis]: nextVal,
                      }),
                    );
                  }}
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
  why?: string;
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
    connection: str(s["connection"]) as ConnectionJob | undefined,
    main: str(s["main"]) as LineMaterial | undefined,
    secondary: str(s["secondary"]) as LineMaterial | undefined,
    diameter: str(s["diameter"]) as DiameterRelation | undefined,
    guides: bool(s["guides"]),
    wind: bool(s["wind"]),
    cold: bool(s["cold"]),
    lowlight: bool(s["lowlight"]),
    retie: str(s["retie"]) as Search["retie"],
    prof: str(s["prof"]) as Search["prof"],
    eye: bool(s["eye"]),
    swing: bool(s["swing"]),
    scenario: str(s["scenario"]),
    run: bool(s["run"]),
    from: str(s["from"]),
    why: str(s["why"]),
  }),
  head: () => ({
    meta: [
      { title: PRODUCT_META_TITLE },
      {
        name: "description",
        content: PRODUCT_META_DESCRIPTION,
      },
      { property: "og:title", content: "Knot Analyst — Decide the connection" },
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
function DecideMode() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const t = useT();
  const domain = useDomain();
  const materialPresets = domain.materialAxes ?? FISHING_MATERIAL_PRESETS;
  const venues = domain.venues ?? [];
  const platforms = domain.platforms ?? [];
  const regions = domain.regions ?? [];
  const [venueId, setVenueId] = useState<string | undefined>(undefined);
  const [platformId, setPlatformId] = useState<string | undefined>(undefined);
  const [regionBroadId, setRegionBroadId] = useState<string | undefined>(undefined);
  const [regionFineId, setRegionFineId] = useState<string | undefined>(undefined);
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
  const [packetKind, setPacketKind] = useState<PacketVariant | null>(null);
  /** Which surviving option is active on the decision card (0 = recommended). */
  const [altPick, setAltPick] = useState(0);
  /** Expand optional instrument panels (mm measure, fiber detail stays progressive). */
  const [showAdvanced, setShowAdvanced] = useState(false);
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
    setPlatformId(undefined);
    setRegionBroadId(undefined);
    setRegionFineId(undefined);
    setRan(false);
  }, [domain.id]);

  const set = (patch: Partial<ChooseInput>, keys?: typeof sel) => {
    setInput((prev) => ({ ...prev, ...patch }));
    if (keys) setSel((prev) => ({ ...prev, ...keys }));
    setRan(false);
    setAltPick(0);
  };
  const toggle = (key: keyof ChooseInput) => set({ [key]: !input[key] } as Partial<ChooseInput>);

  /** Soft-load merged waterbody + platform conditions (editable chips still win after). */
  const applyVenueLayers = (
    nextWaterbodyId: string | undefined,
    nextPlatformId: string | undefined,
  ) => {
    const wb = venues.find((v) => v.id === nextWaterbodyId);
    const pl = platforms.find((v) => v.id === nextPlatformId);
    const patch = mergeVenueConditions(wb, pl);
    setVenueId(nextWaterbodyId);
    setPlatformId(nextPlatformId);
    if (Object.keys(patch).length) set(patch);
    else setRan(false);
  };

  /** Soft-load region condition prior (editable chips still win after). */
  const applyRegion = (nextBroad?: string, nextFine?: string) => {
    // Drop fine if it no longer belongs to the broad parent
    let fine = nextFine;
    if (fine && nextBroad) {
      const ok = regions.some((r) => r.id === fine && r.parentId === nextBroad);
      if (!ok) fine = undefined;
    }
    if (!nextBroad) fine = undefined;
    setRegionBroadId(nextBroad);
    setRegionFineId(fine);
    const reg = activeRegion(regions, nextBroad, fine);
    if (reg && Object.keys(reg.conditions).length) set(reg.conditions);
    else setRan(false);
  };

  const selectedRegion = activeRegion(regions, regionBroadId, regionFineId);

  const result = useMemo(
    () =>
      ran && input.connection ? runChooser(input as ChooseInput, knotsForDomain(domain.id)) : null,
    [ran, input, domain.id],
  );
  const card = result ? buildDecisionCard(result) : null;
  const tradeoffs = result ? detectTradeoffs(result) : [];
  const cfs = result ? counterfactuals(result) : [];
  const isJoin = isJoinJob(input.connection);
  const ranked = result?.ranked ?? [];
  const safeAlt = Math.min(altPick, Math.max(0, ranked.length - 1));
  const activeOption = ranked[safeAlt] ?? ranked[0];

  /**
   * The same four panels drive both layouts: desktop stacks them in the
   * sticky column, phone walks them one screen at a time. One definition, so
   * the two layouts can never drift apart or ask different questions.
   */
  const steps: DecideStep[] = [
    {
      id: "connection",
      label: "The job",
      ready: true,
      node: (
        <Panel className="p-5">
          <StepHead index="01" title="The job" hint="What is physically being joined." />
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
                      onClick={() => {
                        const dual = dualWriteFromConnection(j.base);
                        const patch: Partial<ChooseInput> = {
                          connection: j.base,
                          structuralJob: dual.structuralJob,
                          mainRole: dual.mainRole,
                          secondaryRole: dual.secondaryRole,
                        };
                        const selPatch: { connection?: string; main?: string; secondary?: string } =
                          {
                            connection: j.key,
                          };
                        // Soft material hints from the convenience label — only when unset.
                        if (dual.mainMaterialHint && !input.mainMaterial) {
                          patch.mainMaterial = dual.mainMaterialHint;
                          patch.mainSpec = resolveMaterial(dual.mainMaterialHint, materialPresets, {
                            role: dual.mainRole,
                          });
                          selPatch.main = dual.mainMaterialHint;
                        }
                        if (dual.isJoin) {
                          if (dual.secondaryMaterialHint && !input.secondaryMaterial) {
                            patch.secondaryMaterial = dual.secondaryMaterialHint;
                            patch.secondarySpec = resolveMaterial(
                              dual.secondaryMaterialHint,
                              materialPresets,
                              {
                                ...(dual.secondaryRole ? { role: dual.secondaryRole } : {}),
                              },
                            );
                            selPatch.secondary = dual.secondaryMaterialHint;
                          }
                        } else {
                          // Terminal / single-side jobs: second line is not part of the job.
                          patch.secondaryMaterial = undefined;
                          patch.secondarySpec = undefined;
                          patch.secondaryRole = undefined;
                          patch.diameterRelation = undefined;
                          patch.mainDiameterMm = undefined;
                          patch.secondaryDiameterMm = undefined;
                          selPatch.secondary = undefined;
                        }
                        set(patch, selPatch);
                      }}
                    >
                      {j.label}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ),
    },
    {
      id: "material",
      label: "Material",
      ready: Boolean(input.connection),
      node: (
        <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
          <StepHead
            index="02"
            title="Line and leader"
            hint="The line decides what is even allowed."
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
                            : resolveMaterial(m.base, materialPresets, {
                                ...(input.mainRole ? { role: input.mainRole } : {}),
                              }),
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
                presets={materialPresets}
                onChange={(next) => set({ mainSpec: next })}
              />
            </div>
            {input.connection ? (
              isJoin ? (
                <>
                  <div className="rounded-md border border-primary/30 bg-primary/8 px-3 py-2">
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary">
                      Two-sided job
                    </p>
                    <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                      Both sides matter for joins. Declare the leader / second line so the model can
                      score diameter mismatch and material pairs.
                    </p>
                  </div>
                  <div>
                    <MicroLabel className="mb-2">Leader / second line · required</MicroLabel>
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
                                  : resolveMaterial(m.base, materialPresets, {
                                      ...(input.secondaryRole ? { role: input.secondaryRole } : {}),
                                    }),
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
                      presets={materialPresets}
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
                            set({
                              diameterRelation: input.diameterRelation === d ? undefined : d,
                              mainDiameterMm: undefined,
                              secondaryDiameterMm: undefined,
                            })
                          }
                        >
                          {DIAMETER_LABELS[d]}
                        </Chip>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced((v) => !v)}
                      className="ki-press mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                    >
                      {showAdvanced ? "Hide measured Ø mm" : "Optional · enter measured Ø mm"}
                    </button>
                    {showAdvanced ? (
                      <>
                        <DiameterMmFields
                          mainMm={input.mainDiameterMm}
                          secondaryMm={input.secondaryDiameterMm}
                          onApply={(main, secondary, relation) =>
                            set({
                              mainDiameterMm: main,
                              secondaryDiameterMm: secondary,
                              ...(relation ? { diameterRelation: relation } : {}),
                            })
                          }
                        />
                        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                          Prefer measured diameters over manufacturer pound-test. When both sides
                          are entered, the relational band updates automatically.
                        </p>
                      </>
                    ) : null}
                  </div>
                </>
              ) : (
                <div className="rounded-md border border-hairline bg-surface-2/30 px-3 py-2">
                  <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                    Single-side job
                  </p>
                  <p className="mt-1 text-[0.75rem] leading-relaxed text-muted-foreground">
                    This connection only needs a main line — no leader / second line for this job.
                    Switch to a line-to-line join to declare both sides.
                  </p>
                </div>
              )
            ) : null}
          </div>
        </Panel>
      ),
    },
    {
      id: "conditions",
      label: "Conditions",
      ready: Boolean(input.connection),
      node: (
        <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
          <StepHead
            index="03"
            title="On the water"
            hint="Only the conditions you tap count."
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
        </Panel>
      ),
    },
    ...(regions.length
      ? [
          {
            id: "region",
            label: t("decide.region"),
            ready: Boolean(input.connection),
            node: (
              <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
                <StepHead
                  index="04"
                  title={t("decide.region")}
                  hint={t("decide.regionHint")}
                  state={input.connection ? "open" : "locked"}
                />
                <RegionPicker
                  regions={regions}
                  broadId={regionBroadId}
                  fineId={regionFineId}
                  disabled={!input.connection}
                  onPickBroad={(id) => applyRegion(id, undefined)}
                  onPickFine={(id) => applyRegion(regionBroadId, id)}
                />
              </Panel>
            ),
          } as DecideStep,
        ]
      : []),
    ...(venues.length
      ? [
          {
            id: "venue",
            label: t("decide.venue"),
            ready: Boolean(input.connection),
            node: (
              <Panel className={input.connection ? "p-5" : "p-5 opacity-45"}>
                <StepHead
                  index={regions.length ? "05" : "04"}
                  title={t("decide.venue")}
                  hint={t("decide.venueHint")}
                  state={input.connection ? "open" : "locked"}
                />
                <VenuePicker
                  venues={venues}
                  platforms={platforms}
                  activeId={venueId}
                  activePlatformId={platformId}
                  disabled={!input.connection}
                  onPick={(v) => {
                    applyVenueLayers(v?.id, platformId);
                  }}
                  onPickPlatform={(p) => {
                    applyVenueLayers(venueId, p?.id);
                  }}
                />
              </Panel>
            ),
          } as DecideStep,
        ]
      : []),
  ];

  const jobSummary = input.connection
    ? [
        input.connection.replace(/-/g, " "),
        input.mainMaterial,
        input.secondaryMaterial,
        input.retieFrequency ? `${input.retieFrequency} reties` : undefined,
      ]
        .filter(Boolean)
        .join(" · ")
    : "Pick a job first — we will not guess";

  const runNow = () => {
    setRan(true);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      window.setTimeout(
        () =>
          document
            .getElementById("ki-output")
            ?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
    }
  };

  return (
    <Shell>
      {domain.id !== "fishing" && knotsForDomain(domain.id).length === 0 ? (
        <div className="mb-6 rounded-lg border border-caution/40 bg-caution/8 px-4 py-3 no-print">
          <MicroLabel className="text-caution">{t("boating.title")}</MicroLabel>
          <p className="mt-1.5 max-w-2xl text-[0.8125rem] leading-relaxed text-foreground/85">
            {t("boating.body")}
          </p>
        </div>
      ) : null}
      {search.from ? (
        <div className="mb-6 rounded-lg border border-accent/40 bg-accent/8 px-4 py-3 no-print">
          <div className="flex flex-wrap items-center gap-3">
            <MicroLabel className="text-accent">Carried from diagnosis</MicroLabel>
            <p className="text-[0.8125rem] text-foreground/85">
              {safeDecode(search.from)} — context preloaded below. Adjust anything that was wrong
              before you trust the answer.
            </p>
          </div>
          {search.why ? (
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
              {safeDecode(search.why)
                .split(" · ")
                .filter(Boolean)
                .map((label) => (
                  <span
                    key={label}
                    className="rounded-full border border-accent/40 bg-card px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent"
                  >
                    {label}
                  </span>
                ))}
              <span className="text-[0.75rem] text-muted-foreground">
                set by the failure evidence, not by you
              </span>
            </div>
          ) : null}
          <Link
            to="/compare"
            search={{ a: encodeInput(input) }}
            className="mt-3 inline-flex min-h-9 items-center rounded-md border border-hairline bg-card px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Compare this against another scenario →
          </Link>
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
              <span className="text-muted-foreground">We’ll say what holds.</span>
            </h1>
          </div>

          <PresetBar
            domainId={domain.id}
            input={input}
            sel={sel}
            {...(venueId ? { venueId } : {})}
            {...(platformId ? { platformId } : {})}
            {...(regionBroadId ? { regionBroadId } : {})}
            {...(regionFineId ? { regionFineId } : {})}
            onLoad={(p) => {
              setInput(p.input);
              setSel(p.sel);
              // Phase C: migrate legacy single venue ids; prefer explicit platformId.
              const legacy = resolveLegacyVenue(p.venueId);
              const nextWb = legacy.waterbodyId ?? p.venueId;
              const nextPl = p.platformId ?? legacy.platformId;
              setVenueId(nextWb);
              setPlatformId(nextPl);
              setRegionBroadId(p.regionBroadId);
              setRegionFineId(p.regionFineId);
              setRan(true);
            }}
          />

          {/* Desktop: the whole instrument at once */}
          <div className="hidden space-y-5 lg:block">
            {steps.map((s) => (
              <Fragment key={s.id}>{s.node}</Fragment>
            ))}
            <button
              type="button"
              disabled={!input.connection}
              onClick={runNow}
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

          {/* Phone: one decision per screen, job carried in the sticky bar */}
          <DecideStepper
            className="lg:hidden"
            steps={steps}
            summary={jobSummary}
            canRun={Boolean(input.connection)}
            runLabel={ran ? t("decide.rerun") : t("decide.run")}
            onRun={runNow}
          />
        </div>

        {/* ── OUTPUT ─────────────────────────────────── */}
        <div id="ki-output" className="space-y-6 scroll-mt-20">
          {!result ? (
            <EmptyDecide
              onPick={(id) => navigate({ to: "/", search: { scenario: id, run: true } })}
            />
          ) : null}

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
                      <Link
                        to="/compare"
                        search={{ a: encodeInput(input) }}
                        className="rounded-md border border-hairline px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                      >
                        Compare
                      </Link>
                      {(
                        [
                          ["brief", "Brief", "One sheet: the call and its compromises"],
                          [
                            "field",
                            "Field packet",
                            "Adds the other knots, why they lost, and how to tie the one that won",
                          ],
                        ] as [PacketVariant, string, string][]
                      ).map(([kind, label, hint]) => {
                        const busy = packetState === "working" && packetKind === kind;
                        const failed = packetState === "error" && packetKind === kind;
                        return (
                          <button
                            key={kind}
                            type="button"
                            title={hint}
                            aria-label={`${label} PDF — ${hint}`}
                            onClick={async () => {
                              setPacketKind(kind);
                              setPacketState("working");
                              try {
                                await generateDecisionPacket({
                                  result,
                                  card,
                                  tradeoffs,
                                  counterfactuals: cfs,
                                  variant: kind,
                                });
                                setPacketState("idle");
                              } catch (err) {
                                console.error(err);
                                setPacketState("error");
                              }
                            }}
                            disabled={packetState === "working"}
                            className={cn(
                              "ki-press min-h-9 rounded-md border px-3 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                              kind === "field"
                                ? "border-primary/60 bg-primary/15 text-foreground hover:bg-primary/25"
                                : "border-hairline text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {busy ? "Building…" : failed ? `Retry ${label.toLowerCase()}` : label}
                          </button>
                        );
                      })}
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
                        {result.terminationCandidates && result.terminationCandidates.length > 0 ? (
                          <div className="mt-4 space-y-3">
                            <MicroLabel>Candidate terminations</MicroLabel>
                            {result.terminationCandidates.map((c) => (
                              <div
                                key={c.id}
                                className="rounded-md border border-hairline/80 bg-card/60 px-3 py-2.5"
                              >
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                  <p className="text-[0.875rem] font-medium tracking-tight">
                                    {c.name}
                                  </p>
                                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                                    {c.terminationType} · {c.confidence}
                                  </span>
                                </div>
                                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                                  {c.when}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                    {selectedRegion ? (
                      <div className="border-b border-hairline bg-accent/6 px-6 py-4">
                        <MicroLabel className="mb-2 text-accent">
                          {t("region.fieldNote")}
                        </MicroLabel>
                        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                          {selectedRegion.label}
                          {selectedRegion.signals?.saltLean
                            ? ` · ${selectedRegion.signals.saltLean}`
                            : ""}
                          {selectedRegion.signals?.wireWatch ? " · wire-watch" : ""}
                          {selectedRegion.signals?.abrasion
                            ? ` · ${selectedRegion.signals.abrasion} abrasion`
                            : ""}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {selectedRegion.advisories.map((line) => (
                            <li
                              key={line}
                              className="text-[0.8125rem] leading-relaxed text-muted-foreground"
                            >
                              {line}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-2 text-[0.6875rem] leading-relaxed text-muted-foreground/80">
                          {t("region.override")}
                        </p>
                      </div>
                    ) : null}
                    {ranked.length > 1 ? (
                      <div className="border-b border-hairline px-6 py-3 no-print">
                        <MicroLabel className="mb-2">Toggle alternative</MicroLabel>
                        <div className="flex flex-wrap gap-1.5">
                          {ranked.slice(0, 4).map((o, idx) => (
                            <Chip
                              key={o.knot.id}
                              tone={idx === 0 ? "signal" : "neutral"}
                              active={safeAlt === idx}
                              onClick={() => setAltPick(idx)}
                            >
                              {idx === 0 ? "Recommended" : `Alt ${idx}`} · {o.knot.name}
                              <span className="ml-1 font-mono text-[0.625rem] text-muted-foreground">
                                {o.fieldFitPercent}%
                              </span>
                            </Chip>
                          ))}
                        </div>
                        <p className="mt-2 text-[0.75rem] leading-relaxed text-muted-foreground">
                          Same rules. Switch knots without running it again — hold the trade-offs
                          side by side.
                        </p>
                      </div>
                    ) : null}
                    {activeOption ? (
                      <div className="overflow-hidden border-b border-hairline bg-surface-2/40">
                        <KnotDiagram
                          kind={activeOption.knot.diagramKind}
                          title={`${activeOption.knot.name} — finished structure`}
                          className="aspect-[400/180] w-full sm:aspect-[400/150]"
                        />
                        <p className="border-t border-hairline px-6 py-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                          {diagramStepNote(activeOption.knot.diagramKind)}
                        </p>
                      </div>
                    ) : null}
                    <div className="grid gap-6 px-6 py-6 sm:grid-cols-[minmax(0,1fr)_150px]">
                      <div className="min-w-0">
                        <h2 className="text-[2rem] font-semibold leading-none tracking-[-0.03em]">
                          {activeOption ? activeOption.knot.name : card.knotName}
                        </h2>
                        {safeAlt > 0 ? (
                          <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-caution">
                            Alternative {safeAlt} · not the primary recommendation
                          </p>
                        ) : null}
                        <p className="mt-3 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
                          {card.jobLine} · {card.systemLine}
                        </p>
                        <p className="mt-1 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground/70">
                          {card.conditionLine}
                        </p>
                        {activeOption ? (
                          <div className="mt-4 flex flex-wrap gap-2 no-print">
                            <Link
                              to="/tie/$knotId"
                              params={{ knotId: activeOption.knot.id }}
                              className="inline-flex items-center gap-2 rounded-md border border-accent/50 px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent transition-colors hover:bg-accent/10"
                            >
                              Tie it — steps and diagram
                            </Link>
                            <Link
                              to="/diagram/$knotId"
                              params={{ knotId: activeOption.knot.id }}
                              className="inline-flex items-center gap-2 rounded-md border border-hairline px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
                            >
                              All diagrams
                            </Link>
                          </div>
                        ) : null}
                      </div>
                      <div className="sm:text-right">
                        <div className="font-mono text-[2.5rem] leading-none tabular-nums text-primary">
                          {activeOption ? activeOption.fieldFitPercent : card.fieldFit}
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
                        <MicroLabel className="mb-3">
                          {safeAlt === 0 ? "Why this one" : "Why this alternative"}
                        </MicroLabel>
                        <Bullets
                          items={
                            safeAlt === 0
                              ? card.reasons
                              : activeOption?.whyBest?.length
                                ? activeOption.whyBest
                                : activeOption?.butNotes?.length
                                  ? activeOption.butNotes
                                  : card.reasons
                          }
                        />
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
                          {ranked.length > 1 ? (
                            <button
                              type="button"
                              onClick={() => setAltPick(1)}
                              className="ki-press mt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent hover:underline"
                            >
                              Toggle to this alternative →
                            </button>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="border-t border-hairline px-6 py-3">
                      <p
                        suppressHydrationWarning
                        className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground/70"
                      >
                        {result.eliminated.length} knots ruled out · engine {result.engineVersion} ·{" "}
                        {result.generatedAt.slice(0, 19).replace("T", " ")}Z
                      </p>
                    </div>
                  </>
                )}
              </Panel>

              {tradeoffs.length ? (
                <Panel className="p-6">
                  <MicroLabel className="mb-4">These fight each other</MicroLabel>
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
                      <div key={o.knot.id} className="flex gap-3 sm:gap-4">
                        <div className="w-[88px] shrink-0 overflow-hidden rounded-md border border-hairline bg-surface-2/40 sm:w-[112px]">
                          <KnotDiagram
                            kind={o.knot.diagramKind}
                            compact
                            title={`${o.knot.name} — finished structure`}
                            className="aspect-[400/180] w-full"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
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
                            {idx === 0
                              ? (o.vsNext ?? o.whyBest[0])
                              : (o.whyBest[0] ?? o.butNotes[0] ?? o.vsNext)}
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
                      <div
                        key={c.id}
                        className="flex flex-wrap gap-x-6 gap-y-1 py-3 first:pt-0 last:pb-0"
                      >
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
                    <MicroLabel>Ruled out — {result.eliminated.length}</MicroLabel>
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
        <div className="ki-stagger grid gap-px overflow-hidden rounded-lg bg-hairline sm:grid-cols-2">
          {scenarios.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onPick(s.id)}
              aria-label={`Load scenario: ${s.title}`}
              className="group ki-press touch-manipulation bg-card px-5 py-4 text-left transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
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
