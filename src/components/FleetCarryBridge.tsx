import { useEffect, useMemo, useState } from "react";
import {
  fleetUrl,
  loadFleetContext,
  mergeFleetPacket,
  parseFleetPacket,
  saveFleetContext,
  type HthFleetPacket,
} from "@/lib/fleet-context";

const OPS_URL = "https://ops.hookthehorizon.blog/";

type KnotMaterial = "mono" | "fluoro" | "braid" | "wire" | "polyester" | "nylon";

type ProposedSearch = {
  connection?: string;
  main?: KnotMaterial;
  secondary?: KnotMaterial;
  diameter?: string;
  guides?: boolean;
  lowlight?: boolean;
};

function objectPart(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function mapMaterial(material: unknown, construction?: unknown): KnotMaterial | undefined {
  if (construction === "braided" || material === "uhmwpe") return "braid";
  if (material === "fluorocarbon" || material === "fluoro") return "fluoro";
  if (material === "nylon" || material === "mono") return "mono";
  if (material === "wire") return "wire";
  if (material === "polyester") return "polyester";
  return undefined;
}

function diameterRelation(mainRaw: unknown, secondaryRaw: unknown): string | undefined {
  const main = Number(mainRaw);
  const secondary = Number(secondaryRaw);
  if (!(main > 0) || !(secondary > 0)) return undefined;
  const ratio = main / secondary;
  if (ratio >= 0.8 && ratio <= 1.25) return "similar";
  if (ratio < 0.45) return "main-much-thinner";
  if (ratio < 0.8) return "main-thinner";
  if (ratio > 2.2) return "extreme-mismatch";
  return "main-thicker";
}

function proposedSearch(packet: HthFleetPacket): ProposedSearch {
  const tackle = objectPart(packet.tackleEvaluation);
  const system = objectPart(tackle["system"]);
  const line = objectPart(system["line"]);
  const leader = objectPart(system["leader"]);
  const req = objectPart(packet.connectionRequirements);
  const main = mapMaterial(
    req["mainMaterial"] ?? line["material"],
    req["mainConstruction"] ?? line["construction"],
  );
  const secondary = mapMaterial(
    req["secondaryMaterial"] ?? leader["material"],
    req["secondaryConstruction"] ?? leader["construction"],
  );
  const leaderMaterial = leader["material"];
  const leaderDeclared =
    leaderMaterial != null && !["", "none", "unknown"].includes(String(leaderMaterial));
  const mainBraided = main === "braid";

  let connection: string | undefined;
  if (leaderDeclared && main && secondary) {
    connection = mainBraided ? "braid-to-leader" : "leader-to-leader";
  } else if (!leaderDeclared && main) {
    connection = "line-to-lure";
  }

  const light = packet.conditions?.["light"];
  return {
    connection,
    main,
    secondary: leaderDeclared ? secondary : undefined,
    diameter: diameterRelation(
      req["mainDiameterIn"] ?? line["diameterIn"],
      req["secondaryDiameterIn"] ?? leader["diameterIn"],
    ),
    guides: req["mustPassGuides"] === true,
    lowlight: light === "low_light" || light === "night",
  };
}

function packetRows(packet: HthFleetPacket | null, proposed: ProposedSearch) {
  if (!packet) return [] as Array<[string, string]>;
  const rows: Array<[string, string]> = [];
  const waterNameValue = packet.water?.["waterName"];
  const waterName = typeof waterNameValue === "string" ? waterNameValue : null;
  const commonNames = packet.species?.["commonNames"];
  const species = Array.isArray(commonNames)
    ? commonNames.find((v): v is string => typeof v === "string")
    : null;
  if (species) rows.push(["Target", species]);
  if (waterName) rows.push(["Water", waterName]);
  if (proposed.connection) rows.push(["Connection job", proposed.connection.replaceAll("-", " ")]);
  if (proposed.main) rows.push(["Main material", proposed.main]);
  if (proposed.secondary) rows.push(["Second material", proposed.secondary]);
  if (proposed.guides) rows.push(["Constraint", "must pass guides"]);
  if (proposed.lowlight) rows.push(["Field condition", "low light"]);
  return rows;
}

function discoverDecision(): { id: string; label: string } | null {
  if (typeof document === "undefined") return null;
  const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href*="/tie/"]'));
  const link = links.find((a) => {
    try {
      return new URL(a.href, window.location.href).pathname.includes("/tie/");
    } catch {
      return false;
    }
  });
  if (!link) return null;
  let node: HTMLElement | null = link.parentElement;
  let label: string | null = null;
  for (let i = 0; node && i < 5; i += 1, node = node.parentElement) {
    const heading = node.querySelector("h2");
    if (heading?.textContent?.trim()) {
      label = heading.textContent.trim();
      break;
    }
  }
  const path = new URL(link.href, window.location.href).pathname;
  const id = path.split("/tie/")[1]?.split("/")[0] ?? "";
  return id ? { id, label: label ?? id.replaceAll("-", " ") } : null;
}

