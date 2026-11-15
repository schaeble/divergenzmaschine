const st: Record<string, string> = {};
(globalThis as unknown as { localStorage: unknown }).localStorage = {
  getItem: (k: string) => st[k] ?? null, setItem: (k: string, v: string) => { st[k] = String(v); }, removeItem: (k: string) => { delete st[k]; },
};
(globalThis as unknown as { window: unknown }).window = { localStorage: (globalThis as unknown as { localStorage: unknown }).localStorage };
// Prüfstand „Alles würfeln" bei gewählter Gattung (4.381.0).
//
// Gemessen war: Die vier W kamen aus Ereignis-Quellen und passten nicht. Jetzt
// würfeln sie aus dem Vorrat der Gattung — und jeder Wurf muss von IHREN
// Erkennern gelesen werden und einen Text ohne Befund ergeben. Ein Wurf, den
// die Gattung übergeht, wäre so falsch wie vorher.
import { wuerfleGattung4W, wuerfleGattung, wuerfleFormUndGattung, WUERFEL_GATTUNGEN, gattungKopfKontext, gattungSaat, KOPF_WOVON } from "../src/features/gattungWurf";
import { erkenneLage, erkenneZeit, erkenneGrundsatz, erkenneErzaehler } from "../src/features/weltblatt";
import { erkenneHeld, buildMaerchen, pruefeMaerchen } from "../src/generation/maerchen";
import { erkenneTiere, erkenneLehre, schemaFuerTiere, buildFabel, pruefeFabel } from "../src/generation/fabel";
import { erkenneGruendung, buildMythos, pruefeMythos } from "../src/generation/mythos";
import { buildUtopie, pruefeUtopie } from "../src/generation/utopie";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { GenInput } from "../src/types";

const fehler: string[] = [];
const funde = new Map<string, string>();
const melde = (art: string, beispiel: string): void => { if (!funde.has(art)) funde.set(art, beispiel); fehler.push(art); };
const bank = BUILTIN_PRESETS["romantik"]!;
const N = 400;
const ein = (w: { where: string; when: string; who: string; what: string }, tone = "uplifting"): GenInput =>
  ({ ...w, tone, form: "prose", lenTarget: 200 } as GenInput);
const TOENE = ["uplifting", "dark", "ironisch", "nuechtern"];

