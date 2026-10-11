// „Alles würfeln" bei gewählter Gattung (4.381.0).
//
// Gemessen im Browser, je Gattung zwölf Würfe: Die vier W kamen aus den
// Ereignis-Quellen (Welt, Wiki, Ideen, Wahrnehmung) und passten nicht —
// „Ich kam als Hai nach Velwen", ein Grundsatz „Sucht Nahrung.", ein Fuchs und
// ein Kranich „im offenen Wasser". Und die Form wurde in der Hälfte der Würfe
// von Prosa weggewürfelt; dann wirkte die Gattung gar nicht.
//
// Hier würfeln die vier W aus dem Vorrat der Gattung selbst — Werte, die ihre
// eigenen Erkenner lesen können. Der Prüfstand hält das fest: Jeder Wurf muss
// von der Gattung verstanden werden, sonst wäre er so falsch wie vorher.
import { pick } from "../text-utils";
import { WELT_OPTS } from "../generation/optionen";
import { LAGEN, GRUNDSAETZE, ZEIT_VORRAT, type LageTyp } from "./weltblatt";
import { HELDEN, ORTE as MAERCHEN_ORTE } from "../generation/maerchen";
import { SCHEMATA, TIERE, FABEL_ORTE, erkenneLehre } from "../generation/fabel";
import { GRUENDER, GRUENDUNGEN } from "../generation/mythos";

export interface Vier { where: string; when: string; who: string; what: string }

const UTOPIE_WER = ["ein Reisender", "ein Kartograf", "eine Händlerin", "ein Schiffbrüchiger", "eine Fischerin", "ein alter Bewohner", "eine, die gehen muss", "einer, der fliehen muss"];
const MAERCHEN_WANN = ["vor langer Zeit", "als das Wünschen noch geholfen hat", "in einem Winter, der nicht enden wollte", ""];
const MAERCHEN_MANGEL = ["Der Brunnen ist versiegt.", "Die Königstochter lacht nicht mehr.", "Die Sonne geht nicht mehr auf.", "Das Korn wächst nicht mehr.", "Die Glocken sind gestohlen.", "Der Vater ist krank, und kein Kraut hilft."];
const MYTHOS_WO = ["am großen Fluss", "auf einem Hügel über dem Meer", "in einem Tal unter hohen Bergen", "an einer Furt im Schilf", ""];
const MYTHOS_WANN = ["nach der großen Flut", "vor allen Zeiten", "als die Berge noch wanderten", ""];

/** Die vier W aus dem Vorrat der Gattung. Unbekannte Gattung: leer. */
export function wuerfleGattung4W(welt: string, lehre?: string): Vier {
  if (welt === "utopie" || welt === "dystopie") {
    const typ = pick(Object.keys(LAGEN).filter((t) => LAGEN[t as LageTyp].lagen.length)) as LageTyp;
    const zeit = pick(["vergangenheit", "zukunft", "nachbruch"] as const);
    // Nur Grundsätze ohne Platzhalter — „{zahlA} Stunden" gehört ins Blatt.
    const g = pick(GRUNDSAETZE.filter((x) => !/[{}]/.test(x.satz)));
    return { where: pick(LAGEN[typ].lagen), when: pick(ZEIT_VORRAT[zeit]), who: pick(UTOPIE_WER), what: g.satz };
  }
  if (welt === "maerchen") {
    return { where: pick(MAERCHEN_ORTE).wo, when: pick(MAERCHEN_WANN), who: pick(HELDEN.filter((h) => !/ eines /.test(h.ein))).ein, what: pick(MAERCHEN_MANGEL) };
  }
  if (welt === "fabel") {
    // Erst die Fabel, dann ein Tierpaar, das hineinpasst, dann ihre Lehre —
    // so gehören alle drei zusammen. Ist die Lehre vorgegeben (einfacher Kopf),
    // kommt die Fabel aus ihr.
    const s = (lehre && erkenneLehre(lehre)) || pick(SCHEMATA);
    const a = pick(TIERE.filter((t) => t.eigen.includes(s.rolleA)));
    const b = pick(TIERE.filter((t) => t !== a && t.eigen.includes(s.rolleB)));
    return { where: pick(FABEL_ORTE), when: "", who: `${a.nomen}, ${b.nomen}`, what: pick(s.lehre) };
  }
  if (welt === "mythos") {
    return { where: pick(MYTHOS_WO), when: pick(MYTHOS_WANN), who: pick(GRUENDER).ein.replace(/,.*$/, ""), what: pick(GRUENDUNGEN).def };
  }
  return { where: "", when: "", who: "", what: "" };
}

