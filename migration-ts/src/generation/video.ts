// Video/Multi-Shot: Shot-Beschreibungen + Sequenz-Text.
import type { StoryKit } from "../types";
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";
import { VIDEO_RULES, VIDEO_CAM_EXTENDED, VIDEO_LIGHT, VIDEO_TEX } from "./video.data";
import { loadDramaData, type DramaData } from "./dramaturgie";

export const clampShotCount = (n: number): number => Math.max(3, Math.min(10, Number.isFinite(n) ? n : 5));
export const clampTotalSec = (n: number): number => Math.max(3, Math.min(600, Number.isFinite(n) ? n : 15));
const fmtSec = (x: number): string => { if (!isFinite(x)) return "0s"; const v = Math.round(x * 10) / 10; return (v % 1 === 0 ? v.toFixed(0) : String(v)) + "s"; };
const pickSymbol = (): string => pick(["⊗", "⟂", "⟡", "⌁", "⟟", "⟐", "✶", "⟁"]);
const stripTailPunct = (s: string): string => clean(s).replace(/[.!?…]+$/, "");

// Finite Verbformen, die im Nebensatz ans Ende gehoeren. Bewusst eine kurze,
// geschlossene Liste: Lieber die Fuegung vermeiden als sie falsch bauen.
const FINIT = /^(ist|sind|war|waren|hat|haben|hatte|wird|werden|wurde|kann|koennen|können|muss|müssen|will|wollen|bleibt|bleiben|steht|stehen|geht|gehen|kommt|kommen|liegt|liegen|zeigt|zeigen|faellt|fällt|reicht|gilt|klingt|wirkt|scheint|fehlt|passt|stimmt)$/i;

/** Bringt einen Hauptsatz in die Nebensatzstellung: "die Frist ist vorbei"
 *  -> "die Frist vorbei ist". Gibt null zurueck, wenn die Form unklar ist -
 *  dann baut der Aufrufer lieber einen Doppelpunkt als einen falschen dass-Satz.
 *  Vorher stand im Text "Tim bemerkt, dass die Zustaendigkeit ist unklar". */
function verbAnsEnde(satz: string): string | null {
  const w = stripTailPunct(satz).split(/\s+/).filter(Boolean);
  if (w.length < 3 || w.length > 9) return null;
  const vi = w.findIndex((x) => FINIT.test(x));
  if (vi < 1 || vi === w.length - 1) return null;        // schon am Ende oder nicht gefunden
  if (w.slice(vi + 1).some((x) => FINIT.test(x))) return null;   // zwei finite Verben: zu unsicher
  const verb = w[vi]!;
  return [...w.slice(0, vi), ...w.slice(vi + 1), verb].join(" ");
}
function normalizePlace(W: string): string {
  const w = clean(W);
  if (!w) return "an einem Ort";
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter)\b/i.test(w)) return w;
  return "an einem " + w;
}

/**
 * F.4: Die Bildsaetze kommen aus dem Erzaehlbogen des Presets.
 *
 * Vorher waren es fuenf feste Schablonen - dieselbe Reihenfolge in jedem Stoff,
 * und der Inhalt beschraenkt auf Requisit, Hindernis, Wendung und Schluss. Der
 * Erzaehlbogen beschreibt Phasen, und eine Sequenz besteht aus Phasen: Das passt
 * ohne Umweg zusammen, und es sind rund zwanzig Eintraege je Preset statt vier.
 *
 * Die Phasenfolge bleibt dramaturgisch (Einstieg, Mitte, Hoehepunkt, Wendung,
 * Schluss) - sie soll ja tragen. Was sich aendert, ist der Inhalt jeder Phase.
 */
