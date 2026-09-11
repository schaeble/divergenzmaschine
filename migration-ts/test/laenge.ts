// Prüfstand Textlänge: die Obergrenze 400 Wörter und der Füller ohne Dubletten.
//
// Gewünscht: prüfen, ob die Obergrenze auf 400 angehoben werden kann. Befund:
// Mit echten Presets (120–140 Einträge) werden 400 und 500 Wörter erreicht;
// der Füller zog bei erschöpftem Vorrat aus dem Ganzen nach und wiederholte
// Sätze (24 Dubletten bei 400 in der Dramaturgie mit kleiner Bank). Jetzt hört
// er auf, wenn nichts Frisches mehr da ist.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import type { GenInput, Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke", tone: "mystery", varLevel: "wild", form: "prose", structure: "linear", mode: "myth", perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "auto", archetypeA: "neutral", archetypeB: "psychopath", instability: 0, polish: false, polishStyle: "surreal_precise" } as never;
const dubletten = (t: string): number => { const s = t.toLowerCase().split(/(?<=[.!?…])\s+/).map((x) => x.replace(/[^a-zäöüß ]/g, "").trim()).filter((x) => x.split(" ").length >= 4); return s.length - new Set(s).size; };
const mess = (bank: Bank, lt: number, structure: string, n = 6): { woerter: number; dubl: number } => {
  let w = 0, d = 0;
  for (let i = 0; i < n; i++) { const t = buildStory(bank, { ...inp, lenTarget: lt, structure } as never); w += t.split(/\s+/).length; d += dubletten(t); }
  return { woerter: w / n, dubl: d / n };
};
const kafka = BUILTIN_PRESETS["kafka"] as Bank;
for (const st of ["linear", "rekombination", "dramaturgie"]) {
  const m = mess(kafka, 400, st);
  wahr(`${st} erreicht 400 (mindestens 85 %)`, m.woerter >= 340, m.woerter.toFixed(0));
  wahr(`${st} bei 400 ohne Dubletten (höchstens 1 im Schnitt)`, m.dubl <= 1, m.dubl.toFixed(1));
}
{
  // Kleine Bank: kürzer, aber nicht wiederholt.
  const m = mess(DEFAULT_BANK, 400, "dramaturgie");
  wahr("kleine Bank: lieber kürzer als wiederholt", m.dubl <= 1, `${m.woerter.toFixed(0)} Wörter, ${m.dubl.toFixed(1)} Dubletten`);
}
{
  const qs = readFileSync("src/ui/studio.ts", "utf8");
  wahr("der Regler geht bis 400", /id: "f-len", type: "range", min: "40", max: "400"/.test(qs));
  const qw = readFileSync("src/features/wuerfeln.ts", "utf8");
  wahr("der Würfel kennt die 400", /schluessel: "lenTarget", min: 40, max: 400/.test(qw));
  const ql = readFileSync("src/generation/length.ts", "utf8");
  wahr("der Füller hört auf, statt zu wiederholen", /if \(!fresh\.length\) return null;/.test(ql));
}

// ── Blatt „Sonnenaufgang in Weilheim": Füller vor dem Schluss, mit Anschluss, im Nominativ
{
  const { enforceWordTarget } = require("../src/generation/length") as { enforceWordTarget: (t: string, ziel: number, bank: Bank) => string };
  const basis = "Das Licht fällt so, dass Worte fast überflüssig werden. Ebi beobachtet den Raum. Ein Tonbandgerät liegt darin, vergessen von einem Handwerker. Die Melodie wiederholt sich, aber die Worte ändern sich. Nur der Nebel, der mir den Rücken deckt.";
  const bank = { ...kafka, endings: ["Nur der Nebel, der mir den Rücken deckt", ...(kafka.endings || [])], props: ["einen Schlüssel für jedes Schloss", "einen Brief ohne Absenderzeile", "den Kompass ohne Nadel"] } as Bank;
  let letzterBleibt = 0, akk = 0, anschluss = 0, n = 12;
  for (let i = 0; i < n; i++) {
    const t = enforceWordTarget(basis, 140, bank);
    const s = t.split(/(?<=[.!?…])\s+/);
    if (/Nur der Nebel, der mir den Rücken deckt\.$/.test(s[s.length - 1]!)) letzterBleibt++;
    akk += (t.match(/(^|\. )(Einen|Den) [A-ZÄÖÜ]/g) || []).length;
    // Anschluss: eingefügte Sätze teilen mit ihrem Vorgänger einen Stamm (mindestens ein Drittel der Einfügungen)
    const st = (x: string) => new Set((x.toLowerCase().match(/[a-zäöüß]{5,}/g) || []).map((y) => y.slice(0, 5)));
    let mit = 0, eing = 0;
    for (let j = 1; j < s.length; j++) { if (basis.includes(s[j]!)) continue; eing++; const a = st(s[j - 1]!); for (const x of st(s[j]!)) if (a.has(x)) { mit++; break; } }
    if (eing && mit / eing >= 0.3) anschluss++;
  }
  ist("der letzte Satz bleibt der letzte (12 Läufe)", letzterBleibt, n);
  ist("keine Requisite im Akkusativ", akk, 0);
  wahr("Anschluss: in vielen Läufen teilt mindestens ein Drittel der Einfügungen einen Stamm mit dem Vorgänger (vorher: Zufall)", anschluss >= n * 0.35, `${anschluss}/${n}`);
}

console.log(`Prüfstand Textlänge — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Textlänge: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Textlänge: alle ${geprueft} Prüfungen bestanden.`);
