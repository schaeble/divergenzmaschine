// Die Werte der Regler — EINMAL, für alle, die sie brauchen.
//
// Entstanden aus einem Befund: Der Autopilot würfelte seine Einstellungen aus
// eigenen Listen, die er nie mit dem Studio abgeglichen hatte. Von fünf
// gewürfelten Reglern enthielten vier überwiegend Werte, die es gar nicht gibt
// — „ringkomposition", „duester", „wechsel", „mild", „er", „sie". Sie fielen
// still auf die Vorgabe zurück.
//
// Das Ergebnis war eine Maschine, die scheinbar variierte und in Wahrheit
// siebzehn Ausgaben lang fast dieselbe Einstellung fuhr. Kein Fehler, der
// irgendwo anschlägt: Ein unbekannter Wert erzeugt keine Meldung, er tut nur
// nichts. Genau deshalb steht die Liste jetzt an einer Stelle.

export type Wahlliste = [string, string][];

export const TONE_OPTS: Wahlliste = [
  ["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"],
  ["melancholisch", "Melancholisch"], ["dark", "Düster"], ["unheimlich", "Unheimlich"],
  ["uplifting", "Hoffnungsvoll"], ["zaertlich", "Zärtlich"], ["traeumerisch", "Träumerisch"],
  ["nuechtern", "Nüchtern"], ["ironisch", "Ironisch"], ["humorous", "Humorvoll"],
];

export const FORM_OPTS: Wahlliste = [
  ["prose", "Prosa"], ["poem", "Prosagedicht"], ["strang", "Gedicht-Strang"],
  ["reim", "Reim"], ["haiku", "Haiku"], ["script", "Szene/Dialog"],
  ["video", "Multi-Shot (Video)"], ["bericht", "Bericht (Zeitung)"], ["meldung", "Meldung (kurz)"],
];

export const STRUCTURE_OPTS: Wahlliste = [
  ["auto", "Auto"], ["linear", "Linear"], ["reverse", "Reverse"], ["circle", "Kreis"],
  ["fragment", "Fragment"], ["object", "Objekt"], ["dramaturgie", "Dramaturgie (Preset 2.0)"],
  ["rekombination", "Rekombination"],
  // Geregelter Mittelweg (4.337.0): die Schlagfolge des gewählten Bogens als
  // Phasenfolge, rekombinatorisch gefüllt; Bogen-Material an den Gelenken
  // bevorzugt, dosiert über die Stellschraube „Erzählbogen".
  ["bogen", "Rekombination mit Bogen"],
];

export const MODE_OPTS: Wahlliste = [
  ["auto", "Auto"], ["bureau", "Bürokratie"], ["tech", "Tech-Mystik"], ["body", "Body"],
  ["myth", "Myth"], ["absurd", "Absurd"], ["post", "Posthuman"],
];

export const PERSP_OPTS: Wahlliste = [
  ["auto", "Auto"], ["third", "Er/Sie"], ["first", "Ich"], ["second", "Du"],
  ["we", "Wir"], ["object", "Objekt"],
];

export const RHYTHM_OPTS: Wahlliste = [
  ["auto", "Auto"], ["breath", "Atem"], ["staccato", "Staccato"], ["long", "Lange Bögen"],
  ["fracture", "Fraktur"], ["clean", "Klar"],
];

export const VARIANZ_OPTS: Wahlliste = [["low", "Stabil"], ["mid", "Wild"], ["high", "Radikal"]];

export const DISRUPTOR_OPTS: Wahlliste = [["auto", "Auto"], ["off", "Aus"], ["on", "An"]];

export const ARCH_OPTS: Wahlliste = [
  ["neutral", "Neutral"], ["skorpion", "Skorpion"], ["psychopath", "Psychopath"], ["entdecker", "Entdecker"],
];

export const MARKOV_OPTS: Wahlliste = [["off", "Aus"], ["mix", "Mix"], ["on", "Stark"]];

/** Nur die Werte, ohne Beschriftung — für alles, was würfelt. */
export const werte = (l: Wahlliste): string[] => l.map(([v]) => v);

/** Ist der Wert für diesen Regler überhaupt vorgesehen? */
export const gueltig = (l: Wahlliste, v: string): boolean => l.some(([x]) => x === v);

// Drei Listen, die bis 4.285 im Studio inmitten des Aufbaus standen und
// nirgends sonst — der Wirkungsmesser führte für die Instabilität eine eigene
// Abschrift („0","1","2"), und ein Würfel außerhalb des Studios hätte eine
// vierte gebraucht. Genau so ist der Disruptor mit vier Stellungen gemessen
// worden, die es nicht gab. Deshalb stehen sie jetzt hier.
export const TENSION_OPTS: Wahlliste = [
  ["off", "Aus"], ["top", "Oben (12 Uhr)"], ["mid", "Mitte (3 Uhr)"], ["low", "Unten (6 Uhr)"],
];
export const CAST_OPTS: Wahlliste = [["0", "Offen"], ["0.5", "Mittel"], ["1", "Streng"]];
export const INSTAB_OPTS: Wahlliste = [["0", "Aus"], ["1", "Subtil"], ["2", "Aggressiv"]];
