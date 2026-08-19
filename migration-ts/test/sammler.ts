// Prüfstand Sammler: die Zerlegung des Wikipedia-Tagesfeeds in 4W-Vorschläge.
//
// Der Lauf braucht kein Netz — er arbeitet gegen feste Beispieldaten, die dem
// Feed nachgebildet sind. Wichtiger als die Treffer sind hier die GEGENTESTS:
// jede Erkennung wird auch mit einem Fall geprüft, in dem sie NICHT anschlagen
// darf. Eine Sperre, die nie zuschlägt, sieht sonst aus wie eine, die wirkt.
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
  zerlegeFeed, istPerson, istOrt, ortsPhrase, zeitPhrase, wasPhrase, ersterSatz,
  entHtml, feedAdressen, zufallsTag, mischeVorrat, ergaenzeVorrat, ladeVorrat,
  leereVorrat, ziehVorrat, vorratStand, fundSchluessel, VORRAT_KEY,
  istLexikon, JAHRESTAGE_VORGABE,
  type WikiSeite, type VorratFund,
} from "../src/features/wikisammler";
import { rateWhere, rateWhen, rateWho } from "../src/generation/ctxnorm";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── Beispieldaten ───────────────────────────────────────────────────────────
const TAG = new Date(2026, 7, 14);          // 14. August 2026
const FEED = {
  tfa: {
    titles: { normalized: "Johann Wolfgang von Goethe" },
    description: "deutscher Dichter und Naturforscher",
    extract: "Johann Wolfgang von Goethe (* 28. August 1749 in Frankfurt am Main; † 22. März 1832 in Weimar) war ein deutscher Schriftsteller und Naturforscher. Er gilt als bedeutendster Vertreter deutschsprachiger Dichtung.",
    content_urls: { desktop: { page: "https://de.wikipedia.org/wiki/Johann_Wolfgang_von_Goethe" } },
  },
  onthisday: [
    { text: "Der Vesuv bricht aus und verschüttet die Städte Pompeji und Herculaneum.", year: 79,
      pages: [
        { titles: { normalized: "Pompeji" }, description: "antike Stadt in Kampanien", coordinates: { lat: 40.75, lon: 14.49 } },
        { titles: { normalized: "Plinius der Jüngere" }, description: "römischer Schriftsteller und Senator",
          extract: "Plinius der Jüngere (* 61 in Novum Comum; † um 113) war ein römischer Schriftsteller." },
      ] },
    { text: "Die Schlacht bei Marathon endet mit einem Sieg der Athener.", year: -490,
      pages: [{ titles: { normalized: "Schlacht bei Marathon" }, description: "Schlacht der Perserkriege" }] },
    { text: "Der Mailänder Dom wird geweiht.", year: 1418,
      pages: [{ titles: { normalized: "Mailand" }, description: "Stadt in Italien", coordinates: { lat: 45.46, lon: 9.19 } }] },
  ],
  news: [
    { story: "<p>Bei der <a href=\"./Wahl\">Parlamentswahl</a> in der <b>Schweiz</b> gewinnt&nbsp;die Opposition.</p>",
      links: [{ titles: { normalized: "Schweiz" }, description: "Staat in Mitteleuropa", coordinates: { lat: 46.8, lon: 8.2 } }] },
  ],
};
const ALLES = { tfa: true, jahrestage: true, nachrichten: true };
const funde = zerlegeFeed(FEED, TAG, ALLES);

// ── 1 · Artikel des Tages ───────────────────────────────────────────────────
const tfa = funde.find((f) => f.quelle === "tfa")!;
ist("Person landet im Wer", tfa.ctx.who, "Johann Wolfgang von Goethe");
ist("Person landet NICHT im Wo", tfa.ctx.where, "");
ist("Jahr aus dem Extrakt", tfa.ctx.when, "im Jahr 1749");
wahr("erster Satz bricht nicht an „28.“", tfa.ctx.what.includes("war ein deutscher Schriftsteller"));
wahr("Lebensdaten-Klammer entfernt", !tfa.ctx.what.includes("(*"));

// ── 2 · Jahrestage ──────────────────────────────────────────────────────────
const j = funde.filter((f) => f.quelle === "jahrestag");
ist("drei Jahrestage", j.length, 3);
ist("Ort aus den Seiten", j[0]!.ctx.where, "in Pompeji");
ist("Person aus den Seiten", j[0]!.ctx.who, "Plinius der Jüngere");
wahr("Ort landet NIE im Wer", j[0]!.ctx.who !== "Pompeji");
ist("Datum mit Jahr", j[0]!.ctx.when, "am 14. August 79");
ist("Schlacht ist keine Person", j[1]!.ctx.who, "");
ist("Schlacht ist kein Ort", j[1]!.ctx.where, "");
ist("negatives Jahr", j[1]!.ctx.when, "im Jahr 490 v. Chr.");
ist("Stadt auf -land bekommt keinen Artikel", j[2]!.ctx.where, "in Mailand");

