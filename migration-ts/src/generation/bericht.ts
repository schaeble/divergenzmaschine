// Form „Bericht" — Gerüstschema „Zeitungsbericht" (Pilot).
//
// Der Bericht ist die erste Form, die NICHT aus dem Vorrat erzählt, sondern aus
// einem Faktenblatt referiert. Der Unterschied ist grundsätzlich: Die anderen
// Formen dürfen sich widersprechen, ein Bericht nicht.
//
// Prinzip: umgekehrte Pyramide. Erst das Wichtigste (Vorspann), dann der
// Hergang, dann Zitat, Hintergrund und Ausblick.

import type { Bank, GenInput } from "../types";
import { pick } from "../text-utils";
import { cap } from "./beats";

import { ziehFaktenblatt, erlaubteZahlen, ALLE_NAMEN, type Faktenblatt, type FbPerson } from "../features/faktenblatt";
import { buildVersAtome } from "../atoms/rekombination";

/** Erst- und Zweitnennung: Wer schon eingeführt ist, wird nur noch kurz genannt. */
class Buchfuehrung {
  private drin = new Set<string>();
  person(p: FbPerson): string {
    if (this.drin.has(p.id)) return p.kurz;
    this.drin.add(p.id);
    return `${p.rolle} ${p.name}`;
  }
  eingefuehrt(p: FbPerson): boolean { return this.drin.has(p.id); }
  organisation(fb: Faktenblatt): string {
    if (this.drin.has("wer")) return fb.wer.kurz;
    this.drin.add("wer");
    return fb.wer.haupt;
  }
}

/** Ein Satz aus dem Vorrat, der keine Ziffer enthält — Zahlen kommen NUR aus
 *  dem Faktenblatt, sonst bricht die Konsistenzprüfung. */
function satzOhneZahl(bank: Bank, kats: (keyof Bank)[], benutzt: Set<string>, zusatz: string[] = []): string | null {
  const kandidaten: string[] = [];
  for (const k of kats) for (const x of bank[k] || []) {
    if (/\d/.test(x)) continue;
    if (benutzt.has(x)) continue;
    kandidaten.push(x);
  }
  // Zusatzvorrat aus den Atomen: Zehn Eintraege je Kategorie reichen fuer einen
  // kurzen Bericht, nicht fuer einen langen - bei Ziel 400 blieb es sonst bei
  // 66 Prozent der Marke, weil kein Satz mehr uebrig war.
  for (const x of zusatz) {
    if (/\d/.test(x) || benutzt.has(x)) continue;
    kandidaten.push(x);
  }
  if (!kandidaten.length) return null;
  const s = pick(kandidaten);
  benutzt.add(s);
  return s.replace(/[.!?…]+$/, "");
}

function schlagzeile(fb: Faktenblatt): string {
  // Ohne Artikel am Anfang, ohne Zahl — Zeitungskonvention und zugleich die
  // Regel, an der sich die Prüfung festmacht.
  const wer = fb.wer.haupt.replace(/^(der|die|das)\s+/i, "");
  return cap(`${wer} ${fb.was}`);
}

function dachzeile(fb: Faktenblatt): string {
  return `${fb.wo.ort} · ${cap(fb.wer.art === "organisation" ? "Wirtschaft" : "Vermischtes")}`;
}

function vorspann(fb: Faktenblatt, b: Buchfuehrung): string {
  const z = fb.zahlen[0];
  const s1 = `${cap(b.organisation(fb))} ${fb.was}.`;
  const s2 = z
    ? `${cap(fb.wann.datum)} wurde bekannt, dass ${z.verbal || z.wortform} ${z.einheit} betroffen sind.`
    : `${cap(fb.wann.datum)} wurde der Schritt in ${fb.wo.ort} bekannt.`;
  return `${s1} ${s2}`;
}

function hergang(fb: Faktenblatt, bank: Bank, b: Buchfuehrung, benutzt: Set<string>, extra: number, vorrat: string[]): string {
  const teile: string[] = [];
  const c2 = fb.chronologie[1], c3 = fb.chronologie[2];
  if (c2) teile.push(`${cap(c2.zeit)} zeichnete sich ${c2.was} ab.`);
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["obstacles", "turns"], benutzt, vorrat);
    if (roh) teile.push(`${cap(roh)}.`);
  }
  const z2 = fb.zahlen[1];
  if (z2) teile.push(`Nach Angaben aus ${fb.wo.ort} geht es um ${z2.wortform} ${z2.einheit}.`);
  if (c3) teile.push(`${cap(c3.zeit)} folgte der Schritt, über den ${b.organisation(fb)} nun informiert.`);
  const a1 = fb.abgeleitet[0];
  if (a1) teile.push(`Betroffen ist damit ${a1.label} — ${a1.wortform}.`);
  return teile.join(" ");
}

