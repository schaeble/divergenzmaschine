const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand für die Welt „Utopie" (4.373.0).
//
// Drei Teile:
//   1. Die Erkennung der vier W — was macht das Studio aus einer Eingabe?
//   2. Die Matrix: 8 Wo × 5 Wann × 8 Wer × 7 Was × 4 Töne, jede Utopie gegen
//      ihr eigenes Weltblatt geprüft (Zahlen, Namen, Rat, Kehrseite, Brauch,
//      Vorrang der Ortsangabe, Satzbau, Blickwinkel).
//   3. Gegenproben: Jede Prüfung bekommt einen Text mit absichtlich
//      eingebautem Fehler. Schlägt sie dort nicht an, ist sie keine.
import { buildUtopie, pruefeUtopie, utopieTitel } from "../src/generation/utopie";
import { erkenneLage, erkenneErzaehler, erkenneZeit, erkenneGrundsatz, istNurName } from "../src/features/weltblatt";
import { grammarFlags } from "../src/generation/grammar";
import { buildStory } from "../src/generation/buildStory";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { utopieMaterial, requisitNominativ, fremdInLage } from "../src/features/utopieMaterial";
import { fuelle } from "../src/features/weltblatt";
const fuelleRiss = (fb: { texte: { kehrseite: string[] }; werte: Record<string, string> }): string => fuelle(fb.texte.kehrseite[0]!, fb.werte);
import type { GenInput } from "../src/types";

const fehler: string[] = [];
const soll = (ok: boolean, was: string): void => { if (!ok) fehler.push(was); };

// ── 1 · Erkennung ───────────────────────────────────────────────────────────
soll(erkenneLage("eine Insel im Nordmeer") === "insel", "Lage: Insel");
soll(erkenneLage("in der Wüste") === "wueste", "Lage: Wüste");
soll(erkenneLage("eine Stadt unter dem Eis") === "eis", "Lage: Stadt unter dem Eis ist Eis, nicht Stadt");
soll(erkenneLage("in einem Keller") === null, "Lage: Keller unbekannt");
soll(istNurName("Velmar") && !istNurName("Wüste") && !istNurName("in Velmar"), "Lage: bloßer Name");
soll(erkenneErzaehler("eine, die gehen muss").art === "gehend", "Wer: gehend über das Komma hinweg");
soll(erkenneErzaehler("ein Reisender").art === "gast" && erkenneErzaehler("ein Reisender").rolle === "Reisender", "Wer: Reisender → Gast, Rolle ohne Artikel");
soll(erkenneErzaehler("Mara").name === "Mara", "Wer: Name");
soll(erkenneErzaehler("die Fischerin").art === "bewohner" && erkenneErzaehler("die Fischerin").rolleIchBin === "Fischerin", "Wer: Fischerin → Bewohner, „Ich bin Fischerin“");
soll(erkenneErzaehler("ein alter Bewohner").rolleIchBin === "ein alter Bewohner", "Wer: Adjektiv behält den Artikel");
soll(erkenneZeit("nach dem letzten Krieg") === "nachbruch", "Wann: nach dem Krieg");
soll(erkenneZeit("im Jahr 2300") === "zukunft" && erkenneZeit("im Jahr 1516") === "vergangenheit", "Wann: Jahreszahl");
soll(erkenneZeit("vor zweihundert Jahren") === "vergangenheit", "Wann: vor … Jahren");
soll(erkenneGrundsatz("Es gibt kein Geld.")?.id === "geld", "Was: Geld");
soll(erkenneGrundsatz("Die Gesetze verfallen")?.id === "gesetz", "Was: Gesetz");
soll(erkenneGrundsatz("Alle tragen Hüte") === null, "Was: freier Grundsatz");
// Preset-Material (4.374.0)
soll(requisitNominativ("einen alten Siegelring") === "ein alter Siegelring", "Requisit: Akkusativ → Nominativ");
soll(requisitNominativ("einen Kompass ohne Norden") === "ein Kompass ohne Norden", "Requisit: Nomen ohne Adjektiv");
soll(requisitNominativ("einen Seismographen aus Messing") === null, "Requisit: schwaches Nomen im Akkusativ fällt (Fund in der Stichprobe)");
soll(fremdInLage("eine vereiste Monstranz", "wueste"), "Lage: vereist in der Wüste fremd (Fund in der Stichprobe)");
soll(requisitNominativ("die Schlüssel") === null, "Requisit: bestimmter Artikel (Plural möglich) fällt");
soll(requisitNominativ("ein Brief mit zwei Siegeln") === null, "Requisit: Zahl fällt");
soll(fremdInLage("phosphoreszierende Gischt", "wueste") && !fremdInLage("phosphoreszierende Gischt", "insel"), "Lage: Gischt in der Wüste fremd, auf der Insel nicht");
soll(fremdInLage("ein rostiges Ruder", "wueste"), "Lage: Ruder in der Wüste fremd (Fund beim Lesen)");
soll(!fremdInLage("eine Seele ohne Namen", "wueste") && !fremdInLage("ein Eisentor", "wueste") && !fremdInLage("eine Decke", "wueste"), "Lage: Seele, Eisen, Decke sind keine Meer- oder Eiswörter");
soll(utopieMaterial(BUILTIN_PRESETS["rimbaud"]!, "wueste").motive.every((m) => !/Gischt|Meer|Brandung|Wasser/.test(m)), "Rimbaud in der Wüste ohne Meeresmotive");
const ohneMotiv = Object.keys(BUILTIN_PRESETS).filter((id) => !utopieMaterial(BUILTIN_PRESETS[id]!, null).motive.length);
soll(!ohneMotiv.length, `Presets ohne taugliches Motiv: ${ohneMotiv.join(", ")}`);

