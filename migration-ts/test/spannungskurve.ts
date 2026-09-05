// Prüfstand Spannungskurve: features/spannungskurve.ts, Wirkung im Bau, Ansicht.
//
// Gewünscht: ein Graph unter dem Einfachen Kopf, mit der Maus einstellbar; im
// Hintergrund setzt die Maschine die Einsätze — Rhythmus, Schlagfolge, Regler.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { ladeKurve, speichereKurve, kurveWert, kurveSpitzen, schlagfolgeAusKurve, reglerAusKurve, KURVEN_VORLAGEN, STUETZEN } from "../src/features/spannungskurve";
import { applyTension } from "../src/generation/shape";
import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import type { GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Speicher und Interpolation ──────────────────────────────────────────
localStorage.setItem("dm_spannungskurve_v1", "kaputt{");
ist("kaputt → Vorlage Steigend, aus", ladeKurve().an, false);
ist("sieben Stützstellen", ladeKurve().werte.length, STUETZEN);
speichereKurve({ an: true, werte: [0, 0.5, 1, 0.5, 0, 0.5, 1] });
ist("gespeichert", ladeKurve().an, true);
ist("Interpolation an Stützstelle", kurveWert([0, 1, 0], 0.5), 1);
ist("Interpolation dazwischen", kurveWert([0, 1, 0], 0.25), 0.5);
ist("Klemmung", kurveWert([0, 1], 3), 1);

// ── 2 · Spitzen und Schlagfolge ─────────────────────────────────────────────
{
  const sp = kurveSpitzen(KURVEN_VORLAGEN["spaet"]!.werte);
  wahr("Späte Wende: Maximum spät", sp.max > 0.75, String(sp.max));
  const dp = kurveSpitzen(KURVEN_VORLAGEN["doppelt"]!.werte);
  wahr("Doppelt: zweite Spitze erkannt", dp.zweite !== null && dp.zweite < dp.max);
  const f = schlagfolgeAusKurve(KURVEN_VORLAGEN["katastrophe"]!.werte);
  ist("Katastrophe zuerst: Höhepunkt ganz vorn", f.indexOf("hoehepunkt") <= 1, true);
  const g = schlagfolgeAusKurve(KURVEN_VORLAGEN["spaet"]!.werte);
  wahr("Späte Wende: Höhepunkt im letzten Drittel", g.indexOf("hoehepunkt") / g.length > 0.6);
  ist("… und der Schluss steht", g[g.length - 1], "schluss");
  const o = schlagfolgeAusKurve(KURVEN_VORLAGEN["offen"]!.werte);
  ist("Offen: endet am Einsatz, ohne Schluss", o[o.length - 1], "einsatz");
  wahr("der Einstieg steht vorn — bei Katastrophe zuerst gleich nach dem Höhepunkt", [g, o].every((x) => x[0] === "einstieg") && f.indexOf("einstieg") <= 1);
  ist("Regler aus der Kurve: spät → unten", reglerAusKurve(KURVEN_VORLAGEN["spaet"]!.werte), "low");
  ist("Katastrophe → oben", reglerAusKurve(KURVEN_VORLAGEN["katastrophe"]!.werte), "top");
  ist("Flach → aus", reglerAusKurve(KURVEN_VORLAGEN["flach"]!.werte), "off");
}

// ── 3 · Wirkung im Rhythmus: hoch = kürzere Sätze ───────────────────────────
{
  const basis = Array.from({ length: 14 }, (_, i) => `Der Satz Nummer ${i + 1} liegt ruhig im Text, und niemand rührt sich an dieser Stelle.`).join(" ");
  const mittel = (t: string): number => { const s = t.split(/(?<=[.!?…])\s+/); return s.reduce((n, x) => n + x.split(/\s+/).length, 0) / s.length; };
  let hoch = 0, tief = 0;
  for (let i = 0; i < 12; i++) {
    hoch += mittel(applyTension(basis, "off", undefined, () => 0.95));
    tief += mittel(applyTension(basis, "off", undefined, () => 0.05));
  }
  wahr("hohe Kurve → kürzere Sätze als tiefe", hoch < tief, `${(hoch / 12).toFixed(1)} < ${(tief / 12).toFixed(1)}`);
}

// ── 4 · Verdrahtung ─────────────────────────────────────────────────────────
{
  const qs = readFileSync("src/ui/studio.ts", "utf8");
  // 4.345.1: Der Graph ist vom Kopf ins Textfenster gewandert — eine Spur am
  // linken Rand, nur im Editiermodus, dazu die Tönung im Text.
  wahr("kein Graph mehr unter dem Einfachen Kopf", !/koerper, skWrap\)/.test(qs));
  wahr("die Spur sitzt im Textfenster", /el\("div", \{ class: "outwrap" \}, mkGenArrow\("left"\), spur, out,/.test(qs));
  wahr("nur im Editiermodus", /const an = feedsChk\.checked && kurve\.an;/.test(qs) && /skLeiste\.style\.display = feedsChk\.checked \? "" : "none"/.test(qs));
  wahr("die Tönung folgt der Kurve", /out\.style\.backgroundImage = `linear-gradient\(to bottom, /.test(qs) && /0\.03 \+ v \* 0\.16/.test(qs));
  wahr("Punkte sind ziehbar — waagerecht, rechts = mehr", /c\.addEventListener\("pointerdown"/.test(qs) && /setPointerCapture/.test(qs) && /\(x - 4\) \/ \(SPUR_B - 10\)/.test(qs));
  wahr("loslassen speichert und erzeugt neu", /c\.addEventListener\("pointerup", \(\) => \{ ziehe = false; skSichern\(\); generate\(\); \}\)/.test(qs));
  wahr("nach jeder Erzeugung wird die Spur neu gemalt", /renderTitel\(\); spurMalen\(\); \}/.test(qs));
  wahr("vor der Erzeugung: Schlagfolge aus der Kurve, Regler gesetzt", /setBogenOverride\(\{ \.\.\.basis, folge: schlagfolgeAusKurve\(kurve\.werte\) \}\)/.test(qs) && /tension\.value = soll/.test(qs));
  wahr("Vorlagen zur Wahl", /select\("f-sk-vorlage"/.test(qs));
  const qb = readFileSync("src/generation/buildStory.ts", "utf8");
  wahr("der Rhythmus folgt der Kurve, wenn sie an ist", /kurve\.an\s*\n?\s*\? applyTension\(text, input\.tension, \{ motifs: bank\.motifs, hooks: bank\.hooks \}, \(p\) => kurveWert\(kurve\.werte, p\)\)/.test(qb));
}
// aus → kein Einfluss auf den gewöhnlichen Bau
speichereKurve({ an: false, werte: [...KURVEN_VORLAGEN["steigend"]!.werte] });
const inp: GenInput = { where: "im Hafen", when: "am Abend", who: "Der Bote", what: "hört die Glocke", tone: "mystery", varLevel: "wild", form: "prose", structure: "linear", mode: "myth", perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "psychopath", instability: 0, polish: false, polishStyle: "surreal_precise", tension: "off" } as never;
wahr("aus: der Bau läuft unverändert", buildStory(DEFAULT_BANK, inp).split(/\s+/).length > 40);

console.log(`Prüfstand Spannungskurve — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Spannungskurve: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Spannungskurve: alle ${geprueft} Prüfungen bestanden.`);
