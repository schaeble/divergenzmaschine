// Omnikognition / Wahrnehmungs-Modus: ein Kognitionsprofil formt Perspektive,
// Rhythmus, Struktur und Bildwelt eines Textes (Umwelt-Idee nach von Uexküll).
import type { Bank } from "../types";

export interface CognitiveProfile {
  name: string;
  channels: string[];                                   // licht schall geruch efeld magnet vibration temperatur
  dim: "2d" | "3d"; reach: "nah" | "fern"; medium: "wasser" | "luft" | "boden";
  zeit: "schnell" | "mittel" | "langsam";
  aufloesung: "grob" | "mittel" | "fein";
  fokus: string[];                                      // objekt bewegung nahrung feind sozial muster
  gedaechtnis: "angeboren" | "kurz" | "lang";
  kommunikation: string;                                // sprache laut duft licht efeld chem beruehrung
  strategie: "reflex" | "instinkt" | "lern" | "planend";
  modell: "kein" | "schwach" | "stark" | "verteilt";
  ziel: string[];                                       // nahrung fortpflanzung kooperation revier schwarm ueberleben
}

// ---- Sinnes-Vokabular je Kanal (Motive/Aufhänger/Wendungen) ----
type Pools = { motifs: string[]; hooks: string[]; turns: string[] };
const SENSE: Record<string, Pools> = {
  licht: {
    motifs: ["ein Flackern am Rand des Sehfelds", "ein Schatten, der sich zu früh bewegt", "ein Glanz auf nasser Haut", "ein Muster aus Hell und Dunkel", "eine Farbe, die keinen Namen kennt"],
    hooks: ["ein Aufblitzen", "ein Umriss gegen die Helligkeit", "ein Reflex auf der Oberfläche", "ein Wechsel im Licht"],
    turns: ["das Licht kippt und alles wird flach", "ein Schatten löst sich vom Grund", "die Helligkeit frisst die Form"],
  },
  schall: {
    motifs: ["ein Echo, das zu spät zurückkommt", "ein Ton unter der Hörschwelle", "ein Puls, der den Raum abtastet", "eine Stille mit Kanten", "ein Nachhall ohne Ursprung"],
    hooks: ["ein fernes Klopfen", "ein Ping aus der Schwärze", "ein Rascheln, das näher kommt", "ein doppeltes Echo"],
    turns: ["das Echo verrät die Wand", "der Klang biegt sich um ein Hindernis", "die Stille bricht in Fragmente"],
  },
  geruch: {
    motifs: ["eine Duftspur, die noch warm ist", "ein Geruch von gestern", "eine Fährte, die sich verzweigt", "ein süßlicher Faden in der Luft", "eine Marke, die jemand hinterließ"],
    hooks: ["ein Hauch von Nähe", "eine fremde Note", "ein Umschlag im Geruch", "eine Spur, die abreißt"],
    turns: ["die Fährte teilt sich", "der Duft kippt von süß zu sauer", "der Wind löscht die Spur"],
  },
  efeld: {
    motifs: ["ein Kribbeln im Wasser", "ein Feld, das sich zusammenzieht", "eine Ladung, die näherkommt", "ein Muster aus Spannung", "eine Störung im leeren Raum"],
    hooks: ["ein Zucken im Feld", "eine Spannung, die anschwillt", "ein toter Fleck ohne Ladung", "ein Knistern der Nähe"],
    turns: ["das Feld verrät den Körper dahinter", "die Ladung kippt und wird zur Falle", "der Raum lädt sich auf"],
  },
  magnet: {
    motifs: ["eine Richtung, die im Körper sitzt", "eine Linie, die nach Norden zieht", "ein stiller Kompass im Kopf", "ein Gefälle ohne Hang", "eine Karte aus Kraftlinien"],
    hooks: ["ein Zug nach einer Seite", "eine Abweichung der inneren Nadel", "ein Knick in der Richtung"],
    turns: ["die Linie verschiebt sich", "der Norden lügt heute", "das Feld dreht die Absicht"],
  },
  vibration: {
    motifs: ["ein Zittern im Boden", "eine Welle durch die Fläche", "ein Beben, kaum spürbar", "ein Puls im Untergrund", "eine Erschütterung ohne Geräusch"],
    hooks: ["ein Schritt weit entfernt", "ein Beben unter den Füßen", "eine Welle, die anrollt"],
    turns: ["die Erschütterung wird zur Warnung", "das Zittern verdichtet sich", "der Boden antwortet"],
  },
  temperatur: {
    motifs: ["ein Wärmefleck in der Kälte", "ein Gefälle aus Wärme", "ein kalter Sog", "eine Spur aus Körperwärme", "eine Grenze zwischen warm und kalt"],
    hooks: ["ein Hauch von Wärme", "ein kalter Zug", "ein warmer Schatten", "ein Umschlag der Temperatur"],
    turns: ["die Wärme verrät den Körper", "die Kälte kriecht näher", "das Gefälle kehrt sich um"],
  },
};
const BASE = {
  props: ["den eigenen Körper", "die Grenze der Wahrnehmung", "einen Rest der letzten Spur", "den nächsten Reiz", "das Muster der Umgebung", "ein Signal ohne Absender"],
  obstacles: ["der Reiz bricht ab", "zwei Signale überlagern sich", "die Spur führt ins Leere", "etwas stört das Feld", "die Wahrnehmung trügt", "der Reiz kommt zu spät"],
  stakes: ["Der Einsatz ist Nahrung.", "Der Einsatz ist Überleben.", "Der Einsatz ist die richtige Richtung.", "Der Einsatz ist Nähe.", "Der Einsatz ist der nächste Atemzug."],
  endings: ["Und der Reiz verlischt.", "So bleibt nur das Muster.", "Und die Spur war schon vergangen.", "Am Ende zählt nur der nächste Reiz.", "Und die Welt schrumpft auf ein Signal."],
};

