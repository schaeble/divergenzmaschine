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
export function resetTrace(): void { spur = []; }
export function pushTrace(s: TraceSchritt): void { spur.push(s); }
export function getTrace(): TraceSchritt[] { return spur.slice(); }
