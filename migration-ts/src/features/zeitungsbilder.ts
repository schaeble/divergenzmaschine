// Bildrahmen für den Zeitungssetzer: ein Bild vom Gerät, frei auf der Seite
// verschiebbar und an der Ecke aufziehbar.
//
// Die Rechnerei steht hier und nicht in der Ansicht, damit sie ohne Browser
// prüfbar ist: Begrenzen auf die Seite, Aufziehen unter Wahrung des
// Seitenverhältnisses, Verkleinern beim Einlesen und der Rückgängig-Stapel.
//
// Warum verkleinert wird: Ein Foto aus der Kamera bringt mehrere Megabyte mit.
// Als Base64 im localStorage abgelegt füllt EIN Bild den Speicher und hindert
// danach Wortbank, Korpus und Schatzkammer am Sichern. 1200 px an der längsten
// Kante reichen für A4-Druck (rund 350 dpi bei halber Seitenbreite) und halten die
// Druckfassung klein genug, dass die Druckvorschau sie noch laden mag.
import { safeSet } from "./storage-status";

export interface Bildrahmen {
  id: string;
  /** Bilddaten als Data-URL (JPEG oder PNG, bereits verkleinert). */
  daten: string;
  /** Auf welcher Seite das Bild liegt (0 = erste). */
  seite: number;
  x: number; y: number; b: number; h: number;
  /** Ursprüngliches Seitenverhältnis (Breite/Höhe). Getrennt gehalten, damit es
   *  über viele Skalierschritte nicht wegdriftet. */
  verh: number;
}

export const BILD_KEY = "divergenz_zeitung_bilder_v1";
/** Längste Kante nach dem Verkleinern. */
export const BILD_MAX = 1200;
/** Kleinste Kante eines Rahmens auf der Seite, damit er greifbar bleibt. */
export const MIN_KANTE = 40;
/** Mehr als das passt nicht sinnvoll in eine Projektdatei. */
export const BILD_ANZAHL = 8;

/** Zielmaße beim Verkleinern. Vergrößert nie — ein kleines Bild bleibt klein. */
export function zielMasse(b: number, h: number, max = BILD_MAX): { b: number; h: number } {
  const gross = Math.max(b, h);
  if (!isFinite(gross) || gross <= 0) return { b: 0, h: 0 };
  if (gross <= max) return { b: Math.round(b), h: Math.round(h) };
  const f = max / gross;
  return { b: Math.max(1, Math.round(b * f)), h: Math.max(1, Math.round(h * f)) };
}

/** Hält den Rahmen innerhalb der Seite. Zuerst die Größe, dann die Lage:
 *  Ein Rahmen, der breiter ist als die Seite, ließe sich sonst nie so
 *  verschieben, dass er hineinpasst. */
export function begrenze(r: Bildrahmen, seiteB: number, seiteH: number): Bildrahmen {
  const b = Math.max(MIN_KANTE, Math.min(r.b, seiteB));
  const h = Math.max(MIN_KANTE, Math.min(r.h, seiteH));
  const x = Math.max(0, Math.min(r.x, seiteB - b));
  const y = Math.max(0, Math.min(r.y, seiteH - h));
  return { ...r, x, y, b, h };
}

/** Verschieben. Die Lage wird begrenzt, die Größe bleibt. */
export function verschiebe(r: Bildrahmen, dx: number, dy: number, seiteB: number, seiteH: number): Bildrahmen {
  return begrenze({ ...r, x: r.x + dx, y: r.y + dy }, seiteB, seiteH);
}

/** Nur die Lage begrenzen, die Größe bleibt. Getrennt von `begrenze`, weil
 *  eine nachträgliche Größenkorrektur das Seitenverhältnis bricht: Sie ändert
 *  eine Kante, ohne die andere mitzuziehen. */
export function begrenzeLage(r: Bildrahmen, seiteB: number, seiteH: number): Bildrahmen {
  return {
    ...r,
    x: Math.max(0, Math.min(r.x, seiteB - r.b)),
    y: Math.max(0, Math.min(r.y, seiteH - r.h)),
  };
}

/** Aufziehen an der rechten unteren Ecke. Das Seitenverhältnis bleibt: Jede
 *  Korrektur zieht die andere Kante mit. Gewachsen wird bis an den Rand des
 *  freien Platzes; reicht der nicht für die Mindestkante, rutscht der Rahmen
 *  statt sich zu verzerren. */
export function skaliereEcke(r: Bildrahmen, dx: number, seiteB: number, seiteH: number): Bildrahmen {
  const verh = r.verh > 0 ? r.verh : (r.h > 0 ? r.b / r.h : 1);
  const platzB = seiteB - r.x, platzH = seiteH - r.y;
  let b = Math.max(MIN_KANTE, r.b + dx);
  // Nach rechts ist am freien Platz Schluss — ES SEI DENN, dort ist weniger
  // Platz als die Mindestkante. Dann begrenzt nur noch die Seite, und der
  // Rahmen rutscht nach links, statt unter die Mindestkante zu fallen.
  if (platzB >= MIN_KANTE) b = Math.min(b, platzB);
  let h = b / verh;
  if (h < MIN_KANTE) { h = MIN_KANTE; b = h * verh; }
  if (platzH >= MIN_KANTE && h > platzH) { h = platzH; b = h * verh; }
  // Dieselbe Klemme in der Gegenrichtung: Die Höhenkorrektur kann die Breite
  // unter die Mindestkante drücken (hohes Bild am unteren Rand).
  if (b < MIN_KANTE) { b = MIN_KANTE; h = b / verh; }
  // Zum Schluss die Seite selbst: Ein Rahmen darf nie größer sein als das Blatt.
  if (b > seiteB) { b = seiteB; h = b / verh; }
  if (h > seiteH) { h = seiteH; b = h * verh; }
  return begrenzeLage({ ...r, b: Math.round(b), h: Math.round(h), verh }, seiteB, seiteH);
}

