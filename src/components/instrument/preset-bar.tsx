import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Pin, Upload, X } from "lucide-react";
import { Chip, MicroLabel } from "@/components/instrument/primitives";
import {
  describePreset,
  downloadPresets,
  loadPresets,
  makePreset,
  orderPresets,
  parsePresets,
  savePresets,
  type Preset,
  type PresetSelection,
} from "@/lib/presets";
import type { ChooseInput } from "@/domain/types";
import { cn } from "@/lib/utils";

export interface PresetBarProps {
  domainId: string;
  input: Partial<ChooseInput>;
  sel: PresetSelection;
  venueId?: string;
  onLoad: (p: Preset) => void;
}

/**
 * Saved setups. Inputs only — the engine re-runs them, so a preset can
 * legitimately return a different call after a catalog change.
 */
export function PresetBar({ domainId, input, sel, venueId, onLoad }: PresetBarProps) {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [naming, setNaming] = useState(false);
  const [name, setName] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => setPresets(loadPresets()), []);
  useEffect(() => {
    if (naming) nameRef.current?.focus();
  }, [naming]);

  const commit = useCallback((next: Preset[]) => {
    setPresets(next);
    savePresets(next);
  }, []);

  const mine = orderPresets(presets.filter((p) => p.domainId === domainId));
  const canSave = Boolean(input.connection);

  const save = () => {
    if (!canSave) return;
    const label = name.trim() || `Setup ${mine.length + 1}`;
    commit([
      makePreset({ name: label, domainId, input, sel, ...(venueId ? { venueId } : {}) }),
      ...presets,
    ]);
    setName("");
    setNaming(false);
    setStatus(`Saved "${label}".`);
  };

  const ingest = async (file: File) => {
    try {
      const parsed = parsePresets(JSON.parse(await file.text()) as unknown);
      const known = new Set(presets.map((p) => p.id));
      const added = parsed.presets.filter((p) => !known.has(p.id));
      commit([...added, ...presets]);
      setStatus(
        `Imported ${added.length} of ${parsed.presets.length}.` +
          (parsed.errors.length ? ` Rejected: ${parsed.errors.join(" ")}` : ""),
      );
    } catch {
      setStatus("That file is not preset JSON. Nothing changed.");
    }
  };

  return (
    <section aria-label="Saved setups" className="no-print mb-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <MicroLabel>Saved setups · {mine.length}</MicroLabel>
        <div className="flex items-center gap-1.5">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void ingest(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            aria-label="Import saved setups from JSON"
            className="ki-press flex min-h-11 min-w-11 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-8 sm:min-w-8"
          >
            <Upload size={13} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => downloadPresets(presets)}
            disabled={presets.length === 0}
            aria-label="Export saved setups as JSON"
            className="ki-press flex min-h-11 min-w-11 items-center justify-center rounded-md border border-hairline text-muted-foreground hover:text-foreground disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-8 sm:min-w-8"
          >
            <Download size={13} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {mine.map((p) => (
          <span key={p.id} className="group inline-flex items-center">
            <button
              type="button"
              onClick={() => {
                onLoad(p);
                commit(
                  presets.map((x) =>
                    x.id === p.id ? { ...x, updatedAt: new Date().toISOString() } : x,
                  ),
                );
                setStatus(`Loaded "${p.name}".`);
              }}
              title={describePreset(p)}
              className={cn(
                "ki-press flex min-h-11 items-center gap-2 rounded-l-md border border-r-0 border-hairline px-3 text-[0.8125rem] tracking-tight text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9",
                p.pinned && "text-foreground",
              )}
            >
              {p.pinned ? <Pin size={11} aria-hidden="true" className="text-primary" /> : null}
              {p.name}
            </button>
            <button
              type="button"
              onClick={() =>
                commit(presets.map((x) => (x.id === p.id ? { ...x, pinned: !x.pinned } : x)))
              }
              aria-label={`${p.pinned ? "Unpin" : "Pin"} ${p.name}`}
              className="ki-press flex min-h-11 w-9 items-center justify-center border border-r-0 border-hairline text-muted-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
            >
              <Pin size={11} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => {
                commit(presets.filter((x) => x.id !== p.id));
                setStatus(`Deleted "${p.name}".`);
              }}
              aria-label={`Delete ${p.name}`}
              className="ki-press flex min-h-11 w-9 items-center justify-center rounded-r-md border border-hairline text-muted-foreground hover:border-destructive/50 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-9"
            >
              <X size={11} aria-hidden="true" />
            </button>
          </span>
        ))}

        {naming ? (
          <span className="inline-flex items-center gap-1.5">
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") save();
                if (e.key === "Escape") setNaming(false);
              }}
              placeholder="Name this setup"
              aria-label="Preset name"
              className="min-h-11 w-48 rounded-md border border-hairline bg-surface-2/40 px-3 text-[0.8125rem] text-foreground outline-none focus:border-primary/60 sm:min-h-9"
            />
            <Chip tone="signal" onClick={save}>
              Save
            </Chip>
          </span>
        ) : (
          <Chip
            tone="signal"
            onClick={() => (canSave ? setNaming(true) : setStatus("Declare a connection job first."))}
          >
            + Save current
          </Chip>
        )}
      </div>

      <p aria-live="polite" className="mt-2 min-h-[1rem] text-[0.75rem] text-muted-foreground">
        {status ?? (mine.length === 0 ? "Nothing saved for this discipline yet." : "")}
      </p>
    </section>
  );
}