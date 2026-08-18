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

/** Muss das Bild neu kodiert werden?
 *
 *  Für den Zeitungssetzer lautet die Antwort „nur wenn nötig“: Ein Bild, das
 *  ohnehin klein genug ist, unverändert zu übernehmen spart einen
 *  Qualitätsverlust.
 *
 *  Für alles, was das Gerät VERLÄSST, lautet sie „immer“. Das Neukodieren über
 *  Canvas wirft die EXIF-Daten weg — GPS-Koordinaten, Aufnahmezeit,
 *  Kameraseriennummer. Die Abkürzung für kleine Dateien war deshalb eine
 *  stille Ausnahme: Ein Bildschirmfoto oder ein kleiner Scan ging mitsamt
 *  seinen Metadaten hinaus, und niemand hätte das vermutet. */
export function brauchtNeukodierung(
  b: number, h: number, groesse: number, immer: boolean, max = BILD_MAX,
): boolean {
  if (immer) return true;
  const ziel = zielMasse(b, h, max);
  return !(ziel.b === b && ziel.h === h && groesse < 400_000);
}

/** Liest eine Bilddatei, verkleinert sie auf `BILD_MAX` und gibt eine
 *  Data-URL zurück. Braucht den Browser (Image + Canvas) und wird deshalb im
 *  Prüfstand nicht aufgerufen. JPEG, außer das Bild hat Durchsichtigkeit —
 *  PNG bleibt PNG, sonst wird aus einem freigestellten Bild ein schwarzer
 *  Klotz.
 *
 *  `immerNeuKodieren` für jeden Weg, der das Gerät verlässt: siehe
 *  `brauchtNeukodierung`. */
