import { usePrefs, type Locale } from "@/lib/prefs";
import { useT } from "@/i18n";
import { cn } from "@/lib/utils";

const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "es", label: "ES" },
];

export function LocaleSwitch() {
  const { locale, setLocale } = usePrefs();
  const t = useT();
  return (
    <div
      role="radiogroup"
      aria-label={t("lang.label")}
      className="flex items-center rounded-md border border-hairline"
    >
      {LOCALES.map((l) => {
        const active = locale === l.id;
        return (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={l.id === "en" ? "English" : "Español"}
            onClick={() => setLocale(l.id)}
            className={cn(
              "ki-press flex min-h-11 min-w-9 items-center justify-center px-1.5 font-mono text-[0.625rem] tracking-[0.14em] transition-colors first:rounded-l-[5px] last:rounded-r-[5px] sm:min-h-8",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
              active
                ? "bg-primary/20 text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
