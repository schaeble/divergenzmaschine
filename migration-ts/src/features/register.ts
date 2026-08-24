// Register: welche Welt ein Preset baut und wie darin gesprochen wird.
//
// Warum überhaupt: Der Autopilot mischt seit 4.311.0 bis zu drei Presets in
// eine Bank, weil die Kollision zweier Register im selben Satz das ist, was
// trägt — „Die Unterlagen liegen vollständig vor — nur der Einsatz ist ein
// Kind, das nicht sterben durfte." Er zog die drei aber BLIND und hoffte, dass
// sie weit genug auseinanderliegen. Bergwelt und Formalismus stoßen
// aufeinander, zwei Naturpresets nicht.
//
// Diese Tabelle ersetzt die Hoffnung durch etwas Nachprüfbares.
//
// ZWEI ACHSEN, und sie sind unabhängig. Das ist der Kern: Ein Text kann eine
// reale Welt in feierlicher Sprache haben oder eine irreale in amtlicher —
// gerade diese Kreuzungen sind die interessanten. Eine einzige Achse von
// „absurd" bis „real" hätte beides zusammengezogen und an beiden Enden
// Einstimmigkeit erzeugt.
//
// WIE SIE ENTSTANDEN IST: Ich habe alle 51 Presets nach ihren Motiven und
// Wendungen eingeordnet — und lag systematisch daneben. Juergen hat korrigiert,
// und die Korrekturen liefen alle in dieselbe Richtung:
//
//   „Düster ist nicht irreal." Kafka, Dickens, Hugo, Klimakrise,
//   Staatsphilosophie standen bei mir auf irreal, weil sie bedrohlich wirken.
//   Irreal heißt aber nur: Die Kausalität ist gebrochen. Bei Kafka ist sie es
//   nicht — das Bedrohliche ist gerade, dass die Behörde genau so arbeitet.
//
//   „Gehoben" war ein Sammelbecken für die halbe Liste und zerfällt in
//   ERZÄHLEND (ein Vorgang mit Vorher und Nachher) und FEIERLICH (ein Zustand,
//   der beschworen wird).
//
//   „Körperlich" reicht bis zur ungeschliffenen Rede: Clown und Jugendsprache
//   gehören dazu, nicht in eine eigene Stufe.
//
// Ich habe also Wirkung mit Beschaffenheit verwechselt. Das steht hier, weil es
// beim nächsten Preset wieder passieren wird.

export type Welt = "real" | "gehoben" | "irreal";
export type Sprache = "nuechtern" | "amtlich" | "erzaehlend" | "feierlich" | "koerperlich" | "bildhaft";

export interface Register { welt: Welt; sprache: Sprache }

export const WELT_LABEL: Record<Welt, string> = {
  real: "real", gehoben: "gehoben", irreal: "irreal",
};
export const SPRACHE_LABEL: Record<Sprache, string> = {
  nuechtern: "nüchtern", amtlich: "amtlich", erzaehlend: "erzählend",
  feierlich: "feierlich", koerperlich: "körperlich", bildhaft: "bildhaft",
};

