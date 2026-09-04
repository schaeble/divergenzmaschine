// Prüfstand Infinitiv-Lexikon: generation/verblex.data.ts + kenntInfinitiv,
// infinitivZuStamm, istLexikonVerb (verben.ts) + praesensUmschreiben mit Lexikon.
//
// Punkt 2 des Zielbilds: Die drei Tabellen beugen ein Verb, das man ihnen
// gibt; diese vierte sagt, OB ein Wort eines ist. Hier steht, dass sie die
// ehrliche Grenze von 4.338.2 schließt ("kippten" vs. "halten"), ohne einen
// Präsens-Baustein zu beschädigen.
import { readFileSync } from "fs";
import { kenntInfinitiv, infinitivZuStamm, istLexikonVerb, istVerbform } from "../src/generation/verben";
import { praesensUmschreiben, isPastTense } from "../src/generation/coherence";
import { VERB_INFINITIVE } from "../src/generation/verblex.data";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { ERZAEHLUNGEN_VORLAGEN } from "../src/features/erzaehlungen.data";
import type { Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Das Lexikon ─────────────────────────────────────────────────────────
wahr("es trägt über tausend Grundverben", VERB_INFINITIVE.size > 1000, String(VERB_INFINITIVE.size));
wahr("Grundverb bekannt", kenntInfinitiv("kippen"));
wahr("mit Präfix bekannt", kenntInfinitiv("aufhören") && kenntInfinitiv("verstehen") && kenntInfinitiv("zurückkommen"));
wahr("Nomen und Adjektive unbekannt", !kenntInfinitiv("Wärme") && !kenntInfinitiv("violette") && !kenntInfinitiv("fest"));
ist("Stamm → Infinitiv (schwach)", infinitivZuStamm("kipp"), "kippen");
ist("Stamm → Infinitiv (-eln)", infinitivZuStamm("handel"), "handeln");
ist("Stamm → Infinitiv (stark, Umlaut)", infinitivZuStamm("trag"), "tragen");
ist("kein Verb → null", infinitivZuStamm("hal"), null);

// ── 2 · Formen erkennen ─────────────────────────────────────────────────────
for (const w of ["kippten", "kippen", "halten", "hielten", "warten", "wartete", "redeten", "aufgehört", "verstanden", "schwieg", "bestreitet", "zitiert", "bist"])
  wahr(`Verbform: ${w}`, istLexikonVerb(w));
for (const w of ["Sohlen", "violette", "fest", "besten", "Bilder", "längst", "damit"])
  wahr(`keine Verbform: ${w}`, !istLexikonVerb(w));
wahr("istVerbform nimmt das Lexikon als Zeugnis (kippten)", istVerbform("kippten"));

// ── 3 · Die ehrliche Grenze von 4.338.2 ist geschlossen ─────────────────────
ist("kippten → kippen", praesensUmschreiben("Dann kippten sie meistens geräuschvoll um.").text, "Dann kippen sie meistens geräuschvoll um.");
ist("halten bleibt halten", praesensUmschreiben("Und die Sohlen halten noch bis zur Grenze.").text, "Und die Sohlen halten noch bis zur Grenze.");
wahr("… und der Satz gilt nicht mehr als unklar", praesensUmschreiben("Und die Sohlen halten noch bis zur Grenze.").ok);
ist("machte → macht, Konjunktiv bleibt", praesensUmschreiben("Die Lampe machte Geräusche, als wäre sie nass.").text, "Die Lampe macht Geräusche, als wäre sie nass.");
ist("rette bleibt (Ich-Form eines t-Stamms)", praesensUmschreiben("Ich rette, was zu retten ist.").text, "Ich rette, was zu retten ist.");
ist("Partizip-Adjektiv vor Nomen bleibt", praesensUmschreiben("eine zerknitterte Visitenkarte").text, "eine zerknitterte Visitenkarte");
ist("verloren ohne Mehrzahl-Subjekt ist Partizip", praesensUmschreiben("ein Siegelring, verloren im Gras").text, "ein Siegelring, verloren im Gras");
ist("rannte mit Satzzeichen", praesensUmschreiben("Jemand rannte, ohne zu wissen, wohin.").text, "Jemand rennt, ohne zu wissen, wohin.");

// ── 4 · Gegenprobe: kein Präsens-Baustein wird beschädigt ───────────────────
{
  const alle: string[] = [];
  for (const b of Object.values(BUILTIN_PRESETS)) for (const l of Object.values(b as Bank)) for (const s of (l as string[])) alle.push(s);
  for (const e of ERZAEHLUNGEN_VORLAGEN) for (const s of e.text.split(/(?<=[.!?…])\s+/)) alle.push(s);
  // "Schaden" = ein verändertes Wort, das keine Präteritumform war.
  const PRAET = /(te|ten|test)$|^(war|waren|hatte|hatten|wurde|wurden|ging|gingen|kam|kamen|sah|sahen|gab|gaben|stand|standen|blieb|blieben|hielt|hielten|ließ|ließen|fand|fanden|nahm|nahmen|sprach|schrieb|trug|fuhr|lief|liefen|saß|lag|lagen|hieß|zog|zogen|rief|fiel|fielen|schlug|schlugen|traf|trafen|roch|schwieg|floss|stieg|sank|schloss|schlossen|verlor|verloren|begann|geschah|konnte|konnten|musste|wollte|sollte|durfte|wusste|dachte|brachte|kannte|nannte|rannte|wandte|sprang|schrie|flog|floh|riss|griff|schnitt|litt|trat|wuchs|schien|starb|brach|bog|hob|unterschrieb|verschwand|erschien|bot|mochte|galt|tat|hing|befahl|bestand|entstand|verstand|gewann|empfand|schob|band|wies|ward|schwoll|glitt|stieß)$/i;
  const schaden: string[] = [];
  for (const s of alle) {
    const r = praesensUmschreiben(s);
    if (r.text === s) continue;
    const a = s.split(/\s+/), b = r.text.split(/\s+/);
    for (let i = 0; i < a.length; i++) {
      if (a[i] === b[i]) continue;
      const w = (a[i] || "").replace(/[^A-Za-zÄÖÜäöüß]/g, "");
      if (!PRAET.test(w)) schaden.push(`${s} → ${r.text}`);
    }
  }
  ist(`kein Präsens-Wort in ${alle.length} Bausteinen beschädigt`, schaden.length, 0);
  if (schaden.length) schaden.slice(0, 5).forEach((x) => fails.push("   · " + x));
  const unklar = alle.filter((s) => !isPastTense(s) && !praesensUmschreiben(s).ok).length;
  wahr("höchstens fünf Präsens-Bausteine gelten als unklar", unklar <= 5, String(unklar));
}

console.log(`Prüfstand Infinitiv-Lexikon — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Infinitiv-Lexikon: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Infinitiv-Lexikon: alle ${geprueft} Prüfungen bestanden.`);
}
