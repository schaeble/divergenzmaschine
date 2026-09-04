// Prüfstand Preset-Hygiene: features/hygiene.ts + Wortbank-Bereich „Ähnliche Einträge".
//
// Punkt 3 des Zielbilds: Beinahe-Doppel im Material sieht sonst nur der Leser.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
(globalThis as unknown as Record<string, unknown>).document = dom.window.document;
(globalThis as unknown as Record<string, unknown>).window = dom.window;
import { readFileSync } from "fs";
import { findeDoppel, kernwortGruppen, aehnlichkeit, staemme } from "../src/features/hygiene";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++;
  else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// ── 1 · Maß ─────────────────────────────────────────────────────────────────
wahr("Stämme lassen Funktionswörter weg", !staemme("Ein Brief, der ohne Absender ankommt").has("ohne"));
wahr("Ähnlichkeit erkennt Umformulierung", aehnlichkeit("die Nacht als offenes Tor", "Alles bleibt offen wie ein Tor bei Nacht.") >= 0.6);
wahr("und trennt Verschiedenes", aehnlichkeit("Ein Kranich, der im Dunkeln flackert", "Die Menge folgt einem Zeichen") < 0.3);

// ── 2 · Die drei Arten ──────────────────────────────────────────────────────
const probe = { motifs: ["ein Samowar, der nie ganz erkaltet", "die Nacht als offenes Tor", "Ein Tuch"], hooks: ["Der Samowar kocht, obwohl das Feuer erlischt", "Alles bleibt offen wie ein Tor bei Nacht.", "ein tuch"],
  props: ["ein Samowar"], turns: ["Ein Brief, der ohne Absender ankommt", "Ein vergessener Brief taucht plötzlich wieder auf"], obstacles: [], stakes: [], endings: [] } as unknown as Bank;
const d = findeDoppel(probe);
ist("identisch (auch über Kategorien, Groß/Klein egal)", d.filter((x) => x.art === "identisch").length, 1);
wahr("ähnlich: Nacht/Tor", d.some((x) => x.art === "ähnlich" && /Tor/.test(x.a)));
wahr("kernwort: Brief/Brief in derselben Kategorie", d.some((x) => x.art === "kernwort" && x.kern === "brief"));
wahr("Requisite gegen Bild zählt nicht (ein Samowar / Samowar-Bild)", !d.some((x) => x.katA === "props" || x.katB === "props"));
ist("Reihenfolge: identisch zuerst", d[0]!.art, "identisch");
const g = kernwortGruppen(probe);
wahr("Kernwort-Gruppe Samowar über Bild und Haken", g.some((x) => x.kern === "samow" && x.eintraege.length === 2));
wahr("Requisiten bleiben aus den Gruppen", !g.some((x) => x.eintraege.some((e) => e.kat === "props")));

// ── 3 · Die eingebauten Presets sind fast frei von identischen Doppeln ──────
{
  let ident = 0;
  for (const b of Object.values(BUILTIN_PRESETS)) ident += findeDoppel(b as Bank).filter((x) => x.art === "identisch").length;
  wahr("höchstens fünf identische Paare in allen 51 Presets", ident <= 5, String(ident));
}

// ── 4 · Verdrahtung ─────────────────────────────────────────────────────────
{
  const q = readFileSync("src/ui/wordbankView.ts", "utf8");
  wahr("Bereich „Ähnliche Einträge“ in der Wortbank", /" Ähnliche Einträge"/.test(q));
  wahr("× entfernt aus der aktiven Bank und zeichnet neu", /saveBank\(b\); load\(\); renderFull\(\); hygZeichnen\(\);/.test(q));
  wahr("„Preset aus Text“ warnt vor Beinahe-Doppeln", /Beinahe-Doppel, z\. B\./.test(q));
}

console.log(`Prüfstand Preset-Hygiene — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Preset-Hygiene: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Preset-Hygiene: alle ${geprueft} Prüfungen bestanden.`);
}