export function FleetCarryBridge() {
  const [pending, setPending] = useState<HthFleetPacket | null>(null);
  const [base, setBase] = useState<HthFleetPacket | null>(null);
  const [decision, setDecision] = useState<{ id: string; label: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const incoming = parseFleetPacket(window.location.hash);
    if (incoming) setPending(incoming);
    else setBase(loadFleetContext());

    const scan = () => {
      const found = discoverDecision();
      if (found) setDecision(found);
    };
    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ["href"],
    });
    return () => observer.disconnect();
  }, []);

  const active = base ?? pending;
  const proposed = useMemo(() => proposedSearch(active ?? {}), [active]);
  const rows = useMemo(() => packetRows(active, proposed), [active, proposed]);
  const outgoing = useMemo(() => {
    if (!base || !decision) return null;
    return mergeFleetPacket(base, "knot-analyst", "HTH-KK-001", {
      knotDecision: {
        id: decision.id,
        label: decision.label,
        connectionJob: proposed.connection,
        mainMaterial: proposed.main,
        secondaryMaterial: proposed.secondary,
        diameterRelation: proposed.diameter,
      },
      provenance: [
        {
          source: "Knot Analyst ranked connection decision",
          evidenceClass: "declared",
          reviewedAt: new Date().toISOString().slice(0, 10),
        },
      ],
    });
  }, [base, decision, proposed]);

  function useIncoming() {
    if (!pending || typeof window === "undefined") return;
    const accepted = mergeFleetPacket(pending, "knot-analyst", "HTH-KK-001", {});
    saveFleetContext(accepted);
    setBase(accepted);
    setPending(null);

    const next = new URL(window.location.href);
    next.hash = "";
    const p = proposedSearch(accepted);
    if (p.connection) next.searchParams.set("connection", p.connection);
    if (p.main) next.searchParams.set("main", p.main);
    if (p.secondary) next.searchParams.set("secondary", p.secondary);
    if (p.diameter) next.searchParams.set("diameter", p.diameter);
    if (p.guides) next.searchParams.set("guides", "1");
    if (p.lowlight) next.searchParams.set("lowlight", "1");
    if (p.connection) next.searchParams.set("run", "1");
    next.searchParams.set("from", "hth-fleet");
    next.searchParams.set("why", "Carried from Tackle Link; every field remains editable.");
    window.location.assign(next.pathname + next.search);
  }

  function dismissIncoming() {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = "";
      window.history.replaceState({}, "", url.pathname + url.search);
    }
    setPending(null);
  }

  if (!active && !outgoing) return null;

  return (
    <section
      className="border-b border-hairline bg-card/95"
      aria-label="Hook the Horizon carried context"
    >
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent">
          Hook fleet · carried context
        </p>
        {pending ? (
          <>
            <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-xl">
                  Use Tackle Link's declared connection context?
                </h2>
                <p className="mt-1 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                  Knot Analyst will map line/leader materials, guide-passage and low-light
                  constraints. The proposed connection job is visible before it is applied and can
                  be changed immediately.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={useIncoming}
                  className="min-h-11 rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground"
                >
                  Use context
                </button>
                <button
                  type="button"
                  onClick={dismissIncoming}
                  className="min-h-11 rounded-md border border-hairline px-4 text-xs"
                >
                  Ignore
                </button>
              </div>
            </div>
            {rows.length > 0 && (
              <dl className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-6">
                {rows.map(([label, value]) => (
                  <div
                    key={`${label}-${value}`}
                    className="rounded-md border border-hairline bg-surface-2/40 p-2"
                  >
                    <dt className="font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted-foreground">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-xs capitalize">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </>
        ) : (
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Upstream fishing and tackle context remains attached while you compare connection
              families.
            </p>
            {outgoing && (
              <a
                href={fleetUrl(OPS_URL, outgoing)}
                onClick={() => saveFleetContext(outgoing)}
                className="inline-flex min-h-11 items-center rounded-md bg-primary px-4 text-xs font-semibold text-primary-foreground no-underline"
              >
                Carry {decision?.label ?? "decision"} to Field Ops →
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
