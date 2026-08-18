// Wirkungsmesser — die Ansicht. Die Rechnung steht in features/wirkung.ts.
//
// Was hier NICHT gezeigt wird: eine Bestenliste, ein Gesamturteil, ein
// „Optimum". Der Messwert ist der Ausschlag im Verhältnis zum Rauschen, und
// mehr sagt er auch nicht. Welche Einstellung gut ist, entscheidet weiterhin
// der Leser — das Instrument sagt nur, welche Regler überhaupt etwas ändern.
import { el, select } from "./dom";
import { icon } from "./icons";
import { loadBank } from "../storage";
import { buildModelFromCorpus, loadPersistentCorpus } from "../corpus";
import { randomContext } from "../generation/context";
import {
  reglerListe, misseStellung, fasseZusammen, MASSE, band, BAND_LABEL,
  type ReglerMessung, type Stellung,
} from "../features/wirkung";
import type { GenInput } from "../types";

const CTX_KEY = "divergenz_ctx_v1";

/** Die Grundeinstellung, gegen die gemessen wird. Der 4W-Kontext kommt aus dem
 *  Studio, wenn er gemerkt ist — sonst gewürfelt. Alles andere steht fest:
 *  Gemessen wird die Wirkung EINES Reglers, also müssen die übrigen ruhig
 *  liegen. „Auto" wäre hier der Fehler, der die Messung zu Rauschen macht. */
function grundEinstellung(form: string, lenTarget: number): GenInput {
  let ctx = randomContext();
  try {
    const roh = localStorage.getItem(CTX_KEY);
    if (roh) { const c = JSON.parse(roh) as Record<string, string>; if (c.who || c.what) ctx = { ...ctx, ...c }; }
  } catch { /* egal */ }
  return {
    where: ctx.where, when: ctx.when, who: ctx.who, what: ctx.what,
    tone: "neutral", varLevel: "mid", form, structure: "linear", mode: "bureau",
    perspective: "third", rhythm: "clean", markovMode: "off", disruptor: "none",
    archetypeA: "neutral", archetypeB: "neutral", instability: 0, ressort: "auto",
    shots: 4, totalSec: 30, lenTarget, tension: "auto",
    emphasis: { wo: 0, wann: 0, wer: 0, was: 0 },
  } as unknown as GenInput;
}

