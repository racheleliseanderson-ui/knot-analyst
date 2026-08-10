/**
 * Coded vector diagram system.
 *
 * Parametric SVG per DiagramKind — theme-aware (currentColor + CSS vars),
 * offline, printable, and step-aware: elements declare the step at which they
 * appear, so the same drawing drives the step player.
 */
import { cn } from "@/lib/utils";
import type { DiagramKind } from "@/domain/types";

interface Props {
  kind: DiagramKind;
  /** 1-based active step; undefined renders the finished structure */
  step?: number;
  className?: string;
  title?: string;
  /** Zoom the drawing toward the region the active step concerns */
  focus?: boolean;
}

const LINE = "var(--foreground)";
const HOT = "var(--primary)";
const GHOST = "var(--muted-foreground)";

/** Per-kind step focus — [cx, cy, scale] in viewBox units */
const FOCUS: Partial<Record<DiagramKind, Record<number, [number, number, number]>>> = {
  "terminal-palomar": {
    1: [140, 90, 1.7],
    2: [160, 90, 1.7],
    3: [216, 90, 1.8],
    4: [270, 90, 1.7],
    5: [285, 92, 1.9],
  },
  "terminal-uni": { 1: [180, 90, 1.4], 2: [140, 74, 1.7], 3: [170, 78, 1.7], 4: [212, 74, 1.9] },
  "terminal-snell": { 1: [180, 88, 1.4], 2: [160, 86, 1.7], 3: [236, 76, 1.9] },
  "terminal-eye": { 1: [190, 90, 1.4], 2: [160, 90, 1.7], 3: [214, 80, 1.9] },
  "line-join": { 1: [195, 90, 1.2], 2: [140, 90, 1.8], 3: [244, 90, 1.8], 4: [195, 82, 1.4] },
  "braid-leader-fg": {
    1: [200, 90, 1.2],
    2: [180, 90, 1.7],
    3: [260, 90, 1.9],
    4: [300, 90, 1.9],
    5: [332, 84, 2],
  },
  "braid-leader-alberto": { 1: [180, 90, 1.2], 2: [125, 90, 1.7], 3: [240, 90, 1.7], 4: [312, 90, 1.8] },
  "loop-fixed": { 1: [280, 90, 1.4], 2: [135, 90, 1.6], 3: [172, 90, 1.9], 4: [205, 82, 1.9] },
  "loop-nonslip": { 1: [290, 90, 1.4], 2: [148, 90, 1.5], 3: [246, 90, 1.8], 4: [292, 84, 1.9] },
};

function focusTransform(kind: DiagramKind, step?: number, enabled?: boolean) {
  if (!enabled || step === undefined) return "translate(0,0) scale(1)";
  const spec = FOCUS[kind]?.[step];
  if (!spec) return "translate(0,0) scale(1)";
  const [cx, cy, k] = spec;
  // keep the zoom restrained so the hardware and both line ends stay in frame
  const s = 1 + (k - 1) * 0.55;
  return `translate(${200 - cx * s}, ${90 - cy * s}) scale(${s})`;
}

function toneFor(from: number, step?: number) {
  if (step === undefined) return { stroke: LINE, opacity: 1 };
  if (from > step) return { stroke: GHOST, opacity: 0.12 };
  if (from === step) return { stroke: HOT, opacity: 1 };
  return { stroke: LINE, opacity: 0.55 };
}

function Seg({
  d,
  from,
  step,
  width = 3,
  dash,
}: {
  d: string;
  from: number;
  step?: number;
  width?: number;
  dash?: string;
}) {
  const tone = toneFor(from, step);
  return (
    <path
      d={d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={width}
      stroke={tone.stroke}
      opacity={tone.opacity}
      {...(dash ? { strokeDasharray: dash } : {})}
      className="transition-all duration-300"
    />
  );
}

function Hardware({ cx = 62, cy = 90, r = 15 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GHOST} strokeWidth={5} opacity={0.5} />
      <path
        d={`M ${cx - 3} ${cy + r} q -14 34 6 56 q 22 24 30 -4`}
        fill="none"
        stroke={GHOST}
        strokeWidth={5}
        strokeLinecap="round"
        opacity={0.5}
      />
    </g>
  );
}

/** Even coil stack — count and pitch are parametric */
function coils(x: number, y: number, count: number, pitch: number, amp: number) {
  let d = `M ${x} ${y}`;
  for (let i = 0; i < count; i += 1) {
    const x0 = x + i * pitch;
    d += ` C ${x0 + pitch * 0.2} ${y - amp}, ${x0 + pitch * 0.8} ${y - amp}, ${x0 + pitch} ${y}`;
    d += ` C ${x0 + pitch * 0.8} ${y + amp}, ${x0 + pitch * 0.2} ${y + amp}, ${x0} ${y}`;
    d += ` M ${x0 + pitch} ${y}`;
  }
  return d;
}

