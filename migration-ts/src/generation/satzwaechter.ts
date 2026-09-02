// Der Satz-Wächter — Grammatik-Plausibilität für Markov-Ausgaben.
//
// Empfehlung Punkt 1 aus der Stand-Analyse: Die letzte große Störer-Klasse
// sind verschmolzene Ketten-Reste, die die statistische Prüfung (isSaneMarkov)
// passieren, weil sie aus echten Wörtern in echter Häufigkeit bestehen —
// gemeldet: „Ein Spiegelbild zeigt den Ritter als das, was nach dem Sinn und
// wird ausgeschlossen." und „Irgendwo wie Wärme ohne Ursache fest."
//
// Dieser Wächter prüft die GRAMMATIK-Gestalt, mit der Morphologie aus
// verben.ts. Er ist bewusst konservativ: Er verwirft nur, was sicher gebrochen
// ist — die Maschine lebt von Nominalphrasen, kühnen Bildern und Inversionen,
// und ein zu strenger Wächter würde ihren Ton töten. Jede Regel steht mit
// ihrem gemeldeten Fall daneben.
import { istVerbform, KEIN_VERB } from "./verben";

const FUNKTION = new Set([
  "der", "die", "das", "den", "dem", "des", "ein", "eine", "einen", "einem", "einer", "eines",
  "und", "oder", "aber", "doch", "denn", "sondern", "als", "wie", "dass", "ob", "weil", "wenn",
  "ohne", "mit", "von", "aus", "an", "auf", "in", "im", "am", "für", "zu", "zum", "zur", "bei", "beim",
  "nach", "vor", "über", "unter", "neben", "zwischen", "hinter", "durch", "gegen", "um", "seit",
  "es", "sich", "man", "sie", "er", "wir", "ich", "du", "ihr", "was", "wer", "wo", "so", "nur",
  "auch", "noch", "schon", "sehr", "nicht", "kein", "keine", "jeder", "jede", "jedes", "alle",
]);

/** Endet der Satz auf ein Wort, hinter dem etwas fehlen MUSS? Artikel,
 *  Präposition, Konjunktion — „… als das, was nach dem" wäre so ein Ende. */
const HAENGENDES_ENDE = new Set([
  "der", "den", "dem", "des",
  "und", "oder", "aber", "sondern", "als", "dass", "weil", "wenn",
  "für", "zwischen", "seit",
  // NICHT in der Liste: alles, was im Deutschen legitim am Satzende steht —
  // trennbare Verbpartikel („geht auf", „holt ihn ein", „gibt nach"),
  // Infinitiv-zu („um wahr zu sein"), Vergleiche („schwer wie Blei"),
  // Pronomen und Zahlwörter („der Grat trägt nur einen", „statt einem",
  // „will es sehr"). Die Gegenprobe über 6930 eingebaute Sätze hat die
  // Liste auf diesen Kern gestutzt.
]);

/** Könnte dieses Wort ein Verb sein? Erst die Morphologie (kennt auch starke
 *  Formen), dann die vorsichtige Endungs-Heuristik aus der Atom-Klassifikation. */
// Adjektive auf -t/-st, die die Endungs-Heuristik sonst für Verben hielte —
// „Irgendwo wie Wärme ohne Ursache fest" rutschte über „fest" durch.
const ADJEKTIV = new Set([
  "fest", "echt", "leicht", "schlecht", "recht", "dicht", "glatt", "satt", "bunt", "kalt",
  "alt", "laut", "tot", "rot", "gut", "weit", "hart", "zart", "nett", "matt", "spät",
  "bereit", "breit", "nackt", "exakt", "direkt", "perfekt", "korrekt", "konkret", "komplett",
  "ernst", "feist", "meist", "erst", "zunächst", "höchst", "äußerst", "einst", "sonst", "fast", "bloß",
]);
// Hilfs-, Modal- und Allerweltsverben, die weder das Paradigma noch die
// Endungs-Heuristik sicher erkennt — „Ich bin frei", „das war genau so".
const HILFSVERB = new Set([
  "bin", "bist", "sind", "seid", "war", "warst", "waren", "wart", "sei", "wäre", "wären",
  "hab", "habe", "hast", "haben", "habt", "hatte", "hatten", "hätte", "hätten",
  "werde", "wirst", "wird", "werden", "werdet", "wurde", "wurden", "würde", "würden",
  "kann", "kannst", "können", "könnt", "konnte", "konnten", "könnte", "könnten",
  "muss", "musst", "müssen", "müsst", "musste", "mussten", "müsste",
  "darf", "darfst", "dürfen", "dürft", "durfte", "durften", "dürfte",
  "soll", "sollst", "sollen", "sollt", "sollte", "sollten",
  "mag", "magst", "mögen", "mögt", "mochte", "möchte", "möchten",
  "will", "willst", "wollen", "wollt", "wollte", "wollten",
  "lässt", "ließ", "ließen", "gibt", "gab", "gaben", "tut", "tat", "schwör", "schwöre",
]);
const verbKandidat = (roh: string, istErstes = false): boolean => {
  // Großgeschrieben in der Satzmitte = Nomen — „Wärme" in „wie Wärme ohne
  // Ursache" ist keine Verbform, auch wenn „ich wärme" eine wäre. Nur das
  // erste Wort darf groß UND Verb sein (Inversion, Imperativ).
  if (!istErstes && /^[A-ZÄÖÜ]/.test(roh)) return false;
  const w = roh.toLowerCase().replace(/[^a-zäöüß]/g, "");
  if (!w || FUNKTION.has(w) || KEIN_VERB.has(w) || ADJEKTIV.has(w)) return false;
  if (HILFSVERB.has(w) || istVerbform(w)) return true;
  return /(t|st|e|en|eln|ern|elt|ert)$/.test(w) && !/(heit|keit|ung|schaft|tät|ment|iert)$/.test(w) && !/(em|er|es)$/.test(w) && w.length >= 3;
};

