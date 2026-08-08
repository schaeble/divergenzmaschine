// Werkstatt: aus einem Maschinen-Rohtext wird in drei Stufen eine Kurzgeschichte.
// 1. Gerüst (Dramaturgie)  2. Rohfassung  3. Politur.
// Die Stufen sind bewusst getrennt, damit das Gerüst vor dem Schreiben
// korrigiert werden kann — das ist der Unterschied zum bisherigen Ausarbeiten.
import { loadBank } from "../storage";
import { liveTexts } from "./livepools";

export interface WorkshopOpts {
  laenge: number;                 // Zielwörter
  perspektive: "ich" | "ersie" | "du" | "wir";
  zeitform: "praesens" | "praeteritum";
  ton: "nuechtern" | "dicht" | "poetisch" | "kalt" | "ironisch";
  schluss: "offen" | "pointe" | "kreis" | "bruch";
  arc: string;   // Erzählbogen-id (siehe ARCS), "frei" = ohne
}

export interface Outline {
  figur: string; wunsch: string; hindernis: string; wendung: string; schluss: string;
  beats: string[];
}

export const LEN_OPTS: [string, string][] = [
  ["450", "1 Seite  ≈ 450 Wörter"], ["700", "1½ Seiten  ≈ 700 Wörter"], ["900", "2 Seiten  ≈ 900 Wörter"],
];
export const PERS_OPTS: [string, string][] = [["ich", "Ich"], ["ersie", "Er/Sie"], ["du", "Du"], ["wir", "Wir"]];
export const ZEIT_OPTS: [string, string][] = [["praeteritum", "Präteritum"], ["praesens", "Präsens"]];
export const TON_OPTS: [string, string][] = [["dicht", "dicht"], ["nuechtern", "nüchtern"], ["poetisch", "poetisch"], ["kalt", "kalt"], ["ironisch", "ironisch"]];
export const SCHLUSS_OPTS: [string, string][] = [
  ["offen", "offen"], ["pointe", "Pointe"], ["kreis", "Kreisschluss"], ["bruch", "Bruch"],
];

// ---- Erzählbögen (als Daten, damit ein späterer Montage-Modus sie wiederverwenden kann) ----
export interface StoryArc { id: string; label: string; group: "frei" | "klassisch" | "maschine"; short: string; stages: string[]; guide: string; draftNote: string; }

