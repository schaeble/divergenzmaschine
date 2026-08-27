// Prüfstand Nr. 44: die fünf Reparaturen aus der Analyse von Ausgabe 44.
//
// Jede Prüfung hier steht für eine Stelle, die im gedruckten Blatt zu lesen
// war. Wer eine davon wieder ausbaut, merkt es hier und nicht erst in der
// nächsten Ausgabe.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { buildStory } from "../src/generation/buildStory";
import { entferneDubletten } from "../src/generation/shape";
import { splitSpeakers, istEigenePerson } from "../src/generation/wordcls";
import { normWho, normWhere } from "../src/generation/ctxnorm";
import { WHO_TWISTS } from "../src/generation/ideas.data";
import { corpusSanitize, GERUEST_ZEILE } from "../src/corpus";
import { dachOrt, kurzPerson, formeWas } from "../src/features/faktenblatt";
import { istEinrichtung } from "../src/generation/bericht";
import { schliesseFigurenkomma } from "../src/generation/postprocess";
import { wasPhrase } from "../src/features/wikisammler";
import { kuerzeAmBruch } from "../src/text-utils";
import { buildMeldung, pruefeMeldung, tragtPraedikat } from "../src/generation/meldung";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank, GenInput } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── § 4 · Satzdubletten ────────────────────────────────────────────────────
// Im Blatt: „Aus Symmetrie wird Unterschied — Aus Symmetrie wird Unterschied."
// Gemessen vorher: 22 von 200 Texten (11 %).
ist("zwei gleiche Nachbarsätze werden einer",
  entferneDubletten("Flüsse als Adern. Flüsse als Adern. Der Rest bleibt."),
  "Flüsse als Adern. Der Rest bleibt.");
ist("auch die verkleidete Dublette mit Gedankenstrich",
  entferneDubletten("Aus Symmetrie wird Unterschied — Aus Symmetrie wird Unterschied. Weiter."),
  "Aus Symmetrie wird Unterschied. Weiter.");
ist("eine Wiederholung MIT Abstand bleibt — sie ist ein Mittel",
  entferneDubletten("Der Kreis schließt sich. Etwas dazwischen. Der Kreis schließt sich."),
  "Der Kreis schließt sich. Etwas dazwischen. Der Kreis schließt sich.");
ist("und ein einzelner Satz bleibt unangetastet",
  entferneDubletten("Nur ein Satz."), "Nur ein Satz.");

// ── § 1 · Der Figuren-Zusatz ist keine zweite Figur ────────────────────────
// Im Blatt: „Voller ungestellter Fragen tritt einen Schritt zurück."
{
  const durch = WHO_TWISTS.filter((t) => splitSpeakers(`eine Archivarin ohne Namen, ${t}`).length > 1);
  ist("kein Figuren-Zusatz wird zur zweiten Figur", durch.join(", "), "");
  wahr(`es gibt überhaupt Zusätze (${WHO_TWISTS.length})`, WHO_TWISTS.length >= 15);
  // Gegenrichtung: echte zweite Personen müssen zwei bleiben.
  for (const [w, n] of [["Baucis, Philemon", 2], ["die Archivarin, der Fährmann", 2],
    ["Tom, die alten Frauen", 2], ["baucis, philemon", 2],
    ["eine Nonne, die die Welt bereist hat", 1], ["ein Mann, während der Nacht", 1],
    ["die Wächterin, mit einem fremden Koffer", 1]] as [string, number][]) {
    ist(`„${w}“`, splitSpeakers(w).length, n);
  }
  wahr("ein Zusatz gilt nicht als eigene Person", !istEigenePerson("voller ungestellter Fragen"));
  wahr("ein Name schon", istEigenePerson("Philemon"));
  ist("und der Zusatz wird nicht großgeschrieben",
    normWho("eine Archivarin ohne Namen, voller ungestellter Fragen"),
    "Eine Archivarin ohne Namen, voller ungestellter Fragen");
}

