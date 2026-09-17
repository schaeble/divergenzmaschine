// Der Faden (4.362.0) — Fortsetzungen: Geschichten wie Perlen aufgefädelt.
//
// Jede Geschichte für sich ist vollständig; eine Reihe braucht zwei Löcher je
// Perle — eines, durch das der Faden hereinkommt, eines, durch das er
// hinausgeht. Der Faden selbst ist dünn: DREI Dinge wandern von Folge zu
// Folge — die Figur (der Wer bleibt), ein Ding (eine Requisite, die in der
// nächsten Folge wieder auftaucht, verwandelt) und eine offene Frage (das,
// was am Ende nicht beantwortet wurde, wird zum Was der nächsten Folge).
// Dazu der letzte Satz der vorigen Folge als „Bisher"-Zeile und die Nummer.
// Ort, Zeit, Ton und Preset wechseln — sonst liest man dieselbe Geschichte
// zweimal.
//
// Der Bogen über den Folgen: Fünf Folgen sind fünf Schläge einer Serien-
// Bauform (Einstieg · Konflikt · Wende · Höhepunkt · Schluss). Jede Folge
// weiß, welcher Schlag sie ist, und bekommt danach ihre Bauform: die
// Einstiegs-Folge steigend, die Konflikt-Folge mit später Wende, die Wende-
// Folge doppelt, die Höhepunkt-Folge als Katastrophe zuerst, die Schluss-
// Folge als Kreisschluss — das Ding aus Folge 1 kehrt zurück.
import { splitSentences } from "../text-utils";
import { guessGender } from "../generation/declension";

export interface Faden {
  aktiv: boolean;
  serie: string;        // Name der Serie (Titel der ersten Folge)
  figur: string;        // der Wer
  ding: string;         // die Requisite, die wandert (Nominativ mit Artikel)
  frage: string;        // die offene Frage → Was der nächsten Folge
  letzterSatz: string;  // „Bisher"
  folge: number;        // Nummer der NÄCHSTEN Folge
  laenge: number;       // Folgen je Serie (Vorgabe 5)
  bauform: string;      // Serien-Bauform (Schlüssel aus SCHLAGFOLGEN)
  laengeBasis?: number; // Ziellänge der ersten Folge — Maß für die Serien-Dramaturgie
  kurveVorher?: { an: boolean; werte: number[] };  // die Kurve vor der Serie, für "Serie beenden"
  kernbild?: string;    // ein Bild aus Folge 1, das im Höhepunkt und im Schluss wiederkehrt (Serien-Echo)
}

const KEY = "dm_faden_v1";
export const SERIEN_LAENGE = 5;

export function ladeFaden(): Faden | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || "null") as Partial<Faden> | null;
    if (!v || !v.aktiv) return null;
    return { aktiv: true, serie: String(v.serie || ""), figur: String(v.figur || ""), ding: String(v.ding || ""), frage: String(v.frage || ""),
      letzterSatz: String(v.letzterSatz || ""), folge: Math.max(2, Number(v.folge) || 2), laenge: Math.max(2, Number(v.laenge) || SERIEN_LAENGE), bauform: String(v.bauform || "standard"),
      laengeBasis: Number(v.laengeBasis) || undefined, kurveVorher: v.kurveVorher && Array.isArray(v.kurveVorher.werte) ? { an: !!v.kurveVorher.an, werte: v.kurveVorher.werte.map(Number) } : undefined,
      kernbild: typeof v.kernbild === "string" ? v.kernbild : undefined };
  } catch { return null; }
}
export function speichereFaden(f: Faden | null): void {
  try { if (f) localStorage.setItem(KEY, JSON.stringify(f)); else localStorage.removeItem(KEY); } catch { /* voll */ }
}

