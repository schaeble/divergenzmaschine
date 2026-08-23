// Würfeln ohne Oberfläche.
//
// „Alles würfeln" gab es bisher nur im Studio, und dort arbeitet es auf den
// Auswahlfeldern selbst. Der Schaltplan im Reiter Diagnose braucht denselben
// Griff, ohne dass ein Studio gemountet ist — sonst müsste man zum Würfeln den
// Reiter wechseln und käme zum Ansehen wieder zurück, und genau das war die
// Bitte: die Änderung ohne Fensterwechsel sehen.
//
// Die Stellungen kommen aus DERSELBEN Quelle wie die Auswahlfelder
// (`optionen.ts`) und die Spannen der Stellschrauben aus `KNOB_SPANNE`. Eine
// eigene Liste hätte hier die vierte Abschrift derselben Werte ergeben — und
// wie oft das schiefgeht, steht in `optionen.ts` gleich obenan.
import { TONE_OPTS, FORM_OPTS, STRUCTURE_OPTS, MODE_OPTS, PERSP_OPTS, RHYTHM_OPTS,
  VARIANZ_OPTS, DISRUPTOR_OPTS, ARCH_OPTS, MARKOV_OPTS, TENSION_OPTS, CAST_OPTS,
  INSTAB_OPTS, werte, type Wahlliste } from "../generation/optionen";
import { RESSORTS, RESSORT_IDS } from "./ressorts";
import { KNOB_SPANNE, KNOB_VORGABE, loadKnobs, type Knobs } from "./knobs";
import { markedPresetOptions } from "./preset2";
import { offeneQuellen, ziehQuelle, uebernehmeKontext, QUELLE_LABEL, W4_FELDER,
  type W4, type Feld, type Quelle } from "./kontext";
import { worldFillContext } from "./world";
import { ziehVorrat, vorratStand } from "./wikisammler";
import { ziehBildvorrat, ladeBildvorrat } from "./bildsammler";
import { ziehThema, themenStand } from "./themenpool";
import { generateIdeaBatch } from "../generation/ideas";
import { ideaProfileToConfig, loadIdeaProfile, wuerfleIdeaProfile } from "./ideaprofile";
import { alleOmniProfile, profileToStudio } from "./omnikognition";

/** Ein würfelbarer Regler: die Kennung des Auswahlfelds (dieselbe, die das
 *  Schloss trägt) und der Schlüssel, unter dem der Wert im Anlagenstand steht. */
export interface ReglerWahl { id: string; schluessel: string; liste: Wahlliste }

export const REGLER: ReglerWahl[] = [
  { id: "f-tone", schluessel: "tone", liste: TONE_OPTS },
  { id: "f-form", schluessel: "form", liste: FORM_OPTS },
  { id: "f-structure", schluessel: "structure", liste: STRUCTURE_OPTS },
  { id: "f-mode", schluessel: "mode", liste: MODE_OPTS },
  { id: "f-persp", schluessel: "perspective", liste: PERSP_OPTS },
  { id: "f-rhythm", schluessel: "rhythm", liste: RHYTHM_OPTS },
  { id: "f-tension", schluessel: "tension", liste: TENSION_OPTS },
  { id: "f-cast", schluessel: "cast", liste: CAST_OPTS },
  { id: "f-instab", schluessel: "instability", liste: INSTAB_OPTS },
  { id: "f-markov", schluessel: "markovMode", liste: MARKOV_OPTS },
  { id: "f-disruptor", schluessel: "disruptor", liste: DISRUPTOR_OPTS },
  { id: "f-varianz", schluessel: "varLevel", liste: VARIANZ_OPTS },
  { id: "f-archa", schluessel: "archetypeA", liste: ARCH_OPTS },
  { id: "f-archb", schluessel: "archetypeB", liste: ARCH_OPTS },
  { id: "f-ressort", schluessel: "ressort",
    liste: [["auto", "Auto (aus dem Stoff)"], ...RESSORT_IDS.map((id) => [id, RESSORTS[id].label] as [string, string])] },
];