export function leseBilddatei(datei: File, immerNeuKodieren = false): Promise<{ daten: string; b: number; h: number }> {
  return new Promise((fertig, fehler) => {
    if (!/^image\//.test(datei.type)) { fehler(new Error("Das ist keine Bilddatei.")); return; }
    const leser = new FileReader();
    leser.onerror = () => fehler(new Error("Die Datei ließ sich nicht lesen."));
    leser.onload = () => {
      const bild = new Image();
      bild.onerror = () => fehler(new Error("Das Bildformat versteht der Browser nicht."));
      bild.onload = () => {
        const ziel = zielMasse(bild.naturalWidth, bild.naturalHeight);
        if (!brauchtNeukodierung(bild.naturalWidth, bild.naturalHeight, datei.size, immerNeuKodieren)) {
          // Klein genug: unverändert übernehmen, kein Qualitätsverlust.
          fertig({ daten: String(leser.result), b: ziel.b, h: ziel.h });
          return;
        }
        const c = document.createElement("canvas");
        c.width = ziel.b; c.height = ziel.h;
        const ctx = c.getContext("2d");
        if (!ctx) {
          // Ohne Canvas gibt es kein Neukodieren. Für den Setzer ist das
          // Original ein tragbarer Notbehelf; für einen Weg nach draußen wäre
          // es ein stiller Rückfall auf „mit EXIF senden“. Dann lieber
          // scheitern — ein Fehler ist sichtbar, ein Leck nicht.
          if (immerNeuKodieren) { fehler(new Error("Der Browser kann das Bild nicht neu kodieren — ohne das würde es mit allen Metadaten verschickt.")); return; }
          fertig({ daten: String(leser.result), b: bild.naturalWidth, h: bild.naturalHeight });
          return;
        }
        ctx.drawImage(bild, 0, 0, ziel.b, ziel.h);
        const png = /png$/i.test(datei.type);
        fertig({ daten: c.toDataURL(png ? "image/png" : "image/jpeg", 0.78), b: ziel.b, h: ziel.h });
      };
      bild.src = String(leser.result);
    };
    leser.readAsDataURL(datei);
  });
}

// ── Spaltenraster ───────────────────────────────────────────────────────────
// Eine Zeitungsseite hat ihr Raster schon: N Spalten mit einem Steg dazwischen.
// Ein Bild, dessen Kanten auf Spaltenkanten liegen, sieht auf Anhieb nach
// Zeitung aus; eines mit 3 px Versatz sieht nach Versehen aus.
//
// Eingerastet wird die BREITE (auf ganze Spalten) und die LAGE (linke Kante auf
// einen Spaltenanfang, Oberkante auf ein Zeilenraster). Die Höhe folgt dem
// Seitenverhältnis und wird NICHT gerastert — sonst wäre das Bild verzerrt,
// und Verzerren ist der eine Fehler, den man einem Bild sofort ansieht.

export interface Raster {
  /** Spaltenzahl der Seite. */
  spalten: number;
  seiteB: number;
  seiteH: number;
  /** Steg zwischen zwei Spalten in px. */
  steg: number;
  /** Senkrechtes Raster in px (Vorgabe: 5 mm). */
  zeile: number;
}

/** Breite einer einzelnen Spalte. */
export function spaltenBreite(r: Raster): number {
  const n = Math.max(1, r.spalten);
  return (r.seiteB - (n - 1) * r.steg) / n;
}
/** Breite über `k` Spalten — die Stege dazwischen gehören dazu. */
export function spaltenSpanne(r: Raster, k: number): number {
  const sp = spaltenBreite(r);
  const n = Math.max(1, Math.min(Math.max(1, r.spalten), k));
  return n * sp + (n - 1) * r.steg;
}
/** Über wie viele Spalten geht diese Breite? Für die Anzeige. */
export function spaltenZahl(breite: number, r: Raster): number {
  const schritt = spaltenBreite(r) + r.steg;
  return Math.max(1, Math.min(r.spalten, Math.round((breite + r.steg) / schritt)));
}

/** Rastet einen Rahmen ein. Reine Rechnung, kein DOM. */
export function rasteRahmen(rahmen: Bildrahmen, r: Raster): Bildrahmen {
  const verh = rahmen.verh > 0 ? rahmen.verh : (rahmen.h > 0 ? rahmen.b / rahmen.h : 1);
  const sp = spaltenBreite(r);
  const schritt = sp + r.steg;

  // Breite auf ganze Spalten. Ist das Bild damit höher als die Seite, eine
  // Spalte weniger nehmen — lieber schmaler als abgeschnitten.
  let k = spaltenZahl(rahmen.b, r);
  let b = spaltenSpanne(r, k);
  let h = b / verh;
  while (h > r.seiteH && k > 1) { k--; b = spaltenSpanne(r, k); h = b / verh; }
  // Selbst eine Spalte kann zu hoch sein (sehr hochformatige Bilder). Dann
  // führt die Höhe, und die Breite verlässt das Raster — das Seitenverhältnis
  // wiegt schwerer als die Rasterkante.
  if (h > r.seiteH) { h = r.seiteH; b = h * verh; }

  // Linke Kante auf einen Spaltenanfang, aber nur so weit, dass der Rahmen
  // noch ganz auf die Seite passt.
  const maxIndex = Math.max(0, Math.floor((r.seiteB - b + 0.5) / schritt));
  const i = Math.max(0, Math.min(maxIndex, Math.round(rahmen.x / schritt)));
  const x = Math.min(i * schritt, Math.max(0, r.seiteB - b));

  // Oberkante auf das Zeilenraster.
  const zeile = r.zeile > 0 ? r.zeile : 1;
  const y = Math.max(0, Math.min(Math.round(rahmen.y / zeile) * zeile, r.seiteH - h));

  return { ...rahmen, verh, x: Math.round(x), y: Math.round(y), b: Math.round(b), h: Math.round(h) };
}

// ── Platz für das Bild im Spaltensatz ───────────────────────────────────────
// Bisher lag das Bild ÜBER dem Satz und verdeckte ihn. Damit der Text am Bild
// abbricht und darunter weiterläuft, bekommt jede berührte Spalte einen
// unsichtbaren Platzhalter: ein Gleitkasten (float) über die volle
// Spaltenbreite, der genau das Band des Bildes besetzt. Zeilen oberhalb und
// unterhalb bleiben stehen, Zeilen im Band rutschen darunter — das ist das
// Verhalten, das eine Zeitung von Hand auch hätte.
//
// Warum ein Gleitkasten und kein Abstand: Ein Absatz kann quer durch das Band
// laufen. Ein eingeschobener Block träfe immer die Absatzgrenze, nie die
// Zeilengrenze — der Text spränge zu früh oder zu spät.

/** Lage eines Spaltenkastens auf der Seite, in Seitenkoordinaten. */
export interface Spaltenlage { x: number; b: number; oben: number; hoehe: number }

/** Welches Band muss diese Spalte für das Bild freihalten?
 *  Rückgabe in KASTENkoordinaten (oben = Abstand von der Spaltenoberkante),
 *  oder null, wenn die Spalte das Bild nicht berührt.
 *  `luft` ist der Abstand, den Bild und Text zueinander halten. */
export function bildplatz(
  bild: { x: number; y: number; b: number; h: number },
  spalte: Spaltenlage,
  luft = 0,
): { oben: number; hoehe: number } | null {
  // Waagerecht: Eine Berührung von wenigen Pixeln ist keine Überdeckung —
  // sonst räumt ein Bild, das exakt an der Spaltenkante endet, die
  // Nachbarspalte mit ab.
  const EPS = 2;
  const linksVon = bild.x + bild.b <= spalte.x + EPS;
  const rechtsVon = bild.x >= spalte.x + spalte.b - EPS;
  if (linksVon || rechtsVon) return null;

  const von = Math.max(bild.y - luft, spalte.oben);
  const bis = Math.min(bild.y + bild.h + luft, spalte.oben + spalte.hoehe);
  if (bis - von <= 0) return null;                    // ganz über oder unter der Spalte
  return { oben: Math.max(0, von - spalte.oben), hoehe: bis - von };
}

/** Die Spaltenkästen einer Seite als Lagen — aus derselben Rasterrechnung, mit
 *  der auch eingerastet wird. */
export function spaltenlagen(r: Raster, oben: number, hoehe: number): Spaltenlage[] {
  const sp = spaltenBreite(r);
  const raus: Spaltenlage[] = [];
  for (let i = 0; i < Math.max(1, r.spalten); i++) raus.push({ x: i * (sp + r.steg), b: sp, oben, hoehe });
  return raus;
}

// ── Feste Bildplätze ────────────────────────────────────────────────────────
// Ein Bild frei zu setzen heißt, drei Entscheidungen zu treffen (Lage, Breite,
// Höhe), von denen zwei niemand treffen will. Ein Platz nimmt alle drei ab: Er
// steht fest, bevor es ein Bild gibt, und das Bild wird HINEINGESCHNITTEN
// (object-fit:cover), nicht eingepasst. Damit gibt es nichts zu skalieren.
//
// Die Plätze kommen aus dem Raster, das die Seite ohnehin hat: eine Spalte
// breit, und der Spaltenbereich senkrecht in Bänder geteilt. Ein Bild auf
// Spaltenkanten sieht auf Anhieb nach Zeitung aus; eines mit 3 px Versatz sieht
// nach Versehen aus.
//
// Das Seitenverhältnis eines Platzes ist BELIEBIG — es entsteht aus dem Raster,
// nicht aus dem Bild. Das ist zulässig, weil beschnitten und nicht verzerrt
// wird. Verzerren ist der eine Fehler, den man einem Bild sofort ansieht.

export interface Platz {
  id: string;
  /** Kurze Beschriftung für die Anzeige, z. B. „2 · Mitte“. */
  name: string;
  x: number; y: number; b: number; h: number;
}

/** Wie viele Bänder der Spaltenbereich bekommt. Drei ist der Kompromiss:
 *  Zwei ergibt Plätze, die eine halbe Seite füllen; vier ergibt Briefmarken. */
export const BAENDER = 3;

/** Feste Plätze für eine Seite. `oben` und `hoehe` beschreiben den
 *  Spaltenbereich (unter dem Kopf, über der Fußlinie) in Seitenkoordinaten —
 *  gemessen, nicht geschätzt, denn wo die Spalten anfangen, hängt an Kopfhöhe
 *  und Aufmacher. `luft` ist der Zwischenraum zwischen zwei Bändern. */
export function plaetze(r: Raster, oben: number, hoehe: number,
                        baender = BAENDER, luft = 8): Platz[] {
  const raus: Platz[] = [];
  const n = Math.max(1, r.spalten);
  const z = Math.max(1, baender);
  if (!(hoehe > 0) || !(r.seiteB > 0)) return raus;
  // Die Luft liegt ZWISCHEN den Bändern, nicht am Rand: z Bänder haben z-1
  // Fugen. Bleibt danach keine sinnvolle Höhe übrig, ohne Luft rechnen.
  let bandH = (hoehe - (z - 1) * luft) / z;
  let fuge = luft;
  if (bandH < MIN_KANTE) { bandH = hoehe / z; fuge = 0; }
  if (bandH < 1) return raus;
  const sp = spaltenBreite(r);
  const namen = z === 3 ? ["oben", "Mitte", "unten"] : null;
  // Der Bereich endet an der Fußlinie. Gerundet wird jeder Platz einzeln, und
  // drei aufgerundete Bänder können zusammen einen Pixel zu viel ergeben — ein
  // Bild ragte dann unter den Satz. Deshalb wird die Unterkante geklemmt.
  const ende = Math.round(oben + hoehe);
  for (let b = 0; b < z; b++) {
    const y = oben + b * (bandH + fuge);
    const oberkante = Math.round(y);
    const hoeheHier = Math.min(Math.round(bandH), ende - oberkante);
    if (hoeheHier < 1) continue;
    for (let i = 0; i < n; i++) {
      raus.push({
        id: `p${b}-${i}`,
        name: `${i + 1} · ${namen ? namen[b] : `Band ${b + 1}`}`,
        x: Math.round(i * (sp + r.steg)),
        y: oberkante,
        b: Math.round(sp),
        h: hoeheHier,
      });
    }
  }
  return raus;
}

/** Ist der Platz schon besetzt? Gemessen am Mittelpunkt des Platzes: Ein Bild,
 *  das ihn überdeckt, macht ihn unbrauchbar. Ein Bild, das ihn nur streift,
 *  nicht — sonst verschwänden nach dem ersten Bild alle Nachbarplätze. */
export function platzBesetzt(p: Platz, bilder: { x: number; y: number; b: number; h: number }[]): boolean {
  const mx = p.x + p.b / 2, my = p.y + p.h / 2;
  return bilder.some((b) => mx >= b.x && mx <= b.x + b.b && my >= b.y && my <= b.y + b.h);
}

/** Ein Bild in einen Platz legen. Die Geometrie kommt vom PLATZ, nie vom Bild;
 *  `verh` bleibt das Verhältnis des Platzes, damit ein späteres Aufziehen die
 *  Form behält, in der das Bild jetzt zu sehen ist. */
export function rahmenAusPlatz(daten: string, p: Platz, seite = 0,
                               id = "b" + Date.now().toString(36)): Bildrahmen {
  return { id, daten, seite, x: p.x, y: p.y, b: p.b, h: p.h, verh: p.h > 0 ? p.b / p.h : 1 };
}

/** Mehrere Bänder in EINER Spalte übereinanderlegen.
 *
 *  Der Platzhalter ist ein Gleitkasten, und Gleitkästen STAPELN sich: Der
 *  zweite beginnt nicht am oberen Rand der Spalte, sondern unter dem ersten.
 *  Sein `margin-top` ist deshalb kein Abstand von oben, sondern der Abstand zum
 *  vorigen Band. Mit absoluten Abständen addierten sich zwei Bilder zu einem
 *  Block, der höher war als die Spalte — und schob allen Text hinaus. Genau das
 *  war zu sehen: „Der Text über den Bildern verschwindet."
 *
 *  Überlappende Bänder werden verschmolzen; zwei Gleitkästen, die einander
 *  überschneiden, reservierten sonst mehr Höhe als die Bilder zusammen
 *  einnehmen.
 *
 *  Eingabe: Bänder in Spaltenkoordinaten (`oben` = Abstand von der
 *  Spaltenoberkante). Ausgabe: in Dokumentreihenfolge, mit `abstand` als
 *  `margin-top` je Gleitkasten. */
export function baenderStapeln(
  baender: { oben: number; hoehe: number }[],
): { abstand: number; hoehe: number }[] {
  const sortiert = [...baender].filter((b) => b.hoehe > 0).sort((a, b) => a.oben - b.oben);
  const zusammen: { oben: number; hoehe: number }[] = [];
  for (const b of sortiert) {
    const letzte = zusammen[zusammen.length - 1];
    if (letzte && b.oben <= letzte.oben + letzte.hoehe) {
      letzte.hoehe = Math.max(letzte.hoehe, b.oben + b.hoehe - letzte.oben);
    } else {
      zusammen.push({ oben: Math.max(0, b.oben), hoehe: b.hoehe });
    }
  }
  const raus: { abstand: number; hoehe: number }[] = [];
  let unten = 0;
  for (const b of zusammen) {
    raus.push({ abstand: Math.max(0, Math.round(b.oben - unten)), hoehe: Math.round(b.hoehe) });
    unten = b.oben + b.hoehe;
  }
  return raus;
}
