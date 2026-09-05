// Prüfstand Wächter-Statistik: features/waechterStatistik.ts + Zähler in
// Satz-Wächter, Umschreiber, Atomisierung + Sicht in Schaltplan und Diagnose.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
(globalThis as unknown as Record<string, unknown>).window = dom.window;
import { readFileSync } from "fs";
import { ladeStatistik, statistikKurz, statistikZuruecksetzen, zaehle } from "../src/features/waechterStatistik";
import { stueckPlausibel, pruefeSatz } from "../src/generation/satzwaechter";
import { praesensUmschreiben } from "../src/generation/coherence";
import { atomisiere } from "../src/atoms/atomisieren";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

statistikZuruecksetzen();
ist("frisch: nichts gezählt", statistikKurz().verworfen + statistikKurz().angenommen, 0);

// ── 1 · Der Wächter nennt seine Regel und zählt ─────────────────────────────
ist("Regel 1 erkannt", pruefeSatz("Eine bleiche Boje über dem Wasser und"), 1);
ist("Regel 3 erkannt", pruefeSatz("Ein Spiegelbild zeigt den Ritter als das, was nach dem Sinn und wird ausgeschlossen."), 3);
ist("Regel 6 erkannt", pruefeSatz("Gerade wenn alles verloren scheint, kommt das Licht wird heller."), 6);
ist("plausibel = 0", pruefeSatz("Der Morgen liegt grau über der Weide."), 0);
stueckPlausibel("Der Morgen liegt grau. Irgendwo wie Wärme ohne Ursache fest.");
stueckPlausibel("Der Morgen liegt grau über der Weide.");
{
  const st = ladeStatistik();
  ist("Regel 2 gezählt", st.zaehler.regel2, 1);
  wahr("mit Beispiel", (st.beispiele.regel2 || [])[0] === "Irgendwo wie Wärme ohne Ursache fest.");
  ist("durchgelassen gezählt", st.zaehler.angenommen, 1);
}

// ── 2 · Umschreiber und Atomisierung zählen ─────────────────────────────────
praesensUmschreiben("Das Herz schlug mir bis zum Hals.");
atomisiere("Die Fähre erreicht das Ufer schräg und zu spät, und niemand fehlt an diesem Abend am Steg", 14);
atomisiere("Ein Sturm bringt in drei Tagen den Regen eines ganzen Jahres über das Tal und die Höfe darüber", 14);
{
  const st = ladeStatistik();
  ist("umgeschrieben gezählt", st.zaehler.umgeschrieben, 1);
  wahr("mit Vorher → Nachher", /schlug .* → .*schlägt/.test((st.beispiele.umgeschrieben || [])[0] || ""));
  ist("zerlegt gezählt", st.zaehler.atomZerlegt, 1);
  ist("zu lang ganz gelassen gezählt", st.zaehler.atomGanzZuLang, 1);
}

// ── 3 · Kurzfassung und Deckel ──────────────────────────────────────────────
for (let i = 0; i < 8; i++) zaehle("regel4", `Beispiel ${i}`);
{
  const k = statistikKurz();
  ist("häufigste Regel", k.haeufigste, "regel4");
  ist("höchstens fünf Beispiele je Zähler", (ladeStatistik().beispiele.regel4 || []).length, 5);
  wahr("Quote zwischen 0 und 1", k.quote > 0 && k.quote < 1);
}
statistikZuruecksetzen();
ist("zurückgesetzt", statistikKurz().verworfen, 0);

// ── 4 · Sicht ───────────────────────────────────────────────────────────────
{
  const sp = readFileSync("src/features/schaltplan.ts", "utf8");
  wahr("Schaltplan hat den Knoten Satz-Wächter", /knoten\("waechter", 1, "Satz-Wächter"/.test(sp));
  const dg = readFileSync("src/ui/diagnoseView.ts", "utf8");
  wahr("Diagnose hat die Tafel mit Beispielen und Rücksetzknopf", /Wächter-Statistik — was die Regeln tun/.test(dg) && /Zähler zurücksetzen/.test(dg));
}

console.log(`Prüfstand Wächter-Statistik — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Wächter-Statistik: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Wächter-Statistik: alle ${geprueft} Prüfungen bestanden.`);
}
