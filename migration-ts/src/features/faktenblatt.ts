// Faktenblatt für die Form „Bericht".
//
// Warum es das gibt: Ein zufallsbasierter Generator widerspricht sich bei Zahlen
// und Namen zuverlässig — „vier Verletzte" im Vorspann, „drei" im Hergang. Die
// Lösung ist kein Nachprüfen, sondern eine EINMALIGE Ziehung vor dem Text. Alle
// Abschnitte lesen danach aus demselben Vorrat.
//
// Der Kern kommt aus den vier W, damit der eingegebene Kontext weiterwirkt;
// Personen, Zahlen und Chronologie werden gezogen.

import type { GenInput } from "../types";
import { pick, kuerzeAmBruch } from "../text-utils";
import { normWhere, normWhen, normWho } from "../generation/ctxnorm";
import { PERSON_NOMEN } from "../generation/wordcls";
import { guessGender } from "../generation/declension";
import { RESSORTS, rateRessort, type RessortId } from "./ressorts";

export type Genus = "mask" | "fem" | "neut";

export interface FbPerson {
  id: string; name: string; kurz: string; rolle: string; genus: Genus; zitierfaehig: boolean;
}
export interface FbZahl {
  id: string; wert: number; einheit: string; wortform: string; verbal?: string; rolle: ZahlRolle;
  /** Beschriftung im Faktenkasten, wenn das Rollen-Etikett nicht passt —
   *  kommt aus der Ressort-Einheit („Spitzenböe" statt „Ausdehnung"). */
  kastenLabel?: string;
}
export interface FbAbgeleitet {
  id: string; formel: string; wortform: string; label: string;
}
export interface FbChrono { id: string; zeit: string; was: string; }

/** Der Platzhalter, wenn „Wer?" leer bleibt. Er ist keine Information: Im Blatt
 *  stand „Eine Einrichtung Fußweg entlang von Hochbaustellen" — ein Subjekt,
 *  das niemand gemeint hat, vor einem Ausdruck, der keines braucht. Wer ihn
 *  liest, muss ihn weglassen können; deshalb steht er hier und nicht als
 *  Zeichenkette im Text. */
export const WER_ERSATZ = "eine Einrichtung";

export interface Faktenblatt {
  id: string;
  ressort: RessortId;
  wer: { haupt: string; kurz: string; genus: Genus; art: "person" | "organisation" };
  was: string;
  wo: { ort: string; mitPraep: string };
  wann: { datum: string; relativ: string };
  personen: FbPerson[];
  zahlen: FbZahl[];
  abgeleitet: FbAbgeleitet[];
  chronologie: FbChrono[];
  fiktion: true;
}

// ── Ziehvorrat ────────────────────────────────────────────────────────────
// Namen und Rollen stehen nicht in den Presets — die beschreiben Stoffe, keine
// Beteiligten. Deshalb eine eigene, kurze Liste. Vor- und Nachnamen getrennt,
// damit sich nicht dieselben Paare wiederholen.
export const NAMEN_VORRAT_HINWEIS = "Alle Namen, die gezogen werden koennen - fuer die Pruefung, ob ein fremder Name im Text steht.";
const VORNAME_F = ["Henrike", "Marlene", "Judith", "Silke", "Annegret", "Ute", "Carla", "Ines", "Britta", "Almut"];
const VORNAME_M = ["Tobias", "Reinhard", "Jonas", "Ulrich", "Malte", "Gerd", "Sven", "Konrad", "Bernd", "Ole"];
export const ALLE_NAMEN: string[] = [];
// "Baum" und "Nagel" sind hier raus: Beide sind auch Gattungsnamen und standen
// in Preset-Material, die Namensprüfung meldete sie als fremde Personen. Ein
// Nachname, der auch ein Ding sein kann, macht jede Prüfung unscharf.
const NACHNAME = ["Reimers", "Rehm", "Klasen", "Vogt", "Siewert", "Brandes", "Lohmann", "Petersen", "Kruse", "Harmsen",
  "Overbeck", "Thiessen", "Rademacher", "Wendt", "Möller", "Sander"];
ALLE_NAMEN.push(...VORNAME_F, ...VORNAME_M, ...NACHNAME);
const ROLLE_F = ["Geschäftsführerin", "Sprecherin", "Betriebsrätin", "Anwohnerin", "Gutachterin", "Vorsitzende"];
const ROLLE_M = ["Geschäftsführer", "Sprecher", "Betriebsratsvorsitzender", "Anwohner", "Gutachter", "Vorsitzender"];

// Jede Zahl braucht eine ROLLE. Ohne sie zieht das Faktenblatt Einheiten ohne
// Bezug zum Ereignis, und im Faktenkasten steht "· 9 Stunden" — konsistent,
// prüfungsfest und bedeutungslos. Die Rolle sagt, WOFÜR die Zahl da ist; daraus
// ergibt sich der Satz im Text und die Beschriftung im Kasten.
export type ZahlRolle = "betroffene" | "sache" | "dauer" | "groesse" | "vorgaenge" | "geld";

// `gen` ist der Genitiv Plural — "die Hälfte der Beschäftigten", nicht "der
// Beschäftigte". Betroffen ist nur das substantivierte Adjektiv; bei allen
// anderen sind Nominativ und Genitiv Plural gleich.
interface EinheitDef { einheit: string; rolle: ZahlRolle; min: number; max: number; rund: number; gen?: string; label?: string; }

