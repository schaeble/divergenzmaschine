// Nutzungszähler.
//
// Der Grund steht in vielen Sitzungen davor: Von allem Gebauten — Bildwelt,
// Abschrift, Autopilot, KI-Lehrer, Füller — weiß niemand, ob es benutzt wird.
// Ich habe als Ratgeber dabei eine strukturelle Schwäche: Ich sehe nur
// Anfragen, nie den Friedhof. Ein Baumeister, der ausschließlich
// Grundsteinlegungen kennt und keine Abrisse, hat kein Urteil über
// Tragfähigkeit — egal wie ehrlich er sein will.
//
// Dieser Zähler ist der Ausweg: eine Liste, gegen die weder ich noch der
// Nutzer argumentieren können. Er zählt nur, er urteilt nicht.
//
// Was er NICHT tut: nach außen melden. Alles bleibt im Browser, wie alles
// andere hier auch.

export const NUTZUNG_KEY = "divergenz_nutzung_v1";

export interface Eintrag {
  /** Wie oft geöffnet oder ausgelöst. */
  n: number;
  /** Zeitpunkt der letzten Benutzung (ms). */
  zuletzt: number;
  /** Zeitpunkt der ersten Benutzung (ms) — für „seit wann wird gezählt". */
  zuerst: number;
}
export type Stand = Record<string, Eintrag>;

/** Einen Gebrauch verbuchen. Rein, damit der Prüfstand ohne Speicher rechnet. */
export function merke(stand: Stand, id: string, jetzt = Date.now()): Stand {
  const k = (id || "").trim();
  if (!k) return stand;
  const alt = stand[k];
  return {
    ...stand,
    [k]: alt
      ? { n: alt.n + 1, zuletzt: jetzt, zuerst: alt.zuerst || jetzt }
      : { n: 1, zuletzt: jetzt, zuerst: jetzt },
  };
}

export interface Zeile {
  id: string;
  n: number;
  /** Tage seit der letzten Benutzung; -1, wenn nie. */
  tage: number;
  nie: boolean;
}

/** Die Liste für die Anzeige.
 *
 *  `alle` ist die vollständige Liste dessen, was es GIBT — nicht nur dessen,
 *  was benutzt wurde. Das ist der ganze Sinn: Ein Baustein, der nie erscheint,
 *  weil er nie geöffnet wurde, wäre unsichtbar, und genau der ist die Antwort
 *  auf die Frage.
 *
 *  Sortiert: Ungenutztes zuerst. Wer die Liste öffnet, sucht nicht den
 *  Spitzenreiter, sondern den Ballast. */
export function alsListe(stand: Stand, alle: string[], jetzt = Date.now()): Zeile[] {
  const tag = 86400000;
  const zeilen: Zeile[] = alle.map((id) => {
    const e = stand[id];
    return e && e.n > 0
      ? { id, n: e.n, tage: Math.floor((jetzt - e.zuletzt) / tag), nie: false }
      : { id, n: 0, tage: -1, nie: true };
  });
  return zeilen.sort((a, b) => {
    if (a.nie !== b.nie) return a.nie ? -1 : 1;
    if (a.n !== b.n) return a.n - b.n;
    return a.id.localeCompare(b.id, "de");
  });
}

/** Seit wann gezählt wird — der früheste Eintrag. 0, wenn noch nichts. */
export function seitWann(stand: Stand): number {
  const z = Object.values(stand).map((e) => e.zuerst).filter((x) => x > 0);
  return z.length ? Math.min(...z) : 0;
}

export function ladeNutzung(): Stand {
  try {
    const r = JSON.parse(localStorage.getItem(NUTZUNG_KEY) || "{}") as unknown;
    if (!r || typeof r !== "object" || Array.isArray(r)) return {};
    const raus: Stand = {};
    for (const [k, v] of Object.entries(r as Record<string, unknown>)) {
      const e = v as Partial<Eintrag>;
      const n = Number(e?.n);
      if (!Number.isFinite(n) || n <= 0) continue;
      raus[k] = { n, zuletzt: Number(e?.zuletzt) || 0, zuerst: Number(e?.zuerst) || 0 };
    }
    return raus;
  } catch { return {}; }
}

export function sichereNutzung(s: Stand): void {
  try { localStorage.setItem(NUTZUNG_KEY, JSON.stringify(s)); } catch { /* voll */ }
}

/** Verbuchen und sichern in einem. Der Aufruf soll an der Stelle, wo etwas
 *  benutzt wird, EINE Zeile sein — sonst wird er beim nächsten Baustein
 *  vergessen. */
export function zaehle(id: string): void {
  sichereNutzung(merke(ladeNutzung(), id));
}
