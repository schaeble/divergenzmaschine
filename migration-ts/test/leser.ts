// Prüfstand Lesemodus (4.369.0).
//
// Der Knopf „Speichern" steht jetzt auch in der Leseleiste. Ob er dort wirklich
// eine Datei erzeugt, ließ sich bisher nur im Browser sehen — und genau das war
// beim Studio-Knopf der ungeprüfte Rest. Hier läuft der Weg in jsdom ab: Leiste
// aufbauen, klicken, abfangen, was der Anker bekommen hätte. Geprüft wird
// dadurch alles außer dem Schreiben auf die Platte: Reihenfolge der Knöpfe,
// Dateiname, Kopfzeilen, Format bei gedrückter Umschalttaste — und dass der
// Anker im Dokument hängt, denn ein loser Anker bleibt in Firefox wirkungslos.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/" });
const G = globalThis as unknown as Record<string, unknown>;
for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "Event", "MouseEvent", "Node", "Blob", "URL"]) {
  try { Object.defineProperty(G, k, { value: (dom.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* schon da */ }
}

import { openReader } from "../src/ui/reader";

const fails: string[] = [];
let geprueft = 0, bestanden = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) bestanden++; else fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`);
};
const wahr = (name: string, b: boolean, zusatz = ""): void => ist(name + (zusatz ? ` (${zusatz})` : ""), b, true);

// Den Anker abfangen: Was hätte der Browser heruntergeladen?
interface Fund { name: string; typ: string; inhalt: string; imDokument: boolean }
let fund: Fund | null = null;
const blobs = new Map<string, { type: string; text: string }>();
const W = dom.window as unknown as { URL: { createObjectURL: (b: unknown) => string; revokeObjectURL: (u: string) => void } };
let nr = 0;
W.URL.createObjectURL = (b: unknown): string => {
  const blob = b as { type: string; _teile?: unknown };
  const url = `blob:x${++nr}`;
  blobs.set(url, { type: blob.type, text: String((b as { __text?: string }).__text ?? "") });
  return url;
};
W.URL.revokeObjectURL = (): void => {};
// jsdom liest den Inhalt eines Blobs nur asynchron; für die Prüfung genügt der
// Text, den der Aufrufer hineingegeben hat — deshalb wird Blob umwickelt.
const EchterBlob = dom.window.Blob;
Object.defineProperty(G, "Blob", {
  value: class extends EchterBlob {
    __text: string;
    constructor(teile: string[], opt?: { type?: string }) { super(teile, opt); this.__text = teile.join(""); }
  }, writable: true, configurable: true,
});
const AnkerKlick = dom.window.HTMLAnchorElement.prototype.click;
dom.window.HTMLAnchorElement.prototype.click = function (this: HTMLAnchorElement): void {
  const b = blobs.get(this.href);
  fund = { name: this.download, typ: b?.type || "", inhalt: b?.text || "", imDokument: !!this.ownerDocument.body.contains(this) };
};
void AnkerKlick;

const TEXT = "Der Hafen schweigt\nim Nebel zählt ein Wächter\ndie Fenster nach";
const CTX = { titel: "Die Fenster am Hafen", form: "Haiku", who: "ein Wächter", where: "Hafen", einstellungen: { tone: "Melancholisch", preset: "nebel" } };

const leiste = (): HTMLElement => dom.window.document.querySelector(".reader-bar") as HTMLElement;
const knopf = (beschriftung: string): HTMLButtonElement | undefined =>
  Array.from(leiste().querySelectorAll("button")).find((b) => (b.textContent || "").includes(beschriftung)) as HTMLButtonElement | undefined;

// ── 1 · Die Leiste ──────────────────────────────────────────────────────────
openReader(TEXT, CTX);
wahr("der Lesemodus öffnet", !!leiste());
wahr("Speichern steht in der Leiste", !!knopf("Speichern"));
{
  const texte = Array.from(leiste().querySelectorAll("button")).map((b) => (b.textContent || "").trim());
  const iM = texte.findIndex((t) => t.includes("Merken")), iS = texte.findIndex((t) => t.includes("Speichern")), iV = texte.findIndex((t) => t.includes("Vorlesen"));
  wahr("Speichern steht zwischen Merken und Vorlesen", iM < iS && iS < iV, texte.join("|"));
  wahr("der Knopf sagt, was Umschalt tut", /Umschalt/.test(knopf("Speichern")!.title));
}

// ── 2 · Was der Klick erzeugt ───────────────────────────────────────────────
{
  fund = null;
  knopf("Speichern")!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  const f = fund as Fund | null;
  wahr("ein Klick erzeugt eine Datei", !!f);
  if (f) {
    wahr("Dateiname aus dem Titel, mit Tag", /^divergenz_die-fenster-am-hafen_\d{4}-\d{2}-\d{2}\.txt$/.test(f.name), f.name);
    wahr("Zeichensatz im Typ", /charset=utf-8/.test(f.typ), f.typ);
    wahr("der Anker hing im Dokument", f.imDokument);
    wahr("Titel im Kopf", f.inhalt.startsWith("Die Fenster am Hafen\n===="));
    wahr("Form und Version im Kopf", /Form: Haiku · Datum: \d{4}-\d{2}-\d{2} \d{2}:\d{2} · Divergenzmaschine \d+\.\d+\.\d+/.test(f.inhalt));
    wahr("4W im Kopf, ohne die leeren", /Wer: ein Wächter · Wo: Hafen/.test(f.inhalt) && !/Wann:/.test(f.inhalt));
    wahr("Regler im Kopf", /Preset: nebel · Ton: Melancholisch/.test(f.inhalt));
    wahr("der Text steht ungekürzt darin", f.inhalt.includes(TEXT));
  }
}

// ── 3 · Umschalt gibt Markdown ──────────────────────────────────────────────
{
  fund = null;
  knopf("Speichern")!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true, shiftKey: true }));
  const f = fund as Fund | null;
  wahr("Umschalt+Klick gibt Markdown", !!f && f.name.endsWith(".md"), f?.name);
  wahr("Markdown-Typ", !!f && /markdown/.test(f.typ), f?.typ);
  wahr("Markdown behält die Verszeilen", !!f && f.inhalt.includes("Der Hafen schweigt  \nim Nebel"));
  // Gegenprobe: ohne Umschalt wäre es TXT ohne harte Umbrüche.
  fund = null;
  knopf("Speichern")!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  wahr("Gegenprobe: TXT hat keine harten Umbrüche", !!fund && !(fund as Fund).inhalt.includes("schweigt  \n"));
}

// ── 4 · Ohne Angaben und ohne Text ──────────────────────────────────────────
{
  (dom.window.document.querySelector(".reader") as HTMLElement).remove();
  openReader("Nur ein Satz.", {});
  fund = null;
  knopf("Speichern")!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  const f = fund as Fund | null;
  wahr("ohne Titel und Form trotzdem eine Datei", !!f && /^divergenz_\d{4}-\d{2}-\d{2}\.txt$/.test(f.name), f?.name);
  wahr("Kopf nur mit Datum und Version", !!f && /^Datum: .* · Divergenzmaschine /.test(f.inhalt), (f?.inhalt || "").split("\n")[0]);

  (dom.window.document.querySelector(".reader") as HTMLElement).remove();
  openReader("", {});
  fund = null;
  knopf("Speichern")!.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
  // Ohne Text steht „Noch kein Text." im Leser — gespeichert wird genau das,
  // kein leeres Blatt. Wichtig ist nur: kein Absturz, ein sauberer Name.
  wahr("leerer Leser stürzt nicht ab", !!fund && (fund as Fund).name.endsWith(".txt"));
}

console.log(`Prüfstand Lesemodus — ${geprueft} Prüfungen, ${bestanden} bestanden`);
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ Lesemodus: ${fails.length} Fehler:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Lesemodus: alle ${geprueft} Prüfungen bestanden.`);
}
