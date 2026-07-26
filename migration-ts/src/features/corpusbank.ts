// Wortbank aus dem eigenen Korpus ableiten (offline, ohne KI): verteilt Sätze und
// Teilsätze heuristisch auf die 7 Kategorien. Bewusst grob — als Startpunkt, den
// man im Listen-Editor nachschärft. "Bei Bedarf aus dem Korpus füllen".
import type { Bank, BankKey } from "../types";
import { normalizeBankShape } from "../storage";

const splitSents = (t: string): string[] =>
  (t || "").replace(/\s+/g, " ").trim().split(/(?<=[.!?…])\s+/).filter((s) => s.trim().length > 0);
const splitClauses = (t: string): string[] =>
  splitSents(t).flatMap((s) => s.split(/[,;:—–]\s+/)).map((c) => c.trim()).filter(Boolean);
const wc = (s: string): number => (s.match(/[a-zäöüßA-ZÄÖÜ]+/g) || []).length;
const cap = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);
const clean = (s: string): string =>
  cap(String(s || "").replace(/^(und|oder|aber|denn|doch|dann|so|dass|weil|wie|als|obwohl|während)\s+/i, "").replace(/[.,;:!?…\s]+$/, "").trim());

const TURN = /\b(pl(ö|oe)tzlich|auf einmal|dann|doch|kippt|kippte|(ver)?(ä|ae)ndert|(ä|ae)nderte|wendet|drehte|riss|brach|zerbrach|verwandelt|verschob)\b/i;
const OBST = /\b(kein|keine|keinen|nicht|ohne|niemand|nichts|versperrt|verschlossen|zu sp(ä|ae)t|vergeblich|umsonst|blockiert|gefangen|verboten|unm(ö|oe)glich)\b/i;
const STAKE = /\b(alles|verlieren|verloren|Leben|Tod|Wahrheit|Preis|Einsatz|Schuld|Ehre|Freiheit|Rettung|letzte[rsn]?|entscheidet|riskiert|Gefahr)\b/i;

export function bankFromCorpus(corpus: string): Bank {
  const bank: Record<BankKey, string[]> = { motifs: [], hooks: [], props: [], turns: [], obstacles: [], stakes: [], endings: [] };
  const seen: Record<BankKey, Set<string>> = { motifs: new Set(), hooks: new Set(), props: new Set(), turns: new Set(), obstacles: new Set(), stakes: new Set(), endings: new Set() };
  const CAP = 40;
  const add = (k: BankKey, raw: string): void => {
    const c = clean(raw); const key = c.toLowerCase();
    if (c.length < 4 || bank[k].length >= CAP || seen[k].has(key)) return;
    seen[k].add(key); bank[k].push(c);
  };

  // Requisiten: distinkte großgeschriebene Substantive (nicht am Satzanfang).
  for (const s of splitSents(corpus)) {
    const toks = s.split(/\s+/);
    toks.forEach((w, i) => {
      const m = w.match(/^([A-ZÄÖÜ][a-zäöüß]{3,})[.,;:!?…]?$/);
      if (m && i > 0) add("props", m[1]!);
    });
  }

  // Hooks = erste, Enden = letzte Sätze der Absätze.
  for (const para of corpus.split(/\n\n+/)) {
    const ss = splitSents(para);
    if (ss.length) {
      const first = ss[0]!, last = ss[ss.length - 1]!;
      if (wc(first) >= 4 && wc(first) <= 15) add("hooks", first);
      if (wc(last) >= 3 && wc(last) <= 14) add("endings", last);
    }
  }

  // Teilsätze nach Schlüsselwörtern verteilen; Rest nach Länge (kurz=Motiv, sonst Hook).
  for (const c of splitClauses(corpus)) {
    const n = wc(c);
    if (n < 3 || n > 16) continue;
    if (TURN.test(c)) add("turns", c);
    else if (OBST.test(c)) add("obstacles", c);
    else if (STAKE.test(c)) add("stakes", c);
    else if (n <= 5) add("motifs", c);
    else add("hooks", c);
  }

  // Leere Kategorien aus Motiven (bzw. generisch) auffüllen, damit die Bank funktioniert.
  const filler = bank.motifs.length ? bank.motifs : ["ein Zeichen", "eine Spur", "ein Riss", "eine Stille", "ein Schatten"];
  (Object.keys(bank) as BankKey[]).forEach((k) => { if (!bank[k].length) bank[k] = filler.slice(0, 8); });

  return normalizeBankShape(bank);
}
