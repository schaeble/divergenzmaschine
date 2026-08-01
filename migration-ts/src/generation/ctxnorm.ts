// 4W-Normalisierung: bringt frei getippte Wo/Wann/Wer-Angaben in die Form, die
// die Satzschablonen erwarten (Ortsangabe mit Präposition, Zeitangabe, Nominativ-
// Phrase). Konservativ: greift nur ein, wenn die Form sicher bestimmbar ist.
import { guessGender } from "./declension";

const PREPS = /^(in|im|an|am|auf|bei|beim|unter|über|vor|hinter|neben|zwischen|durch|entlang|inmitten|nahe|außerhalb|innerhalb|jenseits|diesseits|um|ums|zu|zur|zum|während|seit|nach|gegen|ab|aus|von|vom|unterwegs|irgendwo|nirgendwo|überall|dort|draußen|drinnen|hier|daheim|zuhause|unten|oben)\b/i;
const cap = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const low = (s: string): string => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Zerlegt eine einfache Phrase in [Artikel?, Adjektiv?, Nomen] — sonst null. */
function parseNP(s: string): { art: string; adj: string; noun: string } | null {
  const m = s.trim().match(/^(?:(der|die|das|ein|eine|einen|einem|einer)\s+)?(?:([a-zäöüß][a-zäöüß-]*)\s+)?([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
  if (!m) return null;
  return { art: (m[1] || "").toLowerCase(), adj: m[2] || "", noun: m[3]! };
}
/** Genus: aus explizitem Artikel oder Lexikon/Heuristik. */
function genderOf(art: string, noun: string): "m" | "f" | "n" | undefined {
  if (art === "die" || art === "eine" || art === "einer") return "f";
  if (art === "das") return "n";
  if (art === "der" || art === "ein" || art === "einen" || art === "einem") { const g = guessGender(noun); return g || (art === "der" ? "m" : undefined); }
  return guessGender(noun);
}
/** Adjektiv in die Dativ-Form nach Artikel bringen: „verlassener" → „verlassenen". */
const adjDat = (adj: string): string => (adj ? adj.replace(/(er|es|em|en|e)$/i, "") + "en" : "");

/** Orte, die „an/am" bzw. „auf" statt „in" verlangen. */
const AN_NOUNS = /^(meer|see|ozean|küste|strand|ufer|fluss|bach|rand|abgrund|fenster|tor|hafenbecken)$/i;
const AUF_NOUNS = /^(insel|wiese|weide|feld|berg|hügel|gipfel|dach|turm|platz|markt|straße|brücke|lichtung|bühne|terrasse|balkon)$/i;

/** Wo: „Hafen" → „im Hafen", „eine Insel" → „auf einer Insel". */
export function normWhere(s: string): string {
  const t = (s || "").trim();
  if (!t || PREPS.test(t) || t.includes(",")) return t;
  const np = parseNP(t);
  if (!np) return t;
  const g = genderOf(np.art, np.noun);
  if (!g) return t;
  const adj = np.adj ? adjDat(np.adj) + " " : "";
  const kind = AUF_NOUNS.test(np.noun) ? "auf" : AN_NOUNS.test(np.noun) ? "an" : "in";
  const indef = np.art.startsWith("ein");
  if (indef) {
    const artD = g === "f" ? "einer" : "einem";
    return `${kind} ${artD} ${adj}${np.noun}`;
  }
  if (kind === "in") return g === "f" ? `in der ${adj}${np.noun}` : `im ${adj}${np.noun}`;
  if (kind === "an") return g === "f" ? `an der ${adj}${np.noun}` : `am ${adj}${np.noun}`;
  return g === "f" ? `auf der ${adj}${np.noun}` : `auf dem ${adj}${np.noun}`;
}

const WEEKDAYS = /^(montag|dienstag|mittwoch|donnerstag|freitag|samstag|sonnabend|sonntag)$/i;
const MONTHS = /^(januar|februar|märz|april|mai|juni|juli|august|september|oktober|november|dezember)$/i;
const SEASONS = /^(frühling|frühjahr|sommer|herbst|winter)$/i;
const TIME_ADV = /^(heute|morgen|gestern|übermorgen|vorgestern|damals|jetzt|nun|bald|einst|früher|später|nachts|morgens|abends|mittags|vormittags|nachmittags|irgendwann|immer|nie|niemals|neulich|kürzlich|demnächst|gerade|soeben|zugleich|währenddessen|einmal)\b/i;
const AM_TIMES = /^(morgen|vormittag|mittag|nachmittag|abend|tag|anfang|ende|wochenende|feierabend)$/i;

/** Wann: „Winter" → „im Winter", „Dienstag" → „an einem Dienstag", „1984" → „im Jahr 1984". */
export function normWhen(s: string): string {
  const t = (s || "").trim();
  if (!t || PREPS.test(t) || TIME_ADV.test(t) || t.includes(",") || /\d+\s*uhr/i.test(t)) return t;
  if (/^\d{3,4}$/.test(t)) return `im Jahr ${t}`;
  const one = t.match(/^([A-ZÄÖÜa-zäöü][A-Za-zÄÖÜäöüß-]*)$/) ? t : null;
  if (!one) return t;
  const w = one;
  if (WEEKDAYS.test(w)) return `an einem ${cap(w)}`;
  if (MONTHS.test(w) || SEASONS.test(w)) return `im ${cap(w)}`;
  if (/^mitternacht$/i.test(w)) return "um Mitternacht";
  if (/^nacht$/i.test(w)) return "in der Nacht";
  if (/^dämmerung$/i.test(w)) return "in der Dämmerung";
  if (AM_TIMES.test(w)) return `am ${cap(w)}`;
  const g = guessGender(w);
  if (g === "f") return `in der ${cap(w)}`;
  if (g === "m" || g === "n") return `im ${cap(w)}`;
  return t;
}

/** Wer: Großschreibung je Person; artikellose Gattungs-Phrase mit Adjektiv bekommt „ein/eine". */
export function normWho(s: string): string {
  const t = (s || "").trim();
  if (!t) return t;
  const parts = t.split(",").map((p) => p.trim()).filter(Boolean);
  const fixed = parts.map((p) => {
    // „müde Wächterin" → „eine müde Wächterin" (nur wenn klein beginnend + Genus sicher)
    const m = p.match(/^([a-zäöüß][a-zäöüß-]*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
    if (m && !/^(der|die|das|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(m[1]!)) { const g = guessGender(m[2]!) || (/in$/.test(m[2]!.toLowerCase()) ? "f" : undefined); if (g === "f") return `eine ${m[1]} ${m[2]}`; if (g === "m" || g === "n") return `ein ${m[1]} ${m[2]}`; }
    return cap(p);
  });
  return fixed.join(", ");
}
export { low as lowerFirst };
