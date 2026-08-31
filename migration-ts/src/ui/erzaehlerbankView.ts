// Reiter „Erzählerbank" — zehn Kurzgeschichten als Dramaturgie-Set.
//
// Gewünscht: Zusätzlich zur Wortbank eine Bank für bis zu zehn frei
// erstellte Kurzgeschichten mit unterschiedlichen Dramaturgien; im Studio
// dienen sie als Bogen-Vorrat (Regler „Bogen" im Werkzeugkasten, fest
// gewählt, würfeln nur auf Wunsch).
//
// Jeder Platz: Titel, Text, dazu die Bogen-Vorschau — dieselbe Zuordnung
// wie im Fenster „Preset aus Text", nur nach den Bogen-Phasen gruppiert.
// Gespeichert wird je Platz mit einem Klick; die Plätze wandern über die
// Schlüssel dm_erzaehlerbank_v1 automatisch in die Projektdatei.
import { el } from "./dom";
import { icon } from "./icons";
import { ladeErzaehlerbank, speichereErzaehlerbank, platzBrauchbar, ERZAEHLER_PLAETZE, SCHLAGFOLGEN, kiErzaehlung, archiviere, archivFuer, loescheAusArchiv } from "../features/erzaehlerbank";
import { ERZAEHLUNGEN_VORLAGEN } from "../features/erzaehlungen.data";
import { preset2AusText } from "../features/textpreset";

const PHASEN: [keyof ReturnType<typeof preset2AusText>["drama"], string][] = [
  ["einstieg", "Einstieg"], ["mitte", "Mitte"], ["hoehepunkt", "Höhepunkt"], ["schluss", "Schluss"],
  ["ausloeser", "Auslöser"], ["veraenderungen", "Veränderungen"], ["konflikte", "Konflikte"],
];

