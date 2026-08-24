// Prüfstand Textindex.
//
// Der Index schreibt zu jedem erzeugten Text auf, was eingestellt war — damit
// sich nachträglich fragen lässt, welche Einstellung zu Texten führt, die man
// behält. Diese Maschine misst inzwischen viel und genau das nie.
//
// Der Kern der Prüfungen liegt deshalb nicht bei der Ablage, sondern bei der
// AUSWERTUNG: Eine Quote, die aus zwei Beobachtungen stammt, ist keine
// Auskunft, sondern ein Zufall mit drei Stellen.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;

import {
  textSchluessel, woerterVon, anteile, mischeIndex, markiereBehalten,
  werteAus, grundquote, alsCsv, ladeIndex, sichereIndex, INDEX_KEY, INDEX_DECKEL,
  type IndexEintrag,
} from "../src/features/textindex";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const e = (schluessel: string, behalten: boolean, extra: Partial<IndexEintrag> = {}): IndexEintrag => ({
  schluessel, zeit: "2026-08-24T10:00", form: "prose", woerter: 120,
  presets: ["Bergwelt"], spreizung: 0, regler: { ton: "neutral" },
  ctx: { who: "", where: "", when: "", what: "" }, herkunft: {}, behalten, ...extra,
});

// ── 1 · Der Schlüssel ───────────────────────────────────────────────────────
// Er verbindet den Eintrag mit dem Text, OHNE den Text zu speichern — der steht
// in der Schatzkammer, und ihn hier noch einmal abzulegen hieße, den Speicher
// zweimal zu verbrauchen und beide Stände auseinanderlaufen zu lassen.
ist("derselbe Text ergibt denselben Schlüssel", textSchluessel("Ein Satz."), textSchluessel("Ein Satz."));
ist("Leerraum und Schreibung stören nicht",
  textSchluessel("Ein   Satz."), textSchluessel("ein satz."));
wahr("ein anderer Text ergibt einen anderen",
  textSchluessel("Ein Satz.") !== textSchluessel("Ein anderer Satz."));
// Gegenprobe: Ein Schlüssel, der immer gleich ist, verbände jeden Eintrag mit
// jedem Text — die Prüfung oben allein würde das nicht bemerken.
const viele = new Set(Array.from({ length: 200 }, (_, i) => textSchluessel("Satz Nummer " + i)));
ist("200 verschiedene Texte ergeben 200 Schlüssel", viele.size, 200);
wahr("der Schlüssel bleibt kurz", textSchluessel("x".repeat(5000)).length < 30);
ist("leerer Text stürzt nicht ab", typeof textSchluessel(""), "string");

ist("Wörter werden gezählt", woerterVon("Ein Satz mit fünf Wörtern hier"), 6);
ist("leer ist null", woerterVon(""), 0);

// ── 2 · Anteile ─────────────────────────────────────────────────────────────
const a = anteile(["markov", "wortbank", "markov", "markov"]);
ist("der größte Anteil steht vorn", Object.keys(a)[0], "markov");
ist("und ist richtig gerechnet", a.markov, 75);
ist("die Summe ergibt hundert", Object.values(a).reduce((x, y) => x + y, 0), 100);
ist("nichts ergibt nichts", Object.keys(anteile([])).length, 0);

// ── 3 · Ablage ──────────────────────────────────────────────────────────────
wahr("der Index wandert in die Projektdatei", INDEX_KEY.startsWith("divergenz_"));
localStorage.removeItem(INDEX_KEY);
ist("ohne Eintrag ist er leer", ladeIndex().length, 0);
sichereIndex([e("a", false)]);
ist("Gesichertes kommt zurück", ladeIndex().length, 1);
localStorage.setItem(INDEX_KEY, "{kein json");
ist("kaputter Inhalt ergibt einen leeren Index", ladeIndex().length, 0);

// Derselbe Text zweimal erzeugt ist keine zweite Beobachtung — die Einstellung
// war dieselbe, sonst wäre der Text ein anderer.
const m1 = mischeIndex([e("a", false)], e("a", false, { form: "poem" }));
ist("ein bekannter Schlüssel ersetzt", m1.length, 1);
ist("und zwar mit dem neuen Inhalt", m1[0]!.form, "poem");
ist("ein neuer kommt dazu", mischeIndex([e("a", false)], e("b", false)).length, 2);
const vollDeckel = Array.from({ length: 6 }, (_, i) => e("k" + i, false));
ist("der Deckel greift", mischeIndex(vollDeckel, e("neu", false), 4).length, 4);
ist("und das Älteste fällt heraus", mischeIndex(vollDeckel, e("neu", false), 4)[0]!.schluessel, "k3");
wahr("die Vorgabe reicht für Monate", INDEX_DECKEL >= 500);

