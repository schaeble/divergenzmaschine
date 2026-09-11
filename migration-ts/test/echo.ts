// Prüfstand Echo: generation/echo.ts — Kernbilder mit Echo vor dem Höhepunkt.
//
// Schritt 3 der Bogen-Spannung (Blatt „Sonnenaufgang in Weilheim"): Zwei
// Bilder desselben Kerns, das zweite stärker, vor dem Höhepunkt — gewollt,
// nicht zufällig.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { setzeEchos, kernwoerter } from "../src/generation/echo";
import { setDramaData } from "../src/generation/dramaturgie";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { buildStory } from "../src/generation/buildStory";
import { zeitlupeSchalten, zeitlupeLesen } from "../src/features/zeitlupe";
import type { Bank, GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Kernwörter ──────────────────────────────────────────────────────────
wahr("Kernwörter: Nomen ab fünf Buchstaben, nicht am Satzanfang", [...kernwoerter("Im Spiegel bewegt sich etwas eine Sekunde zu spät.")].join(",") === "spieg,sekun");
wahr("Satzanfang und Funktionswörter zählen nicht", !kernwoerter("Dann bleibt eine Tasche stehen.").has("dann") && kernwoerter("Dann bleibt eine Tasche stehen.").has("tasch"));

// ── 2 · Das Echo ────────────────────────────────────────────────────────────
const bank = { motifs: ["Der Spiegel zeigt eine Bewegung, die niemand im Raum macht", "ein Spiegel aus altem Glas", "die Uhr ohne sichtbare Zeiger", "eine Uhr, die schneller läuft, als jemand zählen kann"], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: ["Nur der Nebel, der mir den Rücken deckt."] } as unknown as Bank;
const text = "Das Licht fällt so, dass Worte fast überflüssig werden. Im Spiegel bewegt sich etwas eine Sekunde zu spät. Ebi beobachtet den Raum. Eine Tasche bleibt stehen. Der Bahnsteig atmet Beton und kaltes Metall. Ich warte, wie man an einem Ort wartet. Ein Tonbandgerät liegt darin, vergessen von einem Handwerker. Die Melodie wiederholt sich, aber die Worte ändern sich. Der Ort merkt sich jede Bewegung. Nur der Nebel, der mir den Rücken deckt.";
setDramaData({ einstieg: [], mitte: [], hoehepunkt: ["Die Melodie wiederholt sich, aber die Worte ändern sich"], schluss: [], ausloeser: [], veraenderungen: [], konflikte: [], zeitanomalien: [], regeln: [] });
const e = setzeEchos(text, bank);
ist("ein Echo gesetzt", e.echos.length, 1);
ist("der Kern ist der Spiegel", e.echos[0]!.kern, "spieg");
ist("das stärkere Bild (Steigerungswort „niemand“) wird gewählt", e.echos[0]!.echo, "Der Spiegel zeigt eine Bewegung, die niemand im Raum macht.");
{
  const s = e.text.split(/(?<=[.!?…])\s+/);
  const iE = s.findIndex((x) => /Der Spiegel zeigt/.test(x)), iH = s.findIndex((x) => /Die Melodie wiederholt/.test(x)), iK = s.findIndex((x) => /Im Spiegel bewegt/.test(x));
  ist("das Echo steht unmittelbar vor dem Höhepunkt", iH - iE, 1);
  wahr("mindestens drei Sätze nach dem Kernbild", iE - iK >= 3);
  wahr("der Schluss bleibt der Schluss", /Nur der Nebel, der mir den Rücken deckt\.$/.test(e.text));
  wahr("sonst ist der Text unverändert", s.length === text.split(/(?<=[.!?…])\s+/).length + 1);
}
setDramaData(null);
ist("ohne Höhepunkt: bei drei Vierteln", (() => { const r = setzeEchos(text, bank); const s = r.text.split(/(?<=[.!?…])\s+/); const iE = s.findIndex((x) => /Der Spiegel zeigt/.test(x)); return iE >= Math.floor(s.length * 0.6) && iE < s.length - 2; })(), true);
ist("zu kurz: kein Echo", setzeEchos("Ein Satz. Noch einer. Der Spiegel steht.", bank).echos.length, 0);
ist("kein zweites Bild im Preset: kein Echo", setzeEchos(text, { ...bank, motifs: ["ein Fenster ohne Glas"] } as Bank).echos.length, 0);
ist("Echo steht nicht schon im Text", setzeEchos(text + " Der Spiegel zeigt eine Bewegung, die niemand im Raum macht.", { ...bank, motifs: ["Der Spiegel zeigt eine Bewegung, die niemand im Raum macht"] } as Bank).echos.length, 0);

// ── 3 · Im Bau ──────────────────────────────────────────────────────────────
{
  const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke", tone: "neutral", varLevel: "wild", form: "prose", structure: "rekombination", mode: "myth", perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, polish: false, polishStyle: "surreal_precise", lenTarget: 220 } as never;
  zeitlupeSchalten(true);
  let mitEcho = 0;
  for (let i = 0; i < 6; i++) { const t = buildStory(BUILTIN_PRESETS["kafka"] as Bank, inp); if (zeitlupeLesen(t).some((x) => x.name === "Echo")) mitEcho++; }
  zeitlupeSchalten(false);
  wahr("im Zusammenbau setzt die Maschine meistens ein Echo (6 Läufe)", mitEcho >= 3, String(mitEcho));
  const q = readFileSync("src/generation/buildStory.ts", "utf8");
  wahr("das Echo sitzt an beiden Wegen vor der Störung", (q.match(/setzeEchos\(/g) || []).length === 2 && /setzeEchos\(rk, bank\)/.test(q));
}

console.log(`Prüfstand Echo — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Echo: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Echo: alle ${geprueft} Prüfungen bestanden.`);
