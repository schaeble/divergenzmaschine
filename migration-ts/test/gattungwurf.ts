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
import { wuerfleGattung4W } from "../src/features/gattungWurf";
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
