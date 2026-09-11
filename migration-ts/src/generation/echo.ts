// Kernbilder mit Echo (4.360.0) — Schritt 3 der Bogen-Spannung.
//
// Aus dem Blatt „Sonnenaufgang in Weilheim": Zwei Bilder desselben Kerns
// standen zufällig richtig — „Im Spiegel bewegt sich etwas eine Sekunde zu
// spät" und später „Der Spiegel zeigt eine Bewegung, die niemand im Raum
// macht". Das zweite überbietet das erste; so bauen sich Bilder auf. Hier
// wird das gewollt: Aus der ersten Hälfte des Textes werden bis zu zwei
// KERNBILDER gewählt — Sätze mit einem Kernwort (großgeschriebenes Nomen ab
// fünf Buchstaben), zu dem das Preset ein zweites, anderes Bild hat. Dieses
// zweite Bild wird als ECHO vor den Höhepunkt gesetzt: dasselbe Nomen, ein
// stärkerer Satz (der längere, oder einer mit Steigerungswort — niemand,
// nicht, kein, mehr, noch, zweimal). Kernbild und Echo liegen mindestens drei
// Sätze auseinander; ein Echo steht nie im Schluss. Kennt der Bogen seinen
// Höhepunkt-Satz, kommt das Echo unmittelbar davor; sonst bei drei Vierteln
// der Länge. Die Motivverwandlungen greifen später ohnehin, wenn das Nomen
// wiederkehrt — das Echo liefert ihnen die Wiederkehr.
import type { Bank } from "../types";
import { splitSentences } from "../text-utils";
import { loadDramaData } from "./dramaturgie";
import { zaehle } from "../features/waechterStatistik";

const FUNKTION = /^(Aber|Auch|Dann|Denn|Doch|Und|Oder|Wenn|Weil|Nur|Noch|Schon|Jetzt|Heute|Morgen|Gestern|Hier|Dort|Alles|Nichts|Etwas|Jemand|Niemand|Später|Zuletzt|Danach|Vorher|Plötzlich|Manchmal|Immer|Nie|Fast|Kaum|Einmal|Zweimal|Bald|Erst|Sofort|Zuerst|Endlich|Draußen|Drinnen|Oben|Unten|Vielleicht|Irgendwo|Irgendwann)$/;
const STEIGERUNG = /\b(niemand|nicht|kein|keine|keinen|mehr|noch|zweimal|jedes Mal|immer|nie|zu spät|zu früh|schneller|langsamer|weiter|tiefer|höher)\b/i;

/** Kernwörter eines Satzes: großgeschriebene Nomen ab fünf Buchstaben, nicht am
 *  Satzanfang, als Fünf-Buchstaben-Stamm. */
export function kernwoerter(satz: string): Set<string> {
  const out = new Set<string>();
  const woerter = satz.split(/\s+/);
  woerter.forEach((w, i) => {
    const m = w.match(/^[„»(]?([A-ZÄÖÜ][a-zäöüß]{4,})/);
    if (!m) return;
    if (i === 0 || FUNKTION.test(m[1]!)) return;
    out.add(m[1]!.toLowerCase().slice(0, 5));
  });
  return out;
}

const norm = (s: string): string => s.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();

export interface EchoErgebnis { text: string; echos: { kern: string; kernbild: string; echo: string; position: number }[] }

/** Setzt bis zu zwei Echos. Verändert den Text nicht, wenn er zu kurz ist
 *  (unter acht Sätzen) oder kein Kernbild ein zweites Bild im Preset hat. */
export function setzeEchos(text: string, bank: Bank, maxEchos = 2): EchoErgebnis {
  const saetze = splitSentences(text.replace(/\n\n+/g, " "));
  const n = saetze.length;
  if (n < 8) return { text, echos: [] };
  const drinnen = new Set(saetze.map(norm));
  const vorrat = [...(bank.motifs || []), ...(bank.hooks || []), ...(bank.turns || [])].map((x) => x.trim()).filter((x) => x && !drinnen.has(norm(x)));
  // Vorrat je Kernwort.
  const jeKern = new Map<string, string[]>();
  for (const v of vorrat) for (const k of kernwoerter(" " + v)) { const l = jeKern.get(k) || []; l.push(v); jeKern.set(k, l); }

  // Höhepunkt: der Satz des Bogens, wenn er im Text steht; sonst drei Viertel.
  const bogen = loadDramaData();
  let hoch = Math.floor(n * 0.75);
  if (bogen && bogen.hoehepunkt?.length) {
    const hp = bogen.hoehepunkt.map(norm).filter(Boolean);
    const idx = saetze.findIndex((s) => hp.some((h) => h && norm(s).includes(h.slice(0, Math.min(40, h.length)))));
    if (idx >= 3) hoch = idx;
  }
  // Schluss-Zone: nie ein Echo in die letzten zwei Sätze.
  const schlussAb = Math.max(hoch, n - 2);

  // Kernbilder aus der ersten Hälfte, die ein zweites Bild im Preset haben.
  const kandidaten: { i: number; kern: string; echo: string }[] = [];
  const genutzt = new Set<string>();
  for (let i = 1; i < Math.floor(n / 2); i++) {
    for (const k of kernwoerter(saetze[i]!)) {
      if (genutzt.has(k)) continue;
      const l = (jeKern.get(k) || []).filter((v) => !genutzt.has(norm(v)));
      if (!l.length) continue;
      // Der stärkere Satz: Steigerungswort zuerst, dann der längere.
      const sorted = [...l].sort((a, b) => (Number(STEIGERUNG.test(b)) - Number(STEIGERUNG.test(a))) || (b.split(/\s+/).length - a.split(/\s+/).length));
      kandidaten.push({ i, kern: k, echo: sorted[0]! });
      genutzt.add(k); genutzt.add(norm(sorted[0]!));
      break;
    }
  }
  if (!kandidaten.length) return { text, echos: [] };
  // Bis zu zwei: das früheste und eines aus der Mitte.
  const gewaehlt = kandidaten.length <= maxEchos ? kandidaten : [kandidaten[0]!, kandidaten[Math.floor(kandidaten.length / 2)]!].filter((x, i, a) => a.indexOf(x) === i);
  const out = [...saetze];
  const echos: EchoErgebnis["echos"] = [];
  let pos = Math.min(hoch, schlussAb);
  for (const g of gewaehlt) {
    if (pos - g.i < 3) continue;                       // Kernbild und Echo mindestens drei Sätze auseinander
    let e = g.echo.trim().replace(/^[a-z]/, (c) => c.toUpperCase());
    if (!/[.!?…]$/.test(e)) e += ".";
    out.splice(pos, 0, e);
    echos.push({ kern: g.kern, kernbild: saetze[g.i]!, echo: e, position: pos });
    zaehle("echoGesetzt", `${saetze[g.i]!.slice(0, 50)} → ${e.slice(0, 60)}`);
    pos = Math.max(g.i + 3, pos - 2);                  // das zweite Echo etwas früher
  }
  return { text: out.join(" "), echos };
}
