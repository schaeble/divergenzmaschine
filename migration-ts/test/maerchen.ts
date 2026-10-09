const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand für die Gattung „Märchen" (4.376.0).
//
//   1. Die Erkennung des Helden aus dem Wer-Feld — Geschlecht und bestimmte
//      Form ohne Lexikon, nur aus Artikel, Adjektivendung und Nomen.
//   2. Die Matrix: 6 Wo × 4 Wann × 10 Wer × 5 Was × 4 Töne, jedes Märchen
//      gegen sein Blatt geprüft, 51 Presets reihum.
//   3. Gegenproben: Jede Prüfung bekommt einen Text mit absichtlichem Fehler.
import { buildMaerchen, pruefeMaerchen, erkenneHeld, maerchenTitel, maerchenTitelAusText } from "../src/generation/maerchen";
import { grammarFlags } from "../src/generation/grammar";
import { buildStory } from "../src/generation/buildStory";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { fuelle } from "../src/features/weltblatt";
import type { GenInput } from "../src/types";

const fehler: string[] = [];
const soll = (ok: boolean, was: string): void => { if (!ok) fehler.push(was); };

// ── 1 · Held ────────────────────────────────────────────────────────────────
const h = (w: string): string => { const x = erkenneHeld(w); return x ? `${x.def}|${x.rel}|${x.pron}` : "null"; };
soll(h("ein armer Schneider") === "der arme Schneider|der|er", `Held: armer Schneider → ${h("ein armer Schneider")}`);
soll(h("eine arme Müllerstochter") === "die arme Müllerstochter|die|sie", `Held: Müllerstochter → ${h("eine arme Müllerstochter")}`);
soll(h("ein kleines Mädchen") === "das kleine Mädchen|das|es", `Held: kleines Mädchen → ${h("ein kleines Mädchen")}`);
soll(h("ein Mädchen") === "das Mädchen|das|es", `Held: Mädchen ohne Adjektiv → ${h("ein Mädchen")}`);
soll(h("ein Rotkäppchen") === "das Rotkäppchen|das|es", `Held: -chen → ${h("ein Rotkäppchen")}`);
soll(h("ein Schneider") === "der Schneider|der|er", `Held: Schneider ohne Adjektiv → ${h("ein Schneider")}`);
soll(h("der jüngste Sohn") === "der jüngste Sohn|der|er", `Held: bestimmt → ${h("der jüngste Sohn")}`);
soll(h("Mara") === "Mara|der|Mara", `Held: Name → ${h("Mara")}`);
soll(h("Tom, Anna") === "Tom|der|Tom", `Held: erste Figur → ${h("Tom, Anna")}`);
soll(h("eine, die gehen muss") === "null" && h("jemand") === "null", "Held: Unbildbares wird gezogen");

// ── 2 · Matrix ──────────────────────────────────────────────────────────────
const WO = ["", "hinter den sieben Bergen", "in der Wüste", "Velmar", "in einem Keller", "eine Insel im Nordmeer"];
const WANN = ["", "vor langer Zeit", "im Jahr 1516", "morgen"];
const WER = ["", "ein armer Schneider", "eine arme Müllerstochter", "ein kleines Mädchen", "ein Mädchen", "der jüngste Sohn", "Mara", "Tom, Anna", "eine, die gehen muss", "jemand"];
const WAS = ["", "Der Brunnen im Dorf ist versiegt.", "kein Brot", "Die Königstochter lacht nicht mehr!", "Der Winter will nicht enden"];
const TOENE = ["uplifting", "dark", "ironisch", "nuechtern"];
const IDS = Object.keys(BUILTIN_PRESETS);

