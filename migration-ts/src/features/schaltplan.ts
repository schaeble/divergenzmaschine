// Schaltplan: was ist gerade verdrahtet?
//
// Gemeldet als Frage, nicht als Fehler: „Es ist für mich immer ein Raten, was
// wohl gerade die Ursache für dies und jenes ist." Das Studio hat rund dreißig
// Schalter, acht Stellschrauben, vier Vorräte und einen Korpus. Welche davon in
// einem bestimmten Augenblick wirklich in den Text führen, stand nirgends.
//
// Dieses Modul sammelt den Zustand und baut daraus einen Plan aus Knoten und
// Leitungen. Es misst NICHT — es erzeugt keinen Text und liest keine Spur. Was
// es kann, ist der Abgleich zwischen SCHALTER und QUELLE, und der beantwortet
// die häufigste Ratefrage von selbst:
//
//   „Korpus-Bausteine: 20 %" klingt nach einer Wirkung. Ist der Korpus leer,
//   ist die Leitung tot, und kein Schalter sagt das. Genau dafür gibt es den
//   Zustand `leer`.
//
// Reine Funktionen mit einer Umgebung als Eingabe: So lässt sich der Plan im
// Prüfstand mit erfundenen Beständen durchspielen, ohne einen Browser.
import { KNOB_VORGABE, type Knobs } from "./knobs";
import { TONE_OPTS, FORM_OPTS, STRUCTURE_OPTS, MODE_OPTS, PERSP_OPTS, RHYTHM_OPTS,
  VARIANZ_OPTS, DISRUPTOR_OPTS, ARCH_OPTS, MARKOV_OPTS, type Wahlliste } from "../generation/optionen";

/** an = Schalter an und Quelle vorhanden · leer = an, aber die Quelle ist leer
 *  · aus = abgeschaltet · fest = eine Zahl, die keine Stellung hat (Länge). */
export type Zustand = "an" | "leer" | "aus" | "fest";

export interface Knoten {
  id: string;
  band: number;            // 0 Vorräte · 1 Material · 2 Steuerung · 3 Schliff · 4 Ausgabe
  label: string;
  wert: string;
  zustand: Zustand;
  gesperrt: boolean;
  hinweis: string;
}
export interface Kante { von: string; nach: string; zustand: Zustand }
export interface Anlage { knoten: Knoten[]; kanten: Kante[]; zeit: string; befunde: string[] }

/** Was das Studio zuletzt gestellt hat. Wird bei JEDER Änderung geschrieben,
 *  nicht erst beim Erzeugen — sonst zeigte der Plan den vorletzten Stand. */
export interface AnlageStand {
  regler: Record<string, string>;
  w4: { where: string; when: string; who: string; what: string };
  zeit: string;
}
/** Welches Feld im Plan zeigt das Schloss welches Bedienelements?
 *
 *  Gemeldet: „Bei Länge ist das Schloss gesetzt, wird aber nicht angezeigt."
 *  Die Ursache war eine vergessene Kennung, und das ist eine Fehlerart, die sich
 *  von selbst wiederholt: Wer einen Regler hinzufügt, denkt nicht an den Plan.
 *
 *  Deshalb steht die Zuordnung an EINER Stelle, und der Prüfstand hält sie gegen
 *  das laufende Studio: Jedes Bedienelement mit Schloss muss hier auftauchen und
 *  auf einen Knoten zeigen, den es wirklich gibt. Mehrere Kennungen dürfen auf
 *  denselben Knoten zeigen — die vier W sind ein Feld im Plan und vier in der
 *  Oberfläche. */
export const SCHLOSS_ZU_KNOTEN: Record<string, string> = {
  "f-preset": "preset", "f-tone": "ton", "f-form": "form", "f-structure": "struktur",
  "f-mode": "modus", "f-markov": "markov", "f-disruptor": "disruptor", "f-varianz": "varianz",
  "f-instab": "instab", "f-archa": "archa", "f-archb": "archb", "f-cast": "cast",
  "f-persp": "persp", "f-rhythm": "rhythm", "f-tension": "spannung", "f-ressort": "ressort",
  "f-len": "laenge", "f-novelty": "neuheit", "f-surprise": "ueberraschung",
  "f-umwelt": "umwelt", "f-umwelt-wirkung": "umwelt",
  "f-where": "w4", "f-when": "w4", "f-who": "w4", "f-what": "w4",
  "f-w-wo": "gewicht", "f-w-wann": "gewicht", "f-w-wer": "gewicht", "f-w-was": "gewicht",
  "k-fuegeteil": "k-fuegeteil", "k-w4max": "k-w4max", "k-abstand": "k-abstand",
  "k-bogen": "k-bogen", "k-ton": "k-ton", "k-korpus": "k-korpus",
  "k-phrase": "k-phrase", "k-satzlaenge": "k-satzlaenge",
};

