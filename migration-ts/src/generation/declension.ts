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
  const gender = NOUN_GENDER[nounWord.toLowerCase()];
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
  if (looksLikeClausePhrase(rawPhrase)) return `„${clean(rawPhrase)}"`;
  return casedPhrase;
}
