// Bauplan-Spur: hält fest, aus welchen Atomen ein Rekombinations-Text entstand.
// Analog zum Markov-Trace — der Assembler schreibt, die UI liest.
export interface TraceSchritt {
  text: string;            // der gesetzte Text (Slots bereits gefüllt)
  quelle: string;          // wortbank | vorlage
  kategorie: string;       // motifs | hooks | props | turns | obstacles | stakes | endings | —
  typ: string;             // hauptsatz | nominalphrase | kopf | rahmen …
  phase: string;           // exposition | verdichtung | umschlag | schluss
  fueller?: { text: string; kategorie: string }[];   // was in die Slots kam
}
let spur: TraceSchritt[] = [];
let abweichung: string[] = [];
export function resetTrace(): void { spur = []; abweichung = []; }
export function pushTrace(s: TraceSchritt): void { spur.push(s); }
export function getTrace(): TraceSchritt[] { return spur.slice(); }

/** 0.1 Bauplan/Text-Abgleich: Steht jedes gesetzte Element auch im fertigen Text?
 *  Verschlucktes Material ist ein Fehler in Verfugung oder Nachbearbeitung. */
export function pruefeAbgleich(endtext: string): string[] {
  const norm = (t: string): string => t.toLowerCase().replace(/[^a-zäöüß ]/g, " ").replace(/\s+/g, " ").trim();
  const ziel = norm(endtext);
  abweichung = [];
  for (const s of spur) {
    const kern = norm(s.text);
    if (!kern) continue;
    const w = kern.split(" ");
    const probe = w.length > 4 ? w.slice(1, -1).join(" ") : kern;   // Ränder darf die Verfugung ändern
    if (probe && !ziel.includes(probe)) abweichung.push(s.text);
  }
  return abweichung.slice();
}
export function getAbweichung(): string[] { return abweichung.slice(); }
/** 0.4 Anteil der Fügeteile an allen gesetzten Elementen. */
export function fuegeteilAnteil(): number {
  if (!spur.length) return 0;
  return spur.filter((s) => s.quelle === "vorlage").length / spur.length;
}
