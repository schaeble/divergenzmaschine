// Video/Multi-Shot: Shot-Beschreibungen + Sequenz-Text.
import type { StoryKit, Bank } from "../types";
import { TONE_DATA } from "./tone.data";
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";

import { loadDramaData } from "./dramaturgie";
import { normWhere } from "./ctxnorm";
import { guessGender } from "./declension";
import { atomisiere } from "../atoms/atomisieren";
import { loadKnobs } from "../features/knobs";
import { satzPlausibel } from "./satzwaechter";
import { praesensUmschreiben } from "./coherence";
import { hatFinitesVerb } from "../atoms/derive";
import { loadActiveBankLabel } from "../wordbank";

export const clampShotCount = (n: number): number => Math.max(3, Math.min(10, Number.isFinite(n) ? n : 5));
export const clampTotalSec = (n: number): number => Math.max(3, Math.min(600, Number.isFinite(n) ? n : 15));
const fmtSec = (x: number): string => { if (!isFinite(x)) return "0s"; const v = Math.round(x * 10) / 10; return (v % 1 === 0 ? v.toFixed(0) : String(v)) + "s"; };
const stripTailPunct = (s: string): string => clean(s).replace(/[.!?…]+$/, "");

function normalizePlace(W: string): string {
  const w = clean(W);
  if (!w) return "an einem Ort";
  // Der Kontext-Normalisierer kennt Genus und Kasus („Urbane Straße mit
  // Graffiti-Wand" → „auf einer urbanen Straße …"); gemeldet war „An einem
  // Urbane Straße".
  const n = normWhere(w);
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter|an|zwischen|neben)\b/i.test(n)) return n;
  // „Urbane Straße mit Graffiti-Wand" — Adjektiv + Nomen ohne Artikel (so
  // kommen Orte aus den Sequenz-Vorlagen): Genus aus dem Nomen, das Adjektiv
  // in die schwache Form, die Präposition nach dem Ort — „auf einer urbanen
  // Straße mit Graffiti-Wand".
  const m = n.match(/^([A-ZÄÖÜ][a-zäöüß]+?)(e|er|es|en|em)\s+([A-ZÄÖÜ][a-zäöüß-]+)(.*)$/);
  if (m) {
    const g = guessGender(m[3]!);
    if (g) {
      const art = g === "f" ? "einer" : "einem";
      const prep = /(straße|platz|markt|hof|feld|weg|gasse|brücke|bahnhof|dach|insel|bühne)$/i.test(m[3]!) ? "auf" : "in";
      return `${prep} ${art} ${m[1]!.toLowerCase()}en ${m[3]}${m[4] || ""}`;
    }
  }
  return "an einem " + n;
}

// ── Shot als Bildszene (Umbau 4.343.0) ─────────────────────────────────────
// Gemeldet: Multi-Shot produziert zu schwache Sequenzen — zu kurz, wenig
// ausdrucksstark, zu wenig bildhaft. Vorher war ein Shot ein Bogen-Satz plus
// zwei englische Kameraangaben („cold blue light. slow push-in (50mm).") —
// eine Liste, kein Bild.
//
// Jetzt hat jeder Shot fünf Sichtplätze, in fester Ordnung, jeder aus dem
// Stoff des Presets:
//   BILD      eine Nominalphrase — das, was man sieht (Bilder der Wortbank,
//             Mitte des Bogens).
//   BEWEGUNG  ein Hauptsatz mit der Figur — das, was geschieht (Haken,
//             Wende, Veränderung; an den Gelenken der Bogen: Einstieg im
//             ersten Shot, Höhepunkt in der Mitte, Schluss im letzten).
//   NAH       eine Requisite als Detail — „Nah: eine Uhr ohne Zeiger."
//   LICHT     Licht und Luft auf Deutsch, aus dem Ton gefärbt.
//   SCHNITT   der Übergang zum nächsten Shot — nur zwischen Shots.
// Der Längenregler bestimmt, wie viele Plätze je Shot gefüllt werden (drei bis
// alle fünf, dazu Ton-Sätze), nicht, wie viele Kameraangaben nachgelegt werden.
// Die Kameraangabe steht als eigene Zeile unter dem Bild („KAMERA: …"), damit
// die Anweisung vom Bild getrennt bleibt.
const LICHT: string[] = [
  "Kaltes Blau liegt auf allem", "Ein Neonlicht flackert, ohne Rhythmus", "Natriumlicht, gelb und schwer", "Gegenlicht, die Figur nur als Rand",
  "Mondlicht durch Dunst", "Ein bewölkter Tag ohne Schatten", "Staub steht im Licht", "Feiner Nebel auf Kniehöhe", "Schnee treibt durch den Raum",
  "Kondenswasser läuft an einer Scheibe", "Das Licht kommt von unten", "Ein einziger Lichtstreifen teilt den Raum", "Die Farben sind aus dem Bild gewaschen",
  "Ein Bild, das langsam nachdunkelt", "Glanz auf nassem Stein", "Die Luft körnig wie Film",
];
const SCHNITT: string[] = [
  "Schnitt.", "Harter Schnitt.", "Die Kamera bleibt, das Bild geht.", "Schwarz, einen Atemzug lang.", "Überblendung ins Nächste.",
  "Der Ton läuft weiter, das Bild nicht.", "Schnitt auf das Detail.", "Schnitt, ohne dass sich etwas ändert.", "Das Bild reißt.",
];
const KAMERA: string[] = [
  "Statische Einstellung, 35 mm", "Langsame Fahrt hinein, 50 mm", "Langsame Fahrt zurück, 24 mm", "Handkamera, leichtes Zittern", "Von oben, driftend",
  "Makro, 100 mm", "Weitwinkel aus Bodenhöhe, 18 mm", "Steadicam, folgend", "Verkantet, 15 Grad", "Schärfe wandert von vorn nach hinten",
  "Kran abwärts", "Aus der Sicht des Gegenstands",
];

