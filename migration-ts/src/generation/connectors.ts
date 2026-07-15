// Verbindungs-Einschübe für das Auffüllen auf Ziellänge.
// Funktionale Kategorien mit je mehreren Wendungen; die Auswahl ist rein
// zufällig, einzige Regel: nicht zweimal dieselbe Kategorie oder Wendung
// direkt hintereinander. Kein dramaturgischer Bogen - der Eindruck von
// Zusammenhang entsteht aus dem Zufall selbst.
const CONNECTOR_CATEGORIES: string[][] = [
  ["Dabei", "Vor ihm", "Im Raum", "Dort"],                                                   // Beobachtung
  ["Wieder", "Erneut", "Wie zuvor", "Noch einmal", "Und immer wieder"],                       // Wiederkehr / Echo
  ["Und doch", "Merkwürdig", "Seltsam nur", "Allerdings"],                                     // Kontrast
  ["Währenddessen", "Gleichzeitig", "Indessen", "Anderswo", "Nebenbei"],                        // Nebenhandlung
  ["Mehr noch", "Hinzu kommt", "Und dann"],                                                     // Steigerung
  ["Weiter hinten", "Im Augenwinkel", "Kurz darauf", "Einen Moment später", "Dazwischen", "Fast unbemerkt", "Zunächst"], // Ort / Zeit
];

/** Liefert einen zustandsbehafteten Picker: jeder Aufruf gibt eine Wendung,
 *  ohne Kategorie oder Wendung des vorigen Aufrufs zu wiederholen. */
export function makeConnectorPicker(): () => string {
  let lastCat = -1;
  let lastWord = "";
  const rnd = (n: number): number => Math.floor(Math.random() * n);
  return (): string => {
    let ci = rnd(CONNECTOR_CATEGORIES.length);
    if (CONNECTOR_CATEGORIES.length > 1) { let g = 0; while (ci === lastCat && g++ < 8) ci = rnd(CONNECTOR_CATEGORIES.length); }
    const pool = CONNECTOR_CATEGORIES[ci]!;
    let w = pool[rnd(pool.length)]!;
    if (pool.length > 1) { let g = 0; while (w === lastWord && g++ < 8) w = pool[rnd(pool.length)]!; }
    lastCat = ci; lastWord = w;
    return w;
  };
}
