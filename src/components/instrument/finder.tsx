/**
 * Finder — keyboard-first search across scenarios, knots and symptoms.
 * Every result is an action, not a page of prose.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { KNOTS } from "@/data/catalog";
import { FAILURE_PLAYS } from "@/data/failure-playbook";
import { useScenarios } from "@/lib/overlay";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

interface Hit {
  id: string;
  group: "finder.scenarios" | "finder.knots" | "finder.symptoms";
  label: string;
  sub: string;
  hay: string;
  go: () => void;
}

function score(hay: string, q: string): number {
  if (!q) return 0;
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  let total = 0;
  for (const t of terms) {
    const i = hay.indexOf(t);
    if (i < 0) return -1;
    total += i === 0 ? 3 : 1;
  }
  return total;
}

export function Finder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const navigate = useNavigate();
  const scenarios = useScenarios();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
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
        hay: `${k.name} ${k.id} ${k.category} ${k.aliases?.join(" ") ?? ""}`.toLowerCase(),
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

  const hits = useMemo(() => {
    if (!q.trim()) return all.filter((h) => h.group === "finder.scenarios").slice(0, 6);
    return all
      .map((h) => ({ h, s: score(h.hay, q.trim()) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 12)
      .map((x) => x.h);
  }, [all, q]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    if (open) {
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
    onClose();
    target.go();
  };

  let lastGroup = "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-background/80 px-4 pt-[12vh] backdrop-blur-sm no-print"
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

        <ul id={listId} role="listbox" className="max-h-[52vh] overflow-y-auto py-1">
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
                      "flex min-h-11 w-full items-baseline justify-between gap-4 px-4 py-2.5 text-left transition-colors",
                      i === active ? "bg-primary/12 text-foreground" : "text-foreground/85 hover:bg-surface-2/50",
                    )}
                  >
                    <span className="text-[0.875rem] tracking-tight">{h.label}</span>
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