/** Die Gattungen, die „Alles würfeln" bei offenem Schloss zieht (4.382.0).
 *  Ohne „keine": Wer das Schloss öffnet, will eine Gattung. */
export const WUERFEL_GATTUNGEN: readonly string[] = WELT_OPTS.map(([v]) => v).filter((v) => v !== "keine");

/** Welche Gattung „Alles würfeln" setzt, wenn ihr Schloss offen ist.
 *  Eine Gattung wirkt nur in Prosa: Ist die Form auf etwas anderes
 *  GESPERRT, kommt „keine" heraus. Ist die Form offen, zieht der Würfel eine
 *  Gattung, und die Form wird danach auf Prosa gestellt. */
export function wuerfleGattung(form: string, formGesperrt: boolean): string {
  if (formGesperrt && form !== "prose") return "keine";
  return pick([...WUERFEL_GATTUNGEN]);
}

// ── Der einfache Kopf bei gewählter Gattung (4.383.0) ──────────────────────
// Ohne Gattung zerlegt der Kopf den Wovon-Satz in die vier W — eine Figur,
// ein Ort, ein Jahr, ein Vorgang. Bei einer Gattung trägt das „Was" etwas
// anderes: den Grundsatz der Utopie, den Mangel im Märchen, die Lehre der
// Fabel, das Gegründete im Mythos. „Es gibt kein Geld." in Figur und Vorgang
// zu zerlegen ergab Wer „Es", Was „gibt kein Geld". Deshalb geht der Satz bei
// einer Gattung GANZ ins Was, und die drei anderen W kommen aus ihrem Vorrat.

/** Wie die Zeile „Wovon" bei einer Gattung heißt, und ein Beispiel dafür. */
export const KOPF_WOVON: Record<string, { marke: string; beispiel: string; frage: string }> = {
  utopie: { marke: "Grundsatz", beispiel: "Niemand besitzt etwas.", frage: "Nach welchem Grundsatz lebt diese Welt?" },
  dystopie: { marke: "Grundsatz", beispiel: "Es gibt kein Geld.", frage: "Welcher Grundsatz kippt in dieser Welt?" },
  maerchen: { marke: "Mangel", beispiel: "Der Brunnen ist versiegt.", frage: "Was fehlt, und wer zieht los?" },
  fabel: { marke: "Lehre", beispiel: "Beharrlichkeit kommt weiter als Hochmut.", frage: "Welche Lehre soll die Fabel tragen?" },
  mythos: { marke: "Gründung", beispiel: "die Brücke", frage: "Was wird gegründet?" },
};

/** Ein Vorschlag für den Wovon-Satz der Gattung — derselbe Vorrat wie beim
 *  Würfeln, damit der Satz von der Gattung gelesen werden kann. */
export function gattungSaat(welt: string): string {
  return wuerfleGattung4W(welt).what;
}

/** Die vier W für „Text erzeugen" im Kopf bei gewählter Gattung: Das Was ist
 *  der Satz (oder, ist er leer, ein Wurf), die anderen drei kommen aus dem
 *  Vorrat. Bei der Fabel passt das Tierpaar zur Lehre. */
export function gattungKopfKontext(welt: string, saat: string): Vier {
  const was = (saat || "").replace(/\s+/g, " ").trim();
  const wurf = wuerfleGattung4W(welt, welt === "fabel" ? was : undefined);
  return { ...wurf, what: was || wurf.what };
}
