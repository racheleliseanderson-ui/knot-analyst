import { useMemo } from "react";
import {
  createFileRoute,
  Link,
  Outlet,
  useChildMatches,
  useNavigate,
} from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Shell } from "@/components/instrument/shell";
import { Chip, MicroLabel, Panel } from "@/components/instrument/primitives";
import { KnotDiagram } from "@/components/instrument/diagram";
import { getKnot, FISHING_KNOTS, BOATING_KNOTS } from "@/data/catalog";
import {
  WORLD_ESSAYS,
  WORLD_GROUP_LABELS,
  TANGLE_LABELS,
  HOLDS_LABELS,
  applicationsForDomain,
  type TangleClass,
  type WorldGroup,
} from "@/data/applications";
import { useDomain } from "@/domain/context";
import { useT } from "@/i18n";

type Search = { q?: string; class?: TangleClass; world?: WorldGroup };

const CLASSES = new Set<string>(Object.keys(TANGLE_LABELS));
const GROUPS = new Set<string>(Object.keys(WORLD_GROUP_LABELS));
const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);
import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Path prefix for /applications and /applications/$id.
 * Without an Outlet the $id note never mounts — the list route wins the match.
 */
export const Route = createFileRoute("/applications")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const tangle = str(s["class"]);
    const world = str(s["world"]);
    return {
      q: str(s["q"]),
      class: tangle && CLASSES.has(tangle) ? (tangle as TangleClass) : undefined,
      world: world && GROUPS.has(world) ? (world as WorldGroup) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Applications — where the theory applies | Knot Analyst" },
      {
        name: "description",
        content:
          "What the physics actually says about these knots — and what it must never pick for you. This page does not run Decide.",
      },
      { property: "og:title", content: "Applications — where the theory applies" },
      {
        property: "og:description",
        content:
          "Physical hitch theory, twins like bowline and sheet bend, and a world atlas that cannot pick a knot for you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationsLayout,
});

function ApplicationsLayout() {
  const children = useChildMatches();
  if (children.length > 0) return <Outlet />;
  return <ApplicationsMode />;
}

