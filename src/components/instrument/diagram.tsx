/**
 * Coded vector diagram system.
 *
 * Distinctive schematic per DiagramKind — theme-aware, offline, printable,
 * and step-aware. Standing (navy), working (teal/accent), this-step (gold).
 * Labels name the parts so the drawing can be read without a tutorial.
 */
import { createContext, useContext, useId } from "react";
import { cn } from "@/lib/utils";
import type { DiagramKind } from "@/domain/types";

interface Props {
  kind: DiagramKind;
  /** 1-based active step; undefined renders the finished structure */
  step?: number;
  className?: string;
  title?: string;
  focus?: boolean;
  description?: string;
  /** Library cards: drop legend, labels and caption so the silhouette reads at 96px. */
  compact?: boolean;
}

const LINE = "var(--foreground)";
const HOT = "var(--primary)";
const WORK = "var(--accent)";
const GHOST = "var(--muted-foreground)";

const CompactCtx = createContext(false);

const FOCUS: Partial<Record<DiagramKind, Record<number, [number, number, number]>>> = {
  "terminal-palomar": {
    1: [130, 90, 1.6],
    2: [175, 88, 1.7],
    3: [230, 90, 1.7],
    4: [270, 90, 1.7],
    5: [300, 92, 1.8],
  },
  "terminal-uni": { 1: [180, 90, 1.4], 2: [140, 74, 1.6], 3: [170, 78, 1.7], 4: [212, 74, 1.8] },
  "terminal-snell": { 1: [170, 88, 1.4], 2: [155, 86, 1.6], 3: [230, 76, 1.8] },
  "terminal-eye": { 1: [180, 90, 1.4], 2: [155, 90, 1.6], 3: [210, 80, 1.8], 4: [240, 78, 1.7] },
  "terminal-davy": { 1: [150, 90, 1.5], 2: [185, 88, 1.7], 3: [230, 86, 1.8] },
  "terminal-turle": { 1: [90, 90, 1.6], 2: [130, 88, 1.7], 3: [200, 90, 1.6] },
  "terminal-clinch": { 1: [180, 90, 1.4], 2: [155, 90, 1.6], 3: [210, 80, 1.8], 4: [240, 78, 1.7] },
  "terminal-improved": {
    1: [180, 90, 1.4],
    2: [155, 90, 1.6],
    3: [210, 80, 1.7],
    4: [250, 70, 1.7],
  },
  "terminal-trilene": { 1: [90, 90, 1.6], 2: [155, 90, 1.6], 3: [210, 80, 1.7], 4: [240, 78, 1.6] },
  "terminal-pitzen": { 1: [180, 90, 1.4], 2: [160, 90, 1.6], 3: [80, 90, 1.7], 4: [240, 78, 1.6] },
  "terminal-jansik": { 1: [90, 90, 1.6], 2: [90, 90, 1.6], 3: [90, 90, 1.5], 4: [200, 90, 1.4] },
  "terminal-jam": { 1: [140, 90, 1.5], 2: [180, 90, 1.6], 3: [230, 90, 1.7], 4: [280, 80, 1.6] },
  "terminal-egg": { 1: [170, 88, 1.4], 2: [155, 86, 1.6], 3: [230, 50, 1.7], 4: [230, 76, 1.6] },
  "terminal-knotless": {
    1: [80, 90, 1.5],
    2: [170, 110, 1.6],
    3: [80, 90, 1.6],
    4: [230, 76, 1.5],
  },
  "line-join": { 1: [200, 90, 1.2], 2: [140, 90, 1.7], 3: [250, 90, 1.7], 4: [200, 82, 1.4] },
  "line-blood": { 1: [200, 90, 1.2], 2: [130, 90, 1.7], 3: [260, 90, 1.7], 4: [200, 82, 1.4] },
  "line-surgeons": { 1: [200, 90, 1.3], 2: [200, 90, 1.6], 3: [200, 70, 1.7], 4: [260, 90, 1.5] },
  "line-albright": { 1: [140, 90, 1.4], 2: [180, 90, 1.6], 3: [240, 90, 1.7], 4: [300, 90, 1.6] },
  "braid-leader-fg": {
    1: [200, 90, 1.2],
    2: [175, 90, 1.6],
    3: [255, 90, 1.8],
    4: [300, 90, 1.8],
    5: [330, 84, 1.9],
  },
  "braid-leader-alberto": {
    1: [170, 90, 1.2],
    2: [120, 90, 1.6],
    3: [240, 90, 1.6],
    4: [310, 90, 1.7],
  },
  "loop-fixed": { 1: [280, 90, 1.4], 2: [135, 90, 1.6], 3: [175, 90, 1.8], 4: [210, 82, 1.8] },
  "loop-nonslip": { 1: [290, 90, 1.4], 2: [150, 90, 1.5], 3: [245, 90, 1.7], 4: [292, 84, 1.8] },
  "loop-dropper": { 1: [200, 90, 1.3], 2: [200, 90, 1.5], 3: [200, 68, 1.7], 4: [200, 50, 1.8] },
  "loop-handshake": { 1: [140, 90, 1.5], 2: [200, 90, 1.6], 3: [260, 90, 1.6] },
  "loop-rapala": { 1: [240, 90, 1.5], 2: [90, 90, 1.6], 3: [160, 90, 1.6], 4: [250, 80, 1.6] },
  "double-line": { 1: [130, 90, 1.3], 2: [200, 90, 1.6], 3: [270, 90, 1.7], 4: [320, 84, 1.8] },
  "fly-line-coil": { 1: [160, 90, 1.3], 2: [210, 90, 1.6], 3: [250, 90, 1.7], 4: [300, 84, 1.7] },
  "arbor-spool": { 1: [90, 90, 1.5], 2: [170, 90, 1.6], 3: [230, 90, 1.7], 4: [270, 90, 1.7] },
  "rope-cleat": { 1: [90, 100, 1.4], 2: [190, 90, 1.5], 3: [265, 88, 1.6], 4: [305, 80, 1.6] },
  "rope-hitch": { 1: [120, 90, 1.4], 2: [200, 90, 1.5], 3: [260, 90, 1.6], 4: [300, 84, 1.6] },
  "rope-hitch-round": {
    1: [110, 90, 1.5],
    2: [175, 90, 1.6],
    3: [230, 90, 1.6],
    4: [280, 84, 1.6],
  },
  "rope-hitch-clove": {
    1: [140, 80, 1.5],
    2: [140, 110, 1.5],
    3: [200, 96, 1.6],
    4: [250, 90, 1.5],
  },
  "rope-hitch-rolling": {
    1: [150, 90, 1.5],
    2: [200, 90, 1.6],
    3: [250, 90, 1.6],
    4: [300, 84, 1.6],
  },
  "rope-hitch-pile": {
    1: [160, 70, 1.5],
    2: [160, 110, 1.5],
    3: [160, 50, 1.6],
    4: [240, 90, 1.4],
  },
  "rope-hitch-buntline": {
    1: [110, 90, 1.5],
    2: [160, 90, 1.7],
    3: [110, 90, 1.6],
    4: [240, 84, 1.5],
  },
  "rope-hitch-icicle": {
    1: [140, 90, 1.5],
    2: [200, 90, 1.6],
    3: [250, 90, 1.6],
    4: [300, 84, 1.5],
  },
  "rope-timber": { 1: [120, 90, 1.5], 2: [190, 90, 1.6], 3: [250, 90, 1.6], 4: [300, 84, 1.5] },
  "rope-trucker": { 1: [80, 110, 1.4], 2: [200, 70, 1.6], 3: [250, 90, 1.5], 4: [310, 90, 1.6] },
  "rope-bend": { 1: [140, 90, 1.3], 2: [200, 90, 1.6], 3: [250, 90, 1.6], 4: [300, 84, 1.6] },
  "rope-bend-double": {
    1: [140, 90, 1.3],
    2: [180, 90, 1.5],
    3: [230, 90, 1.6],
    4: [300, 84, 1.6],
  },
  "rope-bend-zeppelin": {
    1: [150, 78, 1.5],
    2: [230, 108, 1.5],
    3: [190, 90, 1.6],
    4: [190, 90, 1.4],
  },
  "rope-bend-carrick": {
    1: [160, 90, 1.5],
    2: [200, 90, 1.6],
    3: [250, 90, 1.6],
    4: [300, 84, 1.5],
  },
  "rope-reef": { 1: [160, 80, 1.5], 2: [220, 110, 1.5], 3: [190, 95, 1.6], 4: [280, 90, 1.4] },
  "rope-loop": { 1: [130, 90, 1.4], 2: [200, 70, 1.6], 3: [250, 90, 1.6], 4: [300, 84, 1.6] },
  "rope-loop-figure8": {
    1: [150, 90, 1.4],
    2: [210, 90, 1.6],
    3: [260, 90, 1.6],
    4: [310, 84, 1.5],
  },
  "rope-loop-butterfly": {
    1: [180, 90, 1.5],
    2: [210, 90, 1.6],
    3: [240, 70, 1.6],
    4: [200, 90, 1.4],
  },
  "rope-loop-bight": { 1: [160, 90, 1.4], 2: [200, 80, 1.6], 3: [250, 90, 1.6], 4: [300, 84, 1.5] },
  "rope-stopper": { 1: [180, 90, 1.4], 2: [230, 90, 1.7], 3: [280, 90, 1.7] },
  "rope-stopper-estar": {
    1: [180, 90, 1.4],
    2: [220, 90, 1.6],
    3: [260, 90, 1.7],
    4: [300, 90, 1.5],
  },
  "rope-stopper-ashley": {
    1: [180, 90, 1.4],
    2: [230, 90, 1.6],
    3: [270, 100, 1.7],
    4: [300, 90, 1.5],
  },
  "rope-heaving": { 1: [160, 90, 1.4], 2: [220, 90, 1.6], 3: [280, 90, 1.6], 4: [320, 84, 1.5] },
};