export function buildSenseBank(channels: string[]): Bank {
  const chs = (channels.length ? channels : ["licht", "schall"]).filter((c) => SENSE[c]);
  const motifs: string[] = [], hooks: string[] = [], turns: string[] = [];
  for (const c of chs) { const p = SENSE[c]!; motifs.push(...p.motifs); hooks.push(...p.hooks); turns.push(...p.turns); }
  return { motifs, hooks, props: [...BASE.props], turns, obstacles: [...BASE.obstacles], stakes: [...BASE.stakes], endings: [...BASE.endings] };
}

export interface PendingStudio {
  where: string; when: string; who: string; what: string;
  form: string; structure: string; perspective: string; rhythm: string; varLevel: string; mode: string; tone: string; markovMode: string;
  emphasis: { wo: number; wann: number; wer: number; was: number };
  bank: Bank;
}

const MEDIUM_WHERE: Record<string, string> = { wasser: "im offenen Wasser", luft: "hoch in der Luft", boden: "tief im Boden" };
const ZIEL_WHAT: Record<string, string> = { nahrung: "sucht Nahrung", fortpflanzung: "sucht einen Partner", kooperation: "hält den Verband", revier: "verteidigt das Revier", schwarm: "folgt dem Schwarm", ueberleben: "will überleben" };

export function profileToStudio(p: CognitiveProfile): PendingStudio {
  const cap = (n: number): number => Math.max(0, Math.min(3, n));
  const isVerbal = p.kommunikation === "sprache" || p.kommunikation === "laut";
  return {
    where: MEDIUM_WHERE[p.medium] || "an einem Ort",
    when: p.gedaechtnis === "lang" ? "nach vielen Wanderungen" : "",
    who: p.name || "ein Wesen",
    what: ZIEL_WHAT[p.ziel[0] || "ueberleben"] || "will überleben",
    form: isVerbal ? "script" : "prose",
    structure: ({ reflex: "fragment", instinkt: "circle", lern: "reverse", planend: "linear" } as const)[p.strategie],
    perspective: ({ kein: "object", schwach: "third", stark: "first", verteilt: "we" } as const)[p.modell],
    rhythm: ({ schnell: "staccato", mittel: "auto", langsam: "long" } as const)[p.zeit],
    varLevel: ({ grob: "low", mittel: "mid", fein: "high" } as const)[p.aufloesung],
    mode: "body",
    tone: (p.ziel.includes("ueberleben") || p.ziel.includes("revier") || p.fokus.includes("feind")) ? "dark" : "poetic",
    markovMode: p.gedaechtnis === "lang" ? "mix" : "off",
    emphasis: {
      wo: p.reach === "fern" ? 2 : 1,
      wann: p.gedaechtnis === "lang" ? 2 : p.gedaechtnis === "kurz" ? 1 : 0,
      wer: p.fokus.includes("sozial") ? 2 : 0,
      was: cap((p.fokus.some((f) => ["nahrung", "feind", "bewegung"].includes(f)) ? 2 : 0) + (p.ziel.length ? 1 : 0)),
    },
    bank: buildSenseBank(p.channels),
  };
}