// ── 2 · Matrix ──────────────────────────────────────────────────────────────
const WO = ["", "eine Insel im Nordmeer", "in der Wüste", "eine Stadt unter dem Eis", "im Gebirge", "Velmar", "auf der Insel Amaurot", "in einem Keller"];
const WANN = ["", "nach dem letzten Krieg", "im Jahr 2300", "vor zweihundert Jahren", "morgen"];
const WER = ["", "ein Reisender", "Kartograf", "Mara", "die Fischerin", "ein alter Bewohner", "eine, die gehen muss", "Tom, Anna"];
const WAS = ["", "Es gibt kein Geld.", "kein Geld", "Niemand vergisst", "Die Gesetze verfallen", "Alle tragen Hüte", "Wer lügt, muss gehen!"];
const TOENE = ["uplifting", "dark", "ironisch", "nuechtern"];

const funde = new Map<string, number>();
const beispiel = new Map<string, string>();
const laengen: Record<number, number[]> = { 110: [], 400: [] };
let laeufe = 0;
const PRESET_IDS = Object.keys(BUILTIN_PRESETS);
const presetGenutzt = { motiv: 0, wendung: 0, verwandlung: 0, requisit: 0 };
const ARTEN = ["utopie", "dystopie"] as const;
const jeArt: Record<string, number> = { utopie: 0, dystopie: 0 };
for (const art of ARTEN) for (const where of WO) for (const when of WANN) for (const who of WER) for (const what of WAS) for (const tone of TOENE) {
  const lenTarget = laeufe % 2 ? 400 : 110;
  const input = { where, when, who, what, tone, form: "prose", lenTarget } as GenInput;
  const presetId = PRESET_IDS[laeufe % PRESET_IDS.length]!;
  const bankP = BUILTIN_PRESETS[presetId]!;
  const r = buildUtopie(input, bankP, art);
  jeArt[art]!++;
  laeufe++;
  for (const k of Object.keys(presetGenutzt) as (keyof typeof presetGenutzt)[]) {
    const v = r.preset[k];
    const t = k === "verwandlung" ? (v ? `„${(v as [string, string])[0]}“` : "") : (v as string || "");
    if (t && r.text.includes(k === "wendung" ? t.slice(1) : t)) presetGenutzt[k]++;
  }
  laengen[lenTarget]!.push(r.text.split(/\s+/).length);
  const befunde = pruefeUtopie(r.text, r.fb, [where, when, who, what].join(" "), bankP);
  // Der allgemeine Grammatik-Melder — OHNE seine Klasse „Verb-Kollision". Die
  // lief hier in 8767 von 8960 Läufen an, und jeder geprüfte Treffer war
  // falsch: Sie zählt über Satzgrenzen hinweg („hat. Am Waagentag legt") und
  // hält „nicht" und „längst" für finite Verben („bin ich nicht", „ist
  // längst"). Ein Melder, der fast immer anschlägt, prüft nichts.
  // Artikel doppelt („auf der der Herold saß") ist richtig; der allgemeine
  // Melder zählt es als Wortverdopplung.
  const g = grammarFlags(r.text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1"));
  const echte = g.issues.filter((x) => !/^Verb-Kollision/.test(x));
  if (echte.length) befunde.push("Grammatik-Melder: " + echte.join("; "));
  // Vorrang: Ein eingetragener Grundsatz steht wörtlich da.
  // Die Überschrift ist der Name der Welt (4.375.0).
  if (utopieTitel(r.text) !== r.fb.name) befunde.push("Titel ist nicht der Name der Welt");
  // Verglichen ab dem zweiten Zeichen: Der Satzanfang wird großgeschrieben
  // („kein Geld" → „Kein Geld."); der erste Vergleich meldete das 1280-mal.
  if (what && !r.text.includes(what.replace(/[.!?]$/, "").slice(1))) befunde.push("Eingetragenes Was fehlt im Text");
  for (const b of befunde) {
    const art = b.replace(/„[^"“]*["“]/g, "„…“").replace(/: .*$/, "");
    funde.set(art, (funde.get(art) || 0) + 1);
    if (!beispiel.has(art)) beispiel.set(art, `${b} ← ${JSON.stringify({ where, when, who, what, tone, fassung: r.fb.art })}`);
  }
}

// Der Regler Textlänge muss etwas bewegen.
const mittel = (l: number[]): number => l.reduce((a, b) => a + b, 0) / l.length;
const kurz = laengen[110]!, lang = laengen[400]!;
soll(mittel(lang) - mittel(kurz) >= 60, `Textlänge bewegt zu wenig: ${mittel(kurz).toFixed(0)} → ${mittel(lang).toFixed(0)}`);

// Abwechslung: dieselbe Eingabe zwanzigmal.
const viele = new Set<string>();
for (let i = 0; i < 20; i++) viele.add(buildUtopie({ where: "", when: "", who: "", what: "", tone: "uplifting", form: "prose", lenTarget: 200 } as GenInput).text);
soll(viele.size >= 18, `Zu wenig Abwechslung: ${viele.size} verschiedene aus 20`);

// Die Weiche: Utopie nur bei Prosa; ohne Welt bleibt alles beim Alten.
const bank = BUILTIN_PRESETS["staatsphilosophie"]!;
const basis = { where: "eine Insel", when: "", who: "", what: "Es gibt kein Geld.", tone: "uplifting", varLevel: "mid", structure: "rekombination", mode: "auto", perspective: "auto", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 150 } as unknown as GenInput;
const mitWelt = buildStory(bank, { ...basis, form: "prose", welt: "utopie" });
soll(mitWelt.includes("„Es gibt kein Geld.“") && mitWelt.split("\n\n").length === 5, "Weiche: Welt Utopie + Prosa baut keine Utopie");
const ohneWelt = buildStory(bank, { ...basis, form: "prose", welt: "keine" });
soll(!/auf dem \S+ gebaut ist/.test(ohneWelt), "Weiche: ohne Welt erscheint Utopie-Text");
const bericht = buildStory(bank, { ...basis, form: "bericht", welt: "utopie" });
soll(!/auf dem \S+ gebaut ist/.test(bericht), "Weiche: Bericht mit Welt Utopie baut Utopie (noch nicht angeschlossen)");

// ── 3 · Gegenproben ─────────────────────────────────────────────────────────
const gegen: string[] = [];
let gegenFehler = 0;
const probe = (name: string, text: string, fb: Parameters<typeof pruefeUtopie>[1], muster: RegExp, eingabe = "", bank?: Parameters<typeof pruefeUtopie>[3]): void => {
  const b = pruefeUtopie(text, fb, eingabe, bank);
  const ok = b.some((x) => muster.test(x));
  gegen.push(`    ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) gegenFehler++;
};
// Eine Utopie mit Rat erzwingen: Der Grundsatz „los" setzt den Rat.
let rat = buildUtopie({ where: "in der Wüste", when: "", who: "ein Reisender", what: "Niemand regiert", tone: "uplifting", form: "prose", lenTarget: 110 } as GenInput);
for (let i = 0; i < 50 && rat.fb.regierung.id !== "rat"; i++) rat = buildUtopie({ where: "in der Wüste", when: "", who: "ein Reisender", what: "", tone: "uplifting", form: "prose", lenTarget: 110 } as GenInput);
const t0 = rat.text, fb0 = rat.fb;
const sauber = pruefeUtopie(t0, fb0, "in der Wüste ein Reisender Niemand regiert");
gegen.push(`    ${sauber.length ? "✗" : "✓"} Ausgangstext ohne Befund${sauber.length ? ": " + sauber.join("; ") : ""}`);
if (sauber.length) gegenFehler++;
const ratM = t0.match(/Rat der (\S+?)\./);
probe("Rat der Vierzig statt des gezogenen", ratM ? t0.replace(`Rat der ${ratM[1]}`, "Rat der Vierzig") : t0 + " Rat der Vierzig.", fb0, /Rat der Vierzig|Zahl nicht im Blatt/);
probe("Fremde Zahl", t0.replace(/\n\n/, " Es gibt sechzig Tore.\n\n"), fb0, /Zahl nicht im Blatt: sechzig/);
probe("Kehrseite entfernt", t0.replace(fb0.grundsatz.kehrseite[0]!.replace("{N}", fb0.name), ""), fb0, /Kehrseite/);
probe("Netze in der Wüste", t0.replace(/\n\n/, " Am Abend flickt man Netze.\n\n"), fb0, /Marke der Lage „insel"/);
probe("Platzhalter stehen geblieben", t0.replace(fb0.name, "{N}"), fb0, /Platzhalter/);
probe("Grundsatz verändert", t0.replace(`„${fb0.satz}“`, "„Es regiert der König.“"), fb0, /Grundsatz/);
probe("Doppeltes Wort", t0.replace(/\bund\b/, "und und"), fb0, /Doppeltes Wort/);
probe("Satzanfang klein", t0.replace(/\. ([A-ZÄÖÜ])/, (_, c: string) => ". " + c.toLowerCase()), fb0, /Satzanfang klein/);
probe("Absätze vertauscht (Blickwinkel)", t0.split("\n\n").reverse().join("\n\n"), fb0, /Blickwinkel/);
probe("Brauch entfernt", t0.replace(fb0.brauch.text, ""), fb0, /Brauch/);
probe("„Das war morgen“", t0.replace(/\n\n/, " Das war morgen.\n\n"), fb0, /Zukunftszeit/);
probe("Schluss am Tor bei anderer Ankunft", t0.replace(/\n\n/, " Niemand stand am Tor.\n\n"), { ...fb0, lage: { ...fb0.lage, ankunft: "Am Steg" } }, /am Tor/);
probe("„Niemand regiert“ neben „Regiert wird“", t0.replace(`„${fb0.satz}“`, "„Niemand regiert.“").replace(/\n\n/, " Regiert wird alles vom Rat.\n\n"), { ...fb0, satz: "Niemand regiert." }, /Niemand regiert/);
// Preset-Gegenproben: ein Rimbaud-Text gegen die Kafka-Bank geprüft, und ein
// Text, aus dem das Motiv entfernt wurde.
{
  const rb = BUILTIN_PRESETS["rimbaud"]!, kb = BUILTIN_PRESETS["kafka"]!;
  let r1 = buildUtopie({ where: "eine Insel", when: "", who: "", what: "", tone: "uplifting", form: "prose", lenTarget: 400 } as GenInput, rb);
  for (let i = 0; i < 50 && !(r1.preset.motiv && !utopieMaterial(kb, r1.fb.lageTyp).motive.includes(r1.preset.motiv)); i++) r1 = buildUtopie({ where: "eine Insel", when: "", who: "", what: "", tone: "uplifting", form: "prose", lenTarget: 400 } as GenInput, rb);
  const eig = pruefeUtopie(r1.text, r1.fb, "eine Insel", rb);
  gegen.push(`    ${eig.length ? "✗" : "✓"} Rimbaud-Text gegen Rimbaud-Bank ohne Befund${eig.length ? ": " + eig.join("; ") : ""}`);
  if (eig.length) gegenFehler++;
  probe("Rimbaud-Text gegen Kafka-Bank", r1.text, r1.fb, /nicht aus dem Preset/, "eine Insel", kb);
  const ohne = r1.text.replace(/(Mitten auf dem Platz|Am Rand des Platzes): [^.]+\. ?/, "");
  const b3 = pruefeUtopie(ohne, r1.fb, "eine Insel", rb);
  const ok3 = b3.some((x) => /Preset ohne Wirkung/.test(x));
  gegen.push(`    ${ok3 ? "✓" : "✗"} Motiv entfernt → „Preset ohne Wirkung“`);
  if (!ok3) gegenFehler++;
}
// Fassungen dürfen sich nicht mischen (4.375.0): ein Utopie-Satz in einer
// Dystopie und umgekehrt, und eine Dystopie ohne Riss.
{
  const d = buildUtopie({ where: "in der Wüste", when: "", who: "ein Reisender", what: "Es gibt kein Geld.", tone: "dark", form: "prose", lenTarget: 110 } as GenInput, undefined, "dystopie");
  const dSauber = pruefeUtopie(d.text, d.fb, "in der Wüste ein Reisender Es gibt kein Geld.");
  gegen.push(`    ${dSauber.length ? "✗" : "✓"} Dystopie-Ausgangstext ohne Befund${dSauber.length ? ": " + dSauber.join("; ") : ""}`);
  if (dSauber.length) gegenFehler++;
  probe("Utopie-Satz in einer Dystopie", d.text.replace(/\n\n/, " Am Tor fragte niemand nach meinem Namen.\n\n"), d.fb, /Satz der Fassung „utopie"/, "in der Wüste");
  probe("Dystopie-Satz in einer Utopie", t0.replace(/\n\n/, " Man ließ mich den Satz nachsprechen.\n\n"), fb0, /Satz der Fassung „dystopie"/);
  probe("Riss entfernt", d.text.replace(fuelleRiss(d.fb), ""), d.fb, /Riss der Prämisse fehlt/, "in der Wüste");
}
{
  // Gegenprobe Titel: Ohne Namen im ersten Absatz darf kein Titel entstehen.
  const t = utopieTitel("Ich stehe am Steg und warte.\n\nIn Velmar regiert der Rat.");
  gegen.push(`    ${t === "" ? "✓" : "✗"} Titel nur aus dem ersten Absatz (gefunden: „${t}")`);
  if (t !== "") gegenFehler++;
}
// Der Fund des ersten Laufs: „Dreißig" ist nicht „drei".
{
  const fbD = { ...fb0, zahlen: ["dreißig"] };
  const b = pruefeUtopie(`Ich kam nach ${fb0.name}. Die Dreißig tagen in ${fb0.name}.`, fbD).filter((x) => /Zahl/.test(x));
  gegen.push(`    ${b.length ? "✗" : "✓"} „Dreißig" wird nicht als „drei" gelesen`);
  if (b.length) gegenFehler++;
}

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Utopie/Dystopie: ${laeufe} Läufe (2 Fassungen × 8 Wo × 5 Wann × 8 Wer × 7 Was × 4 Töne; ${jeArt.utopie} Utopien, ${jeArt.dystopie} Dystopien)`);
console.log(`  Umfang bei Ziel 110: ${Math.min(...kurz)}–${Math.max(...kurz)} Wörter, Mittel ${mittel(kurz).toFixed(0)}`);
console.log(`  Umfang bei Ziel 400: ${Math.min(...lang)}–${Math.max(...lang)} Wörter, Mittel ${mittel(lang).toFixed(0)}`);
console.log(`  Preset im Text: Motiv ${(100 * presetGenutzt.motiv / laeufe).toFixed(1)} %, Wendung ${(100 * presetGenutzt.wendung / laeufe).toFixed(1)} %, Verwandlung ${(100 * presetGenutzt.verwandlung / laeufe).toFixed(1)} %, Requisit ${(100 * presetGenutzt.requisit / laeufe).toFixed(1)} % der Läufe (51 Presets reihum)`);
console.log(`  Abwechslung: ${viele.size} verschiedene Texte aus 20 gleichen Eingaben`);
if (funde.size) {
  console.log("  Befunde:");
  for (const [art, n] of [...funde.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`    ${String(n).padStart(5)}×  ${art}`);
    console.log(`           ${beispiel.get(art)}`);
  }
} else console.log("  keine Fehlerklasse ausgelöst");
console.log("  Gegenproben:");
gegen.forEach((z) => console.log(z));
fehler.forEach((f) => console.log(`  - ${f}`));

const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
const summe = [...funde.values()].reduce((a, b) => a + b, 0);
if (summe || gegenFehler || fehler.length) {
  console.error(`\n❌ Utopie/Dystopie: ${summe} Befund(e) in ${laeufe} Läufen, ${gegenFehler} Gegenprobe(n) ohne Wirkung, ${fehler.length} Einzelprüfung(en) rot.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Utopie/Dystopie: ${laeufe} Läufe ohne Befund, alle Gegenproben schlagen an.`);
}
