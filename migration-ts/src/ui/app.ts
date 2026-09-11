// Tab-Gerüst: Studio · Wortbank · Korpus.
import { el } from "./dom";
import { VERSION } from "../version";
import { exportProject, importProject } from "../features/project";
import { icon } from "./icons";

function showAbout(): void {
  const overlay = el("div", { class: "modal" });
  const close = el("button", { class: "x", "aria-label": "Schließen" }, icon("x"));
  close.addEventListener("click", () => overlay.remove());
  overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.remove(); });
  const card = el("div", { class: "modal-card" },
    el("div", { class: "modal-head" }, el("h2", {}, "Über die Divergenzmaschine"), close),
    el("div", { class: "modal-body" },
      el("p", {}, "Die Divergenzmaschine baut Texte, die es nicht gibt, aus Bausteinen, die es gibt — und rechnet damit, dass Menschen aus Bruchstücken Sinn bauen. Das ist die Maschine in einem Satz: Sie erzeugt keinen Sinn, sie legt ihn nahe. Wer liest, findet in einem Beamten, der erklärt, was er nicht darf, in einer Tasche, die stehen bleibt, in einem Bescheid ohne Antwort eine Welt, die sich selbst nicht mehr versteht — und diese Welt hat der Leser gebaut, nicht die Maschine. Die Fragmentierung ist kein Ausdruck eines Bewusstseins; sie ist das einzige Stilmittel, das die Maschine hat, und die Kohärenz kommt vom Lesen."),
      el("p", {}, "Wie sie baut: aus drei Vorräten. Die Wortbank liefert das Was — Bilder, Haken, Requisiten, Wenden, Hindernisse, Einsätze, Schlüsse, in Presets geordnet oder aus einem eigenen Text abgeleitet. Die Erzählerbank liefert das Wie — Geschichten mit Bauformen, deren Schlagfolge den Bogen führt. Der Korpus liefert die fremde Stimme — Markov-Ketten aus eigenem Material, durch Wächter geprüft und ins Präsens gebracht. Ein Zusammenbau zieht daraus Atom für Atom, bewertet nach Phase, Rhythmus, Anschluss und Bogen; Betonung, Spannung, Kohärenz und Schliff arbeiten nach. Kernbilder kehren vor dem Höhepunkt gesteigert wieder. Jede Regel entstand aus einem gelesenen Blatt und steht mit Gegenprobe in einem Prüfstand."),
      el("p", {}, "Was man sieht: Jeder Text ist bis in seine Atome rückverfolgbar — die Editieren-Ansicht färbt nach Herkunft, der Quelltext zeigt den Bau Stufe für Stufe und Schritt für Schritt mit der Entscheidung dahinter, der Schaltplan zeigt, welche Quelle wirkt und welche abgeklemmt ist, die Spannungskurve lässt sich am Rand des Textes mit der Hand formen. Formen: Prosa, Prosagedicht, Gedicht-Strang, Reim, Haiku, Szene/Dialog, Multi-Shot. Alles offline im Browser; auf Wunsch arbeitet eine KI die Rohtexte aus, ohne Schlüssel bleibt die Maschine ganz bei sich."),
      el("p", { class: "muted" }, "→ Trage links „Wo / Wann / Wer / Was passiert“ ein und klicke auf „Generieren“, um deine erste Geschichte zu erzeugen."),
      el("p", { class: "muted" }, "Hinweis: Die Texte entstehen maschinell aus Bausteinen — sie sind nicht recherchiert und nicht wahr. Preset-Namen realer Autoren bezeichnen eine Stilanmutung, keine Zitate. Alle Daten bleiben in deinem Browser. Ausführlich unter Hilfe ▸ Hinweise & Haftungsausschluss.")));
  overlay.append(card);
  document.body.append(overlay);
}
import { mountStudio } from "./studio";
import { mountWordbank } from "./wordbankView";
import { mountErzaehlerbank } from "./erzaehlerbankView";
import { mountKorpus } from "./korpusView";
import { mountIdeas } from "./ideasView";
import { mountSammler } from "./sammlerView";
import { mountTreasury } from "./treasuryView";
import { mountWorld } from "./worldView";
import { mountOscilloscope } from "./oscilloscopeView";
import { mountWorkshop } from "./workshopView";
import { mountBildwelt } from "./bildweltView";
import { mountAutopilot } from "./autopilotView";
import { oeffneDruckvorschau } from "./printView";
import { oeffneZeitungssetzer } from "./zeitungView";
import { loadActiveBankLabel } from "../wordbank";
import { ladeStand, sichtbar, setzeKanon } from "../features/reiter";
import { zaehle } from "../features/nutzung";
import { mountDiagnose } from "./diagnoseView";
import { mountHelp } from "./helpView";
import { mountLehrer } from "./lehrerView";

