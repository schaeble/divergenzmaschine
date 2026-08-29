// Ein Preset aus einem Text — für die Wortbank.
//
// Gewünscht: Aus einem Text von 300–400 Wörtern soll ein Preset entstehen.
// Die Maschine liest den Text, zerlegt ihn in Teilstücke (Sätze, und an
// Semikolon und Gedankenstrich noch einmal geteilt) und sortiert jedes
// Teilstück in die sieben Kategorien der Wortbank — nach denselben Merkmalen,
// mit denen der Assembler Atome typisiert:
//
//   props      Nominalphrase, kurz (bis fünf Wörter): ein greifbares Ding.
//   motifs     Nominalphrase, länger: ein Bild.
//   obstacles  Hauptsatz mit Widerstand (aber, doch, kein, nicht, niemand,
//              fehlt, scheitert, reicht nicht, bleibt aus).
//   turns      Hauptsatz mit Wende (dann, plötzlich, kippt, beginnt, bricht,
//              verwandelt, wendet, auf einmal).
//   stakes     Hauptsatz über das, was auf dem Spiel steht (es geht um,
//              entscheidet, zählt, Einsatz, auf dem Spiel, gehört).
//   endings    die letzten Hauptsätze des Textes — dort endet er ja.
//   hooks      die übrigen kurzen Hauptsätze: Sätze mit Haken.
//
// Jede Kategorie, die leer bliebe, borgt sich aus der vollsten — ein Preset
// mit leeren Listen würgt den Zusammenbau ab (Prüfstand Struktur). Duplikate
// fallen weg, Überlanges (mehr als 22 Wörter) auch: Das sind keine Atome.
import type { Bank, BankKey } from "../types";
import type { DramaData } from "../generation/dramaturgie";
import { deriveAtom } from "../atoms/derive";
import { clean } from "../text-utils";

const KATEGORIEN: BankKey[] = ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"];

const WIDERSTAND = /\b(aber|doch|kein|keine|keinen|nicht|niemand|nichts|nie|niemals|fehlt|fehlen|scheitert|verweigert|bleibt aus|reicht nicht|zu spät|vergebens|umsonst)\b/i;
const WENDE = /^(dann|plötzlich|auf einmal|mit einem mal|seitdem|von da an)\b|\b(kippt|kippen|beginnt|beginnen|bricht|brechen|verwandelt|wendet|ändert|dreht sich|wird zu|wechselt)\b/i;
const SPIEL = /\b(es geht um|auf dem spiel|einsatz|entscheidet|entscheiden|zählt|zählen|gehört|gilt|bedeutet|kostet|verliert|gewinnt)\b/i;

/** Teilstücke: Sätze, an Semikolon und Gedankenstrich weiter geteilt. */
export function teilstuecke(text: string): string[] {
  return (text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?…])\s+/)
    .flatMap((s) => s.split(/\s*[;—–]\s*/))
    .map((s) => clean(s).replace(/^[„"«»]+|[.!?…„"«»]+$/g, "").trim())
    .filter((s) => {
      const w = s.split(/\s+/).filter(Boolean).length;
      return w >= 3 && w <= 22;
    });
}

/** Eine Kategorie für ein Teilstück — die Regeln aus dem Kopfkommentar. */
export function kategorieFuer(stueck: string, istSchluss: boolean): BankKey {
  const typ = deriveAtom(stueck).typ;
  const wc = stueck.split(/\s+/).filter(Boolean).length;
  if (typ === "nominalphrase") return wc <= 5 ? "props" : "motifs";
  if (typ !== "hauptsatz") return "motifs";
  if (istSchluss) return "endings";
  if (WIDERSTAND.test(stueck)) return "obstacles";
  if (WENDE.test(stueck)) return "turns";
  if (SPIEL.test(stueck)) return "stakes";
  return wc <= 14 ? "hooks" : "motifs";
}

export interface PresetAusText { bank: Bank; woerter: number; stuecke: number; }

/** Das Preset aus einem Text. Leere Kategorien borgen aus der vollsten. */
export function presetAusText(text: string): PresetAusText {
  const stuecke = teilstuecke(text);
  const bank: Bank = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] };
  const schlussGrenze = Math.max(0, stuecke.length - 2);
  const gesehen = new Set<string>();
  stuecke.forEach((s, i) => {
    const key = s.toLowerCase();
    if (gesehen.has(key)) return;
    gesehen.add(key);
    bank[kategorieFuer(s, i >= schlussGrenze && deriveAtom(s).typ === "hauptsatz")].push(s);
  });
  // Leere Kategorien borgen aus der vollsten — hinten, damit das Beste vorn bleibt.
  for (const k of KATEGORIEN) {
    if (bank[k].length) continue;
    const vollste = KATEGORIEN.filter((x) => bank[x].length > 1).sort((a, b) => bank[b].length - bank[a].length)[0];
    if (vollste) bank[k].push(bank[vollste].pop()!);
  }
  const woerter = (text || "").split(/\s+/).filter(Boolean).length;
  // stuecke zählt, was WIRKLICH im Preset landet — Duplikate sind schon weg.
  return { bank, woerter, stuecke: gesehen.size };
}

// ── Preset 2.0 aus dem Text ─────────────────────────────────────────────────
// Gewünscht: Der eingegebene Text soll den Preset-2.0-Anforderungen
// entsprechen. Ein Preset 2.0 trägt neben den sieben Generator-Listen einen
// dramaturgischen Bogen und Kontext-Material für die lebendigen Pools. Beides
// lässt sich aus demselben Text ableiten — mit denselben Teilstücken, an den
// Stellen, an die sie im Bogen gehören:
//
//   einstieg      die ersten Haken-Sätze — dort beginnt der Text.
//   mitte         die Bilder: Nominalphrasen tragen die Mitte.
//   hoehepunkt    die Wenden (nach „Und dann:" gebaut).
//   schluss       die Schlüsse.
//   ausloeser     die Requisiten (nach „Dann, unvermittelt:" gebaut).
//   veraenderungen die Wenden als Klauseln.
//   konflikte     nur, was sicher eine Nominalphrase ist: aus „Es geht um X"
//                 wird X gezogen; sonst bleibt die Liste leer — die
//                 Dramaturgie überspringt leere Listen, ein falscher Kasus
//                 stünde dagegen im Text.
//   zeitanomalien, regeln: leer — dafür gibt der Text nichts Sicheres her.
//
// pools: alle Nominalphrasen (Requisiten und Bilder) — das Kontext-Material,
// das sonst aus Orten, Figuren und Objekten eines 2.0-Presets käme.
export interface Preset2AusText extends PresetAusText { drama: DramaData; pools: string[]; }

export function preset2AusText(text: string): Preset2AusText {
  const p = presetAusText(text);
  const b = p.bank;
  const konflikte = [...b.stakes, ...b.hooks]
    .map((s) => (s.match(/\bes geht um\s+(.{3,60})$/i) || [])[1])
    .filter((x): x is string => !!x);
  const drama: DramaData = {
    einstieg: b.hooks.slice(0, 3),
    mitte: b.motifs.slice(0, 4),
    hoehepunkt: b.turns.slice(0, 2),
    schluss: b.endings.slice(0, 3),
    ausloeser: b.props.slice(0, 5),
    veraenderungen: b.turns.slice(0, 4),
    konflikte: konflikte.slice(0, 5),
    zeitanomalien: [],
    regeln: [],
  };
  const pools = [...new Set([...b.props, ...b.motifs])];
  return { ...p, drama, pools };
}
