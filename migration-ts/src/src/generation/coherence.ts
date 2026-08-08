// Kohärenz-Metriken für die Bewertung: Tempus-Einheitlichkeit, Phrasen-
// Wiederholung (n-Gramme) und Figuren-Disziplin. Alle rein offline und
// heuristisch — sie ersetzen kein Sprachverständnis, fangen aber die
// typischen Symptome zusammengesetzter Texte.
import { splitSentences } from "../text-utils";
import { NOUN_GENDER } from "./nouns.data";

// ── 1) Tempus ────────────────────────────────────────────────────────
// Präteritum-Marker: starke Formen + schwache -te/-ten-Endungen.
const PRAET_STRONG = /\b(war|waren|warst|hatte|hatten|wurde|wurden|ging|gingen|kam|kamen|sah|sahen|gab|gaben|stand|standen|blieb|blieben|hielt|hielten|ließ|ließen|fand|fanden|nahm|nahmen|sprach|sprachen|schrieb|schrieben|trug|trugen|fuhr|fuhren|lief|liefen|saß|saßen|lag|lagen|hieß|hießen|zog|zogen|schlief|schliefen|rief|riefen|fiel|fielen|sang|sangen|trank|tranken|schwieg|schwiegen|floss|flossen|stieg|stiegen|sank|sanken|bot|boten|schloss|schlossen|verlor|verloren|begann|begannen|geschah|geschahen|konnte|konnten|musste|mussten|wollte|wollten|sollte|sollten|durfte|durften|wusste|wussten|dachte|dachten|brachte|brachten)\b/i;
// Bewusst OHNE /i: Nomen (Seekarte, Karten) sind großgeschrieben.
// "tet" gehoerte hier NICHT hin: "er wartet", "sie antwortet", "es bedeutet" sind
// Praesens, dritte Person Singular von Verben mit t-Stamm. Das Muster hat sie fuer
// Praeteritum gehalten - ein reiner Praesens-Text bekam dadurch die schlechteste
// Note. Die zweite Person Plural ("ihr wartetet") faellt jetzt durch; sie kommt in
// erzaehlendem Text praktisch nicht vor.
const PRAET_WEAK = /\b[a-zäöüß]{3,}(te|ten|test)\b/;
const PRAES_MARK = /\b(ist|sind|bin|bist|seid|hat|habe|hast|haben|habt|wird|werden|wirst|kann|kannst|können|muss|musst|müssen|will|willst|wollen|soll|sollen|darf|dürfen|weiß|wissen|geht|gehen|kommt|kommen|sieht|sehen|steht|stehen|bleibt|bleiben|liegt|liegen|gibt|geben|nimmt|nehmen|spricht|sprechen|trägt|tragen|läuft|laufen|fällt|fallen|geschieht|passiert|beginnt|endet|wartet|antwortet|arbeitet|bedeutet|beobachtet|berichtet|schlägt|zeigt|dauert|öffnet|schließt|klingt|riecht|scheint|hört|fühlt|wirkt|führt|dreht|zieht|hält|läuft|fließt|wächst|sinkt|steigt|schweigt|spricht|denkt|kennt|nennt|trägt|findet|verliert|verschwindet)\b/i;

/** Steht dieser einzelne Eintrag/Satz im Präteritum? (für Wortbank-Prüfung) */
// Attributives Adjektiv statt Verb: „eine mondbeglänzte Wipfel“, „die letzte Scheibe“.
// Solche -te-Formen stehen nach Artikel/Adjektiv oder direkt vor einem Nomen.
const ADJ_CONTEXT = /(?:\b(?:der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|kein|keine|mein|meine|dein|deine|sein|seine|ihr|ihre|unser|unsere|jede|jeder|jedes|diese|dieser|dieses|manche|viele|alle)\s+[a-zäöüß]*)?\b[a-zäöüß]{3,}(?:te|ten)\b(?=\s+[A-ZÄÖÜ])/;
const weakLooksVerbal = (t: string): boolean => {
  const m = t.match(/\b[a-zäöüß]{3,}(te|ten|test|tet)\b/g);
  if (!m) return false;
  // Mindestens eine -te-Form, die NICHT vor einem Nomen steht (also kein Attribut).
  return m.some((w) => {
    const re = new RegExp("\\b" + w + "\\b(?=\\s+[A-ZÄÖÜ])");
    return !re.test(t);
  });
};

