// Bildsammler: Ein Foto wird zu Text, der Text wird zu Korpusmaterial und zu
// 4W-Kontext. Der erste Weg in die Maschine hinein, der nicht über Sprache
// führt.
//
// Alles Rechnende steht hier: Prompt, Beutefilter, Auswertung der Antwort,
// Kostenschätzung. Der Browser wird nur zum Einlesen des Bildes gebraucht.
//
// Die eigentliche Arbeit ist NICHT die Anbindung, sondern der Filter. Der
// Korpus ist beständig; schlechtes Material darin kostet null Euro und
// vergiftet jede künftige Ausgabe. Es wieder herauszubekommen ist mühsam.

import { schaetzeTokens, type Modell } from "./lehrer";

/** Ein Bild kostet ungefähr Fläche durch 750 an Eingabe-Token. Die Fläche
 *  entscheidet, nicht die Dateigröße — ein stark komprimiertes JPEG ist
 *  genauso teuer wie ein unkomprimiertes gleicher Kantenlänge. */
export function bildTokens(b: number, h: number): number {
  if (!(b > 0) || !(h > 0)) return 0;
  return Math.round((b * h) / 750);
}

// ── Der Beutefilter ─────────────────────────────────────────────────────────
// Ein Modell, das man um eine Bildbeschreibung bittet, schreibt „Das Bild zeigt
// einen älteren Mann auf einer Parkbank“. Als Korpusfutter ist das Gift: Jeder
// Eintrag begänne gleich, und die Maschine würfelte fortan „Das Bild
// zeigt“-Sätze. Dazu Wendungen, die auf ein Bild verweisen, das im Korpus gar
// nicht existiert — „im Vordergrund“, „man sieht“, „links daneben“.
//
// Die Regel ist deshalb hart: Ein Satz muss OHNE das Bild stehen können. Der
// Prompt sagt das, und der Filter setzt es durch — denn ein Prompt ist eine
// Bitte, kein Riegel.

/** Wendungen, die einen Satz als Bildbeschreibung verraten. Getroffen wird auf
 *  Wortgrenzen, damit „Bildhauer“ oder „Ansicht“ nicht mitfallen. */
export const VERRAETER: RegExp[] = [
  /\b(?:das|dieses|auf dem|im)\s+(?:bild|foto|photo|motiv)\b/i,
  /\b(?:bild|foto|photo|aufnahme|abbildung|szene)(?:es|s|er|n)?\s+zeigt\b/i,
  /\bzu sehen ist\b/i,
  /\bman (?:sieht|erkennt|blickt)\b/i,
  /\b(?:im|in den|aus dem)\s+(?:vorder|hinter|mittel)grund\b/i,
  /\bder betrachter\b/i,
  /\b(?:abgebildet|fotografiert|aufgenommen|dargestellt)\b/i,
  /\b(?:links|rechts|oben|unten|mittig)\s+(?:im|am)\s+(?:bild|rand)\b/i,
  /\bbild(?:aus|auf)schnitt\b/i,
  /\bim bildzentrum\b/i,
  /\bkamera\b/i,
  /\bperspektive\s+(?:des|der)\b/i,
];

/** Ist der Satz eine Bildbeschreibung statt eines eigenständigen Satzes? */
export function verraetBild(satz: string): boolean {
  return VERRAETER.some((r) => r.test(satz || ""));
}

/** Ein einzelner Satz für den Korpus. Zu kurz taugt nichts, zu lang ist meist
 *  eine Aufzählung, die der Markov-Kette nichts gibt. */
export function taugtSatz(s: string, min = 20, max = 260): boolean {
  const t = (s || "").trim();
  if (t.length < min || t.length > max) return false;
  if (verraetBild(t)) return false;
  // Ohne Verb ist es eine Liste, kein Satz. Grob geprüft: irgendwo muss ein
  // Wort stehen, das nicht großgeschrieben ist — im Deutschen sind das die
  // Verben, Artikel und Präpositionen.
  if (!/\s[a-zäöüß]{2,}/.test(t)) return false;
  return (t.match(/\S+/g) || []).length >= 4;
}

/** Der Filter über eine ganze Ernte. Gibt Behaltenes und Verworfenes getrennt
 *  zurück — was weggefiltert wurde, ist die interessantere Hälfte: Daran sieht
 *  man, ob der Prompt taugt oder der Filter zu scharf steht. */
export function beute(saetze: string[]): { behalten: string[]; verworfen: string[] } {
  const behalten: string[] = [], verworfen: string[] = [];
  const gesehen = new Set<string>();
  for (const roh of saetze || []) {
    const s = String(roh || "").trim().replace(/\s+/g, " ");
    if (!s) continue;
    const schluessel = s.toLowerCase();
    if (gesehen.has(schluessel)) { verworfen.push(s); continue; }
    gesehen.add(schluessel);
    (taugtSatz(s) ? behalten : verworfen).push(s);
  }
  return { behalten, verworfen };
}

