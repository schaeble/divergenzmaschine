// Prüfstand Musterseite: die Anordnung als Geometrie.
//
// Eine Musterseite taugt nur, wenn sie DECKT: keine Lücke, keine Überlappung,
// jede Spalte belegt — und zwar bei jeder Spaltenzahl. Wo der Umbruch bisher
// Löcher ließ, darf ein Schema keine erst erzeugen.
import {
  SCHEMATA, schemaVon, schemaPlaetze, verteileSpalten, wortZiel, formFuer, schemaAuftraege,
} from "../src/features/musterseite";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Spaltenverteilung ───────────────────────────────────────────────────
ist("zwei gleiche Gewichte auf vier Spalten", JSON.stringify(verteileSpalten([1, 1], 4)), JSON.stringify([2, 2]));
ist("2:1 auf drei Spalten", JSON.stringify(verteileSpalten([2, 1], 3)), JSON.stringify([2, 1]));
ist("2:1 auf fünf Spalten", JSON.stringify(verteileSpalten([2, 1], 5)), JSON.stringify([3, 2]));
ist("ein Block bekommt alles", JSON.stringify(verteileSpalten([1], 5)), JSON.stringify([5]));
ist("mehr Blöcke als Spalten: die hinteren fallen weg", verteileSpalten([1, 1, 1, 1], 2).length, 2);
for (const n of [2, 3, 4, 5]) {
  for (const g of [[1], [1, 1], [2, 1], [1, 2], [1, 1, 1], [3, 2]]) {
    const v = verteileSpalten(g, n);
    wahr(`Summe stimmt (${n} Spalten, ${g.join(":")})`, v.reduce((a, b) => a + b, 0) === n, v.join("+"));
    wahr(`keine Nullbreite (${n}, ${g.join(":")})`, v.every((x) => x >= 1));
  }
}

// ── 2 · Die Plätze decken die Seite — bei jeder Spaltenzahl ─────────────────
let luecken = 0, breitenfehler = 0, faelle = 0;
const bilder = new Set<string>();
for (const s of SCHEMATA) {
  for (const n of [2, 3, 4, 5]) {
    const H = 900;
    const p = schemaPlaetze(s, n, H);
    faelle++;
    bilder.add(s.id + ":" + p.map((x) => `${x.reihe}/${x.spalteVon}+${x.spalten}`).join(","));
    const reihen = new Map<number, number>();
    for (const x of p) reihen.set(x.reihe, (reihen.get(x.reihe) || 0) + x.spalten);
    for (const [, b] of reihen) if (b !== n) breitenfehler++;
    const hoehen = [...new Set(p.map((x) => x.reihe))].map((r) => {
      const erste = p.find((x) => x.reihe === r)!;
      return { oben: erste.oben, hoehe: erste.hoehe };
    }).sort((a, b) => a.oben - b.oben);
    let cursor = 0;
    for (const h of hoehen) { if (h.oben !== cursor) luecken++; cursor = h.oben + h.hoehe; }
    if (cursor !== H) luecken++;
  }
}
ist(`${faelle} Schema-Spalten-Kombinationen: jede Reihe füllt die Breite`, breitenfehler, 0);
ist("keine Lücke zwischen den Reihen, kein Streifen am Fuß", luecken, 0);
// Die Zusage, die der Benutzer benannt hat: Die Spaltenzahl ändert das Bild.
ist("jede Kombination ergibt ein eigenes Bild", bilder.size, faelle);

// ── 3 · Rollen ──────────────────────────────────────────────────────────────
{
  const p = schemaPlaetze(schemaVon("klassisch")!, 3, 900);
  ist("die erste volle Reihe ist der Aufmacher", p[0]!.rolle, "aufmacher");
  ist("und sie überspannt alle Spalten", p[0]!.spalten, 3);
  wahr("es gibt höchstens einen Aufmacher", p.filter((x) => x.rolle === "aufmacher").length <= 1);
  wahr("die schmalen Stücke unten sind Kästen", p.filter((x) => x.rolle === "kasten").length >= 1);
}

// ── 4 · Vom Platz zur Wortzahl ──────────────────────────────────────────────
{
  const H = 900, N = 3, SEITE = 620;
  const p = schemaPlaetze(schemaVon("klassisch")!, N, H);
  const summe = p.reduce((a, x) => a + wortZiel(x, N, H, SEITE), 0);
  wahr("die Wortzahlen ergeben zusammen die Seite", Math.abs(summe - SEITE) <= SEITE * 0.08, `${summe} gegen ${SEITE}`);
  wahr("der Aufmacher bekommt am meisten", wortZiel(p[0]!, N, H, SEITE) === Math.max(...p.map((x) => wortZiel(x, N, H, SEITE))));
  wahr("kein Platz verlangt weniger als 20 Wörter", p.every((x) => wortZiel(x, N, H, SEITE) >= 20));
}

// ── 5 · Form nach Fläche ────────────────────────────────────────────────────
ist("ein winziger Platz bekommt eine Meldung", formFuer(45, "kasten"), "meldung");
ist("ein kleiner Kasten bekommt einen Vers", formFuer(100, "kasten"), "poem");
ist("der Aufmacher bekommt einen Bericht", formFuer(300, "aufmacher"), "bericht");
ist("alles andere wird Prosa", formFuer(200, "spalte"), "prose");

// ── 6 · Aufträge ────────────────────────────────────────────────────────────
{
  const p = schemaPlaetze(schemaVon("bunt")!, 4, 900);
  const a = schemaAuftraege(p, 4, 900, 550);
  ist("je Platz ein Auftrag", a.length, p.length);
  wahr("jeder Auftrag nennt eine Form", a.every((x) => !!x.form));
  wahr("und eine Wortzahl", a.every((x) => x.woerter >= 20));
  wahr("die kurzen Plätze werden Meldungen", a.some((x) => x.form === "meldung"));
}

console.log(`Prüfstand Musterseite — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Musterseite: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Musterseite: alle ${geprueft} Prüfungen bestanden.`);
}
