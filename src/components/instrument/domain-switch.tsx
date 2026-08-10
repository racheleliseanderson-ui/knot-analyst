import { Anchor, Fish } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePrefs, type DomainPref } from "@/lib/prefs";
import { useT } from "@/i18n";

const OPTIONS: { id: DomainPref; icon: typeof Fish; key: "domain.fishing" | "domain.boating"; short: string }[] = [
  { id: "fishing", icon: Fish, key: "domain.fishing", short: "Fish" },
  { id: "boating", icon: Anchor, key: "domain.boating", short: "Boat" },
];

export function DomainSwitch({ onChange }: { onChange?: (d: DomainPref) => void }) {
  const { domain, setDomain } = usePrefs();
  const t = useT();

  return (
    <div
      role="radiogroup"
      aria-label={t("domain.label")}
      className="flex items-center gap-0.5 rounded-md border border-hairline bg-surface-2/40 p-0.5"
    >
      {OPTIONS.map((o) => {
        const Icon = o.icon;
        const active = domain === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={t(o.key)}
            onClick={() => {
              if (active) return;
              setDomain(o.id);
              onChange?.(o.id);
            }}
            className={cn(
              "ki-press flex min-h-11 items-center gap-1.5 rounded-[5px] px-2.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] transition-colors sm:min-h-8 sm:px-3",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              active
                ? "bg-primary/20 text-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--primary)_45%,transparent)]"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon size={13} aria-hidden="true" />
            <span className="hidden sm:inline">{t(o.key)}</span>
            <span className="sm:hidden">{o.short}</span>
          </button>
        );
      })}
    </div>
  );
}
