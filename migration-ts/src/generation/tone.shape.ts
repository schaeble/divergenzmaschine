// Ton wirkt nicht nur lexikalisch (Opener/Flavor), sondern gewichtet auch
// Satz-MUSTER: bevorzugter Rhythmus (Satzlängen-Profil) + ein Register, das in
// einem Nachlauf die Satzform anpasst (nüchtern flachlegen, ironisch brechen).
export type Register = "plain" | "lyrical" | "dark" | "wry" | null;

interface ToneShape { rhythm?: string; register?: Register; }

export const TONE_SHAPE: Record<string, ToneShape> = {
  neutral:       {},
  mystery:       { rhythm: "long" },
  poetic:        { rhythm: "breath", register: "lyrical" },
  melancholisch: { rhythm: "long", register: "lyrical" },
  dark:          { rhythm: "fracture", register: "dark" },
  unheimlich:    { rhythm: "fracture", register: "dark" },
  uplifting:     { rhythm: "clean" },
  zaertlich:     { rhythm: "breath", register: "lyrical" },
  traeumerisch:  { rhythm: "breath", register: "lyrical" },
  nuechtern:     { rhythm: "clean", register: "plain" },
  ironisch:      { rhythm: "clean", register: "wry" },
  humorous:      { rhythm: "staccato", register: "wry" },
};

export function toneRhythm(tone?: string): string | undefined {
  return tone ? TONE_SHAPE[tone]?.rhythm : undefined;
}
export function toneRegister(tone?: string): Register {
  return (tone && TONE_SHAPE[tone]?.register) || null;
}

const cap1 = (s: string): string => (s ? s[0]!.toUpperCase() + s.slice(1) : s);

/** Register-Nachlauf auf einen Prosatext (nach der Ton-Einfärbung). */
export function applyToneRegister(text: string, tone?: string): string {
  const reg = toneRegister(tone);
  if (!reg || !text) return text;

  if (reg === "plain") {
    // Flachlegen: lange, mit "und/aber/denn/während" verkettete Sätze in kurze
    // Aussagesätze trennen; ein paar lyrische Floskeln entfernen.
    let t = text
      .replace(/\b(gleichsam|wie Honig im Winter|wie ein halb vergessenes Gedicht[^.,;]*)\b/gi, "")
      .replace(/\s{2,}/g, " ");
    t = t.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      const out: string[] = [];
      for (const sen of sents) {
        const wc = sen.split(/\s+/).filter(Boolean).length;
        if (wc > 16) {
          const parts = sen.split(/,\s+(?=und |aber |denn |während |sodass |wobei )/);
          if (parts.length > 1) {
            parts.forEach((p, i) => {
              let seg = p.replace(/^,?\s*(und|aber|denn|während|sodass|wobei)\s+/i, "").trim();
              if (!seg) return;
              seg = cap1(seg);
              if (!/[.!?…]$/.test(seg)) seg += ".";
              out.push(i === 0 && /[.!?…]$/.test(p) ? cap1(p.trim()) : seg);
            });
            continue;
          }
        }
        out.push(sen);
      }
      return out.join(" ");
    }).join("\n\n");
    return t.replace(/\s+([,.;:!?…])/g, "$1").replace(/\s{2,}/g, " ").trim();
  }

  if (reg === "wry") {
    // Ironisches Register: an einige mittlere Aussagesätze einen trockenen
    // Nachsatz hängen, der die Aussage relativiert.
    // Geviertstrich wie überall im Text: Ein Halbgeviert („–") neben dem Geviert
    // („—") der Verschmelzung stand im Blatt in einem Satz nebeneinander.
    const tags = ["— angeblich.", "— so hieß es.", "— was auch immer das heißen sollte.", "— natürlich.", "— wie praktisch.", "— oder so ähnlich."];
    let ti = Math.floor(Math.random() * tags.length);
    return text.split(/\n\n+/).map((para) => {
      const sents = para.split(/(?<=[.!?…])\s+/);
      return sents.map((sen) => {
        const wc = sen.split(/\s+/).filter(Boolean).length;
        // nur schlichte Aussagesätze, kein Dialog/Klammern/Gedankenstrich, ~30%
        if (wc >= 5 && wc <= 18 && /[.]$/.test(sen) && !/[()"„:—–]/.test(sen) && Math.random() < 0.3) {
          const tag = tags[ti % tags.length]!; ti++;
          return sen.replace(/\.$/, " " + tag);
        }
        return sen;
      }).join(" ");
    }).join("\n\n");
  }

  return text; // lyrical/dark: Wortpools tragen bereits das Register
}
