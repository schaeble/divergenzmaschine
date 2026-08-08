#!/usr/bin/env node
/**
 * dm-normalize.mjs — Divergenzmaschine: Normalisierung von `stakes` und `props`
 *
 * Behebt zwei Datenprobleme in den Preset-Wortbänken:
 *
 *   1) stakes-Schema: 12 der 51 Presets liefern nackte Nominalphrasen
 *      ("ein freier Nachmittag") statt ganzer Sätze ("Der Einsatz ist Mut.").
 *      ft() matcht nur auf /^Der Einsatz ist/ und reicht die NP sonst roh
 *      durch — sie landet dann in Verb-Objekt-Slots.
 *
 *   2) props-Kasus: Requisiten werden im Akkusativ eingesetzt. Maskuline
 *      Einträge stehen aber teils im Nominativ ("ein Kompass" statt
 *      "einen Kompass"). Nur Maskulina sind betroffen — "eine" (fem.) und
 *      "ein" (neutr.) sind in Nom. und Akk. identisch.
 *
 * Konvention wie beim Knopf "Präteritum → Präsens": eindeutige Fälle werden
 * umgeschrieben, unsichere bleiben stehen und werden nur gemeldet.
 *
 * Aufruf:
 *   node dm-normalize.mjs <datei>                  # nur Bericht
 *   node dm-normalize.mjs <datei> --out fixed.json # korrigierte Presets als JSON
 *   node dm-normalize.mjs <datei> --inplace        # Datei direkt patchen (Backup .bak)
 *
 * <datei> darf sein:
 *   - eine .json-Datei mit dem Preset-Objekt
 *   - eine .ts/.js/.html-Datei, die das Objekt als Literal enthält
 *     (wird per Klammer-Matching gefunden und ausgewertet)
 *
 * --inplace ersetzt ausschließlich exakte String-Literale ("alt" -> "neu")
 * und ist damit auch auf dem gebauten Bundle sicher.
 */

import { readFileSync, writeFileSync, copyFileSync } from "node:fs";

const CATS = ["motifs", "hooks", "props", "turns", "obstacles", "stakes", "endings"];

/* ------------------------------------------------------------------ */
/* Wortlisten                                                          */
/* ------------------------------------------------------------------ */

// Maskuline Kopfnomen -> "ein" muss zu "einen" werden.
const MASKULIN = new Set(`
Anhänger Anker Ausweis Becher Beutel Bleistift Bogen Brief Briefumschlag
Besen Zauberbesen Dolch Draht Eimer Kohleneimer Faden Glücksfaden Federkiel
Fingerhut Frachtbrief Gehstock Gebetsteppich Griff Schwertgriff Hammer
Handschuh Handspiegel Helm Hirtenstab Hut Kalender Kelch Kiesel Kieselstein
Kleidersack Knopf Perlmuttknopf Koffer Reisekoffer Kompass Korb Marktkorb
Kranz Krug Laib Brotlaib Lederbeutel Leuchter Kerzenleuchter Liebesbrief
Löffel Holzlöffel Mantel Notizblock Block Passierschein Schein Ring Siegelring
Rosenkranz Sack Seesack Schal Wollschal Schirm Regenschirm Schlüssel
Schlüsselbund Schuh Clownsschuh Sextant Schiffssextant Sporn Spiegel
Taschenspiegel Stab Wanderstab Hirtenstab Stein Stummel Zigarettenstummel
Talar Teppich Topf Blumentopf Umschlag Vermerk Wecker Wanderstock Stock
Zettel Einkaufszettel Zweig Ölzweig Rahmen Krug Satz Faden Fächer Kamm
Trapezhaken Haken Sender Funksender Satellit Meteorit Kristall Karton Samen Speicher Knoten Detektor Kanten Schein Motor
Schalter Lichtschalter Plan Grundrissplan Blumenstrauß Strauß Laib Kamm Fächer
`.trim().split(/\s+/));

// Schwache Maskulina (n-Deklination): Akkusativ endet auf -en
// ("den Sextanten"). Nicht automatisch anfassen — nur melden.
const N_DEKLINATION = new Set("Sextant Schiffssextant Präsident Elefant Diamant Planet Komet Satellit Automat Soldat Bote Hirte Zeuge Riese Erbe Kollege Junge Bauer Nachbar Herr Mensch Held Fürst Graf Prinz Narr Bär Affe Löwe Hase Rabe".split(/\s+/));

