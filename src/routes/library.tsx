import { useEffect, useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Shell } from "@/components/instrument/shell";
import { ModePlate } from "@/components/instrument/mode-plate";
import { plate } from "@/components/instrument/plates";
import { Chip, MicroLabel } from "@/components/instrument/primitives";
import { KnotDiagram } from "@/components/instrument/diagram";
import { knotsForDomain, searchKnots } from "@/data/catalog";
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
      { title: "Library — fishing and boat knots | Knot Analyst" },
      {
        name: "description",
        content:
          "Browse fishing and boat knots by name or job. Open a knot for its finished diagram, practical field guide, and step-by-step tying instructions.",
      },
      { property: "og:title", content: "Knot Library — fishing and boat knots" },
      {
        property: "og:description",
        content: "Search by name or kind, then open the field guide, diagram, or tying steps.",
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
          <h1 className="display-face mt-2 text-[2.125rem] leading-none sm:text-[2.375rem]">
            {t("library.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-muted-foreground">
            Search by name or job. Each knot opens to a larger diagram, line compatibility, strength notes,
            field conditions, failure checks, alternatives, and the full tying sequence.
          </p>
        </div>
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
          {pool.length} {domain.label.toLowerCase()} knots
        </p>
      </div>

      <ModePlate
        height="slim"
        eager
        {...plate("library")}
        className="mb-6"
        statement={<>Find the knot, see where it fits, then open the full guide or tying steps.</>}
      />

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

      <ul className="grid gap-4 md:grid-cols-2">
        {list.map((k) => {
          const extra = aka(k.name, k.aliases);
          return (
            <li key={k.id}>
              <article className="panel ki-lift flex min-h-36 overflow-hidden">
                <Link
                  to="/diagram/$knotId"
                  params={{ knotId: k.id }}
                  className="group flex min-w-0 flex-1"
                >
                  <div className="vitrine w-[118px] shrink-0 border-r border-hairline sm:w-[160px]">
                    <KnotDiagram
                      kind={k.diagramKind}
                      title={`${k.name} — finished structure`}
                      compact
                      className="aspect-[400/180] h-full w-full"
                    />
                  </div>
                  <span className="flex min-w-0 flex-1 flex-col justify-between p-5">
                    <span>
                      <span className="font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground">
                        {CATEGORY_LABELS[k.category]} · {DIFFICULTY_LABELS[k.difficulty]} ·{" "}
                        {k.steps.length} {t("library.plates")}
                      </span>
                      <span className="mt-1.5 block text-[1.125rem] font-semibold tracking-tight group-hover:text-accent">
                        {k.name}
                      </span>
                      {extra.length ? (
                        <span className="mt-1 block truncate font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                          {extra.join(" · ")}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-3 line-clamp-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
                      {k.goodFor}
                    </span>
                  </span>
                </Link>
                <Link
                  to="/tie/$knotId"
                  params={{ knotId: k.id }}
                  className="inline-flex shrink-0 items-center border-l border-hairline px-3 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground sm:px-4"
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
