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
import { preset2AusText } from "./textpreset";

export interface Erzaehlung { titel: string; text: string; /** Schlüssel einer Bauform aus SCHLAGFOLGEN. */ folge?: string; }

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
};
export const ERZAEHLER_PLAETZE = 10;
const BANK_KEY = "dm_erzaehlerbank_v1";
const QUELLE_KEY = "dm_erzaehler_quelle_v1";

/** Immer genau zehn Plätze — leere als { titel: "", text: "" }. */
export function ladeErzaehlerbank(): Erzaehlung[] {
  let roh: unknown = [];
  try { roh = JSON.parse(localStorage.getItem(BANK_KEY) || "[]"); } catch { roh = []; }
  const list = Array.isArray(roh) ? roh : [];
  return Array.from({ length: ERZAEHLER_PLAETZE }, (_, i) => {
    const e = list[i] as Partial<Erzaehlung> | undefined;
    const f = String(e?.folge || "");
    return { titel: String(e?.titel || "").slice(0, 60), text: String(e?.text || ""), folge: SCHLAGFOLGEN[f] ? f : undefined };
  });
}

export function speichereErzaehlerbank(list: Erzaehlung[]): void {
  try { localStorage.setItem(BANK_KEY, JSON.stringify(list.slice(0, ERZAEHLER_PLAETZE))); } catch { /* voll */ }
}

/** Die Wahl: "preset" | "wuerfeln" | "0" … "9" (fester Platz). */
export type ErzaehlerQuelle = string;
export function ladeQuelle(): ErzaehlerQuelle {
  const q = localStorage.getItem(QUELLE_KEY) || "preset";
  return q === "preset" || q === "wuerfeln" || /^[0-9]$/.test(q) ? q : "preset";
}
export function setzeQuelle(q: ErzaehlerQuelle): void {
  try { localStorage.setItem(QUELLE_KEY, q); } catch { /* voll */ }
}

/** Ein Platz ist brauchbar, wenn sein Text genug Teilstücke hergibt. */
export function platzBrauchbar(e: Erzaehlung): boolean {
  return (e.text || "").split(/\s+/).filter(Boolean).length >= 40;
}

/** Der Bogen eines Platzes — oder null, wenn er leer/zu dünn ist. */
export function erzaehlerBogen(index: number): DramaData | null {
  const e = ladeErzaehlerbank()[index];
  if (!e || !platzBrauchbar(e)) return null;
  const drama = preset2AusText(e.text).drama;
  // Die Bauform des Platzes wird zur Schlagfolge des Bogens — so schlägt sie
  // in der Struktur „Dramaturgie" wirklich durch.
  if (e.folge && SCHLAGFOLGEN[e.folge]) drama.folge = SCHLAGFOLGEN[e.folge]!.folge;
  return drama;
}

/** Der Bogen für DIESE Erzeugung, nach der gespeicherten Wahl.
 *  "preset" → null (der Preset-Bogen gilt); fester Platz → sein Bogen;
 *  "wuerfeln" → ein zufälliger brauchbarer Platz. Fällt alles aus (leere
 *  Plätze), ebenfalls null — die Maschine erzählt dann wie bisher. */
export function bogenFuerErzeugung(): DramaData | null {
  const q = ladeQuelle();
  if (q === "preset") return null;
  if (/^[0-9]$/.test(q)) return erzaehlerBogen(parseInt(q, 10));
  const brauchbar = ladeErzaehlerbank().map((e, i) => ({ e, i })).filter((x) => platzBrauchbar(x.e));
  if (!brauchbar.length) return null;
  return erzaehlerBogen(brauchbar[Math.floor(Math.random() * brauchbar.length)]!.i);
}

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
        .map((e) => ({ titel: String(e.titel || "").slice(0, 60), text: String(e.text), folge: k }));
    return out;
  } catch { return {}; }
}
export function speichereArchiv(a: ErzaehlArchiv): void {
  try { localStorage.setItem(ARCHIV_KEY, JSON.stringify(a)); } catch { /* voll */ }
}
const archivNorm = (e: Erzaehlung): string => `${e.titel}\u241E${e.text}`.toLowerCase().replace(/\s+/g, " ").trim();

/** Legt eine Geschichte im Archiv ihrer Bauform ab. Gleicher Titel MIT
 *  gleichem Text rückt nur nach vorn; gleicher Titel mit neuem Text wird ein
 *  eigener Eintrag (der Titel zeigt dann beide, neueste zuerst). */
export function archiviere(e: Erzaehlung): void {
  if (!platzBrauchbar(e)) return;
  const folge = e.folge || "standard";
  const a = ladeArchiv();
  const liste = a[folge] || [];
  const key = archivNorm(e);
  a[folge] = [{ titel: e.titel || "Ohne Titel", text: e.text, folge }, ...liste.filter((x) => archivNorm(x) !== key)].slice(0, ARCHIV_JE_BAUFORM);
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
