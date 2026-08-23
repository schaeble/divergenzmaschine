// Prüfstand Themenpool: 4W aus Wikidata.
//
// Was hier NICHT geprüft werden kann: der Dienst selbst. Der Sandkasten dieses
// Bauraums kommt nicht ins Wikimedia-Netz — dasselbe gilt seit jeher für den
// Tagesfeed des Sammlers. Geprüft wird deshalb, was ohne Netz prüfbar ist: die
// Zerlegung gegen nachgebildete Antworten, die Form der Abfragen, der Vorrat
// und das Ziehen. Ein grüner Lauf sagt hier nichts darüber, ob Wikidata
// antwortet — das sieht nur der Browser.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import {
  THEMEN, THEMA_IDS, themaVon, jahrVon, zerlegeAntwort, holeThema, WIKIDATA_URL,
  mischeThemen, ziehThema, themenStand, THEMA_DECKEL, type ThemaFund,
} from "../src/features/themenpool";
import { offeneQuellen, QUELLEN, QUELLE_LABEL } from "../src/features/kontext";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Die Abfragen ───────────────────────────────────────────────────────
wahr(`es gibt Themen (${THEMEN.length})`, THEMEN.length >= 6);
for (const t of THEMEN) {
  // Jede Abfrage muss die vier gesuchten Felder benennen — sonst kommt eine
  // Antwort zurück, die die Zerlegung nicht lesen kann.
  for (const feld of ["?item", "?werLabel", "?wasLabel", "?wannRoh", "?woLabel"]) {
    wahr(`${t.id}: die Abfrage nennt ${feld}`, t.sparql.includes(feld));
  }
  wahr(`${t.id}: mit Beschriftungsdienst`, t.sparql.includes("wikibase:label"));
  wahr(`${t.id}: mit Deckel`, /LIMIT \d+/.test(t.sparql));
  wahr(`${t.id}: hat eine Erklärung`, t.hinweis.length > 20);
  // Der Handlungssatz braucht ein Verb — „arbeitet an Die Dreigroschenoper"
  // war der erste Versuch und hatte den Kasus verfehlt.
  const satz = t.wasSatz("Die Dreigroschenoper");
  wahr(`${t.id}: der Handlungssatz trägt ein Verb (${satz})`, /^[a-zäöü]+t\b|^ist\b/.test(satz));
}
ist("die Kennungen sind eindeutig", new Set(THEMA_IDS).size, THEMEN.length);
wahr("ein unbekanntes Thema gibt es nicht", themaVon("gibtesnicht") === null);

// ── 2 · Jahreszahlen ───────────────────────────────────────────────────────
ist("aus einem Zeitstempel wird ein Jahr", jahrVon("1928-08-31T00:00:00Z"), "1928");
ist("ein negatives Jahr wird vorchristlich", jahrVon("-0375-01-01T00:00:00Z"), "375 v. Chr.");
ist("Jahr null gibt es nicht", jahrVon("0000-01-01T00:00:00Z"), "");
ist("und Unlesbares ergibt nichts", jahrVon("kaputt"), "");
ist("leer bleibt leer", jahrVon(""), "");

// ── 3 · Die Zerlegung ──────────────────────────────────────────────────────
const ANTWORT = { results: { bindings: [
  { item: { value: "http://www.wikidata.org/entity/Q4914" }, werLabel: { value: "Bertolt Brecht" },
    wasLabel: { value: "Die Dreigroschenoper" }, wannRoh: { value: "1928-08-31T00:00:00Z" }, woLabel: { value: "Augsburg" } },
  { item: { value: "http://www.wikidata.org/entity/Q42" }, werLabel: { value: "Douglas Adams" },
    wasLabel: { value: "Per Anhalter" }, wannRoh: { value: "1979-10-12T00:00:00Z" }, woLabel: { value: "Cambridge" } },
  // Dieselbe Person mit demselben Werk: Wikidata liefert das doppelt, sobald
  // eine der optionalen Angaben mehrere Werte hat.
  { item: { value: "http://www.wikidata.org/entity/Q42" }, werLabel: { value: "Douglas Adams" },
    wasLabel: { value: "Per Anhalter" }, wannRoh: { value: "1979-10-12T00:00:00Z" }, woLabel: { value: "London" } },
  // Ohne Beschriftung gibt Wikidata die nackte Q-Nummer zurück. Die gehört
  // nicht in einen Text.
  { item: { value: "http://www.wikidata.org/entity/Q999" }, werLabel: { value: "Q999" },
    wasLabel: { value: "Q888" }, wannRoh: { value: "2001-01-01T00:00:00Z" }, woLabel: { value: "Q7" } },
  // Nur ein Werk, keine Person — brauchbar, aber ohne Handlungsverb.
  { item: { value: "http://www.wikidata.org/entity/Q7" }, wasLabel: { value: "Die Blechtrommel" },
    wannRoh: { value: "1959-01-01T00:00:00Z" } },
] } };
const lit = themaVon("literatur")!;
const funde = zerlegeAntwort(ANTWORT, lit);
ist("fünf Zeilen ergeben drei Funde", funde.length, 3);
ist("die Dublette fällt weg", funde.filter((f) => f.ctx.who === "Douglas Adams").length, 1);
wahr("keine nackte Q-Nummer im Text", !funde.some((f) => /^Q\d+$/.test(f.ctx.who) || /Q\d+/.test(f.ctx.what)));
ist("aus Person und Werk wird eine Handlung", funde[0]!.ctx.what, "schreibt „Die Dreigroschenoper“");
ist("und der Ort steht ohne Präposition da", funde[0]!.ctx.where, "Augsburg");
ist("der Beleg wandert mit", funde[0]!.qid, "Q4914");
ist("ohne Person bleibt das Werk die Sache", funde[2]!.ctx.what, "Die Blechtrommel");
ist("und trägt dann den Titel", funde[2]!.titel, "Die Blechtrommel");
// Eine Zeile ohne Wer UND ohne Was kann im Studio nichts bewirken.
ist("eine leere Zeile ergibt keinen Fund",
  zerlegeAntwort({ results: { bindings: [{ item: { value: "Q1" } }] } }, lit).length, 0);