export const ANLAGE_KEY = "dm_anlage_v1";
export function saveAnlage(s: AnlageStand): void {
  try { localStorage.setItem(ANLAGE_KEY, JSON.stringify(s)); } catch { /* Speicher voll */ }
}
export function loadAnlage(): AnlageStand | null {
  try { const r = localStorage.getItem(ANLAGE_KEY); return r ? (JSON.parse(r) as AnlageStand) : null; } catch { return null; }
}

/** Die Bestände, gegen die die Schalter geprüft werden. */
export interface Umgebung {
  korpusZeichen: number;
  sammlerFunde: number;
  bildFunde: number;
  themenFunde: number;
  weltFiguren: number;
  weltOrte: number;
  livePools: number;
  schatzkammer: number;
  knobs: Knobs;
  gesperrt: Set<string>;
  /** Liegt ein Erzählbogen bereit? Gelesen wird DIESELBE Ablage, aus der der
   *  Bauweg liest (`dm_dramaturgie_v1`), nicht die Tabelle der eingebauten
   *  Presets. Bis 4.286 stand hier `builtinDrama(preset)` — das stimmt für die
   *  51 eingebauten und ist bei jedem eigenen 2.0-Preset falsch: Deren Bogen
   *  steht nur in der Ablage. Der Plan hätte „kein Bogen" gezeigt, während der
   *  Text längst einem folgte. */
  dramaVorhanden: boolean;
  presetLabel: string;
}

const bez = (liste: Wahlliste, wert: string): string =>
  (liste.find(([w]) => w === wert) || [wert, wert])[1];

const AUS = new Set(["off", "aus", "none", "0"]);
const istAus = (v: string): boolean => AUS.has(String(v || "").toLowerCase());