/** Die Schieberegler. Sie tragen ein Schloss wie die Auswahlfelder und wurden
 *  bis 4.288 von keinem Würfel angefasst — gemeldet als „Länge und Überraschung
 *  würfelt sich nicht mit". Die Spannen stehen hier UND in der Oberfläche; sie
 *  sind Eigenschaften des Eingabefelds (min/max/step) und lassen sich ohne DOM
 *  nicht auslesen. Der Prüfstand hält beide gegeneinander. */
export interface SchieberWahl { id: string; schluessel: string; min: number; max: number; step: number }
export const SCHIEBER: SchieberWahl[] = [
  { id: "f-len", schluessel: "lenTarget", min: 40, max: 300, step: 5 },
  { id: "f-novelty", schluessel: "novelty", min: 0, max: 100, step: 5 },
  { id: "f-surprise", schluessel: "surprise", min: 0, max: 100, step: 5 },
  { id: "f-w-wo", schluessel: "gew-wo", min: 0, max: 3, step: 1 },
  { id: "f-w-wann", schluessel: "gew-wann", min: 0, max: 3, step: 1 },
  { id: "f-w-wer", schluessel: "gew-wer", min: 0, max: 3, step: 1 },
  { id: "f-w-was", schluessel: "gew-was", min: 0, max: 3, step: 1 },
];

const zieh = <T,>(l: T[]): T => l[Math.floor(Math.random() * l.length)] as T;

/** Die Kennungen der vier Felder in der Oberfläche — dieselben, die das Schloss
 *  tragen und im Schaltplan auf den Knoten „Vier W" zeigen. */
export const W4_ID: Record<W4, string> = { where: "f-where", when: "f-when", who: "f-who", what: "f-what" };

export interface Wurf {
  regler: Record<string, string>;
  nachId: Record<string, string>;
  knobs: Knobs;
  w4: Record<W4, string>;
  quelle: string;
}

/** Die vier W würfeln — mit derselben Quellenwahl wie „Alles würfeln" im Studio.
 *
 *  Gemeldet: „Material, Vier W werden nicht gewürfelt bei Alles würfeln." Der
 *  kopflose Würfel kannte nur Regler, Schieber und Stellschrauben; die vier W
 *  standen im Schaltplan und blieben stehen. Sie brauchen keinen DOM — die
 *  Quellen sind Feature-Funktionen —, es hatte nur niemand verbunden. */