export function mountErzaehlerbank(root: HTMLElement): void {
  root.innerHTML = "";
  const bank = ladeErzaehlerbank();

  const kopf = el("div", {},
    el("h2", {}, "Erzählerbank"),
    el("p", { class: "muted" },
      "Bis zu zehn Kurzgeschichten mit unterschiedlichen Dramaturgien. Aus jeder wird ein Bogen abgeleitet " +
      "(Einstieg, Mitte, Höhepunkt, Schluss, Auslöser, Veränderungen, Konflikte) — im Studio wählbar unter " +
      "„Bogen“ im Werkzeugkasten: fest je Geschichte, oder würfeln je Erzeugung. Die Wortbank liefert das Was, " +
      "die Erzählerbank das Wie. Richtwert je Geschichte: 300–400 Wörter; unter 40 Wörtern gilt ein Platz als leer."));

  // Zehn eingebaute Geschichten mit unterschiedlichen Bögen — auf Wunsch in
  // die LEEREN Plätze gesetzt; belegte bleiben unangetastet. Danach wird der
  // Reiter neu gezeichnet, damit Zähler und Bögen stimmen.
  const vorlagenBtn = el("button", { type: "button", title: "Zehn eingebaute Geschichten mit unterschiedlichen Bögen in die leeren Plätze setzen. Belegte Plätze bleiben unangetastet." }, "Vorlagen einsetzen (leere Plätze)") as HTMLButtonElement;
  vorlagenBtn.addEventListener("click", () => {
    const alle = ladeErzaehlerbank();
    let frei = 0, v = 0;
    for (let i = 0; i < ERZAEHLER_PLAETZE && v < ERZAEHLUNGEN_VORLAGEN.length; i++) {
      if (alle[i]!.text.trim()) continue;
      alle[i] = { ...ERZAEHLUNGEN_VORLAGEN[v++]! };
      frei++;
    }
    if (frei) { speichereErzaehlerbank(alle); mountErzaehlerbank(root); }
    else { vorlagenBtn.textContent = "Kein Platz frei"; window.setTimeout(() => { vorlagenBtn.textContent = "Vorlagen einsetzen (leere Plätze)"; }, 1600); }
  });
  // Alles zurücksetzen: leert alle zehn Plätze und stellt die Bauformen auf
  // den Steigenden Bogen zurück — mit Nachfrage, denn das ist ein großer
  // Schritt. Das ARCHIV bleibt: Die gespeicherten Geschichten sind danach
  // über den Titel wieder wählbar, nichts geht verloren.
  const leerenBtn = el("button", { type: "button", class: "danger", title: "Alle zehn Plätze leeren und die Bauformen zurücksetzen. Das Archiv der gespeicherten Geschichten bleibt erhalten." }, "Alles zurücksetzen") as HTMLButtonElement;
  leerenBtn.addEventListener("click", () => {
    if (!confirm("Alle zehn Plätze leeren? Das Archiv der gespeicherten Geschichten bleibt erhalten.")) return;
    speichereErzaehlerbank(Array.from({ length: ERZAEHLER_PLAETZE }, () => ({ titel: "", text: "", folge: "standard" })));
    mountErzaehlerbank(root);
  });
  kopf.append(el("div", { class: "btnrow", style: "margin-top:8px" }, vorlagenBtn, leerenBtn));

  const liste = el("div", {});
  for (let i = 0; i < ERZAEHLER_PLAETZE; i++) {
    const e = bank[i]!;
    const titelIn = el("input", { type: "text", value: e.titel, maxlength: "60", placeholder: `Geschichte ${i + 1} — Titel`, style: "width:100%" }) as HTMLInputElement;
    const textIn = el("textarea", { rows: "6", placeholder: "Text der Geschichte (300–400 Wörter)", style: "width:100%" }) as HTMLTextAreaElement;
    textIn.value = e.text;
    const stand = el("span", { class: "muted", style: "font-size:13px" });
    // Die Bauform des Platzes: Sie wird zur Schlagfolge des Bogens — in
    // welcher Reihenfolge die Schläge stehen („Katastrophe zuerst" beginnt
    // mit dem Höhepunkt, „Kreisschluss" kehrt am Ende zum Einstieg zurück).
    const folgeSel = el("select", { title: "Schlagfolge: die Reihenfolge der Schläge, wenn dieser Bogen im Studio gewählt ist." }) as HTMLSelectElement;
    for (const [k, v] of Object.entries(SCHLAGFOLGEN)) folgeSel.append(el("option", { value: k }, v.name));
    folgeSel.value = e.folge && SCHLAGFOLGEN[e.folge] ? e.folge : "standard";
    const bogenBox = el("div", { style: "display:none;font-size:13px;line-height:1.55;border:1px solid var(--border);border-radius:8px;padding:8px 10px;margin-top:6px" });
    let bogenAuf = false;

    const malStand = (): void => {
      const w = textIn.value.split(/\s+/).filter(Boolean).length;
      stand.textContent = w === 0 ? "leer" : w < 40 ? `${w} Wörter — zu wenig, gilt als leer` : `${w} Wörter`;
    };
    const malBogen = (): void => {
      if (!bogenAuf) return;
      bogenBox.innerHTML = "";
      if (!platzBrauchbar({ titel: titelIn.value, text: textIn.value })) {
        bogenBox.append(el("div", { class: "muted" }, "Noch zu wenig Text für einen Bogen."));
        return;
      }
      const d = preset2AusText(textIn.value).drama;
      for (const [k, name] of PHASEN) {
        const zeilen = d[k] || [];
        if (!zeilen.length) continue;
        bogenBox.append(el("div", {}, el("strong", { style: "color:var(--acc2)" }, name + ": "), zeilen.join(" · ")));
      }
    };
    const bogenBtn = el("button", { type: "button" }, "Bogen zeigen") as HTMLButtonElement;
    bogenBtn.addEventListener("click", () => {
      bogenAuf = !bogenAuf;
      bogenBox.style.display = bogenAuf ? "" : "none";
      bogenBtn.textContent = bogenAuf ? "Bogen verbergen" : "Bogen zeigen";
      malBogen();
    });

    // Einfügen aus der Zwischenablage — wie überall: das Handy hat kein Strg+V.
    const einfuegen = el("button", { type: "button", title: "Aus der Zwischenablage einfügen" }, icon("paste"), " Einfügen") as HTMLButtonElement;
    einfuegen.addEventListener("click", () => {
      const lesen = navigator.clipboard?.readText?.();
      if (!lesen) { textIn.focus(); return; }
      lesen.then((txt) => {
        const t = (txt || "").trim();
        if (!t) { textIn.focus(); return; }
        textIn.value = t;
        textIn.dispatchEvent(new Event("input"));
        textIn.focus();
      }).catch(() => { textIn.focus(); });
    });

    // ── Archiv je Bauform: mehrere Geschichten, über den Titel wählbar ────
    // Gewünscht: Pro Bogen mehrere Geschichten speichern und über den Titel
    // aussuchen. Die Liste gehört zur BAUFORM des Platzes; ein Wechsel der
    // Bauform zeigt deren Geschichten. Wählen lädt Titel und Text in den
    // Platz und speichert ihn; das kleine × löscht den gewählten Eintrag aus
    // dem Archiv (der Platz bleibt).
    const archivSel = el("select", { title: "Gespeicherte Geschichten dieser Bauform — wählen lädt sie in den Platz." }) as HTMLSelectElement;
    const archivWeg = el("button", { type: "button", class: "danger", title: "Den gewählten Archiv-Eintrag löschen (der Platz bleibt unberührt)." }, "×") as HTMLButtonElement;
    const fuelleArchiv = (): void => {
      const liste = archivFuer(folgeSel.value);
      archivSel.innerHTML = "";
      archivSel.append(el("option", { value: "" }, liste.length ? `— ${liste.length} gespeichert: wählen —` : "— nichts gespeichert —"));
      liste.forEach((e, idx) => {
        const geliehen = e.geburt && e.geburt !== folgeSel.value;
        const name = geliehen ? (SCHLAGFOLGEN[e.geburt!]?.name || e.geburt!) : "";
        archivSel.append(el("option", { value: String(idx), title: geliehen ? `Unter „${name}“ entstanden — hier geliehen.` : "" },
          (e.titel || "Ohne Titel") + (geliehen ? ` · ⇄ ${name}` : "")));
      });
      archivSel.disabled = archivWeg.disabled = !liste.length;
    };
    archivSel.addEventListener("change", () => {
      const idx = archivSel.value === "" ? -1 : Number(archivSel.value);
      const e = archivFuer(folgeSel.value)[idx];
      if (!e) return;
      titelIn.value = e.titel; textIn.value = e.text;
      textIn.dispatchEvent(new Event("input"));
      const alle = ladeErzaehlerbank();
      alle[i] = { titel: e.titel, text: e.text, folge: folgeSel.value, geburt: e.geburt || e.folge };
      speichereErzaehlerbank(alle);
    });
    archivWeg.addEventListener("click", () => {
      const idx = archivSel.value === "" ? -1 : Number(archivSel.value);
      if (idx < 0) return;
      loescheAusArchiv(folgeSel.value, idx);
      fuelleArchiv();
    });
    folgeSel.addEventListener("change", fuelleArchiv);
    fuelleArchiv();

    // KI: diesen Platz neu erzählen lassen — in seiner Bauform, das Thema aus
    // dem Titel (wenn einer dasteht). Ersetzt Titel und Text und speichert,
    // die Bauform bleibt. Fehler stehen im Knopf, nichts scheitert stumm.
    const kiBtn = el("button", { type: "button", title: "Diesen Bogen von der KI neu erzählen lassen — in der gewählten Bauform. Der Titel dient als Thema; Titel und Text werden ersetzt. Braucht den KI-Schlüssel (Reiter KI)." }, "KI: neu erzählen") as HTMLButtonElement;
    kiBtn.addEventListener("click", () => {
      kiBtn.disabled = true; kiBtn.textContent = "KI erzählt …";
      kiErzaehlung(folgeSel.value, titelIn.value.trim() || undefined).then((neu) => {
        const alle = ladeErzaehlerbank();
        alle[i] = { ...neu, folge: folgeSel.value, geburt: folgeSel.value };
        speichereErzaehlerbank(alle);
        archiviere(alle[i]!);      // auch KI-Erzählungen sind über den Titel wieder wählbar
        mountErzaehlerbank(root);
      }).catch((err: unknown) => {
        kiBtn.disabled = false;
        kiBtn.textContent = "KI-Fehler — noch einmal?";
        kiBtn.title = err instanceof Error ? err.message : String(err);
        window.setTimeout(() => { kiBtn.textContent = "KI: neu erzählen"; }, 4000);
      });
    });
    const speichern = el("button", { class: "primary", type: "button" }, "Speichern") as HTMLButtonElement;
    speichern.addEventListener("click", () => {
      const alle = ladeErzaehlerbank();
      // Die Geburt des Platzes bleibt erhalten — nur wenn TEXT oder TITEL
      // geändert wurden, ist es eine neue Geschichte und die jetzige Bauform
      // wird ihre Geburt (archiviere ermittelt das über den Wortlaut selbst).
      alle[i] = { titel: titelIn.value.trim().slice(0, 60), text: textIn.value.trim(), folge: folgeSel.value };
      speichereErzaehlerbank(alle);
      archiviere(alle[i]!);      // ins Archiv der Bauform — über den Titel wieder wählbar
      fuelleArchiv();
      speichern.textContent = "Gespeichert ✓";
      window.setTimeout(() => { speichern.textContent = "Speichern"; }, 1200);
    });
    const leeren = el("button", { class: "danger", type: "button" }, "Platz leeren") as HTMLButtonElement;
    leeren.addEventListener("click", () => {
      if (!confirm(`Platz ${i + 1} wirklich leeren?`)) return;
      titelIn.value = ""; textIn.value = ""; folgeSel.value = "standard";
      const alle = ladeErzaehlerbank();
      alle[i] = { titel: "", text: "" };
      speichereErzaehlerbank(alle);
      malStand(); malBogen();
    });

    textIn.addEventListener("input", () => { malStand(); malBogen(); });
    malStand();

    liste.append(el("div", { class: "card", style: "margin-bottom:14px;padding:12px" },
      el("div", { style: "display:flex;gap:8px;align-items:center;margin-bottom:6px" },
        el("strong", {}, String(i + 1)), titelIn, stand),
      textIn,
      el("div", { class: "btnrow", style: "margin-top:6px" }, folgeSel, einfuegen, kiBtn, bogenBtn, speichern, leeren),
      el("div", { class: "btnrow", style: "margin-top:6px" }, archivSel, archivWeg),
      bogenBox));
  }

  root.append(kopf, liste);
}
