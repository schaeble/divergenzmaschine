// Prüfstand Register-Liste im Wortbank-Reiter.
//
// Er stellt die BEDIENUNG nach, nicht die Rechnung — die steht in
// test/register.ts. Anlass ist ein Fehler, den keine reine Prüfung gefunden
// hätte: Die Regel „beide Angaben oder keine" war richtig, das sofortige
// Neuzeichnen der Liste danach war falsch. Wer die Welt einstellte, verlor sie
// beim Griff zur Sprache, weil die halbe Angabe nicht gespeichert und die Liste
// mit leeren Feldern neu gezeichnet wurde. Beide zu setzen war unmöglich.
//
// Zwei richtige Einzelteile, die zusammen nicht funktionieren — das findet man
// nur, indem man die Schritte in der Reihenfolge geht, in der ein Mensch sie
// geht.
import { JSDOM } from "jsdom";
const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "https://x.test/", pretendToBeVisual: true });
const G = globalThis as unknown as Record<string, unknown>;
for (const k of ["window", "document", "localStorage", "navigator", "HTMLElement", "HTMLInputElement",
  "HTMLSelectElement", "HTMLButtonElement", "Event", "CustomEvent", "Node", "getComputedStyle",
  "requestAnimationFrame", "cancelAnimationFrame", "MutationObserver", "Blob", "URL", "FileReader",
  "Image", "DOMParser"]) {
  try { Object.defineProperty(G, k, { value: (dom.window as unknown as Record<string, unknown>)[k], writable: true, configurable: true }); } catch { /* schon da */ }
}
const keinMedia = (): unknown => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {}, addListener: () => {}, removeListener: () => {} });
Object.defineProperty(G, "matchMedia", { value: keinMedia, writable: true, configurable: true });
(dom.window as unknown as Record<string, unknown>)["matchMedia"] = keinMedia;

import { saveUserPresets } from "../src/wordbank";
import { DEFAULT_BANK } from "../src/constants";
import { registerVon, EIGEN_KEY } from "../src/features/register";
import { KOPF_FORMEN } from "../src/features/einfach";
import { FORM_OPTS } from "../src/generation/optionen";
import { mountWordbank } from "../src/ui/wordbankView";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// Zwei eigene Presets anlegen und die Ansicht aufbauen.
localStorage.clear();
saveUserPresets({ MeinPreset: DEFAULT_BANK, Zweites: DEFAULT_BANK });
const root = dom.window.document.createElement("div");
dom.window.document.body.append(root);
mountWordbank(root);

// Die Liste steckt in einem Aufklapper und wird erst beim Öffnen gebaut.
const details = Array.from(root.querySelectorAll("details"))
  .find((d) => /Register eigener Presets/.test(d.textContent || ""));
wahr("die Zuordnungsliste ist da", !!details);
details!.setAttribute("open", "");
details!.dispatchEvent(new dom.window.Event("toggle"));

// JEDESMAL NEU SUCHEN, nie einen Verweis festhalten.
//
// Der erste Anlauf dieses Prüfstands hielt `w` und `s` als Verweise — und
// bestand deshalb auch mit dem Fehler. Zeichnet die Liste neu, werden die
// Felder ERSETZT; der alte Verweis zeigt auf ein abgelöstes Element, das seinen
// Wert brav behält. Gemessen wurde also an etwas, das gar nicht mehr auf dem
// Bildschirm steht.
//
// Eine Prüfung, die den Fehler nicht sehen KANN, sieht aus wie eine, die ihn
// nicht findet.
const feld = (achse: "w" | "s", name: string): HTMLSelectElement =>
  root.querySelector(`#rg-${achse}-${name}`) as HTMLSelectElement;
wahr("es gibt ein Feld für die Welt", !!feld("w", "MeinPreset"));
wahr("und eines für die Sprache", !!feld("s", "MeinPreset"));
wahr("beide beginnen leer", feld("w", "MeinPreset").value === "" && feld("s", "MeinPreset").value === "");

