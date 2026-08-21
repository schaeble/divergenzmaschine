// Kontextübernahme: welcher der vier W-Werte darf überschrieben werden?
//
// Die Regel klang zu einfach, um sie auszulagern — bis die Frage kam, ob die
// Schlösser beim „Alles würfeln" überhaupt gelten. Die Antwort stand nur im
// Klickzusammenhang eines 1600-Zeilen-Moduls und ließ sich nur durch Lesen
// beantworten. Jetzt steht sie hier und wird geprüft.
//
// Zwei Regeln, beide bewusst:
//   · Ein GESPERRTES Feld bleibt, wie es ist. Sonst wäre das Schloss Zierrat.
//   · Ein LEERER Vorschlag überschreibt nichts. Die Welt liefert nicht immer
//     alle vier Werte; ein leeres Feld wäre schlechter als das alte.

export type W4 = "where" | "when" | "who" | "what";
export const W4_FELDER: W4[] = ["where", "when", "who", "what"];

export interface Feld { id: string; wert: string }

/** Rechnet aus: Was soll in den vier Feldern stehen?
 *
 *  Rein — kein DOM, kein Schreiben. Der Aufrufer setzt die Werte. */
export function uebernehmeKontext(
  felder: Record<W4, Feld>,
  vorschlag: Partial<Record<W4, string>>,
  gesperrt: (id: string) => boolean,
): Record<W4, string> {
  const raus = {} as Record<W4, string>;
  for (const f of W4_FELDER) {
    const alt = felder[f].wert;
    const neu = (vorschlag[f] || "").trim();
    raus[f] = !neu || gesperrt(felder[f].id) ? alt : neu;
  }
  return raus;
}

/** Welche Felder hat die Übernahme wirklich verändert? Für die Anzeige — und
 *  damit „nichts passiert" von „nichts zu tun" unterscheidbar bleibt. */
export function geaendert(
  felder: Record<W4, Feld>,
  neu: Record<W4, string>,
): W4[] {
  return W4_FELDER.filter((f) => felder[f].wert !== neu[f]);
}
