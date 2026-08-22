// Prüfstand Struktur: Die fünf Erzählformen sind Anordnungen, keine eigenen
// Maschinen.
//
// Gefragt war: Wie unterscheiden sich Linear, Reverse, Kreis, Fragment und
// Objekt von der Rekombination — und können sie dem Sinn nach genauso gebaut
// werden? Gemessen glichen die fünf Schablonen einander zu 57–63 %, während die
// Rekombination bei 37–41 % zu allen lag: Die Wahl zwischen ihnen änderte
// weniger als die Wahl des Bauwegs.
//
// Seit 4.269 sind sie Phasenfolgen desselben Assemblers. Dieser Prüfstand hält
// fest, dass sie dabei UNTERSCHEIDBAR geblieben sind — das war das Risiko.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { buildStory } from "../src/generation/buildStory";
import { STRUKTUR_PHASEN, phasenFolge } from "../src/atoms/assemble";
import { getTrace } from "../src/atoms/trace";
import { phraseRepeatRatio } from "../src/generation/coherence";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { BUILTIN_DRAMA } from "../src/presets.drama.data";
import { setDramaData } from "../src/generation/dramaturgie";
import { coherencePass } from "../src/generation/postprocess";
import type { Bank, GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Die Folgen selbst ──────────────────────────────────────────────────
const FUENF = ["linear", "reverse", "circle", "fragment", "object"];
for (const s of [...FUENF, "rekombination"]) {
  wahr(`${s} hat eine Phasenfolge`, (STRUKTUR_PHASEN[s] || []).length === 10);
}
// Die Rekombination darf sich durch den Umbau NICHT geändert haben: Ihre Folge
// ist Zeichen für Zeichen die alte Verteilung 30/30/20/20.
ist("die Rekombination behält 30/30/20/20",
  STRUKTUR_PHASEN["rekombination"]!.join(","),
  "exposition,exposition,exposition,verdichtung,verdichtung,verdichtung,umschlag,umschlag,schluss,schluss");
ist("linear ist dasselbe vorwärts",
  STRUKTUR_PHASEN["linear"]!.join(","), STRUKTUR_PHASEN["rekombination"]!.join(","));
ist("reverse fängt mit dem Schluss an", STRUKTUR_PHASEN["reverse"]![0], "schluss");
ist("und hört mit der Exposition auf", STRUKTUR_PHASEN["reverse"]!.slice(-1)[0], "exposition");
ist("der Kreis kehrt zur Exposition zurück", STRUKTUR_PHASEN["circle"]!.slice(-1)[0], "exposition");
ist("und fängt auch dort an", STRUKTUR_PHASEN["circle"]![0], "exposition");
// Das Fragment springt: keine zwei gleichen Phasen hintereinander am Anfang.
wahr("das Fragment springt", STRUKTUR_PHASEN["fragment"]![0] !== STRUKTUR_PHASEN["fragment"]![1]);

ist("Fortschritt 0 trifft die erste Phase", phasenFolge("reverse", 0), "schluss");
ist("Fortschritt 1 die letzte", phasenFolge("reverse", 1), "exposition");
ist("und darüber hinaus auch", phasenFolge("reverse", 5), "exposition");
ist("eine unbekannte Struktur erzählt linear", phasenFolge("gibtesnicht", 0), "exposition");

// ── 2 · Am fertigen Text: Wo steht das Schlussbild? ───────────────────────
// Das ist der Beleg, dass die Anordnung wirklich ankommt. Vorwärts erzählt
// steht es am Ende, rückwärts erzählt am Anfang.
const ids = Object.keys(BUILTIN_PRESETS);
const eingabe = (struktur: string): GenInput => ({
  where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte",
  tone: "nuechtern", form: "prose", lenTarget: 200, tension: "off", cast: "auto", mode: "bureau",
  structure: struktur, perspective: "third", rhythm: "clean", disruptor: "off", instability: 0,
  markovMode: "off", varLevel: "mid", archetypeA: "neutral", archetypeB: "neutral",
} as unknown as GenInput);

const schlussStelle = (struktur: string, n = 40): { mittel: number; gefunden: number } => {
  const pos: number[] = [];
  for (let i = 0; i < n; i++) {
    buildStory(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, eingabe(struktur));
    const tr = getTrace();
    const k = tr.findIndex((x) => x.kategorie === "endings");
    if (k >= 0 && tr.length > 1) pos.push(k / (tr.length - 1));
  }
  return { mittel: pos.length ? pos.reduce((a, b) => a + b, 0) / pos.length : NaN, gefunden: pos.length };
};
{
  const lin = schlussStelle("linear"), rev = schlussStelle("reverse");
  wahr(`linear findet ein Schlussbild (${lin.gefunden}/40)`, lin.gefunden >= 25);
  wahr(`reverse auch (${rev.gefunden}/40)`, rev.gefunden >= 25);
  wahr(`linear setzt es ans Ende (${(lin.mittel * 100).toFixed(0)} %)`, lin.mittel > 0.9);
  wahr(`reverse an den Anfang (${(rev.mittel * 100).toFixed(0)} %)`, rev.mittel < 0.3);
}

// ── 2b · Kennsätze stehen an ihrer STELLE im Text ────────────────────────
// „Der Kreis schließt sich:" gehört ans Ende des TEXTES — nicht in die Phase
// „schluss". Beim Rückwärtserzählen liegt die am Anfang, und der Satz stand
// dann im ersten Absatz.
{
  const stellen: number[] = [];
  for (const s of FUENF) {
    // Bewusst viele Läufe: Der Kennsatz kommt nur in jedem zehnten Text vor,
    // und ein Median über sechs Werte ist keiner.
    for (let i = 0; i < 60; i++) {
      const t = buildStory(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, eingabe(s));
      const k = t.indexOf("Der Kreis schließt sich");
      if (k >= 0) stellen.push(k / t.length);
    }
  }
  stellen.sort((a, b) => a - b);
  const median = stellen.length ? stellen[Math.floor(stellen.length / 2)]! : 0;
  wahr(`der Kennsatz kommt überhaupt vor (${stellen.length}×)`, stellen.length >= 3);
  wahr(`er steht im Median ganz hinten (${(median * 100).toFixed(0)} %)`, median > 0.7);
  // Zugesagt wird NUR der Median. Der Assembler setzt den Kennsatz bei 82 % der
  // ZIELlänge; danach hängt die Längenauffüllung noch an, und bei einem Text,
  // der dabei stark wächst, rutscht er nach vorn — gemessen etwa jeder fünfte,
  // gelegentlich bis ins erste Viertel.
  //
  // Eine Zusage über den Einzelfall wäre ein Wackelkandidat: „nie vor der
  // Hälfte" ging in vier von acht Läufen schief, „höchstens einer von zehn" in
  // fünf von zehn — die Stichprobe ist mit sechs bis fünfzehn Vorkommen zu
  // klein für eine Quote. Der Median trägt: Ohne die Stellenmarke fällt er von
  // 90 auf 51 Prozent, und genau das prüft die Gegenprobe.
}

// ── 3 · Bleiben sie unterscheidbar? ───────────────────────────────────────
// Das Risiko des Umbaus: ein Assembler für alle könnte sie einander angleichen.
// Gemessen wird die Ähnlichkeit über Inhaltswörter — vor dem Umbau lagen die
// fünf Schablonen bei 0,57 bis 0,63 zueinander.
{
  const proben: Record<string, string[]> = {};
  for (const s of FUENF) {
    proben[s] = [];
    for (let i = 0; i < 12; i++) proben[s]!.push(buildStory(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, eingabe(s)));
  }
  const worte = (t: string): Set<string> => new Set(t.toLowerCase().match(/[a-zäöüß]{4,}/g) || []);
  const jac = (a: Set<string>, b: Set<string>): number => {
    let s = 0; a.forEach((x) => { if (b.has(x)) s++; });
    return s / (a.size + b.size - s);
  };
  let hoechste = 0, paar = "";
  for (let x = 0; x < FUENF.length; x++) {
    for (let y = x + 1; y < FUENF.length; y++) {
      let sum = 0;
      for (let i = 0; i < 12; i++) sum += jac(worte(proben[FUENF[x]!]![i]!), worte(proben[FUENF[y]!]![i]!));
      const m = sum / 12;
      if (m > hoechste) { hoechste = m; paar = `${FUENF[x]}/${FUENF[y]}`; }
    }
  }
  wahr(`keine zwei Strukturen gleichen einander über 0,55 (höchste: ${paar} ${hoechste.toFixed(2)})`, hoechste < 0.55);
}

// ── 4 · Die Qualität, die der Assembler mitbringt ────────────────────────
// Vor dem Umbau: Phrasenwiederholung 0,039 bis 0,057. Danach unter 0,02.
for (const s of FUENF) {
  let rep = 0;
  for (let i = 0; i < 25; i++) rep += phraseRepeatRatio(buildStory(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, eingabe(s)));
  const m = rep / 25;
  wahr(`${s}: Phrasenwiederholung unter 0,02 (${m.toFixed(3)})`, m < 0.02);
}

// ── 5 · Der Auffang ──────────────────────────────────────────────────────
// Liefert der Assembler nichts, wird gebaut wie bisher. Ein Umbau, der im
// Zweifel gar keinen Text erzeugt, wäre kein Fortschritt.
{
  const leer = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] } as unknown as Bank;
  for (const s of FUENF) {
    const t = buildStory(leer, eingabe(s));
    wahr(`${s} liefert auch bei leerer Wortbank Text`, t.trim().length > 30);
  }
}