/** Die Schläge einer Serie, gleichmäßig auf die Folgen gelegt. */
export const SERIEN_SCHLAEGE = ["einstieg", "konflikt", "wende", "hoehepunkt", "schluss"] as const;
export type SerienSchlag = typeof SERIEN_SCHLAEGE[number];
export function schlagDerFolge(folge: number, laenge = SERIEN_LAENGE): SerienSchlag {
  const n = Math.max(2, laenge);
  const i = Math.round(((Math.max(1, Math.min(n, folge)) - 1) / (n - 1)) * (SERIEN_SCHLAEGE.length - 1));
  return SERIEN_SCHLAEGE[i]!;
}
/** Welche Bauform eine Folge nach ihrem Schlag bekommt. */
export const BAUFORM_JE_SCHLAG: Record<SerienSchlag, string> = { einstieg: "standard", konflikt: "retardation", wende: "doppelt", hoehepunkt: "katastrophe", schluss: "kreis" };
export const SCHLAG_NAME: Record<SerienSchlag, string> = { einstieg: "Einstieg", konflikt: "Konflikt", wende: "Wende", hoehepunkt: "Höhepunkt", schluss: "Schluss" };

// ── Aus einem Text den Faden ziehen ─────────────────────────────────────────
const FUNKTION = new Set(["der", "die", "das", "ein", "eine", "einen", "einem", "einer", "dem", "den", "des", "und", "oder", "aber", "nicht", "kein", "keine", "sich", "ihm", "ihr", "ihn"]);

/** Das Ding: eine Nominalphrase mit Artikel aus dem Text — bevorzugt eine, die
 *  mehrfach vorkommt (sie trägt schon), sonst die erste konkrete (Genus
 *  bekannt); im Nominativ. Leer, wenn keine da ist. */
export function dingAus(text: string, ausser = ""): string {
  const kandidaten = new Map<string, { np: string; n: number; unbestimmt: boolean }>();
  const re = /\b([Ee]in|[Ee]ine|[Ee]inen|[Ee]inem|[Ee]iner|[Dd]er|[Dd]ie|[Dd]as|[Dd]en|[Dd]em)\s+(?:([a-zäöüß]{3,}(?:e|en|er|es|em))\s+)?([A-ZÄÖÜ][a-zäöüß]{3,})\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const art = m[1]!.toLowerCase(), adj = m[2] || "", nomen = m[3]!;
    const ausserNomen = (ausser.match(/[A-ZÄÖÜ][a-zäöüß]+$/) || [ausser])[0]!.toLowerCase();
    if (FUNKTION.has(nomen.toLowerCase()) || nomen.toLowerCase() === ausserNomen) continue;
    const g = guessGender(nomen);
    if (!g) continue;
    const nomArt = (art.startsWith("ein")) ? (g === "f" ? "eine" : "ein") : (g === "m" ? "der" : g === "f" ? "die" : "das");
    let nomAdj = adj;
    if (adj) { const st = adj.replace(/(e|en|er|es|em)$/, ""); nomAdj = st + (nomArt.startsWith("ein") ? (g === "m" ? "er" : g === "f" ? "e" : "es") : "e"); }
    const np = `${nomArt} ${nomAdj ? nomAdj + " " : ""}${nomen}`;
    const k = nomen.toLowerCase();
    const e = kandidaten.get(k);
    if (e) { e.n++; if (art.startsWith("ein")) e.unbestimmt = true; } else kandidaten.set(k, { np, n: 1, unbestimmt: art.startsWith("ein") });
  }
  // Häufigkeit zuerst; bei Gleichstand das Ding, das mit unbestimmtem Artikel
  // eingeführt wurde („ein Schlüssel") — das ist die Requisite, nicht der Ort.
  const liste = [...kandidaten.values()].sort((a, b) => (b.n - a.n) || (Number(b.unbestimmt) - Number(a.unbestimmt)));
  return liste[0]?.np || "";
}

/** Die offene Frage: der letzte Fragesatz des Textes — sonst aus dem Einsatz
 *  („Es geht um X" → „Was wird aus X?") — sonst aus dem Ding. */
