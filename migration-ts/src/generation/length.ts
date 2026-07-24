// Textlänge: Prosa auf eine Ziel-Wortzahl trimmen bzw. auffüllen.
// Aus dem Original portiert; die Markov-Erweiterung nutzt das MarkovModel.
import type { Bank } from "../types";
import { clean, pick, ensurePunct, splitSentences } from "../text-utils";
import { MarkovModel, isSaneMarkov } from "../corpus";

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

  // zu kurz -> auffüllen
  const missing = Math.max(0, target - wc);
  const maxAttempts = Math.min(120, Math.ceil(missing / 6) + 6);
  const used = new Set<string>();

  const strong = markovMode === "on";
  const addition = (): { text: string; raw: boolean } | null => {
    // Bei "Stark" wird bevorzugt aus dem Korpus (Markov) aufgefüllt — liest sich
    // wie Prosa. Nur wenn das Modell nichts Brauchbares liefert (leerer/dünner
    // Korpus), fällt es auf Bank-Motive zurück.
    if (model && (strong || Math.random() < 0.6)) {
      const tries = strong ? 3 : 1;
      for (let k = 0; k < tries; k++) {
        const m = model.generate(Math.min(60, Math.max(20, Math.floor(missing * 0.8))));
        if (m && isSaneMarkov(m) && m.length > 15) return { text: m, raw: false };
      }
    }
    const cands: string[] = [...(bank.motifs || []), ...(bank.turns || []), ...(bank.hooks || [])];
    if (!cands.length) return null;
    const fresh = cands.filter((c) => { const k = clean(c).toLowerCase(); return k && !used.has(k) && !out.toLowerCase().includes(k); });
    const chosen = pick(fresh.length ? fresh : cands);
    used.add(clean(chosen).toLowerCase());
    return { text: chosen, raw: true };
  };

  for (let a = 0; a < maxAttempts; a++) {
    if (count(out) >= target - tol) break;
    const add = addition();
    if (!add) continue;
    let ca = add.text.trim().replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/\s+([,.;:!?…])/g, "$1");
    if (!/[.!?…]$/.test(ca)) ca += ".";
    out = out.replace(/[.!?…]+\s*$/, "").trim();
    out += ". " + ca;
    out = out.replace(/\s+/g, " ").trim();
  }
  return ensurePunct(out);
}
