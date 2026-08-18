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
  /** true = passt nicht mehr ganz und wird am Spaltenfuß gekürzt. */
  gekuerzt?: boolean;
}

export interface Seite { teile: PlatzierterTeil[] }

export interface UmbruchOpts {
  spaltenhoehe: number;      // nutzbare Höhe einer Spalte in Pixeln
  aufmacherhoehe?: number;   // was der Aufmacher oben wegnimmt
  spalten: number;
  seiten: number;
  minSkala?: number;         // wie weit die Schrift schrumpfen darf
  maxZwischenraum?: number;  // wie viel Luft je Fuge höchstens verteilt wird
  /** Ab wie viel freier Höhe am Spaltenfuß noch ein Beitrag angesetzt wird, der
   *  dann gekürzt wird. 0 = nie — dann bleibt lieber ein Loch stehen. */
  mindestRest?: number;
  /** Gesperrte Bänder je Spalte, in Spaltenkoordinaten (0 = Oberkante der
   *  Spalte). Dort steht ein Bild; Text kann darüber und darunter laufen, aber
   *  kein Beitrag darf hindurchreichen.
   *
   *  Ohne diese Angabe wusste die Verteilung nichts von den Bildern: Sie legte
   *  einen Beitrag in die Spalte, der Gleitkasten schob ihn unter das Bild
   *  hinaus, und die Nachmessung warf ihn ganz heraus. Ein eingefügtes Bild
   *  löschte damit den Text der ganzen Spalte. */
  luecken?: { oben: number; hoehe: number }[][];
}

/** Die freien Abschnitte einer Spalte: das Gegenstück zu den gesperrten
 *  Bändern. Reine Rechnung, deshalb hier und geprüft. */
export function freieAbschnitte(hoehe: number, baender: { oben: number; hoehe: number }[] = []): { von: number; bis: number }[] {
  const sortiert = [...baender].filter((b) => b.hoehe > 0).sort((a, b) => a.oben - b.oben);
  const raus: { von: number; bis: number }[] = [];
  let cursor = 0;
  for (const b of sortiert) {
    const von = Math.max(0, b.oben), bis = Math.min(hoehe, b.oben + b.hoehe);
    if (bis <= 0 || von >= hoehe) continue;
    if (von > cursor) raus.push({ von: cursor, bis: von });
    cursor = Math.max(cursor, bis);
  }
  if (cursor < hoehe) raus.push({ von: cursor, bis: hoehe });
  return raus.filter((a) => a.bis - a.von > 0);
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
    const mindestRest = o.mindestRest ?? 0;
    for (let sp = 0; sp < o.spalten; sp++) {
      const inSpalte: PlatzierterTeil[] = [];
      // Die Spalte zerfällt an den Bildern in Abschnitte. Gefüllt wird
      // Abschnitt für Abschnitt; ein Beitrag muss ganz in EINEN passen —
      // teilen kann der Satz ihn nicht.
      const abschnitte = freieAbschnitte(rest, o.luecken?.[sp] ?? []);
      let gefuellt = 0;
      // WEITERSUCHEN, nicht abbrechen. Vorher wurde nur der vorderste Beitrag
      // probiert: Passte der nicht, endete die Spalte — und weil derselbe
      // Beitrag auch in der nächsten Spalte vorn stand, endete auch die. Bei
      // einer Schatzkammer voller langer Texte blieb die Seite deshalb leer bis
      // auf den Aufmacher: 1 von 101 Beiträgen gesetzt.
      let luftGesamt = 0;
      abschnitte.forEach((abschnitt, ai) => {
        const platz = abschnitt.bis - abschnitt.von;
        let inAbschnitt = 0;
        for (;;) {
          let gesetzt = false;
          for (let k = 0; k < offen.length && !gesetzt; k++) {
            const kand = offen[k]!;
            for (const skala of SKALEN) {
              if (inAbschnitt + mess.hoehe(kand.id, skala) <= platz) {
                inSpalte.push({ ...kand, spalte: sp, skala, zwischenraum: 0 });
                inAbschnitt += mess.hoehe(kand.id, skala);
                offen.splice(k, 1);
                gesetzt = true;
                break;
              }
            }
          }
          if (!gesetzt) break;
        }
        // Den Fuß auffüllen: Bleibt mehr Luft, als eine Überschrift mit ein paar
        // Zeilen braucht, kommt der nächste Beitrag trotzdem hinein und wird am
        // Spaltenfuß gekürzt. NUR im letzten Abschnitt: Das Kürzen greift am
        // Fuß der Spalte, nicht oberhalb eines Bildes.
        const letzter = ai === abschnitte.length - 1;
        if (letzter && offen.length && mindestRest > 0 && platz - inAbschnitt >= mindestRest) {
          const kand = offen.shift()!;
          inSpalte.push({ ...kand, spalte: sp, skala: 1, zwischenraum: 0, gekuerzt: true });
          inAbschnitt = platz;
        }
        gefuellt += inAbschnitt;
        luftGesamt += platz - inAbschnitt;
      });
      const luft = luftGesamt;
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
    // Der Aufmacher läuft über ALLE Spalten. Ihn in Spaltenbreite zu messen
    // ergibt die dreifache Höhe — die Füllung meldete 71 %, während die Seite
    // fast leer war. Deshalb dieselbe Zahl wie bei der Verteilung.
    const h = (t.spalte < 0 ? (o.aufmacherhoehe ?? mess.hoehe(t.id, t.skala)) : mess.hoehe(t.id, t.skala)) + t.zwischenraum;
    if (t.spalte < 0) oben += h; else proSpalte[t.spalte] = (proSpalte[t.spalte] || 0) + h;
  }
  const rest = Math.max(1, o.spaltenhoehe - oben);
  const genutzt = oben + proSpalte.reduce((a, b) => a + Math.min(b, rest), 0);
  const gesamt = oben + rest * o.spalten;
  return Math.min(1, genutzt / gesamt);
}
