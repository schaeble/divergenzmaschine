// Prüfstand Bildrahmen: die Rechnerei hinter dem Bild auf der Zeitungsseite.
//
// Geprüft wird ohne Browser, weil die Geometrie rein ist. Was hier NICHT
// geprüft werden kann: das Zeigergefühl beim Ziehen und wie das Bild auf dem
// Papier landet — dafür braucht es einen Bildschirm und einen Drucker.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import {
  zielMasse, begrenze, begrenzeLage, verschiebe, skaliereEcke, neuerRahmen,
  ladeBilder, sichereBilder, stapelLege, stapelNimm,
  rasteRahmen, spaltenBreite, spaltenSpanne, spaltenZahl, bildplatz, spaltenlagen,
  MIN_KANTE, BILD_MAX, BILD_KEY, STAPEL_TIEFE, type Bildrahmen, type Raster,
} from "../src/features/zeitungsbilder";

const B = 658, H = 972;              // Seite: A4 minus Seitenränder, wie im Setzer
const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

const r = (o: Partial<Bildrahmen>): Bildrahmen =>
  ({ id: "t", daten: "data:,x", seite: 0, x: 0, y: 0, b: 200, h: 150, verh: 200 / 150, ...o });

// ── 1 · Verkleinern beim Einlesen ───────────────────────────────────────────
ist("querformat wird auf die lange Kante verkleinert", JSON.stringify(zielMasse(4000, 3000)), JSON.stringify({ b: BILD_MAX, h: Math.round(BILD_MAX * 0.75) }));
ist("hochformat ebenso", JSON.stringify(zielMasse(3000, 4000)), JSON.stringify({ b: Math.round(BILD_MAX * 0.75), h: BILD_MAX }));
ist("kleines Bild bleibt unverändert", JSON.stringify(zielMasse(800, 600)), JSON.stringify({ b: 800, h: 600 }));
wahr("nie größer als die Grenze", zielMasse(9000, 200).b === BILD_MAX);
ist("Unsinn ergibt nichts", JSON.stringify(zielMasse(0, 0)), JSON.stringify({ b: 0, h: 0 }));

// ── 2 · In der Seite bleiben ────────────────────────────────────────────────
const raus = begrenze(r({ x: 900, y: 900, b: 300, h: 200 }), B, H);
wahr("rechts wird zurückgeholt", raus.x + raus.b <= B);
wahr("unten wird zurückgeholt", raus.y + raus.h <= H);
const riesig = begrenze(r({ x: 0, y: 0, b: 5000, h: 5000 }), B, H);
ist("zu breit wird auf die Seite gestutzt", riesig.b, B);
ist("zu hoch wird auf die Seite gestutzt", riesig.h, H);
ist("negative Lage wird gerade gezogen", begrenze(r({ x: -80, y: -40 }), B, H).x, 0);
ist("Mindestkante hält", begrenze(r({ b: 5, h: 5 }), B, H).b, MIN_KANTE);

// ── 3 · Verschieben ─────────────────────────────────────────────────────────
const v1 = verschiebe(r({ x: 100, y: 100 }), 50, -30, B, H);
ist("verschoben in x", v1.x, 150);
ist("verschoben in y", v1.y, 70);
ist("Größe bleibt beim Verschieben", v1.b, 200);
ist("am linken Rand ist Schluss", verschiebe(r({ x: 10 }), -999, 0, B, H).x, 0);
const v2 = verschiebe(r({ x: 10, y: 10 }), 9999, 9999, B, H);
wahr("am rechten/unteren Rand ist Schluss", v2.x + v2.b === B && v2.y + v2.h === H);

// ── 4 · Aufziehen: das Seitenverhältnis muss halten ─────────────────────────
// Eine Matrix statt eines Einzelfalls: schmale, breite, hohe Rahmen an jeder
// Ecke der Seite, in beide Richtungen gezogen. Geprüft werden drei Zusagen —
// in der Seite bleiben, nicht verzerren, nicht unter die Mindestkante fallen.
let verzerrt = 0, ausgetreten = 0, zuKlein = 0, faelle = 0;
for (const verh of [0.25, 0.5, 1, 1.5, 3.5]) {
  for (const x of [0, 200, 600, 657]) {
    for (const y of [0, 300, 900, 971]) {
      for (const dx of [-9999, -120, -1, 0, 1, 120, 9999]) {
        const start = r({ x, y, b: 200, h: Math.round(200 / verh), verh });
        const n = skaliereEcke(start, dx, B, H);
        faelle++;
        if (n.x < 0 || n.y < 0 || n.x + n.b > B || n.y + n.h > H) ausgetreten++;
        if (n.b < MIN_KANTE || n.h < MIN_KANTE) zuKlein++;
        // Rundung auf ganze Pixel erlaubt eine kleine Abweichung.
        if (Math.abs(n.b / n.h - verh) > verh * 0.05) verzerrt++;
      }
    }
  }
}
ist(`Aufziehen: ${faelle} Fälle, keiner tritt aus der Seite`, ausgetreten, 0);
ist("Aufziehen: keiner verzerrt", verzerrt, 0);
ist("Aufziehen: keiner fällt unter die Mindestkante", zuKlein, 0);
wahr("Aufziehen vergrößert wirklich", skaliereEcke(r({ x: 0, y: 0, b: 100, h: 75 }), 200, B, H).b > 100);
wahr("Zusammenziehen verkleinert wirklich", skaliereEcke(r({ x: 0, y: 0, b: 300, h: 225 }), -100, B, H).b < 300);
ist("Lage-Begrenzung fasst die Größe nicht an", begrenzeLage(r({ x: 9999, b: 300, h: 200 }), B, H).b, 300);

