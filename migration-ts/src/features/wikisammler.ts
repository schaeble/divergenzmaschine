// Sammler: holt den Tagesfeed der deutschen Wikipedia (Artikel des Tages,
// „Was geschah am …“, In den Nachrichten) und zerlegt ihn in 4W-Vorschläge.
//
// Zwei Grundsätze, die hier alles bestimmen:
//
// 1. Die Zuordnung Person/Ort läuft über die STRUKTURDATEN des Feeds
//    (`coordinates`, `description`, das Sternchen im Extrakt), NICHT über
//    Großschreibung. Im Deutschen ist jedes Nomen groß — als Personen- oder
//    Eigennamenmerkmal taugt das nicht.
// 2. Was nicht sicher bestimmbar ist, bleibt LEER. Ein leeres Feld lässt beim
//    Übernehmen den Studio-Wert stehen; ein falsch gefülltes Feld setzt einen
//    Ort ins „Wer?“ und verdirbt den ganzen Text.
//
// Reine Zerlegung (`zerlegeFeed`) und Netzabruf (`holeTagesfeed`) sind getrennt,
// damit der Prüfstand ohne Netz gegen feste Beispieldaten laufen kann.

import { guessGender } from "../generation/declension";
import { kuerzeAmBruch } from "../text-utils";
import { safeSet } from "./storage-status";

/** Ein Fund: eine Karte im Sammler, fertig für die Übernahme ins Studio. */
export interface WikiFund {
  quelle: "tfa" | "jahrestag" | "nachricht";
  quelleLabel: string;
  /** Kopfzeile der Karte. */
  titel: string;
  /** Belegstelle: Ereignissatz bzw. Anfang des Artikels. Gekürzt, damit die
   *  Karte lesbar bleibt. */
  text: string;
  /** Der ungekürzte Text für den Korpus.
   *
   *  Getrennt vom Angezeigten, weil beide verschiedene Aufgaben haben: Die
   *  Karte soll überschaubar sein, der Korpus will Masse. Vorher gab es nur
   *  `text`, auf 260 Zeichen gekappt — und die Kappung war für das
   *  Was-Feld gedacht, nicht für Sprachmaterial. Rund die Hälfte jeder
   *  Zusammenfassung fiel dadurch weg, ohne dass es einen Grund gab. */
  volltext: string;
  /** Link auf den Artikel (falls vorhanden). */
  url: string;
  /** Die vier W. Leere Zeichenketten bedeuten: nicht sicher bestimmbar. */
  ctx: { who: string; what: string; when: string; where: string };
}

/** Ausschnitt aus der Wikimedia-Zusammenfassung — nur, was hier gebraucht wird.
 *  Alles optional: Der Feed liefert je nach Artikel unterschiedlich viel. */
export interface WikiSeite {
  titles?: { normalized?: string; canonical?: string; display?: string };
  title?: string;
  description?: string;
  extract?: string;
  coordinates?: { lat?: number; lon?: number };
  content_urls?: { desktop?: { page?: string } };
}
interface WikiEreignis { text?: string; year?: number; pages?: WikiSeite[] }
interface WikiNachricht { story?: string; links?: WikiSeite[] }
interface WikiFeed { tfa?: WikiSeite; onthisday?: WikiEreignis[]; news?: WikiNachricht[] }

export interface QuellenWahl { tfa: boolean; jahrestage: boolean; nachrichten: boolean }

const MONATE = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli",
  "August", "September", "Oktober", "November", "Dezember"];

// ── Erkennung ───────────────────────────────────────────────────────────────

/** Ortsbegriffe in der Kurzbeschreibung. Mit Wortgrenzen, damit „Land“ auf
 *  „Land in Europa“ trifft, aber nicht auf „Deutschland“. */