// ── § 3 · Das Gerüst der eigenen Ausgabe im Korpus ─────────────────────────
// Im Blatt, mitten in einem Prosaabsatz: „Faktenkasten · Betroffen: 3.840
// Haushalte · Dauer: 50 Stunden".
{
  const GERUEST = [
    "Faktenkasten · Betroffen: 3.840 Haushalte · Dauer: 50 Stunden",
    "Fiktive Zeitung · maschinell erzeugt",
    "Kurz gemeldet",
    "WAS: will die Spur bewusst auf",
    "SEQUENZ — Die Spur",
  ];
  for (const z of GERUEST) wahr(`als Gerüst erkannt: „${z.slice(0, 30)}…“`, GERUEST_ZEILE.test(z));
  wahr("ein gewöhnlicher Satz nicht", !GERUEST_ZEILE.test("Die Tür steht offen und niemand geht hindurch."));
  ist("die Reinigung wirft die Gerüstzeile weg", corpusSanitize(GERUEST[0]!).trim(), "");
  ist("und behält den Satz daneben",
    corpusSanitize(GERUEST[0]! + "\nDie Tür steht offen.").trim(), "Die Tür steht offen.");
  // Der Zeitstempel-Rest: „Gegen 00:39 — und der Blick blieb." wurde zu
  // „Gegen und der Blick blieb." — die Präposition blieb stehen.
  ist("der Zeitstempel nimmt seine Präposition mit",
    corpusSanitize("Gegen 00:39 — und der Blick blieb.").trim(), "und der Blick blieb.");
}

// ── § 5 + § 6 · Dachzeile und Kurzname ─────────────────────────────────────
// Im Blatt: „EINER STRASSE, DIE ZWEIMAL EXISTIERT, WO DIE STRASSEN KEINE NAMEN
// TRAGEN · GESELLSCHAFT" und „…über die das Namen nun informiert."
ist("der Dativ wird zum Namen", dachOrt("an der Unterelbe"), "Unterelbe");
ist("der unbestimmte Artikel fällt auch", dachOrt("in einem Hafen"), "Hafen");
ist("alles hinter dem Komma fällt weg",
  dachOrt("in einer Straße, die zweimal existiert, wo die Straßen keine Namen tragen"), "Straße");
ist("zu lang heißt: gar kein Ort", dachOrt("vor einer bemalten Außenmauer an einem Gehweg"), "");
ist("und leer bleibt leer", dachOrt(""), "");
ist("der Nachname bleibt der Nachname", kurzPerson("Dr. Ing. Richard Doll"), "Doll");
ist("auch ohne Titel", kurzPerson("Reinhard Kraus"), "Kraus");
ist("eine Phrase behält ihre volle Form",
  kurzPerson("das Register aller falschen Namen"), "das Register aller falschen Namen");
ist("und eine Gattungsbezeichnung auch", kurzPerson("die Archivarin"), "die Archivarin");

// ── § 2 · Die Meldung formt fremdes Material um ────────────────────────────
ist("der Klammereinschub fällt weg",
  formeWas("Die Schriftstellerin Marie von Ebner-Eschenbach (Lotti, die Uhrmacherin; Das Gemeindekind) wird geboren."),
  "Die Schriftstellerin Marie von Ebner-Eschenbach wird geboren");
ist("das weiche Trennzeichen auch", formeWas("Der deutsche Leicht­athlet gewinnt"), "Der deutsche Leichtathlet gewinnt");
ist("nur der erste Satz", formeWas("Er kommt an. Danach geht er wieder."), "Er kommt an");
ist("und eine Nominalphrase bleibt, was sie ist", formeWas("eine Wandmalerei"), "eine Wandmalerei");
wahr("ein Prädikat wird erkannt", tragtPraedikat("sucht eine Akte"));
wahr("eine Nominalphrase trägt keines", !tragtPraedikat("eine Wandmalerei"));

