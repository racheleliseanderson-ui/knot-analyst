import { useCallback, useEffect, useState } from "react";

/** dark · light · cb (high-contrast, colour-vision-safe signals) · atelier (editorial) */
export type Appearance = "dark" | "light" | "cb" | "atelier";
export type Theme = Appearance;

const KEY = "ki-theme";
export const APPEARANCES: Appearance[] = ["dark", "light", "atelier", "cb"];
export const APPEARANCE_LABELS: Record<Appearance, string> = {
  dark: "Dark",
  light: "Light",
  cb: "Colour-blind safe",
  atelier: "Atelier",
};

/** One line per mode, so nobody has to infer the difference from a swatch. */
export const APPEARANCE_NOTES: Record<Appearance, string> = {
  dark: "Deep harbour slate. The working default.",
  light: "Paper base for daylight and print setup.",
  cb: "High contrast, colour-vision-safe signals. Patterns carry state.",
  atelier: "Editorial reading: near-black teal, brass and bone, wider measure.",
};

export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${KEY}');var r=document.documentElement;r.classList.toggle('light',t==='light'||t==='cb');r.classList.toggle('cb',t==='cb');r.classList.toggle('atelier',t==='atelier');}catch(e){}})();`;

function apply(theme: Appearance) {
  const r = document.documentElement;
  r.classList.toggle("light", theme === "light" || theme === "cb");
  r.classList.toggle("cb", theme === "cb");
  r.classList.toggle("atelier", theme === "atelier");
}

function isAppearance(v: string | null): v is Appearance {
  return v === "dark" || v === "light" || v === "cb" || v === "atelier";
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
    const initial: Appearance = isAppearance(stored)
      ? stored
      : document.documentElement.classList.contains("light")
        ? "light"
        : "dark";
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
