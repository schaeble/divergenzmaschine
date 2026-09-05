// Die Erzählerbank — zehn Kurzgeschichten als Dramaturgie-Vorrat.
//
// Gewünscht: Zusätzlich zur Wortbank sollen bis zu zehn frei erstellte
// Kurzgeschichten mit unterschiedlichen Dramaturgien als Vorlage gespeichert
// werden; im Studio dienen sie als Dramaturgie-Set. Entscheidung: Der Bogen
// ist FEST GEWÄHLT und wird nur auf Wunsch gewürfelt.
//
// Arbeitsteilung: Die Wortbank variiert das WAS (Material), die Erzählerbank
// das WIE (Erzählform). Aus jeder Geschichte leitet derselbe Kern, der auch
// „Preset aus Text" trägt (preset2AusText), einen dramaturgischen Bogen ab —
// Einstieg, Mitte, Höhepunkt, Schluss, Auslöser, Veränderungen, Konflikte.
// Die Analyse erkennt Positionen und Signale, keine Feinformen wie
// Retardation oder Spiegelung; zehn Geschichten werden zu zehn verschiedenen
// Satzvorräten je Phase.
//
// Vorrangregel im Studio (Regler „Bogen"):
//   „aus Preset"   — wie bisher: der Bogen des aktiven Presets (2.0) gilt.
//   „1 … 10"       — der Bogen dieser Geschichte gilt, fest.
//   „würfeln"      — je Erzeugung wird eine nicht-leere Geschichte gezogen.
// Der Griff dazu ist eine Weiche in dramaturgie.ts (setBogenOverride):
// Das Studio setzt sie VOR jeder Erzeugung (stabil für den ganzen Text)
// und räumt sie bei „aus Preset" wieder ab. Die gespeicherten Preset-Bögen
// bleiben unangetastet.
//
// Speicher: dm_erzaehlerbank_v1 (zehn Plätze à Titel + Text, ~25 kB bei
// vollen Plätzen) und dm_erzaehler_quelle_v1 (die Wahl). Beide Schlüssel
// beginnen mit „dm_" und wandern damit automatisch in die Projektdatei.
import type { DramaData } from "../generation/dramaturgie";
import { SCHLAG_STANDARD } from "../generation/dramaturgie";
import { preset2AusText, teilstuecke, kategorieFuer } from "./textpreset";
import { deriveAtom } from "../atoms/derive";

const archivNorm = (e: Erzaehlung): string => `${e.titel}\u241E${e.text}`.toLowerCase().replace(/\s+/g, " ").trim();
const titelNorm = (t: string): string => (t || "").toLowerCase().replace(/\s+/g, " ").trim();

export interface Erzaehlung {
  titel: string; text: string;
  /** Schlüssel einer Bauform aus SCHLAGFOLGEN. */ folge?: string;
  /** Geburts-Bauform: unter welcher Bauform die Geschichte entstand oder
   *  zuerst archiviert wurde. Sie darf in jedem Bogen liegen — aber die
   *  Auswahl zeigt Geliehenes mit Kennzeichen, damit die Archive nicht
   *  leise zusammenlaufen (gewünscht: Herkunft festhalten, Option 1). */
  geburt?: string;
}

/** Die Bauformen: Name → Schlagfolge. Ein Schlagname darf mehrfach stehen
 *  (frisches Material je Vorkommen); fehlende Schläge fallen aus. „standard"
 *  ist der steigende Bogen von immer. */