{
  const basis = {
    tone: "nuechtern", form: "meldung", lenTarget: 60, mode: "bureau", structure: "linear",
    perspective: "third", rhythm: "auto", disruptor: "off", instability: 0, markovMode: "off",
    varLevel: "wild", archetypeA: "neutral", archetypeB: "neutral",
  };
  // Genau die vier Eingaben, die in Nr. 44 die vier Meldungen ergaben.
  const FAELLE: [string, string, string, string][] = [
    ["", "am 15. August 2026", "", "Der deutsche Leichtathlet Owen Ansah hat bei der EM in Birmingham Gold gewonnen"],
    ["vor einer bemalten Außenmauer an einem Gehweg", "tagsüber bei teilweise bewölktem Himmel", "die Person", "eine Wandmalerei"],
    ["", "am 13. September 1830", "", "Die Schriftstellerin Marie von Ebner-Eschenbach (Lotti, die Uhrmacherin; Das Gemeindekind) wird geboren"],
    ["im Archiv", "am Morgen", "die Archivarin", "sucht eine Akte"],
  ];
  for (const [wo, wann, wer, was] of FAELLE) {
    const erg = buildMeldung({ ...basis, where: wo, when: wann, who: wer, what: was } as unknown as GenInput, "gesellschaft");
    const maengel = pruefeMeldung(erg.text, erg.fb).map((x) => x.art);
    ist(`Meldung ohne Mangel: „${(wann || wo).slice(0, 26)}…“`, maengel.join(", "), "");
    wahr(`kein Platzhalter darin: „${(wann || wo).slice(0, 20)}…“`, !/\b(am|der) Ort\b/.test(erg.text));
    wahr(`keine Klammer darin: „${(wann || wo).slice(0, 20)}…“`, !/\([^)]*\)/.test(erg.text));
    wahr(`kein „Im tagsüber“: „${(wann || wo).slice(0, 20)}…“`, !/\bIm tagsüber\b/.test(erg.text));
  }
}

// Und die Prüfung muss die alten Fassungen als mangelhaft erkennen — sonst ist
// sie nur höflich.
{
  const erg = buildMeldung({
    where: "im Archiv", when: "am Morgen", who: "die Archivarin", what: "sucht eine Akte",
    tone: "nuechtern", form: "meldung", lenTarget: 60, mode: "bureau", structure: "linear",
    perspective: "third", rhythm: "auto", disruptor: "off", instability: 0, markovMode: "off",
    varLevel: "wild", archetypeA: "neutral", archetypeB: "neutral",
  } as unknown as GenInput, "gesellschaft");
  const ALT: [string, string][] = [
    ["Platzhalter", "Am 15. August 2026 ist am Ort bekannt geworden: Ein Fund wird gemeldet. Weitere Angaben liegen zunächst nicht vor."],
    ["zwei Nominalphrasen", "Am Morgen ist im Archiv bekannt geworden: Die Person eine Wandmalerei. Weitere Angaben liegen zunächst nicht vor."],
    ["Fremdmaterial", "Am Morgen ist im Archiv bekannt geworden: Die Schriftstellerin (Lotti) wird geboren. Weitere Angaben liegen zunächst nicht vor."],
    ["Großschreibung im Satz", "Am Morgen ist Vor einer bemalten Außenmauer bekannt geworden: Ein Fund wird gemeldet. Weitere Angaben liegen zunächst nicht vor."],
  ];
  for (const [name, text] of ALT) {
    wahr(`die Prüfung erkennt: ${name}`, pruefeMeldung(text, erg.fb).length > 0);
  }
  wahr("und lässt die saubere Meldung in Ruhe", pruefeMeldung(erg.text, erg.fb).length === 0);
}

