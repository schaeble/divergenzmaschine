// Diagnose-Tab: Selbsttest der eingebauten Features. Zeigt pro Feature eine
// Ampel-Kachel (greift / sporadisch / greift nicht / nicht prüfbar) und darunter
// eine Pulsreihe: ein Punkt je Testlauf, leuchtend wenn das Feature gewirkt hat.
import { el, button } from "./dom";
import { ladeNutzung, sichereNutzung, alsListe, seitWann } from "../features/nutzung";
import { derKanon } from "../features/reiter";
import { icon } from "./icons";
import { runSelfTest, type FeatureResult } from "../features/selftest";
import { renderSelfTest, renderSummary } from "./selftestView";
import { mountWirkung } from "./wirkungView";
import { baueAnlage, sammleUmgebung, loadAnlage } from "../features/schaltplan";
import { renderSchaltplan, befundListe } from "./schaltplanView";
import { wuerfleAlles } from "../features/wuerfeln";
import { saveAnlage } from "../features/schaltplan";
import { loadKnobs, saveKnobs } from "../features/knobs";
import { uebernimmWurf } from "./studio";


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

  // ── Nutzung: was wird tatsaechlich benutzt? ──
  // Der eigentliche Grund: Von allem Gebauten weiss niemand, ob es benutzt
  // wird. Ich als Ratgeber sehe nur Anfragen, nie den Friedhof — ein
  // Baumeister, der ausschliesslich Grundsteinlegungen kennt und keine
  // Abrisse, hat kein Urteil ueber Tragfaehigkeit. Diese Liste ist die
  // Auskunft, gegen die sich nicht argumentieren laesst.
  const nutzBox = el("div", {});
  const renderNutzung = (): void => {
    nutzBox.innerHTML = "";
    const stand = ladeNutzung();
    const zeilen = alsListe(stand, derKanon());
    const seit = seitWann(stand);
    const tage = seit ? Math.floor((Date.now() - seit) / 86400000) : 0;
    const summe = zeilen.reduce((a, z) => a + z.n, 0);

    nutzBox.append(el("p", { class: "muted mini" },
      summe
        ? `${summe} Aufrufe seit ${tage} ${tage === 1 ? "Tag" : "Tagen"}. `
          + "Gezaehlt wird der Klick auf einen Reiter, nicht das Oeffnen der App — "
          + "sonst stuende Studio bei jedem Start hoeher."
        : "Noch nichts gezaehlt. Die Liste wird erst nach einigen Tagen aussagekraeftig."));

    const tab = el("table", { class: "nutz-tab" });
    tab.append(el("tr", {},
      el("th", {}, "Reiter"), el("th", {}, "Aufrufe"), el("th", {}, "zuletzt")));
    const hoechst = Math.max(1, ...zeilen.map((z) => z.n));
    for (const z of zeilen) {
      tab.append(el("tr", { class: z.nie ? "nutz-nie" : "" },
        el("td", {}, z.id),
        el("td", {},
          el("span", { class: "nutz-balken" },
            el("span", { style: `width:${Math.round((z.n / hoechst) * 100)}%` })),
          el("span", { class: "nutz-zahl" }, String(z.n))),
        el("td", {}, z.nie ? "nie" : z.tage === 0 ? "heute" : `vor ${z.tage} ${z.tage === 1 ? "Tag" : "Tagen"}`)));
    }
    nutzBox.append(tab);
    nutzBox.append(el("p", { class: "muted mini", style: "margin-top:8px" },
      "Ungenutztes steht oben — wer diese Liste oeffnet, sucht nicht den "
      + "Spitzenreiter, sondern den Ballast. Die Zahlen bleiben im Browser und "
      + "gehen nirgendwohin."));
  };
  const nutzBtn = button("Nutzung aktualisieren");
  nutzBtn.addEventListener("click", renderNutzung);
  const nutzWeg = button("Zaehlung zuruecksetzen", "danger");
  nutzWeg.addEventListener("click", () => {
    if (!confirm("Die Zaehlung auf null setzen? Danach dauert es wieder Wochen, bis die Liste etwas sagt.")) return;
    sichereNutzung({});
    renderNutzung();
  });

  // Die Textstruktur stand hier bis 4.304.0. Sie zerlegt den zuletzt erzeugten
  // Text nach Herkunft — das ist eine Frage, die man WAEHREND des Schreibens
  // stellt, nicht beim Nachmessen der Maschine. Im Studio steht sie ohnehin
  // schon; hier war sie ein zweiter Ort für dieselbe Sache.

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
  // Würfeln, ohne den Reiter zu wechseln: Der Wurf fällt hier, wird gespeichert
  // und sofort gezeichnet. Das Studio übernimmt ihn bei der Rückkehr — sonst
  // zeigte der Plan eine Anlage, die es nirgends gibt.
  const wuerfelBtn = el("button", {
    title: "Alle Regler und Stellschrauben neu würfeln — gesperrte bleiben stehen. Der Plan zeichnet sich sofort neu.",
  }, icon("dice"), " Alles würfeln") as HTMLButtonElement;
  const wuerfelHint = el("span", { class: "muted mini" });
  wuerfelBtn.addEventListener("click", () => {
    const stand = loadAnlage();
    if (!stand) { wuerfelHint.textContent = "Noch kein Stand — einmal in den Reiter Studio wechseln."; return; }
    let gesperrt = new Set<string>();
    try { gesperrt = new Set(JSON.parse(localStorage.getItem("divergenz_studio_locks_v1") || "[]") as string[]); } catch { /* leer */ }
    const wurf = wuerfleAlles(stand.regler, gesperrt, loadKnobs(), stand.w4);
    saveKnobs(wurf.knobs);
    // Die Quelle gehört in die Ablage, nicht nur in die graue Zeile: Der Plan
    // soll zeigen, WAS diesen Wurf gespeist hat.
    saveAnlage({ ...stand, regler: wurf.regler, w4: wurf.w4, quelle: wurf.quelle, zeit: new Date().toISOString() });
    uebernimmWurf(wurf.nachId);
    // Die Quelle der vier W gehört dazu: Bei vier gleichen Feldern wüsste man
    // sonst nicht, ob der Vorrat leer war oder ob dasselbe gezogen wurde.
    wuerfelHint.textContent = `gewürfelt · Vier W aus ${wurf.quelle}`
      + (gesperrt.size ? ` — ${gesperrt.size} ${gesperrt.size === 1 ? "Schloss hält" : "Schlösser halten"}` : "");
    renderPlan();
  renderNutzung();
  });
  // Die Legende nennt jetzt das Zeichen mit, nicht nur die Farbe.
  const legende = el("div", { class: "sp-legende" },
    el("span", {}, el("i", { class: "sp-punkt", style: "border-color:var(--acc2);background:color-mix(in srgb, var(--acc2) 40%, transparent)" }), "● verdrahtet (kräftiger Rahmen)"),
    el("span", {}, el("i", { class: "sp-punkt", style: "border-color:var(--danger)" }), "▲ an, aber die Quelle ist leer (grob gestrichelt)"),
    el("span", {}, el("i", { class: "sp-punkt", style: "border-color:var(--muted)" }), "○ aus (fein gestrichelt)"),
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
    el("div", { class: "btnrow" }, planBtn, wuerfelBtn, wuerfelHint),
    legende,
    planHint,
    planBox,
    el("hr", {}),
    el("p", { class: "muted" }, "Der Selbsttest erzeugt pro Feature mehrere Texte und prüft, ob das Feature im Ergebnis nachweisbar wirkt. Kein Qualitätsurteil — nur die Frage, ob der Schalter etwas bewirkt. Viele Features sind absichtlich sporadisch (z. B. der Disruptor feuert nur gelegentlich); die Pulsreihe zeigt das als gepunkteten Streifen statt als Fehler."),
    el("h3", {}, "Nutzung — was wird tatsaechlich benutzt?"),
    el("p", { class: "muted" },
      "Zaehlt, wie oft jeder Reiter geoeffnet wurde. Kein Qualitaetsurteil und keine "
      + "Empfehlung — nur die Auskunft, welche Bausteine im Alltag vorkommen und welche nicht. "
      + "Ein Baustein, der nach Wochen bei null steht, ist ein Streichkandidat; die Liste "
      + "beantwortet das, was sich weder erinnern noch schaetzen laesst."),
    el("div", { class: "btnrow" }, nutzBtn, nutzWeg),
    nutzBox,
    el("hr", {}),
    mountWirkung(),
    el("hr", {}),
    el("h3", {}, "Selbsttest — greifen alle Features?"),
    el("div", { class: "btnrow" }, startBtn, status),
    summary,
    body,
    el("p", { class: "muted mini" }, "Legende: ● grün = greift zuverlässig · ● gelb = greift sporadisch (oft gewollt) · ● rot = keine Wirkung nachweisbar · ● grau = nicht prüfbar (fehlende Voraussetzung, z. B. leerer Korpus). Jeder Punkt der Reihe ist ein Testlauf."));
  root.append(wrap);
  renderPlan();
  renderNutzung();
}
