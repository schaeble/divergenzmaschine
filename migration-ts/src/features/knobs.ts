// Stellschrauben der Rekombination, die bisher als feste Zahlen im Code standen.
// Sie wirken wie Regler — also sollen sie welche sein. Bewusst enge Spannen: Ein
// Fügeteil-Deckel von 60 % ergibt Leerlauf, kein besseres Ergebnis.
export interface Knobs {
  /** Höchstanteil der Fügeteile an allen Elementen, in Prozent. */
  fuegeteil: number;
  /** Wie oft dürfen Ort bzw. Zeit im selben Text vorkommen? */
  w4max: number;
  /** Wie viele Elemente muss ein Baustein zurückliegen, bevor er wieder ziehbar ist? */
  abstand: number;
  /** Gewicht der Erzählbogen-Atome beim Ziehen, in Prozent von normal. */
  bogen: number;
  /** Zahl der Ton-Einschübe, in Prozent von normal. */
  ton: number;
  /** Wie viele Bausteine höchstens aus dem eigenen Korpus kommen. 0 = aus. */
  korpus: number;
  /** Fensterbreite der Phrasensperre in Woertern; 0 schaltet sie ab. */
  phrase: number;
  /** Ziel fuer die mittlere Satzlaenge in Woertern; 0 schaltet ab. */
  satzlaenge: number;
}
export const KNOB_VORGABE: Knobs = { fuegeteil: 25, w4max: 2, abstand: 12, bogen: 100, ton: 100, korpus: 0, phrase: 5, satzlaenge: 9 };
export const KNOB_SPANNE = {
  fuegeteil: { min: 10, max: 35, step: 5 },
  w4max: { min: 1, max: 4, step: 1 },
  abstand: { min: 6, max: 24, step: 2 },
  bogen: { min: 0, max: 250, step: 25 },
  ton: { min: 0, max: 250, step: 25 },
  korpus: { min: 0, max: 60, step: 10 },
  phrase: { min: 0, max: 8, step: 1 },
  satzlaenge: { min: 0, max: 21, step: 3 },
} as const;

const KEY = "dm_knobs_v1";
const klemm = (v: number, s: { min: number; max: number }): number => Math.max(s.min, Math.min(s.max, v));

export function loadKnobs(): Knobs {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return { ...KNOB_VORGABE };
    const p = JSON.parse(r) as Partial<Knobs>;
    return {
      fuegeteil: klemm(Number(p.fuegeteil) || KNOB_VORGABE.fuegeteil, KNOB_SPANNE.fuegeteil),
      w4max: klemm(Number(p.w4max) || KNOB_VORGABE.w4max, KNOB_SPANNE.w4max),
      abstand: klemm(Number(p.abstand) || KNOB_VORGABE.abstand, KNOB_SPANNE.abstand),
      bogen: klemm(p.bogen === undefined ? KNOB_VORGABE.bogen : Number(p.bogen), KNOB_SPANNE.bogen),
      ton: klemm(p.ton === undefined ? KNOB_VORGABE.ton : Number(p.ton), KNOB_SPANNE.ton),
      korpus: klemm(p.korpus === undefined ? KNOB_VORGABE.korpus : Number(p.korpus), KNOB_SPANNE.korpus),
      phrase: klemm(p.phrase === undefined ? KNOB_VORGABE.phrase : Number(p.phrase), KNOB_SPANNE.phrase),
      satzlaenge: klemm(p.satzlaenge === undefined ? KNOB_VORGABE.satzlaenge : Number(p.satzlaenge), KNOB_SPANNE.satzlaenge),
    };
  } catch { return { ...KNOB_VORGABE }; }
}
export function saveKnobs(k: Knobs): void {
  try { localStorage.setItem(KEY, JSON.stringify(k)); } catch { /* voll */ }
}