export function mountWirkung(): HTMLElement {
  const wrap = el("div", { class: "card" });
  wrap.append(
    el("h3", { class: "wm-h" }, "Wirkungsmesser"),
    el("p", { class: "muted" },
      "Für jeden Regler einzeln: alle Stellungen durchfahren, alles andere festhalten, je N Texte messen. "
      + "Der Wert ist der ", el("b", {}, "Ausschlag im Verhältnis zum Rauschen"), " — die Spanne zwischen den Stellungen, "
      + "geteilt durch die Streuung innerhalb einer Stellung. Unter 1 bewegt der Regler weniger als der Zufall "
      + "zwischen zwei Läufen derselben Einstellung."),
    el("p", { class: "muted" },
      "Die ", el("b", {}, "Blindprobe"), " ist ein Regler, der nichts ändert. Sie muss unter 1 bleiben. "
      + "Tut sie es nicht, misst das Instrument Rauschen als Wirkung und alle anderen Zahlen sind wertlos — "
      + "lies sie zuerst."));

  const formSel = select("wm-form", [
    ["prose", "Prosa"], ["bericht", "Bericht"], ["meldung", "Meldung"],
    ["reim", "Reim"], ["haiku", "Haiku"], ["script", "Szene/Dialog"], ["poem", "Prosagedicht"],
  ], "prose");
  const nSel = select("wm-n", [["8", "8"], ["14", "14"], ["24", "24"], ["40", "40"]], "14");
  const startBtn = el("button", { class: "primary" }, icon("play"), " Messen") as HTMLButtonElement;
  const status = el("span", { class: "muted mini" }, "");
  const balken = el("div", { class: "wm-fortschritt" }, el("div", { class: "wm-fuellung" }));
  const liste = el("div", {});

  const legende = el("div", { class: "wm-legende muted mini" },
    el("span", {}, el("i", { class: "wm-punkt wm-p-rauschen" }), " unter 1 — unter dem Rauschen"),
    el("span", {}, el("i", { class: "wm-punkt wm-p-schwach" }), " 1–2 — knapp darüber"),
    el("span", {}, el("i", { class: "wm-punkt wm-p-deutlich" }), " 2–5 — bewegt deutlich"),
    el("span", {}, el("i", { class: "wm-punkt wm-p-stark" }), " über 5 — bewegt stark"),
    el("span", {}, "· der senkrechte Strich im Balken ist die Rauschschwelle · Zeile anklicken zeigt die Maße"));

  wrap.append(el("div", { class: "btnrow" },
    el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, "Form"), formSel),
    el("label", { class: "druckfeld" }, el("span", { class: "field-label" }, "Läufe je Stellung"), nSel),
    startBtn, status), balken, legende, liste);

  const zeichne = (mess: ReglerMessung[]): void => {
    liste.innerHTML = "";
    const sortiert = [...mess].sort((a, b) => b.wirkung - a.wirkung);
    const max = Math.max(1.5, ...sortiert.map((r) => r.wirkung));
    // Die Rauschschwelle als Strich AN DER RICHTIGEN STELLE: bei 1 auf derselben
    // Skala wie die Balken. Vorher saß sie am linken Rand und markierte damit
    // die Null — sichtbar, aber sinnlos.
    const schwelle = Math.min(100, (1 / max) * 100);
    for (const r of sortiert) {
      const anteil = Math.min(1, r.wirkung / max);
      const b = band(r.wirkung);
      const kopf = el("div", { class: "wm-zeile wm-" + b, title: `${BAND_LABEL[b]} — Ausschlag ${r.wirkung.toFixed(2)}× so groß wie das Rauschen` },
        el("span", { class: "wm-name" }, r.label),
        el("span", { class: "wm-bar" },
          el("span", { class: "wm-schwelle", style: `left:${schwelle.toFixed(2)}%` }),
          el("span", { class: "wm-fill", style: `width:${(anteil * 100).toFixed(1)}%` })),
        el("span", { class: "wm-wert" }, r.wirkung.toFixed(2)),
        el("span", { class: "wm-mass muted mini" }, r.staerkstesMass));
      const detail = el("div", { class: "wm-detail" });
      // Aufklappen: welches Maß bewegt sich, und wohin je Stellung.
      let offen = false;
      kopf.addEventListener("click", () => {
        offen = !offen;
        detail.innerHTML = "";
        if (!offen) return;
        const tabelle = el("table", { class: "wm-tab" });
        const kopfz = el("tr", {}, el("th", {}, "Maß"), ...r.stellungen.map((s: Stellung) => el("th", {}, s.wert)), el("th", {}, "Wirkung"));
        tabelle.append(kopfz);
        for (const { name } of MASSE) {
          const werte = r.stellungen.map((s) => s.mittel[name] ?? 0);
          const hi = Math.max(...werte), lo = Math.min(...werte);
          tabelle.append(el("tr", {},
            el("td", {}, name),
            ...werte.map((v) => {
              const z = el("td", {}, v.toFixed(3));
              if (v === hi && hi !== lo) z.className = "wm-hoch";
              if (v === lo && hi !== lo) z.className = "wm-tief";
              return z;
            }),
            el("td", { class: "wm-wert" }, (r.wirkungJeMass[name] ?? 0).toFixed(2))));
        }
        detail.append(tabelle);
      });
      liste.append(kopf, detail);
    }
  };

  startBtn.addEventListener("click", () => {
    const N = parseInt(nSel.value, 10) || 14;
    const bank = loadBank();
    const korpus = (() => { try { return loadPersistentCorpus(); } catch { return ""; } })();
    // Ohne Korpus kann Markov nicht wirken. Das gehört gesagt, sonst sieht ein
    // stummer Regler wie ein toter aus — und genau darüber urteilt dieses Blatt.
    const model = korpus.trim().length > 200 ? buildModelFromCorpus(2) : undefined;
    const basis = grundEinstellung(formSel.value, 120);
    const regler = reglerListe();
    const aufgaben: { r: number; w: number }[] = [];
    regler.forEach((r, i) => r.werte.forEach((_, j) => aufgaben.push({ r: i, w: j })));

    const roh: Stellung[][] = regler.map(() => []);
    let k = 0;
    startBtn.disabled = true;
    liste.innerHTML = "";
    const fuellung = balken.firstElementChild as HTMLElement;

    const schritt = (): void => {
      const t0 = Date.now();
      // Häppchenweise, aber nicht einzeln: Ein Zeitfenster von 60 ms hält die
      // Oberfläche wach und braucht trotzdem nicht tausend Rückläufe.
      while (k < aufgaben.length && Date.now() - t0 < 60) {
        const a = aufgaben[k]!;
        const def = regler[a.r]!;
        roh[a.r]!.push(misseStellung(bank, basis, def, def.werte[a.w]!, N, model));
        k++;
      }
      const p = k / aufgaben.length;
      fuellung.style.width = (p * 100).toFixed(1) + "%";
      status.textContent = `${k} von ${aufgaben.length} Stellungen · ${(k * N)} Texte`;
      if (k < aufgaben.length) { setTimeout(schritt, 0); return; }
      const mess = regler.map((r, i) => fasseZusammen(r.id, r.label, roh[i]!));
      zeichne(mess);
      const blind = mess.find((x) => x.id === "blindprobe");
      status.textContent = `${aufgaben.length} Stellungen · ${aufgaben.length * N} Texte`
        + (blind ? ` · Blindprobe ${blind.wirkung.toFixed(2)}${blind.wirkung >= 1 ? " — ACHTUNG: über der Schwelle, die Messung trägt nicht" : ""}` : "")
        + (model ? "" : " · Korpus zu klein: Markov kann nicht wirken");
      startBtn.disabled = false;
    };
    setTimeout(schritt, 0);
  });

  return wrap;
}
