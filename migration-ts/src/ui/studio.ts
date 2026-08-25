// Studio-Tab: Kontext, Regler, Preset, Generieren/Variante/Kopieren,
// Lesemodus (Vollbild) und Vorlesen (SpeechSynthesis).
import type { GenInput, FormKind } from "../types";
import { loadBank, saveBank } from "../storage";
import { getAllPresets, saveActiveBankLabel, buildAutoMixBank, buildMergedBank, lastAutoMixSources, AUTOMIX_ID } from "../wordbank";
import { markedPresetOptions, getUserPreset2 } from "../features/preset2";
import { setDramaData, hasDramaData, loadDramaData } from "../generation/dramaturgie";
import { loadUmwelt, saveUmwelt, umweltTeile, type UmweltWirkung } from "../features/umwelt";
import { RESSORTS, RESSORT_IDS } from "../features/ressorts";
import { builtinDrama } from "../presets.drama.data";
import { loadKnobs, saveKnobs, KNOB_VORGABE, KNOB_SPANNE, regle, loadZiele, vergissVerlauf, type Knobs, type ZielQuelle } from "../features/knobs";
import { buildStory } from "../generation/buildStory";
import { getMarkovTraceFor } from "../generation/markovTrace";
import { buildModelFromCorpus, savePersistentCorpus } from "../corpus";
import { feedLivePools, LIVE_W } from "../features/livepools";
import { enforceWordTarget } from "../generation/length";
import { randomContext } from "../generation/context";
import { ziehVorrat, vorratStand, type VorratFund } from "../features/wikisammler";
import { ziehBildvorrat, ladeBildvorrat, type BildFund } from "../features/bildsammler";
import { ziehThema, themenStand } from "../features/themenpool";
import { normWhere, normWhen, normWho, rateWhere, rateWhen, rateWho } from "../generation/ctxnorm";
import { getTraceFor, fuegeteilAnteil } from "../atoms/trace";
import { saveSchnappschuss, loadSchnappschuss } from "../features/sources";
import { renderTextstruktur } from "./structureView";
import { mischAbstand } from "../features/register";
import {
  ladeIndex, sichereIndex, mischeIndex, woerterVon, markiereBehalten,
  textSchluessel as indexSchluessel,
} from "../features/textindex";
import { analysiereHerkunft, QUELLEN_LABEL, w4Varianten } from "../features/sources";
import { extractLeadVerb, looksLikeFullClause, splitSpeakers } from "../generation/wordcls";
import { el, select, field, textInput, button } from "./dom";
import {
  TONE_OPTS, FORM_OPTS, STRUCTURE_OPTS, MODE_OPTS, PERSP_OPTS, RHYTHM_OPTS,
  TENSION_OPTS, CAST_OPTS, INSTAB_OPTS,
  VARIANZ_OPTS, DISRUPTOR_OPTS, MARKOV_OPTS, ARCH_OPTS,
} from "../generation/optionen";
import {
  ladeStand as ladeReiter, sichereStand as sichereReiter, ordne as ordneReiter,
  verschiebe as verschiebeReiter, schalte as schalteReiter, derKanon, PFLICHT as REITER_PFLICHT,
} from "../features/reiter";
import { icon } from "./icons";
import { saveAnlage } from "../features/schaltplan";
import {
  KOPF_FORMEN, LAENGE_NAMEN, REIBUNG_NAMEN, PROBEN, SAAT_BEISPIELE,
  stellung as kopfStellung, ladeWahl as ladeKopfWahl, sichereWahl as sichereKopfWahl, probeAus,
} from "../features/einfach";
import { waehleGespreizt } from "../features/register";
import { wuerfleVierW } from "../features/wuerfeln";
import { openReader } from "./reader";
import { worldLogGeneration, worldFillContext } from "../features/world";
import { uebernehmeKontext, geaendert as geaenderteFelder, offeneQuellen, ziehQuelle, QUELLE_LABEL, W4_FELDER, type W4 } from "../features/kontext";
import { addToTreasury, addToTreasurySecret, clearTreasury } from "../features/treasury";
import { THEMES, loadTheme, applyTheme, loadAccent, saveAccent, applyAccent } from "../features/theme";
import { loadAiKey, saveAiKey, loadAiModel, saveAiModel } from "../features/ki";
import { storageReport, lesePosten, formatBytes } from "../features/storage-status";
import { loadFont, loadFontSize, saveFontPrefs, applyStoryFont } from "../features/fonts";
import { runProbe, runRanking, bestOf, type Ranking } from "../generation/scoring";
import { TONE_DATA } from "../generation/tone.data";
import { liveTexts } from "../features/livepools";

// Überlebt den Tab-Wechsel: mountStudio läuft bei jeder Rückkehr neu.
let studioSchonGewuerfelt = false;
const studioReglerStand: Record<string, string> = {};
/** Ein Wurf, der ANDERSWO gefallen ist (Schaltplan im Reiter Diagnose), wird
 *  hier hinterlegt. Ohne das zeigte der Plan Stellungen, die das Studio bei der
 *  Rückkehr gar nicht hätte — der Plan wäre dann selbst die Rateei, die er
 *  abschaffen soll. Die Rückkehr in den Reiter liest genau diesen Stand. */
export function uebernimmWurf(nachId: Record<string, string>): void {
  for (const [id, wert] of Object.entries(nachId)) studioReglerStand[id] = wert;
}

