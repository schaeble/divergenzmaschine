// Themenpool im Sammler: 4W aus Wikidata, kostenlos und mit Beleg.
//
// Der Abschnitt hält sich an dieselbe Bauart wie der Bildsammler daneben:
// wählen, holen, ansehen, in den Vorrat legen. Der Vorrat ist ein eigener —
// das Material ist verschieden. Der Tagesfeed gibt Ereignisse, der Bildsammler
// Dinge und Orte, der Themenpool Personen und ihre Werke.
import { el, button } from "./dom";
import { icon } from "./icons";
import {
  THEMEN, themaVon, holeThema, ladeThemen, sichereThemen, leereThemen,
  mischeThemen, themenStand, ziehThema, THEMA_DECKEL, type ThemaFund,
} from "../features/themenpool";

export function baueThemenpool(): HTMLElement {
  const wrap = el("div", { class: "card" });
  const wahl = el("select", { id: "f-thema" }) as HTMLSelectElement;
  for (const t of THEMEN) wahl.append(el("option", { value: t.id }, t.label));
  const hinweis = el("p", { class: "muted mini" }, "");
  const zeigeHinweis = (): void => {
    const t = themaVon(wahl.value);
    hinweis.textContent = t ? t.hinweis : "";
  };
  wahl.addEventListener("change", zeigeHinweis);
  zeigeHinweis();

  const holen = el("button", { class: "primary" }, icon("book"), " Thema holen") as HTMLButtonElement;
  const status = el("span", { class: "muted" }, "");
  const liste = el("div", {});
  const stand = el("span", { class: "muted" }, "");
  const probe = button("Fund ziehen");
  const weg = button("Themenpool leeren", "danger");
  const probeAus = el("p", { class: "muted" }, "");

  const zeigeStand = (): void => {
    const st = themenStand();
    stand.textContent = st.funde
      ? `Themenpool: ${st.funde} Funde aus ${st.themen} ${st.themen === 1 ? "Thema" : "Themen"} — die Taste „Thema“ im Studio zieht daraus`
      : "Themenpool leer — die Taste „Thema“ im Studio hat noch nichts zu ziehen";
    for (const b of [probe, weg]) {
      if (st.funde) b.removeAttribute("disabled"); else b.setAttribute("disabled", "");
    }
  };

  probe.addEventListener("click", () => {
    const f = ziehThema();
    probeAus.textContent = f
      ? `${f.themaLabel} · ${[f.ctx.who, f.ctx.what, f.ctx.when, f.ctx.where].filter(Boolean).join(" · ")}`
      : "";
  });
  weg.addEventListener("click", () => {
    if (!confirm("Den ganzen Themenpool löschen? Die Taste „Thema“ im Studio hat danach nichts mehr zu ziehen.")) return;
    leereThemen(); probeAus.textContent = ""; liste.innerHTML = ""; zeigeStand();
  });

  const zeichne = (funde: ThemaFund[]): void => {
    liste.innerHTML = "";
    if (!funde.length) return;
    for (const f of funde.slice(0, 40)) {
      const vier = ([["Wer", f.ctx.who], ["Was", f.ctx.what], ["Wann", f.ctx.when], ["Wo", f.ctx.where]] as [string, string][])
        .filter(([, v]) => v)
        .map(([k, v]) => el("span", { class: "tchip" }, el("span", { class: "sam-w" }, k + ": "), v));
      // Der Beleg gehört sichtbar dazu: Wer wissen will, ob es die Person gibt,
      // soll nachsehen können. Das ist der Unterschied zu erfundenem Material.
      const beleg = f.qid
        ? el("a", { class: "help-jump", href: `https://www.wikidata.org/wiki/${f.qid}`, target: "_blank", rel: "noopener" }, f.qid)
        : el("span", { class: "muted mini" }, "ohne Beleg");
      // Dieselben Klassen wie die Fundkarten darüber — eine eigene wäre eine
      // zweite Wahrheit über dasselbe Aussehen.
      const chips = el("div", { class: "chips" });
      for (const v of vier) chips.append(v);
      liste.append(el("div", { class: "idea" },
        el("div", { class: "idea-text" }, el("b", {}, f.titel), " ", beleg, chips)));
    }
    if (funde.length > 40) liste.append(el("p", { class: "muted mini" }, `… und ${funde.length - 40} weitere im Pool.`));
  };

  let laeuft = false;
  holen.addEventListener("click", () => {
    if (laeuft) return;
    const t = themaVon(wahl.value);
    if (!t) return;
    laeuft = true;
    holen.setAttribute("disabled", "");
    status.textContent = `„${t.label}“ wird geholt …`;
    liste.innerHTML = "";
    holeThema(t).then((funde) => {
      if (!funde.length) {
        status.textContent = "Wikidata hat geantwortet, aber nichts Brauchbares geliefert.";
        return;
      }
      const vorher = ladeThemen().length;
      const neu = mischeThemen(ladeThemen(), funde);
      sichereThemen(neu);
      status.textContent = `${funde.length} Funde gelesen, ${neu.length - vorher} neu im Pool.`;
      zeichne(funde);
      zeigeStand();
    }).catch((e: unknown) => {
      // Beim Namen nennen, was nicht ging. „Fehler" allein hilft niemandem.
      status.textContent = "Wikidata war nicht erreichbar ("
        + (e instanceof Error ? e.message : String(e))
        + "). Der Themenpool braucht einmal eine Verbindung; danach arbeitet er offline.";
    }).finally(() => { laeuft = false; holen.removeAttribute("disabled"); });
  });

  wrap.append(
    el("h3", {}, "Themenpool — 4W aus Wikidata"),
    el("p", { class: "muted" },
      "Fertige Abfragen an Wikidata, die strukturierte Wissensbasis hinter Wikipedia. "
      + "Sie liefert Beruf, Ort, Jahr und Werk als eigene Felder — genau die vier W, "
      + "ohne dass sie aus einem Fließtext geraten werden müssen. "
      + "Kostenlos und ohne Schlüssel; jeder Fund trägt seine Wikidata-Nummer als Beleg. "
      + `Der Pool fasst ${THEMA_DECKEL} Funde und wandert mit „Exportieren“ in die Projektdatei.`),
    el("div", { class: "btnrow" }, wahl, holen, status),
    hinweis,
    el("div", { class: "btnrow" }, stand),
    el("div", { class: "btnrow" }, probe, weg),
    probeAus,
    liste);
  zeigeStand();
  return wrap;
}
