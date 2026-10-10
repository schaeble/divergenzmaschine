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
import { LAGEN, GRUNDSAETZE, ZEIT_VORRAT, type LageTyp } from "./weltblatt";
import { HELDEN, ORTE as MAERCHEN_ORTE } from "../generation/maerchen";
import { SCHEMATA, TIERE, FABEL_ORTE } from "../generation/fabel";
import { GRUENDER, GRUENDUNGEN } from "../generation/mythos";

export interface Vier { where: string; when: string; who: string; what: string }

const UTOPIE_WER = ["ein Reisender", "ein Kartograf", "eine Händlerin", "ein Schiffbrüchiger", "eine Fischerin", "ein alter Bewohner", "eine, die gehen muss", "einer, der fliehen muss"];
const MAERCHEN_WANN = ["vor langer Zeit", "als das Wünschen noch geholfen hat", "in einem Winter, der nicht enden wollte", ""];
const MAERCHEN_MANGEL = ["Der Brunnen ist versiegt.", "Die Königstochter lacht nicht mehr.", "Die Sonne geht nicht mehr auf.", "Das Korn wächst nicht mehr.", "Die Glocken sind gestohlen.", "Der Vater ist krank, und kein Kraut hilft."];
const MYTHOS_WO = ["am großen Fluss", "auf einem Hügel über dem Meer", "in einem Tal unter hohen Bergen", "an einer Furt im Schilf", ""];
const MYTHOS_WANN = ["nach der großen Flut", "vor allen Zeiten", "als die Berge noch wanderten", ""];

/** Die vier W aus dem Vorrat der Gattung. Unbekannte Gattung: leer. */
export function wuerfleGattung4W(welt: string): Vier {
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
    // so gehören alle drei zusammen.
    const s = pick(SCHEMATA);
    const a = pick(TIERE.filter((t) => t.eigen.includes(s.rolleA)));
    const b = pick(TIERE.filter((t) => t !== a && t.eigen.includes(s.rolleB)));
    return { where: pick(FABEL_ORTE), when: "", who: `${a.nomen}, ${b.nomen}`, what: pick(s.lehre) };
  }
  if (welt === "mythos") {
    return { where: pick(MYTHOS_WO), when: pick(MYTHOS_WANN), who: pick(GRUENDER).ein.replace(/,.*$/, ""), what: pick(GRUENDUNGEN).def };
  }
  return { where: "", when: "", who: "", what: "" };
}