// ── 5 · Ein frisch eingefügter Rahmen ───────────────────────────────────────
const neu = neuerRahmen("data:,x", 4000, 3000, B, H, 0, "n1");
wahr("höchstens halbe Seitenbreite", neu.b <= Math.round(B / 2));
wahr("liegt vollständig auf der Seite", neu.x >= 0 && neu.y >= 0 && neu.x + neu.b <= B && neu.y + neu.h <= H);
wahr("mittig", Math.abs((neu.x + neu.b / 2) - B / 2) <= 1 && Math.abs((neu.y + neu.h / 2) - H / 2) <= 1);
wahr("Verhältnis übernommen", Math.abs(neu.verh - 4000 / 3000) < 0.001);
const hoch = neuerRahmen("data:,x", 600, 4000, B, H);
wahr("hohes Bild passt in die Seite", hoch.h <= H && hoch.y + hoch.h <= H);

// ── 6 · Speicher ────────────────────────────────────────────────────────────
// Eine echte (winzige) Data-URL: `ladeBilder` verwirft Einträge ohne Bilddaten,
// und ein Platzhalter wie „data:,x" ist genau so ein Fall.
const GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
sichereBilder([{ ...neu, daten: GIF }]);
ist("Bild wiedergefunden", ladeBilder().length, 1);
localStorage.setItem(BILD_KEY, "kein JSON");
ist("kaputter Speicher wirft nicht", ladeBilder().length, 0);
localStorage.setItem(BILD_KEY, JSON.stringify([{ id: "x" }]));
ist("Eintrag ohne Bilddaten fällt heraus", ladeBilder().length, 0);
localStorage.removeItem(BILD_KEY);
wahr("Schlüssel wandert in die Projektdatei", BILD_KEY.startsWith("divergenz_"));

// ── 7 · Rückgängig ──────────────────────────────────────────────────────────
let st: string[] = [];
st = stapelLege(st, { a: 1 });
st = stapelLege(st, { a: 1 });
ist("gleicher Stand zweimal legt nur einen ab", st.length, 1);
st = stapelLege(st, { a: 2 });
ist("anderer Stand kommt dazu", st.length, 2);
const g1 = stapelNimm(st);
ist("Zurück nimmt den jüngsten Stand", g1.stand, JSON.stringify({ a: 2 }));
ist("und verkürzt den Stapel", g1.stapel.length, 1);
ist("leerer Stapel gibt nichts", stapelNimm([]).stand, null);
let tief: string[] = [];
for (let i = 0; i < STAPEL_TIEFE + 25; i++) tief = stapelLege(tief, { i });
ist("Stapeltiefe hält", tief.length, STAPEL_TIEFE);
ist("das Älteste fällt heraus", tief[0], JSON.stringify({ i: 25 }));

// ── 8 · Spaltenraster ───────────────────────────────────────────────────────
// Dieselben Zahlen wie im Setzer: A4 minus Seitenränder, 6 mm Steg, 5 mm Zeile.
const MM = 96 / 25.4;
const R = (spalten: number): Raster => ({ spalten, seiteB: B, seiteH: H, steg: Math.round(6 * MM), zeile: Math.round(5 * MM) });

const r3 = R(3);
wahr("drei Spalten plus zwei Stege ergeben die Seite",
  Math.abs(3 * spaltenBreite(r3) + 2 * r3.steg - B) < 0.01);
ist("eine Spalte", Math.round(spaltenSpanne(r3, 1)), Math.round(spaltenBreite(r3)));
wahr("zwei Spalten enthalten den Steg",
  Math.abs(spaltenSpanne(r3, 2) - (2 * spaltenBreite(r3) + r3.steg)) < 0.01);
ist("mehr Spalten als die Seite hat gibt es nicht", Math.round(spaltenSpanne(r3, 9)), Math.round(spaltenSpanne(r3, 3)));

const ra1 = rasteRahmen(r({ x: 7, y: 11, b: 190, h: 143, verh: 190 / 143 }), r3);
ist("Breite rastet auf eine Spalte", ra1.b, Math.round(spaltenSpanne(r3, 1)));
ist("linke Kante rastet auf 0", ra1.x, 0);
ist("Oberkante rastet auf das Zeilenraster", ra1.y % r3.zeile, 0);
const ra2 = rasteRahmen(r({ x: 230, y: 100, b: 400, h: 300, verh: 4 / 3 }), r3);
ist("Breite rastet auf zwei Spalten", ra2.b, Math.round(spaltenSpanne(r3, 2)));
ist("und die linke Kante auf den zweiten Spaltenanfang", ra2.x, Math.round(spaltenBreite(r3) + r3.steg));

