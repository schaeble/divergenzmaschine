// Prüfstand Multi-Shot: generation/video.ts — Shots als Bildszenen.
//
// Gemeldet: zu schwache Sequenzen, zu kurz, wenig ausdrucksstark, zu wenig
// bildhaft. Hier steht, dass jeder Shot seine Sichtplätze trägt (Bild,
// Bewegung, Nah, Licht, Schnitt), dass die Länge dem Regler folgt, dass nichts
// Englisches mehr im Bild steht und dass sich Requisiten nicht wiederholen.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import { setDramaData } from "../src/generation/dramaturgie";
import type { GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const inp: GenInput = { where: "in einem verlassenen Bahnhof", when: "vor dem ersten Zug", who: "Eine Uhrmacherin", what: "sucht einen Ton, der fehlt",
  tone: "mystery", varLevel: "wild", form: "video", structure: "linear", mode: "myth", perspective: "third",
  rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "psychopath",
  instability: 0, polish: false, polishStyle: "surreal_precise", shots: 5, totalSec: 25, lenTarget: 200 } as never;
const bau = (o: Partial<GenInput> = {}): string => buildStory(DEFAULT_BANK, { ...inp, ...o } as never);
const shots = (t: string): string[] => t.split("\n").filter((l) => l.startsWith("DE: ")).map((l) => l.slice(4));

// ── 1 · Sichtplätze ─────────────────────────────────────────────────────────
{
  const t = bau({ lenTarget: 200 } as never);
  const sh = shots(t);
  ist("fünf Shots", sh.length, 5);
  wahr("der erste Shot verankert Ort und Figur", /^In einem verlassenen Bahnhof: Eine Uhrmacherin nahe /.test(sh[0]!));
  wahr("jeder Shot außer dem letzten hat ein Nah-Detail", sh.slice(0, -1).every((s) => /Nah: /.test(s)));
  wahr("jeder Shot außer dem letzten endet mit einem Schnitt", sh.slice(0, -1).every((s) => /(Schnitt\.|das Bild geht\.|Atemzug lang\.|Überblendung ins Nächste\.|das Bild nicht\.|Das Bild reißt\.)$/.test(s)));
  wahr("der letzte Shot trägt den Schluss und lässt etwas sichtbar", /Nur (der Riss|das Fenster|die Karte|das Licht) bleibt sichtbar\.$/.test(sh[4]!));
  wahr("jeder Shot hat eine KAMERA-Zeile auf Deutsch", (t.match(/^KAMERA: .+\.$/gm) || []).length === 5 && !/KAMERA: .*(camera|push|pull|close-up)/i.test(t));
  wahr("kein Englisch mehr im Bild", !/\b(cold blue light|floating dust|fine fog|neon flicker|slow push)\b/i.test(t));
  wahr("Licht auf Deutsch ab Stufe 2", /(Blau|Neonlicht|Natriumlicht|Gegenlicht|Mondlicht|bewölkter Tag|Staub|Nebel|Schnee|Kondenswasser|Licht|Farben|nachdunkelt|Glanz|körnig)/.test(sh[1]!));
}

// ── 2 · Länge folgt dem Regler ──────────────────────────────────────────────
{
  const w = (lt: number): number => { let s = 0; for (let i = 0; i < 6; i++) s += bau({ lenTarget: lt } as never).split(/\s+/).length; return s / 6; };
  const a = w(110), b = w(200), c = w(300);
  wahr("110 < 200 < 300 im Wortmaß", a < b && b < c, `${a.toFixed(0)} < ${b.toFixed(0)} < ${c.toFixed(0)}`);
  wahr("bei 300 über 250 Wörter (vorher blieb es dünn)", c > 250, c.toFixed(0));
}

// ── 3 · Keine Wiederholungen der Requisiten ─────────────────────────────────
{
  let doppelt = 0;
  for (let i = 0; i < 15; i++) {
    const sh = shots(bau({ lenTarget: 200 } as never));
    const nah = sh.map((s) => (s.match(/Nah: ([^.]+)\./) || [])[1]).filter(Boolean).map((x) => x!.toLowerCase().replace(/^(einen|einem|eine|ein)\s/, "ein "));
    if (new Set(nah).size !== nah.length) doppelt++;
    const erste = (sh[0]!.match(/nahe ([^.]+)\./) || [])[1];
    if (erste && nah.includes(erste.toLowerCase().replace(/^(einem|einer)\s/, "ein "))) doppelt++;
  }
  ist("Requisiten wiederholen sich nicht (15 Läufe)", doppelt, 0);
  wahr("Nah steht im Nominativ", !/Nah: einen /.test(bau({ lenTarget: 300 } as never)));
}

// ── 4 · Der Bogen sitzt an den Gelenken ─────────────────────────────────────
{
  setDramaData({ einstieg: ["Der Bahnhof atmet zum ersten Mal"], mitte: ["Ein Zug, der nie kommt"], hoehepunkt: ["Die Uhr schlägt ohne Zeiger"], schluss: [],
    ausloeser: ["ein Fahrplan aus Wachs"], veraenderungen: ["die Gleise beginnen zu singen"], konflikte: [], zeitanomalien: [], regeln: [] });
  const sh = shots(bau({ lenTarget: 200 } as never));
  wahr("Einstieg des Bogens im ersten Shot", /Der Bahnhof atmet zum ersten Mal/.test(sh[0]!));
  wahr("Höhepunkt des Bogens in der Mitte", /Die Uhr schlägt ohne Zeiger/.test(sh[2]!));
  setDramaData(null);
}

console.log(`Prüfstand Multi-Shot — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Multi-Shot: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Multi-Shot: alle ${geprueft} Prüfungen bestanden.`);
}
