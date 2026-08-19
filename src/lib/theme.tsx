import { useCallback, useEffect, useState } from "react";

/** dark · light · cb (high-contrast, colour-vision-safe signals) */
export type Appearance = "dark" | "light" | "cb";
export type Theme = Appearance;

const KEY = "ki-theme";
export const APPEARANCES: Appearance[] = ["dark", "light", "cb"];
export const APPEARANCE_LABELS: Record<Appearance, string> = {
  dark: "Dark",
  light: "Light",
  cb: "Colour-blind safe",
};

/** One line per mode, so nobody has to infer the difference from a swatch. */
export const APPEARANCE_NOTES: Record<Appearance, string> = {
  dark: "Deep harbour slate. The working default.",
  light: "Soft instrument light for daylight — cooler grey, not pure white.",
  cb: "High contrast, colour-vision-safe signals. Patterns carry state.",
};

export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${KEY}');if(t==='atelier')t='dark';var r=document.documentElement;r.classList.remove('atelier');r.classList.toggle('light',t==='light'||t==='cb');r.classList.toggle('cb',t==='cb');}catch(e){}})();`;

function apply(theme: Appearance) {
  const r = document.documentElement;
  r.classList.remove("atelier");
  r.classList.toggle("light", theme === "light" || theme === "cb");
  r.classList.toggle("cb", theme === "cb");
}

function isAppearance(v: string | null): v is Appearance {
  return v === "dark" || v === "light" || v === "cb";
}

/** Map removed themes (atelier) and unknowns to a live appearance. */
function migrateStored(v: string | null): Appearance | null {
  if (isAppearance(v)) return v;
  if (v === "atelier") return "dark";
  return null;
}

export function useTheme() {
  const [theme, setTheme] = useState<Appearance>("dark");

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(KEY);
    } catch {
      stored = null;
    }
    const migrated = migrateStored(stored);
    const initial: Appearance =
      migrated ?? (document.documentElement.classList.contains("light") ? "light" : "dark");
    if (stored === "atelier") {
      try {
        localStorage.setItem(KEY, "dark");
      } catch {
        /* session-only */
      }
    }
    setTheme(initial);
    apply(initial);
  }, []);

  const set = useCallback((next: Appearance) => {
    setTheme(next);
    apply(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      /* storage unavailable — session-only theme */
    }
  }, []);

  const toggle = useCallback(() => {
    const i = APPEARANCES.indexOf(theme);
    set(APPEARANCES[(i + 1) % APPEARANCES.length] ?? "dark");
  }, [theme, set]);

  return { theme, setTheme: set, toggle };
}
