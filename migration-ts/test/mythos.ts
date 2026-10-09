const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand für die Gattung „Gründungsmythos" (4.378.0).
//
// Die Zusage des Mythos: Was „seitdem" gilt, stammt aus der erzählten Tat.
// Bedeutung des Namens und Brauch gehören zum Opfer — die Prüfung liest das
// Opfer aus dem Text. Und der Name steht nicht vor der Gründung.
import { buildMythos, pruefeMythos, mythosTitel, mythosTitelAusText, erkenneGruendung, istEigenname, OPFER } from "../src/generation/mythos";
import { grammarFlags } from "../src/generation/grammar";
import { buildStory } from "../src/generation/buildStory";
import { BUILTIN_PRESETS } from "../src/presets.data";
import { fuelle } from "../src/features/weltblatt";
import type { GenInput } from "../src/types";

const fehler: string[] = [];
const soll = (ok: boolean, was: string): void => { if (!ok) fehler.push(was); };

// ── 1 · Erkennung ───────────────────────────────────────────────────────────
soll(istEigenname("Talheim") && istEigenname("Neu-Amaurot") && !istEigenname("Wüste") && !istEigenname("die Stadt"), "Eigenname: Talheim ja, Wüste nein (Fund beim Lesen)");
soll(erkenneGruendung("Talheim")?.name === "Talheim", "Gründung: Name");
soll(erkenneGruendung("ein Hafen")?.def === "der Hafen" && erkenneGruendung("ein Hafen")?.pd === "ihm", "Gründung: ein Hafen → der Hafen, ihm");
soll(erkenneGruendung("die Stadt")?.pd === "ihr", "Gründung: die Stadt → ihr");
soll(erkenneGruendung("irgendwas mit Bergen") === null, "Gründung: Unlesbares wird gezogen");

// ── 2 · Matrix ──────────────────────────────────────────────────────────────
const WO = ["", "am großen Fluss", "in der Wüste", "Velmar", "Talheim"];
const WANN = ["", "nach der großen Flut", "vor langer Zeit", "morgen"];
const WER = ["", "eine Hirtin", "der erste Schmied", "Mara", "ein Fischer, der nicht schwimmen konnte", "eine, die gehen muss"];
const WAS = ["", "die Stadt", "ein Hafen", "Talheim", "das Feuer", "irgendwas mit Bergen"];
const TOENE = ["uplifting", "dark", "ironisch", "nuechtern"];
const IDS = Object.keys(BUILTIN_PRESETS);
const funde = new Map<string, number>();
const beispiel = new Map<string, string>();
const jeOpfer: Record<string, number> = {};
let laeufe = 0;
for (const where of WO) for (const when of WANN) for (const who of WER) for (const what of WAS) for (const tone of TOENE) {
  const bank = BUILTIN_PRESETS[IDS[laeufe % IDS.length]!]!;
  const r = buildMythos({ where, when, who, what, tone, form: "prose", lenTarget: laeufe % 2 ? 300 : 110 } as GenInput, bank);
  laeufe++;
  jeOpfer[r.fb.opfer.id] = (jeOpfer[r.fb.opfer.id] || 0) + 1;
  const befunde = pruefeMythos(r.text, r.fb, bank);
  const g = grammarFlags(r.text.replace(/(?<!\p{L})(der|die|das|den|dem) \1(?!\p{L})/giu, "$1"));
  const echte = g.issues.filter((x) => !/^Verb-Kollision/.test(x));
  if (echte.length) befunde.push("Grammatik-Melder: " + echte.join("; "));
  if (mythosTitelAusText(r.text) !== mythosTitel(r.fb)) befunde.push("Titel aus dem Text weicht ab");
  // Vorrang: Ein eingetragener Name ist der Name.
  const gn = erkenneGruendung(what);
  if (gn?.name && r.fb.name !== gn.name) befunde.push("Eingetragener Name (Was) übergangen");
  if (!gn?.name && istEigenname(where) && r.fb.name !== where) befunde.push("Eingetragener Name (Wo) übergangen");
  if (/^(Morgen|Übermorgen|Heute), so sagen/.test(r.text)) befunde.push("Zukunftszeit im Urzustand");
  // Wer seinen Namen trägt, opfert ihn nicht.
  if (r.fb.gruender.ein.startsWith("jemand mit Namen") && r.fb.opfer.id === "name") befunde.push("Benannter Gründer opfert seinen Namen");
  for (const b of befunde) {
    const art = b.replace(/„[^"“]*["“]/g, "„…“").replace(/: .*$/, "");
    funde.set(art, (funde.get(art) || 0) + 1);
    if (!beispiel.has(art)) beispiel.set(art, `${b} ← ${JSON.stringify({ where, when, who, what, tone })}`);
  }
}
soll(Object.keys(jeOpfer).length === OPFER.length, `Nicht alle Opfer erreicht: ${Object.keys(jeOpfer).join(",")}`);
const basis = { where: "", when: "", who: "eine Hirtin", what: "die Stadt", tone: "uplifting", varLevel: "mid", structure: "rekombination", mode: "auto", perspective: "auto", rhythm: "auto", markovMode: "off", disruptor: "off", archetypeA: "neutral", archetypeB: "neutral", instability: 0, lenTarget: 150 } as unknown as GenInput;
soll(/^Am Anfang war/.test(buildStory(BUILTIN_PRESETS["myth"]!, { ...basis, form: "prose", welt: "mythos" })), "Weiche: Gattung Gründungsmythos baut keinen Mythos");

