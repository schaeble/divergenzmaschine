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
import { getAllPresets, buildMergedBank } from "../wordbank";
import { generateIdeaBatch } from "../generation/ideas";
import { buildStory } from "../generation/buildStory";
import { buildModelFromCorpus, loadPersistentCorpus } from "../corpus";
import { addToTreasury, loadTreasury } from "../features/treasury";
import { ladeKopf, sichereKopf, oeffneZeitungssetzer, ueberschriftVon } from "./zeitungView";
import { ladeLayouts, sichereLayouts, legeLayout, textSchluessel, type Layout } from "../features/zeitungslayout";
import { ziehVorrat } from "../features/wikisammler";
import { ziehThema, themenStand } from "../features/themenpool";
import { schemaVon, schemaPlaetze, schemaAuftraege } from "../features/musterseite";
import { varianzBericht, type VarianzBand } from "../features/varianz";
import {
  OMNI_PRESETS, loadOmniUserPresets, profileToStudio, type CognitiveProfile,
} from "../features/omnikognition";
import {
  IDEA_PRESETS, loadIdeaUserPresets, ideaProfileToConfig, type IdeaProfile,
} from "../features/ideaprofile";
import { worldFillContext, worldTick, worldLogGeneration } from "../features/world";
import { ziehBildvorrat } from "../features/bildsammler";