export const ARCS: StoryArc[] = [
  { id: "frei", label: "frei (ohne Bogen)", group: "frei", short: "Die KI wählt die Dramaturgie selbst.",
    stages: [], guide: "", draftNote: "" },

  // Klassisch — für Zusammenhalt
  { id: "aristotelisch", label: "Aristotelisch", group: "klassisch", short: "Exposition → Steigerung → Höhepunkt → Auflösung.",
    stages: ["Exposition (Gleichgewicht)", "Auslöser", "steigende Handlung", "Höhepunkt", "fallende Handlung", "neues Gleichgewicht"],
    guide: "klassischer Spannungsbogen: ein Gleichgewicht wird gestört, die Handlung steigt zum Höhepunkt und löst sich in ein verändertes Gleichgewicht. Jeder Schritt folgt kausal aus dem vorigen (deshalb, nicht und dann).",
    draftNote: "Baue einen klaren Spannungsbogen mit Höhepunkt und Auflösung." },
  { id: "dreiakt", label: "Drei-Akt", group: "klassisch", short: "Setup → Konfrontation → Auflösung.",
    stages: ["Akt I: Setup und Anstoß", "Akt II: Konfrontation, Wendepunkt in der Mitte", "Akt II: Zuspitzung", "Akt III: Krise und Auflösung"],
    guide: "drei Akte: Setup mit auslösendem Ereignis, Konfrontation mit einem Mittelpunkt-Wendepunkt, Auflösung. Klarer Wunsch, klares Hindernis.",
    draftNote: "Halte die drei Akte erkennbar; setze in der Mitte einen Wendepunkt." },
  { id: "freytag", label: "Freytag-Pyramide", group: "klassisch", short: "Einleitung → Klimax → Katastrophe/Lösung.",
    stages: ["Einleitung", "erregendes Moment", "Steigerung", "Klimax", "retardierendes Moment", "Katastrophe oder Lösung"],
    guide: "Freytags fünfteilige Pyramide mit erregendem Moment, Klimax und einem retardierenden Moment kurz vor dem Schluss.",
    draftNote: "Setze vor dem Schluss ein retardierendes Moment, das noch einmal Hoffnung oder Zweifel weckt." },
  { id: "fichtean", label: "Fichtean-Kurve", group: "klassisch", short: "Kein Vorspiel — Krise auf Krise bis zum Höhepunkt.",
    stages: ["sofortige Krise", "Verschärfung", "neue Krise", "Zuspitzung", "Höhepunkt und rasche Auflösung"],
    guide: "spannungsgetrieben, ohne langes Vorspiel: die Figur steckt sofort in der Krise, jede Szene verschärft sie bis zum Höhepunkt.",
    draftNote: "Beginne mitten in der Krise, keine ruhige Exposition; eskaliere in jeder Szene." },
  { id: "storycircle", label: "Story Circle (Harmon)", group: "klassisch", short: "Komfort → Wunsch → Preis → veränderte Rückkehr.",
    stages: ["Komfort", "Wunsch", "unbekannte Welt", "Anpassung", "Erfolg", "Preis", "Rückkehr", "Veränderung"],
    guide: "komprimierte Heldenreise: die Figur verlässt ihre Komfortzone für einen Wunsch, zahlt einen Preis und kehrt verändert zurück.",
    draftNote: "Die Figur muss am Ende erkennbar verändert zurückkehren." },
  { id: "mystery", label: "Mystery / Enthüllung", group: "klassisch", short: "Frage → Hinweise → falsche Spur → Erkenntnis.",
    stages: ["Frage/Rätsel", "erste Hinweise", "falsche Spur", "Wendung", "Erkenntnis"],
    guide: "Spannung aus Wissen: eine Frage treibt den Text, Hinweise und eine falsche Spur führen zu einer Erkenntnis, die alles neu einfärbt.",
    draftNote: "Halte Information gezielt zurück; die Erkenntnis kommt spät und ordnet das Vorherige neu." },

  // Maschinen-nah — für das experimentelle Register
  { id: "kishotenketsu", label: "Kishōtenketsu", group: "maschine", short: "Ohne Konflikt: Einführung → Entwicklung → Wendung → Verbindung.",
    stages: ["Ki: Einführung", "Shō: Entwicklung", "Ten: überraschende, scheinbar unverbundene Wendung", "Ketsu: Verbindung"],
    guide: "vierteilige japanische Form OHNE zentralen Konflikt. Der dritte Teil bringt ein überraschendes, scheinbar unverbundenes Element; der vierte verbindet es rückwirkend mit dem Anfang. Keine Konfrontation, kein Sieger.",
    draftNote: "Erzeuge keinen Konflikt. Die Spannung entsteht aus der überraschenden Wendung im dritten Teil, die der Schluss still auflöst." },
  { id: "kreis", label: "Kreisstruktur", group: "maschine", short: "Anfang = Ende, neu verstanden.",
    stages: ["Anfangsbild", "Entfernung vom Anfang", "Wandlung", "Rückkehr zum Anfangsbild — nun anders verstanden"],
    guide: "das Schlussbild greift das Anfangsbild wörtlich wieder auf, aber der Leser versteht es jetzt neu. Kreis, nicht Linie.",
    draftNote: "Beginne und ende mit demselben Bild/Satz; die Bedeutung muss sich zwischen beiden verschoben haben." },
  { id: "rueckwaerts", label: "Rückwärts", group: "maschine", short: "Chronologisch rückwärts erzählt.",
    stages: ["das Ende zuerst", "die Ursache davor", "die Ursache davor", "der Anfang zuletzt"],
    guide: "die Handlung läuft chronologisch rückwärts — jede Szene liegt zeitlich vor der vorigen. Der Leser rekonstruiert die Ursachen.",
    draftNote: "Erzähle streng rückwärts: die erste Szene ist das Ende, die letzte der Anfang. Markiere die Zeitrichtung durch Inhalt, nicht durch Datumsangaben." },
  { id: "erkenntnis", label: "Erkenntnisbogen", group: "maschine", short: "Nicht die Welt ändert sich — der Blick.",
    stages: ["die Figur sieht die Welt so", "ein Riss im Blick", "Widerstand", "die Wahrnehmung kippt", "dieselbe Welt, neu gesehen"],
    guide: "die äußere Welt bleibt gleich; was sich wandelt, ist der Blick der Figur darauf. Die Wendung ist eine Erkenntnis, kein Ereignis.",
    draftNote: "Keine äußere Handlung muss sich lösen — nur die Wahrnehmung der Figur verschiebt sich entscheidend." },
  { id: "traumlogik", label: "Traumlogik", group: "maschine", short: "Kausalität durch Symbolik ersetzt.",
    stages: ["ein Bild", "Verwandlung", "eine unmögliche Verbindung", "ein Bild, das nachhallt"],
    guide: "keine logische Ursache-Wirkung, sondern Traumlogik: Bilder verwandeln sich ineinander, Übergänge folgen Symbolik statt Kausalität. Trotzdem eine innere Notwendigkeit.",
    draftNote: "Verbinde die Szenen durch Bildassoziation und Verwandlung, nicht durch logische Kausalität. Kein erklärender Satz." },
  { id: "assoziation", label: "Assoziationsbogen", group: "maschine", short: "Gedanke führt zu Gedanken, nicht Handlung.",
    stages: ["ein Ausgangsgedanke", "Abschweifung", "Sprung", "unerwartete Landung"],
    guide: "nicht Handlung treibt den Text, sondern Assoziation: ein Gedanke oder Bild führt zum nächsten. Der Reiz liegt in den Sprüngen, nicht im Plot.",
    draftNote: "Lass den Text durch Assoziationen fortschreiten, nicht durch Ereignisse. Die Landung darf überraschen." },
  { id: "rekursiv", label: "Rekursiver Bogen", group: "maschine", short: "Die Geschichte enthält eine kleinere Version ihrer selbst.",
    stages: ["Rahmen beginnt", "innere, kleinere Version derselben Geschichte", "die innere spiegelt den Rahmen", "der Rahmen schließt, verändert durch die innere"],
    guide: "die Geschichte enthält eine verkleinerte Version ihrer selbst — eine eingebettete Erzählung, die das Ganze spiegelt und den Rahmen am Ende umdeutet.",
    draftNote: "Bette eine kleinere Version derselben Geschichte ein; sie muss den äußeren Rahmen spiegeln und seinen Schluss verändern." },
];

