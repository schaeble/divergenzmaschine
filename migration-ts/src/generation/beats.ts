// Textbau-Helfer für die Struktur-Builder und die Ton-Einschübe.
import { clean, pick, chance, ensurePunct, escapeRegExp, splitSentences } from "../text-utils";

export function cap(s: string): string {
  s = (s ?? "").toString();
  return s ? s[0]!.toUpperCase() + s.slice(1) : s;
}

export function isFragmentSentence(s: string): boolean {
  const n = clean(s).split(/\s+/).filter(Boolean).length;
  return n > 0 && n <= 3;
}

/** Heuristik: enthält die Phrase ein finites Verb (klingt nach ganzem Satz)? */
export function looksLikeClausePhrase(phrase: string): boolean {
  const s = clean(phrase);
  if (!s) return false;
  const VERBISH = /\b(ist|war|sind|waren|hat|hatte|wird|werden|kommt|geht|steht|liegt|bleibt|beginnt|endet|kennt|sucht|will|tanzt|brüllt|zieht|schweigt|flüstert|verändert|kippt|löscht|folgt|weigern|weigert|verlangt|glüht|glühen|formt|wandert|reagiert|atmet|tickt|zeigt|spricht|antwortet|erinnert)\b/i;
  return VERBISH.test(s);
}

export function chooseInsertPos(sentences: string[]): number {
  if (!sentences || sentences.length < 2) return -1;
  const candidates: { pos: number; weight: number }[] = [];
  for (let pos = 1; pos <= sentences.length; pos++) {
    const prev = sentences[pos - 1]!;
    const next = sentences[pos];
    if (isFragmentSentence(prev)) continue;
    if (next !== undefined && isFragmentSentence(next)) continue;
    const w = clean(prev).split(/\s+/).filter(Boolean).length;
    candidates.push({ pos, weight: Math.max(1, w - 4) });
  }
  if (!candidates.length) return -1;
  let sum = 0;
  for (const c of candidates) sum += c.weight;
  let r = Math.random() * sum;
  for (const c of candidates) { r -= c.weight; if (r <= 0) return c.pos; }
  return candidates[candidates.length - 1]!.pos;
}

const BEAT_CONNECTORS = ["Kurz darauf", "Gleichzeitig", "Wenig später", "Im selben Atemzug", "Noch am selben Ort"];

export function joinBeats(beats: string[], P: string): string {
  const parts = beats.map((b) => ensurePunct(clean(b))).filter(Boolean);
  for (let i = 1; i < parts.length; i++) {
    const prev = (parts[i - 1]!.split(/\s+/)[0] || "").toLowerCase();
    const cur = (parts[i]!.split(/\s+/)[0] || "").toLowerCase();
    if (prev === cur && cur === "und") {
      parts[i] = cap(parts[i]!.replace(/^Und\s+/i, ""));
    } else if (prev === cur && cur === "dann") {
      parts[i] = parts[i]!.replace(/^Dann\b/i, pick(["Danach", "Kurz darauf", "Später"]));
    }
  }
  if (P && parts.length >= 4 && chance(0.6)) {
    const idx = 1 + Math.floor(Math.random() * (parts.length - 2));
    const m = new RegExp(`^${escapeRegExp(P)}\\s+([a-zäöüß]+)\\s+([\\s\\S]+)$`).exec(parts[idx]!);
    if (m) parts[idx] = `${pick(BEAT_CONNECTORS)} ${m[1]} ${P} ${m[2]}`;
  }
  return parts.join(" ");
}

export function frameTurn(turn: string): string {
  const t = clean(turn).replace(/[.!?…]+$/, "");
  return pick([
    `Dann kippt es: ${t}.`,
    `Dann kippt es — ${t}.`,
    `Es braucht nur einen Atemzug, und ${t}.`,
    `Erst ein Riss, kaum merklich, und ${t}.`,
  ]);
}

export function reframeStake(stake: string): string {
  const m = /^Der Einsatz ist\s+(.+?)[.!?…]*$/i.exec(clean(stake));
  if (!m) return stake;
  const core = m[1]!;
  const frames = [`Der Einsatz ist ${core}.`, `Es geht um ${core}.`];
  if (!/[:,]/.test(core)) {
    frames.push(`Auf dem Spiel steht ${core}.`);
    frames.push(`${cap(core)} steht auf dem Spiel.`);
  }
  return pick(frames);
}

export function weaveMotif(text: string, motif: string): string {
  if (!motif) return text;
  const motifLine = looksLikeClausePhrase(motif)
    ? ensurePunct(cap(clean(motif)))
    : ensurePunct(`Dabei: ${motif}`);
  const s = splitSentences(text);
  if (s.length < 2) return text + " " + motifLine;
  let pos = chooseInsertPos(s);
  if (pos < 0) pos = Math.min(s.length - 1, Math.max(1, Math.floor(s.length * 0.55)));
  s.splice(pos, 0, motifLine);
  return s.join(" ");
}

export function randomFragmentTime(): string {
  const h = pick([23, 0, 1, 2, 3, 4, 5]);
  const m = Math.floor(Math.random() * 60);
  return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0");
}

/** Fügt eine Ton-Flavor-Zeile absatzweise an regelbasierter Position ein. */
export function insertToneFlavor(text: string, line: string): string {
  const paras = text.split(/\n\n+/);
  let target = 0;
  for (let i = 1; i < paras.length; i++) if (paras[i]!.length > paras[target]!.length) target = i;
  const sentences = splitSentences(paras[target]!);
  if (sentences.length < 2) {
    paras[target] = (paras[target] + " " + line).trim();
    return paras.join("\n\n");
  }
  let idx = chooseInsertPos(sentences);
  if (idx < 0) idx = sentences.length;
  sentences.splice(idx, 0, line);
  paras[target] = sentences.join(" ");
  return paras.join("\n\n");
}