for (const art of ["utopie", "dystopie"] as const) for (let i = 0; i < N; i++) {
  const w = wuerfleGattung4W(art);
  if (!erkenneLage(w.where)) melde(`${art}: Lage nicht erkannt`, w.where);
  if (!erkenneZeit(w.when)) melde(`${art}: Zeit nicht erkannt`, w.when);
  if (!erkenneGrundsatz(w.what)) melde(`${art}: Grundsatz nicht erkannt`, w.what);
  if (/einer?, d(er|ie) (gehen|fliehen) muss/.test(w.who) && erkenneErzaehler(w.who).art !== "gehend") melde(`${art}: Gehender nicht erkannt`, w.who);
  const r = buildUtopie(ein(w, TOENE[i % 4]), bank, art);
  const b = pruefeUtopie(r.text, r.fb, [w.where, w.when, w.who, w.what].join(" "), bank);
  if (b.length) melde(`${art}: Befund ${b[0]}`, JSON.stringify(w));
}
for (let i = 0; i < N; i++) {
  const w = wuerfleGattung4W("maerchen");
  if (!erkenneHeld(w.who)) melde("maerchen: Held nicht erkannt", w.who);
  const r = buildMaerchen(ein(w, TOENE[i % 4]), bank);
  if (r.fb.held.def !== erkenneHeld(w.who)?.def) melde("maerchen: Held übergangen", w.who);
  const b = pruefeMaerchen(r.text, r.fb, bank);
  if (b.length) melde(`maerchen: Befund ${b[0]}`, JSON.stringify(w));
}
for (let i = 0; i < N; i++) {
  const w = wuerfleGattung4W("fabel");
  if (w.when !== "") melde("fabel: Wann nicht leer", w.when);
  const lehre = erkenneLehre(w.what);
  if (!lehre) melde("fabel: Lehre nicht erkannt", w.what);
  if (!schemaFuerTiere(erkenneTiere(w.who), lehre)) melde("fabel: Tiere passen nicht zur Lehre", `${w.who} / ${w.what}`);
  const r = buildFabel(ein(w, TOENE[i % 4]), bank);
  if (!r.fb.tiereAusEingabe || !r.fb.lehreAusEingabe) melde("fabel: Wurf übergangen", JSON.stringify(w));
  const b = pruefeFabel(r.text, r.fb, bank);
  if (b.length) melde(`fabel: Befund ${b[0]}`, JSON.stringify(w));
}
for (let i = 0; i < N; i++) {
  const w = wuerfleGattung4W("mythos");
  if (!erkenneHeld(w.who)) melde("mythos: Gründer nicht erkannt", w.who);
  if (!erkenneGruendung(w.what)) melde("mythos: Gegründetes nicht erkannt", w.what);
  const r = buildMythos(ein(w, TOENE[i % 4]), bank);
  const b = pruefeMythos(r.text, r.fb, bank);
  if (b.length) melde(`mythos: Befund ${b[0]}`, JSON.stringify(w));
}
// Das Gattungs-Schloss offen (4.382.0): Bei offener Form oder Prosa kommt
// immer eine der fünf Gattungen, nie „keine"; jede kommt vor. Gegenprobe: Ist
// die Form auf etwas anderes gesperrt, kommt „keine".
{
  const gesehen = new Set<string>();
  for (let i = 0; i < 500; i++) {
    for (const [f, zu] of [["reim", false], ["prose", true], ["prose", false]] as const) {
      const g = wuerfleGattung(f, zu);
      if (!WUERFEL_GATTUNGEN.includes(g)) melde(`Gattungswurf: „${g}" bei Form ${f}${zu ? " (gesperrt)" : ""}`, g);
      gesehen.add(g);
    }
    for (const f of ["reim", "script", "meldung"]) if (wuerfleGattung(f, true) !== "keine") melde(`Gegenprobe: Gattung trotz gesperrter Form ${f}`, f);
  }
  for (const g of WUERFEL_GATTUNGEN) if (!gesehen.has(g)) melde(`Gattungswurf: „${g}" kam in 1500 Würfen nie`, g);
}
// Einfacher Kopf (4.383.0): Der Satz geht GANZ ins Was, die anderen W aus
// dem Vorrat; ein leerer Satz wird gewürfelt; jeder Vorschlag ist lesbar.
for (const g of WUERFEL_GATTUNGEN) {
  if (!KOPF_WOVON[g]) melde(`Kopf: keine Wovon-Zeile für ${g}`, g);
  for (let i = 0; i < 60; i++) {
    const saat = gattungSaat(g);
    const k = gattungKopfKontext(g, saat);
    if (k.what !== saat) melde(`Kopf ${g}: Satz nicht ganz im Was`, `${saat} → ${k.what}`);
    if (!gattungKopfKontext(g, "").what) melde(`Kopf ${g}: leerer Satz bleibt leer`, g);
    if (g === "fabel" && !schemaFuerTiere(erkenneTiere(k.who), erkenneLehre(k.what))) melde("Kopf fabel: Tiere passen nicht zur Lehre", `${k.who} / ${k.what}`);
  }
}
// Gegenprobe: Der Grundsatz „Es gibt kein Geld." wird NICHT zerlegt.
if (gattungKopfKontext("utopie", "Es gibt kein Geld.").what !== "Es gibt kein Geld.") melde("Gegenprobe: Grundsatz zerlegt", "");
// Form und Gattung gemeinsam (4.392.0). Gemeldet: „Alles würfeln verändert
// die Form nicht. Prosa als Form überwiegt." Vier Fälle, je mit Gegenprobe.
{
  const FORMEN = ["prose", "poem", "strang", "reim", "haiku", "script", "video", "bericht", "meldung"];
  const N = 3000;
  const z = (o: { form: string; formZu: boolean; welt: string; weltZu: boolean }): { f: Map<string, number>; g: Map<string, number>; falsch: number } => {
    const f = new Map<string, number>(), g = new Map<string, number>(); let falsch = 0;
    for (let i = 0; i < N; i++) { const w = wuerfleFormUndGattung({ ...o, formen: FORMEN }); f.set(w.form, (f.get(w.form) || 0) + 1); g.set(w.welt, (g.get(w.welt) || 0) + 1); if (w.welt !== "keine" && w.form !== "prose" && w.form !== "video") falsch++; }
    return { f, g, falsch };
  };
  const offen = z({ form: "prose", formZu: false, welt: "keine", weltZu: false });
  if (offen.f.size !== FORMEN.length) melde(`beide offen: nur ${offen.f.size} von ${FORMEN.length} Formen`, "");
  for (const [k, n] of offen.f) if (n / N > 0.16 || n / N < 0.07) melde(`beide offen: Form ${k} nicht gleichmäßig (${n}/${N})`, k);
  if (offen.falsch) melde("beide offen: Gattung bei einer Form, die sie nicht trägt", String(offen.falsch));
  for (const gt of WUERFEL_GATTUNGEN) if (!offen.g.has(gt)) melde(`beide offen: Gattung ${gt} kam nie`, gt);
  const fest = z({ form: "reim", formZu: false, welt: "fabel", weltZu: true });
  if ([...fest.f.keys()].sort().join(",") !== "prose,video") melde("Gattung fest: Form nicht nur Prosa/Multi-Shot", [...fest.f.keys()].join(","));
  if (fest.g.size !== 1 || !fest.g.has("fabel")) melde("Gattung fest: sie hat sich bewegt", [...fest.g.keys()].join(","));
  const ohne = z({ form: "reim", formZu: false, welt: "keine", weltZu: true });
  if (ohne.f.size !== FORMEN.length || ohne.g.size !== 1) melde("Gegenprobe: Gattung fest auf keine → Form aus allen, Gattung bleibt", `${ohne.f.size}/${ohne.g.size}`);
  const formFest = z({ form: "reim", formZu: true, welt: "fabel", weltZu: false });
  if (formFest.f.size !== 1 || formFest.g.size !== 1 || !formFest.g.has("keine")) melde("Form fest auf Reim: Gattung muss keine sein", [...formFest.g.keys()].join(","));
  const prosaFest = z({ form: "prose", formZu: true, welt: "keine", weltZu: false });
  if (prosaFest.g.has("keine") || prosaFest.g.size !== WUERFEL_GATTUNGEN.length) melde("Form fest auf Prosa: eine der fünf Gattungen", [...prosaFest.g.keys()].join(","));
  const zu = wuerfleFormUndGattung({ form: "haiku", formZu: true, welt: "mythos", weltZu: true, formen: FORMEN });
  if (zu.form !== "haiku" || zu.welt !== "mythos") melde("Gegenprobe: beide fest → nichts ändert sich", `${zu.form}/${zu.welt}`);
}
// Unbekannte Gattung: nichts.
const leer = wuerfleGattung4W("keine");
if (leer.where || leer.when || leer.who || leer.what) melde("keine Gattung: Wurf nicht leer", JSON.stringify(leer));
// Der Fund beim Würfeln: „ein Findelkind" ist sächlich.
for (const [w, soll] of [["ein Findelkind ohne Spiegelbild", "das Findelkind ohne Spiegelbild"], ["ein Waisenmädchen", "das Waisenmädchen"], ["ein Hirtenjunge", "der Hirtenjunge"], ["ein Kalb", "das Kalb"]] as const) {
  if (erkenneHeld(w)?.def !== soll) melde(`Held: „${w}" → „${erkenneHeld(w)?.def}" statt „${soll}"`, w);
}
// Gegenprobe: Der Ereigniswert aus dem Messlauf wird von der Fabel NICHT gelesen.
if (erkenneLehre("sucht Nahrung") || erkenneTiere("ein Oktopus").length) melde("Gegenprobe: Ereigniswert wird als Fabel gelesen", "");

console.log(`Prüfstand Gattungswurf: ${N} Würfe je Gattung (Utopie, Dystopie, Märchen, Fabel, Mythos), jeder gebaut und geprüft`);
for (const [art, b] of funde) console.log(`  - ${art} ← ${b}`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fehler.length) { console.error(`\n❌ Gattungswurf: ${fehler.length} Befund(e).`); proc.process?.exit(1); }
else console.log(`\n✅ Gattungswurf: ${5 * N} Würfe, jeder von seiner Gattung gelesen und ohne Befund gebaut.`);