/** Register der eingebauten Presets. Schlüssel ohne „builtin:“-Vorsatz. */
export const REGISTER: Record<string, Register> = {
  // ── real ──────────────────────────────────────────────────────────────────
  alltag: { welt: "real", sprache: "nuechtern" },
  hafen: { welt: "real", sprache: "nuechtern" },
  biologie: { welt: "real", sprache: "nuechtern" },
  geologie: { welt: "real", sprache: "nuechtern" },
  urknall: { welt: "real", sprache: "nuechtern" },
  tech: { welt: "real", sprache: "nuechtern" },
  modernarchitecture: { welt: "real", sprache: "nuechtern" },
  klimakrise: { welt: "real", sprache: "nuechtern" },
  // Kafka ist REAL. Es gibt keine sprechende Erde und keine rückwärts laufende
  // Zeit — „die Begründung fehlt, aber gilt" ist kein Bruch der Kausalität,
  // sondern eine Behörde, die konsequent arbeitet.
  kafka: { welt: "real", sprache: "amtlich" },
  formalismus: { welt: "real", sprache: "amtlich" },
  bureau: { welt: "real", sprache: "amtlich" },
  philosophie: { welt: "real", sprache: "erzaehlend" },
  staatsphilosophie: { welt: "real", sprache: "erzaehlend" },
  lebenreicher: { welt: "real", sprache: "erzaehlend" },
  dickens: { welt: "real", sprache: "erzaehlend" },
  hugo: { welt: "real", sprache: "erzaehlend" },
  melville: { welt: "real", sprache: "erzaehlend" },
  ritterromane: { welt: "real", sprache: "erzaehlend" },
  liebesromane: { welt: "real", sprache: "erzaehlend" },
  baudelaire: { welt: "real", sprache: "bildhaft" },
  expressionismus: { welt: "real", sprache: "bildhaft" },
  body: { welt: "real", sprache: "koerperlich" },
  erotik: { welt: "real", sprache: "koerperlich" },
  hunger: { welt: "real", sprache: "koerperlich" },
  sinnlich: { welt: "real", sprache: "koerperlich" },
  haute_couture: { welt: "real", sprache: "koerperlich" },
  jugendsprache: { welt: "real", sprache: "koerperlich" },

  // ── gehoben ───────────────────────────────────────────────────────────────
  bergwelt: { welt: "gehoben", sprache: "feierlich" },
  romantik: { welt: "gehoben", sprache: "feierlich" },
  eichendorff: { welt: "gehoben", sprache: "feierlich" },
  goethe: { welt: "gehoben", sprache: "feierlich" },
  glueck: { welt: "gehoben", sprache: "feierlich" },
  tanz: { welt: "gehoben", sprache: "koerperlich" },
  rimbaud: { welt: "gehoben", sprache: "bildhaft" },
  freud: { welt: "gehoben", sprache: "bildhaft" },
  mystery: { welt: "gehoben", sprache: "bildhaft" },

  // ── irreal ────────────────────────────────────────────────────────────────
  post: { welt: "irreal", sprache: "amtlich" },
  griechischetragoedie: { welt: "irreal", sprache: "erzaehlend" },
  gruendungsmythos: { welt: "irreal", sprache: "erzaehlend" },
  faust: { welt: "irreal", sprache: "erzaehlend" },
  christentum: { welt: "irreal", sprache: "erzaehlend" },
  koran: { welt: "irreal", sprache: "erzaehlend" },
  buddhismus: { welt: "irreal", sprache: "erzaehlend" },
  transzendenz: { welt: "irreal", sprache: "feierlich" },
  gaia: { welt: "irreal", sprache: "koerperlich" },
  clown: { welt: "irreal", sprache: "koerperlich" },
  surrealismus1920: { welt: "irreal", sprache: "bildhaft" },
  traumbilder: { welt: "irreal", sprache: "bildhaft" },
  myth: { welt: "irreal", sprache: "bildhaft" },
  astrologie: { welt: "irreal", sprache: "bildhaft" },
  absurd: { welt: "irreal", sprache: "bildhaft" },
};

/** Das Register eines Presets — auch für „builtin:xy“ und eigene Presets.
 *
 *  Ein eigenes Preset hat keines. Es bekommt KEINEN Ersatzwert: Ein geratenes
 *  Register wäre schlechter als gar keines, weil die Spreizung dann auf einer
 *  Erfindung rechnet. Wer eigene Presets mischen will, mischt sie wie bisher. */
export const EIGEN_KEY = "divergenz_eigene_register_v1";

/** Register eigener Presets. Getrennt von der Bank abgelegt: Die Bank ist eine
 *  Sammlung von Wortlisten, und ein Feld anderer Art darin haette jede Stelle
 *  gestoert, die ueber sie laeuft. */
export function ladeEigene(): Record<string, Register> {
  try {
    const r = JSON.parse(localStorage.getItem(EIGEN_KEY) || "{}") as Record<string, Register>;
    return r && typeof r === "object" ? r : {};
  } catch { return {}; }
}
export function sichereEigene(m: Record<string, Register>): boolean {
  try { localStorage.setItem(EIGEN_KEY, JSON.stringify(m)); return true; } catch { return false; }
}
/** Ordnet ein eigenes Preset ein. Leere Angaben LOESCHEN die Zuordnung —
 *  „unbekannt" ist ein zulaessiger Zustand und besser als eine geratene Ecke. */
export function setzeEigenes(id: string, welt: Welt | "", sprache: Sprache | ""): void {
  const m = ladeEigene();
  const k = id.replace(/^user:/, "");
  if (welt && sprache) m[k] = { welt, sprache }; else delete m[k];
  sichereEigene(m);
}

/** Das Register eines Presets. Eingebaute stehen in der Tabelle, eigene in der
 *  Ablage; unbekannte geben null zurueck. */
export function registerVon(id: string): Register | null {
  const k = id.replace(/^builtin:/, "").replace(/^user:/, "");
  return REGISTER[k] || ladeEigene()[k] || null;
}

// ── Abstand ─────────────────────────────────────────────────────────────────

