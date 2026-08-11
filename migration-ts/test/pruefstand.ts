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
  "das Tief Ottilie",           // Wetterlage
  "Prof. Schwarz",              // Titel ohne Vornamen
];
const WAS = [
  "will den Konzern DAS GmbH schließen",   // singularer Begleiter vor -ern
  "produziert keine Lanzen mehr",          // zählbarer Plural
  "probt den Aufstand auf der Bühne",      // Genitiv/Präposition, kein Objekt
  "spielt für FC Liverpool",               // Sport
  "zeigt keine Opern mehr",                // Plural auf -ern
  "stellt den Betrieb ein",                // kein zählbares Objekt
  "will die Sonne ausknipsen",             // Singular auf -e hinter "die"
  "warnt vor schweren Gewittern",          // Dativ Plural, kein Objekt
  "bringt Dauerregen über die Küste",      // Einzahlwort auf -en
];
const WANN = ["Frühjahr 2001", "im Jahr 1855", "am Donnerstag", "2100", ""];
// Beide Blickrichtungen: "uplifting" meldet Gewinn, "dark" Verlust. Ein Bericht,
// der bei gutem Ton "betroffen sind" schreibt, ist so falsch wie umgekehrt.
const TOENE = ["uplifting", "dark"];
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
  ["Bezugswort passt nicht", /folgte (der Schritt, über die|die Entscheidung, über den)\b/],
  ["Artikel vor Titelnamen", /\b(Der|Die|Das) (Schwarz|Doll|Kraus|Lessing) \b/],
  // Kein blindes Muster fuer Zahlwoerter: "vor vier Tagen" steht im Faktenblatt
  // und ist erlaubt. Die Pruefung im Programm vergleicht gegen das Faktenblatt
  // und meldet nur, was dort NICHT steht - sie laeuft unten ohnehin mit.
  // \d+(?:\.\d+)* statt \d[\d.]*: Das erste Muster verschluckte den Satzpunkt und
  // traf "1902. Zeit beschleunigt sich" - dieselbe Falle wie bei "210." in der
  // Zahlenpruefung des Programms.
  ["Singular als Menge", /\b\d+(?:\.\d+)* (Sonne|Bühne|Konzern|Wahrheit|Zeit|Welt|Dauerregen|Gewittern|Regen|Boden|Wagen)\b/],
  ["Ort ohne Präposition", /\b(Wie es|wurde es) in (der|die|das) /],
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
  for (const ton of TOENE) {
    const ziel = 220;
    const preset = presets[i++ % presets.length]!;
    const ressort = RESSORT_IDS[i % RESSORT_IDS.length]!;
    const b = buildBericht(BUILTIN_PRESETS[preset] as Bank,
      { ...basis, who: wer, what: was, when: wann, where: wo, tone: ton, lenTarget: ziel } as GenInput, ressort);
    // Blickrichtung muss zum Ton passen.
    const gut = ton === "uplifting";
    if (gut && /betroffen sind|Auf dem Spiel|die erste Meldung/.test(b.text)) zaehl.set("Verlustwort bei gutem Ton", (zaehl.get("Verlustwort bei gutem Ton") || 0) + 1);
    if (!gut && /hinzukommen|In Aussicht|Profitieren werden/.test(b.text)) zaehl.set("Gewinnwort bei düsterem Ton", (zaehl.get("Gewinnwort bei düsterem Ton") || 0) + 1);
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

console.log(`Prüfstand Bericht: ${n} Läufe (${WER.length}×${WAS.length}×${WANN.length}×${WO.length}×${TOENE.length} Töne)`);
console.log(`  ${sauber} ohne Befund (${Math.round(100 * sauber / n)} %)`);
if (zaehl.size) {
  console.log(`  ${zaehl.size} Fehlerklassen:`);
  [...zaehl].sort((a, b2) => b2[1] - a[1]).forEach(([f, c]) =>
    console.log(`    ${String(c).padStart(4)}×  ${f}\n           bei: ${bsp.get(f)}`));
} else console.log("  keine Fehlerklasse ausgelöst");
