// Bildsammler: Fotos werden zu Korpusmaterial und 4W-Kontext.
//
// Sitzt als eigener Bereich im Reiter „Sammler“, weil er dieselbe Aufgabe hat
// wie der Tagesfeed — Material von außen hereinholen — nur über einen anderen
// Weg hinein: nicht über Sprache, sondern über ein Bild.
//
// Zwei Dinge, die diesen Bereich von allem anderen unterscheiden:
//
// 1. Das Bild wird NICHT behalten. Geschickt und vergessen; was bleibt, ist
//    Text. Damit gibt es weder eine Bilderzahl noch ein Speicherlimit noch
//    Rücksicht auf die Projektdatei — fünfzig Fotos sind technisch dasselbe
//    wie eines.
// 2. Nichts geht ungesehen in den Korpus. Zwischen Antwort und Übernahme steht
//    immer eine Vorschau, in der jeder Satz einzeln abwählbar ist. Der Korpus
//    ist beständig; schlechtes Material darin kostet null Euro und vergiftet
//    jede künftige Ausgabe.
import { el, button, select, field } from "./dom";
import { icon } from "./icons";
import { leseBilddatei } from "../features/zeitungsbilder";
import { appendToPersistentCorpus, loadPersistentCorpus } from "../corpus";
import { loadAiKey, callClaudeBild, extractJson, isOnline } from "../features/ki";
import {
  bauePrompt, leseErnte, beute, maxToken, schaetzeLauf, zerlegeDatenUrl, bildTokens,
  SAETZE_VORGABE, ladeBildvorrat, sichereBildvorrat, mischeBildvorrat, leereBildvorrat,
  type BildFund,
} from "../features/bildsammler";
import {
  MODELLE, modellVon, PREIS_STAND, euro,
  ladeKonto, bucheKonto, sichereKonto,
} from "../features/lehrer";

const WAHL_KEY = "divergenz_bildsammler_v1";
interface Wahl { modell: string; saetze: number; kurs: number }
const VORGABE: Wahl = { modell: MODELLE[0]!.id, saetze: SAETZE_VORGABE, kurs: 0.92 };
const ladeWahl = (): Wahl => {
  try {
    const r = JSON.parse(localStorage.getItem(WAHL_KEY) || "null") as Partial<Wahl> | null;
    return r ? { ...VORGABE, ...r } : { ...VORGABE };
  } catch { return { ...VORGABE }; }
};
const sichereWahl = (w: Wahl): void => {
  try { localStorage.setItem(WAHL_KEY, JSON.stringify(w)); } catch { /* voll */ }
};

interface Ernte {
  name: string;
  behalten: { satz: string; an: boolean }[];
  verworfen: string[];
  ctx: { who: string; where: string; when: string; what: string };
}

