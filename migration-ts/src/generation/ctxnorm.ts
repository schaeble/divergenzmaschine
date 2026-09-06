// 4W-Normalisierung: bringt frei getippte Wo/Wann/Wer-Angaben in die Form, die
// die Satzschablonen erwarten (Ortsangabe mit Präposition, Zeitangabe, Nominativ-
// Phrase). Konservativ: greift nur ein, wenn die Form sicher bestimmbar ist.
import { guessGender } from "./declension";
import { NOUN_GENDER } from "./nouns.data";
import { NOUN_GENDER_2 } from "./nouns2.data";
import { istEigenePerson, PERSON_NOMEN } from "./wordcls";

const PREPS = /^(in|im|an|am|auf|bei|beim|unter|über|vor|hinter|neben|zwischen|durch|entlang|inmitten|nahe|außerhalb|innerhalb|jenseits|diesseits|um|ums|zu|zur|zum|während|seit|nach|gegen|ab|aus|von|vom|unterwegs|irgendwo|nirgendwo|überall|dort|draußen|drinnen|hier|daheim|zuhause|unten|oben)\b/i;
const cap = (s: string): string => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
const low = (s: string): string => (s ? s.charAt(0).toLowerCase() + s.slice(1) : s);

/** Zerlegt eine einfache Phrase in [Artikel?, Adjektiv?, Nomen] — sonst null. */
function parseNP(s: string): { art: string; adj: string; noun: string } | null {
  // Das Adjektiv darf großgeschrieben sein, wenn es am Anfang steht und ein
  // Nomen folgt — gemeldet: „Urbane Straße mit Graffiti-Wand" wurde zu „An
  // einem Urbane Straße". Es wird klein und dekliniert („an einer urbanen
  // Straße"). Nur Adjektiv-Endungen zählen (-e, -en, -er, -es), damit ein
  // Ortsname aus zwei Wörtern („Bad Aibling") kein Adjektiv bekommt.
  const m = s.trim().match(/^(?:(der|die|das|ein|eine|einen|einem|einer)\s+)?(?:([A-ZÄÖÜa-zäöüß][a-zäöüß-]*(?:e|en|er|es))\s+)?([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
  if (!m) return null;
  const adj = (m[2] || "");
  if (adj && /^[A-ZÄÖÜ]/.test(adj) && !/[a-zäöüß]$/.test(adj)) return null;
  return { art: (m[1] || "").toLowerCase(), adj: adj.toLowerCase(), noun: m[3]! };
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
// Zusammensetzungen, die auf ein Gewässer-/Uferwort enden, verlangen „an":
// „Kanalufer" → „am Kanalufer". Gemeldet: „ich liege Kanalufer, unter einer
// Fußgängerbrücke" — das Wo ohne Präposition, weil der Zusatz nach dem Komma
// die ganze Normalisierung abschaltete und das Grundwort nicht erkannt war.
// Gattungswörter auf -land, die keine Ortsnamen sind: „im Ausland", nicht „in Ausland".
const LAND_GATTUNG = new Set(["ausland", "inland", "umland", "hinterland", "festland", "neuland", "brachland", "flachland",
  "hochland", "weideland", "ackerland", "vaterland", "heimatland", "niemandsland", "grenzland", "marschland", "ödland",
  "bauland", "bergland", "tiefland", "binnenland", "vorland", "kernland", "mutterland", "traumland", "schlaraffenland"]);
const ORTSNAME_ENDUNG = /(grad|burg|furt|ingen|hausen|heim|kirchen|brück|wick|ford|ton|ville|polis|stan|land|ien)$/;
const AN_ENDUNG = /(ufer|meer|see|strand|küste|fluss|bach)$/i;

export function normWhere(s: string): string {
  const t = (s || "").trim();
  if (!t || PREPS.test(t)) return t;
  // Ein Zusatz nach dem Komma („Kanalufer, unter einer Fußgängerbrücke") wird
  // nicht angefasst — aber der Kopf davor wird normalisiert wie ohne Zusatz.
  const komma = t.indexOf(",");
  if (komma > 0) { const kopf = normWhere(t.slice(0, komma)); return kopf + t.slice(komma); }
  // „Platz in Hanoi" — ein Kopf mit eigener Ortsangabe dahinter: der Kopf
  // bekommt seine Präposition, der Zusatz bleibt („auf dem Platz in Hanoi").
  // Gemeldet: „Während des letzten Prozesses, Platz in Hanoi, Vietnam".
  const zusatz = t.match(/^(.+?)\s+((?:in|im|an|am|auf|bei|vor|hinter|neben|unter|über|zwischen|nahe|gegenüber|ohne|mit|voller|aus)\s+.+)$/);
  if (zusatz && parseNP(zusatz[1]!)) {
    const kopf = normWhere(zusatz[1]!);
    if (kopf !== zusatz[1]) return `${kopf} ${zusatz[2]}`;
  }
  const np = parseNP(t);
  if (!np) return t;
  // Ein Ortsname auf -grad, -burg, -furt, -ingen … ohne Artikel, der nicht
  // selbst in der Tabelle steht, ist ein Ortsname und kein Gattungswort:
  // „Leningrad" → „in Leningrad", nicht „im Leningrad" (das Genus käme aus
  // dem Grundwort „Grad"). „Hamburg", „Frankfurt", „Tübingen" ebenso.
  const nurWort = !np.art && !np.adj && /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(t);
  const inTabelle = !!(NOUN_GENDER[t.toLowerCase()] || NOUN_GENDER_2[t.toLowerCase()]);
  if (nurWort && !inTabelle && ORTSNAME_ENDUNG.test(t) && !LAND_GATTUNG.has(t.toLowerCase())) return `in ${t}`;
  const g = genderOf(np.art, np.noun);
  // Ein einzelnes großgeschriebenes Wort ohne Artikel und ohne bekanntes
  // Genus ist mit großer Wahrscheinlichkeit ein Ortsname: „Malvern" →
  // „in Malvern". Gemeldet: „Im Jahr 1960 Malvern finden wir ein Beben".
  // Ein Gattungswort, das die Tabelle nicht kennt, bekommt damit ebenfalls
  // „in" — ohne Artikel ist das die häufigste Präposition und immer noch
  // besser als gar keine.
  if (!g) return (!np.art && !np.adj && /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(t)) ? `in ${t}` : t;
  const adj = np.adj ? adjDat(np.adj) + " " : "";
  const kind = AUF_NOUNS.test(np.noun) ? "auf" : (AN_NOUNS.test(np.noun) || AN_ENDUNG.test(np.noun)) ? "an" : "in";
  // Ohne Artikel, aber mit Adjektiv, ist der Ort unbestimmt: „Urbane Straße"
  // → „auf einer urbanen Straße" (nicht „auf der" — die kennt niemand).
  const indef = np.art.startsWith("ein") || (!np.art && !!np.adj);
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
  const fixed = parts.map((p, i) => {
    // „müde Wächterin" → „eine müde Wächterin" (nur wenn klein beginnend + Genus sicher)
    const m = p.match(/^([a-zäöüß][a-zäöüß-]*)\s+([A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]*)$/);
    if (m && !/^(der|die|das|ein|eine|einen|einem|einer|eines|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|euer|eure|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(m[1]!)) { const g = guessGender(m[2]!) || (/in$/.test(m[2]!.toLowerCase()) ? "f" : undefined); if (g === "f") return `eine ${m[1]} ${m[2]}`; if (g === "m" || g === "n") return `ein ${m[1]} ${m[2]}`; }
    // „Erwachsene verschiebt eine Beerdigung" stand im Blatt: Ein nacktes
    // Gattungswort ohne Artikel trifft auf Rahmen im Singular. Einen Artikel
    // bekommt NUR, was auf der kuratierten Personen-Liste steht — ein
    // pauschales „ein" vor jedem nackten Wort träfe auch Namen („ein
    // Ottilie"). Substantivierte Adjektive erkennt man daran, dass die Liste
    // beide Formen kennt (erwachsene/erwachsener): -e ist die weibliche,
    // -er die männliche starke Form nach „ein". Für den Rest entscheidet die
    // Genus-Schätzung; ohne Befund bleibt das Wort unangetastet — und
    // ausdrückliche Plurale (Männer) ebenso.
    if (i === 0 && /^[A-ZÄÖÜa-zäöüß][a-zäöüß-]+$/.test(p) && PERSON_NOMEN.test(p) && !/^(männer|leute)$/i.test(p)) {
      const wort = cap(p);
      const klein = p.toLowerCase();
      if (/er$/.test(klein) && PERSON_NOMEN.test(klein.slice(0, -1))) return `ein ${wort}`;
      if (/e$/.test(klein) && PERSON_NOMEN.test(klein + "r")) return `eine ${wort}`;
      const g = guessGender(wort);
      if (g === "f") return `eine ${wort}`;
      if (g === "m" || g === "n") return `ein ${wort}`;
    }
    // Ein Zusatz wird NICHT großgeschrieben. Er ist kein Satzanfang und keine
    // Person — „die Archivarin, Voller ungestellter Fragen" war der erste
    // sichtbare Schritt auf dem Weg zu einer erfundenen zweiten Figur.
    // Der erste Teil ist immer der Kopf der Phrase und wird großgeschrieben.
    return i === 0 || istEigenePerson(p) ? cap(p) : low(p);
  });
  return fixed.join(", ");
}
export { low as lowerFirst };

// ── Eingabe-Bewertung (0 = schlecht/rot … 1 = gut/grün; -1 = leer/keine Wertung) ──
// Kriterium: Kann die Engine den Wert grammatisch sicher in die Schablonen einsetzen?
export function rateWhere(s: string): number {
  const t = (s || "").trim();
  if (!t) return -1;
  if (PREPS.test(t)) return 1;                 // fertige Ortsangabe
  if (normWhere(t) !== t) return 0.8;          // Engine kann normalisieren
  return 0.35;                                  // bleibt roh — Bruchgefahr
}
export function rateWhen(s: string): number {
  const t = (s || "").trim();
  if (!t) return -1;
  if (PREPS.test(t) || TIME_ADV.test(t) || /\d+\s*uhr/i.test(t)) return 1;
  if (normWhen(t) !== t) return 0.8;
  return 0.35;
}
export function rateWho(s: string): number {
  const t = (s || "").trim();
  if (!t) return -1;
  const parts = t.split(",").map((p) => p.trim()).filter(Boolean);
  let sum = 0;
  for (const p of parts) {
    if (/^(der|die|das|ein|eine|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere)\s/i.test(p) || /^[A-ZÄÖÜ]/.test(p)) sum += 1;
    else if (normWho(p) !== p) sum += 0.8;
    else sum += 0.4;
  }
  return parts.length ? sum / parts.length : -1;
}
