// Preset-Assistent: leitet offline Schritt für Schritt durch die Kategorien
// (7 Kern-Kategorien der Wortbank + optionale Preset-2.0-Dramaturgie) und
// speichert am Ende ein eigenes Preset. Keine KI, keine Netzverbindung nötig.
import { el, select, button } from "./dom";
import { icon } from "./icons";
import { saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, saveActiveBankLabel, saveCurrentBankAsUserPreset } from "../wordbank";
import { DEFAULT_BANK, BANK_KEYS } from "../constants";
import type { Bank, BankKey } from "../types";
import { setActive2, saveUserPreset2, type Active2 } from "../features/preset2";
import { setDramaData } from "../generation/dramaturgie";

const shuffle = <T>(a: T[]): T[] => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; };
const lines = (v: string): string[] => v.split("\n").map((s) => s.trim()).filter(Boolean);

const CORE: [BankKey, string, string][] = [
  ["motifs", "Motive", "Kurze, bildhafte Phrasen (3–8 Wörter), ohne Punkt am Ende, z. B. „ein leerer Bahnhof am Nachmittag“."],
  ["hooks", "Hooks", "Auslösende Details/Reize, die neugierig machen, z. B. „eine rote Feder im falschen Winkel“."],
  ["props", "Requisiten", "Gegenstände, z. B. „ein Kompass“, „eine Muschel“. Bei uneindeutigen Nomen den Artikel angeben."],
  ["turns", "Wendungen", "Wendepunkte als kurzer Satz/Phrase, z. B. „eine Katze führt den Weg“."],
  ["obstacles", "Hindernisse", "Was sich der Figur widersetzt, z. B. „die Tür bleibt verschlossen“."],
  ["stakes", "Einsätze", "Was auf dem Spiel steht, z. B. „ihr letzter Name“."],
  ["endings", "Enden", "Schluss-Bilder oder -Sätze, z. B. „das Licht bleibt an, niemand kommt“."],
];

type DKey = "einstieg" | "mitte" | "hoehepunkt" | "schluss" | "ausloeser" | "veraenderungen" | "konflikte" | "zeitanomalien" | "regeln";
const DRAMA: [DKey, string, string][] = [
  ["einstieg", "Einstieg (Erzählbogen)", "Wie der Text beginnt — 2–3 knappe Anfangs-Phasen."],
  ["mitte", "Mitte", "3–4 Phasen der Entwicklung."],
  ["hoehepunkt", "Höhepunkt", "1–2 Zuspitzungen."],
  ["schluss", "Schluss", "2–3 Schluss-Stilworte, z. B. offen, melancholisch."],
  ["ausloeser", "Auslöser", "Was die Wende in Gang setzt."],
  ["veraenderungen", "Veränderungen", "Wie sich Figur oder Welt wandelt."],
  ["konflikte", "Konflikte", "Typische Spannungen/Gegensätze."],
  ["zeitanomalien", "Zeitanomalien", "Brüche in der Zeit (optional)."],
  ["regeln", "Regeln / Naturgesetze", "Weltregeln, die im Text gelten."],
];
const DRAMA_EX: Record<DKey, string[]> = {
  einstieg: ["ein Morgen, der zu früh beginnt", "eine Ankunft ohne Grund", "die Stille vor dem ersten Wort"],
  mitte: ["die Dinge verschieben sich unmerklich", "eine zweite Möglichkeit taucht auf", "das Vertraute wird fremd"],
  hoehepunkt: ["alles kippt in einem Satz", "die Wahrheit zeigt ihr Gesicht"],
  schluss: ["offen", "melancholisch", "ein leises Verstummen"],
  ausloeser: ["ein Anruf, der niemandem gehört", "ein gefundener Gegenstand", "ein Wort zu viel"],
  veraenderungen: ["die Figur verliert ihren Namen", "der Ort beginnt sich zu erinnern"],
  konflikte: ["Nähe gegen Flucht", "Wissen gegen Vergessen", "Pflicht gegen Sehnsucht"],
  zeitanomalien: ["ein Tag wiederholt sich halb", "die Uhr springt zurück"],
  regeln: ["wer schläft, altert doppelt", "Spiegel zeigen nur Vergangenes"],
};
const POOL_EX = ["ein verlassener Leuchtturm", "die Kartografin", "eine Spieluhr ohne Melodie", "ein Bahnwärterhaus im Nebel"];
const TONE_OPTS: [string, string][] = [["", "(kein)"], ["neutral", "Neutral"], ["mystery", "Mystery"], ["poetic", "Poetisch"], ["melancholisch", "Melancholisch"], ["dark", "Düster"], ["unheimlich", "Unheimlich"], ["uplifting", "Hoffnungsvoll"], ["zaertlich", "Zärtlich"], ["traeumerisch", "Träumerisch"], ["nuechtern", "Nüchtern"], ["ironisch", "Ironisch"], ["humorous", "Humorvoll"]];

