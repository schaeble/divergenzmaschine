// Prüfstand Selbstreinigung des Korpus: corpus.ts + Korpus-Reiter.
//
// Gewünscht: Doppelte Sätze und Bruchstücke sollen automatisch gehen — wie
// der Schalter „Korpus säubern", ohne Klick.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { appendToPersistentCorpus, loadPersistentCorpus, savePersistentCorpus, selbstreinigungAn, setzeSelbstreinigung, letzteReinigung } from "../src/corpus";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const zaehl = (satz: string): number => (loadPersistentCorpus().match(new RegExp(satz.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || []).length;

wahr("Vorgabe: an", selbstreinigungAn());
savePersistentCorpus("");
appendToPersistentCorpus("Der Fährmann zählt am Morgen die Ruder. Ein Riemen fehlt seit dem letzten Sturm. Das Wasser steht still wie ein Gedanke.");
appendToPersistentCorpus("Der Fährmann zählt am Morgen die Ruder. Die Glocke am Steg schlägt von allein. Ein Riemen fehlt seit dem letzten Sturm.");
ist("doppelte Sätze bleiben nur einmal", zaehl("Der Fährmann zählt am Morgen die Ruder"), 1);
ist("auch der zweite Doppelgänger", zaehl("Ein Riemen fehlt seit dem letzten Sturm"), 1);
wahr("die neuen Sätze sind da", zaehl("Die Glocke am Steg schlägt von allein") === 1);
wahr("die letzte Reinigung ist abrufbar", !!letzteReinigung() && (letzteReinigung()!.duplicates >= 1));

setzeSelbstreinigung(false);
ist("Schalter aus wird gehalten", selbstreinigungAn(), false);
appendToPersistentCorpus("Der Fährmann zählt am Morgen die Ruder. Noch ein Satz für den Korpus hier.");
ist("aus: Duplikate bleiben stehen", zaehl("Der Fährmann zählt am Morgen die Ruder"), 2);
setzeSelbstreinigung(true);
appendToPersistentCorpus("Ein weiterer Satz kommt hinzu und räumt auf.");
ist("wieder an: die nächste Zugabe räumt auch Altes auf", zaehl("Der Fährmann zählt am Morgen die Ruder"), 1);
savePersistentCorpus("");

const q = readFileSync("src/ui/korpusView.ts", "utf8");
wahr("der Korpus-Reiter hat den Schalter", /"korp-selbstreinigung"/.test(q) && /Selbstreinigung: Duplikate und Bruchstücke automatisch entfernen/.test(q));
wahr("und zeigt die letzte Reinigung", /zuletzt \$\{l\.zeit\}: \$\{l\.removed\} entfernt/.test(q));
const c = readFileSync("src/corpus.ts", "utf8");
wahr("alle Zugänge gehen durch appendToPersistentCorpus — dort sitzt die Reinigung", /if \(selbstreinigungAn\(\)\) \{\s*\n\s*const h = corpusHygiene\(corpus\);/.test(c));

console.log(`Prüfstand Selbstreinigung — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Selbstreinigung: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Selbstreinigung: alle ${geprueft} Prüfungen bestanden.`);