const EINHEIT: EinheitDef[] = [
  { einheit: "Beschäftigte", rolle: "betroffene", min: 40, max: 900, rund: 10, gen: "Beschäftigten" },
  { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 1200, rund: 10 },
  { einheit: "Anwohner", rolle: "betroffene", min: 30, max: 2000, rund: 10 },
  { einheit: "Arbeitsplätze", rolle: "betroffene", min: 15, max: 700, rund: 5 },
  { einheit: "Stunden", rolle: "dauer", min: 2, max: 72, rund: 1 },
  { einheit: "Tage", rolle: "dauer", min: 2, max: 40, rund: 1 },
  // KEINE allgemeine Größe mehr. „Ausdehnung: 278 Meter" stand in etwa jedem
  // zweiten Bericht von sieben der neun Ressorts und sagte nirgends etwas: Ein
  // Bildungsbericht hat keine Meter. Jedes Ressort führt jetzt seine eigene
  // Größe (Sitzplätze, Klassenräume, Stimmbezirke, Messreihen …), und die
  // allgemeine Liste muss nicht mehr einspringen.
  //
  // Wo eine Länge wirklich passt, steht sie beim Ressort selbst: „Meter
  // Kaimauer" bei der Wirtschaft, „Meter Laufbahn" beim Sport.
  { einheit: "Unterschriften", rolle: "vorgaenge", min: 200, max: 9000, rund: 50 },
  { einheit: "Anträge", rolle: "vorgaenge", min: 12, max: 600, rund: 1 },
  { einheit: "Beschwerden", rolle: "vorgaenge", min: 5, max: 400, rund: 1 },
  { einheit: "Millionen Euro", rolle: "geld", min: 2, max: 90, rund: 1 },
];

/** Beschriftung im Faktenkasten — eine nackte Zahl sagt dort nichts. */
export const ROLLE_LABEL: Record<ZahlRolle, string> = {
  betroffene: "Betroffen", sache: "Gegenstand", dauer: "Dauer", groesse: "Ausdehnung",
  vorgaenge: "Vorgänge", geld: "Volumen",
};

/** Wann sich die Sache das erste Mal zeigte. Relative Angaben, damit sie zu
 *  jedem Ereignisjahr passen. */
const VORGESCHICHTE_ZEIT = [
  "im Frühjahr", "im vergangenen Herbst", "im Sommer davor", "vor zwei Jahren",
  "im Winter zuvor", "vor einigen Monaten", "im Jahr davor", "kurz nach der Wende",
];
const VORGESCHICHTE_SACHLICH = [
  "die erste Meldung", "der erste Hinweis", "die erste Beschwerde",
  "die erste Anfrage", "der erste Zweifel", "das erste Gerücht",
];
const VORGESCHICHTE_GUT = [
  "die erste Zusage", "das erste Angebot", "die erste Anfrage",
  "der erste Zuspruch", "die erste Unterstützung", "das erste Interesse",
];

const ZEITPUNKT = ["am vergangenen Donnerstag", "am Montagabend", "in der Nacht zum Sonntag",
  "am frühen Morgen", "gegen Mittag", "am Dienstag"];
const RELATIV = ["vor vier Tagen", "vor einer Woche", "seit dem Wochenende", "am Vortag", "vor drei Tagen"];

/** Verbale Rundung, oder nichts, wenn sie den Wert nicht veraendert. */
function rundWort(wert: number): string | undefined {
  const stufe = wert >= 1000 ? 100 : wert >= 100 ? 10 : 0;
  if (!stufe) return undefined;
  const gerundet = Math.round(wert / stufe) * stufe;
  return gerundet === wert ? undefined : `rund ${zahlwort(gerundet)}`;
}

/** Das Nomen aus „Was passiert?" als Einheit — „produziert keine Lanzen mehr"
 *  ergibt „600 Lanzen". Damit bekommt die Zahl einen Gegenstand aus dem Ereignis
 *  statt einen beliebigen aus der Liste; genau das fehlte, als im Faktenkasten
 *  „9 Stunden" stand.
 *
 *  Nur bei erkennbarem Plural: „600 Wurzel" wäre falsch, und deutsche Pluralformen
 *  lassen sich nicht zuverlässig bilden. Im Zweifel gar nichts — dann bleibt es
 *  bei den allgemeinen Rollen. */
// Nur -en, -er, -e. Das blosse -n war zu weit: "Beton" endet auf -on und wurde
// als Plural gelesen, "600 Beton" waere der Fehler gewesen, den die Zahl gerade
// vermeiden soll. Dazu eine kurze Liste haeufiger Einzahlwoerter auf -e und -er,
// die die Endung nicht von einem Plural unterscheiden kann.
// Nur -en und -ern. Die Endungen -er und -e waren zu weit: "will die Sonne
// ausknipsen" ergab "8.430 Sonne". Dass "die" auch Plural sein kann, half
// nicht - bei einem Nomen auf -e ist der Singular mindestens so wahrscheinlich.
// Der Preis ist, dass "die Verträge" durchfällt; eine falsche Zahl im Bericht
// wiegt schwerer als eine fehlende.
const PLURAL_ENDUNG = /(ern|en)$/;
// Haeufige EINZAHLwoerter auf -en. Die Endung -en ist im Deutschen kein
// verlaesslicher Pluralmarker: Wagen, Boden, Garten, Regen, Schatten, Namen und
// viele mehr sind Singular. "bringt Dauerregen ueber die Kueste" ergab sonst
// "7.880 Dauerregen". Geprueft wird auch das letzte Kompositumglied.
const EN_SINGULAR = /(regen|wagen|boden|garten|kuchen|schatten|rücken|bogen|laden|ofen|hafen|haken|balken|besen|faden|knochen|kragen|magen|nacken|namen|rasen|riemen|samen|schaden|segen|braten|graben|husten|karren|kolben|zeichen|wesen|leben|essen|wappen|becken|kissen|eisen|zeugen|glauben|willen|frieden|gedanken|kummer)$/i;
const KEIN_SACHNOMEN = /^(Jahr|Jahre|Monat|Monate|Tag|Tage|Woche|Wochen|Stunde|Stunden|Mal|Uhr|Zeit|Welt|Leben|Anfang|Nacht|Morgen|Abend|Ende|Reihe|Farbe|Sprache|Straße|Grenze|Klasse|Frage|Stelle|Weise|Seite|Liebe|Sorge|Ruhe|Stille|Ferne|Nähe|Fenster|Wasser|Feuer|Zimmer|Wetter|Messer|Muster|Ufer|Alter|Fieber|Wunder|Zeichen|Wesen)$/;

