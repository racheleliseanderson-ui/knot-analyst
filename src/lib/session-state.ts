/**
 * Session-scoped UI state — survives a refresh, dies with the tab.
 * Hydration-safe: the stored value is applied after mount, never during SSR.
 */
import { useCallback, useEffect, useRef, useState } from "react";

export function useSessionState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* session-only */
    }
    loaded.current = true;
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* session-only */
    }
  }, [key, value]);

  const set = useCallback((v: T | ((p: T) => T)) => setValue(v as T), []);
  return [value, set];
}
