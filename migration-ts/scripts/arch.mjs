// Erzeugt die Architekturgrafik der Hilfe.
//
// Als SKRIPT und nicht von Hand: Die Grafik ist ein einziger langer
// SVG-String, und jede Verschiebung zieht ein Dutzend Koordinaten nach sich.
// Von Hand gepflegt veraltet sie genau so, wie sie es getan hat — sie zeigte
// noch die „Montage", die seit 4.239.0 durch die Bildwelt ersetzt ist, und
// kannte weder Sammler noch Autopilot noch Zeitungsseite.
//
// Aufruf: node scripts/arch.mjs  → schreibt src/ui/arch.svg.txt
import { writeFileSync } from "fs";

const B = 1040;                       // Blattbreite
const GRUEN = "#33a894", GRUEN_F = "#ddf3ed", GRUEN_T = "#0f4a41";
const LILA = "#8b5cf6", LILA_F = "#eae4fb", LILA_T = "#372a6b";
const GOLD = "#d7a531";
const GRAU = "#59616f", GRAU_T = "#4a5262", KOPF_T = "#333c4c";

const teile = [];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Ein Kasten mit Titel, Unterzeile und farbiger Kante links. */
function kasten(x, y, w, h, titel, zeilen, gruen, ki = false) {
  const f = gruen ? GRUEN_F : LILA_F, s = gruen ? GRUEN : LILA, t = gruen ? GRUEN_T : LILA_T;
  teile.push(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${f}" stroke="${s}" stroke-width="1.6"/>`);
  teile.push(`<rect x="${x}" y="${y}" width="6" height="${h}" rx="3" fill="${s}"/>`);
  const m = x + w / 2;
  teile.push(`<text x="${m}" y="${y + 24}" text-anchor="middle" font-size="15" font-weight="700" fill="${t}">${esc(titel)}</text>`);
  zeilen.forEach((z, i) => {
    teile.push(`<text x="${m}" y="${y + 43 + i * 17}" text-anchor="middle" font-size="11.5" fill="#414b5a">${esc(z)}</text>`);
  });
  if (ki) {
    teile.push(`<rect x="${x + w - 42}" y="${y + 10}" width="32" height="19" rx="9.5" fill="#f4c250" stroke="${GOLD}"/>`);
    teile.push(`<text x="${x + w - 26}" y="${y + 23.5}" text-anchor="middle" font-size="11" font-weight="700" fill="#4a3600">KI</text>`);
  }
}

function bandKopf(y, text) {
  teile.push(`<text x="28" y="${y}" font-size="12.5" font-weight="700" letter-spacing="0.06em" fill="${KOPF_T}">${esc(text)}</text>`);
}

function pfeil(x, y1, y2, beschriftung) {
  teile.push(`<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2 - 8}" stroke="${GRAU}" stroke-width="2"/>`);
  teile.push(`<path d="M${x - 5},${y2 - 9} L${x},${y2} L${x + 5},${y2 - 9} Z" fill="${GRAU}"/>`);
  if (beschriftung) {
    teile.push(`<text x="${x + 16}" y="${(y1 + y2) / 2}" font-size="12" font-style="italic" fill="${GRAU_T}">${esc(beschriftung)}</text>`);
  }
}

/** Verteilt n Kaesten gleichmaessig ueber die Breite. */
function reihe(y, h, eintraege, gruen) {
  const rand = 28, luecke = 15;
  const w = (B - 2 * rand - luecke * (eintraege.length - 1)) / eintraege.length;
  eintraege.forEach((e, i) => {
    kasten(rand + i * (w + luecke), y, w, h, e[0], e[1], gruen, e[2] === "ki");
  });
  return y + h;
}

// ── Kopfleiste ──────────────────────────────────────────────────────────────
// Der Rahmen wird ZULETZT gesetzt und aus der tatsaechlichen Hoehe gerechnet.
// Fest eingetragen war er beim ersten Wurf 878 hoch, der Inhalt 926 — die
// Fussnote stand ausserhalb. Ein Rahmen, den man von Hand nachzieht, passt
// genau so lange, bis jemand eine Zeile einfuegt.
const rahmenPlatz = teile.length;
teile.push("");
const legende = [[46, GRUEN, "Gedächtnis & Material"], [320, LILA, "Erzeugen & Verarbeiten"], [610, GOLD, "KI-gestützt (kostet Guthaben)"]];
for (const [cx, farbe, txt] of legende) {
  teile.push(`<circle cx="${cx}" cy="28" r="6" fill="${farbe}"/>`);
  teile.push(`<text x="${cx + 12}" y="32" font-size="13" fill="#1d2430">${esc(txt)}</text>`);
}
teile.push(`<text x="520" y="58" text-anchor="middle" font-size="13.5" font-weight="600" fill="#2f9e44">↻ Selbstfütterung → Korpus + Pools (Gewicht ×3 / ×2 / ×1)</text>`);

// ── ① Gedächtnis & Material ─────────────────────────────────────────────────
bandKopf(92, "① GEDÄCHTNIS & MATERIAL");
let y = reihe(104, 66, [
  ["4W-Kontext", ["Wo·Wann·Wer·Was"]],
  ["Wortbank", ["Presets · Register"]],
  ["Korpus", ["Markov-Modell"]],
  ["Lebendige Pools", ["Motiv-Gedächtnis"]],
  ["Schatzkammer", ["kuratiertes Archiv"]],
], true);

// ── ② Zufuhr von außen ──────────────────────────────────────────────────────
// Eigenes Band, weil diese vier NICHT erzeugen, sondern Material hereinholen —
// und weil zwei davon Geld kosten. Das war in der alten Grafik nirgends zu
// sehen; der Sammler fehlte ganz.
bandKopf(y + 32, "② ZUFUHR VON AUSSEN");
y = reihe(y + 44, 66, [
  ["Sammler", ["Tagesfeed · Bilder · Abschrift"], "ki"],
  ["Bildwelt", ["Wortbänke aus Fotos"], "ki"],
  ["Themenpool", ["Wikidata"]],
  ["Erzählerbank", ["eigene Texte"]],
], true);
pfeil(510.5, y + 4, y + 32, "Markov: Aus / Mix / Stark · 0–40 %");

// ── ③ Erzeugen ──────────────────────────────────────────────────────────────
bandKopf(y + 60, "③ ERZEUGEN");
const yE = y + 72;
kasten(28, yE + 13, 181, 66, "Ideen", ["Prämissen · Assoz."], false);
kasten(812, yE + 13, 181, 66, "Welt", ["Omnikognition"], false);
kasten(224, yE, 573, 92, "STUDIO", [
  "Einfacher Kopf: Form · Wovon · Länge · Reibung",
  "Reglerkasten: Struktur · Ton · Perspektive · Rhythmus · Markov · Varianz …",
], false);
y = yE + 92;
pfeil(510.5, y + 4, y + 30, "Rohtext");

// ── ④ Auswählen ─────────────────────────────────────────────────────────────
bandKopf(y + 58, "④ AUSWÄHLEN — Test & Ranking");
kasten(28, y + 68, B - 56, 66, "Ranking / Bestenauslese",
  ["Qualität + Novelty + Überraschung + Grammatik + Constraints"], false);
y = y + 134;
pfeil(510.5, y + 4, y + 30, "beste Variante");

// ── ⑤ Ausarbeiten ───────────────────────────────────────────────────────────
// Die „Montage" stand hier bis 4.239.0 und ist durch die Bildwelt ersetzt —
// die aber Material liefert und deshalb oben steht. An ihre Stelle tritt der
// KI-Lehrer, der schon lange da ist und in der Grafik nie vorkam.
bandKopf(y + 58, "⑤ AUSARBEITEN");
y = reihe(y + 68, 86, [
  ["Werkstatt", ["Gerüst → Rohfassung → Politur", "Erzählbögen · Grammatik-Pass"], "ki"],
  ["KI-Lehrer", ["Grammatik · Plot · Gedicht · Prosa", "Änderungen markiert · Kostenkonto"], "ki"],
], false);
pfeil(510.5, y + 4, y + 30, "");

// ── ⑥ Ausgeben ──────────────────────────────────────────────────────────────
bandKopf(y + 58, "⑥ AUSGEBEN");
y = reihe(y + 68, 66, [
  ["★ Merken", ["→ Schatzkammer"]],
  ["Zeitungsseite", ["Satz · Umbruch · Füller · PDF"]],
  ["Layout", ["ganze Ausgabe auf einen Druck"]],
], false);

// ── Selbstfütterung ─────────────────────────────────────────────────────────
// Die gestrichelte Rueckleitung: Was gemerkt wird, faellt in Korpus und Pools
// zurueck. Sie ist der Grund, warum diese Maschine sich mit der Zeit
// veraendert — deshalb steht sie in der Legende ganz oben.
teile.push(`<path d="M120,${y + 4} H14 V116 H24" fill="none" stroke="#2f9e44" stroke-width="2" stroke-dasharray="7 5"/>`);
teile.push(`<path d="M25,111 L15,116 L25,121 Z" fill="#2f9e44"/>`);

// ── Fußnote: was mitläuft, ohne im Fluss zu stehen ──────────────────────────
teile.push(`<text x="520" y="${y + 44}" text-anchor="middle" font-size="12" font-style="italic" fill="${GRAU_T}">`
  + `Ständig mit: Textindex (schreibt jeden Text mit) · Diagnose (Schaltplan · Wirkungsmesser · Selbsttest · Nutzung)</text>`);

teile[rahmenPlatz] = `<rect x="1" y="1" width="${B - 2}" height="${y + 58}" rx="18" `
  + `fill="#fbfaf6" stroke="#dcd7cc" stroke-width="1.4"/>`;

const svg = `<svg viewBox="0 0 ${B} ${y + 60}" xmlns="http://www.w3.org/2000/svg" `
  + `font-family="Segoe UI, Helvetica, Arial, sans-serif">${teile.join("")}</svg>`;
writeFileSync("src/ui/arch.svg.txt", svg);
console.log(`arch.svg.txt geschrieben — ${svg.length} Zeichen, Höhe ${y + 60}`);
