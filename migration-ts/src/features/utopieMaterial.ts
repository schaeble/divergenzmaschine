// Preset-Material für die Utopie (4.374.0).
//
// Bis 4.373.0 las die Utopie nur aus ihrem Weltblatt; das angekreuzte Preset
// bewegte nichts — ein Regler, der nichts tut. Jetzt liefert das Preset das
// MATERIAL der Welt, das Weltblatt behält die FAKTEN: Grundsatz, Rat, Zahlen,
// Kehrseite bleiben unberührt, damit die Welt in sich stimmt.
//
// Vier Rahmen, und jeder nimmt nur, was grammatisch hineinpasst:
//
//   Motiv        „Mitten auf dem Platz: {Motiv}." oder
//                „Am Rand des Platzes: {Motiv}."            Nominativ nach
//                Doppelpunkt — keine Deklination nötig.
//   Wendung      „Eine Geschichte, die man in N gern erzählt: {Wendung}."
//                Die Wendungen sind Hauptsätze im Präsens.
//   Verwandlung  „In N sagt man nicht „A“, sondern „B“."
//   Requisit     „In jedem Haus in N liegt {Requisit}."      Nominativ; ein
//                Akkusativ („einen alten Ring") wird zurückgeführt.
//
// Was nicht passt, fällt heraus: ganze Sätze mit Schlusspunkt, Anrede und Ich
// („während du wartest"), Zahlen (das Weltblatt zählt allein), und Wörter,
// die einer anderen Lage gehören — Rimbauds Gischt hat in der Wüste nichts
// zu suchen.
import type { Bank } from "../types";
import { LAGEN, type LageTyp } from "./weltblatt";

/** Zahlwörter und Ziffern. Wortgrenzen über Buchstaben, nicht über \b: Für \b
 *  ist „ß" kein Wortzeichen, und „Dreißig" wurde als „drei" gelesen. Längere
 *  Wörter vorn, damit „zweihundert" nicht als „zwei" endet. „null" zählt mit:
 *  „ein Regenmesser mit null" (Klimakrise) ist eine Zahl, kein Leerwert. */
export const ZAHLWORT = /(?<![\p{L}\d])(null|einundzwanzig|zweihundert|dreizehn|vierzehn|fünfzehn|sechzehn|siebzehn|achtzehn|neunzehn|dreißig|vierzig|fünfzig|sechzig|zwanzig|hundert|tausend|zwölf|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|elf|\d+)(?![\p{L}\d])/giu;
const HAT_ZAHL = new RegExp(ZAHLWORT.source, "iu");

const wort = (w: string): RegExp => new RegExp(`(?<!\\p{L})(${w})`, "iu");
// Vorsilben, deshalb mit Ausnahmen: „see" nicht in „Seele", „eis" nicht in
// „Eisen", „deck" nicht in „Decke". „Ruder" fehlte zuerst — ein rostiges
// Ruder lag in jedem Haus einer Wüstenstadt (gefunden beim Lesen, 4.374.0).
const MEER = wort("meer|see(?!l)|welle|gischt|brandung|hafen|schiff|boot|kiel|mast|takelage|treidler|anker|strand|küste|riff|ozean|bucht|netz|steg|insel|ruder|segel|möwe|flut|ebbe|leuchtturm|muschel|fisch|reling|deck(?!e)|matrose|kapitän|seemann|ufer|kahn|fähre|floß");
const SCHNEE = wort("schnee|eis(?!en)|vereist|eisig|frost|gletscher|lawine|schlitten");
const SAND = wort("wüste|sand|düne|oase|kamel");
const WALD = wort("wald|lichtung|urwald|dschungel");

/** Wörter, die in einer Lage fremd sind. Dazu kommen immer die Marken der
 *  anderen Lagen — dieselben, die `pruefeUtopie()` sucht. */
const FREMD_GRUPPEN: Record<LageTyp, RegExp[]> = {
  wueste: [MEER, SCHNEE, WALD],
  eis: [SAND, WALD],
  insel: [SAND, WALD],
  gebirge: [MEER, SAND],
  wald: [MEER, SAND],
  tal: [SAND, SCHNEE],
  stadt: [SAND],
  ort: [],
};

export function fremdInLage(s: string, lage: LageTyp): boolean {
  if (FREMD_GRUPPEN[lage].some((r) => r.test(s))) return true;
  for (const [t, d] of Object.entries(LAGEN) as [LageTyp, typeof LAGEN[LageTyp]][]) {
    if (t !== lage && d.marken && d.marken.test(s)) return true;
  }
  return false;
}

// „ihm", „ihn", „ihnen", „er" zeigen auf jemanden außerhalb des Eintrags:
// „Ein Fremder nennt ihm den Namen des Schlosses" — wem? (gefunden beim Lesen,
// 4.376.0). Im Rahmen gibt es niemanden, auf den sie sich beziehen könnten.
const PERSON = wort("ich|du|dich|dir|mich|mir|wir|uns|euch|ihr|dein\\w*|mein\\w*|unser\\w*|euer\\w*|ihm|ihn|ihnen|er(?!\\p{L})");

/** Gemeinsame Tauglichkeit: kein Satzschluss, keine Anführung, keine Person,
 *  keine Zahl, nicht zu lang. */
