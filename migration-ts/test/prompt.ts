// Prüfstand Prompt: Spiegelt der Auftrag den Bestand?
//
// Gefragt wurde: „Nachdem alle Presets mehr Volumen bekommen haben und es
// Nachbesserungen in der Struktur gab — spiegelt der jetzige Prompt für eigene
// Presets die aktuelle Fassung im Bestand wider?"
//
// Er tat es nicht. Die Zahlen im Auftrag (24/16/22/18/17/11/12) stammten aus der
// Zeit vor dem Ausbau, und „verwandlungen" kam gar nicht vor, obwohl 41 der 51
// eingebauten Presets welche tragen — die Antwort des Modells hätte sie ohnehin
// verloren, weil `normalizeBankShape` nur BANK_KEYS übernahm.
//
// Die Frage soll sich nicht wiederholen müssen. Deshalb steht die Vorgabe als
// Daten (`KATEGORIE_VORGABE`) und wird hier gegen den Bestand gehalten. Sobald
// beide auseinanderlaufen, sagt es der Prüfstand — mit Zahlen.
//
// Die Schranken sind bewusst weit: Der Bestand wandert, wenn jemand Material
// schreibt, und eine Vorgabe muss nicht auf den Eintrag genau stimmen. Sie muss
// im beobachteten Bereich liegen und um höchstens zwei Einträge vom Median
// abweichen. Zwei, nicht drei: Bei drei wäre die alte Zahl für turns (18 gegen
// 21) durchgerutscht — eine Schranke, die den gemeldeten Fall nicht fängt, ist
// keine.
import { BUILTIN_PRESETS } from "../src/presets.data";
import { KATEGORIE_VORGABE } from "../src/features/ki";
import { normalizeBankShape } from "../src/storage";
import { pruefePaar } from "../src/generation/verwandlung";
import { buildWordbankPrompt } from "../src/features/ki";
import { buildPreset2Prompt } from "../src/features/preset2";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

const zz = (s: string): number => s.split(/\s+/).filter(Boolean).length;
const med = (a: number[]): number => { const b = [...a].sort((x, y) => x - y); return b[Math.floor(b.length / 2)]!; };
const banken = Object.values(BUILTIN_PRESETS) as unknown as Record<string, string[]>[];

// ── 1 · Zahl je Kategorie ─────────────────────────────────────────────────
console.log("  Kategorie      Auftrag   Bestand (Median · Spanne)   Wörter Auftrag/Bestand");
for (const v of KATEGORIE_VORGABE) {
  const langen = banken.map((b) => (b[v.key] || []).length).filter((n) => n > 0);
  if (!langen.length) { fails.push(`${v.key}: kommt im Bestand nicht vor`); geprueft++; continue; }
  const m = med(langen), lo = Math.min(...langen), hi = Math.max(...langen);
  const wl = banken.flatMap((b) => (b[v.key] || [])).map(zz);
  const wm = wl.length ? med(wl) : 0;
  console.log(`  ${v.key.padEnd(14)} ${String(v.anzahl).padStart(4)}   ${String(m).padStart(6)} · ${lo}–${hi}`.padEnd(56)
    + `${v.woerter || "—"} / ${wm}`);
  wahr(`${v.key}: die Zahl im Auftrag liegt nah am Median (${v.anzahl} gegen ${m})`, Math.abs(v.anzahl - m) <= 2);
  wahr(`${v.key}: sie liegt in der beobachteten Spanne (${lo}–${hi})`, v.anzahl >= lo && v.anzahl <= hi);
  wahr(`${v.key}: die angegebene Spanne deckt den Bestand (${v.min}–${v.max} gegen ${lo}–${hi})`,
    v.min <= lo && v.max >= hi);
  if (v.woerter) {
    wahr(`${v.key}: die Wortlänge stimmt (${v.woerter} gegen ${wm})`, Math.abs(v.woerter - wm) <= 2);
  }
}

// ── 2 · Der Auftrag kennt jede Kategorie des Bestands ─────────────────────
// Umgedreht gefragt, damit eine neue Kategorie nicht still fehlt.
{
  const imBestand = new Set<string>();
  for (const b of banken) for (const k of Object.keys(b)) if (Array.isArray(b[k]) && b[k]!.length) imBestand.add(k);
  const imAuftrag = new Set(KATEGORIE_VORGABE.map((v) => v.key));
  const fehlt = [...imBestand].filter((k) => !imAuftrag.has(k)).sort();
  ist("der Auftrag kennt jede Kategorie, die im Bestand vorkommt", fehlt.join(", "), "");
  const zuviel = [...imAuftrag].filter((k) => !imBestand.has(k)).sort();
  ist("und verlangt keine, die es nicht gibt", zuviel.join(", "), "");
}

