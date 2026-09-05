// Reiter „Erzählerbank" — ein Arbeitsplatz, das Archiv als Bank (Umbau 4.341.0).
//
// Gewünscht: Die zehn Plätze waren seit dem Archiv nur noch Sichtfenster auf
// denselben Vorrat. Jetzt gibt es EINEN Arbeitsplatz zum Schreiben (Titel,
// Text, Bauform) und darunter die Archivliste aller Geschichten, nach
// Bauform gruppiert. Speichern legt ins Archiv, Wählen holt heraus; das
// Archiv ist zugleich der Vorrat, aus dem das Studio unter „Bogen" zieht.
// Alte Plätze wandern beim ersten Aufruf ins Archiv.
import { el } from "./dom";
import { icon } from "./icons";
import { ladeArbeitsplatz, speichereArbeitsplatz, platzBrauchbar, SCHLAGFOLGEN, kiErzaehlung, archiviere, archivEintraege, loescheEintrag,
  ableiteSchlagfolge, eintragId, ladeQuelle, setzeQuelle, speichereArchiv, type Erzaehlung } from "../features/erzaehlerbank";
import { ERZAEHLUNGEN_VORLAGEN } from "../features/erzaehlungen.data";
import { preset2AusText } from "../features/textpreset";

const PHASEN: [keyof ReturnType<typeof preset2AusText>["drama"], string][] = [
  ["einstieg", "Einstieg"], ["mitte", "Mitte"], ["hoehepunkt", "Höhepunkt"], ["schluss", "Schluss"],
  ["ausloeser", "Auslöser"], ["veraenderungen", "Veränderungen"], ["konflikte", "Konflikte"],
];
const SCHLAG_NAMEN: Record<string, string> = { einstieg: "Einstieg", hook: "Haken", regel: "Regel", mitte: "Mitte", mitte2: "Mitte", konflikt: "Konflikt", ausloeser: "Auslöser", wende: "Wende", zeit: "Zeit", hoehepunkt: "Höhepunkt", einsatz: "Einsatz", schluss: "Schluss" };

