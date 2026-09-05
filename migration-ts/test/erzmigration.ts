// Prüfstand Migration der Erzählerbank: alte Zehn-Plätze-Bank → Archiv + Arbeitsplatz.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
(globalThis as unknown as Record<string, unknown>).localStorage = dom.window.localStorage;
const TEXT = "Ein Text, der lang genug ist, um brauchbar zu sein, mit vielen Wörtern darin. ".repeat(5);
localStorage.setItem("dm_erzaehlerbank_v1", JSON.stringify([
  { titel: "Alt eins", text: TEXT, folge: "still", geburt: "still" },
  { titel: "", text: "" },
  { titel: "Alt drei", text: TEXT + "Drei.", folge: "offen" },
]));
localStorage.setItem("dm_erzaehler_quelle_v1", "2");

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => { geprueft++; if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); };

import("../src/features/erzaehlerbank").then((m) => {
  const alle = m.archivEintraege();
  ist("beide vollen Plätze liegen im Archiv", alle.length, 2);
  ist("mit ihrer Bauform", alle.find((e) => e.titel === "Alt drei")!.folge, "offen");
  ist("und ihrer Geburt", alle.find((e) => e.titel === "Alt eins")!.geburt, "still");
  ist("der gewählte Platz wurde zum Arbeitsplatz", m.ladeArbeitsplatz().titel, "Alt drei");
  ist("und bleibt im Studio gewählt (über die Kennung)", m.eintragNachId(m.ladeQuelle())!.titel, "Alt drei");
  ist("die alte Bank ist abgeräumt", localStorage.getItem("dm_erzaehlerbank_v1"), null);
  console.log(`Prüfstand Erzählerbank-Migration — ${geprueft} Prüfungen, ${bestanden} bestanden`);
  if (fails.length) { console.error(`\n❌ Erzählerbank-Migration: ${fails.length} Fehler:`); fails.forEach((f) => console.error("  - " + f)); (globalThis as unknown as { process: { exit: (c: number) => void } }).process.exit(1); }
  else console.log(`\n✅ Erzählerbank-Migration: alle ${geprueft} Prüfungen bestanden.`);
});
