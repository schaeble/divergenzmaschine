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

/** Heuristik: ist die Phrase ein ganzer Satz (statt einer Nominalphrase)? */
const CLAUSE_VERBS = new Set(["antworten","antwortet","atmen","atmet","bebt","begann","beginnen","beginnt","beobachten","beobachtet","berühren","berührt","bin","bist","bleiben","bleibt","blieb","blitzt","brannte","brennen","brennt","brummt","brüllen","brüllt","dachte","darf","denken","denkt","donnert","drehen","dreht","drehte","durfte","dürfen","enden","endet","endete","erinnern","erinnert","fahren","fallen","fand","fiel","fielen","finden","findet","fliegen","fliegt","fliehen","flieht","fließen","fließt","flog","floss","flüstern","flüstert","folgen","folgt","folgte","formen","formt","fragen","fragt","fragte","fuhr","fährt","fällt","fühlen","fühlt","führen","führt","führte","fürchten","fürchtet","gab","gaben","galt","geben","gehen","geht","gelten","geschah","geschehen","geschieht","gibt","gilt","ging","gingen","glauben","glaubt","haben","habt","halten","hat","hatte","hatten","hielt","hielten","hoffen","hofft","hält","hätte","hören","hört","hörte","ist","jagen","jagt","kam","kamen","kann","kannte","kennen","kennt","kippen","kippt","knistert","kommen","kommt","konnte","konnten","kreisen","kreist","können","lachen","lacht","lag","lagen","laufen","leuchten","leuchtet","lief","liefen","liegen","liegt","läuft","löschen","löscht","machen","macht","machte","machten","mag","muss","musste","mussten","möchte","möchten","mögen","müssen","nahm","nahmen","nehmen","nimmt","passieren","passiert","passierte","planen","plant","pulsiert","raschelt","reagieren","reagiert","regnet","retten","rettet","rief","rinnt","riskiert","rufen","ruft","sah","sahen","sang","sank","saß","schlafen","schlief","schließen","schließt","schloss","schläft","schmelzen","schmilzt","schneit","schreien","schreit","schrie","schweigen","schweigt","schwieg","sehen","seid","sieht","sind","singen","singt","sinken","sinkt","sitzen","sitzt","soll","sollen","sollte","sprach","sprachen","sprang","sprechen","spricht","springen","springt","stand","standen","stehen","steht","steigen","steigt","stieg","suchen","sucht","suchte","summt","tanzen","tanzt","tat","taten","ticken","tickt","tragen","tropft","trug","trugen","trägt","träumen","träumt","tun","tut","unterschreiben","unterschreibt","verfolgen","verfolgt","vergessen","vergisst","verlangen","verlangt","verraten","verrät","verändern","verändert","vibriert","wachsen","wagen","wagt","wandern","wandert","war","waren","warten","wartet","wartete","wechseln","wechselt","weigern","weigert","weinen","weint","weiß","werden","werdet","wiederholen","wiederholt","will","wird","wirst","wissen","wollen","wollte","wollten","wurde","wurden","wusste","wächst","wäre","wären","würde","würden","zeigen","zeigt","zeigte","zerbrechen","zerbricht","ziehen","zieht","zittern","zittert","zog","zogen","öffnen","öffnet","überschreiben","überschreibt"]);
const CLAUSE_STOP = new Set([
  "der","die","das","den","dem","des","ein","eine","einen","einem","einer","eines",
  "kein","keine","keinen","keinem","keiner","mein","meine","meinen","dein","deine","sein","seine","seinen","ihr","ihre","ihren","unser","unsere","euer","eure",
  "dieser","diese","dieses","diesen","diesem","jener","jene","jenes","jeder","jede","jedes","jeden","jedem","manch","manche","alle","allen","beide","beiden","viele","vielen","solche","solchen",
  "mit","ohne","aus","von","vom","in","im","auf","an","am","für","bei","zu","zum","zur","über","unter","vor","nach","durch","gegen","seit","um","neben","zwischen","hinter","wegen","trotz","während","entlang",
  "und","oder","aber","denn","sondern","nicht","jetzt","fast","erst","sonst","selbst","meist","dennoch","trotzdem",
]);
const CLAUSE_PRON = new Set(["ich","du","er","sie","es","wir","man","jemand","niemand","etwas","nichts","wer","alles"]);

function mainHasFiniteVerb(part: string): boolean {
  const toks = part.trim().split(/\s+/);
  let sawSubject = false;
  for (let i = 0; i < toks.length; i++) {
    const raw = toks[i]!;
    const lower = raw.toLowerCase().replace(/[^a-zäöüß]/g, "");
    if (i > 0 && sawSubject && /^[a-zäöüß]/.test(raw) && lower.length >= 3 && !CLAUSE_STOP.has(lower)) {
      if (CLAUSE_VERBS.has(lower)) return true;
      if (/iert$/.test(lower)) return true;                 // reagiert, existiert, notiert …
      if (/en$/.test(lower)) {                              // Plural/Infinitiv-Form (folgen, kommen)
        const next = toks[i + 1];
        if (!next || /^[a-zäöüß]/.test(next)) return true;  // NICHT vor großgeschr. Nomen (attributives Adjektiv)
      }
    }
    // Subjekt merken: großgeschriebenes Nomen (nach Position 0) oder Pronomen
    if ((i > 0 && /^[A-ZÄÖÜ]/.test(raw)) || CLAUSE_PRON.has(lower)) sawSubject = true;
  }
  return false;
}

export function looksLikeClausePhrase(phrase: string): boolean {
  const s = clean(phrase);
  if (!s) return false;
  if (/[.!?]$/.test(s)) return true;                        // endet wie ein Satz
  const mainPart = (s.split(",")[0] || s).trim();           // nur Hauptteil vor dem ersten Komma
  return mainHasFiniteVerb(mainPart);
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
