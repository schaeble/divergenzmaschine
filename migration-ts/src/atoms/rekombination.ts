// Rekombinations-Modus: baut den Text aus geprüften Atomen statt aus Schablonen.
// Pool = aktive Wortbank (offline annotiert) + geerntete Satzvorlagen.
import { KEINE_KATEGORIE, type Bank, type GenInput } from "../types";
import { deriveAtom } from "./derive";
import { passt, fortschreiben, fuelleKontext, fuelleSlot, offeneSlots, verfugen, ziehe, phasenFolge, STRUKTUR_PHASEN, type PoolAtom, type Kontext, naechsterSlot }  from "./assemble";
import TEMPLATES from "./templates.data.json";
import { normWhere, normWhen, normWho } from "../generation/ctxnorm";
import { isFirstPerson, isSecondPerson } from "../generation/coherence";
import { extractLeadVerb, looksLikeFullClause, splitSpeakers, personKopf } from "../generation/wordcls";
import { NOUN_GENDER } from "../generation/nouns.data";
import { applyPerspective, pronominalize, guessPronoun } from "../generation/shape";
import { resetTrace, pushTrace, pruefeAbgleich } from "./trace";
import { loadDramaData } from "../generation/dramaturgie";
import { loadKnobs } from "../features/knobs";
import { isSaneMarkov, loadPersistentCorpus, corpusSanitize, type MarkovModel } from "../corpus";
import { properNames } from "../generation/coherence";
import { hatFinitesVerb } from "./derive";
import { ICH_DU_ZU_ER } from "../generation/wordcls";
import { traceMarkov } from "../generation/markovTrace";
import { MODE_DATA } from "../modes.data";

/** Kopfzeile einer Multi-Shot-Ausgabe (SEQUENZ —, WER:, WAS:, Shot 3 (3s), DE:). */
export const GERUESTZEILE = /(^|\s)(SEQUENZ\s*—|(?:WER|WO|WANN|WAS|GESAMTLÄNGE|DE|EN)\s*:|Shot\s*\d+\s*\()/;
/** Dieselbe Marke, aber nur am Anfang — zum Abziehen. */
export const GERUEST_MARKE = /^(?:SEQUENZ\s*—[^\n]*|(?:WER|WO|WANN|WAS|GESAMTLÄNGE|DE|EN)\s*:|Shot\s*\d+\s*\([^)]*\))\s*/;

interface TemplateAtom { id: string; text: string; typ: string; verlangt: PoolAtom["verlangt"]; oeffnet: boolean; stelle?: string }

/** Baut den Atom-Pool aus Bank und Vorlagen. Perspektivfremde Vorlagen bleiben draußen. */
/** Traegt der Satz eine eigene Perspektive? Bausteine aus Korpus und Markov
 *  bringen ihre Person mit ("ich bemerke", "du siehst"). Die Perspektiven-
 *  Umstellung konjugiert aber nur AUS der dritten Person - eine erste Person
 *  bleibt unveraendert stehen und ergibt "du bemerke eine Erinnerung".
 *  Erkannt wird das mit derselben Zuordnung, die B.8 erzeugt hat. */
const traegtPerson = (t: string): boolean =>
  (t.toLowerCase().match(/[a-zäöüß]+/g) || []).some((w) => !!ICH_DU_ZU_ER[w]);

