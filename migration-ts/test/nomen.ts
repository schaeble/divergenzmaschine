// Prüfstand Nomen: Genus aus Tabelle und Regel (declension.ts, nouns2.data.ts).
//
// Gemessen vor 4.331.1: 63 % der Nomen aus Presets und Vorräten hatten ein
// Genus; danach 90 % — der Rest sind Plurale, Genitive und Namen. Ohne Genus
// gibt es keinen Artikel, keinen Akkusativ, keinen Dativ.
import { guessGender } from "../src/generation/declension";
import { normWhere, normWho } from "../src/generation/ctxnorm";
import { dekliniere } from "../src/atoms/assemble";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};

// ── 1 · Tabelle, zweiter Teil ───────────────────────────────────────────────
for (const [w, g] of [["Ende", "n"], ["Jahr", "n"], ["Anfang", "m"], ["Welt", "f"], ["Fall", "m"], ["Arbeit", "f"],
  ["Ziel", "n"], ["Post", "f"], ["Geld", "n"], ["Mund", "m"], ["Text", "m"], ["Gras", "n"], ["Blut", "n"],
  ["Markt", "m"], ["Kaserne", "f"], ["Büro", "n"], ["Volk", "n"], ["Staat", "m"], ["Nacht", "f"], ["Fluss", "m"]] as const) {
  ist(`Genus ${w}`, guessGender(w), g);
}

// ── 2 · Regeln ──────────────────────────────────────────────────────────────
ist("substantivierter Infinitiv: Leben", guessGender("Leben"), "n");
ist("substantivierter Infinitiv: Schweigen", guessGender("Schweigen"), "n");
ist("substantivierter Infinitiv: Warten", guessGender("Warten"), "n");
ist("Ge…e ist Neutrum: Gebäude", guessGender("Gebäude"), "n");
ist("-e ist feminin: Ursache", guessGender("Ursache"), "f");
ist("-e ist feminin: Tapete", guessGender("Tapete"), "f");
ist("-e ist feminin: Schleuse", guessGender("Schleuse"), "f");
// Gegenproben: Die Ausnahmen der -e-Regel.
ist("Auge bleibt Neutrum", guessGender("Auge"), "n");
ist("Name bleibt Maskulinum", guessGender("Name"), "m");
ist("Kollege bleibt Maskulinum", guessGender("Kollege"), "m");
ist("Bote bleibt Maskulinum", guessGender("Bote"), "m");
ist("Kompositum nimmt das Grundwort: Kanalufer", guessGender("Kanalufer"), "n");
ist("Kompositum: Straßenanfang", guessGender("Straßenanfang"), "m");

// ── 3 · Wirkung: Artikel und Fälle ──────────────────────────────────────────
ist("Wo ohne Artikel: Kaserne → in der Kaserne", normWhere("Kaserne"), "in der Kaserne");
ist("Wo ohne Artikel: Büro → im Büro", normWhere("Büro"), "im Büro");
ist("Wo ohne Artikel: Markt → auf dem Markt", normWhere("Markt"), "auf dem Markt");
ist("Wer ohne Artikel: Nachbar → Ein Nachbar", normWho("Nachbar"), "ein Nachbar");
ist("Akkusativ eines schwachen Maskulinums", dekliniere("Der Kollege", "akk"), "den Kollegen");
ist("Dativ feminin", dekliniere("Die Schleuse", "dat"), "der Schleuse");

console.log(`Prüfstand Nomen — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Nomen: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Nomen: alle ${geprueft} Prüfungen bestanden.`);
}