const ORT_WORT = /\b(stadt|städtchen|gemeinde|ortschaft|ortsteil|dorf|hauptstadt|siedlung|insel|inselgruppe|halbinsel|berg|gebirge|gipfel|vulkan|fluss|strom|bach|see|meer|ozean|bucht|fjord|tal|wüste|wald|land|staat|bundesstaat|bundesland|königreich|kaiserreich|region|provinz|bezirk|kanton|landkreis|departement|präfektur|nationalpark|naturschutzgebiet|burg|schloss|festung|kloster|kirche|kathedrale|dom|moschee|tempel|brücke|bahnhof|flughafen|hafen|museum|theater|stadion|straße|platz|denkmal|turm|leuchtturm)\b/i;

/** Personenbegriffe. Bewusst eine Liste statt einer Endungsregel: „-er“ träfe
 *  sonst „Bundesstaat der Vereinigten Staaten von Amerika“ so gut wie „Maler“. */
const PERSON_WORT = /\b(schriftsteller|dichter|autor|lyriker|dramatiker|essayist|maler|zeichner|bildhauer|künstler|komponist|musiker|sänger|dirigent|pianist|geiger|schauspieler|regisseur|tänzer|choreograf|politiker|staatsmann|kanzler|präsident|minister|senator|abgeordneter|bürgermeister|gouverneur|diplomat|botschafter|könig|königin|kaiser|zar|schah|sultan|pharao|fürst|herzog|graf|gräfin|baron|ritter|adliger|adelige|papst|kardinal|bischof|erzbischof|abt|äbtissin|priester|pfarrer|rabbiner|imam|mönch|nonne|missionar|theologe|philosoph|historiker|physiker|chemiker|biologe|mathematiker|astronom|geologe|mediziner|arzt|ärztin|psychologe|soziologe|ökonom|jurist|richter|anwalt|ingenieur|architekt|erfinder|entdecker|forscher|seefahrer|pilot|astronaut|soldat|general|feldherr|admiral|offizier|widerstandskämpfer|revolutionär|aktivist|gewerkschafter|unternehmer|bankier|verleger|journalist|reporter|fotograf|designer|sportler|fußballspieler|handballspieler|basketballspieler|tennisspieler|schachspieler|spieler|trainer|läufer|schwimmer|radrennfahrer|skirennläufer|boxer|ringer|turner|pädagoge|lehrer|professor|gelehrter|übersetzer|linguist|archäologe|ethnologe|geograf|heiliger|heilige|märtyrer|hochstapler|räuber|pirat)(in|innen|s|n|en)?\b/i;

/** Das Sternchen im Extrakt ist das verlässlichste Personenmerkmal der
 *  deutschen Wikipedia: „Name (* 28. August 1749 in Frankfurt …)“. */
