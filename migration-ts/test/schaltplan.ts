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
import { baueAnlage, SCHLOSS_ZU_KNOTEN, type AnlageStand, type Umgebung } from "../src/features/schaltplan";
import { mountStudio } from "../src/ui/studio";
import { KNOB_VORGABE, KNOB_SPANNE } from "../src/features/knobs";
import { wuerfleAlles, wuerfleVierW, REGLER, SCHIEBER } from "../src/features/wuerfeln";
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
  dramaVorhanden: false, presetLabel: "Kafka", ideenProfil: "", ...u,
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
  // Der zweite stumme Ausfall: Dramaturgie wirkt nur bei Prosa.
  const c2 = baueAnlage(STAND({ structure: "dramaturgie", form: "haiku" }), UMGEBUNG({ dramaVorhanden: true }));
  ist("Dramaturgie bei anderer Form ist leer", knoten(c2, "drama")?.zustand, "leer");
  wahr("und nennt die Form als Grund", /nicht Prosa/.test(knoten(c2, "drama")?.hinweis || ""));
  // Und wo der Schalter steht, sagt der Plan selbst — danach war gefragt.
  const c3 = baueAnlage(STAND({ structure: "rekombination" }), UMGEBUNG());
  ist("ohne Dramaturgie steht sie auf aus", knoten(c3, "drama")?.zustand, "aus");
  wahr("und verweist auf die Struktur", /Struktur auf/.test(knoten(c3, "drama")?.hinweis || ""));

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

  // Gemeldet: „Die aktiven Rahmen sind schlecht unterscheidbar zu den
  // inaktiven." Der Unterschied lag allein in der Farbe, bei gleicher
  // Strichstärke — und `opacity:.55` verblasste ausgerechnet den Rahmen.
  //
  // Ein Plan, der nur über Farbe spricht, ist für einen Teil der Leser stumm.
  // Diese Prüfung hält fest, dass jeder Zustand ein eigenes ZEICHEN trägt; die
  // Strichstärke und die Strichart stehen im Stylesheet daneben.
  const zeichenVon = (zustand: string): Set<string> => {
    const raus = new Set<string>();
    for (const g of Array.from(svg.querySelectorAll("g.sp-" + zustand))) {
      const t = g.querySelector("text.sp-zeichen");
      if (t) raus.add(t.textContent || "");
    }
    return raus;
  };
  const anZ = zeichenVon("an"), ausZ = zeichenVon("aus"), leerZ = zeichenVon("leer");
  ist("jeder aktive Knoten trägt genau ein Zeichen", anZ.size, 1);
  ist("jeder abgeschaltete auch", ausZ.size, 1);
  ist("und jeder tote auch", leerZ.size, 1);
  const alleZ = new Set([...anZ, ...ausZ, ...leerZ]);
  ist("die drei Zustände tragen drei verschiedene Zeichen", alleZ.size, 3);
  wahr("kein Zeichen ist leer", ![...alleZ].some((z) => !z.trim()));
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


