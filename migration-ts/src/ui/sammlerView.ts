// Reiter „Sammler“: holt aus dem Tagesfeed der deutschen Wikipedia
// (Artikel des Tages, „Was geschah am …“, In den Nachrichten) Vorschläge für
// die vier W und übergibt sie an das Studio.
//
// Der einzige Teil der Maschine, der von sich aus ins Netz greift. Ohne
// Verbindung sagt er das und tut sonst nichts — der Rest der App bleibt
// offline lauffähig.
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  holeTagesfeed, zerlegeFeed, zufallsTag, datumLang,
  ergaenzeVorrat, ladeVorrat, leereVorrat, vorratStand, ziehVorrat, VORRAT_DECKEL,
  type WikiFund, type QuellenWahl,
  istLexikon,
} from "../features/wikisammler";
import { appendToPersistentCorpus, loadPersistentCorpus } from "../corpus";
import { baueBildsammler } from "./bildsammlerView";
import { baueAbschrift } from "./abschriftView";
import { baueThemenpool } from "./themenpoolView";

const WAHL_KEY = "divergenz_sammler_quellen_v1";

function ladeWahl(): QuellenWahl {
  try {
    const r = JSON.parse(localStorage.getItem(WAHL_KEY) || "{}") as Partial<QuellenWahl>;
    return { tfa: r.tfa !== false, jahrestage: r.jahrestage !== false, nachrichten: r.nachrichten !== false };
  } catch { return { tfa: true, jahrestage: true, nachrichten: true }; }
}
function sichereWahl(w: QuellenWahl): void {
  try { localStorage.setItem(WAHL_KEY, JSON.stringify(w)); } catch { /* Speicher gesperrt */ }
}

