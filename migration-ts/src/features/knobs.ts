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
}
export const KNOB_VORGABE: Knobs = { fuegeteil: 25, w4max: 2, abstand: 12 };
export const KNOB_SPANNE = {
  fuegeteil: { min: 10, max: 35, step: 5 },
  w4max: { min: 1, max: 4, step: 1 },
  abstand: { min: 6, max: 24, step: 2 },
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
    };
  } catch { return { ...KNOB_VORGABE }; }
}
export function saveKnobs(k: Knobs): void {
  try { localStorage.setItem(KEY, JSON.stringify(k)); } catch { /* voll */ }
}
