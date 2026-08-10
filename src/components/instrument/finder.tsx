/**
 * Finder — keyboard-first search across scenarios, knots and symptoms.
 * Every result is an action, not a page of prose.
 *
 * Filters narrow by result type and, for knots, by category, material fit and
 * difficulty. Matching is alias-aware and tolerates a single-character slip so
 * cold thumbs still land on the right knot.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { KNOTS } from "@/data/catalog";
import { FAILURE_PLAYS } from "@/data/failure-playbook";
import { MATERIAL_LABELS } from "@/domain/types";
import { useScenarios } from "@/lib/overlay";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

type Group = "finder.scenarios" | "finder.knots" | "finder.symptoms";

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
  for (const t of terms) {
    const i = hay.indexOf(t);
    if (i >= 0) {
      total += i === 0 ? 3 : 1;
      continue;
    }
    if (t.length >= 4 && words.some((w) => nearMiss(w, t))) {
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
    for (const s of scenarios) {
      items.push({
        id: `sc:${s.id}`,
        group: "finder.scenarios",
        label: s.title,
        sub: `${s.connectionLine} · ${s.tag}`,
        hay: `${s.title} ${s.blurb} ${s.tag} ${s.connectionLine}`.toLowerCase(),
        go: () => navigate({ to: "/", search: { scenario: s.id, run: true } }),
      });
    }
    for (const k of KNOTS) {
      items.push({
        id: `kn:${k.id}`,
        group: "finder.knots",
        label: k.name,
        sub: k.category.replace(/-/g, " "),
        hay: `${k.name} ${k.id} ${k.category} ${k.tags.join(" ")} ${k.aliases?.join(" ") ?? ""}`.toLowerCase(),
        category: k.category,
        materials: k.lineMaterials,
        difficulty: k.difficulty,
        go: () => navigate({ to: "/tie/$knotId", params: { knotId: k.id } }),
      });
    }
    for (const p of FAILURE_PLAYS) {
      items.push({
        id: `fp:${p.id}`,
        group: "finder.symptoms",
        label: p.title,
        sub: "Diagnose",
        hay: `${p.title} ${p.id}`.toLowerCase().replace(/-/g, " "),
        go: () => navigate({ to: "/diagnose", search: { event: p.id } }),
      });
    }
    return items;
  }, [scenarios, navigate]);

  const knotFacets = useMemo(() => {
    const cats = new Set<string>();
    const mats = new Set<string>();
    const diffs = new Set<string>();
    for (const h of all) {
      if (h.group !== "finder.knots") continue;
      if (h.category) cats.add(h.category);
      h.materials?.forEach((m) => mats.add(m));
      if (h.difficulty) diffs.add(h.difficulty);
    }
    return {
      categories: [...cats].sort(),
      materials: [...mats].sort(),
      difficulties: ["beginner", "intermediate", "advanced"].filter((d) => diffs.has(d)),
    };
  }, [all]);

  const knotFiltersOn = Boolean(category || material || difficulty);

  const passes = (h: Hit) => {
    if (groups.length && !groups.includes(h.group)) return false;
    if (h.group !== "finder.knots") return !knotFiltersOn;
    if (category && h.category !== category) return false;
    if (material && !h.materials?.includes(material as never)) return false;
    if (difficulty && h.difficulty !== difficulty) return false;
    return true;
  };

  const counts = useMemo(() => {
    const map: Record<Group, number> = {
      "finder.scenarios": 0,
      "finder.knots": 0,
      "finder.symptoms": 0,
    };
    for (const h of all) {
      if (!q.trim() || score(h.hay, q) >= 0) map[h.group] += 1;
    }
    return map;
  }, [all, q]);

  const hits = useMemo(() => {
    const pool = all.filter(passes);
    if (!q.trim()) {
      const recent = recents
        .map((id) => pool.find((h) => h.id === id))
        .filter(Boolean) as Hit[];
      const rest = pool
        .filter((h) => !recent.includes(h))
        .filter((h) => (groups.length || knotFiltersOn ? true : h.group === "finder.scenarios"));
      return [...recent, ...rest].slice(0, 8);
    }
    return pool
      .map((h) => ({ h, s: score(h.hay, q.trim()) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.h);
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

  const toggleGroup = (g: Group) =>
    setGroups((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

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

        {/* Filters */}
        <div className="border-b border-hairline px-4 py-2">
          <div className="ki-rail flex gap-1.5 overflow-x-auto" role="group" aria-label="Result type">
            {GROUP_FILTERS.map((g) => (
              <FilterChip
                key={g.id}
                active={groups.includes(g.id)}
                onClick={() => toggleGroup(g.id)}
              >
                {g.label}
                <span className="ml-1.5 tabular-nums text-muted-foreground">{counts[g.id]}</span>
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
            hits.map((h, i) => {
              const header = h.group !== lastGroup ? h.group : null;
              lastGroup = h.group;
              return (
                <li key={h.id}>
                  {header ? (
                    <div className="label-micro px-4 pb-1 pt-3">{t(header)}</div>
                  ) : null}
                  <button
                    id={`ki-hit-${h.id}`}
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => commit(h)}
                    className={cn(
                      "ki-press flex min-h-11 w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors",
                      i === active
                        ? "bg-primary/12 text-foreground"
                        : "text-foreground/85 hover:bg-surface-2/50",
                    )}
                  >
                    <span className="text-[0.875rem] tracking-tight">
                      <Highlight text={h.label} q={q} />
                    </span>
                    <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
                      {h.sub}
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