export function frageAus(text: string, ding: string): string {
  const s = splitSentences(text.replace(/\n+/g, " "));
  const fragen = s.filter((x) => /\?$/.test(x.trim()));
  if (fragen.length) return fragen[fragen.length - 1]!.trim();
  const einsatz = [...s].reverse().find((x) => /^(Es geht um|Der Einsatz ist|Auf dem Spiel steht|Alles dreht sich um|Was zählt, ist)\b/i.test(x));
  if (einsatz) {
    const kern = einsatz.replace(/^(Es geht um|Der Einsatz ist|Auf dem Spiel steht|Alles dreht sich um|Was zählt, ist)\s*/i, "").replace(/[.!…]+$/, "").replace(/^(eines|eins):\s*/i, "");
    if (kern) return `Was wird aus ${kern}?`;
  }
  if (ding) return `Wer hat ${ding.replace(/^(der|ein)\s/, "den ").replace(/^die\s/, "die ").replace(/^das\s/, "das ").replace(/^eine\s/, "eine ")} zurückgelassen?`;
  return "Was bleibt?";
}

/** Den Faden aus einer Folge ziehen — oder einen bestehenden weiterspinnen. */
export function fadenAus(text: string, figur: string, titel: string, bisher: Faden | null): Faden {
  const s = splitSentences(text.replace(/\n+/g, " "));
  const letzter = (s[s.length - 1] || "").trim();
  const ding = bisher?.ding || dingAus(text, figur);
  return {
    aktiv: true,
    serie: bisher?.serie || titel || (s[0] || "Serie").slice(0, 40),
    figur: bisher?.figur || figur,
    ding,
    frage: frageAus(text, ding),
    letzterSatz: letzter,
    folge: (bisher?.folge || 1) + 1,
    laenge: bisher?.laenge || SERIEN_LAENGE,
    bauform: bisher?.bauform || "standard",
    laengeBasis: bisher?.laengeBasis,
    kurveVorher: bisher?.kurveVorher,
    kernbild: bisher?.kernbild || kernbildAus(text, figur),
  };
}

/** Ein Satz, der das Ding in die neue Folge legt, wenn der Text es nicht von
 *  selbst trägt — verwandelt, nicht erklärt. */
export function dingSatz(ding: string, rnd: () => number = Math.random): string {
  const d = ding.charAt(0).toUpperCase() + ding.slice(1);
  const formen = [
    `${d} liegt hier, als wäre es nie fort gewesen.`,
    `${d} ist mitgekommen, ohne dass jemand es getragen hätte.`,
    `Auf dem Tisch: ${ding}, kälter als gestern.`,
    `${d} — noch immer, an einem Ort, der es nicht kennt.`,
  ];
  return formen[Math.floor(rnd() * formen.length)]!;
}

// ── Fadenstärke (4.363.0): Trägt der dünne Faden? ────────────────────────────
// Vier prüfbare Größen je Glied (Folge n → n+1), dazu die Gegengröße Neuheit.
// Die Kettenauslese belohnt Zusammenhang nur bis zu einer Schwelle — vier
// von vier ist verdächtig (eine Serie, die sich selbst zitiert), zwei von
// vier ist gut; Neuheit wiegt gleich viel.
export interface Fadenstaerke {
  ding: "natuerlich" | "hingelegt" | "fehlt";   // das Ding im Text
  figur: boolean;                                // der Wer handelt im Text
  frage: boolean;                                // ein Kernwort der Frage steht in einem Satz
  echo: boolean;                                 // ein Kernwort des letzten Satzes von n im ersten Drittel von n+1
  neuheit: number;                               // Anteil der Sätze, die nicht in der vorigen Folge stehen (0…1)
  punkte: number;                                // 0…4
  wert: number;                                  // Auslese-Wert mit Schwelle und Neuheit
}
const st5 = (t: string): Set<string> => new Set((t.toLowerCase().match(/[a-zäöüß]{5,}/g) || []).map((x) => x.slice(0, 5)));
const kern = (t: string): Set<string> => new Set((t.match(/[A-ZÄÖÜ][a-zäöüß]{4,}/g) || []).map((x) => x.toLowerCase().slice(0, 5)));
const FRAGEWORT = new Set(["was", "wer", "wird", "hat", "bleibt", "kommt", "geht", "aus", "den", "die", "der", "das", "dem", "ein", "eine", "einen", "und", "oder", "nicht", "niemand", "noch", "zurück", "gelassen", "zurückgelassen"]);

