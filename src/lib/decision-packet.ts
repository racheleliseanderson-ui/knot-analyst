/**
 * Client-side "Decision Packet" PDF, in two tiers.
 *
 *   brief — one sheet: the call, the conditions, the compromises, the fallback.
 *   field — the brief plus the surviving options, mechanical readout,
 *           counterfactuals, eliminations and the full tying procedure.
 *
 * Presentation only — it renders an existing ChooseResult, it never re-scores.
 */
import type { ChooseResult } from "@/domain/types";
import { DIMENSION_LABELS } from "@/domain/types";
import type { Counterfactual, DecisionCard, Tradeoff } from "@/engine/advisor";
import { getKnot } from "@/data/catalog";
import { failsWhenFor } from "@/data/connection-model-meta";
import { diagramStepNote } from "@/components/instrument/diagram";

export type PacketVariant = "brief" | "field";

export const PACKET_LABELS: Record<PacketVariant, string> = {
  brief: "Decision brief",
  field: "Field packet",
};

export const PACKET_NOTES: Record<PacketVariant, string> = {
  brief: "One sheet. The call, the conditions, the named compromises, the fallback.",
  field: "Everything in the brief, plus the other knots, why they lost, and how to tie the one that won.",
};

const INK = { r: 17, g: 28, b: 36 };
const MUTED = { r: 104, g: 118, b: 128 };
const BRASS = { r: 168, g: 118, b: 40 };

export interface PacketInput {
  result: ChooseResult;
  card: DecisionCard;
  tradeoffs: Tradeoff[];
  counterfactuals: Counterfactual[];
  /** Defaults to the full field packet. */
  variant?: PacketVariant;
}

