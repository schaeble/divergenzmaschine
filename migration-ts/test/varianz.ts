// Prüfstand Varianzmesser.
//
// Das Maß soll belegen, was der Benutzer sieht: „immer wieder ähnliche
// Beiträge". Ein Maß, das dabei zustimmend nickt, ohne den Fall zu treffen,
// wäre schlimmer als keines. Deshalb steht hier zuerst der GEGENFALL: zwei
// gleiche Texte müssen rot sein, vier verschiedene grün.
import {
  aehnlichkeit, varianzBericht, varianzBand, inhaltsWoerter, dreiergruppen,
} from "../src/features/varianz";
import { applyToneRegister } from "../src/generation/tone.shape";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const A = "Der Wächter zählt die Fenster im Hafen. Ein Kompass zeigt, was niemand fragt. Die Reise führt zurück an den Anfang.";
const B = "Der Wächter zählt die Fenster im Hafen. Ein Kompass zeigt, was niemand fragt. Die Reise führt zurück an den Anfang.";
const C = "Im Winter schmilzt der Schnee auf dem Dach der Scheune. Ein Pferd wartet am Zaun und die Uhr im Stall bleibt stehen.";
const D = "Die Rechnung liegt auf dem Tisch der Verwaltung. Ein Formular verlangt eine Unterschrift, die niemand leisten will.";
const E = "Der Wächter zählt die Fenster am Hafen und ein Kompass schweigt. Später führt die Reise zurück zum Anfang der Wette.";

// ── 1 · Die Bausteine ───────────────────────────────────────────────────────
wahr("Inhaltswörter lassen Füllwörter weg", !inhaltsWoerter("und aber nicht wenn").has("aber"));
wahr("und behalten die Nomen", inhaltsWoerter("Der Wächter zählt Fenster").has("wächter"));
ist("Dreiergruppen zählen richtig", dreiergruppen("eins zwei drei vier").size, 2);
ist("zu kurzer Text gibt keine Gruppe", dreiergruppen("eins zwei").size, 0);

// ── 2 · Ähnlichkeit ─────────────────────────────────────────────────────────
ist("gleicher Text ist ganz ähnlich", Math.round(aehnlichkeit(A, B) * 100), 100);
wahr("verschiedene Texte sind kaum ähnlich", aehnlichkeit(A, C) < 0.1, aehnlichkeit(A, C).toFixed(3));
wahr("umformuliert bleibt erkennbar ähnlich", aehnlichkeit(A, E) > 0.15, aehnlichkeit(A, E).toFixed(3));
wahr("und weniger als wörtlich gleich", aehnlichkeit(A, E) < aehnlichkeit(A, B));
ist("leerer Text ist mit nichts ähnlich", aehnlichkeit("", A), 0);

// ── 3 · Der Bericht ─────────────────────────────────────────────────────────
{
  const b = varianzBericht([
    { titel: "1", text: A }, { titel: "2", text: C }, { titel: "3", text: D },
  ]);
  wahr("drei verschiedene Beiträge ergeben hohe Varianz", b.band === "hoch", b.wert.toFixed(3));
  wahr("und die ähnlichsten Paare sind trotzdem benannt", b.paare.length > 0);
}
{
  // Der Gegenfall: eine Dublette in einer sonst bunten Ausgabe. Sie MUSS
  // auffallen — der Durchschnitt aller Paare würde sie verschlucken.
  const b = varianzBericht([
    { titel: "1", text: A }, { titel: "2", text: B }, { titel: "3", text: C }, { titel: "4", text: D },
  ]);
  wahr("eine Dublette drückt die Varianz", b.wert < 0.75, b.wert.toFixed(3));
  ist("und wird als ähnlichstes Paar benannt", `${b.paare[0]!.a},${b.paare[0]!.b}`, "0,1");
  wahr("die beiden anderen bleiben unbelastet", b.naechste[2]! < 0.1 && b.naechste[3]! < 0.1);
}
{
  const b = varianzBericht([{ titel: "1", text: A }, { titel: "2", text: B }]);
  ist("zwei gleiche Beiträge sind rot", b.band, "gering");
}
ist("ein einzelner Beitrag hat nichts zu vergleichen", varianzBericht([{ titel: "1", text: A }]).band, "hoch");
ist("keine Beiträge auch nicht", varianzBericht([]).band, "hoch");

