// Autopilot: eine ganze Zeitungsseite auf einen Knopfdruck.
//
// Ausdrücklich OHNE bezahlte KI. Diese Datei bindet weder ki.ts noch lehrer,
// bildsammler oder bildwelt ein — der Prüfstand hält das nach. Ein Knopf, der
// ungefragt eine ganze Seite erzeugt, darf nicht nebenbei das Konto belasten:
// Die Zahl der Aufrufe wäre erst hinterher zu sehen, und dann ist es zu spät.
//
// Der Ablauf in einem Zug:
//   planen → erzeugen → in die Schatzkammer → Rollen verteilen → Layout ablegen
//   → Ausgabennummer hochzählen → Zeitungssetzer öffnen.
//
// Warum die Texte in die SCHATZKAMMER müssen: Ein Layout merkt sich seine
// Beiträge über einen Schlüssel aus dem Text und sucht sie beim Laden dort
// wieder. Legte der Autopilot sie woanders ab, wäre jedes gespeicherte Layout
// beim nächsten Öffnen leer.
import { el, button, field, textInput } from "./dom";
import { icon } from "./icons";
import { loadBank } from "../storage";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus, loadPersistentCorpus } from "../corpus";
import { addToTreasury, loadTreasury } from "../features/treasury";
import { ladeKopf, sichereKopf, oeffneZeitungssetzer, ueberschriftVon } from "./zeitungView";
import { ladeLayouts, sichereLayouts, legeLayout, textSchluessel, type Layout } from "../features/zeitungslayout";
import { ziehVorrat } from "../features/wikisammler";
import { ziehBildvorrat } from "../features/bildsammler";
import { worldFillContext } from "../features/world";
import {
  baueBesetzung, baueEingabe, titelAus, naechsteAusgabe, layoutName, verteileRollen,
  BEITRAEGE_MIN, BEITRAEGE_MAX, BEITRAEGE_VORGABE, type Quelle,
} from "../features/autopilot";

const WAHL_KEY = "divergenz_autopilot_v1";
interface Wahl { name: string; anzahl: number; spalten: number; seiten: number }
const VORGABE: Wahl = { name: "", anzahl: BEITRAEGE_VORGABE, spalten: 3, seiten: 1 };
const ladeWahl = (): Wahl => {
  try {
    const r = JSON.parse(localStorage.getItem(WAHL_KEY) || "null") as Partial<Wahl> | null;
    return r ? { ...VORGABE, ...r } : { ...VORGABE };
  } catch { return { ...VORGABE }; }
};
const sichereWahl = (w: Wahl): void => {
  try { localStorage.setItem(WAHL_KEY, JSON.stringify(w)); } catch { /* voll */ }
};

