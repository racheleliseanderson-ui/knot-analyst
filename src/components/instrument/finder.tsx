/**
 * Finder — keyboard-first search across scenarios, knots, symptoms, and use cases.
 * Every result is an action, not a page of prose.
 *
 * Filters narrow by result type and, for knots, by category, material fit and
 * difficulty. Matching is alias-aware and tolerates a single-character slip so
 * cold thumbs still land on the right knot.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { knotsForDomain, getKnot } from "@/data/catalog";
import { useDomain } from "@/domain/context";
import { playsForDomain } from "@/data/failure-playbook";
import { startersForDomain } from "@/data/diagnose-starters";
import { applicationsForDomain } from "@/data/applications";
import { MATERIAL_LABELS } from "@/domain/types";
import { useScenarios } from "@/lib/overlay";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type Group = "finder.scenarios" | "finder.knots" | "finder.symptoms" | "finder.applications";

interface Hit {
  id: string;
  group: Group;
  label: string;
  sub: string;
  hay: string;
  /** Knot-only facets, used by the filter rail */
  category?: string;
  materials?: string[];
  difficulty?: string;
  go: () => void;
}

/** Common shorthand anglers actually type. */
const ALIASES: Record<string, string> = {
  fg: "fg knot",
  fgk: "fg knot",
  du: "double uni",
  pk: "palomar",
  "wind knot": "tangle",
  pigtail: "curly slip",
  "riding turn": "winch override",
  bimini: "bimini twist",
  slim: "slim beauty",
  "no name": "no-name",
};

/** One-character slip tolerance — cheap, bounded, and only for whole words. */
function nearMiss(word: string, term: string): boolean {
  if (Math.abs(word.length - term.length) > 1) return false;
  let i = 0;
  let j = 0;
  let slips = 0;
  while (i < word.length && j < term.length) {
    if (word[i] === term[j]) {
      i += 1;
      j += 1;
      continue;
    }
    slips += 1;
    if (slips > 1) return false;
    if (word.length > term.length) i += 1;
    else if (word.length < term.length) j += 1;
    else {
      i += 1;
      j += 1;
    }
  }
  return slips + (word.length - i) + (term.length - j) <= 1;
}

function score(hay: string, q: string): number {
  if (!q) return 0;
  const raw = q.toLowerCase().trim();
  const expanded = ALIASES[raw] ? `${raw} ${ALIASES[raw]}` : raw;
  const terms = expanded.split(/\s+/).filter(Boolean);
  const words = hay.split(/[^a-z0-9]+/).filter(Boolean);
  let total = 0;
  for (const term of terms) {
    const i = hay.indexOf(term);
    if (i >= 0) {
      total += i === 0 ? 3 : 1;
      continue;
    }
    if (term.length >= 4 && words.some((word) => nearMiss(word, term))) {
      total += 0.5;
      continue;
    }
    return -1;
  }
  return total;
}

/** Highlights the typed run inside a label without dangerouslySetInnerHTML. */
function Highlight({ text, q }: { text: string; q: string }) {
  const needle = q.trim().toLowerCase();
  const at = needle ? text.toLowerCase().indexOf(needle) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <mark className="rounded-[2px] bg-primary/25 text-foreground">
        {text.slice(at, at + needle.length)}
      </mark>
      {text.slice(at + needle.length)}
    </>
  );
}

const GROUP_FILTERS: { id: Group; label: string }[] = [
  { id: "finder.scenarios", label: "Scenarios" },
  { id: "finder.knots", label: "Knots" },
  { id: "finder.symptoms", label: "Symptoms" },
  { id: "finder.applications", label: "Use cases" },
];

const RECENTS_KEY = "ki-finder-recents";