const setze = (achse: "w" | "s", name: string, v: string): void => {
  const el = feld(achse, name);
  el.value = v;
  el.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
};

// DER GEMELDETE ABLAUF: erst die Welt, dann die Sprache.
setze("w", "MeinPreset", "irreal");
// Nach dem ersten Schritt darf NICHTS zurückspringen — das war der Fehler.
ist("nach der ersten Angabe steht sie noch da", feld("w", "MeinPreset").value, "irreal");
ist("und ist noch nicht gespeichert", registerVon("user:MeinPreset"), null);

setze("s", "MeinPreset", "amtlich");
ist("nach der zweiten steht die erste immer noch", feld("w", "MeinPreset").value, "irreal");
ist("und die zweite auch", feld("s", "MeinPreset").value, "amtlich");
ist("jetzt ist es gespeichert", registerVon("user:MeinPreset")?.welt, "irreal");
ist("mit beiden Angaben", registerVon("user:MeinPreset")?.sprache, "amtlich");

// Und andersherum — die Reihenfolge darf keine Rolle spielen.
setze("s", "Zweites", "feierlich");
ist("auch umgekehrt bleibt die erste Angabe stehen", feld("s", "Zweites").value, "feierlich");
setze("w", "Zweites", "gehoben");
ist("und beide kommen an", registerVon("user:Zweites")?.sprache, "feierlich");
ist("mit der richtigen Welt", registerVon("user:Zweites")?.welt, "gehoben");

// Zurücknehmen muss ebenfalls gehen.
setze("w", "Zweites", "");
ist("eine Angabe zurückzunehmen löscht die Zuordnung", registerVon("user:Zweites"), null);
ist("das andere Feld bleibt trotzdem stehen", feld("s", "Zweites").value, "feierlich");

// Der Zwischenstand wird benannt — sonst sieht es aus, als sei nichts passiert.
const zeile = (): string =>
  (feld("w", "MeinPreset").closest(".reiterzeile") as HTMLElement | null)?.textContent || "";
setze("w", "MeinPreset", "");
wahr("ein halber Stand wird als solcher gemeldet", /beide Angaben nötig/.test(zeile()));
setze("w", "MeinPreset", "irreal");
wahr("und der Hinweis verschwindet wieder", !/beide Angaben nötig/.test(zeile()));

wahr("die Ablage wandert in die Projektdatei", EIGEN_KEY.startsWith("divergenz_"));