function taugtGrund(s: string, maxWorte: number): boolean {
  const t = s.trim();
  if (!t || /[.!?…;:]$/.test(t) || /[„“"«»]/.test(t)) return false;
  if (PERSON.test(t) || HAT_ZAHL.test(t)) return false;
  return t.split(/\s+/).length <= maxWorte;
}

/** Motiv nach dem Doppelpunkt: eine Nominalphrase, klein begonnen. */
export function taugtMotiv(s: string): boolean {
  if (!taugtGrund(s, 14)) return false;
  // Ein Hauptsatz („Die Nacht schlug …") sähe hinter dem Doppelpunkt wie eine
  // Behauptung aus; Nominalphrasen beginnen mit Artikel oder Nomen.
  return /^(ein|eine|einen|der|die|das|kein|keine)\s/i.test(s.trim()) || /^[A-ZÄÖÜ][a-zäöüß]+(\s|$)/.test(s.trim());
}

/** Requisit im Nominativ — Akkusativ zurückgeführt, sonst null.
 *  Nur unbestimmter Artikel: „die Schlüssel" kann Plural sein, dann passte
 *  „liegt" nicht. */
export function requisitNominativ(s: string): string | null {
  const t = s.trim();
  if (!taugtGrund(t, 10)) return null;
  const m = t.match(/^(ein|eine|einen)\s+(.*)$/i);
  if (!m) return null;
  const art = m[1]!.toLowerCase(), rest = m[2]!;
  if (art !== "einen") {
    // „ein alter Siegelring" ist schon Nominativ; „ein Boot" auch. Unklar
    // bleibt nur „ein" + Nomen männlich — als Nominativ ist das richtig.
    return `${art} ${rest}`;
  }
  // „einen alten Siegelring" → „ein alter Siegelring": Die kleingeschriebenen
  // Wörter VOR dem ersten Nomen sind Adjektive und tragen -en → -er.
  const worte = rest.split(" ");
  const i = worte.findIndex((w) => /^[A-ZÄÖÜ]/.test(w));
  if (i < 0) return null;
  // Schwach gebeugte Nomen tragen im Akkusativ -en/-n: „einen Seismographen"
  // wurde zu „ein Seismographen" (gefunden in der Stichprobe, 4.374.0). Ohne
  // Lexikon nicht rückführbar — solche Einträge fallen heraus, auch wenn das
  // „einen Garten" mitnimmt.
  if (/(en|rn)$/.test(worte[i]!.replace(/[,;]$/, ""))) return null;
  for (let k = 0; k < i; k++) {
    if (!/en$/.test(worte[k]!)) return null;
    worte[k] = worte[k]!.replace(/en$/, "er");
  }
  return `ein ${worte.join(" ")}`;
}

/** Wendung als eigener Hauptsatz: Verb an zweiter Stelle lässt sich ohne
 *  Lexikon nicht sicher prüfen; verlangt wird ein Artikel vorn und keine
 *  Konjunktion, die einen Nebensatz einleitet. */
export function taugtWendung(s: string): boolean {
  if (!taugtGrund(s, 14)) return false;
  const t = s.trim();
  return /^(ein|eine|der|die|das|man|jemand|niemand|alle|keiner|keine)\s/i.test(t) && !/^(dass|weil|wenn|ob|als)\s/i.test(t);
}

/** Verwandlung „A→B": zwei einzelne Nomen. */
export function verwandlungPaar(s: string): [string, string] | null {
  const m = (s || "").trim().match(/^([A-ZÄÖÜ][a-zäöüß]+)\s*→\s*([A-ZÄÖÜ][a-zäöüß]+)$/);
  return m ? [m[1]!, m[2]!] : null;
}

export interface UtopieMaterial {
  motive: string[];
  wendungen: string[];
  verwandlungen: [string, string][];
  requisiten: string[];
}

const kleinVorn = (s: string): string => s.trim().replace(/^(Ein|Eine|Einen|Der|Die|Das|Kein|Keine)\b/, (m) => m.toLowerCase());

/** Was aus einer Wortbank in die vier Rahmen passt — für eine Lage, oder ohne
 *  Lage (`null`) für die Anzeige im Studio. */
export function utopieMaterial(bank: Partial<Bank> | undefined, lage: LageTyp | null): UtopieMaterial {
  const b = bank || {};
  const ok = (s: string): boolean => !lage || !fremdInLage(s, lage);
  const einmal = <T,>(l: T[], k: (x: T) => string): T[] => { const g = new Set<string>(); return l.filter((x) => { const s = k(x); if (g.has(s)) return false; g.add(s); return true; }); };
  return {
    motive: einmal((b.motifs || []).filter((s) => taugtMotiv(s) && ok(s)).map(kleinVorn), (x) => x),
    wendungen: einmal((b.turns || []).filter((s) => taugtWendung(s) && ok(s)).map((s) => s.trim()), (x) => x),
    verwandlungen: einmal((b.verwandlungen || []).map(verwandlungPaar).filter((p): p is [string, string] => !!p && ok(p.join(" "))), (p) => p.join("→")),
    requisiten: einmal((b.props || []).map(requisitNominativ).filter((s): s is string => !!s && ok(s)), (x) => x),
  };
}
