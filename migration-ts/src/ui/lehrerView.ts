// KI-Lehrer: der aktuelle Studiotext, vier Aufträge, ein Ergebnis.
//
// Der Reiter zeigt beim Öffnen den Text, der zuletzt im Studio stand
// (`dm_last_text` — dieselbe Quelle, aus der auch Montage und Diagnose lesen).
// Danach ist alles eine einzige Entscheidung: welcher Auftrag.
//
// Kosten sind hier kein Nebenthema, sondern Teil der Bedienung. Vor dem Klick
// steht eine Schätzung, nach dem Lauf die echte Zahl, und beides ist mit dem
// Preissatz beschriftet, mit dem gerechnet wurde. Ein Preis ändert sich; eine
// stille Fehlrechnung würde man nie bemerken.
import { el, button, select, field } from "./dom";
import { icon } from "./icons";
import { addToTreasury } from "../features/treasury";
import { openReader } from "./reader";
import { loadAiKey, saveAiKey, callClaudeStream, isOnline } from "../features/ki";
import {
  AUFTRAEGE, auftragVon, bauePrompt, schaetzeTokens, maxToken,
  MODELLE, modellVon, PREIS_STAND, kostenUsd, euro,
  ladeKonto, bucheKonto, sichereKonto, KONTO_LEER,
  markiereNeu, anteilNeu,
  type Auftragsart,
} from "../features/lehrer";

const lastText = (): string => { try { return localStorage.getItem("dm_last_text") || ""; } catch { return ""; } };

const WAHL_KEY = "divergenz_lehrer_wahl_v1";
interface Wahl { art: Auftragsart; modell: string; woerter: number; kurs: number }
const WAHL_VORGABE: Wahl = { art: "grammatik", modell: MODELLE[0]!.id, woerter: 300, kurs: 0.92 };
const ladeWahl = (): Wahl => {
  try {
    const r = JSON.parse(localStorage.getItem(WAHL_KEY) || "null") as Partial<Wahl> | null;
    return r ? { ...WAHL_VORGABE, ...r } : { ...WAHL_VORGABE };
  } catch { return { ...WAHL_VORGABE }; }
};
const sichereWahl = (w: Wahl): void => {
  try { localStorage.setItem(WAHL_KEY, JSON.stringify(w)); } catch { /* voll */ }
};

const WUNSCH_KEY = "divergenz_lehrer_wunsch_v1";