export function getArc(id: string): StoryArc { return ARCS.find((a) => a.id === id) || ARCS[0]!; }
export const ARC_OPTS: [string, string][] = ARCS.map((a) => [a.id, a.label]);

const PERS_TXT: Record<WorkshopOpts["perspektive"], string> = {
  ich: "Ich-Perspektive", ersie: "dritte Person (er/sie)", du: "Du-Perspektive", wir: "Wir-Perspektive",
};
const ZEIT_TXT: Record<WorkshopOpts["zeitform"], string> = { praesens: "Präsens", praeteritum: "Präteritum" };
const TON_TXT: Record<WorkshopOpts["ton"], string> = {
  nuechtern: "nüchtern und knapp", dicht: "dicht und bildstark", poetisch: "poetisch, mit Rhythmus",
  kalt: "kalt und distanziert", ironisch: "trocken ironisch",
};
const SCHLUSS_TXT: Record<WorkshopOpts["schluss"], string> = {
  offen: "ein offener Schluss, der eine Frage stehen lässt — aber kein Abbruch mitten im Satz",
  pointe: "eine Pointe im letzten Satz, die alles Vorherige neu einfärbt",
  kreis: "ein Kreisschluss: das Schlussbild greift das Anfangsbild auf, verändert",
  bruch: "ein harter Bruch: der letzte Absatz kippt Ton oder Ebene",
};

