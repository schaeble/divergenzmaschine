// Atom-Schema für den Rekombinations-Modus: die deklarierte Schnittstelle jedes
// Bausteins. Anschlussregeln stehen bewusst als EINE Typmatrix hier und nicht
// je Atom in der Datei — sie sind Eigenschaft des Typs, nicht des Einzelfalls.

export const ATOM_TYPEN = [
  "hauptsatz", "nebensatz", "nominalphrase", "praepositionalphrase",
  "rahmen", "fragment", "einwort", "konnektor", "kopf",
] as const;
export type AtomTyp = (typeof ATOM_TYPEN)[number];

export const KASUS = ["nom", "gen", "dat", "akk", "nom_akk"] as const;
export type Kasus = (typeof KASUS)[number];
export const REGISTER = ["nuechtern", "pathetisch", "buerokratisch", "maerchenhaft", "technisch", "lakonisch"] as const;
export type Register = (typeof REGISTER)[number];
export type Kadenz = "fallend" | "offen" | "schwebend";
export type Tempus = "praesens" | "praeteritum" | "perfekt" | "futur" | "kein";
export type Modus = "indikativ" | "konjunktiv" | "imperativ" | "kein";

export interface Slot { rolle: string; kasus: Kasus; art: AtomTyp; }
export interface Subjekt { person: 1 | 2 | 3; numerus: "sg" | "pl"; genus: "mask" | "fem" | "neut" | null; }
export interface Bezug { pronomen: string; genus: string; numerus: string; }
export interface Rhythmus { woerter: number; silben: number; tiefe: number; endzeichen: string; gewicht: "kurz" | "mittel" | "lang"; }

export interface Atom {
  id: string; text: string;
  quelle: "wortbank" | "ton" | "kontext" | "pools" | "markov" | "vorlage";
  welt: string[];                 // leer = weltneutral
  bildfeld: string[];             // grobe Motivklassen für das Kohärenz-Scoring
  typ: AtomTyp;
  verlangt: Slot | null;          // nur bei typ "rahmen"; Platzhalter im text als ⟨SLOT⟩
  bietet: { kasus: Kasus | null; kadenz: Kadenz };
  subjekt: Subjekt | null;
  tempus: Tempus; modus: Modus;
  oeffnet: boolean;               // endet auf Doppelpunkt, verlangt einen Nachsatz
  schliesst: boolean;             // bedient einen offenen Kopf
  fuehrt_ein: string[];
  verlangt_bezug: Bezug | null;
  rhythmus: Rhythmus;
  register: Register;
  bruchgrad: 0 | 1 | 2 | 3;
  person_wandelbar: boolean; tempus_wandelbar: boolean; fest: boolean;
}

/** Anschlussmatrix: welcher Typ darf auf welchen folgen. Einmal statt 2444-fach. */
const N: AtomTyp[] = ["hauptsatz", "nebensatz", "nominalphrase", "praepositionalphrase", "rahmen", "fragment", "einwort", "konnektor", "kopf"];
export const FOLGT_AUF: Record<AtomTyp | "start", AtomTyp[]> = {
  start:                ["hauptsatz", "rahmen", "kopf", "nominalphrase", "praepositionalphrase", "einwort", "fragment"],
  hauptsatz:            N,
  nebensatz:            ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor"],
  nominalphrase:        ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor", "nebensatz"],
  praepositionalphrase: ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor"],
  rahmen:               ["hauptsatz", "rahmen", "kopf", "fragment", "einwort", "konnektor"],
  fragment:             ["hauptsatz", "rahmen", "kopf", "nominalphrase", "einwort", "konnektor"],
  einwort:              ["hauptsatz", "rahmen", "kopf", "nominalphrase", "fragment", "konnektor"],
  konnektor:            ["hauptsatz", "nominalphrase", "praepositionalphrase", "fragment", "nebensatz"],
  kopf:                 ["hauptsatz", "nominalphrase", "fragment", "einwort"],   // Kopf verlangt einen Nachsatz
};
/** Darf `b` unmittelbar auf `a` folgen? */
export const darfFolgen = (a: AtomTyp | "start", b: AtomTyp): boolean => (FOLGT_AUF[a] || []).includes(b);

/** Kann dieser Typ einen offenen Kopf bedienen? */
export const schliesstKopf = (t: AtomTyp): boolean => ["hauptsatz", "nominalphrase", "fragment", "einwort"].includes(t);

/** Divergenzschwelle: bis zu welchem Bruchgrad darf gezogen werden. */
export const schwelle = (divergenz: number): number => (divergenz < 25 ? 0 : divergenz < 55 ? 1 : divergenz < 80 ? 2 : 3);
