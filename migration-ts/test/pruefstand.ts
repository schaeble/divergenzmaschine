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
import { RESSORT_IDS, RESSORTS } from "../src/features/ressorts";
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
  // Aus der Ausgabe „Zeitzeichen" vom 21.08.2026, alle vier im selben Blatt:
  ["Gattungsperson besteht seit", /\b(Schulmädchen|Kind|Junge|Mädchen|Frau|Mann|Wächter|Nachbar) besteht seit\b/],
  ["Kurzform ohne Artikel", /(^|\. )(Schulmädchen|Mädchen|Junge|Kind|Wächter) (ist seit|besteht seit)\b/],
  ["Ich-Form im Bericht", /(^|\. )(Ich|Wir) (bin|bins|sehne|will|weiß|kenne|erinnere|liege|gehe|sehe|höre|fühle|habe|muss)\b/],
  ["Du-Form im Bericht", /(^|\. )(Du|Dein|Deine) \w+/],
  ["Kasus nach mit", /\bmit (der|dem) erste (Meldung|Anfrage|Beschwerde|Zusage)\b/],
];

/** Zwei gleiche Sätze hintereinander. Im Blatt stand „Jemand hat an etwas
 *  gedacht. Jemand hat an etwas gedacht." — die Sperre merkte sich den ROHEN
 *  Eintrag, gedruckt wurde der um Satzzeichen gekürzte, und zwei Einträge, die
 *  sich nur im Schlusspunkt unterschieden, kamen beide durch. */
function satzDublette(text: string): string | null {
  const saetze = text.split(/(?<!\d)[.!?](?=\s|$)/)
    .map((x) => x.trim().toLowerCase().replace(/[.!?…,;:]+/g, "").replace(/\s+/g, " "))
    .filter((x) => x.length > 12);
  for (let i = 1; i < saetze.length; i++) if (saetze[i] === saetze[i - 1]) return saetze[i]!;
  return null;
}

/** Der Vorspann darf die Schlagzeile nicht wörtlich wiederholen. Tut er es,
 *  streicht der Setzer ihn als Dublette — und der Bericht beginnt mit einer
 *  Passivkonstruktion ohne Subjekt: „Während der Mittagspause wurde bekannt,
 *  dass rund 1.300 Haushalte betroffen sind." Wer? Stand nur in der
 *  Überschrift. */
function vorspannWiederholtSchlagzeile(text: string): boolean {
  const abs = text.split(/\n{2,}/).map((x) => x.trim()).filter(Boolean);
  const zeile = (abs[1] || "").toLowerCase().replace(/[.!?…\s]+$/, "").trim();
  const vor = (abs[2] || "").split(/(?<!\d)[.!?](?=\s|$)/)[0]?.toLowerCase().replace(/[.!?…\s]+$/, "").trim() || "";
  return !!zeile && zeile.length > 8 && vor === zeile;
}

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
  // Der ERSTE Abschnitt ist die Dachzeile. Sie darf kurz sein — „Bildung" ist
  // eine gültige Dachzeile, wenn kein brauchbarer Ort vorliegt. Vorher stand
  // dort der Platzhalter „der Ort · Bildung", und der war lang genug, um dieser
  // Regel zu entgehen. Statt der Länge wird die Dachzeile jetzt auf das geprüft,
  // worauf es ankommt: kein Platzhalter, eine Zeile.
  const teile = text.split("\n\n");
  const dach = (teile[0] || "").trim();
  if (/\b(der|am) Ort\b/.test(dach)) out.push("Platzhalter in der Dachzeile");
  if (dach.length > 46 || dach.includes("\n")) out.push("Dachzeile zu lang");
  if (teile.slice(1).some((p) => p.trim().length < 12)) out.push("leerer Abschnitt");
  return out;
}

const presets = Object.keys(BUILTIN_PRESETS);
const basis = { tone: "neutral", varLevel: "wild", structure: "rekombination", mode: "auto",
  perspective: "third", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral",
  archetypeB: "neutral", instability: 2 } as unknown as GenInput;

