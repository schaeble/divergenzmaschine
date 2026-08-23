// Prüfstand Schaltplan.
//
// Gefragt war ein Plan, der zeigt, „welche Einstellungen gegenwärtig aktiv
// sind", weil es sonst ein Raten ist, woran ein Ergebnis liegt. Der Plan misst
// nicht — er liest ab. Sein Wert steckt deshalb in genau einer Sache: dem
// Abgleich zwischen SCHALTER und QUELLE. Ein Schalter, der an ist, während
// seine Quelle leer ist, sieht in der Oberfläche aus wie ein Schalter, der
// wirkt. Diese Fälle muss der Plan finden, und dafür gibt es hier drei Proben
// mit erfundenen Beständen.
//
// Die Anordnung wird mitgeprüft: Ein Plan mit übereinanderliegenden Feldern
// wäre schlimmer als keiner. jsdom rechnet kein Layout, deshalb rechnet der
// Plan seine Koordinaten selbst — und deshalb sind sie hier nachprüfbar.
import { baueAnlage, type AnlageStand, type Umgebung } from "../src/features/schaltplan";
import { KNOB_VORGABE } from "../src/features/knobs";
import { ordne, BAND_NAME, renderSchaltplan, befundListe } from "../src/ui/schaltplanView";
import { JSDOM } from "jsdom";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const STAND = (regler: Record<string, string> = {}): AnlageStand => ({
  regler: { preset: "kafka", tone: "neutral", form: "prose", structure: "rekombination", mode: "auto",
    perspective: "third", rhythm: "auto", varLevel: "mid", markovMode: "off", disruptor: "auto",
    tension: "auto", archetypeA: "neutral", archetypeB: "neutral", instability: "0",
    ressort: "auto", lenTarget: "110", ...regler },
  w4: { where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte" },
  zeit: "",
});
const UMGEBUNG = (u: Partial<Umgebung> = {}): Umgebung => ({
  korpusZeichen: 0, sammlerFunde: 0, bildFunde: 0, themenFunde: 0, weltFiguren: 0, weltOrte: 0,
  livePools: 0, schatzkammer: 0, knobs: { ...KNOB_VORGABE }, gesperrt: new Set<string>(),
  dramaVorhanden: false, presetLabel: "Kafka", ...u,
});
const knoten = (a: ReturnType<typeof baueAnlage>, id: string) => a.knoten.find((k) => k.id === id);

// ── 1 · Der Plan steht überhaupt ──────────────────────────────────────────
{
  const a = baueAnlage(STAND(), UMGEBUNG());
  wahr(`es gibt Knoten (${a.knoten.length})`, a.knoten.length >= 30);
  wahr("jeder Knoten hat eine eindeutige Kennung",
    new Set(a.knoten.map((k) => k.id)).size === a.knoten.length);
  wahr("jeder Knoten liegt in einem bekannten Band",
    a.knoten.every((k) => k.band >= 0 && k.band < BAND_NAME.length));
  wahr("jede Leitung verbindet zwei vorhandene Knoten",
    a.kanten.every((k) => !!knoten(a, k.von) && !!knoten(a, k.nach)));
}

// ── 2 · Der eigentliche Zweck: Schalter an, Quelle leer ───────────────────
// Drei Fälle, die in der Oberfläche gleich aussehen wie ein wirkender Schalter.
{
  // a) Markov steht auf „Stark", der Korpus ist leer.
  const a = baueAnlage(STAND({ markovMode: "on" }), UMGEBUNG({ korpusZeichen: 0 }));
  ist("Markov ohne Korpus ist leer, nicht an", knoten(a, "markov")?.zustand, "leer");
  wahr("und der Befund nennt den Grund", /Korpus ist leer/.test(knoten(a, "markov")?.hinweis || ""));
  wahr("die Leitung Korpus → Markov ist mit leer gezeichnet",
    a.kanten.find((k) => k.von === "korpus" && k.nach === "markov")?.zustand === "leer");

  // b) Derselbe Schalter mit Korpus: an.
  const b = baueAnlage(STAND({ markovMode: "on" }), UMGEBUNG({ korpusZeichen: 5000 }));
  ist("Markov mit Korpus ist an", knoten(b, "markov")?.zustand, "an");

  // c) Struktur „Dramaturgie" bei einem Preset ohne Bogen.
  const c = baueAnlage(STAND({ structure: "dramaturgie" }), UMGEBUNG({ dramaVorhanden: false }));
  ist("Dramaturgie ohne Bogen ist leer", knoten(c, "drama")?.zustand, "leer");
  const d = baueAnlage(STAND({ structure: "dramaturgie" }), UMGEBUNG({ dramaVorhanden: true }));
  ist("Dramaturgie mit Bogen ist an", knoten(d, "drama")?.zustand, "an");

  // d) Korpus-Bausteine auf 20 %, Korpus leer.
  const e = baueAnlage(STAND(), UMGEBUNG({ knobs: { ...KNOB_VORGABE, korpus: 20 }, korpusZeichen: 0 }));
  ist("Korpus-Bausteine ohne Korpus sind leer", knoten(e, "k-korpus")?.zustand, "leer");
  const f = baueAnlage(STAND(), UMGEBUNG({ knobs: { ...KNOB_VORGABE, korpus: 20 }, korpusZeichen: 900 }));
  ist("mit Korpus sind sie an", knoten(f, "k-korpus")?.zustand, "an");
  ist("bei 0 % sind sie aus",
    knoten(baueAnlage(STAND(), UMGEBUNG({ korpusZeichen: 900 })), "k-korpus")?.zustand, "aus");

  // e) Vier leere Felder sind auch eine tote Leitung.
  const g = baueAnlage({ ...STAND(), w4: { where: "", when: "", who: "", what: "" } }, UMGEBUNG());
  ist("vier leere W sind leer", knoten(g, "w4")?.zustand, "leer");

  // Und die Sammelmeldung führt sie alle auf.
  const h = baueAnlage(STAND({ markovMode: "on", structure: "dramaturgie" }),
    UMGEBUNG({ knobs: { ...KNOB_VORGABE, korpus: 20 } }));
  wahr(`der Plan meldet mehrere tote Leitungen (${h.befunde.length})`, h.befunde.length >= 3);
}

// ── 3 · Ein geschlossenes Schloss steht im Plan ───────────────────────────
{
  const a = baueAnlage(STAND(), UMGEBUNG({ gesperrt: new Set(["f-tone", "k-korpus"]) }));
  ist("gesperrter Ton ist als gesperrt gezeichnet", knoten(a, "ton")?.gesperrt, true);
  ist("gesperrte Stellschraube auch", knoten(a, "k-korpus")?.gesperrt, true);
  ist("ein offener Regler nicht", knoten(a, "form")?.gesperrt, false);
}

// ── 4 · Die Anordnung überlappt nicht ─────────────────────────────────────
// Ohne diese Prüfung würde ein neuer Knoten irgendwann unter einem alten
// liegen, und niemand sähe es, solange der Plan „irgendwie" gezeichnet wird.
{
  const a = baueAnlage(STAND(), UMGEBUNG());
  const { platz, hoehe } = ordne(a);
  ist("jeder Knoten hat einen Platz", Object.keys(platz).length, a.knoten.length);
  wahr("der Plan hat eine Höhe", hoehe > 100);
  const felder = Object.entries(platz);
  let ueber = 0;
  for (let i = 0; i < felder.length; i++) for (let j = i + 1; j < felder.length; j++) {
    const p = felder[i]![1], q = felder[j]![1];
    if (p.x < q.x + q.w && q.x < p.x + p.w && p.y < q.y + q.h && q.y < p.y + p.h) ueber++;
  }
  ist("keine zwei Felder überlappen", ueber, 0);
  wahr("jedes Feld liegt im Plan", felder.every(([, p]) => p.y >= 0 && p.y + p.h <= hoehe));
  // Bänder in der richtigen Reihenfolge: Vorräte oben, Ausgabe unten.
  const oben = (id: string): number => platz[id]!.y;
  wahr("Vorräte stehen über dem Material", oben("korpus") < oben("w4"));
  wahr("Material über der Steuerung", oben("w4") < oben("struktur"));
  wahr("Steuerung über dem Schliff", oben("struktur") < oben("persp"));
  wahr("Schliff über der Ausgabe", oben("persp") < oben("form"));
}


// ── 5 · Gezeichnet wird er auch ───────────────────────────────────────────
// Die Anordnung kann stimmen und das Zeichnen trotzdem scheitern (SVG braucht
// createElementNS, nicht createElement). Deshalb einmal wirklich malen.
{
  const dom = new JSDOM("<!doctype html><html><body></body></html>");
  const G = globalThis as unknown as Record<string, unknown>;
  try { Object.defineProperty(G, "document", { value: dom.window.document, writable: true, configurable: true }); } catch { /* schon da */ }
  const a = baueAnlage(STAND({ markovMode: "on" }), UMGEBUNG({ gesperrt: new Set(["f-tone"]) }));
  const svg = renderSchaltplan(a);
  ist("das Wurzelelement ist ein SVG", svg.tagName.toLowerCase(), "svg");
  ist("jeder Knoten wird gezeichnet", svg.querySelectorAll("g.sp-chip").length, a.knoten.length);
  wahr("die toten Leitungen sind als solche gezeichnet", svg.querySelectorAll("g.sp-leer").length >= 1);
  wahr("das Schloss steht im Bild", (svg.textContent || "").includes("\u{1F512}"));
  wahr("die Bandtitel stehen im Bild", BAND_NAME.every((n) => (svg.textContent || "").includes(n)));
  const b = befundListe(a);
  wahr(`die Befundzeile nennt die toten Leitungen (${b.leer})`, b.leer >= 1 && /Korpus/.test(b.text));
}

console.log(`Prüfstand Schaltplan — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Schaltplan: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Schaltplan: alle ${geprueft} Prüfungen bestanden.`);
}
