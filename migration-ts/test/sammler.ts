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
  entHtml, feedAdressen, zufallsTag, type WikiSeite,
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