export function wuerfleVierW(vorher: Record<W4, string>, gesperrt: Set<string>, feste?: Quelle):
{ w4: Record<W4, string>; quelle: string; regler?: Record<string, string>; gewicht?: string } {
  const quelle = feste || ziehQuelle(offeneQuellen(
    sicher(() => vorratStand().funde, 0),
    sicher(() => ladeBildvorrat().length, 0),
    sicher(() => themenStand().funde, 0)));
  let vorschlag: Partial<Record<W4, string>> = {};
  let woher: string = QUELLE_LABEL[quelle];
  let omniRegler: Record<string, string> | null = null;
  let omniGewicht = "";
  if (quelle === "wiki") {
    const f = sicher(() => ziehVorrat(), null);
    if (f) { vorschlag = f.ctx; woher = `Wiki · ${f.titel}`; } else vorschlag = sicher(() => worldFillContext() as Partial<Record<W4, string>>, {} as Partial<Record<W4, string>>);
  } else if (quelle === "abschrift") {
    const f = sicher(() => ziehBildvorrat(), null);
    if (f) { vorschlag = f.ctx; woher = `Abschrift · ${f.name}`; } else vorschlag = sicher(() => worldFillContext() as Partial<Record<W4, string>>, {} as Partial<Record<W4, string>>);
  } else if (quelle === "thema") {
    const f = sicher(() => ziehThema(), null);
    if (f) { vorschlag = f.ctx; woher = `Thema · ${f.themaLabel}`; } else vorschlag = sicher(() => worldFillContext() as Partial<Record<W4, string>>, {} as Partial<Record<W4, string>>);
  } else if (quelle === "ideen") {
    // Eine Prämisse trägt dieselben vier W wie jede andere Quelle — der Weg
    // „→ Studio" im Reiter Ideen übergibt seit jeher genau diese vier Felder.
    //
    // Gewürfelt wird auch das PROFIL, nicht nur die Prämisse daraus. Bis 4.297
    // nahm der Würfel das eingestellte Profil, und das war die schwächere Wahl:
    // 300 Züge ergaben mit festem Profil 141/126/142/124 verschiedene Werte in
    // den vier Feldern, mit gewürfeltem 193/187/213/224. Das eingestellte Profil
    // bleibt unangetastet — es gilt weiter für „Ideen generieren" und „→ Studio"
    // im Reiter selbst.
    //
    // Der Anteil eigener Begriffe (lebendige Pools) kommt weiterhin aus dem
    // eingestellten Profil: Das ist eine Materialentscheidung des Benutzers und
    // keine Geschmacksrichtung.
    const p = sicher(() => loadIdeaProfile(), null);
    const profil = wuerfleIdeaProfile();
    const ideen = sicher(() => generateIdeaBatch(1, ideaProfileToConfig(profil, p ? p.liveAnteil : 0)), []);
    const i = ideen[0];
    if (i) {
      vorschlag = { where: i.seedWhere, when: i.seedWhen, who: i.seedWho, what: i.seedWhat };
      woher = `Ideen · ${profil.genre}/${profil.ton}`;
    } else vorschlag = sicher(() => worldFillContext() as Partial<Record<W4, string>>, {} as Partial<Record<W4, string>>);
  } else if (quelle === "omni") {
    // Die Omnikognition liefert mehr als vier Felder: Sie beschreibt eine
    // WAHRNEHMUNG, und dazu gehören Perspektive, Rhythmus, Modus und Ton. Ein
    // halb übernommenes Wesen wäre ein Widerspruch — „ein Hai, dritte Person,
    // Fraktur" ist kein Hai.
    //
    // Die Wortbank wird bewusst NICHT mitgenommen. Der Würfel würfelt sie
    // ohnehin selbst; zwei Würfel auf einem Feld ergeben keinen Sinn, und ein
    // stillschweigend ausgetauschtes Preset wäre eine böse Überraschung. Wer die
    // volle Übernahme will, drückt im Reiter Welt „Ins Studio übertragen".
    const profile = sicher(() => alleOmniProfile(), []);
    const prof = profile.length ? zieh(profile) : null;
    if (prof) {
      const st = profileToStudio(prof);
      vorschlag = { where: st.where, when: st.when, who: st.who, what: st.what };
      omniRegler = {
        form: st.form, structure: st.structure, perspective: st.perspective, rhythm: st.rhythm,
        varLevel: st.varLevel, mode: st.mode, tone: st.tone, markovMode: st.markovMode,
        archetypeA: st.archetypeA, archetypeB: st.archetypeB,
      };
      omniGewicht = [st.emphasis.wo, st.emphasis.wann, st.emphasis.wer, st.emphasis.was].join("/");
      woher = `Wahrnehmung · ${prof.name}`;
    } else vorschlag = sicher(() => worldFillContext() as Partial<Record<W4, string>>, {} as Partial<Record<W4, string>>);
  } else {
    vorschlag = sicher(() => worldFillContext() as Partial<Record<W4, string>>, {} as Partial<Record<W4, string>>);
  }
  const felder = {} as Record<W4, Feld>;
  for (const f of W4_FELDER) felder[f] = { id: W4_ID[f], wert: vorher[f] || "" };
  return { w4: uebernehmeKontext(felder, vorschlag, (id) => gesperrt.has(id)), quelle: woher,
    ...(omniRegler ? { regler: omniRegler, gewicht: omniGewicht } : {}) };
}

const sicher = <T,>(f: () => T, ersatz: T): T => { try { return f(); } catch { return ersatz; } };

/** Ein Wurf über alle Regler und alle Stellschrauben. Gesperrtes bleibt stehen —
 *  dieselbe Regel wie im Studio, und aus demselben Grund: Ein Schloss, das nur
 *  an einer Stelle gilt, ist kein Schloss. */