/** Reiter, die keine Ansicht öffnen, sondern ein Fenster. „Drucken" und
 *  „Zeitungsseite" waren Knöpfe neben „Generieren" — dort standen sie zwischen
 *  Erzeugungsknöpfen, obwohl sie nichts erzeugen, sondern etwas Fertiges
 *  weiterverarbeiten. In der Leiste sind sie auffindbar, und beide lassen sich
 *  jetzt wie jeder andere Reiter ausblenden.
 *
 *  Sie wechseln die Ansicht NICHT: Der Reiter, auf dem man stand, bleibt aktiv.
 *  Ein Fenster über einer leeren Fläche zu öffnen und beim Schließen vor dem
 *  Nichts zu stehen, wäre der schlechtere Weg. */
const AKTIONEN: Record<string, (() => void) | undefined> = {
  "Drucken": () => {
    const t = leseText();
    oeffneDruckvorschau(t.text, t.form, loadActiveBankLabel(), t.titel);
  },
  "Zeitungsseite": () => {
    const t = leseText();
    oeffneZeitungssetzer(t.text, t.form);
  },
};

/** Der zuletzt im Studio erzeugte Text samt Form. Beide Fenster brauchen ihn,
 *  und aus der Leiste heraus gibt es keinen Zugriff auf das Studio. */
function leseText(): { text: string; form: string; titel: string } {
  let text = "", form = "prose", titel = "";
  try { text = localStorage.getItem("dm_last_text") || ""; } catch { /* gesperrt */ }
  try { form = localStorage.getItem("dm_last_form") || "prose"; } catch { /* gesperrt */ }
  try { titel = localStorage.getItem("dm_last_titel") || ""; } catch { /* gesperrt */ }
  return { text, form, titel };
}

const TABS: [string, (root: HTMLElement) => void][] = [
  ["Studio", mountStudio],
  ["Ideen", mountIdeas],
  ["Sammler", mountSammler],
  ["Welt", mountWorld],
  ["Wortbank", mountWordbank],
  ["Erzählerbank", mountErzaehlerbank],
  ["Korpus", mountKorpus],
  ["Oszilloskop", mountOscilloscope],
  ["Schatzkammer", mountTreasury],
  ["Bildwelt", mountBildwelt],
  ["Autopilot", mountAutopilot],
  ["Werkstatt", mountWorkshop],
  ["KI-Lehrer", mountLehrer],
  ["Diagnose", mountDiagnose],
  ["Drucken", () => { /* Auslöser, siehe AKTIONEN */ }],
  ["Zeitungsseite", () => { /* Auslöser, siehe AKTIONEN */ }],
  ["Hilfe", mountHelp],
];

