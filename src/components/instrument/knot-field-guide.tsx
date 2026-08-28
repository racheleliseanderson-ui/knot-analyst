import { Link } from "@tanstack/react-router";
import { Bullets, MicroLabel, Panel } from "@/components/instrument/primitives";
import { getKnot } from "@/data/catalog";
import type { Knot } from "@/domain/types";
import {
  CONNECTION_LABELS,
  DIFFICULTY_LABELS,
  MATERIAL_LABELS,
} from "@/domain/types";

function unique(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
}

function fieldFitLabel(score: number | undefined): string {
  if (score == null) return "Not specifically rated";
  if (score >= 80) return "Strong field fit";
  if (score >= 65) return "Usually manageable";
  if (score >= 50) return "Condition-sensitive";
  return "Difficult in this condition";
}

function wrapGuidance(knot: Knot): string {
  const candidates = knot.steps
    .flatMap((step) => [step.instruction, step.tip, step.detail])
    .filter((text): text is string => Boolean(text))
    .filter((text) => /wrap|turn|twist/i.test(text));

  const explicit = candidates.find((text) => /\d/.test(text));
  return explicit ?? candidates[0] ?? "No fixed wrap count is stored for this knot; follow the tying sequence rather than inventing a number.";
}

function lubricationGuidance(knot: Knot): string {
  const text = [
    knot.howToSummary,
    ...knot.steps.flatMap((step) => [step.instruction, step.tip, step.commonError]),
    ...knot.commonMistakes,
  ]
    .filter((value): value is string => Boolean(value))
    .join(" ");

  if (/moisten|wet\b|lubricat/i.test(text)) {
    return "Yes. This knot’s tying record calls for moisture before the final seat. Use water or clean saliva and cinch steadily rather than sawing the line.";
  }
  if (knot.lineMaterials.some((material) => material === "mono" || material === "fluoro")) {
    return "Seat it slowly and watch for friction heat. Mono and fluorocarbon can be damaged by a fast, dry cinch even when a particular step does not specify lubrication.";
  }
  return "Lubrication is not the controlling issue in this record. Follow the seating sequence and use smooth, even tension.";
}

function actionGuidance(knot: Knot): string {
  if (knot.contract.loopBehavior === "non-slip" || knot.contract.loopBehavior === "open") {
    return "Built to preserve free movement. This is the kind of geometry to consider when lure or fly action depends on an open loop.";
  }
  if (knot.contract.loopBehavior === "fixed") {
    return "Creates a fixed loop. It is useful when the loop itself is the job, but it is not automatically a free-swing lure connection.";
  }
  if (knot.contract.connectionFamilies.includes("line-to-lure")) {
    return "This is normally a snug connection. If a lure needs extra freedom to swing, compare it with a non-slip loop knot rather than assuming the tighter knot is always better.";
  }
  return "Lure action is not the main job of this connection.";
}

function reliabilityGuidance(knot: Knot): string[] {
  const sensitivity =
    knot.contract.slipSensitivity === "low"
      ? "Low slip sensitivity when the knot is correctly dressed and seated."
      : knot.contract.slipSensitivity === "moderate"
        ? "Moderate slip sensitivity: inspect the seat and tag after hard use."
        : "High slip sensitivity: wrap count, finish, and tag control are critical.";

  return unique([
    sensitivity,
    ...knot.contract.failureSensitiveStages.map((stage) => `Watch closely during ${stage}.`),
    "After abrasion, a hard snag, a heavy fish, or repeated guide impacts, inspect the line and retie if anything has moved, glazed, flattened, or frayed.",
  ]);
}

function testGuidance(knot: Knot): string[] {
  return [
    `Look for ${knot.fingerprint.expectedCoilDistribution.toLowerCase()} and ${knot.fingerprint.expectedSeatingPattern.toLowerCase()}.`,
    "Apply a slow, firm pull on the finished connection while watching the tag and knot body. Nothing should walk, hinge, or open.",
    "Then make a controlled hard pull appropriate to the line class. If the tag moves, the loop changes size, or the structure shifts, cut it off and retie.",
  ];
}

function tagGuidance(knot: Knot): string {
  const trimStep = [...knot.steps]
    .reverse()
    .find((step) => /trim|tag end|tag close|tag short/i.test(`${step.instruction} ${step.tip ?? ""}`));
  if (trimStep) return trimStep.instruction;
  if (knot.lineMaterials.includes("braid")) {
    return "Do not trim slick braid flush before the pull test. Leave a visible safety tag, test the connection, then trim cleanly.";
  }
  return "Seat and pull-test first, then trim cleanly. Do not use a universal tag length when the knot or material calls for something different.";
}