export const SCHLAGFOLGEN: Record<string, { name: string; folge: string[] }> = {
  standard:      { name: "Steigender Bogen", folge: SCHLAG_STANDARD },
  kreis:         { name: "Kreisschluss", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss", "einstieg"] },
  rueckwaerts:   { name: "Rückwärts", folge: ["schluss", "hoehepunkt", "wende", "ausloeser", "konflikt", "mitte", "regel", "hook", "einstieg"] },
  retardation:   { name: "Späte Wende", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "mitte2", "regel", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  doppelt:       { name: "Doppelte Wende", folge: ["einstieg", "hook", "mitte", "ausloeser", "wende", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  still:         { name: "Stiller Bogen", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "mitte2", "zeit", "einsatz", "schluss"] },
  eskalation:    { name: "Eskalation", folge: ["einstieg", "hook", "mitte", "mitte", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  katastrophe:   { name: "Katastrophe zuerst", folge: ["hoehepunkt", "einstieg", "hook", "mitte", "konflikt", "ausloeser", "wende", "einsatz", "schluss"] },
  straenge:      { name: "Zwei Stränge", folge: ["einstieg", "mitte", "einstieg", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz", "schluss"] },
  offen:         { name: "Offenes Ende", folge: ["einstieg", "hook", "regel", "mitte", "konflikt", "ausloeser", "wende", "hoehepunkt", "einsatz"] },
  // Punkt 4 des Zielbilds: die Schlagfolge aus der Geschichte ABLEITEN statt
  // sie zuzuweisen. Die Folge steht hier leer — sie wird je Platz aus dem
  // Text berechnet (ableiteSchlagfolge), sobald diese Bauform gewählt ist.
  eigen:         { name: "Eigene — aus dem Text abgeleitet", folge: [] },
};
// ── Ein Arbeitsplatz, das Archiv als Bank (Umbau 4.341.0) ──────────────────
// Gewünscht: Die zehn Plätze waren nur Sichtfenster auf denselben Vorrat,
// seit jede gespeicherte Geschichte im Archiv liegt und dort wählbar ist.
// Jetzt: EIN Arbeitsplatz (Titel, Text, Bauform) zum Schreiben, das Archiv
// als Bank — der Regler „Bogen" im Studio zeigt die Archiv-Einträge, Würfeln
// zieht aus dem ganzen Archiv. Alte Plätze wandern beim ersten Aufruf ins
// Archiv (migriereAltePlaetze), nichts geht verloren.
const ARBEITSPLATZ_KEY = "dm_erzaehler_arbeitsplatz_v1";
const ALTE_BANK_KEY = "dm_erzaehlerbank_v1";
const QUELLE_KEY = "dm_erzaehler_quelle_v1";

export function ladeArbeitsplatz(): Erzaehlung {
  migriereAltePlaetze();
  try {
    const e = JSON.parse(localStorage.getItem(ARBEITSPLATZ_KEY) || "null") as Partial<Erzaehlung> | null;
    const f = String(e?.folge || "");
    return { titel: String(e?.titel || "").slice(0, 60), text: String(e?.text || ""), folge: SCHLAGFOLGEN[f] ? f : "standard",
      geburt: typeof e?.geburt === "string" ? e.geburt : undefined };
  } catch { return { titel: "", text: "", folge: "standard" }; }
}
export function speichereArbeitsplatz(e: Erzaehlung): void {
  try { localStorage.setItem(ARBEITSPLATZ_KEY, JSON.stringify(e)); } catch { /* voll */ }
}

/** Die Wahl im Studio: "preset" | "wuerfeln" | Kennung eines Archiv-Eintrags. */
export type ErzaehlerQuelle = string;
export function ladeQuelle(): ErzaehlerQuelle {
  migriereAltePlaetze();
  const q = localStorage.getItem(QUELLE_KEY) || "preset";
  return q === "preset" || q === "wuerfeln" || /^a:/.test(q) ? q : "preset";
}
export function setzeQuelle(q: ErzaehlerQuelle): void {
  try { localStorage.setItem(QUELLE_KEY, q); } catch { /* voll */ }
}

/** Ein Text ist brauchbar, wenn er genug Teilstücke hergibt. */
export function platzBrauchbar(e: Erzaehlung): boolean {
  return (e.text || "").split(/\s+/).filter(Boolean).length >= 40;
}

/** Der Bogen einer Erzählung — oder null, wenn sie zu dünn ist. Die Bauform
 *  wird zur Schlagfolge des Bogens; „eigen" leitet sie aus dem Text ab. */
export function bogenAus(e: Erzaehlung | null | undefined): DramaData | null {
  if (!e || !platzBrauchbar(e)) return null;
  const drama = preset2AusText(e.text).drama;
  if (e.folge === "eigen") drama.folge = ableiteSchlagfolge(e.text);
  else if (e.folge && SCHLAGFOLGEN[e.folge]) drama.folge = SCHLAGFOLGEN[e.folge]!.folge;
  return drama;
}

/** Kennung eines Archiv-Eintrags: Bauform + Titel-Identität. Stabil über
 *  Textänderungen, weil der Titel die Identität ist (4.335.7); ohne Titel
 *  der Wortlaut. */
export function eintragId(e: Erzaehlung): string {
  const basis = `${e.folge || "standard"}|${titelNorm(e.titel) || archivNorm(e)}`;
  let h = 0;
  for (let i = 0; i < basis.length; i++) h = (h * 31 + basis.charCodeAt(i)) >>> 0;
  return `a:${e.folge || "standard"}:${h.toString(36)}`;
}

/** Alle Archiv-Einträge, nach Bauform in der Ordnung der SCHLAGFOLGEN. */
export function archivEintraege(): (Erzaehlung & { id: string })[] {
  migriereAltePlaetze();
  const a = ladeArchiv();
  const out: (Erzaehlung & { id: string })[] = [];
  for (const k of Object.keys(SCHLAGFOLGEN)) for (const e of a[k] || []) out.push({ ...e, id: eintragId(e) });
  for (const [k, l] of Object.entries(a)) if (!SCHLAGFOLGEN[k]) for (const e of l) out.push({ ...e, id: eintragId(e) });
  return out;
}
export function eintragNachId(id: string): (Erzaehlung & { id: string }) | null {
  return archivEintraege().find((e) => e.id === id) || null;
}

let letzter: (Erzaehlung & { id: string }) | null = null;
/** Welcher Eintrag zuletzt gezogen wurde (auch beim Würfeln). */
export function letzterGezogen(): (Erzaehlung & { id: string }) | null { return letzter; }
export function bogenFuerErzeugung(): DramaData | null {
  const q = ladeQuelle();
  letzter = null;
  if (q === "preset") return null;
  if (q === "wuerfeln") {
    const brauchbar = archivEintraege().filter((e) => platzBrauchbar(e));
    if (!brauchbar.length) return null;
    letzter = brauchbar[Math.floor(Math.random() * brauchbar.length)]!;
    return bogenAus(letzter);
  }
  const e = eintragNachId(q);
  if (!e || !platzBrauchbar(e)) return null;
  letzter = e;
  return bogenAus(e);
}
/** Beschriftung des geladenen Bogens — für Infoblasen. */
export function bogenBeschriftung(): { bogen: string; bauform: string } {
  const q = ladeQuelle();
  if (letzter) return { bogen: `${q === "wuerfeln" ? "gewürfelt: " : ""}${letzter.titel || "Ohne Titel"}`, bauform: SCHLAGFOLGEN[letzter.folge || "standard"]?.name || letzter.folge || "" };
  if (q === "preset") return { bogen: "aus Preset", bauform: "Steigender Bogen" };
  return { bogen: q === "wuerfeln" ? "würfeln — kein brauchbarer Eintrag im Archiv" : "gewählter Eintrag fehlt im Archiv", bauform: "" };
}

/** Alte Zehn-Plätze-Bank ins Archiv überführen — einmalig, beim ersten
 *  Aufruf nach dem Umbau. Der zuletzt gewählte Platz wird zum Arbeitsplatz
 *  und bleibt gewählt; leere Plätze fallen. */
let migriert = false;
export function migriereAltePlaetze(): void {
  if (migriert) return;
  migriert = true;
  try {
    const roh = localStorage.getItem(ALTE_BANK_KEY);
    if (!roh) return;
    const alte = JSON.parse(roh) as Partial<Erzaehlung>[];
    const q = localStorage.getItem(QUELLE_KEY) || "preset";
    let gewaehlt: Erzaehlung | null = null;
    if (Array.isArray(alte)) alte.forEach((p, i) => {
      const e: Erzaehlung = { titel: String(p?.titel || "").slice(0, 60), text: String(p?.text || ""), folge: SCHLAGFOLGEN[String(p?.folge || "")] ? String(p?.folge) : "standard", geburt: typeof p?.geburt === "string" ? p.geburt : undefined };
      if (!platzBrauchbar(e)) return;
      archiviere(e);
      if (String(i) === q || (!gewaehlt && q !== "preset" && q !== "wuerfeln" && !/^[0-9]$/.test(q))) gewaehlt = e;
      if (!gewaehlt && q === "preset" && i === 0) gewaehlt = e;
    });
    if (gewaehlt) {
      localStorage.setItem(ARBEITSPLATZ_KEY, JSON.stringify(gewaehlt));
      if (/^[0-9]$/.test(q)) localStorage.setItem(QUELLE_KEY, eintragId(gewaehlt));
    }
    localStorage.removeItem(ALTE_BANK_KEY);
  } catch { /* alte Bank unlesbar — sie bleibt liegen */ }
}

/** Leitet die Schlagfolge aus der Geschichte selbst ab: Jedes Teilstück wird
 *  nach denselben Merkmalen sortiert wie beim Preset aus Text, und die
 *  REIHENFOLGE im Text wird zur Folge der Schläge — der erste Haken ist der
 *  Einstieg, Bilder sind Mitten, Widerstand ist Konflikt, Wenden sind Wenden,
 *  die letzte Wende der Höhepunkt, „es geht um" der Einsatz, die letzten
 *  Sätze der Schluss. Gleiche Schläge in Folge fallen zusammen; über zwölf
 *  wird ausgedünnt. So trägt „Katastrophe zuerst" nicht die Vorlage, sondern
 *  die Geschichte: Steht die Wende im ersten Satz, steht sie in der Folge
 *  vorn. */
export function ableiteSchlagfolge(text: string): string[] {
  const stuecke = teilstuecke(text);
  const grenze = Math.max(0, stuecke.length - 2);
  const roh: string[] = [];
  let ersterHaken = true;
  stuecke.forEach((st, i) => {
    const kat = kategorieFuer(st, i >= grenze && deriveAtom(st).typ === "hauptsatz");
    let schlag: string;
    switch (kat) {
      case "hooks": schlag = ersterHaken ? "einstieg" : "hook"; ersterHaken = false; break;
      case "props": schlag = "ausloeser"; break;
      case "motifs": schlag = "mitte"; break;
      case "obstacles": schlag = "konflikt"; break;
      case "turns": schlag = "wende"; break;
      case "stakes": schlag = "einsatz"; break;
      case "endings": schlag = "schluss"; break;
      default: schlag = "mitte";
    }
    if (roh[roh.length - 1] !== schlag) roh.push(schlag);
  });
  if (!roh.length) return SCHLAGFOLGEN["standard"]!.folge;
  // Die letzte Wende ist der Höhepunkt.
  const letzteWende = roh.lastIndexOf("wende");
  if (letzteWende >= 0) roh[letzteWende] = "hoehepunkt";
  // Der Einstieg steht vorn, der Schluss hinten — genau einmal. (Ein Satz mit
  // „zählt" wird sonst als Einsatz gelesen und stünde vor dem Einstieg.)
  let folge = roh.filter((x) => x !== "einstieg" && x !== "schluss");
  folge.unshift("einstieg");
  folge.push("schluss");
  // Ausdünnen auf höchstens zwölf: Gelenke (einstieg, hoehepunkt, schluss, einsatz) bleiben;
  // danach Gleiches in Folge zusammenziehen, das durch das Ausdünnen entstand.
  const gelenk = new Set(["einstieg", "hoehepunkt", "schluss", "einsatz"]);
  while (folge.length > 12) {
    const weg = folge.findIndex((x, i) => !gelenk.has(x) && i % 2 === 1);
    if (weg < 0) break;
    folge.splice(weg, 1);
    folge = folge.filter((x, i) => i === 0 || x !== folge[i - 1]);
  }
  return folge;
}

/** Der Bogen für DIESE Erzeugung, nach der gespeicherten Wahl.
 *  "preset" → null (der Preset-Bogen gilt); fester Platz → sein Bogen;
 *  "wuerfeln" → ein zufälliger brauchbarer Platz. Fällt alles aus (leere
 *  Plätze), ebenfalls null — die Maschine erzählt dann wie bisher. */
// ── KI: Einen Platz neu erzählen lassen ─────────────────────────────────────
// Gewünscht: Die zehn Bögen sollen auch per KI erneuert/gewürfelt werden
// können — jeder für sich. Die KI schreibt eine neue Kurzgeschichte in der
// BAUFORM des Platzes; Titel und Text ersetzen den Platz, die Bauform bleibt.
// Der Schlüssel und der Aufruf laufen über die vorhandene KI-Anbindung
// (features/ki.ts, Schlüssel nur lokal).
export const BAUFORM_ANWEISUNG: Record<string, string> = {
  standard: "ein klassisch steigender Bogen: ruhiger Anfang, wachsende Störung, Krise kurz vor Schluss, knappe Auflösung",
  kreis: "ein Kreisschluss: das Ende kehrt erkennbar zum Bild des Anfangs zurück, leicht verschoben",
  rueckwaerts: "rückwärts erzählt: beginne mit dem Ende, arbeite dich in Etappen (mehrmals „Davor“) zum Anfang vor, der Anfang erklärt alles",
  retardation: "mit später Wende: lange scheinbare Entwarnung, die Störung kehrt leise zurück, die Wende kommt spät und schnell",
  doppelt: "mit doppelter Wende: eine erste Wende kippt die Lage, eine zweite kippt sie erneut in eine unerwartete Richtung",
  still: "ein stiller Bogen: äußerlich geschieht fast nichts, die Veränderung ist innerlich; keine Ausrufe, keine Katastrophe",
  eskalation: "eine Eskalation in drei Stufen: dreimal dasselbe Muster, jedes Mal größer, dann die Folge",
  katastrophe: "Katastrophe zuerst: das schlimme Ereignis steht im ersten Satz, danach die Aufarbeitung und ein leiser Fund",
  straenge: "zwei Stränge: zwei Figuren getrennt erzählt, abwechselnd, die sich am Ende an einem Ort treffen",
  offen: "offenes Ende: die Spannung baut sich auf, die Auflösung wird verweigert; der letzte Satz lässt es in der Schwebe",
  eigen: "eine freie Bauform: die Geschichte bestimmt ihre eigene Reihenfolge — wo die Wende steht, steht sie; die Maschine leitet die Schlagfolge hinterher aus dem Text ab",
};

export function bauePromptErzaehlung(folgeId: string, thema?: string): string {
  const bau = BAUFORM_ANWEISUNG[folgeId] || BAUFORM_ANWEISUNG["standard"]!;
  const t = (thema || "").trim();
  return [
    "Schreibe eine sehr kurze deutsche Erzählung, 120 bis 170 Wörter, Präsens, konkrete Bilder, keine Anführungszeichen, keine Aufzählungen.",
    `Bauform: ${bau}.`,
    t ? `Thema oder Ausgangspunkt: ${t}.` : "Thema frei wählen — alltagsnah, mit einem leisen Riss.",
    "Kurze Hauptsätze bevorzugen; ein bis zwei reine Bildsätze ohne Verb sind erwünscht (sie werden als Bilder und Requisiten gelesen); mindestens ein Satz mit „Es geht um ...“.",
    'Antworte NUR mit JSON, ohne Erklärung: {"titel": "...", "text": "..."} — der Titel höchstens vier Wörter.',
  ].join("\n");
}

export async function kiErzaehlung(folgeId: string, thema?: string): Promise<Erzaehlung> {
  const { callClaude, extractJson } = await import("./ki");
  const raw = await callClaude(bauePromptErzaehlung(folgeId, thema), 800);
  const j = extractJson(raw) as { titel?: unknown; text?: unknown } | null;
  const titel = String(j && j.titel || "").trim().slice(0, 60);
  const text = String(j && j.text || "").trim();
  if (!platzBrauchbar({ titel, text })) throw new Error("Die KI-Antwort trägt keine brauchbare Erzählung (zu kurz oder leer).");
  return { titel: titel || "Ohne Titel", text, folge: folgeId };
}

// ── Archiv: mehrere Geschichten je Bauform ──────────────────────────────────
// Gewünscht: Pro Bogen (Bauform) sollen mehrere Geschichten gespeichert und
// über den Titel wieder ausgesucht werden können. Jedes Speichern und jede
// gelungene KI-Erzählung legt die Geschichte im Archiv ihrer Bauform ab —
// dedupliziert über Titel und Text, neueste zuerst, höchstens zwanzig je
// Bauform (localStorage; das Archiv wandert mit der Projektdatei).
const ARCHIV_KEY = "dm_erzaehler_archiv_v1";
export const ARCHIV_JE_BAUFORM = 20;
export type ErzaehlArchiv = Record<string, Erzaehlung[]>;

export function ladeArchiv(): ErzaehlArchiv {
  try {
    const r = JSON.parse(localStorage.getItem(ARCHIV_KEY) || "{}") as unknown;
    if (!r || typeof r !== "object" || Array.isArray(r)) return {};
    const out: ErzaehlArchiv = {};
    for (const [k, v] of Object.entries(r as Record<string, unknown>))
      if (Array.isArray(v)) out[k] = v.filter((e): e is Erzaehlung => !!e && typeof e === "object" && typeof (e as Erzaehlung).text === "string")
        .map((e) => ({ titel: String(e.titel || "").slice(0, 60), text: String(e.text), folge: k, geburt: typeof (e as Erzaehlung).geburt === "string" ? (e as Erzaehlung).geburt : undefined }));
    return out;
  } catch { return {}; }
}
export function speichereArchiv(a: ErzaehlArchiv): void {
  try { localStorage.setItem(ARCHIV_KEY, JSON.stringify(a)); } catch { /* voll */ }
}

/** Legt eine Geschichte im Archiv ihrer Bauform ab — gewünscht (4.335.7):
 *  Der TITEL ist die Identität. Gibt es unter dieser Bauform schon einen
 *  Eintrag mit demselben Titel, wird nur der Fortschritt des Textes
 *  gespeichert (der Eintrag rückt nach vorn, seine Geburt bleibt) — keine
 *  neue Version. Erst ein NEUER Titel legt einen neuen Eintrag an.
 *  Ohne Titel gilt der Wortlaut als Identität, damit namenlose Texte sich
 *  nicht gegenseitig überschreiben. */
export function archiviere(e: Erzaehlung): void {
  if (!platzBrauchbar(e)) return;
  const folge = e.folge || "standard";
  const a = ladeArchiv();
  const liste = a[folge] || [];
  const tKey = titelNorm(e.titel);
  const gleich = (x: Erzaehlung): boolean => tKey ? titelNorm(x.titel) === tKey : archivNorm(x) === archivNorm(e);
  const vorhanden = liste.find(gleich);
  // Geburts-Bauform: vom bestehenden Eintrag; sonst von einem gleichnamigen
  // (bzw. wortgleichen) Eintrag in irgendeinem Archiv — Geliehenes bleibt
  // erkennbar; sonst ist die jetzige Bauform die Geburt.
  let geburt = e.geburt || vorhanden?.geburt;
  if (!geburt) for (const [, l] of Object.entries(a)) { const alt = l.find(gleich); if (alt) { geburt = alt.geburt || alt.folge; break; } }
  geburt = geburt || folge;
  a[folge] = [{ titel: e.titel || "Ohne Titel", text: e.text, folge, geburt }, ...liste.filter((x) => !gleich(x))].slice(0, ARCHIV_JE_BAUFORM);
  speichereArchiv(a);
}
export function archivFuer(folge: string): Erzaehlung[] { return ladeArchiv()[folge] || []; }
export function loescheAusArchiv(folge: string, index: number): void {
  const a = ladeArchiv();
  const liste = a[folge] || [];
  if (index < 0 || index >= liste.length) return;
  a[folge] = liste.filter((_, i) => i !== index);
  speichereArchiv(a);
}
export function loescheEintrag(id: string): void {
  const a = ladeArchiv();
  for (const [k, l] of Object.entries(a)) a[k] = l.filter((e) => eintragId(e) !== id);
  speichereArchiv(a);
}
/** Bauform eines Archiv-Eintrags ändern: Der Eintrag zieht in das Archiv der
 *  neuen Bauform um (Titel-Identität bleibt, Geburt bleibt). Gibt die neue
 *  Kennung zurück. */
export function bauformAendern(id: string, folge: string): string | null {
  const e = eintragNachId(id);
  if (!e || !SCHLAGFOLGEN[folge]) return null;
  loescheEintrag(id);
  const neu: Erzaehlung = { titel: e.titel, text: e.text, folge, geburt: e.geburt || e.folge };
  archiviere(neu);
  return eintragId(neu);
}