export function fadenstaerke(vorher: string, nachher: string, f: Pick<Faden, "figur" | "ding" | "frage" | "letzterSatz">, dingHingelegt = false): Fadenstaerke {
  const nach = nachher.replace(/\n+/g, " ");
  const nachLow = nach.toLowerCase();
  // Ding
  const dingStamm = (f.ding.match(/[A-ZÄÖÜ][a-zäöüß]{3,}/) || [""])[0]!.toLowerCase().slice(0, 5);
  const dingDa = !!dingStamm && nachLow.includes(dingStamm);
  const ding: Fadenstaerke["ding"] = !dingDa ? "fehlt" : dingHingelegt ? "hingelegt" : "natuerlich";
  // Figur: das letzte Wort des Wer (der Name oder das Nomen) im Text, oder ein Pronomen-Satz genügt nicht — es zählt das Wort.
  const figurWort = (f.figur.match(/[A-ZÄÖÜ][a-zäöüß]{2,}$/) || [f.figur.split(/\s+/).pop() || ""])[0]!.toLowerCase();
  const figur = !!figurWort && figurWort.length >= 3 && nachLow.includes(figurWort);
  // Frage: ein Inhaltswort der Frage (≥ 5 Buchstaben, kein Fragewort) in einem Satz des Textes.
  const frageWoerter = (f.frage.toLowerCase().match(/[a-zäöüß]{5,}/g) || []).filter((w) => !FRAGEWORT.has(w)).map((w) => w.slice(0, 5));
  const frage = frageWoerter.some((w) => nachLow.includes(w));
  // Echo über die Naht: Kernwort des letzten Satzes von n im ersten Drittel von n+1.
  const saetze = splitSentences(nach);
  const erstesDrittel = saetze.slice(0, Math.max(1, Math.ceil(saetze.length / 3))).join(" ");
  const echo = [...kern(f.letzterSatz)].some((k) => erstesDrittel.toLowerCase().includes(k));
  // Neuheit
  const vorherSaetze = new Set(splitSentences(vorher.replace(/\n+/g, " ")).map((x) => x.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim()));
  const neu = saetze.filter((x) => !vorherSaetze.has(x.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim()));
  const neuheit = saetze.length ? neu.length / saetze.length : 1;
  const punkte = (ding !== "fehlt" ? 1 : 0) + (figur ? 1 : 0) + (frage ? 1 : 0) + (echo ? 1 : 0);
  // Auslese-Wert: bis zwei Punkte voll belohnt, der dritte halb, der vierte gar
  // nicht — ein natürliches Ding zählt mehr als ein hingelegtes; Neuheit
  // wiegt wie zwei Punkte.
  const zusammenhang = Math.min(2, punkte) + (punkte >= 3 ? 0.5 : 0) + (ding === "natuerlich" ? 0.5 : 0);
  const wert = zusammenhang + 2 * neuheit;
  void st5;
  return { ding, figur, frage, echo, neuheit, punkte, wert };
}

/** Kurzfassung für die Anzeige: „●●○○ — Ding hingelegt, Frage aufgenommen, kein Echo über die Naht". */
export function fadenBeschreibung(s: Fadenstaerke): string {
  const kugeln = "●".repeat(s.punkte) + "○".repeat(4 - s.punkte);
  const teile = [
    s.ding === "natuerlich" ? "Ding im Text" : s.ding === "hingelegt" ? "Ding hingelegt" : "Ding fehlt",
    s.figur ? "Figur handelt" : "Figur fehlt",
    s.frage ? "Frage aufgenommen" : "Frage nicht aufgenommen",
    s.echo ? "Echo über die Naht" : "kein Echo über die Naht",
  ];
  return `Faden: ${kugeln} — ${teile.join(", ")} · Neuheit ${Math.round(s.neuheit * 100)} %`;
}