function bogenSaetze(d: DramaData, kit: StoryKit): { fest: string[]; frei: string[] } {
  const s = (a: string[] | undefined): string[] => (Array.isArray(a) ? a.filter(Boolean) : []);
  const P = kit.P;
  const fest: string[] = [];
  const einstieg = s(d.einstieg), mitte = s(d.mitte), hoehe = s(d.hoehepunkt), aend = s(d.veraenderungen);
  if (einstieg.length) fest.push(`${cap(stripTailPunct(pick(einstieg)))}.`);
  if (mitte.length) fest.push(`${cap(stripTailPunct(pick(mitte)))}.`);
  if (hoehe.length) fest.push(`Und dann: ${stripTailPunct(pick(hoehe))}.`);
  if (aend.length) fest.push(`Etwas kippt: ${stripTailPunct(pick(aend))}.`);
  // Frei einsetzbare Zwischenbilder - Reihenfolge egal, sie fuellen auf.
  const frei: string[] = [];
  for (const r of s(d.regeln)) frei.push(`Regel: ${ensurePunct(r)}`);
  for (const z of s(d.zeitanomalien)) frei.push(ensurePunct(z));
  // Rahmen durchwechseln: Mit einem festen Rahmen stand "Dann, unvermittelt:"
  // drei Mal in derselben Sequenz - das klingt nach Schablone, obwohl der Inhalt
  // jedes Mal ein anderer ist.
  const K_RAHMEN = [`${P} weiß, worum es geht:`, "Im Bild bleibt:", "Der Einsatz sichtbar:", "Alles zielt auf:"];
  const A_RAHMEN = ["Dann, unvermittelt:", "Ohne Vorwarnung:", "Ein Schnitt, und:", "Und plötzlich:"];
  s(d.konflikte).forEach((k, i) => frei.push(`${K_RAHMEN[i % K_RAHMEN.length]} ${stripTailPunct(k)}.`));
  s(d.ausloeser).forEach((a, i) => frei.push(`${A_RAHMEN[i % A_RAHMEN.length]} ${stripTailPunct(a)}.`));
  return { fest, frei };
}

