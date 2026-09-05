// Video/Multi-Shot: Shot-Beschreibungen + Sequenz-Text.
import type { StoryKit, Bank } from "../types";
import { TONE_DATA } from "./tone.data";
import { pick, clean, ensurePunct } from "../text-utils";
import { cap } from "./beats";

import { loadDramaData } from "./dramaturgie";
import { loadActiveBankLabel } from "../wordbank";

export const clampShotCount = (n: number): number => Math.max(3, Math.min(10, Number.isFinite(n) ? n : 5));
export const clampTotalSec = (n: number): number => Math.max(3, Math.min(600, Number.isFinite(n) ? n : 15));
const fmtSec = (x: number): string => { if (!isFinite(x)) return "0s"; const v = Math.round(x * 10) / 10; return (v % 1 === 0 ? v.toFixed(0) : String(v)) + "s"; };
const stripTailPunct = (s: string): string => clean(s).replace(/[.!?…]+$/, "");

function normalizePlace(W: string): string {
  const w = clean(W);
  if (!w) return "an einem Ort";
  if (/^(im|am|in|auf|bei|unter|über|vor|hinter)\b/i.test(w)) return w;
  return "an einem " + w;
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
  const s = (a: string[] | undefined): string[] => (Array.isArray(a) ? a.filter(Boolean).map(stripTailPunct) : []);
  // Vorräte je Sichtplatz — aus Bank und Bogen, gemischt, ohne Wiederholung.
  const bilder = reihenfolge([...s(bank?.motifs), ...s(bogen?.mitte)]);
  const bewegungen = reihenfolge([...s(bank?.hooks), ...s(bank?.turns), ...s(bogen?.veraenderungen)]);
  const requisiten = reihenfolge([...s(bank?.props), ...s(bogen?.ausloeser)]);
  const hindernisse = reihenfolge([...s(bank?.obstacles)]);
  const ton = TONE_DATA[tone]?.flavor ? reihenfolge([...TONE_DATA[tone]!.flavor]) : [];
  const licht = reihenfolge(LICHT);
  const kamera = reihenfolge(KAMERA);
  const benutzt = new Set<string>();
  // Die Requisite des ersten Bildes („nahe einer Lampe") zählt als benutzt —
  // sonst stand sie gleich darauf noch einmal als „Nah: eine Lampe".
  for (const x of [kit.prop, kit.propDat, kit.propAcc]) if (x) benutzt.add(stripTailPunct(x).toLowerCase().replace(/^(einen|einem|einer|eine|ein)\s/, "ein "));
  const norm = (y: string): string => y.toLowerCase().replace(/^(einen|einem|einer|eine|ein)\s/, "ein ");
  const zieh = (liste: string[], fallback: string): string => {
    const x = liste.find((y) => !benutzt.has(norm(y)));
    if (!x) return fallback;
    benutzt.add(norm(x));
    return x;
  };
  // Wie viele Plätze je Shot? Der Längenregler entscheidet: bei 110 Wörtern
  // Ziel drei Plätze (Bild, Bewegung, Nah), bei 200 alle fünf, ab 260 dazu
  // ein Ton-Satz und ein zweites Bild.
  const proShot = lenTarget > 0 ? lenTarget / shotCount : 30;
  const stufe = proShot < 26 ? 1 : proShot < 40 ? 2 : proShot < 55 ? 3 : 4;
  // „Nah:" verlangt den Nominativ — Requisiten stehen in der Bank oft im
  // Akkusativ („einen Schlüssel"), weil die Rahmen sie so brauchen.
  const nominativ = (x: string): string => x.replace(/^einen\s/i, (m) => m[0] === "E" ? "Ein " : "ein ").replace(/^den\s/i, (m) => m[0] === "D" ? "Der " : "der ");

  const shots: string[] = [];
  const kameras: string[] = [];
  for (let i = 0; i < shotCount; i++) {
    const erster = i === 0, letzter = i === shotCount - 1, mitte = i === Math.floor(shotCount / 2);
    const teile: string[] = [];
    // BILD
    if (erster) teile.push(`${cap(place)}: ${who} nahe ${stripTailPunct(kit.propDat || kit.prop)}.`);
    const bild = zieh(bilder, stripTailPunct(kit.motif));
    if (!erster || stufe >= 2) teile.push(`${cap(bild)}.`);
    // BEWEGUNG — an den Gelenken der Bogen
    if (erster && bogen && s(bogen.einstieg).length) teile.push(`${cap(zieh(s(bogen.einstieg), kit.hook))}.`);
    else if (mitte && bogen && s(bogen.hoehepunkt).length) teile.push(`${cap(zieh(s(bogen.hoehepunkt), kit.turn))}.`);
    else if (letzter) teile.push(`${cap(stripTailPunct(kit.ending))}.`);
    else teile.push(`${cap(zieh(bewegungen, kit.hook))}.`);
    // NAH
    if (stufe >= 1 && !letzter) teile.push(`Nah: ${nominativ(zieh(requisiten, stripTailPunct(kit.prop)))}.`);
    // HINDERNIS im vorletzten Drittel
    if (stufe >= 2 && !erster && !letzter && hindernisse.length && i >= Math.floor(shotCount / 3)) teile.push(`${cap(zieh(hindernisse, kit.obstacle))}.`);
    // LICHT
    if (stufe >= 2) teile.push(`${zieh(licht, "Ein bewölkter Tag ohne Schatten")}.`);
    // TON und zweites Bild bei hoher Länge
    if (stufe >= 3 && ton.length) teile.push(ensurePunct(zieh(ton, "")).trim());
    if (stufe >= 4) teile.push(`${cap(zieh(bilder, stripTailPunct(kit.motif)))}.`);
    if (letzter) teile.push(`Nur ${pick(["der Riss", "das Fenster", "die Karte", "das Licht"])} bleibt sichtbar.`);
    // SCHNITT
    if (!letzter) teile.push(zieh(SCHNITT, "Schnitt."));
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
