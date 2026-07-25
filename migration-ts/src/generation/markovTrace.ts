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