const WELT_RANG: Record<Welt, number> = { real: 0, gehoben: 1, irreal: 2 };
/** Die Sprachstufen als Reihe, damit „Abstand“ etwas heißt.
 *
 *  Die Reihenfolge ist eine Behauptung: von der knappsten Form der Rede zur
 *  freiesten. Amtlich steht neben nüchtern, weil beide auf Sachlichkeit zielen;
 *  bildhaft steht am anderen Ende, weil dort die Form die Aussage trägt. Wer
 *  sie anders sieht, ändert diese eine Zeile. */
const SPRACH_RANG: Record<Sprache, number> = {
  nuechtern: 0, amtlich: 1, erzaehlend: 2, feierlich: 3, koerperlich: 4, bildhaft: 5,
};

/** Wie weit zwei Register auseinanderliegen.
 *
 *  Beide Achsen zählen gleich viel, obwohl die Sprache mehr Stufen hat —
 *  deshalb wird sie auf die Spanne der Welt normiert. Sonst wöge ein
 *  Sprachwechsel schwerer als ein Weltwechsel, und das ist nicht gemeint. */
export function abstand(a: Register | null, b: Register | null): number {
  if (!a || !b) return 0;
  const w = Math.abs(WELT_RANG[a.welt] - WELT_RANG[b.welt]) / 2;
  const s = Math.abs(SPRACH_RANG[a.sprache] - SPRACH_RANG[b.sprache]) / 5;
  return Math.round((w + s) * 500) / 1000;
}

/** Der Abstand einer ganzen Mischung: der KLEINSTE Abstand darin.
 *
 *  Nicht der Durchschnitt. Drei Presets, von denen zwei aus derselben Ecke
 *  kommen, sind in Wahrheit zwei Register und nicht drei — der Durchschnitt
 *  verdeckt das, das Minimum zeigt es. */
export function mischAbstand(ids: string[]): number {
  // Presets OHNE Register bleiben draußen, statt als Abstand null zu zählen.
  //
  // Das war ein Fehler mit Folgen: Ein eigenes Preset hat kein Register, und
  // `abstand(null, x)` gab 0. Die Spreizung hielt es damit für dasselbe
  // Register wie jedes andere und MIED es systematisch — jeder Partner zog die
  // Mischung auf null. Ein eigenes Preset wurde also benachteiligt, ohne dass
  // es dafür einen Grund gäbe.
  //
  // „Unbekannt" ist eben nicht neutral. Wer nichts weiß, darf nicht das
  // Schlechteste annehmen; er muss sich enthalten.
  const regs = ids.map(registerVon).filter((r): r is Register => r !== null);
  if (regs.length < 2) return 0;
  let min = 1;
  for (let i = 0; i < regs.length; i++) {
    for (let j = i + 1; j < regs.length; j++) min = Math.min(min, abstand(regs[i]!, regs[j]!));
  }
  return min;
}

/** Wie viele der Presets ein Register tragen. Steht neben dem Abstand, damit
 *  eine 0 lesbar bleibt: Sie heißt „ein Register" — oder „zu wenige bekannt". */
export function bekannteRegister(ids: string[]): number {
  return ids.filter((i) => registerVon(i) !== null).length;
}

/** Wählt aus dem Vorrat eine Mischung mit möglichst großem Abstand.
 *
 *  Nicht das MAXIMUM: Immer die beiden entferntesten zu nehmen ergäbe in jeder
 *  Ausgabe dieselbe Paarung. Gezogen wird ein Kandidat, dann werden mehrere
 *  Partner probiert und der beste genommen — das streut und spreizt zugleich.
 *
 *  `rnd` ist einsetzbar, damit der Prüfstand ohne Zufall prüfen kann. */
export function waehleGespreizt(
  vorrat: string[], anzahl: number, rnd: () => number = Math.random, versuche = 6,
): string[] {
  const n = Math.max(1, Math.min(anzahl, vorrat.length));
  if (!vorrat.length) return [];
  const frei = vorrat.slice();
  const zieh = (): string => frei.splice(Math.min(frei.length - 1, Math.floor(rnd() * frei.length)), 1)[0]!;
  const raus = [zieh()];
  while (raus.length < n && frei.length) {
    let bester = "", bestAbstand = -1;
    for (let v = 0; v < versuche && frei.length; v++) {
      const k = frei[Math.min(frei.length - 1, Math.floor(rnd() * frei.length))]!;
      const a = mischAbstand([...raus, k]);
      if (a > bestAbstand) { bestAbstand = a; bester = k; }
    }
    if (!bester) break;
    frei.splice(frei.indexOf(bester), 1);
    raus.push(bester);
  }
  return raus;
}