// ── Ein Schloss an der Form: der Kopf zeigt es ─────────────────────────────
// Der gemeldete Fall, im echten Baum nachgestellt. Im Schaltplan stand ein
// Schloss an der Form — der Kopf liess sie deshalb in Ruhe und sagte es nicht.
{
  const { mountStudio } = require("../src/ui/studio") as { mountStudio: (r: HTMLElement) => void };
  localStorage.setItem("divergenz_studio_locks_v1", JSON.stringify(["f-form"]));
  localStorage.setItem("divergenz_einfach_v1",
    JSON.stringify({ form: 0, laenge: 1, reibung: 1, saat: "Zwei Becher.", einfach: true }));
  const st = dom.window.document.createElement("div");
  dom.window.document.body.append(st);
  mountStudio(st);
  const chips = Array.from(st.querySelectorAll(".ek-wahl button")) as HTMLButtonElement[];
  wahr(`die Formchips sind da (${chips.length})`, chips.length === 4);
  wahr("und bei gesperrter Form alle abgeschaltet", chips.every((c) => c.disabled));
  const hinweis = st.querySelector(".ek-gesperrt")?.textContent || "";
  wahr(`der Hinweis nennt die Form (${hinweis.slice(0, 40)})`, /Form/.test(hinweis));
  wahr("und sagt, wo das Schloss steht", /alle Regler zeigen/.test(hinweis));
  // Gegenprobe: OHNE Schloss muessen die Chips klickbar sein und der Hinweis
  // leer — sonst pruefte die Zeile oben nur, dass immer alles gesperrt ist.
  localStorage.setItem("divergenz_studio_locks_v1", "[]");
  const st2 = dom.window.document.createElement("div");
  dom.window.document.body.append(st2);
  mountStudio(st2);
  const chips2 = Array.from(st2.querySelectorAll(".ek-wahl button")) as HTMLButtonElement[];
  wahr("ohne Schloss sind die Chips klickbar", chips2.every((c) => !c.disabled));
  ist("und der Hinweis bleibt leer", (st2.querySelector(".ek-gesperrt")?.textContent || ""), "");

  // ── Die Chips zeigen, was WIRKLICH eingestellt ist ────────────────────────
  // Gemeldet: Wer im Reglerkasten die Form aendert und festhaelt, sah im Kopf
  // weiter die alte Wahl. Der Chip war eine Notiz ueber eine fruehere Absicht
  // und behauptete einen Zustand, den es nicht gab.
  const formSel = (w: HTMLElement): HTMLSelectElement =>
    Array.from(w.querySelectorAll("select")).find((x) => (x as HTMLSelectElement).id === "f-form") as HTMLSelectElement;
  const gedrueckt = (w: HTMLElement): string[] =>
    (Array.from(w.querySelectorAll(".ek-wahl button")) as HTMLButtonElement[])
      .filter((c) => c.getAttribute("aria-pressed") === "true").map((c) => c.textContent || "");

  formSel(st2).value = "reim";
  formSel(st2).dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  ist("aendert man die Form im Kasten, folgt der Chip", gedrueckt(st2).join(), "Reim");
  // Und umgekehrt: Ein Chipklick zieht den echten Regler SOFORT mit, nicht erst
  // beim Erzeugen. Dann ist der Chip die Form und nicht eine Notiz darueber.
  // „Szene" hiess der vierte Chip bis 4.323.0 — jetzt „Haiku". Der Chip wird
  // ueber die FORMLISTE gesucht statt ueber einen abgeschriebenen Namen: Sonst
  // faellt diese Pruefung bei jeder Umbenennung um, und man aendert sie
  // gedankenlos mit, statt zu pruefen, ob die Umbenennung gewollt war.
  const letzterName = KOPF_FORMEN[KOPF_FORMEN.length - 1]![1];
  const letzteId = KOPF_FORMEN[KOPF_FORMEN.length - 1]![0];
  const letzter = (Array.from(st2.querySelectorAll(".ek-wahl button")) as HTMLButtonElement[])
    .find((c) => c.textContent === letzterName)!;
  wahr(`der letzte Chip heisst „${letzterName}"`, !!letzter);
  letzter.click();
  ist("und ein Chipklick zieht den Regler mit", formSel(st2).value, letzteId);

  // Eine Form ausserhalb der vier: KEIN Chip gedrueckt. Einen zu markieren waere
  // gelogen — „Haiku" ist nicht „Prosa".
  // Eine Form, die der Kopf NICHT anbietet — aus der echten Formliste gesucht,
  // nicht abgeschrieben. „haiku" stand hier bis 4.323.0 und wurde dann selbst
  // eine der vier; die Pruefung pruefte danach das Gegenteil von dem, was sie
  // sollte, und blieb trotzdem gruen.
  const fremdeForm = FORM_OPTS.map(([v]) => v).find((v) => !KOPF_FORMEN.some(([f]) => f === v))!;
  wahr(`es gibt eine Form ausserhalb des Kopfes („${fremdeForm}")`, !!fremdeForm);
  formSel(st2).value = fremdeForm;
  formSel(st2).dispatchEvent(new dom.window.Event("change", { bubbles: true }));
  ist("eine fremde Form drueckt keinen Chip", gedrueckt(st2).length, 0);
  wahr("und der Hinweis sagt, welche eingestellt ist",
    /bietet der Kopf nicht an/.test(st2.querySelector(".ek-gesperrt")?.textContent || ""));
}

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Register-Liste — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler in der Register-Liste:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Register-Liste: alle ${geprueft} Prüfungen bestanden.`);
}
