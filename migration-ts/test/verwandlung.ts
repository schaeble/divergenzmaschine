// Prüfstand Motivverwandlung.
//
// Aus dem Vorschlag einer „Narrative DNA": „Telefon→Stille", „Katze→Schatten".
// Von allem, was so ein Format anbietet, ist das der einzige Teil, der reines
// MATERIAL ist statt einer Regel in Prosa — eine Liste von Paaren kann man
// aufschreiben und ausführen, „Ein Zufall erzeugt mindestens zwei neue Fragen"
// nicht.
//
// Die Zusage: Das ERSTE Vorkommen bleibt (es führt das Motiv ein), jedes
// weitere wird verwandelt.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { leseVerwandlungen, verwandleMotive, pruefePaar } from "../src/generation/verwandlung";
import { buildStory } from "../src/generation/buildStory";
import { buildBericht } from "../src/generation/bericht";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { BANK_KEYS } from "../src/constants";
import type { Bank, GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Paare lesen ────────────────────────────────────────────────────────
ist("der Pfeil darf auch -> heißen", leseVerwandlungen(["Regen -> Nebel"]).length, 1);
ist("und > ebenso", leseVerwandlungen(["Regen > Nebel"]).length, 1);
ist("ohne Pfeil kein Paar", leseVerwandlungen(["Regen Nebel"]).length, 0);
ist("eine leere Seite auch nicht", leseVerwandlungen(["Regen→"]).length, 0);
ist("und ein Wort in sich selbst erst recht nicht", leseVerwandlungen(["Regen→regen"]).length, 0);
ist("nichts ergibt nichts", leseVerwandlungen(undefined).length, 0);

// ── 2 · Beide Wörter brauchen dasselbe Geschlecht ─────────────────────────
// Sonst steht im Text „das Stille": Der Artikel davor wird nicht mitverwandelt,
// und ihn mitzuändern ginge nur halb — aus „das" ließe sich nicht ablesen, ob
// Nominativ oder Akkusativ gemeint war.
ist("gleiches Geschlecht wird angenommen", pruefePaar("Regen→Nebel").ok, true);
// Und das Lesen richtet sich danach — nicht nur die Prüfung. Sonst ließe sich
// die Regel aus leseVerwandlungen entfernen, ohne dass eine Prüfung es merkt.
ist("ungleiches Geschlecht wird beim Lesen verworfen", leseVerwandlungen(["Telefon→Stille"]).length, 0);
ist("gleiches nicht", leseVerwandlungen(["Regen→Nebel"]).length, 1);
ist("und ein unbekanntes Wort ebenfalls nicht", leseVerwandlungen(["Blubb→Nebel"]).length, 0);
ist("verschiedenes nicht", pruefePaar("Telefon→Stille").ok, false);
wahr("und der Grund wird genannt", pruefePaar("Telefon→Stille").grund.includes("Geschlecht"));
// „Zwirbelgerät" taugt als Beispiel NICHT: Die Endungsregel liest das -t und
// rät neutrum. Ein wirklich unbekanntes Wort hat keine bekannte Endung.
ist("ein unbekanntes Wort wird abgelehnt", pruefePaar("Blubb→Nebel").ok, false);
wahr("auch dafür gibt es einen Grund", pruefePaar("Blubb→Nebel").grund.includes("unbekannt"));
// Mehrwortige Ziele: Das letzte Wort trägt das Genus.
ist("das Grundwort entscheidet", pruefePaar("Regen→dichter Nebel").ok, true);

// ── 3 · Das erste Vorkommen bleibt ────────────────────────────────────────
const P = leseVerwandlungen(["Regen→Nebel"]);
ist("einmal genannt bleibt unverwandelt", verwandleMotive("Der Regen fällt.", P), "Der Regen fällt.");
ist("das zweite Mal wird verwandelt",
  verwandleMotive("Der Regen fällt. Später der Regen.", P), "Der Regen fällt. Später der Nebel.");
ist("und jedes weitere auch",
  verwandleMotive("Regen. Regen. Regen.", P), "Regen. Nebel. Nebel.");
// Groß und klein: Ein Motiv am Satzanfang steht groß, mitten im Satz klein.
ist("die Schreibung der Fundstelle bleibt",
  verwandleMotive("Regen fällt. Es beginnt regen.", P), "Regen fällt. Es beginnt nebel.");
// Wortgrenzen: „Regenbogen" ist kein Regen.
ist("kein Treffer in einer Zusammensetzung",
  verwandleMotive("Der Regen kommt. Ein Regenbogen steht da.", P),
  "Der Regen kommt. Ein Regenbogen steht da.");
// Und die ASCII-Falle: \b sieht zwischen „F" und „ü" eine Wortgrenze.
{
  const U = leseVerwandlungen(["Fürst→Ritter"]);
  ist("Umlaute am Wortanfang stören nicht",
    verwandleMotive("Der Fürst kommt. Dann der Fürst.", U), "Der Fürst kommt. Dann der Ritter.");
}
ist("ohne Paare bleibt alles", verwandleMotive("Der Regen fällt.", []), "Der Regen fällt.");

// ── 4 · Am fertigen Text ──────────────────────────────────────────────────
// Der Beleg, dass es überhaupt etwas zu verwandeln gibt: In 85 % der Texte
// kommt mindestens ein Motivwort doppelt vor.
{
  const b = BUILTIN_PRESETS["philosophie"] as Bank;
  const paare = leseVerwandlungen(b.verwandlungen);
  wahr(`das Preset führt Verwandlungen (${paare.length})`, paare.length >= 8);
  ist("und alle werden angenommen", paare.length, (b.verwandlungen || []).length);
  const ohne = { ...b } as Bank; delete ohne.verwandlungen;
  let mit = 0;
  for (let i = 0; i < 60; i++) {
    const roh = buildStory(ohne, {
      where: "im Hörsaal", when: "am Abend", who: "die Denkerin", what: "sucht einen Grund",
      tone: "nuechtern", form: "prose", lenTarget: 220, tension: "off", cast: "auto", mode: "auto",
      structure: i % 2 ? "rekombination" : "linear", perspective: "third", rhythm: "clean",
      disruptor: "off", instability: 0, markovMode: "off", varLevel: "mid",
      archetypeA: "neutral", archetypeB: "neutral",
    } as unknown as GenInput);
    if (verwandleMotive(roh, paare) !== roh) mit++;
  }
  wahr(`sie greifen in den meisten Texten (${mit}/60)`, mit >= 40);
}

// ── 5 · `verwandlungen` ist KEINE Textkategorie ───────────────────────────
// Sie steht in der Bank, gehört aber nicht in den Text. Wäre sie eine
// Kategorie, stünde „Bibliothek→Sammlung" als Satz im Blatt.
{
  const b = BUILTIN_PRESETS["philosophie"] as Bank;
  wahr("sie ist kein Kategorie-Schlüssel", !(BANK_KEYS as string[]).includes("verwandlungen"));
  let drin = 0;
  for (let i = 0; i < 30; i++) {
    const t = buildStory(b, {
      where: "im Hörsaal", when: "am Abend", who: "die Denkerin", what: "sucht einen Grund",
      tone: "nuechtern", form: "prose", lenTarget: 200, tension: "off", cast: "auto", mode: "auto",
      structure: "rekombination", perspective: "third", rhythm: "clean", disruptor: "off",
      instability: 0, markovMode: "off", varLevel: "mid", archetypeA: "neutral", archetypeB: "neutral",
    } as unknown as GenInput);
    if (/→|->/.test(t)) drin++;
  }
  ist("kein Pfeil steht im fertigen Text", drin, 0);
}

// ── 6 · Das Preset Philosophie ────────────────────────────────────────────
// Gefragt war MEHR MASSE. Der Median aller Presets liegt bei 48 Einträgen —
// und die Wortbank ist an drei Stellen gemessen die Decke: Bei einem einzelnen
// Preset endet der Bericht bei 43 % einer 600-Wörter-Vorgabe, bei zehn
// vereinten bei 74 %.
{
  const b = BUILTIN_PRESETS["philosophie"] as Bank;
  const n = BANK_KEYS.reduce((s, k) => s + (b[k] || []).length, 0);
  wahr(`Philosophie trägt ${n} Einträge`, n >= 140);
  for (const k of BANK_KEYS) {
    wahr(`${k}: mindestens zwölf Einträge (${(b[k] || []).length})`, (b[k] || []).length >= 12);
  }
  // Keine Dubletten — ein Eintrag zweimal ist kein zweiter Eintrag.
  for (const k of BANK_KEYS) {
    const arr = (b[k] || []).map((x) => x.trim().toLowerCase());
    ist(`${k}: ohne Dubletten`, arr.length - new Set(arr).size, 0);
  }

  // Und der Beleg, wofür die Masse gut ist. Gemessen liegt der Knick bei rund
  // 120 Einträgen: 44 Einträge → 56 % der Vorgabe, 89 → 66 %, 112 → 87 %,
  // 147 → 95 %. Darüber gewinnt man fast nichts mehr, darunter bricht es ein.
  //
  // Bemerkenswert: Ein Preset AUS EINER HAND schlägt bei gleicher Größe eine
  // Mischung aus dreien (95 % gegen 84 %). Nicht die Menge allein zählt,
  // sondern dass das Material zusammenpasst — der Assembler verwirft weniger,
  // wenn Kasus, Tempus und Ton der Bausteine zueinander finden.
  const W = (x: string): number => x.split(/\s+/).filter(Boolean).length;
  let woerter = 0;
  const N = 25;
  for (let i = 0; i < N; i++) {
    const e = buildBericht(b, {
      where: "an der Unterelbe", when: "im Herbst 1923", who: "die Ostmoor-Werft",
      what: "meldet einen Vorfall", tone: "nuechtern", form: "bericht", lenTarget: 450,
      mode: "auto", structure: "linear", perspective: "third", rhythm: "auto", disruptor: "off",
      instability: 0, markovMode: "off", varLevel: "wild", archetypeA: "neutral", archetypeB: "neutral",
    } as unknown as GenInput, "wirtschaft");
    woerter += W(typeof e === "string" ? e : (e as { text: string }).text);
  }
  const treue = woerter / N / 450;
  wahr(`Philosophie allein trägt einen 450-Wörter-Bericht (${Math.round(treue * 100)} %)`, treue >= 0.85);
}

// ── 7 · Der Ausbau der Presets ────────────────────────────────────────────
// Ziel: jedes Preset auf rund 120 Einträge, aus EINER Hand. Der Fortschritt
// steht hier, damit er sichtbar bleibt — und was einmal ausgebaut ist, darf
// nicht wieder schrumpfen.
{
  const gross = Object.keys(BUILTIN_PRESETS).filter((id) => {
    const b = BUILTIN_PRESETS[id] as Bank;
    return BANK_KEYS.reduce((s, k) => s + (b[k] || []).length, 0) >= 120;
  });
  console.log(`  Ausgebaut (120+): ${gross.length} von ${Object.keys(BUILTIN_PRESETS).length} — ${gross.join(", ")}`);
  // NACHTRAG 4.277.0: Die Zahl 120 zählt Einträge und sagt wenig voraus. Über
  // diese Presets gemessen liegt der Zusammenhang zwischen der WORTZAHL der Bank
  // und der erreichten Berichtslänge bei r = 0,80, der zwischen Eintragszahl und
  // Länge nahe null. jugendsprache: 123 Einträge, 557 Wörter, 72 %. bergwelt:
  // 128 Einträge, 923 Wörter, 108 %. Rund 850 Wörter braucht ein Preset für
  // volle Treue — sieben je Eintrag. Die Zahl steht seit 4.277.0 im KI-Auftrag.
  {
    const arm = gross.map((n) => {
      const b = BUILTIN_PRESETS[n] as Bank;
      let w = 0;
      for (const [k, v] of Object.entries(b)) { if (k === "verwandlungen") continue;
        for (const e of v as string[]) w += String(e).split(/\s+/).filter(Boolean).length; }
      return { n, w };
    }).sort((a, b) => a.w - b.w);
    console.log(`  Wortzahl der ausgebauten Presets: ${arm[0]!.w} bis ${arm[arm.length - 1]!.w}` +
      ` — am dünnsten ${arm.slice(0, 3).map((x) => `${x.n} (${x.w})`).join(", ")}`);
    // NACHTRAG 4.278.0: Die fünf dünnsten wurden nachverdichtet, und dabei wurde
    // gemessen, WO Wörter zählen. Zwei Presets bekamen nur in den SATZ-Kategorien
    // (hooks, turns, obstacles, endings) mehr Wörter, zwei nur in den
    // NOMINAL-Kategorien (motifs, props, stakes):
    //
    //   urknall  (Satz)    623 → 855 Wörter,  89,3 → 107,3 %  = 7,8 Punkte je 100 Wörter
    //   dickens  (Satz)    634 → 814,          90,9 → 110,2   = 10,7
    //   alltag   (Nomen)   624 → 793,          83,5 →  94,2   = 6,3
    //   hafen    (Nomen)   640 → 770,          88,1 →  95,2   = 5,5
    //   jugendsprache (beides) 557 → 765,      72,1 →  93,6   = 10,3
    //
    // Ein Wort in einer Satz-Kategorie ist rund 1,6-mal so viel wert wie eines in
    // einer Nominal-Kategorie. Zwei Presets je Gruppe sind eine erste Messung und
    // kein Gesetz — aber es ist eine EINGRIFFS-Messung, keine Korrelation: Es
    // wurde je Gruppe genau eine Sache geändert.
    // Die Schranke steht bei 650 und nicht bei 850. 850 ist das ZIEL, 650 ist der
    // Boden: Diese Prüfung soll merken, wenn jemand Material kürzt, nicht das Ziel
    // erzwingen, das noch nicht überall erreicht ist. Heute am dünnsten: geologie
    // (688), freud (695), biologie (710) — das sind die nächsten drei.
    wahr(`kein ausgebautes Preset unter 650 Wörtern (dünnstes: ${arm[0]!.n} mit ${arm[0]!.w})`, arm[0]!.w >= 650);
  }
  wahr(`mindestens fünf Presets sind ausgebaut (${gross.length})`, gross.length >= 5);

  // Jedes ausgebaute Preset muss die Länge auch WIRKLICH tragen. Einträge zu
  // zählen ist keine Messung; 120 Zeilen Füllmaterial wären keine 120 Einträge.
  const W = (x: string): number => x.split(/\s+/).filter(Boolean).length;
  for (const id of gross) {
    const b = BUILTIN_PRESETS[id] as Bank;
    let w = 0;
    const N = 15;
    for (let i = 0; i < N; i++) {
      w += W(buildStory(b, {
        where: "im Hof", when: "am Abend", who: "die Wartende", what: "sucht eine Auskunft",
        tone: "nuechtern", form: "prose", lenTarget: 400, tension: "off", cast: "auto", mode: "auto",
        structure: "rekombination", perspective: "third", rhythm: "clean", disruptor: "off",
        instability: 0, markovMode: "off", varLevel: "mid", archetypeA: "neutral", archetypeB: "neutral",
      } as unknown as GenInput));
    }
    const treue2 = w / N / 400;
    wahr(`${id} trägt 400 Wörter Prosa (${Math.round(treue2 * 100)} %)`, treue2 >= 0.8);
    // Und keine Dubletten — beim Ausbauen ist das die häufigste Nachlässigkeit.
    for (const k of BANK_KEYS) {
      const arr = (b[k] || []).map((x) => x.trim().toLowerCase());
      ist(`${id}.${k}: ohne Dubletten`, arr.length - new Set(arr).size, 0);
    }
  }
}


// ── 8 · Jedes geschriebene Paar muss auch wirken ──────────────────────────
// `leseVerwandlungen` wirft ein Paar mit ungleichem oder unbekanntem Geschlecht
// STILL weg — richtig für die Laufzeit, falsch für den, der das Material
// schreibt: Er sieht ein Paar im Preset stehen und im Text nie eine Wirkung.
//
// Beim Ausbau dieses Stapels hat genau das zugeschlagen: 18 von 53 neu
// geschriebenen Paaren fielen durch. Die meisten, weil ein Wort in der
// Genustabelle fehlte — das ist Fleißarbeit und wurde nachgetragen.
//
// Zwei fielen aus einem anderen Grund durch, den kein bestehender Prüfstand
// gefunden hätte: `guessGender` hat FALSCH geraten, nicht gar nicht. Die
// Kompositumsregel sucht das längste bekannte Wortende. In „Direktor" findet
// sie „Tor" (sächlich), in „Gestein" findet sie „Stein" (maskulin). Beides ist
// falsch, und beides bleibt still: Ein fehlendes Genus lässt den Artikel weg,
// ein falsches schreibt „der Gestein" mitten in den Satz. Gemessen an allen
// 2275 Nomen aller Presets betrifft das 3 von 20 geratenen Ge-Wörtern und 1 von
// 6 -or-Wörtern — zu wenig für eine neue Regel, genug für Einträge in der
// Tabelle. Wer die Regel doch anfasst: Die Fehlgriffe stehen dort, wo der
// Wortanfang KEIN Bestimmungswort ist („Ge-", „Direk-").
{
  let paare = 0;
  const durchgefallen: string[] = [];
  for (const [name, bank] of Object.entries(BUILTIN_PRESETS)) {
    for (const p of ((bank as Bank).verwandlungen || [])) {
      paare++;
      const r = pruefePaar(p);
      if (!r.ok) durchgefallen.push(`${name}: ${p} (${r.grund})`);
    }
  }
  wahr(`es gibt überhaupt Paare (${paare})`, paare >= 40);
  ist("kein eingebautes Paar fällt durch", durchgefallen.join(" · "), "");
}

console.log(`Prüfstand Verwandlung — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Verwandlung: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Verwandlung: alle ${geprueft} Prüfungen bestanden.`);
}
