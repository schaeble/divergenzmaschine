// Preset 2.0: reicheres Autoren-/Importformat. Zur Laufzeit wird nur die Bank
// (Block "generatoren") genutzt; Orte/Figuren/Objekte/Metaphern speisen optional
// die lebendigen Pools. Alles wird auf die bestehende Engine heruntergerechnet —
// keine Änderung an vorhandenen Presets.
import type { Bank } from "../types";
import { normalizeBankShape } from "../storage";
import { sortedPresetOptions } from "../wordbank";
import { callClaude, extractJson } from "./ki";
import type { DramaData } from "../generation/dramaturgie";

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

export interface Preset2Settings { tone?: string; form?: string; disruptor?: string; instability?: string; structure?: string; }

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
export interface VierW { where?: string; when?: string; who?: string; what?: string }

export async function generateAiPreset2(inspiration: string, seed?: string, kontext?: VierW | null): Promise<AiPreset2> {
  const raw = await callClaude(buildPreset2Prompt(inspiration, seed, kontext), 8192, "{");
  const obj = extractJson(raw) as Record<string, unknown>;
  const bank = preset2ToBank(obj);
  if (!bank) throw new Error("Antwort ohne gültigen generatoren-Block.");
  return { obj, bank, name: preset2Name(obj), json: JSON.stringify(obj, null, 2) };
}

function buildPreset2Prompt(inspiration: string, seed?: string, kontext?: VierW | null): string {
  // Der 4W-Kontext wird nur auf ausdrueckliche Anforderung mitgeschickt. Frueher
  // flossen Ort und Figuren ueber den Wortbank-Prompt unbemerkt ein - so bekamen
  // sechs eingebaute Presets die Voreinstellung "Schafsweide / Baucis, Philemon"
  // ab, obwohl ihr Thema ein voellig anderes war.
  const k = kontext && (kontext.where || kontext.when || kontext.who || kontext.what)
    ? "BEZIEHE diesen Kontext ein - das Preset soll zu ihm passen:\n"
      + `Ort: ${kontext.where || "(offen)"}\nZeit: ${kontext.when || "(offen)"}\n`
      + `Figur(en): ${kontext.who || "(offen)"}\nHandlung: ${kontext.what || "(offen)"}\n\n`
    : "";
  const seedPart = seed
    ? "Hier ist ein BESTEHENDES Preset/Material zum selben Thema. Verbessere und erweitere es: Thema beibehalten und schaerfen, Grammatik korrigieren, bei Requisiten/Motiven Artikel ergaenzen, ALLE satzartigen Eintraege ins PRAESENS setzen (Praeteritum-Formen wie \"erkannte\", \"war\", \"ging\" umschreiben zu \"erkennt\", \"ist\", \"geht\"), fehlende Felder (dramaturgie, transformation, konflikte, zeitanomalien, regeln) ausfuellen, pro generatoren-Kategorie 8-12 Eintraege. Ausgangsmaterial:\n" + seed + "\n\n"
    : "";
  return k + seedPart + 'Du erstellst ein "Preset 2.0" für einen prozeduralen, deutschsprachigen Kreativ-Textgenerator (Divergenzmaschine). '
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
    + '  "weltbild": { "naturgesetze": ["4-5 knappe Regeln der Welt, je ein ganzer Satz"] },\n'
    + '  "zeit": { "zeitanomalien": ["3-4 Zeit-Phaenomene, kurze Nominalphrasen"] },\n'
    + '  "konflikte": { "typisch": ["5-6 typische Konflikte, kurze Nominalphrasen"] },\n'
    + '  "transformation": { "ausloeser": ["5-7 Ausloeser (Substantive, z.B. Traum, Brief)"], "veraenderungen": ["4-5 Veraenderungen, je clause-artig (z.B. Realitaet verschiebt sich)"] },\n'
    + '  "logik": { "regeln": ["3-4 Erzaehl-/Logikregeln, je ein ganzer Satz"] },\n'
    + '  "dramaturgie": { "einstieg": ["3 knappe Anfangs-Phasen"], "mitte": ["3-4 Mittel-Phasen"], "hoehepunkt": ["2 Hoehepunkt-Phasen"], "schluss": ["2-3 Schluss-Stilworte, z.B. offen, melancholisch"] },\n'
    + '  "generatoren": {\n'
    + '    "motifs": ["24 wiederkehrende, poetische Bilder als Nominalphrase MIT Artikel, z.B. \\"eine Nachtigall im dunklen Laub\\""],\n'
    + '    "hooks": ["16 kleine, irritierende Sätze"],\n'
    + '    "props": ["22 Gegenstände je MIT unbestimmtem Artikel, z.B. \\"ein Kompass\\", \\"eine Muschel\\", \\"ein zerbrochenes Segel\\""],\n'
    + '    "turns": ["18 Wendepunkte, je kurzer Satz/Phrase"],\n'
    + '    "obstacles": ["17 Hindernisse, je kurzer Satz"],\n'
    + '    "stakes": ["11 Einsätze, kurze Nominalphrasen"],\n'
    + '    "endings": ["12 Schlusssätze"]\n'
    + "  }\n"
    + "}\n\n"
    + "Alles auf Deutsch, konkret und stimmig zur Inspiration. Der generatoren-Block UND der dramaturgie-/transformation-Block sind am wichtigsten und muessen vollstaendig gefuellt sein.\n\n"
    + "UMFANG — GEMESSEN, NICHT GERATEN: Der generatoren-Block soll ZUSAMMEN rund 120 Eintraege tragen. "
    + "Bei 44 Eintraegen traegt ein Preset einen langen Text auf 56 Prozent der Vorgabe, bei 112 auf 87, bei 147 auf 95. "
    + "Der Knick liegt bei rund 120; darueber gewinnt man fast nichts mehr, darunter bricht es ein.\n\n"
    + "WORTZAHL — das eigentliche Mass: Die 120 Eintraege sollen ZUSAMMEN rund 850 Woerter tragen, im "
    + "Schnitt also SIEBEN Woerter je Eintrag. Ueber 23 ausgebaute Presets gemessen sagt die Zahl der "
    + "Eintraege kaum etwas ueber die erreichte Textlaenge voraus, die Zahl der Woerter dagegen deutlich "
    + "(r = 0,80): 123 Eintraege mit 557 Woertern tragen einen 450-Woerter-Bericht auf 72 Prozent, "
    + "128 Eintraege mit 923 Woertern auf 108. Kurze Brocken fuellen die Liste, aber nicht den Text.\n\n"
    + "EINE HAND, NICHT DREI: Alle Eintraege muessen aus DERSELBEN Welt stammen — gleiches Register, gleiche "
    + "Bildwelt, gleicher Wortschatz. Ein Preset aus einer Hand traegt einen langen Text auf 95 Prozent, eine "
    + "Mischung aus drei Presets bei GLEICHER Groesse nur auf 84. Lieber 120 Eintraege aus einer Welt als 200 aus dreien.\n\n"
    + "KEINE DUBLETTEN: Kein Eintrag zweimal, auch nicht leicht abgewandelt.\n\n"
    + "ZEITFORM — WICHTIG: Die Engine baut ihre Saetze im Praesens. Alle satzartigen Eintraege "
    + "(hooks, turns, obstacles, endings, veraenderungen, naturgesetze, regeln, dramaturgie-Phasen) MUESSEN im Praesens stehen "
    + "(\"die Tuer bleibt verschlossen\", NICHT \"die Tuer blieb verschlossen\"). Nominalphrasen ohne Verb (motifs, props, stakes, "
    + "zeitanomalien, konflikte) bleiben zeitlos. Kein Praeteritum, kein Perfekt.";
}


