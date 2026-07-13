import type { Bank } from "./types";

// ── Speicher-Schlüssel (localStorage) ────────────────────────────────
export const STORAGE_BANK     = "divergenz_wordbank_v1";
export const STORAGE_CORPUS   = "divergenz_persistent_corpus_v1";
export const STORAGE_SETTINGS = "divergenz_settings_v1";
export const STORAGE_PRESETS  = "divergenz_bank_presets_v1";

/** Obergrenze des persistenten Markov-Korpus (Zeichen). */
export const CORPUS_MAX = 160000;

/** Die sieben Wortbank-Kategorien in fester Reihenfolge. */
export const BANK_KEYS = [
  "motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings",
] as const;

// ── Standard-Wortbank (1:1 aus dem heutigen Code portiert) ───────────
export const DEFAULT_BANK: Bank = {
  motifs: [
    "eine Uhr, die rückwärts tickt",
    "eine Tür, die von innen atmet",
    "ein Spiegelbild, das zu spät reagiert",
    "ein Formular mit einem Feld zu viel",
    "ein Kabel, das warm wird, ohne Strom",
    "eine Narbe, die sich erinnert",
    "ein Name, der nicht ausgesprochen werden kann",
    "ein Licht, das die falschen Dinge zeigt",
    "ein Geräusch, das nur in Gedanken existiert",
    "eine Karte, die Orte erfindet",
  ],
  hooks: [
    "eine rote Feder im falschen Winkel",
    "ein Lichtstreifen, der aus dem Nichts kommt",
    "ein leises Klopfen hinter der Wand",
    "ein Foto, das ein Detail mehr zeigt als gestern",
    "ein Schatten, der nicht zur Figur passt",
    "eine Nachricht ohne Absender",
    "eine Tür, die plötzlich nicht mehr Tür sein will",
  ],
  props: [
    "einen Schlüssel", "eine Karte", "eine Münze", "ein Foto", "ein Notizbuch",
    "eine Lampe", "ein Stück Kreide", "einen Kompass", "einen Ausweis", "ein Siegel",
  ],
  turns: [
    "plötzlich passt die Zeit nicht mehr zu den Uhren",
    "die Spur führt nicht nach außen, sondern nach innen",
    "das Offensichtliche wird unbenennbar",
    "etwas antwortet – ohne Stimme",
    "die Logik bleibt bestehen, aber in falscher Reihenfolge",
  ],
  obstacles: [
    "die Tür ist verschlossen",
    "jemand hört mit",
    "die eigene Wahrnehmung wackelt",
    "eine Regel gilt, die niemand erklärt",
    "die Akte trägt das falsche Datum",
  ],
  stakes: [
    "Der Einsatz ist Mut.",
    "Der Einsatz ist Zeit: Ein Teil des Abends kommt nicht zurück.",
    "Der Einsatz ist Wahrheit: Etwas am Selbstbild verschiebt sich.",
    "Der Einsatz ist Vertrauen: in sich selbst.",
  ],
  endings: [
    "Damit ist es entschieden.",
    "So schließt sich der Kreis.",
    "Und vielleicht beginnt es erst hier.",
    "Und die Tür fiel ins Schloss.",
    "Und es war, als hätte der Ort kurz geblinzelt.",
  ],
};
