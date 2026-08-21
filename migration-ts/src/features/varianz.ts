// Varianzmesser: Wie verschieden sind die Beiträge EINER Ausgabe?
//
// Der Befund war „immer wieder ähnliche Beiträge". Das ist eine Wahrnehmung,
// und Wahrnehmungen dieser Art sind in diesem Projekt schon mehrfach richtig
// gewesen, wo die Läufe grün meldeten. Also wird gemessen — und zwar das, was
// den Eindruck macht: die Ähnlichkeit zum NÄCHSTEN Nachbarn.
//
// Warum nicht der Durchschnitt aller Paare: Bei zwölf Beiträgen gibt es 66
// Paare. Sind zwei davon fast gleich und alle anderen verschieden, ist der
// Durchschnitt hoch — der Leser sieht trotzdem die Dublette. Der Eindruck
// entsteht am nächsten Nachbarn, nicht am Mittel.
//
// Gemessen wird auf zwei Ebenen, weil beide für sich täuschen:
//   · Inhaltswörter (Jaccard) — trifft gleiche Motive, auch anders formuliert.
//   · Dreiwortgruppen — trifft wörtliche Übernahmen aus derselben Wortbank.
//
// Rein, ohne DOM: Die Anzeige darf nichts rechnen, was der Prüfstand nicht
// nachrechnen kann.

/** Wörter, die in jedem deutschen Text vorkommen und deshalb nichts über
 *  Ähnlichkeit sagen. Kurz gehalten: Die Längengrenze von vier Zeichen siebt
 *  das meiste schon aus. */
const STOPP = new Set([
  "aber", "auch", "dann", "dass", "denn", "doch", "durch", "eine", "einem", "einen",
  "einer", "eines", "gegen", "haben", "hatte", "immer", "jeder", "kann", "mehr",
  "nach", "nicht", "noch", "oder", "schon", "sein", "seine", "sich", "sind", "über",
  "unter", "wenn", "werden", "wieder", "wird", "wurde", "zwischen", "diese", "dieser",
  "dieses", "damit", "dabei", "davon", "etwas", "ohne", "sondern", "zwar",
]);

/** Die Inhaltswörter eines Textes, klein geschrieben und ohne Dubletten. */
export function inhaltsWoerter(text: string): Set<string> {
  const raus = new Set<string>();
  for (const w of (text || "").toLowerCase().match(/[a-zäöüß]{4,}/g) || []) {
    if (!STOPP.has(w)) raus.add(w);
  }
  return raus;
}

/** Alle Dreiwortgruppen eines Textes. */
export function dreiergruppen(text: string): Set<string> {
  const w = (text || "").toLowerCase().match(/[a-zäöüß]+/g) || [];
  const raus = new Set<string>();
  for (let i = 0; i + 2 < w.length; i++) raus.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return raus;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  if (!a.size || !b.size) return 0;
  let schnitt = 0;
  const klein = a.size <= b.size ? a : b, gross = a.size <= b.size ? b : a;
  for (const x of klein) if (gross.has(x)) schnitt++;
  return schnitt / (a.size + b.size - schnitt);
}

/** Ähnlichkeit zweier Texte, 0 (nichts gemeinsam) bis 1 (gleich).
 *
 *  Die Dreiwortgruppen wiegen doppelt: Wörtlich übernommene Wendungen fallen
 *  einem Leser sofort auf, gemeinsame Motive erst beim zweiten Hinsehen. */
export function aehnlichkeit(a: string, b: string): number {
  const w = jaccard(inhaltsWoerter(a), inhaltsWoerter(b));
  const g = jaccard(dreiergruppen(a), dreiergruppen(b));
  return Math.max(0, Math.min(1, (w + 2 * g) / 3));
}

export interface VarianzStueck { titel: string; text: string; form?: string; bank?: string; quelle?: string }
export interface VarianzPaar { a: number; b: number; wert: number }
export type VarianzBand = "hoch" | "mittel" | "gering";

export interface VarianzBericht {
  /** 0 bis 1. 1 = jeder Beitrag steht für sich. */
  wert: number;
  band: VarianzBand;
  /** Je Beitrag die höchste Ähnlichkeit zu einem anderen. */
  naechste: number[];
  /** Die ähnlichsten Paare, absteigend — die Belegstellen. */
  paare: VarianzPaar[];
  /** Vielfalt der Einstellungen, je 0 bis 1 (Anteil verschiedener Werte). */
  vielfalt: { formen: number; baenke: number; quellen: number; laengen: number };
}

/** Die Schwellen. Sie sind gesetzt, nicht gemessen — und deshalb steht hier,
 *  woran sie sich orientieren: Ab einer nächsten Ähnlichkeit von 0,25 findet
 *  man beim Lesen die Verwandtschaft, ab 0,45 hält man zwei Beiträge für
 *  denselben Stoff. */
export function varianzBand(wert: number): VarianzBand {
  if (!Number.isFinite(wert) || wert < 0.55) return "gering";
  if (wert < 0.75) return "mittel";
  return "hoch";
}

const anteilVerschieden = (werte: (string | undefined)[]): number => {
  const gefuellt = werte.filter((x): x is string => !!x);
  if (gefuellt.length < 2) return 1;
  return new Set(gefuellt).size / gefuellt.length;
};

/** Streuung der Längen, als Variationskoeffizient auf 0..1 gestaucht.
 *  Vier gleich lange Beiträge ergeben eine Tapete, auch wenn sie inhaltlich
 *  verschieden sind. */
function laengenVielfalt(texte: string[]): number {
  const n = texte.map((t) => (t.match(/\S+/g) || []).length).filter((x) => x > 0);
  if (n.length < 2) return 1;
  const m = n.reduce((a, b) => a + b, 0) / n.length;
  if (m <= 0) return 0;
  const sd = Math.sqrt(n.reduce((a, b) => a + (b - m) * (b - m), 0) / n.length);
  // 0,5 Variationskoeffizient gilt als volle Vielfalt — mehr Streuung ist
  // möglich, sagt dem Auge aber nichts mehr.
  return Math.max(0, Math.min(1, (sd / m) / 0.5));
}

export function varianzBericht(stuecke: VarianzStueck[]): VarianzBericht {
  const n = stuecke.length;
  const leer: VarianzBericht = {
    wert: 1, band: "hoch", naechste: [], paare: [],
    vielfalt: { formen: 1, baenke: 1, quellen: 1, laengen: 1 },
  };
  if (n < 2) return leer;

  const naechste = new Array<number>(n).fill(0);
  const paare: VarianzPaar[] = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const w = aehnlichkeit(stuecke[i]!.text, stuecke[j]!.text);
      paare.push({ a: i, b: j, wert: w });
      if (w > naechste[i]!) naechste[i] = w;
      if (w > naechste[j]!) naechste[j] = w;
    }
  }
  const mittelNaechste = naechste.reduce((a, b) => a + b, 0) / n;
  const wert = Math.max(0, Math.min(1, 1 - mittelNaechste));
  paare.sort((a, b) => b.wert - a.wert);
  return {
    wert, band: varianzBand(wert), naechste,
    paare: paare.slice(0, 3),
    vielfalt: {
      formen: anteilVerschieden(stuecke.map((s) => s.form)),
      baenke: anteilVerschieden(stuecke.map((s) => s.bank)),
      quellen: anteilVerschieden(stuecke.map((s) => s.quelle)),
      laengen: laengenVielfalt(stuecke.map((s) => s.text)),
    },
  };
}
