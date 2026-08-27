// Offline-Ableitung der Atom-Merkmale, die sich berechnen lassen.
// Nur was NICHT berechenbar ist (bruchgrad, register, *_wandelbar), bleibt der KI.
// Prüfreihenfolge: finites Verb ZUERST — sonst wird „Im Schaufenster lag …“
// fälschlich zur Präpositionalphrase.
import { extractLeadVerb, looksLikeFullClause } from "../generation/wordcls";
import { isPastTense, properNames } from "../generation/coherence";
import { guessGender } from "../generation/declension";
import { istVerbform } from "../generation/verben";
import { VERB_CONJ } from "../generation/verbconj.data";

export type AtomTyp = "hauptsatz" | "nebensatz" | "nominalphrase" | "praepositionalphrase"
  | "rahmen" | "fragment" | "einwort" | "konnektor" | "kopf";

export interface Rhythmus { woerter: number; silben: number; tiefe: number; endzeichen: string; gewicht: "kurz" | "mittel" | "lang"; }
export interface Subjekt { person: 1 | 2 | 3; numerus: "sg" | "pl"; genus: "mask" | "fem" | "neut" | null; }
export interface DerivedAtom {
  text: string; typ: AtomTyp;
  bietet: { kasus: string | null; kadenz: "fallend" | "offen" | "schwebend" };
  subjekt: Subjekt | null;
  tempus: "praesens" | "praeteritum" | "kein";
  fuehrt_ein: string[];
  verlangt_bezug: { pronomen: string; genus: string; numerus: string } | null;
  oeffnet: boolean;
  rhythmus: Rhythmus;
  unsicher: string[];            // Felder, die nachgeprüft werden sollten
}

const SEIN_HABEN_WERDEN = /^(ist|sind|bin|bist|seid|war|waren|warst|hat|habe|hast|haben|habt|hatte|hatten|wird|werden|wirst|werdet|wurde|wurden|kann|kannst|können|könnt|konnte|muss|musst|müssen|müsst|will|willst|wollen|wollt|soll|sollen|darf|dürfen|mag|mögen|weiß|wissen|bleibt|bleiben|blieb|gibt|geben|gab)$/;
// Finite Verbformen mit kurzem Stamm. Die allgemeine Regel verlangt vier Buchstaben
// VOR der Endung; "löst" hat drei und rutschte durch - so landete "eine Verdrängung
// löst sich" als Nominalphrase in einem Akkusativ-Rahmen. Eine Liste statt einer
// kuerzeren Mindestlaenge, weil sonst Adjektive wie "kalt", "laut", "hart", "bunt"
// als Verben gelten wuerden.
const KURZVERB = /^(löst|geht|ruft|tut|gibt|lebt|hebt|legt|sagt|sieht|hält|fällt|zieht|trägt|liegt|kommt|nimmt|läuft|steht|dreht|führt|hört|fühlt|zählt|setzt|passt|weint|lacht|denkt|kennt|nennt|misst|sinkt|steigt|klingt|singt|fehlt|blickt|wirkt|reißt|bricht|spricht|wächst)$/;
const PRAET_FORM = /(?:^|^[a-zäöüß]{2,6})(lag|lagen|stand|standen|ging|gingen|kam|kamen|sah|sahen|nahm|nahmen|hielt|hielten|ließ|ließen|fand|fanden|zog|zogen|trug|trugen|fiel|fielen|rief|riefen|sprach|schrieb|floss|stieg|sank|klang|hing|schien|trieb|brach|schloss|verlor|begann|geschah|roch|rochen|sass|saßen|riss|rissen|sprang|sprangen|schlug|schlugen|traf|trafen|griff|griffen|lief|liefen|wusste|wussten|verschwand|verschwanden|blieb|blieben|hieß|hießen|wuchs|wuchsen|schob|schoben|bog|bogen|schwieg|schwiegen)$/;
// Endungen, die eher auf ein Nomen als auf ein Verb deuten (Falsch-Positive vermeiden)
// Kleingeschriebene Wörter auf -en, die keine Verben sind: Präpositionen,
// Adverbien, Adjektive, Pronomen, Zahlwörter. Nomen sind groß und fallen
// vorher heraus; diese Liste fängt den Rest, damit „offen" nicht „offt".
const EN_KEIN_VERB = new Set(["gegen", "neben", "wegen", "zwischen", "entgegen", "oben", "unten", "eben", "drüben",
  "draußen", "drinnen", "morgen", "selten", "ansonsten", "meisten", "wenigsten", "offen", "eigen", "golden", "seiden",
  "wollen", "einen", "keinen", "meinen", "seinen", "ihren", "deinen", "unseren", "euren", "deren", "dessen", "allen",
  "vielen", "manchen", "welchen", "jeden", "diesen", "jenen", "denen", "ihnen", "sieben", "tausenden", "hunderten",
  "anderen", "einigen", "wenigen", "beiden", "solchen", "eigenen", "ersten", "zweiten", "dritten", "letzten",
  "nächsten", "besten", "ganzen", "halben", "fernen", "nahen", "hohen", "tiefen", "langen", "kurzen", "alten",
  "neuen", "jungen", "kleinen", "großen", "roten", "grünen", "blauen", "schwarzen", "weißen", "kalten", "warmen",
  "leeren", "vollen", "toten", "fremden", "stillen", "dunklen", "hellen", "innen", "außen", "hinten", "vorn",
  "mitten", "unterdessen", "indessen", "übrigen", "wegen", "trotzdem", "zusammen", "gegenüber", "drüben"]);