const bankExamples = (key: BankKey): string[] => {
  const set = new Set<string>();
  for (const p of Object.values(getAllPresets())) { const arr = (p.bank as Record<string, string[]>)[key]; if (Array.isArray(arr)) arr.forEach((x) => { const v = (x || "").trim(); if (v) set.add(v); }); }
  return shuffle([...set]).slice(0, 6);
};

interface WData { bank: Partial<Record<BankKey, string[]>>; drama: Partial<Record<DKey, string[]>>; pools: string[]; tone: string; name: string; }

export function openPresetWizard(onDone: (userId: string | null) => void): void {
  const data: WData = { bank: {}, drama: {}, pools: [], tone: "", name: "" };

  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  const finish = (id: string | null): void => { overlay.remove(); onDone(id); };
  close.addEventListener("click", () => finish(null));
  overlay.addEventListener("click", (e) => { if (e.target === overlay) finish(null); });

  const body = el("div", { class: "modal-body wiz-body" });
  const foot = el("div", { class: "wiz-foot" });
  const card = el("div", { class: "modal-card wizard" },
    el("div", { class: "modal-head" }, el("h2", {}, "Preset-Assistent"), close),
    body, foot);
  overlay.append(card);
  document.body.append(overlay);

  // Schrittfolge: Intro → 7 Kern → Gate → 9 Dramaturgie → Pools → Ton → Speichern
  type Step = { kind: "intro" } | { kind: "bank"; k: BankKey; label: string; help: string }
    | { kind: "gate" } | { kind: "drama"; k: DKey; label: string; help: string }
    | { kind: "pools" } | { kind: "tone" } | { kind: "save" };
  const steps: Step[] = [
    { kind: "intro" },
    ...CORE.map(([k, label, help]) => ({ kind: "bank", k, label, help } as Step)),
    { kind: "gate" },
    ...DRAMA.map(([k, label, help]) => ({ kind: "drama", k, label, help } as Step)),
    { kind: "pools" },
    { kind: "tone" },
    { kind: "save" },
  ];
  const saveIndex = steps.length - 1;
  const gateIndex = steps.findIndex((s) => s.kind === "gate");
  let i = 0;
  let commit: () => void = () => {};

  const areaStep = (label: string, help: string, value: string[], examples: string[], onCommit: (v: string[]) => void, total: number, num: number): void => {
    body.append(el("div", { class: "muted wiz-prog" }, `Schritt ${num} von ${total}`));
    body.append(el("h3", { class: "wiz-h" }, label));
    body.append(el("p", { class: "muted wiz-help" }, help));
    const ta = el("textarea", { class: "wiz-ta", placeholder: "Ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
    ta.value = value.join("\n");
    if (examples.length) {
      const exBtn = button("Beispiele einfügen");
      exBtn.addEventListener("click", () => {
        const have = new Set(lines(ta.value).map((x) => x.toLowerCase()));
        const add = examples.filter((x) => !have.has(x.toLowerCase()));
        ta.value = (ta.value.trim() ? ta.value.replace(/\n+$/, "") + "\n" : "") + add.join("\n");
      });
      body.append(el("div", { class: "wiz-ex" }, exBtn, el("span", { class: "muted mini" }, " " + examples.slice(0, 3).join(" · ") + " …")));
    }
    body.append(ta);
    commit = () => onCommit(lines(ta.value));
  };

  const render = (): void => {
    body.innerHTML = ""; foot.innerHTML = ""; commit = () => {};
    const step = steps[i]!;
    const total = saveIndex; // Zählschritte ohne Intro
    if (step.kind === "intro") {
      body.append(el("h3", { class: "wiz-h" }, "Ein eigenes Preset bauen — offline"));
      body.append(el("p", { class: "muted" }, "Der Assistent führt dich durch die 7 Kern-Kategorien der Wortbank und anschließend optional durch die Dramaturgie (Preset 2.0). Pro Schritt gibt es einen Erklärtext und Beispiele zum Einfügen. Am Ende speicherst du alles als eigenes Preset."));
    } else if (step.kind === "bank") {
      areaStep(step.label, step.help, data.bank[step.k] || [], bankExamples(step.k), (v) => (data.bank[step.k] = v), total, i);
    } else if (step.kind === "gate") {
      body.append(el("div", { class: "muted wiz-prog" }, `Schritt ${i} von ${total}`));
      body.append(el("h3", { class: "wiz-h" }, "Dramaturgie (Preset 2.0) — optional"));
      body.append(el("p", { class: "muted" }, "Möchtest du zusätzlich einen Erzählbogen und Weltregeln festlegen? Damit kann die Struktur „Dramaturgie“ den Text entlang deines Bogens bauen. Du kannst das auch überspringen und ein reines Wortbank-Preset speichern."));
    } else if (step.kind === "drama") {
      areaStep(step.label, step.help, data.drama[step.k] || [], DRAMA_EX[step.k] || [], (v) => (data.drama[step.k] = v), total, i);
    } else if (step.kind === "pools") {
      areaStep("Kontext-Pools", "Orte, Figuren, Objekte — ein Eintrag pro Zeile. Sie füttern die lebendigen Pools als Motiv-Gedächtnis.", data.pools, POOL_EX, (v) => (data.pools = v), total, i);
    } else if (step.kind === "tone") {
      body.append(el("div", { class: "muted wiz-prog" }, `Schritt ${i} von ${total}`));
      body.append(el("h3", { class: "wiz-h" }, "Grundton"));
      body.append(el("p", { class: "muted wiz-help" }, "Optionaler Ton, der beim Laden des Presets voreingestellt wird."));
      const sel = select("wiz-tone", TONE_OPTS, data.tone || "");
      body.append(sel);
      commit = () => (data.tone = sel.value);
    } else if (step.kind === "save") {
      body.append(el("h3", { class: "wiz-h" }, "Speichern"));
      const coreCount = BANK_KEYS.reduce((n, k) => n + (data.bank[k]?.length || 0), 0);
      const dramaCount = DRAMA.reduce((n, [k]) => n + (data.drama[k]?.length || 0), 0);
      body.append(el("p", { class: "muted" }, `${coreCount} Wortbank-Einträge · ${dramaCount} Dramaturgie-Einträge · ${data.pools.length} Pool-Einträge. Leere Kern-Kategorien werden mit Standard-Einträgen aufgefüllt, damit das Preset generieren kann.`));
      const nameIn = el("input", { class: "wiz-name", placeholder: "Name des Presets" }) as HTMLInputElement;
      nameIn.value = data.name;
      body.append(el("div", { class: "field" }, el("span", { class: "field-label" }, "Preset-Name"), nameIn));
      commit = () => (data.name = nameIn.value.trim());
    }

    // Fußzeile
    const back = button("Zurück"); back.addEventListener("click", () => { commit(); i = Math.max(0, i - 1); render(); });
    if (i > 0) foot.append(back);
    foot.append(el("span", { class: "wiz-spacer" }));

    if (step.kind === "intro") {
      const go = el("button", { class: "primary" }, "Los geht’s"); go.addEventListener("click", () => { i = 1; render(); });
      foot.append(go);
    } else if (step.kind === "gate") {
      const skip = button("Überspringen"); skip.addEventListener("click", () => { i = saveIndex; render(); });
      const yes = el("button", { class: "primary" }, "Dramaturgie einrichten"); yes.addEventListener("click", () => { i = gateIndex + 1; render(); });
      foot.append(skip, yes);
    } else if (step.kind === "save") {
      const doSave = el("button", { class: "primary" }, icon("floppy"), " Preset speichern");
      doSave.addEventListener("click", () => { commit(); save(); });
      foot.append(doSave);
    } else {
      // Ab dem Gate darf jederzeit direkt zum Speichern gesprungen werden
      if (i > gateIndex) { const jump = button("Zum Speichern"); jump.addEventListener("click", () => { commit(); i = saveIndex; render(); }); foot.append(jump); }
      const next = el("button", { class: "primary" }, "Weiter"); next.addEventListener("click", () => { commit(); i = Math.min(saveIndex, i + 1); render(); });
      foot.append(next);
    }
  };

  const save = (): void => {
    const name = (data.name || "").trim().slice(0, 40);
    if (!name) { alert("Bitte einen Preset-Namen angeben."); return; }
    // Bank bauen: leere Kern-Kategorien mit Standard auffüllen
    const bank = {} as Bank;
    for (const k of BANK_KEYS) {
      const v = data.bank[k];
      bank[k] = v && v.length ? v.slice() : (DEFAULT_BANK[k] || []).slice();
    }
    saveBank(normalizeBankShape(bank));
    saveActiveBankLabel(name);
    saveCurrentBankAsUserPreset(name);
    // Dramaturgie (2.0), falls vorhanden
    const drama = {
      einstieg: data.drama.einstieg || [], mitte: data.drama.mitte || [], hoehepunkt: data.drama.hoehepunkt || [], schluss: data.drama.schluss || [],
      ausloeser: data.drama.ausloeser || [], veraenderungen: data.drama.veraenderungen || [], konflikte: data.drama.konflikte || [],
      zeitanomalien: data.drama.zeitanomalien || [], regeln: data.drama.regeln || [],
    };
    const anyDrama = Object.values(drama).some((x) => x.length > 0);
    if (anyDrama || data.pools.length || data.tone) {
      const a2: Active2 = { drama: anyDrama ? drama : null, pools: data.pools.slice(), settings: { tone: data.tone || undefined, structure: anyDrama ? "dramaturgie" : undefined } };
      setActive2(a2); setDramaData(a2.drama); saveUserPreset2(name, a2);
    } else { setActive2(null); setDramaData(null); }
    finish("user:" + name);
  };

  render();
}
