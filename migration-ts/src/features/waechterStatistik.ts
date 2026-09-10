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

export type Zaehler = string;

/** Ebene 2 (4.357.0): die Wächter, die dieselbe Arbeit tun, aber bisher
 *  nicht zählten — Schliff-Regeln, Kohärenz, Markov-Sanity, Füller,
 *  Korpus-Hygiene. In der Diagnose hinter dem Schalter „erweitert". */
export const EBENE2 = new Set<string>([
  "schliff_kleinesPronomen", "schliff_kommaVorInversion", "schliff_fragezeichen", "schliff_nomenNachAdverb", "schliff_nominativFragment",
  "schliff_formelnGlaetten", "schliff_adjektivKongruenz", "schliff_relativKongruenz", "schliff_kleinerArtikel", "schliff_pluralKongruenz", "schliff_polishGerman", "schliff_figurenkomma",
  "kohaerenzPass", "kohaerenzGefallen", "kohaerenzRepariert",
  "markovKurz", "markovWenigWoerter", "markovWiederholung", "markovFunktionswoerter", "markovSatzlaenge", "markovSatzzeichen", "markovBruchstueck",
  "fuellerStopp", "korpusHygiene",
]);

export const ZAEHLER_NAMEN: Record<string, string> = {
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
  schliff_kleinesPronomen: "Schliff · Pronomen/Adverb nach Strich klein",
  schliff_kommaVorInversion: "Schliff · Komma vor der Inversion",
  schliff_fragezeichen: "Schliff · Fragezeichen",
  schliff_nomenNachAdverb: "Schliff · Nomen nach Satzadverb groß",
  schliff_nominativFragment: "Schliff · Nominativ im Fragment",
  schliff_formelnGlaetten: "Schliff · Formeln geglättet",
  schliff_adjektivKongruenz: "Schliff · Adjektiv-Kongruenz am Satzanfang",
  schliff_relativKongruenz: "Schliff · Relativpronomen nach Präposition",
  schliff_kleinerArtikel: "Schliff · Artikel klein in der Satzmitte",
  schliff_pluralKongruenz: "Schliff · Plural-Kongruenz",
  schliff_polishGerman: "Schliff · Sprachschliff (Artikel, Genus, Namen)",
  schliff_figurenkomma: "Schliff · Figurenkomma geschlossen",
  kohaerenzPass: "Kohärenz · Lauf 1 (Brüche, Wiederholungen)",
  kohaerenzGefallen: "Kohärenz · Satz gefallen (themenfremd)",
  kohaerenzRepariert: "Kohärenz · Lauf 2 hat geändert",
  markovKurz: "Markov-Sanity · zu kurz",
  markovWenigWoerter: "Markov-Sanity · unter fünf Wörter",
  markovWiederholung: "Markov-Sanity · ein Wort dominiert",
  markovFunktionswoerter: "Markov-Sanity · nur Funktionswörter",
  markovSatzlaenge: "Markov-Sanity · Satzlänge unpassend",
  markovSatzzeichen: "Markov-Sanity · Satzzeichen gehäuft",
  markovBruchstueck: "Markov-Sanity · Bruchstück am Ende",
  fuellerStopp: "Füller · aufgehört, nichts Frisches mehr",
  korpusHygiene: "Korpus-Hygiene · Selbstreinigung",
};

/** Wächter-Helfer: eine Regel zählt, wenn sie den Text verändert hat — mit
 *  Vorher → Nachher als Beispiel (auf das erste verschiedene Satzpaar
 *  gekürzt). */
export function zaehleWennAnders(was: Zaehler, vorher: string, nachher: string): void {
  if (vorher === nachher) return;
  const a = vorher.split(/(?<=[.!?…])\s+/), b = nachher.split(/(?<=[.!?…])\s+/);
  let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++;
  zaehle(was, `${(a[i] || "").slice(0, 70)} → ${(b[i] || "").slice(0, 70)}`);
}

export interface Statistik { zaehler: Partial<Record<string, number>>; beispiele: Partial<Record<string, string[]>>; seit: string }

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
export function statistikKurz(): { verworfen: number; angenommen: number; quote: number; haeufigste: string | null; umgeschrieben: number; zerlegt: number } {
  const st = ladeStatistik();
  const regeln: string[] = ["regel1", "regel2", "regel3", "regel4", "regel5", "regel6", "regel7", "regel8"];
  let verworfen = 0; let haeufigste: string | null = null; let max = 0;
  for (const r of regeln) { const n = st.zaehler[r] || 0; verworfen += n; if (n > max) { max = n; haeufigste = r; } }
  const angenommen = st.zaehler.angenommen || 0;
  return { verworfen, angenommen, quote: verworfen + angenommen ? verworfen / (verworfen + angenommen) : 0, haeufigste,
    umgeschrieben: st.zaehler.umgeschrieben || 0, zerlegt: (st.zaehler.atomZerlegt || 0) + (st.zaehler.atomGekuerzt || 0) };
}
