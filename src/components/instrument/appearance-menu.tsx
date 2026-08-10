import { useEffect, useRef, useState } from "react";
import { Contrast, Moon, PenTool, Sun } from "lucide-react";
import {
  APPEARANCES,
  APPEARANCE_LABELS,
  APPEARANCE_NOTES,
  useTheme,
  type Appearance,
} from "@/lib/theme";
import { cn } from "@/lib/utils";

const ICONS: Record<Appearance, typeof Moon> = {
  dark: Moon,
  light: Sun,
  cb: Contrast,
  atelier: PenTool,
};

/** Explicit appearance picker. Cycling a four-state toggle blind is not a control. */
export function AppearanceMenu() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const Icon = ICONS[theme];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative ml-1">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Appearance: ${APPEARANCE_LABELS[theme]}. Change appearance.`}
        title={`Appearance — ${APPEARANCE_LABELS[theme]}`}
        className="ki-press flex min-h-11 min-w-11 touch-manipulation items-center justify-center rounded-md border border-hairline text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-h-9 sm:min-w-9"
      >
        <Icon size={15} aria-hidden="true" />
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Appearance"
          className="ki-rise absolute right-0 top-[calc(100%+8px)] z-50 w-[17rem] rounded-lg border border-hairline bg-card p-1.5 shadow-2xl"
        >
          {APPEARANCES.map((a) => {
            const A = ICONS[a];
            const active = a === theme;
            return (
              <button
                key={a}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                onClick={() => {
                  setTheme(a);
                  setOpen(false);
                  btnRef.current?.focus();
                }}
                className={cn(
                  "flex w-full min-h-11 items-start gap-3 rounded-md px-2.5 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  active ? "bg-primary/12 text-foreground" : "text-muted-foreground hover:bg-surface-2/60 hover:text-foreground",
                )}
              >
                <A size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-[0.8125rem] font-medium tracking-tight">
                    {APPEARANCE_LABELS[a]}
                    {active ? <span className="ml-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-primary">active</span> : null}
                  </span>
                  <span className="mt-0.5 block text-[0.6875rem] leading-snug text-muted-foreground">
                    {APPEARANCE_NOTES[a]}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
