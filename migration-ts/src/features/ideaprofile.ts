// Ideen-Profil: 10 Merkmale, die den Prämissen-Generator steuern (Slice A).
// Spiegelt das Omnikognition-Muster: Profil -> Config -> Generierung, plus
// Presets, KI-Profil und eigene Presets.

import { WHO_TAGGED, WHERE_TAGGED, WHEN_TAGGED, WHAT_TAGGED, byTag } from "../generation/ideas.data";

export interface IdeaProfile {
  name: string; // Thema/Titel (frei)
  genre: "mystery" | "scifi" | "maerchen" | "absurd" | "alltag" | "horror" | "satire";
  ton: "duester" | "hoffnung" | "ironisch" | "melancholisch" | "unheimlich" | "verspielt";
  protagonist: "einzel" | "kollektiv" | "kind" | "institution" | "nichtmensch" | "antiheld";
  konflikt: "raetsel" | "kampf" | "inner" | "natur" | "system" | "zeit";
  ort: "urban" | "natur" | "raum" | "grenze" | "nirgendwo" | "institution";
  zeit: "gegenwart" | "historisch" | "zukunft" | "zeitlos" | "umbruch";
  massstab: "intim" | "mittel" | "episch" | "kosmisch";
  wendung: "umkehr" | "enthuellung" | "eskalation" | "offen" | "paradox" | "ironie";
  fokus: "figur" | "konzept" | "atmo" | "handlung" | "form";
  divergenz: number; // 0..100
}

export interface IdeaConfig {
  archetypeId: string;
  whoPool: string[];
  wherePool: string[];
  whenPool: string[];
  whatPool: string[];
  tags: string[]; // gewünschte Template-Tags
  twistProb: number;
  doubleTwist: boolean;
  mashupCount: number;
  liveShare: number;
}

const TON_ARCH: Record<IdeaProfile["ton"], string> = {
  duester: "psychopath", unheimlich: "skorpion", verspielt: "entdecker",
  hoffnung: "entdecker", ironisch: "neutral", melancholisch: "neutral",
};

export function ideaProfileToConfig(p: IdeaProfile, liveShare = 0): IdeaConfig {
  const d = Math.max(0, Math.min(100, p.divergenz));
  let archetypeId = TON_ARCH[p.ton] || "neutral";
  if (p.protagonist === "antiheld" && archetypeId === "neutral") archetypeId = "skorpion";

  const tags: string[] = [p.konflikt, p.fokus, p.wendung];
  if (p.massstab !== "mittel") tags.push(p.massstab);

  return {
    archetypeId,
    whoPool: byTag(WHO_TAGGED, p.protagonist),
    wherePool: byTag(WHERE_TAGGED, p.ort),
    whenPool: byTag(WHEN_TAGGED, p.zeit),
    whatPool: byTag(WHAT_TAGGED, p.genre),
    tags,
    twistProb: 0.2 + 0.006 * d,
    doubleTwist: d >= 75,
    mashupCount: d >= 55 ? 2 : 1,
    liveShare: Math.max(0, Math.min(1, liveShare)),
  };
}

// ---- Presets ----
export const IDEA_PRESETS: Record<string, IdeaProfile> = {
  noir: { name: "Noir", genre: "mystery", ton: "duester", protagonist: "antiheld", konflikt: "raetsel", ort: "urban", zeit: "historisch", massstab: "intim", wendung: "enthuellung", fokus: "figur", divergenz: 45 },
  kosmos: { name: "Kosmischer Horror", genre: "horror", ton: "unheimlich", protagonist: "nichtmensch", konflikt: "natur", ort: "nirgendwo", zeit: "zeitlos", massstab: "kosmisch", wendung: "enthuellung", fokus: "atmo", divergenz: 70 },
  kafka: { name: "Kafkaesk", genre: "absurd", ton: "unheimlich", protagonist: "einzel", konflikt: "system", ort: "institution", zeit: "gegenwart", massstab: "intim", wendung: "paradox", fokus: "konzept", divergenz: 55 },
  alltag: { name: "Alltagspoesie", genre: "alltag", ton: "melancholisch", protagonist: "einzel", konflikt: "inner", ort: "urban", zeit: "gegenwart", massstab: "intim", wendung: "offen", fokus: "figur", divergenz: 25 },
  maerchen: { name: "Märchen-Umkehr", genre: "maerchen", ton: "verspielt", protagonist: "kind", konflikt: "raetsel", ort: "natur", zeit: "zeitlos", massstab: "mittel", wendung: "umkehr", fokus: "handlung", divergenz: 45 },
  techno: { name: "Techno-Thriller", genre: "scifi", ton: "duester", protagonist: "kollektiv", konflikt: "kampf", ort: "urban", zeit: "zukunft", massstab: "episch", wendung: "eskalation", fokus: "handlung", divergenz: 50 },
  buero: { name: "Absurde Bürokratie", genre: "satire", ton: "ironisch", protagonist: "institution", konflikt: "system", ort: "institution", zeit: "gegenwart", massstab: "mittel", wendung: "ironie", fokus: "konzept", divergenz: 40 },
};
export const IDEA_PRESET_LABELS: [string, string][] = [
  ["noir", "Noir"], ["kosmos", "Kosmischer Horror"], ["kafka", "Kafkaesk"], ["alltag", "Alltagspoesie"],
  ["maerchen", "Märchen-Umkehr"], ["techno", "Techno-Thriller"], ["buero", "Absurde Bürokratie"],
];

