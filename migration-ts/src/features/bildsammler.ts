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