const zaehl = new Map<string, number>();
const chronoZeilen = new Map<string, number>();
const aufzaehlungen = new Map<string, number>();
const texte: string[] = [];
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
    if (satzDublette(b.text)) funde.push("derselbe Satz zweimal hintereinander");
    if (vorspannWiederholtSchlagzeile(b.text)) funde.push("Vorspann wiederholt die Schlagzeile");
    // Der Chronologiesatz stand wörtlich in jedem Bericht. Gezählt wird er
    // hier, ausgewertet unten als ANTEIL — ein einzelnes Vorkommen ist kein
    // Fehler, dieselbe Zeile in jedem Bericht schon.
    const chron = b.text.match(/(Im |Vor |Kurz |Angefangen)[^.]*?(erste (Meldung|Anfrage|Beschwerde|Zusage|Zweifel|Hinweis)|erstes? (Gerücht|Angebot|Interesse|Zuspruch|Unterstützung))[^.]*\./);
    if (chron) chronoZeilen.set(chron[0], (chronoZeilen.get(chron[0]) || 0) + 1);
    const auf = b.text.match(/(Betroffen sind außerdem|Profitieren werden außerdem)[^.]*\./);
    if (auf) aufzaehlungen.set(auf[0], (aufzaehlungen.get(auf[0]) || 0) + 1);
    if (texte.length < 400) texte.push(b.text);
    funde.push(...semantisch(b.text, b.fb));
    funde.push(...pruefeBericht(b.text, b.fb, b.hergang).map((x) => x.art));
    if (!funde.length) { sauber++; continue; }
    for (const f of funde) {
      zaehl.set(f, (zaehl.get(f) || 0) + 1);
      if (!bsp.has(f)) bsp.set(f, `${wer} / ${was} / ${wann || "—"} / ${ressort}`);
    }
  }

// Bisher hat dieser Prüfstand nur GEMELDET. Ein Lauf mit Befunden lief grün
// durch, weil er den Rückgabewert nie setzte — eine Sperre, die nie zuschlägt.
let fehler = false;
console.log(`Prüfstand Bericht: ${n} Läufe (${WER.length}×${WAS.length}×${WANN.length}×${WO.length}×${TOENE.length} Töne)`);
console.log(`  ${sauber} ohne Befund (${Math.round(100 * sauber / n)} %)`);
if (zaehl.size) {
  console.log(`  ${zaehl.size} Fehlerklassen:`);
  [...zaehl].sort((a, b2) => b2[1] - a[1]).forEach(([f, c]) =>
    console.log(`    ${String(c).padStart(4)}×  ${f}\n           bei: ${bsp.get(f)}`));
  fehler = true;
} else console.log("  keine Fehlerklasse ausgelöst");

// Wie viel vom Bericht ist Fakt, wie viel Vorratsbild? Der Eindruck „Rauschen
// zwischen den Fakten" hat eine Zahl: den Anteil der Sätze OHNE Faktenmarke.
// Er darf nicht überwiegen — sonst ist es kein Bericht mehr, sondern Prosa mit
// Zahlen darin.
{
  const marke = /\d|Betroffen|Auf dem Spiel|In Aussicht|Profitieren|folgte|zeichnete|Angefangen|gab es|kam die|Gemessen|Es geht um|ist seit|besteht seit|sagte|Bekannt wurde|entsteht im ersten Jahr/;
  let ohne = 0, gesamt = 0;
  for (const t of texte) {
    for (const satz of t.split(/(?<!\d)[.!?](?=\s|$)/)) {
      const x = satz.trim();
      if (x.length < 12) continue;
      gesamt++;
      if (!marke.test(x)) ohne++;
    }
  }
  const anteil = gesamt ? ohne / gesamt : 0;
  console.log(`  Vorratsanteil: ${Math.round(anteil * 100)} % der Sätze ohne Faktenmarke`);
  if (anteil > 0.6) {
    console.error(`\n❌ ${Math.round(anteil * 100)} % der Sätze tragen keinen Fakt — das ist kein Bericht mehr.`);
    fehler = true;
  }
}

