// Selbsttest: prüft pro Feature, ob es im erzeugten Text nachweisbar WIRKT.
// Kein Qualitätsurteil — nur „greift / greift sporadisch / greift nicht".
// Mehrfachläufe, weil viele Features absichtlich probabilistisch sind.
import type { GenInput, FormKind, Bank } from "../types";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus, loadPersistentCorpus, type MarkovModel } from "../corpus";
import { getMarkovTrace } from "../generation/markovTrace";
import { TONE_DATA } from "../generation/tone.data";
import { liveTexts } from "./livepools";
import { hasDramaData } from "../generation/dramaturgie";
import { RESSORT_IDS } from "./ressorts";
import { loadBank } from "../storage";
import { runRanking, bestOf } from "../generation/scoring";
import { splitSentences } from "../text-utils";
import { tenseBreakRatio, phraseRepeatRatio, castSpread, perspectiveBreakRatio } from "../generation/coherence";

export type Verdict = "ok" | "sporadic" | "dead" | "skipped";
export interface FeatureResult { id: string; label: string; group: string; runs: boolean[]; verdict: Verdict; note: string; }

const RUNS = 16;

const baseInput = (): GenInput => ({
  where: "im Hafen", when: "im Winter", who: "die Kartografin", what: "ein Wunder geschieht",
  tone: "neutral", varLevel: "mid", form: "prose" as FormKind,
  structure: "linear", mode: "auto", perspective: "third",
  rhythm: "clean", markovMode: "off", disruptor: "off",
  archetypeA: "neutral", archetypeB: "neutral", instability: 0,
  polish: false, polishStyle: "surreal_precise",
  lenTarget: 120, tension: "off",
  emphasis: { wo: 0, wann: 0, wer: 0, was: 0 },
});

const gen = (over: Partial<GenInput>, bank: Bank, model?: MarkovModel): string =>
  buildStory(bank, { ...baseInput(), ...over }, model);

const has = (text: string, phrases: string[], minLen = 5): boolean => {
  const low = text.toLowerCase();
  return phrases.some((p) => { const t = (p || "").trim().toLowerCase(); return t.length >= minLen && low.includes(t); });
};
const avgSentLen = (t: string): number => {
  const s = splitSentences(t).filter(Boolean);
  if (!s.length) return 0;
  return s.reduce((n, x) => n + (x.match(/\S+/g) || []).length, 0) / s.length;
};
const words = (t: string): number => (t.match(/\S+/g) || []).length;
// Charakteristische Wendungen der 4W-Gewichtung (aus emphasis.ts) — die Gewichtung
// verschiebt die Verteilung, nicht die Gesamtlänge; daher inhaltlich prüfen.
const EMPH_MARK = /(Der Ort |liegt die Luft schwer|verschieben sich die Schatten|hat jedes Ding zwei Gesichter|klingt jeder Schritt doppelt|scheint die Entfernung zu lügen|hält der Raum den Atem an|scheint zuzuhören|gibt keine Auskunft|merkt sich jede Bewegung|ordnet die Dinge neu|lässt niemanden unberührt|Es war die Zeit, als|und die Zeit |hält \S+ inne|sucht \S+ nach Worten|spürt \S+ die Kälte|Reglos steht|Lange wartet|Still bleibt|Aufmerksam beobachtet|Und wieder: |Denn genau das geschieht|Im Kern bleibt es dabei|Es geht weiter um eines)/;