// ── Am fertigen Text: keine Dubletten, keine Phrase als Subjekt ────────────
{
  const ids = Object.keys(BUILTIN_PRESETS);
  let dubletten = 0, phrase = 0;
  for (let i = 0; i < 120; i++) {
    const t = buildStory(BUILTIN_PRESETS[ids[i % ids.length]!] as Bank, {
      where: "im Archiv", when: "am Morgen", who: "eine Archivarin ohne Namen, voller ungestellter Fragen",
      what: "sucht eine Akte", tone: "nuechtern", form: "prose", lenTarget: 200, tension: "auto",
      cast: "auto", mode: "auto", structure: i % 2 ? "rekombination" : "linear", perspective: "third",
      rhythm: "auto", disruptor: "off", instability: 0, markovMode: "off", varLevel: "wild",
      archetypeA: "neutral", archetypeB: "neutral",
    } as unknown as GenInput);
    const ss = t.split(/(?<=[.!?…])\s+/).map((x) => x.replace(/^[—–\s]+/, "").trim()).filter(Boolean);
    for (let k = 1; k < ss.length; k++) {
      const a = ss[k - 1]!.replace(/[.!?…—–]/g, "").trim().toLowerCase();
      const b = ss[k]!.replace(/[.!?…—–]/g, "").trim().toLowerCase();
      if (a && a === b) dubletten++;
    }
    // Nicht nur am Satzanfang suchen: Rhythmus und Disruptor machen aus dem
    // Komma der Figur eine Satzgrenze, und dann steht die Verzierung dort.
    if (/[Vv]oller ungestellter Fragen/.test(t)) phrase++;
  }
  ist("in 120 Texten keine Satzdublette", dubletten, 0);
  ist("und die Verzierung kommt im Text gar nicht mehr vor", phrase, 0);
}


// ── § 7 · Abgeschnittene Sammler-Funde am Komma kürzen ────────────────────
// Gemeldet an Ausgabe Nr. 45: „In der Toskana wird der italienische
// Festungsbaumeister und Militär Rochus zu Lynar geboren, der insbesondere
// durch Bauten im Dienst deutscher Fürsten wie der." Der Sammler kappt lange
// Auszüge nach 170 Zeichen; fehlt das Ende, ist der Rest kein Satz mehr.
// Vorschlag des Benutzers: am letzten Komma kürzen.
const LANG = "In der Toskana wird der italienische Festungsbaumeister und Militär Rochus zu Lynar geboren, "
  + "der insbesondere durch Bauten im Dienst deutscher Fürsten wie der Markgrafen von Brandenburg bekannt wurde.";
const GEKUERZT = "In der Toskana wird der italienische Festungsbaumeister und Militär Rochus zu Lynar geboren";
ist("der Sammler kürzt am Komma", wasPhrase(LANG), GEKUERZT);
ist("und was schon im Vorrat liegt, wird beim Bauen gerettet",
  formeWas(GEKUERZT + ", der insbesondere durch Bauten im Dienst deutscher Fürsten wie der"), GEKUERZT);
ist("ein hängender Artikel am Ende verschwindet", kuerzeAmBruch("Ein Weg führt zu dem Haus und der"), "Ein Weg führt zu dem Haus");
ist("ohne Komma fällt das hängende Wort weg", kuerzeAmBruch("Er läuft seit vielen Jahren auf dem"), "Er läuft seit vielen Jahren");
ist("ein ganzer Satz bleibt ganz", kuerzeAmBruch("Die Archivarin sucht eine Akte"), "Die Archivarin sucht eine Akte");
// Trennbare Präfixe beenden einen deutschen Satz sehr wohl — die erste Fassung
// machte aus „Er kommt an" ein „Er kommt".
ist("ein trennbares Präfix bleibt stehen", kuerzeAmBruch("Er kommt an"), "Er kommt an");
ist("und noch eines", kuerzeAmBruch("Das Licht geht aus"), "Das Licht geht aus");
ist("bleibt nichts Ganzes übrig, kommt nichts zurück", kuerzeAmBruch("wie der"), "");
// Kurze, frei getippte Felder dürfen NICHT verschwinden — die Funktion läuft
// auch über sie.
for (const kurz of ["sucht eine Akte", "gewinnt", "eine Wandmalerei"]) {
  ist(`„${kurz}“ bleibt unangetastet`, formeWas(kurz), kurz);
}