// ---- KI-Profil ----
const GENRE_ALL = ["mystery", "scifi", "maerchen", "absurd", "alltag", "horror", "satire"] as const;
const TON_ALL = ["duester", "hoffnung", "ironisch", "melancholisch", "unheimlich", "verspielt"] as const;
const PROT_ALL = ["einzel", "kollektiv", "kind", "institution", "nichtmensch", "antiheld"] as const;
const KONF_ALL = ["raetsel", "kampf", "inner", "natur", "system", "zeit"] as const;
const ORT_ALL = ["urban", "natur", "raum", "grenze", "nirgendwo", "institution"] as const;
const ZEIT_ALL = ["gegenwart", "historisch", "zukunft", "zeitlos", "umbruch"] as const;
const MASS_ALL = ["intim", "mittel", "episch", "kosmisch"] as const;
const WEND_ALL = ["umkehr", "enthuellung", "eskalation", "offen", "paradox", "ironie"] as const;
const FOK_ALL = ["figur", "konzept", "atmo", "handlung", "form"] as const;

function pickOne<T extends string>(v: unknown, allowed: readonly T[], def: T): T {
  return typeof v === "string" && (allowed as readonly string[]).includes(v) ? (v as T) : def;
}

export function buildIdeaProfilePrompt(name: string): string {
  return `Erzeuge ein Ideen-Profil für das Thema/Motiv: "${name}".\n`
    + "Antworte NUR mit einem einzigen JSON-Objekt in GENAU diesem Format (ersetze die Beispielwerte, keine Kommentare, kein weiterer Text):\n"
    + '{"genre":"mystery","ton":"duester","protagonist":"antiheld","konflikt":"raetsel","ort":"urban","zeit":"historisch","massstab":"intim","wendung":"enthuellung","fokus":"figur","divergenz":50}\n\n'
    + "Erlaubte Werte (jeweils genau einer):\n"
    + "- genre: mystery, scifi, maerchen, absurd, alltag, horror, satire\n"
    + "- ton: duester, hoffnung, ironisch, melancholisch, unheimlich, verspielt\n"
    + "- protagonist: einzel, kollektiv, kind, institution, nichtmensch, antiheld\n"
    + "- konflikt: raetsel, kampf, inner, natur, system, zeit\n"
    + "- ort: urban, natur, raum, grenze, nirgendwo, institution\n"
    + "- zeit: gegenwart, historisch, zukunft, zeitlos, umbruch\n"
    + "- massstab: intim, mittel, episch, kosmisch\n"
    + "- wendung: umkehr, enthuellung, eskalation, offen, paradox, ironie\n"
    + "- fokus: figur, konzept, atmo, handlung, form\n"
    + "- divergenz: ganze Zahl von 0 (zahm) bis 100 (radikal)\n\n"
    + `Gib jetzt NUR das JSON für "${name}" zurück.`;
}

export function normalizeIdeaProfile(raw: unknown, name: string): IdeaProfile {
  const o = (raw && typeof raw === "object") ? (raw as Record<string, unknown>) : {};
  let div = typeof o["divergenz"] === "number" ? o["divergenz"] as number : parseInt(String(o["divergenz"]), 10);
  if (!isFinite(div)) div = 50;
  div = Math.max(0, Math.min(100, Math.round(div)));
  return {
    name: name.trim() || "Idee",
    genre: pickOne(o["genre"], GENRE_ALL, "mystery"),
    ton: pickOne(o["ton"], TON_ALL, "duester"),
    protagonist: pickOne(o["protagonist"], PROT_ALL, "einzel"),
    konflikt: pickOne(o["konflikt"], KONF_ALL, "raetsel"),
    ort: pickOne(o["ort"], ORT_ALL, "urban"),
    zeit: pickOne(o["zeit"], ZEIT_ALL, "gegenwart"),
    massstab: pickOne(o["massstab"], MASS_ALL, "intim"),
    wendung: pickOne(o["wendung"], WEND_ALL, "enthuellung"),
    fokus: pickOne(o["fokus"], FOK_ALL, "figur"),
    divergenz: div,
  };
}