export function wuerfleAlles(vorher: Record<string, string>, gesperrt: Set<string>,
                             knobsVorher: Knobs = loadKnobs(),
                             vorherW4?: Record<W4, string>): Wurf {
  const regler: Record<string, string> = { ...vorher };
  const nachId: Record<string, string> = {};
  // Das Preset steht nicht in REGLER: Seine Liste wächst mit eigenen Presets
  // und trägt einen Sondereintrag für die Mischung mehrerer. Sie wird deshalb
  // frisch geholt statt abgeschrieben — und der Sondereintrag fällt heraus, weil
  // er ohne die zugehörige Auswahl nichts bedeutet.
  const presets = markedPresetOptions().map(([v]) => v).filter((v) => !v.startsWith("__"));
  if (!gesperrt.has("f-preset") && presets.length) {
    const p = zieh(presets);
    regler["preset"] = p; nachId["f-preset"] = p;
  }
  for (const r of REGLER) {
    const alt = vorher[r.schluessel];
    const neu = gesperrt.has(r.id) ? (alt ?? (werte(r.liste)[0] as string)) : zieh(werte(r.liste));
    regler[r.schluessel] = neu;
    nachId[r.id] = neu;
  }
  // Die Schieber. `gewicht` steht im Anlagenstand als ein Feld „0/0/2/1", weil
  // der Plan die vier zusammen zeigt — hier werden sie einzeln gewürfelt und
  // danach zusammengesetzt.
  const gew: string[] = (vorher["gewicht"] || "0/0/0/0").split("/");
  const gewIndex: Record<string, number> = { "gew-wo": 0, "gew-wann": 1, "gew-wer": 2, "gew-was": 3 };
  for (const sch of SCHIEBER) {
    const stufen = Math.floor((sch.max - sch.min) / sch.step) + 1;
    const alt = sch.schluessel in gewIndex ? (gew[gewIndex[sch.schluessel]!] ?? "0") : (vorher[sch.schluessel] ?? String(sch.min));
    const neu = gesperrt.has(sch.id) ? alt
      : String(sch.min + Math.floor(Math.random() * stufen) * sch.step);
    nachId[sch.id] = neu;
    if (sch.schluessel in gewIndex) gew[gewIndex[sch.schluessel]!] = neu;
    else regler[sch.schluessel] = neu;
  }
  regler["gewicht"] = gew.join("/");

  const knobs: Knobs = { ...knobsVorher };
  for (const feld of Object.keys(KNOB_SPANNE) as (keyof Knobs)[]) {
    if (gesperrt.has("k-" + feld)) continue;
    const sp = KNOB_SPANNE[feld];
    const stufen = Math.floor((sp.max - sp.min) / sp.step) + 1;
    knobs[feld] = sp.min + Math.floor(Math.random() * stufen) * sp.step;
  }
  void KNOB_VORGABE;
  const vw = wuerfleVierW(vorherW4 || { where: "", when: "", who: "", what: "" }, gesperrt);
  for (const f of W4_FELDER) nachId[W4_ID[f]] = vw.w4[f];
  // Zieht der Würfel die Wahrnehmung, gibt sie die Stilregler vor — sie kommen
  // NACH dem allgemeinen Wurf, sonst würde er sie gleich wieder überschreiben.
  // Gesperrtes bleibt auch hier stehen.
  if (vw.regler) {
    for (const r of REGLER) {
      const v = vw.regler[r.schluessel];
      if (v === undefined || gesperrt.has(r.id)) continue;
      if (!werte(r.liste).includes(v)) continue;
      regler[r.schluessel] = v; nachId[r.id] = v;
    }
    if (vw.gewicht) {
      const g = vw.gewicht.split("/");
      const ids = ["f-w-wo", "f-w-wann", "f-w-wer", "f-w-was"];
      const alt = (regler["gewicht"] || "0/0/0/0").split("/");
      ids.forEach((id, i) => { if (!gesperrt.has(id) && g[i] !== undefined) { nachId[id] = g[i]!; alt[i] = g[i]!; } });
      regler["gewicht"] = alt.join("/");
    }
  }
  return { regler, nachId, knobs, w4: vw.w4, quelle: vw.quelle };
}