// ── § 8 · Befunde aus Ausgabe Nr. 46 ──────────────────────────────────────
{
  // Die Dachzeile: „HOCH IN · WETTER". Ein Fehler der Reparatur aus 4.265 —
  // sie kappte auch an einem bloßen „der".
  ist("führende Umstandswörter fallen weg", dachOrt("hoch in der Luft"), "Luft");
  ist("und ein Ort mit Ergänzung bleibt ganz", dachOrt("in einem Hochhaus ohne Erdgeschoss"), "Hochhaus ohne Erdgeschoss");
  ist("der Nebensatz nach Komma fällt weiter weg", dachOrt("zu einer Zeit, die niemand zählt"), "Zeit");

  // Die Bestandsformel: „Der Jugendliche besteht seit 1861."
  wahr("eine Werft ist eine Einrichtung", istEinrichtung("die Ostmoor-Werft"));
  wahr("ein Stadttheater auch", istEinrichtung("das Stadttheater"));
  wahr("ein Jugendlicher nicht", !istEinrichtung("der Jugendliche"));
  wahr("ein Hochhaus ohne Erdgeschoss auch nicht", !istEinrichtung("ein Hochhaus ohne Erdgeschoss"));

  // Der Faktenkasten stand mitten im Absatz — dort greift keine Zeilenregel.
  ist("der Faktenkasten fällt auch mitten im Absatz weg",
    corpusSanitize("Ein Geruch aus der Kindheit. Faktenkasten · Neu: 3.660 Haushalte · Ausdehnung: 278 Meter · im Frühjahr: die erste Meldung. Die Karte bleibt.").trim(),
    "Ein Geruch aus der Kindheit. Die Karte bleibt.");

  // Der abgeschnittene Relativsatz: „…, der insbesondere durch Bauten im
  // Dienst deutscher Fürsten" endet auf einem Nomen und trägt kein Verb.
  ist("ein Relativsatz ohne Verb fällt weg",
    kuerzeAmBruch("Rochus zu Lynar geboren, der insbesondere durch Bauten im Dienst deutscher Fürsten"),
    "Rochus zu Lynar geboren");
  ist("ein Relativsatz MIT Verb bleibt",
    kuerzeAmBruch("Eine Münze, die niemals ihren Glanz verliert"),
    "Eine Münze, die niemals ihren Glanz verliert");
  // Die ASCII-Wortgrenze: „Fürsten" galt als Verb „ürsten".
  ist("und ein Nomen mit Umlaut ist kein Verb",
    kuerzeAmBruch("Ein Zug durch das Land, der die Fürsten"), "Ein Zug durch das Land");

  // Der Relativsatz der Figur wird geschlossen.
  ist("das Komma hinter dem Relativsatz der Figur",
    schliesseFigurenkomma("Ein Schulmädchen, das Karten fälscht bemerkt: Der Einsatz ist ein Ja.", "ein Schulmädchen, das Karten fälscht"),
    "Ein Schulmädchen, das Karten fälscht, bemerkt: Der Einsatz ist ein Ja.");
  ist("am Satzende wird keines gesetzt",
    schliesseFigurenkomma("Dort steht ein Schulmädchen, das Karten fälscht.", "ein Schulmädchen, das Karten fälscht"),
    "Dort steht ein Schulmädchen, das Karten fälscht.");
  ist("und ohne Relativsatz passiert nichts",
    schliesseFigurenkomma("Die Archivarin sucht eine Akte.", "die Archivarin"),
    "Die Archivarin sucht eine Akte.");

  // Und am fertigen Text — sonst prüft das Obige nur eine Funktion, die
  // niemand aufruft.
  const ids2 = Object.keys(BUILTIN_PRESETS);
  let offen = 0, zerschnitten = 0;
  for (let i = 0; i < 90; i++) {
    const t = buildStory(BUILTIN_PRESETS[ids2[i % ids2.length]!] as Bank, {
      where: "in der Markthalle", when: "am Nachmittag", who: "ein Schulmädchen, das Karten fälscht",
      what: "sucht die Spur", tone: "nuechtern", form: "prose", lenTarget: 220, tension: "auto",
      cast: "auto", mode: "auto", structure: i % 2 ? "rekombination" : "linear", perspective: "third",
      rhythm: "auto", disruptor: "off", instability: 0, markovMode: "off", varLevel: "wild",
      archetypeA: "neutral", archetypeB: "neutral",
    } as unknown as GenInput);
    // Der Relativsatz muss geschlossen sein: nach „fälscht" folgt nie direkt
    // ein kleingeschriebenes Wort.
    if (/f[äa]lscht\s+[a-zäöüß]/.test(t)) offen++;
    // Und er darf nicht zu einem eigenen Satz zerschnitten werden.
    if (/(^|[.!?…]\s+)[Dd]as Karten f[äa]lscht/.test(t)) zerschnitten++;
  }
  ist("in 90 Texten kein offener Relativsatz", offen, 0);
  ist("und keiner wird zum eigenen Satz zerschnitten", zerschnitten, 0);
}