export function mountSammler(root: HTMLElement): void {
  root.innerHTML = "";
  const wrap = el("div", {});
  const wahl = ladeWahl();

  // ── Kopf ─────────────────────────────────────────────────────────────────
  wrap.append(el("div", { class: "card" },
    el("p", { class: "fund-text" },
      "Ein zufälliger Tag aus dem zurückliegenden Jahr, gelesen aus der deutschen Wikipedia: ",
      el("b", {}, "Artikel des Tages"), ", ", el("b", {}, "Was geschah am …"), " und ",
      el("b", {}, "In den Nachrichten"), ". Jeder Fund wird in Wo / Wann / Wer / Was zerlegt und lässt sich ins Studio übernehmen."),
    el("p", { class: "muted" },
      "Dies ist der einzige Teil der Maschine, der ohne KI-Schlüssel ins Netz greift — abgerufen wird nur der öffentliche Tagesfeed, es werden keine Daten gesendet. "
      + "Personen und Orte werden aus den Strukturdaten des Feeds bestimmt (Koordinaten, Kurzbeschreibung), nicht geraten. "
      + "Was nicht sicher bestimmbar ist, bleibt leer — und ein leeres Feld lässt beim Übernehmen den bisherigen Studio-Wert stehen."),
    el("p", { class: "muted" },
      `Jeder geholte Tag wandert in den Vorrat (bis ${VORRAT_DECKEL} Funde, danach fällt der älteste heraus). `
      + "Der Vorrat liegt im Browser und wandert mit „Exportieren“ in die Projektdatei. "
      + "Die Taste „Wiki“ im Studio zieht daraus — ohne Netz.")));

  // ── Bedienleiste ─────────────────────────────────────────────────────────
  const wuerfel = el("button", { class: "primary" }, icon("dice"), " Tag würfeln");
  const heute = button("Heute");
  const datumTxt = el("span", { class: "muted" }, "");
  const status = el("span", { class: "muted" }, "");

  const hakenFuer = (label: string, schluessel: keyof QuellenWahl): HTMLElement => {
    const h = el("input", { type: "checkbox" }) as HTMLInputElement;
    h.checked = wahl[schluessel];
    h.addEventListener("change", () => { wahl[schluessel] = h.checked; sichereWahl(wahl); zeichne(); });
    return el("label", { class: "chk" }, h, el("span", {}, label));
  };

  wrap.append(el("div", { class: "btnrow" }, wuerfel, heute, datumTxt, status));
  wrap.append(el("div", { class: "chkrow" },
    el("span", { class: "chips-label" }, "Quellen:"),
    hakenFuer("Artikel des Tages", "tfa"),
    hakenFuer("Was geschah am …", "jahrestage"),
    hakenFuer("In den Nachrichten", "nachrichten")));

  // ── Vorrat ───────────────────────────────────────────────────────────────
  const vorratTxt = el("span", { class: "muted" }, "");
  const vorratProbe = button("Fund ziehen");
  const vorratWeg = button("Vorrat leeren", "danger");
  const zeigeVorrat = (): void => {
    const st = vorratStand();
    vorratTxt.textContent = st.funde
      ? `Vorrat: ${st.funde} Funde aus ${st.tage} ${st.tage === 1 ? "Tag" : "Tagen"} — die Taste „Wiki“ im Studio zieht daraus`
      : "Vorrat leer — die Taste „Wiki“ im Studio hat noch nichts zu ziehen";
    if (st.funde) { vorratProbe.removeAttribute("disabled"); vorratWeg.removeAttribute("disabled"); }
    else { vorratProbe.setAttribute("disabled", ""); vorratWeg.setAttribute("disabled", ""); }
  };
  const probeAus = el("p", { class: "muted" }, "");
  vorratProbe.addEventListener("click", () => {
    const f = ziehVorrat(ladeVorrat());
    probeAus.textContent = f
      ? `${f.tag} · ${f.quelleLabel}: ${[f.ctx.who, f.ctx.what, f.ctx.when, f.ctx.where].filter(Boolean).join(" · ")}`
      : "";
  });
  vorratWeg.addEventListener("click", () => {
    if (!confirm("Den ganzen Sammler-Vorrat löschen? Die Taste „Wiki“ im Studio hat danach nichts mehr zu ziehen.")) return;
    leereVorrat(); probeAus.textContent = ""; zeigeVorrat();
  });
  wrap.append(el("div", { class: "card" },
    el("div", { class: "btnrow" }, vorratTxt),
    el("div", { class: "btnrow" }, vorratProbe, vorratWeg),
    probeAus));
  zeigeVorrat();

  const liste = el("div", {});
  /** Welche Funde des Tages in den Korpus sollen. Ein WeakMap-artiger Bezug
   *  auf die Fund-Objekte selbst: Beim Neuzeichnen entstehen neue Objekte, und
   *  die Auswahl beginnt dann bewusst von vorn — sie gehört zum angezeigten
   *  Tag, nicht zum Vorrat. */
  const gewaehlt = new Map<WikiFund, boolean>();
  const korpusStand = el("span", { class: "muted mini" }, "");
  const korpusBtn = el("button", { class: "primary" }, icon("arrowRight"), " Auswahl in den Korpus") as HTMLButtonElement;
  const korpusZeile = el("div", { class: "btnrow", style: "display:none" }, korpusBtn, korpusStand);

  const gewaehlteTexte = (): string[] =>
    [...gewaehlt.entries()].filter(([, an]) => an).map(([f]) => f.volltext.trim()).filter(Boolean);

  function standZeigen(): void {
    const t = gewaehlteTexte();
    const zeichen = t.join(" ").length;
    korpusStand.textContent = t.length
      ? `${t.length} Funde · ${zeichen} Zeichen · Korpus derzeit ${loadPersistentCorpus().length}`
      : `nichts gewählt · Korpus derzeit ${loadPersistentCorpus().length} Zeichen`;
    korpusBtn.disabled = !t.length;
  }

  korpusBtn.addEventListener("click", () => {
    const t = gewaehlteTexte();
    if (!t.length) return;
    const vorher = loadPersistentCorpus().length;
    appendToPersistentCorpus(t.join(" "));
    status.textContent = `${t.length} Funde übernommen — Korpus ${vorher} → ${loadPersistentCorpus().length} Zeichen.`;
    standZeigen();
  });

  // Die Sammelzeile ueber der Liste: Bei vierzig Funden waere ein Knopf ganz
  // unten nach dem Scrollen nicht mehr auffindbar.
  wrap.append(korpusZeile, liste);
  // Der Bildsammler steht unter dem Tagesfeed: dieselbe Aufgabe — Material von
  // aussen hereinholen —, aber ein anderer Weg hinein, und anders als der Feed
  // kostet er Geld. Deshalb darunter und nicht darueber.
  wrap.append(baueBildsammler());
  // Die Abschrift zuletzt: Sie ist das Gegenteil des Bildsammlers — nichts wird
  // formuliert und nichts gefiltert — und liefert Text am Stueck statt 4W.
  wrap.append(baueAbschrift());
  wrap.append(baueThemenpool());
  root.append(wrap);

  // ── Zustand ──────────────────────────────────────────────────────────────
  let rohFeed: unknown = null;
  let datum = new Date();
  let laeuft = false;

  const insStudio = (f: WikiFund): void => {
    // Nur gefüllte Felder übergeben: leere würden im Studio ohnehin
    // übersprungen, aber so steht auch in der Ablage nur, was gemeint ist.
    const c: Record<string, string> = {};
    for (const k of ["who", "what", "when", "where"] as const) if (f.ctx[k]) c[k] = f.ctx[k];
    try { localStorage.setItem("dm_pending_ctx", JSON.stringify(c)); } catch { /* Speicher gesperrt */ }
    const tab = [...document.querySelectorAll(".tabbar button")].find((b) => b.textContent === "Studio") as HTMLButtonElement | undefined;
    if (tab) tab.click();
  };

  const karte = (f: WikiFund): HTMLElement => {
    const chips = el("div", { class: "chips" });
    const paare: [string, string][] = [["Wo", f.ctx.where], ["Wann", f.ctx.when], ["Wer", f.ctx.who], ["Was", f.ctx.what]];
    const leer = paare.filter(([, v]) => !v).map(([n]) => n);
    for (const [name, wert] of paare) {
      if (!wert) continue;
      chips.append(el("span", { class: "tchip" }, el("span", { class: "sam-w" }, name + ": "), wert));
    }
    if (leer.length) chips.append(el("span", { class: "muted" }, `${leer.join(", ")} bleibt unverändert`));

    const nimm = el("button", { class: "primary" }, icon("arrowRight"), " Studio");
    nimm.addEventListener("click", () => insStudio(f));
    // Der fehlende Ausgang: Bisher konnte ein Fund nur ins Studio (die vier W),
    // sein TEXT wurde angezeigt und dann weggeworfen.
    const lex = istLexikon(f.volltext);
    const box = el("input", { type: "checkbox" }) as HTMLInputElement;
    box.checked = !lex;
    box.addEventListener("change", () => { gewaehlt.set(f, box.checked); standZeigen(); });
    gewaehlt.set(f, box.checked);
    const marke = el("label", { class: "bsam-satz" + (lex ? " zweifel" : "") }, box,
      el("span", {}, `für den Korpus (${f.volltext.length} Zeichen)`,
        ...(lex ? [el("span", { class: "bsam-zweifel" }, " — beginnt wie eine Lexikondefinition")] : [])));
    const zeile = el("div", { class: "btnrow" }, nimm);
    if (f.url) {
      const a = el("a", { href: f.url, target: "_blank", rel: "noopener noreferrer", class: "kling-link" }, "Artikel lesen ↗");
      zeile.append(a);
    }
    return el("div", { class: "card fund" },
      el("div", { class: "treasure-meta" },
        el("span", { class: "tbadge" }, f.quelleLabel),
        el("span", { class: "tcount" }, f.titel)),
      el("p", { class: "fund-text" }, f.text),
      chips, marke, zeile);
  };

  function zeichne(): void {
    liste.innerHTML = "";
    gewaehlt.clear();
    if (!rohFeed) return;
    const funde = zerlegeFeed(rohFeed, datum, wahl);
    if (!funde.length) {
      liste.append(el("p", { class: "muted" }, "Für diesen Tag liefert der Feed zu den gewählten Quellen nichts. Anderen Tag würfeln oder eine Quelle dazunehmen."));
      return;
    }
    // Ablegen beim Zeichnen, nicht beim Holen: So wandert auch mit, was erst
    // durch das Nachträgliche Anhaken einer Quelle sichtbar wird. Doppeltes
    // schadet nicht — `ergaenzeVorrat` führt Bekanntes zusammen.
    const { neu, gesamt } = ergaenzeVorrat(funde, datum);
    zeigeVorrat();
    status.textContent = `${funde.length} Funde · ${neu} neu im Vorrat (${gesamt})`;
    funde.forEach((f) => liste.append(karte(f)));
    korpusZeile.style.display = funde.length ? "" : "none";
    standZeigen();
  }

  function hole(d: Date): void {
    if (laeuft) return;
    laeuft = true;
    datum = d;
    rohFeed = null;
    liste.innerHTML = "";
    datumTxt.textContent = datumLang(d);
    status.textContent = "hole …";
    wuerfel.setAttribute("disabled", ""); heute.setAttribute("disabled", "");
    holeTagesfeed(d).then((f) => {
      rohFeed = f;
      status.textContent = "";
      zeichne();
    }).catch((e: unknown) => {
      status.textContent = "";
      liste.append(el("p", { class: "sam-warn" },
        "Der Tagesfeed war nicht erreichbar (" + (e instanceof Error ? e.message : String(e)) + "). "
        + "Der Sammler braucht eine Verbindung; alles Übrige arbeitet weiter offline."));
    }).finally(() => {
      laeuft = false;
      wuerfel.removeAttribute("disabled"); heute.removeAttribute("disabled");
    });
  }

  wuerfel.addEventListener("click", () => hole(zufallsTag()));
  heute.addEventListener("click", () => hole(new Date()));
}
