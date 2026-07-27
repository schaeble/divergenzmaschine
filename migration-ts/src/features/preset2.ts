// Preset 2.0: reicheres Autoren-/Importformat. Zur Laufzeit wird nur die Bank
// (Block "generatoren") genutzt; Orte/Figuren/Objekte/Metaphern speisen optional
// die lebendigen Pools. Alles wird auf die bestehende Engine heruntergerechnet —
// keine Änderung an vorhandenen Presets.
import type { Bank } from "../types";
import { normalizeBankShape } from "../storage";
import { callClaude, extractJson } from "./ki";

type Obj = Record<string, unknown>;
const asObj = (v: unknown): Obj => (v && typeof v === "object" ? (v as Obj) : {});
const asArr = (v: unknown): string[] => (Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []);
const CATS = ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"];

/** Liefert die Bank aus Preset-2.0- (generatoren), Wortbank- oder flachem JSON — sonst null. */
export function preset2ToBank(parsed: unknown): Bank | null {
  const o = asObj(parsed);
  const gen = asObj(o.generatoren ?? o.wordbank ?? o);
  if (!CATS.some((k) => Array.isArray(gen[k]))) return null;
  return normalizeBankShape(gen);
}

/** Sammelt Kontext-Material (Orte, Figuren, Objekte, Metaphern, Anomalien, Auslöser). */
export function preset2Pools(parsed: unknown): string[] {
  const o = asObj(parsed);
  const raum = asObj(o.raum), fig = asObj(o.figuren), obj = asObj(o.objekte);
  const spr = asObj(o.sprache), zeit = asObj(o.zeit), tr = asObj(o.transformation);
  const all = [
    ...asArr(raum.orte), ...asArr(raum.verborgene_orte),
    ...asArr(fig.protagonisten), ...asArr(fig.archetypen), ...asArr(fig.tiere),
    ...asArr(obj.alltag), ...asArr(obj.symbolisch),
    ...asArr(spr.metaphern), ...asArr(zeit.zeitanomalien), ...asArr(tr.ausloeser),
  ];
  return [...new Set(all.map((s) => s.trim()).filter((s) => s.length > 1))];
}

const TONE_MAP: Record<string, string> = {
  melancholisch: "melancholisch", düster: "dark", duester: "dark", poetisch: "poetic",
  geheimnisvoll: "mystery", "mysteriös": "mystery", unheimlich: "unheimlich",
  hoffnungsvoll: "uplifting", "zärtlich": "zaertlich", "träumerisch": "traeumerisch",
  traeumerisch: "traeumerisch", "nüchtern": "nuechtern", nuechtern: "nuechtern",
  ironisch: "ironisch", humorvoll: "humorous", neutral: "neutral",
};
export function preset2ToneKey(parsed: unknown): string | undefined {
  const t = String(asObj(asObj(parsed).sprache).ton ?? "").toLowerCase().trim();
  return TONE_MAP[t];
}

export function preset2Name(parsed: unknown): string {
  const o = asObj(parsed);
  const n = typeof o.name === "string" && o.name.trim() ? o.name.trim() : (typeof o.inspiration === "string" ? o.inspiration.trim() : "");
  return n || "Preset 2.0";
}

export interface Preset2Settings { tone?: string; form?: string; disruptor?: string; instability?: string; }

/** Phase 2: leitet aus sprache.ton + parameter die passenden Studio-Regler ab
 *  (nur die mit echtem Engine-Hebel: Ton, Form/Dialoganteil, Disruptor/Instabilität). */
export function preset2Settings(parsed: unknown): Preset2Settings {
  const out: Preset2Settings = {};
  const p = asObj(asObj(parsed).parameter);
  const num = (k: string): number | undefined => (typeof p[k] === "number" ? (p[k] as number) : undefined);
  const tone = preset2ToneKey(parsed);
  const humor = num("humor"), dial = num("dialoganteil"), sur = num("surrealismus");
  if (humor !== undefined && humor >= 0.5) out.tone = "humorous";
  else if (tone) out.tone = tone;
  if (dial !== undefined && dial >= 0.6) out.form = "script";
  if (sur !== undefined) {
    if (sur >= 0.5) out.disruptor = "on";
    if (sur >= 0.6) out.instability = "2"; else if (sur >= 0.4) out.instability = "1";
  }
  return out;
}

export interface AiPreset2 { obj: Record<string, unknown>; bank: Bank; name: string; json: string; }

/** Experimentell: erzeugt ein komplettes Preset 2.0 per KI. */
export async function generateAiPreset2(inspiration: string): Promise<AiPreset2> {
  const raw = await callClaude(buildPreset2Prompt(inspiration), 4096, "{");
  const obj = extractJson(raw) as Record<string, unknown>;
  const bank = preset2ToBank(obj);
  if (!bank) throw new Error("Antwort ohne gültigen generatoren-Block.");
  return { obj, bank, name: preset2Name(obj), json: JSON.stringify(obj, null, 2) };
}

function buildPreset2Prompt(inspiration: string): string {
  return 'Du erstellst ein "Preset 2.0" für einen prozeduralen, deutschsprachigen Kreativ-Textgenerator (Divergenzmaschine). '
    + "Inspiration/Ausgangspunkt: " + (inspiration || "(frei wählbar)") + ".\n\n"
    + "Gib NUR reines JSON zurück (beginnt mit { , endet mit } , kein Markdown, keine Erklärung), exakt mit diesen Schlüsseln:\n"
    + "{\n"
    + '  "name": "kurzer Titel",\n'
    + '  "version": "2.0",\n'
    + '  "inspiration": "…",\n'
    + '  "genre": ["…"],\n'
    + '  "beschreibung": "1-2 Sätze",\n'
    + '  "raum": { "orte": ["8-10 Orte"], "verborgene_orte": ["4-6"] },\n'
    + '  "figuren": { "protagonisten": ["5-6"], "archetypen": ["5-6"], "tiere": ["3-4"] },\n'
    + '  "objekte": { "alltag": ["6-8"], "symbolisch": ["5-7"] },\n'
    + '  "sprache": { "stil": "…", "ton": "eines von: melancholisch, düster, poetisch, geheimnisvoll, unheimlich, hoffnungsvoll, zärtlich, träumerisch, nüchtern, ironisch, humorvoll, neutral", "metaphern": ["5-6"] },\n'
    + '  "generatoren": {\n'
    + '    "motifs": ["10-12 wiederkehrende, poetische Bilder, je 3-8 Wörter"],\n'
    + '    "hooks": ["5-6 kleine, irritierende Sätze"],\n'
    + '    "props": ["8-10 Gegenstände"],\n'
    + '    "turns": ["6-7 Wendepunkte, je kurzer Satz/Phrase"],\n'
    + '    "obstacles": ["5-6 Hindernisse, je kurzer Satz"],\n'
    + '    "stakes": ["5-6 Einsätze, kurze Nominalphrasen"],\n'
    + '    "endings": ["5-6 Schlusssätze"]\n'
    + "  }\n"
    + "}\n\n"
    + "Alles auf Deutsch, konkret und stimmig zur Inspiration. Der generatoren-Block ist am wichtigsten und muss vollständig gefüllt sein.";
}
