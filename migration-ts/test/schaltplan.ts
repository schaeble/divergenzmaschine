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
import { baueAnlage, sammleUmgebung, loadAnlage, SCHLOSS_ZU_KNOTEN, QUELLE_ZU_KNOTEN, type AnlageStand, type Umgebung } from "../src/features/schaltplan";
import { mountStudio } from "../src/ui/studio";
import { KNOB_VORGABE, KNOB_SPANNE } from "../src/features/knobs";
import { saveIdeaProfile, loadIdeaProfile, saveIdeaUserPreset, loadIdeaUserPresets, IDEA_PRESETS } from "../src/features/ideaprofile";
import { loadOmniStand } from "../src/features/omnikognition";
import { QUELLE_LABEL } from "../src/features/kontext";
import { mountIdeas } from "../src/ui/ideasView";
import { mountWorld } from "../src/ui/worldView";
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
  dramaVorhanden: false, presetLabel: "Kafka", ideenProfil: "", omniProfile: 8, omniProfil: "", ...u,
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
  // Nur die Zahl vergleichen: Fällt die gewürfelte Form auf „Meldung", hängt
  // seit 4.296.0 ein „(ohne Wirkung)" dahinter — richtig, aber hier nicht Thema.
  wahr("die Länge im Plan ist die gewürfelte",
    (knoten(a, "laenge")?.wert || "").startsWith(w2.regler["lenTarget"] + " Wörter"));
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
  wahr("mit dem eingestellten Profil", /Noir/.test(knoten(a, "ideen")?.wert || ""));
  wahr("und einer Leitung zu den vier W",
    a.kanten.some((k) => k.von === "ideen" && k.nach === "w4"));
  const b = baueAnlage(STAND(), UMGEBUNG({ ideenProfil: "" }));
  ist("ohne eigenes Profil sind sie trotzdem bereit", knoten(b, "ideen")?.zustand, "an");
  ist("und der Plan sagt, dass keines eingestellt ist", knoten(b, "ideen")?.wert, "kein Profil eingestellt");
  wahr("dass gewürfelt wird, steht im Hinweis", /mitgewürfelt/.test(knoten(b, "ideen")?.hinweis || ""));

  // Der eigentliche Einwand: Der Würfel soll würfeln, nicht das Profil nehmen.
  // Gemessen an 300 Zügen: festes Profil 141/126/142/124 verschiedene Werte,
  // gewürfeltes 193/187/213/224.
  //
  // WICHTIG für die Gegenprobe: Es muss ein Profil GESPEICHERT sein. Ohne das
  // fiele auch die alte Fassung auf einen Würfelwurf zurück, und die Prüfung
  // wäre grün, obwohl sie nichts prüft — beim ersten Versuch war sie genau das.
  saveIdeaProfile({
    name: "Fest", genre: "mystery", ton: "duester", protagonist: "einzel", konflikt: "raetsel",
    ort: "urban", zeit: "gegenwart", massstab: "intim", wendung: "enthuellung", fokus: "figur",
    divergenz: 40,
  }, 0);
  const richtungen = new Set<string>();
  for (let i = 0; i < 30; i++) richtungen.add(wuerfleVierW(vorher, new Set<string>(), "ideen").quelle);
  wahr(`das Profil wird mitgewürfelt (${richtungen.size} Richtungen in 30 Zügen)`, richtungen.size >= 8);
}


