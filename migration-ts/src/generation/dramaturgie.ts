// Phase 3: datengetriebener Dramaturgie-Struktur-Bauer. Liest den Erzählbogen eines
// aktiven Preset 2.0 (einstieg → mitte → höhepunkt → schluss, plus transformation/
// konflikte/zeitanomalien/regeln) und baut den Text entlang dieses Bogens — offline.
import type { StoryKit } from "../types";
import { pick, chance, ensurePunct, clean } from "../text-utils";
import { cap, joinBeats, frameTurn, reframeStake } from "./beats";

export interface DramaData {
  einstieg: string[]; mitte: string[]; hoehepunkt: string[]; schluss: string[];
  ausloeser: string[]; veraenderungen: string[]; konflikte: string[]; zeitanomalien: string[]; regeln: string[];
  /** Schlagfolge: die Reihenfolge der Schläge, als Namen. Fehlt sie, gilt die
   *  Standardfolge (steigender Bogen). Namen dürfen mehrfach vorkommen — der
   *  Schlag zieht dann jeweils frisches Material. Siehe SCHLAG_STANDARD. */
  folge?: string[];
}
const DKEY = "dm_dramaturgie_v1";

export function setDramaData(d: DramaData | null): void {
  try { if (d) localStorage.setItem(DKEY, JSON.stringify(d)); else localStorage.removeItem(DKEY); } catch { /* voll */ }
}
// Weiche für die Erzählerbank: Ein gesetzter Override gilt VOR dem
// gespeicherten Preset-Bogen — für alle Verbraucher (Struktur Dramaturgie,
// Rekombination, Video, Schliff) gleichermaßen. Das Studio setzt ihn vor
// jeder Erzeugung aus der Erzählerbank-Wahl und räumt ihn bei „aus Preset"
// ab; der gespeicherte Bogen bleibt unangetastet.
let bogenOverride: DramaData | null = null;
export function setBogenOverride(d: DramaData | null): void { bogenOverride = d; }
export function loadDramaData(): DramaData | null {
  if (bogenOverride) return bogenOverride;
  try { const r = localStorage.getItem(DKEY); return r ? (JSON.parse(r) as DramaData) : null; } catch { return null; }
}
export function hasDramaData(): boolean {
  const d = loadDramaData();
  return !!(d && (d.einstieg.length || d.mitte.length || d.hoehepunkt.length || d.veraenderungen.length));
}

const some = (a: string[] | undefined): boolean => Array.isArray(a) && a.length > 0;

/** Die Standardfolge — der steigende Bogen, wie er immer gebaut wurde. */
export const SCHLAG_STANDARD = ["einstieg", "hook", "regel", "mitte", "mitte2", "konflikt", "ausloeser", "wende", "zeit", "hoehepunkt", "einsatz", "schluss"];

/** Zulässige Schlagnamen — für die Prüfung einer gespeicherten Folge. */
export const SCHLAG_NAMEN = new Set([...SCHLAG_STANDARD]);

