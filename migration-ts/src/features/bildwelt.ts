// Bildwelt: Aus vielen Bildern werden Wortbänke, aus Wortbänken wird Material.
//
// Der Unterschied zum bisherigen Bildsammler ist nicht die Technik, sondern der
// Schnitt. Bisher gab ein Bild Sätze — fertige Fügungen, die im Korpus
// vermischt werden. Hier gibt es WÖRTER, geordnet nach Blickwinkel, und die
// setzt die Maschine an ihren eigenen Stellen ein.
//
// Drei Entscheidungen, die den ganzen Bau tragen:
//
// 1. MODUS, NICHT STIL. Dasselbe Foto wird durch verschiedene Wortfelder
//    gelesen — bureau, body, myth. Keine Lesung ist literarischer als die
//    andere, alle sind gleich flach. Die Reibung entsteht erst, wenn die
//    Maschine später Wörter aus zwei Feldern in einen Satz zieht. Vorverdichtet
//    wird nichts: Material, das schon schön ist, nimmt der Maschine die Arbeit ab.
//
// 2. AUFSUMMIEREN, NICHT JE BILD. Ein Foto gibt fünfzehn Substantive her — als
//    eigenes Preset wäre das blutleer und wiederholte sich nach drei Sätzen.
//    Erst über zweihundert Bilder wird eine Bank, die trägt.
//
// 3. ETIKETT STATT SCHUBLADE. Ein freies Textfeld je Stapel, keine Felder für
//    Ort und Jahr. Was beim Sammeln getrennt wird, bekommt man nicht mehr
//    zusammen — und der produktivste Griff ist nicht „nur Kreta", sondern die
//    Kollision von Kreta 2011 mit Küche 2024.

import { MODE_DATA } from "../modes.data";

export interface Modus { id: string; label: string }

/** Die Modi, in denen ein Bild gelesen werden kann — dieselben, die auch die
 *  Texterzeugung kennt. Keine eigene Liste: Zwei Listen, die dasselbe meinen,
 *  laufen auseinander. */
export function modi(): Modus[] {
  return Object.keys(MODE_DATA).map((id) => ({ id, label: MODE_DATA[id]?.label || id }));
}
export function istModus(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(MODE_DATA, id);
}

/** Vorgabe: bureau + body. Nicht willkürlich — das ist die Kollision, die im
 *  ersten brauchbaren Text dieser Maschine getragen hat (Amtsdeutsch gegen
 *  Körper). Zwei und nicht sechs, weil jeder weitere Modus die Ausgabe und
 *  damit den Preis erhöht, das Bild aber nur einmal bezahlt wird. */
export const MODI_VORGABE = ["bureau", "body"];

export interface Bildernte {
  /** SHA-256 der Datei. Kennung über Umbenennen und Verschieben hinweg. */
  abdruck: string;
  /** Dateiname, nur zur Anzeige — als Kennung taugt er nicht. */
  name: string;
  modus: string;
  /** Frei gewählt, mehrere durch Komma. „Gedanken1“ ist so gültig wie
   *  „Kreta 2011“ — die Maschine deutet nichts davon. */
  etiketten: string[];
  nomen: string[];
  verben: string[];
  /** Kurze Fügungen, keine Sätze: „Rost an der Kante“, nicht „Der Rost sitzt
   *  an der Kante der Bank“. Sätze wären schon Verdichtung. */
  bilder: string[];
  gelesen: number;
}

export const BILDWELT_KEY = "divergenz_bildwelt_v1";
/** Deckel. Bei tausend Bildern in drei Modi wären es dreitausend Ernten; der
 *  localStorage ist geteilt, und ein voller Speicher hindert IRGENDWANN
 *  irgendetwas anderes am Sichern — das fällt dann weit weg von hier auf. */
export const BILDWELT_DECKEL = 2500;

// ── Doppelte Bilder ─────────────────────────────────────────────────────────

/** Der Schlüssel ist Abdruck UND Modus, nicht der Abdruck allein.
 *
 *  Das ist die Stelle, an der man sich leicht vertut: Eine Sperre nur über den
 *  Abdruck verhinderte genau die Mehrfachlesung, die den Reiz ausmacht —
 *  dasselbe Bild in einem anderen Blickwinkel ist kein doppeltes Bild. */
export function leseSchluessel(abdruck: string, modus: string): string {
  return `${(abdruck || "").toLowerCase()}#${modus || ""}`;
}