export function buildPool(bank: Bank, perspektive: string, what?: string, figur?: string,
                          model?: MarkovModel, markovMode?: string): PoolAtom[] {
  const pool: PoolAtom[] = [];
  let i = 0;
  // „Was passiert?“ als eigene Atome — bisher floss die Angabe gar nicht ein.
  const w = (what || "").trim();
  if (w) {
    const lead = extractLeadVerb(w);
    const kern = lead.rest.replace(/[.!?…]+$/, "");
    const P = figur || "Jemand";
    const saetze = lead.isInfinitiveLed
      ? [`${P} will ${kern}`, `Alles drängt darauf, ${kern.replace(/(\S+)$/, "zu $1")}`]
      // Kein "Und wieder: …" mehr: Die Phrasensperre laesst die Handlung nur noch
      // einmal in den Text: Blieb dann ausgerechnet die Echo-Fassung uebrig, kuendigte
      // sie eine Wiederholung an, die es nicht gab - und zweimal hintereinander
      // gezogen ergab sie "Und wieder: und wieder: …".
      : lead.verb
        ? [`${P} ${lead.verb} ${kern}`]
        // "X sucht <kern>" ergibt nur Sinn, wenn der Kern eine Nominalphrase ist.
        // Steht dort ein Satz, entsteht "Du suchst sehe 9 Monde am Himmel" - genau so
        // geschehen, weil hatFinitesVerb Formen der ersten Person ("sehe", "warte",
        // "gehe") nicht kennt: Die Endung -e ist von Adjektiven nicht zu trennen.
        // Deshalb wird hier nicht nach dem Verb gefragt, sondern nach dem Artikel.
        : looksLikeFullClause(lead.verb, kern) || hatFinitesVerb(kern) || !wirktNominal(kern)
          ? [kern]
          : [`Es geht um eines: ${kern}`, `${P} sucht ${kern}`];
    for (const t of saetze) {
      const d = deriveAtom(t);
      pool.push({ ...d, id: `was-${pool.length}`, quelle: "kontext", kategorie: "was", verlangt: null, bruchgrad: 0 });
    }
  }
  // Erzaehlbogen als eigene Quelle: Die Dramaturgie eines Presets beschreibt Phasen,
  // und der Assembler baut in Phasen — das passt ohne Umweg zusammen. Nebenbei
  // vergroessert es den Vorrat um rund zwanzig Eintraege je Preset, und genau daran
  // scheiterte bisher die Ziellaenge.
  // A.3: Bei Gewicht 0 wird der Erzaehlbogen gar nicht erst in den Pool gelegt.
  // Ihn nur herunterzugewichten reicht nicht: In manchen Phasen sind seine Atome
  // die einzigen Kandidaten, und ziehe() normiert ueber die vorhandene Auswahl -
  // bei 0 % kamen so immer noch 26 % heraus.
  const drama = loadKnobs().bogen === 0 ? null : loadDramaData();
  if (drama) {
    const felder: [string, string[]][] = [
      ["einstieg", drama.einstieg], ["mitte", drama.mitte], ["hoehepunkt", drama.hoehepunkt],
      ["konflikte", drama.konflikte], ["ausloeser", drama.ausloeser],
      ["veraenderungen", drama.veraenderungen], ["zeitanomalien", drama.zeitanomalien],
      ["regeln", drama.regeln],
      // "schluss" bleibt aussen vor: Stilworte wie "offen" sind kein Textmaterial.
    ];
    for (const [kat, arr] of felder) {
      if (!Array.isArray(arr)) continue;
      for (const t of arr) {
        const roh = (t || "").trim(); if (roh.length < 4) continue;
        const d = deriveAtom(roh);
        pool.push({ ...d, id: `dr-${kat}-${++i}`, quelle: "dramaturgie", kategorie: kat, verlangt: null,
          bruchgrad: d.unsicher.length ? 1 : 0 });
      }
    }
  }
  // B.1: Markov als eigene Atomquelle. Bisher kannte der Assembler nur Bank,
  // Erzaehlbogen und Vorlagen - der Markov-Regler war in diesem Bauweg wirkungslos.
  // Die Fragmente laufen durch dieselben Filter, die auch fuer Korpusmaterial
  // gelten muessten: brauchbar, Praesens, keine fremden Eigennamen, nicht zu lang.
  if (model && markovMode && markovMode !== "off") {
    const wieViele = markovMode === "on" ? 34 : 16;
    const eigene = new Set((figur || "").toLowerCase().split(/[,;]/).map((x) => x.trim()).filter(Boolean));
    const gesehen = new Set<string>();
    for (let n = 0; n < wieViele * 3 && gesehen.size < wieViele; n++) {
      const roh = (model.generate(14) || "").trim();
      if (!roh || !isSaneMarkov(roh)) continue;
      const sig = roh.toLowerCase();
      if (gesehen.has(sig)) continue;
      const d = deriveAtom(roh);
      if (d.tempus === "praeteritum") continue;                       // Zeitebene bricht sonst
      if (d.rhythmus.woerter > 20) continue;                          // zu lang zum Verfugen
      if (properNames(roh).some((nm) => !eigene.has(nm.toLowerCase()))) continue;  // fremde Figuren
      if (traegtPerson(roh)) continue;                                             // eigene Person
      gesehen.add(sig);
      pool.push({ ...d, id: `mk-${++i}`, quelle: "markov", kategorie: "", verlangt: null, bruchgrad: 1 });
    }
  }
  // B.7: Der eigene Korpus als Atomquelle. Der groesste Hebel fuer Vielfalt - aber
  // nur mit denselben Filtern wie bei Markov, sonst holt man sich fremde Figuren,
  // Praeteritum und Bandwurmsaetze ins Preset. Voreinstellung ist AUS: Wer fremde
  // Literatur im Korpus hat, wuerde sonst ganze Saetze daraus woertlich ausgeben.
  const korpusDeckel = loadKnobs().korpus;
  if (korpusDeckel > 0) {
    const eigene2 = new Set((figur || "").toLowerCase().split(/[,;]/).map((x) => x.trim()).filter(Boolean));
    // DIESELBE Reinigung wie beim Markov-Lernen. Bis 4.264.0 las dieser Zweig
    // den Korpus roh: Es gab zwei Türen in den Text und nur an einer ein
    // Schloss. Genau so kam das Gerüst der Zeitung in die Prosa.
    const roh = corpusSanitize(loadPersistentCorpus());
    const saetze = roh.split(/(?<=[.!?…])\s+/).map((x) => x.trim()).filter((x) => x.length > 12);
    let genommen = 0;
    for (const satz of saetze) {
      if (genommen >= korpusDeckel) break;
      // Kopfzeilen der eigenen Multi-Shot-Ausgabe sind keine Saetze. Sie stehen
      // roh im Korpus, wenn der Benutzer eine Sequenz abgelegt hat, und landeten
      // so als Baustein in der Prosa (Ausgabe Nr. 41: „WAS: will die Spur …").
      // Die Marke abziehen statt die Zeile wegzuwerfen: Hinter „Shot 2 (3s)"
      // steht ein richtiger Satz. Ohne abschliessendes Satzzeichen ist der Rest
      // aber ein Feldwert („WAS: will die Spur bewusst auf") und kein Satz.
      const rein = satz.replace(GERUEST_MARKE, "").trim();
      if (rein !== satz && !/[.!?…]$/.test(rein)) continue;
      if (GERUESTZEILE.test(rein)) continue;
      const d = deriveAtom(rein);
      if (d.tempus === "praeteritum") continue;
      if (d.rhythmus.woerter > 22) continue;
      if (properNames(rein).some((nm) => !eigene2.has(nm.toLowerCase()))) continue;
      if (traegtPerson(rein)) continue;                      // eigene Person, siehe oben
      pool.push({ ...d, id: `kp-${++i}`, quelle: "korpus", kategorie: "", verlangt: null, bruchgrad: 1 });
      genommen++;
    }
  }
  for (const [kat, arr] of Object.entries(bank as unknown as Record<string, string[]>)) {
    if (!Array.isArray(arr)) continue;
    // `verwandlungen` steht in der Bank, ist aber keine Textkategorie: Die
    // Einträge („Telefon→Stille") gehören nicht in den Text, sondern sagen, was
    // aus einem Motiv wird, wenn es wiederkehrt.
    if (KEINE_KATEGORIE.has(kat)) continue;
    for (const t of arr) {
      const d = deriveAtom(t);
      pool.push({ ...d, id: `wb-${++i}`, quelle: "wortbank", kategorie: kat, verlangt: null,
        bruchgrad: d.unsicher.length ? 1 : (kat === "motifs" || kat === "hooks" ? 1 : 0) });
    }
  }
  for (const a of (TEMPLATES as { atome: TemplateAtom[] }).atome) {
    if (/⟨(WAHL|X)⟩/.test(a.text)) continue;                    // unauflösbarer Rest aus der Ernte
    // Perspektiv-Markierung: Ich-/Du-Vorlagen nur bei passender Erzählperspektive
    // Ich-Vorlagen nur bei Ich-Perspektive: bei „wir“ müssten sie mitkonjugiert
    // werden („Wir registrieren:“), was die Namensersetzung nicht leistet.
    if (isFirstPerson(a.text) && perspektive !== "first" && perspektive !== "auto") continue;
    if (isSecondPerson(a.text) && perspektive !== "second" && perspektive !== "auto") continue;
    const d = deriveAtom(a.text.replace(/⟨[A-ZÄÖÜ]+⟩/g, "Ding"));
    pool.push({ ...d, id: a.id, text: a.text, typ: a.typ as PoolAtom["typ"], quelle: "vorlage",
      verlangt: a.verlangt, oeffnet: a.oeffnet, bruchgrad: 0, fuehrt_ein: [],
      stelle: a.stelle as PoolAtom["stelle"] });
  }
  return pool;
}