// ── 8 · Jedes Schloss der Oberfläche steht im Plan ────────────────────────
// Gemeldet: „Bei Länge ist das Schloss gesetzt, wird aber nicht angezeigt."
// Der Knoten „Länge" war ohne Schloss-Kennung angelegt und konnte deshalb nie
// gesperrt aussehen. Dabei fehlten auch drei Knoten ganz: Figurendisziplin,
// Umwelt, Neuheit und Überraschung tragen ein Schloss und standen nicht im Plan.
//
// Eine Aufzählung im Kopf des Plans hätte denselben Fehler beim nächsten Regler
// wiederholt. Deshalb wird sie hier gegen das LAUFENDE Studio gehalten: Was ein
// Schloss trägt, muss im Plan vorkommen.
{
  const dom3 = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
  const G = globalThis as unknown as Record<string, unknown>;
  for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
    "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node", "getComputedStyle",
    "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob", "URL", "FileReader",
    "Image", "DOMParser"]) {
    try { Object.defineProperty(G, k, { value: (dom3.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
  }
  const km = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  Object.defineProperty(G, "matchMedia", { value: km, writable: true, configurable: true });
  (dom3.window as unknown as Record<string, unknown>)["matchMedia"] = km;
  (dom3.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};
  const D3 = dom3.window.document;
  const w = D3.createElement("div");
  D3.body.append(w);
  mountStudio(w);

  const mitSchloss = new Set<string>();
  for (const zeile of Array.from(w.querySelectorAll(".lockrow"))) {
    const feld = zeile.closest(".field") || zeile.parentElement;
    if (!feld) continue;
    for (const c of Array.from(feld.querySelectorAll("select,input"))) {
      const id = (c as HTMLElement).id;
      if (id) mitSchloss.add(id);
    }
  }
  wahr(`die Oberfläche hat Bedienelemente mit Schloss (${mitSchloss.size})`, mitSchloss.size >= 30);
  const ohneKnoten = [...mitSchloss].filter((id) => !SCHLOSS_ZU_KNOTEN[id]).sort();
  ist("jedes Schloss der Oberfläche zeigt auf einen Knoten", ohneKnoten.join(", "), "");

  // Und die Zuordnung darf nicht ins Leere zeigen.
  const alle = baueAnlage(STAND(), UMGEBUNG());
  const kennungen = new Set(alle.knoten.map((k) => k.id));
  const totesZiel = [...new Set(Object.values(SCHLOSS_ZU_KNOTEN))].filter((n) => !kennungen.has(n)).sort();
  ist("jede Zuordnung zeigt auf einen Knoten, den es gibt", totesZiel.join(", "), "");

  // Der gemeldete Fall, direkt geprüft: Länge gesperrt → Schloss im Plan.
  const mitLen = baueAnlage(STAND(), UMGEBUNG({ gesperrt: new Set(["f-len"]) }));
  ist("ein Schloss an der Länge steht im Plan", knoten(mitLen, "laenge")?.gesperrt, true);
  // Und jedes andere Schloss ebenso — einmal quer durch.
  let fehlt = 0;
  for (const [id, ziel] of Object.entries(SCHLOSS_ZU_KNOTEN)) {
    // Knoten mit mehreren Kennungen brauchen alle Schlösser — eigene Probe unten.
    if (Object.values(SCHLOSS_ZU_KNOTEN).filter((z) => z === ziel).length > 1) continue;
    const a = baueAnlage(STAND(), UMGEBUNG({ gesperrt: new Set([id]) }));
    if (!knoten(a, ziel)?.gesperrt) fehlt++;
  }
  ist("jedes einzelne Schloss schlägt auf seinen Knoten durch", fehlt, 0);
  // Die vier W: erst wenn alle vier zu sind, ist das Feld zu.
  const drei = baueAnlage(STAND(), UMGEBUNG({ gesperrt: new Set(["f-where", "f-when", "f-who"]) }));
  ist("drei von vier W schließen das Feld noch nicht", knoten(drei, "w4")?.gesperrt, false);
  wahr("aber der Hinweis zählt sie", /3 von 4/.test(knoten(drei, "w4")?.hinweis || ""));
  const vier = baueAnlage(STAND(), UMGEBUNG({ gesperrt: new Set(["f-where", "f-when", "f-who", "f-what"]) }));
  ist("alle vier schon", knoten(vier, "w4")?.gesperrt, true);
}


// ── 9 · Die Schieber würfeln mit ──────────────────────────────────────────
// Gemeldet: „Länge und Überraschung würfelt sich nicht mit." Der kopflose
// Würfel kannte nur Auswahlfelder. Drei Zusagen, dieselben wie für die Regler.
{
  const start = { ...STAND().regler, lenTarget: "110", novelty: "30", surprise: "0", gewicht: "0/0/0/0" };
  const bewegt = new Set<string>();
  for (let i = 0; i < 60; i++) {
    const w = wuerfleAlles(start, new Set<string>());
    for (const sch of SCHIEBER) if (w.nachId[sch.id] !== undefined && w.nachId[sch.id] !== (start[sch.schluessel] ?? "")) bewegt.add(sch.id);
  }
  const tot = SCHIEBER.filter((sch) => !bewegt.has(sch.id)).map((sch) => sch.id);
  ist("jeder Schieber bewegt sich in 60 Würfen", tot.join(", "), "");

  // Nur gültige Stufen
  let daneben = 0;
  for (let i = 0; i < 40; i++) {
    const w = wuerfleAlles(start, new Set<string>());
    for (const sch of SCHIEBER) {
      const v = parseFloat(w.nachId[sch.id] || "NaN");
      if (!(v >= sch.min && v <= sch.max && Math.abs((v - sch.min) % sch.step) < 1e-9)) daneben++;
    }
  }
  ist("jeder Schieberwert liegt auf einer echten Stufe", daneben, 0);

  // Schlösser halten
  const zu = new Set(["f-len", "f-surprise"]);
  let verschoben = 0;
  for (let i = 0; i < 40; i++) {
    const w = wuerfleAlles(start, zu);
    if (w.nachId["f-len"] !== "110") verschoben++;
    if (w.nachId["f-surprise"] !== "0") verschoben++;
  }
  ist("gesperrte Schieber bleiben stehen", verschoben, 0);

  // Und der Plan zeigt den gewürfelten Wert
  const w2 = wuerfleAlles(start, new Set<string>());
  const a = baueAnlage({ ...STAND(), regler: w2.regler }, UMGEBUNG());
  ist("die Länge im Plan ist die gewürfelte",
    knoten(a, "laenge")?.wert, w2.regler["lenTarget"] + " Wörter");
}

// ── 10 · Die Spannen der Schieber stimmen mit der Oberfläche überein ──────
// Die Spannen stehen zweimal: als min/max/step am Eingabefeld und in SCHIEBER.
// Ohne DOM lassen sie sich nicht auslesen, also müssen sie doppelt stehen — und
// deshalb hier gegeneinander gehalten. Genau so ist der Disruptor mit vier
// Stellungen gemessen worden, die es nicht gab.
{
  const dom4 = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
  const G = globalThis as unknown as Record<string, unknown>;
  for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
    "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node", "getComputedStyle",
    "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob", "URL", "FileReader",
    "Image", "DOMParser"]) {
    try { Object.defineProperty(G, k, { value: (dom4.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
  }
  const km2 = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  Object.defineProperty(G, "matchMedia", { value: km2, writable: true, configurable: true });
  (dom4.window as unknown as Record<string, unknown>)["matchMedia"] = km2;
  (dom4.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};
  const D4 = dom4.window.document;
  const w = D4.createElement("div");
  D4.body.append(w);
  mountStudio(w);
  const falsch: string[] = [];
  for (const sch of SCHIEBER) {
    const el2 = w.querySelector("#" + sch.id) as HTMLInputElement | null;
    if (!el2) { falsch.push(`${sch.id} gibt es nicht`); continue; }
    if (parseFloat(el2.min) !== sch.min || parseFloat(el2.max) !== sch.max || parseFloat(el2.step) !== sch.step) {
      falsch.push(`${sch.id}: Feld ${el2.min}–${el2.max}/${el2.step}, Würfel ${sch.min}–${sch.max}/${sch.step}`);
    }
  }
  ist("die Spannen der Schieber stimmen mit den Eingabefeldern überein", falsch.join(" · "), "");
}


// ── 11 · Die vier W würfeln mit ───────────────────────────────────────────
// Gemeldet: „Material, Vier W werden nicht gewürfelt bei Alles würfeln." Der
// kopflose Würfel kannte Regler, Schieber und Stellschrauben — die vier W
// standen im Plan und blieben stehen. Sie brauchen kein DOM: Die Quellen (Welt,
// Wiki-Vorrat, Bildvorrat, Themenpool) sind Feature-Funktionen. Es hatte nur
// niemand verbunden.
{
  const vorher = { where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte" };
  let bewegt = 0;
  const gesehen = new Set<string>();
  for (let i = 0; i < 20; i++) {
    const w = wuerfleAlles(STAND().regler, new Set<string>(), undefined, vorher);
    if (JSON.stringify(w.w4) !== JSON.stringify(vorher)) bewegt++;
    gesehen.add(w.w4.where);
    wahr(`der Wurf nennt eine Quelle (${w.quelle})`, !!w.quelle);
    break;   // die Meldung reicht einmal; gezählt wird unten
  }
  for (let i = 0; i < 20; i++) {
    const w = wuerfleAlles(STAND().regler, new Set<string>(), undefined, vorher);
    if (JSON.stringify(w.w4) !== JSON.stringify(vorher)) bewegt++;
    gesehen.add(w.w4.where);
  }
  wahr(`die vier W bewegen sich (${bewegt} von 21 Würfen)`, bewegt >= 18);
  // Die Schranke steht bei 2 und nicht höher, und der Grund ist messbar: In
  // einem leeren Browser liefern 21 Würfe 5 bis 6 verschiedene Orte (15
  // Wiederholungen: 5 5 6 6 6 …). Hier laufen vorher §7, §8 und §10, die ein
  // Studio mounten und dabei eine WELT anlegen — und aus einer kleinen Welt
  // kommen wenige Orte. Das ist kein Fehler, sondern die Welt.
  //
  // Geprüft wird deshalb, was die Meldung wirklich meint: Der Würfel darf nicht
  // auf EINEM Wert kleben. Die harte Zusage steht in der Zeile darüber — in 21
  // Würfen bewegen sich die Felder mindestens 18-mal.
  wahr(`und nicht immer gleich (${gesehen.size} verschiedene Orte)`, gesehen.size >= 2);

  // Schlösser halten — dieselbe Regel wie überall.
  const zu = new Set(["f-where", "f-what"]);
  let verschoben = 0;
  for (let i = 0; i < 20; i++) {
    const w = wuerfleAlles(STAND().regler, zu, undefined, vorher);
    if (w.w4.where !== vorher.where) verschoben++;
    if (w.w4.what !== vorher.what) verschoben++;
  }
  ist("gesperrte W-Felder bleiben stehen", verschoben, 0);

  // Und im Plan steht danach ein gefülltes Feld.
  const w = wuerfleAlles(STAND().regler, new Set<string>(), undefined, vorher);
  const a = baueAnlage({ ...STAND(), w4: w.w4 }, UMGEBUNG());
  const knoten4 = knoten(a, "w4");
  wahr("der Plan zeigt die gewürfelten vier W als gefüllt", (knoten4?.wert || "").startsWith("4 von 4"));
}


// ── 12 · Die Länge wirkt — außer bei der Meldung ─────────────────────────
// Gemeldet: „Sollte der Länge-Button nicht blau sein? Ist eigentlich immer
// aktiv, ob bei 40 oder bei 300 Wörtern." Richtig. Der Knoten trug einen
// vierten Zustand „fest", der aussah wie „aus" — eine Falschaussage über einen
// Regler, der bei acht von neun Formen wirkt.
//
// Nachgemessen, je 12 Läufe bei Ziel 40 gegen Ziel 300:
//   prose 43→273 · poem 44→299 · reim 52→319 · haiku 34→307 · video 133→264
//   bericht 167→308 · script 63→221 · strang 59→93 · meldung 32→32
//
// Die Meldung ist die Ausnahme, und für die gibt es „leer": eingeschaltet,
// wirkt nicht.
{
  for (const form of ["prose", "haiku", "bericht", "reim", "video", "script", "poem", "strang"]) {
    const a = baueAnlage(STAND({ form }), UMGEBUNG());
    ist(`die Länge wirkt bei ${form}`, knoten(a, "laenge")?.zustand, "an");
  }
  const m = baueAnlage(STAND({ form: "meldung" }), UMGEBUNG());
  ist("bei der Meldung wirkt sie nicht", knoten(m, "laenge")?.zustand, "leer");
  wahr("und der Plan sagt warum", /feste Länge/.test(knoten(m, "laenge")?.hinweis || ""));
  wahr("der Wert nennt es auch", /ohne Wirkung/.test(knoten(m, "laenge")?.wert || ""));
  // Und den vierten Zustand gibt es nicht mehr.
  const alle = baueAnlage(STAND(), UMGEBUNG());
  ist("es gibt nur noch drei Zustände",
    [...new Set(alle.knoten.map((k) => k.zustand))].filter((z) => !["an", "leer", "aus"].includes(z)).join(", "), "");
}


// ── 13 · Die Ideen sind eine Quelle wie die Welt ─────────────────────────
// Einwand: „Der Ideen-Knopf könnte doch gleichwertig neben der Welt stehen. Die
// Welt speist auch das Studio." Berechtigt — und die Begründung dagegen war
// keine. Eine Prämisse trägt Wo/Wann/Wer/Was wie jede andere Quelle; der Weg
// „→ Studio" im Reiter Ideen übergibt seit jeher genau diese vier Felder. Dass
// der Reiter daneben noch Sätze formuliert, macht ihn nicht zu einer anderen
// Art von Quelle.
{
  const vorher = { where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte" };
  // Fest auf die Ideen gestellt, damit die Prüfung nicht auf den Zufall wartet.
  const felder = new Set<string>();
  let leer = 0;
  for (let i = 0; i < 20; i++) {
    const w = wuerfleVierW(vorher, new Set<string>(), "ideen");
    wahr("die Quelle heißt Ideen", /^Ideen/.test(w.quelle));
    for (const f of ["where", "when", "who", "what"] as const) {
      if (!(w.w4[f] || "").trim()) leer++;
      felder.add(w.w4[f]);
    }
    break;   // die Meldung einmal; gezählt wird unten
  }
  for (let i = 0; i < 20; i++) {
    const w = wuerfleVierW(vorher, new Set<string>(), "ideen");
    for (const f of ["where", "when", "who", "what"] as const) {
      if (!(w.w4[f] || "").trim()) leer++;
      felder.add(w.w4[f]);
    }
  }
  ist("eine Prämisse füllt alle vier Felder", leer, 0);
  wahr(`und liefert verschiedene Werte (${felder.size})`, felder.size >= 8);

  // Ein Schloss hält auch hier.
  const zu = new Set(["f-where"]);
  let verschoben = 0;
  for (let i = 0; i < 20; i++) if (wuerfleVierW(vorher, zu, "ideen").w4.where !== vorher.where) verschoben++;
  ist("ein gesperrtes Feld bleibt auch bei den Ideen stehen", verschoben, 0);

  // Und der Plan kennt die Quelle.
  const a = baueAnlage(STAND(), UMGEBUNG({ ideenProfil: "Noir" }));
  ist("die Ideen stehen im Plan", knoten(a, "ideen")?.zustand, "an");
  ist("mit dem eingestellten Profil", knoten(a, "ideen")?.wert, "Noir");
  wahr("und einer Leitung zu den vier W",
    a.kanten.some((k) => k.von === "ideen" && k.nach === "w4"));
  const b = baueAnlage(STAND(), UMGEBUNG({ ideenProfil: "" }));
  ist("ohne eigenes Profil sind sie trotzdem bereit", knoten(b, "ideen")?.zustand, "an");
  wahr("und sagen warum", /eingebautes/.test(knoten(b, "ideen")?.wert || ""));
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