/** Der Plan. Reine Funktion: gleiche Eingabe, gleicher Plan. */
export function baueAnlage(stand: AnlageStand, u: Umgebung): Anlage {
  const K: Knoten[] = [];
  const E: Kante[] = [];
  const befunde: string[] = [];
  const r = stand.regler || {};
  const g = (id: string): boolean => u.gesperrt.has(id);

  const knoten = (id: string, band: number, label: string, wert: string,
                  zustand: Zustand, hinweis = "", schlossId = ""): void => {
    K.push({ id, band, label, wert, zustand, gesperrt: schlossId ? g(schlossId) : false, hinweis });
    if (zustand === "leer") befunde.push(`${label}: ${hinweis}`);
  };
  const kante = (von: string, nach: string): void => {
    const a = K.find((k) => k.id === von), b = K.find((k) => k.id === nach);
    const z: Zustand = !a || !b ? "aus"
      : a.zustand === "leer" || b.zustand === "leer" ? "leer"
      : a.zustand === "aus" || b.zustand === "aus" ? "aus" : "an";
    E.push({ von, nach, zustand: z });
  };

  // ── Spalte 0: Vorräte ────────────────────────────────────────────────────
  knoten("korpus", 0, "Korpus", u.korpusZeichen ? `${u.korpusZeichen.toLocaleString("de-DE")} Zeichen` : "leer",
    u.korpusZeichen ? "an" : "aus", u.korpusZeichen ? "" : "kein eigener Text hinterlegt");
  knoten("sammler", 0, "Sammler-Vorrat", `${u.sammlerFunde} Funde`, u.sammlerFunde ? "an" : "aus",
    u.sammlerFunde ? "" : "im Reiter Sammler einen Tag holen");
  knoten("bilder", 0, "Bildvorrat", `${u.bildFunde} Funde`, u.bildFunde ? "an" : "aus");
  knoten("themen", 0, "Themenpool", `${u.themenFunde} Funde`, u.themenFunde ? "an" : "aus");
  knoten("welt", 0, "Welt", `${u.weltFiguren} Figuren · ${u.weltOrte} Orte`,
    u.weltFiguren || u.weltOrte ? "an" : "aus");
  knoten("live", 0, "Live-Pools", `${u.livePools} Phrasen`, u.livePools ? "an" : "aus");

  // ── Spalte 1: Eingang ────────────────────────────────────────────────────
  const w4 = stand.w4 || { where: "", when: "", who: "", what: "" };
  const gefuellt = [w4.where, w4.when, w4.who, w4.what].filter((x) => (x || "").trim()).length;
  // Vier Felder, ein Knoten — also auch vier Schlösser. Gezeichnet wird das
  // Schloss, wenn ALLE vier zu sind; wie viele es sind, sagt der Hinweis.
  const w4Ids = ["f-where", "f-when", "f-who", "f-what"];
  const w4Zu = w4Ids.filter((id) => g(id)).length;
  K.push({
    id: "w4", band: 1, label: "Vier W", wert: `${gefuellt} von 4 gefüllt`,
    zustand: gefuellt ? "an" : "leer", gesperrt: false,
    hinweis: (gefuellt ? "" : "alle vier Felder sind leer — der Kontext trägt nichts bei. ")
      + (w4Zu ? `${w4Zu} von 4 Feldern gesperrt` : ""),
  });
  if (!gefuellt) befunde.push("Vier W: alle vier Felder sind leer");
  // Die Gewichtung der vier W ist ein eigener Regler mit eigenen Schlössern —
  // sie stand bis 4.288 nicht im Plan.
  const gew = (r["gewicht"] || "0/0/0/0").split("/");
  const gewAn = gew.some((x) => (parseInt(x, 10) || 0) !== 0);
  knoten("gewicht", 1, "4W-Gewichtung", gew.join(" · "), gewAn ? "an" : "aus",
    gewAn ? "" : "alle vier gleich gewichtet");
  knoten("preset", 1, "Wortbank", u.presetLabel || r["preset"] || "—", "an", "", "f-preset");
  knoten("ton", 1, "Ton", bez(TONE_OPTS, r["tone"] || "neutral"), "an", "", "f-tone");

  // ── Spalte 2: Bau ────────────────────────────────────────────────────────
  const struktur = r["structure"] || "auto";
  knoten("struktur", 2, "Struktur", bez(STRUCTURE_OPTS, struktur), "an", "", "f-structure");
  // Dramaturgie hat KEINEN eigenen Schalter — sie ist eine Stellung der
  // Struktur. Genau danach wurde gefragt („Wo ist denn der Schalter für die
  // Dramaturgie?"), und die Frage kam, weil dieser Plan sie als eigenes Feld
  // zeichnet. Der Wert sagt es jetzt selbst.
  //
  // Zwei Wege, auf denen sie stumm ausfällt, und beide sieht man dem Regler
  // nicht an: ohne Erzählbogen im aktiven Preset, und bei jeder Form außer
  // Prosa. Der Bauweg fällt dann wortlos auf den gewöhnlichen zurück.
  const dramaAn = struktur === "dramaturgie";
  const nurProsa = (r["form"] || "prose") === "prose";
  const dramaZustand: Zustand = !dramaAn ? "aus" : !nurProsa ? "leer" : u.dramaVorhanden ? "an" : "leer";
  knoten("drama", 2, "Dramaturgie",
    !dramaAn ? "aus — über Struktur" : !nurProsa ? "nur bei Prosa" : u.dramaVorhanden ? "Bogen vorhanden" : "kein Bogen",
    dramaZustand,
    !dramaAn ? "Kein eigener Schalter: Struktur auf „Dramaturgie (Preset 2.0)“ stellen — im Werkzeugkasten oder als Chip unter dem Text. Wirkt nur bei Form „Prosa“."
      : !nurProsa ? "Struktur steht auf Dramaturgie, die Form ist aber nicht Prosa — der Bauweg fällt still auf den gewöhnlichen zurück"
      : u.dramaVorhanden ? "" : "Struktur steht auf Dramaturgie, das aktive Preset trägt aber keinen Erzählbogen");
  knoten("modus", 2, "Modus", bez(MODE_OPTS, r["mode"] || "auto"), "an", "", "f-mode");
  const markov = r["markovMode"] || "off";
  knoten("markov", 1, "Markov", bez(MARKOV_OPTS, markov),
    istAus(markov) ? "aus" : u.korpusZeichen ? "an" : "leer",
    !istAus(markov) && !u.korpusZeichen ? "Markov ist an, aber der Korpus ist leer — er lernt aus nichts" : "", "f-markov");
  const disruptor = r["disruptor"] || "auto";
  knoten("disruptor", 2, "Disruptor", bez(DISRUPTOR_OPTS, disruptor), istAus(disruptor) ? "aus" : "an", "", "f-disruptor");
  knoten("varianz", 2, "Varianz", bez(VARIANZ_OPTS, r["varLevel"] || "mid"), "an", "", "f-varianz");
  const instab = String(r["instability"] ?? "0");
  knoten("instab", 2, "Instabilität", instab, instab === "0" ? "aus" : "an", "", "f-instab");
  knoten("archa", 2, "Archetyp A", bez(ARCH_OPTS, r["archetypeA"] || "neutral"),
    (r["archetypeA"] || "neutral") === "neutral" ? "aus" : "an", "", "f-archa");
  knoten("archb", 2, "Archetyp B", bez(ARCH_OPTS, r["archetypeB"] || "neutral"),
    (r["archetypeB"] || "neutral") === "neutral" ? "aus" : "an", "", "f-archb");

  // Die acht Stellschrauben. `korpus` ist die einzige mit einer eigenen Quelle —
  // und damit die einzige, die `leer` werden kann.
  const schraube = (feld: keyof Knobs, label: string, einheit: string): void => {
    const v = u.knobs[feld];
    const abw = v !== KNOB_VORGABE[feld];
    const tot = feld === "korpus" && v > 0 && !u.korpusZeichen;
    const band = feld === "korpus" ? 1 : feld === "satzlaenge" ? 3 : 2;
    knoten("k-" + feld, band, label, v + einheit + (abw ? "" : " (Vorgabe)"),
      tot ? "leer" : v === 0 ? "aus" : "an",
      tot ? "Korpus-Bausteine sind eingeschaltet, aber der Korpus ist leer" : "", "k-" + feld);
  };
  schraube("fuegeteil", "Fügeteil-Deckel", " %");
  schraube("w4max", "4W-Deckel", "×");
  schraube("abstand", "Nachlege-Abstand", "");
  schraube("bogen", "Erzählbogen", " %");
  schraube("ton", "Ton-Einschübe", " %");
  schraube("korpus", "Korpus-Bausteine", " %");
  schraube("phrase", "Phrasensperre", "");
  schraube("satzlaenge", "Satzlänge", "");

  // Figurendisziplin stand bis 4.288 nicht im Plan, obwohl sie ein Schloss
  // trägt und in jeden Text geht.
  const cast = r["cast"] ?? "0.5";
  knoten("cast", 2, "Figurendisziplin",
    cast === "0" ? "Offen" : cast === "1" ? "Streng" : "Mittel", "an", "", "f-cast");
  // Die Umwelt beschreibt nicht den Text, sie wirkt auf die Auswahl. Leer heißt
  // aus — und das ist der Normalfall, deshalb kein Befund.
  const umwelt = (r["umwelt"] || "").trim();
  knoten("umwelt", 2, "Umwelt", umwelt ? (r["umweltWirkung"] || "an") : "aus",
    umwelt ? "an" : "aus", umwelt ? "" : "kein Umweltzeichen eingetragen", "f-umwelt");

  // ── Spalte 3: Schliff ────────────────────────────────────────────────────
  knoten("persp", 3, "Perspektive", bez(PERSP_OPTS, r["perspective"] || "third"), "an", "", "f-persp");
  knoten("rhythm", 3, "Rhythmus", bez(RHYTHM_OPTS, r["rhythm"] || "auto"), "an", "", "f-rhythm");
  const spannung = r["tension"] || "auto";
  knoten("spannung", 3, "Spannung", spannung, istAus(spannung) ? "aus" : "an", "", "f-tension");
  knoten("schliff", 3, "Schliff", "Dubletten · Kohärenz · Bruchstücke", "an",
    "läuft immer: gleiche Nachbarsätze, Motivbezug, abgeschnittene Bausteine");

  // Neuheit und Überraschung steuern nicht den Satzbau, sondern die AUSWAHL
  // unter mehreren Fassungen. Sie gehören deshalb hinter den Schliff und nicht
  // in die Steuerung — und sie standen bis 4.288 gar nicht im Plan.
  const nov = parseInt(r["novelty"] ?? "0", 10) || 0;
  knoten("neuheit", 3, "Neuheit", nov + " %", nov ? "an" : "aus", "", "f-novelty");
  const surp = parseInt(r["surprise"] ?? "0", 10) || 0;
  knoten("ueberraschung", 3, "Überraschung", surp ? "Ziel " + surp + " %" : "aus",
    surp ? "an" : "aus", "", "f-surprise");

  // ── Spalte 4: Ausgabe ────────────────────────────────────────────────────
  const form = r["form"] || "prose";
  knoten("form", 4, "Form", bez(FORM_OPTS, form), "an", "", "f-form");
  const bericht = form === "bericht" || form === "meldung";
  knoten("ressort", 4, "Ressort", bericht ? (r["ressort"] || "auto") : "nur bei Bericht/Meldung",
    bericht ? "an" : "aus", bericht ? "" : "", "f-ressort");
  // Gemeldet: „Bei Länge ist das Schloss gesetzt, wird aber nicht angezeigt."
  // Der Grund war eine vergessene Kennung — der Knoten wurde ohne Schloss-Id
  // angelegt und konnte deshalb nie gesperrt aussehen. Seit 4.288 prüft der
  // Prüfstand jedes Bedienelement mit Schloss gegen den Plan.
  knoten("laenge", 4, "Länge", (r["lenTarget"] || "?") + " Wörter", "fest", "", "f-len");

  // ── Leitungen ────────────────────────────────────────────────────────────
  // Gezeichnet werden NUR die Leitungen, die tot sein können — also die, bei
  // denen ein Schalter an sein kann, während seine Quelle leer ist. Der übrige
  // Fluss (Band zu Band) ist eine Sammelschiene und braucht keine Einzellinie;
  // sechzig Striche von jedem Regler zum Zusammenbau wären ein Knäuel und keine
  // Auskunft.
  for (const [a, b] of [
    ["korpus", "markov"], ["korpus", "k-korpus"],
    ["sammler", "w4"], ["bilder", "w4"], ["themen", "w4"], ["welt", "w4"],
    ["preset", "drama"],
  ] as [string, string][]) kante(a, b);

  // Das Schloss kommt aus der Karte, nicht aus dem einzelnen Aufruf. Zeigen
  // mehrere Kennungen auf denselben Knoten (die vier W, Umwelt und ihre
  // Wirkung), gilt er als gesperrt, wenn ALLE zu sind — ein halb geschlossenes
  // Feld als „gesperrt" zu zeichnen wäre eine halbe Wahrheit.
  const proKnoten = new Map<string, string[]>();
  for (const [id, ziel] of Object.entries(SCHLOSS_ZU_KNOTEN)) {
    const l = proKnoten.get(ziel) || []; l.push(id); proKnoten.set(ziel, l);
  }
  for (const k of K) {
    const ids = proKnoten.get(k.id);
    if (ids) k.gesperrt = ids.every((id) => g(id));
  }

  return { knoten: K, kanten: E, zeit: new Date().toLocaleString("de-DE"), befunde };
}

