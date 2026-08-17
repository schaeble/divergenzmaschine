// Prüfstand KI-Lehrer. Kein einziger Aufruf geht an die API — geprüft wird
// alles, was OHNE Geld prüfbar ist: die Prompts, die Token- und Kostenrechnung
// und das Konto.
//
// Das ist hier keine Sparsamkeit, sondern die einzige Möglichkeit: Ein Prüfstand,
// der bei jedem Lauf bezahlt, wird bald nicht mehr gestartet.
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
const g = globalThis as unknown as Record<string, unknown>;
g.localStorage = dom.window.localStorage;

import {
  AUFTRAEGE, auftragVon, bauePrompt, schaetzeTokens, maxToken,
  MODELLE, modellVon, kostenUsd, euro,
  ladeKonto, bucheKonto, sichereKonto, KONTO_KEY,
} from "../src/features/lehrer";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const TEXT = "Ein Waisenkind mit geerbtem Gedächtnis will verschwinden, mit den falschen Werkzeugen.";

// ── 1 · Die Aufträge ────────────────────────────────────────────────────────
ist("vier Aufträge", AUFTRAEGE.length, 4);
wahr("jeder hat Namen, Beschreibung und Aufforderung",
  AUFTRAEGE.every((a) => !!a.name && !!a.kurz && !!a.wunschLabel && !!a.wunschPlatzhalter));
ist("die Korrektur braucht keine Vorstellung", auftragVon("grammatik").wunschNoetig, false);
wahr("die drei anderen schon",
  AUFTRAEGE.filter((a) => a.art !== "grammatik").every((a) => a.wunschNoetig));
ist("eine unbekannte Art fällt auf den ersten Auftrag zurück", auftragVon("quatsch").art, "grammatik");

// ── 2 · Die Prompts ─────────────────────────────────────────────────────────
// Der Gegenzug gegen das Glätten muss in JEDEM stehen. Ohne ihn zieht das
// Modell zur Mitte, und das ist die Gegenbewegung zur Divergenz.
for (const a of AUFTRAEGE) {
  const p = bauePrompt(a.art, TEXT, "mein Wunsch", 250);
  wahr(`„${a.name}“: der Text ist drin`, p.includes(TEXT));
  wahr(`„${a.name}“: der Gegenzug gegen das Glätten steht drin`, /Glätte ihn nicht zur Mitte/.test(p));
  wahr(`„${a.name}“: der Wunsch ist drin`, p.includes("mein Wunsch"));
  wahr(`„${a.name}“: die Antwort soll deutsch sein`, /[Dd]eutsch/.test(p));
}
// Gegenprobe: Ein Prompt OHNE Gegenzug müsste auffallen — sonst prüft die
// Regel oben nur, dass irgendein deutscher Text da ist.
wahr("die Gegenzug-Prüfung schlägt bei einem Text ohne ihn an",
  !/Glätte ihn nicht zur Mitte/.test("Bitte den Text schöner machen."));

const pg = bauePrompt("grammatik", TEXT, "", 300);
wahr("die Korrektur verbietet ausdrücklich Wortwahl-Eingriffe", /Ändere KEINE Wortwahl/.test(pg));
wahr("und verlangt die Änderungsliste", /— Änderungen —/.test(pg));
wahr("ohne Wunsch steht auch keine leere Vorgabe drin", !/Zusätzliche Vorgabe des Nutzers: *\n/.test(pg));
wahr("die Ziellänge kommt in der Korrektur nicht vor", !/etwa 300 Wörtern/.test(pg));
wahr("im Plot dagegen schon", /etwa 250 Wörtern/.test(bauePrompt("plot", TEXT, "w", 250)));
// Fehlt die Vorstellung, wird sie nicht stillschweigend erfunden, sondern
// benannt — sonst führe der Lehrer einen Auftrag aus, den niemand erteilt hat.
wahr("ohne Vorstellung sagt der Prompt das ausdrücklich",
  /keine genannt|keiner genannt|nichts genannt/.test(bauePrompt("plot", TEXT, "", 300)));