// ── 6 · Die Dramaturgie muss ihren Bogen behalten ─────────────────────────
// Sie ist die einzige Struktur, die noch über die Schablonen baut, und die
// einzige, die aus dem ERZÄHLBOGEN des Presets schöpft statt aus den sieben
// Bank-Kategorien. Ihr Versprechen: Einstieg, Mitte und Höhepunkt stehen im
// Text.
//
// Gemessen hat sie es nicht gehalten: Der Höhepunkt fehlte in 41 von 120
// Texten (34 %). Ursache war die Regel in `coherencePass`, die späte Sätze
// ohne Motivbezug wegwirft — der Höhepunkt steht am Ende, und sein Wortlaut
// teilt oft kein Wort mit dem übrigen Text. Genau das Merkmal, an dem die Regel
// ein verirrtes Atom erkennt.
{
  const norm = (x: string): string[] => x.toLowerCase().match(/[a-zäöüß]{4,}/g) || [];
  const steht = (t: string, arr: string[]): boolean => {
    const tw = norm(t).join(" ");
    return arr.some((x) => {
      const w = norm(x);
      if (w.length < 3) return w.length > 0 && w.every((y) => tw.includes(y));
      for (let j = 0; j + 3 <= w.length; j++) if (tw.includes(w.slice(j, j + 3).join(" "))) return true;
      return false;
    });
  };
  let n = 0, ohneEinstieg = 0, ohneMitte = 0, ohneHoehepunkt = 0;
  for (const id of ids) {
    const D = BUILTIN_DRAMA[id];
    if (!D) continue;
    setDramaData(D);
    for (let i = 0; i < 3; i++) {
      const t = buildStory(BUILTIN_PRESETS[id] as Bank, eingabe("dramaturgie"));
      n++;
      if (D.einstieg.length && !steht(t, D.einstieg)) ohneEinstieg++;
      if (D.mitte.length && !steht(t, D.mitte)) ohneMitte++;
      if (D.hoehepunkt.length && !steht(t, D.hoehepunkt)) ohneHoehepunkt++;
    }
  }
  setDramaData(null);
  wahr(`alle Presets mit Bogen wurden geprüft (${n})`, n >= 140);
  wahr(`der Einstieg steht im Text (${ohneEinstieg} Ausfälle von ${n})`, ohneEinstieg <= n * 0.03);
  wahr(`die Mitte auch (${ohneMitte} von ${n})`, ohneMitte <= n * 0.03);
  // Die Schranke für den Höhepunkt ist bewusst weiter als die beiden darüber.
  // Grund: Sie lag bei 3 % und schlug in jedem fünften Lauf grundlos an. 15
  // Messungen zu je 153 Texten ergaben 1 bis 6 Ausfälle, im Mittel 3,3 (2,1 %)
  // — die Schranke saß mit 4,59 mitten im Rauschen. Bei n = 153 und p = 2 % ist
  // eine Streuung von ±2 Zählern normal; eine Schranke muss außerhalb davon
  // liegen, sonst prüft sie den Zufall.
  //
  // 8 % ist außerhalb (Höchstwert 6 von 153 = 3,9 %) und trotzdem streng: Der
  // Zustand, gegen den diese Prüfung gebaut wurde, lag bei 34 % — 52 Ausfälle.
  // Sie würde ihn um das Vierfache verfehlen.
  //
  // NACHTRAG 4.277.0: Diese Änderung stand in der Übergabe zu 4.276.0 und war
  // im Quelltext nicht angekommen — ein Skript hatte sie überschrieben. Der
  // Prüfstand meldete danach weiter grundlos rot. Wer eine Schranke verschiebt,
  // prüft danach, ob sie verschoben IST.
  wahr(`und der Höhepunkt (${ohneHoehepunkt} von ${n})`, ohneHoehepunkt <= n * 0.08);
}

// ── 7 · Die Regel darf dabei nicht stumpf werden ──────────────────────────
// Sie soll weiterhin wegwerfen, was am Ende ohne Bezug dasteht — sonst ist der
// Schutz des Bogens mit dem Verlust der Reinigung bezahlt.
{
  setDramaData(null);
  const text = "Die Archivarin sucht eine Akte. Die Akte liegt im Archiv. Die Archivarin blättert. "
    + "Ein Zeppelin verliert seine Schrauben über Feuerland.";
  const raus = coherencePass(text, { who: "die Archivarin", where: "im Archiv", what: "sucht eine Akte", form: "prose" } as unknown as GenInput);
  wahr("ein verirrter Satz am Ende fliegt weiter raus", !raus.includes("Zeppelin"));
  wahr("und der verbundene Text bleibt stehen", raus.includes("Die Akte liegt im Archiv"));
}

console.log(`Prüfstand Struktur — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Struktur: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Struktur: alle ${geprueft} Prüfungen bestanden.`);
}
