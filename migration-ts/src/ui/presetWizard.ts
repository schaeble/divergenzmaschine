// Preset-Assistent: leitet offline Schritt für Schritt durch die Kategorien
// (die acht Listen der Wortbank + optionale Preset-2.0-Dramaturgie) und
// speichert am Ende ein eigenes Preset. Keine KI, keine Netzverbindung nötig.
import { el, select, button } from "./dom";
import { icon } from "./icons";
import { saveBank, normalizeBankShape } from "../storage";
import { getAllPresets, saveActiveBankLabel, saveCurrentBankAsUserPreset } from "../wordbank";
import { DEFAULT_BANK, BANK_KEYS } from "../constants";
import type { Bank, BankKey } from "../types";
import { setActive2, saveUserPreset2, type Active2 } from "../features/preset2";
import { KATEGORIE_VORGABE } from "../features/ki";
import { TONE_OPTS as TON_LISTE } from "../generation/optionen";
import { setDramaData } from "../generation/dramaturgie";
import { ARCHIVE_CATS, catLabel } from "../features/wordarchive";
import { entriesForCat, entriesForCatTheme, themesForCat, archiveGroupNames, groupEntries, allEntries } from "../features/archive2";

const shuffle = <T>(a: T[]): T[] => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j]!, a[i]!]; } return a; };
const lines = (v: string): string[] => v.split("\n").map((s) => s.trim()).filter(Boolean);

/** Die acht Listen mit ihren Anweisungen.
 *
 *  Die MENGEN und WORTLÄNGEN kommen aus `KATEGORIE_VORGABE` in `ki.ts` — dort
 *  sind sie am Bestand aller eingebauten Presets nachgezählt und werden von
 *  einem eigenen Prüfstand gegen ihn gehalten. Sie hier ein zweites Mal
 *  hinzuschreiben hiesse, zwei Listen zu führen, die dasselbe meinen; genau
 *  daran ist der Autopilot in 4.245.0 gescheitert.
 *
 *  Der Assistent nannte bis 4.305.0 GAR KEINE Mengen. Wer über ihn ein Preset
 *  baute, wusste nie, wann genug ist — und die KI-Wortbank verlangt seit
 *  4.290.0 im Schnitt 126 Einträge und rund 850 Wörter. Ein von Hand gebautes
 *  Preset landete damit regelmäßig bei einem Drittel davon und trug lange
 *  Texte nicht.
 *
 *  Und die MOTIVVERWANDLUNGEN fehlten hier ganz. Der Editor hat sie seit
 *  4.292.0, der KI-Auftrag seit 4.290.0 — nur der Assistent führte weiter durch
 *  sieben Listen statt acht. */
const V = new Map(KATEGORIE_VORGABE.map((x) => [x.key, x]));
const menge = (k: string): string => {
  const v = V.get(k);
  if (!v) return "";
  return ` Richtwert: ${v.anzahl} Einträge (${v.min}–${v.max})`
    + (v.woerter ? `, im Schnitt ${v.woerter} Wörter je Eintrag.` : ".");
};

