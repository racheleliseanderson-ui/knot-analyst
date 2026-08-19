import { Chip, MicroLabel } from "@/components/instrument/primitives";
import type { DomainVenue } from "@/domain/venue";
import { useT } from "@/i18n";

function Callout({ venue }: { venue: DomainVenue }) {
  const t = useT();
  return (
    <div className="ki-rise space-y-2 rounded-lg border border-hairline/80 bg-surface-2/25 p-3">
      <p className="text-[0.8125rem] leading-relaxed text-foreground/85">{venue.summary}</p>
      <div className="space-y-2 border-l-2 border-caution/50 pl-3">
        <div>
          <MicroLabel>{t("venue.punishes")}</MicroLabel>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {venue.punishes}
          </p>
        </div>
        <div>
          <MicroLabel>{t("venue.watch")}</MicroLabel>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {venue.watch}
          </p>
        </div>
        <div>
          <MicroLabel>{t("venue.fix")}</MicroLabel>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">{venue.fix}</p>
        </div>
      </div>
    </div>
  );
}

function ChipRail({
  items,
  activeId,
  disabled,
  onPick,
}: {
  items: DomainVenue[];
  activeId?: string;
  disabled?: boolean;
  onPick: (venue: DomainVenue | undefined) => void;
}) {
  return (
    <div className="ki-rail -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
      {items.map((v) => (
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
  );
}

/**
 * Venue picker. When `platforms` is supplied (Fishing Phase C), renders two
 * independent layers: waterbody (where) then platform (how). Single-list
 * domains (Boating) pass only `venues`.
 */
export function VenuePicker({
  venues,
  platforms,
  activeId,
  activePlatformId,
  onPick,
  onPickPlatform,
  disabled,
}: {
  venues: DomainVenue[];
  /** Optional second layer — fishing platforms. */
  platforms?: DomainVenue[];
  activeId?: string;
  activePlatformId?: string;
  onPick: (venue: DomainVenue | undefined) => void;
  onPickPlatform?: (platform: DomainVenue | undefined) => void;
  disabled?: boolean;
}) {
  const t = useT();
  const active = venues.find((v) => v.id === activeId);
  const activePlatform = platforms?.find((v) => v.id === activePlatformId);
  const dual = Boolean(platforms && platforms.length > 0);

  return (
    <div className="space-y-4">
      <div>
        {dual ? <MicroLabel className="mb-2">{t("venue.waterbody")}</MicroLabel> : null}
        <ChipRail items={venues} activeId={activeId} disabled={disabled} onPick={onPick} />
        {active ? (
          <div className="mt-3">
            <Callout venue={active} />
          </div>
        ) : null}
      </div>

      {dual && onPickPlatform ? (
        <div>
          <MicroLabel className="mb-2">{t("venue.platform")}</MicroLabel>
          <p className="mb-2 text-[0.75rem] leading-relaxed text-muted-foreground">
            {t("venue.platformHint")}
          </p>
          <ChipRail
            items={platforms!}
            activeId={activePlatformId}
            disabled={disabled}
            onPick={onPickPlatform}
          />
          {activePlatform ? (
            <div className="mt-3">
              <Callout venue={activePlatform} />
            </div>
          ) : null}
        </div>
      ) : null}

      {!active && !activePlatform ? (
        <p className="text-[0.75rem] text-muted-foreground">{t("venue.none")}</p>
      ) : null}
    </div>
  );
}
