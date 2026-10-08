const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand für die Welt „Utopie" (4.373.0).
//
// Drei Teile:
//   1. Die Erkennung der vier W — was macht das Studio aus einer Eingabe?
//   2. Die Matrix: 8 Wo × 5 Wann × 8 Wer × 7 Was × 4 Töne, jede Utopie gegen
//      ihr eigenes Weltblatt geprüft (Zahlen, Namen, Rat, Kehrseite, Brauch,
//      Vorrang der Ortsangabe, Satzbau, Blickwinkel).
//   3. Gegenproben: Jede Prüfung bekommt einen Text mit absichtlich
//      eingebautem Fehler. Schlägt sie dort nicht an, ist sie keine.
import { buildUtopie, pruefeUtopie } from "../src/generation/utopie";
import { erkenneLage, erkenneErzaehler, erkenneZeit, erkenneGrundsatz, istNurName } from "../src/features/weltblatt";
import { grammarFlags } from "../src/generation/grammar";
import { buildStory } from "../src/generation/buildStory";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { GenInput } from "../src/types";

const fehler: string[] = [];
const soll = (ok: boolean, was: string): void => { if (!ok) fehler.push(was); };

// ── 1 · Erkennung ───────────────────────────────────────────────────────────
soll(erkenneLage("eine Insel im Nordmeer") === "insel", "Lage: Insel");
soll(erkenneLage("in der Wüste") === "wueste", "Lage: Wüste");
soll(erkenneLage("eine Stadt unter dem Eis") === "eis", "Lage: Stadt unter dem Eis ist Eis, nicht Stadt");
soll(erkenneLage("in einem Keller") === null, "Lage: Keller unbekannt");
soll(istNurName("Velmar") && !istNurName("Wüste") && !istNurName("in Velmar"), "Lage: bloßer Name");
soll(erkenneErzaehler("eine, die gehen muss").art === "gehend", "Wer: gehend über das Komma hinweg");
soll(erkenneErzaehler("ein Reisender").art === "gast" && erkenneErzaehler("ein Reisender").rolle === "Reisender", "Wer: Reisender → Gast, Rolle ohne Artikel");
soll(erkenneErzaehler("Mara").name === "Mara", "Wer: Name");
soll(erkenneErzaehler("die Fischerin").art === "bewohner" && erkenneErzaehler("die Fischerin").rolleIchBin === "Fischerin", "Wer: Fischerin → Bewohner, „Ich bin Fischerin“");
soll(erkenneErzaehler("ein alter Bewohner").rolleIchBin === "ein alter Bewohner", "Wer: Adjektiv behält den Artikel");
soll(erkenneZeit("nach dem letzten Krieg") === "nachbruch", "Wann: nach dem Krieg");
soll(erkenneZeit("im Jahr 2300") === "zukunft" && erkenneZeit("im Jahr 1516") === "vergangenheit", "Wann: Jahreszahl");
soll(erkenneZeit("vor zweihundert Jahren") === "vergangenheit", "Wann: vor … Jahren");
soll(erkenneGrundsatz("Es gibt kein Geld.")?.id === "geld", "Was: Geld");
soll(erkenneGrundsatz("Die Gesetze verfallen")?.id === "gesetz", "Was: Gesetz");
soll(erkenneGrundsatz("Alle tragen Hüte") === null, "Was: freier Grundsatz");

// ── 2 · Matrix ──────────────────────────────────────────────────────────────
const WO = ["", "eine Insel im Nordmeer", "in der Wüste", "eine Stadt unter dem Eis", "im Gebirge", "Velmar", "auf der Insel Amaurot", "in einem Keller"];
const WANN = ["", "nach dem letzten Krieg", "im Jahr 2300", "vor zweihundert Jahren", "morgen"];
const WER = ["", "ein Reisender", "Kartograf", "Mara", "die Fischerin", "ein alter Bewohner", "eine, die gehen muss", "Tom, Anna"];
const WAS = ["", "Es gibt kein Geld.", "kein Geld", "Niemand vergisst", "Die Gesetze verfallen", "Alle tragen Hüte", "Wer lügt, muss gehen!"];
const TOENE = ["uplifting", "dark", "ironisch", "nuechtern"];