// ── Der Prompt ──────────────────────────────────────────────────────────────

export interface BildErnte {
  saetze: string[];
  ctx: { who: string; where: string; when: string; what: string };
}

/** Wie viele Sätze angefordert werden. Nicht „beschreibe ausführlich“: Ein Foto
 *  gibt vielleicht zwölf brauchbare Nomen und ein Dutzend Sätze her, keine
 *  vierhundert Wörter. Und die Ausgabe ist der teure Teil. */
export const SAETZE_VORGABE = 12;

export function bauePrompt(anzahl = SAETZE_VORGABE, hinweis = ""): string {
  const n = Math.max(3, Math.min(40, Math.round(anzahl) || SAETZE_VORGABE));
  const h = (hinweis || "").trim();
  return "Du lieferst Rohmaterial für einen deutschsprachigen Textgenerator. "
    + "Du bekommst ein Bild. Schreibe daraus Sätze, die als Sprachmaterial taugen.\n\n"
    + "HÄRTESTE REGEL: Jeder Satz muss ohne das Bild stehen können. "
    + "Es darf kein Wort darauf hinweisen, dass es ein Bild gibt. "
    + "Verboten sind daher: „das Bild zeigt“, „zu sehen ist“, „man sieht“, „im Vordergrund“, "
    + "„im Hintergrund“, „der Betrachter“, „abgebildet“, „aufgenommen“, „Kamera“, "
    + "„links im Bild“ und alles Vergleichbare. "
    + "Ein Satz, der solche Wendungen enthält, wird verworfen und war umsonst.\n\n"
    + "Schreibe nüchtern und benennend, NICHT literarisch. Keine Deutung, keine Stimmung, "
    + "keine Metaphern, keine Adjektivketten. Dinge, Stoffe, Licht, Abnutzung, Gesten, "
    + "Wetter, Tageszeit, Kleidung, Geräusche, die dazugehören — benannt, nicht ausgeschmückt. "
    + "Die Fremdheit stellt die Maschine selbst her; Material, das schon schön ist, nimmt ihr die Arbeit ab.\n\n"
    + `Liefere ${n} kurze Sätze, jeder 5 bis 25 Wörter, jeder für sich stehend, keine Aufzählungen.\n\n`
    + "Dazu vier Angaben für den Kontext, jede höchstens sechs Wörter, jede ohne Bildbezug:\n"
    + "- who: wer vorkommt (Person, Rolle, Tier — ohne Namen zu erfinden)\n"
    + "- where: der Ort\n"
    + "- when: die Zeit (Tageszeit, Jahreszeit, Epoche — nur wenn erkennbar)\n"
    + "- what: was geschieht\n"
    + "Ist etwas nicht erkennbar, gib eine leere Zeichenkette. Rate nicht.\n"
    + (h ? `\nZusätzliche Vorgabe des Nutzers (vorrangig): ${h}\n` : "")
    + '\nAntworte mit reinem JSON, beginnend mit { und endend mit }: '
    + '{"saetze": ["…"], "ctx": {"who": "…", "where": "…", "when": "…", "what": "…"}}. '
    + "Keine Erklärung, kein Markdown.";
}

/** Antwort auswerten. Nimmt alles entgegen, auch Unsinn — eine Antwort, die
 *  nicht der Form entspricht, darf keinen Absturz erzeugen, sondern eine leere
 *  Ernte. */
export function leseErnte(roh: unknown): BildErnte {
  const leer: BildErnte = { saetze: [], ctx: { who: "", where: "", when: "", what: "" } };
  if (!roh || typeof roh !== "object") return leer;
  const o = roh as Record<string, unknown>;
  const saetze = Array.isArray(o.saetze)
    ? o.saetze.filter((s): s is string => typeof s === "string")
    : [];
  const c = (o.ctx && typeof o.ctx === "object" ? o.ctx : {}) as Record<string, unknown>;
  const feld = (k: string): string => {
    const v = typeof c[k] === "string" ? (c[k] as string).trim().replace(/\s+/g, " ") : "";
    // Auch die 4W-Felder dürfen nicht aufs Bild zeigen — sie landen im Studio
    // als Vorgabe und würden von dort in jeden erzeugten Text wandern.
    if (!v || verraetBild(v)) return "";
    return v.slice(0, 80);
  };
  return { saetze, ctx: { who: feld("who"), where: feld("where"), when: feld("when"), what: feld("what") } };
}

// ── Kosten ──────────────────────────────────────────────────────────────────