const funde = new Map<string, number>();
const beispiel = new Map<string, string>();
const laengen: Record<number, number[]> = { 110: [], 400: [] };
let laeufe = 0;
const gebrochen = { ja: 0, nein: 0 };
for (const where of WO) for (const when of WANN) for (const who of WER) for (const what of WAS) for (const tone of TOENE) {
  const lenTarget = laeufe % 2 ? 400 : 110;
  const bank = BUILTIN_PRESETS[IDS[laeufe % IDS.length]!]!;
  const r = buildMaerchen({ where, when, who, what, tone, form: "prose", lenTarget } as GenInput, bank);
  laeufe++;
  laengen[lenTarget]!.push(r.text.split(/\s+/).length);
  if (r.fb.gebrochen) gebrochen.ja++; else gebrochen.nein++;
  const befunde = pruefeMaerchen(r.text, r.fb, bank);
  // Der allgemeine Melder ohne „Verb-Kollision" (siehe test/utopie.ts) und
  // mit erlaubtem Artikel doppelt.
  const g = grammarFlags(r.text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1"));
  const echte = g.issues.filter((x) => !/^Verb-Kollision/.test(x));
  if (echte.length) befunde.push("Grammatik-Melder: " + echte.join("; "));
  // „Morgen, so erzählt man, lebte" darf nicht entstehen.
  if (/^(Morgen|Übermorgen|Bald|Heute), so erzählt man/.test(r.text)) befunde.push("Zukunftszeit in der Eingangsformel");
  if (!maerchenTitel(r.fb).trim()) befunde.push("Kein Titel");
  if (maerchenTitelAusText(r.text) !== maerchenTitel(r.fb)) befunde.push("Titel aus dem Text weicht vom Titel aus dem Blatt ab");
  for (const b of befunde) {
    const art = b.replace(/„[^"“]*["“]/g, "„…“").replace(/: .*$/, "");
    funde.set(art, (funde.get(art) || 0) + 1);
    if (!beispiel.has(art)) beispiel.set(art, `${b} ← ${JSON.stringify({ where, when, who, what, tone })}`);
  }
}
const mittel = (l: number[]): number => l.reduce((a, b) => a + b, 0) / l.length;
const kurz = laengen[110]!, lang = laengen[400]!;
soll(mittel(lang) - mittel(kurz) >= 25, `Textlänge bewegt zu wenig: ${mittel(kurz).toFixed(0)} → ${mittel(lang).toFixed(0)}`);
const viele = new Set<string>();
for (let i = 0; i < 20; i++) viele.add(buildMaerchen({ where: "", when: "", who: "", what: "", tone: "uplifting", form: "prose", lenTarget: 200 } as GenInput).text);
soll(viele.size >= 19, `Zu wenig Abwechslung: ${viele.size} aus 20`);

// Weiche
const basis = { where: "", when: "", who: "ein armer Schneider", what: "", tone: "uplifting", varLevel: "mid", structure: "rekombination", mode: "auto", perspective: "auto", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 150 } as unknown as GenInput;
const mitM = buildStory(BUILTIN_PRESETS["eichendorff"]!, { ...basis, form: "prose", welt: "maerchen" });
soll(/^Es war einmal ein armer Schneider/.test(mitM), "Weiche: Gattung Märchen + Prosa baut kein Märchen");
soll(!/Es war einmal/.test(buildStory(BUILTIN_PRESETS["eichendorff"]!, { ...basis, form: "bericht", welt: "maerchen" })), "Weiche: Bericht mit Gattung Märchen baut ein Märchen");

// ── 3 · Gegenproben ─────────────────────────────────────────────────────────
const gegen: string[] = [];
let gegenFehler = 0;
let r0 = buildMaerchen({ where: "", when: "", who: "der jüngste Sohn", what: "", tone: "uplifting", form: "prose", lenTarget: 400 } as GenInput, BUILTIN_PRESETS["eichendorff"]!);
for (let i = 0; i < 50 && !/, /.test(r0.fb.ziel); i++) r0 = buildMaerchen({ where: "", when: "", who: "der jüngste Sohn", what: "", tone: "uplifting", form: "prose", lenTarget: 400 } as GenInput, BUILTIN_PRESETS["eichendorff"]!);
const t0 = r0.text, fb0 = r0.fb, bank0 = BUILTIN_PRESETS["eichendorff"]!;
const probe = (name: string, text: string, muster: RegExp, fb = fb0, bank: typeof bank0 | undefined = bank0): void => {
  const ok = pruefeMaerchen(text, fb, bank).some((x) => muster.test(x));
  gegen.push(`    ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) gegenFehler++;
};
const sauber = pruefeMaerchen(t0, fb0, bank0);
gegen.push(`    ${sauber.length ? "✗" : "✓"} Ausgangstext ohne Befund${sauber.length ? ": " + sauber.join("; ") : ""}`);
if (sauber.length) gegenFehler++;
probe("Eingangsformel entfernt", t0.replace(/^Es war einmal /, "Damals war "), /Eingangsformel/);
probe("Prüfungen vertauscht", t0.replace("Zuerst kam", "§").replace("Danach kam", "Zuerst kam").replace("§", "Danach kam"), /Zuerst – Danach – Zuletzt/);
probe("Gabe vor dem Geben eingesetzt", t0.replace(fb0.gabe.akk, "etwas"), /Gabe nicht gegeben/);
probe("Gabe nicht eingesetzt", t0.replace(fuelle(fb0.gabe.einsatz, fb0.werte), "Es wurde Nacht."), /Gabe nicht eingesetzt/);
probe("Gegner bestimmt vor unbestimmt", t0.replace(/\n\n/, ` ${fb0.gegner.def[0]!.toUpperCase() + fb0.gegner.def.slice(1)} schlief.\n\n`), /Gegner bestimmt vor unbestimmt/);
probe("Bedingung gebrochen statt gehalten", t0.replace(fuelle(fb0.bedingung.gehalten, fb0.werte), fuelle(fb0.bedingung.gebrochen, fb0.werte)), /Bedingung nicht gehalten/);
probe("Schlussformel fehlt", t0.replace(/Und wenn sie nicht gestorben sind[^]*$/, "Ende."), /Schlussformel/);
probe("Mangel fehlt", t0.replace(fb0.mangel!.satz, "Eines Tages war alles gut."), /Mangel fehlt/);
probe("Platzhalter", t0.replace(fb0.held.def, "{H}"), /Platzhalter/);
probe("Komma nach Relativsatz fehlt (Fund beim Lesen)", t0.replace(fb0.ziel + ",", fb0.ziel), /Komma nach Relativsatz/);
probe("Held nach Präposition (Fund beim Lesen)", t0.replace(/\n\n/, ` Das erzählte man von ${fb0.held.def}.\n\n`), /falscher Fall/);
probe("Motiv aus fremdem Preset", t0, /nicht aus dem Preset/, fb0, BUILTIN_PRESETS["kafka"]!);
probe("Motiv entfernt", t0.replace(/Unterwegs sah [^:]+: [^.]+\. ?/, ""), /Preset ohne Wirkung/);
probe("Doppeltes Wort", t0.replace(/ und /, " und und "), /Doppeltes Wort/);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Märchen: ${laeufe} Läufe (6 Wo × 4 Wann × 10 Wer × 5 Was × 4 Töne, 51 Presets reihum)`);
console.log(`  Umfang bei Ziel 110: ${Math.min(...kurz)}–${Math.max(...kurz)} Wörter, Mittel ${mittel(kurz).toFixed(0)}`);
console.log(`  Umfang bei Ziel 400: ${Math.min(...lang)}–${Math.max(...lang)} Wörter, Mittel ${mittel(lang).toFixed(0)}`);
console.log(`  Bedingung gebrochen in ${gebrochen.ja} von ${laeufe} Läufen (Blick „dunkel")`);
console.log(`  Abwechslung: ${viele.size} verschiedene Texte aus 20 gleichen Eingaben`);
if (funde.size) {
  console.log("  Befunde:");
  for (const [art, n] of [...funde.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(5)}×  ${art}`);
    console.log(`           ${beispiel.get(art)}`);
  }
} else console.log("  keine Fehlerklasse ausgelöst");
console.log("  Gegenproben:");
gegen.forEach((z) => console.log(z));
fehler.forEach((f) => console.log(`  - ${f}`));

const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
const summe = [...funde.values()].reduce((a, b) => a + b, 0);
if (summe || gegenFehler || fehler.length) {
  console.error(`\n❌ Märchen: ${summe} Befund(e) in ${laeufe} Läufen, ${gegenFehler} Gegenprobe(n) ohne Wirkung, ${fehler.length} Einzelprüfung(en) rot.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Märchen: ${laeufe} Läufe ohne Befund, alle Gegenproben schlagen an.`);
}
