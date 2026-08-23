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
import { KNOB_VORGABE, KNOB_SPANNE } from "../src/features/knobs";
import { wuerfleAlles, REGLER } from "../src/features/wuerfeln";
import { werte } from "../src/generation/optionen";
import { ordne, BAND_NAME, renderSchaltplan, befundListe } from "../src/ui/schaltplanView";
import { JSDOM } from "jsdom";
import { saveAnlage } from "../src/features/schaltplan";
import { mountDiagnose } from "../src/ui/diagnoseView";

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


// ── 6 · Würfeln ohne Oberfläche ───────────────────────────────────────────
// Der Knopf neben „Schaltplan aktualisieren" würfelt, ohne dass ein Studio
// gemountet ist. Drei Zusagen: Jeder Wert stammt aus der ECHTEN Liste des
// Auswahlfelds, Gesperrtes bleibt stehen, und über viele Würfe bewegt sich
// jeder offene Regler wenigstens einmal.
{
  const listen = new Map(REGLER.map((r) => [r.schluessel, new Set(werte(r.liste))]));
  const start = STAND().regler;

  // a) Nur gültige Werte
  let falsch = 0;
  for (let i = 0; i < 40; i++) {
    const w = wuerfleAlles(start, new Set<string>());
    for (const [k, menge] of listen) if (!menge.has(w.regler[k] || "")) falsch++;
  }
  ist("jeder gewürfelte Wert steht in der Liste des Auswahlfelds", falsch, 0);

  // b) Schlösser halten — auch bei den Stellschrauben
  const zu = new Set(["f-tone", "f-form", "k-korpus", "k-bogen"]);
  let verschoben = 0;
  const knobsVor = { ...KNOB_VORGABE, korpus: 30, bogen: 75 };
  for (let i = 0; i < 40; i++) {
    const w = wuerfleAlles(start, zu, knobsVor);
    if (w.regler["tone"] !== start["tone"]) verschoben++;
    if (w.regler["form"] !== start["form"]) verschoben++;
    if (w.knobs.korpus !== 30) verschoben++;
    if (w.knobs.bogen !== 75) verschoben++;
  }
  ist("gesperrte Regler und Stellschrauben bleiben stehen", verschoben, 0);

  // c) Offene bewegen sich
  const bewegt = new Set<string>();
  for (let i = 0; i < 60; i++) {
    const w = wuerfleAlles(start, new Set<string>());
    for (const r of REGLER) if (w.regler[r.schluessel] !== start[r.schluessel]) bewegt.add(r.schluessel);
    for (const f of Object.keys(KNOB_SPANNE)) if (w.knobs[f as keyof typeof w.knobs] !== KNOB_VORGABE[f as keyof typeof KNOB_VORGABE]) bewegt.add(f);
  }
  const tot = [...REGLER.map((r) => r.schluessel), ...Object.keys(KNOB_SPANNE)].filter((k) => !bewegt.has(k));
  ist("jeder offene Regler bewegt sich in 60 Würfen", tot.join(", "), "");

  // d) Ein Wurf schlägt auf den Plan durch: Markov aus dem Wurf steht im Plan.
  const w = wuerfleAlles(start, new Set<string>());
  const a = baueAnlage({ ...STAND(), regler: w.regler }, UMGEBUNG({ knobs: w.knobs, korpusZeichen: 4000 }));
  const markov = knoten(a, "markov");
  ist("der Plan zeigt den gewürfelten Markov-Wert",
    markov?.zustand, w.regler["markovMode"] === "off" ? "aus" : "an");
}


// ── 7 · Der Knopf sitzt neben dem Plan und wirkt sofort ───────────────────
// Gebeten wurde um „einen zusätzlichen Alles-würfeln-Schalter, um die
// Änderungen direkt sichtbar zu machen, ohne Fensterwechsel". Geprüft wird
// genau das: Der Reiter lässt sich aufbauen, der Knopf steht da, und ein Druck
// verändert das Bild — ohne dass ein Studio gemountet ist.
{
  const dom2 = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
  const G = globalThis as unknown as Record<string, unknown>;
  for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
    "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node", "getComputedStyle",
    "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob", "URL", "FileReader",
    "Image", "DOMParser"]) {
    try { Object.defineProperty(G, k, { value: (dom2.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
  }
  const keinMedia = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  Object.defineProperty(G, "matchMedia", { value: keinMedia, writable: true, configurable: true });
  (dom2.window as unknown as Record<string, unknown>)["matchMedia"] = keinMedia;
  (dom2.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};
  saveAnlage(STAND());
  const D2 = dom2.window.document;
  const wurzel = D2.createElement("div");
  D2.body.append(wurzel);
  mountDiagnose(wurzel);
  const plan = (): Element | null => wurzel.querySelector("svg.schaltplan");
  wahr("der Reiter Diagnose zeichnet den Plan beim Aufbau", !!plan());
  const knopf = Array.from(wurzel.querySelectorAll("button"))
    .find((b) => /Alles würfeln/.test(b.textContent || "")) as HTMLButtonElement | undefined;
  wahr("der Wuerfelknopf steht neben dem Plan", !!knopf);
  if (knopf) {
    const vorher = (plan()?.textContent) || "";
    let anders = 0;
    for (let i = 0; i < 8; i++) { knopf.click(); if (((plan()?.textContent) || "") !== vorher) anders++; }
    // Acht Würfe über gut dreißig Regler: Dass sich kein einziger bewegt, hat
    // eine Wahrscheinlichkeit jenseits jeder Vorstellung.
    ist("jeder Druck zeichnet den Plan neu", anders, 8);
  }
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
