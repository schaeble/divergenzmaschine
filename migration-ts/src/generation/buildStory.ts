// Generierung: volle Kit-Fidelity (buildBaseModules) + Struktur + V4.1-Pipeline.
import type { Bank, GenInput, StoryKit } from "../types";
import { MODE_DATA } from "../modes.data";
import { pick, pickSane, clean, chance } from "../text-utils";
import { normWhere, normWhen, normWho } from "./ctxnorm";
import { makeDialogueScene, pickSpeakerForArchetype } from "./dialogue";
import { kleinerArtikel, postProcessText } from "./postprocess";
import { pickStructureBuilder } from "./structures";
import { looksLikeClausePhrase, safeCaseForm, weaveCast } from "./beats";
import { resetMarkovTrace, traceMarkov } from "./markovTrace";
import { markovSeenRecently, noteMarkov } from "./cooldown";
import { toneRhythm } from "./tone.shape";
import { archetypeAugmentList } from "./archetype";
import { extractLeadVerb, looksLikeFullClause, splitSpeakers, personKopf } from "./wordcls";
import { declineHookPhrase, ensureArticle } from "./declension";
import { applyDisruptor, applyRhythm, applyTension, paragraphize, applyPerspective, pronominalize, guessPronoun, entferneDubletten } from "./shape";
import { verwandleMotive, leseVerwandlungen } from "./verwandlung";
import { MarkovModel, isSaneMarkov, smoothMarkov } from "../corpus";
import { biasedAutoChoice } from "./autochoice";
import { buildVideoSequenceText } from "./video";
import { enforceWordTarget } from "./length";
import { buildRekombination, buildVersAtome } from "../atoms/rekombination";
import { buildBericht } from "./bericht";
import { buildMeldung } from "./meldung";
import { linkTrace } from "../atoms/trace";
import { linkMarkovTrace } from "./markovTrace";
import { applyEmphasis } from "./emphasis";
import { asProsePoem, asStrang, asReim, asHaiku, asDrama } from "./forms";
import { buildDramaturgie, hasDramaData } from "./dramaturgie";
import { MODE_OPTS, STRUCTURE_OPTS, PERSP_OPTS, RHYTHM_OPTS, werte } from "./optionen";

// Die Auflösungslisten für „auto" — ABGELEITET aus den Reglerlisten, nicht
// abgeschrieben. Vorher standen hier eigene Kopien, und sie waren in BEIDE
// Richtungen auseinandergelaufen:
//
//   fehlte hier: „rekombination" und „dramaturgie" — „Struktur: Auto" konnte
//   also ausgerechnet das Verfahren nie wählen, das im Studio die Vorgabe ist.
//   stand nur hier: „split" als Perspektive — ein Wert, den keine andere Stelle
//   auswertet. Wer auf Auto stand, bekam in einem von sechs Fällen eine
//   Perspektive, die nichts bewirkt.
//
// „auto" selbst fliegt immer raus: Es aufzulösen heißt, etwas anderes zu
// wählen als sich selbst.
const ohneAuto = (l: string[]): string[] => l.filter((x) => x !== "auto");
const MODES = ohneAuto(werte(MODE_OPTS));
// Zwei Stellungen bleiben aus dem Auto-Vorrat draußen, und beide Male aus
// einem Grund, den erst der Prüfstand gezeigt hat:
//
//   „dramaturgie" braucht Preset-2.0-Daten. Ohne sie fiele der Bau auf den
//   Normalweg zurück, und „Auto" hätte eine Stellung gewählt, die nichts tut.
//
//   „rekombination" kehrt im Zusammenbau FRÜH zurück und überspringt dabei die
//   dramaturgischen Phasen. Auf Auto gewählt, hätte sie Einstieg, Mitte und
//   Höhepunkt stillschweigend abgeschaltet — gemessen in rund der Hälfte der
//   Läufe, aufgefallen erst am Prüfstand „Struktur". Wer sie will, wählt sie;
//   sie ist im Studio ohnehin die Vorgabe.
//
// WAECHTER-OK: bewusste Ausnahmen, siehe Begründung.
const STRUCTURES = ohneAuto(werte(STRUCTURE_OPTS))
  .filter((x) => x !== "dramaturgie" && x !== "rekombination");
const PERSPECTIVES = ohneAuto(werte(PERSP_OPTS));
const RHYTHMS = ohneAuto(werte(RHYTHM_OPTS));
const resBiased = (ui: string, kind: string, opts: string[], aA: string, aB: string): string =>
  ui !== "auto" && opts.includes(ui) ? ui : (biasedAutoChoice(kind, aA, aB) || pick(opts));