// Der Ressort-Vorrat: Zu kleine Listen ergeben in jedem Bericht desselben
// Ressorts dieselbe Aufzählung. Im Blatt stand dreimal „Betroffen sind
// außerdem die Nachbarschaft, die Beratungsstelle, die Familien und das
// Ehrenamt" — bei fünf Einträgen gibt es kaum etwas anderes zu sagen.
{
  const zuKlein: string[] = [];
  for (const id of RESSORT_IDS) {
    const r = RESSORTS[id];
    if (r.betroffen.length < 9) zuKlein.push(`${id}.betroffen ${r.betroffen.length}`);
    if (r.einsatz.length < 8) zuKlein.push(`${id}.einsatz ${r.einsatz.length}`);
    if (r.gewinn.length < 6) zuKlein.push(`${id}.gewinn ${r.gewinn.length}`);
    if (r.zusatz.rahmen.length < 5) zuKlein.push(`${id}.rahmen ${r.zusatz.rahmen.length}`);
    if (r.ausblick.length < 4) zuKlein.push(`${id}.ausblick ${r.ausblick.length}`);
    // Dubletten INNERHALB einer Liste. Über die Listen hinweg ist eine
    // Wiederholung richtig: „das Ehrenamt" kann betroffen sein UND auf dem
    // Spiel stehen — das ist nicht dasselbe.
    for (const [feld, werte] of [
      ["betroffen", r.betroffen],
      ["einsatz", r.einsatz.map((x) => x.t)],
      ["gewinn", r.gewinn.map((x) => x.t)],
      ["rahmen", r.zusatz.rahmen],
      ["ausblick", r.ausblick],
    ] as [string, string[]][]) {
      if (new Set(werte).size !== werte.length) zuKlein.push(`${id}.${feld}: Dublette`);
    }
  }
  console.log(`  Ressort-Vorrat: ${zuKlein.length ? zuKlein.join(", ") : "alle Listen groß genug"}`);
  if (zuKlein.length) { console.error(`\n❌ Ressort-Vorrat zu klein: ${zuKlein.join(", ")}`); fehler = true; }
}

// Die Aufzählung „Betroffen sind außerdem …" darf sich nicht in jedem Bericht
// desselben Ressorts wiederholen.
{
  const haeufigste = [...aufzaehlungen.entries()].sort((a, b) => b[1] - a[1])[0];
  const gesamt = [...aufzaehlungen.values()].reduce((a, b) => a + b, 0);
  const anteil = gesamt && haeufigste ? haeufigste[1] / gesamt : 0;
  console.log(`  „Betroffen sind außerdem": ${aufzaehlungen.size} Fassungen, häufigste ${Math.round(anteil * 100)} %`);
  if (anteil > 0.15) {
    console.error(`\n❌ Dieselbe Aufzählung in ${Math.round(anteil * 100)} % der Berichte: „${haeufigste?.[0]}"`);
    fehler = true;
  }
}

// Die Vorgeschichte darf nicht in jedem Bericht gleich lauten. Vorher standen
// „im Frühjahr" und „die erste Meldung" als Konstanten im Faktenblatt — in
// einer Ausgabe mit acht Beiträgen viermal wörtlich derselbe Satz.
{
  const gesamt = [...chronoZeilen.values()].reduce((a, b) => a + b, 0);
  const haeufigste = [...chronoZeilen.entries()].sort((a, b) => b[1] - a[1])[0];
  const anteil = gesamt ? (haeufigste ? haeufigste[1] / gesamt : 0) : 0;
  console.log(`  Vorgeschichte: ${chronoZeilen.size} verschiedene Fassungen, häufigste ${Math.round(anteil * 100)} %`);
  if (anteil > 0.35) {
    console.error(`\n❌ Die Vorgeschichte lautet in ${Math.round(anteil * 100)} % der Berichte gleich: „${haeufigste?.[0]}"`);
    fehler = true;
  }
}

const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fehler) {
  console.error(`\n❌ Bericht: ${zaehl.size} Fehlerklasse(n) in ${n} Läufen.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Bericht: ${n} Läufe ohne Befund.`);
}
