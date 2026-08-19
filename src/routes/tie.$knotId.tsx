import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/instrument/shell";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
import { StepPlayer } from "@/components/instrument/step-player";
import { KnotDiagram, diagramStepNote } from "@/components/instrument/diagram";
import { VideoEmbed } from "@/components/instrument/video-embed";
import { getKnot } from "@/data/catalog";
import { DIFFICULTY_LABELS, MATERIAL_LABELS } from "@/domain/types";

export const Route = createFileRoute("/tie/$knotId")({
  loader: ({ params }) => {
    const knot = getKnot(params.knotId);
    if (!knot) throw notFound();
    return { id: knot.id, name: knot.name, summary: knot.mechanicsSummary };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "How to tie it";
    const desc = loaderData?.summary ?? "How to tie it, with a diagram and what to watch for.";
    return {
      meta: [
        { title: `${name} — how to tie it | Knot Analyst` },
        { name: "description", content: desc.slice(0, 155) },
        { property: "og:title", content: `${name} — how to tie it` },
        { property: "og:description", content: desc.slice(0, 155) },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: TieMode,
  errorComponent: ({ error }) => (
    <Shell>
      <p role="alert" className="text-sm text-destructive">
        {error.message}
      </p>
    </Shell>
  ),
  notFoundComponent: () => (
    <Shell>
      <p className="text-sm text-muted-foreground">
        No tying steps for that knot.{" "}
        <Link to="/library" className="text-accent underline underline-offset-4">
          Back to Library
        </Link>
      </p>
    </Shell>
  ),
});

function TieMode() {
  const { id } = Route.useLoaderData();
  const knot = getKnot(id);
  if (!knot) return null;

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <MicroLabel>Mode 03 · Tie</MicroLabel>
          <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
            {knot.name}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {knot.mechanicsSummary}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
            {DIFFICULTY_LABELS[knot.difficulty]} ·{" "}
            {knot.lineMaterials.map((m) => MATERIAL_LABELS[m]).join(" / ")}
          </p>
          <button
            type="button"
            onClick={() => window.print()}
            className="min-h-[44px] rounded-md border border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:border-accent/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring no-print"
          >
            Print tie card
          </button>
          <Link
            to="/diagram/$knotId"
            params={{ knotId: knot.id }}
            className="min-h-[44px] inline-flex items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground no-print"
          >
            All diagrams
          </Link>
          <Link
            to="/applications/$id"
            params={{ id: knot.id }}
            className="min-h-[44px] inline-flex items-center font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground no-print"
          >
            Applications
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          {knot.beforeYouStart?.length ? (
            <Panel className="p-5">
              <MicroLabel className="mb-3">Before you start</MicroLabel>
              <Bullets items={knot.beforeYouStart} marker="·" />
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-hairline pt-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                <span>Line + hardware: {knot.materialsNeeded.join(", ")}</span>
                {knot.toolsHelpful?.length ? (
                  <span>Tools: {knot.toolsHelpful.join(", ")}</span>
                ) : null}
              </div>
            </Panel>
          ) : null}

          <StepPlayer knot={knot} />

          {knot.video ? <VideoEmbed video={knot.video} knotName={knot.name} /> : null}

          {knot.seatingSequence?.length ? (
            <Panel className="p-6">
              <MicroLabel className="mb-1">Seating sequence — where failures are born</MicroLabel>
              <p className="mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
                The step list compresses the finish. Run these phases in order, one at a time.
              </p>
              <ol className="space-y-px overflow-hidden rounded-lg border border-hairline bg-hairline">
                {knot.seatingSequence.map((p, i) => (
                  <li
                    key={p.phase}
                    className="grid gap-1 bg-card px-4 py-3 sm:grid-cols-[88px_minmax(0,1fr)_minmax(0,0.8fr)] sm:items-baseline sm:gap-4"
                  >
                    <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-primary">
                      {String(i + 1).padStart(2, "0")} {p.phase}
                    </p>
                    <p className="text-[0.875rem] leading-relaxed text-foreground">{p.action}</p>
                    <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {p.tension}
                    </p>
                  </li>
                ))}
              </ol>
            </Panel>
          ) : null}

          <Panel className="p-6">
            <MicroLabel className="mb-4">Finished structure — what correct looks like</MicroLabel>
            <div className="mb-5 overflow-hidden rounded-lg border border-hairline bg-surface-2/40">
              <KnotDiagram
                kind={knot.diagramKind}
                title={`${knot.name} — finished structure`}
                className="aspect-[400/220] w-full sm:aspect-[400/180]"
              />
            </div>
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              {diagramStepNote(knot.diagramKind)}
            </p>
            <Bullets
              items={[
                knot.fingerprint.expectedGeometry,
                knot.fingerprint.expectedSeatingPattern,
                knot.fingerprint.expectedTagOrientation,
                knot.fingerprint.expectedCoilDistribution,
              ]}
            />
          </Panel>

          <Panel className="p-6">
            <MicroLabel className="mb-1">Verify before you fish it</MicroLabel>
            <p className="mb-4 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Every line is pass or fail. One fail means retie — do not fish a knot you argued with.
            </p>
            <ul className="space-y-px overflow-hidden rounded-lg border border-hairline bg-hairline">
              {[
                knot.fingerprint.expectedGeometry,
                knot.fingerprint.expectedSeatingPattern,
                knot.fingerprint.expectedTagOrientation,
                knot.fingerprint.expectedCoilDistribution,
                knot.fingerprint.expectedCrossoverBehavior,
                knot.fingerprint.expectedFinishingStructure,
              ]
                .filter(Boolean)
                .map((check, i) => (
                  <li key={check} className="flex gap-3 bg-card px-4 py-3">
                    <span className="mt-0.5 font-mono text-[0.625rem] tracking-[0.16em] text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.875rem] leading-relaxed text-foreground/90">
                      {check}
                    </span>
                  </li>
                ))}
            </ul>
            <Link
              to="/diagnose"
              className="mt-4 inline-block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-accent underline underline-offset-4"
            >
              Something failed → run Diagnose
            </Link>
          </Panel>
        </div>

        <div className="space-y-6">
          {knot.fieldNotes?.length ? (
            <Panel className="p-5">
              <MicroLabel className="mb-3">Field notes — dark, cold, gloves</MicroLabel>
              <Bullets items={knot.fieldNotes} marker="·" />
            </Panel>
          ) : null}

          <Panel className="p-5">
            <MicroLabel className="mb-3">Common mistakes</MicroLabel>
            <Bullets items={knot.commonMistakes} marker="!" />
          </Panel>

          <Panel className="p-5">
            <MicroLabel className="mb-3">Not ideal for</MicroLabel>
            <Bullets items={knot.notIdealFor} marker="×" />
          </Panel>

          {knot.resources.length ? (
            <Panel className="p-5">
              <MicroLabel className="mb-3">Vetted references</MicroLabel>
              <ul className="space-y-3">
                {knot.resources.map((r) => (
                  <li key={r.url}>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[0.875rem] text-accent underline underline-offset-4"
                    >
                      {r.title}
                    </a>
                    <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {r.source}
                    </p>
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}

          <Link
            to="/diagnose"
            className="block rounded-lg border border-hairline px-5 py-4 transition-colors hover:border-accent/50"
          >
            <MicroLabel className="text-accent">Already tied it?</MicroLabel>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Check the finished knot against its fingerprint before you fish it.
            </p>
          </Link>
        </div>
      </div>
    </Shell>
  );
}