function buildVideoShots(kit: StoryKit, shotCount: number, lenTarget = 0, bank?: Bank, tone = "neutral"): { shots: string[]; kamera: string[] } {
  const place = normalizePlace(kit.W);
  const who = kit.P;
  const bogen = loadDramaData();
  // Vorräte je Sichtplatz — aus Bank und Bogen, gemischt, ohne Wiederholung.
  // Gemeldet (Sequenz „Wohnungslos"): Material aus einem Zeitungstext brachte
  // Präteritum, halbe Zitate, 20-Wort-Sätze und Satzfetzen als Requisiten.
  // Darum wird jeder Vorrat vor dem Bau gesäubert: atomisiert (Stellschraube
  // Atomgröße), ins Präsens gebracht, durch den Satz-Wächter geprüft; eine
  // Requisite muss eine Nominalphrase sein (kein finites Verb, kein „oder").
  const atomMax = loadKnobs().atomgroesse;
  const s = (a: string[] | undefined): string[] => {
    if (!Array.isArray(a)) return [];
    const out: string[] = [];
    for (const roh of a) {
      if (!roh) continue;
      for (const t of atomisiere(stripTailPunct(roh), atomMax)) {
        const u = praesensUmschreiben(t);
        if (!u.ok) continue;
        const x = stripTailPunct(u.text);
        if (x.split(/\s+/).length < 2 || !satzPlausibel(x + ".")) continue;
        out.push(x);
      }
    }
    return out;
  };
  const istNP = (x: string): boolean => !hatFinitesVerb(x) && !/^(oder|und|aber|doch|denn)\b/i.test(x) && !/[»«„“"!?]/.test(x) && x.split(/\s+/).length <= 9;
  const bilder = reihenfolge([...s(bank?.motifs), ...s(bogen?.mitte)]);
  // Mit Schlagfolge sind die Veränderungen des Bogens für den Schlag „wende"
  // reserviert — sonst zog ein früherer BEWEGUNG-Platz sie weg, und die Wende
  // fiel auf die Bank zurück.
  const mitFolge = !!(bogen?.folge && bogen.folge.length);
  const bewegungen = reihenfolge([...s(bank?.hooks), ...s(bank?.turns), ...(mitFolge ? [] : s(bogen?.veraenderungen))]);
  const requisiten = reihenfolge([...s(bank?.props), ...s(bogen?.ausloeser)].filter(istNP));
  const hindernisse = reihenfolge([...s(bank?.obstacles)]);
  const ton = TONE_DATA[tone]?.flavor ? reihenfolge([...TONE_DATA[tone]!.flavor]) : [];
  const licht = reihenfolge(LICHT);
  const kamera = reihenfolge(KAMERA);
  const benutzt = new Set<string>();
  // Die Requisite des ersten Bildes („nahe einer Lampe") zählt als benutzt —
  // sonst stand sie gleich darauf noch einmal als „Nah: eine Lampe".
  for (const x of [kit.prop, kit.propDat, kit.propAcc]) if (x) benutzt.add(stripTailPunct(x).toLowerCase().replace(/^(einen|einem|einer|eine|ein)\s/, "ein "));
  const norm = (y: string): string => y.toLowerCase().replace(/^(einen|einem|einer|eine|ein)\s/, "ein ");
  // Ist nichts Frisches mehr da, gilt der Rückfall nur EINMAL — danach fällt
  // der Sichtplatz aus (leerer Text). Gemeldet: derselbe Rückfall-Satz stand
  // sechsmal in einer Sequenz.
  const zieh = (liste: string[], fallback: string): string => {
    const x = liste.find((y) => !benutzt.has(norm(y)));
    // Auch der Rückfall (ein Baustein aus dem Kit) geht durch die Säuberung —
    // sonst kam „Da, der Flohzirkus!«, flüstert Neumeier" als Haken herein.
    if (!x) { const f = s([fallback || ""])[0] || ""; if (!f || benutzt.has(norm(f))) return ""; benutzt.add(norm(f)); return f; }
    benutzt.add(norm(x));
    return x;
  };
  // Ein Sichtplatz ohne Text fällt aus.
  const setze = (teile: string[], text: string): void => { if (text && text.replace(/[^A-Za-zÄÖÜäöüß]/g, "").length > 2) teile.push(text); };
  // Wie viele Plätze je Shot? Der Längenregler entscheidet: bei 110 Wörtern
  // Ziel drei Plätze (Bild, Bewegung, Nah), bei 200 alle fünf, ab 260 dazu
  // ein Ton-Satz und ein zweites Bild.
  const proShot = lenTarget > 0 ? lenTarget / shotCount : 30;
  const stufe = proShot < 26 ? 1 : proShot < 40 ? 2 : proShot < 55 ? 3 : 4;
  // „Nah:" verlangt den Nominativ — Requisiten stehen in der Bank oft im
  // Akkusativ („einen Schlüssel"), weil die Rahmen sie so brauchen.
  const nominativ = (x: string): string => x.replace(/^einen\s/i, (m) => m[0] === "E" ? "Ein " : "ein ").replace(/^den\s/i, (m) => m[0] === "D" ? "Der " : "der ");

  // Dramaturgie-Bogen mit Schlagfolge (4.343.1): Trägt der Bogen eine Folge
  // (Erzählerbank-Bauform oder „eigen"), wird sie auf die Shots verteilt —
  // jeder Shot bekommt seine Schläge in der Reihenfolge der Bauform.
  // „Katastrophe zuerst" beginnt mit dem Höhepunkt im ersten Shot,
  // „Rückwärts" mit dem Schluss; der Kreisschluss kehrt im letzten Shot zum
  // Einstieg zurück. Ohne Folge gilt die feste Gelenk-Verteilung wie bisher.
  const folge = bogen?.folge && bogen.folge.length ? bogen.folge : null;
  const schlaegeJeShot: string[][] = Array.from({ length: shotCount }, () => []);
  if (folge) folge.forEach((sch, idx) => { schlaegeJeShot[Math.min(shotCount - 1, Math.floor((idx * shotCount) / folge.length))]!.push(sch); });
  const schlagSatz = (sch: string): string | null => {
    const B = bogen!;
    switch (sch) {
      case "einstieg": return s(B.einstieg).length ? `${cap(zieh(s(B.einstieg), kit.hook))}.` : null;
      case "hook": return `${cap(zieh(bewegungen, kit.hook))}.`;
      case "regel": return s(B.regeln).length ? `Regel: ${zieh(s(B.regeln), "")}.` : null;
      case "mitte": case "mitte2": return s(B.mitte).length ? `${cap(zieh(s(B.mitte), kit.motif))}.` : null;
      case "konflikt": return s(B.konflikte).length ? `Es geht um ${zieh(s(B.konflikte), kit.stake)}.` : `${cap(zieh(hindernisse, kit.obstacle))}.`;
      case "ausloeser": return s(B.ausloeser).length ? `Nah: ${nominativ(zieh(s(B.ausloeser), kit.prop))}.` : null;
      case "wende": return s(B.veraenderungen).length ? `Etwas kippt: ${zieh(s(B.veraenderungen), kit.turn)}.` : `${cap(zieh(bewegungen, kit.turn))}.`;
      case "zeit": return s(B.zeitanomalien).length ? `${cap(zieh(s(B.zeitanomalien), ""))}.` : null;
      case "hoehepunkt": return s(B.hoehepunkt).length ? `${cap(zieh(s(B.hoehepunkt), kit.turn))}.` : null;
      case "einsatz": return `${cap(stripTailPunct(kit.stake))}.`;
      case "schluss": return s(B.schluss).length && s(B.schluss)[0]!.split(/\s+/).length >= 4 ? `${cap(zieh(s(B.schluss), kit.ending))}.` : `${cap(stripTailPunct(kit.ending))}.`;
      default: return null;
    }
  };

  const shots: string[] = [];
  const kameras: string[] = [];
  for (let i = 0; i < shotCount; i++) {
    const erster = i === 0, letzter = i === shotCount - 1, mitte = i === Math.floor(shotCount / 2);
    const teile: string[] = [];
    // BILD
    if (erster) { const p0 = stripTailPunct(kit.propDat || kit.prop); teile.push(istNP(p0) ? `${cap(place)}: ${who} nahe ${p0}.` : `${cap(place)}: ${who}.`); }
    const bild = zieh(bilder, stripTailPunct(kit.motif));
    if ((!erster || stufe >= 2) && bild) setze(teile, `${cap(bild)}.`);
    // BEWEGUNG — mit Schlagfolge: die Schläge dieses Shots; sonst an den Gelenken der Bogen
    if (folge && schlaegeJeShot[i]!.length) {
      const saetze = schlaegeJeShot[i]!.map(schlagSatz).filter((x): x is string => !!x && !/:\s*\.$/.test(x) && !/^(Nah|Regel|Es geht um|Etwas kippt)[: ]+\.$/.test(x) && x.replace(/[^A-Za-zÄÖÜäöüß]/g, "").length > 3);
      if (saetze.length) teile.push(...saetze.slice(0, stufe >= 3 ? 3 : 2));
      else { const b = zieh(bewegungen, kit.hook); if (b) setze(teile, `${cap(b)}.`); }
    }
    else if (erster && bogen && s(bogen.einstieg).length) { const b = zieh(s(bogen.einstieg), kit.hook); if (b) setze(teile, `${cap(b)}.`); }
    else if (mitte && bogen && s(bogen.hoehepunkt).length) { const b = zieh(s(bogen.hoehepunkt), kit.turn); if (b) setze(teile, `${cap(b)}.`); }
    else if (letzter) teile.push(`${cap(stripTailPunct(kit.ending))}.`);
    else { const b = zieh(bewegungen, kit.hook); if (b) setze(teile, `${cap(b)}.`); }
    // NAH
    if (stufe >= 1 && !letzter && !teile.some((t) => t.startsWith("Nah: "))) { const r = zieh(requisiten, istNP(stripTailPunct(kit.prop)) ? stripTailPunct(kit.prop) : ""); if (r) setze(teile, `Nah: ${nominativ(r)}.`); }
    // HINDERNIS im vorletzten Drittel
    if (stufe >= 2 && !erster && !letzter && hindernisse.length && i >= Math.floor(shotCount / 3)) { const h = zieh(hindernisse, kit.obstacle); if (h) setze(teile, `${cap(h)}.`); }
    // LICHT
    if (stufe >= 2) { const l = zieh(licht, ""); if (l) setze(teile, `${l}.`); }
    // TON und zweites Bild bei hoher Länge
    if (stufe >= 3 && ton.length) { const t = zieh(ton, ""); if (t) setze(teile, ensurePunct(t).trim()); }
    if (stufe >= 4) { const b2 = zieh(bilder, ""); if (b2) setze(teile, `${cap(b2)}.`); }
    if (letzter) teile.push(`Nur ${pick(["der Riss", "das Fenster", "die Karte", "das Licht"])} bleibt sichtbar.`);
    // SCHNITT
    if (!letzter) teile.push(zieh(SCHNITT, "") || "Schnitt.");
    shots.push(teile.filter(Boolean).join(" "));
    kameras.push(zieh(kamera, "Statische Einstellung, 35 mm"));
  }
  return { shots, kamera: kameras };
}

/** Zufaellige Reihenfolge ohne die Vorlage zu veraendern. */
function reihenfolge<T>(a: T[]): T[] {
  const x = a.slice();
  for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j]!, x[i]!]; }
  return x;
}