// ── Serien-Dramaturgie (4.366.0): Intensität über die Folgen ─────────────────
// Je Schlag der Serie eine Einstellung, die die Fortsetzung setzt — die
// Spannungskurve (Vorlage), die Ziellänge als Anteil der Länge von Folge 1
// und die Stellschraube Satzlänge. Die Höhepunkt-Folge ist kürzer und hat
// kürzere Sätze, die Schluss-Folge wieder länger und ruhiger. Abschaltbar
// (Schalter neben "Fortsetzung"), dann bleibt alles, wie es steht.
export interface SerienEinstellung { kurve: string; laengeFaktor: number; satzlaenge: number }
export const SERIEN_DRAMATURGIE: Record<SerienSchlag, SerienEinstellung> = {
  einstieg:   { kurve: "steigend",    laengeFaktor: 1.0,  satzlaenge: 12 },
  konflikt:   { kurve: "spaet",       laengeFaktor: 1.0,  satzlaenge: 9 },
  wende:      { kurve: "doppelt",     laengeFaktor: 0.95, satzlaenge: 9 },
  hoehepunkt: { kurve: "katastrophe", laengeFaktor: 0.8,  satzlaenge: 6 },
  schluss:    { kurve: "flach",       laengeFaktor: 1.1,  satzlaenge: 15 },
};
const SD_KEY = "dm_serien_dramaturgie_v1";
export function serienDramaturgieAn(): boolean {
  try { const v = localStorage.getItem(SD_KEY); return v === null ? true : v === "1"; } catch { return true; }
}
export function setzeSerienDramaturgie(an: boolean): void { try { localStorage.setItem(SD_KEY, an ? "1" : "0"); } catch { /* voll */ } }
export function serienBeschreibung(schlag: SerienSchlag, basisLaenge: number, kurvenName: string): string {
  const e = SERIEN_DRAMATURGIE[schlag];
  return `Serien-Dramaturgie: ${SCHLAG_NAME[schlag]} — Kurve ${kurvenName} · Länge ${Math.round(basisLaenge * e.laengeFaktor)} Wörter (${Math.round(e.laengeFaktor * 100)} %) · Satzlänge ${e.satzlaenge}`;
}

// ── Das Ding als Steigerungsreihe (4.367.0, Maßnahme 2) ─────────────────────
// Der Schlüssel liegt nicht in jeder Folge gleich da: Folge für Folge
// verwandelt er sich — dieselbe Requisite, die Verlust erzählt. Die Stufe
// folgt dem Schlag der Serie; die Endung des Adjektivs dem Genus des Nomens.
const STEIGERUNG: Record<SerienSchlag, { adj?: string; nachsatz?: string }> = {
  einstieg:   {},
  konflikt:   { nachsatz: "{akk} niemand nimmt" },         // Relativpronomen als Objekt
  wende:      { adj: "verbogen" },
  hoehepunkt: { adj: "verbogen", nachsatz: "{nom} zu nichts mehr passt" },   // als Subjekt
  schluss:    { nachsatz: "im Fluss, zurück am Anfang" },
};
export function dingStufe(ding: string, schlag: SerienSchlag): string {
  const m = ding.match(/^(ein|eine|einen|der|die|das)\s+(?:([a-zäöüß]+)\s+)?([A-ZÄÖÜ][a-zäöüß]+)$/i);
  if (!m) return ding;
  const art = m[1]!.toLowerCase(), nomen = m[3]!;
  const g = guessGender(nomen) || (art === "die" || art === "eine" ? "f" : art === "das" ? "n" : "m");
  const st = STEIGERUNG[schlag];
  const indef = art.startsWith("ein");
  const adjEnd = indef ? (g === "m" ? "er" : g === "f" ? "e" : "es") : "e";
  const akk = g === "m" ? "den" : g === "f" ? "die" : "das";
  const nom = g === "m" ? "der" : g === "f" ? "die" : "das";
  const adj = st.adj ? st.adj + adjEnd + " " : (m[2] ? m[2] + " " : "");
  const kopf = `${art} ${adj}${nomen}`;
  if (!st.nachsatz) return kopf;
  return `${kopf}, ${st.nachsatz.replace("{akk}", akk).replace("{nom}", nom)}`.replace(/, im Fluss/, " im Fluss");
}

