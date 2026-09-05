// Spannungskurve — mit der Maus einstellbar, im Hintergrund werden die
// Einsätze gesetzt (4.345.0).
//
// Gewünscht: ein Graph unter dem Einfachen Kopf, mit der Maus formbar; die
// Maschine setzt daraus, was nötig ist. Die Kurve hat sieben Stützstellen
// über der Textlänge (0 … 1), jede 0 (ruhig) … 1 (angespannt). Sie wirkt an
// drei Stellen:
//
//   1. RHYTHMUS je Position: Wo die Kurve hoch steht, werden Sätze an tragfähigen
//      Kommas geteilt und Fragmente eingestreut; wo sie tief steht, werden
//      kurze Nachbarsätze zu ruhigen Bögen verbunden. Das ist der Mechanismus
//      des Reglers „Spannung", nur nicht mit EINEM Peak, sondern entlang der
//      ganzen Kurve — für jede Struktur, auch ohne Bogen.
//   2. SCHLAGFOLGE aus der Kurve: In den Bogen-Strukturen (Dramaturgie,
//      Rekombination mit Bogen, Multi-Shot) wird der Höhepunkt dorthin gelegt,
//      wo die Kurve ihr Maximum hat, eine zweite Wende an eine zweite Spitze;
//      ein hoher Schluss macht das Ende offen, ein tiefer schließt. Die
//      Bauform des Bogens tritt dann hinter die Kurve zurück.
//   3. REGLER: Der Regler „Spannung" wird auf die Lage des Maximums gestellt
//      (oben/mitte/unten), damit die Struktur-Ansicht und der Schaltplan es
//      zeigen — der Text folgt aber der Kurve, nicht dem Regler.
//
// Aus ist die Kurve nur ein Bild. Vorlagen: Steigend, Späte Wende, Doppelt,
// Katastrophe zuerst, Flach, Offen.

export const STUETZEN = 7;
export interface Spannungskurve { an: boolean; werte: number[] }

const KEY = "dm_spannungskurve_v1";

export const KURVEN_VORLAGEN: Record<string, { name: string; werte: number[] }> = {
  steigend:    { name: "Steigend",           werte: [0.15, 0.25, 0.35, 0.5, 0.65, 0.9, 0.3] },
  spaet:       { name: "Späte Wende",        werte: [0.2, 0.3, 0.25, 0.2, 0.3, 0.95, 0.35] },
  doppelt:     { name: "Doppelt",            werte: [0.2, 0.5, 0.85, 0.35, 0.6, 0.95, 0.25] },
  katastrophe: { name: "Katastrophe zuerst", werte: [0.95, 0.7, 0.45, 0.35, 0.3, 0.4, 0.25] },
  flach:       { name: "Flach",              werte: [0.3, 0.3, 0.3, 0.3, 0.3, 0.3, 0.3] },
  offen:       { name: "Offen",              werte: [0.2, 0.3, 0.4, 0.5, 0.65, 0.8, 0.9] },
};

const klemm = (x: number): number => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0.3));

export function ladeKurve(): Spannungskurve {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<Spannungskurve> | null;
    const werte = Array.isArray(v?.werte) && v!.werte!.length === STUETZEN ? v!.werte!.map(klemm) : [...KURVEN_VORLAGEN["steigend"]!.werte];
    return { an: !!v?.an, werte };
  } catch { return { an: false, werte: [...KURVEN_VORLAGEN["steigend"]!.werte] }; }
}
export function speichereKurve(k: Spannungskurve): void {
  try { localStorage.setItem(KEY, JSON.stringify({ an: k.an, werte: k.werte.map(klemm) })); } catch { /* voll */ }
}

/** Kurvenwert an Position p (0 … 1), linear zwischen den Stützstellen. */
export function kurveWert(werte: number[], p: number): number {
  const n = werte.length;
  if (n === 0) return 0.3;
  if (n === 1) return klemm(werte[0]!);
  const x = klemm(p) * (n - 1);
  const i = Math.min(n - 2, Math.floor(x));
  const t = x - i;
  return klemm(werte[i]! * (1 - t) + werte[i + 1]! * t);
}

/** Lage des Maximums (0 … 1) und Höhe; dazu eine zweite Spitze, wenn sie
 *  deutlich ist (lokales Maximum, mindestens 0,5 und mindestens zwei
 *  Stützstellen vom Hauptmaximum entfernt). */
export function kurveSpitzen(werte: number[]): { max: number; hoehe: number; zweite: number | null } {
  let mi = 0;
  werte.forEach((v, i) => { if (v > werte[mi]!) mi = i; });
  let zweite: number | null = null; let zh = 0;
  werte.forEach((v, i) => {
    if (Math.abs(i - mi) < 2 || v < 0.5) return;
    const l = werte[i - 1] ?? -1, r = werte[i + 1] ?? -1;
    if (v >= l && v >= r && v > zh) { zh = v; zweite = i; }
  });
  const n = werte.length - 1;
  return { max: mi / n, hoehe: werte[mi]!, zweite: zweite === null ? null : (zweite as number) / n };
}

/** Schlagfolge aus der Kurve: Der Höhepunkt liegt am Maximum, eine Wende an
 *  der zweiten Spitze (sonst kurz vor dem Maximum), der Konflikt davor; hoher
 *  Schluss = offen (endet am Einsatz), tiefer Schluss = Schluss. Zwölf
 *  Schritte, damit die Lage fein genug greift. */
export function schlagfolgeAusKurve(werte: number[]): string[] {
  const { max, zweite } = kurveSpitzen(werte);
  const n = 12;
  const folge: string[] = Array.from({ length: n }, () => "");
  const setze = (p: number, s: string): void => { const i = Math.max(0, Math.min(n - 1, Math.round(p * (n - 1)))); folge[i] = s; };
  folge[0] = "einstieg";
  setze(max, "hoehepunkt");
  if (zweite !== null) setze(zweite, "wende");
  else setze(Math.max(0.08, max - 0.2), "wende");
  setze(Math.max(0.08, (zweite !== null ? Math.min(zweite, max) : max) - 0.35), "konflikt");
  setze(Math.max(0.08, max - 0.1), "ausloeser");
  // Liegt das Maximum ganz vorn (Katastrophe zuerst), steht der Höhepunkt an
  // erster Stelle und der Einstieg gleich danach.
  if (folge[0] !== "einstieg" && !folge.includes("einstieg")) folge[1] = "einstieg";
  const endeHoch = werte[werte.length - 1]! >= 0.7;
  folge[n - 1] = endeHoch ? "einsatz" : "schluss";
  if (!endeHoch && !folge.includes("einsatz")) setze(Math.min(0.92, max + 0.12), "einsatz");
  // Leere Schritte: früh Haken, sonst Mitte.
  for (let i = 0; i < n; i++) if (!folge[i]) folge[i] = i === 1 ? "hook" : "mitte";
  // Gleiches in Folge zusammenziehen, aber mindestens acht Schläge behalten.
  const out: string[] = [];
  for (const s of folge) if (out[out.length - 1] !== s || s === "mitte") out.push(s);
  return out;
}

/** Der Regler „Spannung" aus der Kurve: Lage des Maximums. */
export function reglerAusKurve(werte: number[]): "top" | "mid" | "low" | "off" {
  const { max, hoehe } = kurveSpitzen(werte);
  if (hoehe < 0.45) return "off";
  return max < 0.34 ? "top" : max < 0.67 ? "mid" : "low";
}
