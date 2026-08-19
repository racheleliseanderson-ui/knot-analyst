import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/instrument/shell";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
import { KnotDiagram, describeDiagram, diagramStepNote } from "@/components/instrument/diagram";
import { FailureModesPanel } from "@/components/instrument/failure-modes";
import { HthInspectPlates } from "@/components/instrument/hth-plate";
import { getKnot } from "@/data/catalog";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, MATERIAL_LABELS } from "@/domain/types";
import { useT } from "@/i18n";

export const Route = createFileRoute("/diagram/$knotId")({
  loader: ({ params }) => {
    const knot = getKnot(params.knotId);
    if (!knot) throw notFound();
    return { id: knot.id, name: knot.name };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Diagrams";
    return {
      meta: [
        { title: `${name} — diagrams | Knot Analyst` },
        {
          name: "description",
          content: `Diagrams for ${name}. Open the steps when you are ready to tie.`,
        },
        { property: "og:title", content: `${name} — diagrams` },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: DiagramMode,
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">
        No diagram for that knot.{" "}
        <Link to="/library" className="text-accent underline underline-offset-4">
          Back to Library
        </Link>
      </p>
    </Shell>
  ),
});

function DiagramMode() {
  const t = useT();
  const { id } = Route.useLoaderData();
  const knot = getKnot(id);
  if (!knot) return null;
  const total = knot.steps.length;
  const extra = knot.aliases.filter((a) => a.toLowerCase() !== knot.name.toLowerCase());
  const related = knot.relatedKnots
    .map((rid) => getKnot(rid))
    .filter((k): k is NonNullable<typeof k> => Boolean(k));

  return (
    <Shell>
      <Link
        to="/library"
        className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
      >
        ← {t("library.title")}
      </Link>

      <div className="mb-6 mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <MicroLabel>Mode 06 · Diagrams</MicroLabel>
          <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
            {knot.name}
          </h1>
          {extra.length ? (
            <p className="mt-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
              {extra.join(" · ")}
            </p>
          ) : null}
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {knot.goodFor}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
            {CATEGORY_LABELS[knot.category]} · {DIFFICULTY_LABELS[knot.difficulty]} ·{" "}
            {knot.lineMaterials.map((m) => MATERIAL_LABELS[m]).join(" / ")} · {total}{" "}
            {t("library.plates")}
          </p>
          <Link
            to="/applications/$id"
            params={{ id: knot.id }}
            className="inline-flex min-h-11 items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
          >
            {t("nav.applications")}
          </Link>
          <Link
            to="/tie/$knotId"
            params={{ knotId: knot.id }}
            className="inline-flex min-h-11 items-center rounded-md border border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground"
          >
            {t("library.openPlayer")}
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

      <ol className="space-y-6">
        {knot.steps.map((s) => (
          <li key={s.order} className="panel overflow-hidden">
            <KnotDiagram
              kind={knot.diagramKind}
              step={s.order}
              focus
              title={`${knot.name} — step ${s.order} of ${total}`}
              description={describeDiagram(knot.diagramKind, s.order, total)}
              className="aspect-[400/180] w-full bg-surface-2/40"
            />
            <div className="border-t border-hairline p-5">
              <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
                Step {String(s.order).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[0.9375rem] leading-relaxed">{s.instruction}</p>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {diagramStepNote(knot.diagramKind, s.order)}
              </p>
              {s.look || s.expectedResult ? (
                <p className="mt-3 text-[0.8125rem] leading-relaxed">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-affirm">
                    Look for
                  </span>
                  <span className="mt-1 block text-foreground/85">
                    {s.look ?? s.expectedResult}
                  </span>
                </p>
              ) : null}
              {s.failureMode ? (
                <p className="mt-3 text-[0.8125rem] leading-relaxed">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-destructive">
                    Fails as
                  </span>
                  <span className="mt-1 block text-foreground/85">{s.failureMode}</span>
                </p>
              ) : null}
              {s.quickFix ? (
                <p className="mt-3 text-[0.8125rem] leading-relaxed">
                  <span className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent">
                    Quick fix
                  </span>
                  <span className="mt-1 block text-foreground/85">{s.quickFix}</span>
                </p>
              ) : null}
              {s.tip ? (
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {s.tip}
                </p>
              ) : null}
              {s.commonError && !s.failureMode ? (
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  Fails as: {s.commonError}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <HthInspectPlates knotId={knot.id} name={knot.name} />
      </div>

      <div className="mt-8">
        <FailureModesPanel knot={knot} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {knot.notIdealFor.length ? (
          <Panel className="p-5">
            <MicroLabel className="mb-3">Not ideal for</MicroLabel>
            <Bullets items={knot.notIdealFor} marker="×" />
          </Panel>
        ) : null}
        {related.length ? (
          <Panel className="p-5">
            <MicroLabel className="mb-3">{t("library.related")}</MicroLabel>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.id} className="flex flex-wrap items-baseline justify-between gap-2">
                  <Link
                    to="/diagram/$knotId"
                    params={{ knotId: r.id }}
                    className="text-[0.875rem] text-accent underline underline-offset-4"
                  >
                    {r.name}
                  </Link>
                  <Link
                    to="/tie/$knotId"
                    params={{ knotId: r.id }}
                    className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    {t("library.tie")}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}
      </div>
    </Shell>
  );
}