// Neutra/Feminina, die häufig als Kopf auftreten -> "ein"/"eine" ist korrekt.
// Dient nur dazu, den "unsicher"-Bericht kurz zu halten.
const BEKANNT_OK = new Set(`
Amulett Anatomiebuch Archiv Band Maßband Seidenband Bild Blatt Herbariumblatt
Notenblatt Buch Logbuch Kontobuch Tagebuch Protokollheft Heft Dokument Fell
Lammfell Schafsfell Fenster Fernrohr Messingfernrohr Foto Formular Gewehr
Glas Reagenzglas Kartenspiel Kleid Kabel Manuskript Medaillon Messer
Taschenmesser Mikroskop Modell Architekturmodell Notizbuch Pergament Plakat
Protokoll Register Ruder Segel Seil Tauwerk Siegel Skalpell Spektrometer
Stück Tuch Taschentuch Teleskop Terminal Diagramm Skelett Schloss Papier
Netz Tor Zelt Fahrrad Telefon Radio Taschenradio Instrument Werkzeug
Ticket Tablet Handy Smartphone Emoji Hoodie Tau Fernglas Holzkreuz Kreuz
Seekartenfragment Fragment Flakon Wappen Eisen Horn Brett Kissen Ei Feuerzeug Zeug Amulett Pendel
`.trim().split(/\s+/));

/* ------------------------------------------------------------------ */
/* Preset-Objekt aus beliebiger Datei holen                            */
/* ------------------------------------------------------------------ */

function istPresetObjekt(o) {
  if (!o || typeof o !== "object" || Array.isArray(o)) return false;
  const werte = Object.values(o);
  if (!werte.length) return false;
  return werte.some(
    (v) => v && typeof v === "object" && CATS.some((c) => Array.isArray(v[c]))
  );
}