const funde = new Map<string, number>();
const beispiel = new Map<string, string>();
const laengen: Record<number, number[]> = { 110: [], 400: [] };
let laeufe = 0;
for (const where of WO) for (const when of WANN) for (const who of WER) for (const what of WAS) for (const tone of TOENE) {
  const lenTarget = laeufe % 2 ? 400 : 110;
  const input = { where, when, who, what, tone, form: "prose", lenTarget } as GenInput;
  const r = buildUtopie(input);
  laeufe++;
  laengen[lenTarget]!.push(r.text.split(/\s+/).length);
  const befunde = pruefeUtopie(r.text, r.fb, [where, when, who, what].join(" "));
  // Der allgemeine Grammatik-Melder — OHNE seine Klasse „Verb-Kollision". Die
  // lief hier in 8767 von 8960 Läufen an, und jeder geprüfte Treffer war
  // falsch: Sie zählt über Satzgrenzen hinweg („hat. Am Waagentag legt") und
  // hält „nicht" und „längst" für finite Verben („bin ich nicht", „ist
  // längst"). Ein Melder, der fast immer anschlägt, prüft nichts.
  const g = grammarFlags(r.text);
  const echte = g.issues.filter((x) => !/^Verb-Kollision/.test(x));
  if (echte.length) befunde.push("Grammatik-Melder: " + echte.join("; "));
  // Vorrang: Ein eingetragener Grundsatz steht wörtlich da.
  // Verglichen ab dem zweiten Zeichen: Der Satzanfang wird großgeschrieben
  // („kein Geld" → „Kein Geld."); der erste Vergleich meldete das 1280-mal.
  if (what && !r.text.includes(what.replace(/[.!?]$/, "").slice(1))) befunde.push("Eingetragenes Was fehlt im Text");
  for (const b of befunde) {
    const art = b.replace(/„[^"“]*["“]/g, "„…“").replace(/: .*$/, "");
    funde.set(art, (funde.get(art) || 0) + 1);
    if (!beispiel.has(art)) beispiel.set(art, `${b} ← ${JSON.stringify({ where, when, who, what, tone })}`);
  }
}

// Der Regler Textlänge muss etwas bewegen.
const mittel = (l: number[]): number => l.reduce((a, b) => a + b, 0) / l.length;
const kurz = laengen[110]!, lang = laengen[400]!;
soll(mittel(lang) - mittel(kurz) >= 60, `Textlänge bewegt zu wenig: ${mittel(kurz).toFixed(0)} → ${mittel(lang).toFixed(0)}`);

// Abwechslung: dieselbe Eingabe zwanzigmal.
const viele = new Set<string>();
for (let i = 0; i < 20; i++) viele.add(buildUtopie({ where: "", when: "", who: "", what: "", tone: "uplifting", form: "prose", lenTarget: 200 } as GenInput).text);
soll(viele.size >= 18, `Zu wenig Abwechslung: ${viele.size} verschiedene aus 20`);

// Die Weiche: Utopie nur bei Prosa; ohne Welt bleibt alles beim Alten.
const bank = BUILTIN_PRESETS["staatsphilosophie"]!;
const basis = { where: "eine Insel", when: "", who: "", what: "Es gibt kein Geld.", tone: "uplifting", varLevel: "mid", structure: "rekombination", mode: "auto", perspective: "auto", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 150 } as unknown as GenInput;
const mitWelt = buildStory(bank, { ...basis, form: "prose", welt: "utopie" });
soll(mitWelt.includes("„Es gibt kein Geld.“") && mitWelt.split("\n\n").length === 5, "Weiche: Welt Utopie + Prosa baut keine Utopie");
const ohneWelt = buildStory(bank, { ...basis, form: "prose", welt: "keine" });
soll(!/auf dem \S+ gebaut ist/.test(ohneWelt), "Weiche: ohne Welt erscheint Utopie-Text");
const bericht = buildStory(bank, { ...basis, form: "bericht", welt: "utopie" });
soll(!/auf dem \S+ gebaut ist/.test(bericht), "Weiche: Bericht mit Welt Utopie baut Utopie (noch nicht angeschlossen)");