/** Was von diesem Stapel in diesen Modi noch nicht gelesen wurde. Läuft VOR
 *  dem Senden — ein doppeltes Bild kostet sonst Geld und verzerrt obendrein
 *  die Bank, weil doppeltes Material doppelt gewichtet wird. */
export function offeneLesungen(
  abdruecke: string[], gewaehlteModi: string[], vorhanden: Bildernte[],
): { abdruck: string; modus: string }[] {
  const bekannt = new Set(vorhanden.map((e) => leseSchluessel(e.abdruck, e.modus)));
  const raus: { abdruck: string; modus: string }[] = [];
  const gesehen = new Set<string>();
  for (const a of abdruecke) {
    for (const m of gewaehlteModi) {
      const k = leseSchluessel(a, m);
      if (bekannt.has(k) || gesehen.has(k)) continue;
      gesehen.add(k);
      raus.push({ abdruck: a, modus: m });
    }
  }
  return raus;
}

// ── Etiketten ───────────────────────────────────────────────────────────────

/** Ein Etikett ist eine Zeichenkette und sonst nichts — kein Feld, das die
 *  Maschine deutet. Mehrere durch Komma, damit niemand zwischen Ordnung
 *  („Kreta 2011“) und Laune („Gedanken1“) wählen muss. */
export function leseEtiketten(roh: string): string[] {
  return (roh || "").split(/[,;]/).map((s) => s.trim().replace(/\s+/g, " "))
    .filter((s) => s.length > 0 && s.length <= 60)
    .filter((s, i, a) => a.findIndex((x) => x.toLowerCase() === s.toLowerCase()) === i)
    .slice(0, 8);
}

/** Alle vergebenen Etiketten mit Anzahl, häufigste zuerst. */
export function etikettenStand(ernten: Bildernte[]): { name: string; n: number }[] {
  const zaehler = new Map<string, { name: string; n: number }>();
  for (const e of ernten) {
    for (const t of e.etiketten || []) {
      const k = t.toLowerCase();
      const v = zaehler.get(k);
      if (v) v.n++; else zaehler.set(k, { name: t, n: 1 });
    }
  }
  return [...zaehler.values()].sort((a, b) => b.n - a.n || a.name.localeCompare(b.name, "de"));
}

// ── Bank ────────────────────────────────────────────────────────────────────

export interface Bank { nomen: string[]; verben: string[]; bilder: string[] }

/** Fasst Ernten zu einer Bank zusammen. Doppeltes fällt weg — nicht aus
 *  Ordnungsliebe: Ein Wort, das zwanzigmal im Vorrat steht, wird von der Kette
 *  zwanzigmal so oft gezogen, und dann läuft jeder Text durch dieselbe Stelle. */
export function baueBank(ernten: Bildernte[]): Bank {
  const eindeutig = (listen: string[][]): string[] => {
    const gesehen = new Set<string>(); const raus: string[] = [];
    for (const l of listen) for (const w of l || []) {
      const t = String(w || "").trim().replace(/\s+/g, " ");
      if (!t) continue;
      const k = t.toLowerCase();
      if (gesehen.has(k)) continue;
      gesehen.add(k); raus.push(t);
    }
    return raus;
  };
  return {
    nomen: eindeutig(ernten.map((e) => e.nomen)),
    verben: eindeutig(ernten.map((e) => e.verben)),
    bilder: eindeutig(ernten.map((e) => e.bilder)),
  };
}

/** Auswahl nach Modus und Etikett. Leere Filter heißen „alles“ — nicht
 *  „nichts“, sonst stünde man beim ersten Öffnen vor einer leeren Ansicht und
 *  hielte die Ablage für kaputt. */
export function filtere(
  ernten: Bildernte[], f: { modi?: string[]; etiketten?: string[] } = {},
): Bildernte[] {
  const m = f.modi && f.modi.length ? new Set(f.modi) : null;
  const t = f.etiketten && f.etiketten.length
    ? new Set(f.etiketten.map((x) => x.toLowerCase())) : null;
  return ernten.filter((e) => {
    if (m && !m.has(e.modus)) return false;
    if (t && !(e.etiketten || []).some((x) => t.has(x.toLowerCase()))) return false;
    return true;
  });
}

// ── Ablage ──────────────────────────────────────────────────────────────────