const CORE: [BankKey, string, string][] = [
  ["motifs", "Motive", "Wiederkehrende Bilder. Jedes MUSS eine Nominalphrase mit Artikel und eigenem Kopf sein, "
    + "am besten mit Relativsatz: „eine Nachtigall, die im dunklen Laub sitzt“. Bruchstücke ohne Kopf "
    + "(„Brot und Ketten“) lassen den Zusammenbau mitten im Text abbrechen — gemessen in 33 von 60 Läufen." + menge("motifs")],
  ["hooks", "Hooks", "Kleine, irritierende Details oder Sätze, die neugierig machen, z. B. „eine rote Feder im falschen Winkel“." + menge("hooks")],
  ["props", "Requisiten", "Gegenstände MIT unbestimmtem Artikel im Akkusativ: „einen Schlüssel zum Kerker“. "
    + "Sie stehen als Objekt in einem fremden Satz und sind deshalb absichtlich kurz." + menge("props")],
  ["turns", "Wendungen", "Wendepunkte, je ein knapper Satz, z. B. „eine Katze führt den Weg“." + menge("turns")],
  ["obstacles", "Hindernisse", "Was sich der Figur widersetzt, je ein knapper Satz, z. B. „die Tür bleibt verschlossen“." + menge("obstacles")],
  ["stakes", "Einsätze", "Was auf dem Spiel steht. Jeder Eintrag beginnt mit „Der Einsatz ist“." + menge("stakes")],
  ["endings", "Enden", "Schlusssätze oder Schlussbilder, z. B. „das Licht bleibt an, niemand kommt“." + menge("endings")],
  ["verwandlungen" as BankKey, "Motivverwandlungen", "Die achte Liste — keine Textkategorie: Diese Einträge "
    + "stehen NIE im Text, sie sagen, was aus einem Motiv wird, wenn es wiederkehrt. Ein Paar je Zeile mit "
    + "Pfeil: „Telefon→Stille“. Beide Seiten müssen in den Motiven vorkommen, sonst verwirft der Generator "
    + "das Paar stillschweigend. 41 der 51 eingebauten Presets tragen welche." + menge("verwandlungen")],
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
  einstieg: ["ein Morgen, der zu früh beginnt", "eine Ankunft ohne Grund", "die Stille vor dem ersten Wort", "ein Zug hält an einem Ort ohne Namen", "jemand wacht in einem fremden Zimmer auf", "der letzte Gast verlässt das Haus", "ein Brief liegt ungeöffnet auf dem Tisch", "die Uhr schlägt eine Stunde zu viel", "ein Fremder fragt nach dem Weg", "Nebel legt sich über die Felder", "das Telefon klingelt einmal und verstummt", "eine Tür steht offen, die verschlossen war", "der erste Schnee fällt zu früh", "ein Kind zählt Fenster", "die Straßenlampen gehen nacheinander aus"],
  mitte: ["die Dinge verschieben sich unmerklich", "eine zweite Möglichkeit taucht auf", "das Vertraute wird fremd", "die Erinnerung widerspricht sich", "ein Verdacht wächst leise", "zwei Wege trennen sich", "die Zeit dehnt sich", "ein Name wird mehrmals genannt", "etwas fehlt, das keiner benennt", "die Wände scheinen näher zu rücken", "ein alter Bekannter kehrt zurück", "die Karte stimmt nicht mehr", "ein Geräusch wiederholt sich", "die Suche führt im Kreis", "ein Geheimnis drängt an die Oberfläche"],
  hoehepunkt: ["alles kippt in einem Satz", "die Wahrheit zeigt ihr Gesicht", "der Boden gibt nach", "ein Wort zerreißt die Stille", "die Maske fällt", "zwei Möglichkeiten kollabieren zu einer", "die Tür fällt ins Schloss", "das Licht erlischt schlagartig", "eine Entscheidung lässt sich nicht mehr zurücknehmen", "der Spiegel zeigt das Falsche", "die Stimme bricht", "die Zeit steht einen Herzschlag still", "ein Name wird endlich ausgesprochen", "alles Verborgene liegt frei", "der letzte Halt löst sich"],
  schluss: ["offen", "melancholisch", "ein leises Verstummen", "versöhnlich", "kühl und klar", "ein Aufatmen", "unentschieden", "ein Kreis schließt sich", "nachhallend", "bitter", "hoffnungsvoll", "ins Schweigen", "ein letzter Blick zurück", "die Nacht bleibt", "ohne Antwort"],
  ausloeser: ["ein Anruf, der niemandem gehört", "ein gefundener Gegenstand", "ein Wort zu viel", "ein Riss in der Wand", "ein vergessener Name fällt", "ein Foto ohne Datum", "ein Schlüssel, der überall passt", "ein Brief von einem Toten", "eine falsche Uhrzeit", "ein Klopfen an der falschen Tür", "ein Geruch aus der Kindheit", "eine Rechnung, die niemand stellte", "ein Licht im leeren Haus", "ein Versprechen, das jemand einlöst", "eine Tür, die sich von selbst öffnet"],
  veraenderungen: ["die Figur verliert ihren Namen", "der Ort beginnt sich zu erinnern", "aus Nähe wird Distanz", "das Gewöhnliche wird bedrohlich", "eine Rolle kehrt sich um", "Vertrauen weicht Zweifel", "die Sprache versagt", "aus Jäger wird Gejagter", "das Innen wird zum Außen", "die Zeit läuft rückwärts", "aus Schweigen wird Geständnis", "die Erinnerung schreibt sich um", "ein Wunsch verkehrt sich", "die Grenze verschwimmt", "aus Zufall wird Muster"],
  konflikte: ["Nähe gegen Flucht", "Wissen gegen Vergessen", "Pflicht gegen Sehnsucht", "Wahrheit gegen Schutz", "Bleiben gegen Aufbruch", "Erinnern gegen Loslassen", "Ordnung gegen Chaos", "Stimme gegen Schweigen", "Freiheit gegen Bindung", "Vergangenheit gegen Gegenwart", "Vertrauen gegen Verrat", "Kontrolle gegen Hingabe", "Schuld gegen Vergebung", "Sehen gegen Wegsehen", "Ich gegen die anderen"],
  zeitanomalien: ["ein Tag wiederholt sich halb", "die Uhr springt zurück", "Stunden fehlen ohne Spur", "die Zukunft sickert in die Gegenwart", "ein Moment dehnt sich zur Ewigkeit", "Erinnerungen kommen vor dem Ereignis", "die Nacht dauert zu lang", "zwei Zeiten überlagern sich", "ein Echo antwortet zu früh", "gestern liegt vor morgen", "die Zeit tropft ungleichmäßig", "ein Jahr vergeht über Nacht", "Vergangenes geschieht erneut", "die Sekunden zählen rückwärts", "ein Spiegel zeigt Vergangenes"],
  regeln: ["wer schläft, altert doppelt", "Spiegel zeigen nur Vergangenes", "Namen verblassen, wenn man sie ausspricht", "niemand darf zweimal denselben Weg gehen", "Licht wirft keine Schatten", "Versprechen binden über den Tod hinaus", "was man verliert, kehrt verwandelt zurück", "Türen führen nie zweimal zum selben Ort", "Schweigen hat ein Gewicht", "Wasser erinnert sich an jede Berührung", "wer lügt, wird durchsichtig", "die Toten hören mit", "Uhren gehen nur bei Sonnenlicht", "jeder Schatten gehört jemandem", "Wünsche kosten ein Jahr"],
};
const POOL_EX = ["ein verlassener Leuchtturm", "die Kartografin", "eine Spieluhr ohne Melodie", "ein Bahnwärterhaus im Nebel", "der Uhrmacher ohne Hände", "ein Gewächshaus im Winter", "die Frau mit den zwei Schatten", "ein Fahrstuhl ohne Knöpfe", "das Archiv der verlorenen Dinge", "ein Junge, der Karten sammelt", "die Brücke, die nirgends hinführt", "eine Bibliothek bei Nacht", "der Fährmann ohne Boot", "ein Zimmer voller Uhren", "die Stadt unter dem Wasser"];
// Aus der EINEN Quelle statt abgeschrieben. Die Kopie war zufaellig noch
// identisch — genau so war es beim Autopiloten auch, bis sie es nicht mehr war.
const TONE_OPTS: [string, string][] = [["", "(kein)"], ...TON_LISTE];