/** Baut aus Bank + Eingabe die Bausteine (StoryKit) — volle Fidelity. */
export function buildKit(bank: Bank, input: GenInput, model?: MarkovModel): StoryKit {
  const archA = (input.archetypeA || "neutral").toLowerCase();
  const archB = (input.archetypeB || "neutral").toLowerCase();

  const modeKey = resBiased(input.mode, "mode", MODES, archA, archB);
  const M = MODE_DATA[modeKey] || MODE_DATA.bureau!;
  let structure = resBiased(input.structure, "structure", STRUCTURES, archA, archB);
  // "fragment" liest sich telegrammartig - bei Struktur "Auto" ausschließen,
  // damit Prosa fließend bleibt. Explizit gewählt bleibt Fragment erhalten.
  if (input.structure === "auto" && structure === "fragment") structure = pick(STRUCTURES.filter((x) => x !== "fragment"));
  const perspective = input.perspective === "auto" ? (biasedAutoChoice("perspective", archA, archB) || pick(PERSPECTIVES)) : input.perspective;
  let rhythm = resBiased(input.rhythm, "rhythm", RHYTHMS, archA, archB);
  // Ton gewichtet das Satzlängen-Profil mit: bei Rhythmus "Auto" bevorzugt den
  // ton-typischen Rhythmus (nüchtern -> klar, poetisch -> Atem, düster -> Fraktur …).
  if (input.rhythm === "auto") { const tr = toneRhythm(input.tone); if (tr && RHYTHMS.includes(tr) && chance(0.7)) rhythm = tr; }

  const W = normWhere(clean(input.where)) || "an einem Ort";
  const T = normWhen(clean(input.when)) || "zu einer Zeit";
  const PRaw = normWho(clean(input.who)) || "Jemand";
  const speakers = splitSpeakers(PRaw);
  // Der KOPF, nicht die ganze Figur: Die angehängte Verzierung des
  // Kontextwürfels („…, voller ungestellter Fragen") taugt nicht als
  // Satzsubjekt, und Rhythmus und Disruptor machten aus ihrem Komma eine
  // Satzgrenze — dann stand sie am Satzanfang und war wieder ein Subjekt.
  const P = personKopf(speakers[0] || PRaw);
  const A = clean(input.what) || "etwas";

  const aLead = extractLeadVerb(A);
  const Apure = aLead.rest;
  const AleadVerb = aLead.verb || "";
  const AisInfinitiveLed = !!aLead.isInfinitiveLed;
  const AisClause = !AisInfinitiveLed && looksLikeFullClause(aLead.verb, Apure);

  const markovMode = input.markovMode || "mix";
  const maybeMarkov = (fallback: string, prob = 0.42): string => {
    if (markovMode === "off" || !model) return fallback;
    if (markovMode === "on" || chance(prob)) {
      const m = smoothMarkov(model.generate(14));
      if (m && isSaneMarkov(m) && !markovSeenRecently(m)) { noteMarkov(m); traceMarkov(m); return m; }
    }
    return fallback;
  };

  const aug = (list: string[], key: string) => archetypeAugmentList(list, archA, archB, key);
  const motif = maybeMarkov(pickSane(aug(bank.motifs, "motifs")), 0.28);
  const hook = maybeMarkov(pickSane(aug(bank.hooks, "hooks")), 0.28);
  // Requisiten stehen immer mitten im Satz (…nimmt ${prop}); fuehrenden Artikel
  // klein normalisieren, damit die Schreibweise in der Wortbank egal ist.
  const prop = ensureArticle(pickSane(aug(bank.props, "props"), 1)).replace(/^(Ein|Eine|Einen|Einem|Einer|Eines|Der|Die|Das|Den|Dem|Des)\b/, (m) => m.toLowerCase());

  const hookIsClause = looksLikeClausePhrase(hook);
  const hookQuote = hookIsClause ? clean(hook).replace(/[.!?…]+$/, "") : "";
  const hookAcc = hookIsClause ? `den Satz „${hookQuote}“` : safeCaseForm(hook, declineHookPhrase(hook, "acc"));
  const hookDat = hookIsClause ? `dem Satz „${hookQuote}“` : safeCaseForm(hook, declineHookPhrase(hook, "dat"));
  const propAcc = safeCaseForm(prop, declineHookPhrase(prop, "acc"));
  const propDat = safeCaseForm(prop, declineHookPhrase(prop, "dat"));

  return {
    W, T, P, PRaw, A, motif, hook, hookAcc, hookDat, prop, propAcc, propDat,
    turn: maybeMarkov(pickSane(aug(bank.turns, "turns")), 0.28),
    obstacle: pickSane(aug(bank.obstacles, "obstacles")),
    stake: pickSane(aug(bank.stakes, "stakes")),
    ending: pickSane(aug(bank.endings, "endings")),
    speakerA: P, speakerB: speakers[1] || pickSpeakerForArchetype(archB),
    speakers: speakers.length >= 2 ? speakers : [P, pickSpeakerForArchetype(archB)],
    cast: speakers,
    mode: M, archetypeA: archA, archetypeB: archB, instability: input.instability,
    Apure, AleadVerb, AisClause, AisInfinitiveLed,
    structure, perspective, rhythm,
  };
}

