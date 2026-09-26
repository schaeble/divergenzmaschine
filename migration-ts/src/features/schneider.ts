// Schneider-Maße: Wolf Schneiders zählbare Schreibregeln als reine Rechnung.
//
// Nicht jede seiner Regeln lässt sich zählen, und nicht jede passt auf jede
// Form. Hier stehen nur die, die sich mit Mustern ehrlich messen lassen:
//
//   · 3-Sekunden-Regel: eine Sinneinheit trägt etwa sechs Wörter oder zwölf
//     Silben; ein Teilsatz um zwölf Wörter. Gezählt wird der TEILSATZ (bis zum
//     nächsten Komma, Semikolon, Doppelpunkt, Gedankenstrich), nicht der Satz —
//     ein langer Satz aus gereihten Hauptsätzen ist nach Schneider erlaubt.
//   · Abwechslung: mäßig lange Sätze mit kurzen mischen. Gemessen als
//     Verteilung über Längenbänder, nicht als Mittelwert.
//   · Verbklammer: zwischen Hilfsverb und Partizip/Infinitiv nicht mehr als
//     sechs Wörter.
//   · Verbote: Passiv, Streckverben, Blähwörter, Füllwörter, Nebensatz vor dem
//     Hauptsatz, Genitivketten.
//
// Alle Muster sind Näherungen ohne Wortartenerkennung. Die Gegenprobe in
// test/schneider.ts hält fest, dass sie an einem absichtlich schlechten Text
// anschlagen — sonst wäre ein grünes Ergebnis wertlos.

const WORT = /[A-Za-zÄÖÜäöüß0-9]+(?:[.-][A-Za-zÄÖÜäöüß0-9]+)*/g;
export const woerter = (s: string): string[] => s.match(WORT) || [];

/** Sätze eines Fließtextes. Infokasten-Zeilen („· …"), Dach- und Schlagzeilen
 *  ohne Satzzeichen und die Abkürzungen der Titel bleiben draußen: Die erste
 *  Messung zählte „Im Frühjahr 2001: Dr." als Satz ohne Verb und meldete
 *  15,7 % verblose Sätze im Bericht — der echte Wert war null. */
export function schneiderSaetze(text: string): string[] {
  const ohne = text
    .replace(/^Faktenkasten[\s\S]*$/m, "")
    .split("\n").filter((z) => !/·/.test(z) && /[.!?…“]\s*$/.test(z.trim())).join("\n")
    .replace(/\b(Dr|Prof|Ing|St|Nr|Abs)\./g, "$1§");
  return ohne.split(/(?<=[.!?…“])\s+(?=[„»"A-ZÄÖÜ0-9])|\n+/)
    .map((s) => s.trim().replace(/§/g, "."))
    .filter((s) => woerter(s).length >= 2);
}

/** Teilsätze: getrennt an Komma, Semikolon, Doppelpunkt, Gedankenstrich.
 *  Zahlen mit Tausenderpunkt („1.700") bleiben ein Wort. */
export function teilsaetze(satz: string): string[] {
  return satz.split(/[,;:—–]|\s-\s/).map((t) => t.trim()).filter((t) => woerter(t).length > 0);
}

const AUX = /^(hat|haben|hatte|hatten|ist|sind|war|waren|wird|werden|wurde|wurden|kann|können|konnte|muss|müssen|musste|soll|sollen|sollte|will|wollen|wollte|darf|dürfen|möchte)$/;
const KLAMMER_ENDE = /^(ge[a-zäöüß]{3,}(t|en)|[a-zäöüß]+ge[a-zäöüß]+(t|en)|[a-zäöüß]+ieren|[a-zäöüß]+iert|[a-zäöüß]{3,}en)$/;

/** Größter Abstand zwischen Hilfsverb und Klammerende in einem Satz, 0 wenn keine
 *  Klammer erkannt wird. Das Klammerende muss das letzte Wort des Teilsatzes
 *  sein und klein geschrieben — ein großes Wort ist ein Nomen. */
export function verbklammer(satz: string): number {
  let best = 0;
  for (const teil of satz.split(/[,;:—–()„“"]/)) {
    const w = woerter(teil);
    if (w.length < 4) continue;
    const ai = w.findIndex((x) => AUX.test(x.toLowerCase()));
    if (ai < 0) continue;
    const letztes = w[w.length - 1]!;
    if (!/^[a-zäöüß]/.test(letztes) || !KLAMMER_ENDE.test(letztes)) continue;
    best = Math.max(best, w.length - ai - 2);
  }
  return best;
}

export const VERBOTE: [string, RegExp][] = [
  ["Passiv", /\b(wird|werden|wurde|wurden|worden)\b[^,.;:]*\bge[a-zäöüß]+(t|en)\b/],
  ["Streckverb", /\b(zur (Durchführung|Anwendung|Verfügung|Sprache|Kenntnis|Entscheidung|Aufführung) (bringen|kommen|gelangen|stellen|nehmen|gebracht|gekommen|genommen|gestellt)|in (Erwägung|Betracht|Angriff) (ziehen|gezogen|nehmen|genommen)|unter Beweis (stellen|gestellt)|Einfluss nehmen|eine Entscheidung (treffen|getroffen)|Kritik (üben|geübt)|Bezug nehmen)\b/i],
  ["Blähwort", /\b(Problematik|Thematik|Zielsetzung|Fragestellung|Aufgabenstellung|Vorgehensweise|Rahmenbedingungen|im Vorfeld|im Rahmen|seitens|bezüglich|hinsichtlich|diesbezüglich|vonseiten|im Zuge|zeitnah)\b/],
  ["Füllwort", /\b(eigentlich|gewissermaßen|sozusagen|durchaus|ziemlich|irgendwie|quasi|letztendlich|halt)\b/i],
  ["Nebensatz voran", /^(Weil|Obwohl|Nachdem|Da|Wenn|Während|Bevor|Sobald|Indem|Falls)\b[^.]*?,/],
  ["Genitivkette", /\b(des|der) [A-ZÄÖÜ][a-zäöüß]+s? (des|der|eines|einer) [A-ZÄÖÜ][a-zäöüß]+\b/],
];

export interface SchneiderBefund {
  saetze: number;
  /** Anteile der Sätze in den Längenbändern ≤5, 6–12, 13–20, 21–30, >30 Wörter. */
  baender: [number, number, number, number, number];
  median: number;
  /** Anteil der Sätze mit einem Teilsatz über zwölf Wörtern. */
  teilsatzLang: number;
  /** Anteil der Sätze mit einer Verbklammer über sechs Wörtern. */
  klammerWeit: number;
  verbote: Record<string, number>;
}

export function misseSchneider(texte: string[]): SchneiderBefund {
  const S = texte.flatMap(schneiderSaetze);
  const n = S.length || 1;
  const L = S.map((s) => woerter(s).length).sort((a, b) => a - b);
  const band = (lo: number, hi: number): number => L.filter((x) => x >= lo && x <= hi).length / n;
  const verbote: Record<string, number> = {};
  for (const [name, re] of VERBOTE) verbote[name] = S.filter((s) => re.test(s)).length / n;
  return {
    saetze: S.length,
    baender: [band(0, 5), band(6, 12), band(13, 20), band(21, 30), band(31, 9999)],
    median: L[Math.floor(L.length / 2)] || 0,
    teilsatzLang: S.filter((s) => teilsaetze(s).some((t) => woerter(t).length > 12)).length / n,
    klammerWeit: S.filter((s) => verbklammer(s) > 6).length / n,
    verbote,
  };
}