const DET_ODER_PREP = new Set(["der", "die", "das", "des", "dem", "den", "ein", "eine", "einen", "einem", "einer", "eines",
  "kein", "keine", "keinen", "keinem", "keiner", "mein", "meine", "meinen", "meinem", "meiner", "dein", "deine", "deinen",
  "sein", "seine", "seinen", "seinem", "seiner", "ihr", "ihre", "ihren", "ihrem", "ihrer", "unser", "unsere", "unseren",
  "im", "am", "vom", "zum", "zur", "beim", "ins", "ans", "mit", "von", "zu", "aus", "bei", "nach", "seit", "auf", "an", "in",
  "über", "unter", "vor", "hinter", "neben", "zwischen", "durch", "für", "ohne", "um", "gegen", "wegen", "trotz",
  "während", "dieser", "diese", "diesen", "diesem", "dieses", "jeder", "jede", "jeden", "jedem", "jedes", "welcher",
  "welche", "welchen", "welchem", "manche", "manchen", "solche", "solchen", "viele", "vielen", "wenige", "wenigen",
  "einige", "einigen", "beide", "beiden", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn",
  "ganz", "sehr", "zu", "so", "wie", "als", "etwas", "nichts"]);
const NOMEN_ENDUNG = /(ung|heit|keit|schaft|tät|ion|nis|tum|chen|lein|ment)$/;
const PREP = /^(in|im|an|am|auf|bei|beim|mit|von|vom|zu|zum|zur|nach|über|unter|vor|hinter|neben|zwischen|durch|für|ohne|um|gegen|seit|trotz|wegen|während|aus|entlang|inmitten|jenseits|abseits)\b/i;
const SUBJUNKTION = /^(dass|weil|obwohl|wenn|nachdem|bevor|ob|indem|sobald|solange|falls|sodass)\b/i;
const REL = /^(der|die|das|den|dem|des|welche[rsmn]?)\s+\S+\s/i;
const KONNEKTOR = /^(und|oder|aber|doch|denn|sondern|dann|dabei|also|somit|trotzdem|dennoch|außerdem|zudem)(\s+\w+)?$/i;
const ARTIKEL = /^(ein|eine|einen|einem|einer|eines|der|die|das|den|dem|des|kein|keine|mein|meine|dein|deine|sein|seine|ihr|ihre|dieser|diese|dieses|jener|jene)\b/i;
const PRON_START = /^(er|sie|es|ihm|ihr|ihn|ihnen|dessen|deren|diese[rs]?|jene[rs]?)\b/i;

const silben = (t: string): number => {
  const w = t.toLowerCase().match(/[a-zäöüß]+/g) || [];
  return w.reduce((n, x) => n + Math.max(1, (x.match(/[aeiouäöüy]+/g) || []).length), 0);
};
const woerter = (t: string): number => (t.match(/\S+/g) || []).length;
const tiefe = (t: string): number => (t.match(/,\s*(dass|weil|obwohl|wenn|als|während|nachdem|bevor|damit|ob|indem|der|die|das|den|dem|welche)/gi) || []).length;

