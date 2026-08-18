/**
 * Diagnose → Tackle Link Analyst handoff (data only).
 *
 * When diagnosis implicates the *connection* as the weakest link (not line
 * damage above the knot, not pure hardware), expose a structured payload and
 * a stable external URL. UI should use the same user-initiated pattern as
 * other external links — this module does not invent button styles.
 *
 * Target: https://tackle.hookthehorizon.blog
 */
import type { TroubleshootInput, TroubleshootResult } from "@/engine/troubleshoot";
import type { BreakLocation, FailureEvent } from "@/data/failure-playbook";

export const TACKLE_LINK_BASE = "https://tackle.hookthehorizon.blog";

export interface TackleHandoffPayload {
  /** Whether the diagnosis supports treating the connection as the weak link. */
  connectionIsWeakestLink: boolean;
  reason: string;
  event?: FailureEvent;
  breakLocation?: BreakLocation;
  connection?: string;
  mainMaterial?: string;
  secondaryMaterial?: string;
  diameterRelation?: string;
  /** Ready-to-open URL with query context (user-initiated). */
  url: string;
}

const CONNECTION_BREAKS: BreakLocation[] = [
  "in-knot",
  "at-tag",
  "leader-join",
  "at-shank",
  "at-loop",
  "at-cleat",
];

const CONNECTION_EVENTS: FailureEvent[] = [
  "broke-under-load",
  "slipped-or-pulled",
  "wont-seat",
  "bulky-guides",
  "keeps-failing",
  "hard-to-tie",
  "pigtail-left",
  "loop-collapsed",
  "join-walked",
  "girth-cinched",
  "shank-walked",
  "coating-peeled",
  "walked-off",
  "capsized",
  "jammed-uncleatable",
  "unequal-slip",
  "stopper-pulled",
  "self-cut",
  "double-line-unravelled",
  "reef-spilled",
  "grip-slipped",
  "cleat-dumped",
];

/**
 * Pure data: decide whether Diagnose should offer a Tackle Link Analyst handoff
 * and build the URL. No UI side effects.
 */
export function tackleHandoffFromDiagnosis(
  input: Partial<TroubleshootInput>,
  result?: TroubleshootResult | null,
): TackleHandoffPayload {
  const breakLocation = input.breakLocation;
  const event = input.event;

  const locationPointsAtConnection =
    breakLocation != null && CONNECTION_BREAKS.includes(breakLocation);
  const eventPointsAtConnection = event != null && CONNECTION_EVENTS.includes(event);
  // Above-knot is line damage — not a connection-family problem for Tackle.
  const notLineDamage = breakLocation !== "above-knot";

  const connectionIsWeakestLink =
    notLineDamage && (locationPointsAtConnection || eventPointsAtConnection);

  const reason = connectionIsWeakestLink
    ? breakLocation === "leader-join"
      ? "Failure at the join — connection geometry / material pair is the primary suspect."
      : breakLocation === "in-knot" || breakLocation === "at-tag"
        ? "Break in the knot or at the tag — connection structure is implicated."
        : "Symptom set points at the connection under stress, not upstream line damage."
    : breakLocation === "above-knot"
      ? "Break above the knot — line damage; connection family is not the first fix."
      : "Insufficient evidence that the connection is the weakest link.";

  const params = new URLSearchParams();
  params.set("from", "knot-analyst-diagnose");
  if (event) params.set("event", event);
  if (breakLocation) params.set("break", breakLocation);
  if (input.connection) params.set("connection", input.connection);
  if (input.mainMaterial) params.set("main", input.mainMaterial);
  if (input.secondaryMaterial) params.set("secondary", input.secondaryMaterial);
  if (input.diameterRelation) params.set("diameter", input.diameterRelation);
  if (result?.retieDecision) params.set("retie", result.retieDecision);
  if (result?.confidence) params.set("confidence", result.confidence);
  params.set("weakest", connectionIsWeakestLink ? "connection" : "unverified");

  return {
    connectionIsWeakestLink,
    reason,
    event,
    breakLocation,
    connection: input.connection,
    mainMaterial: input.mainMaterial,
    secondaryMaterial: input.secondaryMaterial,
    diameterRelation: input.diameterRelation,
    url: `${TACKLE_LINK_BASE}/?${params.toString()}`,
  };
}
