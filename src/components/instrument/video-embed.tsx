/**
 * Click-to-load video facade. Nothing is requested from YouTube until the
 * reader presses play — no iframe, no cookies, no thumbnail fetch beyond the
 * still image, and the privacy-forwarding host is used when it does load.
 */
import { useState } from "react";
import type { KnotVideo } from "@/domain/types";
import { MicroLabel, Panel } from "@/components/instrument/primitives";

export function VideoEmbed({ video, knotName }: { video: KnotVideo; knotName: string }) {
  const [playing, setPlaying] = useState(false);
  const start = video.startsAt ? `&start=${video.startsAt}` : "";
  const watchUrl = `https://www.youtube.com/watch?v=${video.id}${
    video.startsAt ? `&t=${video.startsAt}` : ""
  }`;

  return (
    <Panel className="p-5">
      <MicroLabel className="mb-3">Watch the tie</MicroLabel>

      <div className="overflow-hidden rounded-lg border border-hairline bg-surface-2/40 no-print">
        <div className="relative aspect-video w-full">
          {playing ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0${start}`}
              title={`${video.title} — ${video.channel}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play tying video — ${knotName}: ${video.title}, ${video.channel}`}
              className="group absolute inset-0 h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <img
                src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="h-full w-full object-cover opacity-70 transition-opacity duration-200 group-hover:opacity-90 motion-reduce:transition-none"
              />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-primary/70 bg-background/80 font-mono text-[0.75rem] tracking-[0.1em] text-foreground backdrop-blur-sm">
                  ▶
                </span>
              </span>
            </button>
          )}
        </div>
      </div>

      <p className="mt-3 text-[0.8125rem] leading-relaxed text-foreground/85">{video.title}</p>
      <p className="mt-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted-foreground">
        {video.channel}
      </p>
      <p className="mt-2 text-[0.6875rem] leading-snug text-muted-foreground">
        External video from a creator we follow — not produced by us.
      </p>
      <a
        href={watchUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-2 inline-block text-[0.8125rem] text-accent underline underline-offset-4"
      >
        Open on YouTube
      </a>
      <p className="mt-2 font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground/70 no-print">
        Loads only when you press play
      </p>
    </Panel>
  );
}