// ── Das Serien-Echo (4.367.0, Maßnahme 3) ───────────────────────────────────
// Ein Bild aus Folge 1 kehrt im Höhepunkt wieder — gesteigert, wenn das
// Preset ein zweites Bild desselben Kerns hat, sonst wörtlich — und im
// Schluss noch einmal als Kreisschluss vor dem letzten Satz.
const KERN = /[A-ZÄÖÜ][a-zäöüß]{4,}/g;
export function kernbildAus(text: string, figur: string): string {
  const s = splitSentences(text.replace(/\n+/g, " "));
  const fw = (figur.match(/[A-ZÄÖÜ][a-zäöüß]{2,}$/) || [figur])[0]!.toLowerCase();
  for (const satz of s.slice(0, Math.max(2, Math.ceil(s.length / 2)))) {
    const kerne = (satz.match(KERN) || []).filter((k) => k.toLowerCase() !== fw && !/^(Dann|Danach|Später|Vielleicht|Nichts|Alles|Niemand|Jemand|Etwas)$/.test(k));
    const w = satz.split(/\s+/).length;
    if (kerne.length && w >= 4 && w <= 16 && !/^(Es geht um|Der Einsatz|Was zählt|Auf dem Spiel)/.test(satz)) return satz.trim();
  }
  return "";
}
export function serienEcho(text: string, kernbild: string, schlag: SerienSchlag, vorrat: string[]): { text: string; echo: string } {
  if (!kernbild || (schlag !== "hoehepunkt" && schlag !== "schluss")) return { text, echo: "" };
  const s = splitSentences(text.replace(/\n+/g, " "));
  if (s.length < 4) return { text, echo: "" };
  const norm = (x: string): string => x.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim();
  if (s.some((x) => norm(x) === norm(kernbild))) return { text, echo: "" };
  const kerne = new Set((kernbild.match(KERN) || []).map((k) => k.toLowerCase().slice(0, 5)));
  let echo = "";
  if (schlag === "hoehepunkt") {
    // Gesteigert: ein zweites Bild desselben Kerns aus dem Vorrat, das
    // stärkere (Steigerungswort oder länger) — sonst das Bild selbst.
    const kand = vorrat.filter((v) => { const vk = (v.match(KERN) || []).map((k) => k.toLowerCase().slice(0, 5)); return vk.some((k) => kerne.has(k)) && norm(v) !== norm(kernbild) && !s.some((x) => norm(x) === norm(v)); });
    kand.sort((a, b) => (Number(/\b(niemand|nicht|kein|mehr|noch|zu spät)\b/i.test(b)) - Number(/\b(niemand|nicht|kein|mehr|noch|zu spät)\b/i.test(a))) || (b.length - a.length));
    echo = kand[0] ? kand[0].trim().replace(/^[a-z]/, (c) => c.toUpperCase()) : kernbild;
    if (!/[.!?…]$/.test(echo)) echo += ".";
    const at = Math.min(s.length - 2, Math.max(2, Math.floor(s.length * 0.7)));
    s.splice(at, 0, echo);
  } else {
    echo = kernbild;
    s.splice(s.length - 1, 0, echo);          // vor dem letzten Satz: der Kreis schließt sich
  }
  return { text: s.join(" "), echo };
}