export function mountStudio(root: HTMLElement): void {
  // Woher die vier W beim letzten Wurf kamen — wandert in die Ablage, aus der
  // der Schaltplan unter Diagnose liest.
  let letzteQuelle = "";
  root.innerHTML = "";
  const wrap = el("div", {});

  const where = textInput("f-where", "Wo?", "auf der Schafsweide");
  const when = textInput("f-when", "Wann?", "vor langer Zeit");
  const who = textInput("f-who", "Wer? (mehrere durch Komma = Dialog)", "Baucis, Philemon");
  const what = textInput("f-what", "Was passiert?", "ein Wunder geschieht");
  const clearable = (input: HTMLInputElement): HTMLElement => {
    const x = el("button", { class: "clr", type: "button", title: "Feld leeren" }, "×");
    x.addEventListener("click", () => { input.value = ""; input.dispatchEvent(new Event("input")); input.focus(); });
    return el("div", { class: "inwrap" }, input, x);
  };
  // Festhalter: gesperrte Regler/Felder bleiben beim Würfeln unverändert (persistiert).
  const LOCK_KEY = "divergenz_studio_locks_v1";
  const locked = new Set<string>((() => { try { return JSON.parse(localStorage.getItem(LOCK_KEY) || "[]") as string[]; } catch { return []; } })());
  const saveLocks = (): void => { try { localStorage.setItem(LOCK_KEY, JSON.stringify([...locked])); } catch { /* voll */ } };
  // Gesperrte Felder merken sich zusätzlich ihren Wert über den Neustart.
  const LOCKVAL_KEY = "divergenz_locked_vals_v1";
  const lockVals: Record<string, string> = (() => { try { return JSON.parse(localStorage.getItem(LOCKVAL_KEY) || "{}") as Record<string, string>; } catch { return {}; } })();
  const saveLockVals = (): void => { try { localStorage.setItem(LOCKVAL_KEY, JSON.stringify(lockVals)); } catch { /* voll */ } };
  const lockCtrls: Record<string, HTMLSelectElement | HTMLInputElement> = {};
  // Ein Schloss kann jetzt an MEHREREN Stellen stehen (Werkzeugkasten und Chip).
  // Die Maler werden deshalb mit ihrem Knopf gefuehrt: Die Chipzeile wird bei
  // jeder Erzeugung neu gebaut, ihre alten Knoepfe haengen dann im Nichts und
  // wuerden die Liste sonst unbegrenzt fuellen.
  type Maler = { b: HTMLButtonElement; paint: () => void };
  const lockPainters: Record<string, Maler[]> = {};
  // Haekchen speichern ihren Zustand in .checked, nicht in .value - ohne diese
  // Unterscheidung merkte sich das Schloss bei Editieren, Struktur und Bauplan nichts.
  const istHaken = (c: HTMLSelectElement | HTMLInputElement): boolean =>
    c instanceof HTMLInputElement && c.type === "checkbox";
  const wertVon = (c: HTMLSelectElement | HTMLInputElement): string =>
    istHaken(c) ? ((c as HTMLInputElement).checked ? "1" : "0") : c.value;
  const setzeWert = (c: HTMLSelectElement | HTMLInputElement, v: string): void => {
    if (istHaken(c)) {
      const h = c as HTMLInputElement;
      if (h.checked !== (v === "1")) { h.checked = v === "1"; h.dispatchEvent(new Event("change")); }
    } else c.value = v;
  };
  const restoreLocked = (): void => { for (const id of locked) { const c = lockCtrls[id]; if (c && lockVals[id] !== undefined) setzeWert(c, lockVals[id]!); } };
  const lockBtn = (ctrl: HTMLSelectElement | HTMLInputElement): HTMLButtonElement => {
    lockCtrls[ctrl.id] = ctrl;
    const upd = (): void => { if (locked.has(ctrl.id)) { lockVals[ctrl.id] = wertVon(ctrl); saveLockVals(); } };
    ctrl.addEventListener("input", upd); ctrl.addEventListener("change", upd);
    const b = el("button", { class: "lockbtn", type: "button", title: "Beim Würfeln festhalten (Wert bleibt auch nach Neustart)" }) as HTMLButtonElement;
    const paint = (): void => { b.innerHTML = ""; b.append(icon(locked.has(ctrl.id) ? "lock" : "lockOpen")); b.classList.toggle("on", locked.has(ctrl.id)); };
    const liste = (lockPainters[ctrl.id] ||= []);
    liste.push({ b, paint });
    const repaint = (): void => {
      const l = lockPainters[ctrl.id] || [];
      const lebend = l.filter((m) => m.b === b || m.b.isConnected);
      l.length = 0; l.push(...lebend);
      lebend.forEach((m) => m.paint());
    };
    b.addEventListener("click", () => {
      if (locked.has(ctrl.id)) { locked.delete(ctrl.id); delete lockVals[ctrl.id]; }
      else { locked.add(ctrl.id); lockVals[ctrl.id] = wertVon(ctrl); }
      saveLocks(); saveLockVals(); repaint();
    });
    paint(); return b;
  };
  const lockField = (label: string, sel: HTMLSelectElement): HTMLElement =>
    el("div", { class: "field" }, el("span", { class: "field-label lockrow" }, el("span", {}, label), lockBtn(sel)), sel);

  const ctxDice = el("button", {}, icon("dice"), " Kontext würfeln");
  ctxDice.addEventListener("click", () => { const c = randomContext(); if (!locked.has(where.id)) where.value = c.where; if (!locked.has(when.id)) when.value = c.when; if (!locked.has(who.id)) who.value = c.who; if (!locked.has(what.id)) what.value = c.what; updHints(); ctxSichern(); });
  // Wiki-Taste: derselbe Griff wie der Würfel, nur aus dem Sammler-Vorrat.
  // Sie greift NICHT ins Netz — sie liest, was der Reiter „Sammler“ abgelegt
  // hat, und arbeitet damit auch offline.
  // „Alles würfeln": der Kontext aus der WELT (Figuren, Orte, Zeitleiste des
  // Reiters Welt — bevorzugt eine Figur mit Spannung, das „Was" aus ihrem
  // Status) UND alle Stilregler in einem Griff. Der Unterschied zu „Kontext
  // würfeln": Dort kommen die vier W aus einem festen Zufallsvorrat, hier aus
  // dem, was in deiner Welt schon geschehen ist. Gesperrte Felder und Regler
  // bleiben, wie sie sind — sonst wäre das Schloss wertlos.
  const alleBtn = el("button", { class: "primary", title: "Vier W aus einer gewürfelten Quelle (Welt, Wiki-Vorrat oder Bildvorrat) + alle Stilregler (gesperrte bleiben)" }, icon("dice"), " Alles würfeln");
  alleBtn.addEventListener("click", () => {
    const felder = {
      where: { id: where.id, wert: where.value }, when: { id: when.id, wert: when.value },
      who: { id: who.id, wert: who.value }, what: { id: what.id, wert: what.value },
    };
    // Die Quelle wird mitgewürfelt: Welt, Wiki-Vorrat oder Bildvorrat, je
    // nachdem, was gefüllt ist. Welche es war, sagt die Zeile darunter — sonst
    // wüsste man bei vier gleichen Feldern nicht, ob der Vorrat leer war.
    const quelle = ziehQuelle(offeneQuellen(vorratStand().funde, ladeBildvorrat().length, themenStand().funde));
    let vorschlag: Partial<Record<W4, string>> = {};
    let woher: string = QUELLE_LABEL[quelle];
    let omniStil: Record<string, string> | null = null;
    let omniGew = "";
    if (quelle === "wiki") {
      const f = ziehVorrat();
      if (f) { vorschlag = f.ctx; woher = `Wiki · ${f.titel}`; } else vorschlag = worldFillContext();
    } else if (quelle === "abschrift") {
      const f = ziehBildvorrat();
      if (f) { vorschlag = f.ctx; woher = `Abschrift · ${f.name}`; } else vorschlag = worldFillContext();
    } else if (quelle === "thema") {
      const f = ziehThema();
      if (f) { vorschlag = f.ctx; woher = `Thema · ${f.themaLabel}`; } else vorschlag = worldFillContext();
    } else if (quelle === "omni") {
      // Die Wahrnehmung gibt die Stilregler mit vor; sie werden weiter unten
      // NACH dem allgemeinen Wurf gesetzt, sonst überschriebe er sie sofort.
      const ow = wuerfleVierW({ where: where.value, when: when.value, who: who.value, what: what.value },
        locked, "omni");
      vorschlag = ow.w4; woher = ow.quelle; omniStil = ow.regler || null; omniGew = ow.gewicht || "";
    } else if (quelle === "ideen") {
      // Der Reiter Ideen ist seit 4.297.0 eine Quelle wie die Welt. Der Einwand
      // dazu war berechtigt: Eine Prämisse trägt dieselben vier W, und der Weg
      // „→ Studio" übergibt seit jeher genau die.
      const iw = wuerfleVierW({ where: where.value, when: when.value, who: who.value, what: what.value },
        locked, "ideen");
      vorschlag = iw.w4; woher = iw.quelle;
    } else {
      vorschlag = worldFillContext();
    }
    // Die Regel steht in `uebernehmeKontext` und wird dort geprüft: Ein
    // gesperrtes Feld bleibt, ein leerer Vorschlag überschreibt nichts.
    const neu = uebernehmeKontext(felder, vorschlag, (id) => locked.has(id));
    const bewegt = geaenderteFelder(felder, neu);
    where.value = neu.where; when.value = neu.when; who.value = neu.who; what.value = neu.what;
    // Drei Fälle, drei Sätze. „Alle gesperrt" und „der Vorschlag stand schon
    // da" sehen gleich aus und sind es nicht — bei einem Vorrat mit einem
    // einzigen Fund passiert das Zweite dauernd.
    const alleZu = W4_FELDER.every((f) => locked.has(felder[f].id));
    wikiHint.textContent = bewegt.length ? `${woher}: ${bewegt.length} von 4 Feldern`
      : alleZu ? "alle vier Felder sind gesperrt"
      : `${woher}: nichts Neues dabei`;
    wikiTitel(); abschriftTitel(); themaTitel();
    letzteQuelle = woher;
    updHints(); ctxSichern();
    rollAlle();
    // Erst jetzt: Was die Wahrnehmung vorgibt, steht über dem allgemeinen Wurf.
    if (omniStil) {
      const setzeStil = (el: HTMLSelectElement, v: string | undefined): void => {
        if (!v || locked.has(el.id)) return;
        if (!Array.from(el.options).some((o) => o.value === v)) return;
        el.value = v; studioReglerStand[el.id] = v;
      };
      setzeStil(form, omniStil["form"]); setzeStil(structure, omniStil["structure"]);
      setzeStil(persp, omniStil["perspective"]); setzeStil(rhythm, omniStil["rhythm"]);
      setzeStil(varianz, omniStil["varLevel"]); setzeStil(mode, omniStil["mode"]);
      setzeStil(tone, omniStil["tone"]); setzeStil(markov, omniStil["markovMode"]);
      setzeStil(archA, omniStil["archetypeA"]); setzeStil(archB, omniStil["archetypeB"]);
      if (omniGew) {
        const g = omniGew.split("/");
        [wWo, wWann, wWer, wWas].forEach((sl, i) => {
          if (locked.has(sl.id) || g[i] === undefined) return;
          sl.value = g[i]!; sl.dispatchEvent(new Event("input"));
        });
      }
    }
    renderPresetChecks();
    generate();
    anlageSichern();
  });

  const wikiBtn = el("button", {}, icon("book"), " Wiki");
  const wikiHint = el("span", { class: "ctxhint" });
  const wikiTitel = (): void => {
    const st = vorratStand();
    wikiBtn.title = st.funde
      ? `Zufälliger Fund aus dem Sammler-Vorrat (${st.funde} Funde aus ${st.tage} ${st.tage === 1 ? "Tag" : "Tagen"}) — ohne Netz`
      : "Der Sammler-Vorrat ist leer — im Reiter „Sammler“ einen Tag holen";
  };
  wikiTitel();
  wikiBtn.addEventListener("click", () => {
    const f: VorratFund | null = ziehVorrat();
    if (!f) {
      wikiHint.textContent = "Vorrat leer — im Reiter „Sammler“ einen Tag holen";
      return;
    }
    // Leere Werte eines Fundes lassen das Feld stehen: Der Sammler füllt nur,
    // was er aus den Strukturdaten sicher bestimmen konnte.
    const setz = (inp: HTMLInputElement, v: string): void => { if (v && !locked.has(inp.id)) inp.value = v; };
    setz(where, f.ctx.where); setz(when, f.ctx.when); setz(who, f.ctx.who); setz(what, f.ctx.what);
    wikiHint.textContent = `${f.quelleLabel}: ${f.titel}`;
    updHints(); ctxSichern(); wikiTitel();
  });
  // Abschrift-Taste: derselbe Griff wie „Wiki", nur aus dem BILDvorrat. Zwei
  // Ablagen und nicht eine, weil das Material verschieden ist — der Feed der
  // Wikipedia gibt Ereignisse, ein Foto gibt Dinge und Orte. In einem Topf
  // zoege man mal das eine und mal das andere, ohne zu wissen, was kommt.
  // Greift ebenfalls NICHT ins Netz: Was der Bildsammler abgelegt hat, ist da.
  // Themen-Taste: derselbe Griff wie „Wiki" und „Abschrift", nur aus dem
  // Themenpool des Sammlers — Personen und ihre Werke, aus Wikidata geholt.
  // Greift ebenfalls NICHT ins Netz: Was im Pool liegt, ist da.
  const themaBtn = el("button", {}, icon("book"), " Thema");
  const themaTitel = (): void => {
    const st = themenStand();
    themaBtn.title = st.funde
      ? `Zufälliger Fund aus dem Themenpool (${st.funde} Funde aus ${st.themen} ${st.themen === 1 ? "Thema" : "Themen"}) — ohne Netz`
      : "Der Themenpool ist leer — im Reiter „Sammler“ unter „Themenpool“ ein Thema holen";
  };
  themaTitel();
  themaBtn.addEventListener("click", () => {
    const f = ziehThema();
    if (!f) {
      wikiHint.textContent = "Themenpool leer — im Reiter „Sammler“ unter „Themenpool“ ein Thema holen";
      return;
    }
    const setz = (inp: HTMLInputElement, v: string): void => { if (v && !locked.has(inp.id)) inp.value = v; };
    setz(where, f.ctx.where); setz(when, f.ctx.when); setz(who, f.ctx.who); setz(what, f.ctx.what);
    wikiHint.textContent = `${f.themaLabel}: ${f.titel}`;
    updHints(); ctxSichern(); themaTitel();
  });

  const abschriftBtn = el("button", {}, icon("book"), " Abschrift");
  const abschriftTitel = (): void => {
    const n = ladeBildvorrat().length;
    abschriftBtn.title = n
      ? `Zufälliger Fund aus dem Bildvorrat (${n} ${n === 1 ? "Fund" : "Funde"}) — ohne Netz`
      : "Der Bildvorrat ist leer — im Reiter \u201eSammler\u201c unter \u201eBilder als Material\u201c Funde in den Vorrat legen";
  };
  abschriftTitel();
  abschriftBtn.addEventListener("click", () => {
    const f: BildFund | null = ziehBildvorrat();
    if (!f) {
      wikiHint.textContent = "Bildvorrat leer \u2014 im Reiter \u201eSammler\u201c Bilder lesen und in den Vorrat legen";
      return;
    }
    const setz = (inp: HTMLInputElement, v: string): void => { if (v && !locked.has(inp.id)) inp.value = v; };
    setz(where, f.ctx.where); setz(when, f.ctx.when); setz(who, f.ctx.who); setz(what, f.ctx.what);
    wikiHint.textContent = `Abschrift: ${f.name}`;
    updHints(); ctxSichern(); abschriftTitel();
  });

  const ctxKeep = el("button", { class: "toggle" }, icon("pin"), " Kontext merken");
  const CTX_KEY = "divergenz_ctx_v1";
  ctxKeep.title = "Wo/Wann/Wer/Was sichern und bei jedem Start laden";
  const setCtxKeep = (on: boolean): void => {
    ctxKeep.classList.toggle("on", on);
    ctxKeep.setAttribute("aria-pressed", String(on));
    try { if (on) localStorage.setItem(CTX_KEY, JSON.stringify({ where: where.value, when: when.value, who: who.value, what: what.value })); else localStorage.removeItem(CTX_KEY); } catch { /* voll */ }
  };
  ctxKeep.addEventListener("click", () => setCtxKeep(!ctxKeep.classList.contains("on")));
  // Der Schalter hat den Kontext bisher nur im Moment des Klicks gesichert. Wer ihn
  // früh einschaltet und die Felder danach ändert, bekam beim nächsten Aufbau die
  // alte Momentaufnahme zurück — genau der scheinbare Reset auf „London / Tom“.
  const ctxSichern = (): void => {
    if (!ctxKeep.classList.contains("on")) return;
    try { localStorage.setItem(CTX_KEY, JSON.stringify({ where: where.value, when: when.value, who: who.value, what: what.value })); } catch { /* voll */ }
  };
  [where, when, who, what].forEach((f) => { f.addEventListener("input", ctxSichern); f.addEventListener("change", ctxSichern); });
  // Stärke-Regler (experimentell, nur Prosa): je 4W-Feld direkt darunter.
  const mkWeight = (id: string): HTMLInputElement => el("input", { id, class: "wgt", type: "range", min: "0", max: "3", step: "1", value: "0", title: "Stärke — mehr über dieses Feld" }) as HTMLInputElement;
  const wWo = mkWeight("f-w-wo"), wWann = mkWeight("f-w-wann"), wWer = mkWeight("f-w-wer"), wWas = mkWeight("f-w-was");
  // Live-Hinweis: zeigt, wie die Engine den Wert grammatisch einsetzt („→ im Hafen“)
  const hintWo = el("span", { class: "ctxhint" });
  const hintWann = el("span", { class: "ctxhint" });
  const hintWer = el("span", { class: "ctxhint" });
  const hintWas = el("span", { class: "ctxhint" });
  const updHints = (): void => {
    const h = (inp: HTMLInputElement, fn: (v: string) => string, out: HTMLElement): void => {
      const v = inp.value.trim(); const n = v ? fn(v) : "";
      out.textContent = v && n && n !== v ? "→ " + n : "";
    };
    h(where, normWhere, hintWo); h(when, normWhen, hintWann);
    // Wer: normalisierte Form UND die Rollenverteilung (erste Figur = Hauptfigur)
    {
      const v = who.value.trim();
      if (!v) hintWer.textContent = "";
      else {
        const n = normWho(v);
        const sp = splitSpeakers(n);
        const norm = n !== v ? "→ " + n + " · " : "";
        if (sp.length <= 1) hintWer.textContent = norm + "eine Figur — sie trägt die Handlung";
        else if (form.value === "script") hintWer.textContent = norm + `${sp.length} Sprecher: ${sp.join(", ")} — reihum im Dialog`;
        else hintWer.textContent = norm + `Hauptfigur: ${sp[0]} · Nebenfigur${sp.length > 2 ? "n" : ""}: ${sp.slice(1).join(", ")} — die Handlung aus „Was passiert?" gehört der Hauptfigur, die übrigen werden eingewoben`;
      }
    }
    // Was: zeigt, WIE die Engine den Wert einwebt (Satz / Handlung / Vorhaben / Ereignis)
    const a = what.value.trim();
    let wasScore = -1;
    if (!a) hintWas.textContent = "";
    else {
      const lead = extractLeadVerb(a);
      if (lead.isInfinitiveLed) { hintWas.textContent = "→ als Vorhaben eingewoben („will " + lead.rest + "“)"; wasScore = 0.9; }
      else if (lead.verb) { hintWas.textContent = "→ als Handlung eingewoben (Verb: " + lead.verb + ")"; wasScore = 1; }
      else if (looksLikeFullClause(lead.verb, lead.rest)) { hintWas.textContent = "→ als eigener Satz eingewoben"; wasScore = 1; }
      else { hintWas.textContent = "→ als Ereignis-Phrase eingewoben"; wasScore = a.length >= 4 ? 0.7 : 0.4; }
    }
    // Farbcode: Feldhintergrund rot→grün je nach Einsetzbarkeit
    const tint = (inp: HTMLInputElement, score: number): void => {
      if (score < 0) { inp.style.backgroundColor = ""; return; }
      const hue = Math.round(120 * Math.max(0, Math.min(1, score)));
      inp.style.backgroundColor = `hsl(${hue} 65% 42% / 0.20)`;
    };
    tint(where, rateWhere(where.value)); tint(when, rateWhen(when.value)); tint(who, rateWho(who.value)); tint(what, wasScore);
  };
  [where, when, who, what].forEach((i) => i.addEventListener("input", updHints));
  const field4w = (label: string, inp: HTMLInputElement, weight: HTMLInputElement, hint?: HTMLElement): HTMLElement =>
    el("label", { class: "field" },
      el("span", { class: "field-label lockrow" }, el("span", {}, label), lockBtn(inp)),
      el("div", { class: "field4w" }, clearable(inp), weight),
      ...(hint ? [hint] : []));
  // Bauplan F: Die Umwelt als fuenfte Angabe. Sie beschreibt nicht den Text,
  // sondern das, woran er sich messen lassen muss - deshalb steht sie hier und
  // nicht im Werkzeugkasten: Man tippt sie zusammen mit den vier W.
  const gespeicherteUmwelt = loadUmwelt();
  const umweltIn = el("input", { id: "f-umwelt", type: "text",
    placeholder: "Frost, 7Z-49, ∅, Verwaltung — mit Komma getrennt",
    value: gespeicherteUmwelt.zeichen }) as HTMLInputElement;
  const umweltSel = el("select", { id: "f-umwelt-wirkung", title: "Wie die Zeichen auf die Auswahl wirken" }) as HTMLSelectElement;
  ([["aus", "aus"], ["nahrung", "Nahrung — aufnehmen"], ["gift", "Gift — meiden"]] as [UmweltWirkung, string][])
    .forEach(([v, t]) => umweltSel.append(el("option", { value: v }, t)));
  umweltSel.value = gespeicherteUmwelt.wirkung;
  const umweltHint = el("span", { class: "ctxhint" });
  const umweltZeigen = (): void => {
    const n = umweltTeile(umweltIn.value).length;
    umweltHint.textContent = umweltSel.value === "aus" || !n ? ""
      : `→ ${n} ${n === 1 ? "Zeichen wirkt" : "Zeichen wirken"} auf die Bestenauslese`;
  };
  const umweltSichern = (): void => {
    saveUmwelt({ zeichen: umweltIn.value, wirkung: umweltSel.value as UmweltWirkung });
    umweltZeigen();
    umweltLegZeigen();
  };
  umweltIn.addEventListener("input", umweltSichern);
  umweltSel.addEventListener("change", () => { umweltSichern(); generate(); });
  umweltZeigen();

  wrap.append(el("div", { class: "grid2" },
    field4w("Wo?", where, wWo, hintWo), field4w("Wann?", when, wWann, hintWann), field4w("Wer?", who, wWer, hintWer), field4w("Was passiert?", what, wWas, hintWas)),
    el("label", { class: "field" },
      el("span", { class: "field-label lockrow" },
        el("span", { class: "hilfe", title: "Begriffe, Wörter, Zahlenkombinationen oder Zeichen. Sie erzeugen keinen Text — sie richten die Auswahl: Nahrung bevorzugt Fassungen, die sie aufnehmen, Gift bevorzugt Fassungen, die sie meiden. Wirkt nur bei eingeschalteter Bestenauslese." }, "Umwelt"),
        umweltSel),
      umweltIn, umweltHint),
    el("div", { class: "btnrow" }, ctxDice, alleBtn, wikiBtn, abschriftBtn, themaBtn, ctxKeep, wikiHint));

  const lockBar = el("div", { class: "lockbar" });
  const preset = select("f-preset", markedPresetOptions());
  const MULTI_ID = "__multi__";
  const MULTI_KEY = "dm_multi_presets_v1";
  const saveMulti = (): void => { try { if (multiIds.length >= 2) localStorage.setItem(MULTI_KEY, JSON.stringify(multiIds)); else localStorage.removeItem(MULTI_KEY); } catch { /* voll */ } };
  const loadMulti = (): string[] => { try { const r = localStorage.getItem(MULTI_KEY); const a = r ? JSON.parse(r) : []; return Array.isArray(a) ? a.filter((x) => typeof x === "string") : []; } catch { return []; } };
  let multiIds: string[] = loadMulti();
  preset.addEventListener("change", () => {
    if (preset.value === MULTI_ID) { if (multiIds.length >= 2) applyMulti(); return; }
    if (multiIds.length) { multiIds = []; saveMulti(); }
    if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); setDramaData(null); return; }
    const p = getAllPresets()[preset.value];
    if (!p) return;
    saveBank(p.bank); saveActiveBankLabel(p.label || preset.value);
    const a2 = preset.value.startsWith("user:") ? getUserPreset2(preset.value.slice(5)) : null;
    // Eingebaute Presets bringen ihre Dramaturgie jetzt selbst mit — fest im
    // Programm statt per KI erzeugt. Ohne sie fiel der Dramaturgie-Bauweg
    // wortlos auf den gewoehnlichen zurueck.
    if (!a2) { setDramaData(builtinDrama(preset.value)); updRekHint(); return; }
    if (a2) {
      setDramaData(a2.drama);
      const setV = (sel: HTMLSelectElement, v?: string): void => { if (v && Array.from(sel.options).some((o) => o.value === v)) sel.value = v; };
      const st = a2.settings;
      setV(tone, st.tone); setV(form, st.form); setV(structure, st.structure); setV(disruptor, st.disruptor); setV(instab, st.instability);
    }
    updRekHint();
  });

  // ── Preset-Auswahl: eins ODER mehrere ankreuzen (steuert das versteckte Select) ──
  const stripIcon = (l: string): string => l.replace(/^[^\p{L}\p{N}]+/u, "").replace(/\s*✦2\.0$/, "").trim();
  const applyMulti = (): void => {
    if (multiIds.length < 2) return;
    saveBank(buildMergedBank(multiIds));
    const labels = multiIds.map((id) => stripIcon(getAllPresets()[id]?.label || id));
    saveActiveBankLabel("Mix: " + labels.join(" + "));
    // Die Erzaehlboegen der gewaehlten Presets zusammenfuehren, statt sie zu
    // verwerfen. Vorher stand hier setDramaData(null) - bei jeder Mehrfachauswahl
    // war der Bogen also weg, und genau so arbeitet dieses Studio meistens.
    const boegen = multiIds.map((id) => builtinDrama(id)).filter(Boolean);
    if (!boegen.length) { setDramaData(null); return; }
    const misch = (feld: keyof NonNullable<ReturnType<typeof builtinDrama>>): string[] => {
      const raus: string[] = [];
      for (const b of boegen) for (const t of (b![feld] as string[]) || []) if (!raus.includes(t)) raus.push(t);
      return raus;
    };
    setDramaData({
      einstieg: misch("einstieg"), mitte: misch("mitte"), hoehepunkt: misch("hoehepunkt"),
      schluss: misch("schluss"), ausloeser: misch("ausloeser"), veraenderungen: misch("veraenderungen"),
      konflikte: misch("konflikte"), zeitanomalien: misch("zeitanomalien"), regeln: misch("regeln"),
    });
  };
  const ensureMultiOption = (): void => {
    let o = preset.querySelector('option[value="' + MULTI_ID + '"]') as HTMLOptionElement | null;
    if (!o) { o = document.createElement("option"); o.value = MULTI_ID; preset.insertBefore(o, preset.firstChild); }
    // Namen statt blosser Anzahl - "Mehrere (2)" sagt nicht, welche zwei.
    const nm = multiIds.map((id) => stripIcon(getAllPresets()[id]?.label || id));
    o.textContent = nm.length <= 3 ? nm.join(" + ") : nm.slice(0, 3).join(" + ") + ` +${nm.length - 3}`;
  };
  preset.style.display = "none"; // verstecktes Zustands-Element; die Checkbox-Liste steuert es
  const presetList = el("div", { class: "mplist", id: "presets" });
  const presetStatus = el("span", { class: "muted mini" });
  const autoMixStudioBtn = el("button", { class: "automixbtn", type: "button", title: "Pro Kategorie ein zufälliges Preset zusammenwürfeln" }, icon("dice"), " Auto-Mix würfeln");
  autoMixStudioBtn.addEventListener("click", () => {
    multiIds = []; saveMulti();
    preset.value = AUTOMIX_ID; preset.dispatchEvent(new Event("change"));
    // Beim Aufbau die Dramaturgie des gewaehlten Presets herstellen. Bisher geschah das
  // NUR im change-Handler - wer die App oeffnete und sofort generierte, baute ohne
  // Erzaehlbogen, obwohl das Preset einen mitbringt.
  if (!preset.value.startsWith("user:") && preset.value !== AUTOMIX_ID && preset.value !== MULTI_ID) {
    setDramaData(builtinDrama(preset.value));
  }
  renderPresetChecks();
  updHints();
  requestAnimationFrame(positionArrows);
  });
  const renderPresetChecks = (ziel: HTMLElement = presetList): void => {
    ziel.innerHTML = "";
    const selected = new Set<string>(preset.value === MULTI_ID ? multiIds : [preset.value]);
    const boxes: HTMLInputElement[] = [];
    const CATL: Record<string, string> = { motifs: "Motive", hooks: "Hooks", props: "Requisiten", turns: "Wendungen", obstacles: "Hindernisse", stakes: "Einsätze", endings: "Enden" };
    const mixSrc = preset.value === AUTOMIX_ID ? lastAutoMixSources() : {};
    markedPresetOptions().filter(([v]) => v !== AUTOMIX_ID).forEach(([v, l]) => {
      const cb = el("input", { type: "checkbox" }) as HTMLInputElement;
      cb.checked = selected.has(v); cb.value = v;
      cb.addEventListener("change", () => {
        applySelection(boxes.filter((b) => b.checked).map((b) => b.value));
        // Der Aufklapper unter dem Chip ist eine zweite Ansicht derselben Auswahl -
        // ohne dies bliebe er nach dem Klick stehen und zeigte den alten Stand.
        if (ziel !== presetList) renderPresetChecks(ziel);
      });
      boxes.push(cb);
      const cats = mixSrc[v];
      const item = el("label", { class: "chk mpitem" + (cats ? " mixsrc" : "") }, cb, " " + l);
      if (cats) { item.title = "Auto-Mix-Quelle: " + cats.map((k) => CATL[k] || k).join(", "); item.append(el("span", { class: "mixsrc-badge" }, String(cats.length))); }
      ziel.append(item);
    });
    const curOpt = Array.from(preset.options).find((o) => o.value === preset.value);
    if (preset.value === MULTI_ID) {
      // Namen statt bloßer Anzahl — bei vielen Presets die ersten drei plus Rest
      const namen = multiIds.map((id) => stripIcon(getAllPresets()[id]?.label || id));
      const kurz = namen.length <= 3 ? namen.join(" + ") : namen.slice(0, 3).join(" + ") + ` + ${namen.length - 3} weitere`;
      presetStatus.textContent = `Aktiv: ${kurz}`;
      presetStatus.title = namen.join(" + ");
    } else if (preset.value === AUTOMIX_ID) {
      presetStatus.textContent = "Aktiv: Auto-Mix — Quellen schattiert"; presetStatus.title = "";
    } else {
      presetStatus.textContent = "Aktiv: " + (curOpt ? (curOpt.textContent || "—") : "—"); presetStatus.title = "";
    }
  };
  function applySelection(rawIds: string[]): void {
    const ids = rawIds.filter((v) => v !== MULTI_ID && v !== AUTOMIX_ID && v !== "__omni__");
    if (ids.length === 0) { renderPresetChecks(); return; }
    if (ids.length === 1) { multiIds = []; saveMulti(); preset.value = ids[0]!; preset.dispatchEvent(new Event("change")); renderPresetChecks(); return; }
    // `preset.value = ...` loest KEIN change-Ereignis aus — und daran haengt
    // das Sichern des Anlagenstands. Der Einzelfall-Zweig darueber wirft es
    // ausdruecklich (`dispatchEvent`), dieser hier tat es nicht: Bei einer
    // Mehrfachauswahl blieb im Schaltplan stehen, was zuletzt bei irgendeiner
    // ANDEREN Reglerbewegung gesichert worden war. Studio und Plan zeigten
    // deshalb verschiedene Presets, und zwar nicht bloss verschieden
    // geschrieben, sondern voellig andere.
    multiIds = ids; saveMulti(); applyMulti(); ensureMultiOption(); preset.value = MULTI_ID;
    renderPresetChecks(); anlageSichern(); liveRegen();
  }

  const tone = select("f-tone", TONE_OPTS, "mystery");
  const form = select("f-form", FORM_OPTS, "prose");
  const shots = el("input", { id: "f-shots", type: "number", value: "5", min: "3", max: "10" }) as HTMLInputElement;
  const secs = el("input", { id: "f-secs", type: "number", value: "15", min: "3", max: "600" }) as HTMLInputElement;
  const structure = select("f-structure", STRUCTURE_OPTS, "rekombination");
  const mode = select("f-mode", MODE_OPTS, "auto");
  const persp = select("f-persp", PERSP_OPTS, "auto");
  const rhythm = select("f-rhythm", RHYTHM_OPTS, "auto");
  const tension = select("f-tension", TENSION_OPTS, "off");
  const cast = select("f-cast", CAST_OPTS, "0.5");
  const instab = select("f-instab", INSTAB_OPTS, "2");
  const markov = select("f-markov", MARKOV_OPTS, "off");
  const disruptor = select("f-disruptor", DISRUPTOR_OPTS, "auto");
  // Zeitungsseite - nur fuer die Form "Bericht". "Auto" raet aus Wer/Was/Wo.
  const ressort = select("f-ressort", [["auto", "Auto (aus dem Stoff)"],
    ...RESSORT_IDS.map((id) => [id, RESSORTS[id].label] as [string, string])], "auto");
  const varianz = select("f-varianz", VARIANZ_OPTS, "mid");
    const archA = select("f-archa", ARCH_OPTS, "neutral");
  const archB = select("f-archb", ARCH_OPTS, "neutral");
  // Alle würfelbaren Stil-Regler (Würfeln-Knopf UND Zufallsstart nutzen dieselbe Liste)
  const ROLL_SELECTS = [tone, form, structure, mode, persp, rhythm, tension, cast, instab, markov, disruptor, varianz, ressort, archA, archB, preset];
  const presetField = el("div", { class: "field presetfield" },
    el("span", { class: "field-label lockrow" }, el("span", {}, "Preset — eins oder mehrere ankreuzen"), presetStatus, lockBtn(preset)),
    preset,
    el("div", { class: "btnrow" }, autoMixStudioBtn),
    presetList);
  wrap.append(presetField);
  wrap.append(el("div", { class: "grid3" }, lockField("Ton", tone), lockField("Form", form)));


  const lenSlider = el("input", { id: "f-len", type: "range", min: "40", max: "300", step: "5", value: "110", style: "flex:1" }) as HTMLInputElement;
  const lenVal = el("span", { class: "muted" }, "110");
  let lenTimer: ReturnType<typeof setTimeout> | undefined;
  let baseText = "";
  let rolling = false;  // true während "Würfeln" alle Selects ändert (verhindert Mehrfach-Generierung)
  const applyLengthLive = (): void => {
    const target = parseInt(lenSlider.value, 10);
    const form = readInput().form;
    if (form === "prose") {
      const src = baseText.trim() ? baseText : (out.textContent || "");
      if (!src.trim()) { generate(); return; }
      out.textContent = enforceWordTarget(src, target, loadBank(), markov.value !== "off" ? buildModelFromCorpus(2) : undefined);
      nachTextwechsel();
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      refreshFeeds();
    } else if (form === "script" || form === "bericht" || form === "meldung") {
      // Beide bauen ihre Laenge beim Erzeugen, nicht nachtraeglich: Ein Bericht
      // laesst sich nicht kuerzen, ohne Fakten zu verlieren.
      generate();
    }
    // Vers-/Videoformen: Textlänge ohne Wirkung
  };
  lenSlider.addEventListener("input", () => {
    lenVal.textContent = lenSlider.value;
    clearTimeout(lenTimer);
    lenTimer = setTimeout(applyLengthLive, 180);
  });
  const lenRow = el("div", { class: "field lenrow" }, el("span", { class: "mlabel lockrow" }, el("span", {}, "Textlänge"), lockBtn(lenSlider)), lenSlider, " ", lenVal);

  // Schriftart + Schriftgröße der Ausgabe (neben der Textlänge)
  const fontSel = el("select", { id: "f-font" },
    ...([["serif","Serif"],["classic","Times"],["sans","Sans"],["mono","Mono"]] as [string,string][])
      .map(([v,l]) => el("option", { value: v }, l))) as HTMLSelectElement;
  const sizeSlider = el("input", { id: "f-fontsize", type: "range", min: "14", max: "32", step: "0.5", value: String(loadFontSize()) }) as HTMLInputElement;
  const sizeVal = el("span", { class: "muted" }, String(loadFontSize()));
  fontSel.value = loadFont();
  const applyFont = (): void => { applyStoryFont(out, fontSel.value, parseFloat(sizeSlider.value)); sizeVal.textContent = sizeSlider.value; saveFontPrefs(fontSel.value, parseFloat(sizeSlider.value)); };
  fontSel.addEventListener("change", applyFont);
  sizeSlider.addEventListener("input", applyFont);
  const fontRow = el("label", { class: "field lenrow fontrow" }, el("span", { class: "mlabel" }, "Schrift"), " ", fontSel, " ", el("span", { class: "mlabel" }, "Größe"), " ", sizeSlider, " ", sizeVal);

  const out = el("pre", { id: "f-out", class: "out" });
  // Neue Variante per Pfeil (PC) oder Wischen links/rechts (Handy)
  const genArrows: HTMLButtonElement[] = [];
  const mkGenArrow = (dir: "left" | "right"): HTMLButtonElement => {
    const b = el("button", { class: "genarrow " + dir, type: "button", title: "Neue Variante generieren", "aria-label": "Neue Variante generieren" }, dir === "left" ? "‹" : "›") as HTMLButtonElement;
    // pointerdown statt click: löst sofort aus, auch wenn sich das Layout danach ändert
    b.addEventListener("pointerdown", (e) => { e.preventDefault(); generate(); });
    genArrows.push(b);
    return b;
  };
  // Ziehgriff am unteren Rand: Das Textfenster laesst sich nach unten oder oben
  // ziehen, und die Ziellaenge folgt der Geste. Auf dem Handy ist der Weg zum
  // Laengenregler weit oben unbequem - hier liegt er am Text selbst.
  const grip = el("div", { class: "lengrip", role: "slider", tabindex: "0",
    title: "Ziehen: Textlänge ändern · Doppelklick: Fensterhöhe zurücksetzen" });
  const gripVal = el("span", { class: "lengrip-val" });
  grip.append(gripVal);
  const PX_JE_SCHRITT = 6;                       // 6 px Ziehweg = ein Reglerschritt (5 Wörter)
  let zieht = false, startY = 0, startWert = 0, startHoehe = 0, geaendert = false;
  const zeigeWert = (v: number): void => { gripVal.textContent = v + " Wörter"; };
  grip.addEventListener("pointerdown", (e) => {
    const ev = e as PointerEvent;
    if (locked.has(lenSlider.id)) {
      gripVal.textContent = "Textlänge ist gesperrt";
      grip.classList.add("warn");
      setTimeout(() => { grip.classList.remove("warn"); gripVal.textContent = ""; }, 1600);
      return;
    }
    zieht = true; geaendert = false;
    startY = ev.clientY; startWert = parseInt(lenSlider.value, 10) || 110;
    startHoehe = out.getBoundingClientRect().height;
    grip.classList.add("zieht"); zeigeWert(startWert);
    grip.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  });
  grip.addEventListener("pointermove", (e) => {
    if (!zieht) return;
    const dy = (e as PointerEvent).clientY - startY;
    const schritt = parseInt(lenSlider.step, 10) || 10;
    const min = parseInt(lenSlider.min, 10), max = parseInt(lenSlider.max, 10);
    const roh = startWert + Math.round(dy / PX_JE_SCHRITT) * schritt;
    const neuW = Math.max(min, Math.min(max, roh));
    if (String(neuW) !== lenSlider.value) {
      lenSlider.value = String(neuW); lenVal.textContent = String(neuW); geaendert = true;
    }
    zeigeWert(neuW);
    // Das Fenster folgt der Geste, damit das Ziehen sich nach etwas anfuehlt.
    out.style.minHeight = Math.max(120, startHoehe + dy) + "px";
    positionArrows();
  });
  const gripEnde = (e: Event): void => {
    if (!zieht) return;
    zieht = false; grip.classList.remove("zieht");
    gripVal.textContent = "";
    try { grip.releasePointerCapture((e as PointerEvent).pointerId); } catch { /* egal */ }
    // Die waehrend der Geste gesetzte Hoehe wieder freigeben: Sonst bleibt sie
    // stehen, und bei kuerzerem Text klafft darunter eine wachsende Leerflaeche.
    // Das Fenster soll dem Text folgen, nicht dem Finger von vorhin.
    out.style.minHeight = "";
    positionArrows();
    if (geaendert) generate();
  };
  grip.addEventListener("pointerup", gripEnde);
  grip.addEventListener("pointercancel", gripEnde);
  grip.addEventListener("dblclick", () => { out.style.minHeight = ""; positionArrows(); });
  // Tastatur: Pfeile hoch/runter aendern die Laenge in Reglerschritten
  grip.addEventListener("keydown", (e) => {
    const ev = e as KeyboardEvent;
    if (ev.key !== "ArrowUp" && ev.key !== "ArrowDown") return;
    if (locked.has(lenSlider.id)) return;
    const schritt = parseInt(lenSlider.step, 10) || 10;
    const min = parseInt(lenSlider.min, 10), max = parseInt(lenSlider.max, 10);
    const v = Math.max(min, Math.min(max, (parseInt(lenSlider.value, 10) || 110) + (ev.key === "ArrowDown" ? schritt : -schritt)));
    lenSlider.value = String(v); lenVal.textContent = String(v); ev.preventDefault(); generate();
  });
  const outWrap = el("div", { class: "outwrap" }, mkGenArrow("left"), out, mkGenArrow("right"), grip);
  // Pfeile mittig im SICHTBAREN Ausschnitt des Textfensters halten — unabhängig
  // von der Inhaltshöhe (kein Springen beim Generieren).
  const positionArrows = (): void => {
    const r = outWrap.getBoundingClientRect();
    if (r.height <= 0) return;
    const visTop = Math.max(r.top, 0);
    const visBot = Math.min(r.bottom, window.innerHeight);
    let center = (visTop + visBot) / 2 - r.top;
    center = Math.max(40, Math.min(r.height - 40, center));
    for (const a of genArrows) a.style.top = center + "px";
  };
  window.addEventListener("scroll", positionArrows, { passive: true });
  window.addEventListener("resize", positionArrows);
  let swipeX = 0, swipeY = 0;
  out.addEventListener("touchstart", (e) => { const t = e.touches[0]; if (t) { swipeX = t.clientX; swipeY = t.clientY; } }, { passive: true });
  out.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0]; if (!t) return;
    const dx = t.clientX - swipeX, dy = t.clientY - swipeY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 2 * Math.abs(dy)) generate();
  }, { passive: true });
  const kling = el("div", { class: "kling" });

  // ── Einspeisungen färben: zeigt, welche Textteile aus welcher Quelle stammen ──
  const feedsChk = el("input", { type: "checkbox", id: "f-feeds" }) as HTMLInputElement;
  const legDot = (c: string, l: string): HTMLElement => el("span", { class: "feeditem" }, el("span", { class: "feeddot " + c }), " " + l);
  // Bauplan: zeigt bei der Struktur „Rekombination“, aus welchen Atomen der Text entstand
  const planChk = el("input", { type: "checkbox", id: "f-plan" }) as HTMLInputElement;
  const planBox = el("div", { class: "bauplan", style: "display:none" });
  const PHASE_LABEL: Record<string, string> = { exposition: "Eröffnung", verdichtung: "Verdichtung", umschlag: "Umschlag", schluss: "Schluss" };
  const KAT_LABEL: Record<string, string> = { motifs: "Motiv", hooks: "Haken", props: "Requisite", turns: "Wendung", obstacles: "Hindernis", stakes: "Einsatz", endings: "Ende" };
  const renderPlan = (): void => {
    const on = planChk.checked && structure.value === "rekombination";
    planBox.style.display = on ? "" : "none";
    if (!on) return;
    const tr = getTraceFor(out.textContent || "");
    planBox.innerHTML = "";
    if (!tr.length) { planBox.append(el("span", { class: "muted mini" }, "Noch kein Rekombinations-Text erzeugt.")); return; }
    // Kennzahlen: Fügeteil-Anteil (Deckel 25 %) und verschlucktes Material
    const anteil = Math.round(fuegeteilAnteil() * 100);
    // Sätze im Text, die zu keinem Baustein gehören (Ton-Einschübe, Nachbearbeitung)
    const norm = (t: string): string => t.toLowerCase().replace(/[^a-zäöüß ]/g, " ").replace(/\s+/g, " ").trim();
    const bausteine = tr.map((x) => norm(x.text)).filter(Boolean);
    const fremd = (out.textContent || "").split(/(?<=[.!?…])\s+/)
      .map((x) => norm(x)).filter((x) => x.split(" ").length >= 3)
      .filter((satz) => !bausteine.some((b) => b.includes(satz.slice(0, 24)) || satz.includes(b.slice(0, 24))));
    planBox.append(el("div", { class: "muted mini bp-kopf" },
      `${tr.length} Bausteine · ${anteil} % Fügeteile${anteil > 25 ? " ⚠" : ""}` +
      (fremd.length ? ` · ${fremd.length} Satz/Sätze aus der Nachbearbeitung (Ton, Glättung)` : "")));
    let letztePhase = "";
    for (const s of tr) {
      if (s.phase !== letztePhase) {
        planBox.append(el("div", { class: "bp-phase ph-" + s.phase }, PHASE_LABEL[s.phase] || s.phase));
        letztePhase = s.phase;
      }
      const herkunft = s.quelle === "vorlage" ? "Fügeteil · " + s.typ : (KAT_LABEL[s.kategorie] || s.kategorie);
      const row = el("div", { class: "bp-zeile q-" + s.quelle },
        el("span", { class: "bp-tag" }, herkunft),
        el("span", { class: "bp-text" }, s.text));
      if (s.fueller) for (const f of s.fueller) row.append(el("span", { class: "bp-fill" }, "↳ " + (KAT_LABEL[f.kategorie] || f.kategorie) + ": " + f.text));
      planBox.append(row);
    }
  };
  planChk.addEventListener("change", renderPlan);

  // Textstruktur direkt unter dem Text: woraus besteht er, mit welchen Einstellungen?
  const struktChk = el("input", { type: "checkbox", id: "f-struktur" }) as HTMLInputElement;
  // Vorrats-Hinweis: Die Rekombination baut aus typisierten Bausteinen, und jeder
  // Satz darf nur einmal vorkommen. Reicht das Material nicht fuer die Ziellaenge,
  // wurde der Text bisher stillschweigend kuerzer - das sieht nach einem Fehler aus,
  // ist aber eine Materialgrenze. Also benennen.
  const vorratHint = el("p", { class: "muted mini", style: "display:none" });
  const updVorrat = (): void => {
    const txt = out.textContent || "";
    const ziel = parseInt(lenSlider.value, 10) || 0;
    const ist = txt.split(/\s+/).filter(Boolean).length;
    const knapp = structure.value === "rekombination" && ziel > 0 && ist > 0 && ist / ziel < 0.85;
    vorratHint.style.display = knapp ? "" : "none";
    if (knapp) vorratHint.textContent = `${ist} statt ${ziel} Wörtern: Der Baustein-Vorrat des gewählten Presets ist erschöpft. `
      + `Die Rekombination lässt jeden Satz nur einmal zu — für längere Texte mehrere Presets aktivieren oder Auto-Mix wählen.`;
  };
  const struktBox = el("div", { class: "struktur-inline", style: "display:none" });
  const renderStruktur = (): void => {
    if (!struktChk.checked) { struktBox.style.display = "none"; return; }
    struktBox.style.display = "";
    struktBox.innerHTML = "";
    quelleHint.style.display = "none";
    const snap = loadSchnappschuss();
    struktBox.append(renderTextstruktur(out.textContent || "", snap, {
      Preset: preset, Ton: tone, Form: form, Struktur: structure, Perspektive: persp,
      Rhythmus: rhythm, Markov: markov, Varianz: varianz, Spannung: tension,
      // Stellschrauben in der Schnellwahl: die vier, deren Wirkung man beim Lesen
      // sofort merkt, plus die Korpus-Menge. Fuegeteil-Deckel, 4W-Deckel und
      // Nachlege-Abstand bleiben im Werkzeugkasten - sie wirken auf den Bau,
      // nicht auf den Klang.
      ...(knobSel.satzlaenge ? { "Satzlänge": knobSel.satzlaenge } : {}),
      ...(knobSel.bogen ? { "Erzählbogen": knobSel.bogen } : {}),
      ...(knobSel.ton ? { "Ton-Einschübe": knobSel.ton } : {}),
      ...(knobSel.korpus ? { "Korpus-Bausteine": knobSel.korpus } : {}),
      ...(knobSel.phrase ? { "Phrasensperre": knobSel.phrase } : {}),
    }, (host) => renderPresetChecks(host), (sel) => lockBtn(sel)));
    struktBox.append(quelleHint, zielHint);
    try {
      const hh = analysiereHerkunft(out.textContent || "", (snap?.tonId || snap?.ton || "neutral").toLowerCase(),
        { where: snap?.where, when: snap?.when, who: snap?.who, what: snap?.what });
      regelschritt({ vorlage: hh.anteile.vorlage, dramaturgie: hh.anteile.dramaturgie,
        ton: hh.anteile.ton, kontext: hh.anteile.kontext });
    } catch { /* egal */ }
  };
  struktChk.addEventListener("change", renderStruktur);
  /** Nach jeder Textaenderung, die nicht aus generate() kommt: Struktur und
   *  Vorrats-Hinweis nachziehen. Beide hingen bisher allein an generate(), sodass
   *  nach Passagen-Austausch, Rueckgaengig, Variante oder einer Uebernahme aus dem
   *  Ranking die Balken noch den vorigen Text beschrieben. */
  const nachTextwechsel = (): void => { renderStruktur(); updVorrat(); };

  // ── Klick auf einen Balken der Textstruktur (A.2) ──────────────────────
  // Jeder Balken fuehrt zu dem Bedienelement, das ihn steuert - oder sagt, warum
  // es keines gibt. Eine Anzeige, die auf einen wirkungslosen Regler zeigt, waere
  // schlimmer als gar kein Ziel.
  const quelleHint = el("p", { class: "muted mini", style: "display:none" });
  const zeigeHinweis = (txt: string): void => {
    quelleHint.textContent = txt; quelleHint.style.display = "";
  };
  const springZu = (id: string, txt: string): void => {
    const n = document.getElementById(id);
    if (!n) { zeigeHinweis(txt); return; }
    fine.open = true;                                  // Werkzeugkasten aufklappen
    n.scrollIntoView({ behavior: "smooth", block: "center" });
    n.classList.add("hervor");
    setTimeout(() => n.classList.remove("hervor"), 1800);
    zeigeHinweis(txt);
  };
  // A.3: Nach jeder Erzeugung einen Regelschritt in Richtung Ziel. Bewusst nur EIN
  // Schritt je Lauf und mit Totband - eine Regelung, die in einem Zug ans Ziel
  // springt, schwingt und macht den Text unruhig.
  const zielHint = el("p", { class: "muted mini", style: "display:none" });
  const regelschritt = (anteile: Partial<Record<ZielQuelle, number>>): void => {
    const z = loadZiele();
    const offen = (Object.keys(z) as ZielQuelle[]).filter((q) => z[q] !== undefined);
    if (!offen.length) { zielHint.style.display = "none"; return; }
    // Gesperrte Stellschrauben ruehrt die Regelung nicht an - ein Schloss, das
    // eine selbsttaetige Regelung nicht aufhaelt, ist keines.
    const r = regle(anteile, (feld) => locked.has("k-" + feld));
    const teile = offen.map((q) => {
      const ist = Math.round((anteile[q] ?? 0) * 100);
      const marke = r.fest.includes(q) ? " — nicht erreichbar" : "";
      return `${QUELLEN_LABEL[q]} ${ist} % (Ziel ${z[q]} %${marke})`;
    });
    zielHint.style.display = "";
    zielHint.textContent = (r.bewegt ? "Nachgeregelt, wirkt beim nächsten Erzeugen: "
      : r.fest.length ? "Diese Stellschraube trifft das Ziel nicht — nächstmöglicher Wert: "
      : "Ziel erreicht: ") + teile.join(" · ");
    // Reglerstellungen in der Oberfläche nachziehen
    const k = loadKnobs();
    for (const f of ["fuegeteil", "w4max", "abstand", "bogen", "ton"] as (keyof Knobs)[]) {
      const r = document.getElementById("k-" + f) as HTMLSelectElement | null;
      if (r && r.value !== String(k[f])) { r.value = String(k[f]); r.dispatchEvent(new Event("input")); }
    }
  };
  // Schnellwahl an den Chips: Einstellung ändern und sofort neu erzeugen.
  // Nur noch die Ankreuzliste nachziehen: Das Erzeugen besorgt seit dieser
  // Fassung der change-Horcher am Regler selbst. Beides zusammen erzeugte zwei
  // Texte je Klick - man sah den zweiten und hielt den ersten fuer verloren.
  document.addEventListener("dm-schnellwahl", () => { renderPresetChecks(); });
  document.addEventListener("dm-ziel", (e) => { vergissVerlauf((e as CustomEvent).detail?.quelle); renderStruktur(); });
  document.addEventListener("dm-quelle", (e) => {
    const q = (e as CustomEvent).detail as string;
    const rek = structure.value === "rekombination";
    switch (q) {
      case "vorlage":
        springZu("knob-fuegeteil", "„Vorlagen“ sind die Verbindungsstücke. Der Fügeteil-Deckel begrenzt ihren Anteil.");
        break;
      case "kontext":
        springZu("knob-w4max", "Der 4W-Anteil kommt aus Wo/Wann/Wer/Was — Stärke je Feld darüber, Wiederholung über den 4W-Deckel.");
        break;
      case "wortbank":
        springZu("presets", "Die Wortbank ist die Restgröße: alles, was die anderen Quellen nicht liefern. Steuerbar nur über die Preset-Auswahl.");
        break;
      case "ton":
        springZu("f-tone", "Der Ton-Anteil entsteht in der Nachbearbeitung. Die Auswahl bestimmt, welche Sätze eingeschoben werden.");
        break;
      case "dramaturgie":
        zeigeHinweis("Der Erzählbogen wird im Tab Wortbank bearbeitet, unter „Preset bearbeiten und sichern“. Jedes eingebaute Preset bringt einen mit.");
        break;
      case "nachbearbeitung":
        springZu("f-persp", "Nachbearbeitung ist eine Folge, kein Wunsch: Perspektive, Glättung und Verfugung. Man stellt sie nicht ein, man verursacht sie.");
        break;
      case "pools":
        zeigeHinweis(rek
          ? "Lebendige Pools sind im Rekombinationsmodus nicht angeschlossen — der Assembler führt sie nicht als Quelle. Der Regler im Ideen-Tab wirkt nur dort."
          : "Lebendige Pools füllen sich beim Merken und Generieren; im Schablonenweg mischen sie sich unter die Wortbank.");
        break;
      case "markov":
        springZu("f-markov", rek
          ? "Markov speist eigene Bausteine in die Rekombination ein — gefiltert auf Präsens, ohne fremde Figuren, nicht zu lang. Braucht einen gefüllten Korpus."
          : "Markov mischt sich in die Bausteine des Schablonenwegs. Bei leerem Korpus liefert er nichts, gleich wie der Regler steht.");
        break;
      default:
        zeigeHinweis("Für diesen Anteil gibt es keine eigene Stellschraube.");
    }
  });

  // Textstruktur direkt unter dem Text: woraus besteht er, mit welchen Einstellungen?

  // Selbsttest direkt im Studio — greifen alle Features? (Vollansicht im Diagnose-Tab)
  const undoBtn = el("button", { class: "undochip", type: "button", title: "Letzte Änderung rückgängig (Strg+Z)" }, "↩ Rückgängig") as HTMLButtonElement;
  undoBtn.disabled = true;
  // Erste Zeile: nur die Farblegende. Zweite Zeile: die drei Ansichten in der
  // Reihenfolge, in der man sie benutzt, jede mit Schloss - so bleiben sie beim
  // naechsten Start an, statt jedes Mal neu eingeschaltet werden zu muessen.
  const ansicht = (chk: HTMLInputElement, text: string): HTMLElement =>
    el("span", { class: "ansichtchk" }, el("label", { class: "chk" }, chk, " " + text), lockBtn(chk));
  // Legendeneintrag der Umwelt zeigt die eingestellte Wirkung an - eine Farbe
  // ohne Bedeutung waere nur ein weiterer Punkt in der Zeile.
  const umweltLeg = el("span", { class: "feeditem", style: "display:none" });
  // Der Wirkungsnachweis: Wie viel hat der Sieger aufgenommen - und haette ohne
  // die Umwelt ein anderer gewonnen? Ohne diese zweite Zahl sieht man nur, dass
  // Zeichen im Text stehen, nicht, ob die Umwelt daran beteiligt war.
  const umweltStatus = el("span", { class: "umweltchip", style: "display:none" });
  const zeigeUmweltEffekt = (e: { wirkung: string; quote: number; quoteOhne: number; gewechselt: boolean } | undefined): void => {
    umweltStatus.innerHTML = "";
    if (!e) { umweltStatus.style.display = "none"; return; }
    umweltStatus.style.display = "";
    umweltStatus.className = "umweltchip" + (e.wirkung === "gift" ? " gift" : "") + (e.gewechselt ? " gewechselt" : "");
    const pct = Math.round(e.quote * 100), pctOhne = Math.round(e.quoteOhne * 100);
    const bar = el("span", { class: "umweltbar" }); bar.append(el("i", { style: `width:${pct}%` }));
    // "gedreht" und "ohne Wirkung" musste erklaert werden - also taugten sie nicht.
    // Die Zeile soll ohne Mouseover verstaendlich sein: Hat die Umwelt entschieden
    // oder nur zugestimmt?
    umweltStatus.title = e.gewechselt
      ? `Unter den zwölf Fassungen hat eine andere gewonnen als ohne die Umwelt: Sie war nach den `
        + `übrigen Maßstäben schlechter, ging mit den Zeichen aber besser um. Ohne die Umwelt hätte `
        + `eine Fassung mit ${pctOhne} % gewonnen.`
      : `Die Umwelt war derselben Meinung wie der Rest der Bewertung — dieselbe Fassung hätte auch `
        + `ohne sie gewonnen. Eine hohe Quote allein beweist nichts: Was das Preset ohnehin dauernd `
        + `sagt, steht auch ohne Umwelt im Text.`;
    umweltStatus.append(el("span", {}, e.wirkung === "nahrung" ? "aufgenommen" : "gemieden"), bar,
      el("span", {}, e.wirkung === "nahrung" ? pct + " %" : (100 - pct) + " %"),
      el("span", { class: "muted" }, e.gewechselt ? "· Umwelt gab den Ausschlag" : "· hätte auch so gewonnen"));
  };
  const umweltLegZeigen = (): void => {
    const u = loadUmwelt();
    umweltLeg.innerHTML = "";
    if (u.wirkung === "aus" || !umweltTeile(u.zeichen).length) { umweltLeg.style.display = "none"; return; }
    umweltLeg.style.display = "";
    umweltLeg.append(el("span", { class: "feeddot " + (u.wirkung === "nahrung" ? "feed-nahrung" : "feed-gift") }),
      u.wirkung === "nahrung" ? "Umwelt (Nahrung)" : "Umwelt (Gift)");
  };
  const feedsRow = el("div", {},
    el("div", { class: "feedsrow" },
      legDot("feed-wb", "Wortbank"), legDot("feed-ton", "Ton"), legDot("feed-4w", "4W-Kontext"),
      legDot("feed-pool", "Lebendige Pools"), legDot("feed-markov", "Markov"),
      legDot("feed-drama", "Erzählbogen"), legDot("feed-korpus", "Korpus"),
      umweltLeg,
      el("span", { class: "muted" }, "· unmarkiert = Vorlagen · alles anklickbar")),
    el("div", { class: "feedsrow ansichtrow" },
      ansicht(feedsChk, "Editieren"), ansicht(struktChk, "Struktur"), ansicht(planChk, "Bauplan"), undoBtn, umweltStatus));
  umweltLegZeigen();

  interface FMatch { s: number; e: number; cls: string; prio: number; }
  const escFeeds = (t: string): string => t.replace(/[&<>]/g, (c) => (c === "&" ? "&amp;" : c === "<" ? "&lt;" : "&gt;"));
  const collectFeed = (phrases: string[], cls: string, prio: number, low: string, acc: FMatch[]): void => {
    for (const raw of phrases) {
      const ph = (raw || "").trim(); if (ph.length < 5) continue;
      const pl = ph.toLowerCase(); let from = 0, idx = low.indexOf(pl, from);
      while (idx !== -1) { acc.push({ s: idx, e: idx + pl.length, cls, prio }); from = idx + pl.length; if (acc.length > 4000) return; idx = low.indexOf(pl, from); }
    }
  };
  const renderFeeds = (): void => {
    const plain = out.textContent || "";
    if (!feedsChk.checked) { out.textContent = plain; return; }
    const low = plain.toLowerCase();
    const m: FMatch[] = [];
    if (tone.value !== "neutral") { const td = TONE_DATA[tone.value]; if (td) collectFeed([...td.opener, ...td.flavor], "feed-ton", 3, low, m); }
    collectFeed(w4Varianten({ who: who.value, where: where.value, when: when.value, what: what.value }),
      "feed-4w", 2, low, m);
    try { const b = loadBank() as unknown as Record<string, string[]>; const all: string[] = []; for (const k of Object.keys(b)) if (Array.isArray(b[k])) all.push(...b[k]!); collectFeed(all, "feed-wb", 1, low, m); } catch { /* egal */ }
    try { collectFeed(liveTexts(), "feed-pool", 1, low, m); } catch { /* egal */ }
    try { collectFeed(getMarkovTraceFor(plain), "feed-markov", 2, low, m); } catch { /* egal */ }
    // Erzaehlbogen: eigene Quelle, hoehere Prioritaet als die Wortbank - sonst
    // verschwindet er in ihr, wo Eintraege in beiden stehen.
    // Korpus-Bausteine: die Bauspur weiss, welche gesetzt wurden - genauer als
    // jeder Textabgleich gegen den ganzen Korpus.
    try {
      const kp = (getTraceFor(plain) || []).filter((x) => x.quelle === "korpus").map((x) => x.text);
      if (kp.length) collectFeed(kp, "feed-korpus", 3, low, m);
    } catch { /* egal */ }
    // Bauplan F: Die Umweltzeichen einfaerben - gruen, wenn sie aufgenommen werden
    // sollen, rot, wenn sie gemieden werden sollen. Eigener Sammler, weil
    // collectFeed alles unter fuenf Zeichen verwirft: "Tuer" und "∅" waeren sonst
    // unsichtbar, und gerade die kurzen Zeichen sind der Punkt.
    try {
      const u = loadUmwelt();
      if (u.wirkung !== "aus") {
        const cls = u.wirkung === "nahrung" ? "feed-nahrung" : "feed-gift";
        for (const teil of umweltTeile(u.zeichen)) {
          const pl = teil.toLowerCase(); if (!pl) continue;
          let from = 0, idx = low.indexOf(pl, from);
          while (idx !== -1 && m.length < 4000) { m.push({ s: idx, e: idx + pl.length, cls, prio: 9 }); from = idx + pl.length; idx = low.indexOf(pl, from); }
        }
      }
    } catch { /* egal */ }
    try {
      const dd = loadDramaData();
      if (dd) collectFeed([...dd.einstieg, ...dd.mitte, ...dd.hoehepunkt, ...dd.konflikte,
        ...dd.ausloeser, ...dd.veraenderungen, ...dd.zeitanomalien, ...dd.regeln], "feed-drama", 3, low, m);
    } catch { /* egal */ }
    m.sort((a, b) => a.s - b.s || (b.e - b.s) - (a.e - a.s) || b.prio - a.prio);
    // unmarkierte Lücke: als klick-/editierbaren feed-plain-Span ausgeben (Randweißraum bleibt außen)
    const emitPlain = (seg: string): string => {
      if (!seg) return "";
      if (!seg.trim()) return escFeeds(seg);
      const lead = (seg.match(/^\s*/) || [""])[0];
      const trail = (seg.match(/\s*$/) || [""])[0];
      const core = seg.slice(lead.length, seg.length - trail.length);
      return escFeeds(lead) + `<span class="feed-plain">` + escFeeds(core) + "</span>" + escFeeds(trail);
    };
    let html = "", i = 0, last = -1;
    for (const x of m) { if (x.s < last) continue; html += emitPlain(plain.slice(i, x.s)) + `<span class="${x.cls}">` + escFeeds(plain.slice(x.s, x.e)) + "</span>"; i = x.e; last = x.e; }
    html += emitPlain(plain.slice(i));
    out.innerHTML = html;
  };
  const refreshFeeds = (): void => { if (feedsChk.checked) renderFeeds(); };
  feedsChk.addEventListener("change", renderFeeds);

  // ── Passagen-Austausch: farbigen Span anklicken -> Alternativen aus demselben Pool ──
  const feedPop = el("div", { class: "feedpop", style: "display:none" });
  document.body.appendChild(feedPop);
  let popSpan: HTMLElement | null = null;
  const hidePop = (): void => { feedPop.style.display = "none"; popSpan = null; };
  document.addEventListener("click", (e) => { if (feedPop.style.display !== "none" && !feedPop.contains(e.target as Node) && (e.target as HTMLElement) !== popSpan) hidePop(); }, true);
  const persistEdit = (): void => { try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ } };

  // ── Undo-Verlauf fürs Editieren (letzte ~12 Textzustände) ──
  const undoStack: string[] = [];
  const updateUndoBtn = (): void => { undoBtn.disabled = undoStack.length === 0; };
  const pushUndo = (): void => { undoStack.push(out.textContent || ""); if (undoStack.length > 12) undoStack.shift(); updateUndoBtn(); };
  const clearUndo = (): void => { undoStack.length = 0; updateUndoBtn(); };
  const doUndo = (): void => { const prev = undoStack.pop(); if (prev === undefined) return; out.textContent = prev; persistEdit(); renderFeeds(); nachTextwechsel(); updateUndoBtn(); };
  undoBtn.addEventListener("click", doUndo);
  document.addEventListener("keydown", (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.shiftKey || e.key.toLowerCase() !== "z") return;
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return; // native Undo im Feld
    if (!undoStack.length) return;
    e.preventDefault(); doUndo();
  });

  // Kontext-Nähe: Jaccard über Wortstämme (5-Zeichen-Stämme), offline.
  const FEED_STOP = new Set(["und", "oder", "aber", "denn", "sondern", "sowie", "eine", "einen", "einem", "einer", "eines", "der", "die", "das", "den", "dem", "des", "mit", "von", "für", "auf", "aus", "ist", "sind", "war", "sich", "nicht", "auch", "wie", "als", "was", "wer", "wann", "über", "unter", "durch", "zwischen", "diese", "dieser", "dieses", "sein", "seine", "ihre", "ihrer", "immer", "schon", "noch", "dann", "aber", "wird", "wurde"]);
  const feedStems = (t: string): Set<string> => { const set = new Set<string>(); for (const w of (t.toLowerCase().match(/[a-zäöüß]{4,}/g) || [])) { if (FEED_STOP.has(w)) continue; set.add(w.slice(0, 5)); } return set; };
  const feedJac = (a: Set<string>, b: Set<string>): number => { if (!a.size || !b.size) return 0; let inter = 0; for (const x of a) if (b.has(x)) inter++; return inter / (a.size + b.size - inter); };

  const altsFor = (cls: string, cur: string): string[] => {
    const inText = (out.textContent || "").toLowerCase();
    const norm = (arr: string[]): string[] => [...new Set(arr.map((x) => (x || "").trim()).filter((a) => a.length >= 2 && a.toLowerCase() !== cur.toLowerCase() && !inText.includes(a.toLowerCase())))];
    let pool: string[] = [];
    try {
      if (cls === "feed-wb") { const b = loadBank() as unknown as Record<string, string[]>; let cat: string[] | null = null; for (const k of Object.keys(b)) if (Array.isArray(b[k]) && b[k]!.some((x) => x.toLowerCase() === cur.toLowerCase())) { cat = b[k]!; break; } pool = cat || Object.values(b).flat(); }
      else if (cls === "feed-pool") pool = liveTexts();
      else if (cls === "feed-korpus") { pool = (getTraceFor(out.textContent || "") || []).filter((x) => x.quelle === "korpus").map((x) => x.text); }
      else if (cls === "feed-drama") { const dd = loadDramaData(); pool = dd ? [...dd.einstieg, ...dd.mitte, ...dd.hoehepunkt, ...dd.konflikte, ...dd.ausloeser, ...dd.veraenderungen, ...dd.zeitanomalien, ...dd.regeln] : []; }
      else if (cls === "feed-ton") { const td = TONE_DATA[tone.value]; pool = td ? [...td.opener, ...td.flavor] : []; }
      else if (cls === "feed-4w") pool = [who.value, where.value, when.value, what.value];
      else if (cls === "feed-markov") { const model = buildModelFromCorpus(2); const n = Math.max(6, cur.split(/\s+/).filter(Boolean).length + 2); for (let i = 0; i < 12; i++) { const g = model.generate(n); if (g) pool.push(g); } }
    } catch { /* egal */ }
    const uniq = norm(pool);
    const ctxStems = feedStems((out.textContent || "").split(new RegExp(cur.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")).join(" "));
    const scored = uniq.map((t) => ({ t, sc: feedJac(feedStems(t), ctxStems) }));
    for (let i = scored.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [scored[i], scored[j]] = [scored[j]!, scored[i]!]; } // Zufalls-Tiebreak
    scored.sort((a, b) => b.sc - a.sc);                        // nach Kontextnähe
    const top = scored.slice(0, Math.min(12, scored.length));   // relevanteste behalten
    for (let i = top.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [top[i], top[j]] = [top[j]!, top[i]!]; } // „Neu“ variiert
    return top.slice(0, 6).map((x) => x.t);
  };
  // Steht die Passage am Satzanfang? (Textanfang oder direkt nach Satzzeichen)
  const atSentenceStart = (span: HTMLElement): boolean => {
    try {
      const range = document.createRange();
      range.setStart(out, 0);
      range.setEndBefore(span);
      const before = range.toString().replace(/\s+$/, "");
      if (!before) return true;
      return /[.!?…:][")»“”'\]]?$/.test(before);
    } catch { return false; }
  };
  // Ersten Buchstaben groß (auch hinter öffnendem Anführungszeichen/Klammer)
  const capFirst = (t: string): string => t.replace(/^(\s*["„«»'(\[]*\s*)?(\p{L})/u, (_m, pre: string | undefined, ch: string) => (pre || "") + ch.toLocaleUpperCase("de-DE"));
  const replaceSpan = (span: HTMLElement, txt: string): void => {
    pushUndo();
    const v = atSentenceStart(span) ? capFirst(txt) : txt;
    span.textContent = v; persistEdit(); renderFeeds(); nachTextwechsel(); hidePop();
  };
  const removeSpan = (span: HTMLElement): void => {
    pushUndo();
    span.textContent = "";
    const cleaned = (out.textContent || "").replace(/\s{2,}/g, " ").replace(/\s+([,.;:!?…])/g, "$1").replace(/([.!?…])(?:\s*\1)+/g, "$1").trim();
    out.textContent = cleaned; persistEdit(); renderFeeds(); nachTextwechsel(); hidePop();
  };
  const openPop = (span: HTMLElement): void => {
    popSpan = span;
    const cls = (span.className.match(/feed-[a-z0-9]+/) || ["feed-wb"])[0]!;
    const cur = span.textContent || "";
    const titles: Record<string, string> = { "feed-wb": "Wortbank", "feed-ton": "Ton", "feed-4w": "4W-Kontext", "feed-pool": "Lebendige Pools", "feed-markov": "Markov", "feed-drama": "Erzählbogen", "feed-korpus": "Korpus", "feed-plain": "Text" };
    feedPop.innerHTML = "";
    const closeX = el("button", { class: "feedpop-x", type: "button", title: "Schließen", "aria-label": "Schließen" }, "✕");
    closeX.addEventListener("click", hidePop);
    feedPop.append(closeX);
    feedPop.append(el("div", { class: "muted pophead" }, `„${cur.length > 44 ? cur.slice(0, 44) + "…" : cur}“ · ${titles[cls] || "Passage"}`));
    const del = el("button", { class: "danger" }, "✕ Entfernen"); del.addEventListener("click", () => removeSpan(span));
    if (cls === "feed-plain") {
      // unmarkierter Abschnitt: freie Textbearbeitung (z. B. fehlende Wörter einfügen)
      const ta = el("textarea", { class: "freeedit" }) as HTMLTextAreaElement;
      ta.value = cur;
      const freeBtn = button("Übernehmen");
      freeBtn.addEventListener("click", () => { const v = ta.value.replace(/\s+/g, " ").trim(); if (v) replaceSpan(span, v); else removeSpan(span); });
      feedPop.append(el("div", { class: "muted mini" }, "Text frei bearbeiten — fehlende Wörter einfügen oder umformulieren."), ta, el("div", { class: "row" }, del, freeBtn));
      setTimeout(() => { ta.focus(); const n = ta.value.length; ta.setSelectionRange(n, n); }, 0);
    } else {
      const altwrap = el("div", {});
      const fill = (): void => {
        altwrap.innerHTML = "";
        const alts = altsFor(cls, cur);
        if (!alts.length) altwrap.append(el("div", { class: "muted" }, "Keine Alternativen im Pool."));
        alts.forEach((a) => { const b = el("button", { class: "alt" }, a); b.addEventListener("click", () => replaceSpan(span, a)); altwrap.append(b); });
      };
      fill();
      const reroll = el("button", {}, icon("dice"), " Neu"); reroll.addEventListener("click", fill);
      // Grammatik/Text der Passage direkt anpassen (vorbefüllt) — ohne Neuschreiben/Ersetzen
      const edit = el("textarea", { class: "freeedit" }) as HTMLTextAreaElement; edit.value = cur;
      const editBtn = button("Übernehmen");
      editBtn.addEventListener("click", () => { const v = edit.value.replace(/\s+/g, " ").trim(); if (!v) { removeSpan(span); return; } if (v !== cur) replaceSpan(span, v); else hidePop(); });
      feedPop.append(altwrap, el("div", { class: "row" }, reroll, del), el("div", { class: "muted mini" }, "Oder Grammatik anpassen — Text der Passage direkt bearbeiten:"), edit, el("div", { class: "row" }, editBtn));
    }
    const r = span.getBoundingClientRect();
    feedPop.style.display = "";                    // erst einblenden, damit Maße messbar sind
    const pw = feedPop.offsetWidth || 330;
    const ph = feedPop.offsetHeight || 0;
    const vh = window.innerHeight, vw = window.innerWidth;
    feedPop.style.left = Math.min(vw - pw - 8, Math.max(8, r.left)) + "px";
    let top = r.bottom + 6;                         // bevorzugt unter der Stelle
    if (top + ph > vh - 8) {                        // passt unten nicht: über die Stelle klappen
      const above = r.top - ph - 6;
      top = above >= 8 ? above : Math.max(8, vh - ph - 8); // sonst an den unteren Rand klemmen
    }
    feedPop.style.top = top + "px";
  };
  out.addEventListener("click", (e) => {
    if (!feedsChk.checked) return;
    const t = (e.target as HTMLElement).closest('span[class^="feed-"]') as HTMLElement | null;
    if (!t) return;
    e.preventDefault(); e.stopPropagation(); openPop(t);
  });

  /** Die Reglerstellung als flache Tabelle — genau die Schlüssel, die die
   *  Übergabe `dm_pending_studio` beim nächsten Aufbau wieder einsetzen kann.
   *  Sie wandert mit jedem gemerkten Text in die Schatzkammer: Ohne sie ist
   *  nicht nachvollziehbar, welche Einstellung einen Treffer erzeugt hat. */
  /** Die tatsaechlich aktiven Presets als IDs.
   *
   *  `preset.value` ist NICHT die Antwort: Bei Mehrfachauswahl steht dort
   *  „__multi__", beim Auto-Mix „__automix__". Der Schaltplan bekam genau
   *  diesen Rohwert und zeigte ihn an — waehrend im Studio daneben „Aktiv:
   *  Bergwelt + Formalismus + Griechische Tragoedie" stand. Zwei Anzeigen fuer
   *  dieselbe Sache, und eine davon falsch.
   *
   *  EINE Rechnung fuer alle: Schaltplan und Textindex holen sie hier, statt
   *  sie sich je selbst zusammenzureimen. */
  const aktivePresetIds = (): string[] =>
    preset.value === MULTI_ID ? multiIds.slice()
      : preset.value === AUTOMIX_ID ? Object.keys(lastAutoMixSources())
        : preset.value ? [preset.value] : [];

  const einstellungen = (): Record<string, string> => ({
    tone: tone.value, form: form.value, structure: structure.value, mode: mode.value,
    perspective: persp.value, rhythm: rhythm.value, varLevel: varianz.value,
    markovMode: markov.value, disruptor: disruptor.value, tension: tension.value,
    archetypeA: archA.value, archetypeB: archB.value, instability: instab.value,
    ressort: ressort.value, preset: aktivePresetIds().join("+") || preset.value, lenTarget: lenSlider.value,
  });

  const genBtn = el("button", { class: "primary" }, icon("play"), " Generieren");
  // „Drucken" und „Zeitungsseite" stehen seit 4.240.0 in der Reiterleiste.
  // Hier standen sie zwischen Erzeugungsknoepfen, obwohl sie nichts erzeugen,
  // sondern etwas Fertiges weiterverarbeiten — und liessen sich nicht
  // ausblenden. Sie holen sich den Text aus „dm_last_text"; damit sie auch die
  // Form kennen, wird die hier mitgeschrieben.
  const merkeForm = (): void => {
    try { localStorage.setItem("dm_last_form", form.value); } catch { /* voll */ }
  };
  form.addEventListener("change", merkeForm);
  merkeForm();
  const varBtn = button("Variante");
  const copyBtn = el("button", {}, icon("copy"), " Kopieren");
  const diceBtn = el("button", {}, icon("dice"), " Würfeln");
  const rollSel = (s: HTMLSelectElement): void => { if (locked.has(s.id)) return; s.selectedIndex = Math.floor(Math.random() * s.options.length); s.dispatchEvent(new Event("change")); };
  // Gewürfelt wird, was ein SCHLOSS trägt — nicht, was in einer Liste steht.
  //
  // Bis 4.283 stand hier `ROLL_SELECTS`, eine von Hand gepflegte Aufzählung. Die
  // acht Stellschrauben der Rekombination (k-fuegeteil … k-satzlaenge) kamen
  // später dazu und wurden nie eingetragen: Sie bekamen ein Schloss, aber der
  // Würfel fasste sie nie an. Gemessen an der laufenden Oberfläche bewegten sich
  // bei 25 Klicks 16 von 24 Auswahlfeldern — die acht Stellschrauben blieben in
  // JEDEM Lauf stehen, bei „Würfeln" wie bei „Alles würfeln".
  //
  // Dieselbe Familie wie „zwei Türen, ein Schloss" und die veraltete Reglerliste
  // im Wirkungsmesser: Eine abgeschriebene Liste veraltet, sobald jemand etwas
  // hinzufügt. Deshalb wird die Frage umgedreht — nicht „welche Felder gehören
  // in den Würfel?", sondern „welches Feld trägt ein Schloss?". Ein Schloss gibt
  // es nur, damit man etwas VOR dem Würfel schützen kann; wo eines steht, wird
  // also gewürfelt. Neue Regler sind damit automatisch dabei.
  // NACHTRAG 4.289.0: „Länge und Überraschung würfelt sich nicht mit."
  // Der Umbau in 4.284 sagte „gewürfelt wird, was ein Schloss trägt", suchte
  // aber nur nach `select`. Textlänge, Neuheit, Überraschung und die
  // 4W-Gewichtung sind Schieberegler — sie tragen ein Schloss und blieben
  // trotzdem stehen. Dieselbe Lücke, eine Ebene tiefer: nicht die Liste war
  // veraltet, sondern die Frage zu eng gestellt.
  //
  // Häkchen bleiben bewusst draußen. Ihr Schloss bedeutet dort etwas anderes:
  // Die drei Ansichten (Editieren, Struktur, Bauplan) merken sich damit ihren
  // Zustand über den Neustart — es schützt nicht vor dem Würfel, sondern hält
  // eine Anzeige. Ein Würfel, der die Ansicht umschaltet, wäre eine Zumutung.
  const wuerfelbar = (): (HTMLSelectElement | HTMLInputElement)[] =>
    Array.from(wrap.querySelectorAll("select, input[type=range]")).filter((s) => {
      const feld = s.closest(".field") || s.closest(".lenrow") || s.closest(".rankrow");
      return !!feld && !!feld.querySelector(".lockbtn");
    }) as (HTMLSelectElement | HTMLInputElement)[];
  const rollRange = (r: HTMLInputElement): void => {
    if (locked.has(r.id)) return;
    const min = parseFloat(r.min || "0"), max = parseFloat(r.max || "100"), step = parseFloat(r.step || "1") || 1;
    const stufen = Math.floor((max - min) / step) + 1;
    r.value = String(min + Math.floor(Math.random() * stufen) * step);
    r.dispatchEvent(new Event("input"));
    r.dispatchEvent(new Event("change"));
  };
  const rollEins = (c: HTMLSelectElement | HTMLInputElement): void => {
    if (c instanceof HTMLInputElement) rollRange(c); else rollSel(c);
  };
  const rollAlle = (): void => { rolling = true; wuerfelbar().forEach(rollEins); rolling = false; };
  diceBtn.addEventListener("click", () => { rollAlle(); renderPresetChecks(); generate(); });
  const keepLbl = el("span", {}, "Merken");
  const keepBtn = el("button", {}, icon("star"), " ", keepLbl);
  keepBtn.addEventListener("click", () => {
    const n = addToTreasury(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value, form: form.value, set: einstellungen() });
    // Erst HIER weiss man, dass der Text behalten wird. Der Index traegt es
    // nach; ohne diesen Schritt saehe jeder Eintrag gleich aus und die
    // Auswertung koennte nichts unterscheiden.
    try {
      const idx = ladeIndex();
      if (markiereBehalten(idx, indexSchluessel(out.textContent || ""))) sichereIndex(idx);
    } catch { /* egal */ }
    keepLbl.textContent = n < 0 ? "— schon drin" : `Gemerkt (${n})`;
    setTimeout(() => (keepLbl.textContent = "Merken"), 1400);
  });
  const vaultLbl = el("span", {}, "Tresor");
  const vaultBtn = el("button", {}, icon("lock"), " ", vaultLbl);
  vaultBtn.addEventListener("click", () => {
    const n = addToTreasurySecret(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value, form: form.value, set: einstellungen() });
    vaultLbl.textContent = n < 0 ? "— schon drin" : `Im Tresor (${n})`;
    setTimeout(() => (vaultLbl.textContent = "Tresor"), 1400);
  });
  const readBtn = el("button", {}, icon("book"), " Lesen");
  const speakLbl = el("span", {}, "Vorlesen");
  const speakBtn = el("button", {}, icon("volume"), " ", speakLbl);
  const bestChk = el("input", { type: "checkbox", id: "f-best" }) as HTMLInputElement;
  bestChk.checked = true;
  const bestLbl = el("label", { class: "chk", title: "Erzeugt bei jedem Klick 12 Kandidaten und zeigt den bestbewerteten (Längentreue, Wortvielfalt, Rhythmus, wenig Wiederholung, Grammatik, Abstand zur Schatzkammer)." }, bestChk, " Bestenauslese");
  wrap.append(el("div", { class: "btnrow" }, genBtn, varBtn, diceBtn, copyBtn, keepBtn, vaultBtn, readBtn, speakBtn, lenRow, bestLbl), outWrap, vorratHint, feedsRow, planBox, struktBox, kling);

  // ── Test & Ranking ──
  let lastRanking: Ranking | null = null;
  const rankStatus = el("span", { class: "muted", id: "f-rankstatus" }, "");
  const applyPlace = (place: number): void => {
    if (!lastRanking || !lastRanking.all.length) { rankStatus.textContent = "Erst Ranking ausführen."; return; }
    const item = lastRanking.all[Math.max(0, Math.min(lastRanking.all.length - 1, place - 1))];
    if (!item) return;
    out.textContent = item.txt;
    nachTextwechsel();
    try { localStorage.setItem("dm_last_text", item.txt); } catch { /* voll */ }
    renderKling(readInput().form, item.txt);
    refreshFeeds();
    const nov = item.novelty !== undefined ? ` · Neuheit ${Math.round(item.novelty * 100)}%` : "";
    const surp = item.surprise !== undefined ? ` · Überraschung ${Math.round(item.surprise * 100)}%` : "";
    const con = item.constraintsOk === false ? " · ⚠ Einbauwörter unvollständig" : "";
    const gr = item.grammar ? ` · ⚠ ${item.grammar} Grammatik` : "";
    const extra = item.aiScore !== undefined ? `KI ${item.aiScore}/100${item.grund ? " – " + item.grund : ""}` : `Score ${item.score.toFixed(1)}${nov}${surp}${gr}${con}`;
    rankStatus.textContent = `Platz ${place}: ${extra}`;
  };
  const novSlider = el("input", { id: "f-novelty", type: "range", min: "0", max: "100", step: "5", value: "30", class: "rankviz" }) as HTMLInputElement;
  const novVal = el("span", { class: "muted" }, "30 %");
  const updNovVal = (): void => { novVal.textContent = novSlider.value + " %"; };
  novSlider.addEventListener("input", updNovVal);
  const noveltyW = (): number => (parseInt(novSlider.value, 10) || 0) / 100;

  const surpSlider = el("input", { id: "f-surprise", type: "range", min: "0", max: "100", step: "5", value: "0", class: "rankviz" }) as HTMLInputElement;
  const surpVal = el("span", { class: "muted" }, "aus");
  const updSurpVal = (): void => { const v = parseInt(surpSlider.value, 10) || 0; surpVal.textContent = v === 0 ? "aus" : "Ziel " + v + " %"; };
  surpSlider.addEventListener("input", updSurpVal);
  const mustIn = el("input", { placeholder: "Einbauwörter, mit Komma getrennt" }) as HTMLInputElement;
  const avoidChk = el("input", { type: "checkbox" }) as HTMLInputElement;
  const gramChk = el("input", { type: "checkbox" }) as HTMLInputElement;
  const rankOpts = (): import("../generation/scoring").RankOptions => {
    const sv = (parseInt(surpSlider.value, 10) || 0) / 100;
    return {
      noveltyWeight: noveltyW(),
      surpriseWeight: sv > 0 ? 0.6 : 0,
      surpriseTarget: sv > 0 ? sv : 0.5,
      mustWords: mustIn.value.split(/[,;]/).map((w) => w.trim()).filter(Boolean),
      avoidFrequent: avoidChk.checked,
      grammarFilter: gramChk.checked,
      castDiscipline: parseFloat(cast.value) || 0,
      perspective: persp.value,
      expectedCast: who.value.split(/[,;]/).map((x) => x.trim()).filter(Boolean),
    };
  };

  const probeBtn = button("Probe (50)");
  probeBtn.addEventListener("click", () => {
    rankStatus.textContent = "Probe läuft…";
    setTimeout(() => { const r = runProbe(loadBank(), readInput(), buildModelFromCorpus(), 50);
      rankStatus.textContent = `Probe: ${r.total} Texte · ${r.flaggedCount} auffällig · ${r.grammarCount} Grammatik · ${r.duplicates} doppelt`; }, 10);
  });
  const rankBtn = button("Ranking (50)");
  const rangeSlider = el("input", { id: "f-rang", type: "range", min: "1", max: "50", value: "1", class: "rankviz" }) as HTMLInputElement;
  const rangeVal = el("span", { class: "muted" }, "1");
  rangeSlider.addEventListener("input", () => { rangeVal.textContent = "#" + rangeSlider.value; applyPlace(parseInt(rangeSlider.value, 10)); });
  rankBtn.addEventListener("click", () => {
    rankStatus.textContent = "Ranking läuft…";
    setTimeout(() => { lastRanking = runRanking(loadBank(), readInput(), buildModelFromCorpus(), 50, 10, rankOpts());
      rangeSlider.max = String(lastRanking.all.length); rangeSlider.value = "1"; rangeVal.textContent = "#1"; applyPlace(1); }, 10);
  });
  const goldBtn = button("🥇 #1"); goldBtn.addEventListener("click", () => applyPlace(1));
  const silverBtn = button("🥈 #2"); silverBtn.addEventListener("click", () => applyPlace(2));
  const bronzeBtn = button("🥉 #3"); bronzeBtn.addEventListener("click", () => applyPlace(3));
  // Regler mit Schloss (hält den Wert beim Würfeln und über den Neustart)
  const sliderField = (label: string, sl: HTMLInputElement, val: HTMLElement, hint: string): HTMLElement =>
    el("div", { class: "field rankrow" },
      el("span", { class: "field-label lockrow" }, el("span", {}, label), lockBtn(sl)),
      el("div", { class: "rankslide" }, sl, val),
      el("span", { class: "muted mini" }, hint));

  /** Ein ✕ oben rechts, das die Klappe zumacht.
   *
   *  Die Kopfzeile eines `details` klappt zu, wenn man sie anklickt — aber sie
   *  ist breit, und wer im offenen Feld arbeitet, sucht den Weg heraus dort,
   *  wo er in jedem Fenster steht: rechts oben. */
  const schliesser = (d: HTMLElement): HTMLElement => {
    const x = el("button", { class: "fine-x", type: "button", title: "Zuklappen", "aria-label": "Zuklappen" }, "✕");
    x.addEventListener("click", (e) => {
      e.preventDefault(); e.stopPropagation();
      (d as HTMLDetailsElement).open = false;
    });
    return x;
  };

  const rankDetails = el("details", { class: "fine" });
  rankDetails.append(schliesser(rankDetails), el("summary", {}, icon("flask"), " Test & Ranking"),
    // 1 Erzeugen & bewerten
    el("div", { class: "ranksec" },
      el("div", { class: "ranksec-h" }, "1 · Erzeugen und bewerten"),
      el("div", { class: "btnrow" }, probeBtn, rankBtn),
      rankStatus),
    // 2 Bewertungsmaßstab
    el("div", { class: "ranksec" },
      el("div", { class: "ranksec-h" }, "2 · Bewertungsmaßstab"),
      el("div", { class: "rankgrid" },
        sliderField("Neuheit", novSlider, novVal, "Abstand zur Schatzkammer belohnen"),
        sliderField("Überraschung", surpSlider, surpVal, "Zielwert der Unwahrscheinlichkeit im eigenen Korpus — braucht einen Korpus; 0 % = aus")),
      el("label", { class: "field" }, el("span", { class: "field-label" }, "Einbauwörter"), mustIn),
      el("div", { class: "chkrow" },
        el("label", { class: "chk" }, avoidChk, " Häufigste Korpus-Wörter meiden"),
        el("label", { class: "chk" }, gramChk, " Grammatik-Filter (auffällige Varianten abwerten)"))),
    // 3 Ergebnis wählen
    el("div", { class: "ranksec" },
      el("div", { class: "ranksec-h" }, "3 · Ergebnis wählen"),
      el("div", { class: "btnrow" }, goldBtn, silverBtn, bronzeBtn),
      el("div", { class: "field rankrow" },
        el("span", { class: "field-label" }, "Rang durchblättern"),
        el("div", { class: "rankslide" }, rangeSlider, rangeVal))));
  wrap.append(rankDetails);

  const fine = el("details", { class: "fine" });
  fine.append(schliesser(fine), el("summary", {}, icon("tool"), " Werkzeugkasten"));

  // ── Stellschrauben der Rekombination (A.2) ─────────────────────────────
  // Drei Zahlen standen fest im Code und wirkten wie Regler, ohne welche zu sein.
  // Die Spannen sind bewusst eng: Ein Fuegeteil-Deckel von 60 % ergibt Leerlauf.
  const knobs: Knobs = loadKnobs();
  const knobSel: Partial<Record<keyof Knobs, HTMLSelectElement>> = {};
  const knobRow = (feld: keyof Knobs, label: string, hinweis: string, einheit: string): HTMLElement => {
    const sp = KNOB_SPANNE[feld];
    // Auswahlfeld statt Schieberegler: Die Spannen sind klein und die Werte
    // benannt - auf dem Handy trifft man einen Eintrag leichter als eine Position,
    // und es sieht aus wie die uebrigen Werkzeuge daneben.
    const sel = el("select", { id: "k-" + feld }) as HTMLSelectElement;
    knobSel[feld] = sel;
    for (let v = sp.min; v <= sp.max; v += sp.step) {
      const txt = v + einheit + (v === KNOB_VORGABE[feld] ? "  (Vorgabe)" : "") + (v === 0 ? "  — aus" : "");
      sel.append(el("option", { value: String(v) }, txt));
    }
    sel.value = String(knobs[feld]);
    const merke = (): void => {
      knobs[feld] = parseInt(sel.value, 10);
      sel.classList.toggle("abweichend", knobs[feld] !== KNOB_VORGABE[feld]);
    };
    sel.addEventListener("input", merke);
    // `rolling` beachten: Ohne diese Bedingung erzeugte ein Würfelwurf acht
    // zusätzliche Texte — einen je Stellschraube —, bevor der eigentliche kam.
    sel.addEventListener("change", () => { merke(); saveKnobs(knobs); if (!rolling) generate(); });
    merke();
    // Erklaerung als Mouseover statt als Fliesstext: Sechs Beschreibungen
    // untereinander kosteten mehr Hoehe als die Regler selbst.
    sel.title = hinweis;
    // Auch die Stellschrauben bekommen ein Schloss. Ohne es verstellte die
    // Zielregelung sie nach jeder Erzeugung, und nichts konnte das aufhalten.
    return el("div", { class: "field", id: "knob-" + feld, title: hinweis },
      el("span", { class: "field-label hilfe lockrow" }, el("span", {}, label), lockBtn(sel)), sel);
  };
  const knobBox = el("div", { class: "grid3", id: "knobs" },
    knobRow("fuegeteil", "Fügeteil-Deckel", "Höchstanteil der Verbindungsstücke — steuert den Balken „Vorlagen“", " %"),
    knobRow("w4max", "4W-Deckel", "wie oft Ort und Zeit im Text vorkommen dürfen", "×"),
    knobRow("abstand", "Nachlege-Abstand", "wie weit ein Baustein zurückliegen muss, bevor er wiederkehrt", ""),
    knobRow("bogen", "Erzählbogen", "Gewicht der Bogen-Atome; 0 schaltet die Quelle ab", " %"),
    knobRow("ton", "Ton-Einschübe", "wie viele Ton-Sätze die Nachbearbeitung einstreut", " %"),
    knobRow("korpus", "Korpus-Bausteine", "aus dem eigenen Korpus, gefiltert auf Präsens und eigene Figuren; 0 = aus", ""),
    knobRow("phrase", "Phrasensperre", "ab wie vielen gleichen Wörtern in Folge ein Baustein abgelehnt wird; 0 = aus. Streng heißt weniger Wiederholung, aber auch kürzere Texte", " Wörter"),
    knobRow("satzlaenge", "Satzlänge", "Obergrenze, kein Mittelwert: Nachbarsätze werden zusammengezogen, solange das Ergebnis darunter bleibt. 0 = aus. Bei 9 verschwinden vor allem die Stummelsätze, lange entstehen erst ab 12; bei 15 liegt der Schnitt bei rund 9 Wörtern", " Wörter"));
  const knobReset = button("Vorgaben wiederherstellen");
  knobReset.addEventListener("click", () => {
    Object.assign(knobs, KNOB_VORGABE); saveKnobs(knobs);
    for (const f of ["fuegeteil", "w4max", "abstand"] as (keyof Knobs)[]) {
      const r = document.getElementById("k-" + f) as HTMLSelectElement | null;
      if (r) { r.value = String(KNOB_VORGABE[f]); r.dispatchEvent(new Event("input")); }
    }
    generate();
  });
  fine.append(el("p", { class: "muted mini" },
    "Stellschrauben der Rekombination. Sie wirken auf die Balken der Textstruktur — ein Klick auf einen Balken führt hierher."),
    knobBox, el("div", { class: "btnrow" }, knobReset));
  // Rekombination baut aus typisierten Atomen und kann nur Fliesstext erzeugen.
  // Bei Vers- und Dialogformen greift sie nicht - das muss die Oberflaeche sagen,
  // statt stillschweigend den Schablonenweg zu nehmen.
  const rekHint = el("p", { class: "muted mini", style: "display:none" });
  const updRekHint = (): void => {
    const passt = form.value === "prose" || form.value === "poem";
    if (structure.value === "rekombination" && !passt) {
      rekHint.style.display = "";
      rekHint.textContent = `Hinweis: „Rekombination“ wirkt nur bei Prosa und Prosagedicht. `
        + `Bei „${form.options[form.selectedIndex]?.text || form.value}“ baut die Maschine über die Schablonen — die Struktur bleibt hier ohne Wirkung.`;
      return;
    }
    // Dieselbe stumme Wirkungslosigkeit: „Dramaturgie“ verlangt einen
    // Dramaturgie-Block. Der Satz „den KEINES der eingebauten Presets mitbringt“
    // stand hier bis 4.287 und war überholt — seit die Bögen in
    // `presets.drama.data.ts` liegen, tragen alle 51 eingebauten einen, und die
    // Preset-Auswahl legt ihn beim Umschalten ab. Die Prüfung bleibt trotzdem
    // richtig: Eigene Presets ohne 2.0-Block haben weiterhin keinen, und bei
    // jeder Form außer Prosa fällt der Bauweg ebenfalls zurück.
    if (structure.value === "dramaturgie" && !(form.value === "prose" && hasDramaData())) {
      rekHint.style.display = "";
      rekHint.textContent = form.value !== "prose"
        ? `Hinweis: „Dramaturgie“ wirkt nur bei Prosa — bei „${form.options[form.selectedIndex]?.text || form.value}“ bleibt die Struktur ohne Wirkung.`
        : "Hinweis: „Dramaturgie“ braucht einen Erzählbogen. Das aktive Preset hat keinen — "
          + "die Maschine baut über die Schablonen, die Struktur bleibt ohne Wirkung. In der Wortbank lässt sich ein Preset auf 2.0 heben.";
      return;
    }
    rekHint.style.display = "none";
  };
  form.addEventListener("change", updRekHint);
  structure.addEventListener("change", updRekHint);
  preset.addEventListener("change", updRekHint);
  updRekHint();
  fine.append(el("div", { class: "grid3" },
    lockField("Struktur", structure), lockField("Modus", mode), lockField("Perspektive", persp),
    lockField("Rhythmus", rhythm), lockField("Instabilität", instab), lockField("Markov", markov),
    lockField("Disruptor", disruptor), lockField("Varianz", varianz), lockField("Zeitungsseite", ressort),
    lockField("Spannung", tension), lockField("Figurendisziplin", cast),
    lockField("Archetyp A", archA), lockField("Archetyp B", archB),
    field("Video: Shots", shots), field("Video: Sekunden", secs)));
  fine.append(rekHint);
  wrap.append(fine);

  // ⚙️ Einstellungen (Farb-Themes)
  const themeSel = select("f-theme", THEMES.map((t) => [t.id, t.label] as [string, string]), loadTheme());
  themeSel.addEventListener("change", () => applyTheme(themeSel.value));
  const schriftPanel = el("div", {}, fontRow);
  const accentIn = el("input", { id: "f-accent", type: "color", value: loadAccent() || "#8b5cf6", style: "width:52px;height:34px;padding:2px" }) as HTMLInputElement;
  accentIn.addEventListener("input", () => { applyAccent(accentIn.value); saveAccent(accentIn.value); });
  const accentReset = button("Standard");
  accentReset.addEventListener("click", () => { saveAccent(""); applyAccent(""); });
  const themePanel = el("div", { style: "display:none" },
    field("Farb-Theme", themeSel),
    field("Eigene Akzentfarbe", el("div", { class: "btnrow" }, accentIn, accentReset)));
  // KI-Zugang (Schlüssel bleibt lokal, Aufrufe nur an api.anthropic.com)
  const keyIn = el("input", { type: "password", placeholder: "sk-ant-…", value: loadAiKey() }) as HTMLInputElement;
  const modelIn = el("input", { placeholder: "Modell", value: loadAiModel() }) as HTMLInputElement;
  const kiStatus = el("p", { class: "muted" }, "");
  const setKiStatus = (): void => { kiStatus.textContent = loadAiKey() ? `Schlüssel hinterlegt · Modell: ${loadAiModel()}` : "Kein Schlüssel hinterlegt — KI-Funktionen sind inaktiv."; };
  const keySave = button("Speichern");
  keySave.addEventListener("click", () => { saveAiKey(keyIn.value.trim()); saveAiModel(modelIn.value.trim()); setKiStatus(); });
  const keyClear = button("Schlüssel löschen", "danger");
  keyClear.addEventListener("click", () => { saveAiKey(""); keyIn.value = ""; setKiStatus(); });
  setKiStatus();
  const kiPanel = el("div", { style: "display:none" },
    field("API-Schlüssel", keyIn), field("Modell", modelIn),
    el("div", { class: "btnrow" }, keySave, keyClear), kiStatus,
    el("p", { class: "muted" }, "Wird nur lokal gespeichert und ausschließlich an api.anthropic.com gesendet. Jede Anfrage verbraucht Guthaben deines Kontos."));

  // Speicher-Reiter
  const memLine = el("p", { class: "muted" }, "…");
  const memRefresh = button("Aktualisieren");
  // Die Aufschluesselung. Eine Summe sagt nur, OB es eng wird, nicht WO — und
  // genau daran haengt, ob ein Umzug in eine Datenbank faellig ist oder ein
  // einzelner Posten aufgeraeumt gehoert.
  const memPosten = el("div", { class: "mem-posten" });
  const zeichnePosten = (): void => {
    memPosten.innerHTML = "";
    const posten = lesePosten();
    if (!posten.length) return;
    // Nur die groessten: Eine Liste aus vierzig Zeilen liest niemand, und die
    // Entscheidung haengt ohnehin an der Spitze.
    const oben = posten.slice(0, 12);
    const rest = posten.slice(12).reduce((a, p) => a + p.bytes, 0);
    for (const p of oben) {
      memPosten.append(el("div", { class: "mem-zeile" },
        el("span", { class: "mem-name" }, p.name),
        el("span", { class: "mem-balken" },
          el("span", { style: `width:${Math.max(1, Math.min(100, p.anteil))}%` })),
        el("span", { class: "mem-wert" }, `${formatBytes(p.bytes)} · ${p.anteil} %`),
        ...(p.wandert ? [] : [el("span", { class: "bsam-zweifel" }, " wandert nicht mit")])));
    }
    if (rest > 0) {
      memPosten.append(el("p", { class: "muted mini", style: "margin:6px 0 0" },
        `${posten.length - oben.length} weitere Eintraege zusammen ${formatBytes(rest)}.`));
    }
    memPosten.append(el("p", { class: "muted mini", style: "margin:6px 0 0" },
      "„Wandert nicht mit\u201c heisst: steht beim Export NICHT in der Projektdatei. "
      + "Alles mit den Praefixen dm_ und divergenz_ wandert."));
  };
  const refreshMem = (): void => {
    void storageReport().then((r) => { memLine.textContent = r.text; });
    zeichnePosten();
  };
  memRefresh.addEventListener("click", refreshMem);
  const memReset = button("Korpus + Schatzkammer leeren", "danger");
  // memPosten wird unten in die Tafel gehaengt.
  const memResetInfo = el("span", { class: "muted" });
  memReset.addEventListener("click", () => {
    if (!confirm("Korpus UND Schatzkammer vollständig leeren? Das lässt sich nicht rückgängig machen. Wortbank, Presets und Einstellungen bleiben erhalten.")) return;
    savePersistentCorpus("");
    clearTreasury();
    refreshMem();
    memResetInfo.textContent = "Korpus und Schatzkammer geleert.";
    setTimeout(() => (memResetInfo.textContent = ""), 2500);
  });
  const memPanel = el("div", { style: "display:none" },
    field("Belegung", memLine),
    el("div", { class: "btnrow" }, memRefresh),
    memPosten,
    el("hr", {}),
    el("div", { class: "btnrow" }, memReset, memResetInfo),
    el("p", { class: "muted" }, "Setzt den Markov-Korpus und die Schatzkammer zurück (leert beide). Wortbank, Presets, Einstellungen und lebendige Pools bleiben erhalten. Für ein vollständiges Backup vorher oben rechts „Exportieren“."),
    el("p", { class: "muted" }, "Der Browser speichert alles lokal. Wird es eng, erscheint bei jedem Sichern oben ein Warnband; dann Korpus kürzen, Schatzkammer aufräumen oder ein Projekt exportieren und Daten löschen."));

  // ── Reiter ein-, ausblenden und sortieren ─────────────────────────────────
  // Dreizehn Reiter sind fuer ein Handy zu viele, und niemand benutzt alle.
  // Die Rechnung dazu steht in features/reiter.ts — hier nur die Bedienung.
  const tabReiter = el("button", { class: "subtab" }, "Reiter");
  const reiterListe = el("div", {});
  const reiterHinweis = el("p", { class: "muted mini" },
    "Das Studio l\u00e4sst sich nicht ausblenden — diese Einstellung liegt darin. "
    + "\u201eDrucken\u201c und \u201eZeitungsseite\u201c \u00f6ffnen ein Fenster und wechseln den Reiter nicht.");
  const zeichneReiterListe = (): void => {
    reiterListe.innerHTML = "";
    const stand = ladeReiter();
    const namen = ordneReiter(derKanon(), stand.ordnung);
    const weg = new Set(stand.versteckt);
    namen.forEach((name, i) => {
      const an = el("input", { type: "checkbox", id: "rt-" + i }) as HTMLInputElement;
      an.checked = !weg.has(name);
      an.disabled = REITER_PFLICHT.includes(name);
      an.addEventListener("change", () => {
        sichereReiter(schalteReiter(ladeReiter(), name, an.checked));
        reiterGeaendert();
      });
      const hoch = el("button", { title: "nach vorn" }, "\u2191") as HTMLButtonElement;
      const runter = el("button", { title: "nach hinten" }, "\u2193") as HTMLButtonElement;
      hoch.disabled = i === 0;
      runter.disabled = i === namen.length - 1;
      const schieb = (d: number): void => {
        const st = ladeReiter();
        sichereReiter({ ...st, ordnung: verschiebeReiter(ordneReiter(derKanon(), st.ordnung), name, d) });
        reiterGeaendert();
      };
      hoch.addEventListener("click", () => schieb(-1));
      runter.addEventListener("click", () => schieb(1));
      reiterListe.append(el("div", { class: "reiterzeile" },
        el("label", {}, an, " ", name), el("span", { class: "btnrow" }, hoch, runter)));
    });
  };
  /** Nach jeder Aenderung neu zeichnen — die Liste hier UND die Leiste oben.
   *  Die Leiste erfaehrt es ueber ein Ereignis am Fenster; eine direkte
   *  Funktion waere ein Ringschluss der Einbindungen. */
  const reiterGeaendert = (): void => {
    zeichneReiterListe();
    window.dispatchEvent(new CustomEvent("dm-reiter"));
  };
  const reiterZurueck = button("Reihenfolge zur\u00fccksetzen");
  reiterZurueck.addEventListener("click", () => {
    sichereReiter({ ordnung: [], versteckt: [] });
    reiterGeaendert();
  });
  const reiterPanel = el("div", { style: "display:none" },
    reiterHinweis, reiterListe, el("div", { class: "btnrow" }, reiterZurueck));

  const tabSchrift = el("button", { class: "subtab active" }, "Schrift");
  const tabFarbe = el("button", { class: "subtab" }, "Farbe");
  const tabKi = el("button", { class: "subtab" }, "KI-Zugang");
  const tabMem = el("button", { class: "subtab" }, "Speicher");
  const showSettingsPanel = (which: "schrift" | "farbe" | "ki" | "mem" | "reiter"): void => {
    reiterPanel.style.display = which === "reiter" ? "" : "none";
    tabReiter.classList.toggle("active", which === "reiter");
    if (which === "reiter") zeichneReiterListe();
    schriftPanel.style.display = which === "schrift" ? "" : "none";
    themePanel.style.display = which === "farbe" ? "" : "none";
    kiPanel.style.display = which === "ki" ? "" : "none";
    memPanel.style.display = which === "mem" ? "" : "none";
    tabSchrift.classList.toggle("active", which === "schrift");
    tabFarbe.classList.toggle("active", which === "farbe");
    tabKi.classList.toggle("active", which === "ki");
    tabMem.classList.toggle("active", which === "mem");
    if (which === "mem") refreshMem();
  };
  tabSchrift.addEventListener("click", () => showSettingsPanel("schrift"));
  tabFarbe.addEventListener("click", () => showSettingsPanel("farbe"));
  tabKi.addEventListener("click", () => showSettingsPanel("ki"));
  tabMem.addEventListener("click", () => showSettingsPanel("mem"));
  tabReiter.addEventListener("click", () => showSettingsPanel("reiter"));
  const settings = el("details", { class: "fine" });
  settings.append(schliesser(settings), el("summary", {}, icon("settings"), " Einstellungen"),
    el("div", { class: "subtabs" }, tabSchrift, tabFarbe, tabReiter, tabKi, tabMem), schriftPanel, themePanel, reiterPanel, kiPanel, memPanel);
  wrap.append(settings);

  root.append(wrap);

  const readInput = (): GenInput => ({
    where: where.value, when: when.value, who: who.value, what: what.value,
    tone: tone.value, varLevel: varianz.value, form: form.value as FormKind,
    structure: structure.value, mode: mode.value, perspective: persp.value,
    rhythm: rhythm.value, markovMode: markov.value, disruptor: disruptor.value,
    archetypeA: archA.value, archetypeB: archB.value,
    instability: parseInt(instab.value, 10) as 0 | 1 | 2,
    ressort: ressort.value,
    shots: parseInt(shots.value, 10), totalSec: parseInt(secs.value, 10),
    lenTarget: parseInt(lenSlider.value, 10),
    tension: tension.value,
    emphasis: { wo: parseInt(wWo.value, 10), wann: parseInt(wWann.value, 10), wer: parseInt(wWer.value, 10), was: parseInt(wWas.value, 10) },
  });
  const KLING_URL = "https://klingai.com";
  const renderKling = (form: string, text: string): void => {
    kling.innerHTML = "";
    if (form !== "video") return;
    const shots = (text || "").split("\n").filter((l) => l.startsWith("DE:")).map((l) => l.replace(/^DE:\s*/, "").trim());
    if (!shots.length) return;
    const head = el("div", { class: "kling-head" },
      el("span", {}, `🎬 ${shots.length} Shots für Kling`),
      el("a", { class: "kling-link", href: KLING_URL, target: "_blank", rel: "noopener" }, "In Kling generieren ↗"));
    const allBtn = button("Alle Shots kopieren");
    allBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(shots.join("\n\n")); });
    head.append(allBtn);
    kling.append(head);
    shots.forEach((s, i) => {
      const copy = button("Kopieren");
      copy.addEventListener("click", () => { void navigator.clipboard?.writeText(s); });
      kling.append(el("div", { class: "kling-shot" }, el("b", {}, `Shot ${i + 1}`), el("span", {}, s), copy));
    });
  };

  const generate = (): void => {
    const model = markov.value !== "off" ? buildModelFromCorpus(2) : undefined;
    const input = readInput();
    try {
      if (bestChk.checked) {
        const w = bestOf(loadBank(), input, model, 12, { noveltyWeight: 0.5, grammarFilter: true, castDiscipline: parseFloat(cast.value) || 0, expectedCast: who.value.split(/[,;]/).map((x) => x.trim()).filter(Boolean), perspective: persp.value });
        out.textContent = w.txt;
        zeigeUmweltEffekt(w.umwelt);
      } else {
        out.textContent = buildStory(loadBank(), input, model);
        zeigeUmweltEffekt(undefined);
      }
      baseText = out.textContent || "";
      ctxSichern();
      updVorrat();
      try { localStorage.setItem("dm_last_text", out.textContent || ""); } catch { /* voll */ }
      renderKling(input.form, out.textContent || "");
      try { feedLivePools(out.textContent || "", LIVE_W.gen); } catch { /* egal */ }
      worldLogGeneration(input);
      // Einstellungen mitschreiben, damit die Diagnose den Text zuordnen kann
      saveSchnappschuss({
        preset: presetStatus.textContent?.replace(/^Aktiv:\s*/, "") || "—",
        ton: tone.options[tone.selectedIndex]?.text || tone.value,
        tonId: tone.value,
        form: form.options[form.selectedIndex]?.text || form.value,
        struktur: structure.options[structure.selectedIndex]?.text || structure.value,
        perspektive: persp.options[persp.selectedIndex]?.text || persp.value,
        rhythmus: rhythm.options[rhythm.selectedIndex]?.text || rhythm.value,
        markov: markov.options[markov.selectedIndex]?.text || markov.value,
        varianz: varianz.options[varianz.selectedIndex]?.text || varianz.value,
        spannung: tension.options[tension.selectedIndex]?.text || tension.value,
        where: where.value, when: when.value, who: who.value, what: what.value,
        laenge: parseInt(lenSlider.value, 10) || 0, bestenauslese: bestChk.checked,
        zeit: new Date().toLocaleTimeString("de-DE"),
      });
      // JEDEN Text in den Index, nicht nur den behaltenen. Ein Index nur ueber
      // Behaltenes zeigt, was gute Texte gemeinsam haben — aber nicht, ob die
      // schlechten es auch hatten. Erst der Vergleich beider Klassen sagt
      // etwas. „Behalten" wird spaeter nachgetragen.
      try {
        const txt = out.textContent || "";
        const h = analysiereHerkunft(txt, (tone.value || "neutral").toLowerCase(),
          { where: where.value, when: when.value, who: who.value, what: what.value });
        // Die IDs, nicht die Anzeigenamen. Ein erster Versuch rechnete vom
        // Namen auf die ID zurueck („Griechische Tragoedie" →
        // „griechischetragödie") — und traf nicht, weil die ID
        // „griechischetragoedie" heisst. Ausgerechnet fuer die gemeldete
        // Mischung stand damit eine Spreizung von 0 im Index, obwohl sie hoch
        // ist. Namen sind fuer Menschen, IDs fuer die Rechnung.
        const aktivIds = aktivePresetIds();
        const aktiv = aktivIds.map((id) => stripIcon(getAllPresets()[id]?.label || id));
        sichereIndex(mischeIndex(ladeIndex(), {
          schluessel: indexSchluessel(txt),
          zeit: new Date().toISOString().slice(0, 16),
          form: form.value,
          woerter: woerterVon(txt),
          presets: aktiv,
          spreizung: mischAbstand(aktivIds),
          regler: {
            ton: tone.value, struktur: structure.value, perspektive: persp.value,
            rhythmus: rhythm.value, markov: markov.value, varianz: varianz.value,
            spannung: tension.value, modus: mode.value,
            laenge: String(parseInt(lenSlider.value, 10) || 0),
            bestenauslese: bestChk.checked ? "an" : "aus",
          },
          ctx: { who: who.value, where: where.value, when: when.value, what: what.value },
          // Die Herkunft rechnet ihre Anteile schon aus — als Bruch von 0 bis 1
          // und ueber ZEICHEN, nicht ueber Segmente. Sie hier neu zu zaehlen
          // haette eine zweite Rechnung fuer dieselbe Sache ergeben, die
          // irgendwann anders ausfaellt.
          herkunft: Object.fromEntries(Object.entries(h.anteile || {})
            .map(([k, v]) => [k, Math.round((v as number) * 100)])
            .filter(([, v]) => (v as number) > 0)),
          behalten: false,
        }));
      } catch { /* der Index darf das Erzeugen nie aufhalten */ }
      refreshFeeds();
      clearUndo();
      requestAnimationFrame(positionArrows);
      renderPlan();
      renderStruktur();
    } catch (e) { out.textContent = "Fehler: " + (e instanceof Error ? e.message : String(e)); }
  };
  genBtn.addEventListener("click", generate);

  // ── Der einfache Kopf ─────────────────────────────────────────────────────
  // Vier Entscheidungen statt siebenunddreissig Reglern. Welche vier, steht in
  // features/einfach.ts begruendet — kurz: die einzigen beiden Regler, die
  // messbar ausschlagen (Form, und ueber die Wortbank die Reibung), dazu Laenge
  // und ein Satz, aus dem die vier W kommen.
  //
  // ER SCHREIBT IN DIE ECHTEN REGLER und loest aus wie eine Bedienung von Hand.
  // Kein zweiter Satz Einstellungen: Sonst zeigte der Schaltplan etwas anderes
  // als das Studio — genau der Fehler, der uns zuletzt drei Anlaeufe gekostet
  // hat.
  const kopfWahl = ladeKopfWahl();
  const probeText = el("p", { id: "ek-probe" });
  const probeFuss = el("div", { class: "ek-fuss" });
  const probeKante = el("span", { class: "ek-kante" });

  const zeichneProbe = (): void => {
    // Erst das eigene Material, dann das Muster. Solange die lebendigen Pools
    // nichts hergeben, zeigt die Probe die Bauart; sobald sie etwas hergeben,
    // zeigt sie, wie eine Kollision in DIESEM Korpus klingt.
    const p = probeAus(liveTexts(), kopfWahl.reibung)
      ?? PROBEN[Math.max(0, Math.min(PROBEN.length - 1, kopfWahl.reibung))]!;
    probeText.innerHTML = "";
    for (const [t, r] of p.teile) probeText.append(el("span", { class: "ek-r" + r }, t));
    probeFuss.innerHTML = "";
    p.register.forEach(([n, r], i) => {
      if (i) probeFuss.append(el("span", { class: "ek-plus" }, "+"));
      probeFuss.append(el("span", { class: "ek-perle ek-p" + r }), el("span", {}, n));
    });
    probeFuss.append(el("span", { class: "ek-fussnote" }, "· " + p.fuss));
    probeKante.className = "ek-kante ek-k" + kopfWahl.reibung;
  };

  const stufenZeile = (namen: string[], id: string): HTMLElement =>
    el("div", { class: "ek-stufen", id }, ...namen.map((n) => el("span", {}, n)));
  const markiere = (id: string, i: number): void => {
    const box = wrap.querySelector("#" + id);
    if (!box) return;
    Array.from(box.children).forEach((k, j) => k.classList.toggle("an", j === i));
  };

  const formReihe = el("div", { class: "ek-wahl" });
  KOPF_FORMEN.forEach(([, label], i) => {
    const b = el("button", { type: "button" }, label);
    b.setAttribute("aria-pressed", String(i === kopfWahl.form));
    b.addEventListener("click", () => {
      kopfWahl.form = i;
      Array.from(formReihe.children).forEach((x, j) => x.setAttribute("aria-pressed", String(i === j)));
      sichereKopfWahl(kopfWahl);
    });
    formReihe.append(b);
  });

  const saatIn = el("input", {
    type: "text", value: kopfWahl.saat, "aria-label": "Wovon soll der Text handeln",
  }) as HTMLInputElement;
  saatIn.addEventListener("input", () => { kopfWahl.saat = saatIn.value; sichereKopfWahl(kopfWahl); });
  const saatWuerfel = el("button", { type: "button", title: "Anderen Satz vorschlagen" }, "⚄");
  saatWuerfel.addEventListener("click", () => {
    let n = saatIn.value;
    while (n === saatIn.value && SAAT_BEISPIELE.length > 1) n = SAAT_BEISPIELE[Math.floor(Math.random() * SAAT_BEISPIELE.length)]!;
    saatIn.value = n; kopfWahl.saat = n; sichereKopfWahl(kopfWahl);
  });

  const laengeIn = el("input", {
    type: "range", min: "0", max: "2", step: "1", value: String(kopfWahl.laenge), "aria-label": "Länge",
  }) as HTMLInputElement;
  laengeIn.addEventListener("input", () => {
    kopfWahl.laenge = parseInt(laengeIn.value, 10) || 0;
    markiere("ek-laenge-stufen", kopfWahl.laenge); sichereKopfWahl(kopfWahl);
  });

  const reibungIn = el("input", {
    type: "range", min: "0", max: "2", step: "1", value: String(kopfWahl.reibung),
    "aria-label": "Reibung zwischen den Registern", "aria-describedby": "ek-probe",
  }) as HTMLInputElement;
  reibungIn.addEventListener("input", () => {
    kopfWahl.reibung = parseInt(reibungIn.value, 10) || 0;
    markiere("ek-reibung-stufen", kopfWahl.reibung); zeichneProbe(); sichereKopfWahl(kopfWahl);
  });

  const kopfLos = el("button", { class: "primary" }, icon("play"), " Text erzeugen");
  kopfLos.addEventListener("click", () => {
    const st = kopfStellung(kopfWahl);
    // In die ECHTEN Felder schreiben und ausloesen. `dispatchEvent` ist hier
    // kein Beiwerk: An den change-Ereignissen haengen die Wortbank, der
    // Anlagenstand fuer den Schaltplan und die Merkzettel fuer den
    // Reiterwechsel. Eine blosse Zuweisung ginge nur den halben Weg.
    if (!locked.has(form.id)) { form.value = st.form; form.dispatchEvent(new Event("change")); }
    if (!locked.has(lenSlider.id)) { lenSlider.value = String(st.lenTarget); lenSlider.dispatchEvent(new Event("input")); }
    for (const [feld, wert] of [[where, st.ctx.where], [when, st.ctx.when], [who, st.ctx.who], [what, st.ctx.what]] as [HTMLInputElement, string][]) {
      if (locked.has(feld.id) || !wert) continue;
      feld.value = wert; feld.dispatchEvent(new Event("input"));
    }
    // Die Reibung: so viele Presets mischen, wie die Stufe sagt — gespreizt
    // gewaehlt, wie beim Autopiloten. Bei einem einzigen bleibt die
    // Einzelauswahl.
    if (!locked.has(preset.id)) {
      const vorrat = Object.keys(getAllPresets());
      const ids = waehleGespreizt(vorrat, st.presets);
      if (st.presets > 1 && ids.length > 1) applySelection(ids);
      else if (ids[0]) { preset.value = ids[0]; preset.dispatchEvent(new Event("change")); }
    }
    generate();
    // Im einfachen Modus fuehrt der Knopf ins LESEN. Wer den Kopf benutzt, will
    // einen Text — nicht eine Textbox unter einem Formular. Der Reglerkasten
    // bleibt dahinter stehen und wartet.
    // Die vier W mitgeben: Der Leser zeigt sie als Kopfzeile, und ohne sie
    // stuende der Text ohne jede Angabe da, wo er herkommt.
    if (kopfWahl.einfach) {
      openReader(out.textContent || "",
        { who: who.value, where: where.value, when: when.value, what: what.value });
    }
  });

  const reihe = (marke: string, ...inhalt: (HTMLElement | string)[]): HTMLElement =>
    el("div", { class: "ek-reihe" }, el("span", { class: "ek-marke" }, marke), el("div", {}, ...inhalt));

  // Ein UMSCHALTER, kein Aufklapper. Der Unterschied ist nicht kosmetisch: Der
  // einfache Kopf ERSETZT den Reglerkasten, er steht nicht darueber. Ein
  // details/summary haette „hier ist noch mehr" gesagt; gemeint ist „das hier
  // ist die Seite, und dort drueben ist die andere".
  const umschalter = el("button", { class: "ek-neben", type: "button" }, "");
  const setzeModus = (einfach: boolean): void => {
    kopfWahl.einfach = einfach;
    sichereKopfWahl(kopfWahl);
    wrap.classList.toggle("studio-einfach", einfach);
    koerper.style.display = einfach ? "" : "none";
    umschalter.textContent = einfach ? "alle Regler zeigen" : "einfach";
    frage.textContent = einfach ? "Was soll entstehen?" : "Einfacher Kopf";
  };
  umschalter.addEventListener("click", () => setzeModus(!kopfWahl.einfach));
  const frage = el("span", { class: "ek-frage" }, "");
  const koerper = el("div", { class: "ek-koerper" },
      reihe("Form", formReihe),
      reihe("Wovon", el("div", { class: "ek-satz" }, saatIn, saatWuerfel)),
      reihe("Länge", laengeIn, stufenZeile(LAENGE_NAMEN, "ek-laenge-stufen")),
      reihe("Reibung", reibungIn, stufenZeile(REIBUNG_NAMEN, "ek-reibung-stufen")),
      el("div", { class: "ek-probe" }, probeKante, probeText, probeFuss),
      el("div", { class: "ek-fussreihe" }, kopfLos,
        el("span", { class: "ek-hinweis" },
          "Alles Übrige würfelt die Maschine. Was sie gewürfelt hat, steht im Schaltplan unter Diagnose.")));
  const kopf = el("div", { class: "ek-kopf" },
    el("div", { class: "ek-leiste" }, frage, umschalter), koerper);
  wrap.prepend(kopf);
  setzeModus(kopfWahl.einfach !== false);
  zeichneProbe();
  markiere("ek-laenge-stufen", kopfWahl.laenge);
  markiere("ek-reibung-stufen", kopfWahl.reibung);
  varBtn.addEventListener("click", generate);
  // Echtzeit: Preset/Ton/Form sofort anwenden (außer während "Würfeln")
  const liveRegen = (): void => { if (!rolling) generate(); };
  // Alle Regler erzeugen neu, nicht nur fuenf. Vorher taten es Preset, Ton,
  // Form, Spannung und Figurendisziplin - Struktur, Modus, Perspektive,
  // Rhythmus, Instabilitaet, Markov, Disruptor und Varianz nicht. Dieselbe
  // Einstellung wirkte also sofort, wenn man sie am Chip unter dem Text
  // umstellte, und schien tot, wenn man sie im Werkzeugkasten umstellte.
  ROLL_SELECTS.forEach((sl) => sl.addEventListener("change", liveRegen));
  // 4W-Gewichtung: live + nur bei Prosa sichtbar
  let emphTimer: ReturnType<typeof setTimeout> | undefined;
  [wWo, wWann, wWer, wWas].forEach((s) => {
    s.addEventListener("input", () => { clearTimeout(emphTimer); emphTimer = setTimeout(() => { if (!rolling) generate(); }, 180); });
  });
  const updEmphVis = (): void => { const show = form.value === "prose"; [wWo, wWann, wWer, wWas].forEach((s) => { s.style.display = show ? "" : "none"; }); };
  form.addEventListener("change", updEmphVis);
  form.addEventListener("change", updHints);
  copyBtn.addEventListener("click", () => { void navigator.clipboard?.writeText(out.textContent || ""); });

  // Lesemodus (Vollbild-Overlay)
  readBtn.addEventListener("click", () => openReader(out.textContent || "", { who: who.value, where: where.value, when: when.value, what: what.value }));

  // Vorlesen
  let speaking = false;
  speakBtn.addEventListener("click", () => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speaking) { synth.cancel(); speaking = false; speakLbl.textContent = "Vorlesen"; return; }
    const u = new SpeechSynthesisUtterance(out.textContent || "");
    u.lang = "de-DE";
    u.onend = () => { speaking = false; speakLbl.textContent = "Vorlesen"; };
    speaking = true; speakLbl.textContent = "Stopp"; synth.speak(u);
  });

  // Gemerkten Kontext laden (falls aktiv)
  try {
    const saved = localStorage.getItem(CTX_KEY);
    if (saved) { const c = JSON.parse(saved) as Record<string,string>; if(c.where!==undefined)where.value=c.where; if(c.when!==undefined)when.value=c.when; if(c.who!==undefined)who.value=c.who; if(c.what!==undefined)what.value=c.what; ctxKeep.classList.add("on"); ctxKeep.setAttribute("aria-pressed","true"); }
  } catch { /* ignore */ }
  // Übergaben aus anderen Tabs: gewünschte Werte merken, um blockierte Schlösser zu melden
  const handedOver: { el: HTMLInputElement | HTMLSelectElement; label: string; want: string }[] = [];
  // Was von einem anderen Reiter übergeben wurde, darf der Merkzettel unten
  // NICHT überschreiben. Genau das ist in 4.294.0 passiert: Seit die vier W im
  // Merkzettel stehen, kam „→ Studio" aus dem Reiter Ideen nicht mehr an — die
  // Wiederherstellung lief nach der Übergabe und setzte den alten Kontext
  // zurück. Der Weg sah aus, als täte er nichts.
  const uebergeben = new Set<string>();
  const hand = (el: HTMLInputElement | HTMLSelectElement, label: string, v: unknown): void => {
    if (typeof v !== "string" || !v) return;
    if (el instanceof HTMLSelectElement && !Array.from(el.options).some((o) => o.value === v)) return;
    handedOver.push({ el, label, want: v }); el.value = v; uebergeben.add(el.id);
  };
  // Übergabe aus Ideen/Schatzkammer/Assoziation überschreibt den Kontext
  try {
    const pend = localStorage.getItem("dm_pending_ctx");
    if (pend) {
      const c = JSON.parse(pend) as Record<string, string>;
      hand(who, "Wer", c.who); hand(where, "Wo", c.where); hand(when, "Wann", c.when); hand(what, "Was passiert", c.what);
      localStorage.removeItem("dm_pending_ctx");
    }
  } catch { /* ignore */ }
  // Übergabe aus Welt/Omnikognition (setzt Regler, Stärke, Wortbank)
  let pendingStudio: Record<string, unknown> | null = null;
  try { const s = localStorage.getItem("dm_pending_studio"); if (s) { pendingStudio = JSON.parse(s) as Record<string, unknown>; localStorage.removeItem("dm_pending_studio"); } } catch { /* ignore */ }
  if (pendingStudio) {
    const P = pendingStudio;
    hand(where, "Wo", P["where"]); hand(when, "Wann", P["when"]); hand(who, "Wer", P["who"]); hand(what, "Was passiert", P["what"]);
    hand(form, "Form", P["form"]); hand(structure, "Struktur", P["structure"]); hand(persp, "Perspektive", P["perspective"]);
    hand(rhythm, "Rhythmus", P["rhythm"]); hand(varianz, "Varianz", P["varLevel"]); hand(mode, "Modus", P["mode"]);
    hand(tone, "Ton", P["tone"]); hand(markov, "Markov", P["markovMode"]); hand(archA, "Archetyp A", P["archetypeA"]);
    hand(archB, "Archetyp B", P["archetypeB"]); hand(disruptor, "Disruptor", P["disruptor"]); hand(instab, "Instabilität", P["instability"]);
    const emp = P["emphasis"] as Record<string, number> | undefined;
    if (emp) {
      wWo.value = String(emp.wo ?? 0); wWann.value = String(emp.wann ?? 0);
      wWer.value = String(emp.wer ?? 0); wWas.value = String(emp.was ?? 0);
      for (const w of [wWo, wWann, wWer, wWas]) uebergeben.add(w.id);
    }
    if (P["bank"]) {
      saveBank(P["bank"] as never); saveActiveBankLabel("Wahrnehmung (Omnikognition)");
      if (!preset.querySelector('option[value="__omni__"]')) {
        const o = document.createElement("option"); o.value = "__omni__"; o.textContent = "Wahrnehmung (Omnikognition)"; preset.insertBefore(o, preset.firstChild);
      }
      preset.value = "__omni__";
    }
  } else if (!studioSchonGewuerfelt) {
    // Zufallsstart: alle Regler würfeln (gesperrte bleiben; kein dispatch, generate() folgt am Ende).
    // NUR beim ersten Aufbau je Sitzung — mountStudio läuft bei jedem Tab-Wechsel erneut,
    // und ein Neuwürfeln dort zerstört jeden Vergleichslauf (Ton sprang von Nüchtern
    // auf Hoffnungsvoll, Rhythmus von Fraktur auf Klar).
    ROLL_SELECTS.forEach((s) => { if (!locked.has(s.id) && s.options.length) s.selectedIndex = Math.floor(Math.random() * s.options.length); });
    studioSchonGewuerfelt = true;
  } else {
    // Rückkehr in den Tab: zuletzt gewählte Reglerstellung wiederherstellen
    for (const s of ROLL_SELECTS) { const v = studioReglerStand[s.id]; if (v !== undefined && Array.from(s.options).some((o) => o.value === v)) s.value = v; }
    // Das PRESET braucht mehr als eine Zuweisung.
    //
    // Gemeldet: Würfelt man im Schaltplan „Alles würfeln", passiert im Studio
    // nichts. Der Wurf kam durchaus an — aber `preset.value = x` laedt keine
    // Wortbank; das geschieht erst im change-Handler. Das Auswahlfeld zeigte
    // also den Wurf, die Bank blieb die alte, und eine vorher getroffene
    // Mehrfachauswahl stand weiter in `multiIds`. Studio und Plan sagten
    // Verschiedenes, weil nur die Haelfte des Weges gegangen wurde.
    const pv = studioReglerStand[preset.id];
    if (pv !== undefined && pv !== MULTI_ID && pv !== AUTOMIX_ID
      && Array.from(preset.options).some((o) => o.value === pv)) {
      // Eine alte Mehrfachauswahl muss weichen: Sonst zeigte die Kopfzeile
      // weiter die Mischung, waehrend das Feld ein einzelnes Preset fuehrt.
      if (multiIds.length) { multiIds = []; saveMulti(); }
      preset.value = pv;
      preset.dispatchEvent(new Event("change"));
    }
  }
  restoreLocked();
  // Reglerstand festhalten, damit die Rückkehr in den Tab ihn wiederherstellen kann
  // Die Schieber gehören in denselben Merkzettel: Sonst käme ein Wurf, der im
  // Reiter Diagnose gefallen ist, beim Zurückwechseln nur zur Hälfte an.
  const ROLL_RANGES: HTMLInputElement[] = [lenSlider, novSlider, surpSlider, wWo, wWann, wWer, wWas];
  // Die vier W gehören seit 4.294.0 dazu. Gemeldet: „Material, Vier W werden
  // nicht gewürfelt bei Alles würfeln." Sie werden jetzt auch im Reiter
  // Diagnose gewürfelt — und damit dieser Wurf beim Zurückwechseln ankommt,
  // muss der Merkzettel sie kennen. Nebeneffekt, der lange fällig war: Der
  // Kontext überlebt jetzt einen Reiterwechsel auch ohne „Kontext merken".
  const ROLL_TEXTE: HTMLInputElement[] = [where, when, who, what];
  const merkeRegler = (): void => {
    for (const s of ROLL_SELECTS) studioReglerStand[s.id] = s.value;
    for (const r of [...ROLL_RANGES, ...ROLL_TEXTE]) studioReglerStand[r.id] = r.value;
  };
  ROLL_SELECTS.forEach((s) => s.addEventListener("change", () => { studioReglerStand[s.id] = s.value; }));
  [...ROLL_RANGES, ...ROLL_TEXTE].forEach((r) => r.addEventListener("input", () => { studioReglerStand[r.id] = r.value; }));
  for (const r of ROLL_RANGES) { const v = studioReglerStand[r.id]; if (v !== undefined && !uebergeben.has(r.id)) { r.value = v; r.dispatchEvent(new Event("input")); } }
  for (const r of ROLL_TEXTE) { const v = studioReglerStand[r.id]; if (v !== undefined && v !== "" && !uebergeben.has(r.id)) r.value = v; }
  updHints(); ctxSichern();
  merkeRegler();
  // Der Schaltplan im Reiter Diagnose liest diesen Stand. Geschrieben wird bei
  // JEDER Änderung, nicht erst beim Erzeugen: Sonst zeigte der Plan, was beim
  // vorletzten Text galt, und wäre damit genau die Rateei, die er abstellen soll.
  // Vier Werte stehen nicht in `einstellungen()`, gehören aber in den Plan:
  // Sie steuern nicht den Satzbau, sondern die AUSWAHL unter den Fassungen
  // (Neuheit, Überraschung) und die Umwelt. Gemeldet wurde ein verwandter Fall:
  // „Bei Länge ist das Schloss gesetzt, wird aber nicht angezeigt."
  const anlageSichern = (): void => saveAnlage({
    regler: {
      ...einstellungen(),
      umwelt: umweltIn.value, umweltWirkung: umweltSel.value,
      gewicht: [wWo.value, wWann.value, wWer.value, wWas.value].join("/"),
      novelty: novSlider.value, surprise: surpSlider.value,
    },
    w4: { where: where.value, when: when.value, who: who.value, what: what.value },
    zeit: new Date().toISOString(),
    quelle: letzteQuelle,
  });
  ROLL_SELECTS.forEach((s) => s.addEventListener("change", anlageSichern));
  [where, when, who, what, umweltIn, novSlider, surpSlider, lenSlider, wWo, wWann, wWer, wWas].forEach((i) => i.addEventListener("input", anlageSichern));
  umweltSel.addEventListener("change", anlageSichern);
  anlageSichern();
  // Schlösser haben Übergabewerte überschrieben? Hinweis mit Sofortlösung zeigen.
  const blocked = handedOver.filter((h) => locked.has(h.el.id) && h.el.value !== h.want);
  if (blocked.length) {
    const names = blocked.map((b) => b.label).join(", ");
    const applyBtn = button("Schlösser öffnen und übernehmen");
    applyBtn.addEventListener("click", () => {
      for (const b of blocked) { locked.delete(b.el.id); delete lockVals[b.el.id]; b.el.value = b.want; }
      saveLocks(); saveLockVals();
      Object.keys(lockPainters).forEach((id) => (lockPainters[id] || []).forEach((m) => m.paint()));
      lockBar.remove(); updHints(); renderPresetChecks(); generate();
    });
    const closeBtn = el("button", { class: "x", type: "button", "aria-label": "Hinweis schließen" }, "✕");
    closeBtn.addEventListener("click", () => lockBar.remove());
    lockBar.append(
      el("span", {}, `🔒 Übernahme unvollständig: ${blocked.length === 1 ? "Ein Feld wurde" : blocked.length + " Felder wurden"} nicht übernommen, weil das Schloss geschlossen ist — ${names}.`),
      applyBtn, closeBtn);
    wrap.insertBefore(lockBar, wrap.firstChild);
  }
  lenVal.textContent = lenSlider.value;
  updNovVal(); updSurpVal(); rangeVal.textContent = "#" + rangeSlider.value;   // Anzeigen nach restoreLocked nachziehen
  updEmphVis();
  applyStoryFont(out, fontSel.value, parseFloat(sizeSlider.value));
  if (!pendingStudio) { if (preset.value === AUTOMIX_ID) { saveBank(buildAutoMixBank()); saveActiveBankLabel("Auto-Mix"); } else { const first = getAllPresets()[preset.value]; if (first) { saveBank(first.bank); saveActiveBankLabel(first.label || preset.value); } } }
  // Mehrfach-Preset-Auswahl nach Neustart wiederherstellen (Merge-Bank + Dropdown-Zustand)
  if (multiIds.length >= 2) { ensureMultiOption(); preset.value = MULTI_ID; applyMulti(); }
  renderPresetChecks();
  updHints();
  requestAnimationFrame(positionArrows);
  let pendingText = "";
  try { pendingText = localStorage.getItem("dm_pending_text") || ""; localStorage.removeItem("dm_pending_text"); } catch { /* ignore */ }
  if (pendingText.trim()) {
    out.textContent = pendingText;
    nachTextwechsel();
    try { localStorage.setItem("dm_last_text", pendingText); } catch { /* voll */ }
    renderKling(readInput().form, pendingText);
    refreshFeeds();
  } else {
    generate();
  }
}