export function KnotFieldGuide({ knot }: { knot: Knot }) {
  const aliases = knot.aliases.filter((alias) => alias.toLowerCase() !== knot.name.toLowerCase());
  const related = knot.relatedKnots
    .map((id) => getKnot(id))
    .filter((item): item is Knot => Boolean(item));
  const jobLabels = knot.contract.connectionFamilies.map((job) => CONNECTION_LABELS[job]);
  const materials = knot.lineMaterials.map((material) => MATERIAL_LABELS[material]);
  const beginner =
    knot.difficulty === "beginner"
      ? "Yes — this is a reasonable early knot to learn."
      : knot.difficulty === "intermediate"
        ? "Learn it after you can reliably dress and seat a simpler connection."
        : "Advanced. Practice it away from the water before depending on it in a fast retie.";
  const strength =
    knot.strengthRetentionTypical ??
    "No defensible universal percentage is stored for this knot. Strength changes with line brand, diameter, material, tying method, and how well the knot is seated.";
  const speed = fieldFitLabel(knot.fieldFit.baseline.retieSpeed);
  const cold = fieldFitLabel(knot.fieldFit.baseline.coldWetHandDifficulty);
  const wind = fieldFitLabel(knot.fieldFit.baseline.windSensitivity);
  const lowLight = fieldFitLabel(knot.fieldFit.baseline.lowLightDifficulty);

  return (
    <section className="mt-8" aria-labelledby={`field-guide-${knot.id}`}>
      <div className="mb-4">
        <MicroLabel>Quick answers</MicroLabel>
        <h2 id={`field-guide-${knot.id}`} className="mt-2 text-[1.35rem] font-semibold tracking-tight">
          What to know before you trust this knot
        </h2>
        <p className="mt-2 max-w-3xl text-[0.875rem] leading-relaxed text-muted-foreground">
          The practical questions anglers usually ask — purpose, line fit, strength, tying difficulty,
          field conditions, inspection, and when another knot makes more sense.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel className="p-5">
          <MicroLabel>Name & job</MicroLabel>
          <p className="mt-3 text-[0.9375rem] font-semibold">{knot.name}</p>
          <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted-foreground">
            {aliases.length ? `Also called: ${aliases.join(" · ")}` : "No additional common name is documented in this record."}
          </p>
          <div className="mt-3"><Bullets items={jobLabels.length ? jobLabels : [knot.goodFor]} /></div>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Line compatibility</MicroLabel>
          <p className="mt-3 text-[0.875rem] leading-relaxed">{materials.join(" · ")}</p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Compatibility is material-specific. A knot that behaves well on mono can slip, bind, or need a different wrap count on braid or stiff fluorocarbon.
          </p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Strength</MicroLabel>
          <p className="mt-3 text-[0.875rem] leading-relaxed">{strength}</p>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
            Treat any percentage as an observed range, not a guarantee for every line and tie.
          </p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Learning & speed</MicroLabel>
          <p className="mt-3 text-[0.875rem] leading-relaxed">
            {DIFFICULTY_LABELS[knot.difficulty]} · {knot.steps.length} steps · {speed.toLowerCase()} for reties.
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">{beginner}</p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Wrap count</MicroLabel>
          <p className="mt-3 text-[0.8125rem] leading-relaxed">{wrapGuidance(knot)}</p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Wet it?</MicroLabel>
          <p className="mt-3 text-[0.8125rem] leading-relaxed">{lubricationGuidance(knot)}</p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Poor conditions</MicroLabel>
          <ul className="mt-3 space-y-2 text-[0.8125rem] leading-relaxed">
            <li><span className="font-medium">Cold / wet hands:</span> {cold}</li>
            <li><span className="font-medium">Wind:</span> {wind}</li>
            <li><span className="font-medium">Low light:</span> {lowLight}</li>
          </ul>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Guide passage & profile</MicroLabel>
          <p className="mt-3 text-[0.8125rem] leading-relaxed">
            Guide passage: <span className="font-medium">{knot.contract.guidePassage}</span>. Finished shape: {knot.contract.finishedGeometry.replace("-", " ")}.
          </p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
            Leader knots that repeatedly travel through guides should be judged for profile and durability, not strength alone.
          </p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Lure / fly action</MicroLabel>
          <p className="mt-3 text-[0.8125rem] leading-relaxed">{actionGuidance(knot)}</p>
        </Panel>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Panel className="p-5">
          <MicroLabel>When this knot shines</MicroLabel>
          <div className="mt-3"><Bullets items={unique([knot.goodFor, ...knot.fieldFit.strengths])} /></div>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Choose another knot when</MicroLabel>
          <div className="mt-3"><Bullets items={unique([...knot.notIdealFor, ...knot.fieldFit.weaknesses])} marker="×" /></div>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>How to test it</MicroLabel>
          <div className="mt-3"><Bullets items={testGuidance(knot)} /></div>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Reliability over time</MicroLabel>
          <div className="mt-3"><Bullets items={reliabilityGuidance(knot)} /></div>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Tag end</MicroLabel>
          <p className="mt-3 text-[0.8125rem] leading-relaxed">{tagGuidance(knot)}</p>
          {knot.toolsHelpful?.length ? (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Helpful tools: {knot.toolsHelpful.join(" · ")}
            </p>
          ) : null}
        </Panel>

        <Panel className="p-5">
          <MicroLabel>What experienced anglers notice</MicroLabel>
          <div className="mt-3"><Bullets items={unique([
            knot.contract.seatingRequirements,
            `A good finished knot should show ${knot.fingerprint.expectedCrossoverBehavior.toLowerCase()}.`,
            `The tag should ${knot.fingerprint.expectedTagOrientation.toLowerCase()}.`,
          ])} /></div>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Species</MicroLabel>
          <p className="mt-3 text-[0.8125rem] leading-relaxed">
            Pick this knot for the connection, line, hardware, and load — not because a species name is printed on it. Species matters when it changes abrasion, teeth, leader material, hook style, or lure action.
          </p>
        </Panel>

        <Panel className="p-5">
          <MicroLabel>Compare alternatives</MicroLabel>
          {related.length ? (
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {related.map((item) => (
                <li key={item.id}>
                  <Link
                    to="/diagram/$knotId"
                    params={{ knotId: item.id }}
                    className="text-[0.8125rem] text-accent underline underline-offset-4"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted-foreground">
              No close alternative is documented for this record yet.
            </p>
          )}
        </Panel>
      </div>
    </section>
  );
}