export function mountAutopilot(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const wahl = ladeWahl();
  const kopf = ladeKopf();

  const nameIn = textInput(wahl.name || kopf.titel, "Name für die Layouts — z. B. „Der Zeitstrom“");
  const anzahlIn = el("input", { type: "number", min: String(BEITRAEGE_MIN), max: String(BEITRAEGE_MAX),
    step: "1", value: String(wahl.anzahl), style: "width:100px" }) as HTMLInputElement;
  const spaltenIn = el("input", { type: "number", min: "2", max: "5", step: "1",
    value: String(wahl.spalten), style: "width:100px" }) as HTMLInputElement;
  const seitenIn = el("input", { type: "number", min: "1", max: "4", step: "1",
    value: String(wahl.seiten), style: "width:100px" }) as HTMLInputElement;

  const merke = (): void => {
    wahl.name = nameIn.value;
    wahl.anzahl = parseInt(anzahlIn.value, 10) || BEITRAEGE_VORGABE;
    wahl.spalten = parseInt(spaltenIn.value, 10) || 3;
    wahl.seiten = parseInt(seitenIn.value, 10) || 1;
    sichereWahl(wahl);
    zeigeStand();
  };
  [nameIn, anzahlIn, spaltenIn, seitenIn].forEach((x) => x.addEventListener("input", merke));

  const stand = el("p", { class: "muted mini" }, "");
  const zeigeStand = (): void => {
    const korpus = loadPersistentCorpus().length;
    const naechste = naechsteAusgabe(kopf.ausgabe);
    stand.textContent =
      `Nächste Ausgabe: „${kopf.ausgabe}“ → „${naechste}“ · `
      + `Layout wird abgelegt als „${layoutName(nameIn.value || kopf.titel, naechste)}“ · `
      + `Korpus ${korpus} Zeichen · Schatzkammer ${loadTreasury().length} Beiträge`;
  };

  const status = el("p", { class: "muted" }, "");
  const liste = el("div", {});
  const startBtn = el("button", { class: "primary" }, icon("play"), " Ausgabe erzeugen") as HTMLButtonElement;
  const oeffnenBtn = button("Zeitungsseite öffnen");
  oeffnenBtn.style.display = "none";
  let letzterName = "";
  oeffnenBtn.addEventListener("click", () => {
    if (letzterName) oeffneZeitungssetzer("", "prose", letzterName);
  });

  /** Holt einen 4W-Kontext aus der angefragten Quelle. Ist sie leer, fällt es
   *  auf den Würfel zurück — der funktioniert immer und braucht kein Netz. */
  const holeKontext = (q: Quelle): { who: string; where: string; when: string; what: string } => {
    if (q === "vorrat") {
      const f = ziehVorrat();
      if (f) return { ...f.ctx };
    }
    if (q === "bild") {
      const f = ziehBildvorrat();
      if (f) return { ...f.ctx };
    }
    const w = worldFillContext();
    return { who: w.who || "", where: w.where || "", when: w.when || "", what: w.what || "" };
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    oeffnenBtn.style.display = "none";
    liste.innerHTML = "";
    status.textContent = "Plane die Ausgabe …";

    // Im nächsten Bilddurchlauf, damit die Meldung erscheint, bevor der
    // Generator die Schleife blockiert — sonst steht die Ansicht still und der
    // Knopfdruck wirkt folgenlos.
    setTimeout(() => {
      try {
        const bank = loadBank();
        const model = buildModelFromCorpus(2);
        const hatVorrat = !!ziehVorrat();
        const hatBild = !!ziehBildvorrat();
        const auftraege = baueBesetzung(parseInt(anzahlIn.value, 10) || BEITRAEGE_VORGABE, hatVorrat, hatBild);

        const erzeugt: { text: string; form: string; titel: string }[] = [];
        for (const a of auftraege) {
          const ctx = holeKontext(a.quelle);
          const text = buildStory(bank, baueEingabe(a, ctx), model).trim();
          if (!text) continue;
          erzeugt.push({ text, form: a.form, titel: titelAus(ctx) });
        }
        if (!erzeugt.length) {
          status.textContent = "Es ist kein Text entstanden. Ist die Wortbank leer?";
          startBtn.disabled = false;
          return;
        }

        // In die Schatzkammer, denn dort sucht das Layout seine Beiträge.
        // `addToTreasury` weist Doppelte ab (-1) — ein abgewiesener Text stünde
        // nicht in der Schatzkammer und sein Platz im Layout bliebe leer.
        const teile: Layout["teile"] = [];
        let doppelt = 0;
        const rollen = verteileRollen(erzeugt.map((e) => ({ text: e.text, form: e.form as never })));
        erzeugt.forEach((e, i) => {
          const n = addToTreasury(e.text, { who: "", where: "", when: "", what: "", form: e.form });
          if (n < 0) { doppelt++; return; }
          const quelle = { t: e.text, form: e.form };
          const eintrag = loadTreasury().find((x) => textSchluessel(x) === textSchluessel(quelle));
          teile.push({
            schluessel: textSchluessel(quelle),
            // Der Setzer kennt „spalte" statt „normal" — dieselbe Sache, ein
            // anderer Name. Die Uebersetzung steht hier und nicht in der
            // Rechnung, damit der Autopilot nicht an den Bezeichnungen des
            // Setzers klebt.
            rolle: rollen[i] === "normal" ? "spalte" : rollen[i]!,
            titel: eintrag ? ueberschriftVon(eintrag) : e.titel,
          });
        });

        const naechste = naechsteAusgabe(kopf.ausgabe);
        const name = layoutName(nameIn.value || kopf.titel, naechste);
        const neuKopf = { ...kopf, ausgabe: naechste };
        if (nameIn.value.trim()) neuKopf.titel = nameIn.value.trim();

        const layout: Layout = {
          name, d: new Date().toISOString().slice(0, 16).replace("T", " "),
          kopf: neuKopf,
          spalten: parseInt(spaltenIn.value, 10) || 3,
          seiten: parseInt(seitenIn.value, 10) || 1,
          teile, bilder: [],
        };
        const ok = sichereLayouts(legeLayout(ladeLayouts(), layout));
        // Die Nummer wird ERST hochgezählt, wenn das Layout wirklich liegt.
        // Sonst zählte ein fehlgeschlagener Lauf die Ausgabe weiter, und die
        // nächste Zeitung trüge eine Nummer, die es nie gegeben hat.
        if (ok) { sichereKopf(neuKopf); Object.assign(kopf, neuKopf); letzterName = name; }

        liste.innerHTML = "";
        erzeugt.forEach((e, i) => {
          const w = (e.text.match(/\S+/g) || []).length;
          liste.append(el("p", { class: "muted mini" },
            el("b", {}, `${rollen[i]}`), ` · ${e.form} · ${w} Wörter — `, e.text.slice(0, 90).replace(/\s+/g, " ") + "…"));
        });

        status.textContent = ok
          ? `Fertig. ${teile.length} Beiträge, abgelegt als „${name}“.`
            + (doppelt ? ` ${doppelt} Text(e) gab es wortgleich schon — sie stehen nicht auf der Seite.` : "")
            + ` Ausgabe steht jetzt auf „${naechste}“.`
          : "Die Texte sind da, aber das Layout ließ sich nicht sichern — der Browser-Speicher ist voll. "
            + "Die Ausgabennummer wurde deshalb NICHT hochgezählt.";
        oeffnenBtn.style.display = ok ? "" : "none";
        zeigeStand();
      } catch (e) {
        status.textContent = "Fehlgeschlagen: " + (e instanceof Error ? e.message : String(e));
      } finally {
        startBtn.disabled = false;
      }
    }, 30);
  });

  wrap.append(
    el("h2", {}, "Autopilot"),
    el("p", { class: "muted" },
      "Ein Druck, eine ganze Ausgabe: Beiträge erzeugen, Rollen verteilen, Layout ablegen, "
      + "Ausgabennummer hochzählen. Danach lässt sich die Seite im Zeitungssetzer öffnen, "
      + "nachbessern und drucken."),
    el("p", { class: "muted mini" },
      "Läuft vollständig offline und kostet nichts. Er benutzt Wortbank, Presets, Markov-Korpus, "
      + "den Sammler-Vorrat, den Bildvorrat und den Kontextwürfel — aber keine der bezahlten "
      + "KI-Funktionen. Eine Zeitung, die nur mit Guthaben entsteht, wäre kein Automat, sondern ein Abonnement."),
    el("div", { class: "grid3", style: "margin-top:12px" },
      field("Name", nameIn), field("Beiträge", anzahlIn),
      field("Spalten", spaltenIn), field("Seiten", seitenIn)),
    stand,
    el("div", { class: "btnrow", style: "margin-top:10px" }, startBtn, oeffnenBtn),
    status,
    liste,
    el("p", { class: "muted mini", style: "margin-top:14px" },
      "Die Beiträge landen in der Schatzkammer — dort sucht das Layout sie beim nächsten Öffnen "
      + "wieder. Höchstens zwölf Layouts werden aufbewahrt; darüber fällt das älteste heraus."),
  );
  root.append(wrap);
  zeigeStand();
}