function Body({ kind, step }: { kind: DiagramKind; step?: number }) {
  switch (kind) {
    case "terminal-palomar":
      return (
        <>
          <Hardware />
          <Seg d="M 300 78 L 120 78 q -30 0 -30 12 q 0 12 30 12 L 300 102" from={1} step={step} />
          <Seg d={coils(120, 90, 3, 22, 13)} from={2} step={step} width={2.5} />
          <Seg d="M 186 90 q 34 -46 62 0 q -34 46 -62 0" from={3} step={step} width={2.5} dash="6 5" />
          <Seg d="M 250 90 L 316 78" from={4} step={step} width={2.5} />
          <Seg d="M 250 90 L 306 104" from={5} step={step} width={2} dash="4 4" />
        </>
      );
    case "terminal-uni":
      return (
        <>
          <Hardware />
          <Seg d="M 320 90 L 100 90 q -20 0 -20 -10" from={1} step={step} />
          <Seg d="M 80 80 q 0 -16 26 -16 L 214 64" from={2} step={step} width={2.5} />
          <Seg d={coils(120, 76, 4, 24, 15)} from={3} step={step} width={2.5} />
          <Seg d="M 216 64 q 26 6 6 22" from={4} step={step} width={2.5} dash="5 4" />
        </>
      );
    case "terminal-snell":
      return (
        <>
          <Hardware />
          <Seg d="M 62 75 L 250 68" from={1} step={step} width={2.5} />
          <Seg d="M 62 105 L 320 100" from={1} step={step} />
          <Seg d={coils(90, 84, 5, 26, 16)} from={2} step={step} width={2.5} />
          <Seg d="M 224 84 q 26 -8 30 -16" from={3} step={step} width={2} dash="5 4" />
        </>
      );
    case "terminal-eye":
      return (
        <>
          <Hardware />
          <Seg d="M 320 90 L 84 90" from={1} step={step} />
          <Seg d={coils(110, 90, 4, 24, 14)} from={2} step={step} width={2.5} />
          <Seg d="M 206 90 q 30 -12 26 -26" from={3} step={step} width={2} dash="5 4" />
        </>
      );
    case "line-join":
      return (
        <>
          <Seg d="M 10 90 L 200 90" from={1} step={step} />
          <Seg d="M 190 90 L 380 90" from={1} step={step} width={4.5} />
          <Seg d={coils(96, 90, 4, 22, 15)} from={2} step={step} width={2.5} />
          <Seg d={coils(200, 90, 4, 22, 15)} from={3} step={step} width={2.5} />
          <Seg d="M 96 90 l -22 -18 M 288 90 l 22 -18" from={4} step={step} width={2} dash="5 4" />
        </>
      );
    case "braid-leader-fg":
      return (
        <>
          <Seg d="M 10 90 L 250 90" from={1} step={step} width={4.5} />
          <Seg d="M 120 90 L 390 90" from={1} step={step} width={2} />
          <Seg d={coils(130, 90, 6, 18, 12)} from={2} step={step} width={2} />
          <Seg d="M 240 90 q 22 -20 40 0 q -22 20 -40 0" from={3} step={step} width={2} />
          <Seg d="M 280 90 q 26 -18 44 0 q -26 18 -44 0" from={4} step={step} width={2} />
          <Seg d="M 324 90 l 26 -16" from={5} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "braid-leader-alberto":
      return (
        <>
          <Seg d="M 40 76 q -26 14 0 28 L 300 104" from={1} step={step} width={4.5} />
          <Seg d="M 40 76 L 320 76" from={1} step={step} width={2} />
          <Seg d={coils(70, 90, 5, 22, 16)} from={2} step={step} width={2} />
          <Seg d={coils(190, 90, 5, 22, 16)} from={3} step={step} width={2} />
          <Seg d="M 300 104 l 30 12 M 300 76 l 30 -12" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "loop-fixed":
      return (
        <>
          <Seg d="M 380 90 L 190 90" from={1} step={step} />
          <Seg d="M 190 90 q -70 -46 -110 0 q 40 46 110 0" from={2} step={step} width={2.5} />
          <Seg d={coils(150, 90, 2, 22, 13)} from={3} step={step} width={2.5} />
          <Seg d="M 190 90 l 34 -20" from={4} step={step} width={2} dash="5 4" />
        </>
      );
    case "loop-nonslip":
      return (
        <>
          <Hardware cx={70} cy={90} r={13} />
          <Seg d="M 380 90 L 210 90" from={1} step={step} />
          <Seg d="M 210 90 q -60 -44 -122 -2" from={2} step={step} width={2.5} />
          <Seg d="M 88 92 q 62 42 122 -2" from={2} step={step} width={2.5} />
          <Seg d={coils(214, 90, 3, 22, 14)} from={3} step={step} width={2.5} />
          <Seg d="M 280 90 l 30 -18" from={4} step={step} width={2} dash="5 4" />
        </>
      );
    default:
      return (
        <>
          <Seg d="M 10 90 L 390 90" from={1} step={step} />
          <Seg d={coils(130, 90, 5, 24, 16)} from={2} step={step} width={2.5} />
          <Seg d="M 250 90 l 30 -20" from={3} step={step} width={2} dash="5 4" />
        </>
      );
  }
}

export function KnotDiagram({ kind, step, className, title, focus }: Props) {
  return (
    <figure className={cn("relative", className)}>
      <svg
        viewBox="0 0 400 180"
        role="img"
        aria-label={title ?? `Schematic diagram — ${kind}`}
        className="h-full w-full"
      >
        <defs>
          <pattern id="ki-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect
          width="400"
          height="180"
          fill="url(#ki-grid)"
          className="text-muted-foreground"
          opacity={0.14}
        />
        <g
          transform={focusTransform(kind, step, focus)}
          className="transition-transform duration-500 ease-out"
        >
          <Body kind={kind} step={step} />
        </g>
      </svg>
      <figcaption className="pointer-events-none absolute bottom-1 right-2 font-mono text-[0.5625rem] uppercase tracking-[0.16em] text-muted-foreground/60">
        schematic · not to scale
      </figcaption>
    </figure>
  );
}