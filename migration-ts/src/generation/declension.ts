// Deklination von Hook-/Requisit-Phrasen (Akkusativ/Dativ) + Adjektivendungen.
import { clean } from "../text-utils";
import { NOUN_GENDER } from "./nouns.data";
import { looksLikeClausePhrase } from "./beats";

export function adjustAdjectiveEnding(adj: string, gender: string, targetCase: string): string {
  if (targetCase === "nom") return adj;
  const stem = adj.replace(/(es|er|e)$/, "");
  if (targetCase === "dat") return stem + "en";
  if (targetCase === "acc" && gender === "m") return stem + "en";
  return adj;
}

/** Geschlecht per Endungs-Heuristik raten, wenn nicht in der Tabelle (grob, aber
 *  ohne Fehlalarm bei klaren Endungen). Rueckgabe m/f/n oder undefined. */
export function guessGender(noun: string): "m" | "f" | "n" | undefined {
  const w = (noun || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  const known = NOUN_GENDER[w];
  if (known === "m" || known === "f" || known === "n") return known;
  if (/(ung|heit|keit|schaft|tät|ion|ik|enz|anz|ei|ade|age|üre|itis|ur)$/.test(w)) return "f";
  if (/(chen|lein|ment|tum|um|nis|ma)$/.test(w)) return "n";
  if (/(ling|ismus|ant|ent|ist|eur|or|ich|ig|ast)$/.test(w)) return "m";
  if (/er$/.test(w)) return "m";
  return undefined;
}

/** Ergaenzt bei einem bloßen Nomen (ohne Artikel) einen unbestimmten Artikel,
 *  sofern das Geschlecht erkennbar ist — sonst unveraendert. */
export function ensureArticle(phrase: string): string {
  const s = clean(phrase);
  if (/^(ein|eine|einen|einem|einer|eines|der|die|das|den|dem|des)\b/i.test(s)) return s;
  const words = s.split(" ");
  const nounIdx = words.findIndex((w) => /^[A-ZÄÖÜ]/.test(w));
  if (nounIdx === -1 || words.length > 4) return s;
  const g = guessGender(words[nounIdx]!.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
  if (!g) return s;
  return `${g === "f" ? "eine" : "ein"} ${s}`;
}

export function declineHookPhrase(phrase: string, targetCase: string): string {
  const s = clean(phrase);
  const m = s.match(/^(ein|eine)\s+(.*)$/i);
  if (!m) return s;
  const restWords = m[2]!.split(" ");
  let nounIdx = -1;
  for (let i = 0; i < restWords.length && i <= 2; i++) {
    if (/^[A-ZÄÖÜ]/.test(restWords[i]!)) { nounIdx = i; break; }
  }
  if (nounIdx === -1) return s;
  const nounWord = restWords[nounIdx]!.replace(/[,.;:!?]+$/, "");
  const art0 = m[1]!.toLowerCase();
  const gender = art0 === "eine" ? "f" : (NOUN_GENDER[nounWord.toLowerCase()] || guessGender(nounWord));
  if (!gender) return s;

  const artForms: Record<string, Record<string, string>> = {
    m: { nom: "ein", acc: "einen", dat: "einem" },
    f: { nom: "eine", acc: "eine", dat: "einer" },
    n: { nom: "ein", acc: "ein", dat: "einem" },
  };
  const newArt = artForms[gender]![targetCase] || artForms[gender]!.nom!;
  const words = restWords.slice();
  for (let i = 0; i < nounIdx; i++) words[i] = adjustAdjectiveEnding(words[i]!, gender, targetCase);
  return `${newArt} ${words.join(" ")}`;
}

export function safeCaseForm(rawPhrase: string, casedPhrase: string): string {
  if (looksLikeClausePhrase(rawPhrase)) return `„${clean(rawPhrase)}“`;
  return casedPhrase;
}
