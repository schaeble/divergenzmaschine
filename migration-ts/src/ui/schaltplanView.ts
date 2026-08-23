// Der Schaltplan als SVG.
//
// Warum SVG und nicht HTML mit Rahmen: Die Linien zwischen den Feldern brauchen
// Koordinaten. Ein CSS-Gitter kennt seine Maße erst nach dem Layout, und im
// Prüfstand (jsdom) rechnet niemand ein Layout — der Plan wäre dort nicht
// prüfbar. Hier werden alle Maße im Code bestimmt: Derselbe Zustand ergibt
// dieselben Koordinaten, mit und ohne Browser.
import type { Anlage, Zustand } from "../features/schaltplan";

const NS = "http://www.w3.org/2000/svg";
const CHIP_W = 176, CHIP_H = 46, GAP_X = 12, GAP_Y = 10, PRO_REIHE = 5, RAND = 18;
const BAND_TITEL = 26, BAND_ABSTAND = 34;
const BREITE = RAND * 2 + PRO_REIHE * CHIP_W + (PRO_REIHE - 1) * GAP_X;

export const BAND_NAME = ["Vorräte", "Material", "Steuerung", "Schliff", "Ausgabe"];

/** Jeder Zustand trägt ein eigenes Zeichen — ein voller Kreis wirkt, ein
 *  leerer ist aus, ein Dreieck läuft ins Leere. Zusammen mit Strichstärke und
 *  Strichart sind das drei Merkmale neben der Farbe. */
const ZEICHEN: Record<Zustand, string> = { an: "\u25CF", leer: "\u25B2", aus: "\u25CB", fest: "\u25CB" };

const FARBE: Record<Zustand, string> = {
  an: "var(--acc2)", leer: "var(--danger)", aus: "var(--muted)", fest: "var(--muted)",
};

const e = (name: string, attrs: Record<string, string | number>, ...kinder: Element[]): SVGElement => {
  const n = document.createElementNS(NS, name) as SVGElement;
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, String(v));
  for (const c of kinder) n.append(c);
  return n;
};
const txt = (x: number, y: number, s: string, cls: string): SVGElement => {
  const t = e("text", { x, y, class: cls });
  t.textContent = s;
  return t;
};
/** Zu lange Beschriftungen kürzen: SVG bricht keinen Text um. */
const kurz = (s: string, n: number): string => (s.length <= n ? s : s.slice(0, n - 1) + "…");

export interface Platz { x: number; y: number; w: number; h: number }

/** Die Anordnung — als eigene Funktion, damit der Prüfstand sie ohne Zeichnen
 *  nachrechnen kann (keine Überlappungen, jedes Band unter dem vorigen). */
export function ordne(anlage: Anlage): { platz: Record<string, Platz>; hoehe: number; baender: { band: number; y: number; h: number }[] } {
  const platz: Record<string, Platz> = {};
  const baender: { band: number; y: number; h: number }[] = [];
  let y = RAND;
  for (let b = 0; b < BAND_NAME.length; b++) {
    const drin = anlage.knoten.filter((k) => k.band === b);
    if (!drin.length) continue;
    const kopf = y;
    y += BAND_TITEL;
    drin.forEach((k, i) => {
      const reihe = Math.floor(i / PRO_REIHE), spalte = i % PRO_REIHE;
      platz[k.id] = { x: RAND + spalte * (CHIP_W + GAP_X), y: y + reihe * (CHIP_H + GAP_Y), w: CHIP_W, h: CHIP_H };
    });
    const reihen = Math.ceil(drin.length / PRO_REIHE);
    y += reihen * CHIP_H + (reihen - 1) * GAP_Y;
    baender.push({ band: b, y: kopf, h: y - kopf });
    y += BAND_ABSTAND;
  }
  return { platz, hoehe: y - BAND_ABSTAND + RAND, baender };
}

export function renderSchaltplan(anlage: Anlage): SVGElement {
  const { platz, hoehe, baender } = ordne(anlage);
  const svg = e("svg", {
    class: "schaltplan", viewBox: `0 0 ${BREITE} ${hoehe}`,
    width: "100%", role: "img", "aria-label": "Schaltplan der aktiven Einstellungen",
  });

  // Sammelschiene: der Fluss von Band zu Band. Eine Linie statt sechzig.
  for (let i = 0; i + 1 < baender.length; i++) {
    const a = baender[i]!, b = baender[i + 1]!;
    const y1 = a.y + a.h, y2 = b.y;
    svg.append(e("line", { x1: BREITE / 2, y1, x2: BREITE / 2, y2, class: "sp-bus" }));
    svg.append(e("polygon", {
      points: `${BREITE / 2 - 5},${y2 - 8} ${BREITE / 2 + 5},${y2 - 8} ${BREITE / 2},${y2}`, class: "sp-bus-spitze",
    }));
  }

  // Bandtitel
  for (const b of baender) svg.append(txt(RAND, b.y + 14, BAND_NAME[b.band] || "", "sp-band"));

  // Einzelleitungen: nur die, die tot sein können
  for (const k of anlage.kanten) {
    const a = platz[k.von], z = platz[k.nach];
    if (!a || !z) continue;
    const x1 = a.x + a.w / 2, y1 = a.y + a.h, x2 = z.x + z.w / 2, y2 = z.y;
    const m = (y1 + y2) / 2;
    svg.append(e("path", {
      d: `M ${x1} ${y1} C ${x1} ${m}, ${x2} ${m}, ${x2} ${y2}`,
      class: "sp-kante", stroke: FARBE[k.zustand],
      "stroke-dasharray": k.zustand === "aus" ? "4 4" : k.zustand === "leer" ? "7 4" : "0",
    }));
  }

  // Die Felder
  for (const k of anlage.knoten) {
    const p = platz[k.id];
    if (!p) continue;
    const g = e("g", { class: "sp-chip sp-" + k.zustand });
    if (k.hinweis) { const t = e("title", {}); t.textContent = k.hinweis; g.append(t); }
    g.append(e("rect", { x: p.x, y: p.y, width: p.w, height: p.h, rx: 8, stroke: FARBE[k.zustand] }));
    // Ein Zeichen VOR der Beschriftung. Farbe allein trug den Unterschied nicht
    // (gemeldet: „die aktiven Rahmen sind schlecht unterscheidbar"), und ein
    // Plan, der nur über Farbe spricht, ist für einen Teil der Leser stumm.
    const zeichen = e("text", { x: p.x + 10, y: p.y + 18, class: "sp-zeichen", fill: FARBE[k.zustand] });
    zeichen.textContent = ZEICHEN[k.zustand];
    g.append(zeichen);
    g.append(txt(p.x + 24, p.y + 18, kurz(k.label, 21), "sp-label"));
    g.append(txt(p.x + 24, p.y + 34, kurz(k.wert, 24), "sp-wert"));
    if (k.gesperrt) g.append(txt(p.x + p.w - 14, p.y + 18, "\u{1F512}", "sp-schloss"));
    svg.append(g);
  }
  return svg;
}

/** Die Befunde als Liste — der Teil, den man liest, wenn man nicht zeichnen will. */
export function befundListe(anlage: Anlage): { text: string; leer: number } {
  const leer = anlage.knoten.filter((k) => k.zustand === "leer");
  return {
    leer: leer.length,
    text: leer.length ? leer.map((k) => `${k.label}: ${k.hinweis || "Quelle leer"}`).join(" · ")
      : "Kein Schalter läuft ins Leere.",
  };
}
