// Musterseiten: die Anordnung steht VOR dem Text.
//
// Bisher lief es andersherum: Texte entstanden, und die Verteilung suchte für
// jeden einen Platz. Das kann nicht gutgehen, wenn jeder Text eine ganze Spalte
// füllt — und genau das ist der Fall. Eine Spalte von 54 mm Breite fasst bei
// 9 pt rund 200 bis 280 Wörter, und die Beiträge der Maschine haben 200 bis
// 250. Es gibt also nichts zu verteilen: Aufmacher plus drei Blöcke, jede Seite
// gleich.
//
// Eine Redaktion macht es umgekehrt. Erst steht der Spiegel — Aufmacher über
// drei Spalten, links ein Zweispalter, rechts ein Kasten —, dann wird auf Maß
// geschrieben: „vierzig Zeilen". Diese Datei ist der Spiegel. Sie rechnet aus
// einem Schema und der Spaltenzahl die Plätze aus, und aus jedem Platz die
// Wortzahl, die er verlangt.
//
// Die Spaltenzahl ändert das Bild mit: Dieselbe Musterseite ergibt bei drei,
// vier und fünf Spalten verschiedene Seiten, weil die Gewichte einer Reihe erst
// mit der Spaltenzahl zu ganzen Spalten werden.
//
// Rein, ohne DOM: Die Anordnung ist Geometrie und muss prüfbar sein.

/** Eine Reihe des Schemas: relative Höhe, und die relativen Breiten der Blöcke
 *  darin. Die Zahlen sind Gewichte, keine Spalten. */
export interface SchemaReihe { hoehe: number; teile: number[] }
export interface Schema { id: string; name: string; reihen: SchemaReihe[] }

/** Ein fertiger Platz auf der Seite, in Spalten und Pixeln. */
export interface Platz {
  /** 0-basiert. */
  spalteVon: number;
  /** Wie viele Spalten der Block überspannt. */
  spalten: number;
  /** Reihe im Schema, 0-basiert — für die Rasterzuweisung. */
  reihe: number;
  oben: number;
  hoehe: number;
  rolle: "aufmacher" | "spalte" | "kasten";
}

/** Die Schemata. Bewusst wenige und deutlich verschieden: Drei Anordnungen, die
 *  man auseinanderhält, sind mehr wert als zwölf Abstufungen derselben. */
export const SCHEMATA: Schema[] = [
  {
    id: "klassisch", name: "Klassisch — Aufmacher, dann zwei Bänder",
    reihen: [
      { hoehe: 0.34, teile: [1] },
      { hoehe: 0.38, teile: [2, 1] },
      { hoehe: 0.28, teile: [1, 1, 1] },
    ],
  },
  {
    id: "blockig", name: "Blockig — zwei große Blöcke, ein Fuß",
    reihen: [
      { hoehe: 0.46, teile: [2, 1] },
      { hoehe: 0.32, teile: [1, 2] },
      { hoehe: 0.22, teile: [1, 1] },
    ],
  },
  {
    id: "bunt", name: "Bunt — viele kurze Stücke",
    reihen: [
      { hoehe: 0.26, teile: [1] },
      { hoehe: 0.26, teile: [1, 1, 1] },
      { hoehe: 0.24, teile: [2, 1] },
      { hoehe: 0.24, teile: [1, 1, 1] },
    ],
  },
];

export function schemaVon(id: string): Schema | null {
  return SCHEMATA.find((s) => s.id === id) || null;
}

/** Verteilt `spalten` ganze Spalten auf die Gewichte einer Reihe.
 *
 *  Jeder Block bekommt mindestens eine Spalte; sind mehr Blöcke vorgesehen als
 *  Spalten da sind, fallen die hinteren weg — lieber ein Block weniger als eine
 *  Spalte von null Breite. Der Rest geht nach größtem Bruchteil, sonst
 *  summierten sich die Abrundungen und die letzte Spalte bliebe leer. */