export function isPastTense(s: string): boolean {
  const t = s || "";
  if (PRAES_MARK.test(t)) return false;
  if (PRAET_STRONG.test(t)) return true;
  if (PRAET_WEAK.test(t) && weakLooksVerbal(t) && !ADJ_CONTEXT.test(t)) return true;
  // Auch die Verben der Konverter-Tabelle erkennen (hält Warnung und Umschreibung synchron)
  return (t.toLowerCase().match(/[a-zäöüß]+/g) || []).some((w) => !!PAST2PRES[w]);
}

/** Anteil der Sätze, die von der vorherrschenden Zeitform abweichen (0 = einheitlich). */
export function tenseBreakRatio(text: string): number {
  const sents = splitSentences(text).filter((s) => s.trim().length > 3);
  if (sents.length < 3) return 0;
  let past = 0, pres = 0;
  const tags: ("past" | "pres" | null)[] = sents.map((s) => {
    const isPast = PRAET_STRONG.test(s) || PRAET_WEAK.test(s);
    const isPres = PRAES_MARK.test(s);
    if (isPast && !isPres) { past++; return "past"; }
    if (isPres && !isPast) { pres++; return "pres"; }
    return null;                      // uneindeutig — zählt nicht als Bruch
  });
  const decided = past + pres;
  if (decided < 3) return 0;
  const major = past >= pres ? "past" : "pres";
  const off = tags.filter((t) => t && t !== major).length;
  return off / decided;
}

// ── 2) Phrasen-Wiederholung ──────────────────────────────────────────
const tokens = (t: string): string[] => (t.toLowerCase().match(/[a-zäöüß]{2,}/g) || []);
function ngrams(t: string, n: number): string[] {
  const w = tokens(t); const out: string[] = [];
  for (let i = 0; i + n <= w.length; i++) out.push(w.slice(i, i + n).join(" "));
  return out;
}
/** Anteil mehrfach vorkommender 3–4-Gramme im Text (0 = keine Versatzstücke). */
export function phraseRepeatRatio(text: string): number {
  let dup = 0, total = 0;
  for (const n of [3, 4]) {
    const g = ngrams(text, n);
    if (g.length < 4) continue;
    const seen = new Set<string>();
    for (const x of g) { total++; if (seen.has(x)) dup++; else seen.add(x); }
  }
  return total ? dup / total : 0;
}
/** Überlappung der 4-Gramme mit einem Vergleichsbestand (z. B. Schatzkammer). */
export function phraseOverlap(text: string, corpusNgrams: Set<string>): number {
  if (!corpusNgrams.size) return 0;
  const g = ngrams(text, 4);
  if (!g.length) return 0;
  let hit = 0;
  for (const x of g) if (corpusNgrams.has(x)) hit++;
  return hit / g.length;
}
/** Baut den 4-Gramm-Bestand aus vorhandenen Texten (für phraseOverlap). */
export function buildNgramSet(texts: string[], cap = 20000): Set<string> {
  const set = new Set<string>();
  for (const t of texts) { for (const x of ngrams(t, 4)) { set.add(x); if (set.size >= cap) return set; } }
  return set;
}