// ── 4 · Bänder ──────────────────────────────────────────────────────────────
ist("0,9 ist hoch", varianzBand(0.9), "hoch");
ist("0,75 ist hoch", varianzBand(0.75), "hoch");
ist("0,6 ist mittel", varianzBand(0.6), "mittel");
ist("0,5 ist gering", varianzBand(0.5), "gering");
ist("Unsinn gilt als gering", varianzBand(NaN), "gering");

// ── 5 · Vielfalt der Einstellungen ──────────────────────────────────────────
{
  const b = varianzBericht([
    { titel: "1", text: A, form: "prose", bank: "x", quelle: "welt" },
    { titel: "2", text: C, form: "prose", bank: "x", quelle: "welt" },
    { titel: "3", text: D, form: "prose", bank: "x", quelle: "welt" },
  ]);
  wahr("gleiche Form, gleiche Bank, gleiche Quelle: Vielfalt niedrig",
    b.vielfalt.formen < 0.4 && b.vielfalt.baenke < 0.4 && b.vielfalt.quellen < 0.4);
}
{
  const b = varianzBericht([
    { titel: "1", text: A, form: "prose", bank: "x", quelle: "welt" },
    { titel: "2", text: C, form: "meldung", bank: "y", quelle: "idee" },
    { titel: "3", text: D, form: "haiku", bank: "z", quelle: "wahrnehmung" },
  ]);
  ist("lauter verschiedene ergeben volle Vielfalt", b.vielfalt.formen, 1);
}
{
  const kurz = "Ein Satz.";
  const lang = A + " " + C + " " + D;
  wahr("verschiedene Längen zählen als Vielfalt",
    varianzBericht([{ titel: "1", text: kurz }, { titel: "2", text: lang }]).vielfalt.laengen > 0.5);
  wahr("gleiche Längen nicht",
    varianzBericht([{ titel: "1", text: C }, { titel: "2", text: D }]).vielfalt.laengen < 0.5);
}

// ── Ironische Nachsätze: selten, und keiner zweimal ─────────────────────────
// Gemeldet: acht Nachsätze („— natürlich", „— wie praktisch" …) in zwanzig
// Sätzen, „— natürlich" zweimal. Ironie lebt von der Seltenheit.
{
  const satz = "Der Wecker geht und der Traum geht weiter.";
  const text = Array.from({ length: 24 }, () => satz).join(" ");
  let maxAnzahl = 0, doppelt = 0, nachbarn = 0;
  for (let i = 0; i < 60; i++) {
    const t = applyToneRegister(text, "ironisch");
    const tags = t.match(/— (angeblich|so hieß es|was auch immer das heißen sollte|natürlich|wie praktisch|oder so ähnlich)\./g) || [];
    maxAnzahl = Math.max(maxAnzahl, tags.length);
    if (new Set(tags).size < tags.length) doppelt++;
    if (/— [^.]+\. Der Wecker geht und der Traum geht weiter — /.test(t)) nachbarn++;
  }
  wahr("höchstens drei Nachsätze je Text (60 Läufe, 24 Sätze)", maxAnzahl <= 3 && maxAnzahl >= 1);
  ist("kein Nachsatz zweimal", doppelt, 0);
  ist("nie zwei Sätze hintereinander", nachbarn, 0);
}

console.log(`Prüfstand Varianz — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Varianz: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Varianz: alle ${geprueft} Prüfungen bestanden.`);
}
