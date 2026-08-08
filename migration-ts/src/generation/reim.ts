// Reim (Paarreim AABB) — 1:1 aus dem Original portiert, mit kuratierten
// Reimgruppen und Schlussformeln (echte Reime, nicht nur Zeilenumbrüche).
import { pick, splitSentences } from "../text-utils";
import { normalizeNewlines, capLine, insertStanzasByTheme, stripDanglingTail, reimShuffle, reimDedupePhrases } from "./verselib";
import type { RhymeGroup } from "./reim.data";
import { REIM_GROUPS, REIM_TAILS, REIM_RHYTHM_TARGETS, REIM_CONNECTORS, REIM_DEFAULTS } from "./reim.data";


// Verszeile: erster Buchstabe groß (die Phrasen stammen aus Satzmitten) und
// verwaiste Anführungszeichen entfernen, die beim Zerlegen entstehen.
function verseLine(s: string): string {
  let t = capLine(s);
  const q = (t.match(/["„“”]/g) || []).length;
  if (q % 2 === 1) t = t.replace(/["„“”]/g, "");
  t = t.replace(/^[\s"„“”'’]+/, "");
  return t.charAt(0).toUpperCase() + t.slice(1);
}
// Woerter, die eine Zeile nicht beenden duerfen. REIM_DANGLING_RX deckt Artikel
// und Praepositionen ab, aber nicht Pronomen und Zahlwoerter - "Was ich" endete
// deshalb ungeruegt.
const REIM_KEIN_ENDE = /^(ich|du|er|sie|es|wir|man|ihn|ihm|mir|mich|dir|dich|uns|euch|sich|selbst|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|jede|jeder|jedes|alle|viele|manche|diese|dieser|dieses|keinen|keinem|keiner|genau|sehr|ganz|so|noch|nur|auch|schon|immer|wieder)$/i;

function reimCoreOf(phrase: string, targetWords: number): string {
  const alle = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  let words = alle.length > targetWords ? alle.slice(0, targetWords) : alle.slice();
  // Attributives Adjektiv ohne sein Nomen abschneiden: "Sterne ueber schwarzen"
  // stand fuer "Sterne ueber schwarzen Tannen". stripDanglingTail kennt nur
  // Artikel und Praepositionen, ein Adjektiv erkennt man erst am naechsten Wort.
  while (words.length > 2) {
    const letzt = words[words.length - 1]!;
    const danach = alle[words.length];
    if (danach && /^[A-ZÄÖÜ]/.test(danach) && /^[a-zäöüß]+(en|er|es|em|e)$/.test(letzt)) words.pop();
    else break;
  }
  words = stripDanglingTail(words);
  let guard = 0;
  while (words.length > 2 && REIM_KEIN_ENDE.test((words[words.length - 1] || "").replace(/[.,;:!?…]/g, "")) && guard++ < 6) {
    words.pop();
    words = stripDanglingTail(words);
  }
  return words.join(" ").replace(/[.,;:!?…]+$/, "").trim();
}
function reimGroupOfWord(word: string): RhymeGroup | null {
  const w = (word || "").toLowerCase().replace(/[.,;:!?…]/g, "");
  if (w.length < 4) return null;
  for (const g of REIM_GROUPS) {
    if (w.length > g.key.length && w.endsWith(g.key)) return g;
    if (g.words.some((x) => x.toLowerCase() === w)) return g;
  }
  return null;
}
function pickRhymeWord(group: RhymeGroup, exclude?: string): string {
  const ex = (exclude || "").toLowerCase().replace(/[.,;:!?…]/g, "");
  const options = group.words.filter((w) => { const lw = w.toLowerCase(); return !ex || (lw !== ex && !lw.endsWith(ex) && !ex.endsWith(lw)); });
  return options.length ? pick(options) : pick(group.words);
}
function lineWithRhyme(phrase: string, rhymeWord: string, targetWords: number, connector: string): string {
  const ohneReim = String(phrase || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean)
    .filter((w) => w.toLowerCase().replace(/[.,;:!?…]/g, "") !== rhymeWord.toLowerCase());
  // Dieselbe Kuerzung wie im Reimpaar-Zweig verwenden statt einer zweiten,
  // schwaecheren Kopie: Hier stand "Sterne ueber schwarzen" noch, nachdem der
  // andere Zweig es laengst sauber abschnitt.
  let core = reimCoreOf(ohneReim.join(" "), targetWords);
  if (!core) core = "Es bleibt";
  const tails = REIM_TAILS[rhymeWord];
  if (tails && tails.length) return verseLine(`${core}, ${pick(tails)}.`);
  return verseLine(`${core}${connector}${rhymeWord}.`);
}

export function applyReimPoem(rawText: string, anchorLine = "", lenTarget = 0, atome: string[] = []): string {
  // F.2: Der Laengenregler erreichte die Versformen nicht - bei Ziel 240 kamen
  // 74 Woerter heraus, weil targetLines fest auf 12 stand. Eine Reimzeile hat
  // rund sechs Woerter, daraus die Zeilenzahl.
  const opts = lenTarget > 0
    ? { ...REIM_DEFAULTS, targetLines: Math.max(8, Math.min(64, Math.round(lenTarget / 6))) }
    : REIM_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ")
    .replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases: string[] = [];
  // F.3: Atome sind geschlossene Einheiten und werden NICHT am Komma zerlegt.
  // Genau dieses Zerlegen erzeugte "Was ich, bis ins Gebein." - "Was ich" ist
  // ein abgeschnittener Nebensatz, an den eine Reimwendung geklebt wurde.
  if (atome.length >= 6) {
    phrases = atome.map((a) => a.trim()).filter((a) => a.length >= 6);
  } else {
    for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  }
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 6);
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "Ein Satz bleibt zurück"];
  const originalCount = phrases.length; let guard = 0;
  while (phrases.length < opts.targetLines && guard++ < 50) phrases.push(phrases[phrases.length % originalCount] || anchor || phrases[0]!);

  let groupPool = reimShuffle(REIM_GROUPS);
  const nextGroup = (): RhymeGroup => { if (!groupPool.length) groupPool = reimShuffle(REIM_GROUPS); return groupPool.shift()!; };

  const lines: string[] = [];
  let pi = 0, coupletIdx = 0;
  while (lines.length < opts.targetLines && pi < phrases.length) {
    const targetWords = REIM_RHYTHM_TARGETS[coupletIdx % REIM_RHYTHM_TARGETS.length]!;
    const connector = REIM_CONNECTORS[coupletIdx % REIM_CONNECTORS.length]!;
    const coreA = reimCoreOf(phrases[pi] || anchor, targetWords);
    const lastA = coreA.split(" ").pop() || "";
    const natural = reimGroupOfWord(lastA);
    let group: RhymeGroup, wA: string;
    if (natural && coreA.split(" ").length >= 2) { group = natural; wA = lastA; lines.push(verseLine(`${coreA}.`)); }
    else { group = nextGroup(); wA = pickRhymeWord(group); lines.push(lineWithRhyme(phrases[pi] || anchor, wA, targetWords, connector)); }
    pi++;
    const wB = pickRhymeWord(group, wA);
    lines.push(lineWithRhyme(phrases[pi] || anchor, wB, targetWords, connector));
    pi++; coupletIdx++;
  }
  return normalizeNewlines(insertStanzasByTheme(lines.slice(0, opts.targetLines), opts.stanzaEvery, 2).join("\n")).replace(/\n{3,}/g, "\n\n").trim();
}
