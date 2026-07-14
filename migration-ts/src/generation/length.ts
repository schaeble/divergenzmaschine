// Textlänge: Prosa auf eine Ziel-Wortzahl trimmen bzw. auffüllen.
// Aus dem Original portiert; die Markov-Erweiterung nutzt das MarkovModel.
import type { Bank } from "../types";
import { clean, pick, ensurePunct, splitSentences } from "../text-utils";
import { MarkovModel, isSaneMarkov } from "../corpus";

const count = (s: string): number => (s || "").trim().split(/\s+/).filter(Boolean).length;
const WB_CONNECTORS = ["Dabei", "Und immer wieder", "Nebenbei", "Nicht zu vergessen", "Dazwischen"];

export function enforceWordTarget(text: string, target: number, bank: Bank, model?: MarkovModel): string {
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
  const maxAttempts = Math.min(20, Math.ceil(missing / 15) + 3);
  const used = new Set<string>();
  let rawCount = 0;

  const addition = (): { text: string; raw: boolean } | null => {
    if (model && Math.random() < 0.6) {
      const m = model.generate(Math.min(40, Math.max(15, Math.floor(missing * 0.7))));
      if (m && isSaneMarkov(m) && m.length > 15) return { text: m, raw: false };
    }
    const cands: string[] = [...(bank.motifs || []), ...(bank.turns || []), ...(bank.hooks || [])];
    if (!cands.length) return null;
    const fresh = cands.filter((c) => { const k = clean(c).toLowerCase(); return k && !used.has(k) && !out.toLowerCase().includes(k); });
    const chosen = pick(fresh.length ? fresh : cands);
    used.add(clean(chosen).toLowerCase()); rawCount++;
    return { text: chosen, raw: true };
  };

  for (let a = 0; a < maxAttempts; a++) {
    if (count(out) >= target - tol) break;
    const add = addition();
    if (!add) continue;
    let ca = add.text.trim().replace(/^[a-z]/, (c) => c.toUpperCase()).replace(/\s+([,.;:!?…])/g, "$1");
    if (!/[.!?…]$/.test(ca)) ca += ".";
    out = out.replace(/[.!?…]+\s*$/, "").trim();
    if (add.raw) {
      const lead = WB_CONNECTORS[(rawCount - 1) % WB_CONNECTORS.length]!;
      out += `. ${lead}: ${ca.charAt(0).toLowerCase() + ca.slice(1)}`;
    } else out += ". " + ca;
    out = out.replace(/\s+/g, " ").trim();
  }
  return ensurePunct(out);
}
