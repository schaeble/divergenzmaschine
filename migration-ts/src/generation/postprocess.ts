// Nachbearbeitung des generierten Textes: Kohärenz-Schliff + Reparatur.
// Hinweis: Ton-Einfärbung und "Sprachschliff" (polishGerman) sind bewusst
// noch nicht portiert (Phase 4) — hier steckt der Kern der Bereinigung.
import type { GenInput } from "../types";
import { escapeRegExp, splitSentences } from "../text-utils";
import { coherenceWords } from "./nlp";

type Input = Partial<GenInput>;

const LINE_FORMS = new Set(["script", "video", "strang", "reim", "haiku", "poem"]);
const isLineForm = (input?: Input): boolean =>
  !!input && !!input.form && LINE_FORMS.has(input.form);

/** Entfernt abgebrochene und themenfremde Sätze (semantische Gewichtung). */
export function coherencePass(text: string, input?: Input): string {
  try {
    if (isLineForm(input)) return text;
    const t = String(text || "").replace(/\.\s*\.+/g, ".");
    const paras = t.split(/\n{2,}/);

    const freq: Record<string, number> = {};
    coherenceWords(t).forEach((w) => { freq[w] = (freq[w] || 0) + 1; });
    const motif = new Set(Object.keys(freq).filter((w) => freq[w]! >= 2));
    [input?.who, input?.where, input?.what].forEach((s) =>
      coherenceWords(s || "").forEach((w) => motif.add(w)));

    const allowBreaks = input?.disruptor === "on";
    const maxRemove = Math.max(1, Math.floor(splitSentences(t).length * 0.25));
    let removed = 0;

    const outParas: string[] = [];
    paras.forEach((p, pi) => {
      const sents = splitSentences(p);
      const kept = sents.filter((s, si) => {
        const bare = s.trim().replace(/["»«)\]]+$/, "").replace(/[.!?…]+$/, "").trim();
        if (/(^|\s)(ein|eine|einem|einen|einer|eines|der|die|das|dem|den|des|und|oder|aber|wie|mit|an|auf|zu|im|am|vor|nach|für|ohne|als|bei|aus|ist|sind|wird)$/i.test(bare)
          && bare.split(/\s+/).length <= 12) {
          removed++; return false;
        }
        if (removed >= maxRemove) return true;
        const late = pi === paras.length - 1 && sents.length >= 4 && si >= Math.floor(sents.length / 2);
        if (late) {
          const cw = coherenceWords(s);
          if (cw.length >= 2 && !cw.some((w) => motif.has(w))) {
            if (allowBreaks && Math.random() < 0.5) return true;
            removed++; return false;
          }
        }
        return true;
      });
      if (kept.length) outParas.push(kept.join(" "));
    });
    const result = outParas.join("\n\n").trim();
    return result.length >= 60 ? result : text;
  } catch {
    return text;
  }
}

/** Zeichen-/Grammatik-/Label-Reparatur (Kohärenz-Schliff v2, inkl. Fixes 1–5). */
export function coherenceRepairV2(t: string, input?: Input): string {
  t = String(t ?? "");

  // Lever 4: geleakte Modus-/Sektionslabels in Klammern
  t = t.replace(/\(\s*[A-ZÄÖÜ][\wäöüß-]{2,}\s*\)/g, " ");
  // Lever 2: Zeichen-/Anführungs-Artefakte
  t = t.replace(/,\s*([.!?…])/g, "$1");
  t = t.replace(/\s*,\s*,\s*/g, ", ");
  t = t.replace(/„\s+/g, "„").replace(/\s+"/g, '"');
  t = t.replace(/([.!?…])\s*\1+/g, "$1");

  // Fix 1: unpaarige Anführungszeichen
  if (((t.match(/"/g) || []).length) % 2 === 1) t = t.replace(/"/g, "");
  { const o = (t.match(/„/g) || []).length, c = (t.match(/[“”]/g) || []).length; if (o !== c) t = t.replace(/[„“”]/g, ""); }
  // Fix 2: kaputte Possessivform aus Perspektivwechsel
  t = t.replace(/\bich'(?=\s)/gi, "meine").replace(/\bdu'(?=\s)/gi, "deine")
    .replace(/\bwir'(?=\s)/gi, "unsere").replace(/\ber'(?=\s)/gi, "seine")
    .replace(/\bsie'(?=\s)/gi, "ihre").replace(/\bes'(?=\s)/gi, "seine");
  // Fix 4a: Großschreibung nach Doppelpunkt
  t = t.replace(/(:\s+)([a-zäöüß])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());
  // Fix 4b: Eigennamen aus "Wer" korrekt kapitalisieren
  String(input?.who || "").split(/[,;]/).map((x) => x.trim()).filter(Boolean).forEach((n) => {
    const esc = escapeRegExp(n);
    try { t = t.replace(new RegExp("\\b" + esc + "(s|')?\\b", "giu"), (_m, suf: string) => n + (suf || "")); } catch { /* ungültiger Name */ }
  });

  if (isLineForm(input)) {
    return t.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").trim();
  }

  const DU: [RegExp, string][] = [
    [/\btritt\b/g, "trittst"], [/\bhält\b/g, "hältst"], [/\bnimmt\b/g, "nimmst"],
    [/\bsieht\b/g, "siehst"], [/\bgeht\b/g, "gehst"], [/\bsteht\b/g, "stehst"],
    [/\bträgt\b/g, "trägst"], [/\bführt\b/g, "führst"], [/\bfindet\b/g, "findest"],
    [/\bsucht\b/g, "suchst"], [/\bkommt\b/g, "kommst"], [/\bbricht\b/g, "brichst"],
  ];

  const sents = t.split(/(?<=[.!?…])\s+/).filter(Boolean);
  const kept: string[] = [];
  for (let s of sents) {
    const bare = s.trim().replace(/["“”»«]+$/, "").replace(/[.!?…]+$/, "").trim();
    const opens = (s.match(/„/g) || []).length, closes = (s.match(/[“”»]/g) || []).length;
    if (/\bSatz\s+„/.test(s) && opens > closes) continue;
    if (/,\s+(die|der|das|dem|den|des)\s+(die|der|das|dem|den|des)\s+\p{L}+$/iu.test(bare)) continue;
    if (opens > closes) s = s.replace(/„\s*/g, "");
    const di = s.search(/\bdu\b/i);
    if (di >= 0) {
      const head = s.slice(0, di);
      let tail = s.slice(di);
      DU.forEach(([re, rep]) => { tail = tail.replace(re, rep); });
      s = head + tail;
    }
    kept.push(s.trim());
  }
  t = kept.join(" ");

  // Fix 3: Pronomen-Kongruenz bei Plural-Subjekt
  t = t.replace(/(\bich und [A-ZÄÖÜ][\wäöüß]+[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");
  t = t.replace(/([A-ZÄÖÜ][\wäöüß]+ und ich[^.!?…]*?)\bsie sich\b/gu, "$1wir uns");

  // Lever 5: Konnektor-Dedupe
  const CONN = [/\bDann kippt es\b/gi, /\bDabei:\s*plötzlich\b/gi, /\bUnd immer wieder\b/gi, /\bAm Ende bleibt klar\b/gi];
  CONN.forEach((re) => { let n = 0; t = t.replace(re, (m) => (++n > 1 ? "" : m)); });

  t = t.replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?])/g, "$1").replace(/„\s+/g, "„").trim();
  return t;
}

/** Volle Nachbearbeitung: Namens-Ersetzung, Großschreibung, Kohärenz-Schliff. */
export function postProcessText(txt: string, input?: Input): string {
  let t = (txt ?? "").toString();
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());

  const name = (input?.who ?? "").toString().trim();
  if (name) {
    const esc = escapeRegExp(name);
    try {
      t = t.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${esc}(?![\\p{L}\\p{N}_])`, "giu"), name);
    } catch {
      t = t.replace(new RegExp(`\\b${esc}\\b`, "gi"), name);
    }
  }

  t = coherencePass(t, input);
  t = coherenceRepairV2(t, input);
  t = t.replace(/(^|[.!?…]\s+)([a-zäöü])/g, (_m, p1: string, p2: string) => p1 + p2.toUpperCase());
  return t.trim();
}