/** Wortmaterial aus Wortbank und lebendigen Pools — der Stilanker.
 *  Getrennt zurückgegeben, damit in der Oberfläche sichtbar wird, woher was kommt. */
export function gatherMaterialDetailed(): { bank: string[]; live: string[] } {
  const bankOut: string[] = [];
  try {
    const bank = loadBank() as unknown as Record<string, string[]>;
    for (const cat of ["motifs", "hooks", "props"]) {
      const v = bank[cat];
      if (Array.isArray(v)) bankOut.push(...v.slice(0, 8));
    }
  } catch { /* egal */ }
  let liveOut: string[] = [];
  try { liveOut = liveTexts().slice(0, 12); } catch { /* egal */ }
  const clean = (a: string[]): string[] => [...new Set(a.filter((x) => typeof x === "string" && x.trim()))];
  return { bank: clean(bankOut), live: clean(liveOut) };
}

export function gatherMaterial(): string[] {
  const d = gatherMaterialDetailed();
  return [...new Set([...d.bank, ...d.live])].slice(0, 24);
}

const ctxLine = (c: Record<string, string>): string => {
  const p = [c["who"] && `Wer: ${c["who"]}`, c["where"] && `Wo: ${c["where"]}`, c["when"] && `Wann: ${c["when"]}`, c["what"] && `Was: ${c["what"]}`].filter(Boolean);
  return p.length ? p.join(" · ") + "\n" : "";
};

// ---- Stufe 1: Gerüst ----
export function buildOutlinePrompt(raw: string, ctx: Record<string, string>, o: WorkshopOpts): string {
  const arc = getArc(o.arc);
  const arcBlock = arc.id !== "frei"
    ? `Folge dem Erzählbogen »${arc.label}«: ${arc.guide}\n\n`
    : "";
  const beatsLine = arc.id !== "frei" && arc.stages.length
    ? `beats: ${arc.stages.length} Szenenschritte, die diesen Stationen in Reihenfolge folgen — ${arc.stages.join(" → ")}. Je Station ein knapper Schritt, höchstens 14 Wörter.\n`
    : "beats: 5 bis 7 knappe Szenenschritte in Reihenfolge, je höchstens 12 Wörter.\n";
  return "Du bekommst einen Rohtext aus einem experimentellen Textgenerator (Divergenzmaschine). "
    + "Entwirf daraus das dramaturgische Gerüst einer Kurzgeschichte von etwa " + o.laenge + " Wörtern. "
    + "Erfinde nichts, was dem Rohtext widerspricht — arbeite heraus, was in ihm angelegt ist.\n\n"
    + arcBlock
    + "Antworte NUR mit einem einzigen JSON-Objekt in GENAU diesem Format (ersetze die Beispielwerte):\n"
    + '{"figur":"eine Archivarin, die nichts mehr aufhebt","wunsch":"sie will den Koffer zurückgeben","hindernis":"niemand nimmt ihn an","wendung":"der Koffer gehört ihr selbst","schluss":"sie trägt ihn weiter","beats":["Beat 1","Beat 2","Beat 3","Beat 4","Beat 5"]}\n\n'
    + "figur, wunsch, hindernis, wendung, schluss: je ein kurzer Satz (bei konfliktfreien Bögen sinngemäß: Ausgangslage, Antrieb, Spannung, Wendung, Ausklang).\n"
    + beatsLine
    + "Der Schluss soll sein: " + SCHLUSS_TXT[o.schluss] + ".\n\n"
    + ctxLine(ctx) + "--- ROHTEXT ---\n" + raw;
}