/** Führt den Selbsttest aus. onStep meldet Fortschritt (fertige Features). */
export function runSelfTest(onStep?: (done: number, total: number, label: string) => void): FeatureResult[] {
  const bank = loadBank();
  const bankAll: string[] = [];
  for (const v of Object.values(bank as unknown as Record<string, string[]>)) if (Array.isArray(v)) bankAll.push(...v);
  const pools = (() => { try { return liveTexts(); } catch { return []; } })();
  const corpusLen = (() => { try { return loadPersistentCorpus().length; } catch { return 0; } })();
  const model = (() => { try { return corpusLen >= 200 ? buildModelFromCorpus(2) : undefined; } catch { return undefined; } })();

  // Ein Feature-Test: liefert pro Lauf true (hat gewirkt) / false.
  interface Spec { id: string; label: string; group: string; note: string; probe: () => boolean; skip?: string; }
  const specs: Spec[] = [
    // ── Quellen: hinterlassen direkt Spuren im Text ──
    { id: "wortbank", label: "Wortbank", group: "Quellen", note: "Bank-Einträge erscheinen im Text",
      probe: () => has(gen({}, bank), bankAll) },
    { id: "ton", label: "Ton", group: "Quellen", note: "Ton-Einschübe erscheinen im Text",
      probe: () => { const td = TONE_DATA["mystery"]; return td ? has(gen({ tone: "mystery" }, bank), [...td.opener, ...td.flavor]) : false; } },
    { id: "kontext4w", label: "4W-Kontext", group: "Quellen", note: "Wo/Wann/Wer/Was erscheinen im Text",
      probe: () => { const t = gen({}, bank); return has(t, ["im Hafen", "im Winter", "Kartografin", "Wunder"], 4); } },
    { id: "pools", label: "Lebendige Pools", group: "Quellen", note: "Pool-Begriffe erscheinen im Text",
      skip: pools.length ? undefined : "Pools noch leer — erst Texte merken",
      probe: () => has(gen({}, bank), pools) },
    { id: "markov", label: "Markov", group: "Quellen", note: "Markov-Fragmente werden eingewoben",
      skip: model ? undefined : "Korpus zu klein — erst im Korpus-Tab Text hinzufügen",
      probe: () => { gen({ markovMode: "on" }, bank, model); return getMarkovTrace().length > 0; } },

    // ── Formen: eigener Bauweg ──
    { id: "form_poem", label: "Form: Prosagedicht", group: "Formen", note: "Zeilenumbrüche statt Fließtext",
      probe: () => gen({ form: "poem" as FormKind }, bank).includes("\n") },
    { id: "form_haiku", label: "Form: Haiku", group: "Formen", note: "Kurze Zeilenform",
      probe: () => { const t = gen({ form: "haiku" as FormKind }, bank); return t.split("\n").filter(Boolean).length >= 3; } },
    { id: "form_reim", label: "Form: Reim", group: "Formen", note: "Verszeilen",
      probe: () => gen({ form: "reim" as FormKind }, bank).split("\n").filter(Boolean).length >= 2 },
    { id: "form_strang", label: "Form: Gedicht-Strang", group: "Formen", note: "Verszeilen",
      probe: () => gen({ form: "strang" as FormKind }, bank).split("\n").filter(Boolean).length >= 2 },
    { id: "form_script", label: "Form: Szene/Dialog", group: "Formen", note: "Sprecherzeilen",
      probe: () => /(:|—)/.test(gen({ form: "script" as FormKind, who: "Anna, Bert" }, bank)) },
    { id: "form_video", label: "Form: Multi-Shot", group: "Formen", note: "Shot-Gliederung",
      probe: () => { const t = gen({ form: "video" as FormKind, shots: 4, totalSec: 12 }, bank); return t.split("\n").filter(Boolean).length >= 3; } },

    // Prosa fehlte, obwohl sie die Grundform ist. Sie hat keinen eigenen
    // Bauweg wie Vers oder Dialog — genau deshalb wurde sie übersehen: Es gab
    // nichts Auffälliges zu prüfen. Ihr Kennzeichen ist, dass sie NICHT
    // zeilenweise gesetzt wird.
    // Der Ausdruck `!/\n[^\n]/` war falsch: Er verlangt, dass NIRGENDS ein
    // Zeilenumbruch von einem Zeichen gefolgt wird — bei einem Absatz („\n\n")
    // steht hinter dem zweiten Umbruch aber der nächste Buchstabe. Die Prüfung
    // schlug also bei jedem korrekten Absatz an und meldete die Grundform der
    // Maschine als tot. Gemessen: 20 von 20 einwandfreien Prosatexten lösten
    // den Fehlalarm aus.
    //
    // Das Kennzeichen ist nicht „kein Umbruch", sondern „keine Verszeilen":
    // Absätze ja, Zeilenbruch INNERHALB eines Absatzes nein.
    { id: "form_prose", label: "Form: Prosa", group: "Formen", note: "Fließtext in Absätzen, keine Verszeilen",
      probe: () => { const t = gen({ form: "prose" as FormKind }, bank).trim();
        return words(t) > 20 && t.split(/\n{2,}/).every((abs) => !abs.trim().includes("\n")); } },
    // Bericht und Meldung fehlten ganz — die beiden Formen, die der Autopilot
    // am häufigsten setzt und die eigene Prüfstände mit tausenden Läufen
    // haben. In der Anzeige „greifen alle Features?" kamen sie nicht vor.
    { id: "form_bericht", label: "Form: Bericht", group: "Formen", note: "Dachzeile, Schlagzeile, Vorspann, Faktenkasten",
      probe: () => { const t = gen({ form: "bericht" as FormKind, lenTarget: 220 }, bank);
        const abs = t.split(/\n{2,}/).filter(Boolean);
        return abs.length >= 3 && /Faktenkasten/.test(t); } },
    { id: "form_meldung", label: "Form: Meldung", group: "Formen", note: "Kurznachricht mit Datum und Ort",
      probe: () => { const t = gen({ form: "meldung" as FormKind }, bank); return words(t) > 8 && words(t) < 140; } },

    // ── Strukturen: unterscheidbarer Aufbau ──
    { id: "struct", label: "Struktur (Linear/Reverse/Kreis/…)", group: "Struktur", note: "Bauwege liefern verschiedene Texte",
      probe: () => { const a = gen({ structure: "linear" }, bank), b = gen({ structure: "reverse" }, bank), c = gen({ structure: "circle" }, bank); return new Set([a, b, c]).size >= 2; } },
    { id: "dramaturgie", label: "Dramaturgie (Preset 2.0)", group: "Struktur", note: "Erzählbogen des 2.0-Presets",
      skip: hasDramaData() ? undefined : "Kein 2.0-Preset mit Dramaturgie aktiv",
      probe: () => gen({ structure: "dramaturgie" }, bank) !== gen({ structure: "linear" }, bank) },

    // Der Rekombinationsweg ist ein eigener Zusammenbau und im Studio die
    // VORGABE — er fehlte hier trotzdem. Geprüft wird, dass er einen anderen
    // Text liefert als der lineare Weg.
    { id: "rekombination", label: "Rekombination", group: "Struktur", note: "Eigener Zusammenbau aus Atomen",
      probe: () => { const a = gen({ structure: "rekombination" }, bank), b = gen({ structure: "linear" }, bank);
        return words(a) > 20 && a !== b; } },
    // Motivverwandlungen: die achte Liste der Wortbank. Ihre Einträge stehen
    // nie im Text — sie sagen, was aus einem Motiv wird, wenn es wiederkehrt.
    // Deshalb wird die WIRKUNG geprüft, nicht das Vorkommen.
    { id: "verwandlungen", label: "Motivverwandlungen", group: "Struktur", note: "Motive wandeln sich bei Wiederkehr",
      skip: (bank.verwandlungen || []).length ? undefined : "Aktives Preset trägt keine Motivverwandlungen",
      probe: () => { const paare = (bank.verwandlungen || []).map((x) => x.split(/\s*[→>-]+\s*/)[1] || "").filter(Boolean);
        return paare.length > 0 && has(gen({ structure: "rekombination" }, bank), paare); } },

    // ── Shaper: verändern den fertigen Text ──
    { id: "perspektive", label: "Perspektive", group: "Shaper", note: "Ich/Du/Wir tauchen auf",
      probe: () => { const t = gen({ perspective: "first" }, bank).toLowerCase(); return /\b(ich|mir|mich|mein)\b/.test(t); } },
    { id: "rhythmus", label: "Rhythmus", group: "Shaper", note: "Satzlängen verschieben sich",
      probe: () => Math.abs(avgSentLen(gen({ rhythm: "staccato" }, bank)) - avgSentLen(gen({ rhythm: "long" }, bank))) > 0.5 },
    { id: "spannung", label: "Spannung (Peak)", group: "Shaper", note: "Hüllkurve verändert den Text",
      probe: () => gen({ tension: "low", lenTarget: 200 }, bank) !== gen({ tension: "off", lenTarget: 200 }, bank) },
    // Das Urteil „keine Wirkung" ist hier RICHTIG, und die Ursache ist bekannt:
    // `applyDisruptor` feuert wie vorgesehen (300 Läufe bei „on": 100-mal, also
    // die vorgesehenen 33 %), aber sein Einschub hängt am Textende — und
    // `enforceWordTarget` kürzt von hinten, sobald der Text über der Zielzahl
    // liegt. Gemessen: 0 von 120 fertigen Texten trugen eine der drei
    // charakteristischen Wendungen, obwohl sie einzeln 44 von 52 Durchgängen
    // durch Rhythmus, Spannung, Absätze und Nachbearbeitung überstehen.
    //
    // Der Selbsttest bleibt also, wie er ist. Er meldet keinen Fehler in sich,
    // sondern einen in der Maschine.
    { id: "disruptor", label: "Disruptor", group: "Shaper", note: "Bruch wird eingefügt — greift derzeit nicht: der Einschub steht am Textende und wird von der Längenregelung abgeschnitten",
      probe: () => { const t = gen({ disruptor: "on" }, bank); return /(Drei Jahre später|Ich übernehme hier|weiß, dass sie erzählt wird|—\n|\(Dieser Satz)/.test(t); } },
    { id: "instabilitaet", label: "Instabilität", group: "Shaper", note: "Figuren-Instabilität wirkt",
      probe: () => gen({ instability: 2 }, bank) !== gen({ instability: 0 }, bank) },
    { id: "modus", label: "Modus (Realitätsmodus)", group: "Shaper", note: "Modus-Material unterscheidet sich",
      probe: () => gen({ mode: "bureau" }, bank) !== gen({ mode: "myth" }, bank) },
    { id: "archetyp", label: "Archetyp A/B", group: "Shaper", note: "Archetyp-Wortpools wirken",
      probe: () => gen({ archetypeA: "skorpion" }, bank) !== gen({ archetypeA: "neutral" }, bank) },
    { id: "varianz", label: "Varianz", group: "Shaper", note: "Variationsgrad wirkt",
      probe: () => gen({ varLevel: "high" }, bank) !== gen({ varLevel: "low" }, bank) },

    // ── Steuerung ──
    { id: "textlaenge", label: "Textlänge", group: "Steuerung", note: "Zielwortzahl wird angesteuert",
      probe: () => { const k = words(gen({ lenTarget: 60 }, bank)), l = words(gen({ lenTarget: 260 }, bank)); return l > k + 40; } },
    { id: "tempus", label: "Tempus-Wächter", group: "Kohärenz", note: "erkennt Zeitebenen-Sprünge (wirkt in der Bestenauslese)",
      probe: () => tenseBreakRatio("Der Hafen lag still. Ein Mann ging über den Steg. Die Kornkammern sind leer. Man erkannte nichts. Die Uhr tickt weiter.") > tenseBreakRatio("Der Hafen lag still. Ein Mann ging über den Steg. Die Möwen kreisten hoch. Später wurde es dunkel. Niemand kam zurück.") },
    { id: "phrasen", label: "Phrasen-Wiederholung", group: "Kohärenz", note: "erkennt wiederkehrende Versatzstücke (3-/4-Gramme)",
      probe: () => phraseRepeatRatio("Der Steg bricht unter ihrem Schritt. Es riecht wie Ruß auf Gold. Der Steg bricht unter ihrem Schritt. Es riecht wie Ruß auf Gold.") > 0.1 },
    { id: "perspektive_k", label: "Perspektiv-Wächter", group: "Kohärenz", note: "erkennt Ich-/Du-Formen in einer Er-Erzählung",
      probe: () => perspectiveBreakRatio("Tom wartet am Kai. Aber du darfst nicht sprechen. Er nimmt die Glocke. Ich sehe nichts.", "third") > 0 && perspectiveBreakRatio("Tom wartet am Kai. Er nimmt die Glocke. Der Kran steht still.", "third") === 0 },
    { id: "figuren", label: "Figurendisziplin", group: "Kohärenz", note: "erkennt neu eingeführte Eigennamen",
      probe: () => castSpread("Baucis wartet am Fenster. Zar Peter unterschreibt den Erlass. Ludwig zögert im Saal. Philemon schweigt.", ["Baucis"]) > castSpread("Baucis wartet am Fenster. Baucis zählt die Stunden. Baucis schweigt.", ["Baucis"]) },
    { id: "emphasis", label: "4W-Stärke", group: "Steuerung", note: "Gewichtete Zusatzsätze erscheinen im Text (Gesamtlänge bleibt stabil)",
      probe: () => EMPH_MARK.test(gen({ emphasis: { wo: 3, wann: 3, wer: 3, was: 3 } }, bank)) },
    // Das Ressort steuert den Bericht: Es bestimmt Betroffene, Einheiten,
    // Rollen und Größen. Es fehlte, obwohl es der wirksamste Regler dieser
    // Form ist — geprüft wird, dass zwei Ressorts verschiedene Berichte geben.
    { id: "ressort", label: "Ressort (Bericht)", group: "Steuerung", note: "Ressort bestimmt Größen, Rollen und Betroffene",
      probe: () => {
        const a = gen({ form: "bericht" as FormKind, ressort: RESSORT_IDS[0], lenTarget: 200 }, bank);
        const b = gen({ form: "bericht" as FormKind, ressort: RESSORT_IDS[RESSORT_IDS.length - 1], lenTarget: 200 }, bank);
        return words(a) > 20 && a !== b;
      } },

    // ── Auslese: wirkt NICHT im einzelnen Text, sondern in der Wahl ──
    //
    // Diese vier Stellschrauben gingen dem Selbsttest bisher ganz durch die
    // Lappen, und zwar aus einem strukturellen Grund: Er misst, ob ein Feature
    // im ERZEUGTEN TEXT Spuren hinterlässt, und ruft dafür `buildStory`.
    // Neuheit, Überraschung, Figurendisziplin und Umwelt greifen aber erst
    // eine Stufe später — sie entscheiden, WELCHER von zwölf Kandidaten
    // gewinnt. In `buildStory` kommen sie nicht vor, also konnten sie dort
    // auch nicht auffallen.
    //
    // Geprüft wird deshalb, was sie tun sollen: die Wahl verschieben.
    { id: "neuheit", label: "Neuheit (Abstand zur Schatzkammer)", group: "Auslese",
      note: "verschiebt die Wahl unter den Kandidaten",
      probe: () => {
        const inp = baseInput();
        const ohne = runRanking(bank, inp, model, 8, 3, { noveltyWeight: 0 });
        const mit = runRanking(bank, inp, model, 8, 3, { noveltyWeight: 1 });
        return !!ohne.all.length && !!mit.all.length && ohne.all[0]!.score !== mit.all[0]!.score;
      } },
    { id: "ueberraschung", label: "Überraschung", group: "Auslese",
      note: "verschiebt die Wahl unter den Kandidaten",
      probe: () => {
        const inp = baseInput();
        const ohne = runRanking(bank, inp, model, 8, 3, { surpriseWeight: 0 });
        const mit = runRanking(bank, inp, model, 8, 3, { surpriseWeight: 1, surpriseTarget: 0.9 });
        return !!ohne.all.length && !!mit.all.length && ohne.all[0]!.score !== mit.all[0]!.score;
      } },
    { id: "figurendisziplin", label: "Figurendisziplin (Regler)", group: "Auslese",
      note: "der Regler bestraft fremde Namen in der Wahl",
      probe: () => {
        const inp = baseInput();
        const ohne = runRanking(bank, inp, model, 8, 3, { castDiscipline: 0, expectedCast: ["die Kartografin"] });
        const mit = runRanking(bank, inp, model, 8, 3, { castDiscipline: 1, expectedCast: ["die Kartografin"] });
        return !!ohne.all.length && !!mit.all.length && ohne.all[0]!.score !== mit.all[0]!.score;
      } },
    { id: "umwelt", label: "Umwelt (Nahrung/Gift)", group: "Auslese",
      note: "die Umweltzeichen drehen die Auswahl",
      probe: () => {
        const inp = baseInput();
        const zeichen = [...(bank.motifs || []), ...(bank.props || [])].slice(0, 6).join(", ");
        if (!zeichen.trim()) return false;
        const r = bestOf(bank, inp, model, 8, { umwelt: { zeichen, wirkung: "nahrung" } });
        return !!r.umwelt;
      } },
  ];

  const out: FeatureResult[] = [];
  specs.forEach((sp, i) => {
    onStep?.(i, specs.length, sp.label);
    if (sp.skip) { out.push({ id: sp.id, label: sp.label, group: sp.group, runs: [], verdict: "skipped", note: sp.skip }); return; }
    const runs: boolean[] = [];
    for (let r = 0; r < RUNS; r++) {
      let ok = false;
      try { ok = sp.probe(); } catch { ok = false; }
      runs.push(ok);
    }
    const hits = runs.filter(Boolean).length;
    const verdict: Verdict = hits === 0 ? "dead" : hits >= Math.ceil(RUNS * 0.75) ? "ok" : "sporadic";
    out.push({ id: sp.id, label: sp.label, group: sp.group, runs, verdict, note: sp.note });
  });
  onStep?.(specs.length, specs.length, "");
  return out;
}