// ── 3 · Token und Deckel ────────────────────────────────────────────────────
ist("leerer Text kostet nichts", schaetzeTokens(""), 0);
wahr("die Schätzung wächst mit dem Text", schaetzeTokens(TEXT + TEXT) > schaetzeTokens(TEXT));
// Lieber zu hoch als zu niedrig: Eine Schätzung, die die Rechnung unterbietet,
// ist schlimmer als gar keine. Deutsch liegt bei rund 3 Zeichen je Token.
wahr("und liegt über einer Zeichenzahl durch vier", schaetzeTokens(TEXT) > TEXT.length / 4);

wahr("der Deckel hält unter dem Modell-Limit",
  MODELLE.every(() => maxToken("prosa", TEXT, 3000) <= 8192));
wahr("eine unsinnige Ziellänge wird gefangen", maxToken("prosa", TEXT, -50) > 0);
wahr("die Korrektur richtet sich nach dem Text, nicht nach der Ziellänge",
  maxToken("grammatik", TEXT, 40) === maxToken("grammatik", TEXT, 3000));
wahr("ein längerer Text bekommt bei der Korrektur mehr Platz",
  maxToken("grammatik", TEXT + TEXT + TEXT, 300) > maxToken("grammatik", TEXT, 300));

// ── 4 · Kosten ──────────────────────────────────────────────────────────────
const haiku = modellVon("claude-haiku-4-5");
ist("ein unbekanntes Modell fällt auf das günstigste zurück", modellVon("gibtsnicht").id, MODELLE[0]!.id);
wahr("Ausgabe kostet mehr als Eingabe", MODELLE.every((m) => m.aus > m.ein));
ist("eine Million Eingabetoken kosten den Eingabepreis", kostenUsd(1_000_000, 0, haiku), haiku.ein);
ist("eine Million Ausgabetoken den Ausgabepreis", kostenUsd(0, 1_000_000, haiku), haiku.aus);
ist("nichts kostet nichts", kostenUsd(0, 0, haiku), 0);
ist("negative Zahlen ergeben keine Gutschrift", kostenUsd(-5000, -5000, haiku), 0);
// „0,00 €“ läse sich wie „kostenlos“. Das ist es nicht.
ist("Kleinstbeträge werden nicht auf null gerundet", euro(0.0004, 0.92), "unter 1 Cent");
ist("und null bleibt null", euro(0, 0.92), "0,00 €");
ist("ein Euro-Betrag wird deutsch geschrieben", euro(1.5, 1), "1,50 €");

// ── 5 · Konto ───────────────────────────────────────────────────────────────
localStorage.removeItem(KONTO_KEY);
const k0 = ladeKonto();
ist("ohne Eintrag ist das Konto leer", k0.laeufe, 0);
const k1 = bucheKonto(k0, 1000, 500, haiku);
ist("ein Lauf wird gezählt", k1.laeufe, 1);
ist("Eingabetoken werden addiert", k1.ein, 1000);
ist("Ausgabetoken auch", k1.aus, 500);
ist("und die Kosten stimmen", Math.round(k1.usd * 1e6), Math.round((1000 * 1 + 500 * 5) / 1e6 * 1e6));
const k2 = bucheKonto(k1, 200, 100, haiku);
ist("zwei Läufe addieren sich", k2.laeufe, 2);
ist("und die Token auch", k2.ein, 1200);
sichereKonto(k2);
ist("das Konto übersteht das Speichern", ladeKonto().ein, 1200);
ist("und die Läufe auch", ladeKonto().laeufe, 2);
wahr("es wandert in die Projektdatei", KONTO_KEY.startsWith("divergenz_"));
// Gegenprobe: Kaputter Inhalt darf nicht zu NaN führen — ein Konto, das „NaN €“
// anzeigt, sieht aus wie ein Fehler und ist dann keiner mehr zu finden.
localStorage.setItem(KONTO_KEY, "{kein json");
ist("kaputter Speicherinhalt gibt ein leeres Konto", ladeKonto().laeufe, 0);
localStorage.setItem(KONTO_KEY, JSON.stringify({ laeufe: "viele", ein: null, usd: "x" }));
ist("und Unsinn in den Feldern ergibt Zahlen, nicht NaN", Number.isFinite(ladeKonto().usd), true);
ist("auch bei den Läufen", ladeKonto().laeufe, 0);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand KI-Lehrer — ${geprueft} Prüfungen (ohne einen einzigen API-Aufruf):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler beim KI-Lehrer:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ KI-Lehrer: alle ${geprueft} Prüfungen bestanden.`);
}
