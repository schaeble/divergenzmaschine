// Haiku (5-7-5) — 1:1 aus dem Original portiert.
import { pick, chance, splitSentences } from "../text-utils";
import { cap } from "./beats";
import { normalizeNewlines, capLine, stripDanglingTail, reimShuffle, reimDedupePhrases, estimateSyllables, buildSyllableLine } from "./verselib";
import { HAIKU_DEFAULTS, HAIKU_KIGO, HAIKU_NATURE7, HAIKU_CLOSERS } from "./haiku.data";

// Woerter, die eine Zeile nicht beenden duerfen: Sie verlangen etwas dahinter.
const KEIN_ENDE = /^(der|die|das|den|dem|des|ein|eine|einen|einem|einer|eines|mein|dein|sein|ihr|unser|euer|kein|keine|keinen|keinem|keiner|keines|meinen|meinem|meiner|deinen|seinen|seinem|ihren|ihrem|selbst|und|oder|aber|doch|denn|sondern|als|dass|ob|weil|wenn|wie|um|zu|zum|zur|beim|vom|im|am|ins|aufs|mit|in|auf|an|für|von|bei|aus|über|unter|vor|nach|durch|gegen|ohne|seit|bis|hätte|hatte|wäre|würde|könnte|müsste|sollte|dürfte|genau|sehr|ganz|so|noch|nur|auch|schon|immer|wieder|dann|dabei|ich|du|er|sie|es|wir|man|ihn|ihm|mir|mich|dir|dich|uns|euch|sich|zwei|drei|vier|fünf|sechs|sieben|acht|neun|zehn|jede|jeder|jedes|alle|viele|manche|diese|dieser|dieses)$/i;
const darfEnden = (w: string): boolean => !KEIN_ENDE.test(w.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));

const haikuSyllOf = (line: string): number => String(line || "").split(/\s+/).filter(Boolean).reduce((a, w) => a + estimateSyllables(w), 0);

interface Cand { text: string; syll: number; src: number; ganz: boolean; }
function haikuCandidatesFromPhrases(phrases: string[]): Cand[] {
  const out: Cand[] = []; const seen = new Set<string>();
  phrases.forEach((p, src) => {
    const words = p.replace(/[.,;:!?…()]/g, "").split(/\s+/).filter(Boolean);
    // Ausschnitte duerfen ueberall beginnen - aber nur, wenn Anfang UND Ende
    // eine Fuegung nicht zerreissen. Ein erster Versuch ohne diese Pruefung
    // brachte die Silbenzahl auf 100 Prozent und den Text zum Einsturz:
    // "Sagt mir worum es", "Der Wachmann nickt als haette".
    // NUR Anfangsstuecke. Ausschnitte aus der Mitte waren der zweite Fehlversuch:
    // Sie brachten die Silbenzahl auf 100 Prozent und den Text zum Einsturz
    // ("Nickt als haette er", "Rechenzentrum zwischen zwei"). Ein Ausschnitt aus
    // der Mitte hat keinen Satzanfang - das laesst sich nicht durch eine Wortliste
    // heilen. Der Anfang bleibt also stehen, gekuerzt wird nur hinten.
    for (let a = 0; a < 1; a++) {
      for (let n = a + 2; n <= Math.min(a + 8, words.length); n++) {
        const sub = stripDanglingTail(words.slice(a, n));
        if (sub.length < 2) continue;
        if (!darfEnden(sub[sub.length - 1]!)) continue;
        const last = sub[sub.length - 1]!, next = words[n];
        if (next && /^[A-ZÄÖÜ]/.test(next) && /^[a-zäöü]/.test(last) && /(em|en|er|es|e)$/.test(last)) continue;
        const text = sub.join(" "), key = text.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ text, syll: haikuSyllOf(text), src, ganz: a === 0 && n === words.length });
      }
    }
  });
  return out;
}