// ── 3 · Verwandlungen kommen durch die Normalisierung ─────────────────────
// Der eigentliche Fehler war nicht der Prompt allein: `normalizeBankShape`
// übernahm nur BANK_KEYS und warf die Paare still weg. Ein Auftrag, der etwas
// verlangt, das die Annahme verwirft, ist schlimmer als keiner.
{
  const roh = {
    motifs: ["ein Turm, der im Nebel steht"], hooks: ["Es klopft."], props: ["einen Schlüssel"],
    turns: ["der Weg dreht sich"], obstacles: ["die Tür klemmt"], stakes: ["Der Einsatz ist alles."],
    endings: ["Und dann ist es still."],
    verwandlungen: ["Glocke→Stimme", "Turm→Berg", "Glocke→Berg", "kaputt"],
  };
  const bank = normalizeBankShape(roh);
  wahr("die Verwandlungen überleben die Normalisierung", (bank.verwandlungen || []).length > 0);
  ist("ungültige Paare werden dabei aussortiert",
    (bank.verwandlungen || []).filter((x) => !pruefePaar(x).ok).length, 0);
  ist("und die gültigen bleiben vollständig", (bank.verwandlungen || []).join(" "), "Glocke→Stimme Turm→Berg");
  const ohne = normalizeBankShape({ motifs: ["ein Turm, der im Nebel steht"] });
  ist("ohne Verwandlungen bleibt das Feld leer", ohne.verwandlungen, undefined);
}

// ── 4 · Anteil der Satz-Kategorien ────────────────────────────────────────
// Die Zahl steht im Auftrag („rund 65 Prozent"). Sie ist gemessen und wandert.
{
  const SATZ = ["hooks", "turns", "obstacles", "endings"];
  const TEXT = ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"];
  let satz = 0, alle = 0;
  for (const b of banken) for (const k of TEXT) {
    const w = (b[k] || []).reduce((s, x) => s + zz(x), 0);
    alle += w; if (SATZ.includes(k)) satz += w;
  }
  const anteil = Math.round(satz / alle * 100);
  console.log(`  Anteil der Satz-Kategorien an den Wörtern: ${anteil} %`);
  wahr(`der im Auftrag genannte Anteil stimmt (${anteil} % gegen 65 %)`, Math.abs(anteil - 65) <= 5);
}


// ── 5 · Der Auftrag steht auch im Text, nicht nur in den Daten ────────────
{
  const auftrag = buildWordbankPrompt({});
  const fehlt = KATEGORIE_VORGABE.filter((v) => !auftrag.includes(`- ${v.key}: ${v.anzahl} `)).map((v) => v.key);
  ist("jede Kategorie steht mit ihrer Zahl im Auftrag", fehlt.join(", "), "");
  wahr("die Motivverwandlungen sind erklärt", /MOTIVVERWANDLUNGEN/i.test(auftrag) && /DASSELBE GESCHLECHT/.test(auftrag));
  wahr("das JSON verlangt acht Schlüssel", /8 Schlüsseln/.test(auftrag) && /verwandlungen\)/.test(auftrag));
}

// ── 6 · Ein Update darf ein Preset nicht schrumpfen ───────────────────────
// Gefragt: „Das heißt, ich sollte die Presets updaten." Der Weg dafür ist
// „Preset verbessern" — und der trug bis 4.291 die Anweisung „pro
// generatoren-Kategorie 8-12 Eintraege", also rund 70 statt der gemessenen 125.
// Der Auftrag widersprach sich damit selbst, und der widersprechende Teil stand
// ZUERST. Wer ein ausgebautes Preset aktualisieren ließ, bekam es halbiert
// zurück — ohne Warnung, die Datei sah danach normal aus.
{
  const neu2 = buildPreset2Prompt("Hafen");
  const mitSeed = buildPreset2Prompt("Hafen", '{"generatoren":{"motifs":["ein Kran im Nebel"]}}');

  // a) Keine zweite, eigene Mengenangabe.
  const eigene = [...mitSeed.matchAll(/(\d+)\s*-\s*(\d+)\s*Eintr/g)].map((m) => m[0]);
  ist("der Update-Auftrag nennt keine eigene Eintragszahl", eigene.join(" · "), "");

  // b) Der Kategorienblock ist in beiden Fassungen derselbe.
  // Von HINTEN suchen: Das Ausgangsmaterial steht mit im Auftrag und enthält
  // selbst einen generatoren-Block. Wer von vorn sucht, vergleicht den Seed.
  const block = (t: string): string => {
    const i = t.lastIndexOf('"generatoren": {');
    return i < 0 ? "" : t.slice(i, i + 900);
  };
  wahr("Neubau und Update verlangen denselben Kategorienblock", block(neu2) === block(mitSeed) && block(neu2).length > 100);

  // c) Und das Update sagt ausdrücklich, dass nichts wegfallen darf.
  wahr("das Update verbietet das Schrumpfen", /KEINER Kategorie weniger/.test(mitSeed));
  wahr("und nennt die Verwandlungen unter den zu füllenden Feldern", /verwandlungen/.test(mitSeed));
  wahr("ohne Ausgangsmaterial steht der Absatz nicht da", !/ERWEITERE es/.test(neu2));
}

console.log(`Prüfstand Prompt — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Prompt: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Prompt: alle ${geprueft} Prüfungen bestanden.`);
}