/** Grammatische Person aus dem Text (nur bei satzwertigen Typen sinnvoll). */
function subjektOf(t: string, typ: AtomTyp): Subjekt | null {
  if (!["hauptsatz", "nebensatz", "rahmen", "kopf"].includes(typ)) return null;
  const s = " " + t.toLowerCase() + " ";
  if (/\b(ich|mir|mich)\b/.test(s)) return { person: 1, numerus: "sg", genus: null };
  if (/\b(wir|uns)\b/.test(s)) return { person: 1, numerus: "pl", genus: null };
  if (/\b(du|dir|dich)\b/.test(s)) return { person: 2, numerus: "sg", genus: null };
  if (/\b(ihr|euch)\b/.test(s)) return { person: 2, numerus: "pl", genus: null };
  // 3. Person: Genus über den ersten Artikel-Nomen-Treffer schätzen
  const m = t.match(/\b(?:der|die|das|ein|eine)\s+([A-ZÄÖÜ][a-zäöüß-]+)/);
  const g = m ? guessGender(m[1]!) : undefined;
  const genus = g === "m" ? "mask" : g === "f" ? "fem" : g === "n" ? "neut" : null;
  const plural = /\b(sie|die)\s+\w+en\b/.test(t.toLowerCase()) || /\b(sind|waren|haben|werden)\b/.test(t.toLowerCase());
  return { person: 3, numerus: plural ? "pl" : "sg", genus };
}

/**
 * Enthaelt der Text ein finites Verb? Auf Modulebene gehoben und exportiert, damit
 * der Assembler dieselbe Pruefung an der Slot-Grenze nutzen kann statt einer zweiten,
 * schwaecheren Kopie.
 */
export function hatFinitesVerb(seg: string): boolean {
  // WICHTIG: Groß-/Kleinschreibung erhalten — deutsche Nomen sind groß, Verben klein.
  // Ohne diese Prüfung gelten „Frist“, „Licht“, „Nacht“ als Verbformen auf -t.
  const ws = (seg.match(/[A-Za-zÄÖÜäöüß]+/g) || []);
  for (let i = 0; i < ws.length; i++) {
    const w = ws[i]!;
    if (/^[A-ZÄÖÜ]/.test(w)) continue;                                // Nomen oder Satzanfang → kein Verbkandidat
    const l = w.toLowerCase();
    // Stellung im Satz: Ein Wort direkt nach Artikel oder Präposition ist ein
    // Adjektiv („im gleichen Takt", „mit weichen Seiten"), eines direkt vor
    // einem großgeschriebenen Nomen ebenso („einen einfachen Holzlöffel").
    // Beides sperrt die Morphologie-Regeln unten; die Tabelle darf weiter.
    const prev = (ws[i - 1] || "").toLowerCase(), next = ws[i + 1] || "";
    const attributiv = DET_ODER_PREP.has(prev) || /^[A-ZÄÖÜ]/.test(next);
    if (VERB_CONJ[l]) return true;                                    // 3. Ps. Sg. Präsens
    if (SEIN_HABEN_WERDEN.test(l)) return true;                       // Hilfs-/Modalverben
    if (PRAET_FORM.test(l)) return true;                              // starke Präteritumformen (auch trennbar: aufging)
    if (KURZVERB.test(l)) return true;                                // kurze Formen: löst, geht, ruft
    // Seit 4.331.2 über die Morphologie: „reicht" ist eine Verbform (auch
    // ohne Tabelleneintrag), und „reichen" ist eine, wenn „reicht" eine ist.
    // Vorher fiel „die Perlen reichen für ein Vorderteil" durch die
    // Nomen-Endung „-chen" und galt als Nominalphrase — und stand dann als
    // Ding hinter „bemerkt der Bote".
    if (/t$/.test(l) && !attributiv && istVerbform(l)) return true;
    if (/en$/.test(l) && l.length >= 5 && !EN_KEIN_VERB.has(l) && !attributiv
      && (VERB_CONJ[l.slice(0, -2) + "t"] || VERB_CONJ[l.slice(0, -2) + "et"] || istVerbform(l.slice(0, -2) + "t"))) return true;
    if (/^(?!ge)[a-zäöüß]{4,}(?:t|te|en|ten)$/.test(l) && !NOMEN_ENDUNG.test(l)) return true;
  }
  // Satzanfang gesondert: „Klebt ein Zuckerkringel …“, „Stand im Sand“
  const first = (seg.match(/^([A-ZÄÖÜ][a-zäöüß]+)/) || [])[1];
  if (first) { const l = first.toLowerCase(); if (VERB_CONJ[l] || SEIN_HABEN_WERDEN.test(l) || PRAET_FORM.test(l)) return true; }
  return looksLikeFullClause(null, seg);
}

