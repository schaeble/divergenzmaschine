// Der Faden (4.362.0) — Fortsetzungen: Geschichten wie Perlen aufgefädelt.
//
// Jede Geschichte für sich ist vollständig; eine Reihe braucht zwei Löcher je
// Perle — eines, durch das der Faden hereinkommt, eines, durch das er
// hinausgeht. Der Faden selbst ist dünn: DREI Dinge wandern von Folge zu
// Folge — die Figur (der Wer bleibt), ein Ding (eine Requisite, die in der
// nächsten Folge wieder auftaucht, verwandelt) und eine offene Frage (das,
// was am Ende nicht beantwortet wurde, wird zum Was der nächsten Folge).
// Dazu der letzte Satz der vorigen Folge als „Bisher"-Zeile und die Nummer.
// Ort, Zeit, Ton und Preset wechseln — sonst liest man dieselbe Geschichte
// zweimal.
//
// Der Bogen über den Folgen: Fünf Folgen sind fünf Schläge einer Serien-
// Bauform (Einstieg · Konflikt · Wende · Höhepunkt · Schluss). Jede Folge
// weiß, welcher Schlag sie ist, und bekommt danach ihre Bauform: die
// Einstiegs-Folge steigend, die Konflikt-Folge mit später Wende, die Wende-
// Folge doppelt, die Höhepunkt-Folge als Katastrophe zuerst, die Schluss-
// Folge als Kreisschluss — das Ding aus Folge 1 kehrt zurück.
import { splitSentences } from "../text-utils";
import { guessGender } from "../generation/declension";

export interface Faden {
  aktiv: boolean;
  serie: string;        // Name der Serie (Titel der ersten Folge)
  figur: string;        // der Wer
  ding: string;         // die Requisite, die wandert (Nominativ mit Artikel)
  frage: string;        // die offene Frage → Was der nächsten Folge
  letzterSatz: string;  // „Bisher"
  folge: number;        // Nummer der NÄCHSTEN Folge
  laenge: number;       // Folgen je Serie (Vorgabe 5)
  bauform: string;      // Serien-Bauform (Schlüssel aus SCHLAGFOLGEN)
}

const KEY = "dm_faden_v1";
export const SERIEN_LAENGE = 5;

export function ladeFaden(): Faden | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<Faden> | null;
    if (!v || !v.aktiv) return null;
    return { aktiv: true, serie: String(v.serie || ""), figur: String(v.figur || ""), ding: String(v.ding || ""), frage: String(v.frage || ""),
      letzterSatz: String(v.letzterSatz || ""), folge: Math.max(2, Number(v.folge) || 2), laenge: Math.max(2, Number(v.laenge) || SERIEN_LAENGE), bauform: String(v.bauform || "standard") };
  } catch { return null; }
}
export function speichereFaden(f: Faden | null): void {
  try { if (f) localStorage.setItem(KEY, JSON.stringify(f)); else localStorage.removeItem(KEY); } catch { /* voll */ }
}

/** Die Schläge einer Serie, gleichmäßig auf die Folgen gelegt. */
export const SERIEN_SCHLAEGE = ["einstieg", "konflikt", "wende", "hoehepunkt", "schluss"] as const;
export type SerienSchlag = typeof SERIEN_SCHLAEGE[number];
export function schlagDerFolge(folge: number, laenge = SERIEN_LAENGE): SerienSchlag {
  const n = Math.max(2, laenge);
  const i = Math.round(((Math.max(1, Math.min(n, folge)) - 1) / (n - 1)) * (SERIEN_SCHLAEGE.length - 1));
  return SERIEN_SCHLAEGE[i]!;
}
/** Welche Bauform eine Folge nach ihrem Schlag bekommt. */
export const BAUFORM_JE_SCHLAG: Record<SerienSchlag, string> = { einstieg: "standard", konflikt: "retardation", wende: "doppelt", hoehepunkt: "katastrophe", schluss: "kreis" };
export const SCHLAG_NAME: Record<SerienSchlag, string> = { einstieg: "Einstieg", konflikt: "Konflikt", wende: "Wende", hoehepunkt: "Höhepunkt", schluss: "Schluss" };

// ── Aus einem Text den Faden ziehen ─────────────────────────────────────────
const FUNKTION = new Set(["der", "die", "das", "ein", "eine", "einen", "einem", "einer", "dem", "den", "des", "und", "oder", "aber", "nicht", "kein", "keine", "sich", "ihm", "ihr", "ihn"]);

/** Das Ding: eine Nominalphrase mit Artikel aus dem Text — bevorzugt eine, die
 *  mehrfach vorkommt (sie trägt schon), sonst die erste konkrete (Genus
 *  bekannt); im Nominativ. Leer, wenn keine da ist. */
