import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/instrument/shell";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
import { KnotDiagram, diagramStepNote } from "@/components/instrument/diagram";
import { FailureModesPanel } from "@/components/instrument/failure-modes";
import { HthInspectPlates } from "@/components/instrument/hth-plate";
import { KnotFieldGuide } from "@/components/instrument/knot-field-guide";
import { getKnot } from "@/data/catalog";
import {
  EXTRA_DOMAIN_LABELS,
  HOLDS_LABELS,
  TANGLE_LABELS,
  WORLD_GROUP_LABELS,
  getKnotApplication,
  getWorldEssay,
  isWorldEssayId,
} from "@/data/applications";

export const Route = createFileRoute("/applications/$id")({
  loader: ({ params }) => {
    if (isWorldEssayId(params.id)) {
      const world = getWorldEssay(params.id);
      if (!world) throw notFound();
      return { kind: "world" as const, id: world.id, name: world.title };
    }
    const knot = getKnot(params.id);
    const app = getKnotApplication(params.id);
    if (!knot || !app) throw notFound();
    return { kind: "knot" as const, id: knot.id, name: knot.name };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Knot use cases";
    return {
      meta: [
        { title: `${name} — use cases | Knot Analyst` },
        {
          name: "description",
          content: `When to use ${name}, what it works with, its tradeoffs, failure points, and nearby alternatives.`,
        },
        { property: "og:title", content: `${name} — use cases` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ApplicationDetail,
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">
        No use-case note for that item.{" "}
        <Link to="/applications" className="text-accent underline underline-offset-4">
          Back to use cases
        </Link>
      </p>
    </Shell>
  ),
});

function ApplicationDetail() {
  const { kind, id } = Route.useLoaderData();
  return kind === "world" ? <WorldPage id={id} /> : <KnotPage id={id} />;
}

function WorldPage({ id }: { id: string }) {
  const world = getWorldEssay(id);
  if (!world) return null;
  const related = world.relatedKnotIds.map((kid) => getKnot(kid)).filter(Boolean);

  return (
    <Shell>
      <Link
        to="/applications"
        className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        ← Knot use cases
      </Link>
      <div className="mb-6 mt-4">
        <MicroLabel>Reference note · {WORLD_GROUP_LABELS[world.group]}</MicroLabel>
        <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
          {world.title}
        </h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {world.lede}
        </p>
      </div>
      <Panel className="mb-6 p-5">
        <MicroLabel>Why this is here</MicroLabel>
        <p className="mt-3 text-[0.875rem] leading-relaxed text-muted-foreground">
          This is background about a connection pattern, not a recommendation for what to tie on the water.
          Use the practical knot pages for line compatibility, field conditions, tying, and failure checks.
        </p>
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <MicroLabel>What it means</MicroLabel>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/90">{world.meaning}</p>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>What it helps explain</MicroLabel>
          <div className="mt-3"><Bullets items={world.predicts} /></div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Where it stops helping</MicroLabel>
          <div className="mt-3"><Bullets items={world.doesNot} /></div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Not a substitute for</MicroLabel>
          <div className="mt-3"><Bullets items={world.notFor} /></div>
        </Panel>
      </div>
      {related.length ? (
        <section className="mt-8">
          <MicroLabel>Related practical knot pages</MicroLabel>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {related.map((knot) =>
              knot ? (
                <li key={knot.id}>
                  <Link
                    to="/applications/$id"
                    params={{ id: knot.id }}
                    className="panel flex min-h-24 overflow-hidden hover:border-primary/40"
                  >
                    <div className="w-[104px] shrink-0 border-r border-hairline bg-surface-2/40">
                      <KnotDiagram
                        kind={knot.diagramKind}
                        compact
                        title={`${knot.name} — finished structure`}
                        className="aspect-[400/180] h-full w-full"
                      />
                    </div>
                    <span className="flex min-w-0 flex-1 items-center px-4 text-[0.875rem] font-medium tracking-tight">
                      {knot.name}
                    </span>
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : null}
      <Sources sources={world.sources} />
    </Shell>
  );
}

function KnotPage({ id }: { id: string }) {
  const knot = getKnot(id);
  const app = getKnotApplication(id);
  if (!knot || !app) return null;
  const aliases = knot.aliases.filter((alias) => alias.toLowerCase() !== knot.name.toLowerCase());
  const duals = app.duals
    .map((dual) => ({ ...dual, knot: getKnot(dual.knotId) }))
    .filter((dual) => dual.knot);
  const related = knot.relatedKnots.map((rid) => getKnot(rid)).filter(Boolean);

  return (
    <Shell>
      <Link
        to="/applications"
        className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        ← Knot use cases
      </Link>
      <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <MicroLabel>Mode 05 · {TANGLE_LABELS[app.tangleClass]}</MicroLabel>
          <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
            {knot.name}
          </h1>
          {aliases.length ? (
            <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              Also known as {aliases.join(" · ")}
            </p>
          ) : null}
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {knot.goodFor}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/diagram/$knotId"
            params={{ knotId: knot.id }}
            className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            Full guide
          </Link>
          <Link
            to="/tie/$knotId"
            params={{ knotId: knot.id }}
            className="inline-flex min-h-11 items-center rounded-md border border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:border-accent/50 hover:text-foreground"
          >
            How to tie it
          </Link>
        </div>
      </div>

      <div className="mb-6 overflow-hidden rounded-lg border border-hairline bg-surface-2/40">
        <KnotDiagram
          kind={knot.diagramKind}
          title={`${knot.name} — finished structure`}
          className="aspect-[400/180] w-full"
        />
        <div className="border-t border-hairline px-5 py-3">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
            Finished structure
          </p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {diagramStepNote(knot.diagramKind)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <MicroLabel>Best use</MicroLabel>
          <p className="mt-3 text-[0.875rem] leading-relaxed">{knot.goodFor}</p>
          <div className="mt-3"><Bullets items={app.applicationNotes} /></div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>How it holds</MicroLabel>
          <div className="mt-3"><Bullets items={app.holdsBy.map((hold) => HOLDS_LABELS[hold])} /></div>
          {app.extraDomains.length ? (
            <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
              Similar connection ideas also appear in {app.extraDomains.map((domain) => EXTRA_DOMAIN_LABELS[domain]).join(", ")}, but that does not make those uses interchangeable.
            </p>
          ) : null}
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Advantages</MicroLabel>
          <div className="mt-3"><Bullets items={knot.fieldFit.strengths.length ? knot.fieldFit.strengths : [knot.goodFor]} /></div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Tradeoffs & watch-outs</MicroLabel>
          <div className="mt-3"><Bullets items={[...knot.notIdealFor, ...knot.fieldFit.weaknesses]} marker="×" /></div>
        </Panel>
      </div>

      <KnotFieldGuide knot={knot} />

      <div className="mt-8">
        <HthInspectPlates knotId={knot.id} name={knot.name} />
      </div>
      <div className="mt-8">
        <FailureModesPanel knot={knot} />
      </div>

      {(duals.length || related.length) ? (
        <Panel className="mt-8 p-5">
          <MicroLabel>Compare nearby options</MicroLabel>
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {duals.map((dual) => (
              <li key={`dual-${dual.knotId}`}>
                <Link
                  to="/applications/$id"
                  params={{ id: dual.knotId }}
                  className="font-semibold tracking-tight text-accent underline underline-offset-4"
                >
                  {dual.knot?.name}
                </Link>
                <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {dual.relation}
                </p>
              </li>
            ))}
            {related
              .filter((item) => item && !duals.some((dual) => dual.knotId === item.id))
              .map((item) => item ? (
                <li key={`related-${item.id}`}>
                  <Link
                    to="/applications/$id"
                    params={{ id: item.id }}
                    className="font-semibold tracking-tight text-accent underline underline-offset-4"
                  >
                    {item.name}
                  </Link>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    Related option for a similar connection or field tradeoff.
                  </p>
                </li>
              ) : null)}
          </ul>
        </Panel>
      ) : null}

      <Sources sources={app.sources} />
    </Shell>
  );
}

function Sources({ sources }: { sources: { title: string; url: string; note?: string }[] }) {
  return (
    <section className="mt-8">
      <MicroLabel>Sources</MicroLabel>
      <ul className="mt-3 space-y-2">
        {sources.map((source) => (
          <li key={source.url} className="text-[0.8125rem] leading-relaxed">
            <a
              href={source.url}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4"
            >
              {source.title}
            </a>
            {source.note ? <span className="text-muted-foreground"> — {source.note}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
