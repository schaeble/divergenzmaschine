const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand für die Form „Meldung".
//
// Die Meldung ist die strengste Form der Maschine: Sie hat fünf Zusagen, und
// jede davon lässt sich zählen. Dieser Lauf prüft sie über dieselbe Matrix
// schwieriger Eingaben, mit der auch der Bericht geprüft wird — dieselben
// Titel, Rechtsformen, Plurale und leeren Felder, die dort Fehler erzeugt haben.
//
// Der zweite Teil ist wichtiger als der erste: GEGENPROBEN. Jede Prüfung
// bekommt einen Text, in dem der Fehler absichtlich steckt. Schlägt sie dort
// nicht an, ist sie keine Prüfung, sondern Zierrat — und ein grüner Lauf über
// 2880 Meldungen wäre wertlos.
import { buildMeldung, pruefeMeldung, saetzeVon } from "../src/generation/meldung";
import { hatFinitesVerb } from "../src/atoms/derive";
import type { GenInput } from "../src/types";

const WER = [
  "Dr. Ing. Richard Doll", "Reinhard Kraus", "die Ostmoor-Werft", "Ritter Ltd",
  "FC Liverpool", "das Stadttheater", "das Tief Ottilie", "Prof. Schwarz",
];
const WAS = [
  "will den Konzern DAS GmbH schließen", "produziert keine Lanzen mehr",
  "probt den Aufstand auf der Bühne", "spielt für FC Liverpool",
  "zeigt keine Opern mehr", "stellt den Betrieb ein",
  "will die Sonne ausknipsen", "warnt vor schweren Gewittern",
  "bringt Dauerregen über die Küste",
];
const WANN = ["Frühjahr 2001", "im Jahr 1855", "am Donnerstag", "2100", ""];
const WO = ["in Dürrhausen", "in London", "Ostmoor", ""];
const TOENE = ["uplifting", "dark"];

/** Muster, die in einer Meldung nie stehen dürfen. */
const VERBOTEN: [string, RegExp][] = [
  ["Artikel vor Rechtsform", /\b(der|die|das) (Ltd|GmbH|AG|SE|KG|Inc)\b/],
  ["zweiter Doppelpunkt", /:[^:]*:/],
  ["Zeitangabe ohne Präposition am Satzanfang", /(^|\. )[A-ZÄÖÜ][a-zäöüß]+ \d{4} (wurde|zeichnet|liegt)\b/],
  ["Nomen kleingeschrieben nach im", /\bIm [a-zäöüß]+ \d{4}\b/],
  ["literarische Formel", /Der Einsatz ist |Was zählt, ist |Alles dreht sich um /],
  ["Zitat in der Meldung", /„[^“]*“,\s*sag/],
];

const ein = (who: string, was: string, wann: string, wo: string, tone: string, len = 60): GenInput => ({
  where: wo, when: wann, who, what: was, form: "meldung", tone,
  mode: "auto", structure: "auto", perspective: "third", rhythm: "auto",
  varLevel: "auto", markovMode: "off", archetypeA: "neutral", archetypeB: "neutral",
  disruptor: "none", instability: "0", lenTarget: len,
} as unknown as GenInput);

// ── 1 · Die Matrix ──────────────────────────────────────────────────────────
const funde = new Map<string, number>();
const beispiel = new Map<string, string>();
let laeufe = 0, woerterSumme = 0, minW = 999, maxW = 0;
const melde = (art: string, text: string): void => {
  funde.set(art, (funde.get(art) || 0) + 1);
  if (!beispiel.has(art)) beispiel.set(art, text.slice(0, 150));
};

for (const who of WER) for (const was of WAS) for (const wann of WANN) for (const wo of WO) for (const tone of TOENE) {
  const { text, fb } = buildMeldung(ein(who, was, wann, wo, tone));
  laeufe++;
  const n = (text.match(/[A-Za-zÄÖÜäöüß0-9][A-Za-zÄÖÜäöüß0-9.,-]*/g) || []).length;
  woerterSumme += n; minW = Math.min(minW, n); maxW = Math.max(maxW, n);
  for (const m of pruefeMeldung(text, fb)) melde(m.art, `${m.stelle} — ${text}`);
  for (const [name, re] of VERBOTEN) if (re.test(text)) melde(name, text);
  // Jeder Satz braucht ein finites Verb. Der Fall stammt aus dem Bau: Die
  // Chronologie liefert Nominalphrasen, und daraus wurde „Im Frühjahr die
  // erste Meldung." — ein Satz ohne Aussage.
  for (const s of saetzeVon(text)) {
    const rumpf = s.includes(":") ? s.split(":").pop()! : s;
    if (!hatFinitesVerb(rumpf)) melde("Satz ohne finites Verb", s);
  }
}

