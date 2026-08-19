// Reihenfolge und Sichtbarkeit der Reiter.
//
// Dreizehn Reiter sind für ein Handy zu viele, und niemand benutzt alle. Wer
// nur Studio, Korpus und Zeitungsseite braucht, soll die drei nebeneinander
// haben und den Rest wegräumen können.
//
// Alles Rechnende steht hier und nicht in der Oberfläche, weil zwei Fälle
// sonst erst auffallen, wenn es zu spät ist:
//
// 1. EIN NEUER REITER MUSS ERSCHEINEN. Die gespeicherte Reihenfolge ist eine
//    Liste von Namen. Käme eine spätere Fassung mit einem neuen Reiter, und
//    würde nur die gespeicherte Liste angezeigt, wäre er unsichtbar — und
//    niemand wüsste, dass es ihn gibt.
// 2. MAN DARF SICH NICHT AUSSPERREN. Die Einstellung dafür liegt IM Studio.
//    Wer das Studio ausblendet, kommt nie wieder an sie heran.

export const REITER_KEY = "divergenz_reiter_v1";

/** Die tatsächliche Reiterliste, von der Anwendung beim Start eingetragen.
 *
 *  Warum ein Eintrag und keine feste Liste hier: Die Namen stehen zusammen mit
 *  ihren Ansichten in `ui/app.ts`. Sie hier ein zweites Mal aufzuschreiben
 *  hiesse, zwei Listen zu führen, die dasselbe meinen — und die laufen
 *  auseinander. Die Einstellung im Studio holt sie über `derKanon()`; ein
 *  direkter Zugriff auf `app.ts` wäre ein Ringschluss der Einbindungen. */
let kanonListe: string[] = [];
export function setzeKanon(namen: string[]): void { kanonListe = namen.slice(); }
export function derKanon(): string[] { return kanonListe.slice(); }

export interface ReiterStand {
  /** Namen in gewünschter Reihenfolge. Unbekannte werden beim Anzeigen
   *  aussortiert, aber nicht gelöscht — wer eine ältere Fassung öffnet und
   *  zurückwechselt, soll seine Ordnung wiederfinden. */
  ordnung: string[];
  versteckt: string[];
}

export const STAND_LEER: ReiterStand = { ordnung: [], versteckt: [] };

/** Reiter, die sich nicht ausblenden lassen. Das Studio, weil die Einstellung
 *  dort liegt — sonst sperrt man sich aus und kommt nur über das Löschen des
 *  Browser-Speichers zurück. */
export const PFLICHT = ["Studio"];

/** Führt die gespeicherte Reihenfolge mit der tatsächlichen Liste zusammen.
 *
 *  Bekanntes behält seinen Platz, Verschwundenes fällt weg, Neues wird an
 *  seiner angestammten Stelle eingefügt — nicht hinten angehängt. Ein neuer
 *  Reiter soll dort auftauchen, wo er thematisch hingehört; ganz am Ende
 *  übersieht man ihn. */
export function ordne(kanon: string[], gespeichert: string[]): string[] {
  const bekannt = new Set(kanon);
  const raus: string[] = [];
  const drin = new Set<string>();
  for (const n of gespeichert) {
    if (!bekannt.has(n) || drin.has(n)) continue;
    drin.add(n); raus.push(n);
  }
  for (let i = 0; i < kanon.length; i++) {
    const n = kanon[i]!;
    if (drin.has(n)) continue;
    // Den nächsten Vorgänger suchen, der schon steht, und dahinter einfügen.
    let stelle = 0;
    for (let j = i - 1; j >= 0; j--) {
      const v = kanon[j]!;
      const k = raus.indexOf(v);
      if (k >= 0) { stelle = k + 1; break; }
    }
    raus.splice(stelle, 0, n);
    drin.add(n);
  }
  return raus;
}

/** Welche Reiter erscheinen — in der richtigen Reihenfolge.
 *
 *  Pflichtreiter bleiben immer sichtbar. Und wäre am Ende gar nichts übrig,
 *  wird die Ausblendung ignoriert: Eine leere Leiste sähe aus wie ein Absturz
 *  und wäre ohne Löschen des Browser-Speichers nicht zu beheben. */
export function sichtbar(kanon: string[], stand: ReiterStand, pflicht: string[] = PFLICHT): string[] {
  const ordnung = ordne(kanon, stand.ordnung || []);
  const weg = new Set((stand.versteckt || []).filter((n) => !pflicht.includes(n)));
  const raus = ordnung.filter((n) => !weg.has(n));
  if (raus.length) return raus;
  const rettung = ordnung.filter((n) => pflicht.includes(n));
  return rettung.length ? rettung : ordnung.slice(0, 1);
}

/** Einen Reiter um eine Stelle verschieben. Am Rand geschieht nichts — nicht
 *  umlaufen: Ein Reiter, der beim Klick auf „hoch“ ans Ende springt, wirkt wie
 *  ein Fehler. */
export function verschiebe(ordnung: string[], name: string, delta: number): string[] {
  const i = ordnung.indexOf(name);
  if (i < 0) return ordnung.slice();
  const j = i + (delta < 0 ? -1 : 1);
  if (j < 0 || j >= ordnung.length) return ordnung.slice();
  const raus = ordnung.slice();
  raus[i] = raus[j]!; raus[j] = name;
  return raus;
}

/** Aus- und einblenden. Ein Pflichtreiter lässt sich nicht ausblenden — die
 *  Sperre steht HIER und nicht nur in der Oberfläche, damit sie auch dann
 *  greift, wenn der Stand aus einer Projektdatei kommt. */
export function schalte(stand: ReiterStand, name: string, an: boolean, pflicht: string[] = PFLICHT): ReiterStand {
  const versteckt = new Set(stand.versteckt || []);
  if (an || pflicht.includes(name)) versteckt.delete(name);
  else versteckt.add(name);
  return { ordnung: (stand.ordnung || []).slice(), versteckt: [...versteckt] };
}

export function ladeStand(): ReiterStand {
  try {
    const r = JSON.parse(localStorage.getItem(REITER_KEY) || "null") as Partial<ReiterStand> | null;
    if (!r) return { ...STAND_LEER };
    return {
      ordnung: Array.isArray(r.ordnung) ? r.ordnung.filter((x): x is string => typeof x === "string") : [],
      versteckt: Array.isArray(r.versteckt) ? r.versteckt.filter((x): x is string => typeof x === "string") : [],
    };
  } catch { return { ...STAND_LEER }; }
}

export function sichereStand(s: ReiterStand): boolean {
  try { localStorage.setItem(REITER_KEY, JSON.stringify(s)); return true; } catch { return false; }
}
