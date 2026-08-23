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

export interface Wurf { regler: Record<string, string>; nachId: Record<string, string>; knobs: Knobs }

/** Ein Wurf über alle Regler und alle Stellschrauben. Gesperrtes bleibt stehen —
 *  dieselbe Regel wie im Studio, und aus demselben Grund: Ein Schloss, das nur
 *  an einer Stelle gilt, ist kein Schloss. */
export function wuerfleAlles(vorher: Record<string, string>, gesperrt: Set<string>,
                             knobsVorher: Knobs = loadKnobs()): Wurf {
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
  return { regler, nachId, knobs };
}
