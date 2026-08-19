/**
 * Attached Hook the Horizon SVG plates. Image only — no invented drawings.
 */
import { MicroLabel } from "@/components/instrument/primitives";
import { HTH_PACKAGE, platesFor } from "@/data/hth-plates";

export function HthPlate({ src, title, kicker }: { src: string; title: string; kicker: string }) {
  return (
    <figure className="overflow-hidden rounded-lg border border-hairline bg-[#F7F5EF]">
      <div className="border-b border-hairline px-5 py-3">
        <MicroLabel className="text-[#176F78]">{kicker}</MicroLabel>
        <p className="mt-1 text-[0.8125rem] leading-relaxed text-[#12202B]/80">{title}</p>
      </div>
      <img src={src} alt={title} className="block w-full" />
      <figcaption className="border-t border-hairline px-5 py-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-[#5E6A71]">
        HTH content {HTH_PACKAGE} · attached plate
      </figcaption>
    </figure>
  );
}

/** Finished-state + construction plates. Failure-mode plate lives on FailureModesPanel. */
export function HthInspectPlates({ knotId, name }: { knotId: string; name: string }) {
  const p = platesFor(knotId);
  if (!p?.diagnostics && !p?.steps) return null;
  return (
    <div className="space-y-4">
      {p.diagnostics ? (
        <HthPlate
          src={p.diagnostics}
          title={`${name} — finished-state check`}
          kicker="HTH · Correct vs wrong"
        />
      ) : null}
      {p.steps ? (
        <HthPlate
          src={p.steps}
          title={`${name} — construction sequence`}
          kicker="HTH · Construction plate"
        />
      ) : null}
    </div>
  );
}
