import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { ConnectionJob, LineMaterial } from "@/domain/types";
import { type FieldScenario } from "@/data/scenarios";
import { useDomain } from "@/domain/context";
import {
  EMPTY_OVERLAY,
  createLocalAdapter,
  type CustomConnection,
  type CustomMaterial,
  type CustomScenario,
  type OverlayAdapter,
  type OverlayData,
} from "@/lib/overlay-store";

interface OverlayContextValue {
  data: OverlayData;
  ready: boolean;
  adapterName: string;
  setMaterials: (next: CustomMaterial[]) => void;
  setConnections: (next: CustomConnection[]) => void;
  setScenarios: (next: CustomScenario[]) => void;
  replaceAll: (next: OverlayData) => void;
  reset: () => void;
}

const OverlayContext = createContext<OverlayContextValue | null>(null);

export function OverlayProvider({
  children,
  adapter,
}: {
  children: ReactNode;
  adapter?: OverlayAdapter;
}) {
  const store = useMemo(() => adapter ?? createLocalAdapter(), [adapter]);
  const [data, setData] = useState<OverlayData>(EMPTY_OVERLAY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let alive = true;
    store.load().then((loaded) => {
      if (!alive) return;
      setData(loaded);
      setReady(true);
    });
    return () => {
      alive = false;
    };
  }, [store]);

  const commit = useCallback(
    (next: OverlayData) => {
      const stamped = { ...next, updatedAt: new Date().toISOString() };
      setData(stamped);
      void store.save(stamped);
    },
    [store],
  );

  const value = useMemo<OverlayContextValue>(
    () => ({
      data,
      ready,
      adapterName: store.name,
      setMaterials: (materials) => commit({ ...data, materials }),
      setConnections: (connections) => commit({ ...data, connections }),
      setScenarios: (scenarios) => commit({ ...data, scenarios }),
      replaceAll: (next) => commit(next),
      reset: () => commit({ ...EMPTY_OVERLAY }),
    }),
    [data, ready, store.name, commit],
  );

  return <OverlayContext.Provider value={value}>{children}</OverlayContext.Provider>;
}

export function useOverlay(): OverlayContextValue {
  const ctx = useContext(OverlayContext);
  if (!ctx) throw new Error("useOverlay must be used inside <OverlayProvider>");
  return ctx;
}

/* ── Merged option models ────────────────────────────────── */

export interface MaterialOption {
  /** Chip key: base material id, or `x:<custom id>` */
  key: string;
  label: string;
  base: LineMaterial;
  custom: boolean;
  note?: string;
}

export interface ConnectionOption {
  key: string;
  label: string;
  base: ConnectionJob;
  custom: boolean;
  note?: string;
}

export function useMaterialOptions(): MaterialOption[] {
  const { data } = useOverlay();
  const domain = useDomain();
  return useMemo(
    () => [
      ...domain.materials.map((m) => ({
        key: m.id,
        label: m.label,
        base: m.id as LineMaterial,
        custom: false,
      })),
      ...(domain.id === "fishing" ? data.materials : []).map((m) => ({
        key: `x:${m.id}`,
        label: m.label,
        base: m.behavesLike,
        custom: true,
        ...(m.note ? { note: m.note } : {}),
      })),
    ],
    [data.materials, domain],
  );
}

export function useConnectionGroups(): { title: string; jobs: ConnectionOption[] }[] {
  const { data } = useOverlay();
  const domain = useDomain();
  return useMemo(() => {
    const groups: { title: string; jobs: ConnectionOption[] }[] = [];
    for (const c of domain.connections) {
      const option: ConnectionOption = {
        key: c.id,
        label: c.label,
        base: c.id as ConnectionJob,
        custom: false,
      };
      const title = c.group ?? "Other";
      const existing = groups.find((g) => g.title === title);
      if (existing) existing.jobs.push(option);
      else groups.push({ title, jobs: [option] });
    }
    for (const c of domain.id === "fishing" ? data.connections : []) {
      const option: ConnectionOption = {
        key: `x:${c.id}`,
        label: c.label,
        base: c.behavesLike,
        custom: true,
        ...(c.note ? { note: c.note } : {}),
      };
      const existing = groups.find((g) => g.title === c.group);
      if (existing) existing.jobs.push(option);
      else groups.push({ title: c.group, jobs: [option] });
    }
    return groups;
  }, [data.connections, domain]);
}

export function useScenarios(): FieldScenario[] {
  const { data } = useOverlay();
  const domain = useDomain();
  return useMemo(
    () => [
      ...(domain.id === "fishing" ? data.scenarios : []).map<FieldScenario>((s) => ({
        id: s.id,
        title: s.title,
        blurb: s.blurb,
        tag: s.tag,
        connectionLine: s.connectionLine,
        likelyPick: s.likelyPick,
        autoRun: s.autoRun,
        input: s.input,
      })),
      ...domain.scenarios,
    ],
    [data.scenarios, domain],
  );
}