const bankExamples = (key: BankKey): string[] => {
  const set = new Set<string>();
  for (const p of Object.values(getAllPresets())) { const arr = (p.bank as Record<string, string[]>)[key]; if (Array.isArray(arr)) arr.forEach((x) => { const v = (x || "").trim(); if (v) set.add(v); }); }
  return [...set];
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

  // Schrittfolge: Intro → 8 Listen → Gate → 9 Dramaturgie → Pools → Ton → Speichern
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

  const SHOW_N = 8; // wie viele Beispiele pro Wurf angeboten werden
  const KURIOSE_FOR: Record<string, string> = { motifs: "kuriose_woerter", props: "kuriose_gegenstaende", turns: "kuriose_wendungen" };
  const areaStep = (label: string, help: string, value: string[], examples: string[], onCommit: (v: string[]) => void, total: number, num: number, archiveCat?: string, extraCat?: string): void => {
    body.append(el("div", { class: "muted wiz-prog" }, `Schritt ${num} von ${total}`));
    body.append(el("h3", { class: "wiz-h" }, label));
    body.append(el("p", { class: "muted wiz-help" }, help));
    const ta = el("textarea", { class: "wiz-ta", placeholder: "Ein Eintrag pro Zeile" }) as HTMLTextAreaElement;
    ta.value = value.join("\n");
    const insert = (arr: string[]): void => {
      const have = new Set(lines(ta.value).map((x) => x.toLowerCase()));
      const add = arr.filter((x) => !have.has(x.toLowerCase()));
      if (!add.length) return;
      ta.value = (ta.value.trim() ? ta.value.replace(/\n+$/, "") + "\n" : "") + add.join("\n");
    };
    // Wiederverwendbarer Beispiel-Block (mit Würfeln / Alle einfügen)
    const exampleBlock = (labelText: string, poolIn: string[], withClear: boolean): void => {
      if (!poolIn.length) return;
      const pool = poolIn.slice();
      let pick: string[] = shuffle(pool.slice()).slice(0, Math.min(SHOW_N, pool.length));
      const chips = el("div", { class: "wiz-exchips" });
      const renderChips = (): void => {
        chips.innerHTML = "";
        pick.forEach((x) => { const c = el("button", { class: "wiz-chip", type: "button", title: "Einfügen" }, x); c.addEventListener("click", () => insert([x])); chips.append(c); });
      };
      const dice = el("button", {}, icon("dice"), " Würfeln");
      dice.addEventListener("click", () => { pick = shuffle(pool.slice()).slice(0, Math.min(SHOW_N, pool.length)); renderChips(); });
      const allBtn = button("Alle einfügen");
      allBtn.addEventListener("click", () => insert(pick));
      const row = el("div", { class: "wiz-ex" }, dice, allBtn);
      if (withClear) { const clearBtn = button("Leeren"); clearBtn.addEventListener("click", () => { ta.value = ""; ta.focus(); }); row.append(clearBtn); }
      renderChips();
      body.append(el("div", { class: "muted mini wiz-exlabel" }, labelText), row, chips);
    };
    exampleBlock(`Beispiele (${examples.length} verfügbar) — einzeln anklicken zum Einfügen:`, examples, true);
    // Kuriose Kategorie aus deinem Archiv als zusätzliche Quelle direkt im Schritt
    if (extraCat) {
      const arch = entriesForCat(extraCat);
      if (arch.length) exampleBlock(`Aus deinem Archiv · ${catLabel(extraCat)} (${arch.length}):`, arch, false);
    }
    if (archiveCat) body.append(archivePicker(archiveCat, insert));
    body.append(ta);
    commit = () => onCommit(lines(ta.value));
  };

  // Import-Panel: archivierte Einträge (nach Kategorie/Thema) als Chips einfügen
  const archivePicker = (defaultCat: string, insert: (a: string[]) => void): HTMLElement => {
    const wrap = el("div", { class: "wa-pick" });
    const panel = el("div", { class: "wa-pickpanel", style: "display:none" });
    const catOpts: [string, string][] = [
      ...ARCHIVE_CATS.map(([id, l]) => [id, l] as [string, string]),
      ["grp:__all__", "Alle Gruppen"],
      ...archiveGroupNames().map((nm) => ["grp:" + nm, "Gruppe · " + nm] as [string, string]),
    ];
    const catSel = select("wiz-arch-cat", catOpts, defaultCat);
    const themeSel = el("select", { class: "wiz-arch-theme" }) as HTMLSelectElement;
    const chips = el("div", { class: "wiz-exchips" });
    const isGroup = (): boolean => catSel.value.startsWith("grp:");
    const currentEntries = (): string[] => {
      if (isGroup()) { const key = catSel.value.slice(4); return key === "__all__" ? allEntries() : groupEntries(key); }
      return themeSel.value ? entriesForCatTheme(catSel.value, themeSel.value) : entriesForCat(catSel.value);
    };
    const fillThemes = (): void => {
      themeSel.innerHTML = "";
      themeSel.append(el("option", { value: "" }, "alle Themen"));
      if (isGroup()) { themeSel.disabled = true; return; }
      themeSel.disabled = false;
      for (const t of themesForCat(catSel.value)) themeSel.append(el("option", { value: t }, t));
    };
    const renderChips = (): void => {
      chips.innerHTML = "";
      const entries = currentEntries();
      if (!entries.length) { chips.append(el("span", { class: "muted mini" }, "Nichts im Archiv für diese Auswahl.")); return; }
      const all = button("Alle einfügen"); all.addEventListener("click", () => insert(entries));
      chips.append(all);
      entries.forEach((t) => { const c = el("button", { class: "wiz-chip", type: "button", title: "Einfügen" }, t); c.addEventListener("click", () => insert([t])); chips.append(c); });
    };
    catSel.addEventListener("change", () => { fillThemes(); renderChips(); });
    themeSel.addEventListener("change", renderChips);
    const openBtn = button("Aus Archiv laden");
    openBtn.addEventListener("click", () => {
      const show = panel.style.display === "none";
      panel.style.display = show ? "" : "none";
      openBtn.textContent = show ? "Archiv schließen" : "Aus Archiv laden";
      if (show) { fillThemes(); renderChips(); }
    });
    panel.append(el("div", { class: "wiz-ex" }, el("span", { class: "muted mini" }, "Kategorie"), catSel, el("span", { class: "muted mini" }, "Thema"), themeSel), chips);
    wrap.append(el("div", { class: "wiz-ex" }, openBtn), panel);
    return wrap;
  };

  const render = (): void => {
    body.innerHTML = ""; foot.innerHTML = ""; commit = () => {};
    const step = steps[i]!;
    const total = saveIndex; // Zählschritte ohne Intro
    if (step.kind === "intro") {
      body.append(el("h3", { class: "wiz-h" }, "Ein eigenes Preset bauen — offline"));
      body.append(el("p", { class: "muted" }, "Der Assistent führt dich durch die acht Listen der Wortbank — sieben Textkategorien und die Motivverwandlungen — und anschließend optional durch die Dramaturgie (Preset 2.0). Pro Schritt stehen der Richtwert für die Menge, ein Erklärtext und Beispiele zum Einfügen. Am Ende speicherst du alles als eigenes Preset."));
    } else if (step.kind === "bank") {
      areaStep(step.label, step.help, data.bank[step.k] || [], bankExamples(step.k), (v) => (data.bank[step.k] = v), total, i, step.k, KURIOSE_FOR[step.k]);
    } else if (step.kind === "gate") {
      body.append(el("div", { class: "muted wiz-prog" }, `Schritt ${i} von ${total}`));
      body.append(el("h3", { class: "wiz-h" }, "Dramaturgie (Preset 2.0) — optional"));
      body.append(el("p", { class: "muted" }, "Möchtest du zusätzlich einen Erzählbogen und Weltregeln festlegen? Damit kann die Struktur „Dramaturgie“ den Text entlang deines Bogens bauen. Du kannst das auch überspringen und ein reines Wortbank-Preset speichern."));
    } else if (step.kind === "drama") {
      areaStep(step.label, step.help, data.drama[step.k] || [], DRAMA_EX[step.k] || [], (v) => (data.drama[step.k] = v), total, i, step.k);
    } else if (step.kind === "pools") {
      areaStep("Kontext-Pools", "Orte, Figuren, Objekte — ein Eintrag pro Zeile. Sie füttern die lebendigen Pools als Motiv-Gedächtnis.", data.pools, POOL_EX, (v) => (data.pools = v), total, i, "kuriose_gegenstaende");
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
      const verwCount = (data.bank["verwandlungen" as BankKey] || []).length;
      // Der Richtwert steht daneben, nicht als Sperre: Ein kleines Preset darf
      // entstehen, aber wer es baut, soll wissen, dass es lange Texte nicht
      // traegt. Gemessen liegt volle Treue bei rund 850 Woertern.
      const woerter = BANK_KEYS.reduce((n, k) => n + (data.bank[k] || []).reduce((m, x) => m + (x.match(/\S+/g) || []).length, 0), 0);
      const soll = KATEGORIE_VORGABE.filter((x) => x.key !== "verwandlungen").reduce((n, x) => n + x.anzahl, 0);
      const dramaCount = DRAMA.reduce((n, [k]) => n + (data.drama[k]?.length || 0), 0);
      body.append(el("p", { class: "muted" },
        `${coreCount} Wortbank-Einträge (${woerter} Wörter) · ${verwCount} Motivverwandlungen · `
        + `${dramaCount} Dramaturgie-Einträge · ${data.pools.length} Pool-Einträge. `
        + "Leere Textkategorien werden mit Standard-Einträgen aufgefüllt, damit das Preset generieren kann; "
        + "die Motivverwandlungen nicht — geerbte Paare zeigen auf fremde Motive und wären wirkungslos."));
      body.append(el("p", { class: coreCount >= soll * 0.7 && woerter >= 600 ? "muted mini" : "sam-warn mini" },
        coreCount >= soll * 0.7 && woerter >= 600
          ? `Das trägt: Richtwert sind ${soll} Einträge und rund 850 Wörter.`
          : `Richtwert sind ${soll} Einträge und rund 850 Wörter — gemessen trägt ein Preset darunter `
            + "lange Texte nicht (bei der Hälfte reicht es für etwa 56 Prozent der Ziellänge). "
            + "Speichern geht trotzdem; nachlegen lässt sich jederzeit im Editor."));
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
    // Die Verwandlungen NICHT über BANK_KEYS: Sie sind keine Textkategorie und
    // stehen deshalb nicht darin. Bis 4.305.0 fielen sie hier still heraus —
    // der Assistent hätte sie gar nicht erst abgefragt, und selbst wenn, wäre
    // die Eingabe beim Speichern verschwunden. Kein Fehler, keine Meldung:
    // genau die Fehlerart, die dieses Projekt sonst überall hat.
    //
    // Und NICHT mit Standard auffüllen: Ein Motivpaar zeigt auf Motive; die
    // Vorgabepaare zeigen auf die Vorgabemotive und wären in einem eigenen
    // Preset wirkungslos. Leer ist hier ehrlicher als geerbt.
    const verw = data.bank["verwandlungen" as BankKey];
    if (verw && verw.length) bank.verwandlungen = verw.slice();
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
