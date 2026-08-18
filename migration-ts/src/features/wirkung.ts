// Wirkungsmesser: Wie weit bewegt ein Regler überhaupt etwas?
//
// Die Frage kam aus der Bitte nach einem „Optimum". Ein Optimum gibt es hier
// nicht — der Raum hat rund 10¹² Kombinationen, die Maße widersprechen
// einander, und der Mittelwert ist nicht der Eindruck. Was es gibt, ist eine
// ehrliche Zahl je Regler: der AUSSCHLAG im Verhältnis zum RAUSCHEN.
//
//   Ausschlag = Spanne der Mittelwerte über die Stellungen eines Reglers
//   Rauschen  = mittlere Streuung innerhalb einer Stellung (dieselbe
//               Einstellung, mehrfach gewürfelt)
//   Wirkung   = Ausschlag / Rauschen
//
// Unter 1 bewegt der Regler weniger als der Zufall zwischen zwei Läufen
// derselben Einstellung. Das ist der Punkt der ganzen Übung: „Ein Regler, der
// nichts bewegt, ist schlimmer als keiner" — bisher war das eine Vermutung,
// jetzt ist es messbar.
//
// Gemessen wird mit den Maßen, die es schon gibt. Kein neues Qualitätsmaß:
// Ein Maß, das nur für dieses Instrument erfunden wird, misst das Instrument.
import type { Bank, GenInput } from "../types";
import { buildStory } from "../generation/buildStory";
import { analyzeText, repetitionRatio } from "../generation/scoring";
import { phraseRepeatRatio, tenseBreakRatio, perspectiveBreakRatio, castSpread } from "../generation/coherence";
import type { MarkovModel } from "../corpus";

/** Ein Regler: seine Stellungen und wie er in die Eingabe geschrieben wird. */
export interface ReglerDef {
  id: string;
  label: string;
  werte: string[];
  setzen: (e: GenInput, wert: string) => GenInput;
}

export interface MassWert { name: string; hochIstGut: boolean }

/** Die Maße. Alle bestehen schon und werden anderswo benutzt — hier stehen sie
 *  nur nebeneinander. `hochIstGut` dient der Anzeige, nicht der Rechnung: Der
 *  Ausschlag ist richtungsblind, und das ist Absicht. */
export const MASSE: MassWert[] = [
  { name: "Wiederholung", hochIstGut: false },
  { name: "Phrasen", hochIstGut: false },
  { name: "Tempusbruch", hochIstGut: false },
  { name: "Perspektivbruch", hochIstGut: false },
  { name: "Figurenstreuung", hochIstGut: false },
  { name: "Wortvielfalt", hochIstGut: true },
  { name: "Längentreue", hochIstGut: true },
  { name: "Rhythmus", hochIstGut: true },
  { name: "Satzanfänge", hochIstGut: false },
];

/** Alle Maße eines Textes in einem Rutsch. */
export function misseText(text: string, e: GenInput): Record<string, number> {
  const a = analyzeText(text, Number(e.lenTarget) || 120);
  return {
    Wiederholung: repetitionRatio(text),
    Phrasen: phraseRepeatRatio(text),
    Tempusbruch: tenseBreakRatio(text),
    Perspektivbruch: perspectiveBreakRatio(text, e.perspective),
    Figurenstreuung: castSpread(text, (e.who || "").split(/[,;]/).map((x) => x.trim()).filter(Boolean)),
    Wortvielfalt: a.ttr,
    "Längentreue": a.lenFit,
    Rhythmus: a.rhythmScore,
    "Satzanfänge": a.flow.startMonotony,
  };
}

const mittel = (xs: number[]): number => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const sigma = (xs: number[]): number => {
  if (xs.length < 2) return 0;
  const m = mittel(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) * (b - m), 0) / (xs.length - 1));
};

export interface Stellung { wert: string; mittel: Record<string, number>; sigma: Record<string, number>; n: number }
export interface ReglerMessung {
  id: string; label: string;
  stellungen: Stellung[];
  /** Je Maß: Ausschlag geteilt durch Rauschen. */
  wirkungJeMass: Record<string, number>;
  /** Das Maximum daraus — ein Regler wirkt, sobald er EIN Maß bewegt. */
  wirkung: number;
  /** Das Maß, an dem er am meisten bewegt. */
  staerkstesMass: string;
}

/** Misst eine einzelne Stellung: N Läufe, Mittel und Streuung je Maß. */
export function misseStellung(
  bank: Bank, basis: GenInput, def: ReglerDef, wert: string, n: number,
  model?: MarkovModel,
): Stellung {
  const e = def.setzen({ ...basis }, wert);
  const reihen: Record<string, number[]> = {};
  for (let i = 0; i < n; i++) {
    let text = "";
    try { text = buildStory(bank, e, model); } catch { text = ""; }
    if (!text) continue;
    const m = misseText(text, e);
    for (const k of Object.keys(m)) (reihen[k] ||= []).push(m[k]!);
  }
  const mi: Record<string, number> = {}, si: Record<string, number> = {};
  for (const k of Object.keys(reihen)) { mi[k] = mittel(reihen[k]!); si[k] = sigma(reihen[k]!); }
  return { wert, mittel: mi, sigma: si, n };
}