export function ladeBildwelt(): Bildernte[] {
  try {
    const r = JSON.parse(localStorage.getItem(BILDWELT_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    return (r as Bildernte[]).filter((e) => e && typeof e.abdruck === "string" && typeof e.modus === "string")
      .map((e) => ({
        abdruck: e.abdruck, name: String(e.name || ""), modus: e.modus,
        etiketten: Array.isArray(e.etiketten) ? e.etiketten.filter((x) => typeof x === "string") : [],
        nomen: Array.isArray(e.nomen) ? e.nomen.filter((x) => typeof x === "string") : [],
        verben: Array.isArray(e.verben) ? e.verben.filter((x) => typeof x === "string") : [],
        bilder: Array.isArray(e.bilder) ? e.bilder.filter((x) => typeof x === "string") : [],
        gelesen: Number(e.gelesen) || 0,
      }));
  } catch { return []; }
}

export function sichereBildwelt(v: Bildernte[]): boolean {
  try { localStorage.setItem(BILDWELT_KEY, JSON.stringify(v)); return true; } catch { return false; }
}

/** Zusammenführen. Eine Lesung, die es schon gibt, ERSETZT die alte — ein
 *  zweiter Lauf über dasselbe Bild im selben Modus ist eine Korrektur, keine
 *  Verdopplung. Reißt der Deckel, fällt das Älteste vorne heraus. */
export function mischeBildwelt(alt: Bildernte[], neu: Bildernte[], deckel = BILDWELT_DECKEL): Bildernte[] {
  const nachIndex = new Map(alt.map((e, i) => [leseSchluessel(e.abdruck, e.modus), i]));
  const raus = alt.slice();
  for (const e of neu) {
    if (!e || !e.abdruck || !istModus(e.modus)) continue;
    if (!e.nomen.length && !e.verben.length && !e.bilder.length) continue;
    const k = leseSchluessel(e.abdruck, e.modus);
    const i = nachIndex.get(k);
    if (i === undefined) { nachIndex.set(k, raus.length); raus.push(e); }
    else raus[i] = e;
  }
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}

// ── Prompt ──────────────────────────────────────────────────────────────────

const BLICK: Record<string, string> = {
  bureau: "Bestand, Zuständigkeit, Ordnung, Frist, Nummer, Zustand von Sachen",
  tech: "Material, Mechanik, Verschleiß, Signal, Energie, Gemachtes",
  body: "Haltung, Gewicht, Hände, Haut, Wärme, Nähe, Anstrengung",
  myth: "Schwelle, Zeichen, Wiederkehr, Gabe, Weg, was älter ist als die Szene",
  absurd: "Ordnungen, die nicht zueinander passen; Maße, Zählungen, verkehrte Zwecke",
  post: "Was bleibt, wenn niemand hinsieht: Oberflächen, Reste, Dauer, Verfall",
};

/** Ein Aufruf, mehrere Modi. Das Bild kostet rund 1440 Eingabe-Token, und die
 *  zahlt man bei getrennten Aufrufen mehrfach — hier einmal. Drei Blickwinkel
 *  kosten damit etwa den anderthalbfachen Preis eines einzigen. */
export function baueBankPrompt(gewaehlteModi: string[], hinweis = ""): string {
  const ms = gewaehlteModi.filter(istModus);
  const h = (hinweis || "").trim();
  const bloecke = ms.map((m) =>
    `- "${m}" (${MODE_DATA[m]?.label || m}): Achte auf ${BLICK[m] || "das, was diesen Blickwinkel ausmacht"}.`
  ).join("\n");
  return "Du lieferst Wortmaterial für einen deutschsprachigen Textgenerator. "
    + "Du bekommst EIN Bild und liest es aus mehreren Blickwinkeln.\n\n"
    + "HÄRTESTE REGEL: Kein Wort und keine Fügung darf verraten, dass es ein Bild gibt. "
    + "Verboten sind „Bild“, „Foto“, „Aufnahme“, „Vordergrund“, „Hintergrund“, „Betrachter“, "
    + "„zu sehen“, „abgebildet“, „Kamera“ und alles Vergleichbare.\n\n"
    + "ZWEITE REGEL: Liefere WÖRTER, keine Sätze und keine Deutung. Nüchtern und benennend, "
    + "nicht literarisch. Kein Wort, das eine Stimmung behauptet („melancholisch“, „einsam“, "
    + "„nostalgisch“). Die Fremdheit stellt die Maschine selbst her; Material, das schon schön "
    + "ist, nimmt ihr die Arbeit ab.\n\n"
    + "Die Blickwinkel:\n" + bloecke + "\n\n"
    + "Für jeden Blickwinkel:\n"
    + "- nomen: 8 bis 14 Substantive im Nominativ Singular, mit großem Anfangsbuchstaben, "
    + "ohne Artikel. Nur Dinge, die wirklich da sind oder unmittelbar dazugehören.\n"
    + "- verben: 6 bis 10 Verben im Infinitiv.\n"
    + "- bilder: 3 bis 6 KURZE Fügungen aus zwei bis vier Wörtern, z. B. „Rost an der Kante“. "
    + "Keine ganzen Sätze, kein Verb als Aussage — eine Fügung ist ein Baustein, ein Satz wäre "
    + "schon fertig.\n\n"
    + "Dasselbe Wort darf in mehreren Blickwinkeln stehen, wenn es dort wirklich hingehört; "
    + "erzwinge das aber nicht. Ist ein Blickwinkel an diesem Bild nicht zu finden, gib lieber "
    + "wenige Wörter als erfundene.\n"
    + (h ? `\nZusätzliche Vorgabe des Nutzers (vorrangig): ${h}\n` : "")
    + '\nAntworte mit reinem JSON, beginnend mit { und endend mit }: '
    + `{${ms.map((m) => `"${m}": {"nomen": ["…"], "verben": ["…"], "bilder": ["…"]}`).join(", ")}}. `
    + "Keine Erklärung, kein Markdown.";
}

// ── Antwort auswerten ───────────────────────────────────────────────────────

/** Verrät das Wort seine Herkunft aus einem Bild? Dieselbe Aufgabe wie beim
 *  Satz-Sammler, aber auf Wortebene — und deshalb strenger zu fassen: Ein
 *  einzelnes „Aufnahme“ im Vorrat taucht später mitten in einem Text auf, ohne
 *  dass man die Quelle noch erkennt. */
export function verraetBildWort(w: string): boolean {
  return /\b(?:bild|bildes|bilder|bildern|foto|fotos|photo|aufnahme|aufnahmen|abbildung|kamera|objektiv|betrachter|vordergrund|hintergrund|bildrand|motiv|szene|perspektive|blickwinkel|ausschnitt|schnappschuss|selfie)\b/i.test(w || "");
}

const saeubere = (roh: unknown, max: number, wortMax: number): string[] => {
  if (!Array.isArray(roh)) return [];
  const gesehen = new Set<string>(); const raus: string[] = [];
  for (const x of roh) {
    if (typeof x !== "string") continue;
    const t = x.trim().replace(/\s+/g, " ").replace(/^[-–—•*\d.)\s]+/, "");
    if (!t || t.length > 60) continue;
    if ((t.match(/\S+/g) || []).length > wortMax) continue;
    if (verraetBildWort(t)) continue;
    const k = t.toLowerCase();
    if (gesehen.has(k)) continue;
    gesehen.add(k); raus.push(t);
    if (raus.length >= max) break;
  }
  return raus;
};

/** Wertet die Antwort aus. Nimmt alles entgegen, auch Unsinn — eine Antwort,
 *  die nicht der Form entspricht, darf keinen Absturz erzeugen. */
export function leseBaenke(roh: unknown, gewaehlteModi: string[]): Record<string, Bank> {
  const raus: Record<string, Bank> = {};
  if (!roh || typeof roh !== "object") return raus;
  const o = roh as Record<string, unknown>;
  for (const m of gewaehlteModi) {
    if (!istModus(m)) continue;
    const b = o[m];
    if (!b || typeof b !== "object") continue;
    const bb = b as Record<string, unknown>;
    const bank: Bank = {
      nomen: saeubere(bb.nomen, 20, 3),
      verben: saeubere(bb.verben, 16, 3),
      // Eine Fügung darf länger sein, aber ein ganzer Satz ist keine Fügung
      // mehr, sondern fertige Ware.
      bilder: saeubere(bb.bilder, 10, 5),
    };
    if (bank.nomen.length || bank.verben.length || bank.bilder.length) raus[m] = bank;
  }
  return raus;
}

/** Deckel für die Antwort. Je Modus rund 40 Wörter; die Ausgabe kostet das
 *  Fünffache der Eingabe, und ein Modell füllt aus, was man ihm lässt. */
export function maxTokenBaenke(anzahlModi: number): number {
  const n = Math.max(1, Math.min(6, anzahlModi));
  return Math.min(4096, n * 420 + 300);
}