/** Schlanke 2.0-Metadaten für die eingebauten Presets: passender Ton + wenige
 *  Parameter (nur die mit echtem Engine-Hebel). Vokabular liefert bereits die Bank. */
export const PRESET2_META: Record<string, { ton: string; surrealismus?: number; dialoganteil?: number; humor?: number }> = {
  rimbaud: { ton: "poetic" }, baudelaire: { ton: "dark" }, kafka: { ton: "unheimlich" },
  expressionismus: { ton: "dark" }, surrealismus1920: { ton: "traeumerisch", surrealismus: 0.8 },
  transzendenz: { ton: "uplifting" }, melville: { ton: "mystery" }, formalismus: { ton: "nuechtern" },
  christentum: { ton: "uplifting" }, koran: { ton: "poetic" }, buddhismus: { ton: "zaertlich" },
  biologie: { ton: "nuechtern" }, geologie: { ton: "nuechtern" }, astrologie: { ton: "mystery" },
  gaia: { ton: "poetic" }, freud: { ton: "unheimlich" },
  jugendsprache: { ton: "ironisch", humor: 0.7, dialoganteil: 0.6 },
  modernarchitecture: { ton: "nuechtern" }, philosophie: { ton: "nuechtern" }, klimakrise: { ton: "dark" },
  ritterromane: { ton: "uplifting" }, liebesromane: { ton: "zaertlich" }, bergwelt: { ton: "poetic" },
  clown: { ton: "humorous", humor: 0.8 }, faust: { ton: "dark" }, lebenreicher: { ton: "uplifting" },
  tanz: { ton: "poetic" }, griechischetragoedie: { ton: "dark" }, glueck: { ton: "uplifting" },
  gruendungsmythos: { ton: "mystery" }, staatsphilosophie: { ton: "nuechtern" },
  traumbilder: { ton: "traeumerisch", surrealismus: 0.7 }, mystery: { ton: "mystery" },
  bureau: { ton: "unheimlich" }, tech: { ton: "mystery" }, myth: { ton: "poetic" },
  body: { ton: "dark" }, absurd: { ton: "ironisch", surrealismus: 0.7 }, post: { ton: "dark" },
};