ist("und eine kaputte Antwort auch nicht", zerlegeAntwort({ fehler: "?" }, lit).length, 0);
ist("null ebenso", zerlegeAntwort(null, lit).length, 0);

// ── 4 · Die Abfrage-URL ────────────────────────────────────────────────────
{
  let gesehen = "";
  const attrappe = (async (url: string) => {
    gesehen = url;
    return { ok: true, json: async () => ANTWORT } as unknown as Response;
  }) as unknown as typeof fetch;
  void holeThema(lit, attrappe).then((f) => {
    ist("holeThema liefert die Funde", f.length, 3);
    wahr("die URL geht an Wikidata", gesehen.startsWith(WIKIDATA_URL));
    wahr("mit JSON als Format", gesehen.includes("format=json"));
    wahr("und die Abfrage ist kodiert", gesehen.includes("query=SELECT%20") || gesehen.includes("query=SELECT+"));
  });
  // Ein Fehlschlag muss als Fehler ankommen, nicht als leere Liste — sonst
  // steht in der Oberfläche „nichts gefunden", wo „nicht erreichbar" gehört.
  const kaputt = (async () => ({ ok: false, status: 429 } as unknown as Response)) as unknown as typeof fetch;
  void holeThema(lit, kaputt).then(() => { ist("ein Fehlschlag wirft", "kein Fehler", "Fehler"); })
    .catch((e: unknown) => { wahr("ein Fehlschlag wirft und nennt den Grund", String(e).includes("429")); });
}

// ── 5 · Vorrat ─────────────────────────────────────────────────────────────
{
  const f = (thema: string, wer: string, was: string): ThemaFund => ({
    thema, themaLabel: thema, titel: wer, qid: "Q1",
    ctx: { where: "", when: "", who: wer, what: was }, gespeichert: 0,
  });
  const a = mischeThemen([], [f("literatur", "Brecht", "schreibt"), f("politik", "Adams", "ist")]);
  ist("neue Funde kommen dazu", a.length, 2);
  const b = mischeThemen(a, [f("literatur", "Brecht", "schreibt")]);
  ist("bekannte nicht noch einmal", b.length, 2);
  const viele = mischeThemen([], Array.from({ length: 12 }, (_, i) => f("literatur", "P" + i, "schreibt " + i)), 5);
  ist("der Deckel greift", viele.length, 5);
  ist("und das Älteste fällt vorn heraus", viele[0]!.ctx.who, "P7");
  ist("ein Fund ohne Wer und Was kommt nicht hinein",
    mischeThemen([], [f("literatur", "", "")]).length, 0);
  wahr(`der Deckel ist gesetzt (${THEMA_DECKEL})`, THEMA_DECKEL >= 100);

  // Ziehen: mit Thema nur aus diesem Thema, ohne aus allem.
  const topf = [f("literatur", "Brecht", "schreibt"), f("politik", "Adams", "ist"), f("politik", "Vogt", "ist")];
  ist("mit Thema wird nur daraus gezogen", ziehThema("politik", topf, () => 0)!.thema, "politik");
  ist("und 1.0 fällt nicht heraus", ziehThema("politik", topf, () => 1)!.thema, "politik");
  wahr("ohne Thema aus allem", !!ziehThema("", topf, () => 0));
  ist("aus dem Leeren kommt nichts", ziehThema("", [], () => 0), null);
  ist("und aus einem unbekannten Thema auch nicht", ziehThema("gibtesnicht", topf, () => 0), null);
  const st = themenStand(topf);
  ist("der Stand zählt die Funde", st.funde, 3);
  ist("und die Themen", st.themen, 2);
}

// ── 6 · Der Themenpool als Würfelquelle ───────────────────────────────────
// Seit 4.297.0 sind es fünf: „ideen" kam dazu. Der Einwand dahinter war
// berechtigt — eine Prämisse trägt dieselben vier W wie die Welt, und der Weg
// „→ Studio" übergibt seit jeher genau die. Welt und Ideen sind immer dabei,
// weil beide auch beim ersten Start etwas liefern; die drei Vorräte kommen nur
// mit Inhalt dazu.
ist("ohne Vorräte bleiben Welt und Ideen", offeneQuellen(0, 0, 0).join(","), "welt,ideen");
ist("mit Themenpool kommt Thema dazu", offeneQuellen(0, 0, 5).join(","), "welt,ideen,thema");
ist("mit allen Vorräten", offeneQuellen(1, 1, 1).join(","), "welt,ideen,wiki,abschrift,thema");
wahr("jede Quelle hat eine Beschriftung", QUELLEN.every((q) => !!QUELLE_LABEL[q]));
ist("es sind fünf", QUELLEN.length, 5);

const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
// Erst zählen, wenn auch die Netz-Attrappen durch sind — sonst meldet der Kopf
// eine andere Zahl als der Fuß.
setTimeout(() => {
  console.log(`Prüfstand Themenpool — ${geprueft} Prüfungen, ${bestanden} bestanden`);
  if (fails.length) {
    console.error(`\n❌ Themenpool: ${fails.length} Fehler:`);
    fails.forEach((f) => console.error("  - " + f));
    proc.process?.exit(1);
  } else {
    console.log(`\n✅ Themenpool: alle ${geprueft} Prüfungen bestanden.`);
  }
}, 30);
