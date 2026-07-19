// Ideen-Profil: 10 Merkmale, die den Prämissen-Generator steuern (Slice A).
// Spiegelt das Omnikognition-Muster: Profil -> Config -> Generierung, plus
// Presets, KI-Profil und eigene Presets.

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
}

// ---- typisierte Sub-Pools (kompakt) ----
const WHO_BY: Record<IdeaProfile["protagonist"], string[]> = {
  einzel: ["eine Uhrmacherin", "ein pensionierter Richter", "eine Archivarin ohne Namen", "ein Übersetzer für tote Sprachen", "eine Kartographin", "ein Fremder, der jeden Namen kennt"],
  kollektiv: ["eine Handvoll Überlebender", "ein streikendes Ensemble", "die Bewohner eines einzigen Hauses", "ein Chor ohne Dirigent", "drei Schwestern mit getauschten Leben", "eine Belegschaft, die nicht mehr geht"],
  kind: ["ein Kind, das zu viel weiß", "ein Junge mit zwei Schatten", "ein Mädchen, das die Zukunft träumt", "ein stummes Kind", "der jüngste Zeuge", "ein Waisenkind mit fremdem Gedächtnis"],
  institution: ["ein Ministerium ohne Minister", "eine Bibliothek, die entscheidet", "ein Gericht im Exil", "eine Behörde für Verlorenes", "ein Archiv mit eigenem Willen", "ein Orden ohne Glauben"],
  nichtmensch: ["ein Algorithmus mit Namen", "eine Maschine, die zu träumen beginnt", "ein Fluss, der sich erinnert", "ein Schwarm ohne Zentrum", "eine Stimme ohne Körper", "ein Tier, das ein Versprechen hält"],
  antiheld: ["eine Falschmünzerin", "ein Spion im Ruhestand", "ein Boxer, der nie verlor", "eine Diebin mit Prinzipien", "ein Verräter aus Loyalität", "ein Hochstapler mit echtem Titel"],
};
const WHERE_BY: Record<IdeaProfile["ort"], string[]> = {
  urban: ["in einer schlaflosen Stadt", "in einem verlassenen Bahnhof", "in einem Hinterhof ohne Ausgang", "auf einem nächtlichen Boulevard", "in einem Hochhaus ohne Erdgeschoss", "in der U-Bahn nach Mitternacht"],
  natur: ["am Rand eines Moors", "in einem Wald ohne Vögel", "an einer versinkenden Küste", "auf einem Gletscher, der schmilzt", "in einer Wüste mit Türen", "am Ufer eines toten Flusses"],
  raum: ["in einem versiegelten Zimmer", "in einem Aufzug zwischen zwei Stockwerken", "in einer Kabine auf hoher See", "in einem Bunker ohne Uhr", "in einem Wartesaal ohne Züge", "hinter einer Tür, die nicht schließt"],
  grenze: ["an der Grenze zweier Länder", "auf einer Brücke im Niemandsland", "an der Schwelle zweier Zeiten", "in einer Zollstation im Nebel", "auf der Linie zwischen Traum und Wachen", "am Übergang, den keiner bewacht"],
  nirgendwo: ["an einem Ort ohne Namen", "in einer Stadt, die es nicht gibt", "im weißen Raum dazwischen", "auf einer Karte ohne Legende", "im Nichts nach dem letzten Halt", "an einem vergessenen Koordinatenpunkt"],
  institution: ["in einem Archiv der Universität", "in einer geschlossenen Klinik", "in einer stillgelegten Fabrik", "in einem Ministerium bei Nacht", "in einer Bibliothek ohne Bücher", "in einem Gericht ohne Richter"],
};
const WHEN_BY: Record<IdeaProfile["zeit"], string[]> = {
  gegenwart: ["heute, kurz vor Feierabend", "an einem Sonntagnachmittag", "während eines Stromausfalls", "in der Woche des großen Sturms", "an einem ganz gewöhnlichen Dienstag"],
  historisch: ["1789", "1917", "1348", "im Jahr der großen Flut", "während einer Belagerung"],
  zukunft: ["2041", "im dritten Jahr der Stille", "nach dem letzten Winter", "als die Meere zurückwichen", "im Jahrhundert der Karten ohne Länder"],
  zeitlos: ["zu einer Zeit, die niemand zählt", "im Jahr Null", "als die Uhren noch schwiegen", "irgendwann, immer", "in einem Sommer ohne Ende"],
  umbruch: ["am Tag der Sonnenfinsternis", "in der Nacht des Umsturzes", "während eines Generalstreiks", "am letzten Tag des Jahres", "in der Stunde der Entscheidung"],
};
const WHAT_BY: Record<IdeaProfile["genre"], string[]> = {
  mystery: ["sucht eine Spur, die keiner hinterließ", "findet einen Brief, der nicht an sie gerichtet war", "entdeckt ein zweites Testament", "verfolgt eine Lüge bis zur Wurzel", "stößt auf einen Namen, den es nicht geben dürfte", "rekonstruiert eine Nacht, die niemand erlebt hat"],
  scifi: ["erhält eine Nachricht aus der Zukunft", "findet eine Tür, die es nicht geben dürfte", "verliert die Kontrolle über die eigene Stimme", "erwacht in einem Körper mit fremdem Gedächtnis", "entziffert ein Signal aus dem Nichts", "tauscht die Zeit gegen eine Erinnerung"],
  maerchen: ["schließt einen Pakt, den keiner versteht", "folgt einem Licht in den Wald", "erbt einen Fluch mit gutem Kern", "verspricht drei Dinge, die sich widersprechen", "sucht einen Namen, um frei zu werden", "öffnet die verbotene Tür"],
  absurd: ["füllt ein Formular für die eigene Abwesenheit", "verklagt den eigenen Schatten", "wartet auf einen Termin, der nie kommt", "erbt ein Amt ohne Aufgabe", "verliert die Erinnerung an einen Namen", "wird für tot erklärt und muss es widerlegen"],
  alltag: ["will einfach nur verschwinden", "trifft eine Entscheidung binnen einer Stunde", "bricht ein Versprechen aus Kindheitstagen", "kehrt an einen alten Ort zurück", "sagt endlich einen Satz zu spät", "räumt ein Zimmer und findet ein Leben"],
  horror: ["hört Schritte im leeren Haus", "bemerkt, dass die Spiegel nicht mehr stimmen", "zählt eine Person zu viel", "findet die eigene Handschrift an fremder Wand", "verliert jede Nacht eine Erinnerung mehr", "wird von etwas erkannt, das keiner sieht"],
  satire: ["gründet ein Amt gegen die Wirklichkeit", "gewinnt einen Preis für nichts", "verwaltet das Ende der Welt in Ordnern", "beruft eine Sitzung über Sitzungen ein", "optimiert sich selbst weg", "verkauft Zeit an die, die keine haben"],
};

