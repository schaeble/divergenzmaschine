// Provenienz-Mitschnitt der Markov-Fragmente einer Generierung.
// buildStory setzt zu Beginn zurueck; maybeMarkov + enforceWordTarget melden
// jedes tatsaechlich eingesetzte Markov-Stueck. Die Studio-Faerbung ("Einspeisungen
// faerben") liest die Liste, um Markov-Text im Ergebnis zu markieren.
let frags: string[] = [];

export function resetMarkovTrace(): void { frags = []; }

export function traceMarkov(s: string): void {
  const t = (s || "").trim();
  if (t.length >= 5) frags.push(t);
}

export function getMarkovTrace(): string[] { return frags.slice(); }

// Wie beim Bauplan: Die Bestenauslese erzeugt zwoelf Kandidaten, jeder setzt die
// Spur zurueck - am Ende steht die des LETZTEN, nicht die des Siegers. Deshalb
// wird die Spur an ihren Text gebunden.
const schluessel = (t: string): string => t.toLowerCase().replace(/[^a-zäöüß]/g, "").slice(0, 400);
const nachText = new Map<string, string[]>();
export function linkMarkovTrace(finalText: string): void {
  if (!frags.length || !finalText) return;
  if (nachText.size > 64) { const e = nachText.keys().next().value; if (e) nachText.delete(e); }
  nachText.set(schluessel(finalText), frags.slice());
}
/** Spur zum tatsaechlich ausgegebenen Text - sonst die zuletzt erzeugte. */
export function getMarkovTraceFor(text: string): string[] {
  return nachText.get(schluessel(text || "")) ?? frags.slice();
}