/** Erzeugt einen Text zu Bank + Eingabe. */
export function buildStory(bank: Bank, input: GenInput, model?: MarkovModel): string {
  resetMarkovTrace();
  const kit = buildKit(bank, input, model);

  const lenTarget = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 110;
  // F.1: Beide Formen kehrten hier zurueck, BEVOR postProcessText lief - kein
  // Sprachschliff, keine Kohaerenzpruefung, keine Namensvereinheitlichung. Die
  // Nachbearbeitung ist bereits formbewusst (isLineForm ueberspringt Ton-Einschuebe
  // und die semantische Satzauslese), es fehlte nur der Weg dorthin.
  // Der Bericht referiert aus einem Faktenblatt statt aus dem Vorrat zu erzaehlen.
  // Er laeuft NICHT durch postProcessText: Die Nachbearbeitung ergaenzt Artikel,
  // zieht Saetze zusammen und streut Ton ein - alles Eingriffe, die einem Bericht
  // Fakten hinzufuegen oder wegnehmen wuerden.
  // Die eine Schliff-Regel, die auch hier gilt: Sie aendert keine Fakten, nur
  // einen Buchstaben. „… bemerkt Ein Bergsteiger" stand sonst auch im Bericht,
  // und seit der einfache Kopf den Zeitungsbericht an erster Stelle anbietet,
  // ist das der haeufigste Weg.
  if (input.form === "bericht") return kleinerArtikel(buildBericht(bank, input, (input.ressort as Parameters<typeof buildBericht>[2]) ?? "auto").text);
  // Die Meldung geht NICHT durch die Bank: Sie referiert nur aus dem
  // Faktenblatt. Deshalb steht sie vor allem, was Atome zieht.
  if (input.form === "meldung") return kleinerArtikel(buildMeldung(input, (input.ressort as Parameters<typeof buildMeldung>[1]) ?? "auto").text);
  if (input.form === "script") return postProcessText(makeDialogueScene(kit, lenTarget), input);
  if (input.form === "video") {
    return postProcessText(buildVideoSequenceText(kit, input.shots ?? 5, input.totalSec ?? 15, lenTarget), input);
  }
  if (input.form === "poem") {
    // Rekombination gilt auch fuers Prosagedicht: Der Zweig lag bisher hinter dieser
    // Abfrage und wurde nie erreicht - die Struktur "Rekombination (geprueft)" blieb
    // wirkungslos, ohne dass die Oberflaeche das sagte.
    const rk = input.structure === "rekombination" ? buildRekombination(bank, input, model) : "";
    if (rk.trim()) { const fertig = postProcessText(asProsePoem(rk), { ...input, form: "poem" }); linkTrace(fertig); linkMarkovTrace(fertig); return fertig; }
    const body = pickStructureBuilder(kit.structure === "fragment" ? "linear" : kit.structure)({ ...kit });
    return postProcessText(asProsePoem(body), { ...input, form: "poem" });
  }

  const verseForm = input.form === "reim" || input.form === "haiku" || input.form === "strang" || input.form === "drama";
  const effStructure = verseForm && kit.structure === "fragment" ? "linear" : kit.structure;
  // Rekombination: Atome mit geprüfter Schnittstelle statt Schablonen.
  //
  // Seit 4.269 gilt das auch für die fünf Erzählformen. Sie sind dem Sinn nach
  // keine eigenen Maschinen, sondern ANORDNUNGEN desselben geprüften Materials
  // (siehe STRUKTUR_PHASEN in assemble.ts). Gemessen glichen die fünf einander
  // zu 57–63 %, während die Rekombination bei 37–41 % zu allen lag — die Wahl
  // zwischen ihnen änderte weniger als die Wahl des Bauwegs.
  //
  // Die alten Schablonenbauer bleiben als AUFFANG stehen: Liefert der Assembler
  // nichts (leerer Vorrat, zu enge Filter), wird gebaut wie bisher. Ein Umbau,
  // der im Zweifel gar keinen Text erzeugt, wäre kein Fortschritt.
  // Geprüft wird die EINGESTELLTE Struktur, nicht die aufgelöste — und das ist
  // Absicht. Ein Versuch, hier die aufgelöste zu nehmen, machte den
  // Rekombinationsweg auf „Auto" erreichbar und schaltete damit Einstieg,
  // Mitte und Höhepunkt in rund der Hälfte der Läufe ab: Der Weg kehrt früh
  // zurück, bevor die Phasen eingesetzt werden. Der Prüfstand „Struktur" hat
  // es gemeldet, 227 Ausfälle in 459 Läufen.
  //
  // WAECHTER-OK: bewusste Teilmenge — „dramaturgie" fehlt, weil dieser Weg sie
  // gerade nicht bedienen kann.
  const ASSEMBLER = new Set(["rekombination", "linear", "reverse", "circle", "fragment", "object"]);
  if (input.form === "prose" && ASSEMBLER.has(input.structure || "")) {
    const rk = buildRekombination(bank, input, model);
    // Absaetze auch auf diesem Weg: Der Zweig kehrt vor paragraphize() zurueck,
    // die Rekombination lieferte deshalb immer einen einzigen Block - gemessen
    // 1,0 Absaetze in 51 von 51 Laeufen.
    if (rk.trim()) { const fertig = postProcessText(paragraphize(rk), input); linkTrace(fertig); linkMarkovTrace(fertig); return fertig; }
  }
  let text = (input.form === "prose" && input.structure === "dramaturgie" && hasDramaData())
    ? buildDramaturgie({ ...kit })
    : pickStructureBuilder(effStructure)({ ...kit });

  // Mehrere in "Wer" genannte Personen (Komma-getrennt) als Ensemble in die Prosa einweben.
  if (input.form === "prose" && kit.cast.length >= 2) text = weaveCast(text, kit.P, kit.cast);

  // Fragment ist jetzt fragmentierte Prosa (nicht mehr eine Zeilen-Liste) und
  // durchläuft daher den normalen Prosa-Pfad inkl. Längen-Auffüllung.
  if (input.form === "prose" && input.emphasis) text = applyEmphasis(text, kit, input.emphasis);

  text = applyDisruptor(text, input.disruptor).text;
  text = applyRhythm(text, kit.rhythm);
  if (input.form === "prose") text = applyTension(text, input.tension, { motifs: bank.motifs, hooks: bank.hooks });
  text = paragraphize(text);
  const paras = text.split(/\n\n+/).map(clean).filter(Boolean);
  text = effStructure === "object"
    ? paras.join("\n\n")
    : applyPerspective(paras, kit.perspective, kit.P, pick(kit.mode.nouns)).join("\n\n");
  if (kit.perspective === "third") text = pronominalize(text, kit.P, guessPronoun(kit.P));
  const finalText = postProcessText(text, input);
  const anchor = kit.ending || kit.Apure;
  if (input.form === "reim") return asReim(finalText, anchor, lenTarget, buildVersAtome(bank, input, model));
  if (input.form === "haiku") {
    // F.3: Der Atomvorrat als Material. Er wird unabhaengig vom Prosatext gebaut -
    // die Versform soll waehlen, nicht zerschneiden.
    return asHaiku(finalText, anchor, lenTarget, buildVersAtome(bank, input, model));
  }
  if (input.form === "strang") return asStrang(finalText, anchor, lenTarget);
  if (input.form === "drama") return asDrama(finalText, kit.speakerA, kit.speakerB || kit.P);
  // Ganz zum Schluss noch einmal: Das Auffüllen auf die Ziellänge hängt Material
  // an und kann dabei denselben Satz zweimal nebeneinander stellen. Gemessen war
  // das die Hauptquelle der Satzdubletten — vor dem Auffüllen zu putzen half
  // fast nichts.
  // Motivverwandlung ganz zum Schluss: Sie zählt Vorkommen im FERTIGEN Text.
  // Vorher gezählt, würde die Längenauffüllung ihr Material nachliefern und die
  // Zählung wäre falsch.
  return verwandleMotive(
    entferneDubletten(enforceWordTarget(finalText, lenTarget, bank, model, input.markovMode || "mix")),
    leseVerwandlungen(bank.verwandlungen));
}
