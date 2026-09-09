// Quelltext (vormals Zeitlupe) — der Bau eines Textes in Stufen (4.347.0, umbenannt 4.355.0).
//
// Gewünscht: den Bau eines Textes in Zeitlupe betrachten, Stop-and-go. Ein
// Text entsteht in einer festen Folge von Stufen; hier hält jede Stufe ein
// Bild des Textes fest, wie sie ihn hinterlässt. Die Ansicht spielt die Bilder
// ab und markiert, was jede Stufe verändert hat. Der Rekorder gilt nur für
// den letzten gebauten Text (kein Speicher, keine Projektdatei), kostet ein
// paar Strings je Erzeugung und ist aus, solange niemand ihn anschaltet — die
// Ansicht schaltet ihn ein, wenn sie offen ist.
export interface Stufe { name: string; text: string; kurz: string; schritte?: Schritt[] }

/** Stufe 3 (4.354.0): ein Schritt des Zusammenbaus — ein gezogenes Atom mit
 *  der Entscheidung dahinter und den Konkurrenten, die es nicht wurden. */
export interface Konkurrent { text: string; score: number; anteil: number; rang?: number; quelle: string; kategorie: string }
export interface Schritt {
  nr: number;
  text: string;          // der Text NACH diesem Schritt
  atom: string;          // der gesetzte Satz
  phase: string;
  slot: string;          // erwarteter Atomtyp (Rhythmus-Gewicht)
  quelle: string; kategorie: string; typ: string;
  score: number; anteil: number;       // Gewicht des Gewinners und sein Anteil an der Ziehung
  rang?: number; bester?: number; durchschnitt?: number;   // Platz im Feld, bestes Gewicht, Durchschnitt
  gruende: { name: string; wert: number }[];   // Zerlegung des Gewichts
  kandidaten: number;
  konkurrenten: Konkurrent[];          // die zwei nächstbesten
}

let an = false;
let stufen: Stufe[] = [];
let laufend: Stufe[] = [];
// Gemeldet: "Vom Bau bis zum Ende? Stimmt das?" — Bau und Ende zeigten zwei
// verschiedene Texte. Bei Bestenauslese und Varianten baut die Maschine
// mehrere Kandidaten hintereinander; der Rekorder hielt nur den LETZTEN
// Lauf, das Studio zeigte aber den Sieger. Darum jetzt: je Lauf eine
// Aufzeichnung, gemerkt unter ihrem Endtext; die Ansicht holt die, deren
// Ende der gezeigte Text ist. Ein Dutzend Läufe bleiben im Gedächtnis.
const aufzeichnungen = new Map<string, Stufe[]>();
const schluessel = (t: string): string => (t || "").replace(/\s+/g, " ").trim();

/** Erläuterung je Stufenname — was diese Stufe tut. Steht in der Ansicht. */
export const STUFEN_ERKLAERUNG: Record<string, string> = {
  "Bau": "Die Struktur füllt ihre Schläge oder der Zusammenbau zieht seine Atome — der Rohtext.",
  "Ensemble": "Mehrere Personen im Wer werden als Ensemble eingewoben.",
  "Betonung": "Die vier W kommen zu Wort: Ort, Zeit, Figur, Vorgang werden in eigenen Zeilen betont.",
  "Störung": "Der Disruptor bricht: Echo, Fragmentierung, ein Strich mitten im Text.",
  "Rhythmus": "Satzlängen nach dem Rhythmus-Regler: Staccato teilt, Fluss verbindet.",
  "Spannung": "Regler oder Kurve: Sätze werden an tragfähigen Kommas geteilt, Fragmente eingestreut, am Peak verdichtet.",
  "Perspektive": "Ich, Du, Wir oder dritte Person — Pronomen und Verben folgen.",
  "Schliff": "Kongruenz, Fragezeichen, Nominativ, Formeln, Artikel, Namen — Regel für Regel, jede aus einem Blatt.",
  "Ton": "Die Ton-Einfärbung: Einleitung, Flavor-Sätze, Register.",
  "Satzlänge": "Dubletten fallen, kurze Nachbarn werden bis zur Obergrenze verbunden.",
  "Kohärenz": "Themenfremde Sätze fallen, Reparaturen an Brüchen; der Bogen schützt seine Wörter.",
  "Auffüllen": "Auf die Ziellänge: Bilder, Wenden, Haken aus dem Preset oder Ketten aus dem Korpus — bis nichts Frisches mehr da ist.",
  "Verwandlung": "Motivverwandlungen zählen Vorkommen im fertigen Text und tauschen beim Wiederkehren.",
  "Ende": "Der letzte kleine Schliff: Artikel, Pronomen, Komma vor der Inversion.",
};

