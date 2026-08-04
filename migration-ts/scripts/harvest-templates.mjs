// Schablonen-Ernte: zieht die Satzvorlagen aus dem Generator-Quelltext und macht
// Vorlagen-Atome daraus. Grund: In den Wortbänken stecken fast nur Hauptsätze und
// Nominalphrasen — die Verbindungsstücke (kopf, rahmen, konnektor, nebensatz)
// liegen in den Schablonen. Ohne sie hat der Assembler nichts zum Fügen.
import { readFileSync, writeFileSync } from "node:fs";

const QUELLEN = ["structures", "dramaturgie", "emphasis", "dialogue", "video"];
const SRC = (n) => `src/generation/${n}.ts`;

// Platzhalter → Slot-Marker. ${kit.hookAcc} wird zu ⟨AKK⟩ usw.
const SLOTS = {
  hookAcc: "⟨AKK⟩", propAcc: "⟨AKK⟩", hookDat: "⟨DAT⟩", propDat: "⟨DAT⟩",
  hook: "⟨NOM⟩", prop: "⟨NOM⟩", motif: "⟨NOM⟩", turn: "⟨SATZ⟩", obstacle: "⟨SATZ⟩",
  stake: "⟨NOM⟩", ending: "⟨SATZ⟩", Apure: "⟨SATZ⟩", P: "⟨FIGUR⟩", W: "⟨ORT⟩", T: "⟨ZEIT⟩",
  speakerA: "⟨FIGUR⟩", speakerB: "⟨FIGUR⟩", AleadVerb: "⟨VERB⟩",
};

function normalize(tpl) {
  let t = tpl;
  // ${kit.X} und ${kit.X || "y"} auflösen
  t = t.replace(/\$\{kit\.([A-Za-z]+)(?:\s*\|\|\s*"[^"]*")?\}/g, (_m, k) => SLOTS[k] ?? `⟨${k.toUpperCase()}⟩`);
  // ${pick([...])} / ${rot(...)} → Auswahlmarker
  t = t.replace(/\$\{(?:pick|rot)\([^}]*\}/g, "⟨WAHL⟩");
  // restliche Ausdrücke
  t = t.replace(/\$\{[^}]*\}/g, "⟨X⟩");
  return t.replace(/\s+/g, " ").trim();
}

const SLOT_RX = /⟨(AKK|DAT|NOM|SATZ)⟩/;
// Finites Verb in der Vorlage? Platzhalter zählen nicht mit.
const FINIT = /\b(bin|bist|seid|liege|liegst|sitzt|stehe|gehe|sehe|höre|weiss|ist|sind|war|waren|hat|haben|hatte|wird|werden|wurde|kann|muss|will|soll|darf|bleibt|blieb|steht|stand|liegt|lag|geht|ging|kommt|kam|sieht|sah|bemerkt|bemerkte|findet|fand|nimmt|nahm|hält|hielt|spürt|begreift|erkennt|stellt|weiß|zeigt|trägt|trug|öffnet|schließt|bricht|brach|klebt|riecht|nennt|greift|beginnt|endet|wartet|folgt|sucht|versucht|verschwindet|geschieht|passiert|kippt|dreht|wechselt|antwortet|schweigt|flüstert|schreit)\b/i;
function typOf(text) {
  const t = text.trim();
  if (/:$/.test(t)) return "kopf";
  if (SLOT_RX.test(t)) return "rahmen";
  const woerter = t.replace(/⟨[A-ZÄÖÜ]+⟩/g, "").split(/\s+/).filter(Boolean).length;
  if (/^(und|oder|aber|doch|denn|dann|dabei|also|trotzdem)\b/i.test(t) && woerter <= 3) return "konnektor";
  if (/^(dass|weil|obwohl|wenn|nachdem|bevor|ob|indem|sobald)\b/i.test(t)) return "nebensatz";
  if (!FINIT.test(t)) return woerter <= 2 ? "fragment" : "praepositionalphrase";  // verblose Rahmenangabe
  return "hauptsatz";
}
function slotOf(text) {
  const m = text.match(SLOT_RX);
  if (!m) return null;
  const k = m[1];
  if (k === "SATZ") return { rolle: "ergaenzung", kasus: "nom", art: "hauptsatz" };
  return { rolle: "objekt", kasus: k.toLowerCase(), art: "nominalphrase" };
}

const atome = [];
const seen = new Set();
let roh = 0;
for (const q of QUELLEN) {
  let code;
  try { code = readFileSync(SRC(q), "utf8"); } catch { continue; }
  // Template-Literale mit kit-Platzhalter
  for (const m of code.matchAll(/`([^`]*\$\{kit\.[^`]*)`/g)) {
    roh++;
    const text = normalize(m[1]);
    if (text.length < 6) continue;
    // Mehrsatz-Vorlagen zerlegen — auch AM DOPPELPUNKT, sonst entstehen keine
    // "kopf"-Atome („⟨FIGUR⟩ stellt fest:“), und genau die fehlen dem Assembler.
    const teile = [];
    for (const satz of text.split(/(?<=[.!?…])\s+/)) {
      const k = satz.indexOf(": ");
      if (k > 3 && k < satz.length - 4) { teile.push(satz.slice(0, k + 1)); teile.push(satz.slice(k + 2)); }
      else teile.push(satz);
    }
    for (const teil of teile) {
      const t = teil.trim();
      if (t.length < 6 || seen.has(t)) continue;
      // Struktur-Labels aus dem Generator sind keine Sprache: „WO:“, „SZENE:“, „Shot 3:“
      if (/^[A-ZÄÖÜ]{2,}\s*:/.test(t) || /^(Shot|Szene|Take)\b/i.test(t)) continue;
      seen.add(t);
      const typ = typOf(t);
      atome.push({
        id: `vl-${String(atome.length + 1).padStart(4, "0")}`,
        text: t, quelle: "vorlage", herkunft: q, typ,
        verlangt: slotOf(t),
        oeffnet: typ === "kopf",
        platzhalter: [...t.matchAll(/⟨([A-ZÄÖÜ]+)⟩/g)].map((x) => x[1]),
      });
    }
  }
}
const zaehl = {};
for (const a of atome) zaehl[a.typ] = (zaehl[a.typ] || 0) + 1;
writeFileSync("src/atoms/templates.data.json", JSON.stringify({ erzeugt_am: new Date().toISOString().slice(0, 10), quellen: QUELLEN, atome }, null, 1) + "\n");
console.log(`${roh} Template-Literale → ${atome.length} Vorlagen-Atome`);
for (const [k, v] of Object.entries(zaehl).sort((a, b) => b[1] - a[1])) console.log(`  ${k.padEnd(14)} ${v}`);
console.log("\nBeispiele:");
for (const t of ["kopf", "rahmen", "hauptsatz", "konnektor"]) {
  const s = atome.find((a) => a.typ === t); if (s) console.log(`  ${t.padEnd(11)} „${s.text.slice(0, 62)}“`);
}