export function verteileSpalten(gewichte: number[], spalten: number): number[] {
  const n = Math.max(1, Math.round(spalten));
  const g = gewichte.filter((x) => x > 0).slice(0, n);
  if (!g.length) return [n];
  const summe = g.reduce((a, b) => a + b, 0);
  const roh = g.map((x) => (x / summe) * n);
  const raus = roh.map(() => 1);
  let vergeben = raus.length;
  const rest = roh.map((x, i) => ({ i, teil: x - 1 })).sort((a, b) => b.teil - a.teil);
  let k = 0;
  while (vergeben < n && rest.length) {
    raus[rest[k % rest.length]!.i]! += 1;
    vergeben++;
    k++;
  }
  return raus;
}

/** Aus Schema und Seitenmaß die Plätze rechnen.
 *
 *  `hoehe` ist der Spaltenbereich der Seite — alles unter dem Zeitungskopf bis
 *  zur Fußlinie. Der Aufmacher ist KEIN Sonderfall mehr, sondern der erste
 *  Platz des Schemas; das ist der Punkt einer Musterseite. */
export function schemaPlaetze(schema: Schema, spalten: number, hoehe: number): Platz[] {
  const n = Math.max(1, Math.round(spalten));
  const reihen = schema.reihen.filter((r) => r.hoehe > 0);
  const summe = reihen.reduce((a, r) => a + r.hoehe, 0) || 1;
  const raus: Platz[] = [];
  let oben = 0;
  reihen.forEach((r, ri) => {
    // Die letzte Reihe bekommt, was übrig ist: Sonst bleibt durch das Runden
    // ein Streifen am Fuß stehen.
    const h = ri === reihen.length - 1 ? Math.max(0, hoehe - oben) : Math.round((r.hoehe / summe) * hoehe);
    const breiten = verteileSpalten(r.teile, n);
    let x = 0;
    breiten.forEach((b) => {
      raus.push({
        spalteVon: x, spalten: b, reihe: ri, oben, hoehe: h,
        rolle: ri === 0 && breiten.length === 1 ? "aufmacher" : (b === 1 && h < hoehe * 0.3 ? "kasten" : "spalte"),
      });
      x += b;
    });
    oben += h;
  });
  return raus;
}

/** Wie viele Wörter verlangt ein Platz?
 *
 *  Aus der Fläche, gemessen an dem, was eine ganze Seite trägt. `woerterSeite`
 *  kommt aus dem Autopiloten — dort ist es aus dem tatsächlichen Füllgrad
 *  nachgeführt und damit besser als jede Formel hier. */
export function wortZiel(platz: Platz, spalten: number, hoehe: number, woerterSeite: number): number {
  const flaeche = (platz.spalten / Math.max(1, spalten)) * (platz.hoehe / Math.max(1, hoehe));
  return Math.max(20, Math.round(woerterSeite * flaeche));
}

/** Welche Form passt in diesen Platz?
 *
 *  Nach Fläche, nicht nach Geschmack: In einen 40-Wörter-Platz gehört eine
 *  Meldung, in den Aufmacher ein Bericht. Ein Prosastück, das auf 40 Wörter
 *  gekürzt wird, ist ein Fetzen; ein Vers im Aufmacher ist ein Versehen. */
export function formFuer(woerter: number, rolle: Platz["rolle"]): "bericht" | "meldung" | "prose" | "poem" {
  if (woerter <= 70) return "meldung";
  if (rolle === "kasten" && woerter <= 120) return "poem";
  if (rolle === "aufmacher") return "bericht";
  return "prose";
}

/** Der komplette Auftrag je Platz: Form und Wortzahl. */
export interface PlatzAuftrag { platz: number; woerter: number; form: ReturnType<typeof formFuer>; rolle: Platz["rolle"] }
export function schemaAuftraege(plaetze: Platz[], spalten: number, hoehe: number, woerterSeite: number): PlatzAuftrag[] {
  return plaetze.map((p, i) => {
    const w = wortZiel(p, spalten, hoehe, woerterSeite);
    return { platz: i, woerter: w, form: formFuer(w, p.rolle), rolle: p.rolle };
  });
}