// Funktionswoerter nicht mitten in der Zeile grossschreiben ("Nur Die Zeit" -> "Nur die Zeit").
const HAIKU_LC = new Set(["die","der","das","den","dem","des","ein","eine","einen","einem","einer","und","oder","aber","im","in","auf","an","mit","von","zu","zur","zum","als","wie","nur","noch","auch","so","dann","doch","ohne","bei","aus"]);
function fixHaikuCaps(line: string): string {
  return String(line).split(/\s+/).map((w, i) => (i > 0 && HAIKU_LC.has(w.toLowerCase()) ? w.toLowerCase() : w)).join(" ");
}

export function applyHaikuPoem(rawText: string, anchorLine = "", lenTarget = 0, atome: string[] = []): string {
  // F.2: maxHaikus stand fest auf 3, bei Ziel 240 also 32 Woerter. Ein Haiku
  // traegt rund zwoelf Woerter; nach oben gedeckelt, weil zwanzig Haiku am Stueck
  // die Form sprengen; gemessen bleiben die Zeilenwiederholungen dabei bei 0 %.
  const opts = lenTarget > 0
    ? { ...HAIKU_DEFAULTS, maxHaikus: Math.max(2, Math.min(40, Math.round(lenTarget / 12))) }
    : HAIKU_DEFAULTS;
  let t = normalizeNewlines(rawText || "").trim().replace(/\([^()]*\)/g, " ")
    .replace(/[„“”"»«]/g, " ")                                   // keine Anfuehrungszeichen im Haiku
    .replace(/\b(den|dem|einen|einem|der|die|das)\s+Satz\b/gi, " ")  // Zitat-Traeger "den Satz …" entfernen
    .replace(/\bShot\s*\d+\b.*$/gim, "").replace(/\b\d{1,2}\s*:\s*\d{2}\b\s*—\s*/g, "").replace(/\s+/g, " ").trim();
  let phrases: string[] = [];
  for (const s of splitSentences(t)) phrases.push(...String(s).split(/[,;:—–]\s*/g).map((p) => p.trim()).filter(Boolean));
  phrases = phrases.map((p) => p.replace(/^Und\s+/i, "").trim()).filter((p) => p.length >= 4);
  const concrete = phrases.filter((p) => !/^(aber|denn|weil|dass|ob|doch|also)\b/i.test(p))
    .filter((p) => !/\b(Wahrheit|Bedeutung|Einsatz|Gültigkeit|Prinzip|Kontrolle|bedeutet|vielleicht)\b/i.test(p));
  if (concrete.length >= 2) phrases = concrete;
  // F.3: Wenn Atome vorliegen, sind SIE das Material. Die aus Prosa geschnittenen
  // Phrasen bleiben als Rueckfall - fuer den Fall, dass der Vorrat zu klein ist.
  if (atome.length >= 6) phrases = atome.map((a) => a.trim()).filter((a) => a.length >= 4);
  phrases = reimDedupePhrases(phrases);
  const anchor = anchorLine.trim();
  if (!phrases.length) phrases = [anchor || "ein Satz bleibt zurück"];

  const cands = haikuCandidatesFromPhrases(phrases);
  const used = new Set<string>(), usedSrc = new Set<number>();
  // Reihenfolge der Vorlieben: ganze Einheit mit genau passender Silbenzahl,
  // dann angeschnittene mit genauer Zahl, dann ganze mit einer Silbe daneben,
  // zuletzt angeschnittene daneben. Vorher entschied nur die Silbenzahl - so
  // gewann oft ein Anschnitt gegen eine passende ganze Fuegung, und 5-7-5 stimmte
  // in nur 32 Prozent der Haiku.
  // Reihenfolge der Vorlieben: ganze Einheit aus einer noch unbenutzten Quelle,
  // dann ganze Einheit, dann Ausschnitt aus unbenutzter Quelle, dann Ausschnitt.
  // Die Silbenzahl muss dabei GENAU stimmen - fuer "eine daneben" gibt es eine
  // zweite Runde, die erst laeuft, wenn auch die Banken nichts hergeben.
  const fromMaterial = (target: number, exakt = true): string | null => {
    const free = cands.filter((c) => !used.has(c.text.toLowerCase())
      && (exakt ? c.syll === target : Math.abs(c.syll - target) === 1));
    const stufen: Cand[][] = [
      free.filter((c) => c.ganz && !usedSrc.has(c.src)),
      free.filter((c) => c.ganz),
      free.filter((c) => !usedSrc.has(c.src)),
      free,
    ];
    const treffer = stufen.find((x) => x.length);
    const c = treffer ? pick(treffer) : null;
    if (!c) return null; used.add(c.text.toLowerCase()); usedSrc.add(c.src); return c.text;
  };
  // Nur exakt. Vorher war eine Silbe daneben erlaubt - und die Banken selbst
  // hielten das Mass nicht ein (KIGO 12 von 15, NATURE7 5 von 9, CLOSERS 5 von 9
  // stimmten). Beides zusammen ergab 5-7-5 in nur 32 Prozent der Haiku. Die
  // Eintraege sind berichtigt, die Auswahl nimmt jetzt nichts Ungenaues mehr.
  const fromBank = (bank: string[], target: number): string | null => {
    const free = bank.filter((l) => !used.has(l.toLowerCase()) && haikuSyllOf(l) === target);
    if (!free.length) return null;
    const l = pick(free); used.add(l.toLowerCase()); return l;
  };
  const sourceWords: string[] = [];
  for (const p of phrases) sourceWords.push(...p.replace(/[.,;:!?…]/g, "").split(/\s+/).filter(Boolean));
  if (!sourceWords.length) sourceWords.push("Stille");
  let stream = reimShuffle(sourceWords);
  // Letzter Ausweg. Mehrere Anlaeufe, damit die Silbenzahl wenigstens hier
  // getroffen wird - ein Haiku, das das Mass verfehlt, ist keines.
  const greedyLine = (target: number): string => {
    let bester = "", besteAbw = 99;
    for (let versuch = 0; versuch < 8; versuch++) {
      if (stream.length < 8) stream = stream.concat(reimShuffle(sourceWords));
      const lw = stripDanglingTail(buildSyllableLine(stream, target).words);
      if (!lw.length) continue;
      const text = lw.join(" ");
      const abw = Math.abs(haikuSyllOf(text) - target);
      if (abw < besteAbw) { besteAbw = abw; bester = text; }
      if (!abw) break;
    }
    return bester || pick(sourceWords);
  };

  const haikus: string[][] = [];
  for (let h = 0; h < opts.maxHaikus; h++) {
    const [t1, t2, t3] = opts.pattern as [number, number, number];
    const l1 = (chance(0.75) ? fromBank(HAIKU_KIGO, t1) : null) || fromMaterial(t1)
      || fromBank(HAIKU_KIGO, t1) || fromMaterial(t1, false) || greedyLine(t1);
    let l2 = fromMaterial(t2) || fromBank(HAIKU_NATURE7, t2) || fromMaterial(t2, false) || greedyLine(t2);
    const l3 = fromMaterial(t3) || fromBank(HAIKU_CLOSERS, t3) || fromMaterial(t3, false) || greedyLine(t3);
    if (chance(0.7)) l2 += " –";
    haikus.push([fixHaikuCaps(cap(capLine(l1))), fixHaikuCaps(cap(capLine(l2))), fixHaikuCaps(cap(capLine(l3)))]);
    if (cands.length < 4) break;
  }
  if (!haikus.length) haikus.push(["Stille bleibt hier", "ohne jede klare Antwort", "und ohne die Zeit"]);
  return normalizeNewlines(haikus.map((h) => h.join("\n")).join("\n\n")).replace(/[„“”"»«]/g, "").replace(/\n{3,}/g, "\n\n").trim();
}
