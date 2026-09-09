// Prüfstand Variabilität: features/variabilitaet.ts + Badge in der Preset-Liste.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
import { readFileSync } from "fs";
import { messeVariabilitaet, variabilitaetFuer, messeUndMerke, bankHash, VARIABILITAET_EINGEBAUT, variabilitaetWort } from "../src/features/variabilitaet";
import { BUILTIN_PRESETS } from "../src/presets.data";
import type { Bank } from "../src/types";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

wahr("die Tabelle deckt alle eingebauten Presets", Object.keys(BUILTIN_PRESETS).every((id) => VARIABILITAET_EINGEBAUT[id] !== undefined), Object.keys(BUILTIN_PRESETS).filter((id) => VARIABILITAET_EINGEBAUT[id] === undefined).join(","));
ist("eingebaut: Wert aus der Tabelle, sofort", variabilitaetFuer("builtin:kafka", BUILTIN_PRESETS["kafka"] as Bank), 82);
ist("unbekanntes eigenes Preset: null", variabilitaetFuer("user:meins", BUILTIN_PRESETS["kafka"] as Bank), null);
const w = messeUndMerke("user:meins", BUILTIN_PRESETS["kafka"] as Bank, 3);
wahr("Messung liefert einen Prozentwert", w > 50 && w <= 100, String(w));
ist("gemerkt: derselbe Wert ohne Neumessung", variabilitaetFuer("user:meins", BUILTIN_PRESETS["kafka"] as Bank), w);
ist("geänderte Bank → Hash anders → null", variabilitaetFuer("user:meins", BUILTIN_PRESETS["hafen"] as Bank), null);
wahr("Hash unterscheidet Bänke", bankHash(BUILTIN_PRESETS["kafka"] as Bank) !== bankHash(BUILTIN_PRESETS["hafen"] as Bank));
wahr("Messung liegt im Band der Tabelle (±8 bei 6 Läufen)", Math.abs(messeVariabilitaet(BUILTIN_PRESETS["kafka"] as Bank, 6) - 82) <= 8);
// Ein kleines Preset fällt deutlich ab — dafür ist das Maß da.
{ const klein = { motifs: ["ein Brief ohne Absender", "eine Uhr ohne Zeiger", "ein Fenster ohne Glas"], hooks: ["Der Brief kommt an.", "Die Uhr bleibt stehen.", "Das Fenster ist offen."], props: ["ein Brief", "eine Uhr"], turns: ["Dann kippt es."], obstacles: ["aber niemand liest"], stakes: ["Es geht um den Brief."], endings: ["Zurück bleibt die Uhr."] } as unknown as Bank;
  wahr("kleines Preset: deutlich gleichförmiger als die eingebauten", messeVariabilitaet(klein, 6) < 40); }
ist("Wort zur Zahl", variabilitaetWort(82), "hoch — wie die eingebauten");
const q = readFileSync("src/ui/studio.ts", "utf8");
wahr("die Preset-Liste zeigt die Zahl neben dem Namen", /class: "var-badge"/.test(q) && /variabilitaetFuer\(v, pb\)/.test(q));
wahr("… nur, wenn der Schalter an ist (Vorgabe aus, gemerkt)", /id: "f-var-zeigen"/.test(q) && /if \(pb && localStorage\.getItem\("dm_variabilitaet_zeigen_v1"\) === "1"\)/.test(q));
wahr("Klick misst sechs Läufe und merkt", /messeUndMerke\(v, pb\)/.test(q));

console.log(`Prüfstand Variabilität — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) { console.error(`\n❌ Variabilität: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); proc.process?.exit(1); }
else console.log(`\n✅ Variabilität: alle ${geprueft} Prüfungen bestanden.`);
