// Prüfstand Speicher-Aufschlüsselung. Reine Rechnung.
//
// Anlass: Die Anzeige nannte nur eine Summe. Eine Summe sagt, OB es eng wird,
// nicht WO — und genau daran hängt, ob ein Umzug in eine Datenbank fällig ist
// oder ein einzelner Posten aufgeräumt gehört. Ohne die Aufschlüsselung hätte
// ich eine Datenbank gegen eine Vermutung gebaut.
import { readFileSync } from "fs";
import { schluesselePosten, postenGroesse } from "../src/features/storage-status";

const fails: string[] = [];
const zeilen: string[] = [];
let geprueft = 0;
const ist = (name: string, wert: unknown, soll: unknown): void => {
  geprueft++;
  if (wert === soll) zeilen.push(`  ✓ ${name}`);
  else { zeilen.push(`  ✗ ${name}`); fails.push(`${name}: „${String(wert)}“ — erwartet „${String(soll)}“`); }
};
const wahr = (name: string, b: boolean): void => ist(name, b, true);

// ── 1 · Die Größe eines Eintrags ────────────────────────────────────────────
// UTF-16, wie der Browser speichert. Der SCHLÜSSEL zählt mit — bei vielen
// kleinen Einträgen fehlen sonst spürbar Bytes, und dann stimmt die Summe der
// Posten nicht mit der angezeigten Belegung überein.
ist("ein Zeichen sind zwei Byte", postenGroesse("a", "b"), 4);
ist("der Schlüssel zählt mit", postenGroesse("lang", ""), 8);
ist("leer ist null", postenGroesse("", ""), 0);
ist("ein fehlender Wert stürzt nicht ab", postenGroesse("k", undefined as unknown as string), 2);

// ── 2 · Die Aufschlüsselung ─────────────────────────────────────────────────
const roh: [string, string][] = [
  ["divergenz_persistent_corpus_v1", "x".repeat(1000)],
  ["dm_treasury_v1", "y".repeat(500)],
  ["divergenz_zeitung_bilder_v1", "z".repeat(2000)],
  ["fremder_schluessel", "w".repeat(100)],
];
const p = schluesselePosten(roh);
ist("alle Posten kommen an", p.length, 4);
// Größter zuerst: Die Entscheidung hängt an der Spitze, nicht am Alphabet.
ist("der größte steht vorn", p[0]!.key, "divergenz_zeitung_bilder_v1");
ist("der kleinste hinten", p[3]!.key, "fremder_schluessel");
wahr("die Reihenfolge ist absteigend", p.every((x, i) => i === 0 || p[i - 1]!.bytes >= x.bytes));

// Bekannte Schlüssel bekommen einen Namen — niemand soll raten müssen, was
// „dm_zeitung_v1" ist. Unbekannte behalten ihren Schlüssel: Eine erfundene
// Beschriftung wäre schlimmer als gar keine.
ist("der Korpus heißt Korpus", p.find((x) => x.key === "divergenz_persistent_corpus_v1")?.name, "Korpus");
ist("die Schatzkammer auch", p.find((x) => x.key === "dm_treasury_v1")?.name, "Schatzkammer");
ist("ein unbekannter Schlüssel behält seinen Namen",
  p.find((x) => x.key === "fremder_schluessel")?.name, "fremder_schluessel");

// Anteile: Sie müssen sich zu rund hundert addieren, sonst zeigt der Balken
// etwas anderes als die Zahl daneben.
const summe = p.reduce((a, x) => a + x.anteil, 0);
wahr(`die Anteile ergeben rund 100 % (${summe})`, Math.abs(summe - 100) <= 0.5);
ist("eine leere Liste ergibt nichts", schluesselePosten([]).length, 0);
ist("ein einzelner Posten hat 100 %", schluesselePosten([["a", "b"]])[0]!.anteil, 100);
ist("ein leerer Eintrag ergibt keinen Bruch", schluesselePosten([["", ""]])[0]!.anteil, 0);

// ── 3 · Was in die Projektdatei wandert ─────────────────────────────────────
// Hier wäre mir beim Bauen fast ein falscher Alarm unterlaufen. In
// `features/project.ts` steht eine Liste `REST_AUSNAHME` mit `dm_treasury_v1`,
// `divergenz_settings_v1` und `divergenz_live_pools_v1`. Sie sieht nach „wird
// nicht exportiert" aus, meint aber das Gegenteil: Diese drei werden über
// EIGENE Felder der Datei gesichert und sollen nur nicht doppelt im Sammelfeld
// liegen. Eine Anzeige „Schatzkammer wandert nicht mit" wäre falsch gewesen —
// und hätte zu einer unnötigen Sicherung geführt.
wahr("der Korpus wandert mit", p.find((x) => x.key === "divergenz_persistent_corpus_v1")!.wandert);
wahr("die Schatzkammer wandert mit — trotz REST_AUSNAHME",
  p.find((x) => x.key === "dm_treasury_v1")!.wandert);
ist("ein fremder Schlüssel wandert nicht", p.find((x) => x.key === "fremder_schluessel")!.wandert, false);
for (const k of ["divergenz_settings_v1", "divergenz_live_pools_v1", "dm_knobs_v1", "dm_umwelt_v1"]) {
  wahr(`„${k}" wandert mit`, schluesselePosten([[k, "x"]])[0]!.wandert);
}

// Und die Gegenprobe an der Quelle: Die drei Ausnahmen müssen in `project.ts`
// wirklich über eigene Felder gesichert werden. Stünden sie nirgends, wäre die
// Anzeige oben eine Lüge.
const proj = readFileSync("src/features/project.ts", "utf8");
for (const [name, feld] of [["Schatzkammer", "treasury:"], ["Einstellungen", "settings:"], ["Live-Pools", "livePools:"]]) {
  wahr(`${name} hat ein eigenes Feld in der Projektdatei`, proj.includes(feld!));
}
// Und die Präfixe müssen übereinstimmen — zwei Listen, die dasselbe meinen,
// laufen auseinander.
wahr("die Präfixe stimmen mit project.ts überein",
  /REST_PRAEFIX = \["dm_", "divergenz_"\]/.test(proj));

// ── Ergebnis ────────────────────────────────────────────────────────────────
console.log(`Prüfstand Speicher — ${geprueft} Prüfungen:`);
zeilen.forEach((z) => console.log(z));
const proc = globalThis as unknown as { process?: { exit: (c: number) => void } };
if (fails.length) {
  console.error(`\n❌ ${fails.length} Fehler beim Speicher:`);
  fails.forEach((f) => console.error("  - " + f));
  proc.process?.exit(1);
} else {
  console.log(`\n✅ Speicher: alle ${geprueft} Prüfungen bestanden.`);
}