// ---- eigene Presets ----
const IDEA_USER_KEY = "divergenz_idea_presets_v1";
export function loadIdeaUserPresets(): Record<string, IdeaProfile> {
  try { const o = JSON.parse(localStorage.getItem(IDEA_USER_KEY) || "{}"); return (o && typeof o === "object") ? o as Record<string, IdeaProfile> : {}; } catch { return {}; }
}
export function saveIdeaUserPreset(p: IdeaProfile): string {
  const users = loadIdeaUserPresets();
  const slug = (p.name.trim() || "idee").toLowerCase().replace(/[^a-z0-9äöüß]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "idee";
  const id = "user:" + slug;
  users[id] = p;
  try { localStorage.setItem(IDEA_USER_KEY, JSON.stringify(users)); } catch { /* voll */ }
  return id;
}
export function saveIdeaUserPresetsAll(o: Record<string, IdeaProfile>): void {
  try { localStorage.setItem(IDEA_USER_KEY, JSON.stringify(o || {})); } catch { /* voll */ }
}
export function deleteIdeaUserPreset(id: string): void {
  const u = loadIdeaUserPresets(); delete u[id];
  try { localStorage.setItem(IDEA_USER_KEY, JSON.stringify(u)); } catch { /* voll */ }
}

// ── Das eingestellte Profil, über Reiter hinweg lesbar ────────────────────
// Es lag bisher nur im gemounteten Reiter. Seit der Reiter Ideen eine QUELLE
// der vier W ist (wie Welt, Wiki, Abschrift, Thema), muss auch ein Würfel
// außerhalb wissen, wonach die Prämissen gebaut werden sollen — sonst zöge er
// aus einem Profil, das der Benutzer nie gesehen hat.
const PROFIL_KEY = "dm_idea_profile_v1";
export function saveIdeaProfile(p: IdeaProfile, liveAnteil: number): void {
  try { localStorage.setItem(PROFIL_KEY, JSON.stringify({ ...p, liveAnteil })); } catch { /* voll */ }
}
export function loadIdeaProfile(): { profil: IdeaProfile; liveAnteil: number } | null {
  try {
    const r = localStorage.getItem(PROFIL_KEY);
    if (!r) return null;
    const o = JSON.parse(r) as Record<string, unknown>;
    return { profil: normalizeIdeaProfile(o, String(o["name"] || "")), liveAnteil: Number(o["liveAnteil"]) || 0 };
  } catch { return null; }
}

/** Ein zufälliges Profil — derselbe Griff wie die Taste „Würfeln" im Reiter
 *  Ideen, nur ohne Oberfläche.
 *
 *  Eingewandt wurde: „Da auch im Reiter Ideen schon die Würfelfunktion vorliegt,
 *  ist es naheliegend, hier zu würfeln statt aus dem Profil zu nehmen." Richtig,
 *  und es ist auch messbar besser — 300 Züge, verschiedene Werte:
 *
 *    festes Profil     wo 141 · wann 126 · wer 142 · was 124
 *    gewürfelt         wo 193 · wann 187 · wer 213 · was 224
 *
 *  Gewürfelt wird NUR für diesen einen Zug. Das eingestellte Profil bleibt
 *  unangetastet — „der Würfel wählt, er füllt nicht" gilt weiter, und ein
 *  gewürfeltes Profil ist eine Wahl, kein Überschreiben. */
/** Der Würfel im Reiter Ideen — er entscheidet ZUERST, woher er nimmt:
 *  aus dem Bestand (7 eingebaute Presets + eigene) oder frei aus den zehn
 *  Merkmalen. Bisher zog er immer frei und stellte den Preset-Wähler stumm auf
 *  „— eigenes —"; die eigenen Profile kamen so nie vor.
 *
 *  Beide Wege bleiben, weil beide etwas können, was der andere nicht kann:
 *  Ein reiner Bestandszug erreicht nur sieben plus die eigenen Kombinationen,
 *  ein reiner Freizug nie die eigenen. Halb und halb.
 *
 *  Gibt `id` zurück, damit der Wähler ehrlich anzeigen kann, woher die
 *  Einstellung stammt — leer heißt „freie Kombination". */
export function wuerfleIdeenProfil(
  bestand: ReadonlyArray<readonly [string, IdeaProfile]>,
  zufall: () => number = Math.random,
): { id: string; profil: IdeaProfile } {
  if (bestand.length > 0 && zufall() < 0.5) {
    const i = Math.min(bestand.length - 1, Math.floor(zufall() * bestand.length));
    const paar = bestand[i]!;
    return { id: paar[0], profil: { ...paar[1] } };
  }
  return { id: "", profil: wuerfleIdeaProfile(zufall) };
}

export function wuerfleIdeaProfile(zufall: () => number = Math.random): IdeaProfile {
  const w = <T,>(l: readonly T[]): T => l[Math.min(l.length - 1, Math.floor(zufall() * l.length))] as T;
  return {
    name: "",
    genre: w(GENRE_ALL), ton: w(TON_ALL), protagonist: w(PROT_ALL), konflikt: w(KONF_ALL),
    ort: w(ORT_ALL), zeit: w(ZEIT_ALL), massstab: w(MASS_ALL), wendung: w(WEND_ALL), fokus: w(FOK_ALL),
    divergenz: Math.floor(zufall() * 21) * 5,
  };
}