// ── Die Bestände einsammeln ───────────────────────────────────────────────
// Der einzige unreine Teil dieses Moduls, und er ist absichtlich dünn: lesen,
// zählen, weiterreichen. Alles Urteil steckt in `baueAnlage`, damit der
// Prüfstand es ohne Browser durchspielen kann.
import { loadKnobs } from "./knobs";
import { loadPersistentCorpus } from "../corpus";
import { vorratStand } from "./wikisammler";
import { ladeBildvorrat } from "./bildsammler";
import { themenStand } from "./themenpool";
import { loadWorld } from "./world";
import { liveCount } from "./livepools";
import { loadTreasury } from "./treasury";
import { hasDramaData } from "../generation/dramaturgie";
import { PRESET_LABELS } from "../presets.data";

const LOCK_KEY = "divergenz_studio_locks_v1";

export function sammleUmgebung(preset: string): Umgebung {
  const zahl = <T,>(f: () => T, ersatz: T): T => { try { return f(); } catch { return ersatz; } };
  const welt = zahl(() => loadWorld(), { figuren: [], orte: [] } as unknown as ReturnType<typeof loadWorld>);
  // Ein Preset-Feld kann mehrere Namen tragen ("a+b"); der Bogen zählt, wenn
  // MINDESTENS einer ihn hat — genau so entscheidet es die Dramaturgie auch.
  const ids = String(preset || "").split("+").map((x) => x.trim()).filter(Boolean);
  return {
    korpusZeichen: zahl(() => loadPersistentCorpus().length, 0),
    sammlerFunde: zahl(() => vorratStand().funde, 0),
    bildFunde: zahl(() => ladeBildvorrat().length, 0),
    themenFunde: zahl(() => themenStand().funde, 0),
    weltFiguren: welt.figuren.length,
    weltOrte: welt.orte.length,
    livePools: zahl(() => liveCount(), 0),
    schatzkammer: zahl(() => loadTreasury().length, 0),
    knobs: zahl(() => loadKnobs(), { ...KNOB_VORGABE }),
    gesperrt: new Set<string>(zahl(() => JSON.parse(localStorage.getItem(LOCK_KEY) || "[]") as string[], [])),
    dramaVorhanden: zahl(() => hasDramaData(), false),
    presetLabel: ids.map((id) => PRESET_LABELS[id.replace(/^builtin:/, "")] || id).join(" + ") || "—",
  };
}