/** Studio-Einstellungen für ein eingebautes Preset (leer, wenn keine Metadaten). */
export function builtinSettings(id: string): Preset2Settings {
  const m = PRESET2_META[id.replace(/^builtin:/, "")];
  if (!m) return {};
  // Parameter -> Form/Disruptor/Instabilität (+ humor -> humorvoll). Ton kommt direkt
  // aus m.ton (bereits ein App-Ton-Schlüssel, nicht durch die Wort->Key-Map schicken).
  const st = preset2Settings({ parameter: { surrealismus: m.surrealismus, dialoganteil: m.dialoganteil, humor: m.humor } });
  if (!st.tone) st.tone = m.ton;
  return st;
}


/** Phase 3: extrahiert den Erzählbogen (Dramaturgie + Transformation + Konflikte +
 *  Zeitanomalien + Natur-/Logik-Regeln) aus einem Preset 2.0 — oder null. */
export function preset2Drama(parsed: unknown): DramaData | null {
  const o = asObj(parsed);
  const dr = asObj(o.dramaturgie), tr = asObj(o.transformation), kf = asObj(o.konflikte);
  const zt = asObj(o.zeit), wb = asObj(o.weltbild), lg = asObj(o.logik);
  const d: DramaData = {
    einstieg: asArr(dr.einstieg), mitte: asArr(dr.mitte), hoehepunkt: asArr(dr.hoehepunkt), schluss: asArr(dr.schluss),
    ausloeser: asArr(tr.ausloeser), veraenderungen: asArr(tr.veraenderungen),
    konflikte: asArr(kf.typisch), zeitanomalien: asArr(zt.zeitanomalien),
    regeln: [...asArr(wb.naturgesetze), ...asArr(lg.regeln)],
  };
  return Object.values(d).some((a) => a.length) ? d : null;
}


// ── Aktiver 2.0-Kontext + benannte 2.0-Presets (fuer die Preset-Liste) ──
export interface Active2 { settings: Preset2Settings; drama: DramaData | null; pools: string[]; }
export function preset2Active(parsed: unknown): Active2 {
  const drama = preset2Drama(parsed);
  const settings: Preset2Settings = preset2Settings(parsed);
  if (drama) settings.structure = "dramaturgie";
  return { settings, drama, pools: preset2Pools(parsed) };
}
const ACTIVE2_KEY = "dm_active_preset2_v1";
export function setActive2(a: Active2 | null): void { try { if (a) localStorage.setItem(ACTIVE2_KEY, JSON.stringify(a)); else localStorage.removeItem(ACTIVE2_KEY); } catch { /* voll */ } }
export function getActive2(): Active2 | null { try { const r = localStorage.getItem(ACTIVE2_KEY); return r ? (JSON.parse(r) as Active2) : null; } catch { return null; } }

const USER2_KEY = "dm_user_presets2_v1";
export function loadUserPresets2(): Record<string, Active2> {
  try { const r = localStorage.getItem(USER2_KEY); const p = r ? JSON.parse(r) : {}; return p && typeof p === "object" ? (p as Record<string, Active2>) : {}; } catch { return {}; }
}
export function saveUserPreset2(name: string, a: Active2): void {
  try { const all = loadUserPresets2(); all[name.trim().slice(0, 40)] = a; localStorage.setItem(USER2_KEY, JSON.stringify(all)); } catch { /* voll */ }
}
export function saveUserPresets2All(all: Record<string, Active2>): void {
  try { localStorage.setItem(USER2_KEY, JSON.stringify(all || {})); } catch { /* voll */ }
}
export function getUserPreset2(name: string): Active2 | null { return loadUserPresets2()[name] ?? null; }
export function deleteUserPreset2(name: string): void { try { const all = loadUserPresets2(); delete all[name]; localStorage.setItem(USER2_KEY, JSON.stringify(all)); } catch { /* voll */ } }


/** Preset-Optionen mit 2.0-Markierung (✦2.0) fuer eigene 2.0-Presets. */
export function markedPresetOptions(): [string, string][] {
  const u2 = loadUserPresets2();
  return sortedPresetOptions().map(([v, l]) => [v, v.startsWith("user:") && u2[v.slice(5)] ? l + " ✦2.0" : l] as [string, string]);
}
