const st={};global.localStorage={getItem:k=>st[k]??null,setItem:(k,v)=>{st[k]=String(v)},removeItem:k=>{delete st[k]}};global.window={localStorage:global.localStorage};
// Prüfstand für die Form „Bericht" (D.1 der Merkliste).
//
// Warum: Sechs Fehler in Folge hat der Benutzer gefunden, während meine Läufe
// „100 % ohne Befund" meldeten. Die Konsistenzprüfungen im Programm prüfen die
// Fakten — sie sehen keinen falschen Artikel, keine Kongruenz und keine
// bedeutungslose Zahl. Dieser Prüfstand prüft die SPRACHE, über eine Matrix
// absichtlich schwieriger Eingaben.
//
// Jeder Fehler, den der Benutzer je gefunden hat, steht hier als Muster. Damit
// kann er nicht zweimal auftreten, ohne dass es auffällt.

import { buildBericht, pruefeBericht } from "../src/generation/bericht";
import { RESSORT_IDS } from "../src/features/ressorts";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { GenInput, Bank } from "../src/types";

const WER = [
  "Dr. Ing. Richard Doll",      // Person mit Titeln
  "Reinhard Kraus",             // Person schlicht
  "die Ostmoor-Werft",          // Einrichtung mit Artikel
  "Ritter Ltd",                 // Einrichtung mit Rechtsform
  "FC Liverpool",               // Einrichtung ohne Artikel
  "das Stadttheater",           // Einrichtung neutrum
];
const WAS = [
  "will den Konzern DAS GmbH schließen",   // singularer Begleiter vor -ern
  "produziert keine Lanzen mehr",          // zählbarer Plural
  "probt den Aufstand auf der Bühne",      // Genitiv/Präposition, kein Objekt
  "spielt für FC Liverpool",               // Sport
  "zeigt keine Opern mehr",                // Plural auf -ern
  "stellt den Betrieb ein",                // kein zählbares Objekt
];
const WANN = ["Frühjahr 2001", "im Jahr 1855", "am Donnerstag", "2100", ""];
const WO = ["in Dürrhausen", "in London", "Ostmoor", ""];

/** Muster, die im fertigen Text NIE vorkommen dürfen. Jedes stammt aus einem
 *  Fehler, der einmal im Blatt stand. */
const VERBOTEN: [string, RegExp][] = [
  ["Artikel vor Rechtsform", /\b(der|die|das) (Ltd|GmbH|AG|SE|KG|Inc)\b/],
  ["Artikel vor Nachname", /\bDer (Doll|Kraus|Reimers|Rehm|Klasen|Vogt|Siewert|Brandes|Lohmann|Petersen|Kruse|Harmsen|Overbeck|Thiessen|Rademacher|Wendt|Möller|Sander)\b/],
  ["Person besteht seit", /\b(Doll|Kraus|Lessing|Travolta) besteht seit\b/],
  ["Kongruenz Einsatz", /Auf dem Spiel steht (die|der|das) \S*(plätze|stätten|zeiten|Stellen|bücher)\b/],
  ["Kongruenz Einsatz mehrfach", /Auf dem Spiel steht [^.]+ und /],
  ["Zeitangabe ohne Präposition", /(^|\n)[A-ZÄÖÜ][a-zäöüß]+ \d{4} (wurde|folgte)\b/],
  ["Nomen kleingeschrieben nach im", /\bIm [a-zäöüß]+ \d{4}\b/],
  ["literarische Einsatz-Formel", /Der Einsatz ist |Was zählt, ist |Alles dreht sich um /],
  ["Kopfsatz ohne Aussage", /\b\w+ (stellt fest|begreift|bemerkt|nimmt wahr)\.(\s|$)/],
  ["Rahmen mit zwei finiten Verben", /(Geblieben ist|Erinnert wird an|Im Ort verbindet man damit) [^.]*\b(ist|sind|wird|werden|hat|haben)\b[^.]*\./],
  ["doppelter Bildrahmen", /(Im Ort verbindet man damit)[^]*\1/],
  ["Genitiv Plural falsch", /die Hälfte der (Beschäftigte|Teilnehmende)\b/],
];

/** Prüfungen, die das Faktenblatt brauchen. */
function semantisch(text: string, fb: ReturnType<typeof buildBericht>["fb"]): string[] {
  const out: string[] = [];
  const z1 = fb.zahlen[0];
  if (z1 && z1.wert < 12) out.push(`Vorspannzahl zu klein (${z1.wert} ${z1.einheit})`);
  const a1 = fb.abgeleitet[0];
  if (a1 && z1 && Number(a1.wortform.replace(/\./g, "")) * 2 !== z1.wert) out.push("Ableitung geht nicht auf");
  if (a1 && z1 && z1.wert < 40) out.push("Ableitung aus zu kleiner Zahl");
  const jahre = fb.chronologie.map((c) => Number((c.zeit.match(/\b(1[0-9]{3}|2[0-9]{3})\b/) || [])[1])).filter(Number.isFinite);
  for (let i = 1; i < jahre.length; i++) if (jahre[i]! < jahre[i - 1]!) out.push("Jahreszahlen verdreht");
  if (fb.wer.art === "person" && /^(der|die|das) /i.test(fb.wer.kurz)) out.push("Artikel vor Personenname");
  if (text.split("\n\n").some((p) => p.trim().length < 12)) out.push("leerer Abschnitt");
  return out;
}

const presets = Object.keys(BUILTIN_PRESETS);
const basis = { tone: "neutral", varLevel: "wild", structure: "rekombination", mode: "auto",
  perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral",
  archetypeB: "neutral", instability: 2 } as unknown as GenInput;

const zaehl = new Map<string, number>();
const bsp = new Map<string, string>();
let n = 0, sauber = 0, i = 0;
for (const wer of WER) for (const was of WAS) for (const wann of WANN) for (const wo of WO)
  for (const ziel of [140, 300]) {
    const preset = presets[i++ % presets.length]!;
    const ressort = RESSORT_IDS[i % RESSORT_IDS.length]!;
    const b = buildBericht(BUILTIN_PRESETS[preset] as Bank,
      { ...basis, who: wer, what: was, when: wann, where: wo, lenTarget: ziel } as GenInput, ressort);
    n++;
    const funde: string[] = [];
    for (const [name, re] of VERBOTEN) if (re.test(b.text)) funde.push(name);
    funde.push(...semantisch(b.text, b.fb));
    funde.push(...pruefeBericht(b.text, b.fb, b.hergang).map((x) => x.art));
    if (!funde.length) { sauber++; continue; }
    for (const f of funde) {
      zaehl.set(f, (zaehl.get(f) || 0) + 1);
      if (!bsp.has(f)) bsp.set(f, `${wer} / ${was} / ${wann || "—"} / ${ressort}`);
    }
  }

console.log(`Prüfstand Bericht: ${n} Läufe (${WER.length}×${WAS.length}×${WANN.length}×${WO.length}×2)`);
console.log(`  ${sauber} ohne Befund (${Math.round(100 * sauber / n)} %)`);
if (zaehl.size) {
  console.log(`  ${zaehl.size} Fehlerklassen:`);
  [...zaehl].sort((a, b2) => b2[1] - a[1]).forEach(([f, c]) =>
    console.log(`    ${String(c).padStart(4)}×  ${f}\n           bei: ${bsp.get(f)}`));
} else console.log("  keine Fehlerklasse ausgelöst");
