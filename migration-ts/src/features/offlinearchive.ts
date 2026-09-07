// Offline-Wortarchiv — was davon übrig ist.
//
// Ursprünglich ein ungeordneter Pool aller eingefügten Wörter samt selbst
// benannten Gruppen, mit dreizehn Funktionen zum Füllen, Umbenennen,
// Zusammenführen und Leeren. Abgelöst wurde er von `archive2.ts`; die dreizehn
// Funktionen hatte danach keinen Aufrufer mehr — nachgezählt beim Aufräumen in
// 4.349.0: keine einzige kam außerhalb dieser Datei noch vor, und `KEY` wurde
// von keinem lebenden Weg mehr beschrieben. Wer heute etwas ins Archiv legt,
// legt es in `archive2`.
//
// Zwei Dinge bleiben, weil sie benutzt werden:
//
//   OfflineArchive  Der Typ. `project.ts` liest ihn beim EINLESEN alter
//                   Projektdateien und schiebt den Inhalt über
//                   `migrateOldArchives` nach `archive2`. Ohne den Typ verlöre
//                   eine alte Sicherung ihr Wortarchiv.
//   splitEntries    Zerlegt eingefügten Text in Einträge. Der Archiv-Reiter
//                   benutzt sie weiter; sie hat mit dem Pool nichts zu tun und
//                   stand nur zufällig hier.
//
// Was NICHT mit verschwindet: die Daten. Unter `dm_offline_archive_v1` kann in
// alten Browsern noch etwas liegen. Erreichbar war es schon vorher nicht — die
// einzige Tür dorthin war `loadOffline`, und die rief nur der tote Teil.

export interface OfflineArchive { pool: string[]; groups: Record<string, string[]>; }

/** Zerlegt eingefügten Text in Einträge: pro Zeile ein Eintrag; einzeilig → nach Komma/Semikolon/Tab. */
export function splitEntries(text: string): string[] {
  let parts = (text || "").split(/[\r\n]+/).map((t) => t.trim()).filter(Boolean);
  if (parts.length <= 1) parts = (text || "").split(/[,;\t]+/).map((t) => t.trim()).filter(Boolean);
  return parts;
}
