// Seitenumbruch für die Zeitungsseite: Beiträge so auf Spalten und Seiten
// verteilen, dass die Fläche gefüllt ist.
//
// Warum eigenständig und nicht in zeitungView: Die Verteilung ist reine
// Rechnerei und lässt sich prüfen — die Höhenmessung dagegen geht nur im
// Browser. Deshalb bekommt sie die Messung als Funktion herein: im Programm die
// echte über getBoundingClientRect, im Test eine berechnete aus der Wortzahl.
// So ist der Teil, der schiefgehen kann, auch der Teil, der geprüft wird.

export interface Messbar {
  /** Höhe in Pixeln, die dieser Beitrag in einer Spalte einnimmt — bei der
   *  Schriftskala `skala`. */
  hoehe(id: number, skala: number): number;
}

export type Rolle = "aufmacher" | "spalte" | "kasten";
export interface UmbruchTeil { id: number; rolle: Rolle; }

export interface PlatzierterTeil extends UmbruchTeil {
  spalte: number;        // 0-basiert; beim Aufmacher -1 (volle Breite)
  skala: number;         // Schriftskala, mit der er gesetzt wird
  zwischenraum: number;  // zusätzlicher Abstand darunter, in Pixeln
}

export interface Seite { teile: PlatzierterTeil[] }

export interface UmbruchOpts {
  spaltenhoehe: number;      // nutzbare Höhe einer Spalte in Pixeln
  aufmacherhoehe?: number;   // was der Aufmacher oben wegnimmt
  spalten: number;
  seiten: number;
  minSkala?: number;         // wie weit die Schrift schrumpfen darf
  maxZwischenraum?: number;  // wie viel Luft je Fuge höchstens verteilt wird
}

/**
 * Verteilt Beiträge auf Spalten und Seiten.
 *
 * Je Spalte auffüllen, solange etwas passt. Passt der nächste Beitrag knapp
 * nicht, wird seine Schrift schrittweise verkleinert — bis `minSkala`. Bleibt am
 * Fuß Luft, wird sie auf die Zwischenräume verteilt, wie es der Zeitungssatz
 * seit jeher macht: lieber etwas mehr Weiß zwischen den Beiträgen als ein Loch
 * am Ende der Spalte.
 */
export function umbrechen(teile: UmbruchTeil[], mess: Messbar, o: UmbruchOpts): Seite[] {
  const minSkala = o.minSkala ?? 0.82;
  const maxZw = o.maxZwischenraum ?? 28;
  const SKALEN = [1, 0.96, 0.92, 0.88, 0.85, minSkala];

  const offen = teile.slice();
  const seiten: Seite[] = [];

  for (let s = 0; s < o.seiten && offen.length; s++) {
    const seite: Seite = { teile: [] };
    let hoeheOben = 0;

    const aufIdx = offen.findIndex((x) => x.rolle === "aufmacher");
    if (aufIdx >= 0) {
      const a = offen.splice(aufIdx, 1)[0]!;
      seite.teile.push({ ...a, spalte: -1, skala: 1, zwischenraum: 0 });
      hoeheOben = o.aufmacherhoehe ?? mess.hoehe(a.id, 1);
    }

    const rest = Math.max(0, o.spaltenhoehe - hoeheOben);
    for (let sp = 0; sp < o.spalten; sp++) {
      const inSpalte: PlatzierterTeil[] = [];
      let gefuellt = 0;
      while (offen.length) {
        const kand = offen[0]!;
        let gesetzt = false;
        for (const skala of SKALEN) {
          if (gefuellt + mess.hoehe(kand.id, skala) <= rest) {
            inSpalte.push({ ...kand, spalte: sp, skala, zwischenraum: 0 });
            gefuellt += mess.hoehe(kand.id, skala);
            offen.shift();
            gesetzt = true;
            break;
          }
        }
        if (!gesetzt) break;
      }
      const luft = rest - gefuellt;
      if (inSpalte.length > 1 && luft > 0) {
        const jeFuge = Math.min(maxZw, Math.floor(luft / (inSpalte.length - 1)));
        for (let i = 0; i < inSpalte.length - 1; i++) inSpalte[i]!.zwischenraum = jeFuge;
      }
      seite.teile.push(...inSpalte);
      if (!offen.length) break;
    }
    seiten.push(seite);
  }
  return seiten;
}

/** Wie voll ist eine Seite? 1 = randvoll. */
export function fuellgrad(seite: Seite, mess: Messbar, o: UmbruchOpts): number {
  const proSpalte: number[] = new Array(o.spalten).fill(0);
  let oben = 0;
  for (const t of seite.teile) {
    const h = mess.hoehe(t.id, t.skala) + t.zwischenraum;
    if (t.spalte < 0) oben += h; else proSpalte[t.spalte] = (proSpalte[t.spalte] || 0) + h;
  }
  const rest = Math.max(1, o.spaltenhoehe - oben);
  const genutzt = oben + proSpalte.reduce((a, b) => a + Math.min(b, rest), 0);
  const gesamt = oben + rest * o.spalten;
  return Math.min(1, genutzt / gesamt);
}
