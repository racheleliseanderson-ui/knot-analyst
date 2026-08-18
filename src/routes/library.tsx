import { useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Shell } from "@/components/instrument/shell";
import { Chip, MicroLabel } from "@/components/instrument/primitives";
import { KnotDiagram } from "@/components/instrument/diagram";
import { FISHING_KNOTS, BOATING_KNOTS, knotsForDomain, searchKnots } from "@/data/catalog";
import { useDomain } from "@/domain/context";
import { CATEGORY_LABELS, DIFFICULTY_LABELS, type KnotCategory } from "@/domain/types";
import { useT } from "@/i18n";

type Search = { q?: string; job?: KnotCategory };

const JOBS = new Set<string>(Object.keys(CATEGORY_LABELS));
const str = (v: unknown) => (typeof v === "string" && v.length ? v : undefined);

export const Route = createFileRoute("/library")({
  validateSearch: (s: Record<string, unknown>): Search => {
    const job = str(s["job"]);
    return {
      q: str(s["q"]),
      job: job && JOBS.has(job) ? (job as KnotCategory) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Library — modelled connections | Knot Analyst" },
      {
        name: "description",
        content:
          "Browse every modelled fishing and boating connection. Open diagrams or the tying procedure — no Decide form required.",
      },
      { property: "og:title", content: "Library — modelled connections" },
      {
        property: "og:description",
        content:
          "The full Knot Analyst catalogue, searchable by name, alias and job. Diagrams and the step player are one tap away.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LibraryMode,
});

function aka(name: string, aliases: string[]) {
  return aliases.filter((a) => a.toLowerCase() !== name.toLowerCase());
}

function LibraryMode() {
  const t = useT();
  const domain = useDomain();
  const navigate = useNavigate({ from: "/library" });
  const search = Route.useSearch();
  const q = search.q ?? "";
  const category = search.job ?? "all";
  const pool = knotsForDomain(domain.id);
  const total = FISHING_KNOTS.length + BOATING_KNOTS.length;

  const categories = useMemo(() => {
    const set = new Set<KnotCategory>();
    for (const k of pool) set.add(k.category);
    return [...set].sort();
  }, [pool]);

  useEffect(() => {
    if (category !== "all" && !categories.includes(category)) {
      navigate({ search: (prev) => ({ ...prev, job: undefined }), replace: true });
    }
  }, [categories, category, navigate]);

  const list = useMemo(() => {
    const rows =
      category === "all"
        ? searchKnots(q, domain.id)
        : searchKnots(q, domain.id).filter((k) => k.category === category);
    return [...rows].sort((a, b) => a.name.localeCompare(b.name));
  }, [q, category, domain.id]);

  const setQuery = (next: string) => {
    navigate({
      search: (prev) => ({ ...prev, q: next.trim() ? next : undefined }),
      replace: true,
    });
  };

  const setCategory = (next: KnotCategory | "all") => {
    navigate({
      search: (prev) => ({
        ...prev,
        job: next === "all" ? undefined : next,
      }),
      replace: true,
    });
  };

  return (
    <Shell>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <MicroLabel>{t("library.mode")}</MicroLabel>
          <h1 className="mt-2 text-[2rem] font-semibold leading-none tracking-[-0.03em]">
            {t("library.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            {t("library.lede")}
          </p>
        </div>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {domain.label} · {pool.length} here · {total} modelled
        </p>
      </div>

      <label className="relative mb-4 block">
        <span className="sr-only">{t("library.search")}</span>
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          value={q}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("library.search")}
          autoComplete="off"
          spellCheck={false}
          className="min-h-11 w-full rounded-md border border-hairline bg-card pl-10 pr-3 text-[0.9375rem] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </label>

      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label={t("library.jobs")}>
        <Chip active={category === "all"} onClick={() => setCategory("all")}>
          {t("library.all")}
          <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{pool.length}</span>
        </Chip>
        {categories.map((c) => {
          const n = pool.filter((k) => k.category === c).length;
          return (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {CATEGORY_LABELS[c]}
              <span className="ml-2 font-mono text-[0.625rem] tabular-nums">{n}</span>
            </Chip>
          );
        })}
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {list.map((k) => {
          const extra = aka(k.name, k.aliases);
          return (
            <li key={k.id}>
              <article className="panel flex min-h-28 overflow-hidden">
                <Link
                  to="/diagram/$knotId"
                  params={{ knotId: k.id }}
                  className="group flex min-w-0 flex-1"
                >
                  <div className="w-[96px] shrink-0 border-r border-hairline bg-surface-2/40 sm:w-[132px]">
                    <KnotDiagram
                      kind={k.diagramKind}
                      title={`${k.name} — finished structure`}
                      className="aspect-[400/180] h-full w-full"
                    />
                  </div>
                  <span className="flex min-w-0 flex-1 flex-col justify-between p-4">
                    <span>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                        {CATEGORY_LABELS[k.category]} · {DIFFICULTY_LABELS[k.difficulty]} ·{" "}
                        {k.steps.length} {t("library.plates")}
                      </span>
                      <span className="mt-1 block text-[1.05rem] font-semibold tracking-tight group-hover:text-accent">
                        {k.name}
                      </span>
                      {extra.length ? (
                        <span className="mt-0.5 block truncate font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                          {extra.join(" · ")}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {k.goodFor}
                    </span>
                  </span>
                </Link>
                <Link
                  to="/tie/$knotId"
                  params={{ knotId: k.id }}
                  className="inline-flex shrink-0 items-center px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground sm:px-4"
                >
                  {t("library.tie")}
                </Link>
              </article>
            </li>
          );
        })}
      </ul>

      {list.length === 0 ? (
        <p className="mt-10 text-sm text-muted-foreground">{t("library.empty")}</p>
      ) : null}
    </Shell>
  );
}