/** Divergenz aus den Studio-Reglern ableiten (0–100). */
const divergenzOf = (input: GenInput): number =>
  (input.varLevel === "high" ? 85 : input.varLevel === "low" ? 30 : 60) + (input.instability >= 2 ? 10 : 0);

/** Erzeugt einen Text im Rekombinations-Modus. */
// Bausteine ohne finites Verb - drei davon in Folge ergeben ein Stakkato.
/** Sieht der Text nach einer Nominalphrase aus? Entscheidend ist der Anfang:
 *  Artikel, Possessiv, Mengenwort oder ein grossgeschriebenes Nomen. */
const wirktNominal = (t: string): boolean =>
  /^\s*(ein|eine|einen|einem|eines|einer|der|die|das|den|dem|des|mein|meine|meinen|sein|seine|ihr|ihre|kein|keine|viele|manche|jede|jeden|etwas|nichts|[A-ZÄÖÜ])/.test(t);

const FLACH = new Set(["nominalphrase", "praepositionalphrase", "fragment", "einwort"]);


export function buildRekombination(bank: Bank, input: GenInput, model?: MarkovModel): string {
  const pool = buildPool(bank, input.perspective, input.what, (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim(),
    model, input.markovMode);
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur: (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim(),
    verb: "will",
  };
  // Bis zur ZIELWORTZAHL bauen, nicht bis zu einer geschätzten Atomzahl: Atome sind
  // im Schnitt nur ~4 Wörter lang, eine feste Zahl verfehlt das Ziel um ein Vielfaches.
  const zielWoerter = Math.max(30, input.lenTarget ?? 110);
  // B.4: Die Zeitebene vorab aus der MEHRHEIT des Vorrats bestimmen, nicht dem
  // ersten Los ueberlassen. Vorher legte der erste zeitgebundene Baustein sie fest -
  // erwischte er eines der wenigen Praeteritum-Atome, galt Praeteritum fuer den
  // ganzen Text, und fast alles andere wurde abgewiesen. Gemessen: solche Laeufe
  // kamen bei Ziel 260 auf 144 statt 217 Woerter.
  const tempusZaehler = new Map<string, number>();
  for (const a of pool) if (a.tempus && a.tempus !== "kein") tempusZaehler.set(a.tempus, (tempusZaehler.get(a.tempus) || 0) + 1);
  const mehrheit = [...tempusZaehler].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "praesens";
  const k: Kontext = { vorheriges: null, offenerKopf: false, entitaeten: new Map([[ctx.figur, { abstand: 0 }]]),
    tempus: mehrheit, divergenz: divergenzOf(input), benutzt: new Set() };
  // Stellschrauben aus den Einstellungen statt fest im Code (A.2)
  const knobs = loadKnobs();
  const W4_MAX = knobs.w4max;
  const ENDE_MARGE = 20;   // ab so vielen Restwoertern darf ein Schlussbild kommen
  const FUEGE_DECKEL = knobs.fuegeteil / 100;
  // Nebenfiguren seltener als die Hauptfigur: Sie sollen vorkommen, nicht dominieren.
  // NICHT einfach am Komma trennen: Der Kontextwürfel hängt Zusätze mit Komma
  // an („eine Archivarin ohne Namen, voller ungestellter Fragen"), und die
  // wurden hier zur Nebenfigur — in 35 % der Sätze zum Satzsubjekt.
  // splitSpeakers kennt den Unterschied und wird dafür geprüft.
  const figuren = splitSpeakers(normWho(input.who || "")).map(personKopf);
  const waehleFigur = (): string => {
    if (figuren.length < 2) return ctx.figur;
    return Math.random() < 0.65 ? figuren[0]! : figuren[1 + Math.floor(Math.random() * (figuren.length - 1))]!;
  };
  const kurve = ["mittel", "kurz", "lang", "mittel", "kurz", "mittel", "lang"];
  const out: string[] = [];
  let letzterTyp = "", gleicheInFolge = 0, wasGesetzt = false, flachInFolge = 0;
  const gesetzteTexte = new Set<string>();   // verschiedene Atome können gleichen TEXT erzeugen
  // Satzanfänge sperren: In einem Preset beginnen oft mehrere Einträge gleich
  // („Der Einsatz ist …“ 7×) — das ergibt eine Schleife trotz verschiedener Atome.
  const anfangZahl = new Map<string, number>();
  // Wann wurde welches Atom gesetzt? Erlaubt es, den Vorrat spaeter kontrolliert
  // wieder zu oeffnen, statt den Text abzubrechen.
  const benutztBei = new Map<string, number>();
  // Kurzsperre statt Verbrauch: Ein Baustein, den die Phrasensperre an DIESER
  // Stelle ablehnt, ist an einer spaeteren oft brauchbar. Ihn wie einen benutzten
  // zu behandeln kostete Laenge (gemessen: Ziel 240 von 75 auf 52 Prozent). Die
  // Kurzsperre faellt, sobald wieder etwas gesetzt wurde.
  const kurzGesperrt = new Set<string>();
  const ABSTAND = knobs.abstand;   // so viele Elemente muss ein Baustein zurueckliegen
  const PHRASE = knobs.phrase;     // Fensterbreite der Phrasensperre, 0 = aus
  /** Gibt Bausteine frei, die lange genug zurueckliegen. Gibt zurueck, wie viele. */
  const nachlegen = (): number => {
    let frei = 0;
    for (const [id, wann] of [...benutztBei]) {
      if (out.length - wann >= ABSTAND) { k.benutzt.delete(id); benutztBei.delete(id); frei++; }
    }
    return frei;
  };
  const anfangVon = (t: string): string => t.toLowerCase().replace(/[^a-zäöüß ]/g, "").trim().split(/\s+/).slice(0, 3).join(" ");
  resetTrace();
  // 0.6 Harte Dublettensperre: jedes Atom höchstens EINMAL je Text. Lieber ein
  // kürzerer Text als eine Phrasenschleife — für lange Texte mehrere Presets wählen.
  let fuegeteile = 0;
  // Erzählt diese Struktur den Bogen vorwärts? Dann beendet ein Schlussbild den
  // Text. Bei Reverse und Kreis steht am Textende eine andere Phase.
  const schlussAmEnde = (STRUKTUR_PHASEN[input.structure || "rekombination"]
    || STRUKTUR_PHASEN["linear"]!).slice(-1)[0] === "schluss";
  const woerterJetzt = (): number => out.join(" ").split(/\s+/).filter(Boolean).length;

  for (let s = 0; s < 600; s++) {
    const fortschritt = woerterJetzt() / zielWoerter;
    if (fortschritt >= 1) break;
    // Phase aus dem Fortschritt in Wörtern ableiten (nicht aus der Position)
    // Die Struktur bestimmt die Phasenfolge. Für „rekombination" ist sie
    // Zeichen für Zeichen die alte 30/30/20/20-Verteilung — dieser Umbau soll
    // den vorhandenen Bauweg nicht verändern.
    const phase = phasenFolge(input.structure || "rekombination", fortschritt);
    const letzte = fortschritt >= 0.92;
    // Die Handlung aus "Was passiert?" liegt als mehrere Fassungen im Vorrat.
    // Steht eine davon im Text, sind die anderen nur noch Wiederholung derselben
    // Aussage - genau so kamen "bekommt einen Ausweis fuer ein anderes Leben" und
    // "Denn genau das geschieht: bekommt einen Ausweis fuer ein anderes Leben"
    // zusammen in einen Text.
    let kand = pool.filter((a) => passt(a, k, phase) && !kurzGesperrt.has(a.id)
      && !(wasGesetzt && a.kategorie === "was"));
    // 0.4 Fügeteil-Anteil deckeln: Vorlagen sind Verbindungsstücke, nicht Inhalt.
    if (out.length >= 3 && fuegeteile / out.length >= FUEGE_DECKEL) {
      const inhalt = kand.filter((a) => a.quelle !== "vorlage");
      // Kein Inhalt mehr uebrig? Frueher endete der Text hier - und genau das war
      // der Grund, warum die Rekombination bei Ziel 280 nur die Haelfte lieferte.
      // Strecken mit Fuegeteilen bleibt verboten (das ergibt Leerlauf), aber der
      // Baustein-Vorrat darf sich wieder oeffnen: Was ABSTAND Elemente zurueckliegt,
      // ist erneut ziehbar. Die Textsperre bleibt absolut - woertliche Wiederholung
      // ist weiterhin unmoeglich, nur derselbe Baustein darf in anderer Umgebung
      // wiederkehren.
      if (!inhalt.length) {
        // Rahmen mit Slot sind der Ausweg: Sie verbinden bereits benutzte Bausteine
        // zu einem Satz, den es so noch nicht gab - die Textsperre laesst ihn also zu.
        // Reine Fuegeteile ohne Slot bleiben gedeckelt, die ergaeben nur Leerlauf.
        nachlegen();
        const rahmen = pool.filter((a) => a.verlangt && passt(a, k, phase));
        if (!rahmen.length) break;
        kand = rahmen;
      } else kand = inhalt;
    }
    if (letzte) kand = kand.filter((a) => !a.oeffnet && !a.verlangt);   // Text darf nicht offen enden
    // Nominalphrasen-Ketten aufbrechen: nach zwei gleichartigen Atomen Typwechsel erzwingen
    if (gleicheInFolge >= 2) {
      const anders = kand.filter((a) => a.typ !== letzterTyp);
      if (anders.length) kand = anders;
    }
    // Stakkato verhindern: "Eine Quittung ohne Betrag. Eine Mappe mit Bindfaden.
    // Ein leeres Logbuch." - drei satzlose Bausteine hintereinander sind rhythmisch
    // monoton und syntaktisch flach. Nach zweien muss etwas Satzwertiges kommen.
    if (flachInFolge >= 2) {
      const tief = kand.filter((a) => !FLACH.has(a.typ));
      if (tief.length) kand = tief;
    }
    // Phasenordnung: ein Schlussbild erst wirklich am Ende. Die Schwelle lag bei
    // 85 %, und weil der Text nach dem Schlussbild endet, brach er dort ab - bei
    // Ziel 400 in 149 von 150 Laeufen. Der vermeintliche Materialmangel war zum
    // grossen Teil diese Zeile. 95 % laesst dem Bogen Raum und dem Text seine Laenge.
    // Nicht als Prozentsatz, sondern als Restweg in Woertern: 85 % waren bei Ziel
    // 400 noch 60 Woerter zu frueh (der Text endet nach dem Schlussbild - in 149 von
    // 150 Laeufen war DAS der Abbruchgrund, nicht fehlendes Material). 95 % wiederum
    // liessen bei Ziel 180 kaum noch Platz, ein Schlussbild ueberhaupt zu ziehen.
    // Eine feste Marge trifft beide Faelle.
    // Das Schlussbild darf erst kurz vor dem Ziel kommen — ABER nur, wenn die
    // Struktur den Bogen überhaupt vorwärts erzählt. Bei „Reverse" liegt die
    // Phase „schluss" am ANFANG des Textes; dort war noch der ganze Text übrig,
    // und diese Regel hat das Schlussbild in 80 von 80 Läufen weggefiltert.
    if (schlussAmEnde && zielWoerter - woerterJetzt() > ENDE_MARGE) kand = kand.filter((a) => a.kategorie !== "endings");
    // Kennsätze mit fester Stelle im Text: „Du erfährst erst später:" nur vorn,
    // „Der Kreis schließt sich:" nur hinten.
    // Die Schwelle für „ende" liegt hoch: Der Text erreicht sein Ziel selten
    // ganz (gemessen rund 86 %), und die Längenauffüllung hängt danach noch
    // etwas an. Bei 0,7 stand der Kennsatz in 3 von 14 Fällen in der ersten
    // Hälfte des fertigen Textes.
    kand = kand.filter((a) => !a.stelle || (a.stelle === "anfang" ? fortschritt < 0.25 : fortschritt > 0.82));
    if (!kand.length) { if (!nachlegen()) break; continue; }
    if (!kand.length) { if (!nachlegen()) break; continue; }
    // Die Handlung aus „Was passiert?“ muss vorkommen — spätestens zur Hälfte
    // wird sie erzwungen, sofern ein passendes Atom zur Verfügung steht.
    if (!wasGesetzt && fortschritt >= 0.35) {
      const wasKand = kand.filter((x) => x.kategorie === "was");
      if (wasKand.length) kand = wasKand;
    }
    const a = ziehe(kand, kurve[s % kurve.length]!, out.join(" "), phase);
    if (!a) break;
    // Alle genannten Figuren einsetzen, nicht nur die erste. Vorher fuellte ⟨FIGUR⟩
    // immer denselben Namen - eine zweite Figur aus "Wer?" kam im ganzen Text nicht
    // vor (gemessen: "Ada" in 0 von 64 Texten, im Schablonenweg in 59).
    let text = fuelleKontext(a.text, { ...ctx, figur: waehleFigur() });
    const fueller: { text: string; kategorie: string; quelle: string }[] = [];
    let guard = 0;
    while (offeneSlots(text) && guard++ < 3) {
      const kf: Kontext = { ...k, vorheriges: a, offenerKopf: false };
      // Gegen den Slot pruefen, der als NAECHSTES gefuellt wird - nicht gegen den
      // ersten der Vorlage. Sonst wandert eine Nominalphrase in ein ⟨SATZ⟩ hinter
      // "denn", und ein Hauptsatz in ein ⟨AKK⟩ mitten im Rahmen.
      const slot = naechsterSlot(text);
      const f = ziehe(pool.filter((x) => x.id !== a.id && !k.benutzt.has(x.id)
        && !(x.kategorie === "endings" && phase !== "schluss")     // kein Schlussbild als Füllung
        // Ein Fueller steht IM Rahmen - eine eigene Satzverknuepfung stoesst dort an
        // die des Rahmens ("…, denn Und wieder: ich warte…").
        && !/^(Und|Doch|Aber|Oder|Denn|Dann|Dabei|Also|Trotzdem)\b/.test(x.text)
        && passt(x, kf, undefined, slot)), "mittel", out.join(" "));
      if (!f) break;
      // Der Füller steht mitten im Satz: Großschreibung nur bei Eigennamen belassen
      let fill = fuelleKontext(f.text, ctx).replace(/[.!?…]+$/, "");
      // Nur klein, wenn das erste Wort KEIN Nomen ist — „Kerzenstummel“ bleibt groß.
      const w1 = (fill.match(/^[A-ZÄÖÜ][a-zäöüß-]*/) || [""])[0];
      const istNomen = !!w1 && (!!NOUN_GENDER[w1.toLowerCase()] || /(ung|heit|keit|schaft|nis|tum|chen|lein|er|el|en|ucht|acht|icht|ion|tät|ei|ie|ur|us|um)$/.test(w1.toLowerCase()));
      // Figurennamen bleiben gross - "denn tom wartet auf einen Bescheid" sonst.
      const istFigur = !!w1 && (w1.toLowerCase() === ctx.figur.toLowerCase()
        || splitSpeakers(normWho(input.who || "")).some((x) => x.trim().toLowerCase() === w1.toLowerCase()));
      if (!f.fuehrt_ein.length && !istNomen && !istFigur && /^[A-ZÄÖÜ][a-zäöüß]/.test(fill)) fill = fill.charAt(0).toLowerCase() + fill.slice(1);
      text = fuelleSlot(text, fill);
      fueller.push({ text: fill, kategorie: f.kategorie || "—", quelle: f.quelle });
      k.benutzt.add(f.id); benutztBei.set(f.id, out.length);
    }
    if (offeneSlots(text)) continue;                    // ungefüllt → verwerfen statt ausgeben
    // Textdublette? Verschiedene Vorlagen mit denselben Platzhaltern erzeugen
    // identische Sätze („Im Jahr 2000 in London.“) — die Atom-Sperre greift dort nicht.
    const sig = text.toLowerCase().replace(/[^a-zäöüß ]/g, "").replace(/\s+/g, " ").trim();
    if (gesetzteTexte.has(sig)) { k.benutzt.add(a.id); continue; }
    // 4W-Deckel: Ort und Zeit stecken als Platzhalter in vielen Vorlagen. Jede
    // erzeugt einen anderen Satz, also greift weder die Atom- noch die Textsperre -
    // "Im Jahr 2100 in London" stand dadurch mehrfach im selben Text.
    const zaehleIn = (hay: string, nadel: string): number =>
      !nadel || nadel.length < 4 ? 0 : hay.toLowerCase().split(nadel.toLowerCase()).length - 1;
    const bisher = out.join(" ");
    let zuOft = false;
    for (const wert of [ctx.ort, ctx.zeit]) {
      if (zaehleIn(text, wert) && zaehleIn(bisher, wert) >= W4_MAX) { zuOft = true; break; }
    }
    if (zuOft) { k.benutzt.add(a.id); continue; }
    // N-Gramm-Sperre, jetzt fuer ALLE Quellen. Bisher galt sie nur fuer den Korpus,
    // weil dort die Selbstfuetterung zurueckkoppelt. Gemessen wiederholten trotzdem
    // 95 % der Laeufe eine Phrase aus fuenf Woertern - fast immer den Kern der
    // "Was passiert?"-Angabe, der als drei Atome im Vorrat liegt ("X", "Und wieder: X",
    // "Denn genau das geschieht: X"). Drei verschiedene Kennungen, drei verschiedene
    // Satzsignaturen: Weder die Atom- noch die Textsperre konnte greifen.
    // Ort und Zeit werden vorher herausgeschnitten - fuer sie gilt der 4W-Deckel,
    // und der ist ein Regler des Benutzers, den diese Sperre nicht ueberstimmen darf.
    if (PHRASE > 0) {
      const ohne4W = (roh: string): string => {
        let x = roh.toLowerCase();
        for (const wert of [ctx.ort, ctx.zeit]) {
          if (wert && wert.length >= 4) x = x.split(wert.toLowerCase()).join(" ");
        }
        return x;
      };
      const fenster = a.quelle === "korpus" ? 4 : PHRASE;
      // Nur inhaltstragende Ketten sperren. Fuenf Woerter, die zur Haelfte aus
      // "in", "und", "die", "der" bestehen, wiederholen sich in jedem deutschen
      // Text - sie zu verbieten kostete Laenge, ohne dass jemand eine Wiederholung
      // bemerkt haette.
      const inhaltlich = (kette: string[]): boolean =>
        kette.filter((x) => x.length >= 5).length >= 2;
      const wds = ohne4W(text).match(/[a-zäöüß]{2,}/g) || [];
      // Beide Seiten gleich normalisieren. Die Korpus-Sperre verglich bisher eine
      // Wortkette ohne Satzzeichen gegen Rohtext MIT Satzzeichen - "eine wurzel die"
      // stand dort als "eine wurzel, die" und wurde nie gefunden. Die Sperre lief
      // also praktisch leer.
      const bisherLow = (ohne4W(out.join(" ")).match(/[a-zäöüß]{2,}/g) || []).join(" ");
      let doppelt = false;
      for (let x = 0; x + fenster <= wds.length; x++) {
        const kette = wds.slice(x, x + fenster);
        if (inhaltlich(kette) && bisherLow.includes(kette.join(" "))) { doppelt = true; break; }
      }
      if (doppelt) { kurzGesperrt.add(a.id); continue; }
    }
    const anf = anfangVon(text);
    // Ein FORMELHAFTER Anfang („Der Einsatz ist", „Es geht um") nur einmal
    // je Text: Gemeldet „Der Einsatz ist die Krone eines Sieges …" und sechs
    // Sätze später „Der Einsatz ist eine Gruppe, die …" — die Sperre ließ
    // zwei zu, und in 63 % der Läufe standen beide da. Andere Anfänge dürfen
    // weiter zweimal vorkommen; die Formeln sind es, die als Schleife lesen.
    const formel = /^(der einsatz ist|es geht um|alles dreht sich|was zählt ist|auf dem spiel)/.test(anf);
    if (anf.split(" ").length >= 2 && (anfangZahl.get(anf) || 0) >= (formel ? 1 : 2)) { k.benutzt.add(a.id); continue; }
    gesetzteTexte.add(sig); anfangZahl.set(anf, (anfangZahl.get(anf) || 0) + 1);
    kurzGesperrt.clear();
    out.push(text);
    if (a.quelle === "markov") traceMarkov(a.text);
    pushTrace({ text, quelle: a.quelle, kategorie: a.kategorie || "—", typ: a.typ, phase, fueller: fueller.length ? fueller : undefined });
    gleicheInFolge = a.typ === letzterTyp ? gleicheInFolge + 1 : 0;
    flachInFolge = FLACH.has(a.typ) ? flachInFolge + 1 : 0;
    letzterTyp = a.typ;
    benutztBei.set(a.id, out.length);
    fortschreiben(k, a);
    if (a.verlangt) k.offenerKopf = false;
    if (a.quelle === "vorlage") fuegeteile++;
    if (a.kategorie === "was") wasGesetzt = true;
    // Nach dem Schlussbild kommt nichts mehr - und es gibt nur eines. Ohne diese
    // Regel standen zwei Schlussformeln in kausal verkehrter Reihenfolge im Text
    // ("Und der Bescheid war schon gueltig." vor "Damit war der Vorgang eroeffnet.")
    // und dahinter noch eine lose Requisite ("eine bleiche Boje").
    // ... aber nur, wenn das Schlussbild auch am Schluss steht. Bei „Reverse"
    // kommt die Phase „schluss" ZUERST — dort würde der Text nach dem ersten
    // Atom enden.
    if (a.kategorie === "endings" && schlussAmEnde) break;
  }
  let fertig = verfugen(out);
  // B: Perspektivwechsel — im Rekombinationspfad lief er bisher gar nicht, die
  // Einstellung „Ich/Du/Wir“ blieb wirkungslos.
  if (input.perspective && input.perspective !== "third" && input.perspective !== "auto") {
    // Ein wirkliches Ding statt des Wortes „das Objekt": Der Realitaetsmodus
    // bringt seine Gegenstaende mit, und das Ding soll zum Text passen.
    const dinge = MODE_DATA[input.mode || ""]?.nouns || [];
    const ding = dinge.length ? dinge[Math.floor(Math.random() * dinge.length)]! : "";
    fertig = applyPerspective([fertig], input.perspective, ctx.figur, ding).join(" ");
  } else if (input.perspective === "third") {
    fertig = pronominalize(fertig, ctx.figur, guessPronoun(ctx.figur));
  }
  pruefeAbgleich(fertig);                 // 0.1: verschlucktes Material protokollieren
  return fertig;
}

/**
 * F.3: Der Atomvorrat als fertige Textbausteine — für die Versformen.
 *
 * Reim und Haiku zerschnitten bisher fertige Prosa. Genau daher kamen Zeilen wie
 * "Was ich, bis ins Gebein." und "Sie, hält sich im Zaum.": Der Schnitt fiel
 * mitten in eine Fügung, weil der Umsetzer die Fügung nicht kennt. Die Atome
 * sind dagegen geschlossene Einheiten — wer aus ihnen WÄHLT, statt zu zerhacken,
 * kann nichts zerschneiden.
 *
 * Rahmen mit offenen Slots fallen heraus: Ein halb gefüllter Rahmen ist als Vers
 * unbrauchbar.
 */
export function buildVersAtome(bank: Bank, input: GenInput, model?: MarkovModel): string[] {
  const figur = (personKopf(splitSpeakers(normWho(input.who || ""))[0] || "") || "Jemand").trim();
  const pool = buildPool(bank, input.perspective, input.what, figur, model, input.markovMode);
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur, verb: "will",
  };
  const raus: string[] = [];
  for (const a of pool) {
    const t = fuelleKontext(a.text, ctx);
    if (offeneSlots(t)) continue;
    // Kopf-Atome ("⟨FIGUR⟩ stellt fest:") verlieren mit dem Doppelpunkt ihren
    // Rumpf und ergeben "Richard Doll stellt fest." - ein Satz ohne Aussage. Die
    // Wortzahl half dagegen nicht: Mit Titeln im Namen kommt er auf sechs.
    if (a.typ === "kopf") continue;
    const rein = t.replace(/[.!?…:;]+$/, "").trim();
    if (rein.split(/\s+/).length >= 2) raus.push(rein);
  }
  return [...new Set(raus)];
}