const woerter = (s: string): string[] => s.split(/\s+/).map((w) => w.replace(/[„“"»«().!?…;:]+/g, "")).filter(Boolean);

/** Beginnt wie eine gewollte Nominalphrase: Artikel oder Mengenwort am Kopf. */
const NP_KOPF = /^(der|die|das|ein|eine|einen|kein|keine|zwei|drei|viele|manche|jede[rs]?|irgendein|lauter)\b/i;

/** Ein einzelner Satz (ohne Schlusszeichen) — plausibel oder gebrochen? */
export function satzPlausibel(satz: string): boolean {
  const bare = satz.trim().replace(/[.!?…]+$/, "").trim();
  if (!bare) return false;
  const ws = woerter(bare);
  if (!ws.length) return false;

  // 1. Hängendes Ende: „… was nach dem" / „… eine Uhr und". Immer gebrochen.
  const letztes = ws[ws.length - 1]!.toLowerCase();
  if (HAENGENDES_ENDE.has(letztes)) return false;

  const hatVerb = ws.some((w, i) => verbKandidat(w, i === 0));

  // 2. Lange Folge ohne jedes mögliche Verb: „Irgendwo wie Wärme ohne Ursache
  //    fest" — kein Verbkandidat, kein Nominalphrasen-Kopf. Kurze Bildzeilen
  //    („Eine Uhr ohne Zeiger", „Nebelfetzen im Gras") bleiben erlaubt.
  if (!hatVerb) {
    if (ws.length > 12) return false;
    // Koordinator am Kopf abstreifen („Und der Traum …"), dann gilt: Ein
    // Artikel-Kopf ODER ein Nomen-Kopf (großgeschrieben, kein Adverb) trägt
    // eine gewollte Bildzeile — „Salz auf den Lippen wie eine Predigt",
    // „Nebel aus Abgasen über der Stadt". „Irgendwo wie Wärme …" beginnt mit
    // einem Adverb und bleibt draußen.
    const kern = bare.replace(/^(und|aber|doch|dann|denn|oder|nur|auch)\s+/i, "");
    const kopf = kern.split(/\s+/)[0] || "";
    const ADVERB_KOPF = /^(irgendwo|irgendwann|irgendwie|dort|hier|heute|morgen|gestern|vielleicht|manchmal|so|bald|überall|nirgends|nirgendwo|draußen|drinnen|oben|unten|jetzt|damals|dennoch|trotzdem|deshalb|darum|davor|danach|zuerst|zuletzt|womöglich|angeblich|vermutlich|wahrscheinlich)$/i;
    const nomenKopf = /^[A-ZÄÖÜ]/.test(kopf) && !ADVERB_KOPF.test(kopf) && !FUNKTION.has(kopf.toLowerCase());
    // Präpositional-Fragmente sind Hausstil („Am Vorabend einer Abreise in
    // einer Wüste mit Türen.") — sie bleiben.
    const prepKopf = /^(in|im|ins|über|überm|unter|unterm|auf|aufs|an|am|ans|bei|beim|hinter|vor|vorm|neben|zwischen|aus|von|vom|nach|zu|zum|zur|mit|durch|gegen|um|seit|während|trotz|wegen)$/i.test(kopf);
    if (ws.length > 5 && !NP_KOPF.test(kern) && !nomenKopf && !prepKopf) return false;
  }

  // 3. Gebrochene Klausel: Nach dem Komma ein Relativ-/Fragewort, und zwischen
  //    ihm und einem „und + Verb" steht KEIN Verb — „…, was nach dem Sinn und
  //    wird ausgeschlossen". Der Rest zweier verschmolzener Ketten.
  for (const teil of bare.split(/,\s*/).slice(1)) {
    const tw = woerter(teil);
    if (!tw.length || !/^(was|wer|der|die|das|dem|den|wo|wie)$/i.test(tw[0]!)) continue;
    const undIdx = tw.findIndex((w, i) => i > 0 && /^(und|oder)$/i.test(w));
    if (undIdx > 1 && verbKandidat(tw[undIdx + 1] || "", false) && !tw.slice(1, undIdx).some((w) => verbKandidat(w, false))) return false;
  }

  // 4. Subjektlose Inversion mit Vergleich: Eine Klausel, die mit einer
  //    Präposition beginnt, ein Verb trägt, und direkt nach dem Verb steht
  //    NUR ein „wie/als"-Vergleich — gemeldet: „über den Wipfeln liegt wie
  //    Wasser". In der Inversion muss das Subjekt hinter dem Verb kommen;
  //    ein Vergleich ist keins. Bewusst eng: „Im Hof liegt wie immer Schnee"
  //    bleibt (nach dem Vergleich steht das Subjekt), „Im Teich schwimmt,
  //    was nicht schwimmen kann" bleibt (kein Vergleich), Partizip-
  //    Appositionen („ein Pakt, mit Blut besiegelt") bleiben.
  const PREP_KOPF = /^(in|im|ins|über|überm|unter|unterm|auf|aufs|an|am|ans|bei|beim|hinter|vor|vorm|neben|zwischen|aus|von|vom|nach|zum|zur|mit|durch|gegen|seit|trotz|wegen)$/i;
  for (const teil of bare.split(/,\s*/)) {
    const tw = woerter(teil);
    if (tw.length < 4 || !PREP_KOPF.test(tw[0]!)) continue;
    if (/^(dem|denen|deren|dessen|welche[rmn]?)$/i.test(tw[1] || "")) continue;   // Relativsatz: „in dem ein Zimmer mehr ist als gestern"
    if (tw.slice(1).some((w) => /^zu$/i.test(w))) continue;          // zu-Infinitiv: Verb am Ende ist die Regel
    const vi = tw.findIndex((w, i) => i > 1 && verbKandidat(w, false));
    if (vi < 2) continue;
    if (tw.slice(1, vi).some((w) => /^(es|er|sie|wir|ich|du|man|jemand|niemand|etwas|nichts|alles)$/i.test(w))) continue;
    const rest = tw.slice(vi + 1);
    if (/^(wie|als)$/i.test(rest[0] || "") && rest.length <= 2) return false;
  }

  // 5. „lässt sich …" verlangt am Klausel-Ende einen Infinitiv (lässt sich
  //    erklären, lässt sich nicht beirren). Endet die Klausel auf ein Wort mit
  //    -t, das weder Funktionswort noch Adjektiv ist, steht dort ein
  //    Partizip oder eine Personalform — gemeldet: „Der Zufall lässt sich
  //    nicht ganz aufgehört". Der Rest zweier Ketten.
  // Geteilt auch an „und/aber/oder": „lässt sich nicht messen und wird
  // trotzdem gezählt" — das Partizip gehört zur zweiten Klausel.
  for (const teil of bare.split(/[,;]\s*|\s+(?:und|aber|oder|doch|sondern)\s+/i)) {
    if (!/\bl(ä|ie)(ss|ß)t?\s+(es\s+)?sich\b/i.test(teil)) continue;
    const tw = woerter(teil);
    const letztes = (tw[tw.length - 1] || "").toLowerCase();
    if (!letztes || /^[A-ZÄÖÜ]/.test(tw[tw.length - 1] || "")) continue;   // Nomen am Ende: „lässt sich Zeit"
    if (FUNKTION.has(letztes) || ADJEKTIV.has(letztes) || HILFSVERB.has(letztes)) continue;
    if (/t$/.test(letztes) && !/(en|eln|ern)$/.test(letztes)) return false;
  }

  return true;
}

/** Alle Sätze eines Markov-Stücks müssen plausibel sein. */
export function stueckPlausibel(text: string): boolean {
  const saetze = (text || "").split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
  if (!saetze.length) return false;
  return saetze.every(satzPlausibel);
}