export function mountApp(root: HTMLElement): void {
  root.innerHTML = "";
  const shell = el("div", { class: "app" });
  const saveBtn = el("button", { class: "topbtn", title: "Gesamtes Projekt als Datei sichern — alles: Wortbank, Presets, Korpus, Einstellungen, Schatzkammer, Ideen-/Omni-Presets, lebendige Pools und alle Werkstatt-Projekte." }, icon("floppy"), " Exportieren");
  const loadBtn = el("button", { class: "topbtn", title: "Projektdatei importieren — ERSETZT den gesamten aktuellen Stand." }, icon("folder"), " Importieren");
  const fileIn = el("input", { type: "file", accept: "application/json,.json", style: "display:none" }) as HTMLInputElement;
  const projStatus = el("span", { class: "projstatus muted" }, "");
  saveBtn.addEventListener("click", () => {
    void exportProject().then((ok) => {
      if (!ok) return;
      projStatus.textContent = "gespeichert ✓";
      setTimeout(() => (projStatus.textContent = ""), 1600);
    }).catch(() => { projStatus.textContent = "Export fehlgeschlagen"; setTimeout(() => (projStatus.textContent = ""), 2000); });
  });
  loadBtn.addEventListener("click", () => { if (confirm("Beim Importieren wird der gesamte aktuelle Stand (Wortbank, Korpus, Schatzkammer, Werkstatt-Projekte …) durch die Datei ersetzt. Fortfahren?")) fileIn.click(); });
  fileIn.addEventListener("change", () => {
    const f = fileIn.files && fileIn.files[0];
    if (!f) return;
    projStatus.textContent = "lade…";
    importProject(f).then(() => { projStatus.textContent = "geladen ✓ — Ansicht wird aktualisiert"; setTimeout(() => location.reload(), 700); })
      .catch((e: unknown) => { projStatus.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); });
    fileIn.value = "";
  });
  const titleLink = el("span", { class: "apptitle-link", title: "Über die Divergenzmaschine — klicken" }, "Divergenzmaschine");
  titleLink.addEventListener("click", showAbout);
  const header = el("div", { class: "apphead" },
    el("h1", { class: "apptitle" }, titleLink, el("span", { class: "ver", title: "Build-Version" }, "v" + VERSION)),
    el("div", { class: "projctl" }, projStatus, saveBtn, loadBtn, fileIn));
  shell.append(header);

  const bar = el("div", { class: "tabbar" });
  const content = el("div", {});
  const nachName = new Map(TABS);
  /** Der Reiter, der gerade offen ist. Über das Neuzeichnen hinweg gemerkt:
   *  Wer in den Einstellungen etwas umsortiert, soll danach dort stehen, wo er
   *  war, und nicht wieder am Anfang. */
  let offen = "";

  setzeKanon(TABS.map(([n]) => n));

  // ── Springen (Schaltplan Stufe 1, 4.342.0) ──────────────────────────────
  // Ein Knoten im Schaltplan weiß, wo er eingestellt wird. Das Ereignis
  // „dm-springe" öffnet den Reiter, klappt zugeklappte <details> auf dem Weg
  // zum Element auf, rollt es ins Bild und hebt es zwei Sekunden hervor.
  // Verstellt wird nichts — der Klick ist nur der Weg vom Befund zur Stelle.
  document.addEventListener("dm-springe", (ev) => {
    const { reiter, element } = ((ev as CustomEvent).detail || {}) as { reiter?: string; element?: string };
    if (!reiter) return;
    const knopf = Array.from(bar.querySelectorAll("button")).find((b) => b.textContent === reiter);
    if (knopf && offen !== reiter) knopf.click();
    if (!element) { content.scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    window.setTimeout(() => {
      const zielEl = document.getElementById(element);
      if (!zielEl) return;
      let p: HTMLElement | null = zielEl;
      while (p) { if (p instanceof HTMLDetailsElement) p.open = true; p = p.parentElement; }
      const traeger = (zielEl.closest(".field, .knobrow, .lenrow, .diag-block") as HTMLElement | null) || zielEl;
      traeger.scrollIntoView({ behavior: "smooth", block: "center" });
      traeger.classList.add("sprung-ziel");
      window.setTimeout(() => traeger.classList.remove("sprung-ziel"), 2200);
      if (zielEl instanceof HTMLSelectElement || zielEl instanceof HTMLInputElement) zielEl.focus({ preventScroll: true });
    }, 60);
  });

  const zeichneLeiste = (): void => {
    bar.innerHTML = "";
    const namen = sichtbar(TABS.map(([n]) => n), ladeStand());
    if (!namen.includes(offen)) offen = "";
    const knoepfe: HTMLButtonElement[] = [];
    for (const name of namen) {
      const aktion = AKTIONEN[name];
      const b = el("button", aktion ? { class: "tabaktion", title: "Öffnet ein Fenster — der Reiter wechselt nicht" } : {}, name) as HTMLButtonElement;
      b.addEventListener("click", () => {
        // Gezaehlt wird am Klick, nicht am Zeichnen: Der erste Reiter wird beim
        // Start gemountet, ohne dass ihn jemand gewaehlt haette — mitzuzaehlen
        // hiesse, „Studio" jeden Start hochzuzaehlen und die Liste unbrauchbar
        // zu machen.
        zaehle(name);
        if (aktion) { aktion(); return; }
        knoepfe.forEach((x) => x.classList.remove("active"));
        b.classList.add("active");
        offen = name;
        nachName.get(name)?.(content);
      });
      knoepfe.push(b);
      bar.append(b);
    }
    // Beim ersten Zeichnen den ersten Reiter öffnen, der auch eine Ansicht hat
    // — ein Auslöser an erster Stelle ließe die Fläche sonst leer.
    if (!offen) {
      const erster = namen.find((n) => !AKTIONEN[n]) || namen[0]!;
      offen = erster;
      const b = knoepfe[namen.indexOf(erster)];
      if (b && !AKTIONEN[erster]) { b.classList.add("active"); nachName.get(erster)?.(content); }
    } else {
      const b = knoepfe[namen.indexOf(offen)];
      if (b) b.classList.add("active");
    }
  };

  // Kein Ringschluss der Einbindungen: Das Studio meldet die Änderung über ein
  // Ereignis am Fenster, statt hier eine Funktion zu holen.
  window.addEventListener("dm-reiter", () => zeichneLeiste());

  zeichneLeiste();
  shell.append(bar, content);
  root.append(shell);
}
