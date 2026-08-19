import { Chip, MicroLabel } from "@/components/instrument/primitives";
import { activeRegion, broadRegions, fineRegionsFor, type DomainRegion } from "@/domain/region";
import { useT } from "@/i18n";

/**
 * US region picker — broad chips, optional fine second row.
 * Soft prior only: conditions load into chips; advisories show as callout.
 */
export function RegionPicker({
  regions,
  broadId,
  fineId,
  onPickBroad,
  onPickFine,
  disabled,
}: {
  regions: DomainRegion[];
  broadId?: string;
  fineId?: string;
  onPickBroad: (id: string | undefined) => void;
  onPickFine: (id: string | undefined) => void;
  disabled?: boolean;
}) {
  const t = useT();
  const broad = broadRegions(regions);
  const fine = fineRegionsFor(regions, broadId);
  const active = activeRegion(regions, broadId, fineId);

  return (
    <div className="space-y-4">
      <div>
        <MicroLabel className="mb-2">{t("region.broad")}</MicroLabel>
        <div className="ki-rail -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
          {broad.map((r) => (
            <span key={r.id} className="shrink-0">
              <Chip
                disabled={disabled}
                active={broadId === r.id}
                onClick={() => onPickBroad(broadId === r.id ? undefined : r.id)}
              >
                {r.label}
              </Chip>
            </span>
          ))}
        </div>
      </div>

      {broadId && fine.length > 0 ? (
        <div>
          <MicroLabel className="mb-2">{t("region.fine")}</MicroLabel>
          <p className="mb-2 text-[0.75rem] leading-relaxed text-muted-foreground">
            {t("region.fineHint")}
          </p>
          <div className="ki-rail -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
            {fine.map((r) => (
              <span key={r.id} className="shrink-0">
                <Chip
                  disabled={disabled}
                  active={fineId === r.id}
                  onClick={() => onPickFine(fineId === r.id ? undefined : r.id)}
                >
                  {r.label}
                </Chip>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {active ? (
        <div className="ki-rise space-y-2 rounded-lg border border-hairline/80 bg-surface-2/25 p-3">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.14em] text-primary">
            {t("region.prior")} · {active.label}
          </p>
          <p className="text-[0.8125rem] leading-relaxed text-foreground/85">{active.summary}</p>
          <ul className="space-y-1.5 border-l-2 border-accent/40 pl-3">
            {active.advisories.map((line) => (
              <li key={line} className="text-[0.8125rem] leading-relaxed text-muted-foreground">
                {line}
              </li>
            ))}
          </ul>
          <p className="text-[0.6875rem] leading-relaxed text-muted-foreground/80">
            {t("region.override")}
          </p>
        </div>
      ) : (
        <p className="text-[0.75rem] text-muted-foreground">{t("region.none")}</p>
      )}
    </div>
  );
}
