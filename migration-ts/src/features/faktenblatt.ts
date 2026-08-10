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
import { pick } from "../text-utils";
import { normWhere, normWhen, normWho } from "../generation/ctxnorm";
import { guessGender } from "../generation/declension";
import { RESSORTS, rateRessort, type RessortId } from "./ressorts";

export type Genus = "mask" | "fem" | "neut";

export interface FbPerson {
  id: string; name: string; kurz: string; rolle: string; genus: Genus; zitierfaehig: boolean;
}
export interface FbZahl {
  id: string; wert: number; einheit: string; wortform: string; verbal?: string; rolle: ZahlRolle;
}
export interface FbAbgeleitet {
  id: string; formel: string; wortform: string; label: string;
}
export interface FbChrono { id: string; zeit: string; was: string; }

export interface Faktenblatt {
  id: string;
  ressort: RessortId;
  wer: { haupt: string; kurz: string; genus: Genus; art: string };
  was: string;
  wo: { ort: string };
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
interface EinheitDef { einheit: string; rolle: ZahlRolle; min: number; max: number; rund: number; gen?: string; }

const EINHEIT: EinheitDef[] = [
  { einheit: "Beschäftigte", rolle: "betroffene", min: 40, max: 900, rund: 10, gen: "Beschäftigten" },
  { einheit: "Haushalte", rolle: "betroffene", min: 20, max: 1200, rund: 10 },
  { einheit: "Anwohner", rolle: "betroffene", min: 30, max: 2000, rund: 10 },
  { einheit: "Arbeitsplätze", rolle: "betroffene", min: 15, max: 700, rund: 5 },
  { einheit: "Stunden", rolle: "dauer", min: 2, max: 72, rund: 1 },
  { einheit: "Tage", rolle: "dauer", min: 2, max: 40, rund: 1 },
  { einheit: "Meter", rolle: "groesse", min: 8, max: 400, rund: 1 },
  { einheit: "Quadratmeter", rolle: "groesse", min: 200, max: 40000, rund: 100 },
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
const PLURAL_ENDUNG = /(ern|en|er|e)$/;   // "Opern" endet auf -ern und fiel sonst durch
const KEIN_SACHNOMEN = /^(Jahr|Jahre|Monat|Monate|Tag|Tage|Woche|Wochen|Stunde|Stunden|Mal|Uhr|Zeit|Welt|Leben|Anfang|Nacht|Morgen|Abend|Ende|Reihe|Farbe|Sprache|Straße|Grenze|Klasse|Frage|Stelle|Weise|Seite|Liebe|Sorge|Ruhe|Stille|Ferne|Nähe|Fenster|Wasser|Feuer|Zimmer|Wetter|Messer|Muster|Ufer|Alter|Fieber|Wunder|Zeichen|Wesen)$/;

export function sachNomen(was: string): string | null {
  const kandidaten = (was || "").match(/[A-ZÄÖÜ][a-zäöüß]{3,}/g) || [];
  for (let i = kandidaten.length - 1; i >= 0; i--) {
    const w = kandidaten[i]!;
    if (KEIN_SACHNOMEN.test(w)) continue;
    if (!PLURAL_ENDUNG.test(w)) continue;
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

export function ziehFaktenblatt(input: GenInput, ressortWahl: RessortId | "auto" = "auto"): Faktenblatt {
  // Ressort zuerst: Es bestimmt Rollen, Einheiten und den Zusatzabschnitt.
  const ressort = ressortWahl === "auto"
    ? rateRessort([input.who, input.what, input.where].filter(Boolean).join(" "))
    : ressortWahl;
  const R = RESSORTS[ressort];
  const werRoh = (normWho(input.who || "").split(",")[0] || "").trim() || "eine Einrichtung";
  const genus = genusVon(werRoh);
  const ort = (normWhere(input.where || "") || "").replace(/^(in|an|auf|bei|im|am)\s+/i, "").trim() || "der Ort";
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

  // Zahlen: zwei bis drei, jede Einheit höchstens einmal.
  const einheiten: EinheitDef[] = [...R.einheiten, ...EINHEIT];
  const zahlen: FbZahl[] = [];
  const wieViele = 2 + Math.floor(Math.random() * 2);
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
    const quelle = i === 0
      ? einheiten.filter((e) => e.rolle === "betroffene")
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
      // "rund" nur, wenn das Runden auch etwas aendert - "rund 1.150" fuer 1150
      // ist keine Rundung, sondern eine Behauptung.
      verbal: rundWort(wert),
    });
  }

  // Abgeleitet: gerechnet, nicht gezogen. Genau dafür ist das Feld da.
  // Nur ableiten, wenn die Rechnung aufgeht. "Die Hälfte der 655 Arbeitsplätze —
  // 328" stimmt nicht: 655 ist ungerade, und ein Bericht, der rundet, ohne es zu
  // sagen, ist genau der Fehler, den das Faktenblatt verhindern soll.
  const abgeleitet: FbAbgeleitet[] = zahlen.length && zahlen[0]!.wert % 2 === 0
    ? [{ id: "a1", formel: "z1 * 0.5", wortform: zahlwort(zahlen[0]!.wert / 2), label: `die Hälfte der ${genitivPlural[0] || zahlen[0]!.einheit}` }]
    : [];

  // Chronologie: nach Konstruktion monoton — c1 liegt vor c2 liegt vor c3.
  const jahr = 1890 + Math.floor(Math.random() * 110);
  const chronologie: FbChrono[] = [
    { id: "c1", zeit: String(jahr), was: "der Anfang" },
    { id: "c2", zeit: "im Frühjahr", was: "die erste Meldung" },
    { id: "c3", zeit: wann || pick(ZEITPUNKT), was: (input.what || "das Ereignis").trim() },
  ];

  return {
    id: "fb-" + Date.now().toString(36),
    ressort,
    wer: { haupt: werRoh, kurz: kurzform(werRoh, genus), genus, art: "organisation" },
    was: (input.what || "meldet einen Vorfall").trim().replace(/[.!?…]+$/, ""),
    wo: { ort },
    wann: { datum: wann || pick(ZEITPUNKT), relativ: pick(RELATIV) },
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
