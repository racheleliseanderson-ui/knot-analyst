import type { DomainVenue } from "@/domain/venue";

/** Fishing venues. Each patch reproduces conditions the angler would set anyway. */
export const FISHING_VENUES: DomainVenue[] = [
  {
    id: "surf",
    label: "Surf",
    summary: "Sand, sustained casting load and a knot that lives in the guides.",
    conditions: { mustPassGuides: true, windy: true, retieFrequency: "frequent" },
    punishes:
      "Bulk. A profile that survives a boat deck grinds through guides all day in the surf and shock-loads on every cast.",
    watch: "The join, after twenty casts — fuzzing on the leader side means abrasion, not knot failure.",
    fix: "Shorter leader, slimmer join, and retie on a schedule instead of on evidence.",
  },
  {
    id: "pier",
    label: "Pier / jetty",
    summary: "Barnacle and piling abrasion, vertical lifts, no forgiving angle.",
    conditions: { mustPassGuides: false, retieFrequency: "frequent", hardwareEyeSmall: false },
    punishes:
      "Anything you cannot inspect fast. Structure removes line above the knot and blames the knot.",
    watch: "Line above the connection for chalky flat spots before you accuse the knot.",
    fix: "Heavier shock leader and a join you can build again with cold hands on a rail.",
  },
  {
    id: "kayak",
    label: "Kayak / small craft",
    summary: "One-handed work, wet hands, no bench, everything at chest height.",
    conditions: { coldHands: true, windy: true, retieFrequency: "occasional" },
    punishes:
      "Knots that need two clean hands and steady tension. A dropped tag in a kayak is a lost rebuild.",
    watch: "Wraps that never fully seated because you could not pull straight.",
    fix: "Choose the knot you can finish in a rocking hull, not the one that tests best on a desk.",
  },
  {
    id: "flats",
    label: "Inshore flats",
    summary: "Clear water, light leaders, long accurate casts, spooky fish.",
    conditions: { mustPassGuides: true, freeSwing: true, proficiency: "intermediate" },
    punishes:
      "Visible bulk and dead lure action. On the flats a stiff terminal connection is refused before it is tested.",
    watch: "Loop closing down onto the eye after a fight — the action dies before you notice.",
    fix: "Re-open or rebuild the loop after every serious fish.",
  },
  {
    id: "offshore",
    label: "Offshore",
    summary: "Sustained heavy drag, shock loads, consequences you do not get to retry.",
    conditions: { retieFrequency: "rare", proficiency: "advanced", mustPassGuides: true },
    punishes:
      "Anything unverifiable. Offshore, the failure mode is not a lost lure — it is the one fish of the trip.",
    watch: "Seating pattern under load, not appearance at rest.",
    fix: "Build for inspection: if you cannot read the finished structure, do not fish it.",
  },
  {
    id: "river",
    label: "River / wading",
    summary: "Current load, rock abrasion, frequent fly and tippet changes.",
    conditions: { retieFrequency: "frequent", coldHands: true, lowLight: true },
    punishes: "Slow knots. Cold water hands plus a fifteen-step procedure ends in a rushed seat.",
    watch: "Tippet ends curling — a pigtail means it slipped, not broke.",
    fix: "One knot family you can tie blind, rebuilt often, trimmed close.",
  },
];
