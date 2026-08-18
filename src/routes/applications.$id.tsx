import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/instrument/shell";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
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
import { useT } from "@/i18n";

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
    const name = loaderData?.name ?? "Applications";
    return {
      meta: [
        { title: `${name} — applications | Knot Analyst` },
        {
          name: "description",
          content: `What the physics says about ${name} — and what it must not pick for you.`,
        },
        { property: "og:title", content: `${name} — applications` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: ApplicationDetail,
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">
        No application note for that id.{" "}
        <Link to="/applications" className="text-accent underline underline-offset-4">
          Back to Applications
        </Link>
      </p>
    </Shell>
  ),
});

function ApplicationDetail() {
  const { kind, id } = Route.useLoaderData();
  return kind === "world" ? <WorldPage id={id} /> : <KnotPage id={id} />;
}

function IsolationBanner({ text }: { text: string }) {
  return (
    <Panel className="mb-8 px-4 py-3">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary/80">
        Does not pick a knot
      </p>
      <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{text}</p>
    </Panel>
  );
}

function WorldPage({ id }: { id: string }) {
  const t = useT();
  const w = getWorldEssay(id);
  if (!w) return null;
  const related = w.relatedKnotIds.map((kid) => getKnot(kid)).filter(Boolean);

  return (
    <Shell>
      <Link
        to="/applications"
        className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        ← {t("applications.title")}
      </Link>
      <div className="mb-6 mt-4">
        <MicroLabel>Mode 07 · {WORLD_GROUP_LABELS[w.group]}</MicroLabel>
        <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
          {w.title}
        </h1>
        <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
          {w.lede}
        </p>
      </div>
      <IsolationBanner text={t("applications.isolation")} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <MicroLabel>What it means</MicroLabel>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-foreground/90">{w.meaning}</p>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>What it predicts</MicroLabel>
          <div className="mt-3">
            <Bullets items={w.predicts} />
          </div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>What it does not predict</MicroLabel>
          <div className="mt-3">
            <Bullets items={w.doesNot} />
          </div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Not for</MicroLabel>
          <div className="mt-3">
            <Bullets items={w.notFor} />
          </div>
        </Panel>
      </div>
      {related.length ? (
        <section className="mt-8">
          <MicroLabel>Modelled connections this talks about</MicroLabel>
          <ul className="mt-3 flex flex-wrap gap-2">
            {related.map((k) =>
              k ? (
                <li key={k.id}>
                  <Link
                    to="/applications/$id"
                    params={{ id: k.id }}
                    className="inline-flex min-h-11 items-center rounded-md border border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    {k.name}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        </section>
      ) : (
        <p className="mt-8 text-sm text-muted-foreground">{t("applications.noKnot")}</p>
      )}
      <Sources sources={w.sources} />
    </Shell>
  );
}

function KnotPage({ id }: { id: string }) {
  const t = useT();
  const k = getKnot(id);
  const a = getKnotApplication(id);
  if (!k || !a) return null;
  const duals = a.duals.map((d) => ({ ...d, knot: getKnot(d.knotId) })).filter((d) => d.knot);

  return (
    <Shell>
      <Link
        to="/applications"
        className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        ← {t("applications.title")}
      </Link>
      <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <MicroLabel>Mode 07 · {TANGLE_LABELS[a.tangleClass]}</MicroLabel>
          <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
            {k.name}
          </h1>
          <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
            {a.holdsBy.map((h) => HOLDS_LABELS[h]).join(" · ")}
            {a.extraDomains.length
              ? ` · ${a.extraDomains.map((d) => EXTRA_DOMAIN_LABELS[d]).join(" · ")}`
              : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/diagram/$knotId"
            params={{ knotId: k.id }}
            className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            {t("applications.diagram")}
          </Link>
          <Link
            to="/tie/$knotId"
            params={{ knotId: k.id }}
            className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            {t("library.openPlayer")}
          </Link>
        </div>
      </div>
      <IsolationBanner text={t("applications.isolation")} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <MicroLabel>What holds it</MicroLabel>
          <div className="mt-3">
            <Bullets items={a.applicationNotes} />
          </div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>What topology does not predict</MicroLabel>
          <div className="mt-3">
            <Bullets items={a.topologyDoesNot} />
          </div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Not for</MicroLabel>
          <div className="mt-3">
            <Bullets items={a.notFor} />
          </div>
        </Panel>
        <Panel className="p-5">
          <MicroLabel>Sourced duals</MicroLabel>
          {duals.length ? (
            <ul className="mt-3 space-y-3">
              {duals.map((d) => (
                <li key={d.knotId}>
                  <Link
                    to="/applications/$id"
                    params={{ id: d.knotId }}
                    className="font-semibold tracking-tight hover:text-accent"
                  >
                    {d.knot?.name}
                  </Link>
                  <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                    {d.relation}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {t("applications.noDual")}
            </p>
          )}
        </Panel>
      </div>
      <Sources sources={a.sources} />
    </Shell>
  );
}

function Sources({ sources }: { sources: { title: string; url: string; note?: string }[] }) {
  return (
    <section className="mt-8">
      <MicroLabel>Sources</MicroLabel>
      <ul className="mt-3 space-y-2">
        {sources.map((s) => (
          <li key={s.url} className="text-[0.8125rem] leading-relaxed">
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="text-accent underline underline-offset-4"
            >
              {s.title}
            </a>
            {s.note ? <span className="text-muted-foreground"> — {s.note}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