export function buildVideoSequenceText(kit: StoryKit, shotCount = 5, totalSec = 15, lenTarget = 0, bank?: Bank, tone = "neutral"): string {
  const n = clampShotCount(shotCount);
  const total = clampTotalSec(totalSec);
  const dur = total / n;
  // F.2: Die Textmenge je Shot folgt dem Laengenregler. Die Shot-ZAHL bleibt am
  // eigenen Regler - sie ist eine Angabe fuer den Schnitt, keine Textlaenge.
  const { shots, kamera } = buildVideoShots(kit, n, lenTarget, bank, tone);
  // Kopfzeile: zuerst das Preset, dann der Modus. Vorher stand dort NUR der
  // Modus - und der ist eine Einstellung, kein Titel: Wer ihn fest eingestellt
  // hat, las in jeder Sequenz dieselbe Zeile ("Intime Koerperwahrnehmung"), ohne
  // zu erfahren, aus welchem Stoff sie gebaut ist.
  const titel = [loadActiveBankLabel(), kit.mode.label].filter(Boolean).join(" · ");
  const out = [`SEQUENZ — ${titel}`.trim(), `WER: ${kit.PRaw || kit.P}`, `WO: ${kit.W}`, `WANN: ${kit.T}`, `WAS: ${kit.A}`, `GESAMTLÄNGE: ${fmtSec(total)} • ${fmtSec(dur)} pro Shot`, ""];
  for (let i = 0; i < shots.length; i++) { out.push(`Shot ${i + 1} (${fmtSec(dur)})`, `DE: ${shots[i]}`, `KAMERA: ${kamera[i]}.`, ""); }
  return out.join("\n");
}
