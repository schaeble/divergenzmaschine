// Diagnose-Tab: Selbsttest der eingebauten Features. Zeigt pro Feature eine
// Ampel-Kachel (greift / sporadisch / greift nicht / nicht prüfbar) und darunter
// eine Pulsreihe: ein Punkt je Testlauf, leuchtend wenn das Feature gewirkt hat.
import { el, button } from "./dom";
import { icon } from "./icons";
import { runSelfTest, type FeatureResult } from "../features/selftest";
import { renderSelfTest, renderSummary } from "./selftestView";
import { analysiereHerkunft, loadSchnappschuss, QUELLEN_LABEL, type QuellenId } from "../features/sources";


export function mountDiagnose(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const status = el("span", { class: "muted mini" });
  const summary = el("div", { class: "diag-summary" });
  const body = el("div", {});

  const render = (res: FeatureResult[]): void => {
    body.innerHTML = ""; summary.innerHTML = "";
    summary.append(renderSummary(res));
    body.append(renderSelfTest(res));
  };

  // ── Textstruktur: woraus besteht der letzte Studio-Text? ──
  const struktBox = el("div", {});
  const renderStruktur = (): void => {
    struktBox.innerHTML = "";
    let text = ""; try { text = localStorage.getItem("dm_last_text") || ""; } catch { /* gesperrt */ }
    const snap = loadSchnappschuss();
    if (!text.trim()) { struktBox.append(el("p", { class: "muted" }, "Noch kein Text im Studio erzeugt.")); return; }
    const h = analysiereHerkunft(text, snap?.ton?.toLowerCase() || "neutral",
      { where: snap?.where, when: snap?.when, who: snap?.who, what: snap?.what });

    // Einstellungen, die zu diesem Text geführt haben
    if (snap) {
      const chips = el("div", { class: "src-settings" });
      const paare: [string, string][] = [["Preset", snap.preset], ["Ton", snap.ton], ["Form", snap.form],
        ["Struktur", snap.struktur], ["Perspektive", snap.perspektive], ["Rhythmus", snap.rhythmus],
        ["Markov", snap.markov], ["Varianz", snap.varianz], ["Spannung", snap.spannung],
        ["Länge", String(snap.laenge)], ["Bestenauslese", snap.bestenauslese ? "an" : "aus"]];
      for (const [k, v] of paare) chips.append(el("span", { class: "src-chip" }, el("b", {}, k), " " + (v || "—")));
      struktBox.append(chips);
      const w4 = el("div", { class: "src-4w" });
      ([["Wo", snap.where], ["Wann", snap.when], ["Wer", snap.who], ["Was", snap.what]] as [string, string][])
        .forEach(([k, v]) => w4.append(el("span", { class: "src-w" }, el("b", {}, k + ": "), v || "—")));
      struktBox.append(w4);
    }

    // Farbband: der Text als Herkunftsstreifen
    const band = el("div", { class: "src-band" });
    let pos = 0;
    for (const seg of h.segmente) {
      if (seg.s > pos) band.append(el("span", { class: "src-seg q-vorlage", style: `flex:${seg.s - pos}` }));
      band.append(el("span", { class: "src-seg q-" + seg.quelle, style: `flex:${seg.e - seg.s}`, title: QUELLEN_LABEL[seg.quelle] + ": " + text.slice(seg.s, seg.e) }));
      pos = seg.e;
    }
    if (pos < text.length) band.append(el("span", { class: "src-seg q-vorlage", style: `flex:${text.length - pos}` }));
    struktBox.append(el("div", { class: "muted mini" }, "Verlauf des Textes nach Herkunft:"), band);

    // Balken je Quelle
    const bars = el("div", { class: "src-bars" });
    (Object.keys(QUELLEN_LABEL) as QuellenId[])
      .map((q) => [q, h.anteile[q]] as [QuellenId, number])
      .sort((a, b) => b[1] - a[1])
      .forEach(([q, v]) => {
        bars.append(el("div", { class: "src-row" },
          el("span", { class: "src-name" }, QUELLEN_LABEL[q]),
          el("span", { class: "src-bar" }, el("span", { class: "src-fill q-" + q, style: `width:${Math.round(v * 100)}%` })),
          el("span", { class: "src-val" }, Math.round(v * 100) + " %")));
      });
    struktBox.append(bars);
    struktBox.append(el("p", { class: "muted mini" }, "„Vorlagen/Schablonen“ ist der Anteil, der keiner Quelle zugeordnet werden konnte — feste Satzgerüste, Verbindungswörter und die Nachbearbeitung."));
  };
  const struktBtn = button("Textstruktur aktualisieren");
  struktBtn.addEventListener("click", renderStruktur);

  const startBtn = el("button", { class: "primary" }, icon("play"), " Selbsttest starten") as HTMLButtonElement;
  startBtn.addEventListener("click", () => {
    startBtn.disabled = true; status.textContent = "Läuft…"; body.innerHTML = ""; summary.innerHTML = "";
    // Im nächsten Frame starten, damit der Status sichtbar wird
    setTimeout(() => {
      try {
        const res = runSelfTest((done, total, label) => { status.textContent = `Prüfe ${done}/${total} — ${label}`; });
        status.textContent = "Fertig · " + new Date().toLocaleTimeString("de-DE");
        render(res);
      } catch (e) { status.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e)); }
      finally { startBtn.disabled = false; }
    }, 30);
  });

  wrap.append(
    el("h2", {}, "Diagnose — greifen alle Features?"),
    el("p", { class: "muted" }, "Der Selbsttest erzeugt pro Feature mehrere Texte und prüft, ob das Feature im Ergebnis nachweisbar wirkt. Kein Qualitätsurteil — nur die Frage, ob der Schalter etwas bewirkt. Viele Features sind absichtlich sporadisch (z. B. der Disruptor feuert nur gelegentlich); die Pulsreihe zeigt das als gepunkteten Streifen statt als Fehler."),
    el("h3", {}, "Textstruktur — woraus besteht der Text im Studio?"),
    el("p", { class: "muted" }, "Zerlegt den zuletzt erzeugten Text nach Herkunft: Wortbank, Ton, 4W-Kontext, lebendige Pools, Markov. Darüber die Einstellungen, die zu diesem Text geführt haben."),
    el("div", { class: "btnrow" }, struktBtn),
    struktBox,
    el("hr", {}),
    el("h3", {}, "Selbsttest — greifen alle Features?"),
    el("div", { class: "btnrow" }, startBtn, status),
    summary,
    body,
    el("p", { class: "muted mini" }, "Legende: ● grün = greift zuverlässig · ● gelb = greift sporadisch (oft gewollt) · ● rot = keine Wirkung nachweisbar · ● grau = nicht prüfbar (fehlende Voraussetzung, z. B. leerer Korpus). Jeder Punkt der Reihe ist ein Testlauf."));
  root.append(wrap);
  renderStruktur();
}