const GEBURT = /\(\s*\*\s*\d|\(\s*\*\s*[a-zäöü]|\bgeboren am\b|†\s*\d/i;

const txt = (s: string | undefined): string => (s || "").trim();

/** Titel einer Seite in der Anzeigeform, ohne Unterstriche. */
export function seitenTitel(s: WikiSeite | undefined): string {
  if (!s) return "";
  return txt(s.titles?.normalized) || txt(s.title) || txt(s.titles?.canonical).replace(/_/g, " ");
}
/** „Bach (Komponist)“ → „Bach“. Der Klammerzusatz ist Wikipedia-Verwaltung. */
export function ohneKlammer(t: string): string {
  return t.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

/** Ist die Seite ein Ort? Koordinaten sind der harte Beleg, die Beschreibung
 *  der weiche. */
export function istOrt(s: WikiSeite | undefined): boolean {
  if (!s) return false;
  if (s.coordinates && typeof s.coordinates.lat === "number") return true;
  return ORT_WORT.test(txt(s.description));
}
/** Ist die Seite eine Person? Orte werden zuerst ausgeschlossen — sonst macht
 *  „Bischofssitz in Bayern“ aus einer Stadt einen Bischof. */
export function istPerson(s: WikiSeite | undefined): boolean {
  if (!s) return false;
  if (istOrt(s)) return false;
  const ex = txt(s.extract);
  if (GEBURT.test(ex)) return true;
  if (PERSON_WORT.test(txt(s.description))) return true;
  // „… war eine französische Malerin.“ — nur im Artikelanfang, sonst trifft
  // irgendein Nebensatz weit hinten.
  if (/\b(war|ist)\s+(ein|eine)\b/i.test(ex.slice(0, 240)) && PERSON_WORT.test(ex.slice(0, 240))) return true;
  return false;
}

// ── Phrasenbau: die vier W in der Form, die das Studio erwartet ─────────────

/** Länder, die im Deutschen einen Artikel verlangen. Der Wikipedia-Titel
 *  lautet „Schweiz“, nicht „die Schweiz“ — ohne diese Liste entstünde „in
 *  Schweiz“. */
const LAND_ARTIKEL: Record<string, "m" | "f" | "pl"> = {
  schweiz: "f", türkei: "f", ukraine: "f", slowakei: "f", mongolei: "f",
  elfenbeinküste: "f", westsahara: "f", antarktis: "f", arktis: "f", krim: "f",
  iran: "m", irak: "m", jemen: "m", libanon: "m", sudan: "m", südsudan: "m",
  tschad: "m", kongo: "m", niger: "m", senegal: "m", kosovo: "m", balkan: "m",
  niederlande: "pl", usa: "pl", "vereinigte staaten": "pl", philippinen: "pl",
  malediven: "pl", bahamas: "pl", komoren: "pl", seychellen: "pl",
  salomonen: "pl", färöer: "pl", "vereinigte arabische emirate": "pl",
};

// Welche Art von Ort? Die Präposition hängt daran, nicht am Namen.
const SIEDLUNG = /\b(stadt|städtchen|gemeinde|ortschaft|ortsteil|dorf|hauptstadt|siedlung|bezirk|region|provinz|kanton|landkreis|departement|präfektur|bundesstaat|bundesland|staat|land|königreich|kaiserreich)\b/;
const INSEL = /\b(insel|halbinsel|inselgruppe|atoll)\b/;
const ERHEBUNG = /\b(berg|gebirge|gipfel|vulkan|massiv)\b/;
const GEWAESSER = /\b(fluss|strom|bach|see|meer|ozean|bucht|fjord|küste|kanal)\b/;
const FLAECHE = /\b(wald|tal|schlucht|wüste|nationalpark|park|steppe|ebene)\b/;
const BAUWERK = /\b(dom|kathedrale|kirche|kapelle|basilika|moschee|synagoge|tempel|burg|schloss|festung|palast|kloster|abtei|turm|leuchtturm|brücke|viadukt|bahnhof|flughafen|hafen|museum|theater|opernhaus|stadion|arena|denkmal|platz|markt|straße)\b/;

/** Ort → fertige Ortsangabe mit Präposition („in Pompeji“, „auf Kreta“,
 *  „im Kölner Dom“). Das Studio bewertet eine Angabe mit Präposition am besten;
 *  einen nackten Ortsnamen muss `normWhere` raten.
 *
 *  Der Artikel wird NUR gesetzt, wenn die Beschreibung ein Bauwerk oder eine
 *  Fläche nennt. Über das Genus des Namens zu gehen wäre eine Falle: „Mailand“
 *  endet auf „-land“ und bekäme sonst „im Mailand“. */
export function ortsPhrase(s: WikiSeite): string {
  const roh = ohneKlammer(seitenTitel(s));
  if (!roh) return "";
  const d = txt(s.description).toLowerCase();

  // Titel mit vorangestelltem Artikel („Die Schweiz“) — selten, aber möglich.
  if (/^(der|die|das|den|dem)\s/i.test(roh)) {
    const teile = roh.split(/\s+/);
    const art = (teile.shift() || "").toLowerCase();
    return art === "die" ? `in der ${teile.join(" ")}` : `im ${teile.join(" ")}`;
  }
  const land = LAND_ARTIKEL[roh.toLowerCase()];
  if (land === "f") return `in der ${roh}`;
  if (land === "m") return `im ${roh}`;
  if (land === "pl") return `in den ${/e$/.test(roh) ? roh + "n" : roh}`;

  if (SIEDLUNG.test(d)) return `in ${roh}`;
  if (INSEL.test(d)) return `auf ${roh}`;
  if (ERHEBUNG.test(d)) return `am ${roh}`;
  if (GEWAESSER.test(d)) return `am ${roh}`;
  if (BAUWERK.test(d) || FLAECHE.test(d)) {
    const kopf = (roh.split(/\s+/).pop() || roh).replace(/[^A-Za-zÄÖÜäöüß]/g, "");
    return guessGender(kopf) === "f" ? `in der ${roh}` : `im ${roh}`;
  }
  return `in ${roh}`;               // Koordinaten ohne kennende Beschreibung
}

/** Jahr + Tagesdatum → „am 24. August 79“ bzw. „im Jahr 79 v. Chr.“.
 *  Beides beginnt mit einer Präposition und wird vom Studio unverändert
 *  übernommen. */
export function zeitPhrase(jahr: number | undefined, d: Date): string {
  const tag = d.getDate(), monat = MONATE[d.getMonth()] || "";
  if (typeof jahr !== "number" || !isFinite(jahr)) return `am ${tag}. ${monat} ${d.getFullYear()}`;
  if (jahr < 0) return `im Jahr ${Math.abs(jahr)} v. Chr.`;
  return `am ${tag}. ${monat} ${jahr}`;
}

/** HTML aus dem Nachrichten-Abschnitt in nackten Text verwandeln. */
export function entHtml(s: string): string {
  return (s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'")
    .replace(/\s+/g, " ").trim();
}

/** Erster Satz — ohne an Ordnungszahlen zu zerbrechen. „(* 28. August 1749“
 *  endet nicht nach „28.“; deshalb darf vor dem Punkt keine Ziffer stehen. */
export function ersterSatz(roh: string): string {
  const s = entHtml(roh);
  const m = s.match(/^[\s\S]*?(?<!\d)[.!?](?=\s+[A-ZÄÖÜ„»(])/);
  return (m ? m[0] : s).trim();
}

/** Ereignistext → „Was passiert?“. Der Schlusspunkt fällt weg (die Felder im
 *  Studio werden ohne Punkt getippt), zu Langes wird am Satzende gekappt. */
export function wasPhrase(roh: string, max = 170): string {
  let t = entHtml(roh);
  t = t.replace(/^\d{1,4}\s*[:–-]\s*/, "");          // „1902: “ am Anfang weg
  t = t.replace(/\s*\(\s*\*[^)]*\)/, "");            // Lebensdaten-Klammer weg
  if (t.length > max) {
    const teil = t.slice(0, max);
    const p = Math.max(teil.lastIndexOf(". "), teil.lastIndexOf("; "));
    // Kein Satzende in Reichweite? Dann am letzten Komma kürzen statt mitten in
    // der Phrase abzubrechen. „… im Dienst deutscher Fürsten wie der." war kein
    // Satz mehr; „… Rochus zu Lynar geboren." ist einer.
    if (p > 40) t = teil.slice(0, p);
    else {
      // Kein Satzende in Reichweite: DAS ENDE FEHLT. Dann am letzten Komma
      // kürzen — dort endet die letzte vollständige Fügung. Vorher wurde
      // mitten in der Phrase abgebrochen: „… im Dienst deutscher Fürsten wie
      // der." war kein Satz mehr, „… Rochus zu Lynar geboren." ist einer.
      const komma = teil.lastIndexOf(",");
      t = komma > 40 ? teil.slice(0, komma) : teil.replace(/\s+\S*$/, "") + " …";
    }
  }
  // Auch ungekürzte Funde können mitten in der Phrase enden — der Feed liefert
  // gelegentlich schon abgeschnittene Auszüge.
  return kuerzeAmBruch(t.replace(/\s*[.]\s*$/, "").trim());
}

// ── Lexikonsätze ────────────────────────────────────────────────────────────
// Wikipedia-Zusammenfassungen beginnen fast alle gleich: „X war ein deutscher
// Politiker", „Y ist eine Gemeinde im Landkreis Z". Als Korpusfutter ist das
// derselbe Fall wie die Bildunterschriften beim Bildsammler — vierzig davon,
// und die Maschine schreibt Lexikon.
//
// Verworfen wird deshalb NICHT: Ein solcher Satz ist nicht falsch, nur
// einförmig, und manchmal will man ihn. Er wird gekennzeichnet und abgewählt
// vorgelegt; entschieden wird von Hand.

const LEXIKON: RegExp[] = [
  /\b(?:war|ist|sind|waren)\s+(?:ein|eine|einer|eines)\b/i,
  /\bist\s+(?:eine\s+)?(?:Gemeinde|Stadt|Ortschaft|Dorf|Insel|Fluss|Berg|Gattung|Art|Familie)\b/i,
  /\bgehört zur? (?:Gattung|Familie|Ordnung|Klasse)\b/i,
  /\bbezeichnet (?:man |eine |einen |ein )/i,
  /\bist der Name\b/i,
  /\b(?:geboren|gestorben)\s+am\b/i,
];

/** Ist der Text vor allem eine Lexikondefinition? Geprüft wird am ANFANG:
 *  Dort steht bei Wikipedia die Definition, und ein Satz weiter unten mit
 *  „war ein" ist gewöhnliche Sprache. */
export function istLexikon(text: string): boolean {
  const anfang = (text || "").trim().slice(0, 160);
  return LEXIKON.some((r) => r.test(anfang));
}

// ── Zerlegung ───────────────────────────────────────────────────────────────

/** Erste Seite der Liste, die die Prüfung besteht. */
function ersteMit(seiten: WikiSeite[] | undefined, pruef: (s: WikiSeite) => boolean): WikiSeite | undefined {
  for (const s of seiten || []) if (pruef(s)) return s;
  return undefined;
}
const seitenUrl = (s: WikiSeite | undefined): string => txt(s?.content_urls?.desktop?.page);

/** Vier W aus einer Seitenliste ziehen: Person → Wer, Ort → Wo. Was nicht
 *  eindeutig ist, bleibt leer. */
function werUndWo(seiten: WikiSeite[] | undefined): { who: string; where: string } {
  const person = ersteMit(seiten, istPerson);
  const ort = ersteMit(seiten, istOrt);
  return {
    who: person ? ohneKlammer(seitenTitel(person)) : "",
    where: ort ? ortsPhrase(ort) : "",
  };
}

/** Der Kern: Feed → Liste von Funden. Rein, ohne Netz, ohne Speicher. */
/** Wie viele Jahrestage übernommen werden.
 *
 *  Vorher vierzehn. Der Feed liefert je nach Tag dreißig bis sechzig, und die
 *  Jahrestage sind die beste Ware darin: kurze, konkrete Ereignissätze mit
 *  Jahreszahl, Ort und Namen — Handlung statt Definition. Genau die Bauteile,
 *  aus denen die Berichte ihre Faktenkästen bauen. */
export const JAHRESTAGE_VORGABE = 40;

export function zerlegeFeed(roh: unknown, datum: Date, wahl: QuellenWahl, maxJahrestage = JAHRESTAGE_VORGABE): WikiFund[] {
  const feed = (roh || {}) as WikiFeed;
  const funde: WikiFund[] = [];

  // 1 · Artikel des Tages
  if (wahl.tfa && feed.tfa) {
    const s = feed.tfa;
    const titel = seitenTitel(s);
    const extrakt = txt(s.extract);
    // Jahr aus dem Extrakt: das erste vierstellige Jahr ist fast immer das
    // Geburts-, Gründungs- oder Ereignisjahr des Gegenstands.
    const jm = extrakt.match(/\b(1[0-9]{3}|20[0-2][0-9])\b/);
    funde.push({
      quelle: "tfa", quelleLabel: "Artikel des Tages",
      titel: titel + (txt(s.description) ? ` — ${txt(s.description)}` : ""),
      text: wasPhrase(extrakt, 260), volltext: extrakt, url: seitenUrl(s),
      ctx: {
        who: istPerson(s) ? ohneKlammer(titel) : "",
        what: wasPhrase(ersterSatz(extrakt)),
        when: jm ? `im Jahr ${jm[1]}` : zeitPhrase(undefined, datum),
        where: istOrt(s) ? ortsPhrase(s) : "",
      },
    });
  }

  // 2 · Was geschah am … (Jahrestage)
  if (wahl.jahrestage) {
    for (const e of (feed.onthisday || []).slice(0, maxJahrestage)) {
      const text = wasPhrase(txt(e.text), 999);
      if (!text) continue;
      const { who, where } = werUndWo(e.pages);
      funde.push({
        quelle: "jahrestag", quelleLabel: "Was geschah am …",
        titel: typeof e.year === "number"
          ? (e.year < 0 ? `${Math.abs(e.year)} v. Chr.` : String(e.year))
          : "Jahrestag",
        text, volltext: text, url: seitenUrl((e.pages || [])[0]),
        ctx: { who, what: wasPhrase(text), when: zeitPhrase(e.year, datum), where },
      });
    }
  }

  // 3 · In den Nachrichten
  if (wahl.nachrichten) {
    for (const n of feed.news || []) {
      const text = entHtml(txt(n.story));
      if (!text) continue;
      const { who, where } = werUndWo(n.links);
      funde.push({
        quelle: "nachricht", quelleLabel: "In den Nachrichten",
        titel: ohneKlammer(seitenTitel((n.links || [])[0])) || "Meldung",
        text, volltext: text, url: seitenUrl((n.links || [])[0]),
        ctx: { who, what: wasPhrase(text), when: zeitPhrase(undefined, datum), where },
      });
    }
  }

  return funde;
}

// ── Netz ────────────────────────────────────────────────────────────────────

const zwei = (n: number): string => String(n).padStart(2, "0");
/** Beide bekannten Adressen des Tagesfeeds. Die zweite ist der Ausweichweg,
 *  falls die erste einmal abgeschaltet wird. */
export function feedAdressen(d: Date): string[] {
  const p = `${d.getFullYear()}/${zwei(d.getMonth() + 1)}/${zwei(d.getDate())}`;
  return [
    `https://de.wikipedia.org/api/rest_v1/feed/featured/${p}`,
    `https://api.wikimedia.org/feed/v1/wikipedia/de/featured/${p}`,
  ];
}

/** Holt den Tagesfeed. Ohne eigene Kopfzeilen — die lösen eine CORS-Vorabfrage
 *  aus, die der Feed nicht braucht. */
export async function holeTagesfeed(d: Date): Promise<unknown> {
  let letzter = "";
  for (const url of feedAdressen(d)) {
    try {
      const res = await fetch(url, { mode: "cors", credentials: "omit" });
      if (!res.ok) { letzter = `Wikipedia antwortete mit ${res.status}`; continue; }
      return (await res.json()) as unknown;
    } catch (e) {
      letzter = e instanceof Error ? e.message : String(e);
    }
  }
  throw new Error(letzter || "keine Verbindung");
}

/** Ein zufälliger Tag aus dem zurückliegenden Jahr. Nicht in die Zukunft:
 *  für kommende Tage gibt es weder Artikel des Tages noch Nachrichten. */
export function zufallsTag(heute = new Date()): Date {
  const d = new Date(heute.getTime());
  d.setDate(d.getDate() - Math.floor(Math.random() * 365));
  return d;
}

/** Datum in der Anzeigeform „Freitag, 14. August 2026“. */
export function datumLang(d: Date): string {
  const tage = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
  return `${tage[d.getDay()]}, ${d.getDate()}. ${MONATE[d.getMonth()]} ${d.getFullYear()}`;
}

// ── Vorrat ──────────────────────────────────────────────────────────────────
// Was der Sammler geholt hat, bleibt liegen. Zwei Gründe: Der Feed braucht
// eine Verbindung, das Schreiben nicht — und der Schlüssel beginnt mit
// „divergenz_“, wandert also ohne weiteres Zutun in die Projektdatei
// (siehe `sammleRest()` in features/project.ts).

/** Ein Fund im Vorrat: derselbe Fund plus Herkunftstag und Zeitpunkt. */
export interface VorratFund extends WikiFund {
  /** Tag des Feeds als „2026-08-14“. */
  tag: string;
  /** Zeitpunkt der Aufnahme (ms), nur für die Reihenfolge. */
  gespeichert: number;
}

export const VORRAT_KEY = "divergenz_sammler_vorrat_v1";
/** Deckel. Rund zwanzig Tage — genug für langes Offline-Arbeiten, ohne den
 *  localStorage zu füllen und damit ANDERE Daten am Sichern zu hindern. */
export const VORRAT_DECKEL = 300;

const tagVon = (d: Date): string =>
  `${d.getFullYear()}-${zwei(d.getMonth() + 1)}-${zwei(d.getDate())}`;

/** Kennung eines Fundes. Tag und Titel allein reichen nicht: ein Jahrestag
 *  trägt nur die Jahreszahl als Titel, mehrere Ereignisse teilen sich also
 *  einen. Der Ereignistext entscheidet mit. */
export function fundSchluessel(f: { tag?: string; quelle: string; titel: string; ctx: { what: string } }): string {
  return `${f.tag || ""}|${f.quelle}|${f.titel}|${f.ctx.what}`.toLowerCase();
}

/** Zusammenführen: Bekanntes bleibt in seiner alten Fassung stehen, Neues
 *  kommt hinten dazu, und wenn der Deckel reißt, fällt das Älteste vorne
 *  heraus. Rein — der Prüfstand kommt ohne Speicher aus. */
export function mischeVorrat(alt: VorratFund[], neu: VorratFund[], deckel = VORRAT_DECKEL): VorratFund[] {
  const bekannt = new Set(alt.map(fundSchluessel));
  const raus = alt.slice();
  for (const f of neu) {
    // Ein Fund ohne „Was“ könnte im Studio nichts bewirken.
    if (!f.ctx.what) continue;
    const k = fundSchluessel(f);
    if (bekannt.has(k)) continue;
    bekannt.add(k);
    raus.push(f);
  }
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}

export function ladeVorrat(): VorratFund[] {
  try {
    const r = JSON.parse(localStorage.getItem(VORRAT_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    // Fremde oder halbe Einträge dürfen den Reiter nicht sprengen.
    return (r as VorratFund[]).filter((f) => f && f.ctx && typeof f.ctx.what === "string");
  } catch { return []; }
}

/** Speichert den Vorrat. Rückgabe false = Speicher voll (der Hinweisbalken
 *  aus storage-status meldet es dem Benutzer selbst). */
export function sichereVorrat(v: VorratFund[]): boolean {
  return safeSet(VORRAT_KEY, JSON.stringify(v), "Sammler-Vorrat");
}

/** Funde eines Tages in den Vorrat legen. Gibt zurück, wie viele neu waren. */
export function ergaenzeVorrat(funde: WikiFund[], datum: Date): { neu: number; gesamt: number } {
  const alt = ladeVorrat();
  const jetzt = Date.now();
  const neu = funde.map((f): VorratFund => ({ ...f, tag: tagVon(datum), gespeichert: jetzt }));
  const zusammen = mischeVorrat(alt, neu);
  sichereVorrat(zusammen);
  return { neu: zusammen.length - alt.length, gesamt: zusammen.length };
}

/** Zieht einen zufälligen Fund. `rnd` ist einsetzbar, damit der Prüfstand die
 *  Ziehung ohne Zufall prüfen kann. */
export function ziehVorrat(vorrat: VorratFund[] = ladeVorrat(), rnd: () => number = Math.random): VorratFund | null {
  const brauchbar = vorrat.filter((f) => f.ctx && (f.ctx.what || f.ctx.who || f.ctx.where));
  if (!brauchbar.length) return null;
  const i = Math.min(brauchbar.length - 1, Math.max(0, Math.floor(rnd() * brauchbar.length)));
  return brauchbar[i]!;
}

export function leereVorrat(): void {
  try { localStorage.removeItem(VORRAT_KEY); } catch { /* gesperrt */ }
}

/** Wie viele Tage und Funde liegen im Vorrat? */
export function vorratStand(vorrat: VorratFund[] = ladeVorrat()): { funde: number; tage: number } {
  return { funde: vorrat.length, tage: new Set(vorrat.map((f) => f.tag)).size };
}