export function normalizeOutline(raw: unknown): Outline {
  const o = (raw && typeof raw === "object") ? (raw as Record<string, unknown>) : {};
  const str = (k: string): string => (typeof o[k] === "string" ? (o[k] as string).trim() : "");
  const beats = Array.isArray(o["beats"]) ? (o["beats"] as unknown[]).filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean) : [];
  return {
    figur: str("figur"), wunsch: str("wunsch"), hindernis: str("hindernis"),
    wendung: str("wendung"), schluss: str("schluss"), beats: beats.slice(0, 8),
  };
}

// ---- Stufe 2: Rohfassung ----
export function buildDraftPrompt(raw: string, ctx: Record<string, string>, ol: Outline, o: WorkshopOpts, material: string[]): string {
  const beats = ol.beats.map((b, i) => `${i + 1}. ${b}`).join("\n");
  const mat = material.length ? "\n--- WORTMATERIAL (nutze davon, was sich natürlich fügt; nichts erzwingen) ---\n" + material.join(" · ") + "\n" : "";
  const arc = getArc(o.arc);
  const arcNote = arc.id !== "frei" ? `Erzählbogen »${arc.label}«: ${arc.draftNote}\n` : "";
  return "Schreibe eine deutsche Kurzgeschichte von etwa " + o.laenge + " Wörtern.\n\n"
    + `Perspektive: ${PERS_TXT[o.perspektive]}. Zeitform: ${ZEIT_TXT[o.zeitform]}. Ton: ${TON_TXT[o.ton]}.\n`
    + `Schluss: ${SCHLUSS_TXT[o.schluss]}.\n`
    + arcNote + "\n"
    + "--- GERÜST ---\n"
    + `Figur: ${ol.figur}\nWunsch: ${ol.wunsch}\nHindernis: ${ol.hindernis}\nWendung: ${ol.wendung}\nSchluss: ${ol.schluss}\n\n`
    + "Szenenschritte:\n" + beats + "\n"
    + mat
    + "\n--- ROHTEXT DER MASCHINE (Ton- und Bildquelle, nicht Vorlage zum Abschreiben) ---\n" + raw + "\n\n"
    + ctxLine(ctx)
    + "\nWICHTIG: Der Rohtext ist bewusst sperrig und assoziativ. Übernimm seine Bildsprache und seine Fremdheit — "
    + "glätte sie nicht zu Allerweltsprosa. Keine erklärenden Sätze, keine Moral am Ende, keine Überschrift. "
    + "Die Geschichte muss ankommen: der letzte Absatz ist ein Schluss, kein Abbruch.\n"
    + "Gib NUR den Text zurück.";
}

// ---- Stufe 3: Politur ----
export function buildPolishPrompt(draft: string, o: WorkshopOpts): string {
  return "Überarbeite die folgende Kurzgeschichte zur Endfassung. Ziel: etwa " + o.laenge + " Wörter.\n\n"
    + "Was zu tun ist:\n"
    + "- straffen: streiche Sätze, die nichts hinzufügen; jeder Absatz muss tragen\n"
    + "- Wiederholungen von Wörtern und Satzmustern beseitigen\n"
    + "- KI-typische Wendungen entfernen (etwa: 'ein Gefühl von', 'als ob die Welt', 'nicht nur ... sondern auch', "
    + "erklärende Schlusssätze, die die Bedeutung nachliefern)\n"
    + "- Vergleiche zusammenstreichen: im ganzen Text höchstens VIER Konstruktionen der Form "
    + "\"wie …\" oder \"als hätte/könnte/wäre …\". Zähle sie. Streiche die schwächsten und ersetze sie "
    + "durch die direkte Behauptung — nicht \"klang wie ein Herold\", sondern der Herold ist da.\n"
    + `- den Schluss durchsetzen: ${SCHLUSS_TXT[o.schluss]}\n`
    + "- Rechtschreibung und Grammatik korrigieren\n\n"
    + "Was NICHT zu tun ist: Die Fremdheit und die schiefen Bilder sind Absicht. Erkläre sie nicht, "
    + "begradige sie nicht, ersetze sie nicht durch geläufigere Formulierungen. Erfinde keine neue Handlung.\n\n"
    + "Gib NUR den überarbeiteten Text zurück, ohne Überschrift oder Kommentar.\n\n--- TEXT ---\n" + draft;
}

