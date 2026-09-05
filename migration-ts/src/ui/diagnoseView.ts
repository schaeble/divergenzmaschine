// Diagnose-Tab: Selbsttest der eingebauten Features. Zeigt pro Feature eine
// Ampel-Kachel (greift / sporadisch / greift nicht / nicht prüfbar) und darunter
// eine Pulsreihe: ein Punkt je Testlauf, leuchtend wenn das Feature gewirkt hat.
import { el, button } from "./dom";
import { ladeIndex, sichereIndex, werteAus, grundquote, alsCsv } from "../features/textindex";
import { ladeNutzung, sichereNutzung, alsListe, seitWann } from "../features/nutzung";
import { derKanon } from "../features/reiter";
import { icon } from "./icons";
import { runSelfTest, type FeatureResult } from "../features/selftest";
import { renderSelfTest, renderSummary } from "./selftestView";
import { mountWirkung } from "./wirkungView";
import { baueAnlage, sammleUmgebung, loadAnlage } from "../features/schaltplan";
import { renderSchaltplan, befundListe } from "./schaltplanView";
import { ladeStatistik, statistikKurz, statistikZuruecksetzen, ZAEHLER_NAMEN, type Zaehler } from "../features/waechterStatistik";
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

  // ── Textindex ──
  const idxBox = el("div", {});
  const renderIndex = (): void => {
    idxBox.innerHTML = "";
    const liste = ladeIndex();
    if (!liste.length) {
      idxBox.append(el("p", { class: "muted mini" },
        "Noch nichts aufgeschrieben. Der Index fuellt sich beim Erzeugen im Studio."));
      return;
    }
    const grund = grundquote(liste);
    const behalten = liste.filter((e) => e.behalten).length;
    idxBox.append(el("p", { class: "muted mini" },
      `${liste.length} Texte, davon ${behalten} behalten — Grundquote ${grund} %.`
      + (liste.length < 30 ? " Zu wenige fuer ein Urteil; ab etwa dreissig lohnt der Vergleich." : "")));
    const tabelle = (titel: string, b: ReturnType<typeof werteAus>): void => {
      if (!b.length) return;
      idxBox.append(el("p", { class: "mini", style: "margin:10px 0 2px" }, el("b", {}, titel)));
      for (const x of b.slice(0, 8)) {
        // Die Abweichung von der Grundquote steht dabei — die Quote allein
        // verleitet dazu, 40 Prozent fuer gut zu halten, auch wenn der
        // Durchschnitt bei 55 liegt.
        const d = x.quote - grund;
        idxBox.append(el("p", { class: "muted mini", style: "margin:1px 0" },
          `${x.wert}: ${x.quote} % von ${x.gesamt} (${d >= 0 ? "+" : ""}${d} gegenueber dem Mittel)`));
      }
    };
    tabelle("Presets", werteAus(liste, (e) => e.presets || []));
    tabelle("Form", werteAus(liste, (e) => [e.form || "—"]));
    tabelle("Ton", werteAus(liste, (e) => [e.regler?.ton || "—"]));
    tabelle("Struktur", werteAus(liste, (e) => [e.regler?.struktur || "—"]));
    tabelle("Spreizung", werteAus(liste, (e) => [
      e.spreizung >= 0.5 ? "weit (ab 0,5)" : e.spreizung > 0 ? "gemischt, aber nah" : "ein Register"]));
  };
  const idxBtn = button("Auswertung zeigen");
  idxBtn.addEventListener("click", renderIndex);
  const idxCsv = button("Als CSV sichern");
  idxCsv.addEventListener("click", () => {
    const csv = alsCsv(ladeIndex());
    if (!csv) return;
    // Mit BOM, sonst zerlegt ein deutsches Tabellenprogramm die Umlaute.
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `divergenz_textindex_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  });
  const idxWeg = button("Index leeren", "danger");
  idxWeg.addEventListener("click", () => {
    if (!ladeIndex().length || !confirm("Den Textindex loeschen? Die Schatzkammer bleibt unberuehrt.")) return;
    sichereIndex([]);
    renderIndex();
  });

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
    el("h3", {}, "Textindex — welche Einstellung fuehrt zu behaltenen Texten?"),
    el("p", { class: "muted" },
      "Jeder erzeugte Text wird mit seinen Einstellungen aufgeschrieben — nicht nur der "
      + "behaltene. Ein Index nur ueber Behaltenes zeigt, was gute Texte gemeinsam haben, "
      + "aber nicht, ob die schlechten es auch hatten; erst der Vergleich beider Klassen sagt "
      + "etwas. „Behalten\u201c wird nachgetragen, wenn ein Text in die Schatzkammer wandert. "
      + "Die Grundquote ist der Massstab: Eine Einstellung mit 30 Prozent ist gut, wenn im "
      + "Mittel 20 behalten werden, und schlecht, wenn es 50 sind."),
    el("div", { class: "btnrow" }, idxBtn, idxCsv, idxWeg),
    idxBox,
    el("hr", {}),
    el("h3", {}, "Nutzung — was wird tatsaechlich benutzt?"),
    el("p", { class: "muted" },
      "Zaehlt, wie oft jeder Reiter geoeffnet wurde. Kein Qualitaetsurteil und keine "
      + "Empfehlung — nur die Auskunft, welche Bausteine im Alltag vorkommen und welche nicht. "
      + "Ein Baustein, der nach Wochen bei null steht, ist ein Streichkandidat; die Liste "
      + "beantwortet das, was sich weder erinnern noch schaetzen laesst."),
    el("div", { class: "btnrow" }, nutzBtn, nutzWeg),
    nutzBox,
    el("hr", {}),
    mountWaechterStatistik(),
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

// ── Wächter-Statistik (Punkt 5 des Zielbilds) ───────────────────────────────
// Jede Regel entstand aus einem Blatt. Hier zählt die Maschine selbst: wie oft
// welche Regel verworfen hat (mit den letzten Beispielen), was der Umschreiber
// tat, was die Atomisierung zerlegte — und Stichproben dessen, was der Wächter
// DURCHLÄSST. Dort steht das nächste Muster, bevor ein Blatt es zeigt.
function mountWaechterStatistik(): HTMLElement {
  const box = el("div", {});
  const zeichnen = (): void => {
    box.innerHTML = "";
    const st = ladeStatistik();
    const kurz = statistikKurz();
    const gesamt = kurz.verworfen + kurz.angenommen;
    box.append(el("h3", {}, "Wächter-Statistik — was die Regeln tun"));
    box.append(el("p", { class: "muted" }, "Der Satz-Wächter, der Präsens-Umschreiber und die Atomisierung zählen seit "
      + new Date(st.seit).toLocaleDateString("de-DE") + " mit. Zu jeder Regel die letzten Beispiele; unter „durchgelassen“ Stichproben dessen, was der Wächter passieren ließ — dort zeigt sich das nächste Muster, bevor ein Blatt es meldet."));
    if (!gesamt && !kurz.umgeschrieben && !kurz.zerlegt) { box.append(el("p", { class: "muted" }, "Noch nichts gezählt — der Wächter zählt ab der ersten Markov-Kette, die Atomisierung ab dem ersten langen Baustein.")); }
    const reihen: Zaehler[] = ["regel1", "regel2", "regel3", "regel4", "regel5", "regel6", "regel7", "regel8", "angenommen", "umgeschrieben", "unklar", "praeteritumVerworfen", "atomZerlegt", "atomGekuerzt", "atomGanzZuLang"];
    for (const z of reihen) {
      const n = st.zaehler[z] || 0;
      if (!n) continue;
      const bsp = st.beispiele[z] || [];
      const d = el("details", { class: "hyg-gruppe" }, el("summary", {}, `${ZAEHLER_NAMEN[z]} · ${n}`));
      if (bsp.length) for (const b of bsp) d.append(el("div", { class: "muted mini", style: "margin:2px 0 2px 12px" }, b));
      else d.append(el("div", { class: "muted mini", style: "margin-left:12px" }, "keine Beispiele gemerkt"));
      box.append(d);
    }
    const reset = button("Zähler zurücksetzen", "danger");
    reset.addEventListener("click", () => { if (confirm("Wächter-Statistik zurücksetzen?")) { statistikZuruecksetzen(); zeichnen(); } });
    box.append(el("div", { class: "btnrow", style: "margin-top:8px" }, reset));
  };
  zeichnen();
  document.addEventListener("visibilitychange", zeichnen);
  return box;
}
