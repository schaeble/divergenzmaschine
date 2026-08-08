// Deklination von Hook-/Requisit-Phrasen (Akkusativ/Dativ) + Adjektivendungen.
import { clean } from "../text-utils";
import { NOUN_GENDER } from "./nouns.data";

/** Endung abtrennen. Auch -en und -em, seit die Requisiten im Akkusativ in den
 *  Presets stehen ("einen geschnitzten Anhänger") und von dort in andere Fälle
 *  gebracht werden müssen. Der Stamm muss vier Zeichen behalten, sonst würde aus
 *  "golden" ein "gold". */
function adjStamm(adj: string): string {
  const m = adj.match(/^(.*?)(es|er|em|en|e)$/);
  return m && m[1]!.length >= 4 ? m[1]! : adj;
}

export function adjustAdjectiveEnding(adj: string, gender: string, targetCase: string): string {
  const stem = adjStamm(adj);
  if (targetCase === "nom") return gender === "m" ? stem + "er" : gender === "f" ? stem + "e" : stem + "es";
  if (targetCase === "dat") return stem + "en";
  if (targetCase === "acc") return gender === "m" ? stem + "en" : gender === "f" ? stem + "e" : stem + "es";
  return adj;
}

/** Geschlecht per Endungs-Heuristik raten, wenn nicht in der Tabelle (grob, aber
 *  ohne Fehlalarm bei klaren Endungen). Rueckgabe m/f/n oder undefined. */
export function guessGender(noun: string): "m" | "f" | "n" | undefined {
  const w = (noun || "").toLowerCase().replace(/[^a-zäöüß]/g, "");
  const known = NOUN_GENDER[w];
  if (known === "m" || known === "f" || known === "n") return known;
  // Kompositum: Genus richtet sich nach dem letzten Glied — laengster bekannter Suffix-Treffer.
  let best = "";
  for (const k in NOUN_GENDER) { if (k.length >= 3 && w.length >= k.length + 2 && w.endsWith(k) && k.length > best.length) best = k; }
  if (best) return NOUN_GENDER[best]!;
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
  if (/^(ein|eine|einen|einem|einer|eines|der|die|das|den|dem|des|kein|keine|mein|dein|sein|ihr|unser)\b/i.test(s)) return s;
  const words = s.split(" ");
  if (words.length > 5) return s;
  let nounIdx = words.findIndex((w) => /^[A-ZÄÖÜ]/.test(w));
  if (nounIdx === -1) return s;
  // Fuehrendes, faelschlich grossgeschriebenes Adjektiv (Endung -e/-er/-es/-en, direkt
  // gefolgt von einem grossgeschriebenen Nomen) kleinschreiben; Nomen ist dann das naechste.
  if (nounIdx + 1 < words.length && /^[A-ZÄÖÜ]/.test(words[nounIdx + 1]!) && /(e|er|es|en|em|te|ne)$/.test(words[nounIdx]!)) {
    words[nounIdx] = words[nounIdx]!.charAt(0).toLowerCase() + words[nounIdx]!.slice(1);
    nounIdx++;
  }
  const g = guessGender(words[nounIdx]!.replace(/[^A-Za-zÄÖÜäöüß]/g, ""));
  if (!g) return words.join(" ");                 // kein sicheres Genus -> nur Adjektiv-Korrektur, kein Artikel
  return `${g === "f" ? "eine" : "ein"} ${words.join(" ")}`;
}

/** Was verrät der Artikel selbst über das Geschlecht? "einen" ist eindeutig
 *  maskulin, "einer" feminin - das ist verlässlicher als jede Endungsheuristik. */
const ART_GENUS: Record<string, "m" | "f" | "n" | undefined> = {
  ein: undefined, eine: "f", einen: "m", einem: undefined, einer: "f", eines: undefined,
};

export function declineHookPhrase(phrase: string, targetCase: string): string {
  const s = clean(phrase);
  // Auch gebeugte Eingaben annehmen. Die Requisiten stehen in den Presets seit
  // v4.192.0 im Akkusativ ("einen Kompass"); vorher fing dieses Muster nur
  // "ein|eine" ab und gab die Phrase unverändert zurück - der Dativ entstand
  // dadurch nie, und im Text stand "nahe einen Stempelabdruck".
  const m = s.match(/^(ein|eine|einen|einem|einer|eines)\s+(.*)$/i);
  if (!m) return s;
  const restWords = m[2]!.split(" ");
  let nounIdx = -1;
  for (let i = 0; i < restWords.length && i <= 2; i++) {
    if (/^[A-ZÄÖÜ]/.test(restWords[i]!)) { nounIdx = i; break; }
  }
  if (nounIdx === -1) return s;
  const nounWord = restWords[nounIdx]!.replace(/[,.;:!?]+$/, "");
  const art0 = m[1]!.toLowerCase();
  const gender = ART_GENUS[art0] || NOUN_GENDER[nounWord.toLowerCase()] || guessGender(nounWord);
  if (!gender) return s;

  const artForms: Record<string, Record<string, string>> = {
    m: { nom: "ein", acc: "einen", dat: "einem" },
    f: { nom: "eine", acc: "eine", dat: "einer" },
    n: { nom: "ein", acc: "ein", dat: "einem" },
  };
  const newArt = artForms[gender]![targetCase] || artForms[gender]!.nom!;
  const words = restWords.slice();
  // Alle Adjektive vor dem Kern beugen - auch beim Ziel Nominativ, weil die
  // Eingabe jetzt gebeugt sein kann.
  for (let i = 0; i < nounIdx; i++) words[i] = adjustAdjectiveEnding(words[i]!, gender, targetCase);
  return `${newArt} ${words.join(" ")}`;
}

