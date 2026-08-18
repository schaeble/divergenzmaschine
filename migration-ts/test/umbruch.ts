// Prüfstand Seitenumbruch — die Verteilung auf Spalten und Seiten.
//
// Sie war bisher ungeprüft, und genau hier saß der Fehler, den der Benutzer
// gemeldet hat: „1 von 101 Beiträgen gesetzt". Die Schleife probierte nur den
// VORDERSTEN Beitrag; passte der nicht, endete die Spalte — und weil derselbe
// Beitrag auch in der nächsten Spalte vorn stand, endete auch die. Eine
// Schatzkammer voller langer Texte ergab damit eine leere Seite.
//
// Reine Rechnerei, deshalb ohne Browser prüfbar: Die Höhenmessung kommt als
// Funktion herein.
import { umbrechen, fuellgrad, type Messbar, type UmbruchTeil, type UmbruchOpts } from "../src/ui/umbruch";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

/** Messung nach Tabelle: hoehen[id] × Skala. */
const messer = (hoehen: number[]): Messbar => ({ hoehe: (id, skala) => Math.round((hoehen[id] ?? 0) * skala) });
const teile = (n: number, rolle: UmbruchTeil["rolle"] = "spalte"): UmbruchTeil[] =>
  Array.from({ length: n }, (_, i) => ({ id: i, rolle }));
const opts = (o: Partial<UmbruchOpts> = {}): UmbruchOpts =>
  ({ spaltenhoehe: 600, spalten: 3, seiten: 1, ...o });

// ── 1 · Der gemeldete Fehler ────────────────────────────────────────────────
// Der erste Beitrag ist zu hoch für jede Spalte, die folgenden passen bequem.
{
  const mess = messer([900, 200, 200, 200, 200, 200]);
  const seiten = umbrechen(teile(6), mess, opts());
  const gesetzt = seiten[0]!.teile.length;
  wahr("ein zu hoher Beitrag blockiert die Seite nicht mehr", gesetzt >= 5, `${gesetzt} gesetzt`);
  wahr("der zu hohe bleibt liegen", !seiten[0]!.teile.some((t) => t.id === 0));
}

// ── 2 · Kein Beitrag wird doppelt gesetzt ───────────────────────────────────
{
  const mess = messer([150, 150, 150, 150, 150, 150, 150, 150, 150]);
  const seiten = umbrechen(teile(9), mess, opts());
  const ids = seiten.flatMap((s) => s.teile.map((t) => t.id));
  ist("keine Dublette", ids.length, new Set(ids).size);
}

// ── 3 · Den Fuß auffüllen statt ein Loch lassen ─────────────────────────────
{
  const mess = messer([250, 250, 900]);   // 2×250 passen, der dritte nie
  const ohne = umbrechen(teile(3), mess, opts({ spalten: 1, mindestRest: 0 }));
  const mit = umbrechen(teile(3), mess, opts({ spalten: 1, mindestRest: 80 }));
  ist("ohne Mindestrest bleibt das Loch", ohne[0]!.teile.length, 2);
  ist("mit Mindestrest kommt noch einer hinein", mit[0]!.teile.length, 3);
  wahr("und er ist als gekürzt gekennzeichnet", mit[0]!.teile[2]!.gekuerzt === true);
}
{
  // Zu wenig Luft: dann NICHT mehr anfangen — eine Überschrift ohne Text ist
  // schlimmer als ein Loch.
  const mess = messer([560, 900]);
  const mit = umbrechen(teile(2), mess, opts({ spalten: 1, mindestRest: 80 }));
  ist("bei zu wenig Luft bleibt es beim Loch", mit[0]!.teile.length, 1);
}

// ── 4 · Der Aufmacher ───────────────────────────────────────────────────────
{
  const mess = messer([1500, 200, 200, 200, 200, 200, 200]);   // 1500 = in Spaltenbreite gemessen
  const o = opts({ aufmacherhoehe: 300 });                      // in voller Breite: nur 300
  const t: UmbruchTeil[] = [{ id: 0, rolle: "aufmacher" }, ...teile(6).slice(1)];
  const seiten = umbrechen(t, mess, o);
  const auf = seiten[0]!.teile.find((x) => x.rolle === "aufmacher")!;
  ist("der Aufmacher steht über alle Spalten", auf.spalte, -1);
  const grad = fuellgrad(seiten[0]!, mess, o);
  // Ohne die Korrektur zählte fuellgrad den Aufmacher mit 1500 statt 300 und
  // meldete eine fast leere Seite als zu 71 % gefüllt.
  // 300 oben + 3 Spalten à 200 von je 300 nutzbar = 900 von 1200 = 0,75.
  // Mit der falschen Messung wären es 1500 oben und die Seite gälte als voll.
  wahr("die Füllung rechnet den Aufmacher in voller Breite", Math.abs(grad - 0.75) < 0.02, grad.toFixed(3));
  const spaltenTeile = seiten[0]!.teile.filter((x) => x.spalte >= 0).length;
  wahr("unter dem Aufmacher steht noch etwas", spaltenTeile >= 3, `${spaltenTeile} in Spalten`);
}

// ── 5 · Volle Seite ─────────────────────────────────────────────────────────
{
  const mess = messer(Array.from({ length: 40 }, () => 190));
  const o = opts({ spalten: 4, mindestRest: 80 });
  const seiten = umbrechen(teile(40), mess, o);
  ist("vier Spalten werden gefüllt", new Set(seiten[0]!.teile.map((t) => t.spalte)).size, 4);
  wahr("die Seite ist voll", fuellgrad(seiten[0]!, mess, o) > 0.9, fuellgrad(seiten[0]!, mess, o).toFixed(2));
}
{
  const mess = messer(Array.from({ length: 40 }, () => 190));
  const o = opts({ spalten: 5, mindestRest: 80 });
  const seiten = umbrechen(teile(40), mess, o);
  ist("fünf Spalten auch", new Set(seiten[0]!.teile.map((t) => t.spalte)).size, 5);
}

// ── 6 · Mehrere Seiten ──────────────────────────────────────────────────────
{
  const mess = messer(Array.from({ length: 30 }, () => 290));
  const seiten = umbrechen(teile(30), mess, opts({ seiten: 3, mindestRest: 80 }));
  ist("drei Seiten", seiten.length, 3);
  const ids = seiten.flatMap((s) => s.teile.map((t) => t.id));
  ist("auch über Seiten hinweg keine Dublette", ids.length, new Set(ids).size);
}

console.log(`Prüfstand Umbruch — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Umbruch: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Umbruch: alle ${geprueft} Prüfungen bestanden.`);
}