// ── 3) Figuren-Disziplin ─────────────────────────────────────────────
const NAME_STOP = new Set(["der","die","das","den","dem","des","ein","eine","einen","einem","einer","und","oder","aber","denn","doch","dann","als","wie","was","wer","wo","wann","warum","ich","du","er","sie","es","wir","ihr","man","hier","dort","jetzt","noch","nur","auch","schon","immer","nie","sehr","so","zu","im","am","auf","in","an","mit","von","für","bei","nach","vor","über","unter","durch","um","ohne","seit","damals","später","zuerst","zuletzt","stille","nein","ja","fast","vielleicht","genau","warte","gut","dabei","dazu","dann"]);
// Im Deutschen sind ALLE Nomen großgeschrieben — Eigennamen erkennt man daher
// daran, dass sie artikellos stehen und nicht im Gattungsnamen-Lexikon vorkommen.
const DETERMINER = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|meinen|meinem|meiner|dein|deine|sein|seine|seinen|seinem|ihr|ihre|ihren|ihrem|unser|unsere|euer|eure|kein|keine|keinen|keinem|jeder|jede|jedes|dieser|diese|dieses|diesem|diesen|jener|jene|manche|viele|alle|beide|im|am|zum|zur|ins|ans|vom|beim|aufs|durchs|übers|unters)$/i;
const PREP = /^(in|an|auf|bei|mit|von|zu|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus)$/i;
/** Eigennamen-Kandidaten: großgeschrieben, nicht am Satzanfang, artikellos, kein Gattungsname. */
export function properNames(text: string): string[] {
  const out = new Set<string>();
  for (const sent of splitSentences(text)) {
    const w = sent.trim().split(/\s+/);
    for (let i = 1; i < w.length; i++) {          // i=1: Satzanfang überspringen
      const raw = w[i]!.replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
      if (raw.length < 3 || !/^[A-ZÄÖÜ]/.test(raw)) continue;
      const lowRaw = raw.toLowerCase();
      if (NAME_STOP.has(lowRaw)) continue;
      if (NOUN_GENDER[lowRaw]) continue;          // bekannter Gattungsname → keine Figur
      const prev = (w[i - 1] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
      if (DETERMINER.test(prev) || PREP.test(prev)) continue; // „am Fenster“, „der Bäcker“
      out.add(raw);
    }
  }
  return [...out];
}
/** Streuung der Figuren: 0 = fokussiert, 1 = viele verschiedene Namen auf wenig Text. */
export function castSpread(text: string, expected: string[] = []): number {
  const known = new Set(expected.map((x) => x.toLowerCase()));
  const names = properNames(text).filter((n) => !known.has(n.toLowerCase()));
  const sents = Math.max(1, splitSentences(text).length);
  return Math.min(1, names.length / Math.max(4, sents * 0.5));
}

// ── Präteritum → Präsens (nur eindeutige Fälle) ──────────────────────
// Starke/unregelmäßige Verben als Tabelle (3. Person Singular Präsens).
// Was hier nicht sicher abbildbar ist, bleibt unangetastet und wird markiert.
const PAST2PRES: Record<string, string> = {
  war: "ist", waren: "sind", warst: "bist", hatte: "hat", hatten: "haben", hattest: "hast",
  wurde: "wird", wurden: "werden", ging: "geht", gingen: "gehen", kam: "kommt", kamen: "kommen",
  sah: "sieht", sahen: "sehen", gab: "gibt", gaben: "geben", stand: "steht", standen: "stehen",
  blieb: "bleibt", blieben: "bleiben", hielt: "hält", hielten: "halten", ließ: "lässt", ließen: "lassen",
  fand: "findet", fanden: "finden", nahm: "nimmt", nahmen: "nehmen", sprach: "spricht", sprachen: "sprechen",
  schrieb: "schreibt", schrieben: "schreiben", trug: "trägt", trugen: "tragen", fuhr: "fährt", fuhren: "fahren",
  lief: "läuft", liefen: "laufen", saß: "sitzt", saßen: "sitzen", lag: "liegt", lagen: "liegen",
  hieß: "heißt", hießen: "heißen", zog: "zieht", zogen: "ziehen", schlief: "schläft", schliefen: "schlafen",
  rief: "ruft", riefen: "rufen", fiel: "fällt", fielen: "fallen", sang: "singt", sangen: "singen",
  trank: "trinkt", tranken: "trinken", schwieg: "schweigt", schwiegen: "schweigen", floss: "fließt", flossen: "fließen",
  stieg: "steigt", stiegen: "steigen", sank: "sinkt", sanken: "sinken", bot: "bietet", boten: "bieten",
  schloss: "schließt", schlossen: "schließen", verlor: "verliert", verloren: "verlieren",
  begann: "beginnt", begannen: "beginnen", geschah: "geschieht", geschahen: "geschehen",
  konnte: "kann", konnten: "können", musste: "muss", mussten: "müssen", wollte: "will", wollten: "wollen",
  sollte: "soll", sollten: "sollen", durfte: "darf", durften: "dürfen", wusste: "weiß", wussten: "wissen",
  dachte: "denkt", dachten: "denken", brachte: "bringt", brachten: "bringen", kannte: "kennt", kannten: "kennen",
  erkannte: "erkennt", erkannten: "erkennen", brannte: "brennt", brannten: "brennen", nannte: "nennt", nannten: "nennen",
  rannte: "rennt", rannten: "rennen", wandte: "wendet", wandten: "wenden", sprang: "springt", sprangen: "springen",
  schrie: "schreit", schrien: "schreien", flog: "fliegt", flogen: "fliegen", floh: "flieht", flohen: "fliehen",
  schoss: "schießt", schossen: "schießen", riss: "reißt", rissen: "reißen", biss: "beißt", bissen: "beißen",
  griff: "greift", griffen: "greifen", pfiff: "pfeift", pfiffen: "pfeifen", schnitt: "schneidet", schnitten: "schneiden",
  litt: "leidet", litten: "leiden", trat: "tritt", traten: "treten", vergaß: "vergisst", vergaßen: "vergessen",
  wuchs: "wächst", wuchsen: "wachsen", wich: "weicht", wichen: "weichen", schien: "scheint", schienen: "scheinen",
  zerbrach: "zerbricht", zerbrachen: "zerbrechen", verschwand: "verschwindet", verschwanden: "verschwinden",
  erschien: "erscheint", erschienen: "erscheinen", starb: "stirbt", starben: "sterben",
  brach: "bricht", brachen: "brechen", sprach2: "spricht", schwoll: "schwillt", schwollen: "schwellen",
  bog: "biegt", bogen: "biegen", hob: "hebt", hoben: "heben", wob: "webt", woben: "weben",
  klang: "klingt", klangen: "klingen", sann: "sinnt", sannen: "sinnen", rann: "rinnt", rannen: "rinnen",
  schwamm: "schwimmt", schwammen: "schwimmen", verschwieg: "verschweigt", zerfiel: "zerfällt", zerfielen: "zerfallen",
  entstand: "entsteht", entstanden: "entstehen", verstand: "versteht", verstanden: "verstehen",
  bestand: "besteht", bestanden: "bestehen", geriet: "gerät", gerieten: "geraten",
  trieb: "treibt", trieben: "treiben", schrak: "schrickt", wies: "weist", wiesen: "weisen",
  hing: "hängt", hingen: "hängen", schwand: "schwindet", schwanden: "schwinden",
  gewann: "gewinnt", gewannen: "gewinnen", zerriss: "zerreißt", zerrissen2: "zerreißen",
  empfand: "empfindet", empfanden: "empfinden", befahl: "befiehlt", befahlen: "befehlen",
  half: "hilft", halfen: "helfen", warf: "wirft", warfen: "werfen", starrte2: "starrt",
  las: "liest", lasen: "lesen", aß: "isst", aßen: "essen", bat: "bittet", baten: "bitten",
};
// Personenabhängige Formen: nach Pronomen muss die Person stimmen.
const PERSON_FORMS: Record<string, Record<string, string>> = {
  war:   { ich: "bin", du: "bist", wir: "sind", ihr: "seid", sie: "ist", er: "ist", es: "ist" },
  waren: { wir: "sind", sie: "sind", ihr: "seid" },
  hatte: { ich: "habe", du: "hast", wir: "haben", ihr: "habt", sie: "hat", er: "hat", es: "hat" },
  hatten:{ wir: "haben", sie: "haben", ihr: "habt" },
  wurde: { ich: "werde", du: "wirst", wir: "werden", sie: "wird", er: "wird", es: "wird" },
  konnte:{ ich: "kann", du: "kannst", wir: "können", sie: "kann", er: "kann", es: "kann" },
  musste:{ ich: "muss", du: "musst", wir: "müssen", sie: "muss", er: "muss", es: "muss" },
  wollte:{ ich: "will", du: "willst", wir: "wollen", sie: "will", er: "will", es: "will" },
  sollte:{ ich: "soll", du: "sollst", wir: "sollen", sie: "soll", er: "soll", es: "soll" },
  wusste:{ ich: "weiß", du: "weißt", wir: "wissen", sie: "weiß", er: "weiß", es: "weiß" },
};

export interface TenseFix { text: string; changed: boolean; unsure: string[]; }
/** Wandelt NUR eindeutige, unregelmäßige Präteritum-Formen ins Präsens (Tabelle
 *  + Personenabgleich). Schwache Formen auf -te/-ten bleiben bewusst unangetastet:
 *  Sie sind ohne Wortartenerkennung nicht von Adjektiven („violette“) oder Nomen
 *  („Karten“) zu unterscheiden. Solche Fälle werden in `unsure` gemeldet. */
export function toPresent(entry: string): TenseFix {
  const unsure: string[] = [];
  let changed = false;
  const words = (entry || "").split(/(\s+)/);
  for (let i = 0; i < words.length; i++) {
    const w = words[i]!;
    if (!/^[A-Za-zÄÖÜäöüß]+$/.test(w)) continue;
    const low = w.toLowerCase();
    const base = PAST2PRES[low];
    if (base) {
      // Person aus dem vorangehenden Wort ableiten (z. B. „Ich war“ → „Ich bin“)
      const prev = (words.slice(0, i).reverse().find((x) => /^[A-Za-zÄÖÜäöüß]+$/.test(x)) || "").toLowerCase();
      const pf = PERSON_FORMS[low];
      let form = base;                       // Tabellenform = 3. Person Singular
      if (pf && pf[prev]) form = pf[prev]!;
      else if (/^(ich|du|wir|ihr)$/.test(prev)) { unsure.push(w); continue; } // Person unklar → nicht raten
      words[i] = /^[A-ZÄÖÜ]/.test(w) ? form.charAt(0).toUpperCase() + form.slice(1) : form;
      changed = true;
      continue;
    }
    // Schwache Form? Nur melden, nicht anfassen.
    if (/^[a-zäöüß]{4,}(te|ete)$/.test(low)) unsure.push(w);
  }
  return { text: words.join(""), changed, unsure };
}

// ── 4) Perspektive ───────────────────────────────────────────────────
// Bank-Einträge in Du-/Ich-Form brechen die eingestellte Erzählperspektive
// ("Tom will …, aber du darfst nicht frei sprechen").
const DU_FORM = /\b(du|dir|dich|dein|deine|deinen|deinem|deiner|deines)\b/i;
const ICH_FORM = /\b(ich|mir|mich|mein|meine|meinen|meinem|meiner|meines)\b/i;

/** Steht dieser Eintrag in der Du-Form? (für die Wortbank-Prüfung) */
export function isSecondPerson(s: string): boolean { return DU_FORM.test(s || ""); }
/** Steht dieser Eintrag in der Ich-Form? */
export function isFirstPerson(s: string): boolean { return ICH_FORM.test(s || ""); }

/** Anteil der Sätze, die der eingestellten Perspektive widersprechen (0 = stimmig).
 *  Bei "auto" und in Dialogen wird nicht gewertet — dort ist Wechsel gewollt. */
export function perspectiveBreakRatio(text: string, perspective?: string): number {
  if (!perspective || perspective === "auto") return 0;
  const sents = splitSentences(text).filter((x) => x.trim().length > 3);
  if (sents.length < 3) return 0;
  let off = 0;
  for (const s of sents) {
    if (perspective !== "second" && DU_FORM.test(s)) { off++; continue; }
    if (perspective !== "first" && perspective !== "we" && ICH_FORM.test(s)) off++;
  }
  return off / sents.length;
}
