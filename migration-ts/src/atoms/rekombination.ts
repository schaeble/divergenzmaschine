// Rekombinations-Modus: baut den Text aus geprüften Atomen statt aus Schablonen.
// Pool = aktive Wortbank (offline annotiert) + geerntete Satzvorlagen.
import type { Bank, GenInput } from "../types";
import { deriveAtom } from "./derive";
import { passt, fortschreiben, fuelleKontext, fuelleSlot, offeneSlots, verfugen, ziehe, phasenplan, type PoolAtom, type Kontext } from "./assemble";
import TEMPLATES from "./templates.data.json";
import { normWhere, normWhen, normWho } from "../generation/ctxnorm";
import { isFirstPerson, isSecondPerson } from "../generation/coherence";

interface TemplateAtom { id: string; text: string; typ: string; verlangt: PoolAtom["verlangt"]; oeffnet: boolean }

/** Baut den Atom-Pool aus Bank und Vorlagen. Perspektivfremde Vorlagen bleiben draußen. */
export function buildPool(bank: Bank, perspektive: string): PoolAtom[] {
  const pool: PoolAtom[] = [];
  let i = 0;
  for (const [kat, arr] of Object.entries(bank as unknown as Record<string, string[]>)) {
    if (!Array.isArray(arr)) continue;
    for (const t of arr) {
      const d = deriveAtom(t);
      pool.push({ ...d, id: `wb-${++i}`, quelle: "wortbank", kategorie: kat, verlangt: null,
        bruchgrad: d.unsicher.length ? 1 : (kat === "motifs" || kat === "hooks" ? 1 : 0) });
    }
  }
  for (const a of (TEMPLATES as { atome: TemplateAtom[] }).atome) {
    if (/⟨(WAHL|X)⟩/.test(a.text)) continue;                    // unauflösbarer Rest aus der Ernte
    // Perspektiv-Markierung: Ich-/Du-Vorlagen nur bei passender Erzählperspektive
    if (isFirstPerson(a.text) && perspektive !== "first" && perspektive !== "we" && perspektive !== "auto") continue;
    if (isSecondPerson(a.text) && perspektive !== "second" && perspektive !== "auto") continue;
    const d = deriveAtom(a.text.replace(/⟨[A-ZÄÖÜ]+⟩/g, "Ding"));
    pool.push({ ...d, id: a.id, text: a.text, typ: a.typ as PoolAtom["typ"], quelle: "vorlage",
      verlangt: a.verlangt, oeffnet: a.oeffnet, bruchgrad: 0, fuehrt_ein: [] });
  }
  return pool;
}

/** Divergenz aus den Studio-Reglern ableiten (0–100). */
const divergenzOf = (input: GenInput): number =>
  (input.varLevel === "high" ? 85 : input.varLevel === "low" ? 30 : 60) + (input.instability >= 2 ? 10 : 0);

/** Erzeugt einen Text im Rekombinations-Modus. */
export function buildRekombination(bank: Bank, input: GenInput): string {
  const pool = buildPool(bank, input.perspective);
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur: (normWho(input.who || "").split(",")[0] || "Jemand").trim(),
    verb: "will",
  };
  const ziel = Math.max(4, Math.min(18, Math.round((input.lenTarget ?? 110) / 14)));
  const k: Kontext = { vorheriges: null, offenerKopf: false, entitaeten: new Map([[ctx.figur, { abstand: 0 }]]),
    tempus: null, divergenz: divergenzOf(input), benutzt: new Set() };
  const kurve = ["mittel", "kurz", "lang", "mittel", "kurz", "mittel", "lang"];
  const plan = phasenplan(ziel);
  const out: string[] = [];
  let letzterTyp = "", gleicheInFolge = 0;

  for (let s = 0; s < ziel; s++) {
    const phase = plan[s]!;
    const letzte = s === ziel - 1;
    let kand = pool.filter((a) => passt(a, k, phase));
    if (letzte) kand = kand.filter((a) => !a.oeffnet && !a.verlangt);   // Text darf nicht offen enden
    // Nominalphrasen-Ketten aufbrechen: nach zwei gleichartigen Atomen Typwechsel erzwingen
    if (gleicheInFolge >= 2) {
      const anders = kand.filter((a) => a.typ !== letzterTyp);
      if (anders.length) kand = anders;
    }
    if (!kand.length) break;
    const a = ziehe(kand, kurve[s % kurve.length]!, out.join(" "), phase);
    if (!a) break;
    let text = fuelleKontext(a.text, ctx);
    let guard = 0;
    while (offeneSlots(text) && guard++ < 3) {
      const kf: Kontext = { ...k, vorheriges: a, offenerKopf: false };
      const f = ziehe(pool.filter((x) => x.id !== a.id && !k.benutzt.has(x.id) && passt(x, kf)), "mittel", out.join(" "));
      if (!f) break;
      // Der Füller steht mitten im Satz: Großschreibung nur bei Eigennamen belassen
      let fill = fuelleKontext(f.text, ctx).replace(/[.!?…]+$/, "");
      if (!f.fuehrt_ein.length && /^[A-ZÄÖÜ][a-zäöüß]/.test(fill)) fill = fill.charAt(0).toLowerCase() + fill.slice(1);
      text = fuelleSlot(text, fill);
      k.benutzt.add(f.id);
    }
    if (offeneSlots(text)) continue;                    // ungefüllt → verwerfen statt ausgeben
    out.push(text);
    gleicheInFolge = a.typ === letzterTyp ? gleicheInFolge + 1 : 0;
    letzterTyp = a.typ;
    fortschreiben(k, a);
    if (a.verlangt) k.offenerKopf = false;
  }
  return verfugen(out);
}
