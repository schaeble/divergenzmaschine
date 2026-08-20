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
import { getAllPresets } from "../wordbank";
import { generateIdeaBatch } from "../generation/ideas";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus, loadPersistentCorpus } from "../corpus";
import { addToTreasury, loadTreasury } from "../features/treasury";
import { ladeKopf, sichereKopf, oeffneZeitungssetzer, ueberschriftVon } from "./zeitungView";
import { ladeLayouts, sichereLayouts, legeLayout, textSchluessel, type Layout } from "../features/zeitungslayout";
import { ziehVorrat } from "../features/wikisammler";
import { worldFillContext, worldTick, worldLogGeneration } from "../features/world";
import { ziehBildvorrat } from "../features/bildsammler";

import {
  baueBesetzung, baueEingabe, titelAus, naechsteAusgabe, layoutName, verteileRollen,
  ktxSchluessel, ladeGedaechtnis, merkeGedaechtnis, sichereGedaechtnis, GEDAECHTNIS_TIEFE,
  letzteWas,
  maxBeitraege, BEITRAEGE_MIN, BEITRAEGE_MAX, BEITRAEGE_VORGABE, type Quelle,
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
  const grenze = el("p", { class: "sam-warn mini" }, "");
  // Das Gedächtnis sichtbar und leerbar machen. Eine Sperre, die man nicht
  // sieht, wird für einen Fehler gehalten, sobald sie einmal im Weg steht.
  const ktxWeg = button("Kontext-Gedächtnis leeren", "danger");
  ktxWeg.addEventListener("click", () => {
    if (!confirm("Die zuletzt benutzten Kontexte vergessen? Danach können frühere Figuren und Orte wieder vorkommen.")) return;
    sichereGedaechtnis([]);
    zeigeStand();
  });
  const zeigeStand = (): void => {
    const korpus = loadPersistentCorpus().length;
    const naechste = naechsteAusgabe(kopf.ausgabe);
    const g = ladeGedaechtnis().length;
    const seiten = parseInt(seitenIn.value, 10) || 1;
    const max = maxBeitraege(seiten);
    anzahlIn.max = String(max);
    const gewuenscht = parseInt(anzahlIn.value, 10) || BEITRAEGE_VORGABE;
    stand.textContent =
      `Nächste Ausgabe: „${kopf.ausgabe}“ → „${naechste}“ · `
      + `Layout wird abgelegt als „${layoutName(nameIn.value || kopf.titel, naechste)}“ · `
      + `Korpus ${korpus} Zeichen · Schatzkammer ${loadTreasury().length} Beiträge · `
      + `${g} von ${GEDAECHTNIS_TIEFE} zuletzt benutzten Kontexten werden gemieden`;
    // Die Grenze VOR dem Druck nennen, nicht erst hinterher in der Meldung.
    // Wer sechzehn einträgt und sieben bekommt, sucht den Fehler sonst dort,
    // wo keiner ist.
    grenze.textContent = gewuenscht > max
      ? `Bei ${seiten} ${seiten === 1 ? "Seite" : "Seiten"} sind höchstens ${max} Beiträge sinnvoll — `
        + `es werden ${max} erzeugt statt ${gewuenscht}. Für mehr die Seitenzahl erhöhen.`
      : "";
    ktxWeg.style.display = g ? "" : "none";
  };

  const status = el("p", { class: "muted" }, "");
  const liste = el("div", {});
  // Steht ueber der Beitragsliste: Erst was benutzt wurde, dann was entstand.
  const herkunft = el("div", { class: "zk-protokoll" });
  const startBtn = el("button", { class: "primary" }, icon("play"), " Ausgabe erzeugen") as HTMLButtonElement;
  const oeffnenBtn = button("Zeitungsseite öffnen");
  oeffnenBtn.style.display = "none";
  let letzterName = "";
  oeffnenBtn.addEventListener("click", () => {
    if (letzterName) oeffneZeitungssetzer("", "prose", letzterName);
  });

  /** Holt einen 4W-Kontext aus der angefragten Quelle. Ist sie leer, fällt es
   *  auf den Würfel zurück — der funktioniert immer und braucht kein Netz.
   *
   *  `benutzt` sammelt, was in DIESER Ausgabe schon dran war. Ohne das kann
   *  derselbe Fund mehrfach gezogen werden, und dann stehen zwei Artikel über
   *  denselben Ort nebeneinander. Nach acht vergeblichen Versuchen wird
   *  genommen, was kommt: Bei einem Vorrat aus drei Funden gibt es keine
   *  fünfte neue Kombination, und ein leerer Kontext wäre schlechter als ein
   *  wiederholter. */
  let erschoepft = 0;
  const holeKontext = (
    q: Quelle, benutzt: Set<string>, wasGemieden: Set<string>,
  ): { who: string; where: string; when: string; what: string } => {
    const zieh = (): { who: string; where: string; when: string; what: string } => {
      if (q === "vorrat") {
        const f = ziehVorrat();
        if (f) return { ...f.ctx };
      }
      if (q === "bild") {
        const f = ziehBildvorrat();
        if (f) return { ...f.ctx };
      }
      if (q === "idee") {
        // Der Ideengenerator liefert einen ZUSAMMENHANG statt vier Felder
        // nebeneinander: Figur, Ort, Zeit und Vorgang stammen aus derselben
        // Prämisse. Das ist der Unterschied, den man einem Text ansieht.
        const i = generateIdeaBatch(1)[0];
        if (i) return { who: i.seedWho || "", where: i.seedWhere || "", when: i.seedWhen || "", what: i.seedWhat || "" };
      }
      const w = worldFillContext();
      return { who: w.who || "", where: w.where || "", when: w.when || "", what: w.what || "" };
    };
    let letzter = zieh();
    for (let i = 0; i < 8; i++) {
      const k = ktxSchluessel(letzter);
      const was = (letzter.what || "").toLowerCase().replace(/\s+/g, " ").trim();
      // Beides muss frisch sein: der ganze Kontext UND die Absicht für sich.
      if (!benutzt.has(k) && !wasGemieden.has(was)) {
        benutzt.add(k); if (was) wasGemieden.add(was);
        return letzter;
      }
      letzter = zieh();
    }
    // Nach acht Versuchen genommen, was kommt — und mitgezählt, damit die
    // Meldung es sagen kann. Ein stiller Rückfall auf eine Wiederholung ist
    // genau das, was hier abgestellt werden soll.
    erschoepft++;
    benutzt.add(ktxSchluessel(letzter));
    return letzter;
  };

  startBtn.addEventListener("click", () => {
    startBtn.disabled = true;
    oeffnenBtn.style.display = "none";
    liste.innerHTML = "";
    status.textContent = "Plane die Ausgabe …";

    // Nach jedem Beitrag einen Bilddurchlauf abwarten, damit die Meldung
    // wirklich erscheint. Ohne das rechnet der Browser die ganze Ausgabe
    // durch, bevor er auch nur einmal neu zeichnet.
    const warte = (): Promise<void> => new Promise((f) => setTimeout(f, 0));
    void (async () => {
      try {
        await warte();
        // DIE WORTBANK JE BEITRAG. Bisher stand hier `loadBank()` — EINE Bank
        // für alle Beiträge einer Ausgabe. Das war die groesste verbliebene
        // Ursache fuer die Aehnlichkeit: Ton, Rhythmus und Struktur formen nur,
        // die BANK bestimmt, wovon ein Text handelt. Acht Texte aus derselben
        // Bank handeln von denselben Dingen, egal wie die Regler stehen.
        const presets = Object.values(getAllPresets());
        const grundBank = loadBank();
        const model = buildModelFromCorpus(2);

        // Die Welt einen Tag weiterdrehen. Sie ist ein eigener Baustein, der
        // sich nur bewegt, wenn ihn jemand anstoesst — sonst zieht der
        // Weltwuerfel jede Ausgabe aus demselben eingefrorenen Zustand.
        const weltEreignisse = worldTick();
        const hatVorrat = !!ziehVorrat();
        const hatBild = !!ziehBildvorrat();
        const seitenZahl = parseInt(seitenIn.value, 10) || 1;
        const gewuenscht = parseInt(anzahlIn.value, 10) || BEITRAEGE_VORGABE;
        const auftraege = baueBesetzung(gewuenscht, hatVorrat, hatBild, Math.random, maxBeitraege(seitenZahl));

        const erzeugt: { text: string; form: string; titel: string; preset: string }[] = [];
        const presetZaehler = new Map<string, number>();
        // Das Gedächtnis früherer Ausgaben ist der Startbestand des
        // Gemiedenen: Zwei Zeitungen hintereinander mit derselben Schlagzeile
        // sehen nicht nach Zufall aus, sondern nach Defekt.
        const gedaechtnis = ladeGedaechtnis();
        const benutzt = new Set<string>(gedaechtnis);
        const wasGemieden = letzteWas(gedaechtnis);
        const frisch: string[] = [];
        erschoepft = 0;
        const quellenZaehler = new Map<string, number>();
        // Beitrag fuer Beitrag, mit Atempause dazwischen. Bei sieben Stuecken
        // fiel es nicht auf; bei zwoelf oder vierundzwanzig steht die Ansicht
        // sonst minutenlang still, und der Knopfdruck sieht aus wie verpufft.
        for (let bi = 0; bi < auftraege.length; bi++) {
          const a = auftraege[bi]!;
          status.textContent = `Erzeuge Beitrag ${bi + 1} von ${auftraege.length} (${a.was}) …`;
          await warte();
          const ctx = holeKontext(a.quelle, benutzt, wasGemieden);
          frisch.push(ktxSchluessel(ctx));
          quellenZaehler.set(a.quelle, (quellenZaehler.get(a.quelle) || 0) + 1);
          // Je Beitrag ein anderes Preset — oder die eigene Bank, damit die
          // aktuelle Einstellung nicht voellig verschwindet.
          const p = presets.length ? presets[Math.floor(Math.random() * presets.length)] : null;
          const bank = p ? p.bank : grundBank;
          if (p) presetZaehler.set(p.label, (presetZaehler.get(p.label) || 0) + 1);
          const text = buildStory(bank, baueEingabe(a, ctx), model).trim();
          if (!text) continue;
          // Was erzeugt wurde, faellt in die Welt zurueck: Figuren und Orte
          // dieser Ausgabe sind beim naechsten Wuerfeln bekannt.
          worldLogGeneration(ctx);
          erzeugt.push({ text, form: a.form, titel: titelAus(ctx), preset: p ? p.label : "eigene Bank" });
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
            el("b", {}, `${rollen[i]}`), ` · ${e.form} · ${e.preset} · ${w} Wörter — `,
            e.text.slice(0, 90).replace(/\s+/g, " ") + "…"));
        });

        // Welche Quellen gezogen haben, wird genannt. Wer drei Ausgaben lang
        // dieselben Orte liest, soll sehen können, woher sie kamen — sonst
        // sucht man den Fehler im Generator, obwohl der Vorrat einseitig ist.
        const quellenName: Record<string, string> = {
          wuerfel: "Weltwürfel", vorrat: "Sammler-Vorrat", bild: "Bildvorrat", idee: "Ideengenerator",
        };
        const quellenText = [...quellenZaehler.entries()]
          .map(([q, n]) => `${n}× ${quellenName[q] || q}`)
          .join(", ");

        // Was dieser Durchlauf benutzt hat — vollständig und nachlesbar. Ohne
        // das ist der Autopilot eine Kiste, in die man oben drückt: Wer die
        // Ausgaben einförmig findet, kann nicht sehen, woran es liegt.
        herkunft.innerHTML = "";
        const zeile = (titel: string, inhalt: string): void => {
          herkunft.append(el("p", { class: "muted mini", style: "margin:2px 0" },
            el("b", {}, titel + ": "), inhalt));
        };
        herkunft.append(el("p", { class: "mini", style: "margin:0 0 4px" },
          el("b", {}, "Was dieser Durchlauf benutzt hat")));
        zeile("Kontext", quellenText || "keiner");
        zeile("Wortbänke", [...presetZaehler.entries()].map(([n, k]) => `${k}× ${n}`).join(", ") || "nur die eigene");
        zeile("Formen", [...new Set(erzeugt.map((e) => e.form))].join(", "));
        zeile("Korpus", `${loadPersistentCorpus().length} Zeichen, Markov-Kette 2. Ordnung`);
        zeile("Welt", weltEreignisse.length
          ? `einen Tag weitergedreht — ${weltEreignisse.slice(0, 3).join(" ")}`
          : "unverändert");
        zeile("Nicht benutzt", "KI-Lehrer, Bildsammler, Abschrift — der Autopilot kostet nichts");
        sichereGedaechtnis(merkeGedaechtnis(gedaechtnis, frisch));
        status.textContent = ok
          ? `Fertig. ${teile.length} Beiträge, abgelegt als „${name}“. Kontext aus: ${quellenText}.`
            + (erschoepft
              ? ` ${erschoepft}× musste ein schon benutzter Kontext genommen werden. `
                // Sagen, was zu tun ist. „Vorräte geben nicht mehr her" nennt
                // den Zustand, aber nicht den Ausweg — und der Ausweg ist ein
                // Knopf, der direkt daneben steht.
                + (gedaechtnis.length >= GEDAECHTNIS_TIEFE
                  ? "Das Gedächtnis ist voll und sperrt inzwischen mehr, als die Vorräte hergeben: leeren oder Sammler und Bildvorrat auffüllen."
                  : "Die Vorräte geben nicht mehr her — im Sammler nachlegen.")
              : "")
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
    })();
  });

  wrap.append(
    el("h2", {}, "Autopilot"),
    el("p", { class: "muted" },
      "Ein Druck, eine ganze Ausgabe: Beiträge erzeugen, Rollen verteilen, Layout ablegen, "
      + "Ausgabennummer hochzählen. Danach lässt sich die Seite im Zeitungssetzer öffnen, "
      + "nachbessern und drucken."),
    el("p", { class: "muted mini" },
      "Läuft vollständig offline und kostet nichts. Er benutzt Wortbank, Presets, Markov-Korpus, "
      + "den Sammler-Vorrat, den Bildvorrat, den Ideengenerator, die Welt und den Kontextwürfel — "
      + "aber keine der bezahlten "
      + "KI-Funktionen. Eine Zeitung, die nur mit Guthaben entsteht, wäre kein Automat, sondern ein Abonnement."),
    el("div", { class: "grid3", style: "margin-top:12px" },
      field("Name", nameIn), field("Beiträge", anzahlIn),
      field("Spalten", spaltenIn), field("Seiten", seitenIn)),
    stand,
    grenze,
    el("div", { class: "btnrow", style: "margin-top:10px" }, startBtn, oeffnenBtn, ktxWeg),
    status,
    herkunft,
    liste,
    el("p", { class: "muted mini", style: "margin-top:14px" },
      "Die Beiträge landen in der Schatzkammer — dort sucht das Layout sie beim nächsten Öffnen "
      + "wieder. Höchstens zwölf Layouts werden aufbewahrt; darüber fällt das älteste heraus."),
  );
  root.append(wrap);
  zeigeStand();
}
