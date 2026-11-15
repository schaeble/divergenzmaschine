// Abhängigkeiten in src/ui/studio.ts (4.391.0).
//
// `mountStudio` ist eine einzige Funktion mit über 600 Anweisungen. Wer einen
// Abschnitt herauslösen will, muss wissen, was er von außen braucht und was
// er nach außen liefert. Dieses Skript liest das über den TypeScript-Compiler
// ab — nicht über Textsuche.
//
//   node scripts/studio-abhaengigkeiten.cjs rein        Anweisungen ohne jede Abhängigkeit
//   node scripts/studio-abhaengigkeiten.cjs 1211 1357   Zeilenbereich: braucht / liefert
//                                                       (↓ = erst weiter unten deklariert)
//
// Aus dem Ordner migration-ts starten.
const path = require("path");
const wurzel = path.resolve(__dirname, "..");
const ts = require(path.join(wurzel, "node_modules/typescript"));
const file = path.join(wurzel, "src/ui/studio.ts");
const cfg = ts.readConfigFile(path.join(wurzel, "tsconfig.json"), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(cfg.config, ts.sys, wurzel);
const prog = ts.createProgram([file], parsed.options);
const ch = prog.getTypeChecker();
const sf = prog.getSourceFile(file);
let mount; sf.forEachChild((n) => { if (ts.isFunctionDeclaration(n) && n.name && n.name.text === "mountStudio") mount = n; });
const stmts = mount.body.statements;
const line = (pos) => sf.getLineAndCharacterOfPosition(pos).line + 1;
// Symbole, die direkt im Rumpf von mountStudio deklariert sind → Anweisungsindex
const decl = new Map();
stmts.forEach((s, i) => {
  const add = (name) => { const sym = ch.getSymbolAtLocation(name); if (sym) decl.set(sym, i); };
  const bind = (n) => { if (ts.isIdentifier(n)) add(n); else n.elements.forEach((e) => { if (!ts.isOmittedExpression(e)) bind(e.name); }); };
  if (ts.isVariableStatement(s)) s.declarationList.declarations.forEach((d) => bind(d.name));
  else if (ts.isFunctionDeclaration(s) && s.name) add(s.name);
});
const info = stmts.map((s, i) => {
  const uses = new Set();
  const walk = (n) => { if (ts.isIdentifier(n)) { let sym = ch.getSymbolAtLocation(n); if (sym && ts.isShorthandPropertyAssignment(n.parent)) sym = ch.getShorthandAssignmentValueSymbol(n.parent); if (sym && decl.has(sym) && decl.get(sym) !== i) uses.add(decl.get(sym)); } ts.forEachChild(n, walk); };
  walk(s);
  return { i, von: line(s.getStart()), bis: line(s.getEnd()), uses, art: ts.SyntaxKind[s.kind] };
});
if (process.argv[2] === "rein") {
  let z = 0; const rein = info.filter((x) => x.uses.size === 0 && (ts.isVariableStatement(stmts[x.i]) || ts.isFunctionDeclaration(stmts[x.i])));
  for (const x of rein) { z += x.bis - x.von + 1; }
  console.log("Anweisungen:", info.length, "| ohne Abhängigkeit:", rein.length, "| Zeilen:", z);
  for (const x of rein.filter((x) => x.bis - x.von >= 3)) console.log(x.von + "-" + x.bis, sf.text.slice(stmts[x.i].getStart(), stmts[x.i].getStart() + 70).replace(/\n/g, " "));
} else {
  const [a, b] = process.argv.slice(2).map(Number);
  const inn = info.filter((x) => x.von >= a && x.bis <= b); const idx = new Set(inn.map((x) => x.i));
  const ein = new Set(), aus = new Set();
  for (const x of inn) for (const u of x.uses) if (!idx.has(u)) ein.add(u);
  for (const x of info) if (!idx.has(x.i)) for (const u of x.uses) if (idx.has(u)) aus.add(u);
  const names = (set) => [...set].map((i) => { const s = stmts[i]; return (ts.isVariableStatement(s) ? s.declarationList.declarations.map((d) => d.name.getText().slice(0, 30)).join("/") : s.name.text) + (info[i].von > b ? "↓" : ""); });
  console.log(a + "-" + b, "Anweisungen", inn.length, "\n  braucht (" + ein.size + "):", names(ein).join(", "), "\n  liefert (" + aus.size + "):", names(aus).join(", "));
}