// Matrix: jede Spaltenzahl, jede Lage, jedes Format. Vier Zusagen.
let nichtImRaster = 0, ausSeite = 0, schief = 0, faelle2 = 0;
for (const n of [2, 3, 4, 5]) {
  const rr = R(n);
  const schritt = spaltenBreite(rr) + rr.steg;
  for (const verh of [0.4, 0.8, 1.4, 3]) {
    for (const x of [0, 33, 210, 500, 900]) {
      for (const y of [0, 7, 400, 1200]) {
        for (const b of [30, 120, 300, 600, 2000]) {
          const n2 = rasteRahmen(r({ x, y, b, h: Math.round(b / verh), verh }), rr);
          faelle2++;
          if (n2.x < 0 || n2.y < 0 || n2.x + n2.b > B + 1 || n2.y + n2.h > H + 1) ausSeite++;
          if (Math.abs(n2.b / n2.h - verh) > verh * 0.05) schief++;
          // Breite muss einer ganzen Spaltenzahl entsprechen — außer das Bild
          // ist so hoch, dass die Höhe führen musste.
          const k = spaltenZahl(n2.b, rr);
          const passt = Math.abs(n2.b - spaltenSpanne(rr, k)) <= 1;
          const hoehengefuehrt = n2.h >= H - 1;
          const aufKante = Math.abs(n2.x % schritt) <= 1 || Math.abs((n2.x % schritt) - schritt) <= 1
            || Math.abs(n2.x - (B - n2.b)) <= 1;
          if ((!passt && !hoehengefuehrt) || !aufKante) nichtImRaster++;
        }
      }
    }
  }
}
ist(`Raster: ${faelle2} Fälle, keiner tritt aus der Seite`, ausSeite, 0);
ist("Raster: keiner verzerrt", schief, 0);
ist("Raster: alle sitzen auf Spaltenkanten", nichtImRaster, 0);
ist("Spaltenzahl einer Spannbreite", spaltenZahl(spaltenSpanne(r3, 2), r3), 2);

// ── 9 · Platz für das Bild im Spaltensatz ───────────────────────────────────
// Die Spalten liegen bei y 300 und sind 600 hoch — wie auf einer Seite mit
// Kopf und Aufmacher darüber.
const lagen = spaltenlagen(r3, 300, 600);
ist("drei Spaltenlagen", lagen.length, 3);
ist("die erste beginnt links", lagen[0]!.x, 0);

const bildL = { x: 0, y: 400, b: Math.round(spaltenBreite(r3)), h: 150 };
const p0 = bildplatz(bildL, lagen[0]!);
ist("die berührte Spalte bekommt ein Band", p0 === null, false);
ist("Band beginnt beim Bild", p0!.oben, 100);
ist("Band ist so hoch wie das Bild", p0!.hoehe, 150);
ist("die Nachbarspalte bleibt frei", bildplatz(bildL, lagen[1]!), null);
ist("die dritte erst recht", bildplatz(bildL, lagen[2]!), null);

// Ein Bild über zwei Spalten trifft beide, die dritte nicht.
const bild2 = { x: 0, y: 400, b: Math.round(spaltenSpanne(r3, 2)), h: 150 };
wahr("zwei Spalten getroffen", !!bildplatz(bild2, lagen[0]!) && !!bildplatz(bild2, lagen[1]!));
ist("die dritte nicht", bildplatz(bild2, lagen[2]!), null);

// Randberührung darf NICHT zählen: ein Bild, das exakt an der Spaltenkante
// endet, räumt sonst die Nachbarspalte mit ab.
const bildKante = { x: 0, y: 400, b: Math.round(spaltenBreite(r3)) + r3.steg, h: 150 };
ist("Kantenberührung zählt nicht", bildplatz(bildKante, lagen[1]!), null);

// Ober- und unterhalb der Spalten passiert nichts.
ist("Bild über den Spalten", bildplatz({ x: 0, y: 10, b: 200, h: 100 }, lagen[0]!), null);
ist("Bild unter den Spalten", bildplatz({ x: 0, y: 950, b: 200, h: 100 }, lagen[0]!), null);
// Ragt es hinein, wird nur der hineinragende Teil freigehalten.
const teil = bildplatz({ x: 0, y: 250, b: 200, h: 100 }, lagen[0]!)!;
ist("nur der hineinragende Teil", teil.oben, 0);
ist("und nur dessen Höhe", teil.hoehe, 50);
// Luft kommt oben UND unten dazu.
const mitLuft = bildplatz(bildL, lagen[0]!, 10)!;
ist("Luft oben", mitLuft.oben, 90);
ist("Luft oben und unten", mitLuft.hoehe, 170);

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Bildrahmen — ${geprueft} Prüfungen (${faelle} Skalierfälle):`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler beim Bildrahmen:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Bildrahmen: alle ${geprueft} Prüfungen bestanden.`);
}
