// Abschrift: Text von einem Foto in den Korpus.
//
// Das genaue Gegenteil des Bildsammlers, obwohl beide dasselbe Werkzeug
// benutzen. Der Bildsammler verbietet alles, was aufs Bild zeigt, und lässt
// frei formulieren. Die Abschrift will exakt das, was dasteht.
//
// Daraus folgen drei Unterschiede, die im Bau sichtbar sind:
//
// 1. KEIN Beutefilter. Eine Abschrift zu filtern hieße, sie zu fälschen.
// 2. Kein 4W. Eine abfotografierte Seite liefert Sprache am Stück, keinen
//    Kontext für das Studio — deshalb geht sie in den Korpus und nicht in den
//    Bildvorrat.
// 3. Der Text bleibt VOR der Übernahme änderbar. Bei einer Abschrift ist das
//    Nachbessern die Regel, nicht die Ausnahme: Ein Modell verliest sich an
//    Fraktur, und nur der Mensch mit der Vorlage in der Hand sieht es.
import { el, button, select, field } from "./dom";
import { icon } from "./icons";
import { leseBilddatei } from "../features/zeitungsbilder";
import { appendToPersistentCorpus, loadPersistentCorpus } from "../corpus";
import { loadAiKey, callClaudeBild, isOnline } from "../features/ki";
import {
  baueAbschriftPrompt, leseAbschrift, maxTokenAbschrift, zerlegeDatenUrl, bildTokens,
} from "../features/bildsammler";
import {
  MODELLE, modellVon, PREIS_STAND, kostenUsd, euro,
  ladeKonto, bucheKonto, sichereKonto,
} from "../features/lehrer";

const WAHL_KEY = "divergenz_abschrift_v1";
interface Wahl { modell: string; kurs: number }
// Vorgabe ist hier NICHT das billigste Modell. Eine Abschrift ist kein
// Geschmacksurteil, sondern eine Leseleistung: Fraktur, Handschrift, krumme
// Seiten. Ein Verlesen kostet mehr als der Preisunterschied — es steht
// nachher unbemerkt im Korpus.
const VORGABE: Wahl = { modell: "claude-sonnet-5", kurs: 0.92 };
const ladeWahl = (): Wahl => {
  try {
    const r = JSON.parse(localStorage.getItem(WAHL_KEY) || "null") as Partial<Wahl> | null;
    return r ? { ...VORGABE, ...r } : { ...VORGABE };
  } catch { return { ...VORGABE }; }
};
const sichereWahl = (w: Wahl): void => {
  try { localStorage.setItem(WAHL_KEY, JSON.stringify(w)); } catch { /* voll */ }
};

