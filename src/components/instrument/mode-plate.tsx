import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * ModePlate — the photographic signature of a mode.
 *
 * A framed, matted image plate with film grain, a bottom scrim, and an
 * etched brass rule under the copy. Decorative depth only: the copy stays
 * plain DOM text and the image is presentational (alt provided by caller
 * when it carries meaning). Falls back to a layered gradient field when no
 * image is supplied, so the composition never depends on the asset.
 */
export function ModePlate({
  image,
  image2x,
  alt = "",
  kicker,
  statement,
  sub,
  height = "band",
  eager = false,
  className,
}: {
  image?: string;
  /** Optional higher-density source (srcSet 2x). */
  image2x?: string;
  alt?: string;
  kicker?: ReactNode;
  statement: ReactNode;
  sub?: ReactNode;
  height?: "tall" | "band" | "slim";
  eager?: boolean;
  className?: string;
}) {
  const h =
    height === "tall"
      ? "h-[280px] sm:h-[360px]"
      : height === "band"
        ? "h-[210px] sm:h-[260px]"
        : "h-[150px] sm:h-[180px]";
  return (
    <figure className={cn("ki-photo-plate not-prose m-0 no-print", className)}>
      {image ? (
        <img
          src={image}
          {...(image2x ? { srcSet: `${image} 1x, ${image2x} 2x` } : {})}
          alt={alt}
          width={1600}
          height={900}
          loading={eager ? "eager" : "lazy"}
          decoding={eager ? "sync" : "async"}
          {...(eager ? { fetchPriority: "high" as const } : {})}
          className={cn("w-full object-cover", h)}
        />
      ) : (
        <div
          aria-hidden="true"
          className={cn("w-full", h)}
          style={{
            background:
              "radial-gradient(120% 130% at 85% -20%, color-mix(in oklab, var(--primary) 22%, transparent), transparent 55%)," +
              "radial-gradient(110% 120% at -10% 115%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 58%)," +
              "var(--gradient-depth)",
          }}
        />
      )}
      <span className="ki-plate-grain" aria-hidden="true" />
      <figcaption className="ki-plate-copy p-6 sm:p-8">
        {kicker ? <p className="label-micro mb-3 text-primary/90">{kicker}</p> : null}
        <div className="rule-brass mb-4 w-24 opacity-80" />
        <p className="display-face max-w-lg text-[1.25rem] leading-snug text-foreground sm:text-[1.5rem]">
          {statement}
        </p>
        {sub ? (
          <p className="mt-2 max-w-lg text-[0.8125rem] leading-relaxed text-muted-foreground">
            {sub}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
