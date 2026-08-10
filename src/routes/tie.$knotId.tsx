import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Shell } from "@/components/instrument/shell";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
import { StepPlayer } from "@/components/instrument/step-player";
import { KnotDiagram } from "@/components/instrument/diagram";
import { getKnot } from "@/data/catalog";
import { DIFFICULTY_LABELS, MATERIAL_LABELS } from "@/domain/types";

export const Route = createFileRoute("/tie/$knotId")({
  loader: ({ params }) => {
    const knot = getKnot(params.knotId);
    if (!knot) throw notFound();
    return { id: knot.id, name: knot.name, summary: knot.mechanicsSummary };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.name ?? "Tying procedure";
    const desc =
      loaderData?.summary ??
      "Step-by-step tying procedure with schematic diagram and failure points.";
    return {
      meta: [
        { title: `${name} — tying procedure | Knot Intelligence` },
        { name: "description", content: desc.slice(0, 155) },
        { property: "og:title", content: `${name} — tying procedure` },
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
        No modelled procedure for that connection.{" "}
        <Link to="/" className="text-accent underline underline-offset-4">
          Back to Decide
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
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {DIFFICULTY_LABELS[knot.difficulty]} ·{" "}
          {knot.lineMaterials.map((m) => MATERIAL_LABELS[m]).join(" / ")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-6">
          <StepPlayer knot={knot} />

          <Panel className="p-6">
            <MicroLabel className="mb-4">Finished structure — what correct looks like</MicroLabel>
            <div className="mb-5 overflow-hidden rounded-lg border border-hairline bg-surface-2/40">
              <KnotDiagram
                kind={knot.diagramKind}
                title={`${knot.name} — finished structure`}
                className="aspect-[400/180] w-full"
              />
            </div>
            <Bullets
              items={[
                knot.fingerprint.expectedGeometry,
                knot.fingerprint.expectedSeatingPattern,
                knot.fingerprint.expectedTagOrientation,
                knot.fingerprint.expectedCoilDistribution,
              ]}
            />
          </Panel>
        </div>

        <div className="space-y-6">
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