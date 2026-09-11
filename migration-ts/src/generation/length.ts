// Textlänge: Prosa auf eine Ziel-Wortzahl trimmen bzw. auffüllen.
// Aus dem Original portiert; die Markov-Erweiterung nutzt das MarkovModel.
import type { Bank } from "../types";
import { clean, pick, ensurePunct, splitSentences } from "../text-utils";
import { MarkovModel, isSaneMarkov, smoothMarkov } from "../corpus";
import { praesensUmschreiben } from "./coherence";
import { zaehle } from "../features/waechterStatistik";
import { ladeKurve, kurveWert } from "../features/spannungskurve";
import { traceMarkov } from "./markovTrace";
import { markovSeenRecently, noteMarkov } from "./cooldown";

const count = (s: string): number => (s || "").trim().split(/\s+/).filter(Boolean).length;

export function enforceWordTarget(text: string, target: number, bank: Bank, model?: MarkovModel, markovMode = "mix"): string {
  const t0 = (text || "").trim();
  if (!t0) return t0;
  const tol = 10;
  let out = t0;
  let wc = count(out);
  if (Number.isFinite(target) && Math.abs(wc - target) <= tol) return out;

  // zu lang -> kürzen
  if (wc > target + tol) {
    const sentences = splitSentences(out);
    const acc: string[] = [];
    let c = 0;
    for (const s of sentences) {
      const sw = count(s);
      if (c + sw > target + tol) break;
      acc.push(s); c += sw;
      if (c >= target - tol) break;
    }
    const cut = acc.join(" ").trim();
    return cut.length > 0 ? ensurePunct(cut) : out;
  }

  // zu kurz -> auffüllen (Umbau 4.359.0, Blatt „Sonnenaufgang in Weilheim")
  //
  // Vorher hing der Füller seine Sätze HINTEN an — nach dem Schluss, als
  // Liste, im Akkusativ („Einen Schlüssel für jedes Schloss."): Der Bogen war
  // zu Ende, der Text ging weiter. Jetzt:
  //   1. Vor dem Schluss: Die letzten Sätze (Schluss-Material der Bank und der
  //      letzte Satz überhaupt) bleiben die letzten; eingefügt wird im
  //      Mittelteil, verteilt — an den Stellen, wo die Spannungskurve niedrig
  //      steht, wenn sie an ist, sonst von der Mitte aus nach außen.
  //   2. Anschluss: Bevorzugt wird ein Satz, der einen Wortstamm mit dem
  //      Nachbarn vor der Einfügestelle teilt (dieselbe Regel wie im
  //      Zusammenbau) — die Bilder bauen sich auf, statt zu fallen.
  //   3. Requisiten im Nominativ: „Einen Brief ohne Absenderzeile" → „Ein Brief".
  const missing = Math.max(0, target - wc);
  const maxAttempts = Math.min(120, Math.ceil(missing / 6) + 6);
  const used = new Set<string>();
  const kurve = ladeKurve();
  const staemme = (t: string): Set<string> => new Set((t.toLowerCase().match(/[a-zäöüß]{5,}/g) || []).map((x) => x.slice(0, 5)));
  const nominativ = (x: string): string => x.replace(/^einen\s/i, (m) => (m[0] === "E" ? "Ein " : "ein ")).replace(/^den\s/i, (m) => (m[0] === "D" ? "Der " : "der "));
  const endungen = new Set((bank.endings || []).map((e) => clean(e).toLowerCase().replace(/[.!?…]+$/, "")));

  // Absätze bleiben: Der Text wird satzweise geführt, Absatzgrenzen als Marker.
  let saetze = out.split(/\n\n+/).flatMap((abs, i) => (i ? ["\n\n"] : []).concat(splitSentences(abs)));
  const istSchluss = (x: string): boolean => endungen.has(clean(x).toLowerCase().replace(/[.!?…]+$/, ""));
  // Die Schluss-Zone: vom Ende her alle Schluss-Sätze, mindestens der letzte Satz.
  let schlussAb = saetze.length - 1;
  while (schlussAb > 1 && istSchluss(saetze[schlussAb - 1]!)) schlussAb--;
  const einfuegeStellen = (): number[] => {
    // Kandidaten-Indizes im Mittelteil (nach dem ersten Satz, vor der Schluss-Zone), nach Kurvenwert oder von der Mitte aus.
    const idx: number[] = [];
    for (let i = 1; i < schlussAb; i++) if (saetze[i] !== "\n\n") idx.push(i);
    if (!idx.length) return [schlussAb];
    if (kurve.an) return idx.map((i) => [i, kurveWert(kurve.werte, i / Math.max(1, saetze.length - 1))] as [number, number]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);
    const mitte = Math.floor(idx.length / 2);
    const aus: number[] = []; for (let k = 0; k < idx.length; k++) { const j = mitte + (k % 2 ? -Math.ceil(k / 2) : Math.ceil(k / 2)); if (idx[j] !== undefined) aus.push(idx[j]!); }
    return aus.length ? aus : idx;
  };

  let stelleNr = 0;
  const addition = (davor: string): { text: string; raw: boolean } | null => {
    // Zuerst Markov (wenn ein Modell da ist), sonst aus der Bank.
    if (model && Math.random() < (markovMode === "wild" ? 0.7 : 0.4)) {
      for (let k = 0; k < 6; k++) {
        const roh = smoothMarkov(model.generate(Math.min(60, Math.max(20, Math.floor(missing * 0.8)))));
        const u = roh ? praesensUmschreiben(roh) : null;     // Präteritum → Präsens, sonst verwerfen
        const m = u && u.ok ? u.text : "";
        if (m && isSaneMarkov(m) && m.length > 15 && !markovSeenRecently(m)) {
          noteMarkov(m); traceMarkov(m);
          return { text: m, raw: false };
        }
      }
    }
    const cands: string[] = [...(bank.motifs || []), ...(bank.turns || []), ...(bank.hooks || []), ...(bank.obstacles || []), ...(bank.props || []).map(nominativ)];
    if (!cands.length) return null;
    const fresh = cands.filter((c) => { const k = clean(c).toLowerCase(); return k && !used.has(k) && !out.toLowerCase().includes(k); });
    if (!fresh.length) return null;
    // Anschluss: sieben von zehn Malen einen Satz, der einen Stamm mit dem Nachbarn teilt.
    const st = staemme(davor);
    const anschluss = st.size ? fresh.filter((c) => { for (const x of staemme(c)) if (st.has(x)) return true; return false; }) : [];
    const chosen = anschluss.length && Math.random() < 0.7 ? pick(anschluss) : pick(fresh);
    used.add(clean(chosen).toLowerCase());
    return { text: chosen, raw: true };
  };

  let leer = 0;
  for (let a = 0; a < maxAttempts; a++) {
    out = saetze.join(" ").replace(/ \n\n /g, "\n\n");
    if (count(out) >= target - tol) break;
    const stellen = einfuegeStellen();
    const at = stellen[stelleNr % stellen.length]!;
    stelleNr++;
    const davor = saetze[at - 1] && saetze[at - 1] !== "\n\n" ? saetze[at - 1]! : (saetze[at] || "");
    const add = addition(davor);
    if (!add) { if (++leer >= 3) { zaehle("fuellerStopp", `${count(out)} von ${target} Wörtern`); break; } continue; }
    let ca = add.text.trim().replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/\s+([,.;:!?…])/g, "$1");
    if (!/[.!?…]$/.test(ca)) ca += ".";
    saetze = [...saetze.slice(0, at), ca, ...saetze.slice(at)];
    schlussAb++;
  }
  out = saetze.join(" ").replace(/ \n\n /g, "\n\n").replace(/[ \t]+/g, " ").trim();
  return ensurePunct(out);
}
