// Sprachschliff — mechanische Textpflege, die IMMER laeuft.
//
// Vorgeschichte: Die Datei war 1:1 aus dem Monolithen uebernommen und bestand
// zur Haelfte aus Einzelpflastern fuer Fehler, die es nicht mehr gibt
// ("ein mattes Atem" -> "ein matter Atem", "Ich nimmt" -> "Ich nehme",
// "will selig" -> "will selig werden"). In 306 gemessenen Texten hat keine
// dieser Regeln ein einziges Mal gegriffen. Was greift, war eine handgepflegte
// Tabelle von 130 Nomen mit ihrem Artikel - und die lag oft daneben:
//
//   "Fenster, die starren."              -> "das Fenster, die starren."
//   "Die Grenze zwischen Wald und Feld." -> "... zwischen Wald und das Feld."
//   "... versiegelt mit Wachs und Blut." -> "... mit Wachs und das Blut."
//
// Ursache: Der Ausloeser war "Satzanfang ODER und ODER doch ODER dann", und
// "und" fasst mitten im Satz jede Aufzaehlung an. Dazu kam eine
// Wortdopplungs-Bremse, die "in einen Fremden, der der Tod selbst sein koennte"
// zu "der Tod selbst" verkuerzte - das erste "der" war ein Relativpronomen.
//
// Geblieben ist, was in JEDEM Text richtig ist. Deshalb braucht es keinen
// Schalter mehr.
import { NOUN_GENDER } from "./nouns.data";
import { extractLeadVerb } from "./wordcls";

interface PolishOpts { who?: string; }

// Woerter, die doppelt nebeneinander stehen duerfen: Relativpronomen neben
// Artikel ("der der Tod"), Vergleiche ("so so"), Aufzaehlungen.
const DOPPELT_ERLAUBT = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines",
  "wie", "so", "als", "was", "wer", "wen", "wem", "dass", "da", "und", "nur", "noch", "sie", "ihr",
]);

/** Fehlt am Satzanfang der Artikel? Nur dann, wenn der Satz einer IST: Ein
 *  finites Verb im Hauptteil unterscheidet "Zeit wird zur Illusion" (Artikel
 *  fehlt) von "Atem im Nacken" (gewolltes Fragment). */
/** Wörter, die am Satzanfang groß stehen, ohne Nomen zu sein. Deutsche Nomen
 *  sind immer groß — an der Schreibung allein ist der Unterschied nicht zu sehen,
 *  deshalb diese geschlossene Liste. */
export const KEIN_NOMEN = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines",
  "kein", "keine", "mein", "dein", "sein", "ihr", "unser", "euer", "dieser", "diese", "dieses",
  "jeder", "jede", "jedes", "alle", "viele", "manche", "beide", "und", "aber", "doch", "denn",
  "dann", "dabei", "damit", "dort", "hier", "jetzt", "nur", "noch", "auch", "schon", "wenn",
  "weil", "dass", "als", "wie", "was", "wer", "wo", "warum", "ich", "du", "er", "sie", "es",
  "wir", "man", "jemand", "niemand", "nichts", "etwas", "alles", "im", "am", "auf", "in", "an",
  "mit", "ohne", "von", "vor", "nach", "bei", "zu", "über", "unter", "zwischen", "seit", "für",
  "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "hundert", "tausend",
]);

function ergaenzeArtikel(satz: string): string {
  const m = satz.match(/^([A-ZÄÖÜ][a-zäöüß]{2,})(\s+)(.+)$/);
  if (!m) return satz;
  const [, nomen, luecke, rest] = m as unknown as [string, string, string, string];
  // Nur ein Nomen kann einen Artikel brauchen. Ohne diese Pruefung wurde aus
  // "Der Einsatz ist Vertrauen" ein "Der der Einsatz ist Vertrauen": Am
  // Satzanfang ist auch der Artikel grossgeschrieben.
  if (KEIN_NOMEN.has(nomen.toLowerCase())) return satz;
  // Direkt hinter dem Nomen muss ein finites Verb stehen - dann fehlt wirklich
  // nur der Artikel. hatFinitesVerb war dafuer zu weich: Es hielt das Adjektiv
  // in "Nebel ueber schwarzen Daechern" fuer eine Verbform und machte aus einem
  // gewollten Fragment einen halben Satz. extractLeadVerb prueft dieselbe Frage
  // strenger und ist die Stelle, an der die Verberkennung ohnehin gepflegt wird.
  const kern = rest.split(",")[0]!;
  if (!extractLeadVerb(kern).verb) return satz;
  // Genus nur aus der Tabelle, nicht aus der Endungsheuristik: Die haelt
  // "Minimalismus" fuer ein Neutrum, weil NOUN_GENDER ein "Mus" kennt und die
  // Kompositum-Suche am Wortende ansetzt. Lieber seltener ergaenzen als falsch.
  const g = NOUN_GENDER[nomen.toLowerCase()];
  if (g !== "m" && g !== "f" && g !== "n") return satz;
  // Plural erkennt man an der Verbform: "Fenster starren" gegen "Zeit steht".
  if (/^(sind|waren|werden|haben|hatten|bleiben|stehen|liegen|kommen|gehen|zeigen|wirken)\b/i.test(rest)) return satz;
  const art = g === "f" ? "Die" : g === "n" ? "Das" : "Der";
  return `${art} ${nomen}${luecke}${rest}`;
}

export function polishGerman(text: string, opts: PolishOpts = {}): string {
  const { who = "" } = opts;
  let t = String(text ?? "");

  // 1. Abstaende und Zeichen
  t = t
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/ /g, " ")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+([,.;:!?])/g, "$1")
    .replace(/([,.;:!?])([A-Za-zÄÖÜäöü])/g, "$1 $2")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/,+/g, ",")
    .replace(/,\s*,/g, ", ")
    .replace(/:\s*:/g, ":")
    .replace(/([A-Za-zÄÖÜäöü0-9])\.\.(?=\s|$)/g, "$1…")
    .replace(/\.\.(?!\.)/g, ".")
    .trim();

  // 2. Schreibweise des Namens vereinheitlichen
  if (who.trim()) {
    const w = who.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try { t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${w}(?![\\p{L}\\p{N}_])`, "giu"), who.trim()); }
    catch { t = t.replace(new RegExp(`\\b${w}\\b`, "gi"), who.trim()); }
  }

  // 3. Wortdopplung, mit Ausnahmeliste
  for (let k = 0; k < 6; k++) {
    const next = t.replace(/\b([A-Za-zÄÖÜäöüß]{2,})\s+\1\b/gi,
      (m, w: string) => (DOPPELT_ERLAUBT.has(w.toLowerCase()) ? m : w));
    if (next === t) break;
    t = next;
  }

  // 4. Fehlender Artikel am Satzanfang
  t = t.split(/(?<=[.!?…])(\s+)/).map((teil) => (/^\s+$/.test(teil) ? teil : ergaenzeArtikel(teil))).join("");

  return t.trim();
}