function zitat(fb: Faktenblatt, bank: Bank, b: Buchfuehrung, benutzt: Set<string>, welche: number, vorrat: string[]): string {
  const p = fb.personen[welche];
  if (!p || !p.zitierfaehig) return "";
  const kern = satzOhneZahl(bank, ["hooks", "stakes"], benutzt, vorrat) || "Wir haben lange gewartet";
  return `„${cap(kern)}“, sagte ${b.person(p)}.`;
}

function hintergrund(fb: Faktenblatt, bank: Bank, b: Buchfuehrung, benutzt: Set<string>, extra: number, vorrat: string[]): string {
  const teile: string[] = [];
  const c1 = fb.chronologie[0];
  if (c1) teile.push(`${cap(b.organisation(fb))} besteht seit ${c1.zeit}.`);
  const rahmen = ["Im Ort verbindet man damit", "Erinnert wird an", "Geblieben ist"];
  for (let i = 0; i < 1 + extra; i++) {
    const roh = satzOhneZahl(bank, ["motifs", "props"], benutzt, vorrat);
    if (roh) teile.push(`${rahmen[i % rahmen.length]} ${roh}.`);
  }
  // Die dritte Zahl nur nennen, wenn sie sich zaehlen laesst: "Zuletzt waren es
  // 9 Stunden" stand im Bericht und bedeutete nichts.
  const z3 = fb.zahlen[2];
  if (z3 && ZAEHLBAR.test(z3.einheit)) teile.push(`Gezaehlt wurden zuletzt ${z3.wortform} ${z3.einheit}.`);
  return teile.join(" ");
}

function ausblick(fb: Faktenblatt): string {
  // Kein neuer Fakt — nur eine offene Frage oder ein Termin. Deshalb greift der
  // Abschnitt ausschliesslich auf bereits Genanntes zurueck.
  return pick([
    `Wie es in ${fb.wo.ort} weitergeht, ist offen.`,
    `Ob der Schritt zurückgenommen wird, blieb ${fb.wann.relativ} unbeantwortet.`,
    `Eine Entscheidung soll in den kommenden Tagen fallen.`,
  ]);
}

// Einheiten, von denen sich sinnvoll sagen laesst, dass sie "gezaehlt wurden".
const ZAEHLBAR = /^(Beschäftigte|Haushalte|Anwohner|Arbeitsplätze|Unterschriften|Anträge)$/;

export interface BerichtErgebnis { text: string; fb: Faktenblatt; hergang: string; }

export function buildBericht(bank: Bank, input: GenInput): BerichtErgebnis {
  const fb = ziehFaktenblatt(input);
  const b = new Buchfuehrung();
  const benutzt = new Set<string>();
  // Laengenregler: Das Geruest steht fest, die Zahl der erzaehlenden Saetze nicht.
  // Ein Bericht ohne Zusatz traegt rund 124 Woerter. Der Faktor ist gemessen und
  // nicht geschaetzt: Eine Zusatzrunde bringt ueber alle Presets rund 15 Woerter
  // - mit dem ersten Schaetzwert 26 blieb die Marke bei 78 Prozent, mit 15 lag sie
  // rund zehn Prozent darueber. 17 trifft.
  const ziel = Number.isFinite(input.lenTarget as number) ? (input.lenTarget as number) : 240;
  const extra = Math.max(0, Math.min(22, Math.round((ziel - 124) / 17)));
  const vorrat = buildVersAtome(bank, input);

  const abschnitte: string[] = [];
  abschnitte.push(dachzeile(fb));
  abschnitte.push(schlagzeile(fb));
  abschnitte.push(vorspann(fb, b));
  const hergangText = hergang(fb, bank, b, benutzt, extra, vorrat);
  abschnitte.push(hergangText);
  const z1 = zitat(fb, bank, b, benutzt, 0, vorrat);
  if (z1) abschnitte.push(z1);
  abschnitte.push(hintergrund(fb, bank, b, benutzt, extra, vorrat));
  const z2 = zitat(fb, bank, b, benutzt, 1, vorrat);
  if (z2) abschnitte.push(z2);
  // Einordnung ist im Schema optional - sie kommt dazu, wenn Platz da ist, und
  // bringt laut Regel KEINE neue Zahl.
  if (extra >= 3) {
    const teile: string[] = [];
    for (let i = 0; i < extra - 2; i++) {
      const roh = satzOhneZahl(bank, ["turns", "obstacles", "motifs"], benutzt, vorrat);
      if (roh) teile.push(`${cap(roh)}.`);
    }
    if (teile.length) abschnitte.push(`Zur Einordnung: ${teile.join(" ")}`);
  }
  abschnitte.push(ausblick(fb));

  const kasten = [
    `Faktenkasten`,
    ...fb.zahlen.map((z) => `· ${z.wortform} ${z.einheit}`),
    ...fb.chronologie.map((c) => `· ${c.zeit}: ${c.was}`),
  ].join("\n");

  return { text: abschnitte.filter(Boolean).join("\n\n") + "\n\n" + kasten, fb, hergang: hergangText };
}

