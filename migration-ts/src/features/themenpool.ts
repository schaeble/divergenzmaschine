// Themenpool: 4W-Vorschläge aus Wikidata — kostenlos, ohne Schlüssel, mit Beleg.
//
// Gefragt war ein Themenpool („berühmte Filme und ihre Protagonisten,
// Persönlichkeiten aus der Politik"), gefüllt über die KI. Der freie Weg ist
// besser, und zwar nicht nur billiger:
//
//   · Wikidata liefert STRUKTURIERTE Felder — Beruf, Geburtsort, Jahr, Werk.
//     Genau die vier W, ohne dass jemand sie aus einem Fließtext raten muss.
//     Das ist derselbe Grundsatz, nach dem schon der Tagesfeed zerlegt wird.
//   · Jeder Eintrag trägt eine Q-Nummer. Man kann nachsehen, ob es die Person
//     gibt. Ein Sprachmodell erfindet plausible Namen, die es nicht gibt — für
//     einen Pool, der echte Menschen enthalten soll, ist das der schlechteste
//     Tausch.
//   · Es kostet nichts und braucht keinen Schlüssel.
//
// Der Preis: Es gibt nur die Themen, für die hier eine Abfrage steht. SPARQL
// schreibt man nicht nebenbei.
import { safeSet } from "./storage-status";

export interface ThemaFund {
  /** Thema-Kennung, aus der der Fund stammt. */
  thema: string;
  themaLabel: string;
  /** Kopfzeile der Karte. */
  titel: string;
  /** Belegstelle: die Wikidata-Nummer, damit man nachsehen kann. */
  qid: string;
  ctx: { where: string; when: string; who: string; what: string };
  gespeichert: number;
}

export interface ThemaDef {
  id: string;
  label: string;
  /** Was die Abfrage holt — steht als Erklärung an der Auswahl. */
  hinweis: string;
  /** Die Abfrage. `?wer ?was ?wo ?wann` sind die vier gesuchten Felder,
   *  `?item` trägt die Q-Nummer. */
  sparql: string;
  /** Wie aus Person und Sache eine HANDLUNG wird — das „Was passiert?".
   *
   *  Je Thema ein eigenes Verb, weil ein allgemeines nicht trägt: „arbeitet an
   *  Die Dreigroschenoper" hat den Kasus verfehlt, und eine Filmfigur
   *  „arbeitet" nicht an ihrem Film. Werktitel stehen in Anführungszeichen —
   *  dann müssen sie nicht gebeugt werden. */
  wasSatz: (was: string) => string;
}

/** Der gemeinsame Rumpf: Beschriftungen auf Deutsch, mit Rückfall auf Englisch.
 *  Ohne den Rückfall fehlen bei kleineren Themen die halben Namen. */
const LABEL = 'SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }';

