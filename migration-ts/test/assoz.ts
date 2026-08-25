// Prüfstand Assoziationskette.
//
// Bis 4.316 baute der Reiter SIEBEN Ketten gleichzeitig, eine je Form,
// nebeneinander. Das ist eine Auslage und kein Werkzeug: Man wählt nicht, man
// betrachtet. Und der einzige Ausgang verteilte die Glieder auf die vier W —
// erstes als Wer, zweites als Wo, drittes als Wann. Eine Kette ist aber eine
// Reihe von Assoziationen und kein Vierertupel; „Nebel" als Wer ergibt Unsinn,
// und dann drückt man den Knopf kein zweites Mal.
//
// Was fehlte, war nicht Auswahl, sondern BEWEGUNG — und ein Ausgang, der das
// Material erreicht.
import { readFileSync } from "fs";
import { chainFor, setzeFort, verwirf, alsMotive, alsBilder } from "../src/generation/assoc";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const TEXT = "Der Nebel liegt über dem Blech. Das Blech rostet im Regen. Der Regen trifft die Akte. "
  + "Die Akte liegt im Zimmer. Das Zimmer hat keine Fenster. Der Nebel kehrt zurück.";
const K = chainFor("prose", "Nebel", TEXT, 6);

// ── 1 · Die Kette selbst ────────────────────────────────────────────────────
ist("das Saatwort steht vorn", K[0], "Nebel");
wahr(`die Kette hat Glieder (${K.length})`, K.length >= 4);
ist("kein Glied kommt zweimal vor", new Set(K.map((x) => x.toLowerCase())).size, K.length);

// ── 2 · Weitergehen ─────────────────────────────────────────────────────────
// Ein Glied anzutippen heißt nicht „lies mir das vor", sondern „von hier aus
// weiter" — und der Weg dorthin MUSS stehen bleiben. Ohne das wäre es kein
// Fortsetzen, sondern ein Neuanfang mit anderem Saatwort.
const F = setzeFort(K, 2, TEXT, 6);
ist("der Weg bis dorthin bleibt stehen", F.slice(0, 3).join(), K.slice(0, 3).join());
wahr("und es geht weiter", F.length > 3);
// Gegenprobe: Ab dem letzten Glied ist nichts fortzusetzen, aber es darf auch
// nichts kaputtgehen.
wahr("vom letzten Glied aus bleibt die Kette ganz",
  setzeFort(K, K.length - 1, TEXT, K.length).length >= K.length - 1);
ist("vom ersten Glied aus bleibt das Saatwort", setzeFort(K, 0, TEXT, 5)[0], "Nebel");
ist("eine leere Kette ergibt nichts", setzeFort([], 0, TEXT, 5).length, 0);
// Kein Kreis: Was schon dastand, darf nicht wiederkommen.
ist("die Fortsetzung wiederholt nichts", new Set(F.map((x) => x.toLowerCase())).size, F.length);

// ── 3 · Verwerfen ───────────────────────────────────────────────────────────
const V = verwirf(K, 2, TEXT);
ist("der Weg davor bleibt", V.slice(0, 2).join(), K.slice(0, 2).join());
wahr("das verworfene Glied ist weg", V[2] !== K[2]);
// Das Saatwort bleibt: Ohne es hat die Kette keinen Ausgangspunkt, und „verwirf
// das Saatwort" wäre in Wahrheit „fang neu an".
ist("das Saatwort lässt sich nicht verwerfen", verwirf(K, 0, TEXT).join(), K.join());
ist("eine einglied­rige Kette bleibt", verwirf(["Nebel"], 0, TEXT).join(), "Nebel");

// ── 4 · Der Ausgang in die Wortbank ─────────────────────────────────────────
// Der Ort, an dem eine Kette wirklich etwas bewirkt. Ein Motiv MUSS eine
// Nominalphrase mit Artikel und eigenem Kopf sein — bloße Wörter lassen den
// Zusammenbau mitten im Text abbrechen.
const M = alsMotive(K);
wahr(`es entstehen Motive (${M.length})`, M.length >= 2);
wahr("jedes beginnt mit einem Artikel", M.every((x) => /^ein /.test(x)));
wahr("und trägt einen eigenen Kopf", M.every((x) => /^ein \S+ über dem \S+$/.test(x)));
// Nur großgeschriebene Glieder werden zum Kopf: Im Deutschen sind das die
// Substantive, und nur die können eine Nominalphrase anführen.
const gemischt = ["Nebel", "rostet", "Blech", "trifft", "Akte"];
wahr("Verben werden nicht zum Kopf",
  alsMotive(gemischt).every((x) => !/rostet|trifft/.test(x)));
ist("zu wenige Substantive ergeben kein Motiv", alsMotive(["Nebel", "rostet"]).length, 0);
ist("eine leere Kette auch nicht", alsMotive([]).length, 0);

const B = alsBilder(K);
wahr(`es entstehen Bilder (${B.length})`, B.length >= 1);
wahr("sie sind Vergleiche", B.every((x) => /^wie \S+ hinter \S+$/.test(x)));

// ── 5 · Die Ansicht ─────────────────────────────────────────────────────────
const q = readFileSync("src/ui/assocView.ts", "utf8");
// EINE Kette statt sieben.
ist("es werden nicht mehr sieben Ketten gebaut", /buildAllChains/.test(q), false);
wahr("sondern eine", /chainFor\("prose"/.test(q));
// Jedes Glied ist ein Knopf.
wahr("die Glieder sind anklickbar", /g\.addEventListener\("click"/.test(q));
wahr("mit Alt-Taste wird verworfen", /e\.altKey \? verwirf/.test(q));
// Der Ausgang in die Wortbank ist da.
wahr("es gibt einen Ausgang in die Wortbank", /in die Wortbank/.test(q));
wahr("und er schreibt sie wirklich", /saveBank\(neu\)/.test(q));
// „→ Studio" nur noch in EIN Feld — die Streuung über die vier W ist weg.
ist("die Streuung über die vier W ist weg", /who: L\[0\]/.test(q), false);
wahr("die Kette geht als Was ins Studio", /\{ what: kette\.join/.test(q));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Assoziationskette — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler in der Assoziationskette:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Assoziationskette: alle ${geprueft} Prüfungen bestanden.`);
}