/** Ein frisch eingefügter Rahmen: mittig auf der Seite, höchstens halb so
 *  breit wie die Seite — groß genug, um ihn zu sehen, klein genug, um den Satz
 *  nicht zu verdecken. */
export function neuerRahmen(daten: string, bildB: number, bildH: number,
                            seiteB: number, seiteH: number, seite = 0,
                            id = "b" + Date.now().toString(36)): Bildrahmen {
  const verh = bildH > 0 ? bildB / bildH : 1;
  let b = Math.min(bildB, Math.round(seiteB / 2));
  let h = b / verh;
  if (h > seiteH / 2) { h = Math.round(seiteH / 2); b = h * verh; }
  const r: Bildrahmen = {
    id, daten, seite, verh,
    b: Math.round(b), h: Math.round(h),
    x: Math.round((seiteB - b) / 2), y: Math.round((seiteH - h) / 2),
  };
  return begrenze(r, seiteB, seiteH);
}

// ── Speicher ────────────────────────────────────────────────────────────────
// Der Schlüssel beginnt mit „divergenz_“ und wandert damit über sammleRest()
// in die Projektdatei — wie der Sammler-Vorrat.

export function ladeBilder(): Bildrahmen[] {
  try {
    const r = JSON.parse(localStorage.getItem(BILD_KEY) || "[]") as unknown;
    if (!Array.isArray(r)) return [];
    return (r as Bildrahmen[]).filter((x) => x && typeof x.daten === "string" && x.daten.length > 16);
  } catch { return []; }
}
export function sichereBilder(bilder: Bildrahmen[]): boolean {
  return safeSet(BILD_KEY, JSON.stringify(bilder.slice(0, BILD_ANZAHL)), "Zeitungsbilder");
}

// ── Rückgängig ──────────────────────────────────────────────────────────────
// Ein Stapel von Momentaufnahmen als JSON. Zwei gleiche Aufnahmen hintereinander
// sind sinnlos — ein Zurück, das nichts ändert, sieht aus wie ein kaputter
// Knopf. Deshalb wird die Dublette gar nicht erst gelegt.

export const STAPEL_TIEFE = 40;

export function stapelLege(stapel: string[], stand: unknown, tiefe = STAPEL_TIEFE): string[] {
  const s = JSON.stringify(stand);
  if (stapel.length && stapel[stapel.length - 1] === s) return stapel;
  const raus = [...stapel, s];
  return raus.length > tiefe ? raus.slice(raus.length - tiefe) : raus;
}

export function stapelNimm(stapel: string[]): { stapel: string[]; stand: string | null } {
  if (!stapel.length) return { stapel, stand: null };
  const raus = stapel.slice();
  const stand = raus.pop() || null;
  return { stapel: raus, stand };
}

// ── Einlesen vom Gerät ──────────────────────────────────────────────────────

/** Liest eine Bilddatei, verkleinert sie auf `BILD_MAX` und gibt eine
 *  Data-URL zurück. Braucht den Browser (Image + Canvas) und wird deshalb im
 *  Prüfstand nicht aufgerufen. JPEG, außer das Bild hat Durchsichtigkeit —
 *  PNG bleibt PNG, sonst wird aus einem freigestellten Bild ein schwarzer
 *  Klotz. */
export function leseBilddatei(datei: File): Promise<{ daten: string; b: number; h: number }> {
  return new Promise((fertig, fehler) => {
    if (!/^image\//.test(datei.type)) { fehler(new Error("Das ist keine Bilddatei.")); return; }
    const leser = new FileReader();
    leser.onerror = () => fehler(new Error("Die Datei ließ sich nicht lesen."));
    leser.onload = () => {
      const bild = new Image();
      bild.onerror = () => fehler(new Error("Das Bildformat versteht der Browser nicht."));
      bild.onload = () => {
        const ziel = zielMasse(bild.naturalWidth, bild.naturalHeight);
        if (ziel.b === bild.naturalWidth && ziel.h === bild.naturalHeight && datei.size < 400_000) {
          // Klein genug: unverändert übernehmen, kein Qualitätsverlust.
          fertig({ daten: String(leser.result), b: ziel.b, h: ziel.h });
          return;
        }
        const c = document.createElement("canvas");
        c.width = ziel.b; c.height = ziel.h;
        const ctx = c.getContext("2d");
        if (!ctx) { fertig({ daten: String(leser.result), b: bild.naturalWidth, h: bild.naturalHeight }); return; }
        ctx.drawImage(bild, 0, 0, ziel.b, ziel.h);
        const png = /png$/i.test(datei.type);
        fertig({ daten: c.toDataURL(png ? "image/png" : "image/jpeg", 0.78), b: ziel.b, h: ziel.h });
      };
      bild.src = String(leser.result);
    };
    leser.readAsDataURL(datei);
  });
}
