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
  MIN_KANTE, BILD_MAX, BILD_KEY, STAPEL_TIEFE, type Bildrahmen,
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