function buildVideoShots(kit: StoryKit, shotCount: number, lenTarget = 0): string[] {
  const sym = pickSymbol();
  const place = normalizePlace(kit.W);
  const who = kit.P;
  const objClean = stripTailPunct(pick([kit.hookDat, kit.propDat]));
  const bogen = loadDramaData();
  const shots: string[] = [];
  let nachschub: string[] = [];
  let nachschubVorrat: string[] = [];

  const bild = (): string => `${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`;

  if (bogen) {
    const { fest, frei } = bogenSaetze(bogen, kit);
    const rest = reihenfolge(frei);
    // Erster Shot verankert Ort und Figur - ohne das weiss niemand, wo man ist.
    shots.push(`${cap(place)}: ${who} nahe ${objClean}. ${cap(pick(VIDEO_TEX))}. ${bild()}`);
    const folge: string[] = [];
    for (let i = 0; i < fest.length; i++) {
      folge.push(fest[i]!);
      if (rest.length && folge.length + 1 < shotCount) folge.push(rest.shift()!);
    }
    while (folge.length < shotCount - 1 && rest.length) folge.push(rest.shift()!);
    for (const satz of folge.slice(0, shotCount - 2)) shots.push(`${satz} ${bild()}`);
    nachschub = rest; nachschubVorrat = frei;
    shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  } else {
    // Rueckfall ohne Erzaehlbogen: die alten Schablonen.
    const hindernis = verbAnsEnde(kit.obstacle);
    shots.push(`${cap(place)} steht ${who} nahe ${objClean}. ${cap(pick(VIDEO_LIGHT))}. ${cap(pick(VIDEO_CAM_EXTENDED))}. ${cap(pick(VIDEO_TEX))}.`);
    shots.push(`Regel: ${cap(pick(VIDEO_RULES))}. ${sym}. ${hindernis
      ? `${who} bemerkt, dass ${hindernis}`
      : `${who} bemerkt: ${stripTailPunct(kit.obstacle)}`}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
    shots.push(`${ensurePunct(kit.turn)} Der Raum reagiert: ${sym} pulsiert, und ${pick(["die Wände atmen", "die Perspektive kippt", "der Boden verschiebt sich", "die Luft wird körnig"])}. ${cap(pick(VIDEO_LIGHT))}.`);
    shots.push((kit.AisClause || kit.AisInfinitiveLed)
      ? `${who} erkennt: ${stripTailPunct(kit.Apure)} — aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten lösen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`
      : `${who} ${kit.AleadVerb || "versucht"} ${stripTailPunct(kit.Apure)}, aber ${pick(["die Zeit springt", "die Regeln drehen sich um", "die Schatten lösen sich"])}. ${cap(pick(VIDEO_CAM_EXTENDED))}.`);
    shots.push(`${ensurePunct(kit.ending)} Nur: ${pick(["der Riss", "das Fenster", `das Symbol ${sym}`, "die Karte"])} bleibt sichtbar. ${cap(pick(VIDEO_TEX))}.`);
  }

  while (shots.length < shotCount) {
    shots.splice(Math.max(1, shots.length - 1), 0,
      `${who} passiert an ${pick(["einer Kante", "einem Spiegel", "einer Tür ohne Griff"])} vorbei. ${bild()}`);
  }

  const fertig = shots.slice(0, shotCount);
  if (lenTarget > 0) {
    // Nicht rechnen, sondern nachlegen bis die Marke steht: Eine Formel aus
    // Shot-Zahl und Zieltext verfehlte sie deutlich (bei Ziel 400 kamen 207
    // Woerter heraus), weil die Grundbeschreibungen unterschiedlich lang sind.
    const zaehl = (): number => fertig.join(" ").split(/\s+/).filter(Boolean).length;
    const gesamt = new Set<string>(fertig.flatMap((x) => x.split(". ").map((y) => y.trim() + ".")));
    // Zuerst weiteres Bogen-Material verteilen. Nur Licht- und Texturangaben
    // nachzulegen ergab bei Ziel 200 zehn davon je Shot - das liest sich wie eine
    // Liste und nicht wie eine Anweisung, und das Preset kommt darin nicht vor.
    for (let runde = 0; runde < 20 && nachschubVorrat.length && zaehl() < lenTarget * 0.92; runde++) {
      // Vorrat aufgebraucht? Neu mischen. Bei Ziel 400 war er nach einer Runde
      // leer, danach fuellten nur noch Bildangaben auf - der Anteil des Stoffs
      // fiel auf ein Sechstel und die Ziellaenge wurde trotzdem verfehlt.
      if (!nachschub.length) nachschub = reihenfolge(nachschubVorrat);
      let gesetztInRunde = 0;
      for (let i = 0; i < fertig.length && nachschub.length && zaehl() < lenTarget * 0.92; i++) {
        const satz = nachschub.shift()!;
        // Ueber die GANZE Sequenz pruefen, nicht nur im selben Shot: "Ein Schnitt,
        // und: ein Stempel auf dem falschen Blatt" stand sonst in Shot 3 und 4.
        if (gesamt.has(satz)) continue;
        gesamt.add(satz); fertig[i] += " " + satz; gesetztInRunde++;
      }
      if (!gesetztInRunde && !nachschub.length) break;
    }
    for (let runde = 0; runde < 12 && zaehl() < lenTarget * 0.92; runde++) {
      for (let i = 0; i < fertig.length && zaehl() < lenTarget * 0.92; i++) {
        // Keine Bildangabe zweimal im selben Shot - "Floating dust. ... Floating
        // dust." liest sich wie ein Fehler, nicht wie eine Anweisung.
        const frei2 = (liste: string[]): string | null => {
          // Gross-/Kleinschreibung ignorieren: Eingesetzt wird mit cap(), in der
          // Liste steht die Kleinform - der Vergleich lief sonst immer ins Leere.
          const schon = fertig[i]!.toLowerCase();
          const offen = liste.filter((x) => !schon.includes(x.toLowerCase()));
          return offen.length ? pick(offen) : null;
        };
        const tex = frei2(VIDEO_TEX as unknown as string[]);
        const licht = frei2(VIDEO_LIGHT as unknown as string[]);
        if (!tex && !licht) break;
        fertig[i] += (tex ? " " + cap(tex) + "." : "") + (licht ? " " + cap(licht) + "." : "");
      }
    }
  }
  return fertig;
}

/** Zufaellige Reihenfolge ohne die Vorlage zu veraendern. */
function reihenfolge<T>(a: T[]): T[] {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j]!, x[i]!]; }
  return x;
}

export function buildVideoSequenceText(kit: StoryKit, shotCount = 5, totalSec = 15, lenTarget = 0): string {
  const n = clampShotCount(shotCount);
  const total = clampTotalSec(totalSec);
  const dur = total / n;
  // F.2: Die Textmenge je Shot folgt dem Laengenregler. Die Shot-ZAHL bleibt am
  // eigenen Regler - sie ist eine Angabe fuer den Schnitt, keine Textlaenge.
  const shots = buildVideoShots(kit, n, lenTarget);
  const out = [`SEQUENZ — ${kit.mode.label || ""}`.trim(), `WER: ${kit.PRaw || kit.P}`, `WO: ${kit.W}`, `WANN: ${kit.T}`, `WAS: ${kit.A}`, `GESAMTLÄNGE: ${fmtSec(total)} • ${fmtSec(dur)} pro Shot`, ""];
  for (let i = 0; i < shots.length; i++) { out.push(`Shot ${i + 1} (${fmtSec(dur)})`, `DE: ${shots[i]}`, ""); }
  return out.join("\n");
}