export function mountLehrer(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const wahl = ladeWahl();
  let konto = ladeKonto();

  // ── Der Text ──────────────────────────────────────────────────────────────
  // Änderbar, nicht nur anzeigend: Wer eine Stelle vorher wegstreichen will,
  // soll das hier tun können, ohne ins Studio zurückzuwechseln. Geschickt wird,
  // was im Feld steht.
  const quelle = el("textarea", {
    class: "out", rows: "10", style: "width:100%",
    placeholder: "Noch kein Studiotext da. Im Studio einen Text erzeugen — oder hier einen einfügen.",
  }) as HTMLTextAreaElement;
  quelle.value = lastText();
  const holBtn = button("Studiotext neu holen");
  const quelleInfo = el("span", { class: "muted mini" }, "");

  // ── Auftrag ───────────────────────────────────────────────────────────────
  const artBtns: HTMLButtonElement[] = [];
  const artReihe = el("div", { class: "btnrow" });
  const artInfo = el("p", { class: "muted mini", style: "margin:6px 0 0" }, "");
  const wunschLabel = el("label", { class: "mini" }, "");
  const wunsch = el("textarea", { rows: "3", style: "width:100%" }) as HTMLTextAreaElement;
  try { wunsch.value = localStorage.getItem(WUNSCH_KEY) || ""; } catch { /* gesperrt */ }
  wunsch.addEventListener("input", () => {
    try { localStorage.setItem(WUNSCH_KEY, wunsch.value); } catch { /* voll */ }
    rechne();
  });

  const laengeIn = el("input", { type: "number", min: "40", max: "3000", step: "20",
    value: String(wahl.woerter), style: "width:110px" }) as HTMLInputElement;
  const laengeFeld = field("Ziellänge (Wörter)", laengeIn);

  const modellSel = select("le-modell", MODELLE.map((m) => [m.id, m.name] as [string, string]), wahl.modell);
  const kursIn = el("input", { type: "number", min: "0.1", max: "3", step: "0.01",
    value: String(wahl.kurs), style: "width:90px" }) as HTMLInputElement;

  const artZeigen = (): void => {
    const a = auftragVon(wahl.art);
    artBtns.forEach((b) => b.classList.toggle("on", b.dataset.art === wahl.art));
    artInfo.textContent = a.kurz;
    wunschLabel.textContent = a.wunschLabel;
    wunsch.placeholder = a.wunschPlatzhalter;
    // Die Ziellänge ist bei der Korrektur sinnlos: Dort bestimmt der Text die
    // Länge. Ein Regler, der nichts bewegt, ist schlimmer als keiner.
    laengeFeld.style.display = wahl.art === "grammatik" ? "none" : "";
  };
  for (const a of AUFTRAEGE) {
    const b = el("button", { class: "toggle", type: "button" }, a.name) as HTMLButtonElement;
    b.dataset.art = a.art;
    b.addEventListener("click", () => {
      wahl.art = a.art; sichereWahl(wahl); artZeigen(); rechne();
    });
    artBtns.push(b); artReihe.append(b);
  }

  // ── Schätzung und Konto ───────────────────────────────────────────────────
  const schaetzung = el("p", { class: "muted mini", style: "margin:8px 0 0" }, "");
  const kontoZeile = el("p", { class: "muted mini", style: "margin:4px 0 0" }, "");
  const kontoWeg = button("Konto zurücksetzen", "danger");
  kontoWeg.addEventListener("click", () => {
    if (!konto.laeufe || !confirm("Das gezählte Konto auf null setzen? Die Abrechnung bei Anthropic bleibt davon unberührt.")) return;
    konto = { ...KONTO_LEER }; sichereKonto(konto); kontoZeigen();
  });

  const kontoZeigen = (): void => {
    const kurs = parseFloat(kursIn.value) || 1;
    kontoZeile.textContent = konto.laeufe
      ? `Bisher ${konto.laeufe} Lauf${konto.laeufe === 1 ? "" : "e"} · `
        + `${Math.round(konto.ein / 100) / 10} Tsd. Token hin, ${Math.round(konto.aus / 100) / 10} Tsd. zurück · `
        + `rund ${euro(konto.usd, kurs)} — hier gezählt, nicht von Anthropic abgefragt.`
      : "Noch kein Lauf gezählt.";
    kontoWeg.style.display = konto.laeufe ? "" : "none";
  };

  const rechne = (): void => {
    const text = quelle.value.trim();
    const woerter = (text.match(/\S+/g) || []).length;
    quelleInfo.textContent = text ? `${woerter} Wörter · ${text.length} Zeichen` : "leer";
    const m = modellVon(modellSel.value);
    const kurs = parseFloat(kursIn.value) || 1;
    const p = bauePrompt(wahl.art, text, wunsch.value, parseInt(laengeIn.value, 10) || 300);
    const ein = schaetzeTokens(p);
    const aus = maxToken(wahl.art, text, parseInt(laengeIn.value, 10) || 300);
    // Zwei Zahlen: der schlimmste Fall (Antwort läuft bis ans Limit) und der
    // wahrscheinliche. Nur den günstigen zu nennen wäre eine Beschönigung.
    const hoch = kostenUsd(ein, aus, m);
    const mittel = kostenUsd(ein, Math.round(aus * 0.6), m);
    schaetzung.textContent = text
      ? `Schätzung: rund ${euro(mittel, kurs)}, höchstens ${euro(hoch, kurs)} für diesen Lauf `
        + `(≈ ${ein} Token hin, bis zu ${aus} zurück; gerechnet mit ${m.ein} $ / ${m.aus} $ je Mio. Token, `
        + `Stand ${PREIS_STAND}, Kurs ${kurs} €/$). Token- und Preisangaben sind geschätzt — `
        + "der echte Verbrauch steht nach dem Lauf im Konto."
      : "Kein Text — nichts zu schätzen.";
    kontoZeigen();
  };

  quelle.addEventListener("input", rechne);
  holBtn.addEventListener("click", () => { quelle.value = lastText(); rechne(); });
  modellSel.addEventListener("change", () => { wahl.modell = modellSel.value; sichereWahl(wahl); rechne(); });
  laengeIn.addEventListener("input", () => { wahl.woerter = parseInt(laengeIn.value, 10) || 300; sichereWahl(wahl); rechne(); });
  kursIn.addEventListener("input", () => { wahl.kurs = parseFloat(kursIn.value) || 0.92; sichereWahl(wahl); rechne(); });

  // ── Schlüssel ─────────────────────────────────────────────────────────────
  const keyIn = el("input", { type: "password", placeholder: "sk-ant-…", style: "width:100%" }) as HTMLInputElement;
  keyIn.value = loadAiKey();
  keyIn.addEventListener("change", () => saveAiKey(keyIn.value.trim()));
  const keyBox = el("details", {},
    el("summary", { class: "mini" }, "API-Schlüssel"),
    el("p", { class: "muted mini" },
      "Der Schlüssel bleibt in diesem Browser und geht nur an api.anthropic.com. "
      + "Es ist derselbe wie unter Studio ▸ Einstellungen ▸ KI-Zugang."),
    keyIn);

  // ── Lauf ──────────────────────────────────────────────────────────────────
  const status = el("span", { class: "muted" }, "");
  const abbruch = el("button", { class: "danger", style: "display:none" }, "Abbrechen") as HTMLButtonElement;
  let ac: AbortController | null = null;
  abbruch.addEventListener("click", () => ac?.abort());

  const out = el("textarea", { class: "out", rows: "14", style: "width:100%;display:none",
    placeholder: "Das Ergebnis erscheint hier." }) as HTMLTextAreaElement;
  // Die Anzeige ist ein eigener Kasten, weil ein Textfeld keine Farbe kann.
  // Bearbeiten geht weiter — dafür wird auf das Textfeld umgeschaltet.
  const anzeige = el("div", { class: "out lehrer-erg" });
  const legende = el("p", { class: "muted mini", style: "margin:4px 0 0" }, "");
  let ergebnis = "";
  let vorlage = "";          // der Text, gegen den verglichen wird
  let markiert = true;
  let bearbeiten = false;

  const markBtn = el("button", { class: "toggle on", type: "button" }, "Neues hervorheben") as HTMLButtonElement;
  const bearbBtn = button("✎ bearbeiten");

  const zeigeErgebnis = (): void => {
    out.style.display = bearbeiten ? "" : "none";
    anzeige.style.display = bearbeiten ? "none" : "";
    markBtn.disabled = bearbeiten;
    bearbBtn.textContent = bearbeiten ? "✓ fertig" : "✎ bearbeiten";
    if (bearbeiten) { out.value = ergebnis; legende.textContent = "Bearbeiten — die Markierung ruht solange."; return; }
    anzeige.textContent = "";
    if (!ergebnis) { legende.textContent = ""; return; }
    if (!markiert || !vorlage) {
      anzeige.textContent = ergebnis;
      legende.textContent = markiert ? "Kein Ausgangstext zum Vergleichen." : "";
      return;
    }
    const { stuecke, verfahren } = markiereNeu(vorlage, ergebnis);
    for (const s of stuecke) {
      anzeige.append(s.neu ? el("mark", { class: "neu" }, s.text) : document.createTextNode(s.text));
    }
    const p = anteilNeu(stuecke);
    legende.textContent = verfahren === "genau"
      ? `Farbig: steht so nicht im Ausgangstext (Wort-für-Wort verglichen). ${p} % der Wörter.`
      : `Farbig: kommt im Ausgangstext überhaupt nicht vor (die Texte sind zu verschieden für den `
        + `Wort-für-Wort-Vergleich, deshalb nur der Wortschatz). ${p} % der Wörter.`;
  };
  markBtn.addEventListener("click", () => {
    markiert = !markiert; markBtn.classList.toggle("on", markiert); zeigeErgebnis();
  });
  bearbBtn.addEventListener("click", () => {
    if (bearbeiten) ergebnis = out.value;
    bearbeiten = !bearbeiten; zeigeErgebnis();
    if (bearbeiten) out.focus();
  });

  const losBtn = el("button", { class: "primary" }, icon("play"), " Lehrer beauftragen") as HTMLButtonElement;
  losBtn.addEventListener("click", () => {
    const text = quelle.value.trim();
    if (!text) { status.textContent = "Kein Text."; return; }
    const a = auftragVon(wahl.art);
    if (a.wunschNoetig && !wunsch.value.trim()) {
      // Nicht heimlich etwas Beliebiges tun: Ohne Vorstellung gäbe es keinen
      // Auftrag, sondern nur eine Verschönerung.
      status.textContent = `„${a.name}“ braucht deine Vorstellung — sonst erfindet der Lehrer sie sich.`;
      wunsch.focus();
      return;
    }
    if (!loadAiKey()) { status.textContent = "Kein API-Schlüssel hinterlegt (unten aufklappen)."; return; }
    if (!isOnline()) { status.textContent = "Offline — der Lehrer braucht eine Verbindung."; return; }

    const m = modellVon(modellSel.value);
    const woerter = parseInt(laengeIn.value, 10) || 300;
    const prompt = bauePrompt(wahl.art, text, wunsch.value, woerter);
    const budget = maxToken(wahl.art, text, woerter);

    void (async () => {
      losBtn.disabled = true; abbruch.style.display = ""; status.textContent = "Der Lehrer liest…";
      ac = new AbortController();
      // Der Vergleichstext wird beim Start festgehalten, nicht beim Anzeigen:
      // Wer waehrend des Laufs oben etwas aendert, verglich sonst gegen eine
      // Vorlage, die es so nie gab.
      vorlage = text;
      ergebnis = ""; bearbeiten = false; zeigeErgebnis();
      try {
        // Waehrend des Laufs ohne Markierung — es gibt noch nichts Fertiges zu
        // vergleichen, und ein bei jedem Zeichen neu gerechneter Vergleich
        // wuerde die Anzeige ausbremsen.
        const r = await callClaudeStream(prompt, budget, (_c, full) => { anzeige.textContent = full; }, ac.signal, m.id);
        ergebnis = r.text;
        zeigeErgebnis();
        // Mit den ECHTEN Zahlen buchen, nicht mit der Schätzung — sonst trüge
        // das Konto den Fehler der Schätzung dauerhaft mit.
        konto = bucheKonto(konto, r.usage.ein, r.usage.aus, m);
        sichereKonto(konto);
        const kurs = parseFloat(kursIn.value) || 1;
        status.textContent = (r.truncated ? "Am Token-Limit abgeschnitten. " : "Fertig. ")
          + `Dieser Lauf: ${r.usage.ein} + ${r.usage.aus} Token ≈ ${euro(kostenUsd(r.usage.ein, r.usage.aus, m), kurs)}.`;
        kontoZeigen();
      } catch (e) {
        status.textContent = ac?.signal.aborted
          ? "Abgebrochen — angefangene Token werden trotzdem berechnet."
          : "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e));
      } finally {
        losBtn.disabled = false; abbruch.style.display = "none"; ac = null;
      }
    })();
  });

  // ── Was mit dem Ergebnis geschieht ────────────────────────────────────────
  const merkInfo = el("span", { class: "muted mini" }, "");
  const merkBtn = el("button", {}, icon("star"), " In die Schatzkammer");
  merkBtn.addEventListener("click", () => {
    if (!ergebnis.trim()) return;
    const n = addToTreasury(ergebnis, { form: "lehrer" });
    merkInfo.textContent = n < 0 ? "schon vorhanden" : `gemerkt (${n})`;
    setTimeout(() => (merkInfo.textContent = ""), 2000);
  });
  const leseBtn = el("button", {}, icon("book"), " Lesemodus");
  leseBtn.addEventListener("click", () => { if (ergebnis.trim()) openReader(ergebnis); });
  const kopierBtn = button("Kopieren");
  kopierBtn.addEventListener("click", () => {
    if (!ergebnis.trim()) return;
    void navigator.clipboard?.writeText(ergebnis);
    const o = kopierBtn.textContent; kopierBtn.textContent = "Kopiert ✓";
    setTimeout(() => (kopierBtn.textContent = o), 1200);
  });
  // Das Ergebnis wird zur neuen Vorlage — aber NICHT stillschweigend über den
  // Studiotext geschrieben: Wer den Lehrer zweimal hintereinander laufen lässt,
  // verlöre sonst das Original ohne ein Zurück.
  const weiterBtn = button("→ als Vorlage übernehmen");
  weiterBtn.addEventListener("click", () => {
    if (!ergebnis.trim()) return;
    quelle.value = ergebnis; rechne();
    status.textContent = "Ergebnis steht jetzt oben als Vorlage. Der Studiotext selbst bleibt unverändert.";
  });

  wrap.append(
    el("h2", {}, "KI-Lehrer — den Studiotext noch einmal anfassen"),
    el("p", { class: "muted" },
      "Hier geht der Text aus dem Studio an Claude und kommt bearbeitet zurück. "
      + "Der Lehrer ist angewiesen, NICHT zu glätten: Brüche und schiefe Fügungen sollen bleiben. "
      + "Jeder Lauf kostet Geld — die Schätzung steht vor dem Klick, der echte Verbrauch danach."),

    el("h3", { style: "margin:14px 0 6px" }, "Der Text"),
    el("div", { class: "btnrow" }, holBtn, quelleInfo),
    quelle,

    el("h3", { style: "margin:14px 0 6px" }, "Der Auftrag"),
    artReihe,
    artInfo,
    el("div", { style: "margin-top:10px" }, wunschLabel, wunsch),
    el("div", { class: "grid3", style: "margin-top:10px" },
      field("Modell", modellSel), laengeFeld, field("Kurs €/$", kursIn)),
    schaetzung,
    kontoZeile,
    el("div", { class: "btnrow" }, kontoWeg),
    keyBox,

    el("h3", { style: "margin:14px 0 6px" }, "Ergebnis"),
    el("div", { class: "btnrow" }, losBtn, abbruch, status),
    anzeige, out, legende,
    el("div", { class: "btnrow" }, markBtn, bearbBtn, merkBtn, leseBtn, kopierBtn, weiterBtn, merkInfo),
  );
  root.append(wrap);
  artZeigen();
  rechne();
  zeigeErgebnis();
}