export function buildOmniPrompt(p: CognitiveProfile): string {
  const j = (a: string[]): string => a.join(", ") || "—";
  return "Schreibe einen kurzen deutschen Prosatext STRIKT aus der Umwelt (Wahrnehmungswelt) eines Lebewesens mit dem "
    + "folgenden Wahrnehmungsprofil. Kein menschlicher Blick von außen, keine Erklärungen, keine Fachbegriffe — nur die "
    + "gelebte Sinneslogik dieses Wesens, in Bildern seiner Sinne.\n\n"
    + `Sinneskanäle: ${j(p.channels)}\nRaum: ${p.dim}, ${p.reach}, Medium ${p.medium}\nZeit: ${p.zeit}\n`
    + `Auflösung: ${p.aufloesung}\nFokus: ${j(p.fokus)}\nGedächtnis: ${p.gedaechtnis}\nKommunikation: ${p.kommunikation}\n`
    + `Entscheidung: ${p.strategie}\nSelbst-/Umweltmodell: ${p.modell}\nLebensziel: ${j(p.ziel)}\nWesen: ${p.name || "unbenannt"}\n\n`
    + "Gib NUR den Text zurück.";
}

export const OMNI_PRESETS: Record<string, CognitiveProfile> = {
  fledermaus: { name: "eine Fledermaus", channels: ["schall", "vibration"], dim: "3d", reach: "nah", medium: "luft", zeit: "schnell", aufloesung: "fein", fokus: ["bewegung", "nahrung"], gedaechtnis: "kurz", kommunikation: "laut", strategie: "reflex", modell: "schwach", ziel: ["nahrung"] },
  oktopus: { name: "ein Oktopus", channels: ["licht", "geruch"], dim: "3d", reach: "nah", medium: "wasser", zeit: "mittel", aufloesung: "fein", fokus: ["objekt", "muster"], gedaechtnis: "lang", kommunikation: "licht", strategie: "lern", modell: "verteilt", ziel: ["ueberleben"] },
  ameise: { name: "ein Ameisenvolk", channels: ["geruch", "vibration"], dim: "2d", reach: "nah", medium: "boden", zeit: "mittel", aufloesung: "mittel", fokus: ["sozial", "muster"], gedaechtnis: "kurz", kommunikation: "duft", strategie: "instinkt", modell: "verteilt", ziel: ["schwarm", "kooperation"] },
  zugvogel: { name: "ein Zugvogel", channels: ["licht", "magnet"], dim: "3d", reach: "fern", medium: "luft", zeit: "mittel", aufloesung: "mittel", fokus: ["muster", "bewegung"], gedaechtnis: "lang", kommunikation: "laut", strategie: "planend", modell: "schwach", ziel: ["ueberleben", "schwarm"] },
  hai: { name: "ein Hai", channels: ["efeld", "geruch", "vibration"], dim: "3d", reach: "nah", medium: "wasser", zeit: "schnell", aufloesung: "fein", fokus: ["bewegung", "nahrung", "feind"], gedaechtnis: "angeboren", kommunikation: "efeld", strategie: "reflex", modell: "kein", ziel: ["nahrung"] },
  tiefsee: { name: "ein Tiefseewesen", channels: ["licht", "vibration", "efeld"], dim: "3d", reach: "nah", medium: "wasser", zeit: "langsam", aufloesung: "grob", fokus: ["bewegung", "nahrung"], gedaechtnis: "angeboren", kommunikation: "licht", strategie: "reflex", modell: "kein", ziel: ["nahrung", "ueberleben"] },
  saeugling: { name: "ein Säugling", channels: ["licht", "schall", "temperatur"], dim: "3d", reach: "nah", medium: "luft", zeit: "langsam", aufloesung: "grob", fokus: ["sozial", "bewegung"], gedaechtnis: "kurz", kommunikation: "laut", strategie: "reflex", modell: "schwach", ziel: ["kooperation"] },
  alien: { name: "ein fremdes Wesen", channels: ["magnet", "efeld", "temperatur"], dim: "3d", reach: "fern", medium: "luft", zeit: "langsam", aufloesung: "fein", fokus: ["muster"], gedaechtnis: "lang", kommunikation: "efeld", strategie: "planend", modell: "stark", ziel: ["ueberleben"] },
};
export const OMNI_PRESET_LABELS: [string, string][] = [
  ["fledermaus", "Fledermaus"], ["oktopus", "Oktopus"], ["ameise", "Ameisenvolk"], ["zugvogel", "Zugvogel"],
  ["hai", "Hai"], ["tiefsee", "Tiefseewesen"], ["saeugling", "Säugling"], ["alien", "Fremdes Wesen"],
];