/** Fasst die Stellungen eines Reglers zur Wirkung zusammen. */
export function fasseZusammen(id: string, label: string, stellungen: Stellung[]): ReglerMessung {
  const wirkungJeMass: Record<string, number> = {};
  let best = 0, bestName = "";
  for (const { name } of MASSE) {
    const mittelwerte = stellungen.map((s) => s.mittel[name] ?? 0);
    const rauschen = mittel(stellungen.map((s) => s.sigma[name] ?? 0));
    const ausschlag = Math.max(...mittelwerte) - Math.min(...mittelwerte);
    // Ohne Rauschen (alle Läufe identisch) ist jeder Ausschlag unendlich stark —
    // deshalb eine Untergrenze. Sie ist bewusst klein: Sie soll nicht dämpfen,
    // sondern nur die Division retten.
    const w = ausschlag / Math.max(rauschen, 1e-4);
    wirkungJeMass[name] = w;
    if (w > best) { best = w; bestName = name; }
  }
  return { id, label, stellungen, wirkungJeMass, wirkung: best, staerkstesMass: bestName };
}

/** Vier Bänder statt einer Farbe. Ohne sie war jeder Balken gleich eingefärbt,
 *  und die Zahl musste allein tragen — man sah nicht, was am Rand des Rauschens
 *  steht und was den Text umkrempelt.
 *
 *  Die Grenzen sind gesetzt, nicht gemessen: 1 ist die Rauschschwelle (dort
 *  bewegt der Regler so viel wie der Zufall), 2 ist der Punkt, ab dem der
 *  Ausschlag das Rauschen sicher überragt, 5 der, ab dem er es dominiert.
 *  Wichtig: Das ist KEIN Qualitätsurteil. Ein starker Regler ist nicht besser,
 *  er ist nur wirksamer. */
export type Band = "rauschen" | "schwach" | "deutlich" | "stark";
export function band(wirkung: number): Band {
  if (!Number.isFinite(wirkung) || wirkung < 1) return "rauschen";
  if (wirkung < 2) return "schwach";
  if (wirkung < 5) return "deutlich";
  return "stark";
}
export const BAND_LABEL: Record<Band, string> = {
  rauschen: "unter dem Rauschen", schwach: "knapp darüber",
  deutlich: "bewegt deutlich", stark: "bewegt stark",
};

/** Die Regler, die gemessen werden. Zahlenregler sind hier bewusst NICHT dabei:
 *  Sie haben zu viele Stellungen, und ihr Ausschlag ließe sich nur über eine
 *  Kurve zeigen, nicht über eine Spanne. */
export function reglerListe(): ReglerDef[] {
  const s = (id: string, label: string, werte: string[], feld: keyof GenInput): ReglerDef =>
    ({ id, label, werte, setzen: (e, w) => ({ ...e, [feld]: w }) });
  return [
    s("tone", "Ton", ["neutral", "dark", "uplifting", "melancholic", "ironic", "humorous"], "tone"),
    s("structure", "Struktur", ["linear", "reverse", "circle", "fragment", "object"], "structure"),
    s("mode", "Modus", ["bureau", "tech", "body", "myth", "absurd", "post"], "mode"),
    s("perspective", "Perspektive", ["third", "first", "second", "we", "object", "split"], "perspective"),
    s("rhythm", "Rhythmus", ["breath", "staccato", "long", "fracture", "clean"], "rhythm"),
    s("varLevel", "Varianz", ["low", "mid", "high"], "varLevel"),
    s("markovMode", "Markov", ["off", "mix", "strong"], "markovMode"),
    s("disruptor", "Disruptor", ["none", "cut", "echo", "swap"], "disruptor"),
    s("archetypeA", "Archetyp A", ["neutral", "wanderer", "waechter", "trickster", "schoepfer"], "archetypeA"),
    {
      id: "instability", label: "Instabilität", werte: ["0", "1", "2"],
      setzen: (e, w) => ({ ...e, instability: Number(w) as 0 | 1 | 2 }),
    },
    {
      // Der eingebaute Gegentest: Dieser „Regler" ändert NICHTS. Er muss unter
      // 1 landen. Tut er es nicht, misst das Instrument Rauschen als Wirkung —
      // und alle anderen Zahlen sind wertlos.
      id: "blindprobe", label: "Blindprobe (ändert nichts)", werte: ["a", "b", "c"],
      setzen: (e) => ({ ...e }),
    },
  ];
}