const TON_ARCH: Record<IdeaProfile["ton"], string> = {
  duester: "psychopath", unheimlich: "skorpion", verspielt: "entdecker",
  hoffnung: "entdecker", ironisch: "neutral", melancholisch: "neutral",
};

export function ideaProfileToConfig(p: IdeaProfile): IdeaConfig {
  const d = Math.max(0, Math.min(100, p.divergenz));
  let archetypeId = TON_ARCH[p.ton] || "neutral";
  if (p.protagonist === "antiheld" && archetypeId === "neutral") archetypeId = "skorpion";

  const tags: string[] = [p.konflikt, p.fokus, p.wendung];
  if (p.massstab !== "mittel") tags.push(p.massstab);

  return {
    archetypeId,
    whoPool: WHO_BY[p.protagonist],
    wherePool: WHERE_BY[p.ort],
    whenPool: WHEN_BY[p.zeit],
    whatPool: WHAT_BY[p.genre],
    tags,
    twistProb: 0.2 + 0.006 * d,
    doubleTwist: d >= 75,
    mashupCount: d >= 55 ? 2 : 1,
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
export function deleteIdeaUserPreset(id: string): void {
  const u = loadIdeaUserPresets(); delete u[id];
  try { localStorage.setItem(IDEA_USER_KEY, JSON.stringify(u)); } catch { /* voll */ }
}