// ── 3 · Gegenproben ─────────────────────────────────────────────────────────
const gegen: string[] = [];
let gegenFehler = 0;
let r0 = buildMythos({ where: "", when: "", who: "eine Hirtin", what: "ein Hafen", tone: "uplifting", form: "prose", lenTarget: 300 } as GenInput, BUILTIN_PRESETS["myth"]!);
for (let i = 0; i < 40 && r0.fb.opfer.id === "haar"; i++) r0 = buildMythos({ where: "", when: "", who: "eine Hirtin", what: "ein Hafen", tone: "uplifting", form: "prose", lenTarget: 300 } as GenInput, BUILTIN_PRESETS["myth"]!);
const t0 = r0.text, fb0 = r0.fb, bank0 = BUILTIN_PRESETS["myth"]!, W = fb0.werte;
const haar = OPFER.find((o) => o.id === "haar")!;
const probe = (name: string, text: string, muster: RegExp, bank: typeof bank0 | undefined = bank0): void => {
  const ok = pruefeMythos(text, fb0, bank).some((x) => muster.test(x));
  gegen.push(`    ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) gegenFehler++;
};
const sauber = pruefeMythos(t0, fb0, bank0);
gegen.push(`    ${sauber.length ? "✗" : "✓"} Ausgangstext ohne Befund${sauber.length ? ": " + sauber.join("; ") : ""}`);
if (sauber.length) gegenFehler++;
probe("Name vor der Gründung", t0.replace("Am Anfang war an dieser Stelle", `Am Anfang war in ${fb0.name}`), /Name steht vor der Gründung/);
probe("Bedeutung eines anderen Opfers", t0.replace(`‚${fb0.opfer.bedeutung}‘`, `‚${haar.bedeutung}‘`), /Bedeutung/);
probe("Brauch eines anderen Opfers", t0.replace(fuelle(fb0.opfer.brauch, W), fuelle(haar.brauch, W)), /Brauch/);
{
  // Gabe und Gelingen vertauschen — direkt über den Wortlaut, nicht über eine
  // Satzzerlegung (die erste Fassung trennte nicht hinter „halten.“).
  const gabe = fuelle(fb0.opfer.gabe, W);
  const gel = fuelle(`Nun ${fb0.tat.gelingen.split("|")[0]} {P} ${fb0.tat.gelingen.split("|")[1]}.`, W);
  probe("Gelingen vor dem Opfer", t0.replace(gabe, "§1").replace(gel, gabe).replace("§1", gel), /Reihenfolge/);
}
probe("Erster Versuch scheitert nicht", t0.replace(fb0.tat.scheitern, "es gelang sofort"), /scheitert nicht/);
probe("Falscher Fall vor „gab es“ (Fund beim Lesen)", t0.replace("Der Hafen war noch nicht da.", "Der Hafen gab es noch nicht."), /Falscher Fall/);
probe("Großer Artikel mitten im Satz (Fund beim Lesen)", t0.replace(/\n\n/, " Und Die Möwen kamen.\n\n"), /Großgeschriebener Artikel/);
probe("Relativsatz ohne Komma (Fund beim Lesen)", t0.replace(/\n\n/, " Da kam ein Fremder, der aus dem Meer kam über das Wasser.\n\n"), /Relativsatz/);
probe("Motiv aus fremdem Preset", t0, /nicht aus dem Preset/, BUILTIN_PRESETS["kafka"]!);
probe("Motiv entfernt", t0.replace(/Nur eines war schon da: [^.]+\. ?/, ""), /Preset ohne Wirkung/);
probe("Platzhalter", t0.replace(fb0.name, "{N}"), /Platzhalter/);

console.log(`Prüfstand Gründungsmythos: ${laeufe} Läufe (5 Wo × 4 Wann × 6 Wer × 6 Was × 4 Töne, 51 Presets reihum)`);
console.log(`  Opfer: ${Object.entries(jeOpfer).map(([k, v]) => `${k} ${v}`).join(", ")}`);
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
  console.error(`\n❌ Gründungsmythos: ${summe} Befund(e) in ${laeufe} Läufen, ${gegenFehler} Gegenprobe(n) ohne Wirkung, ${fehler.length} Einzelprüfung(en) rot.`);
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Gründungsmythos: ${laeufe} Läufe ohne Befund, alle Gegenproben schlagen an.`);
}
