/**
 * Persistent instrument preferences — active domain and interface language.
 * Applied before paint by PREFS_BOOT_SCRIPT so vocabulary never flashes.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type DomainPref = "fishing" | "boating";
export type Locale = "en" | "es";

const DOMAIN_KEY = "ki-domain";
const LOCALE_KEY = "ki-locale";

export const PREFS_BOOT_SCRIPT = `(function(){try{var d=localStorage.getItem('${DOMAIN_KEY}');var l=localStorage.getItem('${LOCALE_KEY}');var r=document.documentElement;r.setAttribute('data-domain',d==='boating'?'boating':'fishing');if(l==='es'||l==='en')r.setAttribute('lang',l);}catch(e){}})();`;

interface PrefsValue {
  domain: DomainPref;
  locale: Locale;
  setDomain: (d: DomainPref) => void;
  setLocale: (l: Locale) => void;
}

const PrefsContext = createContext<PrefsValue | null>(null);

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return allowed.includes(v as T) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [domain, setDomainState] = useState<DomainPref>("fishing");
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    setDomainState(read(DOMAIN_KEY, ["fishing", "boating"] as const, "fishing"));
    setLocaleState(read(LOCALE_KEY, ["en", "es"] as const, "en"));
  }, []);

  const setDomain = useCallback((d: DomainPref) => {
    setDomainState(d);
    document.documentElement.setAttribute("data-domain", d);
    try {
      localStorage.setItem(DOMAIN_KEY, d);
    } catch {
      /* session-only */
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.documentElement.setAttribute("lang", l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch {
      /* session-only */
    }
  }, []);

  const value = useMemo(
    () => ({ domain, locale, setDomain, setLocale }),
    [domain, locale, setDomain, setLocale],
  );
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs(): PrefsValue {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