function ladePresets(text, dateiname) {
  if (/\.json$/i.test(dateiname)) {
    const o = JSON.parse(text);
    if (istPresetObjekt(o)) return o;
    // ggf. verschachtelt (z. B. Projekt-Export)
    for (const v of Object.values(o)) if (istPresetObjekt(v)) return v;
    throw new Error("Kein Preset-Objekt in der JSON-Datei gefunden.");
  }

  // Quelldatei/Bundle: Klammern matchen ab jedem "= {" und prüfen
  const kandidaten = [];
  const re = /=\s*\{/g;
  let m;
  while ((m = re.exec(text))) {
    const start = m.index + m[0].length - 1;
    const ende = klammerEnde(text, start);
    if (ende < 0) continue;
    const literal = text.slice(start, ende + 1);
    if (literal.length < 500) continue;
    if (!/["']?motifs["']?\s*:/.test(literal)) continue;   // presets.data.ts benutzt gequotete Schluessel
    try {
      const o = eval("(" + literal + ")");
      if (istPresetObjekt(o)) kandidaten.push(o);
    } catch { /* kein gültiges Literal — weiter */ }
  }
  if (!kandidaten.length) throw new Error("Kein Preset-Objekt in der Datei gefunden.");
  // grösstes Objekt gewinnt (die Preset-Sammlung, nicht ein Einzel-Preset)
  return kandidaten.sort((a, b) => Object.keys(b).length - Object.keys(a).length)[0];
}

function klammerEnde(s, start) {
  let tiefe = 0, i = start, str = null;
  for (; i < s.length; i++) {
    const c = s[i];
    if (str) {
      if (c === "\\") i++;
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { str = c; continue; }
    if (c === "{") tiefe++;
    else if (c === "}") { tiefe--; if (!tiefe) return i; }
  }
  return -1;
}

/* ------------------------------------------------------------------ */
/* Regel 1 — stakes: NP -> Satz                                        */
/* ------------------------------------------------------------------ */

const IST_EINSATZ_SATZ = /^Der Einsatz ist\b/i;

// Nach ft() entstehen u. a. "Es geht um X" (Akkusativ!) und
// "Auf dem Spiel steht X" (Nominativ). Ein maskuliner Artikel im NP
// bricht die Akkusativ-Variante -> melden.
function istMaskulinePhrase(np) {
  if (/^der\s/i.test(np)) return true;            // eindeutig
  if (!/^ein\s/i.test(np)) return false;          // "eine"/"das"/"die" unkritisch
  const tokens = np.split(/\s+/);
  const kopf = kopfNomen(tokens);
  if (!kopf) return false;
  const g = genus(kopf.wort);
  if (g === "m" || g === "schwach") return true;
  // Adjektiv auf -er vor dem Kopf = maskulin
  return tokens.slice(1, kopf.pos).some((w) => /^[a-zäöüß]+er$/.test(w));
}

function normalisiereStakes(presets) {
  const aenderungen = [];
  const hinweise = [];

  for (const [key, preset] of Object.entries(presets)) {
    const liste = preset.stakes;
    if (!Array.isArray(liste)) continue;

    liste.forEach((eintrag, idx) => {
      const t = String(eintrag).trim();
      if (!t || IST_EINSATZ_SATZ.test(t)) return;

      // Bereits ein vollständiger Satz anderer Bauart? Dann nur Punkt sichern.
      const hatSchluss = /[.!?…]$/.test(t);
      const wirktWieSatz = /^[A-ZÄÖÜ]/.test(t) && hatSchluss;
      if (wirktWieSatz) {
        hinweise.push({ preset: key, kat: "stakes", text: t, grund: "eigenständiger Satz, kein Einsatz-Schema — unangetastet" });
        return;
      }

      const kern = t.replace(/[.!?…]+$/, "");
      const neu = `Der Einsatz ist ${kern}.`;
      aenderungen.push({ preset: key, kat: "stakes", idx, alt: t, neu });

      if (istMaskulinePhrase(kern)) {
        hinweise.push({
          preset: key, kat: "stakes", text: neu,
          grund: 'maskuliner Artikel — ft()-Variante "Es geht um …" verlangt Akkusativ',
        });
      }
    });
  }
  return { aenderungen, hinweise };
}

/* ------------------------------------------------------------------ */
/* Regel 2 — props: Nominativ -> Akkusativ (nur Maskulina)             */
/* ------------------------------------------------------------------ */

// Deutsche Komposita werden vom letzten Glied bestimmt: Seiden|faden = der Faden.
// Diminutive auf -chen/-lein sind immer neutrum.
function genus(wort) {
  if (/(chen|lein)$/.test(wort)) return "n";
  if (MASKULIN.has(wort)) return "m";
  if (N_DEKLINATION.has(wort)) return "schwach";
  if (BEKANNT_OK.has(wort)) return "n";
  const klein = wort.toLowerCase();
  const passt = (menge) => {
    for (const kandidat of menge) {
      if (kandidat.length < 4) continue;
      if (klein.length > kandidat.length && klein.endsWith(kandidat.toLowerCase())) return true;
    }
    return false;
  };
  if (passt(MASKULIN)) return "m";
  if (passt(N_DEKLINATION)) return "schwach";
  if (passt(BEKANNT_OK)) return "n";
  return null;
}

function kopfNomen(tokens) {
  // erstes grossgeschriebenes Wort nach dem Artikel ist der Kopf:
  // "ein vergilbter Liebesbrief" -> Liebesbrief
  // "ein Schlüssel ohne Schloss" -> Schlüssel   (nicht Schloss)
  for (let i = 1; i < tokens.length; i++) {
    if (/^[A-ZÄÖÜ]/.test(tokens[i])) return { wort: tokens[i].replace(/[^\wÄÖÜäöüß-]/g, ""), pos: i };
  }
  return null;
}

function normalisiereProps(presets) {
  const aenderungen = [];
  const hinweise = [];

  for (const [key, preset] of Object.entries(presets)) {
    const liste = preset.props;
    if (!Array.isArray(liste)) continue;

    liste.forEach((eintrag, idx) => {
      const t = String(eintrag).trim();
      if (!/^ein\s/.test(t)) return; // "eine"/"einen" sind bereits korrekt

      const tokens = t.split(/\s+/);
      const kopf = kopfNomen(tokens);
      if (!kopf) return;

      // Eindeutiges Signal: Adjektiv auf -er vor dem Kopf = maskulin Nominativ
      const adjektivMaskulin = tokens
        .slice(1, kopf.pos)
        .some((w) => /^[a-zäöüß]+er$/.test(w));

      const g = genus(kopf.wort);

      if (g === "schwach") {
        hinweise.push({ preset: key, kat: "props", text: t, grund: `"${kopf.wort}" ist schwach dekliniert — Akkusativ auf -en, von Hand setzen` });
        return;
      }

      const istMaskulin = g === "m" || adjektivMaskulin;

      if (!istMaskulin) {
        if (g === null) {
          hinweise.push({ preset: key, kat: "props", text: t, grund: `Genus von "${kopf.wort}" unbekannt — unangetastet` });
        }
        return;
      }

      const neuTokens = tokens.slice();
      neuTokens[0] = "einen";
      for (let i = 1; i < kopf.pos; i++) {
        if (/^[a-zäöüß]+er$/.test(neuTokens[i])) {
          neuTokens[i] = neuTokens[i].replace(/er$/, "en");
        }
      }
      const neu = neuTokens.join(" ");
      if (neu !== t) aenderungen.push({ preset: key, kat: "props", idx, alt: t, neu });
    });
  }
  return { aenderungen, hinweise };
}

/* ------------------------------------------------------------------ */
/* Ausgabe                                                             */
/* ------------------------------------------------------------------ */

function bericht(aenderungen, hinweise) {
  const nachKat = (k) => aenderungen.filter((a) => a.kat === k);

  for (const kat of ["stakes", "props"]) {
    const liste = nachKat(kat);
    console.log(`\n=== ${kat}: ${liste.length} Korrekturen ===`);
    let letztes = null;
    for (const a of liste) {
      if (a.preset !== letztes) { console.log(`\n  [${a.preset}]`); letztes = a.preset; }
      console.log(`    − ${a.alt}`);
      console.log(`    + ${a.neu}`);
    }
  }

  if (hinweise.length) {
    console.log(`\n=== ${hinweise.length} Fälle zur Handprüfung (unverändert) ===`);
    for (const h of hinweise) {
      console.log(`  [${h.preset}/${h.kat}] ${h.text}`);
      console.log(`      → ${h.grund}`);
    }
  }

  console.log(`\nSumme: ${aenderungen.length} automatische Korrekturen, ${hinweise.length} Hinweise.`);
}

/* ------------------------------------------------------------------ */
/* Hauptlauf                                                           */
/* ------------------------------------------------------------------ */

const args = process.argv.slice(2);
const datei = args.find((a) => !a.startsWith("--"));
const outIdx = args.indexOf("--out");
const outDatei = outIdx >= 0 ? args[outIdx + 1] : null;
const inplace = args.includes("--inplace");

if (!datei) {
  console.error("Aufruf: node dm-normalize.mjs <datei> [--out fixed.json] [--inplace]");
  process.exit(1);
}

const roh = readFileSync(datei, "utf8");
const presets = ladePresets(roh, datei);
console.log(`${Object.keys(presets).length} Presets gelesen aus ${datei}`);

const s = normalisiereStakes(presets);
const p = normalisiereProps(presets);
const aenderungen = [...s.aenderungen, ...p.aenderungen];
const hinweise = [...s.hinweise, ...p.hinweise];

bericht(aenderungen, hinweise);

if (outDatei) {
  const kopie = JSON.parse(JSON.stringify(presets));
  for (const a of aenderungen) kopie[a.preset][a.kat][a.idx] = a.neu;
  writeFileSync(outDatei, JSON.stringify(kopie, null, 2), "utf8");
  console.log(`\nKorrigierte Presets geschrieben: ${outDatei}`);
}

if (inplace) {
  copyFileSync(datei, datei + ".bak");
  let text = roh;
  let ersetzt = 0, verfehlt = [];
  // eindeutige String-Literale ersetzen; identische Einträge in mehreren
  // Presets bekommen dieselbe Korrektur, daher global ersetzen
  const paare = new Map();
  for (const a of aenderungen) paare.set(a.alt, a.neu);
  for (const [alt, neu] of paare) {
    let getroffen = false;
    for (const q of ['"', "'", "`"]) {
      const suche = q + alt + q;
      if (text.includes(suche)) {
        text = text.split(suche).join(q + neu + q);
        getroffen = true;
      }
    }
    if (getroffen) ersetzt++; else verfehlt.push(alt);
  }
  writeFileSync(datei, text, "utf8");
  console.log(`\n${ersetzt} von ${paare.size} Literalen ersetzt. Backup: ${datei}.bak`);
  if (verfehlt.length) {
    console.log("Nicht gefunden (Literal anders geschrieben oder gesplittet):");
    verfehlt.forEach((v) => console.log("  " + v));
  }
}