function ApplicationsMode() {
  const t = useT();
  const domain = useDomain();
  const navigate = useNavigate({ from: "/applications" });
  const search = Route.useSearch();
  const q = search.q ?? "";
  const tangle = search.class;
  const worldGroup = search.world;
  const rows = applicationsForDomain(domain.id);
  const total = FISHING_KNOTS.length + BOATING_KNOTS.length;

  const classes = useMemo(() => {
    const set = new Set<TangleClass>();
    for (const r of rows) set.add(r.tangleClass);
    return [...set].sort((a, b) => TANGLE_LABELS[a].localeCompare(TANGLE_LABELS[b]));
  }, [rows]);

  const world = useMemo(() => {
    const list = worldGroup ? WORLD_ESSAYS.filter((w) => w.group === worldGroup) : WORLD_ESSAYS;
    const needle = q.trim().toLowerCase();
    if (!needle) return list;
    return list.filter((w) =>
      `${w.title} ${w.lede} ${w.meaning} ${w.id}`.toLowerCase().includes(needle),
    );
  }, [q, worldGroup]);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return rows
      .filter((r) => !tangle || r.tangleClass === tangle)
      .filter((r) => {
        if (!needle) return true;
        const k = getKnot(r.knotId);
        const hay = [
          k?.name,
          k?.aliases.join(" "),
          r.tangleClass,
          TANGLE_LABELS[r.tangleClass],
          r.holdsBy.map((h) => HOLDS_LABELS[h]).join(" "),
          r.duals.map((d) => d.knotId).join(" "),
          r.extraDomains.join(" "),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(needle);
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
          <MicroLabel>{t("applications.mode")}</MicroLabel>
          <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
            {t("applications.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {t("applications.lede")}
          </p>
        </div>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {domain.label} · {rows.length} of {total} knots · {WORLD_ESSAYS.length} essays
        </p>
      </div>

      <Panel className="mb-8 px-4 py-3">
        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
          {t("applications.isolation")}
        </p>
      </Panel>

      <label className="relative mb-4 block">
        <span className="sr-only">{t("applications.search")}</span>
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("applications.search")}
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 w-full rounded-md border border-hairline bg-card pl-10 pr-3 text-[0.9375rem] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <section className="mb-10">
        <MicroLabel>{t("applications.world")}</MicroLabel>
        <div
          className="mt-3 mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label={t("applications.world")}
        >
          <Chip
            active={!worldGroup}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, world: undefined }), replace: true })
            }
          >
            {t("applications.allWorld")}
            <span className="ml-2 font-mono text-[0.625rem] tabular-nums">
              {WORLD_ESSAYS.length}
            </span>
          </Chip>
          {(Object.keys(WORLD_GROUP_LABELS) as WorldGroup[]).map((g) => {
            const n = WORLD_ESSAYS.filter((w) => w.group === g).length;
            return (
              <Chip
                key={g}
                active={worldGroup === g}
                onClick={() =>
                  navigate({
                    search: (prev) => ({ ...prev, world: prev.world === g ? undefined : g }),
                    replace: true,
                  })
                }
              >
                {WORLD_GROUP_LABELS[g]}
                <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{n}</span>
              </Chip>
            );
          })}
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {world.map((w) => (
            <li key={w.id}>
              <Link
                to="/applications/$id"
                params={{ id: w.id }}
                className="panel block min-h-28 p-4 hover:border-primary/40"
              >
                <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                  {WORLD_GROUP_LABELS[w.group]} · does not pick a knot
                </span>
                <span className="mt-1 block text-[1.05rem] font-semibold tracking-tight">
                  {w.title}
                </span>
                <span className="mt-2 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                  {w.lede}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <MicroLabel>{t("applications.connections")}</MicroLabel>
        <div
          className="mt-3 mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label={t("applications.classes")}
        >
          <Chip
            active={!tangle}
            onClick={() =>
              navigate({ search: (prev) => ({ ...prev, class: undefined }), replace: true })
            }
          >
            {t("applications.allClasses")}
            <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{rows.length}</span>
          </Chip>
          {classes.map((c) => {
            const n = rows.filter((r) => r.tangleClass === c).length;
            return (
              <Chip
                key={c}
                active={tangle === c}
                onClick={() =>
                  navigate({
                    search: (prev) => ({ ...prev, class: prev.class === c ? undefined : c }),
                    replace: true,
                  })
                }
              >
                {TANGLE_LABELS[c]}
                <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{n}</span>
              </Chip>
            );
          })}
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {list.map((r) => {
            const k = getKnot(r.knotId);
            if (!k) return null;
            return (
              <li key={r.knotId}>
                <article className="panel flex min-h-28 overflow-hidden">
                  <Link
                    to="/applications/$id"
                    params={{ id: r.knotId }}
                    className="group flex min-w-0 flex-1"
                  >
                    <div className="w-[96px] shrink-0 border-r border-hairline bg-surface-2/40 sm:w-[132px]">
                      <KnotDiagram
                        kind={k.diagramKind}
                        compact
                        title={`${k.name} — finished structure`}
                        className="aspect-[400/180] h-full w-full"
                      />
                    </div>
                    <span className="flex min-w-0 flex-1 flex-col justify-between p-4">
                      <span>
                        <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                          {TANGLE_LABELS[r.tangleClass]} ·{" "}
                          {r.holdsBy.map((h) => HOLDS_LABELS[h]).join(" · ")}
                        </span>
                        <span className="mt-1 block text-[1.05rem] font-semibold tracking-tight group-hover:text-accent">
                          {k.name}
                        </span>
                      </span>
                      <span className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                        {r.applicationNotes[0]}
                      </span>
                    </span>
                  </Link>
                  <div className="flex shrink-0 flex-col justify-center border-l border-hairline">
                    <Link
                      to="/diagram/$knotId"
                      params={{ knotId: k.id }}
                      className="inline-flex min-h-11 items-center px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                    >
                      {t("applications.diagram")}
                    </Link>
                    <Link
                      to="/tie/$knotId"
                      params={{ knotId: k.id }}
                      className="inline-flex min-h-11 items-center px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                    >
                      {t("library.tie")}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
        {list.length === 0 ? (
          <p className="mt-10 text-sm text-muted-foreground">{t("applications.empty")}</p>
        ) : null}
      </section>
    </Shell>
  );
}
  component: () => <Outlet />,
});