// ── Zielvorgaben (A.3) ────────────────────────────────────────────────────
// Ein Ziel ist kein Wert: Der Nutzer zieht einen Balken auf 30 %, die Maschine
// steuert darauf zu und landet vielleicht bei 24. Deshalb wird nach jeder
// Erzeugung nur EIN Schritt in die richtige Richtung gegangen, mit Totband —
// sonst schwingt die Regelung.
export type ZielQuelle = "vorlage" | "dramaturgie" | "ton" | "kontext";
export type Ziele = Partial<Record<ZielQuelle, number>>;
const ZKEY = "dm_ziele_v1";
export function loadZiele(): Ziele {
  try { const r = localStorage.getItem(ZKEY); return r ? (JSON.parse(r) as Ziele) : {}; } catch { return {}; }
}
export function saveZiele(z: Ziele): void {
  try { localStorage.setItem(ZKEY, JSON.stringify(z)); } catch { /* voll */ }
}
/** Welche Stellschraube gehört zu welchem Balken? */
export const ZIEL_KNOB: Record<ZielQuelle, keyof Knobs> = {
  vorlage: "fuegeteil", dramaturgie: "bogen", ton: "ton", kontext: "w4max",
};
// Totband in Prozentpunkten. Drei statt zwei, weil die Anteile von Lauf zu Lauf
// um ein bis zwei Punkte schwanken - bei engerem Band regelt die Schleife der
// Streuung hinterher statt dem Ziel.
const TOTBAND = 3;

/**
 * Ein Regelschritt: vergleicht Ist mit Ziel und rückt die zugehörige Stellschraube
 * um genau einen Schritt. Gibt zurück, ob etwas verändert wurde.
 */
const HKEY = "dm_ziel_verlauf_v1";
type Verlauf = Partial<Record<ZielQuelle, { vor: number; istVor: number; fest?: boolean }>>;
const ladeVerlauf = (): Verlauf => { try { return JSON.parse(localStorage.getItem(HKEY) || "{}") as Verlauf; } catch { return {}; } };
const saveVerlauf = (v: Verlauf): void => { try { localStorage.setItem(HKEY, JSON.stringify(v)); } catch { /* voll */ } };
/** Verlauf zurücksetzen — nötig, wenn ein Ziel neu gesetzt wird. */
export function vergissVerlauf(q?: ZielQuelle): void {
  if (!q) { saveVerlauf({}); return; }
  const v = ladeVerlauf(); delete v[q]; saveVerlauf(v);
}

export interface RegelErgebnis { bewegt: boolean; fest: ZielQuelle[] }

export function regle(ist: Partial<Record<ZielQuelle, number>>): RegelErgebnis {
  const z = loadZiele(); const k = loadKnobs(); const v = ladeVerlauf();
  let geaendert = false; const fest: ZielQuelle[] = [];
  for (const q of Object.keys(z) as ZielQuelle[]) {
    const ziel = z[q]; if (ziel === undefined) continue;
    const i = (ist[q] ?? 0) * 100;
    const feld = ZIEL_KNOB[q], sp = KNOB_SPANNE[feld];
    // Im Totband nichts tun, aber den Verlauf BEHALTEN: Loeschte man ihn hier,
    // begaenne die Pendelei bei der naechsten Messschwankung von vorn.
    if (Math.abs(i - ziel) <= TOTBAND) { v[q] = { vor: k[feld], istVor: i, fest: v[q]?.fest }; continue; }
    if (v[q]?.fest) { fest.push(q); continue; }
    const neu = klemm(k[feld] + (i < ziel ? sp.step : -sp.step), sp);
    // Pendelt die Regelung? Dann liegt das Ziel in einer Luecke, die diese
    // Stellschraube nicht treffen kann. Einmal feststellen und es sagen, statt
    // den Text bei jedem Lauf zwischen zwei Stellungen hin und her zu werfen.
    if (v[q] !== undefined && v[q]!.vor === neu) {
      // Das Ziel liegt zwischen zwei Stellungen. Auf der besseren der beiden stehen
      // bleiben — nicht auf der, bei der man zufaellig gerade steht.
      const jetztBesser = Math.abs(i - ziel) <= Math.abs(v[q]!.istVor - ziel);
      if (!jetztBesser) { k[feld] = neu; geaendert = true; }
      v[q] = { vor: jetztBesser ? k[feld] : neu, istVor: i, fest: true };
      fest.push(q); continue;
    }
    if (neu !== k[feld]) { v[q] = { vor: k[feld], istVor: i }; k[feld] = neu; geaendert = true; }
    else { v[q] = { vor: k[feld], istVor: i, fest: true }; fest.push(q); }
  }
  saveVerlauf(v);
  if (geaendert) saveKnobs(k);
  return { bewegt: geaendert, fest };
}
