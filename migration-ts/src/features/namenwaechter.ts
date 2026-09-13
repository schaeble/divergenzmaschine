// Der Namen-Wächter (4.365.0): Vornamen in Wortbank- und Erzählerbank-
// Einträgen werden zu Pronomen — das Material bringt keine Figur mit, die
// Figur setzt der Wer.
//
// „Vera geht durch den Hof" → „sie geht durch den Hof"; „mit Tom" → „mit
// ihm"; „für Vera" → „für sie"; „sieht Tom" → „sieht ihn"; „Veras Mantel" →
// „ihr Mantel", „Toms Haus" → „sein Haus". Der Fall kommt aus der Stellung:
// nach einer Präposition deren Fall (mit/von/bei → Dativ, für/ohne/gegen →
// Akkusativ, an/auf/in … → Dativ, der häufige Ortsfall), nach einem Verb der
// Akkusativ, sonst der Nominativ. Am Satzanfang groß. Zwei Namen mit „und"
// bleiben zwei Pronomen. Was der Wächter nicht kennt (Nachnamen, seltene
// Vornamen, Namen mit Artikel), lässt er stehen — lieber ein Name zu viel als
// ein Wort zu wenig.
import { VORNAMEN } from "../generation/namen.data";
import { istVerbform } from "../generation/verben";
import { guessGender } from "../generation/declension";

const DATIV = /^(mit|von|bei|zu|aus|nach|seit|gegenüber|außer|entgegen|ab|an|auf|in|über|unter|vor|hinter|neben|zwischen)$/i;
const AKKUSATIV = /^(für|ohne|gegen|um|durch|bis|wider|entlang)$/i;

export interface NamenErgebnis { text: string; ersetzt: { name: string; durch: string }[] }

const PRON = {
  f: { nom: "sie", akk: "sie", dat: "ihr", poss: "ihr" },
  m: { nom: "er", akk: "ihn", dat: "ihm", poss: "sein" },
} as const;

/** Possessiv mit Endung nach dem folgenden Nomen (nur Nominativ/Akkusativ
 *  Singular sicher; sonst die Grundform, die im Deutschen meist trägt). */
function possessiv(g: "f" | "m", naechstes: string): string {
  const stamm = PRON[g].poss;
  const n = naechstes.replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  // Plural zuerst: Umlaut + -er (Bücher, Häuser, Väter) ist Plural, was die
  // Genus-Heuristik (-er → m) nicht weiß.
  if (/[äöü][a-zß]*er$/.test(n)) return stamm + "e";
  const ng = guessGender(n);
  if (ng === "f") return stamm + "e";
  if (!ng && /(en|e|s)$/.test(n)) return stamm + "e";
  return stamm;
}

export function entnamen(text: string): NamenErgebnis {
  const ersetzt: { name: string; durch: string }[] = [];
  if (!text) return { text, ersetzt };
  // Wortweise mit Kontext; Satzzeichen bleiben am Wort kleben.
  const teile = text.split(/(\s+)/);
  const wort = (i: number): string => (teile[i] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
  const istSatzanfang = (i: number): boolean => {
    for (let j = i - 1; j >= 0; j--) { if (!teile[j] || /^\s+$/.test(teile[j]!)) continue; return /[.!?…]["“»]?$/.test(teile[j]!); }
    return true;
  };
  for (let i = 0; i < teile.length; i++) {
    const roh = teile[i]!;
    if (!roh || /^\s+$/.test(roh)) continue;
    const m = roh.match(/^([„»(]?)([A-ZÄÖÜ][a-zäöüß]+)([^A-Za-zÄÖÜäöüß]*)$/);
    if (!m) continue;
    const vor = m[1] || "", nach = m[3] || "";
    let kern = m[2]!, genitivS = "";
    let g = VORNAMEN.get(kern);
    if (!g && /s$/.test(kern) && VORNAMEN.has(kern.slice(0, -1))) { kern = kern.slice(0, -1); genitivS = "s"; g = VORNAMEN.get(kern); }
    if (!g) continue;
    // Anrede am Satzanfang („Vera, komm!") bleibt — ein Pronomen wäre keine Anrede.
    if (/^,/.test(nach) && istSatzanfang(i)) continue;
    // Name mit Artikel davor („der Tom") ist ein Sonderfall — stehen lassen.
    let jPrev = i - 1; while (jPrev >= 0 && /^\s+$/.test(teile[jPrev] || "")) jPrev--;
    const prev = wort(jPrev).toLowerCase();
    if (/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)$/.test(prev)) continue;
    let jNext = i + 1; while (jNext < teile.length && /^\s+$/.test(teile[jNext] || "")) jNext++;
    const naechstes = teile[jNext] || "";
    let durch: string;
    if (genitivS && /^[A-ZÄÖÜ]/.test(naechstes)) durch = possessiv(g, naechstes);                 // Veras Mantel → ihr Mantel
    else if (DATIV.test(prev)) durch = PRON[g].dat;                                                  // mit Vera → mit ihr
    else if (AKKUSATIV.test(prev)) durch = PRON[g].akk;                                              // für Tom → für ihn
    else if (prev && !istSatzanfang(i) && istVerbform(prev) && !/^(ist|sind|war|bleibt|heißt|wird)$/.test(prev)) {
      // Nach einem Verb: „gibt Vera den Schlüssel" → Dativ (ein Objekt folgt);
      // „Am Abend kommt Tom." → Nominativ (Inversion, intransitives Verb am
      // Satzende); sonst Akkusativ („sieht Tom").
      const objektFolgt = /^(den|die|das|dem|der|ein|eine|einen|einem|einer|kein|keine|keinen|seinen|ihren|meinen|deinen)$/.test(wort(jNext).toLowerCase());
      const intransitiv = /^(kommt|geht|steht|bleibt|wartet|lacht|schweigt|sitzt|liegt|schläft|stirbt|fehlt|läuft|fällt|kehrt|erscheint|verschwindet|beginnt|endet|zögert|lächelt|weint|atmet|nickt|winkt|schreit|flieht|zittert|schaut|blickt|antwortet)$/.test(prev);
      const amEnde = !naechstes || /^[.!?…,;:]/.test(nach) && !objektFolgt;
      durch = objektFolgt ? PRON[g].dat : (intransitiv && amEnde) ? PRON[g].nom : PRON[g].akk;
    }
    else durch = PRON[g].nom;
    if (istSatzanfang(i)) durch = durch.charAt(0).toUpperCase() + durch.slice(1);
    ersetzt.push({ name: kern + genitivS, durch });
    teile[i] = vor + durch + nach;
  }
  return { text: teile.join(""), ersetzt };
}

/** Kurze Meldung für die Oberfläche: „3 Namen ersetzt: Vera → sie, Tom → ihn". */
export function namenMeldung(e: NamenErgebnis): string {
  if (!e.ersetzt.length) return "";
  const gesehen = new Map<string, string>();
  for (const x of e.ersetzt) if (!gesehen.has(x.name)) gesehen.set(x.name, x.durch.toLowerCase());
  return `${e.ersetzt.length} ${e.ersetzt.length === 1 ? "Name" : "Namen"} ersetzt: ${[...gesehen.entries()].slice(0, 4).map(([n, d]) => `${n} → ${d}`).join(", ")}${gesehen.size > 4 ? " …" : ""}`;
}
