// Diagnose-Tab: Selbsttest der eingebauten Features. Zeigt pro Feature eine
// Ampel-Kachel (greift / sporadisch / greift nicht / nicht prüfbar) und darunter
// eine Pulsreihe: ein Punkt je Testlauf, leuchtend wenn das Feature gewirkt hat.
import { el, button } from "./dom";
import { icon } from "./icons";
import { runSelfTest, type FeatureResult } from "../features/selftest";
import { renderSelfTest, renderSummary } from "./selftestView";
import { loadSchnappschuss } from "../features/sources";
import { renderTextstruktur } from "./structureView";
import { mountWirkung } from "./wirkungView";
import { baueAnlage, sammleUmgebung, loadAnlage } from "../features/schaltplan";
import { renderSchaltplan, befundListe } from "./schaltplanView";


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
    struktBox.append(renderTextstruktur(text, loadSchnappschuss()));
  };
  const struktBtn = button("Textstruktur aktualisieren");
  struktBtn.addEventListener("click", renderStruktur);

  // ── Schaltplan: was ist gerade verdrahtet? ──
  // Er misst nicht, er liest ab. Erzeugt wird nichts — ein Plan, der beim
  // Ansehen einen Text erzeugt, hätte den Zustand verändert, den er zeigen soll.
  const planBox = el("div", {});
  const planHint = el("p", { class: "muted mini" });
  const renderPlan = (): void => {
    planBox.innerHTML = "";
    const stand = loadAnlage();
    if (!stand) {
      planBox.append(el("p", { class: "muted" }, "Noch kein Stand vorhanden — einmal in den Reiter Studio wechseln, dann steht der Plan."));
      planHint.textContent = "";
      return;
    }
    const anlage = baueAnlage(stand, sammleUmgebung(stand.regler["preset"] || ""));
    const b = befundListe(anlage);
    planHint.textContent = b.leer
      ? `${b.leer} ${b.leer === 1 ? "Leitung läuft" : "Leitungen laufen"} ins Leere — ${b.text}`
      : b.text;
    planHint.className = b.leer ? "mini sp-warn" : "muted mini";
    planBox.append(renderSchaltplan(anlage));
  };
  const planBtn = button("Schaltplan aktualisieren");
  planBtn.addEventListener("click", renderPlan);
  const legende = el("div", { class: "sp-legende" },
    el("span", {}, el("i", { class: "sp-punkt", style: "border-color:var(--acc2)" }), "verdrahtet"),
    el("span", {}, el("i", { class: "sp-punkt", style: "border-color:var(--danger)" }), "an, aber die Quelle ist leer"),
    el("span", {}, el("i", { class: "sp-punkt", style: "border-color:var(--muted)" }), "aus"),
    el("span", {}, "🔒 gesperrt (bleibt beim Würfeln stehen)"));

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
    el("h3", {}, "Schaltplan — was ist gerade verdrahtet?"),
    el("p", { class: "muted" }, "Zeigt die Stellungen zum Zeitpunkt der Anfrage: jeden Regler, die acht Stellschrauben, die vier W samt Vorräten, Korpus, Markov, Welt und die Ausgabe. Der Plan erzeugt dafür keinen Text — er liest ab. Was er zusätzlich kann, ist der Abgleich zwischen Schalter und Quelle: Ein Schalter kann an sein, während seine Quelle leer ist (Markov ohne Korpus, Dramaturgie ohne Bogen, Korpus-Bausteine ohne Korpus). Solche Leitungen stehen rot und gestrichelt."),
    el("div", { class: "btnrow" }, planBtn),
    legende,
    planHint,
    planBox,
    el("hr", {}),
    el("p", { class: "muted" }, "Der Selbsttest erzeugt pro Feature mehrere Texte und prüft, ob das Feature im Ergebnis nachweisbar wirkt. Kein Qualitätsurteil — nur die Frage, ob der Schalter etwas bewirkt. Viele Features sind absichtlich sporadisch (z. B. der Disruptor feuert nur gelegentlich); die Pulsreihe zeigt das als gepunkteten Streifen statt als Fehler."),
    el("h3", {}, "Textstruktur — woraus besteht der Text im Studio?"),
    el("p", { class: "muted" }, "Zerlegt den zuletzt erzeugten Text nach Herkunft: Wortbank, Ton, 4W-Kontext, lebendige Pools, Markov. Darüber die Einstellungen, die zu diesem Text geführt haben."),
    el("div", { class: "btnrow" }, struktBtn),
    struktBox,
    el("hr", {}),
    mountWirkung(),
    el("hr", {}),
    el("h3", {}, "Selbsttest — greifen alle Features?"),
    el("div", { class: "btnrow" }, startBtn, status),
    summary,
    body,
    el("p", { class: "muted mini" }, "Legende: ● grün = greift zuverlässig · ● gelb = greift sporadisch (oft gewollt) · ● rot = keine Wirkung nachweisbar · ● grau = nicht prüfbar (fehlende Voraussetzung, z. B. leerer Korpus). Jeder Punkt der Reihe ist ein Testlauf."));
  root.append(wrap);
  renderStruktur();
  renderPlan();
}
