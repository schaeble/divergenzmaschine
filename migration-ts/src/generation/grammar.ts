// Offline-Grammatik-Filter (6.5): erkennt bekannte Fehlerklassen heuristisch —
// ohne Lexikon, also nur die groben, dafür ohne Fehlalarm. Fließt als Abwertung
// ins Ranking ein, damit auffällige Varianten nach hinten rücken.

// Nur Konjunktionen: ein Satz, der auf einem dieser Wörter endet, ist fast immer
// abgebrochen. Artikel und Präpositionen sind bewusst NICHT dabei — sie können
// legitim am Satzende stehen (Verbpartikel „ging unter", Pronomen „weiß das").
const DANGLING = new Set([
  "und", "oder", "aber", "denn", "dass", "weil", "sondern", "sowie",
  "damit", "obwohl", "während", "sodass", "bevor", "nachdem", "falls", "wenngleich",
]);

export interface GrammarReport { count: number; issues: string[] }

/** Zählt heuristische Auffälligkeiten. Konservativ gehalten (lieber übersehen als falsch melden). */
export function grammarFlags(text: string): GrammarReport {
  const raw = text || "";
  const issues: string[] = [];
  let count = 0;
  const add = (n: number, label: string): void => { if (n > 0) { count += n; issues.push(`${label}: ${n}`); } };

  // 1) Mehrfach-Satzzeichen und Zeichen-Salat.
  add((raw.match(/[.!?]{2,}/g) || []).length, "Mehrfach-Satzzeichen");
  add((raw.match(/,{2,}|;{2,}|:{2,}/g) || []).length, "doppelte Trennzeichen");
  // 2) Leerzeichen vor Satzzeichen.
  add((raw.match(/\s+[,.;:!?]/g) || []).length, "Leerzeichen vor Satzzeichen");
  // 3) Verdoppelte Wörter ("der der", "die die").
  add((raw.match(/\b([a-zäöüßA-ZÄÖÜ]{2,})\s+\1\b/gi) || []).length, "Wortverdopplung");
  // 4) Fehlendes Leerzeichen nach Satzzeichen (Wort.Wort).
  add((raw.match(/[a-zäöüß][.,;:!?][A-Za-zÄÖÜ]/g) || []).length, "fehlendes Leerzeichen");

  // 5) Satz endet auf einem Funktionswort (Artikel/Präposition/Konjunktion).
  let dangling = 0;
  for (const sentence of raw.split(/(?<=[.!?…])\s+/)) {
    const m = sentence.trim().match(/([a-zäöüßA-ZÄÖÜ]+)\s*[.!?…]+\s*$/);
    if (m && DANGLING.has(m[1]!.toLowerCase())) dangling++;
  }
  add(dangling, "Satz endet auf Funktionswort");

  return { count, issues };
}

/** Abwertung fürs Ranking (0..~cap). */
export function grammarPenalty(text: string, weight = 8): number {
  return Math.min(grammarFlags(text).count, 6) * weight;
}