export function deriveAtom(raw: string): DerivedAtom {
  const text = (raw || "").trim();
  const unsicher: string[] = [];
  const wcount = woerter(text);
  const end = (text.match(/[.!?:;—]$/) || [""])[0];

  // ── Typ: finites Verb hat Vorrang vor Satzanfang-Mustern ──
  const lead = extractLeadVerb(text);
  // Finites Verb im HAUPTTEIL (vor dem ersten Komma) — ein Verb im Relativsatz
  // macht „eine Frist, die rückwärts läuft“ nicht zum Hauptsatz.
  const haupt = text.split(",")[0]!;

  const hatFinit = !!lead.verb || hatFinitesVerb(haupt);
  let typ: AtomTyp;
  if (/:$/.test(text)) typ = "kopf";
  else if (text.includes("⟨")) typ = "rahmen";
  else if (wcount === 1) typ = "einwort";
  else if (KONNEKTOR.test(text)) typ = "konnektor";
  else if (SUBJUNKTION.test(text) && hatFinit) typ = "nebensatz";
  else if (REL.test(text) && hatFinit && /,/.test(text) === false && /\ben\b|\bt\b/.test("")) typ = "nebensatz";
  else if (hatFinit) typ = "hauptsatz";
  else if (PREP.test(text)) typ = "praepositionalphrase";
  else if (ARTIKEL.test(text) || /\b[A-ZÄÖÜ][a-zäöüß-]{2,}/.test(text)) typ = "nominalphrase";  // Kern = Substantiv
  else typ = "fragment";
  // Grenzfälle markieren: Präposition am Anfang MIT finitem Verb ist eine Inversion
  if (PREP.test(text) && hatFinit) unsicher.push("typ (Inversion?)");
  if (typ === "fragment" && wcount >= 6) unsicher.push("typ (langes Fragment?)");

  // ── Kasus (nur Nominalphrase, konservativ über den Artikel) ──
  let kasus: string | null = null;
  if (typ === "nominalphrase") {
    const a = (text.match(/^(\S+)/) || [""])[0]!.toLowerCase();
    // „der“ ist dreifach mehrdeutig: Nominativ mask., Dativ fem., Genitiv fem./Plural.
    // Ohne diese Unterscheidung landet „der erste Riss“ (Nom.) in einem Dativ-Slot.
    const kern = (text.match(/\b([A-ZÄÖÜ][a-zäöüß-]{2,})/) || [])[1];
    const g = kern ? guessGender(kern) : undefined;
    if (/^(einen|den)$/.test(a)) kasus = "akk";
    else if (/^(einem|dem|einer)$/.test(a)) kasus = "dat";
    else if (a === "der") { kasus = g === "f" ? "dat" : g === "m" ? "nom" : null; if (!kasus) unsicher.push("kasus (der: Nom/Dat)"); }
    else if (/^(eines|des)$/.test(a)) kasus = "gen";
    else if (/^(ein|eine|die|das)$/.test(a)) { kasus = "nom_akk"; unsicher.push("kasus (nom/akk mehrdeutig)"); }
    else unsicher.push("kasus");
  }

  const kadenz: DerivedAtom["bietet"]["kadenz"] = end === ":" ? "schwebend" : end ? "fallend" : "offen";
  const tempus = typ === "nominalphrase" || typ === "fragment" || typ === "praepositionalphrase" || typ === "einwort"
    ? "kein" : (isPastTense(text) ? "praeteritum" : "praesens");
  const bezug = PRON_START.test(text)
    ? { pronomen: (text.match(/^\S+/) || [""])[0]!.toLowerCase(), genus: /^(sie|ihr|ihnen)/i.test(text) ? "fem" : "mask", numerus: "sg" }
    : null;
  if (bezug) unsicher.push("verlangt_bezug (Genus geschätzt)");

  const s = silben(text);
  return {
    text, typ,
    bietet: { kasus, kadenz },
    subjekt: subjektOf(text, typ),
    tempus,
    fuehrt_ein: properNames(text),
    verlangt_bezug: bezug,
    oeffnet: typ === "kopf",
    rhythmus: { woerter: wcount, silben: s, tiefe: tiefe(text), endzeichen: end, gewicht: wcount <= 4 ? "kurz" : wcount <= 9 ? "mittel" : "lang" },
    unsicher,
  };
}