export const THEMEN: ThemaDef[] = [
  {
    id: "filmfiguren", label: "Filmfiguren",
    hinweis: "Figuren aus Spielfilmen mit dem Film, in dem sie vorkommen.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?item wdt:P31 wd:Q15773317 .
  OPTIONAL { ?item wdt:P1441 ?was . }
  OPTIONAL { ?item wdt:P106 ?beruf . }
  OPTIONAL { ?was wdt:P577 ?wannRoh . }
  OPTIONAL { ?was wdt:P495 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `taucht in „${was}“ auf`,
  },
  {
    id: "regie", label: "Regie und Film",
    hinweis: "Regisseurinnen und Regisseure mit einem ihrer Filme.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P31 wd:Q11424 ; wdt:P57 ?item ; wdt:P577 ?wannRoh .
  OPTIONAL { ?was wdt:P495 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `dreht „${was}“`,
  },
  {
    id: "politik", label: "Politik",
    hinweis: "Politikerinnen und Politiker mit Amt, Geburtsort und Jahr.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?item wdt:P106 wd:Q82955 ; wdt:P569 ?wannRoh ; wdt:P19 ?wo .
  OPTIONAL { ?item wdt:P39 ?was . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `ist ${was}`,
  },
  {
    id: "erfindung", label: "Erfindungen",
    hinweis: "Erfinderinnen und Erfinder mit dem, was sie ersonnen haben.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P61 ?item ; wdt:P571 ?wannRoh .
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `ersinnt ${was}`,
  },
  {
    id: "musik", label: "Komponistinnen und Komponisten",
    hinweis: "Werke der Musik mit ihren Urhebern und dem Jahr.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P86 ?item ; wdt:P571 ?wannRoh .
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `komponiert „${was}“`,
  },
  {
    id: "entdeckung", label: "Entdeckungen",
    hinweis: "Wer hat was entdeckt — und wann.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P61 ?item .
  OPTIONAL { ?was wdt:P575 ?wannRoh . }
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `entdeckt ${was}`,
  },
  {
    id: "literatur", label: "Literatur",
    hinweis: "Romane und Erzählungen mit Verfasserin oder Verfasser.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P31 wd:Q7725634 ; wdt:P50 ?item ; wdt:P577 ?wannRoh .
  OPTIONAL { ?item wdt:P19 ?wo . }
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `schreibt „${was}“`,
  },
  {
    id: "bauwerk", label: "Bauwerke",
    hinweis: "Bauwerke mit Architektin oder Architekt, Ort und Jahr.",
    sparql: `SELECT ?item ?werLabel ?wasLabel ?wannRoh ?woLabel WHERE {
  ?was wdt:P84 ?item ; wdt:P571 ?wannRoh ; wdt:P131 ?wo .
  BIND(?item AS ?wer)
  ${LABEL}
} LIMIT 120`,
    wasSatz: (was) => `entwirft ${was}`,
  },
];

export const THEMA_IDS = THEMEN.map((t) => t.id);
export function themaVon(id: string): ThemaDef | null {
  return THEMEN.find((t) => t.id === id) || null;
}

// ── Zerlegung ──────────────────────────────────────────────────────────────

/** Eine Zeile der Wikidata-Antwort, so weit sie hier gebraucht wird. */
interface SparqlZeile { [feld: string]: { value?: string } | undefined }

/** „1966-08-05T00:00:00Z" → „1966". Ohne Jahr kein Wann: Ein Datum, das die
 *  Maschine nicht lesen kann, ist als Zeitangabe schlechter als keine. */
export function jahrVon(roh: string): string {
  const m = (roh || "").match(/^(-?\d{1,4})-/);
  if (!m) return "";
  const j = parseInt(m[1]!, 10);
  if (!Number.isFinite(j) || j === 0) return "";
  return j < 0 ? `${Math.abs(j)} v. Chr.` : String(j);
}

/** Beschriftungen, die Wikidata zurückgibt, wenn es keine hat: die nackte
 *  Q-Nummer. Die gehört nicht in einen Text. */
const IST_QID = /^Q\d+$/;

/** Eine Antwortzeile in einen Fund. Gibt null zurück, wenn zu wenig übrig
 *  bleibt — ein Fund ohne Wer und ohne Was kann im Studio nichts bewirken. */
export function zerlegeZeile(z: SparqlZeile, thema: ThemaDef): ThemaFund | null {
  const feld = (n: string): string => {
    const v = (z[n]?.value || "").trim();
    return IST_QID.test(v) ? "" : v;
  };
  const wer = feld("werLabel");
  const was = feld("wasLabel");
  if (!wer && !was) return null;
  const wo = feld("woLabel");
  const wann = jahrVon(z["wannRoh"]?.value || "");
  const qid = ((z["item"]?.value || "").match(/Q\d+$/) || [""])[0];
  return {
    thema: thema.id, themaLabel: thema.label,
    titel: wer || was,
    qid,
    ctx: {
      // Der Ort bekommt seine Präposition erst im Studio (normWhere) — hier
      // steht der nackte Name, wie ihn Wikidata führt.
      where: wo,
      when: wann,
      who: wer,
      // Ohne Wer ist das Werk die Handlung; mit Wer ist es das, woran er hängt.
      // Mit Person wird aus der Sache eine Handlung, ohne Person bleibt sie die
      // Sache selbst — dann trägt sie den Satz als Nominalphrase.
      what: wer && was ? thema.wasSatz(was) : was,
    },
    gespeichert: Date.now(),
  };
}

export function zerlegeAntwort(roh: unknown, thema: ThemaDef): ThemaFund[] {
  const o = roh as { results?: { bindings?: SparqlZeile[] } } | null;
  const zeilen = o?.results?.bindings;
  if (!Array.isArray(zeilen)) return [];
  const raus: ThemaFund[] = [];
  const gesehen = new Set<string>();
  for (const z of zeilen) {
    const f = zerlegeZeile(z, thema);
    if (!f) continue;
    // Dieselbe Person mit demselben Werk kommt in Wikidata mehrfach vor, wenn
    // eine der optionalen Angaben mehrere Werte hat.
    const k = `${f.ctx.who}|${f.ctx.what}`.toLowerCase();
    if (gesehen.has(k)) continue;
    gesehen.add(k);
    raus.push(f);
  }
  return raus;
}

// ── Netz ───────────────────────────────────────────────────────────────────

export const WIKIDATA_URL = "https://query.wikidata.org/sparql";

/** Holt ein Thema. GET mit `format=json` — der Endpunkt erlaubt CORS für
 *  anonyme Abfragen, und ohne eigene Kopfzeilen entfällt die Vorabfrage. */
export async function holeThema(thema: ThemaDef,
  hole: typeof fetch = fetch): Promise<ThemaFund[]> {
  const url = `${WIKIDATA_URL}?format=json&query=${encodeURIComponent(thema.sparql)}`;
  const res = await hole(url, { mode: "cors", credentials: "omit" });
  if (!res.ok) throw new Error(`Wikidata antwortete mit ${res.status}`);
  return zerlegeAntwort(await res.json(), thema);
}

// ── Vorrat ─────────────────────────────────────────────────────────────────

export const THEMA_KEY = "divergenz_themenpool_v1";
/** Deckel wie beim Sammler-Vorrat: genug für langes Offline-Arbeiten, ohne den
 *  Speicher zu füllen und damit ANDERE Daten am Sichern zu hindern. */
export const THEMA_DECKEL = 400;

export function fundSchluessel(f: ThemaFund): string {
  return `${f.thema}|${f.ctx.who}|${f.ctx.what}`.toLowerCase();
}

/** Rein und prüfbar: Bekanntes bleibt, Neues kommt hinten dazu, und wenn der
 *  Deckel reißt, fällt das Älteste vorne heraus. */
export function mischeThemen(alt: ThemaFund[], neu: ThemaFund[], deckel = THEMA_DECKEL): ThemaFund[] {
  const bekannt = new Set(alt.map(fundSchluessel));
  const raus = alt.slice();
  for (const f of neu) {
    if (!f.ctx.what && !f.ctx.who) continue;
    const k = fundSchluessel(f);
    if (bekannt.has(k)) continue;
    bekannt.add(k);
    raus.push(f);
  }
  return deckel > 0 && raus.length > deckel ? raus.slice(raus.length - deckel) : raus;
}

export function ladeThemen(): ThemaFund[] {
  try {
    const r = JSON.parse(localStorage.getItem(THEMA_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    return (r as ThemaFund[]).filter((f) => f && f.ctx && typeof f.ctx.what === "string");
  } catch { return []; }
}

export function sichereThemen(v: ThemaFund[]): boolean {
  return safeSet(THEMA_KEY, JSON.stringify(v), "Themenpool");
}

export function leereThemen(): void {
  try { localStorage.removeItem(THEMA_KEY); } catch { /* gesperrt */ }
}

/** Zieht einen Fund. Mit `thema` nur aus diesem Thema. */
export function ziehThema(thema = "", vorrat: ThemaFund[] = ladeThemen(),
  rnd: () => number = Math.random): ThemaFund | null {
  const topf = thema ? vorrat.filter((f) => f.thema === thema) : vorrat;
  if (!topf.length) return null;
  return topf[Math.min(topf.length - 1, Math.floor(rnd() * topf.length))]!;
}

/** Was liegt im Pool? Für die Anzeige und für die Frage, ob gewürfelt werden darf. */
export function themenStand(vorrat: ThemaFund[] = ladeThemen()): { funde: number; themen: number } {
  return { funde: vorrat.length, themen: new Set(vorrat.map((f) => f.thema)).size };
}