export function dingAus(text: string, ausser = ""): string {
  const kandidaten = new Map<string, { np: string; n: number; unbestimmt: boolean }>();
  const re = /\b([Ee]in|[Ee]ine|[Ee]inen|[Ee]inem|[Ee]iner|[Dd]er|[Dd]ie|[Dd]as|[Dd]en|[Dd]em)\s+(?:([a-zäöüß]{3,}(?:e|en|er|es|em))\s+)?([A-ZÄÖÜ][a-zäöüß]{3,})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const art = m[1]!.toLowerCase(), adj = m[2] || "", nomen = m[3]!;
    const ausserNomen = (ausser.match(/[A-ZÄÖÜ][a-zäöüß]+$/) || [ausser])[0]!.toLowerCase();
    if (FUNKTION.has(nomen.toLowerCase()) || nomen.toLowerCase() === ausserNomen) continue;
    const g = guessGender(nomen);
    if (!g) continue;
    const nomArt = (art.startsWith("ein")) ? (g === "f" ? "eine" : "ein") : (g === "m" ? "der" : g === "f" ? "die" : "das");
    let nomAdj = adj;
    if (adj) { const st = adj.replace(/(e|en|er|es|em)$/, ""); nomAdj = st + (nomArt.startsWith("ein") ? (g === "m" ? "er" : g === "f" ? "e" : "es") : "e"); }
    const np = `${nomArt} ${nomAdj ? nomAdj + " " : ""}${nomen}`;
    const k = nomen.toLowerCase();
    const e = kandidaten.get(k);
    if (e) { e.n++; if (art.startsWith("ein")) e.unbestimmt = true; } else kandidaten.set(k, { np, n: 1, unbestimmt: art.startsWith("ein") });
  }
  // Häufigkeit zuerst; bei Gleichstand das Ding, das mit unbestimmtem Artikel
  // eingeführt wurde („ein Schlüssel") — das ist die Requisite, nicht der Ort.
  const liste = [...kandidaten.values()].sort((a, b) => (b.n - a.n) || (Number(b.unbestimmt) - Number(a.unbestimmt)));
  return liste[0]?.np || "";
}

/** Die offene Frage: der letzte Fragesatz des Textes — sonst aus dem Einsatz
 *  („Es geht um X" → „Was wird aus X?") — sonst aus dem Ding. */
export function frageAus(text: string, ding: string): string {
  const s = splitSentences(text.replace(/\n+/g, " "));
  const fragen = s.filter((x) => /\?$/.test(x.trim()));
  if (fragen.length) return fragen[fragen.length - 1]!.trim();
  const einsatz = [...s].reverse().find((x) => /^(Es geht um|Der Einsatz ist|Auf dem Spiel steht|Alles dreht sich um|Was zählt, ist)\b/i.test(x));
  if (einsatz) {
    const kern = einsatz.replace(/^(Es geht um|Der Einsatz ist|Auf dem Spiel steht|Alles dreht sich um|Was zählt, ist)\s*/i, "").replace(/[.!…]+$/, "").replace(/^(eines|eins):\s*/i, "");
    if (kern) return `Was wird aus ${kern}?`;
  }
  if (ding) return `Wer hat ${ding.replace(/^(der|ein)\s/, "den ").replace(/^die\s/, "die ").replace(/^das\s/, "das ").replace(/^eine\s/, "eine ")} zurückgelassen?`;
  return "Was bleibt?";
}

/** Den Faden aus einer Folge ziehen — oder einen bestehenden weiterspinnen. */
export function fadenAus(text: string, figur: string, titel: string, bisher: Faden | null): Faden {
  const s = splitSentences(text.replace(/\n+/g, " "));
  const letzter = (s[s.length - 1] || "").trim();
  const ding = bisher?.ding || dingAus(text, figur);
  return {
    aktiv: true,
    serie: bisher?.serie || titel || (s[0] || "Serie").slice(0, 40),
    figur: bisher?.figur || figur,
    ding,
    frage: frageAus(text, ding),
    letzterSatz: letzter,
    folge: (bisher?.folge || 1) + 1,
    laenge: bisher?.laenge || SERIEN_LAENGE,
    bauform: bisher?.bauform || "standard",
  };
}

/** Ein Satz, der das Ding in die neue Folge legt, wenn der Text es nicht von
 *  selbst trägt — verwandelt, nicht erklärt. */
export function dingSatz(ding: string, rnd: () => number = Math.random): string {
  const d = ding.charAt(0).toUpperCase() + ding.slice(1);
  const formen = [
    `${d} liegt hier, als wäre es nie fort gewesen.`,
    `${d} ist mitgekommen, ohne dass jemand es getragen hätte.`,
    `Auf dem Tisch: ${ding}, kälter als gestern.`,
    `${d} — noch immer, an einem Ort, der es nicht kennt.`,
  ];
  return formen[Math.floor(rnd() * formen.length)]!;
}