export function baueAbschrift(): HTMLElement {
  const wahl = ladeWahl();
  let konto = ladeKonto();

  const wrap = el("div", { class: "card" });

  const modellSel = select("ab-modell", MODELLE.map((m) => [m.id, m.name] as [string, string]), wahl.modell);
  const kursIn = el("input", { type: "number", min: "0.1", max: "3", step: "0.01",
    value: String(wahl.kurs), style: "width:90px" }) as HTMLInputElement;
  const hinweisIn = el("input", { type: "text", style: "width:100%",
    placeholder: "Vorgabe, optional — z. B. „Fraktur“, „nur die linke Spalte“, „Zeilenfall erhalten“" }) as HTMLInputElement;

  const schaetzung = el("p", { class: "muted mini", style: "margin:8px 0 0" }, "");
  const rechne = (): void => {
    const m = modellVon(modellSel.value);
    const kurs = parseFloat(kursIn.value) || 1;
    const ein = bildTokens(1200, 900) + 350;
    const aus = maxTokenAbschrift();
    schaetzung.textContent =
      `Schätzung je Seite: höchstens ${euro(kostenUsd(ein, aus, m), kurs)} `
      + `(eine übliche Buchseite bleibt deutlich darunter, weil sie den Deckel von ${aus} Token nicht ausschöpft; `
      + `${m.ein} $ / ${m.aus} $ je Mio. Token, Stand ${PREIS_STAND}, Kurs ${kurs} €/$).`;
  };
  modellSel.addEventListener("change", () => { wahl.modell = modellSel.value; sichereWahl(wahl); rechne(); });
  kursIn.addEventListener("input", () => { wahl.kurs = parseFloat(kursIn.value) || 0.92; sichereWahl(wahl); rechne(); });

  const status = el("span", { class: "muted" }, "");
  const dateiWahl = el("input", { type: "file", accept: "image/*", multiple: "",
    style: "display:none" }) as HTMLInputElement;
  const lesBtn = el("button", { class: "primary" }, icon("play"), " Seiten abschreiben") as HTMLButtonElement;
  const abbruch = el("button", { class: "danger", style: "display:none" }, "Abbrechen") as HTMLButtonElement;
  let ac: AbortController | null = null;
  abbruch.addEventListener("click", () => ac?.abort());

  // Änderbar, und das ist keine Bequemlichkeit: Ein Modell verliest sich an
  // Fraktur und an Handschrift, und nur wer die Vorlage vor sich hat, sieht es.
  // Was hier steht, geht in den Korpus — nicht, was zurückkam.
  const text = el("textarea", { class: "out", rows: "14", style: "width:100%",
    placeholder: "Die Abschrift erscheint hier und lässt sich vor der Übernahme nachbessern." }) as HTMLTextAreaElement;
  const stand = el("span", { class: "muted mini" }, "");
  const standZeigen = (): void => {
    const t = text.value.trim();
    const w = (t.match(/\S+/g) || []).length;
    const unleserlich = (t.match(/\[unleserlich\]/gi) || []).length;
    stand.textContent = t
      ? `${w} Wörter · ${t.length} Zeichen`
        + (unleserlich ? ` · ${unleserlich}× [unleserlich]` : "")
        + ` · Korpus derzeit ${loadPersistentCorpus().length} Zeichen`
      : "";
    korpusBtn.disabled = !t;
  };
  text.addEventListener("input", standZeigen);

  const korpusBtn = el("button", { class: "primary" }, icon("arrowRight"), " In den Korpus") as HTMLButtonElement;
  korpusBtn.addEventListener("click", () => {
    const t = text.value.trim();
    if (!t) return;
    const vorher = loadPersistentCorpus().length;
    appendToPersistentCorpus(t);
    const nachher = loadPersistentCorpus().length;
    status.textContent = `Übernommen — Korpus ${vorher} → ${nachher} Zeichen.`;
    standZeigen();
  });
  const kopierBtn = button("Kopieren");
  kopierBtn.addEventListener("click", () => {
    if (!text.value.trim()) return;
    void navigator.clipboard?.writeText(text.value);
    const o = kopierBtn.textContent; kopierBtn.textContent = "Kopiert ✓";
    setTimeout(() => (kopierBtn.textContent = o), 1200);
  });
  const wegBtn = button("Feld leeren", "danger");
  wegBtn.addEventListener("click", () => { text.value = ""; standZeigen(); status.textContent = ""; });

  lesBtn.addEventListener("click", () => {
    if (!loadAiKey()) { status.textContent = "Die Abschrift braucht einen API-Schlüssel (Studio ▸ Einstellungen ▸ KI-Zugang)."; return; }
    if (!isOnline()) { status.textContent = "Offline — die Abschrift braucht eine Verbindung."; return; }
    dateiWahl.value = "";
    dateiWahl.click();
  });

  dateiWahl.addEventListener("change", () => {
    const dateien = Array.from(dateiWahl.files || []);
    if (!dateien.length) return;
    const m = modellVon(modellSel.value);
    const prompt = baueAbschriftPrompt(hinweisIn.value);

    void (async () => {
      lesBtn.disabled = true; abbruch.style.display = ""; ac = new AbortController();
      let fehler = 0, leer = 0;
      for (let i = 0; i < dateien.length; i++) {
        if (ac.signal.aborted) break;
        const d = dateien[i]!;
        status.textContent = `Seite ${i + 1} von ${dateien.length}: ${d.name} …`;
        try {
          const { daten } = await leseBilddatei(d);
          const teile = zerlegeDatenUrl(daten);
          if (!teile) throw new Error("Format wird nicht unterstützt.");
          const r = await callClaudeBild(prompt, teile, maxTokenAbschrift(), m.id, ac.signal);
          konto = bucheKonto(konto, r.usage.ein, r.usage.aus, m);
          sichereKonto(konto);
          const a = leseAbschrift(r.text);
          if (a.leer) { leer++; continue; }
          // Mehrere Seiten werden angehängt, durch eine Leerzeile getrennt —
          // eine Buchseite endet selten am Satzende, aber zusammenzuziehen
          // wäre eine Behauptung über die Vorlage.
          text.value = text.value.trim() ? text.value.trim() + "\n\n" + a.text : a.text;
          if (r.truncated) status.textContent = `${d.name}: am Token-Limit abgeschnitten — die Seite ist zu voll.`;
          standZeigen();
        } catch (e) {
          if (ac.signal.aborted) break;
          fehler++;
          status.textContent = `${d.name}: ${e instanceof Error ? e.message : String(e)}`;
        }
      }
      const kurs = parseFloat(kursIn.value) || 1;
      status.textContent = (ac?.signal.aborted ? "Abgebrochen. " : "Fertig. ")
        + (fehler ? `${fehler} Seite(n) fehlgeschlagen. ` : "")
        + (leer ? `${leer} Seite(n) ohne lesbaren Text. ` : "")
        + `Konto jetzt ${konto.laeufe} Läufe, rund ${euro(konto.usd, kurs)}.`;
      lesBtn.disabled = false; abbruch.style.display = "none"; ac = null;
      standZeigen();
    })();
  });

  wrap.append(
    el("h3", { style: "margin:0 0 6px" }, "Abschrift — Text von einer Seite"),
    el("p", { class: "fund-text" },
      "Eine abfotografierte Buch- oder Zeitungsseite wird abgeschrieben und geht als "
      + "zusammenhängender Text in den Korpus. Anders als bei „Bilder als Material“ wird hier "
      + "nichts formuliert und nichts gefiltert: Was dasteht, kommt heraus — alte Rechtschreibung, "
      + "Fehler der Vorlage und Verse in ihrem Zeilenfall inbegriffen."),
    el("p", { class: "muted mini" },
      "Unlesbare Stellen werden als [unleserlich] eingesetzt statt geraten. Nachbessern vor der "
      + "Übernahme ist die Regel und nicht die Ausnahme: An Fraktur und Handschrift verliest sich "
      + "auch ein gutes Modell, und nur wer die Vorlage vor sich hat, merkt es."),
    el("div", { class: "grid3", style: "margin-top:10px" },
      field("Modell", modellSel), field("Kurs €/$", kursIn)),
    hinweisIn,
    schaetzung,
    el("div", { class: "btnrow", style: "margin-top:10px" }, lesBtn, abbruch, status, dateiWahl),
    text,
    el("div", { class: "btnrow" }, korpusBtn, kopierBtn, wegBtn, stand),
  );
  rechne();
  standZeigen();
  return wrap;
}
