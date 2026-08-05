// Regressionslauf (Ablaufplan 1.6): prüft, dass die bekannten Negativtexte von
// den Metriken auch erkannt werden. Schlägt fehl, wenn eine Pathologie
// durchrutscht — dann ist die Kalibrierung zu lasch.
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = { getItem: (k: string) => (k in m ? m[k]! : null), setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; }, clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0 } as unknown as Storage;
  }
}
import { REGRESSIONSFAELLE } from "./regression.data";
import { phraseRepeatRatio, tenseBreakRatio, castSpread, perspectiveBreakRatio } from "../src/generation/coherence";
import { passt, naechsterSlot, wirktSatzwertig, type PoolAtom, type Kontext } from "../src/atoms/assemble";
import { deriveAtom } from "../src/atoms/derive";

const fails: string[] = [];
const zeilen: string[] = [];

for (const f of REGRESSIONSFAELLE) {
  const e = f.erwartung;
  const werte: string[] = [];
  if (e.phraseRepeatMin !== undefined) {
    const v = phraseRepeatRatio(f.text);
    werte.push(`Phrasen ${v.toFixed(3)} (≥ ${e.phraseRepeatMin})`);
    if (v < e.phraseRepeatMin) fails.push(`${f.id}: Phrasenwiederholung nur ${v.toFixed(3)}, erwartet ≥ ${e.phraseRepeatMin}`);
  }
  if (e.tenseBreakMin !== undefined) {
    const v = tenseBreakRatio(f.text);
    werte.push(`Tempus ${v.toFixed(3)} (≥ ${e.tenseBreakMin})`);
    if (v < e.tenseBreakMin) fails.push(`${f.id}: Tempusbruch nur ${v.toFixed(3)}, erwartet ≥ ${e.tenseBreakMin}`);
  }
  if (e.castSpreadMin !== undefined) {
    const v = castSpread(f.text, ["Baucis"]);
    werte.push(`Figuren ${v.toFixed(3)} (≥ ${e.castSpreadMin})`);
    if (v < e.castSpreadMin) fails.push(`${f.id}: Figurenstreuung nur ${v.toFixed(3)}, erwartet ≥ ${e.castSpreadMin}`);
  }
  if (e.perspBreakMin !== undefined) {
    const v = perspectiveBreakRatio(f.text, "third");
    werte.push(`Perspektive ${v.toFixed(3)} (≥ ${e.perspBreakMin})`);
    if (v < e.perspBreakMin) fails.push(`${f.id}: Perspektivbruch nur ${v.toFixed(3)}, erwartet ≥ ${e.perspBreakMin}`);
  }
  if (e.slotBruch) {
    // Echter Test gegen die Prüffunktion: Der Rahmen „Ich kenne ⟨AKK⟩“ verlangt eine
    // Nominalphrase im Akkusativ. Der Hauptsatz, der den Bruch verursacht hat, muss
    // abgewiesen werden — eine passende Nominalphrase dagegen zugelassen.
    const mk = (text: string, over: Partial<PoolAtom> = {}): PoolAtom =>
      ({ ...deriveAtom(text), id: "t-" + Math.random(), quelle: "test", bruchgrad: 0, verlangt: null, ...over }) as PoolAtom;
    const rahmen = mk("Ich kenne ⟨AKK⟩", { typ: "rahmen", verlangt: { rolle: "objekt", kasus: "akk", art: "nominalphrase" } });
    const k: Kontext = { vorheriges: rahmen, offenerKopf: false, entitaeten: new Map(), tempus: null, divergenz: 100, benutzt: new Set() };
    const boeser = mk("auf der Türklinke klebt ein Zuckerkringel");                 // Hauptsatz → muss raus
    const guter = mk("den Satz, der nur noch nach Süden zeigt");                    // Akk-Nominalphrase → darf rein
    const abgewiesen = !passt(boeser, k);
    const zugelassen = passt(guter, k);
    werte.push(`Splice abgewiesen: ${abgewiesen ? "ja" : "NEIN"} · gültige Füllung zugelassen: ${zugelassen ? "ja" : "nein"}`);
    if (!abgewiesen) fails.push(`${f.id}: Hauptsatz wird in einen Nominalphrasen-Slot gelassen — der Splice ist wieder möglich`);
    if (!zugelassen) fails.push(`${f.id}: gültige Akkusativ-Nominalphrase wird abgewiesen — Prüfung zu streng`);
  }
  if (e.zweitslot) {
    // Vorlagen mit ZWEI Slots verschiedener Art: "⟨FIGUR⟩ hatte ⟨AKK⟩ schon in der
    // Hand, denn ⟨SATZ⟩." Das statische Feld `verlangt` beschreibt nur den ersten -
    // der zweite muss aus dem Resttext gelesen werden, sonst landet eine
    // Nominalphrase hinter "denn" und ein Hauptsatz im Akkusativrahmen.
    const mk = (text: string, over: Partial<PoolAtom> = {}): PoolAtom =>
      ({ ...deriveAtom(text), id: "z-" + Math.random(), quelle: "test", bruchgrad: 0, verlangt: null, ...over }) as PoolAtom;
    const vorlage = "Du hattest ⟨AKK⟩ schon in der Hand, denn ⟨SATZ⟩.";
    const rest = vorlage.replace("⟨AKK⟩", "die Mappe");            // erster Slot bereits gefüllt
    const s1 = naechsterSlot(vorlage), s2 = naechsterSlot(rest);
    const rahmen = mk(vorlage, { typ: "rahmen", verlangt: s1 });
    const k: Kontext = { vorheriges: rahmen, offenerKopf: false, entitaeten: new Map(), tempus: null, divergenz: 100, benutzt: new Set() };
    const satz = mk("die Luft roch nach Papier und geduldeter Angst");
    const phrase = mk("ein taumelnder Mast");
    const a1 = !passt(satz, k, undefined, s1);          // Satz darf nicht in ⟨AKK⟩
    const a2 = !passt(phrase, k, undefined, s2);        // Fragment darf nicht in ⟨SATZ⟩
    const verb = wirktSatzwertig("die Luft roch nach Papier");
    werte.push(`Satz in ⟨AKK⟩ abgewiesen: ${a1 ? "ja" : "NEIN"} · Fragment in ⟨SATZ⟩ abgewiesen: ${a2 ? "ja" : "NEIN"} · „roch“ erkannt: ${verb ? "ja" : "NEIN"}`);
    if (!a1) fails.push(`${f.id}: satzwertiges Atom wird in einen Akkusativ-Slot gelassen`);
    if (!a2) fails.push(`${f.id}: Nominalphrase wird in einen ⟨SATZ⟩-Slot gelassen`);
    if (!verb) fails.push(`${f.id}: starkes Präteritum „roch“ wird nicht als finites Verb erkannt`);
  }
  zeilen.push(`  ${f.titel.padEnd(22)} ${werte.join(" · ")}`);
}

console.log("Regressionsfälle:");
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Regression(en) — Kalibrierung zu lasch:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Alle ${REGRESSIONSFAELLE.length} Regressionsfälle werden erkannt.`);
}