export async function generateDecisionPacket({
  result,
  card,
  tradeoffs,
  counterfactuals,
  variant = "field",
}: PacketInput): Promise<void> {
  const full = variant === "field";
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });

  const M = 54;
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const CW = W - M * 2;
  let y = M;

  const ensure = (need: number) => {
    if (y + need > H - M) {
      doc.addPage();
      y = M;
    }
  };
  const ink = (c: typeof INK) => doc.setTextColor(c.r, c.g, c.b);

  // Helvetica in jsPDF is WinAnsi-only: anything outside it renders as garbage glyphs.
  const ascii = (t: string) =>
    t
      .replace(/\u2192/g, "->")
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"')
      // em/en dash and middot render fine in jsPDF's WinAnsi encoding — keep them.
      .replace(/[^\u0000-\u00FF\u2013\u2014]/g, "-");

  const micro = (text: string, color = MUTED) => {
    ensure(18);
    doc.setFont("helvetica", "bold").setFontSize(7.5);
    ink(color);
    doc.text(ascii(text).toUpperCase(), M, y, { charSpace: 1.4 });
    y += 14;
  };
  const body = (text: string, size = 9.5, color = INK, indent = 0) => {
    doc.setFont("helvetica", "normal").setFontSize(size);
    ink(color);
    const lines = doc.splitTextToSize(ascii(text), CW - indent) as string[];
    for (const line of lines) {
      ensure(size + 4);
      doc.text(line, M + indent, y);
      y += size + 3.5;
    }
  };
  const rule = (weight = 0.6, color = { r: 216, g: 220, b: 224 }) => {
    ensure(10);
    doc.setDrawColor(color.r, color.g, color.b).setLineWidth(weight);
    doc.line(M, y, W - M, y);
    y += 12;
  };
  const bullets = (items: string[], marker = "—") => {
    for (const it of items) {
      doc.setFont("helvetica", "normal").setFontSize(9.5);
      ink(MUTED);
      ensure(14);
      doc.text(ascii(marker), M, y);
      ink(INK);
      const lines = doc.splitTextToSize(ascii(it), CW - 16) as string[];
      for (const line of lines) {
        ensure(13);
        doc.text(line, M + 16, y);
        y += 13;
      }
      y += 3;
    }
  };

  // ── Masthead ────────────────────────────────────────────────
  doc.setFillColor(17, 28, 36).rect(0, 0, W, 96, "F");
  doc.setFont("helvetica", "bold").setFontSize(8);
  doc.setTextColor(224, 168, 78);
  doc.text(
    `KNOT ANALYST · ${full ? "FIELD PACKET" : "DECISION BRIEF"}`,
    M,
    40,
    { charSpace: 1.8 },
  );
  doc.setFontSize(19).setTextColor(246, 249, 250);
  doc.text(ascii(card.knotName ?? "No valid connection"), M, 66);
  doc.setFont("helvetica", "normal").setFontSize(8).setTextColor(150, 166, 176);
  doc.text(ascii(`${card.jobLine} · ${card.systemLine}`), M, 82);
  if (card.fieldFit !== undefined) {
    doc.setFont("helvetica", "bold").setFontSize(26).setTextColor(224, 168, 78);
    doc.text(`${card.fieldFit}%`, W - M, 68, { align: "right" });
    doc.setFont("helvetica", "normal").setFontSize(7).setTextColor(150, 166, 176);
    doc.text("FIELD FIT", W - M, 82, { align: "right", charSpace: 1.4 });
  }
  y = 96 + 26;

  // ── Verdict strip ───────────────────────────────────────────
  const verdict =
    card.status === "no-valid-option"
      ? "FAIL CLOSED — no candidate survived the hard constraints"
      : card.status === "constrained"
        ? "CONSTRAINED FIT — usable, with named compromises"
        : "RECOMMENDED — clean fit for the stated job";
  doc.setFillColor(244, 246, 247).rect(M, y - 12, CW, 26, "F");
  doc.setFont("helvetica", "bold").setFontSize(8.5);
  ink(BRASS);
  doc.text(ascii(verdict), M + 10, y + 4, { charSpace: 0.6 });
  y += 34;

  micro("Conditions declared");
  body(card.conditionLine);
  y += 6;
  micro(`Confidence ${card.confidence} · ${card.eliminatedCount} eliminated on hard constraints`);
  rule();

  if (card.reasons.length) {
    micro("Why this one");
    bullets(card.reasons);
    y += 4;
  }
  if (card.retieNotes.length) {
    micro("Retie notes");
    bullets(card.retieNotes, "→");
    y += 4;
  }
  if (card.watchFor.length) {
    micro("Watch for");
    bullets(card.watchFor, "!");
    y += 4;
  }
  if (card.runnerUp) {
    micro("Fallback");
    body(`${card.runnerUp.name} — ${card.runnerUp.fieldFit}% field fit`, 10);
    body(card.runnerUp.when, 9.5, MUTED);
    y += 6;
  }

  // ── Surviving options ───────────────────────────────────────
  const ranked = result.ranked.slice(0, 5);
  if (full && ranked.length > 1) {
    rule();
    micro("Surviving options");
    for (const [idx, o] of ranked.entries()) {
      ensure(34);
      doc.setFont("helvetica", "bold").setFontSize(9.5);
      ink(INK);
      doc.text(ascii(`${String(idx + 1).padStart(2, "0")}  ${o.knot.name}`), M, y);
      doc.setFont("helvetica", "normal");
      ink(MUTED);
      doc.text(`${o.fieldFitPercent}%`, W - M, y, { align: "right" });
      y += 7;
      doc.setFillColor(228, 232, 235).rect(M, y, CW, 3.5, "F");
      doc.setFillColor(BRASS.r, BRASS.g, BRASS.b).rect(M, y, (CW * o.fieldFitPercent) / 100, 3.5, "F");
      y += 12;
      const note = idx === 0 ? (o.vsNext ?? o.whyBest[0]) : (o.whyBest[0] ?? o.butNotes[0]);
      if (note) body(note, 8.5, MUTED);
      y += 6;
    }
  }

  // ── Dimension readout ───────────────────────────────────────
  const top = ranked[0];
  if (full && top) {
    rule();
    ensure(70); // keep the readout header with its first rows
    micro("Mechanical readout — " + top.knot.name);
    const dims = top.dimensionScores.slice().sort((a, b) => b.weight * b.score - a.weight * a.score);
    const colW = CW / 2;
    for (let i = 0; i < dims.length; i += 2) {
      ensure(24);
      for (let c = 0; c < 2; c++) {
        const d = dims[i + c];
        if (!d) continue;
        const x = M + c * colW;
        doc.setFont("helvetica", "normal").setFontSize(8);
        ink(MUTED);
        doc.text(
          ascii(DIMENSION_LABELS[d.dimension as keyof typeof DIMENSION_LABELS] ?? d.dimension),
          x,
          y,
        );
        ink(INK);
        doc.text(String(d.score), x + colW - 26, y, { align: "right" });
        doc.setFillColor(228, 232, 235).rect(x, y + 3.5, colW - 22, 2.6, "F");
        doc.setFillColor(60, 106, 122).rect(x, y + 3.5, ((colW - 22) * d.score) / 100, 2.6, "F");
      }
      y += 20;
    }
  }

  // ── Trade-offs ──────────────────────────────────────────────
  if (tradeoffs.length) {
    rule();
    micro("Conflicting constraints");
    for (const t of tradeoffs) {
      ensure(30);
      doc.setFont("helvetica", "bold").setFontSize(9.5);
      ink(INK);
      doc.text(t.axis, M, y);
      y += 13;
      body(t.tension, 9, MUTED);
      body(t.detail, 9);
      if (t.alternative) body(`Trade down to ${t.alternative.name} — ${t.alternative.gain}`, 8.5, BRASS);
      y += 8;
    }
  }

  // ── Counterfactuals ─────────────────────────────────────────
  if (full && counterfactuals.length) {
    rule();
    micro("What would change this");
    for (const c of counterfactuals) {
      ensure(24);
      doc.setFont("helvetica", "bold").setFontSize(9);
      ink(INK);
      const q = doc.splitTextToSize(c.question, CW) as string[];
      for (const line of q) {
        ensure(12);
        doc.text(line, M, y);
        y += 12;
      }
      body(c.answer, 9, c.verdict === "holds" ? MUTED : BRASS, 12);
      y += 6;
    }
  }

  // ── Eliminated ──────────────────────────────────────────────
  if (full && result.eliminated.length) {
    rule();
    micro(`Eliminated on hard constraints — ${result.eliminated.length}`);
    bullets(
      result.eliminated.slice(0, 12).map((e) => `${e.knotName} — ${e.reasons[0] ?? "hard constraint"}`),
      "×",
    );
  }

  // ── Tying procedure (field packet only) ─────────────────────
  const knot = full && top ? getKnot(top.knot.id) : undefined;
  if (knot) {
    doc.addPage();
    y = M;
    micro("Tying procedure", BRASS);
    doc.setFont("helvetica", "bold").setFontSize(15);
    ink(INK);
    doc.text(ascii(knot.name), M, y);
    y += 18;
    body(knot.howToSummary, 9.5, MUTED);
    y += 4;
    body(diagramStepNote(knot.diagramKind), 8.5, MUTED);
    y += 8;

    if (knot.beforeYouStart?.length) {
      micro("Before you start");
      bullets(knot.beforeYouStart);
      y += 4;
    }

    rule();
    for (const s of knot.steps) {
      ensure(46);
      doc.setFont("helvetica", "bold").setFontSize(9);
      ink(BRASS);
      doc.text(String(s.order).padStart(2, "0"), M, y);
      ink(INK);
      const head = doc.splitTextToSize(ascii(s.instruction), CW - 24) as string[];
      for (const line of head) {
        ensure(13);
        doc.text(line, M + 24, y);
        y += 13;
      }
      y += 2;
      body(diagramStepNote(knot.diagramKind, s.order), 8.5, MUTED, 24);
      if (s.detail) body(s.detail, 8.5, MUTED, 24);
      const cues: [string, string | undefined][] = [
        ["Look for", s.look ?? s.expectedResult],
        ["Fails as", s.failureMode ?? s.commonError],
        ["Quick fix", s.quickFix ?? s.tip],
      ];
      for (const [k, v] of cues) {
        if (!v) continue;
        ensure(13);
        doc.setFont("helvetica", "bold").setFontSize(7.5);
        ink(MUTED);
        doc.text(ascii(k).toUpperCase(), M + 24, y, { charSpace: 1.1 });
        doc.setFont("helvetica", "normal").setFontSize(8.5);
        ink(INK);
        const lines = doc.splitTextToSize(ascii(v), CW - 92) as string[];
        for (const [i, line] of lines.entries()) {
          ensure(12);
          doc.text(line, M + 92, y);
          y += 11.5;
          if (i < lines.length - 1) ensure(12);
        }
        y += 2;
      }
      y += 8;
    }

    if (knot.seatingSequence?.length) {
      rule();
      micro("Seating sequence — where failures are born");
      for (const p of knot.seatingSequence) {
        ensure(26);
        doc.setFont("helvetica", "bold").setFontSize(9);
        ink(INK);
        doc.text(ascii(p.phase), M, y);
        doc.setFont("helvetica", "normal").setFontSize(7.5);
        ink(MUTED);
        doc.text(ascii(p.tension).toUpperCase(), W - M, y, { align: "right", charSpace: 1.1 });
        y += 12;
        body(p.action, 8.5, MUTED);
        y += 5;
      }
    }

    const failModes = failsWhenFor(knot.id, knot.commonMistakes);
    if (failModes.length) {
      rule();
      micro("Fails when");
      bullets(failModes.slice(0, 8), "!");
    }
    if (knot.fieldNotes?.length) {
      rule();
      micro("Cold, dark, wet");
      bullets(knot.fieldNotes, "—");
    }

    rule();
    micro("Verify before you fish");
    bullets(
      [
        "Wraps lie in one direction with no crossovers.",
        "Tag exits where the fingerprint says it should.",
        "Structure seated wet, under steady load — not jerked.",
        "Tag trimmed close, no nick in the standing line.",
      ],
      "[ ]",
    );
  }

  // ── Footer on every page ────────────────────────────────────
  const pages = doc.getNumberOfPages();
  for (let p = 1; p <= pages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal").setFontSize(7);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(
      `${result.applicationId} · engine ${result.engineVersion} · catalog ${result.catalogVersion} · ${new Date(result.generatedAt).toLocaleString()}`,
      M,
      H - 26,
    );
    doc.text(`${p} / ${pages}`, W - M, H - 26, { align: "right" });
  }

  const slug = (card.knotName ?? "no-valid-option").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  doc.save(`knot-${full ? "field-packet" : "decision-brief"}-${slug}.pdf`);
}
