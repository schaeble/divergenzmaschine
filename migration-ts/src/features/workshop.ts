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

/** Wortmaterial aus Wortbank und lebendigen Pools — der Stilanker. */
export function gatherMaterial(): string[] {
  const out: string[] = [];
  try {
    const bank = loadBank() as unknown as Record<string, string[]>;
    for (const cat of ["motifs", "hooks", "props"]) {
      const v = bank[cat];
      if (Array.isArray(v)) out.push(...v.slice(0, 8));
    }
  } catch { /* egal */ }
  try { out.push(...liveTexts().slice(0, 12)); } catch { /* egal */ }
  return [...new Set(out.filter((x) => typeof x === "string" && x.trim()))].slice(0, 24);
}

const ctxLine = (c: Record<string, string>): string => {
  const p = [c["who"] && `Wer: ${c["who"]}`, c["where"] && `Wo: ${c["where"]}`, c["when"] && `Wann: ${c["when"]}`, c["what"] && `Was: ${c["what"]}`].filter(Boolean);
  return p.length ? p.join(" · ") + "\n" : "";
};

// ---- Stufe 1: Gerüst ----
export function buildOutlinePrompt(raw: string, ctx: Record<string, string>, o: WorkshopOpts): string {
  return "Du bekommst einen Rohtext aus einem experimentellen Textgenerator (Divergenzmaschine). "
    + "Entwirf daraus das dramaturgische Gerüst einer Kurzgeschichte von etwa " + o.laenge + " Wörtern. "
    + "Erfinde nichts, was dem Rohtext widerspricht — arbeite heraus, was in ihm angelegt ist.\n\n"
    + "Antworte NUR mit einem einzigen JSON-Objekt in GENAU diesem Format (ersetze die Beispielwerte):\n"
    + '{"figur":"eine Archivarin, die nichts mehr aufhebt","wunsch":"sie will den Koffer zurückgeben","hindernis":"niemand nimmt ihn an","wendung":"der Koffer gehört ihr selbst","schluss":"sie trägt ihn weiter","beats":["Beat 1","Beat 2","Beat 3","Beat 4","Beat 5"]}\n\n'
    + "figur, wunsch, hindernis, wendung, schluss: je ein kurzer Satz.\n"
    + "beats: 5 bis 7 knappe Szenenschritte in Reihenfolge, je höchstens 12 Wörter.\n"
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
  return "Schreibe eine deutsche Kurzgeschichte von etwa " + o.laenge + " Wörtern.\n\n"
    + `Perspektive: ${PERS_TXT[o.perspektive]}. Zeitform: ${ZEIT_TXT[o.zeitform]}. Ton: ${TON_TXT[o.ton]}.\n`
    + `Schluss: ${SCHLUSS_TXT[o.schluss]}.\n\n`
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

// ---- Zustand über Tabwechsel hinweg ----
const WS_KEY = "dm_workshop_v1";
export interface WorkshopState { raw: string; outline: Outline | null; draft: string; final: string; opts: WorkshopOpts; }
export function loadWorkshop(): WorkshopState | null {
  try { const v = JSON.parse(localStorage.getItem(WS_KEY) || "null"); return v && typeof v === "object" ? v as WorkshopState : null; } catch { return null; }
}
export function saveWorkshop(s: WorkshopState): void {
  try { localStorage.setItem(WS_KEY, JSON.stringify(s)); } catch { /* voll */ }
}

// ---- Benannte Werkstatt-Projekte ----
const WP_KEY = "dm_workshop_projects_v1";

export interface WorkshopProject {
  name: string; raw: string; opts: WorkshopOpts; outline: Outline | null;
  draft: string; final: string; d: string;
}

export function loadWorkshopProjects(): Record<string, WorkshopProject> {
  try {
    const o = JSON.parse(localStorage.getItem(WP_KEY) || "{}");
    return (o && typeof o === "object") ? o as Record<string, WorkshopProject> : {};
  } catch { return {}; }
}
function writeProjects(o: Record<string, WorkshopProject>): void {
  try { localStorage.setItem(WP_KEY, JSON.stringify(o)); } catch { /* voll */ }
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