// ── 3 · Nachrichten ─────────────────────────────────────────────────────────
const n = funde.find((f) => f.quelle === "nachricht")!;
wahr("HTML ist entfernt", !/[<>]/.test(n.text) && !n.text.includes("&nbsp;"));
ist("Land mit Artikel", n.ctx.where, "in der Schweiz");

// ── 4 · Jeder gelieferte Wert muss vom Studio verwertbar sein ───────────────
// Maß: dieselbe Bewertung, die im Studio die Felder einfärbt. Unter 0,8 wäre
// der Wert für die Schablonen Rohmaterial, das die Engine raten muss.
let schwach = 0, gewertet = 0;
for (const f of funde) {
  const p: [string, string, (s: string) => number][] = [
    ["Wo", f.ctx.where, rateWhere], ["Wann", f.ctx.when, rateWhen], ["Wer", f.ctx.who, rateWho],
  ];
  for (const [name, wert, mass] of p) {
    if (!wert) continue;
    gewertet++;
    if (mass(wert) < 0.8) { schwach++; fails.push(`${f.titel}: ${name} „${wert}“ nur ${mass(wert).toFixed(2)}`); }
  }
}
geprueft++;
zeilen.push(`  ${schwach === 0 ? "✓" : "✗"} ${gewertet} Werte, davon ${schwach} unter 0,8 im Studio-Maß`);

// ── 5 · Gegentests der Detektoren ───────────────────────────────────────────
const s = (o: Partial<WikiSeite>): WikiSeite => o as WikiSeite;
wahr("„deutscher Maler“ = Person", istPerson(s({ description: "deutscher Maler" })));
wahr("„Fluss in Bayern“ = keine Person", !istPerson(s({ description: "Fluss in Bayern" })));
wahr("„Bundesstaat der Vereinigten Staaten“ = keine Person", !istPerson(s({ description: "Bundesstaat der Vereinigten Staaten" })));
wahr("„deutscher Maler“ = kein Ort", !istOrt(s({ description: "deutscher Maler" })));
// Der Ortsvorrang muss WIRKSAM sein: „Schloss des Königs Ludwig II.“ enthält
// ein Personenwort. Ohne den Vorrang wäre das Schloss ein König.
const SCHLOSS = s({ titles: { normalized: "Schloss Neuschwanstein" }, description: "Schloss des Königs Ludwig II. in Bayern", coordinates: { lat: 47.5, lon: 10.7 } });
wahr("Ort mit Personenwort bleibt Ort", istOrt(SCHLOSS));
wahr("Ort mit Personenwort ist KEINE Person", !istPerson(SCHLOSS));
ist("Ort mit Personenwort landet im Wo",
  zerlegeFeed({ onthisday: [{ text: "Der Bau beginnt.", year: 1869, pages: [SCHLOSS] }] }, TAG, ALLES)[0]!.ctx.where, "im Schloss Neuschwanstein");
ist("Ort mit Personenwort landet NICHT im Wer",
  zerlegeFeed({ onthisday: [{ text: "Der Bau beginnt.", year: 1869, pages: [SCHLOSS] }] }, TAG, ALLES)[0]!.ctx.who, "");
wahr("Sternchen erkennt Person ohne Beschreibung", istPerson(s({ extract: "Anna Seghers (* 19. November 1900 in Mainz) schrieb …" })));

// ── 6 · Ortsphrasen ─────────────────────────────────────────────────────────
ist("Insel", ortsPhrase(s({ titles: { normalized: "Kreta" }, description: "griechische Insel" })), "auf Kreta");
ist("Berg", ortsPhrase(s({ titles: { normalized: "Mount Everest" }, description: "höchster Berg der Erde" })), "am Mount Everest");
ist("Bauwerk männlich", ortsPhrase(s({ titles: { normalized: "Kölner Dom" }, description: "gotische Kathedrale in Köln" })), "im Kölner Dom");
ist("Bauwerk weiblich", ortsPhrase(s({ titles: { normalized: "Frauenkirche" }, description: "Kirche in Dresden" })), "in der Frauenkirche");
ist("Pluralland", ortsPhrase(s({ titles: { normalized: "Niederlande" }, description: "Staat in Westeuropa" })), "in den Niederlanden");
ist("Klammerzusatz fällt weg", ortsPhrase(s({ titles: { normalized: "Springfield (Illinois)" }, description: "Stadt in Illinois" })), "in Springfield");