// ---- Grammatik-Pass (6.7): nur korrigieren, Stil unangetastet ----
export function buildGrammarPrompt(text: string): string {
  return "Korrigiere im folgenden deutschen Text AUSSCHLIESSLICH die Grammatik:\n"
    + "- Kongruenz (Artikel–Adjektiv–Nomen, Genus, Numerus, Kasus)\n"
    + "- Verbstellung und Verbformen (Zeit, Person)\n"
    + "- Rechtschreibung und Zeichensetzung (auch doppelte Satzzeichen)\n\n"
    + "Streng verboten: Wortwahl ändern, Bilder oder Vergleiche ersetzen, Sätze umstellen oder umformulieren, "
    + "kürzen, straffen, glätten. Wenn ein Satz grammatisch korrekt ist, lass ihn Wort für Wort unverändert. "
    + "Die bewusst schiefen, surrealen Bilder sind gewollt und bleiben unangetastet — sie sind kein Fehler.\n\n"
    + "Gib NUR den korrigierten Text zurück, ohne Kommentar.\n\n--- TEXT ---\n" + text;
}

// ---- Zustand über Tabwechsel hinweg ----
const WS_KEY = "dm_workshop_v1";
export interface Receipts { outline?: string; draft?: string; final?: string; }
export interface WorkshopState {
  raw: string; outline: Outline | null; draft: string; final: string; opts: WorkshopOpts;
  material?: string; useMaterial?: boolean; materialEdited?: boolean; receipts?: Receipts;
}
export function loadWorkshop(): WorkshopState | null {
  try { const v = JSON.parse(localStorage.getItem(WS_KEY) || "null"); return v && typeof v === "object" ? v as WorkshopState : null; } catch { return null; }
}
export function saveWorkshop(s: WorkshopState): void {
  safeSet(WS_KEY, JSON.stringify(s), "Werkstatt");
}

// ---- Benannte Werkstatt-Projekte ----
import { safeSet } from "./storage-status";

const WP_KEY = "dm_workshop_projects_v1";
const WP_MAX = 40;

export interface WorkshopProject {
  name: string; raw: string; opts: WorkshopOpts; outline: Outline | null;
  draft: string; final: string; d: string;
  material?: string; useMaterial?: boolean;
}

export function loadWorkshopProjects(): Record<string, WorkshopProject> {
  try {
    const o = JSON.parse(localStorage.getItem(WP_KEY) || "{}");
    return (o && typeof o === "object") ? o as Record<string, WorkshopProject> : {};
  } catch { return {}; }
}
function writeProjects(o: Record<string, WorkshopProject>): void {
  // Deckel: bei Überzahl die ältesten (nach Datum) verwerfen.
  const ids = Object.keys(o);
  if (ids.length > WP_MAX) {
    ids.sort((a, b) => (o[a]!.d || "").localeCompare(o[b]!.d || ""));
    for (const id of ids.slice(0, ids.length - WP_MAX)) delete o[id];
  }
  safeSet(WP_KEY, JSON.stringify(o), "Werkstatt-Projekte");
}
export function saveWorkshopProject(p: WorkshopProject): string {
  const all = loadWorkshopProjects();
  const slug = (p.name.trim() || "projekt").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "projekt";
  all[slug] = { ...p, d: new Date().toISOString().slice(0, 16).replace("T", " ") };
  writeProjects(all);
  return slug;
}
export function deleteWorkshopProject(id: string): void {
  const all = loadWorkshopProjects(); delete all[id]; writeProjects(all);
}
export function saveWorkshopProjectsAll(o: Record<string, WorkshopProject>): void {
  writeProjects(o && typeof o === "object" ? o : {});
}