// ── 4 · Behalten nachtragen ─────────────────────────────────────────────────
// Beim Erzeugen weiß es noch niemand. Ohne diesen Schritt sähe jeder Eintrag
// gleich aus und die Auswertung könnte nichts unterscheiden.
const liste = [e("a", false), e("b", false)];
ist("das Nachtragen greift", markiereBehalten(liste, "a"), true);
ist("und setzt das Merkmal", liste[0]!.behalten, true);
ist("zweimal ändert nichts", markiereBehalten(liste, "a"), false);
ist("ein unbekannter Schlüssel auch nicht", markiereBehalten(liste, "gibtsnicht"), false);

// ── 5 · Auswertung ──────────────────────────────────────────────────────────
const daten: IndexEintrag[] = [
  ...Array.from({ length: 6 }, (_, i) => e("g" + i, i < 4, { presets: ["Gut"] })),
  ...Array.from({ length: 6 }, (_, i) => e("s" + i, i < 1, { presets: ["Schwach"] })),
  e("selten", true, { presets: ["Einmalig"] }),
];
// 6 von 13 behalten. Ich hatte 38 hingeschrieben — nachgerechnet sind es 46.
ist("die Grundquote stimmt", grundquote(daten), 46);
const b = werteAus(daten, (x) => x.presets);
ist("das bessere Preset steht vorn", b[0]?.wert, "Gut");
ist("mit der richtigen Quote", b[0]?.quote, 67);
ist("und der Anzahl dahinter", b[0]?.gesamt, 6);
// Eine Quote von 100 Prozent aus EINEM Text ist keine Auskunft, sondern ein
// Zufall mit drei Stellen. Ohne diese Schwelle stünde „Einmalig" ganz oben.
wahr("ein Einzelfall taucht nicht auf", !b.some((x) => x.wert === "Einmalig"));
ist("mit gesenkter Schwelle schon", werteAus(daten, (x) => x.presets, 1).some((x) => x.wert === "Einmalig"), true);
ist("ein leerer Index ergibt nichts", werteAus([], (x) => x.presets).length, 0);
ist("und keine Grundquote", grundquote([]), 0);
// Ein Merkmal wird je Eintrag nur EINMAL gezählt — sonst zählte ein Text mit
// drei gemischten Presets dreifach in die Grundgesamtheit.
const doppelt = werteAus([e("x", true, { presets: ["A", "A", "B"] })], (x) => x.presets, 1);
ist("ein doppeltes Merkmal zählt einmal", doppelt.find((x) => x.wert === "A")?.gesamt, 1);

// ── 6 · CSV ─────────────────────────────────────────────────────────────────
// „Nachträglich auswerten" heißt Tabelle, nicht JSON.
const csv = alsCsv(daten);
const zeilenCsv = csv.split("\n");
ist("es gibt eine Kopfzeile und je Eintrag eine Zeile", zeilenCsv.length, daten.length + 1);
wahr("die Kopfzeile nennt die Grunddaten", /zeit;form;woerter;behalten/.test(zeilenCsv[0]!));
wahr("und die Regler als eigene Spalten", /;ton/.test(zeilenCsv[0]!));
// Semikolon als Trenner, weil deutsche Tabellenprogramme sonst jede Zeile in
// eine Spalte legen.
wahr("getrennt wird mit Semikolon", zeilenCsv[0]!.includes(";") && !zeilenCsv[0]!.includes(","));
ist("behalten steht als Zahl da", /;1;|;0;/.test(zeilenCsv[1]!), true);
// Ein Semikolon im Wert würde die Spalten verschieben.
const heikel = alsCsv([e("z", true, { ctx: { who: "Meier; Schulz", where: '"Ort"', when: "", what: "" } })]);
wahr("ein Semikolon im Wert wird eingefasst", /"Meier; Schulz"/.test(heikel));
wahr("ein Anführungszeichen wird verdoppelt", /""Ort""/.test(heikel));
ist("ein leerer Index ergibt nur die Kopfzeile", alsCsv([]).split("\n").length, 1);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Textindex — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler im Textindex:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Textindex: alle ${geprueft} Prüfungen bestanden.`);
}
