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
import { loadBank } from "../storage";
import { splitSentences } from "../text-utils";
import { tenseBreakRatio, phraseRepeatRatio, castSpread } from "../generation/coherence";

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

    // ── Strukturen: unterscheidbarer Aufbau ──
    { id: "struct", label: "Struktur (Linear/Reverse/Kreis/…)", group: "Struktur", note: "Bauwege liefern verschiedene Texte",
      probe: () => { const a = gen({ structure: "linear" }, bank), b = gen({ structure: "reverse" }, bank), c = gen({ structure: "circle" }, bank); return new Set([a, b, c]).size >= 2; } },
    { id: "dramaturgie", label: "Dramaturgie (Preset 2.0)", group: "Struktur", note: "Erzählbogen des 2.0-Presets",
      skip: hasDramaData() ? undefined : "Kein 2.0-Preset mit Dramaturgie aktiv",
      probe: () => gen({ structure: "dramaturgie" }, bank) !== gen({ structure: "linear" }, bank) },

    // ── Shaper: verändern den fertigen Text ──
    { id: "perspektive", label: "Perspektive", group: "Shaper", note: "Ich/Du/Wir tauchen auf",
      probe: () => { const t = gen({ perspective: "first" }, bank).toLowerCase(); return /\b(ich|mir|mich|mein)\b/.test(t); } },
    { id: "rhythmus", label: "Rhythmus", group: "Shaper", note: "Satzlängen verschieben sich",
      probe: () => Math.abs(avgSentLen(gen({ rhythm: "staccato" }, bank)) - avgSentLen(gen({ rhythm: "long" }, bank))) > 0.5 },
    { id: "spannung", label: "Spannung (Peak)", group: "Shaper", note: "Hüllkurve verändert den Text",
      probe: () => gen({ tension: "low", lenTarget: 200 }, bank) !== gen({ tension: "off", lenTarget: 200 }, bank) },
    { id: "disruptor", label: "Disruptor", group: "Shaper", note: "Bruch wird eingefügt (absichtlich sporadisch)",
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
    { id: "figuren", label: "Figurendisziplin", group: "Kohärenz", note: "erkennt neu eingeführte Eigennamen",
      probe: () => castSpread("Baucis wartet am Fenster. Zar Peter unterschreibt den Erlass. Ludwig zögert im Saal. Philemon schweigt.", ["Baucis"]) > castSpread("Baucis wartet am Fenster. Baucis zählt die Stunden. Baucis schweigt.", ["Baucis"]) },
    { id: "emphasis", label: "4W-Stärke", group: "Steuerung", note: "Gewichtete Zusatzsätze erscheinen im Text (Gesamtlänge bleibt stabil)",
      probe: () => EMPH_MARK.test(gen({ emphasis: { wo: 3, wann: 3, wer: 3, was: 3 } }, bank)) },
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