// ── 14 · Die Wahrnehmung als eigene Quelle ───────────────────────────────
// Gewünscht: „Welt, Omnikognition — ändere die Würfelfunktion auf die
// vorhandenen Presets inkl. eigenem. Dann als eigene Quelle."
//
// Beides gebaut. Der Würfel im Reiter Welt zieht jetzt ein VORHANDENES Profil
// statt zwölf Angaben einzeln auszulosen — das ergab Wesen, die es nicht gibt.
// Und die Wahrnehmung ist eine Quelle wie Welt und Ideen.
//
// Sie liefert mehr als vier Felder: Ein Wesen wahrzunehmen ist eine Haltung.
// „Ein Hai, dritte Person, Fraktur" wäre kein Hai.
{
  const vorher = { where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte" };
  const wesen = new Set<string>();
  let ohneStil = 0, leer = 0;
  for (let i = 0; i < 30; i++) {
    const w = wuerfleVierW(vorher, new Set<string>(), "omni");
    wesen.add(w.quelle);
    if (!w.regler) ohneStil++;
    for (const f of ["where", "who", "what"] as const) if (!(w.w4[f] || "").trim()) leer++;
  }
  wahr(`die Quelle zieht verschiedene Wesen (${wesen.size} in 30 Zügen)`, wesen.size >= 4);
  ist("und liefert immer die Stilregler mit", ohneStil, 0);
  ist("Wo, Wer und Was sind gefüllt", leer, 0);
  const eins = wuerfleVierW(vorher, new Set<string>(), "omni");
  wahr("die Quelle nennt das Wesen beim Namen", /^Wahrnehmung · \S/.test(eins.quelle));
  wahr("der Modus passt zur Wahrnehmung", eins.regler?.["mode"] === "body");
  wahr("und die Gewichtung kommt mit", /^\d\/\d\/\d\/\d$/.test(eins.gewicht || ""));

  // Ein Schloss hält auch hier.
  const zu = new Set(["f-who"]);
  let verschoben = 0;
  for (let i = 0; i < 20; i++) {
    const w = wuerfleVierW(vorher, zu, "omni");
    if (w.w4.who !== vorher.who) verschoben++;
  }
  ist("ein gesperrtes W bleibt auch bei der Wahrnehmung stehen", verschoben, 0);

  // Und der Plan kennt die Quelle.
  const a = baueAnlage(STAND(), UMGEBUNG({ omniProfile: 8, omniProfil: "Hai" }));
  ist("die Wahrnehmung steht im Plan", knoten(a, "omni")?.zustand, "an");
  ist("mit dem eingestellten Wesen", knoten(a, "omni")?.wert, "Hai");
  wahr("und der Zahl der vorhandenen im Hinweis", /8 Wesen vorhanden/.test(knoten(a, "omni")?.hinweis || ""));
  wahr("und einer Leitung zu den vier W", a.kanten.some((k) => k.von === "omni" && k.nach === "w4"));
}


// ── 15 · Der Würfel im Reiter Ideen nimmt das Preset mit ─────────────────
// Befund: „Ideen Reiter, beim Würfeln wird das Preset nicht mitgewürfelt."
// Stimmte — `randomize()` loste die zehn Merkmale einzeln aus und setzte den
// Wähler anschließend fest auf „— eigenes —". Die sieben eingebauten Presets
// und die eigenen Profile kamen dabei NIE vor.
//
// Jetzt entscheidet der Würfel zuerst, woher er nimmt: halb aus dem Bestand,
// halb frei. Beide Wege bleiben, weil beide etwas können, was der andere
// nicht kann.
{
  const dom5 = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
  const G = globalThis as unknown as Record<string, unknown>;
  for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
    "HTMLTextAreaElement", "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node",
    "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob",
    "URL", "FileReader", "Image", "DOMParser"]) {
    try { Object.defineProperty(G, k, { value: (dom5.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
  }
  const km5 = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  Object.defineProperty(G, "matchMedia", { value: km5, writable: true, configurable: true });
  (dom5.window as unknown as Record<string, unknown>)["matchMedia"] = km5;
  (dom5.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};

  // Zwei eigene Profile anlegen — sonst prüft der Lauf nur die eingebauten.
  saveIdeaUserPreset({ ...IDEA_PRESETS["noir"]!, name: "Mein Hafen" });
  saveIdeaUserPreset({ ...IDEA_PRESETS["kafka"]!, name: "Mein Amt" });

  const D5 = dom5.window.document;
  const w5 = D5.createElement("div");
  D5.body.append(w5);
  mountIdeas(w5);

  const sel = w5.querySelector('[id="idea-preset"]') as HTMLSelectElement;
  const felder = ["idea-genre", "idea-ton", "idea-prot", "idea-konf", "idea-ort", "idea-zeit", "idea-mass", "idea-wend", "idea-fok"];
  const stand = (): string => felder.map((f) => (w5.querySelector(`[id="${f}"]`) as HTMLSelectElement).value).join("|");
  const knopf = Array.from(w5.querySelectorAll("button")).find((b) => /Würfeln/.test(b.textContent || "")) as HTMLButtonElement;

  let ausBestand = 0, eigene = 0, frei = 0;
  const komb = new Set<string>();
  for (let i = 0; i < 200; i++) {
    knopf.click();
    const v = sel.value;
    komb.add(stand());
    if (v === "") frei++; else { ausBestand++; if (v.startsWith("user:")) eigene++; }
  }
  wahr(`der Würfel zieht Presets (${ausBestand} von 200)`, ausBestand >= 60);
  wahr(`darunter eigene (${eigene} von 200)`, eigene >= 10);
  wahr(`und würfelt weiter frei (${frei} von 200)`, frei >= 60);
  wahr(`die freie Kombination bleibt breit (${komb.size} verschiedene)`, komb.size >= 60);

  // Der Wähler muss zum Inhalt passen — eine Anzeige, die lügt, wäre schlimmer
  // als keine. Also: Wenn er ein Preset nennt, müssen die Merkmale dessen sein.
  let luegt = 0;
  for (let i = 0; i < 200; i++) {
    knopf.click();
    const v = sel.value;
    if (!v) continue;
    const p = v.startsWith("user:") ? loadIdeaUserPresets()[v] : IDEA_PRESETS[v];
    if (!p) { luegt++; continue; }
    const soll = [p.genre, p.ton, p.protagonist, p.konflikt, p.ort, p.zeit, p.massstab, p.wendung, p.fokus].join("|");
    if (soll !== stand()) luegt++;
  }
  ist("der Wähler zeigt an, woher die Einstellung stammt", luegt, 0);
}


// ── 16 · Ideen und Wahrnehmung stehen nicht mehr fest ────────────────────
// Befund: „In der Diagnose bleiben Ideen und Wahrnehmung fest. Hier soll das
// aktuelle Preset — Würfel — angezeigt werden."
//
// Zwei verschiedene Ursachen unter einer Beobachtung:
//
//   Ideen        Der Knopf „Würfeln" im Reiter schrieb sein Ergebnis nicht in
//                die Ablage, aus der der Plan liest. Gezeigt wurde, was beim
//                ersten Aufbau des Reiters gewürfelt worden war.
//   Wahrnehmung  Der Knoten zeigte „8 Wesen" — die Zahl der VORHANDENEN. Die
//                ändert sich beim Würfeln naturgemäß nie. Das eingestellte
//                Wesen wurde nirgends abgelegt.
//
// Der Prüfstand hängt beide Reiter, würfelt und sieht im Plan nach.
{
  const dom6 = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
  const G = globalThis as unknown as Record<string, unknown>;
  for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
    "HTMLTextAreaElement", "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node",
    "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob",
    "URL", "FileReader", "Image", "DOMParser"]) {
    try { Object.defineProperty(G, k, { value: (dom6.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
  }
  const km6 = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  Object.defineProperty(G, "matchMedia", { value: km6, writable: true, configurable: true });
  (dom6.window as unknown as Record<string, unknown>)["matchMedia"] = km6;
  (dom6.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};
  const D6 = dom6.window.document;

  const wertVon = (id: string): string => {
    const a = baueAnlage(STAND(), sammleUmgebung("kafka"));
    return knoten(a, id)?.wert || "";
  };
  const wuerfelnIn = (root: HTMLElement): HTMLButtonElement =>
    Array.from(root.querySelectorAll("button")).find((b) => /Würfeln/.test(b.textContent || "")) as HTMLButtonElement;

  // --- Ideen ---
  const wI = D6.createElement("div"); D6.body.append(wI); mountIdeas(wI);
  const knopfI = wuerfelnIn(wI);
  const werteI = new Set<string>();
  for (let i = 0; i < 40; i++) { knopfI.click(); werteI.add(wertVon("ideen")); }
  wahr(`der Knoten Ideen folgt dem Würfel (${werteI.size} verschiedene in 40 Würfen)`, werteI.size >= 5);
  wahr("und nennt den Würfel im Hinweis", (baueAnlage(STAND(), sammleUmgebung("kafka")).knoten.find((k) => k.id === "ideen")?.hinweis || "").includes("mitgewürfelt"));

  // --- Wahrnehmung ---
  const wW = D6.createElement("div"); D6.body.append(wW); mountWorld(wW);
  const knopfW = wuerfelnIn(wW);
  const werteW = new Set<string>();
  for (let i = 0; i < 40; i++) { knopfW.click(); werteW.add(wertVon("omni")); }
  wahr(`der Knoten Wahrnehmung folgt dem Würfel (${werteW.size} verschiedene in 40 Würfen)`, werteW.size >= 4);
  wahr("und zeigt kein blankes Zählwerk mehr", [...werteW].every((v) => !/^\d+ Wesen$/.test(v)));
  const nameW = (wW.querySelector('[id="omni-name"]') as HTMLInputElement).value;
  ist(`der gezeigte Name ist der eingestellte („${nameW}")`, wertVon("omni"), nameW);

  // Und der Reiter Welt wirft das eingestellte Wesen beim Reiterwechsel nicht
  // mehr weg — bisher lief `randomize()` bei jedem Aufbau.
  const vorher = (wW.querySelector('[id="omni-name"]') as HTMLInputElement).value;
  const wW2 = D6.createElement("div"); D6.body.append(wW2); mountWorld(wW2);
  ist("ein Reiterwechsel lässt das Wesen stehen", (wW2.querySelector('[id="omni-name"]') as HTMLInputElement).value, vorher);
}


// ── 17 · Der Plan zeigt, was DIESEN Wurf gespeist hat ────────────────────
// Gefragt: „Warum ändert sich beim Alles Würfeln in der Diagnose die Idee und
// die Wahrnehmung nicht?"
//
// Weil beide Knoten zeigen, was im REITER eingestellt ist, und der Würfel sein
// Profil nur für den einen Wurf zieht, ohne es zurückzuschreiben — „der Würfel
// wählt, er füllt nicht". Gemessen an 60 Klicks: die vier W bewegten sich
// 56-mal, die beiden Knoten kein einziges Mal. Beides für sich richtig, aber
// der Plan verschwieg damit die Hälfte: Das eingestellte Profil stand neben
// vier W, die aus einem ganz anderen stammten.
//
// Der Wurf schreibt jetzt seine Quelle mit in die Ablage, und der speisende
// Knoten trägt sie. Die Reiter bleiben unangetastet.
{
  const dom7 = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
  const G = globalThis as unknown as Record<string, unknown>;
  for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
    "HTMLTextAreaElement", "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node",
    "getComputedStyle", "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob",
    "URL", "FileReader", "Image", "DOMParser"]) {
    try { Object.defineProperty(G, k, { value: (dom7.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* da */ }
  }
  const km7 = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
  Object.defineProperty(G, "matchMedia", { value: km7, writable: true, configurable: true });
  (dom7.window as unknown as Record<string, unknown>)["matchMedia"] = km7;
  (dom7.window.Element.prototype as unknown as Record<string, unknown>)["scrollIntoView"] = function (): void {};
  const D7 = dom7.window.document;

  const wS = D7.createElement("div"); D7.body.append(wS); mountStudio(wS);
  const wD = D7.createElement("div"); D7.body.append(wD); mountDiagnose(wD);
  const knopf = Array.from(wD.querySelectorAll("button")).find((b) => /Alles würfeln/.test(b.textContent || "")) as HTMLButtonElement;
  const plan = (): ReturnType<typeof baueAnlage> => baueAnlage(loadAnlage()!, sammleUmgebung("kafka"));

  const werteI = new Set<string>(), werteO = new Set<string>();
  let genauEiner = 0, mitLeitung = 0;
  for (let i = 0; i < 60; i++) {
    knopf.click();
    const a = plan();
    werteI.add(a.knoten.find((k) => k.id === "ideen")?.wert || "");
    werteO.add(a.knoten.find((k) => k.id === "omni")?.wert || "");
    const gespeist = a.knoten.filter((k) => /dieser Wurf/.test(k.wert));
    if (gespeist.length === 1) genauEiner++;
    const q = gespeist[0];
    if (q && a.kanten.some((k) => k.von === q.id && k.nach === "w4" && k.zustand === "an")) mitLeitung++;
  }
  ist("bei jedem Wurf ist genau ein Knoten die Quelle", genauEiner, 60);
  ist("und seine Leitung zu den vier W liegt an", mitLeitung, 60);
  wahr(`der Knoten Ideen bewegt sich mit (${werteI.size} verschiedene in 60 Würfen)`, werteI.size >= 5);
  wahr(`der Knoten Wahrnehmung bewegt sich mit (${werteO.size} verschiedene in 60 Würfen)`, werteO.size >= 4);

  // Die Regel bleibt: Der Würfel wählt, er füllt nicht. Was der Wurf zieht,
  // darf die Einstellung des Reiters NICHT überschreiben.
  const vorherI = JSON.stringify(loadIdeaProfile());
  const vorherO = JSON.stringify(loadOmniStand());
  for (let i = 0; i < 20; i++) knopf.click();
  ist("der Wurf lässt das eingestellte Ideen-Profil stehen", JSON.stringify(loadIdeaProfile()), vorherI);
  ist("und das eingestellte Wesen ebenso", JSON.stringify(loadOmniStand()), vorherO);

  // Jede Quellenbezeichnung des Würfels muss einen Knoten treffen — sonst
  // fällt ein Wurf stumm unter den Tisch. Dieselbe Fehlerart wie beim
  // vergessenen Schloss: Wer eine Quelle hinzufügt, denkt nicht an den Plan.
  const ohneKnoten = Object.values(QUELLE_LABEL).filter((l) => !QUELLE_ZU_KNOTEN[l]);
  ist("jede Quelle des Würfels hat einen Knoten", ohneKnoten.join(","), "");
  const K0 = baueAnlage(STAND(), UMGEBUNG()).knoten.map((k) => k.id);
  const falsch = Object.entries(QUELLE_ZU_KNOTEN).filter(([, id]) => !K0.includes(id)).map(([l]) => l);
  ist("und jeder benannte Knoten gibt es auch", falsch.join(","), "");
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