// ── 3 · Gegenproben ─────────────────────────────────────────────────────────
const gegen: string[] = [];
let gegenFehler = 0;
const probe = (name: string, text: string, fb: Parameters<typeof pruefeUtopie>[1], muster: RegExp, eingabe = ""): void => {
  const b = pruefeUtopie(text, fb, eingabe);
  const ok = b.some((x) => muster.test(x));
  gegen.push(`    ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) gegenFehler++;
};
// Eine Utopie mit Rat erzwingen: Der Grundsatz „los" setzt den Rat.
let rat = buildUtopie({ where: "in der Wüste", when: "", who: "ein Reisender", what: "Niemand regiert", tone: "uplifting", form: "prose", lenTarget: 110 } as GenInput);
for (let i = 0; i < 50 && rat.fb.regierung.id !== "rat"; i++) rat = buildUtopie({ where: "in der Wüste", when: "", who: "ein Reisender", what: "", tone: "uplifting", form: "prose", lenTarget: 110 } as GenInput);
const t0 = rat.text, fb0 = rat.fb;
const sauber = pruefeUtopie(t0, fb0, "in der Wüste ein Reisender Niemand regiert");
gegen.push(`    ${sauber.length ? "✗" : "✓"} Ausgangstext ohne Befund${sauber.length ? ": " + sauber.join("; ") : ""}`);
if (sauber.length) gegenFehler++;
const ratM = t0.match(/Rat der (\S+?)\./);
probe("Rat der Vierzig statt des gezogenen", ratM ? t0.replace(`Rat der ${ratM[1]}`, "Rat der Vierzig") : t0 + " Rat der Vierzig.", fb0, /Rat der Vierzig|Zahl nicht im Blatt/);
probe("Fremde Zahl", t0.replace(/\n\n/, " Es gibt sechzig Tore.\n\n"), fb0, /Zahl nicht im Blatt: sechzig/);
probe("Kehrseite entfernt", t0.replace(fb0.grundsatz.kehrseite[0]!.replace("{N}", fb0.name), ""), fb0, /Kehrseite/);
probe("Netze in der Wüste", t0.replace(/\n\n/, " Am Abend flickt man Netze.\n\n"), fb0, /Marke der Lage „insel"/);
probe("Platzhalter stehen geblieben", t0.replace(fb0.name, "{N}"), fb0, /Platzhalter/);
probe("Grundsatz verändert", t0.replace(`„${fb0.satz}“`, "„Es regiert der König.“"), fb0, /Grundsatz/);
probe("Doppeltes Wort", t0.replace(/\bdie\b/, "die die"), fb0, /Doppeltes Wort/);
probe("Satzanfang klein", t0.replace(/\. ([A-ZÄÖÜ])/, (_, c: string) => ". " + c.toLowerCase()), fb0, /Satzanfang klein/);
probe("Absätze vertauscht (Blickwinkel)", t0.split("\n\n").reverse().join("\n\n"), fb0, /Blickwinkel/);
probe("Brauch entfernt", t0.replace(fb0.brauch.text, ""), fb0, /Brauch/);
probe("„Das war morgen“", t0.replace(/\n\n/, " Das war morgen.\n\n"), fb0, /Zukunftszeit/);
probe("Schluss am Tor bei anderer Ankunft", t0.replace(/\n\n/, " Niemand stand am Tor.\n\n"), { ...fb0, lage: { ...fb0.lage, ankunft: "Am Steg" } }, /am Tor/);
probe("„Niemand regiert“ neben „Regiert wird“", t0.replace(`„${fb0.satz}“`, "„Niemand regiert.“").replace(/\n\n/, " Regiert wird alles vom Rat.\n\n"), { ...fb0, satz: "Niemand regiert." }, /Niemand regiert/);
// Der Fund des ersten Laufs: „Dreißig" ist nicht „drei".
{
  const fbD = { ...fb0, zahlen: ["dreißig"] };
  const b = pruefeUtopie(`Ich kam nach ${fb0.name}. Die Dreißig tagen in ${fb0.name}.`, fbD).filter((x) => /Zahl/.test(x));
  gegen.push(`    ${b.length ? "✗" : "✓"} „Dreißig" wird nicht als „drei" gelesen`);
  if (b.length) gegenFehler++;
}

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Utopie: ${laeufe} Läufe (8 Wo × 5 Wann × 8 Wer × 7 Was × 4 Töne)`);
console.log(`  Umfang bei Ziel 110: ${Math.min(...kurz)}–${Math.max(...kurz)} Wörter, Mittel ${mittel(kurz).toFixed(0)}`);
console.log(`  Umfang bei Ziel 400: ${Math.min(...lang)}–${Math.max(...lang)} Wörter, Mittel ${mittel(lang).toFixed(0)}`);
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
  console.error(`\n❌ Utopie: ${summe} Befund(e) in ${laeufe} Läufen, ${gegenFehler} Gegenprobe(n) ohne Wirkung, ${fehler.length} Einzelprüfung(en) rot.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Utopie: ${laeufe} Läufe ohne Befund, alle Gegenproben schlagen an.`);
}