/** Deckel für die Antwort. Die Ausgabe ist hier der teure Teil: Bei Haiku
 *  kostet ein Bild rund 1.400 Eingabe-Token, zwölf Sätze aber schnell 400
 *  Ausgabe-Token — und die zum Fünffachen. */
export function maxToken(anzahl = SAETZE_VORGABE): number {
  const n = Math.max(3, Math.min(40, Math.round(anzahl) || SAETZE_VORGABE));
  return Math.min(4096, n * 45 + 300);
}

/** Geschätzte Kosten eines Laufs in US-Dollar, Bild eingerechnet. */
export function schaetzeLauf(b: number, h: number, anzahl: number, m: Modell): { ein: number; aus: number; usd: number } {
  const ein = bildTokens(b, h) + schaetzeTokens(bauePrompt(anzahl));
  const aus = maxToken(anzahl);
  return { ein, aus, usd: (ein * m.ein + aus * m.aus) / 1_000_000 };
}

/** Media-Typ und reine Nutzdaten aus einer Data-URL. Die API will beides
 *  getrennt; im localStorage steht es zusammen. */
export function zerlegeDatenUrl(url: string): { media: string; daten: string } | null {
  const m = /^data:([^;,]+);base64,(.+)$/s.exec(url || "");
  if (!m) return null;
  const media = m[1]!.toLowerCase();
  if (!/^image\/(jpeg|png|gif|webp)$/.test(media)) return null;
  return { media, daten: m[2]! };
}

// ── Der Bildvorrat ──────────────────────────────────────────────────────────
// Eigene Ablage, NICHT der Sammler-Vorrat. Die Taste „Wiki“ im Studio zieht
// aus dem Feed der Wikipedia, die Taste „Abschrift“ aus Bildern. Beides in
// einen Topf zu werfen hieße, im Studio mal das eine und mal das andere zu
// ziehen, ohne zu wissen, was kommt.
//
// Der Schlüssel beginnt mit „divergenz_“, wandert also von selbst in die
// Projektdatei.

export interface BildFund {
  /** Dateiname, nur zur Anzeige. */
  name: string;
  ctx: { who: string; where: string; when: string; what: string };
  /** Zeitpunkt der Aufnahme (ms), für Reihenfolge und Deckel. */
  gespeichert: number;
}

export const BILDVORRAT_KEY = "divergenz_bildvorrat_v1";
/** Deckel. Ein Fund ist winzig (vier kurze Felder), aber der localStorage ist
 *  geteilt — ein unbegrenzter Vorrat hinderte irgendwann ANDERE Daten am
 *  Sichern, und das fiele erst weit weg von hier auf. */
export const BILDVORRAT_DECKEL = 400;

/** Kennung eines Fundes. Der Dateiname taugt nicht: Handykameras vergeben
 *  denselben Namen nach einem Zurücksetzen erneut. Die vier Felder
 *  entscheiden. */
export function bildSchluessel(f: BildFund): string {
  const c = f.ctx;
  // Jedes Feld FÜR SICH normalisieren, nicht die zusammengesetzte Zeichenkette:
  // Sonst blieben Leerzeichen am Rand eines Feldes an der Trennstelle hängen,
  // und „ Ankunft “ zählte gegenüber „Ankunft“ als eigener Fund.
  const n = (v: string): string => (v || "").toLowerCase().replace(/\s+/g, " ").trim();
  return [n(c.who), n(c.where), n(c.when), n(c.what)].join("|");
}

/** Ein Fund taugt nur, wenn er im Studio etwas bewirken kann. Vier leere
 *  Felder wären ein Zug, bei dem sichtbar nichts geschieht. */
export function taugtFund(f: BildFund): boolean {
  const c = f?.ctx;
  return !!c && !!(c.who || c.where || c.when || c.what);
}

/** Zusammenführen: Bekanntes bleibt stehen, Neues kommt hinten dazu, und wenn
 *  der Deckel reißt, fällt das Älteste vorne heraus. Rein — der Prüfstand
 *  kommt ohne Speicher aus. */
export function mischeBildvorrat(alt: BildFund[], neu: BildFund[], deckel = BILDVORRAT_DECKEL): BildFund[] {
  const bekannt = new Set(alt.filter(taugtFund).map(bildSchluessel));
  const raus = alt.slice();
  for (const f of neu) {
    if (!taugtFund(f)) continue;
    const k = bildSchluessel(f);
    if (bekannt.has(k)) continue;
    bekannt.add(k);
    raus.push(f);
  }
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}