// ── Konsistenzprüfung (offline, nach dem Rendern) ─────────────────────────
// Vier billige Prüfungen, die den Löwenanteil der typischen Berichtsfehler
// abfangen. Sie prüfen das ERGEBNIS, nicht die Absicht — ein Bericht, der sie
// besteht, kann immer noch langweilig sein, aber er widerspricht sich nicht.

export interface BerichtMangel { art: string; stelle: string; }

export function pruefeBericht(text: string, fb: Faktenblatt, hergang = ""): BerichtMangel[] {
  const m: BerichtMangel[] = [];
  const erlaubtZ = new Set(erlaubteZahlen(fb));

  // 1. Jede Ziffernfolge muss aus dem Faktenblatt stammen.
  // Satzzeichen abschneiden: "210." ist die Zahl 210 am Satzende, nicht eine
  // unbekannte Zahl "210.". Der erste Versuch meldete 408 solcher Scheinfunde.
  for (const roh of text.match(/\d[\d.,]*/g) || []) {
    const z = roh.replace(/[.,]+$/, "");
    if (!erlaubtZ.has(z)) m.push({ art: "Zahl ohne Faktenblatt", stelle: z });
  }

  // 2. Kein fremder PERSONENNAME. Nicht "jeder Eigenname": properNames haelt im
  //    Deutschen zwangslaeufig auch Gattungsnamen fuer Namen - der erste Versuch
  //    meldete 1856 Funde, darunter "Wirtschaft". Geprueft wird deshalb gegen den
  //    Ziehvorrat: Steht ein Name aus dem Vorrat im Text, der nicht im
  //    Faktenblatt dieses Berichts vorkommt, ist er hereingerutscht.
  const drin = new Set(fb.personen.flatMap((p) => [p.kurz.toLowerCase(), ...p.name.toLowerCase().split(/\s+/)]));
  for (const name of ALLE_NAMEN) {
    if (drin.has(name.toLowerCase())) continue;
    if (new RegExp("(?<![A-Za-zÄÖÜäöüß])" + name + "(?![A-Za-zÄÖÜäöüß])").test(text)) {
      m.push({ art: "fremder Personenname", stelle: name });
    }
  }

  // 3. Jedes Zitat braucht einen Sprecher, der zitierfähig UND eingeführt ist.
  const zitate = text.match(/„[^“]*“,\s*sagte\s+([^.]+)\./g) || [];
  for (const z of zitate) {
    const wer = (z.match(/sagte\s+([^.]+)\./) || [])[1] || "";
    const p = fb.personen.find((x) => wer.includes(x.kurz) || wer.includes(x.name));
    if (!p) m.push({ art: "Zitat ohne bekannten Sprecher", stelle: wer.trim() });
    else if (!p.zitierfaehig) m.push({ art: "Sprecher nicht zitierfähig", stelle: p.name });
  }

  // 4. Chronologie monoton — aber NUR im Hergang. Über den ganzen Bericht wäre
  //    die Prüfung falsch gedacht: Die umgekehrte Pyramide nennt das jüngste
  //    Ereignis zuerst (Vorspann) und geht im Hintergrund bis zur Gründung
  //    zurück. Genau das ist die Form, kein Fehler. Erzählt wird der Reihe nach
  //    allein im Hergang, und dort gilt die Monotonie.
  if (hergang) {
    // Klein vergleichen: Der Abschnitt schreibt die Zeitmarke am Satzanfang gross
    // ("Im Frühjahr"), im Faktenblatt steht sie klein. Mit indexOf auf die Rohform
    // lieferte die Prüfung durchweg -1 und meldete deshalb nie etwas - eine
    // Prüfung, die immer besteht, ist keine.
    const hgLow = hergang.toLowerCase();
    const pos = fb.chronologie.map((c) => ({ id: c.id, at: hgLow.indexOf(c.zeit.toLowerCase()) })).filter((x) => x.at >= 0);
    for (let i = 1; i < pos.length; i++) {
      if (pos[i]!.at < pos[i - 1]!.at) {
        m.push({ art: "Chronologie im Hergang nicht monoton", stelle: `${pos[i - 1]!.id} nach ${pos[i]!.id}` });
        break;
      }
    }
  }
  return m;
}