// ── Gemeldet (4.327.1): „Erwachsene verschiebt eine Beerdigung" ─────────────
// Ein nacktes Gattungswort als WER traf ohne Artikel auf Singular-Rahmen.
{
  ist("ein nacktes Gattungswort bekommt den Artikel", normWho("Erwachsene"), "eine Erwachsene");
  ist("die männliche starke Form auch", normWho("Erwachsener"), "ein Erwachsener");
  ist("Genus aus der Schätzung", normWho("Kind"), "ein Kind");
  ist("mit Artikel bleibt alles wie es war", normWho("die Erwachsene"), "Die Erwachsene");
  ist("ein Name bekommt KEINEN Artikel", normWho("Ottilie"), "Ottilie");
  ist("ein ausdrücklicher Plural auch nicht", normWho("Männer"), "Männer");
}

// ── Wo mit Zusatz und Gewässer-Grundwort ────────────────────────────────────
// Gemeldet: „ich liege Kanalufer, unter einer Fußgängerbrücke". Der Zusatz
// nach dem Komma schaltete die ganze Normalisierung ab, und „Kanalufer" war
// als Zusammensetzung auf -ufer nicht erkannt.
ist("Kopf vor dem Komma wird normalisiert, der Zusatz bleibt", normWhere("Kanalufer, unter einer Fußgängerbrücke"), "am Kanalufer, unter einer Fußgängerbrücke");
ist("Zusammensetzung auf -ufer verlangt an", normWhere("Flussufer"), "am Flussufer");
ist("-see ebenso", normWhere("Bodensee"), "am Bodensee");
// Gegenproben: Präposition vorhanden → unverändert; Innenraum → in.
ist("mit Präposition bleibt alles stehen", normWhere("am Kanalufer, unter der Brücke"), "am Kanalufer, unter der Brücke");
ist("ein Innenraum bekommt im", normWhere("Keller"), "im Keller");

// ── Wo mit nachgestellter Angabe: der Kopf bekommt seine Präposition ────────
// Gemeldet: „Während des letzten Prozesses, Platz in Hanoi, Vietnam".
ist("Platz in Hanoi, Vietnam", normWhere("Platz in Hanoi, Vietnam"), "auf dem Platz in Hanoi, Vietnam");
ist("Gericht ohne Richter, wo …", normWhere("Gericht ohne Richter, wo die Karten nicht stimmen"), "im Gericht ohne Richter, wo die Karten nicht stimmen");
ist("Bahnhof unter der Stadt", normWhere("Bahnhof unter der Stadt"), "im Bahnhof unter der Stadt");
ist("mit Präposition davor unverändert", normWhere("im Platz in Hanoi"), "im Platz in Hanoi");

// ── Ortsnamen ohne Artikel bekommen „in" ────────────────────────────────────
// Gemeldet: „Im Jahr 1960 Malvern finden wir ein Beben unter der Schwelle".
ist("Malvern (unbekannt, ein Wort, groß)", normWhere("Malvern"), "in Malvern");
ist("Leningrad (Grundwort Grad, aber Ortsname)", normWhere("Leningrad"), "in Leningrad");
ist("Hamburg", normWhere("Hamburg"), "in Hamburg");
ist("Spanien", normWhere("Spanien"), "in Spanien");
// Gegenproben: Gattungswörter behalten Artikel und Genus.
wahr("Ausland bekommt nicht das nackte in", normWhere("Ausland") !== "in Ausland");
ist("Vorstadt", normWhere("Vorstadt"), "in der Vorstadt");
ist("Kanalufer bleibt am Ufer", normWhere("Kanalufer"), "am Kanalufer");

console.log(`Prüfstand Nr. 44 — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Nr. 44: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Nr. 44: alle ${geprueft} Prüfungen bestanden.`);
}
