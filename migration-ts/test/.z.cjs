"use strict";

// test/waechter.ts
var import_fs = require("fs");
var fails = [];
var zeilen = [];
var geprueft = 0;
var ist = (name, wert, soll) => {
  geprueft++;
  if (wert === soll) zeilen.push(`  \u2713 ${name}`);
  else {
    zeilen.push(`  \u2717 ${name}`);
    fails.push(`${name}: \u201E${String(wert)}\u201C \u2014 erwartet \u201E${String(soll)}\u201C`);
  }
};
var wahr = (name, b) => ist(name, b, true);
var dateien = [];
var geh = (d) => {
  for (const e of (0, import_fs.readdirSync)(d, { withFileTypes: true })) {
    if (e.isDirectory()) geh(d + "/" + e.name);
    else if (e.name.endsWith(".ts")) dateien.push(d + "/" + e.name);
  }
};
geh("src");
var inhalt = new Map(dateien.map((f) => [f, (0, import_fs.readFileSync)(f, "utf8")]));
var freigegeben = (quelle, stelle) => {
  const vorher = quelle.slice(0, stelle).split("\n").slice(-10).join("\n");
  return /WAECHTER-OK:\s*\S+/.test(vorher);
};
var opt = inhalt.get("src/generation/optionen.ts") || "";
var kanon = {};
for (const m of opt.matchAll(/export const (\w+_OPTS): Wahlliste = \[([\s\S]*?)\];/g)) {
  kanon[m[1]] = [...m[2].matchAll(/\["([^"]+)",/g)].map((x) => x[1]);
}
zeilen.push("  \xB7 Listen: " + Object.entries(kanon).map(([k, v]) => `${k}(${v.length})`).join(" "));
wahr("die ma\xDFgeblichen Wertelisten sind auffindbar", Object.keys(kanon).length >= 6);
var kopien = [];
for (const [f, s] of inhalt) {
  if (f.endsWith("optionen.ts") || f.endsWith("types.ts")) continue;
  for (const m of s.matchAll(/\[[^[\]{}]{10,400}\]/g)) {
    const strings = [...m[0].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
    if (strings.length < 4) continue;
    for (const [name, werte] of Object.entries(kanon)) {
      const treffer2 = strings.filter((x) => werte.includes(x));
      if (treffer2.length < 4 || treffer2.length < strings.length * 0.7) continue;
      if (freigegeben(s, m.index)) continue;
      kopien.push(`${f}:${s.slice(0, m.index).split("\n").length} \u2014 ${treffer2.length} Werte aus ${name}`);
    }
  }
}
ist("keine zweite Werteliste neben optionen.ts", kopien.length, 0);
if (kopien.length) kopien.forEach((k) => zeilen.push(`      ${k}`));
var erfunden = [];
for (const [f, s] of inhalt) {
  if (f.endsWith("optionen.ts") || f.endsWith("types.ts")) continue;
  for (const m of s.matchAll(/\[[^[\]{}]{10,400}\]/g)) {
    const strings = [...m[0].matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
    if (strings.length < 4) continue;
    for (const [name, werte] of Object.entries(kanon)) {
      const treffer2 = strings.filter((x) => werte.includes(x));
      if (treffer2.length < strings.length - 1 || treffer2.length < 4) continue;
      const fremd = strings.filter((x) => !werte.includes(x));
      if (!fremd.length || freigegeben(s, m.index)) continue;
      erfunden.push(`${f}:${s.slice(0, m.index).split("\n").length} \u2014 \u201E${fremd.join(", ")}" steht in keiner ${name}`);
    }
  }
}
ist("kein Wert ohne Entsprechung in den Reglerlisten", erfunden.length, 0);
if (erfunden.length) erfunden.forEach((k) => zeilen.push(`      ${k}`));
var selbst = inhalt.get("src/features/selftest.ts") || "";
var geprueft_formen = [...selbst.matchAll(/\{ id: "form_([a-z]+)"/g)].map((m) => m[1]);
var alleFormen = kanon["FORM_OPTS"] || [];
wahr("der Selbsttest ist auffindbar", selbst.length > 0);
var fehlend = alleFormen.filter((f) => !geprueft_formen.includes(f));
ist("der Selbsttest pr\xFCft jede Form", fehlend.join(", "), "");
wahr(`er pr\xFCft ${geprueft_formen.length} Formen`, geprueft_formen.length >= alleFormen.length);
var zuviel = geprueft_formen.filter((f) => !alleFormen.includes(f));
ist("und keine, die es nicht gibt", zuviel.join(", "), "");
var presetsQ = inhalt.get("src/presets.data.ts") || "";
var registerQ = inhalt.get("src/features/register.ts") || "";
var presetIds = [...presetsQ.matchAll(/^ {2}"?([a-z0-9_]+)"?: \{$/gm)].map((m) => m[1]);
var registerIds = [...registerQ.matchAll(/^ {2}([a-z0-9_]+): \{ welt:/gm)].map((m) => m[1]);
wahr(`die Preset-Liste wurde gefunden (${presetIds.length})`, presetIds.length >= 50);
ist(
  "jedes Preset hat ein Register",
  presetIds.filter((i) => !registerIds.includes(i)).join(", "),
  ""
);
ist(
  "und kein Register zeigt ins Leere",
  registerIds.filter((i) => !presetIds.includes(i)).join(", "),
  ""
);
var verwaist = [];
for (const f of dateien) {
  const name = f.split("/").pop().replace(/\.ts$/, "");
  if (name === "main" || f.endsWith(".data.ts")) continue;
  const benutzt = [...inhalt.entries()].some(([g, s]) => g !== f && new RegExp(`["'/]${name}["']`).test(s));
  if (!benutzt) verwaist.push(f);
}
zeilen.push(verwaist.length ? `  \xB7 Befund: ${verwaist.length} Modul(e) werden nirgends eingebunden \u2014 ${verwaist.join(", ")}` : "  \xB7 Befund: kein verwaistes Modul");
var probe = 'const X = ["bureau", "tech", "body", "myth", "absurd", "post"];';
var treffer = Object.entries(kanon).some(([, werte]) => {
  const strings = [...probe.matchAll(/["']([^"']+)["']/g)].map((x) => x[1]);
  const t = strings.filter((x) => werte.includes(x));
  return t.length >= 4 && t.length >= strings.length * 0.7;
});
wahr("eine untergeschobene Kopie w\xFCrde erkannt", treffer);
wahr(
  "die Freigabe braucht eine Begr\xFCndung",
  !freigegeben("// WAECHTER-OK:\nx", 20) || /WAECHTER-OK:\s*\S/.test("WAECHTER-OK: Grund")
);
ist("ohne Begr\xFCndung greift die Freigabe nicht", freigegeben("// nur ein Kommentar\n", 22), false);
console.log(`W\xE4chter \u2014 ${geprueft} Pr\xFCfungen am Quelltext:`);
zeilen.forEach((z) => console.log(z));
var proc = globalThis;
if (fails.length) {
  console.error(`
\u274C ${fails.length} Modul(e) sind still veraltet:`);
  fails.forEach((f) => console.error("  - " + f));
  console.error('  Entweder aus der ma\xDFgeblichen Quelle ableiten oder mit \u201EWAECHTER-OK: <Grund>" freigeben.');
  proc.process?.exit(1);
} else {
  console.log(`
\u2705 W\xE4chter: keine zweite Liste, kein erfundener Wert.`);
}
