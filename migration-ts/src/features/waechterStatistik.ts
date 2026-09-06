// Wächter-Statistik — die Maschine zählt selbst.
//
// Punkt 5 des Zielbilds: Jede Regel des Satz-Wächters, des Präsens-
// Umschreibers und der Atomisierung entstand aus einem Blatt. Bisher sah man
// erst am nächsten Blatt, ob eine Regel greift, zu oft greift, oder ob ein
// neues Muster durchgeht. Hier zählt die Maschine mit: je Regel, wie oft sie
// verworfen hat, dazu die letzten Beispiele — und was der Wächter DURCHLÄSST,
// stichprobenweise, damit das nächste Muster sichtbar wird, bevor ein Blatt
// es zeigt. Die Zähler leben im localStorage (dm_waechter_statistik_v1) und
// wandern mit der Projektdatei; ein Knopf in der Diagnose setzt sie zurück.

export type Zaehler =
  | "regel1" | "regel2" | "regel3" | "regel4" | "regel5" | "regel6" | "regel7" | "regel8"
  | "angenommen" | "umgeschrieben" | "unklar" | "praeteritumVerworfen"
  | "atomZerlegt" | "atomGekuerzt" | "atomGanzZuLang";

export const ZAEHLER_NAMEN: Record<Zaehler, string> = {
  regel1: "Wächter 1 · hängendes Ende",
  regel2: "Wächter 2 · ohne Verb, ohne Kopf",
  regel3: "Wächter 3 · gebrochene Klausel",
  regel4: "Wächter 4 · Inversion ohne Subjekt",
  regel5: "Wächter 5 · „lässt sich“ ohne Infinitiv",
  regel6: "Wächter 6 · zwei finite Verben",
  regel7: "Wächter 7 · halbes Zitat",
  regel8: "Wächter 8 · „es gibt“ ohne Gegenstand",
  angenommen: "Wächter · durchgelassen",
  umgeschrieben: "Umschreiber · Präteritum → Präsens",
  unklar: "Umschreiber · unklar, verworfen",
  praeteritumVerworfen: "Umschreiber · Präteritum blieb, verworfen",
  atomZerlegt: "Atomisierung · zerlegt",
  atomGekuerzt: "Atomisierung · Nebensatz abgeschnitten",
  atomGanzZuLang: "Atomisierung · zu lang, ganz gelassen",
};

export interface Statistik { zaehler: Partial<Record<Zaehler, number>>; beispiele: Partial<Record<Zaehler, string[]>>; seit: string }

const KEY = "dm_waechter_statistik_v1";
const BEISPIELE_JE = 5;
let cache: Statistik | null = null;
let schreibTimer: number | null = null;

function leer(): Statistik { return { zaehler: {}, beispiele: {}, seit: new Date().toISOString() }; }

export function ladeStatistik(): Statistik {
  if (cache) return cache;
  try {
    const raw = typeof localStorage === "undefined" ? null : localStorage.getItem(KEY);
    const v = raw ? (JSON.parse(raw) as Statistik) : null;
    cache = v && v.zaehler && v.beispiele ? v : leer();
  } catch { cache = leer(); }
  return cache;
}

function speichern(): void {
  if (schreibTimer !== null) return;
  // Gebündelt: Der Wächter läuft hundertfach je Erzeugung; ein Schreibvorgang
  // pro Sekunde genügt.
  // Der globale setTimeout laeuft im Browser wie in Node; window.setTimeout
  // unbound aufzurufen scheiterte in einem Pruefstand ohne echtes window.
  schreibTimer = setTimeout(() => {
    schreibTimer = null;
    try { if (typeof localStorage !== "undefined" && cache) localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* voll */ }
  }, 1000) as unknown as number;
}

/** Ein Ereignis zählen — mit Beispiel (die letzten fünf je Zähler bleiben). */
export function zaehle(was: Zaehler, beispiel?: string): void {
  const st = ladeStatistik();
  st.zaehler[was] = (st.zaehler[was] || 0) + 1;
  if (beispiel) {
    const b = st.beispiele[was] || [];
    const kurz = beispiel.trim().slice(0, 140);
    if (!b.includes(kurz)) { b.unshift(kurz); st.beispiele[was] = b.slice(0, BEISPIELE_JE); }
  }
  speichern();
}

export function statistikZuruecksetzen(): void {
  cache = leer();
  try { if (typeof localStorage !== "undefined") localStorage.setItem(KEY, JSON.stringify(cache)); } catch { /* voll */ }
}

/** Zusammenfassung für den Schaltplan: verworfen gesamt, Anteil, häufigste Regel. */
export function statistikKurz(): { verworfen: number; angenommen: number; quote: number; haeufigste: Zaehler | null; umgeschrieben: number; zerlegt: number } {
  const st = ladeStatistik();
  const regeln: Zaehler[] = ["regel1", "regel2", "regel3", "regel4", "regel5", "regel6", "regel7", "regel8"];
  let verworfen = 0; let haeufigste: Zaehler | null = null; let max = 0;
  for (const r of regeln) { const n = st.zaehler[r] || 0; verworfen += n; if (n > max) { max = n; haeufigste = r; } }
  const angenommen = st.zaehler.angenommen || 0;
  return { verworfen, angenommen, quote: verworfen + angenommen ? verworfen / (verworfen + angenommen) : 0, haeufigste,
    umgeschrieben: st.zaehler.umgeschrieben || 0, zerlegt: (st.zaehler.atomZerlegt || 0) + (st.zaehler.atomGekuerzt || 0) };
}
