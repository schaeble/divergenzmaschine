// Headless Property-Tests der Engine (kein Browser).
// localStorage-Stub für Node (Imports greifen nicht beim Laden darauf zu):
{
  const g = globalThis as unknown as { localStorage?: Storage };
  if (typeof g.localStorage === "undefined") {
    const m: Record<string, string> = {};
    g.localStorage = {
      getItem: (k: string) => (k in m ? m[k]! : null),
      setItem: (k: string, v: string) => { m[k] = String(v); },
      removeItem: (k: string) => { delete m[k]; },
      clear: () => { for (const k of Object.keys(m)) delete m[k]; },
      key: () => null, length: 0,
    } as unknown as Storage;
  }
}

import { DEFAULT_BANK } from "../src/constants";
import { buildStory } from "../src/generation/buildStory";
import { mutateBank, bankEntryCount } from "../src/wordbank";
import type { Bank, GenInput, FormKind } from "../src/types";

const fails: string[] = [];
const check = (cond: boolean, msg: string): void => { if (!cond) fails.push(msg); };

const base = (over: Partial<GenInput>): GenInput => ({
  where: "auf der Schafsweide", when: "vor langer Zeit", who: "Baucis, Philemon",
  what: "ein Wunder geschieht", tone: "mystery", varLevel: "wild", form: "prose",
  structure: "linear", mode: "myth", perspective: "auto", rhythm: "auto",
  markovMode: "off", disruptor: "auto", archetypeA: "neutral", archetypeB: "psychopath",
  instability: 2, polish: false, polishStyle: "surreal_precise", ...over,
});

const RUNS = 20;

// Prosa-Strukturen
for (const structure of ["linear", "reverse", "circle", "fragment", "object"]) {
  for (const polish of [false, true]) {
    for (let i = 0; i < RUNS; i++) {
      let t = "";
      try { t = buildStory(DEFAULT_BANK, base({ form: "prose", structure, polish })); }
      catch (e) { fails.push(`prose/${structure}/polish=${polish} CRASH: ${(e as Error).message}`); continue; }
      const tag = `prose/${structure}/polish=${polish}`;
      check(t.trim().length > 0, `${tag}: leer`);
      check(!/,\s*\./.test(t), `${tag}: ',.'-Artefakt`);
      check(((t.match(/"/g) || []).length) % 2 === 0, `${tag}: unpaarige "`);
      if (structure !== "fragment") {
        const sents = t.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter(Boolean);
        for (let k = 1; k < sents.length; k++) check(sents[k] !== sents[k - 1], `${tag}: doppelter Satz`);
      }
    }
  }
}

// Dialog
for (let i = 0; i < RUNS; i++) {
  let t = "";
  try { t = buildStory(DEFAULT_BANK, base({ form: "script" })); }
  catch (e) { fails.push(`script CRASH: ${(e as Error).message}`); continue; }
  check(/^SZENE:/.test(t), "script: kein SZENE-Kopf");
  const bodies = t.split("\n").slice(1).map((l) => l.replace(/^[^:]+:\s*/, "").trim()).filter(Boolean);
  const counts: Record<string, number> = {};
  bodies.forEach((b) => (counts[b] = (counts[b] || 0) + 1));
  check(!Object.values(counts).some((c) => c > 1), "script: Zeilen-Duplikat");
  check(!bodies.some((b) => /\b[A-ZÄÖÜ][a-zäöü ]{2,30}:\s\S/.test(b) && !/^(Das Thema|Der Einsatz)/.test(b)), "script: geleaktes Sprecher-Label");
}

// Video + Ideen (Rauchtest)
try { const v = buildStory(DEFAULT_BANK, base({ form: "video" as FormKind, shots: 5, totalSec: 15 })); check(/^SEQUENZ/.test(v), "video: kein SEQUENZ-Kopf"); }
catch (e) { fails.push(`video CRASH: ${(e as Error).message}`); }

// Vers-/Sonderformen (Rauchtest: kein Absturz, nicht leer)
for (const form of ["poem", "drama", "strang", "reim", "haiku"] as FormKind[]) {
  for (let i = 0; i < 10; i++) {
    let t = "";
    try { t = buildStory(DEFAULT_BANK, base({ form })); }
    catch (e) { fails.push(`${form} CRASH: ${(e as Error).message}`); continue; }
    check(t.trim().length > 0, `${form}: leer`);
  }
}

// Mutation
for (const amt of [0, 150, 300, 500]) {
  const before = bankEntryCount(DEFAULT_BANK);
  const mutated: Bank = mutateBank(DEFAULT_BANK, amt);
  check(bankEntryCount(mutated) >= before, `mutation@${amt}: schrumpft`);
  for (const k of Object.keys(DEFAULT_BANK) as (keyof Bank)[]) {
    check(mutated[k].length <= 80, `mutation@${amt}/${k}: über Cap 80`);
    for (const orig of DEFAULT_BANK[k]) check(mutated[k].includes(orig), `mutation@${amt}/${k}: Original verloren`);
  }
}

// Ergebnis
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`❌ ${fails.length} Fehler:`);
  [...new Set(fails)].slice(0, 40).forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`✅ Alle Property-Tests bestanden (${5 * 2 * RUNS} Prosa- + ${RUNS} Dialog-Läufe, Video, Mutation).`);
}
