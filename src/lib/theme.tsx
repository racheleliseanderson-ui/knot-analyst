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

export const THEME_BOOT_SCRIPT = `(function(){try{var t=localStorage.getItem('${KEY}');var r=document.documentElement;r.classList.toggle('light',t==='light'||t==='cb');r.classList.toggle('cb',t==='cb');}catch(e){}})();`;

function apply(theme: Appearance) {
  const r = document.documentElement;
  r.classList.toggle("light", theme === "light" || theme === "cb");
  r.classList.toggle("cb", theme === "cb");
}

function isAppearance(v: string | null): v is Appearance {
  return v === "dark" || v === "light" || v === "cb";
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

  const toggle = useCallback(
    () => set(theme === "dark" ? "light" : theme === "light" ? "cb" : "dark"),
    [theme, set],
  );

  return { theme, setTheme: set, toggle };
}