export function sachNomen(was: string): string | null {
  // Von VORN suchen, nicht von hinten: In "tanzt fuer die Gesellschaft der
  // Tanzunwilligen" ist "Gesellschaft" das Objekt und "Tanzunwilligen" ein
  // Genitivattribut - im Faktenkasten stand dadurch "370 Tanzunwilligen"
  // statt "Tanzunwillige". Ein Nomen direkt hinter "der" oder "des" ist ein
  // solches Attribut und faellt heraus.
  const woerter = (was || "").split(/\s+/);
  for (let i = 0; i < woerter.length; i++) {
    const w = (woerter[i] || "").replace(/[^A-Za-zÄÖÜäöüß-]/g, "");
    if (!/^[A-ZÄÖÜ][a-zäöüß]{3,}$/.test(w)) continue;
    if (KEIN_SACHNOMEN.test(w)) continue;
    if (!PLURAL_ENDUNG.test(w)) continue;
    if (EN_SINGULAR.test(w)) continue;
    // Nach einer Praeposition steht kein Objekt, sondern ein Praepositionalfall -
    // und das -n in "vor schweren Gewittern" ist der Dativ Plural, keine Menge.
    const zwei = (woerter[i - 2] || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
    const davor = (woerter[i - 1] || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
    // Ein eindeutig singularer Begleiter schliesst den Plural aus. "den Konzern"
    // wurde sonst als Plural gelesen, weil das Wort auf -ern endet, und im
    // Faktenkasten stand "3.450 Konzern". "die" und "keine" bleiben erlaubt -
    // sie koennen Plural sein.
    if (/^(der|des|dem|den|das|ein|eine|einen|einem|einer|eines|jeder|jede|jedes|dieser|diese|dieses|diesem|diesen)$/.test(davor)) continue;
    const PRAEP = /^(mit|bei|seit|von|zu|aus|nach|vor|in|an|auf|über|unter|neben|zwischen|hinter|durch|gegen|ohne|um|für)$/;
    if (PRAEP.test(davor) || PRAEP.test(zwei)) continue;
    return w;
  }
  return null;
}

/** Ganze Zahl im Bereich, auf `rund` gerundet. */
function zahlIn(min: number, max: number, rund: number): number {
  const roh = min + Math.random() * (max - min);
  const n = Math.max(min, Math.round(roh / rund) * rund);
  return n % 2 === 0 ? n : n + 1;   // gerade, damit die Haelfte aufgeht
}

/** Deutsche Tausenderpunkte — „1.200" statt „1200". */
export function zahlwort(n: number): string {
  return Math.round(n).toLocaleString("de-DE");
}

function genusVon(phrase: string): Genus {
  // Artikel wegnehmen und das LETZTE grossgeschriebene Wort nehmen: Bei "Die
  // Ostmoor-Werft" traf die erste Fassung auf "Die" und riet daneben - deutsche
  // Komposita bestimmt das letzte Glied, und der Artikel ist kein Kern.
  // Steht ein bestimmter Artikel davor, sagt ER das Geschlecht - verlaesslicher
  // als jede Endungsheuristik. "die Ostmoor-Werft" IST feminin; guessGender kennt
  // "Werft" nicht und fiel auf den Vorgabewert maskulin zurueck.
  const art = (phrase.match(/^(der|die|das)\s/i) || [])[1]?.toLowerCase();
  if (art === "die") return "fem";
  if (art === "das") return "neut";
  if (art === "der") return "mask";
  const ohneArt = phrase.replace(/^(der|die|das|ein|eine|einen)\s+/i, "");
  const grosse = ohneArt.match(/[A-ZÄÖÜ][a-zäöüß-]{2,}/g) || [];
  const letzt = grosse[grosse.length - 1] || "";
  const kern = letzt.includes("-") ? letzt.split("-").pop()! : letzt;
  const g = kern ? guessGender(kern) : undefined;
  return g === "f" ? "fem" : g === "n" ? "neut" : "mask";
}

/** Kurzform für die Zweitnennung: „die Ostmoor-Werft" → „die Werft". */
// Rechtsform-Kuerzel sind kein Kern: "Ritter Ltd" wurde sonst zu "der Ltd".
const RECHTSFORM = /^(Ltd|GmbH|AG|KG|SE|Inc|LLC|mbH|OHG|gGmbH|e\.?V\.?|Co|KGaA)$/i;

function kurzform(haupt: string, genus: Genus): string {
  const art = genus === "fem" ? "die" : genus === "neut" ? "das" : "der";
  let woerter = haupt.replace(/^(der|die|das|ein|eine|einen)\s+/i, "").split(/\s+/);
  while (woerter.length > 1 && RECHTSFORM.test(woerter[woerter.length - 1]!.replace(/[^A-Za-z.]/g, ""))) woerter.pop();
  const letzt = woerter[woerter.length - 1] || haupt;
  const teil = letzt.includes("-") ? letzt.split("-").pop()! : letzt;
  return `${art} ${teil}`;
}

/** Person oder Einrichtung? Eine Person "besteht" nicht seit 1988, und "der
 *  Kraus" ist keine Kurzform, sondern ein Fehler. Erkannt an drei Zeichen:
 *  kein Artikel davor, zwei grossgeschriebene Woerter, keine Rechtsform. */
const TITEL = /^(Dr|Prof|Ing|Dipl|Mag|Med|Rer|Nat|Phil|h\.c|Jun|Sen|MdB|MdL)\.?$/i;

/** Gattungsbezeichnungen für Menschen. Sie sind der zweite Weg zur Person:
 *  „ein Schulmädchen" trägt keinen Eigennamen und fiel deshalb durch — im
 *  Blatt stand „Das Schulmädchen besteht seit 1965", als wäre es ein Verein,
 *  und seine Laufbahn wurde mit der Spanne einer Einrichtung gerechnet.
 *
 *  Eng gehalten: „das Stadttheater" darf keine Person werden. Geprüft wird das
 *  LETZTE Wort, denn im Deutschen bestimmt das Grundwort das Kompositum —
 *  „Schulmädchen" ist ein Mädchen, „Mädchenschule" eine Schule. */
// PERSON_NOMEN wohnt jetzt in generation/wordcls.ts — auch normWho braucht
// die Liste, und ctxnorm darf faktenblatt nicht importieren (Kreis).
/** Bringt das „Was" in eine Form, die in einen Meldungssatz passt.
 *
 *  Anlass: Ausgabe Nr. 44. Der Sammler liefert ganze Wikipedia-Sätze mit
 *  Klammern, Semikolon und Werktiteln:
 *
 *      Die Schriftstellerin Marie von Ebner-Eschenbach (Lotti, die
 *      Uhrmacherin; Das Gemeinde­kind) wird geboren.
 *
 *  Eingesetzt wird das an einer Stelle, die eine VERBALPHRASE erwartet. Statt
 *  solches Material abzulehnen — dann fiele der halbe Sammler-Vorrat für diese
 *  Form aus — wird es umgeformt: Klammern weg, weiches Trennzeichen weg, alles
 *  hinter dem ersten Satzende weg, alles hinter einem Semikolon weg.
 *
 *  Was übrig bleibt, ist entweder ein Hauptsatz („… wird geboren") oder eine
 *  Nominalphrase („eine Wandmalerei"). Beides kann der Vorspann verarbeiten —
 *  er muss nur wissen, welches von beidem er hat. */
export function formeWas(roh: string): string {
  let w = (roh || "")
    .replace(/\u00ad/g, "")                       // weiches Trennzeichen: „Gemeinde kind"
    .replace(/\u200b/g, "")
    .replace(/\([^()]*\)/g, " ")                  // Klammereinschub samt Inhalt
    .replace(/\[[^\]]*\]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  // Nur der erste Satz. Der Rest gehört in einen Artikel, nicht in eine Meldung.
  // Geschnitten wird am Punkt, hinter dem ein GROSSBUCHSTABE folgt — und nur,
  // wenn davor keine Abkürzung und keine Ziffer steht: „am 15. August" und
  // „Dr. Ing. Doll" sind keine Satzenden.
  const ende = w.match(/^([\s\S]{10,}?[.!?…])\s+[A-ZÄÖÜ]/);
  if (ende && !/(?:\d|\b(?:Dr|Prof|Ing|Dipl|Nr|St|ca|bzw|usw|evtl|Abs|Art|Jh|Mio|Mrd|Bd|Hrsg|geb|gest|verh|u|z|B))\.$/.test(ende[1]!)) {
    w = ende[1]!;
  }
  // Ein Semikolon trennt zwei gleichrangige Aussagen — die zweite fällt weg.
  const semi = w.indexOf(";");
  if (semi > 12) w = w.slice(0, semi);
  w = w.replace(/[\s,;:–—-]+$/, "").replace(/[.!?…]+$/, "").trim();
  // Was schon abgeschnitten im Vorrat liegt, wird hier noch gerettet: am
  // letzten Komma kürzen, statt einen halben Satz zu setzen.
  return kuerzeAmBruch(w);
}

/** Die Kurzform einer Person.
 *
 *  Vorher: das LETZTE WORT. Bei „Dr. Ing. Richard Doll" ist das der Nachname
 *  und richtig. Bei „das Register aller falschen Namen" wurde daraus „Namen",
 *  und in Nr. 44 stand: „…die Entscheidung, über die das Namen nun informiert."
 *
 *  Das letzte Wort taugt nur als Nachname, wenn davor kein Artikel steht und
 *  die Angabe kurz ist. Sonst bleibt die volle Form stehen — sie ist länger,
 *  aber sie stimmt. */
export function kurzPerson(werRoh: string): string {
  // Titel zählen nicht mit: „Dr. Ing. Richard Doll" sind vier Wörter, aber nur
  // zwei davon sind der Name.
  const w = (werRoh || "").trim().split(/\s+/).filter(Boolean)
    .filter((x) => !/^(Dr\.|Prof\.|Ing\.|Dipl\.-?\w*\.?|med\.|jur\.|rer\.|nat\.|h\.c\.|Sir|Lady|Herr|Frau)$/i.test(x));
  if (!w.length) return werRoh;
  const hatBegleiter = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|meine|sein|seine|ihr|ihre|unser|unsere|kein|keine|jeder|jede|jedes|dieser|diese|dieses)$/i.test(w[0]!);
  const letztes = w[w.length - 1]!;
  if (hatBegleiter || w.length > 3 || !/^[A-ZÄÖÜ]/.test(letztes)) return werRoh.trim();
  return letztes;
}

/** Der Ort für die DACHZEILE — eine Zeile, kein Satz.
 *
 *  Vorher stand hier nur „Präposition weg, bestimmten Artikel weg". In Nr. 44
 *  ergab das eine Dachzeile über vier Zeilen in Versalien:
 *  „EINER STRASSE, DIE ZWEIMAL EXISTIERT, WO DIE STRASSEN KEINE NAMEN TRAGEN".
 *  Zwei Fehler: der Dativ „einer" statt des Nominativs, und keine Grenze.
 *
 *  Jetzt fällt auch der unbestimmte Artikel weg, alles hinter dem ersten Komma
 *  und ein angehängter Relativsatz. Bleibt etwas zu Langes übrig, gibt es
 *  KEINEN Ort — die Dachzeile trägt dann nur das Ressort. Lieber weniger als
 *  falsch. */
export function dachOrt(roh: string): string {
  let o = (roh || "").trim();
  // Führende Umstandswörter zuerst: „hoch in der Luft" ergab sonst „Hoch in".
  o = o.replace(/^(hoch|tief|weit|mitten|ganz|dicht|nahe|irgendwo|weit draußen|draußen|drinnen|oben|unten|dort|hier)\s+/i, "");
  o = o.replace(/^(in|an|auf|bei|im|am|vor|über|unter|zu|zur|zum)\s+/i, "")
    .replace(/^(der|die|das|dem|den|des|ein|eine|einen|einem|einer|eines)\s+/i, "")
    .trim();
  o = (o.split(",")[0] || "").trim();
  // NUR an eindeutigen Marken kappen. Die erste Fassung schnitt auch an einem
  // bloßen „der" — und aus „hoch in der Luft" wurde „Hoch in".
  o = o.replace(/\s+(wo|worin|woran|worauf|welche[rs]?)\s+.*$/i, "").trim();
  o = o.replace(/[.,;:!?…]+$/, "").trim();
  if (!o || o.length > 28) return "";
  return o.charAt(0).toUpperCase() + o.slice(1);
}

function istGattungsperson(haupt: string): boolean {
  const w = haupt.trim().replace(/[^A-Za-zÄÖÜäöüß\s-]/g, "").split(/\s+/).filter(Boolean);
  const letztes = w[w.length - 1] || "";
  if (!letztes || !/^[A-ZÄÖÜ]/.test(letztes)) return false;
  return PERSON_NOMEN.test(letztes);
}

function istPerson(haupt: string): boolean {
  let w = haupt.trim().split(/\s+/);
  // Zuerst die Gattung: „ein Schulmädchen" beginnt mit einem Artikel und wäre
  // sonst gleich am nächsten Prüfschritt gescheitert.
  if (istGattungsperson(haupt)) return true;
  if (/^(der|die|das|ein|eine)$/i.test(w[0] || "")) return false;
  // Titel abziehen: "Dr. Ing. Richard Doll" sind vier Woerter, davon zwei Titel.
  // Ohne das galt der Name als Einrichtung, und im Text stand "der Doll".
  const mitTitel = w.length;
  w = w.filter((x) => !TITEL.test(x.replace(/[^A-Za-z.]/g, "")));
  // "Prof. Schwarz" bleibt nach dem Abzug EIN Wort. Wer einen Titel traegt, ist
  // eine Person - auch ohne Vornamen. Ohne diese Zeile stand "Der Schwarz
  // besteht seit 1894".
  if (w.length === 1 && mitTitel > w.length) return /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(w[0]!);
  if (w.length !== 2) return false;
  if (RECHTSFORM.test(w[1]!.replace(/[^A-Za-z.]/g, ""))) return false;
  if (/^(FC|SV|TSV|SC|VfB|VfL|BSC|1\.)$/i.test(w[0]!)) return false;
  return w.every((x) => /^[A-ZÄÖÜ][a-zäöüß-]+$/.test(x));
}

/** Zeitangabe satzfaehig machen: "Frühjahr 2001" ist keine Adverbiale, "Im
 *  Frühjahr 2001" schon. Steht schon eine Praeposition davor, bleibt alles. */
/** Zeitadverbien und Zeitwörter, die schon für sich eine Angabe SIND. Ohne
 *  diese Liste stand im Blatt „Im lange vor den Namen" und „Im Mittags,
 *  Frühsommer": Die Regel setzte blind ein „im" davor. */
// „tagsüber" fehlte: Der Bildvorrat liefert Zeitangaben wie „tagsüber bei
// teilweise bewölktem Himmel", und daraus wurde „Im tagsüber bei teilweise
// bewölktem Himmel" (Ausgabe Nr. 44).
const ZEIT_ADVERB = /^(lange|kurz|damals|einst|früher|später|gestern|heute|morgen|neulich|jüngst|mittags|morgens|abends|nachts|vormittags|nachmittags|tagsüber|nachtsüber|wochentags|werktags|sonntags|samstags|jahrelang|tagelang|monatelang|irgendwann|niemals|immer|jederzeit|zuletzt|zuerst|anfangs|schließlich|inzwischen|unterdessen|seither|seitdem|dereinst|derzeit|momentan|gerade|eben|bald|demnächst|künftig|abermals)\b/i;

function mitPraeposition(wann: string): string {
  const w = (wann || "").trim();
  if (!w) return "";
  if (/^(am|im|um|an|in|zu|seit|vor|nach|gegen|während|zwischen|beim|bis|ab)\b/i.test(w)) return w;
  if (/^\d{4}$/.test(w)) return w;                       // reine Jahreszahl steht allein
  if (ZEIT_ADVERB.test(w)) return w;                      // „lange vor den Namen" trägt sich selbst
  // Eine Angabe mit Komma trägt einen Nebensatz oder eine Aufzählung; ein
  // vorangestelltes „im" passt dann auf keinen der Teile.
  if (w.includes(",")) return w;
  // NICHT kleinschreiben: "Frühjahr" ist ein Nomen. Der erste Versuch machte
  // daraus "Im frühjahr 2001".
  return "im " + w;
}

/** Eine Angabe, die einen Nebensatz enthält, braucht vor dem folgenden
 *  Satzteil ein Komma: „In der Stunde, die nicht gezählt wird, wurde bekannt …"
 *  Ohne es lief der Nebensatz in den Hauptsatz. */
export function mitAbschlusskomma(angabe: string): string {
  const a = (angabe || "").trim();
  if (!a || !a.includes(",")) return a;
  return a.replace(/[,\s]+$/, "") + ",";
}

export function ziehFaktenblatt(input: GenInput, ressortWahl: RessortId | "auto" = "auto"): Faktenblatt {
  // Ein Bericht wächst durch BELEGE, nicht durch Bilder. Gemessen lieferte er
  // bei Ziel 600 nur 186 Wörter (31 %) — weniger als bei Ziel 220 —, weil
  // `mische()` die freien Sätze auf die Zahl der Faktensätze deckelt und die
  // Fakten fest waren. Der Deckel bleibt; die Fakten wachsen.
  const zielWorte = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 220;
  const mehr = Math.max(0, Math.min(3, Math.floor((zielWorte - 200) / 120)));
  // Ressort zuerst: Es bestimmt Rollen, Einheiten und den Zusatzabschnitt.
  const ressort = ressortWahl === "auto"
    ? rateRessort([input.who, input.what, input.where].filter(Boolean).join(" "))
    : ressortWahl;
  const R = RESSORTS[ressort];
  const gutesLicht = /^(uplifting|humorous|zaertlich)$/i.test(input.tone || "");
  const werRoh = (normWho(input.who || "").split(",")[0] || "").trim() || WER_ERSATZ;
  const person = istPerson(werRoh);
  const genus = person ? "mask" : genusVon(werRoh);
  // Auch den Artikel: "an der Unterelbe" ergab sonst die Dachzeile
  // "der Unterelbe · Wetter".
  // KEIN Platzhalter mehr. „am Ort" stand zweimal im Blatt (Nr. 44): „Am 15.
  // August 2026 ist am Ort bekannt geworden". Der Sammler lässt das Wo oft leer
  // — bei „Was geschah am …" gibt es meist keinen Ort. Eine Meldung ohne Ort
  // soll ihn WEGLASSEN, nicht behaupten. Die beiden Stellen, die das Feld
  // benutzen, fragen vorher (`ortTauglich`).
  const ortMitPraep = (normWhere(input.where || "") || "").trim();
  const ort = dachOrt(normWhere(input.where || "") || "");
  const wann = (normWhen(input.when || "") || "").trim();

  // Personen: eine weiblich, eine männlich — so ist die Kongruenz in den Zitaten
  // an beiden Fällen geprüft und nicht nur an einem.
  const nachnamen = [...NACHNAME];
  const zieheNach = (): string => nachnamen.splice(Math.floor(Math.random() * nachnamen.length), 1)[0]!;
  const n1 = zieheNach(), n2 = zieheNach();
  // Rollen aus dem Ressort: "Geschäftsführerin" passt nicht ins Feuilleton.
  const personen: FbPerson[] = [
    { id: "p1", name: `${pick(VORNAME_F)} ${n1}`, kurz: n1, rolle: pick(R.rollenF.length ? R.rollenF : ROLLE_F), genus: "fem", zitierfaehig: true },
    { id: "p2", name: `${pick(VORNAME_M)} ${n2}`, kurz: n2, rolle: pick(R.rollenM.length ? R.rollenM : ROLLE_M), genus: "mask", zitierfaehig: true },
  ];
  // Eine dritte Stimme erst bei langen Berichten — in einem kurzen wäre sie
  // Ballast, in einem langen fehlt sie.
  if (zielWorte >= 380) {
    const n3 = zieheNach();
    personen.push({ id: "p3", name: `${pick(VORNAME_F)} ${n3}`, kurz: n3,
      rolle: pick(R.rollenF.length ? R.rollenF : ROLLE_F), genus: "fem", zitierfaehig: true });
  }

  // Zahlen: zwei bis drei, jede Einheit höchstens einmal.
  // Allgemeine Einheiten nur fuer Rollen, die das Ressort NICHT abdeckt. Sonst
  // gewinnen sie oft: Im Wetterbericht stand "Gemessen wurden 40 Meter" und
  // "Es geht um 80 Millionen Euro", obwohl das Ressort eigene Groessen hat.
  const eigeneRollen = new Set(R.einheiten.map((e) => e.rolle));
  const einheiten: EinheitDef[] = [...R.einheiten, ...EINHEIT.filter((e) => !eigeneRollen.has(e.rolle))];
  const zahlen: FbZahl[] = [];
  const wieViele = 2 + Math.floor(Math.random() * 2) + mehr;
  // z1 muss eine Einheit sein, von der man "betroffen" sagen kann - der Vorspann
  // und der abgeleitete Wert bauen darauf auf.
  // z1 ist immer eine Betroffenen-Zahl - der Vorspann baut darauf auf. Danach je
  // Rolle hoechstens eine: Zwei Dauerangaben in einem Bericht widersprechen sich
  // eher, als dass sie etwas hinzufuegen.
  const rollenDrin = new Set<ZahlRolle>();
  const genitivPlural: string[] = [];
  // Der Gegenstand aus „Was passiert?" hat Vorrang vor den allgemeinen Einheiten.
  const sache = sachNomen(input.what || "");
  if (sache) einheiten.unshift({ einheit: sache, rolle: "sache", min: 50, max: 9000, rund: 10 });
  for (let i = 0; i < wieViele && einheiten.length; i++) {
    // Die Betroffenen kommen aus dem Ressort, wenn es welche hat. Sonst stand in
    // einem Sportbericht "910 Haushalte betroffen" - die allgemeine Liste
    // gewann, weil sie mit im Topf lag.
    const eigeneBetroffen = R.einheiten.filter((e) => e.rolle === "betroffene" && einheiten.includes(e));
    const quelle = i === 0
      ? (eigeneBetroffen.length ? eigeneBetroffen : einheiten.filter((e) => e.rolle === "betroffene"))
      : i === 1 && sache
        ? einheiten.filter((e) => e.rolle === "sache")       // gleich nach den Betroffenen
        : einheiten.filter((e) => !rollenDrin.has(e.rolle));
    if (!quelle.length) break;
    const gewaehlt = quelle[Math.floor(Math.random() * quelle.length)]!;
    const e = einheiten.splice(einheiten.indexOf(gewaehlt), 1)[0]!;
    rollenDrin.add(e.rolle);
    genitivPlural.push(e.gen || e.einheit);
    const wert = zahlIn(e.min, e.max, e.rund);
    zahlen.push({
      id: `z${i + 1}`, wert, einheit: e.einheit, wortform: zahlwort(wert), rolle: e.rolle,
      kastenLabel: e.label,
      // "rund" nur, wenn das Runden auch etwas aendert - "rund 1.150" fuer 1150
      // ist keine Rundung, sondern eine Behauptung.
      verbal: rundWort(wert),
    });
  }

  // Abgeleitet: gerechnet, nicht gezogen. Genau dafür ist das Feld da.
  // Nur ableiten, wenn die Rechnung aufgeht. "Die Hälfte der 655 Arbeitsplätze —
  // 328" stimmt nicht: 655 ist ungerade, und ein Bericht, der rundet, ohne es zu
  // sagen, ist genau der Fehler, den das Faktenblatt verhindern soll.
  // Erst ab 40. "Betroffen ist damit die Haelfte der Zulieferer - 3" ist bei
  // sechs Zulieferern keine Information, sondern eine Rechnung, die niemand
  // gebraucht hat. Gerade muss der Wert weiterhin sein, sonst rundet der Bericht
  // stillschweigend.
  const abgeleitet: FbAbgeleitet[] = zahlen.length && zahlen[0]!.wert >= 40 && zahlen[0]!.wert % 2 === 0
    ? [{ id: "a1", formel: "z1 * 0.5", wortform: zahlwort(zahlen[0]!.wert / 2), label: `die Hälfte der ${genitivPlural[0] || zahlen[0]!.einheit}` }]
    : [];

  // Chronologie: nach Konstruktion monoton — c1 liegt vor c2 liegt vor c3.
  // Der Anfang muss VOR dem Ereignis liegen. Vorher wurde er blind aus 1890 bis
  // 2000 gezogen: Bei der Eingabe "im Jahr 1855" stand im Bericht "Im Jahr 1855
  // folgte der Schritt" und zwei Absaetze weiter "ist seit 1971 dabei" - die
  // Chronologie war der Konstruktion nach monoton und den Zahlen nach verdreht.
  const ereignisJahr = Number((wann.match(/\b(1[0-9]{3}|20[0-9]{2}|2[1-9][0-9]{2})\b/) || [])[1]);
  const bezug = Number.isFinite(ereignisJahr) ? ereignisJahr : 2000;
  // Bei einer Person ist der "Anfang" der Beginn ihrer Laufbahn, nicht die
  // Gruendung eines Hauses: 83 Jahre vor dem Ereignis waere sie beim Ereignis
  // ueber hundert. Deshalb eine kurze Spanne.
  const spanne = person ? 4 + Math.floor(Math.random() * 34) : 12 + Math.floor(Math.random() * 110);
  const jahr = Math.max(1200, bezug - spanne);
  // Die Vorgeschichte kommt aus dem Ressort, wenn es eine hat — sonst stand
  // im Wetterbericht „die erste Beschwerde" (108 von 108 gemessenen Läufen).
  const vg = R.vorgeschichte;
  const vorgeschichteWas = gutesLicht ? (vg?.gut || VORGESCHICHTE_GUT) : (vg?.sachlich || VORGESCHICHTE_SACHLICH);
  const chronologie: FbChrono[] = [
    { id: "c1", zeit: String(jahr), was: vg?.anfang || "der Anfang" },
    // Auch die Chronologie kennt die Blickrichtung: Im Faktenkasten stand sonst
    // "die erste Meldung", waehrend im Text "die erste Zusage" lief.
    // FRÜHER FEST: „im Frühjahr" und „die erste Meldung". Damit stand in jedem
    // Bericht und in jeder Meldung derselbe Satz — in einer Ausgabe mit acht
    // Beiträgen viermal wörtlich. Das war der auffälligste Wiederholungsbefund
    // des ganzen Blattes und kein Fehler des Generators, sondern eine
    // Konstante an der falschen Stelle.
    { id: "c2", zeit: pick(VORGESCHICHTE_ZEIT), was: pick(vorgeschichteWas) },
    // Dieselbe Form wie im Vorspann, sonst steht dort "Im Frühjahr 2001" und
    // im Hergang "Frühjahr 2001 folgte der Schritt".
    { id: "c3", zeit: mitPraeposition(wann) || pick(ZEITPUNKT), was: (input.what || "das Ereignis").trim() },
  ];
  // Zwischenschritte für lange Berichte. Sie stehen ZWISCHEN Anfang und
  // Ereignis, tragen also keine eigene Jahreszahl — sonst müsste die
  // Reihenfolge der Jahre gerechnet werden, und der Prüfstand meldet
  // „Jahreszahlen verdreht", sobald sie einmal nicht aufgeht.
  {
    const gemischt = (a: string[]): string[] => a.slice().sort(() => Math.random() - 0.5);
    const zeiten = gemischt(VORGESCHICHTE_ZEIT).filter((z: string) => z !== chronologie[1]!.zeit);
    const sachen = gemischt(vorgeschichteWas)
      .filter((x: string) => x !== chronologie[1]!.was);
    for (let i = 0; i < mehr && i < zeiten.length && i < sachen.length; i++) {
      chronologie.splice(2 + i, 0, { id: `c${4 + i}`, zeit: zeiten[i]!, was: sachen[i]! });
    }
  }

  return {
    id: "fb-" + Date.now().toString(36),
    ressort,
    wer: person
      // Die Kurzform einer Person ist ihr Nachname — „Doll ist seit 1984
      // dabei". Eine GATTUNGSperson hat aber keinen: „Schulmädchen ist seit
      // 1984 dabei" fehlt der Artikel. Sie behält deshalb ihre volle Form mit
      // bestimmtem Artikel.
      ? istGattungsperson(werRoh)
        ? { haupt: werRoh, kurz: werRoh.replace(/^(ein|eine|einer|einem)\s+/i, (m) => (/^eine\s/i.test(m) ? "die " : "das ")), genus, art: "person" as const }
        : { haupt: werRoh, kurz: kurzPerson(werRoh), genus, art: "person" as const }
      : { haupt: werRoh, kurz: kurzform(werRoh, genus), genus, art: "organisation" },
    was: formeWas(input.what || "") || "meldet einen Vorfall",
    // Zwei Formen: `ort` fuer die Dachzeile ("Unterelbe · Wetter"), `mitPraep`
    // fuer den Satz. Ohne die zweite stand "Wie es in Unterelbe weitergeht" -
    // es heisst "an der Unterelbe".
    wo: { ort, mitPraep: ortMitPraep },
    wann: { datum: mitPraeposition(wann) || pick(ZEITPUNKT), relativ: pick(RELATIV) },
    personen, zahlen, abgeleitet, chronologie,
    fiktion: true,
  };
}

/** Alle Zahlwörter, die im Text vorkommen DÜRFEN — für die Konsistenzprüfung. */
export function erlaubteZahlen(fb: Faktenblatt): string[] {
  const out = [...fb.zahlen.map((z) => z.wortform), ...fb.abgeleitet.map((a) => a.wortform)];
  for (const z of fb.zahlen) if (z.verbal) out.push(z.verbal.replace(/^rund\s+/, ""));
  // Jede Ziffernfolge, die IRGENDWO im Faktenblatt steht, ist erlaubt - auch die
  // in einer Zeitangabe. Die erste Fassung liess nur reine Jahreszahlen aus der
  // Chronologie zu und meldete bei der Eingabe "im Jahr 2100" jede Nennung als
  // erfundene Zahl: 459 Funde in 153 Berichten, alle falsch.
  for (const treffer of JSON.stringify(fb).match(/\d[\d.,]*/g) || []) {
    out.push(treffer.replace(/[.,]+$/, ""));
  }
  return out;
}

/** Alle Eigennamen, die vorkommen dürfen. */
export function erlaubteNamen(fb: Faktenblatt): string[] {
  const out: string[] = [fb.wo.ort];
  for (const p of fb.personen) { out.push(p.name, p.kurz, ...p.name.split(/\s+/)); }
  out.push(...fb.wer.haupt.split(/\s+/).filter((w) => /^[A-ZÄÖÜ]/.test(w)));
  return out.filter(Boolean);
}