export function baueBildsammler(): HTMLElement {
  const wahl = ladeWahl();
  let konto = ladeKonto();
  let ernten: Ernte[] = [];

  const wrap = el("div", { class: "card" });

  // ── Einstellungen ─────────────────────────────────────────────────────────
  const modellSel = select("bs-modell", MODELLE.map((m) => [m.id, m.name] as [string, string]), wahl.modell);
  const anzahlIn = el("input", { type: "number", min: "3", max: "40", step: "1",
    value: String(wahl.saetze), style: "width:100px" }) as HTMLInputElement;
  const kursIn = el("input", { type: "number", min: "0.1", max: "3", step: "0.01",
    value: String(wahl.kurs), style: "width:90px" }) as HTMLInputElement;
  const hinweisIn = el("input", { type: "text", style: "width:100%",
    placeholder: "Zusätzliche Vorgabe, optional — z. B. „nur Gegenstände, keine Menschen“" }) as HTMLInputElement;

  const schaetzung = el("p", { class: "muted mini", style: "margin:8px 0 0" }, "");
  const kontoZeile = el("p", { class: "muted mini", style: "margin:4px 0 0" }, "");

  const zeigeKonto = (): void => {
    const kurs = parseFloat(kursIn.value) || 1;
    kontoZeile.textContent = konto.laeufe
      ? `Konto (gemeinsam mit dem KI-Lehrer): ${konto.laeufe} Läufe · rund ${euro(konto.usd, kurs)} — `
        + "hier gezählt, nicht bei Anthropic abgefragt."
      : "Noch kein Lauf gezählt.";
  };
  const rechne = (): void => {
    const m = modellVon(modellSel.value);
    const kurs = parseFloat(kursIn.value) || 1;
    const n = parseInt(anzahlIn.value, 10) || SAETZE_VORGABE;
    // Ein auf 1200 px verkleinertes Querformat als Maß — die App verkleinert
    // ohnehin so, bevor irgendetwas verschickt wird.
    const s = schaetzeLauf(1200, 900, n, m);
    schaetzung.textContent =
      `Schätzung je Bild: höchstens ${euro(s.usd, kurs)} (≈ ${bildTokens(1200, 900)} Token fürs Bild, `
      + `bis zu ${maxToken(n)} für die Antwort; ${m.ein} $ / ${m.aus} $ je Mio. Token, Stand ${PREIS_STAND}, `
      + `Kurs ${kurs} €/$). Die Antwortlänge ist hier der teure Teil, nicht das Bild.`;
    zeigeKonto();
  };
  modellSel.addEventListener("change", () => { wahl.modell = modellSel.value; sichereWahl(wahl); rechne(); });
  anzahlIn.addEventListener("input", () => { wahl.saetze = parseInt(anzahlIn.value, 10) || SAETZE_VORGABE; sichereWahl(wahl); rechne(); });
  kursIn.addEventListener("input", () => { wahl.kurs = parseFloat(kursIn.value) || 0.92; sichereWahl(wahl); rechne(); });

  // ── Ernte ─────────────────────────────────────────────────────────────────
  const status = el("span", { class: "muted" }, "");
  const liste = el("div", {});
  const dateiWahl = el("input", { type: "file", accept: "image/*", multiple: "",
    style: "display:none" }) as HTMLInputElement;
  const waehlBtn = el("button", { class: "primary" }, icon("play"), " Bilder wählen und lesen") as HTMLButtonElement;
  const abbruch = el("button", { class: "danger", style: "display:none" }, "Abbrechen") as HTMLButtonElement;
  let ac: AbortController | null = null;
  abbruch.addEventListener("click", () => ac?.abort());

  const zeichne = (): void => {
    liste.innerHTML = "";
    if (!ernten.length) return;
    for (const e of ernten) {
      const kasten = el("div", { class: "bsam-fund" });
      const kopf = el("p", { style: "margin:0 0 6px;font:14px/1.5 var(--sans)" }, el("b", {}, e.name));
      kasten.append(kopf);

      // 4W zuerst: Sie gehen als Ganzes ins Studio, nicht satzweise.
      const paare: [string, string][] = [["Wo", e.ctx.where], ["Wann", e.ctx.when], ["Wer", e.ctx.who], ["Was", e.ctx.what]];
      const chips = el("div", { class: "chips" });
      const leer = paare.filter(([, v]) => !v).map(([n]) => n);
      for (const [name, wert] of paare) {
        if (!wert) continue;
        chips.append(el("span", { class: "tchip" }, el("span", { class: "sam-w" }, name + ": "), wert));
      }
      if (leer.length) chips.append(el("span", { class: "muted" }, `${leer.join(", ")} nicht erkannt`));
      kasten.append(chips);

      // Sätze einzeln abwählbar. Der Korpus ist beständig — was einmal drin
      // ist, bekommt man nur mühsam wieder heraus.
      const saetze = el("div", { style: "margin:8px 0" });
      e.behalten.forEach((b, i) => {
        const box = el("input", { type: "checkbox", id: `bs-${e.name}-${i}` }) as HTMLInputElement;
        box.checked = b.an;
        box.addEventListener("change", () => { b.an = box.checked; standZeigen(); });
        saetze.append(el("label", { class: "bsam-satz" }, box, el("span", {}, b.satz)));
      });
      if (!e.behalten.length) saetze.append(el("p", { class: "sam-warn" },
        "Kein einziger Satz hat den Filter überstanden. Entweder gibt das Bild nichts her, "
        + "oder das Modell hat trotz Anweisung Bildbeschreibungen geliefert."));
      kasten.append(saetze);

      if (e.verworfen.length) {
        // Das Verworfene ist die interessantere Hälfte: Daran sieht man, ob der
        // Prompt taugt oder der Filter zu scharf steht.
        const det = el("details", { class: "bsam-weg" }, el("summary", {},
          `▸ ${e.verworfen.length} verworfen ansehen (Bildbezug, zu kurz oder doppelt)`));
        for (const v of e.verworfen) det.append(el("p", { class: "muted mini" }, "· " + v));
        kasten.append(det);
      }
      liste.append(kasten);
    }
    standZeigen();
  };

  const gewaehlteSaetze = (): string[] =>
    ernten.flatMap((e) => e.behalten.filter((b) => b.an).map((b) => b.satz));

  const stand = el("span", { class: "muted mini" }, "");
  const korpusBtn = el("button", { class: "primary" }, icon("arrowRight"), " In den Korpus") as HTMLButtonElement;
  const studioBtn = button("4W ins Studio");
  // Der Vorrat ist die Ablage fuer spaeter: Die Taste "Abschrift" im Studio
  // zieht daraus, so wie "Wiki" aus dem Sammler-Vorrat zieht. Getrennte
  // Ablagen, weil das Material verschieden ist — sonst zoege man im Studio mal
  // das eine und mal das andere, ohne zu wissen, was kommt.
  const vorratBtn = button("4W in den Vorrat");
  const vorratTxt = el("span", { class: "muted mini" }, "");
  const vorratWeg = button("Vorrat leeren", "danger");
  const wegBtn = button("Ernte verwerfen", "danger");

  const standZeigen = (): void => {
    const n = gewaehlteSaetze().length;
    const zeichen = gewaehlteSaetze().join(" ").length;
    stand.textContent = ernten.length
      ? `${n} Sätze gewählt · ${zeichen} Zeichen · Korpus derzeit ${loadPersistentCorpus().length} Zeichen`
      : "";
    korpusBtn.disabled = !n;
    const mit4W = ernten.some((e) => e.ctx.who || e.ctx.where || e.ctx.when || e.ctx.what);
    studioBtn.disabled = !mit4W;
    vorratBtn.disabled = !mit4W;
    wegBtn.style.display = ernten.length ? "" : "none";
    vorratZeigen();
  };

  const vorratZeigen = (): void => {
    const n = ladeBildvorrat().length;
    vorratTxt.textContent = n
      ? `Bildvorrat: ${n} ${n === 1 ? "Fund" : "Funde"} \u2014 die Taste \u201eAbschrift\u201c im Studio zieht daraus`
      : "Bildvorrat leer \u2014 die Taste \u201eAbschrift\u201c im Studio hat noch nichts zu ziehen";
    vorratWeg.style.display = n ? "" : "none";
  };

  vorratBtn.addEventListener("click", () => {
    const jetzt = Date.now();
    const neu: BildFund[] = ernten
      .filter((e) => e.ctx.who || e.ctx.where || e.ctx.when || e.ctx.what)
      .map((e) => ({ name: e.name, ctx: e.ctx, gespeichert: jetzt }));
    if (!neu.length) return;
    const alt = ladeBildvorrat();
    const zusammen = mischeBildvorrat(alt, neu);
    const dazu = zusammen.length - alt.length;
    if (!sichereBildvorrat(zusammen)) {
      status.textContent = "Der Browser-Speicher ist voll — der Vorrat wurde nicht gesichert.";
      return;
    }
    status.textContent = dazu
      ? `${dazu} ${dazu === 1 ? "Fund" : "Funde"} in den Bildvorrat gelegt (jetzt ${zusammen.length}).`
      : "Alles davon lag schon im Vorrat.";
    vorratZeigen();
  });

  vorratWeg.addEventListener("click", () => {
    if (!confirm("Den ganzen Bildvorrat löschen? Die Taste „Abschrift\u201c im Studio hat danach nichts mehr zu ziehen.")) return;
    leereBildvorrat(); vorratZeigen();
  });

  korpusBtn.addEventListener("click", () => {
    const s = gewaehlteSaetze();
    if (!s.length) return;
    const vorher = loadPersistentCorpus().length;
    appendToPersistentCorpus(s.join(" "));
    const nachher = loadPersistentCorpus().length;
    status.textContent = `${s.length} Sätze übernommen — Korpus ${vorher} → ${nachher} Zeichen.`;
    standZeigen();
  });

  studioBtn.addEventListener("click", () => {
    // Die erste Ernte mit brauchbaren Feldern gewinnt: Vier Felder können nur
    // einen Satz Werte tragen, und stillschweigend zu mischen ergäbe einen
    // Kontext, den kein Bild hergegeben hat.
    const e = ernten.find((x) => x.ctx.who || x.ctx.where || x.ctx.when || x.ctx.what);
    if (!e) return;
    const c: Record<string, string> = {};
    for (const k of ["who", "what", "when", "where"] as const) if (e.ctx[k]) c[k] = e.ctx[k];
    try { localStorage.setItem("dm_pending_ctx", JSON.stringify(c)); } catch { /* gesperrt */ }
    const tab = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
    if (tab) tab.click();
  });

  wegBtn.addEventListener("click", () => { ernten = []; zeichne(); status.textContent = ""; });

  waehlBtn.addEventListener("click", () => {
    if (!loadAiKey()) { status.textContent = "Der Bildsammler braucht einen API-Schlüssel (Studio ▸ Einstellungen ▸ KI-Zugang)."; return; }
    if (!isOnline()) { status.textContent = "Offline — der Bildsammler braucht eine Verbindung."; return; }
    dateiWahl.value = "";
    dateiWahl.click();
  });

  dateiWahl.addEventListener("change", () => {
    const dateien = Array.from(dateiWahl.files || []);
    if (!dateien.length) return;
    const m = modellVon(modellSel.value);
    const anzahl = parseInt(anzahlIn.value, 10) || SAETZE_VORGABE;
    const prompt = bauePrompt(anzahl, hinweisIn.value);
    const deckel = maxToken(anzahl);

    void (async () => {
      waehlBtn.disabled = true; abbruch.style.display = ""; ac = new AbortController();
      let fehler = 0;
      for (let i = 0; i < dateien.length; i++) {
        if (ac.signal.aborted) break;
        const d = dateien[i]!;
        status.textContent = `Bild ${i + 1} von ${dateien.length}: ${d.name} …`;
        try {
          // Verkleinern passiert im Browser, VOR dem Senden: Ein Handyfoto mit
          // 12 Megapixeln kostete das Zehnfache und liefert nichts Besseres.
          const { daten } = await leseBilddatei(d);
          const teile = zerlegeDatenUrl(daten);
          if (!teile) throw new Error("Format wird nicht unterstützt.");
          const r = await callClaudeBild(prompt, teile, deckel, m.id, ac.signal);
          konto = bucheKonto(konto, r.usage.ein, r.usage.aus, m);
          sichereKonto(konto);
          const roh = leseErnte(extractJson(r.text));
          const { behalten, verworfen } = beute(roh.saetze);
          ernten = [...ernten, {
            name: d.name,
            behalten: behalten.map((satz) => ({ satz, an: true })),
            verworfen, ctx: roh.ctx,
          }];
          zeichne();
        } catch (e) {
          if (ac.signal.aborted) break;
          fehler++;
          status.textContent = `${d.name}: ${e instanceof Error ? e.message : String(e)}`;
        }
      }
      const kurs = parseFloat(kursIn.value) || 1;
      status.textContent = (ac?.signal.aborted ? "Abgebrochen. " : "Fertig. ")
        + (fehler ? `${fehler} Bild(er) fehlgeschlagen. ` : "")
        + `Konto jetzt ${konto.laeufe} Läufe, rund ${euro(konto.usd, kurs)}.`;
      waehlBtn.disabled = false; abbruch.style.display = "none"; ac = null;
      zeigeKonto();
      zeichne();
    })();
  });

  wrap.append(
    el("h3", { style: "margin:0 0 6px" }, "Bilder als Material"),
    el("p", { class: "fund-text" },
      "Ein Foto wird zu Sätzen für den Korpus und zu Wo / Wann / Wer / Was. "
      + "Das Bild wird geschickt und nicht behalten — es bleibt nur Text, also gibt es "
      + "hier weder eine Bilderzahl noch ein Speicherlimit."),
    el("p", { class: "muted mini" },
      "Der Lehrer der Sätze ist ausdrücklich angewiesen, nüchtern und ohne jeden Bildbezug zu schreiben: "
      + "Kein Satz darf verraten, dass es ein Bild gab. Was trotzdem durchrutscht, filtert die Maschine "
      + "selbst heraus — ein Prompt ist eine Bitte, kein Riegel. Was dabei weggefiltert wurde, steht "
      + "unter jedem Fund im Aufklapper „verworfen ansehen“: Daran sieht man, ob der Prompt taugt oder "
      + "der Filter zu scharf steht. Anders als der Tagesfeed braucht dieser Teil einen API-Schlüssel "
      + "und kostet Geld."),
    el("div", { class: "grid3", style: "margin-top:10px" },
      field("Modell", modellSel), field("Sätze je Bild", anzahlIn), field("Kurs €/$", kursIn)),
    hinweisIn,
    schaetzung,
    kontoZeile,
    el("div", { class: "btnrow", style: "margin-top:10px" }, waehlBtn, abbruch, status, dateiWahl),
    liste,
    el("div", { class: "btnrow" }, korpusBtn, studioBtn, vorratBtn, wegBtn, stand),
    el("div", { class: "btnrow" }, vorratTxt),
    el("div", { class: "btnrow" }, vorratWeg),
  );
  rechne();
  standZeigen();
  return wrap;
}
