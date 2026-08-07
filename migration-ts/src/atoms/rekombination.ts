// Rekombinations-Modus: baut den Text aus geprüften Atomen statt aus Schablonen.
// Pool = aktive Wortbank (offline annotiert) + geerntete Satzvorlagen.
import type { Bank, GenInput } from "../types";
import { deriveAtom } from "./derive";
import { passt, fortschreiben, fuelleKontext, fuelleSlot, offeneSlots, verfugen, ziehe, type PoolAtom, type Kontext, naechsterSlot }  from "./assemble";
import TEMPLATES from "./templates.data.json";
import { normWhere, normWhen, normWho } from "../generation/ctxnorm";
import { isFirstPerson, isSecondPerson } from "../generation/coherence";
import { extractLeadVerb, looksLikeFullClause } from "../generation/wordcls";
import { NOUN_GENDER } from "../generation/nouns.data";
import { applyPerspective, pronominalize, guessPronoun } from "../generation/shape";
import { resetTrace, pushTrace, pruefeAbgleich } from "./trace";
import { loadDramaData } from "../generation/dramaturgie";
import { loadKnobs } from "../features/knobs";
import { isSaneMarkov, type MarkovModel } from "../corpus";
import { properNames } from "../generation/coherence";
import { traceMarkov } from "../generation/markovTrace";

interface TemplateAtom { id: string; text: string; typ: string; verlangt: PoolAtom["verlangt"]; oeffnet: boolean }

/** Baut den Atom-Pool aus Bank und Vorlagen. Perspektivfremde Vorlagen bleiben draußen. */
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
      : lead.verb
        ? [`${P} ${lead.verb} ${kern}`, `Und wieder: ${P} ${lead.verb} ${kern}`]
        : looksLikeFullClause(lead.verb, kern)
          ? [kern, `Und wieder: ${kern}`, `Denn genau das geschieht: ${kern}`]
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
      gesehen.add(sig);
      pool.push({ ...d, id: `mk-${++i}`, quelle: "markov", kategorie: "", verlangt: null, bruchgrad: 1 });
    }
  }
  for (const [kat, arr] of Object.entries(bank as unknown as Record<string, string[]>)) {
    if (!Array.isArray(arr)) continue;
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
      verlangt: a.verlangt, oeffnet: a.oeffnet, bruchgrad: 0, fuehrt_ein: [] });
  }
  return pool;
}

/** Divergenz aus den Studio-Reglern ableiten (0–100). */
const divergenzOf = (input: GenInput): number =>
  (input.varLevel === "high" ? 85 : input.varLevel === "low" ? 30 : 60) + (input.instability >= 2 ? 10 : 0);

/** Erzeugt einen Text im Rekombinations-Modus. */
// Bausteine ohne finites Verb - drei davon in Folge ergeben ein Stakkato.
const FLACH = new Set(["nominalphrase", "praepositionalphrase", "fragment", "einwort"]);


export function buildRekombination(bank: Bank, input: GenInput, model?: MarkovModel): string {
  const pool = buildPool(bank, input.perspective, input.what, (normWho(input.who || "").split(",")[0] || "Jemand").trim(),
    model, input.markovMode);
  const ctx = {
    ort: normWhere(input.where || "") || "an einem Ort",
    zeit: normWhen(input.when || "") || "zu einer Zeit",
    figur: (normWho(input.who || "").split(",")[0] || "Jemand").trim(),
    verb: "will",
  };
  // Bis zur ZIELWORTZAHL bauen, nicht bis zu einer geschätzten Atomzahl: Atome sind
  // im Schnitt nur ~4 Wörter lang, eine feste Zahl verfehlt das Ziel um ein Vielfaches.
  const zielWoerter = Math.max(30, input.lenTarget ?? 110);
  const k: Kontext = { vorheriges: null, offenerKopf: false, entitaeten: new Map([[ctx.figur, { abstand: 0 }]]),
    tempus: null, divergenz: divergenzOf(input), benutzt: new Set() };
  // Stellschrauben aus den Einstellungen statt fest im Code (A.2)
  const knobs = loadKnobs();
  const W4_MAX = knobs.w4max;
  const FUEGE_DECKEL = knobs.fuegeteil / 100;
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
  const ABSTAND = knobs.abstand;   // so viele Elemente muss ein Baustein zurueckliegen
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
  const woerterJetzt = (): number => out.join(" ").split(/\s+/).filter(Boolean).length;

  for (let s = 0; s < 600; s++) {
    const fortschritt = woerterJetzt() / zielWoerter;
    if (fortschritt >= 1) break;
    // Phase aus dem Fortschritt in Wörtern ableiten (nicht aus der Position)
    const phase = fortschritt < 0.3 ? "exposition" : fortschritt < 0.6 ? "verdichtung" : fortschritt < 0.8 ? "umschlag" : "schluss";
    const letzte = fortschritt >= 0.92;
    let kand = pool.filter((a) => passt(a, k, phase));
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
    // Phasenordnung: ein Schlussbild erst wirklich am Ende, nicht schon bei 80 %
    if (fortschritt < 0.85) kand = kand.filter((a) => a.kategorie !== "endings");
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
    let text = fuelleKontext(a.text, ctx);
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
        || normWho(input.who || "").split(/[,;]/).some((x) => x.trim().toLowerCase() === w1.toLowerCase()));
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
    const anf = anfangVon(text);
    if (anf.split(" ").length >= 2 && (anfangZahl.get(anf) || 0) >= 2) { k.benutzt.add(a.id); continue; }
    gesetzteTexte.add(sig); anfangZahl.set(anf, (anfangZahl.get(anf) || 0) + 1);
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
    if (a.kategorie === "endings") break;
  }
  let fertig = verfugen(out);
  // B: Perspektivwechsel — im Rekombinationspfad lief er bisher gar nicht, die
  // Einstellung „Ich/Du/Wir“ blieb wirkungslos.
  if (input.perspective && input.perspective !== "third" && input.perspective !== "auto") {
    fertig = applyPerspective([fertig], input.perspective, ctx.figur, "das Objekt").join(" ");
  } else if (input.perspective === "third") {
    fertig = pronominalize(fertig, ctx.figur, guessPronoun(ctx.figur));
  }
  pruefeAbgleich(fertig);                 // 0.1: verschlucktes Material protokollieren
  return fertig;
}