function readRecents(): string[] {
  try {
    const raw = sessionStorage.getItem(RECENTS_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "ki-press flex min-h-9 shrink-0 items-center rounded-md border px-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary/60 bg-primary/12 text-foreground"
          : "border-hairline text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Finder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const navigate = useNavigate();
  const domain = useDomain();
  const scenarios = useScenarios();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [groups, setGroups] = useState<Group[]>([]);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const [material, setMaterial] = useState<string | undefined>(undefined);
  const [difficulty, setDifficulty] = useState<string | undefined>(undefined);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = "ki-finder-list";

  const all = useMemo<Hit[]>(() => {
    const items: Hit[] = [];
    for (const scenario of scenarios) {
      items.push({
        id: `sc:${scenario.id}`,
        group: "finder.scenarios",
        label: scenario.title,
        sub: `${scenario.connectionLine} · ${scenario.tag}`,
        hay: `${scenario.title} ${scenario.blurb} ${scenario.tag} ${scenario.connectionLine}`.toLowerCase(),
        go: () => navigate({ to: "/", search: { scenario: scenario.id, run: true } }),
      });
    }
    for (const knot of knotsForDomain(domain.id)) {
      items.push({
        id: `kn:${knot.id}`,
        group: "finder.knots",
        label: knot.name,
        sub: knot.category.replace(/-/g, " "),
        hay: `${knot.name} ${knot.id} ${knot.category} ${knot.tags.join(" ")} ${knot.aliases?.join(" ") ?? ""}`.toLowerCase(),
        category: knot.category,
        materials: knot.lineMaterials,
        difficulty: knot.difficulty,
        go: () => navigate({ to: "/diagram/$knotId", params: { knotId: knot.id } }),
      });
    }
    for (const play of playsForDomain(domain.id)) {
      const starterBits = startersForDomain(domain.id)
        .filter((starter) => starter.input.event === play.id)
        .map((starter) => `${starter.title} ${starter.line}`)
        .join(" ");
      items.push({
        id: `fp:${play.id}`,
        group: "finder.symptoms",
        label: play.title,
        sub: "Diagnose",
        hay: `${play.title} ${play.plain} ${play.meaning} ${play.id} ${starterBits}`
          .toLowerCase()
          .replace(/-/g, " "),
        go: () => navigate({ to: "/diagnose", search: { event: play.id } }),
      });
    }
    for (const application of applicationsForDomain(domain.id)) {
      const knot = getKnot(application.knotId);
      if (!knot) continue;
      items.push({
        id: `ap:${application.knotId}`,
        group: "finder.applications",
        label: knot.name,
        sub: "Use case",
        hay: `${knot.name} ${knot.aliases.join(" ")} ${knot.goodFor} ${knot.bestFor.join(" ")} ${knot.notIdealFor.join(" ")} ${application.applicationNotes.join(" ")} ${application.notFor.join(" ")}`
          .toLowerCase()
          .replace(/-/g, " "),
        go: () => navigate({ to: "/applications/$id", params: { id: application.knotId } }),
      });
    }
    return items;
  }, [scenarios, navigate, domain.id]);

  const knotFacets = useMemo(() => {
    const cats = new Set<string>();
    const mats = new Set<string>();
    const diffs = new Set<string>();
    for (const hit of all) {
      if (hit.group !== "finder.knots") continue;
      if (hit.category) cats.add(hit.category);
      hit.materials?.forEach((m) => mats.add(m));
      if (hit.difficulty) diffs.add(hit.difficulty);
    }
    return {
      categories: [...cats].sort(),
      materials: [...mats].sort(),
      difficulties: ["beginner", "intermediate", "advanced"].filter((d) => diffs.has(d)),
    };
  }, [all]);

  const knotFiltersOn = Boolean(category || material || difficulty);

  const passes = (hit: Hit) => {
    if (groups.length && !groups.includes(hit.group)) return false;
    if (hit.group !== "finder.knots") return !knotFiltersOn;
    if (category && hit.category !== category) return false;
    if (material && !hit.materials?.includes(material as never)) return false;
    if (difficulty && hit.difficulty !== difficulty) return false;
    return true;
  };

  const counts = useMemo(() => {
    const map: Record<Group, number> = {
      "finder.scenarios": 0,
      "finder.knots": 0,
      "finder.symptoms": 0,
      "finder.applications": 0,
    };
    for (const hit of all) {
      if (!q.trim() || score(hit.hay, q) >= 0) map[hit.group] += 1;
    }
    return map;
  }, [all, q]);

  const hits = useMemo(() => {
    const pool = all.filter(passes);
    if (!q.trim()) {
      const recent = recents.map((id) => pool.find((hit) => hit.id === id)).filter(Boolean) as Hit[];
      const rest = pool
        .filter((hit) => !recent.includes(hit))
        .filter((hit) => (groups.length || knotFiltersOn ? true : hit.group === "finder.scenarios"));
      return [...recent, ...rest].slice(0, 8);
    }
    return pool
      .map((hit) => ({ hit, score: score(hit.hay, q.trim()) }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((item) => item.hit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, q, groups, category, material, difficulty, recents]);

  useEffect(() => setActive(0), [q, groups, category, material, difficulty]);

  useEffect(() => {
    if (open) {
      setRecents(readRecents());
      const id = window.setTimeout(() => inputRef.current?.focus(), 20);
      return () => window.clearTimeout(id);
    }
    setQ("");
    return undefined;
  }, [open]);

  if (!open) return null;

  const commit = (hit?: Hit) => {
    const target = hit ?? hits[active];
    if (!target) return;
    try {
      const next = [target.id, ...readRecents().filter((r) => r !== target.id)].slice(0, 4);
      sessionStorage.setItem(RECENTS_KEY, JSON.stringify(next));
    } catch {
      /* session storage unavailable — recents are a convenience only */
    }
    onClose();
    target.go();
  };

  const toggleGroup = (group: Group) =>
    setGroups((prev) =>
      prev.includes(group) ? prev.filter((item) => item !== group) : [...prev, group],
    );

  const showKnotFacets = groups.length === 0 || groups.includes("finder.knots");
  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-[10vh] backdrop-blur-sm no-print"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="ki-rise w-full max-w-[560px] overflow-hidden rounded-xl border border-hairline bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.searchHint")}
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <Search size={15} aria-hidden="true" className="shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setActive((i) => Math.min(hits.length - 1, i + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActive((i) => Math.max(0, i - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                commit();
              } else if (e.key === "Escape") {
                onClose();
              }
            }}
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={hits[active] ? `ki-hit-${hits[active].id}` : undefined}
            aria-label={t("nav.searchHint")}
            placeholder={t("finder.placeholder")}
            className="min-h-[52px] w-full bg-transparent text-[0.9375rem] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label={t("finder.close")}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        <div className="border-b border-hairline px-4 py-2">
          <div
            className="ki-rail flex gap-1.5 overflow-x-auto"
            role="group"
            aria-label="Result type"
          >
            {GROUP_FILTERS.map((group) => (
              <FilterChip
                key={group.id}
                active={groups.includes(group.id)}
                onClick={() => toggleGroup(group.id)}
              >
                {group.label}
                <span className="ml-1.5 tabular-nums text-muted-foreground">{counts[group.id]}</span>
              </FilterChip>
            ))}
          </div>
          {showKnotFacets ? (
            <div
              className="ki-rail mt-1.5 flex gap-1.5 overflow-x-auto"
              role="group"
              aria-label="Knot filters"
            >
              {knotFacets.categories.map((c) => (
                <FilterChip
                  key={c}
                  active={category === c}
                  onClick={() => setCategory(category === c ? undefined : c)}
                >
                  {c.replace(/-/g, " ")}
                </FilterChip>
              ))}
              {knotFacets.materials.map((m) => (
                <FilterChip
                  key={m}
                  active={material === m}
                  onClick={() => setMaterial(material === m ? undefined : m)}
                >
                  {MATERIAL_LABELS[m as keyof typeof MATERIAL_LABELS] ?? m}
                </FilterChip>
              ))}
              {knotFacets.difficulties.map((d) => (
                <FilterChip
                  key={d}
                  active={difficulty === d}
                  onClick={() => setDifficulty(difficulty === d ? undefined : d)}
                >
                  {d}
                </FilterChip>
              ))}
            </div>
          ) : null}
        </div>

        <ul id={listId} role="listbox" className="max-h-[50vh] overflow-y-auto py-1">
          {hits.length === 0 ? (
            <li className="px-4 py-6 text-[0.875rem] text-muted-foreground">{t("finder.empty")}</li>
          ) : (
            hits.map((hit, index) => {
              const header = hit.group !== lastGroup ? hit.group : null;
              lastGroup = hit.group;
              return (
                <li key={hit.id}>
                  {header ? <div className="label-micro px-4 pb-1 pt-3">{t(header)}</div> : null}
                  <button
                    id={`ki-hit-${hit.id}`}
                    type="button"
                    role="option"
                    aria-selected={index === active}
                    onMouseEnter={() => setActive(index)}
                    onClick={() => commit(hit)}
                    className={cn(
                      "ki-press flex min-h-11 w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors",
                      index === active
                        ? "bg-primary/12 text-foreground"
                        : "text-foreground/85 hover:bg-surface-2/50",
                    )}
                  >
                    <span className="text-[0.875rem] tracking-tight">
                      <Highlight text={hit.label} q={q} />
                    </span>
                    <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {hit.sub}
                    </span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      </div>
    </div>
  );
}
