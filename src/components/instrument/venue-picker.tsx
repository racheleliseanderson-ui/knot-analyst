import { Chip, MicroLabel } from "@/components/instrument/primitives";
import type { DomainVenue } from "@/domain/venue";
import { useT } from "@/i18n";

export function VenuePicker({
  venues,
  activeId,
  onPick,
  disabled,
}: {
  venues: DomainVenue[];
  activeId?: string;
  onPick: (venue: DomainVenue | undefined) => void;
  disabled?: boolean;
}) {
  const t = useT();
  const active = venues.find((v) => v.id === activeId);

  return (
    <div>
      <div className="ki-rail -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
        {venues.map((v) => (
          <span key={v.id} className="shrink-0">
            <Chip
              disabled={disabled}
              active={activeId === v.id}
              onClick={() => onPick(activeId === v.id ? undefined : v)}
            >
              {v.label}
            </Chip>
          </span>
        ))}
      </div>

      {active ? (
        <div className="ki-rise mt-3 space-y-2 rounded-lg border border-hairline/80 bg-surface-2/25 p-3">
          <p className="text-[0.8125rem] leading-relaxed text-foreground/85">{active.summary}</p>
          <div className="space-y-2 border-l-2 border-caution/50 pl-3">
            <div>
              <MicroLabel>{t("venue.punishes")}</MicroLabel>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {active.punishes}
              </p>
            </div>
            <div>
              <MicroLabel>{t("venue.watch")}</MicroLabel>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {active.watch}
              </p>
            </div>
            <div>
              <MicroLabel>{t("venue.fix")}</MicroLabel>
              <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
                {active.fix}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