// ── 7 · Textwerkzeuge ───────────────────────────────────────────────────────
ist("Schlusspunkt weg", wasPhrase("Der Vesuv bricht aus."), "Der Vesuv bricht aus");
wahr("Kürzung bricht kein Wort ab", /(…|[a-zäöüß])$/.test(wasPhrase("Ein sehr langer Satz ohne jedes Satzzeichen der immer weiter geht und niemals aufhört zu gehen und noch weiter", 60)));
ist("Jahresvorspann weg", wasPhrase("1902: Der Damm bricht."), "Der Damm bricht");
ist("Entitäten aufgelöst", entHtml("A&nbsp;&amp;&nbsp;B"), "A & B");
wahr("erster Satz endet am Punkt", ersterSatz("Ein Satz. Noch einer.") === "Ein Satz.");
ist("Datum ohne Jahr", zeitPhrase(undefined, TAG), "am 14. August 2026");

// ── 8 · Robustheit ──────────────────────────────────────────────────────────
ist("leerer Feed", zerlegeFeed(null, TAG, ALLES).length, 0);
ist("Müll im Feed", zerlegeFeed({ onthisday: [{}, { text: "" }], tfa: {} }, TAG, ALLES).length, 1);
ist("Quellenwahl greift", zerlegeFeed(FEED, TAG, { tfa: false, jahrestage: true, nachrichten: false }).length, 3);
wahr("zwei Adressen", feedAdressen(TAG).length === 2 && feedAdressen(TAG)[0]!.includes("2026/08/14"));
wahr("Zufallstag liegt nicht in der Zukunft", zufallsTag(TAG).getTime() <= TAG.getTime());

// ── 9 · Vorrat: Zusammenführen, Deckel, Ziehung ─────────────────────────────
const vf = (tag: string, titel: string, was: string, uebrig: Partial<VorratFund> = {}): VorratFund => ({
  quelle: "jahrestag", quelleLabel: "Was geschah am …", titel, text: was, url: "",
  ctx: { who: "", what: was, when: "", where: "" }, tag, gespeichert: 1, ...uebrig,
} as VorratFund);

const a1 = vf("2026-08-14", "1902", "Der Damm bricht");
const a2 = vf("2026-08-14", "1902", "Die Brücke stürzt ein");   // gleicher Titel, anderes Ereignis
ist("gleicher Titel, anderer Text = zwei Funde", mischeVorrat([a1], [a2]).length, 2);
ist("dieselbe Kennung = keine Dublette", mischeVorrat([a1], [vf("2026-08-14", "1902", "Der Damm bricht")]).length, 1);
ist("anderer Tag = eigener Fund", mischeVorrat([a1], [vf("2025-08-14", "1902", "Der Damm bricht")]).length, 2);
ist("Fund ohne Was wird nicht aufgenommen",
  mischeVorrat([], [vf("2026-08-14", "1902", "", { ctx: { who: "X", what: "", when: "", where: "" } })]).length, 0);

// Deckel: das Älteste fällt vorne heraus, das Neueste bleibt.
const viele = Array.from({ length: 5 }, (_, i) => vf("2026-08-0" + (i + 1), "T" + i, "Ereignis " + i));
const gedeckelt = mischeVorrat(viele.slice(0, 3), viele.slice(3), 4);
ist("Deckel hält", gedeckelt.length, 4);
ist("Ältestes fällt heraus", gedeckelt.some((f) => f.ctx.what === "Ereignis 0"), false);
ist("Neuestes bleibt", gedeckelt[gedeckelt.length - 1]!.ctx.what, "Ereignis 4");

// Ziehung: ohne Zufall prüfbar.
ist("Ziehung erstes Element", ziehVorrat(viele, () => 0)!.ctx.what, "Ereignis 0");
ist("Ziehung letztes Element", ziehVorrat(viele, () => 0.999)!.ctx.what, "Ereignis 4");
ist("Ziehung aus leerem Vorrat", ziehVorrat([], () => 0), null);
ist("Kennung berücksichtigt den Text",
  fundSchluessel(a1) === fundSchluessel(a2), false);