// ── 2 · Gegenproben: Jede Sperre bekommt ihren Fehler ───────────────────────
const { fb: gfb } = buildMeldung(ein("die Ostmoor-Werft", "stellt den Betrieb ein", "am Donnerstag", "in Dürrhausen", "dark"));
const arten = (t: string): string[] => pruefeMeldung(t, gfb).map((x) => x.art);
const gegen: [string, string, string][] = [
  ["fremder Name", "Am Donnerstag ist in Dürrhausen bekannt geworden: Die Ostmoor-Werft stellt den Betrieb ein. Das teilt Sprecherin Judith Siewert mit. Weitere Angaben liegen zunächst nicht vor.", "fremder Personenname"],
  ["erfundene Zahl", "Am Donnerstag ist in Dürrhausen bekannt geworden: Die Ostmoor-Werft stellt den Betrieb ein. Betroffen sind 99999 Beschäftigte. Weitere Angaben liegen zunächst nicht vor.", "Zahl ohne Faktenblatt"],
  ["Wertung", "Am Donnerstag ist in Dürrhausen bekannt geworden: Die Ostmoor-Werft stellt den Betrieb ein. Das ist schrecklich für alle. Weitere Angaben liegen zunächst nicht vor.", "Wertung"],
  ["zu lang", "Am Donnerstag ist in Dürrhausen bekannt geworden: Die Ostmoor-Werft stellt den Betrieb ein. " + "Es geht weiter und weiter und immer noch weiter und kein Ende ist in Sicht ".repeat(6), "zu lang"],
  ["zu kurz", "Am Donnerstag ist in Dürrhausen bekannt: Die Werft schließt.", "zu kurz"],
  ["Wo fehlt", "Am Donnerstag ist es bekannt geworden: Die Ostmoor-Werft stellt den Betrieb ein. Betroffen sind viele. Weitere Angaben liegen zunächst nicht vor.", "Wo fehlt im ersten Satz"],
  ["Tempus gemischt", "Am Donnerstag ist in Dürrhausen bekannt geworden: Die Ostmoor-Werft stellt den Betrieb ein. Betroffen sind viele Zulieferer. Das teilte die Sprecherin mit.", "zwei Tempora im Rumpf"],
];
let gegenFehler = 0;
const gegenZeilen: string[] = [];
for (const [name, text, erwartet] of gegen) {
  const a = arten(text);
  const trifft = a.includes(erwartet);
  gegenZeilen.push(`  ${trifft ? "✓" : "✗"} ${name} → ${erwartet}${trifft ? "" : ` (gemeldet: ${a.join(", ") || "nichts"})`}`);
  if (!trifft) gegenFehler++;
}
// Und der Gegentest zum Gegentest: Eine saubere Meldung darf NICHTS auslösen.
const sauber = buildMeldung(ein("die Ostmoor-Werft", "stellt den Betrieb ein", "am Donnerstag", "in Dürrhausen", "dark"));
const sauberFunde = pruefeMeldung(sauber.text, sauber.fb);
gegenZeilen.push(`  ${sauberFunde.length === 0 ? "✓" : "✗"} saubere Meldung löst nichts aus${sauberFunde.length ? " (" + sauberFunde.map((x) => x.art).join(", ") + ")" : ""}`);
if (sauberFunde.length) gegenFehler++;
// Satzgrenze an einer Abkürzung.
const abk = saetzeVon("Am Montag ist es bekannt geworden: Prof. Schwarz warnt. Das ist alles.");
gegenZeilen.push(`  ${abk.length === 2 ? "✓" : "✗"} „Prof." beendet keinen Satz (${abk.length} Sätze)`);
if (abk.length !== 2) gegenFehler++;

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Meldung: ${laeufe} Läufe (8 Wer × 9 Was × 5 Wann × 4 Wo × 2 Töne)`);
console.log(`  Umfang: ${(woerterSumme / laeufe).toFixed(1)} Wörter im Mittel, ${minW}–${maxW}`);
if (funde.size) {
  console.log("  Befunde:");
  for (const [art, n] of [...funde.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(5)}×  ${art}`);
    console.log(`           ${beispiel.get(art)}`);
  }
} else {
  console.log("  keine Fehlerklasse ausgelöst");
}
console.log("  Gegenproben:");
gegenZeilen.forEach((z) => console.log(z));

const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
const summe = [...funde.values()].reduce((a, b) => a + b, 0);
if (summe || gegenFehler) {
  console.error(`\n❌ Meldung: ${summe} Befund(e) in ${laeufe} Läufen, ${gegenFehler} Gegenprobe(n) ohne Wirkung.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Meldung: ${laeufe} Läufe ohne Befund, alle Gegenproben schlagen an.`);
}
