// 4W-Gewichtung (experimentell, nur Prosa): pro Dimension zusätzliche Sätze
// in den Text einweben. Reines Hochregeln (0 = neutral, keine Änderung).
import type { StoryKit } from "../types";
import { pick, ensurePunct, clean, splitSentences } from "../text-utils";
import { chooseInsertPos, cap, frameTurn, reframeStake } from "./beats";

export interface Emphasis { wo: number; wann: number; wer: number; was: number; }

const strip = (s: string): string => clean(s).replace(/[.!?…]+$/, "");

const PLACE_DETAIL = ["liegt die Luft schwer", "verschieben sich die Schatten", "hat jedes Ding zwei Gesichter", "klingt jeder Schritt doppelt", "scheint die Entfernung zu lügen", "hält der Raum den Atem an"];
const PLACE_VERB = ["scheint zuzuhören", "gibt keine Auskunft", "merkt sich jede Bewegung", "ordnet die Dinge neu", "lässt niemanden unberührt"];
function placeLine(kit: StoryKit): string {
  const M = kit.mode;
  // Orts-Varianten mit dem eingetragenen Wo doppelt gewichtet — der Ort soll
  // bei hoher Stärke tatsächlich auftauchen, nicht nur generisches Modus-Material.
  const withW = [
    `Hier, ${kit.W}, ${pick(PLACE_DETAIL)}.`,
    `${cap(kit.W)} ${pick(PLACE_DETAIL)}.`,
    `Der Ort — ${kit.W} — ${pick(PLACE_VERB)}.`,
  ];
  return pick([
    ...withW, ...withW,
    `Es riecht ${pick(M.images)}.`,
    ensurePunct(cap(pick(M.rules))),
    `Der Ort ${pick(PLACE_VERB)}.`,
  ]);
}

const TIME_DETAIL = ["zählte jede Stunde anders", "war die Zukunft schon vergangen", "maß man die Tage in Verlusten", "liefen die Uhren gegeneinander", "wog ein Augenblick mehr als ein Jahr"];
const TIME_CLAUSE = ["die Uhren einander misstrauten", "niemand mehr auf das Morgen wartete", "die Vergangenheit noch nicht entschieden war", "jeder Tag sich selbst wiederholte"];
const TIME_VERB = ["stand still", "lief rückwärts", "verlor ihren Takt", "wurde zäh"];
function timeLine(kit: StoryKit): string {
  // „Damals" nur bei nicht-gegenwärtigen Zeitangaben — „Damals, heute …" wäre ein Widerspruch.
  const presentish = /^(heute|jetzt|nun|gerade|eben|soeben|morgen|übermorgen)\b/i.test(kit.T);
  const withT = [
    presentish ? `${cap(kit.T)}, ${pick(TIME_DETAIL)}.` : `Damals, ${kit.T}, ${pick(TIME_DETAIL)}.`,
    `${cap(kit.T)} — und die Zeit ${pick(TIME_VERB)}.`,
  ];
  return pick([
    ...withT, ...withT,
    `Es war die Zeit, als ${pick(TIME_CLAUSE)}.`,
  ]);
}

// Wer: "Adverb + konjugierbares Verb + P" - P behält seine Schreibweise, damit
// applyPerspective (ich/du/wir) das Verb korrekt umformt.
function charLine(kit: StoryKit): string {
  const P = kit.P;
  return pick([
    `Da hält ${P} inne.`,
    `Kurz sucht ${P} nach Worten.`,
    `Dann spürt ${P} die Kälte.`,
    `Reglos steht ${P} da.`,
    `Lange wartet ${P}.`,
    `Still bleibt ${P} stehen.`,
    `Aufmerksam beobachtet ${P} den Raum.`,
  ]);
}

function plotLine(kit: StoryKit): string {
  // Die eingetragene Handlung („Was passiert?") steht im Zentrum — grammatisch
  // je nach Analyse (Satz / Verb-geführt / Vorhaben) eingewoben; Bank-Material ergänzt.
  const A = strip(kit.Apure);
  const actionLines = A
    ? (kit.AisClause
      ? [`Und wieder: ${A}.`, `Denn genau das geschieht: ${A}.`, `Im Kern bleibt es dabei — ${A}.`]
      : kit.AisInfinitiveLed
        ? [`Noch immer will ${kit.P} ${A}.`, `Alles drängt darauf, ${A}.`]
        : [`${kit.P} ${kit.AleadVerb || "will"} ${A} — noch immer.`, `Es geht weiter um eines: ${A}.`])
    : [];
  return pick([
    ...actionLines, ...actionLines, // Handlung doppelt gewichtet gegenüber Bank-Material
    frameTurn(kit.turn),
    reframeStake(kit.stake),
    `Doch ${strip(kit.obstacle)}.`,
    `Dann ${pick(["kippt es erneut", "verschärft sich alles", "bricht die Ordnung"])}: ${strip(kit.turn)}.`,
  ]);
}

export function applyEmphasis(text: string, kit: StoryKit, w: Emphasis): string {
  const gens: [number, () => string][] = [
    [w.wo, () => placeLine(kit)], [w.wann, () => timeLine(kit)],
    [w.wer, () => charLine(kit)], [w.was, () => plotLine(kit)],
  ];
  const lines: string[] = [];
  for (const [n, gen] of gens) {
    const count = Math.max(0, Math.min(3, n | 0));
    for (let i = 0; i < count; i++) lines.push(ensurePunct(clean(gen())));
  }
  const uniq = [...new Set(lines)].filter(Boolean);
  if (!uniq.length) return text;
  const sents = splitSentences(text);
  for (const line of uniq) {
    let pos = chooseInsertPos(sents);
    if (pos < 0) pos = sents.length;
    sents.splice(pos, 0, line);
  }
  return sents.join(" ");
}