// Weg durch den Speicher: ablegen, wiederfinden, nicht verdoppeln.
leereVorrat();
const e1 = ergaenzeVorrat(funde, TAG);
const e2 = ergaenzeVorrat(funde, TAG);
ist("erste Ablage nimmt alle Funde", e1.neu, funde.length);
ist("zweite Ablage nimmt nichts doppelt", e2.neu, 0);
ist("Vorrat wiedergefunden", ladeVorrat().length, funde.length);
ist("ein Tag im Stand", vorratStand().tage, 1);
wahr("Ziehung aus dem Speicher liefert etwas", ziehVorrat() !== null);
leereVorrat();
ist("Leeren wirkt", ladeVorrat().length, 0);
// Der Schlüssel MUSS mit „divergenz_“ beginnen: nur dann nimmt sammleRest()
// in features/project.ts ihn in die Projektdatei auf (Präfix-Regel).
wahr("Schlüssel wandert in die Projektdatei", VORRAT_KEY.startsWith("divergenz_"));

// ── Vom Tagesfeed in den Korpus ─────────────────────────────────────────────
// Bisher hatte der Feed gar keinen Ausgang zum Korpus: Ein Fund konnte nur ins
// Studio (die vier W), sein TEXT wurde angezeigt und weggeworfen.

// Der Volltext ist ungekuerzt, der Kartentext gekappt. Zwei Felder, weil beide
// verschiedene Aufgaben haben — die Karte soll ueberschaubar sein, der Korpus
// will Masse.
const lang = "Ein sehr langer Artikelanfang. " + "Wort ".repeat(120) + "Ende.";
const f2 = zerlegeFeed({ tfa: { title: "T", extract: lang } }, TAG, ALLES)[0]!;
wahr("der Kartentext ist gekuerzt", f2.text.length <= 265);
wahr("der Volltext nicht", f2.volltext.length > 400);
ist("und er ist der ganze Text", f2.volltext, lang);
// Gegenprobe: Waeren beide gleich, brauchte es das zweite Feld nicht.
wahr("beide Felder sind wirklich verschieden", f2.text !== f2.volltext);
wahr("jeder Fund traegt einen Volltext", funde.every((f) => typeof f.volltext === "string"));

// Mehr Jahrestage. Der Feed liefert dreissig bis sechzig; vorher kamen
// vierzehn durch.
wahr("die Vorgabe ist deutlich groesser als vierzehn", JAHRESTAGE_VORGABE >= 30);
const vieleTage = { onthisday: Array.from({ length: 60 }, (_, i) => ({ text: `Ereignis ${i}.`, year: 1900 + i })) };
ist("und sie greift", zerlegeFeed(vieleTage, TAG, { tfa: false, jahrestage: true, nachrichten: false }).length, JAHRESTAGE_VORGABE);
ist("eine eigene Grenze auch", zerlegeFeed(vieleTage, TAG, { tfa: false, jahrestage: true, nachrichten: false }, 5).length, 5);

// Der Lexikonfilter. Dieselbe Aufgabe wie der Beutefilter beim Bildsammler:
// Vierzig Definitionen im Korpus, und die Maschine schreibt Lexikon.
for (const t of [
  "Marie Curie war eine polnisch-französische Physikerin und Chemikerin.",
  "Gattenhofen ist eine Gemeinde im Landkreis Ansbach.",
  "Der Nordseewal gehört zur Familie der Furchenwale.",
  "Als Fraktur bezeichnet man eine gebrochene Schrift.",
  "Zeitstrom ist der Name eines Flusses.",
]) wahr(`Lexikon erkannt: „${t.slice(0, 38)}…“`, istLexikon(t));

// Gegenprobe — ohne sie koennte der Filter alles abwaehlen und saehe trotzdem
// tadellos aus.
for (const t of [
  "Am 28. Juni 1936 nimmt sich Alexander Berkman das Leben.",
  "Der Bau beginnt, und niemand weiss, wer ihn bezahlt.",
  "Ein Kollektiv spricht in dir, sagte die Amtsaerztin.",
  "Die Barrikade faellt, die Glocke bleibt.",
  "1869 wird der Grundstein gelegt.",
]) ist(`kein Lexikon: „${t.slice(0, 38)}…“`, istLexikon(t), false);

// Geprueft wird am ANFANG: Dort steht bei Wikipedia die Definition. Ein „war
// ein" weiter unten ist gewoehnliche Sprache.
ist("weiter hinten zaehlt es nicht",
  istLexikon("Der Bau beginnt im Regen. " + "Es folgt ein langer Absatz ohne Definition. ".repeat(4) + "Damals war ein Mann dabei."),
  false);
ist("leerer Text ist kein Lexikon", istLexikon(""), false);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Sammler — ${funde.length} Funde aus dem Beispielfeed, ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Sammler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Sammler: alle ${geprueft} Prüfungen bestanden.`);
}