export function mountErzaehlerbank(root: HTMLElement): void {
  root.innerHTML = "";
  const e = ladeArbeitsplatz();

  // ── Kopf ────────────────────────────────────────────────────────────────
  const kopf = el("div", {},
    el("h2", {}, "Erzählerbank"),
    el("p", { class: "muted" },
      "Ein Arbeitsplatz zum Schreiben, darunter das Archiv aller Geschichten — nach Bauform geordnet. „Speichern“ legt die Geschichte ins Archiv (der Titel ist ihre Identität: gleicher Titel = Fortschritt, neuer Titel = neue Geschichte), „wählen“ holt sie zurück. Das Archiv ist zugleich der Vorrat, aus dem das Studio unter „Bogen“ im Werkzeugkasten zieht: fest je Geschichte, oder würfeln je Erzeugung. Die Wortbank liefert das Was, die Erzählerbank das Wie. Richtwert: 300–400 Wörter; unter 40 gilt ein Text als zu dünn."));

  // Vorlagen: zehn Geschichten, je eine Bauform, direkt ins Archiv.
  const vorlagenBtn = el("button", { type: "button", title: "Zehn eingebaute Geschichten mit unterschiedlichen Bauformen ins Archiv legen. Vorhandene gleichen Titels werden nicht verdoppelt." }, "Vorlagen ins Archiv") as HTMLButtonElement;
  vorlagenBtn.addEventListener("click", () => {
    for (const v of ERZAEHLUNGEN_VORLAGEN) archiviere({ ...v, geburt: v.folge });
    mountErzaehlerbank(root);
  });
  // Archiv leeren: der große Schritt, mit Nachfrage. Der Arbeitsplatz bleibt.
  const archivLeerenBtn = el("button", { type: "button", class: "danger", title: "Alle Geschichten aus dem Archiv löschen. Der Arbeitsplatz bleibt." }, "Archiv leeren") as HTMLButtonElement;
  archivLeerenBtn.addEventListener("click", () => {
    if (!confirm("Alle Geschichten aus dem Archiv löschen? Der Arbeitsplatz bleibt.")) return;
    speichereArchiv({});
    if (ladeQuelle() !== "preset") setzeQuelle("preset");
    mountErzaehlerbank(root);
  });
  kopf.append(el("div", { class: "btnrow", style: "margin-top:8px" }, vorlagenBtn, archivLeerenBtn));

  // ── Arbeitsplatz ────────────────────────────────────────────────────────
  const titelIn = el("input", { type: "text", value: e.titel, maxlength: "60", placeholder: "Titel der Geschichte", style: "width:100%" }) as HTMLInputElement;
  const textIn = el("textarea", { rows: "8", placeholder: "Text der Geschichte (300–400 Wörter)", style: "width:100%" }) as HTMLTextAreaElement;
  textIn.value = e.text;
  const stand = el("span", { class: "muted", style: "font-size:13px;white-space:nowrap" });
  const folgeSel = el("select", { title: "Bauform: die Reihenfolge der Schläge, wenn dieser Bogen im Studio gewählt ist." }) as HTMLSelectElement;
  for (const [k, v] of Object.entries(SCHLAGFOLGEN)) folgeSel.append(el("option", { value: k }, v.name));
  folgeSel.value = e.folge && SCHLAGFOLGEN[e.folge] ? e.folge : "standard";
  let geburt = e.geburt;

  const malStand = (): void => {
    const w = textIn.value.split(/\s+/).filter(Boolean).length;
    stand.textContent = `${w} Wörter`;
    stand.style.color = w >= 40 ? "" : "var(--danger, #b00)";
  };
  const aktuell = (): Erzaehlung => ({ titel: titelIn.value.trim().slice(0, 60), text: textIn.value.trim(), folge: folgeSel.value, geburt });
  const merken = (): void => speichereArbeitsplatz(aktuell());
  titelIn.addEventListener("input", merken);
  textIn.addEventListener("input", () => { malStand(); merken(); malBogen(); });
  folgeSel.addEventListener("change", () => { merken(); malBogen(); });

  // Bogen zeigen: Phasen und — bei „eigen" — die abgeleitete Schlagfolge.
  const bogenBox = el("div", { style: "display:none;font-size:13px;line-height:1.55;border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-top:6px" });
  let bogenAuf = false;
  const malBogen = (): void => {
    if (!bogenAuf) return;
    bogenBox.innerHTML = "";
    if (!platzBrauchbar({ titel: titelIn.value, text: textIn.value })) { bogenBox.append(el("div", { class: "muted" }, "Noch zu wenig Text für einen Bogen.")); return; }
    const d = preset2AusText(textIn.value).drama;
    if (folgeSel.value === "eigen")
      bogenBox.append(el("div", { style: "margin-bottom:6px" }, el("strong", { style: "color:var(--acc2)" }, "Schlagfolge (abgeleitet): "), ableiteSchlagfolge(textIn.value).map((x) => SCHLAG_NAMEN[x] || x).join(" → ")));
    for (const [k, name] of PHASEN) {
      const zeilen = d[k] || [];
      if (zeilen.length) bogenBox.append(el("div", {}, el("strong", { style: "color:var(--acc2)" }, name + ": "), zeilen.join(" · ")));
    }
  };
  const bogenBtn = el("button", { type: "button" }, "Bogen zeigen") as HTMLButtonElement;
  bogenBtn.addEventListener("click", () => { bogenAuf = !bogenAuf; bogenBox.style.display = bogenAuf ? "" : "none"; bogenBtn.textContent = bogenAuf ? "Bogen verbergen" : "Bogen zeigen"; malBogen(); });

  const einfuegen = el("button", { type: "button", title: "Aus der Zwischenablage einfügen" }, icon("paste"), " Einfügen") as HTMLButtonElement;
  einfuegen.addEventListener("click", () => {
    const lesen = navigator.clipboard?.readText?.();
    if (!lesen) { textIn.focus(); return; }
    lesen.then((txt) => { const t = (txt || "").trim(); if (!t) { textIn.focus(); return; } textIn.value = t; textIn.dispatchEvent(new Event("input")); textIn.focus(); }).catch(() => { textIn.focus(); });
  });

  // KI: neu erzählen — in der Bauform des Arbeitsplatzes, Titel als Thema;
  // ersetzt Titel und Text, speichert ins Archiv.
  const kiBtn = el("button", { type: "button", title: "Von der KI neu erzählen lassen — in der gewählten Bauform, der Titel dient als Thema. Titel und Text werden ersetzt und ins Archiv gelegt. Braucht den KI-Schlüssel (Reiter KI)." }, "KI: neu erzählen") as HTMLButtonElement;
  kiBtn.addEventListener("click", () => {
    kiBtn.disabled = true; kiBtn.textContent = "KI erzählt …";
    kiErzaehlung(folgeSel.value, titelIn.value.trim() || undefined).then((neu) => {
      geburt = folgeSel.value;
      titelIn.value = neu.titel; textIn.value = neu.text;
      const ez = aktuell(); speichereArbeitsplatz(ez); archiviere(ez);
      mountErzaehlerbank(root);
    }).catch((err: unknown) => {
      kiBtn.disabled = false; kiBtn.textContent = "KI-Fehler — noch einmal?";
      kiBtn.title = err instanceof Error ? err.message : String(err);
      window.setTimeout(() => { kiBtn.textContent = "KI: neu erzählen"; }, 4000);
    });
  });

  const speichern = el("button", { class: "primary", type: "button", title: "Ins Archiv der gewählten Bauform legen — gleicher Titel sichert den Fortschritt, neuer Titel ist eine neue Geschichte." }, "Speichern") as HTMLButtonElement;
  speichern.addEventListener("click", () => {
    const ez = aktuell();
    if (!platzBrauchbar(ez)) { speichern.textContent = "Zu wenig Text (ab 40 Wörtern)"; window.setTimeout(() => { speichern.textContent = "Speichern"; }, 2000); return; }
    speichereArbeitsplatz(ez); archiviere(ez);
    if (!geburt) geburt = ez.folge;
    speichern.textContent = "Gespeichert ✓";
    window.setTimeout(() => { speichern.textContent = "Speichern"; }, 1500);
    malArchiv();
  });
  const leeren = el("button", { class: "danger", type: "button", title: "Arbeitsplatz leeren — das Archiv bleibt." }, "Arbeitsplatz leeren") as HTMLButtonElement;
  leeren.addEventListener("click", () => {
    if (!confirm("Arbeitsplatz leeren? Das Archiv bleibt.")) return;
    titelIn.value = ""; textIn.value = ""; geburt = undefined; folgeSel.value = "standard";
    speichereArbeitsplatz(aktuell()); malStand(); malBogen();
  });

  // ── Archiv als Liste ────────────────────────────────────────────────────
  // Alle Geschichten, nach Bauform gruppiert; wählen holt in den Arbeitsplatz,
  // „Text löschen" entfernt den gewählten Eintrag unmittelbar aus dem Archiv.
  const archivSel = el("select", { title: "Alle gespeicherten Geschichten, nach Bauform. Wählen holt sie in den Arbeitsplatz." }) as HTMLSelectElement;
  const archivWeg = el("button", { type: "button", class: "danger", title: "Die gewählte Geschichte sofort aus dem Archiv löschen. Der Arbeitsplatz bleibt.", "aria-label": "Gewählte Geschichte aus dem Archiv löschen" }, "Text löschen") as HTMLButtonElement;
  const archivStand = el("span", { class: "muted mini" });
  const malArchiv = (): void => {
    const alle = archivEintraege();
    archivSel.innerHTML = "";
    archivSel.append(el("option", { value: "" }, alle.length ? `— ${alle.length} gespeichert: wählen —` : "— nichts gespeichert —"));
    for (const [k, v] of Object.entries(SCHLAGFOLGEN)) {
      const gruppe = alle.filter((x) => (x.folge || "standard") === k);
      if (!gruppe.length) continue;
      const og = el("optgroup", { label: v.name });
      for (const x of gruppe) {
        const geliehen = x.geburt && x.geburt !== k;
        og.append(el("option", { value: x.id, title: geliehen ? `Unter „${SCHLAGFOLGEN[x.geburt!]?.name || x.geburt}“ entstanden — hier geliehen.` : "" },
          (x.titel || "Ohne Titel") + (geliehen ? ` · ⇄ ${SCHLAGFOLGEN[x.geburt!]?.name || x.geburt}` : "")));
      }
      archivSel.append(og);
    }
    archivSel.disabled = !alle.length;
    archivWeg.disabled = true;
    const q = ladeQuelle();
    const gewaehlt = alle.find((x) => x.id === q);
    archivStand.textContent = q === "wuerfeln" ? "Studio: würfelt je Erzeugung aus dem Archiv" : gewaehlt ? `Studio: Bogen „${gewaehlt.titel || "Ohne Titel"}“` : "Studio: Bogen aus Preset";
  };
  archivSel.addEventListener("change", () => {
    archivWeg.disabled = archivSel.value === "";
    const x = archivEintraege().find((y) => y.id === archivSel.value);
    if (!x) return;
    titelIn.value = x.titel; textIn.value = x.text; folgeSel.value = x.folge && SCHLAGFOLGEN[x.folge] ? x.folge : "standard"; geburt = x.geburt || x.folge;
    speichereArbeitsplatz(aktuell()); malStand(); malBogen();
  });
  archivWeg.addEventListener("click", () => {
    if (!archivSel.value) return;
    if (ladeQuelle() === archivSel.value) setzeQuelle("preset");
    loescheEintrag(archivSel.value);
    malArchiv();
  });
  // Diesen Bogen im Studio wählen — der kurze Weg vom Arbeitsplatz zum Regler.
  const imStudio = el("button", { type: "button", title: "Diese Geschichte im Studio als Bogen wählen (Regler „Bogen“)." }, "Im Studio wählen") as HTMLButtonElement;
  imStudio.addEventListener("click", () => {
    const ez = aktuell();
    if (!platzBrauchbar(ez)) return;
    archiviere(ez);
    setzeQuelle(eintragId(ez));
    malArchiv();
    imStudio.textContent = "Gewählt ✓"; window.setTimeout(() => { imStudio.textContent = "Im Studio wählen"; }, 1500);
  });

  malStand(); malArchiv();

  root.append(kopf, el("div", { class: "card", style: "margin-top:12px;padding:12px" },
    el("div", { style: "display:flex;gap:8px;align-items:center;margin-bottom:6px" }, titelIn, stand),
    textIn,
    el("div", { class: "btnrow", style: "margin-top:6px" }, folgeSel, einfuegen, kiBtn, bogenBtn, speichern, imStudio, leeren, archivWeg),
    el("div", { class: "btnrow", style: "margin-top:6px;align-items:center" }, archivSel, archivStand),
    bogenBox));
}