export function ladeBildvorrat(): BildFund[] {
  try {
    const r = JSON.parse(localStorage.getItem(BILDVORRAT_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    return (r as BildFund[]).filter((f) => f && f.ctx && typeof f.ctx.what === "string");
  } catch { return []; }
}

export function sichereBildvorrat(v: BildFund[]): boolean {
  try { localStorage.setItem(BILDVORRAT_KEY, JSON.stringify(v)); return true; } catch { return false; }
}

export function leereBildvorrat(): void {
  try { localStorage.removeItem(BILDVORRAT_KEY); } catch { /* gesperrt */ }
}

/** Zieht einen zufälligen Fund. `rnd` ist einsetzbar, damit der Prüfstand die
 *  Ziehung ohne Zufall prüfen kann. */
export function ziehBildvorrat(vorrat: BildFund[] = ladeBildvorrat(), rnd: () => number = Math.random): BildFund | null {
  const gut = vorrat.filter(taugtFund);
  if (!gut.length) return null;
  const i = Math.min(gut.length - 1, Math.max(0, Math.floor(rnd() * gut.length)));
  return gut[i]!;
}

// ── Abschrift ───────────────────────────────────────────────────────────────
// Das genaue Gegenteil des Bildsammlers: Der liest ein Bild und formuliert
// frei; die Abschrift will exakt das, was dasteht.
//
// Deshalb gibt es hier KEINEN Beutefilter. Eine Abschrift zu filtern hieße,
// sie zu fälschen. Was durchkommt, kommt durch.

/** Prompt für eine Abschrift. Der ganze Wert steckt in dem, was verboten wird:
 *  Ein Modell ergänzt von sich aus abgeschnittene Wörter, korrigiert alte
 *  Rechtschreibung und glättet Zeilenfall — alles drei macht aus einer
 *  Abschrift eine Bearbeitung. */
export function baueAbschriftPrompt(hinweis = ""): string {
  const h = (hinweis || "").trim();
  return "Du fertigst eine ABSCHRIFT an. Gib den Text wieder, der auf dem Bild steht — "
    + "genau so, wie er dasteht.\n\n"
    + "Verboten:\n"
    + "- Etwas ergänzen, weiterschreiben oder erklären.\n"
    + "- Rechtschreibung modernisieren. Alte Formen („thun“, „giebt“, „daß“) bleiben stehen.\n"
    + "- Grammatik oder Zeichensetzung verbessern. Fehler in der Vorlage sind Teil der Vorlage.\n"
    + "- Zeilen zusammenziehen, die im Original getrennt stehen, wenn es Verse oder eine Liste sind.\n"
    + "- Kopfzeilen, Seitenzahlen, Marginalien oder Bildunterschriften stillschweigend weglassen.\n\n"
    + "Erlaubt und erwünscht:\n"
    + "- Silbentrennung am Zeilenende auflösen: „Werk-\\nzeug“ wird zu „Werkzeug“, in einer Zeile.\n"
    + "- Absätze als Absätze wiedergeben, Fließtext als Fließtext.\n"
    + "- Ist eine Stelle nicht lesbar, setze [unleserlich] statt zu raten.\n"
    + "- Steht mehreres nebeneinander (Spalten), schreibe Spalte für Spalte, "
    + "getrennt durch eine Leerzeile.\n\n"
    + (h ? `Zusätzliche Vorgabe des Nutzers (vorrangig): ${h}\n\n` : "")
    + "Gib NUR die Abschrift zurück. Keine Einleitung, kein Kommentar, keine Anführungszeichen "
    + "um das Ganze, kein Markdown. Steht auf dem Bild kein lesbarer Text, antworte mit "
    + "genau: KEIN TEXT";
}

/** Die Antwort auf eine Abschrift auswerten. */
export function leseAbschrift(roh: string): { text: string; leer: boolean } {
  let t = (roh || "").trim();
  if (!t || /^KEIN TEXT$/i.test(t)) return { text: "", leer: true };
  // Ein Modell legt trotz Anweisung gern einen Codeblock darum.
  t = t.replace(/^```[a-z]*\s*\n?/i, "").replace(/\n?```\s*$/, "").trim();
  // Und manchmal einen Vorspann. Nur eine EINZELNE erste Zeile, die sich
  // selbst als Ankündigung zu erkennen gibt — nicht raten, sonst fiele der
  // erste Satz einer Abschrift weg, die zufällig so beginnt.
  t = t.replace(/^(?:hier ist |dies ist )?die abschrift(?: des textes)?:?\s*\n+/i, "").trim();
  return { text: t, leer: !t };
}

/** Deckel für eine Abschrift. Eine dicht bedruckte Buchseite hat rund 400
 *  Wörter; Verse deutlich weniger. Großzügig, aber nicht offen: Ein
 *  abgeschnittener Text fällt auf, ein durchgelaufenes Budget nicht. */
export function maxTokenAbschrift(): number {
  return 4096;
}
