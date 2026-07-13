// Form-Shaper: Disruptor, Rhythmus, Absätze, Perspektive, Pronominalisierung.
// Perspektive ist bewusst schlank (Name→Pronomen, ohne die große VERB_CONJ-
// Konjugationstabelle); die "du"-Kongruenz übernimmt coherenceRepairV2.
import { clean, pick, chance, splitSentences, escapeRegExp } from "../text-utils";
import { chooseInsertPos, isFragmentSentence, cap } from "./beats";

export interface DisruptorResult { text: string; fired: boolean; kind: string; }

export function applyDisruptor(text: string, level: string): DisruptorResult {
  const p = level === "off" ? 0 : level === "on" ? 0.33 : 0.17;
  if (!chance(p)) return { text, fired: false, kind: "–" };
  const kinds: { kind: string; fn: (t: string) => string }[] = [
    { kind: "Zeitbruch", fn: (t) => t + " Drei Jahre später ist die gleiche Stelle noch da, aber das Geräusch ist älter." },
    { kind: "Erzählerwechsel", fn: (t) => t.replace(/\n\n/g, "\n\n—\n\n") + "\n\nIch übernehme hier. Nur kurz. Nur, um das Offensichtliche zu sagen." },
    { kind: "Metakommentar", fn: (t) => t + "\n\n(Diese Geschichte weiß, dass sie erzählt wird.)" },
    { kind: "Wiederholung", fn: (t) => { const s = splitSentences(t); if (s.length < 3) return t; return t + "\n\n" + s[Math.floor(s.length * 0.65)]; } },
    { kind: "Fragmentierung", fn: (t) => { const s = splitSentences(t); if (s.length < 4) return t; s.splice(Math.floor(s.length / 2), 0, "—"); return s.join(" "); } },
  ];
  const k = pick(kinds);
  return { text: k.fn(text), fired: true, kind: k.kind };
}

const FRAGMENTS = ["Stille.", "Zu nah.", "Zu klar.", "Ein Fehler.", "Noch nicht.", "Dann.", "Nein.", "Vielleicht.", "Fast.", "Genau jetzt."];

export function applyRhythm(text: string, rhythm: string): string {
  const s = splitSentences(text);
  const insertFrag = (prob: number): void => {
    if (chance(prob)) { const pos = chooseInsertPos(s); if (pos >= 0) s.splice(pos, 0, pick(FRAGMENTS)); }
  };
  if (rhythm === "clean") return s.join(" ");
  if (rhythm === "breath") {
    insertFrag(0.55);
    if (s.length >= 5 && chance(0.45)) { const i = Math.floor(1 + Math.random() * (s.length - 2)); s[i] = "Und " + s[i]!.charAt(0).toLowerCase() + s[i]!.slice(1); }
  }
  if (rhythm === "staccato") {
    insertFrag(0.75);
    if (s.length >= 4 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 2)); const t = s[i]!; const cut = t.indexOf(", ");
      if (cut > 10 && cut < 80) { s[i] = t.slice(0, cut) + "."; s.splice(i + 1, 0, t.slice(cut + 2)); }
    }
    if (chance(0.35)) { const at = Math.min(2, s.length); if (!isFragmentSentence(s[at - 1] || "") && !isFragmentSentence(s[at] || "")) s.splice(at, 0, pick(["Stille.", "Warte.", "So.", "Gut."])); }
  }
  if (rhythm === "long") {
    if (s.length >= 6 && chance(0.6)) {
      const i = Math.floor(1 + Math.random() * (s.length - 3)); const first = s[i]!.replace(/[.!?…]$/, ""); const next = s[i + 1]!;
      const joiner = /^(und|aber|doch|denn|sondern)\b/i.test(next) ? ", " : (chance(0.5) ? ", und " : "; ");
      s[i] = first + joiner + next.charAt(0).toLowerCase() + next.slice(1); s.splice(i + 1, 1);
    }
    if (chance(0.4)) s.push("Und während all das geschieht, bleibt etwas in der Luft hängen, als wäre es nie für Menschen gedacht gewesen.");
  }
  if (rhythm === "fracture") {
    insertFrag(0.70);
    if (s.length >= 5 && chance(0.6)) { const i = Math.floor(1 + Math.random() * (s.length - 2)); s[i] = s[i]!.replace(/[.!?…]$/, "") + " —"; s.splice(i + 1, 0, "und genau dort bricht die Erklärung ab."); }
    if (chance(0.45)) s.splice(Math.floor(s.length * 0.65), 0, "(Dieser Satz war nicht geplant.)");
  }
  return s.join(" ");
}

export function paragraphize(txt: string): string {
  const s = splitSentences(txt);
  if (s.length <= 3) return txt;
  const breaks = new Set<number>();
  const target = chance(0.6) ? 2 : 1;
  while (breaks.size < target) breaks.add(Math.min(s.length - 2, Math.max(1, Math.floor(1 + Math.random() * (s.length - 2)))));
  const out: string[] = [];
  for (let i = 0; i < s.length; i++) { out.push(s[i]!); if (breaks.has(i)) out.push("\n\n"); }
  return out.join(" ").replace(/\s+\n\n\s+/g, "\n\n").trim();
}

export function guessPronoun(P: string): string {
  const p = clean(P);
  if (/^(der|ein)\s/i.test(p)) return "er";
  if (/^(die|eine)\s/i.test(p)) return "sie";
  if (/^das\s/i.test(p)) return "es";
  if (/(a|e|in)$/i.test(p)) return "sie";
  return "er";
}

export function applyPerspective(paras: string[], perspective: string, who: string, objName: string): string[] {
  const P = clean(who) || "Jemand";
  const O = clean(objName) || "das Objekt";
  const swap = (s: string, pronoun: string): string => {
    if (!P) return s;
    try { return s.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${escapeRegExp(P)}(?![\\p{L}\\p{N}_])`, "gu"), pronoun); }
    catch { return s.replace(new RegExp("\\b" + escapeRegExp(P) + "\\b", "g"), pronoun); }
  };
  const toFirst = (s: string) => swap(s, "ich");
  const toSecond = (s: string) => swap(s, "du");
  const toWe = (s: string) => swap(s, "wir");
  const toObject = (s: string) => `(${O}) ${s}`;
  if (perspective === "third") return paras;
  if (perspective === "first") return paras.map(toFirst);
  if (perspective === "second") return paras.map(toSecond);
  if (perspective === "we") return paras.map(toWe);
  if (perspective === "object") return paras.map(toObject);
  const cycle = ["first", "second", "third", "object"];
  return paras.map((p, i) => {
    const k = cycle[i % cycle.length];
    if (k === "first") return toFirst(p);
    if (k === "second") return toSecond(p);
    if (k === "object") return toObject(p);
    return p;
  });
}

export function pronominalize(text: string, P: string, pronoun: string): string {
  const name = clean(P);
  if (!name || !pronoun) return text;
  let re: RegExp;
  try { re = new RegExp(`^${escapeRegExp(name)}\\s+[a-zäöüß]`); } catch { return text; }
  let seen = false, lastReplaced = false;
  return text.split(/\n\n+/).map((par) => {
    const s = splitSentences(par);
    for (let i = 0; i < s.length; i++) {
      if (!re.test(s[i]!)) continue;
      if (!seen) { seen = true; lastReplaced = false; continue; }
      if (lastReplaced) { lastReplaced = false; continue; }
      s[i] = cap(pronoun) + s[i]!.slice(name.length);
      lastReplaced = true;
    }
    return s.join(" ");
  }).join("\n\n");
}
