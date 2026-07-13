// Vers-/Sonderformen: Prosagedicht, Gedicht-Strang, Reim, Haiku, Drama.
// Prosagedicht ist 1:1 portiert; die übrigen sind formtreu, aber gegenüber
// den sehr detaillierten Original-Heuristiken gestrafft (kürzere Helferketten).
import { clean, pick, splitSentences } from "../text-utils";
import { cap } from "./beats";

/** Prosagedicht: je 2 Sätze ein Block. (1:1 aus dem Original.) */
export function asProsePoem(text: string): string {
  const s = text.replace(/\s+/g, " ").split(/(?<=[.!?…])\s+/).filter(Boolean);
  const lines: string[] = [];
  for (let i = 0; i < s.length; i++) { lines.push(s[i]!); if ((i + 1) % 2 === 0 && i < s.length - 1) lines.push(""); }
  return lines.join("\n");
}

// ── gemeinsame Vers-Helfer ──────────────────────────────────────────
const syllables = (w: string): number => (w.toLowerCase().match(/[aeiouäöüy]+/g) || []).length || 1;
const phrasesOf = (text: string): string[] => {
  const out: string[] = [];
  for (const s of splitSentences(clean(text).replace(/\([^()]*\)/g, " ")))
    out.push(...s.split(/[,;:—–]\s*/g).map((p) => p.replace(/^(und|aber|denn|doch|also)\s+/i, "").trim()).filter((p) => p.length >= 5));
  return out;
};
const stanzas = (lines: string[], every = 4): string => {
  const out: string[] = [];
  lines.forEach((l, i) => { out.push(l); if ((i + 1) % every === 0 && i < lines.length - 1) out.push(""); });
  return out.join("\n");
};

/** Gedicht-Strang: kurze, enjambierte Zeilen mit Strophen. */
export function asStrang(text: string, anchor = ""): string {
  const phr = phrasesOf(text.replace(/\bDer Einsatz ist\s*[:,]?\s*([^.!?\n]+)[.!?]?/gi, (_m, x: string) => `Wenn es wahr wird, verlieren wir ${x.trim()}.`));
  const pulse = [4, 6, 3, 7, 5];
  const lines: string[] = [];
  phr.forEach((p, i) => {
    const words = p.split(/\s+/).filter(Boolean);
    const target = pulse[i % pulse.length]!;
    for (let k = 0; k < words.length; k += target) lines.push(cap(words.slice(k, k + target).join(" ")));
  });
  const uniq = lines.filter((l, i) => lines.indexOf(l) === i).filter(Boolean);
  if (anchor) { const a = clean(anchor).replace(/[.!?…]+$/, "") + "."; if (!uniq.some((l) => l.includes(a.slice(0, 16)))) uniq.push(cap(a)); }
  if (uniq.length) { let last = uniq[uniq.length - 1]!.replace(/[,;:—–\s]+$/, ""); if (!/[.!?…]$/.test(last)) last += "."; uniq[uniq.length - 1] = last; }
  return stanzas(uniq, 4);
}

/** Reim: Paar-Reim (AABB), Best-Effort über Endsilben-Gruppen. */
export function asReim(text: string, anchor = ""): string {
  const rhymeKey = (line: string): string => {
    const w = (line.replace(/[.,;:!?…—–]+$/, "").split(/\s+/).pop() || "").toLowerCase();
    const m = w.match(/[aeiouäöü][a-zäöüß]*$/);
    return m ? m[0].slice(0, 3) : w.slice(-2);
  };
  const phr = phrasesOf(text).map((p) => cap(p.split(/\s+/).slice(0, 8).join(" ")));
  const groups: Record<string, string[]> = {};
  for (const p of phr) (groups[rhymeKey(p)] ||= []).push(p);
  const used = new Set<string>();
  const out: string[] = [];
  // zuerst reimende Paare
  for (const g of Object.values(groups)) {
    for (let i = 0; i + 1 < g.length; i += 2) { out.push(g[i]!, g[i + 1]!); used.add(g[i]!); used.add(g[i + 1]!); }
  }
  // Rest sequenziell anhängen
  for (const p of phr) if (!used.has(p)) out.push(p);
  const lines = out.filter((l, i) => out.indexOf(l) === i);
  if (anchor) lines.push(cap(clean(anchor).replace(/[.!?…]+$/, "") + "."));
  return stanzas(lines.map((l) => (/[.!?…]$/.test(l) ? l : l + ".")), 4);
}

/** Haiku: drei Zeilen nahe 5-7-5 Silben. */
export function asHaiku(text: string, anchor = ""): string {
  const words: string[] = [];
  for (const p of phrasesOf(anchor ? text + " " + anchor : text)) words.push(...p.split(/\s+/).filter(Boolean));
  const targets = [5, 7, 5];
  const lines: string[] = [];
  let idx = 0;
  for (const t of targets) {
    const line: string[] = [];
    let syl = 0;
    while (idx < words.length && syl < t) { const w = words[idx]!; if (syl && syl + syllables(w) > t + 1) break; line.push(w); syl += syllables(w); idx++; }
    if (line.length) lines.push(line.join(" "));
  }
  return lines.map((l, i) => (i === 0 ? cap(l) : l)).join("\n") || cap(text.split(/[.!?…]/)[0] || "Stille");
}

// ── Drama ───────────────────────────────────────────────────────────
const DRAMA_WILLS = ["will das Gehäuse verlassen", "will die Reihenfolge korrigieren", "will den Namen behalten", "will beweisen, dass die Erinnerung falsch ist"];
const DRAMA_BLOCK = ["der Apparat speichert jede Bewegung", "das Gehäuse lässt niemanden hinaus", "die Zeit springt rückwärts", "eine Regel verbietet die Wahrheit"];
const DRAMA_LOSS = ["es löscht sich selbst", "es verliert die Gegenwart", "es verbrennt den Speicher", "es zerstört das Foto"];
const isAction = (s: string): boolean => /\b(nimmt|öffnet|tritt|hält|schlägt|rennt|greift|zieht|wirft|bricht|schließt|läuft|sucht|findet)\b/i.test(s);

export function asDrama(text: string, whoA: string, whoB: string): string {
  const A = whoA || "A", B = whoB || "B";
  const conflict = { WILL: `${A} ${pick(DRAMA_WILLS)}`, BLOCK: `Aber ${pick(DRAMA_BLOCK)}.`, LOSS: `Wenn ${A} es versucht, ${pick(DRAMA_LOSS)}.` };
  let units = splitSentences(clean(text).replace(/\([^()]*\)/g, " ")).map((u) => u.trim()).filter(Boolean);
  // Konflikt verankern
  units.unshift(cap(conflict.WILL) + ".");
  units.splice(Math.min(2, units.length), 0, conflict.BLOCK);
  // Aktionssätze bevorzugen, Metaphern-Ballast leicht kürzen
  const action = units.filter(isAction), rest = units.filter((u) => !isAction(u));
  units = [...units.slice(0, 2), ...action, ...rest.slice(0, Math.max(2, Math.floor(rest.length * 0.6)))].filter((u, i, a) => a.indexOf(u) === i);
  units.push(conflict.LOSS);
  units.push(`${B} entscheidet sich.`);
  return units.join("\n");
}
