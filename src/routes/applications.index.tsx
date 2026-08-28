import { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Shell } from "@/components/instrument/shell";
import { ModePlate } from "@/components/instrument/mode-plate";
import { plate } from "@/components/instrument/plates";
import { Chip, MicroLabel, Panel } from "@/components/instrument/primitives";
import { KnotDiagram } from "@/components/instrument/diagram";
import { getKnot } from "@/data/catalog";
import {
  HOLDS_LABELS,
  TANGLE_LABELS,
  applicationsForDomain,
  type TangleClass,
} from "@/data/applications";
import { useDomain } from "@/domain/context";

type SearchState = { q?: string; class?: TangleClass };

const CLASSES = new Set<string>(Object.keys(TANGLE_LABELS));
const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);

export const Route = createFileRoute("/applications/")({
  validateSearch: (s: Record<string, unknown>): SearchState => {
    const tangle = str(s["class"]);
    return {
      q: str(s["q"]),
      class: tangle && CLASSES.has(tangle) ? (tangle as TangleClass) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Knot use cases — where each knot fits | Knot Analyst" },
      {
        name: "description",
        content:
          "Browse fishing and boat knots by practical use. See where each knot works well, what holds it, its tradeoffs, and when another knot is a better fit.",
      },
      { property: "og:title", content: "Knot use cases — where each knot fits" },
      {
        property: "og:description",
        content: "Practical use cases, tradeoffs, and alternatives for every knot in the Knot Analyst library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationsMode,
});

function ApplicationsMode() {
  const domain = useDomain();
  const navigate = useNavigate({ from: "/applications/" });
  const search = Route.useSearch();
  const q = search.q ?? "";
  const tangle = search.class;
  const rows = applicationsForDomain(domain.id);

  const classes = useMemo(() => {
    const set = new Set<TangleClass>();
    for (const row of rows) set.add(row.tangleClass);
    return [...set].sort((a, b) => TANGLE_LABELS[a].localeCompare(TANGLE_LABELS[b]));
  }, [rows]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((row) => !tangle || row.tangleClass === tangle)
      .filter((row) => {
        if (!needle) return true;
        const knot = getKnot(row.knotId);
        const haystack = [
          knot?.name,
          knot?.aliases.join(" "),
          knot?.goodFor,
          knot?.bestFor.join(" "),
          row.tangleClass,
          TANGLE_LABELS[row.tangleClass],
          row.holdsBy.map((hold) => HOLDS_LABELS[hold]).join(" "),
          row.applicationNotes.join(" "),
          row.notFor.join(" "),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(needle);
      })
      .sort((a, b) => {
        const an = getKnot(a.knotId)?.name ?? a.knotId;
        const bn = getKnot(b.knotId)?.name ?? b.knotId;
        return an.localeCompare(bn);
      });
  }, [rows, q, tangle]);

  const setQuery = (next: string) => {
    navigate({
      search: (prev) => ({ ...prev, q: next.trim() ? next : undefined }),
      replace: true,
    });
  };

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <MicroLabel>Mode 05 · Use cases</MicroLabel>
          <h1 className="display-face mt-2 text-[2.125rem] leading-none sm:text-[2.375rem]">
            Where each knot fits
          </h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Start with the job, not the reputation. See what each knot is good at, where it starts to
            struggle, how it holds, and which nearby options are worth comparing.
          </p>
        </div>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {rows.length} {domain.label.toLowerCase()} use-case notes
        </p>
      </div>

      <ModePlate
        height="slim"
        eager
        {...plate("applications")}
        className="mb-6"
        statement={<>A strong knot can still be the wrong knot for the job.</>}
      />

      <Panel className="mb-6 p-5">
        <MicroLabel>What this section answers</MicroLabel>
        <div className="mt-3 grid gap-3 text-[0.8125rem] leading-relaxed text-muted-foreground sm:grid-cols-2 lg:grid-cols-4">
          <p><span className="font-medium text-foreground">Where to use it</span><br />Hook, lure, leader, loop, spool, or rope work.</p>
          <p><span className="font-medium text-foreground">Why it works</span><br />The grip, wrap, jam, or interlock doing the holding.</p>
          <p><span className="font-medium text-foreground">Where it struggles</span><br />Material, eye size, guide passage, field conditions, or load.</p>
          <p><span className="font-medium text-foreground">What to compare</span><br />Nearby knots that solve the same job differently.</p>
        </div>
      </Panel>

      <label className="relative mb-4 block">
        <span className="sr-only">Search knot use cases</span>
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Palomar, FG, leader, loop, braid…"
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 w-full rounded-md border border-hairline bg-card pl-10 pr-3 text-[0.9375rem] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter by connection style">
        <Chip
          active={!tangle}
          onClick={() =>
            navigate({ search: (prev) => ({ ...prev, class: undefined }), replace: true })
          }
        >
          All use cases
          <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{rows.length}</span>
        </Chip>
        {classes.map((item) => {
          const count = rows.filter((row) => row.tangleClass === item).length;
          return (
            <Chip
              key={item}
              active={tangle === item}
              onClick={() =>
                navigate({
                  search: (prev) => ({ ...prev, class: prev.class === item ? undefined : item }),
                  replace: true,
                })
              }
            >
              {TANGLE_LABELS[item]}
              <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{count}</span>
            </Chip>
          );
        })}
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {list.map((row) => {
          const knot = getKnot(row.knotId);
          if (!knot) return null;
          return (
            <li key={row.knotId}>
              <article className="panel ki-lift flex min-h-36 overflow-hidden">
                <Link
                  to="/applications/$id"
                  params={{ id: row.knotId }}
                  className="group flex min-w-0 flex-1"
                >
                  <div className="w-[118px] shrink-0 border-r border-hairline bg-surface-2/40 sm:w-[160px]">
                    <KnotDiagram
                      kind={knot.diagramKind}
                      compact
                      title={`${knot.name} — finished structure`}
                      className="aspect-[400/180] h-full w-full"
                    />
                  </div>
                  <span className="flex min-w-0 flex-1 flex-col justify-between p-5">
                    <span>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                        {TANGLE_LABELS[row.tangleClass]} · {row.holdsBy.map((hold) => HOLDS_LABELS[hold]).join(" · ")}
                      </span>
                      <span className="mt-1.5 block text-[1.125rem] font-semibold tracking-tight group-hover:text-accent">
                        {knot.name}
                      </span>
                    </span>
                    <span className="mt-3 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {knot.goodFor}
                    </span>
                  </span>
                </Link>
                <div className="flex shrink-0 flex-col justify-center border-l border-hairline">
                  <Link
                    to="/diagram/$knotId"
                    params={{ knotId: knot.id }}
                    className="inline-flex min-h-11 items-center px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    Guide
                  </Link>
                  <Link
                    to="/tie/$knotId"
                    params={{ knotId: knot.id }}
                    className="inline-flex min-h-11 items-center px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    Tie it
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      {list.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">
          Nothing matches. Try a knot name, line material, or a different connection style.
        </p>
      ) : null}
    </Shell>
  );
}