function focusTransform(kind: DiagramKind, step?: number, enabled?: boolean) {
  if (!enabled || step === undefined) return "translate(0,0) scale(1)";
  const spec = FOCUS[kind]?.[step];
  if (!spec) return "translate(0,0) scale(1)";
  const [cx, cy, k] = spec;
  const s = 1 + (k - 1) * 0.5;
  return `translate(${200 - cx * s}, ${90 - cy * s}) scale(${s})`;
}

function toneFor(from: number, step?: number, role: "stand" | "work" = "work") {
  if (step === undefined) {
    return {
      stroke: role === "stand" ? LINE : WORK,
      opacity: 1,
      scale: role === "stand" ? 1.15 : 1,
      ghost: false,
    };
  }
  if (from > step) return { stroke: GHOST, opacity: 0.28, scale: 0.75, ghost: true };
  if (from === step) return { stroke: HOT, opacity: 1, scale: 1.55, ghost: false };
  return {
    stroke: role === "stand" ? LINE : WORK,
    opacity: 0.7,
    scale: role === "stand" ? 1.1 : 1,
    ghost: false,
  };
}

function Seg({
  d,
  from,
  step,
  width = 3,
  dash,
  role = "work",
}: {
  d: string;
  from: number;
  step?: number;
  width?: number;
  dash?: string;
  role?: "stand" | "work";
}) {
  const tone = toneFor(from, step, role);
  return (
    <path
      d={d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={Number((width * tone.scale).toFixed(2))}
      stroke={tone.stroke}
      opacity={tone.opacity}
      {...(tone.ghost ? { strokeDasharray: "3 6" } : dash ? { strokeDasharray: dash } : {})}
      className="transition-all duration-300 motion-reduce:transition-none"
    />
  );
}

function Mark({
  x,
  y,
  text,
  from,
  step,
  anchor = "start",
}: {
  x: number;
  y: number;
  text: string;
  from: number;
  step?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const compact = useContext(CompactCtx);
  if (compact) return null;
  if (step !== undefined && from > step) return null;
  const hot = step === from;
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fill={hot ? HOT : GHOST}
      fontSize={9}
      fontFamily="IBM Plex Mono, ui-monospace, monospace"
      letterSpacing="0.12em"
      style={{ textTransform: "uppercase" }}
      opacity={hot ? 1 : 0.75}
    >
      {text}
    </text>
  );
}

function Hook({ cx = 62, cy = 90, r = 14 }: { cx?: number; cy?: number; r?: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={GHOST} strokeWidth={4.5} opacity={0.7} />
      <path
        d={`M ${cx - 2} ${cy + r - 1} q -12 28 8 50 q 18 20 26 -6`}
        fill="none"
        stroke={GHOST}
        strokeWidth={4.5}
        strokeLinecap="round"
        opacity={0.7}
      />
      <circle cx={cx + 28} cy={cy + 58} r={3} fill={GHOST} opacity={0.5} />
    </g>
  );
}

function Ring({ cx = 70, cy = 90, r = 16 }: { cx?: number; cy?: number; r?: number }) {
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={GHOST} strokeWidth={5} opacity={0.7} />;
}

function Spar({ x = 80, y1 = 28, y2 = 160 }: { x?: number; y1?: number; y2?: number }) {
  return (
    <g>
      <line
        x1={x}
        y1={y1}
        x2={x}
        y2={y2}
        stroke={GHOST}
        strokeWidth={10}
        strokeLinecap="round"
        opacity={0.45}
      />
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={GHOST} strokeWidth={2} opacity={0.8} />
    </g>
  );
}

function Cleat() {
  return (
    <g>
      <rect
        x={78}
        y={118}
        width={230}
        height={10}
        rx={2}
        fill="none"
        stroke={GHOST}
        strokeWidth={3}
        opacity={0.55}
      />
      <path
        d="M 86 118 L 86 62 L 118 62 L 118 118"
        fill="none"
        stroke={GHOST}
        strokeWidth={5}
        opacity={0.7}
      />
      <path
        d="M 268 118 L 268 62 L 300 62 L 300 118"
        fill="none"
        stroke={GHOST}
        strokeWidth={5}
        opacity={0.7}
      />
    </g>
  );
}

function Block() {
  return (
    <g>
      <rect
        x={168}
        y={48}
        width={28}
        height={84}
        rx={4}
        fill="none"
        stroke={GHOST}
        strokeWidth={3}
        opacity={0.6}
      />
      <circle cx={182} cy={90} r={10} fill="none" stroke={GHOST} strokeWidth={2.5} opacity={0.7} />
    </g>
  );
}

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
          <Hook />
          <Seg
            role="stand"
            d="M 300 76 L 118 76 q -28 0 -28 14 q 0 14 28 14 L 300 104"
            from={1}
            step={step}
          />
          <Mark x={304} y={72} text="doubled" from={1} step={step} />
          <Seg d={coils(118, 90, 3, 22, 13)} from={2} step={step} width={2.6} />
          <Mark x={118} y={58} text="overhand" from={2} step={step} />
          <Seg
            d="M 186 90 q 36 -48 68 0 q -36 48 -68 0"
            from={3}
            step={step}
            width={2.6}
            dash="6 5"
          />
          <Mark x={230} y={48} text="over hook" from={3} step={step} />
          <Seg d="M 254 90 L 322 76" from={4} step={step} width={2.6} role="stand" />
          <Seg d="M 254 90 L 314 108" from={5} step={step} width={2} dash="4 4" />
          <Mark x={318} y={122} text="tag" from={5} step={step} />
        </>
      );
    case "terminal-uni":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 92 L 98 92 q -22 0 -22 -12" from={1} step={step} />
          <Mark x={334} y={88} text="standing" from={1} step={step} />
          <Seg d="M 76 80 q 0 -16 26 -16 L 214 64" from={2} step={step} width={2.6} />
          <Mark x={78} y={52} text="loop" from={2} step={step} />
          <Seg d={coils(118, 76, 4, 24, 15)} from={3} step={step} width={2.6} />
          <Mark x={130} y={48} text="barrel" from={3} step={step} />
          <Seg d="M 216 64 q 26 6 6 22" from={4} step={step} width={2.5} dash="5 4" />
          <Mark x={230} y={58} text="tag" from={4} step={step} />
        </>
      );
    case "terminal-snell":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 62 74 L 252 66" from={1} step={step} width={2.5} />
          <Seg role="stand" d="M 62 106 L 330 100" from={1} step={step} />
          <Mark x={250} y={58} text="shank" from={1} step={step} />
          <Seg d={coils(88, 84, 5, 26, 16)} from={2} step={step} width={2.6} />
          <Mark x={100} y={54} text="wraps" from={2} step={step} />
          <Seg d="M 224 84 q 26 -8 30 -16" from={3} step={step} width={2} dash="5 4" />
          <Mark x={258} y={58} text="eye finish" from={3} step={step} />
        </>
      );
    case "terminal-eye":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 90 L 84 90" from={1} step={step} />
          <Mark x={334} y={86} text="standing" from={1} step={step} />
          <Seg d={coils(108, 90, 5, 22, 13)} from={2} step={step} width={2.6} />
          <Mark x={118} y={62} text="wraps" from={2} step={step} />
          <Seg d="M 218 90 q 28 -14 22 -28" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={244} y={52} text="tag tuck" from={3} step={step} />
          <Seg d="M 218 90 L 84 90" from={4} step={step} width={2} dash="4 5" />
        </>
      );
    case "terminal-davy":
      return (
        <>
          <Hook cx={70} r={12} />
          <Seg role="stand" d="M 320 90 L 88 90" from={1} step={step} />
          <Mark x={324} y={86} text="tippet" from={1} step={step} />
          <Seg d="M 88 90 q 36 -28 70 0 q -20 22 -70 0" from={2} step={step} width={2.5} />
          <Mark x={130} y={54} text="hitch" from={2} step={step} />
          <Seg d="M 158 90 L 88 90" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={168} y={86} text="seat" from={3} step={step} />
        </>
      );
    case "terminal-turle":
      return (
        <>
          <Hook cx={78} r={16} />
          <Seg role="stand" d="M 330 90 L 160 90" from={1} step={step} />
          <Seg d="M 160 90 q -40 -36 -86 -2" from={2} step={step} width={2.5} />
          <Seg d="M 74 92 q 40 34 86 -2" from={2} step={step} width={2.5} />
          <Mark x={40} y={52} text="collar" from={2} step={step} />
          <Seg d={coils(168, 90, 2, 20, 12)} from={3} step={step} width={2.4} />
          <Mark x={176} y={64} text="cinch" from={3} step={step} />
        </>
      );
    case "terminal-clinch":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 90 L 84 90" from={1} step={step} />
          <Mark x={334} y={86} text="standing" from={1} step={step} />
          <Seg d={coils(108, 90, 5, 20, 12)} from={2} step={step} width={2.6} />
          <Mark x={118} y={62} text="wraps" from={2} step={step} />
          <Seg d="M 208 90 q 18 -10 8 -22 L 84 78" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={214} y={56} text="first wrap" from={3} step={step} />
          <Seg d="M 208 90 l 28 -14" from={4} step={step} width={1.8} dash="4 4" />
          <Mark x={240} y={70} text="tag" from={4} step={step} />
        </>
      );
    case "terminal-improved":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 90 L 84 90" from={1} step={step} />
          <Mark x={334} y={86} text="standing" from={1} step={step} />
          <Seg d={coils(108, 90, 5, 20, 12)} from={2} step={step} width={2.6} />
          <Mark x={118} y={62} text="wraps" from={2} step={step} />
          <Seg d="M 208 90 q 18 -10 8 -22 L 84 78" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={214} y={56} text="small loop" from={3} step={step} />
          <Seg d="M 84 78 q 80 -36 140 4" from={4} step={step} width={2.2} dash="4 4" />
          <Mark x={200} y={42} text="big loop" from={4} step={step} />
        </>
      );
    case "terminal-trilene":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 82 L 84 82" from={1} step={step} />
          <Seg role="stand" d="M 330 98 L 84 98" from={1} step={step} width={2.4} />
          <Mark x={250} y={70} text="twice" from={1} step={step} />
          <Seg d={coils(118, 90, 4, 22, 14)} from={2} step={step} width={2.6} />
          <Mark x={130} y={58} text="wraps" from={2} step={step} />
          <Seg d="M 206 90 q 20 -16 10 -28 L 92 70" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={214} y={50} text="double loop" from={3} step={step} />
          <Seg d="M 206 90 l 26 -12" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "terminal-pitzen":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 90 L 84 90" from={1} step={step} />
          <Mark x={334} y={86} text="standing" from={1} step={step} />
          <Seg
            d="M 210 90 q -18 -22 -40 0 q 18 22 40 0 M 170 90 q -18 -22 -40 0 q 18 22 40 0 M 130 90 q -18 -22 -36 0 q 18 22 36 0"
            from={2}
            step={step}
            width={2.5}
          />
          <Mark x={150} y={54} text="spiral" from={2} step={step} />
          <Seg d="M 210 90 L 62 90" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={40} y={70} text="back through eye" from={3} step={step} />
          <Seg d="M 210 90 l 24 -14" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "terminal-jansik":
      return (
        <>
          <Hook r={16} />
          <Seg role="stand" d="M 330 90 L 84 90" from={1} step={step} />
          <Seg d="M 84 90 q 40 -46 80 0" from={1} step={step} width={2.5} />
          <Mark x={100} y={44} text="pass 1" from={1} step={step} />
          <Seg d="M 84 90 q 46 0 80 36 q 0 -36 -80 -36" from={2} step={step} width={2.5} />
          <Mark x={170} y={140} text="pass 2" from={2} step={step} />
          <Seg d="M 164 90 q -40 0 -80 0" from={3} step={step} width={2.4} dash="5 4" />
          <Mark x={168} y={86} text="pass 3" from={3} step={step} />
          <Seg d="M 164 90 l 30 -16" from={4} step={step} width={1.8} dash="4 4" />
          <Mark x={196} y={68} text="triangle" from={4} step={step} />
        </>
      );
    case "terminal-jam":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 36 72 q -24 16 0 36 L 210 108" from={1} step={step} width={2.5} />
          <Seg role="stand" d="M 36 72 L 210 72" from={1} step={step} width={2.5} />
          <Mark x={40} y={58} text="doubled" from={1} step={step} />
          <Seg d={coils(90, 90, 5, 20, 16)} from={2} step={step} width={2.6} />
          <Mark x={100} y={54} text="around both" from={2} step={step} />
          <Seg d="M 190 72 q 30 0 20 18" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={214} y={64} text="through loop" from={3} step={step} />
          <Seg d="M 210 90 L 330 90" from={4} step={step} />
        </>
      );
    case "terminal-egg":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 62 74 L 252 66" from={1} step={step} width={2.5} />
          <Seg role="stand" d="M 62 106 L 330 100" from={1} step={step} />
          <Mark x={250} y={58} text="shank" from={1} step={step} />
          <Seg d={coils(88, 84, 4, 24, 15)} from={2} step={step} width={2.6} />
          <Mark x={100} y={54} text="wraps" from={2} step={step} />
          <Seg d="M 186 84 q 40 -70 0 -84 q -28 18 0 84" from={3} step={step} width={2.6} />
          <Mark x={196} y={10} text="egg loop" from={3} step={step} />
          <Seg d="M 186 84 q 26 -8 30 -16" from={4} step={step} width={2} dash="5 4" />
        </>
      );
    case "terminal-knotless":
      return (
        <>
          <Hook />
          <Seg role="stand" d="M 330 70 L 84 70 L 62 90" from={1} step={step} />
          <Mark x={200} y={58} text="through eye" from={1} step={step} />
          <Seg d="M 62 106 L 200 124 L 62 90" from={2} step={step} width={2.6} />
          <Mark x={206} y={136} text="around bend" from={2} step={step} />
          <Seg d="M 200 124 L 84 106 L 84 70" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={90} y={50} text="back through" from={3} step={step} />
          <Seg d="M 200 124 l 24 10" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "line-join":
      return (
        <>
          <Seg role="stand" d="M 8 78 L 200 78" from={1} step={step} width={2.4} />
          <Seg d="M 192 102 L 392 102" from={1} step={step} width={4.4} />
          <Mark x={12} y={68} text="main" from={1} step={step} />
          <Mark x={340} y={92} text="leader" from={1} step={step} />
          <Seg d={coils(92, 90, 4, 20, 14)} from={2} step={step} width={2.5} />
          <Mark x={92} y={58} text="barrel" from={2} step={step} />
          <Seg d={coils(204, 90, 4, 20, 14)} from={3} step={step} width={2.5} />
          <Mark x={250} y={58} text="barrel" from={3} step={step} />
          <Seg d="M 92 90 l -20 -16 M 284 90 l 20 -16" from={4} step={step} width={2} dash="5 4" />
          <Mark x={178} y={128} text="butted" from={4} step={step} />
        </>
      );
    case "line-blood":
      return (
        <>
          <Seg role="stand" d="M 8 78 L 250 78" from={1} step={step} width={2.4} />
          <Seg d="M 150 102 L 392 102" from={1} step={step} width={2.4} />
          <Mark x={12} y={68} text="main" from={1} step={step} />
          <Mark x={340} y={92} text="leader" from={1} step={step} />
          <Seg d={coils(80, 90, 5, 16, 12)} from={2} step={step} width={2.4} />
          <Mark x={80} y={58} text="left barrel" from={2} step={step} />
          <Seg d={coils(210, 90, 5, 16, 12)} from={3} step={step} width={2.4} />
          <Mark x={250} y={58} text="right barrel" from={3} step={step} />
          <Seg d="M 160 90 L 200 90" from={4} step={step} width={2} />
          <Mark x={168} y={128} text="drawn together" from={4} step={step} />
        </>
      );
    case "line-surgeons":
      return (
        <>
          <Seg role="stand" d="M 8 82 L 392 82" from={1} step={step} width={2.4} />
          <Seg d="M 8 98 L 392 98" from={1} step={step} width={2.4} />
          <Mark x={12} y={70} text="overlap" from={1} step={step} />
          <Seg
            d="M 160 90 q -40 -50 0 -56 q 50 0 50 40 q 0 50 -40 50 q -50 0 -50 -34"
            from={2}
            step={step}
            width={2.8}
          />
          <Mark x={200} y={36} text="overhand" from={2} step={step} />
          <Seg
            d="M 210 90 q 24 -20 0 -28 q -20 0 -20 20"
            from={3}
            step={step}
            width={2.4}
            dash="5 4"
          />
          <Mark x={220} y={56} text="again" from={3} step={step} />
          <Seg
            d="M 240 90 l 28 -14 M 150 90 l -28 -14"
            from={4}
            step={step}
            width={1.8}
            dash="4 4"
          />
          <Mark x={250} y={128} text="both tags" from={4} step={step} />
        </>
      );
    case "line-albright":
      return (
        <>
          <Seg d="M 40 70 q -28 20 0 40 L 220 110 L 220 70 Z" from={1} step={step} width={4} />
          <Mark x={44} y={58} text="leader bight" from={1} step={step} />
          <Seg role="stand" d="M 60 90 L 360 90" from={1} step={step} width={2} />
          <Seg d={coils(70, 90, 6, 18, 16)} from={2} step={step} width={2} />
          <Mark x={80} y={54} text="wraps over both" from={2} step={step} />
          <Seg d="M 178 90 q 22 0 22 16" from={3} step={step} width={2} dash="5 4" />
          <Mark x={206} y={64} text="through bight" from={3} step={step} />
          <Seg d="M 220 90 L 360 90" from={4} step={step} width={2} />
        </>
      );
    case "braid-leader-fg":
      return (
        <>
          <Seg d="M 8 90 L 250 90" from={1} step={step} width={5} />
          <Seg role="stand" d="M 118 90 L 392 90" from={1} step={step} width={2} />
          <Mark x={12} y={72} text="leader" from={1} step={step} />
          <Mark x={330} y={76} text="braid" from={1} step={step} />
          <Seg d={coils(128, 90, 6, 18, 12)} from={2} step={step} width={2} />
          <Mark x={140} y={62} text="plait" from={2} step={step} />
          <Seg d="M 236 90 q 22 -20 40 0 q -22 20 -40 0" from={3} step={step} width={2} />
          <Seg d="M 276 90 q 26 -18 44 0 q -26 18 -44 0" from={4} step={step} width={2} />
          <Mark x={286} y={62} text="lock" from={4} step={step} />
          <Seg d="M 320 90 l 26 -16" from={5} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "braid-leader-alberto":
      return (
        <>
          <Seg d="M 36 74 q -24 16 0 32 L 300 106" from={1} step={step} width={4.5} />
          <Seg role="stand" d="M 36 74 L 324 74" from={1} step={step} width={2} />
          <Mark x={36} y={62} text="bight" from={1} step={step} />
          <Seg d={coils(68, 90, 5, 22, 16)} from={2} step={step} width={2} />
          <Mark x={80} y={54} text="up" from={2} step={step} />
          <Seg d={coils(188, 90, 5, 22, 16)} from={3} step={step} width={2} />
          <Mark x={210} y={54} text="back" from={3} step={step} />
          <Seg
            d="M 300 106 l 30 12 M 300 74 l 30 -12"
            from={4}
            step={step}
            width={1.8}
            dash="4 4"
          />
        </>
      );
    case "loop-fixed":
      return (
        <>
          <Seg role="stand" d="M 384 90 L 188 90" from={1} step={step} />
          <Seg d="M 188 90 q -70 -48 -112 0 q 42 48 112 0" from={2} step={step} width={2.6} />
          <Mark x={50} y={90} text="loop" from={2} step={step} />
          <Seg d={coils(148, 90, 2, 22, 13)} from={3} step={step} width={2.6} />
          <Mark x={148} y={62} text="lock" from={3} step={step} />
          <Seg d="M 188 90 l 34 -20" from={4} step={step} width={2} dash="5 4" />
        </>
      );
    case "loop-nonslip":
      return (
        <>
          <Hook cx={68} r={12} />
          <Seg role="stand" d="M 384 90 L 208 90" from={1} step={step} />
          <Seg d="M 208 90 q -58 -44 -120 -2" from={2} step={step} width={2.6} />
          <Seg d="M 88 92 q 60 42 120 -2" from={2} step={step} width={2.6} />
          <Mark x={118} y={48} text="open loop" from={2} step={step} />
          <Seg d={coils(214, 90, 3, 22, 14)} from={3} step={step} width={2.6} />
          <Mark x={220} y={62} text="wraps" from={3} step={step} />
          <Seg d="M 280 90 l 30 -18" from={4} step={step} width={2} dash="5 4" />
        </>
      );
    case "loop-dropper":
      return (
        <>
          <Seg role="stand" d="M 8 90 L 392 90" from={1} step={step} />
          <Seg d={coils(124, 90, 2, 20, 11)} from={2} step={step} width={2.6} />
          <Seg d={coils(232, 90, 2, 20, 11)} from={2} step={step} width={2.6} />
          <Seg d="M 200 90 q -28 -64 0 -80 q 28 16 0 80" from={3} step={step} width={2.6} />
          <Mark x={212} y={22} text="dropper" from={3} step={step} />
          <Seg d="M 200 10 l 0 -6" from={4} step={step} width={2} dash="4 4" />
        </>
      );
    case "loop-handshake":
      return (
        <>
          <Seg
            role="stand"
            d="M 40 90 q 40 -50 90 0 q -40 50 -90 0"
            from={1}
            step={step}
            width={2.8}
          />
          <Seg d="M 270 90 q 40 -50 90 0 q -40 50 -90 0" from={1} step={step} width={2.8} />
          <Mark x={70} y={48} text="loop a" from={1} step={step} />
          <Mark x={300} y={48} text="loop b" from={1} step={step} />
          <Seg d="M 130 90 L 270 90" from={2} step={step} width={2.4} dash="6 5" />
          <Mark x={176} y={80} text="handshake" from={2} step={step} />
          <Seg d="M 200 70 q 0 40 0 40" from={3} step={step} width={2.2} />
          <Mark x={208} y={128} text="not a girth" from={3} step={step} />
        </>
      );
    case "loop-rapala":
      return (
        <>
          <Hook cx={68} r={12} />
          <Seg role="stand" d="M 384 90 L 240 90" from={1} step={step} />
          <Seg d="M 240 90 q 20 -28 48 0 q -20 28 -48 0" from={1} step={step} width={2.4} />
          <Mark x={250} y={52} text="overhand first" from={1} step={step} />
          <Seg d="M 240 90 q -58 -44 -120 -2" from={2} step={step} width={2.6} />
          <Seg d="M 88 92 q 60 42 120 -2" from={2} step={step} width={2.6} />
          <Mark x={118} y={48} text="around hook" from={2} step={step} />
          <Seg d={coils(248, 90, 3, 20, 13)} from={3} step={step} width={2.5} />
          <Mark x={252} y={64} text="back through" from={3} step={step} />
          <Seg d="M 308 90 l 24 -14" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "double-line":
      return (
        <>
          <Seg d="M 36 70 q -26 18 0 40 L 138 110" from={1} step={step} width={2.5} />
          <Seg role="stand" d="M 36 70 L 138 70" from={1} step={step} width={2.5} />
          <Mark x={36} y={58} text="double" from={1} step={step} />
          <Seg d={coils(138, 90, 6, 16, 14)} from={2} step={step} width={2.6} />
          <Mark x={150} y={58} text="column" from={2} step={step} />
          <Seg d="M 234 90 q 22 -18 40 0 q -22 18 -40 0" from={3} step={step} width={2.5} />
          <Mark x={250} y={60} text="lock" from={3} step={step} />
          <Seg role="stand" d="M 274 90 L 372 90" from={4} step={step} />
          <Seg d="M 274 90 l 22 -16" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "fly-line-coil":
      return (
        <>
          <Seg d="M 8 90 L 208 90" from={1} step={step} width={7} />
          <Seg role="stand" d="M 188 90 L 392 90" from={1} step={step} width={2} />
          <Mark x={12} y={72} text="fly line" from={1} step={step} />
          <Seg d={coils(166, 90, 5, 16, 13)} from={2} step={step} width={2.2} />
          <Mark x={176} y={62} text="coil" from={2} step={step} />
          <Seg d="M 246 90 q 18 -8 10 -20" from={3} step={step} width={1.8} dash="4 4" />
          <Seg d="M 166 90 l -16 -14" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "arbor-spool":
      return (
        <>
          <circle
            cx={58}
            cy={90}
            r={28}
            fill="none"
            stroke={GHOST}
            strokeWidth={5}
            opacity={0.55}
          />
          <circle
            cx={58}
            cy={90}
            r={10}
            fill="none"
            stroke={GHOST}
            strokeWidth={3}
            opacity={0.45}
          />
          <Mark x={40} y={44} text="arbor" from={1} step={step} />
          <Seg role="stand" d="M 86 90 q 20 -24 50 -10 L 344 80" from={1} step={step} />
          <Seg d="M 86 90 q 16 22 48 10 L 220 100" from={1} step={step} width={2.5} />
          <Seg d="M 170 78 q 18 -22 40 0 q -18 22 -40 0" from={2} step={step} width={2.5} />
          <Mark x={168} y={52} text="slide" from={2} step={step} />
          <Seg d="M 228 100 q 18 20 36 0 q -14 -18 -36 0" from={3} step={step} width={2.5} />
          <Mark x={250} y={132} text="stopper" from={3} step={step} />
          <Seg d="M 264 100 l 22 12" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "rope-cleat":
      return (
        <>
          <Cleat />
          <Mark x={82} y={52} text="far horn" from={1} step={step} />
          <Seg role="stand" d="M 16 118 L 96 118 L 96 88" from={1} step={step} />
          <Seg d="M 96 88 L 288 88 L 288 118 L 186 118" from={2} step={step} />
          <Mark x={168} y={78} text="figure-8" from={2} step={step} />
          <Seg d="M 186 118 q 40 -28 80 0" from={3} step={step} width={2.6} />
          <Mark x={230} y={142} text="lock" from={3} step={step} />
          <Seg d="M 266 118 l 20 -16" from={4} step={step} width={1.8} dash="4 4" />
        </>
      );
    case "rope-hitch":
    case "rope-hitch-round":
      return (
        <>
          <Spar />
          <Ring cx={80} cy={90} r={18} />
          <Mark x={40} y={40} text="round turn" from={1} step={step} />
          <Seg role="stand" d="M 16 90 q 20 -28 64 -18" from={1} step={step} />
          <Seg d="M 80 72 q 28 0 28 18 q 0 18 -28 18" from={1} step={step} width={2.8} />
          <Seg d={coils(108, 90, 2, 22, 14)} from={2} step={step} width={2.5} />
          <Mark x={118} y={62} text="hitch 1" from={2} step={step} />
          <Seg d="M 152 90 q 18 -16 32 0 q -14 14 -32 0" from={3} step={step} width={2.5} />
          <Mark x={168} y={62} text="hitch 2" from={3} step={step} />
          <Seg role="stand" d="M 184 90 L 360 90" from={4} step={step} />
          <Mark x={300} y={80} text="standing" from={4} step={step} />
        </>
      );
    case "rope-hitch-clove":
      return (
        <>
          <Spar x={140} />
          <Seg d="M 40 70 L 140 70 q 36 0 36 18 q 0 16 -36 16" from={1} step={step} />
          <Mark x={40} y={62} text="turn 1" from={1} step={step} />
          <Seg d="M 40 126 L 140 126 q 36 0 36 -18 q 0 -16 -36 -16" from={2} step={step} />
          <Mark x={40} y={142} text="turn 2" from={2} step={step} />
          <Seg d="M 140 108 L 92 108" from={3} step={step} width={2.4} dash="5 4" />
          <Mark x={48} y={104} text="tuck" from={3} step={step} />
          <Seg role="stand" d="M 176 90 L 340 90" from={4} step={step} />
          <Mark x={220} y={80} text="stacked" from={4} step={step} />
        </>
      );
    case "rope-hitch-rolling":
      return (
        <>
          <Spar />
          <Seg role="stand" d="M 80 28 L 80 90 L 360 90" from={1} step={step} width={2.2} />
          <Mark x={200} y={80} text="load →" from={1} step={step} />
          <Seg d={coils(80, 90, 2, 22, 16)} from={1} step={step} width={2.8} />
          <Mark x={88} y={58} text="load-side" from={1} step={step} />
          <Seg d="M 124 90 q 28 -26 0 -40" from={2} step={step} width={2.5} />
          <Mark x={132} y={44} text="cross" from={2} step={step} />
          <Seg d="M 124 90 q 20 18 40 0" from={3} step={step} width={2.4} dash="5 4" />
          <Mark x={168} y={118} text="tuck" from={3} step={step} />
          <Seg d="M 164 90 L 280 90" from={4} step={step} width={2} />
        </>
      );
    case "rope-hitch-pile":
      return (
        <>
          <Spar x={160} y1={24} y2={168} />
          <Seg d="M 160 40 q -70 20 -70 50 q 0 30 70 50" from={1} step={step} width={2.8} />
          <Seg d="M 160 40 q 70 20 70 50 q 0 30 -70 50" from={1} step={step} width={2.8} />
          <Mark x={40} y={90} text="bight" from={1} step={step} />
          <Seg d="M 90 140 L 230 140" from={2} step={step} width={2.5} />
          <Mark x={236} y={144} text="around both" from={2} step={step} />
          <Seg d="M 160 40 l 0 -16" from={3} step={step} width={2.4} dash="4 4" />
          <Mark x={168} y={28} text="over top" from={3} step={step} />
          <Seg role="stand" d="M 230 140 L 360 140" from={4} step={step} />
          <Seg role="stand" d="M 90 140 L 20 140" from={4} step={step} />
        </>
      );
    case "rope-hitch-buntline":
      return (
        <>
          <Ring cx={80} cy={90} r={18} />
          <Mark x={40} y={40} text="ring" from={1} step={step} />
          <Seg role="stand" d="M 16 90 q 20 -28 64 -18" from={1} step={step} />
          <Seg d="M 80 72 q 28 0 28 18 q 0 18 -28 18" from={1} step={step} width={2.8} />
          <Seg d="M 108 90 q 36 -8 36 18 q 0 20 -40 8" from={2} step={step} width={2.6} />
          <Mark x={150} y={62} text="hitch at the ring" from={2} step={step} />
          <Seg d="M 140 108 q -20 8 -32 0" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={148} y={128} text="cinches to object" from={3} step={step} />
          <Seg role="stand" d="M 176 90 L 360 90" from={4} step={step} />
        </>
      );
    case "rope-hitch-icicle":
      return (
        <>
          <Spar />
          <Seg role="stand" d="M 80 28 L 80 90 L 360 90" from={1} step={step} width={2.2} />
          <Mark x={200} y={80} text="load →" from={1} step={step} />
          <Seg d={coils(80, 90, 5, 18, 14)} from={1} step={step} width={2.8} />
          <Mark x={88} y={58} text="many wraps" from={1} step={step} />
          <Seg d="M 170 90 q 28 -26 0 -40" from={2} step={step} width={2.5} />
          <Mark x={178} y={44} text="lock wraps" from={2} step={step} />
          <Seg d="M 170 90 q 20 18 40 0" from={3} step={step} width={2.4} dash="5 4" />
          <Mark x={214} y={118} text="tuck" from={3} step={step} />
          <Seg d="M 210 90 L 320 90" from={4} step={step} width={2} />
        </>
      );
    case "rope-timber":
      return (
        <>
          <Spar y1={40} y2={150} />
          <Seg role="stand" d="M 80 90 L 360 90" from={1} step={step} />
          <Seg d="M 80 90 q 40 40 90 8" from={1} step={step} width={2.6} />
          <Mark x={100} y={140} text="around spar" from={1} step={step} />
          <Seg d={coils(170, 90, 3, 20, 13)} from={2} step={step} width={2.5} />
          <Mark x={176} y={62} text="dogs" from={2} step={step} />
          <Seg d="M 230 90 L 170 90" from={3} step={step} width={2.2} dash="5 4" />
          <Mark x={250} y={80} text="bite" from={4} step={step} />
        </>
      );
    case "rope-trucker":
      return (
        <>
          <Spar x={48} y1={40} y2={150} />
          <Seg role="stand" d="M 48 120 L 200 120 L 200 64" from={1} step={step} />
          <Mark x={56} y={136} text="far point" from={1} step={step} />
          <Seg d="M 200 64 q 28 -28 56 0 q -28 28 -56 0" from={2} step={step} width={2.6} />
          <Mark x={220} y={32} text="loop" from={2} step={step} />
          <Seg d="M 256 64 L 200 120 L 320 120" from={3} step={step} width={2.5} />
          <Mark x={268} y={110} text="2:1" from={3} step={step} />
          <Seg d={coils(250, 120, 2, 18, 12)} from={4} step={step} width={2.4} />
          <Mark x={250} y={148} text="lock" from={4} step={step} />
        </>
      );
    case "rope-bend":
      return (
        <>
          <Seg
            d="M 8 74 L 176 74 q 22 0 22 18 q 0 18 -22 18 L 8 110"
            from={1}
            step={step}
            width={4}
          />
          <Mark x={12} y={64} text="bight" from={1} step={step} />
          <Seg role="stand" d="M 392 90 L 196 90" from={1} step={step} />
          <Seg d="M 196 90 q -30 -28 -70 0 q 30 28 70 0" from={2} step={step} width={2.6} />
          <Mark x={140} y={52} text="around" from={2} step={step} />
          <Seg d="M 126 90 q 16 22 0 36" from={3} step={step} width={2} dash="4 4" />
          <Mark x={132} y={140} text="tuck" from={3} step={step} />
          <Seg d="M 196 90 l 24 -16" from={4} step={step} width={1.8} dash="4 4" />
          <Mark x={220} y={68} text="same side" from={4} step={step} />
        </>
      );
    case "rope-bend-double":
      return (
        <>
          <Seg
            d="M 8 74 L 176 74 q 22 0 22 18 q 0 18 -22 18 L 8 110"
            from={1}
            step={step}
            width={4}
          />
          <Mark x={12} y={64} text="bight" from={1} step={step} />
          <Seg role="stand" d="M 392 90 L 196 90" from={1} step={step} />
          <Seg d="M 196 90 q -30 -28 -70 0 q 30 28 70 0" from={2} step={step} width={2.6} />
          <Mark x={140} y={52} text="turn 1" from={2} step={step} />
          <Seg d="M 196 90 q -38 -40 -86 0 q 38 40 86 0" from={3} step={step} width={2.4} />
          <Mark x={92} y={36} text="turn 2" from={3} step={step} />
          <Seg d="M 110 90 q 16 22 0 36" from={4} step={step} width={2} dash="4 4" />
          <Mark x={116} y={140} text="tuck" from={4} step={step} />
          <Mark x={220} y={68} text="same side" from={4} step={step} />
        </>
      );
    case "rope-bend-zeppelin":
      return (
        <>
          <Seg d="M 70 70 q 40 -36 70 0 q -16 20 -70 0" from={1} step={step} width={2.8} />
          <Mark x={70} y={36} text="6" from={1} step={step} />
          <Seg d="M 260 118 q -40 36 -70 0 q 16 -20 70 0" from={2} step={step} width={2.8} />
          <Mark x={270} y={156} text="9" from={2} step={step} />
          <Seg d="M 140 70 L 190 118 M 190 70 L 140 118" from={3} step={step} width={2.4} />
          <Mark x={168} y={52} text="through both" from={3} step={step} />
          <Seg role="stand" d="M 8 94 L 120 94 M 280 94 L 392 94" from={4} step={step} />
        </>
      );
    case "rope-bend-carrick":
      return (
        <>
          <Seg
            d="M 90 60 q 50 0 70 30 q 0 40 -70 40 q -40 0 -50 -30 q 0 -40 50 -40"
            from={1}
            step={step}
            width={2.6}
          />
          <Seg
            d="M 310 120 q -50 0 -70 -30 q 0 -40 70 -40 q 40 0 50 30 q 0 40 -50 40"
            from={2}
            step={step}
            width={2.6}
          />
          <Mark x={168} y={40} text="lattice" from={2} step={step} />
          <Seg d="M 160 90 L 240 90" from={3} step={step} width={2.2} dash="5 4" />
          <Seg role="stand" d="M 8 90 L 90 90 M 310 90 L 392 90" from={4} step={step} />
          <Mark x={300} y={156} text="seize tails" from={4} step={step} />
        </>
      );
    case "rope-reef":
      return (
        <>
          <Seg role="stand" d="M 40 78 L 360 78" from={1} step={step} width={2.2} />
          <Seg d="M 40 112 L 360 112" from={1} step={step} width={2.2} />
          <Seg d="M 150 78 L 170 112 L 190 78" from={1} step={step} width={2.8} />
          <Mark x={120} y={64} text="half 1" from={1} step={step} />
          <Seg d="M 210 112 L 230 78 L 250 112" from={2} step={step} width={2.8} />
          <Mark x={214} y={132} text="half 2" from={2} step={step} />
          <Mark x={160} y={48} text="flat" from={3} step={step} />
          <Mark x={280} y={64} text="bind only" from={4} step={step} />
        </>
      );
    case "rope-loop":
      return (
        <>
          <Seg d="M 36 68 q -26 20 0 44 L 148 112" from={1} step={step} width={2.5} />
          <Seg role="stand" d="M 36 68 L 148 68" from={1} step={step} width={2.5} />
          <Mark x={36} y={56} text="rabbit hole" from={1} step={step} />
          <Seg d="M 148 90 q 28 -40 74 0 q -28 40 -74 0" from={2} step={step} width={2.6} />
          <Mark x={180} y={44} text="collar" from={2} step={step} />
          <Seg d="M 222 90 L 148 90" from={3} step={step} width={2.3} dash="5 4" />
          <Mark x={226} y={86} text="down" from={3} step={step} />
          <Seg role="stand" d="M 222 90 L 372 90" from={4} step={step} />
        </>
      );
    case "rope-loop-figure8":
      return (
        <>
          <Seg
            d="M 70 90 q -30 -40 0 -50 q 50 0 50 40 q 0 50 50 50 q 40 0 40 -40 q 0 -50 -50 -50"
            from={1}
            step={step}
            width={2.6}
          />
          <Mark x={40} y={36} text="eight" from={1} step={step} />
          <Seg d="M 210 90 q 30 40 70 0 q -20 -30 -70 0" from={2} step={step} width={2.5} />
          <Mark x={250} y={48} text="eye" from={2} step={step} />
          <Seg role="stand" d="M 70 90 L 20 90 M 280 90 L 380 90" from={3} step={step} />
          <Mark x={300} y={80} text="parallel" from={4} step={step} />
        </>
      );
    case "rope-loop-butterfly":
      return (
        <>
          <Seg role="stand" d="M 8 90 L 392 90" from={1} step={step} width={2.2} />
          <Seg d="M 150 90 q 20 -20 50 0 q 20 20 50 0" from={1} step={step} width={2.4} />
          <Mark x={168} y={64} text="wraps" from={1} step={step} />
          <Seg d="M 200 90 q -24 -70 0 -78 q 24 8 0 78" from={2} step={step} width={2.8} />
          <Mark x={208} y={18} text="loop" from={2} step={step} />
          <Seg d="M 170 90 q 0 24 60 0" from={3} step={step} width={2.4} />
          <Mark x={140} y={128} text="square body" from={4} step={step} />
        </>
      );
    case "rope-loop-bight":
      return (
        <>
          <Seg d="M 50 70 q -24 20 0 40 L 150 110" from={1} step={step} width={2.4} />
          <Seg role="stand" d="M 50 70 L 150 70" from={1} step={step} width={2.4} />
          <Mark x={40} y={56} text="bight" from={1} step={step} />
          <Seg d="M 150 90 q 24 -36 64 0 q -24 36 -64 0" from={2} step={step} width={2.5} />
          <Seg d="M 214 70 q 40 0 70 20 q 0 30 -70 20" from={3} step={step} width={2.5} />
          <Mark x={250} y={56} text="around both" from={3} step={step} />
          <Seg d="M 284 90 L 370 90" from={4} step={step} />
        </>
      );
    case "rope-stopper":
      return (
        <>
          <Block />
          <Seg role="stand" d="M 8 90 L 392 90" from={1} step={step} />
          <Seg d="M 214 90 q 24 -32 52 0 q -24 32 -52 0" from={2} step={step} width={3} />
          <Mark x={228} y={50} text="eight" from={2} step={step} />
          <Seg d="M 266 90 q 18 -22 36 0" from={3} step={step} width={2} dash="4 4" />
          <Mark x={280} y={60} text="size" from={3} step={step} />
        </>
      );
    case "rope-stopper-estar":
      return (
        <>
          <Block />
          <Seg role="stand" d="M 8 90 L 392 90" from={1} step={step} />
          <Seg d="M 200 90 q 20 -28 44 0 q -20 28 -44 0" from={2} step={step} width={2.6} />
          <Mark x={204} y={54} text="extra turns" from={2} step={step} />
          <Seg d="M 244 90 q 16 -22 32 0 q -16 22 -32 0" from={3} step={step} width={2.8} />
          <Seg d="M 276 90 q 14 -18 28 0" from={3} step={step} width={2.4} />
          <Mark x={280} y={56} text="HMPE hold" from={3} step={step} />
          <Seg d="M 304 90 q 14 18 0 28" from={4} step={step} width={2} dash="4 4" />
          <Mark x={312} y={132} text="tuck" from={4} step={step} />
        </>
      );
    case "rope-stopper-ashley":
      return (
        <>
          <Block />
          <Seg role="stand" d="M 8 90 L 392 90" from={1} step={step} />
          <Seg d="M 214 90 q 18 -26 40 0 q -18 26 -40 0" from={2} step={step} width={2.6} />
          <Seg d="M 244 108 q 16 18 36 0 q -12 -16 -36 0" from={3} step={step} width={2.6} />
          <Mark x={250} y={148} text="3 lobes" from={3} step={step} />
          <Seg d="M 280 90 q 16 -18 28 0" from={4} step={step} width={2} dash="4 4" />
        </>
      );
    case "rope-heaving":
      return (
        <>
          <Seg d="M 40 90 q 40 -50 90 0 q -40 50 -90 0" from={1} step={step} width={2.6} />
          <Mark x={48} y={48} text="bight" from={1} step={step} />
          <Seg d={coils(130, 90, 5, 18, 16)} from={2} step={step} width={3} />
          <Mark x={150} y={58} text="mass" from={2} step={step} />
          <Seg d="M 220 90 q 16 20 0 28" from={3} step={step} width={2.2} dash="4 4" />
          <Mark x={228} y={132} text="tuck" from={3} step={step} />
          <Seg role="stand" d="M 220 90 L 380 90" from={4} step={step} />
        </>
      );
    default:
      return (
        <>
          <Seg role="stand" d="M 8 90 L 392 90" from={1} step={step} />
          <Seg d={coils(130, 90, 5, 24, 16)} from={2} step={step} width={2.5} />
          <Seg d="M 250 90 l 30 -20" from={3} step={step} width={2} dash="5 4" />
        </>
      );
  }
}

const KIND_DESCRIPTION: Record<DiagramKind, string> = {
  "terminal-eye":
    "Standing line to a hook eye, wraps back along the standing part, tag tucked through the first wrap.",
  "terminal-palomar":
    "Doubled bight through the eye, overhand in the doubled line, loop passed over the hook, seated to the eye.",
  "terminal-uni":
    "Line through the eye, doubled back into a loop; tag wraps inside that loop; barrel slides to the eye.",
  "terminal-snell":
    "Two parallel strands along the hook shank; wraps over both; tag finishes at the eye.",
  "terminal-davy":
    "Compact hitch at the eye: tippet through, around, and seated — a fly hitch, not a wrap barrel.",
  "terminal-turle": "A collar around the hook eye so the fly sits in line with the tippet.",
  "terminal-clinch":
    "Wraps down the standing part; tag tucked once through the first wrap at the eye. No second tuck.",
  "terminal-improved":
    "Clinch wraps, tag through the small loop at the eye, then through the large loop. Two tucks.",
  "terminal-trilene":
    "Line through the eye twice so a double loop sits at the eye; wraps; tag through that double loop.",
  "terminal-pitzen":
    "Spiral wraps around the standing part; tag goes back through the eye to lock.",
  "terminal-jansik":
    "Three passes through the eye form a triangle. Tags exit opposite the standing part.",
  "terminal-jam": "Doubled line through the eye; wraps around both legs; tag through the end loop.",
  "terminal-egg": "Snell wraps on the shank plus an open loop that holds bait.",
  "terminal-knotless": "Through the eye, around the bend, back through the eye. No wraps to count.",
  "line-join": "Two lines opposite ways; a barrel on each; barrels drawn together until they butt.",
  "line-blood":
    "Opposite barrels wrapped on the overlap, then drawn together until they kiss. No uni loops.",
  "line-surgeons":
    "Both lines laid together; one (or two) overhand knots in the pair. Tags exit both sides.",
  "line-albright":
    "Heavy leader folded into a U; thin line wraps the doubled leader and tucks through the bight.",
  "braid-leader-fg":
    "Heavy leader straight; thin braid plaited over it as a sleeve; locking hitches at the end.",
  "braid-leader-alberto":
    "Leader folded into a bight; braid wraps up the doubled section and back down over itself.",
  "loop-fixed": "A standing loop locked above so the loop stays open under load.",
  "loop-nonslip":
    "Overhand in the standing line, tag through hardware and back, wraps, leaving a loop that cannot close.",
  "loop-dropper":
    "Twists either side of a mid-line opening; the loop stands perpendicular to the main line.",
  "loop-handshake":
    "Two finished loops interlocked as a handshake — neither loop cinched around the other.",
  "loop-rapala":
    "Overhand tied first in the standing line; hook in the loop; tag back through the overhand.",
  "double-line":
    "A long doubled section twisted or plaited into a column and locked at the far end.",
  "fly-line-coil":
    "Thick fly line meets a thinner leader; even wraps transfer onto the fly-line tip.",
  "arbor-spool":
    "Line around the reel arbor; a sliding overhand to the spool and a stopper in the tag.",
  "rope-cleat":
    "Full turn on the far horn, figure-eights across both horns, locking hitch under the last cross.",
  "rope-hitch": "Working end wraps a spar and tucks under itself so friction holds the load.",
  "rope-hitch-round":
    "Round turn on the spar or ring takes the load; two nested half hitches only lock it.",
  "rope-hitch-clove":
    "Two stacked turns on the spar, working end tucked under the second. Turns must stay together.",
  "rope-hitch-rolling":
    "Two turns on the load side of the standing part, a crossing third, tail tucked — directional grip.",
  "rope-hitch-pile":
    "A bight over the pile, around both standing parts, bight dropped back over the top. Both legs share.",
  "rope-hitch-buntline":
    "Round turn, then a clove that slides to the object and cinches. Not two half hitches on the standing part.",
  "rope-hitch-icicle":
    "A long stack of wraps along the spar, then locking wraps. More friction surface than a rolling hitch.",
  "rope-timber":
    "Around the spar, working end dogged around its own standing part. Holds under tension only.",
  "rope-trucker":
    "Around a far point, directional loop, tail through for 2:1 purchase, two half hitches to lock.",
  "rope-bend": "Bight in the thicker rope; second rope through, around, tucked; tails same side.",
  "rope-bend-double":
    "Bight in the thicker rope; thinner rope takes two turns around the bight, then tucks. Tails same side.",
  "rope-bend-zeppelin":
    "A 6 in one rope, a 9 in the other, working ends opposite, each through both loops.",
  "rope-bend-carrick":
    "Over-under lattice of two large ropes. Seize the tails on a standing hawser.",
  "rope-reef":
    "Two nested opposite-hand half-knots. Binding only — not a join of two standing parts.",
  "rope-loop":
    "Fixed eye: working end up through a small loop, around the standing part, back down. Collar seated.",
  "rope-loop-figure8":
    "Figure-eight tied in a bight; both strands nested; eye size set before the eight.",
  "rope-loop-butterfly":
    "Mid-line loop. Both standing parts leave opposite sides of a square body.",
  "rope-loop-bight": "Two mid-line loops; the bight must finish around both standing parts.",
  "rope-stopper":
    "Compact figure-eight in the tail, larger than the block or fairlead after dress.",
  "rope-stopper-ashley": "Three-lobed stopper. Two lobes is still an overhand.",
  "rope-stopper-estar":
    "Estar path: extra turns a figure-eight does not have. The extra tucks are the hold in HMPE.",
  "rope-heaving": "Wraps that add throwing mass. Not a load-bearing stopper.",
  generic: "A single line with wraps along it and a tag exiting the lock.",
};

const STEP_NOTE: Partial<Record<DiagramKind, Record<number, string>>> = {
  "terminal-palomar": {
    1: "Doubled line through the eye — both legs parallel.",
    2: "Loose overhand in the doubled line. Do not cinch yet.",
    3: "The whole hook or lure through the big loop.",
    4: "Wet and seat the coils to the eye.",
    5: "Tag pointing away from the stack, then trim.",
  },
  "terminal-uni": {
    1: "Through the eye, then doubled back into a loop alongside the standing part.",
    2: "Wrap the tag inside that loop. Count the turns.",
    3: "Close the barrel fully before it slides.",
    4: "Slide the finished barrel to the eye and lock.",
  },
  "terminal-snell": {
    1: "Two parallel strands along the shank — one is the standing part, one the tag.",
    2: "Wraps over both, stacked toward the eye.",
    3: "Tag finishes at the eye, not the bend.",
    4: "Shank wraps tight and even; hook hangs in line.",
  },
  "terminal-eye": {
    1: "Tag through the eye with enough length to wrap.",
    2: "Wraps down the standing part, none crossing.",
    3: "Tag tucked through the first wrap at the eye.",
    4: "Seat as a block; tag pointing away.",
  },
  "terminal-davy": {
    1: "Tippet through the eye — a hitch, not a barrel.",
    2: "Single hitch around the standing tippet.",
    3: "Slide the hitch to the eye and lock.",
    4: "Trim. If it walks, it was not seated.",
  },
  "terminal-turle": {
    1: "Tippet through the eye and around behind it.",
    2: "Collar forms around the eye so the fly tracks straight.",
    3: "Cinch the collar; the fly should sit in line.",
    4: "A crooked fly means the collar is on the shank, not the eye.",
  },
  "terminal-clinch": {
    1: "Tag through the eye with length to wrap.",
    2: "Five or more wraps down the standing part.",
    3: "Tag through the small loop at the eye — once.",
    4: "Seat as a block. There is no second tuck.",
  },
  "terminal-improved": {
    1: "Tag through the eye with extra length — two tucks need it.",
    2: "Wraps stacked evenly, none crossing.",
    3: "Tag through the small loop at the eye.",
    4: "Then through the large loop. Skipping this is a plain clinch.",
  },
  "terminal-trilene": {
    1: "Through the eye twice. A double loop must sit at the eye.",
    2: "Wraps around the standing part, not the double loop.",
    3: "Tag through that double loop.",
    4: "Seat; the double pass is the whole point of this knot.",
  },
  "terminal-pitzen": {
    1: "Through the eye, tag long.",
    2: "Spiral wraps toward the eye, each sitting beside the last.",
    3: "Tag back through the eye to lock.",
    4: "A tag that never re-enters the eye is not a Pitzen.",
  },
  "terminal-jansik": {
    1: "First pass through the eye.",
    2: "Second pass — a triangle starts to form.",
    3: "Third pass closes the triangle.",
    4: "Three loops even; tags opposite the standing part.",
  },
  "terminal-jam": {
    1: "Doubled line through the eye. Both legs stay parallel.",
    2: "Wraps around both legs, not just one.",
    3: "Tag through the end loop.",
    4: "Barrel slides to the eye as a unit.",
  },
  "terminal-egg": {
    1: "Two strands along the shank, as a snell.",
    2: "Wraps over both toward the eye.",
    3: "Leave an open loop off the shank — that holds the bait.",
    4: "The loop must stay open after seating.",
  },
  "terminal-knotless": {
    1: "Through the eye toward the bend.",
    2: "Around the bend, back up the shank.",
    3: "Back through the eye the other way.",
    4: "Pull standing and tag to seat. No wraps to count.",
  },
  "line-join": {
    1: "Two lines opposite ways, overlap long enough for both barrels.",
    2: "First barrel — wraps inside its own loop.",
    3: "Second barrel the other way.",
    4: "Draw until the barrels butt. A gap is a fail.",
  },
  "line-blood": {
    1: "Overlap. No uni loops — just the two standing parts.",
    2: "Wraps one way down the overlap.",
    3: "Wraps the other way, opposite hand.",
    4: "Barrels drawn together until they kiss.",
  },
  "line-surgeons": {
    1: "Both lines together, an overlap in hand.",
    2: "Overhand in the pair — both lines treated as one.",
    3: "Through again if it is a double surgeon.",
    4: "Tags exit both sides; dress before load.",
  },
  "line-albright": {
    1: "Heavy leader folded into a U. Thin line inside the bight.",
    2: "Thin line wraps the doubled leader, working toward the bight end.",
    3: "Tag through the remaining bight.",
    4: "Slide the wraps up; the U should disappear into a taper.",
  },
  "braid-leader-fg": {
    1: "Leader straight and under tension. Braid starts the plait.",
    2: "Alternating weaves, each snugged before the next.",
    3: "Plait long and dense — no leader showing between weaves.",
    4: "Locking hitches, then a finish hitch.",
    5: "Tag will not move under a thumbnail.",
  },
  "braid-leader-alberto": {
    1: "Leader folded into a bight. Braid starts at the fold.",
    2: "Wraps up the doubled leader.",
    3: "Wraps back down over the first layer.",
    4: "Both tags trimmed; the taper should be smooth.",
  },
  "loop-fixed": {
    1: "Size the loop now — it will not change under load.",
    2: "The loop itself, standing open.",
    3: "Lock above the loop so it cannot close.",
    4: "Tag tucked; loop still the size you set.",
  },
  "loop-nonslip": {
    1: "Overhand in the standing line first.",
    2: "Tag through the hardware and back, leaving the loop.",
    3: "Wraps around the standing part.",
    4: "Back through the overhand. The loop must not slip.",
  },
  "loop-dropper": {
    1: "Mid-line, not an end.",
    2: "Twists either side of the opening.",
    3: "The loop pulled through, standing perpendicular.",
    4: "Loop should stand off the main line, not collapse into it.",
  },
  "loop-handshake": {
    1: "Two finished loops, each already locked.",
    2: "Pass one loop through the other — a handshake.",
    3: "Do not girth-hitch. Neither loop cinches the other.",
    4: "Pull both standing parts. The join should look like two links.",
  },
  "loop-rapala": {
    1: "Overhand in the standing line before the hook goes anywhere.",
    2: "Tag through the eye, around the hook, loop sized.",
    3: "Back through the overhand.",
    4: "Wraps, then seat. The overhand is the lock, not a wrap count.",
  },
  "double-line": {
    1: "A long doubled section — this is the whole knot.",
    2: "Twists or plaits into a tight column.",
    3: "Lock at the far end so the column cannot unwind.",
    4: "Column even; lock seated; tags short.",
  },
  "fly-line-coil": {
    1: "Thick fly line butted to the thinner leader.",
    2: "Even wraps transfer onto the fly-line coating.",
    3: "Tag tucked; no fly-line coating stripped.",
    4: "The join should be a smooth taper, not a lump.",
  },
  "arbor-spool": {
    1: "Around the arbor so the line cannot slip on a spinning spool.",
    2: "Sliding overhand that will run to the arbor.",
    3: "Stopper in the tag so the slide cannot come undone.",
    4: "Cinch to the arbor. Backing should not spin on the spool.",
  },
  "rope-cleat": {
    1: "First turn on the far horn — never the near horn.",
    2: "Figure-eights lying flat across both horns.",
    3: "Locking hitch under the last cross, still breakable by hand.",
    4: "If you cannot cast off under load, remake it.",
  },
  "rope-hitch": {
    1: "Working end around the spar.",
    2: "Tuck under itself.",
    3: "Friction, not a lock, holds the load.",
    4: "A hitch that stands open is already walking.",
  },
  "rope-hitch-round": {
    1: "Round turn on the spar or ring — this takes the load.",
    2: "First half hitch on the standing part, away from the object.",
    3: "Second half hitch nested against the first.",
    4: "The hitches lock; the round turn carries.",
  },
  "rope-hitch-clove": {
    1: "First turn around the spar.",
    2: "Second turn crosses over the first.",
    3: "Working end tucked; turns stacked.",
    4: "A spread clove is already walking.",
  },
  "rope-hitch-rolling": {
    1: "Two turns on the load side of the standing part.",
    2: "A crossing third turn.",
    3: "Tail tucked. Directional — it grips one way.",
    4: "Load it the gripping way. The other way it slides.",
  },
  "rope-hitch-pile": {
    1: "Bight over the pile, both legs hanging.",
    2: "Bight around both standing parts.",
    3: "Drop the bight back over the top.",
    4: "Both legs share. A single-leg finish is a cow hitch dressed wrong.",
  },
  "rope-hitch-buntline": {
    1: "Round turn on the ring or rail.",
    2: "Clove hitch tied on the standing part, then slid to the object.",
    3: "It cinches to the object — that is the point.",
    4: "Hard to untie after load. That is the job, not a defect.",
  },
  "rope-hitch-icicle": {
    1: "Many wraps along the spar, stacked toward the load.",
    2: "Locking wraps over the stack.",
    3: "Tail tucked so the stack cannot unwind.",
    4: "More friction surface than a rolling hitch — that is why it holds on a spar.",
  },
  "rope-timber": {
    1: "Around the spar.",
    2: "Working end dogged around its own standing part.",
    3: "The dogs bite under tension only.",
    4: "Slack it and it lets go. Do not use it as a hitch that must stay.",
  },
  "rope-trucker": {
    1: "Around a far point.",
    2: "A directional loop in the standing part.",
    3: "Tail through the loop for 2:1 purchase.",
    4: "Two half hitches to lock. The loop must not collapse under haul.",
  },
  "rope-bend": {
    1: "Bight in the thicker rope.",
    2: "Second rope through the bight and around.",
    3: "Tuck under itself.",
    4: "Tails same side. Opposite tails is a thief knot.",
  },
  "rope-bend-double": {
    1: "Bight in the thicker rope — never the thinner.",
    2: "First turn of the thinner rope around the bight.",
    3: "Second turn. One turn is a single sheet bend.",
    4: "Tuck. Tails same side. Opposite tails slip on a mismatch.",
  },
  "rope-bend-zeppelin": {
    1: "A 6 in one rope — look at it from above.",
    2: "A 9 in the other, facing the 6.",
    3: "Each working end through both loops.",
    4: "Pull the standing parts. The body should look like two linked overhands.",
  },
  "rope-bend-carrick": {
    1: "First large loop, laid open.",
    2: "Second rope weaves over-under through it.",
    3: "The lattice should be flat, no two overs in a row.",
    4: "Seize the tails on a standing hawser. An unseized carrick can capsize.",
  },
  "rope-reef": {
    1: "First half-knot, right-over-left (or left-over-right).",
    2: "Second half-knot the opposite hand.",
    3: "The body lies flat. A granny stands up.",
    4: "Binding only. Do not join two standing parts with this.",
  },
  "rope-loop": {
    1: "Small loop in the standing part — the rabbit hole.",
    2: "Working end around the standing part. That is the collar.",
    3: "Back down through the hole.",
    4: "Collar tight on the standing part before you load it.",
  },
  "rope-loop-figure8": {
    1: "Figure-eight in a bight. Both strands nested.",
    2: "The eye size is set now, before the eight is dressed.",
    3: "Dress so both strands stay parallel.",
    4: "A crossed eight is a different knot. Untie and remake.",
  },
  "rope-loop-butterfly": {
    1: "Wraps in the standing part, mid-line.",
    2: "The loop pulled through.",
    3: "Body sits square.",
    4: "Both standing parts leave opposite sides. That is the load path.",
  },
  "rope-loop-bight": {
    1: "A bight — two loops, not one.",
    2: "Around the standing parts.",
    3: "The bight must finish around both standing parts.",
    4: "Two eyes of equal size, collar seated.",
  },
  "rope-stopper": {
    1: "In the tail, not mid-line.",
    2: "Figure-eight, dressed compact.",
    3: "Larger than the block or fairlead after dress.",
    4: "If it pulls through, it was too small or not dressed.",
  },
  "rope-stopper-estar": {
    1: "Start the Estar path — not a figure-eight.",
    2: "Extra turns a figure-eight does not have.",
    3: "Those tucks are the hold in Dyneema.",
    4: "Compact, larger than the opening. A figure-8 in HMPE walks.",
  },
  "rope-stopper-ashley": {
    1: "Start as you would an overhand.",
    2: "Extra tuck that makes the third lobe.",
    3: "Three lobes. Two lobes is still an overhand.",
    4: "Dress tight. The three lobes should be even.",
  },
  "rope-heaving": {
    1: "A bight to start the mass.",
    2: "Wraps that add throwing weight.",
    3: "Tuck so the mass cannot unwind in the air.",
    4: "This is a throwing knot, not a load-bearing stopper.",
  },
};

export function describeDiagram(kind: DiagramKind, step?: number, totalSteps?: number) {
  const base = KIND_DESCRIPTION[kind] ?? KIND_DESCRIPTION.generic;
  const note = step ? STEP_NOTE[kind]?.[step] : undefined;
  if (step === undefined) return `Finished structure. ${base}`;
  const of = totalSteps ? ` of ${totalSteps}` : "";
  const how =
    "Gold line is this step. Teal is the working end already placed. Light grey is still to come.";
  return `Step ${step}${of}. ${note ? `${note} ` : ""}${how} ${base}`;
}

export function diagramStepNote(kind: DiagramKind, step?: number) {
  if (!step) return KIND_DESCRIPTION[kind] ?? KIND_DESCRIPTION.generic;
  const notes = STEP_NOTE[kind];
  if (notes?.[step]) return notes[step];
  const keys = notes ? Object.keys(notes).map(Number) : [];
  const last = keys.length ? Math.max(...keys) : 0;
  if (notes && step > last && notes[last]) return notes[last];
  return KIND_DESCRIPTION[kind] ?? KIND_DESCRIPTION.generic;
}

function Legend() {
  return (
    <g aria-hidden="true">
      <line x1={12} y1={168} x2={28} y2={168} stroke={LINE} strokeWidth={3} strokeLinecap="round" />
      <text
        x={32}
        y={171}
        fill={GHOST}
        fontSize={8}
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        letterSpacing="0.1em"
      >
        STANDING
      </text>
      <line
        x1={100}
        y1={168}
        x2={116}
        y2={168}
        stroke={WORK}
        strokeWidth={3}
        strokeLinecap="round"
      />
      <text
        x={120}
        y={171}
        fill={GHOST}
        fontSize={8}
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        letterSpacing="0.1em"
      >
        WORKING
      </text>
      <line
        x1={188}
        y1={168}
        x2={204}
        y2={168}
        stroke={HOT}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <text
        x={208}
        y={171}
        fill={GHOST}
        fontSize={8}
        fontFamily="IBM Plex Mono, ui-monospace, monospace"
        letterSpacing="0.1em"
      >
        THIS STEP
      </text>
    </g>
  );
}

export function KnotDiagram({ kind, step, className, title, focus, description, compact }: Props) {
  const uid = useId();
  const titleId = `${uid}-t`;
  const descId = `${uid}-d`;
  const label = title ?? `Schematic diagram — ${kind}`;
  const desc = description ?? describeDiagram(kind, step);
  const note = diagramStepNote(kind, step);
  return (
    <CompactCtx.Provider value={Boolean(compact)}>
      <figure className={cn("relative ki-diagram", className)}>
        <svg
          viewBox={compact ? "0 0 400 160" : "0 0 400 180"}
          role="img"
          aria-labelledby={titleId}
          aria-describedby={descId}
          className="h-full w-full"
        >
          <title id={titleId}>{label}</title>
          <desc id={descId}>{desc}</desc>
          <defs>
            <pattern id={`${uid}-grid`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect
            aria-hidden="true"
            width="400"
            height={compact ? 160 : 180}
            fill={`url(#${uid}-grid)`}
            className="text-muted-foreground"
            opacity={0.14}
          />
          <g
            aria-hidden="true"
            transform={focusTransform(kind, step, focus)}
            className="transition-transform duration-500 ease-out motion-reduce:transition-none"
          >
            <Body kind={kind} step={step} />
          </g>
          {compact ? null : <Legend />}
        </svg>
        {compact ? null : (
          <figcaption className="pointer-events-none absolute top-1 right-2 max-w-[46%] text-right font-mono text-[0.5625rem] uppercase tracking-[0.14em] text-muted-foreground/70">
            {step ? `step ${String(step).padStart(2, "0")} · schematic` : "finished · schematic"}
          </figcaption>
        )}
        <p className="sr-only">{note}</p>
      </figure>
    </CompactCtx.Provider>
  );
}
