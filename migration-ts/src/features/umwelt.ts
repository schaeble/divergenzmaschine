// Umwelt (Bauplan F): eine Liste aus Begriffen, Wörtern, Zahlenkombinationen oder
// Zeichen, die auf die AUSWAHL wirkt — nicht auf die Texterzeugung.
//
// Warum überhaupt: Eine feste Bewertungsformel hat ein Optimum, und ein Optimum
// wird gefunden und dann bewohnt. Eine Umwelt, die sich ändert, kann nicht
// bewohnt werden. Diese Fassung ist der erste Schritt davon — sie steht still,
// aber sie wirkt, und ob sie wirkt lässt sich messen.
//
// Verwandt, aber nicht dasselbe: Das Feld „Einbauwörter" (mustWords) im
// Auslese-Tab tut Ähnliches, gilt aber nur dort und ist unbeweglich.

export type UmweltWirkung = "aus" | "nahrung" | "gift";

export interface Umwelt {
  /** Rohtext, wie eingegeben — mit Komma oder Semikolon getrennt. */
  zeichen: string;
  wirkung: UmweltWirkung;
}

const KEY = "dm_umwelt_v1";
export const UMWELT_LEER: Umwelt = { zeichen: "", wirkung: "aus" };

export function loadUmwelt(): Umwelt {
  try {
    const r = localStorage.getItem(KEY);
    if (!r) return { ...UMWELT_LEER };
    const p = JSON.parse(r) as Partial<Umwelt>;
    const w = p.wirkung;
    return {
      zeichen: typeof p.zeichen === "string" ? p.zeichen : "",
      wirkung: w === "nahrung" || w === "gift" ? w : "aus",
    };
  } catch { return { ...UMWELT_LEER }; }
}

export function saveUmwelt(u: Umwelt): void {
  try { localStorage.setItem(KEY, JSON.stringify(u)); } catch { /* voll */ }
}

/** Zerlegt die Eingabe in einzelne Zeichenfolgen. Getrennt wird an Komma und
 *  Semikolon, nicht am Leerzeichen: „nasser Beton" ist EIN Eintrag. */
export function umweltTeile(zeichen: string): string[] {
  return (zeichen || "").split(/[,;]/).map((x) => x.trim()).filter((x) => x.length > 0);
}

/** Steht der Eintrag im Text?
 *
 *  Für Wörter mit Wortgrenze — sonst zählt „Frost" auch in „Frostschutz", und
 *  die Aufnahme wäre geschönt. Für alles, was Ziffern oder Sonderzeichen
 *  enthält, ohne Grenze: „7Z-49" und „∅" haben keine Wortgrenze im Sinne von
 *  \b, das Muster fände sie nie. */
export function stehtDrin(text: string, teil: string): boolean {
  const t = (text || "").toLowerCase();
  const p = teil.toLowerCase();
  if (!p) return false;
  const nurBuchstaben = /^[a-zäöüßA-ZÄÖÜ\s-]+$/.test(teil);
  if (!nurBuchstaben) return t.includes(p);
  try {
    const esc = p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return new RegExp("(?<![a-zäöüß])" + esc + "(?![a-zäöüß])", "i").test(t);
  } catch { return t.includes(p); }
}

/** Anteil der Einträge, die im Text vorkommen. 0..1, ohne Einträge 0. */
export function aufnahmequote(text: string, zeichen: string): number {
  const teile = umweltTeile(zeichen);
  if (!teile.length) return 0;
  let n = 0;
  for (const teil of teile) if (stehtDrin(text, teil)) n++;
  return n / teile.length;
}

// Gewicht der Umwelt in der Bewertung. Zum Vergleich: Längentreue bringt bis zu
// 30 Punkte, Wortvielfalt 25, die Neuheit gegen die Schatzkammer bis zu 20.
// 60 macht die Umwelt damit zur stärksten einzelnen Stimme — sie soll die
// Auswahl richten, nicht sie mitfärben.
export const UMWELT_GEWICHT = 60;

/** Beitrag der Umwelt zur Punktzahl eines Textes. */
export function umweltBeitrag(text: string, u: Umwelt | undefined): number {
  if (!u || u.wirkung === "aus") return 0;
  const teile = umweltTeile(u.zeichen);
  if (!teile.length) return 0;
  const q = aufnahmequote(text, u.zeichen);
  return u.wirkung === "nahrung" ? q * UMWELT_GEWICHT : -q * UMWELT_GEWICHT;
}