export function buildDramaturgie(kit: StoryKit): string {
  const d = loadDramaData();
  const M = kit.mode;

  // Jeder Schlag ist ein Bauplan; die FOLGE bestimmt, in welcher Reihenfolge
  // gebaut wird. Ein Name darf mehrfach vorkommen — pick() zieht dann
  // frisches Material aus derselben Liste. Ein leerer Schlag fällt aus.
  // So schlagen die Bauformen der Erzählerbank wirklich durch: „Katastrophe
  // zuerst" beginnt mit dem Höhepunkt, „Kreisschluss" kehrt am Ende zum
  // Einstieg zurück, der „Stille Bogen" verzichtet auf Wende und Höhepunkt.
  // Kein Bogen-Satz zweimal im selben Text — gemeldet: „ein Absender ohne
  // Namen, eine Schrift wie seine eigene" stand in zwei Nachbarsätzen. Jede
  // Ziehung merkt sich, was schon steht; ist eine Liste aufgebraucht, fällt
  // der Schlag aus — ein fehlender Schlag liest sich besser als ein
  // wiederholter Satz. (Der Kreisschluss braucht darum mindestens zwei
  // Einstiege, sonst bleibt die Wiederkehr weg.)
  // Verglichen wird NORMALISIERT (klein, ohne Schlusszeichen): Derselbe
  // Wortlaut kann aus zwei Quellen kommen — Bogen-Auslöser und Bank-Wende —
  // und unterscheidet sich dann nur in Großschreibung oder Punkt.
  const norm = (x: string): string => clean(x).toLowerCase().replace(/[.!?…]+$/, "");
  const benutzt = new Set<string>();
  const zieh = (liste: string[]): string => {
    const frisch = liste.filter((x) => !benutzt.has(norm(x)));
    if (!frisch.length) return "";
    const wahl = pick(frisch);
    benutzt.add(norm(wahl));
    return wahl;
  };
  // Für Schläge mit Zeit-Formel („Dann, unvermittelt:", „Und dann:") keinen
  // Satz, der selbst mit einem Zeitwort beginnt — gemeldet: „Dann,
  // unvermittelt: Davor wartet er drei Tage neben dem Briefkasten." Gibt es
  // nur solche, fällt die Formel weg und der Satz steht bloß.
  const ZEITKOPF = /^(davor|danach|dann|plötzlich|auf einmal|am ende|am anfang|zurück bleibt|und dann|zuerst|zuletzt|schließlich)\b/i;
  const ziehOhneZeitkopf = (liste: string[]): { satz: string; nackt: boolean } => {
    const ohne = liste.filter((x) => !ZEITKOPF.test(x) && !benutzt.has(norm(x)));
    if (ohne.length) { const wahl = pick(ohne); benutzt.add(norm(wahl)); return { satz: wahl, nackt: false }; }
    return { satz: zieh(liste), nackt: true };                   // "" wenn aufgebraucht
  };
  const schlag = (name: string, erster: boolean): string => {
    switch (name) {
      case "einstieg": {
        if (!(d && some(d.einstieg))) return erster ? `${cap(kit.T)} ${kit.W} bemerkt ${kit.P} ${kit.hookAcc}.` : "";
        if (!erster) { const z = zieh(d.einstieg); return z ? `${cap(z)}.` : ""; }
        const z = zieh(d.einstieg) || pick(d.einstieg);
        // Beginnt das Wann selbst mit einem Nebensatz („Nachdem die letzte
        // Grenze fiel, als die Zeitungen schwiegen"), trägt das Fragment
        // „Wann Wo." keinen Satz — gemeldet: „… schwiegen hoch in der Luft."
        // Dann hängt der Einstiegssatz mit Gedankenstrich an und schließt ihn.
        if (/^(nachdem|als|während|bevor|sobald|seit|seitdem|kaum|wenn|ehe)\b/i.test(clean(kit.T)))
          return `${cap(kit.T)} ${kit.W} — ${z.charAt(0).toLowerCase()}${z.slice(1).replace(/[.!?…]+$/, "")}.`;
        return `${cap(kit.T)} ${kit.W}. ${cap(z)}.`;
      }
      case "hook": return cap(ensurePunct(kit.hook));
      case "regel": { const z = d && some(d.regeln) && chance(0.7) ? zieh(d.regeln) : ""; return z ? cap(ensurePunct(z)) : ensurePunct(pick(M.rules)); }
      case "mitte": { const z = d && some(d.mitte) ? zieh(d.mitte) : ""; return z ? `${cap(z)}.` : ""; }
      case "mitte2": { const z = d && some(d.mitte) && d.mitte.length > 1 && chance(0.6) ? zieh(d.mitte) : ""; return z ? `${cap(z)}.` : ""; }
      case "konflikt": {
        const konf = d && some(d.konflikte) ? zieh(d.konflikte) : "";  // "" → Rahmen unten
        return konf ? `Es geht um ${konf}.` : `${kit.P} ${kit.AleadVerb || (kit.AisInfinitiveLed ? "will" : "sucht")} ${kit.Apure}, aber ${kit.obstacle}.`;
      }
      case "ausloeser": {
        if (!(d && some(d.ausloeser))) return "";
        const { satz, nackt } = ziehOhneZeitkopf(d.ausloeser);
        if (!satz) return "";
        return nackt ? cap(ensurePunct(satz)) : `Dann, unvermittelt: ${cap(satz)}.`;
      }
      case "wende": {
        // Auch der Rückfall auf die Bank-Wende zählt als benutzt — steht ihr
        // Wortlaut schon (etwa weil der Bogen denselben Satz als Auslöser
        // trug), fällt der Schlag aus statt zu wiederholen.
        const kern = (d && some(d.veraenderungen) ? zieh(d.veraenderungen) : "") || (benutzt.has(norm(kit.turn)) ? "" : kit.turn);
        if (!kern) return "";
        benutzt.add(norm(kern));
        return frameTurn(kern);
      }
      case "zeit": { const z = d && some(d.zeitanomalien) && chance(0.4) ? zieh(d.zeitanomalien) : ""; return z ? cap(ensurePunct(z)) : ""; }
      case "hoehepunkt":
        if (!(d && some(d.hoehepunkt))) return "";
        // Am Anfang trägt der Höhepunkt keine „Und dann"-Formel — dort IST er
        // der Anfang („Katastrophe zuerst").
        if (erster) { const z = zieh(d.hoehepunkt); return z ? `${cap(z)}.` : ""; }
        const { satz, nackt } = ziehOhneZeitkopf(d.hoehepunkt);
        if (!satz) return "";
        return nackt ? cap(ensurePunct(satz)) : `Und dann: ${cap(satz)}.`;
      case "einsatz": return reframeStake(kit.stake);
      case "schluss": return ensurePunct(kit.ending);
      default: return "";
    }
  };

  const folge = (d?.folge && d.folge.length && d.folge.every((n) => SCHLAG_NAMEN.has(n))) ? d.folge : SCHLAG_STANDARD;
  const beats: string[] = [];
  for (const name of folge) {
    const b = schlag(name, beats.length === 0);
    if (b) beats.push(b);
  }
  return joinBeats(beats, kit.P);
}
