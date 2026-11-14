// Prüfstand Szene/Dialog (4.389.0).
//
// Gemessen an 4.386, 100 Szenen: „Und was hat das mit uns zu tun?" und „Das
// ist nur die Oberfläche." standen in 99 davon; vom Was der vier W war in
// keiner die Rede; vor jeder Zeile stand die ganze Figurenbeschreibung („Ein
// Nachtportier mit fotografischem Gedächtnis, der nie abgeschickt wurde:").
// Jedes Muster hier hat seine Gegenprobe.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { BUILTIN_PRESETS } from "../src/presets.data";
import { buildStory } from "../src/generation/buildStory";
import { randomContext } from "../src/generation/context";
import { wasInPerson, sprecherName } from "../src/generation/dialogue";
import type { GenInput, Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0;
const wahr = (name: string, ok: boolean, info = ""): void => { geprueft++; if (!ok) fails.push(`${name}${info ? " (" + info + ")" : ""}`); };
const ist = <T,>(name: string, a: T, b: T): void => wahr(name, a === b, `„${String(a)}“ — erwartet „${String(b)}“`);

const P = Object.keys(BUILTIN_PRESETS);
const bau = (o: Partial<GenInput>, i = 0): string => buildStory(BUILTIN_PRESETS[P[i % P.length]!]! as Bank, {
  where: "in einer Zollstation im Nebel", when: "an einem Montag im November", who: "eine Fährfrau mit schweren Händen", what: "wartet auf einen Anruf, der nicht kommt",
  tone: "neutral", varLevel: "mid", form: "script", structure: "linear", mode: "auto", perspective: "third", rhythm: "auto", markovMode: "off",
  disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 200, ...o } as GenInput);
const zeilen = (t: string): string[] => t.split("\n").slice(1);
const rede = (t: string): string[] => zeilen(t).map((l) => l.replace(/^[^:(]{2,40}:\s*/, "").trim());

// ── 1 · Das Was der vier W eröffnet die Szene ──────────────────────────────
{
  const t = bau({});
  wahr("die erste Zeile nennt das Was in der Du-Form", /: Du wartest auf einen Anruf\. /.test(zeilen(t)[0]!), zeilen(t)[0]!);
  wahr("sie gehört dem Gegenüber, nicht der Figur", !/^Fährfrau:/.test(zeilen(t)[0]!));
  wahr("die Figur antwortet", /^Fährfrau: /.test(zeilen(t)[1]!), zeilen(t)[1]!);
  let ich = 0; for (let i = 0; i < 20; i++) if (/Fährfrau: .*Ich warte auf einen Anruf/.test(bau({ lenTarget: 250 }, i))) ich++;
  ist("bei genug Länge sagt die Figur es selbst (20 Läufe)", ich, 20);
  // Gegenprobe: Lässt sich das Was nicht beugen, steht es als Hörensagen da.
  const h = zeilen(bau({ what: "seine Schuld holt ihn ein" }))[0]!;
  wahr("Gegenprobe: nicht beugbar → Hörensagen", /Man erzählt sich, eine Fährfrau/.test(h) && !/: Du /.test(h), h);
}

// ── 2 · Beugen: sicher oder gar nicht ──────────────────────────────────────
ist("du-Form", wasInPerson("verhandelt mit dem Fluss um einen Übergang, und kann es nicht erklären", "du"), "verhandelst mit dem Fluss um einen Übergang");
ist("ich-Form", wasInPerson("findet einen Brief", "ich"), "finde einen Brief");
ist("stark", wasInPerson("spricht mit einer Maschine", "du"), "sprichst mit einer Maschine");
ist("Modalverb", wasInPerson("will verschwinden", "ich"), "will verschwinden");
ist("reflexiv", wasInPerson("optimiert sich selbst weg", "ich"), "optimiere mich selbst weg");
ist("Gegenprobe: Possessiv der dritten Person → null", wasInPerson("verliert seinen Schatten", "du"), null);
ist("Gegenprobe: kein Verb vorn → null", wasInPerson("ein Wunder geschieht", "du"), null);
{ let n = 0, nul = 0; for (let i = 0; i < 400; i++) { const w = randomContext().what; n++; if (!wasInPerson(w, "du")) nul++; }
  wahr(`der Vorrat an Was-Angaben lässt sich fast immer beugen (${n - nul}/${n})`, nul / n < 0.15); }

// ── 3 · Kurze Sprechernamen ────────────────────────────────────────────────
ist("Beschreibung wird Name", sprecherName("Ein Nachtportier mit fotografischem Gedächtnis, der nie schläft"), "Nachtportier");
ist("Adjektiv bleibt", sprecherName("ein alter Mann"), "Alter Mann");
ist("Gegenprobe: ein Eigenname bleibt", sprecherName("Baucis"), "Baucis");
{
  let langeNamen = 0, zusatz = 0;
  for (let i = 0; i < 80; i++) {
    const c = randomContext();
    const t = bau({ ...c }, i);
    for (const l of zeilen(t)) { const m = l.match(/^([^:(]+): /); if (m && m[1]!.split(/\s+/).length > 3) langeNamen++; if (/^(Ohne|Mit) /.test(l)) zusatz++; }
  }
  ist("kein Sprechername über drei Wörter (80 Szenen)", langeNamen, 0);
  ist("kein Zusatz als Sprecher („Ohne Papiere:“)", zusatz, 0);
}

// ── 4 · Keine festen Sätze mehr, keine Dubletten ───────────────────────────
{
  const N = 120; const h = new Map<string, number>(); let dub = 0, ortImDialog = 0, weide = 0, regieMitName = 0;
  for (let i = 0; i < N; i++) {
    const c = randomContext();
    const t = bau({ ...c, lenTarget: i % 2 ? 400 : 200 }, i);
    const r = rede(t);
    if (new Set(r).size < r.length) dub++;
    for (const x of new Set(r.flatMap((z) => z.split(/(?<=[.!?])\s+/)))) h.set(x, (h.get(x) || 0) + 1);
    const ok = (c.where.split(",")[0]!.match(/[A-ZÄÖÜ][a-zäöüß]{3,}/g) || [])[0];
    if (ok && zeilen(t).join(" ").includes(ok)) ortImDialog++;
    if (/Die Weide liegt still/.test(t)) weide++;
    if (/^[^:(]+: \(/m.test(t)) regieMitName++;
  }
  const top = [...h.entries()].sort((a, b) => b[1] - a[1])[0]!;
  wahr(`kein Satz in mehr als der Hälfte der Szenen (häufigster: ${top[1]}/${N} „${top[0]}“)`, top[1] / N <= 0.5);
  ist("die beiden festen Sätze von früher sind fort", (h.get("Und was hat das mit uns zu tun?") || 0) + (h.get("Das ist nur die Oberfläche.") || 0), 0);
  ist("keine doppelte Zeile, auch bei Ziel 400", dub, 0);
  wahr(`der Ort kommt im Gespräch vor (${ortImDialog}/${N})`, ortImDialog / N >= 0.8);
  ist("„Die Weide liegt still.“ steht nicht mehr fest", weide, 0);
  ist("eine Regieanweisung hat keinen Sprecher", regieMitName, 0);
}

// ── 5 · Länge folgt dem Regler ─────────────────────────────────────────────
{
  const W = (t: string): number => (t.match(/[A-Za-zÄÖÜäöüß]+/g) || []).length;
  const m = (len: number): number => { let s = 0; for (let i = 0; i < 24; i++) s += W(bau({ ...randomContext(), lenTarget: len }, i)); return s / 24; };
  const a = m(110), b = m(200), c = m(400);
  wahr(`Ziel 110 → ${Math.round(a)}`, Math.abs(a - 110) <= 25);
  wahr(`Ziel 200 → ${Math.round(b)} (vorher 283)`, Math.abs(b - 200) <= 35);
  wahr(`Ziel 400 endet bei rund 280 (${Math.round(c)})`, c > 240 && c < 320);
}

console.log(`Prüfstand Szene/Dialog — ${geprueft} Prüfungen`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Szene/Dialog: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Szene/Dialog: alle ${geprueft} Prüfungen bestanden.`);