export function zeitlupeAn(): boolean { return an; }
export function zeitlupeSchalten(a: boolean): void { an = a; if (!a) { laufend = []; } }

/** Beginn einer Erzeugung: die laufende Aufzeichnung wird geleert. */
export function zeitlupeStart(): void { if (an) { laufend = []; schritteLaufend = []; } }

/** Eine Stufe festhalten. Gleiche Texte hintereinander werden trotzdem
 *  gehalten — die Ansicht zeigt dann „ohne Änderung", und das ist eine
 *  Information: Die Stufe hatte hier nichts zu tun. */
export function zeitlupeStufe(name: string, text: string): void {
  if (!an) return;
  const st: Stufe = { name, text: String(text || ""), kurz: STUFEN_ERKLAERUNG[name] || "" };
  if (name === "Bau" && schritteLaufend.length) { st.schritte = schritteLaufend; schritteLaufend = []; }
  laufend.push(st);
}

/** Ein Schritt des Zusammenbaus — hängt an der zuletzt begonnenen Stufe
 *  „Bau". Wird gerufen, BEVOR die Stufe „Bau" ihr Gesamtbild bekommt; die
 *  Schritte sammeln sich in einer eigenen Liste und werden beim Festhalten der
 *  Stufe „Bau" an sie gehängt. */
let schritteLaufend: Schritt[] = [];
export function zeitlupeSchritt(s: Omit<Schritt, "nr">): void {
  if (!an) return;
  schritteLaufend.push({ ...s, nr: schritteLaufend.length + 1 });
}

/** Ende einer Erzeugung: die Aufzeichnung wird zum letzten Bau. */
export function zeitlupeEnde(): void {
  if (!(an && laufend.length)) return;
  stufen = laufend; laufend = [];
  aufzeichnungen.set(schluessel(stufen[stufen.length - 1]!.text), stufen);
  if (aufzeichnungen.size > 12) { const erster = aufzeichnungen.keys().next().value; if (erster !== undefined) aufzeichnungen.delete(erster); }
}

/** Die Aufzeichnung zu einem Text — oder, ohne Angabe, die letzte. Gibt es
 *  zum Text keine (er kam nicht durch den Bau, oder der Lauf ist verjährt),
 *  ist das Ergebnis leer: Die Ansicht sagt es, statt den falschen Lauf zu
 *  zeigen. */
export function zeitlupeLesen(text?: string): Stufe[] {
  if (text === undefined) return stufen;
  return aufzeichnungen.get(schluessel(text)) || [];
}

// ── Änderungsmarken: Satzdiff zwischen zwei Stufen ─────────────────────────
export type Marke = "gleich" | "neu" | "geaendert";
export interface Diff { saetze: { text: string; marke: Marke }[]; gefallen: string[] }

const saetze = (t: string): string[] => (t || "").replace(/\n+/g, " ").split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
const norm = (s: string): string => s.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();
const staemme = (s: string): Set<string> => new Set((norm(s).match(/[a-zäöüß]{4,}/g) || []).map((w) => w.slice(0, 5)));
const aehnlich = (a: string, b: string): boolean => {
  const A = staemme(a), B = staemme(b);
  if (!A.size || !B.size) return false;
  let g = 0; for (const x of A) if (B.has(x)) g++;
  return g / Math.min(A.size, B.size) >= 0.6 && g >= 2;
};

/** Was hat die Stufe getan? Sätze des Nachher, markiert: gleich (stand schon
 *  im Vorher), geändert (ein ähnlicher Satz stand dort), neu; dazu die Sätze
 *  des Vorher, die nirgends mehr auftauchen. */
export function stufenDiff(vorher: string, nachher: string): Diff {
  const alt = saetze(vorher), neu = saetze(nachher);
  const altNorm = alt.map(norm);
  const verbraucht = new Set<number>();
  const out: { text: string; marke: Marke }[] = [];
  for (const s of neu) {
    const n = norm(s);
    let idx = altNorm.findIndex((a, i) => !verbraucht.has(i) && a === n);
    if (idx >= 0) { verbraucht.add(idx); out.push({ text: s, marke: "gleich" }); continue; }
    idx = alt.findIndex((a, i) => !verbraucht.has(i) && aehnlich(a, s));
    if (idx >= 0) { verbraucht.add(idx); out.push({ text: s, marke: "geaendert" }); continue; }
    out.push({ text: s, marke: "neu" });
  }
  const gefallen = alt.filter((_, i) => !verbraucht.has(i));
  return { saetze: out, gefallen };
}