import {
  baueBesetzung, baueEingabe, titelAus, naechsteAusgabe, layoutName, verteileRollen,
  ktxSchluessel, ladeGedaechtnis, merkeGedaechtnis, sichereGedaechtnis, GEDAECHTNIS_TIEFE,
  letzteWas,
  maxBeitraege, BEITRAEGE_MIN, BEITRAEGE_MAX, BEITRAEGE_VORGABE, type Quelle,
  platzBudget, verteileLaengen, kuerzeBericht, ladeFaktor, WOERTER_JE_SEITE,
  presetZahl, mischName,
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
  /** Ein Kontext samt der Quelle, die ihn WIRKLICH geliefert hat — und, wenn
   *  es eine Wahrnehmung war, dem Profil dahinter.
   *
   *  Vorher wurde die gewünschte Quelle gezählt. War der Vorrat leer, stand im
   *  Protokoll trotzdem „Sammler-Vorrat", obwohl die Welt eingesprungen war.
   *  Eine Herkunftsangabe, die den Wunsch nennt statt der Tatsache, ist keine. */
  interface KtxErgebnis {
    who: string; where: string; when: string; what: string;
    quelle: Quelle; profil?: CognitiveProfile;
  }
  const omniProfile = (): CognitiveProfile[] => {
    const eigene = Object.values(loadOmniUserPresets());
    return [...Object.values(OMNI_PRESETS), ...eigene];
  };
  const ideenProfile = (): IdeaProfile[] => {
    const eigene = Object.values(loadIdeaUserPresets());
    return [...eigene, ...Object.values(IDEA_PRESETS)];
  };
  const holeKontext = (
    q: Quelle, benutzt: Set<string>, wasGemieden: Set<string>,
  ): KtxErgebnis => {
    const zieh = (): KtxErgebnis => {
      if (q === "vorrat") {
        const f = ziehVorrat();
        if (f) return { ...f.ctx, quelle: "vorrat" };
      }
      if (q === "bild") {
        const f = ziehBildvorrat();
        if (f) return { ...f.ctx, quelle: "bild" };
      }
      if (q === "thema") {
        const f = ziehThema();
        if (f) return { ...f.ctx, quelle: "thema" };
      }
      if (q === "wahrnehmung") {
        // Die Omnikognition liefert nicht nur vier W, sondern eine ganze
        // Einstellung samt Sinnes-Wortbank. Beides wird weiter unten benutzt.
        const alle = omniProfile();
        const p = alle[Math.floor(Math.random() * alle.length)];
        if (p) {
          const ps = profileToStudio(p);
          return { who: ps.who, where: ps.where, when: ps.when, what: ps.what, quelle: "wahrnehmung", profil: p };
        }
      }
      if (q === "idee") {
        // Der Ideengenerator liefert einen ZUSAMMENHANG statt vier Felder
        // nebeneinander: Figur, Ort, Zeit und Vorgang stammen aus derselben
        // Prämisse. Das ist der Unterschied, den man einem Text ansieht.
        // MIT Profil, nicht mit der Vorgabe. Ohne Konfiguration liefert der
        // Ideengenerator seine zahmste Einstellung — deine eigenen Profile und
        // der Divergenz-Regler kamen im Autopiloten nie an.
        const profile = ideenProfile();
        const ip = profile[Math.floor(Math.random() * profile.length)];
        const i = generateIdeaBatch(1, ip ? ideaProfileToConfig(ip, 0.2) : undefined)[0];
        if (i) return { who: i.seedWho || "", where: i.seedWhere || "", when: i.seedWhen || "", what: i.seedWhat || "", quelle: "idee" };
      }
      const w = worldFillContext();
      return { who: w.who || "", where: w.where || "", when: w.when || "", what: w.what || "", quelle: "wuerfel" };
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
        const hatThema = themenStand().funde > 0;
        const seitenZahl = parseInt(seitenIn.value, 10) || 1;
        const gewuenscht = parseInt(anzahlIn.value, 10) || BEITRAEGE_VORGABE;
        // Die Laengen kommen jetzt aus dem PLATZ, nicht aus einem Gefuehl:
        // So viel, wie die Seiten tragen, verteilt im Verhaeltnis der Rollen.
        // Der Faktor ist die Selbstkorrektur aus dem gemessenen Fuellgrad des
        // letzten Laufs — die geometrische Schaetzung kennt weder Schriftgroesse
        // noch Preset-Wortlaengen.
        const faktor = ladeFaktor();
        const spaltenZahl = parseInt(spaltenIn.value, 10) || 3;
        // Ist im Setzer eine MUSTERSEITE eingestellt, kommen Zahl, Form und
        // Länge der Beiträge aus ihren Plätzen. Das ist der Kern der Sache:
        // Nicht die Texte bestimmen das Bild, sondern der Platz bestimmt den
        // Text — „vierzig Zeilen", wie eine Redaktion es bestellt. Die
        // Spaltenzahl wirkt dabei weiter, denn sie formt die Plätze.
        const schemaId = (() => { try { return localStorage.getItem("divergenz_zeitung_schema_v1") || ""; } catch { return ""; } })();
        const schema = schemaVon(schemaId);
        let auftraege;
        let schemaRollen: ("aufmacher" | "spalte" | "kasten")[] = [];
        if (schema) {
          const H = 1000;   // Nur Verhältnisse zählen — die echte Höhe steht erst im Setzer.
          const plaetze = schemaPlaetze(schema, spaltenZahl, H);
          const proSeite = plaetze.length;
          const roh2 = baueBesetzung(proSeite * seitenZahl, hatVorrat, hatBild, Math.random, maxBeitraege(seitenZahl), hatThema);
          const pa = schemaAuftraege(plaetze, spaltenZahl, H, Math.round(WOERTER_JE_SEITE * faktor));
          auftraege = roh2.slice(0, proSeite * seitenZahl).map((r, i) => {
            const a = pa[i % proSeite]!;
            // Die Quelle bleibt aus der Besetzung — sie sagt, WOHER der Stoff
            // kommt, und das hat mit dem Platz nichts zu tun.
            return { ...r, form: a.form as typeof r.form, woerter: a.woerter, was: `${a.form}, ${a.woerter} W` };
          });
          schemaRollen = auftraege.map((_, i) => pa[i % proSeite]!.rolle);
        } else {
          const roh = baueBesetzung(gewuenscht, hatVorrat, hatBild, Math.random, maxBeitraege(seitenZahl), hatThema);
          const budget = platzBudget(seitenZahl, roh.length, faktor);
          auftraege = verteileLaengen(roh, budget);
        }

        const erzeugt: { text: string; form: string; titel: string; preset: string; quelle: Quelle; ktx: string }[] = [];
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
        // Auch die Wortbänke kommen aus einem Beutel OHNE Zurücklegen. Mit
        // Zurücklegen kam bei acht Beiträgen im Mittel nur auf 85 % der Plätze
        // eine noch nicht benutzte Bank; bei einundfünfzig vorhandenen ist das
        // eine Wiederholung, für die es keinen Grund gibt.
        let presetBeutel: typeof presets = [];
        const ziehePreset = (): typeof presets[number] | null => {
          if (!presets.length) return null;
          if (!presetBeutel.length) {
            presetBeutel = presets.slice();
            for (let i = presetBeutel.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [presetBeutel[i], presetBeutel[j]] = [presetBeutel[j]!, presetBeutel[i]!];
            }
          }
          return presetBeutel.pop() || null;
        };
        // Beitrag fuer Beitrag, mit Atempause dazwischen. Bei sieben Stuecken
        // fiel es nicht auf; bei zwoelf oder vierundzwanzig steht die Ansicht
        // sonst minutenlang still, und der Knopfdruck sieht aus wie verpufft.
        for (let bi = 0; bi < auftraege.length; bi++) {
          const a = auftraege[bi]!;
          status.textContent = `Erzeuge Beitrag ${bi + 1} von ${auftraege.length} (${a.was}) …`;
          await warte();
          const erg = holeKontext(a.quelle, benutzt, wasGemieden);
          const ctx = { who: erg.who, where: erg.where, when: erg.when, what: erg.what };
          frisch.push(ktxSchluessel(ctx));
          // Gezählt wird, was WIRKLICH geliefert hat — nicht, was bestellt war.
          quellenZaehler.set(erg.quelle, (quellenZaehler.get(erg.quelle) || 0) + 1);
          // Ein bis DREI Presets, gemischt. Vorher war es immer genau eines —
          // das gibt Abwechslung zwischen den Artikeln, aber nie die Kollision
          // INNERHALB eines Textes. Saetze, in denen zwei Register
          // aufeinandertreffen, entstehen nur aus einer gemischten Bank.
          //
          // Ein Drittel bleibt einstimmig: Wer alles mischt, hat wieder nur
          // eine Sorte Text.
          const zahl = presetZahl();
          const gezogen = Array.from({ length: zahl }, () => ziehePreset()).filter(Boolean) as typeof presets;
          let bank = gezogen.length
            ? (gezogen.length === 1 ? gezogen[0]!.bank : buildMergedBank(gezogen.map((x) => x.id)))
            : grundBank;
          let bankName = mischName(gezogen.map((x) => x.label));
          let eingabe = baueEingabe(a, ctx);
          if (erg.profil) {
            // Die Wahrnehmung bringt ihre eigene Welt mit: eine Wortbank aus
            // den Sinneskanälen (Schall, Vibration, E-Feld, Magnetfeld …) und
            // dazu Perspektive, Rhythmus, Auflösung, Betonung. Genau DAS ist
            // die Varianz, die im Autopiloten fehlte — das Preset liefert
            // Stoff, das Profil liefert eine andere Art zu sehen.
            //
            // Die FORM bleibt, wie sie ist: Sie gehört zum Platz auf der Seite,
            // nicht zur Wahrnehmung.
            const ps = profileToStudio(erg.profil);
            bank = ps.bank;
            bankName = `Wahrnehmung: ${erg.profil.name}`;
            eingabe = {
              ...eingabe,
              structure: ps.structure, perspective: ps.perspective, rhythm: ps.rhythm,
              varLevel: ps.varLevel, mode: ps.mode, tone: ps.tone, markovMode: ps.markovMode,
              archetypeA: ps.archetypeA, archetypeB: ps.archetypeB, emphasis: ps.emphasis,
            } as typeof eingabe;
          }
          presetZaehler.set(bankName, (presetZaehler.get(bankName) || 0) + 1);
          let text = buildStory(bank, eingabe, model).trim();
          if (!text) continue;
          // Bericht und Meldung ignorieren die Ziellaenge in buildStory — sie
          // kehren vor enforceWordTarget zurueck. Beim Bericht wird deshalb
          // hier absatzweise gekuerzt: Das ist das Verfahren der umgekehrten
          // Pyramide und nimmt ihm keine Fakten aus dem Zusammenhang.
          if (a.form === "bericht") text = kuerzeBericht(text, a.woerter);
          // Was erzeugt wurde, faellt in die Welt zurueck: Figuren und Orte
          // dieser Ausgabe sind beim naechsten Wuerfeln bekannt.
          worldLogGeneration(ctx);
          erzeugt.push({
            text, form: a.form, titel: titelAus(ctx), preset: bankName,
            quelle: erg.quelle,
            // Die vier W, mit denen dieser Beitrag gebaut wurde. Ohne sie steht
            // im Protokoll die Herkunft, aber nicht das Geschehen — und genau
            // danach war gefragt.
            ktx: [ctx.who, ctx.what, ctx.when, ctx.where].filter(Boolean).join(" · "),
          });
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
        // Bei einer Musterseite stehen die Rollen schon fest: Sie gehören zum
        // Platz, nicht zum Text. Die freie Verteilung würde sie überschreiben.
        const rollen = schemaRollen.length
          ? schemaRollen
          : verteileRollen(erzeugt.map((e) => ({ text: e.text, form: e.form as never })));
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
            rolle: (rollen[i] === "normal" ? "spalte" : rollen[i]!) as "aufmacher" | "spalte" | "kasten",
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
          teile, bilder: [], schema: schemaId,
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
            el("b", {}, `${rollen[i]}`), ` · ${e.form} · ${e.preset} · ${w} Wörter`,
            e.ktx ? ` · 4W: ${e.ktx}` : "", " — ",
            e.text.slice(0, 90).replace(/\s+/g, " ") + "…"));
        });

        // Welche Quellen gezogen haben, wird genannt. Wer drei Ausgaben lang
        // dieselben Orte liest, soll sehen können, woher sie kamen — sonst
        // sucht man den Fehler im Generator, obwohl der Vorrat einseitig ist.
        const quellenName: Record<string, string> = {
          wuerfel: "Welt", vorrat: "Sammler-Vorrat", bild: "Bildvorrat",
          idee: "Ideengenerator", wahrnehmung: "Omnikognition", thema: "Themenpool",
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
        // Die Herkunft der vier W — und zwar die tatsächliche. „Welt" heißt:
        // Figur und Ort kamen aus dem Weltzustand, nicht aus einem Würfel.
        zeile("4W-Herkunft", quellenText || "keiner");
        // Und die vier W selbst, Beitrag für Beitrag. Ohne sie sagt das
        // Protokoll, WOHER der Stoff kam, aber nicht, WAS daraus wurde.
        zeile("4W je Beitrag", erzeugt.map((e, i) => `${i + 1}. ${e.ktx || "—"}`).join(" | ") || "—");
        zeile("Wortbänke", [...presetZaehler.entries()].map(([n, k]) => `${k}× ${n}`).join(", ") || "nur die eigene");
        zeile("Formen", [...new Set(erzeugt.map((e) => e.form))].join(", "));
        zeile("Korpus", `${loadPersistentCorpus().length} Zeichen, Markov-Kette 2. Ordnung`);
        const istWoerter = erzeugt.reduce((a, e) => a + (e.text.match(/\S+/g) || []).length, 0);
        const geplant = auftraege.reduce((a, x) => a + x.woerter, 0);
        zeile("Platz", `${geplant} Wörter geplant, ${istWoerter} entstanden `
          + (schema
            ? `(Musterseite „${schema.name.split(" —")[0]}", ${auftraege.length} Plätze, Korrekturfaktor ${faktor})`
            : `(${seitenZahl} × ${WOERTER_JE_SEITE} Wörter je Seite, Korrekturfaktor ${faktor})`));
        zeile("Welt", weltEreignisse.length
          ? `einen Tag weitergedreht — ${weltEreignisse.slice(0, 3).join(" ")}`
          : "unverändert");
        // ── Varianzanzeige ────────────────────────────────────────────────
        // Der Befund war „immer wieder ähnliche Beiträge". Hier steht die Zahl
        // dazu — und zwar die Ähnlichkeit zum NÄCHSTEN Nachbarn, nicht der
        // Durchschnitt aller Paare: Zwei fast gleiche Stücke in einer sonst
        // bunten Ausgabe verschwinden im Mittel, dem Leser fallen sie auf.
        const vb = varianzBericht(erzeugt.map((e, i) => ({
          titel: `${i + 1}`, text: e.text, form: e.form, bank: e.preset, quelle: e.quelle,
        })));
        const bandWort: Record<VarianzBand, string> = {
          hoch: "hoch — die Beiträge stehen für sich",
          mittel: "mittel — einzelne Stücke ähneln einander",
          gering: "gering — mehrere Beiträge sind verwandt",
        };
        const balken = el("div", { class: "va-balken" });
        const fuell = el("span", { class: "va-fuell va-" + vb.band });
        fuell.style.width = `${Math.round(vb.wert * 100)}%`;
        balken.append(fuell);
        herkunft.append(el("p", { class: "mini va-zeile" },
          el("b", {}, "Varianz: "), balken,
          el("span", { class: "va-wert va-" + vb.band }, `${Math.round(vb.wert * 100)} %`),
          el("span", { class: "muted" }, ` ${bandWort[vb.band]}`)));
        // Die Belegstellen: WELCHE Stücke sich ähneln. Ohne sie ist die Zahl
        // ein Urteil ohne Begründung.
        if (vb.paare.length && vb.paare[0]!.wert > 0.12) {
          const naechste = vb.paare
            .filter((x) => x.wert > 0.12)
            .map((x) => `${x.a + 1}↔${x.b + 1} (${Math.round(x.wert * 100)} %)`)
            .join(", ");
          zeile("Ähnlichste Paare", naechste);
        }
        zeile("Vielfalt", [
          `Formen ${Math.round(vb.vielfalt.formen * 100)} %`,
          `Wortbänke ${Math.round(vb.vielfalt.baenke * 100)} %`,
          `4W-Quellen ${Math.round(vb.vielfalt.quellen * 100)} %`,
          `Längen ${Math.round(vb.vielfalt.laengen * 100)} %`,
        ].join(" · "));
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
