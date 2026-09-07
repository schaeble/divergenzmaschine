// Der Zugriff auf den festen Fragenpool.
//
// Warum überhaupt ein eigenes Modul und nicht nur die Datendatei: Der Griff in
// den Pool hat eine Regel, die die Daten nicht kennen — er soll nicht zweimal
// hintereinander dasselbe ziehen. Bei fünfzig Einträgen passiert das sonst im
// Mittel jedes fünfzigste Mal, und wer zweimal drückt und zweimal Sokrates
// bekommt, hält den Knopf für kaputt.
import { FRAGEN, type Frage } from "./fragen.data";

export type { Frage };
export { FRAGEN };

/** Wie viele Fragen im Pool liegen. Fest eingebaut, also immer dieselbe Zahl —
 *  aber gezählt und nicht behauptet, damit der Schaltplan nicht lügt, wenn
 *  jemand den Pool erweitert. */
export function fragenStand(): { funde: number } {
  return { funde: FRAGEN.length };
}

let zuletzt = -1;

/** Zieht eine Frage. Der Zufall ist ein Parameter, damit die Prüfung ihn
 *  festhalten kann. `merken = false` lässt den Merker in Ruhe — das braucht
 *  der Prüfstand, der die reine Verteilung messen will. */
export function ziehFrage(zufall: () => number = Math.random, merken = true): Frage {
  if (FRAGEN.length === 0) return { who: "", where: "", when: "", what: "" };
  if (FRAGEN.length === 1) return { ...FRAGEN[0]! };
  let i = Math.min(FRAGEN.length - 1, Math.floor(zufall() * FRAGEN.length));
  // Nicht zweimal dieselbe: einen Platz weiterrücken ist ehrlicher als noch
  // einmal würfeln — ein zweiter Wurf könnte wieder danebenliegen, und eine
  // Schleife ohne obere Schranke gehört nicht in eine Oberfläche.
  if (merken && i === zuletzt) i = (i + 1) % FRAGEN.length;
  if (merken) zuletzt = i;
  return { ...FRAGEN[i]! };
}

/** Nur für den Prüfstand: den Merker zurücksetzen. */
export function fragenMerkerZuruecksetzen(): void { zuletzt = -1; }
